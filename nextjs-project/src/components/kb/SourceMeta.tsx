import React from 'react';
import Link from 'next/link';

export interface SourceReference {
  id: string;
  name: string;
  organization?: string;
  url: string;
  grade: 'A' | 'B' | 'C' | 'D';
  retrieved_at?: string;
}

interface SourceMetaProps {
  sources?: SourceReference[];
  lastReviewedAt?: string;
  expiresAt?: string;
  compact?: boolean;
}

function formatDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });
}

const gradeInfo = {
  A: { label: 'Government Guidelines', color: 'text-green-700 bg-green-50 border-green-200', icon: '🏛️' },
  B: { label: 'Peer-Reviewed Research', color: 'text-blue-700 bg-blue-50 border-blue-200', icon: '📚' },
  C: { label: 'Expert Publications', color: 'text-yellow-700 bg-yellow-50 border-yellow-200', icon: '👨‍⚕️' },
  D: { label: 'Educational Resources', color: 'text-gray-700 bg-gray-50 border-gray-200', icon: '📖' },
};

export default function SourceMeta({ sources = [], lastReviewedAt, expiresAt, compact = false }: SourceMetaProps) {
  const sourceCount = sources.length;

  // Get highest grade
  const gradeOrder = { A: 0, B: 1, C: 2, D: 3 };
  const highestGradeSource = sources.reduce((best, source) => {
    if (!best || gradeOrder[source.grade] < gradeOrder[best.grade]) {
      return source;
    }
    return best;
  }, sources[0]);

  const primaryGrade = highestGradeSource?.grade || 'A';
  const grade = gradeInfo[primaryGrade];

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border ${grade.color} font-semibold`}>
          <span>{grade.icon}</span>
          <span>Grade {primaryGrade}</span>
        </span>
        {sourceCount > 0 && (
          <span className="text-slate-500">{sourceCount} source{sourceCount !== 1 ? 's' : ''}</span>
        )}
        {lastReviewedAt && (
          <span className="text-slate-500">Verified {formatDate(lastReviewedAt)}</span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-xl bg-slate-50 border-2 border-slate-200 p-4">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 ${grade.color} font-bold text-sm`}>
            <span>{grade.icon}</span>
            <span>Grade {primaryGrade}</span>
          </span>
          <div className="text-xs">
            <div className="font-semibold text-slate-800">{grade.label}</div>
            <div className="text-slate-500">{sourceCount} official source{sourceCount !== 1 ? 's' : ''}</div>
          </div>
        </div>

        {/* Dates */}
        <div className="flex flex-wrap gap-4 text-xs text-slate-600">
          {lastReviewedAt && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                <span className="font-semibold">Verified:</span> {formatDate(lastReviewedAt)}
              </span>
            </div>
          )}
          {expiresAt && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                <span className="font-semibold">Next review:</span> {formatDate(expiresAt)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Source Links */}
      {sources.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            📚 Based on Official Guidelines:
          </h4>
          <div className="space-y-1.5">
            {sources.slice(0, 3).map((source) => (
              <div key={source.id} className="flex items-start gap-2 text-xs">
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full border-2 flex-shrink-0 ${gradeInfo[source.grade].color} font-bold text-[10px]`}>
                  {source.grade}
                </span>
                <div className="flex-1 min-w-0">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-700 hover:text-purple-900 font-medium underline decoration-dotted inline-flex items-center gap-1 break-words"
                  >
                    <span className="line-clamp-1">{source.name}</span>
                    <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  {source.organization && (
                    <div className="text-slate-500 text-[11px] mt-0.5">{source.organization}</div>
                  )}
                </div>
              </div>
            ))}
            {sources.length > 3 && (
              <div className="text-slate-500 text-[11px] italic pt-1">
                + {sources.length - 3} more source{sources.length - 3 !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer Link */}
      <div className="pt-2 border-t border-slate-300">
        <Link
          href="/trust#sources"
          className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-semibold transition-colors"
        >
          <span>View our content curation methods</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
