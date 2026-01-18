#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');
// Load env vars from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const articles = [
    {
        slug: 'pain-new-mom-feeding-first-foods',
        type: 'explainer',
        hub: 'feeding',
        lang: 'en',
        title: 'Helping New Moms Navigate Feeding and First Foods',
        one_liner: 'A comprehensive guide for new mothers on breastfeeding, formula, and the transition to solids.',
        key_facts: [
            'Breastfeed exclusively for the first 6 months if possible',
            'Introduce solids around 6 months when baby shows readiness signs',
            'Iron-rich foods are critical first foods for breastfed babies',
            'Avoid honey and cow milk before 12 months'
        ],
        age_range: '0-12 months',
        region: 'Global',
        status: 'published',
        meta_title: 'New Mom Guide to Feeding & First Foods | Evidence Based',
        meta_description: 'Expert guide on newborn feeding, breastfeeding tips, formula basics, and introducing solids at 6 months. AAP & WHO compliant advice.',
        keywords: [
            'new mom feeding', 'first foods', 'starting solids', 'breastfeeding guide', 'formula feeding tips',
            '__AEO_QUICK__The AAP and WHO recommend exclusive breastfeeding for the first 6 months. Introduce solids around 6 months when baby shows readiness signs like sitting up.',
            '__AEO_FAQS__[{"question":"When should I start solids?","answer":"Around 6 months, when baby can sit up and hold head steady."},{"question":"What are good first foods?","answer":"Iron-fortified cereals, pureed meats, and soft vegetables."}]'
        ],
        last_reviewed: new Date().toISOString().split('T')[0],
        reviewed_by: 'Medical Review Board',
        date_published: new Date().toISOString(),
        date_modified: new Date().toISOString(),
        body_md: `# Helping New Moms Navigate Feeding and First Foods

## 1. The First 6 Months: Milk Matters

Whether you choose to breastfeed, formula feed, or combination feed, the first six months are exclusively about milk.

### Breastfeeding Basics
The AAP and WHO recommend exclusive breastfeeding for the first 6 months. It provides perfect nutrition and immune protection.
- **Frequency**: Newborns feed 8-12 times a day.
- **Latch**: Ensure a deep latch to prevent nipple pain and ensure milk transfer.
- **Vitamin D**: Breastfed babies need 400 IU of Vitamin D daily drops.

### Formula Feeding
Modern formulas are FDA-regulated to ensure complete nutrition.
- **Pace**: Feed on demand, typically every 2-3 hours initially.
- **Preparation**: Always follow safety guidelines for water mixing and bottle sterilization.

## 2. Introducing Solids: The 6-Month Milestone

Around 6 months, babies need more nutrients (especially Iron and Zinc) than milk alone can provide.

### Signs of Readiness
1. **Head Control**: Can hold head up steady.
2. **Sitting**: Sits with minimal support.
3. **Lost Tongue-Thrust**: Doesn't automatically push food out.
4. **Interest**: Watches you eat and reaches for food.

### The Best First Foods
- **Iron-fortified cereals** (Oat, Barley).
- **Pureed meats** (Beef, Turkey) for absorption.
- **Soft veggies and fruits** (Avocado, Sweet Potato, Banana).

## 3. Safety First
- **Choking Hazards**: Avoid whole grapes, nuts, popcorn, and large chunks. Cut round foods into quarters.
- **Allergens**: Introduce common allergens (peanut, egg) early and often, one at a time.
- **No Honey**: Strictly avoid honey before age 1 (Botulism risk).

## 4. Troubleshooting Common Issues
- **Reflux**: Keep baby upright for 20 mins after feeds.
- **Constipation**: Pears, Prunes, and Peaches can help moving things along ("The P fruits").
- **Refusal**: Don't force it. Try again in a few days. Exposure matters more than volume initially.

_Always consult your pediatrician before changing your baby's diet, especially if they have medical conditions._`
    },
    {
        slug: 'pain-allergy-introduction-safety',
        type: 'howto',
        hub: 'safety',
        lang: 'en',
        title: 'Safely Introducing Allergens to Your Baby: Evidence-Based Protocols',
        one_liner: 'Reduce food allergy risks by introducing allergens early and safely. Learn the latest AAP guidelines.',
        key_facts: [
            'Early introduction (4-6 months) can reduce peanut allergy risk by 80%',
            'Introduce one new allergen at a time',
            'Wait 2-3 days between new allergens to watch for reactions',
            'Never introduce allergens during illness'
        ],
        age_range: '4-12 months',
        region: 'Global',
        status: 'published',
        meta_title: 'Safely Introduce Allergens to Baby | Food Allergy Prevention',
        meta_description: 'How to safely introduce peanut, egg, and dairy to your baby. Based on the LEAP study and AAP guidelines for preventing food allergies.',
        keywords: [
            'allergen introduction', 'baby food allergies', 'peanut introduction', 'LEAP study', 'food safety',
            '__AEO_QUICK__Introduce common allergens like peanut and egg early, around 4-6 months, to reduce allergy risk. Start small and observe for reactions.',
            '__AEO_FAQS__[{"question":"When should I introduce peanuts?","answer":"As early as 4-6 months, after starting other solids, to reduce allergy risk."},{"question":"How do I introduce peanut butter?","answer":"Mix a small amount with water, breastmilk, or oatmeal. Never give whole nut butter due to choking risk."}]'
        ],
        last_reviewed: new Date().toISOString().split('T')[0],
        reviewed_by: 'Medical Review Board',
        date_published: new Date().toISOString(),
        date_modified: new Date().toISOString(),
        body_md: `# Safely Introducing Allergens to Your Baby

Recent research (like the LEAP study) has completely changed guidelines: delaying allergens **increases** risk. We now recommend early introduction.

## The Top 9 Allergens
These account for 90% of food allergies:
1. Peanuts
2. Tree Nuts (Cashew, Walnut)
3. Egg
4. Milk (Cow's dairy)
5. Wheat
6. Soy
7. Fish
8. Shellfish
9. Sesame

## How to Introduce Safely

### 1. Timing
- **Low Risk**: Start around 6 months with other solids.
- **High Risk (Eczema/Egg Allergy)**: Consult pediatrician; may start as early as 4-6 months.

### 2. Method
- **Texture**: Never give whole nuts or globs of nut butter (choking hazard). Thin it with water, breastmilk, or mix into oatmeal.
- **Quantity**: Start small (e.g., 1/8 teaspoon). If tolerated, gradually increase.
- **Setting**: Do it at home, in the morning (to observe for 2 hours).

### 3. The 3-Day Rule (Modified)
When introducing a **top allergen**, offer no other _new_ foods for 3 days to pinpoint any reaction.

## Recognizing a Reaction
- **Mild**: Hives around mouth, few spots on body.
- **Severe (Anaphylaxis)**: Swelling of lips/tongue, difficulty breathing, vomiting, widespread hives, limpness.
- **Action**: Stop feeding immediately. For severe symptoms, call 911/Emergency.

## Maintenance
Once introduced and tolerated, keep the allergen in the diet regularly (e.g., 2-3 times a week) to maintain tolerance.`
    },
    {
        slug: 'pain-midnight-emergency-fever-steps',
        type: 'howto',
        hub: 'safety',
        lang: 'en',
        title: 'Fever and Emergency Steps: A Midnight Guide for Parents',
        one_liner: 'What to do when your baby has a fever at night. Temperature thresholds and warning signs.',
        key_facts: [
            'A fever is a rectal temperature > 100.4°F (38°C)',
            'Under 3 months: Call doctor immediately for any fever',
            'Do not use aspirin for children',
            'Focus on the child\'s behavior, not just the number'
        ],
        age_range: '0-3 years',
        region: 'Global',
        status: 'published',
        meta_title: 'Baby Fever Guide: Midnight Emergency Steps & Temp Chart',
        meta_description: 'Emergency guide for baby fever. When to go to ER, how to measure temperature, and safe dosing for Tylenol/Motrin.',
        keywords: [
            'baby fever', 'high temperature infant', 'emergency fever steps', 'febrile seizure', 'rectal temperature',
            '__AEO_QUICK__A fever is a rectal temperature > 100.4°F (38°C). Call a doctor immediately for babies under 3 months. For older babies, treat discomfort with Acetaminophen.',
            '__AEO_FAQS__[{"question":"What is considered a fever for a baby?","answer":"A rectal temperature of 100.4°F (38°C) or higher."},{"question":"Can I give Ibuprofen to my infant?","answer":"Only if the baby is 6 months or older. Under 6 months, Acetaminophen (Tylenol) is generally safe."}]'
        ],
        last_reviewed: new Date().toISOString().split('T')[0],
        reviewed_by: 'Medical Review Board',
        date_published: new Date().toISOString(),
        date_modified: new Date().toISOString(),
        body_md: `# Fever and Emergency Steps: A Midnight Guide

Waking up to a burning hot baby is scary. Here is your step-by-step medical guide.

## 1. Confirm the Fever
- **Gold Standard**: Rectal thermometer is most accurate for babies < 3 years.
- **Threshold**: A fever is **100.4°F (38°C)** or higher.
- _Note: Touch/forehead feeling is unreliable._

## 2. Red Flags: When to Call NOW

### Call Doctor Immediately or Go to ER if:
- **Baby is < 3 months old** with fever > 100.4°F (Do not give meds before calling).
- **Lethargic**: Hard to wake up, unresponsive.
- **Dehydrated**: No wet diaper for 8+ hours, no tears when crying, dry mouth.
- **Breathing**: Fast breathing, flaring nostrils, grunting, or ribs sucking in.
- **Rash**: Purple/red spots that don't fade when pressed (Glass test).
- **Seizure**: Convulsions (Febrile seizure). Call 911 if it lasts > 5 mins.

## 3. Managing Symptomatic Fever (Home Care)
If baby is > 3 months, alert but fussy:

### Medication
- **Acetaminophen (Tylenol)**: Safe for 0+ months (Check dosage with doctor). generally every 4-6 hours.
- **Ibuprofen (Motrin/Advil)**: **ONLY for 6+ months**. Every 6-8 hours.
- **Never Aspirin**: Causes Reye's Syndrome.

### Comfort Measures
- **Fluids**: Breastmilk, formula, or Pedialyte (if >1 yr water/popsicles). Hydration is key.
- **Clothing**: Dress in light layers. Do not bundle up.
- **Room**: Keep cool (68-70°F).
- **NO Ice Baths**: Or rubbing alcohol. Use lukewarm water compress if needed.

## 4. Monitoring
Check baby every few hours. If fever persists > 24 hours (under 2 years) or > 3 days (over 2 years), see a doctor even if no other symptoms.`
    }
];

async function run() {
    console.log('🚀 Inserting Medical Guide Articles...');

    for (const article of articles) {
        console.log(`Processing: ${article.slug}`);

        // Check exist
        const { data: exist } = await supabase.from('articles').select('id').eq('slug', article.slug).single();
        if (exist) {
            console.log('  - Exists, updating...');
            const { error } = await supabase.from('articles').update(article).eq('slug', article.slug);
            if (error) console.error('  ❌ Update Error:', error.message);
        } else {
            console.log('  - Inserting new...');
            const { error } = await supabase.from('articles').insert(article);
            if (error) console.error('  ❌ Insert Error:', error.message);
        }
    }

    console.log('✅ Done.');
}

run();
