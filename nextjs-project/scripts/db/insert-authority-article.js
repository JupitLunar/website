#!/usr/bin/env node

/**
 * 权威长篇文章插入脚本
 * 专门用于插入高质量的权威文章到articles表
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
 * 权威文章模板
 */
function createAuthorityArticle() {
  return {
    slug: "authority-article-slug-2025",
    type: "explainer", // explainer | howto | research | faq | recipe | news
    hub: "feeding", // feeding | sleep | development | safety | mom-health | recipes
    lang: "en", // en | zh
    title: "Your Authority Article Title",
    one_liner: "Your compelling article description (50-200 characters) that summarizes the key value proposition for readers.",
    key_facts: [
      "Key fact 1: Important statistic or insight",
      "Key fact 2: Another crucial piece of information", 
      "Key fact 3: Third essential point",
      "Key fact 4: Additional important detail"
    ],
    body_md: `# Your Comprehensive Article Title

## Introduction

Start with a compelling introduction that hooks the reader and clearly states what they'll learn from this article. This should be 2-3 paragraphs that set up the problem and promise the solution.

## Background and Context

Provide necessary background information that helps readers understand the topic. Include:

- Historical context if relevant
- Current state of knowledge
- Why this topic matters now
- Who this information is for

## The Main Content

### Section 1: Core Concepts

Dive deep into the main concepts. Use subheadings to break up content and make it scannable:

- **Concept 1**: Detailed explanation
- **Concept 2**: Another important concept
- **Concept 3**: Supporting information

### Section 2: Practical Applications

Show how these concepts apply in real life:

1. **Real-world example 1**: Detailed case study
2. **Real-world example 2**: Another practical application
3. **Common scenarios**: Typical situations readers might encounter

### Section 3: Expert Insights

Include authoritative perspectives:

> "Expert quote or insight from a credible source" - Dr. Expert Name, Title

- Professional recommendations
- Evidence-based guidelines
- Best practices from the field

## Detailed Methodology

If applicable, provide step-by-step guidance:

### Step 1: Preparation
- What readers need to do first
- Materials or resources required
- Time considerations

### Step 2: Implementation
- Detailed instructions
- Common challenges and solutions
- Tips for success

### Step 3: Evaluation and Follow-up
- How to measure success
- When to seek additional help
- Long-term considerations

## Common Challenges and Solutions

Address typical problems readers might face:

### Challenge 1: [Specific Problem]
**Solution**: Detailed explanation of how to address this issue.

### Challenge 2: [Another Problem]
**Solution**: Practical steps to resolve the challenge.

### Challenge 3: [Third Problem]
**Solution**: Alternative approaches and troubleshooting.

## Advanced Topics

For readers who want to go deeper:

- Advanced techniques
- Emerging research
- Future considerations
- Related topics to explore

## Safety and Precautions

Always include important safety information:

⚠️ **Important Safety Notes:**
- Critical safety considerations
- When to seek professional help
- Red flags to watch for
- Emergency situations

## Resources and References

### Authoritative Sources
- [Source 1](URL): Brief description
- [Source 2](URL): Brief description  
- [Source 3](URL): Brief description

### Additional Reading
- Recommended books or articles
- Professional organizations
- Online resources

### Professional Help
- When to consult specialists
- How to find qualified professionals
- What to expect from consultations

## Conclusion

Summarize the key takeaways:

- **Main point 1**: Reinforce the primary message
- **Main point 2**: Emphasize another crucial insight
- **Main point 3**: Highlight practical application

### Next Steps
- Immediate actions readers can take
- Resources for further learning
- How to stay updated on this topic

---

## Disclaimer

This content is for educational purposes only and does not replace professional medical advice. Always consult with qualified healthcare providers for personalized guidance and treatment recommendations.`,
    
    age_range: "6-12 months", // 具体年龄范围
    region: "Global", // US | CA | Global
    last_reviewed: "2025-01-06",
    reviewed_by: "JupitLunar Editorial Team", // 您的名字或团队
    meta_title: "SEO Optimized Title - Include Key Keywords",
    meta_description: "SEO optimized description that summarizes the article and includes relevant keywords for search engines.",
    keywords: ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
    status: "published" // draft | published | archived
  };
}

