# AEO (Answer Engine Optimization) Implementation Guide

## 🎯 Overview

This document describes the AEO optimizations implemented for JupitLunar to maximize content discoverability and citation by AI systems (ChatGPT, Claude, Perplexity, Bing Copilot, etc.) while maintaining authority WITHOUT requiring professional medical reviewers.

**Last Updated:** October 1, 2025
**Version:** 2.0

---

## 🔑 Core Strategy: "Authoritative Curation" Not "Medical Review"

### **Identity Positioning**
- ✅ **Science-based Content Curator** (not medical expert)
- ✅ **Information Aggregator** from official sources
- ✅ **Educational Resource** based on government guidelines
- ❌ NOT a medical authority making clinical claims

### **Legal Safety**
- No medical review claims → No liability
- Clear disclaimers on all content
- Always directs users to consult pediatricians
- Based on public domain government sources

---

## ✅ Implemented Optimizations

### 1. **Enhanced JSON-LD Schema**
**Location:** `src/lib/json-ld.ts`

#### Key Changes:
```javascript
// OLD: Claimed medical review
"reviewedBy": { "@type": "Person", "name": "Dr. X" }

// NEW: Citations to authority sources
"isBasedOn": [
  {
    "@type": "WebPage",
    "name": "CDC Infant Nutrition Guidelines",
    "url": "https://www.cdc.gov/...",
    "publisher": {
      "@type": "GovernmentOrganization",
      "name": "Centers for Disease Control and Prevention"
    }
  }
],
"sourceOrganization": {
  "@type": "GovernmentOrganization",
  "name": "CDC, AAP, Health Canada"
}
```

#### New Schema Properties:
- `isBasedOn` - Links to official guideline sources
- `sourceOrganization` - Clarifies content authority
- `contentReferenceTime` - Shows guideline freshness
- `educationalUse` - Marks as parent education
- `backstory` - Explains curation methodology
- `HealthTopicContent` schema (instead of `MedicalWebPage`)

#### Benefits:
- ✅ LLMs see clear citation trail
- ✅ No medical liability claims
- ✅ Authority from government sources, not individuals
- ✅ Better ranking in AI answer engines

---

### 2. **AI Feed Enhancement**
**Location:** `src/lib/supabase.ts` - `aiFeedManager`

#### New Metadata Fields:

| Field | Type | Purpose | Example |
|-------|------|---------|---------|
| `trustworthiness_score` | 0-1 | Calculated credibility | 0.85 |
| `evidence_level` | A/B/C | Evidence strength | A |
| `source_quality` | Enum | Source classification | "government" |
| `last_verified` | ISO date | Content verification date | "2025-09-15" |
| `freshness_days` | Number | Days since review | 45 |
| `primary_sources` | Array | Authority orgs | ["CDC", "AAP"] |
| `beginner_friendly` | Boolean | Accessibility flag | true |

#### Trustworthiness Calculation:
```javascript
trustworthiness = 0.5 (base)
  + 0.3 (if government source)
  + 0.05 × citation_count
// Capped at 0.95
```

#### Evidence Levels:
- **Level A**: Government source + 3+ citations
- **Level B**: 2+ citations
- **Level C**: 0-1 citations

#### API Endpoints Enhanced:
- `/api/ai-feed` - NDJSON format with metadata
- `/api/llm/answers` - Q&A pairs with trust scores
- `/api/kb/feed` - Knowledge base with evidence levels

---

### 3. **Intelligent Sitemap**
**Location:** `src/app/sitemap.ts`

#### Smart Priority System:

**Content Type Priorities:**
```
explainer:  0.80 (core educational content)
howto:      0.75 (practical guides)
faq:        0.70 (common questions)
research:   0.65 (research summaries)
recipe:     0.60 (food recipes)
news:       0.55 (time-sensitive)
```

**Freshness Boost:**
- Content < 30 days old: +0.10 priority
- Content < 90 days old: +0.05 priority
- Content > 90 days: No boost

**Change Frequency:**
- Updated within 7 days: `daily`
- Updated within 30 days: `weekly`
- Updated within 90 days: `monthly`
- Older: `yearly`

#### AI Feed Endpoints Priority:
```xml
<url>
  <loc>https://jupitlunar.com/api/ai-feed</loc>
  <priority>0.95</priority>
  <changefreq>daily</changefreq>
</url>
```

