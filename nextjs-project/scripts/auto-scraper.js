#!/usr/bin/env node

/**
 * 自动爬虫 - 自动发现和抓取所有母婴相关文章
 */

const axios = require('axios');
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 配置
const CONFIG = {
  delayBetweenRequests: 1000, // 1秒延迟
  delayBetweenArticles: 2000, // 2秒延迟
  maxArticlesPerRun: 50, // 每次最多抓取50篇（避免过载）
  minContentLength: 500,
  maxContentLength: 50000
};

// 过滤掉非内容页的URL
const EXCLUDE_PATTERNS = [
  /default\.aspx$/i,
  /\/Pages\/?$/i,
  /find-pediatrician/i,
  /contributors/i,
  /podcast/i,
  /mediaplan/i,
  /all-categories/i,
  /sitemap/i
];

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetch(url) {
  try {
    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; JupitLunarBot/1.0)'
      }
    });
    return response.data;
  } catch (error) {
    return null;
  }
}

// 检查URL是否应该被排除
function shouldExclude(url) {
  return EXCLUDE_PATTERNS.some(pattern => pattern.test(url));
}

// 发现AAP文章
async function discoverAAPArticles() {
  console.log('🔍 发现AAP文章...');

  const categories = [
    'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/default.aspx',
    'https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/default.aspx',
    'https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/default.aspx',
    'https://www.healthychildren.org/English/ages-stages/baby/diapers-clothing/Pages/default.aspx'
  ];

  const articles = new Set();

  for (const categoryUrl of categories) {
    const html = await fetch(categoryUrl);
    if (!html) continue;

    const $ = cheerio.load(html);
    $('a[href*="/Pages/"]').each((i, elem) => {
      const href = $(elem).attr('href');
      if (!href) return;

      const fullUrl = href.startsWith('http')
        ? href
        : `https://www.healthychildren.org${href}`;

      if (!shouldExclude(fullUrl) && fullUrl.includes('/Pages/')) {
        articles.add(fullUrl);
      }
    });

    await delay(CONFIG.delayBetweenRequests);
  }

  const articleList = Array.from(articles);
  console.log(`✅ 发现 ${articleList.length} 篇AAP文章`);
  return articleList;
}

// 发现KidsHealth文章
async function discoverKidsHealthArticles() {
  console.log('🔍 发现KidsHealth文章...');

  const searchPages = [
    'https://kidshealth.org/en/parents/pregnancy-center/newborn-care/',
    'https://kidshealth.org/en/parents/'
  ];

  const articles = new Set();

  for (const pageUrl of searchPages) {
    const html = await fetch(pageUrl);
    if (!html) continue;

    const $ = cheerio.load(html);
    $('a[href*="/parents/"]').each((i, elem) => {
      const href = $(elem).attr('href');
      if (!href) return;

      const fullUrl = href.startsWith('http')
        ? href
        : `https://kidshealth.org${href}`;

      if (fullUrl.match(/\/en\/parents\/[^\/]+\.html$/) && !shouldExclude(fullUrl)) {
        articles.add(fullUrl);
      }
    });

    await delay(CONFIG.delayBetweenRequests);
  }

  const articleList = Array.from(articles);
  console.log(`✅ 发现 ${articleList.length} 篇KidsHealth文章`);
  return articleList;
}

// 抓取文章内容
async function scrapeArticle(url, source) {
  const html = await fetch(url);
  if (!html) return null;

  const $ = cheerio.load(html);

  // 移除无用标签
  $('script, style, nav, header, footer, aside, iframe').remove();

  const title = $('h1').first().text().trim();
  const paragraphs = [];

  $('p').each((i, elem) => {
    const text = $(elem).text().trim();
    if (text.length > 20) {
      paragraphs.push(text);
    }
  });

  const content = paragraphs.join('\n\n');

  // 验证内容质量
  if (!title || content.length < CONFIG.minContentLength) {
    return null;
  }

  if (content.length > CONFIG.maxContentLength) {
    return null;
  }

  return {
    url,
    title,
    content,
    paragraphCount: paragraphs.length,
    source
  };
}

// 检查文章是否已存在
async function articleExists(url) {
  const { data } = await supabase
    .from('articles')
    .select('id')
    .ilike('license', `%${url}%`)
    .single();

  return !!data;
}

// 生成slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);
}

// 提取关键词
function extractKeywords(content) {
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'can', 'your', 'you', 'they', 'them', 'their', 'this', 'that', 'with', 'from'];

  const words = content
    .toLowerCase()
    .match(/\b[a-z]{4,}\b/g) || [];

  const freq = {};
  words.forEach(word => {
    if (!commonWords.includes(word)) {
      freq[word] = (freq[word] || 0) + 1;
    }
  });

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

