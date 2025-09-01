#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Tests Supabase connection and basic operations
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Check environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Create Supabase clients
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  
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
      console.log(`  - ${hub.id}: ${hub.name} (${hub.content_count} articles)`);
    });
    
    return data.length === 6; // Should have 6 hubs
  } catch (error) {
    console.error('❌ Content hubs test failed:', error.message);
    return false;
  }
}

async function testArticleCreation() {
  console.log('\n🔍 Testing article creation...');
  
  try {
    const testArticle = {
      slug: 'test-article-' + Date.now(),
      type: 'explainer',
      hub: 'feeding',
      lang: 'en',
      title: 'Test Article',
      one_liner: 'This is a test article for verifying the database setup and content ingestion pipeline.',
      key_facts: ['Test fact 1', 'Test fact 2', 'Test fact 3'],
      age_range: '6-12 months',
      region: 'Global',
      last_reviewed: '2025-01-15',
      reviewed_by: 'Test Reviewer',
      entities: ['test', 'article', 'verification'],
      license: 'CC BY-NC 4.0',
      body_md: 'This is a test article body.',
      status: 'published'
    };
    
    const { data, error } = await adminSupabase
      .from('articles')
      .insert(testArticle)
      .select()
      .single();
    
    if (error) throw error;
    
    console.log('✅ Test article created successfully');
    console.log(`📝 Article ID: ${data.id}`);
    console.log(`🔗 Slug: ${data.slug}`);
    
    // Clean up test article
    await adminSupabase
      .from('articles')
      .delete()
      .eq('slug', testArticle.slug);
    
    console.log('🧹 Test article cleaned up');
    
    return true;
  } catch (error) {
    console.error('❌ Article creation test failed:', error.message);
    return false;
  }
}

async function testRPCFunction() {
  console.log('\n🔍 Testing RPC function...');
  
  try {
    const { data, error } = await adminSupabase.rpc('upsert_article_bundle', {
      p_slug: 'test-rpc-' + Date.now(),
      p_type: 'howto',
      p_hub: 'sleep',
      p_title: 'Test RPC Article',
      p_one_liner: 'Testing the upsert_article_bundle RPC function for atomic content ingestion.',
      p_key_facts: ['RPC test 1', 'RPC test 2', 'RPC test 3'],
      p_last_reviewed: '2025-01-15',
      p_reviewed_by: 'RPC Test Reviewer',
      p_entities: ['rpc', 'test', 'atomic'],
      p_steps: [
        {
          step_number: 1,
          title: 'Test Step 1',
          description: 'This is a test step',
          time_required: '5 minutes'
        }
      ],
      p_faq: [
        {
          question: 'Test Question?',
          answer: 'Test Answer.',
          url: '#faq-1'
        }
      ],
      p_citations: [
        {
          title: 'Test Citation',
          url: 'https://example.com/test',
          author: 'Test Author'
        }
      ]
    });
    
    if (error) throw error;
    
    console.log('✅ RPC function test successful');
    console.log(`📝 Created article ID: ${data}`);
    
    // Clean up test article
    await adminSupabase
      .from('articles')
      .delete()
      .eq('id', data);
    
    console.log('🧹 RPC test article cleaned up');
    
    return true;
  } catch (error) {
    console.error('❌ RPC function test failed:', error.message);
    return false;
  }
}

async function testSearchIndexes() {
  console.log('\n🔍 Testing search indexes...');
  
  try {
    // Test full-text search
    const { data, error } = await supabase
      .from('articles')
      .select('title, one_liner')
      .textSearch('title', 'test')
      .limit(5);
    
    if (error) throw error;
    
    console.log('✅ Full-text search working');
    console.log(`🔍 Found ${data.length} articles with "test" in title`);
    
    return true;
  } catch (error) {
    console.error('❌ Search index test failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Supabase Database Tests\n');
  
  const tests = [
    { name: 'Connection', fn: testConnection },
    { name: 'Content Hubs', fn: testContentHubs },
    { name: 'Article Creation', fn: testArticleCreation },
    { name: 'RPC Function', fn: testRPCFunction },
    { name: 'Search Indexes', fn: testSearchIndexes }
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
    console.log('\n🎉 All tests passed! Database is ready for use.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Please check the setup.');
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('💥 Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = {
  testConnection,
  testContentHubs,
  testArticleCreation,
  testRPCFunction,
  testSearchIndexes,
  runAllTests
};
