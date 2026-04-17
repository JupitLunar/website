#!/usr/bin/env node

/**
 * Playwright 爬虫 - AAP 和 CDC 权威站点
 * 使用修复后的配置来抓取之前无法访问的站点
 */

const { chromium } = require('playwright');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const {
  generateSlug,
  extractKeywords,
  buildContentOneLiner,
  buildMetaTitle,
  buildMetaDescription,
  buildDefaultKeyFacts,
  delay
} = require('./scraper-utils');
const { articleExists: checkArticleExists } = require('../maintenance/article-dedup');
const { GLOBAL_SOURCES, getSourcesByRegion } = require('./global-sources-config');

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

// 权威站点配置 - 整合 GLOBAL_SOURCES 的分级信息
const AUTHORITY_SITES = {
  // === United States ===
  'US_AAP': {
    ...GLOBAL_SOURCES.US.AAP,
    categoryUrls: [
      'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/default.aspx',
      'https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/default.aspx',
      'https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/default.aspx',
      'https://www.healthychildren.org/English/ages-stages/baby/bathing-skin-care/Pages/default.aspx'
    ],
    linkPatterns: [
      /\/Pages\/[^\/]+\.aspx$/i
    ],
    excludePatterns: [
      /default\.aspx$/i,
      /find-pediatrician/i,
      /search/i
    ],
    contentSelector: 'article, .article-content, main, #main-content'
  },
  'US_CDC': {
    ...GLOBAL_SOURCES.US.CDC,
    categoryUrls: [
      'https://www.cdc.gov/nutrition/',
      'https://www.cdc.gov/nutrition/infantandtoddlernutrition/'
    ],
    linkPatterns: [
      /\/nutrition\/[^\/]+\.html$/i,
      /\/nutrition\/infantandtoddlernutrition\/[^\/]+\.html$/i
    ],
    excludePatterns: [
      /index\.html$/i,
      /404/i,
      /error/i
    ],
    contentSelector: '#main-content, article, .syndicate, main'
  },

  // === United Kingdom ===
  'UK_NHS': {
    ...GLOBAL_SOURCES.UK.NHS,
    categoryUrls: [
      'https://www.nhs.uk/conditions/baby/weaning-and-feeding/',
      'https://www.nhs.uk/conditions/baby/breastfeeding-and-bottle-feeding/',
      'https://www.nhs.uk/conditions/baby/babys-development/'
    ],
    linkPatterns: [
      /\/conditions\/baby\//i
    ],
    excludePatterns: [
      /search/i,
      /service-search/i
    ],
    contentSelector: 'article, main, .nhsuk-main-wrapper'
  },

  // === Canada ===
  'CA_HEALTH': {
    ...GLOBAL_SOURCES.CA.HEALTH_CANADA,
    categoryUrls: [
      'https://www.canada.ca/en/health-canada/services/food-nutrition/healthy-eating/infant-feeding.html',
      'https://www.canada.ca/en/public-health/services/pregnancy/babies.html'
    ],
    linkPatterns: [
      /\/services\/food-nutrition\/healthy-eating\/infant-feeding/i,
      /\/services\/pregnancy\/babies/i
    ],
    excludePatterns: [
      /search/i,
      /contact/i
    ],
    contentSelector: 'main, [role="main"], .mwstext'
  },
  'CA_CPS': {
    ...GLOBAL_SOURCES.CA.CARING_FOR_KIDS,
    categoryUrls: [
      'https://caringforkids.cps.ca/handouts/pregnancy-and-babies'
    ],
    linkPatterns: [
      /\/handouts\/pregnancy-and-babies\//i
    ],
    excludePatterns: [],
    contentSelector: '.content-main, article, main'
  },

  // === Australia ===
  'AU_RAISING_CHILDREN': {
    ...GLOBAL_SOURCES.AU.RAISING_CHILDREN,
    categoryUrls: [
      'https://raisingchildren.net.au/babies/breastfeeding-bottle-feeding',
      'https://raisingchildren.net.au/babies/solids-feeding',
      'https://raisingchildren.net.au/babies/sleep'
    ],
    linkPatterns: [
      /\/babies\//i
    ],
    excludePatterns: [
      /videos/i,
      /guides/i
    ],
    contentSelector: 'article, main, .main-content'
  },

  // === Global ===
  'GLOBAL_WHO': {
    ...GLOBAL_SOURCES.GLOBAL.WHO,
    categoryUrls: [
      'https://www.who.int/health-topics/breastfeeding',
      'https://www.who.int/health-topics/infant-health'
    ],
    linkPatterns: [
      /\/news-room\/fact-sheets\/detail\//i,
      /\/health-topics\//i
    ],
    excludePatterns: [
      /events/i,
      /speeches/i
    ],
    contentSelector: '.sf-detail-body-wrapper, main, article'
  }
};

