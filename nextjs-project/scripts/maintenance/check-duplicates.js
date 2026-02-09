#!/usr/bin/env node

/**
 * 检查数据库中的重复文章
 * 通过 URL、标题 Slug、或相似标题查找重复
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

/**
 * 检查 URL 重复
 */
async function checkUrlDuplicates() {
  console.log('🔍 检查 URL 重复...\n');

  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, license, slug');

  if (error) {
    console.error('❌ 查询失败:', error.message);
    return;
  }

  // 提取所有 URL
  const urlMap = new Map();
  articles.forEach(article => {
    const urlMatch = article.license?.match(/URL:\s*(https?:\/\/[^\s|]+)/);
    if (urlMatch) {
      const url = urlMatch[1];
      if (!urlMap.has(url)) {
        urlMap.set(url, []);
      }
      urlMap.get(url).push(article);
    }
  });

  // 找出重复的 URL
  const duplicates = Array.from(urlMap.entries())
    .filter(([url, articles]) => articles.length > 1);

  if (duplicates.length === 0) {
    console.log('  ✅ 没有发现 URL 重复\n');
    return duplicates;
  }

  console.log(`  ⚠️  发现 ${duplicates.length} 个重复的 URL:\n`);

  duplicates.forEach(([url, articles]) => {
    console.log(`  📌 URL: ${url}`);
    console.log(`     重复次数: ${articles.length}`);
    articles.forEach((article, index) => {
      console.log(`     ${index + 1}. ID: ${article.id}`);
      console.log(`       标题: ${article.title}`);
      console.log(`       Slug: ${article.slug}\n`);
    });
  });

  return duplicates;
}

/**
 * 检查 Slug 重复
 */
async function checkSlugDuplicates() {
  console.log('🔍 检查 Slug 重复...\n');

  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, slug');

  if (error) {
    console.error('❌ 查询失败:', error.message);
    return;
  }

  const slugMap = new Map();
  articles.forEach(article => {
    if (!slugMap.has(article.slug)) {
      slugMap.set(article.slug, []);
    }
    slugMap.get(article.slug).push(article);
  });

  const duplicates = Array.from(slugMap.entries())
    .filter(([slug, articles]) => articles.length > 1);

  if (duplicates.length === 0) {
    console.log('  ✅ 没有发现 Slug 重复\n');
    return duplicates;
  }

  console.log(`  ⚠️  发现 ${duplicates.length} 个重复的 Slug:\n`);

  duplicates.forEach(([slug, articles]) => {
    console.log(`  📌 Slug: ${slug}`);
    console.log(`     重复次数: ${articles.length}`);
    articles.forEach((article, index) => {
      console.log(`     ${index + 1}. ID: ${article.id}`);
      console.log(`       标题: ${article.title}\n`);
    });
  });

  return duplicates;
}

/**
 * 检查相似标题
 */
async function checkSimilarTitles() {
  console.log('🔍 检查相似标题（Levenshtein 距离 < 5）...\n');

  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, slug');

  if (error) {
    console.error('❌ 查询失败:', error.message);
    return;
  }

  // 简单的相似度检查（标题长度差 < 5 且包含相同关键词）
  const similar = [];
  for (let i = 0; i < articles.length; i++) {
    for (let j = i + 1; j < articles.length; j++) {
      const title1 = articles[i].title.toLowerCase().trim();
      const title2 = articles[j].title.toLowerCase().trim();

      // 检查是否几乎相同（长度差 < 5）
      if (Math.abs(title1.length - title2.length) < 5) {
        // 检查是否包含相同的核心词
        const words1 = title1.split(/\s+/).filter(w => w.length > 3);
        const words2 = title2.split(/\s+/).filter(w => w.length > 3);
        const commonWords = words1.filter(w => words2.includes(w));

        if (commonWords.length >= Math.min(words1.length, words2.length) * 0.7) {
          similar.push([articles[i], articles[j]]);
        }
      }
    }
  }

  if (similar.length === 0) {
    console.log('  ✅ 没有发现相似标题\n');
    return similar;
  }

  console.log(`  ⚠️  发现 ${similar.length} 对相似标题:\n`);

  similar.slice(0, 10).forEach(([article1, article2], index) => {
    console.log(`  ${index + 1}. 文章 1: ${article1.title} (ID: ${article1.id})`);
    console.log(`     文章 2: ${article2.title} (ID: ${article2.id})\n`);
  });

  if (similar.length > 10) {
    console.log(`  ... 还有 ${similar.length - 10} 对未显示\n`);
  }

  return similar;
}

/**
 * 统计信息
 */
async function getStats() {
  const { count: totalCount } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true });

  const { count: publishedCount } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');

  const { count: draftCount } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'draft');

  return {
    total: totalCount || 0,
    published: publishedCount || 0,
    draft: draftCount || 0
  };
}

async function main() {
  console.log('🔍 检查数据库中的重复文章\n');
  console.log('='.repeat(70));

  const stats = await getStats();
  console.log('📊 文章统计:');
  console.log(`  总文章数: ${stats.total}`);
  console.log(`  已发布: ${stats.published}`);
  console.log(`  草稿: ${stats.draft}\n`);

  console.log('='.repeat(70));

  // 检查 URL 重复
  const urlDuplicates = await checkUrlDuplicates();

  console.log('='.repeat(70));

  // 检查 Slug 重复
  const slugDuplicates = await checkSlugDuplicates();

  console.log('='.repeat(70));

  // 检查相似标题
  const similarTitles = await checkSimilarTitles();

  // 总结
  console.log('='.repeat(70));
  console.log('📊 重复检查总结\n');
  console.log(`  URL 重复: ${urlDuplicates?.length || 0} 个`);
  console.log(`  Slug 重复: ${slugDuplicates?.length || 0} 个`);
  console.log(`  相似标题: ${similarTitles?.length || 0} 对\n`);

  if (urlDuplicates?.length > 0 || slugDuplicates?.length > 0) {
    console.log('⚠️  发现重复！建议清理重复的文章。\n');
  } else {
    console.log('✅ 未发现重复问题\n');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { checkUrlDuplicates, checkSlugDuplicates, checkSimilarTitles };
