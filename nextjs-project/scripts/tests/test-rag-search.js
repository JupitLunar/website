#!/usr/bin/env node

/**
 * Test RAG Search System
 * Interactive testing tool for hybrid search functionality
 */

const path = require('path');
const readline = require('readline');

const dotenv = require('dotenv');
// Load env vars from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => rl.question(prompt, resolve));
}

async function testRagSearch(query, options = {}) {
  console.log(`\n🔍 Searching: "${query}"\n`);

  try {
    const response = await fetch(`${API_URL}/api/rag`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        ...options,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ API Error:', error.error || response.statusText);
      return null;
    }

    const data = await response.json();

    // Display results
    console.log('📊 Results:\n');
    console.log(`Answer: ${data.answer}\n`);
    console.log(`Confidence: ${(data.confidence * 100).toFixed(1)}%`);
    console.log(`Retrieved: ${data.retrieved_count} sources\n`);

    if (data.sources && data.sources.length > 0) {
      console.log('📚 Sources:\n');
      data.sources.forEach((source, i) => {
        console.log(`${i + 1}. ${source.title}`);
        console.log(`   Category: ${source.category}`);
        console.log(`   Type: ${source.source_type}`);

        if (source.final_score !== undefined) {
          // New hybrid search format
          console.log(`   Final Score: ${(source.final_score * 100).toFixed(1)}%`);
          console.log(`   ├─ Similarity: ${(source.similarity * 100).toFixed(1)}%`);
          console.log(`   ├─ Keyword: ${(source.keyword_score * 100).toFixed(1)}%`);
          console.log(`   ├─ Freshness: ${(source.freshness_score * 100).toFixed(1)}%`);
          console.log(`   └─ Quality: ${(source.quality_score * 100).toFixed(1)}%`);
        } else {
          // Old vector-only format
          console.log(`   Similarity: ${(source.similarity * 100).toFixed(1)}%`);
        }
        console.log('');
      });
    }

    return data;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return null;
  }
}

async function interactiveMode() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║            RAG Search Interactive Tester               ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  console.log('📝 Interactive Mode - Type your questions\n');
  console.log('Commands:');
  console.log('  - Type a question to search');
  console.log('  - "boost" to toggle recent content boost');
  console.log('  - "category <name>" to filter by category');
  console.log('  - "locale <US|CA|CN>" to filter by locale');
  console.log('  - "exit" to quit\n');

  let options = {
    boostRecent: true,
    category: null,
    locale: null,
  };

  console.log(`Current options: boost=${options.boostRecent}, category=${options.category || 'all'}, locale=${options.locale || 'all'}\n`);

  while (true) {
    const input = await question('Query> ');
    const trimmed = input.trim();

    if (!trimmed) continue;

    if (trimmed.toLowerCase() === 'exit') {
      console.log('\nGoodbye! 👋\n');
      break;
    }

    if (trimmed.toLowerCase() === 'boost') {
      options.boostRecent = !options.boostRecent;
      console.log(`✅ Recent content boost: ${options.boostRecent ? 'ON' : 'OFF'}\n`);
      continue;
    }

    if (trimmed.toLowerCase().startsWith('category ')) {
      const cat = trimmed.substring(9).trim();
      options.category = cat || null;
      console.log(`✅ Category filter: ${options.category || 'all'}\n`);
      continue;
    }

    if (trimmed.toLowerCase().startsWith('locale ')) {
      const loc = trimmed.substring(7).trim().toUpperCase();
      options.locale = loc || null;
      console.log(`✅ Locale filter: ${options.locale || 'all'}\n`);
      continue;
    }

    await testRagSearch(trimmed, options);
  }

  rl.close();
}

async function quickTest() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║              RAG Search Quick Test Suite               ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  const testQueries = [
    {
      name: 'Basic Query',
      query: 'when can I introduce solid foods to my baby',
      options: {},
    },
    {
      name: 'Specific Topic',
      query: 'peanut allergy prevention',
      options: { category: 'feeding' },
    },
    {
      name: 'Recent Content Boost',
      query: 'latest feeding guidelines',
      options: { boostRecent: true },
    },
    {
      name: 'Complex Query',
      query: 'how to prevent choking hazards when starting solid foods',
      options: { category: 'feeding', boostRecent: true },
    },
  ];

  for (const test of testQueries) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`TEST: ${test.name}`);
    console.log('='.repeat(60));

    const result = await testRagSearch(test.query, test.options);

    if (result) {
      console.log('✅ Test passed\n');
    } else {
      console.log('❌ Test failed\n');
    }

    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║                  All Tests Complete!                   ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  rl.close();
}

async function checkServer() {
  try {
    const response = await fetch(`${API_URL}/api/rag`, {
      method: 'OPTIONS',
    }).catch(() => null);

    if (!response) {
      console.error('❌ Cannot connect to server');
      console.error(`   Make sure the server is running: npm run dev`);
      console.error(`   Expected URL: ${API_URL}\n`);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Server check failed:', error.message);
    process.exit(1);
  }
}

async function main() {
  // Check if server is running
  await checkServer();

  const mode = process.argv[2];

  if (mode === 'quick' || mode === 'q') {
    await quickTest();
  } else {
    await interactiveMode();
  }
}

main().catch(error => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
});