const REGION_MAPPING = {
  'US': 'US',
  'UK': 'Global',
  'AU': 'Global',
  'CA': 'CA',
  'Global': 'Global'
};

/**
 * 更新或创建知识库来源 (Source Registry)
 */
async function upsertKnowledgeSource(siteInfo) {
  try {
    // 检查是否存在
    const { data: existing } = await supabase
      .from('kb_sources')
      .select('id')
      .eq('name', siteInfo.name)
      .single();

    const timestamp = new Date().toISOString();
    const sourceData = {
      name: siteInfo.name,
      organization: siteInfo.organization,
      url: siteInfo.baseUrl,
      grade: siteInfo.grade || 'A', // 默认为 A 级
      retrieved_at: timestamp,
      updated_at: timestamp
    };

    if (existing) {
      await supabase
        .from('kb_sources')
        .update(sourceData)
        .eq('id', existing.id);
      return { id: existing.id, isNew: false };
    } else {
      const { data: newSource, error } = await supabase
        .from('kb_sources')
        .insert([{
          ...sourceData,
          created_at: timestamp
        }])
        .select()
        .single();

      if (error) throw error;
      return { id: newSource.id, isNew: true };
    }
  } catch (error) {
    console.error(`    ⚠️  Source Registry update failed: ${error.message}`);
    return null;
  }
}

/**
 * 发现文章链接
 */
