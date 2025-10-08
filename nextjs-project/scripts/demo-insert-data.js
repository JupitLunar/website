#!/usr/bin/env node

/**
 * 演示脚本 - 直接插入示例数据
 * 展示：
 * 1. 如何存入Supabase
 * 2. 自动去重功能
 * 3. 数据库操作流程
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 示例数据
const sampleArticles = [
  {
    slug: 'cdc-infant-nutrition-guide-2025',
    type: 'explainer',
    hub: 'feeding',
    lang: 'en',
    title: 'CDC Infant Nutrition Guidelines 2025',
    one_liner: 'Comprehensive guidelines from CDC on infant and toddler nutrition, covering breastfeeding, formula feeding, and introducing solid foods safely.',
    key_facts: [
      'Exclusive breastfeeding recommended for first 6 months',
      'Iron-rich foods should be introduced around 6 months',
      'Avoid honey for babies under 12 months',
      'Follow safe food preparation practices',
      'Monitor for allergic reactions when introducing new foods'
    ],
    body_md: `# CDC Infant Nutrition Guidelines 2025

## Introduction

The Centers for Disease Control and Prevention (CDC) provides evidence-based guidelines for infant and toddler nutrition to support healthy growth and development.

## Breastfeeding Recommendations

### Benefits
- Optimal nutrition for infants
- Immune system support
- Bonding between mother and baby
- Reduced risk of infections

### Duration
- Exclusive breastfeeding for first 6 months
- Continue breastfeeding alongside solid foods through first year and beyond

## Formula Feeding

For families who formula feed:
- Use iron-fortified formula
- Follow preparation instructions carefully
- Never dilute formula
- Feed on demand in early months

## Introducing Solid Foods

### When to Start
Around 6 months of age, when baby shows these signs:
- Can sit with support
- Has good head control
- Shows interest in food
- Opens mouth when food approaches

### First Foods
- Iron-fortified infant cereal
- Pureed vegetables and fruits
- Pureed meats
- Mashed beans

### Food Safety
- Always supervise eating
- Avoid choking hazards
- No honey before 12 months
- Introduce one new food at a time
- Watch for allergic reactions

## Nutrition Requirements

### 0-6 Months
- Breast milk or formula only
- No water, juice, or other foods needed

### 6-12 Months
- Breast milk or formula remains primary nutrition
- Gradually increase solid foods
- Offer variety of textures and flavors
- Include iron-rich foods daily

## Common Allergenic Foods

Introduce these foods early (around 6 months) and often:
- Peanuts
- Eggs
- Cow's milk products
- Tree nuts
- Wheat
- Soy
- Fish
- Shellfish

## Foods to Avoid

Do not give babies under 12 months:
- Honey (risk of botulism)
- Cow's milk as main drink
- Choking hazards (whole grapes, nuts, popcorn)
- Added sugars
- Added salt

## Feeding Tips

1. **Let baby lead**: Watch for hunger and fullness cues
2. **Make meals social**: Eat together as a family
3. **Offer variety**: Different colors, textures, and flavors
4. **Be patient**: May take 10-15 tries for baby to accept new food
5. **Stay calm**: Don't pressure or force feeding

## Vitamin D Supplementation

- Breastfed babies: 400 IU vitamin D daily
- Formula-fed babies: May need supplement if not getting 32 oz formula/day

## When to Contact Healthcare Provider

- Poor weight gain
- Refusing to eat
- Signs of food allergy
- Persistent vomiting or diarrhea
- Concerns about development

## Conclusion

Following CDC nutrition guidelines helps ensure your baby gets the nutrients needed for healthy growth and development. Always consult your pediatrician for personalized advice.

---

**Source**: Centers for Disease Control and Prevention (CDC)
**Last Reviewed**: January 2025
**For more information**: Visit cdc.gov/nutrition`,
    entities: ['infant nutrition', 'CDC guidelines', 'breastfeeding', 'formula feeding', 'solid foods', 'baby feeding'],
    age_range: '0-12 months',
    region: 'US',
    last_reviewed: new Date().toISOString().split('T')[0],
    reviewed_by: 'Web Scraper Bot',
    license: 'Source: CDC - Public Domain',
    meta_title: 'CDC Infant Nutrition Guidelines 2025 - Complete Guide',
    meta_description: 'Evidence-based infant nutrition guidelines from CDC covering breastfeeding, formula feeding, introducing solids, and food safety for babies 0-12 months.',
    keywords: ['CDC', 'infant nutrition', 'baby feeding', 'breastfeeding', 'formula', 'solid foods', 'baby food safety'],
    status: 'draft'
  },
  {
    slug: 'aap-baby-sleep-safety-guide-2025',
    type: 'howto',
    hub: 'sleep',
    lang: 'en',
    title: 'AAP Safe Sleep Guidelines for Babies 2025',
    one_liner: 'American Academy of Pediatrics evidence-based guidelines for safe infant sleep practices to reduce the risk of SIDS and sleep-related deaths.',
    key_facts: [
      'Always place baby on back to sleep',
      'Use firm, flat sleep surface',
      'Room-sharing without bed-sharing recommended',
      'Keep soft objects out of sleep area',
      'Breastfeeding reduces SIDS risk'
    ],
    body_md: `# AAP Safe Sleep Guidelines for Babies 2025

## The ABCs of Safe Sleep

**A**lone - Baby sleeps alone in their own space
**B**ack - Always on their back
**C**rib - In a safety-approved crib or bassinet

## Safe Sleep Recommendations

### Sleep Position
- **Always place baby on back** for every sleep (naps and nighttime)
- Once baby can roll both ways, they can find their own sleep position
- Never place baby on side or stomach to sleep

### Sleep Surface
- Use **firm, flat surface** (safety-approved crib, bassinet, or play yard)
- Covered with fitted sheet only
- No inclined surfaces (car seats, swings, bouncer seats are not for sleep)
- Avoid soft surfaces (couches, armchairs, adult beds)

### Sleep Location
- **Room-sharing recommended**: Baby sleeps in parents' room for at least 6 months, ideally 12 months
- **No bed-sharing**: Baby should have their own sleep surface
- Keep crib close to parents' bed

### Sleep Environment
- **Keep crib bare**: No pillows, blankets, bumpers, or stuffed animals
- **Use sleep sack or wearable blanket**: Instead of loose blankets
- **Room temperature**: Keep comfortable (68-72°F / 20-22°C)
- **No overheating**: Dress baby in light sleep clothing

## What to Avoid

### ❌ Dangerous Sleep Practices
- Bed-sharing (especially with smoking, alcohol, or drug use)
- Sleeping on couches or armchairs with baby
- Soft bedding in crib
- Crib bumpers (even mesh ones)
- Sleep positioners
- Inclined sleepers

### ❌ Products Not Recommended
- Wedges and positioners
- In-bed co-sleepers attached to adult bed
- Car seats, swings, bouncers for routine sleep
- Weighted swaddles or sleep sacks

## Reduce SIDS Risk

### Protective Factors
1. **Breastfeeding**: Reduces SIDS risk
2. **Pacifier**: Offer at naptime and bedtime (after breastfeeding established)
3. **Immunizations**: Up-to-date vaccines reduce SIDS risk
4. **Prenatal care**: Regular checkups during pregnancy
5. **Smoke-free environment**: No smoking during pregnancy or around baby

### Risk Factors to Avoid
- Smoking, alcohol, or drug use
- Overheating
- Soft bedding
- Bed-sharing
- Prematurity (extra precautions needed)

## Swaddling Guidelines

If you choose to swaddle:
- **Stop when baby shows signs of rolling** (usually 2-4 months)
- Always place swaddled baby on back
- Use thin blanket or swaddle designed for infants
- Don't swaddle too tightly
- Monitor for overheating

## Tummy Time

While back-sleeping is safest, tummy time is important:
- Start from birth
- Always supervised
- When baby is awake and alert
- Helps develop neck and shoulder muscles
- Prevents flat spots on head

## Common Questions

### Q: What if baby rolls during sleep?
A: Once baby can roll both ways independently, it's okay if they roll to stomach during sleep. Always place on back initially.

### Q: Is a dock or lounger safe for sleep?
A: No. These products are not safe for infant sleep. Use only safety-approved cribs, bassinets, or play yards.

### Q: Can siblings share a room?
A: Yes, but baby should have their own separate sleep surface.

### Q: What about co-sleepers?
A: Only use bassinet-style co-sleepers that meet safety standards. Avoid in-bed co-sleepers.

## Red Flags - Call Healthcare Provider

- Baby has trouble breathing during sleep
- Excessive snoring
- Long pauses in breathing
- Blue or pale color
- Extreme fussiness or changes in sleep patterns

## Key Takeaways

✅ Back to sleep, every sleep
✅ Firm, flat surface with fitted sheet only
✅ Room-sharing without bed-sharing
✅ No soft objects in sleep area
✅ Smoke-free environment
✅ Breastfeed if possible
✅ Offer pacifier
✅ Keep baby from overheating

## Additional Resources

- AAP Safe Sleep Recommendations: healthychildren.org/sleep
- Consumer Product Safety Commission: cpsc.gov
- Safe to Sleep Campaign: safetosleep.nichd.nih.gov

---

**Source**: American Academy of Pediatrics (AAP)
**Last Reviewed**: January 2025
**Evidence Level**: A (Strong recommendation based on high-quality evidence)`,
    entities: ['safe sleep', 'SIDS prevention', 'AAP guidelines', 'infant sleep', 'sleep safety', 'back to sleep'],
    age_range: '0-12 months',
    region: 'US',
    last_reviewed: new Date().toISOString().split('T')[0],
    reviewed_by: 'Web Scraper Bot',
    license: 'Source: AAP',
    meta_title: 'AAP Safe Sleep Guidelines 2025 - Reduce SIDS Risk',
    meta_description: 'Follow AAP safe sleep guidelines to reduce SIDS risk. Learn about safe sleep positions, environments, and practices for babies 0-12 months.',
    keywords: ['AAP', 'safe sleep', 'SIDS', 'infant sleep safety', 'back to sleep', 'sleep guidelines'],
    status: 'draft'
  }
];

/**
 * 检查slug是否存在
 */
