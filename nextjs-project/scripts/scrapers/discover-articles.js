#!/usr/bin/env node

/**
 * 文章发现脚本 - 从权威网站的索引页自动发现所有母婴相关文章
 */

const axios = require('axios');
const cheerio = require('cheerio');

// 延迟函数
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// HTTP请求
async function fetch(url) {
  try {
    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; JupitLunarBot/1.0)'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`❌ 请求失败: ${url}`, error.message);
    return null;
  }
}

// 发现AAP文章
async function discoverAAPArticles() {
  console.log('\n🔍 发现AAP (HealthyChildren.org) 文章...\n');

  const categories = [
    {
      name: 'Baby Feeding & Nutrition',
      url: 'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/default.aspx',
      selector: 'a[href*="/Pages/"]'
    },
    {
      name: 'Baby Sleep',
      url: 'https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/default.aspx',
      selector: 'a[href*="/Pages/"]'
    },
    {
      name: 'Baby Development',
      url: 'https://www.healthychildren.org/English/ages-stages/baby/Pages/default.aspx',
      selector: 'a[href*="/Pages/"]'
    },
    {
      name: 'Breastfeeding',
      url: 'https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/default.aspx',
      selector: 'a[href*="/Pages/"]'
    }
  ];

  const articles = new Set();

  for (const category of categories) {
    console.log(`📂 ${category.name}`);
    const html = await fetch(category.url);

    if (html) {
      const $ = cheerio.load(html);
      $(category.selector).each((i, elem) => {
        const href = $(elem).attr('href');
        if (href && href.includes('/Pages/') && !href.includes('default.aspx')) {
          const fullUrl = href.startsWith('http')
            ? href
            : `https://www.healthychildren.org${href}`;
          const title = $(elem).text().trim();
          if (title && title.length > 10) {
            articles.add(JSON.stringify({ url: fullUrl, title, category: category.name }));
          }
        }
      });
    }

    await delay(1000);
  }

  const uniqueArticles = Array.from(articles).map(a => JSON.parse(a));
  console.log(`✅ 发现 ${uniqueArticles.length} 篇AAP文章\n`);
  return uniqueArticles;
}

// 发现KidsHealth文章
async function discoverKidsHealthArticles() {
  console.log('\n🔍 发现KidsHealth文章...\n');

  const categories = [
    {
      name: 'Feeding & Nutrition',
      baseUrl: 'https://kidshealth.org/en/parents/nutrition-center/feeding-baby/',
      pattern: /\/en\/parents\/[^\/]+\.html$/
    },
    {
      name: 'Newborn Care',
      baseUrl: 'https://kidshealth.org/en/parents/pregnancy-center/newborn-care/',
      pattern: /\/en\/parents\/[^\/]+\.html$/
    },
    {
      name: 'Baby Basics',
      baseUrl: 'https://kidshealth.org/en/parents/pregnancy-center/baby-basics/',
      pattern: /\/en\/parents\/[^\/]+\.html$/
    }
  ];

  const articles = new Set();

  for (const category of categories) {
    console.log(`📂 ${category.name}`);
    const html = await fetch(category.baseUrl);

    if (html) {
      const $ = cheerio.load(html);
      $('a[href*="/parents/"]').each((i, elem) => {
        const href = $(elem).attr('href');
        if (href && category.pattern.test(href)) {
          const fullUrl = href.startsWith('http')
            ? href
            : `https://kidshealth.org${href}`;
          const title = $(elem).text().trim();
          if (title && title.length > 10) {
            articles.add(JSON.stringify({ url: fullUrl, title, category: category.name }));
          }
        }
      });
    }

    await delay(1000);
  }

  const uniqueArticles = Array.from(articles).map(a => JSON.parse(a));
  console.log(`✅ 发现 ${uniqueArticles.length} 篇KidsHealth文章\n`);
  return uniqueArticles;
}

// 发现Mayo Clinic文章
async function discoverMayoClinicArticles() {
  console.log('\n🔍 发现Mayo Clinic文章...\n');

  // Mayo Clinic的文章需要从搜索或sitemap获取
  // 这里先用已知的主题页面
  const topics = [
    'infant-and-toddler-health',
    'pregnancy-week-by-week'
  ];

  const articles = [];

  // 这里可以通过Mayo Clinic的sitemap或搜索API来发现更多文章
  console.log('⚠️  Mayo Clinic需要特殊处理（sitemap或API）');
  console.log(`ℹ️  建议使用sitemap: https://www.mayoclinic.org/sitemap.xml\n`);

  return articles;
}

// 主函数
async function main() {
  console.log('🚀 开始发现母婴相关文章\n');
  console.log('='.repeat(70));

  const allArticles = {
    aap: [],
    kidshealth: [],
    mayoclinic: []
  };

  // 发现AAP文章
  allArticles.aap = await discoverAAPArticles();

  // 发现KidsHealth文章
  allArticles.kidshealth = await discoverKidsHealthArticles();

  // 发现Mayo Clinic文章
  allArticles.mayoclinic = await discoverMayoClinicArticles();

  // 汇总
  console.log('\n' + '='.repeat(70));
  console.log('📊 发现结果汇总');
  console.log('='.repeat(70));
  console.log(`AAP: ${allArticles.aap.length} 篇文章`);
  console.log(`KidsHealth: ${allArticles.kidshealth.length} 篇文章`);
  console.log(`Mayo Clinic: ${allArticles.mayoclinic.length} 篇文章`);
  console.log(`\n总计: ${allArticles.aap.length + allArticles.kidshealth.length + allArticles.mayoclinic.length} 篇文章\n`);

  // 显示前10篇AAP文章作为示例
  if (allArticles.aap.length > 0) {
    console.log('\n📄 AAP文章示例 (前10篇):');
    allArticles.aap.slice(0, 10).forEach((article, i) => {
      console.log(`  ${i + 1}. ${article.title}`);
      console.log(`     ${article.url}`);
    });
  }

  // 显示前10篇KidsHealth文章作为示例
  if (allArticles.kidshealth.length > 0) {
    console.log('\n📄 KidsHealth文章示例 (前10篇):');
    allArticles.kidshealth.slice(0, 10).forEach((article, i) => {
      console.log(`  ${i + 1}. ${article.title}`);
      console.log(`     ${article.url}`);
    });
  }

  return allArticles;
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { discoverAAPArticles, discoverKidsHealthArticles };
