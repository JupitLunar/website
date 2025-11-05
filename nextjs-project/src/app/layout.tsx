import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ContactChatbot from '@/components/ContactChatbot';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'DearBaby - AI-Powered Maternal & Infant Care | Evidence-Based Parenting Guide',
    template: '%s | DearBaby by JupitLunar'
  },
  description: 'Get expert maternal and infant care guidance powered by Mom AI Agent. Evidence-based feeding schedules, safety tips, and pediatric health advice from CDC, AAP, and WHO sources.',
  keywords: ['maternal care', 'infant care', 'baby feeding', 'parenting guide', 'pediatric health', 'AI parenting assistant', 'evidence-based baby care', 'DearBaby', 'baby development', 'feeding schedules'],
  authors: [{ name: 'JupitLunar' }],
  creator: 'JupitLunar',
  publisher: 'JupitLunar',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.momaiagent.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'DearBaby - AI-Powered Maternal & Infant Care',
    description: 'Evidence-based parenting guidance powered by Mom AI Agent',
    url: 'https://www.momaiagent.com',
    siteName: 'DearBaby by JupitLunar',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DearBaby - AI-Powered Maternal & Infant Care',
    description: 'Evidence-based parenting guidance powered by Mom AI Agent',
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
        <SpeedInsights />
      </body>
    </html>
  );
}
