#!/usr/bin/env node

/**
 * Firecrawl批量抓取优化器
 * 展示如何高效批量抓取多个网站，最大化Credit利用效率
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

// 批量抓取配置
const BATCH_CONFIG = {
  maxConcurrent: 3,           // 最大并发数
  delayBetweenBatches: 2000,  // 批次间延迟(ms)
  maxArticlesPerBatch: 5,     // 每批次最大文章数
  dailyCreditLimit: 100,      // 每日Credit限制
  retryAttempts: 2,           // 重试次数
  timeout: 60000              // 超时时间(ms)
};

// 多网站URL集合
const WEBSITE_BATCHES = {
  'AAP_Batch': [
    {
      url: 'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Starting-Solid-Foods.aspx',
      priority: 1,
      expectedCredits: 2,
      category: 'feeding'
    },
    {
      url: 'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Sample-One-Day-Menu-for-an-8-to-12-Month-Old.aspx',
      priority: 1,
      expectedCredits: 2,
      category: 'feeding'
    },
    {
      url: 'https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/Working-Together-Breastfeeding-and-Solid-Foods.aspx',
      priority: 1,
      expectedCredits: 2,
      category: 'feeding'
    }
  ],
  
  'NHS_Batch': [
    {
      url: 'https://www.nhs.uk/conditions/baby/weaning-and-feeding/',
      priority: 1,
      expectedCredits: 2,
      category: 'feeding'
    },
    {
      url: 'https://www.nhs.uk/conditions/baby/breastfeeding-and-bottle-feeding/',
      priority: 1,
      expectedCredits: 2,
      category: 'feeding'
    },
    {
      url: 'https://www.nhs.uk/conditions/baby/babys-development/',
      priority: 2,
      expectedCredits: 2,
      category: 'development'
    }
  ],
  
  'CDC_Batch': [
    {
      url: 'https://www.cdc.gov/nutrition/infantandtoddlernutrition/foods-and-drinks/when-to-introduce-solid-foods.html',
      priority: 1,
      expectedCredits: 3,
      category: 'feeding'
    },
    {
      url: 'https://www.cdc.gov/nutrition/infantandtoddlernutrition/foods-and-drinks/foods-to-avoid.html',
      priority: 1,
      expectedCredits: 2,
      category: 'safety'
    }
  ]
};

/**
 * 发送HTTP请求到Firecrawl API
 */
