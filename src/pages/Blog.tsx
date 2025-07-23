import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Header from "../components/Header";

// 分类定义
const categories = [
  { id: "all", name: "All Articles", color: "from-gray-100 to-gray-200", textColor: "text-gray-700" },
  { id: "sleep", name: "Sleep & Safety", color: "from-blue-100 to-indigo-100", textColor: "text-blue-700" },
  { id: "feeding", name: "Feeding & Nutrition", color: "from-green-100 to-emerald-100", textColor: "text-green-700" },
  { id: "development", name: "Development & Play", color: "from-purple-100 to-violet-100", textColor: "text-purple-700" },
  { id: "health", name: "Health & Wellness", color: "from-red-100 to-pink-100", textColor: "text-red-700" },
  { id: "mental-health", name: "Mental Health", color: "from-pink-100 to-rose-100", textColor: "text-pink-700" },
  { id: "technology", name: "Technology & Apps", color: "from-cyan-100 to-teal-100", textColor: "text-cyan-700" }
];

// Blog文章数据
const blogPosts = [
  {
    slug: "safe-sleep-guidelines-newborns",
    title: "Safe Sleep Guidelines for Newborns: AAP-Based Tips That Cut SIDS Risk",
    excerpt: "Learn the ABCs of safe sleep—Alone, on their Back, in a safety-approved Crib. Evidence-based guidelines from the American Academy of Pediatrics to reduce SIDS risk and establish healthy sleep habits from day one.",
    category: "sleep",
    readTime: "8 min read",
    publishDate: "2025-01-15",
    featured: true
  },
  {
    slug: "gentle-sleep-training-baby",
    title: "Getting Baby to Sleep Through the Night: Gentle Training Methods",
    excerpt: "Evidence-based methods including graduated extinction, white noise, and consistent routines for longer sleep stretches. Learn the AAP-approved approach to gentle sleep training that respects your baby's needs.",
    category: "sleep",
    readTime: "10 min read",
    publishDate: "2025-01-14"
  },
  {
    slug: "baby-sleep-regressions-explained",
    title: "Understanding Sleep Regressions: Why They Happen and How to Cope",
    excerpt: "Why the 4-month, 8-month, and 12-month sleep regressions occur and practical strategies to ride them out. Learn how developmental leaps affect sleep patterns and when to expect improvements.",
    category: "sleep",
    readTime: "7 min read",
    publishDate: "2025-01-13"
  },
  {
    slug: "breastfeeding-basics-new-moms",
    title: "Breastfeeding Tips for New Moms: Latch, Positions, and WHO-Backed Benefits",
    excerpt: "Essential breastfeeding guidance including proper latch techniques, comfortable positions, and evidence-based benefits. Learn troubleshooting tips for common challenges and how to establish a successful nursing relationship.",
    category: "feeding",
    readTime: "12 min read",
    publishDate: "2025-01-12"
  },
  {
    slug: "formula-feeding-safety-guide",
    title: "Bottle & Formula Feeding Guide: From Selection to Safe Preparation",
    excerpt: "Complete guide to formula feeding including safe preparation, storage guidelines, and CDC/FDA recommendations. Learn how to choose the right formula and establish healthy feeding routines.",
    category: "feeding",
    readTime: "9 min read",
    publishDate: "2025-01-11"
  },
  {
    slug: "newborn-feeding-schedule",
    title: "Newborn Feeding Schedule & Hunger Cues: 8-12 Feeds, 6 Wet Diapers",
    excerpt: "Understanding your newborn's feeding needs with simple signs that indicate adequate intake. Learn to recognize early hunger cues and establish a flexible feeding schedule that works for your family.",
    category: "feeding",
    readTime: "6 min read",
    publishDate: "2025-01-10"
  },
  {
    slug: "starting-solids-6-months",
    title: "Starting Solids: When & How - Signs of Readiness and First-Food Roadmap",
    excerpt: "Evidence-based guide to introducing solid foods backed by CDC/AAP recommendations. Learn the signs of readiness, first foods to offer, and how to safely introduce common allergens.",
    category: "feeding",
    readTime: "11 min read",
    publishDate: "2025-01-09"
  },
  {
    slug: "baby-led-weaning-vs-purees",
    title: "Baby-Led Weaning vs. Purées: Pros, Cons, and Safety Considerations",
    excerpt: "Comprehensive comparison of baby-led weaning and traditional purée feeding approaches. Evidence-based overview of benefits, challenges, and safety considerations for each method.",
    category: "feeding",
    readTime: "8 min read",
    publishDate: "2025-01-08"
  },
  {
    slug: "homemade-baby-food-recipes",
    title: "Homemade Baby Food Recipes & Meal Ideas: Nutritionist-Approved",
    excerpt: "Easy purées, combination mashes, and finger foods for every stage. Nutritionist-approved recipes that skip added salt and sugar while providing essential nutrients for growing babies.",
    category: "feeding",
    readTime: "15 min read",
    publishDate: "2025-01-07"
  },
  {
    slug: "toddler-picky-eating-tips",
    title: "Dealing with a Picky Eater: Evidence-Based Strategies for Toddlers",
    excerpt: "Why picky eating is normal at age 2 and 10 evidence-based strategies from CHOP experts. Learn how to encourage healthy eating habits without creating food battles.",
    category: "feeding",
    readTime: "9 min read",
    publishDate: "2025-01-06"
  },
  {
    slug: "first-year-baby-milestones",
    title: "Baby's First-Year Milestones Timeline: Month-by-Month Checklist",
    excerpt: "Comprehensive month-by-month milestone checklist using the CDC 'Learn the Signs' framework. Track your baby's development across motor, language, social, and cognitive domains.",
    category: "development",
    readTime: "14 min read",
    publishDate: "2025-01-05"
  },
  {
    slug: "tummy-time-guide",
    title: "Tummy Time: Why & How - Muscle-Building Play That Prevents Flat Spots",
    excerpt: "Essential guide to tummy time including why it matters, how to start, and age-appropriate activities. Learn how to make tummy time enjoyable while building crucial neck and shoulder strength.",
    category: "development",
    readTime: "6 min read",
    publishDate: "2025-01-04"
  },
  {
    slug: "baby-development-activities",
    title: "Play-Based Activities to Boost Development: Zero-Cost Brain Builders",
    excerpt: "Simple, zero-cost games and activities that build your baby's brain, backed by AAP and Zero to Three research. Age-appropriate play ideas that support cognitive, motor, and social development.",
    category: "development",
    readTime: "10 min read",
    publishDate: "2025-01-03"
  },
  {
    slug: "infant-vaccine-schedule-2025",
    title: "Vaccine Schedule: First-Year Overview - What to Expect at Each Visit",
    excerpt: "Complete overview of the first-year vaccine schedule including what to expect at each well-visit and why on-time shots matter. Learn about the 16 diseases prevented by completing the recommended schedule.",
    category: "health",
    readTime: "8 min read",
    publishDate: "2025-01-02"
  },
  {
    slug: "sick-baby-fever-cold-care",
    title: "Caring for a Sick Baby: Home Remedies, Red Flags, and Fever Rules",
    excerpt: "Essential guide to caring for a sick baby including home remedies, red flags that require medical attention, and pediatrician-backed fever management guidelines.",
    category: "health",
    readTime: "9 min read",
    publishDate: "2025-01-01"
  },
  {
    slug: "teething-symptoms-remedies",
    title: "Teething 101: Symptoms & Soothers - What's Normal and What's Not",
    excerpt: "Complete guide to teething including normal symptoms, pediatrician-approved pain relief, and when to seek medical attention. Learn safe soothers and what to avoid.",
    category: "health",
    readTime: "7 min read",
    publishDate: "2024-12-31"
  },
  {
    slug: "surviving-baby-colic",
    title: "Surviving Colic & Excessive Crying: Rule-of-3 Definition and Soothing Hacks",
    excerpt: "Understanding colic including the rule-of-3 definition, evidence-based soothing strategies, and essential parent self-care. Learn why colic happens and when it typically resolves.",
    category: "health",
    readTime: "8 min read",
    publishDate: "2024-12-30"
  },
  {
    slug: "babyproofing-home-safety",
    title: "Babyproofing 101: Home Safety Checklist - Room-by-Room Guide",
    excerpt: "Comprehensive room-by-room babyproofing guide to prevent common injuries. Learn essential safety measures including furniture anchoring, outlet covers, and hazard identification.",
    category: "health",
    readTime: "12 min read",
    publishDate: "2024-12-29"
  },
  {
    slug: "postpartum-depression-signs-help",
    title: "Postpartum Mental Health: Baby Blues vs PPD - Know the Signs",
    excerpt: "Understanding postpartum mental health including the difference between baby blues and postpartum depression. Learn the signs, risk factors, and paths to professional help and support.",
    category: "mental-health",
    readTime: "10 min read",
    publishDate: "2024-12-28"
  },
  {
    slug: "best-baby-apps-2025",
    title: "Top Baby-Care Apps & Tech Tools (2025): AI Sleep Charts to Smart Monitors",
    excerpt: "Comprehensive review of the best baby-care apps and tech tools for 2025. From AI-powered sleep tracking to smart monitors, discover gadgets that can lighten new-parent life.",
    category: "technology",
    readTime: "11 min read",
    publishDate: "2024-12-27"
  }
];

