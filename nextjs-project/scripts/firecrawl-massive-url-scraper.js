#!/usr/bin/env node

/**
 * Firecrawl大规模URL爬虫
 * 使用预定义的权威网站URL列表进行大规模抓取
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

// 大规模抓取配置
const MASSIVE_CONFIG = {
  maxArticles: 500,              // 最大文章数
  maxConcurrent: 1,              // 最大并发数（避免超时）
  delayBetweenRequests: 4000,    // 请求间隔(ms)
  dailyCreditLimit: 1000,        // 每日Credit限制
  minContentLength: 300,         // 最小内容长度
  batchSize: 20                  // 批次大小
};

// 权威网站的大量URL列表
const MASSIVE_URL_LISTS = {
  'AAP_Comprehensive': [
    // 喂养和营养
    'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Starting-Solid-Foods.aspx',
    'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Sample-One-Day-Menu-for-an-8-to-12-Month-Old.aspx',
    'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/How-to-Safely-Prepare-Formula-with-Water.aspx',
    'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Vegetarian-Babies.aspx',
    'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Introducing-Solid-Foods-to-Your-Baby.aspx',
    'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/How-to-Safely-Prepare-Formula-with-Water.aspx',
    'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Vegetarian-Babies.aspx',
    
    // 母乳喂养
    'https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/Working-Together-Breastfeeding-and-Solid-Foods.aspx',
    'https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/How-to-Tell-if-Your-Baby-is-Getting-Enough-Milk.aspx',
    'https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/Common-Breastfeeding-Challenges.aspx',
    'https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/How-Long-Should-a-Mother-Breastfeed.aspx',
    'https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/How-to-Breastfeed.aspx',
    'https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/When-Your-Baby-Wont-Breastfeed.aspx',
    
    // 睡眠
    'https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/How-to-Get-Your-Baby-to-Sleep.aspx',
    'https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/Getting-Your-Baby-to-Sleep.aspx',
    'https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/Healthy-Sleep-Habits-How-Many-Hours-Does-Your-Child-Need.aspx',
    'https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/Sleep-Problems-in-Children.aspx',
    'https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/Sleep-Position-Why-Back-is-Best.aspx',
    
    // 发展
    'https://www.healthychildren.org/English/ages-stages/baby/Pages/Your-Babys-Development-Birth-to-One-Year.aspx',
    'https://www.healthychildren.org/English/ages-stages/baby/Pages/Developmental-Milestones-1-Year-Olds.aspx',
    'https://www.healthychildren.org/English/ages-stages/baby/Pages/Developmental-Milestones-2-Year-Olds.aspx',
    'https://www.healthychildren.org/English/ages-stages/baby/Pages/Developmental-Milestones-3-Year-Olds.aspx',
    'https://www.healthychildren.org/English/ages-stages/baby/Pages/Movement-and-Coordination.aspx',
    'https://www.healthychildren.org/English/ages-stages/baby/Pages/Language-Development-1-Year-Olds.aspx',
    
    // 安全
    'https://www.healthychildren.org/English/ages-stages/baby/Pages/Infant-Safety-Tips.aspx',
    'https://www.healthychildren.org/English/ages-stages/baby/Pages/Car-Safety-Seats.aspx',
    'https://www.healthychildren.org/English/ages-stages/baby/Pages/Preventing-Suffocation.aspx',
    'https://www.healthychildren.org/English/ages-stages/baby/Pages/Water-Safety.aspx',
    'https://www.healthychildren.org/English/ages-stages/baby/Pages/Choking-Prevention.aspx',
    'https://www.healthychildren.org/English/ages-stages/baby/Pages/Fire-Safety.aspx'
  ],

  'NHS_Comprehensive': [
    // 喂养和断奶
    'https://www.nhs.uk/conditions/baby/weaning-and-feeding/',
    'https://www.nhs.uk/conditions/baby/breastfeeding-and-bottle-feeding/',
    'https://www.nhs.uk/conditions/baby/feeding-your-baby/first-solid-foods/',
    'https://www.nhs.uk/conditions/baby/feeding-your-baby/bottle-feeding/',
    'https://www.nhs.uk/conditions/baby/feeding-your-baby/breastfeeding/',
    'https://www.nhs.uk/conditions/baby/feeding-your-baby/feeding-problems/',
    'https://www.nhs.uk/conditions/baby/feeding-your-baby/healthy-eating/',
    
    // 婴儿发展
    'https://www.nhs.uk/conditions/baby/babys-development/',
    'https://www.nhs.uk/conditions/baby/caring-for-a-newborn-baby/',
    'https://www.nhs.uk/conditions/baby/baby-development-3-to-6-months/',
    'https://www.nhs.uk/conditions/baby/baby-development-6-to-12-months/',
    'https://www.nhs.uk/conditions/baby/baby-development-12-to-18-months/',
    'https://www.nhs.uk/conditions/baby/baby-development-18-to-24-months/',
    
    // 安全和健康
    'https://www.nhs.uk/conditions/baby/sudden-infant-death-syndrome-sids/',
    'https://www.nhs.uk/conditions/baby/immunisation/',
    'https://www.nhs.uk/conditions/baby/health-problems/',
    'https://www.nhs.uk/conditions/baby/sleeping/',
    'https://www.nhs.uk/conditions/baby/teething/',
    'https://www.nhs.uk/conditions/baby/crying/',
    'https://www.nhs.uk/conditions/baby/colic/'
  ],

  'CDC_Comprehensive': [
    // 婴儿和幼儿营养
    'https://www.cdc.gov/nutrition/infantandtoddlernutrition/foods-and-drinks/when-to-introduce-solid-foods.html',
    'https://www.cdc.gov/nutrition/infantandtoddlernutrition/foods-and-drinks/foods-to-avoid.html',
    'https://www.cdc.gov/nutrition/infantandtoddlernutrition/breastfeeding/breastfeeding-benefits.html',
    'https://www.cdc.gov/nutrition/infantandtoddlernutrition/mealtime/finger-foods.html',
    'https://www.cdc.gov/nutrition/infantandtoddlernutrition/foods-and-drinks/cows-milk.html',
    'https://www.cdc.gov/nutrition/infantandtoddlernutrition/foods-and-drinks/juice.html',
    'https://www.cdc.gov/nutrition/infantandtoddlernutrition/breastfeeding/breastfeeding-troubleshooting.html',
    
    // 儿童发展
    'https://www.cdc.gov/ncbddd/childdevelopment/early-child-development.html',
    'https://www.cdc.gov/ncbddd/childdevelopment/positiveparenting/',
    'https://www.cdc.gov/ncbddd/childdevelopment/facts.html',
    'https://www.cdc.gov/ncbddd/childdevelopment/early-brain-development.html',
    'https://www.cdc.gov/ncbddd/childdevelopment/screening.html',
    
    // 安全
    'https://www.cdc.gov/safechild/',
    'https://www.cdc.gov/safechild/falls/index.html',
    'https://www.cdc.gov/safechild/poisoning/index.html',
    'https://www.cdc.gov/safechild/burns/index.html',
    'https://www.cdc.gov/safechild/drowning/index.html'
  ],

  'Mayo_Clinic_Comprehensive': [
    // 婴儿发展
    'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/infant-development/art-20047080',
    'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/healthy-baby/art-20046982',
    'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/infant-development/art-20047080',
    'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/child-development/art-20045155',
    
    // 母乳喂养
    'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/breast-feeding/art-20047138',
    'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/breast-feeding/art-20047138',
    'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/breast-feeding/art-20047138',
    
    // 婴儿护理
    'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/infant-care/art-20045202',
    'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/baby-basics/art-20046006',
    'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/baby-care/art-20046006'
  ],

  'WebMD_Comprehensive': [
    // 婴儿发展
    'https://www.webmd.com/parenting/baby/baby-development-2-months',
    'https://www.webmd.com/parenting/baby/baby-development-4-months',
    'https://www.webmd.com/parenting/baby/baby-development-6-months',
    'https://www.webmd.com/parenting/baby/baby-development-9-months',
    'https://www.webmd.com/parenting/baby/baby-development-12-months',
    
    // 喂养指南
    'https://www.webmd.com/parenting/baby/baby-feeding-guide',
    'https://www.webmd.com/parenting/baby/baby-food-guide',
    'https://www.webmd.com/parenting/baby/baby-nutrition-guide',
    'https://www.webmd.com/parenting/baby/baby-feeding-schedule',
    
    // 睡眠训练
    'https://www.webmd.com/parenting/baby/sleep-training',
    'https://www.webmd.com/parenting/baby/baby-sleep-guide',
    'https://www.webmd.com/parenting/baby/baby-sleep-problems',
    
    // 婴儿健康
    'https://www.webmd.com/parenting/baby/baby-health-guide',
    'https://www.webmd.com/parenting/baby/baby-illness-guide',
    'https://www.webmd.com/parenting/baby/baby-vaccination-schedule'
  ],

  'WHO_Comprehensive': [
    'https://www.who.int/news-room/fact-sheets/detail/infant-and-young-child-feeding',
    'https://www.who.int/news-room/fact-sheets/detail/breastfeeding',
    'https://www.who.int/news-room/fact-sheets/detail/children-reducing-mortality',
    'https://www.who.int/news-room/fact-sheets/detail/child-malnutrition',
    'https://www.who.int/news-room/fact-sheets/detail/immunization-coverage'
  ],

  'UNICEF_Comprehensive': [
    'https://www.unicef.org/parenting/food-nutrition/breastfeeding',
    'https://www.unicef.org/parenting/food-nutrition/complementary-feeding',
    'https://www.unicef.org/parenting/child-development',
    'https://www.unicef.org/parenting/early-childhood-development',
    'https://www.unicef.org/parenting/health'
  ],

  'Zero_to_Three_Comprehensive': [
    'https://www.zerotothree.org/resource/finding-the-help-that-babies-need/',
    'https://www.zerotothree.org/resource/developmental-milestones/',
    'https://www.zerotothree.org/resource/early-development/',
    'https://www.zerotothree.org/resource/brain-development/',
    'https://www.zerotothree.org/resource/early-learning/',
    'https://www.zerotothree.org/resource/social-emotional-development/',
    'https://www.zerotothree.org/resource/language-development/',
    'https://www.zerotothree.org/resource/motor-development/'
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
      timeout: 120000
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
      .select('id, title, body_md')
      .not('body_md', 'is', null)
      .limit(1000);
    
    if (error) {
      console.error('检查现有文章失败:', error);
      return new Set();
    }
    
    console.log(`📋 发现 ${data?.length || 0} 篇已存在的文章`);
    
    // 创建URL指纹集合
    const existingUrls = new Set();
    if (data) {
      data.forEach(article => {
        const urlMatches = article.body_md.match(/https?:\/\/[^\s\)]+/g);
        if (urlMatches) {
          urlMatches.forEach(url => {
            existingUrls.add(url);
          });
        }
      });
    }
    
    return existingUrls;
  } catch (error) {
    console.error('检查现有文章失败:', error);
    return new Set();
  }
}

/**
 * 智能去重过滤
 */
