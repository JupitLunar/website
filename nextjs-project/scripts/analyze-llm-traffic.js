const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeLLMTraffic() {
    console.log('🤖 Analyzing LLM Bot Traffic & Usage...');
    console.log('----------------------------------------');

    // Fetch AI events (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: events, error } = await supabase
        .from('analytics_events')
        .select('*')
        .in('event_type', ['ai_bot_crawl', 'ai_referral'])
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching events:', error);
        return;
    }

    if (!events || events.length === 0) {
        console.log('No AI tracking events found in the last 30 days.');
        console.log('Ensure you have visited the site to trigger middleware logging.');
        return;
    }

    // Aggregate Data
    const botStats = {};
    const referralStats = {};
    const pathStats = {};

    events.forEach(event => {
        const data = event.event_data;

        // Bot Crawls
        if (event.event_type === 'ai_bot_crawl') {
            const botName = data.bot_name || 'Unknown Bot';
            botStats[botName] = (botStats[botName] || 0) + 1;
        }

        // AI Referrals
        if (event.event_type === 'ai_referral') {
            const source = data.referrer_source || 'Unknown Source';
            referralStats[source] = (referralStats[source] || 0) + 1;
        }

        // Most visited paths by AI
        const path = data.path || '/';
        pathStats[path] = (pathStats[path] || 0) + 1;
    });

    // Display Results
    console.log('\n🕷️  AI Bot Crawlers (Last 30 Days):');
    if (Object.keys(botStats).length === 0) console.log('   No bot traffic detected.');
    Object.entries(botStats)
        .sort(([, a], [, b]) => b - a)
        .forEach(([bot, count]) => console.log(`   - ${bot}: ${count} visits`));

    console.log('\n🔗 AI Referrals (Citations/Usage):');
    if (Object.keys(referralStats).length === 0) console.log('   No AI referrals detected (e.g. from Perplexity, ChatGPT).');
    Object.entries(referralStats)
        .sort(([, a], [, b]) => b - a)
        .forEach(([source, count]) => console.log(`   - ${source}: ${count} visitors`));

    console.log('\n📄 Top Content Read by AI:');
    Object.entries(pathStats)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .forEach(([path, count]) => console.log(`   - ${path}: ${count} reads`));

    console.log('\n----------------------------------------');
}

analyzeLLMTraffic();