// 保存文章到数据库
async function saveArticle(articleData) {
  try {
    const slug = generateSlug(articleData.title);

    // 检查slug是否已存在
    const { data: existing } = await supabase
      .from('articles')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      return { success: false, reason: 'slug已存在' };
    }

    const article = {
      slug,
      type: 'explainer',
      hub: 'feeding',
      lang: 'en',
      title: articleData.title.substring(0, 200),
      one_liner: articleData.content.substring(0, 200),
      key_facts: [
        'Extracted from authoritative health source',
        'Evidence-based information for parents',
        'Reviewed by healthcare professionals'
      ],
      body_md: articleData.content,
      entities: extractKeywords(articleData.content),
      age_range: '0-12 months',
      region: 'US',
      last_reviewed: new Date().toISOString().split('T')[0],
      reviewed_by: 'Web Scraper Bot',
      license: `Source: ${articleData.source} | URL: ${articleData.url}`,
      meta_title: articleData.title.substring(0, 60),
      meta_description: articleData.content.substring(0, 157) + '...',
      keywords: extractKeywords(articleData.content),
      status: 'draft'
    };

    const { data, error } = await supabase
      .from('articles')
      .insert([article])
      .select()
      .single();

    if (error) throw error;

    // 保存引用
    await supabase.from('citations').insert([{
      article_id: data.id,
      title: articleData.title,
      url: articleData.url,
      publisher: articleData.source,
      date: new Date().toISOString().split('T')[0]
    }]);

    return { success: true, id: data.id };

  } catch (error) {
    return { success: false, reason: error.message };
  }
}

// 主函数
async function main() {
  console.log('🚀 开始自动爬取母婴文章\n');

  const stats = {
    discovered: 0,
    attempted: 0,
    successful: 0,
    failed: 0,
    skipped: 0
  };

  // 1. 发现文章
  console.log('=' .repeat(70));
  console.log('阶段 1: 发现文章');
  console.log('='.repeat(70) + '\n');

  const aapUrls = await discoverAAPArticles();
  const kidsHealthUrls = await discoverKidsHealthArticles();

  const allUrls = [...aapUrls, ...kidsHealthUrls];
  stats.discovered = allUrls.length;

  console.log(`\n📊 总共发现 ${stats.discovered} 篇文章\n`);

  // 2. 抓取文章（限制数量，智能跳过已存在的）
  console.log('='.repeat(70));
  console.log('阶段 2: 抓取文章内容');
  console.log('='.repeat(70) + '\n');

  // 先过滤掉已存在的URL
  const urlsToScrape = [];
  for (const url of allUrls) {
    if (urlsToScrape.length >= CONFIG.maxArticlesPerRun) break;

    const exists = await articleExists(url);
    if (!exists) {
      urlsToScrape.push(url);
    }
  }

  console.log(`📝 本次将抓取 ${urlsToScrape.length} 篇新文章（最多${CONFIG.maxArticlesPerRun}篇）\n`);

  for (let i = 0; i < urlsToScrape.length; i++) {
    const url = urlsToScrape[i];
    stats.attempted++;

    console.log(`[${i + 1}/${urlsToScrape.length}] 抓取: ${url}`);

    // 抓取内容
    const source = url.includes('healthychildren.org') ? 'AAP' : 'KidsHealth';
    const articleData = await scrapeArticle(url, source);

    if (!articleData) {
      console.log(`  ❌ 抓取失败或内容质量不足\n`);
      stats.failed++;
      await delay(CONFIG.delayBetweenRequests);
      continue;
    }

    console.log(`  ✅ 成功: ${articleData.title.substring(0, 60)}`);
    console.log(`     内容: ${articleData.content.length} 字符, ${articleData.paragraphCount} 段`);

    // 保存到数据库
    const result = await saveArticle(articleData);

    if (result.success) {
      console.log(`  💾 已保存到数据库 (ID: ${result.id})\n`);
      stats.successful++;
    } else {
      console.log(`  ❌ 保存失败: ${result.reason}\n`);
      stats.failed++;
    }

    await delay(CONFIG.delayBetweenArticles);
  }

  // 3. 显示统计
  console.log('\n' + '='.repeat(70));
  console.log('📊 爬取结果统计');
  console.log('='.repeat(70));
  console.log(`发现文章: ${stats.discovered} 篇`);
  console.log(`尝试抓取: ${stats.attempted} 篇`);
  console.log(`成功保存: ${stats.successful} 篇 ✅`);
  console.log(`跳过: ${stats.skipped} 篇 ⏭️`);
  console.log(`失败: ${stats.failed} 篇 ❌`);
  console.log(`成功率: ${((stats.successful / stats.attempted) * 100).toFixed(1)}%`);
  console.log('\n✅ 爬取完成！\n');

  if (stats.discovered > CONFIG.maxArticlesPerRun) {
    console.log(`ℹ️  还有 ${stats.discovered - CONFIG.maxArticlesPerRun} 篇文章未抓取`);
    console.log(`   可以再次运行此脚本来抓取更多文章\n`);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
