import type {
  BaseContent,
  ContentHub,
  ContentStats,
  ContentType,
  Citation,
  FAQItem,
  HowToStep,
  Ingredient,
  Language,
  RecipeStep
} from '@/types/content';

export interface MockContentHub {
  id: ContentHub;
  slug: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  article_count: number;
  last_updated: string;
  locale?: string;
}

export interface MockArticle extends BaseContent {
  status: 'published';
  date_modified: string;
  body_md?: string;
  citations: Citation[];
  qas?: FAQItem[];
  how_to_steps?: HowToStep[];
  recipe_ingredients?: Ingredient[];
  recipe_steps?: RecipeStep[];
}

export interface HubHighlightDatum {
  label: string;
  value: string;
  source: string;
  sourceUrl: string;
  published: string;
}

export interface HubHighlight {
  headline: string;
  lastValidated: string;
  datapoints: HubHighlightDatum[];
  disclaimer?: string;
}

const iso = (date: string) => new Date(date).toISOString();

export const mockContentHubs: MockContentHub[] = [
  {
    id: 'feeding',
    slug: 'feeding',
    name: '喂养营养中心',
    description:
      '追踪母乳、配方奶与辅食的最新安全标准、供给监测和营养策略，让 0–24 个月宝宝摄入更安心。',
    color: '#7C6FF6',
    icon: '/Assets/summary.png',
    article_count: 18,
    last_updated: iso('2025-01-12T08:00:00Z'),
    locale: 'US'
  },
  {
    id: 'development',
    slug: 'development',
    name: '宝宝发育中心',
    description:
      '提供月龄里程碑、筛查工具与早疗指南，帮助照护者识别早期信号并连接专业资源。',
    color: '#1D9A6C',
    icon: '/Assets/babydashboard.png',
    article_count: 22,
    last_updated: iso('2025-01-09T10:00:00Z'),
    locale: 'US'
  },
  {
    id: 'sleep',
    slug: 'sleep',
    name: '睡眠习惯中心',
    description:
      '聚焦安全睡眠规则、作息调节与可穿戴监测数据，降低婴儿猝死风险并优化全家睡眠质量。',
    color: '#4535D6',
    icon: '/Assets/sunset.png',
    article_count: 16,
    last_updated: iso('2025-01-15T05:30:00Z'),
    locale: 'US'
  },
  {
    id: 'mom-health',
    slug: 'mom-health',
    name: '妈妈健康中心',
    description:
      '关注妊娠期与产后 12 个月的生理、心理健康，包括筛查流程、干预窗口与资源导航。',
    color: '#E24A8D',
    icon: '/Assets/mom_health_analysis.png',
    article_count: 19,
    last_updated: iso('2025-01-18T14:45:00Z'),
    locale: 'US'
  },
  {
    id: 'safety',
    slug: 'safety',
    name: '安全急救中心',
    description:
      '覆盖事故预防、急救流程与召回监测，帮助家庭在紧急情况前就建立响应清单。',
    color: '#F25F5C',
    icon: '/Assets/event.png',
    article_count: 21,
    last_updated: iso('2025-01-11T17:20:00Z'),
    locale: 'US'
  },
  {
    id: 'recipes',
    slug: 'recipes',
    name: '食谱辅食中心',
    description:
      '结合美国与加拿大儿科学会建议，为 6–24 个月宝宝提供科学辅食与过敏原引入计划。',
    color: '#FF9636',
    icon: '/Assets/recipes.png',
    article_count: 24,
    last_updated: iso('2025-01-07T09:15:00Z'),
    locale: 'US'
  }
];

const buildCitations = (items: Array<Omit<Citation, 'id'>>): Citation[] =>
  items.map((item, index) => ({
    id: `mock-citation-${index}`,
    ...item
  }));

const reviewersByline = 'Clinical review: Katherine Lin, RN, IBCLC';

const defaultKeyFacts = (
  facts: string[]
): string[] =>
  facts.length >= 3
    ? facts
    : [...facts, 'Reviewed every 180 days for new regulatory guidance', 'Sources logged with digital chain-of-custody'].slice(0, 5);

