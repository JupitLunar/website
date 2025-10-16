# 🔐 CRON_SECRET 设置指南

## 📋 概述

CRON_SECRET 是用于保护你的定时任务 API 的密钥。只有持有正确密钥的请求才能触发 Cron Job。

---

## 🎯 第一步：本地开发环境设置

### 创建 `.env.local` 文件

在 `nextjs-project` 目录下创建 `.env.local` 文件：

```bash
cd /Users/cathleenlin/Desktop/code/momaiagentweb/website/nextjs-project
touch .env.local
```

### 添加以下内容到 `.env.local`：

```bash
# ⚠️ 重要：此文件包含敏感信息，不要提交到 Git
# .gitignore 已配置忽略此文件

# ==============================================
# Vercel Cron Job Secret
# ==============================================
CRON_SECRET=5ngieiasimtvchYSMmaC21Y25/CzUGLVjCObC65sHOA=

# ==============================================
# App Configuration
# ==============================================
NEXT_PUBLIC_APP_URL=https://www.momaiagent.com
NEXT_PUBLIC_SITE_URL=https://www.momaiagent.com

# ==============================================
# Supabase Configuration (如果还没有，请添加)
# ==============================================
# NEXT_PUBLIC_SUPABASE_URL=你的_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_supabase_anon_key
# SUPABASE_SERVICE_ROLE_KEY=你的_supabase_service_role_key
```

### 快速创建命令：

```bash
cat > /Users/cathleenlin/Desktop/code/momaiagentweb/website/nextjs-project/.env.local << 'EOF'
# Vercel Cron Job Secret
CRON_SECRET=5ngieiasimtvchYSMmaC21Y25/CzUGLVjCObC65sHOA=

# App Configuration
NEXT_PUBLIC_APP_URL=https://www.momaiagent.com
NEXT_PUBLIC_SITE_URL=https://www.momaiagent.com
EOF
```

---

## 🚀 第二步：Vercel 生产环境设置

### 在 Vercel Dashboard 中添加环境变量：

