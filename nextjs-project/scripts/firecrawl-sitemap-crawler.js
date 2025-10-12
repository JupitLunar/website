#!/usr/bin/env node

/**
 * Firecrawl Sitemap爬虫
 * 通过网站的sitemap或目录页发现所有母婴文章
 */

const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const FIRECRAWL_API_KEY = 'fc-8446170a8fe542688e8cf234179bb188';

const SITEMAP_CONFIG = {
  maxArticlesPerSite: 200,       // 每个网站最大文章数
  maxTotalArticles: 1000,        // 总最大文章数
  delayBetweenRequests: 4000,    // 请求间隔(ms)
  dailyCreditLimit: 2000,        // 每日Credit限制
  minContentLength: 500          // 最小内容长度
};

// 权威网站的已知文章列表页和分类页
const AUTHORITY_SITE_DIRECTORIES = {
  'AAP_HealthyChildren': {
    name: 'American Academy of Pediatrics',
    baseUrl: 'https://www.healthychildren.org',
    categories: [
      '/English/ages-stages/baby/feeding-nutrition/Pages/default.aspx',
      '/English/ages-stages/baby/breastfeeding/Pages/default.aspx',
      '/English/ages-stages/baby/sleep/Pages/default.aspx',
      '/English/ages-stages/baby/diapers-clothing/Pages/default.aspx',
      '/English/ages-stages/baby/crying-colic/Pages/default.aspx',
      '/English/ages-stages/baby/bathing-skin-care/Pages/default.aspx',
      '/English/ages-stages/baby/Pages/default.aspx',
      '/English/ages-stages/prenatal/Pages/default.aspx',
      '/English/ages-stages/Your-Childs-Checkups/Pages/default.aspx',
      '/English/safety-prevention/at-home/Pages/default.aspx',
      '/English/safety-prevention/at-play/Pages/default.aspx',
      '/English/safety-prevention/on-the-go/Pages/default.aspx',
      '/English/health-issues/injuries-emergencies/Pages/default.aspx',
      '/English/health-issues/conditions/developmental-disabilities/Pages/default.aspx'
    ]
  },
  
  'CDC_Nutrition': {
    name: 'CDC Infant and Toddler Nutrition',
    baseUrl: 'https://www.cdc.gov',
    categories: [
      '/nutrition/infantandtoddlernutrition/foods-and-drinks/index.html',
      '/nutrition/infantandtoddlernutrition/breastfeeding/index.html',
      '/nutrition/infantandtoddlernutrition/formula-feeding/index.html',
      '/nutrition/infantandtoddlernutrition/mealtime/index.html',
      '/ncbddd/childdevelopment/positiveparenting/infants.html',
      '/ncbddd/childdevelopment/positiveparenting/toddlers.html',
      '/ncbddd/childdevelopment/positiveparenting/preschoolers.html'
    ]
  },
  
  'NHS_Baby': {
    name: 'NHS Baby Care',
    baseUrl: 'https://www.nhs.uk',
    categories: [
      '/conditions/baby/weaning-and-feeding/',
      '/conditions/baby/breastfeeding-and-bottle-feeding/',
      '/conditions/baby/babys-development/',
      '/conditions/baby/caring-for-a-newborn/',
      '/conditions/baby/health/',
      '/conditions/baby/first-aid-and-safety/'
    ]
  },
  
  'Mayo_Clinic_Baby': {
    name: 'Mayo Clinic Infant and Toddler Health',
    baseUrl: 'https://www.mayoclinic.org',
    categories: [
      '/healthy-lifestyle/infant-and-toddler-health/basics/infant-health/hlv-20049438',
      '/healthy-lifestyle/infant-and-toddler-health/in-depth/infant-development/art-20048178',
      '/healthy-lifestyle/infant-and-toddler-health/in-depth/healthy-baby/art-20044438'
    ]
  },
  
  'WebMD_Parenting': {
    name: 'WebMD Parenting & Baby',
    baseUrl: 'https://www.webmd.com',
    categories: [
      '/parenting/baby/default.htm',
      '/parenting/baby/baby-care-basics-directory',
      '/parenting/baby/baby-development-directory',
      '/parenting/baby/baby-feeding-directory',
      '/parenting/baby/baby-sleep-directory'
    ]
  },
  
  'KidsHealth': {
    name: 'KidsHealth from Nemours',
    baseUrl: 'https://kidshealth.org',
    categories: [
      '/parent/pregnancy_newborn/pregnancy/pregnancy_calendar_intro.html',
      '/parent/pregnancy_newborn/pregnancy/breastfeed.html',
      '/parent/pregnancy_newborn/formulafeed/formulafeed.html',
      '/parent/growth/feeding/feeding_infants.html',
      '/parent/growth/feeding/solid_foods.html'
    ]
  }
};

