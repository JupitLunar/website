'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { generateWebsiteStructuredData, generateOrganizationStructuredData, generateHomePageStructuredData } from '@/lib/json-ld';

interface StructuredResponse {
  summary: string;
  keyPoints: string[];
  details: {
    sections: Array<{
      title: string;
      content: string;
    }>;
  };
  actionableAdvice: string[];
  disclaimer: string;
}

interface SimplifiedArticle {
  title: string;
  url: string;
  summary?: string;
  topic?: string;
  region?: string;
  keyFacts?: string[];
  source?: {
    name: string;
    url?: string | null;
  };
}

const TOP_FAQ_ITEMS = [
  {
    question: 'Is my 6-month-old ready for solids?',
    answer: 'Look for steady head control, the ability to sit with support, interest in food, and the tongue-thrust reflex fading. If you are unsure, confirm with your pediatrician before offering solids.',
    source: {
      name: 'CDC: When, What, and How to Introduce Solid Foods',
      url: 'https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/when-to-introduce-solid-foods.html'
    },
    articleSlug: 'pain-new-mom-feeding-first-foods',
    hub: 'Feeding'
  },
  {
    question: 'When is a baby fever dangerous?',
    answer: 'For babies under 3 months, a rectal temperature of 100.4°F (38°C) or higher needs urgent medical evaluation. For older babies, watch hydration, breathing, responsiveness, and other red flags in addition to temperature.',
    source: {
      name: 'AAP HealthyChildren.org: Fever and Your Baby',
      url: 'https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/Fever-and-Your-Baby.aspx'
    },
    articleSlug: 'pain-midnight-emergency-fever-steps',
    hub: 'Safety'
  },
  {
    question: 'How do I safely introduce allergens like peanut?',
    answer: 'Choose a low-stress day, offer a pea-sized amount of a safe texture (e.g., thinned peanut butter), and observe for 2–3 hours. If tolerated, keep offering 2–3 times per week to maintain tolerance unless your clinician advises otherwise.',
    source: {
      name: 'NIAID Addendum Guidelines for Peanut Allergy Prevention',
      url: 'https://www.niaid.nih.gov/diseases-conditions/guidelines-clinicians-and-patients-food-allergy'
    },
    articleSlug: 'pain-allergy-introduction-safety',
    hub: 'Feeding'
  }
];

const HERO_STATS = [
  { label: 'Guidelines referenced', value: '75+', caption: 'CDC, AAP, WHO, CPS, and Health Canada sources' },
  { label: 'Questions answered', value: '18k', caption: 'Across feeding, sleep, safety, and maternal care' },
  { label: 'Avg. response time', value: '2.8s', caption: 'Structured answers with citations & cut sizes' },
];

