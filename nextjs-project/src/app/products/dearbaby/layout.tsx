import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DearBaby | Baby Tracking App for Daily Care Routines',
  description: 'DearBaby is a baby tracking app for feeds, sleep, diapers, and growth, connected to the wider Mom AI Agent guidance platform.',
  alternates: {
    canonical: '/products/dearbaby',
  },
  openGraph: {
    title: 'DearBaby | Baby Tracking App for Daily Care Routines',
    description: 'Track feeds, sleep, diapers, and growth with DearBaby, then move into structured guidance and answers across Mom AI Agent.',
    url: '/products/dearbaby',
  },
  twitter: {
    title: 'DearBaby | Baby Tracking App for Daily Care Routines',
    description: 'A baby tracking app for feeds, sleep, diapers, and growth inside the Mom AI Agent platform.',
  },
};

export default function DearBabyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
