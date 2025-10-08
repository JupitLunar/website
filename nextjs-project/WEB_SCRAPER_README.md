# 🌐 Web Scraper 系统

## 📋 系统概述

一个专业的网页爬虫系统，用于从权威健康网站抓取婴幼儿护理内容，自动存储到 Supabase 数据库。

### 核心特性

✅ **11 个权威来源** - CDC, AAP, NHS, WHO, NIH 等  
✅ **自动去重** - 基于 slug 防止重复插入  
✅ **REST API** - 可从任何平台调用  
✅ **Bearer Token 认证** - 安全的 API 访问  
✅ **23 个目标页面** - 涵盖喂养、睡眠、发育等主题  
✅ **智能内容提取** - 自动提取标题、段落、列表  
✅ **Markdown 转换** - 自动转换为 Markdown 格式  

---

## 📁 项目结构

```
nextjs-project/
├── src/
│   └── app/
│       └── api/
│           └── scraper/
│               ├── run/
│               │   └── route.ts          # 主 API 端点
│               └── status/
│                   └── route.ts          # 状态检查端点
├── scripts/
│   ├── scraper-config.js                # 爬虫配置（11个来源）
│   ├── web-scraper.js                   # 爬虫核心逻辑
│   ├── demo-insert-data.js              # 演示数据插入
│   ├── test-scraper-full.js             # 完整测试脚本
│   ├── review-scraped-content.js        # 内容审核工具
│   └── scraper-stats.js                 # 统计工具
├── supabase/
│   └── schema.sql                       # 数据库 schema
├── WEB_SCRAPER_API.md                   # 完整 API 文档
├── QUICK_START.md                       # 快速开始指南
└── .env.example                         # 环境变量模板
```

---

## 🚀 快速开始

### 1. 安装依赖

```bash
cd nextjs-project
npm install
```

**主要依赖：**
- `axios` - HTTP 请求
- `cheerio` - HTML 解析
- `@supabase/supabase-js` - 数据库连接

### 2. 配置环境变量

复制 `.env.example` 到 `.env.local`：

```bash
cp env.example .env.local
```

编辑 `.env.local`：

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# API Key（生成：openssl rand -base64 32）
SCRAPER_API_KEY=your-secure-random-key
```

### 3. 本地测试

启动开发服务器：

```bash
npm run dev
```

运行演示数据插入：

```bash
node scripts/demo-insert-data.js
```

测试 API：

```bash
curl -X POST http://localhost:3000/api/scraper/run \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"sources": ["CDC"]}'
```

### 4. 部署

部署到 Vercel：

```bash
vercel
```

在 Vercel Dashboard 添加环境变量。

---

## 🌍 支持的权威来源

| 来源代码 | 机构全称 | 页面数 | 国家/地区 |
|---------|---------|--------|----------|
| `CDC` | Centers for Disease Control and Prevention | 2 | 美国 🇺🇸 |
| `AAP` | American Academy of Pediatrics | 2 | 美国 🇺🇸 |
| `NHS` | UK National Health Service | 3 | 英国 🇬🇧 |
| `WHO` | World Health Organization | 1 | 全球 🌍 |
| `NIH` | National Institutes of Health | 1 | 美国 🇺🇸 |
| `HEALTH_CANADA` | Health Canada | 1 | 加拿大 🇨🇦 |
| `MAYO_CLINIC` | Mayo Clinic | 2 | 美国 🇺🇸 |
| `CLEVELAND_CLINIC` | Cleveland Clinic | 2 | 美国 🇺🇸 |
| `STANFORD_CHILDRENS` | Stanford Children's Health | 2 | 美国 🇺🇸 |
| `KIDSHEALTH` | KidsHealth (Nemours) | 3 | 美国 🇺🇸 |
| `LLLI` | La Leche League International | 1 | 全球 🌍 |

**总计：11 个权威机构，23 个目标页面**

---

## 📡 API 使用

### 运行爬虫

```bash
POST /api/scraper/run
```

**Headers:**
```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

**Body (可选):**
```json
{
  "sources": ["CDC", "AAP", "NHS"]
}
```

**响应:**
```json
{
  "success": true,
  "message": "Scraping completed",
  "data": {
    "total": 5,
    "successful": 4,
    "failed": 0,
    "skipped": 1,
    "articles": [...],
    "timestamp": "2025-10-08T12:00:00.000Z"
  }
}
```

### 查看配置

```bash
GET /api/scraper/run
```

**Headers:**
```
Authorization: Bearer YOUR_API_KEY
```

