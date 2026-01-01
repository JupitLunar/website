import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * Revalidation API
 * 用于触发页面重新验证，使新生成的文章立即可见
 * 
 * 使用方法:
 * POST /api/revalidate
 * Headers:
 *   Authorization: Bearer YOUR_REVALIDATION_SECRET
 * Body (optional):
 *   {
 *     "path": "/insight",  // 可选：指定要重新验证的路径
 *     "tag": "insights"    // 可选：指定要重新验证的 tag
 *   }
 */

function validateRequest(request: NextRequest): boolean {
  // 检查是否设置了 REVALIDATION_SECRET
  const authHeader = request.headers.get('authorization');
  if (process.env.REVALIDATION_SECRET && authHeader) {
    if (authHeader === `Bearer ${process.env.REVALIDATION_SECRET}`) {
      return true;
    }
  }
  
  // 开发环境允许无认证
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  
  return false;
}

export async function POST(request: NextRequest) {
  try {
    // 验证请求
    if (!validateRequest(request)) {
      console.error('❌ Revalidation API: Unauthorized request');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unauthorized',
          message: 'Invalid or missing revalidation secret'
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
    
    const { path: revalidatePathValue, tag } = body;
    
    const revalidatedPaths: string[] = [];
    const revalidatedTags: string[] = [];
    
    console.log(`🔄 Revalidation API called: path=${revalidatePathValue || '/insight'}, tag=${tag || 'none'}`);
    
    // 重新验证指定的路径或使用默认路径
    const pathToRevalidate = revalidatePathValue || '/insight';
    
    try {
      // 在 App Router 中，revalidatePath 需要明确指定类型
      // 对于页面路由，使用 'page' 类型
      revalidatePath(pathToRevalidate, 'page');
      console.log(`✅ Revalidated path (page): ${pathToRevalidate}`);
      revalidatedPaths.push(pathToRevalidate);
      
      // 对于布局，使用 'layout' 类型（如果需要）
      // 注意：对于 /insight 这样的页面，可能不需要 layout revalidation
      if (pathToRevalidate === '/insight') {
        // 只 revalidate page，不 revalidate layout（避免不必要的重新生成）
        // revalidatePath(pathToRevalidate, 'layout');
      }
      
      // 重新验证 sitemap
      revalidatePath('/sitemap.xml', 'page');
      console.log(`✅ Revalidated path: /sitemap.xml`);
      revalidatedPaths.push('/sitemap.xml');
      
      // 如果指定了 tag，也重新验证 tag
      if (tag) {
        revalidateTag(tag);
        console.log(`✅ Revalidated tag: ${tag}`);
        revalidatedTags.push(tag);
      }
      
      console.log(`✅ Revalidation completed successfully`);
      
      return NextResponse.json({
        success: true,
        message: 'Revalidation successful',
        revalidated: {
          paths: revalidatedPaths,
          tags: revalidatedTags,
          timestamp: new Date().toISOString()
        }
      });
      
    } catch (revalidateError: any) {
      console.error('❌ Revalidation error:', revalidateError);
      throw revalidateError;
    }
    
  } catch (error: any) {
    console.error('❌ Revalidation API错误:', error);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Revalidation error',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// GET请求 - 获取 revalidation 状态
export async function GET(request: NextRequest) {
  try {
    // 验证请求
    if (!validateRequest(request)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unauthorized',
          message: 'Invalid or missing revalidation secret'
        },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Revalidation API is ready',
      data: {
        status: 'ready',
        endpoint: '/api/revalidate',
        method: 'POST',
        authentication: 'Bearer token (REVALIDATION_SECRET)',
        version: '1.0',
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
