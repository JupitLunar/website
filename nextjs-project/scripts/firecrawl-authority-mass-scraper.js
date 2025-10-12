#!/usr/bin/env node

/**
 * Firecrawl权威网站大规模爬虫
 * 智能去重 + 最多200篇权威母婴内容抓取
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

// 大规模爬虫配置
const MASS_CONFIG = {
  maxArticles: 200,              // 最大文章数
  maxConcurrent: 2,              // 最大并发数（降低避免超时）
  delayBetweenRequests: 3000,    // 请求间隔(ms)
  dailyCreditLimit: 400,         // 每日Credit限制
  retryAttempts: 2,              // 重试次数
  timeout: 90000,                // 超时时间(ms)
  minContentLength: 800          // 最小内容长度
};

// 权威网站URL集合 - 按权威性排序
const AUTHORITY_WEBSITES = {
  // Tier 1: 最高权威 (医学机构)
  'AAP_Authority': [
    {
      url: 'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Starting-Solid-Foods.aspx',
      priority: 1,
      expectedCredits: 2,
      category: 'feeding',
      source: 'American Academy of Pediatrics'
    },
    {
      url: 'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Sample-One-Day-Menu-for-an-8-to-12-Month-Old.aspx',
      priority: 1,
      expectedCredits: 2,
      category: 'feeding',
      source: 'American Academy of Pediatrics'
    },
    {
      url: 'https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/Working-Together-Breastfeeding-and-Solid-Foods.aspx',
      priority: 1,
      expectedCredits: 2,
      category: 'feeding',
      source: 'American Academy of Pediatrics'
    },
    {
      url: 'https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/How-to-Get-Your-Baby-to-Sleep.aspx',
      priority: 1,
      expectedCredits: 2,
      category: 'sleep',
      source: 'American Academy of Pediatrics'
    },
    {
      url: 'https://www.healthychildren.org/English/ages-stages/baby/Pages/Your-Babys-Development-Birth-to-One-Year.aspx',
      priority: 1,
      expectedCredits: 2,
      category: 'development',
      source: 'American Academy of Pediatrics'
    },
    {
      url: 'https://www.healthychildren.org/English/ages-stages/baby/Pages/Infant-Safety-Tips.aspx',
      priority: 1,
      expectedCredits: 2,
      category: 'safety',
      source: 'American Academy of Pediatrics'
    },
    {
      url: 'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/How-to-Safely-Prepare-Formula-with-Water.aspx',
      priority: 1,
      expectedCredits: 2,
      category: 'feeding',
      source: 'American Academy of Pediatrics'
    },
    {
      url: 'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Vegetarian-Babies.aspx',
      priority: 2,
      expectedCredits: 2,
      category: 'feeding',
      source: 'American Academy of Pediatrics'
    }
  ],

  // Tier 1: 英国权威
  'NHS_Authority': [
    {
      url: 'https://www.nhs.uk/conditions/baby/weaning-and-feeding/',
      priority: 1,
      expectedCredits: 2,
      category: 'feeding',
      source: 'NHS UK'
    },
    {
      url: 'https://www.nhs.uk/conditions/baby/breastfeeding-and-bottle-feeding/',
      priority: 1,
      expectedCredits: 2,
      category: 'feeding',
      source: 'NHS UK'
    },
    {
      url: 'https://www.nhs.uk/conditions/baby/babys-development/',
      priority: 1,
      expectedCredits: 2,
      category: 'development',
      source: 'NHS UK'
    },
    {
      url: 'https://www.nhs.uk/conditions/baby/caring-for-a-newborn-baby/',
      priority: 1,
      expectedCredits: 2,
      category: 'development',
      source: 'NHS UK'
    },
    {
      url: 'https://www.nhs.uk/conditions/baby/sudden-infant-death-syndrome-sids/',
      priority: 1,
      expectedCredits: 2,
      category: 'safety',
      source: 'NHS UK'
    }
  ],

  // Tier 1: CDC权威
  'CDC_Authority': [
    {
      url: 'https://www.cdc.gov/nutrition/infantandtoddlernutrition/foods-and-drinks/when-to-introduce-solid-foods.html',
      priority: 1,
      expectedCredits: 2,
      category: 'feeding',
      source: 'CDC'
    },
    {
      url: 'https://www.cdc.gov/nutrition/infantandtoddlernutrition/foods-and-drinks/foods-to-avoid.html',
      priority: 1,
      expectedCredits: 2,
      category: 'safety',
      source: 'CDC'
    },
    {
      url: 'https://www.cdc.gov/nutrition/infantandtoddlernutrition/breastfeeding/breastfeeding-benefits.html',
      priority: 1,
      expectedCredits: 2,
      category: 'feeding',
      source: 'CDC'
    },
    {
      url: 'https://www.cdc.gov/nutrition/infantandtoddlernutrition/mealtime/finger-foods.html',
      priority: 1,
      expectedCredits: 2,
      category: 'feeding',
      source: 'CDC'
    }
  ],

  // Tier 2: 高质量医学资源
  'Mayo_Clinic': [
    {
      url: 'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/infant-development/art-20047080',
      priority: 2,
      expectedCredits: 2,
      category: 'development',
      source: 'Mayo Clinic'
    },
    {
      url: 'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/healthy-baby/art-20046982',
      priority: 2,
      expectedCredits: 2,
      category: 'development',
      source: 'Mayo Clinic'
    },
    {
      url: 'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/breast-feeding/art-20047138',
      priority: 2,
      expectedCredits: 2,
      category: 'feeding',
      source: 'Mayo Clinic'
    }
  ],

  'WebMD': [
    {
      url: 'https://www.webmd.com/parenting/baby/baby-development-2-months',
      priority: 2,
      expectedCredits: 2,
      category: 'development',
      source: 'WebMD'
    },
    {
      url: 'https://www.webmd.com/parenting/baby/baby-feeding-guide',
      priority: 2,
      expectedCredits: 2,
      category: 'feeding',
      source: 'WebMD'
    },
    {
      url: 'https://www.webmd.com/parenting/baby/sleep-training',
      priority: 2,
      expectedCredits: 2,
      category: 'sleep',
      source: 'WebMD'
    }
  ],

  // Tier 3: 补充资源
  'WHO': [
    {
      url: 'https://www.who.int/news-room/fact-sheets/detail/infant-and-young-child-feeding',
      priority: 1,
      expectedCredits: 3,
      category: 'feeding',
      source: 'WHO'
    }
  ],

  'UNICEF': [
    {
      url: 'https://www.unicef.org/parenting/food-nutrition/breastfeeding',
      priority: 2,
      expectedCredits: 2,
      category: 'feeding',
      source: 'UNICEF'
    }
  ],

  'Zero_to_Three': [
    {
      url: 'https://www.zerotothree.org/resource/finding-the-help-that-babies-need/',
      priority: 2,
      expectedCredits: 2,
      category: 'development',
      source: 'Zero to Three'
    },
    {
      url: 'https://www.zerotothree.org/resource/developmental-milestones/',
      priority: 2,
      expectedCredits: 2,
      category: 'development',
      source: 'Zero to Three'
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
      timeout: MASS_CONFIG.timeout
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
 * 检查数据库中已存在的文章
 */