const TRUST_TESTIMONIALS = [
  {
    name: 'Olivia M.',
    role: 'First-time mom • Seattle, WA',
    quote: '“The feeding roadmap broke every week into bite-sized steps and linked straight to the research. It feels like texting a pediatric dietitian.”'
  },
  {
    name: 'Dr. Hannah Li',
    role: 'Pediatric NP • Toronto, ON',
    quote: '“I recommend Mom AI Agent because answers cite CDC/AAP sections verbatim. Families show me the summaries and we’re instantly aligned.”'
  },
  {
    name: 'Marcus & Dee',
    role: 'Parents of twins • Austin, TX',
    quote: '“We love the allergen timelines plus the BLW lunchbox builder. Seeing the safety cues and real portion photos keeps meals calm.”'
  }
];

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [aiQuery, setAiQuery] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [aiResponse, setAiResponse] = useState<StructuredResponse | null>(null);
  const [aiSources, setAiSources] = useState<any[]>([]);
  const [showResponse, setShowResponse] = useState(false);
  const [latestArticles, setLatestArticles] = useState<SimplifiedArticle[]>([]);
  const [articlesError, setArticlesError] = useState<string | null>(null);
  const [guideName, setGuideName] = useState('');
  const [guideEmail, setGuideEmail] = useState('');
  const [guideStatus, setGuideStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [guideFeedback, setGuideFeedback] = useState<string | null>(null);

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
      setAiResponse({
        summary: "I'm sorry, I'm having trouble accessing my knowledge base right now. Please try again later or consult your pediatrician for immediate concerns.",
        keyPoints: [],
        details: { sections: [] },
        actionableAdvice: [],
        disclaimer: "This information is for educational purposes only and should not replace professional medical advice."
      });
      setAiSources([]);
      setShowResponse(true);
    } finally {
      setIsAiTyping(false);
      setAiQuery('');
    }
  };

  useEffect(() => {
    let active = true;

    async function fetchLatestArticles() {
      try {
        const response = await fetch('/api/latest-articles?limit=6&format=simplified');
        if (!response.ok) {
          throw new Error('Failed to fetch latest articles');
        }
        const data = await response.json();
        if (active) {
          setLatestArticles(data.articles || []);
        }
      } catch (error) {
        if (active) {
          setArticlesError("We couldn't load the latest evidence right now.");
        }
      }
    }

    fetchLatestArticles();
    return () => {
      active = false;
    };
  }, []);

  const handleGuideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guideEmail.trim() || guideStatus === 'loading') return;

    setGuideStatus('loading');
    setGuideFeedback(null);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: guideEmail.trim(),
          name: guideName.trim() || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Unable to send the guide right now.');
      }

      setGuideStatus('success');
      setGuideFeedback('Guide sent! Check your inbox for the personalized roadmap within a few minutes.');
      setGuideEmail('');
      setGuideName('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to process your request.';
      setGuideStatus('error');
      setGuideFeedback(message);
    }
  };

  // 生成结构化数据
  const websiteData = generateWebsiteStructuredData();
  const organizationData = generateOrganizationStructuredData();
  const homepageData = useMemo(() => {
    return generateHomePageStructuredData({
      featuredArticles: latestArticles.map((article) => ({
        title: article.title,
        url: article.url,
        summary: article.summary,
        topic: article.topic,
      })),
      testimonials: TRUST_TESTIMONIALS,
    });
  }, [latestArticles]);

  const latestArticlesStructuredData = useMemo(() => {
    if (!latestArticles.length) {
      return null;
    }

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Latest evidence-based parenting guides",
      "itemListElement": latestArticles.map((article, index) => {
        const item: Record<string, any> = {
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Article",
            "name": article.title,
            "url": article.url,
            "description": article.summary
          }
        };

        if (article.topic) {
          item.item.about = {
            "@type": "Thing",
            "name": article.topic
          };
        }

        if (article.source?.name) {
          const citation: Record<string, any> = {
            "@type": "CreativeWork",
            "name": article.source.name
          };
          if (article.source.url) {
            citation.url = article.source.url;
            item.item.sameAs = [article.source.url];
          }
          item.item.citation = citation;
        }

        return item;
      })
    };
  }, [latestArticles]);

  const homepageFAQStructuredData = useMemo(() => {
    if (!TOP_FAQ_ITEMS.length) {
      return null;
    }

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "name": "Top caregiver FAQs answered by DearBaby Mom AI Agent",
      "mainEntity": TOP_FAQ_ITEMS.map((item, index) => ({
        "@type": "Question",
        "@id": `https://www.momaiagent.com/#homepage-faq-${index + 1}`,
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer,
          "url": `https://www.momaiagent.com/articles/${item.articleSlug}`
        }
      }))
    };
  }, []);

  const insightArticles = latestArticles.length > 3 ? latestArticles.slice(3) : [];

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
      <Script
        id="homepage-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homepageData)
        }}
      />
      {latestArticlesStructuredData && (
        <Script
          id="homepage-latest-articles-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(latestArticlesStructuredData)
          }}
        />
      )}
      {homepageFAQStructuredData && (
        <Script
          id="homepage-faq-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(homepageFAQStructuredData)
          }}
        />
      )}

      <div className="min-h-screen bg-gradient-elegant">
        {/* Hero Section - 淡雅柔和风格 */}
        <section className="relative py-8 px-4 sm:px-8 overflow-hidden bg-gradient-to-br from-slate-50/20 via-white to-violet-50/10">
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
                className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-gradient-to-r from-slate-50/90 to-violet-50/60 backdrop-blur-sm rounded-full shadow-sm border border-slate-200/30"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-slate-300 to-violet-300 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-light text-slate-500">Mom AI Agent- Powered Maternal & Infant Knowledge Base</span>
          </motion.div>

              {/* 淡雅的主标题 */}
              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-light text-slate-500 mb-3 leading-tight"
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
                className="hero-subtext text-xl md:text-2xl text-slate-500 mb-4 max-w-4xl mx-auto leading-relaxed font-light"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Evidence-based guidance for your health journey together.
              </motion.p>

              {/* 权威机构名称 - 淡雅小字 */}
          <motion.div
                className="mb-6"
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
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-5xl mx-auto"
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
                className="flex flex-col lg:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <button
                  onClick={() => {
                    const guideSection = document.getElementById('guide-download');
                    guideSection?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className="btn-primary text-lg px-8 py-4"
                >
                  Download Feeding Roadmap
                </button>
                <Link href="/foods" className="btn-secondary text-lg px-8 py-4 text-center">
                  Browse Food Database
                </Link>
                <button
                  onClick={() => {
                    const aiSection = document.getElementById('ai-assistant-section');
                    aiSection?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className="text-slate-500 hover:text-slate-700 text-lg px-8 py-4 transition-colors"
                >
                  Ask AI Assistant →
                </button>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                {HERO_STATS.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/40 bg-white/60 backdrop-blur px-6 py-5 shadow-sm">
                    <p className="text-4xl font-light text-slate-500">{stat.value}</p>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400 mt-1">{stat.label}</p>
                    <p className="text-xs text-slate-400 mt-3 leading-relaxed">{stat.caption}</p>
                  </div>
                ))}
              </motion.div>
          </motion.div>
        </div>
      </section>

        {/* AI Assistant Section - 优雅的对话界面 */}
        <section id="ai-assistant-section" className="py-16 px-4 sm:px-8 bg-gradient-to-br from-blue-50/30 to-indigo-50/20">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              className="text-center mb-8"
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

              {/* AI响应显示 - 结构化样式 */}
              {showResponse && aiResponse && (
                <div className="mt-8 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border border-blue-200 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
          </div>
                    <div className="flex-1 space-y-6">
                      {/* Summary */}
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Quick Answer</h3>
                        <p className="text-slate-700 leading-relaxed">{aiResponse.summary}</p>
        </div>

                      {/* Key Points */}
                      {aiResponse.keyPoints && aiResponse.keyPoints.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800 mb-3">Key Points</h3>
                          <ul className="space-y-2">
                            {aiResponse.keyPoints.map((point, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                <span className="text-slate-700 leading-relaxed">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Detailed Sections */}
                      {aiResponse.details?.sections && aiResponse.details.sections.length > 0 && (
                        <div className="space-y-4">
                          {aiResponse.details.sections.map((section, idx) => (
                            <div key={idx} className="bg-white/60 rounded-2xl p-5 border border-blue-100">
                              <h4 className="text-md font-semibold text-slate-800 mb-2">{section.title}</h4>
                              <p className="text-slate-700 leading-relaxed text-sm">{section.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Actionable Advice */}
                      {aiResponse.actionableAdvice && aiResponse.actionableAdvice.length > 0 && (
                        <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-5 border border-violet-200">
                          <h3 className="text-lg font-semibold text-violet-800 mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Next Steps
                          </h3>
                          <ul className="space-y-2">
                            {aiResponse.actionableAdvice.map((advice, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <span className="text-violet-600 font-bold flex-shrink-0">{idx + 1}.</span>
                                <span className="text-slate-700 leading-relaxed">{advice}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Disclaimer */}
                      {aiResponse.disclaimer && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                          <p className="text-xs text-amber-800 leading-relaxed whitespace-pre-line">{aiResponse.disclaimer}</p>
                        </div>
                      )}

                      {/* 来源信息 */}
                      {aiSources.length > 0 && (
                        <div className="border-t border-blue-200 pt-5 mt-2">
                          <p className="text-xs text-slate-500 mb-3 font-semibold uppercase tracking-wide">Sources</p>
                          <div className="space-y-2">
                            {aiSources.slice(0, 3).map((source, index) => (
                              <div key={index} className="text-xs text-slate-600 bg-white/60 px-4 py-2.5 rounded-lg border border-blue-100 flex items-center gap-2">
                                <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <span>{source.title} <span className="text-slate-400">({source.category})</span></span>
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
                <div className="mt-6">
                  <p className="text-sm text-slate-500 mb-3 font-light">Try asking:</p>
                  <div className="flex flex-wrap gap-2">
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
                    <button
                      onClick={() => setAiQuery("When can I introduce solid foods to my baby?")}
                      className="px-4 py-2 bg-violet-100 hover:bg-violet-200 rounded-xl text-sm text-violet-700 transition-colors font-light"
                    >
                      Starting solid foods
                    </button>
                    <button
                      onClick={() => setAiQuery("How much sleep does a newborn need?")}
                      className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 rounded-xl text-sm text-indigo-700 transition-colors font-light"
                    >
                      Newborn sleep patterns
                    </button>
                    <button
                      onClick={() => setAiQuery("What vaccines does my baby need?")}
                      className="px-4 py-2 bg-purple-100 hover:bg-purple-200 rounded-xl text-sm text-purple-700 transition-colors font-light"
                    >
                      Baby vaccination schedule
                    </button>
                    <button
                      onClick={() => setAiQuery("How to deal with baby colic?")}
                      className="px-4 py-2 bg-pink-100 hover:bg-pink-200 rounded-xl text-sm text-pink-700 transition-colors font-light"
                    >
                      Managing baby colic
                    </button>
                    <button
                      onClick={() => setAiQuery("What are safe foods for a 6-month-old?")}
                      className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-xl text-sm text-blue-700 transition-colors font-light"
                    >
                      6-month-old food guide
                    </button>
                    <button
                      onClick={() => setAiQuery("How to prevent diaper rash?")}
                      className="px-4 py-2 bg-violet-100 hover:bg-violet-200 rounded-xl text-sm text-violet-700 transition-colors font-light"
                    >
                      Diaper rash prevention
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {insightArticles.length > 0 && (
          <section className="py-20 px-4 sm:px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-violet-900 text-white">
            <div className="container mx-auto max-w-6xl">
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <p className="uppercase tracking-[0.4em] text-sm text-violet-200 mb-4">Insights</p>
                <h2 className="text-4xl font-light mb-4">Research notes from the Mom AI Agent editorial lab</h2>
                <p className="text-lg text-slate-200 max-w-3xl mx-auto font-light">
                  Longer-form explainers that combine RAG transcripts, caregiver interviews, and the latest CDC/AAP/WHO releases.
                </p>
              </motion.div>

              <div className="grid gap-6 md:grid-cols-3">
                {insightArticles.map((article) => (
                  <article key={`${article.url}-insight`} className="rounded-3xl bg-white/10 border border-white/20 backdrop-blur p-6 flex flex-col">
                    <p className="text-xs uppercase tracking-[0.3em] text-violet-200 mb-3">
                      {article.topic || 'Insight'} • {article.region || 'Global'}
                    </p>
                    <h3 className="text-2xl font-light mb-4 text-white">{article.title}</h3>
                    <p className="text-slate-100/90 text-sm leading-relaxed flex-1">{article.summary || 'Structured editorial analysis translated from our caregiver dataset.'}</p>
                    <div className="mt-4 text-sm text-slate-200 space-y-1">
                      {article.source?.name && (
                        <p>
                          Source:{' '}
                          {article.source?.url ? (
                            <a
                              href={article.source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-violet-200 underline-offset-4 hover:text-white"
                            >
                              {article.source.name}
                            </a>
                          ) : (
                            <span>{article.source.name}</span>
                          )}
                        </p>
                      )}
                      {article.keyFacts && article.keyFacts.length > 0 && (
                        <p className="text-xs text-slate-300">
                          Key facts: {article.keyFacts.slice(0, 2).join(' · ')}
                        </p>
                      )}
                    </div>
                    <Link
                      href={article.url}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white hover:text-violet-100"
                    >
                      Read the deep dive
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </article>
                ))}
              </div>

              <div className="text-center mt-10">
                <Link href="/insight" className="text-sm font-medium text-white hover:text-violet-100">
                  View all insights →
                </Link>
              </div>
            </div>
          </section>
        )}

        <section className="py-20 px-4 sm:px-8 bg-gradient-to-br from-white via-slate-50 to-violet-50/30">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="uppercase tracking-[0.4em] text-sm text-slate-400 mb-4">FAQ signals</p>
              <h2 className="text-4xl font-light text-slate-600 mb-4">Caregiver pain points we answer daily</h2>
              <p className="text-lg text-slate-500 max-w-3xl mx-auto font-light">
                Pulled from our RAG logs, these questions surface every day. Each link sends you to the structured answer plus the original public-health source.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3">
              {TOP_FAQ_ITEMS.map((faq, index) => (
                <article key={faq.question} className="border border-slate-100 rounded-3xl p-6 bg-white/90 shadow-sm flex flex-col" id={`homepage-faq-${index + 1}`}>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-3">{faq.hub}</p>
                  <h3 className="text-2xl font-light text-slate-600 mb-4">{faq.question}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed flex-1">{faq.answer}</p>
                  <div className="mt-4 text-sm text-slate-500 space-y-1">
                    <p>
                      Source:{' '}
                      <a
                        href={faq.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet-500 hover:text-violet-600"
                      >
                        {faq.source.name}
                      </a>
                    </p>
                    <p className="text-xs text-slate-400">Validated in Mom AI Agent RAG feed</p>
                  </div>
                  <Link
                    href={`/articles/${faq.articleSlug}`}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-violet-500 hover:text-violet-600"
                  >
                    View structured guide
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </article>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/faq" className="text-violet-500 hover:text-violet-600 text-sm font-medium">
                Browse the full FAQ →
              </Link>
            </div>
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
        <section id="our-apps" className="py-20 px-4 sm:px-8 bg-gradient-to-br from-emerald-50/30 to-teal-50/20">
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
                    <p className="text-slate-400 text-lg font-light">Baby Tracker & Sleep</p>
                  </div>
                  </div>

                <p className="text-slate-400 mb-8 text-lg leading-relaxed font-light">
                  Your AI parenting co-pilot: log feeds & sleep in seconds, auto charts, predictive reminders, and personalized tips for calmer routines.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                    <span className="text-slate-500 font-light">Log nursing, bottle & nap with one tap</span>
                    </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                    <span className="text-slate-500 font-light">View growth charts & AI-powered reminders</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                    <span className="text-slate-500 font-light">Allergy-aware weaning tips & Apple Watch sync</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <a
                      href="https://apps.apple.com/us/app/dearbaby-grow-feed-sleep-track/id6747565368"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gradient-to-r from-slate-400 to-violet-400 text-white px-8 py-4 rounded-2xl font-light text-center hover:shadow-md transition-all"
                    >
                      Download Free
                    </a>
                    <Link
                      href="/products/dearbaby"
                      className="flex-1 bg-slate-100 text-slate-500 px-8 py-4 rounded-2xl font-light text-center hover:bg-slate-200 transition-all"
                    >
                      Learn More
                    </Link>
                  </div>
                  <a
                    href="https://apps.apple.com/us/app/dearbaby-grow-feed-sleep-track/id6747565368"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-sm text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    View on App Store →
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
                    <h3 className="text-3xl font-light text-slate-500 mb-2">DearBaby: Solid Start</h3>
                    <p className="text-slate-400 text-lg font-light">Baby Recipes · BLW Lunchbox</p>
                  </div>
                </div>

                <p className="text-slate-400 mb-8 text-lg leading-relaxed font-light">
                  Purées, mashed, soft pieces, and beginner finger foods. Clean, calm interface designed for busy parents introducing solids around 6+ months.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                    <span className="text-slate-500 font-light">Recipes by stage with step-by-step guidance</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                    <span className="text-slate-500 font-light">Lunchbox builder for balanced meals</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                    <span className="text-slate-500 font-light">Favorites & collections organized by month</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-4">
                    <a
                      href="https://apps.apple.com/us/app/dearbaby-solid-start/id6749838104"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gradient-to-r from-slate-400 to-purple-400 text-white px-8 py-4 rounded-2xl font-light text-center hover:shadow-md transition-all"
                    >
                      Download Free
                    </a>
                    <Link 
                      href="/products/solidstart"
                      className="flex-1 bg-slate-100 text-slate-500 px-8 py-4 rounded-2xl font-light text-center hover:bg-slate-200 transition-all"
                    >
                      Learn More
                    </Link>
                  </div>
                  <a
                    href="https://apps.apple.com/us/app/dearbaby-solid-start/id6749838104"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-sm text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    View on App Store →
                  </a>
                  </div>
              </motion.div>
                </div>
          </div>
        </section>

        {/* Knowledge Engine & Light Testimonials */}
        <section className="py-20 px-4 sm:px-8 bg-gradient-to-br from-slate-50/40 via-white to-purple-50/20">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-light text-slate-500 mb-6">
                Evidence-First Knowledge Engine
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto font-light">
                Built on a continuously validated RAG stack with structured pediatric and maternal health guidance
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                className="bg-white/80 border border-slate-100 rounded-3xl p-8 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-sm uppercase tracking-wide text-slate-400 mb-3">Structured Knowledge Base</h3>
                <p className="text-3xl font-light text-slate-500 mb-4">50+ Pain Point Playbooks</p>
                <p className="text-slate-500 font-light leading-relaxed">
                  Curated daily from real caregiver queries, synced to Supabase and surfaced via `/api/ai-feed` for LLM retrieval.
                </p>
              </motion.div>

              <motion.div
                className="bg-white/80 border border-slate-100 rounded-3xl p-8 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-sm uppercase tracking-wide text-slate-400 mb-3">Verified Sources</h3>
                <p className="text-3xl font-light text-slate-500 mb-4">Medical-Grade Citations</p>
                <p className="text-slate-500 font-light leading-relaxed">
                  Every recommendation links back to CDC, AAP, WHO, and peer-reviewed evidence—perfect for professional audits.
                </p>
              </motion.div>

              <motion.div
                className="bg-white/80 border border-slate-100 rounded-3xl p-8 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h3 className="text-sm uppercase tracking-wide text-slate-400 mb-3">Production RAG Pipeline</h3>
                <p className="text-3xl font-light text-slate-500 mb-4">Real-Time Retrieval</p>
                <p className="text-slate-500 font-light leading-relaxed">
                  Supabase RPC + embeddings deliver instant answers, with caching, logging, and ingestion tooling for enterprise workflows.
                </p>
              </motion.div>
            </div>

            <motion.div
              className="mt-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="text-center text-2xl font-light text-slate-500 mb-8">What Care Teams Are Saying</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-white/80 border border-slate-100 rounded-2xl p-6 shadow-sm">
                  <p className="text-slate-500 font-light leading-relaxed">
                    “The knowledge base mirrors our clinic protocol. I can pull citations instantly and give parents a calm, evidence-backed plan in minutes.”
                  </p>
                  <p className="text-sm text-slate-400 font-light mt-4">— Katherine, RN & IBCLC</p>
                </div>
                <div className="bg-white/80 border border-slate-100 rounded-2xl p-6 shadow-sm">
                  <p className="text-slate-500 font-light leading-relaxed">
                    “Our AI assistant finally references real sources. The `/api/ai-feed` endpoint is the fastest way I’ve shipped credible parenting answers.”
                  </p>
                  <p className="text-sm text-slate-400 font-light mt-4">— Leon, Product Lead</p>
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

        <section className="py-20 px-4 sm:px-8 bg-white">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="uppercase tracking-[0.4em] text-sm text-slate-400 mb-4">Latest evidence</p>
              <h2 className="text-4xl font-light text-slate-600 mb-4">
                Fast answers sourced from clinical guidelines
              </h2>
              <p className="text-lg text-slate-500 max-w-3xl mx-auto font-light">
                Every summary below links to the full article, citations, and machine-readable schema so AI agents and parents see the same facts.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3">
              {latestArticles.length > 0 && latestArticles.map((article) => (
                <article key={article.url} className="border border-slate-100 rounded-3xl p-6 shadow-sm bg-gradient-to-br from-white to-slate-50/50 flex flex-col">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-3">{article.topic || 'Infant care'} • {article.region || 'Global'}</p>
                  <h3 className="text-2xl font-light text-slate-600 mb-4">{article.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed flex-1">{article.summary || 'Evidence-backed insight curated for rapid reference.'}</p>
                  <div className="mt-4 space-y-1 text-sm text-slate-500">
                    {article.source?.name && (
                      <p>
                        Source:{' '}
                        {article.source?.url ? (
                          <a
                            href={article.source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-violet-500 hover:text-violet-600"
                          >
                            {article.source.name}
                          </a>
                        ) : (
                          <span>{article.source.name}</span>
                        )}
                      </p>
                    )}
                    {article.region && (
                      <p>Region: {article.region}</p>
                    )}
                  </div>
                  {article.keyFacts && article.keyFacts.length > 0 && (
                    <ul className="mt-4 space-y-2 text-sm text-slate-500">
                      {article.keyFacts.slice(0, 2).map((fact, index) => (
                        <li key={`${article.url}-fact-${index}`} className="flex gap-2">
                          <span className="w-1.5 h-1.5 mt-2 rounded-full bg-slate-300" />
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link
                    href={article.url}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-violet-500 hover:text-violet-600"
                  >
                    Read structured answer
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </article>
              ))}

              {latestArticles.length === 0 && !articlesError && (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={`skeleton-${index}`} className="border border-slate-100 rounded-3xl p-6 shadow-sm bg-white animate-pulse h-full">
                    <div className="h-3 w-24 bg-slate-100 rounded-full mb-4" />
                    <div className="h-5 w-3/4 bg-slate-100 rounded-full mb-3" />
                    <div className="h-5 w-2/3 bg-slate-100 rounded-full mb-6" />
                    <div className="h-3 w-full bg-slate-100 rounded-full mb-2" />
                    <div className="h-3 w-5/6 bg-slate-100 rounded-full mb-2" />
                    <div className="h-3 w-2/3 bg-slate-100 rounded-full" />
                  </div>
                ))
              )}
            </div>

            {articlesError && (
              <p className="text-center text-sm text-slate-400 mt-6">{articlesError} <Link href="/latest-articles" className="text-violet-500 underline">View archive</Link></p>
            )}
          </div>
        </section>

        <section className="py-20 px-4 sm:px-8 bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="uppercase tracking-[0.4em] text-sm text-slate-400 mb-3">Human trust</p>
              <h2 className="text-4xl font-light text-slate-600 mb-4">Families & clinicians co-pilot with Mom AI Agent</h2>
              <p className="text-lg text-slate-500 max-w-3xl mx-auto font-light">
                Testimonials reference specific workflows—feeding roadmaps, allergen timelines, and BLW safety cues—so AI summaries match lived experience.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3">
              {TRUST_TESTIMONIALS.map((testimonial) => (
                <article key={testimonial.name} className="rounded-3xl border border-slate-100 bg-white/90 backdrop-blur p-6 shadow-sm">
                  <svg className="w-8 h-8 text-violet-400 mb-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.17 6A5.17 5.17 0 002 11.17V20h6.93V11.17H5.42A3.42 3.42 0 018.83 7.75L9.9 6zm10.9 0A5.17 5.17 0 0013 11.17V20h6.93V11.17h-3.51a3.42 3.42 0 013.41-3.42l1.07-1.13z" />
                  </svg>
                  <p className="text-slate-600 text-base leading-relaxed mb-6">{testimonial.quote}</p>
                  <div>
                    <p className="text-slate-800 font-medium">{testimonial.name}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mt-2">{testimonial.role}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/trust" className="inline-flex items-center gap-2 text-violet-500 hover:text-violet-600 font-medium">
                Review sourcing process
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        <section id="guide-download" className="py-20 px-4 sm:px-8 bg-gradient-to-r from-slate-900 via-slate-800 to-violet-900 text-white">
          <div className="container mx-auto max-w-6xl grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <p className="uppercase tracking-[0.4em] text-xs text-violet-200 mb-4">Free download</p>
              <h2 className="text-4xl font-light mb-6">The Pediatric Feeding Roadmap</h2>
              <p className="text-lg text-slate-100/90 mb-6 leading-relaxed">
                A 24-week plan that merges CDC/AAP timelines, allergen dosing, and BLW cut sizes. Delivered instantly to your inbox with links to every cited source inside Mom AI Agent.
              </p>
              <ul className="space-y-3 text-sm text-slate-100/90">
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-2 h-2 rounded-full bg-violet-300" />
                  Week-by-week iron, vitamin C, and allergen prompts
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-2 h-2 rounded-full bg-violet-300" />
                  Safe texture progression checklist + choking red flags
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-2 h-2 rounded-full bg-violet-300" />
                  Direct links to the BLW lunchbox builder & expert Q&A sessions
                </li>
              </ul>
            </div>

            <div className="bg-white/10 border border-white/20 rounded-3xl p-8 backdrop-blur">
              <form onSubmit={handleGuideSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-200 mb-2" htmlFor="guide-name">Parent name (optional)</label>
                  <input
                    id="guide-name"
                    type="text"
                    value={guideName}
                    onChange={(e) => setGuideName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-300/50"
                    placeholder="e.g., Taylor"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-200 mb-2" htmlFor="guide-email">Email</label>
                  <input
                    id="guide-email"
                    type="email"
                    value={guideEmail}
                    onChange={(e) => setGuideEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-300/50"
                    placeholder="you@email.com"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-400 to-pink-400 text-slate-900 font-semibold shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={guideStatus === 'loading'}
                >
                  {guideStatus === 'loading' ? 'Sending guide…' : 'Email me the roadmap'}
                </button>
              </form>
              <p className="text-xs text-slate-300 mt-4">
                We’ll send the PDF and an optional weekly prompt. Unsubscribe anytime.
              </p>
              {guideFeedback && (
                <p
                  className={`mt-4 text-sm ${guideStatus === 'success' ? 'text-emerald-300' : 'text-rose-200'}`}
                  role="status"
                >
                  {guideFeedback}
                </p>
              )}
            </div>
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
