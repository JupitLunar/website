const fs = require('fs');
const path = require('path');

const scriptsDir = path.join(__dirname, 'scripts');
const subdirs = ['tests', 'scrapers', 'db', 'content', 'maintenance', 'ops'];

function cleanFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // 1. Remove duplicate "const path = require('path');"
    // Keep the first one, remove others.
    const pathRegex = /const path = require\(['"]path['"]\);\s*/g;
    const match = content.match(pathRegex);
    if (match && match.length > 1) {
        let count = 0;
        content = content.replace(pathRegex, (match) => {
            count++;
            return count === 1 ? match : '';
        });
        changed = true;
        console.log(`Removed duplicate 'path' require in: ${filePath}`);
    }

    // 2. Fix relative paths to src/ (e.g. "../src/" -> "../../src/")
    // Matches: path.join(__dirname, '../src/...') or '../src/...' in general strings if used with path
    // Be careful not to double replace if I run this twice.
    // Strategy: Replace '../src/' with '../../src/' BUT only if it looks like a file path relative to __dirname in a script context.
    // Many scripts use `path.join(__dirname, '../src/...')`.

    if (content.includes("'../src/")) {
        content = content.replace(/'\.\.\/src\//g, "'../../src/");
        changed = true;
        console.log(`Updated relative source paths in: ${filePath}`);
    }
    if (content.includes('"../src/')) {
        content = content.replace(/"\.\.\/src\//g, '"../../src/');
        changed = true;
        console.log(`Updated relative source paths (double quotes) in: ${filePath}`);
    }

    // Also check for ../public
    if (content.includes("'../public/")) {
        content = content.replace(/'\.\.\/public\//g, "'../../public/");
        changed = true;
        console.log(`Updated relative public paths in: ${filePath}`);
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
}

subdirs.forEach(subdir => {
    const dirPath = path.join(scriptsDir, subdir);
    if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        files.forEach(file => {
            if (file.endsWith('.js')) {
                cleanFile(path.join(dirPath, file));
            }
        });
    }
});
