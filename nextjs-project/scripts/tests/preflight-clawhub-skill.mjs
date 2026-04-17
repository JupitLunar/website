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
  ];

  requiredFiles.forEach((file) => {
    assert(fs.existsSync(file), `Missing required skill file: ${file}`);
  });

  assert(fs.existsSync(zipPath), `Missing packaged zip: ${zipPath}`);
  assert(fs.existsSync(skillPath), `Missing packaged skill file: ${skillPath}`);

  const archiveListing = execFileSync('unzip', ['-l', zipPath], { encoding: 'utf8' });
  assert(archiveListing.includes('mom-ai-knowledge-base/SKILL.md'), 'Zip archive is missing SKILL.md');
  assert(archiveListing.includes('mom-ai-knowledge-base/MANIFEST.yaml'), 'Zip archive is missing MANIFEST.yaml');

  const [index, faq] = await Promise.all([
    getJson(`${baseUrl}/api/kb`),
    getJson(`${baseUrl}/api/kb/faqs?limit=1`),
  ]);

  assert(index.name === 'Mom AI Agent Knowledge Base API', 'KB index endpoint is not returning the expected API name');
  assert(['supabase', 'static-fallback'].includes(faq.source), 'FAQ API did not return a recognized source state');

  console.log('✅ Skill bundle files are present and packaged.');
  console.log(`   Zip: ${zipPath}`);
  console.log(`   Skill: ${skillPath}`);
  console.log(`   FAQ source state: ${faq.source}`);
}

main().catch((error) => {
  console.error(`❌ ClawHub skill preflight failed: ${error.message}`);
  process.exit(1);
});
