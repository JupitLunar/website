import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { filterPublicFacingArticles, getPlainTextExcerpt, markdownToPlainText } from '@/lib/content-surface';
import { attachRateLimitHeaders, createRateLimitResponse, evaluateRateLimit } from '@/lib/rate-limit';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const ARTICLE_FETCH_LIMIT = 30;
const CHUNK_FETCH_LIMIT = 12;
const ARTICLE_SOURCE_LIMIT = 4;
const CHUNK_SOURCE_LIMIT = 3;
const MAX_QUERY_LENGTH = 500;
const RAG_RATE_LIMIT = {
  namespace: 'rag-post',
  maxRequests: 12,
  windowMs: 5 * 60_000,
};
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'do', 'for', 'from', 'how', 'i', 'if', 'in', 'is', 'it',
  'my', 'of', 'on', 'or', 'should', 'that', 'the', 'to', 'what', 'when', 'with', 'your'
]);
const GENERIC_TERMS = new Set([
  'baby', 'babies', 'infant', 'newborn', 'child', 'children', 'month', 'months', 'old', 'care'
]);

interface StructuredResponse {
  summary: string;
  keyPoints: string[];
  details: {
    sections: Array<{
      title: string;
      content: string;
    }>;
  };
  actionableAdvice: string[];
  disclaimer: string;
}

interface ArticleHit {
  id: string;
  title: string;
  slug: string;
  hub: string | null;
  reviewed_by: string | null;
  one_liner: string | null;
  meta_description: string | null;
  body_md: string | null;
  key_facts?: string[] | null;
  date_published?: string | null;
  last_reviewed?: string | null;
  status?: string | null;
}

interface KnowledgeChunkHit {
  id: string;
  title: string;
  content: string;
  category: string | null;
  source_id: string | null;
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Missing Supabase environment variables');
  }
  return createClient(url, key);
}

function uniq<T>(values: T[]) {
  return Array.from(new Set(values));
}

function tokenizeQuery(rawQuery: string) {
  return uniq(
    rawQuery
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((term) => term.length >= 2)
      .filter((term) => !STOP_WORDS.has(term))
      .filter((term) => !GENERIC_TERMS.has(term))
      .slice(0, 6)
  );
}

function buildIlikeClauses(fields: string[], rawQuery: string) {
  const terms = uniq([rawQuery.trim(), ...tokenizeQuery(rawQuery)].filter(Boolean));

  return terms.flatMap((term) => {
    const value = `%${term}%`;
    return fields.map((field) => `${field}.ilike.${value}`);
  });
}

function scoreText(value: string | null | undefined, term: string) {
  if (!value) return 0;
  return value.toLowerCase().includes(term) ? 1 : 0;
}

function scoreArticle(article: ArticleHit, rawQuery: string) {
  const phrase = rawQuery.toLowerCase().trim();
  const terms = tokenizeQuery(rawQuery);
  let score = 0;

  if (scoreText(article.title, phrase)) score += 90;
  if (scoreText(article.one_liner, phrase)) score += 45;
  if (scoreText(article.meta_description, phrase)) score += 35;
  if (scoreText(article.body_md, phrase)) score += 24;

  for (const term of terms) {
    if (scoreText(article.title, term)) score += 16;
    if (scoreText(article.one_liner, term)) score += 10;
    if (scoreText(article.meta_description, term)) score += 8;
    if (scoreText(article.body_md, term)) score += 6;
    if (scoreText(article.hub, term)) score += 5;
  }

  return score;
}

function scoreChunk(chunk: KnowledgeChunkHit, rawQuery: string) {
  const phrase = rawQuery.toLowerCase().trim();
  const terms = tokenizeQuery(rawQuery);
  let score = 0;

  if (scoreText(chunk.title, phrase)) score += 70;
  if (scoreText(chunk.content, phrase)) score += 30;

  for (const term of terms) {
    if (scoreText(chunk.title, term)) score += 14;
    if (scoreText(chunk.content, term)) score += 8;
    if (scoreText(chunk.category, term)) score += 4;
  }

  return score;
}

