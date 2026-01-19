const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 21 new foods from batches 2-4 to add to database
const newFoods = [
    // From Batch 2-3 (vegetables)
    {
        slug: 'asparagus',
        name: 'Asparagus',
        locale: 'Global',
        age_range: ['8+ months'],
        feeding_methods: ['baby-led weaning'],
        serving_forms: ['steamed spears', 'chopped pieces'],
        risk_level: 'low',
        nutrients_focus: ['Folate', 'Vitamin K', 'Fiber', 'Vitamin A'],
        do_list: ['Steam until very soft', 'Leave whole spears for gripping', 'Remove tough ends'],
        dont_list: ['Do not serve raw', 'Avoid thin, hard spears'],
        why: 'Asparagus is rich in folate and vitamin K, supporting cell growth and bone health.',
        how_to: ['Wash asparagus thoroughly', 'Trim tough ends', 'Steam for 8-10 minutes until very soft', 'Serve whole or chopped'],
        portion_hint: '2-3 spears or 2 tablespoons chopped',
        media: [{ type: 'image', url: '/images/foods/asparagus.webp', alt: 'asparagus for babies', caption: 'Professional food photography of asparagus' }],
        status: 'published'
    },
    {
        slug: 'bell-pepper',
        name: 'Bell Pepper',
        locale: 'Global',
        age_range: ['8+ months'],
        feeding_methods: ['baby-led weaning', 'puree'],
        serving_forms: ['roasted strips', 'steamed pieces', 'pureed'],
        risk_level: 'low',
        nutrients_focus: ['Vitamin C', 'Vitamin A', 'Vitamin B6', 'Folate'],
        do_list: ['Roast or steam until very soft', 'Remove skin and seeds', 'Cut into strips'],
        dont_list: ['Do not serve raw to young babies', 'Avoid with skin for babies under 12 months'],
        why: 'Bell peppers are packed with vitamin C and antioxidants, supporting immune health and vision.',
        how_to: ['Roast at 400°F for 20-25 minutes until soft', 'Remove skin and seeds', 'Cut into strips or puree', 'Serve warm'],
        portion_hint: '2-3 strips or 2-3 tablespoons pureed',
        media: [{ type: 'image', url: '/images/foods/bell-pepper.webp', alt: 'bell-pepper for babies', caption: 'Professional food photography of bell-pepper' }],
        status: 'published'
    },
    {
        slug: 'beets',
        name: 'Beets',
        locale: 'Global',
        age_range: ['6+ months'],
        feeding_methods: ['puree', 'baby-led weaning'],
        serving_forms: ['roasted cubes', 'mashed', 'pureed'],
        risk_level: 'low',
        nutrients_focus: ['Folate', 'Manganese', 'Potassium', 'Fiber'],
        do_list: ['Roast until very soft', 'Peel before serving', 'Cut into small cubes'],
        dont_list: ['Do not serve raw', 'Avoid canned beets with added sodium'],
        why: 'Beets are rich in folate and antioxidants, supporting brain development and overall health.',
        how_to: ['Wash and wrap beets in foil', 'Roast at 400°F for 45-60 minutes', 'Peel and cut into cubes', 'Serve warm or room temperature'],
        portion_hint: '2-3 tablespoons cubed or pureed',
        media: [{ type: 'image', url: '/images/foods/beets.webp', alt: 'beets for babies', caption: 'Professional food photography of beets' }],
        status: 'published'
    },
    {
        slug: 'butternut-squash',
        name: 'Butternut Squash',
        locale: 'Global',
        age_range: ['6+ months'],
        feeding_methods: ['puree', 'baby-led weaning'],
        serving_forms: ['roasted cubes', 'mashed', 'pureed'],
        risk_level: 'low',
        nutrients_focus: ['Vitamin A', 'Vitamin C', 'Potassium', 'Fiber'],
        do_list: ['Roast until very soft', 'Remove skin and seeds', 'Cut into cubes'],
        dont_list: ['Do not serve raw', 'Avoid with skin for young babies'],
        why: 'Butternut squash is rich in vitamin A for vision and immune health, with a naturally sweet flavor babies love.',
        how_to: ['Cut in half and remove seeds', 'Roast at 400°F for 40-45 minutes', 'Scoop out flesh and cube or mash', 'Serve warm'],
        portion_hint: '2-3 tablespoons cubed or pureed',
        media: [{ type: 'image', url: '/images/foods/butternut-squash.webp', alt: 'butternut-squash for babies', caption: 'Professional food photography of butternut-squash' }],
        status: 'published'
    },
    {
        slug: 'cucumber',
        name: 'Cucumber',
        locale: 'Global',
        age_range: ['6+ months'],
        feeding_methods: ['baby-led weaning'],
        serving_forms: ['thick sticks', 'spears with skin'],
        risk_level: 'low',
        nutrients_focus: ['Hydration', 'Vitamin K', 'Potassium', 'Vitamin C'],
        do_list: ['Peel for babies under 12 months', 'Cut into thick sticks', 'Serve chilled'],
        dont_list: ['Do not cut into thin rounds (choking hazard)', 'Avoid with seeds for young babies'],
        why: 'Cucumbers are hydrating and refreshing, perfect for teething babies and hot days.',
        how_to: ['Wash and peel cucumber', 'Cut lengthwise into thick sticks', 'Remove seeds if desired', 'Serve chilled'],
        portion_hint: '1-2 thick sticks',
        media: [{ type: 'image', url: '/images/foods/cucumber.webp', alt: 'cucumber for babies', caption: 'Professional food photography of cucumber' }],
        status: 'published'
    },
    {
        slug: 'kale',
        name: 'Kale',
        locale: 'Global',
        age_range: ['6+ months'],
        feeding_methods: ['puree', 'baby-led weaning'],
        serving_forms: ['cooked and chopped', 'pureed', 'mixed into foods'],
        risk_level: 'low',
        nutrients_focus: ['Vitamin K', 'Vitamin A', 'Vitamin C', 'Calcium'],
        do_list: ['Cook until very soft', 'Remove tough stems', 'Chop finely'],
        dont_list: ['Do not serve raw', 'Avoid tough stems and ribs'],
        why: 'Kale is a nutrient powerhouse, rich in vitamins K, A, and C for bone health and immunity.',
        how_to: ['Wash kale and remove stems', 'Steam or sauté until very soft', 'Chop finely or puree', 'Mix into other foods'],
        portion_hint: '1-2 tablespoons chopped or pureed',
        media: [{ type: 'image', url: '/images/foods/kale.webp', alt: 'kale for babies', caption: 'Professional food photography of kale' }],
        status: 'published'
    },
    {
        slug: 'spinach',
        name: 'Spinach',
        locale: 'Global',
        age_range: ['6+ months'],
        feeding_methods: ['puree', 'baby-led weaning'],
        serving_forms: ['cooked and chopped', 'pureed', 'mixed into foods'],
        risk_level: 'low',
        nutrients_focus: ['Iron', 'Folate', 'Vitamin K', 'Vitamin A'],
        do_list: ['Cook until very soft', 'Chop finely', 'Mix with vitamin C foods for iron absorption'],
        dont_list: ['Do not serve raw to young babies', 'Avoid large pieces'],
        why: 'Spinach is rich in iron and folate, essential for blood health and brain development.',
        how_to: ['Wash spinach thoroughly', 'Steam or sauté until wilted', 'Chop finely or puree', 'Mix with other foods'],
        portion_hint: '1-2 tablespoons cooked',
        media: [{ type: 'image', url: '/images/foods/spinach.webp', alt: 'spinach for babies', caption: 'Professional food photography of spinach' }],
        status: 'published'
    },
    {
        slug: 'tomato',
        name: 'Tomato',
        locale: 'Global',
        age_range: ['6+ months'],
        feeding_methods: ['baby-led weaning', 'puree'],
        serving_forms: ['quartered cherry tomatoes', 'cooked and diced', 'sauce'],
        risk_level: 'medium',
        nutrients_focus: ['Vitamin C', 'Lycopene', 'Potassium', 'Folate'],
        do_list: ['Remove seeds and skin for young babies', 'Quarter cherry tomatoes', 'Cook to reduce acidity'],
        dont_list: ['Do not serve whole cherry tomatoes', 'Avoid raw tomatoes for babies under 8 months'],
        why: 'Tomatoes are rich in vitamin C and lycopene, supporting immune health and antioxidant protection.',
        how_to: ['Wash tomatoes', 'Quarter cherry tomatoes and remove seeds', 'Or cook and dice larger tomatoes', 'Serve at room temperature'],
        portion_hint: '3-5 quartered cherry tomatoes or 2-3 tablespoons cooked',
        media: [{ type: 'image', url: '/images/foods/tomato.webp', alt: 'tomato for babies', caption: 'Professional food photography of tomato' }],
        status: 'published'
    },

    // Fruits
    {
        slug: 'blackberry',
        name: 'Blackberry',
        locale: 'Global',
        age_range: ['6+ months'],
        feeding_methods: ['puree', 'baby-led weaning'],
        serving_forms: ['quartered', 'mashed', 'whole (12+ months)'],
        risk_level: 'medium',
        nutrients_focus: ['Vitamin C', 'Vitamin K', 'Fiber', 'Antioxidants'],
        do_list: ['Quarter for babies under 12 months', 'Wash thoroughly', 'Serve fresh or lightly cooked'],
        dont_list: ['Do not serve whole to babies under 12 months', 'Avoid dried blackberries'],
        why: 'Blackberries are packed with antioxidants and fiber, supporting immune health and digestion.',
        how_to: ['Wash blackberries thoroughly', 'Quarter each berry', 'For younger babies, mash or puree', 'Serve at room temperature'],
        portion_hint: '5-8 quartered berries',
        media: [{ type: 'image', url: '/images/foods/blackberry.webp', alt: 'blackberry for babies', caption: 'Professional food photography of blackberry' }],
        status: 'published'
    },
    {
        slug: 'cantaloupe',
        name: 'Cantaloupe',
        locale: 'Global',
        age_range: ['6+ months'],
        feeding_methods: ['baby-led weaning', 'puree'],
        serving_forms: ['wedges with rind', 'cubes (12+ months)', 'mashed'],
        risk_level: 'low',
        nutrients_focus: ['Vitamin A', 'Vitamin C', 'Potassium', 'Hydration'],
        do_list: ['Choose ripe, soft cantaloupe', 'Leave rind on wedges for grip', 'Remove seeds'],
        dont_list: ['Do not serve with rind to babies who can bite through it', 'Avoid small cubes for young babies'],
        why: 'Cantaloupe is hydrating and rich in vitamins A and C, supporting vision and immune health.',
        how_to: ['Cut cantaloupe into wedges', 'Remove seeds', 'Leave rind on for easier gripping', 'Serve chilled or room temperature'],
        portion_hint: '1-2 wedges',
        media: [{ type: 'image', url: '/images/foods/cantaloupe.webp', alt: 'cantaloupe for babies', caption: 'Professional food photography of cantaloupe' }],
        status: 'published'
    },
    {
        slug: 'kiwi',
        name: 'Kiwi',
        locale: 'Global',
        age_range: ['6+ months'],
        feeding_methods: ['baby-led weaning', 'puree'],
        serving_forms: ['sliced rounds', 'wedges', 'mashed'],
        risk_level: 'low',
        nutrients_focus: ['Vitamin C', 'Vitamin K', 'Fiber', 'Folate'],
        do_list: ['Choose ripe, soft kiwis', 'Peel completely', 'Cut into rounds or wedges'],
        dont_list: ['Do not serve with skin', 'Avoid unripe, hard kiwis'],
        why: 'Kiwis are exceptionally high in vitamin C, supporting immune health and iron absorption.',
        how_to: ['Peel kiwi completely', 'Cut into rounds or wedges', 'For younger babies, mash or puree', 'Serve at room temperature'],
        portion_hint: '1/4 to 1/2 kiwi',
        media: [{ type: 'image', url: '/images/foods/kiwi.webp', alt: 'kiwi for babies', caption: 'Professional food photography of kiwi' }],
        status: 'published'
    },
    {
        slug: 'orange',
        name: 'Orange',
        locale: 'Global',
        age_range: ['8+ months'],
        feeding_methods: ['baby-led weaning', 'puree'],
        serving_forms: ['peeled segments', 'juice (limited)', 'mashed'],
        risk_level: 'medium',
        nutrients_focus: ['Vitamin C', 'Folate', 'Potassium', 'Fiber'],
        do_list: ['Remove all membranes and pith', 'Offer small segments', 'Limit juice to 2-4 oz per day'],
        dont_list: ['Do not serve with membranes to young babies', 'Avoid excessive juice'],
        why: 'Oranges are rich in vitamin C, supporting immune health and iron absorption.',
        how_to: ['Peel orange completely', 'Separate into segments', 'Remove all membranes', 'Serve at room temperature'],
        portion_hint: '2-3 segments',
        media: [{ type: 'image', url: '/images/foods/orange.webp', alt: 'orange for babies', caption: 'Professional food photography of orange' }],
        status: 'published'
    },
    {
        slug: 'papaya',
        name: 'Papaya',
        locale: 'Global',
        age_range: ['6+ months'],
        feeding_methods: ['baby-led weaning', 'puree'],
        serving_forms: ['strips', 'cubes', 'mashed'],
        risk_level: 'low',
        nutrients_focus: ['Vitamin C', 'Vitamin A', 'Folate', 'Fiber'],
        do_list: ['Choose ripe, soft papaya', 'Remove seeds and skin', 'Cut into strips'],
        dont_list: ['Do not serve with seeds', 'Avoid unripe papaya'],
        why: 'Papaya is rich in digestive enzymes and vitamins, supporting gut health and immunity.',
        how_to: ['Cut papaya in half and remove seeds', 'Peel and cut into strips', 'For younger babies, mash or puree', 'Serve at room temperature'],
        portion_hint: '2-3 strips or 2-3 tablespoons mashed',
        media: [{ type: 'image', url: '/images/foods/papaya.webp', alt: 'papaya for babies', caption: 'Professional food photography of papaya' }],
        status: 'published'
    },
    {
        slug: 'plum',
        name: 'Plum',
        locale: 'Global',
        age_range: ['6+ months'],
        feeding_methods: ['baby-led weaning', 'puree'],
        serving_forms: ['steamed slices', 'fresh wedges (ripe)', 'mashed'],
        risk_level: 'low',
        nutrients_focus: ['Vitamin C', 'Vitamin K', 'Potassium', 'Fiber'],
        do_list: ['Choose ripe, soft plums', 'Remove skin and pit', 'Steam if not very ripe'],
        dont_list: ['Do not serve with skin to young babies', 'Avoid unripe, hard plums'],
        why: 'Plums are rich in fiber and antioxidants, supporting digestive health and immunity.',
        how_to: ['Wash and peel plum', 'Remove pit', 'Cut into wedges', 'Steam if needed', 'Serve warm or room temperature'],
        portion_hint: '2-3 wedges or 2-3 tablespoons mashed',
        media: [{ type: 'image', url: '/images/foods/plum.webp', alt: 'plum for babies', caption: 'Professional food photography of plum' }],
        status: 'published'
    },
    {
        slug: 'raspberry',
        name: 'Raspberry',
        locale: 'Global',
        age_range: ['6+ months'],
        feeding_methods: ['puree', 'baby-led weaning'],
        serving_forms: ['mashed', 'whole (12+ months)', 'pureed'],
        risk_level: 'medium',
        nutrients_focus: ['Vitamin C', 'Fiber', 'Manganese', 'Antioxidants'],
        do_list: ['Mash for babies under 12 months', 'Wash thoroughly', 'Serve fresh'],
        dont_list: ['Do not serve whole to babies under 12 months', 'Avoid dried raspberries'],
        why: 'Raspberries are packed with antioxidants and fiber, supporting immune health and digestion.',
        how_to: ['Wash raspberries thoroughly', 'Mash with a fork for younger babies', 'For older babies, serve whole', 'Serve at room temperature'],
        portion_hint: '5-8 raspberries mashed',
        media: [{ type: 'image', url: '/images/foods/raspberry.webp', alt: 'raspberry for babies', caption: 'Professional food photography of raspberry' }],
        status: 'published'
    },

    // Proteins
    {
        slug: 'black-beans',
        name: 'Black Beans',
        locale: 'Global',
        age_range: ['6+ months'],
        feeding_methods: ['puree', 'baby-led weaning'],
        serving_forms: ['mashed', 'whole (12+ months)', 'pureed'],
        risk_level: 'medium',
        nutrients_focus: ['Protein', 'Iron', 'Fiber', 'Folate'],
        do_list: ['Cook until very soft', 'Mash slightly for younger babies', 'Use low-sodium or homemade'],
        dont_list: ['Do not serve whole to babies under 12 months', 'Avoid canned beans with added sodium'],
        why: 'Black beans are rich in plant-based protein and iron, supporting growth and blood health.',
        how_to: ['Cook beans until very soft', 'Mash slightly for younger babies', 'Season lightly if desired', 'Serve warm'],
        portion_hint: '2-3 tablespoons',
        media: [{ type: 'image', url: '/images/foods/black-beans.webp', alt: 'black-beans for babies', caption: 'Professional food photography of black-beans' }],
        status: 'published'
    },
    {
        slug: 'lamb',
        name: 'Lamb',
        locale: 'Global',
        age_range: ['6+ months'],
        feeding_methods: ['puree', 'baby-led weaning'],
        serving_forms: ['ground', 'shredded', 'strips'],
        risk_level: 'medium',
        nutrients_focus: ['Protein', 'Iron', 'Zinc', 'B Vitamins'],
        do_list: ['Cook thoroughly until internal temp reaches 145°F', 'Shred or cut into strips', 'Keep moist'],
        dont_list: ['Never serve undercooked lamb', 'Avoid dry, tough pieces', 'Do not add salt for young babies'],
        why: 'Lamb is an excellent source of protein and iron, essential for growth and development.',
        how_to: ['Cook lamb thoroughly', 'Shred finely for younger babies', 'Cut into strips for baby-led weaning', 'Mix with vegetables or broth'],
        portion_hint: '1-2 tablespoons shredded or 1-2 strips',
        media: [{ type: 'image', url: '/images/foods/lamb.webp', alt: 'lamb for babies', caption: 'Professional food photography of lamb' }],
        status: 'published'
    },
    {
        slug: 'pork',
        name: 'Pork',
        locale: 'Global',
        age_range: ['6+ months'],
        feeding_methods: ['puree', 'baby-led weaning'],
        serving_forms: ['ground', 'shredded', 'strips'],
        risk_level: 'medium',
        nutrients_focus: ['Protein', 'Thiamine', 'Selenium', 'Zinc'],
        do_list: ['Cook thoroughly until internal temp reaches 145°F', 'Choose lean cuts', 'Shred or cut into strips'],
        dont_list: ['Never serve undercooked pork', 'Avoid processed pork products', 'Do not add salt for young babies'],
        why: 'Pork is rich in protein and thiamine, supporting energy metabolism and growth.',
        how_to: ['Cook pork thoroughly', 'Shred finely for younger babies', 'Cut into strips for baby-led weaning', 'Keep moist with broth'],
        portion_hint: '1-2 tablespoons shredded or 1-2 strips',
        media: [{ type: 'image', url: '/images/foods/pork.webp', alt: 'pork for babies', caption: 'Professional food photography of pork' }],
        status: 'published'
    },
    {
        slug: 'tofu',
        name: 'Tofu',
        locale: 'Global',
        age_range: ['6+ months'],
        feeding_methods: ['baby-led weaning', 'puree'],
        serving_forms: ['soft cubes', 'mashed', 'strips'],
        risk_level: 'low',
        nutrients_focus: ['Protein', 'Calcium', 'Iron', 'Magnesium'],
        do_list: ['Use soft or silken tofu', 'Cut into cubes or strips', 'Can serve raw or cooked'],
        dont_list: ['Avoid firm tofu for young babies', 'Do not serve with added sauces'],
        why: 'Tofu is a great plant-based protein source, rich in calcium and iron for bone and blood health.',
        how_to: ['Drain tofu and pat dry', 'Cut into cubes or strips', 'Can serve raw or lightly cook', 'Mix into other foods'],
        portion_hint: '2-3 tablespoons cubed',
        media: [{ type: 'image', url: '/images/foods/tofu.webp', alt: 'tofu for babies', caption: 'Professional food photography of tofu' }],
        status: 'published'
    },
    {
        slug: 'turkey',
        name: 'Turkey',
        locale: 'Global',
        age_range: ['6+ months'],
        feeding_methods: ['puree', 'baby-led weaning'],
        serving_forms: ['ground', 'shredded', 'strips'],
        risk_level: 'medium',
        nutrients_focus: ['Protein', 'Iron', 'Zinc', 'B Vitamins'],
        do_list: ['Cook thoroughly until internal temp reaches 165°F', 'Shred or cut into strips', 'Keep moist'],
        dont_list: ['Never serve undercooked turkey', 'Avoid dry, tough pieces', 'Do not add salt for young babies'],
        why: 'Turkey is lean protein rich in iron and B vitamins, supporting growth and energy.',
        how_to: ['Cook turkey breast thoroughly', 'Shred finely for younger babies', 'Cut into strips for baby-led weaning', 'Mix with vegetables or broth'],
        portion_hint: '1-2 tablespoons shredded or 1-2 strips',
        media: [{ type: 'image', url: '/images/foods/turkey.webp', alt: 'turkey for babies', caption: 'Professional food photography of turkey' }],
        status: 'published'
    },

    // Grains
    {
        slug: 'quinoa',
        name: 'Quinoa',
        locale: 'Global',
        age_range: ['6+ months'],
        feeding_methods: ['spoon-feeding', 'baby-led weaning'],
        serving_forms: ['cooked grains', 'mixed into foods', 'quinoa balls'],
        risk_level: 'low',
        nutrients_focus: ['Protein', 'Iron', 'Fiber', 'Magnesium'],
        do_list: ['Rinse before cooking', 'Cook until very soft', 'Mix with other foods'],
        dont_list: ['Do not serve undercooked', 'Avoid adding salt'],
        why: 'Quinoa is a complete protein with all essential amino acids, plus iron and fiber for growth.',
        how_to: ['Rinse quinoa thoroughly', 'Cook according to package directions', 'Cool to safe temperature', 'Mix with vegetables or serve as is'],
        portion_hint: '2-4 tablespoons',
        media: [{ type: 'image', url: '/images/foods/quinoa.webp', alt: 'quinoa for babies', caption: 'Professional food photography of quinoa' }],
        status: 'published'
    }
];

async function addNewFoodsToDatabase() {
    console.log('🍎 Adding 21 new foods to database...\n');

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
                // Check if it's a duplicate
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
