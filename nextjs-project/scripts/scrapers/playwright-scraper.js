#!/usr/bin/env node

/**
 * Playwright 爬虫 - 用于反爬站点
 * 使用 playwright-extra 和 stealth 插件来访问被反爬的权威网站
 */

const { chromium } = require('playwright');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const {
  extractArticle,
  generateSlug,
  extractKeywords,
  buildContentOneLiner,
  buildMetaTitle,
  buildMetaDescription,
  buildDefaultKeyFacts,
  delay
} = require('./scraper-utils');
const { GLOBAL_SOURCES, getAllSources } = require('./global-sources-config');

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

// 反爬站点配置（只包含可以访问的站点）
const ANTI_CRAWL_SITES = {
  'UK_NHS': {
    name: 'National Health Service (NHS)',
    organization: 'NHS',
    baseUrl: 'https://www.nhs.uk',
    region: 'UK',
    language: 'en',
    categories: [
      '/baby/weaning-and-feeding/',
      '/baby/breastfeeding-bottle-feeding/'
    ],
    linkPattern: /\/baby\/(weaning-and-feeding|breastfeeding-bottle-feeding)\/[^\/]+\/$/,
    contentSelector: 'article, .article-body, #maincontent',
    excludePatterns: []
  },
  'UK_NHS_START4LIFE': {
    name: 'NHS Start4Life',
    organization: 'NHS',
    baseUrl: 'https://www.nhs.uk/start4life',
    region: 'UK',
    language: 'en',
    categories: [
      '/baby/feeding-your-baby/',
      '/baby/sleep/',
      '/baby/'
    ],
    linkPattern: /\/baby\/[^\/]+\/$/,
    contentSelector: 'article, .article-body, main',
    excludePatterns: []
  },
  'US_MAYO_CLINIC': {
    name: 'Mayo Clinic',
    organization: 'Mayo Clinic',
    baseUrl: 'https://www.mayoclinic.org',
    region: 'US',
    language: 'en',
    sitemapUrl: 'https://www.mayoclinic.org/sitemap-articles.xml',
    linkPattern: /\/infant-and-toddler-health\/in-depth\/[^\/]+\/art-/,
    contentSelector: 'article, .article-body, main',
    excludePatterns: []
  },
  /* 以下站点当前无法访问，已注释
  'US_AAP': {
    name: 'American Academy of Pediatrics',
    organization: 'AAP',
    baseUrl: 'https://www.healthychildren.org',
    region: 'US',
    language: 'en',
    categories: [
      '/English/ages-stages/baby/feeding-nutrition/Pages/default.aspx',
      '/English/ages-stages/baby/breastfeeding/Pages/default.aspx',
      '/English/ages-stages/baby/sleep/Pages/default.aspx'
    ],
    linkPattern: /\/Pages\/[^\/]+\.aspx$/,
    contentSelector: 'article, .article-content, main',
    excludePatterns: [/default\.aspx$/i, /find-pediatrician/i]
  },
  'US_CDC': {
    name: 'Centers for Disease Control and Prevention',
    organization: 'CDC',
    baseUrl: 'https://www.cdc.gov',
    region: 'US',
    language: 'en',
    categories: [
      '/nutrition/infantandtoddlernutrition/'
    ],
    linkPattern: /\/nutrition\/infantandtoddlernutrition\/[^\/]+\.html$/,
    contentSelector: '#main-content, article, .syndicate',
    excludePatterns: [/index\.html$/i]
  },
  'UK_NHS': {
    name: 'National Health Service (NHS)',
    organization: 'NHS',
    baseUrl: 'https://www.nhs.uk',
    region: 'UK',
    language: 'en',
    categories: [
      '/conditions/baby/weaning-and-feeding/',
      '/conditions/baby/breastfeeding-and-bottle-feeding/',
      '/conditions/baby/'
    ],
    linkPattern: /\/conditions\/baby\/[^\/]+\/$/,
    contentSelector: 'article, .article-body, #maincontent',
    excludePatterns: []
  },
  'UK_NHS_START4LIFE': {
    name: 'NHS Start4Life',
    organization: 'NHS',
    baseUrl: 'https://www.nhs.uk/start4life',
    region: 'UK',
    language: 'en',
    categories: [
      '/baby/feeding-your-baby/',
      '/baby/sleep/',
      '/baby/'
    ],
    linkPattern: /\/baby\/[^\/]+\/$/,
    contentSelector: 'article, .article-body, main',
    excludePatterns: []
  },
  'AU_RAISING_CHILDREN': {
    name: 'Raising Children Network',
    organization: 'Australian Government',
    baseUrl: 'https://raisingchildren.net.au',
    region: 'AU',
    language: 'en',
    categories: [
      '/babies/breastfeeding-bottle-feeding',
      '/babies/feeding-solid-foods',
      '/babies/sleep'
    ],
    linkPattern: /\/babies\/[^\/]+$/,
    contentSelector: 'article, .article-body, main',
    excludePatterns: []
  },
  'GLOBAL_UNICEF': {
    name: 'UNICEF',
    organization: 'UNICEF',
    baseUrl: 'https://www.unicef.org',
    region: 'Global',
    language: 'en',
    categories: [
      '/parenting/child-care/breastfeeding',
      '/parenting'
    ],
    linkPattern: /\/parenting\//,
    contentSelector: 'article, .article-body, main',
    excludePatterns: []
  },
  'US_MAYO_CLINIC': {
    name: 'Mayo Clinic',
    organization: 'Mayo Clinic',
    baseUrl: 'https://www.mayoclinic.org',
    region: 'US',
    language: 'en',
    sitemapUrl: 'https://www.mayoclinic.org/sitemap-articles.xml',
    linkPattern: /\/infant-and-toddler-health\/in-depth\/[^\/]+\/art-/,
    contentSelector: 'article, .article-body, main',
    excludePatterns: []
  },
  'US_CLEVELAND_CLINIC': {
    name: 'Cleveland Clinic',
    organization: 'Cleveland Clinic',
    baseUrl: 'https://my.clevelandclinic.org',
    region: 'US',
    language: 'en',
    searchUrl: 'https://my.clevelandclinic.org/search?q=infant+baby+feeding+nutrition',
    linkPattern: /\/health\/[^\/]+\/[^\/]+$/,
    contentSelector: 'article, .article-body, main',
    excludePatterns: []
  },
  'US_STANFORD_CHILDRENS': {
    name: 'Stanford Children\'s Health',
    organization: 'Stanford Medicine',
    baseUrl: 'https://www.stanfordchildrens.org',
    region: 'US',
    language: 'en',
    categories: [
      '/en/topic/default?id=infant-feeding',
      '/en/topic/default?id=newborn-care'
    ],
    linkPattern: /\/en\/topic\/default/,
    contentSelector: 'article, .article-body, main',
    excludePatterns: []
  }*/
};

