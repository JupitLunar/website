import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import CenteredContainer from '../components/CenteredContainer';
import { createClient } from '@supabase/supabase-js';

// 使用正确的 Assets 目录路径（大写）
const logoImage = require('../Assets/Logo.png');
const babydashboard = require('../Assets/babydashboard.png');
const smart_task = require('../Assets/smarttask.png');
const health_prediction = require('../Assets/healthprediction.png');
const explore_event = require('../Assets/exploreevent.png');
const baby_development = require('../Assets/growthchart.png');
const mom_health_analysis = require('../Assets/mom_health_analysis.png');
const babygpt = require('../Assets/babygpt1.png');
const screenshotImage = require('../Assets/sunset1.png');
const screenshotStory = require('../Assets/story.png');
const welcomeImage = require('../Assets/dearbaby.png');
const scanmeImage = require('../Assets/scanme.png');
const welcomeFoxImage = require('../Assets/welcomefox.png');
const welcomebearImage = require('../Assets/welcomebear.png');

// 使用环境变量初始化 supabase client
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL as string,
  process.env.REACT_APP_SUPABASE_ANON_KEY as string
);

function Home() {
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
      // 立即更新状态
      setTimeout(() => checkFeaturesScrollButtons(), 100);
    }
  };

  const featuresScrollRight = () => {
    if (featuresScrollRef.current) {
      featuresScrollRef.current.scrollBy({ left: 380, behavior: 'smooth' });
      // 立即更新状态
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
      
      // 简化逻辑：如果有很多卡片，scrollWidth应该大于clientWidth
      const hasMoreContent = scrollWidth > clientWidth + 50; // 给一点缓冲
      
      setCanFeaturesScrollLeft(scrollLeft > 10);
      setCanFeaturesScrollRight(hasMoreContent && scrollLeft < scrollWidth - clientWidth - 50);
      
      // 添加调试信息
      console.log('Features scroll state:', {
        scrollLeft,
        scrollWidth,
        clientWidth,
        hasMoreContent,
        canScrollLeft: scrollLeft > 10,
        canScrollRight: hasMoreContent && scrollLeft < scrollWidth - clientWidth - 50
      });
    }
  };

  // 页面加载时检查初始状态
  useEffect(() => {
    // 延迟一点让内容渲染完成
    const timer = setTimeout(() => {
      checkScrollButtons();
      checkFeaturesScrollButtons();
      
      // 如果还是没有内容，强制设置右箭头可用（因为我们知道有5个卡片）
      if (featuresScrollRef.current) {
        const { scrollWidth, clientWidth } = featuresScrollRef.current;
        if (scrollWidth > clientWidth) {
          setCanFeaturesScrollRight(true);
        }
      }
    }, 800); // 增加更多延迟时间
    
    // 添加resize监听器
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
    const { data, error } = await supabase.from('waitlist_users').insert([
      { email }
    ]);
    if (error) {
      console.error('Submission error:', error);
      alert('Submission failed. Please try again later.');
    } else {
      alert('Thank you for joining the waitlist!');
      console.log('Success:', data);
    }
  }

  // 提交联系表单
  async function submitContact(email: string, message: string) {
    const { data, error } = await supabase.from('user_feedback').insert([
      { email, message }
    ]);
    if (error) {
      console.error('Contact submission error:', error);
      alert('Submission failed. Please try again later.');
    } else {
      alert('Thank you for your feedback!');
      console.log('Contact success:', data);
    }
  }

  // 修改 handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitWaitlist(email);
  };

  // 修改 handleContactSubmit
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitContact(contactForm.email, contactForm.message);
    setContactForm({ name: '', email: '', message: '' });
  };

  // 在Home组件内添加弹窗状态和弹窗Card
  const [showBetaModal, setShowBetaModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F6FC] to-[#EAE6F8] relative overflow-hidden text-center">
      <Header />
      
      {/* Hero Section - Full Width Banner */}
      <section 
        id="home" 
        className="relative h-screen flex items-center overflow-hidden px-4 sm:px-8 hero-bg"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3)), url(${screenshotImage})`,
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
                          h-[480px] sm:h-[460px]     /* ← 固定高度 */
                          bg-white/80 backdrop-blur-sm rounded-3xl p-6 lg:p-8
                          shadow-sm hover:shadow-md border-0 transition-all
                          duration-500 group-hover:bg-white/90 group-hover:scale-[1.02]"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,.4),rgba(0,0,0,.3)),url(${welcomeImage})`,
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

                {/* ——二维码固定贴底—— */}
                <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2
                                flex flex-col items-center z-10">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2
                                  border border-white/30">
                    <img
                      src={scanmeImage}
                      alt="Download QR Code"
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
                    backgroundImage: `linear-gradient(rgba(0,0,0,.4),rgba(0,0,0,.3)),url(${welcomeFoxImage})`,
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
                    <a 
                      href="/solidstart"
                      className="bg-white text-orange-600 px-4 py-2 rounded-xl font-semibold text-center hover:bg-orange-50 transition-all duration-300 text-xs shadow-sm whitespace-nowrap"
                    >
                      Learn More
                    </a>
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
                    backgroundImage: `linear-gradient(rgba(0,0,0,.4),rgba(0,0,0,.3)),url(${welcomebearImage})`,
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
                      <img
                        src={babydashboard}
                        alt="Feed · Sleep · Diaper Reminders"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center px-2">
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">Feed · Sleep · Diaper Reminders</h3>
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
                      <img
                        src={health_prediction}
                        alt="Health Intelligence"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center px-2">
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">Health Intelligence</h3>
                      <p className="text-sm text-gray-600 max-w-[280px] mx-auto text-center leading-relaxed">
                        AI‑driven HRV & sleep‑stage analytics that detect stress patterns and circadian drift straight from your Apple Watch data.
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
                      <img
                        src={smart_task}
                        alt="SmartTask Reminders"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center px-2">
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">SmartTask Reminders</h3>
                      <p className="text-sm text-gray-600 max-w-[280px] mx-auto text-center leading-relaxed">
                        GPT‑generated subtasks with feed, sleep & diaper alerts—nudging you precisely when your baby needs care.
                      </p>
                    </div>
                  </motion.div>

                  {/* mom health */}
                  <motion.div
                    className="min-w-[320px] w-[360px] bg-white rounded-xl p-3 shadow-sm hover:shadow-lg transition-all duration-300 flex-shrink-0 border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <div className="h-[700px] mb-3 overflow-hidden rounded-lg relative">
                      <img
                        src={mom_health_analysis}
                        alt="Story & Community"
                        className="w-full h-full object-cover"
                        />
                </div>
                    <div className="text-center px-2">
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">Mom Health Analytics</h3>
                      <p className="text-sm text-gray-600 max-w-[280px] mx-auto text-center leading-relaxed">
                        Unified dashboard fusing post‑partum HRV, deep‑sleep minutes & recovery scores, spotlighting fatigue and stress trends for busy moms.
                      </p>
          </div>
                  </motion.div>
                  {/* Baby Development Tracking */}
                  <motion.div
                    className="min-w-[320px] w-[360px] bg-white rounded-xl p-3 shadow-sm hover:shadow-lg transition-all duration-300 flex-shrink-0 border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <div className="h-[700px] mb-3 overflow-hidden rounded-lg relative">
                      <img
                        src={baby_development}
                        alt="Baby Development Tracking"
                        className="w-full h-full object-cover"
                      />
        </div>
                    <div className="text-center px-2">
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">Baby Development Tracking</h3>
                      <p className="text-sm text-gray-600 max-w-[280px] mx-auto text-center leading-relaxed">
                        Log feeds, naps and tummy‑time, then get AI milestone forecasts & WHO‑benchmarked growth curves.
                  </p>
                </div>
                  </motion.div>

                  

                  {/* Events & Milestones */}
                  <motion.div
                    className="min-w-[320px] w-[360px] bg-white rounded-xl p-3 shadow-sm hover:shadow-lg transition-all duration-300 flex-shrink-0 border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <div className="h-[700px] mb-3 overflow-hidden rounded-lg relative">
                      <img
                        src={explore_event}
                        alt="Events & Milestones"
                        className="w-full h-full object-cover"
                        />
                      </div>
                    <div className="text-center px-2">
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">Events & Milestones</h3>
                      <p className="text-sm text-gray-600 max-w-[280px] mx-auto text-center leading-relaxed">
                        Auto‑log vaccinations and doctor visits, with personalised iOS calendar nudges so nothing slips through the cracks.
                      </p>
                    </div>
                  </motion.div>

                  {/* DearBabyGPT */}
                  <motion.div
                    className="min-w-[320px] w-[360px] bg-white rounded-xl p-3 shadow-sm hover:shadow-lg transition-all duration-300 flex-shrink-0 border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <div className="h-[700px] mb-3 overflow-hidden rounded-lg relative">
                      <img
                        src={babygpt}
                        alt="DearBabyGPT"
                        className="w-full h-full object-cover"
                      />
                  </div>
                    <div className="text-center px-2">
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">DearBabyGPT</h3>
                  </div>
                  </motion.div>
                </div>
                  </div>
                </div>
              </div>
      </section>


      {/* Social Proof Section - Horizontal Scroll */}
      <section id="testimonials" className="py-12 bg-gray-50 text-center">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Trusted by Real Families</h2>
              <p className="text-gray-600 font-light">Hear from parents using our AI solutions</p>
            </div>
            {/* Arrow-Controlled Scrolling Container */}
            <div className="relative">
              {/* Left Arrow Button */}
              <button
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-300 ${
                  canScrollLeft
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
                onClick={scrollRight}
                disabled={!canScrollRight}
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-300 ${
                  canScrollRight
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
                ref={scrollRef}
                onScroll={checkScrollButtons}
                className="flex overflow-x-auto gap-6 pb-4 px-12 hide-scrollbar"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                {/* 新的10条GEO优化quote */}
                {[
                  {
                    name: 'Jennifer Martinez',
                    role: 'Working Mom',
                    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
                    quote: '"DearBaby flagged a 28 % HRV stress spike and coached a 5‑minute breathing drill; my recovery score bounced back the same afternoon.”'
                  },
                  {
                    name: 'Lisa Thompson',
                    role: 'New Mom',
                    avatar: 'https://randomuser.me/api/portraits/women/47.jpg',
                    quote: '“DearBaby detected an HRV pattern linked to postpartum anxiety; one week of guided breathwork dropped my resting HR by 7 bpm.”'
                  },
                  {
                    name: 'David Chen',
                    role: 'Beta Tester',
                    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
                    quote: '“SolidStart built a peanut introduction plan from our history—7 new foods in 10 days and zero allergy flare‑ups.”'
                  },
                  {
                    name: 'Sarah Kim',
                    role: 'Mom of Twins',
                    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
                    quote: '“With twins, chaos ruled—DearBaby automatically moved six low‑priority tasks, saving us ~40 minutes every night.”'
                  },
                  {
                    name: 'Michael Rodriguez',
                    role: 'First-time Dad',
                    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                    quote: '“SolidStart’s 3‑step egg protocol kept us calm; once cleared, it suggested iron‑rich lentils next.”'
                  },
                  {
                    name: 'Anna Williams',
                    role: 'Mom & Nurse',
                    avatar: 'https://randomuser.me/api/portraits/women/25.jpg',
                    quote: '“I compared DearBaby’s HRV readings with the ECG in my clinic—95 % accuracy. Trustworthy data for health pros.”'
                  },
                  {
                    name: 'Grace Lee',
                    role: 'Night‑shift Nurse',
                    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
                    quote: '“DearBaby syncs my Apple Watch sleep stages and alerts me if my baby’s nap overlaps—helped me gain 30 extra minutes of rest per shift.”'
                  },
                  {
                    name: 'Carlos Mendez',
                    role: 'Allergy‑Concerned Dad',
                    avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
                    quote: '“SolidStart flagged sesame in a hummus jar and instantly offered 3 safe substitutes—no ER visits this time.”'
                  },
                  {
                    name: 'Emily Brown',
                    role: 'Second‑time Mom',
                    avatar: 'https://randomuser.me/api/portraits/women/50.jpg',
                    quote: '“The twin‑schedule view let me log feeds for both babies; weekly summary email shortened our pediatric check‑in to under 5 minutes.”'
                  },
                  {
                    name: 'Nina Patel',
                    role: 'Diet‑Tech Blogger',
                    avatar: 'https://randomuser.me/api/portraits/women/60.jpg',
                    quote: '“I fed SolidStart only pantry items; the AI generated 21 balanced weaning recipes and highlighted top‑9 allergen risks.”'
                  }
                ].map(({ name, role, avatar, quote }, i) => (
                  <div key={name} className="min-w-[240px] w-[240px] md:min-w-[280px] md:w-[280px] bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300 flex-shrink-0">
                    <div className="flex items-start space-x-3 mb-3">
                  <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img 
                            src={avatar} 
                            alt={name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                      <div className="text-left min-w-0 flex-1">
                        <h4 className="font-medium text-gray-900 text-sm truncate">{name}</h4>
                        <p className="text-xs text-gray-500">{role}</p>
                  </div>
                  </div>
                    <div className="space-y-2 text-left">
                      <div className="flex text-amber-400 text-sm">
                    {"★★★★★".split("").map((star, i) => (
                      <span key={i}>{star}</span>
                    ))}
                  </div>
                      <p className="text-gray-600 text-xs leading-relaxed break-words">
                        {quote}
                  </p>
                </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Story Section */}
      <section id="story" className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-8 text-gray-900">
            About JupitLunar
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            JupitLunar builds <strong>AI baby‑care tools for modern mothers</strong>,
            combining wearable data, feeding logs and sleep patterns to deliver real‑time
            insights on postpartum recovery, newborn sleep and safe solid‑food
            introduction. Our all‑female product team—spanning software engineers,
            pediatric diet‑tech specialists and long‑time moms—designs every feature
            with ease‑of‑use and <strong>data privacy</strong> at its core.
          </p>

          <p className="text-gray-600 text-lg leading-relaxed">
            With <strong>DearBaby</strong> you can track HRV‑based stress, nursing
            sessions and twin schedules in one place; <strong>SolidStart</strong> turns
            the ingredients already in your kitchen into
            <strong> allergy‑aware weaning recipes</strong> and meal plans. The result:
            AI that not only records feeds, naps and milestones, but guides you through
            the first‑year journey—helping moms sleep better and babies eat smarter.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gradient-to-br from-[#F8F6FC] to-[#EAE6F8]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
              <motion.div 
              className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
              <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-900">
                Contact Us
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Ready to revolutionize your family's health journey? Get in touch with our team.
              </p>
              </motion.div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div 
                className="bg-white rounded-xl p-8 shadow-sm"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all duration-300"
                      placeholder="Tell us about your interest in our AI health platforms"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl text-base font-medium shadow-sm hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
                  >
                    Send Message
                  </button>
                </form>
              </motion.div>

              {/* Contact Info */}
              <motion.div 
                className="space-y-8"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-xl p-8 shadow-sm">
                  <h3 className="text-xl font-medium mb-6">Contact Information</h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex-shrink-0">
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Email</h4>
                        <p className="text-gray-600">hello@momaiagent.com</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex-shrink-0">
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Business Inquiries</h4>
                        <p className="text-gray-600">support@@momaiagent.com</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex-shrink-0">
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Headquarters</h4>
                        <p className="text-gray-600">Edmonton, Alberta, Canada</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              © 2024 JupitLunar. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="/privacy" className="text-gray-600 hover:text-purple-600">Privacy Policy</a>
              <a href="/terms" className="text-gray-600 hover:text-purple-600">Terms of Service</a>
              <a href="mailto:hello@jupitlunar.com" className="text-gray-600 hover:text-purple-600">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      {showBetaModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full relative">
      <button
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
        onClick={() => setShowBetaModal(false)}
        aria-label="Close"
      >
        ×
      </button>
      <h3 className="text-xl font-bold mb-4 text-gray-800">Join Beta</h3>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await submitWaitlist(email);
          setShowBetaModal(false);
        }}
        className="space-y-4"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all duration-300"
          required
        />
        <button
          type="submit"
          className="w-full px-6 py-3 bg-gradient-to-r from-orange-400 to-amber-400 text-white rounded-xl text-base font-semibold shadow-sm hover:from-orange-500 hover:to-amber-500 transition-all duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  </div>
)}
    </div>
  );
}

export default Home; 