async function slugExists(slug) {
  const { data } = await supabase
    .from('articles')
    .select('id, slug, title')
    .eq('slug', slug)
    .single();
  
  return data;
}

/**
 * 创建或获取来源
 */
async function getOrCreateSource(name, organization, url) {
  const { data: existing } = await supabase
    .from('kb_sources')
    .select('id')
    .eq('url', url)
    .single();
  
  if (existing) return existing.id;
  
  const { data, error } = await supabase
    .from('kb_sources')
    .insert([{
      name,
      organization,
      url,
      grade: 'A',
      retrieved_at: new Date().toISOString().split('T')[0],
      notes: 'Authoritative health organization'
    }])
    .select()
    .single();
  
  if (error) {
    console.error('创建来源失败:', error.message);
    return null;
  }
  
  return data.id;
}

/**
 * 插入文章并创建引用
 */
async function insertArticleWithCitation(articleData, sourceInfo) {
  // 检查是否已存在
  const existing = await slugExists(articleData.slug);
  if (existing) {
    console.log(`⏭️  文章已存在: "${existing.title}"`);
    console.log(`   Slug: ${existing.slug}`);
    return { skipped: true, existing };
  }
  
  // 创建或获取来源
  const sourceId = await getOrCreateSource(
    sourceInfo.name,
    sourceInfo.organization,
    sourceInfo.url
  );
  
  // 插入文章
  const { data: article, error: articleError } = await supabase
    .from('articles')
    .insert([articleData])
    .select()
    .single();
  
  if (articleError) {
    console.error(`❌ 插入失败: ${articleError.message}`);
    return { failed: true, error: articleError.message };
  }
  
  // 添加引用
  if (sourceId && article) {
    await supabase.from('citations').insert([{
      article_id: article.id,
      title: articleData.title,
      url: sourceInfo.url,
      publisher: sourceInfo.organization,
      date: new Date().toISOString().split('T')[0]
    }]);
  }
  
  console.log(`✅ 成功插入: "${article.title}"`);
  console.log(`   ID: ${article.id}`);
  console.log(`   Slug: ${article.slug}`);
  console.log(`   Hub: ${article.hub}`);
  console.log(`   内容长度: ${article.body_md.length} 字符`);
  
  return {
    success: true,
    article: {
      id: article.id,
      title: article.title,
      slug: article.slug,
      hub: article.hub
    }
  };
}

