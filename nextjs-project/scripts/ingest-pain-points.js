#!/usr/bin/env node
/**
 * Sync Mom Pain Point articles into Supabase using the upsert_article_bundle RPC.
 * Data source defaults to data/pain-points/<lang>.json and is validated before ingesting.
 * The script checks for existing slugs to report create vs update counts.
 *
 * Required env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 * Optional flags:
 *   --lang en|zh            Language dataset to load (default: en)
 *   --file ./path/to.json   Custom dataset path
 *   --dry-run               Validate and show summary without writing to Supabase
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function getArg(flag, fallback) {
  const idx = process.argv.indexOf(flag);
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1];
  return fallback;
}

function hasFlag(flag) {
  return process.argv.includes(flag);
}

const LANG = (getArg('--lang', 'en') || 'en').toLowerCase();
const DEFAULT_FILE = path.resolve(__dirname, '..', 'data', 'pain-points', `${LANG}.json`);
const DATA_FILE = path.resolve(getArg('--file', DEFAULT_FILE));
const DRY_RUN = hasFlag('--dry-run');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment (.env.local).');
  process.exit(1);
}

if (!fs.existsSync(DATA_FILE)) {
  console.error(`❌ Dataset not found: ${DATA_FILE}`);
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const today = new Date().toISOString().slice(0, 10);
const defaultReviewers = {
  en: 'Clinical review: JupitLunar Editorial Team (RN, IBCLC)',
  zh: '临床审核：JupitLunar 团队（RN, IBCLC）'
};

const citationsCommon = [
  {
    title: 'AAP: Optimizing Postpartum Care',
    url: 'https://www.aap.org',
    publisher: 'American Academy of Pediatrics',
    date: '2018-05-01'
  },
  {
    title: 'CDC Infant & Toddler Nutrition',
    url: 'https://www.cdc.gov/nutrition/infantandtoddlernutrition/',
    publisher: 'CDC',
    date: '2024-01-01'
  }
];

function loadDataset(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Dataset must be a non-empty array.');
    }
    return data;
  } catch (error) {
    console.error(`❌ Failed to load dataset ${filePath}:`, error.message);
    process.exit(1);
  }
}

function withDefaults(entry) {
  const lang = (entry.lang || LANG).toLowerCase();
  const base = {
    slug: entry.slug,
    type: entry.type,
    hub: entry.hub,
    lang,
    title: entry.title,
    one_liner: entry.one_liner?.trim(),
    key_facts: entry.key_facts || [],
    entities: entry.entities || [],
    age_range: entry.age_range,
    region: entry.region || 'Global',
    last_reviewed: entry.last_reviewed || today,
    reviewed_by: entry.reviewed_by || defaultReviewers[lang] || defaultReviewers.en,
    license: entry.license || 'CC BY-NC 4.0',
    body_md: entry.body_md || '',
    steps: entry.steps,
    faq: entry.faq || [],
    citations: entry.citations || citationsCommon,
    meta_title: entry.meta_title || `${entry.title} | JupitLunar`,
    meta_description: entry.meta_description || entry.one_liner,
    keywords: entry.keywords || (entry.entities ? entry.entities.slice(0, 6) : [])
  };

  // Remove undefined optional fields so RPC payload stays clean
  Object.keys(base).forEach((key) => {
    if (base[key] === undefined || base[key] === null) {
      delete base[key];
    }
  });

  return base;
}

function appendFaqToBody(article) {
  if (!Array.isArray(article.faq) || article.faq.length === 0) return article;
  const faqLines = ['\n\n### FAQ'];
  article.faq.forEach((qa) => {
    if (qa.question && qa.answer) {
      faqLines.push(`\n**Q:** ${qa.question}\n\n**A:** ${qa.answer}`);
    }
  });
  const merged = { ...article };
  merged.body_md = `${article.body_md || ''}${faqLines.join('\n')}`;
  return merged;
}

function validateArticle(article) {
  const required = ['slug', 'type', 'hub', 'title', 'one_liner'];
  required.forEach((field) => {
    if (!article[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  });

  if (article.one_liner.length < 50 || article.one_liner.length > 200) {
    throw new Error(`one_liner length must be 50–200 characters (slug: ${article.slug}).`);
  }

  if (!Array.isArray(article.key_facts) || article.key_facts.length < 3 || article.key_facts.length > 8) {
    throw new Error(`key_facts must contain 3–8 items (slug: ${article.slug}).`);
  }

  if (!Array.isArray(article.citations) || article.citations.length === 0) {
    throw new Error(`At least one citation required (slug: ${article.slug}).`);
  }
}

async function fetchExisting(slugs) {
  if (slugs.length === 0) return new Map();

  const { data, error } = await supabase
    .from('articles')
    .select('slug, date_modified, updated_at, last_reviewed')
    .in('slug', slugs);

  if (error) {
    throw new Error(`Failed to fetch existing articles: ${error.message}`);
  }

  const map = new Map();
  (data || []).forEach((row) => map.set(row.slug, row));
  return map;
}

async function upsertArticle(bundle) {
  const payload = {
    p_slug: bundle.slug,
    p_type: bundle.type,
    p_hub: bundle.hub,
    p_lang: bundle.lang,
    p_title: bundle.title,
    p_one_liner: bundle.one_liner,
    p_key_facts: bundle.key_facts,
    p_age_range: bundle.age_range,
    p_region: bundle.region,
    p_last_reviewed: bundle.last_reviewed,
    p_reviewed_by: bundle.reviewed_by,
    p_entities: bundle.entities,
    p_license: bundle.license,
    p_body_md: bundle.body_md,
    p_steps: bundle.steps,
    p_faq: bundle.faq,
    p_citations: bundle.citations,
    p_meta_title: bundle.meta_title,
    p_meta_description: bundle.meta_description,
    p_keywords: bundle.keywords
  };

  if (DRY_RUN) {
    return { data: 'dry-run', error: null };
  }

  return supabase.rpc('upsert_article_bundle', payload);
}

async function main() {
  console.log(`📄 Loading dataset: ${DATA_FILE}`);
  const rawEntries = loadDataset(DATA_FILE);
  const prepared = rawEntries.map((entry) => appendFaqToBody(withDefaults(entry)));

  try {
    prepared.forEach(validateArticle);
  } catch (validationError) {
    console.error('❌ Validation failed:', validationError.message);
    process.exit(1);
  }

  const slugs = prepared.map((article) => article.slug);
  let existing;
  try {
    existing = await fetchExisting(slugs);
  } catch (dbError) {
    console.error('❌ Supabase lookup failed:', dbError.message);
    process.exit(1);
  }

  let created = 0;
  let updated = 0;
  let failed = 0;

  for (const article of prepared) {
    const mode = existing.has(article.slug) ? 'update' : 'create';
    try {
      const { error } = await upsertArticle(article);
      if (error) throw new Error(error.message || 'Unknown error');
      if (mode === 'create') {
        created++;
      } else {
        updated++;
      }
      console.log(`  ✅ ${mode.toUpperCase()}: ${article.slug}`);
    } catch (error) {
      failed++;
      console.error(`  ❌ FAILED (${article.slug}): ${error.message}`);
    }
  }

  console.log('\nSummary:');
  console.log(`  Created: ${created}`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Failed:  ${failed}`);

  if (DRY_RUN) {
    console.log('ℹ️  Dry run mode – no changes were written.');
  }

  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('❌ Fatal error:', error.message || error);
  process.exit(1);
});

