import type { ContentHub } from '@/types/content';
import { generateMedicalWebPageSchema, generateCompleteAEOSchema } from './aeo-optimizations';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.momaiagent.com').replace(/\/$/, '');
const logoUrl = `${siteUrl}/Assets/Logo.png`;

// 生成文章的结构化数据
export function generateArticleStructuredData(article: any) {
  const primaryType = (() => {
    switch (article.type) {
      case 'news':
        return 'NewsArticle';
      case 'research':
        return 'ScholarlyArticle';
      case 'faq':
        return 'Article';
      case 'recipe':
      case 'howto':
      case 'explainer':
      default:
        return 'Article';
    }
  })();

  const tldrItems = Array.isArray(article.key_facts) ? article.key_facts.slice(0, 5) : [];
  const citations = Array.isArray(article.citations) ? article.citations : [];

  const structuredData: Record<string, any> = {
    "@type": primaryType,
    "@id": `${siteUrl}/${article.slug}#article`,
    "headline": article.title,
    "description": article.one_liner || article.body_md?.substring(0, 160),
    "abstract": tldrItems.length > 0 ? tldrItems.join(' • ') : undefined,
    "image": article.featured_image ? [article.featured_image] : undefined,
    "author": {
      "@type": "Organization",
      "name": "JupitLunar Editorial Team",
      "description": "Science-based parenting content curators",
    },
    "publisher": {
      "@type": "Organization",
      "name": "JupitLunar",
      "logo": {
        "@type": "ImageObject",
        "url": logoUrl,
      },
    },
    "datePublished": article.published_at,
    "dateModified": article.updated_at || article.published_at,
    "dateCreated": article.published_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}/${article.slug}`,
    },
    "articleSection": article.hub,
    "keywords": article.entities?.join(', ') || 'maternal health, infant care, parenting',
    "inLanguage": article.lang || 'en',
    "timeRequired": article.reading_time ? `PT${article.reading_time}M` : undefined,
    "isAccessibleForFree": true,
    "isPartOf": {
      "@type": "WebSite",
      "name": "JupitLunar",
      "url": siteUrl,
    },
    "speakable": {
      "@type": 'SpeakableSpecification',
      xpath: [
        "/html/body//h1",
        "/html/body//section[1]//p[1]",
      ],
    },
    // AEO优化：强调基于权威来源而非个人审核
    "isBasedOn": citations.slice(0, 3).map((citation: any) => ({
      "@type": "CreativeWork",
      "name": citation.title,
      "url": citation.url,
      "publisher": {
        "@type": "Organization",
        "name": citation.publisher || "Official Health Organization"
      },
      "datePublished": citation.published_date
    })) || [
      {
        "@type": "WebPage",
        "name": "CDC Infant and Toddler Nutrition Guidelines",
        "url": "https://www.cdc.gov/infant-toddler-nutrition/",
        "publisher": {
          "@type": "GovernmentOrganization",
          "name": "Centers for Disease Control and Prevention"
        }
      },
      {
        "@type": "WebPage",
        "name": "AAP Parenting Resources",
        "url": "https://www.healthychildren.org/",
        "publisher": {
          "@type": "Organization",
          "name": "American Academy of Pediatrics"
        }
      }
    ],
    "sourceOrganization": {
      "@type": "Organization",
      "name": "CDC, AAP, Health Canada (source references)",
      "description": "Summaries reference official public-health publications; DearBaby curates and contextualizes those materials."
    },
    "educationalLevel": "Beginner to Intermediate",
    "audience": {
      "@type": "PeopleAudience",
      "audienceType": "Parents and caregivers of infants and toddlers",
      "geographicArea": {
        "@type": "Place",
        "name": "North America"
      }
    },
    "about": article.entities?.map((entity: string) => ({
      "@type": 'Thing',
      name: entity,
    })) || [],
    "citation": citations.map((citation: any) => ({
      "@type": "CreativeWork",
      "name": citation.title,
      "url": citation.url,
      "publisher": citation.publisher,
      "datePublished": citation.published_date
    })) || [],
    "mentions": article.entities?.map((entity: string) => ({
      "@type": "Thing",
      name: entity
    })) || [],
    // 快速答案结构 - 给LLM直接引用
    "mainEntity": {
      "@type": "Question",
      "name": article.title,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": article.one_liner || article.body_md?.substring(0, 500),
        "dateCreated": article.published_at,
        "upvoteCount": article.helpful_count || 0,
        "url": `${siteUrl}/${article.slug}#answer`
      }
    },
    // 内容可信度信号
    "backstory": "Content curated from official health organization guidelines including CDC, AAP, and Health Canada",
    "contentReferenceTime": article.source_guideline_date || article.published_at,
    "educationalUse": "Parent education, caregiver training",
    "teaches": article.entities?.join(', ')
  };

  if (Array.isArray(article.entities) && article.entities.length > 0) {
    structuredData.about = article.entities.map((entity: string) => ({
      "@type": 'Thing',
      name: entity,
    }));
  }

  if (typeof article.body_md === 'string') {
    const text = article.body_md.replace(/<[^>]+>/g, ' ');
    const words = text.trim().split(/\s+/).filter(Boolean);
    structuredData.wordCount = words.length || undefined;
  }

  const citationLinks = citations
    .map((citation: any) => citation.url)
    .filter((url: string | undefined) => typeof url === 'string');
  const maintenanceLinks = [
    `${siteUrl}/latest-articles`,
    `${siteUrl}/api/latest-articles?format=simplified`
  ];
  structuredData.significantLink = Array.from(new Set([...maintenanceLinks, ...citationLinks]));
  structuredData.maintainer = {
    "@type": "Organization",
    "name": "JupitLunar Editorial Operations",
    "url": `${siteUrl}/trust`
  };

  const graph: Record<string, any>[] = [structuredData];

  if (article.type === 'howto' && Array.isArray(article.how_to_steps) && article.how_to_steps.length > 0) {
    graph.push({
      "@type": "HowTo",
      "@id": `${siteUrl}/${article.slug}#howto`,
      "name": article.title,
      "description": article.one_liner,
      "totalTime": article.time_required ? `PT${article.time_required}` : undefined,
      "tool": article.tools || undefined,
      "supply": article.supplies || undefined,
      "step": article.how_to_steps.map((step: any) => ({
        "@type": "HowToStep",
        "position": step.step_number,
        "name": step.title,
        "text": step.description,
      })),
    });
  }

  if (article.type === 'recipe') {
    const ingredientList = Array.isArray(article.recipe_ingredients)
      ? article.recipe_ingredients.map((ingredient: any) =>
          [ingredient.amount, ingredient.unit, ingredient.name].filter(Boolean).join(' ').trim()
        )
      : [];
    const instructions = Array.isArray(article.recipe_steps)
      ? article.recipe_steps.map((step: any) => ({
          "@type": "HowToStep",
          "position": step.step_number,
          "name": step.title,
          "text": step.description,
        }))
      : [];

    graph.push({
      "@type": "Recipe",
      "@id": `${siteUrl}/${article.slug}#recipe`,
      "name": article.title,
      "description": article.one_liner,
      "image": article.featured_image ? [article.featured_image] : undefined,
      "recipeIngredient": ingredientList,
      "recipeInstructions": instructions,
      "recipeCuisine": article.region,
      "author": "JupitLunar",
      "datePublished": article.published_at,
      "keywords": article.entities?.join(', '),
      "nutrition": article.nutrition || undefined,
    });
  }

  if (article.qas && article.qas.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${siteUrl}/${article.slug}#faq`,
      "mainEntity": article.qas.map((qa: any, index: number) => ({
        "@type": "Question",
        "@id": `${siteUrl}/${article.slug}#question-${index + 1}`,
        "name": qa.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": qa.answer,
        },
      })),
    });
  }

  if (['explainer', 'research', 'howto', 'faq', 'recipe'].includes(article.type)) {
    graph.push({
      "@type": "HealthTopicContent",
      "@id": `${siteUrl}/${article.slug}#health-topic`,
      "name": article.title,
      "description": article.one_liner || article.body_md?.substring(0, 160),
      "lastReviewed": article.last_reviewed || article.updated_at,
      "hasHealthAspect": article.hub || "Infant and toddler health",
      "inLanguage": article.lang || 'en',
      "audience": {
        "@type": "PeopleAudience",
        "audienceType": 'Parents and caregivers of infants and toddlers',
        "geographicArea": "North America"
      },
      // 基于权威来源而非医学审核
      "backstory": "Educational content curated from CDC, AAP, and Health Canada guidelines",
      "genre": "Health education",
      "educationalLevel": "General public",
      "isBasedOn": article.citations?.slice(0, 2).map((citation: any) => ({
        "@type": "WebPage",
        "name": citation.title,
        "url": citation.url,
        "publisher": citation.publisher
      })) || [],
      "about": {
        "@type": "HealthCondition",
        "name": article.hub || "Infant care and nutrition"
      },
      // 明确这是教育性内容，非医疗建议
      "disclaimer": "This content is for educational purposes only and does not replace professional medical advice. Always consult your pediatrician for personalized guidance.",
    });
  }

  // 添加MedicalWebPage schema（AEO优化）
  if (['explainer', 'research', 'howto', 'faq'].includes(article.type)) {
    graph.push(generateMedicalWebPageSchema(article));
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

// 生成内容中心的结构化数据
export function generateHubStructuredData(hub: any, articles: any[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": hub.name,
    "description": hub.description,
    "url": `${siteUrl}/hub/${hub.slug}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": articles.length,
      "itemListElement": articles.map((article, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Article",
          "headline": article.title,
          "url": `${siteUrl}/${article.slug}`,
          "datePublished": article.published_at,
          "dateModified": article.updated_at || article.published_at
        }
      }))
    },
    "publisher": {
      "@type": "Organization",
      "name": "JupitLunar",
      "url": siteUrl
    },
    "inLanguage": "en",
    "isPartOf": {
      "@type": "WebSite",
      "name": "JupitLunar",
      "url": siteUrl
    }
  };
}

// 生成面包屑结构化数据
export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
}

// 生成网站的结构化数据
export function generateWebsiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "JupitLunar",
    "description": "AI-Powered Health Intelligence for Mom & Baby Wellness",
    "url": siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "JupitLunar",
      "logo": {
        "@type": "ImageObject",
        "url": logoUrl
      },
      "sameAs": [
        "https://twitter.com/jupitlunar",
        "https://linkedin.com/company/jupitlunar"
      ]
    },
    "inLanguage": "en"
  };
}

export function generateHomePageStructuredData({
  featuredArticles = [],
  testimonials = []
}: {
  featuredArticles?: Array<{ title: string; url: string; summary?: string; topic?: string }>;
  testimonials?: Array<{ name: string; quote: string; role?: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/#homepage`,
    "name": "DearBaby | Mom AI Agent for Evidence-Based Maternal & Infant Care",
    "url": `${siteUrl}/`,
    "description": "Ask Mom AI Agent for instant maternal and infant health guidance backed by CDC, AAP, WHO, and Health Canada sources. Download feeding roadmaps, explore food databases, and review curated parenting research.",
    "isPartOf": {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      "name": "JupitLunar",
      "url": siteUrl
    },
    "about": [
      {
        "@type": "Thing",
        "name": "Parenting knowledge base"
      },
      {
        "@type": "Thing",
        "name": "Maternal & infant wellness research summaries"
      },
      {
        "@type": "Thing",
        "name": "Evidence-based parenting answers"
      }
    ],
    "audience": {
      "@type": "PeopleAudience",
      "audienceType": "Parents and caregivers of infants and toddlers",
      "healthCondition": "Maternal and infant wellness",
      "geographicArea": {
        "@type": "AdministrativeArea",
        "name": "North America"
      }
    },
    "primaryImageOfPage": {
      "@type": "ImageObject",
      "@id": `${siteUrl}/#homepage-image`,
      "url": `${siteUrl}/heroimage.png`,
      "width": 1920,
      "height": 1080,
      "caption": "Mom AI Agent providing guidance to parents"
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [
        "h1",
        ".hero-subtext",
        "#guide-download h2"
      ]
    },
    "mainEntity": {
      "@type": "Question",
      "name": "What does Mom AI Agent deliver to new parents?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Mom AI Agent combines 75+ pediatric guidelines into one searchable assistant so you can get safe feeding, sleep, and safety answers in seconds, download a personalized feeding roadmap, and review cited sources before taking action."
      }
    },
    "significantLink": featuredArticles.slice(0, 5).map(article => ({
      "@type": "WebPage",
      "url": article.url,
      "name": article.title,
      "description": article.summary
    })),
    "review": testimonials.map(testimonial => ({
      "@type": "Review",
      "name": `Testimonial from ${testimonial.name}`,
      "reviewBody": testimonial.quote,
      "author": {
        "@type": "Person",
        "name": testimonial.name,
        "jobTitle": testimonial.role
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": 5,
        "bestRating": 5,
        "worstRating": 1
      }
    })),
    "potentialAction": [
      {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    {
      "@type": "SubscribeAction",
      "name": "Download Feeding Roadmap",
      "target": `${siteUrl}/#guide-download`
    }
    ],
    "inLanguage": "en"
  };
}

// 生成组织的结构化数据
export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "JupitLunar",
    "description": "AI-Powered Health Intelligence for Mom & Baby Wellness",
    "url": siteUrl,
    "logo": {
      "@type": "ImageObject",
      "url": logoUrl,
      "width": 200,
      "height": 200
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "support@momaiagent.com",
        "telephone": "+1-587-200-1550",
        "areaServed": "US/CA",
        "availableLanguage": ["en", "zh"],
        "contactOption": ["TollFree"],
        "hoursAvailable": "Mo-Fr 09:00-18:00"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Edmonton",
      "addressRegion": "Alberta",
      "addressCountry": "CA"
    },
    "sameAs": [
      "https://twitter.com/jupitlunar",
      "https://linkedin.com/company/jupitlunar"
    ],
    "foundingDate": "2024",
    "areaServed": "North America",
    "serviceType": "Health Technology",
    "knowsAbout": [
      "Maternal Health",
      "Infant Care",
      "AI Health Intelligence",
      "Parenting Technology",
      "Baby-Led Weaning",
      "Early Allergen Guidance"
    ],
    "hasCredential": [
      "Editorial reviewers: RN, IBCLC, IBCLC-certified lactation consultants",
      "RAG pipeline cites CDC, AAP, WHO, Health Canada documents"
    ]
  };
}

