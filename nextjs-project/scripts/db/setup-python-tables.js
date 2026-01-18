#!/usr/bin/env node

/**
 * 设置Python API采集需要的数据库表
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');
// Load env vars from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupTables() {
  console.log('🔧 正在设置Python API采集所需的数据库表...\n');
  
  try {
    // 创建sources表
    console.log('📋 创建 sources 表...');
    const { error: sourcesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS sources (
          id BIGSERIAL PRIMARY KEY,
          name TEXT UNIQUE NOT NULL,
          domain TEXT,
          licence TEXT,
          access_type TEXT,
          endpoint TEXT,
          notes TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });
    
    if (sourcesError) {
      console.log('ℹ️  sources表可能已存在');
    } else {
      console.log('✅ sources表创建成功');
    }
    
    // 创建docs表
    console.log('📄 创建 docs 表...');
    const { error: docsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS docs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          source_name TEXT NOT NULL,
          url TEXT,
          doi TEXT,
          title TEXT,
          lang TEXT,
          published_at TIMESTAMPTZ,
          licence TEXT,
          terms TEXT,
          hash TEXT,
          raw_json JSONB,
          text TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });
    
    if (docsError) {
      console.log('ℹ️  docs表可能已存在');
    } else {
      console.log('✅ docs表创建成功');
    }
    
    // 创建indicators表
    console.log('📊 创建 indicators 表...');
    const { error: indicatorsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS indicators (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          source_name TEXT NOT NULL,
          indicator_code TEXT,
          dims JSONB,
          value_json JSONB,
          observed_at DATE,
          licence TEXT,
          url TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });
    
    if (indicatorsError) {
      console.log('ℹ️  indicators表可能已存在');
    } else {
      console.log('✅ indicators表创建成功');
    }
    
    // 创建索引
    console.log('🔍 创建索引...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS docs_source_idx ON docs(source_name);
        CREATE INDEX IF NOT EXISTS docs_title_idx ON docs USING GIN (to_tsvector('simple', coalesce(title,'')));
        CREATE INDEX IF NOT EXISTS indicators_source_idx ON indicators(source_name);
      `
    });
    
    console.log('✅ 索引创建完成');
    
    console.log('\n🎉 数据库表设置完成！');
    console.log('\n现在可以运行Python脚本了：');
    console.log('cd /Users/cathleenlin/Downloads/mombaby_ingest');
    console.log('python3 ingest.py --sources pubmed --limit 10');
    
  } catch (error) {
    console.error('❌ 设置失败:', error.message);
    
    console.log('\n💡 手动解决方案：');
    console.log('1. 登录 Supabase 控制台');
    console.log('2. 进入 SQL Editor');
    console.log('3. 运行以下SQL：');
    console.log(`
-- 创建sources表
CREATE TABLE IF NOT EXISTS sources (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  domain TEXT,
  licence TEXT,
  access_type TEXT,
  endpoint TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建docs表
CREATE TABLE IF NOT EXISTS docs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_name TEXT NOT NULL,
  url TEXT,
  doi TEXT,
  title TEXT,
  lang TEXT,
  published_at TIMESTAMPTZ,
  licence TEXT,
  terms TEXT,
  hash TEXT,
  raw_json JSONB,
  text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建indicators表
CREATE TABLE IF NOT EXISTS indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_name TEXT NOT NULL,
  indicator_code TEXT,
  dims JSONB,
  value_json JSONB,
  observed_at DATE,
  licence TEXT,
  url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS docs_source_idx ON docs(source_name);
CREATE INDEX IF NOT EXISTS docs_title_idx ON docs USING GIN (to_tsvector('simple', coalesce(title,'')));
CREATE INDEX IF NOT EXISTS indicators_source_idx ON indicators(source_name);
    `);
  }
}

if (require.main === module) {
  setupTables();
}

module.exports = { setupTables };
