import { Metadata } from 'next';
export const dynamic = 'force-dynamic';
import { Suspense } from 'react';

import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import Link from 'next/link';
import Script from 'next/script';
import InsightFilters from '@/components/InsightFilters';
import InsightList from '@/components/InsightList';
import NewsletterSignup from '@/components/NewsletterSignup';
import { filterCleanKeywords } from '@/lib/supabase';
import { filterPublicFacingArticles, INSIGHT_REVIEWERS } from '@/lib/content-surface';

// Generate CollectionPage schema for AEO with enhanced keywords
function generateInsightsPageSchema(articles: any[], allKeywords: string[]) {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.momaiagent.com').replace(/\/$/, '');

  // Collect all unique keywords from articles
  const articleKeywords = new Set<string>();
  articles.forEach((article) => {
    const cleanKeywords = filterCleanKeywords(article.keywords || []);
    cleanKeywords.forEach((k: string) => articleKeywords.add(k));
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Insights & Explainers | Mom AI Agent',
    description: 'Source-linked explainers and caregiving insights on baby care, feeding, sleep, development, and postpartum questions.',
    url: `${baseUrl}/insight`,
    keywords: Array.from(articleKeywords).slice(0, 20).join(', '),
    about: {
      '@type': 'Thing',
      name: 'Insights & Explainers',
      description: 'Short explainers covering feeding, sleep, development, safety, and postpartum questions.',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Mom AI Agent',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/Logo.png`,
      },
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: articles.length,
      itemListElement: articles.slice(0, 10).map((article, index) => {
        const cleanKeywords = filterCleanKeywords(article.keywords || []);
        return {
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Article',
            headline: article.title,
            description: article.one_liner || article.meta_description,
            url: `${baseUrl}/insight/${article.slug}`,
            datePublished: article.date_published || article.created_at,
            keywords: cleanKeywords.join(', '),
            about: {
              '@type': 'Thing',
              name: article.hub,
            },
            author: {
              '@type': 'Organization',
              name: 'Mom AI Agent',
            },
          },
        };
      }),
    },
  };
}

// Generate Organization schema
function generateOrganizationSchema() {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.momaiagent.com').replace(/\/$/, '');

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Mom AI Agent',
    url: baseUrl,
    logo: `${baseUrl}/Logo.png`,
    description: 'Evidence Intelligence Platform for Mom & Baby, with source-linked guidance for feeding, sleep, safety, development, and postpartum care.',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      url: `${baseUrl}/contact`,
    },
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.momaiagent.com').replace(/\/$/, '');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return {
      title: 'Insights & Explainers | Feeding, Sleep, Safety & Postpartum',
      description: 'Source-linked explainers and caregiving insights on baby care, feeding, sleep, safety, development, and postpartum questions.',
      alternates: {
        canonical: `${baseUrl}/insight`,
      }
    };
  }
  const supabase = createClient(
    supabaseUrl,
    serviceRoleKey
  );

  const { data: articles } = await supabase
    .from('articles')
    .select('keywords, title, slug, status')
    .in('reviewed_by', [...INSIGHT_REVIEWERS])
    .eq('status', 'published')
    .limit(50);

  // Collect all unique keywords
  const allKeywords = new Set<string>();
  filterPublicFacingArticles((articles || []) as any[]).forEach((article: any) => {
    const cleanKeywords = filterCleanKeywords(article.keywords || []);
    cleanKeywords.forEach((k: string) => allKeywords.add(k));
  });

  const keywordsArray = Array.from(allKeywords).slice(0, 30);

  return {
    title: 'Insights & Explainers | Feeding, Sleep, Safety & Postpartum',
    description: 'Source-linked explainers and caregiving insights on baby care, feeding, sleep, safety, development, and postpartum questions.',
    keywords: [
      'parenting insights',
      'baby care articles',
      'infant care tips',
      'parenting explainers',
      'baby feeding articles',
      'newborn sleep articles',
      'postpartum guidance',
      ...keywordsArray
    ],
    openGraph: {
      title: 'Insights & Explainers | Feeding, Sleep, Safety & Postpartum',
      description: 'Source-linked explainers and caregiving insights for baby care, feeding, sleep, safety, and postpartum recovery.',
      type: 'website',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.momaiagent.com'}/insight`,
    },
    alternates: {
      canonical: `${baseUrl}/insight`,
    }
  };
}

export const revalidate = 300; // Revalidate every 5 minutes (fallback if revalidation API fails)

