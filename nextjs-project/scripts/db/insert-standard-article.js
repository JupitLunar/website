#!/usr/bin/env node

/**
 * 标准RAG文章插入脚本
 * 按照标准格式插入文章到knowledge_chunks表
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// 加载环境变量
const dotenv = require('dotenv');
// Load env vars from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少必要的环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 标准文章数据示例
 */
const standardArticle = {
  source_type: 'kb_guide',
  source_id: require('crypto').randomUUID(), // 生成UUID
  source_slug: 'when-can-baby-drink-water-how-much-appropriate-2025',
  title: 'When can my baby drink water, and how much is appropriate?',
  content: `## TL;DR
**水饮用指南：**
- 6个月以下：不建议额外饮水
- 6-12个月：4-8盎司/天 (118-237毫升)
- 12个月以上：水和牛奶成为主要饮料
- 使用开口杯或吸管杯，避免奶瓶

---

## 为什么限制早期饮水？

婴儿的肾脏和钠平衡尚未成熟；早期或过量饮水可能影响热量摄入，极端情况下存在水中毒风险。在前6个月坚持母乳/配方奶，6个月后适量饮水。

---

## 权威指南对比

### 美国 (CDC)
- 6-12个月：4-8盎司/天
- 支持开口杯/吸管杯练习
- 配餐饮用

### 加拿大 (Health Canada)
- 强化母乳作为主要营养来源
- 渐进式引入杯子
- 安全的饮水指导

---

## 实用操作指南

### 何时开始？
- 开始添加辅食时 (约6个月)
- 婴儿能坐稳时
- 对杯子表现出兴趣时

### 如何操作？
1. 选择适合的杯子：开口杯或软嘴吸管杯
2. 餐时提供：配餐饮用
3. 小量开始：1-2盎司
4. 逐渐增加：观察婴儿需求

### 份量和频率
- 初始份量：1-2盎司/次
- 每日总量：4-8盎司
- 频率：餐时提供
- 时间：6-12个月期间

---

## 安全注意事项
- 不要将水放在奶瓶中
- 避免过量饮水影响营养摄入
- 确保水质安全
- 监督饮用过程

---

## 特殊情况处理
- 炎热天气：可适当增加饮水量
- 生病期间：按医生建议
- 便秘时：可能增加饮水量

---

## 权威来源引用
- [CDC](https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/water.html): "Foods & Drinks to Encourage" (2024)
- [AAP](https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/How-to-Safely-Prepare-Formula-with-Water.aspx): "Water for Formula Preparation" (2024)
- [Health Canada](https://www.canada.ca/en/health-canada/services/canada-food-guide/resources/nutrition-healthy-term-infants.html): "Nutrition for Healthy Term Infants" (2023)

---

## 免责声明
此内容仅供教育目的，不替代专业医疗建议。请咨询您的儿科医生获取个性化指导。`,
  summary: 'Under 6 months: No extra water needed. 6-12 months: 4-8 fl oz (118-237 mL) per day with meals while milk remains primary. Use open or straw cup, not bottle.',
  category: 'beverages',
  subcategory: 'water-introduction',
  age_range: ['0-6 months', '6-12 months', '12-24 months'],
  locale: 'Global',
  priority: 8,
  risk_level: 'low',
  tags: ['water', 'beverages', '6-12-months', 'hydration', 'cup-feeding', 'cdc', 'aap', 'health-canada'],
  status: 'published'
};

/**
 * 插入标准格式文章
 */
async function insertStandardArticle() {
  console.log('📝 插入标准格式RAG文章...\n');
  
  try {
    console.log(`📄 文章标题: ${standardArticle.title}`);
    console.log(`📂 类别: ${standardArticle.category}`);
    console.log(`👶 年龄范围: ${standardArticle.age_range.join(', ')}`);
    console.log(`🏷️ 标签: ${standardArticle.tags.join(', ')}`);
    console.log(`📊 优先级: ${standardArticle.priority}`);
    console.log(`⚠️ 风险等级: ${standardArticle.risk_level}`);
    console.log('');
    
    // 插入到knowledge_chunks表
    const { data, error } = await supabase
      .from('knowledge_chunks')
      .insert([standardArticle])
      .select();
    
    if (error) throw error;
    
    console.log('✅ 文章插入成功！');
    console.log(`📋 记录ID: ${data[0].id}`);
    console.log(`🔗 Slug: ${data[0].source_slug}`);
    console.log('');
    
    // 生成嵌入向量
    console.log('🧠 生成嵌入向量...');
    
    try {
      const { data: embeddingData, error: embeddingError } = await supabase.functions.invoke(
        'generate-embeddings',
        {
          body: {
            chunks: [{
              id: data[0].id,
              content: standardArticle.content
            }]
          }
        }
      );
      
      if (embeddingError) throw embeddingError;
      
      console.log('✅ 嵌入向量生成成功！');
      console.log(`📊 向量维度: ${embeddingData.embeddings[0]?.embedding?.length || 'N/A'}`);
      
    } catch (embeddingError) {
      console.log('⚠️ 嵌入向量生成失败，但文章已插入');
      console.log(`   错误: ${embeddingError.message}`);
      console.log('   建议: 手动运行嵌入向量生成脚本');
    }
    
    console.log('');
    console.log('🎉 标准格式文章插入完成！');
    console.log('\n📋 下一步:');
    console.log('1. 验证文章在数据库中的格式');
    console.log('2. 测试RAG搜索功能');
    console.log('3. 检查AI feed端点');
    console.log('4. 监控AI引用情况');
    
  } catch (error) {
    console.error('❌ 插入失败:', error.message);
    
    if (error.code === '23505') {
      console.log('\n💡 解决建议:');
      console.log('   - 文章slug已存在，请修改source_slug');
      console.log('   - 或删除现有文章后重新插入');
    }
  }
}

