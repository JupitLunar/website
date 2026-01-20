import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

import { knowledgeBase } from '@/lib/supabase';
import type { KnowledgeLocale } from '@/types/content';

const SUPPORTED_LOCALES: Record<string, KnowledgeLocale> = {
  us: 'US',
  ca: 'CA',
  global: 'Global',
};

function parseLocale(value: string | null): KnowledgeLocale | undefined {
  if (!value) return undefined;
  const key = value.toLowerCase();
  return SUPPORTED_LOCALES[key];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = parseLocale(searchParams.get('locale'));

    if (searchParams.get('locale') && !locale) {
      return NextResponse.json(
        { error: 'Invalid locale. Use one of: US, CA, Global.' },
        { status: 400 }
      );
    }

    const data = await knowledgeBase.getRules(locale);

    return NextResponse.json({ data }, {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  } catch (error) {
    console.error('KB rules API error:', error);
    return NextResponse.json(
      { error: 'Failed to load knowledge base rules' },
      { status: 500 }
    );
  }
}
