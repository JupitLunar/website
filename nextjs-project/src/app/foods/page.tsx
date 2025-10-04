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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 px-4 sm:px-8">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h1 className="text-4xl md:text-5xl font-bold">
                Food Database
              </h1>
            </div>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl">
              400+ foods with age-specific preparation guides, choking risk assessments, and nutritional information
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search foods... (e.g., 'avocado', 'iron-rich')"
                  className="w-full px-6 py-4 pr-14 text-lg rounded-2xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 sm:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block lg:w-80 flex-shrink-0">
              <FoodFilters
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </aside>

            {/* Mobile Filters Toggle */}
            <div className="lg:hidden mb-6">
              <details className="bg-white rounded-xl border-2 border-gray-100 p-4">
                <summary className="font-bold text-gray-900 cursor-pointer flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filters
                  </span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-4">
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {loading ? (
                    'Loading...'
                  ) : (
                    <>
                      {foods.length} Food{foods.length !== 1 ? 's' : ''}
                      {searchQuery && <span className="text-purple-600"> matching "{searchQuery}"</span>}
                    </>
                  )}
                </h2>

                {/* Sort Options (future enhancement) */}
                {/* <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>Sort: A-Z</option>
                  <option>Sort: Age</option>
                  <option>Sort: Risk Level</option>
                </select> */}
              </div>

              {/* Loading State */}
              {loading && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl border-2 border-gray-100 h-80 animate-pulse">
                      <div className="h-48 bg-gray-200"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!loading && foods.length === 0 && (
                <div className="bg-white rounded-xl border-2 border-gray-100 p-12 text-center">
                  <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No foods found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters or search query
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
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

              {/* Load More (future enhancement) */}
              {/* {!loading && foods.length > 0 && foods.length % 50 === 0 && (
                <div className="mt-12 text-center">
                  <button className="px-8 py-4 bg-white text-purple-600 border-2 border-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-colors">
                    Load More Foods
                  </button>
                </div>
              )} */}
            </main>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 px-4 sm:px-8 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How to Use This Database
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Our food database is curated from CDC, AAP, and Health Canada guidelines to help you safely introduce foods to your baby.
          </p>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">1️⃣</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Search by Food</h3>
              <p className="text-gray-600 text-sm">
                Use the search bar to find specific foods or browse by category
              </p>
            </div>

            <div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">2️⃣</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Filter by Age & Risk</h3>
              <p className="text-gray-600 text-sm">
                Use filters to find age-appropriate foods with your preferred risk level
              </p>
            </div>

            <div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">3️⃣</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">View Preparation Guides</h3>
              <p className="text-gray-600 text-sm">
                Click on any food to see age-specific cutting and preparation instructions
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
