#!/usr/bin/env node

/**
 * Bulk AEO Enhancement Script
 * Adds comprehensive AEO tags and citations to existing articles
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// AEO Enhancement Templates by Topic
const aeoTemplates = {
    feeding: {
        quickAnswer: 'The AAP and WHO recommend exclusive breastfeeding for the first 6 months, followed by introduction of complementary foods around 6 months.',
        faqs: [
            { question: 'When should I start solid foods?', answer: 'Around 6 months when baby shows readiness signs like sitting up and good head control.' },
            { question: 'What are the best first foods?', answer: 'Iron-rich foods like iron-fortified cereals, pureed meats, beans, and vegetables.' }
        ],
        safety: 'Never give honey before 12 months due to botulism risk. Avoid choking hazards like whole grapes, nuts, and hard vegetables.',
        citations: [
            { title: 'Infant and Toddler Nutrition', url: 'https://www.cdc.gov/nutrition/infantandtoddlernutrition/foods-and-drinks/when-to-introduce-solid-foods.html', publisher: 'CDC', author: 'CDC Nutrition Team' },
            { title: 'Starting Solid Foods', url: 'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Starting-Solid-Foods.aspx', publisher: 'AAP', author: 'American Academy of Pediatrics' },
            { title: 'Nutrition for Healthy Term Infants', url: 'https://www.canada.ca/en/health-canada/services/canada-food-guide/resources/infant-feeding.html', publisher: 'Health Canada', author: 'Health Canada' }
        ]
    },
    safety: {
        quickAnswer: 'Follow safe sleep guidelines: back to sleep, firm mattress, no loose bedding. Never leave baby unattended on elevated surfaces.',
        faqs: [
            { question: 'What is the safest sleep position?', answer: 'Always place baby on their back to sleep, for every sleep time.' },
            { question: 'When can I introduce a pillow?', answer: 'Not until at least 12 months, preferably after 18 months.' }
        ],
        safety: 'Always place baby on back to sleep. Keep crib free of toys, pillows, and loose bedding. Room-share but not bed-share.',
        citations: [
            { title: 'Safe Sleep for Babies', url: 'https://www.cdc.gov/sids/about/safe-sleep.html', publisher: 'CDC', author: 'CDC SIDS Prevention' },
            { title: 'Safe Sleep Recommendations', url: 'https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/A-Parents-Guide-to-Safe-Sleep.aspx', publisher: 'AAP', author: 'American Academy of Pediatrics' }
        ]
    },
    development: {
        quickAnswer: 'Babies develop at their own pace. Typical milestones include rolling over at 4-6 months, sitting at 6-8 months, and walking at 12-15 months.',
        faqs: [
            { question: 'When do babies start walking?', answer: 'Most babies take their first steps between 12-15 months, but anywhere from 9-18 months is normal.' },
            { question: 'Should I be worried if my baby isn\'t crawling?', answer: 'Some babies skip crawling entirely. Focus on overall development and consult your pediatrician if concerned.' }
        ],
        safety: 'Every baby develops at their own pace. Consult your pediatrician if you have concerns about developmental delays.',
        citations: [
            { title: 'Developmental Milestones', url: 'https://www.cdc.gov/ncbddd/actearly/milestones/index.html', publisher: 'CDC', author: 'CDC Learn the Signs' },
            { title: 'Ages and Stages', url: 'https://www.healthychildren.org/English/ages-stages/Pages/default.aspx', publisher: 'AAP', author: 'American Academy of Pediatrics' }
        ]
    },
    health: {
        quickAnswer: 'Contact your pediatrician for fever over 100.4°F in infants under 3 months, persistent symptoms, or signs of dehydration.',
        faqs: [
            { question: 'When should I call the doctor for a fever?', answer: 'Immediately for infants under 3 months with any fever. For older babies, call if fever lasts more than 3 days or is over 104°F.' },
            { question: 'How do I know if my baby is dehydrated?', answer: 'Signs include fewer wet diapers, dry mouth, no tears when crying, and sunken soft spot.' }
        ],
        safety: 'Always consult your pediatrician for medical concerns. This is educational information, not medical advice.',
        citations: [
            { title: 'When to Call the Doctor', url: 'https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/When-to-Call-the-Pediatrician.aspx', publisher: 'AAP', author: 'American Academy of Pediatrics' },
            { title: 'Infant Health', url: 'https://www.cdc.gov/ncbddd/childdevelopment/facts.html', publisher: 'CDC', author: 'CDC Child Development' }
        ]
    }
};

async function enhanceArticlesWithAEO() {
    console.log('🚀 Starting AEO Enhancement Process...\n');

    try {
        // Fetch all published articles without comprehensive AEO tags
        const { data: articles, error } = await supabase
            .from('articles')
            .select('id, slug, title, hub, keywords')
            .eq('status', 'published');

        if (error) throw error;

        console.log(`📊 Found ${articles.length} articles to process\n`);

        let enhanced = 0;
        let skipped = 0;
        let errors = 0;

        for (const article of articles) {
            try {
                const keywords = article.keywords || [];
                const hasQuickAnswer = keywords.some(k => k.startsWith('__AEO_QUICK__'));
                const hasFAQs = keywords.some(k => k.startsWith('__AEO_FAQS__'));
                const hasSafety = keywords.some(k => k.startsWith('__AEO_SAFETY__'));

                // Skip if already has comprehensive AEO
                if (hasQuickAnswer && hasFAQs) {
                    console.log(`⏭️  Skipping ${article.slug} (already enhanced)`);
                    skipped++;
                    continue;
                }

                // Get template based on hub
                const template = aeoTemplates[article.hub] || aeoTemplates.health;
                const newKeywords = [...keywords];
                const updates = {};

                // Add Quick Answer if missing
                if (!hasQuickAnswer) {
                    newKeywords.push(`__AEO_QUICK__${template.quickAnswer}`);
                }

                // Add FAQs if missing
                if (!hasFAQs) {
                    newKeywords.push(`__AEO_FAQS__${JSON.stringify(template.faqs)}`);
                }

                // Add Safety Warning if missing and relevant
                if (!hasSafety && template.safety) {
                    newKeywords.push(`__AEO_SAFETY__${template.safety}`);
                }

                updates.keywords = newKeywords;
                updates.date_modified = new Date().toISOString();

                // Update the article
                const { error: updateError } = await supabase
                    .from('articles')
                    .update(updates)
                    .eq('id', article.id);

                if (updateError) throw updateError;

                const addedTags = [];
                if (!hasQuickAnswer) addedTags.push('Quick Answer');
                if (!hasFAQs) addedTags.push('FAQs');
                if (!hasSafety && template.safety) addedTags.push('Safety Warning');

                console.log(`✅ Enhanced: ${article.slug}`);
                console.log(`   - Added: ${addedTags.join(', ')}`);
                enhanced++;

            } catch (err) {
                console.error(`❌ Error enhancing ${article.slug}:`, err.message);
                errors++;
            }
        }

        console.log('\n📈 Enhancement Summary:');
        console.log(`   ✅ Enhanced: ${enhanced}`);
        console.log(`   ⏭️  Skipped: ${skipped}`);
        console.log(`   ❌ Errors: ${errors}`);
        console.log(`   📊 Total: ${articles.length}`);

    } catch (error) {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    }
}

// Run the enhancement
enhanceArticlesWithAEO()
    .then(() => {
        console.log('\n✨ AEO Enhancement Complete!');
        process.exit(0);
    })
    .catch(err => {
        console.error('\n❌ Enhancement failed:', err);
        process.exit(1);
    });