const createArticle = (article: Partial<MockArticle> & Pick<MockArticle, 'slug' | 'title' | 'hub' | 'type' | 'one_liner' | 'key_facts' | 'entities' | 'date_published' | 'last_reviewed'>): MockArticle => {
  const base: MockArticle = {
    id: `mock-${article.hub}-${article.slug}`,
    slug: article.slug,
    type: article.type,
    hub: article.hub,
    lang: article.lang ?? 'en',
    title: article.title,
    one_liner: article.one_liner,
    key_facts: defaultKeyFacts(article.key_facts),
    age_range: article.age_range ?? '0-24 months',
    region: article.region ?? 'US',
    last_reviewed: article.last_reviewed,
    reviewed_by: article.reviewed_by ?? reviewersByline,
    date_published: article.date_published,
    date_modified: article.date_modified ?? article.date_published,
    body_md: article.body_md ?? '',
    entities: article.entities,
    citations: article.citations ?? [],
    images: article.images,
    license: article.license ?? 'CC BY-NC 4.0',
    meta_title: article.meta_title ?? article.title,
    meta_description: article.meta_description ?? article.one_liner,
    keywords: article.keywords ?? article.entities.slice(0, 6),
    status: 'published',
    qas: article.qas,
    how_to_steps: article.how_to_steps,
    recipe_ingredients: article.recipe_ingredients,
    recipe_steps: article.recipe_steps
  };

  if (base.citations.length === 0) {
    base.citations = buildCitations([
      {
        title: 'Centers for Disease Control and Prevention. Breastfeeding Report Card 2024.',
        url: 'https://www.cdc.gov/breastfeeding/data/reportcard.htm',
        publisher: 'CDC',
        date: '2024-08-01'
      }
    ]);
  }

  return base;
};

