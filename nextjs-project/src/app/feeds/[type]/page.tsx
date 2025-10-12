import { Metadata } from 'next';
import { notFound } from 'next/navigation';
// Using simple Unicode icons instead of lucide-react
import { knowledgeBase } from '@/lib/supabase';
import type { KnowledgeLocale } from '@/types/content';

interface FeedPageProps {
  params: {
    type: string;
  };
  searchParams: {
    locale?: string;
    limit?: string;
  };
}

const feedConfig = {
  rules: {
    title: 'Feeding Rules',
    description: 'Evidence-based feeding guidelines and safety rules for infants and toddlers',
    icon: '📚',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    getData: (locale?: KnowledgeLocale) => knowledgeBase.getRules(locale),
  },
  foods: {
    title: 'Food Database',
    description: 'Comprehensive information about foods suitable for different ages and feeding methods',
    icon: '🍽️',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    getData: (locale?: KnowledgeLocale) => knowledgeBase.getFoods(locale),
  },
  guides: {
    title: 'Parenting Guides',
    description: 'Step-by-step guides for common parenting challenges and milestones',
    icon: '📋',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    getData: (locale?: KnowledgeLocale) => knowledgeBase.getGuides({ locale }),
  },
};

export async function generateMetadata({ params, searchParams }: FeedPageProps): Promise<Metadata> {
  const config = feedConfig[params.type as keyof typeof feedConfig];
  
  if (!config) {
    return {
      title: 'Feed Not Found',
      description: 'The requested feed type was not found.',
    };
  }

  const locale = searchParams.locale || 'Global';
  
  return {
    title: `${config.title} - Knowledge Base Feed`,
    description: `${config.description} Available for ${locale} locale.`,
    keywords: [params.type, 'knowledge base', 'feed', 'API', locale.toLowerCase()],
    openGraph: {
      title: `${config.title} Feed`,
      description: config.description,
      type: 'website',
      url: `https://www.momaiagent.com/feeds/${params.type}`,
    },
    alternates: {
      canonical: `/feeds/${params.type}`,
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(feedConfig).map((type) => ({
    type,
  }));
}

export default async function FeedTypePage({ params, searchParams }: FeedPageProps) {
  const config = feedConfig[params.type as keyof typeof feedConfig];
  
  if (!config) {
    notFound();
  }

  const locale = (searchParams.locale as KnowledgeLocale) || 'Global';
  const limit = parseInt(searchParams.limit || '50', 10);
  
  try {
    const items = await config.getData(locale);
    const limitedItems = items.slice(0, limit);

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className={`${config.color} mr-3 text-3xl`}>
                {config.icon}
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{config.title} Feed</h1>
            </div>
            
            <p className="text-gray-600 mb-4">{config.description}</p>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center bg-white px-3 py-1 rounded-full border">
                <span className="text-gray-500 mr-1">🛡️</span>
                <span className="text-gray-700">Locale: {locale}</span>
              </div>
              <div className="flex items-center bg-white px-3 py-1 rounded-full border">
                <span className="text-gray-700">Showing {limitedItems.length} of {items.length} items</span>
              </div>
              <a
                href={`/api/kb/feed?type=${params.type}&locale=${locale}&limit=${limit}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
              >
                <span className="mr-1">🔗</span>
                View API
              </a>
            </div>
          </div>

          {/* Feed Items */}
          <div className="space-y-6">
            {limitedItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4 text-6xl">
                  {config.icon}
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-600">
                  No {params.type} found for the selected locale. Try a different locale or check back later.
                </p>
              </div>
            ) : (
              limitedItems.map((item: any) => (
                <div
                  key={item.id}
                  className={`${config.bgColor} ${config.borderColor} border rounded-lg p-6 hover:shadow-md transition-shadow`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {'title' in item ? item.title : item.name}
                      </h3>
                      {item.summary && (
                        <p className="text-gray-600 mb-3">{item.summary}</p>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.locale}
                      </div>
                    </div>
                  </div>

                  {/* Content based on type */}
                  {params.type === 'rules' && (
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      {item.do_list && item.do_list.length > 0 && (
                        <div>
                          <h4 className="font-medium text-green-700 mb-2">Do:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {item.do_list.slice(0, 3).map((doItem: string, index: number) => (
                              <li key={index} className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                {doItem}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {item.dont_list && item.dont_list.length > 0 && (
                        <div>
                          <h4 className="font-medium text-red-700 mb-2">Don't:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {item.dont_list.slice(0, 3).map((dontItem: string, index: number) => (
                              <li key={index} className="flex items-start">
                                <span className="text-red-500 mr-2">✗</span>
                                {dontItem}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {params.type === 'foods' && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.age_range && item.age_range.map((age: string, index: number) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {age}
                          </span>
                        ))}
                        {item.risk_level && (
                          <span className={`text-xs px-2 py-1 rounded ${
                            item.risk_level === 'low' ? 'bg-green-100 text-green-800' :
                            item.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            Risk: {item.risk_level}
                          </span>
                        )}
                      </div>
                      
                      {item.nutrients_focus && item.nutrients_focus.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-1">Key Nutrients:</h4>
                          <p className="text-sm text-gray-600">
                            {item.nutrients_focus.slice(0, 5).join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {params.type === 'guides' && (
                    <div className="mb-4">
                      {item.age_range && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {item.age_range.map((age: string, index: number) => (
                            <span key={index} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                              {age}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {item.guide_type && (
                        <div>
                          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {item.guide_type}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-200 pt-3">
                    <div className="flex items-center space-x-4">
                      {item.reviewed_by && (
                        <div className="flex items-center">
                          <span className="mr-1">👤</span>
                          <span>Reviewed by {item.reviewed_by}</span>
                        </div>
                      )}
                      {item.last_reviewed_at && (
                        <div className="flex items-center">
                          <span className="mr-1">📅</span>
                          <span>Last reviewed: {new Date(item.last_reviewed_at).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-400">
                      ID: {item.id.slice(0, 8)}...
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Load More */}
          {items.length > limit && (
            <div className="text-center mt-8">
              <a
                href={`/feeds/${params.type}?locale=${locale}&limit=${Math.min(limit * 2, items.length)}`}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Load More ({items.length - limit} remaining)
              </a>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error(`Error loading ${params.type} feed:`, error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Feed</h1>
          <p className="text-gray-600">
            There was an error loading the {params.type} feed. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
