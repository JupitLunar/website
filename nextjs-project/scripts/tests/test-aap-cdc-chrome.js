#!/usr/bin/env node

/**
 * 测试 AAP 和 CDC 站点 - 使用 Chrome（非 headless 模式）
 * 尝试不同的浏览器配置来绕过反爬机制
 */

const { chromium } = require('playwright');

const TEST_URLS = {
  AAP: [
    'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Starting-Solid-Foods.aspx'
  ],
  CDC: [
    'https://www.cdc.gov/nutrition/infantandtoddlernutrition/foods-and-drinks/when-to-introduce-solid-foods.html'
  ]
};

async function testWithConfig(url, siteName, config) {
  console.log(`\n🧪 测试 ${siteName}: ${url}`);
  console.log(`   配置: ${config.name}`);
  console.log('─'.repeat(70));

  let browser;
  try {
    // 不同的浏览器配置
    const launchOptions = {
      headless: config.headless,
      args: config.args || [],
      timeout: 60000,
      ...(config.executablePath && { executablePath: config.executablePath })
    };

    console.log(`  启动浏览器 (headless: ${config.headless})...`);
    browser = await chromium.launch(launchOptions);

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      extraHTTPHeaders: {
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    });

    const page = await context.newPage();

    const startTime = Date.now();
    
    try {
      console.log(`  正在访问页面...`);
      await page.goto(url, { 
        waitUntil: config.waitUntil || 'domcontentloaded',
        timeout: config.timeout || 60000
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
          hasContent: article.textContent.trim().length > 500,
          hasAccessDenied: document.body.textContent.includes('Access Denied') || 
                          document.body.textContent.includes('403') ||
                          document.body.textContent.includes('blocked')
        };
      });

      console.log(`  📝 内容长度: ${content.contentLength} 字符`);
      console.log(`  ${content.hasContent ? '✅' : '❌'} 内容提取: ${content.hasContent ? '成功' : '失败'}`);
      
      if (content.hasAccessDenied) {
        console.log(`  ⚠️  检测到访问被拒绝或反爬内容`);
      }

      return { 
        success: true, 
        config: config.name,
        content,
        loadTime 
      };

    } catch (error) {
      const loadTime = Date.now() - startTime;
      console.log(`  ❌ 页面加载失败 (${loadTime}ms)`);
      console.log(`  📌 错误: ${error.message}`);
      return { 
        success: false, 
        config: config.name,
        error: error.message,
        loadTime 
      };
    } finally {
      await page.close();
    }

  } catch (error) {
    console.log(`  ❌ 浏览器启动失败: ${error.message}`);
    return { 
      success: false, 
      config: config.name,
      error: error.message 
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function main() {
  console.log('🧪 AAP 和 CDC 站点测试 - 使用不同浏览器配置');
  console.log('='.repeat(70));

  // 不同的配置选项
  const configs = [
    {
      name: 'Headless (默认)',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      waitUntil: 'domcontentloaded',
      timeout: 60000
    },
    {
      name: 'Non-headless (显示浏览器)',
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      waitUntil: 'domcontentloaded',
      timeout: 60000
    },
    {
      name: 'Non-headless + networkidle',
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      waitUntil: 'networkidle',
      timeout: 90000
    },
    {
      name: 'Non-headless + 完整参数',
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--window-size=1920,1080'
      ],
      waitUntil: 'domcontentloaded',
      timeout: 60000
    }
  ];

  const results = {
    AAP: [],
    CDC: []
  };

  // 测试 AAP
  console.log('\n📌 测试 AAP (healthychildren.org)');
  console.log('='.repeat(70));
  
  for (const config of configs) {
    const result = await testWithConfig(
      TEST_URLS.AAP[0],
      'AAP',
      config
    );
    results.AAP.push(result);
    
    if (result.success) {
      console.log(`\n  ✅ ${config.name} 成功！`);
      break; // 如果成功，就不需要测试其他配置了
    }
    
    // 配置之间延迟
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  // 测试 CDC
  console.log('\n\n📌 测试 CDC (cdc.gov)');
  console.log('='.repeat(70));
  
  for (const config of configs) {
    const result = await testWithConfig(
      TEST_URLS.CDC[0],
      'CDC',
      config
    );
    results.CDC.push(result);
    
    if (result.success) {
      console.log(`\n  ✅ ${config.name} 成功！`);
      break;
    }
    
    // 配置之间延迟
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  // 总结
  console.log('\n\n' + '='.repeat(70));
  console.log('📊 测试总结');
  console.log('='.repeat(70));

  console.log('\nAAP 测试结果:');
  const aapSuccess = results.AAP.find(r => r.success);
  if (aapSuccess) {
    console.log(`  ✅ 成功配置: ${aapSuccess.config}`);
    console.log(`     加载时间: ${aapSuccess.loadTime}ms`);
    console.log(`     内容长度: ${aapSuccess.content.contentLength} 字符`);
  } else {
    console.log('  ❌ 所有配置都失败');
    results.AAP.forEach(r => {
      console.log(`     ${r.config}: ${r.error || '失败'}`);
    });
  }

  console.log('\nCDC 测试结果:');
  const cdcSuccess = results.CDC.find(r => r.success);
  if (cdcSuccess) {
    console.log(`  ✅ 成功配置: ${cdcSuccess.config}`);
    console.log(`     加载时间: ${cdcSuccess.loadTime}ms`);
    console.log(`     内容长度: ${cdcSuccess.content.contentLength} 字符`);
  } else {
    console.log('  ❌ 所有配置都失败');
    results.CDC.forEach(r => {
      console.log(`     ${r.config}: ${r.error || '失败'}`);
    });
  }

  console.log('\n');
}

if (require.main === module) {
  main().catch(console.error);
}

