import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import LatestArticlesTable from '@/components/LatestArticlesTable';
import { ArticleItemList } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Latest Baby Care & Parenting Articles | Updated Daily',
  description: 'Discover the most recent evidence-based articles on baby feeding, sleep, development, and parenting from top health organizations. Updated daily with expert advice for new parents.',
  keywords: [
    'latest baby articles',
    'recent parenting advice',
    'new baby care tips',
    'updated infant nutrition',
    'recent baby sleep guidance',
    'latest breastfeeding information',
    'new parenting research',
    'baby development updates',
    'recent pediatric advice',
    'latest mom tips'
  ],
  openGraph: {
    title: 'Latest Baby & Parenting Articles - Updated Daily',
    description: 'Stay informed with the latest evidence-based baby care articles from AAP, Mayo Clinic, WHO, and more.',
    type: 'website',
    url: 'https://jupitlunar.com/latest-articles',
    images: [
      {
        url: '/og-latest-articles.jpg',
        width: 1200,
        height: 630,
        alt: 'Latest Baby Care Articles'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Latest Baby & Parenting Articles',
    description: 'Daily updates on baby care, feeding, sleep, and development from trusted sources.',
    images: ['/og-latest-articles.jpg']
  },
  alternates: {
    canonical: 'https://jupitlunar.com/latest-articles'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};

export const revalidate = 3600; // Revalidate every hour

async function getLatestArticles() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: articles, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching articles:', error);
    return [];
  }

  return articles || [];
}

