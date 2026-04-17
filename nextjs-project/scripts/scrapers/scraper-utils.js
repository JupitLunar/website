#!/usr/bin/env node

/**
 * Scraper 共享工具函数
 * 提供统一的内容提取、验证和处理逻辑
 */

const cheerio = require('cheerio');

/**
 * 智能提取标题
 * 尝试多种选择器
 */
function extractTitle($) {
  const titleSelectors = [
    'h1',
    'h2.title',
    '.title h1',
    '.article-title',
    '.post-title',
    'meta[property="og:title"]',
    'title'
  ];
  
  for (const selector of titleSelectors) {
    let title = '';
    if (selector.startsWith('meta')) {
      title = $(selector).attr('content') || '';
    } else {
      title = $(selector).first().text().trim();
    }
    if (title && title.length > 5) {
      return title;
    }
  }
  
  return '';
}

/**
 * 智能提取主要内容
 * 使用多种策略查找和提取内容
 */
function extractContent($) {
  // 移除噪音标签（扩展版）
  $('script, style, nav, header, footer, aside, iframe, .advertisement, .social-share, .comment, .related, .sidebar, .navigation, .menu, .breadcrumb, .share, .author-bio, form, button, .ad, .banner, #comments').remove();

  const paragraphs = [];
  
  // 策略 1: 查找主要内容容器
  const contentSelectors = [
    'article',
    '.article-content',
    '.post-content', 
    '.entry-content',
    '.content-body',
    'main',
    '#content',
    '.content',
    '[role="main"]',
    '.main-content'
  ];

  let mainContent = null;
  for (const selector of contentSelectors) {
    const elem = $(selector).first();
    if (elem.length > 0 && elem.text().trim().length > 100) {
      mainContent = elem;
      break;
    }
  }

  // 策略 2: 从主要内容或整个body提取文本
  const container = mainContent || $('body');
  
  // 提取段落、列表项、表格单元格等
  container.find('p, li, td, dd, blockquote, .text-content').each((i, elem) => {
    const $elem = $(elem);
    const text = $elem.text().trim();
    
    // 过滤条件：
    // - 太短的段落（<30字符）
    // - 太长的段落（>2000字符，可能是整页内容）
    // - 包含过多链接的段落（可能是导航）
    const linkRatio = $elem.find('a').length / Math.max(1, text.split(/\s+/).length);
    
    if (text.length >= 30 && text.length <= 2000 && linkRatio < 0.3) {
      // 避免重复段落
      if (!paragraphs.includes(text)) {
        paragraphs.push(text);
      }
    }
  });

  return {
    paragraphs,
    content: paragraphs.join('\n\n'),
    paragraphCount: paragraphs.length,
    wordCount: paragraphs.join(' ').split(/\s+/).length
  };
}

/**
 * 验证内容质量
 */
function validateContent(title, content, options = {}) {
  const {
    minContentLength = 300,
    maxContentLength = 50000,
    minParagraphs = 3,
    debugMode = false
  } = options;

  const hasTitle = title && title.length > 5;
  const hasMinLength = content.length >= minContentLength;
  const hasMaxLength = content.length <= maxContentLength;
  
  // 计算段落数
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 30);
  const hasEnoughParagraphs = paragraphs.length >= minParagraphs;

  // 调试信息
  if (debugMode) {
    console.log(`    🔍 内容质量检查:`);
    console.log(`       - 标题: ${title ? title.substring(0, 50) + '...' : '无'}`);
    console.log(`       - 段落数: ${paragraphs.length}`);
    console.log(`       - 字符数: ${content.length}`);
    console.log(`       - 单词数: ${content.split(/\s+/).length}`);
  }

  // 质量检查
  const failures = [];
  if (!hasTitle) failures.push('缺少标题');
  if (!hasMinLength) failures.push(`内容太短: ${content.length} < ${minContentLength} 字符`);
  if (!hasMaxLength) failures.push(`内容太长: ${content.length} > ${maxContentLength} 字符`);
  if (!hasEnoughParagraphs) failures.push(`段落太少: ${paragraphs.length} < ${minParagraphs} 段`);

  if (failures.length > 0) {
    return {
      valid: false,
      failures,
      stats: {
        titleLength: title.length,
        contentLength: content.length,
        paragraphCount: paragraphs.length
      }
    };
  }

  return {
    valid: true,
    stats: {
      titleLength: title.length,
      contentLength: content.length,
      paragraphCount: paragraphs.length
    }
  };
}

