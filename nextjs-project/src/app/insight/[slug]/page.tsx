import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { filterCleanKeywords } from '@/lib/supabase';
import SocialShare from '@/components/SocialShare';
import CitationBox from '@/components/CitationBox';

import { generateMedicalWebPageSchema } from '@/lib/aeo-optimizations';
// AEO Helper: Extract FAQ data from keywords
function extractAEOData(keywords: string[]) {
  const faqs: { question: string; answer: string }[] = [];
  let quickAnswer = '';
  const steps: { title: string; description: string }[] = [];
  const cleanKeywords: string[] = [];

  keywords.forEach((keyword) => {
    if (keyword.startsWith('__AEO_FAQS__')) {
      try {
        const faqData = JSON.parse(keyword.replace('__AEO_FAQS__', ''));
        faqs.push(...faqData);
      } catch (e) { }
    } else if (keyword.startsWith('__AEO_STEPS__')) {
      try {
        const stepData = JSON.parse(keyword.replace('__AEO_STEPS__', ''));
        steps.push(...stepData);
      } catch (e) { }
    } else if (keyword.startsWith('__AEO_QUICK__')) {
      quickAnswer = keyword.replace('__AEO_QUICK__', '');
    } else {
      cleanKeywords.push(keyword);
    }
  });

  return { faqs, quickAnswer, steps, cleanKeywords };
}

// Generate JSON-LD structured data for AEO
function generateArticleSchema(article: any, aeoData: ReturnType<typeof extractAEOData>) {
  try {
    // Use the advanced MedicalWebPage schema from our AEO library
    // This includes critical fields for Trust, E-E-A-T, and Voice Search
    const articleSchema = generateMedicalWebPageSchema({
      ...article,
      // Ensure these fields align with what generateMedicalWebPageSchema expects
      one_liner: article.one_liner || article.meta_description,
      age_range: article.age_range,
      region: article.region,
      // Use AEO-extracted keywords
      keywords: aeoData.cleanKeywords,
      // Pass citation data as empty array if missing (schema generator handles it)
      citations: article.citations || []
    });

    // FAQ Schema (Critical for AI search engines)
    const faqSchema = aeoData.faqs.length > 0 ? {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: aeoData.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    } : null;

    // HowTo Schema (if steps exist)
    const howToSchema = aeoData.steps.length > 0 ? {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: article.title,
      description: article.one_liner,
      step: aeoData.steps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.title,
        text: step.description,
      })),
    } : null;

    // BreadcrumbList Schema
    const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.momaiagent.com').replace(/\/$/, '');
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: baseUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Insights',
          item: `${baseUrl}/insight`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: article.title,
          item: `${baseUrl}/insight/${article.slug}`,
        },
      ],
    };

    return { articleSchema, faqSchema, howToSchema, breadcrumbSchema };
  } catch (error) {
    console.error('Error generating schema:', error);
    // Return empty/minimal schemas to prevent page crash
    return {
      articleSchema: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.one_liner || article.meta_description,
      },
      faqSchema: null,
      howToSchema: null,
      breadcrumbSchema: null
    };
  }
}

export async function generateStaticParams() {
  const articles = await getInsightSlugs();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getInsightBySlug(params.slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${article.title} | Insights | Mom AI Agent`,
    description: article.meta_description || article.one_liner,
    keywords: extractAEOData(article.keywords || []).cleanKeywords,
    openGraph: {
      title: article.title,
      description: article.meta_description || article.one_liner,
      type: 'article',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.momaiagent.com'}/insight/${params.slug}`,
      publishedTime: article.date_published,
      modifiedTime: article.date_modified,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.momaiagent.com'}/insight/${params.slug}`,
    },
  };
}

export const revalidate = 300; // Revalidate every 5 minutes (fallback if revalidation API fails)

const getInsightSlugs = unstable_cache(
  async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Allow both AI generated and Medical Board reviewed articles
    const { data: articles } = await supabase
      .from('articles')
      .select('slug')
      .in('reviewed_by', ['AI Content Generator', 'Medical Review Board'])
      .eq('status', 'published')
      .limit(100);

    return articles || [];
  },
  ['insights-slugs'],
  { tags: ['insights'], revalidate: 300 }
);

const getInsightBySlug = unstable_cache(
  async (slug: string) => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Allow both AI generated and Medical Board reviewed articles
    const { data: article } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .in('reviewed_by', ['AI Content Generator', 'Medical Review Board'])
      .eq('status', 'published')
      .single();

    return article || null;
  },
  ['insight-by-slug'],
  { tags: ['insights'], revalidate: 300 }
);

