import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

import { aiFeedManager } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const hub = searchParams.get('hub');
    const type = searchParams.get('type');
    const lang = searchParams.get('lang') || 'en';
    const format = searchParams.get('format') || 'json';

    // Generate LLM answers
    let answersData = await aiFeedManager.generateLLMAnswers();

    // Apply filters if provided
    if (hub) {
      answersData = answersData.filter(item => item.hub === hub);
    }

    if (type) {
      answersData = answersData.filter(item => item.type === type);
    }

    if (lang) {
      answersData = answersData.filter(item => item.lang === lang);
    }

    // Apply limit
    answersData = answersData.slice(0, limit);

    // Set response headers for GEO optimization
    const headers = new Headers();

    if (format === 'ndjson') {
      headers.set('Content-Type', 'application/x-ndjson');
    } else {
      headers.set('Content-Type', 'application/json');
    }

    headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400'); // 1 hour client, 24 hours CDN
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-Robots-Tag', 'index, follow');

    // Add custom headers for LLM crawlers
    headers.set('X-LLM-Feed-Version', '1.0');
    headers.set('X-LLM-Feed-Generated', new Date().toISOString());
    headers.set('X-LLM-Feed-Count', answersData.length.toString());
    headers.set('X-LLM-Feed-Format', format);

    // Return data in requested format
    if (format === 'ndjson') {
      const ndjson = answersData
        .map(item => JSON.stringify(item))
        .join('\n');

      return new NextResponse(ndjson, {
        status: 200,
        headers
      });
    } else {
      // JSON format with metadata
      const response = {
        version: '1.0',
        generated_at: new Date().toISOString(),
        total_count: answersData.length,
        filters: {
          hub: hub || 'all',
          type: type || 'all',
          lang: lang || 'all',
          limit
        },
        data: answersData
      };

      return NextResponse.json(response, {
        status: 200,
        headers
      });
    }

  } catch (error: any) {
    console.error('LLM Answers API error:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate LLM answers',
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