const getInsightArticles = unstable_cache(
  async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) return [];

    const supabase = createClient(
      supabaseUrl,
      serviceRoleKey
    );

    const { data: articles, error } = await supabase
      .from('articles')
      .select('*')
      .in('reviewed_by', [...INSIGHT_REVIEWERS])
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('[Insight Page] Error fetching articles:', error);
      return [];
    }

    // 添加调试日志（生产环境也记录，便于排查问题）
    console.log(`[Insight Page] Fetched ${articles?.length || 0} articles from database`);
    if (articles && articles.length > 0) {
      console.log(`[Insight Page] Latest article: ${articles[0].title} (${articles[0].slug})`);
    }

    return filterPublicFacingArticles(articles || []);
  },
  ['insights-list'],
  { tags: ['insights'], revalidate: 300 }
);

function formatDate(dateString: string | null) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function getHubColor(hub: string) {
  const colors: Record<string, string> = {
    feeding: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    sleep: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
    'mom-health': 'bg-rose-50 text-rose-700 border border-rose-100',
    development: 'bg-violet-50 text-violet-700 border border-violet-100',
    safety: 'bg-amber-50 text-amber-700 border border-amber-100',
    recipes: 'bg-orange-50 text-orange-700 border border-orange-100',
  };
  return colors[hub] || 'bg-slate-100 text-slate-600 border border-slate-200';
}

function getHubName(hub: string) {
  const names: Record<string, string> = {
    feeding: 'Feeding & Nutrition',
    sleep: 'Sleep & Routines',
    'mom-health': 'Mom Health',
    development: 'Development',
    safety: 'Safety',
    recipes: 'Recipes',
  };
  return names[hub] || hub;
}

