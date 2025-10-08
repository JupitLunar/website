#!/usr/bin/env node

/**
 * 全球自动爬虫 - 支持多地区权威来源
 */

const axios = require('axios');
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const { getAllSources, getSourcesByRegion, getAllRegions } = require('./global-sources-config');

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
  delayBetweenRequests: 1500,  // 增加到1.5秒（更礼貌）
  delayBetweenArticles: 2500,  // 增加到2.5秒
  maxArticlesPerRun: 100,      // 增加到100篇
  minContentLength: 500,
  maxContentLength: 50000,
  // 可以指定抓取的地区，留空则抓取所有
  targetRegions: []  // 例如: ['US', 'UK', 'CA'] 或 [] 表示全部
};

// 排除模式
const EXCLUDE_PATTERNS = [
  /default\.aspx$/i,
  /\/Pages\/?$/i,
  /find-pediatrician/i,
  /contributors/i,
  /podcast/i,
  /mediaplan/i,
  /all-categories/i,
  /sitemap/i,
  /search/i,
  /index\.html?$/i
];

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetch(url) {
  try {
    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; JupitLunarBot/1.0)',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    return response.data;
  } catch (error) {
    return null;
  }
}

function shouldExclude(url) {
  return EXCLUDE_PATTERNS.some(pattern => pattern.test(url));
}

// 通用文章发现函数
async function discoverArticlesFromSource(source) {
  console.log(`🔍 [${source.region}] 发现 ${source.name} 文章...`);

  if (!source.categories || source.categories.length === 0) {
    console.log(`  ⚠️  无分类配置，跳过`);
    return [];
  }

  const articles = new Set();

  for (const category of source.categories) {
    const categoryUrl = category.startsWith('http')
      ? category
      : `${source.baseUrl}${category}`;

    const html = await fetch(categoryUrl);
    if (!html) continue;

    const $ = cheerio.load(html);

    // 查找所有链接
    $('a[href]').each((i, elem) => {
      const href = $(elem).attr('href');
      if (!href) return;

      const fullUrl = href.startsWith('http')
        ? href
        : href.startsWith('/')
        ? `${source.baseUrl}${href}`
        : `${source.baseUrl}/${href}`;

      // 使用linkPattern过滤
      if (source.linkPattern && source.linkPattern.test(fullUrl) && !shouldExclude(fullUrl)) {
        articles.add(fullUrl);
      }
    });

    await delay(CONFIG.delayBetweenRequests);
  }

  const articleList = Array.from(articles);
  console.log(`  ✅ 发现 ${articleList.length} 篇文章`);

  return articleList.map(url => ({
    url,
    source: source.name,
    organization: source.organization,
    region: source.region,
    language: source.language
  }));
}

// 抓取文章内容
async function scrapeArticle(articleInfo) {
  const html = await fetch(articleInfo.url);
  if (!html) return null;

  const $ = cheerio.load(html);

  // 移除无用标签
  $('script, style, nav, header, footer, aside, iframe, .advertisement, .social-share').remove();

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
  if (!title || content.length < CONFIG.minContentLength || content.length > CONFIG.maxContentLength) {
    return null;
  }

  return {
    ...articleInfo,
    title,
    content,
    paragraphCount: paragraphs.length
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
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'can', 'your', 'you', 'they', 'them', 'their', 'this', 'that', 'with', 'from', 'about', 'when', 'what', 'which', 'who', 'how'];

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
      lang: articleData.language || 'en',
      title: articleData.title.substring(0, 200),
      one_liner: articleData.content.substring(0, 200),
      key_facts: [
        `Source: ${articleData.source}`,
        `Region: ${articleData.region}`,
        'Evidence-based information for parents'
      ],
      body_md: articleData.content,
      entities: extractKeywords(articleData.content),
      age_range: '0-12 months',
      region: articleData.region,  // 重要：设置地区
      last_reviewed: new Date().toISOString().split('T')[0],
      reviewed_by: 'Web Scraper Bot',
      license: `Source: ${articleData.source} (${articleData.organization}) | Region: ${articleData.region} | URL: ${articleData.url}`,
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
      publisher: articleData.organization,
      date: new Date().toISOString().split('T')[0]
    }]);

    return { success: true, id: data.id };

  } catch (error) {
    return { success: false, reason: error.message };
  }
}

