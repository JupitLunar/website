const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const url = require('url');

const START_URL = process.argv[2] || 'http://localhost:3001';
const MAX_PAGES = 100; // Safety limit
const CONCURRENCY = 3;

// State
const visited = new Set();
const queue = [START_URL];
const brokenLinks = [];
const consoleErrors = [];
const pageLoadErrors = [];
const externalLinksToCheck = new Set();

async function checkExternalLink(link) {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(link, { method: 'HEAD', signal: controller.signal });
        clearTimeout(timeout);
        if (!res.ok && res.status !== 405 && res.status !== 403) { // 405/403 often mean bot protection, not broken
            return { url: link, status: res.status, error: res.statusText };
        }
    } catch (err) {
        if (err.name === 'AbortError') return { url: link, error: 'Timeout' };
        return { url: link, error: err.message };
    }
    return null;
}

async function processPage(browser, pageUrl) {
    if (visited.has(pageUrl)) return;
    visited.add(pageUrl);

    const page = await browser.newPage();

    // Capture console errors
    page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleErrors.push({ url: pageUrl, text: msg.text() });
            console.log(`  ❌ Console Error on ${pageUrl}: ${msg.text().substring(0, 100)}...`);
        }
    });

    // Capture page errors (crashes)
    page.on('pageerror', err => {
        pageLoadErrors.push({ url: pageUrl, error: err.message });
        console.log(`  🔥 Page Crash on ${pageUrl}: ${err.message}`);
    });

    try {
        const response = await page.goto(pageUrl, { waitUntil: 'networkidle' });
        const status = response.status();

        if (status >= 400) {
            console.log(`  🔴 ${status} on ${pageUrl}`);
            brokenLinks.push({ url: pageUrl, status, source: 'internal_crawl' });
            await page.close();
            return;
        }

        console.log(`  ✅ ${status} ${pageUrl}`);

        // Extract links
        const hrefs = await page.$$eval('a', as => as.map(a => a.href));

        for (const href of hrefs) {
            const parsed = url.parse(href);

            // Internal links
            if (href.startsWith(START_URL)) {
                // Normalize (remove hash, etc)
                const cleanLink = href.split('#')[0];
                if (!visited.has(cleanLink) && !queue.includes(cleanLink)) {
                    queue.push(cleanLink);
                }
            } else if (parsed.protocol && (parsed.protocol === 'http:' || parsed.protocol === 'https:')) {
                externalLinksToCheck.add(href);
            }
        }

    } catch (e) {
        console.log(`  ⚠️ Failed to load ${pageUrl}: ${e.message}`);
        pageLoadErrors.push({ url: pageUrl, error: e.message });
    } finally {
        await page.close();
    }
}

async function run() {
    console.log(`🚀 Starting Audit Scout on ${START_URL}`);
    console.log(`   Max pages: ${MAX_PAGES}`);

    const browser = await chromium.launch();

    // BFS Crawl
    while (queue.length > 0 && visited.size < MAX_PAGES) {
        const batch = queue.splice(0, CONCURRENCY);
        await Promise.all(batch.map(u => processPage(browser, u)));
    }

    console.log(`\n🌍 Checking ${externalLinksToCheck.size} external links...`);
    const externalResults = await Promise.all([...externalLinksToCheck].map(checkExternalLink));
    externalResults.forEach(res => {
        if (res) {
            console.log(`  ❌ External Broken: ${res.url} (${res.status || res.error})`);
            brokenLinks.push({ ...res, source: 'external_link' });
        }
    });

    await browser.close();

    // Report
    console.log('\n================ AUDIT REPORT ================');
    console.log(`Pages Scanned: ${visited.size}`);
    console.log(`Broken Links: ${brokenLinks.length}`);
    console.log(`Console Errors: ${consoleErrors.length}`);
    console.log(`Page Load Errors: ${pageLoadErrors.length}`);

    if (brokenLinks.length > 0) {
        console.log('\n--- Broken Links ---');
        console.table(brokenLinks);
    }

    if (consoleErrors.length > 0) {
        console.log('\n--- Console Errors ---');
        consoleErrors.forEach(e => console.log(`${e.url}: ${e.text}`));
    }

    // Save report
    const report = {
        timestamp: new Date().toISOString(),
        startUrl: START_URL,
        stats: {
            scanned: visited.size,
            broken: brokenLinks.length,
            consoleErrors: consoleErrors.length,
            crashes: pageLoadErrors.length
        },
        brokenLinks,
        consoleErrors,
        pageLoadErrors
    };

    fs.writeFileSync('audit-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Report saved to audit-report.json');
}

run().catch(console.error);