// Region 映射
const REGION_MAPPING = {
  'US': 'US',
  'UK': 'Global',
  'AU': 'Global',
  'Global': 'Global',
  'CA': 'CA'
};

/**
 * 使用 Playwright 发现文章链接
 */
async function discoverArticlesWithPlaywright(site, browser) {
  const articles = new Set();
  const page = await browser.newPage();

  // 设置真实的 User-Agent
  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9'
  });

  try {
    // 如果站点有 sitemap
    if (site.sitemapUrl) {
      console.log(`  📋 从 Sitemap 获取链接: ${site.sitemapUrl}`);
      await page.goto(site.sitemapUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      const sitemapContent = await page.content();
      const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g) || [];
      urlMatches.forEach(match => {
        const url = match.replace(/<\/?loc>/g, '').trim();
        if (site.linkPattern.test(url) && (!site.excludePatterns || !site.excludePatterns.some(p => p.test(url)))) {
          articles.add(url);
        }
      });
    }

    // 如果站点有 searchUrl
    if (site.searchUrl) {
      console.log(`  🔍 从搜索页获取链接: ${site.searchUrl}`);
      await page.goto(site.searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(3000); // 等待 JS 渲染
      
      const links = await page.evaluate(({ pattern }) => {
        const allLinks = Array.from(document.querySelectorAll('a[href]'));
        const regex = new RegExp(pattern.source || pattern, pattern.flags || '');
        return allLinks
          .map(a => a.href)
          .filter(href => {
            try {
              return regex.test(href);
            } catch {
              return false;
            }
          });
      }, { pattern: { source: site.linkPattern.source, flags: site.linkPattern.flags } });

      links.forEach(url => articles.add(url));
    }

    // 遍历分类页
    if (site.categories && site.categories.length > 0) {
      for (const category of site.categories) {
        const categoryUrl = category.startsWith('http') 
          ? category 
          : `${site.baseUrl}${category}`;
        
        console.log(`  📂 浏览分类页: ${categoryUrl}`);
        
        try {
          await page.goto(categoryUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
          await page.waitForTimeout(5000); // 等待 JS 渲染和内容加载

          const links = await page.evaluate(({ pattern, baseUrl, excludePatterns }) => {
            const allLinks = Array.from(document.querySelectorAll('a[href]'));
            const found = [];
            
            // 将字符串模式转换为正则表达式
            const regex = new RegExp(pattern.source || pattern, pattern.flags || '');
            
            allLinks.forEach(link => {
              let href = link.href;
              if (!href) return;
              
              // 转换为绝对 URL
              if (href.startsWith('/')) {
                href = baseUrl + href;
              } else if (!href.startsWith('http')) {
                return;
              }
              
              // 检查模式
              if (regex.test(href)) {
                // 检查排除模式
                const shouldExclude = excludePatterns.some(p => {
                  try {
                    const excludeRegex = new RegExp(p.source || p, p.flags || '');
                    return excludeRegex.test(href);
                  } catch {
                    return false;
                  }
                });
                if (!shouldExclude) {
                  found.push(href);
                }
              }
            });
            
            return [...new Set(found)]; // 去重
          }, { 
            pattern: { source: site.linkPattern.source, flags: site.linkPattern.flags },
            baseUrl: site.baseUrl, 
            excludePatterns: (site.excludePatterns || []).map(p => ({ source: p.source, flags: p.flags }))
          });

          links.forEach(url => articles.add(url));
          await delay(2000);
        } catch (error) {
          console.log(`    ⚠️  分类页访问失败: ${error.message}`);
        }
      }
    }

  } catch (error) {
    console.error(`  ❌ 发现链接失败: ${error.message}`);
  } finally {
    await page.close();
  }

  return Array.from(articles);
}

/**
 * 使用 Playwright 抓取单个文章
 */
async function scrapeArticleWithPlaywright(url, site, browser) {
  const page = await browser.newPage();
  
  // 设置真实的 User-Agent
  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9'
  });
  
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(5000); // 等待内容完全加载和 JS 渲染

    const content = await page.evaluate((selector) => {
      // 尝试多个选择器
      const selectors = selector ? [selector] : [
        'article',
        '.article-content',
        '.post-content',
        'main',
        '#main-content',
        '#content',
        '.content-body',
        '.article-body'
      ];

      let element = null;
      for (const sel of selectors) {
        try {
          const candidates = document.querySelectorAll(sel);
          for (const el of candidates) {
            if (el.textContent.trim().length > 500) {
              element = el;
              break;
            }
          }
          if (element) break;
        } catch (e) {
          continue;
        }
      }

      if (!element) {
        element = document.body;
      }

      // 提取标题
      const title = document.querySelector('h1')?.textContent?.trim() ||
                    document.querySelector('.article-title')?.textContent?.trim() ||
                    document.querySelector('title')?.textContent?.trim() ||
                    '';

      // 移除不需要的元素
      const clone = element.cloneNode(true);
      const unwanted = clone.querySelectorAll('script, style, nav, header, footer, aside, .advertisement, .social-share, .comment, .related, .sidebar, .navigation, .menu, .breadcrumb, .share, .author-bio, form, button, .ad, .banner, iframe');
      unwanted.forEach(el => el.remove());

      // 提取段落
      const paragraphs = [];
      clone.querySelectorAll('p, li, td, dd, blockquote, h2, h3').forEach(el => {
        const text = el.textContent.trim();
        if (text.length >= 30 && text.length <= 2000) {
          paragraphs.push(text);
        }
      });

      const content = paragraphs.join('\n\n');

      return {
        title,
        content,
        url: window.location.href
      };
    }, site.contentSelector);

    return content;

  } catch (error) {
    console.error(`    ❌ 抓取失败: ${error.message}`);
    return null;
  } finally {
    await page.close();
  }
}

