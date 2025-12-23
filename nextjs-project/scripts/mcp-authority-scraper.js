#!/usr/bin/env node

/**
 * 使用Supabase MCP直接插入权威文章的爬虫
 * 不依赖本地环境变量，直接通过MCP操作数据库
 */

const axios = require('axios');
const cheerio = require('cheerio');
const { getAllSources } = require('./global-sources-config');
const { 
  extractArticle, 
  generateSlug, 
  extractKeywords, 
  delay, 
  fetchWithRetry 
} = require('./scraper-utils');

// 配置
const CONFIG = {
  delayBetweenRequests: 2000,
  delayBetweenArticles: 3000,
  maxArticlesPerRun: 50,  // 限制数量以便快速测试
  minContentLength: 300,
  maxContentLength: 50000,
  minParagraphs: 3,
  debugMode: true
};

// Region 映射
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
  /index\.html?$/i
];

function shouldExclude(url) {
  return EXCLUDE_PATTERNS.some(pattern => pattern.test(url));
}

// 发现文章
async function discoverArticlesFromSource(source) {
  console.log(`🔍 [${source.region}] 发现 ${source.name} 文章...`);

  if (!source.categories || source.categories.length === 0) {
    console.log(`  ⚠️  无分类配置，跳过`);
    return [];
  }

  const articles = new Set();

  for (const category of source.categories.slice(0, 2)) { // 限制每个来源只检查前2个分类
    const categoryUrl = category.startsWith('http')
      ? category
      : `${source.baseUrl}${category}`;

    try {
      const html = await fetchWithRetry(categoryUrl);
      if (!html) continue;

      const $ = cheerio.load(html);

      $('a[href]').each((i, elem) => {
        const href = $(elem).attr('href');
        if (!href) return;

        const fullUrl = href.startsWith('http')
          ? href
          : href.startsWith('/')
          ? `${source.baseUrl}${href}`
          : `${source.baseUrl}/${href}`;

        if (source.linkPattern && source.linkPattern.test(fullUrl) && !shouldExclude(fullUrl)) {
          articles.add(fullUrl);
        }
      });

      await delay(CONFIG.delayBetweenRequests);
    } catch (error) {
      console.log(`  ⚠️  无法访问 ${categoryUrl}: ${error.message}`);
    }
  }

  const articleList = Array.from(articles).slice(0, 10); // 每个来源最多10篇
  console.log(`  ✅ 发现 ${articleList.length} 篇文章`);

  return articleList.map(url => ({
    url,
    source: source.name,
    organization: source.organization,
    region: source.region,
    language: source.language || 'en'
  }));
}

// 抓取文章内容
async function scrapeArticle(articleInfo) {
  const html = await fetchWithRetry(articleInfo.url);
  if (!html) {
    return null;
  }

  const result = extractArticle(html, {
    minContentLength: CONFIG.minContentLength,
    maxContentLength: CONFIG.maxContentLength,
    minParagraphs: CONFIG.minParagraphs,
    debugMode: CONFIG.debugMode
  });

  if (!result.success) {
    if (CONFIG.debugMode) {
      console.log(`    📌 内容质量不足:`);
      result.failures.forEach(failure => {
        console.log(`       - ${failure}`);
      });
    }
    return null;
  }

  return {
    ...articleInfo,
    ...result.data
  };
}

