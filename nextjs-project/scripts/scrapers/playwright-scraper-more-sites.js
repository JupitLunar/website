#!/usr/bin/env node

/**
 * Playwright 爬虫 - 更多站点
 * 测试并抓取其他可访问的权威网站
 */

const { chromium } = require('playwright');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const { generateSlug, extractKeywords, delay } = require('./scraper-utils');
const { articleExists: checkArticleExists } = require('./article-dedup');

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

// 更多可测试的站点
const MORE_SITES = {
  'AU_RAISING_CHILDREN': {
    name: 'Raising Children Network (AU)',
    organization: 'Australian Government',
    baseUrl: 'https://raisingchildren.net.au',
    region: 'AU',
    language: 'en',
    categoryUrls: [
      'https://raisingchildren.net.au/babies/breastfeeding-bottle-feeding',
      'https://raisingchildren.net.au/babies/feeding-solid-foods',
      'https://raisingchildren.net.au/babies/sleep'
    ],
    linkPatterns: [
      /\/babies\/breastfeeding-bottle-feeding\/[^\/]+$/,
      /\/babies\/feeding-solid-foods\/[^\/]+$/,
      /\/babies\/sleep\/[^\/]+$/
    ],
    contentSelector: 'article, .article-body, main, .content'
  },
  'AU_PREGNANCY_BIRTH_BABY': {
    name: 'Pregnancy, Birth & Baby (AU)',
    organization: 'Australian Government',
    baseUrl: 'https://www.pregnancybirthbaby.org.au',
    region: 'AU',
    language: 'en',
    categoryUrls: [
      'https://www.pregnancybirthbaby.org.au/baby',
      'https://www.pregnancybirthbaby.org.au/breastfeeding',
      'https://www.pregnancybirthbaby.org.au/newborn-baby'
    ],
    linkPatterns: [
      /\/baby\/[^\/]+$/,
      /\/breastfeeding\/[^\/]+$/,
      /\/newborn-baby\/[^\/]+$/
    ],
    contentSelector: 'article, .article-body, main, .content'
  },
  'CA_HEALTH_CANADA': {
    name: 'Health Canada',
    organization: 'Health Canada',
    baseUrl: 'https://www.canada.ca',
    region: 'CA',
    language: 'en',
    categoryUrls: [
      'https://www.canada.ca/en/health-canada/services/food-nutrition/healthy-eating/infant-feeding.html'
    ],
    linkPatterns: [
      /\/en\/health-canada\/services\/food-nutrition\/[^\/]+\.html$/
    ],
    contentSelector: 'article, .mwsgeneric-base-html, main, #wb-cont'
  },
  'US_MAYO_CLINIC': {
    name: 'Mayo Clinic',
    organization: 'Mayo Clinic',
    baseUrl: 'https://www.mayoclinic.org',
    region: 'US',
    language: 'en',
    sitemapUrl: 'https://www.mayoclinic.org/sitemap-articles.xml',
    linkPatterns: [
      /\/infant-and-toddler-health\/in-depth\/[^\/]+\/art-\d+$/
    ],
    contentSelector: 'article, .article-body, main'
  }
};

const REGION_MAPPING = {
  'UK': 'Global',
  'US': 'US',
  'AU': 'Global',
  'CA': 'CA',
  'Global': 'Global'
};

/**
 * 发现文章链接
 */
async function discoverArticles(site, browser) {
  const articles = new Set();
  const page = await browser.newPage();

  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9'
  });

  try {
    // Sitemap 方式
    if (site.sitemapUrl) {
      console.log(`  📋 从 Sitemap 获取链接: ${site.sitemapUrl}`);
      try {
        await page.goto(site.sitemapUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        const content = await page.content();
        const urlMatches = content.match(/<loc>(.*?)<\/loc>/g) || [];
        
        urlMatches.forEach(match => {
          const url = match.replace(/<\/?loc>/g, '').trim();
          if (site.linkPatterns.some(p => p.test(url))) {
            articles.add(url);
          }
        });
        console.log(`    ✅ 从 Sitemap 发现 ${urlMatches.length} 个 URL，匹配 ${articles.size} 个`);
      } catch (error) {
        console.log(`    ⚠️  Sitemap 访问失败: ${error.message}`);
      }
    }

    // 分类页方式
    if (site.categoryUrls && site.categoryUrls.length > 0) {
      for (const categoryUrl of site.categoryUrls) {
        console.log(`  📂 浏览分类页: ${categoryUrl}`);
        
        try {
          await page.goto(categoryUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
          await page.waitForTimeout(5000);

          const links = await page.evaluate((patterns) => {
            const allLinks = Array.from(document.querySelectorAll('a[href]'));
            const found = [];
            
            allLinks.forEach(link => {
              const href = link.href;
              if (href && href.startsWith('https://') && !href.includes('#') && !href.includes('javascript:')) {
                if (patterns.some(p => {
                  try {
                    const regex = new RegExp(p.source || p, p.flags || '');
                    return regex.test(href);
                  } catch {
                    return false;
                  }
                })) {
                  found.push(href);
                }
              }
            });
            
            return [...new Set(found)];
          }, site.linkPatterns.map(p => ({ source: p.source, flags: p.flags })));

          links.forEach(url => articles.add(url));
          console.log(`    ✅ 发现 ${links.length} 个链接`);
          await delay(2000);
        } catch (error) {
          console.log(`    ⚠️  失败: ${error.message}`);
        }
      }
    }
  } finally {
    await page.close();
  }

  return Array.from(articles);
}

/**
 * 抓取单篇文章
 */
async function scrapeArticle(url, site, browser) {
  const page = await browser.newPage();
  
  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9'
  });
  
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(5000);

    const content = await page.evaluate(() => {
      const selectors = [
        'article',
        '.article-body',
        '.article-content',
        '#main-content',
        'main',
        '.content',
        '#wb-cont',
        '.mwsgeneric-base-html'
      ];

      let article = null;
      for (const sel of selectors) {
        article = document.querySelector(sel);
        if (article && article.textContent.trim().length > 500) {
          break;
        }
      }

      if (!article) {
        article = document.body;
      }

      const title = document.querySelector('h1')?.textContent?.trim() || 
                    document.querySelector('.article-title')?.textContent?.trim() ||
                    document.title;

      const clone = article.cloneNode(true);
      const unwanted = clone.querySelectorAll('script, style, nav, header, footer, aside, .advertisement, .social-share, .comment, .related, .sidebar, .navigation, .menu, .breadcrumb, .share, .author-bio, form, button, .ad, .banner, iframe');
      unwanted.forEach(el => el.remove());

      const paragraphs = [];
      clone.querySelectorAll('p, li, td, dd, blockquote, h2, h3').forEach(el => {
        const text = el.textContent.trim();
        if (text.length >= 30 && text.length <= 2000) {
          paragraphs.push(text);
        }
      });

      return {
        title,
        content: paragraphs.join('\n\n'),
        url: window.location.href
      };
    });

    return content;
  } catch (error) {
    console.error(`    ❌ 抓取失败: ${error.message}`);
    return null;
  } finally {
    await page.close();
  }
}

