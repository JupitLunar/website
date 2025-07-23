import React from "react";
import { Helmet } from "react-helmet";
import Header from "../components/Header";

/**
 * Global FAQ Page — MomAI (DearBaby & SolidStart)
 * ------------------------------------------------
 * • Consolidates top‑exposure questions across both products
 * • Tailwind pastel styling consistent with product pages
 * • Visible <details> blocks + JSON‑LD FAQPage for GEO
 */

const faqList = [
  {
    q: "Is DearBaby free to use?",
    a: "Yes. All core tracking and AI insights are free. Optional premium analytics are available via monthly or annual plans, cancel anytime.",
  },
  {
    q: "What devices do you support?",
    a: "iPhone running iOS 16 or later. DearBaby pairs with Apple Watch; SolidStart works independently. Fitbit & Oura import are on our 2025 roadmap.",
  },
  {
    q: "Is my data secure and private?",
    a: "100 % — data is end‑to‑end encrypted, stored in North‑American HIPAA‑ready clouds, with GDPR & PIPEDA compliance and annual SOC 2 audits.",
  },
  {
    q: "How do I export or delete my data?",
    a: "Go to Settings → Data Export. You can download CSV or PDF reports or request full deletion in accordance with GDPR right‑to‑be‑forgotten.",
  },
  {
    q: "Can multiple caregivers use the same account?",
    a: "Multi‑caregiver sync is under development and will roll out in Q4 2025.",
  },
  {
    q: "Does DearBaby work offline?",
    a: "Not yet — an offline logging mode is on our roadmap.",
  },
  {
    q: "How accurate is DearBaby’s HRV analysis?",
    a: "Accuracy relies on Apple Watch Series 6+ HRV data; our algorithm shows > 95 % agreement with clinical ECG datasets.",
  },
  {
    q: "What ages does SolidStart cover?",
    a: "SolidStart is built for the 6‑12 month weaning window, with stage‑based menus following WHO texture guidelines.",
  },
  {
    q: "How does SolidStart handle food allergies?",
    a: "We cross‑check every ingredient against the top 9 allergen database (Health Canada & FDA). The app flags potential allergens and suggests substitutes.",
  },
  {
    q: "Can I track twins or multiple babies?",
    a: "Multi‑profile support is planned for late 2025.",
  },
  {
    q: "Do you share data with advertisers?",
    a: "Never. DearBaby does not sell or share personal data with third parties for advertising.",
  },
  {
    q: "Can I share reports with my pediatrician or dietitian?",
    a: "One‑tap PDF export & secure link sharing is coming this fall.",
  },
  {
    q: "How are AI recommendations generated?",
    a: "Insights are powered by GPT‑4o, fine‑tuned on anonymised, peer‑reviewed pediatric research and our proprietary dataset.",
  },
  {
    q: "What languages are supported?",
    a: "English only today; additional languages (Spanish, French, Simplified Chinese) planned for 2026.",
  },
  {
    q: "How do I contact support or report a bug?",
    a: "Shake your phone to open the Feedback form, or email support@momaiagent.com — we reply within 24 hours (Mon‑Fri).",
  }
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqList.map(({ q, a }) => ({
    "@type": "Question",
    "name": q,
    "acceptedAnswer": { "@type": "Answer", "text": a }
  }))
};

const SiteFAQ: React.FC = () => (
  <>
    <Helmet>
      <title>FAQ – DearBaby (DearBaby & SolidStart)</title>
      <meta name="description" content="Answers to the most common questions about MomAI’s DearBaby and SolidStart apps – pricing, privacy, devices, allergens, HRV accuracy and more." />
      <link rel="canonical" href="https://www.momaiagent.com/faq" />
      <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
    </Helmet>

    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header />
      <main className="pt-24 py-16 bg-[#fdfcff] text-gray-800">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h1>
          <div className="space-y-6">
            {faqList.map(({ q, a }) => (
              <details key={q} className="group p-4 bg-white/70 backdrop-blur rounded-xl shadow-[0_2px_8px_rgba(124,95,226,0.07)]">
                <summary className="cursor-pointer font-semibold text-[#7d6ede] group-open:underline">{q}</summary>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </main>
      <footer className="py-8 text-center text-sm text-gray-500" itemScope itemType="https://schema.org/WPFooter">
        © {new Date().getFullYear()} JupitLunar · <a href="/privacy" className="underline hover:text-gray-700">Privacy Policy</a>
      </footer>
    </div>
  </>
);

export default SiteFAQ;
