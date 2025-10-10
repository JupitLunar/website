# 📚 知识库扩展完整指南

## 🎯 概述

本指南将帮助你了解如何扩展现有的母婴护理知识库，包括添加新的文章、问答、食物信息和指南。

---

## 📊 知识库结构

### 主要数据表

1. **`articles`** - 正规文章（SEO优化）
2. **`knowledge_chunks`** - RAG知识块（AI引用）
3. **`kb_foods`** - 食物数据库
4. **`kb_rules`** - 安全规则
5. **`kb_guides`** - 操作指南
6. **`kb_faqs`** - 常见问题
7. **`kb_sources`** - 权威来源

---

## 🚀 扩展方法

### 方法1: 使用现有脚本（推荐）

#### 1.1 插入标准RAG文章
```bash
cd nextjs-project
node scripts/insert-standard-article.js
```

#### 1.2 插入正规文章
```bash
cd nextjs-project
node scripts/insert-article.js
```

#### 1.3 内容类型决策工具
```bash
cd nextjs-project
node scripts/content-type-manager.js
```

### 方法2: 创建自定义脚本

#### 2.1 创建新的知识块脚本

创建文件：`scripts/insert-your-topic.js`

```javascript
#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// 加载环境变量
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 你的知识块数据
const knowledgeChunks = [
  {
    source_type: 'kb_guide',
    source_id: require('crypto').randomUUID(),
    source_slug: 'your-topic-slug-2025',
    title: 'Your Question Title Here?',
    content: `## TL;DR
**关键要点：**
- 要点1
- 要点2
- 要点3

---

## 详细说明

详细的内容说明...

---

## 权威来源对比

### 美国 (AAP)
- 建议1
- 建议2

### 加拿大 (CPS)
- 建议1
- 建议2

---

## 实用操作指南

1. 步骤1
2. 步骤2
3. 步骤3`,
    summary: 'Brief summary of the answer',
    category: 'your-category',
    subcategory: 'your-subcategory',
    age_range: ['0-6 months', '6-12 months', '12-24 months'],
    locale: 'Global',
    priority: 8,
    risk_level: 'low',
    tags: ['tag1', 'tag2', 'tag3'],
    status: 'published'
  }
  // 添加更多知识块...
];

async function insertKnowledgeChunks() {
  console.log(`插入 ${knowledgeChunks.length} 个知识块...\n`);

  const { data, error } = await supabase
    .from('knowledge_chunks')
    .insert(knowledgeChunks)
    .select();

  if (error) {
    console.error('插入错误:', error);
    process.exit(1);
  }

  console.log(`✅ 成功插入 ${data.length} 个知识块\n`);
  data.forEach((chunk, i) => {
    console.log(`${i + 1}. ${chunk.id} - ${chunk.title}`);
  });

  console.log('\n📝 下一步: 运行 generate-embeddings.js');
}

insertKnowledgeChunks().catch(console.error);
```

#### 2.2 添加新食物到食物数据库

创建文件：`scripts/insert-new-foods.js`

```javascript
#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const newFoods = [
  {
    slug: 'your-food-name',
    name: 'Your Food Name',
    locale: 'Global',
    age_range: ['6-9m', '9-12m', '12-24m'],
    feeding_methods: ['blw', 'puree'],
    serving_forms: [
      {
        form: 'Preparation method for 6-9 months',
        prep: 'Detailed preparation instructions',
        notes: 'Important safety notes',
        texture: 'Texture description',
        age_range: '6-9m'
      },
      {
        form: 'Preparation method for 9-12 months',
        prep: 'Detailed preparation instructions',
        notes: 'Important safety notes',
        texture: 'Texture description',
        age_range: '9-12m'
      }
    ],
    risk_level: 'low',
    nutrients_focus: ['iron', 'vitamin-c', 'fiber'],
    do_list: [
      'Safe preparation tip 1',
      'Safe preparation tip 2'
    ],
    dont_list: [
      'Safety warning 1',
      'Safety warning 2'
    ],
    why: 'Explanation of why this food is good for babies',
    how_to: [
      {
        title: 'Preparation Tips',
        description: 'Detailed preparation instructions'
      }
    ],
    portion_hint: 'Portion size recommendations',
    source_ids: ['source-id-1', 'source-id-2'],
    reviewed_by: 'Feeding Expert',
    last_reviewed_at: '2025-01-10',
    expires_at: '2027-01-10',
    status: 'published'
  }
];

async function insertFoods() {
  console.log(`插入 ${newFoods.length} 个食物...\n`);

  const { data, error } = await supabase
    .from('kb_foods')
    .insert(newFoods)
    .select();

  if (error) {
    console.error('插入错误:', error);
    process.exit(1);
  }

  console.log(`✅ 成功插入 ${data.length} 个食物\n`);
  data.forEach((food, i) => {
    console.log(`${i + 1}. ${food.name} (${food.slug})`);
  });
}

insertFoods().catch(console.error);
```

