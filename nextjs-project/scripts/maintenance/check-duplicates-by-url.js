#!/usr/bin/env node

/**
 * 通过 URL 检查特定文章是否已存在
 * 用于验证去重机制是否正常工作
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

// NHS 文章的 URL 列表
const NHS_URLS = [
  'https://www.nhs.uk/baby/weaning-and-feeding/babys-first-solid-foods/',
  'https://www.nhs.uk/baby/weaning-and-feeding/help-your-baby-enjoy-new-foods/',
  'https://www.nhs.uk/baby/weaning-and-feeding/baby-and-toddler-meal-ideas/',
  'https://www.nhs.uk/baby/weaning-and-feeding/childrens-food-safety-and-hygiene/',
  'https://www.nhs.uk/baby/weaning-and-feeding/drinks-and-cups-for-babies-and-young-children/',
  'https://www.nhs.uk/baby/weaning-and-feeding/food-allergies-in-babies-and-young-children/',
  'https://www.nhs.uk/baby/weaning-and-feeding/foods-to-avoid-giving-babies-and-young-children/',
  'https://www.nhs.uk/baby/weaning-and-feeding/fussy-eaters/',
  'https://www.nhs.uk/baby/weaning-and-feeding/vitamins-for-children/',
  'https://www.nhs.uk/baby/weaning-and-feeding/what-to-feed-young-children/',
  'https://www.nhs.uk/baby/weaning-and-feeding/young-children-and-food-common-questions/'
];

async function checkUrlExists(url) {
  // 方法1: 通过 license 字段搜索
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, slug, license, created_at, reviewed_by')
    .ilike('license', `%${url}%`);

  if (error) {
    console.error(`  ❌ 查询错误: ${error.message}`);
    return [];
  }

  return articles || [];
}

async function main() {
  console.log('🔍 检查 NHS 文章 URL 是否已存在\n');
  console.log('='.repeat(70));

  let totalFound = 0;
  let duplicates = [];

  for (const url of NHS_URLS) {
    const articles = await checkUrlExists(url);
    
    if (articles.length > 0) {
      totalFound++;
      console.log(`\n📌 URL: ${url}`);
      console.log(`   找到 ${articles.length} 篇文章:`);
      
      articles.forEach((article, index) => {
        console.log(`   ${index + 1}. ${article.title}`);
        console.log(`      ID: ${article.id}`);
        console.log(`      Slug: ${article.slug}`);
        console.log(`      创建时间: ${article.created_at}`);
        console.log(`      审核人: ${article.reviewed_by || 'N/A'}`);
      });

      if (articles.length > 1) {
        duplicates.push({ url, articles });
      }
    } else {
      console.log(`\n❌ URL: ${url}`);
      console.log(`   未找到`);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('📊 统计:\n');
  console.log(`  检查的 URL 数: ${NHS_URLS.length}`);
  console.log(`  已存在的 URL: ${totalFound}`);
  console.log(`  重复的 URL: ${duplicates.length}\n`);

  if (duplicates.length > 0) {
    console.log('⚠️  发现重复的 URL:\n');
    duplicates.forEach(({ url, articles }) => {
      console.log(`  URL: ${url}`);
      console.log(`  重复次数: ${articles.length}`);
      articles.forEach((article, i) => {
        console.log(`    ${i + 1}. ${article.title} (ID: ${article.id}, 创建于: ${article.created_at})`);
      });
      console.log('');
    });
  } else {
    console.log('✅ 没有发现重复\n');
  }
}

if (require.main === module) {
  main().catch(console.error);
}


