import React from 'react';
import { knowledgeBase } from '@/lib/supabase';
import RuleCard from '@/components/kb/RuleCard';
import FoodCard from '@/components/kb/FoodCard';
import GuideCard from '@/components/kb/GuideCard';
import DisclaimerNotice from '@/components/kb/DisclaimerNotice';
import type {
  KnowledgeGuide,
  KnowledgeRule,
  KnowledgeFood,
  KnowledgeSource,
} from '@/types/content';

const SAFETY_RULES = [
  'choking-prevention-mealtime-basics',
  'two-hour-cold-storage-rule',
  'no-honey-before-12-months',
];

const SAFETY_FOODS = ['grape'];

const SAFETY_GUIDES = ['travel-feeding-checklist'];

async function loadKnowledge() {
  const [rules, foods, guides, sourceMap] = await Promise.all([
    knowledgeBase.getRules('Global'),
    knowledgeBase.getFoods('Global'),
    knowledgeBase.getGuides({ locale: 'Global' }),
    knowledgeBase.getSourcesMap(),
  ]);

  const pickRules = rules.filter((rule) => SAFETY_RULES.includes(rule.slug));
  const pickFoods = foods.filter((food) => SAFETY_FOODS.includes(food.slug));
  const pickGuides = guides.filter((guide) => SAFETY_GUIDES.includes(guide.slug));

  const resolveSources = (ids: string[]) =>
    ids.map((id) => sourceMap.get(id)).filter(Boolean) as KnowledgeSource[];

  return {
    rules: pickRules.map((rule) => ({ rule, sources: resolveSources(rule.source_ids || []) })),
    foods: pickFoods.map((food) => ({ food, sources: resolveSources(food.source_ids || []) })),
    guides: pickGuides.map((guide) => ({ guide, sources: resolveSources(guide.source_ids || []) })),
  };
}

export const metadata = {
  title: 'Feeding Safety & Hygiene | JupitLunar',
  description:
    'Authoritative safety and hygiene checklist for North American parents: choking prevention, cold-storage rules, travel tips, and food handling guidance.',
};

export default async function FeedingSafetyPage() {
  const { rules, foods, guides } = await loadKnowledge();

  return (
    <div className="bg-gradient-to-br from-[#F8F6FC] to-[#EAE6F8] py-12">
      <div className="mx-auto max-w-6xl space-y-12 px-4">
        <section className="space-y-6 rounded-3xl border border-slate-200 bg-white px-8 py-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Feeding Safety & Hygiene</h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Curated guidance for North American caregivers, synthesising CDC, AAP, FoodSafety.gov, and Health Canada
                publications. Use this checklist to create a safe feeding environment, handle food properly, and stay
                prepared when travelling with your baby.
              </p>
            </div>
            <div className="text-xs text-slate-500">
              <p>
                <span className="font-semibold">Last comprehensive review:</span> Feb 24, 2024
              </p>
              <p>
                <span className="font-semibold">Next scheduled review:</span> Feb 24, 2026
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
            <span className="font-semibold">Transparency pledge:</span> Every recommendation links back to the
            originating agency. Look for the evidence grade badges (A = official guideline, B = academic consensus).
            Feedback or corrections? Email{' '}
            <a className="text-purple-600 underline" href="mailto:hello@jupitlunar.com">
              hello@jupitlunar.com
            </a>
            .
          </div>
        </section>

        <section className="space-y-6">
          <header className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">Priority safety rules</h2>
            <p className="text-sm text-slate-600">
              Evidence-backed guardrails for choking prevention, safe storage, and age-appropriate beverages.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            {rules.length === 0 && (
              <p className="text-sm text-slate-500">No rules found. Seed the knowledge base first.</p>
            )}
            {rules.map(({ rule, sources }) => (
              <RuleCard key={rule.id} rule={rule as KnowledgeRule} sources={sources} />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <header className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">High-risk food handling</h2>
            <p className="text-sm text-slate-600">Step-by-step preparation guidance for choking-prone foods.</p>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            {foods.length === 0 && <p className="text-sm text-slate-500">No food items available.</p>}
            {foods.map(({ food, sources }) => (
              <FoodCard key={food.id} food={food as KnowledgeFood} sources={sources} />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <header className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">Scenario planning</h2>
            <p className="text-sm text-slate-600">
              Checklists for travel, daycare handoff, and on-the-go feeding hygiene.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            {guides.length === 0 && <p className="text-sm text-slate-500">No guides published yet.</p>}
            {guides.map(({ guide, sources }) => (
              <GuideCard key={guide.id} guide={guide as KnowledgeGuide} sources={sources} />
            ))}
          </div>
        </section>

        <section className="space-y-3 rounded-3xl border border-slate-200 bg-white px-8 py-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Need personalised support?</h2>
          <p className="text-sm text-slate-600">
            JupitLunar summarises reputable public health guidance but we are not a substitute for licensed medical
            professionals. Contact your pediatrician, registered dietitian, or the local health authority for
            case-specific advice. If you suspect choking, call emergency services immediately.
          </p>
          <DisclaimerNotice variant="medical" />
        </section>
      </div>
    </div>
  );
}