---

### 4. **Enhanced Robots.txt**
**Location:** `public/robots.txt`

#### Supported AI Crawlers:
✅ OpenAI GPTBot, ChatGPT-User
✅ Anthropic Claude, anthropic-ai
✅ Perplexity PerplexityBot
✅ Google Google-Extended, GoogleOther
✅ Microsoft BingBot, Bingbot
✅ Apple Applebot-Extended
✅ Meta Meta-ExternalAgent
✅ You.com YouBot
✅ Diffbot, CCBot, Bytespider

#### AEO Metadata Comments:
```
# Content-Type: Health Education & Parenting
# Geographic-Focus: North America (US, Canada)
# Content-Authority: Based on CDC, AAP, Health Canada official guidelines
# Trustworthiness-Level: High (government-backed sources)
# Medical-Disclaimer: Educational content only, not medical advice
```

**Why this works:**
Some AI systems parse robots.txt comments for metadata about site authority and content type.

---

### 5. **ClaimReview Schema**
**Location:** `src/lib/json-ld.ts` - `generateClaimReviewStructuredData()`

#### Purpose:
Combat common parenting myths with fact-checking schema.

#### Usage Example:
```javascript
generateClaimReviewStructuredData({
  claimText: "Honey is safe for babies under 12 months",
  rating: 'False',
  reviewExplanation: "According to CDC guidelines, honey can contain Clostridium botulinum spores...",
  authoritySource: "CDC",
  authorityUrl: "https://www.cdc.gov/botulism/...",
  articleUrl: "https://jupitlunar.com/honey-safety"
})
```

#### Output Schema:
```json
{
  "@type": "ClaimReview",
  "claimReviewed": "Honey is safe for babies under 12 months",
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": 1,
    "alternateName": "False"
  },
  "author": {
    "@type": "Organization",
    "name": "JupitLunar Editorial Team"
  }
}
```

---

## 📊 Expected Impact

### **Short-Term (1-3 months)**
- ✅ Improved indexing by AI systems
- ✅ Richer snippets in AI answers
- ✅ Citation in ChatGPT/Claude/Perplexity responses
- ✅ Better ranking in AI-powered search

### **Mid-Term (3-6 months)**
- ✅ Increased referral traffic from AI chat interfaces
- ✅ Higher authority score in AI knowledge graphs
- ✅ Featured in "Sources" sections of AI answers
- ✅ Reduced content duplication (unique voice recognized)

### **Long-Term (6-12 months)**
- ✅ Become "go-to source" for North American infant nutrition
- ✅ Partnership opportunities with AI platforms
- ✅ User recognition of brand authority
- ✅ Competitive moat against low-quality content farms

---

## 🚀 How to Use These Features

### **For Content Creators:**

#### 1. Always Add Citations
```javascript
citations: [
  {
    title: "When, What & How to Introduce Solid Foods",
    url: "https://www.cdc.gov/infant-toddler-nutrition/...",
    publisher: "CDC",
    published_date: "2025-01-15"
  }
]
```

**Best Practices:**
- ✅ Link to CDC, AAP, Health Canada official pages
- ✅ Use recent guideline dates
- ✅ Include 3-5 citations per article (aim for Evidence Level A)
- ✅ Prioritize .gov and .org domains

---

#### 2. Write Effective TL;DR (one_liner)
```javascript
// ❌ BAD
one_liner: "This article discusses infant feeding guidelines."

// ✅ GOOD
one_liner: "Start solids around 6 months when baby can sit upright; prioritize iron-rich foods (CDC 2025)."
```

**Format:**
- 1-2 sentences, 150-200 characters
- Include key action + authority source
- Answer the "What/When/How" directly
- Use parent-friendly language

---

#### 3. Add Key Facts (key_facts)
```javascript
key_facts: [
  "Start solids around 6 months when developmental signs are met",
  "Offer iron-rich foods at least twice daily",
  "Breast milk or formula remains primary nutrition through first year",
  "No honey before 12 months (botulism risk)",
  "Quarter grapes lengthwise to prevent choking"
]
```

**Guidelines:**
- 3-8 bullet points per article
- Each fact = 1 actionable takeaway
- Use active voice
- Include safety warnings

---

#### 4. Use ClaimReview for Myths
When writing about common misconceptions:

