import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const logoImage = require('../Assets/Logo.png');

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
            <button onClick={() => scrollToSection('home')} className="text-gray-600 hover:text-gray-900 transition-colors">Home</button>
            <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-gray-900 transition-colors">Features</button>
            <button onClick={() => scrollToSection('ai-inside')} className="text-gray-600 hover:text-gray-900 transition-colors">Technology</button>
            <button onClick={() => scrollToSection('story')} className="text-gray-600 hover:text-gray-900 transition-colors">About</button>
            <button onClick={() => scrollToSection('contact')} className="text-gray-600 hover:text-gray-900 transition-colors">Contact</button>
            <Link to="/beta" className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm font-medium shadow-sm hover:from-indigo-600 hover:to-purple-600 transition-all duration-300">
              Join Beta
            </Link>
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
                scrollToSection('home');
                setIsMenuOpen(false);
              }} className="text-left text-gray-600 hover:text-gray-900 transition-colors">
                Home
              </button>
              <button onClick={() => {
                scrollToSection('features');
                setIsMenuOpen(false);
              }} className="text-left text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </button>
              <button onClick={() => {
                scrollToSection('ai-inside');
                setIsMenuOpen(false);
              }} className="text-left text-gray-600 hover:text-gray-900 transition-colors">
                Technology
              </button>
              <button onClick={() => {
                scrollToSection('story');
                setIsMenuOpen(false);
              }} className="text-left text-gray-600 hover:text-gray-900 transition-colors">
                About
              </button>
              <button onClick={() => {
                scrollToSection('contact');
                setIsMenuOpen(false);
              }} className="text-left text-gray-600 hover:text-gray-900 transition-colors">
                Contact
              </button>
              <Link to="/beta" className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm font-medium shadow-sm hover:from-indigo-600 hover:to-purple-600 transition-all duration-300">
                Join Beta
              </Link>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
}

export default Header;