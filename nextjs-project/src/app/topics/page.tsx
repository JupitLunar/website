import React from 'react';
import Link from 'next/link';
import { knowledgeBase } from '@/lib/supabase';
import type { KnowledgeSource } from '@/types/content';

const TOPIC_CARDS = [
  {
    slug: 'north-america-overview',
    title: 'North America Overview',
    blurb: 'TLDR, age matrix, safety guardrails, and micronutrient quick reference for 0-24 months.',
    focus: 'Executive summary',
  },
  {
    slug: 'feeding-foundations',
    title: 'Feeding Foundations',
    blurb: 'Readiness cues, texture progression, and bottle-to-cup transitions for 0-18 months.',
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
    blurb: 'Cold chain, choking prevention, and kitchen hygiene guardrails for families and caregivers.',
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
    blurb: 'Pumping on the go, cooler protocols, and childcare handoff checklists.',
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
const DATE_FORMAT = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });

export const metadata = {
  title: 'Topics Library | Mom AI Agent',
  description:
    'Browse evidence-led playbooks and the public health sources that power the Mom AI Agent knowledge base.',
};

function formatSourceDate(value: string | null | undefined) {
  if (!value) return 'Not listed';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return DATE_FORMAT.format(parsed);
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

  return (
    <div className="min-h-screen bg-gradient-elegant">
      <section className="relative overflow-hidden py-16 px-4 sm:px-8">
        <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-gradient-to-br from-violet-100/40 to-purple-100/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-gradient-to-br from-slate-100/70 to-violet-100/10 blur-3xl"></div>
        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <p className="uppercase tracking-[0.4em] text-xs text-slate-400 mb-4">Topics Library</p>
          <h1 className="text-4xl md:text-5xl font-light text-slate-700 mb-4">
            Evidence-led playbooks for feeding, safety, and development
          </h1>
          <p className="text-lg text-slate-500 max-w-3xl mx-auto font-light">
            Structured summaries, protocols, and guardrails grounded in public health guidance and peer-reviewed evidence.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="px-4 py-2 rounded-full bg-white/80 border border-slate-200 text-[11px] uppercase tracking-[0.25em] text-slate-400">
              {updatedLabel}
            </span>
            <span className="px-4 py-2 rounded-full bg-white/80 border border-slate-200 text-[11px] uppercase tracking-[0.25em] text-slate-400">
              Sources graded A-D
            </span>
            <Link
              href="/trust"
              className="px-4 py-2 rounded-full bg-white/80 border border-slate-200 text-[11px] uppercase tracking-[0.25em] text-slate-500 hover:text-violet-500 transition-colors"
            >
              Methods and sources
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 pb-16 sm:px-6 lg:px-8">
        <section className="space-y-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="uppercase tracking-[0.3em] text-xs text-slate-400">Library Overview</p>
              <h2 className="text-3xl font-light text-slate-700">Topics</h2>
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{updatedLabel}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {TOPIC_CARDS.map((topic) => (
              <Link
                key={topic.slug}
                href={`/topics/${topic.slug}`}
                className="group premium-card flex flex-col gap-4"
              >
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-slate-400">
                  {topic.focus}
                </span>
                <div className="space-y-3">
                  <h3 className="text-2xl font-light text-slate-700 group-hover:text-slate-900">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-slate-500">{topic.blurb}</p>
                </div>
                <span className="inline-flex items-center gap-2 text-sm text-violet-500">
                  Explore topic
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <header className="space-y-2">
            <p className="uppercase tracking-[0.3em] text-xs text-slate-400">Evidence Registry</p>
            <h2 className="text-3xl font-light text-slate-700">Source registry</h2>
            <p className="text-sm text-slate-500">
              Direct links to the guidelines, advisories, and trials referenced across rules, foods, and guides.
            </p>
          </header>
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/80 shadow-sm">
            <table className="min-w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-xs uppercase tracking-[0.2em] text-slate-400">
                <tr>
                  <th className="px-4 py-4">Source</th>
                  <th className="px-4 py-4">Organization</th>
                  <th className="px-4 py-4">Grade</th>
                  <th className="px-4 py-4">Latest review</th>
                </tr>
              </thead>
              <tbody>
                {sortedSources.map((source) => (
                  <tr key={source.id} className="border-t border-slate-100">
                    <td className="px-4 py-4">
                      <a
                        href={source.url}
                        className="text-violet-500 underline-offset-2 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {source.name}
                      </a>
                    </td>
                    <td className="px-4 py-4">{source.organization || 'Unknown'}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {source.grade}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-400">{formatSourceDate(source.retrieved_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm space-y-3">
          <p className="uppercase tracking-[0.3em] text-xs text-slate-400">Contribute</p>
          <h2 className="text-2xl font-light text-slate-700">Contribute and review</h2>
          <p className="text-sm text-slate-500">
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
