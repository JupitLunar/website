# SEO品牌策略 - 正确的品牌架构

**品牌层次结构**:
- **网站/平台**: www.momaiagent.com → **Mom AI Agent**
- **产品1**: **DearBaby** (Baby Tracker & Sleep app)
- **产品2**: **DearBaby: Solid Start** (Baby Recipes app)
- **公司**: **JupitLunar**

---

## 🎯 品牌定位策略

### **主品牌: Mom AI Agent**

**定位**: 证据驱动的母婴健康知识平台

**使用场景**:
- ✅ 网站主标题
- ✅ 所有页面的title模板
- ✅ 元数据中的siteName
- ✅ 结构化数据中的WebSite name
- ✅ 社交媒体账号名称

**品牌口号**:
```
"Mom AI Agent - Evidence-Based Parenting Guide for North America"
"Powered by Mom AI Agent" (用于产品页面)
```

### **产品品牌: DearBaby**

**定位**: 移动应用产品线

**使用场景**:
- ✅ 产品页面标题
- ✅ 应用介绍部分
- ✅ 产品相关的内容
- ✅ App Store链接和描述

**品牌关系**:
```
DearBaby - Powered by Mom AI Agent
DearBaby: Solid Start - Powered by Mom AI Agent
```

### **公司品牌: JupitLunar**

**定位**: 公司/组织名称

**使用场景**:
- ✅ Footer版权信息
- ✅ 关于页面
- ✅ 结构化数据中的Organization publisher
- ✅ 法律文档(隐私政策、服务条款)
- ✅ 联系信息

---

## 📝 SEO元数据优化建议

### **1. 主页元数据** (`layout.tsx`)

**当前问题**:
```typescript
title: {
  default: 'DearBaby - AI-Powered Maternal & Infant Care | Evidence-Based Parenting Guide',
  template: '%s | DearBaby by JupitLunar'
}
```

**建议修改**:
```typescript
title: {
  default: 'Mom AI Agent - Evidence-Based Parenting Guide for North America',
  template: '%s | Mom AI Agent'
},
description: 'Get expert maternal and infant care guidance powered by Mom AI Agent. Evidence-based feeding schedules, safety tips, and pediatric health advice from CDC, AAP, WHO, and Health Canada sources. Explore DearBaby and Solid Start apps.',
openGraph: {
  title: 'Mom AI Agent - Evidence-Based Parenting Guide',
  description: 'Evidence-based parenting guidance powered by Mom AI Agent. Trusted advice from CDC, AAP, WHO, and Health Canada for North American families.',
  url: siteUrl,
  siteName: 'Mom AI Agent', // 主品牌
  locale: 'en_US',
  type: 'website',
},
```

### **2. 文章页面元数据** (`[slug]/page.tsx`)

**当前问题**:
```typescript
title: `${article.title} | JupitLunar`,
```

