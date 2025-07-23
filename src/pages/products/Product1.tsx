import React from "react";
import { Helmet } from "react-helmet";
import Header from "../../components/Header";

// 添加背景图片
const marbleImage = require('../../Assets/marble2.png');

/**
 * DearBaby — AI Newborn Tracker (Open Beta)
 * =========================================
 * Visual & UX identical to SolidStart (soft lavender palette, radial‑gradient hero, glassy cards, pastel CTA).
 * GEO structured‑data retained.
 */

const DearBaby: React.FC = () => {
  /* 1 | STRUCTURED DATA */
  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "MobileApplication"],
    "@id": "https://www.momaiagent.com/products/dearbaby#app",
    name: "DearBaby – AI Newborn Tracker & Parenting Assistant",
    operatingSystem: "iOS 16+",
    applicationCategory: "ParentingApplication",
    installUrl: "https://apps.apple.com/app/dearbaby/id1234567890",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Track newborn feeding, sleep & milestones with AI. Calmer nights, healthier growth — free on iOS.",
    featureList: [
      "Smart logs for feeding & sleep",
      "Milestone prediction using GPT‑4o",
      "Daily health summaries",
      "Image / voice Q&A",
      "Apple Watch companion"
    ],
    provider: { "@type": "Organization", name: "JupitLunar", url: "https://www.momaiagent.com" }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.momaiagent.com" },
      { "@type": "ListItem", position: 2, name: "Products", item: "https://www.momaiagent.com/products" },
      { "@type": "ListItem", position: 3, name: "DearBaby" }
    ]
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is DearBaby free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — core tracking & GPT tips are free. Premium analytics are optional."
        }
      },
      {
        "@type": "Question",
        name: "Which devices are supported?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "iPhone & Apple Watch. Fitbit / Oura import coming soon."
        }
      }
    ]
  };

  /* 2 | UI */
  return (
    <>
      <Helmet>
        <title>DearBaby – AI Newborn Tracker & Parenting Assistant</title>
        <meta
          name="description"
          content="AI baby tracker with GPT guidance for feeding, sleep & milestones. Loved by parents across North America & Europe."
        />
        <meta
          name="keywords"
          content="AI baby tracker, newborn app, parenting assistant, GPT baby care, feeding log, sleep tracker"
        />
        <meta property="og:type" content="product" />
        <meta property="og:url" content="https://www.momaiagent.com/products/dearbaby" />
        <meta property="og:title" content="DearBaby – AI Newborn Tracker" />
        <meta
          property="og:description"
          content="Track feeds & naps, get GPT answers. Free on the App Store."
        />
        <meta property="og:image" content="https://www.momaiagent.com/assets/dearbaby-og.png" />
        <meta property="og:site_name" content="MomAI" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DearBaby – AI Newborn Tracker" />
        <meta name="twitter:description" content="Your calm AI companion for newborn care." />
        <meta name="twitter:image" content="https://www.momaiagent.com/assets/dearbaby-og.png" />
        <link rel="canonical" href="https://apps.apple.com/us/app/dearbaby-grow-feed-sleep-track/id6747565368" />
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
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-3 text-[#6d5dd3] tracking-tight">
                DearBaby
              </h1>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-[#a18aff] to-[#e0c3fc] bg-clip-text text-transparent">
                AI Newborn Tracker
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-10 px-4 sm:px-0">
                Calm, data‑driven support for feeds, naps & milestones — powered by GPT‑4o.
              </p>
              <a
                href="https://apps.apple.com/us/app/dearbaby-grow-feed-sleep-track/id6747565368"
                className="inline-block bg-gradient-to-r from-[#cfc4ff] to-[#e5deff] hover:from-[#c3b6ff] hover:to-[#d8cfff] text-[#5646b4] font-semibold px-8 sm:px-12 py-3 sm:py-4 rounded-full shadow-sm transition text-base sm:text-lg"
              >
                Download Free
              </a>
          </div>
        </section>
        
          {/* FEATURES */}
          <section className="py-16 bg-[#fcfbff]">
            <div className="max-w-6xl mx-auto px-6 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "Smart Logs", desc: "Effortless feed & sleep tracking synced with Apple Health." },
                { title: "Milestone AI", desc: "GPT‑based forecasts of growth & development." },
                { title: "Health Digest", desc: "Daily summaries combining HRV, naps & nutrition." },
                { title: "Ask GPT", desc: "Voice / image Q&A for instant parenting help." }
              ].map(({ title, desc }) => (
                <article
                  key={title}
                  className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow-[0_2px_8px_rgba(124,95,226,0.07)] hover:shadow-md transition"
                >
                  <h3 className="font-semibold text-lg mb-2 text-[#7d6ede]">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                </article>
              ))}
            </div>
          </section>

          {/* BOTTOM CTA */}
          <section className="py-20 text-center bg-[#f7f5fc]">
            <div className="max-w-xl mx-auto px-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">Ready for calmer days & nights?</h2>
              <a
                href="https://apps.apple.com/us/app/dearbaby-grow-feed-sleep-track/id6747565368"
                className="inline-block bg-gradient-to-r from-[#cfc4ff] to-[#e5deff] hover:from-[#c3b6ff] hover:to-[#d8cfff] text-[#5646b4] font-semibold px-10 py-4 rounded-full shadow-sm transition"
              >
                Get DearBaby Now
              </a>
              <p className="mt-3 text-xs text-gray-500">Free · In‑App Premium • JupitLunar 2025</p>
          </div>
        </section>
        </main>

        <footer className="py-8 text-center text-sm text-gray-500" itemScope itemType="https://schema.org/WPFooter">
          © {new Date().getFullYear()} JupitLunar · <a href="/privacy" className="underline hover:text-gray-700">Privacy Policy</a>
        </footer>
      </div>
    </>
  );
};

export default DearBaby;
