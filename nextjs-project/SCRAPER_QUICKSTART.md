# Web Scraper 快速开始 🚀

5分钟快速设置和使用爬虫系统。

## 📦 第一步：安装依赖

```bash
cd nextjs-project
npm install
```

新增的包会自动安装：
- `axios` - HTTP请求
- `cheerio` - HTML解析  
- `puppeteer` - 浏览器自动化

## 🔑 第二步：配置环境变量

### 1. 生成API密钥

```bash
# 生成安全的随机密钥
openssl rand -hex 32
```

### 2. 创建 `.env.local` 文件

```bash
cp .env.example .env.local
```

### 3. 编辑 `.env.local`

```bash
# Supabase配置（已有的）
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# 爬虫API密钥（新增）
SCRAPER_API_KEY=刚才生成的密钥
```

## 🧪 第三步：测试爬虫

### 本地测试（命令行）

```bash
# 测试模式 - 只爬取一个页面
npm run scrape:test

# 完整爬取所有配置的来源
npm run scrape

# 只爬取特定来源
node scripts/web-scraper.js --sources CDC,AAP
```

### API测试

```bash
# 1. 启动开发服务器
npm run dev

# 2. 在另一个终端测试API
curl -X POST http://localhost:3000/api/scraper/run \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

## 🌐 第四步：设置Cron Job

选择以下任一方式：

### 方式1：GitHub Actions（推荐）

**优点：** 免费、可靠、有日志

1. 在GitHub仓库中添加Secrets：
   - `APP_URL`: `https://yourdomain.com`
   - `SCRAPER_API_KEY`: 你的API密钥

2. 推送代码（`.github/workflows/scraper-cron.yml` 已创建）

3. 完成！每天自动运行

### 方式2：Vercel Cron

**优点：** 与部署集成

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

然后在Vercel项目设置中配置环境变量 `SCRAPER_API_KEY`。

### 方式3：外部Cron服务

**推荐服务：**
- [EasyCron](https://www.easycron.com/)
- [Cron-job.org](https://cron-job.org/)

**配置：**
- URL: `https://yourdomain.com/api/scraper/run`
- Method: POST
- Header: `Authorization: Bearer YOUR_API_KEY`
- Schedule: `0 2 * * *` (每天凌晨2点)

### 方式4：Node.js Cron服务器

使用提供的示例脚本：

```bash
node scripts/cron-example.js
```

配合 `node-cron` 或 `pm2` 使用。

## 📊 第五步：查看结果

### 1. 通过API查询

```bash
# 查询最近的爬取状态
curl http://localhost:3000/api/scraper/status \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### 2. Supabase控制台

登录 [Supabase Dashboard](https://app.supabase.com)，查看：

- `kb_sources` 表 - 数据来源
- `articles` 表 - 爬取的文章（status='draft'）
- `citations` 表 - 引用来源

### 3. 本地文件

爬取的原始数据保存在：
```
nextjs-project/data/scraped/
```

## 🎯 常用命令

```bash
# 本地测试
npm run scrape:test              # 测试单个页面
npm run scrape                   # 完整爬取

# API测试
npm run dev                      # 启动开发服务器
chmod +x scripts/test-scraper-api.sh
./scripts/test-scraper-api.sh   # 测试API（需要jq）

# 查看日志
tail -f data/scraped/*.json     # 查看爬取的原始数据
```

## ⚙️ 自定义配置

编辑 `scripts/scraper-config.js` 来自定义：

### 添加新的数据来源

```javascript
MY_SOURCE: {
  id: 'my-source',
  name: 'My Health Source',
  organization: 'My Org',
  baseUrl: 'https://example.com',
  grade: 'A',
  targetPages: [
    {
      url: 'https://example.com/article',
      type: 'nutrition',
      category: 'feeding',
      selectors: {
        title: 'h1.title',
        content: '.main-content',
        paragraphs: '.main-content p',
        lists: '.main-content ul, .main-content ol'
      }
    }
  ]
}
```

### 调整爬取频率

```javascript
concurrency: {
  maxConcurrent: 2,          // 并发请求数
  delayBetweenRequests: 1000 // 请求间隔(毫秒)
}
```

## 🔍 找到正确的CSS选择器

### 方法1：浏览器开发工具

1. 在目标网站右键 → "检查元素"
2. 找到内容元素
3. 右键 → Copy → Copy selector

### 方法2：使用测试模式

```bash
npm run scrape:test
```

查看 `data/scraped/` 中保存的HTML，分析结构。

## 📋 Cron表达式说明

```
┌───────────── 分钟 (0-59)
│ ┌───────────── 小时 (0-23)
│ │ ┌───────────── 日期 (1-31)
│ │ │ ┌───────────── 月份 (1-12)
│ │ │ │ ┌───────────── 星期 (0-6) (周日=0)
│ │ │ │ │
* * * * *
```

常用示例：
- `0 2 * * *` - 每天凌晨2点
- `0 */6 * * *` - 每6小时
- `0 2 * * 1` - 每周一凌晨2点
- `0 2 1 * *` - 每月1号凌晨2点

## 🆘 常见问题

### Q: 爬取失败怎么办？

A: 检查以下几点：
1. 目标网站是否可访问
2. CSS选择器是否正确
3. 网络连接是否正常
4. 查看错误日志

### Q: 如何防止重复内容？

A: 爬虫会自动检查slug，跳过已存在的内容。

### Q: 爬取的内容需要审核吗？

A: 是的，所有内容初始状态为 `draft`，需要人工审核后设置为 `published`。

### Q: 如何更新环境变量？

A: 
- 本地：编辑 `.env.local`
- Vercel：在项目设置中更新
- GitHub Actions：在仓库Secrets中更新

## 📚 完整文档

查看 [SCRAPER_GUIDE.md](./SCRAPER_GUIDE.md) 获取详细文档。

## ✅ 检查清单

- [ ] 安装依赖 (`npm install`)
- [ ] 配置环境变量 (`.env.local`)
- [ ] 本地测试通过 (`npm run scrape:test`)
- [ ] API测试通过
- [ ] 设置Cron Job
- [ ] 配置通知（可选）
- [ ] 文档阅读完成

---

**开始时间：5分钟**  
**现在开始爬取！** 🎉

