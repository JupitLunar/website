import React from 'react';
import type { KnowledgeSource } from '@/types/content';

interface SourceListProps {
  sources: KnowledgeSource[];
}

const gradeDescriptions: Record<string, string> = {
  A: 'Official guideline or government agency',
  B: 'Peer-reviewed or academic consensus',
  C: 'Hospital or clinical expert publication',
  D: 'Reputable media summary',
};

function formatDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function SourceList({ sources }: SourceListProps) {
  if (!sources.length) return null;
  return (
    <div className="space-y-1 text-xs text-gray-500">
      <h4 className="font-semibold text-gray-700">Authoritative sources</h4>
      <ul className="space-y-1">
        {sources.map((source) => (
          <li key={source.id} className="space-y-1">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-purple-600 underline"
            >
              {source.name}
            </a>
            {source.organization ? ` · ${source.organization}` : ''}
            {source.grade && (
              <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-gray-600">
                {source.grade}
              </span>
            )}
            {source.grade && gradeDescriptions[source.grade] && (
              <span className="ml-2 text-[10px] text-gray-400">{gradeDescriptions[source.grade]}</span>
            )}
            {(source.notes || source.retrieved_at) && (
              <div className="flex flex-wrap gap-2 text-[11px] text-gray-500">
                {source.notes && <span className="italic text-gray-500">{source.notes}</span>}
                {source.retrieved_at && (
                  <span className="text-gray-400">Last verified {formatDate(source.retrieved_at)}</span>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
