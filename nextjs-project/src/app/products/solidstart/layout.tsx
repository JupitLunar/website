import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solid Start | First-Food Planning and Feeding Guidance',
  description: 'Solid Start helps families move into first-food planning with recipes, BLW support, allergen routines, and feeding guidance.',
  alternates: {
    canonical: '/products/solidstart',
  },
  openGraph: {
    title: 'Solid Start | First-Food Planning and Feeding Guidance',
    description: 'Use Solid Start for recipes, BLW planning, allergen routines, and calmer first-food preparation.',
    url: '/products/solidstart',
  },
  twitter: {
    title: 'Solid Start | First-Food Planning and Feeding Guidance',
    description: 'A feeding app for recipes, stage guidance, allergen routines, and first-food planning.',
  },
};

export default function SolidStartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
