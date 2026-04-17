'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

function Footer() {
  const exploreLinks = [
    { name: 'Answer Hub', href: '/search' },
    { name: 'Topics Library', href: '/topics' },
    { name: 'Insights', href: '/insight' },
    { name: 'Foods Database', href: '/foods' },
    { name: 'FAQ', href: '/faq' },
  ];

  const trustLinks = [
    { name: 'Trust Center', href: '/trust' },
    { name: 'Methodology', href: '/methodology' },
    { name: 'Clinical Review Policy', href: '/clinical-review-policy' },
    { name: 'Data Use Policy', href: '/data-use-policy' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Disclaimer', href: '/disclaimer' },
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
      setMessage('Thanks. Check your inbox for the welcome email.');
      setEmail('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unable to subscribe.';
      setStatus('error');
      setMessage(errorMessage);
    }
  }

  return (
    <footer className="border-t border-slate-200 bg-gradient-to-b from-white via-slate-50/70 to-violet-50/40">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr_0.9fr_1.1fr]">
          <div className="space-y-5">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-primary-500/80 to-primary-600/80 p-[1.5px]">
                <div className="w-full h-full rounded-full overflow-hidden bg-white">
                  <Image
                    src="/Assets/Logo.png"
                    alt="Mom AI Agent Logo"
                    width={40}
                    height={40}
                    className="w-full h-full object-contain p-0.5"
                  />
                </div>
              </div>
              <div>
                <span className="block text-xl font-semibold bg-gradient-to-r from-primary-500/80 to-primary-600/80 bg-clip-text text-transparent">
                  Mom AI Agent
                </span>
                <span className="text-xs text-slate-400">
                  Evidence Intelligence Platform for Mom & Baby
                </span>
              </div>
            </Link>

            <p className="max-w-md text-sm leading-relaxed text-slate-600">
              Mom AI Agent is the public website and evidence hub. DearBaby and Solid Start are companion apps that sit
              downstream from the knowledge, trust, and answer layers.
            </p>

            <div className="flex flex-wrap gap-3 text-sm">
              <Link href="/search" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-600 hover:text-violet-600 transition-colors">
                Ask Mom AI Agent
              </Link>
              <Link href="/insight" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-600 hover:text-violet-600 transition-colors">
                Explore Insights
              </Link>
              <Link href="/contact" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-600 hover:text-violet-600 transition-colors">
                Partner With Us
              </Link>
              <Link href="/products/dearbaby" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-600 hover:text-violet-600 transition-colors">
                DearBaby App
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400 mb-5">Explore</h3>
            <ul className="space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-slate-600 hover:text-violet-600 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400 mb-5">Trust</h3>
            <ul className="space-y-3">
              {trustLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-slate-600 hover:text-violet-600 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm">
            <h3 className="text-xl font-light text-slate-700 mb-3">Stay Updated</h3>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed">
              Get website updates, source refreshes, and guidance releases from Mom AI Agent.
            </p>
            <form className="space-y-3" onSubmit={handleSubscribe}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
                required
              />
              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-slate-400 to-violet-400 px-4 py-3 text-sm font-medium text-white hover:from-slate-500 hover:to-violet-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
              </button>
            </form>
            {message && (
              <p className={`mt-3 text-xs ${status === 'success' ? 'text-emerald-600' : 'text-rose-500'}`}>
                {message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 JupitLunar. Mom AI Agent is the public evidence hub for mom and baby guidance.</p>
          <div className="flex flex-wrap gap-4">
            <a href="mailto:support@momaiagent.com" className="hover:text-violet-600 transition-colors">support@momaiagent.com</a>
            <a href="https://www.linkedin.com/company/dearbabyai" target="_blank" rel="noopener noreferrer" className="hover:text-violet-600 transition-colors">DearBaby on LinkedIn</a>
            <a href="https://www.instagram.com/dearbabyai" target="_blank" rel="noopener noreferrer" className="hover:text-violet-600 transition-colors">DearBaby on Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
