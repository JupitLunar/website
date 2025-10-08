#!/usr/bin/env node

/**
 * 测试多个来源的爬虫
 */

const axios = require('axios');
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// 初始化 Supabase 客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 测试数据 - 使用更可靠的静态页面
const TEST_SOURCES = [
  {
    name: 'WHO - Breastfeeding',
    organization: 'WHO',
    url: 'https://www.who.int/health-topics/breastfeeding',
    slug: 'who-breastfeeding-overview',
    category: 'feeding',
    selectors: {
      title: 'h1',
      content: '.sf-content-block, main',
      paragraphs: 'p'
    }
  },
  {
    name: 'Mayo Clinic - Infant Development',
    organization: 'Mayo Clinic',
    url: 'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/infant-development/art-20048178',
    slug: 'mayo-infant-development-guide',
    category: 'development',
    selectors: {
      title: 'h1',
      content: '.content, main',
      paragraphs: 'p'
    }
  },
  {
    name: 'NHS - Baby Feeding',
    organization: 'NHS',
    url: 'https://www.nhs.uk/conditions/baby/weaning-and-feeding/',
    slug: 'nhs-baby-feeding-guide',
    category: 'feeding',
    selectors: {
      title: 'h1',
      content: 'article, main',
      paragraphs: 'p'
    }
  }
];

// 生成简化的文章数据
function generateArticleData(source, content) {
  const cleanContent = content.substring(0, 5000);
  
  return {
    slug: source.slug,
    type: 'explainer',
    hub: source.category,
    lang: 'en',
    title: `${source.name} - Comprehensive Guide`,
    one_liner: cleanContent.substring(0, 150).replace(/\s+/g, ' ').trim() + '...',
    key_facts: [
      'Evidence-based information from authoritative health source',
      'Reviewed by healthcare professionals',
      'Up-to-date medical guidance',
      'Trusted by parents worldwide'
    ],
    body_md: `# ${source.name}\n\n${cleanContent.substring(0, 2000)}...`,
    entities: [source.category, 'infant', 'baby', 'parenting'],
    age_range: '0-12 months',
    region: source.organization === 'NHS' ? 'UK' : (source.organization === 'WHO' ? 'Global' : 'US'),
    last_reviewed: new Date().toISOString().split('T')[0],
    reviewed_by: 'Web Scraper Bot',
    license: `Source: ${source.organization}`,
    meta_title: source.name.substring(0, 60),
    meta_description: cleanContent.substring(0, 157) + '...',
    keywords: [source.category, 'baby', 'infant', 'health', 'guide'],
    status: 'draft'
  };
}

// 爬取单个页面
async function scrapePage(source) {
  console.log(`\n🔍 正在爬取: ${source.name}`);
  console.log(`   URL: ${source.url}`);
  
  try {
    // 发送请求
    const response = await axios.get(source.url, {
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; JupitLunarBot/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      }
    });
    
    // 解析 HTML
    const $ = cheerio.load(response.data);
    
    // 提取标题
    let title = $(source.selectors.title).first().text().trim();
    if (!title) title = source.name;
    
    // 提取内容
    let content = '';
    $(source.selectors.content).find(source.selectors.paragraphs).each((i, elem) => {
      const text = $(elem).text().trim();
      if (text.length > 20) {
        content += text + '\n\n';
      }
    });
    
    console.log(`   ✅ 内容长度: ${content.length} 字符`);
    
    if (content.length < 200) {
      console.log(`   ⚠️  内容太短，跳过`);
      return { success: false, reason: 'content_too_short' };
    }
    
    // 检查是否已存在
    const { data: existing } = await supabase
      .from('articles')
      .select('id, slug')
      .eq('slug', source.slug)
      .single();
    
    if (existing) {
      console.log(`   ⏭️  已存在，跳过`);
      return { success: false, reason: 'already_exists', existing };
    }
    
    // 准备插入数据库
    const articleData = generateArticleData(source, content);
    
    // 1. 插入或更新 kb_sources
    const { error: sourceError } = await supabase
      .from('kb_sources')
      .upsert({
        name: source.organization,
        organization: source.organization,
        url: new URL(source.url).origin,
        grade: 'A',
        retrieved_at: new Date().toISOString().split('T')[0],
        notes: `Scraped on ${new Date().toISOString()}`
      }, {
        onConflict: 'name'
      });
    
    if (sourceError) {
      console.log(`   ⚠️  来源插入警告:`, sourceError.message);
    }
    
    // 2. 插入文章
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .insert(articleData)
      .select()
      .single();
    
    if (articleError) {
      console.log(`   ❌ 文章插入失败:`, articleError.message);
      return { success: false, reason: 'insert_failed', error: articleError };
    }
    
    console.log(`   ✅ 文章插入成功！`);
    console.log(`      ID: ${article.id}`);
    console.log(`      Slug: ${article.slug}`);
    
    // 3. 插入引用
    const { error: citationError } = await supabase
      .from('citations')
      .insert({
        article_id: article.id,
        claim: '',
        title: title,
        url: source.url,
        author: '',
        publisher: source.organization,
        date: new Date().toISOString().split('T')[0]
      });
    
    if (citationError) {
      console.log(`   ⚠️  引用插入警告:`, citationError.message);
    }
    
    return { 
      success: true, 
      article,
      contentLength: content.length 
    };
    
  } catch (error) {
    console.log(`   ❌ 爬取失败: ${error.message}`);
    return { success: false, reason: 'scraping_failed', error };
  }
}

// 主函数
async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   多来源爬虫测试                       ║');
  console.log('╚════════════════════════════════════════╝\n');
  console.log(`⏰ 开始时间: ${new Date().toLocaleString()}\n`);
  
  const results = {
    total: TEST_SOURCES.length,
    successful: 0,
    skipped: 0,
    failed: 0,
    articles: []
  };
  
  for (const source of TEST_SOURCES) {
    const result = await scrapePage(source);
    
    if (result.success) {
      results.successful++;
      results.articles.push({
        name: source.name,
        slug: source.slug,
        id: result.article.id,
        contentLength: result.contentLength
      });
    } else if (result.reason === 'already_exists') {
      results.skipped++;
    } else {
      results.failed++;
    }
    
    // 礼貌延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n════════════════════════════════════════════════════════════');
  console.log('📊 测试结果摘要');
  console.log('════════════════════════════════════════════════════════════\n');
  console.log(`总页面数: ${results.total}`);
  console.log(`成功: ${results.successful} ✅`);
  console.log(`跳过（已存在）: ${results.skipped} ⏭️`);
  console.log(`失败: ${results.failed} ❌\n`);
  
  if (results.articles.length > 0) {
    console.log('📝 新插入的文章:\n');
    results.articles.forEach((article, i) => {
      console.log(`${i + 1}. ${article.name}`);
      console.log(`   Slug: ${article.slug}`);
      console.log(`   ID: ${article.id}`);
      console.log(`   内容: ${article.contentLength} 字符\n`);
    });
  }
  
  console.log(`⏰ 结束时间: ${new Date().toLocaleString()}\n`);
  console.log('✅ 测试完成！\n');
  
  console.log('📋 下一步:');
  console.log('1. 在Supabase控制台查看 articles 表');
  console.log('2. 审核内容后将 status 改为 "published"');
  console.log('3. 运行更多来源的爬虫\n');
}

main().catch(console.error);

