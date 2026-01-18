#!/usr/bin/env node

/**
 * 爬虫统计信息
 * 显示爬取历史、成功率、数据质量等统计
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

const dotenv = require('dotenv');
// Load env vars from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少必要的环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 获取统计数据
 */
async function getStats() {
  const stats = {
    totalArticles: 0,
    draftArticles: 0,
    publishedArticles: 0,
    articlesBySource: {},
    articlesByHub: {},
    recentArticles: [],
    contentQuality: {
      avgContentLength: 0,
      avgKeyFacts: 0,
      avgCitations: 0
    }
  };
  
  // 总文章数
  const { data: allArticles, error: allError } = await supabase
    .from('articles')
    .select('id, status, hub, body_md, key_facts, created_at, citations(*)')
    .eq('reviewed_by', 'Web Scraper Bot');
  
  if (allError) throw allError;
  
  stats.totalArticles = allArticles.length;
  stats.draftArticles = allArticles.filter(a => a.status === 'draft').length;
  stats.publishedArticles = allArticles.filter(a => a.status === 'published').length;
  
  // 按Hub统计
  allArticles.forEach(article => {
    stats.articlesByHub[article.hub] = (stats.articlesByHub[article.hub] || 0) + 1;
  });
  
  // 内容质量统计
  if (allArticles.length > 0) {
    const totalLength = allArticles.reduce((sum, a) => sum + (a.body_md?.length || 0), 0);
    const totalKeyFacts = allArticles.reduce((sum, a) => sum + (a.key_facts?.length || 0), 0);
    const totalCitations = allArticles.reduce((sum, a) => sum + (a.citations?.length || 0), 0);
    
    stats.contentQuality.avgContentLength = Math.round(totalLength / allArticles.length);
    stats.contentQuality.avgKeyFacts = (totalKeyFacts / allArticles.length).toFixed(1);
    stats.contentQuality.avgCitations = (totalCitations / allArticles.length).toFixed(1);
  }
  
  // 最近的文章
  stats.recentArticles = allArticles
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 10)
    .map(a => ({
      title: a.title,
      hub: a.hub,
      status: a.status,
      created_at: a.created_at
    }));
  
  // 数据来源统计
  const { data: sources } = await supabase
    .from('kb_sources')
    .select('id, name, organization, grade, retrieved_at');
  
  if (sources) {
    for (const source of sources) {
      const { count } = await supabase
        .from('citations')
        .select('*', { count: 'exact', head: true })
        .eq('publisher', source.organization);
      
      stats.articlesBySource[source.organization] = count || 0;
    }
  }
  
  return stats;
}

/**
 * 分析本地文件
 */
function analyzeLocalFiles() {
  const scrapedDir = path.resolve(__dirname, '../data/scraped');
  
  if (!fs.existsSync(scrapedDir)) {
    return { count: 0, totalSize: 0, files: [] };
  }
  
  const files = fs.readdirSync(scrapedDir).filter(f => f.endsWith('.json'));
  const totalSize = files.reduce((sum, file) => {
    const stats = fs.statSync(path.join(scrapedDir, file));
    return sum + stats.size;
  }, 0);
  
  return {
    count: files.length,
    totalSize,
    files: files.slice(0, 5) // 最近5个文件
  };
}

/**
 * 显示统计信息
 */
async function displayStats() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   爬虫统计信息                         ║');
  console.log('╚════════════════════════════════════════╝\n');
  
  console.log('📊 正在收集数据...\n');
  
  const stats = await getStats();
  const localFiles = analyzeLocalFiles();
  
  // 基本统计
  console.log('📈 总体统计');
  console.log('─'.repeat(50));
  console.log(`总文章数:       ${stats.totalArticles}`);
  console.log(`待审核:         ${stats.draftArticles} 篇`);
  console.log(`已发布:         ${stats.publishedArticles} 篇`);
  console.log(`审核率:         ${((stats.publishedArticles / stats.totalArticles) * 100).toFixed(1)}%`);
  
  // 内容质量
  console.log('\n📝 内容质量');
  console.log('─'.repeat(50));
  console.log(`平均内容长度:   ${stats.contentQuality.avgContentLength} 字符`);
  console.log(`平均关键事实:   ${stats.contentQuality.avgKeyFacts} 个`);
  console.log(`平均引用数:     ${stats.contentQuality.avgCitations} 个`);
  
  // 按Hub分类
  console.log('\n🏠 按Hub分类');
  console.log('─'.repeat(50));
  Object.entries(stats.articlesByHub)
    .sort((a, b) => b[1] - a[1])
    .forEach(([hub, count]) => {
      const bar = '█'.repeat(Math.ceil(count / 2));
      console.log(`${hub.padEnd(15)} ${bar} ${count}`);
    });
  
  // 按来源分类
  if (Object.keys(stats.articlesBySource).length > 0) {
    console.log('\n📚 按来源分类');
    console.log('─'.repeat(50));
    Object.entries(stats.articlesBySource)
      .sort((a, b) => b[1] - a[1])
      .forEach(([source, count]) => {
        const bar = '█'.repeat(Math.ceil(count / 2));
        console.log(`${source.padEnd(15)} ${bar} ${count}`);
      });
  }
  
  // 本地文件
  console.log('\n💾 本地文件');
  console.log('─'.repeat(50));
  console.log(`原始数据文件:   ${localFiles.count} 个`);
  console.log(`总大小:         ${(localFiles.totalSize / 1024 / 1024).toFixed(2)} MB`);
  
  // 最近文章
  if (stats.recentArticles.length > 0) {
    console.log('\n🕐 最近爬取的文章');
    console.log('─'.repeat(50));
    stats.recentArticles.forEach((article, i) => {
      const date = new Date(article.created_at).toLocaleDateString();
      const status = article.status === 'draft' ? '📝' : '✅';
      console.log(`${i + 1}. ${status} [${article.hub}] ${article.title.substring(0, 50)}...`);
      console.log(`   ${date}`);
    });
  }
  
  console.log('\n' + '─'.repeat(50));
  console.log('✅ 统计完成！');
}

/**
 * 生成报告
 */
async function generateReport() {
  const stats = await getStats();
  const localFiles = analyzeLocalFiles();
  
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalArticles: stats.totalArticles,
      draftArticles: stats.draftArticles,
      publishedArticles: stats.publishedArticles,
      reviewRate: ((stats.publishedArticles / stats.totalArticles) * 100).toFixed(1)
    },
    quality: stats.contentQuality,
    byHub: stats.articlesByHub,
    bySource: stats.articlesBySource,
    localStorage: localFiles,
    recentArticles: stats.recentArticles
  };
  
  const reportPath = path.resolve(__dirname, '../reports/scraper-stats.json');
  const reportDir = path.dirname(reportPath);
  
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 报告已保存: ${reportPath}`);
  
  return report;
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2);
  
  try {
    await displayStats();
    
    if (args.includes('--report')) {
      await generateReport();
    }
    
  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { getStats, generateReport };

