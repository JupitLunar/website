# ⏰ 定时爬虫设置指南

## 📋 设置步骤

### 1. 在Vercel中添加环境变量

登录到 [Vercel Dashboard](https://vercel.com/dashboard)，进入你的项目设置：

**Settings → Environment Variables → 添加以下变量：**

```bash
# Cron密钥（Vercel自动生成）
CRON_SECRET=your_cron_secret_here

# 可选：手动API调用密钥
SCRAPER_API_KEY=your_api_key_here

# Supabase连接（应该已经有了）
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_key
```

### 2. 部署到Vercel

```bash
git push origin main
```

部署完成后，Vercel会自动识别`vercel.json`中的cron配置。

### 3. 验证Cron设置

1. 进入Vercel项目页面
2. 点击 **Settings → Cron Jobs**
3. 应该能看到：
   - Path: `/api/scraper/run`
   - Schedule: `0 2 * * *` (每天凌晨2点UTC)

---

## ⏱️ Cron时间表说明

当前设置：`0 2 * * *` = **每天凌晨2点UTC运行**

### 其他常用时间设置

```bash
# 每天运行
"0 2 * * *"   # 每天凌晨2点UTC
"0 0 * * *"   # 每天午夜UTC
"0 12 * * *"  # 每天中午12点UTC

# 每周运行
"0 2 * * 0"   # 每周日凌晨2点
"0 2 * * 1"   # 每周一凌晨2点

# 每月运行
"0 2 1 * *"   # 每月1号凌晨2点
```

### 修改运行时间

编辑 `nextjs-project/vercel.json`：

```json
{
  "crons": [
    {
      "path": "/api/scraper/run",
      "schedule": "0 2 * * *"  // 在这里修改时间
    }
  ]
}
```

然后重新部署。

---

## 🧪 测试Cron功能

### 手动触发爬虫

```bash
curl -X POST https://www.momaiagent.com/api/scraper/run \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"
```

### 查看运行日志

1. 登录Vercel Dashboard
2. 进入项目 → **Deployments**
3. 点击最新部署 → **Functions**
4. 找到 `/api/scraper/run` → 查看日志

---

## 📊 运行结果示例

每次运行后，API会返回：

```json
{
  "success": true,
  "message": "Scraping completed",
  "data": {
    "total": 387,
    "successful": 123,
    "failed": 72,
    "skipped": 192,
    "byRegion": {
      "US": { "discovered": 154, "successful": 0, "failed": 13 },
      "Global": { "discovered": 184, "successful": 116, "failed": 40 }
    },
    "timestamp": "2025-10-12T02:00:00.000Z"
  }
}
```

---

## 🚨 故障排查

### 问题1: Cron未运行

**解决方案：**
1. 检查Vercel Dashboard中Cron Jobs是否已启用
2. 确认`CRON_SECRET`环境变量已设置
3. 查看Function日志是否有错误

### 问题2: API返回401 Unauthorized

**解决方案：**
1. 检查`CRON_SECRET`是否正确
2. 确认环境变量已应用到所有环境（Production, Preview, Development）

### 问题3: 爬虫执行失败

**解决方案：**
1. 检查Supabase连接是否正常
2. 查看Function日志中的详细错误信息
3. 手动运行测试：`node scripts/global-auto-scraper.js`

---

## 💡 最佳实践

### 1. 监控运行状态

建议设置Vercel通知或使用监控服务（如UptimeRobot）检查cron是否正常运行。

### 2. 定期检查日志

每周查看一次Vercel Function日志，确保爬虫正常工作。

### 3. 数据库维护

定期检查数据库中的文章数量和质量：

```sql
SELECT hub, COUNT(*) as count 
FROM articles 
WHERE body_md IS NOT NULL 
GROUP BY hub;
```

### 4. 手动补充

如果某次自动运行失败，可以手动运行：

```bash
cd nextjs-project
node scripts/global-auto-scraper.js
```

---

## 🔒 安全建议

1. **保护API密钥**：不要在代码中硬编码API密钥
2. **限制访问**：只允许Vercel Cron和你的IP访问API
3. **监控使用**：定期检查API调用日志
4. **备份数据**：定期备份Supabase数据库

---

## 📞 支持

如有问题，请查看：
- [Vercel Cron文档](https://vercel.com/docs/cron-jobs)
- [Next.js API Routes文档](https://nextjs.org/docs/api-routes/introduction)
- Supabase日志和监控

---

## ✅ 当前配置

- **运行频率**: 每天凌晨2点UTC
- **爬取来源**: 8个全球权威母婴网站
- **每次限制**: 最多500篇新文章
- **自动去重**: 跳过已存在的文章
- **内容验证**: 最小300字符，至少3段

---

🎉 **设置完成！你的网站现在会自动每天更新母婴健康内容！**

