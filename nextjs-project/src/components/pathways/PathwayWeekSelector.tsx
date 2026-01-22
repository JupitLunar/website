"use client";

import { useMemo, useState } from 'react';
import type { PathwayStage, PathwayWeek } from '@/data/pathways';

interface PathwayWeekSelectorProps {
  stages: PathwayStage[];
  weeks: PathwayWeek[];
  initialStageId?: string;
}

export default function PathwayWeekSelector({ stages, weeks, initialStageId }: PathwayWeekSelectorProps) {
  const fallbackStage = stages[0]?.id;
  const [activeStage, setActiveStage] = useState(initialStageId || fallbackStage);

  const filteredWeeks = useMemo(() => {
    if (!activeStage) return [];
    return weeks.filter((week) => week.stage === activeStage);
  }, [weeks, activeStage]);

  if (!activeStage) return null;

  const activeStageMeta = stages.find((stage) => stage.id === activeStage);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {stages.map((stage) => {
          const isActive = stage.id === activeStage;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => setActiveStage(stage.id)}
              aria-pressed={isActive}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.3em] transition-colors ${
                isActive
                  ? 'border-violet-300 bg-violet-50 text-violet-600'
                  : 'border-slate-200 bg-white text-slate-500 hover:text-violet-500'
              }`}
            >
              {stage.label}
            </button>
          );
        })}
      </div>

      {activeStageMeta && (
        <div className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{activeStageMeta.range}</p>
          <p className="mt-2 text-sm text-slate-600">{activeStageMeta.description}</p>
        </div>
      )}

      {filteredWeeks.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm text-sm text-slate-500">
          No weeks available for this stage yet.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredWeeks.map((week) => (
            <div key={`${week.stage}-${week.week}`} className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Week {week.week}</p>
                <p className="text-xs text-slate-500">{week.range}</p>
              </div>
              <h3 className="text-base font-semibold text-slate-700 mb-2">{week.focus}</h3>
              <div className="space-y-3 text-sm text-slate-600">
                <div>
                  <p className="font-semibold text-slate-700 mb-1">Tasks</p>
                  <ul className="space-y-1 list-disc list-inside">
                    {week.tasks.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-slate-700 mb-1">Red flags</p>
                  <ul className="space-y-1 list-disc list-inside">
                    {week.redFlags.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <p className="text-xs text-slate-500">Check-in: {week.checkIn}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
