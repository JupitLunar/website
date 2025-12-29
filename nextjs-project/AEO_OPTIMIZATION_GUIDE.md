# AEO (Answer Engine Optimization) Guide

## 概述

AEO (Answer Engine Optimization) 是针对 AI 搜索引擎的优化策略，目标是让内容被 ChatGPT、Perplexity、Google AI Overview、Claude 等 AI 助手引用。

## 核心优化策略

### 1. 内容结构优化

#### Quick Answer 格式
每篇文章开头包含 **Quick Answer** 部分：
- 2-3 句直接回答主要问题
- AI 可以直接引用这段内容
- 格式："[Topic] involves/requires/means [direct answer]."

```markdown
## Quick Answer

Babies typically start sleeping through the night between 4-6 months of age, 
though this varies by individual. Most pediatricians define "through the night" 
as a 6-8 hour stretch without feeding.
```

#### 问题形式标题
使用 How、What、When、Why、Can 开头的标题：
- ✅ "How Often Should I Feed My Newborn"
- ✅ "What Are the Signs of a Food Allergy in Babies"
- ❌ "Newborn Feeding Guide"
- ❌ "Baby Food Allergies"

### 2. FAQ 结构 (关键)

每篇文章生成 5-8 个 FAQ：
```json
{
  "faqs": [
    {
      "question": "How often should a newborn eat?",
      "answer": "Newborns typically need to feed every 2-3 hours, or 8-12 times per day. According to the AAP, you should feed on demand rather than on a strict schedule."
    }
  ]
}
```

### 3. 结构化数据 (JSON-LD)

已实现的 Schema 类型：

#### Article Schema
```json
{
  "@type": "Article",
  "headline": "...",
  "description": "...",
  "author": { "@type": "Organization", "name": "Mom AI Agent" }
}
```

#### FAQPage Schema
```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "...",
      "acceptedAnswer": { "@type": "Answer", "text": "..." }
    }
  ]
}
```

#### HowTo Schema
```json
{
  "@type": "HowTo",
  "name": "...",
  "step": [
    { "@type": "HowToStep", "name": "...", "text": "..." }
  ]
}
```

#### BreadcrumbList Schema
```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [...]
}
```

### 4. 权威来源引用

在内容中明确引用来源：
- "According to the American Academy of Pediatrics..."
- "The CDC recommends..."
- "2024 WHO guidelines suggest..."

### 5. Key Facts 格式

使用具体数据和证据：
```json
{
  "key_facts": [
    "Evidence shows that 85% of babies are ready for solids by 6 months",
    "The AAP recommends exclusive breastfeeding for the first 6 months",
    "Studies indicate that iron deficiency affects 10% of toddlers"
  ]
}
```

## 文件结构

```
/scripts/
  auto-generate-articles.js  # AEO优化的文章生成脚本
  topics-list.js              # AEO友好的问题形式主题列表

/src/app/insight/
  page.tsx                    # 列表页（含 CollectionPage schema）
  [slug]/page.tsx             # 详情页（含 Article, FAQ, HowTo, Breadcrumb schemas）
```

## 测试 AEO 效果

### 1. 验证 JSON-LD
使用 Google Rich Results Test: https://search.google.com/test/rich-results

### 2. 验证内容被 AI 引用
- 在 Perplexity 搜索相关问题
- 在 ChatGPT 问相关问题（开启 browsing）
- 查看 Google AI Overview 结果

### 3. 监控指标
- 来自 AI 搜索的流量（通过 referrer 分析）
- 文章被引用次数
- Featured Snippet 获取率

## 持续优化

### 每周任务
1. 分析哪些问题被 AI 频繁引用
2. 更新 Quick Answer 内容
3. 添加新的 FAQ

### 每月任务
1. 审查 topics-list.js 添加热门问题
2. 更新过时的权威来源引用
3. 分析竞争对手的 AEO 策略

## 技术注意事项

1. **JSON-LD 位置**: 使用 Next.js Script 组件在页面头部渲染
2. **数据存储**: AEO 元数据存储在 keywords 数组中（前缀 `__AEO_`）
3. **兼容性**: 同时支持传统 SEO 和 AEO

## 相关资源

- [Schema.org](https://schema.org/)
- [Google Rich Results](https://developers.google.com/search/docs/appearance/structured-data)
- [Perplexity Publisher Guidelines](https://www.perplexity.ai/hub)
