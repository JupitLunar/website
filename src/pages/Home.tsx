import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import CenteredContainer from '../components/CenteredContainer';
import { createClient } from '@supabase/supabase-js';

// 使用正确的 Assets 目录路径（大写）
const logoImage = require('../Assets/Logo.png');
const IMG_3939 = require('../Assets/home.png');
const IMG_3940 = require('../Assets/task.png');
const IMG_3941 = require('../Assets/summary.png');
const IMG_3942 = require('../Assets/event.png');
const screenshotImage = require('../Assets/sunset.png');
const screenshotStory = require('../Assets/story.png');

// 使用环境变量初始化 supabase client
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL as string,
  process.env.REACT_APP_SUPABASE_ANON_KEY as string
);

function Home() {
  const [email, setEmail] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  // 加入等待名单
  async function submitWaitlist(email: string) {
    const { data, error } = await supabase.from('waitlist_users').insert([
      { email }
    ]);
    if (error) {
      console.error('Submission error:', error);
      alert('Submission failed. Please try again later.');
    } else {
      alert('Thank you for joining the waitlist!');
      console.log('Success:', data);
    }
  }

  // 提交联系表单
  async function submitContact(email: string, message: string) {
    const { data, error } = await supabase.from('user_feedback').insert([
      { email, message }
    ]);
    if (error) {
      console.error('Contact submission error:', error);
      alert('Submission failed. Please try again later.');
    } else {
      alert('Thank you for your feedback!');
      console.log('Contact success:', data);
    }
  }

  // 修改 handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitWaitlist(email);
  };

  // 修改 handleContactSubmit
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitContact(contactForm.email, contactForm.message);
    setContactForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F6FC] to-[#EAE6F8] relative overflow-hidden text-center">
      <Header />
      
      {/* Hero Section */}
      <section id="home" className="pt-24 pb-12 relative overflow-hidden">
        <CenteredContainer className="container mx-auto px-6">
          <div className="w-full px-8 mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center justify-items-center">
              <CenteredContainer className="space-y-6 max-w-2xl mx-auto">
                <div className="space-y-4">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-tight">
                    <span className="whitespace-nowrap text-gray-800 block">Motherhood is complex</span>
                    <div className="h-2"></div>
                    <span className="whitespace-nowrap bg-gradient-to-r from-indigo-500/80 to-purple-500/80 bg-clip-text text-transparent block">
                      Mom AI is here to help
                    </span>
                  </h1>
                  <div className="h-2"></div>
                  <div className="space-y-2 max-w-2xl mx-auto">
                    <p className="text-base text-gray-600 italic">
                      Sleepless nights, endless worries, constant multitasking—we get it.
                    </p>
                    <p className="text-base text-gray-600 italic">
                      Let AI help you manage tasks, understand your baby, and care for yourself.
                    </p>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mt-24 mx-auto w-full items-center justify-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Get early access"
                    className="flex-1 px-6 py-3 text-base rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all duration-300 text-center w-full"
                    required
                  />
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl text-base font-medium shadow-sm hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 whitespace-nowrap text-center w-full sm:w-auto"
                  >
                    Join Beta
                  </button>
                </form>
              </CenteredContainer>

              {/* Hero Section Image */}
              <div className="relative flex items-center justify-center h-full w-full mt-12">
                <div className="relative z-10 w-full max-w-xs sm:max-w-md md:max-w-lg aspect-[4/3] mx-auto overflow-hidden">
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ 
                      opacity: 1, 
                      y: 0,
                      transition: {
                        type: "spring",
                        bounce: 0.4,
                        duration: 1.2
                      }
                    }}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    <motion.div 
                      className="w-full h-full overflow-hidden rounded-lg flex items-center justify-center transform scale-100"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <img 
                        src={screenshotImage}
                        alt="AI Parenting Assistant"
                        className="w-full h-full object-cover object-center max-w-full"
                      />
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </CenteredContainer>
      </section>

      {/* Features Section */}
      <section id="features" className="pt-0 pb-8 bg-white text-center">
        <div className="container mx-auto px-6 flex flex-col items-center">
          <div className="max-w-full mx-auto space-y-0 w-full flex flex-col items-center">
            {[
              {
                title: "Daily Dashboard",
                pain: <em className="text-gray-600 italic">"What does my baby need now? Did I sleep enough? What should I do next?" — overwhelmed moms face constant overload.</em>,
                solution: "Real-time dashboard for both baby & mom, with gentle nudges and personalized recommendations.",
                tech: [
                  'Gentle nudges like "You deserve extra rest" generated by Emotion Agent',
                  'Backed by HealthKit sync + LLM-triggered recommendations'
                ],
                summary: "Built for empathy. Trained on real experience.",
                image: IMG_3939,
                imagePosition: "left",
              },
              {
                title: "Smart Insights",
                pain: <em className="text-gray-600 block text-left">"I log everything—feeds, diapers, sleep—but still feel lost. I don't know if my baby's doing well, or if I'm okay."</em>,
                solution: "MomAI connects the dots—turning your manual logs and health signals into clear, personalized wellness summaries.",
                tech: [
                  'LLM-generated insights',
                  'Time-series trend analysis',
                  'HealthKit integration',
                  'Multi-agent data fusion'
                ],
                summary: "Smart summaries for moms.",
                image: IMG_3941,
                imagePosition: "right",
              },
              {
                title: "Task Assistant",
                pain: <em className="text-gray-600">"There's too much to do—and I can't even think straight. I forget things, or do them too late."</em>,
                solution: "MomAI plans your day for you. It generates and prioritizes tasks based on your energy, baby's state, and what truly matters.",
                tech: [
                  "LangGraph multi-agent planner",
                  "Context-aware task generation",
                  "Baby + mom state fusion",
                  "Adaptive to time, fatigue, and routine"
                ],
                summary: "AI that gets things done.",
                image: IMG_3940,
                imagePosition: "left",
              },
              {
                title: "Activity Planner",
                pain: <em className="text-gray-600 block text-left">"I want to do more than just survive the day, but I don't have the time or energy to search for things to do with my baby."</em>,
                solution: "MomAI finds enriching, age-appropriate events near you—so you can connect, explore, and create memories without the mental load.",
                tech: [
                  "Semantic search engine",
                  "Location-based filtering",
                  "Baby age & interest matching",
                  "Personalized event curation"
                ],
                summary: "Find joy in every moment.",
                image: IMG_3942,
                imagePosition: "right",
              }
            ].map((feature, index) => {
              let scaleClass = "scale-100";
              if (feature.title === "Daily Dashboard") scaleClass = "scale-[0.7]";
              else if (feature.title === "Smart Insights") scaleClass = "scale-[0.9]";
              else if (feature.title === "Task Assistant") scaleClass = "scale-[0.9]";
              else if (feature.title === "Activity Planner") scaleClass = "scale-[0.7]";

              return (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row gap-4 items-center justify-center w-full ${
                    feature.imagePosition === 'right' ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  <motion.div 
                    className="w-full max-w-xs sm:max-w-md md:max-w-lg flex justify-center items-center"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ 
                      opacity: 1, 
                      x: 0,
                      transition: {
                        type: "spring",
                        bounce: 0.4,
                        duration: 1.2
                      }
                    }}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    <div className={`transform ${scaleClass} origin-center w-full flex justify-center items-center`}>
                      <motion.div 
                        className="rounded-lg overflow-hidden w-full flex justify-center items-center"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <img 
                          src={feature.image} 
                          alt={feature.title}
                          className="w-full h-full object-cover max-w-full"
                        />
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    className={`w-full flex flex-col text-left space-y-4 text-lg ${
                      feature.title === "Smart Insights" || feature.title === "Activity Planner" ? 'md:pl-16' : ''
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-3xl font-bold mb-2 text-center w-full">{feature.title}</h3>
                    <div className="text-gray-600 italic">{feature.pain}</div>
                    <div>
                      <div className="text-indigo-600 font-semibold mb-1">Solution:</div>
                      <div className="text-gray-800">{feature.solution}</div>
                    </div>
                    <div>
                      <div className="text-indigo-600 font-semibold mb-1">Tech:</div>
                      <ul className="space-y-1">
                        {feature.tech.map((point, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-indigo-500 mr-2">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-indigo-700 font-medium mt-2 italic text-xl">{feature.summary}</div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-12 bg-gray-50 text-center">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-indigo-200 to-purple-200 p-[2px]">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white">
                        <img 
                          src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                          alt="Sarah" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Sarah Chen</h4>
                    <p className="text-sm text-gray-500">First-time mom, Product Designer</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex text-amber-400">
                    {"★★★★★".split("").map((star, i) => (
                      <span key={i}>{star}</span>
                    ))}
                  </div>
                  <p className="text-gray-600">
                    "From sleepless anxiety to peaceful nights, MomAI has been like having an experienced mentor by my side. It's incredible how it understands exactly what I need, when I need it."
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-indigo-200 to-purple-200 p-[2px]">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white">
                        <img 
                          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                          alt="Emily" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Emily Zchi</h4>
                    <p className="text-sm text-gray-500">Mom of two, Software Engineer</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex text-amber-400">
                    {"★★★★★".split("").map((star, i) => (
                      <span key={i}>{star}</span>
                    ))}
                  </div>
                  <p className="text-gray-600">
                    "What amazes me is how it truly understands both me and my babies. It's not just an AI, it's become my trusted companion through every milestone and challenge."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Inside Section */}
      <section id="ai-inside" className="py-12 bg-white text-center">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-medium mb-4">AI Inside</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Built with state-of-the-art AI for motherhood, combining advanced technology with deep empathy.
              </p>
            </div>

            {/* Core Features */}
            <div className="grid grid-cols-1 gap-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl p-8 shadow-sm flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mb-4 transform rotate-12">
                    <span className="text-2xl transform -rotate-12">✨</span>
                  </div>
                  <h3 className="text-lg font-medium mb-3 text-gray-900">Multi-Agent System</h3>
                  <p className="text-gray-600">
                    Powered by LangGraph with specialized agents for emotional support, baby analysis, and health monitoring
                  </p>
                </div>

                <div className="bg-white rounded-xl p-8 shadow-sm flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mb-4 transform -rotate-12">
                    <span className="text-2xl transform rotate-12">🌟</span>
                  </div>
                  <h3 className="text-lg font-medium mb-3 text-gray-900">Real-time Analysis</h3>
                  <p className="text-gray-600">
                    Continuous monitoring of baby patterns and maternal well-being through advanced AI processing
                  </p>
                </div>

                <div className="bg-white rounded-xl p-8 shadow-sm flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">💫</span>
                  </div>
                  <h3 className="text-lg font-medium mb-3 text-gray-900">Emotional Support</h3>
                  <p className="text-gray-600">
                    Personalized guidance with postpartum sensitivity, adapting to your unique journey
                  </p>
                </div>
              </div>

              {/* Detailed Features */}
              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div className="bg-white rounded-xl p-8 shadow-sm">
                  <h3 className="text-xl font-medium mb-6 text-gray-900 text-left">Smart Technology</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-4 mt-1">•</span>
                      <span className="text-gray-600">Fine-tuned LLMs for maternal and infant care</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-4 mt-1">•</span>
                      <span className="text-gray-600">HealthKit integration for vital signs monitoring</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-4 mt-1">•</span>
                      <span className="text-gray-600">Advanced pattern recognition for baby behavior</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-4 mt-1">•</span>
                      <span className="text-gray-600">Adaptive learning from daily interactions</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-8 shadow-sm">
                  <h3 className="text-xl font-medium mb-6 text-gray-900 text-left">Key Benefits</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-4 mt-1">•</span>
                      <span className="text-gray-600">Stress detection through HRV analysis</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-4 mt-1">•</span>
                      <span className="text-gray-600">Personalized daily task planning</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-4 mt-1">•</span>
                      <span className="text-gray-600">Intelligent sleep and feeding insights</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-4 mt-1">•</span>
                      <span className="text-gray-600">24/7 emotional companionship</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom Quote */}
              <div className="text-center mt-12">
                <p className="text-lg text-gray-600 italic max-w-2xl mx-auto">
                  "Your always-there, never-tired co-pilot through the most precious moments of motherhood."
                </p>
                <div className="mt-6 flex items-center justify-center space-x-4">
                  <div className="flex items-center text-indigo-600">
                    <span className="text-2xl mr-2"></span>
                    <span className="font-medium"></span>
                  </div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <div className="flex items-center text-indigo-600">
                    <span className="text-2xl mr-2"></span>
                    <span className="font-medium"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className="py-12 bg-white text-center">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <motion.div 
                className="w-full md:w-3/5 flex justify-center"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ 
                  opacity: 1, 
                  x: 0,
                  transition: {
                    type: "spring",
                    bounce: 0.4,
                    duration: 1.2
                  }
                }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="w-full max-w-xl mx-auto transform scale-[0.9]">
                  <motion.div 
                    className="rounded-lg overflow-hidden shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <img 
                      src={screenshotStory}
                      alt="Our Story"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </div>
              </motion.div>
              <motion.div 
                className="w-full md:w-3/5 space-y-6 md:px-6 text-left"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-medium text-left">Built by moms, for moms.</h2>
                <div className="space-y-4 text-left">
                  <p className="text-gray-600 text-lg leading-relaxed text-left">
                    JupitLunar understands the invisible workload of motherhood. Our mission? Provide gentle, intelligent support—so you're never alone.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 bg-gradient-to-br from-[#F8F6FC] to-[#EAE6F8] text-center">
        <div className="container mx-auto px-6 flex flex-col items-center">
          <div className="max-w-4xl mx-auto w-full">
            <div className="text-center mb-16 flex flex-col items-center">
              <h2 className="text-3xl font-medium mb-4 text-center">Contact Us</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto text-center">
                Have questions or suggestions? We'd love to hear from you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 justify-items-center">
              {/* Contact Form */}
              <div className="bg-white rounded-xl p-8 shadow-sm w-full">
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="w-full">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all duration-300 text-left"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                      Email
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all duration-300 text-left"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all duration-300 text-left"
                      placeholder="Enter your message"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl text-base font-medium shadow-sm hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
                  >
                    Send Message
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-8 w-full">
                <div className="bg-white rounded-xl p-8 shadow-sm w-full">
                  <h3 className="text-xl font-medium mb-6 text-gray-900 text-left">Contact Information</h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">📧</span>
                      </div>
                      <div className="text-left">
                        <h4 className="font-medium text-gray-900">Email</h4>
                        <p className="text-gray-600">contact@momai.com</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">📱</span>
                      </div>
                      <div className="text-left">
                        <h4 className="font-medium text-gray-900">WeChat Official</h4>
                        <p className="text-gray-600">MomAI</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">🏢</span>
                      </div>
                      <div className="text-left">
                        <h4 className="font-medium text-gray-900">Address</h4>
                        <p className="text-gray-600">Edmonton, Canada</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-gray-50 text-center">
        <div className="container mx-auto px-6 flex flex-col items-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
            <div className="text-sm text-gray-600 text-center w-full md:w-auto">
              © 2024 MomAI. All rights reserved.
            </div>
            <div className="flex gap-6 justify-center w-full md:w-auto">
              <a href="/privacy" className="text-gray-600 hover:text-purple-600 text-center">Privacy Policy</a>
              <a href="/terms" className="text-gray-600 hover:text-purple-600 text-center">Terms of Service</a>
              <a href="mailto:momaiagent@gmail.com" className="text-gray-600 hover:text-purple-600 text-center">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home; 