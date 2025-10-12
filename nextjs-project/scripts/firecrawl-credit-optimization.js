#!/usr/bin/env node

/**
 * Firecrawl Credit优化策略
 * 展示如何高效使用Firecrawl API，减少credit消耗
 */

const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 你的Firecrawl API密钥
const FIRECRAWL_API_KEY = 'fc-8446170a8fe542688e8cf234179bb188';

/**
 * Credit消耗分析
 */
function analyzeCreditUsage() {
  console.log('💰 Firecrawl Credit消耗分析');
  console.log('='.repeat(50));
  
  console.log('\n📊 不同操作的Credit消耗:');
  console.log('┌─────────────────┬──────────────┬─────────────────┐');
  console.log('│ 操作类型        │ Credit消耗   │ 说明            │');
  console.log('├─────────────────┼──────────────┼─────────────────┤');
  console.log('│ scrape (简单)   │ ~1-3 credits │ 基础页面抓取    │');
  console.log('│ scrape (复杂)   │ ~3-10 credits│ 大量JS/动态内容 │');
  console.log('│ search          │ ~2-5 credits │ 搜索+抓取       │');
  console.log('│ map             │ ~5-15 credits│ 网站映射        │');
  console.log('│ extract (AI)    │ ~5-20 credits│ AI结构化提取    │');
  console.log('└─────────────────┴──────────────┴─────────────────┘');
  
  console.log('\n🎯 优化策略:');
  console.log('1. 优先使用简单的scrape操作');
  console.log('2. 避免不必要的AI extract');
  console.log('3. 批量处理相似网站');
  console.log('4. 使用缓存避免重复抓取');
  console.log('5. 智能过滤低价值页面');
}

/**
 * 策略1: 批量URL处理
 */
async function strategy1_BatchURLs() {
  console.log('\n🚀 策略1: 批量URL处理');
  console.log('='.repeat(30));
  
  // 批量URL列表
  const batchURLs = [
    'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Starting-Solid-Foods.aspx',
    'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Sample-One-Day-Menu-for-an-8-to-12-Month-Old.aspx',
    'https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/Working-Together-Breastfeeding-and-Solid-Foods.aspx',
    'https://www.nhs.uk/conditions/baby/weaning-and-feeding/',
    'https://www.nhs.uk/conditions/baby/breastfeeding-and-bottle-feeding/'
  ];
  
  console.log(`📋 计划批量处理 ${batchURLs.length} 个URL`);
  console.log(`💰 预计Credit消耗: ${batchURLs.length * 2} credits`);
  
  const results = [];
  
  for (let i = 0; i < batchURLs.length; i++) {
    const url = batchURLs[i];
    console.log(`\n${i + 1}/${batchURLs.length} 处理: ${url.substring(0, 60)}...`);
    
    try {
      // 模拟抓取（实际使用时调用真实API）
      const result = await mockScrapeWithCreditTracking(url);
      results.push(result);
      
      console.log(`  ✅ 抓取成功: ${result.wordCount} 字符`);
      console.log(`  💰 Credit消耗: ${result.creditsUsed}`);
      
      // 延迟避免rate limit
      if (i < batchURLs.length - 1) {
        console.log('  ⏳ 等待2秒...');
        await delay(2000);
      }
      
    } catch (error) {
      console.error(`  ❌ 抓取失败: ${error.message}`);
    }
  }
  
  const totalCredits = results.reduce((sum, r) => sum + r.creditsUsed, 0);
  const totalWords = results.reduce((sum, r) => sum + r.wordCount, 0);
  
  console.log(`\n📊 批量处理结果:`);
  console.log(`  ✅ 成功: ${results.length}/${batchURLs.length}`);
  console.log(`  💰 总Credit消耗: ${totalCredits}`);
  console.log(`  📝 总字数: ${totalWords.toLocaleString()}`);
  console.log(`  📈 效率: ${(totalWords / totalCredits).toFixed(0)} 字/Credit`);
  
  return results;
}

/**
 * 策略2: 智能去重和缓存
 */
