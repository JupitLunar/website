# ClawHub Skill Upload

This project ships a read-only public knowledge skill for ClawHub.

## Bundle paths

- Skill folder: `clawhub-skill/mom-ai-knowledge-base`
- Zip bundle: `clawhub-skill/dist/mom-ai-knowledge-base.zip`
- Alternate extension: `clawhub-skill/dist/mom-ai-knowledge-base.skill`

## What the skill does

- Reads the public Mom AI Agent knowledge API
- Uses only read-only surfaces:
  - `/api/kb/query`
  - `/api/kb`
  - `/api/kb/feed`
  - `/api/kb/rules`
  - `/api/kb/guides`
  - `/api/kb/topics`
  - `/api/kb/foods`
  - `/api/kb/faqs`
  - `/api/kb/insights`
- Does not request private data, shell access, installation, or write operations

## Coverage model

The skill should be described using the real content architecture:

- `articles + citations` is the broader content source-of-truth
- `kb_*` is the smaller structured answer layer
- `/api/kb/insights` is a main public evidence-qualified article layer
- `/api/kb/topics` is the navigation layer when direct answer coverage is limited

Do not describe the skill as if only `kb_*` tables matter, and do not describe it as full-site article search.

## Current FAQ state

`/api/kb/faqs` is database-first, but will return:

- `source: "static-fallback"`
- `table_status: "missing"`

when the remote `kb_faqs` table does not exist yet.

This is acceptable for initial upload, but the production target is:

- `source: "supabase"`
- `table_status: "present"`

## Before upload

Run:

```bash
npm run type-check
npm run validate:kb
npm run package:clawhub:skill
npm run test:kb:public
npm run test:clawhub:preflight
```

Before upload, also verify the live deployment, not just localhost:

- `https://www.momaiagent.com/api/kb`
- `https://www.momaiagent.com/api/kb/query?q=...`
- `https://www.momaiagent.com/api/kb/insights?query=...`

If you want FAQ to come from Supabase instead of the site fallback, run this first in the remote SQL editor:

- SQL file: `supabase/add_kb_faqs_table.sql`
- Project SQL editor: `https://supabase.com/dashboard/project/isrsacgnhagdvwoytkuy/sql`

Then run:

```bash
npm run sync:kb:faqs
npm run test:kb:faq-readiness
npm run package:clawhub:skill
npm run test:kb:public
npm run test:clawhub:preflight
```

## Upload checklist

1. Upload `clawhub-skill/dist/mom-ai-knowledge-base.skill` or the zip equivalent.
2. Confirm the bundle contains:
   - `SKILL.md`
   - `MANIFEST.yaml`
   - `agents/openai.yaml`
   - `references/api.md`
   - `references/architecture.md`
3. Confirm the live skill can describe the API surfaces and stays read-only.
4. Confirm the listing text explains that `insights` is one of the main public coverage layers.
5. If FAQ still reports `static-fallback`, note that in the listing description until the Supabase FAQ table is live.
