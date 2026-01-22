import Link from 'next/link';
import NewsletterSignup from '@/components/NewsletterSignup';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';
import PathwayWeekSelector from '@/components/pathways/PathwayWeekSelector';
import { DEVELOPMENT_STAGES, DEVELOPMENT_WEEKS } from '@/data/pathways';

export const metadata = {
  title: 'Baby Development Pathway | Mom AI Agent',
  description:
    'A 0-24 month roadmap with weekly play tasks, milestone signals, and clear guidance on when to ask for help.',
};

const PROGRAM_STEPS = [
  {
    title: "Pick your baby's age range",
    description: 'We organize weekly tasks by developmental stage so you always know what to focus on next.',
  },
  {
    title: 'Follow the weekly play plan',
    description: 'Each week includes 2-3 targeted activities that build motor, language, and social skills.',
  },
  {
    title: 'Track signals and red flags',
    description: 'We highlight what is typical and when it is time to check in with a pediatrician.',
  },
];

const WEEKLY_PACKS = [
  {
    title: 'Play and practice',
    items: ['Tummy time variations', 'Reach-and-grab games', 'Simple cause-and-effect play'],
  },
  {
    title: 'Observe and note',
    items: ['New movements', 'Eye tracking and social engagement', 'Babbling and early sounds'],
  },
  {
    title: 'Support the environment',
    items: ['Safe floor time setup', 'Toy rotation for focus', 'Daily routines to reduce overstimulation'],
  },
];

const SAMPLE_WEEK = {
  label: 'Sample week (0-3 months)',
  tasks: [
    '2 minutes of tummy time after each diaper change',
    'Track head control during supported sit',
    'Encourage social smiles with face-to-face play',
    'Note response to familiar voices',
  ],
  signals: [
    'Limited eye contact or tracking',
    'No head lift during tummy time by 2 months',
    'Very limited response to sounds',
  ],
};

const MILESTONE_PHASES = [
  {
    range: '0-3 months',
    focus: ['Head control and tummy time tolerance', 'Social smiles and eye tracking', 'Early vocalizations'],
  },
  {
    range: '4-6 months',
    focus: ['Rolling, reaching, and grasping', 'Back-and-forth vocal play', 'Starting to sit with support'],
  },
  {
    range: '7-12 months',
    focus: ['Crawling, standing, cruising', 'Imitation and gesture play', 'First words and name response'],
  },
  {
    range: '13-24 months',
    focus: ['Walking, climbing, and coordination', 'Early sentences and comprehension', 'Pretend play and social turn-taking'],
  },
];

export default function DevelopmentProgramPage() {
  return (
    <div className="min-h-screen bg-gradient-elegant">
      <section className="relative overflow-hidden py-16 px-4 sm:px-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-violet-100/40 to-purple-100/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-br from-slate-100/60 to-violet-100/10 rounded-full blur-3xl"></div>
        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <p className="uppercase tracking-[0.4em] text-xs text-slate-400 mb-4">Development Pathway</p>
          <h1 className="text-4xl md:text-5xl font-light text-slate-700 mb-4">
            Baby development, organized week by week
          </h1>
          <p className="text-lg text-slate-500 max-w-3xl mx-auto font-light">
            A structured 0-24 month roadmap with play tasks, milestone signals, and guidance grounded in public health
            recommendations.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/insight"
              className="px-4 py-2 rounded-full bg-white/80 border border-slate-200 text-[11px] uppercase tracking-[0.25em] text-slate-500 hover:text-violet-500 transition-colors"
            >
              Explore insights
            </Link>
            <Link
              href="/programs/parent-health"
              className="px-4 py-2 rounded-full bg-white/80 border border-slate-200 text-[11px] uppercase tracking-[0.25em] text-slate-500 hover:text-violet-500 transition-colors"
            >
              Parent health pathway
            </Link>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-12">
        <section className="grid gap-6 md:grid-cols-3">
          {PROGRAM_STEPS.map((step) => (
            <div key={step.title} className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm">
              <h2 className="text-lg font-light text-slate-700 mb-3">{step.title}</h2>
              <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white/85 p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-lg">
              <h2 className="text-2xl font-light text-slate-800 mb-3">Your weekly task pack</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Each week focuses on a small set of actions so you can build consistency without feeling overwhelmed.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {WEEKLY_PACKS.map((pack) => (
                <div key={pack.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">{pack.title}</h3>
                  <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
                    {pack.items.map((item) => (
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
            <h2 className="text-2xl font-light text-slate-800 mb-2">Milestone timeline</h2>
            <p className="text-sm text-slate-500">
              We group milestones into four phases so you can focus on the right skills at the right time.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            {MILESTONE_PHASES.map((phase) => (
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
                This is what a single week looks like. Subscribers receive the full schedule, age-specific prompts, and
                adjustments based on stage.
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
              Start with the first four weeks of tasks and red-flag signals. Subscribers receive the full 0-24 month
              schedule.
            </p>
          </header>
          <PathwayWeekSelector stages={DEVELOPMENT_STAGES} weeks={DEVELOPMENT_WEEKS} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white/85 p-8 shadow-sm">
            <h2 className="text-2xl font-light text-slate-800 mb-3">Join the development pathway</h2>
            <p className="text-sm text-slate-500 mb-6">
              We will send the weekly plan, the play ideas, and the red flags that require follow-up. Start free with
              email updates.
            </p>
            <NewsletterSignup
              variant="compact"
              title="Get the weekly development plan"
              description="Short, actionable tasks with milestone tracking and caregiver tips."
              source="programs-development"
            />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm">
            <h3 className="text-lg font-light text-slate-700 mb-2">What you will receive</h3>
            <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside">
              <li>Weekly activity plan and milestones for your baby's age.</li>
              <li>Signals that suggest a pediatric check-in.</li>
              <li>Evidence-based references from public health guidance.</li>
            </ul>
          </div>
        </section>

        <MedicalDisclaimer variant="compact" lastReviewed="2025-12-20" nextReview="2026-12-20" />
      </main>
    </div>
  );
}
