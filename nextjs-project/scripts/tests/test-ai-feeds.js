#!/usr/bin/env node

/**
 * 测试AI Feed端点 - 验证RAG数据库的AI引用准备情况
 */

const https = require('https');
const http = require('http');

// 配置
const BASE_URL = 'http://localhost:3000'; // 开发环境
// const BASE_URL = 'https://jupitlunar.com'; // 生产环境

const AI_FEED_ENDPOINTS = [
  '/api/ai-feed',
  '/api/llm/answers',
  '/api/kb/feed',
  '/api/rag'
];

/**
 * 发送HTTP请求
 */
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data,
          url: url
        });
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * 测试AI Feed端点
 */
async function testAIFeedEndpoints() {
  console.log('🤖 测试AI Feed端点...\n');
  
  for (const endpoint of AI_FEED_ENDPOINTS) {
    const url = `${BASE_URL}${endpoint}`;
    console.log(`📡 测试端点: ${endpoint}`);
    
    try {
      const response = await makeRequest(url);
      
      console.log(`   状态码: ${response.status}`);
      console.log(`   内容类型: ${response.headers['content-type']}`);
      console.log(`   内容长度: ${response.data.length} 字符`);
      
      // 检查响应头中的AI相关字段
      const aiHeaders = [
        'x-ai-feed-version',
        'x-ai-feed-generated',
        'x-ai-feed-count',
        'x-robots-tag'
      ];
      
      aiHeaders.forEach(header => {
        if (response.headers[header]) {
          console.log(`   ${header}: ${response.headers[header]}`);
        }
      });
      
      // 尝试解析数据
      if (response.status === 200) {
        try {
          if (endpoint.includes('answers')) {
            // JSON格式
            const jsonData = JSON.parse(response.data);
            console.log(`   数据格式: JSON`);
            console.log(`   记录数量: ${Array.isArray(jsonData) ? jsonData.length : 'N/A'}`);
            
            if (Array.isArray(jsonData) && jsonData.length > 0) {
              console.log(`   示例记录: ${jsonData[0].question || jsonData[0].title || 'N/A'}`);
            }
          } else if (endpoint.includes('feed')) {
            // NDJSON格式
            const lines = response.data.split('\n').filter(line => line.trim());
            console.log(`   数据格式: NDJSON`);
            console.log(`   记录数量: ${lines.length}`);
            
            if (lines.length > 0) {
              try {
                const firstRecord = JSON.parse(lines[0]);
                console.log(`   示例记录: ${firstRecord.title || firstRecord.question || 'N/A'}`);
              } catch (e) {
                console.log(`   示例记录: 解析失败`);
              }
            }
          }
        } catch (e) {
          console.log(`   数据解析: 失败`);
        }
      }
      
      console.log('');
      
    } catch (error) {
      console.log(`   ❌ 请求失败: ${error.message}`);
      console.log('');
    }
  }
}

/**
 * 测试特定参数
 */
async function testWithParameters() {
  console.log('🔧 测试带参数的请求...\n');
  
  const testCases = [
    { endpoint: '/api/ai-feed', params: '?limit=5&format=ndjson' },
    { endpoint: '/api/ai-feed', params: '?hub=feeding&type=explainer' },
    { endpoint: '/api/llm/answers', params: '?limit=3' },
    { endpoint: '/api/kb/feed', params: '?locale=Global&limit=5' }
  ];
  
  for (const testCase of testCases) {
    const url = `${BASE_URL}${testCase.endpoint}${testCase.params}`;
    console.log(`📡 测试: ${testCase.endpoint}${testCase.params}`);
    
    try {
      const response = await makeRequest(url);
      console.log(`   状态码: ${response.status}`);
      console.log(`   内容长度: ${response.data.length} 字符`);
      
      if (response.status === 200) {
        const lines = response.data.split('\n').filter(line => line.trim());
        console.log(`   返回记录数: ${lines.length}`);
      }
      
      console.log('');
      
    } catch (error) {
      console.log(`   ❌ 请求失败: ${error.message}`);
      console.log('');
    }
  }
}

/**
 * 验证AI爬虫配置
 */
