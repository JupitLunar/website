import Link from 'next/link';
import { filterCleanKeywords } from '@/lib/supabase';

interface InsightListProps {
  articles: any[];
  hasActiveFilters: boolean;
  clearFiltersUrl: string;
}

export default function InsightList({ articles, hasActiveFilters, clearFiltersUrl }: InsightListProps) {
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 mb-4">
          {hasActiveFilters ? 'No insights match your filters.' : 'No insights available yet.'}
        </p>
        {hasActiveFilters && (
          <Link
            href={clearFiltersUrl}
            className="inline-flex items-center px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-500 hover:text-violet-500 transition-colors"
          >
            Clear filters
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {articles.map((article: any) => {
        const cleanKeywords = filterCleanKeywords(article.keywords || []);
        return (
          <Link
            key={article.id}
            href={`/insight/${article.slug}`}
            className="group premium-card flex flex-col"
            aria-label={`Read insight: ${article.title}`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold ${getHubColor(article.hub)}`}>
                {getHubName(article.hub)}
              </span>
              <span className="text-[11px] uppercase tracking-[0.2em]">
                {formatDate(article.date_published || article.created_at)}
              </span>
            </div>

            <h2 className="text-2xl font-light text-slate-700 mb-3 group-hover:text-slate-900 transition-colors line-clamp-2">
              {article.title}
            </h2>

            <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
              {article.one_liner || article.meta_description}
            </p>

            {cleanKeywords.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-1.5 items-center">
                  {cleanKeywords.slice(0, 3).map((keyword: string, idx: number) => {
                    const displayKeyword = keyword.length > 20 ? `${keyword.substring(0, 17)}...` : keyword;
                    return (
                      <span
                        key={idx}
                        className="inline-flex items-center justify-center h-6 px-2.5 bg-slate-50 text-slate-600 text-[10px] font-medium rounded-md border border-slate-200 whitespace-nowrap overflow-hidden text-ellipsis"
                        style={{ maxWidth: '140px' }}
                        title={keyword}
                      >
                        {displayKeyword}
                      </span>
                    );
                  })}
                  {cleanKeywords.length > 3 && (
                    <span className="inline-flex items-center justify-center h-6 px-2.5 text-slate-400 text-[10px] font-medium">
                      +{cleanKeywords.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}

            {article.key_facts && Array.isArray(article.key_facts) && article.key_facts.length > 0 && (
              <p className="text-xs text-slate-400 mb-6 line-clamp-2">
                Key points: {article.key_facts.filter((f: string) => !f.startsWith('__AEO')).slice(0, 2).join(' | ')}
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
        );
      })}
    </div>
  );
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

function formatDate(dateString: string | null) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