```javascript
// In article front matter or database:
claims_reviewed: [
  {
    claim: "Rice cereal must be baby's first food",
    rating: "False",
    explanation: "AAP guidelines allow any iron-rich food as first food..."
  }
]
```

---

### **For Developers:**

#### Check Content Quality Score:
```bash
curl https://jupitlunar.com/api/ai-feed | jq '.[] | {title, trustworthiness_score, evidence_level}'
```

#### Expected Output:
```json
{
  "title": "When to Start Solid Foods",
  "trustworthiness_score": 0.85,
  "evidence_level": "A"
}
```

---

## 📈 Monitoring AEO Performance

### **1. Track AI Referrals**

**Google Analytics 4 Custom Dimension:**
```javascript
// In Analytics dashboard, filter by:
referrer contains:
  - "perplexity.ai"
  - "chat.openai.com"
  - "claude.ai"
  - "copilot.microsoft.com"
  - "you.com"
```

### **2. Monitor Sitemap Crawling**

**Google Search Console:**
- Check sitemap coverage
- Monitor crawl frequency
- Track indexed pages

**Bing Webmaster Tools:**
- Submit sitemap manually
- Use IndexNow ping after new content

### **3. Test AI Citations**

**Manual Testing:**
```
Prompt ChatGPT/Claude/Perplexity:
"When should I start solid foods for my 5-month-old baby?
Cite official sources."

Expected: JupitLunar appears in citations or sources
```

---

## 🔧 Maintenance Tasks

### **Weekly:**
- [ ] Verify AI feed endpoints are accessible
- [ ] Check for broken citation links
- [ ] Monitor referral traffic from AI platforms

### **Monthly:**
- [ ] Update `lastVerified` dates for top 20 articles
- [ ] Review trustworthiness scores
- [ ] Add new AI crawlers to robots.txt

### **Quarterly:**
- [ ] Audit citations for updated guidelines
- [ ] Refresh content with new research
- [ ] Analyze which content types get cited most

---

## 📚 Content Guidelines Summary

### **The 3 C's of AEO Content**

1. **CLEAR** - Direct answers in first 200 characters
2. **CITED** - 3+ authoritative sources per article
3. **CURRENT** - Updated within 90 days, cite 2024-2025 guidelines

### **Authority Hierarchy**
```
Tier 1 (Government):     CDC, AAP, Health Canada, FDA
Tier 2 (Medical Orgs):   Mayo Clinic, Cleveland Clinic
Tier 3 (Universities):   .edu research publications
Tier 4 (Reputable):      HealthyChildren.org, WebMD
```

**Always prefer Tier 1 sources.**

---

## 🆘 Troubleshooting

### **Issue: Low Trustworthiness Score**
**Solution:**
- Add 2+ Tier 1 citations
- Update `last_reviewed` date
- Add evidence to `key_facts`

### **Issue: Not Appearing in AI Answers**
**Checklist:**
- ✅ Sitemap includes page
- ✅ robots.txt allows AI crawlers
- ✅ Content has clear TL;DR
- ✅ JSON-LD schema is valid
- ✅ Page loads in < 3 seconds

### **Issue: Wrong Information Cited**
**Action:**
- Add ClaimReview schema to correct misconception
- Submit sitemap re-crawl request
- Use IndexNow to push update

---

## 🎓 Learning Resources

### **Understanding AEO:**
- [Google's AI Overviews Guide](https://developers.google.com/search/docs/appearance/ai-overviews)
- [Schema.org Medical Types](https://schema.org/MedicalWebPage)

### **Tools:**
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)
- [IndexNow API](https://www.indexnow.org/)

---

## 📝 Version History

**v2.0** (2025-10-01)
- Added trustworthiness scoring system
- Implemented evidence level classification
- Enhanced sitemap with intelligent priority
- Expanded robots.txt with AEO metadata

**v1.0** (2024-08-31)
- Initial AEO implementation
- Basic JSON-LD schema
- AI crawler allowlist

---

## 🤝 Contributing

When adding new content:
1. Use the citation template
2. Run quality check: `npm run validate:content`
3. Test JSON-LD: `npm run test:schema`
4. Ping IndexNow: `npm run ping:indexnow -- <url>`

---

**For questions or suggestions, contact: hello@jupitlunar.com**
