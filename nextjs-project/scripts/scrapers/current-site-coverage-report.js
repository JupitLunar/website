#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const { getAllSources } = require('./global-sources-config');
const {
  discoverArticlesFromSource,
  scrapeArticle
} = require('./global-auto-scraper');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function getArg(flag, fallback) {
  const idx = process.argv.indexOf(flag);
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1];
  return fallback;
}

const argSources = getArg('--sources', '');
const argPriority = (getArg('--priority', '') || '').toUpperCase();
const argProbe = Number.parseInt(getArg('--probe', '6'), 10);
const argOutputBase = getArg('--output', '');
const medicalOnly = process.argv.includes('--medical-only');

const TODAY = new Date().toISOString().slice(0, 10);
const OUTPUT_BASE = argOutputBase || path.resolve(__dirname, `../../docs/current-site-coverage-${TODAY}`);

const PRIORITY_RANK = { P0: 0, P1: 1, P2: 2, P3: 3 };
const MEDICAL_AUTHORITIES = new Set([
  'government',
  'government-regulatory',
  'professional-society',
  'academic-medical-center',
  'government-funded',
  'multilateral',
  'national-child-health-service',
  'nonprofit-health-system'
]);

function normalizeHost(url) {
  if (!url) return '';
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return '';
  }
}

