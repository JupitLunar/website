# AEO Optimization Review for MomAI

## Current Signals Helping LLM & AI Discovery
- **Structured data already in use.** The FAQ page publishes a Schema.org `FAQPage` payload that mirrors the visible questions, giving answer engines some machine-readable coverage.【F:src/pages/sitefaq.tsx†L76-L105】
- **Blog articles expose metadata.** Each blog post outputs `BlogPosting` JSON-LD plus canonical, Open Graph, and keyword tags through `react-helmet`, which is a solid baseline for both SEO and AEO.【F:src/pages/BlogPost.tsx†L3813-L3858】
- **Primary navigation includes section anchors.** The home page already ships IDs such as `home`, `products`, `features`, and `contact`, enabling scroll-to-section behaviour that can be extended into machine-friendly deep links.【F:src/pages/Home.tsx†L180-L360】

## Gaps & Opportunities vs. the AEO Checklist

### 1. Robots, Sitemaps, and Crawler Guidance
- `robots.txt` allows everything but does not enumerate AI-focused user agents or advertise a sitemap, so AI crawlers receive no explicit opt-in signal or discovery hints.【F:public/robots.txt†L1-L3】
- There is no sitemap file in the public bundle, so both search engines and AI crawlers need to infer URL structure from crawl discovery alone, which slows recrawl and freshness detection.【e2439d†L1-L3】
- Recommendation: replace the minimal `robots.txt` with the checklist’s allowlist (GPTBot, OAI-SearchBot, Google-Extended, ClaudeBot, PerplexityBot, Applebot-Extended, CCBot) and add `Sitemap:` directives. Publish language-/topic-specific `sitemap.xml` files and submit them via Search Console and equivalent AI portals.

### 2. Page Templates Optimised for “Question → Answer”
- Blog titles skew toward headline-style statements (e.g., “Safe Sleep Guidelines for Newborns…”) instead of parent-question phrasing, and each article is stored as a long HTML string without stable subsection IDs for deep-linking to “Bottom line”, “US vs Canada”, “How-to”, etc.【F:src/pages/BlogPost.tsx†L13-L200】【F:src/pages/BlogPost.tsx†L3890-L3894】
- Recommendation: split high-value topics into dedicated Q&A pages (one primary question per URL), rewrite H1s as natural-language questions, and add consistent `id` attributes (`#bottom-line`, `#us-guidance`, `#canada-guidance`, `#safety`, `#references`) inside the rendered markup instead of relying on opaque `dangerouslySetInnerHTML` blocks.

### 3. Structured Data Coverage for Medical Guidance
- Current JSON-LD only declares `BlogPosting` or `FAQPage`; there is no `MedicalWebPage`/`Article` combination with `lastReviewed`, `about`, `author`, `reviewedBy`, or `areaServed` granularity as recommended for health content.【F:src/pages/BlogPost.tsx†L3813-L3843】【F:src/pages/sitefaq.tsx†L76-L93】
- Recommendation: augment every medically oriented page with combined `MedicalWebPage` + `Article` schema, including ISO `datePublished`/`dateModified`, reviewer credentials, region tags (US/CA), and explicit `lastReviewed` dates. Mirror those timestamps visibly near the masthead to reinforce freshness signals.

### 4. Regionalisation & Hreflang Signals
- The project references multiple geographies in copy, but no `<link rel="alternate" hreflang="…">` tags are present in the document head to disambiguate region- or language-specific variants.【F:public/index.html†L1-L42】
- Recommendation: introduce per-region routes (e.g., `/en-us/when-can-baby-drink-water` vs `/en-ca/...`) or at least language toggles, and emit the proper hreflang pairs from your layout component so crawlers and LLMs can understand geography.

### 5. Freshness, Review, and Source Attribution
- Articles expose only a publish date pulled from static JSON; there is no `dateModified` or reviewer credential surfaced in the UI or JSON-LD, and references to primary sources (CDC, Health Canada, WHO) are not linked inline for easy citation harvesting.【F:src/pages/BlogPost.tsx†L3813-L3857】【F:src/pages/BlogPost.tsx†L3872-L3894】
- Recommendation: add explicit `Last reviewed` and `Medically reviewed by` badges near the byline, maintain a change log per article, and embed inline reference links to authoritative sites. Reflect the same data points in the structured data payload.

### 6. Machine-Readable Feeds for RAG & Aggregators
- There is currently no JSON or RSS endpoint (e.g., `/api/faq.json` or `/api/guides.json`) exposing the key question/answer pairs outside of the rendered React pages, which limits how knowledge engines can ingest updates at scale.【F:src/pages/sitefaq.tsx†L76-L105】
- Recommendation: ship lightweight JSON feeds alongside the static pages (even as statically built files in `/public/api/`) so LLM crawlers and partners can fetch canonical facts without parsing layout HTML.

### 7. Monitoring & Bot Governance
- No code paths document monitoring for AI-specific user agents, rate limiting, or anomaly detection; the Supabase-powered waitlist and feedback forms are client-only, leaving server-side logging for bot traffic unaddressed.【F:src/components/Header.tsx†L8-L103】【F:src/pages/Home.tsx†L220-L283】
- Recommendation: configure server or edge logging to alert on unofficial crawlers, pair UA checks with IP validation (per Perplexity/OpenAI guidance), and publish an `AI usage policy` page linked from the footer to set expectations.

## Suggested Next Steps
1. **Ship crawler guidance**: update `robots.txt`, add XML sitemaps, and register them with Google, Bing, OpenAI, Anthropic, and Perplexity portals.
2. **Refactor flagship articles into Q&A-first templates** with consistent anchor IDs, question-form headlines, tabled US/CA comparisons, and bottom-line summaries above the fold.
3. **Extend structured data** by generating reusable MedicalWebPage+FAQPage JSON-LD components that accept author, reviewer, geography, and freshness props.
4. **Expose machine-readable endpoints** (static JSON) for FAQ and medical guidance, and reuse those data sources to render on-page content to keep parity.
5. **Institute freshness governance** by adding editorial review workflows, visible `lastReviewed` badges, and inline citation footnotes that link to CDC/AAP/Health Canada sources.
6. **Implement hreflang & regional routing** to clarify locale intent for both search engines and AI assistants.
7. **Stand up monitoring dashboards** that track hits from GPTBot, ClaudeBot, PerplexityBot, etc., and alert when rate/behaviour deviates from expectations.

Following these steps will align the site with the provided AEO playbook while preserving (and likely enhancing) traditional SEO performance.
