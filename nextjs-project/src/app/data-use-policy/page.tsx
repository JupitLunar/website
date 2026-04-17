import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Data Use Policy',
  description:
    'Understand how the Mom AI Agent public evidence hub treats website inputs, sensitive information, and data-use boundaries.',
  alternates: {
    canonical: '/data-use-policy',
  },
  openGraph: {
    title: 'Data Use Policy',
    description:
      'Data boundaries, website input handling, and platform-use posture for the Mom AI Agent public evidence hub.',
    url: '/data-use-policy',
  },
  twitter: {
    title: 'Data Use Policy',
    description:
      'How Mom AI Agent handles website inputs and data-use boundaries on the public evidence hub.',
  },
};

const dataPrinciples = [
  {
    title: 'Public site first',
    body: 'This website is designed as a public information and product-discovery surface. It should not be treated as a secure place to submit sensitive medical records or urgent personal health details.',
  },
  {
    title: 'Purpose-limited collection',
    body: 'When users submit email addresses, contact requests, or product-interest forms, the goal is support, updates, and follow-up communication rather than broad secondary reuse.',
  },
  {
    title: 'Platform learning with boundaries',
    body: 'Aggregated usage patterns can help improve answer pathways, content gaps, and product flows, but that does not change the platform into a clinical record system.',
  },
  {
    title: 'Regional guidance matters',
    body: 'Where guidance varies by country or public-health body, data structures should preserve region so recommendations can remain explainable and source-linked.',
  },
];

export default function DataUsePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-elegant px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="text-center space-y-5">
          <p className="uppercase tracking-[0.4em] text-xs text-slate-400">Data Use Policy</p>
          <h1 className="text-4xl md:text-5xl font-light text-slate-700">
            Data boundaries for a guidance platform
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-slate-500 font-light leading-relaxed">
            Mom AI Agent is being built as a public evidence hub, not as a replacement for the clinical
            systems that store medical records. This page explains the data-use posture behind that distinction.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          {dataPrinciples.map((principle) => (
            <article key={principle.title} className="rounded-3xl border border-slate-200 bg-white/90 p-7 shadow-sm">
              <h2 className="text-2xl font-light text-slate-700 mb-3">{principle.title}</h2>
              <p className="text-sm text-slate-500 leading-relaxed">{principle.body}</p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm space-y-5">
          <h2 className="text-2xl font-light text-slate-700">Practical guidance for users</h2>
          <ul className="space-y-3 text-sm text-slate-500 leading-relaxed list-disc list-inside">
            <li>Do not submit emergency concerns or urgent symptom details through general contact or newsletter forms.</li>
            <li>Do not rely on the public evidence hub as a long-term store for protected health information.</li>
            <li>Use the platform for guidance, planning, and source-linked education, then hand off critical decisions to a clinician when needed.</li>
            <li>If a product workflow later handles more sensitive data, that experience should carry its own explicit data notice and controls.</li>
          </ul>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <Link href="/privacy" className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm hover:shadow-md transition-all">
            <span className="block text-xs uppercase tracking-[0.25em] text-slate-400 mb-3">Privacy</span>
            <h2 className="text-xl font-light text-slate-700 mb-2">Read the website privacy notice</h2>
          </Link>
          <Link href="/methodology" className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm hover:shadow-md transition-all">
            <span className="block text-xs uppercase tracking-[0.25em] text-slate-400 mb-3">Methodology</span>
            <h2 className="text-xl font-light text-slate-700 mb-2">See how structured guidance is created</h2>
          </Link>
          <Link href="/contact" className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm hover:shadow-md transition-all">
            <span className="block text-xs uppercase tracking-[0.25em] text-slate-400 mb-3">Contact</span>
            <h2 className="text-xl font-light text-slate-700 mb-2">Request a partnership or correction review</h2>
          </Link>
        </section>
      </div>
    </div>
  );
}
