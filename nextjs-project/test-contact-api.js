// 测试联系表单API端点
const testContactAPI = async () => {
  const testData = {
    name: "Test User",
    email: "test@example.com", 
    message: "This is a test message",
    contactType: "support"
  };

  try {
    console.log('Testing contact API...');
    console.log('Test data:', testData);
    
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', result);
    
    if (response.ok) {
      console.log('✅ Contact API test successful!');
    } else {
      console.log('❌ Contact API test failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
};

// 测试订阅API端点
const testNewsletterAPI = async () => {
  const testData = {
    email: "test@example.com",
    name: "Test User"
  };

  try {
    console.log('\nTesting newsletter API...');
    console.log('Test data:', testData);
    
    const response = await fetch('http://localhost:3000/api/newsletter/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', result);
    
    if (response.ok) {
      console.log('✅ Newsletter API test successful!');
    } else {
      console.log('❌ Newsletter API test failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
};

// 运行测试
const runTests = async () => {
  console.log('🧪 Starting API tests...\n');
  await testContactAPI();
  await testNewsletterAPI();
  console.log('\n🏁 Tests completed!');
};

runTests();