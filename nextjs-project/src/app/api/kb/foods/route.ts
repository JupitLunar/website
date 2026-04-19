import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

import {
  kbJsonHeaders,
  parseKnowledgeLocale,
  serializeKnowledgeFood,
  uniqueStrings,
} from '@/lib/kb-api';
import { knowledgeBase } from '@/lib/supabase';
import type { KnowledgeSource, RiskLevel } from '@/types/content';

const SUPPORTED_RISKS: RiskLevel[] = ['none', 'low', 'medium', 'high'];

function parseRisk(value: string | null): RiskLevel | undefined {
  if (!value) return undefined;
  const risk = value.toLowerCase() as RiskLevel;
  return SUPPORTED_RISKS.includes(risk) ? risk : undefined;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = parseKnowledgeLocale(searchParams.get('locale'));
    const risk = parseRisk(searchParams.get('risk'));
    const method = searchParams.get('method')?.toLowerCase();
    const ageRange = searchParams.get('age');
    const slug = searchParams.get('slug');

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

    if (slug) {
      const food = await knowledgeBase.getFoodBySlug(slug);
      if (!food) {
        return NextResponse.json({ error: 'Food not found' }, { status: 404 });
      }

      const sourceMap = await knowledgeBase.getSourcesMap(food.source_ids || []);
      const sources = (food.source_ids || [])
        .map((id) => sourceMap.get(id))
        .filter((item): item is KnowledgeSource => Boolean(item));

      return NextResponse.json(
        {
          data: serializeKnowledgeFood(food, sources),
          meta: {
            surface: 'foods',
            locale: locale || food.locale,
            source_count: sources.length,
          },
        },
        { headers: kbJsonHeaders() }
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

    const sourceIds = uniqueStrings(foods.flatMap((item) => item.source_ids || []));
    const sourceMap = await knowledgeBase.getSourcesMap(sourceIds);

    return NextResponse.json(
      {
        count: foods.length,
        filters: {
          locale: locale || null,
          risk: risk || null,
          method: method || null,
          age: ageRange || null,
        },
        data: foods.map((food) =>
          serializeKnowledgeFood(
            food,
            (food.source_ids || [])
              .map((id) => sourceMap.get(id))
              .filter((item): item is KnowledgeSource => Boolean(item))
          )
        ),
        meta: {
          surface: 'foods',
          public_read_only: true,
        },
      },
      { headers: kbJsonHeaders() }
    );
  } catch (error) {
    console.error('KB foods API error:', error);
    return NextResponse.json(
      { error: 'Failed to load knowledge base foods' },
      { status: 500 }
    );
  }
}
