import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found | Mom AI Agent',
  description: 'The page you are looking for does not exist. Return to our homepage or explore our parenting insights and guides.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F6FC] to-[#EAE6F8] flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
          </svg>
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
            aria-label="Return to homepage"
          >
            Go Home
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Or explore our content hubs:</p>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {['pregnancy-birth', 'newborn-care', 'infant-development', 'nutrition-feeding', 'health-safety', 'parenting-tips'].map((hub) => (
                <Link
                  key={hub}
                  href={`/hub/${hub}`}
                  className="px-3 py-1 bg-white text-purple-600 rounded-full text-xs hover:bg-purple-50 transition-colors"
                  aria-label={`Explore ${hub.replace('-', ' ')} content hub`}
                >
                  {hub.replace('-', ' ')}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
