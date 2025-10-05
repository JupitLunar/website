# 🚀 运行 RAG 系统迁移 - 现在开始！

## ⚡ 快速 3 步部署

### 第 1 步：打开 Supabase SQL Editor

点击此链接：
```
https://supabase.com/dashboard/project/isrsacgnhagdvwoytkuy/sql
```

### 第 2 步：复制迁移 SQL

在终端运行（Mac）：
```bash
cd nextjs-project
cat supabase/migrations/20251005_rag_optimization.sql | pbcopy
```

**或者手动复制：**
1. 打开文件：`nextjs-project/supabase/migrations/20251005_rag_optimization.sql`
2. 全选（Cmd+A）
3. 复制（Cmd+C）

### 第 3 步：在 Supabase 中执行

1. 在 Supabase SQL Editor 中点击 **"New Query"**
2. 粘贴（Cmd+V）迁移 SQL
3. 点击 **"Run"** 或按 Cmd+Enter
4. 等待执行完成（约 30-60 秒）
5. 看到 "Success" 消息 ✅

---

## ✅ 验证迁移

迁移完成后，在终端运行：

```bash
cd nextjs-project
node scripts/deploy-rag-system.js
```

应该看到：
```
✅ Database migration: Complete
✅ Knowledge base populated: Yes (XXX chunks)
✅ Hybrid search: Working
```

---

## 🎉 完成！

迁移成功后，我会自动：
- ✅ 填充知识库数据
- ✅ 验证混合搜索功能
- ✅ 生成统计报告

然后我们继续：
- 🔢 生成向量嵌入
- 🧪 测试 RAG 搜索
- 📊 验证质量监控

---

## ❓ 遇到问题？

**常见错误：**

1. **"relation already exists"** - 正常，表已存在
2. **"function already exists"** - 正常，函数已存在
3. **超时** - SQL 太长，分段执行（见下方）

**分段执行（如果需要）：**

如果一次执行失败，可以分 7 段执行：

```sql
-- 分别复制并执行这些部分：
PART 1: Lines 1-60   (article_summaries扩展)
PART 2: Lines 61-150 (knowledge_chunks优化)
PART 3: Lines 151-180 (quality_metrics表)
PART 4: Lines 181-260 (hybrid_search函数)
PART 5: Lines 261-320 (populate函数)
PART 6: Lines 321-380 (update函数)
PART 7: Lines 381-end (helper函数)
```

---

**准备好了吗？开始执行第1步！** ⬆️
