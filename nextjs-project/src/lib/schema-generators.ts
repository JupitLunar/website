// Schema.org structured data generators for AEO optimization

interface ServingForm {
  age_range: string;
  form: string;
  texture?: string;
  prep?: string;
  notes?: string;
}

interface HowToInstruction {
  step: string;
  detail?: string;
}

// Generate HowTo schema for food preparation
export function generateFoodHowToSchema(food: {
  name: string;
  slug: string;
  serving_forms?: ServingForm[];
  how_to?: HowToInstruction[];
  risk_level?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://momaiagent.com';

  const steps = [];

  // Add serving form steps
  if (food.serving_forms && food.serving_forms.length > 0) {
    food.serving_forms.forEach((form, index) => {
      const stepText = [
        form.form,
        form.texture && `Texture: ${form.texture}`,
        form.prep && `Preparation: ${form.prep}`,
        form.notes && `Note: ${form.notes}`,
      ]
        .filter(Boolean)
        .join('. ');

      steps.push({
        '@type': 'HowToStep',
        position: index + 1,
        name: `For ${form.age_range}`,
        text: stepText,
        itemListElement: [
          form.prep && {
            '@type': 'HowToDirection',
            text: form.prep,
          },
          form.notes && {
            '@type': 'HowToTip',
            text: form.notes,
          },
        ].filter(Boolean),
      });
    });
  }

  // Add general how-to instructions
  if (food.how_to && food.how_to.length > 0) {
    food.how_to.forEach((instruction, index) => {
      steps.push({
        '@type': 'HowToStep',
        position: steps.length + 1,
        name: instruction.step,
        text: instruction.detail || instruction.step,
      });
    });
  }

  if (steps.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to prepare ${food.name} for babies`,
    description: `Safe preparation guide for ${food.name} by age, with choking risk information and step-by-step instructions.`,
    totalTime: 'PT5M',
    url: `${baseUrl}/foods/${food.slug}`,
    image: `${baseUrl}/foods/${food.slug}/image.jpg`,
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: '0',
    },
    step: steps,
  };
}

// Generate Breadcrumb schema
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://momaiagent.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${baseUrl}${crumb.url}`,
    })),
  };
}

// Generate FAQPage schema
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  if (faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
        author: {
          '@type': 'Organization',
          name: 'JupitLunar',
        },
        dateCreated: new Date().toISOString(),
      },
    })),
  };
}

// Generate ItemList schema for Key Takeaways
export function generateKeyTakeawaysSchema(takeaways: string[], context?: string) {
  if (takeaways.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: context ? `${context} - Key Takeaways` : 'Key Takeaways',
    description: 'Essential facts and quick reference points',
    numberOfItems: takeaways.length,
    itemListElement: takeaways.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item,
    })),
  };
}

// Generate HealthTopicContent schema for food pages
export function generateFoodHealthTopicSchema(food: {
  name: string;
  slug: string;
  age_range?: string[];
  nutrients_focus?: string[];
  risk_level?: string;
  last_reviewed_at?: string;
  expires_at?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://momaiagent.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'HealthTopicContent',
    name: `${food.name} for Babies and Toddlers`,
    url: `${baseUrl}/foods/${food.slug}`,
    description: `Evidence-based guide for introducing ${food.name} to babies and toddlers, including age guidelines, preparation methods, and safety information.`,
    audience: {
      '@type': 'PeopleAudience',
      name: 'Parents of infants and toddlers',
      suggestedMinAge: food.age_range?.[0] || '6 months',
    },
    about: {
      '@type': 'Thing',
      name: `${food.name} for infant feeding`,
    },
    keywords: [
      food.name,
      'baby food',
      'infant feeding',
      'complementary feeding',
      'BLW',
      ...(food.nutrients_focus || []),
    ].join(', '),
    dateModified: food.last_reviewed_at || new Date().toISOString(),
    sourceOrganization: {
      '@type': 'GovernmentOrganization',
      name: 'CDC, AAP, Health Canada',
    },
    hasHealthAspect: [
      'NutritionalAspect',
      'SafetyAspect',
      'DevelopmentalAspect',
    ],
  };
}

// Generate ClaimReview schema for myth-busting content
export function generateClaimReviewSchema(claim: {
  claimText: string;
  rating: 'True' | 'False' | 'Mixture';
  explanation: string;
  reviewedBy?: string;
  reviewDate?: string;
  sources?: Array<{ name: string; url: string }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ClaimReview',
    claimReviewed: claim.claimText,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: claim.rating === 'True' ? 5 : claim.rating === 'False' ? 1 : 3,
      bestRating: 5,
      worstRating: 1,
      alternateName: claim.rating,
    },
    reviewBody: claim.explanation,
    itemReviewed: {
      '@type': 'Claim',
      claimInterpreter: {
        '@type': 'Organization',
        name: 'JupitLunar',
      },
      appearance: {
        '@type': 'CreativeWork',
        headline: claim.claimText,
      },
    },
    author: {
      '@type': 'Organization',
      name: claim.reviewedBy || 'JupitLunar Editorial Team',
    },
    datePublished: claim.reviewDate || new Date().toISOString(),
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://momaiagent.com',
  };
}

// Generate CollectionPage schema for topic pages
export function generateTopicCollectionSchema(topic: {
  title: string;
  slug: string;
  description: string;
  ageRange?: string;
  lastReviewed?: string;
  itemCount?: number;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://momaiagent.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: topic.title,
    url: `${baseUrl}/topics/${topic.slug}`,
    description: topic.description,
    about: {
      '@type': 'Thing',
      name: 'Infant and toddler feeding',
    },
    audience: {
      '@type': 'PeopleAudience',
      name: 'Parents of infants and toddlers',
      suggestedMinAge: topic.ageRange?.split('–')[0] || '0 months',
      suggestedMaxAge: topic.ageRange?.split('–')[1] || '24 months',
    },
    dateModified: topic.lastReviewed || new Date().toISOString(),
    isPartOf: {
      '@type': 'WebSite',
      name: 'JupitLunar',
      url: baseUrl,
    },
    ...(topic.itemCount && {
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: topic.itemCount,
      },
    }),
  };
}