async function discoverArticles(site, browser) {
  const articles = new Set();

  // 为每个 category URL 创建新页面
  for (const categoryUrl of site.categoryUrls) {
    const page = await browser.newPage();

    try {
      console.log(`  📂 浏览分类页: ${categoryUrl}`);

      await page.goto(categoryUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });
      await page.waitForTimeout(5000); // 等待 JS 渲染

      const links = await page.evaluate(({ baseUrl, linkPatternSource, excludePatterns, organization }) => {
        const allLinks = Array.from(document.querySelectorAll('a[href]'));
        const found = [];
        const linkPatterns = linkPatternSource ? [{ source: linkPatternSource, flags: 'i' }] : [];

        allLinks.forEach(link => {
          let href = link.href;
          if (!href || !href.startsWith('http')) return;

          // 转换为小写进行比较
          const lowerHref = href.toLowerCase();
          const baseUrlLower = baseUrl.toLowerCase().replace('https://', '');

          // 必须包含 baseUrl
          if (!lowerHref.includes(baseUrlLower)) return;

          // 对于 AAP，检查是否包含 /Pages/ 且以 .aspx 结尾，并且是在 /ages-stages/baby/ 路径下
          if (organization === 'AAP') {
            if (href.includes('/Pages/') &&
              href.endsWith('.aspx') &&
              !href.includes('default.aspx') &&
              (href.includes('/ages-stages/baby/') || href.includes('/English/ages-stages/baby/')) &&
              !href.includes('find-pediatrician') &&
              !href.includes('login') &&
              !href.includes('register') &&
              !href.includes('contact') &&
              !href.includes('about-aap') &&
              !href.includes('Editorial-Policy') &&
              !href.includes('asthmatracker') &&
              !href.includes('MediaPlan') &&
              !href.includes('podcast') &&
              !href.includes('sponsorship') &&
              !href.includes('contributors')) {
              found.push(href);
            }
          } else {
            // 对于其他站点，使用正则模式
            const matchesPattern = linkPatterns.some(pattern => {
              try {
                return new RegExp(pattern.source, pattern.flags).test(href);
              } catch {
                return false;
              }
            });

            // 检查是否应该排除
            const shouldExclude = excludePatterns.some(pattern => {
              try {
                return pattern.test(href);
              } catch {
                return false;
              }
            });

            if (matchesPattern && !shouldExclude) {
              found.push(href);
            }
          }
        });

        return [...new Set(found)]; // 去重
      }, {
        baseUrl: site.baseUrl,
        organization: site.organization,
        linkPatternSource: site.linkPatterns?.[0]?.source, // 只传第一个正则源码，避免序列化问题
        excludePatterns: (site.excludePatterns || []).map(p => ({ source: p.source, flags: p.flags }))
      });

      links.forEach(url => articles.add(url));
      console.log(`    ✅ 发现 ${links.length} 个链接`);

      // 如果是 CDC，也尝试从页面内容中提取链接（可能通过 JS 动态加载）
      if (site.organization === 'CDC') {
        // 等待更多内容加载
        await page.waitForTimeout(3000);
        const moreLinks = await page.evaluate(({ baseUrl }) => {
          const allLinks = Array.from(document.querySelectorAll('a[href]'));
          return allLinks
            .map(a => a.href)
            .filter(href => href && href.includes(baseUrl.replace('https://', '')) && href.includes('.html'))
            .slice(0, 20);
        }, { baseUrl: site.baseUrl });

        moreLinks.forEach(url => articles.add(url));
        if (moreLinks.length > 0) {
          console.log(`    ✅ 额外发现 ${moreLinks.length} 个链接`);
        }
      }

      await delay(2000);
    } catch (error) {
      console.log(`    ⚠️  失败: ${error.message}`);
    } finally {
      await page.close();
    }
  }

  return Array.from(articles);
}

/**
 * 抓取单篇文章
 */