/**
 * 完整的文章提取流程
 */
function extractArticle(html, options = {}) {
  const $ = cheerio.load(html);
  
  // 提取标题和内容
  const title = extractTitle($);
  const { paragraphs, content, paragraphCount, wordCount } = extractContent($);
  
  // 验证质量
  const validation = validateContent(title, content, options);
  
  if (!validation.valid) {
    return {
      success: false,
      failures: validation.failures,
      stats: validation.stats
    };
  }
  
  return {
    success: true,
    data: {
      title,
      content,
      paragraphs,
      paragraphCount,
      wordCount
    },
    stats: validation.stats
  };
}

/**
 * 生成 slug
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100)
    .replace(/^-+|-+$/g, ''); // 移除首尾的连字符
}

function stripHtml(text = '') {
  return text.replace(/<[^>]+>/g, ' ');
}

function normalizeText(text = '') {
  return stripHtml(text).replace(/\s+/g, ' ').trim();
}

function clampText(text = '', maxLength = 160) {
  const normalized = normalizeText(text);
  if (!normalized) return '';
  if (normalized.length <= maxLength) return normalized;

  const sliced = normalized.slice(0, maxLength);
  const lastSpace = sliced.lastIndexOf(' ');
  return `${(lastSpace > 40 ? sliced.slice(0, lastSpace) : sliced).trim()}...`;
}

function cleanTitleText(title = '', maxLength = 200) {
  const cleaned = normalizeText(title)
    .replace(/[|]{2,}/g, '|')
    .replace(/\s+[|:-]\s*$/, '');

  return cleaned.slice(0, maxLength).trim();
}

function buildContentOneLiner(content = '', sourceName = '') {
  const normalized = normalizeText(content);
  if (!normalized) {
    return sourceName
      ? `Structured summary from ${sourceName} for clearer caregiver guidance.`
      : 'Structured summary from a public health source for clearer caregiver guidance.';
  }

  const sentences = normalized.match(/[^.!?]+[.!?]+/g) || [];
  let candidate = sentences.find(sentence => sentence.trim().length >= 60) || sentences[0] || normalized;
  candidate = clampText(candidate, 180);

  if (candidate.length < 50) {
    candidate = clampText(normalized, 180);
  }

  if (candidate.length < 50) {
    return sourceName
      ? `Structured summary from ${sourceName} for clearer caregiver guidance.`
      : 'Structured summary from a public health source for clearer caregiver guidance.';
  }

  return candidate;
}

function buildMetaTitle(title = '', suffix = 'Mom AI Agent', maxLength = 68) {
  const cleanTitle = cleanTitleText(title, 200);
  if (!cleanTitle) return suffix;

  const full = `${cleanTitle} | ${suffix}`;
  if (full.length <= maxLength) return full;

  if (cleanTitle.length <= maxLength) return cleanTitle;
  return clampText(cleanTitle, maxLength);
}

function buildMetaDescription(content = '', sourceName = '') {
  const summary = buildContentOneLiner(content, sourceName);
  return clampText(summary || content, 160);
}

function buildDefaultKeyFacts({ sourceName, region } = {}) {
  return [
    sourceName ? `Source: ${sourceName}` : 'Source: Public guidance',
    region ? `Region: ${region}` : 'Region: Global',
    'Structured summary prepared for clearer caregiver reference'
  ];
}

/**
 * 提取关键词
 */
function extractKeywords(content, limit = 10) {
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might',
    'can', 'your', 'you', 'they', 'them', 'their', 'this', 'that', 'with',
    'from', 'about', 'when', 'what', 'which', 'who', 'how', 'if', 'as', 'by',
    'baby', 'babies', 'parent', 'parents', 'care', 'health', 'children',
    'information', 'guidance', 'source', 'sources', 'article', 'articles'
  ]);

  const words = content
    .toLowerCase()
    .match(/\b[a-z]{4,}\b/g) || [];

  const freq = {};
  words.forEach(word => {
    if (!commonWords.has(word)) {
      freq[word] = (freq[word] || 0) + 1;
    }
  });

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

