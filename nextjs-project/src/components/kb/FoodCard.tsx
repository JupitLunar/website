import React from 'react';
import type { KnowledgeFood, KnowledgeSource } from '@/types/content';
import RiskBadge from './RiskBadge';
import SourceMeta from './SourceMeta';
import SourceList from './SourceList';
import DisclaimerNotice from './DisclaimerNotice';

interface FoodCardProps {
  food: KnowledgeFood;
  sources?: KnowledgeSource[];
}

export default function FoodCard({ food, sources = [] }: FoodCardProps) {
  return (
    <article className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <header className="flex flex-wrap items-center gap-3">
        <RiskBadge level={food.risk_level} />
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
          {food.locale}
        </span>
        <div className="flex flex-wrap gap-2 text-xs text-gray-600">
          {food.age_range.map((range) => (
            <span key={range} className="rounded-full bg-gray-100 px-3 py-1">
              {range}
            </span>
          ))}
        </div>
      </header>

      <SourceMeta
        sources={sources}
        lastReviewedAt={food.last_reviewed_at}
        expiresAt={food.expires_at}
      />

      <div>
        <h3 className="text-xl font-semibold text-gray-900">{food.name}</h3>
        {food.why && <p className="mt-1 text-gray-600">{food.why}</p>}
      </div>

      {food.serving_forms.length > 0 && (
        <section>
          <h4 className="text-sm font-semibold text-gray-800">Serving guidance</h4>
          <div className="mt-2 space-y-3">
            {food.serving_forms.map((form, index) => (
              <div key={index} className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                <div className="font-medium text-gray-900">{form.age_range}</div>
                <p>{form.form}</p>
                <ul className="mt-1 space-y-1 text-xs text-gray-600">
                  {form.texture && <li><span className="font-semibold">Texture:</span> {form.texture}</li>}
                  {form.prep && <li><span className="font-semibold">Prep:</span> {form.prep}</li>}
                  {form.notes && <li><span className="font-semibold">Notes:</span> {form.notes}</li>}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {(food.do_list.length > 0 || (food.dont_list && food.dont_list.length > 0)) && (
        <section className="grid gap-3 md:grid-cols-2">
          {food.do_list.length > 0 && (
            <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
              <h4 className="font-semibold">Tips</h4>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {food.do_list.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {food.dont_list && food.dont_list.length > 0 && (
            <div className="rounded-lg bg-rose-50 p-3 text-sm text-rose-800">
              <h4 className="font-semibold">Avoid</h4>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {food.dont_list.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {food.portion_hint && (
        <p className="rounded-lg bg-indigo-50 p-3 text-sm text-indigo-800">
          <span className="font-semibold">Portion hint:</span> {food.portion_hint}
        </p>
      )}

      <SourceList sources={sources} />

      <DisclaimerNotice />
    </article>
  );
}