/**
 * 检查文章是否已存在
 */
async function articleExists(url, title) {
  const { data: urlMatch } = await supabase
    .from('articles')
    .select('id')
    .ilike('license', `%${url}%`)
    .limit(1);

  if (urlMatch && urlMatch.length > 0) {
    return { exists: true, reason: 'URL已存在' };
  }

  if (title) {
    const slug = generateSlug(title);
    const { data: slugMatch } = await supabase
      .from('articles')
      .select('id')
      .eq('slug', slug)
      .limit(1);

    if (slugMatch && slugMatch.length > 0) {
      return { exists: true, reason: '标题已存在' };
    }
  }

  return { exists: false };
}

/**
 * 验证内容质量
 */
function validateContent(title, content) {
  const minContentLength = 300;
  const minParagraphs = 3;

  if (!title || title.length < 5) {
    return { valid: false, reason: '缺少标题' };
  }

  if (!content || content.length < minContentLength) {
    return { valid: false, reason: `内容太短: ${content.length} < ${minContentLength} 字符` };
  }

  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 30);
  if (paragraphs.length < minParagraphs) {
    return { valid: false, reason: `段落太少: ${paragraphs.length} < ${minParagraphs} 段` };
  }

  return { valid: true };
}

/**
 * 保存文章到数据库
 */
