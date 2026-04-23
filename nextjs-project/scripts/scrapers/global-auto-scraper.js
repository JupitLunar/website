#!/usr/bin/env node

/**
 * 全球自动爬虫 - 支持多地区权威来源
 * 优化版本 - 使用共享工具模块
 */

const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');
const { getAllSources, getSourcesByRegion, getAllRegions } = require('./global-sources-config');
const {
  extractArticle,
  generateSlug,
  extractKeywords,
  buildContentOneLiner,
  buildMetaTitle,
  buildMetaDescription,
  buildDefaultKeyFacts,
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

// 参数解析
function getArg(flag, fallback) {
  const idx = process.argv.indexOf(flag);
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1];
  return fallback;
}

const argLimit = parseInt(getArg('--limit', '500'));
const argRegions = getArg('--regions', '');
const argSources = getArg('--sources', '');
const argPriority = (getArg('--priority', '') || '').toUpperCase();
const quickMode = process.argv.includes('--quick');
const medicalOnly = process.argv.includes('--medical-only');

// 配置
const CONFIG = {
  delayBetweenRequests: quickMode ? 500 : 1500,  // 快速模式下减少延迟
  delayBetweenArticles: quickMode ? 1000 : 2500,
  maxArticlesPerRun: argLimit,
  minContentLength: 150,
  maxContentLength: 200000,
  minParagraphs: 1,
  debugMode: process.env.DEBUG === 'true',
  targetRegions: argRegions ? argRegions.split(',') : [],
  targetSources: argSources ? argSources.split(',') : [],
  priority: argPriority || null,
  medicalOnly,
  topicFilterEnabled: true,
  usePuppeteerFallback: true,
  puppeteerDomains: [
    'healthychildren.org',
    'cdc.gov',
    'nhs.uk',
    'canada.ca',
    'mayoclinic.org',
    'stanfordchildrens.org'
  ],
  fetchRetryCount: 3,
  fetchRetryDelay: 2000
};

// Region 映射 - 将所有 region 映射到数据库支持的值
const REGION_MAPPING = {
  'US': 'US',
  'CA': 'CA',
  'MX': 'Global',
  'UK': 'Global',
  'AU': 'Global',
  'NZ': 'Global',
  'SG': 'Global',
  'EU': 'Global',
  'Global': 'Global'
};

// 排除模式
const EXCLUDE_PATTERNS = [
  /default\.aspx$/i,
  /\/Pages\/?$/i,
  /\/site\.html?$/i,
  /%7b[^/]+%7d/i,
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
  'tools.cdc.gov',
  'espanol.womenshealth.gov',
  'facebook.com',
  'instagram.com',
  'linkedin.com',
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
  /vitamin|iron/i,
  /newborn|neonatal|infant|baby/i,
  /pregnan|postpartum|maternal/i,
  /safe[-\s]?sleep|sleep[-\s]?related|sids|crib|bassinet|tummy[-\s]?time/i,
  /mental[-\s]?health|depression|anxiety/i,
  /medication|medicine|drug|lactmed/i,
  /allergy|anaphylaxis|vaccine|immunization|rsv|flu|fever/i,
  /food[-\s]?safety|choking|poison|injury|safety/i,
  /development|milestone/i,
  /research|clinical|guideline|recommendation|policy/i
];

const PRIORITY_RANK = {
  P0: 0,
  P1: 1,
  P2: 2,
  P3: 3
};

function normalizeCandidateUrl(rawUrl) {
  if (!rawUrl) return null;
  try {
    const parsed = new URL(rawUrl);
    parsed.hash = '';
    const removableParams = [];
    parsed.searchParams.forEach((value, key) => {
      if (/^utm_/i.test(key) || /^fbclid$/i.test(key) || /^gclid$/i.test(key) || /^_ga$/i.test(key) || /^_gl$/i.test(key)) {
        removableParams.push(key);
      }
    });
    removableParams.forEach((key) => parsed.searchParams.delete(key));
    if (parsed.pathname.length > 1) {
      parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    }
    return parsed.toString();
  } catch {
    return rawUrl;
  }
}

