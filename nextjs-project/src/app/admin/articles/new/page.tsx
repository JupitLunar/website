'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { contentManager } from '@/lib/supabase';
import type { ContentHub, ContentType, Language, HubInfo } from '@/types/content';

export default function NewArticlePage() {
  const router = useRouter();
  const [hubs, setHubs] = useState<HubInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    one_liner: '',
    body_md: '',
    hub: '',
    type: 'explainer' as ContentType,
    lang: 'en' as Language,
    featured_image: '',
    entities: '',
    reading_time: 5,
    region: 'north_america',
    age_range: 'all_ages'
  });

  useEffect(() => {
    loadContentHubs();
  }, []);

  const loadContentHubs = async () => {
    try {
      const hubsData = await contentManager.getContentHubs();
      setHubs(hubsData);
      if (hubsData.length > 0) {
        setFormData(prev => ({ ...prev, hub: hubsData[0].id }));
      }
    } catch (error) {
      console.error('Error loading content hubs:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert entities string to array
      const entitiesArray = formData.entities
        .split(',')
        .map(entity => entity.trim())
        .filter(entity => entity.length > 0);

      const articleData = {
        ...formData,
        entities: entitiesArray,
        status: 'draft',
        date_published: new Date().toISOString(),
        date_modified: new Date().toISOString()
      };

      // TODO: Implement article creation via API
      console.log('Article data to submit:', articleData);
      
      // For now, just redirect back to admin
      router.push('/admin');
      
    } catch (error) {
      console.error('Error creating article:', error);
      alert('Failed to create article. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F6FC] to-[#EAE6F8]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Create New Article</h1>
            </div>
            <button
              type="submit"
              form="article-form"
              disabled={loading}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Creating...' : 'Create Article'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <form id="article-form" onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
              
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter article title"
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="article-url-slug"
                />
              </div>

              <div>
                <label htmlFor="one_liner" className="block text-sm font-medium text-gray-700 mb-2">
                  One-liner Summary *
                </label>
                <textarea
                  id="one_liner"
                  name="one_liner"
                  value={formData.one_liner}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Brief summary of the article"
                />
              </div>
            </div>

            {/* Content Settings */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Content Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="hub" className="block text-sm font-medium text-gray-700 mb-2">
                    Content Hub *
                  </label>
                  <select
                    id="hub"
                    name="hub"
                    value={formData.hub}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select a content hub</option>
                    {hubs.map((hub) => (
                      <option key={hub.id} value={hub.id}>
                        {hub.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Content Type *
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="explainer">Explainer</option>
                    <option value="howto">How-To</option>
                    <option value="recipe">Recipe</option>
                    <option value="faq">FAQ</option>
                    <option value="research">Research</option>
                    <option value="news">News</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="lang" className="block text-sm font-medium text-gray-700 mb-2">
                    Language *
                  </label>
                  <select
                    id="lang"
                    name="lang"
                    value={formData.lang}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="zh">Chinese</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="reading_time" className="block text-sm font-medium text-gray-700 mb-2">
                    Reading Time (minutes)
                  </label>
                  <input
                    type="number"
                    id="reading_time"
                    name="reading_time"
                    value={formData.reading_time}
                    onChange={handleInputChange}
                    min="1"
                    max="60"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Content</h2>
              
              <div>
                <label htmlFor="body_md" className="block text-sm font-medium text-gray-700 mb-2">
                  Article Content (Markdown) *
                </label>
                <textarea
                  id="body_md"
                  name="body_md"
                  value={formData.body_md}
                  onChange={handleInputChange}
                  required
                  rows={15}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                  placeholder="Write your article content in Markdown format..."
                />
              </div>
            </div>

            {/* Additional Settings */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Additional Settings</h2>
              
              <div>
                <label htmlFor="entities" className="block text-sm font-medium text-gray-700 mb-2">
                  Key Entities (comma-separated)
                </label>
                <input
                  type="text"
                  id="entities"
                  name="entities"
                  value={formData.entities}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="pregnancy, nutrition, health, baby"
                />
              </div>

              <div>
                <label htmlFor="featured_image" className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  id="featured_image"
                  name="featured_image"
                  value={formData.featured_image}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                    Target Region
                  </label>
                  <select
                    id="region"
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="north_america">North America</option>
                    <option value="europe">Europe</option>
                    <option value="asia">Asia</option>
                    <option value="global">Global</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="age_range" className="block text-sm font-medium text-gray-700 mb-2">
                    Target Age Range
                  </label>
                  <select
                    id="age_range"
                    name="age_range"
                    value={formData.age_range}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all_ages">All Ages</option>
                    <option value="pregnancy">Pregnancy</option>
                    <option value="newborn">Newborn (0-3 months)</option>
                    <option value="infant">Infant (3-12 months)</option>
                    <option value="toddler">Toddler (1-3 years)</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}