async function checkExistingArticles() {
  try {
    console.log('🔍 检查数据库中已存在的文章...');
    
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, body_md, created_at')
      .not('body_md', 'is', null)
      .order('created_at', { ascending: false })
      .limit(500);
    
    if (error) {
      console.error('检查现有文章失败:', error);
      return [];
    }
    
    console.log(`📋 发现 ${data?.length || 0} 篇已存在的文章`);
    
    // 创建URL指纹集合用于快速查找
    const urlFingerprints = new Set();
    if (data) {
      data.forEach(article => {
        // 从内容中提取URL
        const urlMatches = article.body_md.match(/https?:\/\/[^\s\)]+/g);
        if (urlMatches) {
          urlMatches.forEach(url => {
            urlFingerprints.add(url);
            // 也添加域名指纹
            try {
              const domain = new URL(url).hostname;
              urlFingerprints.add(domain);
            } catch (e) {
              // 忽略无效URL
            }
          });
        }
      });
    }
    
    return urlFingerprints;
  } catch (error) {
    console.error('检查现有文章失败:', error);
    return new Set();
  }
}

/**
 * 智能去重过滤
 */
async function smartDeduplication(allItems) {
  const existingFingerprints = await checkExistingArticles();
  
  console.log('\n🧠 大规模智能去重过滤:');
  console.log(`  📥 原始URL数量: ${allItems.length}`);
  
  const filteredItems = [];
  const skippedStats = {
    exact: 0,
    domain: 0,
    total: 0
  };
  
  for (const item of allItems) {
    let shouldSkip = false;
    let skipReason = '';
    
    // 检查完全匹配
    if (existingFingerprints.has(item.url)) {
      shouldSkip = true;
      skipReason = 'exact_match';
      skippedStats.exact++;
    } else {
      // 检查域名匹配
      try {
        const domain = new URL(item.url).hostname;
        if (existingFingerprints.has(domain)) {
          // 进一步检查路径相似性
          const pathname = new URL(item.url).pathname;
          let domainMatchCount = 0;
          
          for (const fingerprint of existingFingerprints) {
            if (fingerprint.includes(domain) && fingerprint.includes(pathname.split('/')[1])) {
              domainMatchCount++;
            }
          }
          
          if (domainMatchCount > 2) { // 如果同一域名下有多个相似路径
            shouldSkip = true;
            skipReason = 'domain_match';
            skippedStats.domain++;
          }
        }
      } catch (e) {
        // 忽略无效URL
      }
    }
    
    if (shouldSkip) {
      console.log(`    ⏭️  跳过 (${skipReason}): ${item.url.substring(0, 60)}...`);
      skippedStats.total++;
    } else {
      filteredItems.push(item);
    }
  }
  
  const savedCredits = skippedStats.total * 2;
  
  console.log(`\n📊 去重统计:`);
  console.log(`  🆕 需要抓取: ${filteredItems.length}`);
  console.log(`  ⏭️  完全重复: ${skippedStats.exact}`);
  console.log(`  ⏭️  域名重复: ${skippedStats.domain}`);
  console.log(`  ⏭️  总跳过: ${skippedStats.total}`);
  console.log(`  💰 节省Credit: ${savedCredits}`);
  
  return {
    filteredItems,
    skippedStats,
    savedCredits
  };
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
      waitFor: 2000
    });

    if (!result.data || !result.data.markdown) {
      throw new Error('未获取到内容');
    }

    const content = result.data.markdown;
    const title = result.data.metadata?.title || 'Untitled';
    const wordCount = content.length;
    const duration = Date.now() - startTime;

    // 验证内容质量
    if (wordCount < MASS_CONFIG.minContentLength) {
      throw new Error(`内容太短 (${wordCount} < ${MASS_CONFIG.minContentLength})`);
    }

    console.log(`    ✅ 成功: ${wordCount} 字符 (${duration}ms)`);

    return {
      success: true,
      url: item.url,
      title: title,
      content: content,
      wordCount: wordCount,
      category: item.category,
      source: item.source,
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
 * 并发抓取一批URL
 */
async function scrapeBatch(batchName, items) {
  console.log(`\n🚀 开始批次: ${batchName}`);
  console.log(`📊 计划抓取 ${items.length} 个URL`);
  console.log(`💰 预计Credit消耗: ${items.reduce((sum, item) => sum + item.expectedCredits, 0)} credits`);
  
  const results = [];
  
  // 顺序处理避免并发限制
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    console.log(`\n  ${i + 1}/${items.length} 处理: ${item.url.substring(0, 60)}...`);
    
    const result = await scrapePage(item, batchName);
    results.push(result);
    
    // 请求间延迟
    if (i < items.length - 1) {
      console.log(`    ⏳ 等待 ${MASS_CONFIG.delayBetweenRequests}ms...`);
      await delay(MASS_CONFIG.delayBetweenRequests);
    }
  }
  
  // 统计结果
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const totalCredits = successful.reduce((sum, r) => sum + r.creditsUsed, 0);
  const totalWords = successful.reduce((sum, r) => sum + r.wordCount, 0);
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  
  console.log(`\n📊 ${batchName} 完成:`);
  console.log(`  ✅ 成功: ${successful.length}/${items.length}`);
  console.log(`  ❌ 失败: ${failed.length}`);
  console.log(`  💰 Credit消耗: ${totalCredits}`);
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
    totalDuration
  };
}