async function fetchPage(url, source = null, mode = 'default') {
  const discoveryMode = mode === 'discovery';
  try {
    return await fetchWithRetry(url, CONFIG.fetchRetryCount, CONFIG.fetchRetryDelay, {
      headers: {
        'Accept-Language': 'en-US,en;q=0.9',
        ...((source && source.requestHeaders) || {})
      },
      timeout: discoveryMode ? Math.min(source?.requestTimeout || 30000, 20000) : (source?.requestTimeout || 30000),
      usePuppeteerFallback: discoveryMode ? Boolean(source?.discoveryUsePuppeteer) : CONFIG.usePuppeteerFallback,
      forcePuppeteer: discoveryMode ? false : Boolean(source?.forcePuppeteer),
      preferPlaywright: Boolean(source?.preferPlaywright),
      puppeteerDomains: CONFIG.puppeteerDomains,
      puppeteerTimeout: source?.browserTimeout || 45000,
      browserHeadless: source?.browserHeadless ?? true
    });
  } catch {
    return null;
  }
}

function shouldExclude(url, source) {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return true;
    }
    const host = parsed.hostname.toLowerCase();
    if (EXCLUDE_HOSTS.some(domain => host.endsWith(domain))) {
      return true;
    }
    if (source?.baseUrl && !source.allowExternalLinks) {
      const sourceHost = new URL(source.baseUrl).hostname.toLowerCase();
      if (host !== sourceHost && !host.endsWith(`.${sourceHost}`)) {
        return true;
      }
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

  if (/\/espanol(\/|$)/i.test(url)) {
    return true;
  }

  if (source && Array.isArray(source.excludePatterns)) {
    if (source.excludePatterns.some(pattern => pattern.test(url))) {
      return true;
    }
  }

  const pageRule = getPageRule(source, url);
  if (pageRule?.exclude) {
    return true;
  }

  return EXCLUDE_PATTERNS.some(pattern => pattern.test(url));
}

