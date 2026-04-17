# ClawHub Skill Upload

This project ships a read-only public knowledge skill for ClawHub.

## Bundle paths

- Skill folder: `clawhub-skill/mom-ai-knowledge-base`
- Zip bundle: `clawhub-skill/dist/mom-ai-knowledge-base.zip`
- Alternate extension: `clawhub-skill/dist/mom-ai-knowledge-base.skill`

## What the skill does

- Reads the public Mom AI Agent knowledge API
- Uses only read-only surfaces:
  - `/api/kb`
  - `/api/kb/feed`
  - `/api/kb/topics`
  - `/api/kb/foods`
  - `/api/kb/faqs`
- Does not request private data, shell access, installation, or write operations

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
npm run test:kb:public
npm run test:clawhub:preflight
```

If you want FAQ to come from Supabase instead of the site fallback, run this first in the remote SQL editor:

- SQL file: `supabase/add_kb_faqs_table.sql`
- Project SQL editor: `https://supabase.com/dashboard/project/isrsacgnhagdvwoytkuy/sql`

Then run:

```bash
npm run sync:kb:faqs
npm run test:kb:faq-readiness
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
3. Confirm the live skill can describe the API surfaces and stays read-only.
4. If FAQ still reports `static-fallback`, note that in the listing description until the Supabase FAQ table is live.
