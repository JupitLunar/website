# 🚀 Web Scraper 快速开始

## 1️⃣ 配置环境变量

编辑 `.env.local`：
```bash
# 必需：Supabase 连接
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 必需：API 密钥
SCRAPER_API_KEY=your-secure-random-key
```

**生成 API 密钥：**
```bash
openssl rand -base64 32
```

---

## 2️⃣ 部署到 Vercel

```bash
cd nextjs-project
vercel
```

在 Vercel Dashboard 添加环境变量（同上）。

---

## 3️⃣ 调用 API

### 📌 运行爬虫

```bash
curl -X POST https://your-domain.vercel.app/api/scraper/run \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "sources": ["CDC", "AAP", "NHS"]
  }'
```

### 📌 查看配置

```bash
curl -X GET https://your-domain.vercel.app/api/scraper/run \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

## 4️⃣ 可用来源

抓取所有来源（留空 `sources`）或指定：

```json
["CDC", "AAP", "NHS", "WHO", "NIH", "HEALTH_CANADA", 
 "MAYO_CLINIC", "CLEVELAND_CLINIC", "STANFORD_CHILDRENS", 
 "KIDSHEALTH", "LLLI"]
```

---

## 5️⃣ 数据存储

数据会自动存储到 Supabase 的以下表：
- `articles` - 文章内容
- `kb_sources` - 来源信息  
- `citations` - 引用关系

**自动去重**：相同 slug 不会重复插入。

---

## 📖 完整文档

查看 [WEB_SCRAPER_API.md](./WEB_SCRAPER_API.md) 了解详细信息。

---

## ✅ 测试示例数据

查看 Supabase Dashboard：
- 应该有 2 篇演示文章（CDC、AAP）
- 所有文章状态为 `draft`，需审核后发布