function getPageRule(source, url) {
  if (!source || !Array.isArray(source.pageRules) || !url) return null;
  return source.pageRules.find((rule) => {
    if (!rule?.match) return false;
    if (rule.match instanceof RegExp) return rule.match.test(url);
    if (typeof rule.match === 'string') return url.includes(rule.match);
    return false;
  }) || null;
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

  const articles = new Map();
  const discoveryQueue = [];
  const seenDiscoveryPages = new Set();
  const discoveryDepth = source.discoveryDepth || 0;
  const discoveryMaxPages = source.discoveryMaxPages || 0;
  const discoveryLinkPattern = source.discoveryLinkPattern || source.linkPattern;

  function addArticle(url, extra = {}) {
    if (!url) return;
    url = normalizeCandidateUrl(url.trim());
    if (!url) return;
    const existing = articles.get(url) || {};
    articles.set(url, {
      ...existing,
      ...extra,
      url
    });
  }

  function enqueueDiscovery(url, depth = 0) {
    if (!url || depth > discoveryDepth) return;
    url = normalizeCandidateUrl(url);
    if (!url) return;
    if (seenDiscoveryPages.has(url)) return;
    seenDiscoveryPages.add(url);
    discoveryQueue.push({ url, depth });
  }

  function maybeAddArticle(url, extra = {}) {
    if (!url) return;
    url = normalizeCandidateUrl(url);
    if (!url) return;
    if (shouldExclude(url, source) || !matchesTopic(url)) return;
    if (source.linkPattern && !source.linkPattern.test(url)) return;
    addArticle(url, extra);
  }

  function collectLinksFromHtml(html, pageUrl, depth = 0) {
    if (!html) return;
    const $ = cheerio.load(html);

    $('a[href]').each((i, elem) => {
      const href = $(elem).attr('href');
      if (!href) return;

      let fullUrl;
      try {
        fullUrl = href.startsWith('http')
          ? href
          : href.startsWith('/')
            ? `${source.baseUrl}${href}`
            : new URL(href, pageUrl).href;
      } catch {
        return;
      }

      if (discoveryLinkPattern && !discoveryLinkPattern.test(fullUrl)) {
        return;
      }

      maybeAddArticle(fullUrl);

      if (depth < discoveryDepth && !shouldExclude(fullUrl, source) && matchesTopic(fullUrl)) {
        enqueueDiscovery(fullUrl, depth + 1);
      }
    });
  }

  if (Array.isArray(source.directSeeds) && source.directSeeds.length > 0) {
    source.directSeeds.forEach((seedUrl) => {
      if (!shouldExclude(seedUrl, source) && matchesTopic(seedUrl)) {
        addArticle(seedUrl, { directSeed: true });
        enqueueDiscovery(seedUrl, 0);
      }
    });
  }

  if (!source.directSeedOnly && source.categories && source.categories.length > 0) {
    for (const category of source.categories) {
      const categoryUrl = category.startsWith('http')
        ? category
        : `${source.baseUrl}${category}`;

      const html = await fetchPage(categoryUrl, source, 'discovery');
      if (!html) continue;

      // Also treat the seed page itself as a candidate when it looks like a content page.
      if (!shouldExclude(categoryUrl, source) && matchesTopic(categoryUrl)) {
        addArticle(categoryUrl);
      }
      enqueueDiscovery(categoryUrl, 0);
      collectLinksFromHtml(html, categoryUrl, 0);

      await delay(CONFIG.delayBetweenRequests);
    }
  }

  if (!source.directSeedOnly && source.sitemapUrl) {
    const sitemapXml = await fetchPage(source.sitemapUrl, source, 'discovery');
    if (sitemapXml) {
      const urlBlocks = sitemapXml.match(/<url>[\s\S]*?<\/url>/g) || [];
      urlBlocks.forEach((block) => {
        const fullUrl = (block.match(/<loc>([\s\S]*?)<\/loc>/i) || [])[1]?.trim();
        const lastmod = (block.match(/<lastmod>([\s\S]*?)<\/lastmod>/i) || [])[1]?.trim();
        if (!fullUrl) return;
        if (source.linkPattern && !source.linkPattern.test(fullUrl)) return;
        if (shouldExclude(fullUrl, source) || !matchesTopic(fullUrl)) return;
        addArticle(fullUrl, { lastmod: lastmod || null });
        if (discoveryDepth > 0) {
          enqueueDiscovery(fullUrl, 0);
        }
      });
    }
  }

  if (!source.directSeedOnly && source.searchUrl) {
    const html = await fetchPage(source.searchUrl, source, 'discovery');
    if (html) {
      collectLinksFromHtml(html, source.searchUrl, 0);
      enqueueDiscovery(source.searchUrl, 0);
    }
  }

  if (discoveryDepth > 0) {
    let processedPages = 0;
    while (discoveryQueue.length > 0) {
      if (discoveryMaxPages > 0 && processedPages >= discoveryMaxPages) {
        break;
      }

      const { url, depth } = discoveryQueue.shift();
      const html = await fetchPage(url, source, 'discovery');
      if (!html) {
        continue;
      }

      collectLinksFromHtml(html, url, depth);
      processedPages += 1;
      await delay(CONFIG.delayBetweenRequests);
    }
  }

  if ((!source.categories || source.categories.length === 0) && !source.sitemapUrl && !source.searchUrl && (!source.directSeeds || source.directSeeds.length === 0)) {
    console.log(`  ⚠️  无分类配置，跳过`);
    return [];
  }

  const articleList = Array.from(articles.values());
  console.log(`  ✅ 发现 ${articleList.length} 篇文章`);

  return articleList.map((entry) => ({
    ...(function buildArticle() {
      const pageRule = getPageRule(source, entry.url);
      return {
        url: entry.url,
        source: source.name,
        organization: source.organization,
        grade: source.grade,
        region: source.region,
        language: source.language,
        sourceKey: source.key,
        sourcePriority: source.priority || 'P2',
        authorityClass: source.authorityClass || null,
        lastmod: entry.lastmod || null,
        extractOptions: {
          ...(source.extractOptions || {}),
          ...((pageRule && pageRule.extractOptions) || {})
        },
        forcePuppeteer: pageRule?.forcePuppeteer ?? Boolean(source.forcePuppeteer),
        requestHeaders: {
          ...(source.requestHeaders || {}),
          ...((pageRule && pageRule.requestHeaders) || {})
        },
        requestTimeout: pageRule?.requestTimeout ?? source.requestTimeout ?? 30000,
        browserTimeout: pageRule?.browserTimeout ?? source.browserTimeout ?? 45000,
        browserHeadless: pageRule?.browserHeadless ?? source.browserHeadless ?? true,
        preferPlaywright: pageRule?.preferPlaywright ?? source.preferPlaywright ?? false
      };
    })()
  }));
}

