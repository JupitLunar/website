'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { ContentHub } from '@/types/content';

interface ContentHubCardProps {
  hub: {
    id: ContentHub;
    name: string;
    description: string;
    color: string;
    icon: string;
    slug: string;
    content_count: number;
  };
}

const ContentHubCard: React.FC<ContentHubCardProps> = ({ hub }) => {
  const colorClasses = {
    feeding: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    sleep: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    'mom-health': 'bg-pink-50 border-pink-200 hover:bg-pink-100',
    development: 'bg-green-50 border-green-200 hover:bg-green-100',
    safety: 'bg-red-50 border-red-200 hover:bg-red-100',
    recipes: 'bg-orange-50 border-orange-200 hover:bg-orange-100'
  };

  const textColorClasses = {
    feeding: 'text-blue-700',
    sleep: 'text-purple-700',
    'mom-health': 'text-pink-700',
    development: 'text-green-700',
    safety: 'text-red-700',
    recipes: 'text-orange-700'
  };

  return (
    <Link href={`/hub/${hub.slug}`} className="block transition-transform hover:scale-105">
      <Card className={`${colorClasses[hub.id]} border-2 transition-all duration-200 hover:shadow-lg`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{hub.icon}</span>
              <div>
                <CardTitle className={`text-xl ${textColorClasses[hub.id]}`}>
                  {hub.name}
                </CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm text-gray-600">
                    {hub.content_count} articles
                  </span>
                  <span className="text-xs bg-white/50 px-2 py-1 rounded-full text-gray-600">
                    {hub.id}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-gray-700 leading-relaxed">
            {hub.description}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ContentHubCard;