---

## 📝 内容类型指南

### RAG知识块 (knowledge_chunks)

**适用场景：**
- 问答式内容
- 快速参考信息
- AI引用的内容
- 结构化指南

**内容格式：**
```markdown
## TL;DR
**关键要点：**
- 要点1
- 要点2

---

## 详细说明
详细内容...

---

## 权威来源对比
### 美国 (AAP)
- 建议

### 加拿大 (CPS)
- 建议

---

## 实用操作指南
1. 步骤1
2. 步骤2
```

### 正规文章 (articles)

**适用场景：**
- 长篇深度内容
- SEO优化内容
- 博客文章
- 综合指南

**内容格式：**
```markdown
# 文章标题

## 引言
文章介绍...

## 主要内容
详细内容...

## 结论
总结...
```

---

## 🏷️ 分类和标签

### 主要类别 (category)
- `feeding-nutrition` - 喂养营养
- `development` - 发育
- `safety` - 安全
- `sleep` - 睡眠
- `health` - 健康
- `parenting` - 育儿

### 子类别 (subcategory)
- `solid-foods` - 辅食
- `breastfeeding` - 母乳喂养
- `allergens` - 过敏原
- `choking-prevention` - 防窒息
- `sleep-training` - 睡眠训练

### 年龄范围 (age_range)
- `0-6 months`
- `6-12 months`
- `12-24 months`
- `2-3 years`

### 风险等级 (risk_level)
- `none` - 无风险
- `low` - 低风险
- `medium` - 中等风险
- `high` - 高风险

---

## 🔧 实际操作步骤

### 步骤1: 准备内容
1. 确定内容类型和目标受众
2. 收集权威来源信息
3. 准备标题、摘要和正文
4. 选择合适的分类和标签

### 步骤2: 选择插入方法
```bash
# 使用决策工具
node scripts/content-type-manager.js

# 或直接使用相应脚本
node scripts/insert-standard-article.js
node scripts/insert-article.js
```

### 步骤3: 验证插入结果
```bash
# 检查数据库
node scripts/check-database.js

# 验证内容
node scripts/validate-kb.js
```

### 步骤4: 生成嵌入向量
```bash
# 为RAG内容生成向量嵌入
node scripts/generate-embeddings.js
```

### 步骤5: 测试AI引用
```bash
# 测试RAG搜索
node scripts/test-rag-search.js

# 监控AI引用
node scripts/monitor-ai-citations.js
```

---

## 📊 内容质量标准

### 必备要素
- ✅ 权威来源引用
- ✅ 明确的年龄范围
- ✅ 准确的风险评估
- ✅ 实用的操作指导
- ✅ 清晰的标题和摘要

### 内容格式要求
- ✅ 使用标准模板结构
- ✅ 包含TL;DR摘要
- ✅ 提供权威来源对比
- ✅ 给出实用操作指南
- ✅ 添加相关标签

### SEO优化
- ✅ 使用相关关键词
- ✅ 包含内部链接
- ✅ 定期更新内容
- ✅ 优化元数据

---

## 🚨 注意事项

### 数据约束
- `locale` 必须设置为 `'Global'`
- `source_id` 必须是唯一的UUID
- `status` 必须设置为 `'published'` 才能显示
- `risk_level` 必须是预定义的值之一

### 内容要求
- 所有内容必须基于权威来源
- 不得包含医疗建议（仅提供教育信息）
- 必须包含适当的免责声明
- 定期审查和更新内容

---

## 🎯 扩展建议

### 优先扩展领域
1. **辅食引入** - 更多食物的安全准备方法
2. **过敏管理** - 过敏原引入和反应处理
3. **发育里程碑** - 各年龄段的发育指导
4. **安全防护** - 家居安全和意外预防
5. **营养需求** - 各年龄段的营养重点

### 内容来源建议
- 美国儿科学会 (AAP)
- 疾病控制中心 (CDC)
- 加拿大儿科协会 (CPS)
- 世界卫生组织 (WHO)
- 营养学会指南

---

## 📞 获取帮助

如果遇到问题，可以：
1. 查看现有脚本示例
2. 使用 `content-type-manager.js` 决策工具
3. 检查数据库约束和错误信息
4. 参考现有的成功案例

---

**总结**: 通过使用提供的脚本和模板，你可以轻松扩展知识库。记住要基于权威来源，使用标准格式，并定期验证内容质量。
