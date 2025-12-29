#!/usr/bin/env node

/**
 * 调试 AAP 链接发现
 * 查看分类页上的实际链接格式
 */

const { chromium } = require('playwright');

async function debugAAPLinks() {
  console.log('🔍 调试 AAP 链接发现\n');
  console.log('='.repeat(70));

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

  const url = 'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/default.aspx';

  try {
    const page = await context.newPage();
    
    console.log(`访问: ${url}\n`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(5000);

    const links = await page.evaluate(() => {
      const allLinks = Array.from(document.querySelectorAll('a[href]'));
      const healthychildrenLinks = allLinks
        .map(link => link.href)
        .filter(href => href && href.includes('healthychildren.org') && !href.includes('javascript:'))
        .slice(0, 30);

      return healthychildrenLinks;
    });

    console.log(`发现 ${links.length} 个 healthychildren.org 链接:\n`);
    links.forEach((link, i) => {
      console.log(`${i + 1}. ${link}`);
    });

    // 尝试提取可能的文章链接
    const articleLinks = await page.evaluate(() => {
      const allLinks = Array.from(document.querySelectorAll('a[href]'));
      const patterns = [
        /\/Pages\/[^\/]+\.aspx$/i,
        /\/English\/ages-stages\/baby\/[^\/]+\/Pages\/[^\/]+\.aspx$/i
      ];
      
      const found = [];
      allLinks.forEach(link => {
        const href = link.href;
        if (href && href.includes('healthychildren.org')) {
          if (patterns.some(p => p.test(href)) && !href.includes('default.aspx')) {
            found.push({
              href,
              text: link.textContent.trim().substring(0, 60)
            });
          }
        }
      });
      
      return [...new Set(found.map(f => f.href))];
    });

    console.log(`\n\n匹配文章模式的链接 (${articleLinks.length} 个):\n`);
    articleLinks.forEach((link, i) => {
      console.log(`${i + 1}. ${link}`);
    });

    await page.close();
  } catch (error) {
    console.error(`❌ 错误: ${error.message}`);
  } finally {
    await context.close();
    await browser.close();
  }
}

debugAAPLinks().catch(console.error);


