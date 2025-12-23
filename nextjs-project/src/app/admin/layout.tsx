import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin | DearBaby Internal',
  description: 'Internal admin section for DearBaby by JupitLunar.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

