import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import Script from 'next/script';
import InsightFilters from '@/components/InsightFilters';
import { filterCleanKeywords } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

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
    name: 'Parenting Insights | Mom AI Agent',
    description: 'Evidence-informed explainers and caregiver insights on baby care, feeding, sleep, development, and parenting.',
    url: `${baseUrl}/insight`,
    keywords: Array.from(articleKeywords).slice(0, 20).join(', '),
    about: {
      '@type': 'Thing',
      name: 'Parenting Insights',
      description: 'Evidence-based parenting articles covering feeding, sleep, development, safety, and more.',
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
    description: 'AI-powered parenting companion providing evidence-based guidance for baby care, feeding, sleep, and development.',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      url: `${baseUrl}/contact`,
    },
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: articles } = await supabase
    .from('articles')
    .select('keywords')
    .eq('reviewed_by', 'AI Content Generator')
    .eq('status', 'published')
    .limit(50);

  // Collect all unique keywords
  const allKeywords = new Set<string>();
  articles?.forEach((article) => {
    const cleanKeywords = filterCleanKeywords(article.keywords || []);
    cleanKeywords.forEach((k: string) => allKeywords.add(k));
  });

  const keywordsArray = Array.from(allKeywords).slice(0, 30);

  return {
    title: 'Parenting Insights | Mom AI Agent',
    description: 'Evidence-informed explainers and caregiver insights on baby care, feeding, sleep, development, and parenting.',
    keywords: [
      'parenting insights',
      'baby care articles',
      'infant care tips',
      'parenting explainers',
      ...keywordsArray
    ],
    openGraph: {
      title: 'Parenting Insights | Mom AI Agent',
      description: 'Evidence-informed explainers and caregiver insights for baby care and parenting.',
      type: 'website',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.momaiagent.com'}/insight`,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.momaiagent.com'}/insight`
    }
  };
}

export const revalidate = 300; // Revalidate every 5 minutes (fallback if revalidation API fails)

async function getInsightArticles() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 使用 reviewed_by 字段识别 AI 生成的文章
  // 注意：article_source 字段可能因 schema cache 问题无法使用
  const { data: articles, error } = await supabase
    .from('articles')
    .select('*')
    .eq('reviewed_by', 'AI Content Generator')
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

  return articles || [];
}

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
  const collectionSchema = generateInsightsPageSchema(articles, allKeywords);
  const orgSchema = generateOrganizationSchema();

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
            Parenting insights built from evidence and caregiver signals
          </h1>
          <p className="text-lg text-slate-500 max-w-3xl mx-auto font-light">
            Short explainers that translate public guidance into practical next steps for real-life parenting decisions.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="px-4 py-2 rounded-full bg-white/80 border border-slate-200 text-[11px] uppercase tracking-[0.25em] text-slate-400">
              Updated regularly
            </span>
            <span className="px-4 py-2 rounded-full bg-white/80 border border-slate-200 text-[11px] uppercase tracking-[0.25em] text-slate-400">
              Evidence informed
            </span>
            <Link
              href="/topics"
              className="px-4 py-2 rounded-full bg-white/80 border border-slate-200 text-[11px] uppercase tracking-[0.25em] text-slate-500 hover:text-violet-500 transition-colors"
              aria-label="Explore parenting topics and guidelines"
            >
              Explore Topics
            </Link>
          </div>
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
          <InsightFilters
            articles={articles}
            allKeywords={allKeywords}
            allHubs={allHubs}
            allAgeRanges={allAgeRanges}
          />
        )}
      </div>

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
                Explore Topics
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
