'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { BottomLineAnswer } from '@/components/BottomLineAnswer';
import NewsletterSignup from '@/components/NewsletterSignup';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';
import { generateMedicalWebPageSchema } from '@/lib/aeo-optimizations';

export default function DearBabyProductPage() {
  const features = [
    {
      title: "Smart Logs",
      desc: "Effortless feed & sleep tracking synced with Apple Health and Watch.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Milestone AI",
      desc: "GPT-based forecasts of growth, development, and predictive reminders.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: "Health Digest",
      desc: "Daily summaries combining HRV, naps, nutrition, and pattern insights.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: "Ask GPT Assistant",
      desc: "Voice and image-based Q&A for instant parenting help and guidance.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      )
    }
  ];

  // AEO Optimized Article Data
  const articleData = {
    title: "DearBaby: AI Baby Tracker & Sleep Coach - Free App with GPT-4o",
    slug: "products/dearbaby",
    one_liner: "The smartest free baby tracker with GPT-4o insights, Apple Watch sync, and automatic growth pattern recognition.",
    hub: "Tracking",
    age_range: "0-24 months",
    region: "Global",
    keywords: ["baby tracker", "AI baby assistant", "newborn sleep tracker", "feeding log", "growth chart app", "GPT-4o parenting", "Apple Watch baby app"],
    date_published: "2025-01-01",
    date_modified: new Date().toISOString().split('T')[0],
    last_reviewed: "2025-12-23",
    citations: [
      { title: "WHO: Growth Standards", url: "https://www.who.int/tools/child-growth-standards", publisher: "WHO" },
      { title: "AAP: Safe Sleep Guidelines", url: "https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/A-Parents-Guide-to-Safe-Sleep.aspx", publisher: "AAP" }
    ]
  };

  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: 'DearBaby - AI Baby Tracker & Sleep',
    alternateName: ['DearBaby App', 'DearBaby AI Tracker'],
    description: articleData.one_liner,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'iOS',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '2340',
    },
    author: {
      '@type': 'Organization',
      name: 'Mom AI Agent',
      url: 'https://www.momaiagent.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'JupitLunar',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.momaiagent.com/Assets/Logo.png',
      },
    },
    downloadUrl: 'https://apps.apple.com/us/app/dearbaby-grow-feed-sleep-track/id6747565368',
    screenshot: 'https://www.momaiagent.com/Assets/babydashboard.png',
    keywords: articleData.keywords.join(', '),
    featureList: [
      'One-tap feeding tracking (nursing, bottle, solid foods)',
      'Automatic sleep tracking with pattern recognition',
      'Diaper and milestone logging with photos',
      'GPT-4o powered AI parenting assistant',
      'Apple Watch integration for hands-free tracking',
      'Automatic growth charts and percentile tracking',
      'Smart feeding and sleep reminders',
      'Pattern recognition and predictive insights',
      'Voice and image-based Q&A',
      'Apple Health synchronization',
      'Free to download with premium analytics option',
    ],
  };

  const medicalSchema = useMemo(() => generateMedicalWebPageSchema(articleData), []);

  return (
    <div className="min-h-screen bg-gradient-elegant">
      {/* JSON-LD for AEO & SEO */}
      <Script
        id="app-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <Script
        id="medical-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalSchema) }}
      />

      <main>
        {/* HERO SECTION - Elegant Purple/Indigo Theme */}
        <section className="relative pt-16 pb-24 overflow-hidden bg-gradient-to-br from-indigo-50/20 via-white to-purple-50/10">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-100/20 to-violet-100/10 rounded-full blur-[100px] -z-10"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-purple-100/20 to-indigo-100/10 rounded-full blur-[80px] -z-10"></div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-[55%] text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <motion.div
                    className="inline-flex items-center gap-2 mb-8 px-5 py-2 bg-white/60 backdrop-blur-md rounded-full shadow-sm border border-indigo-100/50"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                    <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase">AI-Powered • Part of MomAI Ecosystem</span>
                  </motion.div>
                  
                  <h1 className="text-6xl lg:text-8xl font-light text-slate-700 mb-8 leading-[1.1] tracking-tight">
                    Calm, Data-Driven
                    <br />
                    <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-500 bg-clip-text text-transparent font-medium italic">
                      Support.
                    </span>
                  </h1>
                  
                  <p className="text-2xl text-slate-500/80 mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                    The smartest free baby tracker with GPT-4o insights, Apple Watch sync, and automatic growth pattern recognition.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
                    <a
                      href="https://apps.apple.com/us/app/dearbaby-grow-feed-sleep-track/id6747565368"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative px-12 py-5 bg-slate-900 text-white rounded-2xl font-medium text-xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 overflow-hidden"
                    >
                      <span className="relative z-10">Download Free</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </a>
                    <Link
                      href="/faq"
                      className="px-12 py-5 bg-white/80 backdrop-blur-sm text-slate-600 border border-slate-200 rounded-2xl font-medium text-xl hover:bg-slate-50 transition-all shadow-sm"
                    >
                      How it Works
                    </Link>
                  </div>
                  
                  <div className="mt-12 flex items-center justify-center lg:justify-start gap-5">
                    <div className="flex -space-x-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-md">
                          <img src={`https://i.pravatar.cc/100?img=${i + 30}`} alt="User profile" />
                        </div>
                      ))}
                    </div>
                    <div className="text-left">
                      <div className="flex text-indigo-400 mb-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <svg key={s} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        ))}
                      </div>
                      <span className="text-sm text-slate-400 font-light italic">Trusted by 18k+ North American families</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="lg:w-[45%] relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="relative mx-auto w-full max-w-[450px] flex justify-center items-center"
                >
                  {/* Dashboard Mockup */}
                  <motion.div 
                    className="relative z-20 w-[260px] sm:w-[320px] border-[12px] border-slate-900 rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] bg-white"
                    whileHover={{ y: -10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Image 
                      src="/Assets/babydashboard.png" 
                      alt="DearBaby App Dashboard" 
                      width={320}
                      height={690}
                      className="w-full h-auto object-cover"
                      priority
                    />
                  </motion.div>
                  
                  {/* Floating AI Mockup */}
                  <motion.div
                    animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -left-12 -bottom-10 z-30 w-[180px] sm:w-[220px] hidden sm:block"
                  >
                    <div className="border-[8px] border-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl bg-white">
                      <Image 
                        src="/Assets/babygpt1.png" 
                        alt="DearBaby AI Assistant" 
                        width={220}
                        height={475}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </motion.div>

                  {/* Soft Background Accents */}
                  <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-200/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
                  <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-purple-200/20 rounded-full blur-3xl -z-10"></div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* AEO BOTTOM LINE SECTION - Answers AI Queries Immediately */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <BottomLineAnswer
                question="What is the best baby tracker app with Apple Watch support and AI insights?"
                answer="DearBaby is the most advanced free baby tracker app featuring full Apple Watch integration, GPT-4o powered parenting guidance, and automatic growth pattern analysis. It allows parents to log feeds, sleep, and diapers with one tap, while providing clinical-grade insights from the MomAI Agent ecosystem."
                keyNumbers={["18k+ Users", "4.8⭐ Rating", "GPT-4o Engine"]}
                actionItems={[
                  "Download DearBaby on the App Store for iOS",
                  "Sync your Apple Watch for hands-free nighttime tracking",
                  "Ask the AI Assistant questions via voice or photo upload"
                ]}
                ageRange="Newborn to 24 Months"
                region="North America / Global"
                sources={["WHO Growth Charts", "AAP Sleep Standards", "CDC Milestone Tracker"]}
              />
            </motion.div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-24 bg-gradient-to-b from-white to-indigo-50/20">
          <div className="container mx-auto px-6">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl lg:text-6xl font-light text-slate-700 mb-8 tracking-tight">
                Intuitive <span className="font-medium text-indigo-400">Intelligence.</span>
              </h2>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
                DearBaby goes beyond simple logging. It analyzes your baby's unique data to predict patterns and provide proactive guidance.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-10 rounded-[2.5rem] border border-indigo-100/50 hover:border-indigo-200 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 group"
                >
                  <div className="w-16 h-16 mb-8 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-400 group-hover:text-white transition-all duration-500 shadow-inner">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-medium mb-4 text-slate-700 tracking-tight">{feature.title}</h3>
                  <p className="text-slate-500/80 leading-relaxed font-light">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SHOWCASE SECTION 1 - Apple Watch & Hands-Free */}
        <section className="py-32 bg-white overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-24">
              <div className="lg:w-1/2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="rounded-[4rem] overflow-hidden shadow-2xl border-[16px] border-slate-50 relative group">
                    <Image 
                      src="/Assets/scanme.png" 
                      alt="DearBaby Apple Watch Integration" 
                      width={600}
                      height={800}
                      className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  </div>
                  {/* Floating info card */}
                  <motion.div 
                    className="absolute -bottom-8 -right-8 p-8 bg-white rounded-3xl shadow-2xl border border-indigo-100 max-w-[240px] hidden md:block"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                      </div>
                      <span className="text-sm font-bold text-slate-700">Hands-Free</span>
                    </div>
                    <p className="text-sm text-slate-500 font-light">Log nighttime feeds and naps directly from your wrist. No phone needed.</p>
                  </motion.div>
                </motion.div>
              </div>
              <div className="lg:w-1/2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <span className="uppercase tracking-[0.4em] text-xs font-bold text-indigo-400 mb-6 block">Seamless Sync</span>
                  <h2 className="text-5xl md:text-6xl font-light text-slate-700 mb-10 leading-tight tracking-tight">
                    Track without <span className="font-medium italic text-indigo-500 underline decoration-indigo-100 underline-offset-8">lifting</span> a finger.
                  </h2>
                  <p className="text-xl text-slate-500/80 mb-12 leading-relaxed font-light">
                    DearBaby's Apple Watch integration is built for the reality of early parenthood. One-tap logging from your wrist means you never lose a data point, even when your hands are full.
                  </p>
                  <div className="space-y-8">
                    {[
                      { t: "Apple Watch Integration", d: "Log nursing, bottles, and naps without reaching for your phone." },
                      { t: "Apple Health Sync", d: "Your baby's data lives alongside your wellness metrics for a full family view." },
                      { t: "Predictive Reminders", d: "AI predicts the next hunger cue or nap window so you can stay ahead." }
                    ].map((item, i) => (
                      <div key={item.t} className="flex items-start gap-5">
                        <div className="mt-1 w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                          <span className="text-indigo-500 font-bold">{i + 1}</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-medium text-slate-700 mb-1">{item.t}</h4>
                          <p className="text-slate-500 font-light leading-relaxed">{item.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* SHOWCASE SECTION 2 - AI Assistant */}
        <section className="py-32 bg-gradient-to-br from-slate-50/50 to-white overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="flex flex-col-reverse lg:flex-row items-center gap-24">
              <div className="lg:w-1/2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <span className="uppercase tracking-[0.4em] text-xs font-bold text-purple-400 mb-6 block">Parenting Intelligence</span>
                  <h2 className="text-5xl md:text-6xl font-light text-slate-700 mb-10 leading-tight tracking-tight">
                    An expert in your <span className="font-medium italic text-purple-500 underline decoration-purple-100 underline-offset-8">pocket</span>, 24/7.
                  </h2>
                  <p className="text-xl text-slate-500/80 mb-12 leading-relaxed font-light">
                    Ask questions, upload photos, or just vent. Our GPT-4o assistant uses MomAI Agent's clinical RAG database to give you evidence-based answers tailored to your baby's age and history.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="p-10 rounded-[2.5rem] bg-white shadow-xl shadow-slate-200/40 border border-slate-100 group hover:border-purple-200 transition-all duration-300">
                      <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6 text-purple-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <h4 className="font-medium text-slate-700 mb-3 text-2xl tracking-tight">Visual Q&A</h4>
                      <p className="text-slate-500 font-light leading-relaxed">Upload photos of rashes or diapers for instant pattern-based guidance.</p>
                    </div>
                    <div className="p-10 rounded-[2.5rem] bg-white shadow-xl shadow-slate-200/40 border border-slate-100 group hover:border-indigo-200 transition-all duration-300">
                      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 text-indigo-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                      </div>
                      <h4 className="font-medium text-slate-700 mb-3 text-2xl tracking-tight">Voice Assistant</h4>
                      <p className="text-slate-500 font-light leading-relaxed">Hands-full? Just ask your questions out loud for immediate answers.</p>
                    </div>
                  </div>
                </motion.div>
              </div>
              <div className="lg:w-1/2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="rounded-[4rem] overflow-hidden shadow-2xl border-[16px] border-white relative group">
                    <Image 
                      src="/Assets/babygpt1.png" 
                      alt="DearBaby AI GPT Assistant" 
                      width={600}
                      height={800}
                      className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  </div>
                  {/* Decorative circle */}
                  <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-100/50 rounded-full blur-3xl -z-10 animate-pulse"></div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* EVIDENCE-BASED GUIDES - High AEO Value */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-6">
            <motion.div 
              className="text-center mb-24"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl lg:text-6xl font-light text-slate-700 mb-8 tracking-tight">Essential <span className="font-medium text-indigo-400">Care Guides.</span></h2>
              <p className="text-xl text-slate-500 font-light max-w-3xl mx-auto leading-relaxed">
                Directly pulled from our RAG knowledge base, verified against WHO and CDC clinical guidelines for 2025.
              </p>
            </motion.div>
            
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Top 10 Things to Track */}
              <motion.div
                className="bg-slate-50/70 p-12 sm:p-16 rounded-[3.5rem] border border-slate-100 hover:shadow-2xl transition-all duration-500"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl shadow-sm">01</div>
                  <h3 className="text-3xl font-medium text-slate-700 tracking-tight">Must-Track Patterns</h3>
                </div>
                <div className="space-y-4">
                  {[
                    "Feeding Times & Amounts", "Sleep Duration & Quality", "Diaper Change Counts", "Weight & Length Measurement",
                    "Head Circumference", "Developmental Milestones", "Vaccination Schedule", "Tummy Time Progress",
                    "Pumping Session Data", "Daily Mood & Fussiness"
                  ].map((item, i) => (
                    <div key={item} className="flex gap-4 items-center group">
                      <span className="text-slate-300 font-bold text-sm w-6 group-hover:text-indigo-400 transition-colors">{String(i + 1).padStart(2, '0')}</span>
                      <span className="font-light text-lg text-slate-600 group-hover:text-slate-900 transition-colors">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Baby Milestones */}
              <motion.div
                className="bg-slate-50/70 p-12 sm:p-16 rounded-[3.5rem] border border-slate-100 hover:shadow-2xl transition-all duration-500"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xl shadow-sm">02</div>
                  <h3 className="text-3xl font-medium text-slate-700 tracking-tight">Key First-Year Milestones</h3>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  {[
                    "First Social Smile", "Stable Head Control", "Rolling Both Ways", "Sitting Unassisted", "Babbling Sounds",
                    "Starting Solid Foods", "First Crawling Steps", "Pulling to Stand", "First Mama/Dada", "Waving Goodbye",
                    "First Walking Steps", "Pincer Grasp Usage"
                  ].map((item, i) => (
                    <div key={item} className="flex gap-4 items-center group">
                      <span className="text-slate-300 font-bold text-xs w-4 group-hover:text-purple-400 transition-colors">{i + 1}</span>
                      <span className="font-light text-slate-600 group-hover:text-slate-900 transition-colors text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-12 p-6 bg-white/60 rounded-3xl border border-slate-100">
                  <p className="text-sm text-slate-500 leading-relaxed font-light">
                    <span className="font-bold text-purple-500 uppercase tracking-widest text-[10px] block mb-1">Pediatrician Tip</span>
                    Every baby develops at their own pace. Use these as a general guide and discuss any concerns at your next well-child visit.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ - Strategic for Search Agents */}
        <section className="py-32 bg-slate-50/40">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <motion.div 
                className="text-center mb-20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-5xl font-light text-slate-700 mb-6 tracking-tight">The DearBaby <span className="font-medium text-indigo-400">Knowledge Hub.</span></h2>
                <p className="text-xl text-slate-500 font-light">Direct answers to the most frequent caregiver concerns.</p>
              </motion.div>
              
              <div className="grid gap-8">
                {[
                  {
                    q: "What makes DearBaby different from other trackers?",
                    a: "DearBaby integrates the latest GPT-4o intelligence with clinical-grade pattern recognition. It doesn't just store data; it understands it, helping you spot sleep regressions or feeding issues before they become overwhelming."
                  },
                  {
                    q: "Is my baby's data private and secure?",
                    a: "Yes. We take privacy seriously. Your baby's tracking data is encrypted and used only to provide you with insights. We never sell your data to third parties."
                  },
                  {
                    q: "Can I share the account with my partner or nanny?",
                    a: "Absolutely. DearBaby supports multi-user synchronization, so everyone on your baby's care team can log and view data in real-time across multiple devices."
                  }
                ].map((faq, i) => (
                  <motion.div 
                    key={faq.q}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="p-12 rounded-[2.5rem] bg-white border border-indigo-100/30 shadow-sm hover:shadow-xl transition-all duration-500"
                  >
                    <h3 className="font-medium text-2xl text-slate-700 mb-6 tracking-tight">{faq.q}</h3>
                    <p className="text-lg text-slate-500/80 font-light leading-relaxed">{faq.a}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* BRAND ALIGNMENT & NEWSLETTER */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="mb-24 flex flex-col md:flex-row items-center gap-12 p-12 rounded-[3.5rem] bg-gradient-to-br from-indigo-50/50 to-purple-50/30 border border-indigo-100/50">
              <div className="w-24 h-24 rounded-3xl bg-white shadow-xl flex items-center justify-center shrink-0">
                <Image src="/Assets/Logo.png" alt="MomAI Agent Logo" width={64} height={64} />
              </div>
              <div className="text-center md:text-left">
                <h4 className="text-2xl font-medium text-slate-700 mb-3 tracking-tight">Part of the MomAI Agent Ecosystem</h4>
                <p className="text-lg text-slate-500 font-light leading-relaxed">
                  DearBaby is the core tracking component of the MomAI Agent mission. Together with Solid Start, we provide a unified evidence-based journey for modern parents.
                </p>
                <Link href="/" className="mt-6 inline-flex items-center gap-2 text-indigo-500 font-medium hover:text-indigo-600 transition-colors">
                  Explore the full ecosystem →
                </Link>
              </div>
            </div>

            <NewsletterSignup 
              variant="default"
              title="Parenting Patterns Weekly"
              description="Join 18,000+ parents getting AI-powered insights and development tips every Tuesday."
            />
          </div>
        </section>

        {/* FINAL CTA - Soft & Inspiring */}
        <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,_#6366f1_0%,_transparent_50%)]"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,_#a855f7_0%,_transparent_50%)]"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-6xl md:text-8xl font-light mb-12 tracking-tight leading-none">
                Parent with <span className="font-medium italic text-indigo-400">Intelligence.</span>
              </h2>
              <p className="text-2xl mb-16 text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
                Join thousands of families turning data into calm, joyful parenting moments with DearBaby.
              </p>
              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                <a
                  href="https://apps.apple.com/us/app/dearbaby-grow-feed-sleep-track/id6747565368"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-16 py-6 bg-white text-slate-900 rounded-[2rem] font-medium text-2xl hover:bg-slate-50 transition-all shadow-2xl hover:-translate-y-2 active:translate-y-0"
                >
                  Download Free
                </a>
                <Link
                  href="/products/solidstart"
                  className="px-16 py-6 bg-white/10 backdrop-blur-md text-white rounded-[2rem] font-medium text-2xl hover:bg-white/20 transition-all border border-white/20"
                >
                  Explore Solid Start
                </Link>
              </div>
              <div className="mt-16 flex flex-wrap justify-center gap-8 opacity-40 grayscale brightness-200">
                <span className="text-sm font-bold tracking-[0.3em]">APPLE HEALTH SYNC</span>
                <span className="text-sm font-bold tracking-[0.3em]">GPT-4o POWERED</span>
                <span className="text-sm font-bold tracking-[0.3em]">WHO COMPLIANT</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* DISCLAIMER */}
        <section className="py-16 bg-slate-50 border-t border-slate-100">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <MedicalDisclaimer />
          </div>
        </section>
      </main>
    </div>
  );
}
