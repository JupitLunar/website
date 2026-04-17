# Knowledge Output Patterns

Use these patterns when the user wants reusable parenting content instead of a one-off reply.

## Pattern 1: Quick Answer

Use for direct caregiver questions.

```md
Direct answer:
[2 to 4 sentences]

What matters now:
- [Most important observation or action]
- [Second action or context]

When to seek help:
- [Red flag]
- [Red flag]

Next useful question:
- [Related follow-up]
```

## Pattern 2: Hub Guide

Use for a canonical topic page.

```md
Title: [Question-led title]
One-liner: [Short answer-first summary]

Who this is for:
- [Stage]
- [Situation]

Key facts:
- [Fact]
- [Fact]
- [Fact]

What is normal:
[Short paragraph]

What to try:
1. [Step]
2. [Step]
3. [Step]

When to contact a clinician:
- [Red flag]
- [Red flag]

FAQ:
- Q: [Question]
  A: [Answer]
- Q: [Question]
  A: [Answer]
```

## Pattern 3: Publishing Bundle

Use when generating structured content for a site or ingest pipeline.

```json
{
  "slug": "newborn-feeding-frequency",
  "type": "explainer",
  "hub": "feeding",
  "lang": "en",
  "title": "How Often Should a Newborn Feed?",
  "one_liner": "Most newborns feed frequently, often 8 to 12 times in 24 hours, especially in the first weeks.",
  "key_facts": [
    "Frequent feeding is common in the newborn stage.",
    "Output, alertness, and weight gain matter more than the clock alone.",
    "Poor intake, low diaper count, or lethargy should prompt medical review."
  ],
  "age_range": "0-8 weeks",
  "region": "CA/US",
  "body_md": "## Short answer\n...\n## What is normal\n...\n## When to get help\n...",
  "faq": [
    { "q": "Can cluster feeding be normal?", "a": "Yes, especially during growth spurts.", "url": "#faq" }
  ],
  "citations": [
    { "claim": "Newborns often feed 8 to 12 times per 24 hours.", "title": "[source]", "url": "[url]" }
  ]
}
```

## Editorial Rules

- Make the page answerable from the title alone.
- Put the answer in the first paragraph.
- Keep age and stage visible.
- Mark uncertainty clearly when advice varies.
- Include red flags without turning the whole page alarmist.