1. **登录 Vercel**
   - 访问 [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - 选择你的项目

2. **进入设置**
   - 点击 **Settings** 标签
   - 点击左侧菜单的 **Environment Variables**

3. **添加 CRON_SECRET**
   - 点击 **Add New** 按钮
   - 填写：
     ```
     Name: CRON_SECRET
     Value: 5ngieiasimtvchYSMmaC21Y25/CzUGLVjCObC65sHOA=
     ```
   - 选择环境：
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
   - 点击 **Save**

4. **重新部署**
   - 环境变量添加后，需要重新部署才能生效
   - 在 **Deployments** 页面，点击最新部署的 **⋯** 菜单
   - 选择 **Redeploy**
   - 或者推送新的提交到 Git

### 截图参考：

```
┌─────────────────────────────────────────────────────────┐
│ Environment Variables                                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Name: CRON_SECRET                                       │
│ Value: 5ngieiasimtvchYSMmaC21Y25/CzUGLVjCObC65sHOA=    │
│                                                          │
│ Environments:                                            │
│ ☑ Production                                            │
│ ☑ Preview                                               │
│ ☑ Development                                           │
│                                                          │
│ [Save]                                                   │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ 第三步：验证设置

### 1. 测试本地环境：

```bash
cd nextjs-project
npm run test:cron
```

**预期输出：**
```
🧪 测试 Cron Job API...

1️⃣ 测试获取配置信息 (GET /api/scraper/run)
   ✅ 状态码: 200
   📊 数据源数量: 8
   📄 目标页面数: 30
   ⚡ 状态: ready

✅ 测试完成！
```

### 2. 测试生产环境：

```bash
curl -X GET https://www.momaiagent.com/api/scraper/run \
  -H "Authorization: Bearer 5ngieiasimtvchYSMmaC21Y25/CzUGLVjCObC65sHOA=" \
  -H "Content-Type: application/json"
```

**预期响应（200 状态码）：**
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

---

## 🔍 第四步：检查 Cron Job 状态

### 在 Vercel Dashboard 中：

1. 进入你的项目
2. 点击 **Settings** → **Cron Jobs**
3. 你应该看到：
   ```
   Path: /api/scraper/run
   Schedule: 0 12 * * * (Daily at 12:00 UTC)
   Status: ✅ Enabled
   Next run: [下次运行时间]
   ```

### 查看运行日志：

1. 点击 **Deployments**
2. 选择最新部署
3. 点击 **Functions** 标签
4. 找到 `/api/scraper/run`
5. 查看执行日志

---

## 🔒 安全最佳实践

### ✅ 要做的事：

- ✅ 将 CRON_SECRET 保存在安全的地方（如密码管理器）
- ✅ 只在 Vercel 环境变量和本地 .env.local 中使用
- ✅ 定期（每6个月）更换密钥
- ✅ 确保 .env.local 被 .gitignore 忽略

### ❌ 不要做的事：

- ❌ 不要将 CRON_SECRET 提交到 Git
- ❌ 不要在代码中硬编码密钥
- ❌ 不要在公开场合分享密钥
- ❌ 不要在客户端代码中使用此密钥

---

## 🔄 更换密钥（可选）

如果需要重新生成密钥：

```bash
# 生成新密钥
openssl rand -base64 32

# 输出示例：
# abc123xyz789...
```

然后在以下位置更新：
1. 本地 `.env.local` 文件
2. Vercel 环境变量
3. 重新部署项目

---

## 📊 你的密钥信息

```
CRON_SECRET=5ngieiasimtvchYSMmaC21Y25/CzUGLVjCObC65sHOA=
```

**生成时间**: 2025-10-15  
**算法**: OpenSSL Base64 (32 字节)  
**用途**: Vercel Cron Job 认证

---

## 🚨 常见问题

### Q1: 为什么需要 CRON_SECRET？

**A**: 保护你的 API 不被未授权访问。没有这个密钥，任何人都可以触发你的爬虫任务，可能导致：
- 资源滥用
- 超出 Vercel 配额
- 数据库负载过高

### Q2: CRON_SECRET 和 SCRAPER_API_KEY 有什么区别？

**A**: 
- **CRON_SECRET**: 用于 Vercel Cron Job 自动触发（定时任务）
- **SCRAPER_API_KEY**: 用于手动 API 调用（可选）

两者都可以用来访问 `/api/scraper/run`，选择其一即可。

### Q3: 密钥泄露了怎么办？

**A**: 
1. 立即生成新密钥
2. 更新所有环境变量
3. 重新部署项目
4. 检查 Vercel 日志是否有异常访问

### Q4: 我忘记了密钥怎么办？

**A**: 
1. 查看 Vercel Dashboard → Environment Variables
2. 或者重新生成一个新的密钥

---

## ✅ 设置完成检查清单

- [ ] 本地创建了 `.env.local` 文件
- [ ] 添加了 `CRON_SECRET` 到 `.env.local`
- [ ] 在 Vercel 中添加了环境变量
- [ ] 选择了所有环境（Production, Preview, Development）
- [ ] 重新部署了项目
- [ ] 运行 `npm run test:cron` 测试成功
- [ ] 在 Vercel Dashboard 中确认 Cron Job 已启用
- [ ] 将密钥保存到密码管理器

---

## 📞 获取帮助

如果遇到问题：

1. **查看文档**：
   - `CRON_MONITORING_GUIDE.md` - 监控指南
   - `CRON_SETUP.md` - 初始设置

2. **运行测试**：
   ```bash
   npm run test:cron
   ```

3. **查看日志**：
   - Vercel Function 日志
   - 本地开发服务器日志

---

🎉 **恭喜！你的 CRON_SECRET 已经配置完成！**

现在你的 Cron Job 可以安全地运行了。记得定期检查运行状态！

