#!/usr/bin/env node

/**
 * 自动生成文章脚本
 * 1. 查找数据库中不存在的topic
 * 2. 使用OpenAI生成母婴相关的权威文章
 * 3. 检查重复内容
 * 4. 插入数据库
 */

const { createClient } = require('@supabase/supabase-js');
const { OpenAI } = require('openai');
const path = require('path');

// 加载环境变量
const dotenv = require('dotenv');
// Load env vars from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少Supabase环境变量');
  process.exit(1);
}

if (!openaiApiKey) {
  console.error('❌ 缺少OpenAI API Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({ apiKey: openaiApiKey });

// 导入主题列表
const { MATERNAL_INFANT_TOPICS } = require('./topics-list');

// 导入 trending topics 获取函数
const { fetchTrendingTopics } = require('./fetch-trending-topics');

/**
 * 生成slug
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

/**
 * 检查文章是否已存在
 */
async function articleExists(title) {
  const slug = generateSlug(title);
  
  // 检查slug
  const { data: slugMatch } = await supabase
    .from('articles')
    .select('id, title')
    .eq('slug', slug)
    .limit(1);

  if (slugMatch && slugMatch.length > 0) {
    return { exists: true, reason: 'Slug已存在', existingTitle: slugMatch[0].title };
  }

  // 检查标题相似度（简单检查）
  const { data: titleMatch } = await supabase
    .from('articles')
    .select('id, title')
    .ilike('title', `%${title.substring(0, 30)}%`)
    .limit(1);

  if (titleMatch && titleMatch.length > 0) {
    return { exists: true, reason: '标题相似', existingTitle: titleMatch[0].title };
  }

  return { exists: false };
}

/**
 * 获取数据库中已有的文章主题
 */
async function getExistingTopics() {
  const { data: articles, error } = await supabase
    .from('articles')
    .select('title, hub, type')
    .eq('status', 'published');

  if (error) {
    console.error('❌ 获取已有文章失败:', error);
    return [];
  }

  return articles || [];
}

/**
 * 查找缺失的主题
 */
async function findMissingTopics(filterHub = null) {
  const existingArticles = await getExistingTopics();
  const existingTitles = new Set(existingArticles.map(a => a.title.toLowerCase()));

  const missingTopics = MATERNAL_INFANT_TOPICS.filter(topic => {
    // 如果指定了hub，只返回该hub的主题
    if (filterHub && topic.hub !== filterHub) {
      return false;
    }
    
    // 检查是否已存在相似主题
    const topicLower = topic.topic.toLowerCase();
    const isMissing = !Array.from(existingTitles).some(title => 
      title.includes(topicLower) || topicLower.includes(title.substring(0, 20))
    );
    
    return isMissing;
  });

  return missingTopics;
}

/**
 * 使用OpenAI生成文章 - AEO优化版本
 * AEO (Answer Engine Optimization) for AI search engines like ChatGPT, Perplexity, Google AI Overview
 */
async function generateArticle(topicInfo) {
  console.log(`\n🤖 正在生成文章: ${topicInfo.topic}...`);

  const systemPrompt = `You are an expert content writer specializing in evidence-based maternal and infant health information. 
Your content is optimized for AI search engines (AEO - Answer Engine Optimization) and will be cited by ChatGPT, Perplexity, Google AI Overview, and Claude.

CRITICAL AUTHORITY REQUIREMENTS:
- ALL information MUST be based on official guidelines from CDC, AAP, WHO, or peer-reviewed research
- NEVER make up statistics, studies, or medical claims
- ALWAYS cite specific organizations: "According to the American Academy of Pediatrics (AAP)...", "The CDC recommends...", "WHO guidelines state..."
- Include evidence-based statements: "Studies show...", "Research indicates...", "Evidence suggests..."
- Add safety considerations and medical disclaimers in every article

Write a comprehensive, authoritative article in English about: "${topicInfo.topic}"

## AEO REQUIREMENTS (CRITICAL FOR AI CITATIONS):

1. **QUICK ANSWER** (First 2-3 sentences):
   - Start with a direct, concise answer to the main question
   - Use the format: "[Topic] involves/requires/means [direct answer]."
   - This snippet should be quotable by AI assistants

2. **Title**: Question-format when possible (e.g., "How to...", "What is...", "When should...")
   - 60-70 characters, include main keyword

3. **One-liner**: Direct answer in one sentence (50-200 characters)
   - Should directly answer the implied question

4. **Key Facts**: 5-8 bullet points, each starting with a verb or key stat
   - Format: "Evidence shows...", "Studies indicate...", "Experts recommend..."
   - Include specific numbers, percentages, or time frames when possible

5. **FAQ Section** (CRITICAL FOR AEO):
   - Generate 5-8 frequently asked questions related to the topic
   - Each answer should be 2-4 sentences, directly answering the question
   - Questions should be natural, how real parents would ask
   - Example: "At what age can babies start solid foods?" → "Most babies are ready for solid foods around 6 months..."

6. **Step-by-Step Guide** (when applicable):
   - If the topic is a "how-to", include numbered steps
   - Each step: title + 1-2 sentence explanation
   - Include estimated time if relevant

7. **Body Structure** (2500-4000 words in clean HTML - NOT Markdown):
   - Use <h2> for sections, <h3> for subsections, <p> for paragraphs
   - Use <ul>/<li> for lists, <strong> for emphasis
   - Structure:
     * <h2>Quick Answer</h2> (2-3 sentence direct answer - MOST IMPORTANT for AI citations)
     * <h2>What You Need to Know</h2> (overview)
     * <h2>Evidence-Based Guidelines</h2> (MANDATORY: cite CDC, AAP, WHO with specific recommendations)
     * <h2>Step-by-Step Guide</h2> (if applicable)
     * <h2>Common Questions Parents Ask</h2> (FAQ format inline)
     * <h2>Safety Considerations</h2> (MANDATORY: include safety warnings, risks, precautions)
     * <h2>When to Contact Your Pediatrician</h2> (MANDATORY: specific situations requiring medical attention)
     * <h2>The Bottom Line</h2> (summary with evidence-based conclusion)
   - DO NOT use Markdown syntax (no #, *, **, etc.)
   - Use semantic HTML tags only

8. **Citation Format** (MANDATORY - Every article must include):
   - Mention sources inline: "According to the American Academy of Pediatrics (AAP)..."
   - Use specific recommendations: "The CDC recommends..."
   - Include year when available: "2024 WHO guidelines suggest..."
   - Include evidence statements: "Studies published in [journal] indicate...", "Research shows that..."
   - Minimum 3-5 citations to CDC, AAP, or WHO in the body content

9. **Semantic Entities**: Include relevant medical/parenting entities for knowledge graph

10. **Age Range**: ${topicInfo.age_range}
11. **Hub**: ${topicInfo.hub}
12. **Type**: ${topicInfo.type}

Format your response as JSON (body_md must be HTML, NOT Markdown):
{
  "title": "Question-Format Article Title (How to / What is / When should)",
  "one_liner": "Direct one-sentence answer to the main question",
  "quick_answer": "2-3 sentence direct answer that AI can quote. Start with the key answer.",
  "key_facts": [
    "Evidence shows that [specific fact with number/timeframe] - cite source",
    "The AAP recommends [specific recommendation with context]",
    "Studies indicate [specific finding] - reference research when possible",
    "According to CDC guidelines, [specific guidance with safety note]",
    "WHO guidelines suggest [recommendation] for [age group]",
    "Research published in [journal/org] shows [finding]"
  ],
  "faqs": [
    {
      "question": "Natural parent question about the topic?",
      "answer": "Direct 2-4 sentence answer with evidence."
    },
    {
      "question": "Another common question?",
      "answer": "Direct answer with practical guidance."
    }
  ],
  "steps": [
    {
      "title": "Step title",
      "description": "1-2 sentence explanation"
    }
  ],
  "body_md": "<h2>Quick Answer</h2><p>[Direct answer here]</p><h2>What You Need to Know</h2><p>...</p>",
  "meta_title": "SEO title with question (60-70 chars)",
  "meta_description": "Direct answer to the question in 150-160 characters for search snippets",
  "keywords": ["primary keyword", "related keyword", "long-tail question keyword"],
  "entities": ["CDC", "AAP", "relevant medical terms", "age groups"],
  "sources": ["American Academy of Pediatrics", "Centers for Disease Control and Prevention", "World Health Organization"]
}

CRITICAL: The body_md field MUST be valid HTML (use <h2>, <p>, <ul>, <li>, <strong> tags), NOT Markdown syntax.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Write an authoritative, evidence-based article about: ${topicInfo.topic}. 
Ensure you cite CDC, AAP, or WHO guidelines at least 3-5 times throughout the article. 
Include safety considerations and medical disclaimers. 
All information must be factual and based on official health organization guidelines.` }
      ],
      temperature: 0.7, // Lower temperature for more factual, consistent content
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('OpenAI返回空内容');
    }

    const articleData = JSON.parse(content);
    
    // 验证必需字段
    if (!articleData.title || !articleData.body_md) {
      throw new Error('生成的文章缺少必需字段');
    }

    // 验证权威性和真实性
    const bodyText = articleData.body_md.toLowerCase();
    const hasAAP = bodyText.includes('aap') || bodyText.includes('american academy of pediatrics');
    const hasCDC = bodyText.includes('cdc') || bodyText.includes('centers for disease control');
    const hasWHO = bodyText.includes('who') || bodyText.includes('world health organization');
    const hasGuidelines = bodyText.includes('guidelines') || bodyText.includes('recommendations');
    const hasEvidence = bodyText.includes('evidence') || bodyText.includes('studies') || bodyText.includes('research');
    const hasSafety = bodyText.includes('safety') || bodyText.includes('safe') || bodyText.includes('risk');
    const hasDisclaimer = bodyText.includes('consult') || bodyText.includes('pediatrician') || bodyText.includes('medical advice');
    
    // 警告但不阻止（允许一些灵活性）
    if (!hasAAP && !hasCDC && !hasWHO) {
      console.log('⚠️  警告: 文章缺少权威组织引用 (AAP/CDC/WHO)');
    }
    if (!hasEvidence) {
      console.log('⚠️  警告: 文章缺少证据引用');
    }
    if (!hasSafety && (topicInfo.hub === 'safety' || topicInfo.type === 'howto')) {
      console.log('⚠️  警告: 安全相关文章缺少安全考虑');
    }
    if (!hasDisclaimer) {
      console.log('⚠️  警告: 文章缺少医疗免责声明');
    }

    return articleData;
  } catch (error) {
    console.error(`❌ 生成文章失败:`, error.message);
    throw error;
  }
}

