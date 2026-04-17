import { NextRequest, NextResponse } from 'next/server';
import { contentManager, knowledgeBase } from '@/lib/supabase';
import type { BaseContent } from '@/types/content';

export const dynamic = 'force-dynamic';

const MIN_QUERY_TERM_LENGTH = 2;
const MAX_QUERY_TERMS = 6;
const MAX_ARTICLE_RESULTS = 9;
const BROAD_SEARCH_FETCH_LIMIT = 40;

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'how', 'in', 'is', 'it',
  'of', 'on', 'or', 'that', 'the', 'to', 'what', 'when', 'with', 'your'
]);

const GENERIC_TERMS = new Set([
  'baby', 'newborn', 'infant', 'child', 'children', 'parent', 'parents', 'month', 'months', 'old'
]);

const HUB_INTENT_TERMS: Record<string, string[]> = {
  feeding: ['solid', 'solids', 'food', 'foods', 'feeding', 'allergen', 'allergens', 'blw', 'weaning'],
  sleep: ['sleep', 'nap', 'bedtime', 'wake', 'waking'],
  safety: ['choking', 'fever', 'emergency', 'safety', 'poison', 'burn'],
  development: ['milestone', 'milestones', 'development', 'growth', 'motor', 'language'],
  'mom-health': ['postpartum', 'recovery', 'maternal', 'depression', 'anxiety', 'breastfeeding'],
};

function normalizeTerm(term: string) {
  const normalized = term.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (normalized.length > 4 && normalized.endsWith('ies')) {
    return `${normalized.slice(0, -3)}y`;
  }
  if (normalized.length > 4 && normalized.endsWith('s')) {
    return normalized.slice(0, -1);
  }
  return normalized;
}

function tokenizeValue(value: string | null | undefined) {
  if (!value) return [];
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .map(normalizeTerm)
    .filter((term) => term.length >= MIN_QUERY_TERM_LENGTH);
}

function makeTermSet(value: string | string[] | null | undefined) {
  const entries = Array.isArray(value) ? value.flatMap((item) => tokenizeValue(item)) : tokenizeValue(value);
  return new Set(entries);
}

function includesQuery(value: string | string[] | undefined, query: string) {
  if (!value) return false;
  if (Array.isArray(value)) {
    return value.some((item) => item.toLowerCase().includes(query));
  }
  return value.toLowerCase().includes(query);
}

function scoreMatch(parts: Array<string | string[] | undefined>, query: string) {
  return parts.reduce((score, part, index) => {
    if (!part) return score;
    const haystack = Array.isArray(part) ? part.join(' ').toLowerCase() : part.toLowerCase();
    if (haystack.includes(query)) {
      return score + Math.max(1, 5 - index);
    }
    return score;
  }, 0);
}

function tokenizeQuery(rawQuery: string) {
  return rawQuery
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .map(normalizeTerm)
    .filter((term) => term.length >= MIN_QUERY_TERM_LENGTH)
    .filter((term) => !STOP_WORDS.has(term))
    .slice(0, MAX_QUERY_TERMS);
}

function parseDaysFromNow(value?: string) {
  if (!value) return null;
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) return null;
  const days = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
  return Math.max(0, days);
}

function containsTerm(value: string | undefined, term: string) {
  if (!value) return false;
  return makeTermSet(value).has(term);
}

function containsArrayTerm(value: string[] | undefined, term: string) {
  if (!value || value.length === 0) return false;
  return makeTermSet(value).has(term);
}

function getIntentMatchesByHub(terms: string[]) {
  return Object.entries(HUB_INTENT_TERMS).map(([hub, intentTerms]) => ({
    hub,
    matches: terms.filter((term) =>
      intentTerms.some((intentTerm) => {
        const normalizedIntent = normalizeTerm(intentTerm);
        return normalizedIntent === term || normalizedIntent.includes(term) || term.includes(normalizedIntent);
      })
    ).length,
  }));
}

function getPrimaryIntentHubs(terms: string[]) {
  const matches = getIntentMatchesByHub(terms).filter((entry) => entry.matches > 0);
  if (matches.length === 0) return [];

  const strongestMatch = Math.max(...matches.map((entry) => entry.matches));
  return matches
    .filter((entry) => entry.matches === strongestMatch)
    .map((entry) => entry.hub);
}

