import React from 'react';
import { knowledgeBase } from '@/lib/supabase';
import RuleCard from '@/components/kb/RuleCard';
import FoodCard from '@/components/kb/FoodCard';
import GuideCard from '@/components/kb/GuideCard';
import DisclaimerNotice from '@/components/kb/DisclaimerNotice';
import type { KnowledgeRule, KnowledgeFood, KnowledgeGuide, KnowledgeSource } from '@/types/content';

const HOLIDAY_RULES = [
  'choking-prevention-mealtime-basics',
  'two-hour-cold-storage-rule',
  'maintain-weekly-allergen-exposure',
];
const HOLIDAY_FOODS = ['carrot', 'yogurt', 'shrimp'];
const HOLIDAY_GUIDES = ['holiday-meal-strategies', 'holiday-allergen-checklist', 'travel-feeding-checklist'];

async function loadKnowledge() {
  const [rules, foods, guides, sourceMap] = await Promise.all([
    knowledgeBase.getRules('Global'),
    knowledgeBase.getFoods('Global'),
    knowledgeBase.getGuides({ locale: 'Global' }),
    knowledgeBase.getSourcesMap(),
  ]);

  const resolveSources = (ids: string[]) =>
    ids.map((id) => sourceMap.get(id)).filter(Boolean) as KnowledgeSource[];

  const selectedRules = rules.filter((rule) => HOLIDAY_RULES.includes(rule.slug));
  const selectedFoods = foods.filter((food) => HOLIDAY_FOODS.includes(food.slug));
  const selectedGuides = guides.filter((guide) => HOLIDAY_GUIDES.includes(guide.slug));

  return {
    rules: selectedRules.map((rule) => ({ rule, sources: resolveSources(rule.source_ids || []) })),
    foods: selectedFoods.map((food) => ({ food, sources: resolveSources(food.source_ids || []) })),
    guides: selectedGuides.map((guide) => ({ guide, sources: resolveSources(guide.source_ids || []) })),
  };
}

export const metadata = {
  title: 'Holiday Planning & Gatherings | JupitLunar',
  description:
    'Keep celebrations safe with choking prevention, allergen safeguards, and two-hour leftovers rules sourced from AAP, USDA, and allergy societies.',
};

export default async function HolidayPlanningPage() {
  const { rules, foods, guides } = await loadKnowledge();

  return (
    <div className="bg-gradient-to-br from-[#F8F6FC] to-[#EAE6F8] py-12">
      <div className="mx-auto max-w-6xl space-y-12 px-4">
        <section className="space-y-6 rounded-3xl border border-slate-200 bg-white px-8 py-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Holiday planning & gatherings</h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Use this playbook to prep safe buffet plates, maintain allergen exposure, and store leftovers. Recommendations
                synthesise AAP/HealthyChildren choking advisories, USDA food safety timelines, and allergy society cross-contact
                guidance.
              </p>
            </div>
            <div className="text-xs text-slate-500">
              <p>
                <span className="font-semibold">Last comprehensive review:</span> Mar 2, 2024
              </p>
              <p>
                <span className="font-semibold">Next scheduled review:</span> Dec 1, 2025
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
            <span className="font-semibold">Transparency pledge:</span> Built from AAP, USDA, FDA/CDC, and NIAID/AAAAI allergy
            references. Cards labelled provisional until the external holiday safety review is completed.
          </div>
        </section>

        <section className="space-y-6">
          <header className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">Strategy guides</h2>
            <p className="text-sm text-slate-600">Stay ahead of travel days, large meals, and allergen mixing.</p>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            {guides.length === 0 && <p className="text-sm text-slate-500">Guides will display after seeding.</p>}
            {guides.map(({ guide, sources }) => (
              <GuideCard key={guide.id} guide={guide as KnowledgeGuide} sources={sources} />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <header className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">Non-negotiable rules</h2>
            <p className="text-sm text-slate-600">Keep choking hazards off the buffet and maintain safe leftovers handling.</p>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            {rules.length === 0 && <p className="text-sm text-slate-500">Rules will load after the knowledge base is seeded.</p>}
            {rules.map(({ rule, sources }) => (
              <RuleCard key={rule.id} rule={rule as KnowledgeRule} sources={sources} />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <header className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">Holiday-friendly menu swaps</h2>
            <p className="text-sm text-slate-600">Offer safe textures and allergen rotation even when routines shift.</p>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            {foods.length === 0 && <p className="text-sm text-slate-500">Food cards arrive once seeding completes.</p>}
            {foods.map(({ food, sources }) => (
              <FoodCard key={food.id} food={food as KnowledgeFood} sources={sources} />
            ))}
          </div>
        </section>

        <section className="space-y-3 rounded-3xl border border-slate-200 bg-white px-8 py-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Emergency readiness</h2>
          <p className="text-sm text-slate-600">
            Share allergen action plans with hosts, keep epinephrine and first aid supplies on hand, and review CPR skills
            ahead of gatherings. Seek urgent medical attention for any signs of anaphylaxis or choking.
          </p>
          <DisclaimerNotice variant="medical" />
        </section>
      </div>
    </div>
  );
}
