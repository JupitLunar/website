import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About the Platform',
  description:
    'Learn how Mom AI Agent operates as a public evidence hub, how trust and knowledge surfaces fit together, and where products sit downstream of the platform.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About the Platform',
    description:
      'How Mom AI Agent works as a public evidence hub for source-linked maternal and infant guidance.',
    url: '/about',
  },
  twitter: {
    title: 'About the Platform',
    description:
      'Platform overview for the Mom AI Agent public evidence hub.',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