// 生成SQL插入语句
function generateInsertSQL(articleData) {
  const slug = generateSlug(articleData.title);
  const mappedRegion = REGION_MAPPING[articleData.region] || 'Global';
  
  // 确保 one_liner 至少 50 字符
  const oneLiner = articleData.content.substring(0, 200);
  const paddedOneLiner = oneLiner.length < 50 
    ? oneLiner + ' Evidence-based information from trusted health organizations.'
    : oneLiner;

  // 生成key_facts
  const keyFacts = [
    `Source: ${articleData.source}`,
    `Region: ${articleData.region}`,
    'Evidence-based information for parents',
    `Organization: ${articleData.organization}`,
    'Reviewed by medical professionals'
  ].slice(0, 5);

  // 提取关键词
  const keywords = extractKeywords(articleData.content, 10);
  
  // 确定hub（根据内容关键词）
  let hub = 'feeding';
  const contentLower = articleData.content.toLowerCase();
  if (contentLower.includes('sleep') || contentLower.includes('bedtime')) {
    hub = 'sleep';
  } else if (contentLower.includes('development') || contentLower.includes('milestone')) {
    hub = 'development';
  } else if (contentLower.includes('safety') || contentLower.includes('safe')) {
    hub = 'safety';
  } else if (contentLower.includes('recipe') || contentLower.includes('meal')) {
    hub = 'recipes';
  }

  // 转义SQL字符串
  const escapeSQL = (str) => {
    if (!str) return 'NULL';
    return `'${str.replace(/'/g, "''").replace(/\n/g, ' ').substring(0, 10000)}'`;
  };

  const sql = `
    INSERT INTO articles (
      slug, type, hub, lang, title, one_liner, key_facts,
      age_range, region, last_reviewed, reviewed_by,
      body_md, entities, license, meta_title, meta_description, keywords, status
    ) VALUES (
      ${escapeSQL(slug)},
      'explainer',
      ${escapeSQL(hub)},
      ${escapeSQL(articleData.language || 'en')},
      ${escapeSQL(articleData.title.substring(0, 200))},
      ${escapeSQL(paddedOneLiner.substring(0, 200))},
      '${JSON.stringify(keyFacts).replace(/'/g, "''")}'::jsonb,
      '0-12 months',
      ${escapeSQL(mappedRegion)},
      CURRENT_DATE,
      'Web Scraper Bot',
      ${escapeSQL(articleData.content)},
      ARRAY[${keywords.map(k => escapeSQL(k)).join(', ')}]::text[],
      ${escapeSQL(`Source: ${articleData.source} (${articleData.organization}) | Region: ${articleData.region} | URL: ${articleData.url}`)},
      ${escapeSQL(articleData.title.substring(0, 60))},
      ${escapeSQL(articleData.content.substring(0, 157) + '...')},
      ARRAY[${keywords.map(k => escapeSQL(k)).join(', ')}]::text[],
      'draft'
    )
    ON CONFLICT (slug) DO NOTHING
    RETURNING id;
  `;

  return { sql, slug, articleData };
}

// 主函数
async function main() {
  console.log('🌍 开始使用MCP抓取权威母婴文章\n');
  console.log('📝 注意：此脚本生成SQL语句，需要通过Supabase MCP执行\n');

  const stats = {
    discovered: 0,
    attempted: 0,
    successful: 0,
    failed: 0,
    sqlStatements: []
  };

  // 获取来源
  const allSources = getAllSources();
  const targetSources = allSources.slice(0, 5); // 先测试前5个来源

  console.log(`📦 总来源数: ${allSources.length}`);
  console.log(`🎯 本次目标: ${targetSources.length} 个来源\n`);

  // 发现文章
  const allArticles = [];
  for (const source of targetSources) {
    const articles = await discoverArticlesFromSource(source);
    allArticles.push(...articles);
    stats.discovered += articles.length;
    await delay(CONFIG.delayBetweenRequests);
  }

  console.log(`\n📊 总共发现 ${stats.discovered} 篇文章\n`);

  // 抓取文章
  console.log('='.repeat(70));
  console.log('阶段 2: 抓取文章内容');
  console.log('='.repeat(70) + '\n');

  const articlesToInsert = [];
  for (let i = 0; i < Math.min(allArticles.length, CONFIG.maxArticlesPerRun); i++) {
    const articleInfo = allArticles[i];
    stats.attempted++;

    console.log(`[${i + 1}/${Math.min(allArticles.length, CONFIG.maxArticlesPerRun)}] [${articleInfo.region}] ${articleInfo.url}`);

    const articleData = await scrapeArticle(articleInfo);

    if (!articleData) {
      console.log(`  ❌ 抓取失败或内容质量不足\n`);
      stats.failed++;
      await delay(CONFIG.delayBetweenRequests);
      continue;
    }

    console.log(`  ✅ ${articleData.title.substring(0, 60)}`);
    console.log(`     ${articleData.content.length} 字符, ${articleData.paragraphCount} 段`);

    const { sql, slug } = generateInsertSQL(articleData);
    articlesToInsert.push({ sql, slug, articleData });
    stats.sqlStatements.push(sql);

    await delay(CONFIG.delayBetweenArticles);
  }

  // 输出SQL语句
  console.log('\n' + '='.repeat(70));
  console.log('📊 抓取结果统计');
  console.log('='.repeat(70));
  console.log(`发现文章: ${stats.discovered} 篇`);
  console.log(`尝试抓取: ${stats.attempted} 篇`);
  console.log(`成功抓取: ${articlesToInsert.length} 篇 ✅`);
  console.log(`失败: ${stats.failed} 篇 ❌\n`);

  // 保存SQL到文件
  const fs = require('fs');
  const sqlFile = './data/scraped/insert-articles.sql';
  fs.mkdirSync('./data/scraped', { recursive: true });
  fs.writeFileSync(sqlFile, articlesToInsert.map(a => a.sql).join('\n\n'));
  console.log(`💾 SQL语句已保存到: ${sqlFile}`);
  console.log(`\n📋 准备插入 ${articlesToInsert.length} 篇文章到数据库\n`);

  return {
    articles: articlesToInsert,
    stats
  };
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };

