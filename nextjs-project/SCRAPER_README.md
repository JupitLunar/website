# Web Scraper 系统完整说明 🕷️

一个企业级的网络爬虫系统，用于从权威健康网站（CDC、AAP、WHO等）自动爬取内容并存储到Supabase。

## 📚 文档索引

1. **[SCRAPER_QUICKSTART.md](./SCRAPER_QUICKSTART.md)** - 5分钟快速开始指南
2. **[SCRAPER_GUIDE.md](./SCRAPER_GUIDE.md)** - 完整使用文档
3. 本文档 - 系统架构和技术细节

---

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                     外部触发器                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │GitHub    │  │Vercel    │  │External  │  │Manual    │   │
│  │Actions   │  │Cron      │  │Cron      │  │Trigger   │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
└───────┼─────────────┼─────────────┼─────────────┼──────────┘
        │             │             │             │
        └─────────────┴─────────────┴─────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────────┐
        │         API Layer (Next.js)             │
        │  ┌──────────────────────────────────┐  │
        │  │  POST /api/scraper/run           │  │
        │  │  - 运行爬虫任务                   │  │
        │  │  - 返回执行结果                   │  │
        │  └──────────────────────────────────┘  │
        │  ┌──────────────────────────────────┐  │
        │  │  GET /api/scraper/status         │  │
        │  │  - 查询爬取状态                   │  │
        │  │  - 返回统计信息                   │  │
        │  └──────────────────────────────────┘  │
        └─────────────────┬───────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────────┐
        │      Core Scraper Engine               │
        │  ┌──────────────────────────────────┐  │
        │  │ web-scraper.js                   │  │
        │  │ - HTTP请求管理                    │  │
        │  │ - 内容提取                        │  │
        │  │ - 数据清洗                        │  │
        │  │ - 错误重试                        │  │
        │  └──────────────────────────────────┘  │
        │  ┌──────────────────────────────────┐  │
        │  │ scraper-config.js                │  │
        │  │ - 数据源配置                      │  │
        │  │ - CSS选择器                       │  │
        │  │ - 数据映射规则                    │  │
        │  └──────────────────────────────────┘  │
        └─────────────────┬───────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────────┐
        │         Data Processing                │
        │  ┌──────────────────────────────────┐  │
        │  │ 内容验证                          │  │
        │  │ - 长度检查                        │  │
        │  │ - 质量评分                        │  │
        │  │ - 去重检测                        │  │
        │  └──────────────────────────────────┘  │
        │  ┌──────────────────────────────────┐  │
        │  │ 数据转换                          │  │
        │  │ - HTML → Markdown                │  │
        │  │ - 提取关键信息                    │  │
        │  │ - 生成元数据                      │  │
        │  └──────────────────────────────────┘  │
        └─────────────────┬───────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────────┐
        │         Storage Layer                  │
        │  ┌──────────────┐  ┌──────────────┐   │
        │  │ Supabase     │  │ Local Files  │   │
        │  │ - articles   │  │ - Raw data   │   │
        │  │ - kb_sources │  │ - Backups    │   │
        │  │ - citations  │  │ - Cache      │   │
        │  └──────────────┘  └──────────────┘   │
        └─────────────────────────────────────────┘
