'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FoodCard from '@/components/FoodCard';
import FoodFilters, { FilterOptions } from '@/components/FoodFilters';
import { foodManager } from '@/lib/supabase';

interface Food {
  id: string;
  slug: string;
  name: string;
  age_range: string[];
  risk_level: 'none' | 'low' | 'medium' | 'high';
  nutrients_focus: string[];
  media: any[];
}

export default function FoodsPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<FilterOptions>({
    ageRange: [],
    riskLevel: [],
    feedingMethods: [],
    nutrients: []
  });

  // Fetch foods based on filters
  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      try {
        const filters = {
          searchQuery: searchQuery || undefined,
          ageRange: selectedFilters.ageRange.length > 0 ? selectedFilters.ageRange[0] : undefined,
          riskLevel: selectedFilters.riskLevel.length > 0 ? selectedFilters.riskLevel : undefined,
          feedingMethods: selectedFilters.feedingMethods.length > 0 ? selectedFilters.feedingMethods : undefined,
          nutrients: selectedFilters.nutrients.length > 0 ? selectedFilters.nutrients : undefined
        };

        const data = await foodManager.getFoods(filters, 100, 0);
        setFoods(data || []);
      } catch (error) {
        console.error('Error fetching foods:', error);
        setFoods([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
      fetchFoods();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedFilters]);

  const handleFilterChange = (filterType: keyof FilterOptions, value: string) => {
    setSelectedFilters(prev => {
      const currentValues = prev[filterType];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [filterType]: newValues
      };
    });
  };

  const handleClearFilters = () => {
    setSelectedFilters({
      ageRange: [],
      riskLevel: [],
      feedingMethods: [],
      nutrients: []
    });
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Section - Matching Home Page Style */}
      <section className="relative overflow-hidden py-24 px-4 sm:px-8">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(148,163,184,0.05),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(167,139,250,0.05),transparent_50%)]"></div>

        <div className="container mx-auto max-w-7xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-100 to-violet-100 rounded-3xl mb-8 shadow-sm"
            >
              <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-light text-slate-800 mb-6 tracking-tight"
            >
              Food Database
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-500 mb-4 max-w-3xl mx-auto leading-relaxed font-light"
            >
              Evidence-based feeding guides for your baby's journey
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap justify-center gap-8 mb-12 text-sm text-slate-400"
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                <span>30+ Foods</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span>Age-Specific Guides</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Safety Assessed</span>
              </div>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search foods... (e.g., 'avocado', 'iron-rich')"
                  className="w-full px-6 py-4 pr-14 text-lg rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent shadow-sm transition-all"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 sm:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block lg:w-80 flex-shrink-0">
              <div className="sticky top-24">
                <FoodFilters
                  selectedFilters={selectedFilters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
              </div>
            </aside>

            {/* Mobile Filters Toggle */}
            <div className="lg:hidden mb-6">
              <details className="premium-card group">
                <summary className="font-light text-slate-700 cursor-pointer flex items-center justify-between p-4">
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span className="font-medium">Filters</span>
                  </span>
                  <svg className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-4 px-4 pb-4">
                  <FoodFilters
                    selectedFilters={selectedFilters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                  />
                </div>
              </details>
            </div>

            {/* Food Grid */}
            <main className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-light text-slate-700">
                  {loading ? (
                    <span className="text-slate-400">Loading...</span>
                  ) : (
                    <>
                      <span className="font-medium text-slate-800">{foods.length}</span>{' '}
                      <span className="text-slate-500">Food{foods.length !== 1 ? 's' : ''}</span>
                      {searchQuery && <span className="text-slate-400 ml-2">matching "{searchQuery}"</span>}
                    </>
                  )}
                </h2>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="premium-card h-80 animate-pulse">
                      <div className="h-48 bg-slate-100 rounded-t-2xl"></div>
                      <div className="p-6 space-y-3">
                        <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                        <div className="h-3 bg-slate-100 rounded w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!loading && foods.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="premium-card p-12 text-center"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-violet-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-light text-slate-700 mb-2">No foods found</h3>
                  <p className="text-slate-500 mb-6 font-light">
                    Try adjusting your filters or search query
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="btn-secondary"
                  >
                    Clear All Filters
                  </button>
                </motion.div>
              )}

              {/* Food Grid */}
              {!loading && foods.length > 0 && (
                <motion.div
                  className="grid md:grid-cols-2 xl:grid-cols-3 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {foods.map((food, index) => (
                    <motion.div
                      key={food.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <FoodCard
                        slug={food.slug}
                        name={food.name}
                        ageRange={food.age_range || []}
                        riskLevel={food.risk_level}
                        nutrientsFocus={food.nutrients_focus}
                        imageUrl={food.media && food.media.length > 0 ? food.media[0].url : undefined}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </main>
          </div>
        </div>
      </section>

      {/* Info Section - Matching Home Page Style */}
      <section className="py-24 px-4 sm:px-8 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light text-slate-800 mb-4 tracking-tight">
              How to Use This Database
            </h2>
            <p className="text-xl text-slate-500 font-light max-w-2xl mx-auto">
              Evidence-based guidance from CDC, AAP, and Health Canada
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="premium-card group hover:scale-105 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-violet-100 rounded-2xl flex items-center justify-center mb-6 group-hover:from-slate-200 group-hover:to-violet-200 transition-colors shadow-sm">
                <span className="text-3xl">1️⃣</span>
              </div>
              <h3 className="text-xl font-light text-slate-700 mb-3">Search by Food</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-light">
                Use the search bar to find specific foods or browse by category
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="premium-card group hover:scale-105 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:from-slate-200 group-hover:to-indigo-200 transition-colors shadow-sm">
                <span className="text-3xl">2️⃣</span>
              </div>
              <h3 className="text-xl font-light text-slate-700 mb-3">Filter by Age & Risk</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-light">
                Use filters to find age-appropriate foods with your preferred risk level
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="premium-card group hover:scale-105 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:from-slate-200 group-hover:to-purple-200 transition-colors shadow-sm">
                <span className="text-3xl">3️⃣</span>
              </div>
              <h3 className="text-xl font-light text-slate-700 mb-3">View Preparation Guides</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-light">
                Click on any food to see age-specific cutting and preparation instructions
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
