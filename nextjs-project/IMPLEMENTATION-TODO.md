# 🎯 JupitLunar Knowledge Portal - Implementation TODO

**Project Goal**: Transform JupitLunar from product marketing site → North America's most authoritative infant nutrition knowledge portal

**Inspiration**: Solid Starts + CDC/AAP authority
**Timeline**: 2-3 weeks for core features

---

## ✅ Phase 1: Homepage Transformation (COMPLETED)

### Done
- [x] Redesigned hero section with knowledge portal focus
- [x] Added trust badge: "Based on CDC, AAP & Health Canada Official Guidelines"
- [x] Implemented search bar with food/topic search
- [x] Added quick stats (1,200+ citations, 400+ foods, 90-day updates)
- [x] Created 4 category cards:
  - [x] Food Database
  - [x] Safety Rules
  - [x] Feeding Milestones
  - [x] Allergen Introduction
- [x] Added "Recently Updated" section with topic previews
- [x] Added trust signals section (Official Guidelines, Regularly Updated, Transparent Sources)
- [x] Added CTA section linking to /foods and /topics

**File Modified**: `src/app/page.tsx`

---

## 🔄 Phase 2: Food Database Interface (IN PROGRESS)

### 2.1 Main Food Database Page `/foods`
- [ ] Create `src/app/foods/page.tsx`
- [ ] Components needed:
  - [ ] Search bar (real-time filtering)
  - [ ] Filter sidebar:
    - [ ] Age range (6m+, 9m+, 12m+, 18m+, 24m+)
    - [ ] Risk level (none, low, medium, high)
    - [ ] Feeding method (BLW, puree, both)
    - [ ] Allergens (peanut, egg, dairy, soy, wheat, fish, shellfish, sesame)
    - [ ] Nutrition focus (iron-rich, vitamin C, protein, healthy fats)
  - [ ] Food cards grid (responsive layout)
  - [ ] Pagination or infinite scroll

**Card Design**:
```
┌────────────────────────┐
│  [Food Image]          │
│  Avocado               │
│  6 months+             │
│  🟢 Low Choking Risk   │
│  [View Details →]      │
└────────────────────────┘
```

### 2.2 Individual Food Detail Pages `/foods/[slug]`
- [ ] Create `src/app/foods/[slug]/page.tsx`
- [ ] Sections needed:
  - [ ] Hero: Food name + image
  - [ ] At-a-glance info:
    - [ ] Starting age
    - [ ] Choking risk level
    - [ ] Allergen status
    - [ ] Nutrition highlights
  - [ ] Age-specific preparation guide
    - [ ] 6-9 months: texture, size, shape
    - [ ] 9-12 months: texture, size, shape
    - [ ] 12-18 months: texture, size, shape
    - [ ] 18-24 months: texture, size, shape
  - [ ] Do's & Don'ts list
  - [ ] Storage tips
  - [ ] Citations (CDC/AAP sources)
  - [ ] Related foods
  - [ ] Safety warnings (if applicable)

### 2.3 Data Integration
- [ ] Create food search/filter functions in `src/lib/supabase.ts`:
  - [ ] `searchFoods(query: string)`
  - [ ] `filterFoods(filters: FoodFilters)`
  - [ ] `getFoodBySlug(slug: string)`
  - [ ] `getRelatedFoods(foodId: string)`

- [ ] Update `kb_foods` table schema:
  - [ ] Add `food_image_url` column
  - [ ] Add `popularity_score` column (for sorting)
  - [ ] Add `video_url` column (optional)
  - [ ] Ensure `serving_forms` JSON is populated

### 2.4 Components to Create
- [ ] `src/components/FoodCard.tsx` - Grid item card
- [ ] `src/components/FoodFilters.tsx` - Filter sidebar
- [ ] `src/components/FoodSearch.tsx` - Search component
- [ ] `src/components/AgeTag.tsx` - Age range badge
- [ ] `src/components/RiskBadge.tsx` - Choking risk indicator
- [ ] `src/components/PreparationGuide.tsx` - Age-specific prep steps

---

## 📋 Phase 3: Navigation Enhancement

### 3.1 Header Navigation Overhaul
- [ ] Update header component (find current header file)
- [ ] New menu structure:
  ```
  🏠 Home
  🍎 Foods ▼
     ├─ By Age
     │  ├─ 6-9 months
     │  ├─ 9-12 months
     │  ├─ 12-18 months
     │  └─ 18-24 months
     ├─ By Type
     │  ├─ Fruits
     │  ├─ Vegetables
     │  ├─ Proteins
     │  ├─ Grains
     │  └─ Dairy
     └─ Allergen Plan
  📋 Safety
  📅 Milestones
  🔍 Search
  ℹ️ About ▼
     ├─ Trust & Methods
     └─ Sources
  ```

