-- JupitLunar GEO Content Engine - Initial Setup
-- Run this in Supabase SQL Editor for initial setup

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

-- Create basic indexes for better performance
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

-- Insert initial content hubs
INSERT INTO content_hubs (id, name, description, color, icon, slug) VALUES
('feeding', 'Feeding & Nutrition', 'Evidence-based guidance on breastfeeding, formula feeding, and introducing solid foods.', 'feeding', '🍼', 'feeding'),
('sleep', 'Sleep & Routines', 'Science-backed sleep training methods and establishing healthy routines for your baby.', 'sleep', '😴', 'sleep'),
('mom-health', 'Mom Health', 'Postpartum recovery, mental health, and self-care strategies for new mothers.', 'momHealth', '💝', 'mom-health'),
('development', 'Baby Development', 'Milestone tracking, early education, and developmental activities for growing babies.', 'development', '🧠', 'development'),
('safety', 'Safety & First Aid', 'Essential safety guidelines, emergency procedures, and accident prevention.', 'safety', '🛡️', 'safety'),
('recipes', 'Recipes & Solid Start', 'Nutritious recipes, meal planning, and guidance for introducing solid foods.', 'recipes', '🥄', 'recipes')
ON CONFLICT (id) DO NOTHING;
