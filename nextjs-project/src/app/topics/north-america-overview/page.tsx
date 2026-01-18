import React from 'react';
import { knowledgeBase } from '@/lib/supabase';
import GuideCard from '@/components/kb/GuideCard';
import RuleCard from '@/components/kb/RuleCard';
import FoodCard from '@/components/kb/FoodCard';
import DisclaimerNotice from '@/components/kb/DisclaimerNotice';
import type { KnowledgeGuide, KnowledgeFood, KnowledgeRule, KnowledgeSource } from '@/types/content';

const GUIDE_SLUGS = [
  'north-america-feeding-tldr',
  'north-america-age-feeding-matrix',
  'north-america-safety-guardrails',
  'north-america-micronutrient-reference',
];

const RULE_SLUGS = [
  'no-honey-before-12-months',
  'juice-guidelines-12-36-months',
  'vitamin-d-supplement-breastfed',
  'two-hour-cold-storage-rule',
  'choking-prevention-mealtime-basics',
  'whole-cow-milk-after-12-months',
];

const FOOD_SLUGS = ['peanut-butter-thinned', 'salmon-flaked'];

async function loadKnowledge() {
  const [guides, rules, foods, sourceMap] = await Promise.all([
    knowledgeBase.getGuides({ locale: 'Global' }),
    knowledgeBase.getRules('Global'),
    knowledgeBase.getFoods('Global'),
    knowledgeBase.getSourcesMap(),
  ]);

  const resolveSources = (ids: string[]) =>
    ids.map((id) => sourceMap.get(id)).filter(Boolean) as KnowledgeSource[];

  const selectedGuides = guides.filter((guide) => GUIDE_SLUGS.includes(guide.slug));
  const selectedRules = rules.filter((rule) => RULE_SLUGS.includes(rule.slug));
  const selectedFoods = foods.filter((food) => FOOD_SLUGS.includes(food.slug));

  return {
    guides: selectedGuides.map((guide) => ({ guide: guide as KnowledgeGuide, sources: resolveSources(guide.source_ids || []) })),
    rules: selectedRules.map((rule) => ({ rule: rule as KnowledgeRule, sources: resolveSources(rule.source_ids || []) })),
    foods: selectedFoods.map((food) => ({ food: food as KnowledgeFood, sources: resolveSources(food.source_ids || []) })),
  };
}

export const metadata = {
  title: 'North America Infant Feeding Overview | JupitLunar',
  description:
    'Single-page executive summary for 0–24 month feeding in the U.S. and Canada: TL;DR guidance, age-stage matrix, safety guardrails, and micronutrient quick reference built from CDC, Health Canada, AAP, and CPS sources.',
};

import Script from 'next/script';
import { generateMedicalWebPageSchema } from '@/lib/aeo-optimizations';
import { generateBreadcrumbSchema, BREADCRUMB_PATHS } from '@/lib/breadcrumbs';

