#!/usr/bin/env node

const BASE_URL = (process.env.TEST_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

function logPass(message) {
  console.log(`✅ ${message}`);
}

function logFail(message) {
  console.error(`❌ ${message}`);
}

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, options);
  let body = null;

  try {
    body = await response.json();
  } catch {
    body = null;
  }

  return { response, body };
}

async function expectStatus(name, path, status, options = {}) {
  const { response, body } = await request(path, options);
  if (response.status !== status) {
    throw new Error(`${name}: expected ${status}, got ${response.status} (${JSON.stringify(body)})`);
  }
  logPass(`${name} -> ${status}`);
  return { response, body };
}

async function main() {
  console.log(`🔐 Testing API security at ${BASE_URL}\n`);

  await expectStatus('Unauthorized analytics events read', '/api/analytics/events', 401);
  await expectStatus('Unauthorized analytics stats', '/api/analytics/stats', 401);
  await expectStatus('Unauthorized debug endpoint', '/api/debug/insight-articles', 401);
  await expectStatus('Unauthorized AEO analytics', '/api/aeo-analytics', 401);
  await expectStatus('Unauthorized training export', '/api/ai-training-data', 401);
  await expectStatus('Unauthorized revalidate', '/api/revalidate', 401, { method: 'POST' });
  await expectStatus('Unauthorized scraper run', '/api/scraper/run', 401, { method: 'POST' });
  await expectStatus('Unauthorized scraper status', '/api/scraper/status', 401);
  await expectStatus('Unauthorized cache purge docs', '/api/cache/purge', 401);

  const publicAnalytics = await expectStatus('Public analytics write', '/api/analytics/events', 200, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_type: 'newsletter_subscription',
      event_data: {
        source: 'security-test',
        email_domain: 'example.com',
      },
      session_id: `security-${Date.now()}`,
    }),
  });

  if (!publicAnalytics.response.headers.get('x-ratelimit-limit')) {
    throw new Error('Public analytics write: missing rate limit headers');
  }
  logPass('Public analytics write includes rate limit headers');

  await expectStatus('Reject unsupported analytics event', '/api/analytics/events', 400, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_type: 'internal_metric_dump',
      event_data: { bad: true },
    }),
  });

  await expectStatus('Public KB stays open', '/api/kb', 200);

  const rag = await expectStatus('Public RAG stays open', '/api/rag', 200, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: 'zzq improbable no match',
      sessionId: 'security-rag',
    }),
  });

  if (!rag.response.headers.get('x-ratelimit-limit')) {
    throw new Error('Public RAG response: missing rate limit headers');
  }
  logPass('Public RAG includes rate limit headers');

  const internalSecret = process.env.INTERNAL_API_SECRET || process.env.REVALIDATION_SECRET;
  if (internalSecret) {
    await expectStatus('Authorized analytics stats', '/api/analytics/stats', 200, {
      headers: { Authorization: `Bearer ${internalSecret}` },
    });
  } else {
    console.log('ℹ️ Skipping authorized internal checks: INTERNAL_API_SECRET / REVALIDATION_SECRET not set in shell.');
  }

  const revalidationSecret = process.env.REVALIDATION_SECRET;
  if (revalidationSecret) {
    await expectStatus('Authorized revalidate status', '/api/revalidate', 200, {
      headers: { Authorization: `Bearer ${revalidationSecret}` },
    });
  } else {
    console.log('ℹ️ Skipping authorized revalidate check: REVALIDATION_SECRET not set in shell.');
  }

  const scraperSecret = process.env.CRON_SECRET || process.env.SCRAPER_API_KEY;
  if (scraperSecret) {
    await expectStatus('Authorized scraper status', '/api/scraper/status', 200, {
      headers: { Authorization: `Bearer ${scraperSecret}` },
    });
  } else {
    console.log('ℹ️ Skipping authorized scraper check: CRON_SECRET / SCRAPER_API_KEY not set in shell.');
  }

  console.log('\n🔒 API security regression checks passed.');
}

main().catch((error) => {
  logFail(error.message);
  process.exitCode = 1;
});
