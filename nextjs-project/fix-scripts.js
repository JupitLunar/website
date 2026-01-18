const fs = require('fs');
const path = require('path');

const scriptsDir = path.join(__dirname, 'scripts');
const subdirs = ['tests', 'scrapers', 'db', 'content', 'maintenance', 'ops'];

const replacement = `const path = require('path');
const dotenv = require('dotenv');
// Load env vars from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });`;

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Regex to match various dotenv include patterns
    // Pattern 1: require('dotenv').config({ path: ... })
    // Pattern 2: require('dotenv').config()
    // Pattern 3: require('dotenv').config({path: ...})

    const regex = /(?:const\s+.*?require\(['"]path['"]\);\s*)?require\(['"]dotenv['"]\)\.config\s*\(\{[\s\S]*?\}\);?|require\(['"]dotenv['"]\)\.config\s*\(\);?/g;

    if (regex.test(content)) {
        console.log(`Fixing: ${filePath}`);
        const newContent = content.replace(regex, replacement);
        fs.writeFileSync(filePath, newContent, 'utf8');
    } else {
        // Check if it needs it but doesn't have it (optional, but good for safety)
        if (content.includes('process.env')) {
            // console.warn(`Warning: ${filePath} uses process.env but has no dotenv config match.`);
        }
    }
}

subdirs.forEach(subdir => {
    const dirPath = path.join(scriptsDir, subdir);
    if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        files.forEach(file => {
            if (file.endsWith('.js')) {
                processFile(path.join(dirPath, file));
            }
        });
    }
});
