import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const logoImage = require('../Assets/Logo.png');

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL as string,
  process.env.REACT_APP_SUPABASE_ANON_KEY as string
);

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [showBetaModal, setShowBetaModal] = useState(false);
  const [email, setEmail] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const productsMenuRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭Products菜单
  useEffect(() => {
    if (!isProductsOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (productsMenuRef.current && !productsMenuRef.current.contains(event.target as Node)) {
        setIsProductsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProductsOpen]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHomeClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
      // 等待页面加载完成后滚动到home section
      setTimeout(() => {
        scrollToSection('home');
      }, 100);
    } else {
      scrollToSection('home');
    }
  };

  const handleSectionClick = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      // 等待页面加载完成后滚动到指定section
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    } else {
      scrollToSection(sectionId);
    }
  };

  // 提交邮箱到waitlist
  async function submitWaitlist(email: string) {
    const { data, error } = await supabase.from('waitlist_users').insert([
      { email }
    ]);
    if (error) {
      alert('Submission failed. Please try again later.');
    } else {
      alert('Thank you for joining the waitlist!');
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-indigo-500/80 to-purple-500/80 p-[1.5px]">
              <div className="w-full h-full rounded-full overflow-hidden bg-white">
                <img 
                  src={logoImage} 
                  alt="JupitLunar Logo" 
                  className="w-full h-full object-contain scale-[1.6] p-0.5 translate-x-2 translate-y-1" 
                />
              </div>
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-indigo-500/80 to-purple-500/80 bg-clip-text text-transparent">
              JupitLunar
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={handleHomeClick} className="text-gray-600 hover:text-gray-900 transition-colors">Home</button>
            <button onClick={() => handleSectionClick('features')} className="text-gray-600 hover:text-gray-900 transition-colors">Features</button>
            
            {/* Products Dropdown */}
            <div className="relative" ref={productsMenuRef}>
              <button
                className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-1"
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
                  className="absolute top-full left-0 mt-3 w-44 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50 py-2 overflow-hidden"
                >
                  <Link 
                    to="/dearbaby" 
                    onClick={() => setIsProductsOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 transition-all duration-200 text-sm font-medium"
                  >
                    DearBaby
                  </Link>
                  <Link 
                    to="/solidstart" 
                    onClick={() => setIsProductsOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 transition-all duration-200 text-sm font-medium"
                  >
                    SolidStart
                  </Link>
                </motion.div>
              )}
            </div>
            
            <button onClick={() => handleSectionClick('story')} className="text-gray-600 hover:text-gray-900 transition-colors">About</button>
            <button onClick={() => handleSectionClick('contact')} className="text-gray-600 hover:text-gray-900 transition-colors">Contact</button>
            <Link to="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">Blog</Link>
            <Link to="/faq" className="text-gray-600 hover:text-gray-900 transition-colors">FAQ</Link>
            {/* Join Beta 按钮 */}
            <button
              onClick={() => setShowBetaModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm font-medium shadow-sm hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
            >
              Join Beta
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
              <button onClick={() => {
                handleHomeClick();
                setIsMenuOpen(false);
              }} className="text-left text-gray-600 hover:text-gray-900 transition-colors">
                Home
              </button>
              <button onClick={() => {
                handleSectionClick('features');
                setIsMenuOpen(false);
              }} className="text-left text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </button>
              <Link to="/dearbaby" className="text-left text-gray-600 hover:text-gray-900 transition-colors">
                DearBaby
              </Link>
              <Link to="/solidstart" className="text-left text-gray-600 hover:text-gray-900 transition-colors">
                SolidStart
              </Link>
              <button onClick={() => {
                handleSectionClick('story');
                setIsMenuOpen(false);
              }} className="text-left text-gray-600 hover:text-gray-900 transition-colors">
                About
              </button>
              <button onClick={() => {
                handleSectionClick('contact');
                setIsMenuOpen(false);
              }} className="text-left text-gray-600 hover:text-gray-900 transition-colors">
                Contact
              </button>
              <Link to="/blog" className="text-left text-gray-600 hover:text-gray-900 transition-colors">
                Blog
              </Link>
              <Link to="/faq" className="text-left text-gray-600 hover:text-gray-900 transition-colors">
                FAQ
              </Link>
              <Link to="/beta" className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm font-medium shadow-sm hover:from-indigo-600 hover:to-purple-600 transition-all duration-300">
                Join Beta
              </Link>
            </nav>
          </motion.div>
        )}
      </div>

      {/* Beta 弹窗 */}
      {showBetaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-3xl p-10 max-w-sm w-full relative translate-y-32 border-0 shadow-lg">
            <button
              className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 text-2xl font-light focus:outline-none"
              onClick={() => setShowBetaModal(false)}
              aria-label="Close"
              style={{ background: 'none', border: 'none', lineHeight: 1 }}
            >
              ×
            </button>
            <h3 className="text-2xl font-semibold mb-6 text-gray-800 tracking-tight">Join Beta</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await submitWaitlist(email);
                setShowBetaModal(false);
              }}
              className="space-y-6"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-5 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-transparent text-base transition-all duration-200 placeholder-gray-400"
                required
              />
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl text-base font-semibold shadow-none hover:from-indigo-600 hover:to-purple-600 transition-all duration-200"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;