#!/usr/bin/env node

/**
 * 调试 AAP 内容提取
 */

const { chromium } = require('playwright');

async function debugAAPContent() {
  const url = 'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/starting-solid-foods.aspx';

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9'
    }
  });

  try {
    const page = await context.newPage();
    
    console.log(`访问: ${url}\n`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(5000);

    const content = await page.evaluate(() => {
      const title = document.querySelector('h1')?.textContent?.trim() || document.title;

      // 尝试多个选择器
      const selectors = [
        'article',
        '.article-content',
        '.post-content',
        'main',
        '#main-content',
        '#content',
        '.content-body',
        '.article-body',
        '[role="main"]'
      ];

      let element = null;
      let usedSelector = null;
      
      for (const sel of selectors) {
        const candidates = document.querySelectorAll(sel);
        for (const el of candidates) {
          const textLength = el.textContent.trim().length;
          console.log(`Selector ${sel}: ${textLength} chars`);
          if (textLength > 500) {
            element = el;
            usedSelector = sel;
            break;
          }
        }
        if (element) break;
      }

      if (!element) {
        element = document.body;
        usedSelector = 'body';
      }

      console.log(`Using selector: ${usedSelector}, content length: ${element.textContent.trim().length}`);

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

      // 也尝试提取 div 中的文本
      const divTexts = [];
      clone.querySelectorAll('div').forEach(el => {
        const text = el.textContent.trim();
        // 如果 div 包含多个子段落，可能是主要内容
        if (text.length >= 200 && text.length <= 5000 && el.children.length > 2) {
          divTexts.push(text);
        }
      });

      return {
        title,
        contentLength: element.textContent.trim().length,
        paragraphCount: paragraphs.length,
        paragraphs: paragraphs.slice(0, 5), // 前5个段落
        divTextCount: divTexts.length,
        usedSelector,
        firstParagraph: paragraphs[0] || 'N/A',
        rawContent: element.textContent.trim().substring(0, 1000)
      };
    });

    console.log(`标题: ${content.title}`);
    console.log(`使用的选择器: ${content.usedSelector}`);
    console.log(`总内容长度: ${content.contentLength} 字符`);
    console.log(`段落数: ${content.paragraphCount}`);
    console.log(`\n第一个段落: ${content.firstParagraph.substring(0, 200)}...`);
    console.log(`\n原始内容前 1000 字符:\n${content.rawContent}...`);

    await page.close();
  } catch (error) {
    console.error(`❌ 错误: ${error.message}`);
  } finally {
    await context.close();
    await browser.close();
  }
}

debugAAPContent().catch(console.error);