const getRelatedInsights = unstable_cache(
  async (hub: string, excludeId: string) => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: relatedArticles } = await supabase
      .from('articles')
      .select('*')
      .in('reviewed_by', ['AI Content Generator', 'Medical Review Board'])
      .eq('status', 'published')
      .neq('id', excludeId)
      .eq('hub', hub)
      .order('created_at', { ascending: false })
      .limit(6);

    return relatedArticles || [];
  },
  ['insights-related'],
  { tags: ['insights'], revalidate: 300 }
);

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

// Related Articles Component
async function RelatedArticlesSection({ currentArticle }: { currentArticle: any }) {
  const currentKeywords = filterCleanKeywords(currentArticle.keywords || []);

  // Find related articles by hub and keywords
  const relatedArticles = await getRelatedInsights(currentArticle.hub, currentArticle.id);

  if (!relatedArticles || relatedArticles.length === 0) {
    return null;
  }

  // Score articles by keyword overlap
  const scoredArticles = relatedArticles.map((article: any) => {
    const articleKeywords = filterCleanKeywords(article.keywords || []);
    const keywordOverlap = currentKeywords.filter((k: string) =>
      articleKeywords.some((ak: string) => ak.toLowerCase() === k.toLowerCase())
    ).length;
    return { article, score: keywordOverlap };
  });

  // Sort by score and take top 3
  const topRelated = scoredArticles
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.article);

  if (topRelated.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-light text-slate-700 mb-6 flex items-center gap-3">
        <svg className="w-6 h-6 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        Related Insights
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topRelated.map((related: any) => (
          <Link
            key={related.id}
            href={`/insight/${related.slug}`}
            className="group premium-card flex flex-col"
            aria-label={`Read insight: ${related.title}`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-semibold ${getHubColor(related.hub)}`}>
                {getHubName(related.hub)}
              </span>
            </div>
            <h3 className="text-lg font-light text-slate-700 mb-2 group-hover:text-slate-900 transition-colors line-clamp-2">
              {related.title}
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
              {related.one_liner || related.meta_description}
            </p>
            <span className="inline-flex items-center gap-2 text-xs text-slate-400 group-hover:text-violet-500 transition-colors mt-auto">
              Read more
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function InsightArticlePage({ params }: { params: { slug: string } }) {
  const article = await getInsightBySlug(params.slug);

  if (!article) {
    notFound();
  }

  // Extract AEO data from keywords
  const aeoData = extractAEOData(article.keywords || []);

  // Generate JSON-LD schemas
  const schemas = generateArticleSchema(article, aeoData);

  return (
    <div className="min-h-screen bg-gradient-elegant">
      {/* JSON-LD Structured Data for AEO */}
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.articleSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumbSchema) }}
      />
      {schemas.faqSchema && (
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faqSchema) }}
        />
      )}
      {schemas.howToSchema && (
        <Script
          id="howto-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.howToSchema) }}
        />
      )}

      {/* Header with Breadcrumb */}
      <div className="bg-white/80 border-b border-slate-200/70 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center text-sm text-slate-500 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-slate-700">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/insight" className="hover:text-slate-700">Insights</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-400 truncate max-w-xs">{article.title}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold ${getHubColor(article.hub)}`}>
              {getHubName(article.hub)}
            </span>
            {article.age_range && (
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Age {article.age_range}
              </span>
            )}
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Evidence-based
            </span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12" itemScope itemType="https://schema.org/Article">
        {/* Title */}
        <header className="mb-10">
          <p className="uppercase tracking-[0.4em] text-xs text-slate-400 mb-4">Insight</p>
          <h1 className="text-4xl md:text-5xl font-light text-slate-700 mb-4" itemProp="headline">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6">
            <span>Published {formatDate(article.date_published)}</span>
            {article.date_modified && (
              <span>Updated {formatDate(article.date_modified)}</span>
            )}
          </div>

          {/* Quick Answer Box - AEO Critical Section */}
          {aeoData.quickAnswer && (
            <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-violet-800 uppercase tracking-wider mb-2">Quick Answer</h2>
                  <p className="text-slate-700 leading-relaxed" itemProp="description">
                    {aeoData.quickAnswer}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* One-liner */}
          {article.one_liner && !aeoData.quickAnswer && (
            <p className="text-lg text-slate-600 leading-relaxed mb-6" itemProp="description">
              {article.one_liner}
            </p>
          )}

          {/* Key Facts / Key Takeaways */}
          {article.key_facts && Array.isArray(article.key_facts) && article.key_facts.length > 0 && (
            <div className="bg-white/80 border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-medium text-slate-700 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Key Takeaways
              </h2>
              <ul className="space-y-3 text-slate-600">
                {article.key_facts.filter((f: string) => !f.startsWith('__AEO')).map((fact: string, idx: number) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-3 mt-1.5 w-1.5 h-1.5 bg-emerald-400 rounded-full flex-shrink-0"></span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </header>

        {/* Article Body */}
        <div className="prose prose-slate lg:prose-lg max-w-none mb-12" itemProp="articleBody">
          {article.body_md ? (
            <div
              dangerouslySetInnerHTML={{ __html: article.body_md }}
            />
          ) : (
            <p className="text-slate-500">Content coming soon...</p>
          )}
        </div>

        {/* FAQ Section - AEO Critical */}
        {aeoData.faqs.length > 0 && (
          <section className="mb-12" itemScope itemType="https://schema.org/FAQPage">
            <h2 className="text-2xl font-light text-slate-700 mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {aeoData.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white/80 border border-slate-200 rounded-xl p-5 shadow-sm"
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <h3 className="text-lg font-medium text-slate-700 mb-2" itemProp="name">
                    {faq.question}
                  </h3>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-slate-600 leading-relaxed" itemProp="text">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Steps Section - HowTo Schema */}
        {aeoData.steps.length > 0 && (
          <section className="mb-12" itemScope itemType="https://schema.org/HowTo">
            <h2 className="text-2xl font-light text-slate-700 mb-6 flex items-center gap-3" itemProp="name">
              <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Step-by-Step Guide
            </h2>
            <div className="space-y-4">
              {aeoData.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 bg-white/80 border border-slate-200 rounded-xl p-5 shadow-sm"
                  itemScope
                  itemProp="step"
                  itemType="https://schema.org/HowToStep"
                >
                  <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold text-sm">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="font-medium text-slate-700 mb-1" itemProp="name">{step.title}</h3>
                    <p className="text-slate-600 text-sm" itemProp="text">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Keywords Section - AEO Enhancement */}
        {aeoData.cleanKeywords.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-light text-slate-700 mb-4 flex items-center gap-3">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Related Topics
            </h2>
            <div className="flex flex-wrap gap-2">
              {aeoData.cleanKeywords.map((keyword: string, idx: number) => (
                <Link
                  key={idx}
                  href={`/insight?keyword=${encodeURIComponent(keyword)}`}
                  className="px-4 py-2 bg-white/80 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-700 transition-colors"
                  aria-label={`Filter insights by topic: ${keyword}`}
                >
                  {keyword}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related Articles - Based on Keywords and Hub */}
        <RelatedArticlesSection currentArticle={article} />

        {/* Social Share & Citation */}
        <div className="mt-12 space-y-6">
          <SocialShare
            url={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.momaiagent.com'}/insight/${article.slug}`}
            title={article.title}
            description={article.one_liner || article.meta_description}
          />

          <CitationBox
            title={article.title}
            url={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.momaiagent.com'}/insight/${article.slug}`}
            lastReviewed={article.date_modified || article.date_published}
            siteName="Mom AI Agent"
          />
        </div>

        {/* Sources and Trust Signals */}
        <div className="grid gap-6 md:grid-cols-2 mt-12">
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-[0.25em] mb-2">
              Evidence Sources
            </h3>
            <p className="text-sm text-slate-500 mb-3">
              This insight is informed by guidelines from trusted health organizations.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">AAP</span>
              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">CDC</span>
              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">WHO</span>
            </div>
            <Link
              href="/topics"
              className="inline-flex items-center text-sm text-violet-500 hover:text-violet-600"
              aria-label="Explore parenting topics and guidelines"
            >
              Explore Topics →
            </Link>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-[0.25em] mb-2">
              Medical Disclaimer
            </h3>
            <p className="text-sm text-slate-500">
              This content is educational and does not replace professional medical advice. Always consult your pediatrician for personal health concerns.
            </p>
            <Link
              href="/trust"
              className="inline-flex items-center mt-4 text-sm text-violet-500 hover:text-violet-600"
              aria-label="Learn about our methods and sources"
            >
              Methods and sources →
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
