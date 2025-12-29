'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { filterCleanKeywords } from '@/lib/supabase';

interface InsightFiltersProps {
  articles: any[];
  allKeywords: string[];
  allHubs: string[];
  allAgeRanges: string[];
}

export default function InsightFilters({ articles, allKeywords, allHubs, allAgeRanges }: InsightFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const selectedHub = searchParams.get('hub') || '';
  const selectedAge = searchParams.get('age') || '';
  const selectedKeyword = searchParams.get('keyword') || '';
  
  // Collapsible state - default to collapsed, but auto-expand if filters are active
  const [isExpanded, setIsExpanded] = useState(false);
  const [keywordSearch, setKeywordSearch] = useState('');
  
  // Auto-expand if filters are active
  useEffect(() => {
    if (selectedHub || selectedAge || selectedKeyword) {
      setIsExpanded(true);
    }
  }, [selectedHub, selectedAge, selectedKeyword]);

  // Filter articles based on URL params
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

  // Build filter URL
  const buildFilterUrl = (params: { hub?: string; age?: string; keyword?: string }) => {
    const newParams = new URLSearchParams();
    if (params.hub) newParams.set('hub', params.hub);
    if (params.age) newParams.set('age', params.age);
    if (params.keyword) newParams.set('keyword', params.keyword);
    return `/insight${newParams.toString() ? `?${newParams.toString()}` : ''}`;
  };

  const clearFilters = () => {
    router.push('/insight');
  };

  const hasActiveFilters = selectedHub || selectedAge || selectedKeyword;
  
  // Filter keywords by search
  const filteredKeywords = keywordSearch
    ? allKeywords.filter((k) => k.toLowerCase().includes(keywordSearch.toLowerCase()))
    : allKeywords;

  return (
    <>
      {/* Filter Toggle Button - Always Visible */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white/80 hover:bg-slate-50 transition-colors text-sm text-slate-600"
          >
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span>{isExpanded ? 'Hide Filters' : 'Show Filters'}</span>
            {hasActiveFilters && (
              <span className="ml-1 px-2 py-0.5 bg-violet-100 text-violet-600 text-xs rounded-full">
                {[selectedHub, selectedAge, selectedKeyword].filter(Boolean).length}
              </span>
            )}
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-slate-500 hover:text-violet-600 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
        
        {/* Results Count */}
        <div className="text-sm text-slate-500">
          <span className="font-semibold text-slate-700">{filteredArticles.length}</span> of{' '}
          <span className="font-semibold text-slate-700">{articles.length}</span> insights
        </div>
      </div>

      {/* Collapsible Filter Section */}
      {isExpanded && (
        <div className="mb-8 premium-card animate-fade-in">
          <div className="space-y-6">
            {/* Hub Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-[0.2em] mb-3">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {allHubs.map((hub) => {
                  const isActive = selectedHub === hub;
                  const hubCount = articles.filter((a: any) => a.hub === hub).length;
                  return (
                    <Link
                      key={hub}
                      href={buildFilterUrl({ hub: isActive ? undefined : hub, age: selectedAge || undefined, keyword: selectedKeyword || undefined })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-violet-100 text-violet-700 border-2 border-violet-300 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {getHubName(hub)} <span className="text-xs opacity-70">({hubCount})</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Age Range Filter */}
            {allAgeRanges.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-[0.2em] mb-3">
                  Age Range
                </label>
                <div className="flex flex-wrap gap-2">
                  {allAgeRanges.map((age) => {
                    const isActive = selectedAge === age;
                    const ageCount = articles.filter((a: any) => a.age_range === age).length;
                    return (
                      <Link
                        key={age}
                        href={buildFilterUrl({ hub: selectedHub || undefined, age: isActive ? undefined : age, keyword: selectedKeyword || undefined })}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-violet-100 text-violet-700 border-2 border-violet-300 shadow-sm'
                            : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        {age} <span className="text-xs opacity-70">({ageCount})</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Keywords Filter with Search */}
            {allKeywords.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-[0.2em] mb-3">
                  Topics
                </label>
                
                {/* Search Box for Keywords */}
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Search topics..."
                    value={keywordSearch}
                    onChange={(e) => setKeywordSearch(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition-all"
                  />
                </div>
                
                {/* Keywords Tags */}
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                  {filteredKeywords.slice(0, 30).map((keyword) => {
                    const isActive = selectedKeyword === keyword;
                    const keywordCount = articles.filter((a: any) => {
                      const cleanKeywords = filterCleanKeywords(a.keywords || []);
                      return cleanKeywords.some((k: string) => k.toLowerCase() === keyword.toLowerCase());
                    }).length;
                    return (
                      <Link
                        key={keyword}
                        href={buildFilterUrl({ hub: selectedHub || undefined, age: selectedAge || undefined, keyword: isActive ? undefined : keyword })}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          isActive
                            ? 'bg-violet-100 text-violet-700 border-2 border-violet-300 shadow-sm'
                            : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        {keyword} <span className="text-xs opacity-70">({keywordCount})</span>
                      </Link>
                    );
                  })}
                </div>
                {filteredKeywords.length === 0 && keywordSearch && (
                  <p className="text-sm text-slate-400 mt-2">No topics found matching "{keywordSearch}"</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Active Filters Display (when collapsed) */}
      {!isExpanded && hasActiveFilters && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 uppercase tracking-[0.2em]">Active filters:</span>
          {selectedHub && (
            <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">
              {getHubName(selectedHub)}
            </span>
          )}
          {selectedAge && (
            <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">
              Age: {selectedAge}
            </span>
          )}
          {selectedKeyword && (
            <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">
              {selectedKeyword}
            </span>
          )}
        </div>
      )}

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.map((article: any) => {
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
                  {formatDate(article.date_published)}
                </span>
              </div>

              <h2 className="text-2xl font-light text-slate-700 mb-3 group-hover:text-slate-900 transition-colors line-clamp-2">
                {article.title}
              </h2>

              <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                {article.one_liner || article.meta_description}
              </p>

              {/* Keywords Tags - Uniform Style */}
              {cleanKeywords.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {cleanKeywords.slice(0, 3).map((keyword: string, idx: number) => {
                      // Truncate long keywords to keep tags uniform (max 20 chars)
                      const displayKeyword = keyword.length > 20 ? keyword.substring(0, 17) + '...' : keyword;
                      return (
                        <span
                          key={idx}
                          className="inline-flex items-center justify-center h-6 px-2.5 bg-slate-50 text-slate-600 text-[10px] font-medium rounded-md border border-slate-200 whitespace-nowrap overflow-hidden text-ellipsis"
                          style={{ maxWidth: '140px' }}
                          title={keyword} // Show full keyword on hover
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

      {filteredArticles.length === 0 && articles.length > 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 mb-4">No insights match your filters.</p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-500 hover:text-violet-500 transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}
    </>
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
