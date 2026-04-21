'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccessOpen, setIsAccessOpen] = useState(false);
  const [isTopicsOpen, setIsTopicsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const accessMenuRef = useRef<HTMLDivElement>(null);
  const topicsMenuRef = useRef<HTMLDivElement>(null);
  const aboutMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    if (!isAccessOpen && !isTopicsOpen && !isAboutOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (accessMenuRef.current && !accessMenuRef.current.contains(event.target as Node)) {
        setIsAccessOpen(false);
      }
      if (topicsMenuRef.current && !topicsMenuRef.current.contains(event.target as Node)) {
        setIsTopicsOpen(false);
      }
      if (aboutMenuRef.current && !aboutMenuRef.current.contains(event.target as Node)) {
        setIsAboutOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAccessOpen, isTopicsOpen, isAboutOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex min-w-0 shrink-0 items-center gap-3" aria-label="Mom AI Agent home">
            <Image
              src="/Assets/Logo.png"
              alt="Mom AI Agent Logo"
              width={80}
              height={80}
              className="h-14 w-14 object-contain"
            />
            <div className="min-w-0">
              <span className="block whitespace-nowrap text-lg font-semibold leading-none bg-gradient-to-r from-primary-500/80 to-primary-600/80 bg-clip-text text-transparent">
                Mom AI Agent
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden min-w-0 items-center justify-end gap-4 text-sm font-medium lg:flex xl:gap-5 2xl:gap-6 2xl:text-base">
            <Link href="/" className="whitespace-nowrap text-gray-600 hover:text-gray-900 transition-colors">
              Home
            </Link>

            {/* Access Dropdown */}
            <div className="relative" ref={accessMenuRef}>
              <button
                className="flex items-center gap-1 whitespace-nowrap text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsAccessOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={isAccessOpen}
              >
                <span>Access</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${isAccessOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isAccessOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute top-full left-0 mt-3 w-64 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50 py-2 overflow-hidden"
                >
                  <div className="px-4 pt-2 pb-1 text-[10px] font-bold uppercase tracking-[0.24em] text-gray-400">
                    Public hub
                  </div>
                  <Link
                    href="/search"
                    onClick={() => setIsAccessOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 transition-all duration-200 text-sm font-medium"
                  >
                    Answer Hub
                  </Link>
                  <Link
                    href="/foods"
                    onClick={() => setIsAccessOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 transition-all duration-200 text-sm font-medium"
                  >
                    Foods Database
                  </Link>
                  <div className="mx-4 my-2 border-t border-gray-100"></div>
                  <div className="px-4 pt-1 pb-1 text-[10px] font-bold uppercase tracking-[0.24em] text-gray-400">
                    Companion apps
                  </div>
                  <Link
                    href="/products/dearbaby"
                    onClick={() => setIsAccessOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 transition-all duration-200 text-sm font-medium"
                  >
                    DearBaby
                  </Link>
                  <Link
                    href="/products/solidstart"
                    onClick={() => setIsAccessOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 transition-all duration-200 text-sm font-medium"
                  >
                    Solid Start
                  </Link>
                </motion.div>
              )}
            </div>

            <div className="relative" ref={topicsMenuRef}>
              <button
                className="flex items-center gap-1 whitespace-nowrap text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsTopicsOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={isTopicsOpen}
              >
                <span>Topics</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${isTopicsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isTopicsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute top-full left-0 mt-3 w-64 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50 py-2 overflow-hidden"
                >
                  <Link
                    href="/topics"
                    onClick={() => setIsTopicsOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 transition-all duration-200 text-sm font-medium"
                  >
                    Topics Library
                  </Link>
                  <Link
                    href="/foods"
                    onClick={() => setIsTopicsOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 transition-all duration-200 text-sm font-medium"
                  >
                    Foods Database
                  </Link>
                  <Link
                    href="/faq"
                    onClick={() => setIsTopicsOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 transition-all duration-200 text-sm font-medium"
                  >
                    FAQ
                  </Link>
                </motion.div>
              )}
            </div>
            <Link href="/faq" className="whitespace-nowrap text-gray-600 hover:text-gray-900 transition-colors">
              FAQ
            </Link>
            <Link href="/insight" className="whitespace-nowrap text-gray-600 hover:text-gray-900 transition-colors">
              Insights
            </Link>

            {/* About Dropdown */}
            <div className="relative" ref={aboutMenuRef}>
              <button
                className="flex items-center gap-1 whitespace-nowrap text-gray-600 hover:text-gray-900 transition-colors"
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
                    Trust Center
                  </Link>
                  <Link
                    href="/methodology"
                    onClick={() => setIsAboutOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 transition-all duration-200 text-sm font-medium"
                  >
                    Methodology
                  </Link>
                  <Link
                    href="/clinical-review-policy"
                    onClick={() => setIsAboutOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 transition-all duration-200 text-sm font-medium"
                  >
                    Clinical Review Policy
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setIsAboutOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 transition-all duration-200 text-sm font-medium"
                  >
                    About
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setIsAboutOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 transition-all duration-200 text-sm font-medium"
                  >
                    Contact
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Search & CTA */}
            <Link href="/search" className="flex-none text-gray-600 hover:text-gray-900 transition-colors" aria-label="Search">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <Link
              href="/search"
              className="inline-flex h-10 min-w-32 flex-none items-center justify-center whitespace-nowrap rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 text-sm font-medium leading-none text-white shadow-sm transition-all duration-300 hover:from-purple-700 hover:to-pink-700"
            >
              Ask the Hub
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="p-2 lg:hidden"
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
            className="py-4 border-t border-gray-200 lg:hidden"
          >
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-left text-gray-700 hover:text-purple-600 transition-colors font-medium px-2 py-2"
              >
                Home
              </Link>

              {/* Access Section */}
              <div className="border-t border-gray-100 pt-3">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 px-2">Access</div>
                <Link
                  href="/search"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-left text-gray-600 hover:text-purple-600 transition-colors text-sm px-4 py-1.5"
                >
                  Answer Hub
                </Link>
                <Link
                  href="/foods"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-left text-gray-600 hover:text-purple-600 transition-colors text-sm px-4 py-1.5"
                >
                  Foods Database
                </Link>
                <div className="mt-2 mb-1 px-4 text-[10px] font-bold uppercase tracking-[0.24em] text-gray-400">Companion apps</div>
                <Link
                  href="/products/dearbaby"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-left text-gray-600 hover:text-purple-600 transition-colors text-sm px-4 py-1.5"
                >
                  DearBaby
                </Link>
                <Link
                  href="/products/solidstart"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-left text-gray-600 hover:text-purple-600 transition-colors text-sm px-4 py-1.5"
                >
                  Solid Start
                </Link>
              </div>

              {/* Other Links */}
              <div className="border-t border-gray-100 pt-3">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 px-2">Topics</div>
                <Link
                  href="/topics"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-left text-gray-600 hover:text-purple-600 transition-colors text-sm px-4 py-1.5"
                >
                  Topics Library
                </Link>
                <Link
                  href="/foods"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-left text-gray-600 hover:text-purple-600 transition-colors text-sm px-4 py-1.5"
                >
                  Foods Guide
                </Link>
                <Link
                  href="/faq"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-left text-gray-600 hover:text-purple-600 transition-colors text-sm px-4 py-1.5"
                >
                  FAQ
                </Link>
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-2">
                <Link
                  href="/faq"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-left text-gray-700 hover:text-purple-600 transition-colors font-medium px-2 py-2"
                >
                  FAQ
                </Link>
                <Link
                  href="/insight"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-left text-gray-700 hover:text-purple-600 transition-colors font-medium px-2 py-2"
                >
                  Insights
                </Link>
                <Link
                  href="/search"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-left text-gray-700 hover:text-purple-600 transition-colors font-medium px-2 py-2"
                >
                  Search
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
                  Trust Center
                </Link>
                <Link
                  href="/methodology"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-left text-gray-600 hover:text-purple-600 transition-colors text-sm px-4 py-1.5"
                >
                  Methodology
                </Link>
                <Link
                  href="/clinical-review-policy"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-left text-gray-600 hover:text-purple-600 transition-colors text-sm px-4 py-1.5"
                >
                  Clinical Review Policy
                </Link>
                <Link
                  href="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-left text-gray-600 hover:text-purple-600 transition-colors text-sm px-4 py-1.5"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-left text-gray-600 hover:text-purple-600 transition-colors text-sm px-4 py-1.5"
                >
                  Contact
                </Link>
                <Link
                  href="/faq"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-left text-gray-600 hover:text-purple-600 transition-colors text-sm px-4 py-1.5"
                >
                  FAQ
                </Link>
              </div>

              {/* Primary CTA */}
              <div className="pt-3">
                <Link
                  href="/search"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-center px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium shadow-sm hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                >
                  Ask the Hub
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
}

export default Header;
