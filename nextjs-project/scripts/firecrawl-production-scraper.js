#!/usr/bin/env node

/**
 * 生产级Firecrawl母婴内容爬虫
 * 基于验证的API连接，专注抓取权威母婴网站
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

// 权威来源配置 - 基于验证的抓取功能
const AUTHORITY_SOURCES = {
  US: [
    {
      name: 'American Academy of Pediatrics',
      organization: 'AAP',
      baseUrl: 'https://www.healthychildren.org',
      region: 'US',
      grade: 'A',
      targetPages: [
        {
          url: 'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Starting-Solid-Foods.aspx',
          title: 'Starting Solid Foods',
          category: 'feeding'
        },
        {
          url: 'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Sample-One-Day-Menu-for-an-8-to-12-Month-Old.aspx',
          title: 'Sample One-Day Menu for 8-12 Month Old',
          category: 'feeding'
        },
        {
          url: 'https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/Working-Together-Breastfeeding-and-Solid-Foods.aspx',
          title: 'Breastfeeding and Solid Foods',
          category: 'feeding'
        }
      ]
    }
  ],
  
  UK: [
    {
      name: 'National Health Service (NHS)',
      organization: 'NHS',
      baseUrl: 'https://www.nhs.uk',
      region: 'UK',
      grade: 'A',
      targetPages: [
        {
          url: 'https://www.nhs.uk/conditions/baby/weaning-and-feeding/',
          title: 'Weaning and Feeding',
          category: 'feeding'
        },
        {
          url: 'https://www.nhs.uk/conditions/baby/breastfeeding-and-bottle-feeding/',
          title: 'Breastfeeding and Bottle Feeding',
          category: 'feeding'
        },
        {
          url: 'https://www.nhs.uk/conditions/baby/babys-development/',
          title: 'Baby Development',
          category: 'development'
        }
      ]
    }
  ]
};

// 配置
const CONFIG = {
  maxArticlesPerRun: 20,
  minContentLength: 1000,
  debugMode: process.env.DEBUG === 'true',
  delayBetweenRequests: 3000, // 3秒延迟避免并发限制
  regions: ['US', 'UK']
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
      timeout: 60000 // 60秒超时
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
 * 使用Firecrawl抓取页面
 */
async function scrapePageWithFirecrawl(url, source, pageInfo) {
  try {
    console.log(`    🔄 Firecrawl抓取: ${pageInfo.title}`);
    console.log(`    🔗 URL: ${url}`);
    
    const result = await makeFirecrawlRequest('/scrape', {
      url: url,
      formats: ['markdown'],
      onlyMainContent: true,
      removeBase64Images: true,
      waitFor: 2000 // 等待2秒确保页面加载
    });

    if (!result.data || !result.data.markdown) {
      console.log(`    ⚠️  未获取到内容，跳过`);
      return null;
    }

    const content = result.data.markdown;
    const title = result.data.metadata?.title || pageInfo.title;
    const wordCount = content.length;

    console.log(`    ✅ 抓取成功: ${wordCount} 字符`);

    // 验证内容质量
    if (wordCount < CONFIG.minContentLength) {
      console.log(`    ⚠️  内容太短 (${wordCount} < ${CONFIG.minContentLength})，跳过`);
      return null;
    }

    return {
      url: url,
      title: title,
      content: content,
      source: source,
      pageInfo: pageInfo,
      wordCount: wordCount,
      extractedAt: new Date().toISOString(),
      confidence: 0.9 // 高质量权威来源
    };

  } catch (error) {
    console.error(`    ❌ 抓取失败:`, error.message);
    return null;
  }
}

/**
 * 验证内容质量
 */
function validateContent(article) {
  console.log(`    🔍 验证内容质量`);
  
  const checks = {
    length: article.wordCount >= CONFIG.minContentLength,
    source: article.source.grade === 'A',
    title: article.title && article.title.length > 10,
    content: article.content && article.content.includes('##'),
    medical: article.content.toLowerCase().includes('medical') || 
             article.content.toLowerCase().includes('health') ||
             article.content.toLowerCase().includes('doctor')
  };
  
  const passedChecks = Object.values(checks).filter(Boolean).length;
  const totalChecks = Object.keys(checks).length;
  
  console.log(`    📊 质量检查: ${passedChecks}/${totalChecks} 通过`);
  
  return passedChecks >= 3; // 至少3项通过
}

/**
 * 生成文章数据
 */
function generateArticleData(article) {
  return {
    slug: generateSlug(article.title),
    type: 'explainer', // 使用schema中支持的类型
    hub: mapCategoryToHub(article.pageInfo.category),
    lang: 'en',
    title: article.title,
    one_liner: extractOneLiner(article.content),
    key_facts: extractKeyFacts(article.content),
    body_md: article.content,
    entities: extractEntities(article.content),
    age_range: extractAgeRange(article.content),
    region: mapRegion(article.source.region),
    last_reviewed: new Date().toISOString().split('T')[0],
    reviewed_by: 'Firecrawl Production Bot',
    license: `Source: ${article.source.name}`,
    status: 'draft'
  };
}

/**
 * 保存文章到数据库
 */
async function saveArticle(article) {
  try {
    // 检查是否已存在
    const { data: existing } = await supabase
      .from('articles')
      .select('id, title')
      .or(`url.eq.${article.url},title.eq.${article.title}`)
      .limit(1);
    
    if (existing && existing.length > 0) {
      console.log(`    ⏭️  文章已存在: "${existing[0].title}"，跳过`);
      return null;
    }
    
    // 生成文章数据
    const articleData = generateArticleData(article);
    
    // 插入数据库
    const { data, error } = await supabase
      .from('articles')
      .insert([articleData])
      .select();
    
    if (error) {
      console.error(`    ❌ 保存失败:`, error);
      return null;
    }
    
    console.log(`    ✅ 保存成功: ID ${data[0].id}`);
    return data[0];
    
  } catch (error) {
    console.error(`    ❌ 保存失败:`, error);
    return null;
  }
}

