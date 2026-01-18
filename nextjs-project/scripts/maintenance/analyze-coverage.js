#!/usr/bin/env node

/**
 * 分析爬虫覆盖范围和数据库内容
 */

const { createClient } = require('@supabase/supabase-js');
const { SOURCES } = require('./scraper-config.js');
const path = require('path');
const dotenv = require('dotenv');
// Load env vars from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function analyzeDatabase() {
  console.log('╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║           爬虫覆盖范围和数据分析                                   ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');
  
  // 1. 数据库中的文章
  const { data: articles, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('❌ 查询失败:', error);
    return;
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 数据库当前状态');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log(`📝 文章总数: ${articles.length}\n`);
  
  // 按分类统计
  const byHub = {};
  const byType = {};
  const byStatus = {};
  
  articles.forEach(article => {
    byHub[article.hub] = (byHub[article.hub] || 0) + 1;
    byType[article.type] = (byType[article.type] || 0) + 1;
    byStatus[article.status] = (byStatus[article.status] || 0) + 1;
  });
  
  console.log('按分类统计:');
  Object.entries(byHub).forEach(([hub, count]) => {
    console.log(`  ${hub}: ${count} 篇`);
  });
  
  console.log('\n按类型统计:');
  Object.entries(byType).forEach(([type, count]) => {
    console.log(`  ${type}: ${count} 篇`);
  });
  
  console.log('\n按状态统计:');
  Object.entries(byStatus).forEach(([status, count]) => {
    console.log(`  ${status}: ${count} 篇`);
  });
  
  console.log('\n文章详情:\n');
  articles.forEach((article, i) => {
    console.log(`${i + 1}. ${article.title}`);
    console.log(`   Slug: ${article.slug}`);
    console.log(`   分类: ${article.hub} | 类型: ${article.type} | 状态: ${article.status}`);
    console.log(`   内容长度: ${article.body_md ? article.body_md.length : 0} 字符`);
    console.log(`   创建时间: ${new Date(article.created_at).toLocaleString()}\n`);
  });
  
  // 2. 爬虫配置的覆盖范围
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎯 爬虫配置的覆盖范围');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  let totalPages = 0;
  const categoryCount = {};
  
  console.log(`配置的来源数量: ${Object.keys(SOURCES).length}\n`);
  
  Object.entries(SOURCES).forEach(([key, source]) => {
    console.log(`\n📌 ${source.name} (${source.organization})`);
    console.log(`   等级: ${source.grade}`);
    console.log(`   页面数: ${source.targetPages.length}`);
    
    source.targetPages.forEach((page, i) => {
      console.log(`   ${i + 1}. ${page.type} (${page.category})`);
      console.log(`      URL: ${page.url}`);
      categoryCount[page.category] = (categoryCount[page.category] || 0) + 1;
      totalPages++;
    });
  });
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📈 总体统计');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log(`配置的来源: ${Object.keys(SOURCES).length} 个`);
  console.log(`配置的页面: ${totalPages} 个`);
  console.log(`已抓取文章: ${articles.length} 篇`);
  console.log(`覆盖率: ${((articles.length / totalPages) * 100).toFixed(1)}%\n`);
  
  console.log('按主题统计（配置中）:');
  Object.entries(categoryCount).forEach(([category, count]) => {
    console.log(`  ${category}: ${count} 个页面`);
  });
  
  // 3. 缺失分析
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('⚠️  母婴内容覆盖分析');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('✅ 已覆盖的主题:');
  console.log('  • 喂养/营养 (feeding, nutrition, breastfeeding)');
  console.log('  • 睡眠 (sleep)');
  console.log('  • 发育 (development)');
  console.log('  • 健康 (health)');
  console.log('  • 新生儿护理 (newborn-care)');
  
  console.log('\n⚠️  可能缺失的重要主题:');
  console.log('  • 产后护理 (postpartum care)');
  console.log('  • 母乳喂养技巧详细指南');
  console.log('  • 疫苗接种时间表');
  console.log('  • 婴儿疾病预防');
  console.log('  • 早期教育/互动');
  console.log('  • 婴儿安全（防窒息、家庭安全等）');
  console.log('  • 出牙护理');
  console.log('  • 皮肤护理/尿布疹');
  console.log('  • 婴儿哭闹/安抚技巧');
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('💡 建议');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('1. 当前覆盖率较低，建议：');
  console.log('   • 修复网站选择器，提高抓取成功率');
  console.log('   • 添加更多母婴相关的页面URL');
  console.log('   • 考虑添加更多权威来源\n');
  
  console.log('2. 缺失的重要内容领域：');
  console.log('   • 产后妈妈护理');
  console.log('   • 疫苗和健康检查');
  console.log('   • 婴儿安全和急救');
  console.log('   • 心理健康和育儿压力\n');
  
  console.log('3. 建议立即行动：');
  console.log('   • 更新 scraper-config.js，添加更多具体文章页面');
  console.log('   • 测试每个URL，确保可以正确抓取');
  console.log('   • 运行完整爬虫，覆盖所有配置的页面\n');
}

analyzeDatabase().catch(console.error);

