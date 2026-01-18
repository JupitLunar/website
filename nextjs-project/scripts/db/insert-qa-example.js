#!/usr/bin/env node

/**
 * 问答插入示例脚本
 * 演示如何插入AEO优化的问答内容到RAG数据库
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// 加载环境变量
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少必要的环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * AEO优化的问答内容示例
 */
const qaExamples = [
  {
    question: "When can my baby start eating solid foods?",
    answer: "Most babies can start solid foods around 6 months when they show readiness signs like sitting up, showing interest in food, and losing the tongue-thrust reflex.",
    category: "feeding-nutrition",
    age_range: ["6-12 months"],
    tags: ["solid-foods", "introduction", "6-months", "readiness", "cdc", "aap"]
  },
  {
    question: "How much vitamin D does my breastfed baby need?",
    answer: "Breastfed babies need 400 IU/day vitamin D from birth through 12 months, then 600 IU/day from 12-24 months. This is because breast milk typically doesn't provide enough vitamin D.",
    category: "supplement",
    age_range: ["0-6 months", "6-12 months", "12-24 months"],
    tags: ["vitamin-d", "supplements", "breastfeeding", "400-iu", "cdc", "aap"]
  },
  {
    question: "What are safe first foods for babies?",
    answer: "Safe first foods include iron-rich options like pureed meats, iron-fortified cereals, and soft cooked vegetables. Start with single-ingredient foods and avoid honey, cow's milk, and choking hazards.",
    category: "feeding-nutrition",
    age_range: ["6-12 months"],
    tags: ["first-foods", "iron-rich", "safety", "purees", "cdc", "health-canada"]
  },
  {
    question: "How often should I feed my 6-month-old baby?",
    answer: "At 6 months, offer solid foods 1-2 times per day, gradually increasing to 3 meals by 12 months. Continue breastfeeding or formula as the primary nutrition source.",
    category: "feeding-nutrition",
    age_range: ["6-12 months"],
    tags: ["feeding-frequency", "6-months", "meals", "breastfeeding", "formula"]
  },
  {
    question: "When can my baby drink water?",
    answer: "Babies under 6 months don't need water. From 6-12 months, offer 4-8 ounces of water per day with meals. Use an open cup or straw cup, not a bottle.",
    category: "beverages",
    age_range: ["0-6 months", "6-12 months"],
    tags: ["water", "hydration", "6-months", "cups", "cdc", "aap"]
  }
];

/**
 * 生成完整的RAG内容
 */
function generateRAGContent(qa) {
  const slug = qa.question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50) + '-2025';

  return {
    source_type: 'kb_guide',
    source_id: require('crypto').randomUUID(),
    source_slug: slug,
    title: qa.question,
    content: `## TL;DR
**${qa.answer}**

---

## 权威指南对比

### 美国 (CDC/AAP)
- 基于最新科学证据
- 遵循官方指南建议
- 定期更新标准

### 加拿大 (Health Canada)
- 符合加拿大营养标准
- 考虑地区差异
- 与CPS指南一致

---

## 实用操作指南

### 何时开始？
- 观察发育就绪信号
- 咨询儿科医生
- 选择合适的时机

### 如何操作？
1. 准备合适的环境
2. 选择合适的食物
3. 观察婴儿反应
4. 逐步增加频率

### 安全注意事项
- 避免窒息危险
- 确保食物温度适宜
- 监督进食过程
- 注意过敏反应

---

## 特殊情况处理
- 早产儿：使用纠正年龄
- 发育迟缓：咨询专业医生
- 过敏风险：谨慎引入新食物

---

## 权威来源引用
- [CDC](https://www.cdc.gov): "When, What, and How to Introduce Solid Foods"
- [AAP](https://www.healthychildren.org): "Starting Solid Foods"
- [Health Canada](https://www.canada.ca): "Nutrition for Healthy Term Infants"

---

## 免责声明
此内容仅供教育目的，不替代专业医疗建议。请咨询您的儿科医生获取个性化指导。`,
    summary: qa.answer,
    category: qa.category,
    age_range: qa.age_range,
    locale: 'Global',
    priority: 8,
    risk_level: 'low',
    tags: qa.tags,
    status: 'published'
  };
}

/**
 * 插入单个问答
 */
