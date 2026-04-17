'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { BaseContent, KnowledgeFood } from '@/types/content';
import ArticleCard from '@/components/geo/ArticleCard';

type TopicSearchItem = {
  slug: string;
  title: string;
  description: string;
  keywords?: string[];
};

type QuickPathItem = {
  href: string;
  title: string;
  description: string;
  label: string;
  keywords?: string[];
};

type SearchSections = {
  guidance: BaseContent[];
  insights: BaseContent[];
  foods: KnowledgeFood[];
  topics: TopicSearchItem[];
  quickPaths: QuickPathItem[];
};

const TOPIC_RESULTS: TopicSearchItem[] = [
  {
    slug: 'north-america-overview',
    title: 'North America Overview',
    description: 'Regional guidance for infant feeding, safety, milestones, and nutrient priorities.',
  },
  {
    slug: 'feeding-foundations',
    title: 'Feeding Foundations',
    description: 'Readiness cues, textures, timing, and early feeding transitions.',
    keywords: ['solid foods', 'starting solids', 'first foods', 'baby-led weaning', 'blw'],
  },
  {
    slug: 'allergen-readiness',
    title: 'Allergen Introduction',
    description: 'Early allergen exposure, dosing routines, and observation basics.',
    keywords: ['allergens', 'peanut', 'egg', 'starting solids', 'solid foods'],
  },
  {
    slug: 'safety-and-hygiene',
    title: 'Safety & Hygiene',
    description: 'Choking prevention, storage, sanitation, and common risk signals.',
    keywords: ['fever', 'emergency', 'choking', 'safety', 'red flags'],
  },
  {
    slug: 'nutrient-priorities',
    title: 'Nutrient Priorities',
    description: 'Iron, vitamin D, calcium, and nutrition planning for baby feeding.',
  },
  {
    slug: 'travel-daycare',
    title: 'Travel & Care Logistics',
    description: 'Storage, transport, handoff notes, and day-to-day caregiver planning.',
  },
  {
    slug: 'holiday-planning',
    title: 'Holiday Planning',
    description: 'Gatherings, meal planning, sodium, allergens, and social feeding situations.',
  },
];

const QUICK_PATH_RESULTS: QuickPathItem[] = [
  {
    href: '/foods',
    title: 'Baby Food Database',
    description: 'Open the food-by-food database for cut sizes, textures, safety notes, and nutrient focus.',
    label: 'Foods',
    keywords: ['solid foods', 'starting solids', 'first foods', 'blw', 'baby-led weaning', 'food database'],
  },
  {
    href: '/trust',
    title: 'Trust Center',
    description: 'Review the source model, methodology, and platform boundaries behind Mom AI Agent.',
    label: 'Trust',
    keywords: ['methodology', 'sources', 'clinical review', 'trust'],
  },
  {
    href: '/topics/safety-and-hygiene',
    title: 'Safety & Hygiene Topic',
    description: 'Check fever red flags, choking prevention, food hygiene, and practical safety guidance.',
    label: 'Topic',
    keywords: ['fever', 'emergency', 'safety', 'choking', 'red flags'],
  },
  {
    href: '/faq',
    title: 'Frequently Asked Questions',
    description: 'Open common caregiver questions on feeding, sleep, fever, safety, and postpartum recovery.',
    label: 'FAQ',
    keywords: ['faq', 'questions', 'feeding', 'sleep', 'fever', 'postpartum'],
  },
];

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

function tokenizeQuery(query: string) {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((term) => term.length >= 2)
    .slice(0, 6);
}

function matchesTextItem(
  item: { title: string; description: string; keywords?: string[] },
  query: string,
  terms: string[]
) {
  return (
    includesQuery(item.title, query) ||
    includesQuery(item.description, query) ||
    includesQuery(item.keywords, query) ||
    terms.some((term) =>
      includesQuery(item.title, term) ||
      includesQuery(item.description, term) ||
      includesQuery(item.keywords, term)
    )
  );
}

function ResultSection({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
        <span className="text-sm text-slate-400">{count}</span>
      </div>
      {children}
    </section>
  );
}

