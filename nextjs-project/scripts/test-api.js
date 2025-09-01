#!/usr/bin/env node

const https = require('https');
const http = require('http');

console.log('🧪 Testing API Endpoints...\n');

const BASE_URL = 'http://localhost:3002';

// 测试函数
async function testEndpoint(path, expectedStatus = 200) {
  return new Promise((resolve) => {
    const url = `${BASE_URL}${path}`;
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const success = res.statusCode === expectedStatus;
        console.log(`   ${success ? '✅' : '❌'} ${path} - Status: ${res.statusCode}`);
        
        if (success) {
          console.log(`      Content-Type: ${res.headers['content-type']}`);
          if (data.length > 0) {
            console.log(`      Content Length: ${data.length} bytes`);
          }
        }
        
        resolve(success);
      });
    });
    
    req.on('error', (error) => {
      console.log(`   ❌ ${path} - Error: ${error.message}`);
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log(`   ⏰ ${path} - Timeout`);
      req.destroy();
      resolve(false);
    });
  });
}

// 测试sitemap
async function testSitemap() {
  console.log('1. Testing Sitemap...');
  const success = await testEndpoint('/sitemap.xml');
  console.log(`   📊 Sitemap test: ${success ? 'PASSED' : 'FAILED'}\n`);
  return success;
}

// 测试robots.txt
async function testRobotsTxt() {
  console.log('2. Testing Robots.txt...');
  const success = await testEndpoint('/robots.txt');
  console.log(`   📊 Robots.txt test: ${success ? 'PASSED' : 'FAILED'}\n`);
  return success;
}

// 测试AI feed
async function testAIFeed() {
  console.log('3. Testing AI Feed...');
  const success = await testEndpoint('/api/ai-feed');
  console.log(`   📊 AI Feed test: ${success ? 'PASSED' : 'FAILED'}\n`);
  return success;
}

// 测试LLM answers
async function testLLMAnswers() {
  console.log('4. Testing LLM Answers...');
  const success = await testEndpoint('/api/llm/answers');
  console.log(`   📊 LLM Answers test: ${success ? 'PASSED' : 'FAILED'}\n`);
  return success;
}

// 测试主页
async function testHomePage() {
  console.log('5. Testing Home Page...');
  const success = await testEndpoint('/');
  console.log(`   📊 Home page test: ${success ? 'PASSED' : 'FAILED'}\n`);
  return success;
}

// 测试404页面
async function test404Page() {
  console.log('6. Testing 404 Page...');
  const success = await testEndpoint('/non-existent-page', 404);
  console.log(`   📊 404 page test: ${success ? 'PASSED' : 'FAILED'}\n`);
  return success;
}

// 运行所有测试
async function runAllTests() {
  console.log('🚀 Starting API tests...\n');
  
  const tests = [
    testHomePage,
    testSitemap,
    testRobotsTxt,
    testAIFeed,
    testLLMAnswers,
    test404Page
  ];
  
  let passedTests = 0;
  const totalTests = tests.length;
  
  for (const test of tests) {
    if (await test()) {
      passedTests++;
    }
  }
  
  console.log('🎯 API Test Results Summary:');
  console.log(`   📊 Total tests: ${totalTests}`);
  console.log(`   ✅ Passed: ${passedTests}`);
  console.log(`   ❌ Failed: ${totalTests - passedTests}`);
  console.log(`   📈 Success rate: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All API tests passed!');
    console.log('   Your API endpoints are working correctly.');
  } else {
    console.log('\n⚠️  Some API tests failed.');
    console.log('   Make sure your development server is running on port 3002.');
  }
}

// 检查服务器是否运行
async function checkServer() {
  return new Promise((resolve) => {
    const req = http.get(`${BASE_URL}/`, (res) => {
      resolve(true);
    });
    
    req.on('error', () => {
      resolve(false);
    });
    
    req.setTimeout(3000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// 主函数
async function main() {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Development server is not running!');
    console.log('   Please start the server with: npm run dev');
    console.log('   Then run this test again.');
    process.exit(1);
  }
  
  await runAllTests();
}

// 执行测试
main().catch(console.error);