// 抓取文章内容（使用共享工具）
async function scrapeArticle(articleInfo) {
  const extractionOptions = {
    ...(articleInfo.extractOptions || {}),
    minContentLength: articleInfo.extractOptions?.minContentLength ?? CONFIG.minContentLength,
    maxContentLength: articleInfo.extractOptions?.maxContentLength ?? CONFIG.maxContentLength,
    minParagraphs: articleInfo.extractOptions?.minParagraphs ?? CONFIG.minParagraphs,
    debugMode: CONFIG.debugMode
  };

  const html = await fetchWithRetry(articleInfo.url, CONFIG.fetchRetryCount, CONFIG.fetchRetryDelay, {
    headers: {
      'Accept-Language': 'en-US,en;q=0.9',
      ...(articleInfo.requestHeaders || {})
    },
    timeout: articleInfo.requestTimeout || 30000,
    forcePuppeteer: Boolean(articleInfo.forcePuppeteer),
    preferPlaywright: Boolean(articleInfo.preferPlaywright),
    usePuppeteerFallback: CONFIG.usePuppeteerFallback,
    puppeteerDomains: CONFIG.puppeteerDomains,
    puppeteerTimeout: articleInfo.browserTimeout || 45000,
    browserHeadless: articleInfo.browserHeadless ?? true
  });
  if (!html) {
    console.log(`    📌 原因: 无法获取HTML`);
    return null;
  }

  // 使用共享工具提取文章
  const result = extractArticle(html, {
    ...extractionOptions,
    disallowedTitlePatterns: [
      /^(error page|not found|page not found|site index|document|infant and toddler health)$/i,
      /access denied/i
    ],
    disallowedContentPatterns: [
      /404[\s\S]{0,80}not found/i,
      /the page you requested could not be found/i,
      /site index/i
    ],
    debugMode: CONFIG.debugMode
  });

  if (!result.success) {
    if (CONFIG.usePuppeteerFallback && shouldForcePuppeteer(articleInfo.url)) {
      const rendered = await fetchWithRetry(articleInfo.url, 1, 0, {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9'
        },
        timeout: articleInfo.requestTimeout || 30000,
        forcePuppeteer: true,
        preferPlaywright: Boolean(articleInfo.preferPlaywright),
        puppeteerDomains: CONFIG.puppeteerDomains,
        puppeteerTimeout: articleInfo.browserTimeout || 45000,
        browserHeadless: articleInfo.browserHeadless ?? true
      });

      if (rendered && rendered !== html) {
        const retryResult = extractArticle(rendered, {
          ...extractionOptions,
          disallowedTitlePatterns: [
            /^(error page|not found|page not found|site index|document|infant and toddler health)$/i,
            /access denied/i
          ],
          disallowedContentPatterns: [
            /404[\s\S]{0,80}not found/i,
            /the page you requested could not be found/i,
            /site index/i
          ],
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

function getWebsiteHost(url) {
  if (!url) return '';
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return '';
  }
}

function getWebsiteSlugSuffix(url) {
  const host = getWebsiteHost(url);
  return (host || 'source')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'source';
}

function extractStoredUrlFromLicense(license) {
  if (!license) return '';
  const match = license.match(/URL:\s*(https?:\/\/\S+)/i);
  return match ? match[1].trim() : '';
}

async function findSlugMatches(baseSlug) {
  const { data, error } = await supabase
    .from('articles')
    .select('id, slug, license')
    .or(`slug.eq.${baseSlug},slug.ilike.${baseSlug}-%`);

  if (error) {
    throw error;
  }

  return data || [];
}

async function urlAlreadyExists(url) {
  const { data, error } = await supabase
    .from('articles')
    .select('id')
    .ilike('license', `%${url}%`)
    .limit(1);

  if (error) {
    throw error;
  }

  return Boolean(data && data.length > 0);
}

// Resolve crawl identity with website-aware title dedupe:
// same URL -> block
// same website + same title -> block
// different website + same title -> allow, with hostname suffix appended to slug
async function resolveArticleIdentity(url, title) {
  const websiteHost = getWebsiteHost(url);

  // 检查 1: 通过 URL
  const alreadyExistsByUrl = await urlAlreadyExists(url);
  if (alreadyExistsByUrl) {
    return { exists: true, reason: 'URL已存在', slug: null };
  }

  const baseSlug = generateSlug(title) || 'article';
  const slugMatches = await findSlugMatches(baseSlug);

  const sameWebsiteMatch = slugMatches.find((row) => {
    const existingHost = getWebsiteHost(extractStoredUrlFromLicense(row.license));
    return existingHost && websiteHost && existingHost === websiteHost;
  });

  if (sameWebsiteMatch) {
    return { exists: true, reason: '同网站标题已存在', slug: null };
  }

  if (slugMatches.length === 0) {
    return { exists: false, slug: baseSlug };
  }

  const websiteSuffix = getWebsiteSlugSuffix(url);
  let candidate = `${baseSlug}-${websiteSuffix}`;
  let attempt = 2;
  const usedSlugs = new Set(slugMatches.map((row) => row.slug));

  while (usedSlugs.has(candidate)) {
    candidate = `${baseSlug}-${websiteSuffix}-${attempt}`;
    attempt += 1;
  }

  return { exists: false, slug: candidate };
}

// generateSlug 和 extractKeywords 现在从 scraper-utils 导入

// 映射 region 到数据库支持的值
function mapRegion(region) {
  return REGION_MAPPING[region] || 'Global';
}

function determineHub(articleData) {
  const titleHaystack = `${articleData.url || ''} ${articleData.title || ''}`.toLowerCase();
  const fullHaystack = `${titleHaystack} ${articleData.content || ''}`.toLowerCase();

  if (/(postpartum|postnatal|maternal|pregnan|birth control|after pregnancy|mental health|depression|anxiety|sterilization|labor and delivery)/.test(titleHaystack)) {
    return 'mom-health';
  }
  if (/(safe sleep|sleep-related|sids|bassinet|crib|bed sharing|bedsharing|sleep surface|tummy time|nap|sleep)/.test(titleHaystack)) {
    return 'sleep';
  }
  if (/(feeding|nutrition|breastfeed|breast milk|lactation|formula|milk production|solid food|wean|infant formula|bottle feeding)/.test(titleHaystack)) {
    return 'feeding';
  }
  if (/(milestone|development|crawling|walking|language|speech|weight gain|growth)/.test(titleHaystack)) {
    return 'development';
  }
  if (/(choking|safety|food safety|injury|fever|rsv|flu|vaccine|immuniz|recall|poison|emergency|warning|listeria)/.test(titleHaystack)) {
    return 'safety';
  }

  if (/(safe sleep|sleep-related|sids|bassinet|crib|bed sharing|bedsharing|sleep surface|tummy time|nap|sleep)/.test(fullHaystack)) {
    return 'sleep';
  }
  if (/(feeding|nutrition|breastfeed|breast milk|lactation|formula|milk production|solid food|wean|infant formula|bottle feeding)/.test(fullHaystack)) {
    return 'feeding';
  }
  if (/(milestone|development|crawling|walking|language|speech|weight gain|growth)/.test(fullHaystack)) {
    return 'development';
  }
  if (/(choking|safety|food safety|injury|fever|rsv|flu|vaccine|immuniz|recall|poison|emergency|warning|listeria)/.test(fullHaystack)) {
    return 'safety';
  }
  if (/(postpartum|postnatal|maternal|pregnan|birth control|after pregnancy|mental health|depression|anxiety|sterilization|labor and delivery)/.test(fullHaystack)) {
    return 'mom-health';
  }
  return 'development';
}

function determineType(articleData) {
  const haystack = `${articleData.url || ''} ${articleData.title || ''}`.toLowerCase();
  if (/(study|trial|systematic review|meta-analysis|cochrane|research)/.test(haystack)) {
    return 'research';
  }
  if (/(how to|tips|guide|steps|handling|prepare|clean|sanitize)/.test(haystack)) {
    return 'howto';
  }
  if (/(news|alert|advisory|recall|update)/.test(haystack)) {
    return 'news';
  }
  return 'explainer';
}

function determineAgeRange(articleData) {
  const haystack = `${articleData.url || ''} ${articleData.title || ''} ${articleData.content || ''}`.toLowerCase();
  if (/(postpartum|pregnan|labor|delivery|maternal|breastfeed|lactation)/.test(haystack)) {
    return 'pregnancy-postpartum';
  }
  if (/(newborn|neonatal|0 to 3 months|first weeks)/.test(haystack)) {
    return '0-3 months';
  }
  if (/(infant|baby|0-12 months|first year)/.test(haystack)) {
    return '0-12 months';
  }
  return '0-24 months';
}

function parseDate(dateLike) {
  if (!dateLike) return null;
  const parsed = new Date(dateLike);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function sortArticlesForScraping(articles) {
  return [...articles].sort((a, b) => {
    const priorityDelta = (PRIORITY_RANK[a.sourcePriority] ?? 9) - (PRIORITY_RANK[b.sourcePriority] ?? 9);
    if (priorityDelta !== 0) return priorityDelta;

    const aDate = parseDate(a.lastmod);
    const bDate = parseDate(b.lastmod);
    if (aDate && bDate) return bDate - aDate;
    if (aDate) return -1;
    if (bDate) return 1;
    return a.url.localeCompare(b.url);
  });
}

function saveLocalSnapshot(articleData) {
  const safeSource = (articleData.sourceKey || articleData.source || 'source')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const safeSlug = generateSlug(articleData.title).slice(0, 80) || 'article';
  const outputDir = path.resolve(__dirname, '../../data/scraped');
  fs.mkdirSync(outputDir, { recursive: true });
  const filename = `${safeSource}_${safeSlug}_${Date.now()}.json`;
  const outputPath = path.join(outputDir, filename);

  const payload = {
    source: {
      id: articleData.sourceKey || safeSource,
      name: articleData.source,
      organization: articleData.organization,
      grade: articleData.grade || null,
      priority: articleData.sourcePriority || null,
      authorityClass: articleData.authorityClass || null
    },
    page: {
      url: articleData.url,
      type: determineType(articleData),
      category: determineHub(articleData)
    },
    content: {
      title: articleData.title,
      paragraphs: articleData.paragraphs || [],
      text: articleData.content
    },
    metadata: {
      discoveredLastmod: articleData.lastmod || null,
      publishedDate: articleData.publishedDate || null,
      modifiedDate: articleData.modifiedDate || null,
      scrapedAt: new Date().toISOString(),
      contentLength: articleData.content?.length || 0,
      paragraphCount: articleData.paragraphCount || 0
    }
  };

  fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2));
  return outputPath;
}

// 保存文章到数据库
async function saveArticle(articleData) {
  try {
    const mappedRegion = mapRegion(articleData.region);
    const hub = determineHub(articleData);
    const type = determineType(articleData);
    const ageRange = determineAgeRange(articleData);
    const publishedDate = articleData.publishedDate || articleData.lastmod || new Date().toISOString();
    const modifiedDate = articleData.modifiedDate || articleData.lastmod || publishedDate;

    // 允许不同网站的相同标题入库，但同网站同标题仍然去重
    const identity = await resolveArticleIdentity(articleData.url, articleData.title);
    if (identity.exists) {
      return { success: false, reason: identity.reason };
    }
    const slug = identity.slug;

    // 确保 one_liner 至少 50 字符
    const oneLiner = buildContentOneLiner(articleData.content, articleData.source);

    const article = {
      slug,
      type,
      hub,
      lang: articleData.language || 'en',
      title: articleData.title.substring(0, 200),
      one_liner: oneLiner,
      key_facts: buildDefaultKeyFacts({
        sourceName: articleData.source,
        region: articleData.region
      }),
      body_md: articleData.content,
      entities: extractKeywords(articleData.content),
      age_range: ageRange,
      region: mappedRegion,  // 使用映射后的 region
      last_reviewed: new Date().toISOString().split('T')[0],
      reviewed_by: 'Web Scraper Bot',
      license: `Source: ${articleData.source} (${articleData.organization}) | Region: ${articleData.region} | URL: ${articleData.url}`,
      date_published: publishedDate,
      date_modified: modifiedDate,
      meta_title: buildMetaTitle(articleData.title),
      meta_description: buildMetaDescription(articleData.content, articleData.source),
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
  let targetSources = CONFIG.targetRegions.length > 0
    ? allSources.filter(s => CONFIG.targetRegions.includes(s.region))
    : allSources;

  if (CONFIG.targetSources.length > 0) {
    const allowed = new Set(CONFIG.targetSources);
    targetSources = targetSources.filter(s => allowed.has(s.key));
  }

  if (CONFIG.priority) {
    targetSources = targetSources.filter(s => (s.priority || '').toUpperCase() === CONFIG.priority);
  }

  if (CONFIG.medicalOnly) {
    const allowedAuthorities = new Set([
      'government',
      'government-regulatory',
      'professional-society',
      'academic-medical-center',
      'government-funded',
      'multilateral',
      'national-child-health-service',
      'nonprofit-health-system'
    ]);
    targetSources = targetSources.filter(s => allowedAuthorities.has(s.authorityClass));
  }

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
  const prioritizedArticles = sortArticlesForScraping(allArticles);
  for (const article of prioritizedArticles) {
    if (articlesToScrape.length >= CONFIG.maxArticlesPerRun) break;

    // 只检查 URL
    const alreadyExistsByUrl = await urlAlreadyExists(article.url);
    if (!alreadyExistsByUrl) {
      articlesToScrape.push(article);
    } else if (CONFIG.debugMode) {
      // console.log(`  ⏭️  跳过: ${article.url} (URL已存在)`);
    }

    // 在收集到足够文章后停止检查
    if (articlesToScrape.length >= CONFIG.maxArticlesPerRun) break;
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
      const snapshotPath = saveLocalSnapshot(articleData);
      console.log(`  💾 已保存 (ID: ${result.id})`);
      console.log(`  🗂️  本地快照: ${snapshotPath}\n`);
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

module.exports = {
  main,
  discoverArticlesFromSource,
  scrapeArticle,
  normalizeCandidateUrl,
  shouldExclude,
  matchesTopic,
  saveArticle,
  saveLocalSnapshot,
  determineHub,
  determineType,
  determineAgeRange
};
