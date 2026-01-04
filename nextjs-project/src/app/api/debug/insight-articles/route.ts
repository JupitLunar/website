/**
 * 调试端点：检查insight文章查询
 * 用于排查为什么文章没有显示
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    let supabaseHost: string | null = null;
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        supabaseHost = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host;
      }
    } catch {
      supabaseHost = null;
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. 检查所有已发布的文章
    const { data: allPublished, error: allError } = await supabase
      .from('articles')
      .select('id, slug, title, status, reviewed_by, created_at')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(10);

    // 2. 检查AI生成的文章（使用reviewed_by字段）
    const { data: aiArticles, error: aiError } = await supabase
      .from('articles')
      .select('id, slug, title, status, reviewed_by, article_source, created_at')
      .eq('status', 'published')
      .eq('reviewed_by', 'AI Content Generator')
      .order('created_at', { ascending: false })
      .limit(50);

    // 3. 检查最新文章的reviewed_by字段值
    const { data: recentArticles, error: recentError } = await supabase
      .from('articles')
      .select('slug, title, reviewed_by, status, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    // 4. 模拟insight页面的查询
    const { data: insightArticles, error: insightError } = await supabase
      .from('articles')
      .select('id, slug, title, created_at')
      .eq('reviewed_by', 'AI Content Generator')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(50);

    return NextResponse.json({
      success: true,
      runtime: {
        now: new Date().toISOString(),
        supabaseHost
      },
      debug: {
        allPublished: {
          count: allPublished?.length || 0,
          error: allError?.message,
          articles: allPublished?.slice(0, 5).map(a => ({
            title: a.title,
            slug: a.slug,
            reviewed_by: a.reviewed_by,
            created_at: a.created_at
          }))
        },
        aiArticles: {
          count: aiArticles?.length || 0,
          error: aiError?.message,
          articles: aiArticles?.slice(0, 5).map(a => ({
            title: a.title,
            slug: a.slug,
            reviewed_by: a.reviewed_by,
            article_source: a.article_source,
            created_at: a.created_at
          }))
        },
        recentArticles: {
          count: recentArticles?.length || 0,
          error: recentError?.message,
          articles: recentArticles?.map(a => ({
            title: a.title,
            slug: a.slug,
            reviewed_by: a.reviewed_by,
            status: a.status,
            created_at: a.created_at
          }))
        },
        insightQuery: {
          count: insightArticles?.length || 0,
          error: insightError?.message,
          articles: insightArticles?.slice(0, 10).map(a => ({
            title: a.title,
            slug: a.slug,
            created_at: a.created_at
          }))
        }
      },
      query: {
        reviewed_by: 'AI Content Generator',
        status: 'published'
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
