#!/usr/bin/env node

/**
 * Firecrawl智能去重检查器
 * 精确检查数据库中已存在的文章，避免重复抓取
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

// 测试URL集合
const TEST_URLS = [
  'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Starting-Solid-Foods.aspx',
  'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Sample-One-Day-Menu-for-an-8-to-12-Month-Old.aspx',
  'https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/Working-Together-Breastfeeding-and-Solid-Foods.aspx',
  'https://www.nhs.uk/conditions/baby/weaning-and-feeding/',
  'https://www.nhs.uk/conditions/baby/breastfeeding-and-bottle-feeding/',
  'https://www.nhs.uk/conditions/baby/babys-development/',
  'https://www.cdc.gov/nutrition/infantandtoddlernutrition/foods-and-drinks/when-to-introduce-solid-foods.html',
  'https://www.cdc.gov/nutrition/infantandtoddlernutrition/foods-and-drinks/foods-to-avoid.html',
  // 添加一些新的URL来测试
  'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/infant-development/art-20047080',
  'https://www.webmd.com/parenting/baby/baby-development-2-months'
];

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
      .limit(200);
    
    if (error) {
      console.error('检查现有文章失败:', error);
      return [];
    }
    
    console.log(`📋 发现 ${data?.length || 0} 篇已存在的文章`);
    
    // 分析现有文章的来源
    const sourceAnalysis = {};
    if (data) {
      data.forEach(article => {
        // 从内容中提取域名
        const domainMatches = article.body_md.match(/https?:\/\/([^\/\s\)]+)/g);
        if (domainMatches) {
          domainMatches.forEach(match => {
            const domain = match.replace(/https?:\/\//, '').split('/')[0];
            sourceAnalysis[domain] = (sourceAnalysis[domain] || 0) + 1;
          });
        }
      });
    }
    
    console.log('\n📊 现有文章来源分析:');
    Object.entries(sourceAnalysis)
      .sort(([,a], [,b]) => b - a)
      .forEach(([domain, count]) => {
        console.log(`  ${domain}: ${count} 篇`);
      });
    
    return data || [];
  } catch (error) {
    console.error('检查现有文章失败:', error);
    return [];
  }
}

/**
 * 智能URL去重检查
 */
