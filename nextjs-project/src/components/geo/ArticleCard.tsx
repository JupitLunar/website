'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { ContentType, ContentHub } from '@/types/content';
import { isInsightArticleReviewer } from '@/lib/content-surface';

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

const TYPE_LABELS: Record<ContentType, string> = {
  explainer: 'Explainer',
  howto: 'Guide',
  research: 'Research',
  faq: 'FAQ',
  recipe: 'Recipe',
  news: 'Update',
};

const HUB_LABELS: Record<ContentHub, string> = {
  feeding: 'Feeding',
  sleep: 'Sleep',
  'mom-health': 'Mom Health',
  development: 'Development',
  safety: 'Safety',
  recipes: 'Recipes',
};

function sanitizeEntity(entity: string) {
  return entity
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const href = isInsightArticleReviewer(article.reviewed_by)
    ? `/insight/${article.slug}`
    : `/${article.slug}`;
  const reviewLabel = getReviewLabel(article.reviewed_by);

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

  const visibleKeyFacts = (article.key_facts || [])
    .filter((fact) => fact && !fact.startsWith('__AEO'))
    .slice(0, 3);

  const visibleEntities = (article.entities || [])
    .map(sanitizeEntity)
    .filter((entity) => entity.length >= 3)
    .filter((entity) => !/^aeo/i.test(entity))
    .filter((entity) => !/optimized/i.test(entity))
    .filter((entity) => !/integration/i.test(entity))
    .filter((entity) => !/test/i.test(entity))
    .filter((entity, index, all) => all.indexOf(entity) === index)
    .slice(0, 4);

  const publishedLabel = article.date_published ? formatDate(article.date_published) : null;
  const reviewedLabel = article.last_reviewed ? formatDate(article.last_reviewed) : null;

  return (
    <Link href={href} className="block">
      <Card className="h-full rounded-[28px] border border-slate-200/80 bg-white/90 transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[article.type]}`}>
                  {TYPE_LABELS[article.type]}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${hubColors[article.hub]}`}>
                  {HUB_LABELS[article.hub]}
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-500">
                  {reviewLabel}
                </span>
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
          {visibleKeyFacts.length > 0 && (
            <div className="mb-4 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
              <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Key Points</h4>
              <ul className="space-y-1">
                {visibleKeyFacts.map((fact, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span className="line-clamp-2">{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Entities for GEO */}
          {visibleEntities.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {visibleEntities.map((entity, index) => (
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
          <div className="flex items-center justify-between w-full gap-3 text-xs text-gray-500">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              {publishedLabel && <span>{publishedLabel}</span>}
              {reviewedLabel && <span>Reviewed: {reviewedLabel}</span>}
            </div>
            <span className="font-medium text-slate-500">Open article →</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ArticleCard;

function getReviewLabel(reviewedBy: string | null | undefined) {
  if (reviewedBy === 'Medical Review Board') return 'Medical review';
  if (reviewedBy === 'AI Content Generator') return 'Explainer';
  return 'Authority source';
}
