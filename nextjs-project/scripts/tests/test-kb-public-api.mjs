#!/usr/bin/env node

import path from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

import { FAQ_DATA } from '../../src/lib/faq-catalog.ts';
import { TOPIC_CATALOG } from '../../src/lib/topic-catalog.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const baseUrl = process.env.KB_TEST_BASE_URL || 'http://localhost:3000';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials for KB API test.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function getJson(url) {
  const response = await fetch(url);
  const json = await response.json();
  if (!response.ok) {
    throw new Error(`${url} -> ${response.status} ${JSON.stringify(json)}`);
  }
  return json;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function getPublishedCount(table) {
  const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true }).eq('status', 'published');
  if (error) throw error;
  return count || 0;
}

async function main() {
  console.log(`🔎 Testing KB public API against ${baseUrl}`);

  const [rulesCount, foodsCount, guidesCount] = await Promise.all([
    getPublishedCount('kb_rules'),
    getPublishedCount('kb_foods'),
    getPublishedCount('kb_guides'),
  ]);

  const index = await getJson(`${baseUrl}/api/kb`);
  assert(index.name === 'Mom AI Agent Knowledge Base API', 'KB index name mismatch');
  assert(Array.isArray(index.surfaces) && index.surfaces.includes('faqs'), 'KB index surfaces missing faqs');

  const [feed, foods, guides, topics, topic, faqs, feverFaqs] = await Promise.all([
    getJson(`${baseUrl}/api/kb/feed?format=json&limit=500`),
    getJson(`${baseUrl}/api/kb/foods`),
    getJson(`${baseUrl}/api/kb/guides`),
    getJson(`${baseUrl}/api/kb/topics`),
    getJson(`${baseUrl}/api/kb/topics?slug=feeding-foundations`),
    getJson(`${baseUrl}/api/kb/faqs?limit=100`),
    getJson(`${baseUrl}/api/kb/faqs?query=fever&limit=10`),
  ]);

  assert(feed.count === rulesCount + foodsCount + guidesCount, `Feed count mismatch: expected ${rulesCount + foodsCount + guidesCount}, got ${feed.count}`);
  assert(Array.isArray(foods.data) && foods.data.length === foodsCount, `Foods count mismatch: expected ${foodsCount}, got ${foods.data?.length}`);
  assert(Array.isArray(guides.data) && guides.data.length === guidesCount, `Guides count mismatch: expected ${guidesCount}, got ${guides.data?.length}`);

  assert(topics.count === TOPIC_CATALOG.length, `Topics count mismatch: expected ${TOPIC_CATALOG.length}, got ${topics.count}`);
  assert(topic.data.slug === 'feeding-foundations', 'Topic slug endpoint returned the wrong topic');

  if (faqs.source === 'supabase') {
    assert(faqs.table_status === 'present', 'FAQ API reports supabase without present table status');
    assert(Array.isArray(faqs.data) && faqs.data.length > 0, 'FAQ API returned no DB rows');
  } else {
    assert(faqs.source === 'static-fallback', 'FAQ API should report either supabase or static-fallback');
    assert(faqs.table_status === 'missing', 'Static FAQ fallback should report missing table status');
    assert(faqs.count === FAQ_DATA.length, `Static FAQ fallback count mismatch: expected ${FAQ_DATA.length}, got ${faqs.count}`);
  }

  const feverQuestions = (feverFaqs.data || []).map((item) => item.question.toLowerCase());
  assert(feverQuestions.some((question) => question.includes('fever dangerous')), 'Fever FAQ query did not return the danger-threshold FAQ');

  console.log('✅ KB index, feed, foods, guides, topics, and FAQ surfaces passed validation.');
  console.log(`   Published DB counts -> rules: ${rulesCount}, foods: ${foodsCount}, guides: ${guidesCount}`);
  console.log(`   FAQ source -> ${faqs.source}`);
}

main().catch((error) => {
  console.error(`❌ KB public API test failed: ${error.message}`);
  process.exit(1);
});
