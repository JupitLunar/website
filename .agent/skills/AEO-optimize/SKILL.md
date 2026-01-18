# AEO Optimization Agent Skill

## Overview

This skill enables an AI agent to analyze and optimize website content for Answer Engine Optimization (AEO). The agent can audit existing content, identify optimization opportunities, implement technical improvements, and create AEO-compliant content that performs well in AI-powered search engines, voice assistants, and answer engines.

## Skill Capabilities

### Core Functions
- Analyze web pages for AEO optimization opportunities
- Generate structured data (schema markup) for content
- Rewrite content in answer-first format
- Create question-based content strategies
- Audit technical AEO implementation
- Generate FAQ sections optimized for answer engines
- Provide actionable optimization recommendations

### Output Types
- AEO audit reports with prioritized recommendations
- Schema markup code (JSON-LD format)
- Optimized content in answer-first format
- Question research and mapping
- Technical implementation guides
- Performance tracking dashboards

## Agent Instructions

### 1. Content Analysis Protocol

When analyzing content for AEO optimization, execute the following sequence:

**Step 1: Question Identification**
- Extract all implicit and explicit questions the content answers
- Identify primary question (main topic)
- List secondary questions (supporting topics)
- Note missing questions users commonly ask about the topic

**Step 2: Answer Structure Assessment**
- Check if answers appear in first 40-60 words
- Verify direct answer format (question → answer → details)
- Assess conversational tone and natural language usage
- Identify buried answers that need repositioning

**Step 3: Technical Evaluation**
- Verify presence and accuracy of schema markup
- Check header hierarchy (H1, H2, H3 structure)
- Assess semantic HTML usage
- Evaluate page load speed and mobile responsiveness
- Review internal linking for question-based queries

**Step 4: Content Quality Check**
- Verify E-E-A-T signals (Experience, Expertise, Authoritativeness, Trust)
- Check for citations and authoritative sources
- Assess content depth and comprehensiveness
- Identify thin or outdated sections

### 2. Schema Markup Generation

When generating schema markup, follow this protocol:

**Determine Appropriate Schema Types**
Based on content type, select from:
- FAQPage: For Q&A content
- HowTo: For step-by-step instructions
- Article: For blog posts and news
- Product: For product pages
- LocalBusiness: For local business pages
- Organization: For company information
- BreadcrumbList: For navigation paths

**Generate Valid JSON-LD**
Format: Always use JSON-LD format embedded in <script type="application/ld+json">
Validation: Ensure markup passes schema.org validation
Completeness: Include all required and recommended properties
Nesting: Properly nest related schema types when applicable

**Example Generation Pattern:**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[Extract question from content]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Extract concise answer, 40-60 words]"
      }
    }
  ]
}
```

### 3. Content Rewriting Protocol

When rewriting content for AEO optimization:

**Answer-First Structure Template:**
```
[H2: Question in natural language]
[Paragraph 1: Direct answer, 40-60 words, standalone]
[Paragraph 2-3: Supporting details and context]
[Examples or use cases]
[H3: Related sub-question]
[Answer to sub-question]
```

**Rewriting Rules:**
1. Place answer in opening sentence
2. Use conversational, natural language
3. Keep paragraphs to 2-4 sentences
4. Include question variations within content
5. Add bullet points for lists (5-8 items optimal)
6. Insert relevant statistics with sources
7. Maintain original factual accuracy

**Voice Search Optimization:**
- Use question words: who, what, where, when, why, how
- Write in complete sentences that mirror speech
- Include location-based phrases for local queries
- Target long-tail conversational phrases

### 4. Question Research Methodology

Execute this process to identify target questions:

**Data Source Analysis:**
1. Search console data: Filter for question-based queries
2. People Also Ask boxes: Extract related questions
3. Auto-suggest analysis: Capture question variations
4. Forum mining: Reddit, Quora, industry forums
5. Competitor analysis: Questions competitors rank for

**Question Categorization:**
- Primary questions: Main topic queries
- Secondary questions: Supporting topic queries
- Long-tail questions: Specific, detailed queries
- Local questions: Location-specific queries
- Comparison questions: "X vs Y" queries

**Priority Scoring:**
Rank questions by:
- Search volume (high/medium/low)
- Current ranking position
- Competition level
- Business relevance
- Conversion potential

### 5. Technical Audit Procedure

Perform comprehensive technical AEO audit:

**Header Hierarchy Check:**
- Verify single H1 per page
- Confirm H2s are primary questions or sections
- Ensure H3s are sub-questions or details
- Check logical progression and nesting

**Structured Data Validation:**
- Test all schema markup with Google Rich Results Test
- Verify schema types match content
- Check for errors and warnings
- Ensure all required properties present

**Page Performance Assessment:**
- Measure Core Web Vitals (LCP, FID, CLS)
- Test mobile usability
- Verify HTTPS implementation
- Check for broken links
- Assess internal linking structure

**Content Structure Evaluation:**
- Confirm semantic HTML usage (<article>, <section>, <aside>)
- Verify proper list formatting
- Check table structure for comparison data
- Assess paragraph length and readability

### 6. FAQ Section Generation

Create optimized FAQ sections using this protocol:

**Structure:**
```html
<section itemscope itemtype="https://schema.org/FAQPage">
  <h2>Frequently Asked Questions</h2>
  
  <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
    <h3 itemprop="name">[Question]</h3>
    <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
      <p itemprop="text">[Concise answer with supporting details]</p>
    </div>
  </div>