function articleMatchesSpecificTerms(article: ArticleHit, terms: string[]) {
  if (terms.length === 0) return true;
  return terms.some((term) =>
    scoreText(article.title, term) ||
    scoreText(article.one_liner, term) ||
    scoreText(article.meta_description, term) ||
    scoreText(article.body_md, term) ||
    scoreText(article.hub, term)
  );
}

function chunkMatchesSpecificTerms(chunk: KnowledgeChunkHit, terms: string[]) {
  if (terms.length === 0) return true;
  return terms.some((term) =>
    scoreText(chunk.title, term) ||
    scoreText(chunk.content, term) ||
    scoreText(chunk.category, term)
  );
}

function extractKeyPoints(article: ArticleHit, chunks: KnowledgeChunkHit[]) {
  const explicitKeyFacts = Array.isArray(article.key_facts)
    ? article.key_facts.filter(Boolean).slice(0, 4)
    : [];

  if (explicitKeyFacts.length > 0) {
    return explicitKeyFacts;
  }

  const markdownLines = (article.body_md || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => /^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line))
    .map((line) => markdownToPlainText(line))
    .filter(Boolean)
    .slice(0, 4);

  if (markdownLines.length > 0) {
    return markdownLines;
  }

  const chunkPoints = chunks
    .map((chunk) => getPlainTextExcerpt(chunk.content, 140))
    .filter(Boolean)
    .slice(0, 3);

  if (chunkPoints.length > 0) {
    return chunkPoints;
  }

  const fallbackExcerpt = getPlainTextExcerpt(article.body_md || article.one_liner || article.meta_description, 180);
  return fallbackExcerpt ? [fallbackExcerpt] : [];
}

function buildSourceList(articles: ArticleHit[], knowledgeChunks: KnowledgeChunkHit[]) {
  return [
    ...articles.slice(0, ARTICLE_SOURCE_LIMIT).map((article) => ({
      title: article.title,
      category: article.hub || 'Guidance',
      url: article.reviewed_by === 'AI Content Generator' ? `/insight/${article.slug}` : `/${article.slug}`,
      type: 'article',
    })),
    ...knowledgeChunks.slice(0, CHUNK_SOURCE_LIMIT).map((chunk) => ({
      title: chunk.title,
      category: chunk.category || 'Knowledge',
      source: chunk.source_id,
      type: 'knowledge',
    })),
  ];
}

function buildContext(articles: ArticleHit[], chunks: KnowledgeChunkHit[]) {
  const articleContext = articles.slice(0, 3).map((article, index) => {
    const excerpt = getPlainTextExcerpt(article.body_md, 650);
    return [
      `Article ${index + 1}: ${article.title}`,
      `Hub: ${article.hub || 'General'}`,
      `Summary: ${article.one_liner || article.meta_description || 'No summary available.'}`,
      `Excerpt: ${excerpt || 'No article excerpt available.'}`,
    ].join('\n');
  });

  const chunkContext = chunks.slice(0, 2).map((chunk, index) => {
    return [
      `Knowledge Chunk ${index + 1}: ${chunk.title}`,
      `Category: ${chunk.category || 'General'}`,
      `Excerpt: ${getPlainTextExcerpt(chunk.content, 400) || 'No chunk excerpt available.'}`,
    ].join('\n');
  });

  return [...articleContext, ...chunkContext].join('\n\n');
}

function buildRetrievedFallback(query: string, articles: ArticleHit[], chunks: KnowledgeChunkHit[]): StructuredResponse {
  const primaryArticle = articles[0];
  const summarySource = primaryArticle?.one_liner
    || primaryArticle?.meta_description
    || getPlainTextExcerpt(primaryArticle?.body_md, 220)
    || getPlainTextExcerpt(chunks[0]?.content, 220)
    || `We found source-linked guidance related to "${query}" in the Mom AI Agent knowledge base.`;

  const sections = [
    ...articles.slice(0, 2).map((article) => ({
      title: article.title,
      content: getPlainTextExcerpt(article.body_md, 320) || article.one_liner || 'Open the linked source for more detail.',
    })),
    ...chunks.slice(0, 1).map((chunk) => ({
      title: chunk.title,
      content: getPlainTextExcerpt(chunk.content, 260),
    })),
  ].filter((section) => section.content);

  return {
    summary: summarySource,
    keyPoints: primaryArticle ? extractKeyPoints(primaryArticle, chunks) : chunks.map((chunk) => getPlainTextExcerpt(chunk.content, 140)).slice(0, 3),
    details: {
      sections,
    },
    actionableAdvice: [
      primaryArticle ? `Open "${primaryArticle.title}" for the full source-linked guide.` : 'Review the linked source material for more context.',
      articles[1] ? `Compare it with "${articles[1].title}" if you want a second angle on the question.` : 'Browse Topics or Foods if you want a more targeted path.',
      'For urgent symptoms, diagnosis, or individualized medical decisions, contact a licensed clinician.',
    ],
    disclaimer: 'This answer is assembled from retrieved Mom AI Agent knowledge base content and is for education only. For urgent or individualized concerns, contact a licensed clinician.',
  };
}

