#!/usr/bin/env node

/**
 * 检查数据库中的文章
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkDatabase() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   数据库内容检查                       ║');
  console.log('╚════════════════════════════════════════╝\n');
  
  // 1. 检查文章数量
  const { data: articles, error: articlesError } = await supabase
    .from('articles')
    .select('id, slug, title, type, hub, status, created_at')
    .order('created_at', { ascending: false });
  
  if (articlesError) {
    console.error('❌ 查询文章失败:', articlesError);
    return;
  }
  
  console.log(`📊 文章总数: ${articles.length}\n`);
  
  if (articles.length > 0) {
    console.log('📝 文章列表:\n');
    articles.forEach((article, i) => {
      console.log(`${i + 1}. ${article.title}`);
      console.log(`   Slug: ${article.slug}`);
      console.log(`   类型: ${article.type} | 分类: ${article.hub} | 状态: ${article.status}`);
      console.log(`   创建时间: ${new Date(article.created_at).toLocaleString()}`);
      console.log(`   ID: ${article.id}\n`);
    });
  }
  
  // 2. 检查来源
  const { data: sources, error: sourcesError } = await supabase
    .from('kb_sources')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (!sourcesError && sources) {
    console.log(`\n📚 来源总数: ${sources.length}\n`);
    
    if (sources.length > 0) {
      console.log('来源列表:\n');
      sources.forEach((source, i) => {
        console.log(`${i + 1}. ${source.name} (${source.organization})`);
        console.log(`   等级: ${source.grade} | URL: ${source.url}`);
        console.log(`   抓取时间: ${source.retrieved_at || 'N/A'}\n`);
      });
    }
  }
  
  // 3. 检查引用
  const { data: citations, error: citationsError } = await supabase
    .from('citations')
    .select('id, article_id, title, publisher, url')
    .order('created_at', { ascending: false });
  
  if (!citationsError && citations) {
    console.log(`\n🔗 引用总数: ${citations.length}\n`);
  }
  
  // 4. 按状态统计
  const statuses = {};
  articles.forEach(article => {
    statuses[article.status] = (statuses[article.status] || 0) + 1;
  });
  
  console.log('📈 文章状态统计:');
  Object.entries(statuses).forEach(([status, count]) => {
    console.log(`   ${status}: ${count}`);
  });
  
  console.log('\n✅ 检查完成！\n');
  
  console.log('💡 提示:');
  console.log('   - 所有新文章默认状态为 "draft"');
  console.log('   - 审核后在Supabase中将状态改为 "published"');
  console.log('   - 或运行SQL: UPDATE articles SET status = \'published\' WHERE status = \'draft\';\n');
}

checkDatabase().catch(console.error);

