# Knowledge Base Operations

This playbook captures the repeatable workflow for seeding, validating, exporting, and reviewing knowledge-base content.

## Required Environment

- `.env.local` or system environment must include:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (needed for server-side seed/export scripts)
- Ensure `supabase` CLI access or network permission to reach your hosted project.
- Run commands from `nextjs-project/` unless noted.

## Seeding & Validation Flow

1. **Draft content**
   - Update `supabase/seed/knowledge_base.json` and supporting docs (`docs/source-inventory.md`, `docs/kb-guidelines.md`).
   - Mark provisional cards with `reviewed_by: "JupitLunar Research Team (awaiting external review)"` until sign-off.
2. **Validate JSON shape** (optional but recommended once validator ships)
   - `npm run validate:kb`
   - Current script performs schema checks and reports missing source links.
3. **Seed Supabase**
   - `npm run seed:kb`
   - Seeds `kb_sources`, `kb_rules`, `kb_foods`, and `kb_guides` using the service role key.
   - Inspect console output for row counts and errors.
4. **Run correction agent when Supabase checker rejects a row**
   - Pipe the rejected payload + issue list into `npm run correct:kb`.
   - Example: `cat tmp/rejected.json | npm run correct:kb -- --allow-search > tmp/fixed.json`
   - The script calls `gpt-5.1-nano` by default and only touches the fields listed in `issues`.
   - Optional search is limited to one pass via DuckDuckGo (override endpoint with `CORRECTION_SEARCH_ENDPOINT`).
   - Feed the corrected payload back into your ingest task; archive `changes`/`notes` for audit.
5. **Smoke-test topics**
   - `npm run dev`
   - Visit `/topics`, `/topics/nutrient-priorities`, `/topics/travel-daycare`, `/topics/holiday-planning`. Confirm cards render with live data.
6. **Export for downstream tasks**
   - `npm run export:kb`
   - Produces NDJSON at `exports/kb-knowledge.ndjson`. This file feeds your RAG/embedding pipeline.

## Embedding & RAG Pipeline Design

| Step | Action | Notes |
|------|--------|-------|
| 1 | Parse `exports/kb-knowledge.ndjson` | Each line represents a rule, food, guide, or source with metadata. |
| 2 | Chunk long `body_md`/`summary` fields | Split on headings to keep chunks ≤ 1000 tokens. Record `chunk_index`. |
| 3 | Generate embeddings | Suggested model: `text-embedding-3-large` (OpenAI) or `all-MiniLM-L6-v2` (local fallback). |
| 4 | Upsert into vector store | Schema recommendation below. |
| 5 | Backfill search index | Store chunk text plus metadata for filtering in your retrieval service. |

### Suggested Vector Table Schema (`kb_embeddings`)

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Match the source rule/food/guide id (append chunk index if needed). |
| `chunk_index` | INT | Order of chunk for reconstruction. |
| `parent_type` | TEXT | `rule`, `food`, `guide`, or `source`. |
| `slug` | TEXT | Slug for routing (if applicable). |
| `locale` | TEXT | Locale for filtering (e.g., `Global`, `US`, `CA`). |
| `grade` | TEXT | Copy of source grade when parent_type is `source`. |
| `review_status` | TEXT | `published` or `provisional`. |
| `expires_at` | DATE | For staleness filters. |
| `embedding` | VECTOR | Model-dependent dimension (e.g., 3072 for `text-embedding-3-large`). |
| `content` | TEXT | Raw chunk text. |
| `metadata` | JSONB | Additional context (age_range, nutrients_focus, checklists). |

### Automation Plan

- Parse and embed via a Node or Python worker triggered after `npm run export:kb`.
- Use batching (100 rows) with rate-limiting for embedding APIs.
- Store last export timestamp to avoid re-embedding unchanged records (compare by `updated_at` or hash of content).

## Nightly/Weekly Export Jobs

- **Nightly quick check**: Run `npm run export:kb` daily at 02:00 local via cron (or GitHub Actions) and diff against previous export. If changes exist, trigger embedding pipeline.
- **Weekly full refresh**: Re-run seeding + exporting each Sunday to incorporate manual edits. Notify reviewers via Slack/Email with diff summary.
- Store artifacts in an S3 bucket or Supabase storage with naming convention `kb-export-YYYY-MM-DD.ndjson`.

## Review & Audit Trail

- **Reviewer naming**: Use `Name, credential (organization)` when externally signed off. Use `JupitLunar Research Team (awaiting external review)` for internal drafts.
- **Status field**: `status: 'published'` once the card is visible on the site; rely on `reviewed_by` string to indicate provisional status.
- **Review calendar**: Maintain a Notion or Sheets tracker with columns: `id`, `slug`, `title`, `type`, `last_reviewed_at`, `expires_at`, `assigned_reviewer`, `notes`. Filter weekly for items expiring within 90 days.
- **Audit logging**: After seeding, archive the console output and generated NDJSON in a dated folder (`exports/logs/YYYY-MM-DD/`). Pair with Git commits referencing the change.
  - Attach `correction-agent` outputs (`changes` & `notes`) to the same log entry for traceability.
- **Reviewer roster**: Update `src/lib/reviewers.ts` when a new clinician joins. The Trust Center and `/trust/reviewers` page pull directly from this file, so the profile list stays transparent even if entries are marked provisional.

## Correction Agent Workflow

- Script: `npm run correct:kb -- --input rejected.json --output fixed.json`
- Input JSON contract:
  ```json
  {
    "draft": { "summary": "...", "content": "..." },
    "issues": [
      { "code": "DUPLICATE_SUMMARY", "message": "Summary duplicates content" },
      { "code": "INCOMPLETE_DATE", "field": "publication_date", "message": "Use YYYY-MM-DD" }
    ],
    "context": { "task_id": "supabase-direct-insert_123" },
    "search_queries": ["Omdia Microsoft Nvidia AI chips 2024"]
  }
  ```
- Flags:
  - `--allow-search`: enables a single DuckDuckGo lookup per query (override via `CORRECTION_SEARCH_ENDPOINT`).
  - `--dry-run`: preview the prompt payload without calling the model.
- Environment variables:
  - `OPENAI_API_KEY` (required)
  - `CORRECTION_MODEL` (default `gpt-5.1-nano`)
  - `CORRECTION_MAX_TOKENS` (default `900`)
  - `CORRECTION_SEARCH_RESULTS` (default `3`)
- Output JSON:
  ```json
  {
    "draft": { /* corrected payload */ },
    "changes": [
      { "field": "summary", "description": "Rephrased to remove duplication" }
    ],
    "notes": ["TODO: verify publication date once source updates"],
    "meta": {
      "model": "gpt-5.1-nano",
      "timestamp": "2025-03-02T18:45:00Z",
      "search_results": [
        {
          "query": "Omdia Microsoft Nvidia AI chips 2024",
          "hits": [ { "title": "...", "url": "https://..." } ]
        }
      ]
    }
  }
  ```
- Feed `draft` back into your ingest pipeline; store `changes`/`notes` alongside QA logs.

## Troubleshooting

- **Seed failures**: Confirm service role key is configured and Supabase tables exist. Re-run with `DEBUG=1 npm run seed:kb` for verbose logs.
- **Missing cards on frontend**: Ensure `status: 'published'` and the locale matches the query (Global vs US/CA). Run `npm run dev` after clearing `.next` if caching persists.
- **Embedding queue stalls**: Monitor API quotas; persist failed IDs and retry with exponential backoff.
