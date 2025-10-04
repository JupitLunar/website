import React from 'react';
import { knowledgeBase } from '@/lib/supabase';
import RuleCard from '@/components/kb/RuleCard';
import FoodCard from '@/components/kb/FoodCard';
import GuideCard from '@/components/kb/GuideCard';
import DisclaimerNotice from '@/components/kb/DisclaimerNotice';
import type { KnowledgeRule, KnowledgeFood, KnowledgeGuide, KnowledgeSource } from '@/types/content';

const NUTRIENT_RULES = [
  'offer-iron-rich-foods-daily',
  'vitamin-d-supplement-breastfed',
  'spread-calcium-servings',
];
const NUTRIENT_FOODS = ['beef', 'lentils', 'salmon', 'yogurt'];
const NUTRIENT_GUIDES = ['iron-and-vitamin-d-playbook', 'faq-rice-cereal-first'];

async function loadKnowledge() {
  const [rules, foods, guides, sourceMap] = await Promise.all([
    knowledgeBase.getRules('Global'),
    knowledgeBase.getFoods('Global'),
    knowledgeBase.getGuides({ locale: 'Global' }),
    knowledgeBase.getSourcesMap(),
  ]);

  const resolveSources = (ids: string[]) =>
    ids.map((id) => sourceMap.get(id)).filter(Boolean) as KnowledgeSource[];

  const selectedRules = rules.filter((rule) => NUTRIENT_RULES.includes(rule.slug));
  const selectedFoods = foods.filter((food) => NUTRIENT_FOODS.includes(food.slug));
  const selectedGuides = guides.filter((guide) => NUTRIENT_GUIDES.includes(guide.slug));

  return {
    rules: selectedRules.map((rule) => ({ rule, sources: resolveSources(rule.source_ids || []) })),
    foods: selectedFoods.map((food) => ({ food, sources: resolveSources(food.source_ids || []) })),
    guides: selectedGuides.map((guide) => ({ guide, sources: resolveSources(guide.source_ids || []) })),
  };
}

export const metadata = {
  title: 'Nutrient Priorities: Iron, Vitamin D & Calcium | JupitLunar',
  description:
    'Plan daily iron foods, vitamin D supplementation, and balanced calcium servings for infants and toddlers using WHO, CPS, and NIH guidance.',
};

export default async function NutrientPrioritiesPage() {
  const { rules, foods, guides } = await loadKnowledge();

  return (
    <div className="bg-gradient-to-br from-[#F8F6FC] to-[#EAE6F8] py-12">
      <div className="mx-auto max-w-6xl space-y-12 px-4">
        <section className="space-y-6 rounded-3xl border border-slate-200 bg-white px-8 py-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Nutrient priorities (6–24 months)</h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Coordinate iron-rich meals, vitamin D drops, and calcium servings without crowding out appetite. Guidance
                distills WHO complementary feeding principles, CPS iron and vitamin D statements, and NIH calcium intake
                targets for North American families.
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
            <span className="font-semibold">Transparency pledge:</span> Sources include WHO complementary feeding guidelines,
            Canadian Paediatric Society iron and vitamin D positions, and NIH calcium reference intakes. Entries are marked
            as provisional until external reviewers sign off.
          </div>
        </section>

        <section className="space-y-6">
          <header className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">Roadmaps & myth-busting</h2>
            <p className="text-sm text-slate-600">Use meal planners and FAQs to keep micronutrient targets on track.</p>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            {guides.length === 0 && <p className="text-sm text-slate-500">Guides will appear once knowledge is seeded.</p>}
            {guides.map(({ guide, sources }) => (
              <GuideCard key={guide.id} guide={guide as KnowledgeGuide} sources={sources} />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <header className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">Essential rules</h2>
            <p className="text-sm text-slate-600">Guardrails covering daily iron habits, vitamin D dosing, and calcium spacing.</p>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            {rules.length === 0 && <p className="text-sm text-slate-500">Rules will appear once seeded.</p>}
            {rules.map(({ rule, sources }) => (
              <RuleCard key={rule.id} rule={rule as KnowledgeRule} sources={sources} />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <header className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">Iron & calcium food rotation</h2>
            <p className="text-sm text-slate-600">Mix heme, plant, and dairy sources to balance iron absorption and bone health.</p>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            {foods.length === 0 && <p className="text-sm text-slate-500">Food examples appear after the knowledge base is seeded.</p>}
            {foods.map(({ food, sources }) => (
              <FoodCard key={food.id} food={food as KnowledgeFood} sources={sources} />
            ))}
          </div>
        </section>

        <section className="space-y-3 rounded-3xl border border-slate-200 bg-white px-8 py-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Clinical caveats</h2>
          <p className="text-sm text-slate-600">
            Iron supplementation, vitamin D dose changes, and dairy alternatives should be personalised for premature,
            low-birth-weight, or medically complex children. Consult your pediatrician or registered dietitian for a
            tailored plan.
          </p>
          <DisclaimerNotice variant="medical" />
        </section>
      </div>
    </div>
  );
}
