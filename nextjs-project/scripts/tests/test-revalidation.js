#!/usr/bin/env node

/**
 * 测试 Revalidation API 和完整流程
 * 
 * 使用方法:
 * node scripts/test-revalidation.js
 * 
 * 需要环境变量:
 * - REVALIDATION_SECRET (可选，用于测试 API)
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */

const path = require('path');
const dotenv = require('dotenv');
// Load env vars from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });
const { createClient } = require('@supabase/supabase-js');
const https = require('https');

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.momaiagent.com';
const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET;

async function testRevalidationAPI() {
  console.log('\n🧪 测试 1: Revalidation API 端点\n');
  
  return new Promise((resolve) => {
    const url = new URL(`${SITE_URL}/api/revalidate`);
    
    const options = {
      method: 'GET',
      headers: {
        'User-Agent': 'Test-Script/1.0'
      }
    };
    
    if (REVALIDATION_SECRET) {
      options.headers['Authorization'] = `Bearer ${REVALIDATION_SECRET}`;
    }
    
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`   状态码: ${res.statusCode}`);
        console.log(`   响应: ${data}`);
        
        if (res.statusCode === 200) {
          console.log('   ✅ API 端点正常工作，认证成功');
          resolve(true);
        } else if (res.statusCode === 401) {
          if (REVALIDATION_SECRET) {
            console.log('   ⚠️  API 端点存在，但认证失败（请检查 REVALIDATION_SECRET）');
          } else {
            console.log('   ✅ API 端点存在（需要 REVALIDATION_SECRET 才能测试完整功能）');
          }
          resolve(true);
        } else {
          console.log('   ❌ API 端点可能有问题');
          resolve(false);
        }
      });
    });
    
    req.on('error', (err) => {
      console.log(`   ❌ 请求失败: ${err.message}`);
      resolve(false);
    });
    
    req.end();
  });
}

async function testRecentArticles() {
  console.log('\n🧪 测试 2: 检查最近生成的文章\n');
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('   ⚠️  缺少 Supabase 环境变量，跳过此测试');
    return false;
  }
  
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // 获取最近 5 篇 AI 生成的文章
    const { data: articles, error } = await supabase
      .from('articles')
      .select('id, title, slug, created_at, reviewed_by, status')
      .eq('reviewed_by', 'AI Content Generator')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) {
      console.log(`   ❌ 查询失败: ${error.message}`);
      return false;
    }
    
    if (!articles || articles.length === 0) {
      console.log('   ⚠️  没有找到 AI 生成的文章');
      return false;
    }
    
    console.log(`   ✅ 找到 ${articles.length} 篇最近的文章:`);
    articles.forEach((article, index) => {
      const date = new Date(article.created_at).toLocaleString('zh-CN');
      console.log(`      ${index + 1}. ${article.title}`);
      console.log(`         Slug: ${article.slug}`);
      console.log(`         创建时间: ${date}`);
      console.log(`         URL: ${SITE_URL}/insight/${article.slug}`);
    });
    
    // 检查是否有今天创建的文章
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayArticles = articles.filter(a => {
      const created = new Date(a.created_at);
      return created >= today;
    });
    
    if (todayArticles.length > 0) {
      console.log(`\n   ✅ 今天生成了 ${todayArticles.length} 篇新文章`);
    } else {
      console.log(`\n   ℹ️  今天还没有生成新文章`);
    }
    
    return true;
  } catch (error) {
    console.log(`   ❌ 测试失败: ${error.message}`);
    return false;
  }
}

