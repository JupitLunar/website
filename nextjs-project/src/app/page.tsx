'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { generateWebsiteStructuredData, generateOrganizationStructuredData } from '@/lib/json-ld';

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [aiQuery, setAiQuery] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [aiSources, setAiSources] = useState<any[]>([]);
  const [showResponse, setShowResponse] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleAiQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim() || isAiTyping) return;

    setIsAiTyping(true);
    setShowResponse(false);
    
    try {
      const response = await fetch('/api/rag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: aiQuery,
          sessionId: `session_${Date.now()}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      setAiResponse(data.answer);
      setAiSources(data.sources || []);
      setShowResponse(true);
    } catch (error) {
      console.error('AI query error:', error);
      setAiResponse("I'm sorry, I'm having trouble accessing my knowledge base right now. Please try again later or consult your pediatrician for immediate concerns.");
      setAiSources([]);
      setShowResponse(true);
    } finally {
      setIsAiTyping(false);
      setAiQuery('');
    }
  };

  // 生成结构化数据
  const websiteData = generateWebsiteStructuredData();
  const organizationData = generateOrganizationStructuredData();

  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script
        id="website-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteData)
        }}
      />
      <Script
        id="organization-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData)
        }}
      />

      <div className="min-h-screen bg-gradient-elegant">
        {/* Hero Section - 淡雅柔和风格 */}
        <section className="relative py-16 px-4 sm:px-8 overflow-hidden bg-gradient-to-br from-slate-50/20 via-white to-violet-50/10">
          {/* 月相树背景图 */}
          <div className="absolute inset-0 opacity-[0.45] pointer-events-none">
            <Image
              src="/heroimage.png"
              alt="Moon Tree Background"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* 非常淡雅的背景装饰 */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-100/10 to-purple-100/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-indigo-100/10 to-violet-100/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-100/8 to-violet-100/3 rounded-full blur-3xl"></div>

          <div className="container mx-auto max-w-6xl relative z-10">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* 非常淡雅的产品标识 */}
              <motion.div
                className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-gradient-to-r from-slate-50/90 to-violet-50/60 backdrop-blur-sm rounded-full shadow-sm border border-slate-200/30"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-slate-300 to-violet-300 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-light text-slate-500">AI-Powered Maternal & Infant Knowledge Base</span>
              </motion.div>

              {/* 淡雅的主标题 */}
              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-light text-slate-500 mb-4 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Trusted Care for
                <br />
                <span className="bg-gradient-to-r from-slate-400 via-violet-400 to-slate-500 bg-clip-text text-transparent">
                  Mom & Baby
                </span>
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl text-slate-500 mb-6 max-w-4xl mx-auto leading-relaxed font-light"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Evidence-based guidance for your health journey together.
              </motion.p>

              {/* 权威机构名称 - 淡雅小字 */}
              <motion.div
                className="mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.45 }}
              >
                <p className="text-xs text-slate-400 mb-3 font-light">Trusted by leading health organizations</p>
                <div className="flex flex-wrap justify-center items-center gap-6 opacity-50">
                  <span className="text-xs text-slate-400 font-light">CDC</span>
                  <span className="text-xs text-slate-400 font-light">American Academy of Pediatrics</span>
                  <span className="text-xs text-slate-400 font-light">WHO</span>
                  <span className="text-xs text-slate-400 font-light">Health Canada</span>
                  <span className="text-xs text-slate-400 font-light">Canadian Paediatric Society</span>
                </div>
              </motion.div>

              {/* 淡雅的功能说明 */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="premium-card group hover:scale-105 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-violet-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-slate-300 group-hover:to-violet-300 transition-colors shadow-sm">
                    <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-light text-slate-500 mb-3 text-xl">Expert Guidance</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">Comprehensive knowledge base covering maternal health, infant development, and pediatric care</p>
                </div>

                <div className="premium-card group hover:scale-105 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-indigo-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-slate-300 group-hover:to-indigo-300 transition-colors shadow-sm">
                    <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-light text-slate-500 mb-3 text-xl">Evidence-Based</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">Trusted information from leading health organizations and peer-reviewed research</p>
                </div>

                <div className="premium-card group hover:scale-105 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-slate-300 group-hover:to-purple-300 transition-colors shadow-sm">
                    <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                  </div>
                  <h3 className="font-light text-slate-500 mb-3 text-xl">Comprehensive Care</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">From pregnancy to early childhood, covering all aspects of maternal and infant health</p>
                </div>
              </motion.div>

              {/* 淡雅的CTA按钮 */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Link href="/topics" className="btn-primary text-lg px-8 py-4">
                  Explore Knowledge Base
                </Link>
                <button
                  onClick={() => {
                    const aiSection = document.getElementById('ai-assistant-section');
                    aiSection?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className="btn-secondary text-lg px-8 py-4"
                >
                  Ask AI Assistant
                </button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* AI Assistant Section - 优雅的对话界面 */}
        <section id="ai-assistant-section" className="py-20 px-4 sm:px-8 bg-gradient-to-br from-blue-50/30 to-indigo-50/20">
          <div className="container mx-auto max-w-4xl">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-medium text-slate-700 mb-4">
                Ask MomAI Agent
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto font-light">
                Gentle guidance for your maternal and infant care questions
              </p>
            </motion.div>

            {/* 优雅的对话界面 */}
            <motion.div
              className="bg-gradient-to-br from-white to-blue-50/30 rounded-3xl shadow-lg border border-blue-200/50 p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {/* 优雅的输入框 */}
              <form onSubmit={handleAiQuery} className="relative">
                <div className="relative">
                  <textarea
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    placeholder="Ask me anything about maternal health, infant development, or pediatric care..."
                    className="w-full px-6 py-5 pr-16 text-base rounded-2xl border border-blue-200 focus:border-blue-400 focus:outline-none transition-colors resize-none bg-blue-50/20 placeholder-slate-400"
                    rows={3}
                    disabled={isAiTyping}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAiQuery(e);
                      }
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isAiTyping || !aiQuery.trim()}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-red-500 to-pink-500 text-white p-3 rounded-xl hover:from-red-600 hover:to-pink-600 transition-colors disabled:opacity-50"
                  >
                    {isAiTyping ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </button>
                </div>
              </form>

              {/* AI响应显示 - 优雅样式 */}
              {showResponse && (
                <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-700 leading-relaxed mb-4 font-light">{aiResponse}</p>

                      {/* 来源信息 - 优雅样式 */}
                      {aiSources.length > 0 && (
                        <div className="border-t border-blue-200 pt-4">
                          <p className="text-xs text-slate-500 mb-3 font-medium">Sources:</p>
                          <div className="space-y-2">
                            {aiSources.slice(0, 3).map((source, index) => (
                              <div key={index} className="text-xs text-slate-600 bg-white/60 px-3 py-2 rounded-lg border border-blue-100">
                                • {source.title} ({source.category})
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 示例问题 - 优雅的按钮 */}
              {!showResponse && (
                <div className="mt-8">
                  <p className="text-sm text-slate-500 mb-4 font-light">Try asking:</p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setAiQuery("What are the key milestones in infant development?")}
                      className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-xl text-sm text-blue-700 transition-colors font-light"
                    >
                      Infant development milestones
                    </button>
                    <button
                      onClick={() => setAiQuery("What are common challenges in breastfeeding?")}
                      className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-xl text-sm text-blue-700 transition-colors font-light"
                    >
                      Breastfeeding challenges
                    </button>
                    <button
                      onClick={() => setAiQuery("How to prepare for childbirth?")}
                      className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-xl text-sm text-blue-700 transition-colors font-light"
                    >
                      Childbirth preparation
                    </button>
                    <button
                      onClick={() => setAiQuery("What are the signs of postpartum depression?")}
                      className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-xl text-sm text-blue-700 transition-colors font-light"
                    >
                      Postpartum depression signs
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Core Features */}
        <section className="py-20 px-4 sm:px-8 bg-white">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-light text-slate-500 mb-6">
                Everything You Need
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto font-light">
                Comprehensive resources for safe, healthy feeding from birth to toddlerhood
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Food Database */}
              <motion.div
                className="group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Link href="/foods" className="block">
                  <div className="bg-gradient-to-br from-slate-50 to-violet-50/30 rounded-3xl p-8 h-full border border-slate-100 hover:border-violet-200 transition-all duration-300 hover:shadow-md group-hover:scale-105">
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-violet-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                      <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-light text-slate-500 mb-4">Food Database</h3>
                    <p className="text-slate-400 mb-6 leading-relaxed font-light">
                      Age-appropriate foods with safety ratings, preparation guides, and nutritional insights
                    </p>
                    <div className="text-slate-500 font-light flex items-center gap-2">
                      Explore Foods
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Safety Guidelines */}
              <motion.div 
                className="group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Link href="/topics/safety-and-hygiene" className="block">
                  <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-3xl p-8 h-full border border-slate-100 hover:border-indigo-200 transition-all duration-300 hover:shadow-md group-hover:scale-105">
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-indigo-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                      <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-light text-slate-500 mb-4">Safety Guidelines</h3>
                    <p className="text-slate-400 mb-6 leading-relaxed font-light">
                      Choking prevention, food storage, and travel safety protocols
                    </p>
                    <div className="text-slate-500 font-light flex items-center gap-2">
                      Safety First
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Feeding Milestones */}
              <motion.div
                className="group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Link href="/topics/feeding-foundations" className="block">
                  <div className="bg-gradient-to-br from-slate-50 to-purple-50/30 rounded-3xl p-8 h-full border border-slate-100 hover:border-purple-200 transition-all duration-300 hover:shadow-md group-hover:scale-105">
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-purple-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                      <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00 2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-light text-slate-500 mb-4">Feeding Milestones</h3>
                    <p className="text-slate-400 mb-6 leading-relaxed font-light">
                      Developmental readiness, texture progression, and portion guidance
                    </p>
                    <div className="text-slate-500 font-light flex items-center gap-2">
                      Learn Milestones
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Allergen Introduction */}
              <motion.div
                className="group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Link href="/topics/allergen-readiness" className="block">
                  <div className="bg-gradient-to-br from-slate-50 to-violet-50/30 rounded-3xl p-8 h-full border border-slate-100 hover:border-violet-200 transition-all duration-300 hover:shadow-md group-hover:scale-105">
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-violet-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                      <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-light text-slate-500 mb-4">Allergen Introduction</h3>
                    <p className="text-slate-400 mb-6 leading-relaxed font-light">
                      Evidence-based protocols for safe allergen introduction
                    </p>
                    <div className="text-slate-500 font-light flex items-center gap-2">
                      Safe Introduction
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Apps Section */}
        <section className="py-20 px-4 sm:px-8 bg-gradient-to-br from-emerald-50/30 to-teal-50/20">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-light text-slate-500 mb-6">
                Our Mobile Apps
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto font-light">
                Personalized guidance and tracking tools for your parenting journey
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* DearBaby App */}
              <motion.div
                className="bg-white rounded-3xl p-10 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-6 mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-violet-200 rounded-3xl flex items-center justify-center shadow-sm">
                    <svg className="w-10 h-10 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-3xl font-light text-slate-500 mb-2">DearBaby</h3>
                    <p className="text-slate-400 text-lg font-light">AI-Powered Newborn Tracker</p>
                  </div>
                </div>
                
                <p className="text-slate-400 mb-8 text-lg leading-relaxed font-light">
                  Track feeding, sleep, and milestones with AI-powered insights. Get personalized recommendations for your baby's development and growth.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                    <span className="text-slate-500 font-light">Smart feeding & sleep tracking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                    <span className="text-slate-500 font-light">AI milestone predictions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                    <span className="text-slate-500 font-light">Apple Watch integration</span>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <a
                    href="https://apps.apple.com/us/app/dearbaby-grow-feed-sleep-track/id6747565368"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gradient-to-r from-slate-400 to-violet-400 text-white px-8 py-4 rounded-2xl font-light text-center hover:shadow-md transition-all"
                  >
                    Download Free
                  </a>
                  <a
                    href="https://apps.apple.com/us/app/dearbaby-grow-feed-sleep-track/id6747565368"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-slate-100 text-slate-500 px-8 py-4 rounded-2xl font-light text-center hover:bg-slate-200 transition-all"
                  >
                    View on App Store
                  </a>
                </div>
              </motion.div>

              {/* SolidStart App */}
              <motion.div 
                className="bg-white rounded-3xl p-10 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-6 mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-purple-200 rounded-3xl flex items-center justify-center shadow-sm">
                    <svg className="w-10 h-10 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-3xl font-light text-slate-500 mb-2">SolidStart</h3>
                    <p className="text-slate-400 text-lg font-light">AI Baby Food Companion</p>
                  </div>
                </div>
                
                <p className="text-slate-400 mb-8 text-lg leading-relaxed font-light">
                  Safe, stage-appropriate baby recipes powered by AI. Get ingredient scanning and allergy-safe meal planning for your little one.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                    <span className="text-slate-500 font-light">Ingredient safety scanner</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                    <span className="text-slate-500 font-light">Age-appropriate meal plans</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                    <span className="text-slate-500 font-light">Smart shopping lists</span>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => alert('SolidStart is coming soon! Join our newsletter to be notified when it launches.')}
                    className="flex-1 bg-gradient-to-r from-slate-400 to-purple-400 text-white px-8 py-4 rounded-2xl font-light text-center hover:shadow-md transition-all"
                  >
                    Coming Soon
                  </button>
                  <button
                    onClick={() => {
                      const newsletterBtn = document.querySelector('[data-newsletter-trigger]') as HTMLElement;
                      newsletterBtn?.click();
                    }}
                    className="flex-1 bg-slate-100 text-slate-500 px-8 py-4 rounded-2xl font-light text-center hover:bg-slate-200 transition-all"
                  >
                    Join Waitlist
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mom Stories - B2C母婴风格 */}
        <section className="py-20 px-4 sm:px-8 bg-gradient-to-br from-purple-50/30 to-pink-50/20">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-light text-slate-500 mb-6">
                Real stories from real moms
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto font-light">
                Join thousands of moms who've found confidence in their feeding journey
              </p>
            </motion.div>

            {/* 妈妈故事网格 */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <motion.div
                className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-violet-200 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-slate-600 font-light text-lg">SM</span>
                  </div>
                  <div>
                    <h4 className="font-light text-slate-500">Sarah M.</h4>
                    <p className="text-sm text-slate-400 font-light">Mom of 8-month-old Emma</p>
                  </div>
                </div>
                <p className="text-slate-400 leading-relaxed font-light">
                  "I was so overwhelmed with all the conflicting advice online. This AI assistant gave me clear, personalized guidance that actually made sense. Emma loves her new foods! 🥕"
                </p>
              </motion.div>

              <motion.div
                className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-indigo-200 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-slate-600 font-light text-lg">JD</span>
                  </div>
                  <div>
                    <h4 className="font-light text-slate-500">Jennifer D.</h4>
                    <p className="text-sm text-slate-400 font-light">First-time mom</p>
                  </div>
                </div>
                <p className="text-slate-400 leading-relaxed font-light">
                  "As a new mom, I had no idea where to start with solids. The feeding schedules and safety tips gave me so much confidence. Thank you for making this journey easier! 💕"
                </p>
              </motion.div>

              <motion.div 
                className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-purple-200 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-slate-600 font-light text-lg">MC</span>
                  </div>
                  <div>
                    <h4 className="font-light text-slate-500">Maria C.</h4>
                    <p className="text-sm text-slate-400 font-light">Mom of twins</p>
                  </div>
                </div>
                <p className="text-slate-400 leading-relaxed font-light">
                  "Managing feeding for twins was chaos until I found this platform. The personalized advice for each baby's different needs was a game-changer! 👶👶"
                </p>
              </motion.div>
            </div>

            {/* 特色妈妈故事 */}
            <motion.div
              className="bg-white rounded-3xl p-12 shadow-sm border border-slate-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-r from-slate-200 to-violet-200 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-slate-600 font-light text-xl">AL</span>
                </div>
                <div className="flex-1">
                  <div className="mb-4">
                    <h4 className="text-xl font-light text-slate-500 mb-1">Anna L.</h4>
                    <p className="text-slate-400 font-light">Mom of 10-month-old Lucas</p>
                  </div>
                  <blockquote className="text-lg text-slate-400 leading-relaxed mb-6 font-light">
                    "I was terrified about food allergies and choking. This platform not only taught me the safety protocols but also gave me the confidence to trust my instincts. Lucas is now a happy, adventurous eater, and I feel like I actually know what I'm doing! The AI assistant answered every single question I had, even the ones I was too embarrassed to ask anyone else."
                  </blockquote>
                  <div className="flex items-center gap-2">
                    <div className="flex text-slate-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-slate-400 font-light">5.0 stars</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trust Signals */}
        <section className="py-20 px-4 sm:px-8 bg-gradient-to-br from-gray-50/50 to-slate-50/30">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-light text-slate-500 mb-6">
                Built to power your entire parenting journey
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto font-light">
                Every piece of information is sourced from official health organizations and updated regularly
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-12">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-violet-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <svg className="w-10 h-10 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-light text-slate-500 mb-4">Official Guidelines</h3>
                <p className="text-slate-400 text-lg leading-relaxed font-light">
                  Based on CDC, AAP, and Health Canada recommendations
                </p>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-indigo-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <svg className="w-10 h-10 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-light text-slate-500 mb-4">Regularly Updated</h3>
                <p className="text-slate-400 text-lg leading-relaxed font-light">
                  Content reviewed every 90 days to reflect latest research
                </p>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-purple-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <svg className="w-10 h-10 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-light text-slate-500 mb-4">Transparent Sources</h3>
                <p className="text-slate-400 text-lg leading-relaxed font-light">
                  Every claim linked to peer-reviewed or government sources
                </p>
              </motion.div>
            </div>

            <motion.div
              className="mt-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link
                href="/trust"
                className="inline-flex items-center gap-3 text-slate-500 hover:text-slate-600 font-light text-xl"
              >
                Learn about our content curation process
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 sm:px-8 bg-gradient-to-r from-slate-400 via-violet-400 to-slate-500 text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-light mb-8">
                Start Your Journey with Confidence
              </h2>
              <p className="text-xl mb-12 text-slate-100 max-w-2xl mx-auto font-light">
                Explore our comprehensive guides, safety protocols, and food database to make informed decisions for your baby
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  href="/foods"
                  className="px-10 py-5 bg-white text-slate-500 rounded-2xl font-light text-xl hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Browse Food Database
                </Link>
                <Link
                  href="/topics"
                  className="px-10 py-5 bg-slate-500/50 backdrop-blur-sm text-white rounded-2xl font-light text-xl hover:bg-slate-500/70 transition-colors border-2 border-white/30"
                >
                  View All Topics
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}

export default HomePage;
