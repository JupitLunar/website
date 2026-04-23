#!/usr/bin/env node

/**
 * 全球权威母婴网站配置
 * 按地区分类的权威来源
 */

const GLOBAL_SOURCES = {
  // ========== 美国 (US) ==========
  US: {
    AAP: {
      name: 'American Academy of Pediatrics',
      organization: 'AAP',
      baseUrl: 'https://www.healthychildren.org',
      region: 'US',
      grade: 'A',
      priority: 'P0',
      authorityClass: 'professional-society',
      language: 'en',
      categories: [
        '/English/ages-stages/baby/feeding-nutrition/Pages/default.aspx',
        '/English/ages-stages/baby/formula-feeding/Pages/default.aspx',
        '/English/ages-stages/baby/sleep/Pages/default.aspx',
        '/English/ages-stages/baby/breastfeeding/Pages/default.aspx',
        '/English/ages-stages/baby/crying-colic/Pages/default.aspx',
        '/English/ages-stages/baby/diapers-clothing/Pages/default.aspx',
        '/English/ages-stages/baby/bathing-skin-care/Pages/default.aspx',
        '/English/ages-stages/baby/preemie/Pages/default.aspx',
        '/English/ages-stages/baby/teething-tooth-care/Pages/default.aspx',
        '/English/ages-stages/prenatal/Pages/default.aspx'
      ],
      discoveryDepth: 1,
      discoveryMaxPages: 30,
      forcePuppeteer: true,
      preferPlaywright: true,
      browserTimeout: 60000,
      browserHeadless: false,
      linkPattern: /\/Pages\/[^\/]+\.aspx$/,
      extractOptions: {
        contentSelectors: ['.ms-rtestate-field', '.page-content .col-md-9', 'main', 'article'],
        noiseSelectors: ['#navigation', '#sidr-main', '#sidr-sidenav', '.left-col-container', '.breadcrumb', '.share', '.social-share'],
        preserveForm: true
      },
      excludePatterns: [
        /\/Pages\/default\.aspx$/i,
        /video/i,
        /error/i
      ],
      pageRules: [
        {
          match: /Cleaning-Baby-Clothes\.aspx$/i,
          exclude: true
        },
        {
          match: /The-Role-of-the-Pediatrician-in-Prenatal-Care-Why-Babies-Need-Medical-Homes-Before-Birth\.aspx$/i,
          exclude: true
        }
      ]
    },

    CDC: {
      name: 'Centers for Disease Control and Prevention',
      organization: 'CDC',
      baseUrl: 'https://www.cdc.gov',
      region: 'US',
      grade: 'A',
      priority: 'P0',
      authorityClass: 'government',
      language: 'en',
      categories: [
        '/infant-toddler-nutrition/',
        '/infant-toddler-nutrition/formula-feeding/',
        '/infant-toddler-nutrition/breastfeeding/',
        '/infant-toddler-nutrition/foods-and-drinks/',
        '/infant-toddler-nutrition/mealtime/',
        '/infant-toddler-nutrition/vitamins-minerals/',
        '/breastfeeding/',
        '/breastfeeding/php/guidelines-recommendations/',
        '/breastfeeding/php/guidelines-recommendations/faqs.html',
        '/breastfeeding-special-circumstances/hcp/diet-micronutrients/',
        '/breastfeeding-special-circumstances/hcp/illnesses-conditions/',
        '/breastfeeding-special-circumstances/hcp/exposures/',
        '/breastfeeding-special-circumstances/hcp/vaccine-medication-drugs/',
        '/infant-feeding-emergencies-toolkit/php/index.html',
        '/reproductive-health/emergency-preparation-response/'
      ],
      discoveryDepth: 2,
      discoveryMaxPages: 40,
      directSeeds: [
        'https://www.cdc.gov/breastfeeding-special-circumstances/hcp/illnesses-conditions/ebola.html',
        'https://www.cdc.gov/breastfeeding-special-circumstances/hcp/illnesses-conditions/postpartum-depression.html',
        'https://www.cdc.gov/breastfeeding-special-circumstances/hcp/contraindications/index.html',
        'https://www.cdc.gov/breastfeeding-special-circumstances/hcp/vaccine-medication-drugs/vaccinations.html',
        'https://www.cdc.gov/breastfeeding/php/guidelines-recommendations/other-mothers-milk.html',
        'https://www.cdc.gov/breastfeeding/breast-milk-preparation-and-storage/handling-breastmilk.html',
        'https://www.cdc.gov/breastfeeding-special-circumstances/hcp/illnesses-conditions/food-water-borne-illness.html',
        'https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/choking-hazards.html',
        'https://www.cdc.gov/infant-toddler-nutrition/resources/definitions.html',
        'https://www.cdc.gov/infant-toddler-nutrition/formula-feeding/index.html',
        'https://www.cdc.gov/infant-toddler-nutrition/formula-feeding/preparation-and-storage.html',
        'https://www.cdc.gov/infant-feeding-emergencies-toolkit/php/breastfeeding.html',
        'https://www.cdc.gov/infant-feeding-emergencies-toolkit/php/facts.html',
        'https://www.cdc.gov/infant-feeding-emergencies-toolkit/php/powdered-infant-formula.html',
        'https://www.cdc.gov/infant-feeding-emergencies-toolkit/php/preparedness-response.html',
        'https://www.cdc.gov/infant-feeding-emergencies-toolkit/php/cup-feeding.html',
        'https://www.cdc.gov/infant-feeding-emergencies-toolkit/php/how-to-clean-infant-feeding-items-during-emergencies.html',
        'https://www.cdc.gov/infant-feeding-emergencies-toolkit/php/special-considerations.html',
        'https://www.cdc.gov/hygiene/about/clean-sanitize-store-infant-feeding-items.html',
        'https://www.cdc.gov/radiation-emergencies/caring/infant-feeding.html'
      ],
      linkPattern: /cdc\.gov\/(infant-toddler-nutrition|breastfeeding|breastfeeding-special-circumstances|infant-feeding-emergencies-toolkit|reproductive-health)\/.*\.html$/i,
      extractOptions: {
        contentSelectors: ['#content', '#main-content', 'main', 'article', '.syndicate'],
        noiseSelectors: ['.cdc-share', '.syndicate-insert', '.site-alert', '.breadcrumbs']
      },
      excludePatterns: [
        /\/site\.html?$/i,
        /tools\.cdc\.gov\/medialibrary/i
      ],
      pageRules: [
        {
          match: /maternal-or-infant-illnesses\/ebola\.html$/i,
          exclude: true
        },
        {
          match: /breastfeeding\/breastfeeding-special-circumstances\/vaccinations-medications-drugs\/vaccinations\.html$/i,
          exclude: true
        },
        {
          match: /infant-feeding-emergencies-toolkit\/php\/(additional-resources-for-iycf-e|donations|glossary|social-media-toolkit)\.html$/i,
          exclude: true
        }
      ]
    },

    NICHD_SAFE_TO_SLEEP: {
      name: 'NICHD Safe to Sleep',
      organization: 'NICHD / NIH',
      baseUrl: 'https://safetosleep.nichd.nih.gov',
      region: 'US',
      grade: 'A',
      priority: 'P0',
      authorityClass: 'government',
      language: 'en',
      categories: [
        '/',
        '/safe-sleep',
        '/reduce-risk',
        '/resources/caregivers',
        '/training'
      ],
      directSeeds: [
        'https://safetosleep.nichd.nih.gov/safe-sleep',
        'https://safetosleep.nichd.nih.gov/reduce-risk/reduce',
        'https://safetosleep.nichd.nih.gov/reduce-risk/back-sleeping',
        'https://safetosleep.nichd.nih.gov/reduce-risk/tummy-time',
        'https://safetosleep.nichd.nih.gov/resources/caregivers/environment/look',
        'https://safetosleep.nichd.nih.gov/safe-sleep/breastfeeding',
        'https://safetosleep.nichd.nih.gov/about/risk-factors'
      ],
      discoveryDepth: 1,
      discoveryMaxPages: 25,
      linkPattern: /safetosleep\.nichd\.nih\.gov\/(safe-sleep|reduce-risk|resources\/caregivers|about\/risk-factors).+/i,
      excludePatterns: [
        /\.pdf($|\?)/i,
        /\/sites\/default\/files\//i,
        /\/resources\/toolkit\//i,
        /\/resources\/social-digital/i
      ],
      extractOptions: {
        contentSelectors: ['main', 'article', '#main-content', '.main-content'],
        noiseSelectors: ['nav', '.breadcrumb', '.share', '.social-share', 'footer']
      }
    },

    WOMENS_HEALTH: {
      name: "Office on Women's Health",
      organization: 'U.S. Department of Health and Human Services',
      baseUrl: 'https://www.womenshealth.gov',
      region: 'US',
      grade: 'A',
      priority: 'P0',
      authorityClass: 'government',
      language: 'en',
      categories: [
        '/breastfeeding',
        '/mental-health/mental-health-conditions/postpartum-depression',
        '/pregnancy/childbirth-and-beyond/postpartum-care'
      ],
      directSeeds: [
        'https://www.womenshealth.gov/breastfeeding/making-decision-breastfeed',
        'https://www.womenshealth.gov/breastfeeding/learning-breastfeed/preparing-breastfeed',
        'https://www.womenshealth.gov/breastfeeding/learning-breastfeed/making-breastmilk',
        'https://www.womenshealth.gov/breastfeeding/pumping-and-storing-breastmilk',
        'https://www.womenshealth.gov/breastfeeding/breastfeeding-home-work-and-public/breastfeeding-and-going-back-work',
        'https://www.womenshealth.gov/breastfeeding/breastfeeding-home-work-and-public/weaning-your-baby',
        'https://www.womenshealth.gov/breastfeeding/breastfeeding-challenges/breastfeeding-baby-health-problem',
        'https://www.womenshealth.gov/mental-health/mental-health-conditions/postpartum-depression',
        'https://www.womenshealth.gov/pregnancy/childbirth-and-beyond/recovering-birth',
        'https://www.womenshealth.gov/its-only-natural/planning-ahead/breastfeeding-and-baby-basics'
      ],
      discoveryDepth: 1,
      discoveryMaxPages: 30,
      linkPattern: /womenshealth\.gov\/(breastfeeding\/.+|mental-health\/mental-health-conditions\/postpartum-depression|pregnancy\/childbirth-and-beyond\/(postpartum-care|recovering-birth)|its-only-natural\/planning-ahead\/breastfeeding-and-baby-basics)/i,
      extractOptions: {
        contentSelectors: ['main', 'article', '.main-content', '#main-content'],
        noiseSelectors: ['nav', '.breadcrumb', '.share', '.social-share', 'footer']
      },
      excludePatterns: [
        /\.pdf($|\?)/i,
        /\/sites\/default\/files\//i,
        /\/espanol(\/|$)/i
      ]
    },

    ACOG: {
      name: 'American College of Obstetricians and Gynecologists',
      organization: 'ACOG',
      baseUrl: 'https://www.acog.org',
      region: 'US',
      grade: 'A',
      priority: 'P0',
      authorityClass: 'professional-society',
      language: 'en',
      categories: [
        '/womens-health/faqs/breastfeeding-your-baby',
        '/womens-health/faqs/having-a-baby',
        '/womens-health/faqs/postpartum-birth-control',
        '/womens-health/experts-and-stories/ask-acog'
      ],
      directSeeds: [
        'https://www.acog.org/womens-health/faqs/having-a-baby',
        'https://www.acog.org/womens-health/faqs/breastfeeding-your-baby',
        'https://www.acog.org/womens-health/faqs/postpartum-depression',
        'https://www.acog.org/womens-health/faqs/depression-during-pregnancy',
        'https://www.acog.org/womens-health/faqs/postpartum-birth-control',
        'https://www.acog.org/womens-health/faqs/using-long-acting-reversible-contraception-right-after-childbirth',
        'https://www.acog.org/womens-health/faqs/postpartum-pain-management',
        'https://www.acog.org/womens-health/health-tools/my-postpartum-care-checklist',
        'https://www.acog.org/womens-health/experts-and-stories/ask-acog/what-are-the-benefits-of-breastfeeding',
        'https://www.acog.org/womens-health/experts-and-stories/the-latest/what-i-tell-my-pregnant-and-postpartum-patients-about-depression-and-anxiety'
      ],
      discoveryDepth: 1,
      discoveryMaxPages: 25,
      linkPattern: /acog\.org\/womens-health\/(faqs\/.+|health-tools\/my-postpartum-care-checklist|experts-and-stories\/(ask-acog|the-latest)\/.+)/i,
      excludePatterns: [
        /\.pdf($|\?)/i,
        /\/wp-content\/uploads/i,
        /\/store\//i
      ],
      extractOptions: {
        contentSelectors: ['main', 'article', '.main-content', '#main-content'],
        noiseSelectors: ['nav', '.breadcrumb', '.share', '.social-share', 'footer']
      }
    },

    FDA: {
      name: 'U.S. Food and Drug Administration',
      organization: 'FDA',
      baseUrl: 'https://www.fda.gov',
      region: 'US',
      grade: 'A',
      priority: 'P0',
      authorityClass: 'government-regulatory',
      language: 'en',
      categories: [
        '/food/infant-formula-homepage',
        '/food/people-risk-foodborne-illness/once-baby-arrives-food-safety-moms-be',
        '/food/buy-store-serve-safe-food/handling-infant-formula-safely-what-you-need-know'
      ],
      directSeeds: [
        'https://www.fda.gov/food/infant-formula-homepage/infant-formula-information-parents-caregivers',
        'https://www.fda.gov/food/infant-formula-homepage/infant-formulas-marketed-us',
        'https://www.fda.gov/food/buy-store-serve-safe-food/handling-infant-formula-safely-what-you-need-know',
        'https://www.fda.gov/food/buy-store-serve-safe-food/information-health-care-professionals-safe-handling-infant-formula',
        'https://www.fda.gov/food/foodborne-pathogens/cronobacter-sakazakii',
        'https://www.fda.gov/food/people-risk-foodborne-illness/once-baby-arrives-food-safety-moms-be',
        'https://www.fda.gov/food/alerts-advisories-safety-information/fda-advises-parents-and-caregivers-not-make-or-feed-homemade-infant-formula-infants',
        'https://www.fda.gov/food/alerts-advisories-safety-information/fda-alerts-parents-and-caregivers-cronobacter-safety-concerns-crecelac-goat-milk-infant-formula',
        'https://www.fda.gov/food/outbreaks-foodborne-illness/fda-investigation-cronobacter-infections-powdered-infant-formula-february-2022',
        'https://www.fda.gov/food/outbreaks-foodborne-illness/outbreak-investigation-infant-botulism-infant-formula-november-2025',
        'https://www.fda.gov/food/outbreaks-foodborne-illness/fdas-actions-respond-clostridium-botulinum-illnesses-associated-consumption-powdered-infant-formula',
        'https://www.fda.gov/food/infant-formula-homepage/operation-stork-speed'
      ],
      discoveryDepth: 1,
      discoveryMaxPages: 25,
      linkPattern: /fda\.gov\/food\/(infant-formula-homepage\/.+|foodborne-pathogens\/cronobacter-sakazakii|people-risk-foodborne-illness\/.+baby.+|buy-store-serve-safe-food\/.+infant-formula.+|alerts-advisories-safety-information\/.+(infant.+formula|formula.+infant).+|outbreaks-foodborne-illness\/.+(infant.+formula|powdered.+infant).+)/i,
      extractOptions: {
        contentSelectors: ['main', 'article', '.main-content', '#main-content'],
        noiseSelectors: ['.fda-footer', '.fda-utility-nav', '.share-widget', '.block-social-media-links-block']
      },
      excludePatterns: [
        /\/media\/\d+\/download/i,
        /\.pdf($|\?)/i,
        /\/espanol(\/|$)/i,
        /investigacion-del/i,
        /formula-infantil/i,
        /brote-de-botulismo-infantil/i
      ]
    },

    USDA_FOODSAFETY: {
      name: 'FoodSafety.gov',
      organization: 'USDA / HHS / CDC / FDA',
      baseUrl: 'https://www.foodsafety.gov',
      region: 'US',
      grade: 'A',
      priority: 'P0',
      authorityClass: 'government',
      language: 'en',
      categories: [
        '/people-at-risk/children-under-five',
        '/people-at-risk/pregnant-people'
      ],
      linkPattern: /foodsafety\.gov\/people-at-risk\/(children-under-five|pregnant-people|.+)/i
    },

    KIDSHEALTH: {
      name: 'KidsHealth (Nemours)',
      organization: 'Nemours Foundation',
      baseUrl: 'https://kidshealth.org',
      region: 'US',
      grade: 'A',
      priority: 'P1',
      authorityClass: 'nonprofit-health-system',
      language: 'en',
      categories: [
        '/en/parents/pregnancy-center/newborn-care/',
        '/en/parents/'
      ],
      directSeeds: [
        'https://kidshealth.org/en/parents/pregnancy-newborn/formulafeed.html',
        'https://kidshealth.org/en/parents/pregnancy-newborn/breastfeed.html',
        'https://kidshealth.org/en/parents/pregnancy-newborn/sleep/',
        'https://kidshealth.org/en/parents/breastfeed-sleep.html',
        'https://kidshealth.org/en/parents/breastfeed-concerns.html',
        'https://kidshealth.org/en/parents/feednewborn.html'
      ],
      discoveryDepth: 1,
      discoveryMaxPages: 25,
      linkPattern: /kidshealth\.org\/en\/parents\/(pregnancy-newborn\/(formulafeed|breastfeed|sleep)\/?|breastfeed-(sleep|concerns)\.html|feednewborn\.html)/i,
      excludePatterns: [
        /\.pdf($|\?)/i,
        /\/es\//i,
        /\/Partnership\//i,
        /app-na\.readspeaker\.com/i,
        /\/cgi-bin\/rsent/i,
        /readid=khcontent_article/i
      ],
      extractOptions: {
        contentSelectors: ['main', 'article', '.Article--wrapper', '.article-page'],
        noiseSelectors: ['nav', '.breadcrumb', '.share', '.social-share', 'footer']
      }
    },

    MAYO_CLINIC: {
      name: 'Mayo Clinic',
      organization: 'Mayo Clinic',
      baseUrl: 'https://www.mayoclinic.org',
      region: 'US',
      grade: 'A',
      priority: 'P0',
      authorityClass: 'academic-medical-center',
      language: 'en',
      directSeedOnly: true,
      discoveryDepth: 2,
      discoveryMaxPages: 30,
      forcePuppeteer: false,
      preferPlaywright: true,
      browserTimeout: 60000,
      browserHeadless: false,
      directSeeds: [
        'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/baby-sleep/art-20045014',
        'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/infant-development/art-20048012',
        'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/breastfeeding-nutrition/art-20046912',
        'https://www.mayoclinic.org/healthy-lifestyle/labor-and-delivery/in-depth/exercise-after-pregnancy/art-20044596',
        'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/healthy-baby/art-20047741',
        'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/newborn/art-20546807',
        'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/breast-feeding/art-20546815',
        'https://www.mayoclinic.org/healthy-lifestyle/labor-and-delivery/in-depth/postpartum-care/art-20047233',
        'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/healthy-baby/art-20046200',
        'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/expert-answers/newborn/faq-20057752',
        'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/baby-naps/art-20047421',
        'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/infant-development/art-20048178',
        'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/infant-development/art-20047086',
        'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/infant-development/art-20047380',
        'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/spitting-up-in-babies/art-20044329',
        'https://www.mayoclinic.org/diseases-conditions/infant-jaundice/diagnosis-treatment/drc-20373870',
        'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/newborn/art-20546807',
        'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/breastfeeding-and-medications/art-20043975',
        'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/expert-answers/breast-feeding-and-alcohol/faq-20057985',
        'https://www.mayoclinic.org/healthy-lifestyle/labor-and-delivery/in-depth/c-section-recovery/art-20047310',
        'https://www.mayoclinic.org/medicines-while-breastfeeding/art-20572711',
        'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/expert-answers/induced-lactation/faq-20058403',
        'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/breast-milk-storage/art-20046350',
        'https://www.mayoclinic.org/healthy-lifestyle/labor-and-delivery/in-depth/postpartum-complications/art-20446702',
        'https://www.mayoclinic.org/diseases-conditions/postpartum-depression/symptoms-causes/syc-20376617',
        'https://www.mayoclinic.org/diseases-conditions/postpartum-depression/diagnosis-treatment/drc-20376623',
        'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/language-development/art-20045163',
        'https://www.mayoclinic.org/diseases-conditions/infant-acid-reflux/diagnosis-treatment/drc-20351412',
        'https://www.mayoclinic.org/diseases-conditions/colic/diagnosis-treatment/drc-20371081',
        'https://www.mayoclinic.org/diseases-conditions/diaper-rash/diagnosis-treatment/drc-20371641',
        'https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/infant-and-toddler-health/hlv-20049400',
        'https://www.mayoclinic.org/healthy-lifestyle/labor-and-delivery/basics/postpartum-care/hlv-20049465'
      ],
      linkPattern: /mayoclinic\.org\/(healthy-lifestyle\/(infant-and-toddler-health|labor-and-delivery|pregnancy-week-by-week|womens-health)\/.+|diseases-conditions\/(infant-jaundice|infant-acid-reflux|colic|postpartum-depression|diaper-rash)\/.+)|breastfeeding|newborn|postpartum|infant/i,
      discoveryLinkPattern: /mayoclinic\.org\/(healthy-lifestyle\/(infant-and-toddler-health|labor-and-delivery)\/.+|diseases-conditions\/(infant-jaundice|infant-acid-reflux|colic|postpartum-depression|diaper-rash)\/.+)/i,
      extractOptions: {
        contentSelectors: ['main', 'article', '.article-body'],
        noiseSelectors: ['.cmp-ad', '.mc-ads', '.content-cta', '.subscription-form', '.social-share']
      },
      pageRules: [
        {
          match: /infant-development\/art-20047380$/i,
          forcePuppeteer: false
        },
        {
          match: /breast-feeding-and-alcohol\/faq-20057985$/i,
          forcePuppeteer: false
        },
        {
          match: /induced-lactation\/faq-20058403$/i,
          forcePuppeteer: false
        },
        {
          match: /breast-milk-storage\/art-20046350$/i,
          forcePuppeteer: false
        },
        {
          match: /c-section-recovery\/art-20047310$/i,
          forcePuppeteer: false
        },
        {
          match: /medicines-while-breastfeeding\/art-20572711$/i,
          forcePuppeteer: false
        },
        {
          match: /breastfeeding-and-medications\/art-20043975$/i,
          forcePuppeteer: false
        },
        {
          match: /infant-and-toddler-health\/hlv-20049400$/i,
          exclude: true
        },
        {
          match: /postpartum-care\/hlv-20049465$/i,
          exclude: true
        },
        {
          match: /expert-answers\/newborn\/faq-20057752$/i,
          exclude: true
        }
      ]
    },

    CLEVELAND_CLINIC: {
      name: 'Cleveland Clinic',
      organization: 'Cleveland Clinic',
      baseUrl: 'https://my.clevelandclinic.org',
      region: 'US',
      grade: 'A',
      priority: 'P2',
      authorityClass: 'academic-medical-center',
      language: 'en',
      searchUrl: 'https://my.clevelandclinic.org/search?q=infant+baby+postpartum+breastfeeding',
      directSeeds: [
        'https://my.clevelandclinic.org/health/articles/5182-breastfeeding',
        'https://my.clevelandclinic.org/health/articles/14300-sleep-in-your-babys-first-year',
        'https://my.clevelandclinic.org/health/articles/9693-feeding-your-baby-the-first-year',
        'https://my.clevelandclinic.org/health/articles/cluster-feeding',
        'https://my.clevelandclinic.org/health/articles/postpartum',
        'https://my.clevelandclinic.org/health/diseases/9312-postpartum-depression',
        'https://my.clevelandclinic.org/health/diseases/22263-jaundice-in-newborns',
        'https://my.clevelandclinic.org/health/diseases/10823-colic',
        'https://my.clevelandclinic.org/health/diseases/11037-diaper-rash-diaper-dermatitis'
      ],
      discoveryDepth: 1,
      discoveryMaxPages: 20,
      linkPattern: /my\.clevelandclinic\.org\/health\/(articles\/(5182-breastfeeding|14300-sleep-in-your-babys-first-year|9693-feeding-your-baby-the-first-year|cluster-feeding|postpartum)|diseases\/(9312-postpartum-depression|22263-jaundice-in-newborns|10823-colic|11037-diaper-rash-diaper-dermatitis))/i,
      excludePatterns: [
        /\.pdf($|\?)/i,
        /\/services\//i,
        /\/departments\//i,
        /\/locations\//i
      ],
      extractOptions: {
        contentSelectors: ['main', 'article', '.article-content', '.main-content'],
        noiseSelectors: ['nav', '.breadcrumb', '.share', '.social-share', 'footer']
      }
    },

    STANFORD_CHILDRENS: {
      name: 'Stanford Children\'s Health',
      organization: 'Stanford Medicine',
      baseUrl: 'https://www.stanfordchildrens.org',
      region: 'US',
      grade: 'A',
      priority: 'P0',
      authorityClass: 'academic-medical-center',
      language: 'en',
      categories: [
        '/en/topic/default?id=infant-nutrition-90-P02236',
        '/en/topic/default?id=infant-feeding-guide-90-P02694',
        '/en/topic/default?id=breastfeeding-your-baby-90-P02864&sid=33205',
        '/en/topic/default?id=your-baby-and-breastfeeding-90-P02865&sid=33205'
      ],
      discoveryDepth: 2,
      discoveryMaxPages: 24,
      directSeeds: [
        'https://www.stanfordchildrens.org/en/topic/default?id=the-benefits-of-mothers-own-milk-90-P02339',
        'https://www.stanfordchildrens.org/en/topic/default?id=adding-to-mothers-milk-90-P02333',
        'https://www.stanfordchildrens.org/en/topic/default?id=milk-production-and-your-high-risk-baby-90-P02390',
        'https://www.stanfordchildrens.org/en/topic/default?id=breastfeeding-and-returning-to-work-90-P02708',
        'https://www.stanfordchildrens.org/en/topic/default?id=feeding-guide-for-the-first-year-90-P02209',
        'https://www.stanfordchildrens.org/en/topic/default?id=low-milk-production-90-P02888',
        'https://www.stanfordchildrens.org/en/topic/default?id=plugged-milk-ducts-90-P02890',
        'https://www.stanfordchildrens.org/en/topic/default?id=slow-or-poor-infant-weight-gain-90-P02880',
        'https://www.stanfordchildrens.org/en/topic/default?id=step-by-step-breastfeeding-holds-138-A90930',
        'https://www.stanfordchildrens.org/en/topic/default?id=babys-care-after-a-cesarean-delivery-90-P02640',
        'https://www.stanfordchildrens.org/en/topic/default?id=babys-care-in-the-delivery-room-90-P02642',
        'https://www.stanfordchildrens.org/en/topic/default?id=when-a-baby-has-difficulty-after-birth-90-P02641',
        'https://www.stanfordchildrens.org/en/topic/default?id=an-early-start-to-good-nutrition-1-3034',
        'https://www.stanfordchildrens.org/en/topic/default?id=breastmilk-is-best-90-P02636',
        'https://www.stanfordchildrens.org/en/topic/default?id=breastfeeding-getting-started-90-P02637',
        'https://www.stanfordchildrens.org/en/topic/default?id=breastfeeding-your-high-risk-baby-90-P02386',
        'https://www.stanfordchildrens.org/en/topic/default?id=your-high-risk-baby-and-expressing-milk-90-P02360',
        'https://www.stanfordchildrens.org/en/topic/default?id=how-breastmilk-is-made-90-P02635&sid=26137',
        'https://www.stanfordchildrens.org/en/topic/default?id=breastfeeding-your-premature-baby-90-P09520',
        'https://www.stanfordchildrens.org/en/topic/default?id=newborn-warning-signs-90-P02674',
        'https://www.stanfordchildrens.org/en/topic/default?id=newborn-care-90-P02692',
        'https://www.stanfordchildrens.org/en/topic/default?id=normal-newborn-behaviors-and-activities-90-P02629&sid=33205'
      ],
      linkPattern: /stanfordchildrens\.org\/en\/topic\/default\?id=.*(baby|infant|breast|feeding|newborn|sleep|milk)/i,
      extractOptions: {
        contentSelectors: ['[role="main"]', '#PageContent_C001_Col00', 'main', 'article'],
        noiseSelectors: ['.modal', '.social-media', '.breadcrumb', '.page-tools']
      },
      pageRules: [
        {
          match: /breastfeeding-the-high-risk-newborn-90-P02343/i,
          exclude: true
        },
        {
          match: /newborn-care-90-P02692/i,
          exclude: true
        },
        {
          match: /normal-newborn-behaviors-and-activities-90-P02629/i,
          exclude: true
        }
      ]
    }
  },

  // ========== 英国 (UK) ==========
  UK: {
    NHS: {
      name: 'National Health Service (NHS)',
      organization: 'NHS',
      baseUrl: 'https://www.nhs.uk',
      region: 'UK',
      grade: 'A',
      priority: 'P0',
      authorityClass: 'government',
      language: 'en',
      categories: [
        '/baby/caring-for-a-newborn/',
        '/baby/caring-for-a-newborn/sudden-infant-death-syndrome-sids/',
        '/baby/breastfeeding-and-bottle-feeding/',
        '/baby/breastfeeding-and-bottle-feeding/breastfeeding/',
        '/baby/breastfeeding-and-bottle-feeding/bottle-feeding/',
        '/baby/breastfeeding-and-bottle-feeding/breastfeeding-problems/',
        '/baby/breastfeeding-and-bottle-feeding/breastfeeding-and-lifestyle/',
        '/baby/weaning-and-feeding/',
        '/baby/babys-development/'
      ],
      discoveryDepth: 2,
      discoveryMaxPages: 50,
      linkPattern: /nhs\.uk\/baby\/(caring-for-a-newborn|breastfeeding-and-bottle-feeding|weaning-and-feeding|babys-development)\/?/i,
      extractOptions: {
        contentSelectors: ['#maincontent', '.nhsuk-grid-column-two-thirds', 'main', 'article'],
        noiseSelectors: ['.nhsuk-action-link', '.nhsuk-back-link', '.nhsuk-care-card', '.nhsuk-warning-callout']
      },
      pageRules: [
        {
          match: /height-weight-and-reviews\/?$/i,
          extractOptions: {
            minContentLength: 120
          }
        }
      ]
    },

    NHS_START4LIFE: {
      name: 'NHS Start4Life',
      organization: 'NHS',
      baseUrl: 'https://www.nhs.uk',
      region: 'UK',
      grade: 'A',
      priority: 'P0',
      authorityClass: 'government',
      language: 'en',
      categories: [
        '/start-for-life/baby/',
        '/start-for-life/baby/feeding-your-baby/',
        '/start-for-life/baby/baby-basics/caring-for-your-baby/',
        '/start-for-life/baby/baby-basics/newborn-and-baby-sleeping-advice-for-parents/'
      ],
      directSeeds: [
        'https://www.nhs.uk/start-for-life/baby/baby-basics/caring-for-your-baby/feeding-your-newborn-baby/',
        'https://www.nhs.uk/start-for-life/baby/feeding-your-baby/bottle-feeding/',
        'https://www.nhs.uk/start-for-life/baby/feeding-your-baby/bottle-feeding/how-to-make-up-a-feed/',
        'https://www.nhs.uk/start-for-life/baby/feeding-your-baby/bottle-feeding/how-to-make-up-a-feed/things-you-need-for-formula-feeding/',
        'https://www.nhs.uk/start-for-life/baby/baby-basics/newborn-and-baby-sleeping-advice-for-parents/helping-your-baby-sleep/',
        'https://www.nhs.uk/best-start-in-life/baby/feeding-your-baby/bottle-feeding/bottle-feeding-your-baby/',
        'https://www.nhs.uk/best-start-in-life/baby/feeding-your-baby/bottle-feeding/how-to-make-up-a-feed/',
        'https://www.nhs.uk/best-start-in-life/baby/feeding-your-baby/breastfeeding/breastfeeding-challenges/',
        'https://www.nhs.uk/best-start-in-life/baby/baby-basics/bonding-with-your-baby/understanding-your-baby/'
      ],
      discoveryDepth: 1,
      discoveryMaxPages: 35,
      linkPattern: /nhs\.uk\/(start-for-life|best-start-in-life)\/baby\/.+/i,
      extractOptions: {
        contentSelectors: ['#maincontent', 'main', 'article', '.nhsuk-width-container'],
        noiseSelectors: ['.site-footer', '.newsletter-signup', '.related-links']
      },
      excludePatterns: [
        /\.pdf($|\?)/i,
        /\/tools\//i,
        /\/recipes-and-meal-ideas(\/|$)/i
      ],
      pageRules: [
        {
          match: /\/feeding-your-baby\/bottle-feeding\/?$/i,
          extractOptions: {
            minContentLength: 120
          }
        }
      ]
    },

    NICE: {
      name: 'National Institute for Health and Care Excellence (NICE)',
      organization: 'NICE',
      baseUrl: 'https://www.nice.org.uk',
      region: 'UK',
      grade: 'A',
      priority: 'P0',
      authorityClass: 'government-funded',
      language: 'en',
      directSeedOnly: true,
      discoveryDepth: 1,
      discoveryMaxPages: 24,
      discoveryUsePuppeteer: true,
      preferPlaywright: true,
      requestTimeout: 45000,
      directSeeds: [
        'https://www.nice.org.uk/guidance/ng194/chapter/recommendations',
        'https://www.nice.org.uk/guidance/ng194/informationforpublic',
        'https://www.nice.org.uk/guidance/cg93/chapter/Recommendations',
        'https://www.nice.org.uk/guidance/cg93/informationforpublic',
        'https://www.nice.org.uk/guidance/cg98/chapter/Recommendations',
        'https://www.nice.org.uk/guidance/cg98/informationforpublic',
        'https://www.nice.org.uk/guidance/ng75/chapter/Recommendations',
        'https://www.nice.org.uk/guidance/ng247/chapter/Recommendations'
      ],
      linkPattern: /nice\.org\.uk\/guidance\/(ng194|cg93|cg98|ng75|ng247)\/((chapter\/Recommendations)|(ifp\/chapter\/.+)|(informationforpublic))\/?$/i,
      discoveryLinkPattern: /nice\.org\.uk\/guidance\/(ng194|cg93|cg98|ng75|ng247)(\/(chapter\/.+|ifp\/chapter\/.+|informationforpublic))?\/?$/i,
      excludePatterns: [
        /\.pdf($|\?)/i,
        /\/resources\/.+pdf/i,
        /\/evidence(\/|$)/i,
        /\/history(\/|$)/i,
        /\/update(\/|$)/i,
        /\/documents(\/|$)/i
      ],
      extractOptions: {
        contentSelectors: ['main', '#main-content', '.main-content', 'article'],
        noiseSelectors: ['header', 'footer', 'nav', '.breadcrumb', '.related-links', '.page-tools'],
        excludeTextPatterns: [/^skip to main content$/i]
      },
      pageRules: [
        {
          match: /\/ifp\/chapter\//i,
          extractOptions: {
            minContentLength: 120
          }
        }
      ]
    }
  },

  // ========== 加拿大 (CA) ==========
  CA: {
    HEALTH_CANADA: {
      name: 'Health Canada',
      organization: 'Health Canada',
      baseUrl: 'https://www.canada.ca',
      region: 'CA',
      grade: 'A',
      priority: 'P0',
      authorityClass: 'government',
      language: 'en',
      directSeedOnly: true,
      discoveryDepth: 2,
      discoveryMaxPages: 40,
      requestTimeout: 60000,
      directSeeds: [
        'https://www.canada.ca/en/health-canada/services/food-nutrition/healthy-eating/infant-feeding/nutrition-healthy-term-infants-recommendations-birth-six-months.html',
        'https://www.canada.ca/en/health-canada/services/canada-food-guide/resources/nutrition-healthy-term-infants/nutrition-healthy-term-infants-recommendations-birth-six-months/6-24-months.html',
        'https://www.canada.ca/en/health-canada/services/infant-care/infant-nutrition.html',
        'https://www.canada.ca/en/health-canada/services/food-nutrition/healthy-eating/infant-feeding/safety-donor-human-milk-canada.html',
        'https://www.canada.ca/en/health-canada/services/food-nutrition/healthy-eating/infant-feeding/safety-homemade-infant-formulas-canada.html',
        'https://www.canada.ca/en/health-canada/services/food-nutrition/supplemented-foods/decoding-new-caution-labels-foods-pregnant-breastfeeding.html',
        'https://www.canada.ca/en/health-canada/services/milk-infant-formula/preparing-handling-powdered-infant-formula.html',
        'https://www.canada.ca/en/health-canada/services/infant-care/infant-formula.html',
        'https://www.canada.ca/en/health-canada/services/food-safety-vulnerable-populations/infant-botulism.html',
        'https://www.canada.ca/en/health-canada/services/infant-care/baby-slings-carriers.html',
        'https://www.canada.ca/en/health-canada/services/infant-care/bath-safety.html',
        'https://www.canada.ca/en/health-canada/services/infant-care/high-chairs.html',
        'https://www.canada.ca/en/health-canada/services/infant-care/playpens.html',
        'https://www.canada.ca/en/health-canada/services/infant-care/safety-gates.html',
        'https://www.canada.ca/en/health-canada/services/infant-care/strollers-carriages.html',
        'https://www.canada.ca/en/health-canada/services/food-nutrition/food-nutrition-surveillance/health-nutrition-surveys/canadian-community-health-survey-cchs/breastfeeding-practices-canada-overview-food-nutrition-surveillance-health-canada.html',
        'https://www.canada.ca/en/health-canada/services/food-nutrition/food-nutrition-surveillance/health-nutrition-surveys/canadian-community-health-survey-cchs/duration-exclusive-breastfeeding-canada-key-statistics-graphics-2009-2010.html',
        'https://www.canada.ca/en/health-canada/services/food-nutrition/food-nutrition-surveillance/health-nutrition-surveys/canadian-community-health-survey-cchs/trends-breastfeeding-practices-canada-2001-2009-10-food-nutrition-surveillance-health-canada.html',
        'https://www.canada.ca/en/health-canada/services/food-nutrition/supplemented-foods.html',
        'https://www.canada.ca/en/health-canada/services/food-nutrition/supplemented-foods/learn-about-canada-new-labelling.html',
        'https://www.canada.ca/en/health-canada/services/food-nutrition/legislation-guidelines/guidance-documents/supplemented-foods-regulations.html'
      ],
      linkPattern: /canada\.ca\/en\/health-canada\/services\/(food-nutrition\/healthy-eating\/infant-feeding\/.+|infant-care\/.+|canada-food-guide\/resources\/nutrition-healthy-term-infants\/.+|milk-infant-formula\/.+|food-nutrition\/supplemented-foods\/.+|food-nutrition\/food-nutrition-surveillance\/.+breastfeeding.+)/i,
      discoveryLinkPattern: /canada\.ca\/en\/health-canada\/services\/(food-nutrition\/healthy-eating\/infant-feeding\/.+|infant-care\/.+|canada-food-guide\/resources\/(nutrition-healthy-term-infants|infant-feeding)\/.+|milk-infant-formula\/.+|food-nutrition\/supplemented-foods\/.+|food-nutrition\/food-nutrition-surveillance\/.+breastfeeding.+)/i,
      extractOptions: {
        contentSelectors: ['main', '.mwsgeneric-base-html', '#wb-main-in', '#wb-cont'],
        noiseSelectors: ['.gc-nav', '.pagedetails', '.followus', '.social-media', '.well', '.alert', '.gc-toc', '.gc-minister', '.gc-most-requested', '#wb-bc'],
        excludeTextPatterns: [/^fran[çc]ais fr$/i, /^table of contents$/i, /^date modified:/i],
        maxContentLength: 300000
      },
      requestHeaders: {
        'User-Agent': 'Mozilla/5.0',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    },

    PHAC: {
      name: 'Public Health Agency of Canada',
      organization: 'PHAC',
      baseUrl: 'https://www.canada.ca',
      region: 'CA',
      grade: 'A',
      priority: 'P0',
      authorityClass: 'government',
      language: 'en',
      directSeedOnly: true,
      discoveryDepth: 2,
      discoveryMaxPages: 36,
      requestTimeout: 60000,
      directSeeds: [
        'https://www.canada.ca/en/public-health/services/child-infant-health/postpartum-health-guide.html',
        'https://www.canada.ca/en/public-health/services/publications/healthy-living/10-great-reasons-to-breastfeed-your-baby.html',
        'https://www.canada.ca/en/public-health/services/publications/healthy-living/valuable-tips-successful-breastfeeding.html',
        'https://www.canada.ca/en/public-health/services/publications/healthy-living/maternity-newborn-care-guidelines-chapter-6.html',
        'https://www.canada.ca/en/public-health/services/health-promotion/childhood-adolescence/stages-childhood/infancy-birth-two-years/breastfeeding-infant-nutrition.html',
        'https://www.canada.ca/en/public-health/services/child-infant-health/breastfeeding-infant-nutrition/resources-professionals.html',
        'https://www.canada.ca/en/public-health/services/safe-sleep.html',
        'https://www.canada.ca/en/public-health/services/publications/healthy-living/safe-sleep-your-baby-brochure.html',
        'https://www.canada.ca/en/public-health/services/safe-sleep/dressing-baby-sleep.html',
        'https://www.canada.ca/en/public-health/services/safe-sleep/image-guide.html',
        'https://www.canada.ca/en/public-health/services/safe-sleep/indigenous-safe-sleep-resources.html',
        'https://www.canada.ca/en/public-health/services/safe-sleep/infant-tips-for-grandparents.html',
        'https://www.canada.ca/en/public-health/services/safe-sleep/on-the-go.html',
        'https://www.canada.ca/en/public-health/services/safe-sleep/safe-sleep-resources.html',
        'https://www.canada.ca/en/public-health/services/safe-sleep/setting-up-nursery.html',
        'https://www.canada.ca/en/public-health/services/safe-sleep/sudden-infant-death-syndrome.html'
      ],
      linkPattern: /canada\.ca\/en\/public-health\/services\/(child-infant-health\/(postpartum-health-guide|breastfeeding-infant-nutrition(\/resources-professionals)?)|publications\/healthy-living\/(10-great-reasons-to-breastfeed-your-baby|valuable-tips-successful-breastfeeding|maternity-newborn-care-guidelines-chapter-6|safe-sleep-your-baby-brochure)|health-promotion\/childhood-adolescence\/stages-childhood\/infancy-birth-two-years\/breastfeeding-infant-nutrition|safe-sleep|diseases\/2019-novel-coronavirus-infection\/prevention-risks\/pregnancy-childbirth-newborn)/i,
      discoveryLinkPattern: /canada\.ca\/en\/public-health\/services\/(child-infant-health\/.+|publications\/healthy-living\/.+|health-promotion\/childhood-adolescence\/stages-childhood\/infancy-birth-two-years\/.+|safe-sleep|diseases\/2019-novel-coronavirus-infection\/prevention-risks\/pregnancy-childbirth-newborn)/i,
      extractOptions: {
        contentSelectors: ['.mwsgeneric-base-html', 'main', '#wb-main-in'],
        noiseSelectors: ['.gc-nav', '.pagedetails', '.followus', '.social-media', '.well', 'figure', '.gc-toc', '.gc-minister', '.gc-most-requested', '#wb-bc'],
        excludeTextPatterns: [/^fran[çc]ais fr$/i, /^table of contents$/i, /^date modified:/i],
        maxContentLength: 300000
      },
      requestHeaders: {
        'User-Agent': 'Mozilla/5.0',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    },

    CARING_FOR_KIDS: {
      name: 'Caring for Kids (Canadian Paediatric Society)',
      organization: 'CPS',
      baseUrl: 'https://caringforkids.cps.ca',
      region: 'CA',
      grade: 'A',
      priority: 'P0',
      authorityClass: 'professional-society',
      language: 'en',
      categories: [
        '/handouts/breastfeeding',
        '/handouts/pregnancy-and-babies/breastfeeding',
        '/handouts/pregnancy-and-babies/feeding-your-baby',
        '/handouts/pregnancy-and-babies/after-your-baby-is-born',
        '/handouts/pregnancy-and-babies',
        '/handouts/safety-and-injury-prevention/safe_sleep_for_babies'
      ],
      discoveryDepth: 1,
      discoveryMaxPages: 25,
      directSeeds: [
        'https://caringforkids.cps.ca/handouts/breastfeeding',
        'https://caringforkids.cps.ca/handouts/pregnancy-and-babies/feeding_your_baby_in_the_first_year',
        'https://caringforkids.cps.ca/handouts/pregnancy-and-babies/skin-to-skin-care-for-babies',
        'https://caringforkids.cps.ca/handouts/pregnancy-and-babies/pacifiers',
        'https://caringforkids.cps.ca/handouts/pregnancy-and-babies/thrush',
        'https://caringforkids.cps.ca/handouts/pregnancy-and-babies/schedule_of_well_child_visits',
        'https://caringforkids.cps.ca/handouts/safety-and-injury-prevention/safe_sleep_for_babies'
      ],
      linkPattern: /caringforkids\.cps\.ca\/handouts\/(breastfeeding|pregnancy-and-babies\/.+|safety-and-injury-prevention\/safe_sleep_for_babies)/i,
      extractOptions: {
        contentSelectors: ['main', 'article', '.content', '.field--name-body'],
        noiseSelectors: ['.social-sharing', '.pager', '.breadcrumbs']
      }
    }
  },

  // ========== 澳大利亚 (AU) ==========
  AU: {
    RAISING_CHILDREN: {
      name: 'Raising Children Network',
      organization: 'Australian Government',
      baseUrl: 'https://raisingchildren.net.au',
      region: 'AU',
      grade: 'A',
      priority: 'P1',
      authorityClass: 'government-funded',
      language: 'en',
      categories: [
        '/babies/breastfeeding-bottle-feeding',
        '/babies/sleep',
        '/babies/health-daily-care',
        '/babies/newborns'
      ],
      directSeeds: [
        'https://raisingchildren.net.au/newborns/breastfeeding-bottle-feeding/bottle-feeding/infant-formula',
        'https://raisingchildren.net.au/newborns/breastfeeding-bottle-feeding/bottle-feeding/giving-the-bottle',
        'https://raisingchildren.net.au/newborns/breastfeeding-bottle-feeding/bottle-feeding/bottle-feeding-equipment',
        'https://raisingchildren.net.au/newborns/breastfeeding-bottle-feeding/bottle-feeding/mixed-feeding',
        'https://raisingchildren.net.au/newborns/breastfeeding-bottle-feeding/how-to-breastfeed/attachment-techniques',
        'https://raisingchildren.net.au/newborns/sleep/sleep-safety/baby-airway-protection',
        'https://raisingchildren.net.au/newborns/sleep/where-your-baby-sleeps/co-sleeping',
        'https://raisingchildren.net.au/newborns/sleep/settling-routines/newborn-sleep-routines',
        'https://raisingchildren.net.au/newborns/sleep/understanding-sleep/about-sleep',
        'https://raisingchildren.net.au/babies/sleep/sleep-safety/reducing-sudi-sids-risk',
        'https://raisingchildren.net.au/babies/sleep/settling-routines/patting-settling'
      ],
      discoveryDepth: 1,
      discoveryMaxPages: 30,
      linkPattern: /raisingchildren\.net\.au\/(newborns|babies|guides\/first-1000-days)\/(breastfeeding-bottle-feeding|sleep|health-daily-care|newborns|development)\/.+/i,
      excludePatterns: [
        /\.pdf($|\?)/i,
        /__data\/assets/i
      ],
      extractOptions: {
        contentSelectors: ['main', 'article', '.main-content', '#main-content'],
        noiseSelectors: ['nav', '.breadcrumb', '.share', '.social-share', 'footer']
      }
    },

    PREGNANCY_BIRTH_BABY: {
      name: 'Pregnancy, Birth & Baby',
      organization: 'Australian Government',
      baseUrl: 'https://www.pregnancybirthbaby.org.au',
      region: 'AU',
      grade: 'A',
      priority: 'P0',
      authorityClass: 'government-funded',
      language: 'en',
      categories: [
        '/baby',
        '/baby-feeding',
        '/baby-safety',
        '/baby-sleep-and-settling',
        '/baby-development',
        '/breastfeeding',
        '/newborn-baby'
      ],
      discoveryDepth: 2,
      discoveryMaxPages: 45,
      excludePatterns: [
        /app-oc\.readspeaker\.com/i,
        /\/cgi-bin\/rsent/i,
        /readid=mainContentArticleText/i,
        /\/pregnancy-and-baby-topics\/[A-Z]\/?$/i
      ],
      linkPattern: /pregnancybirthbaby\.org\.au\/(baby|baby-feeding|baby-safety|baby-sleep-and-settling|baby-development|breastfeeding|newborn-baby|[^\/]+-baby|[^\/]+-breastfeeding|[^\/]+-newborn)/i
    }
  },

  // ========== 新西兰 (NZ) ==========
  NZ: {
    PLUNKET: {
      name: 'Plunket',
      organization: 'Plunket',
      baseUrl: 'https://www.plunket.org.nz',
      region: 'NZ',
      grade: 'A',
      priority: 'P1',
      authorityClass: 'national-child-health-service',
      language: 'en',
      categories: [
        '/your-child/baby/',
        '/your-child/baby/feeding-and-nutrition/',
        '/your-child/baby/sleep/'
      ],
      directSeeds: [
        'https://www.plunket.org.nz/caring-for-your-child/feeding/',
        'https://www.plunket.org.nz/caring-for-your-child/feeding/bottle-feeding/',
        'https://www.plunket.org.nz/child-development/sleep/',
        'https://www.plunket.org.nz/child-development/sleep/newborn-sleep/newborn-to-3-months/',
        'https://www.plunket.org.nz/child-development/communication/communication-newborn-3-months/understanding-what-your-baby-wants-or-needs/'
      ],
      discoveryDepth: 1,
      discoveryMaxPages: 25,
      linkPattern: /plunket\.org\.nz\/(caring-for-your-child\/feeding|child-development\/sleep|child-development\/communication\/communication-newborn-3-months)\/.+/i,
      excludePatterns: [
        /\.pdf($|\?)/i
      ],
      extractOptions: {
        contentSelectors: ['main', 'article', '.main-content', '#main-content'],
        noiseSelectors: ['nav', '.breadcrumb', '.share', '.social-share', 'footer']
      }
    }
  },

  // ========== 新加坡 (SG) ==========
  SG: {
    HEALTH_HUB: {
      name: 'HealthHub Singapore',
      organization: 'Health Promotion Board',
      baseUrl: 'https://www.healthhub.sg',
      region: 'SG',
      grade: 'A',
      priority: 'P1',
      authorityClass: 'government',
      language: 'en',
      categories: [
        '/live-healthy/parenting',
        '/live-healthy/breastfeeding'
      ],
      directSeeds: [
        'https://www.healthhub.sg/programmes/parent-hub/baby-toddler/baby-sleep',
        'https://www.healthhub.sg/programmes/early-nutrition-for-babies',
        'https://www.healthhub.sg/well-being-and-lifestyle/pregnancy-and-infant-health/pregnancy-feeding-your-baby-breastfeeding',
        'https://www.healthhub.sg/live-healthy/how-can-i-get-my-baby-to-sleep-well-and-safely',
        'https://www.healthhub.sg/well-being-and-lifestyle/food-diet-and-nutrition/getting-baby-started-on-solids',
        'https://www.healthhub.sg/well-being-and-lifestyle/personal-care/babys_first_food_journey'
      ],
      discoveryDepth: 1,
      discoveryMaxPages: 20,
      linkPattern: /healthhub\.sg\/(programmes\/(parent-hub\/baby-toddler\/baby-sleep|early-nutrition-for-babies)|well-being-and-lifestyle\/(pregnancy-and-infant-health\/pregnancy-feeding-your-baby-breastfeeding|food-diet-and-nutrition\/getting-baby-started-on-solids|personal-care\/babys_first_food_journey)|live-healthy\/how-can-i-get-my-baby-to-sleep-well-and-safely)/i,
      excludePatterns: [
        /\.pdf($|\?)/i,
        /\/sites\/assets\//i,
        /\/support\//i,
        /\/api\//i
      ],
      extractOptions: {
        contentSelectors: ['main', 'article', '.main-content', '#main-content'],
        noiseSelectors: ['nav', '.breadcrumb', '.share', '.social-share', 'footer']
      }
    }
  },

  // ========== 欧洲 (EU) ==========
  EU: {
    WHO_EUROPE: {
      name: 'World Health Organization (Europe)',
      organization: 'WHO',
      baseUrl: 'https://www.who.int',
      region: 'EU',
      grade: 'A',
      priority: 'P0',
      authorityClass: 'multilateral',
      language: 'en',
      directSeedOnly: true,
      requestTimeout: 45000,
      directSeeds: [
        'https://www.who.int/europe/teams/nutrition-physical-activity-and-obesity/promoting-breastfeeding-and-complementary-foods',
        'https://www.who.int/europe/news/item/03-08-2022-foods-for-infants-and-young-children--a-matter-of-concern',
        'https://www.who.int/health-topics/breastfeeding',
        'https://www.who.int/health-topics/complementary-feeding'
      ],
      discoveryDepth: 1,
      discoveryMaxPages: 15,
      linkPattern: /who\.int\/(europe\/(teams\/nutrition-physical-activity-and-obesity\/promoting-breastfeeding-and-complementary-foods|news\/item\/03-08-2022-foods-for-infants-and-young-children--a-matter-of-concern)|health-topics\/(breastfeeding|complementary-feeding))/i,
      extractOptions: {
        contentSelectors: ['#PageContent_C001_Col00', 'article', '.content', '.sf_colsIn', 'main'],
        noiseSelectors: ['.mega-menu', '.footer', '.newsletter', '.list-view--item'],
        excludeTextPatterns: [/^skip to main content$/i]
      }
    }
  },

  // ========== 国际组织 (Global) ==========
  GLOBAL: {
    WHO: {
      name: 'World Health Organization',
      organization: 'WHO',
      baseUrl: 'https://www.who.int',
      region: 'Global',
      grade: 'A',
      priority: 'P0',
      authorityClass: 'multilateral',
      language: 'en',
      directSeedOnly: true,
      discoveryDepth: 2,
      discoveryMaxPages: 40,
      requestTimeout: 45000,
      directSeeds: [
        'https://www.who.int/health-topics/breastfeeding',
        'https://www.who.int/health-topics/complementary-feeding',
        'https://www.who.int/data/nutrition/nlis/info/infant-and-young-child-feeding',
        'https://www.who.int/publications/i/item/9789240081864',
        'https://www.who.int/news-room/fact-sheets/detail/infant-and-young-child-feeding',
        'https://www.who.int/news-room/questions-and-answers/item/breastfeeding',
        'https://www.who.int/news-room/questions-and-answers/item/coronavirus-disease-covid-19-breastfeeding',
        'https://www.who.int/teams/nutrition-and-food-safety/food-and-nutrition-actions-in-health-systems/ten-steps-to-successful-breastfeeding',
        'https://www.who.int/activities/promoting-baby-friendly-hospitals',
        'https://www.who.int/news-room/fact-sheets/detail/newborns-reducing-mortality',
        'https://www.who.int/publications/i/item/B09382',
        'https://www.who.int/publications/i/item/9789240113732',
        'https://www.who.int/teams/maternal-newborn-child-adolescent-health-and-ageing/newborn-health',
        'https://www.who.int/teams/maternal-newborn-child-adolescent-health-and-ageing/newborn-health/congenital-conditions',
        'https://www.who.int/teams/maternal-newborn-child-adolescent-health-and-ageing/newborn-health/essential-newborn-care',
        'https://www.who.int/teams/maternal-newborn-child-adolescent-health-and-ageing/newborn-health/newborn-infections',
        'https://www.who.int/teams/maternal-newborn-child-adolescent-health-and-ageing/newborn-health/perinatal-asphyxia',
        'https://www.who.int/teams/maternal-newborn-child-adolescent-health-and-ageing/newborn-health/preterm-and-low-birth-weight',
        'https://www.who.int/news/item/18-06-2025-equity-and-health--the-inclusion-of-pregnant-and-breastfeeding-women-in-clinical-trials',
        'https://www.who.int/news/item/27-05-2025-world-health-assembly-re-commits-to-global-nutrition-targets-and-marketing-regulations',
        'https://www.who.int/campaigns/world-breastfeeding-week/2025'
      ],
      linkPattern: /who\.int\/(health-topics\/(breastfeeding|complementary-feeding)|data\/nutrition\/nlis\/info\/infant-and-young-child-feeding|publications\/i\/item\/(9789240081864|B09382|9789240113732)|news-room\/(fact-sheets\/detail\/(infant-and-young-child-feeding|newborns-reducing-mortality)|questions-and-answers\/item\/(breastfeeding|coronavirus-disease-covid-19-breastfeeding))|teams\/nutrition-and-food-safety\/food-and-nutrition-actions-in-health-systems\/ten-steps-to-successful-breastfeeding|teams\/maternal-newborn-child-adolescent-health-and-ageing\/newborn-health|activities\/promoting-baby-friendly-hospitals|news\/item\/(18-06-2025-equity-and-health--the-inclusion-of-pregnant-and-breastfeeding-women-in-clinical-trials|27-05-2025-world-health-assembly-re-commits-to-global-nutrition-targets-and-marketing-regulations|04-08-2025-on-world-breastfeeding-week-countries-urged-to-invest-in-health-systems-and-support-breastfeeding-mothers|01-08-2025-breastfeeding-in-indonesia-on-the-rise--but-mothers-need-more-support)|campaigns\/world-breastfeeding-week\/2025)/i,
      discoveryLinkPattern: /who\.int\/(health-topics\/(breastfeeding|complementary-feeding)|news-room\/(fact-sheets\/detail\/(infant-and-young-child-feeding|newborns-reducing-mortality)|questions-and-answers\/item\/(breastfeeding|coronavirus-disease-covid-19-breastfeeding))|publications\/i\/item\/.+|news\/item\/.+breastfeeding.+|news\/item\/.+nutrition.+|teams\/nutrition-and-food-safety\/.+|teams\/maternal-newborn-child-adolescent-health-and-ageing\/newborn-health|activities\/promoting-baby-friendly-hospitals|campaigns\/world-breastfeeding-week\/2025)/i,
      extractOptions: {
        contentSelectors: ['#PageContent_C001_Col00', 'article', '.content', '.sf_colsIn', 'main'],
        noiseSelectors: ['.mega-menu', '.footer', '.newsletter', '.list-view--item'],
        excludeTextPatterns: [/^skip to main content$/i]
      }
    },

    UNICEF: {
      name: 'UNICEF',
      organization: 'UNICEF',
      baseUrl: 'https://www.unicef.org',
      region: 'Global',
      grade: 'A',
      priority: 'P1',
      authorityClass: 'multilateral',
      language: 'en',
      directSeedOnly: true,
      discoveryDepth: 1,
      discoveryMaxPages: 28,
      discoveryUsePuppeteer: true,
      preferPlaywright: true,
      directSeeds: [
        'https://www.unicef.org/parenting/food-nutrition/breastfeeding-positions',
        'https://www.unicef.org/parenting/food-nutrition/5-common-breastfeeding-problems',
        'https://www.unicef.org/parenting/food-nutrition/14-myths-about-breastfeeding',
        'https://www.unicef.org/parenting/food-nutrition/feeding-your-baby-6-12-months',
        'https://www.unicef.org/parenting/food-nutrition/feeding-your-baby-1-2-years',
        'https://www.unicef.org/parenting/food-nutrition/feeding-your-baby-when-to-start-solid-foods',
        'https://www.unicef.org/parenting/child-care/what-you-need-know-about-newborn-sleep',
        'https://www.unicef.org/parenting/health/what-is-sids'
      ],
      linkPattern: /unicef\.org\/parenting\/(food-nutrition\/(breastfeeding-positions|5-common-breastfeeding-problems|14-myths-about-breastfeeding|feeding-your-baby-6-12-months|feeding-your-baby-1-2-years|feeding-your-baby-when-to-start-solid-foods)|child-care\/what-you-need-know-about-newborn-sleep|health\/what-is-sids)$/i,
      discoveryLinkPattern: /unicef\.org\/parenting\/(food-nutrition(\/.+)?|health(\/.+)?|topics\/baby|child-care\/what-you-need-know-about-newborn-sleep)$/i,
      excludePatterns: [
        /\.pdf($|\?)/i,
        /\/parenting\/(fr|es|ar)\//i,
        /\/coronavirus\//i,
        /\/parenting\/parenting-tips-sign-up/i
      ],
      extractOptions: {
        contentSelectors: ['main', 'article', '#main-content', '.dialog-off-canvas-main-canvas'],
        noiseSelectors: ['header', 'footer', 'nav', '.views-exposed-form', '.pager', '.language-switcher'],
        excludeTextPatterns: [/^the submitted value .* is not allowed\.$/i]
      }
    },

    LA_LECHE_LEAGUE: {
      name: 'La Leche League International',
      organization: 'LLLI',
      baseUrl: 'https://llli.org',
      region: 'Global',
      grade: 'A',
      priority: 'P2',
      authorityClass: 'nonprofit',
      language: 'en',
      directSeedOnly: true,
      discoveryDepth: 1,
      discoveryMaxPages: 36,
      directSeeds: [
        'https://llli.org/breastfeeding-info/',
        'https://llli.org/breastfeeding-info/positioning/',
        'https://llli.org/breastfeeding-info/is-baby-getting-enough/',
        'https://llli.org/breastfeeding-info/hand-expressing/',
        'https://llli.org/breastfeeding-info/storing-human-milk/',
        'https://llli.org/breastfeeding-info/pumping-milk/',
        'https://llli.org/breastfeeding-info/cleaning-and-sanitizing-pumping-accessories/',
        'https://llli.org/breastfeeding-info/introducing-a-bottle-to-a-breastfed-baby/',
        'https://llli.org/breastfeeding-info/starting-solids/',
        'https://llli.org/breastfeeding-info/relactation/',
        'https://llli.org/breastfeeding-info/safe-sleep-breastfeeding-babies/',
        'https://llli.org/breastfeeding-info/postpartum-mood-disorders/',
        'https://llli.org/breastfeeding-info/mastitis/',
        'https://llli.org/breastfeeding-info/breastfeeding-sore-nipples/',
        'https://llli.org/breastfeeding-info/premies-breastfeeding/'
      ],
      linkPattern: /llli\.org\/breastfeeding-info(\/[a-z0-9-]+)?\/?$/i,
      discoveryLinkPattern: /llli\.org\/breastfeeding-info(\/[a-z0-9-]+)?\/?$/i,
      excludePatterns: [
        /\.pdf($|\?)/i,
        /\/wp-content\//i,
        /\/leader-pages\//i,
        /\/breastfeeding-info\/(allattamento-e-digiuno|impfungen)\/?$/i,
        /\/breastfeeding-info\/safe-sleep-7-infographic\/?$/i,
        /\/breastfeeding-info\/sleep-safe-surface-checklist\/?$/i,
        /\/breastfeeding-info-2\/?$/i
      ],
      extractOptions: {
        contentSelectors: ['main', 'article', '.entry-content', '.post-content'],
        noiseSelectors: ['header', 'footer', 'nav', '.sidebar', '.social-share', '.wp-block-buttons']
      }
    }
  }
};

// 辅助函数：获取所有来源
function getAllSources() {
  const sources = [];
  Object.keys(GLOBAL_SOURCES).forEach(region => {
    Object.keys(GLOBAL_SOURCES[region]).forEach(key => {
      sources.push({
        key: `${region}_${key}`,
        ...GLOBAL_SOURCES[region][key]
      });
    });
  });
  return sources;
}

// 辅助函数：按地区获取来源
function getSourcesByRegion(region) {
  return GLOBAL_SOURCES[region] || {};
}

// 辅助函数：获取所有地区
function getAllRegions() {
  return Object.keys(GLOBAL_SOURCES);
}

// 统计信息
function getStatistics() {
  const regions = getAllRegions();
  const stats = {
    totalRegions: regions.length,
    totalSources: getAllSources().length,
    byRegion: {}
  };

  regions.forEach(region => {
    stats.byRegion[region] = Object.keys(GLOBAL_SOURCES[region]).length;
  });

  return stats;
}

module.exports = {
  GLOBAL_SOURCES,
  getAllSources,
  getSourcesByRegion,
  getAllRegions,
  getStatistics
};

// 如果直接运行，显示统计信息
if (require.main === module) {
  const stats = getStatistics();
  console.log('🌍 全球权威母婴网站统计\n');
  console.log(`总地区数: ${stats.totalRegions}`);
  console.log(`总来源数: ${stats.totalSources}\n`);
  console.log('按地区分布:');
  Object.entries(stats.byRegion).forEach(([region, count]) => {
    console.log(`  ${region}: ${count} 个来源`);
  });
  console.log('\n详细列表:');
  getAllSources().forEach(source => {
    console.log(`  [${source.region}] ${source.name}`);
  });
}
