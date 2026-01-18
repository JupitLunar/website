#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing SEO & GEO Optimization Features...\n');

// Test 1: Check robots.ts
function testRobotsTxt() {
  console.log('1. Testing robots.ts...');
  try {
    const robotsPath = path.join(__dirname, '../src/app/robots.ts');
    const robotsContent = fs.readFileSync(robotsPath, 'utf8');

    // Check for correct configuration in typescript file
    const requiredElements = [
      "import { MetadataRoute } from 'next';",
      "export default function robots(): MetadataRoute.Robots",
      "userAgent: '*'",
      "allow: '/'",
      "disallow: ['/admin/', '/api/auth/', '/private/']",
      "userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'Amazonbot', 'ClaudeBot', 'PerplexityBot']",
      "sitemap: `${siteUrl}/sitemap.xml`",
      "host: siteUrl"
    ];

    let passed = 0;
    requiredElements.forEach(element => {
      if (robotsContent.includes(element)) {
        console.log(`   ✅ ${element}`);
        passed++;
      } else {
        console.log(`   ❌ Missing: ${element}`);
      }
    });

    console.log(`   📊 Robots.ts test: ${passed}/${requiredElements.length} passed\n`);
    return passed === requiredElements.length;
  } catch (error) {
    console.log(`   ❌ Error reading robots.ts: ${error.message}\n`);
    return false;
  }
}

// 测试2: 检查sitemap.ts
function testSitemapTs() {
  console.log('2. Testing sitemap.ts...');
  try {
    const sitemapPath = path.join(__dirname, '../src/app/sitemap.ts');
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

    const requiredElements = [
      'MetadataRoute.Sitemap',
      'contentManager.getAllArticles()',
      'contentManager.getContentHubs()',
      "const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.momaiagent.com').replace(/\\/$/, '')",
      'changeFrequency',
      'priority',
      'lastModified'
    ];

    let passed = 0;
    requiredElements.forEach(element => {
      if (sitemapContent.includes(element)) {
        console.log(`   ✅ ${element}`);
        passed++;
      } else {
        console.log(`   ❌ Missing: ${element}`);
      }
    });

    console.log(`   📊 Sitemap.ts test: ${passed}/${requiredElements.length} passed\n`);
    return passed === requiredElements.length;
  } catch (error) {
    console.log(`   ❌ Error reading sitemap.ts: ${error.message}\n`);
    return false;
  }
}

// 测试3: 检查JSON-LD生成器
function testJsonLdGenerator() {
  console.log('3. Testing JSON-LD generator...');
  try {
    const jsonLdPath = path.join(__dirname, '../src/lib/json-ld.ts');
    const jsonLdContent = fs.readFileSync(jsonLdPath, 'utf8');

    const requiredFunctions = [
      'generateArticleStructuredData',
      'generateHubStructuredData',
      'generateBreadcrumbStructuredData',
      'generateWebsiteStructuredData',
      'generateOrganizationStructuredData',
      'generateFAQStructuredData',
      'generateProductStructuredData'
    ];

    const requiredSchemas = [
      '@type": "Article"',
      '@type": "CollectionPage"',
      '@type": "BreadcrumbList"',
      '@type": "WebSite"',
      '@type": "Organization"',
      '@type": "FAQPage"',
      '@type": "SoftwareApplication"'
    ];

    let functionsPassed = 0;
    requiredFunctions.forEach(func => {
      if (jsonLdContent.includes(func)) {
        console.log(`   ✅ Function: ${func}`);
        functionsPassed++;
      } else {
        console.log(`   ❌ Missing function: ${func}`);
      }
    });

    let schemasPassed = 0;
    requiredSchemas.forEach(schema => {
      if (jsonLdContent.includes(schema)) {
        console.log(`   ✅ Schema: ${schema}`);
        schemasPassed++;
      } else {
        console.log(`   ❌ Missing schema: ${schema}`);
      }
    });

    console.log(`   📊 JSON-LD test: ${functionsPassed}/${requiredFunctions.length} functions, ${schemasPassed}/${requiredSchemas.length} schemas\n`);
    return functionsPassed === requiredFunctions.length && schemasPassed === requiredSchemas.length;
  } catch (error) {
    console.log(`   ❌ Error reading json-ld.ts: ${error.message}\n`);
    return false;
  }
}

