#!/usr/bin/env node

/**
 * Run Schema SQL Script
 * Executes the schema.sql file to create/update database tables
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runSchema() {
  console.log('📋 Reading schema.sql file...');

  const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');

  if (!fs.existsSync(schemaPath)) {
    console.error(`❌ Schema file not found: ${schemaPath}`);
    process.exit(1);
  }

  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

  console.log('🚀 Executing schema SQL...');
  console.log(`   File size: ${(schemaSql.length / 1024).toFixed(2)} KB`);

  try {
    // Split by semicolons and execute each statement
    const statements = schemaSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`   Total statements: ${statements.length}`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i] + ';';

      // Skip comments
      if (stmt.trim().startsWith('--') || stmt.trim() === ';') {
        continue;
      }

      try {
        const { error } = await supabase.rpc('exec_sql', { sql: stmt }).single();

        if (error) {
          // Try direct query if RPC doesn't exist
          const { error: directError } = await supabase.from('_sql').insert({ query: stmt });

          if (directError) {
            console.error(`   ❌ Statement ${i + 1} failed: ${stmt.substring(0, 60)}...`);
            console.error(`      Error: ${error.message || directError.message}`);
            errorCount++;
          } else {
            successCount++;
          }
        } else {
          successCount++;
        }

        // Progress indicator
        if ((i + 1) % 10 === 0) {
          console.log(`   Progress: ${i + 1}/${statements.length} statements`);
        }
      } catch (err) {
        console.error(`   ❌ Unexpected error on statement ${i + 1}:`, err.message);
        errorCount++;
      }
    }

    console.log('\n✅ Schema execution completed!');
    console.log(`   Success: ${successCount} statements`);
    if (errorCount > 0) {
      console.log(`   ⚠️  Errors: ${errorCount} statements (some may be expected for existing objects)`);
    }

    // Verify kb_faqs table was created
    console.log('\n🔍 Verifying kb_faqs table...');
    const { data, error } = await supabase
      .from('kb_faqs')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ kb_faqs table verification failed:', error.message);
      console.log('\n💡 This might mean the table was not created. Try running the SQL directly in Supabase SQL Editor.');
    } else {
      console.log('✅ kb_faqs table exists and is accessible!');
    }

  } catch (error) {
    console.error('❌ Failed to execute schema:', error.message);
    console.log('\n💡 Alternative: Copy supabase/schema.sql content and paste into Supabase SQL Editor');
    console.log('   URL: https://supabase.com/dashboard/project/_/sql');
    process.exit(1);
  }
}

runSchema();
