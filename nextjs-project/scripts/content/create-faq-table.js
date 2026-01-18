#!/usr/bin/env node

/**
 * Create kb_faqs table directly via Supabase API
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
// Load env vars from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

// Use service role key for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createFAQTable() {
  console.log('🚀 Creating kb_faqs table...\n');

  const sqlPath = path.join(__dirname, '..', 'supabase', 'add_kb_faqs_table.sql');
  const sql = fs.readFileSync(sqlPath, 'utf-8');

  try {
    // Execute the SQL using Supabase's REST API
    // Note: This requires the service role key
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        query: sql
      })
    });

    if (!response.ok) {
      // If exec endpoint doesn't exist, we need to use alternative method
      console.log('⚠️  Direct SQL execution not available via API');
      console.log('📋 Please run SQL manually in Supabase dashboard:\n');
      console.log('   1. Open: https://supabase.com/dashboard/project/_/sql');
      console.log(`   2. Copy SQL from: ${sqlPath}`);
      console.log('   3. Paste and click "Run"\n');

      // Try to verify if table already exists
      console.log('🔍 Checking if kb_faqs table already exists...');
      const { data, error } = await supabase
        .from('kb_faqs')
        .select('id')
        .limit(1);

      if (error) {
        if (error.code === '42P01') { // Table does not exist
          console.log('❌ Table does not exist yet');
          console.log('\n💡 Run the SQL file manually in dashboard');
        } else {
          console.log('❌ Error checking table:', error.message);
        }
      } else {
        console.log('✅ Table already exists! You\'re good to go.');

        // Count rows
        const { count } = await supabase
          .from('kb_faqs')
          .select('*', { count: 'exact', head: true });

        console.log(`   Current FAQ count: ${count || 0}`);
      }

      return;
    }

    const result = await response.json();
    console.log('✅ SQL executed successfully!');
    console.log('   Result:', result);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n📋 Alternative: Run SQL manually');
    console.log('   File:', sqlPath);
    console.log('   Dashboard: https://supabase.com/dashboard/project/_/sql');
    return;
  }

  // Verify table was created
  console.log('\n🔍 Verifying kb_faqs table...');
  try {
    const { data, error, count } = await supabase
      .from('kb_faqs')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('❌ Verification failed:', error.message);
    } else {
      console.log('✅ kb_faqs table verified successfully!');
      console.log(`   Table exists with ${count || 0} rows`);

      // Try to insert sample data if not exists
      const { data: existing } = await supabase
        .from('kb_faqs')
        .select('slug')
        .eq('slug', 'when-start-solid-foods')
        .single();

      if (!existing) {
        console.log('\n📝 Inserting sample FAQ...');
        const { error: insertError } = await supabase
          .from('kb_faqs')
          .insert({
            slug: 'when-start-solid-foods',
            question: 'When should I start solid foods—and what are the readiness signs?',
            answer: 'Most babies are ready for solid foods around **6 months** of age. Key readiness signs include:\n\n- Baby can sit up with minimal support\n- Has good head and neck control\n- Shows interest in food\n\nAlways consult your pediatrician.',
            category: 'feeding',
            subcategory: 'solid-introduction',
            age_range: ['0-6 months', '6-12 months'],
            related_topic_slugs: ['feeding-foundations'],
            priority: 10,
            status: 'published'
          });

        if (insertError) {
          console.error('   ⚠️  Sample insert failed:', insertError.message);
        } else {
          console.log('   ✅ Sample FAQ inserted!');
        }
      } else {
        console.log('   ℹ️  Sample FAQ already exists');
      }
    }
  } catch (err) {
    console.error('❌ Verification error:', err.message);
  }

  console.log('\n🎉 Done! kb_faqs table is ready to use.');
  console.log('\n📚 Next steps:');
  console.log('   1. Add your FAQs using the Supabase dashboard or scripts');
  console.log('   2. Link FAQs to topics using related_topic_slugs');
  console.log('   3. Link FAQs to foods using related_food_ids');
  console.log('\n💡 Check docs/AEO_OPTIMIZATION_SUMMARY.md for usage examples');
}

createFAQTable().catch(console.error);
