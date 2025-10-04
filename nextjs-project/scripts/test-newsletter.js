#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📧 Testing Newsletter & User Engagement Features...\n');

// 测试1: 检查NewsletterSignup组件
function testNewsletterSignupComponent() {
  console.log('1. Testing Newsletter Signup Component...');
  try {
    const componentPath = path.join(__dirname, '../src/components/NewsletterSignup.tsx');
    const componentContent = fs.readFileSync(componentPath, 'utf8');
    
    const requiredElements = [
      'NewsletterSignup',
      'variant',
      'default',
      'compact',
      'inline',
      'useState',
      'handleSubmit',
      'isLoading',
      'isSuccess',
      'message',
      'fetch',
      '/api/newsletter/subscribe',
      'POST',
      'onSuccess'
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
    
    console.log(`   📊 Newsletter signup component test: ${passed}/${requiredElements.length} passed\n`);
    return passed === requiredElements.length;
  } catch (error) {
    console.log(`   ❌ Error reading newsletter signup component: ${error.message}\n`);
    return false;
  }
}

// 测试2: 检查Newsletter API端点
function testNewsletterAPIEndpoints() {
  console.log('2. Testing Newsletter API Endpoints...');
  try {
    const requiredFiles = [
      '../src/app/api/newsletter/subscribe/route.ts',
      '../src/app/api/newsletter/manage/route.ts',
      '../src/app/api/newsletter/stats/route.ts'
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
    
    console.log(`   📊 Newsletter API endpoints test: ${passed}/${requiredFiles.length} passed\n`);
    return passed === requiredFiles.length;
  } catch (error) {
    console.log(`   ❌ Error checking newsletter API endpoints: ${error.message}\n`);
    return false;
  }
}

// 测试3: 检查Newsletter API内容
function testNewsletterAPIContent() {
  console.log('3. Testing Newsletter API Content...');
  try {
    const subscribePath = path.join(__dirname, '../src/app/api/newsletter/subscribe/route.ts');
    const managePath = path.join(__dirname, '../src/app/api/newsletter/manage/route.ts');
    const statsPath = path.join(__dirname, '../src/app/api/newsletter/stats/route.ts');
    
    const requiredElements = [
      { file: subscribePath, elements: ['POST', 'email', 'newsletter_subscribers', 'supabase', 'NextRequest', 'NextResponse'] },
      { file: managePath, elements: ['GET', 'POST', 'subscribers', 'bulk', 'pagination', 'search'] },
      { file: statsPath, elements: ['GET', 'statistics', 'active_subscribers', 'monthly', 'unsubscribe_rate'] }
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
    
    console.log(`   📊 Newsletter API content test: ${totalPassed}/${totalElements} passed\n`);
    return totalPassed === totalElements;
  } catch (error) {
    console.log(`   ❌ Error checking newsletter API content: ${error.message}\n`);
    return false;
  }
}

// 测试4: 检查Newsletter管理页面
function testNewsletterManagementPage() {
  console.log('4. Testing Newsletter Management Page...');
  try {
    const pagePath = path.join(__dirname, '../src/app/admin/newsletter/page.tsx');
    const pageContent = fs.readFileSync(pagePath, 'utf8');
    
    const requiredElements = [
      'NewsletterManagement',
      'useState',
      'useEffect',
      'Subscriber',
      'NewsletterStats',
      'loadStats',
      'loadSubscribers',
      'handleBulkAction',
      'selectedSubscribers',
      'pagination',
      'search',
      'filter',
      'Card',
      'Button'
    ];
    
    let passed = 0;
    requiredElements.forEach(element => {
      if (pageContent.includes(element)) {
        console.log(`   ✅ ${element}`);
        passed++;
      } else {
        console.log(`   ❌ Missing: ${element}`);
      }
    });
    
    console.log(`   📊 Newsletter management page test: ${passed}/${requiredElements.length} passed\n`);
    return passed === requiredElements.length;
  } catch (error) {
    console.log(`   ❌ Error reading newsletter management page: ${error.message}\n`);
    return false;
  }
}

// 测试5: 检查Footer集成
function testFooterIntegration() {
  console.log('5. Testing Footer Integration...');
  try {
    const footerPath = path.join(__dirname, '../src/components/layout/Footer.tsx');
    const footerContent = fs.readFileSync(footerPath, 'utf8');
    
    const requiredElements = [
      "import NewsletterSignup from '../NewsletterSignup'",
      '<NewsletterSignup',
      'variant="compact"',
      'Stay Updated',
      'Get the latest parenting tips'
    ];
    
    let passed = 0;
    requiredElements.forEach(element => {
      if (footerContent.includes(element)) {
        console.log(`   ✅ ${element}`);
        passed++;
      } else {
        console.log(`   ❌ Missing: ${element}`);
      }
    });
    
    console.log(`   📊 Footer integration test: ${passed}/${requiredElements.length} passed\n`);
    return passed === requiredElements.length;
  } catch (error) {
    console.log(`   ❌ Error checking footer integration: ${error.message}\n`);
    return false;
  }
}

// 测试6: 检查Header集成
function testHeaderIntegration() {
  console.log('6. Testing Header Integration...');
  try {
    const headerPath = path.join(__dirname, '../src/components/Header.tsx');
    const headerContent = fs.readFileSync(headerPath, 'utf8');
    
    const requiredElements = [
      'href="/admin/newsletter"',
      'Newsletter'
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

// 测试7: 检查文件结构
function testFileStructure() {
  console.log('7. Testing File Structure...');
  try {
    const requiredFiles = [
      '../src/components/NewsletterSignup.tsx',
      '../src/app/api/newsletter/subscribe/route.ts',
      '../src/app/api/newsletter/manage/route.ts',
      '../src/app/api/newsletter/stats/route.ts',
      '../src/app/admin/newsletter/page.tsx'
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
    testNewsletterSignupComponent,
    testNewsletterAPIEndpoints,
    testNewsletterAPIContent,
    testNewsletterManagementPage,
    testFooterIntegration,
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
  
  console.log('🎯 Newsletter & User Engagement Test Results Summary:');
  console.log(`   📊 Total tests: ${totalTests}`);
  console.log(`   ✅ Passed: ${passedTests}`);
  console.log(`   ❌ Failed: ${totalTests - passedTests}`);
  console.log(`   📈 Success rate: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All newsletter & user engagement tests passed!');
    console.log('   Your newsletter system is ready for user engagement.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the issues above.');
  }
}

// 执行测试
runAllTests();




