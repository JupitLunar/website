import React from 'react';
import Link from 'next/link';
import Script from 'next/script';
import type { Metadata } from 'next';
import { knowledgeBase } from '@/lib/supabase';
import type { KnowledgeRule, KnowledgeGuide, KnowledgeFood, KnowledgeSource } from '@/types/content';

export const metadata: Metadata = {
  title: 'Trust Center',
  description:
    'See how the Mom AI Agent public evidence hub organizes source-linked guidance, review practices, and platform boundaries.',
  alternates: {
    canonical: '/trust',
  },
  openGraph: {
    title: 'Trust Center',
    description:
      'Source grading, review cadence, and platform boundaries behind the Mom AI Agent public evidence hub.',
    url: '/trust',
  },
  twitter: {
    title: 'Trust Center',
    description:
      'How source-linked guidance is reviewed, updated, and scoped across the Mom AI Agent public evidence hub.',
  },
};

function buildStructuredData({
  rules,
  guides,
  foods,
  sources,
}: {
  rules: KnowledgeRule[];
  guides: KnowledgeGuide[];
  foods: KnowledgeFood[];
  sources: KnowledgeSource[];
}) {
  const topSources = sources.slice(0, 10).map((source) => ({
    '@type': 'CreativeWork',
    name: source.name,
    url: source.url,
    dateModified: source.retrieved_at,
    publisher: source.organization,
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'HealthTopicContent',
    name: 'Mom AI Agent Trust Center',
    description:
      "Trust-center methodology and source practices behind Mom AI Agent's maternal and infant guidance platform.",
    inLanguage: 'en',
    audience: {
      '@type': 'PeopleAudience',
      name: 'Parents of infants and toddlers in North America',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Mom AI Agent',
      url: 'https://www.momaiagent.com',
    },
    about: [
      {
        '@type': 'Thing',
        name: 'Infant nutrition',
      },
      {
        '@type': 'Thing',
        name: 'Complementary feeding',
      },
    ],
    sourceOrganization: {
      '@type': 'GovernmentOrganization',
      name: 'CDC, AAP, Health Canada',
    },
    citation: topSources,
    mainEntity: {
      '@type': 'Dataset',
      name: 'Mom AI Agent Knowledge Base',
      description: 'Structured collection of maternal and infant guidance assembled from public-health and clinical reference sources.',
      measurementTechnique: 'Systematic aggregation and organization of official government and medical association guidelines',
      variableMeasured: ['Safety Rules', 'Feeding Guides', 'Food Preparation Briefs', 'Official Sources'],
      numberOfVariables: rules.length + guides.length + foods.length,
    },
  };
}

export default async function TrustCenterPage() {
  const [sources, rules, foods, guides] = await Promise.all([
    knowledgeBase.getSources(),
    knowledgeBase.getRules(),
    knowledgeBase.getFoods(),
    knowledgeBase.getGuides({ locale: 'Global' }),
  ]);

  const gradeTotals = (sources as KnowledgeSource[]).reduce<Record<string, number>>((acc, source) => {
    acc[source.grade] = (acc[source.grade] || 0) + 1;
    return acc;
  }, {});
  const totalSources = (sources as KnowledgeSource[]).length;
  const totalEvidenceObjects =
    (rules as KnowledgeRule[]).length +
    (foods as KnowledgeFood[]).length +
    (guides as KnowledgeGuide[]).length;
  const gradeABTotal = (gradeTotals.A || 0) + (gradeTotals.B || 0);
  const gradeABPercent = totalSources > 0 ? Math.round((gradeABTotal / totalSources) * 100) : 0;
  const mostRecentSourceDate = (sources as KnowledgeSource[])
    .map((source) => source.retrieved_at || source.updated_at || source.created_at)
    .filter(Boolean)
    .map((value) => new Date(value as string))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((a, b) => b.getTime() - a.getTime())[0];
  const refreshedIn180Days = (sources as KnowledgeSource[]).filter((source) => {
    const dateValue = source.retrieved_at || source.updated_at || source.created_at;
    if (!dateValue) return false;
    const timestamp = new Date(dateValue).getTime();
    if (Number.isNaN(timestamp)) return false;
    const daysAgo = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
    return daysAgo <= 180;
  }).length;
  const snapshotDateLabel = mostRecentSourceDate
    ? mostRecentSourceDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : 'Not available';

  const structuredData = buildStructuredData({
    rules: rules as KnowledgeRule[],
    guides: guides as KnowledgeGuide[],
    foods: foods as KnowledgeFood[],
    sources: sources as KnowledgeSource[],
  });

  const surfaceClass = 'rounded-3xl border border-slate-100 bg-white/90 backdrop-blur p-8 shadow-sm';
  const softCardClass = 'rounded-3xl border border-slate-100 bg-white/90 backdrop-blur p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md';
  const metricCardClass = 'rounded-2xl border border-slate-100 bg-slate-50/80 p-5';

  return (
    <div className="min-h-screen bg-gradient-elegant py-16">
      <Script
        id="trust-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="mx-auto max-w-6xl space-y-16 px-4 sm:px-8">
        <header className="space-y-6 text-center">
          <span className="inline-flex items-center justify-center rounded-full border border-slate-200/70 bg-gradient-to-r from-slate-50/90 to-violet-50/70 px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-500 shadow-sm">
            Trust Center
          </span>
          <h1 className="text-4xl md:text-5xl font-light text-slate-600">
            Evidence Intelligence Trust Center
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-slate-600 leading-relaxed">
            Mom AI Agent is not a medical provider. This page explains how we organize public-health and clinical reference
            material, how that guidance becomes visible website guidance, and where the platform&apos;s boundaries sit.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="rounded-full border border-slate-200 bg-white/85 px-4 py-2 shadow-sm">
              <span className="text-sm text-slate-600">Government Sources</span>
            </div>
            <div className="rounded-full border border-slate-200 bg-white/85 px-4 py-2 shadow-sm">
              <span className="text-sm text-slate-600">Peer-Reviewed Research</span>
            </div>
            <div className="rounded-full border border-slate-200 bg-white/85 px-4 py-2 shadow-sm">
              <span className="text-sm text-slate-600">Review Cycles</span>
            </div>
          </div>
        </header>

        <section className={`${surfaceClass} space-y-6`}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-2">Evidence Snapshot</p>
              <h2 className="text-2xl font-light text-slate-700">Operational trust metrics</h2>
              <p className="text-sm text-slate-600 mt-2">
                Snapshot date: {snapshotDateLabel}
              </p>
            </div>
            <Link
              href="/contact?type=general#contact-form"
              className="inline-flex rounded-full border border-slate-300 bg-white/80 px-5 py-2 text-sm text-slate-700 hover:border-slate-400"
            >
              Report citation issue
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className={metricCardClass}>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">Tracked sources</p>
              <p className="text-3xl font-semibold text-slate-900">{totalSources}</p>
              <p className="text-sm text-slate-600 mt-1">Public-health and clinical references</p>
            </div>
            <div className={metricCardClass}>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">Grade A/B ratio</p>
              <p className="text-3xl font-semibold text-slate-900">{gradeABPercent}%</p>
              <p className="text-sm text-slate-600 mt-1">{gradeABTotal} of {totalSources} sources</p>
            </div>
            <div className={metricCardClass}>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">Refreshed in 180 days</p>
              <p className="text-3xl font-semibold text-slate-900">{refreshedIn180Days}</p>
              <p className="text-sm text-slate-600 mt-1">Sources with recent retrieval/update dates</p>
            </div>
            <div className={metricCardClass}>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">Evidence objects</p>
              <p className="text-3xl font-semibold text-slate-900">{totalEvidenceObjects}</p>
              <p className="text-sm text-slate-600 mt-1">Rules, food briefs, and guides</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className={softCardClass}>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-3">What We Do</p>
            <h2 className="text-xl font-light text-slate-700 mb-3">Evidence organization and explainability</h2>
            <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside">
              <li>Track public-health and clinical references by source grade.</li>
              <li>Convert references into reusable objects (rules, guides, food records).</li>
              <li>Expose source lineage and update cadence in public trust pages.</li>
            </ul>
          </div>
          <div className={softCardClass}>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-3">What We Do Not Do</p>
            <h2 className="text-xl font-light text-slate-700 mb-3">No diagnosis or emergency triage</h2>
            <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside">
              <li>Mom AI Agent is educational and is not a medical provider.</li>
              <li>This platform does not replace clinician judgment or urgent care pathways.</li>
              <li>For individual symptoms or emergencies, families should contact licensed care teams.</li>
            </ul>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/methodology" className={softCardClass}>
            <span className="block text-xs uppercase tracking-[0.25em] text-slate-400 mb-3">Methodology</span>
            <h2 className="text-xl font-light text-slate-700 mb-3">How guidance is assembled</h2>
            <p className="text-sm text-slate-600 leading-relaxed">Review the operating method used to turn public guidance into structured answers, topic pages, and product workflows.</p>
          </Link>
          <Link href="/clinical-review-policy" className={softCardClass}>
            <span className="block text-xs uppercase tracking-[0.25em] text-slate-400 mb-3">Clinical review</span>
            <h2 className="text-xl font-light text-slate-700 mb-3">What is reviewed and what is not</h2>
            <p className="text-sm text-slate-600 leading-relaxed">See how high-risk topics are handled, what content remains educational, and where clinician judgment remains essential.</p>
          </Link>
          <Link href="/data-use-policy" className={softCardClass}>
            <span className="block text-xs uppercase tracking-[0.25em] text-slate-400 mb-3">Data use</span>
            <h2 className="text-xl font-light text-slate-700 mb-3">How website data is handled</h2>
            <p className="text-sm text-slate-600 leading-relaxed">Understand the platform's data boundary, where user inputs fit, and what this public site is not designed to store.</p>
          </Link>
          <Link href="/privacy" className={softCardClass}>
            <span className="block text-xs uppercase tracking-[0.25em] text-slate-400 mb-3">Data boundary</span>
            <h2 className="text-xl font-light text-slate-700 mb-3">Privacy notice for the public website</h2>
            <p className="text-sm text-slate-600 leading-relaxed">Privacy explains what the public website collects, how third-party services are used, and what this experience is not designed to store.</p>
          </Link>
          <Link href="/disclaimer" className={softCardClass}>
            <span className="block text-xs uppercase tracking-[0.25em] text-slate-400 mb-3">Use boundary</span>
            <h2 className="text-xl font-light text-slate-700 mb-3">What this platform should not replace</h2>
            <p className="text-sm text-slate-600 leading-relaxed">Disclaimer explains that Mom AI Agent is educational, source-linked, and not a substitute for diagnosis, treatment, or emergency care.</p>
          </Link>
          <Link href="/trust#sources" className={softCardClass}>
            <span className="block text-xs uppercase tracking-[0.25em] text-slate-400 mb-3">Source registry</span>
            <h2 className="text-xl font-light text-slate-700 mb-3">See the public source base</h2>
            <p className="text-sm text-slate-600 leading-relaxed">Open the registry of source organizations, grades, and review windows behind the platform's guidance objects.</p>
          </Link>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <div className={softCardClass}>
            <p className="text-3xl font-semibold text-slate-900">{(rules as KnowledgeRule[]).length}</p>
            <p className="text-sm text-slate-600">Safety & policy rules</p>
          </div>
          <div className={softCardClass}>
            <p className="text-3xl font-semibold text-slate-900">{(foods as KnowledgeFood[]).length}</p>
            <p className="text-sm text-slate-600">Food preparation briefs</p>
          </div>
          <div className={softCardClass}>
            <p className="text-3xl font-semibold text-slate-900">{(guides as KnowledgeGuide[]).length}</p>
            <p className="text-sm text-slate-600">Step-by-step guides</p>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <Link href="/insight" className={softCardClass}>
            <span className="block text-xs uppercase tracking-[0.25em] text-slate-400 mb-3">Insights</span>
            <h2 className="text-xl font-light text-slate-700 mb-3">See how source-backed explainers are packaged for parents</h2>
            <p className="text-sm text-slate-600 leading-relaxed">Move from trust and methods into practical parenting explainers and caregiver-oriented summaries.</p>
          </Link>
          <Link href="/foods" className={softCardClass}>
            <span className="block text-xs uppercase tracking-[0.25em] text-slate-400 mb-3">Food database</span>
            <h2 className="text-xl font-light text-slate-700 mb-3">Open the food-by-food database</h2>
            <p className="text-sm text-slate-600 leading-relaxed">Check how curated source material turns into cut sizes, textures, and age-specific feeding guidance.</p>
          </Link>
          <Link href="/search" className={softCardClass}>
            <span className="block text-xs uppercase tracking-[0.25em] text-slate-400 mb-3">Answer hub</span>
            <h2 className="text-xl font-light text-slate-700 mb-3">Move from trust into the answer hub</h2>
            <p className="text-sm text-slate-600 leading-relaxed">Use the same evidence framework to search caregiver questions, browse topic paths, and trace how answers are assembled.</p>
          </Link>
        </section>

        <section className={`${surfaceClass} space-y-6 bg-gradient-to-br from-slate-50/80 via-white to-violet-50/40`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-500 to-violet-400 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-light text-slate-700">Our Content Curation Process</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="rounded-2xl border border-slate-100 bg-white/90 p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-semibold text-sm">1</span>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Source Identification</h3>
                  <p className="text-sm text-slate-600">We monitor public-health authorities and related clinical references for updates relevant to maternal health, infant feeding, safety, development, and common caregiver questions.</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white/90 p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-semibold text-sm">2</span>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Source Grading</h3>
                  <p className="text-sm text-slate-600">Each source is graded A-D based on authority and relevance. Grade A and B material is prioritized for higher-stakes guidance and safety-critical content.</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white/90 p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-semibold text-sm">3</span>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Content Organization</h3>
                  <p className="text-sm text-slate-600">We structure the information into reusable formats such as food cards, safety rules, explainers, and product guidance while preserving source visibility.</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white/90 p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-semibold text-sm">4</span>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Regular Updates</h3>
                  <p className="text-sm text-slate-600">Sources are revisited on a recurring review cycle. When important guidance changes, the affected content is prioritized for review and revision.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={`${surfaceClass} space-y-6`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-light text-slate-700">Program Standards</h2>
          </div>
          <p className="text-sm text-slate-600">
            Our development and parent health pathways translate public health guidance into weekly plans. These
            pathways are educational and are not medical advice.
          </p>
          <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside">
            <li>Guidance is sourced from CDC, AAP, WHO, and national health authorities.</li>
            <li>Each week includes a red-flag checklist to encourage timely medical follow-up.</li>
            <li>We recommend professional care for diagnosis, treatment, or urgent concerns.</li>
            <li>Content is reviewed on a 12-month cycle or sooner when guidelines change.</li>
          </ul>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/programs/development"
              className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-500 hover:text-violet-500 transition-colors"
            >
              Baby development pathway
            </Link>
            <Link
              href="/programs/parent-health"
              className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-500 hover:text-violet-500 transition-colors"
            >
              Parent health pathway
            </Link>
          </div>
        </section>

        <section id="sources" className="grid gap-6 md:grid-cols-2">
          <div className={`${surfaceClass} space-y-4`}>
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h3 className="text-xl font-light text-slate-700">Source Quality Distribution</h3>
            </div>
            <div className="space-y-3">
              {(['A', 'B', 'C', 'D'] as const).map((grade) => {
                const count = gradeTotals[grade] || 0;
                const total = Object.values(gradeTotals).reduce((sum: number, val: number) => sum + val, 0);
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

                return (
                  <div key={grade} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-900">
                        Grade {grade}{' '}
                        <span className="text-xs text-slate-500 font-normal">
                          {grade === 'A'
                            ? '(CDC, AAP, Health Canada)'
                            : grade === 'B'
                            ? '(Peer-reviewed journals)'
                            : grade === 'C'
                            ? '(Expert publications)'
                            : '(Educational resources)'}
                        </span>
                      </span>
                      <span className="font-bold text-slate-900">{count}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          grade === 'A' ? 'bg-green-500' :
                          grade === 'B' ? 'bg-blue-500' :
                          grade === 'C' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-slate-500 mt-4 pt-4 border-t border-slate-200">
              We prioritize Grade A and B sources for safety-critical content and use recurring review windows instead of one-time publication.
            </p>
          </div>

          <div className={`${surfaceClass} space-y-4`}>
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-light text-slate-700">Content Update Cycle</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Recently reviewed</p>
                  <p className="text-xs text-slate-600">Content checked in the current review window</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Current review cycle</p>
                  <p className="text-xs text-slate-600">Content that remains within its normal maintenance window</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Queued for re-check</p>
                  <p className="text-xs text-slate-600">Content approaching its next review pass or awaiting source updates</p>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-700">
                <span className="font-semibold">Update Policy:</span> When major public-health organizations publish meaningful changes, related content is flagged for priority review.
              </p>
            </div>
          </div>
        </section>

        <section className={`${surfaceClass} space-y-6`}>
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h2 className="text-2xl font-light text-slate-700">Trusted Source Organizations</h2>
          </div>
          <p className="text-slate-700 leading-relaxed">
            Mom AI Agent organizes guidance from authoritative health organizations and related references.
            We do not replace clinician judgment or create diagnosis-oriented medical advice.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-blue-50/80 to-white p-4">
              <h3 className="font-semibold text-slate-800 mb-2">CDC</h3>
              <p className="text-sm text-slate-700">Centers for Disease Control and Prevention guidance for infant nutrition, sleep, and safety.</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-emerald-50/80 to-white p-4">
              <h3 className="font-semibold text-slate-800 mb-2">AAP</h3>
              <p className="text-sm text-slate-700">American Academy of Pediatrics recommendations used for pediatric care education paths.</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-rose-50/80 to-white p-4">
              <h3 className="font-semibold text-slate-800 mb-2">Health Canada</h3>
              <p className="text-sm text-slate-700">Canadian federal health guidance used for North America coverage and regional comparisons.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-sm mt-4">
            <Link href="#sources" className="rounded-full bg-gradient-to-r from-slate-500 to-violet-500 px-6 py-3 text-white shadow-sm transition-colors hover:from-slate-600 hover:to-violet-600">
              View source registry
            </Link>
            <a
              href="https://www.cdc.gov/nutrition/infantandtoddlernutrition"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-slate-200 bg-white/80 px-6 py-3 text-slate-700 hover:border-violet-200 hover:text-violet-600 transition-colors"
            >
              CDC Guidelines ↗
            </a>
            <a
              href="https://www.healthychildren.org"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-slate-200 bg-white/80 px-6 py-3 text-slate-700 hover:border-violet-200 hover:text-violet-600 transition-colors"
            >
              AAP Resources ↗
            </a>
            <a
              href="https://www.canada.ca/en/health-canada/services/food-nutrition/infant-feeding.html"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-slate-200 bg-white/80 px-6 py-3 text-slate-700 hover:border-violet-200 hover:text-violet-600 transition-colors"
            >
              Health Canada Resources ↗
            </a>
          </div>
        </section>

        <section className={`${surfaceClass} space-y-6 bg-gradient-to-br from-slate-50/80 via-white to-indigo-50/30`}>
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <h2 className="text-2xl font-light text-slate-700">Our Transparency Commitments</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Source lineage on core records</h3>
                <p className="text-sm text-slate-600">Rules, guides, and food records in the knowledge base retain source IDs and grade signals used in review workflows.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">No hidden expertise claims</h3>
                <p className="text-sm text-slate-600">We do not represent this platform as a medical practice. The value is organization and explainability of public guidance.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Review windows and priority re-checks</h3>
                <p className="text-sm text-slate-600">Content is reviewed on recurring cycles, and high-impact guideline changes trigger an earlier re-check queue.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Open correction channel</h3>
                <p className="text-sm text-slate-600">Users can report citation and wording issues through the contact workflow, with request-type routing for faster handling.</p>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-300">
            <p className="text-center text-sm text-slate-600 italic">
              <strong>Mission:</strong> Make evidence-informed guidance easier to access and audit while keeping role boundaries explicit.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
