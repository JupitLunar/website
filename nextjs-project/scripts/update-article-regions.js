#!/usr/bin/env node

/**
 * 更新现有文章的地区信息
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

// 地区识别规则
const REGION_RULES = {
  'AAP': 'US',
  'American Academy of Pediatrics': 'US',
  'Mayo Clinic': 'US',
  'CDC': 'US',
  'Cleveland Clinic': 'US',
  'Stanford': 'US',
  'KidsHealth': 'US',
  'Nemours': 'US',

  'NHS': 'UK',
  'National Health Service': 'UK',

  'Health Canada': 'CA',
  'Canadian': 'CA',

  'Raising Children': 'AU',
  'Australian': 'AU',
  'Pregnancy, Birth & Baby': 'AU',

  'Plunket': 'NZ',

  'HealthHub': 'SG',
  'Singapore': 'SG',

  'WHO': 'Global',
  'World Health Organization': 'Global',
  'UNICEF': 'Global',
  'La Leche League': 'Global'
};

function detectRegion(license) {
  if (!license) return 'Unknown';

  for (const [keyword, region] of Object.entries(REGION_RULES)) {
    if (license.includes(keyword)) {
      return region;
    }
  }

  return 'Unknown';
}

async function updateArticleRegions() {
  console.log('🔄 开始更新文章地区信息\n');

  // 获取所有文章
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, license, region');

  if (error) {
    console.error('❌ 获取文章失败:', error);
    return;
  }

  console.log(`📊 找到 ${articles.length} 篇文章\n`);

  const stats = {
    total: articles.length,
    updated: 0,
    unchanged: 0,
    byRegion: {}
  };

  for (const article of articles) {
    const detectedRegion = detectRegion(article.license);

    // 初始化统计
    if (!stats.byRegion[detectedRegion]) {
      stats.byRegion[detectedRegion] = 0;
    }
    stats.byRegion[detectedRegion]++;

    // 如果地区不同，更新
    if (article.region !== detectedRegion) {
      const { error: updateError } = await supabase
        .from('articles')
        .update({ region: detectedRegion })
        .eq('id', article.id);

      if (updateError) {
        console.error(`❌ 更新失败 (ID: ${article.id}):`, updateError.message);
      } else {
        console.log(`✅ 更新: ${article.region || 'NULL'} → ${detectedRegion}`);
        stats.updated++;
      }
    } else {
      stats.unchanged++;
    }
  }

  // 显示统计
  console.log('\n' + '='.repeat(70));
  console.log('📊 更新结果统计');
  console.log('='.repeat(70));
  console.log(`总文章数: ${stats.total}`);
  console.log(`已更新: ${stats.updated} 篇 ✅`);
  console.log(`未改变: ${stats.unchanged} 篇`);
  console.log('\n按地区分布:');

  // 排序显示
  const sortedRegions = Object.entries(stats.byRegion)
    .sort((a, b) => b[1] - a[1]);

  sortedRegions.forEach(([region, count]) => {
    const percentage = ((count / stats.total) * 100).toFixed(1);
    console.log(`  [${region.padEnd(8)}] ${count.toString().padStart(3)} 篇 (${percentage}%)`);
  });

  console.log('\n✅ 更新完成！\n');
}

if (require.main === module) {
  updateArticleRegions().catch(console.error);
}

module.exports = { updateArticleRegions };
