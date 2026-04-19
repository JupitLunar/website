#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing SEO & AEO surfaces...\n');

function read(relativePath) {
  return fs.readFileSync(path.join(__dirname, relativePath), 'utf8');
}

function assertIncludes(content, label, requiredElements) {
  let passed = 0;

  requiredElements.forEach((element) => {
    if (content.includes(element)) {
      console.log(`   ✅ ${element}`);
      passed++;
    } else {
      console.log(`   ❌ Missing: ${element}`);
    }
  });

  console.log(`   📊 ${label}: ${passed}/${requiredElements.length} passed\n`);
  return passed === requiredElements.length;
}

function testRobotsTxt() {
  console.log('1. Testing robots.ts...');
  try {
    const robotsContent = read('../../src/app/robots.ts');
    return assertIncludes(robotsContent, 'Robots.ts test', [
      "import { MetadataRoute } from 'next';",
      'export default function robots(): MetadataRoute.Robots',
      "userAgent: '*'",
      "allow: '/'",
      "disallow: ['/admin/', '/api/', '/private/', '/search', '/complete', '/tasks']",
      "userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'Amazonbot', 'ClaudeBot', 'PerplexityBot']",
      'sitemap: `${siteUrl}/sitemap.xml`',
      'host: siteUrl',
    ]);
  } catch (error) {
    console.log(`   ❌ Error reading robots.ts: ${error.message}\n`);
    return false;
  }
}

function testSitemapTs() {
  console.log('2. Testing sitemap.ts...');
  try {
    const sitemapContent = read('../../src/app/sitemap.ts');
    return assertIncludes(sitemapContent, 'Sitemap.ts test', [
      'MetadataRoute.Sitemap',
      'contentManager.getAllArticles()',
      'createAdminClient()',
      "url: `${siteUrl}/topics`",
      "url: `${siteUrl}/foods`",
      "url: `${siteUrl}/insight`",
      "url: `${siteUrl}/articles`",
      'changeFrequency',
      'priority',
      'lastModified',
    ]);
  } catch (error) {
    console.log(`   ❌ Error reading sitemap.ts: ${error.message}\n`);
    return false;
  }
}

function testJsonLdGenerator() {
  console.log('3. Testing JSON-LD generator...');
  try {
    const jsonLdContent = read('../../src/lib/json-ld.ts');

    const requiredFunctions = [
      'generateArticleStructuredData',
      'generateHubStructuredData',
      'generateBreadcrumbStructuredData',
      'generateWebsiteStructuredData',
      'generateOrganizationStructuredData',
      'generateFAQStructuredData',
      'generateProductStructuredData',
    ];

    const requiredSchemas = [
      '@type": "Article"',
      '@type": "CollectionPage"',
      '@type": "BreadcrumbList"',
      '@type": "WebSite"',
      '@type": "Organization"',
      '@type": "FAQPage"',
      '@type": "SoftwareApplication"',
      '@type": "HealthTopicContent"',
    ];

    let functionsPassed = 0;
    requiredFunctions.forEach((func) => {
      if (jsonLdContent.includes(func)) {
        console.log(`   ✅ Function: ${func}`);
        functionsPassed++;
      } else {
        console.log(`   ❌ Missing function: ${func}`);
      }
    });

    let schemasPassed = 0;
    requiredSchemas.forEach((schema) => {
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

function testDynamicPages() {
  console.log('4. Testing dynamic pages...');
  try {
    const articleContent = read('../../src/app/[slug]/page.tsx');
    const hubContent = read('../../src/app/hub/[hub-slug]/page.tsx');

    const articleRequired = [
      'generateMetadata',
      'generateStaticParams',
      'generateArticleStructuredData',
      'generateBreadcrumbStructuredData',
      'openGraph',
      'twitter',
    ];

    const hubRequired = [
      "redirect(`/insight?hub=${encodeURIComponent(params['hub-slug'])}`)",
      "index: false",
      "follow: false",
    ];

    let articlePassed = 0;
    articleRequired.forEach((element) => {
      if (articleContent.includes(element)) {
        console.log(`   ✅ Article page: ${element}`);
        articlePassed++;
      } else {
        console.log(`   ❌ Article page missing: ${element}`);
      }
    });

    let hubPassed = 0;
    hubRequired.forEach((element) => {
      if (hubContent.includes(element)) {
        console.log(`   ✅ Hub redirect page: ${element}`);
        hubPassed++;
      } else {
        console.log(`   ❌ Hub redirect page missing: ${element}`);
      }
    });

    console.log(`   📊 Dynamic pages test: Article ${articlePassed}/${articleRequired.length}, Hub redirect ${hubPassed}/${hubRequired.length}\n`);
    return articlePassed === articleRequired.length && hubPassed === hubRequired.length;
  } catch (error) {
    console.log(`   ❌ Error reading dynamic pages: ${error.message}\n`);
    return false;
  }
}

function testAeoSurfaceFiles() {
  console.log('5. Testing AEO surface files...');
  try {
    const llmsContent = read('../../src/app/llms.txt/route.ts');
    const feedContent = read('../../src/app/feed.json/route.ts');
    const trustContent = read('../../src/app/trust/page.tsx');

    const checks = [
      'api/ai-feed-v2',
      'api/kb/query',
      'api/kb/insights',
      'jsonfeed.org/version/1.1',
      'HealthTopicContent',
      'Trust Center',
    ];

    const combined = `${llmsContent}\n${feedContent}\n${trustContent}`;
    return assertIncludes(combined, 'AEO surface test', checks);
  } catch (error) {
    console.log(`   ❌ Error reading AEO files: ${error.message}\n`);
    return false;
  }
}

function testNotFoundPage() {
  console.log('6. Testing 404 page...');
  try {
    const notFoundContent = read('../../src/app/not-found.tsx');
    return assertIncludes(notFoundContent, '404 page test', [
      'Page Not Found',
      'Go Home',
      'Topics Library',
      'Insights',
      'Foods Database',
      'Trust Center',
      'index: false',
      'follow: true',
    ]);
  } catch (error) {
    console.log(`   ❌ Error reading not-found.tsx: ${error.message}\n`);
    return false;
  }
}

function runAllTests() {
  const tests = [
    testRobotsTxt,
    testSitemapTs,
    testJsonLdGenerator,
    testDynamicPages,
    testAeoSurfaceFiles,
    testNotFoundPage,
  ];

  let passedTests = 0;
  const totalTests = tests.length;

  tests.forEach((test) => {
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
    console.log('\n🎉 All SEO & AEO surface tests passed!');
    console.log('   The site metadata, crawl surfaces, and AI-readable exports match the current architecture.');
  } else {
    console.log('\n⚠️  Some SEO & AEO tests failed. Please review the issues above.');
  }
}

runAllTests();
