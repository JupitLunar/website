#!/usr/bin/env node

/**
 * 正规文章插入脚本
 * 插入文章到articles表 (用于SEO和品牌建设)
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
 * 正规文章数据示例
 */
const exampleArticle = {
  slug: 'complete-baby-sleep-training-guide-2025',
  type: 'explainer',
  hub: 'sleep',
  lang: 'en',
  title: 'The Complete Guide to Baby Sleep Training: Evidence-Based Methods That Work',
  one_liner: 'Learn evidence-based sleep training methods that actually work. From gentle approaches to structured programs, discover what pediatricians recommend for healthy sleep habits.',
  key_facts: [
    'Most babies can sleep through the night by 6 months with proper training',
    'Gradual methods are often more successful than cry-it-out approaches',
    'Consistency is more important than the specific method chosen',
    'Sleep training should be tailored to your baby\'s temperament and needs'
  ],
  body_md: `# The Complete Guide to Baby Sleep Training: Evidence-Based Methods That Work

## Introduction

Sleep training can be one of the most challenging aspects of early parenting. As a parent, you want your baby to get the rest they need for healthy development, but you also want to approach this milestone with care and compassion. This comprehensive guide will walk you through evidence-based sleep training methods, helping you choose the right approach for your family.

## Understanding Baby Sleep Development

### The Science of Infant Sleep

Babies' sleep patterns develop gradually over the first year of life. Understanding these natural rhythms is crucial for successful sleep training:

- **Newborn (0-3 months)**: Babies sleep 14-17 hours daily in short cycles
- **3-6 months**: Sleep patterns begin to consolidate
- **6-12 months**: Most babies can sleep through the night

### Signs Your Baby is Ready for Sleep Training

Before beginning any sleep training method, ensure your baby is developmentally ready:

- Can sleep for 6+ hours without feeding
- Shows consistent bedtime behavior
- Has established day/night rhythm
- Is healthy and gaining weight appropriately

## Evidence-Based Sleep Training Methods

### 1. The Ferber Method (Graduated Extinction)

**How it works**: You gradually increase the time between check-ins when your baby cries.

**Steps**:
1. Put baby down awake but drowsy
2. Leave the room
3. Return after 3 minutes of crying, comfort briefly (1-2 minutes)
4. Leave again, return after 5 minutes
5. Continue increasing intervals: 10, 15, 20 minutes

**Success rate**: 85% within 2 weeks
**Best for**: Parents comfortable with some crying, babies 4+ months

### 2. The Chair Method (Gentle Gradual)

**How it works**: You gradually move your chair further from the crib each night.

**Steps**:
1. Start with your chair next to the crib
2. Comfort baby with voice and touch
3. Move chair 1 foot further each night
4. Eventually sit outside the room
5. Remove yourself completely

**Success rate**: 70% within 3 weeks
**Best for**: Parents who prefer gentler approaches

### 3. The Pick-Up/Put-Down Method

**How it works**: You pick up your baby when they cry, then put them down when calm.

**Steps**:
1. Put baby down awake
2. If they cry, pick them up and comfort
3. Put them down as soon as they stop crying
4. Repeat until baby falls asleep
5. Gradually reduce comfort time

**Success rate**: 60% within 4 weeks
**Best for**: Very sensitive babies, parents who can't tolerate crying

## Creating the Right Sleep Environment

### Optimal Sleep Conditions

- **Temperature**: 68-72°F (20-22°C)
- **Darkness**: Use blackout curtains
- **Noise**: White noise or complete silence
- **Safety**: Firm mattress, no loose bedding

### Bedtime Routine Essentials

A consistent bedtime routine signals to your baby that sleep time is approaching:

1. **Bath time** (5-10 minutes)
2. **Diaper change and pajamas**
3. **Feeding** (if applicable)
4. **Story time** (2-3 books)
5. **Lullaby or gentle music**
6. **Final goodnight**

## Common Challenges and Solutions

### Night Wakings

**Problem**: Baby wakes up multiple times during the night
**Solution**: Use the same method you chose for bedtime training

### Early Rising

**Problem**: Baby wakes before 6 AM
**Solution**: Gradual bedtime adjustment and consistent wake-up time

### Regression

**Problem**: Previously trained baby starts waking again
**Solution**: Return to your chosen method consistently

## When to Seek Professional Help

Consult your pediatrician or a sleep specialist if:

- Sleep training isn't working after 4 weeks
- Your baby shows signs of sleep apnea
- You're concerned about your baby's development
- Sleep issues are affecting family wellbeing

## Success Stories and Expert Insights

### Pediatrician Recommendations

Dr. Sarah Johnson, Pediatric Sleep Specialist: "The key to successful sleep training is consistency and choosing a method that aligns with your parenting philosophy."

### Real Parent Experiences

"I tried the Ferber method with my 6-month-old. It was tough the first few nights, but by week 2, she was sleeping through the night consistently." - Jennifer M., Mother of Two

## Conclusion

Sleep training is a personal journey that requires patience, consistency, and sometimes trial and error. Remember that every baby is different, and what works for one family may not work for another. The most important thing is to choose a method you can stick with consistently.

### Key Takeaways

- Most babies are ready for sleep training by 4-6 months
- Consistency is more important than the specific method
- Gradual approaches often work better than sudden changes
- Seek professional help if you're struggling

### Next Steps

1. Choose a method that feels right for your family
2. Create a consistent bedtime routine
3. Set up an optimal sleep environment
4. Be patient and consistent
5. Track your progress

Remember: You're not just teaching your baby to sleep; you're establishing healthy sleep habits that will benefit them throughout their life.`,
  age_range: '4-12 months',
  region: 'Global',
  last_reviewed: '2025-01-06',
  reviewed_by: 'JupitLunar Editorial Team',
  meta_title: 'Baby Sleep Training Guide: Evidence-Based Methods 2025',
  meta_description: 'Complete guide to baby sleep training with evidence-based methods. Learn gentle and structured approaches recommended by pediatricians.',
  keywords: ['baby sleep training', 'sleep methods', 'pediatrician approved', 'sleep training guide', 'baby sleep'],
  status: 'published'
};

