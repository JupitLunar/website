-- Step 5: Fix hybrid search function to match expected return type

DROP FUNCTION IF EXISTS hybrid_search_chunks(TEXT, vector(1536), FLOAT, INTEGER, TEXT, TEXT, TEXT, BOOLEAN, BOOLEAN, FLOAT);

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
    age_range TEXT[],
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
            kc.age_range,
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
            vm.age_range,
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
        c.age_range,
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

-- Test the function
SELECT 'Step 5 Complete: Hybrid search function fixed!' as message;

-- Show sample test (with dummy embedding)
SELECT id, title, category, similarity, final_score
FROM hybrid_search_chunks(
  'feeding',
  array_fill(0::float, ARRAY[1536])::vector(1536),
  0.0,
  5
)
LIMIT 5;