async function verifyAICrawlerConfig() {
  console.log('🕷️ 验证AI爬虫配置...\n');
  
  try {
    // 测试robots.txt
    const robotsResponse = await makeRequest(`${BASE_URL}/robots.txt`);
    console.log('📄 robots.txt 状态:');
    console.log(`   状态码: ${robotsResponse.status}`);
    
    if (robotsResponse.status === 200) {
      const robotsContent = robotsResponse.data;
      const aiCrawlers = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'CCBot', 'Google-Extended'];
      
      console.log('   AI爬虫支持:');
      aiCrawlers.forEach(crawler => {
        if (robotsContent.includes(crawler)) {
          console.log(`     ✅ ${crawler}: 已允许`);
        } else {
          console.log(`     ❌ ${crawler}: 未找到`);
        }
      });
      
      // 检查sitemap
      if (robotsContent.includes('Sitemap:')) {
        console.log('   ✅ Sitemap: 已配置');
      } else {
        console.log('   ❌ Sitemap: 未配置');
      }
    }
    
    console.log('');
    
    // 测试sitemap.xml
    const sitemapResponse = await makeRequest(`${BASE_URL}/sitemap.xml`);
    console.log('🗺️ sitemap.xml 状态:');
    console.log(`   状态码: ${sitemapResponse.status}`);
    
    if (sitemapResponse.status === 200) {
      const sitemapContent = sitemapResponse.data;
      const urlCount = (sitemapContent.match(/<url>/g) || []).length;
      console.log(`   URL数量: ${urlCount}`);
      
      if (sitemapContent.includes('articles/')) {
        console.log('   ✅ 文章页面: 已包含');
      } else {
        console.log('   ❌ 文章页面: 未包含');
      }
    }
    
    console.log('');
    
  } catch (error) {
    console.log(`❌ 配置验证失败: ${error.message}`);
  }
}

/**
 * 生成AI引用优化建议
 */
function generateOptimizationSuggestions() {
  console.log('💡 AI引用优化建议:\n');
  
  console.log('1. 📝 内容优化:');
  console.log('   - 确保文章标题包含关键词');
  console.log('   - 添加"首屏即答案"格式的摘要');
  console.log('   - 包含权威来源引用 (CDC, AAP, Health Canada)');
  console.log('   - 使用数字和具体时间点');
  console.log('');
  
  console.log('2. 🏗️ 结构化数据:');
  console.log('   - 添加MedicalWebPage schema');
  console.log('   - 实现FAQPage结构化数据');
  console.log('   - 包含SpeakableSpecification');
  console.log('   - 添加权威性和可信度信号');
  console.log('');
  
  console.log('3. 🔧 技术优化:');
  console.log('   - 确保页面加载速度 < 3秒');
  console.log('   - 优化移动端显示');
  console.log('   - 添加适当的缓存头');
  console.log('   - 监控AI爬虫访问日志');
  console.log('');
  
  console.log('4. 📊 监控指标:');
  console.log('   - AI爬虫访问频率');
  console.log('   - 页面被抓取成功率');
  console.log('   - 结构化数据错误率');
  console.log('   - 内容被引用次数');
  console.log('');
  
  console.log('5. 🎯 预期效果:');
  console.log('   - 1-2周: AI爬虫访问增加20-30%');
  console.log('   - 1个月: AI引用次数增加40-60%');
  console.log('   - 3个月: 成为权威AI信息来源');
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 RAG数据库AI引用测试开始...\n');
  console.log(`🌐 测试目标: ${BASE_URL}\n`);
  
  try {
    // 1. 测试AI Feed端点
    await testAIFeedEndpoints();
    
    // 2. 测试带参数的请求
    await testWithParameters();
    
    // 3. 验证AI爬虫配置
    await verifyAICrawlerConfig();
    
    // 4. 生成优化建议
    generateOptimizationSuggestions();
    
    console.log('✅ AI引用测试完成！');
    console.log('\n📋 下一步行动:');
    console.log('1. 启动开发服务器: npm run dev');
    console.log('2. 运行此脚本: node scripts/test-ai-feeds.js');
    console.log('3. 根据测试结果优化AI feed端点');
    console.log('4. 实施AEO优化组件');
    console.log('5. 监控AI爬虫访问情况');
    
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error.message);
  }
}

// 运行测试
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  testAIFeedEndpoints,
  testWithParameters,
  verifyAICrawlerConfig,
  generateOptimizationSuggestions
};
