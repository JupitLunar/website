#!/usr/bin/env node

/**
 * Generate Embeddings for Knowledge Chunks
 * Uses OpenAI API to create vector embeddings for RAG search
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');
// Load env vars from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

if (!openaiKey) {
  console.error('❌ Missing OpenAI API key');
  console.error('   Set OPENAI_API_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const OPENAI_EMBEDDING_URL = 'https://api.openai.com/v1/embeddings';
const EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';
const BATCH_SIZE = 10; // Process 10 chunks at a time
const DELAY_MS = 1000; // 1 second delay between batches to avoid rate limits

async function generateEmbedding(text) {
  try {
    const response = await fetch(OPENAI_EMBEDDING_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: text.slice(0, 8000), // Limit text length
        model: EMBEDDING_MODEL,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.data[0].embedding;
  } catch (error) {
    console.error(`   Error generating embedding: ${error.message}`);
    return null;
  }
}

async function getChunksWithoutEmbeddings(limit = 100) {
  const { data, error } = await supabase
    .from('knowledge_chunks')
    .select('id, title, content, summary')
    .eq('status', 'published')
    .is('embedding', null)
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch chunks: ${error.message}`);
  }

  return data || [];
}

async function updateChunkEmbedding(chunkId, embedding) {
  const { error } = await supabase
    .from('knowledge_chunks')
    .update({ embedding })
    .eq('id', chunkId);

  if (error) {
    throw new Error(`Failed to update chunk ${chunkId}: ${error.message}`);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║         Generate Embeddings for RAG System            ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  console.log(`Using model: ${EMBEDDING_MODEL}\n`);

  // Get total count
  const { count: totalCount } = await supabase
    .from('knowledge_chunks')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'published')
    .is('embedding', null);

  if (!totalCount || totalCount === 0) {
    console.log('✅ All chunks already have embeddings!\n');
    process.exit(0);
  }

  console.log(`📊 Found ${totalCount} chunks without embeddings\n`);
  console.log(`⚙️  Processing in batches of ${BATCH_SIZE}...\n`);

  let processedCount = 0;
  let successCount = 0;
  let errorCount = 0;

  while (processedCount < totalCount) {
    // Fetch next batch
    const chunks = await getChunksWithoutEmbeddings(BATCH_SIZE);

    if (chunks.length === 0) {
      break;
    }

    console.log(`Processing batch ${Math.floor(processedCount / BATCH_SIZE) + 1}/${Math.ceil(totalCount / BATCH_SIZE)}...`);

    // Process each chunk in the batch
    for (const chunk of chunks) {
      try {
        // Combine title, summary, and content for embedding
        const text = `${chunk.title}\n\n${chunk.summary || ''}\n\n${chunk.content}`;

        // Generate embedding
        const embedding = await generateEmbedding(text);

        if (embedding) {
          // Update database
          await updateChunkEmbedding(chunk.id, embedding);
          successCount++;
          process.stdout.write('✅');
        } else {
          errorCount++;
          process.stdout.write('❌');
        }
      } catch (error) {
        console.error(`\n   Error processing chunk ${chunk.id}: ${error.message}`);
        errorCount++;
        process.stdout.write('❌');
      }

      processedCount++;
    }

    console.log(` ${processedCount}/${totalCount}`);

    // Delay between batches to avoid rate limits
    if (processedCount < totalCount) {
      await sleep(DELAY_MS);
    }
  }

  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║                      SUMMARY                           ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  console.log(`Total processed: ${processedCount}`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log('');

  if (successCount > 0) {
    console.log('✨ Embeddings generated successfully!\n');
    console.log('Next steps:');
    console.log('1. Test RAG search: node scripts/test-rag-search.js');
    console.log('2. Or start dev server: npm run dev');
    console.log('3. Try API: POST http://localhost:3002/api/rag');
    console.log('   Body: {"query": "baby feeding guidelines"}\n');
  }

  // Check final status
  const { count: remainingCount } = await supabase
    .from('knowledge_chunks')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'published')
    .is('embedding', null);

  if (remainingCount > 0) {
    console.log(`ℹ️  ${remainingCount} chunks still need embeddings.`);
    console.log('   Run this script again to process them.\n');
  }
}

main().catch(console.error);
