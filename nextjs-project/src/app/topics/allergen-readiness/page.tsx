import React from 'react';
import { knowledgeBase } from '@/lib/supabase';
import RuleCard from '@/components/kb/RuleCard';
import FoodCard from '@/components/kb/FoodCard';
import GuideCard from '@/components/kb/GuideCard';
import DisclaimerNotice from '@/components/kb/DisclaimerNotice';
import type { KnowledgeRule, KnowledgeFood, KnowledgeGuide, KnowledgeSource } from '@/types/content';

const ALLERGEN_RULES = ['vitamin-d-supplement-breastfed', 'maintain-weekly-allergen-exposure'];
const ALLERGEN_FOODS = ['peanut-butter', 'egg', 'shrimp'];
const ALLERGEN_GUIDES = ['allergen-introduction-plan', 'blw-and-puree-mixed-path'];

async function loadKnowledge() {
  const [rules, foods, guides, sourceMap] = await Promise.all([
    knowledgeBase.getRules('Global'),
    knowledgeBase.getFoods('Global'),
    knowledgeBase.getGuides({ locale: 'Global' }),
    knowledgeBase.getSourcesMap(),
  ]);

  const resolveSources = (ids: string[]) =>
    ids.map((id) => sourceMap.get(id)).filter(Boolean) as KnowledgeSource[];

  const filteredRules = rules.filter((rule) => ALLERGEN_RULES.includes(rule.slug));
  const filteredFoods = foods.filter((food) => ALLERGEN_FOODS.includes(food.slug));
  const filteredGuides = guides.filter((guide) => ALLERGEN_GUIDES.includes(guide.slug));

  return {
    rules: filteredRules.map((rule) => ({ rule, sources: resolveSources(rule.source_ids || []) })),
    foods: filteredFoods.map((food) => ({ food, sources: resolveSources(food.source_ids || []) })),
    guides: filteredGuides.map((guide) => ({ guide, sources: resolveSources(guide.source_ids || []) })),
  };
}

export const metadata = {
  title: 'Allergen Readiness & Early Introduction | JupitLunar',
  description:
    'Evidence-based allergen introduction plan for infants: peanut, egg, dairy and fish exposure, plus vitamin D support and mixed feeding strategies.',
};

export default async function AllergenReadinessPage() {
  const { rules, foods, guides } = await loadKnowledge();

  return (
    <div className="bg-gradient-to-br from-[#F8F6FC] to-[#EAE6F8] py-12">
      <div className="mx-auto max-w-6xl space-y-12 px-4">
        <section className="space-y-6 rounded-3xl border border-slate-200 bg-white px-8 py-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Allergen Readiness & Early Introduction</h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Build a confident plan for introducing peanut, egg, dairy, fish, and sesame using proven protocols from
                CPS, LEAP research, AAP, and Health Canada. Blend BLW and spoon-feeding methods while maintaining vitamin
                D supplementation and consistent exposure frequency.
              </p>
            </div>
            <div className="text-xs text-slate-500">
              <p>
                <span className="font-semibold">Last comprehensive review:</span> Feb 28, 2024
              </p>
              <p>
                <span className="font-semibold">Next scheduled review:</span> Feb 28, 2026
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
            <span className="font-semibold">Transparency pledge:</span> Sources include CPS, HealthyChildren.org, FDA/EPA,
            and Health Canada. Evidence grades indicate the level of authority (A = official guideline, B = academic
            consensus). Share feedback via{' '}
            <a className="text-purple-600 underline" href="mailto:hello@jupitlunar.com">
              hello@jupitlunar.com
            </a>
            .
          </div>
        </section>

        <section className="space-y-6">
          <header className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">Key safety rules & supplements</h2>
            <p className="text-sm text-slate-600">Keep vitamin D on schedule and monitor for allergic symptoms.</p>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            {rules.length === 0 && <p className="text-sm text-slate-500">No allergen rules found.</p>}
            {rules.map(({ rule, sources }) => (
              <RuleCard key={rule.id} rule={rule as KnowledgeRule} sources={sources} />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <header className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">Allergen starter foods</h2>
            <p className="text-sm text-slate-600">
              Safe preparation techniques for peanut butter, egg, and other high-value allergens.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            {foods.length === 0 && <p className="text-sm text-slate-500">Add allergen foods to the knowledge base.</p>}
            {foods.map(({ food, sources }) => (
              <FoodCard key={food.id} food={food as KnowledgeFood} sources={sources} />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <header className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">Exposure roadmap</h2>
            <p className="text-sm text-slate-600">
              Follow a weekly plan for mixed feeding and ongoing allergen maintenance.
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
          <h2 className="text-xl font-semibold text-slate-900">Emergency readiness</h2>
          <p className="text-sm text-slate-600">
            Introduce allergens in daylight hours with medical support available. Contact an allergist when severe eczema
            or family history is present before starting. For signs of an allergic reaction (rash, swelling, difficulty
            breathing), call emergency services immediately.
          </p>
          <DisclaimerNotice variant="medical" />
        </section>
      </div>
    </div>
  );
}
