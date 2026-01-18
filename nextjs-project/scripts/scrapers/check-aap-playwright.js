#!/usr/bin/env node

/**
 * 检查 AAP 文章中哪些是通过 Playwright Scraper Bot 抓取的
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

async function checkAAPPlaywright() {
  console.log('🔍 检查 AAP 文章 - Playwright Scraper Bot 抓取情况\n');
  console.log('='.repeat(70));

  // 查找所有 AAP 相关文章（通过 license 字段）
  const { data: allAAP, error: allError } = await supabase
    .from('articles')
    .select('id, title, slug, license, reviewed_by, created_at')
    .or('license.ilike.%healthychildren.org%,license.ilike.%AAP%,license.ilike.%American Academy of Pediatrics%')
    .order('created_at', { ascending: false });

  if (allError) {
    console.error('❌ 查询失败:', allError);
    return;
  }

  console.log(`📊 AAP 文章总数: ${allAAP.length} 篇\n`);

  // 按 reviewed_by 分组
  const byBot = {};
  allAAP.forEach(article => {
    const bot = article.reviewed_by || 'Unknown';
    if (!byBot[bot]) {
      byBot[bot] = [];
    }
    byBot[bot].push(article);
  });

  console.log('📋 按抓取工具分组:\n');
  Object.entries(byBot).forEach(([bot, articles]) => {
    console.log(`  ${bot}: ${articles.length} 篇`);
  });

  // 重点查看 Playwright Scraper Bot 的文章
  const playwrightArticles = byBot['Playwright Scraper Bot'] || [];
  
  console.log(`\n${'='.repeat(70)}`);
  console.log(`🎯 Playwright Scraper Bot 抓取的 AAP 文章: ${playwrightArticles.length} 篇\n`);

  if (playwrightArticles.length === 0) {
    console.log('  ❌ 没有找到通过 Playwright Scraper Bot 抓取的 AAP 文章');
    console.log('  ⚠️  这说明 playwright-scraper-aap-cdc.js 脚本可能还没有成功运行或没有成功入库');
  } else {
    console.log('  最新文章（前 10 篇）:');
    playwrightArticles.slice(0, 10).forEach((article, index) => {
      const urlMatch = article.license?.match(/URL:\s*(https?:\/\/[^\s|]+)/);
      const url = urlMatch ? urlMatch[1] : 'N/A';
      const date = new Date(article.created_at).toLocaleString('zh-CN');
      
      console.log(`\n    ${index + 1}. ${article.title.substring(0, 60)}`);
      console.log(`       创建时间: ${date}`);
      if (url !== 'N/A') {
        console.log(`       URL: ${url}`);
      }
    });
  }

  // 检查 healthychildren.org URL
  const withAAPUrl = allAAP.filter(a => {
    const urlMatch = a.license?.match(/URL:\s*(https?:\/\/[^\s|]+)/);
    return urlMatch && urlMatch[1].includes('healthychildren.org');
  });

  console.log(`\n${'='.repeat(70)}`);
  console.log(`📊 包含 healthychildren.org URL 的文章: ${withAAPUrl.length} 篇\n`);

  // 统计各工具抓取的 healthychildren.org 文章
  const byBotWithUrl = {};
  withAAPUrl.forEach(article => {
    const bot = article.reviewed_by || 'Unknown';
    if (!byBotWithUrl[bot]) {
      byBotWithUrl[bot] = [];
    }
    byBotWithUrl[bot].push(article);
  });

  console.log('  按抓取工具分组:');
  Object.entries(byBotWithUrl).forEach(([bot, articles]) => {
    console.log(`    ${bot}: ${articles.length} 篇`);
  });

  console.log('\n' + '='.repeat(70));
}

async function main() {
  await checkAAPPlaywright();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { checkAAPPlaywright };

