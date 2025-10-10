#!/usr/bin/env node

// Test script to verify RAG API functionality
const fetch = require('node-fetch');

async function testRAGAPI() {
  const baseUrl = 'http://localhost:3000';
  const testQueries = [
    'What are infant milestones?', // Should return hardcoded response
    'How to prepare baby formula?', // Should trigger LLM
    'When should I introduce solid foods?', // Should trigger LLM
  ];

  console.log('🧪 Testing RAG API...\n');

  for (const query of testQueries) {
    console.log(`📝 Testing query: "${query}"`);
    
    try {
      const response = await fetch(`${baseUrl}/api/rag`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          sessionId: `test_${Date.now()}`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Success');
        console.log(`   Summary: ${data.answer.summary}`);
        console.log(`   Key Points: ${data.answer.keyPoints.length} items`);
        console.log(`   Sources: ${data.sources.length} sources`);
        console.log(`   AI Generated: ${data.answer.disclaimer.includes('AI') ? 'Yes' : 'No'}`);
      } else {
        const error = await response.text();
        console.log(`❌ Error ${response.status}: ${error}`);
      }
    } catch (error) {
      console.log(`❌ Network error: ${error.message}`);
    }
    
    console.log(''); // Empty line for readability
  }
}

// Run the test
testRAGAPI().catch(console.error);
