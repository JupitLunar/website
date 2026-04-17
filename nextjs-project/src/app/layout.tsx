import type { Metadata } from 'next';
import React, { Suspense } from 'react';
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
    default: 'Mom AI Agent | Evidence Intelligence Platform for Mom & Baby',
    template: '%s | Mom AI Agent'
  },
  description: 'Mom AI Agent is an Evidence Intelligence Platform for Mom & Baby, combining source-linked guidance, parenting answers, trust materials, and structured knowledge across feeding, sleep, safety, and postpartum care.',
  keywords: ['Mom AI Agent', 'evidence intelligence platform', 'mom and baby guidance', 'maternal care', 'infant care', 'baby feeding', 'sleep guidance', 'postpartum support', 'trust center', 'foods database'],
  authors: [{ name: 'Mom AI Agent Editorial Team' }],
  creator: 'Mom AI Agent',
  publisher: 'Mom AI Agent',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    languages: {
      'x-default': `${siteUrl}/`,
    },
  },
  openGraph: {
    title: 'Mom AI Agent | Evidence Intelligence Platform for Mom & Baby',
    description: 'Source-linked guidance, parenting answers, trust materials, and structured knowledge for feeding, sleep, safety, and postpartum care.',
    url: siteUrl,
    siteName: 'Mom AI Agent',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: 'Mom AI Agent | Evidence Intelligence Platform for Mom & Baby'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mom AI Agent | Evidence Intelligence Platform for Mom & Baby',
    description: 'Source-linked guidance, parenting answers, trust materials, and structured knowledge for feeding, sleep, safety, and postpartum care.',
    images: [`${siteUrl}/og-image.svg`],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/Logo.png',
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
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <SpeedInsights />
      </body>
    </html>
  );
}
