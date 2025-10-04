import React from 'react';
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
  title: 'Baby Feeding FAQ: Common Questions About Infant Nutrition | JupitLunar',
  description: 'Get expert answers to the most common baby feeding questions. Evidence-based guidance on when to start solids, food safety, allergens, and nutrition for babies 0-24 months.',
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
      
      <div className="min-h-screen bg-gradient-to-br from-[#F8F6FC] to-[#EAE6F8] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Baby Feeding FAQ
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert answers to the most common questions about infant and toddler nutrition, 
              based on CDC, WHO, AAP, and Health Canada guidelines.
            </p>
          </div>

          {/* FAQ Content */}
          <div className="space-y-6">
            {FAQ_DATA.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {faq.question}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          {/* Additional Resources */}
          <div className="mt-16 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-8 border border-emerald-100">
            <h2 className="text-2xl font-semibold text-emerald-900 mb-4">
              Need More Help?
            </h2>
            <p className="text-emerald-800 mb-6">
              These answers are based on current medical guidelines, but every baby is unique. 
              Always consult with your pediatrician for personalized advice.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border border-emerald-200">
                <h3 className="font-semibold text-emerald-900 mb-2">Browse Our Knowledge Base</h3>
                <p className="text-sm text-emerald-700 mb-3">
                  Explore detailed guides on feeding foundations, safety, and nutrition.
                </p>
                <a 
                  href="/topics" 
                  className="text-emerald-600 font-medium hover:text-emerald-700"
                >
                  View Topics →
                </a>
              </div>
              <div className="bg-white rounded-xl p-4 border border-emerald-200">
                <h3 className="font-semibold text-emerald-900 mb-2">Trust & Transparency</h3>
                <p className="text-sm text-emerald-700 mb-3">
                  See our review process and source citations for every recommendation.
                </p>
                <a 
                  href="/trust" 
                  className="text-emerald-600 font-medium hover:text-emerald-700"
                >
                  Learn More →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