/**
 * 插入权威文章
 */
async function insertAuthorityArticle() {
  console.log('📝 插入权威长篇文章到articles表...\n');
  
  // 获取用户输入的文章信息
  const article = createAuthorityArticle();
  
  // 显示文章信息
  console.log('📄 文章信息:');
  console.log(`   标题: ${article.title}`);
  console.log(`   类型: ${article.type}`);
  console.log(`   中心: ${article.hub}`);
  console.log(`   语言: ${article.lang}`);
  console.log(`   年龄范围: ${article.age_range}`);
  console.log(`   地区: ${article.region}`);
  console.log(`   关键词: ${article.keywords.join(', ')}`);
  console.log(`   内容长度: ${article.body_md.length} 字符`);
  console.log('');
  
  try {
    // 插入到articles表
    const { data, error } = await supabase
      .from('articles')
      .insert([article])
      .select();
    
    if (error) throw error;
    
    console.log('✅ 权威文章插入成功！');
    console.log(`📋 记录ID: ${data[0].id}`);
    console.log(`🔗 Slug: ${data[0].slug}`);
    console.log(`📅 发布时间: ${data[0].date_published}`);
    console.log(`👤 审核者: ${data[0].reviewed_by}`);
    console.log('');
    
    console.log('🎉 权威文章插入完成！');
    console.log('\n📋 下一步:');
    console.log('1. 验证文章在articles表中的格式');
    console.log('2. 检查SEO元数据是否正确');
    console.log('3. 测试文章页面显示效果');
    console.log('4. 监控SEO排名和用户参与度');
    
    return data[0];
    
  } catch (error) {
    console.error('❌ 插入失败:', error.message);
    
    if (error.code === '23505') {
      console.log('\n💡 解决建议:');
      console.log('   - 文章slug已存在，请修改slug');
      console.log('   - 或删除现有文章后重新插入');
    }
    
    if (error.code === '23503') {
      console.log('\n💡 解决建议:');
      console.log('   - 检查hub是否存在');
      console.log('   - 确保content_hubs表中有对应的hub');
    }
    
    return null;
  }
}

/**
 * 验证插入的文章
 */
