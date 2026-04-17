import { NextRequest, NextResponse } from 'next/server';

import { getTopicCatalogItem, TOPIC_CATALOG } from '@/lib/topic-catalog';

export const dynamic = 'force-dynamic';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.momaiagent.com').replace(/\/$/, '');

function serializeTopic(topic: (typeof TOPIC_CATALOG)[number]) {
  return {
    slug: topic.slug,
    title: topic.title,
    focus: topic.focus,
    summary: topic.blurb,
    url: `${siteUrl}${topic.href}`,
    paths: {
      topic: `${siteUrl}${topic.href}`,
      search: `${siteUrl}/search?q=${encodeURIComponent(topic.title)}`,
      faq: `${siteUrl}/faq`,
      trust: `${siteUrl}/trust`,
    },
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (slug) {
    const topic = getTopicCatalogItem(slug);

    if (!topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        data: serializeTopic(topic),
      },
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=1800, s-maxage=43200',
        },
      }
    );
  }

  return NextResponse.json(
    {
      count: TOPIC_CATALOG.length,
      data: TOPIC_CATALOG.map(serializeTopic),
    },
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=1800, s-maxage=43200',
      },
    }
  );
}
