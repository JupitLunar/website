'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

interface NewsletterSignupProps {
  variant?: 'default' | 'compact' | 'inline';
  className?: string;
  onSuccess?: () => void;
}

export default function NewsletterSignup({ 
  variant = 'default', 
  className = '',
  onSuccess 
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage('Thank you for subscribing! Check your email for confirmation.');
        setEmail('');
        onSuccess?.();
      } else {
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Stay Updated
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          Get the latest insights on maternal and infant health.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
          <Button
            type="submit"
            size="sm"
            loading={isLoading}
            disabled={!email.trim()}
          >
            Subscribe
          </Button>
        </form>
        {message && (
          <p className={`text-sm mt-2 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`${className}`}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
          <Button
            type="submit"
            loading={isLoading}
            disabled={!email.trim()}
          >
            Subscribe
          </Button>
        </form>
        {message && (
          <p className={`text-sm mt-2 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white ${className}`}
    >
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">
          Stay Informed with Expert Health Insights
        </h2>
        <p className="text-purple-100 mb-6">
          Get weekly updates on maternal and infant health, delivered directly to your inbox.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:outline-none"
              required
            />
          </div>
          <Button
            type="submit"
            variant="secondary"
            size="lg"
            loading={isLoading}
            disabled={!email.trim()}
            className="w-full"
          >
            {isLoading ? 'Subscribing...' : 'Subscribe to Newsletter'}
          </Button>
        </form>
        
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-sm mt-4 ${isSuccess ? 'text-green-200' : 'text-red-200'}`}
          >
            {message}
          </motion.p>
        )}
        
        <p className="text-xs text-purple-200 mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </motion.div>
  );
}

