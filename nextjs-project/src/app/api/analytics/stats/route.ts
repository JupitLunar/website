import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date') || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = searchParams.get('end_date') || new Date().toISOString();

    // Get total page views
    const { count: totalPageViews, error: pageViewsError } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'page_view')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (pageViewsError) {
      console.error('Error fetching page views:', pageViewsError);
    }

    // Get unique visitors
    const { data: uniqueVisitors, error: visitorsError } = await supabase
      .from('analytics_events')
      .select('user_id, session_id')
      .eq('event_type', 'page_view')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (visitorsError) {
      console.error('Error fetching unique visitors:', visitorsError);
    }

    const uniqueVisitorCount = new Set(
      uniqueVisitors?.map(v => v.user_id || v.session_id) || []
    ).size;

    // Get top pages
    const { data: topPages, error: topPagesError } = await supabase
      .from('analytics_events')
      .select('event_data')
      .eq('event_type', 'page_view')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (topPagesError) {
      console.error('Error fetching top pages:', topPagesError);
    }

    const pageViews = topPages?.reduce((acc: any, event) => {
      const page = event.event_data?.page || 'unknown';
      acc[page] = (acc[page] || 0) + 1;
      return acc;
    }, {}) || {};

    const topPagesList = Object.entries(pageViews)
      .map(([page, views]) => ({ page, views: views as number }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Get search queries
    const { data: searchEvents, error: searchError } = await supabase
      .from('analytics_events')
      .select('event_data')
      .eq('event_type', 'search')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (searchError) {
      console.error('Error fetching search events:', searchError);
    }

    const searchQueries = searchEvents?.reduce((acc: any, event) => {
      const query = event.event_data?.query || 'unknown';
      acc[query] = (acc[query] || 0) + 1;
      return acc;
    }, {}) || {};

    const topSearchQueries = Object.entries(searchQueries)
      .map(([query, count]) => ({ query, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Get newsletter subscriptions
    const { count: newsletterSubscriptions, error: newsletterError } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'newsletter_subscription')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (newsletterError) {
      console.error('Error fetching newsletter subscriptions:', newsletterError);
    }

    // Get article views
    const { data: articleViews, error: articleViewsError } = await supabase
      .from('analytics_events')
      .select('event_data')
      .eq('event_type', 'article_view')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (articleViewsError) {
      console.error('Error fetching article views:', articleViewsError);
    }

    const hubViews = articleViews?.reduce((acc: any, event) => {
      const hub = event.event_data?.content_hub || 'unknown';
      acc[hub] = (acc[hub] || 0) + 1;
      return acc;
    }, {}) || {};

    const topContentHubs = Object.entries(hubViews)
      .map(([hub, views]) => ({ hub, views: views as number }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Get performance metrics
    const { data: performanceEvents, error: performanceError } = await supabase
      .from('analytics_events')
      .select('event_data')
      .eq('event_type', 'performance_metric')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (performanceError) {
      console.error('Error fetching performance metrics:', performanceError);
    }

    const performanceMetrics = performanceEvents?.reduce((acc: any, event) => {
      const metric = event.event_data?.metric_name;
      const value = event.event_data?.metric_value;
      if (metric && value !== undefined) {
        if (!acc[metric]) {
          acc[metric] = [];
        }
        acc[metric].push(value);
      }
      return acc;
    }, {}) || {};

    // Calculate average performance metrics
    const avgPerformanceMetrics = Object.entries(performanceMetrics).reduce((acc: any, [metric, values]) => {
      const avgValue = (values as number[]).reduce((sum, val) => sum + val, 0) / (values as number[]).length;
      acc[metric] = Math.round(avgValue * 100) / 100;
      return acc;
    }, {});

    // Get error rate
    const { count: errorCount, error: errorCountError } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'error')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (errorCountError) {
      console.error('Error fetching error count:', errorCountError);
    }

    const errorRate = totalPageViews ? (errorCount || 0) / totalPageViews * 100 : 0;

    return NextResponse.json({
      period: {
        start_date: startDate,
        end_date: endDate
      },
      metrics: {
        page_views: totalPageViews || 0,
        unique_visitors: uniqueVisitorCount,
        newsletter_subscriptions: newsletterSubscriptions || 0,
        error_rate: Math.round(errorRate * 100) / 100
      },
      top_pages: topPagesList,
      top_content_hubs: topContentHubs,
      top_search_queries: topSearchQueries,
      performance_metrics: avgPerformanceMetrics,
      last_updated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Analytics stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}