async function testArticleAccessibility() {
  console.log('\n🧪 测试 3: 检查文章页面可访问性\n');
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('   ⚠️  缺少 Supabase 环境变量，跳过此测试');
    return false;
  }
  
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // 获取最新的一篇文章
    const { data: articles, error } = await supabase
      .from('articles')
      .select('slug, title')
      .eq('reviewed_by', 'AI Content Generator')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error || !articles || articles.length === 0) {
      console.log('   ⚠️  没有找到文章进行测试');
      return false;
    }
    
    const article = articles[0];
    const articleUrl = `${SITE_URL}/insight/${article.slug}`;
    
    console.log(`   测试文章: ${article.title}`);
    console.log(`   URL: ${articleUrl}`);
    
    return new Promise((resolve) => {
      const url = new URL(articleUrl);
      
      const req = https.request(url, { method: 'GET' }, (res) => {
        if (res.statusCode === 200) {
          console.log(`   ✅ 文章页面可访问 (HTTP ${res.statusCode})`);
          resolve(true);
        } else if (res.statusCode === 404) {
          console.log(`   ⚠️  文章页面不存在 (HTTP ${res.statusCode}) - 可能需要等待 ISR 更新`);
          resolve(false);
        } else {
          console.log(`   ⚠️  文章页面返回异常状态码 (HTTP ${res.statusCode})`);
          resolve(false);
        }
      });
      
      req.on('error', (err) => {
        console.log(`   ❌ 请求失败: ${err.message}`);
        resolve(false);
      });
      
      req.end();
    });
  } catch (error) {
    console.log(`   ❌ 测试失败: ${error.message}`);
    return false;
  }
}

async function testInsightListPage() {
  console.log('\n🧪 测试 4: 检查 Insight 列表页面\n');
  
  return new Promise((resolve) => {
    const url = new URL(`${SITE_URL}/insight`);
    
    const req = https.request(url, { method: 'GET' }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          // 检查页面内容中是否包含文章
          const hasArticles = data.includes('insight') || data.includes('article');
          console.log(`   ✅ 列表页面可访问 (HTTP ${res.statusCode})`);
          
          // 尝试提取文章数量
          const countMatch = data.match(/(\d+)\s+of\s+(\d+)\s+insights/);
          if (countMatch) {
            console.log(`   ℹ️  页面显示: ${countMatch[0]}`);
          }
          
          resolve(true);
        } else {
          console.log(`   ⚠️  列表页面返回异常状态码 (HTTP ${res.statusCode})`);
          resolve(false);
        }
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
  console.log('🚀 开始测试 Revalidation API 和完整流程\n');
  console.log('=' .repeat(60));
  
  const results = {
    api: false,
    articles: false,
    accessibility: false,
    listPage: false
  };
  
  // 测试 1: Revalidation API
  results.api = await testRevalidationAPI();
  
  // 测试 2: 检查最近的文章
  results.articles = await testRecentArticles();
  
  // 测试 3: 文章页面可访问性
  results.accessibility = await testArticleAccessibility();
  
  // 测试 4: Insight 列表页面
  results.listPage = await testInsightListPage();
  
  // 总结
  console.log('\n' + '='.repeat(60));
  console.log('📊 测试结果总结\n');
  console.log(`   Revalidation API:        ${results.api ? '✅' : '❌'}`);
  console.log(`   文章数据库查询:         ${results.articles ? '✅' : '❌'}`);
  console.log(`   文章页面可访问性:       ${results.accessibility ? '✅' : '⚠️'}`);
  console.log(`   Insight 列表页面:       ${results.listPage ? '✅' : '❌'}`);
  
  const allPassed = Object.values(results).every(r => r);
  
  if (allPassed) {
    console.log('\n✅ 所有测试通过！系统工作正常。');
  } else {
    console.log('\n⚠️  部分测试未通过，请检查上述结果。');
    console.log('\n💡 提示:');
    if (!results.api && !REVALIDATION_SECRET) {
      console.log('   - 设置 REVALIDATION_SECRET 环境变量以测试完整 API 功能');
    }
    if (!results.accessibility) {
      console.log('   - 新文章可能需要等待 ISR 更新（最多 5 分钟）');
    }
  }
  
  console.log('\n' + '='.repeat(60));
}

main().catch(console.error);
