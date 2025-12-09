'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFoodsOpen, setIsFoodsOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [email, setEmail] = useState('');
  const [newsletterFeedback, setNewsletterFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmittingNewsletter, setIsSubmittingNewsletter] = useState(false);
  const foodsMenuRef = useRef<HTMLDivElement>(null);
  const productsMenuRef = useRef<HTMLDivElement>(null);
  const aboutMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    if (!isFoodsOpen && !isProductsOpen && !isAboutOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (foodsMenuRef.current && !foodsMenuRef.current.contains(event.target as Node)) {
        setIsFoodsOpen(false);
      }
      if (productsMenuRef.current && !productsMenuRef.current.contains(event.target as Node)) {
        setIsProductsOpen(false);
      }
      if (aboutMenuRef.current && !aboutMenuRef.current.contains(event.target as Node)) {
        setIsAboutOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFoodsOpen, isProductsOpen, isAboutOpen]);

  useEffect(() => {
    if (!showNewsletterModal) {
      setNewsletterFeedback(null);
    }
  }, [showNewsletterModal]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 提交邮箱到newsletter
  async function submitNewsletter(email: string) {
    if (!email) return false;
    setNewsletterFeedback(null);
    setIsSubmittingNewsletter(true);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Unable to subscribe right now.');
      }

      setNewsletterFeedback({
        type: 'success',
        message: 'Thanks! Check your inbox for a welcome note and guide.',
      });
      setEmail('');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong.';
      setNewsletterFeedback({
        type: 'error',
        message,
      });
      return false;
    } finally {
      setIsSubmittingNewsletter(false);
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image 
              src="/Assets/Logo.png" 
              alt="DearBaby Logo" 
              width={80}
              height={80}
              className="w-20 h-20 object-contain" 
            />
            <div className="flex flex-col">
              <span className="text-xl font-semibold bg-gradient-to-r from-primary-500/80 to-primary-600/80 bg-clip-text text-transparent">
                DearBaby
              </span>
              <span className="text-xs text-gray-500 font-light">
                powered by Mom AI Agent
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Home
            </Link>

            {/* Foods Mega Menu */}
            <div className="relative" ref={foodsMenuRef}>
              <button
                className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-1 font-medium"
                onClick={() => setIsFoodsOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={isFoodsOpen}
              >
                <span>Foods</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${isFoodsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isFoodsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute top-full left-0 mt-3 w-[600px] bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50 p-6 overflow-hidden"
                >
                  <div className="grid grid-cols-3 gap-6">
                    {/* By Age */}
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">By Starting Age</h3>
                      <div className="space-y-2">
                        <Link href="/foods?age=6m+" onClick={() => setIsFoodsOpen(false)} className="block text-sm text-gray-700 hover:text-purple-600 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                          6+ Months
                        </Link>
                        <Link href="/foods?age=9m+" onClick={() => setIsFoodsOpen(false)} className="block text-sm text-gray-700 hover:text-purple-600 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                          9+ Months
                        </Link>
                        <Link href="/foods?age=12m+" onClick={() => setIsFoodsOpen(false)} className="block text-sm text-gray-700 hover:text-purple-600 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                          12+ Months
                        </Link>
                        <Link href="/foods?age=18m+" onClick={() => setIsFoodsOpen(false)} className="block text-sm text-gray-700 hover:text-purple-600 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                          18+ Months
                        </Link>
                      </div>
                    </div>

                    {/* By Risk Level */}
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">By Risk Level</h3>
                      <div className="space-y-2">
                        <Link href="/foods?risk=none" onClick={() => setIsFoodsOpen(false)} className="block text-sm text-gray-700 hover:text-purple-600 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                          ✓ No Risk
                        </Link>
                        <Link href="/foods?risk=low" onClick={() => setIsFoodsOpen(false)} className="block text-sm text-gray-700 hover:text-purple-600 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                          🟢 Low Risk
                        </Link>
                        <Link href="/foods?risk=medium" onClick={() => setIsFoodsOpen(false)} className="block text-sm text-gray-700 hover:text-purple-600 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                          🟡 Medium Risk
                        </Link>
                        <Link href="/foods?risk=high" onClick={() => setIsFoodsOpen(false)} className="block text-sm text-gray-700 hover:text-purple-600 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                          🔴 High Risk
                        </Link>
                      </div>
                    </div>

                    {/* By Nutrition */}
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">By Nutrition</h3>
                      <div className="space-y-2">
                        <Link href="/foods?nutrient=Iron-rich" onClick={() => setIsFoodsOpen(false)} className="block text-sm text-gray-700 hover:text-purple-600 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                          Iron-Rich Foods
                        </Link>
                        <Link href="/foods?nutrient=Protein" onClick={() => setIsFoodsOpen(false)} className="block text-sm text-gray-700 hover:text-purple-600 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                          High Protein
                        </Link>
                        <Link href="/foods?nutrient=Healthy Fats" onClick={() => setIsFoodsOpen(false)} className="block text-sm text-gray-700 hover:text-purple-600 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                          Healthy Fats
                        </Link>
                        <Link href="/foods?nutrient=Vitamin C" onClick={() => setIsFoodsOpen(false)} className="block text-sm text-gray-700 hover:text-purple-600 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                          Vitamin C
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Browse All */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <Link
                      href="/foods"
                      onClick={() => setIsFoodsOpen(false)}
                      className="flex items-center justify-between px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors group"
                    >
                      <span className="font-semibold text-purple-600">Browse All 400+ Foods</span>
                      <svg className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Products Dropdown */}
            <div className="relative" ref={productsMenuRef}>
              <button
                className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-1 font-medium"
                onClick={() => setIsProductsOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={isProductsOpen}
              >
                <span>Products</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${isProductsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isProductsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute top-full left-0 mt-3 w-64 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50 py-2 overflow-hidden"
                >
                  <Link
                    href="/products/dearbaby"
                    onClick={() => setIsProductsOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 transition-all duration-200 text-sm font-medium"
                  >
                    DearBaby Tracker
                  </Link>
                  <Link
                    href="/products/solidstart"
                    onClick={() => setIsProductsOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 transition-all duration-200 text-sm font-medium"
                  >
                    DearBaby Solid Food
                  </Link>
                </motion.div>
              )}
            </div>

            <Link href="/topics" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Topics
            </Link>
            <Link href="/faq" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              FAQ
            </Link>

            {/* About Dropdown */}
            <div className="relative" ref={aboutMenuRef}>
              <button
                className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-1 font-medium"
                onClick={() => setIsAboutOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={isAboutOpen}
              >
                <span>About</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${isAboutOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isAboutOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute top-full right-0 mt-3 w-56 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50 py-2 overflow-hidden"
                >
                  <Link
                    href="/trust"
                    onClick={() => setIsAboutOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 transition-all duration-200 text-sm font-medium"
                  >
                    Trust & Methods
                  </Link>
                  <Link
                    href="/trust#sources"
                    onClick={() => setIsAboutOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 transition-all duration-200 text-sm font-medium"
                  >
                    Our Sources
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setIsAboutOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 transition-all duration-200 text-sm font-medium"
                  >
                    About Us
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Search & Newsletter */}
            <Link href="/search" className="text-gray-600 hover:text-gray-900 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <button
              onClick={() => setShowNewsletterModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium shadow-sm hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              data-newsletter-trigger
            >
              Subscribe
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 border-t border-gray-200"
          >
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-left text-gray-700 hover:text-purple-600 transition-colors font-medium px-2 py-2"
              >
                🏠 Home
              </Link>

              {/* Foods Section */}
              <div className="border-t border-gray-100 pt-3">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 px-2">Foods</div>
                <Link
                  href="/foods"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-left text-gray-700 hover:text-purple-600 transition-colors px-2 py-2"
                >
                  Browse All Foods
                </Link>
                <Link
                  href="/foods?age=6m+"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-left text-gray-600 hover:text-purple-600 transition-colors text-sm px-4 py-1.5"
                >
                  6+ Months
                </Link>
                <Link
                  href="/foods?age=9m+"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-left text-gray-600 hover:text-purple-600 transition-colors text-sm px-4 py-1.5"
                >
                  9+ Months
                </Link>
                <Link
                  href="/foods?age=12m+"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-left text-gray-600 hover:text-purple-600 transition-colors text-sm px-4 py-1.5"
                >
                  12+ Months
                </Link>
              </div>

              {/* Products Section */}
              <div className="border-t border-gray-100 pt-3">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 px-2">Products</div>
                <Link
                  href="/products/dearbaby"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-left text-gray-600 hover:text-purple-600 transition-colors text-sm px-4 py-1.5"
                >
                  DearBaby Tracker
                </Link>
                <Link
                  href="/products/solidstart"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-left text-gray-600 hover:text-purple-600 transition-colors text-sm px-4 py-1.5"
                >
                  DearBaby Solid Food
                </Link>
              </div>

              {/* Other Links */}
              <div className="border-t border-gray-100 pt-3 space-y-2">
                <Link
                  href="/topics"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-left text-gray-700 hover:text-purple-600 transition-colors font-medium px-2 py-2"
                >
                  📚 Topics
                </Link>
                <Link
                  href="/faq"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-left text-gray-700 hover:text-purple-600 transition-colors font-medium px-2 py-2"
                >
                  ❓ FAQ
                </Link>
                <Link
                  href="/search"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-left text-gray-700 hover:text-purple-600 transition-colors font-medium px-2 py-2"
                >
                  🔍 Search
                </Link>
              </div>

              {/* About Section */}
              <div className="border-t border-gray-100 pt-3">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 px-2">About</div>
                <Link
                  href="/trust"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-left text-gray-600 hover:text-purple-600 transition-colors text-sm px-4 py-1.5"
                >
                  Trust & Methods
                </Link>
                <Link
                  href="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-left text-gray-600 hover:text-purple-600 transition-colors text-sm px-4 py-1.5"
                >
                  About Us
                </Link>
              </div>

              {/* Newsletter Button */}
              <div className="pt-3">
                <button
                  onClick={() => {
                    setShowNewsletterModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-center px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium shadow-sm hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                >
                  Subscribe to Newsletter
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </div>

      {/* Newsletter 弹窗 */}
      {showNewsletterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-3xl p-10 max-w-sm w-full relative border-0 shadow-lg mx-auto my-auto">
            <button
              className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 text-2xl font-light focus:outline-none"
              onClick={() => setShowNewsletterModal(false)}
              aria-label="Close"
              style={{ background: 'none', border: 'none', lineHeight: 1 }}
            >
              ×
            </button>
            <h3 className="text-2xl font-semibold mb-6 text-gray-800 tracking-tight">Subscribe to Newsletter</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const success = await submitNewsletter(email);
                if (success) {
                  setShowNewsletterModal(false);
                }
              }}
              className="space-y-6"
            >
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
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-base font-semibold shadow-none hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isSubmittingNewsletter}
              >
                {isSubmittingNewsletter ? 'Subscribing…' : 'Subscribe'}
              </button>
            </form>
            {newsletterFeedback && (
              <p
                className={`mt-4 text-sm ${newsletterFeedback.type === 'success' ? 'text-emerald-500' : 'text-rose-500'}`}
                role="status"
              >
                {newsletterFeedback.message}
              </p>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