**建议修改**:
```typescript
title: `${article.title} | Mom AI Agent`,
// ...
openGraph: {
  title: article.title,
  description: article.one_liner || article.body_md?.substring(0, 160),
  type: 'article',
  publishedTime: article.published_at,
  modifiedTime: article.updated_at,
  authors: ['Mom AI Agent Editorial Team'],
  images: article.featured_image ? [article.featured_image] : [],
  url: `https://www.momaiagent.com/${article.slug}`,
  siteName: 'Mom AI Agent', // 主品牌
},
```

### **3. 产品页面元数据**

#### **DearBaby产品页面**

**建议**:
```typescript
export const metadata: Metadata = {
  title: 'DearBaby - Baby Tracker & Sleep App | Mom AI Agent',
  description: 'DearBaby: Your AI parenting co-pilot. Track feeds, sleep, and growth with evidence-based guidance. Powered by Mom AI Agent. Free download on App Store.',
  keywords: ['DearBaby', 'baby tracker', 'sleep tracker', 'baby app', 'Mom AI Agent'],
  openGraph: {
    title: 'DearBaby - Baby Tracker & Sleep App',
    description: 'AI-powered baby tracking app with evidence-based guidance. Powered by Mom AI Agent.',
    siteName: 'Mom AI Agent', // 主品牌
    type: 'website',
  },
};
```

#### **Solid Start产品页面**

**建议**:
```typescript
export const metadata: Metadata = {
  title: 'DearBaby: Solid Start - Baby Food Recipes App | Mom AI Agent',
  description: 'DearBaby: Solid Start - Free baby food app with 100+ recipes, BLW meal planner, and allergen guidance. Powered by Mom AI Agent.',
  keywords: ['Solid Start', 'DearBaby Solid Start', 'baby food app', 'BLW recipes', 'Mom AI Agent'],
  openGraph: {
    title: 'DearBaby: Solid Start - Baby Food Recipes App',
    description: 'Free baby food app with recipes and meal planning. Powered by Mom AI Agent.',
    siteName: 'Mom AI Agent', // 主品牌
    type: 'website',
  },
};
```

---

## 🏗️ 结构化数据优化

### **1. WebSite Schema** (`json-ld.ts`)

**当前**:
```typescript
"@type": "WebSite",
"name": "JupitLunar",
```

**建议修改**:
```typescript
"@type": "WebSite",
"name": "Mom AI Agent",
"alternateName": "momaiagent.com",
"description": "Evidence-based parenting guide for North American families",
"url": siteUrl,
"publisher": {
  "@type": "Organization",
  "name": "JupitLunar", // 公司名
  "url": "https://www.jupitlunar.com" // 如有公司网站
}
```

### **2. Organization Schema**

**建议**:
```typescript
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "JupitLunar", // 公司名
  "description": "Health technology company",
  "url": "https://www.momaiagent.com", // 或公司网站
  "logo": {
    "@type": "ImageObject",
    "url": `${siteUrl}/Assets/Logo.png`
  },
  "sameAs": [
    "https://twitter.com/jupitlunar",
    "https://linkedin.com/company/jupitlunar"
  ],
  "owns": [
    {
      "@type": "SoftwareApplication",
      "name": "Mom AI Agent",
      "applicationCategory": "HealthApplication"
    },
    {
      "@type": "SoftwareApplication",
      "name": "DearBaby",
      "applicationCategory": "HealthApplication"
    },
    {
      "@type": "SoftwareApplication",
      "name": "DearBaby: Solid Start",
      "applicationCategory": "HealthApplication"
    }
  ]
}
```

### **3. Article Schema**

**建议**:
```typescript
{
  "@type": "Article",
  "headline": article.title,
  "publisher": {
    "@type": "Organization",
    "name": "Mom AI Agent", // 主品牌
    "logo": { /* ... */ }
  },
  "author": {
    "@type": "Organization",
    "name": "Mom AI Agent Editorial Team", // 编辑团队
    "memberOf": {
      "@type": "Organization",
      "name": "JupitLunar" // 所属公司
    }
  }
}
```

---

## 📱 产品页面SEO优化

### **产品页面结构建议**

#### **DearBaby产品页面** (`/products/dearbaby`)

**页面元素**:
1. **Hero Section**
   - 标题: "DearBaby - Baby Tracker & Sleep"
   - 副标题: "Powered by Mom AI Agent"
   - CTA: Download按钮

2. **产品描述**
   - 强调: "AI-powered baby tracking with evidence-based guidance"
   - 功能列表
   - 与Mom AI Agent知识库的关联

3. **SEO内容**
   - H2: "Why Choose DearBaby?"
   - H2: "Evidence-Based Features"
   - H2: "Powered by Mom AI Agent Knowledge Base"
   - 包含关键词: "baby tracker", "sleep tracker", "evidence-based"

#### **Solid Start产品页面** (`/products/solidstart`)

**页面元素**:
1. **Hero Section**
   - 标题: "DearBaby: Solid Start - Baby Food Recipes"
   - 副标题: "Powered by Mom AI Agent"
   - CTA: Download按钮

2. **产品描述**
   - 强调: "100+ recipes with CDC/AAP-aligned guidance"
   - 功能列表
   - 与Mom AI Agent喂养指南的关联

3. **SEO内容**
   - H2: "Evidence-Based Baby Food Recipes"
   - H2: "BLW Meal Planning Made Easy"
   - H2: "Powered by Mom AI Agent Feeding Guidelines"
   - 包含关键词: "baby food app", "BLW recipes", "solid food introduction"

---

## 🔗 内部链接策略

### **品牌关联链接**

**主页 → 产品页面**:
```typescript
// 在"Our Mobile Apps"部分
<Link href="/products/dearbaby">
  Learn More about DearBaby
