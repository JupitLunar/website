#!/usr/bin/env node

/**
 * Playwright 爬虫 - NHS 站点测试版
 * 专门用于测试 NHS 站点的抓取和入库
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

const NHS_SITE = {
  name: 'National Health Service (NHS)',
  organization: 'NHS',
  baseUrl: 'https://www.nhs.uk',
  region: 'UK',
  language: 'en',
  categoryUrls: [
    'https://www.nhs.uk/baby/weaning-and-feeding/',
    'https://www.nhs.uk/baby/breastfeeding-bottle-feeding/'
  ],
  linkPattern: /\/baby\/weaning-and-feeding\/[^\/]+\/$|\/baby\/breastfeeding-bottle-feeding\/[^\/]+\/$/,
  contentSelector: 'article, .article-body, #maincontent'
};

/**
 * 发现文章链接
 */
async function discoverArticles(browser) {
  const articles = new Set();
  const page = await browser.newPage();

  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9'
  });

  try {
    for (const categoryUrl of NHS_SITE.categoryUrls) {
      console.log(`  📂 浏览分类页: ${categoryUrl}`);
      
      try {
        await page.goto(categoryUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(5000);

        const links = await page.evaluate(() => {
          const allLinks = Array.from(document.querySelectorAll('a[href]'));
          const patterns = [
            /\/baby\/weaning-and-feeding\/[^\/]+\/$/,
            /\/baby\/breastfeeding-bottle-feeding\/[^\/]+\/$/
          ];
          const found = [];
          
          allLinks.forEach(link => {
            const href = link.href;
            if (href && href.startsWith('https://www.nhs.uk')) {
              // 排除锚点链接
              if (href.includes('#')) return;
              // 检查是否匹配任一模式
              if (patterns.some(p => p.test(href))) {
                found.push(href);
              }
            }
          });
          
          return [...new Set(found)];
        });

        links.forEach(url => articles.add(url));
        console.log(`    ✅ 发现 ${links.length} 个链接`);
        await delay(2000);
      } catch (error) {
        console.log(`    ⚠️  失败: ${error.message}`);
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
async function scrapeArticle(url, browser) {
  const page = await browser.newPage();
  
  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9'
  });
  
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(5000);

    const content = await page.evaluate(() => {
      const article = document.querySelector('article') || 
                     document.querySelector('.article-body') ||
                     document.querySelector('#maincontent') ||
                     document.body;

      const title = document.querySelector('h1')?.textContent?.trim() || document.title;

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
async function saveArticle(articleData) {
  try {
    const slug = generateSlug(articleData.title);
    const existsCheck = await articleExists(articleData.url, articleData.title);
    if (existsCheck.exists) {
      return { success: false, reason: existsCheck.reason };
    }

    const oneLiner = buildContentOneLiner(articleData.content, NHS_SITE.name);

    const article = {
      slug,
      type: 'explainer',
      hub: 'feeding',
      lang: 'en',
      title: articleData.title.substring(0, 200),
      one_liner: oneLiner,
      key_facts: buildDefaultKeyFacts({
        sourceName: NHS_SITE.name,
        region: NHS_SITE.region
      }),
      body_md: articleData.content,
      entities: extractKeywords(articleData.content),
      age_range: '0-12 months',
      region: 'Global',
      last_reviewed: new Date().toISOString().split('T')[0],
      reviewed_by: 'Playwright Scraper Bot',
      license: `Source: ${NHS_SITE.name} (${NHS_SITE.organization}) | Region: ${NHS_SITE.region} | URL: ${articleData.url}`,
      meta_title: buildMetaTitle(articleData.title),
      meta_description: buildMetaDescription(articleData.content, NHS_SITE.name),
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
      publisher: NHS_SITE.organization,
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
  console.log('🌐 NHS 站点 Playwright 爬虫测试\n');
  console.log('='.repeat(70));

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const stats = {
    discovered: 0,
    attempted: 0,
    successful: 0,
    failed: 0
  };

  try {
    // 发现文章
    console.log('\n🔍 发现文章链接...');
    const articleUrls = await discoverArticles(browser);
    stats.discovered = articleUrls.length;
    console.log(`\n✅ 总共发现 ${articleUrls.length} 篇文章\n`);

    // 处理所有发现的文章
    const urlsToProcess = articleUrls;

    // 抓取文章
    for (let i = 0; i < urlsToProcess.length; i++) {
      const url = urlsToProcess[i];
      stats.attempted++;

      console.log(`\n[${i + 1}/${urlsToProcess.length}] ${url}`);

      try {
        const content = await scrapeArticle(url, browser);

        if (!content || !content.content) {
          console.log(`  ❌ 无法提取内容`);
          stats.failed++;
          await delay(3000);
          continue;
        }

        const validation = validateContent(content.title, content.content);
        if (!validation.valid) {
          console.log(`  ❌ 内容质量不足: ${validation.reason}`);
          stats.failed++;
          await delay(2000);
          continue;
        }

        console.log(`  ✅ 提取成功: ${content.title.substring(0, 60)}`);
        console.log(`     ${content.content.length} 字符`);

        const result = await saveArticle(content);

        if (result.success) {
          console.log(`  💾 已保存 (ID: ${result.id})`);
          stats.successful++;
        } else {
          console.log(`  ⏭️  跳过: ${result.reason}`);
          if (!result.reason.includes('已存在')) {
            stats.failed++;
          }
        }

      } catch (error) {
        console.log(`  ❌ 错误: ${error.message}`);
        stats.failed++;
      }

      await delay(3000);
    }

  } finally {
    await browser.close();
  }

  // 统计
  console.log('\n' + '='.repeat(70));
  console.log('📊 抓取结果统计');
  console.log('='.repeat(70));
  console.log(`发现文章: ${stats.discovered} 篇`);
  console.log(`尝试抓取: ${stats.attempted} 篇`);
  console.log(`成功保存: ${stats.successful} 篇 ✅`);
  console.log(`失败: ${stats.failed} 篇 ❌`);
  
  if (stats.attempted > 0) {
    console.log(`成功率: ${((stats.successful / stats.attempted) * 100).toFixed(1)}%\n`);
  }

  console.log('✅ 完成！\n');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
