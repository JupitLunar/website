#!/usr/bin/env node

/**
 * 检查权威站点（AAP、CDC、NHS）的抓取情况
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

const SITES = {
  'AAP': {
    name: 'American Academy of Pediatrics (AAP)',
    keywords: ['AAP', 'healthychildren.org', 'American Academy of Pediatrics'],
    baseUrl: 'https://www.healthychildren.org'
  },
  'CDC': {
    name: 'Centers for Disease Control and Prevention (CDC)',
    keywords: ['CDC', 'cdc.gov', 'Centers for Disease Control'],
    baseUrl: 'https://www.cdc.gov'
  },
  'NHS': {
    name: 'National Health Service (NHS)',
    keywords: ['NHS', 'nhs.uk', 'National Health Service'],
    baseUrl: 'https://www.nhs.uk'
  }
};

async function checkSite(siteKey, siteConfig) {
  console.log(`\n📌 ${siteConfig.name}`);
  console.log('─'.repeat(70));

  const articles = [];
  
  // 通过关键词搜索
  for (const keyword of siteConfig.keywords) {
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, slug, license, created_at, reviewed_by')
      .or(`license.ilike.%${keyword}%,title.ilike.%${keyword}%`)
      .order('created_at', { ascending: false });

    if (!error && data) {
      articles.push(...data);
    }
  }

  // 去重（按 ID）
  const uniqueArticles = Array.from(
    new Map(articles.map(a => [a.id, a])).values()
  );

  console.log(`  文章总数: ${uniqueArticles.length} 篇\n`);

  if (uniqueArticles.length === 0) {
    console.log('  ❌ 未找到文章\n');
    return { siteKey, count: 0, articles: [] };
  }

  // 按来源分组
  const bySource = {};
  uniqueArticles.forEach(article => {
    const sourceMatch = article.license?.match(/Source:\s*([^|]+)/);
    const source = sourceMatch ? sourceMatch[1].trim() : 'Unknown';
    
    if (!bySource[source]) {
      bySource[source] = [];
    }
    bySource[source].push(article);
  });

  console.log('  按来源分组:');
  Object.entries(bySource).forEach(([source, articles]) => {
    console.log(`    ${source}: ${articles.length} 篇`);
  });

  // 显示最新的几篇文章
  console.log('\n  最新文章（前 5 篇）:');
  uniqueArticles.slice(0, 5).forEach((article, index) => {
    const urlMatch = article.license?.match(/URL:\s*(https?:\/\/[^\s|]+)/);
    const url = urlMatch ? urlMatch[1] : 'N/A';
    const reviewedBy = article.reviewed_by || 'N/A';
    
    console.log(`    ${index + 1}. ${article.title.substring(0, 60)}`);
    console.log(`       创建时间: ${article.created_at}`);
    console.log(`       审核人: ${reviewedBy}`);
    if (url !== 'N/A') {
      console.log(`       URL: ${url}`);
    }
  });

  // 检查 URL 模式
  const withUrl = uniqueArticles.filter(a => {
    const urlMatch = a.license?.match(/URL:\s*(https?:\/\/[^\s|]+)/);
    return urlMatch && urlMatch[1].includes(siteConfig.baseUrl.replace('https://', ''));
  });

  console.log(`\n  包含 ${siteConfig.baseUrl} URL: ${withUrl.length} 篇`);

  return { siteKey, count: uniqueArticles.length, articles: uniqueArticles };
}

async function checkScrapingStatus() {
  console.log('🔍 检查权威站点抓取情况\n');
  console.log('='.repeat(70));

  const results = {};

  for (const [siteKey, siteConfig] of Object.entries(SITES)) {
    const result = await checkSite(siteKey, siteConfig);
    results[siteKey] = result;
  }

  // 总结
  console.log('\n' + '='.repeat(70));
  console.log('📊 抓取情况总结\n');

  Object.entries(results).forEach(([siteKey, result]) => {
    const status = result.count > 0 ? '✅' : '❌';
    console.log(`  ${status} ${SITES[siteKey].name}: ${result.count} 篇`);
  });

  console.log('\n' + '='.repeat(70));
  console.log('📝 详细说明:\n');

  if (results.AAP.count > 0) {
    console.log('  ✅ AAP: 有文章，但可能不是通过 Playwright 抓取的（Playwright 测试时失败）');
  } else {
    console.log('  ❌ AAP: 未抓取（Playwright 测试时超时/连接失败）');
  }

  if (results.CDC.count > 0) {
    console.log('  ✅ CDC: 有文章，但可能不是通过 Playwright 抓取的（Playwright 测试时失败）');
  } else {
    console.log('  ❌ CDC: 未抓取（Playwright 测试时 403/超时）');
  }

  if (results.NHS.count > 0) {
    console.log('  ✅ NHS: 已通过 Playwright 成功抓取 11 篇新文章');
  } else {
    console.log('  ❌ NHS: 未抓取');
  }

  console.log('');
}

async function main() {
  await checkScrapingStatus();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { checkScrapingStatus };


