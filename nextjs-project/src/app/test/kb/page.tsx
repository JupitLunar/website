import React from 'react';
import { knowledgeBase } from '@/lib/supabase';
import RuleCard from '@/components/kb/RuleCard';
import FoodCard from '@/components/kb/FoodCard';
import GuideCard from '@/components/kb/GuideCard';
import type { KnowledgeRule, KnowledgeFood, KnowledgeGuide, KnowledgeSource } from '@/types/content';

async function loadData() {
  const [rules, foods, guides, sourceMap] = await Promise.all([
    knowledgeBase.getRules('Global'),
    knowledgeBase.getFoods('Global'),
    knowledgeBase.getGuides({ locale: 'Global' }),
    knowledgeBase.getSourcesMap(),
  ]);

  const resolveSources = (ids: string[]) => ids.map((id) => sourceMap.get(id)).filter(Boolean) as KnowledgeSource[];

  return {
    rules: rules.slice(0, 3).map((rule) => ({ rule, sources: resolveSources(rule.source_ids || []) })),
    foods: foods.slice(0, 3).map((food) => ({ food, sources: resolveSources(food.source_ids || []) })),
    guides: guides.slice(0, 3).map((guide) => ({ guide, sources: resolveSources(guide.source_ids || []) })),
  };
}

export default async function KnowledgeBasePreviewPage() {
  const { rules, foods, guides } = await loadData();

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10">
      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Knowledge base preview</h1>
        <p className="text-sm text-slate-600">
          This sandbox renders draft knowledge items before they are published to the live site. Every entry is
          compiled from trusted North American pediatric nutrition and safety guidelines. When you publish, make sure
          to attach reviewer credentials and re-run validation.
        </p>
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          <span className="font-semibold">Transparency pledge:</span> JupitLunar curates content directly from
          CDC, AAP, Health Canada, FDA/EPA, CPS, and FoodSafety.gov publications. We surface original URLs, evidence
          grade, and review dates so parents and professionals can verify information quickly.
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900">Rules preview</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          {rules.length === 0 && <p className="text-sm text-gray-500">No data yet. Seed the database to preview content.</p>}
          {rules.map(({ rule, sources }) => (
            <RuleCard key={rule.id} rule={rule as KnowledgeRule} sources={sources} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900">Foods preview</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          {foods.length === 0 && <p className="text-sm text-gray-500">No data yet.</p>}
          {foods.map(({ food, sources }) => (
            <FoodCard key={food.id} food={food as KnowledgeFood} sources={sources} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900">Guides preview</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          {guides.length === 0 && <p className="text-sm text-gray-500">No data yet.</p>}
          {guides.map(({ guide, sources }) => (
            <GuideCard key={guide.id} guide={guide as KnowledgeGuide} sources={sources} />
          ))}
        </div>
      </section>
    </div>
  );
}
