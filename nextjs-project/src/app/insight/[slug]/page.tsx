import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Metadata } from 'next';
import Link from 'next/link';

export async function generateStaticParams() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: articles } = await supabase
    .from('articles')
    .select('slug')
    .or('article_source.eq.ai_generated,reviewed_by.eq.AI Content Generator')
    .eq('status', 'published')
    .limit(100);

  return (articles || []).map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', params.slug)
    .or('article_source.eq.ai_generated,reviewed_by.eq.AI Content Generator')
    .eq('status', 'published')
    .single();

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${article.title} | Insights | Mom AI Agent`,
    description: article.meta_description || article.one_liner,
    keywords: article.keywords || [],
    openGraph: {
      title: article.title,
      description: article.meta_description || article.one_liner,
      type: 'article',
      url: `https://www.momaiagent.com/insight/${params.slug}`,
      publishedTime: article.date_published,
      modifiedTime: article.date_modified,
    },
    alternates: {
      canonical: `https://www.momaiagent.com/insight/${params.slug}`,
    },
  };
}

export const revalidate = 3600;

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

function formatDate(dateString: string | null) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

export default async function InsightArticlePage({ params }: { params: { slug: string } }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', params.slug)
    .or('article_source.eq.ai_generated,reviewed_by.eq.AI Content Generator')
    .eq('status', 'published')
    .single();

  if (error || !article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-elegant">
      {/* Header */}
      <div className="bg-white/80 border-b border-slate-200/70 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/insight"
            className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 mb-4"
          >
            Back to Insights
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold ${getHubColor(article.hub)}`}>
              {getHubName(article.hub)}
            </span>
            {article.age_range && (
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Age {article.age_range}
              </span>
            )}
            {article.reviewed_by && (
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Reviewed by {article.reviewed_by}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <header className="mb-10">
          <p className="uppercase tracking-[0.4em] text-xs text-slate-400 mb-4">Insight</p>
          <h1 className="text-4xl md:text-5xl font-light text-slate-700 mb-4">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6">
            <span>Published {formatDate(article.date_published)}</span>
            {article.date_modified && (
              <span>Updated {formatDate(article.date_modified)}</span>
            )}
          </div>

          {/* One-liner */}
          {article.one_liner && (
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              {article.one_liner}
            </p>
          )}

          {/* Key Facts */}
          {article.key_facts && Array.isArray(article.key_facts) && article.key_facts.length > 0 && (
            <div className="key-facts-section">
              <h2 className="text-lg font-medium text-slate-700 mb-3">Key takeaways</h2>
              <ul className="space-y-2 text-slate-600">
                {article.key_facts.map((fact: string, idx: number) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2 text-slate-400">-</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </header>

        {/* Article Body */}
        <div className="prose prose-slate lg:prose-lg max-w-none mb-12">
          {article.body_md ? (
            <div 
              dangerouslySetInnerHTML={{ __html: article.body_md }}
            />
          ) : (
            <p className="text-slate-500">Content coming soon...</p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 mt-12">
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-[0.25em] mb-2">
              Evidence context
            </h3>
            <p className="text-sm text-slate-500">
              This insight synthesizes caregiver signals with public guidance. For primary references, explore Topics.
            </p>
            <Link
              href="/topics"
              className="inline-flex items-center mt-4 text-sm text-violet-500 hover:text-violet-600"
            >
              Explore Topics
            </Link>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-[0.25em] mb-2">
              Use with care
            </h3>
            <p className="text-sm text-slate-500">
              This content is educational and does not replace medical advice. For personal concerns, consult a clinician.
            </p>
            <Link
              href="/trust"
              className="inline-flex items-center mt-4 text-sm text-violet-500 hover:text-violet-600"
            >
              Methods and sources
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
