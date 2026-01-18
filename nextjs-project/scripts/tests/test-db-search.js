const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');
// Load env vars from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testSearch() {
  console.log('🔍 Testing database search...\n');

  // Test with zero embedding
  const testEmbedding = Array(1536).fill(0);

  console.log('1️⃣ Testing basic vector search (search_knowledge_chunks)...');
  const { data: basicData, error: basicError } = await supabase.rpc('search_knowledge_chunks', {
    query_embedding: testEmbedding,
    match_threshold: 0.0,
    match_count: 5
  });

  if (basicError) {
    console.log('   ❌ Error:', basicError.message);
  } else {
    console.log('   ✅ Found', basicData?.length || 0, 'results');
    if (basicData && basicData.length > 0) {
      console.log('   First result:', basicData[0].title);
    }
  }

  console.log('\n2️⃣ Testing hybrid search (hybrid_search_chunks)...');
  const { data: hybridData, error: hybridError } = await supabase.rpc('hybrid_search_chunks', {
    query_text: 'feeding',
    query_embedding: testEmbedding,
    match_threshold: 0.0,
    match_count: 5
  });

  if (hybridError) {
    console.log('   ❌ Error:', hybridError.message);
  } else {
    console.log('   ✅ Found', hybridData?.length || 0, 'results');
    if (hybridData && hybridData.length > 0) {
      console.log('   First result:', hybridData[0].title);
      console.log('   Final score:', hybridData[0].final_score);
    }
  }

  // Check embeddings
  console.log('\n3️⃣ Checking knowledge chunks...');
  const { data: chunks } = await supabase
    .from('knowledge_chunks')
    .select('id, title, embedding, status')
    .eq('status', 'published')
    .limit(5);

  console.log('   Total published chunks:', chunks?.length || 0);
  if (chunks && chunks.length > 0) {
    chunks.forEach(c => {
      const hasEmbedding = c.embedding && c.embedding.length > 0;
      console.log('   -', c.title.substring(0, 40), '| embedding:', hasEmbedding ? 'YES' : 'NO');
    });
  }
}

testSearch().catch(console.error);
