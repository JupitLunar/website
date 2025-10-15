#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📊 Testing Analytics & Monitoring Features...\n');

// 测试1: 检查Analytics库
function testAnalyticsLibrary() {
  console.log('1. Testing Analytics Library...');
  try {
    const libPath = path.join(__dirname, '../src/lib/analytics.ts');
    const libContent = fs.readFileSync(libPath, 'utf8');
    
    const requiredElements = [
      'initGA',
      'trackPageView',
      'trackEvent',
      'trackNewsletterSubscription',
      'trackSearch',
      'trackArticleView',
      'trackHubView',
      'trackEngagement',
      'trackPerformance',
      'trackError',
      'GA_TRACKING_ID',
      'gtag',
      'dataLayer',
      'Google Analytics'
    ];
    
    let passed = 0;
    requiredElements.forEach(element => {
      if (libContent.includes(element)) {
        console.log(`   ✅ ${element}`);
        passed++;
      } else {
        console.log(`   ❌ Missing: ${element}`);
      }
    });
    
    console.log(`   📊 Analytics library test: ${passed}/${requiredElements.length} passed\n`);
    return passed === requiredElements.length;
  } catch (error) {
    console.log(`   ❌ Error reading analytics library: ${error.message}\n`);
    return false;
  }
}

// 测试2: 检查Analytics组件
function testAnalyticsComponent() {
  console.log('2. Testing Analytics Component...');
  try {
    const componentPath = path.join(__dirname, '../src/components/Analytics.tsx');
    const componentContent = fs.readFileSync(componentPath, 'utf8');
    
    const requiredElements = [
      'Analytics',
      'useEffect',
      'usePathname',
      'useSearchParams',
      'initGA',
      'trackPageView',
      'trackPerformance',
      'PerformanceObserver',
      'first-contentful-paint',
      'largest-contentful-paint',
      'cumulative_layout_shift',
      'first_input_delay'
    ];
    
    let passed = 0;
    requiredElements.forEach(element => {
      if (componentContent.includes(element)) {
        console.log(`   ✅ ${element}`);
        passed++;
      } else {
        console.log(`   ❌ Missing: ${element}`);
      }
    });
    
    console.log(`   📊 Analytics component test: ${passed}/${requiredElements.length} passed\n`);
    return passed === requiredElements.length;
  } catch (error) {
    console.log(`   ❌ Error reading analytics component: ${error.message}\n`);
    return false;
  }
}

// 测试3: 检查Analytics API端点
function testAnalyticsAPIEndpoints() {
  console.log('3. Testing Analytics API Endpoints...');
  try {
    const requiredFiles = [
      '../src/app/api/analytics/events/route.ts',
      '../src/app/api/analytics/stats/route.ts'
    ];
    
    let passed = 0;
    requiredFiles.forEach(filePath => {
      const fullPath = path.join(__dirname, filePath);
      if (fs.existsSync(fullPath)) {
        console.log(`   ✅ ${filePath}`);
        passed++;
      } else {
        console.log(`   ❌ Missing: ${filePath}`);
      }
    });
    
    console.log(`   📊 Analytics API endpoints test: ${passed}/${requiredFiles.length} passed\n`);
    return passed === requiredFiles.length;
  } catch (error) {
    console.log(`   ❌ Error checking analytics API endpoints: ${error.message}\n`);
    return false;
  }
}

// 测试4: 检查Analytics API内容
function testAnalyticsAPIContent() {
  console.log('4. Testing Analytics API Content...');
  try {
    const eventsPath = path.join(__dirname, '../src/app/api/analytics/events/route.ts');
    const statsPath = path.join(__dirname, '../src/app/api/analytics/stats/route.ts');
    
    const requiredElements = [
      { file: eventsPath, elements: ['POST', 'GET', 'analytics_events', 'event_type', 'event_data', 'supabase'] },
      { file: statsPath, elements: ['GET', 'page_views', 'unique_visitors', 'top_pages', 'performance_metrics', 'search_queries'] }
    ];
    
    let totalPassed = 0;
    let totalElements = 0;
    
    requiredElements.forEach(({ file, elements }) => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        let passed = 0;
        
        elements.forEach(element => {
          if (content.includes(element)) {
            console.log(`   ✅ ${path.basename(file)}: ${element}`);
            passed++;
          } else {
            console.log(`   ❌ ${path.basename(file)}: Missing ${element}`);
          }
        });
        
        totalPassed += passed;
        totalElements += elements.length;
      }
    });
    
    console.log(`   📊 Analytics API content test: ${totalPassed}/${totalElements} passed\n`);
    return totalPassed === totalElements;
  } catch (error) {
    console.log(`   ❌ Error checking analytics API content: ${error.message}\n`);
    return false;
  }
}

