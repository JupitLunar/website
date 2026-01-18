#!/usr/bin/env node

/**
 * 检查GitHub Actions workflow运行状态和日志
 * 需要GITHUB_TOKEN环境变量
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');
// Load env vars from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少Supabase环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkArticles() {
  console.log('📊 检查数据库中的文章...\n');

  try {
    // 总文章数
    const { count: totalCount } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true });

    // AI生成的文章（通过reviewed_by判断）
    const { count: aiCount } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('reviewed_by', 'AI Content Generator');

    // 已发布的AI文章
    const { count: publishedAiCount } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('reviewed_by', 'AI Content Generator')
      .eq('status', 'published');

    console.log('📈 文章统计:');
    console.log(`   总文章数: ${totalCount || 0}`);
    console.log(`   AI生成文章: ${aiCount || 0}`);
    console.log(`   已发布AI文章: ${publishedAiCount || 0}\n`);

    // 最新的AI生成文章（通过reviewed_by判断）
    const { data: latestArticles, error } = await supabase
      .from('articles')
      .select('id, title, slug, hub, status, created_at, reviewed_by')
      .eq('reviewed_by', 'AI Content Generator')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('❌ 查询失败:', error.message);
      return;
    }

    if (!latestArticles || latestArticles.length === 0) {
      console.log('⚠️  数据库中没有AI生成的文章');
      console.log('\n可能的原因:');
      console.log('   1. Workflow还没有成功生成文章');
      console.log('   2. 所有主题都已存在（去重检查）');
      console.log('   3. 生成过程中出现错误');
      console.log('\n建议:');
      console.log('   - 查看GitHub Actions的"Generate articles"步骤日志');
      console.log('   - 检查"Get statistics"步骤的输出');
      return;
    }

    console.log(`\n💡 最新${latestArticles.length}篇AI生成的文章:\n`);
    latestArticles.forEach((article, i) => {
      const statusIcon = article.status === 'published' ? '✅' : '📝';
      const date = article.created_at ? new Date(article.created_at).toLocaleString() : 'N/A';
      console.log(`   ${i + 1}. ${statusIcon} [${article.hub}] ${article.title}`);
      console.log(`      Slug: ${article.slug}`);
      console.log(`      Status: ${article.status}`);
      console.log(`      Reviewed by: ${article.reviewed_by || 'N/A'}`);
      console.log(`      Created: ${date}`);
      console.log(`      URL: /insight/${article.slug}`);
      console.log('');
    });

    // 检查已发布但不在insight页面的文章
    const publishedArticles = latestArticles.filter(a => a.status === 'published');
    if (publishedArticles.length > 0) {
      console.log('✅ 这些文章应该显示在 /insight 页面\n');
    }

  } catch (error) {
    console.error('❌ 检查失败:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  checkArticles();
}

module.exports = { checkArticles };
