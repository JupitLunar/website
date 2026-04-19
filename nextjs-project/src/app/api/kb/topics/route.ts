import { NextRequest, NextResponse } from 'next/server';

import { buildFoodUrl, buildSearchUrl, buildTopicUrl, kbJsonHeaders, KB_SITE_URL } from '@/lib/kb-api';
import { getTopicCatalogItem, TOPIC_CATALOG } from '@/lib/topic-catalog';

export const dynamic = 'force-dynamic';

function serializeTopic(topic: (typeof TOPIC_CATALOG)[number]) {
  return {
    slug: topic.slug,
    title: topic.title,
    focus: topic.focus,
    summary: topic.blurb,
    url: `${KB_SITE_URL}${topic.href}`,
    paths: {
      topic: buildTopicUrl(topic.slug),
      search: buildSearchUrl(topic.title),
      faq: `${KB_SITE_URL}/faq`,
      trust: `${KB_SITE_URL}/trust`,
      foods: `${KB_SITE_URL}/foods`,
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
        meta: {
          surface: 'topics',
          public_read_only: true,
        },
      },
      { headers: kbJsonHeaders() }
    );
  }

  return NextResponse.json(
    {
      count: TOPIC_CATALOG.length,
      data: TOPIC_CATALOG.map(serializeTopic),
      meta: {
        surface: 'topics',
        public_read_only: true,
      },
    },
    { headers: kbJsonHeaders() }
  );
}
