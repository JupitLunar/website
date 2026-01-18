#!/usr/bin/env node

/**
 * 测试AEO组件集成
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
 * 测试AEO组件数据生成
 */
async function testAEOComponents() {
  console.log('🧪 测试AEO组件集成...\n');
  
  try {
    // 获取一些现有的文章进行测试
    const { data: articles, error } = await supabase
      .from('knowledge_chunks')
      .select('*')
      .eq('status', 'published')
      .limit(5);
    
    if (error) throw error;
    
    console.log(`📊 找到 ${articles.length} 篇文章进行AEO测试\n`);
    
    for (const article of articles) {
      console.log(`📄 测试文章: ${article.title}`);
      console.log(`   类别: ${article.category}`);
      console.log(`   年龄范围: ${article.age_range?.join(', ') || 'N/A'}`);
      console.log(`   标签: ${article.tags?.slice(0, 3).join(', ') || 'N/A'}`);
      
      // 测试BottomLineAnswer组件数据生成
      const bottomLineData = generateBottomLineData(article);
      console.log(`   ✅ BottomLineAnswer数据生成成功`);
      console.log(`      问题: ${bottomLineData.question}`);
      console.log(`      答案长度: ${bottomLineData.answer.length} 字符`);
      console.log(`      关键数字: ${bottomLineData.keyNumbers.length} 个`);
      console.log(`      行动要点: ${bottomLineData.actionItems.length} 个`);
      
      // 测试US/CA对比数据（如果适用）
      if (article.category === 'feeding-nutrition' && article.age_range?.includes('6-12 months')) {
        const comparisonData = generateComparisonData(article);
        console.log(`   ✅ US/CA对比数据生成成功`);
        console.log(`      对比项: ${Object.keys(comparisonData.usData).length} 个`);
      }
      
      // 测试结构化数据生成
      const schemaData = generateSchemaData(article);
      console.log(`   ✅ 结构化数据生成成功`);
      console.log(`      Schema类型: ${schemaData['@type']?.join(', ') || schemaData['@type']}`);
      
      console.log('');
    }
    
    // 测试预设模板
    console.log('🎯 测试预设AEO模板...\n');
    
    const templates = [
      { type: 'vitaminD', topic: '维生素D补充' },
      { type: 'solidFoods', topic: '固体食物引入' },
      { type: 'cowMilk', topic: '牛奶过渡' }
    ];
    
    for (const template of templates) {
      console.log(`📋 模板: ${template.topic}`);
      const templateData = getTemplateData(template.type);
      console.log(`   ✅ 模板数据生成成功`);
      console.log(`      问题: ${templateData.question}`);
      console.log(`      关键数字: ${templateData.keyNumbers.length} 个`);
      console.log(`      行动要点: ${templateData.actionItems.length} 个`);
      console.log('');
    }
    
    console.log('🎉 AEO组件集成测试完成！');
    console.log('\n💡 下一步建议:');
    console.log('   1. 在React页面中集成这些组件');
    console.log('   2. 验证结构化数据的正确性');
    console.log('   3. 测试移动端显示效果');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

/**
 * 生成BottomLineAnswer组件数据
 */
function generateBottomLineData(article) {
  // 提取关键数字
  const keyNumbers = [];
  const content = article.content || '';
  
  // 查找年龄、剂量、频率等数字
  const numberMatches = content.match(/\b(\d+)\s*(months?|years?|days?|weeks?|mg|ml|oz|tbsp|tsp|iu|mcg|hours?)\b/gi);
  if (numberMatches) {
    keyNumbers.push(...Array.from(new Set(numberMatches)).slice(0, 5));
  }
  
  // 提取行动要点
  const actionItems = [];
  const actionMatches = content.match(/(?:Start|Begin|Offer|Give|Introduce|Avoid|Wait|Continue|Stop|Use|Try|Ensure|Monitor|Contact|Seek|Consult)\s+[^.!?]*[.!?]/gi);
  if (actionMatches) {
    actionItems.push(...Array.from(new Set(actionMatches)).slice(0, 3));
  }
  
  // 生成首屏答案
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const answer = sentences[0]?.trim() || content.substring(0, 200) + '...';
  
  return {
    question: article.title,
    answer: answer,
    keyNumbers: keyNumbers,
    actionItems: actionItems,
    ageRange: article.age_range?.join(', ') || '0-24 months',
    region: article.locale === 'Global' ? '北美' : article.locale,
    sources: ['CDC', 'AAP', 'Health Canada']
  };
}

/**
 * 生成US/CA对比数据
 */
function generateComparisonData(article) {
  // 根据文章类别生成相应的对比数据
  const comparisonTemplates = {
    'feeding-nutrition': {
      usData: {
        "推荐开始时间": "约6个月",
        "首选食物": "铁丰富的肉类和强化谷物",
        "食物顺序": "无固定顺序，优先铁丰富食物",
        "每日频率": "逐渐增加到2-3餐/天",
        "初始份量": "1-2汤匙"
      },
      caData: {
        "推荐开始时间": "约6个月", 
        "首选食物": "铁丰富的肉类和强化谷物",
        "食物顺序": "铁丰富的肉类和谷物作为首选",
        "每日频率": "6-12个月每天多次提供",
        "初始份量": "小量开始，逐渐增加"
      }
    }
  };
  
  return comparisonTemplates[article.category] || {
    usData: { "指南": "基于CDC/AAP建议" },
    caData: { "指南": "基于Health Canada建议" }
  };
}

/**
 * 生成结构化数据
 */
function generateSchemaData(article) {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalWebPage", "Article"],
    "headline": article.title,
    "description": article.summary,
    "about": "Infant and toddler health",
    "inLanguage": "en-US",
    "datePublished": new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "JupitLunar Editorial Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "JupitLunar"
    }
  };
}

