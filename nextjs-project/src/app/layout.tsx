import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ContactChatbot from '@/components/ContactChatbot';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Analytics from '@/components/Analytics';

const inter = Inter({ subsets: ['latin'] });
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.momaiagent.com').replace(/\/$/, '');

export const metadata: Metadata = {
  title: {
    default: 'Mom AI Agent - Evidence-Based Parenting Guide for North America',
    template: '%s | Mom AI Agent'
  },
  description: 'Get expert maternal and infant care guidance powered by Mom AI Agent. Evidence-based feeding schedules, safety tips, and pediatric health advice from CDC, AAP, WHO, and Health Canada sources. Explore DearBaby and Solid Start apps.',
  keywords: ['Mom AI Agent', 'evidence-based parenting', 'North America baby care', 'CDC AAP guidelines', 'maternal care', 'infant care', 'baby feeding', 'parenting guide', 'pediatric health', 'DearBaby', 'baby development', 'feeding schedules'],
  authors: [{ name: 'Mom AI Agent Editorial Team' }],
  creator: 'JupitLunar',
  publisher: 'JupitLunar',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
    languages: {
      'x-default': `${siteUrl}/`,
      'en-US': `${siteUrl}/en-us`,
      'en-CA': `${siteUrl}/en-ca`,
      'zh-CN': `${siteUrl}/zh-cn`,
    },
  },
  openGraph: {
    title: 'Mom AI Agent - Evidence-Based Parenting Guide',
    description: 'Evidence-based parenting guidance for North American families. Trusted advice from CDC, AAP, WHO, and Health Canada. Powered by Mom AI Agent.',
    url: siteUrl,
    siteName: 'Mom AI Agent',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: 'Mom AI Agent - Evidence-Based Parenting Guide'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mom AI Agent - Evidence-Based Parenting Guide',
    description: 'Evidence-based parenting guidance for North American families. Trusted advice from CDC, AAP, WHO, and Health Canada.',
    images: [`${siteUrl}/og-image.svg`],
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || '',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QQTEKXVQN4"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QQTEKXVQN4');
          `}
        </Script>
        <Header />
        <main className="pt-20">
          {children}
        </main>
        <Footer />
        <ContactChatbot />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