async function smartDeduplication(allUrls) {
  const existingUrls = await checkExistingArticles();
  
  console.log('\n🧠 大规模智能去重过滤:');
  console.log(`  📥 待检查URL数量: ${allUrls.length}`);
  
  const filteredUrls = [];
  const skippedStats = {
    exact: 0,
    total: 0
  };
  
  for (const url of allUrls) {
    if (existingUrls.has(url)) {
      console.log(`    ⏭️  跳过已存在: ${url.substring(0, 60)}...`);
      skippedStats.exact++;
      skippedStats.total++;
    } else {
      filteredUrls.push(url);
    }
  }
  
  const savedCredits = skippedStats.total * 2;
  
  console.log(`\n📊 去重统计:`);
  console.log(`  🆕 需要抓取: ${filteredUrls.length}`);
  console.log(`  ⏭️  完全重复: ${skippedStats.exact}`);
  console.log(`  💰 节省Credit: ${savedCredits}`);
  
  return {
    filteredUrls,
    skippedStats,
    savedCredits
  };
}

/**
 * 抓取单个页面
 */
async function scrapePage(url, source) {
  try {
    console.log(`    🔄 抓取: ${url.substring(0, 60)}...`);
    
    const result = await makeFirecrawlRequest('/scrape', {
      url: url,
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

    // 验证内容质量
    if (wordCount < MASSIVE_CONFIG.minContentLength) {
      throw new Error(`内容太短 (${wordCount} < ${MASSIVE_CONFIG.minContentLength})`);
    }

    console.log(`    ✅ 成功: ${wordCount} 字符`);

    return {
      success: true,
      url: url,
      title: title,
      content: content,
      wordCount: wordCount,
      source: source,
      creditsUsed: 2,
      extractedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error(`    ❌ 失败: ${error.message}`);
    
    return {
      success: false,
      url: url,
      error: error.message,
      creditsUsed: 0
    };
  }
}

/**
 * 批量抓取URL
 */
async function scrapeBatch(urls, source) {
  console.log(`\n🚀 开始抓取 ${source}: ${urls.length} 个URL`);
  
  const results = [];
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    console.log(`\n${i + 1}/${urls.length} 处理: ${url.substring(0, 60)}...`);
    
    const result = await scrapePage(url, source);
    results.push(result);
    
    if (result.success) {
      successCount++;
    } else {
      failCount++;
    }
    
    // 请求间延迟
    if (i < urls.length - 1) {
      console.log(`    ⏳ 等待 ${MASSIVE_CONFIG.delayBetweenRequests}ms...`);
      await delay(MASSIVE_CONFIG.delayBetweenRequests);
    }
    
    // 每10个页面输出进度
    if ((i + 1) % 10 === 0) {
      console.log(`\n📊 进度统计: ${i + 1}/${urls.length} (${successCount}成功, ${failCount}失败)`);
    }
  }
  
  console.log(`\n📊 ${source} 抓取完成:`);
  console.log(`  ✅ 成功: ${successCount}/${urls.length}`);
  console.log(`  ❌ 失败: ${failCount}`);
  
  return results;
}

/**
 * 保存结果到数据库
 */
async function saveResults(results) {
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
        hub: mapCategoryToHub(result.title, result.content),
        lang: 'en',
        title: result.title,
        one_liner: generateOneLiner(result.content),
        key_facts: extractKeyFacts(result.content),
        body_md: result.content,
        entities: extractEntities(result.content),
        age_range: extractAgeRange(result.content),
        region: mapRegion(result.source),
        last_reviewed: new Date().toISOString().split('T')[0],
        reviewed_by: 'Firecrawl Massive URL Bot',
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
 * 执行大规模URL抓取
 */
async function executeMassiveURLScraping() {
  console.log('🚀 Firecrawl大规模URL爬虫');
  console.log('='.repeat(60));
  console.log(`🔑 API密钥: ${FIRECRAWL_API_KEY.substring(0, 10)}...`);
  console.log(`📊 配置: 最大${MASSIVE_CONFIG.maxArticles}篇, 延迟${MASSIVE_CONFIG.delayBetweenRequests}ms`);
  console.log(`💰 每日Credit限制: ${MASSIVE_CONFIG.dailyCreditLimit}`);
  
  // 收集所有URL
  const allUrls = [];
  Object.entries(MASSIVE_URL_LISTS).forEach(([source, urls]) => {
    urls.forEach(url => {
      allUrls.push({ url, source });
    });
  });
  
  console.log(`\n📋 权威网站URL统计:`);
  Object.entries(MASSIVE_URL_LISTS).forEach(([source, urls]) => {
    console.log(`  ${source}: ${urls.length} 个URL`);
  });
  console.log(`  📊 总计: ${allUrls.length} 个URL`);
  
  // 智能去重
  const { filteredUrls, skippedStats, savedCredits } = await smartDeduplication(allUrls.map(item => item.url));
  
  // 限制抓取数量
  const limitedUrls = filteredUrls.slice(0, MASSIVE_CONFIG.maxArticles);
  if (limitedUrls.length < filteredUrls.length) {
    console.log(`\n⚠️  限制抓取数量: ${filteredUrls.length} -> ${limitedUrls.length}`);
  }
  
  // 按来源分组
  const groupedBySource = {};
  limitedUrls.forEach(url => {
    const item = allUrls.find(u => u.url === url);
    if (item) {
      if (!groupedBySource[item.source]) {
        groupedBySource[item.source] = [];
      }
      groupedBySource[item.source].push(url);
    }
  });
  
  const allResults = [];
  let totalCreditsUsed = 0;
  
  // 按来源抓取
  for (const [source, urls] of Object.entries(groupedBySource)) {
    console.log(`\n📦 处理来源: ${source}`);
    
    // 分批处理
    for (let i = 0; i < urls.length; i += MASSIVE_CONFIG.batchSize) {
      const batch = urls.slice(i, i + MASSIVE_CONFIG.batchSize);
      console.log(`\n  📦 批次 ${Math.floor(i/MASSIVE_CONFIG.batchSize) + 1}: ${batch.length} 个URL`);
      
      const batchResults = await scrapeBatch(batch, source);
      allResults.push(...batchResults);
      
      const batchCredits = batchResults.reduce((sum, r) => sum + r.creditsUsed, 0);
      totalCreditsUsed += batchCredits;
      
      console.log(`  💰 批次Credit消耗: ${batchCredits}`);
      console.log(`  💰 累计Credit消耗: ${totalCreditsUsed}`);
      
      // 检查Credit限制
      if (totalCreditsUsed >= MASSIVE_CONFIG.dailyCreditLimit) {
        console.log(`\n⚠️  已达到每日Credit限制 (${MASSIVE_CONFIG.dailyCreditLimit})`);
        break;
      }
      
      // 批次间延迟
      if (i + MASSIVE_CONFIG.batchSize < urls.length) {
        console.log(`\n  ⏳ 批次间延迟 5秒...`);
        await delay(5000);
      }
    }
    
    // 来源间延迟
    if (Object.keys(groupedBySource).indexOf(source) < Object.keys(groupedBySource).length - 1) {
      console.log(`\n⏳ 来源间延迟 10秒...`);
      await delay(10000);
    }
  }
  
  // 保存结果
  if (allResults.length > 0) {
    await saveResults(allResults);
  }
  
  // 最终统计
  const successfulScrapes = allResults.filter(r => r.success);
  const totalWords = successfulScrapes.reduce((sum, r) => sum + r.wordCount, 0);
  
  console.log('\n📊 大规模URL抓取最终统计:');
  console.log(`  🌐 处理来源: ${Object.keys(groupedBySource).length}`);
  console.log(`  📄 发现URL: ${allUrls.length}`);
  console.log(`  ⏭️  去重跳过: ${skippedStats.total}`);
  console.log(`  📄 成功抓取: ${successfulScrapes.length} 篇文章`);
  console.log(`  💰 实际Credit消耗: ${totalCreditsUsed}`);
  console.log(`  💰 去重节省Credit: ${savedCredits}`);
  console.log(`  📝 总字数: ${totalWords.toLocaleString()}`);
  if (totalCreditsUsed > 0) {
    console.log(`  📈 平均效率: ${(totalWords / totalCreditsUsed).toFixed(0)} 字/Credit`);
  }
  console.log(`  💡 Credit利用率: ${(totalCreditsUsed / MASSIVE_CONFIG.dailyCreditLimit * 100).toFixed(1)}%`);
  console.log(`  🎯 去重节省率: ${savedCredits > 0 ? (savedCredits / (totalCreditsUsed + savedCredits) * 100).toFixed(1) : 0}%`);
  
  console.log('\n🎯 大规模抓取优势:');
  console.log('  ✅ 大量权威URL覆盖');
  console.log('  ✅ 智能去重避免重复');
  console.log('  ✅ 高效Credit管理');
  console.log('  ✅ 批量处理优化');
  console.log('  ✅ 实时进度监控');
  console.log('  ✅ 权威来源验证');
  
  console.log('\n✅ 大规模URL抓取完成');
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

function mapCategoryToHub(title, content) {
  const text = (title + ' ' + content).toLowerCase();
  
  if (text.includes('feeding') || text.includes('nutrition') || text.includes('food') || text.includes('breastfeeding')) {
    return 'feeding';
  } else if (text.includes('sleep') || text.includes('bedtime') || text.includes('nap')) {
    return 'sleep';
  } else if (text.includes('development') || text.includes('milestone') || text.includes('growth')) {
    return 'development';
  } else if (text.includes('safety') || text.includes('safe') || text.includes('prevent')) {
    return 'safety';
  } else if (text.includes('mom') || text.includes('mother') || text.includes('parent')) {
    return 'mom-health';
  } else {
    return 'feeding'; // 默认
  }
}

function mapRegion(source) {
  if (source.includes('AAP') || source.includes('CDC') || source.includes('Mayo') || source.includes('WebMD')) return 'US';
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
    await executeMassiveURLScraping();
  } catch (error) {
    console.error('❌ 大规模URL抓取失败:', error);
  }
}

// 运行大规模URL抓取
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, executeMassiveURLScraping };
