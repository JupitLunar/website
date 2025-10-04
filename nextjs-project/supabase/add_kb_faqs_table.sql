-- SQL to add kb_faqs table to existing database
-- Generated: 2025-10-03T22:07:31.149Z
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql


-- Function for updated_at trigger (skip if already exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';


-- Knowledge Base FAQs (Frequently Asked Questions)
CREATE TABLE IF NOT EXISTS kb_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,

  -- Core content
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  answer_html TEXT,

  -- Categorization
  category TEXT NOT NULL CHECK (category IN ('feeding', 'sleep', 'health-safety', 'development', 'behavior', 'daily-care')),
  subcategory TEXT,
  age_range TEXT[] DEFAULT '{}',
  locale TEXT NOT NULL DEFAULT 'Global' CHECK (locale IN ('US', 'CA', 'Global')),

  -- Relationships
  source_ids UUID[] DEFAULT '{}',
  related_food_ids UUID[] DEFAULT '{}',
  related_rule_ids UUID[] DEFAULT '{}',
  related_guide_ids UUID[] DEFAULT '{}',
  related_topic_slugs TEXT[] DEFAULT '{}',

  -- Metadata
  priority INTEGER DEFAULT 100,
  views_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,

  -- Quality control
  last_reviewed_at DATE,
  expires_at DATE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for kb_faqs
CREATE INDEX IF NOT EXISTS idx_kb_faqs_slug ON kb_faqs(slug);
CREATE INDEX IF NOT EXISTS idx_kb_faqs_category ON kb_faqs(category);
CREATE INDEX IF NOT EXISTS idx_kb_faqs_locale ON kb_faqs(locale);
CREATE INDEX IF NOT EXISTS idx_kb_faqs_status ON kb_faqs(status);
CREATE INDEX IF NOT EXISTS idx_kb_faqs_priority ON kb_faqs(priority);
CREATE INDEX IF NOT EXISTS idx_kb_faqs_age_range ON kb_faqs USING GIN(age_range);
CREATE INDEX IF NOT EXISTS idx_kb_faqs_related_topics ON kb_faqs USING GIN(related_topic_slugs);
CREATE INDEX IF NOT EXISTS idx_kb_faqs_search ON kb_faqs USING GIN(search_vector);

-- Full-text search for kb_faqs
ALTER TABLE kb_faqs ADD COLUMN IF NOT EXISTS search_vector tsvector GENERATED ALWAYS AS (
  to_tsvector('english',
    coalesce(question, '') || ' ' ||
    coalesce(answer, '')
  )
) STORED;

CREATE INDEX IF NOT EXISTS idx_kb_faqs_search ON kb_faqs USING GIN(search_vector);

-- Trigger for updated_at
CREATE TRIGGER update_kb_faqs_updated_at BEFORE UPDATE ON kb_faqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample FAQ data
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
  CURRENT_DATE
)
ON CONFLICT (slug) DO NOTHING;

-- Verify table was created
SELECT
  table_name,
  (SELECT count(*) FROM kb_faqs) as row_count
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'kb_faqs';