async function strategy2_SmartDeduplication() {
  console.log('\n🧠 策略2: 智能去重和缓存');
  console.log('='.repeat(30));
  
  // 检查数据库中已存在的URL
  console.log('🔍 检查数据库中已存在的文章...');
  
  const existingArticles = await checkExistingArticles();
  console.log(`📋 发现 ${existingArticles.length} 篇已存在的文章`);
  
  // 智能过滤URL
  const newURLs = [
    'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Starting-Solid-Foods.aspx',
    'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Sample-One-Day-Menu-for-an-8-to-12-Month-Old.aspx',
    'https://www.nhs.uk/conditions/baby/weaning-and-feeding/'
  ];
  
  const filteredURLs = newURLs.filter(url => 
    !existingArticles.some(article => article.url === url)
  );
  
  console.log(`📊 过滤结果:`);
  console.log(`  📥 原始URL数量: ${newURLs.length}`);
  console.log(`  🆕 需要抓取: ${filteredURLs.length}`);
  console.log(`  ⏭️  跳过重复: ${newURLs.length - filteredURLs.length}`);
  console.log(`  💰 节省Credit: ${(newURLs.length - filteredURLs.length) * 2}`);
  
  return filteredURLs;
}

/**
 * 策略3: 内容价值评估
 */
async function strategy3_ContentValueAssessment() {
  console.log('\n🎯 策略3: 内容价值评估');
  console.log('='.repeat(30));
  
  const urlCandidates = [
    {
      url: 'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Starting-Solid-Foods.aspx',
      expectedValue: 'high',
      priority: 1
    },
    {
      url: 'https://www.healthychildren.org/English/about-us/Pages/default.aspx',
      expectedValue: 'low',
      priority: 3
    },
    {
      url: 'https://www.nhs.uk/conditions/baby/weaning-and-feeding/',
      expectedValue: 'high',
      priority: 1
    }
  ];
  
  console.log('📊 内容价值评估:');
  
  // 按优先级排序
  const sortedByPriority = urlCandidates.sort((a, b) => a.priority - b.priority);
  
  sortedByPriority.forEach((item, index) => {
    const valueIcon = item.expectedValue === 'high' ? '🔥' : '📄';
    console.log(`${index + 1}. ${valueIcon} ${item.url.substring(0, 60)}...`);
    console.log(`   价值: ${item.expectedValue}, 优先级: ${item.priority}`);
  });
  
  // 只抓取高价值内容
  const highValueURLs = sortedByPriority.filter(item => item.expectedValue === 'high');
  console.log(`\n🎯 高价值内容: ${highValueURLs.length}/${sortedByPriority.length}`);
  console.log(`💰 预计Credit消耗: ${highValueURLs.length * 2} credits`);
  
  return highValueURLs;
}

/**
 * 策略4: 分阶段抓取
 */
async function strategy4_PhasedScraping() {
  console.log('\n📅 策略4: 分阶段抓取');
  console.log('='.repeat(30));
  
  const phases = {
    'Phase 1 - 核心内容': [
      'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Starting-Solid-Foods.aspx'
    ],
    'Phase 2 - 扩展内容': [
      'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Sample-One-Day-Menu-for-an-8-to-12-Month-Old.aspx',
      'https://www.nhs.uk/conditions/baby/weaning-and-feeding/'
    ],
    'Phase 3 - 补充内容': [
      'https://www.nhs.uk/conditions/baby/breastfeeding-and-bottle-feeding/',
      'https://www.nhs.uk/conditions/baby/babys-development/'
    ]
  };
  
  console.log('📋 分阶段抓取计划:');
  
  Object.entries(phases).forEach(([phase, urls], index) => {
    console.log(`\n${index + 1}. ${phase}`);
    console.log(`   📊 URL数量: ${urls.length}`);
    console.log(`   💰 Credit消耗: ${urls.length * 2}`);
    console.log(`   ⏱️  预计时间: ${urls.length * 3}秒`);
    
    urls.forEach(url => {
      console.log(`   📄 ${url.substring(0, 60)}...`);
    });
  });
  
  const totalCredits = Object.values(phases).reduce((sum, urls) => sum + urls.length * 2, 0);
  console.log(`\n💰 总Credit消耗: ${totalCredits} credits`);
  console.log('💡 建议: 可以根据预算分阶段执行');
}

/**
 * 策略5: 混合抓取模式
 */
