'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface AnalyticsData {
  page_views: number;
  unique_visitors: number;
  bounce_rate: number;
  avg_session_duration: number;
  top_pages: Array<{ page: string; views: number }>;
  top_content_hubs: Array<{ hub: string; views: number }>;
  search_queries: Array<{ query: string; count: number }>;
  newsletter_subscriptions: number;
  error_rate: number;
  performance_metrics: {
    fcp: number;
    lcp: number;
    cls: number;
    fid: number;
  };
}

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from Google Analytics API
      // For now, we'll simulate the data
      const mockData: AnalyticsData = {
        page_views: 15420,
        unique_visitors: 8930,
        bounce_rate: 42.5,
        avg_session_duration: 3.2,
        top_pages: [
          { page: '/', views: 3240 },
          { page: '/learn/feeding', views: 1890 },
          { page: '/learn/sleep', views: 1650 },
          { page: '/learn/development', views: 1420 },
          { page: '/search', views: 1180 },
        ],
        top_content_hubs: [
          { hub: 'Feeding & Nutrition', views: 4560 },
          { hub: 'Sleep & Routines', views: 3890 },
          { hub: 'Baby Development', views: 3240 },
          { hub: 'Mom Health', views: 2890 },
          { hub: 'Safety & First Aid', views: 2340 },
        ],
        search_queries: [
          { query: 'baby sleep schedule', count: 234 },
          { query: 'breastfeeding tips', count: 189 },
          { query: 'solid food introduction', count: 156 },
          { query: 'baby development milestones', count: 134 },
          { query: 'pregnancy nutrition', count: 112 },
        ],
        newsletter_subscriptions: 456,
        error_rate: 0.8,
        performance_metrics: {
          fcp: 1.2,
          lcp: 2.1,
          cls: 0.05,
          fid: 45,
        },
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalyticsData();
    setRefreshing(false);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatDuration = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    return `${mins}m ${secs}s`;
  };

  const getPerformanceScore = (value: number, type: string) => {
    switch (type) {
      case 'fcp':
        return value <= 1.8 ? 'good' : value <= 3.0 ? 'needs-improvement' : 'poor';
      case 'lcp':
        return value <= 2.5 ? 'good' : value <= 4.0 ? 'needs-improvement' : 'poor';
      case 'cls':
        return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
      case 'fid':
        return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
      default:
        return 'good';
    }
  };

  const getScoreColor = (score: string) => {
    switch (score) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading analytics data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-2">Website performance and user engagement metrics</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="1d">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <Button
                onClick={handleRefresh}
                loading={refreshing}
                variant="outline"
                size="sm"
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {analyticsData && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Page Views</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatNumber(analyticsData.page_views)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">+12% from last period</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Unique Visitors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatNumber(analyticsData.unique_visitors)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">+8% from last period</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Bounce Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {analyticsData.bounce_rate}%
                  </div>
                  <p className="text-xs text-gray-500 mt-1">-2% from last period</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Avg. Session</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatDuration(analyticsData.avg_session_duration)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">+15% from last period</p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Core Web Vitals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">First Contentful Paint</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getScoreColor(getPerformanceScore(analyticsData.performance_metrics.fcp, 'fcp'))}`}>
                        {analyticsData.performance_metrics.fcp}s
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Largest Contentful Paint</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getScoreColor(getPerformanceScore(analyticsData.performance_metrics.lcp, 'lcp'))}`}>
                        {analyticsData.performance_metrics.lcp}s
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Cumulative Layout Shift</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getScoreColor(getPerformanceScore(analyticsData.performance_metrics.cls, 'cls'))}`}>
                        {analyticsData.performance_metrics.cls}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">First Input Delay</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getScoreColor(getPerformanceScore(analyticsData.performance_metrics.fid, 'fid'))}`}>
                        {analyticsData.performance_metrics.fid}ms
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Newsletter Subscriptions</span>
                      <span className="text-lg font-semibold text-purple-600">
                        {formatNumber(analyticsData.newsletter_subscriptions)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Error Rate</span>
                      <span className="text-lg font-semibold text-red-600">
                        {analyticsData.error_rate}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Top Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.top_pages.map((page, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 truncate">{page.page}</span>
                        <span className="text-sm font-semibold">{formatNumber(page.views)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Content Hubs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.top_content_hubs.map((hub, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 truncate">{hub.hub}</span>
                        <span className="text-sm font-semibold">{formatNumber(hub.views)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Top Search Queries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.search_queries.map((query, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 truncate">"{query.query}"</span>
                      <span className="text-sm font-semibold">{query.count} searches</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
