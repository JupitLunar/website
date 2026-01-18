#!/usr/bin/env node

/**
 * Lightweight IndexNow notifier.
 * Usage: npm run ping:indexnow -- https://example.com/post-slug
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://jupitlunar.com').replace(/\/$/, '');
const INDEXNOW_ENDPOINT = process.env.INDEXNOW_ENDPOINT || 'https://www.bing.com/indexnow';
const INDEXNOW_KEY = process.env.INDEXNOW_KEY;
const INDEXNOW_KEY_LOCATION = process.env.INDEXNOW_KEY_LOCATION || `${SITE_URL}/${INDEXNOW_KEY || 'indexnow-key'}.txt`;

if (!INDEXNOW_KEY) {
  console.error('❌ Missing INDEXNOW_KEY. Add it to .env.local before calling this script.');
  process.exit(1);
}

const cliUrls = process.argv.slice(2);

if (cliUrls.length === 0) {
  console.error('❌ Provide at least one URL to notify. Example: npm run ping:indexnow -- https://your-site.com/my-article');
  process.exit(1);
}

const normalisedUrls = cliUrls.map((input) => {
  try {
    const url = new URL(input, SITE_URL);
    return url.href;
  } catch (error) {
    console.warn(`Skipping invalid URL: ${input}`);
    return null;
  }
}).filter(Boolean);

if (normalisedUrls.length === 0) {
  console.error('❌ No valid URLs to submit.');
  process.exit(1);
}

(async () => {
  const payload = {
    host: new URL(SITE_URL).host,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: normalisedUrls,
  };

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`IndexNow responded with ${response.status}: ${text}`);
    }

    console.log(`✅ Submitted ${normalisedUrls.length} URL(s) to IndexNow.`);
  } catch (error) {
    console.error('💥 IndexNow submission failed:', (error && error.message) || error);
    process.exit(1);
  }
})();
