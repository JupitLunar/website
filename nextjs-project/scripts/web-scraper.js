#!/usr/bin/env node

/**
 * Web Scraper - 从权威网站爬取内容
 * 用于cron job定期执行
 */

const axios = require('axios');
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

// 加载配置
const { SOURCES, CLEANING_RULES, SCRAPER_CONFIG, DATA_MAPPING } = require('./scraper-config');

// 加载环境变量
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少必要的环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 延迟函数
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 带重试的HTTP请求
 */
async function fetchWithRetry(url, retries = SCRAPER_CONFIG.retryConfig.maxRetries) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`📡 请求: ${url} (尝试 ${i + 1}/${retries})`);
      
      const response = await axios.get(url, {
        ...SCRAPER_CONFIG.requestConfig,
        validateStatus: (status) => status < 500 // 只重试5xx错误
      });
      
      if (response.status === 200) {
        return response.data;
      }
      
      console.warn(`⚠️  HTTP ${response.status}: ${url}`);
      
    } catch (error) {
      console.error(`❌ 请求失败 (${i + 1}/${retries}):`, error.message);
      
      if (i < retries - 1) {
        const delayTime = SCRAPER_CONFIG.retryConfig.retryDelay * Math.pow(SCRAPER_CONFIG.retryConfig.backoffMultiplier, i);
        console.log(`⏳ 等待 ${delayTime}ms 后重试...`);
        await delay(delayTime);
      }
    }
  }
  
  throw new Error(`Failed to fetch ${url} after ${retries} retries`);
}

/**
 * 清理HTML内容
 */
function cleanHTML(html) {
  const $ = cheerio.load(html);
  
  // 移除不需要的标签
  CLEANING_RULES.removeTags.forEach(tag => {
    $(tag).remove();
  });
  
  // 移除不需要的类
  CLEANING_RULES.removeClasses.forEach(className => {
    $(`.${className}`).remove();
  });
  
  return $;
}

/**
 * 提取页面内容
 */
function extractContent(html, selectors) {
  const $ = cleanHTML(html);
  
  const content = {
    title: '',
    paragraphs: [],
    lists: [],
    rawText: ''
  };
  
  // 提取标题
  if (selectors.title) {
    content.title = $(selectors.title).first().text().trim();
  }
  
  // 提取段落
  if (selectors.paragraphs) {
    $(selectors.paragraphs).each((i, elem) => {
      const text = $(elem).text().trim();
      if (text.length >= CLEANING_RULES.minParagraphLength) {
        content.paragraphs.push(text);
      }
    });
  }
  
  // 提取列表
  if (selectors.lists) {
    $(selectors.lists).each((i, elem) => {
      const items = [];
      $(elem).find('li').each((j, li) => {
        const text = $(li).text().trim();
        if (text) items.push(text);
      });
      if (items.length > 0) {
        content.lists.push(items);
      }
    });
  }
  
  // 提取主要内容区域的文本
  if (selectors.content) {
    content.rawText = $(selectors.content).text().trim();
  }
  
  // 如果没有rawText，合并所有段落
  if (!content.rawText) {
    content.rawText = content.paragraphs.join('\n\n');
  }
  
  return content;
}

/**
 * 验证内容质量
 */
function validateContent(content) {
  const textLength = content.rawText.length;
  
  if (textLength < CLEANING_RULES.minContentLength) {
    return {
      valid: false,
      reason: `Content too short: ${textLength} chars (min: ${CLEANING_RULES.minContentLength})`
    };
  }
  
  if (textLength > CLEANING_RULES.maxContentLength) {
    return {
      valid: false,
      reason: `Content too long: ${textLength} chars (max: ${CLEANING_RULES.maxContentLength})`
    };
  }
  
  if (!content.title) {
    return {
      valid: false,
      reason: 'No title found'
    };
  }
  
  if (content.paragraphs.length < 2) {
    return {
      valid: false,
      reason: 'Not enough paragraphs'
    };
  }
  
  return { valid: true };
}

/**
 * 保存原始数据到文件
 */