// 生成FAQ页面的结构化数据
export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

// 生成产品页面的结构化数据
export function generateProductStructuredData(product: {
  name: string;
  description: string;
  image: string;
  url: string;
  availability: string;
  price?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": product.name,
    "description": product.description,
    "image": product.image,
    "url": product.url,
    "applicationCategory": "HealthApplication",
    "operatingSystem": "iOS",
    "offers": {
      "@type": "Offer",
      "availability": product.availability,
      "price": product.price || "0",
      "priceCurrency": "USD"
    },
    "publisher": {
      "@type": "Organization",
      "name": "JupitLunar"
    }
  };
}

// 生成ClaimReview结构化数据（对抗育儿误区）
export function generateClaimReviewStructuredData(claim: {
  claimText: string;
  rating: 'True' | 'False' | 'Mixture' | 'Unproven';
  reviewExplanation: string;
  authoritySource?: string;
  authorityUrl?: string;
  articleUrl: string;
}) {
  const ratingValue = {
    'True': 5,
    'Mixture': 3,
    'Unproven': 2,
    'False': 1
  }[claim.rating];

  return {
    "@context": "https://schema.org",
    "@type": "ClaimReview",
    "url": claim.articleUrl,
    "claimReviewed": claim.claimText,
    "itemReviewed": {
      "@type": "Claim",
      "author": {
        "@type": "Organization",
        "name": "Common parenting misconception"
      },
      "datePublished": new Date().toISOString(),
      "appearance": {
        "@type": "CreativeWork",
        "url": claim.articleUrl
      }
    },
    "author": {
      "@type": "Organization",
      "name": "JupitLunar Editorial Team",
      "url": siteUrl
    },
    "reviewRating": {
      "@type": "Rating",
      ratingValue,
      "bestRating": 5,
      "worstRating": 1,
      "alternateName": claim.rating
    },
    "reviewBody": claim.reviewExplanation,
    "datePublished": new Date().toISOString(),
    "inLanguage": "en",
    // 引用权威来源
    ...(claim.authoritySource && claim.authorityUrl ? {
      "itemReviewed": {
        "@type": "Claim",
        "claimInterpreter": {
          "@type": "Organization",
          "name": claim.authoritySource,
          "url": claim.authorityUrl
        }
      }
    } : {})
  };
}
