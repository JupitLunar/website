# 信任度提升 - 内容改动记录

## ✅ 已完成的改动（2026-01-21）

### 1. About页面文案更新 (`nextjs-project/src/app/about/page.tsx`)

**改动内容**（保持所有布局、className和scripts不变）：

- **Hero副标题**: 从"我们提供可靠信息"改为"我们不创造医疗建议—我们整理它"
- **Mission描述**: 强调"让官方指南易于访问"而非"提供支持"
- **三大价值观卡片**:
  - "Evidence-Based Knowledge" → "Content Curation, Not Creation"
  - "Innovation with Care" → "Technology-Driven Organization"
- **Our Story部分**: 完全重写
  - 添加创始人第一人称视角（Cathleen）
  - 明确说明"我不是医生"
  - 定位为"智能图书馆员"角色
  - 强调技术整理而非医疗创作
- **Core Values卡片**:
  - "Trustworthy" → "Source Transparency"
  - "Accessible" → "Organization, Not Interpretation"
  - "Continuously Improving" → "Guideline Monitoring"
- **From Mom to Moms部分**: 重写为个人故事，强调解决问题而非提供建议

### 2. MedicalDisclaimer组件文案更新 (`nextjs-project/src/components/MedicalDisclaimer.tsx`)

**改动内容**：

- **默认变体标题**: "Medical Disclaimer" → "How to Use This Information"
- **描述文字**: 明确说明"总结官方指南"而非"提供教育内容"
- **Banner变体标题**: "Medical Disclaimer" → "Official Guidelines Summary"
- **Compact变体标题**: "Medical Disclaimer" → "Official Guidelines Summary"

---

## 📋 下一步建议（按优先级）

### 🔥 高优先级（本周完成）

#### 1. 在Trust页面添加"What We Are NOT"部分

在 `nextjs-project/src/app/trust/page.tsx` 中添加新section（在现有section之后）：

**建议位置**: 在"Our Content Curation Process"之后

**内容要点**:
```markdown
## What We Are NOT
- ❌ We are NOT medical professionals
- ❌ We do NOT create medical advice
- ❌ We do NOT modify official guidelines
- ❌ We do NOT accept sponsored content to alter recommendations

## What We ARE
- ✅ Content Curators (organizing official guidelines)
- ✅ Technology Platform (making information searchable)
- ✅ Quality Aggregators (prioritizing Grade A sources)
```

#### 2. 在每篇文章顶部添加"Content Source"提示

在 `nextjs-project/src/app/[slug]/page.tsx` 的文章标题下方添加：

```tsx
<div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
  <p className="text-sm text-blue-800">
    <strong>Content Source:</strong> This article summarizes guidance from
    {/* 动态显示来源 */}. We organize official recommendations—we don't create our own.
    <Link href="/trust" className="underline ml-2">Learn about our curation process →</Link>
  </p>
</div>
```

#### 3. 创建"Report an Issue"表单

**新文件**: `nextjs-project/src/app/report-issue/page.tsx`

**表单字段**:
- Issue Type (dropdown): Outdated Guideline / Broken Link / Factual Error / Missing Attribution
- Article URL (auto-filled)
- Description (textarea)
- Email (optional)

**后端**: `nextjs-project/src/app/api/report-issue/route.ts`

---

### ⭐ 中优先级（本月完成）

#### 4. 创建"Content Updates Log"页面

**新文件**: `nextjs-project/src/app/content-updates/page.tsx`

**数据库表**:
```sql
CREATE TABLE content_updates (
  id UUID PRIMARY KEY,
  date DATE,
  type TEXT, -- 'guideline_change' | 'correction' | 'new_content'
  title TEXT,
  description TEXT,
  source_name TEXT,
  source_url TEXT,
  affected_articles TEXT[], -- slugs
  old_recommendation TEXT,
  new_recommendation TEXT,
  reporter_credit TEXT
);
```

#### 5. 创建"All Sources"展示页面

**新文件**: `nextjs-project/src/app/sources/page.tsx`

**内容**:
- 显示所有来源的表格（可搜索、可过滤）
- 每个来源显示：Organization、Grade、Last Verified、Used in X articles
- 统计Dashboard：Total Sources、Grade A %、Broken Links Count

#### 6. 在Footer添加链接

在 `nextjs-project/src/components/Footer.tsx`（如果有）添加：
- Report an Issue
- Content Updates
- All Sources
- Editorial Policy

---

### 🔮 长期优化（下季度）

#### 7. 实施来源健康度监控系统

**新脚本**: `scripts/monitoring/source-health-check.js`

功能：
- 每周检查所有source链接是否有效
- 监控CDC/AAP/Health Canada网站更新
- 标记超过18个月未验证的内容
- 自动发送报告到管理员邮箱

#### 8. 开源验证脚本到GitHub

创建公开仓库：`github.com/jupitlunar/content-verification`

包含：
- source-link-checker.js
- guideline-monitor.js
- content-freshness.js
- README说明

#### 9. API: 实时来源健康度

**新API**: `nextjs-project/src/app/api/source-health/route.ts`

返回：
```json
{
  "total_sources": 150,
  "grade_a_count": 120,
  "broken_link_count": 0,
  "avg_age_days": 180,
  "last_full_check": "2026-01-21T10:00:00Z"
}
```

在Trust页面实时显示这些数据。

---

## 🎯 核心策略总结

### 您的独特定位

**不是**: 医疗专家网站
**而是**: 官方健康指南的智能整理平台

### 类比参考

- **PubMed** - 不创造研究，但索引所有医学研究
- **Wikipedia** - 不创造知识，但整理和引用可靠来源
- **您** - 不创造医疗建议，但整理CDC/AAP/Health Canada的指南

### 信任度来源

1. **透明度** - 承认自己只是策展者
2. **可追溯性** - 每条信息都链接到原始来源
3. **来源质量** - 优先使用政府和医学协会（Grade A）
4. **更新机制** - 公开记录内容变更
5. **技术可靠性** - 自动化监控和验证

---

## 📝 文案准则

### ✅ 应该说:
- "CDC recommends..."
- "According to AAP guidelines..."
- "We organize official recommendations"
- "This summarizes guidance from..."

### ❌ 不应该说:
- "We recommend..."
- "Our experts suggest..."
- "Based on our research..."
- "We believe..."

### 关键短语:
- "Content curation, not creation"
- "We don't create medical advice—we organize it"
- "Official guidelines made accessible"
- "Think of us as a librarian for health guidelines"

---

## 🔗 相关资源

- Trust页面: `/trust`
- About页面: `/about`
- Medical Disclaimer组件: `components/MedicalDisclaimer.tsx`
- 知识库来源: 通过 `lib/supabase.ts` 的 `knowledgeBase.getSources()`

---

## 📊 成功指标

跟踪以下指标来衡量信任度提升效果：

1. **用户行为**:
   - Trust页面访问量
   - "Report an Issue"表单提交数
   - 来源链接点击率

2. **内容质量**:
   - Grade A来源占比（目标：>90%）
   - 破损链接数（目标：0）
   - 平均内容年龄（目标：<180天）

3. **社区参与**:
   - 用户报告的问题数
   - 社区贡献者数量
   - 修正响应时间（目标：<48小时）

4. **SEO和品牌**:
   - "reliable baby feeding guidelines"等关键词排名
   - 被其他网站引用次数
   - AI搜索结果引用率（ChatGPT、Perplexity等）

---

**最后更新**: 2026-01-21
**更新人**: Claude (基于用户要求)
