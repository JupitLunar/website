#!/usr/bin/env node

/**
 * 使用提供的secret测试revalidation API
 * 
 * 使用方法:
 * node scripts/test-revalidation-with-secret.js [SITE_URL]
 * 
 * 如果不提供SITE_URL，默认使用 https://www.momaiagent.com
 */

const https = require('https');
const http = require('http');

const REVALIDATION_SECRET = '7kR3mP9vL2nQ6xW8zT5jH4yB1aF0gU3cE6dS9iO7pK2qY5wX8';
const SITE_URL = process.argv[2] || 'https://www.momaiagent.com';

console.log('🔄 测试 Revalidation API\n');
console.log(`📍 Site URL: ${SITE_URL}`);
console.log(`🔑 Using REVALIDATION_SECRET: ${REVALIDATION_SECRET.substring(0, 10)}...\n`);

const url = new URL(`${SITE_URL}/api/revalidate`);
const postData = JSON.stringify({ path: '/insight' });

const options = {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${REVALIDATION_SECRET}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  },
  timeout: 30000 // 30秒超时
};

const requestModule = url.protocol === 'https:' ? https : http;

const req = requestModule.request(url, options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`📥 HTTP Status: ${res.statusCode}`);
    console.log(`📥 Response Headers:`, res.headers);
    console.log('\n📥 Response Body:');
    
    try {
      const response = JSON.parse(data);
      console.log(JSON.stringify(response, null, 2));
      
      if (res.statusCode === 200 && response.success) {
        console.log('\n✅ Revalidation API 调用成功！');
        console.log(`✅ 已重新验证路径: ${response.revalidated?.paths?.join(', ') || 'N/A'}`);
        console.log('\n💡 现在访问 /insight 页面应该能看到最新的37篇文章了！');
      } else {
        console.log('\n❌ Revalidation API 调用失败');
        console.log(`   错误: ${response.error || response.message || 'Unknown error'}`);
      }
    } catch (e) {
      console.log(data);
      console.log('\n⚠️  响应不是有效的JSON格式');
    }
  });
});

req.on('error', (err) => {
  console.error('\n❌ 请求失败:', err.message);
  console.error('   请检查:');
  console.error('   - SITE_URL 是否正确');
  console.error('   - 网络连接是否正常');
  console.error('   - 网站是否正在运行');
});

req.on('timeout', () => {
  console.error('\n❌ 请求超时');
  req.destroy();
});

req.write(postData);
req.end();
