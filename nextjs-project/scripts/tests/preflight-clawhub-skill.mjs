#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

dotenv.config({ path: path.resolve(projectRoot, '.env') });
dotenv.config({ path: path.resolve(projectRoot, '.env.local') });

const baseUrl = process.env.KB_TEST_BASE_URL || 'http://localhost:3000';
const skillDir = path.resolve(projectRoot, 'clawhub-skill/mom-ai-knowledge-base');
const zipPath = path.resolve(projectRoot, 'clawhub-skill/dist/mom-ai-knowledge-base.zip');
const skillPath = path.resolve(projectRoot, 'clawhub-skill/dist/mom-ai-knowledge-base.skill');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function getJson(url) {
  const response = await fetch(url);
  const json = await response.json();
  if (!response.ok) {
    throw new Error(`${url} -> ${response.status} ${JSON.stringify(json)}`);
  }
  return json;
}

async function main() {
  console.log('🔎 Running ClawHub skill preflight');

  const requiredFiles = [
    path.join(skillDir, 'SKILL.md'),
    path.join(skillDir, 'MANIFEST.yaml'),
    path.join(skillDir, 'agents/openai.yaml'),
    path.join(skillDir, 'references/api.md'),
    path.join(skillDir, 'references/architecture.md'),
    path.join(skillDir, 'references/high-risk-examples.md'),
  ];

  requiredFiles.forEach((file) => {
    assert(fs.existsSync(file), `Missing required skill file: ${file}`);
  });

  assert(fs.existsSync(zipPath), `Missing packaged zip: ${zipPath}`);
  assert(fs.existsSync(skillPath), `Missing packaged skill file: ${skillPath}`);

  const archiveListing = execFileSync('unzip', ['-l', zipPath], { encoding: 'utf8' });
  assert(archiveListing.includes('mom-ai-knowledge-base/SKILL.md'), 'Zip archive is missing SKILL.md');
  assert(archiveListing.includes('mom-ai-knowledge-base/MANIFEST.yaml'), 'Zip archive is missing MANIFEST.yaml');
  assert(archiveListing.includes('mom-ai-knowledge-base/references/architecture.md'), 'Zip archive is missing architecture.md');
  assert(archiveListing.includes('mom-ai-knowledge-base/references/high-risk-examples.md'), 'Zip archive is missing high-risk-examples.md');

  const [index, faq, insights] = await Promise.all([
    getJson(`${baseUrl}/api/kb`),
    getJson(`${baseUrl}/api/kb/faqs?limit=1`),
    getJson(`${baseUrl}/api/kb/insights?limit=5`),
  ]);

  assert(index.name === 'Mom AI Agent Knowledge Base API', 'KB index endpoint is not returning the expected API name');
  assert(index.version === '1.5', 'KB index endpoint is not returning the expected API version');
  assert(index.surfaces.includes('query'), 'KB index is missing the query surface');
  assert(index.surfaces.includes('insights'), 'KB index is missing the insights surface');
  assert(['supabase', 'static-fallback'].includes(faq.source), 'FAQ API did not return a recognized source state');
  assert(Array.isArray(insights.data), 'Insights API did not return a data array');
  assert(insights.data.length > 0, 'Insights API did not return any evidence-qualified articles');

  const query = await getJson(`${baseUrl}/api/kb/query?q=starting solids&limit=2`);
  assert(query.quick_answer, 'KB query did not return a quick answer');
  assert(query.quick_answer.why_this_applies, 'KB query quick answer did not return why_this_applies');
  assert(query.quick_answer.evidence_strength?.level, 'KB query quick answer did not return evidence strength');
  assert(query.quick_answer.review?.status, 'KB query quick answer did not return review status');
  assert(['strong', 'moderate', 'weak', 'none'].includes(query.meta?.match_strength), 'KB query did not return match strength metadata');
  assert(query.llm_fallback === null, 'KB query should not expose llm_fallback for a strong structured match');
  assert(query.safety?.urgency_level, 'KB query did not return urgency level');
  assert(Array.isArray(query.read_next) && query.read_next.length > 0, 'KB query did not return read-next paths');

  const sampleInsight = insights.data.find((item) => item.title && /^[A-Za-z0-9]/.test(item.title));
  assert(sampleInsight, 'Insights API did not return a usable sample insight for fallback validation');

  const insightQuery = await getJson(`${baseUrl}/api/kb/query?q=${encodeURIComponent(sampleInsight.title)}&limit=5`);
  assert(Array.isArray(insightQuery.matches?.insights) && insightQuery.matches.insights.some((item) => item.slug === sampleInsight.slug), 'KB query did not return the expected insight match');
  assert(['kb', 'insight-fallback'].includes(insightQuery.meta?.answer_layer), 'KB query returned an unexpected answer layer state');
  assert(insightQuery.llm_fallback === null, 'KB query should not expose llm_fallback for a valid insight fallback match');

  console.log('✅ Skill bundle files are present and packaged.');
  console.log(`   Zip: ${zipPath}`);
  console.log(`   Skill: ${skillPath}`);
  console.log(`   FAQ source state: ${faq.source}`);
}

main().catch((error) => {
  console.error(`❌ ClawHub skill preflight failed: ${error.message}`);
  process.exit(1);
});
