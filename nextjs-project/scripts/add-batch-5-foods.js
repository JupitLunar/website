const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 20 new foods from batch 5
const newFoods = [
    // Vegetables
    {
        slug: 'eggplant',
        name: 'Eggplant',
        locale: 'Global',
        age_range: ['8+ months'],
        feeding_methods: ['baby-led weaning', 'puree'],
        serving_forms: ['roasted strips', 'mashed', 'pureed'],
        risk_level: 'low',
        nutrients_focus: ['Fiber', 'Potassium', 'Vitamin B6', 'Antioxidants'],
        do_list: ['Roast or steam until very soft', 'Peel before serving', 'Cut into strips'],
        dont_list: ['Do not serve raw', 'Avoid fried eggplant'],
        why: 'Eggplant is rich in fiber and antioxidants, supporting digestive health and overall wellness.',
        how_to: ['Wash and peel eggplant', 'Cut into strips', 'Roast at 400°F for 25-30 minutes until very soft', 'Serve warm'],
        portion_hint: '2-3 strips or 2-3 tablespoons mashed',
        media: [{ type: 'image', url: '/images/foods/eggplant.webp', alt: 'eggplant for babies', caption: 'Professional food photography of eggplant' }],
        status: 'published'
    },
    {
        slug: 'mushroom',
        name: 'Mushrooms',
        locale: 'Global',
        age_range: ['8+ months'],
        feeding_methods: ['baby-led weaning', 'puree'],
        serving_forms: ['cooked and sliced', 'chopped', 'pureed'],
        risk_level: 'low',
        nutrients_focus: ['Vitamin D', 'B Vitamins', 'Selenium', 'Antioxidants'],
        do_list: ['Cook thoroughly', 'Chop finely for younger babies', 'Use common varieties (button, cremini)'],
        dont_list: ['Never serve raw mushrooms', 'Avoid wild mushrooms'],
        why: 'Mushrooms provide vitamin D and umami flavor, supporting immune health and taste development.',
        how_to: ['Wash mushrooms thoroughly', 'Slice thinly', 'Sauté or roast until soft', 'Chop finely for younger babies'],
        portion_hint: '2-3 tablespoons chopped',
        media: [{ type: 'image', url: '/images/foods/mushroom.webp', alt: 'mushroom for babies', caption: 'Professional food photography of mushroom' }],
        status: 'published'
    },
    {
        slug: 'corn',
        name: 'Corn',
        locale: 'Global',
        age_range: ['8+ months'],
        feeding_methods: ['puree', 'baby-led weaning'],
        serving_forms: ['kernels', 'on the cob (12+ months)', 'pureed'],
        risk_level: 'medium',
        nutrients_focus: ['Fiber', 'Vitamin C', 'B Vitamins', 'Antioxidants'],
        do_list: ['Remove kernels from cob for babies under 12 months', 'Cook until very soft', 'Offer whole cob for teething'],
        dont_list: ['Do not serve small rounds (choking hazard)', 'Avoid popcorn until 4+ years'],
        why: 'Corn provides fiber and natural sweetness, supporting digestive health and introducing new textures.',
        how_to: ['Cook corn until very soft', 'Remove kernels from cob', 'Mash slightly for younger babies', 'Serve warm or room temperature'],
        portion_hint: '2-4 tablespoons kernels',
        media: [{ type: 'image', url: '/images/foods/corn.webp', alt: 'corn for babies', caption: 'Professional food photography of corn' }],
        status: 'published'
    },
    {
        slug: 'brussels-sprouts',
        name: 'Brussels Sprouts',
        locale: 'Global',
        age_range: ['8+ months'],
        feeding_methods: ['baby-led weaning', 'puree'],
        serving_forms: ['roasted halves', 'quartered', 'mashed'],
        risk_level: 'low',
        nutrients_focus: ['Vitamin K', 'Vitamin C', 'Fiber', 'Folate'],
        do_list: ['Roast until very soft', 'Halve or quarter', 'Remove outer leaves if tough'],
        dont_list: ['Do not serve raw', 'Avoid hard, undercooked centers'],
        why: 'Brussels sprouts are nutrient powerhouses, rich in vitamins K and C for bone and immune health.',
        how_to: ['Halve Brussels sprouts', 'Roast at 400°F for 25-30 minutes until very soft', 'Quarter for younger babies', 'Serve warm'],
        portion_hint: '2-3 halves or quarters',
        media: [{ type: 'image', url: '/images/foods/brussels-sprouts.webp', alt: 'brussels-sprouts for babies', caption: 'Professional food photography of brussels-sprouts' }],
        status: 'published'
    },

    // Legumes
    {
        slug: 'edamame',
        name: 'Edamame',
        locale: 'Global',
        age_range: ['8+ months'],
        feeding_methods: ['baby-led weaning', 'puree'],
        serving_forms: ['shelled beans', 'mashed', 'whole pod (12+ months)'],
        risk_level: 'medium',
        nutrients_focus: ['Protein', 'Iron', 'Fiber', 'Folate'],
        do_list: ['Remove from pods for babies under 12 months', 'Cook until very soft', 'Mash slightly'],
        dont_list: ['Do not serve in pods to young babies', 'Avoid undercooked edamame'],
        why: 'Edamame is a complete plant protein, rich in iron and fiber for growth and development.',
        how_to: ['Cook edamame until very soft', 'Remove from pods', 'Mash slightly for younger babies', 'Serve warm or room temperature'],
        portion_hint: '2-3 tablespoons',
        media: [{ type: 'image', url: '/images/foods/edamame.webp', alt: 'edamame for babies', caption: 'Professional food photography of edamame' }],
        status: 'published'
    },
    {
        slug: 'chickpeas',
        name: 'Chickpeas',
        locale: 'Global',
        age_range: ['6+ months'],
        feeding_methods: ['puree', 'baby-led weaning'],
        serving_forms: ['mashed', 'whole (12+ months)', 'hummus'],
        risk_level: 'medium',
        nutrients_focus: ['Protein', 'Iron', 'Fiber', 'Folate'],
        do_list: ['Cook until very soft', 'Mash for babies under 12 months', 'Use low-sodium'],
        dont_list: ['Do not serve whole to babies under 12 months', 'Avoid canned with added sodium'],
        why: 'Chickpeas are protein and iron-rich, supporting growth and blood health.',
        how_to: ['Cook chickpeas until very soft', 'Mash or make into hummus', 'Season lightly if desired', 'Serve warm or room temperature'],
        portion_hint: '2-3 tablespoons mashed',
        media: [{ type: 'image', url: '/images/foods/chickpeas.webp', alt: 'chickpeas for babies', caption: 'Professional food photography of chickpeas' }],
        status: 'published'
    },
    {
        slug: 'white-beans',
        name: 'White Beans',
        locale: 'Global',
        age_range: ['6+ months'],
        feeding_methods: ['puree', 'baby-led weaning'],
        serving_forms: ['mashed', 'whole (12+ months)', 'pureed'],
        risk_level: 'medium',
        nutrients_focus: ['Protein', 'Fiber', 'Iron', 'Folate'],
        do_list: ['Cook until very soft', 'Mash for younger babies', 'Use low-sodium'],
        dont_list: ['Do not serve whole to babies under 12 months', 'Avoid canned with added sodium'],
        why: 'White beans are creamy and mild, providing plant-based protein and fiber for growth.',
        how_to: ['Cook beans until very soft', 'Mash for younger babies', 'Season lightly', 'Serve warm'],
        portion_hint: '2-3 tablespoons',
        media: [{ type: 'image', url: '/images/foods/white-beans.webp', alt: 'white-beans for babies', caption: 'Professional food photography of white-beans' }],
        status: 'published'
    },
    {
        slug: 'kidney-beans',
        name: 'Kidney Beans',
        locale: 'Global',
        age_range: ['6+ months'],
        feeding_methods: ['puree', 'baby-led weaning'],
        serving_forms: ['mashed', 'whole (12+ months)', 'pureed'],
        risk_level: 'medium',
        nutrients_focus: ['Protein', 'Iron', 'Fiber', 'Folate'],
        do_list: ['Cook until very soft', 'Mash for younger babies', 'Use low-sodium'],
        dont_list: ['Do not serve whole to babies under 12 months', 'Avoid canned with added sodium'],
        why: 'Kidney beans are rich in iron and protein, essential for blood health and growth.',
        how_to: ['Cook beans until very soft', 'Mash for younger babies', 'Mix into other foods', 'Serve warm'],
        portion_hint: '2-3 tablespoons',
        media: [{ type: 'image', url: '/images/foods/kidney-beans.webp', alt: 'kidney-beans for babies', caption: 'Professional food photography of kidney-beans' }],
        status: 'published'
    },

    // Grains
    {
        slug: 'barley',
        name: 'Barley',
        locale: 'Global',
        age_range: ['6+ months'],
        feeding_methods: ['spoon-feeding', 'baby-led weaning'],
        serving_forms: ['cooked grains', 'mixed into foods', 'barley cereal'],
        risk_level: 'low',
        nutrients_focus: ['Fiber', 'Iron', 'B Vitamins', 'Selenium'],
        do_list: ['Cook until very soft', 'Start with small amounts', 'Mix with other foods'],
        dont_list: ['Do not serve undercooked', 'Avoid adding salt'],
        why: 'Barley is fiber-rich and nutrient-dense, supporting digestive health and providing sustained energy.',
        how_to: ['Cook barley according to package directions', 'Ensure very soft texture', 'Mix with vegetables or fruit', 'Serve warm'],
        portion_hint: '2-4 tablespoons',
        media: [{ type: 'image', url: '/images/foods/barley.webp', alt: 'barley for babies', caption: 'Professional food photography of barley' }],
        status: 'published'
    },
    {
        slug: 'couscous',
        name: 'Couscous',
        locale: 'Global',
        age_range: ['8+ months'],
        feeding_methods: ['spoon-feeding', 'baby-led weaning'],
        serving_forms: ['cooked grains', 'mixed into foods'],
        risk_level: 'low',
        nutrients_focus: ['Carbohydrates', 'Protein', 'B Vitamins', 'Selenium'],
        do_list: ['Cook until soft', 'Serve with broth or vegetables', 'Keep moist'],
        dont_list: ['Do not serve dry', 'Avoid adding salt'],
        why: 'Couscous is easy to digest and versatile, providing energy and essential nutrients.',
        how_to: ['Cook couscous according to package directions', 'Fluff with a fork', 'Mix with vegetables or protein', 'Serve warm'],
        portion_hint: '2-4 tablespoons',
        media: [{ type: 'image', url: '/images/foods/couscous.webp', alt: 'couscous for babies', caption: 'Professional food photography of couscous' }],
        status: 'published'
    },
    {
        slug: 'millet',
        name: 'Millet',
        locale: 'Global',
        age_range: ['6+ months'],
        feeding_methods: ['spoon-feeding', 'baby-led weaning'],
        serving_forms: ['cooked grains', 'porridge', 'mixed into foods'],
        risk_level: 'low',
        nutrients_focus: ['Iron', 'Magnesium', 'Fiber', 'B Vitamins'],
        do_list: ['Cook until very soft', 'Toast before cooking for nuttier flavor', 'Mix with other foods'],
        dont_list: ['Do not serve undercooked', 'Avoid adding salt'],
        why: 'Millet is gluten-free and iron-rich, supporting blood health and introducing ancient grains.',
        how_to: ['Rinse millet', 'Cook according to package directions until very soft', 'Mix with vegetables or fruit', 'Serve warm'],
        portion_hint: '2-4 tablespoons',
        media: [{ type: 'image', url: '/images/foods/millet.webp', alt: 'millet for babies', caption: 'Professional food photography of millet' }],
        status: 'published'
    },
    {
        slug: 'farro',
        name: 'Farro',
        locale: 'Global',
        age_range: ['8+ months'],
        feeding_methods: ['spoon-feeding', 'baby-led weaning'],
        serving_forms: ['cooked grains', 'mixed into foods'],
        risk_level: 'low',
        nutrients_focus: ['Protein', 'Fiber', 'Iron', 'Magnesium'],
        do_list: ['Cook until very soft', 'Use pearled farro for easier digestion', 'Mix with vegetables'],
        dont_list: ['Do not serve undercooked', 'Avoid whole farro for younger babies'],
        why: 'Farro is an ancient grain rich in protein and fiber, supporting growth and digestive health.',
        how_to: ['Cook farro until very soft', 'Cool to safe temperature', 'Mix with vegetables or protein', 'Serve warm'],
        portion_hint: '2-4 tablespoons',
        media: [{ type: 'image', url: '/images/foods/farro.webp', alt: 'farro for babies', caption: 'Professional food photography of farro' }],
        status: 'published'
    },
    {
        slug: 'polenta',
        name: 'Polenta',
        locale: 'Global',
        age_range: ['6+ months'],
        feeding_methods: ['spoon-feeding', 'baby-led weaning'],
        serving_forms: ['soft porridge', 'firm slices (12+ months)'],
        risk_level: 'low',
        nutrients_focus: ['Carbohydrates', 'Vitamin A', 'Fiber', 'Iron'],
        do_list: ['Cook until creamy', 'Keep soft for younger babies', 'Mix with cheese or vegetables'],
        dont_list: ['Do not serve undercooked', 'Avoid adding excessive salt'],
        why: 'Polenta is smooth and mild, providing energy and a comforting texture babies love.',
        how_to: ['Cook polenta according to package directions', 'Keep creamy consistency', 'Mix with cheese or vegetables', 'Serve warm'],
        portion_hint: '2-4 tablespoons',
        media: [{ type: 'image', url: '/images/foods/polenta.webp', alt: 'polenta for babies', caption: 'Professional food photography of polenta' }],
        status: 'published'
    },

    // Fruits
    {
        slug: 'apricot',
        name: 'Apricot',
        locale: 'Global',
        age_range: ['6+ months'],
        feeding_methods: ['baby-led weaning', 'puree'],
        serving_forms: ['fresh halves', 'steamed', 'dried (12+ months)'],
        risk_level: 'low',
        nutrients_focus: ['Vitamin A', 'Vitamin C', 'Potassium', 'Fiber'],
        do_list: ['Choose very ripe apricots', 'Remove pit and skin', 'Steam if not very ripe'],
        dont_list: ['Do not serve with pit', 'Avoid unripe apricots', 'Limit dried apricots'],
        why: 'Apricots are rich in vitamin A for vision and skin health, with natural sweetness babies enjoy.',
        how_to: ['Wash and halve apricot', 'Remove pit', 'Peel if desired', 'Steam if needed', 'Serve at room temperature'],
        portion_hint: '1/2 to 1 apricot',
        media: [{ type: 'image', url: '/images/foods/apricot.webp', alt: 'apricot for babies', caption: 'Professional food photography of apricot' }],
        status: 'published'
    },
    {
        slug: 'nectarine',
        name: 'Nectarine',
        locale: 'Global',
        age_range: ['6+ months'],
        feeding_methods: ['baby-led weaning', 'puree'],
        serving_forms: ['fresh wedges', 'slices', 'mashed'],
        risk_level: 'low',
        nutrients_focus: ['Vitamin C', 'Vitamin A', 'Potassium', 'Fiber'],
        do_list: ['Choose ripe, soft nectarines', 'Remove pit and skin', 'Cut into wedges'],
        dont_list: ['Do not serve with pit', 'Avoid unripe, hard nectarines'],
        why: 'Nectarines are juicy and vitamin-rich, supporting immune health and hydration.',
        how_to: ['Wash and slice nectarine', 'Remove pit', 'Peel if desired', 'Cut into wedges', 'Serve at room temperature'],
        portion_hint: '2-3 wedges or 1/4 to 1/2 nectarine',
        media: [{ type: 'image', url: '/images/foods/nectarine.webp', alt: 'nectarine for babies', caption: 'Professional food photography of nectarine' }],
        status: 'published'
    },
    {
        slug: 'pomegranate',
        name: 'Pomegranate',
        locale: 'Global',
        age_range: ['12+ months'],
        feeding_methods: ['baby-led weaning'],
        serving_forms: ['arils (seeds removed)', 'juice (limited)'],
        risk_level: 'high',
        nutrients_focus: ['Vitamin C', 'Vitamin K', 'Folate', 'Antioxidants'],
        do_list: ['Remove all seeds for babies under 2 years', 'Offer arils one at a time', 'Supervise closely'],
        dont_list: ['Do not serve with seeds to young babies', 'Avoid excessive juice'],
        why: 'Pomegranate is packed with antioxidants, but requires careful preparation for safety.',
        how_to: ['Cut pomegranate and remove arils', 'Remove all hard seeds', 'Offer a few arils at a time', 'Supervise closely'],
        portion_hint: '1-2 tablespoons arils (no seeds)',
        media: [{ type: 'image', url: '/images/foods/pomegranate.webp', alt: 'pomegranate for babies', caption: 'Professional food photography of pomegranate' }],
        status: 'published'
    },
    {
        slug: 'dragon-fruit',
        name: 'Dragon Fruit',
        locale: 'Global',
        age_range: ['6+ months'],
        feeding_methods: ['baby-led weaning', 'puree'],
        serving_forms: ['cubes', 'slices', 'mashed'],
        risk_level: 'low',
        nutrients_focus: ['Vitamin C', 'Fiber', 'Iron', 'Magnesium'],
        do_list: ['Choose ripe dragon fruit', 'Remove skin completely', 'Cut into cubes'],
        dont_list: ['Do not serve with skin', 'Avoid unripe dragon fruit'],
        why: 'Dragon fruit is mild, hydrating, and rich in vitamin C and fiber for immunity and digestion.',
        how_to: ['Cut dragon fruit in half', 'Scoop out flesh', 'Cut into cubes', 'Serve at room temperature'],
        portion_hint: '2-4 tablespoons cubed',
        media: [{ type: 'image', url: '/images/foods/dragon-fruit.webp', alt: 'dragon-fruit for babies', caption: 'Professional food photography of dragon-fruit' }],
        status: 'published'
    },
    {
        slug: 'persimmon',
        name: 'Persimmon',
        locale: 'Global',
        age_range: ['6+ months'],
        feeding_methods: ['baby-led weaning', 'puree'],
        serving_forms: ['ripe slices', 'puree', 'mashed'],
        risk_level: 'low',
        nutrients_focus: ['Vitamin A', 'Vitamin C', 'Fiber', 'Antioxidants'],
        do_list: ['Use Fuyu (crisp) or very ripe Hachiya', 'Remove skin and seeds', 'Ensure very soft'],
        dont_list: ['Do not serve unripe Hachiya (very astringent)', 'Avoid with seeds'],
        why: 'Persimmons are sweet and rich in vitamins A and C, supporting vision and immune health.',
        how_to: ['Choose very ripe persimmon', 'Remove skin', 'Cut into wedges', 'Remove any seeds', 'Serve at room temperature'],
        portion_hint: '2-3 wedges or 2-3 tablespoons',
        media: [{ type: 'image', url: '/images/foods/persimmon.webp', alt: 'persimmon for babies', caption: 'Professional food photography of persimmon' }],
        status: 'published'
    },

    // Dairy
    {
        slug: 'cottage-cheese',
        name: 'Cottage Cheese',
        locale: 'Global',
        age_range: ['6+ months'],
        feeding_methods: ['spoon-feeding', 'baby-led weaning'],
        serving_forms: ['small curd', 'blended smooth', 'mixed into foods'],
        risk_level: 'low',
        nutrients_focus: ['Protein', 'Calcium', 'Vitamin B12', 'Phosphorus'],
        do_list: ['Choose low-sodium varieties', 'Blend for smoother texture', 'Mix with fruit'],
        dont_list: ['Avoid high-sodium cottage cheese', 'Do not serve large curds to young babies'],
        why: 'Cottage cheese is protein and calcium-rich, supporting bone health and growth.',
        how_to: ['Choose low-sodium cottage cheese', 'Blend if desired for smoother texture', 'Mix with fruit or vegetables', 'Serve at room temperature'],
        portion_hint: '2-4 tablespoons',
        media: [{ type: 'image', url: '/images/foods/cottage-cheese.webp', alt: 'cottage-cheese for babies', caption: 'Professional food photography of cottage-cheese' }],
        status: 'published'
    },
    {
        slug: 'cream-cheese',
        name: 'Cream Cheese',
        locale: 'Global',
        age_range: ['6+ months'],
        feeding_methods: ['spread', 'mixed into foods'],
        serving_forms: ['spread on toast', 'mixed into purees', 'on crackers'],
        risk_level: 'low',
        nutrients_focus: ['Calcium', 'Vitamin A', 'Protein', 'Fat'],
        do_list: ['Use as a spread on toast or crackers', 'Choose full-fat versions', 'Mix with fruit'],
        dont_list: ['Avoid low-fat versions for babies under 2', 'Do not serve in large amounts'],
        why: 'Cream cheese provides healthy fats and calcium, supporting brain development and bone health.',
        how_to: ['Spread on toast or crackers', 'Mix with fruit purees', 'Use as a dip for vegetables', 'Serve at room temperature'],
        portion_hint: '1-2 tablespoons',
        media: [{ type: 'image', url: '/images/foods/cream-cheese.webp', alt: 'cream-cheese for babies', caption: 'Professional food photography of cream-cheese' }],
        status: 'published'
    }
];

async function addNewFoodsToDatabase() {
    console.log('🍎 Adding 20 new foods (batch 5) to database...\n');

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (const food of newFoods) {
        try {
            const { data, error } = await supabase
                .from('kb_foods')
                .insert([food])
                .select();

            if (error) {
                if (error.code === '23505') {
                    console.log(`⚠️  ${food.name} already exists, skipping...`);
                    skippedCount++;
                } else {
                    console.error(`❌ Error adding ${food.name}:`, error.message);
                    errorCount++;
                }
            } else if (data && data.length > 0) {
                console.log(`✅ Added ${food.name} (${food.slug})`);
                successCount++;
            }
        } catch (err) {
            console.error(`❌ Fatal error adding ${food.name}:`, err);
            errorCount++;
        }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Successfully added: ${successCount}`);
    console.log(`   ⚠️  Already existed: ${skippedCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📝 Total attempted: ${newFoods.length}`);
    console.log('\n✨ Done!');

    process.exit(errorCount > 0 ? 1 : 0);
}

addNewFoodsToDatabase().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
