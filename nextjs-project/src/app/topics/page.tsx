import React from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { knowledgeBase } from '@/lib/supabase';
import type { KnowledgeSource } from '@/types/content';

const TOPIC_CARDS = [
  {
    slug: 'north-america-overview',
    title: 'North America Overview',
    blurb: 'TL;DR, age matrix, safety guardrails, and micronutrient quick reference for 0–24 months.',
    focus: 'Executive summary',
  },
  {
    slug: 'feeding-foundations',
    title: 'Feeding Foundations',
    blurb: 'Readiness cues, texture progression, and bottle-to-cup transitions for 0–18 months.',
    focus: 'Readiness & textures',
  },
  {
    slug: 'allergen-readiness',
    title: 'Allergen Readiness',
    blurb: 'Evidence-based allergen introduction plans with vitamin D support and exposure pacing.',
    focus: 'Allergen exposure',
  },
  {
    slug: 'safety-and-hygiene',
    title: 'Safety & Hygiene',
    blurb: 'Cold-chain, choking prevention, and kitchen hygiene guardrails for families and caregivers.',
    focus: 'Food safety',
  },
  {
    slug: 'nutrient-priorities',
    title: 'Nutrient Priorities',
    blurb: 'Daily iron rotation, vitamin D drops, and calcium spacing to protect growth.',
    focus: 'Micronutrients',
  },
  {
    slug: 'travel-daycare',
    title: 'Travel & Daycare Logistics',
    blurb: 'Pumping on the go, cooler protocols, and childcare hand-off checklists.',
    focus: 'Logistics',
  },
  {
    slug: 'holiday-planning',
    title: 'Holiday Planning',
    blurb: 'Holiday meals, allergen safeguards, and leftovers rules for gatherings.',
    focus: 'Seasonal strategy',
  },
];

const GRADE_ORDER: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };

export const metadata = {
  title: 'Knowledge Base Library | JupitLunar',
  description:
    'Browse every infant and toddler feeding topic plus the authoritative sources (CDC, CPS, WHO, NIH) that power the JupitLunar knowledge base.',
};

export default async function TopicsLibraryPage() {
  const sources = await knowledgeBase.getSources();
  const sortedSources = [...(sources as KnowledgeSource[])].sort((a, b) => {
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

  const updatedLabel = latestRetrieved
    ? new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: 'short', day: 'numeric' }).format(latestRetrieved)
    : 'Continuously updated';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'JupitLunar Knowledge Base Library',
    url: 'https://jupitlunar.com/topics',
    description: metadata.description,
    isPartOf: {
      '@type': 'WebSite',
      name: 'JupitLunar',
      url: 'https://jupitlunar.com',
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: TOPIC_CARDS.map((topic, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: topic.title,
        url: `https://jupitlunar.com/topics/${topic.slug}`,
        description: topic.blurb,
      })),
    },
    citation: sortedSources.slice(0, 12).map((source) => ({
      '@type': 'CreativeWork',
      name: source.name,
      url: source.url,
      dateModified: source.retrieved_at,
      publisher: source.organization,
    })),
  };

  return (
    <div className="bg-gradient-to-br from-[#F8F6FC] to-[#EAE6F8] py-16">
      <Script
        id="topics-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="mx-auto max-w-6xl space-y-16 px-4">
        <header className="space-y-4 text-center">
          <h1 className="text-4xl font-bold text-slate-900">Knowledge base library</h1>
          <p className="mx-auto max-w-3xl text-sm text-slate-600">
            Explore our structured playbooks, rules, and food forms. Every topic is grounded in public health guidance and
            peer-reviewed evidence. Use this library as the jumping-off point for parents, clinicians, and internal reviewers.
          </p>
        </header>

        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">Topics</h2>
            <p className="text-xs uppercase tracking-wide text-slate-500">Updated {updatedLabel}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {TOPIC_CARDS.map((topic) => (
              <Link
                key={topic.slug}
                href={`/topics/${topic.slug}`}
                className="group flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="space-y-3">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {topic.focus}
                  </span>
                  <h3 className="text-xl font-semibold text-slate-900 group-hover:text-purple-600">{topic.title}</h3>
                  <p className="text-sm text-slate-600">{topic.blurb}</p>
                </div>
                <span className="mt-4 text-sm font-semibold text-purple-600">View topic →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <header className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">Source registry</h2>
            <p className="text-sm text-slate-600">
              Direct links to the guidelines, advisories, and clinical trials we reference across rules, foods, and guides.
            </p>
          </header>
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Organization</th>
                  <th className="px-4 py-3">Grade</th>
                  <th className="px-4 py-3">Latest review</th>
                </tr>
              </thead>
              <tbody>
                {sortedSources.map((source) => (
                  <tr key={source.id} className="border-t border-slate-100">
                    <td className="px-4 py-3">
                      <a
                        href={source.url}
                        className="text-purple-600 underline-offset-2 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {source.name}
                      </a>
                    </td>
                    <td className="px-4 py-3">{source.organization}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{source.grade}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{source.retrieved_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Contribute & review</h2>
          <p className="text-sm text-slate-600">
            Ready to draft or audit new entries? Follow the authoring checklist in <code>docs/kb-guidelines.md</code>,
            record new references in <code>docs/source-inventory.md</code>, seed with <code>npm run seed:kb</code>, validate,
            then export with <code>npm run export:kb</code> for RAG ingestion. Provisional entries are flagged in
            <code>reviewed_by</code> until external reviewers sign off.
          </p>
        </section>
      </div>
    </div>
  );
}
