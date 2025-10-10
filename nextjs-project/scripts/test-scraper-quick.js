#!/usr/bin/env node

/**
 * 快速测试 Global Auto Scraper
 * 只抓取少量文章用于测试
 */

const { main } = require('./global-auto-scraper');

console.log('🧪 快速测试模式');
console.log('将只抓取少量文章进行测试\n');

// 临时修改配置（只用于测试）
process.env.TEST_MODE = 'true';

main().catch(error => {
  console.error('\n❌ 测试失败:', error.message);
  process.exit(1);
});
