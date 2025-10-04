'use client';

import { useEffect, useState } from 'react';
import { performanceMonitor } from '@/lib/cache';

type MetricEntry = {
  name: string;
  average: number;
  latest: number;
  count: number;
};

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<Record<string, MetricEntry>>({});
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const interval = setInterval(() => {
      const snapshot = performanceMonitor.getMetrics();
      setMetrics(snapshot as Record<string, MetricEntry>);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[1000] text-xs">
      <button
        onClick={() => setVisible((prev) => !prev)}
        className="rounded-full bg-slate-900 px-4 py-2 font-medium text-white shadow-lg"
      >
        {visible ? 'Hide' : 'Show'} performance
      </button>
      {visible && (
        <div className="mt-2 max-w-sm rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
          <h3 className="text-sm font-semibold text-slate-900">Client metrics (dev only)</h3>
          {Object.keys(metrics).length === 0 ? (
            <p className="mt-2 text-slate-500">Collecting...</p>
          ) : (
            <ul className="mt-2 space-y-1 text-slate-600">
              {Object.entries(metrics).map(([name, entry]) => (
                <li key={name} className="flex items-center justify-between gap-4">
                  <span className="font-medium text-slate-700">{name}</span>
                  <span>
                    avg {entry.average.toFixed(1)} ms · latest {entry.latest.toFixed(1)} ms · n={entry.count}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
