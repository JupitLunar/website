'use client';

import React, { useState } from 'react';

interface CitationBoxProps {
  title: string;
  url: string;
  lastReviewed?: string;
  siteName?: string;
}

function formatDate(value?: string, format: 'full' | 'year' = 'full') {
  if (!value) {
    const today = new Date();
    return format === 'year'
      ? today.getFullYear().toString()
      : today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return format === 'year'
    ? date.getFullYear().toString()
    : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function CitationBox({
  title,
  url,
  lastReviewed,
  siteName = 'JupitLunar',
}: CitationBoxProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const year = formatDate(lastReviewed, 'year');
  const fullDate = formatDate(lastReviewed, 'full');
  const accessDate = formatDate(undefined, 'full');

  const citations = {
    apa: `${siteName}. (${year}). ${title}. Retrieved ${accessDate}, from ${url}`,
    mla: `"${title}." ${siteName}, ${year}, ${url}. Accessed ${accessDate}.`,
    chicago: `${siteName}. "${title}." Last modified ${fullDate}. ${url}.`,
    harvard: `${siteName} (${year}) ${title}. Available at: ${url} (Accessed: ${accessDate}).`,
  };

  const copyToClipboard = async (format: keyof typeof citations) => {
    try {
      await navigator.clipboard.writeText(citations[format]);
      setCopied(format);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <details className="border-2 border-slate-200 rounded-xl overflow-hidden bg-white">
      <summary className="cursor-pointer px-5 py-4 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 transition-colors">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span className="font-semibold text-slate-800">How to Cite This Page</span>
          <span className="text-xs text-slate-500 ml-auto">Click to expand</span>
        </div>
      </summary>

      <div className="p-5 space-y-4 bg-white">
        <p className="text-sm text-slate-600">
          If you reference this content in research or publications, please use one of the following
          citation formats:
        </p>

        {/* APA Format */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">APA 7th Edition</h4>
            <button
              onClick={() => copyToClipboard('apa')}
              className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors flex items-center gap-1.5"
            >
              {copied === 'apa' ? (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
          <code className="block bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-800 overflow-x-auto">
            {citations.apa}
          </code>
        </div>

        {/* MLA Format */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">MLA 9th Edition</h4>
            <button
              onClick={() => copyToClipboard('mla')}
              className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors flex items-center gap-1.5"
            >
              {copied === 'mla' ? (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
          <code className="block bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-800 overflow-x-auto">
            {citations.mla}
          </code>
        </div>

        {/* Chicago Format */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Chicago Style</h4>
            <button
              onClick={() => copyToClipboard('chicago')}
              className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors flex items-center gap-1.5"
            >
              {copied === 'chicago' ? (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
          <code className="block bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-800 overflow-x-auto">
            {citations.chicago}
          </code>
        </div>

        {/* Harvard Format */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Harvard Style</h4>
            <button
              onClick={() => copyToClipboard('harvard')}
              className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors flex items-center gap-1.5"
            >
              {copied === 'harvard' ? (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
          <code className="block bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-800 overflow-x-auto">
            {citations.harvard}
          </code>
        </div>

        {/* Footer Note */}
        <div className="pt-3 border-t border-slate-200 text-xs text-slate-500">
          <p>
            💡 <strong>Note:</strong> This content is curated from official health organization
            guidelines. For original source citations, see the "Sources" section above.
          </p>
        </div>
      </div>
    </details>
  );
}
