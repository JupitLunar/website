#!/usr/bin/env node

/**
 * 更新现有文章的article_source字段
 * 将reviewed_by为'AI Content Generator'的文章标记为ai_generated
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少Supabase环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateArticles() {
  console.log('🔄 开始更新现有文章的article_source字段...\n');

  try {
    // 先检查字段是否存在
    const { data: checkData, error: checkError } = await supabase
      .from('articles')
      .select('id, reviewed_by')
      .limit(1);

    if (checkError && checkError.code === '42703') {
      console.log('⚠️  article_source字段不存在，请先运行数据库迁移：');
      console.log('   supabase/migrations/add_article_source.sql\n');
      return;
    }

    // 查找reviewed_by为'AI Content Generator'的文章
    const { data: aiArticles, error: fetchError } = await supabase
      .from('articles')
      .select('id, title, reviewed_by, article_source')
      .eq('reviewed_by', 'AI Content Generator');

    if (fetchError) {
      throw fetchError;
    }

    if (!aiArticles || aiArticles.length === 0) {
      console.log('✅ 没有找到需要更新的文章');
      return;
    }

    console.log(`📋 找到 ${aiArticles.length} 篇AI生成的文章\n`);

    // 更新这些文章
    const { data: updated, error: updateError } = await supabase
      .from('articles')
      .update({ article_source: 'ai_generated' })
      .eq('reviewed_by', 'AI Content Generator')
      .select('id, title');

    if (updateError) {
      throw updateError;
    }

    console.log(`✅ 成功更新 ${updated?.length || 0} 篇文章\n`);
    console.log('更新的文章：');
    updated?.forEach((article, idx) => {
      console.log(`  ${idx + 1}. ${article.title}`);
    });

    // 确保其他文章都是authoritative
    const { data: otherUpdated, error: otherError } = await supabase
      .from('articles')
      .update({ article_source: 'authoritative' })
      .neq('reviewed_by', 'AI Content Generator')
      .is('article_source', null)
      .select('id');

    if (otherError) {
      console.warn('⚠️  更新其他文章时出错:', otherError.message);
    } else {
      console.log(`\n✅ 已将其他文章标记为authoritative (${otherUpdated?.length || 0} 篇)`);
    }

    console.log('\n✅ 更新完成！');

  } catch (error) {
    console.error('❌ 更新失败:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  updateArticles();
}

module.exports = { updateArticles };