**响应:**
```json
{
  "success": true,
  "message": "Scraper configuration",
  "data": {
    "sources": [...],
    "totalSources": 11,
    "totalPages": 23,
    "status": "ready"
  }
}
```

详细文档：[WEB_SCRAPER_API.md](./WEB_SCRAPER_API.md)

---

## 🗃️ 数据库结构

### `articles` 表

存储抓取的文章内容。

**关键字段：**
- `slug` (TEXT, UNIQUE) - 唯一标识符
- `title` (TEXT) - 文章标题
- `type` (TEXT) - 类型（explainer, howto）
- `hub` (TEXT) - 分类（feeding, sleep, development）
- `body_md` (TEXT) - Markdown 内容
- `key_facts` (TEXT[]) - 关键事实数组
- `status` (TEXT) - 状态（draft, published）
- `created_at` (TIMESTAMPTZ) - 创建时间

### `kb_sources` 表

存储来源机构信息。

**关键字段：**
- `name` (TEXT, UNIQUE) - 来源名称
- `organization` (TEXT) - 机构名称
- `url` (TEXT) - 官方网站
- `grade` (TEXT) - 权威等级（A, B, C）

### `citations` 表

存储引用关系。

**关键字段：**
- `article_id` (UUID) - 关联文章
- `claim` (TEXT) - 引用声明
- `url` (TEXT) - 引用链接
- `publisher` (TEXT) - 发布者

完整 schema：[supabase/schema.sql](./supabase/schema.sql)

---

## 🔄 去重机制

系统使用 **slug 唯一性** 实现自动去重：

1. 每篇文章生成唯一 slug（基于标题）
2. 插入前检查 `articles` 表是否存在该 slug
3. 如果存在，跳过插入并记录日志
4. 如果不存在，插入新记录

**示例日志：**
```
✅ infant-nutrition-cdc - 已存在，跳过
✅ safe-sleep-practices-aap - 成功插入
```

---

## 🛠️ 工具脚本

### 演示数据插入

快速插入 2 篇演示文章（CDC + AAP）：

```bash
node scripts/demo-insert-data.js
```

### 完整测试

测试实际网页抓取：

```bash
node scripts/test-scraper-full.js
```

### 内容审核

查看已抓取的内容：

```bash
node scripts/review-scraped-content.js
```

### 统计信息

生成抓取统计报告：

```bash
node scripts/scraper-stats.js
```

---

## 🔐 安全最佳实践

### 1. API Key 管理

- ✅ 使用强随机密钥（32+ 字符）
- ✅ 存储在环境变量中
- ✅ 永远不要提交到 Git
- ✅ 定期轮换密钥

**生成密钥：**
```bash
openssl rand -base64 32
```

### 2. 访问控制

- ✅ 使用 Bearer Token 认证
- ✅ 验证所有请求的 Authorization header
- ✅ 考虑添加 IP 白名单
- ✅ 记录所有 API 调用

### 3. 礼貌爬取

- ✅ 控制并发请求（当前：2）
- ✅ 请求间延迟（当前：1秒）
- ✅ 尊重 robots.txt
- ✅ 使用合适的 User-Agent

---

## 📊 使用场景

### 场景 1: 从其他网站调用

你的其他应用可以通过 API 触发爬虫：

```javascript
// 在你的其他网站/应用中
fetch('https://your-domain.vercel.app/api/scraper/run', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${SCRAPER_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    sources: ['CDC', 'AAP']
  })
});
```

### 场景 2: 使用 Zapier/Make 定时

1. 在 Zapier 创建 Zap
2. Trigger: Schedule（例如每周一次）
3. Action: Webhooks → POST
4. 配置 URL 和 Authorization header

### 场景 3: 手动触发

使用 cURL 或 Postman 手动触发爬虫。

---

## ⚙️ 配置修改

### 添加新的数据源

编辑 `scripts/scraper-config.js`：

```javascript
const SOURCES = {
  // ... 现有来源
  
  NEW_SOURCE: {
    id: 'new-source-id',
    name: 'New Authoritative Source',
    organization: 'Organization Name',
    baseUrl: 'https://example.com',
    grade: 'A',
    targetPages: [
      {
        url: 'https://example.com/page',
        type: 'article-type',
        category: 'feeding',
        selectors: {
          title: 'h1',
          content: '.main-content',
          paragraphs: '.main-content p',
          lists: '.main-content ul'
        }
      }
    ]
  }
};
```

### 调整爬取配置

