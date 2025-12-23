/**
 * AEO (AI Engine Optimization) 优化工具
 * 专门为LLM搜索优化设计
 */

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.momaiagent.com').replace(/\/$/, '');

// 生成面向教育内容的 WebPage + Article Schema
export function generateMedicalWebPageSchema(article: any) {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["WebPage", "Article"],
    "@id": `${siteUrl}/${article.slug}#medical-page`,
    "headline": article.title,
    "description": article.one_liner,
    "about": {
      "@type": "Thing",
      "name": article.hub || "Maternal and infant wellness",
      "description": `Parenting guidance referencing official sources for ${article.age_range || '0-24 months'}`
    },
    "inLanguage": article.lang === 'en' ? 'en-US' : article.lang || 'en-US',
    "datePublished": article.date_published,
    "dateModified": article.date_modified,
    "lastReviewed": article.last_reviewed,
    "author": {
      "@type": "Organization",
      "name": "Mom AI Agent Editorial Team",
      "description": "Evidence-based parenting content curation studio",
      "url": `${siteUrl}/about`,
      "memberOf": {
        "@type": "Organization",
        "name": "JupitLunar"
      }
    },
    "reviewedBy": {
      "@type": "Organization",
      "name": "Guidance references CDC, AAP, WHO, Health Canada publications",
      "description": "Articles cite official government and medical organization guidelines; DearBaby is an educational publisher, not a clinic."
    },
    "publisher": {
      "@type": "Organization",
      "name": "JupitLunar",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/Assets/Logo.png`,
        "width": 200,
        "height": 60
      },
      "url": siteUrl
    },
    "audience": {
      "@type": "PeopleAudience",
      "audienceType": "Parents and caregivers of infants and toddlers",
      "geographicArea": article.region === 'Global' ? "North America" : article.region
    },
    "isPartOf": {
      "@type": "WebSite",
      "name": "Mom AI Agent",
      "url": siteUrl
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", ".bottom-line", ".key-facts"]
    },
    "disclaimer": "Educational resource referencing public-health guidelines; not a medical diagnosis or clinic.",
    "keywords": article.keywords?.join(', ') || article.entities?.join(', ') || 'infant health, baby development, parenting',
    "isBasedOn": (article.citations || []).slice(0, 3).map((citation: any) => ({
      "@type": "CreativeWork",
      "name": citation.title,
      "url": citation.url,
      "publisher": citation.publisher
    }))
  };

  return schema;
}

// 生成ClaimReview反谣言Schema
export function generateClaimReviewSchema({
  claimText,
  rating,
  reviewExplanation,
  authoritySource,
  authorityUrl,
  articleUrl
}: {
  claimText: string;
  rating: 'True' | 'False' | 'PartiallyTrue';
  reviewExplanation: string;
  authoritySource: string;
  authorityUrl: string;
  articleUrl: string;
}) {
  const ratingValue = rating === 'True' ? 5 : rating === 'False' ? 1 : 3;
  
  return {
    "@context": "https://schema.org",
    "@type": "ClaimReview",
    "@id": `${articleUrl}#claim-review`,
    "claimReviewed": claimText,
    "reviewRating": {
      "@type": "Rating",
      ratingValue,
      "alternateName": rating,
      "bestRating": 5,
      "worstRating": 1
    },
    "author": {
      "@type": "Organization",
      "name": "JupitLunar Editorial Team",
      "url": "https://www.momaiagent.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "JupitLunar",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.momaiagent.com/Assets/Logo.png"
      }
    },
    "url": articleUrl,
    "datePublished": new Date().toISOString().split('T')[0],
    "reviewBody": reviewExplanation,
    "itemReviewed": {
      "@type": "Claim",
      "appearance": {
        "@type": "WebPage",
        "url": authorityUrl,
        "name": authoritySource
      }
    }
  };
}

