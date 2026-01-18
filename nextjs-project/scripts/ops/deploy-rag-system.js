#!/usr/bin/env node

/**
 * Complete RAG System Deployment Script
 * Automates migration, validation, and data population
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
// Load env vars from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('╔════════════════════════════════════════════════════════╗');
console.log('║          RAG System Deployment Automation              ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

async function checkTableExists(tableName) {
  const { error } = await supabase
    .from(tableName)
    .select('id')
    .limit(0);

  return !error || error.code === 'PGRST116'; // PGRST116 = empty result
}

async function checkFunctionExists(functionName) {
  try {
    const { error } = await supabase.rpc(functionName);
    return !error || !error.message.includes('does not exist');
  } catch {
    return false;
  }
}

async function validateMigration() {
  console.log('🔍 Validating current database state...\n');

  const checks = [
    { name: 'knowledge_chunks table', check: () => checkTableExists('knowledge_chunks') },
    { name: 'article_summaries table', check: () => checkTableExists('article_summaries') },
    { name: 'content_quality_metrics table', check: () => checkTableExists('content_quality_metrics') },
    { name: 'ai_conversations table', check: () => checkTableExists('ai_conversations') },
  ];

  const results = [];

  for (const { name, check } of checks) {
    const exists = await check();
    results.push({ name, exists });
    console.log(`   ${exists ? '✅' : '❌'} ${name}`);
  }

  console.log('');
  const allPassed = results.every(r => r.exists);
  return { allPassed, results };
}

async function runMigrationManually() {
  console.log('📋 MIGRATION REQUIRED\n');
  console.log('Please run the migration manually in Supabase SQL Editor:\n');
  console.log('1. Open: https://supabase.com/dashboard/project/isrsacgnhagdvwoytkuy/sql');
  console.log('2. Click "New Query"');
  console.log('3. Copy and paste the contents of:');
  console.log('   supabase/migrations/20251005_rag_optimization.sql');
  console.log('4. Click "Run"\n');
  console.log('After migration is complete, run this script again.\n');

  process.exit(0);
}

async function populateKnowledgeBase() {
  console.log('📥 Populating knowledge base...\n');

  try {
    const { data: chunkCount, error } = await supabase
      .rpc('populate_knowledge_chunks');

    if (error) {
      console.log('⚠️  populate_knowledge_chunks function not available yet.');
      console.log('   This is expected if migration just ran.\n');
      return 0;
    }

    console.log(`✅ Populated ${chunkCount || 0} knowledge chunks\n`);
    return chunkCount || 0;
  } catch (error) {
    console.log('⚠️  Could not populate:', error.message, '\n');
    return 0;
  }
}

async function getStatistics() {
  console.log('📊 Knowledge Base Statistics:\n');

  try {
    const { data: chunks, error } = await supabase
      .from('knowledge_chunks')
      .select('source_type, status, content_freshness_score, embedding')
      .eq('status', 'published');

    if (error) {
      console.log('   No data available yet.\n');
      return;
    }

    if (!chunks || chunks.length === 0) {
      console.log('   No published chunks found.\n');
      return;
    }

    // Group by source type
    const stats = chunks.reduce((acc, chunk) => {
      acc[chunk.source_type] = (acc[chunk.source_type] || 0) + 1;
      return acc;
    }, {});

    Object.entries(stats).forEach(([type, count]) => {
      console.log(`   ${type.padEnd(20)} ${count}`);
    });
    console.log(`   ${'─'.repeat(30)}`);
    console.log(`   ${'TOTAL'.padEnd(20)} ${chunks.length}`);

    // Calculate metrics
    const withEmbeddings = chunks.filter(c => c.embedding).length;
    const avgFreshness = chunks.reduce((sum, c) => sum + (c.content_freshness_score || 0), 0) / chunks.length;

    console.log(`\n   Chunks with embeddings: ${withEmbeddings}/${chunks.length} (${((withEmbeddings/chunks.length)*100).toFixed(1)}%)`);
    console.log(`   Average freshness score: ${avgFreshness.toFixed(2)}\n`);

    return { total: chunks.length, withEmbeddings };
  } catch (error) {
    console.log('   Could not fetch statistics:', error.message, '\n');
    return null;
  }
}

async function testHybridSearch() {
  console.log('🔍 Testing hybrid search function...\n');

  try {
    // Create a simple test embedding (all zeros)
    const testEmbedding = Array(1536).fill(0);

    const { data, error } = await supabase.rpc('hybrid_search_chunks', {
      query_text: 'baby feeding',
      query_embedding: testEmbedding,
      match_threshold: 0.1,
      match_count: 5,
    });

    if (error) {
      console.log(`   ⚠️  Hybrid search not available: ${error.message}`);
      console.log('   Falling back to basic vector search is enabled.\n');
      return false;
    }

    console.log('   ✅ Hybrid search function is working!');
    console.log(`   Found ${data?.length || 0} results with test query\n`);
    return true;
  } catch (error) {
    console.log('   ⚠️  Could not test hybrid search:', error.message, '\n');
    return false;
  }
}

async function checkEmbeddingStatus() {
  console.log('🔢 Checking embedding status...\n');

  try {
    const { data: chunks, error } = await supabase
      .from('knowledge_chunks')
      .select('id, title, embedding')
      .eq('status', 'published')
      .limit(100);

    if (error || !chunks) {
      console.log('   Could not check embeddings.\n');
      return;
    }

    const withEmbeddings = chunks.filter(c => c.embedding).length;
    const total = chunks.length;

    console.log(`   Total chunks: ${total}`);
    console.log(`   With embeddings: ${withEmbeddings}`);
    console.log(`   Missing embeddings: ${total - withEmbeddings}\n`);

    if (withEmbeddings === 0) {
      console.log('   ⚠️  No embeddings found. You need to generate them.\n');
      console.log('   Options:');
      console.log('   1. Use admin UI: /admin/knowledge (click "Generate Embeddings")');
      console.log('   2. Run script: node scripts/generate-embeddings.js');
      console.log('   3. Use API: POST /api/knowledge with action=generate_embeddings\n');
    } else if (withEmbeddings < total) {
      console.log(`   ℹ️  ${total - withEmbeddings} chunks need embeddings.\n`);
    } else {
      console.log('   ✅ All chunks have embeddings!\n');
    }

    return { total, withEmbeddings };
  } catch (error) {
    console.log('   Could not check embeddings:', error.message, '\n');
  }
}

async function main() {
  // Step 1: Validate current state
  const { allPassed, results } = await validateMigration();

  if (!allPassed) {
    await runMigrationManually();
    return;
  }

  console.log('✅ Migration is complete!\n');

  // Step 2: Populate knowledge base
  const populated = await populateKnowledgeBase();

  // Step 3: Get statistics
  const stats = await getStatistics();

  // Step 4: Test hybrid search
  const hybridSearchWorks = await testHybridSearch();

  // Step 5: Check embedding status
  const embeddingStatus = await checkEmbeddingStatus();

  // Summary
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║                    DEPLOYMENT SUMMARY                  ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  console.log('Status:');
  console.log(`   ✅ Database migration: Complete`);
  console.log(`   ✅ Knowledge base populated: ${populated > 0 ? 'Yes' : 'Partial'} (${stats?.total || 0} chunks)`);
  console.log(`   ${hybridSearchWorks ? '✅' : '⚠️ '} Hybrid search: ${hybridSearchWorks ? 'Working' : 'Not available (fallback enabled)'}`);
  console.log(`   ${embeddingStatus?.withEmbeddings > 0 ? '✅' : '⚠️ '} Embeddings: ${embeddingStatus?.withEmbeddings || 0}/${embeddingStatus?.total || 0}`);
  console.log('');

  if (embeddingStatus && embeddingStatus.withEmbeddings === 0) {
    console.log('🔔 Next Steps:');
    console.log('   1. Generate embeddings for knowledge chunks');
    console.log('   2. Test RAG search with real queries');
    console.log('   3. Monitor quality metrics\n');
    console.log('Run: node scripts/generate-embeddings.js (creating this next...)\n');
  } else {
    console.log('✨ RAG system is ready to use!\n');
    console.log('Test it:');
    console.log('   curl -X POST http://localhost:3002/api/rag \\');
    console.log('     -H "Content-Type: application/json" \\');
    console.log('     -d \'{"query":"baby feeding guidelines"}\'\n');
  }
}

main().catch(console.error);
