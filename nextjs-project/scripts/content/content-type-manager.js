#!/usr/bin/env node

/**
 * 内容类型管理器
 * 帮助决定内容应该放在articles表还是knowledge_chunks表
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
 * 内容类型决策器
 */
function decideContentType(contentData) {
  const {
    title,
    content,
    purpose,
    targetAudience,
    length,
    structure,
    updateFrequency
  } = contentData;
  
  console.log('🤔 分析内容类型需求...\n');
  
  // 决策因子
  const factors = {
    isQuestionFormat: /^(how|when|what|why|should|can|does|is|are)/i.test(title),
    hasQuickAnswer: content.includes('## TL;DR') || content.includes('Bottom Line'),
    isShortForm: length < 2000,
    isStructured: structure === 'qa_format' || structure === 'structured',
    needsAI: purpose.includes('AI') || purpose.includes('RAG'),
    isUserEducation: purpose.includes('education') || purpose.includes('blog'),
    isFrequentlyUpdated: updateFrequency === 'frequent' || updateFrequency === 'monthly'
  };
  
  console.log('📊 决策因子分析:');
  Object.entries(factors).forEach(([factor, value]) => {
    console.log(`   ${value ? '✅' : '❌'} ${factor}: ${value}`);
  });
  
  // 评分系统
  let ragScore = 0;
  let articleScore = 0;
  
  // RAG知识库加分项
  if (factors.isQuestionFormat) ragScore += 3;
  if (factors.hasQuickAnswer) ragScore += 3;
  if (factors.isShortForm) ragScore += 2;
  if (factors.isStructured) ragScore += 2;
  if (factors.needsAI) ragScore += 3;
  if (factors.isFrequentlyUpdated) ragScore += 2;
  
  // 正规文章加分项
  if (!factors.isQuestionFormat && factors.isUserEducation) articleScore += 3;
  if (length >= 2000) articleScore += 3;
  if (structure === 'narrative') articleScore += 3;
  if (purpose.includes('SEO')) articleScore += 2;
  if (purpose.includes('brand')) articleScore += 2;
  
  console.log(`\n📈 评分结果:`);
  console.log(`   RAG知识库: ${ragScore}/15`);
  console.log(`   正规文章: ${articleScore}/15`);
  
  // 决策
  const recommendation = ragScore > articleScore ? 'knowledge_chunks' : 'articles';
  const confidence = Math.abs(ragScore - articleScore) >= 3 ? 'high' : 'medium';
  
  console.log(`\n🎯 推荐: ${recommendation === 'knowledge_chunks' ? 'RAG知识库' : '正规文章'}`);
  console.log(`   置信度: ${confidence}`);
  
  return {
    recommendation,
    confidence,
    ragScore,
    articleScore,
    factors
  };
}

/**
 * 生成内容模板
 */
function generateContentTemplate(decision) {
  console.log('\n📝 生成内容模板...\n');
  
  if (decision.recommendation === 'knowledge_chunks') {
    console.log('🧠 RAG知识库模板:');
    console.log(`
{
  "source_type": "kb_guide",
  "source_id": "UUID",
  "source_slug": "question-based-slug-2025",
  "title": "How/When/What/Why question format",
  "content": "## TL;DR\\n**关键答案：**\\n- 具体数字/时间\\n- 权威建议\\n\\n---\\n\\n## 权威指南对比\\n### 美国 (CDC/AAP)\\n### 加拿大 (Health Canada)\\n\\n## 实用操作指南\\n## 安全注意事项\\n## 权威来源引用",
  "summary": "2-3句摘要，包含关键数字",
  "category": "feeding-nutrition",
  "age_range": ["0-6 months", "6-12 months"],
  "tags": ["specific", "relevant", "tags"],
  "priority": 8,
  "risk_level": "low",
  "status": "published"
}`);
  } else {
    console.log('📝 正规文章模板:');
    console.log(`
{
  "slug": "seo-friendly-slug-2025",
  "type": "explainer",
  "hub": "feeding",
  "lang": "en",
  "title": "吸引眼球的标题",
  "one_liner": "50-200字符的吸引人描述",
  "key_facts": ["关键事实1", "关键事实2", "关键事实3"],
  "body_md": "完整的Markdown格式文章内容，包含：\\n- 引人入胜的开头\\n- 完整的叙述结构\\n- 权威来源引用\\n- 实用的建议和指导\\n- 清晰的结论",
  "age_range": "6-12 months",
  "region": "Global",
  "last_reviewed": "2025-01-06",
  "reviewed_by": "JupitLunar Editorial Team",
  "meta_title": "SEO优化的标题",
  "meta_description": "SEO优化的描述",
  "keywords": ["seo", "keywords", "array"],
  "status": "published"
}`);
  }
}

