const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// New foods to add with their basic information
const newFoods = [
    {
        slug: 'apple',
        name: 'Apple',
        locale: "Global",
        age_range: ['6+ months'],
        feeding_methods: ['puree', 'baby-led weaning'],
        serving_forms: ['steamed slices', 'applesauce', 'grated'],
        risk_level: 'low',
        nutrients_focus: ['Fiber', 'Vitamin C', 'Antioxidants'],
        do_list: ['Steam until soft for babies under 12 months', 'Remove skin and seeds', 'Cut into thin slices or small pieces'],
        dont_list: ['Do not serve raw hard apple to babies under 12 months', 'Avoid whole apples due to choking risk'],
        why: 'Apples are rich in fiber and vitamin C, supporting digestive health and immune function. They are a versatile first food.',
        how_to: ['Wash and peel the apple', 'Steam until very soft (about 10-15 minutes)', 'Cut into thin slices or mash for younger babies', 'For older babies, offer as finger food'],
        portion_hint: '1-2 tablespoons for beginners, up to 1/4 apple for older babies',
        media: [{ type: 'image', url: '/images/foods/apple.png', alt: 'apple for babies', caption: 'Professional food photography of apple' }],
        status: 'published'
    },
    {
        slug: 'avocado',
        name: 'Avocado',
        locale: "Global",
        age_range: ['6+ months'],
        feeding_methods: ['puree', 'baby-led weaning'],
        serving_forms: ['mashed', 'wedges with skin', 'slices'],
        risk_level: 'low',
        nutrients_focus: ['Healthy Fats', 'Folate', 'Potassium', 'Vitamin E'],
        do_list: ['Choose ripe, soft avocados', 'Leave skin on wedges for easier gripping', 'Serve at room temperature'],
        dont_list: ['Avoid unripe, hard avocados', 'Do not add salt or seasonings for young babies'],
        why: 'Avocados are packed with healthy fats essential for brain development, plus they are naturally soft and easy to digest.',
        how_to: ['Cut avocado in half and remove pit', 'Scoop out flesh or cut into wedges with skin on', 'For puree, mash with a fork', 'Serve immediately to prevent browning'],
        portion_hint: '1-2 tablespoons mashed or 1-2 wedges',
        media: [{ type: 'image', url: '/images/foods/avocado.png', alt: 'avocado for babies', caption: 'Professional food photography of avocado' }],
        status: 'published'
    },
    {
        slug: 'banana',
        name: 'Banana',
        locale: "Global",
        age_range: ['6+ months'],
        feeding_methods: ['puree', 'baby-led weaning'],
        serving_forms: ['mashed', 'sliced rounds', 'whole with peel strip'],
        risk_level: 'low',
        nutrients_focus: ['Potassium', 'Vitamin B6', 'Vitamin C', 'Fiber'],
        do_list: ['Choose ripe bananas with brown spots', 'Leave a strip of peel for grip', 'Serve at room temperature'],
        dont_list: ['Avoid unripe green bananas', 'Do not refrigerate before serving'],
        why: 'Bananas are naturally sweet, easy to digest, and rich in potassium for healthy muscle and nerve function.',
        how_to: ['Peel banana', 'For younger babies, mash with a fork', 'For baby-led weaning, cut in half and leave peel strip on one end', 'Or slice into rounds'],
        portion_hint: '1-2 tablespoons mashed or 1/4 to 1/2 banana',
        media: [{ type: 'image', url: '/images/foods/banana.png', alt: 'banana for babies', caption: 'Professional food photography of banana' }],
        status: 'published'
    },
    {
        slug: 'blueberry',
        name: 'Blueberry',
        locale: "Global",
        age_range: ['6+ months'],
        feeding_methods: ['puree', 'baby-led weaning'],
        serving_forms: ['quartered', 'mashed', 'whole (12+ months)'],
        risk_level: 'medium',
        nutrients_focus: ['Antioxidants', 'Vitamin C', 'Vitamin K', 'Fiber'],
        do_list: ['Quarter blueberries for babies under 12 months', 'Wash thoroughly', 'Serve fresh or lightly cooked'],
        dont_list: ['Do not serve whole to babies under 12 months', 'Avoid dried blueberries due to choking risk'],
        why: 'Blueberries are packed with antioxidants that support brain development and immune health.',
        how_to: ['Wash blueberries thoroughly', 'Quarter each berry lengthwise', 'For younger babies, mash or puree', 'Serve at room temperature'],
        portion_hint: '5-10 quartered berries',
        media: [{ type: 'image', url: '/images/foods/blueberry.png', alt: 'blueberry for babies', caption: 'Professional food photography of blueberry' }],
        status: 'published'
    },
    {
        slug: 'bread',
        name: 'Bread',
        locale: "Global",
        age_range: ['6+ months'],
        feeding_methods: ['baby-led weaning'],
        serving_forms: ['strips', 'toast fingers', 'small pieces'],
        risk_level: 'medium',
        nutrients_focus: ['Carbohydrates', 'Fiber', 'B Vitamins', 'Iron'],
        do_list: ['Choose whole grain bread', 'Lightly toast for easier handling', 'Cut into finger-sized strips'],
        dont_list: ['Avoid bread with honey for babies under 12 months', 'Avoid bread with added sugar or salt', 'Do not serve thick, doughy bread'],
        why: 'Whole grain bread provides energy, fiber, and essential B vitamins for growth and development.',
        how_to: ['Choose soft whole wheat bread', 'Lightly toast if desired', 'Cut into strips about 2-3 inches long', 'Remove crusts for younger babies'],
        portion_hint: '1-2 strips or 1/4 slice',
        media: [{ type: 'image', url: '/images/foods/bread.png', alt: 'bread for babies', caption: 'Professional food photography of bread' }],
        status: 'published'
    },
    {
        slug: 'broccoli',
        name: 'Broccoli',
        locale: "Global",
        age_range: ['6+ months'],
        feeding_methods: ['puree', 'baby-led weaning'],
        serving_forms: ['steamed florets', 'mashed', 'pureed'],
        risk_level: 'low',
        nutrients_focus: ['Vitamin C', 'Vitamin K', 'Folate', 'Fiber'],
        do_list: ['Steam until very soft', 'Leave long stems for babies to grip', 'Serve warm or room temperature'],
        dont_list: ['Do not serve raw', 'Avoid overcooking which destroys nutrients'],
        why: 'Broccoli is a nutrient powerhouse, rich in vitamins C and K, supporting immune health and bone development.',
        how_to: ['Wash broccoli thoroughly', 'Cut into florets with long stems', 'Steam for 8-10 minutes until very soft', 'Test softness by pressing with a fork'],
        portion_hint: '1-2 small florets',
        media: [{ type: 'image', url: '/images/foods/broccoli.png', alt: 'broccoli for babies', caption: 'Professional food photography of broccoli' }],
        status: 'published'
    },
    {
        slug: 'cauliflower',
        name: 'Cauliflower',
        locale: "Global",
        age_range: ['6+ months'],
        feeding_methods: ['puree', 'baby-led weaning'],
        serving_forms: ['steamed florets', 'mashed', 'pureed'],
        risk_level: 'low',
        nutrients_focus: ['Vitamin C', 'Vitamin K', 'Folate', 'Fiber'],
        do_list: ['Steam until very soft', 'Leave stems for gripping', 'Serve plain without seasonings'],
        dont_list: ['Do not serve raw', 'Avoid adding butter or cream for young babies'],
        why: 'Cauliflower is mild in flavor and rich in vitamins, making it an excellent vegetable for early introduction.',
        how_to: ['Wash and cut into florets with stems', 'Steam for 10-12 minutes until very soft', 'For puree, blend with breast milk or formula', 'Serve warm'],
        portion_hint: '1-2 small florets or 2-3 tablespoons pureed',
        media: [{ type: 'image', url: '/images/foods/cauliflower.png', alt: 'cauliflower for babies', caption: 'Professional food photography of cauliflower' }],
        status: 'published'
    },
    {
        slug: 'cheese',
        name: 'Cheese',
        locale: "Global",
        age_range: ['6+ months'],
        feeding_methods: ['baby-led weaning'],
        serving_forms: ['small cubes', 'shredded', 'thin slices'],
        risk_level: 'low',
        nutrients_focus: ['Calcium', 'Protein', 'Vitamin B12', 'Phosphorus'],
        do_list: ['Choose mild, pasteurized cheese', 'Cut into small cubes', 'Offer full-fat varieties'],
        dont_list: ['Avoid unpasteurized cheese', 'Do not serve hard, aged cheese to young babies', 'Avoid processed cheese with additives'],
        why: 'Cheese provides calcium and protein essential for bone development and growth.',
        how_to: ['Choose mild cheddar or mozzarella', 'Cut into small cubes (pea-sized)', 'For younger babies, shred finely', 'Serve at room temperature'],
        portion_hint: '1-2 tablespoons shredded or 3-4 small cubes',
        media: [{ type: 'image', url: '/images/foods/cheese.png', alt: 'cheese for babies', caption: 'Professional food photography of cheese' }],
        status: 'published'
    },
    {
        slug: 'chicken',
        name: 'Chicken',
        locale: "Global",
        age_range: ['6+ months'],
        feeding_methods: ['puree', 'baby-led weaning'],
        serving_forms: ['shredded', 'ground', 'strips'],
        risk_level: 'medium',
        nutrients_focus: ['Protein', 'Iron', 'Zinc', 'B Vitamins'],
        do_list: ['Cook thoroughly until internal temp reaches 165°F', 'Shred or cut into strips', 'Keep moist with broth or sauce'],
        dont_list: ['Never serve undercooked chicken', 'Avoid dry, tough pieces', 'Do not add salt or seasonings for young babies'],
        why: 'Chicken is an excellent source of protein and iron, essential for growth and development.',
        how_to: ['Cook chicken breast thoroughly', 'Shred finely for younger babies', 'Cut into strips for baby-led weaning', 'Mix with vegetables or broth to keep moist'],
        portion_hint: '1-2 tablespoons shredded or 1-2 strips',
        media: [{ type: 'image', url: '/images/foods/chicken.png', alt: 'chicken for babies', caption: 'Professional food photography of chicken' }],
        status: 'published'
    },
    {
        slug: 'green-beans',
        name: 'Green Beans',
        locale: "Global",
        age_range: ['6+ months'],
        feeding_methods: ['puree', 'baby-led weaning'],
        serving_forms: ['steamed whole', 'cut pieces', 'mashed'],
        risk_level: 'low',
        nutrients_focus: ['Vitamin C', 'Vitamin K', 'Folate', 'Fiber'],
        do_list: ['Steam until very soft', 'Leave whole for easier gripping', 'Remove strings if present'],
        dont_list: ['Do not serve raw or crunchy', 'Avoid canned beans with added sodium'],
        why: 'Green beans are rich in vitamins and fiber, supporting digestive health and immune function.',
        how_to: ['Wash and trim ends', 'Steam for 8-10 minutes until very soft', 'Serve whole or cut into pieces', 'For puree, blend with water'],
        portion_hint: '3-5 whole beans or 2-3 tablespoons pureed',
        media: [{ type: 'image', url: '/images/foods/green-beans.png', alt: 'green-beans for babies', caption: 'Professional food photography of green-beans' }],
        status: 'published'
    },
    {
        slug: 'mango',
        name: 'Mango',
        locale: "Global",
        age_range: ['6+ months'],
        feeding_methods: ['puree', 'baby-led weaning'],
        serving_forms: ['strips', 'cubes', 'mashed'],
        risk_level: 'low',
        nutrients_focus: ['Vitamin A', 'Vitamin C', 'Folate', 'Fiber'],
        do_list: ['Choose ripe, soft mangoes', 'Cut into strips with hedgehog pattern', 'Serve at room temperature'],
        dont_list: ['Avoid unripe, hard mangoes', 'Do not serve with skin'],
        why: 'Mangoes are rich in vitamins A and C, supporting vision, immune health, and skin development.',
        how_to: ['Peel mango', 'Cut flesh away from pit', 'Slice into strips or use hedgehog cut', 'For younger babies, mash or puree'],
        portion_hint: '2-3 tablespoons mashed or 2-3 strips',
        media: [{ type: 'image', url: '/images/foods/mango.png', alt: 'mango for babies', caption: 'Professional food photography of mango' }],
        status: 'published'
    },
    {
        slug: 'oatmeal',
        name: 'Oatmeal',
        locale: "Global",
        age_range: ['6+ months'],
        feeding_methods: ['spoon-feeding'],
        serving_forms: ['cooked cereal', 'porridge'],
        risk_level: 'low',
        nutrients_focus: ['Fiber', 'Iron', 'B Vitamins', 'Protein'],
        do_list: ['Use plain rolled oats or baby oatmeal', 'Cook with breast milk, formula, or water', 'Serve warm'],
        dont_list: ['Avoid instant oatmeal with added sugar', 'Do not add honey for babies under 12 months', 'Avoid flavored varieties'],
        why: 'Oatmeal is rich in fiber and iron, supporting digestive health and preventing anemia.',
        how_to: ['Cook oats according to package directions', 'Use breast milk or formula for creamier texture', 'Cool to safe temperature', 'Thin with liquid if too thick'],
        portion_hint: '2-4 tablespoons',
        media: [{ type: 'image', url: '/images/foods/oatmeal.png', alt: 'oatmeal for babies', caption: 'Professional food photography of oatmeal' }],
        status: 'published'
    },
    {
        slug: 'pasta',
        name: 'Pasta',
        locale: "Global",
        age_range: ['6+ months'],
        feeding_methods: ['baby-led weaning'],
        serving_forms: ['spirals', 'tubes', 'small shapes'],
        risk_level: 'low',
        nutrients_focus: ['Carbohydrates', 'B Vitamins', 'Iron', 'Protein'],
        do_list: ['Choose whole grain pasta', 'Cook until very soft', 'Use baby-friendly shapes'],
        dont_list: ['Avoid long noodles for young babies', 'Do not add salt to cooking water', 'Avoid pasta with sauces containing honey'],
        why: 'Pasta provides energy and B vitamins, and its various shapes help develop fine motor skills.',
        how_to: ['Cook pasta until very soft', 'Choose shapes like spirals or tubes', 'Drain and cool', 'Serve plain or with mild sauce'],
        portion_hint: '1/4 to 1/2 cup cooked',
        media: [{ type: 'image', url: '/images/foods/pasta.png', alt: 'pasta for babies', caption: 'Professional food photography of pasta' }],
        status: 'published'
    },
    {
        slug: 'peach',
        name: 'Peach',
        locale: "Global",
        age_range: ['6+ months'],
        feeding_methods: ['puree', 'baby-led weaning'],
        serving_forms: ['steamed slices', 'mashed', 'fresh wedges (ripe)'],
        risk_level: 'low',
        nutrients_focus: ['Vitamin A', 'Vitamin C', 'Potassium', 'Fiber'],
        do_list: ['Choose ripe, soft peaches', 'Remove skin and pit', 'Steam if not very ripe'],
        dont_list: ['Avoid unripe, hard peaches', 'Do not serve with skin for young babies'],
        why: 'Peaches are rich in vitamins A and C, supporting vision, immune health, and skin development.',
        how_to: ['Wash and peel peach', 'Remove pit', 'Slice into wedges', 'Steam if not very soft', 'For puree, mash or blend'],
        portion_hint: '2-3 tablespoons mashed or 2-3 slices',
        media: [{ type: 'image', url: '/images/foods/peach.png', alt: 'peach for babies', caption: 'Professional food photography of peach' }],
        status: 'published'
    },
    {
        slug: 'pear',
        name: 'Pear',
        locale: "Global",
        age_range: ['6+ months'],
        feeding_methods: ['puree', 'baby-led weaning'],
        serving_forms: ['steamed slices', 'mashed', 'pureed'],
        risk_level: 'low',
        nutrients_focus: ['Fiber', 'Vitamin C', 'Potassium', 'Antioxidants'],
        do_list: ['Steam until soft for babies under 12 months', 'Remove skin and seeds', 'Choose ripe pears'],
        dont_list: ['Do not serve raw hard pear to young babies', 'Avoid unripe pears'],
        why: 'Pears are gentle on the digestive system and rich in fiber, helping prevent constipation.',
        how_to: ['Wash and peel pear', 'Remove core and seeds', 'Steam for 10-15 minutes until soft', 'Slice or mash as needed'],
        portion_hint: '2-3 tablespoons mashed or 2-3 slices',
        media: [{ type: 'image', url: '/images/foods/pear.png', alt: 'pear for babies', caption: 'Professional food photography of pear' }],
        status: 'published'
    },
    {
        slug: 'peas',
        name: 'Peas',
        locale: "Global",
        age_range: ['6+ months'],
        feeding_methods: ['puree', 'baby-led weaning'],
        serving_forms: ['mashed', 'whole (8+ months)', 'pureed'],
        risk_level: 'medium',
        nutrients_focus: ['Protein', 'Fiber', 'Vitamin C', 'Vitamin K'],
        do_list: ['Cook until very soft', 'Mash slightly for younger babies', 'Use fresh or frozen peas'],
        dont_list: ['Do not serve whole to babies under 8 months', 'Avoid canned peas with added sodium'],
        why: 'Peas are a good source of plant-based protein and fiber, supporting growth and digestive health.',
        how_to: ['Cook peas until very soft', 'For younger babies, mash slightly', 'For older babies, serve whole', 'Cool to safe temperature'],
        portion_hint: '2-3 tablespoons',
        media: [{ type: 'image', url: '/images/foods/peas.png', alt: 'peas for babies', caption: 'Professional food photography of peas' }],
        status: 'published'
    },
    {
        slug: 'rice',
        name: 'Rice',
        locale: "Global",
        age_range: ['6+ months'],
        feeding_methods: ['spoon-feeding', 'baby-led weaning'],
        serving_forms: ['baby cereal', 'cooked grains', 'rice balls'],
        risk_level: 'low',
        nutrients_focus: ['Carbohydrates', 'Iron (fortified)', 'B Vitamins'],
        do_list: ['Use iron-fortified baby rice cereal', 'Cook rice until very soft', 'Vary grains to limit arsenic exposure'],
        dont_list: ['Do not rely solely on rice cereal', 'Avoid adding salt or sugar', 'Do not serve undercooked rice'],
        why: 'Rice is easy to digest and often fortified with iron, making it a good first food for babies.',
        how_to: ['Cook rice until very soft and sticky', 'Mix with breast milk or formula for creamier texture', 'For baby-led weaning, form into small balls', 'Serve warm'],
        portion_hint: '2-4 tablespoons',
        media: [{ type: 'image', url: '/images/foods/rice.png', alt: 'rice for babies', caption: 'Professional food photography of rice' }],
        status: 'published'
    },
    {
        slug: 'strawberry',
        name: 'Strawberry',
        locale: "Global",
        age_range: ['6+ months'],
        feeding_methods: ['puree', 'baby-led weaning'],
        serving_forms: ['quartered', 'mashed', 'sliced'],
        risk_level: 'medium',
        nutrients_focus: ['Vitamin C', 'Folate', 'Manganese', 'Antioxidants'],
        do_list: ['Wash thoroughly', 'Quarter for babies under 12 months', 'Remove stems'],
        dont_list: ['Do not serve whole to young babies', 'Avoid unwashed berries'],
        why: 'Strawberries are packed with vitamin C and antioxidants, supporting immune health and development.',
        how_to: ['Wash strawberries thoroughly', 'Remove stems', 'Quarter lengthwise', 'For younger babies, mash or puree', 'Serve fresh'],
        portion_hint: '3-5 quartered berries',
        media: [{ type: 'image', url: '/images/foods/strawberry.png', alt: 'strawberry for babies', caption: 'Professional food photography of strawberry' }],
        status: 'published'
    },
    {
        slug: 'sweet-potato',
        name: 'Sweet Potato',
        locale: "Global",
        age_range: ['6+ months'],
        feeding_methods: ['puree', 'baby-led weaning'],
        serving_forms: ['mashed', 'roasted wedges', 'pureed'],
        risk_level: 'low',
        nutrients_focus: ['Vitamin A', 'Vitamin C', 'Fiber', 'Potassium'],
        do_list: ['Roast or steam until very soft', 'Leave skin on wedges for grip', 'Serve warm'],
        dont_list: ['Do not serve raw', 'Avoid adding butter or sugar for young babies'],
        why: 'Sweet potatoes are rich in vitamin A for vision and immune health, and naturally sweet for baby appeal.',
        how_to: ['Wash sweet potato', 'Roast at 400°F for 45 minutes or steam until soft', 'For wedges, cut with skin on', 'For puree, scoop out flesh and mash'],
        portion_hint: '2-3 tablespoons mashed or 1-2 wedges',
        media: [{ type: 'image', url: '/images/foods/sweet-potato.png', alt: 'sweet-potato for babies', caption: 'Professional food photography of sweet-potato' }],
        status: 'published'
    },
    {
        slug: 'watermelon',
        name: 'Watermelon',
        locale: "Global",
        age_range: ['6+ months'],
        feeding_methods: ['baby-led weaning'],
        serving_forms: ['triangular wedges with rind', 'small cubes (12+ months)'],
        risk_level: 'medium',
        nutrients_focus: ['Vitamin C', 'Vitamin A', 'Lycopene', 'Hydration'],
        do_list: ['Remove all seeds', 'Leave rind on for grip', 'Cut into triangular wedges'],
        dont_list: ['Do not serve with seeds', 'Avoid small cubes for babies under 12 months'],
        why: 'Watermelon is hydrating and rich in vitamins, perfect for hot days and developing taste preferences.',
        how_to: ['Cut watermelon into triangular wedges', 'Remove all seeds', 'Leave rind on for easier gripping', 'Serve chilled or room temperature'],
        portion_hint: '1-2 wedges',
        media: [{ type: 'image', url: '/images/foods/watermelon.png', alt: 'watermelon for babies', caption: 'Professional food photography of watermelon' }],
        status: 'published'
    },
    {
        slug: 'zucchini',
        name: 'Zucchini',
        locale: "Global",
        age_range: ['6+ months'],
        feeding_methods: ['puree', 'baby-led weaning'],
        serving_forms: ['steamed sticks', 'mashed', 'pureed'],
        risk_level: 'low',
        nutrients_focus: ['Vitamin C', 'Vitamin A', 'Potassium', 'Fiber'],
        do_list: ['Steam until soft', 'Cut into finger-sized sticks', 'Leave skin on for nutrients'],
        dont_list: ['Do not serve raw', 'Avoid overcooking which makes it mushy'],
        why: 'Zucchini is mild in flavor and easy to digest, making it an excellent vegetable for early introduction.',
        how_to: ['Wash zucchini', 'Cut into finger-sized sticks', 'Steam for 5-7 minutes until soft', 'For puree, blend with water or broth'],
        portion_hint: '2-3 sticks or 2-3 tablespoons pureed',
        media: [{ type: 'image', url: '/images/foods/zucchini.png', alt: 'zucchini for babies', caption: 'Professional food photography of zucchini' }],
        status: 'published'
    }
];

async function addFoodsToDatabase() {
    console.log('🍎 Adding 21 new foods to database...\n');

    let successCount = 0;
    let errorCount = 0;

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
