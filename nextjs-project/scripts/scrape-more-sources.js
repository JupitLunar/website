#!/usr/bin/env node

/**
 * 从更多可靠来源抓取内容
 */

const axios = require('axios');
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 更多测试来源 - 使用文章页面而不是目录页面
const SOURCES = [
  {
    name: 'KidsHealth - Breastfeeding Guide',
    organization: 'KidsHealth (Nemours)',
    url: 'https://kidshealth.org/en/parents/breastfeed-starting.html',
    slug: 'kidshealth-breastfeeding-starting-guide',
    category: 'feeding',
    selectors: {
      title: 'h1',
      content: '.article-content, .main-content',
      paragraphs: 'p'
    }
  },
  {
    name: 'KidsHealth - Formula Feeding Guide',
    organization: 'KidsHealth (Nemours)',
    url: 'https://kidshealth.org/en/parents/formulafeed-starting.html',
    slug: 'kidshealth-formula-feeding-guide',
    category: 'feeding',
    selectors: {
      title: 'h1',
      content: '.article-content, .main-content',
      paragraphs: 'p'
    }
  },
  {
    name: 'Cleveland Clinic - Infant Nutrition',
    organization: 'Cleveland Clinic',
    url: 'https://my.clevelandclinic.org/health/articles/9678-infant-nutrition',
    slug: 'cleveland-clinic-infant-nutrition',
    category: 'feeding',
    selectors: {
      title: 'h1',
      content: '.article-body, main',
      paragraphs: 'p'
    }
  },
  {
    name: 'Stanford Children\'s Health - Feeding Guide First Year',
    organization: 'Stanford Medicine',
    url: 'https://www.stanfordchildrens.org/en/topic/default?id=feeding-guide-for-the-first-year-90-P02209',
    slug: 'stanford-feeding-first-year-guide',
    category: 'feeding',
    selectors: {
      title: 'h1',
      content: '.healthwise-content, main',
      paragraphs: 'p'
    }
  }
];

function generateArticleData(source, content, title) {
  const cleanContent = content.substring(0, 5000).replace(/\s+/g, ' ').trim();
  
  return {
    slug: source.slug,
    type: 'explainer',
    hub: source.category,
    lang: 'en',
    title: title || `${source.name}`,
    one_liner: cleanContent.substring(0, 150) + '...',
    key_facts: [
      'Evidence-based information from trusted health source',
      'Reviewed by healthcare professionals',
      'Up-to-date medical guidance for parents',
      'Comprehensive and practical advice'
    ],
    body_md: `# ${title || source.name}\n\n${cleanContent.substring(0, 3000)}...\n\n*Source: ${source.organization}*`,
    entities: [source.category, 'infant', 'baby', 'health', 'parenting'],
    age_range: '0-12 months',
    region: 'US',
    last_reviewed: new Date().toISOString().split('T')[0],
    reviewed_by: 'Web Scraper Bot',
    license: `Source: ${source.organization}`,
    meta_title: (title || source.name).substring(0, 60),
    meta_description: cleanContent.substring(0, 157) + '...',
    keywords: [source.category, 'baby', 'infant', 'health', source.organization.toLowerCase()],
    status: 'draft'
  };
}

async function scrapePage(source) {
  console.log(`\n🔍 ${source.name}`);
  console.log(`   ${source.url}`);
  
  try {
    const response = await axios.get(source.url, {
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });
    
    const $ = cheerio.load(response.data);
    
    let title = $(source.selectors.title).first().text().trim();
    if (!title) title = source.name;
    
    let content = '';
    $(source.selectors.content).find(source.selectors.paragraphs).each((i, elem) => {
      const text = $(elem).text().trim();
      if (text.length > 30) {
        content += text + '\n\n';
      }
    });
    
    console.log(`   📄 ${content.length} 字符`);
    
    if (content.length < 300) {
      console.log(`   ⚠️  内容不足，跳过`);
      return { success: false, reason: 'insufficient_content' };
    }
    
    // 检查重复
    const { data: existing } = await supabase
      .from('articles')
      .select('id')
      .eq('slug', source.slug)
      .single();
    
    if (existing) {
      console.log(`   ⏭️  已存在`);
      return { success: false, reason: 'duplicate' };
    }
    
    // 插入文章
    const articleData = generateArticleData(source, content, title);
    
    const { data: article, error } = await supabase
      .from('articles')
      .insert(articleData)
      .select()
      .single();
    
    if (error) {
      console.log(`   ❌ 失败: ${error.message}`);
      return { success: false, error };
    }
    
    console.log(`   ✅ 成功插入！`);
    
    // 插入引用
    await supabase.from('citations').insert({
      article_id: article.id,
      claim: '',
      title: title,
      url: source.url,
      author: '',
      publisher: source.organization,
      date: new Date().toISOString().split('T')[0]
    });
    
    return { success: true, article };
    
  } catch (error) {
    console.log(`   ❌ 错误: ${error.message}`);
    return { success: false, error };
  }
}

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║            抓取更多权威来源内容                            ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log(`\n⏰ ${new Date().toLocaleString()}\n`);
  
  let successful = 0;
  let failed = 0;
  let skipped = 0;
  const inserted = [];
  
  for (const source of SOURCES) {
    const result = await scrapePage(source);
    
    if (result.success) {
      successful++;
      inserted.push({ name: source.name, id: result.article.id });
    } else if (result.reason === 'duplicate') {
      skipped++;
    } else {
      failed++;
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n' + '═'.repeat(63));
  console.log('📊 结果汇总');
  console.log('═'.repeat(63));
  console.log(`\n总数: ${SOURCES.length}`);
  console.log(`✅ 成功: ${successful}`);
  console.log(`⏭️  跳过: ${skipped}`);
  console.log(`❌ 失败: ${failed}\n`);
  
  if (inserted.length > 0) {
    console.log('📝 新增文章:\n');
    inserted.forEach((item, i) => {
      console.log(`${i + 1}. ${item.name}`);
      console.log(`   ID: ${item.id}\n`);
    });
  }
  
  console.log(`⏰ ${new Date().toLocaleString()}`);
  console.log('\n✅ 完成！\n');
}

main().catch(console.error);

