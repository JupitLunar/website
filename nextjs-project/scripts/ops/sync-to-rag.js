#!/usr/bin/env node

/**
 * 将 articles 表中的文章同步到 RAG 数据库 (knowledge_chunks)
 * 步骤：
 * 1. 将新文章状态改为 published（可选，或直接同步 draft）
 * 2. 调用 populate_knowledge_chunks() RPC
 * 3. 生成向量嵌入
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
  console.error('❌ 缺少环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function publishNewArticles() {
  console.log('📝 发布新文章（将 status 改为 published）...\n');
  
  // 获取所有 draft 状态的文章
  const { data: drafts, error } = await supabase
    .from('articles')
    .select('id, title, status')
    .eq('status', 'draft');

  if (error) {
    console.error('❌ 查询失败:', error.message);
    return 0;
  }

  if (!drafts || drafts.length === 0) {
    console.log('  ✅ 没有待发布的文章\n');
    return 0;
  }

  console.log(`  发现 ${drafts.length} 篇草稿文章\n`);

  // 批量更新为 published
  const ids = drafts.map(a => a.id);
  const { error: updateError } = await supabase
    .from('articles')
    .update({ status: 'published' })
    .in('id', ids);

  if (updateError) {
    console.error('❌ 更新失败:', updateError.message);
    return 0;
  }

  console.log(`  ✅ 成功发布 ${drafts.length} 篇文章\n`);
  return drafts.length;
}

async function populateKnowledgeChunks() {
  console.log('🔄 同步文章到 knowledge_chunks 表...\n');

  try {
    const { data, error } = await supabase.rpc('populate_knowledge_chunks');

    if (error) {
      console.error('❌ RPC 调用失败:', error.message);
      console.log('\n💡 提示: 可能需要先运行数据库迁移');
      return 0;
    }

    console.log(`  ✅ 成功同步 ${data} 条记录到 knowledge_chunks\n`);
    return data;
  } catch (error) {
    console.error('❌ 错误:', error.message);
    return 0;
  }
}

async function getStats() {
  const { count: articleCount } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');

  const { count: chunkCount } = await supabase
    .from('knowledge_chunks')
    .select('*', { count: 'exact', head: true })
    .eq('source_type', 'article');

  const { count: embeddedCount } = await supabase
    .from('knowledge_chunks')
    .select('*', { count: 'exact', head: true })
    .eq('source_type', 'article')
    .not('embedding', 'is', null);

  return {
    publishedArticles: articleCount || 0,
    knowledgeChunks: chunkCount || 0,
    embeddedChunks: embeddedCount || 0
  };
}

async function main() {
  console.log('🔄 同步文章到 RAG 数据库\n');
  console.log('='.repeat(70));

  // 1. 发布新文章
  const publishedCount = await publishNewArticles();

  // 2. 同步到 knowledge_chunks
  const chunkCount = await populateKnowledgeChunks();

  // 3. 显示统计
  console.log('📊 当前统计\n');
  const stats = await getStats();
  console.log(`  已发布文章: ${stats.publishedArticles} 篇`);
  console.log(`  Knowledge Chunks: ${stats.knowledgeChunks} 条`);
  console.log(`  已生成嵌入: ${stats.embeddedChunks} 条\n`);

  if (stats.embeddedCount < stats.knowledgeChunks) {
    console.log('⚠️  注意: 部分 chunks 还未生成向量嵌入');
    console.log('   运行: node scripts/generate-embeddings.js\n');
  }

  console.log('✅ 完成！\n');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { publishNewArticles, populateKnowledgeChunks };


