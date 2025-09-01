-- JupitLunar GEO Content Engine Database Schema
-- This schema is optimized for AI content ingestion and GEO optimization

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Content Hubs table
CREATE TABLE IF NOT EXISTS content_hubs (
  id TEXT PRIMARY KEY CHECK (id IN ('feeding', 'sleep', 'mom-health', 'development', 'safety', 'recipes')),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  color TEXT NOT NULL,
  icon TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Articles table (main content storage)
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('explainer', 'howto', 'research', 'faq', 'recipe', 'news')),
  hub TEXT NOT NULL REFERENCES content_hubs(id) ON DELETE CASCADE,
  lang TEXT NOT NULL DEFAULT 'en' CHECK (lang IN ('en', 'zh')),
  
  -- Basic Information
  title TEXT NOT NULL,
  one_liner TEXT NOT NULL CHECK (length(one_liner) >= 50 AND length(one_liner) <= 200),
  key_facts JSONB NOT NULL CHECK (jsonb_array_length(key_facts) >= 3 AND jsonb_array_length(key_facts) <= 8),
  
  -- Metadata
  age_range TEXT,
  region TEXT NOT NULL DEFAULT 'Global' CHECK (region IN ('US', 'CA', 'Global')),
  last_reviewed DATE NOT NULL,
  reviewed_by TEXT NOT NULL,
  date_published TIMESTAMPTZ DEFAULT NOW(),
  date_modified TIMESTAMPTZ DEFAULT NOW(),
  
  -- Content
  body_md TEXT,
  entities TEXT[] NOT NULL DEFAULT '{}',
  
  -- License
  license TEXT NOT NULL DEFAULT 'CC BY-NC 4.0',
  
  -- SEO/GEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[],
  
  -- Status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Citations table (for E-E-A-T signals)
CREATE TABLE IF NOT EXISTS citations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  claim TEXT,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  author TEXT,
  publisher TEXT,
  date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Q&A table (for FAQ content and LLM feeds)
CREATE TABLE IF NOT EXISTS qas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  url TEXT, -- Anchor link within article
  citations JSONB DEFAULT '[]',
  lang TEXT NOT NULL DEFAULT 'en' CHECK (lang IN ('en', 'zh')),
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- How-To Steps table
CREATE TABLE IF NOT EXISTS how_to_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  time_required TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recipe Ingredients table
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount TEXT NOT NULL,
  unit TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recipe Steps table
CREATE TABLE IF NOT EXISTS recipe_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  time_required TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Images table (for Firebase integration)
CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT NOT NULL,
  caption TEXT,
  firebase_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Waitlist users table (for beta access)
CREATE TABLE IF NOT EXISTS waitlist_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'invited', 'registered')),
  invited_at TIMESTAMPTZ,
  registered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User feedback table
CREATE TABLE IF NOT EXISTS user_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT CHECK (category IN ('bug', 'feature', 'content', 'general')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content ingestion logs table
CREATE TABLE IF NOT EXISTS ingestion_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id TEXT NOT NULL,
  article_slug TEXT REFERENCES articles(slug),
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'error')),
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'partial')),
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_hub ON articles(hub);
CREATE INDEX IF NOT EXISTS idx_articles_type ON articles(type);
CREATE INDEX IF NOT EXISTS idx_articles_lang ON articles(lang);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_date_published ON articles(date_published);
CREATE INDEX IF NOT EXISTS idx_articles_entities ON articles USING GIN(entities);
CREATE INDEX IF NOT EXISTS idx_articles_key_facts ON articles USING GIN(key_facts);

CREATE INDEX IF NOT EXISTS idx_citations_article_id ON citations(article_id);
CREATE INDEX IF NOT EXISTS idx_qas_article_id ON qas(article_id);
CREATE INDEX IF NOT EXISTS idx_qas_lang ON qas(lang);
CREATE INDEX IF NOT EXISTS idx_qas_last_updated ON qas(last_updated);

