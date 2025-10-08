#!/usr/bin/env node

const axios = require('axios');
const cheerio = require('cheerio');

async function testArticle(url) {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; JupitLunarBot/1.0)'
      }
    });

    const $ = cheerio.load(response.data);
    const title = $('h1').first().text().trim();
    const paragraphs = [];

    $('p').each((i, elem) => {
      const text = $(elem).text().trim();
      if (text.length > 20) {
        paragraphs.push(text);
      }
    });

    const success = paragraphs.length >= 3 && paragraphs.join(' ').length > 500;

    console.log(`${success ? '✅' : '❌'} ${url}`);
    console.log(`   Title: ${title.substring(0, 80)}`);
    console.log(`   Paragraphs: ${paragraphs.length}, Content: ${paragraphs.join(' ').length} chars\n`);

    return { url, success, title, paragraphCount: paragraphs.length };

  } catch (error) {
    console.log(`❌ ${url}`);
    console.log(`   Error: ${error.message}\n`);
    return { url, success: false, error: error.message };
  }
}

async function main() {
  console.log('🔍 Testing Real Article URLs from Authoritative Sources\n');
  console.log('='.repeat(80) + '\n');

  const testUrls = [
    // CDC - 权威来源
    'https://www.cdc.gov/breastfeeding/faq/index.htm',

    // AAP - HealthyChildren.org
    'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Sample-One-Day-Menu-for-an-8-to-12-Month-Old.aspx',
    'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Amount-and-Schedule-of-Baby-Formula-Feedings.aspx',
    'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Starting-Solid-Foods.aspx',
    'https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/Working-Together-Breastfeeding-and-Solid-Foods.aspx',

    // Mayo Clinic
    'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/infant-development/art-20048178',
    'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/baby-sleep/art-20045014',
    'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/breastfeeding-nutrition/art-20046912',

    // Cleveland Clinic
    'https://my.clevelandclinic.org/health/articles/9678-infant-nutrition',
    'https://my.clevelandclinic.org/health/articles/14300-infant-sleep',

    // KidsHealth
    'https://kidshealth.org/en/parents/breastfeed-starting.html',
    'https://kidshealth.org/en/parents/formulafeed-starting.html',
    'https://kidshealth.org/en/parents/solid-foods.html',

    // NHS UK
    'https://www.nhs.uk/conditions/baby/breastfeeding-and-bottle-feeding/breastfeeding-and-lifestyle/breastfeeding-and-diet/',
    'https://www.nhs.uk/conditions/baby/weaning-and-feeding/baby-led-weaning/',
  ];

  const results = [];

  for (const url of testUrls) {
    const result = await testArticle(url);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(80));
  console.log('📊 Summary');
  console.log('='.repeat(80));

  const successful = results.filter(r => r.success);
  console.log(`✅ Successful: ${successful.length}/${results.length}`);
  console.log('\nValid URLs to use:');
  successful.forEach(r => {
    console.log(`  - ${r.url}`);
  });
}

main().catch(console.error);
