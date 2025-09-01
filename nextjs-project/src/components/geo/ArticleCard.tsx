'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { ContentType, ContentHub } from '@/types/content';

interface ArticleCardProps {
  article: {
    id: string;
    slug: string;
    type: ContentType;
    hub: ContentHub;
    title: string;
    one_liner: string;
    key_facts: string[];
    date_published: string;
    last_reviewed: string;
    reviewed_by: string;
    entities: string[];
    status: string;
  };
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const typeColors = {
    explainer: 'bg-blue-100 text-blue-800',
    howto: 'bg-green-100 text-green-800',
    research: 'bg-purple-100 text-purple-800',
    faq: 'bg-orange-100 text-orange-800',
    recipe: 'bg-red-100 text-red-800',
    news: 'bg-gray-100 text-gray-800'
  };

  const hubColors = {
    feeding: 'bg-blue-50 text-blue-700',
    sleep: 'bg-purple-50 text-purple-700',
    'mom-health': 'bg-pink-50 text-pink-700',
    development: 'bg-green-50 text-green-700',
    safety: 'bg-red-50 text-red-700',
    recipes: 'bg-orange-50 text-orange-700'
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Link href={`/article/${article.slug}`} className="block">
      <Card className="h-full transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[article.type]}`}>
                  {article.type}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${hubColors[article.hub]}`}>
                  {article.hub}
                </span>
                {article.status === 'published' && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Published
                  </span>
                )}
              </div>
              <CardTitle className="text-lg font-semibold line-clamp-2 mb-2">
                {article.title}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pb-3">
          <CardDescription className="text-gray-700 mb-3 line-clamp-3">
            {article.one_liner}
          </CardDescription>
          
          {/* Key Facts */}
          {article.key_facts && article.key_facts.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Key Points:</h4>
              <ul className="space-y-1">
                {article.key_facts.slice(0, 3).map((fact, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span className="line-clamp-2">{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Entities for GEO */}
          {article.entities && article.entities.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {article.entities.slice(0, 5).map((entity, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {entity}
                </span>
              ))}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-0">
          <div className="flex items-center justify-between w-full text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>Published: {formatDate(article.date_published)}</span>
              <span>Reviewed: {formatDate(article.last_reviewed)}</span>
            </div>
            <span className="text-blue-600 font-medium">Read more →</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ArticleCard;