async function scrapeArticle(url, site, browser) {
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    // 对于 AAP，增加更长的等待时间，让 JS 内容完全加载
    if (site.organization === 'AAP') {
      await page.waitForTimeout(12000); // 增加到 12 秒
      try {
        // 等待主要内容区域出现
        await page.waitForSelector('main, article, .article-content, #main-content, .body-content, .content-body', { timeout: 15000 });
        // 额外等待，确保动态内容加载完成
        await page.waitForTimeout(3000);
      } catch (e) {
        // 如果找不到，再等待一段时间
        await page.waitForTimeout(5000);
      }
    } else {
      await page.waitForTimeout(8000);
    }

    const content = await page.evaluate(({ selector, organization }) => {
      const title = document.querySelector('h1')?.textContent?.trim() ||
        document.querySelector('.article-title')?.textContent?.trim() ||
        document.title;

      // 尝试多个选择器
      const selectors = selector ? [selector] : [
        'article',
        '.article-content',
        '.post-content',
        'main',
        '#main-content',
        '#content',
        '.content-body',
        '.article-body',
        '.syndicate'
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

      // 移除不需要的元素
      const clone = element.cloneNode(true);
      const unwanted = clone.querySelectorAll('script, style, nav, header, footer, aside, .advertisement, .social-share, .comment, .related, .sidebar, .navigation, .menu, .breadcrumb, .share, .author-bio, form, button, .ad, .banner, iframe');
      unwanted.forEach(el => el.remove());

      // 提取段落 - 对于 AAP，尝试更广泛的提取
      const paragraphs = [];

      if (organization === 'AAP') {
        // AAP 特定：优先查找主要内容区域
        // 1. 首先尝试找到 article 或 main 标签内的内容
        let articleElement = clone.querySelector('article, main, [role="main"]');
        if (!articleElement) {
          // 2. 查找包含大量文本的区域
          const contentDivs = clone.querySelectorAll('div');
          let mainContentDiv = null;

          for (const div of contentDivs) {
            const text = div.textContent.trim();
            // 降低阈值，找到包含较多文本的 div
            if (text.length > 1000 && div.children.length > 2) {
              if (!mainContentDiv || text.length > mainContentDiv.textContent.trim().length) {
                mainContentDiv = div;
              }
            }
          }
          articleElement = mainContentDiv || clone;
        }

        // 从找到的元素中提取所有可能的文本内容
        const textElements = articleElement.querySelectorAll('p, li, td, dd, dt, blockquote, h2, h3, h4, div.section, div.content, div.body');

        textElements.forEach(el => {
          const text = el.textContent.trim();
          // 降低最小长度要求，从 50 降到 30，提高上限
          if (text.length >= 30 &&
            text.length <= 5000 &&
            !text.match(/^(Ages|Register|Login|Search|Menu|Navigation|Skip to|Share this)/i) &&
            !el.closest('nav, header, footer, aside, .navigation, .menu, .breadcrumb, .sidebar')) {
            // 过滤掉只有链接文本的段落
            const linkText = el.querySelectorAll('a');
            if (linkText.length === 0 || text.length > linkText.length * 20) {
              paragraphs.push(text);
            }
          }
        });

        // 如果段落还是太少，尝试从整个 body 提取（更激进）
        if (paragraphs.length < 2) {
          clone.querySelectorAll('p, div').forEach(el => {
            const text = el.textContent.trim();
            if (text.length >= 50 && text.length <= 3000) {
              // 检查是否已经包含类似内容
              const isDuplicate = paragraphs.some(p => {
                const similarity = p.substring(0, 50) === text.substring(0, 50);
                return similarity;
              });
              if (!isDuplicate && !text.match(/^(Ages|Register|Login|Search|Menu|Navigation)/i)) {
                paragraphs.push(text);
              }
            }
          });
        }
      } else {
        // 标准提取
        clone.querySelectorAll('p, li, td, dd, blockquote, h2, h3').forEach(el => {
          const text = el.textContent.trim();
          if (text.length >= 30 && text.length <= 2000) {
            paragraphs.push(text);
          }
        });
      }

      // 去重相似的段落
      const uniqueParagraphs = [];
      paragraphs.forEach(p => {
        if (!uniqueParagraphs.some(existing => existing.substring(0, 100) === p.substring(0, 100))) {
          uniqueParagraphs.push(p);
        }
      });

      const content = uniqueParagraphs.join('\n\n');

      // 检查是否是 404 或错误页面
      const isError = title.includes('404') ||
        title.includes('Not Found') ||
        title.includes('Error') ||
        content.includes('Page not found') ||
        content.length < 200;

      return {
        title,
        content,
        url: window.location.href,
        isError,
        paragraphCount: uniqueParagraphs.length
      };
    }, { selector: site.contentSelector, organization: site.organization });

    // 如果是错误页面，返回 null
    if (content.isError) {
      return null;
    }

    return content;

  } catch (error) {
    console.error(`    ❌ 抓取失败: ${error.message}`);
    return null;
  } finally {
    await page.close();
  }
}

/**
 * 验证内容质量
 */
