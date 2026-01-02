# Workflow后网站显示问题诊断指南

## 问题描述
Workflow执行后，insight页面没有正确显示新生成的文章。

## 快速诊断步骤

### 1. 运行诊断脚本（推荐）

```bash
cd nextjs-project
node scripts/diagnose-insight-display.js
```

这个脚本会检查：
- ✅ 数据库中的所有文章
- ✅ Insight页面的查询条件是否匹配
- ✅ 字段值分布（status和reviewed_by）
- ✅ 最近24小时插入的文章
- ✅ 精确模拟Insight页面的查询

### 2. 使用调试API

访问以下URL查看API返回的数据：
```
https://your-domain.com/api/debug/insight-articles
```

这会显示：
- 所有已发布的文章
- AI生成的文章（reviewed_by = 'AI Content Generator'）
- 最新文章列表
- Insight查询结果

### 3. 检查GitHub Actions日志

1. 前往 GitHub Actions: `.github/workflows/auto-generate-articles.yml`
2. 查看最新的workflow运行日志
3. 检查：
   - 文章是否成功插入（查找"✅ 文章插入成功"）
   - Revalidation是否成功（查找"✅ Revalidation successful"）
   - 是否有错误信息

## 可能的原因和解决方案

### 原因1: 字段值不正确 ❌

**症状**: 诊断脚本显示文章存在，但字段值不匹配

**检查**:
- `status` 应该是 `'published'`（不是 `'draft'`）
- `reviewed_by` 应该是 `'AI Content Generator'`（完全匹配，包括大小写）

**解决方案**:
如果字段值不正确，检查 `nextjs-project/scripts/auto-generate-articles.js` 的 `insertArticle` 函数（第328-355行），确保：
```javascript
status: 'published'
reviewed_by: 'AI Content Generator'
```

### 原因2: 缓存问题 ⏰

**症状**: 数据库查询正常，但网站不显示

**检查**:
- 页面设置了 `revalidate = 300`（5分钟ISR缓存）
- Revalidation API可能没有触发或失败

**解决方案**:
1. **等待5分钟** - ISR会自动更新
2. **手动触发revalidation**:
   ```bash
   curl -X POST https://your-domain.com/api/revalidate \
     -H "Authorization: Bearer YOUR_REVALIDATION_SECRET" \
     -H "Content-Type: application/json" \
     -d '{"path": "/insight"}'
   ```
3. **检查Vercel Dashboard** - 查看是否有部署或缓存问题

### 原因3: Revalidation失败 🔄

**症状**: GitHub Actions日志显示revalidation失败

**检查**:
- `REVALIDATION_SECRET` 是否在GitHub Secrets和Vercel环境变量中正确设置
- Revalidation API是否返回200状态码

**解决方案**:
1. 检查GitHub Secrets中是否有 `REVALIDATION_SECRET`
2. 检查Vercel环境变量中是否有 `REVALIDATION_SECRET`
3. 确保两个地方的secret值相同
4. 查看workflow日志中的revalidation步骤输出

### 原因4: 数据未插入 💾

**症状**: 诊断脚本显示没有符合条件的文章

**检查**:
- Workflow是否成功完成
- 是否有插入错误
- 文章是否因为重复而跳过

**解决方案**:
1. 查看GitHub Actions日志，检查是否有插入错误
2. 运行 `node scripts/check-workflow-status.js` 查看文章统计
3. 检查是否有"Slug已存在"的跳过消息

## 验证Table和字段设置 ✅

根据代码审查，以下设置是**正确的**：

### Insight页面查询（`nextjs-project/src/app/insight/page.tsx`）
```typescript
.from('articles')
.eq('reviewed_by', 'AI Content Generator')
.eq('status', 'published')
```

### Workflow插入（`nextjs-project/scripts/auto-generate-articles.js`）
```javascript
.from('articles')
status: 'published'
reviewed_by: 'AI Content Generator'
```

**结论**: Table名称和字段值都**完全匹配** ✅

## 诊断脚本输出解读

### 正常情况
```
✅ 查询成功！找到 X 篇文章
这些文章应该显示在Insight页面上:
1. Article Title 1
2. Article Title 2
...
```

### 问题情况

**情况1: 没有找到文章**
```
❌ 数据库中没有找到符合条件的文章
```
→ 检查workflow是否成功插入，字段值是否正确

**情况2: 字段值不匹配**
```
⚠️  发现最近插入的文章字段值不正确:
   - Article Title
     status: draft (期望: published)
     reviewed_by: Some Other Value (期望: AI Content Generator)
```
→ 检查插入代码，确保字段值正确

**情况3: 数据库有数据但网站不显示**
```
✅ 数据库查询正常，找到了符合条件的文章
如果网站仍然不显示，可能的原因:
1. 页面缓存问题
2. Revalidation未触发
3. Vercel部署问题
```
→ 等待5分钟或手动触发revalidation

## 下一步操作建议

1. **立即执行**: 运行诊断脚本 `node scripts/diagnose-insight-display.js`
2. **查看结果**: 根据脚本输出确定问题类型
3. **采取行动**: 
   - 如果是字段值问题 → 检查插入代码
   - 如果是缓存问题 → 等待或手动revalidate
   - 如果是数据未插入 → 检查workflow日志
4. **验证修复**: 运行诊断脚本确认问题已解决

## 相关文件

- 诊断脚本: `nextjs-project/scripts/diagnose-insight-display.js`
- Insight页面: `nextjs-project/src/app/insight/page.tsx`
- Workflow脚本: `nextjs-project/scripts/auto-generate-articles.js`
- Workflow配置: `.github/workflows/auto-generate-articles.yml`
- Revalidation API: `nextjs-project/src/app/api/revalidate/route.ts`
- 调试API: `nextjs-project/src/app/api/debug/insight-articles/route.ts`

## 联系支持

如果问题仍然存在，请提供：
1. 诊断脚本的完整输出
2. GitHub Actions workflow的日志
3. `/api/debug/insight-articles` 的响应
4. Vercel部署日志（如果有）
