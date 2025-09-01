import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { ContentBundle } from '@/types/content';

// Validate the ingest API secret
function validateRequest(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const expectedSecret = process.env.INGEST_API_SECRET;
  
  if (!expectedSecret) {
    console.error('INGEST_API_SECRET not configured');
    return false;
  }
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.substring(7);
  return token === expectedSecret;
}

// Validate content bundle data
function validateContentBundle(data: any): data is ContentBundle {
  const requiredFields = [
    'slug', 'type', 'hub', 'title', 'one_liner', 
    'key_facts', 'last_reviewed', 'reviewed_by', 'entities'
  ];
  
  for (const field of requiredFields) {
    if (!data[field]) {
      console.error(`Missing required field: ${field}`);
      return false;
    }
  }
  
  // Validate slug format
  if (!/^[a-z0-9-]+$/.test(data.slug)) {
    console.error('Invalid slug format. Use only lowercase letters, numbers, and hyphens.');
    return false;
  }
  
  // Validate one_liner length
  if (data.one_liner.length < 50 || data.one_liner.length > 200) {
    console.error('one_liner must be between 50 and 200 characters.');
    return false;
  }
  
  // Validate key_facts array
  if (!Array.isArray(data.key_facts) || data.key_facts.length < 3 || data.key_facts.length > 8) {
    console.error('key_facts must be an array with 3-8 items.');
    return false;
  }
  
  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.last_reviewed)) {
    console.error('last_reviewed must be in YYYY-MM-DD format.');
    return false;
  }
  
  return true;
}

// Log ingestion attempt
async function logIngestion(
  supabase: any,
  batchId: string,
  articleSlug: string,
  action: string,
  status: string,
  errorMessage?: string,
  metadata?: any
) {
  try {
    await supabase
      .from('ingestion_logs')
      .insert({
        batch_id: batchId,
        article_slug: articleSlug,
        action,
        status,
        error_message: errorMessage,
        metadata: metadata || {}
      });
  } catch (error) {
    console.error('Failed to log ingestion:', error);
  }
}

export async function POST(request: NextRequest) {
  // Validate authentication
  if (!validateRequest(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { batch_id, articles } = body;

    if (!batch_id || !Array.isArray(articles) || articles.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request body. Expected batch_id and articles array.' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const results = {
      total: articles.length,
      successful: 0,
      failed: 0,
      errors: [] as any[]
    };

    // Process each article
    for (const article of articles) {
      try {
        // Validate article data
        if (!validateContentBundle(article)) {
          results.failed++;
          results.errors.push({
            slug: article.slug || 'unknown',
            error: 'Validation failed'
          });
          
          await logIngestion(
            supabase,
            batch_id,
            article.slug || 'unknown',
            'error',
            'error',
            'Validation failed',
            { article }
          );
          
          continue;
        }

        // Prepare data for RPC function
        const rpcData = {
          p_slug: article.slug,
          p_type: article.type,
          p_hub: article.hub,
          p_lang: article.lang || 'en',
          p_title: article.title,
          p_one_liner: article.one_liner,
          p_key_facts: article.key_facts,
          p_age_range: article.age_range,
          p_region: article.region || 'Global',
          p_last_reviewed: article.last_reviewed,
          p_reviewed_by: article.reviewed_by,
          p_entities: article.entities,
          p_license: article.license || 'CC BY-NC 4.0',
          p_body_md: article.body_md,
          p_steps: article.steps,
          p_faq: article.faq,
          p_citations: article.citations,
          p_meta_title: article.meta_title,
          p_meta_description: article.meta_description,
          p_keywords: article.keywords
        };

        // Call the RPC function
        const { data: articleId, error } = await supabase.rpc(
          'upsert_article_bundle',
          rpcData
        );

        if (error) {
          throw error;
        }

        results.successful++;
        
        // Log successful ingestion
        await logIngestion(
          supabase,
          batch_id,
          article.slug,
          'create',
          'success',
          undefined,
          { article_id: articleId, article }
        );

      } catch (error: any) {
        results.failed++;
        const errorMessage = error.message || 'Unknown error';
        
        results.errors.push({
          slug: article.slug || 'unknown',
          error: errorMessage
        });

        // Log failed ingestion
        await logIngestion(
          supabase,
          batch_id,
          article.slug || 'unknown',
          'error',
          'error',
          errorMessage,
          { article, error: error.toString() }
        );
      }
    }

    // Determine overall status
    const overallStatus = results.failed === 0 ? 'success' : 
                         results.successful === 0 ? 'error' : 'partial';

    // Log batch completion
    await logIngestion(
      supabase,
      batch_id,
      'batch-completion',
      'batch',
      overallStatus,
      results.failed > 0 ? `${results.failed} articles failed` : undefined,
      { results }
    );

    // Return results
    return NextResponse.json({
      status: overallStatus,
      batch_id,
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Ingest API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'JupitLunar Content Ingestion API',
      version: '1.0.0',
      endpoints: {
        POST: '/api/ingest - Ingest content bundles',
        GET: '/api/ingest - API information'
      },
      documentation: 'See README.md for usage instructions'
    },
    { status: 200 }
  );
}

// Handle unsupported methods
export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