function buildNoMatchResponse(query: string): StructuredResponse {
  return {
    summary: `I could not find a strong source-linked match for "${query}" in the current Mom AI Agent knowledge base.`,
    keyPoints: [
      'Try using simpler terms such as feeding, fever, solids, sleep, allergy, or postpartum recovery.',
      'The strongest answers on this site come from retrieved guidance objects, not generic AI guesses.',
      'If the question is urgent or symptom-based, contact a clinician instead of relying on a general answer.',
    ],
    details: {
      sections: [
        {
          title: 'What to do next',
          content: 'Rephrase the question with the child age, topic, or risk signal you care about most. You can also browse Topics, Foods, or Insights to find a closer match.',
        },
      ],
    },
    actionableAdvice: [
      'Try a narrower question such as "6 month old starting solids" or "baby fever under 3 months".',
      'Use the search page or topic library if you want to browse related content paths.',
      'Contact a clinician immediately for emergencies or individualized medical advice.',
    ],
    disclaimer: 'Mom AI Agent is designed to return source-linked guidance when the knowledge base contains a strong match. This response is not medical advice.',
  };
}

async function synthesizeRetrievedAnswer(query: string, articles: ArticleHit[], chunks: KnowledgeChunkHit[]) {
  if (!openai) {
    return buildRetrievedFallback(query, articles, chunks);
  }

  const context = buildContext(articles, chunks);

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      temperature: 0.2,
      max_tokens: 900,
      messages: [
        {
          role: 'system',
          content: `You are the answer synthesis layer for Mom AI Agent.

Use only the retrieved context provided by the user.
Do not invent facts that are not supported by the context.
If the context is incomplete, say that clearly.
Return valid JSON only in this shape:
{
  "summary": "1-2 sentence direct answer",
  "keyPoints": ["3-5 concise points"],
  "details": {
    "sections": [
      { "title": "Section title", "content": "Brief explanation grounded in context" }
    ]
  },
  "actionableAdvice": ["2-3 practical next steps"],
  "disclaimer": "Short educational-use and clinician-boundary note"
}`,
        },
        {
          role: 'user',
          content: `Question: ${query}\n\nRetrieved context:\n${context}`,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return buildRetrievedFallback(query, articles, chunks);
    }

    const parsed = JSON.parse(content) as StructuredResponse;
    parsed.disclaimer = parsed.disclaimer
      ? `${parsed.disclaimer}\n\nThis answer is constrained to retrieved Mom AI Agent knowledge base content and is educational only.`
      : 'This answer is constrained to retrieved Mom AI Agent knowledge base content and is educational only.';
    return parsed;
  } catch (error) {
    console.error('[rag api] retrieval synthesis failed, using deterministic fallback', error);
    return buildRetrievedFallback(query, articles, chunks);
  }
}

