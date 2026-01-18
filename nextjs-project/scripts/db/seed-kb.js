#!/usr/bin/env node

/**
 * Knowledge base seed script
 * Inserts or updates sources, rules, foods, and guides using the seed JSON file.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const seedFile = path.resolve(__dirname, '../supabase/seed/knowledge_base.json');

if (!fs.existsSync(seedFile)) {
  console.error(`❌ Seed file not found: ${seedFile}`);
  process.exit(1);
}

const payload = JSON.parse(fs.readFileSync(seedFile, 'utf8'));

async function upsert(table, rows, options = {}) {
  if (!rows || rows.length === 0) return;
  const { error } = await supabase.from(table).upsert(rows, options);
  if (error) {
    throw new Error(`${table} upsert failed: ${error.message}`);
  }
  console.log(`✅ ${table}: ${rows.length} records upserted`);
}

(async () => {
  try {
    console.log('🚀 Seeding knowledge base data...');

    await upsert('kb_sources', payload.sources, { onConflict: 'id' });
    await upsert('kb_rules', payload.rules, { onConflict: 'slug' });
    await upsert('kb_foods', payload.foods, { onConflict: 'slug' });
    await upsert('kb_guides', payload.guides, { onConflict: 'slug' });

    console.log('\n🎉 Knowledge base seed completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error(`💥 Seed failed: ${error.message}`);
    process.exit(1);
  }
})();
