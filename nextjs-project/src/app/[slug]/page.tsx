import React from 'react';
import { notFound } from 'next/navigation';
import { contentManager } from '@/lib/supabase';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { generateArticleStructuredData, generateBreadcrumbStructuredData } from '@/lib/json-ld';
import Script from 'next/script';

// 生成静态路径
export async function generateStaticParams() {
  try {
    const articles = await contentManager.getAllArticles();
    return articles.map((article) => ({
      slug: article.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// 生成元数据
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const article = await contentManager.getArticleBySlug(params.slug);
    
    if (!article) {
      return {
        title: 'Article Not Found',
        description: 'The requested article could not be found.',
      };
    }

    return {
      title: `${article.title} | JupitLunar`,
      description: article.one_liner || article.body_md?.substring(0, 160) || 'Expert insights on maternal and infant health.',
      keywords: article.entities?.join(', ') || 'maternal health, infant care, parenting',
      authors: [{ name: 'JupitLunar Team' }],
      openGraph: {
        title: article.title,
        description: article.one_liner || article.body_md?.substring(0, 160),
        type: 'article',
        publishedTime: article.published_at,
        modifiedTime: article.updated_at,
        authors: ['JupitLunar Team'],
        images: article.featured_image ? [article.featured_image] : [],
        url: `https://jupitlunar.com/${article.slug}`,
        siteName: 'JupitLunar',
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.one_liner || article.body_md?.substring(0, 160),
        images: article.featured_image ? [article.featured_image] : [],
        creator: '@jupitlunar',
        site: '@jupitlunar',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Article | JupitLunar',
      description: 'Expert insights on maternal and infant health.',
    };
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  try {
    const article = await contentManager.getArticleBySlug(params.slug);
    
    if (!article) {
      notFound();
    }

    // 获取相关文章
    const relatedArticles = await contentManager.getRelatedArticles(article.id, article.hub, 3);

    // 生成结构化数据
    const structuredData = generateArticleStructuredData(article);
    const breadcrumbData = generateBreadcrumbStructuredData([
      { name: 'Home', url: 'https://jupitlunar.com' },
      { name: article.hub, url: `https://jupitlunar.com/hub/${article.hub}` },
      { name: article.title, url: `https://jupitlunar.com/${article.slug}` }
    ]);

    const tldrItems = Array.isArray(article.key_facts) ? article.key_facts.slice(0, 5) : [];
    const faqItems = Array.isArray((article as any).qas)
      ? (article as any).qas.filter((qa: any) => qa.question && qa.answer)
      : [];
    const citationItems = Array.isArray(article.citations) ? article.citations : [];
    const publishedAt = article.published_at ? new Date(article.published_at) : null;
    const updatedAt = article.updated_at ? new Date(article.updated_at) : null;
    const lastReviewedAt = article.last_reviewed ? new Date(article.last_reviewed) : null;

    return (
      <>
        {/* JSON-LD Structured Data */}
        <Script
          id="article-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
        <Script
          id="breadcrumb-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbData)
          }}
        />
        
        <div className="min-h-screen bg-gradient-to-br from-[#F8F6FC] to-[#EAE6F8]">
          {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <ol className="flex items-center space-x-2 text-sm text-gray-600">
                <li>
                  <Link href="/" className="hover:text-purple-600 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <span className="mx-2">/</span>
                </li>
                <li>
                  <Link href={`/hub/${article.hub}`} className="hover:text-purple-600 transition-colors">
                    {article.hub}
                  </Link>
                </li>
                <li>
                  <span className="mx-2">/</span>
                </li>
                <li className="text-gray-900 font-medium">{article.title}</li>
              </ol>
            </nav>

            {/* Article Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-6">
                {article.type}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {article.title}
              </h1>
              {article.one_liner && (
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  {article.one_liner}
                </p>
              )}
              
              {/* Article Meta */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
                {publishedAt && <span>Published: {publishedAt.toLocaleDateString()}</span>}
                {updatedAt && (!publishedAt || updatedAt.getTime() !== publishedAt.getTime()) && (
                  <span>Updated: {updatedAt.toLocaleDateString()}</span>
                )}
                {article.reviewed_by && (
                  <span>Reviewed by {article.reviewed_by}</span>
                )}
                {lastReviewedAt && (
                  <span>Last review: {lastReviewedAt.toLocaleDateString()}</span>
                )}
                {article.reading_time && (
                  <span>{article.reading_time} min read</span>
                )}
                {article.region && <span>Region: {article.region}</span>}
              </div>
            </div>

            {/* Featured Image */}
            {article.featured_image && (
              <div className="mb-12">
                <Image
                  src={article.featured_image}
                  alt={article.title}
                  width={800}
                  height={400}
                  className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
                />
              </div>
            )}
          </div>
        </section>

        {/* Article Content */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              {/* TL;DR */}
              {tldrItems.length > 0 && (
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-400 p-6 rounded-r-lg mb-8">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <h3 className="text-lg font-semibold text-emerald-900 mb-2">TL;DR</h3>
                      <p className="text-sm text-emerald-700">Top takeaways suitable for AI summaries & quick caregiver reference.</p>
                    </div>
                    {article.last_reviewed && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-white text-emerald-700 text-xs font-semibold border border-emerald-200">
                        Verified {new Date(article.last_reviewed).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <ul className="mt-4 space-y-2 text-emerald-900">
                    {tldrItems.map((item: string, index: number) => (
                      <li key={index} className="flex gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Evidence Deck */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                {publishedAt && (
                  <div className="rounded-2xl border border-purple-100 bg-purple-50/60 p-4">
                    <p className="text-xs uppercase tracking-wide text-purple-600">Published</p>
                    <p className="mt-1 text-base font-semibold text-purple-900">{publishedAt.toLocaleDateString()}</p>
                  </div>
                )}
                {article.reviewed_by && (
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                    <p className="text-xs uppercase tracking-wide text-blue-600">Reviewed by</p>
                    <p className="mt-1 text-base font-semibold text-blue-900">{article.reviewed_by}</p>
                  </div>
                )}
                {article.region && (
                  <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
                    <p className="text-xs uppercase tracking-wide text-amber-600">Region scope</p>
                    <p className="mt-1 text-base font-semibold text-amber-900">{article.region}</p>
                  </div>
                )}
              </div>

              {/* Main Content */}
              <div className="mb-8">
                {article.body_md ? (
                  <div dangerouslySetInnerHTML={{ __html: article.body_md }} />
                ) : (
                  <p className="text-gray-600">Content coming soon...</p>
                )}
              </div>

              {/* Entities/Tags */}
              {article.entities && article.entities.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {article.entities.map((entity: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                    >
                      {entity}
                    </span>
                  ))}
                </div>
              )}

              {/* Citations */}
              {/* FAQ */}
              {faqItems.length > 0 && (
                <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border-l-4 border-indigo-400 p-6 rounded-r-lg mb-8">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <h3 className="text-lg font-semibold text-indigo-900">FAQ</h3>
                    <span className="text-xs text-indigo-600">Evidence-backed responses for quick retrieval</span>
                  </div>
                  <div className="mt-4 space-y-4">
                    {faqItems.map((qa: any) => (
                      <div key={qa.id || qa.question} className="rounded-xl border border-indigo-100 bg-white/70 p-4">
                        <h4 className="font-semibold text-indigo-900">{qa.question}</h4>
                        <p className="mt-2 text-sm text-indigo-800 leading-relaxed">{qa.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Citations */}
              {citationItems.length > 0 && (
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-400 p-6 rounded-r-lg mb-8">
                  <h3 className="text-lg font-semibold text-orange-900 mb-4">References</h3>
                  <ol className="space-y-3 text-sm text-orange-900">
                    {citationItems.map((citation: any, index: number) => (
                      <li key={citation.id || index}>
                        {citation.title ? <strong>{citation.title}</strong> : null}
                        {citation.publisher && <span className="ml-1">({citation.publisher})</span>}
                        {citation.date && <span className="ml-2 text-orange-700">{new Date(citation.date).toLocaleDateString()}</span>}
                        {citation.url && (
                          <div>
                            <a
                              href={citation.url}
                              className="text-orange-700 underline break-all"
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              {citation.url}
                            </a>
                          </div>
                        )}
                        {citation.claim && <p className="mt-1 text-orange-800">{citation.claim}</p>}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <Link
                    key={relatedArticle.id}
                    href={`/${relatedArticle.slug}`}
                    className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
                  >
                    {relatedArticle.featured_image && (
                      <Image
                        src={relatedArticle.featured_image}
                        alt={relatedArticle.title}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <div className="text-sm text-purple-600 font-medium mb-2">
                        {relatedArticle.type}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {relatedArticle.title}
                      </h3>
                      {relatedArticle.one_liner && (
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {relatedArticle.one_liner}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
      </>
    );
  } catch (error) {
    console.error('Error loading article:', error);
    notFound();
  }
}
