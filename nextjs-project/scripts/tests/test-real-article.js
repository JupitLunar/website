#!/usr/bin/env node

const axios = require('axios');
const cheerio = require('cheerio');

async function testArticle(url, selectors) {
  console.log('Testing URL:', url);

  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; JupitLunarBot/1.0)'
      }
    });

    const $ = cheerio.load(response.data);
    const title = $(selectors.title).first().text().trim();
    const paragraphs = [];

    $(selectors.paragraphs).each((i, elem) => {
      const text = $(elem).text().trim();
      if (text.length > 20) {
        paragraphs.push(text);
      }
    });

    console.log('\n✅ Title:', title);
    console.log('📏 Paragraphs found:', paragraphs.length);
    console.log('📝 Total content length:', paragraphs.join(' ').length, 'characters');

    if (paragraphs.length > 0) {
      console.log('\n📄 First paragraph:', paragraphs[0].substring(0, 200));
    }

    return {
      success: true,
      title,
      paragraphCount: paragraphs.length,
      contentLength: paragraphs.join(' ').length
    };

  } catch (error) {
    console.error('❌ Error:', error.message);
    return { success: false, error: error.message };
  }
}

// 测试多个真实的文章页面
async function main() {
  const testPages = [
    {
      name: 'CDC - How Much and How Often to Breastfeed',
      url: 'https://www.cdc.gov/nutrition/infantandtoddlernutrition/breastfeeding/how-much-and-how-often.html',
      selectors: {
        title: 'h1',
        paragraphs: 'p'
      }
    },
    {
      name: 'CDC - When to Start Solid Foods',
      url: 'https://www.cdc.gov/nutrition/infantandtoddlernutrition/foods-and-drinks/when-to-introduce-solid-foods.html',
      selectors: {
        title: 'h1',
        paragraphs: 'p'
      }
    },
    {
      name: 'AAP - Sample Menu for 8-12 Month Old',
      url: 'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Sample-One-Day-Menu-for-an-8-to-12-Month-Old.aspx',
      selectors: {
        title: 'h1',
        paragraphs: 'p'
      }
    }
  ];

  for (const page of testPages) {
    console.log('\n' + '='.repeat(80));
    console.log('Testing:', page.name);
    console.log('='.repeat(80));

    await testArticle(page.url, page.selectors);

    // 延迟1秒避免请求过快
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

main().catch(console.error);
