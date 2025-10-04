import React from 'react';
import type { KnowledgeRule, KnowledgeSource } from '@/types/content';
import RiskBadge from './RiskBadge';
import SourceMeta from './SourceMeta';
import SourceList from './SourceList';
import DisclaimerNotice from './DisclaimerNotice';

interface RuleCardProps {
  rule: KnowledgeRule;
  sources?: KnowledgeSource[];
}

export default function RuleCard({ rule, sources = [] }: RuleCardProps) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <header className="flex flex-wrap items-center gap-3">
        <RiskBadge level={rule.risk_level} />
        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
          {rule.locale}
        </span>
      </header>

      <div>
        <h3 className="text-xl font-semibold text-gray-900">{rule.title}</h3>
        <p className="mt-2 text-gray-600">{rule.summary}</p>
      </div>

      <SourceMeta
        sources={sources}
        lastReviewedAt={rule.last_reviewed_at}
        expiresAt={rule.expires_at}
      />

      <section className="flex flex-col gap-3">
        {rule.do_list.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-emerald-700">Recommended</h4>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-gray-700">
              {rule.do_list.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {rule.dont_list && rule.dont_list.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-rose-700">Avoid</h4>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-gray-700">
              {rule.dont_list.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {rule.how_to && rule.how_to.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-800">How to apply</h4>
            <ol className="mt-1 space-y-1 text-sm text-gray-700">
              {rule.how_to.map((step, index) => (
                <li key={index}>
                  <span className="font-medium text-gray-900">{step.title}:</span> {step.description}
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>

      {rule.why && (
        <p className="rounded-lg bg-orange-50 p-3 text-sm text-orange-800">
          <span className="font-semibold">Why it matters:</span> {rule.why}
        </p>
      )}

      <SourceList sources={sources} />

      {rule.compliance_notes ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          <span className="font-semibold">Compliance note:</span> {rule.compliance_notes}
        </div>
      ) : null}

      <DisclaimerNotice variant="medical" />
    </article>
  );
}
