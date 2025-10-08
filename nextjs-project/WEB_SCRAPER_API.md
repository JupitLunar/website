# Web Scraper API 使用指南

## 📋 概述

Web Scraper API 允许你从权威健康网站抓取婴幼儿护理内容，自动存储到 Supabase 数据库，并自动去重。

## 🌐 API 端点

### 基础 URL
```
https://your-domain.com/api/scraper
```

---

## 🔐 认证

所有请求需要在 Header 中包含 API Key：

```http
Authorization: Bearer YOUR_SCRAPER_API_KEY
```

### 设置 API Key

在 `.env.local` 中添加：
```bash
SCRAPER_API_KEY=your-secure-random-key-here
```

**生成随机密钥：**
```bash
openssl rand -base64 32
```

---

## 📡 API 端点详情

### 1. 运行爬虫 (POST)

触发爬虫任务，抓取内容并存储到数据库。

**端点：** `POST /api/scraper/run`

**Headers：**
```http
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

**Body (可选)：**
```json
{
  "sources": ["CDC", "AAP", "NHS"],
  "testMode": false
}
```

**参数说明：**
- `sources` (可选): 数组，指定要抓取的来源。不提供则抓取所有来源。
  - 可用值: `CDC`, `AAP`, `HEALTH_CANADA`, `WHO`, `NIH`, `MAYO_CLINIC`, `LLLI`, `STANFORD_CHILDRENS`, `NHS`, `CLEVELAND_CLINIC`, `KIDSHEALTH`
- `testMode` (可选): 布尔值，测试模式（暂未实现）

**示例请求：**
```bash
curl -X POST https://your-domain.com/api/scraper/run \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "sources": ["CDC", "AAP"]
  }'
```

**成功响应 (200)：**
```json
{
  "success": true,
  "message": "Scraping completed",
  "data": {
    "total": 10,
    "successful": 8,
    "failed": 1,
    "skipped": 1,
    "articles": [
      {
        "slug": "infant-nutrition-cdc",
        "title": "Infant Nutrition",
        "source": "CDC",
        "status": "inserted"
      }
    ],
    "timestamp": "2025-10-08T12:00:00.000Z"
  }
}
```

**错误响应 (401)：**
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid or missing API key"
}
```

**错误响应 (500)：**
```json
{
  "success": false,
  "error": "Scraper error",
  "message": "Error details here"
}
```

---

### 2. 获取配置信息 (GET)

获取爬虫配置和可用来源列表。

**端点：** `GET /api/scraper/run`

**Headers：**
```http
Authorization: Bearer YOUR_API_KEY
```

**示例请求：**
```bash
curl -X GET https://your-domain.com/api/scraper/run \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**成功响应 (200)：**
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
      },
      {
        "key": "AAP",
        "name": "American Academy of Pediatrics (AAP)",
        "organization": "AAP",
        "grade": "A",
        "pageCount": 2
      }
    ],
    "totalSources": 11,
    "totalPages": 23,
    "status": "ready"
  }
}
```

---

## 🗃️ 数据存储

抓取的数据会存储到以下 Supabase 表：

### 1. `articles` 表
主要内容表，包含文章的完整信息。

**关键字段：**
- `slug`: 唯一标识符（自动去重）
- `title`: 文章标题
- `type`: 文章类型（explainer, howto 等）
- `hub`: 内容分类（feeding, sleep, development 等）
- `body_md`: Markdown 格式的内容
- `key_facts`: 关键事实数组
- `status`: 内容状态（默认 'draft'）

### 2. `kb_sources` 表
来源机构信息。

**关键字段：**
- `name`: 来源名称（唯一）
- `organization`: 机构名称
- `url`: 官方网站
- `grade`: 权威等级

### 3. `citations` 表
引用信息，关联到文章。

---

## 🔄 去重机制

系统自动去重，基于 `slug` 字段：
- 如果 `slug` 已存在，跳过插入
- 保证不会重复插入相同内容
- 日志会显示 "已存在，跳过" 消息

---

## 🚀 快速开始

### 步骤 1: 配置环境变量

在 `.env.local` 中添加：
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Scraper API Key
SCRAPER_API_KEY=your-secure-random-key
```

### 步骤 2: 安装依赖

```bash
cd nextjs-project
npm install
```

### 步骤 3: 测试 API（本地）

启动开发服务器：
```bash
npm run dev
```

测试抓取：
```bash
curl -X POST http://localhost:3000/api/scraper/run \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"sources": ["CDC"]}'
```

### 步骤 4: 部署后调用

部署到 Vercel 后，从任何地方调用：
```bash
curl -X POST https://your-domain.vercel.app/api/scraper/run \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

---

## 🌍 支持的权威来源

