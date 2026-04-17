import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

import { createAdminClient, supabase } from '@/lib/supabase';
import { getClientIp, hashValue, requireApiSecret } from '@/lib/api-auth';
import { attachRateLimitHeaders, createRateLimitResponse, evaluateRateLimit } from '@/lib/rate-limit';

const PUBLIC_EVENT_TYPES = new Set([
  'page_view',
  'search',
  'article_view',
  'hub_view',
  'newsletter_subscription',
  'contact_form_submitted',
  'performance_metric',
  'error',
  'ai_bot_crawl',
  'ai_referral',
]);

const POST_RATE_LIMIT = {
  namespace: 'analytics-events-post',
  maxRequests: 60,
  windowMs: 60_000,
};

const MAX_EVENT_DATA_BYTES = 8_192;
const MAX_SESSION_ID_LENGTH = 128;
const MAX_USER_ID_LENGTH = 128;
const MAX_USER_AGENT_LENGTH = 512;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function POST(request: NextRequest) {
  try {
    const rateLimit = evaluateRateLimit(request, POST_RATE_LIMIT);
    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit, 'Analytics event rate limit exceeded. Please retry shortly.');
    }

    const { event_type, event_data, user_id, session_id } = await request.json();

    if (!event_type || typeof event_type !== 'string' || !PUBLIC_EVENT_TYPES.has(event_type)) {
      const response = NextResponse.json(
        { error: 'Unsupported event_type' },
        { status: 400 }
      );
      return attachRateLimitHeaders(response, rateLimit);
    }

    if (!isPlainObject(event_data)) {
      const response = NextResponse.json(
        { error: 'event_type and event_data are required' },
        { status: 400 }
      );
      return attachRateLimitHeaders(response, rateLimit);
    }

    const serializedEventData = JSON.stringify(event_data);
    if (serializedEventData.length > MAX_EVENT_DATA_BYTES) {
      const response = NextResponse.json(
        { error: 'event_data is too large' },
        { status: 400 }
      );
      return attachRateLimitHeaders(response, rateLimit);
    }

    if (user_id && (typeof user_id !== 'string' || user_id.length > MAX_USER_ID_LENGTH)) {
      const response = NextResponse.json(
        { error: 'user_id must be a short string when provided' },
        { status: 400 }
      );
      return attachRateLimitHeaders(response, rateLimit);
    }

    if (session_id && (typeof session_id !== 'string' || session_id.length > MAX_SESSION_ID_LENGTH)) {
      const response = NextResponse.json(
        { error: 'session_id must be a short string when provided' },
        { status: 400 }
      );
      return attachRateLimitHeaders(response, rateLimit);
    }

    const clientIp = getClientIp(request);
    const anonymizedIp = clientIp === 'unknown' ? 'unknown' : hashValue(clientIp);
    const userAgent = (request.headers.get('user-agent') || 'unknown').slice(0, MAX_USER_AGENT_LENGTH);

    const { data: event, error } = await supabase
      .from('analytics_events')
      .insert({
        event_type,
        event_data,
        user_id: user_id || null,
        session_id: session_id || null,
        ip_address: anonymizedIp,
        user_agent: userAgent,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting analytics event:', error);
      return NextResponse.json(
        { error: 'Failed to track event' },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      message: 'Event tracked successfully',
      event_id: event.id
    });
    return attachRateLimitHeaders(response, rateLimit);

  } catch (error) {
    console.error('Analytics event tracking error:', error);
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    return response;
  }
}

export async function GET(request: NextRequest) {
  try {
    const unauthorized = requireApiSecret(request, {
      secretNames: ['INTERNAL_API_SECRET', 'REVALIDATION_SECRET'],
      context: 'analytics events endpoint',
    });

    if (unauthorized) {
      return unauthorized;
    }

    const { searchParams } = new URL(request.url);
    const eventType = searchParams.get('event_type');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const limit = parseInt(searchParams.get('limit') || '100');

    const supabaseAdmin = createAdminClient();

    let query = supabaseAdmin
      .from('analytics_events')
      .select('id, event_type, event_data, created_at')
      .order('created_at', { ascending: false })
      .limit(Math.min(Math.max(limit, 1), 500));

    // Filter by event type
    if (eventType) {
      query = query.eq('event_type', eventType);
    }

    // Filter by date range
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data: events, error } = await query;

    if (error) {
      console.error('Error fetching analytics events:', error);
      return NextResponse.json(
        { error: 'Failed to fetch events' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      events,
      count: events.length
    });

  } catch (error) {
    console.error('Analytics events fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
















