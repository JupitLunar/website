'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

// Filter out AEO metadata from keywords array (stored with __AEO_ prefix)
function filterCleanKeywords(keywords: string[] | null | undefined): string[] {
  if (!keywords || !Array.isArray(keywords)) return [];
  return keywords.filter(k => !k.startsWith('__AEO_'));
}

interface Article {
  id: string;
  slug: string;
  title: string;
  one_liner: string;
  region: string;
  hub: string;
  type: string;
  created_at: string;
  last_reviewed: string;
  age_range: string;
  keywords: string[];
}

interface Props {
  articles: Article[];
}

export default function LatestArticlesTable({ articles }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'region'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Get unique regions and topics
  const regions = useMemo(() => {
    const uniqueRegions = [...new Set(articles.map(a => a.region))];
    return uniqueRegions.sort();
  }, [articles]);

  const topics = useMemo(() => {
    const uniqueTopics = [...new Set(articles.map(a => a.hub))];
    return uniqueTopics.sort();
  }, [articles]);

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    let filtered = articles;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.one_liner?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        filterCleanKeywords(article.keywords).some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Region filter
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(article => article.region === selectedRegion);
    }

    // Topic filter
    if (selectedTopic !== 'all') {
      filtered = filtered.filter(article => article.hub === selectedTopic);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'region':
          comparison = (a.region || '').localeCompare(b.region || '');
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [articles, searchTerm, selectedRegion, selectedTopic, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: 'date' | 'title' | 'region') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getRegionFlag = (region: string) => {
    const flags: Record<string, string> = {
      'US': '🇺🇸',
      'UK': '🇬🇧',
      'CA': '🇨🇦',
      'AU': '🇦🇺',
      'NZ': '🇳🇿',
      'SG': '🇸🇬',
      'EU': '🇪🇺',
      'Global': '🌍'
    };
    return flags[region] || '🌐';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4 p-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Articles
          </label>
          <input
            type="text"
            placeholder="Search by title, keywords..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Region Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Region
          </label>
          <select
            value={selectedRegion}
            onChange={(e) => {
              setSelectedRegion(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Regions</option>
            {regions.map(region => (
              <option key={region} value={region}>
                {getRegionFlag(region)} {region}
              </option>
            ))}
          </select>
        </div>

        {/* Topic Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topic
          </label>
          <select
            value={selectedTopic}
            onChange={(e) => {
              setSelectedTopic(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Topics</option>
            {topics.map(topic => (
              <option key={topic} value={topic}>
                {topic.charAt(0).toUpperCase() + topic.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Showing <span className="font-semibold">{paginatedArticles.length}</span> of{' '}
          <span className="font-semibold">{filteredArticles.length}</span> articles
        </p>

        {/* Sort Options */}
        <div className="flex gap-2">
          <button
            onClick={() => handleSort('date')}
            className={`px-3 py-1 rounded ${sortBy === 'date'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('title')}
            className={`px-3 py-1 rounded ${sortBy === 'title'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('region')}
            className={`px-3 py-1 rounded ${sortBy === 'region'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Region {sortBy === 'region' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Article
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Region
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Topic
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Age Range
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Added
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedArticles.map((article) => (
              <tr
                key={article.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/insight/${article.slug}`}
                    className="group"
                  >
                    <h3 className="font-semibold text-purple-600 group-hover:text-purple-800 line-clamp-2">
                      {article.title}
                    </h3>
                    {article.one_liner && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {article.one_liner}
                      </p>
                    )}
                    {filterCleanKeywords(article.keywords).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {filterCleanKeywords(article.keywords).slice(0, 3).map((keyword, idx) => (
                          <span
                            key={idx}
                            className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="flex items-center gap-2">
                    <span className="text-2xl">{getRegionFlag(article.region)}</span>
                    <span className="text-sm font-medium">{article.region}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {article.hub}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {article.age_range || 'All ages'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(article.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>

          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-4 py-2 rounded-lg ${currentPage === pageNum
                      ? 'bg-purple-600 text-white'
                      : 'border hover:bg-gray-50'
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      {/* No Results */}
      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No articles found matching your filters.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedRegion('all');
              setSelectedTopic('all');
              setCurrentPage(1);
            }}
            className="mt-4 text-purple-600 hover:text-purple-800 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
