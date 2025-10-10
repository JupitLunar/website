'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SolidStartProductPage() {
  const features = [
    {
      title: "Recipes by Stage",
      desc: "Purées, mashed, soft pieces, and beginner finger foods with step-by-step guidance."
    },
    {
      title: "Lunchbox Builder",
      desc: "Drag in a main, veg, fruit, and dairy/alt to make a balanced box fast."
    },
    {
      title: "Favorites & Collections",
      desc: "One-tap to save. Organize by month... or texture."
    },
    {
      title: "Doneness Cues",
      desc: "Step-by-step guidance with softness cues and suggested cut sizes."
    }
  ];

  return (
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
              <h1 className="text-5xl sm:text-6xl font-bold mb-3 text-[#7d6ede] tracking-tight">
                DearBaby: Solid Start
              </h1>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#6d5dd3] mb-4">
                Baby Recipes ·{' '}
                <span className="bg-gradient-to-r from-[#a18aff] to-[#e0c3fc] bg-clip-text text-transparent">
                  BLW Lunchbox
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
                Purées, mashed, soft pieces, and beginner finger foods. Clean, calm interface designed for busy parents introducing solids around 6+ months.
              </p>
              <a
                href="https://apps.apple.com/us/app/dearbaby-solid-start/id6749838104"
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
                <h3 className="text-2xl font-semibold text-[#6d5dd3] mb-4">
                  Stage-Appropriate Recipes
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Every recipe is carefully designed for babies 6+ months. Whether you're doing Baby-Led Weaning (BLW) or starting with purées, Solid Start provides clear guidance on preparation, texture, and serving sizes.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#7d6ede] rounded-full"></span>
                    Recipes progress from purées to finger foods
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#7d6ede] rounded-full"></span>
                    Visual cues for doneness and softness
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#7d6ede] rounded-full"></span>
                    Age-appropriate cut sizes and shapes
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8">
                <h3 className="text-2xl font-semibold text-[#6d5dd3] mb-4">
                  Build Balanced Lunchboxes
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  The Lunchbox Builder makes meal planning effortless. Simply drag and drop a main dish, vegetable, fruit, and dairy/alternative to create a nutritionally balanced meal.
                </p>
                <p className="text-gray-600 text-sm">
                  Perfect for daycare, picnics, or everyday meals at home.
                </p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-8">
                <h3 className="text-2xl font-semibold text-[#6d5dd3] mb-4">
                  Save & Organize Favorites
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Create collections organized by month, texture, or ingredient. Quickly find recipes your baby loves and build a personalized meal rotation that works for your family.
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
                Ready to start solids with confidence?
              </h2>
              <a
                href="https://apps.apple.com/us/app/dearbaby-solid-start/id6749838104"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-[#cfc4ff] to-[#e5deff] hover:from-[#c3b6ff] hover:to-[#d8cfff] text-[#5646b4] font-semibold px-10 py-4 rounded-full shadow-sm transition"
              >
                Get Solid Start Now
              </a>
              <p className="mt-3 text-xs text-gray-500">Free · 6+ Months Solids • JupitLunar 2025</p>
            </motion.div>
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
                <h3 className="font-semibold text-lg text-[#7d6ede] mb-2">
                  Is Solid Start free?
                </h3>
                <p className="text-gray-700">
                  Yes, the app is completely free to download and use with all features included.
                </p>
              </div>
              <div className="bg-violet-50 rounded-2xl p-6">
                <h3 className="font-semibold text-lg text-[#7d6ede] mb-2">
                  Which age range is supported?
                </h3>
                <p className="text-gray-700">
                  We focus on babies 6+ months who are starting solid foods, with recipes suitable for both BLW and purée approaches.
                </p>
              </div>
              <div className="bg-violet-50 rounded-2xl p-6">
                <h3 className="font-semibold text-lg text-[#7d6ede] mb-2">
                  Does it include allergen information?
                </h3>
                <p className="text-gray-700">
                  Yes, each recipe includes allergen information and guidance for safe introduction following WHO and AAP guidelines.
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
  );
}
