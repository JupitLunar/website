#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Admin Interface Features...\n');

// 测试1: 检查管理主页面
function testAdminMainPage() {
  console.log('1. Testing Admin Main Page...');
  try {
    const adminPagePath = path.join(__dirname, '../../src/app/admin/page.tsx');
    const adminPageContent = fs.readFileSync(adminPagePath, 'utf8');
    
    const requiredElements = [
      'JupitLunar Admin',
      'New Article',
      'Total Articles',
      'Content Hubs',
      'Total FAQs',
      'Citations',
      'Recent Articles',
      'useState',
      'useEffect',
      'contentManager.getContentStats()',
      'contentManager.getContentHubs()'
    ];
    
    let passed = 0;
    requiredElements.forEach(element => {
      if (adminPageContent.includes(element)) {
        console.log(`   ✅ ${element}`);
        passed++;
      } else {
        console.log(`   ❌ Missing: ${element}`);
      }
    });
    
    console.log(`   📊 Admin main page test: ${passed}/${requiredElements.length} passed\n`);
    return passed === requiredElements.length;
  } catch (error) {
    console.log(`   ❌ Error reading admin page: ${error.message}\n`);
    return false;
  }
}

// 测试2: 检查新文章页面
function testNewArticlePage() {
  console.log('2. Testing New Article Page...');
  try {
    const newArticlePath = path.join(__dirname, '../../src/app/admin/articles/new/page.tsx');
    const newArticleContent = fs.readFileSync(newArticlePath, 'utf8');
    
    const requiredElements = [
      'Create New Article',
      'Basic Information',
      'Content Settings',
      'Content',
      'Additional Settings',
      'Title',
      'Slug',
      'One-liner Summary',
      'Content Hub',
      'Content Type',
      'Language',
      'Article Content (Markdown)',
      'Key Entities',
      'Featured Image URL',
      'Target Region',
      'Target Age Range',
      'handleSubmit',
      'handleInputChange',
      'useRouter',
      'framer-motion'
    ];
    
    let passed = 0;
    requiredElements.forEach(element => {
      if (newArticleContent.includes(element)) {
        console.log(`   ✅ ${element}`);
        passed++;
      } else {
        console.log(`   ❌ Missing: ${element}`);
      }
    });
    
    console.log(`   📊 New article page test: ${passed}/${requiredElements.length} passed\n`);
    return passed === requiredElements.length;
  } catch (error) {
    console.log(`   ❌ Error reading new article page: ${error.message}\n`);
    return false;
  }
}

// 测试3: 检查文件结构
function testFileStructure() {
  console.log('3. Testing File Structure...');
  try {
    const requiredFiles = [
      '../../src/app/admin/page.tsx',
      '../../src/app/admin/articles/new/page.tsx'
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
    testAdminMainPage,
    testNewArticlePage,
    testFileStructure
  ];
  
  let passedTests = 0;
  const totalTests = tests.length;
  
  tests.forEach(test => {
    if (test()) {
      passedTests++;
    }
  });
  
  console.log('🎯 Admin Interface Test Results Summary:');
  console.log(`   📊 Total tests: ${totalTests}`);
  console.log(`   ✅ Passed: ${passedTests}`);
  console.log(`   ❌ Failed: ${totalTests - passedTests}`);
  console.log(`   📈 Success rate: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All admin interface tests passed!');
    console.log('   Your admin interface is ready for content management.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the issues above.');
  }
}

// 执行测试
runAllTests();



