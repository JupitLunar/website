/**
 * 测试 Cron Job API
 * 用于检查 cron job 是否正常工作
 */

// 加载环境变量
const path = require('path');
const dotenv = require('dotenv');
// Load env vars from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const https = require('https');

const API_URL = 'https://www.momaiagent.com/api/scraper/run';
const CRON_SECRET = process.env.CRON_SECRET || 'YOUR_CRON_SECRET_HERE';

console.log('🧪 测试 Cron Job API...\n');

// 方法 1: 获取配置信息（GET请求）
async function testGetConfig() {
  console.log('1️⃣ 测试获取配置信息 (GET /api/scraper/run)');
  
  const url = new URL(API_URL);
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CRON_SECRET}`,
        'Content-Type': 'application/json'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log(`   ✅ 状态码: ${res.statusCode}`);
          console.log(`   📊 数据源数量: ${result.data?.totalSources || 0}`);
          console.log(`   📄 目标页面数: ${result.data?.totalPages || 0}`);
          console.log(`   ⚡ 状态: ${result.data?.status || 'unknown'}\n`);
          resolve(result);
        } catch (error) {
          console.error('   ❌ 解析响应失败:', error.message);
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('   ❌ 请求失败:', error.message);
      reject(error);
    });
    
    req.end();
  });
}

// 方法 2: 触发爬虫任务（POST请求 - 测试模式）
async function testTriggerScraper() {
  console.log('2️⃣ 测试触发爬虫任务 (POST /api/scraper/run)');
  console.log('   ⚠️  这将执行实际的爬虫任务，可能需要几分钟...\n');
  
  const url = new URL(API_URL);
  const postData = JSON.stringify({
    testMode: true,
    sources: ['CDC'] // 只测试一个源
  });
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CRON_SECRET}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log(`   ✅ 状态码: ${res.statusCode}`);
          console.log(`   📊 结果:`);
          console.log(`      - 总数: ${result.data?.total || 0}`);
          console.log(`      - 成功: ${result.data?.successful || 0}`);
          console.log(`      - 失败: ${result.data?.failed || 0}`);
          console.log(`      - 跳过: ${result.data?.skipped || 0}`);
          console.log(`      - 时间: ${result.data?.timestamp || 'N/A'}\n`);
          resolve(result);
        } catch (error) {
          console.error('   ❌ 解析响应失败:', error.message);
          console.error('   原始响应:', data);
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('   ❌ 请求失败:', error.message);
      reject(error);
    });
    
    req.write(postData);
    req.end();
  });
}

// 主函数
async function main() {
  try {
    // 检查是否设置了 CRON_SECRET
    if (!process.env.CRON_SECRET) {
      console.warn('⚠️  警告: CRON_SECRET 环境变量未设置');
      console.warn('   请在项目根目录的 .env.local 文件中设置，或在命令行中传递：');
      console.warn('   CRON_SECRET=your_secret node scripts/test-cron.js\n');
    }
    
    // 测试 GET 请求
    await testGetConfig();
    
    // 询问是否测试 POST 请求（触发爬虫）
    console.log('3️⃣ 是否要测试触发爬虫任务？(这将执行实际爬虫)');
    console.log('   如需测试，请手动运行：');
    console.log('   curl -X POST https://www.momaiagent.com/api/scraper/run \\');
    console.log(`     -H "Authorization: Bearer ${CRON_SECRET.substring(0, 10)}..." \\`);
    console.log('     -H "Content-Type: application/json" \\');
    console.log('     -d \'{"testMode": true, "sources": ["CDC"]}\'\n');
    
    console.log('✅ 测试完成！');
    
  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = { testGetConfig, testTriggerScraper };

