import { NextRequest, NextResponse } from 'next/server';

import { FAQ_DATA } from '@/lib/faq-catalog';
import { knowledgeBase } from '@/lib/supabase';
import type { KnowledgeFAQ, KnowledgeLocale, KnowledgeSource } from '@/types/content';

export const dynamic = 'force-dynamic';

const SUPPORTED_LOCALES: Record<string, KnowledgeLocale> = {
  us: 'US',
  ca: 'CA',
  global: 'Global',
};

const MAX_LIMIT = 100;
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.momaiagent.com').replace(/\/$/, '');

function parseLocale(value: string | null): KnowledgeLocale | undefined {
  if (!value) return undefined;
  return SUPPORTED_LOCALES[value.toLowerCase()];
}

function matchesQuery(faq: KnowledgeFAQ, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  return faq.question.toLowerCase().includes(normalized) || faq.answer.toLowerCase().includes(normalized);
}

function serializeSource(source: KnowledgeSource) {
  return {
    id: source.id,
    name: source.name,
    organization: source.organization,
    url: source.url,
    grade: source.grade,
    retrieved_at: source.retrieved_at,
    notes: source.notes,
  };
}

function serializeFAQ(faq: KnowledgeFAQ, sources: KnowledgeSource[]) {
  return {
    id: faq.id,
    slug: faq.slug,
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    subcategory: faq.subcategory,
    locale: faq.locale,
    age_range: faq.age_range || [],
    source_layer: faq.source_layer || null,
    source_type: faq.source_kind || null,
    source_label: faq.source_label || null,
    source_url: faq.source_url || null,
    related_topic_slugs: faq.related_topic_slugs || [],
    related_food_ids: faq.related_food_ids || [],
    related_rule_ids: faq.related_rule_ids || [],
    related_guide_ids: faq.related_guide_ids || [],
    priority: faq.priority,
    last_reviewed_at: faq.last_reviewed_at,
    updated_at: faq.updated_at,
    sources: sources.map(serializeSource),
  };
}

function isMissingFAQTable(error: unknown) {
  return Boolean(
    error &&
      typeof error === 'object' &&
      'code' in error &&
      (error as { code?: string }).code === '42P01'
  );
}

function slugifyQuestion(question: string) {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function matchesStaticCategory(category: string | undefined, value: string) {
  if (!category) return true;
  return value.toLowerCase() === category.toLowerCase();
}

function serializeStaticFAQ(item: (typeof FAQ_DATA)[number], index: number) {
  const slug = slugifyQuestion(item.question);
  return {
    id: `static-faq-${index + 1}`,
    slug,
    question: item.question,
    answer: item.answer,
    category: item.category,
    subcategory: null,
    locale: 'Global',
    age_range: [],
    related_topic_slugs: [],
    related_food_ids: [],
    related_rule_ids: [],
    related_guide_ids: [],
    priority: index + 1,
    last_reviewed_at: null,
    updated_at: null,
    source_layer: item.sourceLayer,
    source_type: item.sourceKind,
    sources: [
      {
        id: `${slug}-source`,
        name: item.sourceLabel,
        organization: item.sourceKind === 'authority' ? item.sourceLabel.split(':')[0] : 'Mom AI Agent',
        url: item.sourceUrl.startsWith('http') ? item.sourceUrl : `${siteUrl}${item.sourceUrl}`,
        grade: item.sourceKind === 'authority' ? 'A' : null,
        retrieved_at: null,
        notes: null,
      },
    ],
  };
}

function staticFAQResponse(params: {
  slug?: string | null;
  category?: string;
  query: string;
  limit: number;
  locale?: KnowledgeLocale;
  topicSlug?: string;
  foodId?: string;
}) {
  const items = FAQ_DATA.filter((item) => matchesStaticCategory(params.category, item.category))
    .filter((item) => !params.query || item.question.toLowerCase().includes(params.query.toLowerCase()) || item.answer.toLowerCase().includes(params.query.toLowerCase()))
    .map(serializeStaticFAQ);

  if (params.slug) {
    const match = items.find((item) => item.slug === params.slug);
    if (!match) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }
    return NextResponse.json(
      { data: match, source: 'static-fallback', table_status: 'missing' },
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=1800, s-maxage=43200',
        },
      }
    );
  }

  const limited = items.slice(0, params.limit);
  return NextResponse.json(
    {
      count: limited.length,
      filters: {
        category: params.category || null,
        locale: params.locale || null,
        topic: params.topicSlug || null,
        foodId: params.foodId || null,
        query: params.query || null,
        limit: params.limit,
      },
      source: 'static-fallback',
      table_status: 'missing',
      data: limited,
    },
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=1800, s-maxage=43200',
      },
    }
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const category = searchParams.get('category') || undefined;
  const locale = parseLocale(searchParams.get('locale'));
  const topicSlug = searchParams.get('topic') || undefined;
  const foodId = searchParams.get('foodId') || undefined;
  const query = searchParams.get('query') || '';
  const rawLimit = Number.parseInt(searchParams.get('limit') || '50', 10);
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), MAX_LIMIT) : 50;

  if (searchParams.get('locale') && !locale) {
    return NextResponse.json(
      { error: 'Invalid locale. Use one of: US, CA, Global.' },
      { status: 400 }
    );
  }

  try {
    if (slug) {
      const faq = await knowledgeBase.getFAQBySlug(slug);

      if (!faq) {
        return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
      }

      const sourceIds = faq.source_ids || [];
      const sourceMap = await knowledgeBase.getSourcesMap(sourceIds);
      const sources = sourceIds
        .map((id) => sourceMap.get(id))
        .filter((item): item is KnowledgeSource => Boolean(item));

      return NextResponse.json(
        { data: serializeFAQ(faq, sources) },
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'public, max-age=1800, s-maxage=43200',
          },
        }
      );
    }

    const faqs = await knowledgeBase.getFAQs({
      category,
      locale,
      topicSlug,
      foodId,
    });

    const filteredFAQs = faqs.filter((faq) => matchesQuery(faq, query)).slice(0, limit);
    const sourceIds = Array.from(new Set(filteredFAQs.flatMap((faq) => faq.source_ids || [])));
    const sourceMap = await knowledgeBase.getSourcesMap(sourceIds);
    const filtered = filteredFAQs.map((faq) =>
      serializeFAQ(
        faq,
        (faq.source_ids || [])
          .map((id) => sourceMap.get(id))
          .filter((item): item is KnowledgeSource => Boolean(item))
      )
    );

    return NextResponse.json(
      {
        count: filtered.length,
        filters: {
          category: category || null,
          locale: locale || null,
          topic: topicSlug || null,
          foodId: foodId || null,
          query: query || null,
          limit,
        },
        source: 'supabase',
        table_status: 'present',
        data: filtered,
      },
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=1800, s-maxage=43200',
        },
      }
    );
  } catch (error) {
    if (isMissingFAQTable(error)) {
      return staticFAQResponse({ slug, category, query, limit, locale, topicSlug, foodId });
    }
    console.error('KB FAQs API error:', error);
    return NextResponse.json({ error: 'Failed to load knowledge base FAQs' }, { status: 500 });
  }
}
