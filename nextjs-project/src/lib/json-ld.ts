import type { Article, ContentHub } from '@/types/content';

// 生成文章的结构化数据
export function generateArticleStructuredData(article: Article) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.one_liner || article.body_md?.substring(0, 160),
    "image": article.featured_image ? [article.featured_image] : [],
    "author": {
      "@type": "Organization",
      "name": "JupitLunar",
      "url": "https://jupitlunar.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "JupitLunar",
      "logo": {
        "@type": "ImageObject",
        "url": "https://jupitlunar.com/Assets/Logo.png"
      }
    },
    "datePublished": article.published_at,
    "dateModified": article.updated_at || article.published_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://jupitlunar.com/${article.slug}`
    },
    "articleSection": article.hub,
    "keywords": article.entities?.join(', ') || 'maternal health, infant care, parenting',
    "inLanguage": article.lang || "en",
    "wordCount": article.body_md?.length || 0,
    "timeRequired": article.reading_time ? `PT${article.reading_time}M` : undefined,
    "isAccessibleForFree": true,
    "isPartOf": {
      "@type": "WebSite",
      "name": "JupitLunar",
      "url": "https://jupitlunar.com"
    }
  };

  // 添加FAQ结构化数据（如果有Q&A内容）
  if (article.qas && article.qas.length > 0) {
    const faqData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": article.qas.map(qa => ({
        "@type": "Question",
        "name": qa.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": qa.answer
        }
      }))
    };
    return [structuredData, faqData];
  }

  return [structuredData];
}

// 生成内容中心的结构化数据
export function generateHubStructuredData(hub: ContentHub, articles: Article[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": hub.name,
    "description": hub.description,
    "url": `https://jupitlunar.com/hub/${hub.slug}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": articles.length,
      "itemListElement": articles.map((article, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Article",
          "headline": article.title,
          "url": `https://jupitlunar.com/${article.slug}`,
          "datePublished": article.published_at,
          "dateModified": article.updated_at || article.published_at
        }
      }))
    },
    "publisher": {
      "@type": "Organization",
      "name": "JupitLunar",
      "url": "https://jupitlunar.com"
    },
    "inLanguage": "en",
    "isPartOf": {
      "@type": "WebSite",
      "name": "JupitLunar",
      "url": "https://jupitlunar.com"
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
    "url": "https://jupitlunar.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://jupitlunar.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "JupitLunar",
      "logo": {
        "@type": "ImageObject",
        "url": "https://jupitlunar.com/Assets/Logo.png"
      },
      "sameAs": [
        "https://twitter.com/jupitlunar",
        "https://linkedin.com/company/jupitlunar"
      ]
    },
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
    "url": "https://jupitlunar.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://jupitlunar.com/Assets/Logo.png",
      "width": 200,
      "height": 200
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "hello@jupitlunar.com"
    },
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
      "Parenting Technology"
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