/**
 * 发送HTTP请求到Firecrawl API
 */
function makeFirecrawlRequest(endpoint, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'api.firecrawl.dev',
      port: 443,
      path: `/v0${endpoint}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`
      },
      timeout: 120000
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsedData);
          } else {
            reject(new Error(`API Error ${res.statusCode}: ${parsedData.error || responseData}`));
          }
        } catch (error) {
          reject(new Error(`Parse Error: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(postData);
    req.end();
  });
}

/**
 * 抓取目录页面获取文章链接
 */
async function scrapeDirectoryPage(url, siteName) {
  try {
    console.log(`  📄 抓取目录页: ${url}`);
    
    const result = await makeFirecrawlRequest('/scrape', {
      url: url,
      formats: ['markdown'],
      onlyMainContent: true,
      removeBase64Images: true,
      waitFor: 1000
    });

    if (!result.data || !result.data.markdown) {
      throw new Error('未获取到内容');
    }

    const content = result.data.markdown;
    
    // 从内容中提取所有链接
    const linkPattern = /\[([^\]]+)\]\(([^\)]+)\)/g;
    const links = [];
    let match;
    
    while ((match = linkPattern.exec(content)) !== null) {
      const linkText = match[1];
      const linkUrl = match[2];
      
      // 只保留相关链接
      if (isRelevantParentingLink(linkText, linkUrl)) {
        // 转换为完整URL
        const fullUrl = linkUrl.startsWith('http') ? linkUrl : new URL(linkUrl, url).href;
        links.push({
          url: fullUrl,
          title: linkText,
          source: siteName
        });
      }
    }
    
    console.log(`    ✅ 发现 ${links.length} 个相关链接`);
    return links;
    
  } catch (error) {
    console.error(`    ❌ 抓取失败: ${error.message}`);
    return [];
  }
}

/**
 * 判断链接是否与母婴相关
 */
function isRelevantParentingLink(linkText, linkUrl) {
  const text = (linkText + ' ' + linkUrl).toLowerCase();
  
  // 相关关键词
  const relevantKeywords = [
    'baby', 'infant', 'toddler', 'newborn', 'child',
    'feeding', 'nutrition', 'breastfeed', 'formula', 'solid food',
    'sleep', 'nap', 'bedtime',
    'development', 'milestone', 'growth',
    'safety', 'health', 'care',
    'parent', 'mom', 'mother', 'pregnancy'
  ];
  
  // 排除关键词
  const excludeKeywords = [
    'login', 'register', 'subscribe', 'newsletter',
    'about us', 'contact', 'privacy', 'terms',
    'shop', 'buy', 'product', 'advertisement'
  ];
  
  const hasRelevant = relevantKeywords.some(keyword => text.includes(keyword));
  const hasExclude = excludeKeywords.some(keyword => text.includes(keyword));
  
  return hasRelevant && !hasExclude;
}

/**
 * 检查数据库中已存在的文章
 */
async function checkExistingArticles() {
  try {
    console.log('🔍 检查数据库中已存在的文章...');
    
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, body_md')
      .not('body_md', 'is', null);
    
    if (error) {
      console.error('检查现有文章失败:', error);
      return new Set();
    }
    
    console.log(`📋 发现 ${data?.length || 0} 篇已存在的文章`);
    
    const existingUrls = new Set();
    if (data) {
      data.forEach(article => {
        const urlMatches = article.body_md.match(/https?:\/\/[^\s\)]+/g);
        if (urlMatches) {
          urlMatches.forEach(url => existingUrls.add(url));
        }
      });
    }
    
    return existingUrls;
  } catch (error) {
    console.error('检查现有文章失败:', error);
    return new Set();
  }
}

/**
 * 抓取单个文章
 */
async function scrapeArticle(url, source) {
  try {
    const result = await makeFirecrawlRequest('/scrape', {
      url: url,
      formats: ['markdown'],
      onlyMainContent: true,
      removeBase64Images: true,
      waitFor: 1000
    });

    if (!result.data || !result.data.markdown) {
      throw new Error('未获取到内容');
    }

    const content = result.data.markdown;
    const title = result.data.metadata?.title || 'Untitled';
    const wordCount = content.length;

    if (wordCount < SITEMAP_CONFIG.minContentLength) {
      throw new Error(`内容太短 (${wordCount} < ${SITEMAP_CONFIG.minContentLength})`);
    }

    return {
      success: true,
      url: url,
      title: title,
      content: content,
      wordCount: wordCount,
      source: source,
      creditsUsed: 2
    };

  } catch (error) {
    return {
      success: false,
      url: url,
      error: error.message,
      creditsUsed: 0
    };
  }
}

/**
 * 保存文章到数据库
 */
async function saveArticle(article) {
  try {
    const articleData = {
      slug: generateSlug(article.title),
      type: 'explainer',
      hub: mapCategoryToHub(article.title, article.content),
      lang: 'en',
      title: article.title,
      one_liner: generateOneLiner(article.content),
      key_facts: extractKeyFacts(article.content),
      body_md: article.content,
      entities: extractEntities(article.content),
      age_range: extractAgeRange(article.content),
      region: 'Global',
      last_reviewed: new Date().toISOString().split('T')[0],
      reviewed_by: 'Firecrawl Sitemap Crawler',
      license: `Source: ${article.source}`,
      status: 'draft'
    };
    
    const { data: existing } = await supabase
      .from('articles')
      .select('id')
      .eq('slug', articleData.slug)
      .limit(1);
    
    if (existing && existing.length > 0) {
      return { success: false, reason: 'duplicate' };
    }
    
    const { data, error } = await supabase
      .from('articles')
      .insert([articleData])
      .select();
    
    if (error) {
      return { success: false, reason: 'db_error', error: error.message };
    }
    
    return { success: true, id: data[0].id };
    
  } catch (error) {
    return { success: false, reason: 'exception', error: error.message };
  }
}

/**
 * 主执行函数
 */
async function executeSitemapCrawl() {
  console.log('🗺️  Firecrawl Sitemap爬虫');
  console.log('='.repeat(70));
  console.log(`🔑 API密钥: ${FIRECRAWL_API_KEY.substring(0, 10)}...`);
  console.log(`📊 配置: 每站最大${SITEMAP_CONFIG.maxArticlesPerSite}篇`);
  console.log(`💰 每日Credit限制: ${SITEMAP_CONFIG.dailyCreditLimit}`);
  
  const existingUrls = await checkExistingArticles();
  
  let totalCreditsUsed = 0;
  let totalArticlesScraped = 0;
  let totalArticlesSaved = 0;
  
  for (const [siteKey, siteConfig] of Object.entries(AUTHORITY_SITE_DIRECTORIES)) {
    console.log(`\n🌐 处理网站: ${siteConfig.name}`);
    console.log(`📂 目录页数量: ${siteConfig.categories.length}`);
    
    const allLinks = [];
    
    // 抓取所有目录页获取链接
    for (const categoryPath of siteConfig.categories) {
      const categoryUrl = siteConfig.baseUrl + categoryPath;
      const links = await scrapeDirectoryPage(categoryUrl, siteConfig.name);
      allLinks.push(...links);
      
      totalCreditsUsed += 2; // 抓取目录页消耗credit
      
      await delay(SITEMAP_CONFIG.delayBetweenRequests);
      
      if (totalCreditsUsed >= SITEMAP_CONFIG.dailyCreditLimit) {
        console.log(`\n⚠️  已达到每日Credit限制`);
        break;
      }
    }
    
    // 去重
    const uniqueLinks = [];
    const seenUrls = new Set();
    allLinks.forEach(link => {
      if (!seenUrls.has(link.url) && !existingUrls.has(link.url)) {
        seenUrls.add(link.url);
        uniqueLinks.push(link);
      }
    });
    
    console.log(`\n📊 ${siteConfig.name} 链接统计:`);
    console.log(`  🔗 总发现链接: ${allLinks.length}`);
    console.log(`  🆕 新链接: ${uniqueLinks.length}`);
    
    // 限制数量
    const linksToScrape = uniqueLinks.slice(0, SITEMAP_CONFIG.maxArticlesPerSite);
    
    console.log(`\n🚀 开始抓取 ${linksToScrape.length} 篇文章...`);
    
    for (let i = 0; i < linksToScrape.length; i++) {
      const link = linksToScrape[i];
      console.log(`  ${i + 1}/${linksToScrape.length} ${link.title.substring(0, 50)}...`);
      
      const article = await scrapeArticle(link.url, siteConfig.name);
      
      if (article.success) {
        totalArticlesScraped++;
        totalCreditsUsed += article.creditsUsed;
        
        const saveResult = await saveArticle(article);
        if (saveResult.success) {
          console.log(`    ✅ 保存成功 - ID: ${saveResult.id}`);
          totalArticlesSaved++;
        } else {
          console.log(`    ⏭️  ${saveResult.reason}`);
        }
      } else {
        console.log(`    ❌ ${article.error}`);
      }
      
      await delay(SITEMAP_CONFIG.delayBetweenRequests);
      
      if (totalCreditsUsed >= SITEMAP_CONFIG.dailyCreditLimit) {
        console.log(`\n⚠️  已达到每日Credit限制`);
        break;
      }
    }
    
    if (totalCreditsUsed >= SITEMAP_CONFIG.dailyCreditLimit) {
      break;
    }
  }
  
  console.log('\n📊 最终统计:');
  console.log(`  ✅ 成功抓取: ${totalArticlesScraped} 篇`);
  console.log(`  💾 成功保存: ${totalArticlesSaved} 篇`);
  console.log(`  💰 Credit消耗: ${totalCreditsUsed}`);
  console.log('\n✅ Sitemap爬虫完成');
}

// 辅助函数
function generateSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').substring(0, 100);
}

function generateOneLiner(content) {
  const sentences = content.split(/[.!?]+/);
  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (trimmed.length >= 50 && trimmed.length <= 200) return trimmed;
  }
  return 'Expert guidance on maternal and infant health from authoritative medical sources.';
}

function extractKeyFacts(content) {
  const facts = [];
  const sentences = content.split(/[.!?]+/);
  sentences.forEach(sentence => {
    const trimmed = sentence.trim();
    if (trimmed.length > 20 && trimmed.length < 200 && (/\d/.test(trimmed) || trimmed.toLowerCase().includes('important'))) {
      facts.push(trimmed);
    }
  });
  return facts.slice(0, 8);
}

function extractEntities(content) {
  const entities = [];
  const keywords = ['baby', 'infant', 'toddler', 'feeding', 'nutrition', 'breastfeeding', 'sleep', 'development'];
  keywords.forEach(keyword => {
    if (content.toLowerCase().includes(keyword)) entities.push(keyword);
  });
  return entities;
}

function extractAgeRange(content) {
  const match = content.match(/(\d+)\s*-\s*(\d+)\s*(month|year|months|years)/i);
  return match ? `${match[1]}-${match[2]} ${match[3]}` : '0-24 months';
}

function mapCategoryToHub(title, content) {
  const text = (title + ' ' + content).toLowerCase();
  if (text.includes('feeding') || text.includes('nutrition')) return 'feeding';
  if (text.includes('sleep')) return 'sleep';
  if (text.includes('development') || text.includes('milestone')) return 'development';
  if (text.includes('safety')) return 'safety';
  return 'feeding';
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  try {
    await executeSitemapCrawl();
  } catch (error) {
    console.error('❌ Sitemap爬虫失败:', error);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, executeSitemapCrawl };
