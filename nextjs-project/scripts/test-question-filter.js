#!/usr/bin/env node

/**
 * 测试问题过滤机制
 * 验证系统是否正确拒绝非母婴相关的问题
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const API_URL = process.env.NEXT_PUBLIC_SITE_URL 
  ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/rag`
  : 'http://localhost:3000/api/rag';

// 测试用例
const testCases = [
  {
    category: '✅ 母婴相关 - 应该回答',
    questions: [
      'How often should I breastfeed my newborn?',
      'What are the developmental milestones for a 6-month-old?',
      'When can I start solid foods for my baby?',
      'My baby has a fever, what should I do?',
      'How to deal with postpartum depression?',
      '宝宝几个月可以吃辅食？'  // 中文测试
    ]
  },
  {
    category: '❌ 非母婴相关 - 应该拒绝',
    questions: [
      'What is blockchain technology?',
      'How do I program in Python?',
      'Who won the NBA championship?',
      'What are the best vacation spots in Europe?',
      'How to invest in cryptocurrency?',
      'What is the capital of France?',
      'How to fix my iPhone?',
      'Best movies of 2024?'
    ]
  },
  {
    category: '🤔 边界情况 - 需要判断',
    questions: [
      'How to lose weight after pregnancy?',  // 母婴相关
      'What are healthy snacks for adults?',  // 可能不相关
      'School lunch ideas for 5-year-old?',   // 可能超出年龄范围
    ]
  }
];

async function testQuestion(question, expectedRelevance) {
  console.log(`\n📝 Testing: "${question}"`);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: question,
        sessionId: 'test-session'
      })
    });

    if (!response.ok) {
      console.log(`   ❌ API Error: ${response.status} ${response.statusText}`);
      return { success: false, error: `HTTP ${response.status}` };
    }

    const data = await response.json();
    
    // 检查是否是拒绝回答的响应
    const isRejection = 
      data.answer?.summary?.includes("specifically designed to help with maternal and infant care") ||
      data.answer?.summary?.includes("I focus exclusively on maternal and infant care");
    
    console.log(`   📊 Response summary: "${data.answer?.summary?.substring(0, 100)}..."`);
    
    if (isRejection) {
      console.log(`   🚫 System REJECTED the question (not maternal/infant related)`);
    } else {
      console.log(`   ✅ System ACCEPTED the question (maternal/infant related)`);
    }
    
    // 验证结果
    if (expectedRelevance === 'should_answer' && isRejection) {
      console.log(`   ⚠️  WARNING: Should have answered but rejected!`);
      return { success: false, wrongRejection: true };
    } else if (expectedRelevance === 'should_reject' && !isRejection) {
      console.log(`   ⚠️  WARNING: Should have rejected but answered!`);
      return { success: false, wrongAcceptance: true };
    }
    
    return { 
      success: true, 
      isRejection,
      summary: data.answer?.summary 
    };
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🧪 开始测试问题过滤机制\n');
  console.log(`📡 API URL: ${API_URL}\n`);
  console.log('=' .repeat(80));
  
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    errors: 0
  };
  
  // 测试应该回答的问题
  console.log(`\n${testCases[0].category}`);
  console.log('='.repeat(80));
  for (const question of testCases[0].questions) {
    results.total++;
    const result = await testQuestion(question, 'should_answer');
    if (result.success && !result.isRejection) {
      results.passed++;
      console.log('   ✅ PASS');
    } else if (result.error) {
      results.errors++;
      console.log('   ⚠️  ERROR');
    } else {
      results.failed++;
      console.log('   ❌ FAIL');
    }
    await new Promise(resolve => setTimeout(resolve, 1000)); // 避免请求过快
  }
  
  // 测试应该拒绝的问题
  console.log(`\n${testCases[1].category}`);
  console.log('='.repeat(80));
  for (const question of testCases[1].questions) {
    results.total++;
    const result = await testQuestion(question, 'should_reject');
    if (result.success && result.isRejection) {
      results.passed++;
      console.log('   ✅ PASS');
    } else if (result.error) {
      results.errors++;
      console.log('   ⚠️  ERROR');
    } else {
      results.failed++;
      console.log('   ❌ FAIL');
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // 测试边界情况
  console.log(`\n${testCases[2].category}`);
  console.log('='.repeat(80));
  for (const question of testCases[2].questions) {
    results.total++;
    const result = await testQuestion(question, 'boundary');
    if (result.success) {
      results.passed++;
      console.log('   ℹ️  COMPLETED (judgment call)');
    } else if (result.error) {
      results.errors++;
      console.log('   ⚠️  ERROR');
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // 打印总结
  console.log('\n' + '='.repeat(80));
  console.log('📊 测试总结\n');
  console.log(`   总测试数: ${results.total}`);
  console.log(`   ✅ 通过: ${results.passed}`);
  console.log(`   ❌ 失败: ${results.failed}`);
  console.log(`   ⚠️  错误: ${results.errors}`);
  console.log(`   成功率: ${((results.passed / results.total) * 100).toFixed(1)}%`);
  console.log('='.repeat(80));
  
  if (results.failed === 0 && results.errors === 0) {
    console.log('\n🎉 所有测试通过！问题过滤机制工作正常。');
  } else if (results.errors > 0) {
    console.log('\n⚠️  测试过程中遇到错误，请检查 API 配置和网络连接。');
  } else {
    console.log('\n⚠️  部分测试失败，请检查过滤逻辑。');
  }
}

// 运行测试
runTests().catch(error => {
  console.error('❌ 测试运行失败:', error);
  process.exit(1);
});

