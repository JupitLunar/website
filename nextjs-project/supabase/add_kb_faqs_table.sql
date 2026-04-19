-- SQL to add or repair kb_faqs on the remote Supabase project
-- Run this in the Supabase SQL Editor for project: isrsacgnhagdvwoytkuy

-- Shared updated_at trigger helper
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Knowledge Base FAQs aligned with the existing kb_* schema family
CREATE TABLE IF NOT EXISTS kb_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,

  -- Core content
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  answer_html TEXT,

  -- Categorization
  category TEXT NOT NULL CHECK (category IN ('platform-trust', 'feeding', 'sleep', 'fever-safety', 'postpartum', 'nutrition')),
  subcategory TEXT,
  age_range TEXT[] DEFAULT '{}',
  locale TEXT NOT NULL DEFAULT 'Global' CHECK (locale IN ('US', 'CA', 'Global')),
  source_layer TEXT,
  source_kind TEXT CHECK (source_kind IN ('platform', 'authority')),
  source_label TEXT,
  source_url TEXT,

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

-- Repair existing partial tables so they match the current site/API expectations
ALTER TABLE kb_faqs
  DROP CONSTRAINT IF EXISTS kb_faqs_category_check;

ALTER TABLE kb_faqs
  ADD CONSTRAINT kb_faqs_category_check
  CHECK (category IN ('platform-trust', 'feeding', 'sleep', 'fever-safety', 'postpartum', 'nutrition'));

ALTER TABLE kb_faqs
  ADD COLUMN IF NOT EXISTS answer_html TEXT,
  ADD COLUMN IF NOT EXISTS subcategory TEXT,
  ADD COLUMN IF NOT EXISTS age_range TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'Global',
  ADD COLUMN IF NOT EXISTS source_layer TEXT,
  ADD COLUMN IF NOT EXISTS source_kind TEXT,
  ADD COLUMN IF NOT EXISTS source_label TEXT,
  ADD COLUMN IF NOT EXISTS source_url TEXT,
  ADD COLUMN IF NOT EXISTS source_ids UUID[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS related_food_ids UUID[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS related_rule_ids UUID[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS related_guide_ids UUID[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS related_topic_slugs TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 100,
  ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS helpful_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_reviewed_at DATE,
  ADD COLUMN IF NOT EXISTS expires_at DATE,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE kb_faqs
  DROP CONSTRAINT IF EXISTS kb_faqs_locale_check;

ALTER TABLE kb_faqs
  ADD CONSTRAINT kb_faqs_locale_check
  CHECK (locale IN ('US', 'CA', 'Global'));

ALTER TABLE kb_faqs
  DROP CONSTRAINT IF EXISTS kb_faqs_source_kind_check;

ALTER TABLE kb_faqs
  ADD CONSTRAINT kb_faqs_source_kind_check
  CHECK (source_kind IN ('platform', 'authority'));

ALTER TABLE kb_faqs
  DROP CONSTRAINT IF EXISTS kb_faqs_status_check;

ALTER TABLE kb_faqs
  ADD CONSTRAINT kb_faqs_status_check
  CHECK (status IN ('draft', 'published', 'archived'));

COMMENT ON TABLE kb_faqs IS 'Published FAQ answers for the public Mom AI Agent knowledge surface.';
COMMENT ON COLUMN kb_faqs.category IS 'Main category: platform-trust, feeding, sleep, fever-safety, postpartum, nutrition';
COMMENT ON COLUMN kb_faqs.source_kind IS 'platform = internal platform page, authority = external clinical/public-health source';

-- Full-text search support
ALTER TABLE kb_faqs
  ADD COLUMN IF NOT EXISTS search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector(
      'english',
      coalesce(question, '') || ' ' || coalesce(answer, '')
    )
  ) STORED;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_kb_faqs_slug ON kb_faqs(slug);
CREATE INDEX IF NOT EXISTS idx_kb_faqs_category ON kb_faqs(category);
CREATE INDEX IF NOT EXISTS idx_kb_faqs_locale ON kb_faqs(locale);
CREATE INDEX IF NOT EXISTS idx_kb_faqs_status ON kb_faqs(status);
CREATE INDEX IF NOT EXISTS idx_kb_faqs_priority ON kb_faqs(priority);
CREATE INDEX IF NOT EXISTS idx_kb_faqs_age_range ON kb_faqs USING GIN(age_range);
CREATE INDEX IF NOT EXISTS idx_kb_faqs_related_topics ON kb_faqs USING GIN(related_topic_slugs);
CREATE INDEX IF NOT EXISTS idx_kb_faqs_search ON kb_faqs USING GIN(search_vector);

-- updated_at trigger
DROP TRIGGER IF EXISTS update_kb_faqs_updated_at ON kb_faqs;

CREATE TRIGGER update_kb_faqs_updated_at
BEFORE UPDATE ON kb_faqs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Verification: confirms table exists but does not insert any demo rows
SELECT
  table_name,
  (
    SELECT count(*)
    FROM kb_faqs
  ) AS row_count
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'kb_faqs';
