#!/usr/bin/env node

/**
 * 详细测试 AAP 和 CDC - 检查实际内容提取
 */

const { chromium } = require('playwright');

async function testAAP() {
  console.log('🧪 测试 AAP (healthychildren.org)\n');
  console.log('='.repeat(70));

  const url = 'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Starting-Solid-Foods.aspx';

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      extraHTTPHeaders: {
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    const page = await context.newPage();

    console.log(`访问: ${url}\n`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(5000);

    const content = await page.evaluate(() => {
      const title = document.querySelector('h1')?.textContent?.trim() || document.title;
      
      // 尝试多个内容选择器
      const selectors = ['article', '.article-content', 'main', '#main-content', '.content'];
      let article = null;
      
      for (const sel of selectors) {
        article = document.querySelector(sel);
        if (article && article.textContent.trim().length > 1000) {
          break;
        }
      }

      if (!article) {
        article = document.body;
      }

      // 提取段落
      const clone = article.cloneNode(true);
      const unwanted = clone.querySelectorAll('script, style, nav, header, footer, aside');
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
        paragraphCount: paragraphs.length,
        contentLength: paragraphs.join('\n\n').length
      };
    });

    console.log(`✅ 成功提取内容:`);
    console.log(`   标题: ${content.title}`);
    console.log(`   段落数: ${content.paragraphCount}`);
    console.log(`   内容长度: ${content.contentLength} 字符\n`);
    console.log(`前 500 字符:`);
    console.log(content.content.substring(0, 500) + '...\n');

    await page.close();
    await context.close();

    return { success: true, content };
  } catch (error) {
    console.error(`❌ 错误: ${error.message}\n`);
    return { success: false, error: error.message };
  } finally {
    await browser.close();
  }
}

async function testCDC() {
  console.log('\n🧪 测试 CDC (cdc.gov)\n');
  console.log('='.repeat(70));

  // 尝试几个可能的 CDC URL
  const urls = [
    'https://www.cdc.gov/nutrition/infantandtoddlernutrition/index.html',
    'https://www.cdc.gov/nutrition/infantandtoddlernutrition/foods-and-drinks/when-to-introduce-solid-foods.html',
    'https://www.cdc.gov/nutrition/infantandtoddlernutrition/breastfeeding/index.html'
  ];

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      extraHTTPHeaders: {
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    for (const url of urls) {
      try {
        const page = await context.newPage();
        
        console.log(`访问: ${url}`);
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForTimeout(5000);

        const content = await page.evaluate(() => {
          const title = document.querySelector('h1')?.textContent?.trim() || document.title;
          const is404 = title.includes('404') || title.includes('Not Found') || document.body.textContent.includes('404');
          
          const article = document.querySelector('article') || 
                         document.querySelector('main') || 
                         document.querySelector('#main-content') ||
                         document.body;

          const paragraphs = [];
          article.querySelectorAll('p, li, td, dd').forEach(el => {
            const text = el.textContent.trim();
            if (text.length >= 30 && text.length <= 2000) {
              paragraphs.push(text);
            }
          });

          return {
            title,
            is404,
            contentLength: article.textContent.trim().length,
            paragraphCount: paragraphs.length,
            hasContent: article.textContent.trim().length > 1000 && !is404
          };
        });

        console.log(`   标题: ${content.title}`);
        console.log(`   内容长度: ${content.contentLength} 字符`);
        console.log(`   段落数: ${content.paragraphCount}`);
        console.log(`   ${content.is404 ? '❌ 404 页面' : content.hasContent ? '✅ 有内容' : '⚠️  内容不足'}\n`);

        if (content.hasContent) {
          await page.close();
          await context.close();
          return { success: true, url, content };
        }

        await page.close();
      } catch (error) {
        console.log(`   ❌ 错误: ${error.message}\n`);
      }
    }

    await context.close();
    return { success: false };
  } catch (error) {
    console.error(`❌ 错误: ${error.message}\n`);
    return { success: false, error: error.message };
  } finally {
    await browser.close();
  }
}

async function main() {
  console.log('🧪 AAP 和 CDC 详细测试\n');
  console.log('='.repeat(70));

  const aapResult = await testAAP();
  const cdcResult = await testCDC();

  console.log('\n' + '='.repeat(70));
  console.log('📊 测试总结\n');
  console.log(`AAP: ${aapResult.success ? '✅ 成功' : '❌ 失败'}`);
  console.log(`CDC: ${cdcResult.success ? '✅ 成功' : '❌ 失败'}\n`);
}

if (require.main === module) {
  main().catch(console.error);
}