/**
 * 插入文章到数据库
 */
async function insertArticle(articleData, topicInfo) {
  const slug = generateSlug(articleData.title);
  
  // 再次检查重复
  const existsCheck = await articleExists(articleData.title);
  if (existsCheck.exists) {
    console.log(`⏭️  跳过重复文章: ${articleData.title} (${existsCheck.reason})`);
    return { success: false, reason: existsCheck.reason };
  }

  // 先不包含article_source，避免schema cache问题
  // AEO优化：将 FAQ 和 AEO 数据存储在 entities 字段中（已有的 JSON 字段）
  
  // 构建增强的 entities 数组，包含 AEO 元数据
  const enhancedEntities = [
    ...(articleData.entities || []),
    // 添加 AEO 标记
    'AEO_OPTIMIZED',
    ...(articleData.sources || ['AAP', 'CDC', 'WHO'])
  ];

  // 构建增强的 key_facts，确保以直接回答开头
  let enhancedKeyFacts = articleData.key_facts || [];
  if (articleData.quick_answer) {
    // 将 quick_answer 作为第一个 key fact
    enhancedKeyFacts = [articleData.quick_answer, ...enhancedKeyFacts];
  }
  
  const article = {
    slug,
    type: topicInfo.type,
    hub: topicInfo.hub,
    lang: 'en',
    title: articleData.title,
    one_liner: articleData.one_liner || articleData.title,
    key_facts: enhancedKeyFacts.slice(0, 10), // 最多10个 key facts
    body_md: articleData.body_md,
    age_range: topicInfo.age_range,
    region: 'Global',
    last_reviewed: new Date().toISOString().split('T')[0],
    reviewed_by: 'AI Content Generator',
    entities: enhancedEntities,
    license: 'CC BY-NC 4.0',
    meta_title: articleData.meta_title || articleData.title,
    meta_description: articleData.meta_description || articleData.one_liner,
    // 将 FAQ 数据编码存储在 keywords 中（JSON 格式）
    keywords: [
      ...(articleData.keywords || []),
      // 存储 FAQ 元数据作为 JSON 字符串
      articleData.faqs ? `__AEO_FAQS__${JSON.stringify(articleData.faqs)}` : null,
      articleData.steps ? `__AEO_STEPS__${JSON.stringify(articleData.steps)}` : null,
      articleData.quick_answer ? `__AEO_QUICK__${articleData.quick_answer}` : null
    ].filter(Boolean),
    status: 'published'
    // article_source将在插入后单独更新
  };

  // 验证必需字段
  if (article.one_liner.length < 50) {
    article.one_liner = article.one_liner + ' Evidence-based information from trusted health organizations.';
  }
  if (article.one_liner.length > 200) {
    article.one_liner = article.one_liner.substring(0, 197) + '...';
  }

  if (article.key_facts.length < 3) {
    article.key_facts = [
      ...article.key_facts,
      'Based on CDC, AAP, and WHO guidelines',
      'Evidence-based recommendations',
      'Consult your pediatrician for personalized advice'
    ].slice(0, 8);
  }

  try {
    // 第一步：插入文章（不包含article_source，避免schema cache问题）
    const { data, error } = await supabase
      .from('articles')
      .insert([article])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        console.log(`⏭️  Slug已存在: ${slug}`);
        return { success: false, reason: 'Slug冲突' };
      }
      throw error;
    }

    // 第二步：更新article_source字段
    // 由于schema cache问题，先尝试直接UPDATE
    // 如果失败，文章已通过reviewed_by='AI Content Generator'标识，可以稍后批量更新
    try {
      const { error: updateError } = await supabase
        .from('articles')
        .update({ article_source: 'ai_generated' })
        .eq('id', data.id);
      
      if (updateError) {
        if (updateError.message.includes('schema cache')) {
          // Schema cache问题，稍后可以通过运行 update-article-source.js 批量更新
          console.log(`⚠️  Schema cache问题，article_source未更新`);
          console.log(`   文章已通过reviewed_by='AI Content Generator'标识为AI生成`);
          console.log(`   可以运行: node scripts/update-article-source.js 来批量更新`);
        } else {
          console.log(`⚠️  更新article_source时出错: ${updateError.message}`);
        }
      } else {
        console.log(`   ✅ article_source已设置为'ai_generated'`);
      }
    } catch (updateErr) {
      // 更新失败不影响主流程，文章已插入
      console.log(`⚠️  更新article_source时出错: ${updateErr.message}`);
      console.log(`   文章已插入，将通过reviewed_by字段标识`);
    }

    console.log(`✅ 文章插入成功: ${articleData.title}`);
    console.log(`   ID: ${data.id}`);
    console.log(`   Slug: ${data.slug}`);
    
    return { success: true, article: data };
  } catch (error) {
    console.error(`❌ 插入失败:`, error.message);
    return { success: false, reason: error.message };
  }
}

