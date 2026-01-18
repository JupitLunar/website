# SEO Maximization Agent Skill

## Overview

This skill enables an AI agent to perform comprehensive Search Engine Optimization (SEO) analysis, implementation, and ongoing optimization to maximize organic search visibility, rankings, and traffic. The agent can audit websites, identify ranking opportunities, implement technical improvements, optimize content, build authority signals, and monitor performance across all critical SEO dimensions.

## Skill Capabilities

### Core Functions
- Comprehensive technical SEO audits
- On-page optimization and content enhancement
- Keyword research and competitive analysis
- Backlink profile analysis and link building strategy
- Site architecture and internal linking optimization
- Core Web Vitals and page speed optimization
- Schema markup implementation
- Local SEO optimization
- E-E-A-T signal enhancement
- Conversion rate optimization for organic traffic

### Output Types
- Detailed SEO audit reports with prioritized action items
- Optimized page content (titles, descriptions, headings, body)
- Technical implementation guides and code
- Keyword strategy documents
- Backlink acquisition plans
- Site structure recommendations
- Performance dashboards and tracking reports

## Agent Instructions

### 1. Comprehensive SEO Audit Protocol

Execute full-site SEO analysis in the following sequence:

#### Phase 1: Technical SEO Audit

**Crawl Analysis:**
- Identify crawl errors (4xx, 5xx status codes)
- Detect redirect chains and loops
- Find orphaned pages (no internal links)
- Map XML sitemap coverage
- Check robots.txt configuration
- Analyze crawl budget efficiency

**Indexation Assessment:**
- Verify pages in search index vs. total pages
- Identify indexation blockers (noindex tags, robots.txt blocks)
- Find duplicate content issues
- Detect thin content pages (<300 words)
- Check canonical tag implementation
- Assess pagination handling

**Site Architecture Evaluation:**
- Analyze URL structure and hierarchy
- Measure click depth from homepage (target ≤3 clicks)
- Evaluate internal linking structure
- Check breadcrumb implementation
- Assess navigation clarity and UX
- Identify orphaned content clusters

**Mobile and Performance:**
- Run mobile-friendly test
- Measure Core Web Vitals:
  - Largest Contentful Paint (LCP): target <2.5s
  - First Input Delay (FID): target <100ms
  - Cumulative Layout Shift (CLS): target <0.1
- Analyze page load speed (target <3s)
- Check mobile vs. desktop parity
- Verify responsive design implementation
- Test mobile usability issues

**Security and HTTPS:**
- Verify SSL certificate validity
- Check for mixed content warnings
- Ensure all pages use HTTPS
- Test HSTS implementation
- Verify secure subdomain coverage

#### Phase 2: On-Page SEO Audit

**Content Quality Assessment:**
For each page, evaluate:
- Content length (minimum 300 words, competitive pages 1500-2500+)
- Content uniqueness (check for duplicate content)
- Keyword targeting clarity
- Topical relevance and depth
- Content freshness and update frequency
- Multimedia integration (images, videos)
- Readability score (Flesch Reading Ease: 60-70 target)

**Meta Tag Optimization:**
- Title tags: 50-60 characters, keyword in first 65 chars
- Meta descriptions: 150-160 characters, compelling CTA
- Header tags hierarchy (H1 → H2 → H3 logical flow)
- Image alt text coverage and quality
- Open Graph and Twitter Card tags
- Canonical tags proper implementation

**Keyword Optimization:**
- Primary keyword placement (title, H1, first 100 words, URL)
- Secondary keyword distribution
- LSI/semantic keyword inclusion
- Keyword density (1-2% natural usage)
- Keyword cannibalization detection
- Search intent alignment

**Internal Linking:**
- Number of internal links per page (optimal: 50-100)
- Anchor text diversity and relevance
- Link to high-authority pages
- Deep linking to conversion pages
- Orphaned page identification
- Link equity distribution

#### Phase 3: Off-Page SEO Audit

**Backlink Profile Analysis:**
- Total backlink count and trend
- Referring domain count and quality
- Domain Authority/Domain Rating distribution
- Link velocity (new links per month)
- Toxic/spammy link detection
- Lost link identification
- Competitor backlink gap analysis

**Link Quality Metrics:**
- DoFollow vs. NoFollow ratio
- Link relevance to content
- Geographic distribution of links
- Anchor text distribution:
  - Branded: 40-50%
  - Exact match: 5-10%
  - Partial match: 10-20%
  - Generic: 20-30%
  - Naked URL: 10-20%

