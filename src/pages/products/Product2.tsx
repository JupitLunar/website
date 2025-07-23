import React from "react";
import { Helmet } from "react-helmet";
import Header from "../../components/Header";
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL as string,
  process.env.REACT_APP_SUPABASE_ANON_KEY as string
);

// 添加背景图片
const marbleImage = require('../../Assets/marble2.png');

/**
 * DearBaby SolidStart — AI Baby‑Food Companion (Open Beta)
 * -------------------------------------------------------
 * Palette refresh → soft lavender / lilac / off‑white for a calmer, premium feel.
 * Hero now has a layered radial‑gradient background for a higher‑end, airy look.
 */

const SolidStart: React.FC = () => {
  const [showBetaModal, setShowBetaModal] = useState(false);
  const [email, setEmail] = useState('');
  /* 1 | STRUCTURED DATA (unchanged) */
  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "MobileApplication"],
    "@id": "https://www.momaiagent.com/products/solidstart#app",
    name: "DearBaby SolidStart – AI Baby‑Food Companion (Beta)",
    operatingSystem: "iOS 16+",
    applicationCategory: "FoodAndDrinkApplication",
    installUrl: "https://testflight.apple.com/join/xxxxx",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Ingredient‑based AI generator for safe, stage‑appropriate baby recipes (6‑12 m). Join our public beta via TestFlight.",
    featureList: [
      "Ingredient scanner",
      "Stage‑based menus",
      "Allergy guard",
      "Smart shopping list"
    ],
    provider: { "@type": "Organization", name: "JupitLunar", url: "https://www.momaiagent.com" }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.momaiagent.com" },
      { "@type": "ListItem", position: 2, name: "Products", item: "https://www.momaiagent.com/products" },
      { "@type": "ListItem", position: 3, name: "SolidStart" }
    ]
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is SolidStart free during beta?",
        acceptedAnswer: { "@type": "Answer", text: "Yes, every feature is free while we’re in public beta." }
      },
      {
        "@type": "Question",
        name: "Which age range is supported?",
        acceptedAnswer: { "@type": "Answer", text: "We focus on 6‑12 m solids (purée & BLW). Toddler mode is on the roadmap." }
      }
    ]
  };

  /* 2 | UI */
  // 提交邮箱到waitlist
  async function submitWaitlist(email: string) {
    const { data, error } = await supabase.from('waitlist_users').insert([
      { email }
    ]);
    if (error) {
      alert('Submission failed. Please try again later.');
    } else {
      alert('Thank you for joining the waitlist!');
    }
  }

  return (
    <>
      <Helmet>
        <title>SolidStart (Beta) – AI Baby‑Food Recipes from Your Ingredients</title>
        <meta
          name="description"
          content="SolidStart turns what’s in your kitchen into safe, nutritious baby recipes in 60 s. Ingredient scanner, allergy guard, BLW & purée — now in public beta."
        />
        <meta name="keywords" content="AI baby food, solid start app, ingredient based baby recipes, BLW, purée, baby led weaning" />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="product" />
        <meta property="og:url" content="https://www.momaiagent.com/products/solidstart" />
        <meta property="og:title" content="SolidStart (Beta) – AI Baby‑Food Companion" />
        <meta property="og:description" content="Tell SolidStart the ingredients you have → get stage‑safe baby recipes." />
        <meta property="og:image" content="https://www.momaiagent.com/assets/solidstart-og.png" />
        <meta property="og:site_name" content="MomAI" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SolidStart (Beta) – AI Baby‑Food Companion" />
        <meta name="twitter:description" content="Ingredient‑based AI recipes for 6‑12 m babies – free beta." />
        <meta name="twitter:image" content="https://www.momaiagent.com/assets/solidstart-og.png" />
        <link rel="canonical" href="https://www.momaiagent.com/products/solidstart" />
        <link rel="alternate" href="https://www.momaiagent.com/products/solidstart" hrefLang="x-default" />
        <link rel="alternate" href="https://www.momaiagent.com/products/solidstart" hrefLang="en-us" />
        <link rel="alternate" href="https://www.momaiagent.com/products/solidstart" hrefLang="en-ca" />
        <script type="application/ld+json">{JSON.stringify(softwareJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-white text-gray-900" lang="en">
        <Header />
        <main>
          {/* HERO */}
          <section
            className="relative overflow-hidden text-center px-4 py-16 sm:py-28 md:py-36"
            style={{
              backgroundImage:
                `url(${marbleImage}), ` +
                "linear-gradient(180deg,#fdfcff 0%,#faf8ff 100%), " +
                "radial-gradient(1000px at 20% -200px, rgba(199,187,255,0.35) 0%, rgba(255,255,255,0) 70%), " +
                "radial-gradient(800px at 85% 110%, rgba(235,227,255,0.45) 0%, rgba(255,255,255,0) 75%)",
              backgroundSize: "cover, 100% 100%, 100% 100%, 100% 100%",
              backgroundPosition: "center, center, center, center",
              backgroundRepeat: "no-repeat, no-repeat, no-repeat, no-repeat",
              backgroundBlendMode: "normal",
              minHeight: "60vh"
            }}
          >
            <div className="max-w-3xl mx-auto pt-8 sm:pt-16">
              <h1 className="text-5xl sm:text-6xl font-bold mb-3 text-[#7d6ede] tracking-tight">
                SolidStart
              </h1>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#6d5dd3] mb-4">
                Our Family of <span className="bg-gradient-to-r from-[#a18aff] to-[#e0c3fc] bg-clip-text text-transparent">AI Solutions</span>
              </h2>
              <p className="text-lg text-[#a18aff] max-w-2xl mx-auto leading-relaxed font-light">
                Gentle technology that grows with your family's journey
              </p>
              <button
                onClick={() => setShowBetaModal(true)}
                className="inline-block bg-gradient-to-r from-[#cfc4ff] to-[#e5deff] hover:from-[#c3b6ff] hover:to-[#d8cfff] text-[#5646b4] font-semibold px-8 sm:px-12 py-3 sm:py-4 rounded-full shadow-sm transition text-base sm:text-lg"
              >
                Join Beta
              </button>
          </div>
        </section>
        
          {/* FEATURES */}
          <section className="py-16 bg-[#fcfbff]">
            <div className="max-w-6xl mx-auto px-6 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "Ingredient Scanner", desc: "Snap or type ingredients you have; SolidStart suggests recipes instantly." },
                { title: "Stage‑Based Menus", desc: "Menus adapt to 6‑9 m purée / 9‑12 m BLW guidelines." },
                { title: "Allergy Guard", desc: "Built‑in allergen checker flags risky combos using WHO data." },
                { title: "Smart Shopping List", desc: "One‑tap list gathers missing items and sorts by aisle." }
              ].map(({ title, desc }) => (
                <article key={title} className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow-[0_2px_8px_rgba(124,95,226,0.07)] hover:shadow-md transition">
                  <h3 className="font-semibold text-lg mb-2 text-[#7d6ede]">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                </article>
              ))}
            </div>
          </section>

          {/* BOTTOM CTA */}
          <section className="py-20 text-center bg-[#f7f5fc]">
            <div className="max-w-xl mx-auto px-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">Ready to cook with confidence?</h2>
              <button
                onClick={() => setShowBetaModal(true)}
                className="inline-block bg-gradient-to-r from-[#cfc4ff] to-[#e5deff] hover:from-[#c3b6ff] hover:to-[#d8cfff] text-[#5646b4] font-semibold px-10 py-4 rounded-full shadow-sm transition"
              >
                Join Beta
              </button>
              <p className="mt-3 text-xs text-gray-500">Free · 6‑12 m Solids • JupitLunar 2025</p>
          </div>
        </section>
        </main>

        <footer className="py-8 text-center text-sm text-gray-500" itemScope itemType="https://schema.org/WPFooter">
          © {new Date().getFullYear()} JupitLunar · <a href="/privacy" className="underline hover:text-gray-700">Privacy Policy</a>
        </footer>
      </div>
      {showBetaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-3xl p-10 max-w-sm w-full relative translate-y-32 border-0 shadow-lg">
            <button
              className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 text-2xl font-light focus:outline-none"
              onClick={() => setShowBetaModal(false)}
              aria-label="Close"
              style={{ background: 'none', border: 'none', lineHeight: 1 }}
            >
              ×
            </button>
            <h3 className="text-2xl font-semibold mb-6 text-gray-800 tracking-tight">Join Beta</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await submitWaitlist(email);
                setShowBetaModal(false);
              }}
              className="space-y-6"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-5 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-transparent text-base transition-all duration-200 placeholder-gray-400"
                required
              />
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl text-base font-semibold shadow-none hover:from-indigo-600 hover:to-purple-600 transition-all duration-200"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SolidStart;
