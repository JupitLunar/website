// Common baby foods to add to the database
// Organized by food category and introduction timeline

const babyFoods = {
    // Vegetables (6+ months)
    vegetables: [
        'sweet-potato',
        'butternut-squash',
        'peas',
        'green-beans',
        'broccoli',
        'cauliflower',
        'zucchini',
        'spinach',
        'kale',
        'bell-pepper',
        'cucumber',
        'tomato',
        'avocado',
        'beets',
    ],

    // Fruits (6+ months)
    fruits: [
        'banana',
        'apple',
        'pear',
        'peach',
        'plum',
        'mango',
        'papaya',
        'blueberry',
        'strawberry',
        'raspberry',
        'blackberry',
        'watermelon',
        'cantaloupe',
        'kiwi',
        'orange',
    ],

    // Proteins (6+ months)
    proteins: [
        'chicken',
        'turkey',
        'pork',
        'lamb',
        'tofu',
        'tempeh',
        'black-beans',
        'chickpeas',
        'kidney-beans',
        'edamame',
    ],

    // Grains (6+ months)
    grains: [
        'oatmeal',
        'rice',
        'quinoa',
        'barley',
        'pasta',
        'bread',
        'crackers',
        'cereal',
    ],

    // Dairy (12+ months for cow's milk)
    dairy: [
        'cheese',
        'cottage-cheese',
        'cream-cheese',
        'milk', // 12+ months
    ],

    // Allergens (introduce early, 4-6 months)
    allergens: [
        'wheat',
        'soy',
        'tree-nuts', // almond, cashew, walnut
        'sesame',
        'fish', // cod, tilapia
    ],
};

// Priority foods for next image generation batch
const priorityFoods = [
    'banana',
    'avocado',
    'sweet-potato',
    'chicken',
    'broccoli',
    'apple',
    'blueberry',
    'cheese',
    'oatmeal',
    'pasta',
    'strawberry',
    'peas',
    'rice',
    'bread',
    'mango',
];

console.log('Priority foods for image generation:', priorityFoods);
console.log('Total priority foods:', priorityFoods.length);

module.exports = { babyFoods, priorityFoods };