</Link>
<Link href="/products/solidstart">
  Learn More about Solid Start
</Link>
```

**产品页面 → 相关内容**:
```typescript
// DearBaby产品页面
<Section>
  <h2>Powered by Mom AI Agent Knowledge Base</h2>
  <p>DearBaby integrates with Mom AI Agent's evidence-based guidance...</p>
  <Link href="/">Explore Mom AI Agent</Link>
  <Link href="/topics/feeding-foundations">Feeding Guidelines</Link>
</Section>
```

**文章页面 → 产品**:
```typescript
// 在相关文章中(如喂养相关文章)
<Section>
  <h3>Track Your Baby's Progress</h3>
  <p>Use <Link href="/products/dearbaby">DearBaby app</Link> to track feeds and sleep...</p>
</Section>
```

---

## 📊 关键词策略

### **主品牌关键词**

**Mom AI Agent** (网站品牌):
- "Mom AI Agent"
- "momaiagent"
- "evidence-based parenting guide"
- "North America baby care guide"

### **产品关键词**

**DearBaby**:
- "DearBaby app"
- "DearBaby baby tracker"
- "DearBaby sleep tracker"
- "Mom AI Agent DearBaby"

**Solid Start**:
- "DearBaby Solid Start"
- "Solid Start app"
- "baby food recipes app"
- "BLW meal planner"

### **组合关键词**

- "Mom AI Agent DearBaby"
- "Mom AI Agent Solid Start"
- "evidence-based baby apps"
- "CDC AAP baby tracking app"

---

## ✅ 实施检查清单

### **立即修复** (本周)

- [ ] 更新`layout.tsx`中的title和siteName为"Mom AI Agent"
- [ ] 更新所有文章页面的title模板
- [ ] 更新Open Graph中的siteName
- [ ] 更新结构化数据中的WebSite name

### **短期优化** (1个月)

- [ ] 优化DearBaby产品页面SEO
- [ ] 优化Solid Start产品页面SEO
- [ ] 添加产品页面的结构化数据
- [ ] 创建产品之间的内部链接

### **长期优化** (3个月)

- [ ] 创建"About Mom AI Agent"页面
- [ ] 创建"About JupitLunar"页面(公司信息)
- [ ] 优化产品页面的内容深度
- [ ] 建立产品与内容之间的关联

---

## 💡 关键建议

1. **品牌层次清晰**: 
   - 主品牌(Mom AI Agent)用于网站和平台
   - 产品品牌(DearBaby)用于应用
   - 公司品牌(JupitLunar)用于法律和公司信息

2. **品牌关联**:
   - 产品页面明确标注"Powered by Mom AI Agent"
   - 主页展示产品但以平台为主
   - 内容页面可以提及产品但不过度

3. **SEO平衡**:
   - 主品牌关键词优先
   - 产品关键词作为长尾补充
   - 避免品牌关键词堆砌

4. **用户体验**:
   - 品牌关系清晰易懂
   - 产品与平台的价值关联明确
   - 统一的视觉和语言风格

---

**总结**: 正确的品牌架构应该是"Mom AI Agent"作为主品牌(网站/平台), "DearBaby"和"DearBaby: Solid Start"作为产品品牌, "JupitLunar"作为公司品牌。SEO策略应该反映这个层次结构。





