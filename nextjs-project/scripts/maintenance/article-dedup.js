#!/usr/bin/env node

/**
 * 统一的文章去重函数
 * 提供更严格的重复检查逻辑，确保数据库中没有重复文章
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const { generateSlug } = require('../scrapers/scraper-utils');

const dotenv = require('dotenv');
// Load env vars from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 规范化 URL（移除 trailing slash, fragment, query params）
 */
function normalizeUrl(url) {
  if (!url) return '';

  try {
    const urlObj = new URL(url);
    // 移除 fragment 和 query
    urlObj.hash = '';
    urlObj.search = '';
    // 移除 trailing slash（保留根路径）
    let pathname = urlObj.pathname;
    if (pathname.length > 1 && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }
    urlObj.pathname = pathname;
    return urlObj.toString().toLowerCase();
  } catch (e) {
    // 如果 URL 解析失败，返回原 URL
    return url.toLowerCase();
  }
}

/**
 * 增强的文章去重检查
 * @param {string} url - 文章 URL
 * @param {string} title - 文章标题
 * @returns {Promise<{exists: boolean, reason?: string, existingId?: string}>}
 */
async function articleExists(url, title) {
  if (!url && !title) {
    return { exists: false };
  }

  // 检查 1: 通过规范化 URL
  if (url) {
    const normalizedUrl = normalizeUrl(url);

    // 查询所有文章，检查 license 字段中的 URL
    const { data: articles, error } = await supabase
      .from('articles')
      .select('id, license, title');

    if (!error && articles) {
      for (const article of articles) {
        const licenseUrl = article.license?.match(/URL:\s*(https?:\/\/[^\s|]+)/i);
        if (licenseUrl) {
          const existingNormalizedUrl = normalizeUrl(licenseUrl[1]);
          if (existingNormalizedUrl === normalizedUrl) {
            return {
              exists: true,
              reason: 'URL已存在（规范化后匹配）',
              existingId: article.id
            };
          }
        }
      }
    }

    // 也检查 URL 直接包含的情况（向后兼容）
    const { data: urlMatch } = await supabase
      .from('articles')
      .select('id, title')
      .ilike('license', `%${url}%`)
      .limit(1);

    if (urlMatch && urlMatch.length > 0) {
      return {
        exists: true,
        reason: 'URL已存在',
        existingId: urlMatch[0].id
      };
    }
  }

  // 检查 2: 通过标题 Slug（防止同一文章不同URL）
  if (title) {
    const slug = generateSlug(title);
    const { data: slugMatch } = await supabase
      .from('articles')
      .select('id, title, license')
      .eq('slug', slug)
      .limit(1);

    if (slugMatch && slugMatch.length > 0) {
      // 额外检查：如果 URL 也匹配，更确定是重复
      if (url) {
        const existingUrl = slugMatch[0].license?.match(/URL:\s*(https?:\/\/[^\s|]+)/i);
        if (existingUrl) {
          const normalizedExisting = normalizeUrl(existingUrl[1]);
          const normalizedNew = normalizeUrl(url);
          if (normalizedExisting === normalizedNew) {
            return {
              exists: true,
              reason: 'URL和标题都已存在（完全重复）',
              existingId: slugMatch[0].id
            };
          }
        }
      }

      return {
        exists: true,
        reason: '标题已存在（Slug重复）',
        existingId: slugMatch[0].id
      };
    }
  }

  return { exists: false };
}

module.exports = { articleExists, normalizeUrl };


