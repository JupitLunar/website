import React from 'react';
import type { KnowledgeGuide, KnowledgeSource } from '@/types/content';
import SourceMeta from './SourceMeta';
import SourceList from './SourceList';
import DisclaimerNotice from './DisclaimerNotice';

interface GuideCardProps {
  guide: KnowledgeGuide;
  sources?: KnowledgeSource[];
}

export default function GuideCard({ guide, sources = [] }: GuideCardProps) {
  return (
    <article className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <header className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">
          {guide.guide_type}
        </span>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
          {guide.locale}
        </span>
        {guide.age_range.length > 0 && (
          <div className="flex flex-wrap gap-2 text-xs text-gray-600">
            {guide.age_range.map((range) => (
              <span key={range} className="rounded-full bg-gray-100 px-3 py-1">
                {range}
              </span>
            ))}
          </div>
        )}
      </header>

      <SourceMeta
        sources={sources}
        lastReviewedAt={guide.last_reviewed_at}
        expiresAt={guide.expires_at}
      />

      <div>
        <h3 className="text-xl font-semibold text-gray-900">{guide.title}</h3>
        <p className="mt-2 text-gray-600">{guide.summary}</p>
      </div>

      {guide.body_md && (
        <section className="prose prose-sm max-w-none text-gray-700">
          {guide.body_md.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph.replace(/^##?\s*/, '')}</p>
          ))}
        </section>
      )}

      {guide.checklist.length > 0 && (
        <section className="rounded-xl bg-gray-50 p-4">
          <h4 className="text-sm font-semibold text-gray-800">Checklist</h4>
          <ul className="mt-2 space-y-1 text-sm text-gray-700">
            {guide.checklist.map((item, index) => (
              <li key={index}>
                <span className="font-semibold text-gray-900">[{item.type || 'tip'}]</span> {item.label}
                {item.detail ? `: ${item.detail}` : ''}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* TODO: Resolve UUIDs to actual rule/food names before displaying */}
      {/* Temporarily hidden until we implement proper resolution */}

      <SourceList sources={sources} />

      <DisclaimerNotice variant="general" />
    </article>
  );
}