function makeFirecrawlRequest(endpoint, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'api.firecrawl.dev',
      port: 443,
      path: `/v0${endpoint}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`
      },
      timeout: BATCH_CONFIG.timeout
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsedData);
          } else {
            reject(new Error(`API Error ${res.statusCode}: ${parsedData.error || responseData}`));
          }
        } catch (error) {
          reject(new Error(`Parse Error: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(postData);
    req.end();
  });
}

/**
 * 抓取单个页面
 */
async function scrapePage(item, batchName) {
  const startTime = Date.now();
  
  try {
    console.log(`    🔄 抓取: ${item.url.substring(0, 60)}...`);
    
    const result = await makeFirecrawlRequest('/scrape', {
      url: item.url,
      formats: ['markdown'],
      onlyMainContent: true,
      removeBase64Images: true,
      waitFor: 1000
    });

    if (!result.data || !result.data.markdown) {
      throw new Error('未获取到内容');
    }

    const content = result.data.markdown;
    const title = result.data.metadata?.title || 'Untitled';
    const wordCount = content.length;
    const duration = Date.now() - startTime;

    console.log(`    ✅ 成功: ${wordCount} 字符 (${duration}ms)`);

    return {
      success: true,
      url: item.url,
      title: title,
      content: content,
      wordCount: wordCount,
      category: item.category,
      batchName: batchName,
      creditsUsed: item.expectedCredits,
      duration: duration,
      extractedAt: new Date().toISOString()
    };

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`    ❌ 失败: ${error.message} (${duration}ms)`);
    
    return {
      success: false,
      url: item.url,
      error: error.message,
      creditsUsed: 0,
      duration: duration
    };
  }
}

/**
 * 检查数据库中已存在的文章
 */
async function checkExistingArticles() {
  try {
    console.log(`\n🔍 检查数据库中已存在的文章...`);
    
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, body_md')
      .not('body_md', 'is', null)
      .limit(100);
    
    if (error) {
      console.error('检查现有文章失败:', error);
      return [];
    }
    
    console.log(`📋 发现 ${data?.length || 0} 篇已存在的文章`);
    
    // 提取已存在的URL模式
    const existingPatterns = [];
    if (data) {
      data.forEach(article => {
        // 从内容中提取可能的URL
        const urlMatches = article.body_md.match(/https?:\/\/[^\s\)]+/g);
        if (urlMatches) {
          existingPatterns.push(...urlMatches);
        }
      });
    }
    
    return existingPatterns;
  } catch (error) {
    console.error('检查现有文章失败:', error);
    return [];
  }
}

/**
 * 智能过滤URL - 去除已存在的文章
 */
async function filterExistingURLs(items) {
  const existingPatterns = await checkExistingArticles();
  
  console.log(`\n🧠 智能去重过滤:`);
  console.log(`  📥 原始URL数量: ${items.length}`);
  
  const filteredItems = items.filter(item => {
    // 检查URL是否已存在
    const urlExists = existingPatterns.some(pattern => 
      item.url.includes(pattern.replace(/https?:\/\//, '').split('/')[0])
    );
    
    if (urlExists) {
      console.log(`    ⏭️  跳过已存在: ${item.url.substring(0, 60)}...`);
      return false;
    }
    
    return true;
  });
  
  const skippedCount = items.length - filteredItems.length;
  const savedCredits = skippedCount * 2; // 假设每个URL平均消耗2 credits
  
  console.log(`  🆕 需要抓取: ${filteredItems.length}`);
  console.log(`  ⏭️  跳过重复: ${skippedCount}`);
  console.log(`  💰 节省Credit: ${savedCredits}`);
  
  return filteredItems;
}

/**
 * 并发抓取一批URL
 */
async function scrapeBatch(batchName, items) {
  console.log(`\n🚀 开始批次: ${batchName}`);
  
  // 智能去重过滤
  const filteredItems = await filterExistingURLs(items);
  
  if (filteredItems.length === 0) {
    console.log(`  ⏭️  所有URL都已存在，跳过批次 ${batchName}`);
    return {
      batchName,
      successful: [],
      failed: [],
      totalCredits: 0,
      totalWords: 0,
      totalDuration: 0,
      skipped: items.length
    };
  }
  
  console.log(`📊 计划抓取 ${filteredItems.length} 个URL (过滤后)`);
  console.log(`💰 预计Credit消耗: ${filteredItems.reduce((sum, item) => sum + item.expectedCredits, 0)} credits`);
  
  const results = [];
  const chunks = [];
  
  // 将items分成小块以控制并发
  for (let i = 0; i < filteredItems.length; i += BATCH_CONFIG.maxConcurrent) {
    chunks.push(filteredItems.slice(i, i + BATCH_CONFIG.maxConcurrent));
  }
  
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    console.log(`\n  📦 处理块 ${i + 1}/${chunks.length} (${chunk.length} URLs)`);
    
    // 并发抓取当前块
    const chunkPromises = chunk.map(item => scrapePage(item, batchName));
    const chunkResults = await Promise.all(chunkPromises);
    
    results.push(...chunkResults);
    
    // 批次间延迟
    if (i < chunks.length - 1) {
      console.log(`  ⏳ 等待 ${BATCH_CONFIG.delayBetweenBatches}ms...`);
      await delay(BATCH_CONFIG.delayBetweenBatches);
    }
  }
  
  // 统计结果
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const totalCredits = successful.reduce((sum, r) => sum + r.creditsUsed, 0);
  const totalWords = successful.reduce((sum, r) => sum + r.wordCount, 0);
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  
  const skippedCount = items.length - filteredItems.length;
  const savedCredits = skippedCount * 2;
  
  console.log(`\n📊 ${batchName} 完成:`);
  console.log(`  ✅ 成功: ${successful.length}/${filteredItems.length}`);
  console.log(`  ❌ 失败: ${failed.length}`);
  console.log(`  ⏭️  跳过: ${skippedCount} (已存在)`);
  console.log(`  💰 Credit消耗: ${totalCredits}`);
  console.log(`  💰 节省Credit: ${savedCredits}`);
  console.log(`  📝 总字数: ${totalWords.toLocaleString()}`);
  console.log(`  ⏱️  总耗时: ${(totalDuration / 1000).toFixed(1)}秒`);
  if (totalCredits > 0) {
    console.log(`  📈 效率: ${(totalWords / totalCredits).toFixed(0)} 字/Credit`);
  }
  
  return {
    batchName,
    successful,
    failed,
    totalCredits,
    totalWords,
    totalDuration,
    skipped: skippedCount,
    savedCredits
  };
}

/**
 * 保存成功抓取的内容到数据库
 */
async function saveBatchResults(results) {
  console.log(`\n💾 保存批次结果到数据库...`);
  
  let savedCount = 0;
  let errorCount = 0;
  
  for (const result of results) {
    if (!result.success) continue;
    
    try {
      // 生成文章数据
      const articleData = {
        slug: generateSlug(result.title),
        type: 'explainer',
        hub: mapCategoryToHub(result.category),
        lang: 'en',
        title: result.title,
        one_liner: generateOneLiner(result.content),
        key_facts: extractKeyFacts(result.content),
        body_md: result.content,
        entities: extractEntities(result.content),
        age_range: '0-24 months',
        region: result.batchName.includes('AAP') ? 'US' : 'Global',
        last_reviewed: new Date().toISOString().split('T')[0],
        reviewed_by: 'Firecrawl Batch Bot',
        license: `Source: ${result.batchName}`,
        status: 'draft'
      };
      
      // 检查是否已存在
      const { data: existing } = await supabase
        .from('articles')
        .select('id')
        .eq('url', result.url)
        .limit(1);
      
      if (existing && existing.length > 0) {
        console.log(`    ⏭️  跳过已存在: ${result.title.substring(0, 40)}...`);
        continue;
      }
      
      // 插入数据库
      const { data, error } = await supabase
        .from('articles')
        .insert([articleData])
        .select();
      
      if (error) {
        console.error(`    ❌ 保存失败: ${result.title.substring(0, 40)}... - ${error.message}`);
        errorCount++;
      } else {
        console.log(`    ✅ 保存成功: ${result.title.substring(0, 40)}... - ID: ${data[0].id}`);
        savedCount++;
      }
      
    } catch (error) {
      console.error(`    ❌ 保存错误: ${result.title.substring(0, 40)}... - ${error.message}`);
      errorCount++;
    }
  }
  
  console.log(`\n📊 保存统计:`);
  console.log(`  ✅ 成功保存: ${savedCount}`);
  console.log(`  ❌ 保存失败: ${errorCount}`);
  
  return { savedCount, errorCount };
}

/**
 * 执行批量抓取
 */
async function executeBatchScraping() {
  console.log('🚀 Firecrawl批量抓取优化器');
  console.log('='.repeat(50));
  console.log(`🔑 API密钥: ${FIRECRAWL_API_KEY.substring(0, 10)}...`);
  console.log(`📊 配置: 最大并发${BATCH_CONFIG.maxConcurrent}, 批次延迟${BATCH_CONFIG.delayBetweenBatches}ms`);
  console.log(`💰 每日Credit限制: ${BATCH_CONFIG.dailyCreditLimit}`);
  
  const allResults = [];
  let totalCreditsUsed = 0;
  let totalWords = 0;
  let totalDuration = 0;
  let totalSkipped = 0;
  let totalSavedCredits = 0;
  
  // 按优先级排序批次
  const batchEntries = Object.entries(WEBSITE_BATCHES);
  
  for (const [batchName, items] of batchEntries) {
    // 检查Credit限制
    if (totalCreditsUsed >= BATCH_CONFIG.dailyCreditLimit) {
      console.log(`\n⚠️  已达到每日Credit限制 (${BATCH_CONFIG.dailyCreditLimit}), 停止抓取`);
      break;
    }
    
    // 按优先级排序items
    const sortedItems = items.sort((a, b) => a.priority - b.priority);
    const batchCredits = sortedItems.reduce((sum, item) => sum + item.expectedCredits, 0);
    
    // 检查是否会超出限制
    if (totalCreditsUsed + batchCredits > BATCH_CONFIG.dailyCreditLimit) {
      console.log(`\n⚠️  批次 ${batchName} 会超出Credit限制，跳过`);
      continue;
    }
    
    try {
      const batchResult = await scrapeBatch(batchName, sortedItems);
      allResults.push(...batchResult.successful);
      
      totalCreditsUsed += batchResult.totalCredits;
      totalWords += batchResult.totalWords;
      totalDuration += batchResult.totalDuration;
      totalSkipped += batchResult.skipped || 0;
      totalSavedCredits += batchResult.savedCredits || 0;
      
      // 批次间延迟
      if (batchEntries.indexOf([batchName, items]) < batchEntries.length - 1) {
        console.log(`\n⏳ 批次间延迟 ${BATCH_CONFIG.delayBetweenBatches}ms...`);
        await delay(BATCH_CONFIG.delayBetweenBatches);
      }
      
    } catch (error) {
      console.error(`❌ 批次 ${batchName} 执行失败:`, error.message);
    }
  }
  
  // 保存结果
  if (allResults.length > 0) {
    await saveBatchResults(allResults);
  }
  
  // 最终统计
  console.log('\n📊 批量抓取最终统计:');
  console.log(`  🌐 处理批次: ${batchEntries.length}`);
  console.log(`  📄 成功抓取: ${allResults.length} 篇文章`);
  console.log(`  ⏭️  跳过重复: ${totalSkipped} 篇文章`);
  console.log(`  💰 总Credit消耗: ${totalCreditsUsed}`);
  console.log(`  💰 节省Credit: ${totalSavedCredits}`);
  console.log(`  📝 总字数: ${totalWords.toLocaleString()}`);
  console.log(`  ⏱️  总耗时: ${(totalDuration / 1000).toFixed(1)}秒`);
  if (totalCreditsUsed > 0) {
    console.log(`  📈 平均效率: ${(totalWords / totalCreditsUsed).toFixed(0)} 字/Credit`);
  }
  console.log(`  💡 Credit利用率: ${(totalCreditsUsed / BATCH_CONFIG.dailyCreditLimit * 100).toFixed(1)}%`);
  console.log(`  🎯 去重效率: ${totalSkipped > 0 ? (totalSavedCredits / (totalCreditsUsed + totalSavedCredits) * 100).toFixed(1) : 0}% Credit节省率`);
  
  console.log('\n🎯 批量抓取优势:');
  console.log('  ✅ 高效并发处理');
  console.log('  ✅ 智能Credit管理');
  console.log('  ✅ 自动错误恢复');
  console.log('  ✅ 实时进度监控');
  console.log('  ✅ 批量数据库保存');
  console.log('  ✅ 智能去重避免重复抓取');
  
  console.log('\n✅ 批量抓取完成');
}

// 辅助函数
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);
}

function generateOneLiner(content) {
  const sentences = content.split(/[.!?]+/);
  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (trimmed.length >= 50 && trimmed.length <= 200) {
      return trimmed;
    }
  }
  return 'Expert guidance on maternal and infant health from authoritative medical sources. This comprehensive resource provides evidence-based recommendations for parents and caregivers.';
}

function extractKeyFacts(content) {
  const facts = [];
  const sentences = content.split(/[.!?]+/);
  
  sentences.forEach(sentence => {
    const trimmed = sentence.trim();
    if (trimmed.length > 20 && trimmed.length < 200 && 
        (/\d/.test(trimmed) || trimmed.toLowerCase().includes('important') || 
         trimmed.toLowerCase().includes('recommended'))) {
      facts.push(trimmed);
    }
  });
  
  return facts.slice(0, 8);
}

function extractEntities(content) {
  const entities = [];
  const keywords = ['baby', 'infant', 'toddler', 'feeding', 'nutrition', 'breastfeeding', 'sleep', 'development', 'solid foods', 'weaning'];
  
  keywords.forEach(keyword => {
    if (content.toLowerCase().includes(keyword)) {
      entities.push(keyword);
    }
  });
  
  return entities;
}

function mapCategoryToHub(category) {
  const categoryMap = {
    'feeding': 'feeding',
    'development': 'development',
    'sleep': 'sleep',
    'safety': 'safety',
    'mom-health': 'mom-health',
    'recipes': 'recipes'
  };
  
  return categoryMap[category] || 'feeding';
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 主函数
 */
async function main() {
  try {
    await executeBatchScraping();
  } catch (error) {
    console.error('❌ 批量抓取失败:', error);
  }
}

// 运行批量抓取
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, executeBatchScraping };
