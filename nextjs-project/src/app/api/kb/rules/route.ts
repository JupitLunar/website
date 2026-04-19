import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

import {
  kbJsonHeaders,
  parseKnowledgeLocale,
  serializeKnowledgeRule,
  uniqueStrings,
} from '@/lib/kb-api';
import { knowledgeBase } from '@/lib/supabase';
import type { KnowledgeSource } from '@/types/content';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = parseKnowledgeLocale(searchParams.get('locale'));
    const slug = searchParams.get('slug');

    if (searchParams.get('locale') && !locale) {
      return NextResponse.json(
        { error: 'Invalid locale. Use one of: US, CA, Global.' },
        { status: 400 }
      );
    }

    if (slug) {
      const rule = await knowledgeBase.getRuleBySlug(slug);
      if (!rule) {
        return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
      }

      const sourceMap = await knowledgeBase.getSourcesMap(rule.source_ids || []);
      const sources = (rule.source_ids || [])
        .map((id) => sourceMap.get(id))
        .filter((item): item is KnowledgeSource => Boolean(item));

      return NextResponse.json(
        {
          data: serializeKnowledgeRule(rule, sources),
          meta: {
            surface: 'rules',
            locale: locale || rule.locale,
            source_count: sources.length,
          },
        },
        { headers: kbJsonHeaders() }
      );
    }

    const data = await knowledgeBase.getRules(locale);
    const sourceIds = uniqueStrings(data.flatMap((item) => item.source_ids || []));
    const sourceMap = await knowledgeBase.getSourcesMap(sourceIds);

    return NextResponse.json(
      {
        count: data.length,
        filters: {
          locale: locale || null,
        },
        data: data.map((rule) =>
          serializeKnowledgeRule(
            rule,
            (rule.source_ids || [])
              .map((id) => sourceMap.get(id))
              .filter((item): item is KnowledgeSource => Boolean(item))
          )
        ),
        meta: {
          surface: 'rules',
          public_read_only: true,
        },
      },
      { headers: kbJsonHeaders() }
    );
  } catch (error) {
    console.error('KB rules API error:', error);
    return NextResponse.json(
      { error: 'Failed to load knowledge base rules' },
      { status: 500 }
    );
  }
}