function saveRawData(data, filename) {
  if (!SCRAPER_CONFIG.storage.saveRaw) return;
  
  const dir = path.resolve(__dirname, '..', SCRAPER_CONFIG.storage.directory);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const filepath = path.join(dir, `${filename}.json`);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  console.log(`💾 已保存原始数据: ${filepath}`);
}

/**
 * 爬取单个页面
 */
async function scrapePage(source, page) {
  console.log(`\n📄 爬取页面: ${page.url}`);
  
  try {
    // 获取HTML
    const html = await fetchWithRetry(page.url);
    
    // 提取内容
    const content = extractContent(html, page.selectors);
    
    // 验证内容
    const validation = validateContent(content);
    if (!validation.valid) {
      console.warn(`⚠️  内容验证失败: ${validation.reason}`);
      return null;
    }
    
    // 构建数据对象
    const scrapedData = {
      source: {
        id: source.id,
        name: source.name,
        organization: source.organization,
        baseUrl: source.baseUrl,
        grade: source.grade
      },
      page: {
        url: page.url,
        type: page.type,
        category: page.category
      },
      content: content,
      metadata: {
        scrapedAt: new Date().toISOString(),
        contentLength: content.rawText.length,
        paragraphCount: content.paragraphs.length,
        listCount: content.lists.length
      }
    };
    
    // 保存原始数据
    const filename = `${source.id}_${page.type}_${Date.now()}`;
    saveRawData(scrapedData, filename);
    
    console.log(`✅ 成功爬取: ${content.title}`);
    console.log(`   📏 内容长度: ${content.rawText.length} 字符`);
    console.log(`   📝 段落数: ${content.paragraphs.length}`);
    
    return scrapedData;
    
  } catch (error) {
    console.error(`❌ 爬取失败: ${page.url}`, error.message);
    return null;
  }
}

/**
 * 保存来源到数据库
 */
async function saveSourceToDB(sourceData) {
  try {
    const sourceRecord = DATA_MAPPING.source(sourceData);
    
    // 先检查是否已存在
    const { data: existing } = await supabase
      .from('kb_sources')
      .select('id')
      .eq('url', sourceRecord.url)
      .single();
    
    if (existing) {
      console.log(`ℹ️  来源已存在: ${sourceRecord.name}`);
      return existing.id;
    }
    
    // 插入新来源
    const { data, error } = await supabase
      .from('kb_sources')
      .insert([sourceRecord])
      .select()
      .single();
    
    if (error) throw error;
    
    console.log(`✅ 保存来源: ${sourceRecord.name} (ID: ${data.id})`);
    return data.id;
    
  } catch (error) {
    console.error(`❌ 保存来源失败:`, error.message);
    return null;
  }
}

/**
 * 保存文章到数据库
 */
async function saveArticleToDB(scrapedData, sourceId) {
  try {
    // 准备文章数据 (不包含source_id，因为表中没有这个字段)
    const articleData = DATA_MAPPING.article(scrapedData);

    // 检查slug是否已存在
    const { data: existing } = await supabase
      .from('articles')
      .select('id, slug')
      .eq('slug', articleData.slug)
      .single();

    if (existing) {
      console.log(`ℹ️  文章已存在: ${articleData.slug}`);
      return { id: existing.id, created: false };
    }

    // 插入新文章
    const { data, error } = await supabase
      .from('articles')
      .insert([articleData])
      .select()
      .single();

    if (error) throw error;

    console.log(`✅ 保存文章: ${articleData.title}`);
    console.log(`   🔗 Slug: ${articleData.slug}`);
    console.log(`   🆔 ID: ${data.id}`);

    // 保存引用
    await saveCitationToDB(data.id, scrapedData);

    return { id: data.id, created: true };

  } catch (error) {
    console.error(`❌ 保存文章失败:`, error.message);
    return null;
  }
}

/**
 * 保存引用到数据库
 */
async function saveCitationToDB(articleId, scrapedData) {
  try {
    const citationData = {
      article_id: articleId,
      title: scrapedData.content.title,
      url: scrapedData.page.url,
      publisher: scrapedData.source.organization,
      date: new Date().toISOString().split('T')[0]
    };
    
    const { error } = await supabase
      .from('citations')
      .insert([citationData]);
    
    if (error) throw error;
    
    console.log(`   📚 保存引用: ${citationData.publisher}`);
    
  } catch (error) {
    console.error(`   ⚠️  保存引用失败:`, error.message);
  }
}