function validateContent(title, content, organization) {
  if (!title || title.length < 5) {
    return { valid: false, reason: '缺少标题' };
  }
  // 对于 AAP，降低最小内容长度要求（从 300 降到 200）
  const minContentLength = (organization === 'AAP') ? 200 : 300;
  if (!content || content.length < minContentLength) {
    return { valid: false, reason: `内容太短: ${content.length} < ${minContentLength} 字符` };
  }
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 30);
  // 对于 AAP，降低段落要求（从 3 降到 2），因为内容可能分散在更少段落中
  const minParagraphs = (organization === 'AAP') ? 2 : 3;
  if (paragraphs.length < minParagraphs) {
    return { valid: false, reason: `段落太少: ${paragraphs.length} < ${minParagraphs} 段` };
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

    // 1. 更新 Source Registry
    const sourceResult = await upsertKnowledgeSource(siteInfo);
    if (sourceResult && sourceResult.isNew) {
      console.log(`    ⭐ 新增权威来源: ${siteInfo.name}`);
    } else if (sourceResult) {
      console.log(`    ✅ 更新权威来源: ${siteInfo.name}`);
    }

    // 2. 检查文章是否存在
    const existsCheck = await checkArticleExists(articleData.url, articleData.title);
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
      key_facts: [
        ...buildDefaultKeyFacts({
          sourceName: siteInfo.name,
          region: siteInfo.region
        }).slice(0, 2),
        `Source grade: ${siteInfo.grade || 'A'}`
      ],
      body_md: articleData.content,
      entities: extractKeywords(articleData.content),
      age_range: '0-12 months',
      region: region,
      last_reviewed: new Date().toISOString().split('T')[0],
      reviewed_by: siteInfo.name, // 使用来源名称作为审核者
      license: `Source: ${siteInfo.name} (${siteInfo.organization}) | Grade: ${siteInfo.grade || 'A'} | URL: ${articleData.url}`,
      meta_title: buildMetaTitle(articleData.title),
      meta_description: buildMetaDescription(articleData.content, siteInfo.name),
      keywords: extractKeywords(articleData.content),
      status: 'published' // 直接发布，因为是权威来源
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
  console.log('🌐 Playwright 爬虫 - AAP 和 CDC 权威站点 (Medical Grade)\n');
  console.log('='.repeat(70));

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // 创建浏览器 context（关键：使用正确的配置）
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    }
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
    for (const [siteKey, site] of Object.entries(AUTHORITY_SITES)) {
      console.log(`\n📌 处理站点: ${site.name} (${site.organization}) - Grade ${site.grade || 'A'}`);
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
        const articleUrls = await discoverArticles(site, context);

        console.log(`  ✅ 发现 ${articleUrls.length} 篇文章`);
        stats.totalDiscovered += articleUrls.length;
        stats.bySite[site.name].discovered = articleUrls.length;

        if (articleUrls.length === 0) {
          console.log(`  ⏭️  跳过（未发现文章）`);
          continue;
        }

        // 处理所有文章
        const urlsToProcess = articleUrls.slice(0, 50); // 限制每次最多 50 篇，避免过长

        for (let i = 0; i < urlsToProcess.length; i++) {
          const url = urlsToProcess[i];
          stats.attempted++;
          stats.bySite[site.name].attempted++;

          console.log(`\n  [${i + 1}/${urlsToProcess.length}] ${url}`);

          try {
            const content = await scrapeArticle(url, site, context);

            if (!content || !content.content) {
              console.log(`    ❌ 无法提取内容或页面错误`);
              stats.failed++;
              stats.bySite[site.name].failed++;
              await delay(3000);
              continue;
            }

            const validation = validateContent(content.title, content.content, site.organization);
            if (!validation.valid) {
              console.log(`    ❌ 内容质量不足: ${validation.reason}`);
              stats.failed++;
              stats.bySite[site.name].failed++;
              await delay(2000);
              continue;
            }

            console.log(`    ✅ 提取成功: ${content.title.substring(0, 60)}`);
            console.log(`       ${content.content.length} 字符, ${content.paragraphCount || 'N/A'} 段落`);

            // 传递完整 site 信息，包含 grade
            const siteInfo = {
              name: site.name,
              organization: site.organization,
              region: site.region,
              language: site.language,
              grade: site.grade,
              baseUrl: site.baseUrl
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
    await context.close();
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