export default async function LatestArticlesPage() {
  const articles = await getLatestArticles();
  const lastUpdated = new Date().toISOString();

  // 按地区分组
  const articlesByRegion = articles.reduce((acc, article) => {
    const region = article.region || 'Other';
    if (!acc[region]) acc[region] = [];
    acc[region].push(article);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <>
      {/* 结构化数据 - ItemList for AEO */}
      <ArticleItemList
        items={articles.slice(0, 50).map((article, index) => ({
          position: index + 1,
          name: article.title,
          url: `https://jupitlunar.com/articles/${article.slug}`,
          description: article.one_liner || article.meta_description
        }))}
      />

      {/* JSON-LD for Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Latest Baby Care & Parenting Articles',
            description: 'Comprehensive collection of the latest evidence-based baby care articles',
            url: 'https://jupitlunar.com/latest-articles',
            dateModified: lastUpdated,
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: articles.slice(0, 50).map((article, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'Article',
                  headline: article.title,
                  url: `https://jupitlunar.com/articles/${article.slug}`,
                  description: article.one_liner,
                  datePublished: article.created_at,
                  author: {
                    '@type': 'Organization',
                    name: article.reviewed_by || 'Medical Experts'
                  }
                }
              }))
            },
            provider: {
              '@type': 'Organization',
              name: 'JupitLunar',
              url: 'https://jupitlunar.com'
            }
          })
        }}
      />

      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Latest Baby Care & Parenting Articles
            </h1>
            <p className="text-xl md:text-2xl mb-6 text-purple-100">
              Evidence-based advice from AAP, Mayo Clinic, WHO, and more
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="bg-white/20 rounded-full px-4 py-2">
                📊 {articles.length} Articles
              </div>
              <div className="bg-white/20 rounded-full px-4 py-2">
                🌍 {Object.keys(articlesByRegion).length} Regions
              </div>
              <div className="bg-white/20 rounded-full px-4 py-2">
                🔄 Updated Daily
              </div>
              <div className="bg-white/20 rounded-full px-4 py-2">
                ✅ Verified Sources
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl font-bold text-purple-600">
                {articles.length}
              </div>
              <div className="text-gray-600">Total Articles</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600">
                {articles.filter(a => a.region === 'US').length}
              </div>
              <div className="text-gray-600">US Sources</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl font-bold text-pink-600">
                {articles.filter(a => a.region === 'Global').length}
              </div>
              <div className="text-gray-600">Global Sources</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl font-bold text-green-600">
                {new Date().toLocaleDateString()}
              </div>
              <div className="text-gray-600">Last Updated</div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Browse by Topic</h2>
            <div className="flex flex-wrap gap-2">
              {['Feeding', 'Sleep', 'Development', 'Health', 'Safety', 'Nutrition'].map(topic => (
                <a
                  key={topic}
                  href={`#${topic.toLowerCase()}`}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-2 rounded-full transition-colors"
                >
                  {topic}
                </a>
              ))}
            </div>
          </div>

          {/* Main Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">All Articles</h2>
              <p className="text-gray-600 mt-2">
                Comprehensive database of baby care articles from trusted sources worldwide
              </p>
            </div>
            <LatestArticlesTable articles={articles} />
          </div>

          {/* By Region Section */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6">Articles by Region</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(articlesByRegion)
                .sort((a: [string, any], b: [string, any]) => b[1].length - a[1].length)
                .map(([region, regionArticles]: [string, any]) => (
                  <div key={region} className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                      <span className="text-2xl">
                        {region === 'US' ? '🇺🇸' :
                         region === 'UK' ? '🇬🇧' :
                         region === 'CA' ? '🇨🇦' :
                         region === 'AU' ? '🇦🇺' :
                         region === 'Global' ? '🌍' : '🌐'}
                      </span>
                      {region}
                    </h3>
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {regionArticles.length}
                    </div>
                    <div className="text-gray-600 text-sm">
                      articles available
                    </div>
                    <a
                      href={`#region-${region}`}
                      className="mt-4 inline-block text-purple-600 hover:text-purple-800 font-medium"
                    >
                      View articles →
                    </a>
                  </div>
                ))}
            </div>
          </div>

          {/* FAQ Section for AEO */}
          <div className="mt-12 bg-white rounded-lg shadow p-8">
            <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div itemScope itemType="https://schema.org/Question">
                <h3 className="text-xl font-semibold mb-2" itemProp="name">
                  How often are articles updated?
                </h3>
                <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  <p className="text-gray-700" itemProp="text">
                    Our database is updated daily with new articles from trusted sources like AAP,
                    Mayo Clinic, WHO, and other authoritative health organizations. We continuously
                    monitor and add the latest evidence-based information on baby care.
                  </p>
                </div>
              </div>

              <div itemScope itemType="https://schema.org/Question">
                <h3 className="text-xl font-semibold mb-2" itemProp="name">
                  What sources do you use?
                </h3>
                <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  <p className="text-gray-700" itemProp="text">
                    We source articles from 18+ authoritative organizations including the American
                    Academy of Pediatrics (AAP), Mayo Clinic, World Health Organization (WHO),
                    NHS (UK), Health Canada, and other Grade-A medical institutions across 8 regions.
                  </p>
                </div>
              </div>

              <div itemScope itemType="https://schema.org/Question">
                <h3 className="text-xl font-semibold mb-2" itemProp="name">
                  Are these articles medically reviewed?
                </h3>
                <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  <p className="text-gray-700" itemProp="text">
                    Yes! All articles come from peer-reviewed medical organizations and are written
                    or reviewed by qualified healthcare professionals, pediatricians, and maternal
                    health experts.
                  </p>
                </div>
              </div>

              <div itemScope itemType="https://schema.org/Question">
                <h3 className="text-xl font-semibold mb-2" itemProp="name">
                  Can I search for specific topics?
                </h3>
                <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  <p className="text-gray-700" itemProp="text">
                    Yes! Use the table's search and filter functions to find articles on specific
                    topics like feeding, sleep, development, or filter by region and source.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Stay Updated with Daily Insights
            </h2>
            <p className="text-xl mb-6">
              Get the latest evidence-based baby care advice delivered to your inbox
            </p>
            <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Subscribe for Updates
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
