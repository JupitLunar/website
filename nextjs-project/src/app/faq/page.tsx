import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { FAQ_DATA } from '@/lib/faq-catalog';
import { generateFAQStructuredData } from '@/lib/json-ld';

import type { FAQCategory } from '@/lib/faq-catalog';

interface FAQLink {
  label: string;
  href: string;
}

interface CategoryConfig {
  id: string;
  summary: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  relatedSearches: FAQLink[];
  supportLinks?: FAQLink[];
}

const CATEGORY_CONFIG: Record<FAQCategory, CategoryConfig> = {
  'Platform & Trust': {
    id: 'platform-trust',
    summary: 'Who Mom AI Agent is, how the platform works, and why trust structure matters.',
    description:
      'Use this lane when the question is about platform credibility, source model, boundaries, or the fastest way to navigate the public hub.',
    primaryHref: '/trust',
    primaryLabel: 'Trust center',
    secondaryHref: '/methodology',
    secondaryLabel: 'Review methodology',
    relatedSearches: [
      { label: 'what is mom ai agent', href: '/search?q=what+is+mom+ai+agent' },
      { label: 'mom ai agent trust center', href: '/search?q=trust+center' },
      { label: 'mom ai agent methodology', href: '/search?q=methodology' },
    ],
    supportLinks: [
      { label: 'Trust center', href: '/trust' },
      { label: 'Methodology', href: '/methodology' },
      { label: 'Clinical review policy', href: '/clinical-review-policy' },
    ],
  },
  Feeding: {
    id: 'feeding',
    summary: 'Starting solids, first foods, allergens, and texture progression.',
    description:
      'Use this lane when the question is about feeding readiness, serving format, or what to introduce next.',
    primaryHref: '/foods',
    primaryLabel: 'Foods database',
    secondaryHref: '/search?q=starting+solids',
    secondaryLabel: 'Search feeding answers',
    relatedSearches: [
      { label: 'when to start solids', href: '/search?q=when+to+start+solids' },
      { label: 'first foods for babies', href: '/search?q=first+foods+for+babies' },
      { label: 'introducing allergens', href: '/search?q=introducing+allergens' },
    ],
  },
  Sleep: {
    id: 'sleep',
    summary: 'Newborn sleep ranges, routines, and early rhythm expectations.',
    description:
      'Use this lane when you need a fast baseline, then move into the topic library for broader sleep guidance.',
    primaryHref: '/topics',
    primaryLabel: 'Topics library',
    secondaryHref: '/search?q=newborn+sleep',
    secondaryLabel: 'Search sleep answers',
    relatedSearches: [
      { label: 'newborn safe sleep', href: '/search?q=newborn+safe+sleep' },
      { label: 'how much sleep does a newborn need', href: '/search?q=how+much+sleep+does+a+newborn+need' },
      { label: 'baby sleep basics', href: '/search?q=baby+sleep+basics' },
    ],
  },
  'Fever & Safety': {
    id: 'fever-safety',
    summary: 'Emergency thresholds, choking risk, and signs that need fast escalation.',
    description:
      'Use this lane for immediate safety questions, then widen into the answer hub if symptoms overlap more than one topic.',
    primaryHref: '/search?q=fever',
    primaryLabel: 'Search safety answers',
    secondaryHref: '/trust',
    secondaryLabel: 'Review trust model',
    relatedSearches: [
      { label: 'baby fever danger signs', href: '/search?q=baby+fever+danger+signs' },
      { label: 'when to call 911 for baby fever', href: '/search?q=when+to+call+911+for+baby+fever' },
      { label: 'how to prevent choking in babies', href: '/search?q=how+to+prevent+choking+in+babies' },
    ],
  },
  Postpartum: {
    id: 'postpartum',
    summary: 'Urgent maternal warning signs and postpartum recovery risk signals.',
    description:
      'Use this lane when the caregiver question is about the mother, not only the baby, and when escalation thresholds matter.',
    primaryHref: '/search?q=postpartum',
    primaryLabel: 'Search postpartum answers',
    secondaryHref: '/insight',
    secondaryLabel: 'Browse explainers',
    relatedSearches: [
      { label: 'postpartum warning signs', href: '/search?q=postpartum+warning+signs' },
      { label: 'postpartum depression or anxiety', href: '/search?q=postpartum+depression+or+anxiety' },
      { label: 'urgent postpartum symptoms', href: '/search?q=urgent+postpartum+symptoms' },
    ],
  },
  Nutrition: {
    id: 'nutrition',
    summary: 'Supplements, nutrient coverage, and everyday feeding support questions.',
    description:
      'Use this lane when the question sits between a food detail and a wider nutrition recommendation.',
    primaryHref: '/foods',
    primaryLabel: 'Open foods database',
    secondaryHref: '/topics',
    secondaryLabel: 'Browse nutrition topics',
    relatedSearches: [
      { label: 'vitamin d for babies', href: '/search?q=vitamin+d+for+babies' },
      { label: 'baby iron needs', href: '/search?q=baby+iron+needs' },
      { label: 'infant nutrition guidance', href: '/search?q=infant+nutrition+guidance' },
    ],
  },
};