export const mockHubArticles: Record<ContentHub, MockArticle[]> = {
  feeding: [
    createArticle({
      slug: '2025-formula-safety-watchlist',
      title: '2025 Infant Formula Safety Watchlist: Recall Trends & Stock Signals',
      type: 'news',
      hub: 'feeding',
      one_liner:
        'We track FDA recall alerts and supply chain data weekly—2025 remains stable with <2% factory outage risk, but powdered formula recalls spiked in January.',
      key_facts: [
        'January 2025: FDA logged 3 Class I powdered formula recalls, all resolved within 14 days.',
        'Domestic production throughput is at 98% of 2024 baseline per USDA supply reporting.',
        'Parents should check lot codes via FDA portal and register for IndexNow push alerts in our dashboard.'
      ],
      entities: [
        'U.S. Food and Drug Administration',
        'infant formula recall',
        'Cronobacter sakazakii',
        'supply chain monitoring',
        'IndexNow alerts'
      ],
      date_published: iso('2025-01-10T09:00:00Z'),
      last_reviewed: iso('2025-01-11T16:00:00Z'),
      citations: buildCitations([
        {
          title: 'FDA Infant Formula Recall List (Accessed Jan 2025)',
          url: 'https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts/infant-formula',
          publisher: 'FDA',
          date: '2025-01-11'
        },
        {
          title: 'USDA Dairy Market News - Dry Products (Week of Jan 6, 2025)',
          url: 'https://www.ams.usda.gov/mnreports/dymdrymilk.pdf',
          publisher: 'USDA'
        }
      ]),
      qas: [
        {
          question: 'How can I verify if my formula batch is recalled?',
          answer: 'Locate the lot code and expiration date printed on the bottom of the can, then cross-check it with the FDA recall portal or scan it using the JupitLunar recall checker.',
          url: '#recall-check'
        },
        {
          question: 'What symptoms of Cronobacter infection should I monitor?',
          answer: 'Watch for fever, poor feeding, or low energy in formula-fed infants under 12 months and contact your pediatrician immediately if symptoms appear.',
          url: '#cronobacter-symptoms'
        }
      ]
    }),
    createArticle({
      slug: 'breastfeeding-supply-guide-2025',
      title: 'Evidence-Based Breastfeeding Supply Guide (0–6 Months)',
      type: 'howto',
      hub: 'feeding',
      one_liner:
        'Daily milk volume targets range from 20–28 oz by week 6; pump schedules should match infant demand and be reviewed every 4 weeks.',
      key_facts: [
        'Average exclusively breastfed infant consumes 25 oz/day by 6 weeks (CDC IFPS II).',
        'Double electric pump sessions of 15–20 minutes mimic effective let-downs.',
        'Introduce paced bottle feeds with slow-flow nipples to maintain latch consistency.'
      ],
      entities: [
        'breastfeeding supply',
        'pumping schedule',
        'paced bottle feeding',
        'lactation consultant',
        'milk storage safety'
      ],
      date_published: iso('2024-12-18T13:30:00Z'),
      last_reviewed: iso('2025-01-04T10:00:00Z'),
      citations: buildCitations([
        {
          title: 'Infant Feeding Practices Study II: Vol II',
          url: 'https://www.cdc.gov/breastfeeding/data/ifps/results.htm',
          publisher: 'CDC'
        },
        {
          title: 'Academy of Breastfeeding Medicine Protocol #8: Human Milk Storage',
          url: 'https://www.bfmed.org/assets/DOCUMENTS/PROTOCOLS/Protocol%20%238.pdf',
          publisher: 'ABM',
          date: '2023-10-01'
        }
      ]),
      how_to_steps: [
        {
          step_number: 1,
          title: 'Audit Feeding Volumes',
          description: 'Log every feed for 72 hours using our tracker or a paper chart to confirm average daily intake and overnight spacing.',
          time_required: '72 hours'
        },
        {
          step_number: 2,
          title: 'Align Pump Schedule',
          description: 'Match pumps to infant demand windows (every 2.5–3 hours daytime) and add a 2 a.m. session until supply stabilizes.',
          time_required: '30 minutes per session'
        },
        {
          step_number: 3,
          title: 'Review Latch & Output',
          description: 'Share pump volumes and diaper counts with an IBCLC every 4 weeks or sooner if output dips below 20 oz/day.'
        }
      ]
    })
  ],
  sleep: [
    createArticle({
      slug: '2025-safe-sleep-audit',
      title: 'Safe Sleep Audit: 2025 Update on AAP Guidance & Wearable Data',
      type: 'explainer',
      hub: 'sleep',
      one_liner:
        'Room-sharing without bed-sharing through 12 months cuts SUID risk by 50%; wearables notify but do not replace ABCs of sleep.',
      key_facts: [
        'SUID rate dropped to 89.9 per 100k live births in 2023 but remains above Healthy People 2030 goal.',
        'Only 39% of U.S. caregivers report a true “bare crib” setup (Pediatrics 2024).',
        'Overnight oxygen saturation alerts from wearables show high false-positive rates (>80%).'
      ],
      entities: [
        'American Academy of Pediatrics',
        'Sudden Unexpected Infant Death',
        'wearable baby monitor',
        'room sharing',
        'safe sleep audit'
      ],
      date_published: iso('2025-01-05T04:30:00Z'),
      last_reviewed: iso('2025-01-15T06:00:00Z'),
      citations: buildCitations([
        {
          title: 'AAP Policy Statement: Sleep-Related Infant Deaths (2022 Update)',
          url: 'https://publications.aap.org/pediatrics/article/150/1/e2022057990/188918',
          publisher: 'American Academy of Pediatrics',
          date: '2022-07-01'
        },
        {
          title: 'CDC SUID Data Portal (Accessed Jan 2025)',
          url: 'https://www.cdc.gov/sids/data.htm',
          publisher: 'CDC'
        }
      ]),
      qas: [
        {
          question: 'Do baby movement monitors reduce SIDS risk?',
          answer: 'No. FDA-cleared devices can alert caregivers but have not demonstrated a reduction in SIDS/SUID outcomes. Continue ABCs: Alone, on Back, in a Crib.',
          url: '#wearables'
        }
      ]
    }),
    createArticle({
      slug: 'nap-transition-roadmap',
      title: 'Nap Transition Roadmap: 4 to 18 Months',
      type: 'howto',
      hub: 'sleep',
      one_liner:
        'Expect 3 naps until 5–6 months, 2 naps until 13–15 months, and watch wake windows shrinking by 30 minutes during growth spurts.',
      key_facts: [
        'Overnight sleep consolidates to 10–12 hours by 6 months with consistent bedtime routines.',
        'The 3-to-2 nap drop typically occurs when wake windows exceed 2.5 hours.',
        'Overtired cues peak 15 minutes before usual nap onset—track HRV or yawning patterns.'
      ],
      entities: [
        'nap schedule',
        'wake windows',
        'sleep regression',
        'HRV tracking',
        'circadian rhythm'
      ],
      date_published: iso('2024-11-02T14:00:00Z'),
      last_reviewed: iso('2025-01-06T18:30:00Z'),
      how_to_steps: [
        {
          step_number: 1,
          title: 'Baseline Logging',
          description: 'Capture 7 days of naps, bedtime, overnight wakes, and average wake windows.'
        },
        {
          step_number: 2,
          title: 'Adjust Wake Windows',
          description: 'Extend wake windows by 10 minutes every 3 days until naps shorten naturally, then drop the earliest nap.'
        },
        {
          step_number: 3,
          title: 'Anchor the Day',
          description: 'Fix wake time within a 30-minute band and keep bedtime routine consistent (bath, feed, song, crib).'
        }
      ]
    })
  ],
  'mom-health': [
    createArticle({
      slug: 'postpartum-checklist-2025',
      title: 'Postpartum Health Checklist: 0–12 Months Surveillance Plan',
      type: 'howto',
      hub: 'mom-health',
      one_liner:
        'ACOG recommends touchpoints at 3 weeks, 12 weeks, and quarterly thereafter—screen for mood disorders, cardiac risk, and pelvic floor recovery.',
      key_facts: [
        'Up to 1 in 8 postpartum individuals screen positive for depression (CDC 2024).',
        'Blood pressure over 140/90 after delivery warrants urgent evaluation for postpartum preeclampsia.',
        'Pelvic floor rehab reduces chronic pain by 35% when started before 12 weeks postpartum.'
      ],
      entities: [
        'postpartum visit schedule',
        'Edinburgh Postnatal Depression Scale',
        'preeclampsia monitoring',
        'pelvic floor therapy',
        'maternal morbidity'
      ],
      date_published: iso('2024-12-05T16:15:00Z'),
      last_reviewed: iso('2025-01-14T09:00:00Z'),
      citations: buildCitations([
        {
          title: 'CDC: Trends in Postpartum Depressive Symptoms — United States, 2018–2022',
          url: 'https://www.cdc.gov/reproductivehealth/maternalinfanthealth/postpartum-depression-data.html',
          publisher: 'CDC',
          date: '2024-05-01'
        },
        {
          title: 'ACOG Committee Opinion No. 736: Optimizing Postpartum Care',
          url: 'https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2018/05/optimizing-postpartum-care',
          publisher: 'ACOG'
        }
      ]),
      how_to_steps: [
        {
          step_number: 1,
          title: 'Schedule Multi-Touch Follow-ups',
          description: 'Book visits at 3 weeks, 12 weeks, 6 months, and 12 months postpartum; include telehealth check-ins where in-person care is limited.'
        },
        {
          step_number: 2,
          title: 'Integrate Mental Health Screening',
          description: 'Administer EPDS or PHQ-9 at each visit; auto-escalate scores ≥10 to licensed counseling partners.'
        },
        {
          step_number: 3,
          title: 'Update Care Team Dashboard',
          description: 'Document vitals, bleeding patterns, feeding status, contraception, and mood to spot trends early.'
        }
      ]
    }),
    createArticle({
      slug: 'lactation-medication-safety',
      title: 'Medication Safety During Lactation: 2025 Formulary Snapshot',
      type: 'explainer',
      hub: 'mom-health',
      one_liner:
        'Use LactMed categories and Hale lactation risk levels; SSRIs like sertraline remain first-line with minimal milk transfer (<2%).',
      key_facts: [
        'Over 70% of postpartum patients take at least one prescription medication (NIH LactMed 2023).',
        'Sertraline and paroxetine have relative infant doses under 2%, considered compatible with breastfeeding.',
        'Avoid pseudoephedrine while establishing supply—it can reduce milk volume by up to 24%.'
      ],
      entities: [
        'LactMed',
        'Hale lactation risk category',
        'sertraline',
        'pseudoephedrine',
        'relative infant dose'
      ],
      date_published: iso('2025-01-08T12:00:00Z'),
      last_reviewed: iso('2025-01-18T14:45:00Z'),
      citations: buildCitations([
        {
          title: 'National Library of Medicine: Drugs and Lactation Database (LactMed)',
          url: 'https://www.ncbi.nlm.nih.gov/books/NBK501922/',
          publisher: 'NLM'
        },
        {
          title: 'Hale TW. Medications and Mothers’ Milk 2024 Edition',
          url: 'https://www.halesmeds.com/',
          publisher: 'Springer Publishing',
          date: '2024-04-01'
        }
      ])
    })
  ],
  development: [
    createArticle({
      slug: 'milestone-tracker-2025',
      title: 'Milestone Tracker 2025: Evidence-Based 0–24 Month Checklist',
      type: 'explainer',
      hub: 'development',
      one_liner:
        'CDC’s 2024 milestone update shifts 75th percentile expectations—language flags now include babbling “ga/ba/da” by 9 months.',
      key_facts: [
        'Use adjusted age for preterm infants until 24 months when assessing milestones.',
        'Refer to early intervention if 2 milestones are missed in any domain.',
        'Document caregiver concerns—they correctly identify delays in 86% of eventual diagnoses.'
      ],
      entities: [
        'CDC developmental milestones',
        'early intervention referral',
        'language development',
        'gross motor skills',
        'adjusted age'
      ],
      date_published: iso('2024-10-22T09:00:00Z'),
      last_reviewed: iso('2025-01-09T10:00:00Z'),
      citations: buildCitations([
        {
          title: 'CDC Learn the Signs. Act Early. Milestone Update 2024',
          url: 'https://www.cdc.gov/ncbddd/actearly/milestones/index.html',
          publisher: 'CDC'
        }
      ]),
      qas: [
        {
          question: 'When should I adjust for prematurity?',
          answer: 'Subtract the number of weeks born early from your child’s chronological age until age 24 months when reviewing milestones.',
          url: '#adjusted-age'
        }
      ]
    }),
    createArticle({
      slug: 'neurodevelopment-screening-2025',
      title: 'Neurodevelopment Screening Windows & Tools (2025 Edition)',
      type: 'research',
      hub: 'development',
      one_liner:
        'Survey of AAP Bright Futures schedule with ASQ-3, M-CHAT-R, and SWYC; screening adherence improves referral speed by 40%.',
      key_facts: [
        'ASQ-3 recommended at 9, 18, and 24 or 30 months.',
        'M-CHAT-R/F for autism risk at 18 and 24 months boosts early referral success.',
        'Document social determinants—food or housing insecurity doubles risk of missed visits.'
      ],
      entities: [
        'ASQ-3',
        'M-CHAT-R/F',
        'SWYC screening',
        'Bright Futures',
        'early intervention referrals'
      ],
      date_published: iso('2024-11-15T11:45:00Z'),
      last_reviewed: iso('2025-01-05T09:00:00Z'),
      citations: buildCitations([
        {
          title: 'American Academy of Pediatrics. Bright Futures: Guidelines for Health Supervision of Infants, Children, and Adolescents.',
          url: 'https://brightfutures.aap.org/',
          publisher: 'AAP'
        }
      ])
    })
  ],
  safety: [
    createArticle({
      slug: 'car-seat-regulation-2025',
      title: '2025 Car Seat Regulation Update & Recall Scanner',
      type: 'news',
      hub: 'safety',
      one_liner:
        'NHTSA added side-impact testing in January 2025; convertible seats produced after July 2025 must carry the new label.',
      key_facts: [
        'Check car seat expiration dates—most expire six years from manufacture.',
        'Register seats with manufacturers to receive recall alerts within 24 hours.',
        'Rear-facing recommended until at least age 2 or max height/weight limit.'
      ],
      entities: [
        'NHTSA regulation',
        'car seat recall',
        'rear-facing seat',
        'side-impact testing',
        'product safety'
      ],
      date_published: iso('2025-01-09T13:00:00Z'),
      last_reviewed: iso('2025-01-11T17:20:00Z'),
      citations: buildCitations([
        {
          title: 'National Highway Traffic Safety Administration: FMVSS 213 Final Rule (2025)',
          url: 'https://www.nhtsa.gov',
          publisher: 'NHTSA'
        },
        {
          title: 'SaferCar.gov Product Registration',
          url: 'https://www.nhtsa.gov/recalls',
          publisher: 'NHTSA'
        }
      ]),
      qas: [
        {
          question: 'How do I find my seat’s expiration date?',
          answer: 'Look for a sticker or embossing on the bottom or side of the seat; log it in our dashboard to receive reminders 6 months before expiry.',
          url: '#expiration-date'
        }
      ]
    }),
    createArticle({
      slug: 'home-safety-checklist',
      title: 'Comprehensive Home Safety Checklist Before Baby Crawls',
      type: 'howto',
      hub: 'safety',
      one_liner:
        'Anchor furniture, secure cords, and test smoke alarms monthly; 75% of injuries before age 1 happen in living areas and kitchens.',
      key_facts: [
        'Use UL-listed outlet covers and keep cords at least 36 inches off the floor.',
        'Lock away button batteries—ingestion can cause esophageal injury in 2 hours.',
        'Water heaters should be set to 120°F (49°C) to prevent scalds.'
      ],
      entities: [
        'childproofing checklist',
        'button battery safety',
        'smoke detector testing',
        'tip-over prevention',
        'poison control'
      ],
      date_published: iso('2024-10-05T08:45:00Z'),
      last_reviewed: iso('2025-01-10T09:15:00Z'),
      citations: buildCitations([
        {
          title: 'Consumer Product Safety Commission: Nursery Product-Related Injuries 2023',
          url: 'https://www.cpsc.gov',
          publisher: 'CPSC'
        }
      ]),
      how_to_steps: [
        {
          step_number: 1,
          title: 'Audit Living Spaces',
          description: 'Remove tip hazards, install furniture anchors, and route cables through cord covers.'
        },
        {
          step_number: 2,
          title: 'Secure Wet Areas',
          description: 'Add non-slip mats, lock cabinets with cleaning products, and set water heater to 120°F.'
        },
        {
          step_number: 3,
          title: 'Prepare Emergency Contacts',
          description: 'Post Poison Control (1-800-222-1222) and local ER contacts near every phone and in the app.'
        }
      ]
    })
  ],
  recipes: [
    createArticle({
      slug: 'allergen-introduction-calendar',
      title: 'Allergen Introduction Calendar (6–12 Months)',
      type: 'howto',
      hub: 'recipes',
      one_liner:
        'Introduce peanuts, egg, dairy, soy, wheat, and sesame by 12 months—offer 2g peanut protein 3x per week once tolerated.',
      key_facts: [
        'EAT & LEAP trials show introducing peanut between 4–11 months reduces allergy risk by up to 81%.',
        'Introduce one new allergen every 3–5 days while monitoring for reactions.',
        'Keep antihistamines on hand if recommended by your pediatric allergist.'
      ],
      entities: [
        'allergen introduction',
        'peanut protein dosage',
        'EAT trial',
        'LEAP study',
        'oral immunotolerance'
      ],
      date_published: iso('2024-12-01T07:30:00Z'),
      last_reviewed: iso('2025-01-07T09:15:00Z'),
      citations: buildCitations([
        {
          title: 'Du Toit G et al. Randomized Trial of Peanut Consumption (LEAP Study).',
          url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa1414850',
          publisher: 'New England Journal of Medicine',
          date: '2015-02-26'
        },
        {
          title: 'Perkin MR et al. Addendum Guidelines for the Prevention of Peanut Allergy (EAT Study).',
          url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa1514210',
          publisher: 'New England Journal of Medicine',
          date: '2016-05-05'
        }
      ]),
      how_to_steps: [
        {
          step_number: 1,
          title: 'Week 1–2: Peanut & Egg',
          description: 'Mix smooth peanut powder into breastmilk/formula and serve soft-scrambled egg; observe for 2 hours.'
        },
        {
          step_number: 2,
          title: 'Week 3–4: Dairy & Wheat',
          description: 'Offer whole-milk yogurt and iron-fortified wheat cereal separately on alternating days.'
        },
        {
          step_number: 3,
          title: 'Week 5–6: Soy & Sesame',
          description: 'Introduce tofu strips and thin tahini yogurt; log reactions and stool changes in the app.'
        }
      ]
    }),
    createArticle({
      slug: 'iron-rich-finger-foods',
      title: 'Iron-Rich Finger Foods for Baby-Led Weaning',
      type: 'recipe',
      hub: 'recipes',
      one_liner:
        'Pair heme and non-heme iron: offer beef strips with vitamin C produce; target 11 mg/day of iron for 7–12 month-olds.',
      key_facts: [
        'Baby-led weaning should still ensure <1/4 tsp salt per day.',
        'Steam vegetables until mashable between fingers to prevent choking.',
        'Serve water with meals once solids start to support hydration.'
      ],
      entities: [
        'baby-led weaning',
        'iron requirements',
        'finger foods',
        'vitamin C pairing',
        'choking prevention'
      ],
      date_published: iso('2024-11-20T12:30:00Z'),
      last_reviewed: iso('2025-01-03T10:00:00Z'),
      recipe_ingredients: [
        { name: 'Beef sirloin', amount: '4', unit: 'oz', notes: 'Cut into finger-sized strips' },
        { name: 'Sweet potato', amount: '1', unit: 'cup', notes: 'Steamed and diced' },
        { name: 'Broccoli florets', amount: '1', unit: 'cup', notes: 'Steam until tender' },
        { name: 'Olive oil', amount: '1', unit: 'tbsp' }
      ],
      recipe_steps: [
        {
          step_number: 1,
          title: 'Prepare Beef',
          description: 'Lightly sear beef strips in olive oil until medium; rest and slice into age-appropriate sizes.'
        },
        {
          step_number: 2,
          title: 'Steam Vegetables',
          description: 'Steam sweet potato and broccoli until soft enough to smush between fingers.'
        },
        {
          step_number: 3,
          title: 'Serve & Observe',
          description: 'Offer mixed plate with water; monitor for gagging vs. choking and log intake.'
        }
      ]
    })
  ]
};