async function strategy5_HybridApproach() {
  console.log('\n🔄 策略5: 混合抓取模式');
  console.log('='.repeat(30));
  
  console.log('🎯 混合策略说明:');
  console.log('1. 🔍 使用search发现新内容 (一次性)');
  console.log('2. 📄 批量scrape高价值页面');
  console.log('3. 🗺️  使用map探索网站结构 (选择性)');
  console.log('4. 🤖 只在必要时使用AI extract');
  
  const approach = {
    search: {
      cost: 5,
      benefit: '发现新内容',
      frequency: 'daily'
    },
    scrape: {
      cost: 2,
      benefit: '获取内容',
      frequency: 'batch'
    },
    map: {
      cost: 10,
      benefit: '探索结构',
      frequency: 'weekly'
    },
    extract: {
      cost: 15,
      benefit: '结构化数据',
      frequency: 'selective'
    }
  };
  
  console.log('\n📊 混合模式Credit分配:');
  Object.entries(approach).forEach(([method, config]) => {
    console.log(`${method.toUpperCase()}: ${config.cost} credits - ${config.benefit} (${config.frequency})`);
  });
  
  const dailyBudget = 50; // 每日Credit预算
  const weeklyBudget = 300; // 每周Credit预算
  
  console.log(`\n💰 预算分配建议:`);
  console.log(`  每日预算: ${dailyBudget} credits`);
  console.log(`  每周预算: ${weeklyBudget} credits`);
  console.log(`  建议分配: 70% scrape, 20% search, 10% extract`);
}

/**
 * 实际Credit消耗监控
 */
async function monitorCreditUsage() {
  console.log('\n📊 Credit使用监控');
  console.log('='.repeat(30));
  
  // 模拟Credit使用统计
  const usageStats = {
    today: { used: 25, remaining: 75, total: 100 },
    thisWeek: { used: 150, remaining: 850, total: 1000 },
    thisMonth: { used: 500, remaining: 4500, total: 5000 }
  };
  
  console.log('📈 使用统计:');
  Object.entries(usageStats).forEach(([period, stats]) => {
    const percentage = (stats.used / stats.total * 100).toFixed(1);
    const bar = '█'.repeat(Math.floor(percentage / 5)) + '░'.repeat(20 - Math.floor(percentage / 5));
    
    console.log(`${period}: ${stats.used}/${stats.total} credits (${percentage}%)`);
    console.log(`        [${bar}]`);
  });
  
  console.log('\n💡 优化建议:');
  console.log('1. 设置每日Credit限制');
  console.log('2. 监控使用趋势');
  console.log('3. 优先高价值内容');
  console.log('4. 使用缓存减少重复抓取');
}

// 辅助函数
async function mockScrapeWithCreditTracking(url) {
  // 模拟抓取，实际使用时调用真实Firecrawl API
  await delay(1000);
  
  const creditsUsed = Math.floor(Math.random() * 3) + 1; // 1-3 credits
  const wordCount = Math.floor(Math.random() * 30000) + 5000;
  
  return {
    url,
    wordCount,
    creditsUsed,
    timestamp: new Date().toISOString()
  };
}

async function checkExistingArticles() {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('url, title')
      .limit(10);
    
    if (error) {
      console.error('检查现有文章失败:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('检查现有文章失败:', error);
    return [];
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 主函数
 */
async function main() {
  console.log('💰 Firecrawl Credit优化策略分析');
  console.log('='.repeat(50));
  
  try {
    // 分析Credit消耗
    analyzeCreditUsage();
    
    // 展示各种优化策略
    await strategy1_BatchURLs();
    await strategy2_SmartDeduplication();
    await strategy3_ContentValueAssessment();
    await strategy4_PhasedScraping();
    await strategy5_HybridApproach();
    
    // 监控Credit使用
    await monitorCreditUsage();
    
    console.log('\n🎯 总结建议:');
    console.log('1. ✅ 批量处理相似网站');
    console.log('2. ✅ 智能去重避免重复抓取');
    console.log('3. ✅ 优先高价值内容');
    console.log('4. ✅ 分阶段执行避免超预算');
    console.log('5. ✅ 混合模式平衡效率和成本');
    
    console.log('\n💡 实际使用建议:');
    console.log('- 每日预算: 50-100 credits');
    console.log('- 批量大小: 10-20个URL');
    console.log('- 优先级: 权威机构 > 一般网站');
    console.log('- 缓存策略: 24小时避免重复');
    
  } catch (error) {
    console.error('❌ 分析过程中出现错误:', error);
  }
}

// 运行分析
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { 
  main, 
  analyzeCreditUsage, 
  strategy1_BatchURLs, 
  strategy2_SmartDeduplication,
  strategy3_ContentValueAssessment,
  strategy4_PhasedScraping,
  strategy5_HybridApproach
};
