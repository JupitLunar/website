# Insight页面Table使用情况全面调查

## 调查日期
2024年（当前调查）

## 调查目的
确认insight页面中文章是从哪个table显示的，并验证workflow中是否插入了正确的table。

---

## 1. Insight页面使用的Table

### 代码位置
- 文件：`nextjs-project/src/app/insight/page.tsx`
- 函数：`getInsightArticles()` (第136-164行)

### Table名称
**`articles`** 表

### 查询代码
```typescript
const { data: articles, error } = await supabase
  .from('articles')  // ✅ 使用 articles 表
  .select('*')
  .eq('reviewed_by', 'AI Content Generator')  // ✅ 查询条件1
  .eq('status', 'published')                   // ✅ 查询条件2
  .order('created_at', { ascending: false })
  .limit(50);
```

### 查询条件
1. `reviewed_by = 'AI Content Generator'` - 标识AI生成的文章
2. `status = 'published'` - 只查询已发布状态的文章

---

## 2. Workflow中插入的Table

### Workflow文件
- 文件：`.github/workflows/auto-generate-articles.yml`
- 使用的脚本：`nextjs-project/scripts/auto-generate-articles.js`

### 插入函数
- 文件：`nextjs-project/scripts/auto-generate-articles.js`
- 函数：`insertArticle()` (第300-426行)

### Table名称
**`articles`** 表 ✅

### 插入代码
```javascript
// 第376-380行
const { data, error } = await supabase
  .from('articles')  // ✅ 使用 articles 表
  .insert([article])
  .select()
  .single();
```

### 插入的数据字段
```javascript
const article = {
  slug,
  type: topicInfo.type,
  hub: topicInfo.hub,
  lang: 'en',
  title: articleData.title,
  one_liner: articleData.one_liner || articleData.title,
  key_facts: enhancedKeyFacts.slice(0, 10),
  body_md: articleData.body_md,
  age_range: topicInfo.age_range,
  region: 'Global',
  last_reviewed: new Date().toISOString().split('T')[0],
  reviewed_by: 'AI Content Generator',  // ✅ 匹配insight查询条件
  entities: enhancedEntities,
  license: 'CC BY-NC 4.0',
  meta_title: articleData.meta_title || articleData.title,
  meta_description: articleData.meta_description || articleData.one_liner,
  keywords: [...],
  status: 'published'  // ✅ 匹配insight查询条件
  // article_source将在插入后单独更新（可选字段）
};
```

---

## 3. 验证结果

### ✅ Table一致性
- **Insight页面查询**: `articles` 表
- **Workflow插入**: `articles` 表
- **结论**: ✅ **一致**

### ✅ 字段匹配性
- **Insight查询条件1**: `reviewed_by = 'AI Content Generator'`
- **Workflow插入值**: `reviewed_by: 'AI Content Generator'`
- **结论**: ✅ **完全匹配**

- **Insight查询条件2**: `status = 'published'`
- **Workflow插入值**: `status: 'published'`
- **结论**: ✅ **完全匹配**

---

## 4. 其他发现

### 4.1 Workflow统计部分（非关键）
在 `.github/workflows/auto-generate-articles.yml` 的第84-88行，统计部分使用了 `article_source` 字段：
```yaml
.eq('article_source', 'ai_generated')
```

**注意**：这个字段在插入时是可选的（有尝试更新但可能失败），但**不影响insight页面的显示**，因为insight页面使用的是 `reviewed_by` 字段，而不是 `article_source` 字段。

### 4.2 其他插入方式
项目中还有其他插入文章的方式，如：
- `upsert_article_bundle` RPC函数（在 `supabase/schema.sql` 中定义）
- 但workflow使用的 `auto-generate-articles.js` 脚本**不使用**这个RPC函数，而是直接使用 `.insert()`

---

## 5. 结论

### ✅ 主要结论
1. **Table正确**: workflow插入到 `articles` 表，与insight页面查询的table完全一致 ✅
2. **字段正确**: workflow插入时设置了正确的 `reviewed_by` 和 `status` 字段值 ✅
3. **查询匹配**: insight页面的查询条件能够正确匹配workflow插入的文章 ✅

### ✅ 最终判断
**Workflow中插入的是正确的table，字段设置也正确，insight页面能够正确显示workflow生成的文章。**

---

## 6. 代码引用

### Insight页面查询代码
```typescript:144:150:nextjs-project/src/app/insight/page.tsx
const { data: articles, error } = await supabase
  .from('articles')
  .select('*')
  .eq('reviewed_by', 'AI Content Generator')
  .eq('status', 'published')
  .order('created_at', { ascending: false })
  .limit(50);
```

### Workflow插入代码
```javascript:376:380:nextjs-project/scripts/auto-generate-articles.js
const { data, error } = await supabase
  .from('articles')
  .insert([article])
  .select()
  .single();
```

### 插入数据设置
```javascript:340:353:nextjs-project/scripts/auto-generate-articles.js
reviewed_by: 'AI Content Generator',
// ...
status: 'published'
```

---

## 7. 建议（可选优化）

虽然当前实现是正确的，但可以考虑以下优化：

1. **统一字段使用**：如果 `article_source` 字段可用，可以考虑在insight页面也使用该字段作为额外的筛选条件（但不影响当前功能）

2. **文档说明**：可以在代码注释中明确说明insight页面使用 `reviewed_by` 字段来识别AI生成的文章

3. **错误处理**：确保workflow中的错误处理能够正确记录插入失败的情况

---

**调查完成时间**: 当前  
**调查人**: AI Assistant  
**状态**: ✅ 验证通过 - Table和字段设置都正确
