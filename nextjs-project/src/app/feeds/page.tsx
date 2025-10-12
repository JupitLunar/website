import { Metadata } from 'next';
import Link from 'next/link';
// Using simple Unicode icons instead of lucide-react

export const metadata: Metadata = {
  title: 'Knowledge Base Feeds',
  description: 'Access structured data feeds for rules, foods, and guides from our evidence-based knowledge base.',
  keywords: ['knowledge base', 'feeds', 'API', 'rules', 'foods', 'guides', 'structured data'],
  openGraph: {
    title: 'Knowledge Base Feeds',
    description: 'Access structured data feeds for rules, foods, and guides from our evidence-based knowledge base.',
    type: 'website',
    url: 'https://www.momaiagent.com/feeds',
  },
  alternates: {
    canonical: '/feeds',
  },
};

const feedTypes = [
  {
    type: 'rules',
    title: 'Feeding Rules',
    description: 'Evidence-based feeding guidelines and safety rules for infants and toddlers',
    icon: '📚',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    count: '50+',
    examples: ['Safe feeding practices', 'Age-appropriate portions', 'Food safety guidelines'],
  },
  {
    type: 'foods',
    title: 'Food Database',
    description: 'Comprehensive information about foods suitable for different ages and feeding methods',
    icon: '🍽️',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    count: '200+',
    examples: ['Age recommendations', 'Nutritional benefits', 'Preparation methods'],
  },
  {
    type: 'guides',
    title: 'Parenting Guides',
    description: 'Step-by-step guides for common parenting challenges and milestones',
    icon: '📋',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    count: '30+',
    examples: ['Sleep training', 'Weaning process', 'Development milestones'],
  },
];

export default function FeedsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <span className="text-2xl">📡</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Knowledge Base Feeds
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access structured data feeds from our evidence-based knowledge base. 
            Each feed contains carefully curated information for developers, researchers, and parents.
          </p>
        </div>

        {/* Feed Types Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {feedTypes.map((feed) => {
            return (
              <Link
                key={feed.type}
                href={`/feeds/${feed.type}`}
                className="group block"
              >
                <div className={`${feed.bgColor} rounded-xl p-8 h-full transition-all duration-300 group-hover:shadow-lg group-hover:scale-105`}>
                  <div className="flex items-center mb-4">
                    <div className={`${feed.color} mr-3 text-3xl`}>
                      {feed.icon}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{feed.title}</h2>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feed.description}
                  </p>
                  
                  <div className="mb-6">
                    <div className="inline-flex items-center px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      {feed.count} items available
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Examples include:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {feed.examples.map((example, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* API Information */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">API Access</h2>
          <p className="text-gray-600 mb-6">
            All feeds are available as JSON APIs for programmatic access. 
            You can filter by locale (US, CA, Global) and limit the number of results.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-2">API Endpoints:</h3>
            <div className="space-y-2 text-sm font-mono">
              <div className="text-blue-600">
                GET /api/kb/feed?type=rules&locale=US&limit=50
              </div>
              <div className="text-green-600">
                GET /api/kb/feed?type=foods&locale=CA&limit=100
              </div>
              <div className="text-purple-600">
                GET /api/kb/feed?type=guides&locale=Global&limit=25
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Parameters:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li><code className="bg-gray-100 px-1 rounded">type</code> - rules, foods, or guides</li>
                <li><code className="bg-gray-100 px-1 rounded">locale</code> - US, CA, or Global</li>
                <li><code className="bg-gray-100 px-1 rounded">limit</code> - number of items (max 250)</li>
                <li><code className="bg-gray-100 px-1 rounded">format</code> - json or ndjson</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Response Format:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Structured JSON data</li>
                <li>• Includes source citations</li>
                <li>• Review dates and status</li>
                <li>• Age-appropriate information</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
