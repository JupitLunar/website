# 爬虫脚本完整清单

> **最后更新**: 2025-12-24  
> **版本**: 2.2

---

## 📋 脚本分类

### 🎯 主要爬虫脚本

#### 1. 传统爬虫（Cheerio + Axios）

**`scripts/global-auto-scraper.js`**
- **用途**: 主要的全球爬虫脚本（传统方式）
- **技术**: Cheerio + Axios
- **覆盖**: 18+ 个权威站点
- **运行**: `npm run scrape` 或 `node scripts/global-auto-scraper.js`
- **状态**: ✅ 可用

**`scripts/auto-scraper.js`**
- **用途**: 自动爬虫（简化版）
- **状态**: ✅ 可用

**`scripts/web-scraper.js`**
- **用途**: Web 爬虫
- **运行**: `npm run scrape:web`
- **状态**: ✅ 可用

---

#### 2. Playwright 爬虫（用于反爬站点）✨新增

**`scripts/playwright-scraper-nhs-only.js`** ⭐推荐
- **用途**: NHS 专用爬虫
- **运行**: `npm run scrape:playwright:nhs`
- **成功率**: 100%
- **已抓取**: 11 篇文章
- **状态**: ✅ 完全可用

**`scripts/playwright-scraper-aap-cdc.js`**
- **用途**: AAP 和 CDC 爬虫
- **运行**: `npm run scrape:playwright:aap-cdc`
- **成功率**: CDC 60%, AAP 需优化
- **已抓取**: CDC 12篇, AAP 0篇（发现116篇链接）
- **状态**: ✅ 部分可用

**`scripts/playwright-scraper-more-sites.js`**
- **用途**: 更多站点爬虫（Health Canada, Mayo Clinic 等）
- **运行**: `npm run scrape:playwright:more`
- **已抓取**: Health Canada 1篇
- **状态**: ✅ 可用

**`scripts/playwright-scraper-full.js`**
- **用途**: 完整版 Playwright 爬虫（所有可访问站点）
- **运行**: `npm run scrape:playwright`
- **状态**: ✅ 可用

**`scripts/playwright-scraper-test.js`**
- **用途**: 测试脚本，验证 Playwright 能否访问特定 URL
- **运行**: `node scripts/playwright-scraper-test.js`
- **状态**: ✅ 可用

**`scripts/browser-scraper.js`**
- **用途**: Puppeteer 增强版（旧版本，已被 Playwright 替代）
- **状态**: ⚠️ 已废弃（推荐使用 Playwright）

---

### 🛠️ 工具脚本

**`scripts/sync-to-rag.js`** ✨新增
- **用途**: 同步 articles 到 knowledge_chunks (RAG)
- **运行**: `npm run sync:rag`
- **功能**:
  - 发布草稿文章（status: draft → published）
  - 调用 `populate_knowledge_chunks()` RPC
  - 显示统计信息
- **状态**: ✅ 可用

**`scripts/article-dedup.js`** ✨新增
- **用途**: 统一的文章去重函数
- **功能**:
  - URL 规范化
  - 双重检查（URL + Slug）
  - 详细的重复原因说明
- **使用**: 被所有爬虫脚本导入使用
- **状态**: ✅ 可用

**`scripts/check-duplicates.js`** ✨新增
- **用途**: 检查数据库中的重复文章
- **运行**: `npm run check:duplicates`
- **功能**:
  - 检查 URL 重复
  - 检查 Slug 重复
  - 检查相似标题
- **状态**: ✅ 可用

**`scripts/check-recent-inserts.js`** ✨新增
- **用途**: 检查最近插入的文章（Playwright 爬虫）
- **运行**: `node scripts/check-recent-inserts.js`
- **状态**: ✅ 可用

**`scripts/check-authority-sites.js`** ✨新增
- **用途**: 检查权威站点（AAP、CDC、NHS）的抓取情况
- **运行**: `node scripts/check-authority-sites.js`
- **状态**: ✅ 可用

**`scripts/scraper-stats.js`**
- **用途**: 爬虫统计信息
- **运行**: `npm run scrape:stats` 或 `npm run scrape:report`
- **状态**: ✅ 可用

**`scripts/review-scraped-content.js`**
- **用途**: 审核抓取的内容
- **运行**: `npm run scrape:review`
- **状态**: ✅ 可用

---

### 🔍 调试和测试脚本

