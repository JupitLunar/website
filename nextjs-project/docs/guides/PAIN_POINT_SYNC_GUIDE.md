# Pain Point Content Sync Guide

Daily workflow for updating the mom pain point articles so they stay fresh for search and LLM feeds.

## 1. Edit the dataset

- English entries: `data/pain-points/en.json`
- Chinese entries: `data/pain-points/zh.json`

Each item follows the Supabase `ContentBundle` shape.

Required fields:
- `slug` – lowercase, hyphenated unique key
- `type` – one of `explainer | howto | research | faq | recipe | news`
- `hub` – `feeding | sleep | mom-health | development | safety | recipes`
- `title`
- `one_liner` – 50–200 characters
- `key_facts` – 3–8 bullet points
- `body_md` – Markdown body (FAQ gets appended automatically)
- `faq` – array of `{ question, answer }` (optional but recommended)

Optional extras: `entities`, `age_range`, `meta_title`, `meta_description`, `keywords`, `steps`, `citations`. If omitted, defaults are injected (reviewer name, citations, license, etc.).

## 2. Run the sync script

```bash
# Validate without writing
npm run ingest:pain:dry

# Publish English updates
npm run ingest:pain:en

# Publish Chinese updates
npm run ingest:pain:zh
```

Flags:
- `--file <path>` – load a custom JSON dataset
- `--lang en|zh` – override language without editing package scripts
- `--dry-run` – validation + Supabase lookup only, no writes

The script fetches existing slugs from Supabase to report how many records were created vs updated. Failures exit with code `1` so CI can catch issues.

## 3. Verify output

1. Open `/search?q=<keyword>` to confirm the new Q&A appears
2. Hit `/api/ai-feed?limit=10&lang=en` (or `zh`) to verify LLM feed inclusion
3. Optionally trigger the Vercel deploy hook or revalidation so static pages refresh

## 4. Keep the dataset tidy

- Reuse slugs for recurring pain points (the script performs upserts)
- Remove or merge deprecated entries to avoid duplicate answers
- Track `last_reviewed` in the JSON if you need manual dates; otherwise the script stamps today’s date
- If you introduce new hubs or content types, update Supabase schema checks first

That’s it—edit JSON, run the script, verify search/feed. The automation keeps both the website and LLM-facing endpoints aligned with the latest top questions.

