#!/usr/bin/env node

/**
 * 快速知识库扩展工具
 * 提供交互式界面来添加新的知识库内容
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const readline = require('readline');

// 加载环境变量
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 预定义的选项
const CATEGORIES = ['feeding', 'sleep', 'development', 'safety', 'health', 'parenting'];
const SUBCATEGORIES = {
  feeding: ['solid-foods', 'breastfeeding', 'bottle-feeding', 'allergens'],
  sleep: ['sleep-training', 'bedtime-routine', 'naps', 'night-waking'],
  development: ['milestones', 'motor-skills', 'language', 'social'],
  safety: ['choking-prevention', 'home-safety', 'car-safety', 'sleep-safety'],
  health: ['illness', 'medications', 'vaccines', 'growth'],
  parenting: ['discipline', 'behavior', 'stress', 'support']
};
const AGE_RANGES = ['0-6 months', '6-12 months', '12-24 months', '2-3 years'];
const RISK_LEVELS = ['none', 'low', 'medium', 'high'];

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

function askChoice(question, choices) {
  return new Promise((resolve) => {
    console.log(question);
    choices.forEach((choice, index) => {
      console.log(`${index + 1}. ${choice}`);
    });
    rl.question('请选择 (输入数字): ', (answer) => {
      const choice = parseInt(answer) - 1;
      if (choice >= 0 && choice < choices.length) {
        resolve(choices[choice]);
      } else {
        console.log('❌ 无效选择，请重新输入');
        askChoice(question, choices).then(resolve);
      }
    });
  });
}

async function collectKnowledgeChunkData() {
  console.log('\n📝 创建新的知识库内容\n');
  
  const data = {};
  
  // 基本信息
  data.title = await askQuestion('📋 问题标题: ');
  data.source_slug = data.title.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50) + '-2025';
  
  console.log('\n📄 内容结构 (使用标准模板):');
  console.log('1. TL;DR 摘要');
  console.log('2. 权威来源对比');
  console.log('3. 实用操作指南');
  console.log('4. 安全注意事项');
  
  data.content = await askQuestion('\n📝 详细内容 (支持 Markdown 格式): ');
  data.summary = await askQuestion('📄 一句话摘要: ');
  
  // 分类信息
  data.category = await askChoice('\n🏷️ 选择主类别:', CATEGORIES);
  data.subcategory = await askChoice('🏷️ 选择子类别:', SUBCATEGORIES[data.category]);
  
  // 年龄范围
  const ageChoice = await askChoice('\n👶 选择适用的年龄范围:', AGE_RANGES);
  data.age_range = [ageChoice];
  
  // 风险等级
  data.risk_level = await askChoice('\n⚠️ 选择风险等级:', RISK_LEVELS);
  
  // 标签
  const tagsInput = await askQuestion('🏷️ 输入标签 (用逗号分隔): ');
  data.tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
  
  // 系统字段
  data.source_type = 'kb_guide';
  data.source_id = require('crypto').randomUUID();
  data.locale = 'Global';
  data.priority = 8;
  data.status = 'published';
  
  return data;
}

async function insertKnowledgeChunk(chunkData) {
  try {
    console.log('\n💾 正在插入知识块...');
    
    const { data, error } = await supabase
      .from('knowledge_chunks')
      .insert([chunkData])
      .select();
    
    if (error) {
      console.error('❌ 插入失败:', error);
      return false;
    }
    
    console.log('✅ 成功插入知识块!');
    console.log(`📋 ID: ${data[0].id}`);
    console.log(`📄 标题: ${data[0].title}`);
    console.log(`🏷️ 类别: ${data[0].category}`);
    
    return true;
  } catch (error) {
    console.error('❌ 处理过程中出错:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 知识库快速扩展工具');
  console.log('========================\n');
  
  try {
    const chunkData = await collectKnowledgeChunkData();
    
    console.log('\n📋 确认信息:');
    console.log(`标题: ${chunkData.title}`);
    console.log(`类别: ${chunkData.category} > ${chunkData.subcategory}`);
    console.log(`年龄范围: ${chunkData.age_range.join(', ')}`);
    console.log(`风险等级: ${chunkData.risk_level}`);
    console.log(`标签: ${chunkData.tags.join(', ')}`);
    
    const confirm = await askQuestion('\n❓ 确认插入? (y/n): ');
    
    if (confirm.toLowerCase() === 'y' || confirm.toLowerCase() === 'yes') {
      const success = await insertKnowledgeChunk(chunkData);
      
      if (success) {
        console.log('\n🎉 知识库扩展完成!');
        console.log('\n📝 后续步骤:');
        console.log('1. 运行 node scripts/generate-embeddings.js 生成向量嵌入');
        console.log('2. 测试 RAG 搜索功能');
        console.log('3. 验证 AI 引用效果');
      }
    } else {
      console.log('❌ 已取消操作');
    }
    
  } catch (error) {
    console.error('❌ 程序出错:', error);
  } finally {
    rl.close();
  }
}

// 运行程序
if (require.main === module) {
  main();
}

module.exports = { collectKnowledgeChunkData, insertKnowledgeChunk };


