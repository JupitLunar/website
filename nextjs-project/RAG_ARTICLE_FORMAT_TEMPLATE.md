# 📝 RAG文章格式标准模板

## 🎯 标准文章格式

### **1. 基本信息字段**

```json
{
  "source_type": "kb_guide",
  "source_slug": "unique-article-slug-2025",
  "title": "问题导向的标题 - 包含关键词和年龄范围",
  "content": "完整的文章内容",
  "summary": "2-3句的简洁摘要，包含关键数字",
  "category": "feeding-nutrition | development | safety | supplement",
  "subcategory": "具体子类别",
  "age_range": ["0-6 months", "6-12 months", "12-24 months"],
  "locale": "Global",
  "priority": 10,
  "risk_level": "low | medium | high",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "status": "published"
}
```

### **2. 内容结构模板**

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

### WHO (全球框架)
- 通用建议
- 国际标准

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

### 份量和频率
- 初始份量：具体数量
- 频率：具体时间安排
- 递增计划：时间表

---

## 安全注意事项
- 警告1：具体说明
- 警告2：具体说明
- 禁忌：明确列出

---

## 特殊情况处理
- 情况1：解决方案
- 情况2：解决方案
- 何时寻求帮助：明确标准

---

## 权威来源引用
- [来源1](链接): 具体标题和日期
- [来源2](链接): 具体标题和日期
- [来源3](链接): 具体标题和日期

---

## 免责声明
此内容仅供教育目的，不替代专业医疗建议。请咨询您的儿科医生获取个性化指导。
```

## 📋 具体格式示例

### **示例1: 维生素D补充指南**

```json
{
  "source_type": "kb_guide",
  "source_slug": "vitamin-d-iron-supplements-breastfed-babies-2025",
  "title": "Does my breastfed baby need vitamin D or iron supplements? How much and for how long?",
  "content": "## TL;DR\nBreastfed or mixed-fed infants need 400 IU/day vitamin D from soon after birth through 12 months; most children 12–24 months need 600 IU/day. In the U.S., many clinicians give 1 mg/kg/day elemental iron starting at ~4 months for exclusively breastfed infants until iron-rich solids are established.\n\n---\n\n## Why vitamin D matters for breastfed babies\n\nBreast milk is a superior source of many nutrients and protective factors—but vitamin D content is typically insufficient to meet an infant's daily need. CDC guidance states: <12 months: 400 IU/day; 12–24 months: 600 IU/day.\n\n---\n\n## U.S. vs Canada approaches\n\n**United States:** The AAP clinical pathway recommends 1 mg/kg/day iron beginning at 4 months for exclusively breastfed infants, continuing until iron-rich complementary foods reliably cover needs.\n\n**Canada:** Health Canada's 6–24-month recommendations stress prioritizing iron-rich first foods and repeated daily exposure during 6–12 months.\n\n---\n\n## Practical checklist\n- Start vitamin D 400 IU/day soon after birth if any breast milk is in the diet\n- Reassess at 12 months (goal typically 600 IU/day thereafter)\n- Discuss iron at the 4-month visit (U.S.)\n- Plan iron-rich complementary foods from ~6 months in both countries\n\n---\n\n## Authoritative sources\n- CDC vitamin D guidance\n- AAP iron supplementation summary\n- Health Canada 6–24 months recommendations",
  "summary": "Breastfed infants need 400 IU/day vitamin D from birth through 12 months, then 600 IU/day. U.S. clinicians often recommend 1 mg/kg/day iron starting at 4 months for exclusively breastfed infants until iron-rich solids are established.",
  "category": "feeding-nutrition",
  "subcategory": "supplements",
  "age_range": ["0-6 months", "6-12 months", "12-24 months"],
  "locale": "Global",
  "priority": 10,
  "risk_level": "medium",
  "tags": ["vitamin-d", "iron-supplements", "breastfeeding", "infant-nutrition", "cdc", "aap", "health-canada"],
  "status": "published"
}
```

### **示例2: 发展里程碑指南**

```json
{
  "source_type": "kb_guide",
  "source_slug": "baby-milestones-6-12-months-cdc-aap-guidance-2025",
  "title": "What are the key developmental milestones for babies 6-12 months?",
  "content": "## TL;DR\nBabies 6-12 months achieve major milestones: 6-8 months gain mobility and object permanence, 8-10 months show independence and pincer grasp, 10-12 months take first steps and say first words.\n\n---\n\n## Key Milestones 6-12 Months\n\n### Social and Emotional (6-8 months)\n- Recognizes familiar faces and shows stranger anxiety\n- Enjoys social play and peek-a-boo\n- Shows displeasure when playing stops\n\n### Language/Communication (6-8 months)\n- Responds to name\n- Begins to understand \"no\"\n- Makes different sounds for different emotions\n\n### Cognitive (Learning, Thinking, Problem-solving) (6-8 months)\n- Looks for hidden objects\n- Transfers objects from hand to hand\n- Bangs objects together\n\n### Movement/Physical Development (6-8 months)\n- Sits without support\n- Crawls forward on belly\n- Stands holding onto furniture\n\n---\n\n## 8-10 Months Milestones\n\n### New Achievements\n- Pulls to stand\n- Picks up small objects with thumb and finger (pincer grasp)\n- Says \"mama\" and \"dada\" to the right person\n- Understands object permanence\n\n---\n\n## 10-12 Months Milestones\n\n### Major Developments\n- Takes first steps\n- Says first words (beyond \"mama\" and \"dada\")\n- Follows simple instructions\n- Points to objects of interest\n\n---\n\n## When to be Concerned (Red Flags)\n- Doesn't crawl or sit without support by 12 months\n- Doesn't respond to name by 12 months\n- Doesn't say \"mama\" or \"dada\" by 12 months\n- Doesn't use gestures like waving or pointing\n\n---\n\n## Authoritative Sources\n- CDC: \"Milestone Moments\" (6-12 months)\n- AAP: \"Your Baby's Milestones\" (6-12 months)",
  "summary": "Babies 6-12 months achieve major milestones including mobility (sitting, crawling, standing), communication (first words, understanding), cognitive development (object permanence, problem-solving), and social skills (stranger awareness, social play).",
  "category": "development",
  "subcategory": "milestones",
  "age_range": ["6-12 months"],
  "locale": "Global",
  "priority": 10,
  "risk_level": "low",
  "tags": ["milestones", "development", "6-12-months", "cdc", "aap", "baby-growth", "motor-skills", "language-development"],
  "status": "published"
}
```

## 🎯 标题格式标准

### **优秀标题格式**
```markdown
✅ "When can my baby drink water, and how much is appropriate?"
✅ "Does my breastfed baby need vitamin D supplements? How much and for how long?"
✅ "What are the key developmental milestones for babies 6-12 months?"
✅ "How do I introduce allergens like peanut, egg, and dairy safely?"
✅ "Should babies drink juice? If yes, how much and when?"
```

### **避免的标题格式**
```markdown
❌ "Baby water guide"
❌ "Vitamin D information"
❌ "Development milestones"
❌ "Allergen introduction"
❌ "Juice for babies"
```

## 📊 元数据标准

### **必需字段**
- `title`: 问题导向，包含关键词
- `summary`: 2-3句，包含关键数字
- `age_range`: 具体年龄范围
- `category`: 主要类别
- `tags`: 5-8个相关标签

### **推荐字段**
- `subcategory`: 具体子类别
- `priority`: 1-10 (10为最高)
- `risk_level`: low/medium/high
- `locale`: Global/US/CA

### **标签标准**
```markdown
# 通用标签
["cdc", "aap", "health-canada", "who"]

