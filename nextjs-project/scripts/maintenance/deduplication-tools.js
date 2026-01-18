#!/usr/bin/env node

/**
 * 去重工具 - 检测和移除重复文章
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
 * 方法1: 检查完全相同的URL
 */
async function findDuplicateURLs() {
  console.log('🔍 检查重复URL...\n');

  const { data: articles } = await supabase
    .from('articles')
    .select('id, license');

  const urlMap = {};
  const duplicates = [];

  articles.forEach(article => {
    // 从license中提取URL
    const urlMatch = article.license.match(/URL:\s*(https?:\/\/[^\s]+)/);
    if (urlMatch) {
      const url = urlMatch[1];
      if (urlMap[url]) {
        duplicates.push({
          url,
          ids: [urlMap[url], article.id]
        });
      } else {
        urlMap[url] = article.id;
      }
    }
  });

  console.log(`找到 ${duplicates.length} 个重复URL\n`);

  if (duplicates.length > 0) {
    console.log('重复的URL:');
    duplicates.forEach((dup, i) => {
      console.log(`  ${i + 1}. ${dup.url}`);
      console.log(`     IDs: ${dup.ids.join(', ')}`);
    });
  }

  return duplicates;
}

/**
 * 方法2: 检查重复的slug
 */
async function findDuplicateSlugs() {
  console.log('\n🔍 检查重复Slug...\n');

  const { data: articles, error } = await supabase
    .from('articles')
    .select('slug, id, title');

  if (error) {
    console.error('查询错误:', error);
    return [];
  }

  // 手动分组
  const slugMap = {};
  articles.forEach(article => {
    if (!slugMap[article.slug]) {
      slugMap[article.slug] = [];
    }
    slugMap[article.slug].push(article);
  });

  const duplicateSlugs = Object.entries(slugMap)
    .filter(([slug, articles]) => articles.length > 1);

  console.log(`找到 ${duplicateSlugs.length} 个重复slug\n`);

  if (duplicateSlugs.length > 0) {
    console.log('重复的slug:');
    duplicateSlugs.forEach(([slug, articles], i) => {
      console.log(`  ${i + 1}. ${slug}`);
      articles.forEach(a => {
        console.log(`     - ID: ${a.id}, Title: ${a.title.substring(0, 50)}`);
      });
    });
  }

  return duplicateSlugs;
}

/**
 * 方法3: 简单的文本相似度检测（Jaccard相似度）
 */
function calculateJaccardSimilarity(text1, text2) {
  // 将文本转换为单词集合
  const words1 = new Set(text1.toLowerCase().match(/\b\w+\b/g) || []);
  const words2 = new Set(text2.toLowerCase().match(/\b\w+\b/g) || []);

  // 计算交集和并集
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  // Jaccard相似度 = 交集/并集
  return intersection.size / union.size;
}

/**
 * 检查内容相似的文章
 */
async function findSimilarContent(similarityThreshold = 0.8) {
  console.log('\n🔍 检查相似内容...');
  console.log(`   相似度阈值: ${(similarityThreshold * 100).toFixed(0)}%\n`);

  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, body_md')
    .limit(200);  // 限制数量以避免性能问题

  console.log(`正在比较 ${articles.length} 篇文章...\n`);

  const similarPairs = [];

  for (let i = 0; i < articles.length; i++) {
    for (let j = i + 1; j < articles.length; j++) {
      const similarity = calculateJaccardSimilarity(
        articles[i].body_md,
        articles[j].body_md
      );

      if (similarity >= similarityThreshold) {
        similarPairs.push({
          article1: { id: articles[i].id, title: articles[i].title },
          article2: { id: articles[j].id, title: articles[j].title },
          similarity: (similarity * 100).toFixed(1)
        });
      }
    }
  }

  console.log(`找到 ${similarPairs.length} 对相似文章\n`);

  if (similarPairs.length > 0) {
    console.log('相似的文章:');
    similarPairs.forEach((pair, i) => {
      console.log(`  ${i + 1}. 相似度: ${pair.similarity}%`);
      console.log(`     文章1: ${pair.article1.title.substring(0, 50)}`);
      console.log(`     文章2: ${pair.article2.title.substring(0, 50)}`);
      console.log(`     IDs: ${pair.article1.id} vs ${pair.article2.id}`);
    });
  }

  return similarPairs;
}

/**
 * 删除重复文章（保留最早的）
 */