export default async function NorthAmericaOverviewPage() {
  const { guides, rules, foods } = await loadKnowledge();

  const schema = generateMedicalWebPageSchema({
    slug: 'topics/north-america-overview',
    title: 'North America Infant Feeding Overview',
    one_liner: 'Executive summary for 0–24 month feeding in the U.S. and Canada: TL;DR guidance, age-stage matrix, safety guardrails, and micronutrient quick reference.',
    hub: 'Infant Feeding',
    age_range: '0-24 months',
    lang: 'en',
    region: 'North America',
    date_published: '2025-09-22',
    date_modified: new Date().toISOString().split('T')[0],
    last_reviewed: '2025-09-22',
    keywords: ['infant feeding', 'baby food guide', 'North America feeding guidelines', 'starting solids'],
    citations: [
      { title: 'Infant and Toddler Nutrition', url: 'https://www.cdc.gov/nutrition/infantandtoddlernutrition', publisher: 'CDC' },
      { title: 'Nutrition for Healthy Term Infants', url: 'https://www.canada.ca/en/health-canada/services/food-nutrition/healthy-eating/infant-feeding', publisher: 'Health Canada' },
      { title: 'Starting Solid Foods', url: 'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Starting-Solid-Foods.aspx', publisher: 'AAP' }
    ]
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    BREADCRUMB_PATHS.home,
    BREADCRUMB_PATHS.topics,
    { name: 'North America Overview', url: '/topics/north-america-overview' }
  ]);

  return (
    <div className="bg-gradient-to-br from-[#F8F6FC] to-[#EAE6F8] py-16">
      <Script
        id="aeo-schema-overview"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="mx-auto max-w-6xl space-y-14 px-4">
        <section className="space-y-8 rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-3xl space-y-4">
              <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-purple-700">
                Evidence snapshot · 0–24 months
              </span>
              <h1 className="text-4xl font-bold text-slate-900">North America infant & toddler feeding overview</h1>
              <p className="text-sm text-slate-600">
                Designed for clinicians, researchers, and parents who need a rapid, citation-backed view of complementary feeding
                in the United States and Canada. Pair these highlights with topic-specific playbooks for deeper dives.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-xs text-slate-600">
              <p>
                <span className="font-semibold text-slate-800">Reviewed:</span> 22 Sep 2025
              </p>
              <p>
                <span className="font-semibold text-slate-800">Next scheduled review:</span> 22 Sep 2027
              </p>
              <p>
                <span className="font-semibold text-slate-800">Regional scope:</span> U.S. & Canada
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
              <h2 className="text-base font-semibold text-emerald-900">Rapid answer TL;DR</h2>
              <ul className="mt-3 space-y-2">
                <li>
                  • Start solids around 6 months when developmental cues align; keep breast milk/formula as primary nutrition through the first year.
                </li>
                <li>
                  • Progress textures toward smooshable finger foods by 9–12 months; seat infants upright, supervise closely, and cut cylindrical foods lengthwise.
                </li>
                <li>
                  • Introduce peanut, egg, and other priority allergens early (4–6 months for high-risk infants under clinical supervision) and maintain exposures weekly.
                </li>
                <li>
                  • Hydration hierarchy: breast milk/formula under 12 months; from the first birthday offer water and whole milk, limiting 100% juice to ≤4 oz/day in cups with meals.
                </li>
                <li>
                  • Micronutrient guardrails: daily vitamin D, iron-rich foods twice daily, and fluoride supplementation only when water &lt;0.3 ppm—always verify with the child’s clinician.
                </li>
              </ul>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700">
              <h2 className="text-base font-semibold text-slate-900">How to use this page</h2>
              <p className="mt-2">
                Download the age-by-age matrix for caregiver handover, link the safety guardrails in onboarding emails, and embed the
                micronutrient reference in your EMR or patient education portal. Every section cites public-domain guidance (CDC,
                FDA/EPA, Health Canada, CPS) or paraphrased professional society statements with attribution.
              </p>
            </article>
          </div>
        </section>

        <section className="space-y-6">
          <header className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">Executive guides</h2>
            <p className="text-sm text-slate-600">TL;DR, age matrix, safety guardrails, and micronutrient reference—all citation ready.</p>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            {guides.length === 0 && <p className="text-sm text-slate-500">Guides will appear once the knowledge base data is seeded.</p>}
            {guides.map(({ guide, sources }) => (
              <GuideCard key={guide.id} guide={guide} sources={sources} />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <header className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">Safety-critical rules</h2>
            <p className="text-sm text-slate-600">Botulism prevention, beverage limits, vitamin D, and cold-chain rules that underpin the overview.</p>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            {rules.length === 0 && <p className="text-sm text-slate-500">Rules will load after the knowledge base seeding script runs.</p>}
            {rules.map(({ rule, sources }) => (
              <RuleCard key={rule.id} rule={rule} sources={sources} />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <header className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">Hero foods & textures</h2>
            <p className="text-sm text-slate-600">Reference examples for iron-rich and omega-3 sources that support the weekly rotation.</p>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            {foods.length === 0 && <p className="text-sm text-slate-500">Food examples will appear after seeding.</p>}
            {foods.map(({ food, sources }) => (
              <FoodCard key={food.id} food={food} sources={sources} />
            ))}
          </div>
        </section>

        <section className="space-y-3 rounded-3xl border border-slate-200 bg-white px-8 py-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Clinical caveat</h2>
          <p className="text-sm text-slate-600">
            This consolidated page is educational. Always personalise feeding, supplementation, and allergen plans with the child’s
            primary care clinician—especially for preterm infants, growth concerns, food insecurity, or chronic disease.
          </p>
          <DisclaimerNotice variant="medical" />
        </section>
      </div>
    </div>
  );
}