export default async function InsightPage({
  searchParams,
}: {
  searchParams?: { hub?: string; age?: string; keyword?: string };
}) {
  const articles = await getInsightArticles();
  const selectedHub = searchParams?.hub || '';
  const selectedAge = searchParams?.age || '';
  const selectedKeyword = searchParams?.keyword || '';
  const hasActiveFilters = Boolean(selectedHub || selectedAge || selectedKeyword);

  const filteredArticles = articles.filter((article: any) => {
    if (selectedHub && article.hub !== selectedHub) return false;
    if (selectedAge && article.age_range !== selectedAge) return false;
    if (selectedKeyword) {
      const cleanKeywords = filterCleanKeywords(article.keywords || []);
      if (!cleanKeywords.some((k: string) => k.toLowerCase().includes(selectedKeyword.toLowerCase()))) {
        return false;
      }
    }
    return true;
  });

  // Extract unique values for filters
  const allHubs = Array.from(new Set(articles.map((a: any) => a.hub).filter(Boolean)));
  const allAgeRanges = Array.from(new Set(articles.map((a: any) => a.age_range).filter(Boolean)));

  // Collect all unique keywords
  const allKeywordsSet = new Set<string>();
  articles.forEach((article: any) => {
    const cleanKeywords = filterCleanKeywords(article.keywords || []);
    cleanKeywords.forEach((k: string) => allKeywordsSet.add(k));
  });
  const allKeywords = Array.from(allKeywordsSet).sort();

  // Generate schemas for AEO
  const schemaArticles = filteredArticles.length > 0 ? filteredArticles : articles;
  const collectionSchema = generateInsightsPageSchema(schemaArticles, allKeywords);
  const orgSchema = generateOrganizationSchema();
  const updatedAt = articles[0]?.date_modified || articles[0]?.updated_at || articles[0]?.created_at || null;
  const updatedLabel = updatedAt ? formatDate(updatedAt) : null;
  const updatedIso = updatedAt ? new Date(updatedAt).toISOString() : null;

  return (
    <div className="min-h-screen bg-gradient-elegant">
      {/* JSON-LD Structured Data for AEO */}
      <Script
        id="collection-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <Script
        id="org-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden py-16 px-4 sm:px-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-violet-100/40 to-purple-100/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-br from-slate-100/60 to-violet-100/10 rounded-full blur-3xl"></div>
        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <p className="uppercase tracking-[0.4em] text-xs text-slate-400 mb-4">Insights</p>
          <h1 className="text-4xl md:text-5xl font-light text-slate-700 mb-4">
            Insights and explainers for everyday caregiving decisions
          </h1>
          <p className="text-lg text-slate-500 max-w-3xl mx-auto font-light">
            Short explainers that translate public guidance into practical next steps for real-life parenting decisions.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {updatedLabel && updatedIso && (
              <time
                dateTime={updatedIso}
                className="px-4 py-2 rounded-full bg-white/80 border border-slate-200 text-[11px] uppercase tracking-[0.25em] text-slate-400"
              >
                Updated {updatedLabel}
              </time>
            )}
            <span className="px-4 py-2 rounded-full bg-white/80 border border-slate-200 text-[11px] uppercase tracking-[0.25em] text-slate-400">
              Evidence informed
            </span>
            <Link
              href="/topics"
                className="px-4 py-2 rounded-full bg-white/80 border border-slate-200 text-[11px] uppercase tracking-[0.25em] text-slate-500 hover:text-violet-500 transition-colors"
                aria-label="Explore parenting topics and guidelines"
              >
              Topics Library
              </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-white/80 border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-light text-slate-700 mb-4">Explore by hub</h2>
            <div className="flex flex-wrap gap-2">
              {[
                { slug: 'feeding', label: 'Feeding & Nutrition' },
                { slug: 'sleep', label: 'Sleep & Routines' },
                { slug: 'mom-health', label: 'Mom Health' },
                { slug: 'development', label: 'Development' },
                { slug: 'safety', label: 'Safety' },
                { slug: 'recipes', label: 'Recipes' }
              ].map((hub) => (
                <Link
                  key={hub.slug}
                  href={`/insight?hub=${hub.slug}`}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-500 hover:text-violet-500 transition-colors"
                >
                  {hub.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="bg-white/80 border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-light text-slate-700 mb-4">Explore More</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                { href: '/topics', label: 'Topics library' },
                { href: '/trust', label: 'Trust Center' },
                { href: '/foods', label: 'Foods Database' },
                { href: '/search', label: 'Answer hub' }
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-500 hover:text-violet-500 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/faq"
            className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm hover:shadow-md transition-all"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-3">FAQ path</p>
            <h2 className="text-xl font-light text-slate-700 mb-3">Need faster answers than a full article?</h2>
            <p className="text-sm text-slate-500 leading-relaxed">Jump into the FAQ for common feeding, allergen, and safety questions when you want a faster summary.</p>
          </Link>
          <Link
            href="/search"
            className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm hover:shadow-md transition-all"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-3">Answer hub</p>
            <h2 className="text-xl font-light text-slate-700 mb-3">Need a broader answer path than one article?</h2>
            <p className="text-sm text-slate-500 leading-relaxed">Use the answer hub when you want to compare multiple explainers, source-linked guidance paths, and fast topic matches.</p>
          </Link>
          <Link
            href="/trust"
            className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm hover:shadow-md transition-all"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-3">Trust path</p>
            <h2 className="text-xl font-light text-slate-700 mb-3">Want to inspect the evidence and review model?</h2>
            <p className="text-sm text-slate-500 leading-relaxed">Open the trust center to see source grading, review cadence, and the platform boundaries behind these explainers.</p>
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {articles.length === 0 ? (
          <div className="premium-card text-center">
            <h2 className="text-2xl font-light text-slate-700 mb-3">Insights are on the way</h2>
            <p className="text-slate-500 mb-6">
              We are preparing the first set of explainers. In the meantime, explore the Topics library for primary guidance.
            </p>
            <Link
              href="/topics"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-slate-400 to-violet-400 rounded-xl shadow-sm hover:from-slate-500 hover:to-violet-500 transition-all duration-300"
              aria-label="Browse parenting topics and guidelines"
            >
              Browse Topics
            </Link>
          </div>
        ) : (
          <>
            <Suspense fallback={<div className="h-20 animate-pulse bg-slate-100 rounded-xl mb-6"></div>}>
              <InsightFilters
                articles={articles}
                allKeywords={allKeywords}
                allHubs={allHubs}
                allAgeRanges={allAgeRanges}
              />
            </Suspense>
            <InsightList
              articles={filteredArticles}
              hasActiveFilters={hasActiveFilters}
              clearFiltersUrl="/insight"
            />
          </>
        )}
      </div>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-slate-200 bg-white/85 p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-light text-slate-700 mb-2">Continue from one insight into the wider hub</h3>
              <p className="text-sm text-slate-500">
                Use one article as a starting point, then widen into foods, topics, and answer paths when you need more context.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href="/search"
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-left hover:border-violet-200 transition-colors"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-2">Answer hub</p>
                <p className="text-sm text-slate-600">Search across explainers, guides, and trust-backed paths when one article is not enough.</p>
              </Link>
              <Link
                href="/foods"
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-left hover:border-violet-200 transition-colors"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-2">Foods database</p>
                <p className="text-sm text-slate-600">Move from general feeding guidance into food-specific texture, safety, and nutrient notes.</p>
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm">
            <NewsletterSignup
              variant="compact"
              title="Get weekly evidence notes"
              description="Short explainers, updated guidance signals, and practical caregiving notes from the answer hub."
              source="insight-evidence-notes"
            />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white/80 border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-light text-slate-700 mb-2">How we build these insights</h3>
              <p className="text-sm text-slate-500">
                Each insight synthesizes caregiver questions with public health guidance. For authoritative references, visit Topics.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/topics"
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-500 hover:text-violet-500 transition-colors"
              aria-label="Explore parenting topics and guidelines"
            >
              Topics Library
            </Link>
              <Link
                href="/trust"
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-500 hover:text-violet-500 transition-colors"
                aria-label="Learn about our methods and sources"
              >
                Methods and sources
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