async function removeDuplicates(duplicateIds, keepFirst = true) {
  if (duplicateIds.length === 0) {
    console.log('没有需要删除的文章');
    return;
  }

  console.log(`\n准备删除 ${duplicateIds.length - 1} 篇重复文章...`);

  // 保留第一篇或最后一篇
  const idsToDelete = keepFirst
    ? duplicateIds.slice(1)
    : duplicateIds.slice(0, -1);

  console.log(`保留ID: ${keepFirst ? duplicateIds[0] : duplicateIds[duplicateIds.length - 1]}`);
  console.log(`删除IDs: ${idsToDelete.join(', ')}\n`);

  // 确认
  console.log('⚠️  这将永久删除这些文章！');
  console.log('   如需确认删除，请手动运行SQL:\n');
  console.log(`   DELETE FROM articles WHERE id IN ('${idsToDelete.join("', '")}');\n`);

  // 注意：这里不自动删除，需要手动确认
  return idsToDelete;
}

/**
 * 清理数据库中的重复项
 */
async function cleanupDatabase(options = {}) {
  const {
    checkURLs = true,
    checkSlugs = true,
    checkContent = true,
    contentSimilarityThreshold = 0.8,
    autoDelete = false  // 默认不自动删除，需要手动确认
  } = options;

  console.log('🧹 开始数据库去重检查\n');
  console.log('='.repeat(70) + '\n');

  const results = {
    duplicateURLs: [],
    duplicateSlugs: [],
    similarContent: []
  };

  // 1. 检查URL重复
  if (checkURLs) {
    results.duplicateURLs = await findDuplicateURLs();
  }

  // 2. 检查Slug重复
  if (checkSlugs) {
    results.duplicateSlugs = await findDuplicateSlugs();
  }

  // 3. 检查内容相似
  if (checkContent) {
    results.similarContent = await findSimilarContent(contentSimilarityThreshold);
  }

  // 总结
  console.log('\n' + '='.repeat(70));
  console.log('📊 去重检查总结');
  console.log('='.repeat(70));
  console.log(`重复URL: ${results.duplicateURLs.length} 个`);
  console.log(`重复Slug: ${results.duplicateSlugs.length} 个`);
  console.log(`相似内容: ${results.similarContent.length} 对`);

  const totalIssues = results.duplicateURLs.length +
                     results.duplicateSlugs.length +
                     results.similarContent.length;

  if (totalIssues === 0) {
    console.log('\n✅ 数据库很干净，没有发现重复内容！\n');
  } else {
    console.log(`\n⚠️  发现 ${totalIssues} 个潜在的重复问题`);
    console.log('   建议手动审核后再删除\n');

    // 生成清理SQL
    console.log('建议的清理步骤:');
    console.log('1. 审核上述重复内容');
    console.log('2. 手动运行SQL删除不需要的文章');
    console.log('3. 或使用: node scripts/deduplication-tools.js --auto-delete\n');
  }

  return results;
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
去重工具使用说明:

node scripts/deduplication-tools.js [选项]

选项:
  --check-urls          只检查URL重复
  --check-slugs         只检查Slug重复
  --check-content       只检查内容相似度
  --similarity=0.8      设置相似度阈值（0-1）
  --auto-delete         自动删除重复项（危险！）
  --help, -h            显示此帮助信息

示例:
  # 完整检查
  node scripts/deduplication-tools.js

  # 只检查内容相似度
  node scripts/deduplication-tools.js --check-content --similarity=0.9

  # 检查并列出重复URL
  node scripts/deduplication-tools.js --check-urls
`);
    return;
  }

  const options = {
    checkURLs: args.includes('--check-urls') || !args.some(a => a.startsWith('--check-')),
    checkSlugs: args.includes('--check-slugs') || !args.some(a => a.startsWith('--check-')),
    checkContent: args.includes('--check-content') || !args.some(a => a.startsWith('--check-')),
    contentSimilarityThreshold: 0.8,
    autoDelete: args.includes('--auto-delete')
  };

  // 解析相似度阈值
  const similarityArg = args.find(a => a.startsWith('--similarity='));
  if (similarityArg) {
    options.contentSimilarityThreshold = parseFloat(similarityArg.split('=')[1]);
  }

  await cleanupDatabase(options);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  findDuplicateURLs,
  findDuplicateSlugs,
  findSimilarContent,
  cleanupDatabase
};
