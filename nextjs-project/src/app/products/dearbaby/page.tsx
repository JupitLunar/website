'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Head from 'next/head';

export default function DearBabyProductPage() {
  const features = [
    {
      title: "Smart Logs",
      desc: "Effortless feed & sleep tracking synced with Apple Health."
    },
    {
      title: "Milestone AI",
      desc: "GPT-based forecasts of growth & development."
    },
    {
      title: "Health Digest",
      desc: "Daily summaries combining HRV, naps & nutrition."
    },
    {
      title: "Ask GPT",
      desc: "Voice / image Q&A for instant parenting help."
    }
  ];

  return (
    <>
      <Head>
        <title>DearBaby Tracker - AI Baby Tracker App | Feeding, Sleep & Growth Tracking</title>
        <meta name="description" content="Free AI-powered baby tracker with GPT-4o. Track feedings, sleep, diapers, growth & milestones. Apple Watch integration. Smart insights for newborns and infants. Download DearBaby by JupitLunar." />
        <meta name="keywords" content="DearBaby, DearBaby Tracker, baby tracker, baby tracker app, AI baby tracker, newborn tracker, infant tracker, feeding tracker, breastfeeding tracker, bottle tracker, sleep tracker baby, baby sleep app, diaper tracker, baby growth tracker, baby milestone tracker, nursing tracker, baby log, baby tracker free, Apple Watch baby tracker, GPT baby assistant, baby AI assistant, baby feeding schedule, newborn sleep tracker, baby growth chart, baby development tracker, baby routine tracker, baby care app, parenting app" />
        <link rel="canonical" href="https://www.momaiagent.com/products/dearbaby" />
        <meta name="og:title" content="DearBaby Tracker - AI Baby Tracker | Free Download" />
        <meta name="og:description" content="Free AI baby tracker with GPT-4o. Track feeds, sleep, diapers & milestones. Apple Watch support for hands-free tracking." />
        <meta name="twitter:title" content="DearBaby Tracker - AI Baby Tracker App" />
        <meta name="twitter:description" content="Free baby tracker with AI insights. Track feeding, sleep, growth & milestones with Apple Watch support." />
      </Head>
      
      {/* JSON-LD for SEO/AEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'MobileApplication',
            name: 'DearBaby Tracker - AI Baby Tracker',
            alternateName: ['DearBaby Baby Tracker', 'DearBaby Newborn Tracker', 'DearBaby App'],
            description: 'Free AI-powered baby tracker for feeds, sleep, diapers, and milestones. Features GPT-4o insights, Apple Watch integration, automatic pattern recognition, and growth charts. Perfect for newborns and infants.',
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
              name: 'JupitLunar',
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
            keywords: 'baby tracker, newborn tracker, feeding tracker, sleep tracker, growth tracker, breastfeeding app, Apple Watch baby app',
            featureList: [
              'One-tap feeding tracking (nursing, bottle, solid foods)',
              'Automatic sleep tracking with pattern recognition',
              'Diaper and milestone logging',
              'GPT-4o powered AI parenting assistant',
              'Apple Watch integration for hands-free tracking',
              'Automatic growth charts and percentile tracking',
              'Smart feeding and sleep reminders',
              'Pattern recognition and predictive insights',
              'Voice and image-based Q&A',
              'Apple Health synchronization',
              'Allergy-aware weaning tips',
              'Export data and generate reports',
              'Free to download with premium analytics option',
            ],
          }),
        }}
      />
      
      {/* FAQ Schema for AEO - Strategic Long-tail Questions */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What baby tracker app works with Apple Watch for hands-free logging?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'DearBaby Tracker offers full Apple Watch integration, allowing you to log nursing, bottle feeds, naps, and diaper changes directly from your wrist without touching your phone. Perfect for nighttime feeds or when holding your baby.',
                },
              },
              {
                '@type': 'Question',
                name: 'Which baby tracker has AI powered insights with GPT-4o?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'DearBaby Tracker integrates GPT-4o for personalized parenting guidance. Ask questions via voice (like "Why is my baby waking every hour?"), upload photos of rashes or feeding concerns, and get instant AI answers based on your baby\'s tracked patterns and age.',
                },
              },
              {
                '@type': 'Question',
                name: 'How do I track cluster feeding and frequent night wakings?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'DearBaby Tracker automatically detects cluster feeding patterns (multiple feeds in short periods) and night waking frequency. The app visualizes these patterns on charts, predicts when cluster feeding might occur, and provides evidence-based tips for managing sleep deprivation.',
                },
              },
              {
                '@type': 'Question',
                name: 'Can DearBaby predict my baby next feeding or nap time?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes! DearBaby Tracker uses AI pattern recognition to analyze your baby\'s historical feeding and sleep data, then predicts optimal next feed times and nap windows. You\'ll receive smart reminders 15 minutes before predicted feeding or sleep times.',
                },
              },
              {
                '@type': 'Question',
                name: 'What baby tracker app is best for breastfeeding moms?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'DearBaby Tracker is designed for breastfeeding moms with left/right breast tracking, automatic duration timers, pumping session logs, and supply pattern analysis. Track which breast to start with next, total daily nursing time, and get personalized lactation tips from the GPT-4o assistant.',
                },
              },
              {
                '@type': 'Question',
                name: 'How can I track baby sleep regressions and wake windows?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'DearBaby Tracker identifies sleep regressions by analyzing sudden pattern changes in your baby\'s sleep data. The app tracks age-appropriate wake windows (time between naps), alerts you when baby has been awake too long, and provides sleep training tips during regression periods.',
                },
              },
              {
                '@type': 'Question',
                name: 'Which free baby tracker syncs with Apple Health automatically?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'DearBaby Tracker automatically syncs all feeding, sleep, and growth data with Apple Health, allowing you to see your baby\'s wellness alongside your own health metrics. This two-way sync works seamlessly with Apple Watch tracking.',
                },
              },
              {
                '@type': 'Question',
                name: 'How do I use a baby tracker when I have twins or multiple babies?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'DearBaby Tracker supports multiple baby profiles with easy switching. Track each twin or sibling separately with color-coded logs, compare growth charts side-by-side, and get individual AI insights for each baby\'s unique patterns and needs.',
                },
              },
              {
                '@type': 'Question',
                name: 'What is DearBaby Tracker and is it free?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'DearBaby Tracker is a free AI-powered baby tracking app by JupitLunar. Core features (feeding, sleep, diaper, growth tracking) and GPT-4o parenting assistant are completely free. Optional premium analytics unlock advanced pattern insights and detailed reports.',
                },
              },
              {
                '@type': 'Question',
                name: 'Can I export my baby tracking data to share with pediatrician?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes! DearBaby Tracker lets you generate PDF reports of feeding schedules, sleep patterns, growth charts, and milestone logs to share with your pediatrician at well-child visits. Export specific date ranges or comprehensive summaries.',
                },
              },
            ],
          }),
        }}
      />
      
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <main>
        {/* HERO */}
        <section
          className="relative overflow-hidden text-center px-4 py-16 sm:py-28 md:py-36"
          style={{
            backgroundImage:
              `url(/Assets/marble2.png), ` +
              "linear-gradient(180deg,#fdfcff 0%,#faf8ff 100%), " +
              "radial-gradient(1000px at 20% -200px, rgba(199,187,255,0.35) 0%, rgba(255,255,255,0) 70%), " +
              "radial-gradient(800px at 85% 110%, rgba(235,227,255,0.45) 0%, rgba(255,255,255,0) 75%)",
            backgroundSize: "cover, 100% 100%, 100% 100%, 100% 100%",
            backgroundPosition: "center, center, center, center",
            backgroundRepeat: "no-repeat, no-repeat, no-repeat, no-repeat",
            backgroundBlendMode: "normal",
            minHeight: "60vh"
          }}
        >
          <div className="max-w-3xl mx-auto pt-8 sm:pt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-3 text-[#6d5dd3] tracking-tight">
                DearBaby
              </h1>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-[#a18aff] to-[#e0c3fc] bg-clip-text text-transparent">
                AI Newborn Tracker
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-10 px-4 sm:px-0">
                Calm, data-driven support for feeds, naps & milestones — powered by GPT-4o.
              </p>
              <a
                href="https://apps.apple.com/us/app/dearbaby-grow-feed-sleep-track/id6747565368"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-[#cfc4ff] to-[#e5deff] hover:from-[#c3b6ff] hover:to-[#d8cfff] text-[#5646b4] font-semibold px-8 sm:px-12 py-3 sm:py-4 rounded-full shadow-sm transition text-base sm:text-lg"
              >
                Download Free
              </a>
            </motion.div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-16 bg-[#fcfbff]">
          <div className="max-w-6xl mx-auto px-6">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#6d5dd3]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Key Features
            </motion.h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map(({ title, desc }, index) => (
                <motion.article
                  key={title}
                  className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow-[0_2px_8px_rgba(124,95,226,0.07)] hover:shadow-md transition"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="font-semibold text-lg mb-2 text-[#7d6ede]">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* APP HIGHLIGHTS */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl p-8">
                <h3 className="text-2xl font-semibold text-[#6d5dd3] mb-4">Track with One Tap</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Log nursing, bottle feeds, and naps in seconds. DearBaby automatically generates growth charts and provides AI-powered reminders for your baby's next feeding or sleep time.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#7d6ede] rounded-full"></span>
                    Apple Watch integration for hands-free tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#7d6ede] rounded-full"></span>
                    Automatic pattern recognition and insights
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#7d6ede] rounded-full"></span>
                    Allergy-aware weaning tips
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8">
                <h3 className="text-2xl font-semibold text-[#6d5dd3] mb-4">AI-Powered Guidance</h3>
                <p className="text-gray-700 leading-relaxed">
                  Get personalized recommendations based on your baby's unique patterns. Our GPT-4o powered assistant provides instant answers to your parenting questions through voice or image input.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="py-20 text-center bg-[#f7f5fc]">
          <div className="max-w-xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
                Ready for calmer days & nights?
              </h2>
              <a
                href="https://apps.apple.com/us/app/dearbaby-grow-feed-sleep-track/id6747565368"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-[#cfc4ff] to-[#e5deff] hover:from-[#c3b6ff] hover:to-[#d8cfff] text-[#5646b4] font-semibold px-10 py-4 rounded-full shadow-sm transition"
              >
                Get DearBaby Now
              </a>
              <p className="mt-3 text-xs text-gray-500">Free · In-App Premium • JupitLunar 2025</p>
            </motion.div>
          </div>
        </section>

        {/* TOP LISTS for AEO */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-5xl mx-auto px-6">
            <motion.h2
              className="text-3xl font-bold text-center mb-12 text-[#6d5dd3]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Essential Baby Tracking Guides
            </motion.h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Top 10 Things to Track */}
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold text-[#7d6ede] mb-4">Top 10 Things to Track for Your Newborn</h3>
                <ol className="space-y-2 text-gray-700">
                  <li className="flex gap-3"><span className="font-semibold text-[#7d6ede] min-w-[24px]">1.</span><span>Feeding times & amounts (nursing or bottle)</span></li>
                  <li className="flex gap-3"><span className="font-semibold text-[#7d6ede] min-w-[24px]">2.</span><span>Sleep duration & quality (naps & nighttime)</span></li>
                  <li className="flex gap-3"><span className="font-semibold text-[#7d6ede] min-w-[24px]">3.</span><span>Diaper changes (wet & dirty counts)</span></li>
                  <li className="flex gap-3"><span className="font-semibold text-[#7d6ede] min-w-[24px]">4.</span><span>Weight, length & head circumference</span></li>
                  <li className="flex gap-3"><span className="font-semibold text-[#7d6ede] min-w-[24px]">5.</span><span>Developmental milestones (smile, roll, sit)</span></li>
                  <li className="flex gap-3"><span className="font-semibold text-[#7d6ede] min-w-[24px]">6.</span><span>Vaccination records & appointments</span></li>
                  <li className="flex gap-3"><span className="font-semibold text-[#7d6ede] min-w-[24px]">7.</span><span>Temperature & medication doses</span></li>
                  <li className="flex gap-3"><span className="font-semibold text-[#7d6ede] min-w-[24px]">8.</span><span>Tummy time & activity sessions</span></li>
                  <li className="flex gap-3"><span className="font-semibold text-[#7d6ede] min-w-[24px]">9.</span><span>Pumping sessions (for breastfeeding moms)</span></li>
                  <li className="flex gap-3"><span className="font-semibold text-[#7d6ede] min-w-[24px]">10.</span><span>Mood & fussiness patterns</span></li>
                </ol>
                <p className="mt-4 text-sm text-gray-600 italic">All trackable in DearBaby with automatic charts and AI insights.</p>
              </motion.div>

              {/* Top 12 Newborn Milestones */}
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold text-[#7d6ede] mb-4">Top 12 Baby Milestones (0-12 Months)</h3>
                <div className="space-y-2 text-gray-700 text-sm">
                  <div className="flex gap-2"><span className="text-[#7d6ede] font-semibold min-w-[20px]">1.</span><span>First smile (6-8 weeks)</span></div>
                  <div className="flex gap-2"><span className="text-[#7d6ede] font-semibold min-w-[20px]">2.</span><span>Holding head up (2-3 months)</span></div>
                  <div className="flex gap-2"><span className="text-[#7d6ede] font-semibold min-w-[20px]">3.</span><span>Rolling over (4-6 months)</span></div>
                  <div className="flex gap-2"><span className="text-[#7d6ede] font-semibold min-w-[20px]">4.</span><span>Sitting without support (6-8 months)</span></div>
                  <div className="flex gap-2"><span className="text-[#7d6ede] font-semibold min-w-[20px]">5.</span><span>Babbling sounds (6-9 months)</span></div>
                  <div className="flex gap-2"><span className="text-[#7d6ede] font-semibold min-w-[20px]">6.</span><span>Eating solid foods (6+ months)</span></div>
                  <div className="flex gap-2"><span className="text-[#7d6ede] font-semibold min-w-[20px]">7.</span><span>Crawling (7-10 months)</span></div>
                  <div className="flex gap-2"><span className="text-[#7d6ede] font-semibold min-w-[20px]">8.</span><span>Pulling to stand (8-10 months)</span></div>
                  <div className="flex gap-2"><span className="text-[#7d6ede] font-semibold min-w-[20px]">9.</span><span>First words "mama/dada" (10-12 months)</span></div>
                  <div className="flex gap-2"><span className="text-[#7d6ede] font-semibold min-w-[20px]">10.</span><span>Waving bye-bye (9-12 months)</span></div>
                  <div className="flex gap-2"><span className="text-[#7d6ede] font-semibold min-w-[20px]">11.</span><span>Walking with support (10-12 months)</span></div>
                  <div className="flex gap-2"><span className="text-[#7d6ede] font-semibold min-w-[20px]">12.</span><span>Using pincer grasp (9-12 months)</span></div>
                </div>
                <p className="mt-4 text-sm text-gray-600 italic">Track and celebrate each milestone with photos in DearBaby.</p>
              </motion.div>

              {/* Baby Sleep Tips */}
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-sm md:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold text-[#7d6ede] mb-4">Top 8 Newborn Sleep Tips for Better Rest</h3>
                <div className="grid md:grid-cols-2 gap-3 text-gray-700 text-sm">
                  <div className="flex gap-2"><span className="text-[#7d6ede] font-semibold">1.</span><span>Track sleep patterns to identify optimal nap times</span></div>
                  <div className="flex gap-2"><span className="text-[#7d6ede] font-semibold">5.</span><span>Use white noise and dark room for better sleep</span></div>
                  <div className="flex gap-2"><span className="text-[#7d6ede] font-semibold">2.</span><span>Follow wake windows (60-90 min for newborns)</span></div>
                  <div className="flex gap-2"><span className="text-[#7d6ede] font-semibold">6.</span><span>Create consistent bedtime routine</span></div>
                  <div className="flex gap-2"><span className="text-[#7d6ede] font-semibold">3.</span><span>Watch for sleepy cues (yawning, eye rubbing)</span></div>
                  <div className="flex gap-2"><span className="text-[#7d6ede] font-semibold">7.</span><span>Swaddle safely for newborns (stop when rolling)</span></div>
                  <div className="flex gap-2"><span className="text-[#7d6ede] font-semibold">4.</span><span>Feed before sleep but not to sleep</span></div>
                  <div className="flex gap-2"><span className="text-[#7d6ede] font-semibold">8.</span><span>Log sleep to identify patterns & disruptions</span></div>
                </div>
                <p className="mt-4 text-sm text-gray-600 italic">DearBaby Tracker analyzes your baby's sleep data and provides personalized tips.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-[#6d5dd3]">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="bg-violet-50 rounded-2xl p-6">
                <h3 className="font-semibold text-lg text-[#7d6ede] mb-2">What is the best baby tracker app?</h3>
                <p className="text-gray-700">
                  DearBaby Tracker is a free AI-powered baby tracker app featuring GPT-4o insights, Apple Watch integration, and automatic pattern recognition. Track feedings, sleep, diapers, and milestones with one-tap logging and smart reminders.
                </p>
              </div>
              <div className="bg-violet-50 rounded-2xl p-6">
                <h3 className="font-semibold text-lg text-[#7d6ede] mb-2">How do I track baby feedings?</h3>
                <p className="text-gray-700">
                  DearBaby Tracker lets you log nursing sessions (left/right breast), bottle feeds (amount and type), and solid food meals with one tap. The app automatically tracks duration, generates feeding schedules, and provides smart reminders for next feeds.
                </p>
              </div>
              <div className="bg-violet-50 rounded-2xl p-6">
                <h3 className="font-semibold text-lg text-[#7d6ede] mb-2">How can I track my newborn sleep patterns?</h3>
                <p className="text-gray-700">
                  Use DearBaby Tracker to log every nap and nighttime sleep with automatic timers. The app analyzes patterns, predicts wake times, and provides personalized sleep tips based on your baby's age and habits. Works with Apple Watch for hands-free tracking.
                </p>
              </div>
              <div className="bg-violet-50 rounded-2xl p-6">
                <h3 className="font-semibold text-lg text-[#7d6ede] mb-2">What should I track for my newborn baby?</h3>
                <p className="text-gray-700">
                  Essential tracking includes: feeding times and amounts (nursing or bottle), sleep duration and quality, diaper changes (wet/dirty), weight and length measurements, and developmental milestones. DearBaby Tracker covers all of these with automatic charts and AI-powered insights.
                </p>
              </div>
              <div className="bg-violet-50 rounded-2xl p-6">
                <h3 className="font-semibold text-lg text-[#7d6ede] mb-2">Does DearBaby work with Apple Watch?</h3>
                <p className="text-gray-700">
                  Yes, DearBaby Tracker includes full Apple Watch integration allowing hands-free tracking of feeds, sleep, and diapers directly from your wrist. Perfect for busy parents who need quick logging without pulling out their phone.
                </p>
              </div>
              <div className="bg-violet-50 rounded-2xl p-6">
                <h3 className="font-semibold text-lg text-[#7d6ede] mb-2">Can I track baby growth and milestones?</h3>
                <p className="text-gray-700">
                  Yes, DearBaby Tracker automatically generates WHO and CDC growth charts (weight, length, head circumference) with percentile tracking. Log developmental milestones like first smile, rolling over, sitting up, and first words with photo attachments.
                </p>
              </div>
              <div className="bg-violet-50 rounded-2xl p-6">
                <h3 className="font-semibold text-lg text-[#7d6ede] mb-2">Is DearBaby Tracker free?</h3>
                <p className="text-gray-700">
                  Yes, DearBaby Tracker is free to download with core tracking features (feeds, sleep, diapers, growth) and GPT-powered tips included. Premium analytics with advanced insights are available as an optional upgrade.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Back to Products */}
        <section className="py-8 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <Link
              href="/#our-apps"
              className="inline-flex items-center gap-2 text-[#7d6ede] hover:text-[#6d5dd3] font-medium transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to All Products
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} JupitLunar ·{' '}
        <Link href="/privacy" className="underline hover:text-gray-700">
          Privacy Policy
        </Link>
        {' · '}
        <Link href="/disclaimer" className="underline hover:text-gray-700">
          Medical Disclaimer
        </Link>
      </footer>
    </div>
    </>
  );
}
