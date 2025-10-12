import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

/**
 * Web Scraper API
 * 用于cron job定期执行爬虫任务
 * 
 * 使用方法:
 * POST /api/scraper/run
 * Headers:
 *   Authorization: Bearer YOUR_API_KEY
 *   Content-Type: application/json
 * Body (optional):
 *   {
 *     "sources": ["CDC", "AAP"],  // 可选：指定要爬取的来源
 *     "testMode": false            // 可选：测试模式
 *   }
 */

// 验证API密钥或Vercel Cron
function validateRequest(request: NextRequest): boolean {
  // 检查是否是Vercel Cron请求
  const cronSecret = request.headers.get('authorization');
  if (cronSecret === `Bearer ${process.env.CRON_SECRET}`) {
    return true;
  }
  
  // 检查是否是手动API调用
  const authHeader = request.headers.get('authorization');
  const apiKey = process.env.SCRAPER_API_KEY;
  
  if (apiKey && authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (token === apiKey) {
      return true;
    }
  }
  
  return false;
}

export async function POST(request: NextRequest) {
  try {
    // 验证请求（API key或Cron secret）
    if (!validateRequest(request)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unauthorized',
          message: 'Invalid or missing API key or Cron secret'
        },
        { status: 401 }
      );
    }
    
    // 解析请求体
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // 如果没有body，使用默认值
    }
    
    const { sources, testMode = false } = body;
    
    console.log('🚀 启动爬虫任务');
    console.log(`   测试模式: ${testMode ? '是' : '否'}`);
    if (sources) {
      console.log(`   指定来源: ${sources.join(', ')}`);
    }
    
    // 动态导入全球自动爬虫脚本
    const scraperPath = path.resolve(process.cwd(), 'scripts/global-auto-scraper.js');
    const scraperModule = await import(scraperPath);
    const { main } = scraperModule;
    
    // 执行爬虫
    const results = await main();
    
    // 返回结果
    return NextResponse.json({
      success: true,
      message: 'Scraping completed',
      data: {
        total: results.total,
        successful: results.successful,
        failed: results.failed,
        skipped: results.skipped,
        articles: results.articles,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error: any) {
    console.error('❌ 爬虫API错误:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Scraper error',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// GET请求 - 获取爬虫状态和配置
export async function GET(request: NextRequest) {
  try {
    // 验证请求（API key或Cron secret）
    if (!validateRequest(request)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unauthorized',
          message: 'Invalid or missing API key or Cron secret'
        },
        { status: 401 }
      );
    }
    
    // 加载配置
    const configPath = path.resolve(process.cwd(), 'scripts/scraper-config.js');
    const configModule = await import(configPath);
    const { SOURCES } = configModule;
    
    // 统计信息
    const sourceList = Object.keys(SOURCES).map(key => ({
      key,
      name: SOURCES[key].name,
      organization: SOURCES[key].organization,
      grade: SOURCES[key].grade,
      pageCount: SOURCES[key].targetPages.length
    }));
    
    const totalPages = sourceList.reduce((sum, source) => sum + source.pageCount, 0);
    
    return NextResponse.json({
      success: true,
      message: 'Scraper configuration',
      data: {
        sources: sourceList,
        totalSources: sourceList.length,
        totalPages,
        status: 'ready'
      }
    });
    
  } catch (error: any) {
    console.error('❌ 获取配置错误:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Configuration error',
        message: error.message
      },
      { status: 500 }
    );
  }
}

