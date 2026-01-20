import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

import { knowledgeBase } from '@/lib/supabase';
import type { KnowledgeFood, KnowledgeLocale, RiskLevel } from '@/types/content';

const SUPPORTED_LOCALES: Record<string, KnowledgeLocale> = {
  us: 'US',
  ca: 'CA',
  global: 'Global',
};

const SUPPORTED_RISKS: RiskLevel[] = ['none', 'low', 'medium', 'high'];

function parseLocale(value: string | null): KnowledgeLocale | undefined {
  if (!value) return undefined;
  const key = value.toLowerCase();
  return SUPPORTED_LOCALES[key];
}

function parseRisk(value: string | null): RiskLevel | undefined {
  if (!value) return undefined;
  const risk = value.toLowerCase() as RiskLevel;
  return SUPPORTED_RISKS.includes(risk) ? risk : undefined;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = parseLocale(searchParams.get('locale'));
    const risk = parseRisk(searchParams.get('risk'));
    const method = searchParams.get('method')?.toLowerCase();
    const ageRange = searchParams.get('age');

    if (searchParams.get('locale') && !locale) {
      return NextResponse.json(
        { error: 'Invalid locale. Use one of: US, CA, Global.' },
        { status: 400 }
      );
    }

    if (searchParams.get('risk') && !risk) {
      return NextResponse.json(
        { error: 'Invalid risk level. Use one of: none, low, medium, high.' },
        { status: 400 }
      );
    }

    let foods = await knowledgeBase.getFoods(locale);

    if (risk) {
      foods = foods.filter((food) => food.risk_level === risk);
    }

    if (method) {
      foods = foods.filter((food) =>
        Array.isArray(food.feeding_methods) &&
        food.feeding_methods.some((item: string) => item.toLowerCase() === method)
      );
    }

    if (ageRange) {
      const ageLower = ageRange.toLowerCase();
      foods = foods.filter((food) =>
        Array.isArray(food.age_range) &&
        food.age_range.some((range: string) => range.toLowerCase() === ageLower)
      );
    }

    return NextResponse.json({ data: foods }, {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  } catch (error) {
    console.error('KB foods API error:', error);
    return NextResponse.json(
      { error: 'Failed to load knowledge base foods' },
      { status: 500 }
    );
  }
}
