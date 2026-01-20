import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

import { knowledgeBase } from '@/lib/supabase';
import type { KnowledgeGuide, KnowledgeLocale } from '@/types/content';

const SUPPORTED_LOCALES: Record<string, KnowledgeLocale> = {
  us: 'US',
  ca: 'CA',
  global: 'Global',
};

const GUIDE_TYPES: KnowledgeGuide['guide_type'][] = [
  'framework',
  'scenario',
  'nutrition',
  'allergen',
  'pathway',
  'other',
];

function parseLocale(value: string | null): KnowledgeLocale | undefined {
  if (!value) return undefined;
  const key = value.toLowerCase();
  return SUPPORTED_LOCALES[key];
}

function parseGuideType(value: string | null): KnowledgeGuide['guide_type'] | undefined {
  if (!value) return undefined;
  const lower = value.toLowerCase() as KnowledgeGuide['guide_type'];
  return GUIDE_TYPES.includes(lower) ? lower : undefined;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = parseLocale(searchParams.get('locale'));
    const guideType = parseGuideType(searchParams.get('type'));

    if (searchParams.get('locale') && !locale) {
      return NextResponse.json(
        { error: 'Invalid locale. Use one of: US, CA, Global.' },
        { status: 400 }
      );
    }

    if (searchParams.get('type') && !guideType) {
      return NextResponse.json(
        { error: 'Invalid guide type. Use one of: framework, scenario, nutrition, allergen, pathway, other.' },
        { status: 400 }
      );
    }

    const guides = await knowledgeBase.getGuides({ locale, guideType });

    return NextResponse.json({ data: guides }, {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  } catch (error) {
    console.error('KB guides API error:', error);
    return NextResponse.json(
      { error: 'Failed to load knowledge base guides' },
      { status: 500 }
    );
  }
}