// 主函数
async function main() {
  console.log('🌍 开始全球母婴文章爬取\n');

  const stats = {
    discovered: 0,
    attempted: 0,
    successful: 0,
    failed: 0,
    byRegion: {}
  };

  // 1. 获取要爬取的来源
  console.log('='.repeat(70));
  console.log('阶段 1: 加载全球来源配置');
  console.log('='.repeat(70) + '\n');

  const allSources = getAllSources();
  const targetSources = CONFIG.targetRegions.length > 0
    ? allSources.filter(s => CONFIG.targetRegions.includes(s.region))
    : allSources;

  console.log(`📦 总来源数: ${allSources.length}`);
  console.log(`🎯 本次目标: ${targetSources.length} 个来源\n`);

  // 按地区显示
  const regionGroups = {};
  targetSources.forEach(source => {
    if (!regionGroups[source.region]) {
      regionGroups[source.region] = [];
    }
    regionGroups[source.region].push(source.name);
  });

  Object.entries(regionGroups).forEach(([region, sources]) => {
    console.log(`  [${region}] ${sources.length} 个来源`);
    stats.byRegion[region] = { discovered: 0, successful: 0, failed: 0 };
  });

  // 2. 发现文章
  console.log('\n' + '='.repeat(70));
  console.log('阶段 2: 发现文章');
  console.log('='.repeat(70) + '\n');

  const allArticles = [];

  for (const source of targetSources) {
    const articles = await discoverArticlesFromSource(source);
    allArticles.push(...articles);
    stats.byRegion[source.region].discovered += articles.length;
    await delay(CONFIG.delayBetweenRequests);
  }

  stats.discovered = allArticles.length;
  console.log(`\n📊 总共发现 ${stats.discovered} 篇文章\n`);

  // 按地区显示
  Object.entries(stats.byRegion).forEach(([region, data]) => {
    console.log(`  [${region}] ${data.discovered} 篇`);
  });

  // 3. 过滤已存在的文章
  console.log('\n' + '='.repeat(70));
  console.log('阶段 3: 过滤已存在的文章');
  console.log('='.repeat(70) + '\n');

  const articlesToScrape = [];
  for (const article of allArticles) {
    if (articlesToScrape.length >= CONFIG.maxArticlesPerRun) break;

    const exists = await articleExists(article.url);
    if (!exists) {
      articlesToScrape.push(article);
    }
  }

  console.log(`📝 本次将抓取 ${articlesToScrape.length} 篇新文章（最多${CONFIG.maxArticlesPerRun}篇）\n`);

  // 4. 抓取文章
  console.log('='.repeat(70));
  console.log('阶段 4: 抓取文章内容');
  console.log('='.repeat(70) + '\n');

  for (let i = 0; i < articlesToScrape.length; i++) {
    const articleInfo = articlesToScrape[i];
    stats.attempted++;

    console.log(`[${i + 1}/${articlesToScrape.length}] [${articleInfo.region}] ${articleInfo.url}`);

    // 抓取内容
    const articleData = await scrapeArticle(articleInfo);

    if (!articleData) {
      console.log(`  ❌ 抓取失败或内容质量不足\n`);
      stats.failed++;
      stats.byRegion[articleInfo.region].failed++;
      await delay(CONFIG.delayBetweenRequests);
      continue;
    }

    console.log(`  ✅ ${articleData.title.substring(0, 60)}`);
    console.log(`     ${articleData.content.length} 字符, ${articleData.paragraphCount} 段`);

    // 保存到数据库
    const result = await saveArticle(articleData);

    if (result.success) {
      console.log(`  💾 已保存 (ID: ${result.id})\n`);
      stats.successful++;
      stats.byRegion[articleInfo.region].successful++;
    } else {
      console.log(`  ❌ 保存失败: ${result.reason}\n`);
      stats.failed++;
      stats.byRegion[articleInfo.region].failed++;
    }

    await delay(CONFIG.delayBetweenArticles);
  }

  // 5. 显示统计
  console.log('\n' + '='.repeat(70));
  console.log('📊 爬取结果统计');
  console.log('='.repeat(70));
  console.log(`发现文章: ${stats.discovered} 篇`);
  console.log(`尝试抓取: ${stats.attempted} 篇`);
  console.log(`成功保存: ${stats.successful} 篇 ✅`);
  console.log(`失败: ${stats.failed} 篇 ❌`);
  console.log(`成功率: ${((stats.successful / stats.attempted) * 100).toFixed(1)}%\n`);

  console.log('按地区统计:');
  Object.entries(stats.byRegion).forEach(([region, data]) => {
    console.log(`  [${region}] 发现${data.discovered}篇 | 成功${data.successful}篇 | 失败${data.failed}篇`);
  });

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
