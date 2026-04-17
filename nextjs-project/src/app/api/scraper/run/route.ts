import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { requireApiSecret } from '@/lib/api-auth';

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

export async function POST(request: NextRequest) {
  try {
    const unauthorized = requireApiSecret(request, {
      secretNames: ['CRON_SECRET', 'SCRAPER_API_KEY'],
      context: 'scraper run endpoint',
    });

    if (unauthorized) {
      return unauthorized;
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
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const scraperModule = await import(/* webpackIgnore: true */ scraperPath);
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
    const unauthorized = requireApiSecret(request, {
      secretNames: ['CRON_SECRET', 'SCRAPER_API_KEY'],
      context: 'scraper run endpoint',
    });

    if (unauthorized) {
      return unauthorized;
    }
    
    // 简单返回状态信息（不需要加载配置文件）
    return NextResponse.json({
      success: true,
      message: 'Cron scraper API is ready',
      data: {
        status: 'ready',
        endpoint: '/api/scraper/run',
        method: 'POST',
        schedule: '0 12 * * * (Daily at 12:00 UTC / 20:00 Beijing Time)',
        authentication: 'Bearer token (CRON_SECRET or SCRAPER_API_KEY)',
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error: any) {
    console.error('❌ 获取状态错误:', error);
    
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
