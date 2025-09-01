'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import { generateWebsiteStructuredData, generateOrganizationStructuredData } from '@/lib/json-ld';
import Script from 'next/script';

function HomePage() {
  const [email, setEmail] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  const featuresScrollRef = useRef<HTMLDivElement>(null);
  const [canFeaturesScrollLeft, setCanFeaturesScrollLeft] = useState(false);
  const [canFeaturesScrollRight, setCanFeaturesScrollRight] = useState(true);

  // 评论滚动控制函数
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  // Features滚动控制函数
  const featuresScrollLeft = () => {
    if (featuresScrollRef.current) {
      featuresScrollRef.current.scrollBy({ left: -380, behavior: 'smooth' });
      setTimeout(() => checkFeaturesScrollButtons(), 100);
    }
  };

  const featuresScrollRight = () => {
    if (featuresScrollRef.current) {
      featuresScrollRef.current.scrollBy({ left: 380, behavior: 'smooth' });
      setTimeout(() => checkFeaturesScrollButtons(), 100);
    }
  };

  // 检查评论滚动状态
  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // 检查Features滚动状态
  const checkFeaturesScrollButtons = () => {
    if (featuresScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = featuresScrollRef.current;
      const hasMoreContent = scrollWidth > clientWidth + 50;
      setCanFeaturesScrollLeft(scrollLeft > 10);
      setCanFeaturesScrollRight(hasMoreContent && scrollLeft < scrollWidth - clientWidth - 50);
    }
  };

  // 页面加载时检查初始状态
  useEffect(() => {
    const timer = setTimeout(() => {
      checkScrollButtons();
      checkFeaturesScrollButtons();
      
      if (featuresScrollRef.current) {
        const { scrollWidth, clientWidth } = featuresScrollRef.current;
        if (scrollWidth > clientWidth) {
          setCanFeaturesScrollRight(true);
        }
      }
    }, 800);
    
    const handleResize = () => {
      checkScrollButtons();
      checkFeaturesScrollButtons();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 加入等待名单
  async function submitWaitlist(email: string) {
    // TODO: Implement with Supabase
    console.log('Waitlist submission:', email);
    alert('Thank you for joining the waitlist!');
  }

  // 提交联系表单
  async function submitContact(email: string, message: string) {
    // TODO: Implement with Supabase
    console.log('Contact submission:', { email, message });
    alert('Thank you for your feedback!');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitWaitlist(email);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitContact(contactForm.email, contactForm.message);
    setContactForm({ name: '', email: '', message: '' });
  };

  const [showBetaModal, setShowBetaModal] = useState(false);

  // 生成结构化数据
  const websiteData = generateWebsiteStructuredData();
  const organizationData = generateOrganizationStructuredData();

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData)
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-[#F8F6FC] to-[#EAE6F8] relative overflow-hidden text-center">
        <Header />
      {/* Hero Section - Full Width Banner */}
      <section 
        id="home" 
        className="relative h-screen flex items-center overflow-hidden px-4 sm:px-8 hero-bg"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3)), url(/Assets/sunset1.png)`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Desktop Layout */}
        <div className="hidden md:block relative z-10 text-left text-white max-w-4xl" style={{ marginLeft: '10%' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 whitespace-nowrap -ml-4 text-gray-800 leading-tight">
              <span className="block">AI-Powered Health Intelligence</span>
              <span className="block text-3xl md:text-4xl lg:text-5xl font-light mt-4 opacity-90 text-gray-700">
                &nbsp;&nbsp;For Mom & Baby Wellness
              </span>
            </h1>

            <div className="space-y-4 mb-12 max-w-3xl pl-4">
              <p className="text-lg md:text-xl opacity-90 font-medium text-gray-700">
                Biometric analysis, stress & sleep monitoring
              </p>
              <p className="text-lg md:text-xl opacity-90 text-gray-700">
                Personalized insights for maternal & infant wellness
              </p>
              <p className="text-lg md:text-xl opacity-90 text-gray-700">
                Tailored Predictive Insights for Maternal and Infant Care
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Get early access"
                className="flex-1 px-6 py-4 text-base rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-300"
                required
              />
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-indigo-400 to-purple-400 text-white rounded-full text-base font-semibold shadow-none hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 whitespace-nowrap"
              >
                Join Beta
              </button>
            </form>
          </motion.div>
        </div>
                
        {/* Mobile Layout */}
        <div className="md:hidden relative z-10 text-center text-white w-full px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-6 text-black">
              <span className="block">AI-Powered Health Intelligence</span>
              <span className="block text-2xl sm:text-3xl font-light mt-3 opacity-90 text-black">
                For Mom & Baby Wellness
              </span>
            </h1>

            <div className="space-y-2 mb-8 max-w-sm mx-auto">
              <p className="text-base opacity-90 text-black">
                Advanced AI-Powered Health Intelligence
              </p>
              <p className="text-base opacity-90 text-black">
                For Moms & Babies Across North America
              </p>
              <p className="text-base opacity-90 text-black">
                Biometric analysis, stress & sleep monitoring
              </p>
              <p className="text-base opacity-90 text-black">
                Personalized insights for maternal & infant wellness
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Get early access"
                className="w-full px-5 py-3 text-base rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-300"
                required
              />
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-400 to-purple-400 text-white rounded-full text-base font-semibold shadow-none hover:from-indigo-500 hover:to-purple-500 transition-all duration-300"
              >
                Join Beta
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Premium Products Showcase */}
      <section id="products" className="py-16 bg-gradient-to-br from-rose-50/30 via-pink-50/20 to-orange-50/30 relative overflow-hidden">
        {/* Soft background decoration */}
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-gradient-to-br from-pink-100/40 to-rose-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-gradient-to-br from-orange-100/40 to-yellow-100/30 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-[#6d5dd3] mb-4">
                Our Family of <span className="bg-gradient-to-r from-[#a18aff] to-[#e0c3fc] bg-clip-text text-transparent">AI Solutions</span>
              </h2>
              <p className="text-lg text-[#a18aff] max-w-2xl mx-auto leading-relaxed font-light">
                Gentle technology that grows with your family's journey
              </p>
            </motion.div>

            {/* Products Grid - 3 Large Cards */}
            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
              
              {/* MomAI */}
              <motion.div 
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div
                  className="relative w-full max-w-[370px] sm:max-w-[420px] 
                            h-[480px] sm:h-[460px]
                            bg-white/80 backdrop-blur-sm rounded-3xl p-6 lg:p-8
                            shadow-sm hover:shadow-md border-0 transition-all
                            duration-500 group-hover:bg-white/90 group-hover:scale-[1.02]"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,.4),rgba(0,0,0,.3)),url(/Assets/dearbaby.png)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  {/* 抽象背景元素 */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl translate-x-8 -translate-y-8" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-300 rounded-full blur-2xl -translate-x-4 translate-y-4" />
                    <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-indigo-300 rounded-full blur-xl -translate-x-10 -translate-y-10" />
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-1.5 left-6 z-20">
                    <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm
                                    text-white text-xs font-medium rounded-full shadow-sm
                                    border border-white/30">
                      Available on iOS
                    </span>
                  </div>

                  {/* Header */}
                  <div className="relative z-10 text-white pt-6 text-center">
                    <h3 className="text-3xl sm:text-4xl font-bold mb-3">DearBaby</h3>
                    <p className="text-white/90 text-base sm:text-lg font-light">
                      Your Ultimate AI Health<br />Partner
                    </p>
                  </div>

                  {/* 二维码固定贴底 */}
                  <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2
                                  flex flex-col items-center z-10">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2
                                    border border-white/30">
                      <Image
                        src="/Assets/scanme.png"
                        alt="Download QR Code"
                        width={80}
                        height={80}
                        className="w-20 h-20 sm:w-20 sm:h-20"
                      />
                    </div>
                    <span className="text-white/80 text-xs mt-2">
                      Scan&nbsp;to&nbsp;Download
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Baby SolidStart */}
              <motion.div 
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div
                  className="relative w-full max-w-[370px] sm:max-w-[420px] h-[480px] sm:h-[460px] bg-white/80 backdrop-blur-sm rounded-3xl p-6 lg:p-8 shadow-sm hover:shadow-md border-0 transition-all duration-500 group-hover:bg-white/90 group-hover:scale-[1.02]"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,.4),rgba(0,0,0,.3)),url(/Assets/welcomefox.png)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  {/* 抽象背景元素 */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl translate-x-8 -translate-y-8" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-200 rounded-full blur-2xl -translate-x-4 translate-y-4" />
                    <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-yellow-200 rounded-full blur-xl -translate-x-10 -translate-y-10" />
                  </div>
                  {/* Status Badge */}
                  <div className="absolute top-1.5 left-6 z-20">
                    <span className="px-3 py-1.5 bg-gradient-to-r from-orange-400 to-amber-400 text-white text-xs font-medium rounded-full shadow-sm border border-white/30">
                      Beta Testing
                    </span>
                  </div>
                  {/* Header */}
                  <div className="relative z-10 text-white pt-6 text-center">
                    <h3 className="text-3xl sm:text-4xl font-bold mb-3">Baby SolidStart</h3>
                    <p className="text-white/90 text-base sm:text-lg font-light">
                      Thoughtful nutrition guidance for your little one's first food adventures,<br />backed by trusted research.
                    </p>
                  </div>
                  {/* 按钮区底部居中 */}
                  <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-row items-center justify-center space-x-3 z-10">
                    <Link 
                      href="/solidstart"
                      className="bg-white text-orange-600 px-4 py-2 rounded-xl font-semibold text-center hover:bg-orange-50 transition-all duration-300 text-xs shadow-sm whitespace-nowrap"
                    >
                      Learn More
                    </Link>
                    <button
                      onClick={() => setShowBetaModal(true)}
                      className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-medium hover:bg-white/30 transition-colors duration-300 text-xs border border-white/30 whitespace-nowrap"
                    >
                      Join Beta
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* BabyGPT */}
              <motion.div 
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div
                  className="relative w-full max-w-[370px] sm:max-w-[420px] h-[480px] sm:h-[460px] bg-white/80 backdrop-blur-sm rounded-3xl p-6 lg:p-8 shadow-sm hover:shadow-md border-0 transition-all duration-500 group-hover:bg-white/90 group-hover:scale-[1.02]"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,.4),rgba(0,0,0,.3)),url(/Assets/welcomebear.png)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  {/* 抽象背景元素 */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl translate-x-8 -translate-y-8" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-200 rounded-full blur-2xl -translate-x-4 translate-y-4" />
                    <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-indigo-200 rounded-full blur-xl -translate-x-10 -translate-y-10" />
                  </div>
                  {/* Status Badge */}
                  <div className="absolute top-1.5 left-6 z-20">
                    <span className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-medium rounded-full shadow-sm border border-white/30">
                      Coming Soon
                    </span>
                  </div>
                  {/* Header */}
                  <div className="relative z-10 text-white pt-6 text-center">
                    <h3 className="text-3xl sm:text-4xl font-bold mb-3">DearBabyGPT</h3>
                    <p className="text-white/90 text-base sm:text-lg font-light">
                      Advanced AI-powered assistant specifically trained for baby.
                    </p>
                  </div>
                  
                  {/* Coming Soon 按钮 */}
                  <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex justify-center z-10">
                    <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-medium cursor-default text-xs border border-white/30 whitespace-nowrap">
                      Coming Soon
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 bg-white">
        <div className="w-full flex justify-start px-4">
          <div className="max-w-full w-full pl-8">
            <div className="text-center mb-8 pl-4">
              <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-[#6d5dd3]">
                Core <span className="bg-gradient-to-r from-[#a18aff] to-[#e0c3fc] bg-clip-text text-transparent">Features</span>
              </h2>
              <p className="text-lg text-[#a18aff]">
                Advanced AI technology for comprehensive family health intelligence
              </p>
            </div>

            {/* Navigation Arrows */}
            <div className="relative">
              {/* Left Arrow Button */}
              <button
                onClick={featuresScrollLeft}
                disabled={!canFeaturesScrollLeft}
                className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-300 ${
                  canFeaturesScrollLeft
                    ? 'text-gray-700 hover:bg-gray-50 hover:shadow-xl cursor-pointer'
                    : 'text-gray-300 cursor-not-allowed opacity-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Right Arrow Button */}
              <button
                onClick={featuresScrollRight}
                disabled={!canFeaturesScrollRight}
                className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-300 ${
                  canFeaturesScrollRight
                    ? 'text-gray-700 hover:bg-gray-50 hover:shadow-xl cursor-pointer'
                    : 'text-gray-300 cursor-not-allowed opacity-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Scrolling Content */}
              <div 
                ref={featuresScrollRef}
                onScroll={checkFeaturesScrollButtons}
                className="flex overflow-x-auto gap-4 pb-4 px-12 hide-scrollbar"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                {/* Feed · Sleep · Diaper Alerts */}
                <motion.div 
                  className="min-w-[320px] w-[360px] bg-white rounded-xl p-3 shadow-sm hover:shadow-lg transition-all duration-300 flex-shrink-0 border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="h-[700px] mb-3 overflow-hidden rounded-lg relative">
                    <Image
                      src="/Assets/babydashboard.png"
                      alt="Feed · Sleep · Diaper Reminders"
                      width={360}
                      height={700}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center px-2">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Feed · Sleep · Diaper Reminders</h3>
                    <p className="text-sm text-gray-600 max-w-[280px] mx-auto text-center leading-relaxed">
                      AI‑timed reminder for every feed, nap & diaper change—auto‑logged in your baby tracker for growth‑trend analysis.
                    </p>
                  </div>
                </motion.div>

                {/* Health Intelligence */}
                <motion.div 
                  className="min-w-[320px] w-[360px] bg-white rounded-xl p-3 shadow-sm hover:shadow-lg transition-all duration-300 flex-shrink-0 border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="h-[700px] mb-3 overflow-hidden rounded-lg relative">
                    <Image
                      src="/Assets/healthprediction.png"
                      alt="Health Intelligence"
                      width={360}
                      height={700}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center px-2">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Health Intelligence</h3>
                    <p className="text-sm text-gray-600 max-w-[280px] mx-auto text-center leading-relaxed">
                      AI‑driven HRV & sleep‑stage analytics that detect stress patterns and circadian drift straight from your Apple Watch data.
                    </p>
                  </div>
                </motion.div>

                {/* SmartTask Reminders */}
                <motion.div
                  className="min-w-[320px] w-[360px] bg-white rounded-xl p-3 shadow-sm hover:shadow-lg transition-all duration-300 flex-shrink-0 border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="h-[700px] mb-3 overflow-hidden rounded-lg relative">
                    <Image
                      src="/Assets/smarttask.png"
                      alt="SmartTask Reminders"
                      width={360}
                      height={700}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center px-2">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">SmartTask Reminders</h3>
                    <p className="text-sm text-gray-600 max-w-[280px] mx-auto text-center leading-relaxed">
                      AI‑powered task management that learns your routine and suggests optimal timing for daily activities.
                    </p>
                  </div>
                </motion.div>

                {/* Event Exploration */}
                <motion.div
                  className="min-w-[320px] w-[360px] bg-white rounded-xl p-3 shadow-sm hover:shadow-lg transition-all duration-300 flex-shrink-0 border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="h-[700px] mb-3 overflow-hidden rounded-lg relative">
                    <Image
                      src="/Assets/exploreevent.png"
                      alt="Event Exploration"
                      width={360}
                      height={700}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center px-2">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Event Exploration</h3>
                    <p className="text-sm text-gray-600 max-w-[280px] mx-auto text-center leading-relaxed">
                      Discover local family‑friendly events and activities tailored to your baby's age and interests.
                    </p>
                  </div>
                </motion.div>

                {/* Growth Chart */}
                <motion.div
                  className="min-w-[320px] w-[360px] bg-white rounded-xl p-3 shadow-sm hover:shadow-lg transition-all duration-300 flex-shrink-0 border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className="h-[700px] mb-3 overflow-hidden rounded-lg relative">
                    <Image
                      src="/Assets/growthchart.png"
                      alt="Growth Chart"
                      width={360}
                      height={700}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center px-2">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Growth Chart</h3>
                    <p className="text-sm text-gray-600 max-w-[280px] mx-auto text-center leading-relaxed">
                      Visual tracking of your baby's development milestones with AI‑powered insights and recommendations.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beta Modal */}
      {showBetaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-3xl p-10 max-w-sm w-full relative border-0 shadow-lg">
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
                className="w-full px-5 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-transparent text-base transition-all duration-200 placeholder-gray-400"
                required
              />
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl text-base font-semibold shadow-none hover:from-primary-600 hover:to-primary-700 transition-all duration-200"
              >
                Join Beta
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default HomePage;