</section>
```

**FAQ Content Guidelines:**
- 5-10 questions per section (optimal range)
- Questions in natural language users would ask
- Answers 50-100 words (concise but complete)
- Cover primary and related questions
- Include relevant keywords naturally
- Link to detailed content where appropriate

### 7. Optimization Report Generation

Generate comprehensive AEO audit reports with this structure:

**Executive Summary:**
- Overall AEO score (0-100)
- Critical issues count
- High-priority opportunities
- Estimated impact of improvements

**Detailed Findings:**

*Content Issues:*
- Missing or buried answers
- Weak answer-first structure
- Insufficient question coverage
- Thin or outdated content
- Missing E-E-A-T signals

*Technical Issues:*
- Missing schema markup
- Incorrect header hierarchy
- Slow page load times
- Mobile usability problems
- Broken internal links

*Optimization Opportunities:*
- Questions to target
- Schema types to implement
- Content sections to rewrite
- FAQ sections to add
- Internal linking improvements

**Prioritized Action Plan:**
1. Quick Wins (implement within 1 week)
2. High-Impact Changes (implement within 1 month)
3. Long-Term Improvements (implement within 3 months)

**Implementation Instructions:**
- Step-by-step technical instructions
- Code snippets for schema markup
- Content rewriting examples
- Resource requirements
- Expected outcomes

## Decision Trees

### Schema Type Selection Decision Tree

```
IF content_type == "Q&A format":
    USE FAQPage schema
ELSE IF content_type == "Step-by-step instructions":
    USE HowTo schema
ELSE IF content_type == "Blog post or article":
    USE Article schema
    IF has_author_info:
        ADD Person schema
ELSE IF content_type == "Product information":
    USE Product schema
    ADD AggregateRating if reviews exist
ELSE IF content_type == "Local business":
    USE LocalBusiness schema
    ADD GeoCoordinates
ELSE IF content_type == "Company information":
    USE Organization schema
    ADD ContactPoint

IF page_has_navigation_breadcrumbs:
    ADD BreadcrumbList schema
```

### Content Optimization Priority Decision Tree

```
ANALYZE page metrics:
    IF page_has_high_traffic AND low_CTR:
        PRIORITY = "HIGH" 
        ACTION = "Optimize for featured snippets"
    ELSE IF page_ranks_position_4_to_10:
        PRIORITY = "HIGH"
        ACTION = "Add answer-first format to reach position 1-3"
    ELSE IF page_has_no_schema:
        PRIORITY = "MEDIUM"
        ACTION = "Implement appropriate schema markup"
    ELSE IF content_over_12_months_old:
        PRIORITY = "MEDIUM"
        ACTION = "Update with fresh data and questions"
    ELSE IF page_not_mobile_optimized:
        PRIORITY = "HIGH"
        ACTION = "Fix mobile responsiveness immediately"
    ELSE:
        PRIORITY = "LOW"
        ACTION = "Monitor and optimize as needed"
```

### Question Targeting Decision Tree

```
FOR each identified question:
    ASSESS search_volume:
        IF search_volume == "high":
            CHECK competition_level:
                IF competition == "low" OR "medium":
                    TARGET = "Primary target"
                ELSE:
                    TARGET = "Long-term target, build authority first"
        ELSE IF search_volume == "medium":
            CHECK current_ranking:
                IF current_ranking > 0:
                    TARGET = "Quick win opportunity"
                ELSE:
                    TARGET = "Secondary target"
        ELSE IF search_volume == "low" AND business_relevance == "high":
            TARGET = "Niche target for qualified traffic"
        ELSE:
            TARGET = "Deprioritize"
