---
description: Add a new batch of foods to the database with generated images
---

# Add Food Batch Workflow

This workflow guides you through the end-to-end process of adding new baby foods to the database, including image generation, asset management, and database insertion.

## 1. Identify Target Foods
- **Action**: Decide on the list of foods to add (e.g., "Batch 4: Tropical Fruits").
- **Reference**: Check `scripts/baby-foods-list.js` or `docs/food-images-session-summary.md` for priority lists.
- **Output**: A list of food names and slugs (e.g., `Mango` -> `mango`).

## 2. Generate Food Images
- **Action**: Use the `generate_image` tool for each food.
- **Prompt Template**: 
  > "Professional food photography of [FOOD DESCRIPTION] for babies, top-down view on a clean white background. [SPECIFIC DETAILS like 'cut into strips' or 'mashed']. Soft, natural lighting. Clean, appetizing presentation [on a simple white plate/in a small white bowl]. Photorealistic, high quality, professional food styling."
- **Note**: Be mindful of quota limits (usually ~30-50 images per session).

## 3. Process Images
- **Action**: Move generated images from the "brain" storage to the project via terminal.
- **Command Pattern**:
  ```bash
  # Example copy and rename
  cp ~/.gemini/antigravity/brain/[UUID]/[generated_name].png public/images/foods/[slug].png
  ```
- **Constraint**: Ensure filenames match the `slug` (e.g., `butternut-squash.png`).

## 4. Prepare Food Data
- **Action**: Create or update a script (like `scripts/add-batch-X-foods.js`) with the food details.
- **Data Structure**:
  ```javascript
  {
    slug: 'slug-name',
    name: 'Food Name',
    locale: 'Global', // Important!
    age_range: ['6+ months'],
    risk_level: 'low' | 'medium' | 'high',
    nutrients_focus: ['Vitamin A', 'Iron'],
    feeding_methods: ['puree', 'baby-led weaning'],
    media: [{ type: 'image', url: '/images/foods/slug-name.png' }],
    // ... do_list, dont_list, why, how_to
  }
  ```
- **Context**: Use the `scripts/add-new-foods.js` or `scripts/add-batch-2-4-foods.js` as a template.

## 5. Insert into Database
- **Action**: Run the node script to insert data.
- **Command**: `node scripts/add-batch-X-foods.js`
- **Verification**: Ensure the output confirms "Successfully added: X".

## 6. Verify in Browser
- **Action**: Start the dev server if not running (`npm run dev`).
- **URL**: Visit `http://localhost:3001/foods`.
- **Check**:
  - Image loads correctly?
  - Data (nutrients, age) is correct?
  - Page layout consistency?

## 7. Optimization (Optional but Recommended)
- **Action**: Convert PNGs to WebP for performance.
- **Tool**: Can be done via script or manually if requested.
