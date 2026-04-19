import type {
  KnowledgeFAQ,
  KnowledgeFood,
  KnowledgeGuide,
  KnowledgeInsight,
  KnowledgeLocale,
  KnowledgeRule,
  KnowledgeSource,
} from '@/types/content';
import { isInsightArticleReviewer, truncateText } from '@/lib/content-surface';

export const KB_SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.momaiagent.com').replace(/\/$/, '');

export const SUPPORTED_KB_LOCALES: Record<string, KnowledgeLocale> = {
  us: 'US',
  ca: 'CA',
  global: 'Global',
};

export function parseKnowledgeLocale(value: string | null): KnowledgeLocale | undefined {
  if (!value) return undefined;
  return SUPPORTED_KB_LOCALES[value.toLowerCase()];
}

export function kbJsonHeaders() {
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'public, max-age=1800, s-maxage=43200',
  };
}

export function serializeKnowledgeSource(source: KnowledgeSource) {
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

export function normaliseUrl(url: string) {
  return url.startsWith('http') ? url : `${KB_SITE_URL}${url}`;
}

export function buildSearchUrl(query: string) {
  return `${KB_SITE_URL}/search?q=${encodeURIComponent(query)}`;
}

export function buildTopicUrl(slug: string) {
  return `${KB_SITE_URL}/topics/${slug}`;
}

export function buildFoodUrl(slug: string) {
  return `${KB_SITE_URL}/foods/${slug}`;
}

export function buildArticleUrl(slug: string, reviewedBy?: string | null) {
  return isInsightArticleReviewer(reviewedBy) ? `${KB_SITE_URL}/insight/${slug}` : `${KB_SITE_URL}/${slug}`;
}

export function serializeKnowledgeRule(rule: KnowledgeRule, sources: KnowledgeSource[]) {
  return {
    ...rule,
    sources: sources.map(serializeKnowledgeSource),
    read_more_url: buildSearchUrl(rule.title),
  };
}

export function serializeKnowledgeFood(food: KnowledgeFood, sources: KnowledgeSource[]) {
  return {
    ...food,
    sources: sources.map(serializeKnowledgeSource),
    read_more_url: buildFoodUrl(food.slug),
  };
}

export function serializeKnowledgeGuide(guide: KnowledgeGuide, sources: KnowledgeSource[]) {
  return {
    ...guide,
    sources: sources.map(serializeKnowledgeSource),
    read_more_url: buildSearchUrl(guide.title),
  };
}

export function serializeKnowledgeFAQ(faq: KnowledgeFAQ, sources: KnowledgeSource[]) {
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
    source_url: faq.source_url ? normaliseUrl(faq.source_url) : null,
    related_topic_slugs: faq.related_topic_slugs || [],
    related_food_ids: faq.related_food_ids || [],
    related_rule_ids: faq.related_rule_ids || [],
    related_guide_ids: faq.related_guide_ids || [],
    priority: faq.priority,
    last_reviewed_at: faq.last_reviewed_at,
    updated_at: faq.updated_at,
    read_more_url: faq.source_url ? normaliseUrl(faq.source_url) : `${KB_SITE_URL}/faq`,
    sources: sources.map(serializeKnowledgeSource),
  };
}

export function serializeKnowledgeInsight(insight: KnowledgeInsight) {
  return {
    ...insight,
    summary: insight.summary || null,
    body_excerpt: insight.body_excerpt ? truncateText(insight.body_excerpt, 320) : null,
    source_label: insight.primary_sources[0] || null,
    source_url: insight.citations[0]?.url || null,
    read_more_url: buildArticleUrl(insight.slug, insight.reviewed_by),
  };
}

export function tokenizeQuery(query: string) {
  const stopWords = new Set([
    'a',
    'an',
    'the',
    'and',
    'or',
    'to',
    'of',
    'for',
    'in',
    'on',
    'at',
    'by',
    'with',
    'is',
    'are',
    'was',
    'were',
    'be',
    'can',
    'do',
    'does',
    'did',
    'how',
    'what',
    'when',
    'why',
    'where',
    'should',
    'could',
    'would',
    'my',
    'our',
    'your',
    'baby',
    'babies',
    'infant',
    'infants',
    'newborn',
    'newborns',
  ]);

  return Array.from(
    new Set(
      query
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .map((token) => token.trim())
        .filter((token) => token.length >= 2 && !stopWords.has(token))
    )
  );
}

export function scoreText(query: string, fields: Array<{ text?: string | null; weight: number }>) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return 0;

  const tokens = tokenizeQuery(trimmed);
  let score = 0;

  fields.forEach(({ text, weight }) => {
    if (!text) return;
    const haystack = text.toLowerCase();

    if (haystack.includes(trimmed)) {
      score += weight * 8;
    }

    tokens.forEach((token) => {
      if (haystack.includes(token)) {
        score += weight;
      }
    });
  });

  return score;
}

export function uniqueStrings(values: Array<string | undefined | null>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}
