# GitHub Actions Workflow URL错误修复

## 错误信息

```
TypeError [ERR_INVALID_URL]: Invalid URL
input: '***/'
```

这个错误发生在workflow的"Get statistics"步骤中，说明 `NEXT_PUBLIC_SUPABASE_URL` 环境变量没有被正确设置。

## 问题原因

在 `.github/workflows/auto-generate-articles.yml` 的 "Get statistics" 步骤中，代码尝试创建Supabase客户端，但 `NEXT_PUBLIC_SUPABASE_URL` 可能：
1. 没有在GitHub Secrets中设置
2. 设置为无效的值（如 `***/`）
3. 设置为空值

## 解决方案

### 1. 检查GitHub Secrets

前往 GitHub 仓库：
1. **Settings** → **Secrets and variables** → **Actions**
2. 确认以下secrets已正确设置：
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://isrsacgnhagdvwoytkuy.supabase.co`（注意：不要有尾部斜杠）
   - `SUPABASE_SERVICE_ROLE_KEY` = (您的service role key)
   - `REVALIDATION_SECRET` = `7kR3mP9vL2nQ6xW8zT5jH4yB1aF0gU3cE6dS9iO7pK2qY5wX8`

### 2. 确认URL格式

确保 `NEXT_PUBLIC_SUPABASE_URL` 的格式为：
- ✅ **正确**: `https://isrsacgnhagdvwoytkuy.supabase.co`
- ❌ **错误**: `https://isrsacgnhagdvwoytkuy.supabase.co/`（尾部斜杠）
- ❌ **错误**: `***/`（占位符）
- ❌ **错误**: 空值

### 3. 添加URL验证

在workflow中添加URL验证，或者修复现有的环境变量使用方式。

## 快速修复

在GitHub Secrets中：

1. 确认 `NEXT_PUBLIC_SUPABASE_URL` 设置为：`https://isrsacgnhagdvwoytkuy.supabase.co`
   - 确保没有尾部斜杠 `/`
   - 确保没有额外的空格
   - 确保是完整的URL格式

2. 确认所有必需的secrets都已设置：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `REVALIDATION_SECRET`
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_SITE_URL`（可选，有默认值）

## 验证

更新secrets后，重新运行workflow，应该不会再出现URL错误。