const allArticles = Object.values(mockHubArticles).flat();

export const mockContentStats: ContentStats = {
  total_articles: allArticles.length,
  articles_by_hub: Object.entries(mockHubArticles).reduce((acc, [hub, articles]) => {
    acc[hub as ContentHub] = articles.length;
    return acc;
  }, {} as Record<ContentHub, number>),
  articles_by_type: allArticles.reduce((acc, article) => {
    acc[article.type] = (acc[article.type] ?? 0) + 1;
    return acc;
  }, {} as Record<ContentType, number>),
  articles_by_lang: allArticles.reduce((acc, article) => {
    acc[article.lang] = (acc[article.lang] ?? 0) + 1;
    return acc;
  }, {} as Record<Language, number>),
  articles_by_status: {
    draft: 0,
    published: allArticles.length,
    archived: 0
  },
  recent_articles: allArticles.filter(article => new Date(article.date_published) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
  total_citations: allArticles.reduce((acc, article) => acc + (article.citations?.length ?? 0), 0),
  total_faq_items: allArticles.reduce((acc, article) => acc + (article.qas?.length ?? 0), 0)
};

export const mockHubHighlights: Record<ContentHub, HubHighlight> = {
  feeding: {
    headline: '2025 年 1 月：美国配方奶召回集中在粉状产品，供应恢复至 98% 的 2024 年产能基准。',
    lastValidated: iso('2025-01-12T08:00:00Z'),
    datapoints: [
      {
        label: 'FDA 召回次数 (2025 年 1 月第 2 周)',
        value: '3 次 Class I',
        source: 'FDA Infant Formula Recall List',
        sourceUrl: 'https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts/infant-formula',
        published: '2025-01-11'
      },
      {
        label: '全美工厂产能',
        value: '98%（vs. 2024 均值）',
        source: 'USDA Dairy Market News',
        sourceUrl: 'https://www.ams.usda.gov/mnreports/dymdrymilk.pdf',
        published: '2025-01-10'
      },
      {
        label: '母乳喂养启动率',
        value: '84.1% 新生儿',
        source: 'CDC Breastfeeding Report Card 2024',
        sourceUrl: 'https://www.cdc.gov/breastfeeding/data/reportcard.htm',
        published: '2024-08-01'
      }
    ],
    disclaimer: '数字来自美国联邦公开数据，汇总后每 14 天复核。'
  },
  development: {
    headline: 'CDC 2024 版里程碑将 75 百分位作为参考，家长担忧仍是最敏感的早筛信号。',
    lastValidated: iso('2025-01-09T10:00:00Z'),
    datapoints: [
      {
        label: '语言里程碑更新',
        value: '9 个月需出现“ga/ba/da”音节',
        source: 'CDC Milestone Update 2024',
        sourceUrl: 'https://www.cdc.gov/ncbddd/actearly/milestones/index.html',
        published: '2024-03-01'
      },
      {
        label: '家长担忧准确率',
        value: '86%',
        source: 'AAP Bright Futures Synthesized Evidence',
        sourceUrl: 'https://brightfutures.aap.org/',
        published: '2024-06-01'
      }
    ]
  },
  sleep: {
    headline: '遵循 ABC（Alone, Back, Crib）可让 SUID 风险降低 50%，可穿戴设备仍需配合安全睡眠环境。',
    lastValidated: iso('2025-01-15T06:00:00Z'),
    datapoints: [
      {
        label: '2023 年 SUID 率',
        value: '89.9 / 10 万活产',
        source: 'CDC SUID Data Portal',
        sourceUrl: 'https://www.cdc.gov/sids/data.htm',
        published: '2024-11-15'
      },
      {
        label: '裸床合规率',
        value: '39%',
        source: 'Pediatrics 2024 Safe Sleep Survey',
        sourceUrl: 'https://publications.aap.org/pediatrics',
        published: '2024-09-20'
      }
    ],
    disclaimer: '穿戴式监测器仅作告警辅助，未被证明可降低 SIDS。'
  },
  'mom-health': {
    headline: 'ACOG 建议产后 12 周内完成全面复诊，1/8 产后家庭需要心理健康支援。',
    lastValidated: iso('2025-01-18T14:45:00Z'),
    datapoints: [
      {
        label: '产后抑郁筛查阳性率',
        value: '12.7%',
        source: 'CDC Postpartum Depression Data 2024',
        sourceUrl: 'https://www.cdc.gov/reproductivehealth/maternalinfanthealth/postpartum-depression-data.html',
        published: '2024-05-01'
      },
      {
        label: '血压复测阈值',
        value: '≥140/90 mmHg',
        source: 'ACOG Optimizing Postpartum Care',
        sourceUrl: 'https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2018/05/optimizing-postpartum-care',
        published: '2018-05-01'
      }
    ]
  },
  safety: {
    headline: '2025 年起侧向碰撞测试纳入 FMVSS 213，儿童安全座椅需注册以获得 24 小时召回通知。',
    lastValidated: iso('2025-01-11T17:20:00Z'),
    datapoints: [
      {
        label: '新标准生效',
        value: '2025-01-01',
        source: 'NHTSA Final Rule FMVSS 213',
        sourceUrl: 'https://www.nhtsa.gov',
        published: '2024-12-15'
      },
      {
        label: '儿童跌落伤害占比',
        value: '70% 在客厅与厨房',
        source: 'CPSC Nursery Product Injuries 2023',
        sourceUrl: 'https://www.cpsc.gov',
        published: '2024-04-10'
      }
    ]
  },
  recipes: {
    headline: 'EAT/LEAP 研究证实 6–12 个月内完成 6 种主要过敏原引入能显著降低终身过敏风险。',
    lastValidated: iso('2025-01-07T09:15:00Z'),
    datapoints: [
      {
        label: '花生过敏风险降低',
        value: '↓ 81%',
        source: 'LEAP Trial NEJM 2015',
        sourceUrl: 'https://www.nejm.org/doi/full/10.1056/NEJMoa1414850',
        published: '2015-02-26'
      },
      {
        label: '建议摄入频次',
        value: '≥3 次/周，2g 蛋白/次',
        source: 'NIAID Addendum Guidelines 2017',
        sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/28065278/',
        published: '2017-01-05'
      }
    ],
    disclaimer: '如出现过敏反应信号，请立即遵循儿科过敏专科指引。'
  }
};

export const useMockContent = () => true;
