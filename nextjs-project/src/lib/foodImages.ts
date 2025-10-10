/**
 * Food Image Utility
 * Provides emoji-based placeholder images for foods
 */

// Food emoji mapping
const foodEmojiMap: Record<string, string> = {
  // Fruits
  apple: '🍎',
  banana: '🍌',
  orange: '🍊',
  strawberry: '🍓',
  blueberry: '🫐',
  grape: '🍇',
  watermelon: '🍉',
  peach: '🍑',
  pear: '🍐',
  cherry: '🍒',
  kiwi: '🥝',
  mango: '🥭',
  pineapple: '🍍',
  avocado: '🥑',
  lemon: '🍋',
  melon: '🍈',

  // Vegetables
  carrot: '🥕',
  broccoli: '🥦',
  tomato: '🍅',
  cucumber: '🥒',
  corn: '🌽',
  potato: '🥔',
  'sweet potato': '🍠',
  pepper: '🫑',
  eggplant: '🍆',
  spinach: '🥬',
  lettuce: '🥬',
  pumpkin: '🎃',
  mushroom: '🍄',

  // Protein
  egg: '🥚',
  chicken: '🍗',
  meat: '🍖',
  fish: '🐟',
  salmon: '🐟',
  shrimp: '🦐',
  turkey: '🦃',
  beef: '🥩',

  // Dairy
  milk: '🥛',
  cheese: '🧀',
  yogurt: '🥛',
  butter: '🧈',

  // Grains
  rice: '🍚',
  bread: '🍞',
  pasta: '🍝',
  oatmeal: '🥣',
  cereal: '🥣',
  quinoa: '🌾',

  // Nuts & Seeds
  peanut: '🥜',
  almond: '🌰',
  'peanut butter': '🥜',

  // Prepared Foods
  soup: '🍲',
  stew: '🍲',
  pancake: '🥞',
  waffle: '🧇',
  toast: '🍞',
  sandwich: '🥪',

  // Legumes
  beans: '🫘',
  lentil: '🫘',
  pea: '🫛',

  // Other
  honey: '🍯',
  oil: '🫒',
  water: '💧',
};

// Gradient backgrounds for different food categories
const categoryGradients: Record<string, string> = {
  fruit: 'from-pink-100 via-rose-100 to-red-100',
  vegetable: 'from-green-100 via-emerald-100 to-teal-100',
  protein: 'from-orange-100 via-amber-100 to-yellow-100',
  dairy: 'from-blue-100 via-sky-100 to-cyan-100',
  grain: 'from-amber-100 via-yellow-100 to-orange-100',
  default: 'from-purple-100 via-violet-100 to-indigo-100',
};

/**
 * Get emoji for a food item
 */
export function getFoodEmoji(foodName: string): string {
  const nameLower = foodName.toLowerCase();

  // Direct match
  if (foodEmojiMap[nameLower]) {
    return foodEmojiMap[nameLower];
  }

  // Partial match
  for (const [key, emoji] of Object.entries(foodEmojiMap)) {
    if (nameLower.includes(key) || key.includes(nameLower)) {
      return emoji;
    }
  }

  // Default emoji
  return '🍽️';
}

/**
 * Determine food category from name
 */
export function getFoodCategory(foodName: string): keyof typeof categoryGradients {
  const nameLower = foodName.toLowerCase();

  const fruits = ['apple', 'banana', 'berry', 'orange', 'grape', 'melon', 'peach', 'pear', 'cherry', 'kiwi', 'mango', 'pineapple', 'avocado', 'lemon', 'fruit'];
  const vegetables = ['carrot', 'broccoli', 'tomato', 'cucumber', 'corn', 'potato', 'pepper', 'eggplant', 'spinach', 'lettuce', 'pumpkin', 'mushroom', 'vegetable', 'veggie'];
  const proteins = ['egg', 'chicken', 'meat', 'fish', 'salmon', 'shrimp', 'turkey', 'beef', 'pork', 'protein'];
  const dairy = ['milk', 'cheese', 'yogurt', 'butter', 'dairy', 'cream'];
  const grains = ['rice', 'bread', 'pasta', 'oat', 'cereal', 'quinoa', 'wheat', 'grain', 'barley'];

  if (fruits.some(f => nameLower.includes(f))) return 'fruit';
  if (vegetables.some(v => nameLower.includes(v))) return 'vegetable';
  if (proteins.some(p => nameLower.includes(p))) return 'protein';
  if (dairy.some(d => nameLower.includes(d))) return 'dairy';
  if (grains.some(g => nameLower.includes(g))) return 'grain';

  return 'default';
}

/**
 * Get gradient class for a food category
 */
export function getFoodGradient(foodName: string): string {
  const category = getFoodCategory(foodName);
  return categoryGradients[category];
}

/**
 * Generate a placeholder image data URL with emoji
 */
export function generateFoodPlaceholder(foodName: string): string {
  const emoji = getFoodEmoji(foodName);
  const category = getFoodCategory(foodName);

  // Return a data structure that can be used for styling
  return JSON.stringify({
    emoji,
    category,
    gradient: categoryGradients[category]
  });
}

/**
 * Get display info for a food
 */
export function getFoodDisplayInfo(foodName: string) {
  return {
    emoji: getFoodEmoji(foodName),
    gradient: getFoodGradient(foodName),
    category: getFoodCategory(foodName)
  };
}
