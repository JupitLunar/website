import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

import { knowledgeBase } from '@/lib/supabase';
import type {
  KnowledgeGuide,
  KnowledgeLocale,
  KnowledgeRule,
  KnowledgeSource,
  KnowledgeFood,
} from '@/types/content';

const SUPPORTED_LOCALES: Record<string, KnowledgeLocale> = {
  us: 'US',
  ca: 'CA',
  global: 'Global',
};

const SUPPORTED_TYPES = ['rules', 'foods', 'guides'] as const;
type FeedType = (typeof SUPPORTED_TYPES)[number];

type FeedItem =
  | ({ kind: 'rule' } & KnowledgeRule & { sources: KnowledgeSource[] })
  | ({ kind: 'food' } & KnowledgeFood & { sources: KnowledgeSource[] })
  | ({ kind: 'guide' } & KnowledgeGuide & { sources: KnowledgeSource[] });

function parseLocale(value: string | null): KnowledgeLocale | undefined {
  if (!value) return undefined;
  const key = value.toLowerCase();
  return SUPPORTED_LOCALES[key];
}

function parseTypes(value: string | null): FeedType[] | undefined {
  if (!value) return undefined;
  const parts = value
    .split(',')
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
  const valid = parts.filter((part): part is FeedType =>
    SUPPORTED_TYPES.includes(part as FeedType)
  );
  return valid.length > 0 ? valid : undefined;
}

function toSerializableSource(source: KnowledgeSource) {
  return {
    id: source.id,
    name: source.name,
    organization: source.organization,
    url: source.url,
    grade: source.grade,
    retrieved_at: source.retrieved_at,
    notes: source.notes,
    created_at: source.created_at,
    updated_at: source.updated_at,
  };
}

function normaliseFeedItem(item: FeedItem) {
  const base = {
    kind: item.kind,
    slug: item.slug,
    title: 'title' in item ? item.title : item.name,
    locale: item.locale,
    status: item.status,
    reviewed_by: item.reviewed_by,
    last_reviewed_at: item.last_reviewed_at,
    expires_at: item.expires_at,
    created_at: item.created_at,
    updated_at: item.updated_at,
    sources: item.sources.map(toSerializableSource),
  };

  if (item.kind === 'rule') {
    return {
      ...base,
      type: 'kb_rule',
      summary: item.summary,
      category: item.category,
      risk_level: item.risk_level,
      do_list: item.do_list,
      dont_list: item.dont_list,
      why: item.why,
      how_to: item.how_to,
      compliance_notes: item.compliance_notes,
    };
  }

  if (item.kind === 'food') {
    return {
      ...base,
      type: 'kb_food',
      name: item.name,
      age_range: item.age_range,
      feeding_methods: item.feeding_methods,
      serving_forms: item.serving_forms,
      risk_level: item.risk_level,
      nutrients_focus: item.nutrients_focus,
      do_list: item.do_list,
      dont_list: item.dont_list,
      why: item.why,
      how_to: item.how_to,
      portion_hint: item.portion_hint,
      media: item.media,
    };
  }

  return {
    ...base,
    type: 'kb_guide',
    summary: item.summary,
    body_md: item.body_md,
    guide_type: item.guide_type,
    age_range: item.age_range,
    checklist: item.checklist,
    related_food_ids: item.related_food_ids,
    related_rule_ids: item.related_rule_ids,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = parseLocale(searchParams.get('locale'));
    const types = parseTypes(searchParams.get('type'));
    const format = searchParams.get('format')?.toLowerCase() || 'ndjson';
    const limit = parseInt(searchParams.get('limit') || '250', 10);

    if (searchParams.get('locale') && !locale) {
      return NextResponse.json(
        { error: 'Invalid locale. Use one of: US, CA, Global.' },
        { status: 400 }
      );
    }

    if (searchParams.get('type') && !types) {
      return NextResponse.json(
        { error: 'Invalid type. Use comma-separated values of rules, foods, guides.' },
        { status: 400 }
      );
    }

    if (!Number.isFinite(limit) || limit <= 0) {
      return NextResponse.json(
        { error: 'Invalid limit. Provide a positive integer.' },
        { status: 400 }
      );
    }

    const shouldInclude = (kind: FeedType) => !types || types.includes(kind);

    const [rules, foods, guides] = await Promise.all([
      shouldInclude('rules') ? knowledgeBase.getRules(locale) : Promise.resolve([]),
      shouldInclude('foods') ? knowledgeBase.getFoods(locale) : Promise.resolve([]),
      shouldInclude('guides')
        ? knowledgeBase.getGuides({ locale })
        : Promise.resolve([]),
    ]);

    const sourceIds = new Set<string>();
    rules.forEach((item) => item.source_ids?.forEach((id) => sourceIds.add(id)));
    foods.forEach((item) => item.source_ids?.forEach((id) => sourceIds.add(id)));
    guides.forEach((item) => item.source_ids?.forEach((id) => sourceIds.add(id)));

    const sourcesMap = await knowledgeBase.getSourcesMap(Array.from(sourceIds));

    const feedItems: FeedItem[] = [];

    rules.forEach((rule) => {
      feedItems.push({
        kind: 'rule',
        ...rule,
        sources: (rule.source_ids || [])
          .map((id) => sourcesMap.get(id))
          .filter((src): src is KnowledgeSource => Boolean(src)),
      });
    });

    foods.forEach((food) => {
      feedItems.push({
        kind: 'food',
        ...food,
        sources: (food.source_ids || [])
          .map((id) => sourcesMap.get(id))
          .filter((src): src is KnowledgeSource => Boolean(src)),
      });
    });

    guides.forEach((guide) => {
      feedItems.push({
        kind: 'guide',
        ...guide,
        sources: (guide.source_ids || [])
          .map((id) => sourcesMap.get(id))
          .filter((src): src is KnowledgeSource => Boolean(src)),
      });
    });

    feedItems.sort((a, b) => {
      const dateA = a.updated_at || a.created_at;
      const dateB = b.updated_at || b.created_at;
      return dateA > dateB ? -1 : dateA < dateB ? 1 : 0;
    });

    const limitedItems = feedItems.slice(0, limit).map(normaliseFeedItem);

    if (format === 'json') {
      return NextResponse.json({
        generated_at: new Date().toISOString(),
        count: limitedItems.length,
        data: limitedItems,
      }, {
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      });
    }

    const headers = new Headers();
    headers.set('Content-Type', 'application/x-ndjson; charset=utf-8');
    headers.set('Cache-Control', 'public, max-age=1800, s-maxage=43200');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-AI-KB-Feed-Version', '1.0');
    headers.set('X-AI-KB-Generated', new Date().toISOString());
    headers.set('X-AI-KB-Count', limitedItems.length.toString());

    const ndjson = limitedItems.map((item) => JSON.stringify(item)).join('\n');

    return new NextResponse(ndjson, { status: 200, headers });
  } catch (error) {
    console.error('Knowledge base feed error:', error);
    return NextResponse.json(
      { error: 'Failed to generate knowledge base feed' },
      { status: 500 }
    );
  }
}
