# API Reference

Base URL: `https://www.momaiagent.com/api/kb`

## Endpoints

### `GET /api/kb`

Use for discovery. Returns:

- skill-facing surface names
- endpoint list
- supported query params
- example URLs

### `GET /api/kb/feed?format=json`

Combined read-only knowledge feed.

Useful params:

- `type=rules,foods,guides`
- `locale=US|CA|Global`
- `limit=25`
- `format=json`

Use when:

- the user asks an open-ended guidance question
- you want the broadest public evidence surface first

### `GET /api/kb/foods`

Food-specific surface.

Useful params:

- `locale=US|CA|Global`
- `risk=none|low|medium|high`
- `method=...`
- `age=...`

Use when:

- the question is about a specific food
- the answer depends on serving form, age range, or risk

### `GET /api/kb/topics`

Topic catalog.

Useful params:

- `slug=feeding-foundations`

Use when:

- the user needs a structured path rather than one answer
- you want to route the user toward broader reading

### `GET /api/kb/faqs`

FAQ surface for common questions.

Useful params:

- `slug=...`
- `category=...`
- `query=...`
- `limit=...`

Notes:

- This endpoint is DB-first.
- If the Supabase `kb_faqs` table is missing, it returns:
  - `"source": "static-fallback"`
  - `"table_status": "missing"`
- Mention that fallback explicitly if you use it in a final answer.

## Response notes

### Foods

Look for:

- `age_range`
- `feeding_methods`
- `serving_forms`
- `risk_level`
- `do_list`
- `dont_list`

### Topics

Look for:

- `focus`
- `summary`
- `url`
- `paths.search`
- `paths.trust`

### FAQs

Look for:

- `question`
- `answer`
- `source_layer`
- `source_type`
- `source_label`
- `source_url`

### Feed

Each record includes:

- `kind`
- `type`
- `title`
- `summary`
- `locale`
- `sources`

## Answering pattern

Preferred response format:

1. One-sentence answer
2. Short evidence note such as `Source layer: authority guidance`
3. One concrete next page or next path

If no strong match exists, say:

`I couldn’t find a strong source-linked match in the public Mom AI Agent knowledge API for that phrasing.`
