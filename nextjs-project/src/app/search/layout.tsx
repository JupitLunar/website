import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search the Answer Hub',
  description: 'Search questions, topics, foods, and caregiving answers across the Mom AI Agent website.',
  alternates: {
    canonical: '/search',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
