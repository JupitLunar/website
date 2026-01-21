#!/usr/bin/env node

/**
 * 获取 Trending Topics 脚本
 * 优先使用 Google Trends RSS，如果失败则降级到 Google Trends API，再降级到 Reddit
 * 返回原始 trending topics 字符串数组
 */

const path = require('path');

// 加载环境变量
const dotenv = require('dotenv');
// Load env vars from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const isQuiet = process.env.QUIET_TRENDS === 'true';
const logInfo = (...args) => {
  if (!isQuiet) {
    console.log(...args);
  }
};

// 母婴 + 父母健康相关关键词列表
const MATERNAL_INFANT_KEYWORDS = [
  'baby',
  'infant',
  'toddler',
  'pregnancy',
  'breastfeeding',
  'sleep training',
  'baby feeding',
  'newborn',
  'parenting',
  'baby development',
  'child development',
  'development games',
  'baby games',
  'baby play',
  'sensory play',
  'tummy time',
  'milestones',
  'gross motor',
  'fine motor',
  'language development',
  'speech delay',
  'social emotional',
  'baby health',
  'maternal health',
  'parent health',
  'parental stress',
  'parental burnout',
  'postpartum recovery',
  'postpartum anxiety',
  'postpartum depression',
  'postnatal',
  'pelvic floor',
  'pelvic floor therapy',
  'diastasis recti',
  'lochia',
  'mastitis',
  'lactation',
  'c-section',
  'cesarean',
  'postpartum checkup',
  'postpartum warning signs',
  'birth control',
  'contraception',
  'fertility',
  'family planning',
  'postpartum',
  'baby safety',
  'baby food',
  'weaning',
  'baby sleep',
  'baby milestones'
];

// 专门用于 relatedQueries 的种子关键词（更偏向发展/父母健康）
const TREND_SEED_KEYWORDS = [
  'baby development',
  'child development',
  'baby development games',
  'sensory play',
  'tummy time',
  'language development',
  'speech delay',
  'gross motor milestones',
  'fine motor milestones',
  'postpartum recovery',
  'postpartum anxiety',
  'postpartum depression',
  'birth control',
  'contraception',
  'pelvic floor exercises',
  'c-section recovery',
  'postnatal care',
  'postpartum checkup',
  'postpartum warning signs',
  'birth control while breastfeeding',
  'parent health'
];

const GOOGLE_NEWS_RSS_QUERIES = [
  'baby development milestones',
  'baby development games',
  'sensory play baby',
  'tummy time baby',
  'speech delay toddler',
  'language development baby',
  'postpartum recovery',
  'postpartum depression',
  'postpartum anxiety',
  'postpartum warning signs',
  'postpartum checkup',
  'birth control after birth',
  'contraception while breastfeeding',
  'pelvic floor therapy postpartum',
  'c-section recovery',
  'parental burnout'
];

// Reddit 相关子版块
const REDDIT_SUBREDDITS = [
  'parenting',
  'beyondthebump',
  'NewParents',
  'Mommit',
  'daddit',
  'BabyBumps',
  'ScienceBasedParenting',
  'toddlers',
  'pregnant'
];

const GOOGLE_TRENDS_RSS_URL = 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=US&hl=en-US';
const GOOGLE_NEWS_RSS_BASE = 'https://news.google.com/rss/search?q=';
const BING_NEWS_RSS_BASE = 'https://www.bing.com/news/search?q=';

/**
 * 从 Google Trends 获取热门话题（API）
 */
