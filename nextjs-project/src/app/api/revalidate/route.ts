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
    
    // 重新验证指定的路径或使用默认路径
    if (revalidatePathValue) {
      revalidatePath(revalidatePathValue);
      revalidatedPaths.push(revalidatePathValue);
    } else {
      // 默认重新验证 insight 相关页面
      revalidatePath('/insight');
      revalidatePath('/insight', 'page');
      revalidatedPaths.push('/insight');
    }
    
    // 重新验证 sitemap
    revalidatePath('/sitemap.xml');
    revalidatedPaths.push('/sitemap.xml');
    
    // 如果指定了 tag，也重新验证 tag
    if (tag) {
      revalidateTag(tag);
      revalidatedTags.push(tag);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Revalidation successful',
      revalidated: {
        paths: revalidatedPaths,
        tags: revalidatedTags,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error: any) {
    console.error('❌ Revalidation API错误:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Revalidation error',
        message: error.message
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