async function saveArticle(articleData, siteInfo) {
  try {
    const slug = generateSlug(articleData.title);
    const region = REGION_MAPPING[siteInfo.region] || 'Global';

    const existsCheck = await articleExists(articleData.url, articleData.title);
    if (existsCheck.exists) {
      return { success: false, reason: existsCheck.reason };
    }

    const oneLiner = buildContentOneLiner(articleData.content, siteInfo.name);

    const article = {
      slug,
      type: 'explainer',
      hub: 'feeding',
      lang: siteInfo.language || 'en',
      title: articleData.title.substring(0, 200),
      one_liner: oneLiner,
      key_facts: buildDefaultKeyFacts({
        sourceName: siteInfo.name,
        region: siteInfo.region
      }),
      body_md: articleData.content,
      entities: extractKeywords(articleData.content),
      age_range: '0-12 months',
      region: region,
      last_reviewed: new Date().toISOString().split('T')[0],
      reviewed_by: 'Playwright Scraper Bot',
      license: `Source: ${siteInfo.name} (${siteInfo.organization}) | Region: ${siteInfo.region} | URL: ${articleData.url}`,
      meta_title: buildMetaTitle(articleData.title),
      meta_description: buildMetaDescription(articleData.content, siteInfo.name),
      keywords: extractKeywords(articleData.content),
      status: 'draft'
    };

    const { data, error } = await supabase
      .from('articles')
      .insert([article])
      .select()
      .single();

    if (error) throw error;

    await supabase.from('citations').insert([{
      article_id: data.id,
      title: articleData.title,
      url: articleData.url,
      publisher: siteInfo.organization,
      date: new Date().toISOString().split('T')[0]
    }]);

    return { success: true, id: data.id };

  } catch (error) {
    return { success: false, reason: error.message };
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🌐 开始使用 Playwright 抓取反爬站点\n');
  console.log('='.repeat(70));

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage'
    ]
  });

  const stats = {
    sitesProcessed: 0,
    totalDiscovered: 0,
    attempted: 0,
    successful: 0,
    failed: 0,
    bySite: {}
  };

  try {
    // 遍历每个反爬站点
    for (const [siteKey, site] of Object.entries(ANTI_CRAWL_SITES)) {
      console.log(`\n📌 处理站点: ${site.name} (${site.organization})`);
      console.log('─'.repeat(70));
      
      stats.sitesProcessed++;
      stats.bySite[site.name] = {
        discovered: 0,
        attempted: 0,
        successful: 0,
        failed: 0
      };

      try {
        // 发现文章链接
        console.log(`\n🔍 发现文章链接...`);
        const articleUrls = await discoverArticlesWithPlaywright(site, browser);
        
        console.log(`  ✅ 发现 ${articleUrls.length} 篇文章`);
        stats.totalDiscovered += articleUrls.length;
        stats.bySite[site.name].discovered = articleUrls.length;

        // 限制每站点最多处理 20 篇文章（避免超时）
        const urlsToProcess = articleUrls.slice(0, 20);

        // 抓取每篇文章
        for (let i = 0; i < urlsToProcess.length; i++) {
          const url = urlsToProcess[i];
          stats.attempted++;
          stats.bySite[site.name].attempted++;

          console.log(`\n  [${i + 1}/${urlsToProcess.length}] ${url}`);

          try {
            const content = await scrapeArticleWithPlaywright(url, site, browser);

            if (!content || !content.content) {
              console.log(`    ❌ 无法提取内容`);
              stats.failed++;
              stats.bySite[site.name].failed++;
              await delay(3000);
              continue;
            }

            const validation = validateContent(content.title, content.content);
            if (!validation.valid) {
              console.log(`    ❌ 内容质量不足: ${validation.reason}`);
              stats.failed++;
              stats.bySite[site.name].failed++;
              await delay(2000);
              continue;
            }

            console.log(`    ✅ 提取成功: ${content.title.substring(0, 60)}`);
            console.log(`       ${content.content.length} 字符`);

            const articleData = {
              title: content.title,
              content: content.content,
              url: content.url || url
            };

            const siteInfo = {
              name: site.name,
              organization: site.organization,
              region: site.region,
              language: site.language
            };

            const result = await saveArticle(articleData, siteInfo);

            if (result.success) {
              console.log(`    💾 已保存 (ID: ${result.id})`);
              stats.successful++;
              stats.bySite[site.name].successful++;
            } else {
              console.log(`    ⏭️  跳过: ${result.reason}`);
              if (result.reason.includes('已存在')) {
                stats.failed--;
                stats.bySite[site.name].failed--;
              } else {
                stats.failed++;
                stats.bySite[site.name].failed++;
              }
            }

          } catch (error) {
            console.log(`    ❌ 错误: ${error.message}`);
            stats.failed++;
            stats.bySite[site.name].failed++;
          }

          await delay(3000); // 延迟避免被封
        }

      } catch (error) {
        console.error(`  ❌ 站点处理失败: ${error.message}`);
      }

      await delay(5000); // 站点间延迟
    }

  } finally {
    await browser.close();
  }

  // 显示统计
  console.log('\n' + '='.repeat(70));
  console.log('📊 抓取结果统计');
  console.log('='.repeat(70));
  console.log(`处理站点: ${stats.sitesProcessed} 个`);
  console.log(`发现文章: ${stats.totalDiscovered} 篇`);
  console.log(`尝试抓取: ${stats.attempted} 篇`);
  console.log(`成功保存: ${stats.successful} 篇 ✅`);
  console.log(`失败: ${stats.failed} 篇 ❌`);
  
  if (stats.attempted > 0) {
    console.log(`成功率: ${((stats.successful / stats.attempted) * 100).toFixed(1)}%\n`);
  }

  console.log('按站点统计:');
  Object.entries(stats.bySite).forEach(([site, data]) => {
    console.log(`  ${site}: 发现${data.discovered}篇 | 尝试${data.attempted}篇 | 成功${data.successful}篇 | 失败${data.failed}篇`);
  });

  console.log('\n✅ 完成！\n');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
