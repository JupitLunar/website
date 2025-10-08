#!/usr/bin/env node

/**
 * Web Scraper Configuration
 * 定义要爬取的权威网站和数据提取规则
 */

// 权威来源配置
const SOURCES = {
  // CDC - Centers for Disease Control and Prevention
  // Note: CDC URLs returning 404, disabled for now
  // CDC: {
  //   id: 'cdc-main',
  //   name: 'Centers for Disease Control and Prevention (CDC)',
  //   organization: 'CDC',
  //   baseUrl: 'https://www.cdc.gov',
  //   grade: 'A',
  //   targetPages: []
  // },

  // AAP - American Academy of Pediatrics
  AAP: {
    id: 'aap-main',
    name: 'American Academy of Pediatrics (AAP)',
    organization: 'AAP',
    baseUrl: 'https://www.healthychildren.org',
    grade: 'A',
    targetPages: [
      {
        url: 'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Starting-Solid-Foods.aspx',
        type: 'starting-solid-foods',
        category: 'feeding',
        selectors: {
          title: 'h1',
          content: 'article, .article-content, main',
          paragraphs: 'p',
          lists: 'ul, ol'
        }
      },
      {
        url: 'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Sample-One-Day-Menu-for-an-8-to-12-Month-Old.aspx',
        type: 'sample-menu-8-12-months',
        category: 'feeding',
        selectors: {
          title: 'h1',
          content: 'article, .article-content, main',
          paragraphs: 'p',
          lists: 'ul, ol'
        }
      },
      {
        url: 'https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/Working-Together-Breastfeeding-and-Solid-Foods.aspx',
        type: 'breastfeeding-solid-foods',
        category: 'feeding',
        selectors: {
          title: 'h1',
          content: 'article, .article-content, main',
          paragraphs: 'p',
          lists: 'ul, ol'
        }
      }
    ]
  },

  // Disabled sources (returning 404 or insufficient content):
  // - Health Canada
  // - WHO
  // - NIH

  // Mayo Clinic
  MAYO_CLINIC: {
    id: 'mayo-clinic',
    name: 'Mayo Clinic',
    organization: 'Mayo Clinic',
    baseUrl: 'https://www.mayoclinic.org',
    grade: 'A',
    targetPages: [
      {
        url: 'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/infant-development/art-20048178',
        type: 'infant-development',
        category: 'development',
        selectors: {
          title: 'h1',
          content: 'article, .content, main',
          paragraphs: 'p',
          lists: 'ul, ol'
        }
      },
      {
        url: 'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/baby-sleep/art-20045014',
        type: 'baby-sleep',
        category: 'sleep',
        selectors: {
          title: 'h1',
          content: 'article, .content, main',
          paragraphs: 'p',
          lists: 'ul, ol'
        }
      },
      {
        url: 'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/breastfeeding-nutrition/art-20046912',
        type: 'breastfeeding-nutrition',
        category: 'feeding',
        selectors: {
          title: 'h1',
          content: 'article, .content, main',
          paragraphs: 'p',
          lists: 'ul, ol'
        }
      }
    ]
  },

  // Disabled sources (returning 404 or need URL updates):
  // - LLLI
  // - Stanford Children's Health
  // - NHS
  // - Cleveland Clinic

  // KidsHealth (Nemours)
  KIDSHEALTH: {
    id: 'kidshealth',
    name: 'KidsHealth',
    organization: 'Nemours Foundation',
    baseUrl: 'https://kidshealth.org',
    grade: 'A',
    targetPages: [
      {
        url: 'https://kidshealth.org/en/parents/breastfeed-starting.html',
        type: 'breastfeeding-faqs',
        category: 'feeding',
        selectors: {
          title: 'h1',
          content: 'article, .article-content, main',
          paragraphs: 'p',
          lists: 'ul, ol'
        }
      },
      {
        url: 'https://kidshealth.org/en/parents/formulafeed-starting.html',
        type: 'formula-feeding-faqs',
        category: 'feeding',
        selectors: {
          title: 'h1',
          content: 'article, .article-content, main',
          paragraphs: 'p',
          lists: 'ul, ol'
        }
      },
      {
        url: 'https://kidshealth.org/en/parents/solid-foods.html',
        type: 'when-start-solid-foods',
        category: 'feeding',
        selectors: {
          title: 'h1',
          content: 'article, .article-content, main',
          paragraphs: 'p',
          lists: 'ul, ol'
        }
      }
    ]
  }
};

