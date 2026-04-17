import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Clinical Review Policy',
  description:
    'See how the Mom AI Agent public evidence hub handles educational boundaries and escalation rules for higher-risk maternal and infant guidance topics.',
  alternates: {
    canonical: '/clinical-review-policy',
  },
  openGraph: {
    title: 'Clinical Review Policy',
    description:
      'Educational boundaries and escalation rules for higher-risk guidance on the Mom AI Agent public evidence hub.',
    url: '/clinical-review-policy',
  },
  twitter: {
    title: 'Clinical Review Policy',
    description:
      'How higher-risk maternal and infant guidance is bounded and escalated on Mom AI Agent.',
  },
};

const reviewRules = [
  {
    title: 'Educational by default',
    body: 'Most website content is educational, source-linked, and designed to help families understand public guidance. It is not individualized medical advice.',
  },
  {
    title: 'Higher-risk topics receive tighter controls',
    body: 'Topics involving fever, dehydration, allergy reactions, breathing concerns, postpartum warning signs, and age-specific safety thresholds are handled with stricter language and clearer escalation prompts.',
  },
  {
    title: 'Source hierarchy matters',
    body: 'For higher-stakes content, public-health agencies, pediatric associations, and national guidance bodies are prioritized over general educational sources.',
  },
  {
    title: 'Escalation beats overconfidence',
    body: 'When the platform cannot safely narrow a decision, it should direct the user toward their pediatrician, OB team, nurse line, or urgent care instead of sounding certain.',
  },
];

export default function ClinicalReviewPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-elegant px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="text-center space-y-5">
          <p className="uppercase tracking-[0.4em] text-xs text-slate-400">Clinical Review Policy</p>
          <h1 className="text-4xl md:text-5xl font-light text-slate-700">
            Review standards for higher-risk guidance
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-slate-500 font-light leading-relaxed">
            Mom AI Agent is not a medical practice. This policy explains how higher-risk content is handled on the public evidence hub,
            where review standards tighten, and when the platform should defer to a licensed care team.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          {reviewRules.map((rule) => (
            <article key={rule.title} className="rounded-3xl border border-slate-200 bg-white/90 p-7 shadow-sm">
              <h2 className="text-2xl font-light text-slate-700 mb-3">{rule.title}</h2>
              <p className="text-sm text-slate-500 leading-relaxed">{rule.body}</p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm space-y-5">
          <h2 className="text-2xl font-light text-slate-700">When content should escalate</h2>
          <ul className="space-y-3 text-sm text-slate-500 leading-relaxed list-disc list-inside">
            <li>Newborn or young-infant symptoms that may require same-day medical evaluation.</li>
            <li>Possible allergic reactions, respiratory concerns, dehydration, or emergency safety issues.</li>
            <li>Postpartum symptoms that may signal hemorrhage, infection, blood pressure complications, or severe mood changes.</li>
            <li>Cases where age, region, feeding history, or medical background materially change the safest next step.</li>
          </ul>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm space-y-5">
          <h2 className="text-2xl font-light text-slate-700">Current boundary</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            The public platform can explain guidance, organize next steps, and surface red flags. It does not diagnose,
            prescribe, interpret medical tests, or replace a clinician who knows the user and child.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <Link href="/trust" className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm hover:shadow-md transition-all">
            <span className="block text-xs uppercase tracking-[0.25em] text-slate-400 mb-3">Trust Center</span>
            <h2 className="text-xl font-light text-slate-700 mb-2">Review source standards</h2>
          </Link>
          <Link href="/methodology" className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm hover:shadow-md transition-all">
            <span className="block text-xs uppercase tracking-[0.25em] text-slate-400 mb-3">Methodology</span>
            <h2 className="text-xl font-light text-slate-700 mb-2">See how answers are assembled</h2>
          </Link>
          <Link href="/disclaimer" className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm hover:shadow-md transition-all">
            <span className="block text-xs uppercase tracking-[0.25em] text-slate-400 mb-3">Disclaimer</span>
            <h2 className="text-xl font-light text-slate-700 mb-2">View use boundaries</h2>
          </Link>
        </section>
      </div>
    </div>
  );
}
