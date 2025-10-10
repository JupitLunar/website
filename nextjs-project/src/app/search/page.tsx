'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { contentManager } from '@/lib/supabase';
import type { BaseContent, ContentHub } from '@/types/content';
import ArticleCard from '@/components/geo/ArticleCard';
import Header from '@/components/Header';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<BaseContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    hub: '',
    type: '',
    lang: 'en'
  });
  const [hubs, setHubs] = useState<any[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    loadContentHubs();
  }, []);

  useEffect(() => {
    if (query.trim()) {
      performSearch();
    }
  }, [query, filters, currentPage]);

  const loadContentHubs = async () => {
    try {
      const hubsData = await contentManager.getContentHubs();
      setHubs(hubsData);
    } catch (error) {
      console.error('Error loading content hubs:', error);
    }
  };

  const performSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const searchQuery = {
        query: query.trim(),
        filters: {
          ...filters,
          hub: filters.hub as ContentHub | undefined,
          type: filters.type as any,
          lang: filters.lang as any
        },
        limit: ITEMS_PER_PAGE,
        offset: (currentPage - 1) * ITEMS_PER_PAGE,
        sort_by: 'date_published' as const,
        sort_order: 'desc' as const
      };

      const response = await contentManager.searchArticles(searchQuery);
      setResults(response.data);
      setTotalResults(response.pagination.total);
      setHasMore(response.pagination.has_next);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    performSearch();
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({ hub: '', type: '', lang: 'en' });
    setCurrentPage(1);
  };

  const getContentTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      explainer: 'Explainer',
      howto: 'How-To',
      recipe: 'Recipe',
      faq: 'FAQ',
      research: 'Research',
      news: 'News'
    };
    return typeLabels[type] || type;
  };

  return (
    <div className="min-h-screen bg-gradient-elegant">
      <Header />
      
      {/* Search Header - 淡雅风格 */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50/20 via-white to-violet-50/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-light text-slate-600 mb-6"
          >
            Search Content
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-slate-500 mb-8 font-light"
          >
            Find expert insights on maternal and infant health
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
                  placeholder="Search for articles, topics, or keywords..."
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

      {/* Filters */}
      {query && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="px-4 sm:px-6 lg:px-8 mb-8"
        >
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-4">
                  {/* Hub Filter */}
                  <div>
                    <label htmlFor="hub-filter" className="block text-sm font-medium text-gray-700 mb-2">
                      Content Hub
                    </label>
                    <select
                      id="hub-filter"
                      value={filters.hub}
                      onChange={(e) => handleFilterChange('hub', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">All Hubs</option>
                      {hubs.map((hub) => (
                        <option key={hub.slug} value={hub.slug}>
                          {hub.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Type Filter */}
                  <div>
                    <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-2">
                      Content Type
                    </label>
                    <select
                      id="type-filter"
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">All Types</option>
                      <option value="explainer">Explainer</option>
                      <option value="howto">How-To</option>
                      <option value="recipe">Recipe</option>
                      <option value="faq">FAQ</option>
                      <option value="research">Research</option>
                      <option value="news">News</option>
                    </select>
                  </div>

                  {/* Language Filter */}
                  <div>
                    <label htmlFor="lang-filter" className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      id="lang-filter"
                      value={filters.lang}
                      onChange={(e) => handleFilterChange('lang', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="en">English</option>
                      <option value="zh">Chinese</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </motion.section>
      )}

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
                
                {filters.hub || filters.type || filters.lang !== 'en' ? (
                  <div className="flex flex-wrap gap-2">
                    {filters.hub && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        Hub: {hubs.find(h => h.slug === filters.hub)?.name}
                      </span>
                    )}
                    {filters.type && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        Type: {getContentTypeLabel(filters.type)}
                      </span>
                    )}
                    {filters.lang !== 'en' && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        Language: {filters.lang === 'zh' ? 'Chinese' : 'English'}
                      </span>
                    )}
                  </div>
                ) : null}
              </div>
            </motion.div>

            {/* Results Grid */}
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Searching for content...</p>
              </div>
            ) : results.length > 0 ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {results.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </motion.div>

                {/* Pagination */}
                {hasMore && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-12 flex justify-center"
                  >
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      
                      <span className="px-4 py-2 text-gray-700">
                        Page {currentPage} of {Math.ceil(totalResults / ITEMS_PER_PAGE)}
                      </span>
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!hasMore}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </motion.div>
                )}
              </>
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
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Clear All Filters
                </button>
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
                  'pregnancy nutrition',
                  'baby sleep',
                  'breastfeeding tips',
                  'infant development',
                  'maternal health',
                  'baby food recipes',
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
                    <p className="text-sm text-gray-600">Find expert advice on {topic}</p>
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

