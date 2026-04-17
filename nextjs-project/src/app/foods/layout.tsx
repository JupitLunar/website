import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Baby Food Database | First Foods, Cut Sizes & Safety',
  description: 'Browse first foods, cut sizes, textures, age guidance, nutrients, and safety notes across the Mom AI Agent foods library.',
  alternates: {
    canonical: '/foods',
  },
  openGraph: {
    title: 'Baby Food Database | First Foods, Cut Sizes & Safety',
    description: 'Search first foods, textures, cut sizes, and safety notes with structured feeding guidance from Mom AI Agent.',
    url: '/foods',
  },
  twitter: {
    title: 'Baby Food Database | First Foods, Cut Sizes & Safety',
    description: 'A searchable foods library for first foods, textures, cut sizes, and safety notes when starting solids.',
  },
};

export default function FoodsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
