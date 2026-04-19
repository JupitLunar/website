import { NextRequest, NextResponse } from 'next/server';

import { kbJsonHeaders, parseKnowledgeLocale, scoreText, serializeKnowledgeInsight } from '@/lib/kb-api';
import { knowledgeBase } from '@/lib/supabase';
import type { ContentHub, ContentType, KnowledgeInsight } from '@/types/content';

export const dynamic = 'force-dynamic';

const MAX_LIMIT = 100;
const SUPPORTED_HUBS: ContentHub[] = ['feeding', 'sleep', 'mom-health', 'development', 'safety', 'recipes'];
const SUPPORTED_TYPES: ContentType[] = ['explainer', 'howto', 'research', 'faq', 'recipe', 'news'];

function parseHub(value: string | null): ContentHub | undefined {
  if (!value) return undefined;
  const lower = value.toLowerCase() as ContentHub;
  return SUPPORTED_HUBS.includes(lower) ? lower : undefined;
}

function parseType(value: string | null): ContentType | undefined {
  if (!value) return undefined;
  const lower = value.toLowerCase() as ContentType;
  return SUPPORTED_TYPES.includes(lower) ? lower : undefined;
}

function parseLimit(value: string | null) {
  if (!value) return 25;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return 25;
  return Math.min(Math.max(parsed, 1), MAX_LIMIT);
}

function scoreInsight(insight: KnowledgeInsight, query: string) {
  return scoreText(query, [
    { text: insight.title, weight: 7 },
    { text: insight.summary, weight: 4 },
    { text: insight.body_excerpt, weight: 2 },
    { text: insight.primary_sources.join(' '), weight: 2 },
    { text: insight.hub, weight: 1 },
    { text: insight.type, weight: 1 },
  ]);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = parseKnowledgeLocale(searchParams.get('locale'));
    const hub = parseHub(searchParams.get('hub'));
    const type = parseType(searchParams.get('type'));
    const slug = searchParams.get('slug');
    const query = (searchParams.get('query') || '').trim();
    const limit = parseLimit(searchParams.get('limit'));

    if (searchParams.get('locale') && !locale) {
      return NextResponse.json(
        { error: 'Invalid locale. Use one of: US, CA, Global.' },
        { status: 400 }
      );
    }

    if (searchParams.get('hub') && !hub) {
      return NextResponse.json(
        { error: `Invalid hub. Use one of: ${SUPPORTED_HUBS.join(', ')}.` },
        { status: 400 }
      );
    }

    if (searchParams.get('type') && !type) {
      return NextResponse.json(
        { error: `Invalid type. Use one of: ${SUPPORTED_TYPES.join(', ')}.` },
        { status: 400 }
      );
    }

    if (slug) {
      const insight = await knowledgeBase.getEvidenceInsightBySlug(slug);

      if (!insight) {
        return NextResponse.json({ error: 'Insight not found' }, { status: 404 });
      }

      return NextResponse.json(
        {
          data: serializeKnowledgeInsight(insight),
          meta: {
            surface: 'insights',
            public_read_only: true,
            citation_count: insight.citation_count,
            evidence_level: insight.evidence_level,
          },
        },
        { headers: kbJsonHeaders() }
      );
    }

    const insights = await knowledgeBase.getEvidenceInsights({ locale, hub, type });
    const matched = !query
      ? insights
      : insights
          .map((insight) => ({ insight, score: scoreInsight(insight, query) }))
          .filter((entry) => entry.score >= 3)
          .sort((a, b) => b.score - a.score)
          .map((entry) => entry.insight);
    const filtered = matched.slice(0, limit);

    return NextResponse.json(
      {
        count: matched.length,
        filters: {
          locale: locale || null,
          hub: hub || null,
          type: type || null,
          query: query || null,
          limit,
        },
        data: filtered.map(serializeKnowledgeInsight),
        meta: {
          surface: 'insights',
          public_read_only: true,
          source_model: 'articles-plus-citations-derived',
        },
      },
      { headers: kbJsonHeaders() }
    );
  } catch (error) {
    console.error('KB insights API error:', error);
    return NextResponse.json(
      { error: 'Failed to load evidence-qualified insights' },
      { status: 500 }
    );
  }
}