async function insertQA(qa, index) {
  console.log(`📝 插入问答 ${index + 1}: "${qa.question}"`);
  
  try {
    const ragContent = generateRAGContent(qa);
    
    const { data, error } = await supabase
      .from('knowledge_chunks')
      .insert([ragContent])
      .select();
    
    if (error) throw error;
    
    console.log(`   ✅ 插入成功 - ID: ${data[0].id}`);
    console.log(`   🔗 Slug: ${data[0].source_slug}`);
    console.log(`   📂 类别: ${data[0].category}`);
    console.log(`   👶 年龄: ${data[0].age_range.join(', ')}`);
    console.log('');
    
    return data[0];
    
  } catch (error) {
    console.log(`   ❌ 插入失败: ${error.message}`);
    if (error.code === '23505') {
      console.log(`   💡 建议: 修改slug避免重复`);
    }
    console.log('');
    return null;
  }
}

/**
 * 批量插入问答
 */
async function insertAllQAs() {
  console.log('🚀 开始批量插入AEO问答内容...\n');
  
  let successCount = 0;
  let failureCount = 0;
  
  for (let i = 0; i < qaExamples.length; i++) {
    const result = await insertQA(qaExamples[i], i);
    if (result) {
      successCount++;
    } else {
      failureCount++;
    }
  }
  
  console.log('📊 插入结果统计:');
  console.log(`   ✅ 成功: ${successCount} 个`);
  console.log(`   ❌ 失败: ${failureCount} 个`);
  console.log(`   📈 成功率: ${Math.round((successCount / qaExamples.length) * 100)}%`);
  
  return { successCount, failureCount };
}

/**
 * 验证插入结果
 */
async function verifyInsertion() {
  console.log('\n🔍 验证插入结果...\n');
  
  try {
    // 检查最近插入的内容
    const { data: recentChunks, error } = await supabase
      .from('knowledge_chunks')
      .select('id, source_slug, title, category, age_range, tags, embedding')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    
    console.log('📋 最近插入的内容:');
    recentChunks.forEach((chunk, index) => {
      console.log(`   ${index + 1}. ${chunk.title}`);
      console.log(`      类别: ${chunk.category}`);
      console.log(`      年龄: ${chunk.age_range?.join(', ') || 'N/A'}`);
      console.log(`      标签: ${chunk.tags?.slice(0, 3).join(', ') || 'N/A'}`);
      console.log(`      嵌入: ${chunk.embedding ? '✅' : '❌'}`);
      console.log('');
    });
    
    // 统计类别分布
    const categoryStats = {};
    recentChunks.forEach(chunk => {
      categoryStats[chunk.category] = (categoryStats[chunk.category] || 0) + 1;
    });
    
    console.log('📊 类别分布:');
    Object.entries(categoryStats).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} 个`);
    });
    
  } catch (error) {
    console.error('❌ 验证失败:', error.message);
  }
}

/**
 * 显示使用说明
 */
function showUsageInstructions() {
  console.log('\n📖 使用说明:\n');
  
  console.log('🎯 问答插入流程:');
  console.log('   1. 准备问答内容 (问题 + 简洁答案)');
  console.log('   2. 确定类别和年龄范围');
  console.log('   3. 运行插入脚本');
  console.log('   4. 验证插入结果');
  console.log('   5. 监控AI引用效果');
  console.log('');
  
  console.log('📝 问答格式要求:');
  console.log('   - 问题: 自然语言，以How/When/What/Why开头');
  console.log('   - 答案: 简洁明确，包含关键数字');
  console.log('   - 类别: 选择合适的category');
  console.log('   - 年龄: 明确的age_range');
  console.log('   - 标签: 5-8个相关tags');
  console.log('');
  
  console.log('🔧 自定义插入:');
  console.log('   - 修改 qaExamples 数组');
  console.log('   - 添加您的问答内容');
  console.log('   - 重新运行脚本');
  console.log('');
  
  console.log('📊 监控工具:');
  console.log('   - monitor-ai-citations.js: 监控AI引用');
  console.log('   - test-ai-feeds.js: 测试AI feed端点');
  console.log('   - content-type-manager.js: 内容类型决策');
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 AEO问答插入示例工具\n');
  
  // 显示使用说明
  showUsageInstructions();
  
  console.log('---\n');
  
  // 批量插入问答
  const result = await insertAllQAs();
  
  console.log('---\n');
  
  // 验证插入结果
  await verifyInsertion();
  
  console.log('\n✅ AEO问答插入完成！');
  console.log('\n📋 下一步:');
  console.log('1. 检查插入的内容是否正确');
  console.log('2. 运行嵌入向量生成');
  console.log('3. 测试RAG搜索功能');
  console.log('4. 监控AI引用情况');
  
  if (result.successCount > 0) {
    console.log('\n🎉 成功插入了AEO优化的问答内容！');
    console.log('   这些内容将有助于提升AI引用率。');
  }
}

// 运行脚本
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  insertQA,
  insertAllQAs,
  generateRAGContent,
  qaExamples
};