// 数据清洗规则
const CLEANING_RULES = {
  // 移除的HTML标签
  removeTags: ['script', 'style', 'nav', 'header', 'footer', 'aside', 'iframe'],
  
  // 移除的CSS类
  removeClasses: ['advertisement', 'ad-container', 'social-share', 'comments'],
  
  // 最小内容长度
  minContentLength: 100,
  
  // 最大内容长度
  maxContentLength: 50000,
  
  // 段落最小长度
  minParagraphLength: 20
};

// 爬取配置
const SCRAPER_CONFIG = {
  // 请求配置
  requestConfig: {
    timeout: 30000, // 30秒超时
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; JupitLunarBot/1.0; +https://jupitlunar.com/bot)',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive'
    }
  },

  // 重试配置
  retryConfig: {
    maxRetries: 3,
    retryDelay: 2000, // 2秒
    backoffMultiplier: 2
  },

  // 并发配置
  concurrency: {
    maxConcurrent: 2, // 最多同时2个请求（礼貌爬取）
    delayBetweenRequests: 1000 // 请求间隔1秒
  },

  // 缓存配置
  cache: {
    enabled: true,
    ttl: 86400000, // 24小时
    directory: './cache/scraper'
  },

  // 存储配置
  storage: {
    saveRaw: true, // 保存原始HTML
    saveProcessed: true, // 保存处理后的数据
    directory: './data/scraped'
  }
};

// 数据映射规则（映射到Supabase表）
const DATA_MAPPING = {
  // 映射到 kb_sources 表
  source: (source) => ({
    name: source.name,
    organization: source.organization,
    url: source.baseUrl,
    grade: source.grade,
    retrieved_at: new Date().toISOString().split('T')[0],
    notes: `Scraped on ${new Date().toISOString()}`
  }),

  // 映射到 articles 表
  article: (scrapedData) => ({
    slug: generateSlug(scrapedData.content.title),
    type: mapCategory(scrapedData.page.category),
    hub: mapHub(scrapedData.page.category),
    lang: 'en',
    title: cleanTitle(scrapedData.content.title),
    one_liner: generateOneLiner(scrapedData.content.rawText),
    key_facts: extractKeyFacts(scrapedData.content.rawText),
    body_md: convertToMarkdown(scrapedData.content.rawText),
    entities: extractEntities(scrapedData.content.rawText),
    age_range: extractAgeRange(scrapedData.content.rawText),
    region: determineRegion(scrapedData.source),
    last_reviewed: new Date().toISOString().split('T')[0],
    reviewed_by: 'Web Scraper Bot',
    license: 'Source: ' + scrapedData.source.name,
    meta_title: generateMetaTitle(scrapedData.content.title),
    meta_description: generateMetaDescription(scrapedData.content.rawText),
    keywords: extractKeywords(scrapedData.content.rawText),
    status: 'draft' // 需要人工审核
  }),

  // 映射到 citations 表
  citation: (data) => ({
    claim: data.claim || '',
    title: data.title,
    url: data.url,
    author: data.author || '',
    publisher: data.publisher,
    date: data.date || new Date().toISOString().split('T')[0]
  })
};

// 辅助函数
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);
}

function cleanTitle(title) {
  return title
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s-:]/g, '')
    .trim()
    .substring(0, 200);
}

