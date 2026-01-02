# Revalidation Secret不匹配问题

## 问题诊断

API返回：`{"success":false,"error":"Unauthorized","message":"Invalid or missing revalidation secret"}`

这表示：
- ✅ API端点正常工作
- ❌ 提供的secret与Vercel环境变量中的`REVALIDATION_SECRET`不匹配

## 解决方案

您有两个选择：

### 方案1: 更新Vercel环境变量（推荐）

将Vercel环境变量中的`REVALIDATION_SECRET`更新为您提供的值：

**值**: `7kR3mP9vL2nQ6xW8zT5jH4yB1aF0gU3cE6dS9iO7pK2qY5wX8`

**步骤**：
1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择您的项目（momaiagentweb）
3. 进入 **Settings** → **Environment Variables**
4. 找到 `REVALIDATION_SECRET`
5. 点击编辑，更新值为：`7kR3mP9vL2nQ6xW8zT5jH4yB1aF0gU3cE6dS9iO7pK2qY5wX8`
6. **重要**: 确保选择正确的环境（Production、Preview、Development）
7. 保存后，Vercel会自动重新部署

### 方案2: 查看Vercel中的实际secret

如果您想使用Vercel中现有的secret：

1. 登录 Vercel Dashboard
2. 进入项目的 **Settings** → **Environment Variables**
3. 查看 `REVALIDATION_SECRET` 的值
4. 使用该值来测试revalidation API

## 同时更新GitHub Secrets

为了确保GitHub Actions workflow也能正常工作，请同时更新：

1. 进入GitHub仓库
2. **Settings** → **Secrets and variables** → **Actions**
3. 找到 `REVALIDATION_SECRET`
4. 更新为相同的值：`7kR3mP9vL2nQ6xW8zT5jH4yB1aF0gU3cE6dS9iO7pK2qY5wX8`

## 更新后的测试

更新Vercel环境变量后，等待几分钟让部署完成，然后再次测试：

```bash
curl -X POST https://www.momaiagent.com/api/revalidate \
  -H "Authorization: Bearer 7kR3mP9vL2nQ6xW8zT5jH4yB1aF0gU3cE6dS9iO7pK2qY5wX8" \
  -H "Content-Type: application/json" \
  -d '{"path": "/insight"}'
```

成功响应应该类似：
```json
{
  "success": true,
  "message": "Revalidation successful",
  "revalidated": {
    "paths": ["/insight", "/sitemap.xml"],
    "tags": [],
    "timestamp": "..."
  }
}
```

## 注意事项

⚠️ **安全提醒**: 
- 由于secret已经在对话中暴露，建议在更新后生成一个新的secret
- 生成新secret后，同时更新Vercel和GitHub Secrets

## 验证步骤

1. ✅ 更新Vercel环境变量 `REVALIDATION_SECRET`
2. ✅ 更新GitHub Secrets中的 `REVALIDATION_SECRET`
3. ✅ 等待Vercel重新部署（通常1-2分钟）
4. ✅ 测试revalidation API
5. ✅ 访问 `/insight` 页面确认显示37篇文章