/**
 * 验证插入的文章格式
 */
async function verifyArticleFormat() {
  console.log('🔍 验证文章格式...\n');
  
  try {
    const { data: articles, error } = await supabase
      .from('knowledge_chunks')
      .select('*')
      .eq('source_slug', standardArticle.source_slug);
    
    if (error) throw error;
    
    if (!articles || articles.length === 0) {
      console.log('❌ 未找到文章');
      return;
    }
    
    const article = articles[0]; // 取第一条记录
    
    console.log('✅ 文章验证成功！');
    console.log('\n📊 格式检查:');
    
    // 检查必需字段
    const requiredFields = [
      'source_type', 'source_id', 'source_slug', 'title', 'content', 'summary',
      'category', 'age_range', 'locale', 'priority', 'risk_level', 'tags', 'status'
    ];
    
    requiredFields.forEach(field => {
      const value = article[field];
      const status = value !== null && value !== undefined && value !== '' ? '✅' : '❌';
      console.log(`   ${status} ${field}: ${JSON.stringify(value)}`);
    });
    
    // 检查内容质量
    console.log('\n📝 内容质量检查:');
    console.log(`   📏 内容长度: ${article.content?.length || 0} 字符`);
    console.log(`   📄 摘要长度: ${article.summary?.length || 0} 字符`);
    console.log(`   🏷️ 标签数量: ${article.tags?.length || 0} 个`);
    console.log(`   👶 年龄范围: ${article.age_range?.length || 0} 个`);
    
    // 检查嵌入向量
    console.log(`   🧠 嵌入向量: ${article.embedding ? '✅ 已生成' : '❌ 未生成'}`);
    
    // 内容结构检查
    const content = article.content || '';
    const hasTLDR = content.includes('## TL;DR') || content.includes('**关键');
    const hasSources = content.includes('权威来源') || content.includes('Sources');
    const hasDisclaimer = content.includes('免责声明') || content.includes('Disclaimer');
    
    console.log('\n📋 内容结构检查:');
    console.log(`   ${hasTLDR ? '✅' : '❌'} 首屏即答案格式`);
    console.log(`   ${hasSources ? '✅' : '❌'} 权威来源引用`);
    console.log(`   ${hasDisclaimer ? '✅' : '❌'} 免责声明`);
    
    // 标题格式检查
    const title = article.title || '';
    const hasQuestionWords = /^(how|when|what|why|should|can|does|is|are)/i.test(title);
    console.log(`   ${hasQuestionWords ? '✅' : '❌'} 问答式标题`);
    
  } catch (error) {
    console.error('❌ 验证失败:', error.message);
  }
}

/**
 * 显示格式标准
 */
function showFormatStandards() {
  console.log('📋 RAG文章格式标准:\n');
  
  console.log('🎯 必需字段:');
  console.log('   - source_type: "kb_guide"');
  console.log('   - source_slug: "unique-slug-2025"');
  console.log('   - title: "问题导向标题"');
  console.log('   - content: "完整文章内容"');
  console.log('   - summary: "2-3句摘要"');
  console.log('   - category: "主要类别"');
  console.log('   - age_range: ["具体年龄范围"]');
  console.log('   - tags: ["相关标签"]');
  console.log('');
  
  console.log('📝 内容结构:');
  console.log('   1. TL;DR / Bottom Line');
  console.log('   2. 权威指南对比');
  console.log('   3. 实用操作指南');
  console.log('   4. 安全注意事项');
  console.log('   5. 权威来源引用');
  console.log('   6. 免责声明');
  console.log('');
  
  console.log('🏷️ 标签标准:');
  console.log('   - 权威来源: ["cdc", "aap", "health-canada"]');
  console.log('   - 年龄范围: ["0-6-months", "6-12-months"]');
  console.log('   - 主题标签: ["breastfeeding", "solid-foods"]');
  console.log('   - 地区标签: ["us-guidelines", "global-standards"]');
  console.log('');
  
  console.log('📊 质量标准:');
  console.log('   - 标题包含问题关键词 (how, when, what, why)');
  console.log('   - 首段包含明确答案和关键数字');
  console.log('   - 包含权威来源引用');
  console.log('   - 内容长度: 1500-3000字符');
  console.log('   - 标签数量: 5-8个');
}

// 主函数
async function main() {
  console.log('🚀 RAG文章标准格式插入工具\n');
  
  // 显示格式标准
  showFormatStandards();
  
  console.log('---\n');
  
  // 插入标准文章
  await insertStandardArticle();
  
  console.log('\n---\n');
  
  // 验证插入结果
  await verifyArticleFormat();
  
  console.log('\n✅ 标准格式文章插入完成！');
  console.log('\n📖 更多信息:');
  console.log('   - 查看 RAG_ARTICLE_FORMAT_TEMPLATE.md 了解详细格式');
  console.log('   - 运行 monitor-ai-citations.js 监控AI引用情况');
  console.log('   - 使用 test-ai-feeds.js 测试AI feed端点');
}

// 运行脚本
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  insertStandardArticle,
  verifyArticleFormat,
  showFormatStandards,
  standardArticle
};
