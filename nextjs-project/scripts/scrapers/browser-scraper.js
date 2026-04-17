#!/usr/bin/env node

/**
 * 基于浏览器工具的爬虫 - 用于反爬站点
 * 使用 MCP Browser Extension 或 Playwright 来访问被反爬的权威网站
 */

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

// 反爬站点列表（需要浏览器渲染）
const ANTI_CRAWL_SITES = [
  {
    name: 'AAP (HealthyChildren.org)',
    organization: 'AAP',
    baseUrl: 'https://www.healthychildren.org',
    region: 'US',
    language: 'en',
    testUrls: [
      'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Starting-Solid-Foods.aspx',
      'https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/default.aspx'
    ],
    contentSelector: 'article, .article-content, main .generic[ref]',
    linkPattern: /\/Pages\/[^\/]+\.aspx$/
  },
  {
    name: 'CDC',
    organization: 'CDC',
    baseUrl: 'https://www.cdc.gov',
    region: 'US',
    language: 'en',
    testUrls: [
      'https://www.cdc.gov/nutrition/infantandtoddlernutrition/foods-and-drinks/when-to-introduce-solid-foods.html'
    ],
    contentSelector: '#main-content, article, .syndicate',
    linkPattern: /\/nutrition\/infantandtoddlernutrition\//
  },
  {
    name: 'NHS',
    organization: 'NHS',
    baseUrl: 'https://www.nhs.uk',
    region: 'UK',
    language: 'en',
    testUrls: [
      'https://www.nhs.uk/conditions/baby/weaning-and-feeding/',
      'https://www.nhs.uk/conditions/baby/breastfeeding-and-bottle-feeding/'
    ],
    contentSelector: 'article, .article-body, #maincontent',
    linkPattern: /\/conditions\/baby\//
  }
];

/**
 * 使用 Puppeteer 抓取单个 URL（增强版）
 */
