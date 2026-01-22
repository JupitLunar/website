import Link from 'next/link';
import NewsletterSignup from '@/components/NewsletterSignup';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';
import PathwayWeekSelector from '@/components/pathways/PathwayWeekSelector';
import { PARENT_HEALTH_STAGES, PARENT_HEALTH_WEEKS } from '@/data/pathways';

export const metadata = {
  title: 'Parent Health Pathway | Mom AI Agent',
  description:
    'A 0-12 month postpartum pathway covering recovery, mental health check-ins, and guidance on when to reach out for help.',
};

const RECOVERY_PHASES = [
  {
    range: '0-6 weeks',
    focus: ['Physical recovery basics', 'Sleep and energy triage', 'Support system setup'],
  },
  {
    range: '6-12 weeks',
    focus: ['Follow-up appointments', 'Pelvic floor and core care', 'Mood and anxiety check-ins'],
  },
  {
    range: '3-6 months',
    focus: ['Return-to-activity plan', 'Nutrition and hydration support', 'Relationship and load-sharing'],
  },
  {
    range: '6-12 months',
    focus: ['Sustaining mental health', 'Work or childcare transitions', 'Ongoing recovery signals'],
  },
];

const WEEKLY_SUPPORT = [
  {
    title: 'Body and recovery',
    items: ['Simple mobility check-ins', 'Energy and sleep tracking', 'Gentle movement suggestions'],
  },
  {
    title: 'Mental health',
    items: ['Mood and anxiety prompts', 'Stress relief routines', 'When to ask for help guidance'],
  },
  {
    title: 'Support system',
    items: ['Partner communication scripts', 'Care task planning', 'Community resource reminders'],
  },
];

const ACTION_STEPS = [
  {
    title: 'Start with your phase',
    description: 'We match content to postpartum stage so advice feels relevant, not generic.',
  },
  {
    title: 'Use weekly check-ins',
    description: 'Short prompts help you notice warning signs early and seek support quickly.',
  },
  {
    title: 'Get clear red flags',
    description: 'We outline when to contact your care team and where to look for help.',
  },
];

const SAMPLE_WEEK = {
  label: 'Sample week (0-6 weeks)',
  tasks: [
    'Track sleep blocks and identify one realistic rest window',
    'Note any heavy bleeding, fever, or severe pain',
    'Complete a 60-second mood check-in',
    'Ask for one concrete support task this week',
  ],
  signals: [
    'Persistent sadness or anxiety most of the day',
    'Severe pain, fever, or worsening bleeding',
    'Thoughts of self-harm or harming baby (seek help immediately)',
  ],
};

export default function ParentHealthProgramPage() {
  return (
    <div className="min-h-screen bg-gradient-elegant">
      <section className="relative overflow-hidden py-16 px-4 sm:px-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-violet-100/40 to-purple-100/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-br from-slate-100/60 to-violet-100/10 rounded-full blur-3xl"></div>
        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <p className="uppercase tracking-[0.4em] text-xs text-slate-400 mb-4">Parent Health Pathway</p>
          <h1 className="text-4xl md:text-5xl font-light text-slate-700 mb-4">
            Postpartum support that follows you month by month
          </h1>
          <p className="text-lg text-slate-500 max-w-3xl mx-auto font-light">
            A 0-12 month recovery roadmap with mental health check-ins, practical reminders, and red-flag guidance.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/insight"
              className="px-4 py-2 rounded-full bg-white/80 border border-slate-200 text-[11px] uppercase tracking-[0.25em] text-slate-500 hover:text-violet-500 transition-colors"
            >
              Explore insights
            </Link>
            <Link
              href="/programs/development"
              className="px-4 py-2 rounded-full bg-white/80 border border-slate-200 text-[11px] uppercase tracking-[0.25em] text-slate-500 hover:text-violet-500 transition-colors"
            >
              Baby development pathway
            </Link>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-12">
        <section className="grid gap-6 md:grid-cols-3">
          {ACTION_STEPS.map((step) => (
            <div key={step.title} className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm">
              <h2 className="text-lg font-light text-slate-700 mb-3">{step.title}</h2>
              <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white/85 p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-lg">
              <h2 className="text-2xl font-light text-slate-800 mb-3">Weekly recovery support</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Each week includes short, realistic prompts so you can track recovery and reach out when needed.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {WEEKLY_SUPPORT.map((track) => (
                <div key={track.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">{track.title}</h3>
                  <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
                    {track.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <header>
            <h2 className="text-2xl font-light text-slate-800 mb-2">Recovery timeline</h2>
            <p className="text-sm text-slate-500">
              Structured guidance across the first year so recovery does not stall after the first six weeks.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            {RECOVERY_PHASES.map((phase) => (
              <div key={phase.range} className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-3">{phase.range}</p>
                <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside">
                  {phase.focus.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white/85 p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-lg">
              <h2 className="text-2xl font-light text-slate-800 mb-3">Sample weekly plan</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                This is a snapshot of one week. Subscribers receive tailored prompts based on postpartum stage.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-3">{SAMPLE_WEEK.label}</p>
              <div className="space-y-4 text-sm text-slate-600">
                <div>
                  <p className="font-semibold text-slate-700 mb-1">Weekly tasks</p>
                  <ul className="space-y-1 list-disc list-inside">
                    {SAMPLE_WEEK.tasks.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-slate-700 mb-1">Signals to watch</p>
                  <ul className="space-y-1 list-disc list-inside">
                    {SAMPLE_WEEK.signals.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <header>
            <h2 className="text-2xl font-light text-slate-800 mb-2">Week-by-week starter plan</h2>
            <p className="text-sm text-slate-500">
              The first four weeks focus on recovery, mood, and support. Subscribers receive the full 0-12 month pathway.
            </p>
          </header>
          <PathwayWeekSelector stages={PARENT_HEALTH_STAGES} weeks={PARENT_HEALTH_WEEKS} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white/85 p-8 shadow-sm">
            <h2 className="text-2xl font-light text-slate-800 mb-3">Join the parent health pathway</h2>
            <p className="text-sm text-slate-500 mb-6">
              Receive weekly prompts, recovery check-ins, and clear guidance on when to contact your care team.
            </p>
            <NewsletterSignup
              variant="compact"
              title="Get the weekly parent health plan"
              description="Recovery and mental health prompts designed for real-life schedules."
              source="programs-parent-health"
            />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm">
            <h3 className="text-lg font-light text-slate-700 mb-2">What you will receive</h3>
            <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside">
              <li>Weekly recovery prompts and mood check-ins.</li>
              <li>Red-flag reminders for physical or mental health changes.</li>
              <li>Guidance aligned with public health resources.</li>
            </ul>
          </div>
        </section>

        <MedicalDisclaimer variant="compact" lastReviewed="2025-12-20" nextReview="2026-12-20" />
      </main>
    </div>
  );
}
