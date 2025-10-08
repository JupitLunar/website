import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * 爬虫状态查询API
 * 查看最近的爬取结果和统计信息
 */

function validateApiKey(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const apiKey = process.env.SCRAPER_API_KEY;
  
  if (!apiKey) return false;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  
  const token = authHeader.substring(7);
  return token === apiKey;
}

export async function GET(request: NextRequest) {
  try {
    // 验证API密钥
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 获取最近24小时内创建的文章
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const { data: recentArticles, error: articlesError } = await supabase
      .from('articles')
      .select('id, title, slug, hub, created_at, reviewed_by')
      .eq('reviewed_by', 'Web Scraper Bot')
      .gte('created_at', oneDayAgo)
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (articlesError) throw articlesError;
    
    // 获取来源统计
    const { data: sources, error: sourcesError } = await supabase
      .from('kb_sources')
      .select('id, name, organization, grade, retrieved_at');
    
    if (sourcesError) throw sourcesError;
    
    // 统计信息
    const { count: totalArticles } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('reviewed_by', 'Web Scraper Bot');
    
    return NextResponse.json({
      success: true,
      data: {
        recentArticles: recentArticles || [],
        recentCount: recentArticles?.length || 0,
        totalScrapedArticles: totalArticles || 0,
        sources: sources || [],
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error: any) {
    console.error('❌ 状态查询错误:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Status query error',
        message: error.message
      },
      { status: 500 }
    );
  }
}

