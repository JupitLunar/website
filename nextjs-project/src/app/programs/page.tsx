import Link from 'next/link';

export const metadata = {
  title: 'Parenting Programs | Mom AI Agent',
  description:
    'Structured, evidence-informed pathways for baby development and parent health. Weekly tasks, milestone guidance, and clear next steps.',
};

const PROGRAMS = [
  {
    slug: 'development',
    title: 'Baby Development Pathway',
    description:
      'Weekly play and observation plans aligned to 0-24 month milestones, with signals to watch and when to ask for help.',
    highlights: ['0-24 months roadmap', 'Weekly play tasks', 'Milestone signal tracking'],
  },
  {
    slug: 'parent-health',
    title: 'Parent Health Pathway',
    description:
      'Postpartum recovery and mental health guidance across 0-12 months with practical check-ins and red-flag prompts.',
    highlights: ['Physical recovery focus', 'Mental health check-ins', 'Support system planning'],
  },
];

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-gradient-elegant">
      <section className="relative overflow-hidden py-16 px-4 sm:px-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-violet-100/40 to-purple-100/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-br from-slate-100/60 to-violet-100/10 rounded-full blur-3xl"></div>
        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <p className="uppercase tracking-[0.4em] text-xs text-slate-400 mb-4">Programs</p>
          <h1 className="text-4xl md:text-5xl font-light text-slate-700 mb-4">
            Guided pathways for development and parent health
          </h1>
          <p className="text-lg text-slate-500 max-w-3xl mx-auto font-light">
            Structured weekly plans built from public health guidance so parents can move from information overload to
            clear next steps.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          {PROGRAMS.map((program) => (
            <div
              key={program.slug}
              className="rounded-2xl border border-slate-200 bg-white/85 p-8 shadow-sm flex flex-col gap-6"
            >
              <div>
                <h2 className="text-2xl font-light text-slate-800 mb-3">{program.title}</h2>
                <p className="text-sm text-slate-500 leading-relaxed">{program.description}</p>
              </div>
              <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside">
                {program.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link
                href={`/programs/${program.slug}`}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:text-violet-500 transition-colors"
              >
                Explore pathway
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
