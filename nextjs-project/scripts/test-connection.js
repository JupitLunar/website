#!/usr/bin/env node

/**
 * Simple connection test script
 * Tests Supabase connection with anon key only
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !ANON_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, ANON_KEY);

(async () => {
  try {
    console.log('🔍 Testing Supabase connection...');
    console.log('URL:', SUPABASE_URL);
    console.log('Key:', ANON_KEY.substring(0, 20) + '...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('content_hubs')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      process.exit(1);
    }
    
    console.log('✅ Connection successful!');
    console.log('📊 Sample data:', data);
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();




