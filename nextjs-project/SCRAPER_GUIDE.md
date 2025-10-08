# Web Scraper 使用指南

这是一个从权威健康网站爬取内容并存储到Supabase的自动化爬虫系统。

## 📋 目录

- [功能特性](#功能特性)
- [配置](#配置)
- [API使用](#api使用)
- [Cron Job设置](#cron-job设置)
- [数据来源](#数据来源)
- [故障排除](#故障排除)

## 🎯 功能特性

- ✅ 从多个权威健康网站爬取内容 (CDC, AAP, Health Canada, WHO, NIH, Mayo Clinic)
- ✅ 自动提取和清理内容
- ✅ 智能数据映射到Supabase表
- ✅ API接口支持cron job定期执行
- ✅ 错误重试机制
- ✅ 内容质量验证
- ✅ 防止重复内容
- ✅ 保存原始数据备份

## ⚙️ 配置

### 1. 环境变量

在 `.env.local` 文件中添加以下变量：

```bash
# Supabase配置（已有）
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# 爬虫API密钥（新增）
SCRAPER_API_KEY=your_secure_random_key_here
```

生成安全的API密钥：
```bash
# 使用openssl生成随机密钥
openssl rand -hex 32
```

### 2. 安装依赖

```bash
cd nextjs-project
npm install
```

新增的依赖包：
- `axios` - HTTP请求
- `cheerio` - HTML解析
- `puppeteer` - 浏览器自动化（可选，用于JavaScript渲染的页面）

### 3. 自定义爬取目标

编辑 `scripts/scraper-config.js` 来：
- 添加/删除数据来源
- 修改CSS选择器
- 调整数据清洗规则
- 配置重试和并发设置

## 🚀 API使用

### 运行爬虫

**端点:** `POST /api/scraper/run`

**请求示例:**

```bash
# 爬取所有配置的来源
curl -X POST http://localhost:3000/api/scraper/run \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"

# 只爬取指定来源
curl -X POST http://localhost:3000/api/scraper/run \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "sources": ["CDC", "AAP"]
  }'
```

**响应示例:**

```json
{
  "success": true,
  "message": "Scraping completed",
  "data": {
    "total": 6,
    "successful": 5,
    "failed": 0,
    "skipped": 1,
    "articles": [
      {
        "id": "uuid-here",
        "title": "Infant Nutrition Guidelines",
        "source": "CDC"
      }
    ],
    "timestamp": "2025-01-08T10:30:00.000Z"
  }
}
```

### 查询配置

**端点:** `GET /api/scraper/run`

```bash
curl http://localhost:3000/api/scraper/run \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**响应:**

```json
{
  "success": true,
  "message": "Scraper configuration",
  "data": {
    "sources": [
      {
        "key": "CDC",
        "name": "Centers for Disease Control and Prevention (CDC)",
        "organization": "CDC",
        "grade": "A",
        "pageCount": 2
      }
    ],
    "totalSources": 6,
    "totalPages": 8,
    "status": "ready"
  }
}
```

### 查询状态

**端点:** `GET /api/scraper/status`

```bash
curl http://localhost:3000/api/scraper/status \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**响应:**

```json
{
  "success": true,
  "data": {
    "recentArticles": [
      {
        "id": "uuid",
        "title": "Baby Sleep Guidelines",
        "slug": "baby-sleep-guidelines",
        "hub": "sleep",
        "created_at": "2025-01-08T10:00:00.000Z"
      }
    ],
    "recentCount": 5,
    "totalScrapedArticles": 42,
    "sources": [...],
    "timestamp": "2025-01-08T10:30:00.000Z"
  }
}
```

## ⏰ Cron Job设置

### 使用Vercel Cron

在 `vercel.json` 中添加：

```json
{
  "crons": [
    {
      "path": "/api/scraper/run",
      "schedule": "0 2 * * *"
    }
  ]
}
```

注意：Vercel的cron需要在项目设置中配置Authorization header。

### 使用外部Cron服务

推荐使用以下服务：

1. **EasyCron** (https://www.easycron.com/)
2. **Cron-job.org** (https://cron-job.org/)
3. **GitHub Actions**

#### GitHub Actions示例

创建 `.github/workflows/scraper.yml`:

```yaml
name: Run Web Scraper

on:
  schedule:
    # 每天凌晨2点运行（UTC时间）
    - cron: '0 2 * * *'
  workflow_dispatch: # 允许手动触发

jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - name: Run Scraper
        run: |
          curl -X POST ${{ secrets.APP_URL }}/api/scraper/run \
            -H "Authorization: Bearer ${{ secrets.SCRAPER_API_KEY }}" \
            -H "Content-Type: application/json"
```

需要在GitHub Secrets中配置：
- `APP_URL`: 你的应用URL（如 https://yourdomain.com）
- `SCRAPER_API_KEY`: 爬虫API密钥

### 使用Linux Crontab

```bash
# 编辑crontab
crontab -e

# 添加以下行（每天凌晨2点运行）
0 2 * * * curl -X POST https://yourdomain.com/api/scraper/run -H "Authorization: Bearer YOUR_API_KEY" >> /var/log/scraper.log 2>&1
```

## 📊 数据来源

### 当前配置的来源

| 来源 | 组织 | 等级 | 页面数 |
|------|------|------|--------|
| CDC | Centers for Disease Control and Prevention | A | 2 |
| AAP | American Academy of Pediatrics | A | 2 |
| Health Canada | Health Canada | A | 1 |
| WHO | World Health Organization | A | 1 |
| NIH | National Institutes of Health | A | 1 |
| Mayo Clinic | Mayo Clinic | A | 1 |

### 数据流程

```
权威网站 → 爬虫 → 数据清洗 → 质量验证 → Supabase
                                              ↓
                                          - kb_sources
                                          - articles (status: draft)
                                          - citations
```

所有爬取的文章初始状态为 `draft`，需要人工审核后再发布。

## 🧪 测试

### 本地测试

```bash
# 测试模式（只爬取一个页面）
npm run scrape:test

# 完整爬取
npm run scrape

# 只爬取特定来源
node scripts/web-scraper.js --sources CDC,AAP
```

### API测试

```bash
# 启动开发服务器
npm run dev

# 在另一个终端测试API
curl -X POST http://localhost:3000/api/scraper/run \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

## 🔧 故障排除

### 问题: 401 Unauthorized

**原因:** API密钥错误或未配置

**解决方案:**
1. 检查 `.env.local` 中的 `SCRAPER_API_KEY`
2. 确保请求头正确：`Authorization: Bearer YOUR_KEY`

### 问题: 内容提取失败

**原因:** 网站更新了HTML结构

**解决方案:**
1. 运行测试模式查看原始HTML：`npm run scrape:test`
2. 更新 `scripts/scraper-config.js` 中的CSS选择器
3. 检查 `data/scraped/` 目录中保存的原始数据

### 问题: 超时错误

**原因:** 网络慢或目标网站响应慢

**解决方案:**
1. 增加 `SCRAPER_CONFIG.requestConfig.timeout`
2. 调整 `retryConfig.maxRetries`

### 问题: 重复内容

**原因:** slug冲突

**解决方案:**
- 爬虫会自动跳过已存在的slug
- 检查数据库中 `articles` 表的 `slug` 字段

## 📝 最佳实践

### 1. 礼貌爬取

- ✅ 设置合理的请求间隔（默认1秒）
- ✅ 使用有意义的User-Agent
- ✅ 遵守robots.txt
- ✅ 不要并发过多请求（默认最多2个）

### 2. 数据质量

- ✅ 所有文章初始为draft状态
- ✅ 人工审核后再发布
- ✅ 定期检查爬取的内容质量
- ✅ 更新过期的内容

### 3. 监控

- ✅ 查看爬取日志
- ✅ 监控成功率
- ✅ 设置失败通知

### 4. 维护

- ✅ 定期更新CSS选择器
- ✅ 添加新的权威来源
- ✅ 清理旧的缓存文件

## 📂 文件结构

```
nextjs-project/
├── scripts/
│   ├── scraper-config.js    # 配置文件
│   └── web-scraper.js        # 核心爬虫逻辑
├── src/
│   └── app/
│       └── api/
│           └── scraper/
│               ├── run/
│               │   └── route.ts    # 运行爬虫API
│               └── status/
│                   └── route.ts    # 状态查询API
├── data/
│   └── scraped/              # 保存的原始数据
└── cache/
    └── scraper/              # 缓存（可选）
```

## 🔐 安全建议

1. **保护API密钥**
   - 不要提交到Git
   - 使用强随机密钥
   - 定期轮换密钥

2. **限制访问**
   - 只在服务器端调用API
   - 考虑添加IP白名单
   - 记录所有API调用

3. **数据验证**
   - 所有爬取内容默认为draft
   - 人工审核后再发布
   - 验证来源可信度

## 🆘 支持

如有问题，请查看：
1. 日志文件：`/var/log/scraper.log`
2. Supabase控制台
3. 原始数据：`data/scraped/`

## 📄 许可证

遵守各数据来源的使用条款和许可证。

---

**创建时间**: 2025-01-08
**最后更新**: 2025-01-08