function MiniResultCard({
  href,
  label,
  title,
  description,
}: {
  href: string;
  label: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-violet-200 hover:shadow-md transition-all"
    >
      <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400 mb-3">{label}</p>
      <h4 className="text-lg font-medium text-slate-800 mb-2">{title}</h4>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </Link>
  );
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchSections>({
    guidance: [],
    insights: [],
    foods: [],
    topics: [],
    quickPaths: [],
  });
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const nextQuery = searchParams.get('q') || '';
    if (nextQuery !== query) {
      setQuery(nextQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({
        guidance: [],
        insights: [],
        foods: [],
        topics: [],
        quickPaths: [],
      });
      setTotalResults(0);
      setErrorMessage(null);
      return;
    }

    const timer = window.setTimeout(() => {
      void performSearch(query);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [query]);

  const performSearch = async (rawQuery: string) => {
    const trimmedQuery = rawQuery.trim();
    if (!trimmedQuery) return;

    setLoading(true);
    setErrorMessage(null);
    try {
      const normalizedQuery = trimmedQuery.toLowerCase();
      const queryTerms = tokenizeQuery(trimmedQuery);
      const response = await fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}`);
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Search is temporarily unavailable.');
      }

      const foods: KnowledgeFood[] = Array.isArray(payload.foods) ? payload.foods : [];

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

      const matchedTopics = TOPIC_RESULTS
        .filter((topic) => matchesTextItem(topic, normalizedQuery, queryTerms))
        .slice(0, 6);

      const matchedQuickPaths = QUICK_PATH_RESULTS
        .filter((path) => matchesTextItem(path, normalizedQuery, queryTerms))
        .slice(0, 4);

      const nextResults = {
        guidance: Array.isArray(payload.guidance) ? payload.guidance : [],
        insights: Array.isArray(payload.insights) ? payload.insights : [],
        foods: matchedFoods,
        topics: matchedTopics,
        quickPaths: matchedQuickPaths,
      };

      setResults(nextResults);
      setTotalResults(
        nextResults.guidance.length +
        nextResults.insights.length +
        nextResults.foods.length +
        nextResults.topics.length +
        nextResults.quickPaths.length
      );
    } catch (error) {
      console.error('Search error:', error);
      setResults({
        guidance: [],
        insights: [],
        foods: [],
        topics: [],
        quickPaths: [],
      });
      setTotalResults(0);
      setErrorMessage(error instanceof Error ? error.message : 'Search is temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    const nextHref = trimmedQuery ? `/search?q=${encodeURIComponent(trimmedQuery)}` : '/search';
    router.replace(nextHref);
    if (trimmedQuery) {
      void performSearch(trimmedQuery);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-elegant">
      {/* Search Header - 淡雅风格 */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50/20 via-white to-violet-50/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-light text-slate-600 mb-6"
          >
            Search the Answer Hub
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-slate-500 mb-8 font-light"
          >
            Search source-linked guidance, explainers, foods, topics, and trust resources across Mom AI Agent
          </motion.p>

          {/* Search Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search feeding, sleep, safety, postpartum, or keyword..."
                  className="w-full px-6 py-4 text-lg border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-400 focus:border-transparent font-light"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="px-8 py-4 bg-gradient-to-r from-slate-400 to-violet-400 text-white rounded-xl font-light hover:from-slate-500 hover:to-violet-500 disabled:opacity-50 transition-all shadow-sm"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Search Results */}
      {query && (
        <section className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-6xl mx-auto">
            {/* Results Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Search Results
                  </h2>
                  <p className="text-gray-600">
                    {loading ? 'Searching...' : `${totalResults} results found for "${query}"`}
                  </p>
                </div>
              </div>
            </motion.div>

            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Searching across site content...</p>
              </div>
            ) : errorMessage ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-center py-16"
              >
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M4.93 19h14.14c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.2 16c-.77 1.33.19 3 1.73 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Search is temporarily unavailable</h3>
                <p className="text-gray-600 mb-6">{errorMessage}</p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => void performSearch(query)}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Try Again
                  </button>
                  <a
                    href="/topics"
                    className="px-6 py-3 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Browse Topics Instead
                  </a>
                </div>
              </motion.div>
            ) : totalResults > 0 ? (
              <div className="space-y-10">
                {results.guidance.length > 0 && (
                  <ResultSection title="Guidance" count={results.guidance.length}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.45 }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {results.guidance.map((article) => (
                        <ArticleCard key={`guidance-${article.id}`} article={article} />
                      ))}
                    </motion.div>
                  </ResultSection>
                )}

                {results.topics.length > 0 && (
                  <ResultSection title="Topics" count={results.topics.length}>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {results.topics.map((topic) => (
                        <MiniResultCard
                          key={topic.slug}
                          href={`/topics/${topic.slug}`}
                          label="Topics"
                          title={topic.title}
                          description={topic.description}
                        />
                      ))}
                    </div>
                  </ResultSection>
                )}

                {results.foods.length > 0 && (
                  <ResultSection title="Foods" count={results.foods.length}>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {results.foods.map((food) => (
                        <MiniResultCard
                          key={food.id}
                          href={`/foods/${food.slug}`}
                          label="Foods"
                          title={food.name}
                          description={food.why || `Serving forms, nutrient focus, and feeding notes for ${food.name}.`}
                        />
                      ))}
                    </div>
                  </ResultSection>
                )}

                {results.insights.length > 0 && (
                  <ResultSection title="Explainers" count={results.insights.length}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {results.insights.map((article) => (
                        <ArticleCard key={`insight-${article.id}`} article={article} />
                      ))}
                    </motion.div>
                  </ResultSection>
                )}

                {results.quickPaths.length > 0 && (
                  <ResultSection title="Browse Paths" count={results.quickPaths.length}>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {results.quickPaths.map((path) => (
                        <MiniResultCard
                          key={path.href}
                          href={path.href}
                          label={path.label}
                          title={path.title}
                          description={path.description}
                        />
                      ))}
                    </div>
                  </ResultSection>
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-center py-16"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-6">
                  Try a shorter keyword like "allergens", "sleep", "postpartum", or "iron".
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => setQuery('')}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Clear Search
                  </button>
                  <a
                    href="/topics"
                    className="px-6 py-3 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Browse Topics
                  </a>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* Search Suggestions */}
      {!query && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="px-4 sm:px-6 lg:px-8 pb-16"
        >
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                Popular Search Topics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  'allergen introduction',
                  'baby sleep',
                  'breastfeeding tips',
                  'infant development',
                  'maternal health',
                  'iron rich foods',
                  'postpartum care',
                  'child safety',
                  'vaccination schedule'
                ].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setQuery(topic)}
                    className="p-4 text-left border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900 mb-1">{topic}</h3>
                    <p className="text-sm text-gray-600">Browse related guidance on {topic}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-elegant flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
