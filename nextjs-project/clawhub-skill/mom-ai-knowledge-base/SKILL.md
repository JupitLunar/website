---
name: mom-ai-knowledge-base
description: Use when the user needs source-linked mom-and-baby guidance from the public Mom AI Agent knowledge API, including foods, topics, FAQs, and structured knowledge-base records. This skill is read-only and should be used for public evidence retrieval, not for personalized diagnosis or private data access.
---

# Mom AI Knowledge Base

Use this skill to answer mom-and-baby questions with the public Mom AI Agent knowledge API.

## Scope

- Public, read-only retrieval only
- Good for foods, topic navigation, FAQ retrieval, and source-linked guidance
- Not for private user data, account actions, or write operations
- Not a substitute for a clinician, emergency service, or localized medical diagnosis

## Base URL

Use `https://www.momaiagent.com/api/kb`.

## Default workflow

1. For discovery or schema confirmation, read `/api/kb`.
2. For broad knowledge retrieval, use `/api/kb/feed?format=json`.
3. For food-specific questions, use `/api/kb/foods`.
4. For topic navigation or “where should I read next?”, use `/api/kb/topics`.
5. For short common questions, use `/api/kb/faqs`.

## Output shape

When answering, keep the response compact and structured:

- `Quick answer`
- `Source layer`
- `Key source or reference`
- `Read next`
- `Escalate to clinician` when urgency is implied

## Safety boundary

- Only use information returned by the API.
- If the API returns no good match, say so plainly.
- If `/api/kb/faqs` returns `"source": "static-fallback"` or `"table_status": "missing"`, mention that the FAQ came from the public site fallback layer rather than the Supabase FAQ table.
- Do not claim individualized care, diagnosis, or emergency clearance.
- If the question suggests fever in a very young infant, breathing trouble, dehydration, seizures, unresponsiveness, or postpartum self-harm risk, explicitly tell the user to contact a clinician or emergency service now.

## Read next

Read [references/api.md](references/api.md) when you need endpoint details, query examples, or response-field notes.
