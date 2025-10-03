import type { ContentHub } from '@/types/content';

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

  const structuredData: Record<string, any> = {
    "@type": primaryType,
    "@id": `https://jupitlunar.com/${article.slug}#article`,
    "headline": article.title,
    "description": article.one_liner || article.body_md?.substring(0, 160),
    "abstract": tldrItems.length > 0 ? tldrItems.join(' • ') : undefined,
    "image": article.featured_image ? [article.featured_image] : undefined,
    "author": {
      "@type": article.reviewed_by ? 'Person' : 'Organization',
      "name": article.reviewed_by || 'JupitLunar',
    },
    "publisher": {
      "@type": "Organization",
      "name": "JupitLunar",
      "logo": {
        "@type": "ImageObject",
        "url": "https://jupitlunar.com/Assets/Logo.png",
      },
    },
    "datePublished": article.published_at,
    "dateModified": article.updated_at || article.published_at,
    "dateCreated": article.published_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://jupitlunar.com/${article.slug}`,
    },
    "articleSection": article.hub,
    "keywords": article.entities?.join(', ') || 'maternal health, infant care, parenting',
    "inLanguage": article.lang || 'en',
    "timeRequired": article.reading_time ? `PT${article.reading_time}M` : undefined,
    "isAccessibleForFree": true,
    "isPartOf": {
      "@type": "WebSite",
      "name": "JupitLunar",
      "url": "https://jupitlunar.com",
    },
    "speakable": {
      "@type": 'SpeakableSpecification',
      xpath: [
        "/html/body//h1",
        "/html/body//section[1]//p[1]",
      ],
    },
    // AEO优化：添加更多LLM友好的字段
    "educationalLevel": "General",
    "audience": {
      "@type": "PeopleAudience",
      "audienceType": "Parents and caregivers",
      "geographicArea": "North America"
    },
    "about": article.entities?.map((entity: string) => ({
      "@type": 'Thing',
      name: entity,
    })) || [],
    "mentions": article.citations?.map((citation: any) => ({
      "@type": "CreativeWork",
      "name": citation.title,
      "url": citation.url,
      "publisher": citation.publisher
    })) || [],
    "mainEntity": {
      "@type": "Question",
      "name": article.title,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": article.one_liner || article.body_md?.substring(0, 500)
      }
    }
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

  const graph: Record<string, any>[] = [structuredData];

  if (article.type === 'howto' && Array.isArray(article.how_to_steps) && article.how_to_steps.length > 0) {
    graph.push({
      "@type": "HowTo",
      "@id": `https://jupitlunar.com/${article.slug}#howto`,
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
      "@id": `https://jupitlunar.com/${article.slug}#recipe`,
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
      "@id": `https://jupitlunar.com/${article.slug}#faq`,
      "mainEntity": article.qas.map((qa: any, index: number) => ({
        "@type": "Question",
        "@id": `https://jupitlunar.com/${article.slug}#question-${index + 1}`,
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
      "@type": "MedicalWebPage",
      "@id": `https://jupitlunar.com/${article.slug}#medical`,
      "name": article.title,
      "description": article.one_liner || article.body_md?.substring(0, 160),
      "lastReviewed": article.last_reviewed,
      "medicalSpecialty": article.hub,
      "inLanguage": article.lang || 'en',
      "audience": {
        "@type": "PeopleAudience",
        "audienceType": 'Parents and caregivers',
      },
    });
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
