# Supabase Setup Guide for JupitLunar GEO Engine

This guide will help you set up the Supabase backend for the JupitLunar GEO Content Engine.

## 🚀 Quick Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `jupitlunar-geo-engine`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

### 2. Get Project Credentials

Once your project is created:

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project-id.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

### 3. Run Database Schema

**Important**: Due to PostgreSQL constraints, we need to run the schema in two steps.

#### Step 1: Initial Setup

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `supabase/init.sql`
3. Paste and run the SQL
4. Verify that all tables are created successfully

#### Step 2: Advanced Features (Optional)

1. In the same SQL Editor, copy the contents of `supabase/advanced.sql`
2. Paste and run the SQL
3. This adds full-text search, triggers, and RPC functions

#### Alternative: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-id

# Run the initial schema
supabase db push --include-all

# Or run individual files
supabase db reset --linked
```

### 4. Configure Environment Variables

Create `.env.local` in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Ingest API Security
INGEST_API_SECRET=generate-a-strong-secret-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3002
NEXT_PUBLIC_APP_NAME=JupitLunar
NEXT_PUBLIC_APP_DESCRIPTION=AI-Powered Health Intelligence for Mom & Baby Wellness
```

## 📊 Database Schema Overview

### Core Tables

#### `content_hubs`
Stores the 6 main content hubs:
- feeding, sleep, mom-health, development, safety, recipes

#### `articles`
Main content storage with GEO-optimized fields:
- `one_liner`: TL;DR (50-200 chars)
- `key_facts`: JSONB array of 3-8 key points
- `entities`: Array of SEO/GEO entities
- `last_reviewed` & `reviewed_by`: E-E-A-T signals

#### `qas`
FAQ content for LLM feeds:
- Question/answer pairs
- Citations as JSONB
- Anchor links for precise referencing

#### `citations`
E-E-A-T signals and references:
- Claim, title, URL, author, publisher
- Links to authoritative sources

#### `how_to_steps` & `recipe_steps`
Structured content for How-To and Recipe articles

### Key Features

#### 1. Atomic Content Ingestion
The `upsert_article_bundle()` RPC function handles:
- Article creation/update
- Related data (steps, FAQ, citations)
- All in a single transaction

#### 2. GEO Optimization
- Full-text search indexes
- Entity-based search
- Structured data support

#### 3. Performance
- Optimized indexes for common queries
- JSONB for flexible data storage
- Triggers for automatic updates

## 🔧 Database Functions

### `upsert_article_bundle()`
Main function for AI content ingestion:

```sql
SELECT upsert_article_bundle(
  'ferber-sleep-training',
  'howto',
  'sleep',
  'en',
  'Ferber Sleep Training Method',
  'Gradual extinction method for teaching babies to self-soothe and sleep independently.',
  '["Start with short intervals", "Consistent bedtime routine", "Monitor progress"]',
  '6-12 months',
  'US',
  '2025-01-15',
  'Dr. Sarah Johnson, Pediatrician',
  '{"sleep training", "Ferber method", "self-soothing"}',
  'CC BY-NC 4.0',
  'Markdown content here...',
  '{"steps": [...]}',
  '{"faq": [...]}',
  '{"citations": [...]}'
);
```

## 🔍 Testing the Setup

### 1. Test Database Connection

Create a test script `test-db.js`:

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('content_hubs')
      .select('*')
      .limit(1);
    
    if (error) throw error;
    console.log('✅ Database connection successful');
    console.log('Content hubs:', data);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

testConnection();
```

### 2. Test Content Ingestion

```javascript
async function testIngestion() {
  try {
    const { data, error } = await supabase.rpc('upsert_article_bundle', {
      p_slug: 'test-article',
      p_type: 'explainer',
      p_hub: 'feeding',
      p_title: 'Test Article',
      p_one_liner: 'This is a test article for verifying the database setup.',
      p_key_facts: ['Fact 1', 'Fact 2', 'Fact 3'],
      p_last_reviewed: '2025-01-15',
      p_reviewed_by: 'Test Reviewer'
    });
    
    if (error) throw error;
    console.log('✅ Content ingestion successful');
    console.log('Article ID:', data);
  } catch (error) {
    console.error('❌ Content ingestion failed:', error);
  }
}

testIngestion();
```

## 🛡️ Security Considerations

### 1. Row Level Security (RLS)

Enable RLS on sensitive tables:

```sql
-- Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE qas ENABLE ROW LEVEL SECURITY;
ALTER TABLE citations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access" ON articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public read access" ON qas
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON citations
  FOR SELECT USING (true);
```

### 2. API Security

- Use `SUPABASE_SERVICE_ROLE_KEY` only on the server
- Implement proper authentication for content ingestion
- Rate limit API endpoints

## 📈 Monitoring

### 1. Database Metrics

Monitor in Supabase Dashboard:
- Query performance
- Storage usage
- Connection count

### 2. Content Metrics

Track in `ingestion_logs`:
- Success/failure rates
- Processing times
- Error patterns

## 🔄 Backup Strategy

### 1. Automated Backups

Supabase provides:
- Daily backups
- Point-in-time recovery
- Cross-region replication

### 2. Content Export

Regular exports for GEO optimization:
- `/api/ai-feed` for AI crawlers
- `/api/llm/answers` for LLM feeds
- Sitemap generation

## 🚀 Next Steps

After setting up Supabase:

1. **Task 2.1**: Implement the ingest API route
2. **Task 2.2**: Create TypeScript types
3. **Task 2.3**: Build data layer functions
4. **Task 2.4**: Test the complete pipeline

## 📞 Support

If you encounter issues:

1. Check Supabase logs in the dashboard
2. Verify environment variables
3. Test database connection
4. Review SQL schema for syntax errors

---

**Note**: Keep your service role key secure and never expose it in client-side code!
