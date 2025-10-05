-- Step 1: Create Base Tables for RAG System
-- Run this first in Supabase SQL Editor

-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Create article_summaries table
CREATE TABLE IF NOT EXISTS article_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic info
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  key_points TEXT[] DEFAULT '{}',

  -- Source info
  source_url TEXT NOT NULL,
  source_name TEXT NOT NULL,

  -- Classification
  category TEXT NOT NULL DEFAULT 'feeding',
  age_range TEXT[] DEFAULT '{}',
  risk_level TEXT DEFAULT 'none' CHECK (risk_level IN ('none', 'low', 'medium', 'high')),
  tags TEXT[] DEFAULT '{}',

  -- Professional metadata (NEW)
  article_type TEXT CHECK (article_type IN ('news', 'research', 'clinical', 'review', 'expert_opinion')) DEFAULT 'news',
  author TEXT,
  author_credentials TEXT,
  publish_date TIMESTAMPTZ,
  update_frequency TEXT CHECK (update_frequency IN ('daily', 'weekly', 'monthly', 'yearly', 'one-time')),
  peer_reviewed BOOLEAN DEFAULT false,
  impact_score FLOAT DEFAULT 0.5 CHECK (impact_score >= 0 AND impact_score <= 1),
  credibility_score FLOAT DEFAULT 0.5 CHECK (credibility_score >= 0 AND credibility_score <= 1),
  locale TEXT DEFAULT 'Global' CHECK (locale IN ('US', 'CA', 'CN', 'Global')),

  -- Vector embeddings
  embedding vector(1536),

  -- Content
  full_content TEXT,
  content_chunks JSONB DEFAULT '[]',
  chunk_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',

  -- Status
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create knowledge_chunks table (if not exists)
CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Source reference
  source_type TEXT NOT NULL CHECK (source_type IN ('article', 'kb_rule', 'kb_food', 'kb_guide', 'kb_faq', 'qa', 'how_to_step', 'recipe_step')),
  source_id UUID NOT NULL,
  source_slug TEXT,

  -- Content
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,

  -- Categorization
  category TEXT NOT NULL,
  subcategory TEXT,
  age_range TEXT[] DEFAULT '{}',
  locale TEXT NOT NULL DEFAULT 'Global' CHECK (locale IN ('US', 'CA', 'CN', 'Global', 'EN', 'ZH')),

  -- Metadata
  priority INTEGER DEFAULT 100,
  risk_level TEXT DEFAULT 'none' CHECK (risk_level IN ('none', 'low', 'medium', 'high')),
  tags TEXT[] DEFAULT '{}',

  -- Vector embedding
  embedding vector(1536),

  -- Smart chunking (NEW)
  chunk_index INTEGER DEFAULT 0,
  parent_chunk_id UUID REFERENCES knowledge_chunks(id) ON DELETE CASCADE,
  chunk_type TEXT CHECK (chunk_type IN ('full', 'section', 'paragraph', 'sentence')) DEFAULT 'full',
  semantic_boundaries JSONB DEFAULT '{}',

  -- Context
  prev_context TEXT,
  next_context TEXT,

  -- Retrieval optimization
  keyword_density JSONB DEFAULT '{}',
  entity_mentions JSONB DEFAULT '{}',

  -- Freshness management
  content_freshness_score FLOAT DEFAULT 1.0 CHECK (content_freshness_score >= 0 AND content_freshness_score <= 1),
  decay_rate FLOAT DEFAULT 0.1 CHECK (decay_rate >= 0 AND decay_rate <= 1),
  relevance_boost_until TIMESTAMPTZ,
  auto_archive_after INTERVAL DEFAULT '1 year',

  -- Multi-language
  detected_language TEXT,
  translation_available TEXT[] DEFAULT '{}',

  -- Quality control
  last_reviewed_at DATE,
  expires_at DATE,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create ai_conversations table
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Query
  user_query TEXT NOT NULL,
  query_embedding vector(1536),

  -- Retrieved context
  retrieved_chunks UUID[] DEFAULT '{}',
  chunk_scores FLOAT[] DEFAULT '{}',

  -- AI response
  ai_response TEXT NOT NULL,
  response_metadata JSONB DEFAULT '{}',

  -- User feedback
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  user_feedback TEXT,

  -- Session
  session_id TEXT,
  user_id TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create content_quality_metrics table
CREATE TABLE IF NOT EXISTS content_quality_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chunk_id UUID REFERENCES knowledge_chunks(id) ON DELETE CASCADE,

  -- Quality indicators
  readability_score FLOAT CHECK (readability_score >= 0 AND readability_score <= 1),
  accuracy_score FLOAT CHECK (accuracy_score >= 0 AND accuracy_score <= 1),
  completeness_score FLOAT CHECK (completeness_score >= 0 AND completeness_score <= 1),
  citation_count INTEGER DEFAULT 0,

  -- Usage metrics
  retrieval_count INTEGER DEFAULT 0,
  positive_feedback INTEGER DEFAULT 0,
  negative_feedback INTEGER DEFAULT 0,
  click_through_rate FLOAT DEFAULT 0.0,

  -- Engagement
  avg_time_spent FLOAT DEFAULT 0.0,
  bounce_rate FLOAT DEFAULT 0.0,

  -- Timestamps
  measured_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create chunk_relationships table
CREATE TABLE IF NOT EXISTS chunk_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_chunk_id UUID NOT NULL REFERENCES knowledge_chunks(id) ON DELETE CASCADE,
  target_chunk_id UUID NOT NULL REFERENCES knowledge_chunks(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL CHECK (relationship_type IN ('related', 'contradicts', 'supports', 'prerequisite', 'follow_up')),
  strength FLOAT DEFAULT 1.0 CHECK (strength >= 0 AND strength <= 1),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Success message
SELECT 'Step 1 Complete: All base tables created!' as message;
