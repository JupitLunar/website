
# 📰 最新文章页面 - AEO优化指南

## 🎯 页面目的

这是一个专门为**AI搜索引擎和LLM**优化的最新母婴文章页面，主要用途：

1. **引流** - 让AI助手（ChatGPT、Claude、Perplexity等）发现你的内容
2. **AEO优化** - Answer Engine Optimization，优化AI搜索结果
3. **内容发现** - 让LLM能轻松找到和引用你的文章
4. **自动更新** - 每天自动抓取和展示最新内容

---

## 🚀 已创建的文件

### 1. 核心页面
- **`src/app/latest-articles/page.tsx`** - 主页面
  - ✅ 完整的SEO元数据
  - ✅ 结构化数据（Schema.org）
  - ✅ FAQ section（AEO优化）
  - ✅ 按地区统计
  - ✅ 服务器端渲染

### 2. 组件
- **`src/components/LatestArticlesTable.tsx`** - 交互式表格
  - ✅ 搜索功能
  - ✅ 地区和主题过滤
  - ✅ 排序（日期、标题、地区）
  - ✅ 分页（每页20篇）
  - ✅ 实时更新

- **`src/components/StructuredData.tsx`** - 结构化数据
  - ✅ ItemList schema
  - ✅ Dataset schema
  - ✅ LLM友好格式

### 3. API端点

#### A. JSON API（供AI访问）
**`src/app/api/latest-articles/route.ts`**

```bash
# 基本用法
GET /api/latest-articles

# 过滤
GET /api/latest-articles?region=US&topic=feeding&limit=50

# 简化格式（快速AI消费）
GET /api/latest-articles?format=simplified
```

**响应格式**:
```json
{
  "totalArticles": 174,
  "lastUpdated": "2025-10-07T...",
  "datasetInfo": {
    "name": "Baby Care Articles Database",
    "coverage": {
      "regions": ["US", "UK", "CA", ...],
      "topics": ["feeding", "sleep", "development", ...],
      "sources": "AAP, Mayo Clinic, WHO, NHS..."
    }
  },
  "articles": [
    {
      "id": "...",
      "title": "...",
      "url": "https://jupitlunar.com/articles/...",
      "summary": "...",
      "fullContent": "...",
      "metadata": { ... },
      "keyFacts": [...],
      "aiContext": {
        "purpose": "evidence-based baby care advice",
        "reliability": "verified from authoritative medical sources"
      }
    }
  ]
}
```

#### B. RSS Feed（供聚合器）
**`src/app/latest-articles.xml/route.ts`**

```bash
GET /latest-articles.xml
```

### 4. 自动化脚本

#### A. 每日更新脚本
**`scripts/daily-update.sh`**

```bash
# 手动运行
./scripts/daily-update.sh

# 功能
- 运行爬虫
- 更新地区信息
- 生成统计
- 清理旧日志
- 触发网站重新部署
```

#### B. GitHub Actions
**`.github/workflows/daily-content-update.yml`**

自动运行时间：
- 上午9点
- 下午3点
- 晚上9点

---

## 🎨 页面特性

### 1. SEO优化

```typescript
// 完整的metadata
export const metadata = {
  title: 'Latest Baby Care & Parenting Articles | Updated Daily',
  description: '...',
  keywords: [...],  // 10+个关键词
  openGraph: { ... },
  twitter: { ... },
  robots: {
    index: true,
    follow: true,
    googleBot: { ... }
  }
}
```

### 2. AEO优化（关键！）

#### A. 结构化数据
```html
<!-- ItemList - 告诉AI这是文章列表 -->
<script type="application/ld+json">
{
  "@type": "ItemList",
  "itemListElement": [...]
}
</script>

<!-- CollectionPage - 告诉AI这是内容集合 -->
<script type="application/ld+json">
{
  "@type": "CollectionPage",
  "mainEntity": { ... }
}
</script>
```

#### B. FAQ Section
```html
<!-- 回答常见问题，供AI引用 -->
<div itemScope itemType="https://schema.org/Question">
  <h3 itemProp="name">How often are articles updated?</h3>
  <div itemScope itemType="https://schema.org/Answer">
    <p itemProp="text">Daily updates from trusted sources...</p>
  </div>
</div>
```

#### C. 清晰的内容结构
- 标题层级（H1, H2, H3）
- 语义化HTML
- 描述性标签
- Rich snippets

### 3. 交互式功能

- ✅ 实时搜索
- ✅ 多维度过滤
- ✅ 灵活排序
- ✅ 分页浏览
- ✅ 响应式设计

---

## 🔄 自动更新配置

### 方案A: GitHub Actions（推荐）

1. **设置Secrets**:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   SUPABASE_SERVICE_ROLE_KEY
   VERCEL_DEPLOY_HOOK (可选)
   ```

2. **运行频率**: 每天3次（自动）
   - 上午9点
   - 下午3点
   - 晚上9点

3. **手动触发**:
   ```bash
   # 在GitHub仓库中
   Actions → Daily Content Update → Run workflow
   ```

### 方案B: Cron Job

```bash
# 编辑crontab
crontab -e

