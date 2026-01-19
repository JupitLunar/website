import React from 'react';
import Link from 'next/link';
import { knowledgeBase } from '@/lib/supabase';
import type { KnowledgeSource } from '@/types/content';

import MedicalDisclaimer from '@/components/MedicalDisclaimer';

const TOPIC_CARDS = [
  {
    slug: 'north-america-overview',
    title: 'North America Overview',
    blurb: 'Executive summary of critical health milestones, safety guardrails, and nutrient requirements for 0-24 months.',
    focus: 'Clinical Summary',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    slug: 'feeding-foundations',
    title: 'Feeding Foundations',
    blurb: 'Developmental readiness cues, texture progression protocols, and bottle-to-cup transition timelines.',
    focus: 'Pediatric Nutrition',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    slug: 'allergen-readiness',
    title: 'Allergen Introduction',
    blurb: 'Evidence-based protocols for early allergen exposure, including dosing schedules and safety monitoring.',
    focus: 'Immunology & Safety',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  {
    slug: 'safety-and-hygiene',
    title: 'Safety & Hygiene',
    blurb: 'Choking prevention guidelines, food safety standards, and hygiene protocols for caregivers.',
    focus: 'Prevention',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    slug: 'nutrient-priorities',
    title: 'Nutrient Priorities',
    blurb: 'Clinical requirements for iron, vitamin D, and calcium. Supplementation guidelines and absorption optimization.',
    focus: 'Micronutrients',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    slug: 'travel-daycare',
    title: 'Logistics: Travel & Care',
    blurb: 'Breastmilk storage protocols, safe transport guidelines, and caregiver handoff checklists.',
    focus: 'Logistics',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    slug: 'holiday-planning',
    title: 'Seasonal Strategy',
    blurb: 'Managing holiday meals, sodium limits, and cross-contamination risks during gatherings.',
    focus: 'Social Safety',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const GRADE_ORDER: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
const DATE_FORMAT = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.momaiagent.com').replace(/\/$/, '');

export const metadata = {
  title: 'Topics Library | Mom AI Agent',
  description:
    'Browse evidence-led playbooks and the public health sources that power the Mom AI Agent knowledge base.',
  keywords: ['parenting topics', 'feeding guidelines', 'infant safety', 'allergen introduction', 'CDC guidelines', 'AAP recommendations', 'Health Canada', 'evidence-based parenting'],
  openGraph: {
    title: 'Topics Library - Evidence-Based Parenting Playbooks',
    description: 'Browse evidence-led playbooks and the public health sources that power the Mom AI Agent knowledge base.',
    url: `${siteUrl}/topics`,
    type: 'website',
    images: [
      {
        url: `${siteUrl}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: 'Topics Library - Mom AI Agent',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Topics Library - Evidence-Based Parenting Playbooks',
    description: 'Browse evidence-led playbooks and the public health sources that power the Mom AI Agent knowledge base.',
    images: [`${siteUrl}/og-image.svg`],
  },
  alternates: {
    canonical: `${siteUrl}/topics`,
  },
};

function formatSourceDate(value: string | null | undefined) {
  if (!value) return 'Not listed';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return DATE_FORMAT.format(parsed);
}

function generateTopicsSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Topics Library",
    "description": "Evidence-led playbooks for feeding, safety, and development",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": TOPIC_CARDS.map((topic, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": topic.title,
        "description": topic.blurb,
        "url": `https://www.momaiagent.com/topics/${topic.slug}`
      }))
    }
  };
}

export default async function TopicsLibraryPage() {
  const sources = await knowledgeBase.getSources();
  const sourceList = Array.isArray(sources) ? (sources as KnowledgeSource[]) : [];
  const sortedSources = [...sourceList].sort((a, b) => {
    const gradeDiff = (GRADE_ORDER[a.grade] ?? 9) - (GRADE_ORDER[b.grade] ?? 9);
    if (gradeDiff !== 0) return gradeDiff;
    return a.name.localeCompare(b.name);
  });

  const latestRetrieved = sortedSources.reduce<Date | null>((latest, source) => {
    if (!source.retrieved_at) return latest;
    const date = new Date(source.retrieved_at);
    if (Number.isNaN(date.getTime())) return latest;
    if (!latest || date > latest) return date;
    return latest;
  }, null);

  const updatedLabel = latestRetrieved ? `Updated ${DATE_FORMAT.format(latestRetrieved)}` : 'Continuously updated';
  const structuredData = generateTopicsSchema();

  return (
    <div className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero / Header Section */}
      <header className="relative bg-white border-b border-slate-200">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/50 opacity-60"></div>
        <div className="container mx-auto max-w-6xl relative z-10 px-4 py-16 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-xs font-semibold tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                Evidence-Based Pediatric Guidelines
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                Clinical Playbooks for <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-teal-600">
                  Modern Parenting
                </span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                Synthesized protocols from the <strong>AAP</strong>, <strong>CDC</strong>, and <strong>Health Canada</strong>.
                Navigate feeding, safety, and development with grade-A medical consensus.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100/50 px-3 py-1.5 rounded-lg border border-slate-200/50">
                  <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  <span>Physician Consensus</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100/50 px-3 py-1.5 rounded-lg border border-slate-200/50">
                  <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  <span>Regularly Audited</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100/50 px-3 py-1.5 rounded-lg border border-slate-200/50">
                  <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  <span>Citation Backed</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block w-px h-40 bg-gradient-to-b from-transparent via-slate-200 to-transparent"></div>

            <div className="flex-1 max-w-sm bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                Database Status
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                  <span className="text-slate-500">Last Clinical Audit</span>
                  <span className="font-medium text-slate-700">{updatedLabel}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                  <span className="text-slate-500">Source Grade</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700">A - Excellent</span>
                </div>
                <div className="pt-1">
                  <Link href="/trust" className="text-blue-600 hover:text-blue-800 text-xs font-semibold flex items-center gap-1">
                    View Methodology
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-16 sm:px-6 lg:px-8">

        {/* Main Topics Grid */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Clinical Guidelines</h2>
              <p className="text-sm text-slate-500">Parenting protocols categorized by developmental stage and safety priority</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {TOPIC_CARDS.map((topic) => (
              <Link
                key={topic.slug}
                href={`/topics/${topic.slug}`}
                className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-blue-300"
              >
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-slate-50 text-slate-600 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    {topic.icon}
                  </div>
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-700">
                    {topic.focus}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{topic.blurb}</p>
                </div>

                <div className="mt-auto pt-4 flex items-center text-sm font-medium text-blue-600 opacity-0 transform translate-y-2 transition-all group-hover:opacity-100 group-hover:translate-y-0">
                  Access Protocol
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Evidence Registry */}
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-600 rounded-lg text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Source Registry</h2>
                <p className="text-sm text-slate-500">Official health guidelines referenced in our protocols</p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-slate-700">Source Reference</th>
                    <th className="px-6 py-4 font-semibold text-slate-700">Organization</th>
                    <th className="px-6 py-4 font-semibold text-slate-700">Evidence Grade</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 whitespace-nowrap">Last Reviewed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedSources.map((source) => (
                    <tr key={source.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <a
                          href={source.url}
                          className="font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1.5"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {source.name}
                          <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </a>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">{source.organization || 'Unknown'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border ${source.grade === 'A' ? 'bg-green-50 text-green-700 border-green-200' :
                            source.grade === 'B' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                          Grade {source.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-mono text-xs">{formatSourceDate(source.retrieved_at ?? null)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="pt-8">
          <MedicalDisclaimer variant="default" />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 mb-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Contributor Portal</h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            Are you a pediatrician or registered dietitian? Help us maintain the accuracy of our knowledge base.
            Access the authoring guidelines in <code>docs/kb-guidelines.md</code> or contact our editorial team.
          </p>
          <div className="pt-2">
            <a href="mailto:medical@momaiagent.com" className="text-sm font-semibold text-blue-600 hover:text-blue-800">Contact Editorial Board &rarr;</a>
          </div>
        </section>
      </div>
    </div>
  );
}
