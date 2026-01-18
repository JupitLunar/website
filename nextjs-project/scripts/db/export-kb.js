#!/usr/bin/env node

/**
 * Export knowledge base content into embedding-friendly NDJSON/JSON files.
 * Each record includes metadata and a plain-text `content` field suitable for
 * vector embedding pipelines or search indexes.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const dotenv = require('dotenv');
// Load env vars from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    format: 'ndjson',
    output: path.resolve(__dirname, '../exports/kb-knowledge.ndjson'),
  };

  args.forEach((arg) => {
    if (arg.startsWith('--output=')) {
      options.output = path.resolve(arg.split('=')[1]);
    } else if (arg.startsWith('--format=')) {
      const format = arg.split('=')[1].toLowerCase();
      if (!['ndjson', 'json'].includes(format)) {
        console.error('❌ Invalid format. Use "ndjson" or "json".');
        process.exit(1);
      }
      options.format = format;
      if (format === 'json' && !args.some((a) => a.startsWith('--output='))) {
        options.output = path.resolve(__dirname, '../exports/kb-knowledge.json');
      }
    }
  });

  return options;
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function joinList(list) {
  return Array.isArray(list) && list.length > 0 ? list.join(', ') : '无';
}

function formatSources(ids, sourceMap) {
  if (!Array.isArray(ids) || ids.length === 0) return '来源：无';
  const lines = ids
    .map((id) => sourceMap.get(id))
    .filter(Boolean)
    .map((src) => `${src.name}（评级：${src.grade}${src.organization ? `，机构：${src.organization}` : ''}）`);
  return lines.length > 0 ? `来源：${lines.join('；')}` : '来源：无';
}

function buildContent(record, sourceMap) {
  if (record.kind === 'rule') {
    return [
      `标题：${record.title}`,
      `类型：规则`,
      `区域：${record.locale}`,
      `风险级别：${record.risk_level}`,
      `摘要：${record.summary || '无'}`,
      `原因：${record.why || '无'}`,
      `应做：${joinList(record.do_list)}`,
      `避免：${joinList(record.dont_list)}`,
      formatSources(record.source_ids, sourceMap),
    ].join('\n');
  }

  if (record.kind === 'food') {
    const servingForms = Array.isArray(record.serving_forms)
      ? record.serving_forms
          .map((form) => {
            const base = `${form.age_range || '适龄未知'}：${form.form}`;
            const extras = [
              form.texture ? `质地：${form.texture}` : null,
              form.prep ? `准备：${form.prep}` : null,
              form.notes ? `提示：${form.notes}` : null,
            ].filter(Boolean);
            return `- ${base}${extras.length ? `（${extras.join('；')}）` : ''}`;
          })
          .join('\n')
      : '无';

    return [
      `标题：${record.name}`,
      `类型：食物档案`,
      `区域：${record.locale}`,
      `适龄：${joinList(record.age_range)}`,
      `喂养方式：${joinList(record.feeding_methods)}`,
      `风险级别：${record.risk_level}`,
      `营养重点：${joinList(record.nutrients_focus)}`,
      `摘要：${record.why || '无'}`,
      `如何准备：\n${servingForms}`,
      `份量建议：${record.portion_hint || '无'}`,
      formatSources(record.source_ids, sourceMap),
    ].join('\n');
  }

  const checklist = Array.isArray(record.checklist)
    ? record.checklist
        .map((item) => `- [${item.type || 'tip'}] ${item.label}${item.detail ? `：${item.detail}` : ''}`)
        .join('\n')
    : '无';

  return [
    `标题：${record.title}`,
    `类型：指南`,
    `区域：${record.locale}`,
    `阶段：${joinList(record.age_range)}`,
    `指南类别：${record.guide_type}`,
    `摘要：${record.summary || '无'}`,
    `正文：${record.body_md || '无'}`,
    `清单：\n${checklist}`,
    `关联规则：${joinList(record.related_rule_ids)}`,
    `关联食物：${joinList(record.related_food_ids)}`,
    formatSources(record.source_ids, sourceMap),
  ].join('\n');
}

async function fetchTable(table) {
  const { data, error } = await supabase.from(table).select('*');
  if (error) {
    throw new Error(`Failed to fetch ${table}: ${error.message}`);
  }
  return data || [];
}

(async () => {
  const { output, format } = parseArgs();
  ensureDir(output);

  try {
    console.log('🚀 Exporting knowledge base for embeddings...');

    const [sources, rules, foods, guides] = await Promise.all([
      fetchTable('kb_sources'),
      fetchTable('kb_rules'),
      fetchTable('kb_foods'),
      fetchTable('kb_guides'),
    ]);

    const sourceMap = new Map(sources.map((src) => [src.id, src]));
    const dataset = [];

    rules.forEach((rule) => {
      dataset.push({
        kind: 'rule',
        slug: rule.slug,
        locale: rule.locale,
        updated_at: rule.updated_at,
        last_reviewed_at: rule.last_reviewed_at,
        expires_at: rule.expires_at,
        metadata: {
          type: 'kb_rule',
          category: rule.category,
          risk_level: rule.risk_level,
          reviewed_by: rule.reviewed_by,
        },
        content: buildContent({ kind: 'rule', ...rule }, sourceMap),
      });
    });

    foods.forEach((food) => {
      dataset.push({
        kind: 'food',
        slug: food.slug,
        locale: food.locale,
        updated_at: food.updated_at,
        last_reviewed_at: food.last_reviewed_at,
        expires_at: food.expires_at,
        metadata: {
          type: 'kb_food',
          nutrients_focus: food.nutrients_focus,
          feeding_methods: food.feeding_methods,
          reviewed_by: food.reviewed_by,
        },
        content: buildContent({ kind: 'food', ...food }, sourceMap),
      });
    });

    guides.forEach((guide) => {
      dataset.push({
        kind: 'guide',
        slug: guide.slug,
        locale: guide.locale,
        updated_at: guide.updated_at,
        last_reviewed_at: guide.last_reviewed_at,
        expires_at: guide.expires_at,
        metadata: {
          type: 'kb_guide',
          guide_type: guide.guide_type,
          reviewed_by: guide.reviewed_by,
        },
        content: buildContent({ kind: 'guide', ...guide }, sourceMap),
      });
    });

    if (format === 'json') {
      fs.writeFileSync(
        output,
        JSON.stringify({ generated_at: new Date().toISOString(), data: dataset }, null, 2),
        'utf8'
      );
    } else {
      const ndjson = dataset.map((item) => JSON.stringify(item)).join('\n');
      fs.writeFileSync(output, ndjson, 'utf8');
    }

    console.log(`✅ Exported ${dataset.length} records to ${output}`);
    process.exit(0);
  } catch (error) {
    console.error(`💥 Export failed: ${error.message}`);
    process.exit(1);
  }
})();
