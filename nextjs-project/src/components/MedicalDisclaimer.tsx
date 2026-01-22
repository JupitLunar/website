import React from 'react';
import Link from 'next/link';

interface MedicalDisclaimerProps {
  lastReviewed?: string;
  nextReview?: string;
  sources?: Array<{ name: string; url: string }>;
  variant?: 'default' | 'compact' | 'banner';
}

function formatDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function MedicalDisclaimer({
  lastReviewed,
  nextReview,
  sources = [],
  variant = 'default',
}: MedicalDisclaimerProps) {
  if (variant === 'banner') {
    return (
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1 text-sm">
            <p className="font-semibold text-amber-800 mb-1">Official Guidelines Summary</p>
            <p className="text-amber-700">
              This summarizes CDC/AAP/Health Canada guidance. Always consult your pediatrician for
              personalized advice, especially if your child has allergies or medical conditions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="text-xs text-slate-600 bg-slate-50 rounded-lg p-3 border border-slate-200">
        <p className="font-semibold text-slate-800 mb-1">⚕️ Official Guidelines Summary</p>
        <p>
          Curated from CDC/AAP/Health Canada. Not personalized advice. Always consult your
          pediatrician for guidance specific to your child.
        </p>
        {lastReviewed && (
          <p className="mt-2 text-slate-500">
            Content verified: {formatDate(lastReviewed)}
          </p>
        )}
      </div>
    );
  }

  // Default variant - Full disclaimer
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-blue-900 mb-2">How to Use This Information</h3>
          <p className="text-sm text-blue-800 leading-relaxed">
            This content <strong>summarizes official health guidelines</strong> from CDC, American Academy
            of Pediatrics, and Health Canada. We organize their recommendations—we don't create our own.
            Official guidelines are general; your child's needs may differ.
          </p>
        </div>
      </div>

      {/* Important Points */}
      <div className="bg-white/60 rounded-lg p-4 space-y-2 text-sm text-blue-900">
        <p className="font-semibold mb-2">⚠️ Important:</p>
        <ul className="space-y-1.5 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 flex-shrink-0">•</span>
            <span>
              <strong>Always consult your pediatrician</strong> before introducing new foods,
              especially if your child has a history of allergies, medical conditions, or special
              dietary needs.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 flex-shrink-0">•</span>
            <span>
              <strong>Every child is different.</strong> Readiness for foods varies by individual
              development, not just age.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 flex-shrink-0">•</span>
            <span>
              <strong>In emergencies,</strong> call 911 or your local emergency number immediately.
            </span>
          </li>
        </ul>
      </div>

      {/* Source Info */}
      {(sources.length > 0 || lastReviewed) && (
        <div className="border-t border-blue-200 pt-4 space-y-2 text-xs text-blue-800">
          {sources.length > 0 && (
            <div>
              <p className="font-semibold mb-1">Based on guidelines from:</p>
              <ul className="space-y-0.5">
                {sources.slice(0, 2).map((source, index) => (
                  <li key={index}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:text-blue-900 underline"
                    >
                      {source.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-blue-700">
            {lastReviewed && (
              <span>
                <strong>Last Reviewed:</strong> {formatDate(lastReviewed)}
              </span>
            )}
            {nextReview && (
              <span>
                <strong>Next Review:</strong> {formatDate(nextReview)}
              </span>
            )}
            <Link href="/trust" className="underline hover:text-blue-900">
              Content Curation Methods
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