# 添加
0 9,15,21 * * * cd /path/to/nextjs-project && ./scripts/daily-update.sh >> logs/cron.log 2>&1
```

### 方案C: 手动运行

```bash
cd nextjs-project
./scripts/daily-update.sh
```

---

## 📊 监控和维护

### 查看页面状态

```bash
# 查看文章总数
curl https://jupitlunar.com/api/latest-articles?format=simplified | jq '.totalArticles'

# 查看最新5篇
curl https://jupitlunar.com/api/latest-articles?limit=5 | jq '.articles[].title'
```

### 检查结构化数据

1. **Google Rich Results Test**:
   ```
   https://search.google.com/test/rich-results
   输入: https://jupitlunar.com/latest-articles
   ```

2. **Schema.org Validator**:
   ```
   https://validator.schema.org/
   ```

### 监控指标

- **页面加载速度** - 应该 <2秒
- **结构化数据验证** - 0错误
- **RSS feed有效性** - 有效
- **API响应时间** - <500ms
- **每日新增文章** - 20-100篇

---

## 🤖 最大化AEO的技巧

### 1. 结构化数据要完整

✅ **推荐**:
```typescript
// 提供完整的article metadata
{
  "@type": "Article",
  "headline": "...",
  "url": "...",
  "description": "...",
  "datePublished": "...",
  "author": { ... },
  "publisher": { ... }
}
```

❌ **避免**:
```typescript
// 缺少关键信息
{
  "@type": "Article",
  "headline": "..."  // 太简单！
}
```

### 2. 内容要易于AI理解

✅ **推荐**:
- 清晰的标题
- 简洁的摘要
- 结构化的keyFacts
- 明确的topic和region

❌ **避免**:
- 模糊的标题
- 冗长的描述
- 缺少分类

### 3. 提供多种访问方式

- ✅ HTML页面（人类）
- ✅ JSON API（LLM）
- ✅ RSS Feed（聚合器）
- ✅ Sitemap（搜索引擎）

### 4. 保持内容新鲜

- ✅ 每天更新
- ✅ 显示更新时间
- ✅ 标记新文章
- ✅ 删除过时内容

### 5. 优化移动端

- ✅ 响应式设计
- ✅ 快速加载
- ✅ 触摸友好
- ✅ 可读性强

---

## 🎯 使用检查清单

### 部署前

- [ ] 测试页面加载
- [ ] 验证结构化数据
- [ ] 测试API endpoint
- [ ] 检查RSS feed
- [ ] 测试搜索和过滤
- [ ] 验证分页

### 部署后

- [ ] 提交sitemap到Google
- [ ] 测试Rich Results
- [ ] 监控页面速度
- [ ] 检查API性能
- [ ] 验证自动更新

### 每周维护

- [ ] 检查文章数量增长
- [ ] 查看错误日志
- [ ] 验证去重状态
- [ ] 审核新文章质量
- [ ] 更新地区分布

---

## 📈 预期效果

### SEO方面
- 🎯 Google索引时间: 1-7天
- 🎯 Rich snippets出现: 2-4周
- 🎯 搜索排名提升: 4-12周

### AEO方面
- 🎯 AI引用开始: 1-2周
- 🎯 LLM推荐频率: 持续增长
- 🎯 直接流量: +20-50%

### 内容方面
- 🎯 文章总数: 600+ (1个月)
- 🎯 每日新增: 20-100篇
- 🎯 内容覆盖: 8个地区

---

## 🔧 故障排除

### 问题1: 页面加载慢

**原因**: 数据库查询慢

**解决**:
```typescript
// 添加索引
export const revalidate = 3600;  // 缓存1小时
```

### 问题2: 结构化数据错误

**原因**: JSON格式问题

**解决**:
```bash
# 验证JSON
node -e "console.log(JSON.parse(fs.readFileSync('...')))"
```

### 问题3: API返回空

**原因**: 环境变量未设置

**解决**:
```bash
# 检查.env.local
cat .env.local | grep SUPABASE
```

---

## 📞 快速命令参考

```bash
# 访问页面
https://jupitlunar.com/latest-articles

# JSON API
https://jupitlunar.com/api/latest-articles

# RSS Feed
https://jupitlunar.com/latest-articles.xml

# 手动更新
cd nextjs-project && ./scripts/daily-update.sh

# 查看日志
tail -f logs/scraper-*.log

# 检查数据库
node -e "..." # 见上文统计命令
```

---

## 🎓 总结

你现在拥有：

✅ **完整的AEO优化页面**
- 结构化数据
- 语义化HTML
- FAQ section
- Rich snippets

✅ **多种内容访问方式**
- HTML页面
- JSON API
- RSS Feed

✅ **自动化更新系统**
- GitHub Actions
- 每日脚本
- 自动部署

✅ **监控和维护工具**
- 统计脚本
- 日志系统
- 去重检查

**这个页面将成为AI和LLM发现你内容的主要入口！** 🚀