/**
 * 获取预设模板数据
 */
function getTemplateData(type) {
  const templates = {
    vitaminD: {
      question: "我的母乳喂养宝宝需要维生素D补充剂吗？",
      answer: "是的，母乳喂养的婴儿通常需要维生素D补充剂。母乳中维生素D含量通常不足以满足婴儿需求，因此建议从出生后不久开始每天补充400 IU的维生素D。",
      keyNumbers: ["400 IU/day (0-12个月)", "600 IU/day (12-24个月)", "出生后不久开始"],
      actionItems: [
        "咨询儿科医生确定具体补充计划",
        "选择适合婴儿的维生素D滴剂", 
        "坚持每天按时补充",
        "12个月后根据医生建议调整剂量"
      ]
    },
    solidFoods: {
      question: "什么时候可以开始给宝宝添加固体食物？",
      answer: "大多数婴儿在6个月左右可以开始添加固体食物，具体时间取决于发育就绪的信号。优先选择铁丰富的食物，如肉类、强化谷物等。",
      keyNumbers: ["约6个月", "1-2汤匙开始", "2-3餐/天"],
      actionItems: [
        "观察婴儿发育就绪信号",
        "从铁丰富的食物开始",
        "一次引入一种新食物",
        "保持母乳或配方奶作为主要营养"
      ]
    },
    cowMilk: {
      question: "什么时候可以给宝宝喝牛奶？",
      answer: "在美国建议12个月后引入全脂牛奶，在加拿大可以在9-12个月之间引入（如果婴儿已经开始吃铁丰富的固体食物）。牛奶不应在12个月前作为主要饮料。",
      keyNumbers: ["美国: ≥12个月", "加拿大: 9-12个月", "全脂牛奶", "16-24盎司/天"],
      actionItems: [
        "确保婴儿已经开始吃铁丰富的固体食物",
        "从全脂牛奶开始",
        "限制每日牛奶摄入量",
        "继续提供多样化的固体食物"
      ]
    }
  };
  
  return templates[type] || templates.vitaminD;
}

// 运行测试
if (require.main === module) {
  testAEOComponents().catch(console.error);
}

module.exports = {
  testAEOComponents,
  generateBottomLineData,
  generateComparisonData,
  generateSchemaData,
  getTemplateData
};
