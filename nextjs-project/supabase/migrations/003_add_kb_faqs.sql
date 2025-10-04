-- Migration: Add kb_faqs table for FAQ content
-- This table stores frequently asked questions with full source attribution and topic/food relationships

CREATE TABLE kb_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,

  -- Core content
  question TEXT NOT NULL,
  answer TEXT NOT NULL, -- Markdown supported
  answer_html TEXT, -- Pre-rendered HTML for performance

  -- Categorization
  category TEXT NOT NULL, -- 'feeding', 'sleep', 'health-safety', 'development', 'behavior', 'daily-care'
  subcategory TEXT, -- e.g., 'allergens', 'solid-introduction', 'nap-transitions'
  age_range TEXT[] DEFAULT '{}', -- e.g., ['0-6 months', '6-12 months', '12-24 months']
  locale TEXT NOT NULL DEFAULT 'Global', -- 'Global', 'USA', 'Canada'

  -- Relationships
  source_ids TEXT[] DEFAULT '{}', -- Foreign keys to kb_sources
  related_food_ids TEXT[] DEFAULT '{}', -- Show this FAQ on specific food pages
  related_rule_ids TEXT[] DEFAULT '{}', -- Link to related rules
  related_guide_ids TEXT[] DEFAULT '{}', -- Link to related guides
  related_topic_slugs TEXT[] DEFAULT '{}', -- e.g., ['feeding-foundations', 'allergen-readiness']

  -- Metadata
  priority INTEGER DEFAULT 100, -- Lower = higher priority, for sorting
  views_count INTEGER DEFAULT 0, -- Track popularity
  helpful_count INTEGER DEFAULT 0, -- User feedback: "Was this helpful?"

  -- Quality control
  last_reviewed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ, -- When this FAQ should be re-reviewed
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'published', 'archived'

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_kb_faqs_category ON kb_faqs(category);
CREATE INDEX idx_kb_faqs_locale ON kb_faqs(locale);
CREATE INDEX idx_kb_faqs_status ON kb_faqs(status);
CREATE INDEX idx_kb_faqs_age_range ON kb_faqs USING GIN(age_range);
CREATE INDEX idx_kb_faqs_related_topics ON kb_faqs USING GIN(related_topic_slugs);
CREATE INDEX idx_kb_faqs_priority ON kb_faqs(priority);

-- Full-text search on questions and answers
CREATE INDEX idx_kb_faqs_search ON kb_faqs USING GIN(
  to_tsvector('english', question || ' ' || answer)
);

-- Auto-update timestamp trigger
CREATE TRIGGER kb_faqs_updated_at
  BEFORE UPDATE ON kb_faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Example seed data (you can delete this after testing)
INSERT INTO kb_faqs (slug, question, answer, category, subcategory, age_range, related_topic_slugs, priority, status, last_reviewed_at) VALUES
(
  'when-start-solid-foods',
  'When should I start solid foods—and what are the readiness signs?',
  'Most babies are ready for solid foods around **6 months** of age. Key readiness signs include:

- Baby can sit up with minimal support
- Has good head and neck control
- Shows interest in food (watches you eat, reaches for food)
- Has lost the tongue-thrust reflex (doesn''t automatically push food out)
- Can move food from the front to the back of the mouth

Always consult your pediatrician before starting solids, especially if your baby was born preterm or has developmental concerns.

**Sources:** CDC, AAP Healthy Children',
  'feeding',
  'solid-introduction',
  ARRAY['0-6 months', '6-12 months'],
  ARRAY['feeding-foundations'],
  10,
  'published',
  NOW()
),
(
  'which-allergens-when',
  'When and how do I introduce allergens like peanut, egg, and dairy?',
  'Current evidence supports introducing common allergens **early and often** — typically around 6 months or when baby starts solids:

**High-priority allergens:**
- Peanut (as smooth peanut butter thinned with water/milk, or peanut powder)
- Egg (fully cooked)
- Cow''s milk dairy (yogurt, cheese - not as main drink before 12 months)
- Tree nuts (as smooth nut butters)
- Fish, shellfish
- Wheat, soy, sesame

**Best practices:**
1. Introduce one new allergen at a time
2. Start with a small amount (1/4 teaspoon)
3. Offer at home when you can watch for 2 hours
4. If no reaction, continue offering regularly (2-3x/week)
5. For high-risk infants (severe eczema, egg allergy), consult allergist first

**Sources:** NIAID Guidelines, AAP, ASCIA',
  'feeding',
  'allergens',
  ARRAY['6-12 months'],
  ARRAY['allergen-readiness', 'feeding-foundations'],
  15,
  'published',
  NOW()
);

COMMENT ON TABLE kb_faqs IS 'Stores FAQ content with source attribution, topic relationships, and age-targeting for AEO optimization';
COMMENT ON COLUMN kb_faqs.category IS 'Main category: feeding, sleep, health-safety, development, behavior, daily-care';
COMMENT ON COLUMN kb_faqs.related_topic_slugs IS 'Topic pages where this FAQ should appear (e.g., feeding-foundations, allergen-readiness)';
COMMENT ON COLUMN kb_faqs.priority IS 'Sort order - lower number = higher priority / appears first';
