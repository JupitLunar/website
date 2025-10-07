# 🗄️ 数据库插入完整指南

## 📊 **两个数据库表的作用**

### **1. Articles表 (正规文章)**
- **用途**: SEO优化、品牌建设、长篇内容
- **格式**: 博客文章、深度指南
- **目标**: 搜索引擎排名、用户教育

### **2. Knowledge_chunks表 (RAG知识库)**
- **用途**: AI引用、快速问答、知识检索
- **格式**: 问答式、结构化内容
- **目标**: LLM训练、AI搜索优化

## 🎯 **如何决定插入哪个表**

### **插入Articles表的情况**
```markdown
✅ 标题格式: "The Complete Guide to Baby Sleep Training"
✅ 内容类型: 长篇叙述性内容 (2000-5000字符)
✅ 目的: SEO排名、品牌建设
✅ 结构: 引言→背景→方法→案例→总结
✅ 更新频率: 季度/年度
```

### **插入Knowledge_chunks表的情况**
```markdown
✅ 标题格式: "When can I start sleep training my baby?"
✅ 内容类型: 问答式、结构化 (800-2000字符)
✅ 目的: AI引用、快速回答
✅ 结构: TL;DR→权威对比→操作指南→注意事项
✅ 更新频率: 月度/周度
```

## 🛠️ **具体插入方法**

### **方法1: 使用自动脚本 (推荐)**

#### **插入RAG知识库内容**
```bash
cd nextjs-project
node scripts/insert-standard-article.js
```

#### **插入正规文章**
```bash
cd nextjs-project
node scripts/insert-article.js
```

#### **决策工具**
```bash
cd nextjs-project
node scripts/content-type-manager.js
```

### **方法2: 手动插入 (高级用户)**

#### **RAG知识库插入**
```javascript
const article = {
  source_type: 'kb_guide',
  source_id: require('crypto').randomUUID(),
  source_slug: 'when-can-baby-sleep-train-2025',
  title: 'When can I start sleep training my baby, and what methods work best?',
  content: `## TL;DR
**睡眠训练指南：**
- 开始时间：4-6个月
- 最佳方法：渐进式
- 成功率：85%在2周内见效

---

## 权威指南对比
### 美国 (AAP)
- 4-6个月开始
- 推荐渐进式方法

### 加拿大 (CPS)
- 6个月开始
- 强调一致性

---

## 实用操作指南
1. 建立睡前程序
2. 逐步延长等待时间
3. 保持一致性`,
  summary: 'Most babies can start sleep training at 4-6 months. Gradual methods are most effective.',
  category: 'sleep',
  age_range: ['4-6 months', '6-12 months'],
  tags: ['sleep-training', 'methods', 'aap', 'cps'],
  priority: 8,
  risk_level: 'low',
  status: 'published'
};

// 插入到数据库
const { data, error } = await supabase
  .from('knowledge_chunks')
  .insert([article]);
```

#### **正规文章插入**
```javascript
const article = {
  slug: 'complete-baby-sleep-guide-2025',
  type: 'explainer',
  hub: 'sleep',
  lang: 'en',
  title: 'The Complete Guide to Baby Sleep Training: Evidence-Based Methods',
  one_liner: 'Learn evidence-based sleep training methods that work. From gentle approaches to structured programs.',
  key_facts: [
    'Most babies can sleep through the night by 6 months',
    'Gradual methods are often more successful',
    'Consistency is more important than the specific method'
  ],
  body_md: `# The Complete Guide to Baby Sleep Training

## Introduction
Sleep training can be one of the most challenging aspects of early parenting...

## Evidence-Based Methods
### 1. The Ferber Method
### 2. The Chair Method
### 3. The Pick-Up/Put-Down Method

## Creating the Right Environment
## Common Challenges and Solutions
## Conclusion`,
  age_range: '4-12 months',
  region: 'Global',
  last_reviewed: '2025-01-06',
  reviewed_by: 'JupitLunar Editorial Team',
  meta_title: 'Baby Sleep Training Guide: Evidence-Based Methods 2025',
  meta_description: 'Complete guide to baby sleep training with evidence-based methods.',
  keywords: ['baby sleep training', 'sleep methods', 'pediatrician approved'],
  status: 'published'
};

