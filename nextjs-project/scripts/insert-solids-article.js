#!/usr/bin/env node

/**
 * Insert solid foods readiness article chunks into knowledge_chunks table
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const chunks = [
  {
    source_type: 'kb_article',
    source_id: '11111111-1111-1111-1111-111111111111',
    source_slug: 'start-solids-readiness-us-ca-2025',
    title: 'Start solids: TL;DR (about 6 months + readiness)',
    content: 'Most infants are developmentally ready to start complementary foods at about 6 months. Do not start before 4 months. Readiness is judged by multiple developmental signs, not by age alone. Keep breast milk or infant formula as the main milk during 6–12 months, and begin with iron‑rich options (meats/meat alternatives, iron‑fortified infant cereals). Sources: CDC "When, what, and how to introduce solid foods"; U.S. Dietary Guidelines 2020–2025 (Infants & Toddlers); Health Canada "Nutrition for healthy term infants: Birth to six months"; WHO "Complementary feeding"; AAP HealthyChildren "Starting Solid Foods".',
    summary: 'About 6 months, not before 4 months; use developmental readiness signs; continue milk feeds; start with iron‑rich foods.',
    category: 'feeding-nutrition',
    subcategory: 'start-solids-readiness',
    age_range: ['0-6 months', '6-12 months'],
    locale: 'US/CA',
    priority: 10,
    risk_level: 'safety',
    tags: ['about-6-months', 'readiness-signs', 'iron-first', 'US-vs-Canada', 'AEO'],
    status: 'published'
  },
  {
    source_type: 'kb_article',
    source_id: '11111111-1111-1111-1111-111111111111',
    source_slug: 'start-solids-readiness-us-ca-2025',
    title: 'Readiness signs: practical checklist',
    content: 'Begin solids when most of these are present: 1) good head and neck control; 2) able to sit with little support; 3) opens mouth for a spoon and shows interest in food; 4) moves food from front of tongue to the back and swallows (tongue‑thrust reflex reduced); 5) hand‑to‑mouth coordination and bringing objects to the mouth. Note: body‑weight targets alone are not sufficient. Sources: CDC; U.S. Dietary Guidelines (developmental signs); Health Canada readiness language; WHO guidance on developmental readiness.',
    summary: 'Actionable checklist for judging readiness without relying on age or weight alone.',
    category: 'feeding-nutrition',
    subcategory: 'start-solids-readiness',
    age_range: ['0-6 months', '6-12 months'],
    locale: 'US/CA',
    priority: 20,
    risk_level: 'safety',
    tags: ['checklist', 'development', 'swallowing', 'parent-guide', 'AEO'],
    status: 'published'
  },
  {
    source_type: 'kb_article',
    source_id: '11111111-1111-1111-1111-111111111111',
    source_slug: 'start-solids-readiness-us-ca-2025',
    title: 'US vs Canada vs WHO: start‑solids timing (side‑by‑side)',
    content: 'United States (CDC, Dietary Guidelines, AAP): "about 6 months"; do not start before 4 months; base decisions on developmental readiness. Canada (Health Canada/PHAC; CPS): also "about 6 months," allow a few weeks earlier or later based on readiness; delaying much beyond 6 months can increase iron deficiency risk; start with iron‑rich foods and use responsive feeding. WHO: start complementary feeding at 6 months and increase meal frequency and texture as baby grows. Sources: CDC; U.S. Dietary Guidelines 2020–2025; Health Canada NHFI (Birth to six months); WHO Complementary feeding; CPS statements for high‑risk allergy context.',
    summary: 'Clear cross‑jurisdiction comparison to localize guidance during retrieval.',
    category: 'feeding-nutrition',
    subcategory: 'start-solids-readiness',
    age_range: ['0-6 months', '6-12 months'],
    locale: 'US/CA',
    priority: 30,
    risk_level: 'info',
    tags: ['comparison', 'US', 'Canada', 'WHO', 'policy', 'AEO'],
    status: 'published'
  },
  {
    source_type: 'kb_article',
    source_id: '11111111-1111-1111-1111-111111111111',
    source_slug: 'start-solids-readiness-us-ca-2025',
    title: 'Starting too early vs too late: what is at stake?',
    content: 'Too early (<4 months) increases choking and aspiration risk, displaces breast milk or formula, and does not align with neuro‑oral readiness. Too late (well after about 6 months) raises the risk of iron deficiency and may slow acceptance of textures. The midpoint approach—start around 6 months when readiness signs cluster—is endorsed by CDC, the U.S. Dietary Guidelines, Health Canada, and WHO. Continue milk feeds while advancing solids and textures.',
    summary: 'Why the 6‑month window matters for safety, nutrition (iron), and skill learning.',
    category: 'feeding-nutrition',
    subcategory: 'start-solids-readiness',
    age_range: ['0-6 months', '6-12 months'],
    locale: 'Global',
    priority: 40,
    risk_level: 'medium',
    tags: ['risk', 'iron', 'texture', 'timing', 'AEO'],
    status: 'published'
  },
  {
    source_type: 'kb_article',
    source_id: '11111111-1111-1111-1111-111111111111',
    source_slug: 'start-solids-readiness-us-ca-2025',
    title: 'How to start: step‑by‑step and safety rules',
    content: 'Start with iron‑rich foods (pureed or appropriately soft meats/meat alternatives; iron‑fortified infant cereal mixed with breast milk or formula). Introduce one new food at a time in small amounts and observe for tolerance before adding another. Progress texture from smooth to mashed to soft pieces as skills improve. Do not put solids or cereal into a bottle. Avoid high‑risk choking shapes (e.g., whole grapes, thick peanut butter blobs, hot‑dog coin rounds); modify shape/size or postpone until safer. Keep milk feeds on demand during 6–12 months.',
    summary: 'Stepwise approach aligned with CDC/Health Canada/WHO; concise choking‑prevention cues.',
    category: 'feeding-nutrition',
    subcategory: 'start-solids-readiness',
    age_range: ['6-12 months'],
    locale: 'Global',
    priority: 50,
    risk_level: 'safety',
    tags: ['how-to', 'iron-first', 'texture', 'choking-prevention', 'AEO'],
    status: 'published'
  },
  {
    source_type: 'kb_article',
    source_id: '11111111-1111-1111-1111-111111111111',
    source_slug: 'start-solids-readiness-us-ca-2025',
    title: 'Special situations: preterm infants and medical considerations',
    content: 'For preterm infants, use corrected age and the same readiness signs (head control, sitting, coordinated swallow). If there is growth faltering, neuromotor delay, or suspected swallowing dysfunction, consult the infant's clinical team; a speech‑language pathologist or feeding specialist may be needed. Decisions should remain individualized, but introduction before 4 months corrected age is generally discouraged.',
    summary: 'How to adapt the readiness framework for preterm and medically complex infants.',
    category: 'feeding-nutrition',
    subcategory: 'start-solids-readiness',
    age_range: ['0-6 months', '6-12 months'],
    locale: 'Global',
    priority: 60,
    risk_level: 'medium',
    tags: ['preterm', 'corrected-age', 'swallowing', 'individualization', 'AEO'],
    status: 'published'
  },
  {
    source_type: 'kb_article',
    source_id: '11111111-1111-1111-1111-111111111111',
    source_slug: 'start-solids-readiness-us-ca-2025',
    title: 'Compliance & attribution (public‑domain and licensing notes) + source links',
    content: 'This summary paraphrases authoritative public‑health guidance and avoids reproducing protected text. U.S. federal materials (CDC; Dietary Guidelines) are generally public domain; include attribution and a non‑endorsement note when publishing. Health Canada/PHAC materials are under the Open Government Licence – Canada; provide attribution, avoid implying endorsement, and note modifications. AAP/HealthyChildren content is copyrighted; reference and link only. Key links: CDC – When, what, and how to introduce solid foods (https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/when-what-and-how-to-introduce-solid-foods.html); U.S. Dietary Guidelines 2020–2025 (Infants & Toddlers overview at https://www.dietaryguidelines.gov/); Health Canada – Nutrition for healthy term infants: Birth to six months (https://www.canada.ca/); WHO – Complementary feeding (https://www.who.int/health-topics/complementary-feeding); AAP HealthyChildren – Starting Solid Foods (https://www.healthychildren.org/).',
    summary: 'Licensing and non‑endorsement boilerplate plus canonical links for auditability.',
    category: 'feeding-nutrition',
    subcategory: 'start-solids-readiness',
    age_range: ['0-6 months', '6-12 months'],
    locale: 'Global',
    priority: 70,
    risk_level: 'none',
    tags: ['compliance', 'licensing', 'citations', 'links', 'AEO'],
    status: 'published'
  }
];

(async () => {
  console.log('📝 Inserting solid foods readiness article chunks...\n');

  const { data, error } = await supabase
    .from('knowledge_chunks')
    .insert(chunks)
    .select();

  if (error) {
    console.error('❌ Insert error:', error);
    process.exit(1);
  }

  console.log('✅ Successfully inserted', data.length, 'chunks\n');
  console.log('Inserted chunk details:');
  data.forEach((chunk, i) => {
    console.log(`  ${i + 1}. ${chunk.id}`);
    console.log(`     Title: ${chunk.title}`);
    console.log(`     Priority: ${chunk.priority}, Risk: ${chunk.risk_level}`);
    console.log('');
  });

  console.log('📊 Summary:');
  console.log(`   Total chunks: ${data.length}`);
  console.log(`   Source article: start-solids-readiness-us-ca-2025`);
  console.log(`   Category: feeding-nutrition`);
  console.log(`   Status: All published`);
  console.log('\n✅ Next step: Run generate-embeddings.js to create embeddings for these chunks');
})();
