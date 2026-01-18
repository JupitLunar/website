#!/usr/bin/env node

/**
 * Validate knowledge base JSON files before importing into Supabase.
 * Usage:
 *   npm run validate:kb -- path/to/file.json another/file.json
 * If no files are provided, the script looks for supabase/seed/knowledge_base.json.
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_FILE = path.resolve(__dirname, '../supabase/seed/knowledge_base.json');

const RISK_LEVELS = new Set(['none', 'low', 'medium', 'high']);
const RULE_CATEGORIES = new Set([
  'food-safety',
  'beverages',
  'allergen',
  'storage',
  'feeding-environment',
  'supplement',
  'nutrition'
]);
const GUIDE_TYPES = new Set([
  'framework',
  'pathway',
  'scenario',
  'nutrition',
  'allergen',
  'glossary',
  'education',
  'other'
]);
const LOCALES = new Set(['US', 'CA', 'Global']);
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function readJson(file) {
  const absolute = path.resolve(file);
  if (!fs.existsSync(absolute)) {
    throw new Error(`File not found: ${absolute}`);
  }
  const content = fs.readFileSync(absolute, 'utf8');
  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Invalid JSON in ${absolute}: ${error.message}`);
  }
}

function ensureArray(value, name, errors, context) {
  if (!Array.isArray(value) || value.length === 0) {
    errors.push(`${context} -> ${name} must be a non-empty array.`);
    return false;
  }
  return true;
}

function validateSources(sources, errors) {
  if (!ensureArray(sources, 'sources', errors, 'root')) return;
  sources.forEach((source, index) => {
    const ctx = `sources[${index}]`;
    if (!source.id || typeof source.id !== 'string') {
      errors.push(`${ctx} -> id is required.`);
    }
    if (!source.name) {
      errors.push(`${ctx} -> name is required.`);
    }
    if (!source.url || !/^https:\/\//.test(source.url)) {
      errors.push(`${ctx} -> url must start with https://`);
    }
    if (!['A', 'B', 'C', 'D'].includes(source.grade)) {
      errors.push(`${ctx} -> grade must be A, B, C, or D.`);
    }
    if (source.retrieved_at && !ISO_DATE.test(source.retrieved_at)) {
      errors.push(`${ctx} -> retrieved_at must be YYYY-MM-DD.`);
    }
  });
}

function validateReviewFields(record, ctx, errors) {
  if (record.locale && !LOCALES.has(record.locale)) {
    errors.push(`${ctx} -> locale must be one of ${Array.from(LOCALES).join(', ')}`);
  }
  if (record.reviewed_by && typeof record.reviewed_by !== 'string') {
    errors.push(`${ctx} -> reviewed_by must be a string.`);
  }
  if (record.last_reviewed_at && !ISO_DATE.test(record.last_reviewed_at)) {
    errors.push(`${ctx} -> last_reviewed_at must be YYYY-MM-DD.`);
  }
  if (record.expires_at && !ISO_DATE.test(record.expires_at)) {
    errors.push(`${ctx} -> expires_at must be YYYY-MM-DD.`);
  }
}

function validateRules(rules, errors) {
  if (!rules) return;
  if (!Array.isArray(rules)) {
    errors.push('rules must be an array.');
    return;
  }
  rules.forEach((rule, index) => {
    const ctx = `rules[${index}]`;
    ['slug', 'title', 'summary'].forEach((field) => {
      if (!rule[field]) {
        errors.push(`${ctx} -> ${field} is required.`);
      }
    });
    if (!RULE_CATEGORIES.has(rule.category)) {
      errors.push(`${ctx} -> category must be one of ${Array.from(RULE_CATEGORIES).join(', ')}`);
    }
    if (!RISK_LEVELS.has(rule.risk_level)) {
      errors.push(`${ctx} -> risk_level must be one of ${Array.from(RISK_LEVELS).join(', ')}`);
    }
    if (!ensureArray(rule.do_list, 'do_list', errors, ctx)) {
      // continue even if missing
    }
    if (!ensureArray(rule.source_ids, 'source_ids', errors, ctx)) {
      // continue even if missing
    }
    validateReviewFields(rule, ctx, errors);
  });
}

function validateFoods(foods, errors) {
  if (!foods) return;
  if (!Array.isArray(foods)) {
    errors.push('foods must be an array.');
    return;
  }
  foods.forEach((food, index) => {
    const ctx = `foods[${index}]`;
    ['slug', 'name'].forEach((field) => {
      if (!food[field]) {
        errors.push(`${ctx} -> ${field} is required.`);
      }
    });
    if (!ensureArray(food.age_range, 'age_range', errors, ctx)) {
      // skip
    }
    if (!ensureArray(food.serving_forms, 'serving_forms', errors, ctx)) {
      // skip
    }
    if (!RISK_LEVELS.has(food.risk_level)) {
      errors.push(`${ctx} -> risk_level must be one of ${Array.from(RISK_LEVELS).join(', ')}`);
    }
    if (!ensureArray(food.source_ids, 'source_ids', errors, ctx)) {
      // skip
    }
    validateReviewFields(food, ctx, errors);
  });
}

function validateGuides(guides, errors) {
  if (!guides) return;
  if (!Array.isArray(guides)) {
    errors.push('guides must be an array.');
    return;
  }
  guides.forEach((guide, index) => {
    const ctx = `guides[${index}]`;
    ['slug', 'title', 'summary'].forEach((field) => {
      if (!guide[field]) {
        errors.push(`${ctx} -> ${field} is required.`);
      }
    });
    if (!GUIDE_TYPES.has(guide.guide_type)) {
      errors.push(`${ctx} -> guide_type must be one of ${Array.from(GUIDE_TYPES).join(', ')}`);
    }
    if (!ensureArray(guide.source_ids, 'source_ids', errors, ctx)) {
      // skip
    }
    validateReviewFields(guide, ctx, errors);
  });
}

function validateFile(file) {
  const data = readJson(file);
  const errors = [];

  if (!data || typeof data !== 'object') {
    throw new Error('Root JSON must be an object.');
  }

  validateSources(data.sources, errors);
  validateRules(data.rules, errors);
  validateFoods(data.foods, errors);
  validateGuides(data.guides, errors);

  if (errors.length) {
    console.error(`\n❌ Validation failed for ${file}:`);
    errors.forEach((err) => console.error(` - ${err}`));
    process.exitCode = 1;
  } else {
    console.log(`✅ ${file} passed validation.`);
  }
}

function main() {
  const args = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
  const files = args.length ? args : [DEFAULT_FILE];
  let processed = 0;

  files.forEach((file) => {
    try {
      validateFile(file);
      processed += 1;
    } catch (error) {
      console.error(`\n❌ ${file}: ${error.message}`);
      process.exitCode = 1;
    }
  });

  if (processed === 0) {
    console.warn('No files were validated. Provide file paths or create the default seed file.');
  }
}

main();