// 插入到数据库
const { data, error } = await supabase
  .from('articles')
  .insert([article]);
```

## 📋 **内容分类指南**

### **RAG知识库类别 (category)**
```javascript
const categories = {
  'feeding-nutrition': '喂养和营养',
  'feeding': '喂养相关',
  'development': '发展里程碑',
  'sleep': '睡眠训练',
  'safety': '安全指南',
  'supplement': '补充剂',
  'beverages': '饮品',
  'storage': '储存',
  'nutrition': '营养',
  'food-safety': '食品安全',
  'allergen': '过敏原',
  'scenario': '场景指南',
  'other': '其他'
};
```

### **正规文章类型 (type)**
```javascript
const types = {
  'explainer': '解释说明类',
  'howto': '操作指南类',
  'research': '研究报告类',
  'faq': '常见问题类',
  'recipe': '食谱类',
  'news': '新闻资讯类'
};
```

### **内容中心 (hub)**
```javascript
const hubs = {
  'feeding': '喂养',
  'sleep': '睡眠',
  'development': '发展',
  'safety': '安全',
  'mom-health': '妈妈健康',
  'recipes': '食谱'
};
```

## 🎯 **AEO问答插入方法**

### **方法1: 使用现有脚本插入问答格式**
```bash
# 插入问答式RAG内容
node scripts/insert-standard-article.js
```

### **方法2: 批量插入问答对**
```javascript
// 创建问答插入脚本
const qaPairs = [
  {
    question: "When can my baby start eating solid foods?",
    answer: "Most babies can start solid foods around 6 months when they show readiness signs.",
    category: "feeding-nutrition",
    age_range: ["6-12 months"],
    tags: ["solid-foods", "introduction", "6-months", "readiness"]
  },
  {
    question: "How much vitamin D does my baby need?",
    answer: "Breastfed babies need 400 IU/day vitamin D from birth through 12 months.",
    category: "supplement",
    age_range: ["0-12 months"],
    tags: ["vitamin-d", "supplements", "breastfeeding", "400-iu"]
  }
  // ... 更多问答对
];

// 批量插入
for (const qa of qaPairs) {
  const article = {
    source_type: 'kb_guide',
    source_id: require('crypto').randomUUID(),
    source_slug: qa.question.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: qa.question,
    content: `## TL;DR\n**${qa.answer}**\n\n---\n\n## 详细说明\n${qa.answer}\n\n## 权威来源\n- CDC Guidelines\n- AAP Recommendations`,
    summary: qa.answer,
    category: qa.category,
    age_range: qa.age_range,
    tags: qa.tags,
    priority: 8,
    risk_level: 'low',
    status: 'published'
  };
  
  await supabase.from('knowledge_chunks').insert([article]);
}
```

## 🚀 **实际操作步骤**

### **步骤1: 准备内容**
```markdown
1. 确定内容类型 (问答式 vs 叙述式)
2. 选择合适的类别和标签
3. 准备标题、摘要、正文
4. 添加权威来源引用
```

### **步骤2: 选择插入方法**
```bash
# 自动脚本 (推荐新手)
node scripts/insert-standard-article.js

# 决策工具 (不确定时)
node scripts/content-type-manager.js
```

### **步骤3: 验证插入结果**
```bash
# 检查插入是否成功
# 验证内容格式
# 确认嵌入向量生成
```

### **步骤4: 监控效果**
```bash
# 监控AI引用情况
node scripts/monitor-ai-citations.js

# 测试AI feed端点
node scripts/test-ai-feeds.js
```

## 💡 **最佳实践**

### **内容质量**
- 所有内容必须包含权威来源引用
- 使用问答式标题 (RAG) 或吸引人标题 (Articles)
- 确保内容准确性和时效性

### **格式标准**
- RAG: TL;DR格式，包含关键数字
- Articles: 完整叙述结构，包含案例
- 两者都要有明确的年龄范围和地区信息

### **SEO优化**
- 使用相关关键词
- 包含内部和外部链接
- 定期更新内容

---

**总结**: 使用提供的脚本可以轻松插入内容到正确的数据库表。RAG知识库用于AI引用，Articles表用于SEO优化。根据内容类型选择相应的插入方法和格式模板。