### 3.2 Mega Menu Component
- [ ] Create `src/components/MegaMenu.tsx`
- [ ] Desktop: Dropdown on hover
- [ ] Mobile: Accordion style
- [ ] Visual category icons

### 3.3 Breadcrumb Navigation
- [ ] Create `src/components/Breadcrumb.tsx`
- [ ] Example: `Home > Foods > Fruits > Avocado`
- [ ] Schema.org BreadcrumbList markup

---

## 🛡️ Phase 4: Trust & Authority Pages

### 4.1 Enhanced Trust Page `/trust`
- [ ] Update `src/app/trust/page.tsx`
- [ ] Sections:
  - [ ] Our Approach: Science-Based Curation
    - [ ] What we do ✅
    - [ ] What we DON'T do ❌
  - [ ] Content Process
    - [ ] 1. Source Selection (CDC, AAP, Health Canada only)
    - [ ] 2. Translation (Medical → Parent-friendly)
    - [ ] 3. Organization (By age & topic)
    - [ ] 4. Regular Updates (90-day cycle)
  - [ ] Medical Disclaimer
  - [ ] Our Sources (logos of CDC, AAP, Health Canada, FDA, USDA)
  - [ ] Contact Information

### 4.2 Sources List Page `/sources`
- [ ] Create `src/app/sources/page.tsx`
- [ ] Features:
  - [ ] Sortable/filterable table of all 1,200+ sources
  - [ ] Columns: Title, Organization, Date Published, Last Verified
  - [ ] Filter by organization (CDC, AAP, Health Canada, etc.)
  - [ ] Search by keyword
  - [ ] Export to CSV option

### 4.3 About Page `/about`
- [ ] Create `src/app/about/page.tsx`
- [ ] Mission statement
- [ ] Why we're different (Free, Official Sources, AI-Optimized)
- [ ] Roadmap
- [ ] Contact form

---

## 🎨 Phase 5: Visual Content

### 5.1 Food Images
**Priority Foods (Top 50)**:
- [ ] **Fruits**: Avocado, Banana, Blueberries, Strawberries, Mango, Apple, Pear, Peach, Watermelon, Orange
- [ ] **Vegetables**: Broccoli, Sweet Potato, Carrot, Peas, Green Beans, Butternut Squash, Zucchini, Spinach
- [ ] **Proteins**: Chicken, Beef, Salmon, Eggs, Tofu, Lentils, Black Beans, Yogurt, Cheese
- [ ] **Grains**: Oatmeal, Rice Cereal, Quinoa, Pasta, Bread
- [ ] **Allergens**: Peanut Butter, Almond Butter, Tahini (sesame), Cow's Milk

**Image Requirements**:
- [ ] High-resolution (at least 800x800px)
- [ ] Consistent style (either all photos or all illustrations)
- [ ] Prepared form shown (not whole produce)
- [ ] Good lighting, neutral background

### 5.2 Cutting Guides
- [ ] Create visual guides for proper cutting techniques
- [ ] Examples:
  - [ ] ✅ Safe grape cut (quartered lengthwise)
  - [ ] ❌ Unsafe grape (whole)
  - [ ] ✅ Safe hot dog cut (quartered lengthwise)
  - [ ] ❌ Unsafe hot dog (sliced coins)
  - [ ] Finger-shaped strips for BLW
  - [ ] Appropriate sizes by age

---

## 🗄️ Phase 6: Database Updates

### 6.1 Schema Changes
```sql
-- Add to kb_foods table
ALTER TABLE kb_foods
ADD COLUMN food_image_url TEXT,
ADD COLUMN popularity_score INTEGER DEFAULT 0,
ADD COLUMN video_url TEXT,
ADD COLUMN search_keywords TEXT[]; -- For better search

-- Create food view counts table for popularity tracking
CREATE TABLE food_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  food_id UUID REFERENCES kb_foods(id),
  viewed_at TIMESTAMP DEFAULT NOW(),
  source TEXT -- 'search', 'browse', 'related'
);

-- Index for faster searches
CREATE INDEX idx_foods_search ON kb_foods
USING gin(to_tsvector('english', name || ' ' || array_to_string(search_keywords, ' ')));
```

### 6.2 Sample Data Population
- [ ] Add realistic `serving_forms` for top 50 foods
- [ ] Add `do_list` and `dont_list` for all foods
- [ ] Link foods to appropriate `kb_sources`
- [ ] Set initial `popularity_score` based on common foods

---

## 📱 Phase 7: Mobile Optimization

