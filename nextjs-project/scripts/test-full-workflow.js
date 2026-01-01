#!/usr/bin/env node

/**
 * 完整流程测试：模拟 GitHub Actions 的完整流程
 * 
 * 这个脚本会：
 * 1. 检查所有必需的环境变量
 * 2. 测试 Revalidation API（如果提供了 REVALIDATION_SECRET）
 * 3. 验证文章生成和显示流程
 * 
 * 使用方法:
 * REVALIDATION_SECRET=your_secret node scripts/test-full-workflow.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const https = require('https');

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.momaiagent.com';
const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET;

function checkEnvironmentVariables() {
  console.log('\n🔍 检查环境变量\n');
  
  const required = {
    'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
    'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
  
  const optional = {
    'REVALIDATION_SECRET': REVALIDATION_SECRET,
    'OPENAI_API_KEY': process.env.OPENAI_API_KEY,
  };
  
  let allRequired = true;
  
  console.log('必需的环境变量:');
  for (const [key, value] of Object.entries(required)) {
    if (value) {
      console.log(`   ✅ ${key}: 已设置`);
    } else {
      console.log(`   ❌ ${key}: 未设置`);
      allRequired = false;
    }
  }
  
  console.log('\n可选的环境变量:');
  for (const [key, value] of Object.entries(optional)) {
    if (value) {
      const masked = key.includes('SECRET') || key.includes('KEY') 
        ? `${value.substring(0, 8)}...` 
        : value;
      console.log(`   ✅ ${key}: ${masked}`);
    } else {
      console.log(`   ⚠️  ${key}: 未设置`);
    }
  }
  
  return allRequired;
}

async function testRevalidationWithSecret() {
  if (!REVALIDATION_SECRET) {
    console.log('\n⚠️  跳过 Revalidation API 测试（未设置 REVALIDATION_SECRET）');
    console.log('   提示: 设置 REVALIDATION_SECRET 环境变量以测试完整功能');
    return false;
  }
  
  console.log('\n🧪 测试 Revalidation API（使用 REVALIDATION_SECRET）\n');
  
  return new Promise((resolve) => {
    const url = new URL(`${SITE_URL}/api/revalidate`);
    
    const postData = JSON.stringify({ path: '/insight' });
    
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REVALIDATION_SECRET}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`   状态码: ${res.statusCode}`);
        
        try {
          const response = JSON.parse(data);
          console.log(`   响应:`, JSON.stringify(response, null, 2));
          
          if (res.statusCode === 200 && response.success) {
            console.log('\n   ✅ Revalidation API 测试成功！');
            console.log(`   ✅ 已重新验证路径: ${response.revalidated?.paths?.join(', ') || 'N/A'}`);
            resolve(true);
          } else {
            console.log('\n   ❌ Revalidation API 测试失败');
            if (res.statusCode === 401) {
              console.log('   ⚠️  认证失败 - 请检查 REVALIDATION_SECRET 是否正确');
            }
            resolve(false);
          }
        } catch (e) {
          console.log(`   响应数据: ${data}`);
          console.log('\n   ⚠️  无法解析响应');
          resolve(false);
        }
      });
    });
    
    req.on('error', (err) => {
      console.log(`   ❌ 请求失败: ${err.message}`);
      resolve(false);
    });
    
    req.write(postData);
    req.end();
  });
}

async function checkArticleCount() {
  console.log('\n📊 检查文章统计\n');
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('   ⚠️  缺少 Supabase 环境变量，跳过此测试');
    return false;
  }
  
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // 总文章数
    const { count: totalCount } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');
    
    // AI 生成的文章
    const { count: aiCount } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')
      .eq('reviewed_by', 'AI Content Generator');
    
    // 最近 24 小时的文章
    const yesterday = new Date();
    yesterday.setHours(yesterday.getHours() - 24);
    const { count: recentCount } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')
      .eq('reviewed_by', 'AI Content Generator')
      .gte('created_at', yesterday.toISOString());
    
    console.log(`   总发布文章数: ${totalCount || 0}`);
    console.log(`   AI 生成文章数: ${aiCount || 0}`);
    console.log(`   最近 24 小时: ${recentCount || 0} 篇`);
    
    return true;
  } catch (error) {
    console.log(`   ❌ 查询失败: ${error.message}`);
    return false;
  }
}

async function verifyInsightPageArticles() {
  console.log('\n🔍 验证 Insight 列表页面显示的文章\n');
  
  return new Promise((resolve) => {
    const url = new URL(`${SITE_URL}/insight`);
    
    const req = https.request(url, { method: 'GET' }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode !== 200) {
          console.log(`   ❌ 页面返回异常状态码: ${res.statusCode}`);
          resolve(false);
          return;
        }
        
        // 检查页面中是否包含我们测试的文章
        const testArticles = [
          'what-foods-are-high-in-iron-for-babies',
          'how-does-baby-formula-support-infant-nutrition',
          'what-are-newborn-baby-care-essentials'
        ];
        
        const foundArticles = testArticles.filter(slug => 
          data.includes(slug) || data.includes(slug.replace(/-/g, ' '))
        );
        
        console.log(`   ✅ 页面可访问`);
        console.log(`   ℹ️  在页面中找到 ${foundArticles.length}/${testArticles.length} 篇测试文章`);
        
        // 尝试提取文章数量
        const countMatch = data.match(/(\d+)\s+of\s+(\d+)\s+insights/i);
        if (countMatch) {
          const current = parseInt(countMatch[1]);
          const total = parseInt(countMatch[2]);
          console.log(`   ℹ️  页面显示: ${current} of ${total} insights`);
          
          if (current === total && total > 0) {
            console.log(`   ✅ 所有文章都已显示在列表中`);
          }
        }
        
        resolve(true);
      });
    });
    
    req.on('error', (err) => {
      console.log(`   ❌ 请求失败: ${err.message}`);
      resolve(false);
    });
    
    req.end();
  });
}

async function main() {
  console.log('🚀 完整流程测试');
  console.log('='.repeat(60));
  console.log('\n这个测试会验证：');
  console.log('1. 环境变量配置');
  console.log('2. Revalidation API 功能');
  console.log('3. 文章数据库状态');
  console.log('4. 页面可访问性');
  
  const results = {
    env: false,
    revalidation: false,
    articles: false,
    pages: false
  };
  
  // 1. 检查环境变量
  results.env = checkEnvironmentVariables();
  
  if (!results.env) {
    console.log('\n❌ 缺少必需的环境变量，无法继续测试');
    return;
  }
  
  // 2. 测试 Revalidation API
  results.revalidation = await testRevalidationWithSecret();
  
  // 3. 检查文章统计
  results.articles = await checkArticleCount();
  
  // 4. 验证页面
  results.pages = await verifyInsightPageArticles();
  
  // 总结
  console.log('\n' + '='.repeat(60));
  console.log('📊 完整流程测试结果\n');
  console.log(`   环境变量配置:         ${results.env ? '✅' : '❌'}`);
  console.log(`   Revalidation API:     ${results.revalidation ? '✅' : '⚠️'}`);
  console.log(`   文章数据库:           ${results.articles ? '✅' : '❌'}`);
  console.log(`   页面可访问性:         ${results.pages ? '✅' : '❌'}`);
  
  console.log('\n💡 下一步:');
  if (results.revalidation) {
    console.log('   ✅ Revalidation API 工作正常');
    console.log('   ✅ GitHub Actions 应该能够自动触发页面更新');
  } else {
    console.log('   ⚠️  Revalidation API 未测试或测试失败');
    console.log('   ℹ️  页面仍会在 5 分钟内通过 ISR 自动更新');
    console.log('   💡 设置 REVALIDATION_SECRET 以实现即时更新');
  }
  
  console.log('\n📝 GitHub Actions 验证:');
  console.log('   1. 前往 GitHub 仓库 → Actions');
  console.log('   2. 查看 "Auto Generate Articles" workflow 的最新运行');
  console.log('   3. 检查 "Trigger page revalidation" 步骤的输出');
  console.log('   4. 应该看到 "✅ Revalidation successful" 或相关消息');
  
  console.log('\n' + '='.repeat(60));
}

main().catch(console.error);