# 年龄标签
["0-6-months", "6-12-months", "12-24-months"]

# 主题标签
["breastfeeding", "formula", "solid-foods", "vitamin-d", "iron"]

# 地区标签
["us-guidelines", "canada-guidelines", "global-standards"]

# 内容类型标签
["milestones", "safety", "nutrition", "development"]
```

## 🔧 内容质量标准

### **1. 首屏即答案**
```markdown
## TL;DR
**关键信息：**
- 具体数字/时间
- 权威建议
- 地区差异
- 注意事项
```

### **2. 权威来源引用**
```markdown
## Authoritative Sources
- [CDC](链接): "具体标题" (更新日期)
- [AAP](链接): "具体标题" (更新日期)
- [Health Canada](链接): "具体标题" (更新日期)
```

### **3. 实用操作指南**
```markdown
## Practical Steps
1. 何时开始：具体时间点
2. 如何操作：具体步骤
3. 份量和频率：具体数量
4. 安全注意事项：明确警告
```

### **4. 地区对比**
```markdown
## US vs Canada Guidelines
| 方面 | 美国 | 加拿大 |
|------|------|--------|
| 开始时间 | 6个月 | 6个月 |
| 首选食物 | 铁丰富食物 | 铁丰富食物 |
| 频率 | 逐渐增加 | 每天多次 |
```

## 📝 文章长度标准

- **最短**: 800字符
- **推荐**: 1500-3000字符
- **最长**: 5000字符
- **摘要**: 100-300字符

## ✅ 质量检查清单

- [ ] 标题包含问题关键词 (how, when, what, why)
- [ ] 首段包含明确的答案和关键数字
- [ ] 包含权威来源引用
- [ ] 年龄范围和地区信息明确
- [ ] 内容结构清晰，便于AI解析
- [ ] 标签数量5-8个，覆盖主要主题
- [ ] 摘要简洁明了，包含关键信息
- [ ] 包含实用操作指南
- [ ] 有明确的安全注意事项
- [ ] 包含免责声明

---

**使用说明**: 按照此模板格式创建文章，确保内容质量、AI引用友好性和用户体验的最佳平衡。