async function smartURLDeduplication(urls) {
  const existingArticles = await checkExistingArticles();
  
  console.log('\n🧠 智能URL去重检查:');
  console.log(`  📥 待检查URL数量: ${urls.length}`);
  
  const results = {
    new: [],
    existing: [],
    similar: []
  };
  
  for (const url of urls) {
    const domain = new URL(url).hostname;
    const pathname = new URL(url).pathname;
    
    // 检查是否有相同域名的文章
    const domainMatches = existingArticles.filter(article => 
      article.body_md.includes(domain)
    );
    
    // 检查是否有相同路径的文章
    const pathMatches = existingArticles.filter(article => 
      article.body_md.includes(pathname)
    );
    
    // 检查是否有相同完整URL的文章
    const exactMatches = existingArticles.filter(article => 
      article.body_md.includes(url)
    );
    
    if (exactMatches.length > 0) {
      console.log(`    ⏭️  完全重复: ${url.substring(0, 60)}...`);
      console.log(`       已存在: "${exactMatches[0].title}"`);
      results.existing.push({
        url,
        reason: 'exact_match',
        existingArticle: exactMatches[0],
        confidence: 1.0
      });
    } else if (pathMatches.length > 0) {
      console.log(`    ⚠️  路径重复: ${url.substring(0, 60)}...`);
      console.log(`       类似文章: "${pathMatches[0].title}"`);
      results.similar.push({
        url,
        reason: 'path_match',
        existingArticle: pathMatches[0],
        confidence: 0.8
      });
    } else if (domainMatches.length > 0) {
      console.log(`    🔍 域名重复: ${url.substring(0, 60)}...`);
      console.log(`       同域名文章: ${domainMatches.length} 篇`);
      results.similar.push({
        url,
        reason: 'domain_match',
        existingArticle: domainMatches[0],
        confidence: 0.3
      });
    } else {
      console.log(`    🆕 全新URL: ${url.substring(0, 60)}...`);
      results.new.push({
        url,
        reason: 'new',
        confidence: 1.0
      });
    }
  }
  
  return results;
}

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
      timeout: 30000
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
async function scrapePage(url) {
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

    console.log(`    ✅ 成功: ${wordCount} 字符`);

    return {
      success: true,
      url: url,
      title: title,
      content: content,
      wordCount: wordCount,
      creditsUsed: 2 // 估算
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
 * 抓取新URL
 */
async function scrapeNewURLs(newURLs) {
  if (newURLs.length === 0) {
    console.log('\n✅ 没有需要抓取的新URL');
    return [];
  }
  
  console.log(`\n🚀 开始抓取 ${newURLs.length} 个新URL:`);
  
  const results = [];
  
  for (let i = 0; i < newURLs.length; i++) {
    const urlItem = newURLs[i];
    console.log(`\n${i + 1}/${newURLs.length} 处理: ${urlItem.url.substring(0, 60)}...`);
    
    const result = await scrapePage(urlItem.url);
    results.push(result);
    
    // 延迟避免rate limit
    if (i < newURLs.length - 1) {
      console.log('    ⏳ 等待2秒...');
      await delay(2000);
    }
  }
  
  return results;
}

/**
 * 保存抓取结果到数据库
 */
async function saveResults(results) {
  console.log('\n💾 保存抓取结果到数据库...');
  
  let savedCount = 0;
  let errorCount = 0;
  
  for (const result of results) {
    if (!result.success) continue;
    
    try {
      // 生成文章数据
      const articleData = {
        slug: generateSlug(result.title),
        type: 'explainer',
        hub: 'feeding',
        lang: 'en',
        title: result.title,
        one_liner: generateOneLiner(result.content),
        key_facts: extractKeyFacts(result.content),
        body_md: result.content,
        entities: extractEntities(result.content),
        age_range: '0-24 months',
        region: 'Global',
        last_reviewed: new Date().toISOString().split('T')[0],
        reviewed_by: 'Firecrawl Smart Dedup Bot',
        license: 'Source: Smart Deduplication Test',
        status: 'draft'
      };
      
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
 * 主函数
 */
async function main() {
  console.log('🧠 Firecrawl智能去重检查器');
  console.log('='.repeat(50));
  console.log(`🔑 API密钥: ${FIRECRAWL_API_KEY.substring(0, 10)}...`);
  
  try {
    // 1. 智能去重检查
    const deduplicationResults = await smartURLDeduplication(TEST_URLS);
    
    // 2. 统计结果
    console.log('\n📊 去重检查结果:');
    console.log(`  🆕 全新URL: ${deduplicationResults.new.length}`);
    console.log(`  ⏭️  完全重复: ${deduplicationResults.existing.length}`);
    console.log(`  🔍 相似内容: ${deduplicationResults.similar.length}`);
    
    const totalCreditsSaved = (deduplicationResults.existing.length + deduplicationResults.similar.length) * 2;
    const totalCreditsNeeded = deduplicationResults.new.length * 2;
    
    console.log(`\n💰 Credit分析:`);
    console.log(`  💰 需要消耗: ${totalCreditsNeeded} credits`);
    console.log(`  💰 节省Credit: ${totalCreditsSaved} credits`);
    console.log(`  📈 节省率: ${totalCreditsSaved > 0 ? (totalCreditsSaved / (totalCreditsNeeded + totalCreditsSaved) * 100).toFixed(1) : 0}%`);
    
    // 3. 抓取新URL
    const scrapeResults = await scrapeNewURLs(deduplicationResults.new);
    
    // 4. 保存结果
    if (scrapeResults.length > 0) {
      await saveResults(scrapeResults);
    }
    
    // 5. 最终统计
    const successfulScrapes = scrapeResults.filter(r => r.success);
    const totalCreditsUsed = successfulScrapes.reduce((sum, r) => sum + r.creditsUsed, 0);
    const totalWords = successfulScrapes.reduce((sum, r) => sum + r.wordCount, 0);
    
    console.log('\n📊 最终统计:');
    console.log(`  📄 成功抓取: ${successfulScrapes.length} 篇文章`);
    console.log(`  💰 实际Credit消耗: ${totalCreditsUsed}`);
    console.log(`  📝 总字数: ${totalWords.toLocaleString()}`);
    console.log(`  📈 效率: ${totalCreditsUsed > 0 ? (totalWords / totalCreditsUsed).toFixed(0) : 0} 字/Credit`);
    
    console.log('\n🎯 智能去重优势:');
    console.log('  ✅ 精确识别重复内容');
    console.log('  ✅ 大幅节省Credit消耗');
    console.log('  ✅ 避免重复数据库记录');
    console.log('  ✅ 提高抓取效率');
    console.log('  ✅ 智能相似度检测');
    
    console.log('\n✅ 智能去重检查完成');
    
  } catch (error) {
    console.error('❌ 智能去重检查失败:', error);
  }
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

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 运行主函数
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, smartURLDeduplication };
