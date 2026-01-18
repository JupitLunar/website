#!/usr/bin/env node

/**
 * Extract FAQ-related SQL statements
 * This creates a standalone SQL file that can be run in Supabase SQL Editor
 */

const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
const outputPath = path.join(__dirname, '..', 'supabase', 'add_kb_faqs_table.sql');

const schema = fs.readFileSync(schemaPath, 'utf-8');

// Extract kb_faqs table definition
const tableStart = schema.indexOf('-- Knowledge Base FAQs');
const tableEnd = schema.indexOf(');', schema.indexOf('CREATE TABLE IF NOT EXISTS kb_faqs')) + 2;
const tableSQL = schema.substring(tableStart, tableEnd);

// Extract kb_faqs indexes
const indexMatches = schema.match(/CREATE INDEX[^;]*kb_faqs[^;]*;/g) || [];
const indexSQL = indexMatches.join('\n');

// Extract kb_faqs search vector
const searchVectorMatch = schema.match(/ALTER TABLE kb_faqs ADD COLUMN[^;]*search_vector[^;]*STORED;/s);
const searchVectorSQL = searchVectorMatch ? searchVectorMatch[0] : '';

const searchIndexMatch = schema.match(/CREATE INDEX[^;]*idx_kb_faqs_search[^;]*;/);
const searchIndexSQL = searchIndexMatch ? searchIndexMatch[0] : '';

// Extract kb_faqs trigger
const triggerMatch = schema.match(/CREATE TRIGGER update_kb_faqs_updated_at[^;]*;/);
const triggerSQL = triggerMatch ? triggerMatch[0] : '';

// Ensure update_updated_at_column function exists
const functionSQL = `
-- Function for updated_at trigger (skip if already exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
`;

const completeSQL = `-- SQL to add kb_faqs table to existing database
-- Generated: ${new Date().toISOString()}
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

${functionSQL}

${tableSQL}

-- Indexes for kb_faqs
${indexSQL}

-- Full-text search for kb_faqs
${searchVectorSQL}

${searchIndexSQL}

-- Trigger for updated_at
${triggerSQL}

-- Insert sample FAQ data
INSERT INTO kb_faqs (slug, question, answer, category, subcategory, age_range, related_topic_slugs, priority, status, last_reviewed_at) VALUES
(
  'when-start-solid-foods',
  'When should I start solid foods—and what are the readiness signs?',
  'Most babies are ready for solid foods around **6 months** of age. Key readiness signs include:

- Baby can sit up with minimal support
- Has good head and neck control
- Shows interest in food (watches you eat, reaches for food)
- Has lost the tongue-thrust reflex (doesn''t automatically push food out)
- Can move food from the front to the back of the mouth

Always consult your pediatrician before starting solids, especially if your baby was born preterm or has developmental concerns.

**Sources:** CDC, AAP Healthy Children',
  'feeding',
  'solid-introduction',
  ARRAY['0-6 months', '6-12 months'],
  ARRAY['feeding-foundations'],
  10,
  'published',
  CURRENT_DATE
)
ON CONFLICT (slug) DO NOTHING;

-- Verify table was created
SELECT
  table_name,
  (SELECT count(*) FROM kb_faqs) as row_count
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'kb_faqs';
`;

fs.writeFileSync(outputPath, completeSQL);

console.log('✅ Extracted kb_faqs SQL to:', outputPath);
console.log('\n📋 To create the table:');
console.log('   1. Open Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql');
console.log(`   2. Copy the contents of: ${outputPath}`);
console.log('   3. Paste into SQL Editor and click "Run"');
console.log('\n📁 Or run via command line if you have Supabase CLI:');
console.log('   supabase db push');

// Also print to console for immediate use
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('SQL CONTENT (copy this to SQL Editor):');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log(completeSQL);
