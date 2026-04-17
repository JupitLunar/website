ALTER TABLE kb_faqs
  DROP CONSTRAINT IF EXISTS kb_faqs_category_check;

ALTER TABLE kb_faqs
  ADD CONSTRAINT kb_faqs_category_check
  CHECK (category IN ('platform-trust', 'feeding', 'sleep', 'fever-safety', 'postpartum', 'nutrition'));

ALTER TABLE kb_faqs
  ADD COLUMN IF NOT EXISTS source_layer TEXT,
  ADD COLUMN IF NOT EXISTS source_kind TEXT CHECK (source_kind IN ('platform', 'authority')),
  ADD COLUMN IF NOT EXISTS source_label TEXT,
  ADD COLUMN IF NOT EXISTS source_url TEXT;

COMMENT ON COLUMN kb_faqs.category IS 'Main category: platform-trust, feeding, sleep, fever-safety, postpartum, nutrition';