```

---

## 📂 文件结构

```
nextjs-project/
├── scripts/                        # 爬虫脚本
│   ├── web-scraper.js             # 核心爬虫引擎 ⭐
│   ├── scraper-config.js          # 配置文件 ⭐
│   ├── review-scraped-content.js  # 内容审核工具
│   ├── scraper-stats.js           # 统计分析
│   ├── cron-example.js            # Cron示例
│   └── test-scraper-api.sh        # API测试脚本
│
├── src/app/api/scraper/           # API路由
│   ├── run/route.ts               # 运行爬虫 ⭐
│   └── status/route.ts            # 查询状态 ⭐
│
├── data/                          # 数据目录
│   └── scraped/                   # 爬取的原始数据
│
├── cache/                         # 缓存目录
│   └── scraper/                   # 爬虫缓存
│
├── reports/                       # 报告目录
│   └── scraper-stats.json         # 统计报告
│
├── .github/workflows/             # GitHub Actions
│   └── scraper-cron.yml           # 定时任务配置 ⭐
│
├── SCRAPER_README.md              # 本文档
├── SCRAPER_GUIDE.md               # 使用指南
├── SCRAPER_QUICKSTART.md          # 快速开始
└── vercel-cron-example.json       # Vercel配置示例
```

---

## 🔧 核心组件

### 1. Web Scraper (`web-scraper.js`)

**功能：**
- HTTP请求管理（带重试机制）
- HTML内容提取（使用Cheerio）
- 数据清洗和验证
- 并发控制
- 错误处理

**关键方法：**
```javascript
fetchWithRetry(url, retries)      // 带重试的HTTP请求
extractContent(html, selectors)   // 提取页面内容
validateContent(content)          // 验证内容质量
scrapePage(source, page)          // 爬取单个页面
scrapeAllSources()                // 爬取所有来源
```

### 2. Scraper Config (`scraper-config.js`)

**功能：**
- 定义数据来源
- 配置CSS选择器
- 设置数据映射规则
- 配置爬取参数

**可配置项：**
- `SOURCES` - 数据来源列表
- `CLEANING_RULES` - 清洗规则
- `SCRAPER_CONFIG` - 运行配置
- `DATA_MAPPING` - 数据映射

### 3. API Routes

**`/api/scraper/run`**
- 方法：POST, GET
- 功能：运行爬虫、查询配置
- 认证：Bearer Token

**`/api/scraper/status`**
- 方法：GET
- 功能：查询爬取状态
- 返回：最近文章、统计信息

### 4. 审核工具 (`review-scraped-content.js`)

**功能：**
- 交互式命令行界面
- 查看待审核文章
- 批量/单个操作
- 发布/删除/编辑

### 5. 统计分析 (`scraper-stats.js`)

**功能：**
- 生成统计报告
- 内容质量分析
- 来源分布统计
- 本地文件分析

---

## 🔐 安全机制

### 1. API认证

```typescript
// Bearer Token认证
Authorization: Bearer YOUR_API_KEY
```

### 2. 环境变量保护

```bash
# .env.local (不会提交到Git)
SCRAPER_API_KEY=your_secure_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_key
```

### 3. 内容验证

- 长度限制（100-50000字符）
- 标题必需
- 最少段落数
- 来源验证

### 4. 数据隔离

- 爬取内容默认状态：`draft`
- 需要人工审核才能发布
- 追踪来源（`reviewed_by: 'Web Scraper Bot'`）

---

## ⚡ 性能优化

### 1. 并发控制

```javascript
concurrency: {
  maxConcurrent: 2,           // 最多2个并发请求
  delayBetweenRequests: 1000  // 请求间隔1秒
}
```

### 2. 重试机制

```javascript
retryConfig: {
  maxRetries: 3,
  retryDelay: 2000,
  backoffMultiplier: 2  // 指数退避
}
```

### 3. 缓存策略

```javascript
cache: {
  enabled: true,
  ttl: 86400000,  // 24小时
  directory: './cache/scraper'
}
```

### 4. 去重检测

- 使用`slug`作为唯一标识
- 数据库层面的唯一约束
- 插入前检查是否存在

---

## 📊 数据流程

### 1. 爬取阶段

```
权威网站 → HTTP请求 → HTML响应 → Cheerio解析
```

### 2. 处理阶段

```
原始HTML → 清理标签 → 提取内容 → 验证质量
```

### 3. 转换阶段

```
结构化数据 → 数据映射 → 生成元数据 → 格式转换
```

### 4. 存储阶段

```
┌─ 本地文件（原始数据）
└─ Supabase数据库
   ├─ kb_sources（来源）
   ├─ articles（文章，draft状态）
   └─ citations（引用）
```

---

## 🎯 数据来源

### 当前支持的权威来源

| 来源 | 组织 | 等级 | 类型 | 页面数 |
|------|------|------|------|--------|
| CDC | Centers for Disease Control | A | 政府机构 | 2 |
| AAP | American Academy of Pediatrics | A | 专业协会 | 2 |
| Health Canada | Health Canada | A | 政府机构 | 1 |
| WHO | World Health Organization | A | 国际组织 | 1 |
| NIH | National Institutes of Health | A | 政府机构 | 1 |
| Mayo Clinic | Mayo Clinic | A | 医疗机构 | 1 |

**总计：** 6个来源，8个页面

### 添加新来源

在 `scraper-config.js` 中添加：

```javascript
NEW_SOURCE: {
  id: 'unique-id',
  name: 'Source Name',
  organization: 'Org Name',
  baseUrl: 'https://example.com',
  grade: 'A',  // A, B, C, D
  targetPages: [
    {
      url: 'https://example.com/page',
      type: 'content-type',
      category: 'category',
      selectors: {
        title: 'h1',
        content: '.content',
        paragraphs: 'p',
        lists: 'ul, ol'
      }
    }
  ]
}
```

---

## 🔄 Cron Job配置

### 选项1: GitHub Actions（推荐）

**优点：**
- ✅ 完全免费
- ✅ 可靠稳定
- ✅ 完整日志
- ✅ 易于调试

**配置：**
```yaml
# .github/workflows/scraper-cron.yml
on:
  schedule:
    - cron: '0 2 * * *'  # 每天凌晨2点