export const metadata: Metadata = {
  title: 'Caregiver FAQ',
  description:
    'Twenty source-linked answers about feeding, sleep, fever and safety, postpartum recovery, nutrition, and how Mom AI Agent works.',
  alternates: {
    canonical: '/faq',
  },
  openGraph: {
    title: 'Caregiver FAQ',
    description:
      'Twenty clear answers for feeding, sleep, fever, safety, postpartum, nutrition, and platform trust questions.',
    url: '/faq',
  },
  twitter: {
    title: 'Caregiver FAQ',
    description:
      'Source-linked FAQ for caregiver questions and platform trust questions.',
  },
  keywords: [
    'baby feeding FAQ',
    'newborn sleep questions',
    'baby fever guidance',
    'postpartum recovery FAQ',
    'infant care FAQ',
    'mom ai agent faq',
    'evidence intelligence platform',
    'trust center FAQ',
  ],
};

export default function FAQPage() {
  const structuredData = generateFAQStructuredData(
    FAQ_DATA.map((faq) => ({ question: faq.question, answer: faq.answer })),
  );
  const categoryOrder: FAQCategory[] = [
    'Platform & Trust',
    'Feeding',
    'Fever & Safety',
    'Sleep',
    'Postpartum',
    'Nutrition',
  ];
  const totalCount = FAQ_DATA.length;
  const faqsByCategory = categoryOrder.map((category) => ({
    category,
    config: CATEGORY_CONFIG[category],
    items: FAQ_DATA.filter((faq) => faq.category === category),
  }));

  return (
    <>
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-gradient-elegant">
        <section className="relative overflow-hidden py-16 px-4 sm:px-8">
          <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-gradient-to-br from-violet-100/40 to-purple-100/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-gradient-to-br from-slate-100/70 to-violet-100/10 blur-3xl"></div>
          <div className="container mx-auto max-w-4xl relative z-10 text-center">
            <p className="uppercase tracking-[0.4em] text-xs text-slate-400 mb-4">FAQ</p>
            <h1 className="text-4xl md:text-5xl font-light text-slate-700 mb-4">
              Caregiver questions, answered clearly
            </h1>
            <p className="text-lg text-slate-500 max-w-3xl mx-auto font-light">
              Use FAQ as the fast-answer layer of the public knowledge system. These {totalCount} source-linked answers
              cover common caregiver decisions and the core platform questions behind Mom AI Agent itself.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="px-4 py-2 rounded-full bg-white/80 border border-slate-200 text-[11px] uppercase tracking-[0.25em] text-slate-400">
                {totalCount} source-linked answers
              </span>
              <span className="px-4 py-2 rounded-full bg-white/80 border border-slate-200 text-[11px] uppercase tracking-[0.25em] text-slate-400">
                Evidence informed
              </span>
              <span className="px-4 py-2 rounded-full bg-white/80 border border-slate-200 text-[11px] uppercase tracking-[0.25em] text-slate-400">
                Updated on review cycles
              </span>
              <Link
                href="/trust"
                className="px-4 py-2 rounded-full bg-white/80 border border-slate-200 text-[11px] uppercase tracking-[0.25em] text-slate-500 hover:text-violet-500 transition-colors"
              >
                Trust Center
              </Link>
              <Link
                href="/search"
                className="px-4 py-2 rounded-full bg-white/80 border border-slate-200 text-[11px] uppercase tracking-[0.25em] text-slate-500 hover:text-violet-500 transition-colors"
              >
                Search Answers
              </Link>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3 text-left">
              <Link
                href="/topics"
                className="rounded-2xl border border-slate-200 bg-white/75 p-5 shadow-sm hover:shadow-md transition-all"
              >
                <span className="block text-[11px] uppercase tracking-[0.24em] text-slate-400 mb-2">Topics</span>
                <h2 className="text-base font-semibold text-slate-800 mb-2">Need the structured guidance layer?</h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Open the topics library when the question expands beyond one quick answer.
                </p>
              </Link>
              <Link
                href="/foods"
                className="rounded-2xl border border-slate-200 bg-white/75 p-5 shadow-sm hover:shadow-md transition-all"
              >
                <span className="block text-[11px] uppercase tracking-[0.24em] text-slate-400 mb-2">Foods</span>
                <h2 className="text-base font-semibold text-slate-800 mb-2">Need food-by-food detail?</h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Move into foods when the answer depends on texture, allergens, or serving format.
                </p>
              </Link>
              <Link
                href="/insight"
                className="rounded-2xl border border-slate-200 bg-white/75 p-5 shadow-sm hover:shadow-md transition-all"
              >
                <span className="block text-[11px] uppercase tracking-[0.24em] text-slate-400 mb-2">Explainers</span>
                <h2 className="text-base font-semibold text-slate-800 mb-2">Need the article layer?</h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Browse explainers when you want a fuller walkthrough, not only a fast response.
                </p>
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="rounded-3xl border border-slate-200 bg-white/75 p-6 shadow-sm mb-8">
            <div className="flex flex-wrap items-center gap-3">
              {faqsByCategory.map(({ category, config, items }) => (
                <a
                  key={category}
                  href={`#${config.id}`}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-500 hover:text-violet-600 transition-colors"
                >
                  {category} · {items.length}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-10">
            {faqsByCategory.map(({ category, config, items }) => (
              <section
                key={category}
                id={config.id}
                className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm scroll-mt-28"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between mb-8">
                  <div className="max-w-2xl">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-3">{category}</p>
                    <h2 className="text-2xl font-light text-slate-700 mb-3">{config.summary}</h2>
                    <p className="text-sm text-slate-600 leading-relaxed">{config.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={config.primaryHref}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-500 hover:text-violet-600 transition-colors"
                    >
                      {config.primaryLabel}
                    </Link>
                    <Link
                      href={config.secondaryHref}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-500 hover:text-violet-600 transition-colors"
                    >
                      {config.secondaryLabel}
                    </Link>
                  </div>
                </div>

                <div className="mb-8 space-y-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400 mb-3">Related searches</p>
                    <div className="flex flex-wrap gap-3">
                      {config.relatedSearches.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-600 hover:text-violet-600 transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {config.supportLinks && config.supportLinks.length > 0 && (
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400 mb-3">Platform paths</p>
                      <div className="flex flex-wrap gap-3">
                        {config.supportLinks.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-500 hover:text-violet-600 transition-colors"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-5">
                  {items.map((faq, index) => (
                    <article
                      key={faq.question}
                      className="rounded-2xl border border-slate-200 bg-slate-50/55 p-6"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 mb-4">
                        <span className="uppercase tracking-[0.3em]">Question {index + 1}</span>
                        <span className="uppercase tracking-[0.2em]">{faq.sourceLayer}</span>
                      </div>
                      <h3 className="text-xl font-light text-slate-700 mb-3">{faq.question}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                          {faq.sourceKind === 'platform' ? 'Platform reference' : 'Authority source'}: {faq.sourceLayer}
                        </span>
                        {faq.sourceKind === 'platform' ? (
                          <Link
                            href={faq.sourceUrl}
                            className="inline-flex text-xs uppercase tracking-[0.18em] text-violet-600 hover:text-violet-700"
                          >
                            Platform page: {faq.sourceLabel} →
                          </Link>
                        ) : (
                          <a
                            href={faq.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex text-xs uppercase tracking-[0.18em] text-indigo-600 hover:text-indigo-700"
                          >
                            Authority source: {faq.sourceLabel} ↗
                          </a>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-12 rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm">
            <h2 className="text-2xl font-light text-slate-700 mb-3">Need a deeper dive?</h2>
            <p className="text-sm text-slate-500 mb-6">
              FAQ is the fast layer. Move into the broader knowledge system when the question needs more context, or report a citation issue if you find an error.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <Link
                href="/topics"
                className="rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm text-slate-600 hover:text-violet-500 transition-colors"
              >
                <span className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                  Topics library
                </span>
                Explore feeding foundations, safety and hygiene, allergens, and daily routines.
              </Link>
              <Link
                href="/trust"
                className="rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm text-slate-600 hover:text-violet-500 transition-colors"
              >
                <span className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                  Trust and transparency
                </span>
                Review source grading, update cadence, and methodology boundaries.
              </Link>
              <Link
                href="/contact?type=general#contact-form"
                className="rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm text-slate-600 hover:text-violet-500 transition-colors"
              >
                <span className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                  Report a correction
                </span>
                Send citation fixes, broken links, and wording corrections to the editorial queue.
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
