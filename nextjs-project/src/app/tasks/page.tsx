import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Task Archive | DearBaby Internal',
  description: 'Internal task archive for DearBaby by JupitLunar.',
  robots: {
    index: false,
    follow: true,
  },
};

interface TaskRecord {
  id: string;
  title: string;
  completedAt: string;
  owners: string[];
  summary: string;
  outcomes: string[];
  followUps: { label: string; due?: string }[];
  evidence: string[];
}

const TASK_ARCHIVE: TaskRecord[] = [
  {
    id: 'KB-2024-03-02',
    title: 'North America Infant & Toddler Feeding Knowledge Base Refresh',
    completedAt: '2024-03-02',
    owners: ['JupitLunar Research Team'],
    summary:
      'Curated 25+ guideline-grade sources (CDC, WHO, CPS, NIH) and launched nutrient, travel/daycare, and holiday planning modules with provisional reviewer tags.',
    outcomes: [
      'Knowledge base seed validated (14 rules / 9 foods / 15 guides) and exported to NDJSON for downstream embedding pipelines.',
      'Source registry expanded with WHO complementary feeding, CPS iron and vitamin D statements, ODS calcium fact sheet, and TSA breast milk storage guidance.',
      'New topic routes (`/topics/nutrient-priorities`, `/topics/travel-daycare`, `/topics/holiday-planning`) delivered with automated source resolution.',
    ],
    followUps: [
      { label: 'Onboard external dietitian reviewer for nutrient modules', due: '2024-03-15' },
      { label: 'Schedule export automation (nightly quick check + weekly full refresh)' },
    ],
    evidence: [
      'docs/source-inventory.md',
      'supabase/seed/knowledge_base.json',
      'exports/kb-knowledge.ndjson',
    ],
  },
  {
    id: 'TRUST-2024-03-02',
    title: 'Trust Center & Reviewer Transparency Roll-out',
    completedAt: '2024-03-02',
    owners: ['JupitLunar Research Team'],
    summary:
      'Published Trust Center with reviewer roster, source grade mix, review lifecycle, and reviewer checklist to strengthen transparency.',
    outcomes: [
      'Review status badges now derive structured metadata (draft / provisional / clinically reviewed) with credential call-outs.',
      'Reviewer roster page (`/trust/reviewers`) launched; footer and review cards link directly to the list.',
      'Hero experience reworked to highlight evidence-led mission and direct pathways to `/topics` and `/trust`.',
    ],
    followUps: [
      { label: 'Recruit external pediatric dietitian and update roster status', due: '2024-03-30' },
      { label: 'Instrument review status metrics via Supabase audit log' },
    ],
    evidence: [
      'src/app/trust/page.tsx',
      'src/app/trust/reviewers/page.tsx',
      'src/components/kb/ReviewMeta.tsx',
    ],
  },
  {
    id: 'UX-2024-03-01',
    title: 'Homepage Authority Refresh',
    completedAt: '2024-03-01',
    owners: ['Design Ops', 'Research'],
    summary:
      'Updated homepage hero with evidence messaging, waitlist capture, and trust highlight banner to balance warmth with clinical authority.',
    outcomes: [
      'Restored photographic hero aesthetic with dark overlay, while adding CTA pair (“Browse knowledge base”, “View transparency & review”).',
      'Reintroduced waitlist form linked to research-team onboarding, collecting clinician/patient interest.',
      'Trust highlight strip surfaces source counts, module coverage, and review cadence at-a-glance.',
    ],
    followUps: [
      { label: 'Wire personalization module referencing child age cohorts' },
      { label: 'Integrate Supabase waitlist endpoint for immediate storage', due: '2024-03-10' },
    ],
    evidence: [
      'src/app/page.tsx',
      'src/components/layout/Footer.tsx',
    ],
  },
];

export const metadata = {
  title: 'Task Archive | JupitLunar',
  description:
    'Structured reports highlighting the outcomes, evidence, and next actions for each JupitLunar knowledge base iteration.',
};

function TaskCard({ record }: { record: TaskRecord }) {
  return (
    <article className="space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-emerald-700">Completed {record.completedAt}</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">{record.title}</h2>
          <p className="text-sm text-slate-500">Owners: {record.owners.join(', ')}</p>
        </div>
        <span className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase text-emerald-700">
          Report ID: {record.id}
        </span>
      </header>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-700">Executive summary</h3>
        <p className="text-sm leading-relaxed text-slate-600">{record.summary}</p>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-700">Key outcomes</h3>
        <ul className="space-y-2 text-sm text-slate-600">
          {record.outcomes.map((item, idx) => (
            <li key={idx} className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-700">Follow-up actions</h3>
        <ul className="space-y-2 text-sm text-slate-600">
          {record.followUps.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">
                {idx + 1}
              </span>
              <div>
                <p>{item.label}</p>
                {item.due && <p className="text-xs text-slate-400">Due {item.due}</p>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-700">Evidence & artefacts</h3>
        <ul className="flex flex-wrap gap-2 text-xs text-purple-700">
          {record.evidence.map((item) => (
            <li key={item}>
              <span className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-3 py-1">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

export default function TaskArchivePage() {
  return (
    <div className="bg-gradient-to-br from-[#F8F6FC] to-[#EAE6F8] py-16">
      <div className="mx-auto max-w-5xl space-y-12 px-4">
        <header className="space-y-4 text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-purple-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-purple-700">
            Task archive
          </span>
          <h1 className="text-4xl font-bold text-slate-900">Evidence of execution</h1>
          <p className="mx-auto max-w-3xl text-sm text-slate-600">
            Review structured reports for each knowledge base iteration, transparency release, and experience refresh. Every card
            captures key outcomes, outstanding follow-ups, and artefacts for compliance review.
          </p>
          <div className="flex justify-center gap-3 text-xs">
            <Link href="/topics" className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:border-emerald-200 hover:text-emerald-700">
              Open knowledge base
            </Link>
            <Link href="/trust" className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:border-purple-200 hover:text-purple-700">
              Visit trust center
            </Link>
          </div>
        </header>

        <div className="space-y-8">
          {TASK_ARCHIVE.map((record) => (
            <TaskCard key={record.id} record={record} />
          ))}
        </div>
      </div>
    </div>
  );
}
