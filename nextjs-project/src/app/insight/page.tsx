import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Parenting Insights | Mom AI Agent',
  description: 'Evidence-informed explainers and caregiver insights on baby care, feeding, sleep, development, and parenting.',
  keywords: [
    'parenting insights',
    'baby care articles',
    'infant care tips',
    'parenting explainers'
  ],
  openGraph: {
    title: 'Parenting Insights | Mom AI Agent',
    description: 'Evidence-informed explainers and caregiver insights for baby care and parenting.',
    type: 'website',
    url: 'https://www.momaiagent.com/insight',
  },
  alternates: {
    canonical: 'https://www.momaiagent.com/insight'
  }
};

export const revalidate = 3600; // Revalidate every hour

async function getInsightArticles() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: articles, error } = await supabase
    .from('articles')
    .select('*')
    .eq('article_source', 'ai_generated')
    .eq('status', 'published')
    .order('date_published', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching insight articles:', error);
    return [];
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

export default async function InsightPage() {
  const articles = await getInsightArticles();

  return (
    <div className="min-h-screen bg-gradient-elegant">
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
            >
              Browse Topics
            </Link>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="mb-10 text-center text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-700">{articles.length}</span> insights
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article: any) => (
                <Link
                  key={article.id}
                  href={`/insight/${article.slug}`}
                  className="group premium-card flex flex-col"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold ${getHubColor(article.hub)}`}>
                      {getHubName(article.hub)}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.2em]">
                      {formatDate(article.date_published)}
                    </span>
                  </div>

                  <h2 className="text-2xl font-light text-slate-700 mb-3 group-hover:text-slate-900 transition-colors line-clamp-2">
                    {article.title}
                  </h2>

                  <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                    {article.one_liner || article.meta_description}
                  </p>

                  {article.key_facts && Array.isArray(article.key_facts) && article.key_facts.length > 0 && (
                    <p className="text-xs text-slate-400 mb-6 line-clamp-2">
                      Key points: {article.key_facts.slice(0, 2).join(' | ')}
                    </p>
                  )}

                  <div className="mt-auto pt-4 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-400">
                    <span>
                      {article.age_range ? `Age: ${article.age_range}` : 'All stages'}
                    </span>
                    <span className="inline-flex items-center gap-2 text-slate-500 group-hover:text-violet-500 transition-colors">
                      Read insight
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
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
              >
                Explore Topics
              </Link>
              <Link
                href="/trust"
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-500 hover:text-violet-500 transition-colors"
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