```

### 选项2: Vercel Cron

**优点：**
- ✅ 与部署集成
- ✅ 零配置
- ✅ 自动扩展

**限制：**
- ⚠️ Pro计划功能
- ⚠️ 需要配置Header

**配置：**
```json
{
  "crons": [{
    "path": "/api/scraper/run",
    "schedule": "0 2 * * *"
  }]
}
```

### 选项3: 外部Cron服务

**推荐服务：**
- **EasyCron** - 功能丰富
- **Cron-job.org** - 免费可靠
- **UptimeRobot** - 兼顾监控

---

## 📈 监控和维护

### 1. 查看统计

```bash
npm run scrape:stats          # 显示统计信息
npm run scrape:report         # 生成JSON报告
```

### 2. 审核内容

```bash
npm run scrape:review         # 交互式审核工具
```

### 3. 查看日志

```bash
# 查看原始数据
ls -lh data/scraped/

# 查看最新文件
tail -f data/scraped/*.json
```

### 4. 数据库查询

```sql
-- 查看待审核文章
SELECT COUNT(*) FROM articles 
WHERE reviewed_by = 'Web Scraper Bot' 
AND status = 'draft';

-- 查看爬取来源
SELECT * FROM kb_sources ORDER BY retrieved_at DESC;

-- 查看最近爬取的文章
SELECT title, hub, created_at 
FROM articles 
WHERE reviewed_by = 'Web Scraper Bot' 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## 🐛 故障排除

### 常见问题

#### 1. 401 Unauthorized

**原因：** API密钥错误

**解决：**
```bash
# 检查环境变量
echo $SCRAPER_API_KEY

# 重新生成密钥
openssl rand -hex 32
```

#### 2. 内容提取失败

**原因：** CSS选择器过时

**解决：**
1. 访问目标网站查看HTML结构
2. 使用浏览器开发工具找到正确的选择器
3. 更新 `scraper-config.js`

#### 3. 超时错误

**原因：** 网络慢或网站响应慢

**解决：**
```javascript
// 增加超时时间
requestConfig: {
  timeout: 60000  // 60秒
}
```

#### 4. 重复内容

**原因：** Slug生成逻辑

**解决：**
- 爬虫会自动跳过重复的slug
- 检查 `generateSlug()` 函数逻辑
- 手动清理重复数据

---

## 📝 最佳实践

### 1. 礼貌爬取

- ✅ 设置合理的请求间隔
- ✅ 使用有意义的User-Agent
- ✅ 遵守robots.txt
- ✅ 避免高并发

### 2. 内容质量

- ✅ 所有内容初始为draft
- ✅ 人工审核后再发布
- ✅ 验证引用来源
- ✅ 定期更新

### 3. 错误处理

- ✅ 记录所有错误
- ✅ 保存原始数据
- ✅ 设置通知
- ✅ 定期检查日志

### 4. 数据管理

- ✅ 定期备份
- ✅ 清理旧缓存
- ✅ 归档过期内容
- ✅ 监控存储空间

---

## 🚀 快速命令参考

```bash
# 安装
npm install

# 本地测试
npm run scrape:test           # 测试单页
npm run scrape                # 完整爬取

# API测试
npm run dev                   # 启动服务器
./scripts/test-scraper-api.sh # 测试API

# 内容管理
npm run scrape:review         # 审核内容
npm run scrape:stats          # 查看统计
npm run scrape:report         # 生成报告

# 特定来源
node scripts/web-scraper.js --sources CDC,AAP
```

---

## 📞 技术支持

### 文档

- [快速开始](./SCRAPER_QUICKSTART.md)
- [完整指南](./SCRAPER_GUIDE.md)

### 日志位置

- 爬取数据：`data/scraped/`
- 统计报告：`reports/scraper-stats.json`
- 应用日志：控制台输出

### 检查清单

- [ ] 环境变量配置完成
- [ ] 依赖包安装成功
- [ ] 本地测试通过
- [ ] API测试通过
- [ ] Cron任务设置完成
- [ ] 监控和通知配置
- [ ] 文档阅读完成

---

## 📄 许可和合规

### 数据使用

- 遵守各来源网站的使用条款
- 仅用于教育和信息目的
- 保留原始来源引用
- 不用于商业用途（未经授权）

### 引用格式

所有爬取的内容都包含：
- 原始来源链接
- 出版方名称
- 检索日期
- 许可信息

---

**创建时间：** 2025-01-08  
**版本：** 1.0.0  
**维护者：** JupitLunar Team

**🎉 开始使用爬虫系统！**

