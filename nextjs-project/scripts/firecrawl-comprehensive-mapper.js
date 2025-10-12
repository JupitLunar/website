#!/usr/bin/env node

/**
 * Firecrawl全面网站映射器
 * 使用map功能发现每个权威网站的完整文章列表
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

// 全面映射配置
const MAPPING_CONFIG = {
  maxPagesPerSite: 50,           // 每个网站最大页面数
  maxTotalPages: 500,            // 总最大页面数
  delayBetweenMaps: 5000,        // 映射间延迟(ms)
  delayBetweenScrapes: 2000,     // 抓取间延迟(ms)
  dailyCreditLimit: 800,         // 每日Credit限制
  minContentLength: 500          // 最小内容长度
};

// 权威网站基础URL - 准备进行全面映射
const AUTHORITY_SITES = {
  'AAP': {
    baseUrl: 'https://www.healthychildren.org',
    searchTerms: ['baby', 'infant', 'feeding', 'nutrition', 'sleep', 'development', 'safety'],
    priority: 1,
    expectedPages: 100
  },
  'NHS': {
    baseUrl: 'https://www.nhs.uk',
    searchTerms: ['baby', 'infant', 'child', 'feeding', 'weaning', 'development'],
    priority: 1,
    expectedPages: 80
  },
  'CDC': {
    baseUrl: 'https://www.cdc.gov',
    searchTerms: ['infant', 'toddler', 'nutrition', 'feeding', 'child'],
    priority: 1,
    expectedPages: 60
  },
  'Mayo_Clinic': {
    baseUrl: 'https://www.mayoclinic.org',
    searchTerms: ['baby', 'infant', 'toddler', 'child'],
    priority: 2,
    expectedPages: 40
  },
  'WebMD': {
    baseUrl: 'https://www.webmd.com',
    searchTerms: ['baby', 'infant', 'toddler', 'parenting'],
    priority: 2,
    expectedPages: 50
  },
  'WHO': {
    baseUrl: 'https://www.who.int',
    searchTerms: ['infant', 'child', 'feeding', 'nutrition'],
    priority: 1,
    expectedPages: 30
  },
  'UNICEF': {
    baseUrl: 'https://www.unicef.org',
    searchTerms: ['child', 'infant', 'nutrition', 'feeding'],
    priority: 2,
    expectedPages: 25
  },
  'Zero_to_Three': {
    baseUrl: 'https://www.zerotothree.org',
    searchTerms: ['baby', 'infant', 'toddler', 'development'],
    priority: 2,
    expectedPages: 35
  }
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
      timeout: 120000 // 2分钟超时
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
 * 映射网站发现页面
 */
