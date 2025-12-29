import React from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { generateFAQStructuredData } from '@/lib/json-ld';

const FAQ_DATA = [
  {
    question: "When should I start introducing solid foods to my baby?",
    answer: "Most babies are ready for solid foods around 6 months of age. Look for developmental cues like sitting up with support, showing interest in food, and being able to move food from the front to the back of the tongue. Always consult with your pediatrician before starting solids."
  },
  {
    question: "What are the safest first foods for babies?",
    answer: "Iron-rich foods are recommended as first foods, including iron-fortified cereals, pureed meats, and mashed beans. Single-ingredient foods like pureed sweet potato, avocado, or banana are also good options. Avoid honey before 12 months due to botulism risk."
  },
  {
    question: "How do I prevent choking when feeding my baby?",
    answer: "Always supervise your baby during meals, ensure they're sitting upright, and cut foods into appropriate sizes. Avoid hard, round foods like whole grapes or nuts. Foods should be soft enough to 'smoosh' between your fingers. Never leave your baby alone while eating."
  },
  {
    question: "When can I introduce common allergens like peanuts and eggs?",
    answer: "Current guidelines recommend introducing common allergens like peanuts, eggs, and tree nuts between 4-6 months, especially for high-risk infants. Start with small amounts and maintain regular exposure. Always consult your pediatrician, especially if there's a family history of food allergies."
  },
  {
    question: "How much should my baby eat at each meal?",
    answer: "Let your baby's hunger cues guide portion sizes. Start with 1-2 tablespoons of food per meal and gradually increase. Babies typically eat 2-3 meals per day by 8-9 months. Remember that breast milk or formula should remain the primary nutrition source until 12 months."
  },
  {
    question: "What drinks are safe for babies under 12 months?",
    answer: "Breast milk and formula are the only drinks babies need before 12 months. You can offer small amounts of water in a cup starting around 6 months to practice drinking skills. Avoid juice before 12 months, and limit it to 4 ounces per day for toddlers 12-24 months."
  },
  {
    question: "How do I know if my baby is getting enough nutrition?",
    answer: "Signs of adequate nutrition include steady weight gain, wet diapers (6+ per day), alertness, and meeting developmental milestones. Your pediatrician will monitor growth at regular checkups. If you have concerns about your baby's nutrition, consult your healthcare provider."
  },
  {
    question: "What vitamins does my baby need?",
    answer: "Breastfed babies typically need vitamin D supplementation (400 IU daily). Formula-fed babies usually get adequate vitamins from fortified formula. Iron supplementation may be needed for preterm or low birth weight babies. Always consult your pediatrician about specific vitamin needs."
  },
  {
    question: "How do I transition from purees to finger foods?",
    answer: "Start with soft, easily mashed foods around 8-9 months. Offer foods cut into appropriate sizes that your baby can pick up. Gradually increase texture complexity. Always supervise closely and ensure foods are soft enough to gum safely."
  },
  {
    question: "What should I do if my baby refuses to eat?",
    answer: "Food refusal is common and usually temporary. Continue offering a variety of foods without pressure. Maintain regular meal times, model healthy eating, and be patient. If refusal persists or you're concerned about nutrition, consult your pediatrician."
  }
];

export const metadata = {
  title: 'Baby Feeding FAQ | Mom AI Agent',
  description: 'Evidence-informed answers to common baby feeding questions, including solids readiness, safety, allergens, and nutrition.',
  keywords: [
    'baby feeding FAQ', 'infant nutrition questions', 'baby food safety', 
    'when to start baby food', 'baby feeding problems', 'infant feeding guide',
    'baby food introduction', 'toddler nutrition questions', 'baby feeding tips'
  ],
};

export default function FAQPage() {
  const structuredData = generateFAQStructuredData(FAQ_DATA);

  return (
    <>
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gradient-elegant">
        <section className="relative overflow-hidden py-16 px-4 sm:px-8">
          <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-gradient-to-br from-violet-100/40 to-purple-100/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-gradient-to-br from-slate-100/70 to-violet-100/10 blur-3xl"></div>
          <div className="container mx-auto max-w-4xl relative z-10 text-center">
            <p className="uppercase tracking-[0.4em] text-xs text-slate-400 mb-4">FAQ</p>
            <h1 className="text-4xl md:text-5xl font-light text-slate-700 mb-4">
              Baby feeding questions, answered clearly
            </h1>
            <p className="text-lg text-slate-500 max-w-3xl mx-auto font-light">
              Evidence-informed guidance for solids readiness, food safety, allergens, and nutrition based on public health guidance.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="px-4 py-2 rounded-full bg-white/80 border border-slate-200 text-[11px] uppercase tracking-[0.25em] text-slate-400">
                Evidence informed
              </span>
              <Link
                href="/topics"
                className="px-4 py-2 rounded-full bg-white/80 border border-slate-200 text-[11px] uppercase tracking-[0.25em] text-slate-500 hover:text-violet-500 transition-colors"
              >
                Explore Topics
              </Link>
              <Link
                href="/trust"
                className="px-4 py-2 rounded-full bg-white/80 border border-slate-200 text-[11px] uppercase tracking-[0.25em] text-slate-500 hover:text-violet-500 transition-colors"
              >
                Methods and sources
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="space-y-6">
            {FAQ_DATA.map((faq, index) => (
              <div
                key={index}
                className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                  <span className="uppercase tracking-[0.3em]">Question {index + 1}</span>
                  <span className="uppercase tracking-[0.2em]">Feeding FAQ</span>
                </div>
                <h2 className="text-xl font-light text-slate-700 mb-3">
                  {faq.question}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm">
            <h2 className="text-2xl font-light text-slate-700 mb-3">
              Need a deeper dive?
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              These answers summarize current guidance, but every baby is unique. For personal recommendations, consult your pediatrician.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <Link
                href="/topics"
                className="rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm text-slate-600 hover:text-violet-500 transition-colors"
              >
                <span className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">Topics library</span>
                Explore structured playbooks on feeding foundations, safety, and nutrition.
              </Link>
              <Link
                href="/trust"
                className="rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm text-slate-600 hover:text-violet-500 transition-colors"
              >
                <span className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">Trust and transparency</span>
                Review our methodology and the source registry behind each recommendation.
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
