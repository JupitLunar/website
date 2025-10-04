import React from 'react';
import { knowledgeBase } from '@/lib/supabase';
import RuleCard from '@/components/kb/RuleCard';
import FoodCard from '@/components/kb/FoodCard';
import GuideCard from '@/components/kb/GuideCard';
import DisclaimerNotice from '@/components/kb/DisclaimerNotice';
import type { KnowledgeRule, KnowledgeFood, KnowledgeGuide, KnowledgeSource } from '@/types/content';

const TRAVEL_RULES = ['safe-transport-expressed-milk', 'two-hour-cold-storage-rule'];
const TRAVEL_FOODS = ['yogurt'];
const TRAVEL_GUIDES = [
  'pumping-while-traveling-checklist',
  'daycare-milk-hand-off',
  'travel-feeding-checklist-expanded',
];

async function loadKnowledge() {
  const [rules, foods, guides, sourceMap] = await Promise.all([
    knowledgeBase.getRules('Global'),
    knowledgeBase.getFoods('Global'),
    knowledgeBase.getGuides({ locale: 'Global' }),
    knowledgeBase.getSourcesMap(),
  ]);

  const resolveSources = (ids: string[]) =>
    ids.map((id) => sourceMap.get(id)).filter(Boolean) as KnowledgeSource[];

  const selectedRules = rules.filter((rule) => TRAVEL_RULES.includes(rule.slug));
  const selectedFoods = foods.filter((food) => TRAVEL_FOODS.includes(food.slug));
  const selectedGuides = guides.filter((guide) => TRAVEL_GUIDES.includes(guide.slug));

  return {
    rules: selectedRules.map((rule) => ({ rule, sources: resolveSources(rule.source_ids || []) })),
    foods: selectedFoods.map((food) => ({ food, sources: resolveSources(food.source_ids || []) })),
    guides: selectedGuides.map((guide) => ({ guide, sources: resolveSources(guide.source_ids || []) })),
  };
}

export const metadata = {
  title: 'Travel & Daycare Logistics | JupitLunar',
  description:
    'Keep expressed milk safe, brief childcare teams, and manage travel-day nourishment using CDC, TSA, and USDA guidance.',
};

export default async function TravelDaycarePage() {
  const { rules, foods, guides } = await loadKnowledge();

  return (
    <div className="bg-gradient-to-br from-[#F8F6FC] to-[#EAE6F8] py-12">
      <div className="mx-auto max-w-6xl space-y-12 px-4">
        <section className="space-y-6 rounded-3xl border border-slate-200 bg-white px-8 py-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Travel & daycare logistics</h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Navigate pump-friendly travel days, cooler bag protocols, and daycare hand-offs. Content blends CDC storage
                limits, TSA screening rules, and USDA food safety guidance with practical checklists.
              </p>
            </div>
            <div className="text-xs text-slate-500">
              <p>
                <span className="font-semibold">Last comprehensive review:</span> Mar 2, 2024
              </p>
              <p>
                <span className="font-semibold">Next scheduled review:</span> Mar 2, 2026
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
            <span className="font-semibold">Transparency pledge:</span> Derived from TSA allowances, CDC breast milk handling
            rules, and USDA cold-chain standards. Provisional until external lactation consultants complete review.
          </div>
        </section>

        <section className="space-y-6">
          <header className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">Ready-to-use checklists</h2>
            <p className="text-sm text-slate-600">Prep for flights, commute drop-offs, and on-the-road feeding windows.</p>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            {guides.length === 0 && <p className="text-sm text-slate-500">Guides will appear once seeding is complete.</p>}
            {guides.map(({ guide, sources }) => (
              <GuideCard key={guide.id} guide={guide as KnowledgeGuide} sources={sources} />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <header className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">Cold-chain guardrails</h2>
            <p className="text-sm text-slate-600">Protect pumped milk quality from kitchen to caregiver hand-off.</p>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            {rules.length === 0 && <p className="text-sm text-slate-500">Rules publish after knowledge base seeding.</p>}
            {rules.map(({ rule, sources }) => (
              <RuleCard key={rule.id} rule={rule as KnowledgeRule} sources={sources} />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <header className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">Travel-friendly staples</h2>
            <p className="text-sm text-slate-600">Portable options that tolerate coolers and complement pumped milk feeds.</p>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            {foods.length === 0 && <p className="text-sm text-slate-500">Food ideas will surface after seeding.</p>}
            {foods.map(({ food, sources }) => (
              <FoodCard key={food.id} food={food as KnowledgeFood} sources={sources} />
            ))}
          </div>
        </section>

        <section className="space-y-3 rounded-3xl border border-slate-200 bg-white px-8 py-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Need backup?</h2>
          <p className="text-sm text-slate-600">
            Coordinate with your daycare director, lactation consultant, or pediatric dietitian when storing milk for
            medically fragile infants or managing complex schedules. Ensure emergency contact plans are documented.
          </p>
          <DisclaimerNotice variant="medical" />
        </section>
      </div>
    </div>
  );
}