const Blog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredPosts = selectedCategory === "all" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  return (
    <>
      <Helmet>
        <title>Parenting Blog - Expert Tips & Advice | JupitLunar</title>
        <meta
          name="description"
          content="Expert parenting advice, baby care tips, and evidence-based guidance for new parents. From sleep training to nutrition, we've got you covered."
        />
        <meta
          name="keywords"
          content="parenting blog, baby care tips, newborn sleep, baby nutrition, postpartum recovery, baby development"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.momaiagent.com/blog" />
        <meta property="og:title" content="Parenting Blog - Expert Tips & Advice" />
        <meta property="og:description" content="Expert parenting advice and baby care tips for new parents." />
        <link rel="canonical" href="https://www.momaiagent.com/blog" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-white text-gray-900">
        <Header />
        <main className="pt-24">
          {/* Hero Section */}
          <section className="py-16 bg-gradient-to-br from-[#fdfcff] to-[#f7f5fc]">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
                Parenting Blog
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Evidence-based advice, expert tips, and practical guidance to help you navigate the beautiful journey of parenthood.
              </p>
            </div>
          </section>

          {/* Category Filter */}
          <section className="py-8 bg-gray-50">
            <div className="max-w-4xl mx-auto px-6">
              <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category.id
                        ? `bg-gradient-to-r ${category.color} ${category.textColor} shadow-md`
                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Blog Posts List */}
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-6">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
                  <p className="text-gray-500">Try selecting a different category.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {filteredPosts.map((post) => {
                    const categoryInfo = getCategoryInfo(post.category);
                    return (
                      <article
                        key={post.slug}
                        className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
                      >
                        <Link to={`/blog/${post.slug}`} className="block">
                          <div className="p-8">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-4 mb-3">
                                  <span className={`px-3 py-1 bg-gradient-to-r ${categoryInfo.color} ${categoryInfo.textColor} text-sm font-medium rounded-full`}>
                                    {categoryInfo.name}
                                  </span>
                                  <span className="text-sm text-gray-500">{post.readTime}</span>
                                  <span className="text-sm text-gray-500">
                                    {new Date(post.publishDate).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </span>
                                </div>
                                <h2 className="text-2xl font-bold mb-4 text-gray-800 hover:text-indigo-600 transition-colors leading-tight">
                                  {post.title}
                                </h2>
                                <p className="text-gray-600 leading-relaxed mb-4 text-base">
                                  {post.excerpt}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors">
                                    Read full article →
                                  </span>
                                  {post.featured && (
                                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded">
                                      Featured
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </main>

        <footer className="py-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} JupitLunar · <a href="/privacy" className="underline hover:text-gray-700">Privacy Policy</a>
        </footer>
      </div>
    </>
  );
};

export default Blog; 