/**
 * 检查文章是否已存在（使用增强的去重函数）
 */
async function articleExists(url, title) {
  return await checkArticleExists(url, title);
}

/**
 * 验证内容质量
 */
function validateContent(title, content) {
  if (!title || title.length < 5) {
    return { valid: false, reason: '缺少标题' };
  }
  if (!content || content.length < 300) {
    return { valid: false, reason: `内容太短: ${content.length} < 300 字符` };
  }
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 30);
  if (paragraphs.length < 3) {
    return { valid: false, reason: `段落太少: ${paragraphs.length} < 3 段` };
  }
  return { valid: true };
}

/**
 * 保存文章
 */
async function saveArticle(articleData, siteInfo) {
  try {
    const slug = generateSlug(articleData.title);
    const region = REGION_MAPPING[siteInfo.region] || 'Global';
    const existsCheck = await articleExists(articleData.url, articleData.title);
    
    if (existsCheck.exists) {
      return { success: false, reason: existsCheck.reason };
    }

    const oneLiner = articleData.content.substring(0, 200);
    const paddedOneLiner = oneLiner.length < 50 
      ? oneLiner + ' Evidence-based information from trusted health organizations.'
      : oneLiner;

    const article = {
      slug,
      type: 'explainer',
      hub: 'feeding',
      lang: siteInfo.language || 'en',
      title: articleData.title.substring(0, 200),
      one_liner: paddedOneLiner.substring(0, 200),
      key_facts: [
        `Source: ${siteInfo.name}`,
        `Region: ${siteInfo.region}`,
        'Evidence-based information for parents'
      ],
      body_md: articleData.content,
      entities: extractKeywords(articleData.content),
      age_range: '0-12 months',
      region: region,
      last_reviewed: new Date().toISOString().split('T')[0],
      reviewed_by: 'Playwright Scraper Bot',
      license: `Source: ${siteInfo.name} (${siteInfo.organization}) | Region: ${siteInfo.region} | URL: ${articleData.url}`,
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
  console.log('🌐 Playwright 爬虫 - 更多权威站点\n');
  console.log('='.repeat(70));

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
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
    for (const [siteKey, site] of Object.entries(MORE_SITES)) {
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
        console.log(`\n🔍 发现文章链接...`);
        const articleUrls = await discoverArticles(site, browser);
        
        console.log(`  ✅ 发现 ${articleUrls.length} 篇文章`);
        stats.totalDiscovered += articleUrls.length;
        stats.bySite[site.name].discovered = articleUrls.length;

        if (articleUrls.length === 0) {
          console.log(`  ⏭️  跳过（未发现文章）`);
          continue;
        }

        // 限制每站点最多处理 10 篇（测试）
        const urlsToProcess = articleUrls.slice(0, 10);

        for (let i = 0; i < urlsToProcess.length; i++) {
          const url = urlsToProcess[i];
          stats.attempted++;
          stats.bySite[site.name].attempted++;

          console.log(`\n  [${i + 1}/${urlsToProcess.length}] ${url}`);

          try {
            const content = await scrapeArticle(url, site, browser);

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

            const siteInfo = {
              name: site.name,
              organization: site.organization,
              region: site.region,
              language: site.language
            };

            const result = await saveArticle(content, siteInfo);

            if (result.success) {
              console.log(`    💾 已保存 (ID: ${result.id})`);
              stats.successful++;
              stats.bySite[site.name].successful++;
            } else {
              console.log(`    ⏭️  跳过: ${result.reason}`);
              if (!result.reason.includes('已存在')) {
                stats.failed++;
                stats.bySite[site.name].failed++;
              }
            }

          } catch (error) {
            console.log(`    ❌ 错误: ${error.message}`);
            stats.failed++;
            stats.bySite[site.name].failed++;
          }

          await delay(3000);
        }

      } catch (error) {
        console.error(`  ❌ 站点处理失败: ${error.message}`);
      }

      await delay(5000);
    }

  } finally {
    await browser.close();
  }

  // 统计
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

