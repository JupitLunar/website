# Knowledge Base Authoring Guidelines

This guide describes how to author structured knowledge entries before they are loaded into Supabase. The same rules apply whether you prepare data in JSON, CSV, or any content management UI.

## Table Overview

| Table | Purpose | Typical Audience |
|-------|---------|------------------|
| `kb_sources` | Authority whitelist, used for attribution and trust | Internal reviewer
| `kb_rules` | Safety, beverage, allergen, storage policies | Parents, caregivers, clinical reviewers
| `kb_foods` | Feeding forms for individual foods across ages | Parents, feeding specialists
| `kb_guides` | Frameworks, pathways, scenarios, glossaries | Parents, educators, care teams

## Shared Metadata

Every entry (rules, foods, guides) should include these review fields:

- `slug`: kebab-case identifier; stays stable after publishing.
- `locale`: `US`, `CA`, or `Global`. Create separate records if guidance diverges by region.
- `status`: use `draft` during authoring and switch to `published` only after review.
- `reviewed_by`: name and credential (e.g., `Jane Doe, RD`). Leave blank until sign-off.
- `last_reviewed_at`: ISO date string `YYYY-MM-DD` when the reviewer approved.
- `expires_at`: ISO date; schedule 24–36 month follow-up (or sooner if policy changes frequently).

All text should be plain UTF-8 without smart quotes. Use sentence case unless you reference formal titles.

## Sources (`kb_sources`)

| Field | Notes |
|-------|-------|
| `id` | UUID v4. Pre-generate and reuse (do not rely on auto IDs when offline). |
| `name` | Human-readable citation title, e.g., `HealthyChildren.org – Honey Guidance`. |
| `organization` | Agency or publisher, e.g., `American Academy of Pediatrics`. |
| `url` | Canonical HTTPS URL. |
| `grade` | `A` (official body), `B` (peer-reviewed or academic summary), `C` (large hospital blog), `D` (media). |
| `retrieved_at` | Date you last checked the link. |
| `notes` | Optional summary or key quote. |

Record every authoritative page once, then reference by `source_ids` inside rules/foods/guides.

## Rules (`kb_rules`)

Rules capture safety requirements and non-negotiable guardrails.

| Field | Required | Description |
|-------|----------|-------------|
| `slug` | Yes | e.g., `no-honey-before-12-months`. |
| `title` | Yes | Short declarative statement. |
| `category` | Yes | One of: `food-safety`, `beverages`, `allergen`, `storage`, `feeding-environment`, `supplement`, `nutrition`. Extend carefully. |
| `risk_level` | Yes | `none`, `low`, `medium`, `high`. Reflect the severity if ignored. |
| `summary` | Yes | One-paragraph explanation targeting parents. |
| `do_list` | Yes | Array of actionable “✅” items. 2–5 entries recommended. |
| `dont_list` | Optional | Array of “❌” actions to avoid. |
| `why` | Optional | Mechanism or rationale. |
| `how_to` | Optional | Array of steps `{ title, description }` for mitigation. |
| `compliance_notes` | Optional | Disclaimers such as “Does not replace medical advice.” |
| `source_ids` | Yes | Array of UUIDs from `kb_sources`. Minimum one. |

## Foods (`kb_foods`)

Foods describe preparation and serving forms for a single ingredient.

| Field | Required | Description |
|-------|----------|-------------|
| `slug` | Yes | Ingredient identifier, e.g., `carrot`. |
| `name` | Yes | Display name. |
| `age_range` | Yes | Array such as `['6-8m','9-12m','12-24m']`. Use consistent buckets. |
| `feeding_methods` | Optional | e.g., `['puree','blw','mixed']`. |
| `serving_forms` | Yes | Array of objects `{ age_range, form, texture?, prep?, notes? }`. Detail how to cut, cook, and serve safely. |
| `risk_level` | Yes | Reflect choking or allergen risk. |
| `nutrients_focus` | Optional | e.g., `['iron','omega-3']`. |
| `do_list` / `dont_list` | Optional | Quick reminders. |
| `why` | Optional | Benefits (e.g., “rich in beta carotene”). |
| `how_to` | Optional | Extended steps for preparation. |
| `portion_hint` | Optional | Responsive feeding cues instead of fixed grams. |
| `media` | Optional | Reserve for future image/video metadata. |
| `source_ids` | Yes | One or more authoritative sources. |

## Guides (`kb_guides`)

Guides provide higher-level frameworks, scenarios, and glossaries.

| Field | Required | Description |
|-------|----------|-------------|
| `slug` | Yes | e.g., `starting-solids-framework`. |
| `title` | Yes | Headline suitable for cards and nav. |
| `guide_type` | Yes | Suggested values: `framework`, `pathway`, `scenario`, `nutrition`, `allergen`, `other` (use for FAQ, caregiver-support, or glossary content until enums expand). |
| `age_range` | Optional | Array of applicable stages. |
| `summary` | Yes | Elevator pitch (1–2 sentences). |
| `body_md` | Optional | Markdown body; use `##` for subsections. |
| `checklist` | Optional | Array `{ label, detail?, type? }`. Types may be `tip`, `action`, `warning`. |
| `related_rule_ids` | Optional | Link to relevant rules. |
| `related_food_ids` | Optional | Link to foods to encourage discovery. |
| `source_ids` | Yes | Authoritative references. |

## Authoring Checklist

1. Confirm the source exists (or add it) with accurate grading.
2. Draft rule/food/guide content using consistent language style and age buckets.
3. Capture reviewer, last reviewed date, and set an expiration reminder.
4. Validate JSON with `npm run validate:kb` before committing (see validator section once implemented).
5. Only load into Supabase after internal approval workflows are complete.

## Naming Conventions

- Slugs: lowercase, hyphen separated, ASCII only.
- Age ranges: `6-8m`, `9-12m`, `12-24m`, `24-36m`. Avoid spacing.
- Locale-specific entries append suffix if needed (e.g., `vitamin-d-supplement-us`).

## FAQ & Myth Busting Modules

- Use `guide_type: 'other'` for FAQ-style entries until database enums expand (label the intent in the summary, e.g., “FAQ: ...”).
- Start with a short summary that states the evidence-based answer, then add supporting details in `body_md` using `###` subsections for key points, safety, or further reading.
- Link to reinforcing rules via `related_rule_ids` so myths stay grounded in policy statements.
- Provide at least two actionable checklist items that move the caregiver toward evidence-based behaviour.
- Cite diversified sources (guideline + research) to make the myth-busting defensible during reviews.

## Future Extensions

- Additional tables (e.g., `kb_faqs`, `kb_lessons`) can reuse the same metadata pattern.
- Consider adding `tags` arrays in guides/foods for cross-module search (e.g., `['education','development']`).
- Change tracking can be handled via Supabase triggers writing to an audit table once content starts flowing.