CREATE INDEX IF NOT EXISTS idx_how_to_steps_article_id ON how_to_steps(article_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_article_id ON recipe_ingredients(article_id);
CREATE INDEX IF NOT EXISTS idx_recipe_steps_article_id ON recipe_steps(article_id);

CREATE INDEX IF NOT EXISTS idx_images_article_id ON images(article_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_users_email ON waitlist_users(email);

-- Full-text search indexes (using generated columns for better performance)
ALTER TABLE articles ADD COLUMN IF NOT EXISTS search_vector tsvector GENERATED ALWAYS AS (
  to_tsvector('english', 
    coalesce(title, '') || ' ' || 
    coalesce(body_md, '') || ' ' || 
    array_to_string(entities, ' ')
  )
) STORED;

ALTER TABLE qas ADD COLUMN IF NOT EXISTS search_vector tsvector GENERATED ALWAYS AS (
  to_tsvector('english', 
    coalesce(question, '') || ' ' || 
    coalesce(answer, '')
  )
) STORED;

CREATE INDEX IF NOT EXISTS idx_articles_search ON articles USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_qas_search ON qas USING GIN(search_vector);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_hubs_updated_at BEFORE UPDATE ON content_hubs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update content count in hubs
CREATE OR REPLACE FUNCTION update_hub_content_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE content_hubs 
        SET content_count = content_count + 1, updated_at = NOW()
        WHERE id = NEW.hub;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE content_hubs 
        SET content_count = content_count - 1, updated_at = NOW()
        WHERE id = OLD.hub;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_hub_content_count_trigger
    AFTER INSERT OR DELETE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_hub_content_count();

-- RPC function for atomic content bundle insertion/update
CREATE OR REPLACE FUNCTION upsert_article_bundle(
    p_slug TEXT,
    p_type TEXT,
    p_hub TEXT,
    p_lang TEXT DEFAULT 'en',
    p_title TEXT,
    p_one_liner TEXT,
    p_key_facts JSONB,
    p_age_range TEXT DEFAULT NULL,
    p_region TEXT DEFAULT 'Global',
    p_last_reviewed DATE,
    p_reviewed_by TEXT,
    p_entities TEXT[] DEFAULT '{}',
    p_license TEXT DEFAULT 'CC BY-NC 4.0',
    p_body_md TEXT DEFAULT NULL,
    p_steps JSONB DEFAULT NULL,
    p_faq JSONB DEFAULT NULL,
    p_citations JSONB DEFAULT '[]',
    p_meta_title TEXT DEFAULT NULL,
    p_meta_description TEXT DEFAULT NULL,
    p_keywords TEXT[] DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_article_id UUID;
    v_step JSONB;
    v_faq_item JSONB;
    v_citation JSONB;
BEGIN
    -- Insert or update article
    INSERT INTO articles (
        slug, type, hub, lang, title, one_liner, key_facts,
        age_range, region, last_reviewed, reviewed_by, entities,
        license, body_md, meta_title, meta_description, keywords,
        status, date_modified
    ) VALUES (
        p_slug, p_type, p_hub, p_lang, p_title, p_one_liner, p_key_facts,
        p_age_range, p_region, p_last_reviewed, p_reviewed_by, p_entities,
        p_license, p_body_md, p_meta_title, p_meta_description, p_keywords,
        'published', NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        type = EXCLUDED.type,
        hub = EXCLUDED.hub,
        lang = EXCLUDED.lang,
        title = EXCLUDED.title,
        one_liner = EXCLUDED.one_liner,
        key_facts = EXCLUDED.key_facts,
        age_range = EXCLUDED.age_range,
        region = EXCLUDED.region,
        last_reviewed = EXCLUDED.last_reviewed,
        reviewed_by = EXCLUDED.reviewed_by,
        entities = EXCLUDED.entities,
        license = EXCLUDED.license,
        body_md = EXCLUDED.body_md,
        meta_title = EXCLUDED.meta_title,
        meta_description = EXCLUDED.meta_description,
        keywords = EXCLUDED.keywords,
        status = 'published',
        date_modified = NOW()
    RETURNING id INTO v_article_id;

    -- Clear existing related data
    DELETE FROM how_to_steps WHERE article_id = v_article_id;
    DELETE FROM qas WHERE article_id = v_article_id;
    DELETE FROM citations WHERE article_id = v_article_id;

    -- Insert steps if provided
    IF p_steps IS NOT NULL THEN
        FOR v_step IN SELECT * FROM jsonb_array_elements(p_steps)
        LOOP
            INSERT INTO how_to_steps (
                article_id, step_number, title, description, time_required, image_url
            ) VALUES (
                v_article_id,
                (v_step->>'step_number')::INTEGER,
                v_step->>'title',
                v_step->>'description',
                v_step->>'time_required',
                v_step->>'image_url'
            );
        END LOOP;
    END IF;

    -- Insert FAQ items if provided
    IF p_faq IS NOT NULL THEN
        FOR v_faq_item IN SELECT * FROM jsonb_array_elements(p_faq)
        LOOP
            INSERT INTO qas (
                article_id, question, answer, url, citations, lang
            ) VALUES (
                v_article_id,
                v_faq_item->>'question',
                v_faq_item->>'answer',
                v_faq_item->>'url',
                COALESCE(v_faq_item->'citations', '[]'::jsonb),
                p_lang
            );
        END LOOP;
    END IF;

    -- Insert citations if provided
    IF p_citations IS NOT NULL THEN
        FOR v_citation IN SELECT * FROM jsonb_array_elements(p_citations)
        LOOP
            INSERT INTO citations (
                article_id, claim, title, url, author, publisher, date
            ) VALUES (
                v_article_id,
                v_citation->>'claim',
                v_citation->>'title',
                v_citation->>'url',
                v_citation->>'author',
                v_citation->>'publisher',
                (v_citation->>'date')::DATE
            );
        END LOOP;
    END IF;

    RETURN v_article_id;
END;
$$ LANGUAGE plpgsql;

-- Insert initial content hubs
INSERT INTO content_hubs (id, name, description, color, icon, slug) VALUES
('feeding', 'Feeding & Nutrition', 'Evidence-based guidance on breastfeeding, formula feeding, and introducing solid foods.', 'feeding', '🍼', 'feeding'),
('sleep', 'Sleep & Routines', 'Science-backed sleep training methods and establishing healthy routines for your baby.', 'sleep', '😴', 'sleep'),
('mom-health', 'Mom Health', 'Postpartum recovery, mental health, and self-care strategies for new mothers.', 'momHealth', '💝', 'mom-health'),
('development', 'Baby Development', 'Milestone tracking, early education, and developmental activities for growing babies.', 'development', '🧠', 'development'),
('safety', 'Safety & First Aid', 'Essential safety guidelines, emergency procedures, and accident prevention.', 'safety', '🛡️', 'safety'),
('recipes', 'Recipes & Solid Start', 'Nutritious recipes, meal planning, and guidance for introducing solid foods.', 'recipes', '🥄', 'recipes')
ON CONFLICT (id) DO NOTHING;
