'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

function Footer() {
  const contentHubs = [
    { name: 'Feeding & Nutrition', href: '/topics/feeding-foundations' },
    { name: 'Sleep & Development', href: '/topics' },
    { name: 'Safety & Hygiene', href: '/topics/safety-and-hygiene' },
    { name: 'Allergen Readiness', href: '/topics/allergen-readiness' },
    { name: 'Nutrient Priorities', href: '/topics/nutrient-priorities' },
    { name: 'Food Database', href: '/foods' },
  ];

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Latest Articles', href: '/latest-articles' },
    { name: 'FAQ', href: '/faq' },
    { name: 'All Topics', href: '/topics' },
    { name: 'Trust & Methods', href: '/trust' },
    { name: 'Search', href: '/search' },
  ];

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || status === 'loading') return;

    setStatus('loading');
    setMessage(null);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Unable to subscribe right now.');
      }

      setStatus('success');
      setMessage('Thanks! Check your inbox for your welcome email.');
      setEmail('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unable to subscribe.';
      setStatus('error');
      setMessage(errorMessage);
    }
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-primary-500/80 to-primary-600/80 p-[1.5px]">
                <div className="w-full h-full rounded-full overflow-hidden bg-white">
                  <Image 
                    src="/Assets/Logo.png" 
                    alt="JupitLunar Logo" 
                    width={40}
                    height={40}
                    className="w-full h-full object-contain scale-[1.6] p-0.5 translate-x-2 translate-y-1" 
                  />
                </div>
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-primary-500/80 to-primary-600/80 bg-clip-text text-transparent">
                JupitLunar
              </span>
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">
              AI-powered health intelligence for maternal and infant wellness. 
              Expert-curated, evidence-based guidance for every stage of your parenting journey.
            </p>
            <div className="flex space-x-4">
              {/* Social Media Links - All Real Links Only */}
              <a href="https://www.linkedin.com/company/dearbabyai" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.032-3.047-1.032 0-1.216 1.021-1.216 3.047v5.569h-2.776V9h2.776v1.521h.035c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/dearbabyai" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="https://www.tiktok.com/@dearbabygrow" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="TikTok">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>
            <div className="mt-6 text-sm text-gray-300 space-y-1">
              <a href="tel:+15872001550" className="block hover:text-white transition-colors">Toll-free: +1 (587) 200-1550</a>
              <a href="mailto:support@momaiagent.com" className="block hover:text-white transition-colors">support@momaiagent.com</a>
              <p className="text-xs text-gray-500">Response hours: Monday–Friday · 9am–6pm MT</p>
            </div>
          </div>

          {/* Content Hubs */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Content Hubs</h3>
            <ul className="space-y-3">
              {contentHubs.map((hub) => (
                <li key={hub.name}>
                  <Link 
                    href={hub.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {hub.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Stay Updated</h3>
            <p className="text-gray-300 mb-4 text-sm">
              Get the latest parenting tips and health insights delivered to your inbox.
            </p>
            <form className="space-y-3" onSubmit={handleSubscribe}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                required
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg text-sm font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
              </button>
            </form>
            {message && (
              <p className={`text-xs mt-3 ${status === 'success' ? 'text-emerald-300' : 'text-rose-300'}`}>
                {message}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 JupitLunar. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy
              </Link>
              <Link href="/disclaimer" className="text-gray-400 hover:text-white text-sm transition-colors">
                Disclaimer
              </Link>
              <Link href="/trust" className="text-gray-400 hover:text-white text-sm transition-colors">
                Trust
              </Link>
              <Link href="/about" className="text-gray-400 hover:text-white text-sm transition-colors">
                About
              </Link>
              <Link href="/faq" className="text-gray-400 hover:text-white text-sm transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
