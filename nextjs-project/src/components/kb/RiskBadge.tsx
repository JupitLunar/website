import React from 'react';
import type { RiskLevel } from '@/types/content';

const riskStyles: Record<RiskLevel, string> = {
  none: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  low: 'bg-teal-100 text-teal-700 border-teal-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  high: 'bg-red-100 text-red-700 border-red-200',
};

const riskLabel: Record<RiskLevel, string> = {
  none: 'No Risk',
  low: 'Low Risk',
  medium: 'Medium Risk',
  high: 'High Risk',
};

interface RiskBadgeProps {
  level: RiskLevel;
}

export default function RiskBadge({ level }: RiskBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${riskStyles[level]}`}>
      {riskLabel[level]}
    </span>
  );
}
