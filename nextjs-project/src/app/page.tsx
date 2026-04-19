'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { generateOrganizationStructuredData, generateWebsiteStructuredData } from '@/lib/json-ld';

type RagResponse = {
  answer?: {
    summary: string;
    keyPoints?: string[];
    details?: {
      sections?: Array<{
        title: string;
        content: string;
      }>;
    };
    actionableAdvice?: string[];
    disclaimer?: string;
  } | null;
  sources?: Array<{
    title: string;
    category?: string;
    url?: string;
    type?: string;
  }>;
};

const POPULAR_SEARCH_PATHS = [
  {
    title: 'Starting solids at 6 months',
    href: '/insight/pain-new-mom-feeding-first-foods',
    description: 'Readiness signs, first foods, and how to introduce solids without overwhelm.',
  },
  {
    title: 'Baby fever when to worry',
    href: '/insight/pain-midnight-emergency-fever-steps',
    description: 'Temperature thresholds, red flags, and when urgent care matters most.',
  },
  {
    title: 'How to introduce peanut safely',
    href: '/insight/pain-allergy-introduction-safety',
    description: 'A step-by-step allergen intro plan based on NIAID and pediatric guidance.',
  },
  {
    title: 'Newborn sleep schedule',
    href: '/insight',
    description: 'Age-based sleep expectations, wake windows, and settling routines.',
  },
  {
    title: 'Baby food database',
    href: '/foods',
    description: 'Cut sizes, textures, safety notes, and age guidance for first foods and beyond.',
  },
  {
    title: 'Postpartum recovery guidance',
    href: '/insight?hub=mom-health',
    description: 'Warning signs, recovery milestones, and evidence-based maternal care support.',
  },
];

const TRUST_PROOF_POINTS = [
  {
    title: 'Visible source path',
    description: 'Key guidance paths point back to CDC, AAP, WHO, Health Canada, CPS, and other public-health or clinical references visible on-page.',
    actionLabel: 'Review source model',
    href: '/trust',
  },
  {
    title: 'Clear site boundary',
    description: 'The homepage stays focused on source-linked guidance, topic paths, foods, and trust materials instead of mixing in too many competing flows.',
    actionLabel: 'See framework',
    href: '/trust',
  },
  {
    title: 'Explicit safety boundary',
    description: 'The site states what is educational, what is not medical advice, and where urgent or individualized concerns should move to a clinician.',
    actionLabel: 'Read boundaries',
    href: '/clinical-review-policy',
  },
];

const SAMPLE_QUESTIONS = [
  {
    label: 'Infant development milestones',
    value: 'What are the key milestones in infant development?',
    className: 'bg-blue-100 hover:bg-blue-200 text-blue-700',
  },
  {
    label: 'Breastfeeding challenges',
    value: 'What are common challenges in breastfeeding?',
    className: 'bg-blue-100 hover:bg-blue-200 text-blue-700',
  },
  {
    label: 'Childbirth preparation',
    value: 'How to prepare for childbirth?',
    className: 'bg-blue-100 hover:bg-blue-200 text-blue-700',
  },
  {
    label: 'Postpartum depression signs',
    value: 'What are the signs of postpartum depression?',
    className: 'bg-blue-100 hover:bg-blue-200 text-blue-700',
  },
  {
    label: 'Starting solid foods',
    value: 'When can I introduce solid foods to my baby?',
    className: 'bg-violet-100 hover:bg-violet-200 text-violet-700',
  },
  {
    label: 'Newborn sleep patterns',
    value: 'How much sleep does a newborn need?',
    className: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700',
  },
  {
    label: 'Baby vaccination schedule',
    value: 'What vaccines does my baby need?',
    className: 'bg-purple-100 hover:bg-purple-200 text-purple-700',
  },
  {
    label: 'Managing baby colic',
    value: 'How to deal with baby colic?',
    className: 'bg-pink-100 hover:bg-pink-200 text-pink-700',
  },
  {
    label: '6-month-old food guide',
    value: 'What are safe foods for a 6-month-old?',
    className: 'bg-blue-100 hover:bg-blue-200 text-blue-700',
  },
  {
    label: 'Diaper rash prevention',
    value: 'How to prevent diaper rash?',
    className: 'bg-violet-100 hover:bg-violet-200 text-violet-700',
  },
];

