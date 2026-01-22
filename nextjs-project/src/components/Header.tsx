'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContentDropdownOpen, setIsContentDropdownOpen] = useState(false);
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);
  const [email, setEmail] = useState('');

  const contentHubs = [
    { name: 'Pregnancy & Birth', href: '/hub/pregnancy-birth', color: 'from-pink-400 to-rose-400' },
    { name: 'Newborn Care', href: '/hub/newborn-care', color: 'from-blue-400 to-indigo-400' },
    { name: 'Infant Development', href: '/hub/infant-development', color: 'from-green-400 to-emerald-400' },
    { name: 'Nutrition & Feeding', href: '/hub/nutrition-feeding', color: 'from-orange-400 to-amber-400' },
    { name: 'Health & Safety', href: '/hub/health-safety', color: 'from-red-400 to-pink-400' },
    { name: 'Parenting Tips', href: '/hub/parenting-tips', color: 'from-purple-400 to-violet-400' }
  ];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement with Supabase
    console.log('Newsletter subscription:', email);
    alert('Thank you for subscribing!');
    setIsNewsletterModalOpen(false);
    setEmail('');
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/Assets/Logo.png"
                alt="JupitLunar Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="text-xl font-bold text-gray-900">JupitLunar</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-purple-600 transition-colors">
                Home
              </Link>

              {/* Content Dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => setIsContentDropdownOpen(true)}
                  onMouseLeave={() => setIsContentDropdownOpen(false)}
                  className="text-gray-700 hover:text-purple-600 transition-colors flex items-center space-x-1"
                >
                  <span>Content</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isContentDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseEnter={() => setIsContentDropdownOpen(true)}
                    onMouseLeave={() => setIsContentDropdownOpen(false)}
                    className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-4"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {contentHubs.map((hub) => (
                        <Link
                          key={hub.name}
                          href={hub.href}
                          className="p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${hub.color} mb-2`}></div>
                          <span className="text-sm font-medium text-gray-900 group-hover:text-purple-600">
                            {hub.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              <Link href="/insight" className="text-gray-700 hover:text-purple-600 transition-colors">
                Insights
              </Link>
              <Link href="/programs" className="text-gray-700 hover:text-purple-600 transition-colors">
                Programs
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-purple-600 transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-purple-600 transition-colors">
                Contact
              </Link>
            </nav>

            {/* CTA Button */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setIsNewsletterModalOpen(true)}
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                Newsletter
              </button>
              <Link
                href="#products"
                className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-sm font-medium hover:from-indigo-600 hover:to-purple-600 transition-all duration-200"
              >
                Join Beta
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-6 space-y-4">
              <Link href="/" className="block text-gray-700 hover:text-purple-600 transition-colors">
                Home
              </Link>
              <Link href="/insight" className="block text-gray-700 hover:text-purple-600 transition-colors">
                Insights
              </Link>
              <Link href="/programs" className="block text-gray-700 hover:text-purple-600 transition-colors">
                Programs
              </Link>
              <Link href="/about" className="block text-gray-700 hover:text-purple-600 transition-colors">
                About
              </Link>
              <Link href="/contact" className="block text-gray-700 hover:text-purple-600 transition-colors">
                Contact
              </Link>
              <button
                onClick={() => setIsNewsletterModalOpen(true)}
                className="block w-full text-left text-gray-700 hover:text-purple-600 transition-colors"
              >
                Newsletter
              </button>
              <Link
                href="#products"
                className="block w-full px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-sm font-medium hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 text-center"
              >
                Join Beta
              </Link>
            </div>
          </motion.div>
        )}
      </header>

      {/* Newsletter Modal */}
      {isNewsletterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-3xl p-10 max-w-sm w-full relative border-0 shadow-lg">
            <button
              className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 text-2xl font-light focus:outline-none"
              onClick={() => setIsNewsletterModalOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-2xl font-semibold mb-6 text-gray-800 tracking-tight">Subscribe to Newsletter</h3>
            <form onSubmit={handleNewsletterSubmit} className="space-y-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-5 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-transparent text-base transition-all duration-200 placeholder-gray-400"
                required
              />
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl text-base font-semibold shadow-none hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
