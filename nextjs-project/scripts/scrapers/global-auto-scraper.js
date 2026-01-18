#!/usr/bin/env node

/**
 * 全球自动爬虫 - 支持多地区权威来源
 * 优化版本 - 使用共享工具模块
 */

const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const { getAllSources, getSourcesByRegion, getAllRegions } = require('./global-sources-config');
const { 
  extractArticle, 
  generateSlug, 
  extractKeywords, 
  delay, 
  fetchWithRetry 
} = require('./scraper-utils');

const dotenv = require('dotenv');
// Load env vars from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

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
  maxArticlesPerRun: 500,      // 增加到500篇
  minContentLength: 300,       // 降低到300字符（更宽松）
  maxContentLength: 150000,    // 放宽以容纳长篇权威指南
  minParagraphs: 3,            // 至少3段
  debugMode: process.env.DEBUG === 'true', // 调试模式
  // 可以指定抓取的地区，留空则抓取所有
  targetRegions: [],  // 例如: ['US', 'UK', 'CA'] 或 [] 表示全部
  // 仅抓取喂养/营养相关主题
  topicFilterEnabled: true,
  // Puppeteer 兜底用于反爬站点
  usePuppeteerFallback: true,
  puppeteerDomains: [
    'healthychildren.org',
    'cdc.gov',
    'nhs.uk',
    'canada.ca',
    'mayoclinic.org'
  ],
  fetchRetryCount: 3,
  fetchRetryDelay: 1200
};

// Region 映射 - 将所有 region 映射到数据库支持的值
const REGION_MAPPING = {
  'US': 'US',
  'CA': 'CA',
  'UK': 'Global',
  'AU': 'Global',
  'EU': 'Global',
  'Global': 'Global'
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
  /index\.html?$/i,
  /about/i,
  /editorial/i,
  /policy/i,
  /privacy/i,
  /terms/i,
  /nondiscrimination/i,
  /donate/i,
  /newsletter/i,
  /careers?/i,
  /press/i,
  /\.(pdf|jpg|jpeg|png|gif|svg)(\?|$|\s)/i
];

const EXCLUDE_HOSTS = [
  'facebook.com',
  'instagram.com',
  'twitter.com',
  'x.com',
  'youtube.com',
  'pinterest.com',
  'tiktok.com'
];

const TOPIC_PATTERNS = [
  /feeding/i,
  /nutrition/i,
  /breastfeed/i,
  /formula/i,
  /solid[-\s]?foods?/i,
  /wean/i,
  /allergen/i,
  /milk/i,
  /lactation/i,
  /bottle/i,
  /infant[-\s]?nutrition/i,
  /vitamin|iron/i
];

async function fetchPage(url) {
  try {
    return await fetchWithRetry(url, CONFIG.fetchRetryCount, CONFIG.fetchRetryDelay, {
      headers: {
        'Accept-Language': 'en-US,en;q=0.9'
      },
      usePuppeteerFallback: CONFIG.usePuppeteerFallback,
      puppeteerDomains: CONFIG.puppeteerDomains
    });
  } catch {
    return null;
  }
}

function shouldExclude(url, source) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    if (EXCLUDE_HOSTS.some(domain => host.endsWith(domain))) {
      return true;
    }
    if (host.endsWith('llli.org') && isNonEnglishLLLI(parsed.pathname)) {
      return true;
    }
  } catch {
    return true;
  }

  if (source && source.language && source.language !== 'en') {
    return true;
  }

  return EXCLUDE_PATTERNS.some(pattern => pattern.test(url));
}

function isNonEnglishLLLI(pathname) {
  return /^\/[a-z]{2}([_-][a-z]{2})?\//i.test(pathname);
}

function matchesTopic(url) {
  if (!CONFIG.topicFilterEnabled) return true;
  return TOPIC_PATTERNS.some(pattern => pattern.test(url));
}

function shouldForcePuppeteer(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return CONFIG.puppeteerDomains.some(domain => host.endsWith(domain));
  } catch {
    return false;
  }
}

