import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ContactChatbot from '@/components/ContactChatbot';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'JupitLunar - AI-Powered Health Intelligence for Mom & Baby Wellness',
    template: '%s | JupitLunar'
  },
  description: 'Expert-curated, AI-powered health intelligence for maternal and infant wellness. Evidence-based guidance from trusted sources.',
  keywords: ['baby health', 'maternal wellness', 'AI health', 'parenting', 'baby development', 'sleep training', 'feeding', 'nutrition'],
  authors: [{ name: 'JupitLunar Team' }],
  creator: 'JupitLunar',
  publisher: 'JupitLunar',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://momaiagent.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'JupitLunar - AI-Powered Health Intelligence',
    description: 'Expert-curated health guidance for moms and babies',
    url: 'https://momaiagent.com',
    siteName: 'JupitLunar',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JupitLunar - AI-Powered Health Intelligence',
    description: 'Expert-curated health guidance for moms and babies',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <Header />
        <main className="pt-20">
          {children}
        </main>
        <Footer />
        <ContactChatbot />
      </body>
    </html>
  );
}