async function fetchFromGoogleTrends() {
  try {
    // 尝试使用 google-trends-api 包
    // 如果包不存在，会抛出错误，我们会在 catch 中处理
    const googleTrends = require('google-trends-api');
    
    const topics = [];
    
    try {
      // 方法1: 获取今日热门趋势
      try {
        const results = await googleTrends.dailyTrends({
          geo: 'US', // 北美市场
        });
        
        const data = JSON.parse(results);
        if (data.default && data.default.trendingSearchesDays) {
          const trendingSearches = data.default.trendingSearchesDays[0]?.trendingSearches || [];
          trendingSearches.forEach(item => {
            if (item.title && item.title.query) {
              const title = item.title.query.toLowerCase();
              // 检查是否包含母婴相关关键词
              if (MATERNAL_INFANT_KEYWORDS.some(kw => title.includes(kw.toLowerCase()))) {
                topics.push(item.title.query);
              }
            }
          });
        }
      } catch (dailyErr) {
        // dailyTrends经常失败（Google限制），但relatedQueries作为备用方法通常能成功
        // 只在debug模式下显示详细错误，避免日志噪音
        if (process.env.DEBUG) {
          console.log(`⚠️  Google Trends dailyTrends 失败: ${dailyErr.message}`);
        }
      }
      
      // 方法2: 如果今日趋势没有足够结果，尝试搜索特定关键词的相关趋势
      if (topics.length < 5) {
        for (const keyword of TREND_SEED_KEYWORDS.slice(0, 6)) {
          try {
            const relatedQueries = await googleTrends.relatedQueries({
              keyword: keyword,
              geo: 'US',
            });
            
            const relatedData = JSON.parse(relatedQueries);
            if (relatedData.default && relatedData.default.rankedList) {
              relatedData.default.rankedList.forEach(list => {
                if (list.rankedKeyword) {
                  list.rankedKeyword.forEach(item => {
                    if (item.query) {
                      const query = item.query.toLowerCase();
                      if (MATERNAL_INFANT_KEYWORDS.some(kw => query.includes(kw.toLowerCase()))) {
                        topics.push(item.query);
                      }
                    }
                  });
                }
              });
            }
            
            // 避免请求过快
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (err) {
            // 单个关键词失败不影响整体
            console.log(`⚠️  Google Trends 关键词 "${keyword}" 相关查询获取失败:`, err.message);
          }
        }
      }
    } catch (err) {
      console.log(`⚠️  Google Trends API 调用失败: ${err.message}`);
      return null; // 返回 null 表示失败，需要尝试 Reddit
    }
    
    // 去重
    const uniqueTopics = [...new Set(topics)];
    
    if (uniqueTopics.length > 0) {
      logInfo(`✅ 从 Google Trends 获取到 ${uniqueTopics.length} 个热门话题`);
      return uniqueTopics.slice(0, 20); // 最多返回20个
    }
    
    return [];
  } catch (error) {
    // 如果包不存在或其他错误
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log(`⚠️  google-trends-api 包未安装，跳过 Google Trends`);
    } else {
      console.log(`⚠️  Google Trends API 不可用: ${error.message}`);
    }
    return null; // 返回 null 表示失败，需要尝试 Reddit
  }
}

/**
 * 使用 Google Trends RSS 作为主源
 */
async function fetchFromGoogleTrendsRss() {
  try {
    const axios = require('axios');
    const cheerio = require('cheerio');
    const response = await axios.get(GOOGLE_TRENDS_RSS_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TrendingTopicsBot/1.0)'
      },
      timeout: 8000
    });

    const topics = [];
    const $ = cheerio.load(response.data, { xmlMode: true });
    $('item > title').each((_, el) => {
      const title = $(el).text().trim();
      if (!title) return;
      const lower = title.toLowerCase();
      if (MATERNAL_INFANT_KEYWORDS.some(kw => lower.includes(kw.toLowerCase()))) {
        topics.push(title);
      }
    });

    const uniqueTopics = [...new Set(topics)];
    if (uniqueTopics.length > 0) {
      logInfo(`✅ 从 Google Trends RSS 获取到 ${uniqueTopics.length} 个热门话题`);
      return uniqueTopics.slice(0, 20);
    }

    return [];
  } catch (error) {
    if (process.env.DEBUG) {
      console.log(`⚠️  Google Trends RSS 不可用: ${error.message}`);
    } else {
      console.log('⚠️  Google Trends RSS 不可用');
    }
    return null;
  }
}

/**
 * 从 Google News RSS 查询获取热门话题
 */
