-- Step 4: Populate knowledge chunks from existing KB tables

-- Enhanced populate function
CREATE OR REPLACE FUNCTION populate_knowledge_chunks()
RETURNS INTEGER AS $$
DECLARE
    chunk_count INTEGER := 0;
    rule_record RECORD;
    food_record RECORD;
    guide_record RECORD;
BEGIN
    -- Populate from kb_rules
    FOR rule_record IN
        SELECT id, slug, title, summary, why, category, risk_level, last_reviewed_at, status
        FROM kb_rules
        WHERE status = 'published'
    LOOP
        INSERT INTO knowledge_chunks (
            source_type, source_id, source_slug, title, content, summary,
            category, risk_level, last_reviewed_at, status,
            content_freshness_score, priority
        ) VALUES (
            'kb_rule', rule_record.id, rule_record.slug,
            rule_record.title,
            COALESCE(rule_record.why, rule_record.summary),
            rule_record.summary,
            rule_record.category,
            rule_record.risk_level,
            rule_record.last_reviewed_at,
            rule_record.status,
            0.9, -- Rules are generally evergreen
            CASE rule_record.risk_level
                WHEN 'high' THEN 200
                WHEN 'medium' THEN 150
                ELSE 100
            END
        )
        ON CONFLICT (source_type, source_id) DO UPDATE SET
            title = EXCLUDED.title,
            content = EXCLUDED.content,
            updated_at = NOW();

        chunk_count := chunk_count + 1;
    END LOOP;

    -- Populate from kb_foods
    FOR food_record IN
        SELECT id, slug, name, why, portion_hint, age_range, risk_level, nutrients_focus, last_reviewed_at, status
        FROM kb_foods
        WHERE status = 'published'
    LOOP
        INSERT INTO knowledge_chunks (
            source_type, source_id, source_slug, title, content, summary,
            category, age_range, risk_level, tags, last_reviewed_at, status,
            content_freshness_score
        ) VALUES (
            'kb_food', food_record.id, food_record.slug,
            food_record.name,
            COALESCE(food_record.why, food_record.portion_hint),
            food_record.portion_hint,
            'feeding',
            food_record.age_range,
            food_record.risk_level,
            food_record.nutrients_focus,
            food_record.last_reviewed_at,
            food_record.status,
            0.85
        )
        ON CONFLICT (source_type, source_id) DO UPDATE SET
            title = EXCLUDED.title,
            content = EXCLUDED.content,
            updated_at = NOW();

        chunk_count := chunk_count + 1;
    END LOOP;

    -- Populate from kb_guides
    FOR guide_record IN
        SELECT id, slug, title, summary, body_md, guide_type, age_range, last_reviewed_at, status
        FROM kb_guides
        WHERE status = 'published'
    LOOP
        INSERT INTO knowledge_chunks (
            source_type, source_id, source_slug, title, content, summary,
            category, age_range, last_reviewed_at, status,
            content_freshness_score
        ) VALUES (
            'kb_guide', guide_record.id, guide_record.slug,
            guide_record.title,
            COALESCE(guide_record.body_md, guide_record.summary),
            guide_record.summary,
            guide_record.guide_type,
            guide_record.age_range,
            guide_record.last_reviewed_at,
            guide_record.status,
            0.9
        )
        ON CONFLICT (source_type, source_id) DO UPDATE SET
            title = EXCLUDED.title,
            content = EXCLUDED.content,
            updated_at = NOW();

        chunk_count := chunk_count + 1;
    END LOOP;

    RETURN chunk_count;
END;
$$ LANGUAGE plpgsql;

-- Run the population
SELECT populate_knowledge_chunks() as chunks_populated;

-- Check the results
SELECT
    source_type,
    COUNT(*) as count,
    COUNT(embedding) as with_embeddings
FROM knowledge_chunks
WHERE status = 'published'
GROUP BY source_type
ORDER BY count DESC;
