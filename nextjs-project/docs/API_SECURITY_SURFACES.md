# API Security Surfaces

This project now treats API routes as one of two explicit classes:

## Public surfaces

These routes are intentionally readable by anonymous users and agents because they expose published website content or controlled answer functionality.

- `/api/kb`
- `/api/kb/feed`
- `/api/kb/foods`
- `/api/kb/guides`
- `/api/kb/topics`
- `/api/kb/faqs`
- `/api/search`
- `/api/latest-articles`
- `/api/ai-feed`
- `/api/ai-feed-v2`
- `/api/llm/answers`
- `/api/rag`
- `/api/analytics/events` `POST` only

Public routes must follow these rules:

- Return only published content or user-safe output
- Avoid raw operational metrics
- Avoid service-role-only internal state unless it is already public by design
- Apply rate limiting to higher-cost surfaces such as `/api/rag`

## Internal surfaces

These routes now require a valid bearer secret and must not be left anonymously reachable:

- `/api/analytics/events` `GET`
- `/api/analytics/stats`
- `/api/aeo-analytics`
- `/api/debug/insight-articles`
- `/api/ai-training-data`
- `/api/revalidate`
- `/api/cache/purge`
- `/api/scraper/run`
- `/api/scraper/status`

## Supported secrets

- `INTERNAL_API_SECRET`
  Use for internal read-only operational endpoints.

- `REVALIDATION_SECRET`
  Use for cache and revalidation actions. Internal analytics/debug endpoints also accept this as a fallback when `INTERNAL_API_SECRET` is not set.

- `CRON_SECRET`
  Use for scheduled scraper execution.

- `SCRAPER_API_KEY`
  Optional manual fallback secret for scraper operations.

## Current hardening changes

- Removed development-mode auth bypasses from revalidation and scraper routes
- Removed spoofable `user-agent` trust for cron execution
- Restricted analytics event reads to a secret-protected path
- Reduced analytics event reads to non-sensitive columns only
- Hashes client IP values before persisting analytics events
- Added public event allowlist and payload size checks for analytics writes
- Added in-memory rate limiting for `/api/rag` and `/api/analytics/events` `POST`

## Regression checks

Use these commands before deploy:

```bash
npm run type-check
npm run test:api:security
npm run test:kb:public
npm run test:clawhub:preflight
```
