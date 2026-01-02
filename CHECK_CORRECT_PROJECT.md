# 检查正确的Supabase项目

## 问题发现

用户提供的项目URL：`https://isrsacgnhagdvwoytkuy.supabase.co`

这个项目ID (`isrsacgnhagdvwoytkuy`) 不在当前MCP Server可访问的项目列表中。

## 可能的情况

1. **项目属于不同的Supabase组织/账户**
2. **MCP Server配置的项目列表不完整**
3. **Workflow使用了不同的项目**

## 需要确认的事项

### 1. 环境变量配置

请检查以下位置的配置是否一致：

**本地环境 (`.env.local`)**:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://isrsacgnhagdvwoytkuy.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**GitHub Actions Secrets**:
- `NEXT_PUBLIC_SUPABASE_URL` = `https://isrsacgnhagdvwoytkuy.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` = (对应的service role key)

### 2. 在Supabase Dashboard中检查

请登录Supabase Dashboard，访问项目 `isrsacgnhagdvwoytkuy`，然后：

1. **打开SQL Editor**
2. **运行以下查询**：

```sql
-- 检查articles表总数
SELECT COUNT(*) as total_count FROM articles;

-- 检查符合Insight查询条件的文章
SELECT 
  id,
  slug,
  title,
  status,
  reviewed_by,
  created_at
FROM articles
WHERE reviewed_by = 'AI Content Generator'
  AND status = 'published'
ORDER BY created_at DESC
LIMIT 50;

-- 检查所有文章（最近20篇）
SELECT 
  id,
  slug,
  title,
  status,
  reviewed_by,
  created_at
FROM articles
ORDER BY created_at DESC
LIMIT 20;

-- 检查字段值分布
SELECT 
  status,
  reviewed_by,
  COUNT(*) as count
FROM articles
GROUP BY status, reviewed_by
ORDER BY count DESC;
```

### 3. 运行本地诊断脚本

```bash
cd nextjs-project
node scripts/diagnose-insight-display.js
```

这个脚本会使用 `.env.local` 中的配置连接到数据库并显示结果。

## URL格式确认

✅ **URL格式正确**: `https://isrsacgnhagdvwoytkuy.supabase.co`

这是标准的Supabase项目URL格式：
- 格式：`https://{project-ref}.supabase.co`
- 其中 `{project-ref}` 是项目的引用ID（通常是21个字符）

## 下一步

1. **在Supabase Dashboard中查询** `isrsacgnhagdvwoytkuy` 项目的articles表
2. **运行诊断脚本**查看本地环境连接的项目
3. **检查GitHub Actions Secrets**确认workflow使用的项目
4. **对比结果**找出数据实际存储的位置
