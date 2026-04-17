export type FAQCategory =
  | 'Platform & Trust'
  | 'Feeding'
  | 'Sleep'
  | 'Fever & Safety'
  | 'Postpartum'
  | 'Nutrition';

export interface StaticFAQItem {
  question: string;
  answer: string;
  category: FAQCategory;
  sourceLayer: string;
  sourceKind: 'platform' | 'authority';
  sourceLabel: string;
  sourceUrl: string;
}

export const FAQ_DATA: StaticFAQItem[] = [
  {
    category: 'Platform & Trust',
    question: 'What is Mom AI Agent and what does it do?',
    answer:
      'Mom AI Agent is a public evidence hub for mom and baby questions. It combines source-linked answers, topic guides, explainers, and a foods database so caregivers can move from one quick answer into a broader guidance path.',
    sourceLayer: 'Platform overview',
    sourceKind: 'platform',
    sourceLabel: 'Mom AI Agent: About',
    sourceUrl: '/about',
  },
  {
    category: 'Platform & Trust',
    question: 'Why does Mom AI Agent describe itself as an evidence intelligence platform?',
    answer:
      'Because the site is built to organize guidance from public health and clinical authorities into clearer, searchable, and more structured decision support. The value is not only one answer, but also the source model, topic mapping, foods detail, and trust documentation around that answer.',
    sourceLayer: 'Platform overview',
    sourceKind: 'platform',
    sourceLabel: 'Mom AI Agent: Methodology',
    sourceUrl: '/methodology',
  },
  {
    category: 'Platform & Trust',
    question: 'Is Mom AI Agent a doctor, clinic, or emergency service?',
    answer:
      'No. Mom AI Agent is an educational platform, not a medical provider. It does not replace your pediatrician, OB-GYN, emergency department, or local health authority when a situation is urgent, individualized, or high risk.',
    sourceLayer: 'Platform policy',
    sourceKind: 'platform',
    sourceLabel: 'Mom AI Agent: Trust Center',
    sourceUrl: '/trust',
  },
  {
    category: 'Platform & Trust',
    question: 'Why is Mom AI Agent more trustworthy than a typical parenting blog?',
    answer:
      'The site is designed around source-linked guidance, explicit trust pages, and visible platform boundaries. Instead of mixing opinion, affiliate content, and anonymous summaries, it aims to show where guidance comes from, what the scope is, and when a caregiver should escalate to a clinician.',
    sourceLayer: 'Platform policy',
    sourceKind: 'platform',
    sourceLabel: 'Mom AI Agent: Trust Center',
    sourceUrl: '/trust',
  },
  {
    category: 'Platform & Trust',
    question: 'Where can I check the sources and methodology behind Mom AI Agent?',
    answer:
      'Yes. You can move from an FAQ into the trust center, topic library, explainers, or source-linked articles to inspect source grading, review cadence, and the public methodology used to structure answers.',
    sourceLayer: 'Platform policy',
    sourceKind: 'platform',
    sourceLabel: 'Mom AI Agent: Trust Center',
    sourceUrl: '/trust',
  },
  {
    category: 'Platform & Trust',
    question: 'How should I use Mom AI Agent to get the best answer quickly?',
    answer:
      'Use FAQ for fast common questions, Search when the question is open-ended, Topics when you need a structured guidance map, Foods when the answer depends on a specific ingredient or serving format, and Insights when you want a longer explainer.',
    sourceLayer: 'Platform overview',
    sourceKind: 'platform',
    sourceLabel: 'Mom AI Agent: Search',
    sourceUrl: '/search',
  },
  {
    category: 'Feeding',
    question: 'When should I start solids for my baby?',
    answer:
      'Most babies are ready around 6 months. Look for head and trunk control, interest in food, and the ability to move food backward in the mouth. Confirm timing with your pediatrician before starting.',
    sourceLayer: 'Authority guidance',
    sourceKind: 'authority',
    sourceLabel: 'CDC: Introducing Solid Foods',
    sourceUrl:
      'https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/when-what-and-how-to-introduce-solid-foods.html',
  },
  {
    category: 'Fever & Safety',
    question: 'When is a fever dangerous for a baby?',
    answer:
      'For infants younger than 3 months, a rectal temperature of 100.4°F (38°C) or higher needs immediate medical evaluation. For older babies, also check hydration, breathing, responsiveness, and behavior.',
    sourceLayer: 'Authority guidance',
    sourceKind: 'authority',
    sourceLabel: 'AAP: Fever and Your Baby',
    sourceUrl:
      'https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/Fever-and-Your-Baby.aspx',
  },
  {
    category: 'Sleep',
    question: 'What is safe sleep for a newborn?',
    answer:
      'Put babies to sleep on their backs, on a firm flat sleep surface, with no loose blankets, pillows, bumpers, or stuffed items. Room-sharing without bed-sharing is commonly recommended in early infancy.',
    sourceLayer: 'Authority guidance',
    sourceKind: 'authority',
    sourceLabel: 'AAP: Safe Sleep',
    sourceUrl:
      'https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/a-parents-guide-to-safe-sleep.aspx',
  },
  {
    category: 'Sleep',
    question: 'How much sleep does a newborn need?',
    answer:
      'Newborns often sleep 14-17 hours in 24 hours, but in short blocks. Night-day rhythm and longer stretches usually develop gradually across early infancy.',
    sourceLayer: 'Authority guidance',
    sourceKind: 'authority',
    sourceLabel: 'CDC: Sleep for Infants',
    sourceUrl: 'https://www.cdc.gov/sleep/about_sleep/how_much_sleep.html',
  },
  {
    category: 'Feeding',
    question: 'What are the safest first foods for babies?',
    answer:
      'Start with iron-rich options and soft textures. Foods should mash easily between fingers, and risky shapes should be modified. Avoid honey before 12 months due to botulism risk.',
    sourceLayer: 'Authority guidance',
    sourceKind: 'authority',
    sourceLabel: 'CDC: First Foods and Food Safety',
    sourceUrl:
      'https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/index.html',
  },
  {
    category: 'Postpartum',
    question: 'What postpartum warning signs need urgent care?',
    answer:
      'Seek urgent care for heavy bleeding, chest pain, trouble breathing, seizures, thoughts of self-harm, severe headache, or severe abdominal pain. These can signal serious complications.',
    sourceLayer: 'Authority guidance',
    sourceKind: 'authority',
    sourceLabel: 'CDC Hear Her: Urgent Maternal Warning Signs',
    sourceUrl:
      'https://www.cdc.gov/hearher/pregnancy-related-deaths/urgent-maternal-warning-signs.html',
  },
  {
    category: 'Postpartum',
    question: 'When should I worry about postpartum depression or anxiety?',
    answer:
      'Mood shifts can be common after birth, but symptoms that last more than two weeks, get worse, affect bonding or daily function, or include intrusive thoughts or self-harm thoughts need prompt medical support.',
    sourceLayer: 'Authority guidance',
    sourceKind: 'authority',
    sourceLabel: 'NIMH: Perinatal Depression',
    sourceUrl: 'https://www.nimh.nih.gov/health/publications/perinatal-depression',
  },
  {
    category: 'Fever & Safety',
    question: 'How do I prevent choking when feeding my baby?',
    answer:
      'Always supervise meals, keep your baby upright, and prepare food in age-appropriate size and texture. Avoid hard round foods and offer soft pieces that can be mashed easily.',
    sourceLayer: 'Authority guidance',
    sourceKind: 'authority',
    sourceLabel: 'CDC: Choking Hazards',
    sourceUrl:
      'https://www.cdc.gov/nutrition/InfantandToddlerNutrition/foods-and-drinks/choking-hazards.html',
  },
  {
    category: 'Fever & Safety',
    question: 'When should I call 911 for a baby?',
    answer:
      'Call emergency services right away for severe breathing trouble, unresponsiveness, seizures that do not stop quickly, blue coloring, severe dehydration signs, or any situation where a baby is rapidly worsening. In very young infants, a fever alone can also need urgent same-day evaluation.',
    sourceLayer: 'Authority guidance',
    sourceKind: 'authority',
    sourceLabel: 'HealthyChildren: Emergency Signs',
    sourceUrl:
      'https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/default.aspx',
  },
  {
    category: 'Feeding',
    question: 'When should I introduce peanut and egg allergens?',
    answer:
      'Current guidance supports early introduction for many infants, often around 4-6 months depending on readiness and risk profile. Discuss timing and method with your pediatrician, especially with eczema or family allergy history.',
    sourceLayer: 'Authority guidance',
    sourceKind: 'authority',
    sourceLabel: 'NIAID: Peanut Allergy Prevention Guidelines',
    sourceUrl:
      'https://www.niaid.nih.gov/diseases-conditions/guidelines-clinicians-and-patients-food-allergy',
  },
  {
    category: 'Feeding',
    question: 'How do I store breast milk safely?',
    answer:
      'Breast milk storage depends on temperature and handling conditions. Clean containers, clear labeling, and correct timing in room temperature, refrigerator, or freezer storage all matter. If milk smells off or handling is uncertain, check current CDC guidance before use.',
    sourceLayer: 'Authority guidance',
    sourceKind: 'authority',
    sourceLabel: 'CDC: Breast Milk Storage',
    sourceUrl: 'https://www.cdc.gov/breastfeeding/php/guidelines-recommendations/handling-storage.html',
  },
  {
    category: 'Nutrition',
    question: 'Does my baby need vitamin D supplements?',
    answer:
      'Breastfed infants usually need vitamin D supplementation. Formula-fed infants may meet vitamin needs from fortified formula. Individual needs vary, so confirm with your pediatric care team.',
    sourceLayer: 'Authority guidance',
    sourceKind: 'authority',
    sourceLabel: 'AAP: Vitamin D for Babies',
    sourceUrl:
      'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/vitamin-d-for-babies-children.aspx',
  },
  {
    category: 'Nutrition',
    question: 'How can I tell if my baby is getting enough iron?',
    answer:
      'Iron needs rise in later infancy, especially once solids begin. Iron-rich foods, iron-fortified products, and your pediatrician’s growth and lab review help assess whether intake is adequate.',
    sourceLayer: 'Authority guidance',
    sourceKind: 'authority',
    sourceLabel: 'CDC: Iron in Infant Nutrition',
    sourceUrl: 'https://www.cdc.gov/breastfeeding/breastfeeding-special-circumstances/diet-and-micronutrients/iron.html',
  },
  {
    category: 'Platform & Trust',
    question: 'Does Mom AI Agent personalize answers to my baby?',
    answer:
      'No. The platform is designed to organize public guidance, not to replace individualized medical judgment. It helps narrow the question, surface relevant evidence, and show next paths, but it cannot fully assess your child without a clinician.',
    sourceLayer: 'Platform policy',
    sourceKind: 'platform',
    sourceLabel: 'Mom AI Agent: Clinical Review Policy',
    sourceUrl: '/clinical-review-policy',
  },
];