function detectIntentHubBoost(hub: string | undefined, terms: string[]) {
  if (!hub) return 0;

  const hubMatch = getIntentMatchesByHub(terms).find((entry) => entry.hub === hub);
  const matchCount = hubMatch?.matches || 0;
  const primaryHubs = getPrimaryIntentHubs(terms);

  if (matchCount === 0 && primaryHubs.length > 0) {
    return -36;
  }

  if (primaryHubs.includes(hub)) {
    return 18 + Math.min(16, matchCount * 6);
  }

  return matchCount > 0 ? 8 + Math.min(10, matchCount * 3) : 0;
}

function scoreArticle(article: Partial<BaseContent>, rawQuery: string, terms: string[]) {
  const title = article.title?.toLowerCase() || '';
  const oneLiner = article.one_liner?.toLowerCase() || '';
  const metaDescription = article.meta_description?.toLowerCase() || '';
  const body = article.body_md?.toLowerCase() || '';
  const keywords = (article.keywords || []).map((item) => item.toLowerCase());
  const entities = (article.entities || []).map((item) => item.toLowerCase());
  const phrase = rawQuery.toLowerCase();
  const titleTerms = makeTermSet(title);
  const oneLinerTerms = makeTermSet(oneLiner);
  const metaTerms = makeTermSet(metaDescription);
  const bodyTerms = makeTermSet(body);
  const keywordTerms = makeTermSet(keywords);
  const entityTerms = makeTermSet(entities);

  let score = 0;

  if (title.includes(phrase)) score += 120;
  if (oneLiner.includes(phrase)) score += 65;
  if (metaDescription.includes(phrase)) score += 45;
  if (body.includes(phrase)) score += 20;

  let titleMatches = 0;
  let summaryMatches = 0;
  let metaMatches = 0;
  let bodyMatches = 0;
  let keywordMatches = 0;
  let entityMatches = 0;
  let specificTermMatches = 0;
  let visibleSpecificTermMatches = 0;
  const specificTerms = terms.filter((term) => !GENERIC_TERMS.has(term));

  for (const term of terms) {
    const isGeneric = GENERIC_TERMS.has(term);
    const titleMatched = titleTerms.has(term);
    const summaryMatched = oneLinerTerms.has(term);
    const metaMatched = metaTerms.has(term);
    const bodyMatched = bodyTerms.has(term);
    const keywordMatched = keywordTerms.has(term);
    const entityMatched = entityTerms.has(term);
    const anyMatched = titleMatched || summaryMatched || metaMatched || bodyMatched || keywordMatched || entityMatched;
    const visibleMatched = titleMatched || summaryMatched || metaMatched || keywordMatched || entityMatched;

    if (titleMatched) {
      titleMatches += 1;
      score += isGeneric ? 8 : 28;
    }
    if (summaryMatched) {
      summaryMatches += 1;
      score += isGeneric ? 5 : 16;
    }
    if (metaMatched) {
      metaMatches += 1;
      score += isGeneric ? 4 : 12;
    }
    if (bodyMatched) {
      bodyMatches += 1;
      score += isGeneric ? 1 : 4;
    }
    if (keywordMatched) {
      keywordMatches += 1;
      score += isGeneric ? 3 : 10;
    }
    if (entityMatched) {
      entityMatches += 1;
      score += isGeneric ? 3 : 8;
    }

    if (!isGeneric && anyMatched) {
      specificTermMatches += 1;
    }
    if (!isGeneric && visibleMatched) {
      visibleSpecificTermMatches += 1;
    }
  }

  if (terms.length > 1 && titleMatches === terms.length) score += 36;
  if (terms.length > 1 && (titleMatches + summaryMatches + metaMatches + keywordMatches + entityMatches + bodyMatches) >= terms.length * 2) {
    score += 20;
  }

  if (specificTerms.length > 0 && terms.length > 1) {
    if (specificTermMatches === 0) {
      score -= 70;
    } else if (specificTermMatches < Math.min(2, specificTerms.length)) {
      score -= 20;
    }
  }

  if (specificTerms.length > 0 && visibleSpecificTermMatches === 0) {
    score -= terms.length > 1 ? 45 : 35;
  }

  score += detectIntentHubBoost(article.hub, terms);

  const daysSincePublished = parseDaysFromNow(article.date_published);
  if (daysSincePublished !== null) {
    if (daysSincePublished <= 30) score += 8;
    else if (daysSincePublished <= 90) score += 4;
    else if (daysSincePublished <= 180) score += 2;
  }

  return score;
}

