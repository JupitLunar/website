#!/usr/bin/env node

/**
 * Firecrawl彻底母婴内容搜索器
 * 使用搜索功能发现所有parenting和baby相关的文章
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

// 彻底搜索配置
const EXHAUSTIVE_CONFIG = {
  maxArticles: 1000,             // 最大文章数
  maxConcurrent: 1,              // 最大并发数
  delayBetweenSearches: 6000,    // 搜索间延迟(ms)
  delayBetweenScrapes: 3000,     // 抓取间延迟(ms)
  dailyCreditLimit: 2000,        // 每日Credit限制
  minContentLength: 500,         // 最小内容长度
  resultsPerSearch: 20           // 每次搜索返回结果数
};

// 彻底的母婴相关搜索词组合
const EXHAUSTIVE_SEARCH_TERMS = {
  // 基础婴儿护理
  'baby_care_basics': [
    'baby care newborn',
    'newborn baby care',
    'baby care tips',
    'infant care guide',
    'baby health care',
    'baby safety tips'
  ],
  
  // 喂养和营养
  'feeding_nutrition': [
    'baby feeding guide',
    'infant nutrition',
    'baby food introduction',
    'breastfeeding tips',
    'baby bottle feeding',
    'baby solid foods',
    'baby weaning guide',
    'baby feeding schedule',
    'baby nutrition facts',
    'baby feeding problems'
  ],
  
  // 睡眠和作息
  'sleep_development': [
    'baby sleep training',
    'infant sleep patterns',
    'baby sleep problems',
    'newborn sleep schedule',
    'baby bedtime routine',
    'baby nap schedule',
    'baby sleep safety',
    'baby sleep regression'
  ],
  
  // 发展里程碑
  'development_milestones': [
    'baby development milestones',
    'infant development stages',
    'baby growth stages',
    'baby motor development',
    'baby cognitive development',
    'baby language development',
    'baby social development',
    'baby emotional development'
  ],
  
  // 安全和健康
  'safety_health': [
    'baby safety tips',
    'infant safety guidelines',
    'baby injury prevention',
    'baby health checkups',
    'baby vaccination schedule',
    'baby illness symptoms',
    'baby emergency care',
    'baby first aid'
  ],
  
  // 育儿指导
  'parenting_guidance': [
    'new parent guide',
    'first time parent tips',
    'baby parenting advice',
    'infant parenting guide',
    'baby behavior management',
    'baby discipline tips',
    'baby bonding activities',
    'baby play activities'
  ],
  
  // 特殊需求
  'special_needs': [
    'premature baby care',
    'baby colic treatment',
    'baby teething tips',
    'baby allergies guide',
    'baby eczema treatment',
    'baby reflux management',
    'baby constipation relief'
  ]
};

// 权威网站域名过滤
const AUTHORITY_DOMAINS = [
  'healthychildren.org',      // AAP
  'nhs.uk',                   // NHS
  'cdc.gov',                  // CDC
  'mayoclinic.org',           // Mayo Clinic
  'webmd.com',                // WebMD
  'who.int',                  // WHO
  'unicef.org',               // UNICEF
  'zerotothree.org',          // Zero to Three
  'kidshealth.org',           // KidsHealth
  'parents.com',              // Parents.com
  'babycenter.com',           // BabyCenter
  'whattoexpect.com',         // What to Expect
  'verywellfamily.com',       // Verywell Family
  'healthline.com',           // Healthline
  'medicalnewstoday.com',     // Medical News Today
  'parenting.com',            // Parenting.com
  'thebump.com',              // The Bump
  'parents.com',              // Parents Magazine
  'marchofdimes.org',         // March of Dimes
  'aap.org'                   // AAP official
];

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
 * 搜索母婴相关内容
 */
