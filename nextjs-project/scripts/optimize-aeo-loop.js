const { createClient } = require('@supabase/supabase-js');
const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;
const RULES_PATH = path.resolve(__dirname, '../config/aeo-generation-rules.json');

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}

if (!openaiApiKey) {
    console.warn('⚠️ Missing OpenAI API Key - Skipping LLM qualitative analysis, will rely on stats only.');
}

const supabase = createClient(supabaseUrl, supabaseKey);
const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;

async function optimizeAEORules() {
    console.log('🔄 Starting AEO Optimization Loop...');
    console.log('----------------------------------------');

    // 1. Fetch Top Performing Content (Last 30 Days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: events, error } = await supabase
        .from('analytics_events')
        .select('*')
        .in('event_type', ['ai_bot_crawl', 'ai_referral'])
        .gte('created_at', thirtyDaysAgo.toISOString());

    if (error) {
        console.error('Error fetching analytics:', error);
        return;
    }

    if (!events || events.length === 0) {
        console.log('⚠️  No AI traffic data found yet. Keeping existing rules.');
        return;
    }

    // 2. Aggregate Data by Path
    const pathScores = {};
    events.forEach(event => {
        const path = event.event_data?.path;
        if (!path) return;

        // Weighted scoring: Referrals (actual usage) counts 5x more than a crawl
        const score = event.event_type === 'ai_referral' ? 5 : 1;
        pathScores[path] = (pathScores[path] || 0) + score;
    });

    // Get Top 3 Articles (Limited to 3 to save tokens for LLM analysis)
    const topPaths = Object.entries(pathScores)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([path]) => path);

    console.log(`📈 Analyzing Top ${topPaths.length} Performing Paths:`);
    console.log(topPaths);

    if (topPaths.length === 0) return;

    // 3. Fetch Article Details for Top Paths
    const slugs = topPaths.map(p => p.split('/').pop());

    const { data: articles } = await supabase
        .from('articles')
        .select('title, one_liner, body_md, keywords')
        .in('slug', slugs);

    if (!articles || articles.length === 0) {
        console.log('⚠️  Could not find article data for top paths.');
        return;
    }

    // 4. Quantitative Analysis (Stats)
    let totalFaqs = 0;
    let hasQuickAnswer = 0;

    articles.forEach(article => {
        // Check FAQs (stored in keywords usually as __AEO_FAQS__)
        const faqs = article.keywords?.find(k => k.startsWith('__AEO_FAQS__'));
        if (faqs) {
            try {
                const parsed = JSON.parse(faqs.replace('__AEO_FAQS__', ''));
                totalFaqs += parsed.length;
            } catch (e) { }
        }

        // Check Quick Answer
        const qa = article.keywords?.some(k => k.startsWith('__AEO_QUICK__'));
        if (qa) hasQuickAnswer++;
    });

    const avgFaqs = Math.round(totalFaqs / articles.length);
    const quickAnswerRate = hasQuickAnswer / articles.length;

    console.log('\n🔍 Quantitative Insights:');
    console.log(`   - Avg FAQs: ${avgFaqs}`);
    console.log(`   - Quick Answer Rate: ${(quickAnswerRate * 100).toFixed(0)}%`);

    const currentRules = require(RULES_PATH);
    let rulesChanged = false;

    // Update Stats-Based Rules
    if (avgFaqs > currentRules.rules.faqs.min_count) {
        console.log(`💡 Stats Optimization: Increasing min FAQs to ${avgFaqs}`);
        currentRules.rules.faqs.min_count = avgFaqs;
        currentRules.rules.faqs.max_count = Math.max(currentRules.rules.faqs.max_count, avgFaqs + 3);
        rulesChanged = true;
    }
    if (quickAnswerRate > 0.8 && !currentRules.rules.quick_answer.required) {
        console.log(`💡 Stats Optimization: Enforcing Quick Answers strictly.`);
        currentRules.rules.quick_answer.required = true;
        rulesChanged = true;
    }

    // 5. Qualitative Analysis (LLM)
    if (openai) {
        console.log('\n🧠 Running LLM Qualitative Analysis...');

        // Prepare minimal context for the LLM
        // We strip out heavy HTML content, keeping only structure/headers and meta info
        const analyzedContent = articles.map(a => ({
            title: a.title,
            one_liner: a.one_liner,
            // Extract only h2 headers to give structure context without tokens overhead
            structure_headers: (a.body_md || '').match(/<h2.*?>(.*?)<\/h2>/g)?.map(h => h.replace(/<\/?h2.*?>/g, '')) || []
        }));

        try {
            const completion = await openai.chat.completions.create({
                model: 'gpt-4o-mini', // Use intelligent model for analysis
                messages: [
                    {
                        role: 'system',
                        content: `You are an AEO (Answer Engine Optimization) Analyst. 
The following articles are the top-performing content on our site, favored by AI bots (GPTBot, ClaudeBot, etc.).
Analyze their metadata and structural patterns. Identify ONE specific, actionable writing style or structural pattern that likely contributed to their success.`
                    },
                    {
                        role: 'user',
                        content: `Top Performing Articles:
${JSON.stringify(analyzedContent, null, 2)}

Task: Suggest a single "latest_ai_insight" string. This must be a specific instruction for future content generation to mimic this success.
Examples: 
- "Start every section with a bolded summary sentence"
- "Include a 'Who is this for' section"
- "Use more direct, robotic-friendly sentence structures in the Quick Answer"

Return JSON: { "latest_ai_insight": "your instruction here" }`
                    }
                ],
                response_format: { type: 'json_object' },
                temperature: 0.5,
                max_tokens: 300
            });

            const result = JSON.parse(completion.choices[0].message.content);
            if (result.latest_ai_insight) {
                console.log(`💡 LLM Insight: "${result.latest_ai_insight}"`);

                // Only update if it's new
                if (currentRules.rules.latest_ai_insight !== result.latest_ai_insight) {
                    currentRules.rules.latest_ai_insight = result.latest_ai_insight;
                    rulesChanged = true;
                }
            }
        } catch (llmError) {
            console.error('⚠️ LLM Analysis failed:', llmError.message);
        }
    }

    if (rulesChanged) {
        currentRules.last_updated = new Date().toISOString();
        currentRules.updated_by = 'aeo_optimizer_bot_v2';

        fs.writeFileSync(RULES_PATH, JSON.stringify(currentRules, null, 2));
        console.log('\n✅ Rules updated successfully!');
    } else {
        console.log('\n✨ No significant rule changes needed.');
    }
}

// Run
optimizeAEORules();
