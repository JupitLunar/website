import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { event_type, event_data, user_id, session_id } = await request.json();

    // Validate required fields
    if (!event_type || !event_data) {
      return NextResponse.json(
        { error: 'event_type and event_data are required' },
        { status: 400 }
      );
    }

    // Insert event into analytics_events table
    const { data: event, error } = await supabase
      .from('analytics_events')
      .insert({
        event_type,
        event_data,
        user_id: user_id || null,
        session_id: session_id || null,
        ip_address: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown',
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

    return NextResponse.json({
      message: 'Event tracked successfully',
      event_id: event.id
    });

  } catch (error) {
    console.error('Analytics event tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventType = searchParams.get('event_type');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const limit = parseInt(searchParams.get('limit') || '100');

    let query = supabase
      .from('analytics_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

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