// 测试5: 检查Analytics仪表板
function testAnalyticsDashboard() {
  console.log('5. Testing Analytics Dashboard...');
  try {
    const dashboardPath = path.join(__dirname, '../src/app/admin/analytics/page.tsx');
    const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');
    
    const requiredElements = [
      'AnalyticsDashboard',
      'useState',
      'useEffect',
      'AnalyticsData',
      'page_views',
      'unique_visitors',
      'bounce_rate',
      'performance_metrics',
      'Core Web Vitals',
      'top_pages',
      'search_queries',
      'Card',
      'Button',
      'timeRange'
    ];
    
    let passed = 0;
    requiredElements.forEach(element => {
      if (dashboardContent.includes(element)) {
        console.log(`   ✅ ${element}`);
        passed++;
      } else {
        console.log(`   ❌ Missing: ${element}`);
      }
    });
    
    console.log(`   📊 Analytics dashboard test: ${passed}/${requiredElements.length} passed\n`);
    return passed === requiredElements.length;
  } catch (error) {
    console.log(`   ❌ Error reading analytics dashboard: ${error.message}\n`);
    return false;
  }
}

// 测试6: 检查Layout集成
function testLayoutIntegration() {
  console.log('6. Testing Layout Integration...');
  try {
    const layoutPath = path.join(__dirname, '../src/app/layout.tsx');
    const layoutContent = fs.readFileSync(layoutPath, 'utf8');
    
    const requiredElements = [
      "import Analytics from '@/components/Analytics'",
      '<Analytics />'
    ];
    
    let passed = 0;
    requiredElements.forEach(element => {
      if (layoutContent.includes(element)) {
        console.log(`   ✅ ${element}`);
        passed++;
      } else {
        console.log(`   ❌ Missing: ${element}`);
      }
    });
    
    console.log(`   📊 Layout integration test: ${passed}/${requiredElements.length} passed\n`);
    return passed === requiredElements.length;
  } catch (error) {
    console.log(`   ❌ Error checking layout integration: ${error.message}\n`);
    return false;
  }
}

// 测试7: 检查Header集成
function testHeaderIntegration() {
  console.log('7. Testing Header Integration...');
  try {
    const headerPath = path.join(__dirname, '../src/components/Header.tsx');
    const headerContent = fs.readFileSync(headerPath, 'utf8');
    
    const requiredElements = [
      'href="/admin/analytics"',
      'Analytics'
    ];
    
    let passed = 0;
    requiredElements.forEach(element => {
      if (headerContent.includes(element)) {
        console.log(`   ✅ ${element}`);
        passed++;
      } else {
        console.log(`   ❌ Missing: ${element}`);
      }
    });
    
    console.log(`   📊 Header integration test: ${passed}/${requiredElements.length} passed\n`);
    return passed === requiredElements.length;
  } catch (error) {
    console.log(`   ❌ Error checking header integration: ${error.message}\n`);
    return false;
  }
}

// 测试8: 检查文件结构
function testFileStructure() {
  console.log('8. Testing File Structure...');
  try {
    const requiredFiles = [
      '../src/lib/analytics.ts',
      '../src/components/Analytics.tsx',
      '../src/app/api/analytics/events/route.ts',
      '../src/app/api/analytics/stats/route.ts',
      '../src/app/admin/analytics/page.tsx'
    ];
    
    let passed = 0;
    requiredFiles.forEach(filePath => {
      const fullPath = path.join(__dirname, filePath);
      if (fs.existsSync(fullPath)) {
        console.log(`   ✅ ${filePath}`);
        passed++;
      } else {
        console.log(`   ❌ Missing: ${filePath}`);
      }
    });
    
    console.log(`   📊 File structure test: ${passed}/${requiredFiles.length} passed\n`);
    return passed === requiredFiles.length;
  } catch (error) {
    console.log(`   ❌ Error checking file structure: ${error.message}\n`);
    return false;
  }
}

// 运行所有测试
function runAllTests() {
  const tests = [
    testAnalyticsLibrary,
    testAnalyticsComponent,
    testAnalyticsAPIEndpoints,
    testAnalyticsAPIContent,
    testAnalyticsDashboard,
    testLayoutIntegration,
    testHeaderIntegration,
    testFileStructure
  ];
  
  let passedTests = 0;
  const totalTests = tests.length;
  
  tests.forEach(test => {
    if (test()) {
      passedTests++;
    }
  });
  
  console.log('🎯 Analytics & Monitoring Test Results Summary:');
  console.log(`   📊 Total tests: ${totalTests}`);
  console.log(`   ✅ Passed: ${passedTests}`);
  console.log(`   ❌ Failed: ${totalTests - passedTests}`);
  console.log(`   📈 Success rate: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All analytics & monitoring tests passed!');
    console.log('   Your analytics system is ready for tracking and monitoring.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the issues above.');
  }
}

// 执行测试
runAllTests();









