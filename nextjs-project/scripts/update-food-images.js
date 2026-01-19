const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const foodImages = [
    { slug: 'beef', image_url: '/images/foods/beef.png' },
    { slug: 'carrot', image_url: '/images/foods/carrot.png' },
    { slug: 'egg', image_url: '/images/foods/egg.png' },
    { slug: 'grape', image_url: '/images/foods/grape.png' },
    { slug: 'lentils', image_url: '/images/foods/lentils.png' },
    { slug: 'peanut-butter', image_url: '/images/foods/peanut-butter.png' },
    { slug: 'salmon', image_url: '/images/foods/salmon.png' },
    { slug: 'shrimp', image_url: '/images/foods/shrimp.png' },
    { slug: 'yogurt', image_url: '/images/foods/yogurt.png' },
];

async function updateFoodImages() {
    console.log('🖼️  Updating food images in database...\n');

    for (const food of foodImages) {
        // Create media object
        const mediaItem = {
            type: 'image',
            url: food.image_url,
            alt: `${food.slug} for babies`,
            caption: `Professional food photography of ${food.slug}`
        };

        const { data, error } = await supabase
            .from('kb_foods')
            .update({ media: [mediaItem] })
            .eq('slug', food.slug)
            .select();

        if (error) {
            console.error(`❌ Error updating ${food.slug}:`, error.message);
        } else if (data && data.length > 0) {
            console.log(`✅ Updated ${food.slug} → ${food.image_url}`);
        } else {
            console.log(`⚠️  No food found with slug: ${food.slug}`);
        }
    }

    console.log('\n✨ Done!');
    process.exit(0);
}

updateFoodImages().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