async function fetchFromGoogleNewsRss() {
  try {
    const axios = require('axios');
    const cheerio = require('cheerio');
    const topics = [];

    for (const query of GOOGLE_NEWS_RSS_QUERIES) {
      try {
        const url = `${GOOGLE_NEWS_RSS_BASE}${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; TrendingTopicsBot/1.0)'
          },
          timeout: 8000
        });

        const $ = cheerio.load(response.data, { xmlMode: true });
        $('item > title').each((_, el) => {
          const title = $(el).text().trim();
          if (!title) return;
          const lower = title.toLowerCase();
          if (MATERNAL_INFANT_KEYWORDS.some(kw => lower.includes(kw.toLowerCase()))) {
            topics.push(title);
          }
        });

        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err) {
        console.log(`⚠️  Google News RSS 查询 "${query}" 获取失败: ${err.message}`);
      }
    }

    const uniqueTopics = [...new Set(topics)];
    if (uniqueTopics.length > 0) {
      logInfo(`✅ 从 Google News RSS 获取到 ${uniqueTopics.length} 个相关话题`);
      return uniqueTopics.slice(0, 20);
    }

    return [];
  } catch (error) {
    console.log(`⚠️  Google News RSS 不可用: ${error.message}`);
    return null;
  }
}

/**
 * 从 Bing News RSS 查询获取热门话题
 */
async function fetchFromBingNewsRss() {
  try {
    const axios = require('axios');
    const cheerio = require('cheerio');
    const topics = [];

    for (const query of GOOGLE_NEWS_RSS_QUERIES) {
      try {
        const url = `${BING_NEWS_RSS_BASE}${encodeURIComponent(query)}&format=rss`;
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; TrendingTopicsBot/1.0)'
          },
          timeout: 8000
        });

        const $ = cheerio.load(response.data, { xmlMode: true });
        $('item > title').each((_, el) => {
          const title = $(el).text().trim();
          if (!title) return;
          const lower = title.toLowerCase();
          if (MATERNAL_INFANT_KEYWORDS.some(kw => lower.includes(kw.toLowerCase()))) {
            topics.push(title);
          }
        });

        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err) {
        console.log(`⚠️  Bing News RSS 查询 "${query}" 获取失败: ${err.message}`);
      }
    }

    const uniqueTopics = [...new Set(topics)];
    if (uniqueTopics.length > 0) {
      logInfo(`✅ 从 Bing News RSS 获取到 ${uniqueTopics.length} 个相关话题`);
      return uniqueTopics.slice(0, 20);
    }

    return [];
  } catch (error) {
    console.log(`⚠️  Bing News RSS 不可用: ${error.message}`);
    return null;
  }
}

/**
 * 从 Reddit 获取热门话题
 */
async function fetchFromReddit() {
  try {
    const axios = require('axios');
    const topics = [];
    
    // 从每个子版块获取热门帖子
    for (const subreddit of REDDIT_SUBREDDITS) {
      try {
        const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=10`;
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; TrendingTopicsBot/1.0)'
          },
          timeout: 5000
        });
        
        if (response.data && response.data.data && response.data.data.children) {
          response.data.data.children.forEach(post => {
            if (post.data && post.data.title) {
              const title = post.data.title.toLowerCase();
              // 检查是否包含母婴相关关键词
              if (MATERNAL_INFANT_KEYWORDS.some(kw => title.includes(kw.toLowerCase()))) {
                topics.push(post.data.title);
              }
            }
          });
        }
        
        // 避免请求过快（Reddit 限制：每分钟 60 请求）
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        // 单个子版块失败不影响整体
        console.log(`⚠️  Reddit 子版块 r/${subreddit} 获取失败:`, err.message);
      }
    }
    
    // 去重
    const uniqueTopics = [...new Set(topics)];
    
    if (uniqueTopics.length > 0) {
      logInfo(`✅ 从 Reddit 获取到 ${uniqueTopics.length} 个热门话题`);
      return uniqueTopics.slice(0, 20); // 最多返回20个
    }
    
    return [];
  } catch (error) {
    console.log(`⚠️  Reddit API 获取失败: ${error.message}`);
    return [];
  }
}

/**
 * 主函数：获取 trending topics
 * 优先 Google Trends RSS，失败则降级到 Google Trends API，再降级到 Reddit
 */
async function fetchTrendingTopics() {
  logInfo('🔍 开始获取 Trending Topics...\n');
  
  // 优先尝试 Google Trends RSS
  let topics = await fetchFromGoogleTrendsRss();
  
  // 如果 RSS 失败（返回 null）或没有结果，尝试 Google Trends API
  if (topics === null || topics.length === 0) {
    logInfo('📈 降级到 Google Trends API...\n');
    topics = await fetchFromGoogleTrends();
  }

  // 如果 RSS/API 失败（返回 null）或没有结果，尝试 Google News RSS
  if (topics === null || topics.length === 0) {
    logInfo('📰 降级到 Google News RSS...\n');
    topics = await fetchFromGoogleNewsRss();
  }

  // 如果仍然没有结果，尝试 Bing News RSS
  if (topics === null || topics.length === 0) {
    logInfo('📰 降级到 Bing News RSS...\n');
    topics = await fetchFromBingNewsRss();
  }

  // 如果仍然没有结果，尝试 Reddit
  if (topics === null || topics.length === 0) {
    logInfo('📱 降级到 Reddit 数据源...\n');
    topics = await fetchFromReddit();
  }
  
  if (topics.length === 0) {
    logInfo('⚠️  未能获取到 trending topics\n');
    return [];
  }
  
  logInfo(`\n📊 获取到的 Trending Topics (前10个):`);
  topics.slice(0, 10).forEach((topic, i) => {
    logInfo(`   ${i + 1}. ${topic}`);
  });
  logInfo('');
  
  return topics;
}

// 如果直接运行此脚本，执行获取
if (require.main === module) {
  fetchTrendingTopics()
    .then(topics => {
      logInfo(`\n✅ 总共获取到 ${topics.length} 个 trending topics`);
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ 获取 trending topics 失败:', error);
      process.exit(1);
    });
}

module.exports = { fetchTrendingTopics, fetchFromReddit };