// 通用文章发现函数
async function discoverArticlesFromSource(source) {
  console.log(`🔍 [${source.region}] 发现 ${source.name} 文章...`);

  const articles = new Set();

  if (source.categories && source.categories.length > 0) {
    for (const category of source.categories) {
      const categoryUrl = category.startsWith('http')
        ? category
        : `${source.baseUrl}${category}`;

      const html = await fetchPage(categoryUrl);
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

        // 使用 linkPattern + 主题过滤
        if (source.linkPattern && source.linkPattern.test(fullUrl)) {
          if (!shouldExclude(fullUrl, source) && matchesTopic(fullUrl)) {
            articles.add(fullUrl);
          }
        }
      });

      await delay(CONFIG.delayBetweenRequests);
    }
  }

  if (source.sitemapUrl) {
    const sitemapXml = await fetchPage(source.sitemapUrl);
    if (sitemapXml) {
      const urls = sitemapXml
        .split('<loc>')
        .slice(1)
        .map(part => part.split('</loc>')[0].trim())
        .filter(Boolean);
      urls.forEach((fullUrl) => {
        if (source.linkPattern && !source.linkPattern.test(fullUrl)) return;
        if (shouldExclude(fullUrl, source) || !matchesTopic(fullUrl)) return;
        articles.add(fullUrl);
      });
    }
  }

  if (source.searchUrl) {
    const html = await fetchPage(source.searchUrl);
    if (html) {
      const $ = cheerio.load(html);
      $('a[href]').each((i, elem) => {
        const href = $(elem).attr('href');
        if (!href) return;

        const fullUrl = href.startsWith('http')
          ? href
          : href.startsWith('/')
          ? `${source.baseUrl}${href}`
          : `${source.baseUrl}/${href}`;

        if (source.linkPattern && source.linkPattern.test(fullUrl)) {
          if (!shouldExclude(fullUrl, source) && matchesTopic(fullUrl)) {
            articles.add(fullUrl);
          }
        }
      });
    }
  }

  if ((!source.categories || source.categories.length === 0) && !source.sitemapUrl && !source.searchUrl) {
    console.log(`  ⚠️  无分类配置，跳过`);
    return [];
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

// 抓取文章内容（使用共享工具）
async function scrapeArticle(articleInfo) {
  const html = await fetchWithRetry(articleInfo.url, CONFIG.fetchRetryCount, CONFIG.fetchRetryDelay, {
    headers: {
      'Accept-Language': 'en-US,en;q=0.9'
    },
    usePuppeteerFallback: CONFIG.usePuppeteerFallback,
    puppeteerDomains: CONFIG.puppeteerDomains
  });
  if (!html) {
    console.log(`    📌 原因: 无法获取HTML`);
    return null;
  }

  // 使用共享工具提取文章
  const result = extractArticle(html, {
    minContentLength: CONFIG.minContentLength,
    maxContentLength: CONFIG.maxContentLength,
    minParagraphs: CONFIG.minParagraphs,
    debugMode: CONFIG.debugMode
  });

  if (!result.success) {
    if (CONFIG.usePuppeteerFallback && shouldForcePuppeteer(articleInfo.url)) {
      const rendered = await fetchWithRetry(articleInfo.url, 1, 0, {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9'
        },
        forcePuppeteer: true,
        puppeteerDomains: CONFIG.puppeteerDomains
      });

      if (rendered && rendered !== html) {
        const retryResult = extractArticle(rendered, {
          minContentLength: CONFIG.minContentLength,
          maxContentLength: CONFIG.maxContentLength,
          minParagraphs: CONFIG.minParagraphs,
          debugMode: CONFIG.debugMode
        });

        if (retryResult.success) {
          return {
            ...articleInfo,
            ...retryResult.data
          };
        }
      }
    }

    console.log(`    📌 内容质量不足:`);
    result.failures.forEach(failure => {
      console.log(`       - ${failure}`);
    });
    return null;
  }

  return {
    ...articleInfo,
    ...result.data
  };
}

// 检查文章是否已存在（增强的去重逻辑）
async function articleExists(url, title) {
  // 检查 1: 通过 URL
  const { data: urlMatch } = await supabase
    .from('articles')
    .select('id')
    .ilike('license', `%${url}%`)
    .limit(1);

  if (urlMatch && urlMatch.length > 0) {
    return { exists: true, reason: 'URL已存在' };
  }

  // 检查 2: 通过标题（防止同一文章不同URL）
  const slug = generateSlug(title);
  const { data: slugMatch } = await supabase
    .from('articles')
    .select('id')
    .eq('slug', slug)
    .limit(1);

  if (slugMatch && slugMatch.length > 0) {
    return { exists: true, reason: 'slug已存在（标题重复）' };
  }

  return { exists: false };
}

// generateSlug 和 extractKeywords 现在从 scraper-utils 导入

// 映射 region 到数据库支持的值
function mapRegion(region) {
  return REGION_MAPPING[region] || 'Global';
}

// 保存文章到数据库
async function saveArticle(articleData) {
  try {
    const slug = generateSlug(articleData.title);
    const mappedRegion = mapRegion(articleData.region);

    // 双重检查是否已存在
    const existsCheck = await articleExists(articleData.url, articleData.title);
    if (existsCheck.exists) {
      return { success: false, reason: existsCheck.reason };
    }

    // 确保 one_liner 至少 50 字符
    const oneLiner = articleData.content.substring(0, 200);
    const paddedOneLiner = oneLiner.length < 50 
      ? oneLiner + ' Evidence-based information from trusted health organizations.'
      : oneLiner;

    const article = {
      slug,
      type: 'explainer',
      hub: 'feeding',
      lang: articleData.language || 'en',
      title: articleData.title.substring(0, 200),
      one_liner: paddedOneLiner.substring(0, 200),
      key_facts: [
        `Source: ${articleData.source}`,
        `Region: ${articleData.region}`,
        'Evidence-based information for parents'
      ],
      body_md: articleData.content,
      entities: extractKeywords(articleData.content),
      age_range: '0-12 months',
      region: mappedRegion,  // 使用映射后的 region
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

    // 只检查 URL，标题检查在保存时进行
    const existsCheck = await articleExists(article.url, '');
    if (!existsCheck.exists) {
      articlesToScrape.push(article);
    } else {
      console.log(`  ⏭️  跳过: ${article.url} (${existsCheck.reason})`);
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
  
  // 返回统计结果（用于API调用）
  return {
    total: stats.discovered,
    successful: stats.successful,
    failed: stats.failed,
    skipped: stats.discovered - stats.attempted,
    byRegion: stats.byRegion
  };
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