在 `scraper-config.js` 中修改：

```javascript
const SCRAPER_CONFIG = {
  concurrency: {
    maxConcurrent: 2,        // 同时请求数
    delayBetweenRequests: 1000  // 延迟（毫秒）
  },
  retryConfig: {
    maxRetries: 3,           // 最大重试次数
    retryDelay: 2000         // 重试延迟
  }
};
```

---

## 🐛 故障排查

### 问题 1: API 返回 401 Unauthorized

**原因：** API Key 不正确或缺失

**解决：**
1. 检查 `.env.local` 中的 `SCRAPER_API_KEY`
2. 确保请求 header 格式正确：`Authorization: Bearer YOUR_KEY`
3. 确认 Vercel 环境变量已配置

### 问题 2: 抓取失败（404 错误）

**原因：** 目标网站 URL 变更

**解决：**
1. 访问目标网站确认 URL 是否有效
2. 更新 `scripts/scraper-config.js` 中的 URL
3. 重新部署

### 问题 3: 数据未插入 Supabase

**原因：** 数据库连接或 schema 问题

**解决：**
1. 检查 Supabase 凭证是否正确
2. 确认 `articles`, `kb_sources`, `citations` 表存在
3. 运行 `supabase/schema.sql` 创建表
4. 检查 Service Role Key 权限

### 问题 4: 重复插入数据

**原因：** Slug 生成逻辑问题

**解决：**
1. 检查 `slug` 字段是否设置为 UNIQUE
2. 查看日志确认去重逻辑是否工作
3. 手动删除重复记录

---

## 📈 性能优化

### 当前性能

- **11 个来源，23 个页面**
- **预计时间：** 2-5 分钟
- **并发：** 2 个请求
- **延迟：** 1 秒/请求

### 优化建议

1. **增加并发**（谨慎）
   ```javascript
   maxConcurrent: 3  // 从 2 增加到 3
   ```

2. **使用缓存**
   - 避免短时间内重复抓取同一页面
   - 当前缓存 TTL: 24 小时

3. **选择性抓取**
   - 只抓取需要更新的来源
   - 使用 `sources` 参数过滤

---

## 📚 相关文档

- **[WEB_SCRAPER_API.md](./WEB_SCRAPER_API.md)** - 完整 API 文档
- **[QUICK_START.md](./QUICK_START.md)** - 快速开始指南
- **[supabase/schema.sql](./supabase/schema.sql)** - 数据库 Schema
- **[SCRAPER_GUIDE.md](./SCRAPER_GUIDE.md)** - 详细设置指南（如存在）

---

## 🎯 下一步

1. ✅ **部署到生产环境** - Vercel
2. ✅ **配置环境变量** - Supabase + API Key
3. ✅ **从其他网站调用 API** - 集成到你的工作流
4. 📝 **审核抓取的内容** - 将 status 从 draft 改为 published
5. 🔄 **定期运行爬虫** - 使用 Zapier/Make 或手动触发

---

## 💡 技巧

### 批量发布内容

在 Supabase SQL Editor 中运行：

```sql
-- 将所有 draft 文章改为 published
UPDATE articles 
SET status = 'published' 
WHERE status = 'draft';
```

### 查看抓取统计

```sql
-- 按来源统计
SELECT 
  kb.organization,
  COUNT(DISTINCT a.id) as article_count
FROM articles a
JOIN citations c ON c.article_id = a.id
JOIN kb_sources kb ON kb.name = c.publisher
GROUP BY kb.organization
ORDER BY article_count DESC;
```

### 清理测试数据

```sql
-- 删除所有 draft 文章（谨慎）
DELETE FROM articles WHERE status = 'draft';
```

---

## 📞 支持

遇到问题？

1. 📖 查看文档
2. 🐛 检查日志（Vercel Dashboard）
3. 🔍 检查 Supabase 数据库
4. 💬 查看错误响应

---

## ✨ 特别感谢

本系统抓取以下权威机构的公开内容：

- CDC - Centers for Disease Control and Prevention
- AAP - American Academy of Pediatrics
- NHS - UK National Health Service
- WHO - World Health Organization
- NIH - National Institutes of Health
- Health Canada
- Mayo Clinic
- Cleveland Clinic
- Stanford Children's Health
- KidsHealth (Nemours Foundation)
- La Leche League International

**请尊重版权，仅用于教育和非商业用途。**

---

**版本：** 1.0.0  
**最后更新：** 2025-10-08  
**作者：** JupitLunar 团队

