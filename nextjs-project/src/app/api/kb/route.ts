import { NextResponse } from 'next/server';
import { kbJsonHeaders, KB_SITE_URL } from '@/lib/kb-api';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(
    {
      name: 'Mom AI Agent Knowledge Base API',
      description:
        'Public, read-only endpoints for the Mom AI Agent evidence intelligence platform. Designed for source-linked retrieval across guidance, foods, FAQs, topics, and agent-facing knowledge query flows.',
      version: '1.5',
      brand: 'Mom AI Agent',
      category: 'parenting-agent',
      base_url: `${KB_SITE_URL}/api/kb`,
      surfaces: ['query', 'feed', 'rules', 'guides', 'foods', 'topics', 'faqs', 'insights'],
      endpoints: [
        {
          name: 'query',
          path: '/api/kb/query',
          description:
            'Agent-facing query surface that returns a source-linked quick answer when available, topic navigation when coverage is broader, safety notes, ranked matches, and an explicitly labeled llm_fallback eligibility object when no strong public match exists.',
          params: {
            q: 'required natural-language question',
            locale: ['US', 'CA', 'Global'],
            limit: 'positive integer up to 10',
          },
        },
        {
          name: 'knowledgebase_feed',
          path: '/api/kb/feed',
          description: 'Combined feed of rules, foods, and guides.',
          params: {
            locale: ['US', 'CA', 'Global'],
            type: ['rules', 'foods', 'guides'],
            format: ['ndjson', 'json'],
            limit: 'positive integer',
          },
        },
        {
          name: 'topics',
          path: '/api/kb/topics',
          description: 'Topic catalog for public guidance paths.',
          params: {
            slug: 'optional topic slug',
          },
        },
        {
          name: 'rules',
          path: '/api/kb/rules',
          description: 'Structured rule records with locale filtering and slug-based detail retrieval.',
          params: {
            locale: ['US', 'CA', 'Global'],
            slug: 'optional rule slug',
          },
        },
        {
          name: 'guides',
          path: '/api/kb/guides',
          description: 'Guide records with type, locale, and slug filters.',
          params: {
            locale: ['US', 'CA', 'Global'],
            type: ['framework', 'scenario', 'nutrition', 'allergen', 'pathway', 'other'],
            slug: 'optional guide slug',
          },
        },
        {
          name: 'foods',
          path: '/api/kb/foods',
          description: 'Foods knowledge base with locale, age, method, and risk filters.',
          params: {
            locale: ['US', 'CA', 'Global'],
            risk: ['none', 'low', 'medium', 'high'],
            method: 'feeding method',
            age: 'age range label',
            slug: 'optional food slug',
          },
        },
        {
          name: 'faqs',
          path: '/api/kb/faqs',
          description: 'Published FAQ entries with optional source joins and topic filters.',
          params: {
            slug: 'optional faq slug',
            category: 'faq category',
            locale: ['US', 'CA', 'Global'],
            topic: 'topic slug',
            foodId: 'knowledge food id',
            query: 'substring match against question or answer',
            limit: 'positive integer up to 100',
          },
        },
        {
          name: 'insights',
          path: '/api/kb/insights',
          description: 'Evidence-qualified article surface derived from published articles plus citations.',
          params: {
            slug: 'optional insight slug',
            locale: ['US', 'CA', 'Global'],
            hub: ['feeding', 'sleep', 'mom-health', 'development', 'safety', 'recipes'],
            type: ['explainer', 'howto', 'research', 'faq', 'recipe', 'news'],
            query: 'substring match against title, summary, body excerpt, or source labels',
            limit: 'positive integer up to 100',
          },
        },
      ],
      examples: [
        `${KB_SITE_URL}/api/kb/query?q=when+is+a+baby+fever+dangerous&locale=US`,
        `${KB_SITE_URL}/api/kb/feed?format=json&type=guides,foods&locale=US&limit=25`,
        `${KB_SITE_URL}/api/kb/rules?locale=US`,
        `${KB_SITE_URL}/api/kb/guides?type=allergen&locale=US`,
        `${KB_SITE_URL}/api/kb/topics`,
        `${KB_SITE_URL}/api/kb/foods?locale=US&age=6-12%20months`,
        `${KB_SITE_URL}/api/kb/faqs?topic=feeding-foundations&locale=US`,
        `${KB_SITE_URL}/api/kb/insights?hub=feeding&locale=US&limit=10`,
      ],
      docs_note:
        'These endpoints are read-only and intended for retrieval, search, and agent-facing knowledge access rather than user-specific advice or write operations. The insights surface is article-derived and used as a secondary evidence layer, not a replacement for structured KB objects. Query keeps source-linked answers separate from any exploratory llm_fallback metadata.',
    },
    { headers: kbJsonHeaders() }
  );
}
