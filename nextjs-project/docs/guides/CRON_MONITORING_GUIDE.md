# 🔍 Cron Job 监控指南

如何查看和监控你的定时任务运行状态

---

## 📋 当前 Cron Job 配置

- **路径**: `/api/scraper/run`
- **运行时间**: `0 12 * * *` (每天中午12点 UTC = 北京时间晚上8点)
- **功能**: 自动爬取母婴健康文章
- **配置文件**: `vercel.json`

---

## 🔍 方法 1: Vercel Dashboard（推荐）

### 步骤：
1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 点击左侧菜单 **"Settings"** → **"Cron Jobs"**

### 你会看到：
- ✅ Job 状态（启用/禁用）
- ⏰ 下次运行时间
- 📊 最近运行历史
- 📈 成功率统计
- ⚡ 执行持续时间

### 截图示例：
```
┌──────────────────────────────────────────────────────┐
│ Cron Jobs                                             │
├──────────────────────────────────────────────────────┤
│ Path: /api/scraper/run                               │
│ Schedule: 0 12 * * * (Daily at 12:00 UTC)           │
│ Status: ✅ Enabled                                    │
│ Next run: 2025-10-15 12:00:00 UTC                   │
│ Last run: 2025-10-14 12:00:00 UTC (Success)         │
└──────────────────────────────────────────────────────┘
```

---

## 📊 方法 2: 查看 Function 日志

### 步骤：
1. 在 Vercel Dashboard 中，点击 **"Deployments"**
2. 选择最新的部署
3. 点击 **"Functions"** 标签
4. 找到 `/api/scraper/run` 函数
5. 点击查看日志

### 日志中会显示：
```
[2025-10-14T12:00:05.123Z] 🚀 启动爬虫任务
[2025-10-14T12:00:05.456Z]    测试模式: 否
[2025-10-14T12:05:23.789Z] ✅ 爬取完成
[2025-10-14T12:05:23.791Z]    总数: 387
[2025-10-14T12:05:23.792Z]    成功: 123
[2025-10-14T12:05:23.793Z]    失败: 72
[2025-10-14T12:05:23.794Z]    跳过: 192
```

---

## 🧪 方法 3: 使用测试脚本（本地运行）

我已经为你创建了一个测试脚本！

### 运行测试：
```bash
cd nextjs-project
npm run test:cron
```

### 或者使用环境变量：
```bash
CRON_SECRET=your_secret_here npm run test:cron
```

### 测试脚本会检查：
- ✅ API 是否可访问
- ✅ 认证是否正常
- ✅ 配置信息是否正确
- ✅ 数据源数量
- ✅ 目标页面数

---

## 🌐 方法 4: 使用 curl 命令

### 检查配置（GET请求）：
```bash
curl -X GET https://www.momaiagent.com/api/scraper/run \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"
```

### 预期响应：
```json
{
  "success": true,
  "message": "Scraper configuration",
  "data": {
    "sources": [...],
    "totalSources": 8,
    "totalPages": 30,
    "status": "ready"
  }
}
```

### 手动触发爬虫（POST请求）：
```bash
curl -X POST https://www.momaiagent.com/api/scraper/run \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"testMode": true, "sources": ["CDC"]}'
```

### 预期响应：
```json
{
  "success": true,
  "message": "Scraping completed",
  "data": {
    "total": 387,
    "successful": 123,
    "failed": 72,
    "skipped": 192,
    "timestamp": "2025-10-14T12:00:00.000Z"
  }
}
```

---

## 📈 方法 5: 检查数据库

### 查询最近爬取的文章：
```sql
-- 查看最近添加的文章
SELECT 
  hub,
  title,
  created_at,
  source_url
FROM articles
WHERE created_at > NOW() - INTERVAL '1 day'
ORDER BY created_at DESC
LIMIT 20;

-- 统计每天爬取的数量
SELECT 
  DATE(created_at) as date,
  hub,
  COUNT(*) as count
FROM articles
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at), hub
ORDER BY date DESC, count DESC;
```

---

## 🚨 常见问题排查

### ❌ 问题 1: Cron Job 没有运行

**可能原因：**
- Vercel Dashboard 中 Cron Job 未启用
- 环境变量 `CRON_SECRET` 未设置
- vercel.json 配置错误

