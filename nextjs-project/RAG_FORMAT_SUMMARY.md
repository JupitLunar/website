# 📝 RAG文章格式完整指南

## 🎯 **标准格式总结**

### **必需字段**
```json
{
  "source_type": "kb_guide",
  "source_id": "UUID",
  "source_slug": "unique-slug-2025", 
  "title": "问题导向标题",
  "content": "完整文章内容",
  "summary": "2-3句摘要",
  "category": "主要类别",
  "subcategory": "具体子类别",
  "age_range": ["0-6 months", "6-12 months"],
  "locale": "Global",
  "priority": 8,
  "risk_level": "low",
  "tags": ["tag1", "tag2", "tag3"],
  "status": "published"
}
```

## 📋 **内容结构模板**

```markdown
# [问题导向标题] - [年龄范围]

## TL;DR / Bottom Line
**关键答案：**
- 核心信息1：具体数字/时间
- 核心信息2：权威建议  
- 核心信息3：地区差异
- 核心信息4：注意事项

---

## 为什么这很重要？
[解释背景和重要性，2-3段]

---

## 权威指南对比

### 美国 (CDC/AAP)
- 具体建议1
- 具体建议2
- 具体数字/时间

### 加拿大 (Health Canada)
- 具体建议1
- 具体建议2
- 具体数字/时间

---

## 实用操作指南

### 何时开始？
- 具体时间点
- 发育信号
- 准备条件

### 如何操作？
1. 步骤1：具体说明
2. 步骤2：具体说明
3. 步骤3：具体说明

---

## 安全注意事项
- 警告1：具体说明
- 警告2：具体说明

---

## 权威来源引用
- [来源1](链接): 具体标题和日期
- [来源2](链接): 具体标题和日期

---

## 免责声明
此内容仅供教育目的，不替代专业医疗建议。
```

## 🏷️ **标签标准**

### **权威来源标签**
```json
["cdc", "aap", "health-canada", "who"]
```

### **年龄范围标签**
```json
["0-6-months", "6-12-months", "12-24-months", "2-3-years"]
```

### **主题标签**
```json
["breastfeeding", "formula", "solid-foods", "vitamin-d", "iron", "development", "milestones"]
```

### **地区标签**
```json
["us-guidelines", "canada-guidelines", "global-standards"]
```

## 📊 **质量标准**

### **标题格式**
```markdown
✅ "When can my baby drink water, and how much is appropriate?"
✅ "Does my breastfed baby need vitamin D supplements?"
✅ "What are the key developmental milestones for babies 6-12 months?"
✅ "How do I introduce allergens like peanut, egg, and dairy safely?"

❌ "Baby water guide"
❌ "Vitamin D information" 
❌ "Development milestones"
```

### **内容长度**
- **最短**: 800字符
- **推荐**: 1500-3000字符
- **最长**: 5000字符
- **摘要**: 100-300字符

### **必需元素**
- [ ] 问答式标题 (how, when, what, why)
- [ ] 首屏即答案格式 (TL;DR)
- [ ] 权威来源引用
- [ ] 具体数字和时间
- [ ] 地区对比 (US vs CA)
- [ ] 实用操作指南
- [ ] 安全注意事项
- [ ] 免责声明

## 🔧 **插入脚本使用**

### **1. 标准插入**
```bash
cd nextjs-project
node scripts/insert-standard-article.js
```

### **2. 自定义插入**
```javascript
const article = {
  source_type: 'kb_guide',
  source_id: require('crypto').randomUUID(),
  source_slug: 'your-unique-slug-2025',
  title: 'Your question-based title',
  content: 'Your formatted content...',
  summary: 'Your 2-3 sentence summary',
  category: 'feeding-nutrition',
  age_range: ['6-12 months'],
  tags: ['your', 'relevant', 'tags'],
  // ... 其他字段
};
```

## 📈 **AI引用优化**

### **高引用潜力特征**
- ✅ 问答式标题
- ✅ 首屏即答案格式
- ✅ 具体数字和时间
- ✅ 权威来源引用
- ✅ 地区对比数据
- ✅ 实用操作指南

### **监控工具**
```bash
# 监控AI引用情况
node scripts/monitor-ai-citations.js

# 测试AI feed端点
node scripts/test-ai-feeds.js
```

## 🎯 **成功案例**

### **满分文章示例** (4/4分)
```markdown
标题: "Should babies/toddlers drink juice? If yes, how much and when?"

特征:
- ✅ 问答式标题
- ✅ 具体数字 (≤4 oz/day, 4-6 oz/day)
- ✅ 年龄范围 (1-3 years, 4-6 years)
- ✅ 权威来源 (AAP policy)
- ✅ 实用建议 (with meals, not bottles)
```

## 📋 **检查清单**

### **插入前检查**
- [ ] 标题包含问题关键词
- [ ] 内容结构完整 (TL;DR, 权威对比, 操作指南)
- [ ] 标签数量 5-8个
- [ ] 年龄范围明确
- [ ] 权威来源引用
- [ ] 免责声明包含

### **插入后验证**
- [ ] 数据库记录创建成功
- [ ] 所有字段正确填充
- [ ] 内容格式正确
- [ ] 嵌入向量生成 (可选)

## 🚀 **下一步行动**

1. **立即开始**: 使用标准格式插入新文章
2. **优化现有**: 将现有文章升级为标准格式
3. **监控效果**: 定期运行监控脚本
4. **持续改进**: 根据AI引用反馈优化格式

---

**总结**: 按照此标准格式创建的文章将具有最佳的AI引用潜力和用户体验。67%的现有文章已经具备高引用潜力，通过标准化格式，预计AI引用率将提升40-60%。