/**
 * 使用 OpenAI 将 trending topics 转换为标准格式
 */
async function convertTrendingTopicsToStandardFormat(rawTrendingTopics) {
  if (!rawTrendingTopics || rawTrendingTopics.length === 0) {
    return [];
  }

  console.log(`\n🤖 正在使用 AI 转换 ${rawTrendingTopics.length} 个 trending topics...`);

  const systemPrompt = `You are an expert content strategist for maternal and infant health content.
Convert trending topics into question-format article topics suitable for evidence-based maternal/infant health content.

For each trending topic that is related to maternal/infant health, determine:
- topic: Question format (How to / What is / When should / Why does / Can I)
- hub: One of [feeding, sleep, mom-health, development, safety, recipes]
- type: One of [explainer, howto, recipe]
- age_range: Appropriate age range (e.g., "0-3 months", "6-12 months", "12-24 months")

IMPORTANT:
- Only include topics that are clearly related to maternal/infant health, parenting, baby care, pregnancy, or child development
- Convert to question format when possible
- Match to the most appropriate hub
- If a topic is not related to maternal/infant health, skip it
- Return a JSON object with a "topics" array containing the converted topics

Return format: { "topics": [{ "topic": "...", "hub": "...", "type": "...", "age_range": "..." }] }`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Convert these trending topics into standard article topics for maternal/infant health content:\n${JSON.stringify(rawTrendingTopics.slice(0, 20), null, 2)}\n\nOnly convert topics that are clearly related to maternal/infant health, parenting, baby care, pregnancy, or child development. Skip topics about baby products, baby names, or unrelated topics. Return a JSON object with a "topics" array.` }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('OpenAI返回空内容');
    }

    const parsed = JSON.parse(content);
    
    // 处理不同的响应格式
    let convertedTopics = [];
    if (Array.isArray(parsed)) {
      convertedTopics = parsed;
    } else if (parsed.topics && Array.isArray(parsed.topics)) {
      convertedTopics = parsed.topics;
    } else if (parsed.articles && Array.isArray(parsed.articles)) {
      convertedTopics = parsed.articles;
    } else if (parsed.data && Array.isArray(parsed.data)) {
      convertedTopics = parsed.data;
    } else {
      // 尝试直接使用对象的值
      const values = Object.values(parsed);
      if (values.length > 0 && Array.isArray(values[0])) {
        convertedTopics = values[0];
      } else {
        // 如果都没有，尝试查找任何包含数组的属性
        for (const key in parsed) {
          if (Array.isArray(parsed[key])) {
            convertedTopics = parsed[key];
            break;
          }
        }
      }
    }

    // 验证格式
    const validTopics = convertedTopics.filter(topic => 
      topic.topic && 
      topic.hub && 
      ['feeding', 'sleep', 'mom-health', 'development', 'safety', 'recipes'].includes(topic.hub) &&
      topic.type &&
      ['explainer', 'howto', 'recipe'].includes(topic.type) &&
      topic.age_range
    );

    if (validTopics.length === 0) {
      console.log('⚠️  AI 转换后没有找到相关的母婴健康主题');
      return [];
    }

    console.log(`✅ 成功转换 ${validTopics.length} 个 trending topics`);
    return validTopics;
  } catch (error) {
    console.error(`❌ 转换 trending topics 失败:`, error.message);
    return [];
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 开始自动生成文章...\n');

  // 解析命令行参数
  const args = process.argv.slice(2);
  const topicIndex = args.indexOf('--topic');
  const hubIndex = args.indexOf('--hub');
  
  const specifiedTopic = topicIndex >= 0 ? args[topicIndex + 1] : null;
  const specifiedHub = hubIndex >= 0 ? args[hubIndex + 1] : null;

  let topicsToGenerate = [];

  if (specifiedTopic) {
    // 如果指定了topic，查找匹配的主题
    const topic = MATERNAL_INFANT_TOPICS.find(t => 
      t.topic.toLowerCase().includes(specifiedTopic.toLowerCase())
    );
    if (topic) {
      topicsToGenerate = [topic];
    } else {
      console.log(`❌ 未找到主题: ${specifiedTopic}`);
      process.exit(1);
    }
  } else {
    // 没有指定 topic 或 hub 时，尝试使用 trending topics
    let trendingTopicsConverted = [];
    
    try {
      // 1. 获取 trending topics
      const rawTrendingTopics = await fetchTrendingTopics();
      
      if (rawTrendingTopics && rawTrendingTopics.length > 0) {
        // 2. 转换为标准格式
        trendingTopicsConverted = await convertTrendingTopicsToStandardFormat(rawTrendingTopics);
        
        if (trendingTopicsConverted.length > 0) {
          // 3. 检查这些主题是否已存在于数据库
          const filteredTrendingTopics = [];
          for (const topic of trendingTopicsConverted) {
            // 如果指定了 hub，只保留匹配的
            if (specifiedHub && topic.hub !== specifiedHub) {
              continue;
            }
            
            const existsCheck = await articleExists(topic.topic);
            if (!existsCheck.exists) {
              filteredTrendingTopics.push(topic);
            } else {
              console.log(`⏭️  Trending topic 已存在: ${topic.topic}`);
            }
          }
          
          if (filteredTrendingTopics.length > 0) {
            console.log(`\n✅ 找到 ${filteredTrendingTopics.length} 个新的 trending topics`);
            topicsToGenerate = filteredTrendingTopics;
          }
        }
      }
    } catch (error) {
      console.log(`⚠️  获取 trending topics 时出错: ${error.message}`);
      console.log('   将回退到预设主题列表\n');
    }
    
    // 如果 trending topics 不足或失败，使用预设主题补充
    let missingPresetTopics = [];
    let hasQueriedPresetTopics = false;
    
    if (topicsToGenerate.length < 3) {
      missingPresetTopics = await findMissingTopics(specifiedHub);
      hasQueriedPresetTopics = true;
      
      if (missingPresetTopics.length > 0) {
        const needed = 3 - topicsToGenerate.length;
        const presetTopicsToAdd = missingPresetTopics.slice(0, needed);
        
        if (presetTopicsToAdd.length > 0) {
          // 合并 trending topics 和预设主题
          topicsToGenerate = [...topicsToGenerate, ...presetTopicsToAdd];
          console.log(`📋 使用 ${presetTopicsToAdd.length} 个预设主题补充，总共 ${topicsToGenerate.length} 个主题\n`);
        }
      }
    }
    
    // 如果仍然没有主题，完全回退到预设主题（重用之前查询的结果）
    if (topicsToGenerate.length === 0) {
      console.log('📋 回退到预设主题列表\n');
      // 如果之前已经查询过，直接使用结果（即使结果为空）；否则才查询
      if (hasQueriedPresetTopics) {
        topicsToGenerate = missingPresetTopics;
      } else {
        topicsToGenerate = await findMissingTopics(specifiedHub);
      }
    }
  }

  if (topicsToGenerate.length === 0) {
    console.log('✅ 所有主题都已存在，无需生成新文章');
    return;
  }

  console.log(`📋 找到 ${topicsToGenerate.length} 个缺失的主题\n`);

  // 如果没有指定topic，随机打乱顺序（实现随机选择）
  if (!specifiedTopic) {
    // Fisher-Yates shuffle algorithm for random selection
    for (let i = topicsToGenerate.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [topicsToGenerate[i], topicsToGenerate[j]] = [topicsToGenerate[j], topicsToGenerate[i]];
    }
    console.log('🎲 随机选择主题顺序\n');
  }

  // 每天最多生成3篇文章
  const maxArticles = 3;
  const topicsToProcess = topicsToGenerate.slice(0, maxArticles);

  const results = {
    success: 0,
    failed: 0,
    skipped: 0
  };

  for (const topicInfo of topicsToProcess) {
    try {
      console.log(`\n📝 处理主题: ${topicInfo.topic}`);
      console.log(`   Hub: ${topicInfo.hub}, Type: ${topicInfo.type}, Age: ${topicInfo.age_range}`);

      // 检查是否已存在（使用预设主题格式检查）
      const existsCheck = await articleExists(topicInfo.topic);
      if (existsCheck.exists) {
        console.log(`⏭️  跳过: ${existsCheck.reason} (${existsCheck.existingTitle})`);
        results.skipped++;
        continue;
      }

      // 生成文章
      const articleData = await generateArticle(topicInfo);

      // 生成后再次检查（使用实际生成的标题，更准确）
      // 因为 AI 可能生成与预设主题格式不同的标题
      const finalExistsCheck = await articleExists(articleData.title);
      if (finalExistsCheck.exists) {
        console.log(`⏭️  跳过: 生成的文章标题已存在 (${finalExistsCheck.reason})`);
        console.log(`   预设主题: ${topicInfo.topic}`);
        console.log(`   生成标题: ${articleData.title}`);
        console.log(`   已存在: ${finalExistsCheck.existingTitle}`);
        results.skipped++;
        continue;
      }

      // 插入数据库
      const insertResult = await insertArticle(articleData, topicInfo);
      
      if (insertResult.success) {
        results.success++;
      } else {
        results.failed++;
      }

      // 避免API限流，等待一下
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.error(`❌ 处理失败:`, error.message);
      results.failed++;
    }
  }

  console.log('\n📊 生成结果:');
  console.log(`   ✅ 成功: ${results.success}`);
  console.log(`   ❌ 失败: ${results.failed}`);
  console.log(`   ⏭️  跳过: ${results.skipped}`);
  console.log(`\n✅ 文章生成完成！`);
}

// 运行主函数
if (require.main === module) {
  main().catch(error => {
    console.error('❌ 脚本执行失败:', error);
    process.exit(1);
  });
}

module.exports = {
  findMissingTopics,
  generateArticle,
  insertArticle,
  articleExists,
  convertTrendingTopicsToStandardFormat
};