/**
 * 爬取所有配置的来源
 */
async function scrapeAllSources(sourceKeys = null) {
  console.log('🚀 开始爬取权威网站内容\n');
  
  const results = {
    total: 0,
    successful: 0,
    failed: 0,
    skipped: 0,
    articles: []
  };
  
  // 确定要爬取的来源
  const sourcesToScrape = sourceKeys 
    ? sourceKeys.map(key => SOURCES[key]).filter(Boolean)
    : Object.values(SOURCES);
  
  for (const source of sourcesToScrape) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🏢 来源: ${source.name} (等级: ${source.grade})`);
    console.log(`${'='.repeat(60)}`);
    
    // 保存来源到数据库
    const sourceId = await saveSourceToDB(source);
    
    for (const page of source.targetPages) {
      results.total++;
      
      // 爬取页面
      const scrapedData = await scrapePage(source, page);
      
      if (!scrapedData) {
        results.failed++;
        continue;
      }
      
      // 保存到数据库
      if (sourceId) {
        const articleResult = await saveArticleToDB(scrapedData, sourceId);
        
        if (articleResult) {
          if (articleResult.created) {
            results.successful++;
            results.articles.push({
              id: articleResult.id,
              title: scrapedData.content.title,
              source: source.name
            });
          } else {
            results.skipped++;
          }
        } else {
          results.failed++;
        }
      }
      
      // 请求间隔
      await delay(SCRAPER_CONFIG.concurrency.delayBetweenRequests);
    }
  }
  
  return results;
}

/**
 * 打印结果摘要
 */
function printSummary(results) {
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 爬取结果摘要');
  console.log(`${'='.repeat(60)}`);
  console.log(`总页面数: ${results.total}`);
  console.log(`成功: ${results.successful} ✅`);
  console.log(`跳过: ${results.skipped} ⏭️`);
  console.log(`失败: ${results.failed} ❌`);
  console.log(`成功率: ${((results.successful / results.total) * 100).toFixed(1)}%`);
  
  if (results.articles.length > 0) {
    console.log(`\n新增文章:`);
    results.articles.forEach((article, i) => {
      console.log(`  ${i + 1}. ${article.title}`);
      console.log(`     来源: ${article.source}`);
    });
  }
  
  console.log(`\n✅ 爬取完成！`);
}

/**
 * 主函数
 */
async function main(options = {}) {
  try {
    const startTime = Date.now();
    
    // 执行爬取
    const results = await scrapeAllSources(options.sources);
    
    // 打印结果
    printSummary(results);
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n⏱️  总耗时: ${duration}秒`);
    
    return results;
    
  } catch (error) {
    console.error('❌ 爬取过程出错:', error);
    throw error;
  }
}

/**
 * 测试模式 - 只爬取一个页面
 */
async function testMode() {
  console.log('🧪 测试模式 - 爬取单个页面\n');

  // 使用AAP的第一个页面测试
  const source = SOURCES.AAP;
  const page = source.targetPages[0];

  console.log(`测试来源: ${source.name}`);
  console.log(`测试页面: ${page.url}\n`);

  const scrapedData = await scrapePage(source, page);

  if (scrapedData) {
    console.log('\n✅ 测试成功！');
    console.log('\n提取的数据预览:');
    console.log(JSON.stringify({
      title: scrapedData.content.title,
      contentLength: scrapedData.content.rawText.length,
      paragraphs: scrapedData.content.paragraphs.length,
      source: scrapedData.source.name
    }, null, 2));
  } else {
    console.log('\n❌ 测试失败');
  }
}

// 命令行执行
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--test')) {
    testMode().catch(console.error);
  } else {
    const options = {};
    
    // 解析命令行参数
    const sourcesIndex = args.indexOf('--sources');
    if (sourcesIndex !== -1 && args[sourcesIndex + 1]) {
      options.sources = args[sourcesIndex + 1].split(',');
    }
    
    main(options).catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
  }
}

module.exports = {
  scrapeAllSources,
  scrapePage,
  main
};

