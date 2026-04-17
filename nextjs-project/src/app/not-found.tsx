import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist. Return to our homepage or explore our parenting insights and guides.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  const quickLinks = [
    { label: 'Topics Library', href: '/topics' },
    { label: 'Insights', href: '/insight' },
    { label: 'Foods Database', href: '/foods' },
    { label: 'Trust Center', href: '/trust' },
  ];

  return (
    <div className="min-h-screen bg-gradient-elegant flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="w-24 h-24 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-12 h-12 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
          </svg>
        </div>
        
        <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-700 mb-4">Page Not Found</h2>
        <p className="text-slate-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-gradient-to-r from-slate-500 to-violet-500 text-white rounded-xl font-semibold hover:from-slate-600 hover:to-violet-600 transition-all duration-200"
            aria-label="Return to homepage"
          >
            Go Home
          </Link>
          
          <div className="text-sm text-slate-500">
            <p>Or continue with one of the main site paths:</p>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-3 py-1 bg-white text-violet-600 rounded-full text-xs hover:bg-violet-50 transition-colors"
                  aria-label={`Open ${link.label}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
