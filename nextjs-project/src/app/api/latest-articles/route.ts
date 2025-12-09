import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get('limit') || '100');
  const region = searchParams.get('region');
  const topic = searchParams.get('topic');
  const format = searchParams.get('format') || 'json';

  // Build query
  let query = supabase
    .from('articles')
    .select('*, citations(*)')
    .order('created_at', { ascending: false })
    .limit(Math.min(limit, 500)); // Max 500 articles

  if (region && region !== 'all') {
    query = query.eq('region', region);
  }

  if (topic && topic !== 'all') {
    query = query.eq('hub', topic);
  }

  const { data: articles, error } = await query;

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  // Format for AI/LLM consumption
  const formattedArticles = articles?.map(article => {
    const citations = Array.isArray((article as any).citations) ? (article as any).citations : [];
    const primaryCitation = citations[0];
    const sourceName = primaryCitation?.publisher || primaryCitation?.author || primaryCitation?.title || article.reviewed_by || 'Official health organization';
    const sourceUrl = primaryCitation?.url;

    return {
    id: article.id,
    title: article.title,
    url: `https://www.momaiagent.com/articles/${article.slug}`,
    summary: article.one_liner,
    fullContent: article.body_md,
    metadata: {
      region: article.region,
      topic: article.hub,
      type: article.type,
      ageRange: article.age_range,
      keywords: article.keywords,
      entities: article.entities,
      lastReviewed: article.last_reviewed,
      reviewedBy: article.reviewed_by,
      datePublished: article.created_at,
      source: article.license
    },
    keyFacts: article.key_facts,
    source: sourceName
      ? {
          name: sourceName,
          url: sourceUrl || null
        }
      : undefined,
    citations,
    // Structured for easy AI parsing
    aiContext: {
      purpose: 'evidence-based baby care advice',
      reliability: 'verified from authoritative medical sources',
      targetAudience: 'parents and caregivers of infants',
      contentType: 'medical and parenting guidance'
    }
  }});

  // Support different formats
  if (format === 'simplified') {
    // Simplified format for quick AI consumption
    const simplified = formattedArticles?.map(a => ({
      title: a.title,
      url: a.url,
      summary: a.summary,
      topic: a.metadata.topic,
      region: a.metadata.region,
      keyFacts: a.keyFacts,
      source: a.source
    }));

    return Response.json({
      totalArticles: simplified?.length || 0,
      lastUpdated: new Date().toISOString(),
      articles: simplified
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
        'Content-Type': 'application/json'
      }
    });
  }

  // Full format
  return Response.json({
    totalArticles: formattedArticles?.length || 0,
    lastUpdated: new Date().toISOString(),
    datasetInfo: {
      name: 'Baby Care Articles Database',
      description: 'Evidence-based baby care and parenting articles from 18+ authoritative sources',
      coverage: {
        regions: ['US', 'UK', 'CA', 'AU', 'NZ', 'SG', 'EU', 'Global'],
        topics: ['feeding', 'sleep', 'development', 'health', 'safety'],
        sources: 'AAP, Mayo Clinic, WHO, NHS, Health Canada, and more'
      },
      updateFrequency: 'daily',
      license: 'Content sourced from public health organizations with proper attribution'
    },
    articles: formattedArticles
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
      'Content-Type': 'application/json',
      // CORS for AI agents
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