async function mapWebsite(siteName, siteConfig) {
  console.log(`\n🗺️ 映射网站: ${siteName} (${siteConfig.baseUrl})`);
  console.log(`📊 预期发现: ${siteConfig.expectedPages} 个页面`);
  
  const allDiscoveredPages = [];
  
  try {
    // 为每个搜索词进行映射
    for (const searchTerm of siteConfig.searchTerms.slice(0, 3)) { // 限制搜索词数量
      console.log(`  🔍 搜索关键词: "${searchTerm}"`);
      
      try {
        const result = await makeFirecrawlRequest('/map', {
          url: siteConfig.baseUrl,
          search: searchTerm,
          limit: Math.min(20, MAPPING_CONFIG.maxPagesPerSite), // 每个搜索词最多20页
          allowExternalLinks: false,
          allowSubdomains: false
        });

        if (result.data && result.data.length > 0) {
          console.log(`    ✅ 发现 ${result.data.length} 个页面`);
          
          // 过滤和增强页面信息
          const filteredPages = result.data
            .filter(page => {
              // 过滤条件
              const url = page.url || '';
              const title = page.title || '';
              
              // 必须包含相关关键词
              const relevantKeywords = ['baby', 'infant', 'toddler', 'child', 'feeding', 'nutrition', 'sleep', 'development', 'safety'];
              const hasRelevantContent = relevantKeywords.some(keyword => 
                url.toLowerCase().includes(keyword) || title.toLowerCase().includes(keyword)
              );
              
              // 排除无关页面
              const excludePatterns = ['login', 'register', 'contact', 'about', 'terms', 'privacy', 'newsletter', 'shop', 'buy'];
              const isExcluded = excludePatterns.some(pattern => 
                url.toLowerCase().includes(pattern) || title.toLowerCase().includes(pattern)
              );
              
              return hasRelevantContent && !isExcluded;
            })
            .map(page => ({
              ...page,
              siteName,
              searchTerm,
              priority: siteConfig.priority,
              expectedCredits: 2
            }));
          
          allDiscoveredPages.push(...filteredPages);
          console.log(`    📄 过滤后有效页面: ${filteredPages.length}`);
          
        } else {
          console.log(`    ⚠️  未发现页面`);
        }
        
        // 搜索间延迟
        await delay(2000);
        
      } catch (error) {
        console.error(`    ❌ 搜索失败: ${error.message}`);
      }
    }
    
    // 去重和排序
    const uniquePages = [];
    const seenUrls = new Set();
    
    allDiscoveredPages.forEach(page => {
      if (!seenUrls.has(page.url)) {
        seenUrls.add(page.url);
        uniquePages.push(page);
      }
    });
    
    // 按优先级排序
    uniquePages.sort((a, b) => a.priority - b.priority);
    
    console.log(`\n📊 ${siteName} 映射结果:`);
    console.log(`  🔍 总发现页面: ${allDiscoveredPages.length}`);
    console.log(`  🆔 去重后页面: ${uniquePages.length}`);
    console.log(`  💰 预计Credit消耗: ${uniquePages.length * 2}`);
    
    return uniquePages.slice(0, MAPPING_CONFIG.maxPagesPerSite);
    
  } catch (error) {
    console.error(`❌ 映射 ${siteName} 失败:`, error.message);
    return [];
  }
}

/**
 * 智能去重过滤
 */
