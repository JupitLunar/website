export interface TopicCatalogItem {
  slug: string;
  title: string;
  blurb: string;
  focus: string;
  href: string;
}

export const TOPIC_CATALOG: TopicCatalogItem[] = [
  {
    slug: 'north-america-overview',
    title: 'North America Overview',
    blurb: 'Executive summary of critical health milestones, safety guardrails, and nutrient requirements for 0-24 months.',
    focus: 'Regional Overview',
    href: '/topics/north-america-overview',
  },
  {
    slug: 'feeding-foundations',
    title: 'Feeding Foundations',
    blurb: 'Developmental readiness cues, texture progression protocols, and bottle-to-cup transition timelines.',
    focus: 'Feeding Basics',
    href: '/topics/feeding-foundations',
  },
  {
    slug: 'allergen-readiness',
    title: 'Allergen Introduction',
    blurb: 'Evidence-based protocols for early allergen exposure, including dosing schedules and safety monitoring.',
    focus: 'Allergen Guidance',
    href: '/topics/allergen-readiness',
  },
  {
    slug: 'safety-and-hygiene',
    title: 'Safety & Hygiene',
    blurb: 'Choking prevention guidelines, food safety standards, and hygiene protocols for caregivers.',
    focus: 'Prevention',
    href: '/topics/safety-and-hygiene',
  },
  {
    slug: 'nutrient-priorities',
    title: 'Nutrient Priorities',
    blurb: 'Clinical requirements for iron, vitamin D, and calcium. Supplementation guidelines and absorption optimization.',
    focus: 'Nutrient Guidance',
    href: '/topics/nutrient-priorities',
  },
  {
    slug: 'travel-daycare',
    title: 'Logistics: Travel & Care',
    blurb: 'Breastmilk storage protocols, safe transport guidelines, and caregiver handoff checklists.',
    focus: 'Logistics',
    href: '/topics/travel-daycare',
  },
  {
    slug: 'holiday-planning',
    title: 'Seasonal Strategy',
    blurb: 'Managing holiday meals, sodium limits, and cross-contamination risks during gatherings.',
    focus: 'Social Safety',
    href: '/topics/holiday-planning',
  },
];

export function getTopicCatalogItem(slug: string) {
  return TOPIC_CATALOG.find((topic) => topic.slug === slug) || null;
}
