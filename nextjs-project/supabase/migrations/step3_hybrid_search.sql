-- Step 3: Create Hybrid Search Function
-- This is the core of the optimized RAG system

-- Hybrid search function combining vector similarity, keyword matching, freshness, and quality
CREATE OR REPLACE FUNCTION hybrid_search_chunks(
    query_text TEXT,
    query_embedding vector(1536),
    match_threshold FLOAT DEFAULT 0.7,
    match_count INTEGER DEFAULT 10,
    filter_category TEXT DEFAULT NULL,
    filter_locale TEXT DEFAULT NULL,
    filter_source_type TEXT DEFAULT NULL,
    include_expired BOOLEAN DEFAULT false,
    boost_recent BOOLEAN DEFAULT true,
    min_freshness FLOAT DEFAULT 0.0
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
    similarity FLOAT,
    keyword_score FLOAT,
    freshness_score FLOAT,
    quality_score FLOAT,
    final_score FLOAT
) AS $$
BEGIN
    RETURN QUERY
    WITH vector_matches AS (
        SELECT
            kc.id,
            kc.source_type,
            kc.source_id,
            kc.source_slug,
            kc.title,
            kc.content,
            kc.summary,
            kc.category,
            kc.created_at,
            kc.content_freshness_score,
            1 - (kc.embedding <=> query_embedding) AS similarity
        FROM knowledge_chunks kc
        WHERE kc.status = 'published'
          AND kc.embedding IS NOT NULL
          AND (filter_category IS NULL OR kc.category = filter_category)
          AND (filter_locale IS NULL OR kc.locale = filter_locale)
          AND (filter_source_type IS NULL OR kc.source_type = filter_source_type)
          AND (include_expired OR kc.expires_at IS NULL OR kc.expires_at > CURRENT_DATE)
          AND (kc.content_freshness_score >= min_freshness)
    ),
    keyword_matches AS (
        SELECT
            kc.id,
            -- Simple keyword matching score
            CASE
                WHEN kc.title ILIKE '%' || query_text || '%' THEN 0.5
                WHEN kc.content ILIKE '%' || query_text || '%' THEN 0.3
                ELSE 0.0
            END AS keyword_score
        FROM knowledge_chunks kc
        WHERE kc.title ILIKE '%' || query_text || '%'
           OR kc.content ILIKE '%' || query_text || '%'
    ),
    quality_metrics AS (
        SELECT
            cqm.chunk_id,
            (COALESCE(cqm.accuracy_score, 0.5) +
             COALESCE(cqm.completeness_score, 0.5) +
             COALESCE(cqm.readability_score, 0.5)) / 3.0 AS avg_quality
        FROM content_quality_metrics cqm
    ),
    combined AS (
        SELECT
            vm.id,
            vm.source_type,
            vm.source_id,
            vm.source_slug,
            vm.title,
            vm.content,
            vm.summary,
            vm.category,
            vm.similarity,
            COALESCE(km.keyword_score, 0.0) AS keyword_score,
            CASE
                WHEN boost_recent THEN
                    vm.content_freshness_score * (1.0 / (1.0 + EXTRACT(EPOCH FROM (NOW() - vm.created_at)) / 2592000.0))
                ELSE vm.content_freshness_score
            END AS freshness_score,
            COALESCE(qm.avg_quality, 0.5) AS quality_score
        FROM vector_matches vm
        LEFT JOIN keyword_matches km ON vm.id = km.id
        LEFT JOIN quality_metrics qm ON vm.id = qm.chunk_id
    )
    SELECT
        c.id,
        c.source_type,
        c.source_id,
        c.source_slug,
        c.title,
        c.content,
        c.summary,
        c.category,
        c.similarity,
        c.keyword_score,
        c.freshness_score,
        c.quality_score,
        (c.similarity * 0.5 +
         c.keyword_score * 0.2 +
         c.freshness_score * 0.15 +
         c.quality_score * 0.15) AS final_score
    FROM combined c
    WHERE c.similarity > match_threshold
    ORDER BY final_score DESC
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- Helper functions for maintenance

-- Update content freshness scores
CREATE OR REPLACE FUNCTION update_content_freshness_scores()
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER := 0;
BEGIN
    UPDATE knowledge_chunks
    SET
        content_freshness_score = GREATEST(0.1,
            1.0 / (1.0 + (EXTRACT(EPOCH FROM (NOW() - created_at)) / 7776000.0) * decay_rate)
        ),
        updated_at = NOW()
    WHERE status = 'published'
      AND decay_rate > 0;

    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Auto-archive expired content
CREATE OR REPLACE FUNCTION auto_archive_expired_content()
RETURNS INTEGER AS $$
DECLARE
    archived_count INTEGER := 0;
BEGIN
    UPDATE knowledge_chunks
    SET
        status = 'archived',
        updated_at = NOW()
    WHERE status = 'published'
      AND expires_at IS NOT NULL
      AND expires_at < CURRENT_DATE;

    GET DIAGNOSTICS archived_count = ROW_COUNT;
    RETURN archived_count;
END;
$$ LANGUAGE plpgsql;

-- Get quality metrics summary
CREATE OR REPLACE FUNCTION get_quality_metrics_summary()
RETURNS TABLE (
    total_chunks BIGINT,
    avg_accuracy FLOAT,
    avg_completeness FLOAT,
    avg_readability FLOAT,
    total_retrievals BIGINT,
    avg_positive_feedback_rate FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(DISTINCT cqm.chunk_id)::BIGINT,
        AVG(cqm.accuracy_score)::FLOAT,
        AVG(cqm.completeness_score)::FLOAT,
        AVG(cqm.readability_score)::FLOAT,
        SUM(cqm.retrieval_count)::BIGINT,
        AVG(CASE
            WHEN (cqm.positive_feedback + cqm.negative_feedback) > 0
            THEN cqm.positive_feedback::FLOAT / (cqm.positive_feedback + cqm.negative_feedback)
            ELSE 0
        END)::FLOAT
    FROM content_quality_metrics cqm;
END;
$$ LANGUAGE plpgsql;

-- Success message
SELECT 'Step 3 Complete: Hybrid search and helper functions created!' as message;
