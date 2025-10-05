-- Step 2: Create Indexes and Functions for RAG System (FIXED)
-- Run this after Step 1

-- ============================================================================
-- PART 1: Create Indexes (Basic)
-- ============================================================================

-- article_summaries indexes
CREATE INDEX IF NOT EXISTS idx_article_summaries_category ON article_summaries(category);
CREATE INDEX IF NOT EXISTS idx_article_summaries_source ON article_summaries(source_name);
CREATE INDEX IF NOT EXISTS idx_article_summaries_status ON article_summaries(status);
CREATE INDEX IF NOT EXISTS idx_article_summaries_created_at ON article_summaries(created_at);
CREATE INDEX IF NOT EXISTS idx_article_summaries_type ON article_summaries(article_type);
CREATE INDEX IF NOT EXISTS idx_article_summaries_locale ON article_summaries(locale);
CREATE INDEX IF NOT EXISTS idx_article_summaries_peer_reviewed ON article_summaries(peer_reviewed);
CREATE INDEX IF NOT EXISTS idx_article_summaries_publish_date ON article_summaries(publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_article_summaries_impact_score ON article_summaries(impact_score DESC);

-- Vector index for article_summaries
CREATE INDEX IF NOT EXISTS idx_article_summaries_embedding
  ON article_summaries
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- knowledge_chunks indexes
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_source ON knowledge_chunks(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_category ON knowledge_chunks(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_age_range ON knowledge_chunks USING GIN(age_range);
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_tags ON knowledge_chunks USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_status ON knowledge_chunks(status);
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_priority ON knowledge_chunks(priority);
CREATE INDEX IF NOT EXISTS idx_chunks_parent_chunk ON knowledge_chunks(parent_chunk_id);
CREATE INDEX IF NOT EXISTS idx_chunks_chunk_type ON knowledge_chunks(chunk_type);
CREATE INDEX IF NOT EXISTS idx_chunks_freshness_score ON knowledge_chunks(content_freshness_score DESC);
CREATE INDEX IF NOT EXISTS idx_chunks_detected_language ON knowledge_chunks(detected_language);

-- Composite indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chunks_type_status_priority
  ON knowledge_chunks(source_type, status, priority DESC);

CREATE INDEX IF NOT EXISTS idx_chunks_category_age_locale
  ON knowledge_chunks(category, locale)
  WHERE status = 'published';

-- Vector index for knowledge_chunks (optimized)
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_embedding
  ON knowledge_chunks
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 500);

-- ai_conversations indexes
CREATE INDEX IF NOT EXISTS idx_ai_conversations_session ON ai_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_rating ON ai_conversations(user_rating);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_created_at ON ai_conversations(created_at);

-- content_quality_metrics indexes
CREATE INDEX IF NOT EXISTS idx_quality_metrics_chunk_id ON content_quality_metrics(chunk_id);
CREATE INDEX IF NOT EXISTS idx_quality_metrics_retrieval_count ON content_quality_metrics(retrieval_count DESC);
CREATE INDEX IF NOT EXISTS idx_quality_metrics_accuracy ON content_quality_metrics(accuracy_score DESC);
CREATE INDEX IF NOT EXISTS idx_quality_metrics_measured_at ON content_quality_metrics(measured_at DESC);

-- chunk_relationships indexes
CREATE INDEX IF NOT EXISTS idx_chunk_relationships_source ON chunk_relationships(source_chunk_id);
CREATE INDEX IF NOT EXISTS idx_chunk_relationships_target ON chunk_relationships(target_chunk_id);
CREATE INDEX IF NOT EXISTS idx_chunk_relationships_type ON chunk_relationships(relationship_type);

-- Unique constraint
CREATE UNIQUE INDEX IF NOT EXISTS idx_knowledge_chunks_unique_source
  ON knowledge_chunks(source_type, source_id);

-- ============================================================================
-- PART 2: Create Triggers
-- ============================================================================

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_knowledge_chunks_updated_at BEFORE UPDATE ON knowledge_chunks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON ai_conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_quality_metrics_updated_at BEFORE UPDATE ON content_quality_metrics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_article_summaries_updated_at BEFORE UPDATE ON article_summaries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PART 3: Create Core Functions
-- ============================================================================

-- Function: populate_knowledge_chunks
CREATE OR REPLACE FUNCTION populate_knowledge_chunks()
RETURNS INTEGER AS $$
DECLARE
    chunk_count INTEGER := 0;
    article_record RECORD;
BEGIN
    -- Populate from articles (if table exists)
    FOR article_record IN
        SELECT id, slug, title, one_liner, body_md, hub, age_range, entities, date_published, status
        FROM articles
        WHERE status = 'published'
    LOOP
        INSERT INTO knowledge_chunks (
            source_type, source_id, source_slug, title, content, summary,
            category, age_range, tags, status,
            content_freshness_score, detected_language, created_at
        ) VALUES (
            'article', article_record.id, article_record.slug,
            article_record.title,
            COALESCE(article_record.body_md, article_record.one_liner),
            article_record.one_liner,
            article_record.hub,
            CASE WHEN article_record.age_range IS NOT NULL THEN ARRAY[article_record.age_range] ELSE '{}' END,
            article_record.entities,
            article_record.status,
            CASE
                WHEN article_record.date_published IS NOT NULL THEN
                    1.0 / (1.0 + EXTRACT(EPOCH FROM (NOW() - article_record.date_published)) / 7776000.0)
                ELSE 0.8
            END,
            'en',
            article_record.date_published
        )
        ON CONFLICT (source_type, source_id) DO UPDATE SET
            title = EXCLUDED.title,
            content = EXCLUDED.content,
            content_freshness_score = EXCLUDED.content_freshness_score,
            updated_at = NOW();

        chunk_count := chunk_count + 1;
    END LOOP;

    RETURN chunk_count;
END;
$$ LANGUAGE plpgsql;

-- Function: search_knowledge_chunks (basic vector search)
CREATE OR REPLACE FUNCTION search_knowledge_chunks(
    query_embedding vector(1536),
    match_threshold FLOAT DEFAULT 0.7,
    match_count INTEGER DEFAULT 10,
    filter_category TEXT DEFAULT NULL,
    filter_age_range TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    source_type TEXT,
    source_id UUID,
    source_slug TEXT,
    title TEXT,
    content TEXT,
    summary TEXT,
    category TEXT,
    age_range TEXT[],
    similarity FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        kc.id,
        kc.source_type,
        kc.source_id,
        kc.source_slug,
        kc.title,
        kc.content,
        kc.summary,
        kc.category,
        kc.age_range,
        1 - (kc.embedding <=> query_embedding) AS similarity
    FROM knowledge_chunks kc
    WHERE
        kc.status = 'published'
        AND kc.embedding IS NOT NULL
        AND 1 - (kc.embedding <=> query_embedding) > match_threshold
        AND (filter_category IS NULL OR kc.category = filter_category)
        AND (filter_age_range IS NULL OR filter_age_range = ANY(kc.age_range))
    ORDER BY kc.embedding <=> query_embedding
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- Success message
SELECT 'Step 2 Complete: All indexes and basic functions created!' as message;