/**
 * 分析现有内容分布
 */
async function analyzeContentDistribution() {
  console.log('📊 分析现有内容分布...\n');
  
  try {
    // 分析articles表
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('id, slug, title, type, hub, status')
      .eq('status', 'published');
    
    if (articlesError) throw articlesError;
    
    // 分析knowledge_chunks表
    const { data: chunks, error: chunksError } = await supabase
      .from('knowledge_chunks')
      .select('id, source_slug, title, category, status')
      .eq('status', 'published');
    
    if (chunksError) throw chunksError;
    
    console.log('📈 内容分布统计:');
    console.log(`   正规文章 (articles): ${articles?.length || 0} 篇`);
    console.log(`   RAG知识库 (knowledge_chunks): ${chunks?.length || 0} 篇`);
    
    if (articles && articles.length > 0) {
      console.log('\n📝 正规文章类型分布:');
      const typeStats = {};
      articles.forEach(article => {
        typeStats[article.type] = (typeStats[article.type] || 0) + 1;
      });
      Object.entries(typeStats).forEach(([type, count]) => {
        console.log(`     ${type}: ${count} 篇`);
      });
    }
    
    if (chunks && chunks.length > 0) {
      console.log('\n🧠 RAG知识库类别分布:');
      const categoryStats = {};
      chunks.forEach(chunk => {
        categoryStats[chunk.category] = (categoryStats[chunk.category] || 0) + 1;
      });
      Object.entries(categoryStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .forEach(([category, count]) => {
          console.log(`     ${category}: ${count} 篇`);
        });
    }
    
    console.log('\n💡 建议:');
    if ((articles?.length || 0) < 10) {
      console.log('   📝 建议增加更多正规文章，用于SEO和品牌建设');
    }
    if ((chunks?.length || 0) < 50) {
      console.log('   🧠 建议增加更多RAG知识库内容，用于AI引用');
    }
    
  } catch (error) {
    console.error('❌ 分析失败:', error.message);
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 内容类型管理器\n');
  
  // 分析现有内容分布
  await analyzeContentDistribution();
  
  console.log('\n---\n');
  
  // 示例决策
  console.log('🎯 内容类型决策示例:\n');
  
  const examples = [
    {
      title: 'How much vitamin D does my baby need?',
      content: 'Short structured answer with TL;DR',
      purpose: 'AI citation, quick answers',
      length: 1200,
      structure: 'qa_format',
      updateFrequency: 'monthly'
    },
    {
      title: 'The Complete Guide to Baby Sleep Training',
      content: 'Long narrative article with stories',
      purpose: 'user education, SEO, brand building',
      length: 4000,
      structure: 'narrative',
      updateFrequency: 'yearly'
    }
  ];
  
  examples.forEach((example, index) => {
    console.log(`📄 示例 ${index + 1}: "${example.title}"`);
    const decision = decideContentType(example);
    generateContentTemplate(decision);
    console.log('\n---\n');
  });
  
  console.log('✅ 内容类型管理完成！');
  console.log('\n📋 下一步建议:');
  console.log('1. 根据推荐创建对应类型的内容');
  console.log('2. 使用相应的插入脚本');
  console.log('3. 定期分析内容分布和效果');
  console.log('4. 根据AI引用和SEO效果调整策略');
}

// 运行管理器
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  decideContentType,
  generateContentTemplate,
  analyzeContentDistribution
};
