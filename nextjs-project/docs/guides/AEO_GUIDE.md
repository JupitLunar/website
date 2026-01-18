# Mom AI Agent: AEO & LLM Visibility Guide

This guide details how to maximize your visibility in AI answers (ChatGPT, Claude, Perplexity, Gemini) using the infrastructure now built into the Mom AI Agent website.

## 1. Core AEO Infrastructure (Implemented)

Your website now includes specific "signals" that AI engines look for:

- **`robots.ts` & `robots.txt`**: Explicitly *allows* AI bots (GPTBot, ClaudeBot, etc.) while blocking sensitive admin areas.
- **`manifest.ts`**: Signals a high-quality "app-like" experience.
- **`llms.txt`**: A standardized file at `/llms.txt` that tells AI agents exactly what your site is about and where to read data.
- **AI Feed API**: An endpoint at `/api/ai-feed` providing clean, structured data (NDJSON) specifically for bulk AI ingestion.
- **Structured Data (Schema)**: Every article now automatically serves `MedicalWebPage`, `FAQPage`, and `Speakable` schemas.

## 2. How to "Write" for AI (Content Strategy)

To make your content appear in LLM answers, you must structure it so machines can easily parse "Facts" and "Answers".

### A. The "Quick Answer" Box
AI models love clear, direct answers at the top of a page.
**How to activate:**
In your Content Management System (Supabase), add a keyword starting with `__AEO_QUICK__` to your article.
*   **Format:** `__AEO_QUICK__Direct answer here.`
*   **Example:** `__AEO_QUICK__Babies can start solids at 6 months when they show signs of readiness like sitting up unassisted.`
*   **Result:** This text appears in a special "Quick Answer" box at the top of the article *and* is tagged as the `speakable` summary for voice assistants.

### B. Machine-Readable FAQs
FAQs are the single best way to get into Google's "People Also Ask" and AI summaries.
**How to activate:**
Add keywords starting with `__AEO_FAQS__` containing a JSON string.
*   **Format:** `__AEO_FAQS__[{"question":"...","answer":"..."}]`
*   **Result:** Generates `FAQPage` schema which Google/Bing/AI process directly.

### C. Step-by-Step Guides
For "How-to" queries (e.g., "How to introduce peanuts"), use `__AEO_STEPS__`.
*   **Format:** `__AEO_STEPS__[{"title":"Step 1","description":"..."}]`
*   **Result:** Generates `HowTo` schema.

## 3. Trust Signals (E-E-A-T)

AI models are trained to prioritize "high authority" content, especially for health/parenting.

- **Citations**: Ensure every article has entries in the `citations` JSON field. The system now renders these in a "Citation Box" that allows students/researchers to copy references, building backlinks to you.
- **Medical Disclaimer**: The system automatically appends a medical disclaimer to the schema, protecting you and signalling "responsibility" to the AI.
- **Verified Sources Page**: The `/trust` page is now live and linked. It serves as a central "Authority Hub" that proves your sourcing methodology (CDC, AAP).

## 4. Verification Checklist

1.  **Check `llms.txt`**: Visit `https://www.momaiagent.com/llms.txt`. You should see the markdown documentation.
2.  **Validate Schema**: Use [Google's Rich Results Test](https://search.google.com/test/rich-results) on any Insight article URL. You should see "Article", "FAQPage", and "MedicalWebPage" detected.
3.  **Check Robots**: Visit `https://www.momaiagent.com/robots.txt` and ensure `GPTBot` is allowed.

By following this structure, you are feeding the AI models exactly what they want: structured, verified, and easily parsable data.
