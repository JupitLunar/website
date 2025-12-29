-- Add article_source field to distinguish AI-generated articles from authoritative articles
-- Run this migration in Supabase SQL Editor

-- Add article_source column
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS article_source TEXT DEFAULT 'authoritative' 
CHECK (article_source IN ('authoritative', 'ai_generated'));

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_articles_source ON articles(article_source);

-- Update existing articles to be authoritative (default)
UPDATE articles 
SET article_source = 'authoritative' 
WHERE article_source IS NULL;

-- Add comment
COMMENT ON COLUMN articles.article_source IS 'Source of the article: authoritative (from trusted sources) or ai_generated (AI-generated content)';
