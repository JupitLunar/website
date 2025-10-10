'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-elegant">
      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-8 overflow-hidden bg-gradient-to-br from-slate-50/20 via-white to-violet-50/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-100/10 to-purple-100/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-indigo-100/10 to-violet-100/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-gradient-to-r from-slate-50/90 to-violet-50/60 backdrop-blur-sm rounded-full shadow-sm border border-slate-200/30"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-slate-300 to-violet-300 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <span className="text-sm font-light text-slate-500">About JupitLunar</span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-light text-slate-500 mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Empowering Every Mom
              <br />
              <span className="bg-gradient-to-r from-slate-400 via-violet-400 to-slate-500 bg-clip-text text-transparent">
                From Mom to Moms
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-slate-500 mb-8 max-w-4xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              At JupitLunar, we believe every mother deserves access to reliable, evidence-based information
              to make confident decisions for her family's health and wellbeing.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-light text-slate-500 mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
              To help every mom navigate the journey of motherhood with confidence, backed by
              trustworthy information and compassionate support
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="premium-card group hover:scale-105 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-violet-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-slate-300 group-hover:to-violet-300 transition-colors shadow-sm">
                <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-light text-slate-500 mb-3 text-xl text-center">Evidence-Based Knowledge</h3>
              <p className="text-sm text-slate-400 leading-relaxed text-center">
                We curate and synthesize information from the world's leading health organizations
                and peer-reviewed research to provide accurate, actionable guidance.
              </p>
            </motion.div>

            <motion.div
              className="premium-card group hover:scale-105 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-indigo-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-slate-300 group-hover:to-indigo-300 transition-colors shadow-sm">
                <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-light text-slate-500 mb-3 text-xl text-center">Community-Driven</h3>
              <p className="text-sm text-slate-400 leading-relaxed text-center">
                Built by mothers, for mothers. We understand the challenges because we've lived them,
                and we're committed to supporting every step of your journey.
              </p>
            </motion.div>

            <motion.div
              className="premium-card group hover:scale-105 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-slate-300 group-hover:to-purple-300 transition-colors shadow-sm">
                <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-light text-slate-500 mb-3 text-xl text-center">Innovation with Care</h3>
              <p className="text-sm text-slate-400 leading-relaxed text-center">
                We leverage AI technology to make expert knowledge accessible and personalized,
                while maintaining the highest standards of safety and accuracy.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 sm:px-8 bg-gradient-to-br from-violet-50/30 to-purple-50/20">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-light text-slate-500 mb-8 text-center">
              Our Story
            </h2>

            <div className="space-y-6 text-lg text-slate-400 leading-relaxed font-light">
              <p>
                JupitLunar was founded on a simple yet powerful belief: that every mother deserves access
                to reliable, evidence-based information to guide her through one of life's most important journeys.
              </p>

              <p>
                As mothers ourselves, we experienced firsthand the overwhelming amount of conflicting information
                available online, the anxiety of making crucial decisions about our children's health, and the
                isolation that can come with modern motherhood. We knew there had to be a better way.
              </p>

              <p>
                That's why we created JupitLunar—a comprehensive platform that combines the latest research
                from trusted health organizations with AI-powered personalization to provide mothers with
                clear, actionable guidance tailored to their unique situations.
              </p>

              <p>
                Our platform synthesizes information from leading health authorities including the CDC,
                American Academy of Pediatrics, WHO, Health Canada, and the Canadian Paediatric Society.
                We continuously update our content to reflect the latest research and guidelines, ensuring
                that you always have access to the most current, evidence-based information.
              </p>

              <p>
                But we're more than just a knowledge base. We're a community of mothers supporting mothers,
                sharing experiences, and empowering each other to make confident, informed decisions.
                From pregnancy through early childhood, we're here to support you every step of the way.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-light text-slate-500 mb-6">
              Our Core Values
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              className="bg-gradient-to-br from-slate-50 to-violet-50/30 rounded-3xl p-8 border border-slate-100"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-violet-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-light text-slate-500 mb-2">Trustworthy</h3>
                  <p className="text-slate-400 leading-relaxed font-light">
                    We source all information from official health organizations and peer-reviewed research,
                    with transparent citations for every recommendation.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-3xl p-8 border border-slate-100"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-indigo-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-light text-slate-500 mb-2">Compassionate</h3>
                  <p className="text-slate-400 leading-relaxed font-light">
                    We understand that motherhood is both beautiful and challenging. Our content
                    is delivered with empathy, support, and without judgment.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-slate-50 to-purple-50/30 rounded-3xl p-8 border border-slate-100"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-purple-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-light text-slate-500 mb-2">Accessible</h3>
                  <p className="text-slate-400 leading-relaxed font-light">
                    We make complex medical information easy to understand and apply, so every
                    mother can access the knowledge she needs, when she needs it.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-slate-50 to-violet-50/30 rounded-3xl p-8 border border-slate-100"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-violet-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-light text-slate-500 mb-2">Continuously Improving</h3>
                  <p className="text-slate-400 leading-relaxed font-light">
                    We regularly update our content to reflect the latest research and listen
                    to our community to continually enhance our platform.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Philosophy Section */}
      <section className="py-20 px-4 sm:px-8 bg-gradient-to-br from-slate-50/50 to-indigo-50/30">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-light text-slate-500 mb-8">
              From Mom to Moms
            </h2>

            <p className="text-xl text-slate-400 leading-relaxed font-light max-w-3xl mx-auto mb-8">
              At JupitLunar, we're not just building technology—we're building a community.
              Our team combines expertise in healthcare, technology, and most importantly,
              real-world motherhood experience.
            </p>

            <p className="text-lg text-slate-400 leading-relaxed font-light max-w-3xl mx-auto">
              We believe in the power of mothers supporting mothers, of sharing knowledge and experience
              to lift each other up. Every feature we build, every piece of content we create, is guided
              by one simple question: "Will this help a mother feel more confident and supported?"
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-8 bg-white">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-light text-slate-500 mb-6">
              Get in Touch
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-slate-50 to-violet-50/30 rounded-3xl p-8 md:p-12 border border-slate-200"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-light text-slate-500 mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-violet-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Email</p>
                      <a href="mailto:support@momaiagent.com" className="text-slate-600 hover:text-violet-500 transition-colors">
                        support@momaiagent.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-indigo-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Location</p>
                      <p className="text-slate-600">Edmonton, AB, Canada</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-purple-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Response Time</p>
                      <p className="text-slate-600">Within 48 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-light text-slate-500 mb-6">Quick Links</h3>
                <div className="space-y-3">
                  <Link href="/privacy" className="flex items-center gap-2 text-slate-600 hover:text-violet-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Privacy Policy
                  </Link>
                  <Link href="/disclaimer" className="flex items-center gap-2 text-slate-600 hover:text-violet-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Medical Disclaimer
                  </Link>
                  <Link href="/trust" className="flex items-center gap-2 text-slate-600 hover:text-violet-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Trust & Methods
                  </Link>
                  <Link href="/faq" className="flex items-center gap-2 text-slate-600 hover:text-violet-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    FAQ
                  </Link>
                </div>
              </div>
            </div>
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
              Join Our Community
            </h2>
            <p className="text-xl mb-12 text-slate-100 max-w-2xl mx-auto font-light">
              Discover trusted, evidence-based guidance for your maternal and infant care journey
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/topics"
                className="px-10 py-5 bg-white text-slate-500 rounded-2xl font-light text-xl hover:bg-slate-50 transition-colors shadow-sm"
              >
                Explore Knowledge Base
              </Link>
              <button
                onClick={() => {
                  const element = document.getElementById('ai-assistant-section');
                  if (element) {
                    window.location.href = '/#ai-assistant-section';
                  } else {
                    window.location.href = '/';
                  }
                }}
                className="px-10 py-5 bg-slate-500/50 backdrop-blur-sm text-white rounded-2xl font-light text-xl hover:bg-slate-500/70 transition-colors border-2 border-white/30"
              >
                Ask MomAI Agent
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
