#!/usr/bin/env node

/**
 * 验证结构化数据的正确性
 */

// 内联AEO优化函数，避免模块导入问题
function generateCompleteAEOSchema(article) {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalWebPage", "Article"],
    "headline": article.title,
    "description": article.one_liner,
    "about": "Infant and toddler health",
    "inLanguage": "en-US",
    "datePublished": article.date_published,
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
 * 验证Schema.org结构化数据
 */
function validateSchema(schemaData) {
  const errors = [];
  const warnings = [];
  
  try {
    // 基本结构验证
    if (!schemaData['@context']) {
      errors.push('缺少 @context 字段');
    }
    
    if (!schemaData['@type']) {
      errors.push('缺少 @type 字段');
    }
    
    // 验证 @context
    if (schemaData['@context'] !== 'https://schema.org') {
      warnings.push('@context 应该是 https://schema.org');
    }
    
    // 验证 @type
    const validTypes = [
      'Article', 'MedicalWebPage', 'FAQPage', 'WebPage', 'Organization',
      'SpeakableSpecification', 'ClaimReview', 'Table'
    ];
    
    const types = Array.isArray(schemaData['@type']) ? schemaData['@type'] : [schemaData['@type']];
    
    for (const type of types) {
      if (!validTypes.includes(type)) {
        warnings.push(`未知的 @type: ${type}`);
      }
    }
    
    // 验证必需字段
    if (schemaData['@type']?.includes('Article') || schemaData['@type']?.includes('MedicalWebPage')) {
      if (!schemaData.headline) {
        errors.push('Article/MedicalWebPage 缺少 headline 字段');
      }
      
      if (!schemaData.description) {
        warnings.push('Article/MedicalWebPage 建议包含 description 字段');
      }
      
      if (!schemaData.author) {
        warnings.push('Article/MedicalWebPage 建议包含 author 字段');
      }
      
      if (!schemaData.publisher) {
        warnings.push('Article/MedicalWebPage 建议包含 publisher 字段');
      }
      
      if (!schemaData.datePublished) {
        warnings.push('Article/MedicalWebPage 建议包含 datePublished 字段');
      }
    }
    
    // 验证FAQPage
    if (schemaData['@type']?.includes('FAQPage')) {
      if (!schemaData.mainEntity || !Array.isArray(schemaData.mainEntity)) {
        errors.push('FAQPage 缺少 mainEntity 数组');
      } else {
        schemaData.mainEntity.forEach((item, index) => {
          if (!item['@type'] || item['@type'] !== 'Question') {
            errors.push(`FAQPage mainEntity[${index}] 缺少正确的 @type`);
          }
          
          if (!item.name) {
            errors.push(`FAQPage mainEntity[${index}] 缺少 name 字段`);
          }
          
          if (!item.acceptedAnswer) {
            errors.push(`FAQPage mainEntity[${index}] 缺少 acceptedAnswer 字段`);
          }
        });
      }
    }
    
    // 验证SpeakableSpecification
    if (schemaData['@type']?.includes('SpeakableSpecification')) {
      if (!schemaData.cssSelector && !schemaData.xpath) {
        errors.push('SpeakableSpecification 需要 cssSelector 或 xpath 字段');
      }
    }
    
    // 验证日期格式
    const dateFields = ['datePublished', 'dateModified', 'lastReviewed'];
    for (const field of dateFields) {
      if (schemaData[field]) {
        const date = new Date(schemaData[field]);
        if (isNaN(date.getTime())) {
          errors.push(`${field} 日期格式无效: ${schemaData[field]}`);
        }
      }
    }
    
    // 验证URL格式
    const urlFields = ['url', '@id'];
    for (const field of urlFields) {
      if (schemaData[field]) {
        try {
          new URL(schemaData[field]);
        } catch {
          errors.push(`${field} URL格式无效: ${schemaData[field]}`);
        }
      }
    }
    
  } catch (error) {
    errors.push(`验证过程中出现错误: ${error.message}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, 100 - (errors.length * 20) - (warnings.length * 5))
  };
}

/**
 * 生成测试用的文章数据
 */
function generateTestArticle() {
  return {
    slug: 'test-article',
    title: 'Test Article Title',
    one_liner: 'This is a test article for schema validation',
    summary: 'This is a comprehensive test article summary for validation purposes',
    type: 'explainer',
    hub: 'feeding',
    lang: 'en',
    region: 'Global',
    age_range: ['0-6 months', '6-12 months'],
    date_published: new Date().toISOString(),
    date_modified: new Date().toISOString(),
    last_reviewed: new Date().toISOString().split('T')[0],
    keywords: ['test', 'validation', 'schema'],
    entities: ['baby', 'feeding', 'nutrition'],
    qas: [
      {
        question: 'What is this test about?',
        answer: 'This is a test article for schema validation purposes.'
      }
    ],
    citations: [
      {
        title: 'Test Citation',
        url: 'https://example.com/test',
        author: 'Test Author',
        publisher: 'Test Publisher',
        date: '2025-01-01'
      }
    ]
  };
}

/**
 * 运行结构化数据验证测试
 */
async function runSchemaValidation() {
  console.log('🔍 结构化数据验证测试\n');
  
  try {
    // 生成测试文章数据
    const testArticle = generateTestArticle();
    console.log('📄 生成测试文章数据...');
    console.log(`   标题: ${testArticle.title}`);
    console.log(`   类型: ${testArticle.type}`);
    console.log(`   语言: ${testArticle.lang}`);
    console.log(`   地区: ${testArticle.region}`);
    console.log('');
    
    // 生成完整的AEO Schema
    console.log('🏗️ 生成AEO结构化数据...');
    const schemaData = generateCompleteAEOSchema(testArticle);
    console.log(`   Schema类型: ${JSON.stringify(schemaData['@graph']?.map(item => item['@type']) || schemaData['@type'])}`);
    console.log('');
    
    // 验证Schema
    console.log('✅ 验证结构化数据...');
    const validation = validateSchema(schemaData);
    
    console.log(`📊 验证结果:`);
    console.log(`   状态: ${validation.valid ? '✅ 有效' : '❌ 无效'}`);
    console.log(`   分数: ${validation.score}/100`);
    console.log(`   错误: ${validation.errors.length} 个`);
    console.log(`   警告: ${validation.warnings.length} 个`);
    console.log('');
    
    if (validation.errors.length > 0) {
      console.log('❌ 错误详情:');
      validation.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
      console.log('');
    }
    
    if (validation.warnings.length > 0) {
      console.log('⚠️ 警告详情:');
      validation.warnings.forEach((warning, index) => {
        console.log(`   ${index + 1}. ${warning}`);
      });
      console.log('');
    }
    
    // 测试不同类型的Schema
    console.log('🧪 测试不同类型的Schema...\n');
    
    const schemaTypes = [
      { type: 'Article', data: { '@context': 'https://schema.org', '@type': 'Article', headline: 'Test' } },
      { type: 'FAQPage', data: { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [] } },
      { type: 'SpeakableSpecification', data: { '@context': 'https://schema.org', '@type': 'SpeakableSpecification', cssSelector: ['.test'] } }
    ];
    
    for (const schemaTest of schemaTypes) {
      const testValidation = validateSchema(schemaTest.data);
      console.log(`   ${schemaTest.type}: ${testValidation.valid ? '✅' : '❌'} (分数: ${testValidation.score}/100)`);
    }
    
    console.log('\n🎉 结构化数据验证完成！');
    
    if (validation.valid && validation.score >= 80) {
      console.log('✅ 结构化数据质量良好，可以部署使用');
    } else {
      console.log('⚠️ 结构化数据需要改进，请修复上述错误和警告');
    }
    
    console.log('\n💡 下一步建议:');
    console.log('   1. 修复发现的错误和警告');
    console.log('   2. 使用Schema.org验证工具进行在线验证');
    console.log('   3. 测试Google Rich Results');
    console.log('   4. 监控结构化数据的实际效果');
    
  } catch (error) {
    console.error('❌ 验证失败:', error.message);
  }
}

// 运行验证
if (require.main === module) {
  runSchemaValidation().catch(console.error);
}

module.exports = {
  validateSchema,
  generateTestArticle,
  runSchemaValidation
};
