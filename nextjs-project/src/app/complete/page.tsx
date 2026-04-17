import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Verification Complete',
  description: 'Verification completed successfully. Return to the Mom AI Agent website or contact support if you need help.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CompletePage() {
  return (
    <>
      <Script
        id="hide-global-layout"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            if (typeof window !== 'undefined') {
              const style = document.createElement('style');
              style.textContent = [
                'body > header:first-of-type,',
                'body > main > header:first-of-type,',
                'nav[class*="Header"],',
                'header[class*="Header"] {',
                '  display: none !important;',
                '}',
                'body > footer:last-of-type,',
                'footer[class*="Footer"] {',
                '  display: none !important;',
                '}',
                'main {',
                '  padding-top: 0 !important;',
                '}'
              ].join('\\n');
              document.head.appendChild(style);
            }
          `,
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-6 py-16 text-slate-700">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-8 w-8"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>

            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              System Page
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">Verification complete</h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Your action was completed successfully. You can return to the Mom AI Agent website,
              open the answer hub, or contact support if anything looks wrong.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/search"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Open Answer Hub
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
              >
                Go to Home
              </Link>
              <Link
                href="/contact?type=support#contact-form"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
