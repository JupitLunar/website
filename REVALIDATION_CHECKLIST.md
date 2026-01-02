# Revalidation 调试检查清单

## 问题：新生成的文章在数据库中有，但网页没有显示

### 需要检查的项目：

#### 1. ✅ GitHub Secrets 配置
- [x] `REVALIDATION_SECRET` 已在 GitHub Secrets 中配置（你已确认）

#### 2. ⚠️ Vercel 环境变量配置（重要！）
**关键问题**：GitHub Actions 调用 revalidation API 时，API 运行在 Vercel 上，需要验证 Vercel 环境变量：

- [ ] 在 Vercel 项目设置中，确认 `REVALIDATION_SECRET` 环境变量已设置
- [ ] **重要**：GitHub Secrets 中的 `REVALIDATION_SECRET` 必须与 Vercel 环境变量中的 `REVALIDATION_SECRET` **完全相同**
- [ ] 如果环境变量已修改，需要重新部署 Vercel 项目才能生效

#### 3. 检查 GitHub Actions 日志
运行 workflow 后，查看日志中的 "Trigger page revalidation" 步骤，应该看到：

```
🔄 Triggering page revalidation...
📍 SITE_URL: https://www.momaiagent.com
✅ REVALIDATION_SECRET is set (length: XX)
📡 Calling revalidation API: https://www.momaiagent.com/api/revalidate
📥 Response HTTP code: 200
📥 Response body: {...}
✅ Revalidation successful
```

如果看到：
- `⚠️ REVALIDATION_SECRET not set` → GitHub Secrets 未正确配置
- `HTTP 401` → Vercel 环境变量中的 REVALIDATION_SECRET 不匹配
- `HTTP 500` → API 内部错误，查看 Vercel 日志

#### 4. 检查 Vercel 部署日志
如果 revalidation API 调用失败，查看 Vercel 的 Function Logs：
1. 登录 Vercel Dashboard
2. 选择项目
3. 进入 "Functions" 标签
4. 查看 `/api/revalidate` 的日志
5. 查找错误信息

#### 5. 手动测试 revalidation API
可以使用以下命令手动测试（将 YOUR_SECRET 替换为实际的 REVALIDATION_SECRET）：

```bash
curl -X POST "https://www.momaiagent.com/api/revalidate" \
  -H "Authorization: Bearer YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"path": "/insight"}'
```

预期响应：
```json
{
  "success": true,
  "message": "Revalidation successful",
  "revalidated": {
    "paths": ["/insight", "/sitemap.xml"],
    "tags": [],
    "timestamp": "2026-01-02T..."
  }
}
```

#### 6. 备用方案：等待自动更新
如果 revalidation 失败，页面会在 5 分钟后自动更新（因为设置了 `revalidate = 300`）

### 快速修复步骤：

1. **确认 Vercel 环境变量**：
   - 登录 Vercel Dashboard
   - 进入项目 Settings → Environment Variables
   - 确认 `REVALIDATION_SECRET` 存在且值与 GitHub Secrets 一致

2. **如果环境变量不一致**：
   - 更新 Vercel 环境变量为与 GitHub Secrets 相同的值
   - 重新部署项目（或等待下次部署）

3. **重新运行 GitHub Actions workflow**：
   - 查看日志确认 revalidation 是否成功

4. **如果仍然失败**：
   - 查看 Vercel Function Logs 获取详细错误信息
   - 检查 API 路由代码是否有问题
