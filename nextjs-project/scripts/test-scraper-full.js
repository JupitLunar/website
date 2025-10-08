#!/usr/bin/env node

/**
 * 完整的爬虫测试脚本
 * 功能：
 * 1. 从权威网站爬取数据
 * 2. 存入Supabase
 * 3. 自动去重（通过slug检查）
 * 4. 显示详细结果
 */

const axios = require('axios');
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// 加载环境变量
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少环境变量: NEXT_PUBLIC_SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 延迟函数
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 生成唯一的slug
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100)
    .replace(/-$/, '');
}

/**
 * 检查slug是否已存在
 */
async function slugExists(slug) {
  const { data, error } = await supabase
    .from('articles')
    .select('id, slug')
    .eq('slug', slug)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('检查slug时出错:', error);
  }
  
  return !!data;
}

/**
 * 检查来源是否已存在
 */
async function getOrCreateSource(sourceData) {
  // 先查找
  const { data: existing } = await supabase
    .from('kb_sources')
    .select('id')
    .eq('url', sourceData.url)
    .single();
  
  if (existing) {
    return existing.id;
  }
  
  // 不存在则创建
  const { data, error } = await supabase
    .from('kb_sources')
    .insert([sourceData])
    .select()
    .single();
  
  if (error) {
    console.error('创建来源失败:', error);
    return null;
  }
  
  return data.id;
}

/**
 * 爬取CDC婴儿营养页面
 */