async function smartDeduplication(allPages) {
  console.log('\n🧠 全面智能去重过滤:');
  console.log(`  📥 待检查页面数量: ${allPages.length}`);
  
  try {
    // 检查数据库中已存在的文章
    const { data: existingArticles } = await supabase
      .from('articles')
      .select('id, title, body_md')
      .not('body_md', 'is', null)
      .limit(1000);
    
    console.log(`  📋 数据库中已有文章: ${existingArticles?.length || 0} 篇`);
    
    // 创建URL指纹集合
    const existingUrls = new Set();
    const existingDomains = new Set();
    
    if (existingArticles) {
      existingArticles.forEach(article => {
        // 从内容中提取URL
        const urlMatches = article.body_md.match(/https?:\/\/[^\s\)]+/g);
        if (urlMatches) {
          urlMatches.forEach(url => {
            existingUrls.add(url);
            try {
              const domain = new URL(url).hostname;
              existingDomains.add(domain);
            } catch (e) {
              // 忽略无效URL
            }
          });
        }
      });
    }
    
    // 过滤重复页面
    const filteredPages = [];
    const skippedStats = {
      exact: 0,
      domain: 0,
      total: 0
    };
    
    for (const page of allPages) {
      let shouldSkip = false;
      let skipReason = '';
      
      // 检查完全匹配
      if (existingUrls.has(page.url)) {
        shouldSkip = true;
        skipReason = 'exact_match';
        skippedStats.exact++;
      } else {
        // 检查域名匹配
        try {
          const domain = new URL(page.url).hostname;
          if (existingDomains.has(domain)) {
            // 进一步检查路径相似性
            const pathname = new URL(page.url).pathname;
            let domainMatchCount = 0;
            
            for (const existingUrl of existingUrls) {
              if (existingUrl.includes(domain) && existingUrl.includes(pathname.split('/')[1])) {
                domainMatchCount++;
              }
            }
            
            if (domainMatchCount > 1) { // 如果同一域名下有相似路径
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
        console.log(`    ⏭️  跳过 (${skipReason}): ${page.url.substring(0, 60)}...`);
        skippedStats.total++;
      } else {
        filteredPages.push(page);
      }
    }
    
    const savedCredits = skippedStats.total * 2;
    
    console.log(`\n📊 全面去重统计:`);
    console.log(`  🆕 需要抓取: ${filteredPages.length}`);
    console.log(`  ⏭️  完全重复: ${skippedStats.exact}`);
    console.log(`  ⏭️  域名重复: ${skippedStats.domain}`);
    console.log(`  ⏭️  总跳过: ${skippedStats.total}`);
    console.log(`  💰 节省Credit: ${savedCredits}`);
    
    return {
      filteredPages,
      skippedStats,
      savedCredits
    };
    
  } catch (error) {
    console.error('❌ 去重检查失败:', error.message);
    return {
      filteredPages: allPages,
      skippedStats: { exact: 0, domain: 0, total: 0 },
      savedCredits: 0
    };
  }
}

/**
 * 抓取单个页面
 */
async function scrapePage(page) {
  try {
    console.log(`    🔄 抓取: ${page.url.substring(0, 60)}...`);
    
    const result = await makeFirecrawlRequest('/scrape', {
      url: page.url,
      formats: ['markdown'],
      onlyMainContent: true,
      removeBase64Images: true,
      waitFor: 1000
    });

    if (!result.data || !result.data.markdown) {
      throw new Error('未获取到内容');
    }

    const content = result.data.markdown;
    const title = result.data.metadata?.title || page.title || 'Untitled';
    const wordCount = content.length;

    // 验证内容质量
    if (wordCount < MAPPING_CONFIG.minContentLength) {
      throw new Error(`内容太短 (${wordCount} < ${MAPPING_CONFIG.minContentLength})`);
    }

    console.log(`    ✅ 成功: ${wordCount} 字符`);

    return {
      success: true,
      url: page.url,
      title: title,
      content: content,
      wordCount: wordCount,
      siteName: page.siteName,
      searchTerm: page.searchTerm,
      priority: page.priority,
      creditsUsed: page.expectedCredits,
      extractedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error(`    ❌ 失败: ${error.message}`);
    
    return {
      success: false,
      url: page.url,
      error: error.message,
      creditsUsed: 0
    };
  }
}

/**
 * 批量抓取页面
 */
async function scrapePages(pages) {
  if (pages.length === 0) {
    console.log('\n✅ 没有需要抓取的页面');
    return [];
  }
  
  console.log(`\n🚀 开始批量抓取 ${pages.length} 个页面:`);
  
  const results = [];
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    console.log(`\n${i + 1}/${pages.length} 处理: ${page.url.substring(0, 60)}...`);
    
    const result = await scrapePage(page);
    results.push(result);
    
    if (result.success) {
      successCount++;
    } else {
      failCount++;
    }
    
    // 抓取间延迟
    if (i < pages.length - 1) {
      console.log(`    ⏳ 等待 ${MAPPING_CONFIG.delayBetweenScrapes}ms...`);
      await delay(MAPPING_CONFIG.delayBetweenScrapes);
    }
    
    // 每10个页面输出进度
    if ((i + 1) % 10 === 0) {
      console.log(`\n📊 进度统计: ${i + 1}/${pages.length} (${successCount}成功, ${failCount}失败)`);
    }
  }
  
  console.log(`\n📊 抓取完成:`);
  console.log(`  ✅ 成功: ${successCount}/${pages.length}`);
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
        region: mapRegion(result.siteName),
        last_reviewed: new Date().toISOString().split('T')[0],
        reviewed_by: 'Firecrawl Comprehensive Mapper',
        license: `Source: ${result.siteName}`,
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
 * 执行全面映射和抓取
 */
async function executeComprehensiveMapping() {
  console.log('🗺️ Firecrawl全面网站映射器');
  console.log('='.repeat(60));
  console.log(`🔑 API密钥: ${FIRECRAWL_API_KEY.substring(0, 10)}...`);
  console.log(`📊 配置: 每站最大${MAPPING_CONFIG.maxPagesPerSite}页, 总最大${MAPPING_CONFIG.maxTotalPages}页`);
  console.log(`💰 每日Credit限制: ${MAPPING_CONFIG.dailyCreditLimit}`);
  
  const allDiscoveredPages = [];
  
  // 按优先级排序网站
  const sortedSites = Object.entries(AUTHORITY_SITES)
    .sort(([,a], [,b]) => a.priority - b.priority);
  
  console.log('\n📋 权威网站列表:');
  sortedSites.forEach(([name, config]) => {
    console.log(`  ${name}: ${config.baseUrl} (优先级: ${config.priority}, 预期: ${config.expectedPages}页)`);
  });
  
  // 映射所有网站
  for (const [siteName, siteConfig] of sortedSites) {
    try {
      const discoveredPages = await mapWebsite(siteName, siteConfig);
      allDiscoveredPages.push(...discoveredPages);
      
      console.log(`  📊 累计发现: ${allDiscoveredPages.length} 个页面`);
      
      // 映射间延迟
      await delay(MAPPING_CONFIG.delayBetweenMaps);
      
      // 检查总数限制
      if (allDiscoveredPages.length >= MAPPING_CONFIG.maxTotalPages) {
        console.log(`\n⚠️  已达到总页面数限制 (${MAPPING_CONFIG.maxTotalPages})`);
        break;
      }
      
    } catch (error) {
      console.error(`❌ 映射 ${siteName} 失败:`, error.message);
    }
  }
  
  console.log(`\n📊 映射完成统计:`);
  console.log(`  🌐 处理网站: ${sortedSites.length}`);
  console.log(`  📄 总发现页面: ${allDiscoveredPages.length}`);
  console.log(`  💰 预计Credit消耗: ${allDiscoveredPages.length * 2}`);
  
  // 智能去重
  const { filteredPages, skippedStats, savedCredits } = await smartDeduplication(allDiscoveredPages);
  
  // 限制抓取数量
  const limitedPages = filteredPages.slice(0, MAPPING_CONFIG.maxTotalPages);
  if (limitedPages.length < filteredPages.length) {
    console.log(`\n⚠️  限制抓取数量: ${filteredPages.length} -> ${limitedPages.length}`);
  }
  
  // 批量抓取
  const scrapeResults = await scrapePages(limitedPages);
  
  // 保存结果
  if (scrapeResults.length > 0) {
    await saveResults(scrapeResults);
  }
  
  // 最终统计
  const successfulScrapes = scrapeResults.filter(r => r.success);
  const totalCreditsUsed = successfulScrapes.reduce((sum, r) => sum + r.creditsUsed, 0);
  const totalWords = successfulScrapes.reduce((sum, r) => sum + r.wordCount, 0);
  
  console.log('\n📊 全面映射最终统计:');
  console.log(`  🌐 映射网站: ${sortedSites.length}`);
  console.log(`  📄 发现页面: ${allDiscoveredPages.length}`);
  console.log(`  ⏭️  去重跳过: ${skippedStats.total}`);
  console.log(`  📄 成功抓取: ${successfulScrapes.length} 篇文章`);
  console.log(`  💰 实际Credit消耗: ${totalCreditsUsed}`);
  console.log(`  💰 去重节省Credit: ${savedCredits}`);
  console.log(`  📝 总字数: ${totalWords.toLocaleString()}`);
  if (totalCreditsUsed > 0) {
    console.log(`  📈 平均效率: ${(totalWords / totalCreditsUsed).toFixed(0)} 字/Credit`);
  }
  console.log(`  💡 Credit利用率: ${(totalCreditsUsed / MAPPING_CONFIG.dailyCreditLimit * 100).toFixed(1)}%`);
  console.log(`  🎯 去重节省率: ${savedCredits > 0 ? (savedCredits / (totalCreditsUsed + savedCredits) * 100).toFixed(1) : 0}%`);
  
  console.log('\n🎯 全面映射优势:');
  console.log('  ✅ 完整网站内容发现');
  console.log('  ✅ 智能关键词搜索');
  console.log('  ✅ 大规模去重过滤');
  console.log('  ✅ 权威来源验证');
  console.log('  ✅ 高效Credit管理');
  console.log('  ✅ 批量内容抓取');
  
  console.log('\n✅ 全面映射完成');
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

function mapRegion(siteName) {
  if (siteName.includes('AAP') || siteName.includes('CDC') || siteName.includes('Mayo') || siteName.includes('WebMD')) return 'US';
  if (siteName.includes('NHS')) return 'Global';
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
    await executeComprehensiveMapping();
  } catch (error) {
    console.error('❌ 全面映射失败:', error);
  }
}

// 运行全面映射
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, executeComprehensiveMapping };
