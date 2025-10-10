import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, sessionId } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    // Search knowledge base for relevant content
    const { data: articles, error: searchError } = await supabase
      .from('articles')
      .select('id, title, body_md, slug, hub')
      .textSearch('title', query, {
        type: 'websearch',
        config: 'english'
      })
      .limit(5);

    if (searchError) {
      console.error('Search error:', searchError);
    }

    // Get relevant knowledge chunks if articles don't match well
    const { data: knowledgeChunks, error: chunksError } = await supabase
      .from('knowledge_chunks')
      .select('id, title, content, category, source_id')
      .textSearch('content', query, {
        type: 'websearch',
        config: 'english'
      })
      .limit(3);

    if (chunksError) {
      console.error('Chunks search error:', chunksError);
    }

    // Combine results and generate response
    const sources = [
      ...(articles || []).map(a => ({
        title: a.title,
        category: a.hub || 'General',
        url: `/articles/${a.slug}`,
        type: 'article'
      })),
      ...(knowledgeChunks || []).map(k => ({
        title: k.title,
        category: k.category || 'General',
        source: k.source_id,
        type: 'knowledge'
      }))
    ];

    // Generate AI response based on found content
    let answer = generateAnswer(query, articles, knowledgeChunks);

    return NextResponse.json({
      answer,
      sources,
      sessionId,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('RAG API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process query',
        message: error.message
      },
      { status: 500 }
    );
  }
}

function generateAnswer(query: string, articles: any[], knowledgeChunks: any[]): string {
  const lowerQuery = query.toLowerCase();

  // Handle common maternal & infant care questions
  if (lowerQuery.includes('milestone') || lowerQuery.includes('development')) {
    return "Infant development milestones vary by age. Key milestones include:\n\n• 0-3 months: Lifting head, tracking objects, social smiling\n• 4-6 months: Rolling over, reaching for objects, babbling\n• 7-9 months: Sitting independently, crawling, responding to name\n• 10-12 months: Standing with support, first words, pincer grasp\n\nEvery baby develops at their own pace. Consult your pediatrician if you have concerns about your baby's development.";
  }

  if (lowerQuery.includes('breastfeeding') || lowerQuery.includes('nursing')) {
    return "Common breastfeeding challenges include:\n\n• Latching difficulties: Ensure proper positioning and seek lactation consultant support\n• Low milk supply: Feed on demand, stay hydrated, and consider pumping between feeds\n• Sore nipples: Check latch, use lanolin cream, and air-dry after feeding\n• Engorgement: Feed frequently, apply warm compress before feeding, cold after\n• Mastitis: Continue nursing, rest, and contact your healthcare provider if you have fever\n\nRemember, breastfeeding is a learned skill for both you and baby. Don't hesitate to reach out for professional support.";
  }

  if (lowerQuery.includes('childbirth') || lowerQuery.includes('labor') || lowerQuery.includes('delivery')) {
    return "Preparing for childbirth involves several key areas:\n\n• Physical preparation: Prenatal exercises, pelvic floor strengthening, breathing techniques\n• Mental preparation: Childbirth education classes, birth plan creation, stress management\n• Practical preparation: Hospital bag packing, transportation planning, pediatrician selection\n• Support system: Birth partner selection, doula consideration, family communication\n• Pain management: Understanding options (epidural, natural methods, medications)\n\nConsider touring your birthing facility and discussing your preferences with your healthcare provider well before your due date.";
  }

  if (lowerQuery.includes('postpartum') || lowerQuery.includes('depression') || lowerQuery.includes('ppd')) {
    return "Signs of postpartum depression (PPD) include:\n\n• Persistent sadness, crying, or feeling overwhelmed\n• Loss of interest in activities you usually enjoy\n• Difficulty bonding with your baby\n• Changes in appetite or sleep patterns (beyond normal new parent exhaustion)\n• Feelings of worthlessness, guilt, or inadequacy\n• Difficulty concentrating or making decisions\n• Thoughts of harming yourself or your baby\n\nPPD is common (affecting 1 in 7 mothers) and treatable. If you're experiencing these symptoms, please reach out to your healthcare provider immediately. You're not alone, and help is available.";
  }

  if (lowerQuery.includes('solid') || lowerQuery.includes('food introduction') || lowerQuery.includes('weaning')) {
    return "Starting solid foods (around 6 months):\n\n• Signs of readiness: Sitting with support, good head control, showing interest in food\n• First foods: Single-ingredient purees (iron-fortified cereal, pureed vegetables, fruits)\n• Texture progression: Smooth purees → mashed → soft chunks → finger foods\n• Allergen introduction: Introduce common allergens early (peanuts, eggs, dairy) under pediatric guidance\n• Safety: Always supervise, avoid choking hazards, introduce one new food at a time\n\nLet your baby lead - they'll show you when they're ready for new textures and amounts.";
  }

  // If we found relevant content, use it
  if (articles && articles.length > 0) {
    const topArticle = articles[0];
    return `Based on our knowledge base, here's information related to your question:\n\n${topArticle.summary || topArticle.title}\n\nFor more detailed information, please check the sources below or consult with your pediatrician for personalized advice.`;
  }

  if (knowledgeChunks && knowledgeChunks.length > 0) {
    const topChunk = knowledgeChunks[0];
    return `${topChunk.content.substring(0, 400)}...\n\nFor specific guidance related to your situation, please consult your healthcare provider.`;
  }

  // Default response
  return "Thank you for your question about maternal and infant care. While I don't have specific information on this topic in my current knowledge base, I recommend:\n\n• Consulting with your pediatrician or healthcare provider for personalized advice\n• Checking our knowledge base sections on feeding, development, and safety\n• Reaching out to trusted sources like AAP, CDC, or WHO for evidence-based information\n\nYour baby's health and your well-being are important - never hesitate to contact your healthcare provider with concerns.";
}

export async function GET() {
  return NextResponse.json(
    {
      message: 'RAG API endpoint. Use POST to query the knowledge base.',
      version: '1.0'
    },
    { status: 200 }
  );
}