async function verifyArticle(articleSlug) {
  console.log('🔍 验证插入的权威文章...\n');
  
  try {
    const { data: article, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', articleSlug)
      .single();
    
    if (error) throw error;
    
    console.log('✅ 文章验证成功！');
    console.log('\n📊 格式检查:');
    
    // 检查必需字段
    const requiredFields = [
      'slug', 'type', 'hub', 'title', 'one_liner', 'key_facts',
      'body_md', 'age_range', 'region', 'meta_title', 'meta_description'
    ];
    
    requiredFields.forEach(field => {
      const value = article[field];
      const status = value !== null && value !== undefined && value !== '' ? '✅' : '❌';
      console.log(`   ${status} ${field}: ${typeof value === 'string' ? value.substring(0, 50) + '...' : JSON.stringify(value)}`);
    });
    
    // 内容质量检查
    console.log('\n📝 内容质量检查:');
    console.log(`   📏 文章长度: ${article.body_md?.length || 0} 字符`);
    console.log(`   📄 摘要长度: ${article.one_liner?.length || 0} 字符`);
    console.log(`   🔑 关键词数量: ${article.keywords?.length || 0} 个`);
    console.log(`   📋 关键事实数量: ${article.key_facts?.length || 0} 个`);
    
    // SEO检查
    console.log('\n🔍 SEO优化检查:');
    const hasMetaTitle = article.meta_title && article.meta_title.length > 0;
    const hasMetaDescription = article.meta_description && article.meta_description.length > 0;
    const hasKeywords = article.keywords && article.keywords.length > 0;
    const isLongForm = article.body_md && article.body_md.length > 2000;
    
    console.log(`   ${hasMetaTitle ? '✅' : '❌'} Meta标题`);
    console.log(`   ${hasMetaDescription ? '✅' : '❌'} Meta描述`);
    console.log(`   ${hasKeywords ? '✅' : '❌'} 关键词标签`);
    console.log(`   ${isLongForm ? '✅' : '❌'} 长文格式 (>2000字符)`);
    
    // 内容结构检查
    const content = article.body_md || '';
    const hasHeadings = content.includes('#') || content.includes('##');
    const hasList = content.includes('-') || content.includes('*');
    const hasLinks = content.includes('[') && content.includes('](');
    const hasDisclaimer = content.includes('Disclaimer') || content.includes('免责声明');
    
    console.log('\n📋 内容结构检查:');
    console.log(`   ${hasHeadings ? '✅' : '❌'} 标题结构`);
    console.log(`   ${hasList ? '✅' : '❌'} 列表格式`);
    console.log(`   ${hasLinks ? '✅' : '❌'} 链接引用`);
    console.log(`   ${hasDisclaimer ? '✅' : '❌'} 免责声明`);
    
    return article;
    
  } catch (error) {
    console.error('❌ 验证失败:', error.message);
    return null;
  }
}

/**
 * 显示权威文章格式要求
 */
function showAuthorityArticleRequirements() {
  console.log('📋 权威文章格式要求:\n');
  
  console.log('🎯 必需字段:');
  console.log('   - slug: SEO友好的URL slug');
  console.log('   - type: 文章类型 (explainer推荐)');
  console.log('   - hub: 内容中心分类');
  console.log('   - title: 吸引人的标题');
  console.log('   - one_liner: 50-200字符的摘要');
  console.log('   - key_facts: 3-4个关键事实');
  console.log('   - body_md: 完整的Markdown内容 (建议2000+字符)');
  console.log('   - meta_title: SEO优化的标题');
  console.log('   - meta_description: SEO优化的描述');
  console.log('');
  
  console.log('📝 内容结构要求:');
  console.log('   1. 引人入胜的引言');
  console.log('   2. 背景知识和上下文');
  console.log('   3. 主要内容 (多个章节)');
  console.log('   4. 实用方法和步骤');
  console.log('   5. 专家观点和权威引用');
  console.log('   6. 常见挑战和解决方案');
  console.log('   7. 安全注意事项');
  console.log('   8. 资源和参考');
  console.log('   9. 结论和下一步');
  console.log('   10. 免责声明');
  console.log('');
  
  console.log('🔍 SEO优化要求:');
  console.log('   - 标题包含目标关键词');
  console.log('   - 内容长度2000-5000字符');
  console.log('   - 包含内部和外部链接');
  console.log('   - 使用清晰的标题层级');
  console.log('   - 包含相关关键词');
  console.log('');
  
  console.log('📊 质量标准:');
  console.log('   - 内容原创且权威');
  console.log('   - 包含专家引用和来源');
  console.log('   - 结构清晰易读');
  console.log('   - 包含实用建议');
  console.log('   - 定期更新维护');
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 权威长篇文章插入工具\n');
  
  // 显示格式要求
  showAuthorityArticleRequirements();
  
  console.log('---\n');
  console.log('⚠️  注意: 请在运行前修改脚本中的文章内容！');
  console.log('   编辑 createAuthorityArticle() 函数中的内容\n');
  
  // 插入文章
  const insertedArticle = await insertAuthorityArticle();
  
  if (insertedArticle) {
    console.log('\n---\n');
    
    // 验证插入结果
    await verifyArticle(insertedArticle.slug);
    
    console.log('\n✅ 权威文章插入完成！');
    console.log('\n📖 更多信息:');
    console.log('   - 查看 CONTENT_STRATEGY_GUIDE.md 了解内容策略');
    console.log('   - 使用 content-type-manager.js 决定内容类型');
    console.log('   - 监控SEO排名和用户参与度');
  }
}

// 运行脚本
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  insertAuthorityArticle,
  verifyArticle,
  createAuthorityArticle,
  showAuthorityArticleRequirements
};
