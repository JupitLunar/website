import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

import { aiFeedManager } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'ndjson';
    const limit = parseInt(searchParams.get('limit') || '100');
    const hub = searchParams.get('hub');
    const type = searchParams.get('type');
    const lang = searchParams.get('lang') || 'en';

    // Generate AI feed
    let feedData = await aiFeedManager.generateAIFeed();

    // Apply filters if provided
    if (hub) {
      feedData = feedData.filter(item => item.hub === hub);
    }

    if (type) {
      feedData = feedData.filter(item => item.type === type);
    }

    if (lang) {
      feedData = feedData.filter(item => item.lang === lang);
    }

    // Apply limit
    feedData = feedData.slice(0, limit);

    // Set response headers for GEO optimization
    const headers = new Headers();
    headers.set('Content-Type', 'application/x-ndjson');
    headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400'); // 1 hour client, 24 hours CDN
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-Robots-Tag', 'index, follow');

    // Add custom headers for AI crawlers
    headers.set('X-AI-Feed-Version', '1.0');
    headers.set('X-AI-Feed-Generated', new Date().toISOString());
    headers.set('X-AI-Feed-Count', feedData.length.toString());

    // Convert to NDJSON format
    const ndjson = feedData
      .map(item => JSON.stringify(item))
      .join('\n');

    // Return NDJSON response
    return new NextResponse(ndjson, {
      status: 200,
      headers
    });

  } catch (error: any) {
    console.error('AI Feed API error:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate AI feed',
        message: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
