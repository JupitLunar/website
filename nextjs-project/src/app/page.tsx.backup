'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { generateWebsiteStructuredData, generateOrganizationStructuredData } from '@/lib/json-ld';

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

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

      <div className="min-h-screen bg-gradient-to-br from-[#F8F6FC] to-[#EAE6F8]">
        {/* Hero Section - Knowledge Portal Focus */}
        <section className="relative py-20 px-4 sm:px-8 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/40 to-pink-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-blue-200/40 to-indigo-200/30 rounded-full blur-3xl"></div>

          <div className="container mx-auto max-w-6xl relative z-10">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Based on CDC, AAP & Health Canada Official Guidelines</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                North America's Trusted Guide to<br />
                <span className="bg-gradient-to-r from-[#7C6FF6] to-[#E24A8D] bg-clip-text text-transparent">
                  Infant & Toddler Nutrition
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Evidence-based feeding guidance for 0-24 months, curated from official health organizations
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search foods, safety rules, or milestones... (e.g., 'avocado 6 months')"
                    className="w-full px-6 py-4 pr-14 text-lg rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#7C6FF6] to-[#E24A8D] text-white p-3 rounded-xl hover:shadow-lg transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                  <span>1,200+ Official Citations</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>Updated Every 90 Days</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                  <span>400+ Foods</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Core Features - 4 Big Cards */}
        <section className="py-16 px-4 sm:px-8 bg-white">
          <div className="container mx-auto max-w-7xl">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Explore by Category
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Food Database Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Link href="/foods" className="block group">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 h-full border-2 border-transparent hover:border-green-400 transition-all duration-300 hover:shadow-xl">
                    <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Food Database</h3>
                    <p className="text-gray-600 mb-4">
                      400+ foods with age recommendations, choking risks, and preparation guides
                    </p>
                    <div className="text-green-600 font-semibold flex items-center gap-2">
                      Browse Foods
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Safety Rules Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Link href="/topics/safety-and-hygiene" className="block group">
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 h-full border-2 border-transparent hover:border-red-400 transition-all duration-300 hover:shadow-xl">
                    <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Safety Rules</h3>
                    <p className="text-gray-600 mb-4">
                      Choking prevention, food storage guidelines, and travel tips
                    </p>
                    <div className="text-red-600 font-semibold flex items-center gap-2">
                      View Safety Guide
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Milestones Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Link href="/topics/feeding-foundations" className="block group">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 h-full border-2 border-transparent hover:border-blue-400 transition-all duration-300 hover:shadow-xl">
                    <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00 2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Feeding Milestones</h3>
                    <p className="text-gray-600 mb-4">
                      Developmental readiness, texture progression, and age-appropriate portions
                    </p>
                    <div className="text-blue-600 font-semibold flex items-center gap-2">
                      Learn the Basics
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Allergens Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Link href="/topics/allergen-readiness" className="block group">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 h-full border-2 border-transparent hover:border-purple-400 transition-all duration-300 hover:shadow-xl">
                    <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Allergen Introduction</h3>
                    <p className="text-gray-600 mb-4">
                      Early introduction protocols based on LEAP & EAT studies
                    </p>
                    <div className="text-purple-600 font-semibold flex items-center gap-2">
                      Start Safely
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Latest Content Section */}
        <section className="py-16 px-4 sm:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="container mx-auto max-w-7xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Recently Updated
              </h2>
              <Link href="/topics" className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-2">
                View All Topics
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Example topic cards - these would be dynamically generated */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Link href="/topics/safety-and-hygiene" className="block group">
                  <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Safety</span>
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">Updated Jan 2025</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      Choking Prevention & Food Safety
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Latest CDC guidelines on safe food preparation and choking hazard identification
                    </p>
                    <div className="text-sm text-purple-600 font-semibold">Read more →</div>
                  </div>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Link href="/topics/allergen-readiness" className="block group">
                  <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Allergens</span>
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">Updated Jan 2025</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      Early Allergen Introduction Plan
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      NIAID-backed protocols for peanut, egg, and common allergen introduction
                    </p>
                    <div className="text-sm text-purple-600 font-semibold">Read more →</div>
                  </div>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Link href="/topics/nutrient-priorities" className="block group">
                  <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nutrition</span>
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">Updated Dec 2024</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      Iron & Nutrient Priorities
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Meeting daily iron requirements and vitamin D supplementation guidelines
                    </p>
                    <div className="text-sm text-purple-600 font-semibold">Read more →</div>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Trust Signals Section */}
        <section className="py-16 px-4 sm:px-8 bg-white">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Trusted, Evidence-Based Content
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Every piece of information is sourced from official health organizations and updated regularly
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Official Guidelines</h3>
                <p className="text-gray-600">
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
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Regularly Updated</h3>
                <p className="text-gray-600">
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
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Transparent Sources</h3>
                <p className="text-gray-600">
                  Every claim linked to peer-reviewed or government sources
                </p>
              </motion.div>
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/trust"
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold text-lg"
              >
                Learn about our content curation process
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Start Your Feeding Journey with Confidence
              </h2>
              <p className="text-xl mb-8 text-purple-100">
                Explore our comprehensive guides, safety rules, and food database
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/foods"
                  className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors"
                >
                  Browse Food Database
                </Link>
                <Link
                  href="/topics"
                  className="px-8 py-4 bg-purple-500/50 backdrop-blur-sm text-white rounded-xl font-semibold text-lg hover:bg-purple-500/70 transition-colors border-2 border-white/30"
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
