#!/usr/bin/env node

/**
 * Simple Database Connection Test
 * Tests basic Supabase connection without advanced features
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');
// Load env vars from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

// Check environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testBasicConnection() {
  console.log('🔍 Testing basic Supabase connection...');

  try {
    const { data, error } = await supabase
      .from('content_hubs')
      .select('*')
      .limit(1);

    if (error) throw error;

    console.log('✅ Database connection successful');
    console.log(`📊 Found ${data.length} content hub(s)`);

    if (data.length > 0) {
      console.log('Sample hub:', data[0]);
    }

    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

async function testContentHubs() {
  console.log('\n🔍 Testing content hubs...');

  try {
    const { data, error } = await supabase
      .from('content_hubs')
      .select('*')
      .order('id');

    if (error) throw error;

    console.log(`✅ Found ${data.length} content hubs:`);
    data.forEach(hub => {
      console.log(`  - ${hub.id}: ${hub.name} (${hub.content_count || 0} articles)`);
    });

    return data.length === 6; // Should have 6 hubs
  } catch (error) {
    console.error('❌ Content hubs test failed:', error.message);
    return false;
  }
}

async function testArticlesTable() {
  console.log('\n🔍 Testing articles table...');

  try {
    const { data, error } = await supabase
      .from('articles')
      .select('id, slug, title')
      .limit(1);

    if (error) throw error;

    console.log('✅ Articles table accessible');
    console.log(`📝 Found ${data.length} article(s)`);

    return true;
  } catch (error) {
    console.error('❌ Articles table test failed:', error.message);
    return false;
  }
}

async function runBasicTests() {
  console.log('🚀 Starting Basic Supabase Tests\n');

  const tests = [
    { name: 'Connection', fn: testBasicConnection },
    { name: 'Content Hubs', fn: testContentHubs },
    { name: 'Articles Table', fn: testArticlesTable }
  ];

  let passed = 0;
  let total = tests.length;

  for (const test of tests) {
    const result = await test.fn();
    if (result) passed++;
  }

  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);

  if (passed === total) {
    console.log('\n🎉 All basic tests passed! Database is ready for basic operations.');
    console.log('\n💡 To enable advanced features, run the advanced.sql file in Supabase.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Please check your setup.');
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runBasicTests().catch(error => {
    console.error('💥 Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = {
  testBasicConnection,
  testContentHubs,
  testArticlesTable,
  runBasicTests
};
