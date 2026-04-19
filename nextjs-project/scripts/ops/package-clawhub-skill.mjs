#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');
const skillRoot = path.resolve(projectRoot, 'clawhub-skill');
const skillDir = path.resolve(skillRoot, 'mom-ai-knowledge-base');
const distDir = path.resolve(skillRoot, 'dist');
const zipPath = path.resolve(distDir, 'mom-ai-knowledge-base.zip');
const skillPath = path.resolve(distDir, 'mom-ai-knowledge-base.skill');

function assertExists(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required file: ${filePath}`);
  }
}

function main() {
  [
    path.join(skillDir, 'SKILL.md'),
    path.join(skillDir, 'MANIFEST.yaml'),
    path.join(skillDir, 'agents/openai.yaml'),
    path.join(skillDir, 'references/api.md'),
    path.join(skillDir, 'references/architecture.md'),
    path.join(skillDir, 'references/high-risk-examples.md'),
  ].forEach(assertExists);

  fs.mkdirSync(distDir, { recursive: true });

  if (fs.existsSync(zipPath)) fs.rmSync(zipPath);
  if (fs.existsSync(skillPath)) fs.rmSync(skillPath);

  execFileSync('zip', ['-r', zipPath, 'mom-ai-knowledge-base'], {
    cwd: skillRoot,
    stdio: 'inherit',
  });

  fs.copyFileSync(zipPath, skillPath);

  console.log('✅ Packaged ClawHub skill bundle');
  console.log(`   Zip: ${zipPath}`);
  console.log(`   Skill: ${skillPath}`);
}

try {
  main();
} catch (error) {
  console.error(`❌ Failed to package ClawHub skill: ${error.message}`);
  process.exit(1);
}
