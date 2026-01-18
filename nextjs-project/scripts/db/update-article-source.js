#!/usr/bin/env node

/**
 * 批量更新article_source字段
 * 将所有reviewed_by='AI Content Generator'的文章的article_source设置为'ai_generated'
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// 加载环境变量
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少Supabase环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateArticleSource() {
  console.log('🔄 开始更新article_source字段...\n');

  try {
    // 查找所有需要更新的文章
    const { data: articles, error: fetchError } = await supabase
      .from('articles')
      .select('id, title, slug, reviewed_by, article_source')
      .eq('reviewed_by', 'AI Content Generator');

    if (fetchError) {
      throw fetchError;
    }

    if (!articles || articles.length === 0) {
      console.log('✅ 没有需要更新的文章');
      return;
    }

    console.log(`📋 找到 ${articles.length} 篇文章需要更新\n`);

    // 批量更新
    const { data: updated, error: updateError } = await supabase
      .from('articles')
      .update({ article_source: 'ai_generated' })
      .eq('reviewed_by', 'AI Content Generator')
      .neq('article_source', 'ai_generated')
      .select('id, title, slug');

    if (updateError) {
      // 如果直接UPDATE失败（schema cache问题），尝试逐个更新
      console.log('⚠️  批量更新失败，尝试逐个更新...');
      console.log(`   错误: ${updateError.message}\n`);

      let successCount = 0;
      let failCount = 0;

      for (const article of articles) {
        try {
          // 尝试使用原始SQL（如果RPC可用）
          const { error: sqlError } = await supabase.rpc('exec_sql', {
            sql: `UPDATE articles SET article_source = 'ai_generated' WHERE id = '${article.id}'`
          }).catch(() => {
            // RPC不存在，跳过
            return { error: { message: 'RPC not available' } };
          });

          if (sqlError && !sqlError.message.includes('not available')) {
            console.log(`   ⚠️  无法更新: ${article.title.substring(0, 50)}...`);
            failCount++;
          } else {
            successCount++;
          }
        } catch (err) {
          failCount++;
        }
      }

      console.log(`\n📊 更新结果:`);
      console.log(`   ✅ 成功: ${successCount}`);
      console.log(`   ❌ 失败: ${failCount}`);
      console.log(`\n💡 提示: 如果更新失败，可以通过数据库直接执行以下SQL:`);
      console.log(`   UPDATE articles SET article_source = 'ai_generated' WHERE reviewed_by = 'AI Content Generator';`);
    } else {
      console.log(`✅ 成功更新 ${updated?.length || 0} 篇文章的article_source字段\n`);
      
      if (updated && updated.length > 0) {
        console.log('📝 更新的文章:');
        updated.forEach((article, index) => {
          console.log(`   ${index + 1}. ${article.title.substring(0, 60)}...`);
        });
      }
    }

    // 验证更新结果
    const { count: aiCount } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('reviewed_by', 'AI Content Generator')
      .eq('article_source', 'ai_generated');

    const { count: totalAiCount } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('reviewed_by', 'AI Content Generator');

    console.log(`\n📊 验证结果:`);
    console.log(`   总AI文章数: ${totalAiCount || 0}`);
    console.log(`   已设置article_source: ${aiCount || 0}`);

  } catch (error) {
    console.error('❌ 更新失败:', error.message);
    process.exit(1);
  }
}

updateArticleSource();
