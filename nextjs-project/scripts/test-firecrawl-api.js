#!/usr/bin/env node

/**
 * 直接测试Firecrawl API连接
 * 使用你的API密钥测试抓取功能
 */

const https = require('https');

// 你的Firecrawl API密钥
const FIRECRAWL_API_KEY = 'fc-8446170a8fe542688e8cf234179bb188';
const FIRECRAWL_API_URL = 'https://api.firecrawl.dev/v0';

/**
 * 发送HTTP请求到Firecrawl API
 */
function makeFirecrawlRequest(endpoint, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'api.firecrawl.dev',
      port: 443,
      path: `/v0${endpoint}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsedData);
          } else {
            reject(new Error(`API Error ${res.statusCode}: ${parsedData.error || responseData}`));
          }
        } catch (error) {
          reject(new Error(`Parse Error: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

/**
 * 测试抓取AAP页面
 */
async function testScrapeAAP() {
  console.log('🔍 测试抓取AAP页面...');
  
  try {
    const result = await makeFirecrawlRequest('/scrape', {
      url: 'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Starting-Solid-Foods.aspx',
      formats: ['markdown'],
      onlyMainContent: true,
      removeBase64Images: true
    });

    console.log('✅ 抓取成功!');
    console.log(`📄 标题: ${result.data?.metadata?.title || 'N/A'}`);
    console.log(`📝 内容长度: ${result.data?.markdown?.length || 0} 字符`);
    console.log(`🔗 URL: ${result.data?.metadata?.sourceURL || 'N/A'}`);
    
    // 显示内容预览
    if (result.data?.markdown) {
      const preview = result.data.markdown.substring(0, 300);
      console.log('\n📖 内容预览:');
      console.log(preview + '...');
    }

    return result;
  } catch (error) {
    console.error('❌ 抓取失败:', error.message);
    return null;
  }
}

/**
 * 测试搜索功能
 */
async function testSearch() {
  console.log('\n🔎 测试搜索功能...');
  
  try {
    const result = await makeFirecrawlRequest('/search', {
      query: 'infant nutrition guidelines AAP',
      limit: 3,
      sources: [{ type: 'web' }]
    });

    console.log('✅ 搜索成功!');
    console.log(`🔍 找到 ${result.data?.length || 0} 个结果`);
    
    if (result.data && result.data.length > 0) {
      result.data.forEach((item, index) => {
        console.log(`\n${index + 1}. ${item.title || 'N/A'}`);
        console.log(`   🔗 ${item.url || 'N/A'}`);
        console.log(`   📝 ${item.snippet || 'N/A'}`);
      });
    }

    return result;
  } catch (error) {
    console.error('❌ 搜索失败:', error.message);
    return null;
  }
}

/**
 * 测试网站映射
 */
async function testMapWebsite() {
  console.log('\n🗺️ 测试网站映射...');
  
  try {
    const result = await makeFirecrawlRequest('/map', {
      url: 'https://www.nhs.uk',
      search: 'baby feeding',
      limit: 5
    });

    console.log('✅ 映射成功!');
    console.log(`🗺️ 发现 ${result.data?.length || 0} 个页面`);
    
    if (result.data && result.data.length > 0) {
      result.data.forEach((page, index) => {
        console.log(`\n${index + 1}. ${page.title || 'N/A'}`);
        console.log(`   🔗 ${page.url || 'N/A'}`);
      });
    }

    return result;
  } catch (error) {
    console.error('❌ 映射失败:', error.message);
    return null;
  }
}

/**
 * 测试AI提取功能
 */
async function testAIExtract() {
  console.log('\n🤖 测试AI提取功能...');
  
  try {
    const result = await makeFirecrawlRequest('/extract', {
      urls: ['https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Starting-Solid-Foods.aspx'],
      prompt: 'Extract the following information: title, summary, key medical advice, age recommendations, and safety guidelines',
      schema: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          summary: { type: 'string' },
          keyPoints: { type: 'array', items: { type: 'string' } },
          ageRange: { type: 'string' },
          medicalAdvice: { type: 'string' },
          safetyNotes: { type: 'string' }
        }
      }
    });

    console.log('✅ AI提取成功!');
    console.log('📊 提取结果:');
    console.log(JSON.stringify(result.data, null, 2));

    return result;
  } catch (error) {
    console.error('❌ AI提取失败:', error.message);
    return null;
  }
}

/**
 * 主测试函数
 */
async function main() {
  console.log('🚀 Firecrawl API 直接测试');
  console.log('='.repeat(50));
  console.log(`🔑 API密钥: ${FIRECRAWL_API_KEY.substring(0, 10)}...`);
  console.log(`🌐 API端点: ${FIRECRAWL_API_URL}`);
  
  const results = {
    scrape: null,
    search: null,
    map: null,
    extract: null
  };

  try {
    // 测试各个功能
    results.scrape = await testScrapeAAP();
    results.search = await testSearch();
    results.map = await testMapWebsite();
    results.extract = await testAIExtract();

    // 统计结果
    console.log('\n📊 测试结果统计:');
    console.log(`✅ 抓取功能: ${results.scrape ? '成功' : '失败'}`);
    console.log(`✅ 搜索功能: ${results.search ? '成功' : '失败'}`);
    console.log(`✅ 映射功能: ${results.map ? '成功' : '失败'}`);
    console.log(`✅ AI提取功能: ${results.extract ? '成功' : '失败'}`);

    const successCount = Object.values(results).filter(Boolean).length;
    console.log(`\n🎯 总体成功率: ${successCount}/4 (${(successCount/4*100).toFixed(1)}%)`);

    if (successCount > 0) {
      console.log('\n🎉 Firecrawl API连接正常！');
      console.log('💡 建议: 可以开始集成到你们的母婴内容爬虫系统');
    } else {
      console.log('\n❌ Firecrawl API连接失败');
      console.log('💡 建议: 检查API密钥和网络连接');
    }

  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error.message);
  }
}

// 运行测试
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, testScrapeAAP, testSearch, testMapWebsite, testAIExtract };
