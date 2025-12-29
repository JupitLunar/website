#!/usr/bin/env node

/**
 * 检查最近插入的文章
 * 查看 Playwright 爬虫刚刚插入的文章，检查是否有重复
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRecentInserts() {
  console.log('🔍 检查最近插入的文章（Playwright 爬虫）\n');
  console.log('='.repeat(70));

  // 查找最近由 Playwright Scraper Bot 创建的文章
  const { data: recentArticles, error } = await supabase
    .from('articles')
    .select('id, title, slug, license, created_at, reviewed_by')
    .eq('reviewed_by', 'Playwright Scraper Bot')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ 查询失败:', error.message);
    return;
  }

  if (!recentArticles || recentArticles.length === 0) {
    console.log('  ℹ️  没有找到由 Playwright Scraper Bot 创建的文章\n');
    return;
  }

  console.log(`📊 找到 ${recentArticles.length} 篇由 Playwright Scraper Bot 创建的文章\n`);

  // 按来源分组
  const bySource = {};
  recentArticles.forEach(article => {
    const sourceMatch = article.license?.match(/Source:\s*([^|]+)/);
    const source = sourceMatch ? sourceMatch[1].trim() : 'Unknown';
    
    if (!bySource[source]) {
      bySource[source] = [];
    }
    bySource[source].push(article);
  });

  console.log('📋 按来源分组:\n');
  Object.entries(bySource).forEach(([source, articles]) => {
    console.log(`  ${source}: ${articles.length} 篇`);
  });

  console.log('\n' + '='.repeat(70));
  console.log('🔍 详细检查每篇文章...\n');

  // 检查每篇文章是否有重复
  const duplicates = [];
  
  for (const article of recentArticles) {
    const urlMatch = article.license?.match(/URL:\s*(https?:\/\/[^\s|]+)/);
    if (!urlMatch) continue;

    const url = urlMatch[1];
    const slug = article.slug;

    // 查找相同 URL 的文章
    const { data: urlMatches } = await supabase
      .from('articles')
      .select('id, title, slug, created_at, reviewed_by')
      .ilike('license', `%${url}%`);

    // 查找相同 Slug 的文章
    const { data: slugMatches } = await supabase
      .from('articles')
      .select('id, title, slug, created_at, reviewed_by')
      .eq('slug', slug);

    if (urlMatches && urlMatches.length > 1) {
      duplicates.push({
        article,
        type: 'URL',
        matches: urlMatches.filter(a => a.id !== article.id)
      });
    } else if (slugMatches && slugMatches.length > 1) {
      duplicates.push({
        article,
        type: 'Slug',
        matches: slugMatches.filter(a => a.id !== article.id)
      });
    }
  }

  if (duplicates.length > 0) {
    console.log(`⚠️  发现 ${duplicates.length} 篇重复文章:\n`);
    
    duplicates.forEach((dup, index) => {
      console.log(`  ${index + 1}. ${dup.article.title}`);
      console.log(`     ID: ${dup.article.id}`);
      console.log(`     重复类型: ${dup.type}`);
      console.log(`     匹配到的文章:`);
      dup.matches.forEach(match => {
        console.log(`       - ID: ${match.id}`);
        console.log(`         标题: ${match.title}`);
        console.log(`         创建时间: ${match.created_at}`);
        console.log(`         审核人: ${match.reviewed_by || 'N/A'}`);
      });
      console.log('');
    });
  } else {
    console.log('✅ 没有发现重复文章\n');
  }

  // 显示所有最近插入的文章
  console.log('='.repeat(70));
  console.log('📋 所有最近插入的文章:\n');

  recentArticles.forEach((article, index) => {
    const urlMatch = article.license?.match(/URL:\s*(https?:\/\/[^\s|]+)/);
    const url = urlMatch ? urlMatch[1] : 'N/A';
    
    console.log(`${index + 1}. ${article.title}`);
    console.log(`   ID: ${article.id}`);
    console.log(`   Slug: ${article.slug}`);
    console.log(`   URL: ${url}`);
    console.log(`   创建时间: ${article.created_at}`);
    console.log('');
  });
}

async function checkNHSArticles() {
  console.log('\n' + '='.repeat(70));
  console.log('🔍 检查 NHS 文章...\n');

  const { data: nhsArticles, error } = await supabase
    .from('articles')
    .select('id, title, slug, license, created_at')
    .ilike('license', '%NHS%')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ 查询失败:', error.message);
    return;
  }

  if (!nhsArticles || nhsArticles.length === 0) {
    console.log('  ℹ️  没有找到 NHS 文章\n');
    return;
  }

  console.log(`📊 找到 ${nhsArticles.length} 篇 NHS 文章\n`);

  // 检查 URL 重复
  const urlMap = new Map();
  nhsArticles.forEach(article => {
    const urlMatch = article.license?.match(/URL:\s*(https?:\/\/[^\s|]+)/);
    if (urlMatch) {
      const url = urlMatch[1];
      if (!urlMap.has(url)) {
        urlMap.set(url, []);
      }
      urlMap.get(url).push(article);
    }
  });

  const urlDuplicates = Array.from(urlMap.entries())
    .filter(([url, articles]) => articles.length > 1);

  if (urlDuplicates.length > 0) {
    console.log(`⚠️  发现 ${urlDuplicates.length} 个重复的 NHS URL:\n`);
    urlDuplicates.forEach(([url, articles]) => {
      console.log(`  URL: ${url}`);
      console.log(`  重复次数: ${articles.length}`);
      articles.forEach((article, i) => {
        console.log(`    ${i + 1}. ${article.title} (ID: ${article.id}, 创建于: ${article.created_at})`);
      });
      console.log('');
    });
  } else {
    console.log('✅ NHS 文章没有 URL 重复\n');
  }
}

async function main() {
  await checkRecentInserts();
  await checkNHSArticles();
  
  console.log('='.repeat(70));
  console.log('✅ 检查完成\n');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { checkRecentInserts, checkNHSArticles };