/**
 * 延迟函数
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 带重试的 HTTP 请求（可选 Puppeteer 兜底）
 */
async function fetchWithRetry(url, retries = 3, delayMs = 1000, options = {}) {
  const axios = require('axios');
  const {
    headers = {},
    timeout = 30000,
    usePuppeteerFallback = false,
    forcePuppeteer = false,
    puppeteerDomains = [],
    puppeteerTimeout = 45000,
    blockPatterns = DEFAULT_BLOCK_PATTERNS
  } = options;
  
  if (forcePuppeteer) {
    const rendered = await fetchWithPuppeteer(url, {
      headers: { 'User-Agent': DEFAULT_USER_AGENT, ...headers },
      timeout: puppeteerTimeout
    });
    if (rendered) return rendered;
  }

  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': DEFAULT_USER_AGENT,
          ...headers
        },
        timeout,
        validateStatus: (status) => status < 500
      });
      
      if (response.status === 200) {
        const html = response.data || '';
        if (usePuppeteerFallback && shouldUsePuppeteer(url, html, puppeteerDomains, blockPatterns)) {
          const rendered = await fetchWithPuppeteer(url, {
            headers: { 'User-Agent': DEFAULT_USER_AGENT, ...headers },
            timeout: puppeteerTimeout
          });
          return rendered || html;
        }
        return html;
      }
      
      if (response.status === 404) {
        return null; // 页面不存在，不需要重试
      }
      
      if (usePuppeteerFallback && (response.status === 403 || response.status === 429)) {
        const rendered = await fetchWithPuppeteer(url, {
          headers: { 'User-Agent': DEFAULT_USER_AGENT, ...headers },
          timeout: puppeteerTimeout
        });
        if (rendered) return rendered;
      }
      
    } catch (error) {
      if (i === retries - 1) {
        console.error(`    ❌ 请求失败 (${retries}次重试后): ${error.message}`);
        return null;
      }
      await delay(delayMs * (i + 1)); // 递增延迟
    }
  }
  
  return null;
}

const DEFAULT_USER_AGENT = 'Mozilla/5.0 (compatible; ScraperBot/1.0; +https://momaiagent.com/bot)';

const DEFAULT_BLOCK_PATTERNS = [
  /access denied/i,
  /bot detection/i,
  /captcha/i,
  /cloudflare/i,
  /pardon the interruption/i,
  /please enable javascript/i,
  /perimeterx/i,
  /akamai/i
];

function shouldUsePuppeteer(url, html, domains, blockPatterns) {
  try {
    const parsed = new URL(url);
    if (Array.isArray(domains) && domains.length > 0) {
      const host = parsed.hostname.toLowerCase();
      const matched = domains.some(domain => host.endsWith(domain));
      if (!matched) return false;
    }
  } catch {
    return false;
  }
  const content = html || '';
  return blockPatterns.some(pattern => pattern.test(content));
}

async function fetchWithPuppeteer(url, options = {}) {
  const { headers = {}, timeout = 45000 } = options;
  let browser;
  
  try {
    const puppeteer = require('puppeteer');
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    if (headers['User-Agent']) {
      await page.setUserAgent(headers['User-Agent']);
    }
    await page.setExtraHTTPHeaders({
      'Accept-Language': headers['Accept-Language'] || 'en-US,en;q=0.9'
    });
    
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const type = req.resourceType();
      if (['image', 'stylesheet', 'font', 'media'].includes(type)) {
        req.abort();
      } else {
        req.continue();
      }
    });
    
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout });
    if (!response) return null;
    
    const html = await page.content();
    return html || null;
  } catch (error) {
    console.error(`    ❌ Puppeteer抓取失败: ${error.message}`);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// 导出 articleExists 用于向后兼容（如果已经定义）
// 注意：新的脚本应该使用 scripts/article-dedup.js 中的增强版本

module.exports = {
  extractTitle,
  extractContent,
  validateContent,
  extractArticle,
  generateSlug,
  cleanTitleText,
  buildContentOneLiner,
  buildMetaTitle,
  buildMetaDescription,
  buildDefaultKeyFacts,
  extractKeywords,
  delay,
  fetchWithRetry
};