**Brand Mentions:**
- Unlinked brand mentions
- Brand mention sentiment
- Co-citation analysis
- Brand search volume trend

#### Phase 4: Competitive Analysis

**Competitor Identification:**
- Identify top 10 organic competitors
- Analyze their keyword rankings
- Assess their content strategies
- Evaluate their backlink profiles
- Study their site structures
- Monitor their ranking trends

**Keyword Gap Analysis:**
- Keywords competitors rank for (you don't)
- Keywords with ranking opportunity (positions 11-20)
- High-value keywords with low competition
- Featured snippet opportunities
- Long-tail keyword opportunities

**Content Gap Analysis:**
- Topics competitors cover comprehensively
- Content formats competitors use successfully
- Content depth and quality comparison
- Update frequency comparison

### 2. Keyword Research Protocol

Execute comprehensive keyword research:

#### Seed Keyword Identification

**Primary Sources:**
- Analyze current ranking keywords (Search Console)
- Extract keywords from competitor rankings
- Mine autocomplete suggestions (Google, Bing, YouTube)
- Review "People Also Ask" boxes
- Analyze internal site search data
- Survey customer language and terminology

**Keyword Expansion:**
```
FOR each seed_keyword:
    COLLECT variations:
        - Long-tail variations (3-5+ words)
        - Question-based keywords (who, what, where, when, why, how)
        - Modifier combinations (best, cheap, review, near me, vs, etc.)
        - Semantic variations and synonyms
        - Misspellings and common typos (if significant volume)
        - Related topics and entities
```

#### Keyword Qualification Metrics

**For each keyword, calculate:**
- Monthly search volume
- Keyword difficulty score (0-100)
- Cost-per-click (CPC) value
- Click-through rate potential
- SERP feature opportunities
- Seasonal trends and patterns
- Current ranking position (if any)

**Priority Scoring Formula:**
```
Priority Score = (Search Volume × CPC × CTR Potential) / (Difficulty × 10)

IF Current Ranking Position between 4-20:
    Priority Score = Priority Score × 1.5  // Quick win multiplier

IF Keyword has featured snippet opportunity:
    Priority Score = Priority Score × 1.3

IF Keyword shows commercial intent:
    Priority Score = Priority Score × 1.4
```

#### Keyword Categorization

**Group keywords by:**
- Search intent:
  - Informational (learning, how-to)
  - Navigational (brand, specific page)
  - Commercial (comparison, reviews, best)
  - Transactional (buy, purchase, order)
- Funnel stage:
  - Top of funnel (awareness)
  - Middle of funnel (consideration)
  - Bottom of funnel (decision)
- Topic clusters (group related keywords)
- Priority tier (high, medium, low)

### 3. Content Optimization Protocol

#### Page-Level Optimization

**Title Tag Optimization:**
```
REQUIREMENTS:
- Length: 50-60 characters (max 70)
- Primary keyword within first 65 characters
- Brand name at end (if space permits)
- Compelling, click-worthy phrasing
- Unique across all pages

FORMULA:
Primary Keyword + Modifier | Brand Name
OR
Number + Primary Keyword + Modifier

EXAMPLES:
"15 SEO Strategies to Boost Rankings | BrandName"
"Ultimate Guide to Keyword Research (2026)"
```

**Meta Description Optimization:**
```
REQUIREMENTS:
- Length: 150-160 characters (max 165)
- Include primary keyword naturally
- Include compelling call-to-action
- Highlight unique value proposition
- Avoid duplicate descriptions

FORMULA:
[Benefit/Hook] + [Supporting Details] + [CTA]

EXAMPLE:
"Discover proven SEO strategies that increased organic traffic by 300%. Learn actionable tactics from industry experts. Start optimizing today!"
```

**Header Tag Optimization:**
```
H1 (ONE per page):
- Include primary keyword
- 20-70 characters
- Clear, descriptive
- Unique from title tag

H2 (Multiple):
- Include secondary keywords
- Break content into logical sections
- Use question format when appropriate
- Support topical relevance

H3-H6:
- Organize subsections hierarchically
- Include long-tail variations
- Maintain logical content structure
```

**Content Body Optimization:**

**Opening Paragraph (First 100 words):**
- Include primary keyword naturally
- Hook reader with compelling opening
- Address search intent immediately
- Set clear expectations for content

**Content Structure:**
- Use short paragraphs (2-4 sentences)
- Include bullet points and numbered lists
- Add relevant images every 300-500 words
- Insert tables for comparison data
- Use bold for important concepts
- Add relevant internal links (3-5 per 1000 words)
- Include external links to authority sources

**Keyword Placement:**
- Primary keyword: Title, H1, first 100 words, URL, conclusion
- Secondary keywords: H2s, throughout body naturally
- LSI keywords: Distributed naturally throughout
- Avoid keyword stuffing (maintain <2% density)

**Content Length Guidelines:**
```
IF competition_average_length < 1000:
    target_length = competition_average × 1.5

ELSE IF competition_average_length 1000-2000:
    target_length = competition_average × 1.3

ELSE IF competition_average_length > 2000:
    target_length = competition_average + 500

MINIMUM_LENGTH:
    Blog posts: 1500 words
    Product pages: 300 words
    Category pages: 500 words
    Pillar pages: 3000+ words
```

**Content Enhancement Elements:**
- Add statistics and data points
- Include expert quotes or insights
- Create custom images/graphics
- Embed relevant videos
- Add downloadable resources
- Insert FAQ section
- Include "Key Takeaways" box
- Add table of contents for long content

#### URL Optimization

**URL Structure Rules:**
```
OPTIMAL FORMAT:
domain.com/category/subcategory/keyword-phrase

REQUIREMENTS:
- Use hyphens (-) not underscores (_)
- Keep under 60 characters
- Include primary keyword
- Use lowercase only
- Avoid special characters
- Remove stop words (a, the, and, etc.) unless needed
- Avoid dates unless critical (news sites)

GOOD: domain.com/blog/seo-strategies
BAD: domain.com/blog/post?id=12345&cat=seo
```

### 4. Technical SEO Implementation Protocol

#### Site Speed Optimization

**Critical Actions:**
```
IMAGE OPTIMIZATION:
- Compress images (target <100KB)
- Use next-gen formats (WebP, AVIF)
- Implement lazy loading
- Specify image dimensions
- Use responsive images (srcset)

CODE OPTIMIZATION:
- Minify CSS, JavaScript, HTML
- Combine CSS/JS files
- Remove unused CSS/JavaScript
- Defer non-critical JavaScript
- Inline critical CSS

CACHING:
- Implement browser caching (1 year for static assets)
- Use CDN for asset delivery
- Enable GZIP compression
- Implement server-side caching
- Use HTTP/2 or HTTP/3

SERVER OPTIMIZATION:
- Reduce server response time (<200ms)
- Use fast hosting provider
- Optimize database queries
- Enable keep-alive connections
```

#### Schema Markup Implementation

**Priority Schema Types:**
```
EVERY PAGE:
- Organization schema (sitewide)
- BreadcrumbList schema
- WebSite schema with search box

CONTENT PAGES:
- Article schema (blog posts, news)
- FAQPage schema (if Q&A present)
- HowTo schema (tutorials, guides)

PRODUCT PAGES:
- Product schema
- AggregateRating schema
- Offer schema
- Review schema

LOCAL BUSINESS:
- LocalBusiness schema
- GeoCoordinates schema
- PostalAddress schema
- OpeningHours schema

EVENTS:
- Event schema
- Place schema
```

**Schema Implementation Pattern:**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Page title",
  "image": "Featured image URL",
  "author": {
    "@type": "Person",
    "name": "Author name",
    "url": "Author profile URL"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Organization name",
    "logo": {
      "@type": "ImageObject",
      "url": "Logo URL"
    }
  },
  "datePublished": "2026-01-18",
  "dateModified": "2026-01-18",
  "description": "Meta description"
}
```

#### Crawl Optimization

**Robots.txt Optimization:**
```
User-agent: *
Allow: /

