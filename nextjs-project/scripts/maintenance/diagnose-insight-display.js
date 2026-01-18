#!/usr/bin/env node

/**
 * 诊断脚本：检查workflow后insight页面为什么不显示文章
 * 
 * 使用方法:
 * cd nextjs-project
 * node scripts/diagnose-insight-display.js
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// 加载环境变量
const dotenv = require('dotenv');
// Load env vars from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少Supabase环境变量');
  console.error('   请确保 .env.local 文件中包含:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAllArticles() {
  console.log('\n📊 1. 检查所有文章（不限制条件）\n');
  
  const { data: allArticles, error } = await supabase
    .from('articles')
    .select('id, slug, title, status, reviewed_by, created_at')
    .order('created_at', { ascending: false })
    .limit(20);
  
  if (error) {
    console.error('❌ 查询失败:', error.message);
    return null;
  }
  
  console.log(`   找到 ${allArticles?.length || 0} 篇文章（最近20篇）\n`);
  
  if (allArticles && allArticles.length > 0) {
    console.log('   最近的文章:');
    allArticles.slice(0, 10).forEach((article, i) => {
      const date = new Date(article.created_at).toLocaleString('zh-CN');
      console.log(`   ${i + 1}. ${article.title}`);
      console.log(`      状态: ${article.status}`);
      console.log(`      Reviewed By: ${article.reviewed_by || '(null)'}`);
      console.log(`      创建时间: ${date}`);
      console.log(`      Slug: ${article.slug}\n`);
    });
  }
  
  return allArticles;
}

async function checkInsightQuery() {
  console.log('\n🔍 2. 检查Insight页面查询条件\n');
  
  // 这是insight页面实际使用的查询
  const { data: insightArticles, error } = await supabase
    .from('articles')
    .select('id, slug, title, status, reviewed_by, created_at')
    .eq('reviewed_by', 'AI Content Generator')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(50);
  
  if (error) {
    console.error('❌ 查询失败:', error.message);
    return null;
  }
  
  console.log(`   ✅ 查询条件: reviewed_by = 'AI Content Generator' AND status = 'published'`);
  console.log(`   ✅ 找到 ${insightArticles?.length || 0} 篇符合条件的文章\n`);
  
  if (insightArticles && insightArticles.length > 0) {
    console.log('   符合Insight查询条件的文章（前10篇）:');
    insightArticles.slice(0, 10).forEach((article, i) => {
      const date = new Date(article.created_at).toLocaleString('zh-CN');
      console.log(`   ${i + 1}. ${article.title}`);
      console.log(`      创建时间: ${date}`);
      console.log(`      Slug: ${article.slug}\n`);
    });
  } else {
    console.log('   ⚠️  没有找到符合条件的文章！');
  }
  
  return insightArticles;
}

async function checkSpecificFields() {
  console.log('\n🔬 3. 检查字段值分布\n');
  
  // 检查status字段的分布
  const { data: statusCheck } = await supabase
    .from('articles')
    .select('status, reviewed_by')
    .limit(1000);
  
  if (statusCheck) {
    const statusCount = {};
    const reviewedByCount = {};
    const combinedCount = {};
    
    statusCheck.forEach(article => {
      statusCount[article.status] = (statusCount[article.status] || 0) + 1;
      reviewedByCount[article.reviewed_by] = (reviewedByCount[article.reviewed_by] || 0) + 1;
      
      const key = `${article.status}|${article.reviewed_by}`;
      combinedCount[key] = (combinedCount[key] || 0) + 1;
    });
    
    console.log('   Status字段分布:');
    Object.entries(statusCount).forEach(([status, count]) => {
      console.log(`      ${status}: ${count} 篇`);
    });
    
    console.log('\n   Reviewed_by字段分布:');
    Object.entries(reviewedByCount).forEach(([reviewedBy, count]) => {
      console.log(`      ${reviewedBy || '(null)'}: ${count} 篇`);
    });
    
    console.log('\n   Status + Reviewed_by组合:');
    Object.entries(combinedCount).forEach(([key, count]) => {
      const [status, reviewedBy] = key.split('|');
      console.log(`      status=${status}, reviewed_by=${reviewedBy || '(null)'}: ${count} 篇`);
    });
  }
  
  // 检查是否有AI生成但状态不是published的
  const { data: aiNotPublished } = await supabase
    .from('articles')
    .select('id, slug, title, status, reviewed_by')
    .eq('reviewed_by', 'AI Content Generator')
    .neq('status', 'published')
    .limit(20);
  
  if (aiNotPublished && aiNotPublished.length > 0) {
    console.log('\n   ⚠️  发现AI生成但状态不是published的文章:');
    aiNotPublished.forEach((article, i) => {
      console.log(`      ${i + 1}. ${article.title} (status: ${article.status})`);
    });
  }
  
  // 检查是否有published但reviewed_by不是AI Content Generator的
  const { data: publishedNotAI } = await supabase
    .from('articles')
    .select('id, slug, title, status, reviewed_by')
    .eq('status', 'published')
    .neq('reviewed_by', 'AI Content Generator')
    .limit(20);
  
  if (publishedNotAI && publishedNotAI.length > 0) {
    console.log('\n   ℹ️  Published但reviewed_by不是"AI Content Generator"的文章:');
    publishedNotAI.slice(0, 5).forEach((article, i) => {
      console.log(`      ${i + 1}. ${article.title} (reviewed_by: ${article.reviewed_by})`);
    });
    if (publishedNotAI.length > 5) {
      console.log(`      ... 还有 ${publishedNotAI.length - 5} 篇`);
    }
  }
}

async function checkRecentInserts() {
  console.log('\n🕐 4. 检查最近24小时插入的文章\n');
  
  const yesterday = new Date();
  yesterday.setHours(yesterday.getHours() - 24);
  
  const { data: recentArticles, error } = await supabase
    .from('articles')
    .select('id, slug, title, status, reviewed_by, created_at')
    .gte('created_at', yesterday.toISOString())
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('❌ 查询失败:', error.message);
    return null;
  }
  
  console.log(`   最近24小时插入了 ${recentArticles?.length || 0} 篇文章\n`);
  
  if (recentArticles && recentArticles.length > 0) {
    console.log('   最近插入的文章:');
    recentArticles.forEach((article, i) => {
      const date = new Date(article.created_at).toLocaleString('zh-CN');
      const matchesInsightQuery = 
        article.reviewed_by === 'AI Content Generator' && 
        article.status === 'published';
      
      console.log(`   ${i + 1}. ${article.title}`);
      console.log(`      状态: ${article.status} ${article.status === 'published' ? '✅' : '❌'}`);
      console.log(`      Reviewed By: ${article.reviewed_by || '(null)'} ${article.reviewed_by === 'AI Content Generator' ? '✅' : '❌'}`);
      console.log(`      创建时间: ${date}`);
      console.log(`      符合Insight查询: ${matchesInsightQuery ? '✅ 是' : '❌ 否'}`);
      console.log(`      Slug: ${article.slug}\n`);
    });
  } else {
    console.log('   ℹ️  最近24小时内没有插入新文章');
  }
  
  return recentArticles;
}

async function verifyExactQuery() {
  console.log('\n✅ 5. 验证精确查询（模拟Insight页面）\n');
  
  // 完全模拟insight页面的查询
  const { data: articles, error } = await supabase
    .from('articles')
    .select('*')
    .eq('reviewed_by', 'AI Content Generator')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(50);
  
  if (error) {
    console.error('❌ 查询失败:', error.message);
    console.error('   错误详情:', error);
    return false;
  }
  
  console.log(`   ✅ 查询成功！找到 ${articles?.length || 0} 篇文章\n`);
  
  if (articles && articles.length > 0) {
    console.log('   这些文章应该显示在Insight页面上:');
    articles.slice(0, 10).forEach((article, i) => {
      console.log(`   ${i + 1}. ${article.title} (${article.slug})`);
    });
    if (articles.length > 10) {
      console.log(`   ... 还有 ${articles.length - 10} 篇`);
    }
    return true;
  } else {
    console.log('   ⚠️  没有找到任何文章！');
    console.log('   这意味着Insight页面将显示"Insights are on the way"的消息');
    return false;
  }
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   Insight页面显示问题诊断工具                          ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  
  try {
    // 1. 检查所有文章
    const allArticles = await checkAllArticles();
    
    // 2. 检查Insight查询
    const insightArticles = await checkInsightQuery();
    
    // 3. 检查字段分布
    await checkSpecificFields();
    
    // 4. 检查最近插入的文章
    const recentArticles = await checkRecentInserts();
    
    // 5. 验证精确查询
    const querySuccess = await verifyExactQuery();
    
    // 总结
    console.log('\n' + '='.repeat(60));
    console.log('📋 诊断总结\n');
    
    if (querySuccess && insightArticles && insightArticles.length > 0) {
      console.log('✅ 数据库查询正常，找到了符合条件的文章');
      console.log('   如果网站仍然不显示，可能的原因:');
      console.log('   1. 页面缓存问题 - 等待最多5分钟让ISR自动更新');
      console.log('   2. Revalidation未触发 - 检查GitHub Actions日志');
      console.log('   3. Vercel部署问题 - 检查Vercel Dashboard');
      console.log('\n   建议操作:');
      console.log('   - 访问 /api/debug/insight-articles 查看API返回的数据');
      console.log('   - 检查GitHub Actions workflow的revalidation步骤是否成功');
      console.log('   - 等待5分钟后刷新页面');
    } else {
      console.log('❌ 数据库中没有找到符合条件的文章');
      console.log('   可能的原因:');
      console.log('   1. Workflow没有成功插入文章');
      console.log('   2. 插入的status字段不是"published"');
      console.log('   3. 插入的reviewed_by字段不是"AI Content Generator"');
      console.log('\n   建议操作:');
      console.log('   - 检查GitHub Actions workflow日志，确认文章是否成功插入');
      console.log('   - 运行: node scripts/check-workflow-status.js');
      console.log('   - 检查最近插入的文章字段值（见上面的输出）');
    }
    
    if (recentArticles && recentArticles.length > 0) {
      const mismatched = recentArticles.filter(a => 
        !(a.reviewed_by === 'AI Content Generator' && a.status === 'published')
      );
      if (mismatched.length > 0) {
        console.log('\n⚠️  发现最近插入的文章字段值不正确:');
        mismatched.forEach(a => {
          console.log(`   - ${a.title}`);
          console.log(`     status: ${a.status} (期望: published)`);
          console.log(`     reviewed_by: ${a.reviewed_by} (期望: AI Content Generator)`);
        });
        console.log('\n   建议: 检查workflow插入代码，确保字段值正确');
      }
    }
    
    console.log('\n' + '='.repeat(60));
    
  } catch (error) {
    console.error('\n❌ 诊断过程中出错:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