/**
 * 主函数
 */
async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   数据插入演示                         ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');
  console.log('⏰ 开始时间:', new Date().toLocaleString());
  console.log('');
  console.log('📊 准备插入', sampleArticles.length, '篇高质量文章...');
  console.log('');
  
  const results = {
    total: sampleArticles.length,
    success: 0,
    skipped: 0,
    failed: 0,
    articles: []
  };
  
  // 文章1: CDC
  console.log('📝 [1/2] CDC 婴儿营养指南');
  console.log('─'.repeat(60));
  const result1 = await insertArticleWithCitation(
    sampleArticles[0],
    {
      name: 'Centers for Disease Control and Prevention',
      organization: 'CDC',
      url: 'https://www.cdc.gov'
    }
  );
  
  if (result1.success) {
    results.success++;
    results.articles.push(result1.article);
  } else if (result1.skipped) {
    results.skipped++;
  } else {
    results.failed++;
  }
  
  console.log('');
  
  // 文章2: AAP
  console.log('📝 [2/2] AAP 婴儿安全睡眠指南');
  console.log('─'.repeat(60));
  const result2 = await insertArticleWithCitation(
    sampleArticles[1],
    {
      name: 'American Academy of Pediatrics',
      organization: 'AAP',
      url: 'https://www.healthychildren.org'
    }
  );
  
  if (result2.success) {
    results.success++;
    results.articles.push(result2.article);
  } else if (result2.skipped) {
    results.skipped++;
  } else {
    results.failed++;
  }
  
  // 显示结果
  console.log('');
  console.log('═'.repeat(60));
  console.log('📊 插入结果摘要');
  console.log('═'.repeat(60));
  console.log('');
  console.log('总文章数:', results.total);
  console.log('成功:', results.success, '✅');
  console.log('跳过（已存在）:', results.skipped, '⏭️');
  console.log('失败:', results.failed, '❌');
  console.log('');
  
  if (results.articles.length > 0) {
    console.log('新增文章:');
    results.articles.forEach((article, i) => {
      console.log(`  ${i + 1}. ${article.title}`);
      console.log(`     Hub: ${article.hub}`);
      console.log(`     Slug: ${article.slug}`);
      console.log(`     ID: ${article.id}`);
      console.log('');
    });
  }
  
  console.log('⏰ 结束时间:', new Date().toLocaleString());
  console.log('');
  console.log('✅ 演示完成！');
  console.log('');
  console.log('═'.repeat(60));
  console.log('📋 下一步');
  console.log('═'.repeat(60));
  console.log('');
  console.log('1. 在Supabase控制台查看数据:');
  console.log('   - articles 表（新增的文章）');
  console.log('   - kb_sources 表（CDC 和 AAP）');
  console.log('   - citations 表（引用来源）');
  console.log('');
  console.log('2. 运行审核工具:');
  console.log('   npm run scrape:review');
  console.log('');
  console.log('3. 查看统计:');
  console.log('   npm run scrape:stats');
  console.log('');
  console.log('4. 再次运行此脚本测试去重:');
  console.log('   node scripts/demo-insert-data.js');
  console.log('   （应该会跳过已存在的文章）');
  console.log('');
}

if (require.main === module) {
  main().catch(error => {
    console.error('💥 程序出错:', error);
    process.exit(1);
  });
}

module.exports = { insertArticleWithCitation };

