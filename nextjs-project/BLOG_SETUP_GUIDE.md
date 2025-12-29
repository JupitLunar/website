# Insights页面设置指南

## 📋 概述

已创建独立的Insights页面来展示自动生成的文章，与权威文章分开显示。

## 🗄️ 数据库迁移

### 步骤1: 运行数据库迁移

在Supabase SQL Editor中运行以下迁移脚本：

```sql
-- 文件位置: supabase/migrations/add_article_source.sql
-- 或者直接复制以下SQL：

ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS article_source TEXT DEFAULT 'authoritative' 
CHECK (article_source IN ('authoritative', 'ai_generated'));

CREATE INDEX IF NOT EXISTS idx_articles_source ON articles(article_source);

UPDATE articles 
SET article_source = 'authoritative' 
WHERE article_source IS NULL;

COMMENT ON COLUMN articles.article_source IS 'Source of the article: authoritative (from trusted sources) or ai_generated (AI-generated content)';
```

### 步骤2: 更新现有文章

运行更新脚本，将已生成的AI文章标记为`ai_generated`：

```bash
cd nextjs-project
node scripts/update-existing-articles-source.js
```

这个脚本会：
- 查找`reviewed_by`为'AI Content Generator'的文章
- 将它们标记为`ai_generated`
- 将其他文章标记为`authoritative`

## 📄 页面结构

### Insights列表页
- **路径**: `/insight`
- **功能**: 显示所有AI生成的文章
- **文件**: `src/app/insight/page.tsx`

### Insights文章详情页
- **路径**: `/insight/[slug]`
- **功能**: 显示单篇AI生成的文章
- **文件**: `src/app/insight/[slug]/page.tsx`

## 🔍 文章分类

### 权威文章 (Authoritative)
- **来源**: 从权威机构爬取的文章（CDC, AAP, WHO等）
- **显示位置**: 
  - `/latest-articles` - 最新文章列表
  - `/hub/[hub-slug]` - 各内容中心
  - `/[slug]` - 文章详情页
- **标记**: `article_source = 'authoritative'`

### Insights文章 (AI-Generated)
- **来源**: 通过OpenAI自动生成的文章
- **显示位置**:
  - `/insight` - Insights列表页
  - `/insight/[slug]` - Insights文章详情页
- **标记**: `article_source = 'ai_generated'`

## 🔧 自动生成脚本更新

生成脚本已更新，新生成的文章会自动标记为`ai_generated`：

```javascript
article_source: 'ai_generated'  // 在auto-generate-articles.js中
```

## 📊 查询过滤

### 权威文章查询
所有权威文章查询已自动过滤掉AI生成的文章：

```typescript
.eq('status', 'published')
.neq('article_source', 'ai_generated')  // 排除AI生成的文章
```

### Insights文章查询
Insights页面只显示AI生成的文章：

```typescript
.eq('article_source', 'ai_generated')
.eq('status', 'published')
```

## 🎨 页面特性

### Insights列表页特性
- ✅ 卡片式布局
- ✅ Hub标签颜色区分
- ✅ 年龄范围显示
- ✅ 发布日期显示
- ✅ 方法与来源说明

### Insights文章页特性
- ✅ Markdown渲染
- ✅ 关键要点突出显示
- ✅ 证据上下文说明
- ✅ 返回Insights列表链接

## 🚀 使用流程

1. **运行数据库迁移** - 添加`article_source`字段
2. **更新现有文章** - 标记已生成的AI文章
3. **访问Insights页面** - 查看`/insight`
4. **自动生成新文章** - GitHub Action会自动标记为`ai_generated`

## 📝 注意事项

1. **数据库迁移必须先运行**，否则查询会失败
2. **已生成的文章需要更新**，使用`update-existing-articles-source.js`脚本
3. **新生成的文章会自动标记**，无需手动操作
4. **权威文章页面不会显示AI生成的文章**，保持内容分离

## 🔄 后续维护

- 新生成的AI文章会自动出现在Insights页面
- 权威文章继续在原有页面显示
- 两个内容源完全分离，互不干扰

---

**最后更新**: 2025-01-XX
