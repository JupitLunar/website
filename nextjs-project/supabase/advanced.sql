-- JupitLunar GEO Content Engine - Advanced Features
-- Run this AFTER running init.sql successfully

-- Add generated columns for full-text search
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

-- Create search indexes
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
