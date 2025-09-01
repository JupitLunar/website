'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [email, setEmail] = useState('');
  const contentMenuRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭Content菜单
  useEffect(() => {
    if (!isContentOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (contentMenuRef.current && !contentMenuRef.current.contains(event.target as Node)) {
        setIsContentOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isContentOpen]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 提交邮箱到newsletter
  async function submitNewsletter(email: string) {
    // TODO: Implement newsletter subscription
    console.log('Newsletter subscription:', email);
    alert('Thank you for subscribing to our newsletter!');
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Home</Link>
            
            {/* Content Dropdown */}
            <div className="relative" ref={contentMenuRef}>
              <button
                className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-1"
                onClick={() => setIsContentOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={isContentOpen}
              >
                <span>Content</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${isContentOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isContentOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute top-full left-0 mt-3 w-48 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50 py-2 overflow-hidden"
                >
                  <Link 
                    href="/learn/feeding" 
                    onClick={() => setIsContentOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 transition-all duration-200 text-sm font-medium"
                  >
                    Feeding & Nutrition
                  </Link>
                  <Link 
                    href="/learn/sleep" 
                    onClick={() => setIsContentOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 transition-all duration-200 text-sm font-medium"
                  >
                    Sleep & Routines
                  </Link>
                  <Link 
                    href="/learn/mom-health" 
                    onClick={() => setIsContentOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 transition-all duration-200 text-sm font-medium"
                  >
                    Mom Health
                  </Link>
                  <Link 
                    href="/learn/development" 
                    onClick={() => setIsContentOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 transition-all duration-200 text-sm font-medium"
                  >
                    Baby Development
                  </Link>
                  <Link 
                    href="/learn/safety" 
                    onClick={() => setIsContentOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 transition-all duration-200 text-sm font-medium"
                  >
                    Safety & First Aid
                  </Link>
                  <Link 
                    href="/learn/recipes" 
                    onClick={() => setIsContentOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 transition-all duration-200 text-sm font-medium"
                  >
                    Recipes & Solid Start
                  </Link>
                </motion.div>
              )}
            </div>
            
            <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About</Link>
            <Link href="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">Blog</Link>
            <Link href="/faq" className="text-gray-600 hover:text-gray-900 transition-colors">FAQ</Link>
            
            {/* Newsletter 按钮 */}
            <button
              onClick={() => setShowNewsletterModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg text-sm font-medium shadow-sm hover:from-primary-600 hover:to-primary-700 transition-all duration-300"
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
            className="md:hidden py-4"
          >
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-left text-gray-600 hover:text-gray-900 transition-colors">
                Home
              </Link>
              <Link href="/learn/feeding" className="text-left text-gray-600 hover:text-gray-900 transition-colors">
                Feeding & Nutrition
              </Link>
              <Link href="/learn/sleep" className="text-left text-gray-600 hover:text-gray-900 transition-colors">
                Sleep & Routines
              </Link>
              <Link href="/learn/mom-health" className="text-left text-gray-600 hover:text-gray-900 transition-colors">
                Mom Health
              </Link>
              <Link href="/learn/development" className="text-left text-gray-600 hover:text-gray-900 transition-colors">
                Baby Development
              </Link>
              <Link href="/learn/safety" className="text-left text-gray-600 hover:text-gray-900 transition-colors">
                Safety & First Aid
              </Link>
              <Link href="/learn/recipes" className="text-left text-gray-600 hover:text-gray-900 transition-colors">
                Recipes & Solid Start
              </Link>
              <Link href="/about" className="text-left text-gray-600 hover:text-gray-900 transition-colors">
                About
              </Link>
              <Link href="/blog" className="text-left text-gray-600 hover:text-gray-900 transition-colors">
                Blog
              </Link>
              <Link href="/faq" className="text-left text-gray-600 hover:text-gray-900 transition-colors">
                FAQ
              </Link>
              <button 
                onClick={() => setShowNewsletterModal(true)}
                className="text-left px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg text-sm font-medium shadow-sm hover:from-primary-600 hover:to-primary-700 transition-all duration-300"
              >
                Subscribe to Newsletter
              </button>
            </nav>
          </motion.div>
        )}
      </div>

      {/* Newsletter 弹窗 */}
      {showNewsletterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-3xl p-10 max-w-sm w-full relative border-0 shadow-lg">
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
                await submitNewsletter(email);
                setShowNewsletterModal(false);
              }}
              className="space-y-6"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-5 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-transparent text-base transition-all duration-200 placeholder-gray-400"
                required
              />
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl text-base font-semibold shadow-none hover:from-primary-600 hover:to-primary-700 transition-all duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
