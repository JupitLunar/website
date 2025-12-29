#!/usr/bin/env node

/**
 * Playwright 爬虫测试 - 测试单个站点
 * 用于快速验证 Playwright + Stealth 是否能绕过反爬
 */

const { chromium } = require('playwright');

async function testSite(url, siteName) {
  console.log(`\n🧪 测试站点: ${siteName}`);
  console.log(`🔗 URL: ${url}`);
  console.log('─'.repeat(70));

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    console.log('  ⏳ 正在访问页面...');
    const startTime = Date.now();
    
    try {
      await page.goto(url, { 
        waitUntil: 'networkidle', 
        timeout: 45000 
      });
      
      const loadTime = Date.now() - startTime;
      console.log(`  ✅ 页面加载成功 (${loadTime}ms)`);

      // 等待内容渲染
      await page.waitForTimeout(3000);

      // 检查页面内容
      const title = await page.title();
      console.log(`  📄 页面标题: ${title}`);

      // 尝试提取内容
      const content = await page.evaluate(() => {
        const article = document.querySelector('article') || 
                       document.querySelector('.article-content') ||
                       document.querySelector('main') ||
                       document.body;
        
        return {
          title: document.querySelector('h1')?.textContent?.trim() || document.title,
          contentLength: article.textContent.trim().length,
          hasContent: article.textContent.trim().length > 500
        };
      });

      console.log(`  📝 内容长度: ${content.contentLength} 字符`);
      console.log(`  ${content.hasContent ? '✅' : '⚠️'} 内容提取: ${content.hasContent ? '成功' : '内容可能不足'}`);

      // 尝试提取链接（如果是分类页）
      const links = await page.evaluate(() => {
        const allLinks = Array.from(document.querySelectorAll('a[href]'));
        return allLinks
          .map(a => a.href)
          .filter(href => href && !href.startsWith('javascript:'))
          .slice(0, 10); // 只取前10个
      });

      console.log(`  🔗 发现链接数: ${links.length} 个`);
      if (links.length > 0) {
        console.log(`  📋 示例链接:`);
        links.slice(0, 3).forEach((link, i) => {
          console.log(`     ${i + 1}. ${link.substring(0, 80)}...`);
        });
      }

      return { success: true, content, links };

    } catch (error) {
      const loadTime = Date.now() - startTime;
      console.log(`  ❌ 页面加载失败 (${loadTime}ms)`);
      console.log(`  📌 错误: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      await page.close();
    }

  } finally {
    await browser.close();
  }
}

async function main() {
  console.log('🧪 Playwright + Stealth 插件测试');
  console.log('='.repeat(70));

  const testUrls = [
    {
      url: 'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Starting-Solid-Foods.aspx',
      name: 'AAP - Starting Solid Foods'
    },
    {
      url: 'https://www.cdc.gov/nutrition/infantandtoddlernutrition/foods-and-drinks/when-to-introduce-solid-foods.html',
      name: 'CDC - When to Introduce Solid Foods'
    },
    {
      url: 'https://www.nhs.uk/conditions/baby/weaning-and-feeding/',
      name: 'NHS - Weaning and Feeding'
    }
  ];

  const results = [];

  for (const test of testUrls) {
    const result = await testSite(test.url, test.name);
    results.push({ ...test, ...result });
    
    // 站点间延迟
    if (test !== testUrls[testUrls.length - 1]) {
      console.log('\n⏳ 等待 5 秒...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  // 总结
  console.log('\n' + '='.repeat(70));
  console.log('📊 测试总结');
  console.log('='.repeat(70));

  results.forEach(result => {
    console.log(`\n${result.name}:`);
    console.log(`  ${result.success ? '✅' : '❌'} ${result.success ? '成功' : '失败'}`);
    if (result.success && result.content) {
      console.log(`  内容长度: ${result.content.contentLength} 字符`);
      console.log(`  链接数: ${result.links?.length || 0} 个`);
    } else if (result.error) {
      console.log(`  错误: ${result.error}`);
    }
  });

  const successCount = results.filter(r => r.success).length;
  console.log(`\n✅ 成功: ${successCount}/${results.length} 个站点`);
}

if (require.main === module) {
  main().catch(console.error);
}

