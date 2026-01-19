const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixDatabaseImages() {
    console.log('🔄 Updating database image references to WebP...');

    // Fetch all foods
    const { data: foods, error } = await supabase
        .from('kb_foods')
        .select('id, slug, media');

    if (error) {
        console.error('Error fetching foods:', error);
        return;
    }

    console.log(`Checking ${foods.length} foods...`);

    let updatedCount = 0;

    for (const food of foods) {
        if (!food.media || !Array.isArray(food.media)) continue;

        let needsUpdate = false;
        const newMedia = food.media.map(item => {
            if (item.type === 'image' && item.url && item.url.endsWith('.png')) {
                needsUpdate = true;
                return {
                    ...item,
                    url: item.url.replace('.png', '.webp')
                };
            }
            return item;
        });

        if (needsUpdate) {
            const { error: updateError } = await supabase
                .from('kb_foods')
                .update({ media: newMedia })
                .eq('id', food.id);

            if (updateError) {
                console.error(`❌ Error updating ${food.slug}:`, updateError.message);
            } else {
                process.stdout.write('.');
                updatedCount++;
            }
        }
    }

    console.log(`\n\n✨ Updated ${updatedCount} foods to use WebP images!`);
}

fixDatabaseImages();