```

## Input/Output Specifications

### Input Format

**For Content Analysis:**
```json
{
  "task": "analyze_content",
  "url": "https://example.com/page",
  "content": "Full page content or URL",
  "current_rankings": {
    "target_keywords": ["keyword1", "keyword2"],
    "positions": [5, 12]
  },
  "focus_areas": ["schema", "content_structure", "questions"]
}
```

**For Schema Generation:**
```json
{
  "task": "generate_schema",
  "content_type": "faq|howto|article|product|local",
  "content": "Content to generate schema for",
  "existing_schema": "Any existing schema markup"
}
```

**For Content Rewriting:**
```json
{
  "task": "rewrite_content",
  "original_content": "Content to rewrite",
  "target_question": "Primary question to answer",
  "target_audience": "Audience description",
  "tone": "professional|casual|technical"
}
```

### Output Format

**Analysis Output:**
```json
{
  "aeo_score": 75,
  "critical_issues": [
    {
      "issue": "Missing FAQPage schema",
      "severity": "high",
      "impact": "Not appearing in AI-generated answers",
      "solution": "Implement FAQPage schema markup"
    }
  ],
  "opportunities": [
    {
      "type": "question_targeting",
      "question": "What is X?",
      "search_volume": "high",
      "current_ranking": 0,
      "recommendation": "Create dedicated section answering this question"
    }
  ],
  "schema_recommendations": [
    {
      "type": "FAQPage",
      "priority": "high",
      "code": "Generated JSON-LD code"
    }
  ],
  "content_improvements": [
    {
      "section": "Introduction",
      "current": "Answer buried in paragraph 3",
      "recommended": "Move answer to opening sentence",
      "rewritten_content": "Optimized version"
    }
  ]
}
```

**Schema Generation Output:**
```json
{
  "schema_type": "FAQPage",
  "validation_status": "valid",
  "code": "Complete JSON-LD schema markup",
  "implementation_notes": "Place in <head> or before </body>",
  "testing_url": "Google Rich Results Test URL"
}
```

## Quality Assurance Checks

Before delivering any optimization:

**Content Quality Verification:**
- [ ] Answer appears in first 40-60 words
- [ ] Natural, conversational language used
- [ ] Question clearly stated in header
- [ ] Supporting details provided
- [ ] Sources cited where applicable
- [ ] Examples included
- [ ] Related questions addressed

**Technical Validation:**
- [ ] Schema markup passes validation
- [ ] Header hierarchy is logical
- [ ] Semantic HTML used correctly
- [ ] No broken links
- [ ] Mobile-responsive
- [ ] Fast loading time

**SEO Compatibility:**
- [ ] Meta title optimized
- [ ] Meta description includes question/answer
- [ ] URL structure is clean
- [ ] Images have alt text
- [ ] Internal links present
- [ ] External links to authority sources

## Error Handling

**Common Issues and Resolutions:**

**Issue: Content too technical for voice search**
- Solution: Create parallel simplified version
- Add conversational explanations
- Include "in simple terms" sections

**Issue: Multiple valid schema types apply**
- Solution: Implement primary schema type
- Nest secondary schema where appropriate
- Prioritize based on content goal

**Issue: Answer cannot be condensed to 40-60 words**
- Solution: Create summary answer first
- Add "Quick Answer" callout box
- Link to detailed explanation below

**Issue: Page has no clear question focus**
- Solution: Identify implicit questions
- Add FAQ section to structure
- Consider splitting into multiple focused pages

## Performance Metrics

Track these metrics to measure skill effectiveness:

**Content Metrics:**
- Featured snippet acquisition rate
- Average position for question queries
- Click-through rate from answer boxes
- Zero-click search impressions

**Technical Metrics:**
- Schema markup coverage (% of pages)
- Schema validation pass rate
- Page speed scores
- Mobile usability scores

**Business Metrics:**
- Organic traffic from question queries
- Conversion rate from AEO traffic
- Voice search traffic volume
- Answer engine citation count

## Continuous Improvement Protocol

**Monthly Tasks:**
- Review new questions from search console
- Update statistics and data in content
- Check schema markup for errors
- Monitor competitor AEO strategies

**Quarterly Tasks:**
- Comprehensive content audit
- Update answer-first content structure
- Expand FAQ sections with new questions
- Refresh outdated examples and case studies

**Annual Tasks:**
- Complete AEO strategy review
- Rebuild topic clusters and pillar pages
- Implement new schema types
- Overhaul underperforming content

## Integration Points

This skill integrates with:
- Content management systems (WordPress, Drupal, etc.)
- SEO tools (SEMrush, Ahrefs, Moz)
- Analytics platforms (Google Analytics, Search Console)
- Schema testing tools (Google Rich Results Test)
- Page speed testing tools (PageSpeed Insights, GTmetrix)

## Limitations and Constraints

**Known Limitations:**
- Cannot guarantee featured snippet placement (algorithm-dependent)
- Schema markup alone doesn't guarantee rich results
- Voice search ranking factors constantly evolving
- Answer engine algorithms are proprietary
- Some content types unsuitable for answer-first format

**When to Escalate:**
- Legal or medical content requiring expert review
- Technical implementations requiring developer access
- Large-scale site migrations or restructures
- Custom schema types not in standard vocabulary
- International/multilingual complex implementations

## Version History

**v1.0 - Initial Release**
- Core AEO analysis capabilities
- Schema markup generation
- Content rewriting protocols
- Question research methodology

**Future Enhancements:**
- AI answer engine specific optimization (ChatGPT, Perplexity, etc.)
- Automated A/B testing for answer formats
- Real-time answer engine monitoring
- Multi-language AEO optimization
- Voice search intent classification