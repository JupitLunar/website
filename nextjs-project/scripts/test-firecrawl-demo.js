#!/usr/bin/env node

/**
 * Firecrawl演示脚本
 * 展示如何使用Firecrawl MCP工具抓取母婴内容
 */

console.log('🚀 Firecrawl MCP工具演示');
console.log('='.repeat(50));

/**
 * 演示Firecrawl工具调用
 */
function demonstrateFirecrawlCalls() {
  console.log('\n📋 Firecrawl MCP工具调用示例:');
  
  console.log('\n1. 🔍 网页搜索:');
  console.log('   mcp_firecrawl_firecrawl_search({');
  console.log('     query: "infant nutrition guidelines AAP",');
  console.log('     limit: 5,');
  console.log('     sources: [{ type: "web" }]');
  console.log('   })');
  
  console.log('\n2. 📄 页面抓取:');
  console.log('   mcp_firecrawl_firecrawl_scrape({');
  console.log('     url: "https://www.healthychildren.org/...",');
  console.log('     formats: ["markdown"],');
  console.log('     onlyMainContent: true');
  console.log('   })');
  
  console.log('\n3. 🗺️  网站映射:');
  console.log('   mcp_firecrawl_firecrawl_map({');
  console.log('     url: "https://www.nhs.uk",');
  console.log('     search: "baby feeding",');
  console.log('     limit: 50');
  console.log('   })');
  
  console.log('\n4. 🤖 AI提取:');
  console.log('   mcp_firecrawl_firecrawl_extract({');
  console.log('     urls: ["https://example.com/article"],');
  console.log('     prompt: "Extract medical advice and key points",');
  console.log('     schema: { ... }');
  console.log('   })');
}

/**
 * 展示实际使用场景
 */
function showUseCases() {
  console.log('\n🎯 实际使用场景:');
  
  console.log('\n场景1: 抓取AAP文章');
  console.log('  - 使用firecrawl_scrape抓取特定页面');
  console.log('  - 提取markdown格式内容');
  console.log('  - 保存到Supabase数据库');
  
  console.log('\n场景2: 搜索NHS内容');
  console.log('  - 使用firecrawl_search搜索相关主题');
  console.log('  - 过滤高质量结果');
  console.log('  - 批量抓取相关内容');
  
  console.log('\n场景3: 网站内容发现');
  console.log('  - 使用firecrawl_map发现新内容');
  console.log('  - 自动识别相关页面');
  console.log('  - 建立内容索引');
  
  console.log('\n场景4: AI内容分析');
  console.log('  - 使用firecrawl_extract提取结构化数据');
  console.log('  - 生成标准化格式');
  console.log('  - 质量评估和分类');
}

/**
 * 展示配置示例
 */
function showConfigurationExamples() {
  console.log('\n⚙️  配置示例:');
  
  console.log('\n搜索配置:');
  console.log(`
  const searchConfig = {
    query: "infant nutrition guidelines",
    limit: 10,
    sources: [{ type: "web" }],
    scrapeOptions: {
      formats: ["markdown"],
      onlyMainContent: true
    }
  };`);
  
  console.log('\n抓取配置:');
  console.log(`
  const scrapeConfig = {
    url: "https://www.healthychildren.org/...",
    formats: ["markdown", "html"],
    onlyMainContent: true,
    removeBase64Images: true,
    waitFor: 2000
  };`);
  
  console.log('\nAI提取配置:');
  console.log(`
  const extractConfig = {
    urls: ["https://example.com"],
    prompt: "Extract medical advice, age recommendations, and safety notes",
    schema: {
      type: "object",
      properties: {
        title: { type: "string" },
        summary: { type: "string" },
        medicalAdvice: { type: "string" },
        ageRange: { type: "string" },
        safetyNotes: { type: "string" }
      }
    }
  };`);
}

/**
 * 展示集成示例
 */
