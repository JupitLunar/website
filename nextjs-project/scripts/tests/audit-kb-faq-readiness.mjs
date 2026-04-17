#!/usr/bin/env node

import path from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

async function tableCount(table) {
  const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
  if (error) throw error;
  return count || 0;
}

async function main() {
  console.log('🔎 Auditing KB FAQ readiness in Supabase');

  const [sources, rules, foods, guides] = await Promise.all([
    tableCount('kb_sources'),
    tableCount('kb_rules'),
    tableCount('kb_foods'),
    tableCount('kb_guides'),
  ]);

  console.log(`   kb_sources: ${sources}`);
  console.log(`   kb_rules: ${rules}`);
  console.log(`   kb_foods: ${foods}`);
  console.log(`   kb_guides: ${guides}`);

  const { data, error } = await supabase
    .from('kb_faqs')
    .select('id,slug,question,category,source_layer,source_kind,source_label,source_url,status')
    .limit(5);

  if (error) {
    if (error.code === '42P01') {
      fail('kb_faqs table is missing. Run supabase/add_kb_faqs_table.sql in the remote SQL editor first.');
    }
    fail(`kb_faqs select failed: ${error.message}`);
  }

  console.log(`   kb_faqs: present (${data?.length || 0} sample rows loaded)`);

  const { count: publishedCount, error: publishedError } = await supabase
    .from('kb_faqs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');

  if (publishedError) {
    fail(`kb_faqs published-count failed: ${publishedError.message}`);
  }

  console.log(`   kb_faqs published: ${publishedCount || 0}`);

  if (!publishedCount) {
    fail('kb_faqs exists but has no published rows. Run npm run sync:kb:faqs.');
  }

  const missingSourceFields = (data || []).filter(
    (row) => !row.source_layer || !row.source_kind || !row.source_label || !row.source_url
  );

  if (missingSourceFields.length > 0) {
    fail('kb_faqs rows exist but required source_* fields are missing. Re-run npm run sync:kb:faqs after updating schema.');
  }

  console.log('✅ kb_faqs is present, populated, and has the expected source metadata fields.');
}

main().catch((error) => fail(error.message || String(error)));