function normalizeUrl(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    parsed.hash = '';
    const removableParams = [];
    parsed.searchParams.forEach((value, key) => {
      if (/^utm_/i.test(key) || /^fbclid$/i.test(key) || /^gclid$/i.test(key) || /^_ga$/i.test(key) || /^_gl$/i.test(key)) {
        removableParams.push(key);
      }
    });
    removableParams.forEach((key) => parsed.searchParams.delete(key));
    if (parsed.pathname.length > 1) {
      parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

function extractUrlFromLicense(license = '') {
  const match = license.match(/URL:\s*(https?:\/\/\S+)/i);
  return match ? normalizeUrl(match[1].trim()) : '';
}

function extractSourceFromLicense(license = '') {
  const match = license.match(/Source:\s*([^|]+?)\s*\|\s*Region:/i);
  return match ? match[1].trim() : '';
}

function safeRatio(numerator, denominator) {
  if (!denominator) return 0;
  return Number(((numerator / denominator) * 100).toFixed(1));
}

function sortByPriorityAndName(a, b) {
  const delta = (PRIORITY_RANK[a.priority] ?? 9) - (PRIORITY_RANK[b.priority] ?? 9);
  if (delta !== 0) return delta;
  return a.name.localeCompare(b.name);
}

function sortBacklog(a, b) {
  if (b.probe.extractableUnique !== a.probe.extractableUnique) {
    return b.probe.extractableUnique - a.probe.extractableUnique;
  }
  const priorityDelta = (PRIORITY_RANK[a.priority] ?? 9) - (PRIORITY_RANK[b.priority] ?? 9);
  if (priorityDelta !== 0) return priorityDelta;
  if (b.remainingCandidates !== a.remainingCandidates) {
    return b.remainingCandidates - a.remainingCandidates;
  }
  return a.sourceKey.localeCompare(b.sourceKey);
}

function makeMarkdownReport(summary) {
  const lines = [];
  lines.push(`# Current Site Coverage Report`);
  lines.push('');
  lines.push(`Generated: ${summary.generatedAt}`);
  lines.push('');
  lines.push(`Targets: ${summary.sources.length}`);
  lines.push(`Total discovered candidates: ${summary.totals.discovered}`);
  lines.push(`Exact URL coverage: ${summary.totals.exactCovered} / ${summary.totals.discovered} (${summary.totals.exactCoverageRate}%)`);
  lines.push(`Recent 24h inserts on target hosts: ${summary.totals.recent24h}`);
  lines.push(`Probe results: ${summary.totals.probeExtractableUnique} extractable unique, ${summary.totals.probeDuplicateTitle} duplicate-title, ${summary.totals.probeExtractionFailed} extraction-failed`);
  lines.push('');
  lines.push(`True-missing backlog sources: ${summary.rankings.trueMissing.length}`);
  lines.push(`Duplicate-dominated sources: ${summary.rankings.duplicateDominated.length}`);
  lines.push(`Extraction-constrained sources: ${summary.rankings.extractionConstrained.length}`);
  lines.push('');

  if (summary.rankings.trueMissing.length > 0) {
    lines.push('## Priority Backlog');
    lines.push('');
    lines.push('| Source | Priority | Remaining | Probe unique | Probe dup-title | Probe fail |');
    lines.push('| --- | --- | ---: | ---: | ---: | ---: |');
    for (const item of summary.rankings.trueMissing) {
      lines.push(`| ${item.sourceKey} | ${item.priority} | ${item.remainingCandidates} | ${item.probe.extractableUnique} | ${item.probe.duplicateTitle} | ${item.probe.extractionFailed} |`);
    }
    lines.push('');
  }

  if (summary.rankings.duplicateDominated.length > 0) {
    lines.push('## Mostly Duplicate Remaining');
    lines.push('');
    for (const item of summary.rankings.duplicateDominated) {
      lines.push(`- ${item.sourceKey}: remaining ${item.remainingCandidates}, probe dup-title ${item.probe.duplicateTitle}/${item.probe.probed}`);
    }
    lines.push('');
  }

  if (summary.rankings.extractionConstrained.length > 0) {
    lines.push('## Extraction Constraints');
    lines.push('');
    for (const item of summary.rankings.extractionConstrained) {
      lines.push(`- ${item.sourceKey}: remaining ${item.remainingCandidates}, probe fail ${item.probe.extractionFailed}/${item.probe.probed}`);
    }
    lines.push('');
  }

  lines.push('| Source | Priority | Discovered | Exact covered | Coverage | Remaining | Probe unique | Probe dup-title | Probe fail | Recent 24h |');
  lines.push('| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |');
  for (const item of summary.sources) {
    lines.push(`| ${item.sourceKey} | ${item.priority} | ${item.discoveredCandidates} | ${item.exactUrlCovered} | ${item.exactCoverageRate}% | ${item.remainingCandidates} | ${item.probe.extractableUnique} | ${item.probe.duplicateTitle} | ${item.probe.extractionFailed} | ${item.dbRecent24h} |`);
  }
  lines.push('');

  for (const item of summary.sources) {
    lines.push(`## ${item.sourceKey}`);
    lines.push('');
    lines.push(`- Source: ${item.name}`);
    lines.push(`- Base host: ${item.baseHost}`);
    lines.push(`- Authority: ${item.authorityClass}`);
    lines.push(`- Direct seeds: ${item.directSeedCount}`);
    lines.push(`- Discovery config: depth ${item.discoveryDepth}, max pages ${item.discoveryMaxPages}`);
    lines.push(`- DB host total: ${item.dbHostTotal}`);
    lines.push(`- DB recent 24h: ${item.dbRecent24h}`);
    lines.push(`- Exact URL coverage: ${item.exactUrlCovered}/${item.discoveredCandidates} (${item.exactCoverageRate}%)`);
    lines.push(`- Remaining exact URLs: ${item.remainingCandidates}`);
    lines.push(`- Probe: ${item.probe.probed} checked, ${item.probe.extractableUnique} unique, ${item.probe.duplicateTitle} duplicate-title, ${item.probe.extractionFailed} extraction-failed`);
    if (item.missingExamples.length > 0) {
      lines.push('- Likely true missing leaves:');
      for (const example of item.missingExamples.slice(0, 8)) {
        lines.push(`  - ${example.title || '(no title)'} | ${example.url}`);
      }
    }
    if (item.remainingExamples.length > 0) {
      lines.push('- Remaining exact-URL candidates:');
      for (const url of item.remainingExamples.slice(0, 8)) {
        lines.push(`  - ${url}`);
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}

async function fetchAllExistingArticles() {
  const rows = [];
  let from = 0;
  const pageSize = 500;

  while (true) {
    const { data, error } = await supabase
      .from('articles')
      .select('title,license,created_at')
      .range(from, from + pageSize - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) break;
    rows.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }

  return rows;
}

async function buildExistingIndexes() {
  const rows = await fetchAllExistingArticles();
  const exactUrls = new Set();
  const hostTitle = new Map();
  const hostCounts = new Map();
  const recent24hCounts = new Map();
  const now = Date.now();
  const dayAgo = now - (24 * 60 * 60 * 1000);

  for (const row of rows) {
    const url = extractUrlFromLicense(row.license);
    const host = normalizeHost(url);
    if (!url || !host) continue;

    exactUrls.add(url);
    hostCounts.set(host, (hostCounts.get(host) || 0) + 1);

    const titleKey = `${host}::${(row.title || '').trim().toLowerCase()}`;
    if (row.title) hostTitle.set(titleKey, true);

    const createdAt = row.created_at ? new Date(row.created_at).getTime() : 0;
    if (createdAt >= dayAgo) {
      recent24hCounts.set(host, (recent24hCounts.get(host) || 0) + 1);
    }
  }

  return { exactUrls, hostTitle, hostCounts, recent24hCounts };
}

async function probeMissingCandidates(source, candidates, indexes) {
  const remaining = [];
  for (const candidate of candidates) {
    if (!indexes.exactUrls.has(candidate.url)) {
      remaining.push(candidate);
    }
  }

  const probeTargets = remaining.slice(0, Math.max(0, argProbe));
  const probe = {
    probed: 0,
    extractableUnique: 0,
    duplicateTitle: 0,
    extractionFailed: 0
  };
  const missingExamples = [];

  for (const candidate of probeTargets) {
    probe.probed += 1;
    const scraped = await scrapeArticle(candidate);
    if (!scraped) {
      probe.extractionFailed += 1;
      continue;
    }

    const titleKey = `${normalizeHost(candidate.url)}::${(scraped.title || '').trim().toLowerCase()}`;
    if (indexes.hostTitle.has(titleKey)) {
      probe.duplicateTitle += 1;
      continue;
    }

    probe.extractableUnique += 1;
    missingExamples.push({
      title: scraped.title,
      url: candidate.url
    });
  }

  return {
    remaining,
    probe,
    missingExamples
  };
}

async function analyzeSource(source, indexes) {
  const discovered = await discoverArticlesFromSource(source);
  const exactCovered = discovered.filter((item) => indexes.exactUrls.has(item.url));
  const { remaining, probe, missingExamples } = await probeMissingCandidates(source, discovered, indexes);
  const baseHost = normalizeHost(source.baseUrl);

  return {
    sourceKey: source.key,
    name: source.name,
    priority: source.priority || 'P2',
    authorityClass: source.authorityClass || null,
    baseHost,
    directSeedCount: Array.isArray(source.directSeeds) ? source.directSeeds.length : 0,
    discoveryDepth: source.discoveryDepth || 0,
    discoveryMaxPages: source.discoveryMaxPages || 0,
    discoveredCandidates: discovered.length,
    exactUrlCovered: exactCovered.length,
    exactCoverageRate: safeRatio(exactCovered.length, discovered.length),
    remainingCandidates: remaining.length,
    remainingExamples: remaining.slice(0, 8).map((item) => item.url),
    dbHostTotal: indexes.hostCounts.get(baseHost) || 0,
    dbRecent24h: indexes.recent24hCounts.get(baseHost) || 0,
    probe,
    missingExamples
  };
}

async function main() {
  console.log('📊 开始生成当前站点覆盖率/提取成功率报告\n');

  let sources = getAllSources();
  if (argSources) {
    const allowed = new Set(argSources.split(',').map((item) => item.trim()).filter(Boolean));
    sources = sources.filter((source) => allowed.has(source.key));
  }
  if (argPriority) {
    sources = sources.filter((source) => (source.priority || '').toUpperCase() === argPriority);
  }
  if (medicalOnly) {
    sources = sources.filter((source) => MEDICAL_AUTHORITIES.has(source.authorityClass));
  }

  sources = sources.sort(sortByPriorityAndName);
  if (sources.length === 0) {
    console.log('⚠️ 没有命中任何来源');
    return;
  }

  const indexes = await buildExistingIndexes();
  const analyzed = [];

  for (const source of sources) {
    analyzed.push(await analyzeSource(source, indexes));
  }

  const totals = analyzed.reduce((acc, item) => {
    acc.discovered += item.discoveredCandidates;
    acc.exactCovered += item.exactUrlCovered;
    acc.recent24h += item.dbRecent24h;
    acc.probeExtractableUnique += item.probe.extractableUnique;
    acc.probeDuplicateTitle += item.probe.duplicateTitle;
    acc.probeExtractionFailed += item.probe.extractionFailed;
    return acc;
  }, {
    discovered: 0,
    exactCovered: 0,
    recent24h: 0,
    probeExtractableUnique: 0,
    probeDuplicateTitle: 0,
    probeExtractionFailed: 0
  });
  totals.exactCoverageRate = safeRatio(totals.exactCovered, totals.discovered);

  const rankings = {
    trueMissing: analyzed
      .filter((item) => item.probe.extractableUnique > 0)
      .sort(sortBacklog),
    duplicateDominated: analyzed
      .filter((item) => item.remainingCandidates > 0 && item.probe.probed > 0 && item.probe.extractableUnique === 0 && item.probe.duplicateTitle > 0)
      .sort(sortBacklog),
    extractionConstrained: analyzed
      .filter((item) => item.probe.extractionFailed > 0)
      .sort(sortBacklog)
  };

  const summary = {
    generatedAt: new Date().toISOString(),
    targets: sources.map((source) => source.key),
    totals,
    rankings,
    sources: analyzed
  };

  const jsonPath = `${OUTPUT_BASE}.json`;
  const mdPath = `${OUTPUT_BASE}.md`;
  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
  fs.writeFileSync(jsonPath, JSON.stringify(summary, null, 2));
  fs.writeFileSync(mdPath, makeMarkdownReport(summary));

  console.log(`✅ JSON: ${jsonPath}`);
  console.log(`✅ Markdown: ${mdPath}`);
  console.log(`📦 目标来源: ${summary.sources.length}`);
  console.log(`🔎 发现候选: ${totals.discovered}`);
  console.log(`📚 exact URL 已覆盖: ${totals.exactCovered} (${totals.exactCoverageRate}%)`);
  console.log(`🧪 probe unique/dup/fail: ${totals.probeExtractableUnique}/${totals.probeDuplicateTitle}/${totals.probeExtractionFailed}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