function showIntegrationExample() {
  console.log('\n🔗 与现有系统集成:');
  
  console.log('\n1. 替换现有爬虫:');
  console.log(`
  // 原来的cheerio+axios方式
  const $ = cheerio.load(html);
  const title = $('h1').text();
  const content = $('.article-content').text();
  
  // 新的Firecrawl方式
  const result = await mcp_firecrawl_firecrawl_scrape({
    url: url,
    formats: ["markdown"],
    onlyMainContent: true
  });
  const { title, content } = result;`);
  
  console.log('\n2. 数据库集成:');
  console.log(`
  // 保存Firecrawl结果到Supabase
  const { data, error } = await supabase
    .from('articles')
    .insert([{
      title: result.title,
      body_md: result.content,
      source: 'firecrawl',
      confidence_score: result.confidence,
      ai_extracted: true
    }]);`);
  
  console.log('\n3. 批量处理:');
  console.log(`
  // 批量抓取多个来源
  const sources = ['AAP', 'NHS', 'Health Canada'];
  const results = [];
  
  for (const source of sources) {
    const result = await mcp_firecrawl_firecrawl_scrape({
      url: source.url,
      formats: ["markdown"]
    });
    results.push(result);
  }`);
}

/**
 * 展示优势对比
 */
function showAdvantages() {
  console.log('\n🏆 Firecrawl vs 传统爬虫:');
  
  console.log('\n传统爬虫 (cheerio+axios):');
  console.log('  ❌ 需要手动维护CSS选择器');
  console.log('  ❌ 容易因网站改版失效');
  console.log('  ❌ 内容提取质量不稳定');
  console.log('  ❌ 无法处理动态内容');
  console.log('  ❌ 需要复杂的反爬虫处理');
  
  console.log('\nFirecrawl AI爬虫:');
  console.log('  ✅ AI自动识别主要内容');
  console.log('  ✅ 自适应网站结构变化');
  console.log('  ✅ 高质量内容提取');
  console.log('  ✅ 处理JavaScript渲染内容');
  console.log('  ✅ 内置反爬虫处理');
  console.log('  ✅ 结构化数据提取');
  console.log('  ✅ 多语言支持');
}

/**
 * 展示实际调用示例
 */
function showActualCalls() {
  console.log('\n📞 实际MCP调用示例:');
  
  console.log('\n// 搜索AAP相关内容');
  console.log(`
  const searchResults = await mcp_firecrawl_firecrawl_search({
    query: "infant nutrition guidelines AAP",
    limit: 5,
    sources: [{ type: "web" }]
  });
  
  console.log('找到', searchResults.length, '个结果');`);
  
  console.log('\n// 抓取特定页面');
  console.log(`
  const pageContent = await mcp_firecrawl_firecrawl_scrape({
    url: "https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Starting-Solid-Foods.aspx",
    formats: ["markdown"],
    onlyMainContent: true,
    removeBase64Images: true
  });
  
  console.log('页面标题:', pageContent.title);
  console.log('内容长度:', pageContent.content.length);`);
  
  console.log('\n// AI提取结构化数据');
  console.log(`
  const extractedData = await mcp_firecrawl_firecrawl_extract({
    urls: ["https://www.healthychildren.org/..."],
    prompt: "Extract medical advice, age recommendations, and safety guidelines",
    schema: {
      type: "object",
      properties: {
        title: { type: "string" },
        summary: { type: "string" },
        keyPoints: { type: "array", items: { type: "string" } },
        ageRange: { type: "string" },
        medicalAdvice: { type: "string" },
        safetyNotes: { type: "string" }
      }
    }
  });
  
  console.log('提取的数据:', extractedData);`);
}

/**
 * 主函数
 */
async function main() {
  try {
    demonstrateFirecrawlCalls();
    showUseCases();
    showConfigurationExamples();
    showIntegrationExample();
    showAdvantages();
    showActualCalls();
    
    console.log('\n🎯 总结:');
    console.log('Firecrawl MCP工具提供了强大的AI驱动内容抓取能力，');
    console.log('可以显著提升母婴内容爬虫的质量和效率。');
    console.log('建议逐步迁移到Firecrawl系统，享受AI带来的优势。');
    
    console.log('\n📚 下一步:');
    console.log('1. 获取Firecrawl API密钥');
    console.log('2. 配置MCP工具');
    console.log('3. 测试单个页面抓取');
    console.log('4. 批量处理权威来源');
    console.log('5. 集成到现有系统');
    
    console.log('\n✅ 演示完成');
    
  } catch (error) {
    console.error('❌ 演示过程中出现错误:', error);
  }
}

// 运行演示
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
