/**
 * 母婴相关主题列表
 * 用于自动生成Insights文章
 */

const MATERNAL_INFANT_TOPICS = [
  // Feeding & Nutrition
  { topic: 'Newborn Feeding Basics', hub: 'feeding', type: 'explainer', age_range: '0-3 months' },
  { topic: 'Breastfeeding Positions and Techniques', hub: 'feeding', type: 'howto', age_range: '0-6 months' },
  { topic: 'Formula Feeding Guide', hub: 'feeding', type: 'explainer', age_range: '0-12 months' },
  { topic: 'Introducing Solid Foods', hub: 'feeding', type: 'howto', age_range: '4-6 months' },
  { topic: 'Baby-Led Weaning vs Purees', hub: 'feeding', type: 'explainer', age_range: '6-12 months' },
  { topic: 'Allergen Introduction Schedule', hub: 'feeding', type: 'howto', age_range: '6-12 months' },
  { topic: 'Iron-Rich Foods for Babies', hub: 'feeding', type: 'explainer', age_range: '6-12 months' },
  { topic: 'Vitamin D Supplementation', hub: 'feeding', type: 'explainer', age_range: '0-12 months' },
  { topic: 'Baby Feeding Schedule by Age', hub: 'feeding', type: 'howto', age_range: '0-12 months' },
  { topic: 'Dealing with Picky Eaters', hub: 'feeding', type: 'explainer', age_range: '12-24 months' },
  
  // Sleep
  { topic: 'Newborn Sleep Patterns', hub: 'sleep', type: 'explainer', age_range: '0-3 months' },
  { topic: 'Safe Sleep Guidelines', hub: 'sleep', type: 'explainer', age_range: '0-12 months' },
  { topic: 'Sleep Training Methods', hub: 'sleep', type: 'howto', age_range: '4-12 months' },
  { topic: 'Establishing Bedtime Routine', hub: 'sleep', type: 'howto', age_range: '0-12 months' },
  { topic: 'Dealing with Night Wakings', hub: 'sleep', type: 'explainer', age_range: '0-12 months' },
  { topic: 'Nap Schedule by Age', hub: 'sleep', type: 'howto', age_range: '0-24 months' },
  { topic: 'Co-Sleeping Safety', hub: 'sleep', type: 'explainer', age_range: '0-12 months' },
  
  // Development
  { topic: 'Newborn Development Milestones', hub: 'development', type: 'explainer', age_range: '0-3 months' },
  { topic: '3-6 Month Baby Milestones', hub: 'development', type: 'explainer', age_range: '3-6 months' },
  { topic: '6-9 Month Baby Milestones', hub: 'development', type: 'explainer', age_range: '6-9 months' },
  { topic: '9-12 Month Baby Milestones', hub: 'development', type: 'explainer', age_range: '9-12 months' },
  { topic: 'Tummy Time Benefits', hub: 'development', type: 'explainer', age_range: '0-6 months' },
  { topic: 'Encouraging Baby to Crawl', hub: 'development', type: 'howto', age_range: '6-9 months' },
  { topic: 'Baby Speech Development', hub: 'development', type: 'explainer', age_range: '0-24 months' },
  { topic: 'Fine Motor Skills Development', hub: 'development', type: 'explainer', age_range: '6-12 months' },
  
  // Safety
  { topic: 'Baby-Proofing Your Home', hub: 'safety', type: 'howto', age_range: '0-12 months' },
  { topic: 'Choking Prevention', hub: 'safety', type: 'explainer', age_range: '6-24 months' },
  { topic: 'Car Seat Safety', hub: 'safety', type: 'explainer', age_range: '0-24 months' },
  { topic: 'Baby First Aid Basics', hub: 'safety', type: 'howto', age_range: '0-24 months' },
  { topic: 'Preventing SIDS', hub: 'safety', type: 'explainer', age_range: '0-12 months' },
  { topic: 'Baby Bath Safety', hub: 'safety', type: 'explainer', age_range: '0-12 months' },
  
  // Mom Health
  { topic: 'Postpartum Recovery Timeline', hub: 'mom-health', type: 'explainer', age_range: '0-6 months' },
  { topic: 'Postpartum Depression Signs', hub: 'mom-health', type: 'explainer', age_range: '0-12 months' },
  { topic: 'Breastfeeding Challenges', hub: 'mom-health', type: 'explainer', age_range: '0-12 months' },
  { topic: 'Postpartum Exercise Guide', hub: 'mom-health', type: 'howto', age_range: '0-6 months' },
  { topic: 'Managing New Mom Stress', hub: 'mom-health', type: 'explainer', age_range: '0-12 months' },
  { topic: 'Postpartum Nutrition', hub: 'mom-health', type: 'explainer', age_range: '0-12 months' },
  
  // Recipes
  { topic: 'First Foods for Baby', hub: 'recipes', type: 'recipe', age_range: '4-6 months' },
  { topic: 'Iron-Rich Baby Purees', hub: 'recipes', type: 'recipe', age_range: '6-9 months' },
  { topic: 'Finger Foods for 9-12 Months', hub: 'recipes', type: 'recipe', age_range: '9-12 months' },
  { topic: 'Healthy Baby Snacks', hub: 'recipes', type: 'recipe', age_range: '12-24 months' },
];

module.exports = { MATERNAL_INFANT_TOPICS };