async function searchParentingContent(category, searchTerms) {
  console.log(`\n🔍 搜索类别: ${category}`);
  console.log(`📋 搜索词数量: ${searchTerms.length}`);
  
  const allSearchResults = [];
  
  for (let i = 0; i < searchTerms.length; i++) {
    const searchTerm = searchTerms[i];
    console.log(`  🔎 ${i + 1}/${searchTerms.length} 搜索: "${searchTerm}"`);
    
    try {
      const result = await makeFirecrawlRequest('/search', {
        query: searchTerm,
        limit: EXHAUSTIVE_CONFIG.resultsPerSearch,
        sources: [{ type: 'web' }]
      });

      if (result.data && result.data.length > 0) {
        console.log(`    ✅ 发现 ${result.data.length} 个结果`);
        
        // 过滤权威网站结果
        const filteredResults = result.data.filter(item => {
          if (!item.url) return false;
          
          try {
            const domain = new URL(item.url).hostname;
            const isAuthoritySite = AUTHORITY_DOMAINS.some(authDomain => 
              domain.includes(authDomain) || domain.includes(authDomain.replace('.', ''))
            );
            
            // 确保内容相关
            const title = (item.title || '').toLowerCase();
            const content = (item.content || '').toLowerCase();
            const isRelevant = title.includes('baby') || title.includes('infant') || 
                             title.includes('child') || title.includes('parent') ||
                             content.includes('baby') || content.includes('infant');
            
            return isAuthoritySite && isRelevant;
          } catch (e) {
            return false;
          }
        });
        
        console.log(`    🎯 权威网站结果: ${filteredResults.length}`);
        
        // 增强结果信息
        const enhancedResults = filteredResults.map(item => ({
          ...item,
          category,
          searchTerm,
          priority: 1,
          expectedCredits: 2
        }));
        
        allSearchResults.push(...enhancedResults);
        
      } else {
        console.log(`    ⚠️  未发现结果`);
      }
      
      // 搜索间延迟
      if (i < searchTerms.length - 1) {
        await delay(EXHAUSTIVE_CONFIG.delayBetweenSearches);
      }
      
    } catch (error) {
      console.error(`    ❌ 搜索失败: ${error.message}`);
    }
  }
  
  // 去重
  const uniqueResults = [];
  const seenUrls = new Set();
  
  allSearchResults.forEach(result => {
    if (!seenUrls.has(result.url)) {
      seenUrls.add(result.url);
      uniqueResults.push(result);
    }
  });
  
  console.log(`\n📊 ${category} 搜索结果:`);
  console.log(`  🔍 总搜索结果: ${allSearchResults.length}`);
  console.log(`  🆔 去重后结果: ${uniqueResults.length}`);
  console.log(`  💰 预计Credit消耗: ${uniqueResults.length * 2}`);
  
  return uniqueResults;
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
      .limit(2000);
    
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
  
  console.log('\n🧠 彻底智能去重过滤:');
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
    if (wordCount < EXHAUSTIVE_CONFIG.minContentLength) {
      throw new Error(`内容太短 (${wordCount} < ${EXHAUSTIVE_CONFIG.minContentLength})`);
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
    
    // 抓取间延迟
    if (i < urls.length - 1) {
      console.log(`    ⏳ 等待 ${EXHAUSTIVE_CONFIG.delayBetweenScrapes}ms...`);
      await delay(EXHAUSTIVE_CONFIG.delayBetweenScrapes);
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
        reviewed_by: 'Firecrawl Exhaustive Search Bot',
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
 * 执行彻底的母婴内容搜索和抓取
 */
async function executeExhaustiveParentingSearch() {
  console.log('🔍 Firecrawl彻底母婴内容搜索器');
  console.log('='.repeat(70));
  console.log(`🔑 API密钥: ${FIRECRAWL_API_KEY.substring(0, 10)}...`);
  console.log(`📊 配置: 最大${EXHAUSTIVE_CONFIG.maxArticles}篇, 延迟${EXHAUSTIVE_CONFIG.delayBetweenSearches}ms`);
  console.log(`💰 每日Credit限制: ${EXHAUSTIVE_CONFIG.dailyCreditLimit}`);
  console.log(`🎯 权威网站: ${AUTHORITY_DOMAINS.length} 个`);
  
  const allSearchResults = [];
  let totalCreditsUsed = 0;
  
  // 按类别搜索
  for (const [category, searchTerms] of Object.entries(EXHAUSTIVE_SEARCH_TERMS)) {
    try {
      const categoryResults = await searchParentingContent(category, searchTerms);
      allSearchResults.push(...categoryResults);
      
      console.log(`  📊 累计发现: ${allSearchResults.length} 个结果`);
      
      // 类别间延迟
      await delay(EXHAUSTIVE_CONFIG.delayBetweenSearches * 2);
      
    } catch (error) {
      console.error(`❌ 搜索类别 ${category} 失败:`, error.message);
    }
  }
  
  console.log(`\n📊 搜索完成统计:`);
  console.log(`  🔍 搜索类别: ${Object.keys(EXHAUSTIVE_SEARCH_TERMS).length}`);
  console.log(`  📄 总发现结果: ${allSearchResults.length}`);
  console.log(`  💰 预计Credit消耗: ${allSearchResults.length * 2}`);
  
  // 智能去重
  const { filteredUrls, skippedStats, savedCredits } = await smartDeduplication(allSearchResults.map(r => r.url));
  
  // 限制抓取数量
  const limitedUrls = filteredUrls.slice(0, EXHAUSTIVE_CONFIG.maxArticles);
  if (limitedUrls.length < filteredUrls.length) {
    console.log(`\n⚠️  限制抓取数量: ${filteredUrls.length} -> ${limitedUrls.length}`);
  }
  
  // 按来源分组抓取
  const groupedBySource = {};
  limitedUrls.forEach(url => {
    const result = allSearchResults.find(r => r.url === url);
    if (result) {
      if (!groupedBySource[result.category]) {
        groupedBySource[result.category] = [];
      }
      groupedBySource[result.category].push(url);
    }
  });
  
  const allResults = [];
  
  // 按来源抓取
  for (const [source, urls] of Object.entries(groupedBySource)) {
    console.log(`\n📦 处理来源: ${source}`);
    
    const sourceResults = await scrapeBatch(urls, source);
    allResults.push(...sourceResults);
    
    const sourceCredits = sourceResults.reduce((sum, r) => sum + r.creditsUsed, 0);
    totalCreditsUsed += sourceCredits;
    
    console.log(`  💰 来源Credit消耗: ${sourceCredits}`);
    console.log(`  💰 累计Credit消耗: ${totalCreditsUsed}`);
    
    // 检查Credit限制
    if (totalCreditsUsed >= EXHAUSTIVE_CONFIG.dailyCreditLimit) {
      console.log(`\n⚠️  已达到每日Credit限制 (${EXHAUSTIVE_CONFIG.dailyCreditLimit})`);
      break;
    }
    
    // 来源间延迟
    if (Object.keys(groupedBySource).indexOf(source) < Object.keys(groupedBySource).length - 1) {
      console.log(`\n⏳ 来源间延迟 15秒...`);
      await delay(15000);
    }
  }
  
  // 保存结果
  if (allResults.length > 0) {
    await saveResults(allResults);
  }
  
  // 最终统计
  const successfulScrapes = allResults.filter(r => r.success);
  const totalWords = successfulScrapes.reduce((sum, r) => sum + r.wordCount, 0);
  
  console.log('\n📊 彻底母婴搜索最终统计:');
  console.log(`  🔍 搜索类别: ${Object.keys(EXHAUSTIVE_SEARCH_TERMS).length}`);
  console.log(`  📄 发现结果: ${allSearchResults.length}`);
  console.log(`  ⏭️  去重跳过: ${skippedStats.total}`);
  console.log(`  📄 成功抓取: ${successfulScrapes.length} 篇文章`);
  console.log(`  💰 实际Credit消耗: ${totalCreditsUsed}`);
  console.log(`  💰 去重节省Credit: ${savedCredits}`);
  console.log(`  📝 总字数: ${totalWords.toLocaleString()}`);
  if (totalCreditsUsed > 0) {
    console.log(`  📈 平均效率: ${(totalWords / totalCreditsUsed).toFixed(0)} 字/Credit`);
  }
  console.log(`  💡 Credit利用率: ${(totalCreditsUsed / EXHAUSTIVE_CONFIG.dailyCreditLimit * 100).toFixed(1)}%`);
  console.log(`  🎯 去重节省率: ${savedCredits > 0 ? (savedCredits / (totalCreditsUsed + savedCredits) * 100).toFixed(1) : 0}%`);
  
  console.log('\n🎯 彻底搜索优势:');
  console.log('  ✅ 全面关键词覆盖');
  console.log('  ✅ 权威网站过滤');
  console.log('  ✅ 智能去重避免重复');
  console.log('  ✅ 分类内容组织');
  console.log('  ✅ 高效Credit管理');
  console.log('  ✅ 实时进度监控');
  
  console.log('\n✅ 彻底母婴内容搜索完成');
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
  const keywords = ['baby', 'infant', 'toddler', 'feeding', 'nutrition', 'breastfeeding', 'sleep', 'development', 'solid foods', 'weaning', 'parenting', 'child'];
  
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
    await executeExhaustiveParentingSearch();
  } catch (error) {
    console.error('❌ 彻底母婴内容搜索失败:', error);
  }
}

// 运行彻底搜索
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, executeExhaustiveParentingSearch };
