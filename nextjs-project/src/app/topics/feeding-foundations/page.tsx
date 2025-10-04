import React from 'react';
import Script from 'next/script';
import { knowledgeBase } from '@/lib/supabase';
import RuleCard from '@/components/kb/RuleCard';
import FoodCard from '@/components/kb/FoodCard';
import GuideCard from '@/components/kb/GuideCard';
import DisclaimerNotice from '@/components/kb/DisclaimerNotice';
import { generateTopicCollectionSchema, generateBreadcrumbSchema } from '@/lib/schema-generators';
import type { KnowledgeRule, KnowledgeFood, KnowledgeGuide, KnowledgeSource } from '@/types/content';

const FOUNDATION_RULES = ['no-juice-before-12-months', 'wean-bottles-by-18-months'];
const FOUNDATION_FOODS = ['carrot', 'egg'];
const FOUNDATION_GUIDES = ['feeding-readiness-checklist', 'texture-progression-roadmap', 'cup-transition-plan'];

async function loadKnowledge() {
  const [rules, foods, guides, sourceMap] = await Promise.all([
    knowledgeBase.getRules('Global'),
    knowledgeBase.getFoods('Global'),
    knowledgeBase.getGuides({ locale: 'Global' }),
    knowledgeBase.getSourcesMap(),
  ]);

  const resolveSources = (ids: string[]) =>
    ids.map((id) => sourceMap.get(id)).filter(Boolean) as KnowledgeSource[];

  const selectedRules = rules.filter((rule) => FOUNDATION_RULES.includes(rule.slug));
  const selectedFoods = foods.filter((food) => FOUNDATION_FOODS.includes(food.slug));
  const selectedGuides = guides.filter((guide) => FOUNDATION_GUIDES.includes(guide.slug));

  return {
    rules: selectedRules.map((rule) => ({ rule, sources: resolveSources(rule.source_ids || []) })),
    foods: selectedFoods.map((food) => ({ food, sources: resolveSources(food.source_ids || []) })),
    guides: selectedGuides.map((guide) => ({ guide, sources: resolveSources(guide.source_ids || []) })),
  };
}

export const metadata = {
  title: 'Feeding Foundations 0–18 Months | JupitLunar',
  description:
    'Readiness cues, texture progression, and cup transition strategies for infants and toddlers. Built from CDC, AAP, and Health Canada guidance for North American families.',
};

export default async function FeedingFoundationsPage() {
  const { rules, foods, guides } = await loadKnowledge();

  // Generate Schema.org structured data
  const topicSchema = generateTopicCollectionSchema({
    title: 'Feeding Foundations (0–18 months)',
    slug: 'feeding-foundations',
    description: metadata.description,
    ageRange: '0–18 months',
    lastReviewed: '2024-03-01',
    itemCount: rules.length + foods.length + guides.length,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Topics', url: '/topics' },
    { name: 'Feeding Foundations', url: '/topics/feeding-foundations' },
  ]);

  return (
    <>
      {/* Schema.org Structured Data */}
      <Script
        id="topic-collection-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(topicSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="bg-gradient-to-br from-[#F8F6FC] to-[#EAE6F8] py-12">
      <div className="mx-auto max-w-6xl space-y-12 px-4">
        <section className="space-y-6 rounded-3xl border border-slate-200 bg-white px-8 py-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Feeding Foundations (0–18 months)</h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Use this roadmap to confirm solid-readiness signs, plan texture progression, and organise the bottle-to-cup
                transition. Recommendations synthesize CDC, AAP/HealthyChildren, Health Canada, and CPS guidance for
                North American families.
              </p>
            </div>
            <div className="text-xs text-slate-500">
              <p><span className="font-semibold">Last comprehensive review:</span> Mar 1, 2024</p>
              <p><span className="font-semibold">Next scheduled review:</span> Mar 1, 2026</p>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
            <span className="font-semibold">Transparency pledge:</span> We cite public-domain CDC content and paraphrase AAP/HealthyChildren statements with attribution. Cross-border differences (U.S./Canada) are flagged where relevant.
          </div>
        </section>

        <section className="space-y-6">
          <header className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">Step-by-step guides</h2>
            <p className="text-sm text-slate-600">Assess readiness, map textures, and plan cup practice.</p>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            {guides.length === 0 && <p className="text-sm text-slate-500">Guides will appear after the knowledge base is seeded.</p>}
            {guides.map(({ guide, sources }) => (
              <GuideCard key={guide.id} guide={guide as KnowledgeGuide} sources={sources} />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <header className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">Foundational rules</h2>
            <p className="text-sm text-slate-600">Guardrails that protect development and oral health.</p>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            {rules.length === 0 && <p className="text-sm text-slate-500">Rules are ready once seeded.</p>}
            {rules.map(({ rule, sources }) => (
              <RuleCard key={rule.id} rule={rule as KnowledgeRule} sources={sources} />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <header className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">Starter foods & textures</h2>
            <p className="text-sm text-slate-600">Age-appropriate examples for iron-rich and allergen foods.</p>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            {foods.length === 0 && <p className="text-sm text-slate-500">Food examples load after seeding.</p>}
            {foods.map(({ food, sources }) => (
              <FoodCard key={food.id} food={food as KnowledgeFood} sources={sources} />
            ))}
          </div>
        </section>

        <section className="space-y-3 rounded-3xl border border-slate-200 bg-white px-8 py-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Need personalised support?</h2>
          <p className="text-sm text-slate-600">
            This roadmap is for education. Always consult your pediatrician, public health nurse, or dietitian when your
            child has preterm history, feeding difficulties, or growth concerns.
          </p>
          <DisclaimerNotice variant="medical" />
        </section>
      </div>
    </div>
    </>
  );
}
