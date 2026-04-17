#!/usr/bin/env node

import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

import { FAQ_DATA } from '../../src/lib/faq-catalog.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.momaiagent.com').replace(/\/$/, '');

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const CATEGORY_MAP = {
  'Platform & Trust': 'platform-trust',
  Feeding: 'feeding',
  Sleep: 'sleep',
  'Fever & Safety': 'fever-safety',
  Postpartum: 'postpartum',
  Nutrition: 'nutrition',
};

const TOPIC_MAP = {
  'Platform & Trust': [],
  Feeding: ['feeding-foundations', 'allergen-readiness'],
  Sleep: ['north-america-overview'],
  'Fever & Safety': ['safety-and-hygiene'],
  Postpartum: ['north-america-overview'],
  Nutrition: ['nutrient-priorities'],
};

function slugifyQuestion(question) {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function normalizeSourceUrl(url) {
  return url.startsWith('http') ? url : `${siteUrl}${url}`;
}

function sourceOrganization(label) {
  const [prefix] = label.split(':');
  return prefix || 'Mom AI Agent';
}

async function ensureFAQTable() {
  const { error } = await supabase.from('kb_faqs').select('id').limit(1);
  if (error) {
    if (error.code === '42P01') {
      throw new Error(`kb_faqs table does not exist on the remote Supabase project. Run SQL first: ${path.resolve(__dirname, '../../supabase/add_kb_faqs_table.sql')}`);
    }
    throw new Error(error.message || JSON.stringify(error));
  }
}

async function upsertSources() {
  const desiredSources = FAQ_DATA.filter((item) => item.sourceKind === 'authority').map((item) => ({
    name: item.sourceLabel,
    organization: sourceOrganization(item.sourceLabel),
    url: item.sourceUrl,
    grade: 'A',
    retrieved_at: new Date().toISOString().slice(0, 10),
    notes: 'Added from the Mom AI Agent FAQ catalog for read-only knowledge API support.',
  }));

  if (desiredSources.length === 0) {
    return new Map();
  }

  const urls = desiredSources.map((row) => row.url);
  const { data, error } = await supabase.from('kb_sources').select('id,url').in('url', urls);
  if (error) throw error;

  const sourceMap = new Map((data || []).map((row) => [row.url, row.id]));
  const missing = desiredSources.filter((row) => !sourceMap.has(row.url));

  if (missing.length > 0) {
    const insertRows = missing.map((row) => ({ id: crypto.randomUUID(), ...row }));
    const { error: insertError } = await supabase.from('kb_sources').insert(insertRows);
    if (insertError) throw insertError;

    const { data: inserted, error: insertedError } = await supabase.from('kb_sources').select('id,url').in('url', missing.map((row) => row.url));
    if (insertedError) throw insertedError;
    (inserted || []).forEach((row) => sourceMap.set(row.url, row.id));
  }

  return sourceMap;
}

async function syncFAQs() {
  await ensureFAQTable();
  const sourceMap = await upsertSources();

  const faqRows = FAQ_DATA.map((item, index) => ({
    slug: slugifyQuestion(item.question),
    question: item.question,
    answer: item.answer,
    category: CATEGORY_MAP[item.category],
    subcategory: null,
    age_range: [],
    locale: 'Global',
    source_layer: item.sourceLayer,
    source_kind: item.sourceKind,
    source_label: item.sourceLabel,
    source_url: normalizeSourceUrl(item.sourceUrl),
    source_ids: item.sourceKind === 'authority' ? [sourceMap.get(item.sourceUrl)].filter(Boolean) : [],
    related_food_ids: [],
    related_rule_ids: [],
    related_guide_ids: [],
    related_topic_slugs: TOPIC_MAP[item.category] || [],
    priority: index + 1,
    status: 'published',
    last_reviewed_at: new Date().toISOString().slice(0, 10),
  }));

  const { error } = await supabase.from('kb_faqs').upsert(faqRows, { onConflict: 'slug' });
  if (error) throw error;

  console.log(`✅ Synced ${faqRows.length} FAQs into kb_faqs`);
}

syncFAQs()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(`❌ FAQ sync failed: ${error?.message || JSON.stringify(error)}`);
    process.exit(1);
  });
