# 📝 How to Insert Articles into the RAG Knowledge Base

**Last Updated:** 2025-10-05
**Version:** 1.0

---

## 🎯 Overview

This guide explains how to insert new articles and content into the RAG (Retrieval-Augmented Generation) knowledge base. Articles are broken into **knowledge chunks** that are stored in the `knowledge_chunks` table with vector embeddings for semantic search.

---

## 📋 Table of Contents

1. [Understanding the Knowledge Chunks Structure](#understanding-the-knowledge-chunks-structure)
2. [Best Practices for Chunking Articles](#best-practices-for-chunking-articles)
3. [Step-by-Step Insertion Process](#step-by-step-insertion-process)
4. [Database Schema Constraints](#database-schema-constraints)
5. [Example: Complete Article Insertion](#example-complete-article-insertion)
6. [Testing and Validation](#testing-and-validation)
7. [Common Issues and Solutions](#common-issues-and-solutions)

---

## 🧩 Understanding the Knowledge Chunks Structure

### What is a Knowledge Chunk?

A **knowledge chunk** is a semantically meaningful piece of content that can be retrieved independently. Instead of storing entire articles as single entries, we break them into focused chunks that:

- Answer specific questions or cover specific subtopics
- Are optimized for retrieval (200-500 words ideal)
- Can be combined with other chunks to provide comprehensive answers
- Have their own vector embeddings for semantic search

### Why Chunk Articles?

✅ **Better Retrieval Accuracy**: Smaller, focused chunks match queries more precisely
✅ **Flexible Composition**: Mix and match chunks from different articles
✅ **Reduced Token Usage**: Only retrieve relevant sections, not entire articles
✅ **Improved Context**: Each chunk can have its own metadata (priority, risk level, tags)

---

## 📐 Best Practices for Chunking Articles

### 1. **Chunking Strategy**

Use a **semantic chunking** approach based on content structure:

```
Article Structure → Chunk Strategy
─────────────────────────────────────────────────────────
TL;DR / Summary     → Chunk 1 (Highest priority)
Main Concepts       → 1 chunk per concept
Comparisons         → Separate chunk for each comparison
How-to Steps        → Combined or separate based on length
Special Cases       → 1 chunk per special case
Citations/Links     → Final chunk (lowest priority)
```

### 2. **Chunk Size Guidelines**

| Content Type | Recommended Size | Notes |
|--------------|------------------|-------|
| TL;DR / Summary | 100-200 words | Quick overview, high priority |
| Concept Explanation | 200-400 words | Single focused topic |
| Comparison Table | 150-300 words | Side-by-side info |
| How-to Guide | 250-500 words | Step-by-step instructions |
| Special Cases | 150-300 words | Edge cases, exceptions |
| Citations | 200-400 words | Links and attribution |

### 3. **Content Quality Standards**

Each chunk should:

- ✅ Be **self-contained** (understandable on its own)
- ✅ Have a **clear, descriptive title** (used in search results)
- ✅ Include **source attribution** (CDC, WHO, AAP, etc.)
- ✅ Use **consistent terminology** across chunks
- ✅ Avoid duplicating information between chunks
- ✅ Be **factually accurate** and **up-to-date**

### 4. **Metadata Best Practices**

```javascript
{
  priority: 10-100,        // Lower = higher priority (10 = most important)
  risk_level: 'high',      // high | medium | low | none
  tags: ['specific', 'searchable', 'keywords'],
  age_range: ['0-6 months', '6-12 months'],
  category: 'feeding-nutrition',
  subcategory: 'start-solids-readiness'
}
```

**Priority Levels:**
- **10-20**: Critical information (TL;DR, safety warnings)
- **30-40**: Core concepts (main explanations)
- **50-60**: Supporting information (how-to, special cases)
- **70+**: Reference material (citations, links)

**Risk Levels:**
- **high**: Safety-critical (choking hazards, food allergies, medical advice)
- **medium**: Important but not immediately dangerous
- **low**: General information, comparisons
- **none**: Citations, metadata

---

## 🚀 Step-by-Step Insertion Process

### Step 1: Prepare Your Article

Break down your article into logical chunks following the best practices above.

**Example Article Structure:**
```
Article: "Starting Solid Foods for Babies"

Chunk 1: TL;DR Summary (Priority 10)
Chunk 2: Readiness Signs Checklist (Priority 20)
Chunk 3: US vs Canada Guidelines (Priority 30)
Chunk 4: Risks of Starting Too Early/Late (Priority 40)
Chunk 5: Step-by-Step How-To (Priority 50)
Chunk 6: Special Situations (Priority 60)
Chunk 7: Citations and Links (Priority 70)
```

### Step 2: Create an Insertion Script

Create a Node.js script in `scripts/` folder:

```javascript
// scripts/insert-YOUR-ARTICLE-NAME.js
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Use a descriptive slug to group all chunks from the same article
const ARTICLE_SLUG = 'your-article-slug-2025';

const chunks = [
  {
    source_type: 'kb_guide',           // kb_guide | kb_rule | kb_food
    source_id: crypto.randomUUID(),    // Must be unique for each chunk
    source_slug: ARTICLE_SLUG,         // Same for all chunks in article
    title: 'Your Chunk Title',
    content: 'Full content of this chunk...',
    summary: 'One-line summary of this chunk',
    category: 'feeding-nutrition',     // Main category
    subcategory: 'your-subcategory',   // Specific topic
    age_range: ['0-6 months', '6-12 months'],
    locale: 'Global',                  // Must be 'Global' (constraint)
    priority: 10,                      // Lower = higher priority
    risk_level: 'high',                // high | medium | low | none
    tags: ['tag1', 'tag2', 'tag3'],   // Searchable keywords
    status: 'published'                // published | draft | archived
  },
  // ... more chunks
];

(async () => {
  console.log(`Inserting ${chunks.length} chunks...\n`);

  const { data, error } = await supabase
    .from('knowledge_chunks')
    .insert(chunks)
    .select();

  if (error) {
    console.error('Insert error:', error);
    process.exit(1);
  }

  console.log(`✅ Successfully inserted ${data.length} chunks\n`);
  data.forEach((chunk, i) => {
    console.log(`${i + 1}. ${chunk.id} - ${chunk.title}`);
  });

  console.log('\n📝 Next step: Run generate-embeddings.js');
})();
```

### Step 3: Validate Your Data

**Before running the script**, verify:

- ✅ All `source_id` values are unique (use `crypto.randomUUID()`)
- ✅ All chunks share the same `source_slug`
- ✅ `source_type` is one of: `kb_guide`, `kb_rule`, `kb_food`
- ✅ `locale` is set to `'Global'`
- ✅ `risk_level` is one of: `high`, `medium`, `low`, `none`
- ✅ `status` is `'published'` for live content
- ✅ No special Unicode characters that break JavaScript strings

### Step 4: Execute the Insertion

```bash
node scripts/insert-YOUR-ARTICLE-NAME.js
```

**Expected Output:**
```
Inserting 7 chunks...

✅ Successfully inserted 7 chunks

1. abc123... - Your Chunk Title 1
2. def456... - Your Chunk Title 2
...

📝 Next step: Run generate-embeddings.js
```

### Step 5: Generate Embeddings

```bash
node scripts/generate-embeddings.js
```

This will:
- Find all chunks without embeddings
- Generate OpenAI embeddings (text-embedding-3-small, 1536 dimensions)
- Update the `embedding` field in the database

**Expected Output:**
```
📊 Found 7 chunks without embeddings

⚙️  Processing in batches of 10...
✅✅✅✅✅✅✅ 7/7

✨ Embeddings generated successfully!
```

### Step 6: Test the RAG System

```bash
# Option 1: Interactive test
node scripts/test-rag-search.js

# Option 2: API test
curl -X POST http://localhost:3002/api/rag \
  -H "Content-Type: application/json" \
  -d '{"query":"your test query","threshold":0.5}'
```

---

## 🗃️ Database Schema Constraints

### `knowledge_chunks` Table

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `id` | UUID | PRIMARY KEY | Auto-generated |
| `source_type` | TEXT | CHECK (kb_guide, kb_rule, kb_food) | Type of source content |
| `source_id` | UUID | UNIQUE with source_type | Must be unique per chunk |
| `source_slug` | TEXT | - | Groups chunks from same article |
| `title` | TEXT | NOT NULL | Descriptive chunk title |
| `content` | TEXT | NOT NULL | Full chunk content |
| `summary` | TEXT | - | One-line summary |
| `category` | TEXT | - | Main category |
| `subcategory` | TEXT | - | Specific topic |
| `age_range` | TEXT[] | - | Array of age ranges |
| `locale` | TEXT | CHECK ('Global') | Currently only 'Global' allowed |
| `priority` | INTEGER | DEFAULT 50 | 10-100, lower = higher priority |
| `risk_level` | TEXT | CHECK (high, medium, low, none) | Safety/importance level |
| `tags` | TEXT[] | - | Searchable keywords |
| `embedding` | vector(1536) | - | OpenAI embedding vector |
| `status` | TEXT | DEFAULT 'published' | published, draft, archived |

### Key Constraints

1. **Unique Source**: `(source_type, source_id)` must be unique
   - ✅ Use `crypto.randomUUID()` for each chunk's `source_id`
   - ❌ Don't reuse the same `source_id` for multiple chunks

2. **Locale Limitation**: Currently only `'Global'` is allowed
   - Future: May support 'US', 'CA', 'CN', etc.

3. **Source Type**: Must be one of three values
   - `kb_guide`: Articles, guides, how-tos
   - `kb_rule`: Rules, guidelines, safety warnings
   - `kb_food`: Food-specific information

---

## 📚 Example: Complete Article Insertion

### Real Example: "Start Solids Readiness" Article

This example shows a complete 7-chunk article insertion.

```javascript
// scripts/insert-solids-article.js
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ARTICLE_SLUG = 'start-solids-readiness-us-ca-2025';

const chunks = [
  {
    source_type: 'kb_guide',
    source_id: crypto.randomUUID(),
    source_slug: ARTICLE_SLUG,
    title: 'Start solids: TL;DR (about 6 months + readiness)',
    content: 'Most infants are developmentally ready to start complementary foods at about 6 months. Do not start before 4 months. Readiness is judged by multiple developmental signs, not by age alone. Keep breast milk or infant formula as the main milk during 6-12 months, and begin with iron-rich options (meats/meat alternatives, iron-fortified infant cereals). Sources: CDC "When, what, and how to introduce solid foods"; U.S. Dietary Guidelines 2020-2025; Health Canada; WHO; AAP.',
    summary: 'About 6 months, not before 4 months; use developmental readiness signs; continue milk feeds; start with iron-rich foods.',
    category: 'feeding-nutrition',
    subcategory: 'start-solids-readiness',
    age_range: ['0-6 months', '6-12 months'],
    locale: 'Global',
    priority: 10,
    risk_level: 'high',
    tags: ['about-6-months', 'readiness-signs', 'iron-first', 'US-vs-Canada', 'AEO'],
    status: 'published'
  },
  {
    source_type: 'kb_guide',
    source_id: crypto.randomUUID(),
    source_slug: ARTICLE_SLUG,
    title: 'Readiness signs: practical checklist',
    content: 'Begin solids when most of these are present: 1) good head and neck control; 2) able to sit with little support; 3) opens mouth for a spoon and shows interest in food; 4) moves food from front of tongue to the back and swallows (tongue-thrust reflex reduced); 5) hand-to-mouth coordination. Note: body-weight targets alone are not sufficient. Sources: CDC; U.S. Dietary Guidelines; Health Canada; WHO.',
    summary: 'Actionable checklist for judging readiness without relying on age or weight alone.',
    category: 'feeding-nutrition',
    subcategory: 'start-solids-readiness',
    age_range: ['0-6 months', '6-12 months'],
    locale: 'Global',
    priority: 20,
    risk_level: 'high',
    tags: ['checklist', 'development', 'swallowing', 'parent-guide', 'AEO'],
    status: 'published'
  }
  // ... 5 more chunks following the same pattern
];

(async () => {
  console.log(`Inserting ${chunks.length} chunks for article: ${ARTICLE_SLUG}\n`);

  const { data, error } = await supabase
    .from('knowledge_chunks')
    .insert(chunks)
    .select();

  if (error) {
    console.error('❌ Insert error:', error);
    process.exit(1);
  }

  console.log(`✅ Successfully inserted ${data.length} chunks\n`);
  console.log('Chunk IDs:');
  data.forEach((chunk, i) => {
    console.log(`  ${i + 1}. ${chunk.id}`);
    console.log(`     Title: ${chunk.title}`);
    console.log(`     Priority: ${chunk.priority}, Risk: ${chunk.risk_level}`);
  });

  console.log('\n📝 Next: Run "node scripts/generate-embeddings.js"');
})();
```

**Execution:**
```bash
$ node scripts/insert-solids-article.js

Inserting 7 chunks for article: start-solids-readiness-us-ca-2025

✅ Successfully inserted 7 chunks

Chunk IDs:
  1. 0d7d0da4-85ce-400e-b7a8-7ebac3775638
     Title: Start solids: TL;DR (about 6 months + readiness)
     Priority: 10, Risk: high
  2. 88bcceb4-5a13-4b60-bd72-aa7138b4a2ba
     Title: Readiness signs: practical checklist
     Priority: 20, Risk: high
  ...

📝 Next: Run "node scripts/generate-embeddings.js"
```

---

## ✅ Testing and Validation

### 1. Verify Insertion

Check that chunks were inserted correctly:

```bash
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
  const { data, error } = await supabase
    .from('knowledge_chunks')
    .select('id, title, source_slug, embedding')
    .eq('source_slug', 'your-article-slug-2025')
    .order('priority', { ascending: true });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(\`Found \${data.length} chunks:\n\`);
  data.forEach((chunk, i) => {
    const hasEmbedding = chunk.embedding !== null;
    console.log(\`\${i + 1}. \${chunk.title}\`);
    console.log(\`   Embedding: \${hasEmbedding ? '✅' : '❌ Missing'}\`);
  });
})();
"
```

### 2. Test RAG Retrieval

```bash
curl -X POST http://localhost:3002/api/rag \
  -H "Content-Type: application/json" \
  -d '{
    "query": "test query related to your article",
    "threshold": 0.5,
    "limit": 5
  }' | jq
```

### 3. Verify Search Quality

Test with multiple queries to ensure:
- ✅ Correct chunks are retrieved
- ✅ Relevance scores are reasonable (> 0.5 for good matches)
- ✅ Answer quality is high
- ✅ No duplicate information in results

---

## ⚠️ Common Issues and Solutions

### Issue 1: Duplicate Key Error

**Error:**
```
duplicate key value violates unique constraint "idx_knowledge_chunks_unique_source"
Key (source_type, source_id)=(kb_guide, xxx) already exists
```

**Solution:**
- ✅ Use `crypto.randomUUID()` for EACH chunk's `source_id`
- ❌ Don't reuse the same UUID for multiple chunks

### Issue 2: Check Constraint Violation (locale)

**Error:**
```
new row violates check constraint "knowledge_chunks_locale_check"
```

**Solution:**
- ✅ Use `locale: 'Global'`
- ❌ Don't use 'US', 'CA', 'US/CA', etc. (not yet supported)

### Issue 3: Check Constraint Violation (risk_level)

**Error:**
```
new row violates check constraint "knowledge_chunks_risk_level_check"
```

**Solution:**
- ✅ Use one of: `'high'`, `'medium'`, `'low'`, `'none'`
- ❌ Don't use 'safety', 'critical', 'info', etc.

### Issue 4: Check Constraint Violation (source_type)

**Error:**
```
new row violates check constraint "knowledge_chunks_source_type_check"
```

**Solution:**
- ✅ Use one of: `'kb_guide'`, `'kb_rule'`, `'kb_food'`
- ❌ Don't use 'kb_article', 'article', 'post', etc.

### Issue 5: JavaScript Syntax Error

**Error:**
```
SyntaxError: Unexpected identifier
```

**Solution:**
- Check for special Unicode characters (em dashes, non-breaking hyphens)
- Replace with standard ASCII characters:
  - `—` → `-` (em dash to hyphen)
  - `‑` (U+2011) → `-` (non-breaking hyphen to hyphen)
  - `'` → `'` (smart quote to apostrophe)

### Issue 6: No Results in RAG Search

**Possible Causes:**
1. Embeddings not generated → Run `generate-embeddings.js`
2. Threshold too high → Try `threshold: 0.3` or `0.0`
3. Query not matching content → Rephrase query
4. Status not 'published' → Check `status` field

**Debug:**
```bash
# Check if embeddings exist
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
(async () => {
  const { count } = await supabase
    .from('knowledge_chunks')
    .select('*', { count: 'exact', head: true })
    .is('embedding', null);
  console.log('Chunks without embeddings:', count);
})();
"
```

---

## 📊 Best Practices Summary

### DO ✅

1. **Break articles into semantic chunks** (200-500 words each)
2. **Use descriptive titles** for each chunk
3. **Generate unique `source_id`** for each chunk using `crypto.randomUUID()`
4. **Use same `source_slug`** for all chunks from the same article
5. **Set appropriate priority levels** (10 = highest, 70+ = reference)
6. **Match risk_level to content** (high for safety, medium for important, low/none for general)
7. **Include source attribution** in content
8. **Generate embeddings** immediately after insertion
9. **Test with multiple queries** to validate retrieval
10. **Use consistent terminology** across all chunks

### DON'T ❌

1. **Don't reuse `source_id`** across multiple chunks
2. **Don't use locales other than 'Global'** (not yet supported)
3. **Don't use invalid `risk_level`** values (only high/medium/low/none)
4. **Don't use invalid `source_type`** values (only kb_guide/kb_rule/kb_food)
5. **Don't create chunks that are too large** (> 600 words)
6. **Don't create chunks that are too small** (< 100 words)
7. **Don't duplicate content** across chunks
8. **Don't forget to generate embeddings** after insertion
9. **Don't use special Unicode characters** in JavaScript string literals
10. **Don't insert chunks with `status: 'draft'`** if you want them searchable

---

## 🔗 Related Documentation

- [DATABASE_OPTIMIZATION_GUIDE.md](DATABASE_OPTIMIZATION_GUIDE.md) - Complete RAG system documentation
- [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) - Full project overview
- [RAG_OPTIMIZATION_SUMMARY.md](RAG_OPTIMIZATION_SUMMARY.md) - v2.0 features

---

## 📞 Support

For issues or questions:
1. Check the [Common Issues](#common-issues-and-solutions) section
2. Review database constraints in [Database Schema](#database-schema-constraints)
3. Test with example scripts in `scripts/` folder
4. Check Supabase logs for detailed error messages

---

**Happy chunking! 🎉**