/**
 * 保存抓取结果到数据库
 */
async function saveBatchResults(results) {
  console.log(`\n💾 保存 ${results.length} 篇文章到数据库...`);
  
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
        age_range: extractAgeRange(result.content),
        region: mapRegion(result.source),
        last_reviewed: new Date().toISOString().split('T')[0],
        reviewed_by: 'Firecrawl Authority Mass Bot',
        license: `Source: ${result.source}`,
        status: 'draft'
      };
      
      // 检查是否已存在
      const { data: existing } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', articleData.slug)
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
 * 执行大规模抓取
 */
async function executeMassScraping() {
  console.log('🚀 Firecrawl权威网站大规模爬虫');
  console.log('='.repeat(60));
  console.log(`🔑 API密钥: ${FIRECRAWL_API_KEY.substring(0, 10)}...`);
  console.log(`📊 配置: 最大${MASS_CONFIG.maxArticles}篇, 并发${MASS_CONFIG.maxConcurrent}, 延迟${MASS_CONFIG.delayBetweenRequests}ms`);
  console.log(`💰 每日Credit限制: ${MASS_CONFIG.dailyCreditLimit}`);
  
  // 收集所有URL
  const allItems = [];
  Object.entries(AUTHORITY_WEBSITES).forEach(([batchName, items]) => {
    items.forEach(item => {
      allItems.push({ ...item, batchName });
    });
  });
  
  console.log(`\n📋 权威网站统计:`);
  Object.entries(AUTHORITY_WEBSITES).forEach(([batchName, items]) => {
    console.log(`  ${batchName}: ${items.length} 个URL`);
  });
  console.log(`  📊 总计: ${allItems.length} 个URL`);
  
  // 按优先级排序
  const sortedItems = allItems.sort((a, b) => a.priority - b.priority);
  
  // 智能去重
  const { filteredItems, skippedStats, savedCredits } = await smartDeduplication(sortedItems);
  
  // 限制文章数量
  const limitedItems = filteredItems.slice(0, MASS_CONFIG.maxArticles);
  if (limitedItems.length < filteredItems.length) {
    console.log(`\n⚠️  限制文章数量: ${filteredItems.length} -> ${limitedItems.length}`);
  }
  
  const allResults = [];
  let totalCreditsUsed = 0;
  let totalWords = 0;
  let totalDuration = 0;
  
  // 按批次处理
  const batchGroups = {};
  limitedItems.forEach(item => {
    if (!batchGroups[item.batchName]) {
      batchGroups[item.batchName] = [];
    }
    batchGroups[item.batchName].push(item);
  });
  
  for (const [batchName, items] of Object.entries(batchGroups)) {
    // 检查Credit限制
    if (totalCreditsUsed >= MASS_CONFIG.dailyCreditLimit) {
      console.log(`\n⚠️  已达到每日Credit限制 (${MASS_CONFIG.dailyCreditLimit}), 停止抓取`);
      break;
    }
    
    const batchCredits = items.reduce((sum, item) => sum + item.expectedCredits, 0);
    
    if (totalCreditsUsed + batchCredits > MASS_CONFIG.dailyCreditLimit) {
      console.log(`\n⚠️  批次 ${batchName} 会超出Credit限制，跳过`);
      continue;
    }
    
    try {
      const batchResult = await scrapeBatch(batchName, items);
      allResults.push(...batchResult.successful);
      
      totalCreditsUsed += batchResult.totalCredits;
      totalWords += batchResult.totalWords;
      totalDuration += batchResult.totalDuration;
      
    } catch (error) {
      console.error(`❌ 批次 ${batchName} 执行失败:`, error.message);
    }
  }
  
  // 保存结果
  if (allResults.length > 0) {
    await saveBatchResults(allResults);
  }
  
  // 最终统计
  console.log('\n📊 大规模抓取最终统计:');
  console.log(`  🌐 处理批次: ${Object.keys(batchGroups).length}`);
  console.log(`  📄 成功抓取: ${allResults.length} 篇文章`);
  console.log(`  ⏭️  智能去重跳过: ${skippedStats.total} 篇文章`);
  console.log(`  💰 实际Credit消耗: ${totalCreditsUsed}`);
  console.log(`  💰 智能去重节省: ${savedCredits} credits`);
  console.log(`  📝 总字数: ${totalWords.toLocaleString()}`);
  console.log(`  ⏱️  总耗时: ${(totalDuration / 1000 / 60).toFixed(1)}分钟`);
  if (totalCreditsUsed > 0) {
    console.log(`  📈 平均效率: ${(totalWords / totalCreditsUsed).toFixed(0)} 字/Credit`);
  }
  console.log(`  💡 Credit利用率: ${(totalCreditsUsed / MASS_CONFIG.dailyCreditLimit * 100).toFixed(1)}%`);
  console.log(`  🎯 去重节省率: ${savedCredits > 0 ? (savedCredits / (totalCreditsUsed + savedCredits) * 100).toFixed(1) : 0}%`);
  
  console.log('\n🎯 大规模抓取优势:');
  console.log('  ✅ 权威来源验证');
  console.log('  ✅ 大规模智能去重');
  console.log('  ✅ 高效Credit管理');
  console.log('  ✅ 质量内容过滤');
  console.log('  ✅ 批量数据库保存');
  console.log('  ✅ 实时进度监控');
  
  console.log('\n✅ 大规模权威抓取完成');
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

function extractAgeRange(content) {
  const agePatterns = [
    /(\d+)\s*-\s*(\d+)\s*(month|year|months|years)/i,
    /(\d+)\s+to\s+(\d+)\s*(month|year|months|years)/i,
    /(\d+)\s*-\s*(\d+)\s*(month|year|months|years)\s*old/i
  ];
  
  for (const pattern of agePatterns) {
    const match = content.match(pattern);
    if (match) {
      return `${match[1]}-${match[2]} ${match[3]}`;
    }
  }
  
  return '0-24 months';
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

function mapRegion(source) {
  if (source.includes('AAP') || source.includes('CDC')) return 'US';
  if (source.includes('NHS')) return 'Global';
  return 'Global';
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 主函数
 */
async function main() {
  try {
    await executeMassScraping();
  } catch (error) {
    console.error('❌ 大规模抓取失败:', error);
  }
}

// 运行大规模抓取
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, executeMassScraping };
