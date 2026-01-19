---
description: Run the global medical content scraper manually to fetch and validate new articles from authoritative sources
---

# Medical Content Scraper Workflow

This workflow allows you to manually trigger the medical content scraper to find, validate, and save new articles from configured authoritative sources (AAP, CDC, NHS, etc.) to the database.

## Step 1: Verification & Setup

First, we ensure the environment is correctly configured for local execution.

1. **Check Environment Variables**
   - Verify that `.env.local` exists.
   - Ensure `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are defined.

## Step 2: Run the Scraper

We will run the global auto-scraper script. This script:
- Loads source configurations from `global-sources-config.js`
- Discovers articles from 18+ sources
- Checks for duplicates in the Supabase database
- Scrapes and sanitizes content for new articles
- Saves valid articles to the database

2. **Execute Scraper**
   - Run: `node scripts/scrapers/global-auto-scraper.js`

## Step 3: Verify Results

After the scraper completes, we run a statistics check to summarize the current state of the database.

3. **Check Statistics**
   - Run: `node scripts/scrapers/scraper-stats.js`

4. **Optional: Check Latest Articles**
   - Run the following command to see the most recently added scraped articles:
   ```bash
   node -e "
   const { createClient } = require('@supabase/supabase-js');
   require('dotenv').config({ path: '.env.local' });
   const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
   (async () => {
     const { data } = await supabase.from('articles').select('title, license, created_at').order('created_at', { ascending: false }).limit(5);
     console.log('Recent Articles:');
     console.table(data);
   })();
   "
   ```