async function searchArticles(supabase: any, query: string) {
  const clauses = buildIlikeClauses(['title', 'one_liner', 'meta_description', 'body_md'], query);
  const specificTerms = tokenizeQuery(query);

  let queryBuilder = supabase
    .from('articles')
    .select('id, title, slug, hub, reviewed_by, one_liner, meta_description, body_md, key_facts, date_published, last_reviewed, status')
    .eq('status', 'published')
    .limit(ARTICLE_FETCH_LIMIT);

  if (clauses.length > 0) {
    queryBuilder = queryBuilder.or(clauses.join(','));
  }

  const { data, error } = await queryBuilder;
  if (error) {
    console.error('[rag api] article search failed', error);
    return [];
  }

  const rankedArticles = filterPublicFacingArticles((data || []) as ArticleHit[])
    .map((article) => ({ article, score: scoreArticle(article, query) }))
    .filter((item) => item.score > 0)
    .filter((item) => articleMatchesSpecificTerms(item.article, specificTerms))
    .sort((a, b) => b.score - a.score);

  const topScore = rankedArticles[0]?.score || 0;
  const minAcceptedScore = topScore > 0 ? Math.max(18, Math.floor(topScore * 0.6)) : 0;

  return rankedArticles
    .filter((item) => item.score >= minAcceptedScore)
    .map((item) => item.article)
    .slice(0, ARTICLE_SOURCE_LIMIT);
}

async function searchKnowledgeChunks(supabase: any, query: string) {
  const clauses = buildIlikeClauses(['title', 'content', 'category'], query);
  const specificTerms = tokenizeQuery(query);

  let queryBuilder = supabase
    .from('knowledge_chunks')
    .select('id, title, content, category, source_id')
    .limit(CHUNK_FETCH_LIMIT);

  if (clauses.length > 0) {
    queryBuilder = queryBuilder.or(clauses.join(','));
  }

  const { data, error } = await queryBuilder;
  if (error) {
    console.error('[rag api] knowledge chunk search failed', error);
    return [];
  }

  const rankedChunks = ((data || []) as KnowledgeChunkHit[])
    .map((chunk) => ({ chunk, score: scoreChunk(chunk, query) }))
    .filter((item) => item.score > 0)
    .filter((item) => chunkMatchesSpecificTerms(item.chunk, specificTerms))
    .sort((a, b) => b.score - a.score);

  const topScore = rankedChunks[0]?.score || 0;
  const minAcceptedScore = topScore > 0 ? Math.max(12, Math.floor(topScore * 0.55)) : 0;

  return rankedChunks
    .filter((item) => item.score >= minAcceptedScore)
    .map((item) => item.chunk)
    .slice(0, CHUNK_SOURCE_LIMIT);
}

export async function POST(request: NextRequest) {
  try {
    const rateLimit = evaluateRateLimit(request, RAG_RATE_LIMIT);
    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit, 'Answer hub rate limit exceeded. Please wait a moment and retry.');
    }

    const body = await request.json();
    const { query, sessionId } = body;

    if (!query || typeof query !== 'string') {
      const response = NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
      return attachRateLimitHeaders(response, rateLimit);
    }

    const normalizedQuery = query.trim();
    if (normalizedQuery.length < 3 || normalizedQuery.length > MAX_QUERY_LENGTH) {
      const response = NextResponse.json(
        { error: `Query must be between 3 and ${MAX_QUERY_LENGTH} characters` },
        { status: 400 }
      );
      return attachRateLimitHeaders(response, rateLimit);
    }

    if (sessionId && (typeof sessionId !== 'string' || sessionId.length > 120)) {
      const response = NextResponse.json(
        { error: 'sessionId must be a short string when provided' },
        { status: 400 }
      );
      return attachRateLimitHeaders(response, rateLimit);
    }

    const supabase = getSupabase();
    const [articles, knowledgeChunks] = await Promise.all([
      searchArticles(supabase, normalizedQuery),
      searchKnowledgeChunks(supabase, normalizedQuery),
    ]);

    const sources = buildSourceList(articles, knowledgeChunks);
    const answer = sources.length > 0
      ? await synthesizeRetrievedAnswer(normalizedQuery, articles, knowledgeChunks)
      : buildNoMatchResponse(normalizedQuery);

    const response = NextResponse.json({
      answer,
      sources,
      sessionId,
      timestamp: new Date().toISOString(),
    });
    return attachRateLimitHeaders(response, rateLimit);
  } catch (error: any) {
    console.error('[rag api] failed', error);
    return NextResponse.json(
      {
        error: 'Failed to process query',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: 'RAG API endpoint. Use POST to query source-linked Mom AI Agent guidance.',
      version: '2.0',
    },
    { status: 200 }
  );
}