### 7.1 Responsive Design Checks
- [ ] Test homepage on mobile (320px, 375px, 414px widths)
- [ ] Test food database on mobile
  - [ ] Filters: Convert to bottom sheet or accordion
  - [ ] Cards: Stack vertically, adjust padding
- [ ] Test food detail pages on mobile
  - [ ] Preparation steps: Collapsible sections
  - [ ] Images: Full-width, optimized size
- [ ] Test navigation on mobile
  - [ ] Hamburger menu
  - [ ] Smooth transitions

### 7.2 Performance
- [ ] Image optimization (Next.js Image component)
- [ ] Lazy loading for food cards
- [ ] Code splitting for large components
- [ ] Lighthouse score target: 90+ on all metrics

---

## 🧪 Phase 8: Testing & QA

### 8.1 Functional Testing
- [ ] Homepage loads correctly
- [ ] Search returns relevant results
- [ ] Filters work individually and in combination
- [ ] Food detail pages load with all sections
- [ ] Navigation links all work
- [ ] Mobile menu functions correctly
- [ ] Trust/Sources pages display correctly

### 8.2 SEO/AEO Testing
- [ ] Google Rich Results Test (all structured data valid)
- [ ] Schema.org validator passes
- [ ] AI feed endpoints return correct data
- [ ] Sitemap includes all food pages
- [ ] robots.txt allows AI crawlers
- [ ] Meta tags correct on all pages

### 8.3 Cross-browser Testing
- [ ] Chrome
- [ ] Safari (iOS + macOS)
- [ ] Firefox
- [ ] Edge

---

## 🚀 Phase 9: Deployment & Monitoring

### 9.1 Pre-launch Checklist
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] All images uploaded to CDN/storage
- [ ] Analytics tracking set up
- [ ] Error monitoring configured (Sentry or similar)

### 9.2 Launch Tasks
- [ ] Deploy to production
- [ ] Submit updated sitemap to Google Search Console
- [ ] Submit updated sitemap to Bing Webmaster Tools
- [ ] Ping IndexNow for new pages
- [ ] Monitor server logs for errors

### 9.3 Post-launch Monitoring
- [ ] Week 1: Daily error log checks
- [ ] Week 2-4: Every 3 days
- [ ] Track metrics:
  - [ ] Page load times
  - [ ] Bounce rate (target: <40%)
  - [ ] Time on site (target: >4 minutes)
  - [ ] Top landing pages
  - [ ] Search queries
  - [ ] AI referral traffic (ChatGPT, Claude, Perplexity)

---

## 📊 Success Metrics (3-Month Targets)

| Metric | Current | Target |
|--------|---------|--------|
| Monthly Visitors | TBD | 50,000+ |
| Avg. Session Duration | TBD | 5+ minutes |
| Pages per Session | TBD | 4+ |
| Bounce Rate | TBD | <35% |
| Food Database Usage | 0% | 40% of traffic |
| AI Referral Traffic | 0% | 10% of traffic |
| Returning Visitors | TBD | 30% |

---

## 🔮 Future Enhancements (Phase 10+)

### Potential Features
- [ ] Personalized feed based on baby's age
- [ ] Meal plan generator (breakfast, lunch, dinner ideas)
- [ ] Printable grocery lists
- [ ] Weekly email newsletter with age-appropriate tips
- [ ] User accounts & saved favorites
- [ ] Recipe collections (theme-based: "High Iron Week", "Allergen Introduction Starter Pack")
- [ ] Video tutorials for food preparation
- [ ] Seasonal food guides
- [ ] Travel feeding tips
- [ ] Daycare food guidance
- [ ] Multi-language support (Spanish, Simplified Chinese)

### Content Expansion
- [ ] Sleep guides
- [ ] Development milestones checker
- [ ] Teething guides
- [ ] Picky eating strategies
- [ ] Family meal transition (24+ months)

---

## 📝 Notes

### Design Principles
1. **Simplicity First**: Every parent should understand within 3 seconds
2. **Mobile-First**: 70% of traffic will be mobile
3. **Fast Loading**: No page should take >2 seconds
4. **Accessible**: WCAG 2.1 AA compliance
5. **Evidence-Based**: Every claim must have a source

### Content Philosophy
- **We curate, we don't create medical advice**
- **Transparency > authority**
- **Parent-friendly language with medical accuracy**
- **When in doubt, defer to pediatrician**

### Competitive Advantages
1. ✅ **100% Free** (vs Solid Starts paid app)
2. ✅ **Official Guidelines** (vs community opinions)
3. ✅ **AI-Optimized** (higher LLM citation rate)
4. ✅ **Bilingual** (English + Chinese)
5. ✅ **Always Current** (90-day review cycle)

---

**Last Updated**: 2025-10-01
**Project Lead**: Claude Code
**Version**: 1.0