async function scrapeWithBrowser(url, options = {}) {
  const puppeteer = require('puppeteer');
  const { contentSelector, waitFor = 5000 } = options;
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--window-size=1920,1080'
      ],
      timeout: 60000
    });

    const page = await browser.newPage();
    
    // 移除 webdriver 标识
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined
      });
    });

    // 设置真实的 User-Agent 和语言
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1'
    });

    // 设置视口
    await page.setViewport({ width: 1920, height: 1080 });

    // 拦截请求以阻止图片和样式表（加快速度）
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const type = req.resourceType();
      const url = req.url();
      // 保留关键资源，只阻止图片
      if (type === 'image' || url.includes('.jpg') || url.includes('.png') || url.includes('.gif')) {
        req.abort();
      } else {
        req.continue();
      }
    });

    // 导航到页面（使用更宽松的条件）
    try {
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 45000
      });
    } catch (error) {
      // 如果 networkidle2 超时，尝试 domcontentloaded
      console.log(`    ⚠️  使用备用加载策略`);
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 45000
      });
    }

    // 等待内容加载
    await page.waitForTimeout(waitFor);

    // 提取内容
    const content = await page.evaluate((selector) => {
      // 尝试多个选择器
      const selectors = selector ? [selector] : [
        'article',
        '.article-content',
        '.post-content',
        'main',
        '#main-content',
        '#content',
        '.content-body'
      ];

      let element = null;
      for (const sel of selectors) {
        try {
          element = document.querySelector(sel);
          if (element && element.textContent.trim().length > 500) {
            break;
          }
        } catch (e) {
          continue;
        }
      }

      if (!element) {
        element = document.body;
      }

      // 移除脚本、样式等
      const clone = element.cloneNode(true);
      const unwanted = clone.querySelectorAll('script, style, nav, header, footer, aside, .advertisement, .social-share, .comment, .related, .sidebar, .navigation, .menu, .breadcrumb, .share, .author-bio, form, button, .ad, .banner');
      unwanted.forEach(el => el.remove());

      // 提取标题
      const title = document.querySelector('h1')?.textContent?.trim() ||
                    document.querySelector('.article-title')?.textContent?.trim() ||
                    document.querySelector('title')?.textContent?.trim() ||
                    '';

      // 提取正文
      const paragraphs = [];
      clone.querySelectorAll('p, li, td, dd, blockquote').forEach(el => {
        const text = el.textContent.trim();
        if (text.length >= 30 && text.length <= 2000) {
          paragraphs.push(text);
        }
      });

      const content = paragraphs.join('\n\n');

      return {
        title,
        content,
        html: clone.innerHTML,
        url: window.location.href
      };
    }, contentSelector);

    return content;

  } catch (error) {
    console.error(`    ❌ Puppeteer 错误: ${error.message}`);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * 检查文章是否已存在
 */
async function articleExists(url, title) {
  // 检查 URL
  const { data: urlMatch } = await supabase
    .from('articles')
    .select('id')
    .ilike('license', `%${url}%`)
    .limit(1);

  if (urlMatch && urlMatch.length > 0) {
    return { exists: true, reason: 'URL已存在' };
  }

  // 检查标题
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
 * 保存文章到数据库
 */
async function saveArticle(articleData, sourceInfo) {
  try {
    const slug = generateSlug(articleData.title);
    const region = sourceInfo.region === 'UK' ? 'Global' : sourceInfo.region;

    // 检查是否已存在
    const existsCheck = await articleExists(articleData.url, articleData.title);
    if (existsCheck.exists) {
      return { success: false, reason: existsCheck.reason };
    }

    const oneLiner = buildContentOneLiner(articleData.content, sourceInfo.name);

    const article = {
      slug,
      type: 'explainer',
      hub: 'feeding',
      lang: sourceInfo.language || 'en',
      title: articleData.title.substring(0, 200),
      one_liner: oneLiner,
      key_facts: buildDefaultKeyFacts({
        sourceName: sourceInfo.name,
        region: sourceInfo.region
      }),
      body_md: articleData.content,
      entities: extractKeywords(articleData.content),
      age_range: '0-12 months',
      region: region,
      last_reviewed: new Date().toISOString().split('T')[0],
      reviewed_by: 'Browser Scraper Bot',
      license: `Source: ${sourceInfo.name} (${sourceInfo.organization}) | Region: ${sourceInfo.region} | URL: ${articleData.url}`,
      meta_title: buildMetaTitle(articleData.title),
      meta_description: buildMetaDescription(articleData.content, sourceInfo.name),
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
      publisher: sourceInfo.organization,
      date: new Date().toISOString().split('T')[0]
    }]);

    return { success: true, id: data.id };

  } catch (error) {
    return { success: false, reason: error.message };
  }
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
 * 主函数
 */
async function main() {
  console.log('🌐 开始使用浏览器工具抓取反爬站点\n');
  console.log('='.repeat(70));

  const stats = {
    attempted: 0,
    successful: 0,
    failed: 0,
    bySource: {}
  };

  // 遍历每个反爬站点
  for (const site of ANTI_CRAWL_SITES) {
    console.log(`\n📌 处理站点: ${site.name}`);
    console.log('─'.repeat(70));
    
    stats.bySource[site.name] = { attempted: 0, successful: 0, failed: 0 };

    // 处理测试 URL
    for (const url of site.testUrls) {
      stats.attempted++;
      stats.bySource[site.name].attempted++;

      console.log(`\n  🔍 抓取: ${url}`);

      try {
        // 使用 Puppeteer 抓取
        const content = await scrapeWithBrowser(url, {
          contentSelector: site.contentSelector,
          waitFor: 3000
        });

        if (!content || !content.content) {
          console.log(`  ❌ 无法提取内容`);
          stats.failed++;
          stats.bySource[site.name].failed++;
          await delay(2000);
          continue;
        }

        // 验证内容质量
        const validation = validateContent(content.title, content.content);
        if (!validation.valid) {
          console.log(`  ❌ 内容质量不足: ${validation.reason}`);
          stats.failed++;
          stats.bySource[site.name].failed++;
          await delay(2000);
          continue;
        }

        console.log(`  ✅ 提取成功: ${content.title.substring(0, 60)}`);
        console.log(`     ${content.content.length} 字符`);

        // 准备保存数据
        const articleData = {
          title: content.title,
          content: content.content,
          url: content.url || url
        };

        const sourceInfo = {
          name: site.name,
          organization: site.organization,
          region: site.region,
          language: site.language
        };

        // 保存到数据库
        const result = await saveArticle(articleData, sourceInfo);

        if (result.success) {
          console.log(`  💾 已保存 (ID: ${result.id})`);
          stats.successful++;
          stats.bySource[site.name].successful++;
        } else {
          console.log(`  ⏭️  跳过: ${result.reason}`);
          if (result.reason.includes('已存在')) {
            // 已存在的文章不算失败
            stats.failed--;
            stats.bySource[site.name].failed--;
          } else {
            stats.failed++;
            stats.bySource[site.name].failed++;
          }
        }

      } catch (error) {
        console.log(`  ❌ 错误: ${error.message}`);
        stats.failed++;
        stats.bySource[site.name].failed++;
      }

      // 延迟以避免被封
      await delay(3000);
    }
  }

  // 显示统计
  console.log('\n' + '='.repeat(70));
  console.log('📊 抓取结果统计');
  console.log('='.repeat(70));
  console.log(`尝试抓取: ${stats.attempted} 篇`);
  console.log(`成功保存: ${stats.successful} 篇 ✅`);
  console.log(`失败: ${stats.failed} 篇 ❌`);
  
  if (stats.attempted > 0) {
    console.log(`成功率: ${((stats.successful / stats.attempted) * 100).toFixed(1)}%\n`);
  }

  console.log('按站点统计:');
  Object.entries(stats.bySource).forEach(([source, data]) => {
    console.log(`  ${source}: 尝试${data.attempted}篇 | 成功${data.successful}篇 | 失败${data.failed}篇`);
  });

  console.log('\n✅ 完成！\n');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { scrapeWithBrowser, saveArticle };