**`scripts/test-aap-cdc-chrome.js`** ✨新增
- **用途**: 测试 AAP 和 CDC 使用不同浏览器配置
- **运行**: `node scripts/test-aap-cdc-chrome.js`
- **状态**: ✅ 可用

**`scripts/debug-aap-links.js`** ✨新增
- **用途**: 调试 AAP 链接发现，查看实际的链接格式
- **运行**: `node scripts/debug-aap-links.js`
- **状态**: ✅ 可用

**`scripts/debug-aap-content.js`** ✨新增
- **用途**: 调试 AAP 内容提取，查看实际的 DOM 结构
- **运行**: `node scripts/debug-aap-content.js`
- **状态**: ✅ 可用

**`scripts/test-scraper-quick.js`**
- **用途**: 快速测试爬虫
- **运行**: `node scripts/test-scraper-quick.js`
- **状态**: ✅ 可用

---

### ⚙️ 配置和工具文件

**`scripts/global-sources-config.js`**
- **用途**: 全球权威站点配置
- **内容**: 18+ 个站点的配置（URL、分类、链接模式等）
- **状态**: ✅ 维护中

**`scripts/scraper-utils.js`**
- **用途**: 共享工具函数
- **功能**: 内容提取、验证、Slug 生成、关键词提取等
- **状态**: ✅ 维护中

**`scripts/scraper-config.js`**
- **用途**: 爬虫配置文件
- **状态**: ✅ 可用

---

## 📊 脚本使用统计

### 最常用的脚本

1. ⭐ `playwright-scraper-nhs-only.js` - NHS 专用（推荐）
2. ⭐ `playwright-scraper-aap-cdc.js` - AAP 和 CDC
3. `global-auto-scraper.js` - 传统爬虫
4. `sync-to-rag.js` - 同步到 RAG
5. `check-duplicates.js` - 检查重复

---

## 🔄 脚本状态

### ✅ 完全可用

- `playwright-scraper-nhs-only.js` - NHS (100%)
- `playwright-scraper-aap-cdc.js` - CDC (60%), AAP (需优化)
- `playwright-scraper-more-sites.js` - Health Canada 等
- `sync-to-rag.js` - RAG 同步
- `article-dedup.js` - 去重函数
- `check-duplicates.js` - 重复检查
- `check-recent-inserts.js` - 最近插入检查
- `check-authority-sites.js` - 权威站点检查

### ⚠️ 需要优化

- `playwright-scraper-aap-cdc.js` - AAP 内容提取需优化

### 📝 已废弃

- `browser-scraper.js` - 已被 Playwright 替代

---

## 📝 NPM 命令映射

```json
{
  "scrape": "node scripts/global-auto-scraper.js",
  "scrape:global": "node scripts/global-auto-scraper.js",
  "scrape:auto": "node scripts/auto-scraper.js",
  "scrape:web": "node scripts/web-scraper.js",
  "scrape:test": "node scripts/web-scraper.js --test",
  "scrape:review": "node scripts/review-scraped-content.js",
  "scrape:stats": "node scripts/scraper-stats.js",
  "scrape:report": "node scripts/scraper-stats.js --report",
  "scrape:playwright": "node scripts/playwright-scraper-full.js",
  "scrape:playwright:nhs": "node scripts/playwright-scraper-nhs-only.js",
  "scrape:playwright:more": "node scripts/playwright-scraper-more-sites.js",
  "scrape:playwright:aap-cdc": "node scripts/playwright-scraper-aap-cdc.js",
  "sync:rag": "node scripts/sync-to-rag.js",
  "check:duplicates": "node scripts/check-duplicates.js"
}
```

---

## 🎯 推荐工作流程

### 日常抓取

```bash
# 1. NHS（最稳定）
npm run scrape:playwright:nhs

# 2. CDC 和 AAP
npm run scrape:playwright:aap-cdc

# 3. 更多站点
npm run scrape:playwright:more

# 4. 同步到 RAG
npm run sync:rag

# 5. 检查重复
npm run check:duplicates

# 6. 查看统计
npm run scrape:stats
```

### 调试流程

```bash
# 1. 测试特定站点
node scripts/playwright-scraper-test.js

# 2. 调试链接发现
node scripts/debug-aap-links.js

# 3. 调试内容提取
node scripts/debug-aap-content.js

# 4. 检查最近插入
node scripts/check-recent-inserts.js
```

---

**文档结束** - 最后更新：2025-12-24

