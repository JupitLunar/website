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

async function getJsonWithStatus(url) {
  const response = await fetch(url);
  const json = await response.json();
  return {
    status: response.status,
    json,
  };
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

async function getExpectedEvidenceInsights() {
  const authorityPublishers = [
    'AAP',
    'American Academy of Pediatrics',
    'CDC',
    'Centers for Disease Control and Prevention',
    'WHO',
    'World Health Organization',
    'Health Canada',
    'Canadian Paediatric Society',
    'CPS',
    'NHS',
    'NIH',
    'FDA',
    'ACOG',
    'Raising Children Network',
  ];

  const [{ data: articles, error: articlesError }, { data: citations, error: citationsError }] = await Promise.all([
    supabase
      .from('articles')
      .select('id, slug, title, status, reviewed_by, region, hub, type, last_reviewed')
      .eq('status', 'published'),
    supabase
      .from('citations')
      .select('article_id, publisher, url, title'),
  ]);

  if (articlesError) throw articlesError;
  if (citationsError) throw citationsError;

  const citationMap = new Map();
  for (const citation of citations || []) {
    const entry = citationMap.get(citation.article_id) || { count: 0, publishers: new Set() };
    entry.count += 1;
    if (citation.publisher) entry.publishers.add(citation.publisher);
    citationMap.set(citation.article_id, entry);
  }

  return (articles || [])
    .filter((article) => article.last_reviewed)
    .filter((article) => article.reviewed_by !== 'AI Content Generator')
    .map((article) => {
      const citationInfo = citationMap.get(article.id) || { count: 0, publishers: new Set() };
      const publishers = Array.from(citationInfo.publishers);
      const hasAuthorityPublisher = publishers.some((publisher) =>
        authorityPublishers.some((authority) => publisher.includes(authority))
      );
      return {
        slug: article.slug,
        title: article.title,
        region: article.region,
        hub: article.hub,
        type: article.type,
        citationCount: citationInfo.count,
        hasAuthorityPublisher,
      };
    })
    .filter((article) => article.citationCount >= 2 && article.hasAuthorityPublisher)
    .sort((a, b) => a.title.localeCompare(b.title));
}

async function main() {
  console.log(`🔎 Testing KB public API against ${baseUrl}`);

  const [rulesCount, foodsCount, guidesCount, expectedInsights] = await Promise.all([
    getPublishedCount('kb_rules'),
    getPublishedCount('kb_foods'),
    getPublishedCount('kb_guides'),
    getExpectedEvidenceInsights(),
  ]);
  const sampleInsights = expectedInsights.filter((article) => /^[A-Za-z0-9]/.test(article.title)).slice(0, 3);
  const sampleInsight = sampleInsights[0];
  assert(sampleInsight, 'Expected at least one evidence-qualified insight article');
  assert(sampleInsights.length >= 3, 'Expected at least three evidence-qualified insight articles for query regression cases');

  const index = await getJson(`${baseUrl}/api/kb`);
  assert(index.name === 'Mom AI Agent Knowledge Base API', 'KB index name mismatch');
  assert(Array.isArray(index.surfaces) && index.surfaces.includes('faqs'), 'KB index surfaces missing faqs');
  assert(Array.isArray(index.surfaces) && index.surfaces.includes('query'), 'KB index surfaces missing query');
  assert(Array.isArray(index.surfaces) && index.surfaces.includes('insights'), 'KB index surfaces missing insights');

  const [feed, foods, guides, guideDetail, rules, ruleDetail, topics, topic, foodDetail, faqs, feverFaqs, query, insights, insightDetail, localeInsights, filteredInsights, invalidInsightsLocale, invalidInsightsType, missingQueryError, noMatchQuery] = await Promise.all([
    getJson(`${baseUrl}/api/kb/feed?format=json&limit=500`),
    getJson(`${baseUrl}/api/kb/foods`),
    getJson(`${baseUrl}/api/kb/guides`),
    getJson(`${baseUrl}/api/kb/guides?slug=starting-solids-framework`),
    getJson(`${baseUrl}/api/kb/rules`),
    getJson(`${baseUrl}/api/kb/rules?slug=no-honey-before-12-months`),
    getJson(`${baseUrl}/api/kb/topics`),
    getJson(`${baseUrl}/api/kb/topics?slug=feeding-foundations`),
    getJson(`${baseUrl}/api/kb/foods?slug=avocado`),
    getJson(`${baseUrl}/api/kb/faqs?limit=100`),
    getJson(`${baseUrl}/api/kb/faqs?query=fever&limit=10`),
    getJson(`${baseUrl}/api/kb/query?q=when is a baby fever dangerous&locale=US&limit=3`),
    getJson(`${baseUrl}/api/kb/insights?limit=500`),
    getJson(`${baseUrl}/api/kb/insights?slug=${encodeURIComponent(sampleInsight.slug)}`),
    getJson(`${baseUrl}/api/kb/insights?locale=US&limit=500`),
    getJson(`${baseUrl}/api/kb/insights?hub=${encodeURIComponent(sampleInsight.hub)}&type=${encodeURIComponent(sampleInsight.type)}&query=${encodeURIComponent(sampleInsight.title)}&limit=20`),
    getJsonWithStatus(`${baseUrl}/api/kb/insights?locale=Mars`),
    getJsonWithStatus(`${baseUrl}/api/kb/insights?type=essay`),
    getJsonWithStatus(`${baseUrl}/api/kb/query`),
    getJson(`${baseUrl}/api/kb/query?q=zzqvunlikelytopicmatch&limit=3`),
  ]);

  const insightListQuery = await getJson(
    `${baseUrl}/api/kb/insights?query=${encodeURIComponent(sampleInsight.title)}&limit=20`
  );

  assert(feed.count === rulesCount + foodsCount + guidesCount, `Feed count mismatch: expected ${rulesCount + foodsCount + guidesCount}, got ${feed.count}`);
  assert(Array.isArray(foods.data) && foods.data.length === foodsCount, `Foods count mismatch: expected ${foodsCount}, got ${foods.data?.length}`);
  assert(Array.isArray(guides.data) && guides.data.length === guidesCount, `Guides count mismatch: expected ${guidesCount}, got ${guides.data?.length}`);
  assert(Array.isArray(rules.data) && rules.data.length === rulesCount, `Rules count mismatch: expected ${rulesCount}, got ${rules.data?.length}`);
  assert(foodDetail.data.slug === 'avocado', 'Food slug endpoint returned the wrong food');
  assert(guideDetail.data.slug === 'starting-solids-framework', 'Guide slug endpoint returned the wrong guide');
  assert(ruleDetail.data.slug === 'no-honey-before-12-months', 'Rule slug endpoint returned the wrong rule');
  assert(Array.isArray(foodDetail.data.sources), 'Food detail endpoint missing sources');
  assert(Array.isArray(guideDetail.data.sources), 'Guide detail endpoint missing sources');
  assert(Array.isArray(ruleDetail.data.sources), 'Rule detail endpoint missing sources');
  assert(Array.isArray(insights.data), 'Insights endpoint missing data array');
  assert(insights.count === expectedInsights.length, `Insights count mismatch: expected ${expectedInsights.length}, got ${insights.count}`);
  assert(insightDetail.data.slug === sampleInsight.slug, 'Insight slug endpoint returned the wrong article');
  assert(insightDetail.data.citation_count >= 2, 'Insight detail endpoint should expose citation_count >= 2');
  assert(Array.isArray(insightDetail.data.citations) && insightDetail.data.citations.length >= 2, 'Insight detail endpoint missing citations');
  assert(['A', 'B'].includes(insightDetail.data.evidence_level), 'Insight detail endpoint should return evidence level A or B');
  assert(Array.isArray(localeInsights.data), 'Locale-filtered insights endpoint missing data');
  assert(localeInsights.data.every((item) => item.locale === 'US' || item.locale === 'Global'), 'Locale-filtered insights returned invalid locale records');
  assert(Array.isArray(filteredInsights.data) && filteredInsights.data.length > 0, 'Hub/type-filtered insights endpoint should return at least one result');
  assert(filteredInsights.data.every((item) => item.hub === sampleInsight.hub && item.type === sampleInsight.type), 'Hub/type-filtered insights returned out-of-scope items');
  assert(filteredInsights.data.some((item) => item.slug === sampleInsight.slug), 'Hub/type-filtered insights should include the selected evidence article');
  assert(Array.isArray(insightListQuery.data) && insightListQuery.data.length > 0, 'Insights query filter should return at least one result');
  assert(insightListQuery.data.some((item) => item.slug === sampleInsight.slug), 'Insights query filter should include the selected evidence article');
  assert(invalidInsightsLocale.status === 400, 'Insights endpoint should reject invalid locale values');
  assert(/Invalid locale/i.test(invalidInsightsLocale.json.error), 'Insights endpoint invalid locale error message mismatch');
  assert(invalidInsightsType.status === 400, 'Insights endpoint should reject invalid type values');
  assert(/Invalid type/i.test(invalidInsightsType.json.error), 'Insights endpoint invalid type error message mismatch');

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
  assert(query.quick_answer?.kind === 'faq', 'KB query quick answer should resolve to an FAQ for fever danger');
  assert(query.quick_answer?.source_layer === 'Authority guidance', 'KB query quick answer source layer mismatch');
  assert(query.quick_answer?.why_this_applies, 'KB query quick answer should include why_this_applies');
  assert(['high', 'moderate', 'limited'].includes(query.quick_answer?.evidence_strength?.level), 'KB query quick answer should include evidence strength');
  assert(query.quick_answer?.locale_scope, 'KB query quick answer should include locale scope');
  assert(query.quick_answer?.when_to_escalate, 'KB query quick answer should include when_to_escalate guidance');
  assert(['high', 'moderate', 'limited'].includes(query.quick_answer?.confidence), 'KB query quick answer should include confidence');
  assert(query.quick_answer?.review?.status, 'KB query quick answer should include review status');
  assert(['current', 'aging', 'stale', 'unknown'].includes(query.quick_answer?.review?.freshness_label), 'KB query quick answer should include review freshness label');
  assert(['strong', 'moderate', 'weak', 'none'].includes(query.meta?.match_strength), 'KB query should include match strength metadata');
  assert(query.meta?.answer_layer === 'kb', 'KB query fever regression should resolve to KB layer');
  assert(query.llm_fallback === null, 'Strong KB query should not expose llm_fallback');
  assert(['emergency-now', 'same-day-clinician', 'routine-clinician', 'home-guidance-only'].includes(query.safety?.urgency_level), 'KB query should include urgency level');
  assert(Array.isArray(query.safety?.escalation_reason_codes), 'KB query should include escalation reason codes');
  assert(query.safety.escalation_reason_codes.includes('fever-threshold-check'), 'KB query should include fever-threshold-check escalation code');
  assert(query.safety?.message, 'KB query should include safety guidance for fever danger');
  assert(Array.isArray(query.matches?.faqs) && query.matches.faqs.length > 0, 'KB query should return FAQ matches');
  assert(missingQueryError.status === 400, 'KB query should reject requests without q');
  assert(/Missing q/i.test(missingQueryError.json.error), 'KB query missing-q error message mismatch');

  for (const insightCase of sampleInsights) {
    const insightQuery = await getJson(`${baseUrl}/api/kb/query?q=${encodeURIComponent(insightCase.title)}&limit=5`);
    assert(Array.isArray(insightQuery.matches?.insights) && insightQuery.matches.insights.length > 0, `KB query should return insight matches for ${insightCase.slug}`);
    assert(insightQuery.matches.insights.some((item) => item.slug === insightCase.slug), `KB query insight matches should include ${insightCase.slug}`);
    assert(insightQuery.meta?.answer_layer === 'insight-fallback', `KB query should fall back to insight layer for ${insightCase.slug}`);
    assert(insightQuery.quick_answer?.kind === 'insight', `KB query quick answer should resolve to insight for ${insightCase.slug}`);
    assert(insightQuery.quick_answer?.read_more_url?.includes(insightCase.slug), `KB query quick answer should link to ${insightCase.slug}`);
    assert(insightQuery.quick_answer?.evidence_signals?.citation_count >= 2, `KB query quick answer should expose insight citation count for ${insightCase.slug}`);
    assert(['A', 'B', 'C'].includes(insightQuery.quick_answer?.evidence_signals?.evidence_level), `KB query quick answer should expose evidence level for ${insightCase.slug}`);
    assert(Array.isArray(insightQuery.quick_answer?.evidence_signals?.primary_sources) && insightQuery.quick_answer.evidence_signals.primary_sources.length > 0, `KB query quick answer should expose primary sources for ${insightCase.slug}`);
    assert(insightQuery.quick_answer?.why_this_applies, `KB query quick answer should explain why the insight applies for ${insightCase.slug}`);
    assert(['high', 'moderate', 'limited'].includes(insightQuery.quick_answer?.confidence), `KB query quick answer should include confidence for ${insightCase.slug}`);
    assert(insightQuery.quick_answer?.review?.status === 'reviewed', `KB query quick answer should expose reviewed status for ${insightCase.slug}`);
    assert(['current', 'aging', 'stale', 'unknown'].includes(insightQuery.quick_answer?.review?.freshness_label), `KB query quick answer should include freshness label for ${insightCase.slug}`);
    assert(['strong', 'moderate', 'weak'].includes(insightQuery.meta?.match_strength), `KB query should expose match strength for ${insightCase.slug}`);
    assert(insightQuery.llm_fallback === null, `Strong insight fallback query should not expose llm_fallback for ${insightCase.slug}`);
  }

  assert(noMatchQuery.quick_answer === null, 'No-match query should not fabricate a quick answer');
  assert(noMatchQuery.meta?.answer_layer === 'none', 'No-match query should resolve to the none answer layer');
  assert(noMatchQuery.meta?.match_strength === 'none', 'No-match query should expose none match strength');
  assert(noMatchQuery.llm_fallback?.eligible === true, 'No-match query should expose llm_fallback eligibility');
  assert(noMatchQuery.llm_fallback?.used === false, 'No-match query llm_fallback should be metadata only');
  assert(noMatchQuery.llm_fallback?.not_source_linked === true, 'No-match query llm_fallback should be explicitly non-source-linked');
  assert(/exploratory guidance only/i.test(noMatchQuery.llm_fallback?.label || ''), 'No-match query llm_fallback label mismatch');
  assert(Array.isArray(noMatchQuery.llm_fallback?.verify_with) && noMatchQuery.llm_fallback.verify_with.includes('clinician'), 'No-match query llm_fallback verify_with should include clinician');

  console.log('✅ KB index, query, feed, rules, guides, foods, topics, FAQ, and insights surfaces passed validation.');
  console.log(`   Published DB counts -> rules: ${rulesCount}, foods: ${foodsCount}, guides: ${guidesCount}, insights: ${expectedInsights.length}`);
  console.log(`   Insight query regression cases -> ${sampleInsights.map((item) => item.slug).join(', ')}`);
  console.log(`   FAQ source -> ${faqs.source}`);
}

main().catch((error) => {
  console.error(`❌ KB public API test failed: ${error.message}`);
  process.exit(1);
});
