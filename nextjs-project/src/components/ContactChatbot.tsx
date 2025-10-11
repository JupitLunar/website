'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactData {
  name: string;
  email: string;
  message: string;
  contactType: 'support' | 'enterprise';
}

interface Message {
  type: 'system' | 'user';
  content: string;
  timestamp?: Date;
}

export default function ContactChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [contactData, setContactData] = useState<ContactData>({
    name: '',
    email: '',
    message: '',
    contactType: 'support'
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && currentStep === 0) {
      // Initialize conversation when chatbot opens
      setMessages([
        {
          type: 'system',
          content: '👋 Hi! I\'m here to help you get in touch with our team. How can we assist you today?',
          timestamp: new Date()
        },
        {
          type: 'system',
          content: 'Please choose your inquiry type:',
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, currentStep]);

  const handleContactTypeSelect = (type: 'support' | 'enterprise') => {
    setContactData(prev => ({ ...prev, contactType: type }));
    
    const typeMessage = type === 'enterprise' 
      ? '🏢 Enterprise Partnership - Perfect! Let\'s collect some information to connect you with our business development team.'
      : '💬 General Support - Great! Let\'s get your details so we can help you out.';
    
    setMessages(prev => [
      ...prev,
      {
        type: 'user',
        content: type === 'enterprise' ? 'Enterprise Partnership' : 'General Support',
        timestamp: new Date()
      },
      {
        type: 'system',
        content: typeMessage,
        timestamp: new Date()
      },
      {
        type: 'system',
        content: 'What\'s your name?',
        timestamp: new Date()
      }
    ]);
    setCurrentStep(1);
  };

  const handleInputSubmit = (value: string) => {
    if (!value.trim()) return;

    switch (currentStep) {
      case 1: // Name
        setContactData(prev => ({ ...prev, name: value.trim() }));
        setMessages(prev => [
          ...prev,
          { type: 'user', content: value.trim(), timestamp: new Date() },
          { type: 'system', content: 'Nice to meet you! What\'s your email address?', timestamp: new Date() }
        ]);
        setCurrentStep(2);
        break;

      case 2: // Email
        if (!isValidEmail(value)) {
          setError('Please enter a valid email address');
          return;
        }
        setContactData(prev => ({ ...prev, email: value.trim() }));
        setError('');
        setMessages(prev => [
          ...prev,
          { type: 'user', content: value.trim(), timestamp: new Date() },
          { type: 'system', content: 'Perfect! Please tell us more about your inquiry or how we can help you:', timestamp: new Date() }
        ]);
        setCurrentStep(3);
        break;

      case 3: // Message
        setContactData(prev => ({ ...prev, message: value.trim() }));
        setMessages(prev => [
          ...prev,
          { type: 'user', content: value.trim(), timestamp: new Date() },
          { type: 'system', content: 'Thank you! Let me submit your information now...', timestamp: new Date() }
        ]);
        handleSubmit();
        break;
    }
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [
          ...prev,
          {
            type: 'system',
            content: '✅ Thank you! Your message has been submitted successfully. Our team will get back to you soon!',
            timestamp: new Date()
          },
          {
            type: 'system',
            content: 'Is there anything else we can help you with?',
            timestamp: new Date()
          }
        ]);
        setIsSubmitted(true);
      } else {
        setMessages(prev => [
          ...prev,
          {
            type: 'system',
            content: '❌ Sorry, there was an error submitting your message. Please try again or contact us directly.',
            timestamp: new Date()
          }
        ]);
      }
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          type: 'system',
          content: '❌ Network error. Please check your connection and try again.',
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChatbot = () => {
    setIsOpen(false);
    setTimeout(() => {
      setCurrentStep(0);
      setContactData({ name: '', email: '', message: '', contactType: 'support' });
      setMessages([]);
      setError('');
      setIsSubmitted(false);
      setIsLoading(false);
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent, value: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (currentStep >= 1) {
        handleInputSubmit(value);
      }
    }
  };

  const renderInput = () => {
    if (currentStep === 0 || isLoading || isSubmitted) return null;

    const placeholders = {
      1: 'Enter your name',
      2: 'Enter your email address',
      3: 'Tell us more about your inquiry...'
    };

    return (
      <div className="p-4 border-t border-gray-200">
        {error && (
          <p className="text-red-500 text-sm mb-2">{error}</p>
        )}
        <div className="flex gap-2">
          <input
            type={currentStep === 2 ? 'email' : 'text'}
            placeholder={placeholders[currentStep as keyof typeof placeholders]}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => handleKeyPress(e, e.currentTarget.value)}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                handleInputSubmit(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
          />
          <button
            onClick={(e) => {
              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
              handleInputSubmit(input.value);
              input.value = '';
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
            aria-label="Open contact chatbot"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Contact Support</h3>
                  <p className="text-xs text-gray-500">We're here to help</p>
                </div>
              </div>
              <button
                onClick={resetChatbot}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                aria-label="Close chatbot"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}

              {/* Contact Type Selection */}
              {currentStep === 0 && (
                <div className="space-y-2">
                  <button
                    onClick={() => handleContactTypeSelect('support')}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💬</span>
                      <div>
                        <p className="font-medium">General Support</p>
                        <p className="text-sm text-gray-500">Questions, help, or feedback</p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleContactTypeSelect('enterprise')}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🏢</span>
                      <div>
                        <p className="font-medium">Enterprise Partnership</p>
                        <p className="text-sm text-gray-500">Business collaboration & partnerships</p>
                      </div>
                    </div>
                  </button>
                </div>
              )}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            {renderInput()}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