// 生成US/CA对比表格的结构化数据
export function generateComparisonTableSchema({
  topic,
  usData,
  caData,
  articleUrl
}: {
  topic: string;
  usData: Record<string, string>;
  caData: Record<string, string>;
  articleUrl: string;
}) {
  const comparisonItems = Object.keys(usData).map(key => ({
    "@type": "ListItem",
    "position": Object.keys(usData).indexOf(key) + 1,
    "item": {
      "@type": "Table",
      "about": key,
      "description": `Comparison of ${key} between US and Canada`,
      "hasPart": [
        {
          "@type": "TableCell",
          "text": usData[key],
          "additionalProperty": {
            "@type": "PropertyValue",
            "name": "Country",
            "value": "United States"
          }
        },
        {
          "@type": "TableCell", 
          "text": caData[key],
          "additionalProperty": {
            "@type": "PropertyValue",
            "name": "Country",
            "value": "Canada"
          }
        }
      ]
    }
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Table",
    "@id": `${articleUrl}#us-canada-comparison`,
    "name": `US vs Canada: ${topic}`,
    "description": `Comparison of ${topic} guidelines between United States and Canada`,
    "about": topic,
    "hasPart": comparisonItems,
    "isPartOf": {
      "@type": "WebPage",
      "url": articleUrl
    }
  };
}

// 生成hreflang元数据
export function generateHreflangMetadata(slug: string, region?: string) {
  const baseUrl = siteUrl;
  const allowed = (process.env.NEXT_PUBLIC_HREFLANG_LANGS || 'en-US,en-CA,x-default')
    .split(',')
    .map(l => l.trim())
    .filter(Boolean);

  const languages: Record<string, string> = {};

  if (allowed.includes('x-default')) {
    languages['x-default'] = `${baseUrl}/${slug}`;
  }
  if (allowed.includes('en-US')) {
    languages['en-US'] = `${baseUrl}/en-us/${slug}`;
  }
  if (allowed.includes('en-CA')) {
    languages['en-CA'] = `${baseUrl}/en-ca/${slug}`;
  }
  if (allowed.includes('zh-CN')) {
    languages['zh-CN'] = `${baseUrl}/zh-cn/${slug}`;
  }

  // 优先匹配地区特定版本（如果允许）
  if (region === 'US' && allowed.includes('en-US')) {
    languages['en-US'] = `${baseUrl}/en-us/${slug}`;
  } else if (region === 'CA' && allowed.includes('en-CA')) {
    languages['en-CA'] = `${baseUrl}/en-ca/${slug}`;
  }

  return {
    canonical: `/${slug}`,
    languages
  };
}

// 生成"首屏即答案"格式的内容摘要
export function generateBottomLineSummary(article: any): string {
  const keyFacts = Array.isArray(article.key_facts) ? article.key_facts : [];
  const ageRange = article.age_range || '0-24 months';
  const region = article.region === 'Global' ? 'North America' : article.region;
  
  // 提取关键数字和事实
  const numbers = keyFacts.filter((fact: any) => 
    typeof fact === 'string' && /\d+/.test(fact)
  );
  
  const mainFacts = keyFacts.slice(0, 3);
  
  return `${article.title.replace('?', '')}: ${mainFacts.join('; ')}. Based on ${region} guidelines for ${ageRange}.`;
}

// 生成可机器解析的FAQ格式
export function generateMachineReadableFAQ(article: any) {
  if (!article.qas || !Array.isArray(article.qas)) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${siteUrl}/${article.slug}#faq`,
    "mainEntity": article.qas.map((qa: any, index: number) => ({
      "@type": "Question",
      "@id": `${siteUrl}/${article.slug}#question-${index + 1}`,
      "name": qa.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": qa.answer,
        "dateCreated": article.date_published,
        "upvoteCount": 0,
        "url": qa.url || undefined
      },
      "author": {
        "@type": "Organization",
        "name": "JupitLunar Editorial Team"
      }
    })),
    "about": {
      "@type": "Thing",
      "name": article.title,
      "description": article.one_liner
    }
  };
}

// 生成AI优化的内容摘要
export function generateAIOptimizedSummary(content: string): {
  bottomLine: string;
  keyNumbers: string[];
  actionItems: string[];
} {
  // 提取关键数字（年龄、剂量、频率等）
  const numberPattern = /\b(\d+)\s*(months?|years?|days?|weeks?|mg|ml|oz|tbsp|tsp|iu|mcg)\b/gi;
  const keyNumbers = Array.from(new Set(
    content.match(numberPattern) || []
  )).slice(0, 5);

  // 提取行动项目（以动词开头的句子）
  const actionPattern = /(?:Start|Begin|Offer|Give|Introduce|Avoid|Wait|Continue|Stop|Use|Try|Ensure|Monitor|Contact|Seek|Consult)\s+[^.!?]*[.!?]/gi;
  const actionItems = Array.from(new Set(
    (content.match(actionPattern) || []).slice(0, 3)
  ));

  // 生成首句摘要
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const bottomLine = sentences[0]?.trim() || `${content.substring(0, 150)}...`;

  return {
    bottomLine,
    keyNumbers,
    actionItems
  };
}

// 生成权威来源引用
export function generateAuthorityCitations(article: any) {
  const citations = article.citations || [];
  
  return citations.map((citation: any) => ({
    "@type": "WebPage",
    "@id": citation.url,
    "name": citation.title,
    "url": citation.url,
    "author": {
      "@type": "Organization",
      "name": citation.author || citation.publisher
    },
    "publisher": {
      "@type": "Organization", 
      "name": citation.publisher
    },
    "datePublished": citation.date,
    "isPartOf": {
      "@type": "WebSite",
      "name": citation.publisher
    }
  }));
}

// 生成完整的AEO优化Schema组合
export function generateCompleteAEOSchema(article: any) {
  const schemas: any[] = [
    generateMedicalWebPageSchema(article)
  ];

  const faqSchema = generateMachineReadableFAQ(article);
  if (faqSchema) {
    schemas.push(faqSchema);
  }

  if (article.region === 'Global' && article.us_ca_comparison && article.us_ca_comparison.us && article.us_ca_comparison.ca) {
    schemas.push(generateComparisonTableSchema({
      topic: article.title,
      usData: article.us_ca_comparison.us,
      caData: article.us_ca_comparison.ca,
      articleUrl: `${siteUrl}/${article.slug}`
    }));
  }

  if (Array.isArray(article.claim_reviews)) {
    article.claim_reviews.forEach((claim: any) => {
      if (claim.claimText && claim.rating && claim.reviewExplanation && claim.articleUrl) {
        schemas.push(generateClaimReviewSchema(claim));
      }
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": schemas
  };
}

export default {
  generateMedicalWebPageSchema,
  generateClaimReviewSchema,
  generateComparisonTableSchema,
  generateHreflangMetadata,
  generateBottomLineSummary,
  generateMachineReadableFAQ,
  generateAIOptimizedSummary,
  generateAuthorityCitations,
  generateCompleteAEOSchema
};