function rerankArticles(articles: any[], rawQuery: string) {
  const terms = tokenizeQuery(rawQuery);
  const specificTerms = terms.filter((term) => !GENERIC_TERMS.has(term));
  const hasSpecificTerms = terms.some((term) => !GENERIC_TERMS.has(term));
  const primaryIntentHubs = getPrimaryIntentHubs(terms);
  const minScore = terms.length >= 2
    ? (hasSpecificTerms ? 28 : 16)
    : (primaryIntentHubs.length > 0 ? 14 : 8);

  const scored = articles
    .map((article, index) => ({
      article,
      index,
      score: scoreArticle(article, rawQuery, terms),
    }))
    .filter((item) => item.score >= minScore)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const bDate = Date.parse(b.article.date_published || '') || 0;
      const aDate = Date.parse(a.article.date_published || '') || 0;
      if (bDate !== aDate) return bDate - aDate;
      return a.index - b.index;
    });

  const topScore = scored[0]?.score ?? null;
  const scoreDropoff = primaryIntentHubs.length === 1 ? 34 : 48;
  const ranked = scored
    .filter((item) => topScore === null || item.score >= topScore - scoreDropoff)
    .slice(0, MAX_ARTICLE_RESULTS)
    .map((item) => item.article);

  if (ranked.length > 0) {
    if (primaryIntentHubs.length === 1) {
      return ranked.filter((article) => article.hub === primaryIntentHubs[0]);
    }
    return ranked;
  }

  if (specificTerms.length > 0) {
    const strictMatches = articles.filter((article) => {
      const titleTerms = makeTermSet(String(article.title || ''));
      const oneLinerTerms = makeTermSet(String(article.one_liner || ''));
      const metaTerms = makeTermSet(String(article.meta_description || ''));
      const keywordTerms = makeTermSet(Array.isArray(article.keywords) ? article.keywords : []);
      const entityTerms = makeTermSet(Array.isArray(article.entities) ? article.entities : []);
      const visibleMatchCount = specificTerms.filter((term) =>
        titleTerms.has(term) ||
        oneLinerTerms.has(term) ||
        metaTerms.has(term) ||
        keywordTerms.has(term) ||
        entityTerms.has(term)
      ).length;

      if (visibleMatchCount === 0) return false;

      if (primaryIntentHubs.length > 0 && article.hub && !primaryIntentHubs.includes(article.hub)) {
        return visibleMatchCount >= Math.min(2, specificTerms.length);
      }

      return true;
    });

    return strictMatches.slice(0, MAX_ARTICLE_RESULTS);
  }

  return articles.slice(0, MAX_ARTICLE_RESULTS);
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim();

  if (!query) {
    return NextResponse.json(
      { error: 'Missing required query parameter "q".' },
      { status: 400 }
    );
  }

  try {
    const normalizedQuery = query.toLowerCase();
    const searchQuery = {
      query,
      limit: BROAD_SEARCH_FETCH_LIMIT,
      offset: 0,
      sort_by: 'date_published' as const,
      sort_order: 'desc' as const,
    };

    const [guidanceResponse, insightsResponse, foods] = await Promise.all([
      contentManager.searchArticles(searchQuery),
      contentManager.searchInsightArticles(searchQuery),
      knowledgeBase.getFoods(),
    ]);

    const matchedFoods = foods
      .filter((food) =>
        includesQuery(food.name, normalizedQuery) ||
        includesQuery(food.why, normalizedQuery) ||
        includesQuery(food.nutrients_focus, normalizedQuery) ||
        includesQuery(food.feeding_methods, normalizedQuery)
      )
      .sort((a, b) => {
        const aScore = scoreMatch([a.name, a.why, a.nutrients_focus, a.feeding_methods], normalizedQuery);
        const bScore = scoreMatch([b.name, b.why, b.nutrients_focus, b.feeding_methods], normalizedQuery);
        return bScore - aScore;
      })
      .slice(0, 8);

    const rankedGuidance = rerankArticles(guidanceResponse.data || [], query);
    const rankedInsights = rerankArticles(insightsResponse.data || [], query);

    return NextResponse.json({
      guidance: rankedGuidance,
      insights: rankedInsights,
      foods: matchedFoods,
    });
  } catch (error) {
    console.error('[search api] search failed', error);
    return NextResponse.json(
      { error: 'Search is temporarily unavailable. Please try again.' },
      { status: 500 }
    );
  }
}