# Block admin areas
Disallow: /admin/
Disallow: /wp-admin/
Disallow: /login/

# Block search parameters
Disallow: /*?s=
Disallow: /*?search=

# Block staging/dev
Disallow: /staging/
Disallow: /dev/

# Sitemap location
Sitemap: https://domain.com/sitemap.xml
```

**XML Sitemap Optimization:**
- Include only indexable pages
- Update automatically on content changes
- Split large sitemaps (max 50,000 URLs per file)
- Include lastmod, changefreq, priority tags
- Submit to Google Search Console and Bing Webmaster
- Reference in robots.txt

**Internal Linking Strategy:**
```
PRIORITY PAGES (Homepage, Money Pages):
- Receive links from: All important pages
- Links to: Top category pages, key content
- Target: 100+ internal links pointing to

CATEGORY PAGES:
- Receive links from: Parent category, related categories, homepage
- Links to: Subcategories, top products/posts
- Target: 50+ internal links pointing to

CONTENT PAGES:
- Receive links from: Related content, category pages
- Links to: Related content, conversion pages
- Target: 10+ internal links pointing to

ORPHAN PAGES:
- Identify and eliminate (add internal links)
- OR remove from site if not valuable
```

### 5. Link Building Strategy Protocol

#### Link Acquisition Framework

**Tier 1: Foundation Links (High Priority)**

**Resource Page Link Building:**
```
PROCESS:
1. Search: "[topic] + resources", "[topic] + useful links"
2. Identify resource pages in target niche
3. Analyze linked resources quality
4. Create superior resource on your site
5. Outreach email template:

"Hi [Name],

I noticed your excellent resource page on [topic]. I recently 
published a comprehensive guide on [specific aspect] that your 
readers might find valuable: [URL]

It covers [unique value points]. Would you consider adding it 
to your resource list?

Best regards,
[Your Name]"
```

**Guest Posting:**
```
TARGET CRITERIA:
- Domain Authority: 40+
- Organic traffic: 10,000+ monthly
- Topical relevance: High
- Editorial standards: Quality content only
- DoFollow links allowed

PITCH TEMPLATE:
"Hi [Editor Name],

I'm a [expertise] and regular reader of [Publication]. I'd love 
to contribute a guest post on [topic].

Proposed title: "[Compelling Title]"

This would cover:
- [Key point 1]
- [Key point 2]
- [Key point 3]

I've previously written for [credible publications].

Would this interest your readers?

Best,
[Your Name]"
```

**Digital PR and Journalist Outreach:**
```
NEWSWORTHY ANGLES:
- Original research/surveys
- Data studies and statistics
- Expert commentary on trends
- Unique case studies
- Industry reports

OUTREACH PROCESS:
1. Identify relevant journalists (Twitter, HARO, Muck Rack)
2. Monitor trending topics in niche
3. Create data-driven content asset
4. Craft compelling pitch:
   - Newsworthy hook
   - Data/insights
   - Expert quotes
   - Visual assets
5. Follow up appropriately
```

**Tier 2: Authority Building**

**Broken Link Building:**
```
PROCESS:
1. Find competitors' broken links (Ahrefs, Semrush)
2. Identify broken resource pages in niche
3. Create/identify replacement content on your site
4. Outreach template:

"Hi [Name],

I was researching [topic] and found your page: [URL]

I noticed the link to [broken resource] is no longer working. 
I thought you might want to know.

I've created a similar resource that covers [topic]: [Your URL]

It might make a good replacement if you're updating the page.

Cheers,
[Your Name]"
```

**Skyscraper Technique:**
```
PROCESS:
1. Find content with many backlinks in niche
2. Analyze why it attracts links
3. Create superior version:
   - More comprehensive
   - Better visual design
   - More up-to-date
   - Better examples
   - Original research
4. Outreach to everyone linking to original
5. Pitch your improved version
```

**Tier 3: Sustained Growth**

**Content Partnership:**
- Co-create content with complementary brands
- Cross-promote to both audiences
- Natural link exchange in valuable content
- Joint webinars, podcasts, research

**Ego Bait and Expert Roundups:**
- Create expert roundups featuring influencers
- Interview industry experts
- Feature companies in case studies
- Create industry awards or lists
- Notify featured experts (they often share/link)

#### Link Quality Assessment

**Evaluate potential links:**
```
QUALITY SCORE CALCULATION:

HIGH QUALITY (Pursue):
- Domain Authority: 50+
- Organic traffic: 50,000+ monthly
- Topical relevance: Very high
- Natural editorial link
- DoFollow
- Contextual (in content body)

MEDIUM QUALITY (Consider):
- Domain Authority: 30-49
- Organic traffic: 10,000-50,000 monthly
- Topical relevance: Moderate
- Earned through outreach
- DoFollow
- In supplementary content

LOW QUALITY (Avoid):
- Domain Authority: <30
- Low/no organic traffic
- No topical relevance
- Paid or spammy
- Footer/sidebar placement
- Sitewide links from low-quality sites
```

### 6. Local SEO Optimization Protocol

#### Google Business Profile Optimization

**Profile Completeness:**
```
REQUIRED ELEMENTS:
- Business name (exact match to real name)
- Complete address (match NAP everywhere)
- Phone number (local number preferred)
- Website URL
- Category selection (primary + all relevant)
- Business hours (accurate, with special hours)
- Business description (750 chars, keyword-rich)
- Services list (comprehensive)
- Attributes (all applicable)

VISUAL ASSETS:
- Logo (720x720px minimum)
- Cover photo (1024x576px)
- Interior photos (10+)
- Exterior photos
- Team photos
- Product photos
- 360° virtual tour

ONGOING MANAGEMENT:
- Post weekly updates
- Respond to all reviews (within 24 hours)
- Answer Q&A section
- Upload new photos monthly
- Update special hours/announcements
```

**Local Citation Building:**
```
TOP PRIORITY CITATIONS:
1. Google Business Profile
2. Bing Places
3. Apple Maps
4. Yelp
5. Facebook
6. Industry-specific directories
7. Local chamber of commerce
8. BBB (if applicable)

NAP CONSISTENCY:
- Exact match across all platforms
- Format: "123 Main Street" not "123 Main St"
- Phone format consistent: (555) 123-4567
- Include suite/unit numbers consistently

CITATION AUDIT:
- Find all existing citations (Whitespark, BrightLocal)
- Correct inconsistent NAP
- Remove duplicate listings
- Update outdated information
```

**Local Content Strategy:**
```
CREATE:
- City/neighborhood-specific service pages
- Local area guides
- Local event sponsorship pages
- Community involvement posts
- Local case studies and testimonials
- Locally-focused blog content

EXAMPLE STRUCTURE:
URL: domain.com/[service]/[city]
Title: "[Service] in [City, State] | [Brand]"
H1: "Professional [Service] in [City]"
Content: City-specific details, landmarks, service area map
Schema: LocalBusiness + Service + GeoCoordinates
```

**Review Generation Strategy:**
```
PROCESS:
1. Identify satisfied customers
2. Send review request via email/SMS (24-48 hrs post-service)
3. Provide direct Google review link
4. Make process simple (1-2 clicks)
5. Follow up once if no response

EMAIL TEMPLATE:
"Hi [Name],

Thank you for choosing [Business]! We hope you're happy with 
[service/product].

Would you mind sharing your experience? Your feedback helps us 
improve and helps others find us.

[Direct Google Review Link]

It takes just 30 seconds. Thank you!

Best,
[Your Name]"

REVIEW RESPONSE PROTOCOL:
Positive reviews (5-star):
- Thank customer personally
- Mention specific service detail
- Reinforce brand message

Negative reviews (1-3 star):
- Acknowledge concern
- Apologize if appropriate
- Offer to resolve offline
- Provide contact information
- Stay professional and empathetic
```

### 7. E-E-A-T Enhancement Protocol

#### Experience Signals

**Demonstrate First-Hand Experience:**
- Include original images/screenshots
- Add personal anecdotes and case studies
- Share before/after examples
- Include process documentation
- Show work examples and portfolio
- Add client testimonials with details
- Include data from own experiments

**Content Markers:**
- "In my experience..."
- "When I implemented this..."
- "Our testing showed..."
- "After working with 50+ clients..."

#### Expertise Signals

**Author Authority Building:**
```
AUTHOR PAGE REQUIREMENTS:
- Professional headshot
- Detailed bio (200+ words)
- Credentials and certifications
- Professional experience timeline
- Published works and contributions
- Social media links
- Contact information

AUTHOR SCHEMA:
{
  "@type": "Person",
  "name": "Author Name",
  "jobTitle": "SEO Specialist",
  "url": "author-profile-url",
  "sameAs": [
    "linkedin-url",
    "twitter-url"
  ],
  "worksFor": {
    "@type": "Organization",
    "name": "Company Name"
  }
}
```

**Expertise Indicators:**
- Industry certifications
- Years of experience
- Number of projects completed
- Client results and testimonials
- Speaking engagements
- Published research or articles
- Awards and recognition

#### Authoritativeness Signals

**External Validation:**
- Backlinks from authority sites
- Brand mentions in media
- Citations in industry publications
- Guest posts on major platforms
- Podcast appearances
- Conference speaking
- Industry awards

**Brand Building:**
- Consistent brand mentions
- Active social media presence
- Thought leadership content
- Original research publication
- Industry report creation
- Tool or resource development
- Community building

#### Trustworthiness Signals

**Website Trust Elements:**
```
CRITICAL TRUST FACTORS:
- HTTPS throughout site
- Clear contact information
- Physical address (if applicable)
- Phone number
- Privacy policy (detailed)
- Terms of service
- About page (comprehensive)
- Author bios for content
- Editorial policy disclosure
- Affiliate disclosure (if applicable)
- Money-back guarantee (if applicable)
- Trust badges (secure checkout, etc.)
- Professional design
- No intrusive ads
- Clear navigation
```

**Content Accuracy:**
- Fact-check all claims
- Cite authoritative sources
- Link to original research
- Update outdated information
- Correct errors promptly
- Include publication/update dates
- Show methodology for data

### 8. Conversion Rate Optimization for SEO Traffic

#### Landing Page Optimization

**Above-the-Fold Essentials:**
```
CRITICAL ELEMENTS:
- Clear, compelling headline (H1)
- Value proposition (one sentence)
- Supporting subheadline
- Primary call-to-action (contrasting color)
- Hero image/video relevant to offer
- Trust signals (reviews, logos, certifications)
- No navigation overload

HEADLINE FORMULA:
[Desired Outcome] + [Specific Time/Number] + [Without Pain Point]

EXAMPLE:
"Increase Organic Traffic by 200% in 90 Days Without Expensive Ads"
```

**Call-to-Action Optimization:**
```
CTA PLACEMENT:
- Above the fold
- Middle of content
- End of content
- Sticky header/footer
- Exit intent popup

CTA COPY FORMULA:
Action Verb + Benefit + Urgency

EXAMPLES:
- "Start Your Free Trial Today"
- "Get Instant Access Now"
- "Download Your Free Guide"
- "Schedule Your Free Consultation"

CTA DESIGN:
- Contrasting color (A/B test)
- Large enough to be obvious
- Whitespace around button
- No competing elements nearby
- Mobile-optimized size (44x44px minimum)
```

**Trust and Credibility Elements:**
- Customer testimonials with photos
- Case studies with specific results
- Client logos (if B2B)
- Number of customers served
- Awards and certifications
- Media mentions
- Security badges
- Money-back guarantee
- Free trial or demo offer

#### User Experience Optimization

**Navigation Clarity:**
- Clear menu structure (max 7 items)
- Search functionality
- Breadcrumbs on all pages
- Clear category hierarchy
- Related content suggestions
- Prominent contact information

**Content Scannability:**
- Short paragraphs (2-3 sentences)
- Descriptive subheadings every 200-300 words
- Bullet points for lists
- Bold key concepts
- Highlight important statistics
- Use whitespace effectively
- Break up text with images

**Mobile Optimization:**
```
MOBILE UX CHECKLIST:
- [ ] Responsive design adapts to all screen sizes
- [ ] Touch targets minimum 44x44 pixels
- [ ] No horizontal scrolling required
- [ ] Text readable without zooming (16px+ font)
- [ ] Forms easy to complete on mobile
- [ ] CTA buttons thumb-friendly
- [ ] Page loads <3 seconds on 3G
- [ ] No intrusive interstitials
- [ ] Images optimized for mobile
- [ ] Videos responsive and playable
```

## Decision Trees

### Keyword Targeting Decision Tree

```
FOR each keyword:
    
    IF search_volume < 10:
        SKIP (not worth targeting individually)
    
    ELSE IF current_ranking == 0:
        IF keyword_difficulty > 70 AND domain_authority < 40:
            MARK as "Long-term target - build authority first"
        ELSE IF keyword_difficulty < 30:
            MARK as "Quick win opportunity - create content now"
        ELSE:
            CALCULATE priority_score
            IF priority_score > threshold:
                MARK as "Primary target - create pillar content"
            ELSE:
                MARK as "Secondary target - queue for later"
    
    ELSE IF current_ranking between 1-3:
        MARK as "Maintain position - update content quarterly"
    
    ELSE IF current_ranking between 4-10:
        MARK as "High priority - optimize to reach top 3"
        ACTIONS:
            - Improve content depth
            - Add multimedia
            - Build backlinks
            - Enhance E-E-A-T
    
    ELSE IF current_ranking between 11-20:
        MARK as "Quick win - push to page 1"
        ACTIONS:
            - Optimize title and meta
            - Improve internal linking
            - Add content depth
            - Fix technical issues
    
    ELSE IF current_ranking between 21-50:
        IF search_intent matches content:
            MARK as "Moderate opportunity - improve content"
        ELSE:
            MARK as "Realign content with search intent"
    
    ELSE:
        IF keyword highly relevant to business:
            MARK as "Create new targeted content"
        ELSE:
            MARK as "Low priority - deprioritize"
```

### Technical Issue Prioritization Tree

```
FOR each technical_issue:
    
    IF issue_type == "indexation_blocker":
        PRIORITY = "CRITICAL"
        TIMELINE = "Fix immediately"
        EXAMPLES:
            - Entire site noindexed
            - Robots.txt blocking critical pages
            - Server returning 5xx errors
            - Sitemap not accessible
    
    ELSE IF issue_type == "core_web_vitals_fail":
        IF pages_affected > 50% OR revenue_pages affected:
            PRIORITY = "HIGH"
            TIMELINE = "Fix within 1 week"
        ELSE:
            PRIORITY = "MEDIUM"
            TIMELINE = "Fix within 1 month"
    
    ELSE IF issue_type == "mobile_usability":
        IF mobile_traffic > 60%:
            PRIORITY = "HIGH"
            TIMELINE = "Fix within 1 week"
        ELSE:
            PRIORITY = "MEDIUM"
            TIMELINE = "Fix within 2 weeks"
    
    ELSE IF issue_type == "duplicate_content":
        IF duplicate_pages rank OR high_traffic pages:
            PRIORITY = "HIGH"
            TIMELINE = "Fix within 1 week"
        ELSE:
            PRIORITY = "MEDIUM"
            TIMELINE = "Fix within 1 month"
    
    ELSE IF issue_type == "broken_links":
        IF broken_links > 100 OR high-authority pages affected:
            PRIORITY = "MEDIUM"
            TIMELINE = "Fix within 2 weeks"
        ELSE:
            PRIORITY = "LOW"
            TIMELINE = "Fix within 1 month"
    
    ELSE IF issue_type == "missing_schema":
        IF competitors use schema AND feature in rich results:
            PRIORITY = "MEDIUM"
            TIMELINE = "Implement within 2 weeks"
        ELSE:
            PRIORITY = "LOW"
            TIMELINE = "Implement within 1 month"
    
    ELSE:
        PRIORITY = "LOW"
        TIMELINE = "Address in regular maintenance"
```

### Content Update vs. New Content Tree

```
FOR each keyword_opportunity:
    
    CHECK existing_content on site:
    
    IF relevant_page exists:
        ANALYZE current_ranking:
        
        IF ranking between 4-20:
            ACTION = "Update and optimize existing page"
            TASKS:
                - Expand content depth
                - Update statistics
                - Improve title/meta
                - Add multimedia
                - Build backlinks
        
        ELSE IF ranking > 20 OR no ranking:
            EVALUATE search_intent_match:
            
            IF intent_matches:
                ACTION = "Major content overhaul"
                TASKS:
                    - Rewrite with keyword focus
                    - Restructure for better UX
                    - Add comprehensive information
                    - Optimize all on-page elements
            
            ELSE:
                ACTION = "Create new dedicated page"
                REASON = "Existing page serves different intent"
    
    ELSE:
        ACTION = "Create new content"
        
        DETERMINE content_type:
            IF search_intent == "informational":
                FORMAT = "Blog post or guide"
                LENGTH = "1500-3000 words"
            
            ELSE IF search_intent == "commercial":
                FORMAT = "Comparison or review page"
                LENGTH = "2000-3500 words"
            
            ELSE IF search_intent == "transactional":
                FORMAT = "Product/service page"
                LENGTH = "500-1500 words + rich media"
            
            ELSE IF search_intent == "navigational":
                FORMAT = "Specific resource/tool page"
                LENGTH = "Varies by resource"
```

### Link Building Prioritization Tree

```
FOR each link_opportunity:
    
    EVALUATE link_quality:
    
    IF domain_authority > 60 AND topical_relevance == "high":
        PRIORITY = "CRITICAL"
        EFFORT_INVESTMENT = "High - worth significant time"
        METHODS:
            - Personalized outreach
            - Create custom content