import React from 'react';

interface DisclaimerNoticeProps {
  variant?: 'general' | 'medical';
}

const textByVariant: Record<Required<DisclaimerNoticeProps>['variant'], string> = {
  general:
    'Information is compiled from authoritative public health sources. It does not replace professional medical diagnosis or individualized care.',
  medical:
    'Call your pediatrician or emergency services if your child shows signs of allergic reaction, choking, or illness. Online content cannot substitute professional medical advice.',
};

export default function DisclaimerNotice({ variant = 'general' }: DisclaimerNoticeProps) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
      <span className="font-semibold">Disclaimer:</span> {textByVariant[variant]}
    </div>
  );
}