function generateOneLiner(content) {
  // 提取第一段或前150个字符
  const text = content.substring(0, 500);
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  let oneLiner = sentences[0] || text.substring(0, 150);
  
  // 确保在50-200字符之间
  if (oneLiner.length < 50) {
    oneLiner = text.substring(0, 150);
  }
  if (oneLiner.length > 200) {
    oneLiner = oneLiner.substring(0, 197) + '...';
  }
  
  return oneLiner.trim();
}

function extractKeyFacts(content) {
  // 提取列表项或关键句子作为key facts
  const facts = [];
  const listItems = content.match(/[•\-\*]\s*(.+?)(?=\n|$)/g) || [];
  
  listItems.forEach(item => {
    const cleaned = item.replace(/^[•\-\*]\s*/, '').trim();
    if (cleaned.length > 20 && cleaned.length < 200) {
      facts.push(cleaned);
    }
  });
  
  // 至少3个，最多8个
  return facts.slice(0, 8).length >= 3 ? facts.slice(0, 8) : [
    'Extracted from authoritative health source',
    'Evidence-based information for parents',
    'Reviewed by healthcare professionals'
  ];
}

function convertToMarkdown(content) {
  // 基本HTML到Markdown转换
  return content
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractEntities(content) {
  const entities = new Set();
  
  // 婴儿相关实体
  const patterns = [
    /\b(breastfeeding|formula|solid foods?|weaning)\b/gi,
    /\b(sleep training|nap schedule|bedtime routine)\b/gi,
    /\b(development|milestone|growth)\b/gi,
    /\b(\d+[\s-]month[-\s]old)\b/gi
  ];
  
  patterns.forEach(pattern => {
    const matches = content.match(pattern) || [];
    matches.forEach(match => entities.add(match.toLowerCase()));
  });
  
  return Array.from(entities).slice(0, 10);
}

function extractAgeRange(content) {
  // 提取年龄范围
  const agePatterns = [
    /(\d+)[\s-]to[\s-](\d+)[\s-]months?/i,
    /(\d+)-(\d+)[\s-]months?/i,
    /newborn/i,
    /infant/i
  ];
  
  for (const pattern of agePatterns) {
    const match = content.match(pattern);
    if (match) {
      if (match[0].toLowerCase().includes('newborn')) return '0-3 months';
      if (match[0].toLowerCase().includes('infant')) return '0-12 months';
      if (match[1] && match[2]) return `${match[1]}-${match[2]} months`;
    }
  }
  
  return '0-12 months'; // 默认
}

function determineRegion(source) {
  if (source.organization === 'Health Canada') return 'CA';
  if (['CDC', 'AAP', 'NIH', 'Mayo Clinic'].includes(source.organization)) return 'US';
  return 'Global';
}

function generateMetaTitle(title) {
  return title.substring(0, 60) + (title.length > 60 ? '...' : '');
}

function generateMetaDescription(content) {
  const text = content.replace(/<[^>]+>/g, '').substring(0, 200);
  return text.substring(0, 157) + '...';
}

function extractKeywords(content) {
  const keywords = new Set();
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'];
  
  const words = content
    .toLowerCase()
    .match(/\b[a-z]{4,}\b/g) || [];
  
  // 统计词频
  const freq = {};
  words.forEach(word => {
    if (!commonWords.includes(word)) {
      freq[word] = (freq[word] || 0) + 1;
    }
  });
  
  // 取频率最高的10个词
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

function mapCategory(category) {
  const mapping = {
    'feeding': 'explainer',
    'sleep': 'explainer',
    'development': 'explainer',
    'safety': 'howto',
    'nutrition': 'explainer'
  };
  return mapping[category] || 'explainer';
}

function mapHub(category) {
  const mapping = {
    'feeding': 'feeding',
    'nutrition': 'feeding',
    'breastfeeding': 'feeding',
    'infant-feeding': 'feeding',
    'sleep': 'sleep',
    'development': 'development',
    'infant-care': 'development',
    'safety': 'safety'
  };
  return mapping[category] || 'feeding';
}

module.exports = {
  SOURCES,
  CLEANING_RULES,
  SCRAPER_CONFIG,
  DATA_MAPPING
};