// 测试4: 检查动态页面
function testDynamicPages() {
  console.log('4. Testing dynamic pages...');
  try {
    const articlePagePath = path.join(__dirname, '../src/app/[slug]/page.tsx');
    const hubPagePath = path.join(__dirname, '../src/app/hub/[hub-slug]/page.tsx');

    const articleContent = fs.readFileSync(articlePagePath, 'utf8');
    const hubContent = fs.readFileSync(hubPagePath, 'utf8');

    const articleRequired = [
      'generateMetadata',
      'generateStaticParams',
      'generateArticleStructuredData',
      'generateBreadcrumbStructuredData',
      'openGraph',
      'twitter'
    ];

    const hubRequired = [
      'generateMetadata',
      'generateStaticParams',
      'generateHubStructuredData',
      'generateBreadcrumbStructuredData'
    ];

    let articlePassed = 0;
    articleRequired.forEach(element => {
      if (articleContent.includes(element)) {
        console.log(`   ✅ Article page: ${element}`);
        articlePassed++;
      } else {
        console.log(`   ❌ Article page missing: ${element}`);
      }
    });

    let hubPassed = 0;
    hubRequired.forEach(element => {
      if (hubContent.includes(element)) {
        console.log(`   ✅ Hub page: ${element}`);
        hubPassed++;
      } else {
        console.log(`   ❌ Hub page missing: ${element}`);
      }
    });

    console.log(`   📊 Dynamic pages test: Article ${articlePassed}/${articleRequired.length}, Hub ${hubPassed}/${hubRequired.length}\n`);
    return articlePassed === articleRequired.length && hubPassed === hubRequired.length;
  } catch (error) {
    console.log(`   ❌ Error reading dynamic pages: ${error.message}\n`);
    return false;
  }
}

// 测试5: 检查404页面
function testNotFoundPage() {
  console.log('5. Testing 404 page...');
  try {
    const notFoundPath = path.join(__dirname, '../src/app/not-found.tsx');
    const notFoundContent = fs.readFileSync(notFoundPath, 'utf8');

    const requiredElements = [
      'Page Not Found',
      'Go Home',
      'content hubs',
      'pregnancy-birth',
      'newborn-care',
      'infant-development',
      'nutrition-feeding',
      'health-safety',
      'parenting-tips'
    ];

    let passed = 0;
    requiredElements.forEach(element => {
      if (notFoundContent.includes(element)) {
        console.log(`   ✅ ${element}`);
        passed++;
      } else {
        console.log(`   ❌ Missing: ${element}`);
      }
    });

    console.log(`   📊 404 page test: ${passed}/${requiredElements.length} passed\n`);
    return passed === requiredElements.length;
  } catch (error) {
    console.log(`   ❌ Error reading not-found.tsx: ${error.message}\n`);
    return false;
  }
}

// 运行所有测试
function runAllTests() {
  const tests = [
    testRobotsTxt,
    testSitemapTs,
    testJsonLdGenerator,
    testDynamicPages,
    testNotFoundPage
  ];

  let passedTests = 0;
  const totalTests = tests.length;

  tests.forEach(test => {
    if (test()) {
      passedTests++;
    }
  });

  console.log('🎯 Test Results Summary:');
  console.log(`   📊 Total tests: ${totalTests}`);
  console.log(`   ✅ Passed: ${passedTests}`);
  console.log(`   ❌ Failed: ${totalTests - passedTests}`);
  console.log(`   📈 Success rate: ${Math.round((passedTests / totalTests) * 100)}%`);

  if (passedTests === totalTests) {
    console.log('\n🎉 All SEO & GEO optimization tests passed!');
    console.log('   Your website is ready for AI crawlers and search engines.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the issues above.');
  }
}

// 执行测试
runAllTests();
