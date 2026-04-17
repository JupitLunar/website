import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.momaiagent.com').replace(/\/$/, '');

export async function GET() {
  return NextResponse.json(
    {
      name: 'Mom AI Agent Knowledge Base API',
      description:
        'Public, read-only endpoints for the Mom AI Agent knowledge base. Designed for source-linked retrieval across guidance, foods, FAQs, and topic navigation.',
      version: '1.0',
      base_url: `${siteUrl}/api/kb`,
      surfaces: ['knowledgebase', 'topics', 'foods', 'faqs'],
      endpoints: [
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
          name: 'foods',
          path: '/api/kb/foods',
          description: 'Foods knowledge base with locale, age, method, and risk filters.',
          params: {
            locale: ['US', 'CA', 'Global'],
            risk: ['none', 'low', 'medium', 'high'],
            method: 'feeding method',
            age: 'age range label',
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
      ],
      examples: [
        `${siteUrl}/api/kb/feed?format=json&type=guides,foods&locale=US&limit=25`,
        `${siteUrl}/api/kb/topics`,
        `${siteUrl}/api/kb/foods?locale=US&age=6-12%20months`,
        `${siteUrl}/api/kb/faqs?topic=feeding-foundations&locale=US`,
      ],
      docs_note:
        'These endpoints are read-only and intended for retrieval, search, and agent-facing knowledge access rather than user-specific advice or write operations.',
    },
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=1800, s-maxage=43200',
      },
    }
  );
}
