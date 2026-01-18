---
trigger: always_on
---

# Project Rules

## 1. Always read the code and understand the code, under stand the goal
Stack & Architecture
- **Structure**: `frontend/` (Expo), `web/` (Next.js App Router), `backend/` (FastAPI).
- **Database**: Supabase. Use `lib/supabase.ts`. Respect RLS.
- **Tech**:
  - **TS**: Strict typing, no `any`.
  - **Python**: PEP 8, `async def`, Pydantic models.

## 2. Workflow
- **Plan & Read**: Propose plan for complex tasks. Read files before editing.
- **Safety**: No destructive commands (`rm -rf`) without review.

## 3. Verification (Mandatory)
- **Test**: Verify EVERY change via Browser, Database, or Tests.
- **Loop**: Fix errors until verification passes. Do not stop early.

## 4. Organization
- **Cleanup**: Delete unused scripts/docs after task.
- **Structure**: No root clutter. Group related files.