| 来源 | 机构 | 页面数 | 地区 |
|-----|------|--------|------|
| **CDC** | Centers for Disease Control | 2 | 美国 |
| **AAP** | American Academy of Pediatrics | 2 | 美国 |
| **NHS** | UK National Health Service | 3 | 英国 |
| **WHO** | World Health Organization | 1 | 全球 |
| **NIH** | National Institutes of Health | 1 | 美国 |
| **Health Canada** | Health Canada | 1 | 加拿大 |
| **Mayo Clinic** | Mayo Clinic | 2 | 美国 |
| **Cleveland Clinic** | Cleveland Clinic | 2 | 美国 |
| **Stanford Children's** | Stanford Medicine | 2 | 美国 |
| **KidsHealth** | Nemours Foundation | 3 | 美国 |
| **LLLI** | La Leche League International | 1 | 全球 |

**总计：11 个机构，23 个页面**

---

## 📊 实际使用示例

### 从 Node.js 调用

```javascript
const axios = require('axios');

async function runScraper() {
  try {
    const response = await axios.post(
      'https://your-domain.com/api/scraper/run',
      {
        sources: ['CDC', 'AAP', 'NHS']
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.SCRAPER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ 爬取成功:', response.data);
    console.log(`   成功: ${response.data.data.successful}`);
    console.log(`   失败: ${response.data.data.failed}`);
    console.log(`   跳过: ${response.data.data.skipped}`);
  } catch (error) {
    console.error('❌ 爬取失败:', error.response?.data || error.message);
  }
}

runScraper();
```

### 从 Python 调用

```python
import os
import requests

def run_scraper():
    url = "https://your-domain.com/api/scraper/run"
    headers = {
        "Authorization": f"Bearer {os.getenv('SCRAPER_API_KEY')}",
        "Content-Type": "application/json"
    }
    data = {
        "sources": ["CDC", "AAP", "NHS"]
    }
    
    try:
        response = requests.post(url, json=data, headers=headers)
        response.raise_for_status()
        
        result = response.json()
        print(f"✅ 爬取成功")
        print(f"   成功: {result['data']['successful']}")
        print(f"   失败: {result['data']['failed']}")
        print(f"   跳过: {result['data']['skipped']}")
        
    except requests.exceptions.RequestException as e:
        print(f"❌ 爬取失败: {e}")

if __name__ == "__main__":
    run_scraper()
```

### 使用定时任务平台

**选项 1: Zapier**
1. 创建新 Zap
2. Trigger: Schedule (每周一次)
3. Action: Webhooks → POST Request
   - URL: `https://your-domain.com/api/scraper/run`
   - Headers: `Authorization: Bearer YOUR_API_KEY`

**选项 2: Make.com (Integromat)**
1. 创建新 Scenario
2. Clock Module: 设置定时
3. HTTP Module: Make a Request
   - Method: POST
   - URL: `https://your-domain.com/api/scraper/run`
   - Headers: Authorization

**选项 3: GitHub Actions**
1. 在你的仓库创建 `.github/workflows/scraper.yml`
2. 使用 `schedule` trigger
3. 在 Secrets 中添加 API key

---

## 🔒 安全注意事项

1. **保护 API Key**
   - 永远不要在代码中硬编码 API key
   - 使用环境变量
   - 定期轮换密钥

2. **限制访问**
   - 只允许受信任的 IP/域名访问
   - 可以在 API 中添加 IP 白名单

3. **监控使用**
   - 记录所有 API 调用
   - 设置使用配额
   - 检测异常活动

---

## ❓ 常见问题

### Q: 爬虫会重复插入数据吗？
A: 不会。系统基于 `slug` 自动去重，已存在的内容会被跳过。

### Q: 爬取需要多长时间？
A: 取决于网站数量和网络速度，通常 2-5 分钟。

### Q: 可以同时运行多个爬虫任务吗？
A: 建议避免并发运行，以免对目标网站造成负担。

### Q: 爬取的内容需要审核吗？
A: 是的，所有内容默认状态为 `draft`，需要人工审核后发布。

### Q: 可以添加新的权威来源吗？
A: 可以！编辑 `scripts/scraper-config.js`，添加新的来源配置。

### Q: API 有速率限制吗？
A: 目前没有，但建议合理使用（如每天 1-2 次）。

---

## 📞 技术支持

如有问题，请检查：
1. API Key 是否正确配置
2. Supabase 连接是否正常
3. 目标网站是否可访问
4. 查看服务器日志获取详细错误信息

---

## 📝 更新日志

### v1.0.0 (2025-10-08)
- ✅ 初始版本
- ✅ 支持 11 个权威来源
- ✅ 自动去重机制
- ✅ REST API 接口
- ✅ Bearer Token 认证

