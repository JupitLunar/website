import React from 'react';
import { notFound } from 'next/navigation';
import { contentManager } from '@/lib/supabase';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ArticleCard from '@/components/geo/ArticleCard';
import { generateHubStructuredData, generateBreadcrumbStructuredData } from '@/lib/json-ld';
import Script from 'next/script';

// 生成静态路径
export async function generateStaticParams() {
  try {
    const hubs = await contentManager.getContentHubs();
    return hubs.map((hub: any) => ({
      'hub-slug': hub.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// 生成元数据
export async function generateMetadata({ params }: { params: { 'hub-slug': string } }): Promise<Metadata> {
  try {
    const hub = await contentManager.getContentHubBySlug(params['hub-slug']);
    
    if (!hub) {
      return {
        title: 'Content Hub Not Found',
        description: 'The requested content hub could not be found.',
      };
    }

    return {
      title: `${hub.name} | Mom AI Agent`,
      description: hub.description || `Expert insights on ${hub.name.toLowerCase()} from Mom AI Agent.`,
      keywords: `${hub.name}, Mom AI Agent, maternal health, infant care, parenting, North America`,
      openGraph: {
        title: `${hub.name} | Mom AI Agent`,
        description: hub.description,
        type: 'website',
        images: hub.icon ? [hub.icon] : [],
        siteName: 'Mom AI Agent',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${hub.name} | Mom AI Agent`,
        description: hub.description,
        images: hub.icon ? [hub.icon] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Content Hub | Mom AI Agent',
      description: 'Expert insights on maternal and infant health.',
    };
  }
}

export default async function HubPage({ params }: { params: { 'hub-slug': string } }) {
  try {
    const hub = await contentManager.getContentHubBySlug(params['hub-slug']);
    
    if (!hub) {
      notFound();
    }

    // 获取该hub的所有文章
    const articles = await contentManager.getHubArticles(hub.slug, 'en', 50);

    // 获取hub统计信息
    const stats = await contentManager.getContentStats().catch(() => null);
    const relatedHubs = stats?.articles_by_hub ?? {};

    // 生成结构化数据
    const structuredData = generateHubStructuredData(hub, articles);
    const breadcrumbData = generateBreadcrumbStructuredData([
      { name: 'Home', url: 'https://www.momaiagent.com' },
      { name: hub.name, url: `https://www.momaiagent.com/hub/${hub.slug}` }
    ]);

    return (
      <>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbData)
          }}
        />
        
        <div className="min-h-screen bg-gradient-elegant">
        {/* Hero Section - 淡雅风格 */}
        <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50/20 via-white to-violet-50/10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-100/10 to-purple-100/5 rounded-full blur-3xl"></div>
          
          <div className="max-w-6xl mx-auto relative z-10">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <ol className="flex items-center space-x-2 text-sm text-slate-500">
                <li>
                  <Link href="/" className="hover:text-violet-600 transition-colors font-light">
                    Home
                  </Link>
                </li>
                <li>
                  <span className="mx-2 text-slate-300">/</span>
                </li>
                <li className="text-slate-700 font-light">{hub.name}</li>
              </ol>
            </nav>

            {/* Hub Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-200 to-violet-200 rounded-2xl mb-6 shadow-sm">
                {hub.icon && (
                  <Image
                    src={hub.icon}
                    alt={hub.name}
                    width={40}
                    height={40}
                    className="w-10 h-10"
                  />
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-light text-slate-600 mb-6">
                {hub.name}
              </h1>
              {hub.description && (
                <p className="text-xl text-slate-500 mb-8 max-w-3xl mx-auto font-light">
                  {hub.description}
                </p>
              )}
              
              {/* Hub Stats - 淡雅样式 */}
              <div className="flex items-center justify-center space-x-8 text-sm text-slate-400 font-light">
                <span>{articles.length} Articles</span>
                <span>•</span>
                <span>{hub.article_count || 0} Total</span>
                {hub.last_updated && (
                  <>
                    <span>•</span>
                    <span>Updated: {new Date(hub.last_updated).toLocaleDateString()}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Articles Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            {articles.length > 0 ? (
              <>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Latest Articles
                  </h2>
                  <p className="text-lg text-gray-600">
                    Discover expert insights and evidence-based information
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article: any) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>

                {/* Load More Button */}
                {articles.length >= 50 && (
                  <div className="text-center mt-12">
                    <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-200">
                      Load More Articles
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  No Articles Yet
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  We're working on creating amazing content for this topic. Check back soon!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Related Hubs */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Explore Other Topics
              </h2>
              <p className="text-lg text-gray-600">
                Discover more expert insights across different areas
              </p>
            </div>
            
            <div className="text-center py-8">
              <p className="text-gray-500">
                More content hubs coming soon. Explore our main topics above.
              </p>
            </div>
          </div>
        </section>
      </div>
      </>
    );
  } catch (error) {
    console.error('Error loading hub:', error);
    notFound();
  }
}
