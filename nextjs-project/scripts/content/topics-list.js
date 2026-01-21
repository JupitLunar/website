/**
 * 母婴相关主题列表 - AEO优化版本
 * 用于自动生成 Insights 文章（仅在开启 --allow-preset 回退时使用）
 * 
 * AEO最佳实践:
 * - 使用问题形式的标题 (How, What, When, Why, Can)
 * - 涵盖用户实际搜索的问题
 * - 包含具体的年龄范围
 */

const MATERNAL_INFANT_TOPICS = [
  // ============ FEEDING & NUTRITION ============
  // Question-format titles for better AEO
  { topic: 'How Often Should I Feed My Newborn', hub: 'feeding', type: 'explainer', age_range: '0-3 months' },
  { topic: 'What Are the Best Breastfeeding Positions', hub: 'feeding', type: 'howto', age_range: '0-6 months' },
  { topic: 'How to Choose the Right Baby Formula', hub: 'feeding', type: 'explainer', age_range: '0-12 months' },
  { topic: 'When Can Babies Start Eating Solid Foods', hub: 'feeding', type: 'explainer', age_range: '4-6 months' },
  { topic: 'What Is Baby-Led Weaning and How Does It Work', hub: 'feeding', type: 'explainer', age_range: '6-12 months' },
  { topic: 'How to Introduce Allergenic Foods to Baby', hub: 'feeding', type: 'howto', age_range: '6-12 months' },
  { topic: 'What Foods Are High in Iron for Babies', hub: 'feeding', type: 'explainer', age_range: '6-12 months' },
  { topic: 'Does My Baby Need Vitamin D Supplements', hub: 'feeding', type: 'explainer', age_range: '0-12 months' },
  { topic: 'How Much Should My Baby Eat at Each Age', hub: 'feeding', type: 'howto', age_range: '0-12 months' },
  { topic: 'How to Handle a Picky Toddler Eater', hub: 'feeding', type: 'explainer', age_range: '12-24 months' },
  { topic: 'When Should I Stop Breastfeeding', hub: 'feeding', type: 'explainer', age_range: '6-24 months' },
  { topic: 'How to Increase Breast Milk Supply', hub: 'feeding', type: 'howto', age_range: '0-12 months' },
  { topic: 'What Are the Signs of a Food Allergy in Babies', hub: 'feeding', type: 'explainer', age_range: '4-12 months' },
  { topic: 'How to Store and Warm Breast Milk Safely', hub: 'feeding', type: 'howto', age_range: '0-12 months' },
  { topic: 'Can I Mix Breast Milk and Formula', hub: 'feeding', type: 'explainer', age_range: '0-12 months' },
  
  // ============ SLEEP ============
  { topic: 'How Much Sleep Does My Newborn Need', hub: 'sleep', type: 'explainer', age_range: '0-3 months' },
  { topic: 'What Are the ABCs of Safe Sleep', hub: 'sleep', type: 'explainer', age_range: '0-12 months' },
  { topic: 'What Is the Best Sleep Training Method', hub: 'sleep', type: 'howto', age_range: '4-12 months' },
  { topic: 'How to Create a Bedtime Routine for Baby', hub: 'sleep', type: 'howto', age_range: '0-12 months' },
  { topic: 'Why Does My Baby Wake Up at Night', hub: 'sleep', type: 'explainer', age_range: '0-12 months' },
  { topic: 'What Is the Right Nap Schedule by Age', hub: 'sleep', type: 'howto', age_range: '0-24 months' },
  { topic: 'Is Co-Sleeping Safe for My Baby', hub: 'sleep', type: 'explainer', age_range: '0-12 months' },
  { topic: 'When Do Babies Sleep Through the Night', hub: 'sleep', type: 'explainer', age_range: '3-12 months' },
  { topic: 'How to Handle Sleep Regressions', hub: 'sleep', type: 'explainer', age_range: '4-18 months' },
  { topic: 'What Is the Best Room Temperature for Baby Sleep', hub: 'sleep', type: 'explainer', age_range: '0-12 months' },
  { topic: 'Should I Wake My Baby to Feed at Night', hub: 'sleep', type: 'explainer', age_range: '0-3 months' },
  { topic: 'How to Transition Baby from Bassinet to Crib', hub: 'sleep', type: 'howto', age_range: '3-6 months' },
  
  // ============ DEVELOPMENT ============
  { topic: 'What Milestones Should My Newborn Reach', hub: 'development', type: 'explainer', age_range: '0-3 months' },
  { topic: 'What Can My 3 to 6 Month Old Baby Do', hub: 'development', type: 'explainer', age_range: '3-6 months' },
  { topic: 'What Milestones Happen at 6 to 9 Months', hub: 'development', type: 'explainer', age_range: '6-9 months' },
  { topic: 'What Should My 9 to 12 Month Old Be Doing', hub: 'development', type: 'explainer', age_range: '9-12 months' },
  { topic: 'Why Is Tummy Time Important for Babies', hub: 'development', type: 'explainer', age_range: '0-6 months' },
  { topic: 'How to Help My Baby Learn to Crawl', hub: 'development', type: 'howto', age_range: '6-9 months' },
  { topic: 'When Will My Baby Start Talking', hub: 'development', type: 'explainer', age_range: '0-24 months' },
  { topic: 'How to Encourage Fine Motor Skills in Babies', hub: 'development', type: 'howto', age_range: '6-12 months' },
  { topic: 'What Are the Signs of Developmental Delays', hub: 'development', type: 'explainer', age_range: '0-24 months' },
  { topic: 'How to Play with My Newborn', hub: 'development', type: 'howto', age_range: '0-3 months' },
  { topic: 'When Do Babies Start Walking', hub: 'development', type: 'explainer', age_range: '9-18 months' },
  { topic: 'How to Support My Baby Learning to Stand', hub: 'development', type: 'howto', age_range: '8-12 months' },
  { topic: 'When Should My Baby Roll Over', hub: 'development', type: 'explainer', age_range: '3-6 months' },
  { topic: 'When Should My Baby Sit Up', hub: 'development', type: 'explainer', age_range: '4-8 months' },
  { topic: 'How Much Tummy Time Does My Baby Need Each Day', hub: 'development', type: 'howto', age_range: '0-6 months' },
  { topic: 'How to Encourage Social Smiles in Babies', hub: 'development', type: 'howto', age_range: '1-4 months' },
  { topic: 'How to Support Early Language Development', hub: 'development', type: 'howto', age_range: '0-24 months' },
  { topic: 'What Is Separation Anxiety in Babies', hub: 'development', type: 'explainer', age_range: '6-18 months' },
  { topic: 'What Are Typical 12 to 18 Month Milestones', hub: 'development', type: 'explainer', age_range: '12-18 months' },
  { topic: 'What Are Typical 18 to 24 Month Milestones', hub: 'development', type: 'explainer', age_range: '18-24 months' },
  
  // ============ SAFETY ============
  { topic: 'How to Baby-Proof Your Home Room by Room', hub: 'safety', type: 'howto', age_range: '0-12 months' },
  { topic: 'What Foods Are Choking Hazards for Babies', hub: 'safety', type: 'explainer', age_range: '6-24 months' },
  { topic: 'How to Install a Car Seat Correctly', hub: 'safety', type: 'howto', age_range: '0-24 months' },
  { topic: 'What to Do If My Baby Is Choking', hub: 'safety', type: 'howto', age_range: '0-24 months' },
  { topic: 'How to Reduce the Risk of SIDS', hub: 'safety', type: 'explainer', age_range: '0-12 months' },
  { topic: 'How to Bathe a Newborn Safely', hub: 'safety', type: 'howto', age_range: '0-6 months' },
  { topic: 'What Household Items Are Dangerous for Babies', hub: 'safety', type: 'explainer', age_range: '6-24 months' },
  { topic: 'How to Check If a Product Has Been Recalled', hub: 'safety', type: 'howto', age_range: '0-24 months' },
  { topic: 'When Can Baby Use a Forward Facing Car Seat', hub: 'safety', type: 'explainer', age_range: '12-48 months' },
  { topic: 'How to Keep Baby Safe Around Pets', hub: 'safety', type: 'explainer', age_range: '0-24 months' },
  
  // ============ MOM HEALTH ============
  { topic: 'What to Expect During Postpartum Recovery', hub: 'mom-health', type: 'explainer', age_range: '0-6 months' },
  { topic: 'How to Recognize Postpartum Depression', hub: 'mom-health', type: 'explainer', age_range: '0-12 months' },
  { topic: 'How to Overcome Common Breastfeeding Challenges', hub: 'mom-health', type: 'howto', age_range: '0-12 months' },
  { topic: 'When Can I Start Exercising After Giving Birth', hub: 'mom-health', type: 'explainer', age_range: '0-6 months' },
  { topic: 'How to Manage New Mom Stress and Anxiety', hub: 'mom-health', type: 'howto', age_range: '0-12 months' },
  { topic: 'What Should I Eat While Breastfeeding', hub: 'mom-health', type: 'explainer', age_range: '0-12 months' },
  { topic: 'How to Deal with Mastitis', hub: 'mom-health', type: 'howto', age_range: '0-12 months' },
  { topic: 'What Is Normal Postpartum Bleeding', hub: 'mom-health', type: 'explainer', age_range: '0-2 months' },
  { topic: 'How to Get Enough Sleep as a New Parent', hub: 'mom-health', type: 'howto', age_range: '0-12 months' },
  { topic: 'When Will My Period Return After Baby', hub: 'mom-health', type: 'explainer', age_range: '0-24 months' },
  { topic: 'What Are Postpartum Warning Signs I Should Not Ignore', hub: 'mom-health', type: 'explainer', age_range: '0-6 months' },
  { topic: 'How to Recognize Postpartum Anxiety', hub: 'mom-health', type: 'explainer', age_range: '0-12 months' },
  { topic: 'When Is My Postpartum Checkup and What Happens', hub: 'mom-health', type: 'explainer', age_range: '0-3 months' },
  { topic: 'When Can I Have Sex After Giving Birth', hub: 'mom-health', type: 'explainer', age_range: '0-6 months' },
  { topic: 'What Birth Control Options Are Safe While Breastfeeding', hub: 'mom-health', type: 'explainer', age_range: '0-12 months' },
  { topic: 'How to Support a Partner During Postpartum Recovery', hub: 'mom-health', type: 'howto', age_range: '0-6 months' },
  { topic: 'How to Manage Parental Burnout', hub: 'mom-health', type: 'howto', age_range: '0-24 months' },
  { topic: 'How to Cope With Sleep Deprivation as a New Parent', hub: 'mom-health', type: 'howto', age_range: '0-12 months' },
  
  // ============ RECIPES ============
  { topic: 'What Are the Best First Foods for Babies', hub: 'recipes', type: 'recipe', age_range: '4-6 months' },
  { topic: 'How to Make Iron-Rich Baby Purees', hub: 'recipes', type: 'recipe', age_range: '6-9 months' },
  { topic: 'What Finger Foods Can I Give My 9 Month Old', hub: 'recipes', type: 'recipe', age_range: '9-12 months' },
  { topic: 'What Are Healthy Snack Ideas for Toddlers', hub: 'recipes', type: 'recipe', age_range: '12-24 months' },
  { topic: 'How to Make Homemade Baby Food', hub: 'recipes', type: 'howto', age_range: '6-12 months' },
  { topic: 'What Breakfast Ideas Are Good for Toddlers', hub: 'recipes', type: 'recipe', age_range: '12-24 months' },
  
  // ============ HEALTH & ILLNESS ============
  { topic: 'What Is a Normal Baby Temperature', hub: 'development', type: 'explainer', age_range: '0-24 months' },
  { topic: 'How to Tell If My Baby Has an Ear Infection', hub: 'development', type: 'explainer', age_range: '3-24 months' },
  { topic: 'What to Do When Baby Has a Cold', hub: 'development', type: 'howto', age_range: '0-24 months' },
  { topic: 'When Should I Call the Pediatrician', hub: 'safety', type: 'explainer', age_range: '0-24 months' },
  { topic: 'How to Treat Diaper Rash at Home', hub: 'development', type: 'howto', age_range: '0-24 months' },
  { topic: 'What Vaccines Does My Baby Need', hub: 'safety', type: 'explainer', age_range: '0-24 months' },
];

module.exports = { MATERNAL_INFANT_TOPICS };
