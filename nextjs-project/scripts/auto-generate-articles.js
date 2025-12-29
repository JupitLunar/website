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
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

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
 * 使用OpenAI生成文章
 */
async function generateArticle(topicInfo) {
  console.log(`\n🤖 正在生成文章: ${topicInfo.topic}...`);

  const systemPrompt = `You are an expert content writer specializing in evidence-based maternal and infant health information. 
Your articles are authoritative, well-researched, and follow CDC, AAP, and WHO guidelines.

Write a comprehensive, authoritative article in English about: "${topicInfo.topic}"

Requirements:
1. Title: Clear, SEO-friendly title (60-70 characters)
2. One-liner: Engaging summary (50-200 characters)
3. Key Facts: 3-8 bullet points with important information
4. Body: 2000-4000 words in Markdown format with:
   - Introduction
   - Main sections with ## headings
   - Evidence-based information
   - Practical tips and steps
   - Safety considerations
   - When to consult a healthcare provider
   - Conclusion
5. Age Range: ${topicInfo.age_range}
6. Hub: ${topicInfo.hub}
7. Type: ${topicInfo.type}

Format your response as JSON:
{
  "title": "Article Title",
  "one_liner": "Brief description",
  "key_facts": ["fact1", "fact2", "fact3"],
  "body_md": "# Article Title\n\nFull markdown content...",
  "meta_title": "SEO optimized title",
  "meta_description": "SEO description (150-160 characters)",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "entities": ["entity1", "entity2"]
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Write an article about: ${topicInfo.topic}` }
      ],
      temperature: 0.7,
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

  const article = {
    slug,
    type: topicInfo.type,
    hub: topicInfo.hub,
    lang: 'en',
    title: articleData.title,
    one_liner: articleData.one_liner || articleData.title,
    key_facts: articleData.key_facts || [],
    body_md: articleData.body_md,
    age_range: topicInfo.age_range,
    region: 'Global',
    last_reviewed: new Date().toISOString().split('T')[0],
    reviewed_by: 'AI Content Generator',
    entities: articleData.entities || [],
    license: 'CC BY-NC 4.0',
    meta_title: articleData.meta_title || articleData.title,
    meta_description: articleData.meta_description || articleData.one_liner,
    keywords: articleData.keywords || [],
    status: 'published',
    article_source: 'ai_generated'  // Mark as AI-generated
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
    // 使用直接SQL插入，避免schema cache问题
    const { data, error } = await supabase
      .from('articles')
      .insert([article])
      .select()
      .single();
    
    // 如果失败，尝试使用RPC函数
    if (error && error.message.includes('schema cache')) {
      console.log('⚠️  Schema cache问题，尝试使用RPC函数...');
      // 这里可以添加RPC调用作为备选方案
    }

    if (error) {
      if (error.code === '23505') {
        console.log(`⏭️  Slug已存在: ${slug}`);
        return { success: false, reason: 'Slug冲突' };
      }
      throw error;
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
    // 查找缺失的主题
    topicsToGenerate = await findMissingTopics(specifiedHub);
  }

  if (topicsToGenerate.length === 0) {
    console.log('✅ 所有主题都已存在，无需生成新文章');
    return;
  }

  console.log(`📋 找到 ${topicsToGenerate.length} 个缺失的主题\n`);

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

      // 检查是否已存在
      const existsCheck = await articleExists(topicInfo.topic);
      if (existsCheck.exists) {
        console.log(`⏭️  跳过: ${existsCheck.reason}`);
        results.skipped++;
        continue;
      }

      // 生成文章
      const articleData = await generateArticle(topicInfo);

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
  articleExists
};
