import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Methodology',
  description:
    'Review how the Mom AI Agent public evidence hub selects sources, structures knowledge, and prepares explainable guidance for mom and baby questions.',
  alternates: {
    canonical: '/methodology',
  },
  openGraph: {
    title: 'Methodology',
    description:
      'How the Mom AI Agent public evidence hub selects sources, weights evidence, and prepares explainable guidance.',
    url: '/methodology',
  },
  twitter: {
    title: 'Methodology',
    description:
      'Method behind the Mom AI Agent public evidence hub and answer layer.',
  },
};

const methodologySteps = [
  {
    title: '1. Source intake',
    body: 'We monitor public-health guidance, clinical organizations, and related reference material relevant to feeding, sleep, safety, development, and postpartum care.',
  },
  {
    title: '2. Evidence weighting',
    body: 'Sources are ranked by authority, recency, regional relevance, and applicability to the user scenario so high-stakes guidance does not rely on weak references.',
  },
  {
    title: '3. Structured compilation',
    body: 'Guidance is converted into reusable knowledge objects such as topic briefs, food cards, safety rules, FAQs, and explainers with source visibility preserved.',
  },
  {
    title: '4. Explainable output',
    body: 'Answer pathways are designed to show the conclusion, supporting references, applicable age or region, risk flags, and a practical next step.',
  },
];

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-gradient-elegant px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="text-center space-y-5">
          <p className="uppercase tracking-[0.4em] text-xs text-slate-400">Methodology</p>
          <h1 className="text-4xl md:text-5xl font-light text-slate-700">
            How evidence becomes explainable guidance
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-slate-500 font-light leading-relaxed">
            Mom AI Agent is built to turn public guidance into a public evidence layer that can be traced, reviewed,
            and acted on. This page explains the operating method behind that process.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          {methodologySteps.map((step) => (
            <article key={step.title} className="rounded-3xl border border-slate-200 bg-white/90 p-7 shadow-sm">
              <h2 className="text-2xl font-light text-slate-700 mb-3">{step.title}</h2>
              <p className="text-sm text-slate-500 leading-relaxed">{step.body}</p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm space-y-5">
          <h2 className="text-2xl font-light text-slate-700">Output standard</h2>
          <div className="grid gap-4 md:grid-cols-5">
            {['Conclusion', 'Supporting source', 'Age or region', 'Risk flags', 'Next action'].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
                {item}
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Not every public surface currently renders each field in full, but this is the answer-hub standard the platform is being organized around.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <Link href="/trust" className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm hover:shadow-md transition-all">
            <span className="block text-xs uppercase tracking-[0.25em] text-slate-400 mb-3">Trust Center</span>
            <h2 className="text-xl font-light text-slate-700 mb-2">View source and boundary model</h2>
          </Link>
          <Link href="/clinical-review-policy" className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm hover:shadow-md transition-all">
            <span className="block text-xs uppercase tracking-[0.25em] text-slate-400 mb-3">Clinical review</span>
            <h2 className="text-xl font-light text-slate-700 mb-2">See review and escalation rules</h2>
          </Link>
          <Link href="/data-use-policy" className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm hover:shadow-md transition-all">
            <span className="block text-xs uppercase tracking-[0.25em] text-slate-400 mb-3">Data use</span>
            <h2 className="text-xl font-light text-slate-700 mb-2">Understand data handling boundaries</h2>
          </Link>
        </section>
      </div>
    </div>
  );
}