/**
 * 抓取单个来源的所有页面
 */
async function scrapeSource(source) {
  const results = [];
  
  try {
    console.log(`🔍 开始抓取 ${source.name} (${source.region})`);
    console.log(`📊 计划抓取 ${source.targetPages.length} 个页面`);
    
    for (const pageInfo of source.targetPages) {
      console.log(`\n  📄 处理页面: ${pageInfo.title}`);
      
      try {
        const article = await scrapePageWithFirecrawl(pageInfo.url, source, pageInfo);
        
        if (article && validateContent(article)) {
          console.log(`    ✅ 内容验证通过`);
          
          const saved = await saveArticle(article);
          if (saved) {
            results.push(saved);
          }
        } else if (article) {
          console.log(`    ❌ 内容验证失败，跳过`);
        }
        
        // 延迟避免并发限制
        if (CONFIG.delayBetweenRequests > 0) {
          console.log(`    ⏳ 等待 ${CONFIG.delayBetweenRequests}ms...`);
          await delay(CONFIG.delayBetweenRequests);
        }
        
      } catch (error) {
        console.error(`    ❌ 处理页面失败:`, error.message);
      }
    }
    
    console.log(`\n📊 ${source.name} 抓取完成: ${results.length}/${source.targetPages.length} 成功`);
    
  } catch (error) {
    console.error(`❌ 抓取 ${source.name} 失败:`, error.message);
  }
  
  return results;
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

function extractOneLiner(content) {
  const sentences = content.split(/[.!?]+/);
  
  // 找到第一个有意义的句子（长度在50-200字符之间）
  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (trimmed.length >= 50 && trimmed.length <= 200) {
      return trimmed;
    }
  }
  
  // 如果没找到合适的句子，生成一个
  const words = content.split(/\s+/).slice(0, 30).join(' ');
  if (words.length >= 50 && words.length <= 200) {
    return words;
  }
  
  // 默认返回符合长度要求的描述
  return 'Expert guidance on maternal and infant health from authoritative medical sources. This comprehensive resource provides evidence-based recommendations for parents and caregivers.';
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
  
  return '0-24 months'; // 默认
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
  
  return categoryMap[category] || 'feeding'; // 默认feeding
}

function mapRegion(region) {
  const regionMap = {
    'US': 'US',
    'UK': 'Global', // UK映射到Global
    'CA': 'CA',
    'Global': 'Global'
  };
  
  return regionMap[region] || 'Global';
}

function extractKeyFacts(content) {
  const facts = [];
  
  // 提取包含数字的句子作为关键事实
  const sentences = content.split(/[.!?]+/);
  sentences.forEach(sentence => {
    const trimmed = sentence.trim();
    if (trimmed.length > 20 && trimmed.length < 200 && 
        (/\d/.test(trimmed) || trimmed.toLowerCase().includes('important') || 
         trimmed.toLowerCase().includes('recommended'))) {
      facts.push(trimmed);
    }
  });
  
  // 限制为3-8个关键事实
  return facts.slice(0, 8);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 Firecrawl生产级母婴内容爬虫');
  console.log('='.repeat(50));
  console.log(`🔑 API密钥: ${FIRECRAWL_API_KEY.substring(0, 10)}...`);
  console.log(`📊 配置: 最大${CONFIG.maxArticlesPerRun}篇文章，最小${CONFIG.minContentLength}字符`);
  console.log(`🌍 地区: ${CONFIG.regions.join(', ')}`);
  console.log(`⏱️  延迟: ${CONFIG.delayBetweenRequests}ms`);
  
  const stats = {
    total: 0,
    successful: 0,
    failed: 0,
    skipped: 0
  };
  
  try {
    for (const region of CONFIG.regions) {
      const sources = AUTHORITY_SOURCES[region];
      if (!sources) {
        console.log(`⚠️  地区 ${region} 无配置，跳过`);
        continue;
      }
      
      console.log(`\n🌍 处理地区: ${region}`);
      
      for (const source of sources) {
        if (stats.total >= CONFIG.maxArticlesPerRun) {
          console.log(`\n⏹️  已达到最大文章数量限制 (${CONFIG.maxArticlesPerRun})`);
          break;
        }
        
        try {
          const articles = await scrapeSource(source);
          
          stats.total += source.targetPages.length;
          stats.successful += articles.length;
          stats.skipped += (source.targetPages.length - articles.length);
          
        } catch (error) {
          console.error(`❌ 处理来源失败 ${source.name}:`, error.message);
          stats.failed += source.targetPages.length;
        }
      }
    }
    
  } catch (error) {
    console.error('❌ 爬虫执行失败:', error);
  }
  
  // 输出统计
  console.log('\n📊 Firecrawl生产级抓取统计:');
  console.log(`  总计: ${stats.total}`);
  console.log(`  成功: ${stats.successful}`);
  console.log(`  跳过: ${stats.skipped}`);
  console.log(`  失败: ${stats.failed}`);
  console.log(`  成功率: ${((stats.successful / stats.total) * 100).toFixed(1)}%`);
  
  console.log('\n🎯 Firecrawl优势总结:');
  console.log('  ✅ 高质量内容提取');
  console.log('  ✅ 权威来源验证');
  console.log('  ✅ 智能内容过滤');
  console.log('  ✅ 结构化数据保存');
  console.log('  ✅ 生产级稳定性');
  
  console.log('\n✅ Firecrawl生产级爬虫完成');
}

// 运行主函数
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, scrapeSource };
