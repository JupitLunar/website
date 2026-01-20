const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// New foods batch 6
const newFoods = [
    {
        slug: 'pumpkin',
        name: 'Pumpkin',
        locale: "Global",
        age_range: ['6+ months'],
        feeding_methods: ['puree', 'baby-led weaning'],
        serving_forms: ['puree', 'roasted wedges'],
        risk_level: 'low',
        nutrients_focus: ['Vitamin A', 'Fiber', 'Vitamin C'],
        do_list: ['Roast or steam until very soft', 'Remove skin and seeds', 'Puree for smooth texture'],
        dont_list: ['Do not serve raw', 'Avoid pumpkin pie filling with added sugar'],
        why: 'Pumpkin is packed with Vitamin A for eye health and has a sweet, mild flavor babies love.',
        how_to: ['Peel and remove seeds', 'Cut into chunks and roast or steam', 'Mash or puree with breast milk/formula', 'Serve warm'],
        portion_hint: '2-3 tablespoons puree',
        media: [{ type: 'image', url: '/images/foods/pumpkin.webp', alt: 'pumpkin for babies', caption: 'Fresh pumpkin puree' }],
        status: 'published'
    },
    {
        slug: 'cod',
        name: 'Cod (White Fish)',
        locale: "Global",
        age_range: ['6+ months'],
        feeding_methods: ['puree', 'baby-led weaning'],
        serving_forms: ['flaked', 'mashed'],
        risk_level: 'medium',
        nutrients_focus: ['Protein', 'Omega-3', 'Vitamin B12'],
        do_list: ['Cook thoroughly', 'Check carefully for bones', 'Flake into small pieces'],
        dont_list: ['Do not serve undercooked', 'Avoid fried fish fingers with salt'],
        why: 'White fish like cod is an excellent source of lean protein and essential fatty acids for brain development.',
        how_to: ['Steam or bake cod fillet until it flakes easily', 'Remove ANY bones carefully with fingers', 'Mash or flake into small bites', 'Mix with veggies if dry'],
        portion_hint: '1-2 tablespoons flaked',
        media: [{ type: 'image', url: '/images/foods/cod.webp', alt: 'cod fish for babies', caption: 'Cooked cod fillet' }],
        status: 'published'
    },
    {
        slug: 'buckwheat',
        name: 'Buckwheat',
        locale: "Global",
        age_range: ['6+ months'],
        feeding_methods: ['spoon-feeding'],
        serving_forms: ['porridge', 'pancakes'],
        risk_level: 'low',
        nutrients_focus: ['Fiber', 'Magnesium', 'Protein'],
        do_list: ['Cook thoroughly until soft', 'Serve as a warm cereal', 'Mix with fruit puree'],
        dont_list: ['Ensure texture isn\'t too sticky/clumpy'],
        why: 'Despite its name, buckwheat is a gluten-free seed rich in fiber and minerals.',
        how_to: ['Cook buckwheat groats or flour with water/milk', 'Simmer until soft and porridge-like', 'Stir in fruit for flavor'],
        portion_hint: '2-3 tablespoons cooked',
        media: [{ type: 'image', url: '/images/foods/buckwheat.webp', alt: 'buckwheat for babies', caption: 'Buckwheat porridge' }],
        status: 'published'
    },
    {
        slug: 'artichoke',
        name: 'Artichoke',
        locale: "Global",
        age_range: ['6+ months'],
        feeding_methods: ['baby-led weaning', 'puree'],
        serving_forms: ['hearts mashed', 'leaves (scraping)'],
        risk_level: 'medium',
        nutrients_focus: ['Antioxidants', 'Fiber', 'Folate'],
        do_list: ['Use soft artichoke hearts', 'Steam until very tender', 'Chop hearts finely'],
        dont_list: ['Avoid tough outer leaves', 'Don\'t give whole leaves (choking risk)'],
        why: 'Artichokes are one of the highest antioxidant vegetables and provide great fiber.',
        how_to: ['Steam artichoke until leaves pull away easily', 'Remove fuzzy choke', 'Mash the soft heart or puree', 'Mix with olive oil'],
        portion_hint: '1 artichoke heart',
        media: [{ type: 'image', url: '/images/foods/artichoke.webp', alt: 'artichoke for babies', caption: 'Steamed artichoke' }],
        status: 'published'
    },
    {
        slug: 'swiss-chard',
        name: 'Swiss Chard',
        locale: "Global",
        age_range: ['6+ months'],
        feeding_methods: ['puree'],
        serving_forms: ['cooked & chopped', 'pureed'],
        risk_level: 'low',
        nutrients_focus: ['Vitamin K', 'Magnesium', 'Iron'],
        do_list: ['Remove tough stems', 'Cook until soft', 'Finely chop or puree'],
        dont_list: ['Do not serve raw leaves (hard to chew)'],
        why: 'A nutrient-dense leafy green that provides iron and vitamins for growth.',
        how_to: ['Wash leaves and remove center rib', 'Steam or sauté until wilted and soft', 'Blitz into a puree or chop very finely'],
        portion_hint: '1-2 tablespoons cooked',
        media: [{ type: 'image', url: '/images/foods/swiss-chard.webp', alt: 'swiss chard for babies', caption: 'Fresh Swiss chard' }],
        status: 'published'
    },
    {
        slug: 'honeydew',
        name: 'Honeydew Melon',
        locale: "Global",
        age_range: ['6+ months'],
        feeding_methods: ['baby-led weaning', 'puree'],
        serving_forms: ['thin slices', 'mashed'],
        risk_level: 'medium',
        nutrients_focus: ['Vitamin C', 'Potassium', 'Hydration'],
        do_list: ['Choose very ripe melon', 'Remove seeds and rind', 'Cut into thin rectangular slices'],
        dont_list: ['Avoid hard, unripe melon', 'Do not serve melon balls (choking shape)'],
        why: 'Refreshing and hydrating, honeydew is a sweet treat rich in Vitamin C.',
        how_to: ['Remove seeds and rind', 'Slice into thin, wide strips for holding', 'Or mash ripe flesh with a fork'],
        portion_hint: '1-2 slices',
        media: [{ type: 'image', url: '/images/foods/honeydew.webp', alt: 'honeydew for babies', caption: 'Honeydew melon' }],
        status: 'published'
    },
    {
        slug: 'prunes',
        name: 'Prunes (Dried Plums)',
        locale: "Global",
        age_range: ['6+ months'],
        feeding_methods: ['puree'],
        serving_forms: ['stewed puree', 'mashed'],
        risk_level: 'medium',
        nutrients_focus: ['Fiber', 'Sorbitol', 'Vitamin K'],
        do_list: ['Stew in water to soften', 'Puree until smooth', 'Use for constipation relief'],
        dont_list: ['Do not serve whole dried prunes (choking hazard)'],
        why: 'Famous for keeping digestion regular thanks to fiber and sorbitol.',
        how_to: ['Simmer dried prunes in water for 10-15 mins', 'Blend with the cooking water', 'Serve small amount mixed with cereal'],
        portion_hint: '1-2 teaspoons puree',
        media: [{ type: 'image', url: '/images/foods/prunes.webp', alt: 'prunes for babies', caption: 'Stewed prunes' }],
        status: 'published'
    },
    {
        slug: 'dates',
        name: 'Dates',
        locale: "Global",
        age_range: ['6+ months'],
        feeding_methods: ['baking', 'puree'],
        serving_forms: ['paste', 'syrup'],
        risk_level: 'high',
        nutrients_focus: ['Energy', 'Fiber', 'Potassium'],
        do_list: ['Remove pits!', 'Soak in hot water to soften', 'Blend into paste to sweeten other foods'],
        dont_list: ['NEVER serve whole or chopped dates (sticky choking hazard)'],
        why: 'A natural sweetener packed with energy, but very sticky so texture must be modified.',
        how_to: ['Remove pits', 'Soak in hot water for 30 mins', 'Blend into a smooth paste', 'Mix into yogurt or oatmeal'],
        portion_hint: '1 teaspoon paste',
        media: [{ type: 'image', url: '/images/foods/dates.webp', alt: 'dates for babies', caption: 'Dried dates' }],
        status: 'published'
    },
    {
        slug: 'turnip',
        name: 'Turnip',
        locale: "Global",
        age_range: ['6+ months'],
        feeding_methods: ['puree', 'baby-led weaning'],
        serving_forms: ['mashed', 'roasted sticks'],
        risk_level: 'low',
        nutrients_focus: ['Vitamin C', 'Fiber'],
        do_list: ['Peel and cook until soft', 'Mash with butter/oil', 'Serve warm'],
        dont_list: ['Do not serve raw'],
        why: 'A mild root vegetable that diversifies vegetable intake beyond carrots and potatoes.',
        how_to: ['Peel and chop turnip', 'Boil or steam/roast until tender', 'Mash well or puree', 'Season lightly with herbs'],
        portion_hint: '2-3 tablespoons',
        media: [{ type: 'image', url: '/images/foods/turnip.webp', alt: 'turnip for babies', caption: 'Fresh turnip' }],
        status: 'published'
    },
    {
        slug: 'parsnip',
        name: 'Parsnip',
        locale: "Global",
        age_range: ['6+ months'],
        feeding_methods: ['puree', 'baby-led weaning'],
        serving_forms: ['roasted sticks', 'mashed'],
        risk_level: 'low',
        nutrients_focus: ['Folate', 'Fiber', 'Vitamin C'],
        do_list: ['Peel and roast', 'Remove woody core if large', 'Cut into finger strips'],
        dont_list: ['Avoid undercooked/hard pieces'],
        why: 'Naturally sweet roast vegetable that provides folate and fiber.',
        how_to: ['Peel and cut into sticks (remove core)', 'Roast with oil until soft/browned', 'Or boil and mash like potatoes'],
        portion_hint: '2-3 sticks or mashed',
        media: [{ type: 'image', url: '/images/foods/parsnip.webp', alt: 'parsnip for babies', caption: 'Fresh parsnip' }],
        status: 'published'
    }
];

async function addFoodsToDatabase() {
    console.log('🥕 Adding 10 new Batch 6 foods to database...\n');

    let successCount = 0;
    let errorCount = 0;

    for (const food of newFoods) {
        try {
            // Check existence first to avoid error spam
            const { data: existing } = await supabase
                .from('kb_foods')
                .select('id')
                .eq('slug', food.slug)
                .single();

            if (existing) {
                console.log(`⚠️  ${food.name} already exists, skipping...`);
                continue;
            }

            const { data, error } = await supabase
                .from('kb_foods')
                .insert([food])
                .select();

            if (error) {
                if (error.code === '23505') {
                    console.log(`⚠️  ${food.name} already exists, skipping...`);
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
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📝 Total attempted: ${newFoods.length}`);
    console.log('\n✨ Done!');

    process.exit(errorCount > 0 ? 1 : 0);
}

addFoodsToDatabase().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
