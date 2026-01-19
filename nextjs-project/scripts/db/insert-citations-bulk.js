#!/usr/bin/env node

/**
 * Bulk Citation Insertion Script
 * Populates the 'citations' table with authoritative sources based on article hub
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

// Authoritative Citations by Hub
// These are general, high-quality sources appropriate for most content in these categories
const citationTemplates = {
    feeding: [
        {
            title: 'Infant and Toddler Nutrition',
            url: 'https://www.cdc.gov/nutrition/infantandtoddlernutrition/foods-and-drinks/when-to-introduce-solid-foods.html',
            publisher: 'CDC',
            author: 'CDC Nutrition Team',
            claim: 'General feeding guidelines and solid food introduction.'
        },
        {
            title: 'Starting Solid Foods',
            url: 'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Starting-Solid-Foods.aspx',
            publisher: 'American Academy of Pediatrics',
            author: 'AAP Committee on Nutrition',
            claim: 'Recommendations for starting solids and allergen introduction.'
        },
        {
            title: 'Nutrition for Healthy Term Infants',
            url: 'https://www.canada.ca/en/health-canada/services/canada-food-guide/resources/infant-feeding.html',
            publisher: 'Health Canada',
            author: 'Health Canada',
            claim: 'Infant nutrition and safety guidelines.'
        }
    ],
    safety: [
        {
            title: 'Safe Sleep for Babies',
            url: 'https://www.cdc.gov/sids/about/safe-sleep.html',
            publisher: 'CDC',
            author: 'CDC SIDS Prevention',
            claim: 'Official safe sleep and SIDS prevention guidelines.'
        },
        {
            title: 'Safe Sleep Recommendations',
            url: 'https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/A-Parents-Guide-to-Safe-Sleep.aspx',
            publisher: 'American Academy of Pediatrics',
            author: 'Task Force on Sudden Infant Death Syndrome',
            claim: 'Evidence-based recommendations for infant sleep safety.'
        }
    ],
    development: [
        {
            title: 'Developmental Milestones',
            url: 'https://www.cdc.gov/ncbddd/actearly/milestones/index.html',
            publisher: 'CDC',
            author: 'CDC Learn the Signs. Act Early.',
            claim: 'Standard developmental milestones for infants and toddlers.'
        },
        {
            title: 'Ages and Stages',
            url: 'https://www.healthychildren.org/English/ages-stages/Pages/default.aspx',
            publisher: 'American Academy of Pediatrics',
            author: 'AAP',
            claim: 'Age-appropriate developmental expectations.'
        }
    ],
    mom_health: [
        {
            title: 'Postpartum Care',
            url: 'https://www.acog.org/womens-health/faqs/postpartum-care',
            publisher: 'American College of Obstetricians and Gynecologists',
            author: 'ACOG',
            claim: 'Guidelines for maternal recovery and health.'
        },
        {
            title: 'Maternal Mental Health',
            url: 'https://www.cdc.gov/reproductivehealth/depression/index.htm',
            publisher: 'CDC',
            author: 'CDC Reproductive Health',
            claim: 'Resources for maternal depression and mental well-being.'
        }
    ],
    health: [
        {
            title: 'Fever and Your Baby',
            url: 'https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/Fever-and-Your-Baby.aspx',
            publisher: 'American Academy of Pediatrics',
            author: 'AAP',
            claim: 'Guidelines for managing infant fever.'
        },
        {
            title: 'Infant Health and Safety',
            url: 'https://www.cdc.gov/parents/infants/safety.html',
            publisher: 'CDC',
            author: 'CDC',
            claim: 'General health and safety tips.'
        }
    ]
};

async function populateCitations() {
    console.log('🚀 Starting Citation Population Process...\n');

    try {
        // 1. Get all published articles
        const { data: articles, error: fetchError } = await supabase
            .from('articles')
            .select('id, slug, title, hub')
            .eq('status', 'published');

        if (fetchError) throw fetchError;

        console.log(`📊 Found ${articles.length} total articles.`);

        // 2. Get existing citations to avoid duplicates (naive check, but sufficient so we don't double add)
        // We'll just check which article_ids already have ANY citations.
        const { data: existingCitations, error: citationError } = await supabase
            .from('citations')
            .select('article_id');

        if (citationError) throw citationError;

        const articlesWithCitations = new Set(existingCitations.map(c => c.article_id));
        console.log(`📊 ${articlesWithCitations.size} articles already have citations.\n`);

        let added = 0;
        let skipped = 0;
        let errors = 0;

        // 3. Iterate and insert
        for (const article of articles) {
            if (articlesWithCitations.has(article.id)) {
                skipped++;
                continue;
            }

            const templates = citationTemplates[article.hub] || citationTemplates.health; // Fallback to health/general

            // Prepare insert payload
            const citationsToInsert = templates.map(t => ({
                article_id: article.id,
                title: t.title,
                url: t.url,
                publisher: t.publisher,
                author: t.author,
                claim: t.claim,
                date: new Date().toISOString()
            }));

            const { error: insertError } = await supabase
                .from('citations')
                .insert(citationsToInsert);

            if (insertError) {
                console.error(`❌ Error adding citations for ${article.slug}:`, insertError.message);
                errors++;
            } else {
                console.log(`✅ Added ${citationsToInsert.length} citations to: ${article.slug}`);
                added++;
            }
        }

        console.log('\n📈 Citation Population Summary:');
        console.log(`   ✅ Articles Updated: ${added}`);
        console.log(`   ⏭️  Skipped (Already Has Citations): ${skipped}`);
        console.log(`   ❌ Errors: ${errors}`);

    } catch (err) {
        console.error('❌ Fatal error:', err);
        process.exit(1);
    }
}

populateCitations()
    .then(() => {
        console.log('\n✨ Citation Process Complete!');
        process.exit(0);
    })
    .catch(err => {
        console.error('\n❌ Script failed:', err);
        process.exit(1);
    });
