import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

import {
  kbJsonHeaders,
  parseKnowledgeLocale,
  serializeKnowledgeGuide,
  uniqueStrings,
} from '@/lib/kb-api';
import { knowledgeBase } from '@/lib/supabase';
import type { KnowledgeGuide, KnowledgeSource } from '@/types/content';

const GUIDE_TYPES: KnowledgeGuide['guide_type'][] = [
  'framework',
  'scenario',
  'nutrition',
  'allergen',
  'pathway',
  'other',
];

function parseGuideType(value: string | null): KnowledgeGuide['guide_type'] | undefined {
  if (!value) return undefined;
  const lower = value.toLowerCase() as KnowledgeGuide['guide_type'];
  return GUIDE_TYPES.includes(lower) ? lower : undefined;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = parseKnowledgeLocale(searchParams.get('locale'));
    const guideType = parseGuideType(searchParams.get('type'));
    const slug = searchParams.get('slug');

    if (searchParams.get('locale') && !locale) {
      return NextResponse.json(
        { error: 'Invalid locale. Use one of: US, CA, Global.' },
        { status: 400 }
      );
    }

    if (searchParams.get('type') && !guideType) {
      return NextResponse.json(
        { error: 'Invalid guide type. Use one of: framework, scenario, nutrition, allergen, pathway, other.' },
        { status: 400 }
      );
    }

    if (slug) {
      const guide = await knowledgeBase.getGuideBySlug(slug);
      if (!guide) {
        return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
      }

      const sourceMap = await knowledgeBase.getSourcesMap(guide.source_ids || []);
      const sources = (guide.source_ids || [])
        .map((id) => sourceMap.get(id))
        .filter((item): item is KnowledgeSource => Boolean(item));

      return NextResponse.json(
        {
          data: serializeKnowledgeGuide(guide, sources),
          meta: {
            surface: 'guides',
            locale: locale || guide.locale,
            guide_type: guide.guide_type,
            source_count: sources.length,
          },
        },
        { headers: kbJsonHeaders() }
      );
    }

    const guides = await knowledgeBase.getGuides({ locale, guideType });
    const sourceIds = uniqueStrings(guides.flatMap((item) => item.source_ids || []));
    const sourceMap = await knowledgeBase.getSourcesMap(sourceIds);

    return NextResponse.json(
      {
        count: guides.length,
        filters: {
          locale: locale || null,
          type: guideType || null,
        },
        data: guides.map((guide) =>
          serializeKnowledgeGuide(
            guide,
            (guide.source_ids || [])
              .map((id) => sourceMap.get(id))
              .filter((item): item is KnowledgeSource => Boolean(item))
          )
        ),
        meta: {
          surface: 'guides',
          public_read_only: true,
        },
      },
      { headers: kbJsonHeaders() }
    );
  } catch (error) {
    console.error('KB guides API error:', error);
    return NextResponse.json(
      { error: 'Failed to load knowledge base guides' },
      { status: 500 }
    );
  }
}
