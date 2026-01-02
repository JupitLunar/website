# GitHub Secrets配置指南

## ❌ 当前错误

Workflow失败，错误信息：
```
TypeError [ERR_INVALID_URL]: Invalid URL
input: '***/'
```

这表明 `NEXT_PUBLIC_SUPABASE_URL` 在GitHub Secrets中没有正确设置。

## ✅ 需要在GitHub Secrets中配置的变量

前往 GitHub 仓库：
**Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### 必需的Secrets

1. **NEXT_PUBLIC_SUPABASE_URL**
   - 值: `https://isrsacgnhagdvwoytkuy.supabase.co`
   - ⚠️ 注意：不要有尾部斜杠 `/`
   - ⚠️ 注意：确保是完整的URL

2. **SUPABASE_SERVICE_ROLE_KEY**
   - 值: (您的Supabase service role key)
   - 可以在Supabase Dashboard → Settings → API 找到

3. **REVALIDATION_SECRET**
   - 值: `7kR3mP9vL2nQ6xW8zT5jH4yB1aF0gU3cE6dS9iO7pK2qY5wX8`
   - 用于触发页面revalidation

4. **OPENAI_API_KEY**
   - 值: (您的OpenAI API key)
   - 用于生成文章

5. **NEXT_PUBLIC_SITE_URL** (可选)
   - 值: `https://www.momaiagent.com`
   - 如果没有设置，会使用默认值

## 📋 检查清单

- [ ] `NEXT_PUBLIC_SUPABASE_URL` = `https://isrsacgnhagdvwoytkuy.supabase.co`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = (您的service role key)
- [ ] `REVALIDATION_SECRET` = `7kR3mP9vL2nQ6xW8zT5jH4yB1aF0gU3cE6dS9iO7pK2qY5wX8`
- [ ] `OPENAI_API_KEY` = (您的OpenAI API key)
- [ ] `NEXT_PUBLIC_SITE_URL` = `https://www.momaiagent.com` (可选)

## ✅ 修复后的改进

我已经更新了workflow文件，添加了：
1. **环境变量验证** - 在创建Supabase客户端之前检查环境变量
2. **更好的错误提示** - 如果环境变量缺失或无效，会显示清晰的错误信息
3. **修复查询逻辑** - 使用 `reviewed_by` 字段而不是 `article_source`（与insight页面保持一致）

## 🔄 下一步

1. 确保所有必需的GitHub Secrets都已正确设置
2. 重新运行workflow
3. 应该不会再出现URL错误
