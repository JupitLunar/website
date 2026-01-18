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
      language: 'en',
      categories: [
        '/English/ages-stages/baby/feeding-nutrition/Pages/default.aspx',
        '/English/ages-stages/baby/sleep/Pages/default.aspx',
        '/English/ages-stages/baby/breastfeeding/Pages/default.aspx',
        '/English/ages-stages/baby/diapers-clothing/Pages/default.aspx',
        '/English/ages-stages/baby/bathing-skin-care/Pages/default.aspx'
      ],
      linkPattern: /\/Pages\/[^\/]+\.aspx$/
    },

    KIDSHEALTH: {
      name: 'KidsHealth (Nemours)',
      organization: 'Nemours Foundation',
      baseUrl: 'https://kidshealth.org',
      region: 'US',
      grade: 'A',
      language: 'en',
      categories: [
        '/en/parents/pregnancy-center/newborn-care/',
        '/en/parents/'
      ],
      linkPattern: /\/en\/parents\/[^\/]+\.html$/
    },

    MAYO_CLINIC: {
      name: 'Mayo Clinic',
      organization: 'Mayo Clinic',
      baseUrl: 'https://www.mayoclinic.org',
      region: 'US',
      grade: 'A',
      language: 'en',
      sitemapUrl: 'https://www.mayoclinic.org/sitemap-articles.xml',
      linkPattern: /infant-and-toddler-health|pregnancy|baby/i
    },

    CDC: {
      name: 'Centers for Disease Control and Prevention',
      organization: 'CDC',
      baseUrl: 'https://www.cdc.gov',
      region: 'US',
      grade: 'A',
      language: 'en',
      categories: [
        '/nutrition/infantandtoddlernutrition/'
      ],
      linkPattern: /\/nutrition\/infantandtoddlernutrition\//
    },

    CLEVELAND_CLINIC: {
      name: 'Cleveland Clinic',
      organization: 'Cleveland Clinic',
      baseUrl: 'https://my.clevelandclinic.org',
      region: 'US',
      grade: 'A',
      language: 'en',
      searchUrl: 'https://my.clevelandclinic.org/search?q=infant+baby+nutrition'
    },

    STANFORD_CHILDRENS: {
      name: 'Stanford Children\'s Health',
      organization: 'Stanford Medicine',
      baseUrl: 'https://www.stanfordchildrens.org',
      region: 'US',
      grade: 'A',
      language: 'en',
      categories: [
        '/en/topic/default?id=newborn-care',
        '/en/topic/default?id=infant-feeding'
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
      language: 'en',
      categories: [
        '/conditions/baby/',
        '/conditions/baby/weaning-and-feeding/',
        '/conditions/baby/breastfeeding-and-bottle-feeding/',
        '/conditions/baby/babys-development/'
      ],
      linkPattern: /\/conditions\/baby\//
    },

    NHS_START4LIFE: {
      name: 'NHS Start4Life',
      organization: 'NHS',
      baseUrl: 'https://www.nhs.uk/start4life',
      region: 'UK',
      grade: 'A',
      language: 'en',
      categories: [
        '/baby/',
        '/baby/feeding-your-baby/',
        '/baby/sleep/'
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
      language: 'en',
      categories: [
        '/en/health-canada/services/food-nutrition/healthy-eating/infant-feeding.html',
        '/en/public-health/services/pregnancy/babies.html'
      ],
      linkPattern: /infant|baby|pregnancy/i
    },

    CARING_FOR_KIDS: {
      name: 'Caring for Kids (Canadian Paediatric Society)',
      organization: 'CPS',
      baseUrl: 'https://caringforkids.cps.ca',
      region: 'CA',
      grade: 'A',
      language: 'en',
      categories: [
        '/handouts/pregnancy-and-babies/breastfeeding',
        '/handouts/pregnancy-and-babies/feeding-your-baby'
      ],
      linkPattern: /\/handouts\/pregnancy-and-babies\//
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
      language: 'en',
      categories: [
        '/babies/breastfeeding-bottle-feeding',
        '/babies/sleep',
        '/babies/health-daily-care',
        '/babies/newborns'
      ],
      linkPattern: /\/babies\//
    },

    PREGNANCY_BIRTH_BABY: {
      name: 'Pregnancy, Birth & Baby',
      organization: 'Australian Government',
      baseUrl: 'https://www.pregnancybirthbaby.org.au',
      region: 'AU',
      grade: 'A',
      language: 'en',
      categories: [
        '/baby',
        '/breastfeeding',
        '/newborn-baby'
      ],
      linkPattern: /\/(baby|breastfeeding|newborn)/
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
      language: 'en',
      categories: [
        '/your-child/baby/',
        '/your-child/baby/feeding-and-nutrition/',
        '/your-child/baby/sleep/'
      ],
      linkPattern: /\/your-child\/baby\//
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
      language: 'en',
      categories: [
        '/live-healthy/parenting',
        '/live-healthy/breastfeeding'
      ],
      linkPattern: /\/(parenting|breastfeeding|baby)/i
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
      language: 'en',
      categories: [
        '/europe/health-topics/maternal-and-child-health',
        '/health-topics/breastfeeding'
      ],
      linkPattern: /breastfeeding|infant|maternal/i
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
      language: 'en',
      categories: [
        '/health-topics/breastfeeding',
        '/health-topics/infant-health'
      ],
      linkPattern: /breastfeeding|infant/i
    },

    UNICEF: {
      name: 'UNICEF',
      organization: 'UNICEF',
      baseUrl: 'https://www.unicef.org',
      region: 'Global',
      grade: 'A',
      language: 'en',
      categories: [
        '/parenting',
        '/parenting/child-care/breastfeeding'
      ],
      linkPattern: /parenting|breastfeeding|baby/i
    },

    LA_LECHE_LEAGUE: {
      name: 'La Leche League International',
      organization: 'LLLI',
      baseUrl: 'https://www.llli.org',
      region: 'Global',
      grade: 'A',
      language: 'en',
      categories: [
        '/breastfeeding-info/'
      ],
      linkPattern: /breastfeeding/i
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