**解决方案：**
```bash
# 1. 检查 vercel.json
cat vercel.json | grep -A 3 "crons"

# 2. 确认环境变量
# 在 Vercel Dashboard → Settings → Environment Variables
# 确保 CRON_SECRET 已设置

# 3. 重新部署
git push origin main
```

---

### ❌ 问题 2: 返回 401 Unauthorized

**可能原因：**
- `CRON_SECRET` 不正确
- 环境变量未应用到生产环境

**解决方案：**
1. 检查 Vercel Dashboard 中的环境变量
2. 确保变量应用到 **Production** 环境
3. 重新部署项目

---

### ❌ 问题 3: 爬虫执行失败

**可能原因：**
- Supabase 连接问题
- API 超时（超过 60 秒）
- 网络问题

**解决方案：**
```bash
# 1. 本地测试爬虫
cd nextjs-project
node scripts/global-auto-scraper.js

# 2. 检查 Supabase 连接
npm run test:db

# 3. 查看详细日志
# Vercel Dashboard → Functions → /api/scraper/run → Logs
```

---

### ❌ 问题 4: 没有新文章被爬取

**可能原因：**
- 所有文章都已存在（被跳过）
- 源网站内容未更新
- 爬虫选择器需要更新

**解决方案：**
```bash
# 1. 查看爬虫统计
npm run scrape:stats

# 2. 查看跳过原因
npm run scrape:review

# 3. 检查数据库
# 查询最近的文章数量和来源
```

---

## ⏰ 修改运行时间

### 当前时间：`0 12 * * *` (每天中午12点 UTC)

### 常用时间设置：
```javascript
// 每天
"0 0 * * *"   // 每天午夜 UTC (北京时间早上8点)
"0 6 * * *"   // 每天早上6点 UTC (北京时间下午2点)
"0 12 * * *"  // 每天中午12点 UTC (北京时间晚上8点)
"0 18 * * *"  // 每天下午6点 UTC (北京时间凌晨2点)

// 每12小时
"0 */12 * * *"  // 每12小时

// 每周
"0 0 * * 0"   // 每周日午夜
"0 0 * * 1"   // 每周一午夜

// 每月
"0 0 1 * *"   // 每月1号午夜
```

### 修改步骤：
1. 编辑 `vercel.json`
2. 修改 `schedule` 字段
3. 提交并推送到 Git
4. Vercel 会自动更新 Cron Job

---

## 📊 监控最佳实践

### 1. 每周检查一次
```bash
# 运行完整的状态检查
npm run test:cron

# 查看数据库统计
npm run scrape:stats --report
```

### 2. 设置告警（可选）
使用第三方服务监控 API：
- **UptimeRobot**: 免费监控 API 可用性
- **Cronitor**: 专门监控 Cron Jobs
- **Better Stack**: 全面的监控方案

### 3. 查看趋势
定期检查：
- 爬取成功率
- 新文章数量趋势
- 失败原因分布

---

## 🎯 快速检查清单

每次检查 Cron Job 时，按照以下清单：

- [ ] Vercel Dashboard 中 Cron Job 状态为"已启用"
- [ ] 查看最近一次运行时间和结果
- [ ] 检查 Function 日志中是否有错误
- [ ] 运行 `npm run test:cron` 测试 API
- [ ] 查询数据库中最近添加的文章
- [ ] 确认文章来源分布合理

---

## 📞 获取帮助

如果遇到问题：

1. **查看文档**：
   - `CRON_SETUP.md` - 初始设置指南
   - `SCRAPER_指南.md` - 爬虫详细说明

2. **查看日志**：
   - Vercel Function 日志
   - Supabase 日志

3. **测试组件**：
   ```bash
   npm run test:db        # 测试数据库连接
   npm run test:cron      # 测试 Cron API
   npm run scrape:test    # 测试爬虫
   ```

---

## 📈 成功指标

你的 Cron Job 运行正常的标志：

- ✅ Vercel Dashboard 显示绿色状态
- ✅ 每天都有新文章被添加到数据库
- ✅ Function 日志中没有错误
- ✅ 成功率 > 70%
- ✅ 响应时间 < 50秒

---

🎉 **现在你可以轻松监控你的 Cron Job 了！**

记住：Cron Job 是自动运行的，但定期检查可以确保一切正常。