async function scrapeCDC() {
  console.log('\n🔍 正在爬取 CDC 婴儿营养页面...');
  
  try {
    const url = 'https://www.cdc.gov/nutrition/infantandtoddlernutrition/index.html';
    
    const response = await axios.get(url, {
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; JupitLunarBot/1.0)'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    // 提取内容
    const title = $('h1').first().text().trim() || 'CDC Infant and Toddler Nutrition Guidelines';
    const slug = generateSlug(title);
    
    // 检查是否已存在
    if (await slugExists(slug)) {
      console.log('⏭️  内容已存在，跳过');
      return { skipped: true, title };
    }
    
    // 提取段落
    const paragraphs = [];
    $('.content-area p, main p').each((i, elem) => {
      const text = $(elem).text().trim();
      if (text.length > 50) {
        paragraphs.push(text);
      }
    });
    
    // 提取列表
    const lists = [];
    $('.content-area li, main li').each((i, elem) => {
      const text = $(elem).text().trim();
      if (text.length > 20) {
        lists.push(text);
      }
    });
    
    const content = paragraphs.join('\n\n');
    
    if (content.length < 100) {
      console.log('⚠️  内容太短，可能爬取失败');
      return { failed: true, reason: 'Content too short' };
    }
    
    // 创建或获取来源
    const sourceId = await getOrCreateSource({
      name: 'Centers for Disease Control and Prevention (CDC)',
      organization: 'CDC',
      url: 'https://www.cdc.gov',
      grade: 'A',
      retrieved_at: new Date().toISOString().split('T')[0],
      notes: 'U.S. government health agency'
    });
    
    // 准备文章数据
    const articleData = {
      slug: slug,
      type: 'explainer',
      hub: 'feeding',
      lang: 'en',
      title: title,
      one_liner: paragraphs[0] ? paragraphs[0].substring(0, 180) : 'CDC guidelines on infant and toddler nutrition and feeding practices.',
      key_facts: lists.slice(0, 5).length >= 3 ? lists.slice(0, 5) : [
        'Follow CDC guidelines for infant feeding',
        'Introduce solid foods around 6 months',
        'Continue breastfeeding alongside solid foods'
      ],
      body_md: `# ${title}\n\n${content}`,
      entities: ['infant nutrition', 'feeding', 'CDC guidelines', 'baby food'],
      age_range: '0-12 months',
      region: 'US',
      last_reviewed: new Date().toISOString().split('T')[0],
      reviewed_by: 'Web Scraper Bot',
      license: 'Source: CDC',
      meta_title: title.substring(0, 60),
      meta_description: paragraphs[0] ? paragraphs[0].substring(0, 150) : '',
      keywords: ['infant nutrition', 'CDC', 'baby feeding', 'toddler food'],
      status: 'draft'
    };
    
    // 插入文章
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .insert([articleData])
      .select()
      .single();
    
    if (articleError) {
      console.error('❌ 插入文章失败:', articleError.message);
      return { failed: true, error: articleError.message };
    }
    
    // 插入引用
    if (sourceId && article) {
      await supabase.from('citations').insert([{
        article_id: article.id,
        title: title,
        url: url,
        publisher: 'CDC',
        date: new Date().toISOString().split('T')[0]
      }]);
    }
    
    console.log('✅ 成功插入文章:', title);
    console.log('   ID:', article.id);
    console.log('   Slug:', article.slug);
    console.log('   内容长度:', content.length, '字符');
    
    return {
      success: true,
      article: {
        id: article.id,
        title: article.title,
        slug: article.slug,
        hub: article.hub
      }
    };
    
  } catch (error) {
    console.error('❌ 爬取失败:', error.message);
    return { failed: true, error: error.message };
  }
}

/**
 * 爬取AAP健康儿童网站
 */
async function scrapeAAP() {
  console.log('\n🔍 正在爬取 AAP HealthyChildren 页面...');
  
  try {
    const url = 'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/default.aspx';
    
    const response = await axios.get(url, {
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; JupitLunarBot/1.0)'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    // 提取标题
    const title = $('h1').first().text().trim() || 'Baby Formula Feeding Guide';
    const slug = generateSlug(title);
    
    // 检查是否已存在
    if (await slugExists(slug)) {
      console.log('⏭️  内容已存在，跳过');
      return { skipped: true, title };
    }
    
    // 提取内容
    const paragraphs = [];
    $('.article-content p, main p, .content p').each((i, elem) => {
      const text = $(elem).text().trim();
      if (text.length > 50 && !text.includes('Advertisement')) {
        paragraphs.push(text);
      }
    });
    
    const lists = [];
    $('.article-content li, main li, .content li').each((i, elem) => {
      const text = $(elem).text().trim();
      if (text.length > 20) {
        lists.push(text);
      }
    });
    
    const content = paragraphs.join('\n\n');
    
    if (content.length < 100) {
      console.log('⚠️  内容太短，可能爬取失败');
      return { failed: true, reason: 'Content too short' };
    }
    
    // 创建或获取来源
    const sourceId = await getOrCreateSource({
      name: 'American Academy of Pediatrics (AAP)',
      organization: 'AAP',
      url: 'https://www.healthychildren.org',
      grade: 'A',
      retrieved_at: new Date().toISOString().split('T')[0],
      notes: 'Leading pediatric professional organization'
    });
    
    // 准备文章数据
    const articleData = {
      slug: slug,
      type: 'explainer',
      hub: 'feeding',
      lang: 'en',
      title: title,
      one_liner: paragraphs[0] ? paragraphs[0].substring(0, 180) : 'AAP guidelines on baby formula feeding amounts and schedules.',
      key_facts: lists.slice(0, 5).length >= 3 ? lists.slice(0, 5) : [
        'Follow pediatrician recommendations for formula feeding',
        'Feed on demand in early months',
        'Gradually establish a feeding schedule'
      ],
      body_md: `# ${title}\n\n${content}`,
      entities: ['formula feeding', 'baby nutrition', 'AAP guidelines', 'feeding schedule'],
      age_range: '0-12 months',
      region: 'US',
      last_reviewed: new Date().toISOString().split('T')[0],
      reviewed_by: 'Web Scraper Bot',
      license: 'Source: AAP',
      meta_title: title.substring(0, 60),
      meta_description: paragraphs[0] ? paragraphs[0].substring(0, 150) : '',
      keywords: ['formula feeding', 'AAP', 'baby feeding', 'infant nutrition'],
      status: 'draft'
    };
    
    // 插入文章
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .insert([articleData])
      .select()
      .single();
    
    if (articleError) {
      console.error('❌ 插入文章失败:', articleError.message);
      return { failed: true, error: articleError.message };
    }
    
    // 插入引用
    if (sourceId && article) {
      await supabase.from('citations').insert([{
        article_id: article.id,
        title: title,
        url: url,
        publisher: 'AAP',
        date: new Date().toISOString().split('T')[0]
      }]);
    }
    
    console.log('✅ 成功插入文章:', title);
    console.log('   ID:', article.id);
    console.log('   Slug:', article.slug);
    console.log('   内容长度:', content.length, '字符');
    
    return {
      success: true,
      article: {
        id: article.id,
        title: article.title,
        slug: article.slug,
        hub: article.hub
      }
    };
    
  } catch (error) {
    console.error('❌ 爬取失败:', error.message);
    return { failed: true, error: error.message };
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   爬虫完整测试                         ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');
  console.log('⏰ 开始时间:', new Date().toLocaleString());
  console.log('');
  
  const results = {
    total: 0,
    success: 0,
    skipped: 0,
    failed: 0,
    articles: []
  };
  
  // 测试1: CDC
  results.total++;
  const cdcResult = await scrapeCDC();
  if (cdcResult.success) {
    results.success++;
    results.articles.push(cdcResult.article);
  } else if (cdcResult.skipped) {
    results.skipped++;
  } else {
    results.failed++;
  }
  
  // 等待1秒（礼貌爬取）
  await delay(1000);
  
  // 测试2: AAP
  results.total++;
  const aapResult = await scrapeAAP();
  if (aapResult.success) {
    results.success++;
    results.articles.push(aapResult.article);
  } else if (aapResult.skipped) {
    results.skipped++;
  } else {
    results.failed++;
  }
  
  // 显示结果摘要
  console.log('\n' + '═'.repeat(60));
  console.log('📊 测试结果摘要');
  console.log('═'.repeat(60));
  console.log('');
  console.log('总页面数:', results.total);
  console.log('成功:', results.success, '✅');
  console.log('跳过（已存在）:', results.skipped, '⏭️');
  console.log('失败:', results.failed, '❌');
  console.log('');
  
  if (results.articles.length > 0) {
    console.log('新增文章:');
    results.articles.forEach((article, i) => {
      console.log(`  ${i + 1}. ${article.title}`);
      console.log(`     Hub: ${article.hub}`);
      console.log(`     Slug: ${article.slug}`);
      console.log(`     ID: ${article.id}`);
    });
    console.log('');
  }
  
  console.log('⏰ 结束时间:', new Date().toLocaleString());
  console.log('');
  console.log('✅ 测试完成！');
  console.log('');
  console.log('📋 下一步:');
  console.log('1. 运行 npm run scrape:review 审核内容');
  console.log('2. 在Supabase控制台查看 articles 表');
  console.log('3. 审核通过后将 status 改为 "published"');
}

// 运行
if (require.main === module) {
  main().catch(error => {
    console.error('💥 程序出错:', error);
    process.exit(1);
  });
}

module.exports = { scrapeCDC, scrapeAAP };