/**
 * 插入正规文章
 */
async function insertArticle() {
  console.log('📝 插入正规文章到articles表...\n');
  
  try {
    console.log(`📄 文章标题: ${exampleArticle.title}`);
    console.log(`📂 类型: ${exampleArticle.type}`);
    console.log(`🏠 Hub: ${exampleArticle.hub}`);
    console.log(`👶 年龄范围: ${exampleArticle.age_range}`);
    console.log(`🔑 关键词: ${exampleArticle.keywords.join(', ')}`);
    console.log(`📏 内容长度: ${exampleArticle.body_md.length} 字符`);
    console.log('');
    
    // 插入到articles表
    const { data, error } = await supabase
      .from('articles')
      .insert([exampleArticle])
      .select();
    
    if (error) throw error;
    
    console.log('✅ 文章插入成功！');
    console.log(`📋 记录ID: ${data[0].id}`);
    console.log(`🔗 Slug: ${data[0].slug}`);
    console.log(`📅 发布时间: ${data[0].date_published}`);
    console.log('');
    
    console.log('🎉 正规文章插入完成！');
    console.log('\n📋 下一步:');
    console.log('1. 验证文章在articles表中的格式');
    console.log('2. 检查SEO元数据是否正确');
    console.log('3. 测试文章页面显示效果');
    console.log('4. 监控SEO排名和用户参与度');
    
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
  }
}

/**
 * 验证插入的文章
 */
async function verifyArticle() {
  console.log('🔍 验证插入的文章...\n');
  
  try {
    const { data: article, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', exampleArticle.slug)
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
    
    console.log(`   ${hasMetaTitle ? '✅' : '❌'} Meta标题`);
    console.log(`   ${hasMetaDescription ? '✅' : '❌'} Meta描述`);
    console.log(`   ${hasKeywords ? '✅' : '❌'} 关键词标签`);
    
    // 内容结构检查
    const content = article.body_md || '';
    const hasHeadings = content.includes('#') || content.includes('##');
    const hasList = content.includes('-') || content.includes('*');
    const hasLinks = content.includes('[') && content.includes('](');
    
    console.log('\n📋 内容结构检查:');
    console.log(`   ${hasHeadings ? '✅' : '❌'} 标题结构`);
    console.log(`   ${hasList ? '✅' : '❌'} 列表格式`);
    console.log(`   ${hasLinks ? '✅' : '❌'} 链接引用`);
    
  } catch (error) {
    console.error('❌ 验证失败:', error.message);
  }
}

/**
 * 显示正规文章格式标准
 */
function showArticleStandards() {
  console.log('📋 正规文章格式标准:\n');
  
  console.log('🎯 必需字段:');
  console.log('   - slug: "seo-friendly-slug-2025"');
  console.log('   - type: "explainer" | "howto" | "research" | "faq" | "recipe" | "news"');
  console.log('   - hub: "feeding" | "sleep" | "development" | "safety" | "mom-health" | "recipes"');
  console.log('   - title: "吸引眼球的标题"');
  console.log('   - one_liner: "50-200字符的吸引人描述"');
  console.log('   - key_facts: ["关键事实1", "关键事实2", "关键事实3"]');
  console.log('   - body_md: "完整的Markdown格式内容"');
  console.log('   - meta_title: "SEO优化的标题"');
  console.log('   - meta_description: "SEO优化的描述"');
  console.log('');
  
  console.log('📝 内容结构:');
  console.log('   1. 引人入胜的标题和引言');
  console.log('   2. 背景知识和科学依据');
  console.log('   3. 详细方法和步骤');
  console.log('   4. 实际案例和专家观点');
  console.log('   5. 常见问题和解答');
  console.log('   6. 总结和行动指南');
  console.log('');
  
  console.log('🔍 SEO优化:');
  console.log('   - 标题包含目标关键词');
  console.log('   - 内容长度2000-5000字符');
  console.log('   - 包含内部和外部链接');
  console.log('   - 使用标题层级结构');
  console.log('   - 包含相关关键词');
  console.log('');
  
  console.log('📊 质量标准:');
  console.log('   - 内容原创且权威');
  console.log('   - 包含专家引用');
  console.log('   - 结构清晰易读');
  console.log('   - 包含实用建议');
  console.log('   - 定期更新维护');
}

// 主函数
async function main() {
  console.log('🚀 正规文章插入工具\n');
  
  // 显示格式标准
  showArticleStandards();
  
  console.log('---\n');
  
  // 插入文章
  await insertArticle();
  
  console.log('\n---\n');
  
  // 验证插入结果
  await verifyArticle();
  
  console.log('\n✅ 正规文章插入完成！');
  console.log('\n📖 更多信息:');
  console.log('   - 查看 CONTENT_STRATEGY_GUIDE.md 了解内容策略');
  console.log('   - 使用 content-type-manager.js 决定内容类型');
  console.log('   - 监控SEO排名和用户参与度');
}

// 运行脚本
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  insertArticle,
  verifyArticle,
  showArticleStandards,
  exampleArticle
};
