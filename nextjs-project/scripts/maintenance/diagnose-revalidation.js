#!/usr/bin/env node

/**
 * 诊断 Revalidation 问题
 * 
 * 这个脚本会：
 * 1. 检查环境变量配置
 * 2. 测试 Revalidation API
 * 3. 检查数据库中的文章
 * 4. 验证页面是否更新
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const https = require('https');

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.momaiagent.com';
const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET;

async function checkEnvironment() {
  console.log('🔍 检查环境配置...\n');
  
  const required = {
    'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
    'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
  
  const optional = {
    'REVALIDATION_SECRET': REVALIDATION_SECRET,
  };
  
  console.log('必需的环境变量:');
  let allRequired = true;
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
      console.log(`   ✅ ${key}: 已设置`);
    } else {
      console.log(`   ⚠️  ${key}: 未设置`);
    }
  }
  
  return allRequired;
}

async function testRevalidationAPI() {
  if (!REVALIDATION_SECRET) {
    console.log('\n⚠️  跳过 Revalidation API 测试（未设置 REVALIDATION_SECRET）');
    return false;
  }
  
  console.log('\n🧪 测试 Revalidation API...\n');
  
  return new Promise((resolve) => {
    const url = new URL(`${SITE_URL}/api/revalidate`);
    const postData = JSON.stringify({ path: '/insight' });
    
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REVALIDATION_SECRET}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 10000
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
            console.log('\n   ✅ Revalidation API 调用成功');
            console.log(`   ✅ 已重新验证路径: ${response.revalidated?.paths?.join(', ') || 'N/A'}`);
            resolve(true);
          } else {
            console.log('\n   ❌ Revalidation API 调用失败');
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
    
    req.on('timeout', () => {
      console.log('   ❌ 请求超时');
      req.destroy();
      resolve(false);
    });
    
    req.write(postData);
    req.end();
  });
}

async function checkDatabaseArticles() {
  console.log('\n📊 检查数据库中的文章...\n');
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('   ⚠️  缺少 Supabase 环境变量，跳过此检查');
    return false;
  }
  
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    const { data: articles, error } = await supabase
      .from('articles')
      .select('id, title, slug, created_at, reviewed_by, status')
      .eq('reviewed_by', 'AI Content Generator')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) {
      console.log(`   ❌ 查询错误: ${error.message}`);
      return false;
    }
    
    console.log(`   ✅ 找到 ${articles?.length || 0} 篇符合条件的文章\n`);
    
    // 检查新文章
    const newSlugs = [
      'does-my-baby-need-vitamin-d-supplements',
      'what-are-the-nutritional-needs-for-newborns-using-baby-formula',
      'what-should-i-know-about-caring-for-a-newborn-baby'
    ];
    
    console.log('   新文章状态:');
    newSlugs.forEach(slug => {
      const article = articles?.find(a => a.slug === slug);
      if (article) {
        const date = new Date(article.created_at).toLocaleString('zh-CN');
        console.log(`   ✅ ${article.title}`);
        console.log(`      创建时间: ${date}`);
        console.log(`      状态: ${article.status}`);
        console.log(`      Reviewed By: ${article.reviewed_by}`);
      } else {
        console.log(`   ❌ ${slug}: 未找到`);
      }
    });
    
    return true;
  } catch (error) {
    console.log(`   ❌ 检查失败: ${error.message}`);
    return false;
  }
}

async function checkPageContent() {
  console.log('\n🌐 检查页面内容...\n');
  
  return new Promise((resolve) => {
    const url = new URL(`${SITE_URL}/insight`);
    
    const req = https.request(url, { method: 'GET', timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode !== 200) {
          console.log(`   ❌ 页面返回异常状态码: ${res.statusCode}`);
          resolve(false);
          return;
        }
        
        // 检查新文章的 slug 是否在页面中
        const newSlugs = [
          'does-my-baby-need-vitamin-d-supplements',
          'what-are-the-nutritional-needs-for-newborns-using-baby-formula',
          'what-should-i-know-about-caring-for-a-newborn-baby'
        ];
        
        const found = newSlugs.filter(slug => data.includes(slug));
        
        console.log(`   ✅ 页面可访问 (HTTP ${res.statusCode})`);
        console.log(`   ℹ️  在页面中找到 ${found.length}/${newSlugs.length} 篇新文章`);
        
        if (found.length === newSlugs.length) {
          console.log('   ✅ 所有新文章都已显示在页面上');
          resolve(true);
        } else {
          console.log('   ⚠️  部分新文章未显示在页面上');
          console.log(`   未找到的文章: ${newSlugs.filter(s => !found.includes(s)).join(', ')}`);
          resolve(false);
        }
      });
    });
    
    req.on('error', (err) => {
      console.log(`   ❌ 请求失败: ${err.message}`);
      resolve(false);
    });
    
    req.on('timeout', () => {
      console.log('   ❌ 请求超时');
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

async function main() {
  console.log('🚀 开始诊断 Revalidation 问题\n');
  console.log('='.repeat(60));
  
  const results = {
    environment: false,
    revalidation: false,
    database: false,
    page: false
  };
  
  // 1. 检查环境
  results.environment = await checkEnvironment();
  
  if (!results.environment) {
    console.log('\n❌ 环境配置不完整，无法继续诊断');
    return;
  }
  
  // 2. 测试 Revalidation API
  results.revalidation = await testRevalidationAPI();
  
  // 3. 检查数据库
  results.database = await checkDatabaseArticles();
  
  // 4. 检查页面内容
  results.page = await checkPageContent();
  
  // 总结
  console.log('\n' + '='.repeat(60));
  console.log('📊 诊断结果总结\n');
  console.log(`   环境配置:         ${results.environment ? '✅' : '❌'}`);
  console.log(`   Revalidation API: ${results.revalidation ? '✅' : '⚠️'}`);
  console.log(`   数据库查询:       ${results.database ? '✅' : '❌'}`);
  console.log(`   页面内容:         ${results.page ? '✅' : '⚠️'}`);
  
  console.log('\n💡 建议:');
  if (!results.revalidation && !REVALIDATION_SECRET) {
    console.log('   1. 设置 REVALIDATION_SECRET 环境变量');
    console.log('   2. 在 Vercel 和 GitHub Secrets 中配置相同的密钥');
  }
  
  if (results.database && !results.page) {
    console.log('   1. Revalidation 可能需要一些时间才能生效');
    console.log('   2. 等待 5 分钟后再次检查页面');
    console.log('   3. 或者手动触发一次 Vercel 重新部署');
  }
  
  if (results.revalidation && results.database && !results.page) {
    console.log('   ⚠️  Revalidation API 调用成功，但页面尚未更新');
    console.log('   这可能是因为：');
    console.log('   - Vercel 的缓存需要时间清除');
    console.log('   - 需要等待下一次请求触发重新生成');
    console.log('   - 建议等待 1-2 分钟后再次检查');
  }
  
  console.log('\n' + '='.repeat(60));
}

main().catch(console.error);
