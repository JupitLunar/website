const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/images/foods');

async function optimizeImages() {
    console.log('🖼️  Optimizing food images to WebP...');

    try {
        const files = fs.readdirSync(imagesDir);
        const pngFiles = files.filter(file => file.endsWith('.png'));

        if (pngFiles.length === 0) {
            console.log('No PNG files found to optimize.');
            return;
        }

        console.log(`Found ${pngFiles.length} PNG images.`);

        let processed = 0;

        for (const file of pngFiles) {
            const inputPath = path.join(imagesDir, file);
            const outputPath = path.join(imagesDir, file.replace('.png', '.webp'));

            try {
                await sharp(inputPath)
                    .webp({ quality: 80 }) // Good balance of quality and size
                    .toFile(outputPath);

                // Delete original PNG
                fs.unlinkSync(inputPath);

                processed++;
                process.stdout.write(`\r✅ Converted ${processed}/${pngFiles.length}: ${file} -> .webp`);
            } catch (err) {
                console.error(`\n❌ Error converting ${file}:`, err.message);
            }
        }

        console.log('\n\n✨ Optimization complete!');

    } catch (err) {
        console.error('Fatal error:', err);
    }
}

optimizeImages();