function HomePage() {
  const websiteData = generateWebsiteStructuredData();
  const organizationData = generateOrganizationStructuredData();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ragResult, setRagResult] = useState<RagResponse | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);

  const submitQuery = async () => {
    const trimmed = query.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);
    setQueryError(null);
    setRagResult(null);

    try {
      const response = await fetch('/api/rag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: trimmed,
          sessionId: `homepage-${Date.now()}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Unable to load an answer right now.');
      }

      setRagResult(data);
    } catch (error) {
      setRagResult(null);
      setQueryError(error instanceof Error ? error.message : 'Unable to load an answer right now.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuery = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submitQuery();
  };

  return (
    <>
      <Script
        id="website-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
      <Script
        id="organization-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />

      <div className="min-h-screen bg-gradient-elegant">
        <section className="relative py-8 px-4 sm:px-8 overflow-hidden bg-gradient-to-br from-slate-50/20 via-white to-violet-50/10">
          <div className="absolute inset-0 opacity-[0.45] pointer-events-none">
            <Image
              src="/heroimage.png"
              alt="Moon Tree Background"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-100/10 to-purple-100/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-indigo-100/10 to-violet-100/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-100/8 to-violet-100/3 rounded-full blur-3xl" />

          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center">
              <div
                className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-gradient-to-r from-slate-50/90 to-violet-50/60 backdrop-blur-sm rounded-full shadow-sm border border-slate-200/30"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-slate-300 to-violet-300 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-light text-slate-500">
                  Evidence Intelligence Platform for Mom &amp; Baby
                </span>
              </div>

              <h1
                className="text-5xl md:text-6xl lg:text-7xl font-light text-slate-500 mb-3 leading-tight"
              >
                Evidence Intelligence for
                <br />
                <span className="bg-gradient-to-r from-slate-400 via-violet-400 to-slate-500 bg-clip-text text-transparent">
                  Mom &amp; Baby
                </span>
              </h1>

              <p
                className="hero-subtext text-xl md:text-2xl text-slate-500 mb-4 max-w-4xl mx-auto leading-relaxed font-light"
              >
                Mom AI Agent is the public website for source-linked parenting answers, structured topic paths,
                and a calmer way to move from question to guidance.
              </p>

              <div className="mb-6">
                <p className="text-xs text-slate-400 mb-3 font-light">
                  Guidance framework informed by leading health organizations
                </p>
                <div className="flex flex-wrap justify-center items-center gap-6 opacity-50">
                  <span className="text-xs text-slate-400 font-light">CDC</span>
                  <span className="text-xs text-slate-400 font-light">American Academy of Pediatrics</span>
                  <span className="text-xs text-slate-400 font-light">WHO</span>
                  <span className="text-xs text-slate-400 font-light">Health Canada</span>
                  <span className="text-xs text-slate-400 font-light">Canadian Paediatric Society</span>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-4 justify-center">
                <Link
                  href="/search"
                  className="btn-primary text-lg px-8 py-4 text-center"
                  aria-label="Search the Mom AI Agent answer hub"
                >
                  Search the Answer Hub
                </Link>
                <Link
                  href="/foods"
                  className="btn-secondary text-lg px-8 py-4 text-center"
                  aria-label="Browse the foods database"
                >
                  Browse Foods Database
                </Link>
                <Link
                  href="/trust"
                  className="text-slate-500 hover:text-slate-700 text-lg px-8 py-4 transition-colors text-center"
                  aria-label="Review the Mom AI Agent trust center"
                >
                  Review Trust Center →
                </Link>
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-slate-400">
                <Link href="/foods" className="hover:text-slate-600 transition-colors">
                  Open Foods Database
                </Link>
                <span aria-hidden="true">•</span>
                <Link href="#popular-questions" className="hover:text-slate-600 transition-colors">
                  Browse Popular Questions
                </Link>
                <span aria-hidden="true">•</span>
                <Link href="/clinical-review-policy" className="hover:text-slate-600 transition-colors">
                  Review Safety Boundaries
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-8 bg-gradient-to-br from-blue-50/30 to-indigo-50/20">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-medium text-slate-700 mb-4">
                Ask MomAI Agent
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto font-light">
                Gentle guidance for your maternal and infant care questions
              </p>
            </div>

            <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-3xl shadow-lg border border-blue-200/50 p-8">
              <form onSubmit={handleQuery} className="relative">
                <div className="relative">
                  <textarea
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Ask me anything about maternal health, infant development, or pediatric care..."
                    rows={3}
                    className="w-full px-6 py-5 pr-24 text-base rounded-2xl border border-blue-200 focus:border-blue-400 focus:outline-none transition-colors resize-none bg-blue-50/20 placeholder-slate-400"
                    disabled={isLoading}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        void submitQuery();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      void submitQuery();
                    }}
                    disabled={isLoading || !query.trim()}
                    className="absolute right-4 top-1/2 z-20 -translate-y-1/2 cursor-pointer pointer-events-auto bg-gradient-to-r from-pink-400 to-rose-400 text-white p-4 rounded-2xl hover:from-pink-500 hover:to-rose-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    aria-label="Submit question"
                  >
                    <svg className="w-6 h-6 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-9.193-5.106A1 1 0 004 6.94v10.12a1 1 0 001.559.83l9.193-6.106a1 1 0 000-1.66z" />
                    </svg>
                  </button>
                </div>
              </form>

              {isLoading && (
                <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50/70 px-4 py-3 text-sm text-blue-800">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-blue-300 border-t-blue-600" />
                    <span>Generating answer…</span>
                  </div>
                </div>
              )}

              {queryError && (
                <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {queryError}
                </div>
              )}

              {ragResult?.answer && (
                <div className="mt-5 rounded-[1.75rem] border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-light text-slate-700 mb-3">
                    Retrieved guidance answer
                  </h3>

                  <p className="text-base leading-7 text-slate-600 mb-4">{ragResult.answer.summary}</p>

                  {ragResult.answer.keyPoints && ragResult.answer.keyPoints.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400 mb-2">Key Points</p>
                      <ul className="space-y-2">
                        {ragResult.answer.keyPoints.slice(0, 4).map((point, index) => (
                          <li key={`${point}-${index}`} className="flex items-start gap-3 text-sm text-slate-600">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {ragResult.answer.details?.sections && ragResult.answer.details.sections.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2 mb-4">
                      {ragResult.answer.details.sections.slice(0, 2).map((section, index) => (
                        <div key={`${section.title}-${index}`} className="rounded-2xl border border-blue-100 bg-white/80 p-4">
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-400 mb-2">{section.title}</p>
                          <p className="text-sm leading-6 text-slate-600">{section.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {ragResult.answer.actionableAdvice && ragResult.answer.actionableAdvice.length > 0 && (
                    <div className="mb-4 rounded-2xl border border-violet-100 bg-violet-50/60 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-violet-500 mb-2">Next Steps</p>
                      <ul className="space-y-2">
                        {ragResult.answer.actionableAdvice.slice(0, 3).map((item, index) => (
                          <li key={`${item}-${index}`} className="text-sm leading-6 text-slate-600">
                            {index + 1}. {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {ragResult.sources && ragResult.sources.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400 mb-2">Sources</p>
                      <div className="flex flex-wrap gap-2">
                        {ragResult.sources.slice(0, 3).map((source, index) => (
                          source.url ? (
                            <a
                              key={`${source.title}-${index}`}
                              href={source.url}
                              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition-colors hover:text-violet-600"
                            >
                              {source.title}
                            </a>
                          ) : (
                            <span
                              key={`${source.title}-${index}`}
                              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600"
                            >
                              {source.title}
                            </span>
                          )
                        ))}
                      </div>
                    </div>
                  )}

                  {ragResult.answer.disclaimer && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-6 text-amber-800">
                      {ragResult.answer.disclaimer}
                    </div>
                  )}
                </div>
              )}

              {!ragResult?.answer && !isLoading && (
                <div className="mt-6">
                  <p className="text-sm text-slate-500 mb-3 font-light">Try asking:</p>
                  <div className="flex flex-wrap gap-3">
                    {SAMPLE_QUESTIONS.map((sample) => (
                      <button
                        key={sample.label}
                        type="button"
                        onClick={() => setQuery(sample.value)}
                        className={`px-4 py-2 rounded-xl text-sm transition-colors font-light ${sample.className}`}
                      >
                        {sample.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="popular-questions" className="py-16 px-4 sm:px-8 bg-white/90 border-y border-slate-100">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-10">
              <p className="uppercase tracking-[0.4em] text-sm text-slate-400 mb-4">Evidence</p>
              <h2 className="text-4xl font-light text-slate-600 mb-4">
                Authority turned into answers families can actually use
              </h2>
              <p className="text-lg text-slate-500 max-w-3xl mx-auto font-light">
                These pages are organized around common caregiver search intent, turning high-stress
                questions into a clearer knowledge system with structured answers and visible sources.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {POPULAR_SEARCH_PATHS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-3xl border border-slate-100 bg-gradient-to-br from-white to-violet-50/40 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-md"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-3">Intent path</p>
                  <h3 className="text-2xl font-light text-slate-600 mb-4 group-hover:text-violet-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500">{item.description}</p>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-violet-500 group-hover:text-violet-600">
                    Open guide
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-8 bg-gradient-to-br from-slate-50/40 via-white to-purple-50/20">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <p className="uppercase tracking-[0.4em] text-sm text-slate-400 mb-4">Trust</p>
              <h2 className="text-4xl font-light text-slate-600 mb-4">
                Built for transparency, structure, and long-term trust
              </h2>
              <p className="text-lg text-slate-500 max-w-3xl mx-auto font-light">
                Professional trust comes from visible source paths, explicit boundaries, and a clearer
                explanation of how the website works.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {TRUST_PROOF_POINTS.map((item) => (
                <article
                  key={item.title}
                  className="rounded-3xl border border-slate-100 bg-white/90 backdrop-blur p-6 shadow-sm"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-3">Trust proof</p>
                  <h3 className="text-2xl font-light text-slate-600 mb-4">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">{item.description}</p>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-2 text-sm font-medium text-violet-500 hover:text-violet-600"
                  >
                    {item.actionLabel}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </article>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/trust"
                className="inline-flex items-center gap-2 text-violet-500 hover:text-violet-600 font-medium"
              >
                Review sourcing process
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default HomePage;
