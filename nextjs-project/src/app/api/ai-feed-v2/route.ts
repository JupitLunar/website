import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { extractEnhancedAEOMetadata, generateLLMOptimizedSummary } from '@/lib/aeo-enhanced';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Enhanced AI Feed API - Optimized for LLM consumption
 * Provides structured, enriched data specifically designed for AI answer engines
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const hub = searchParams.get('hub');
        const format = searchParams.get('format') || 'enhanced'; // 'enhanced' or 'simple'

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Fetch published articles with all necessary fields
        let query = supabase
            .from('articles')
            .select(`
        id, slug, title, one_liner, meta_description, body_md,
        keywords, key_facts, entities, hub, type, lang, region, age_range,
        date_published, date_modified, last_reviewed, reviewed_by,
        citations(url, publisher, title, author)
      `)
            .eq('status', 'published')
            .order('date_modified', { ascending: false });

        if (hub) {
            query = query.eq('hub', hub);
        }

        query = query.limit(limit);

        const { data: articles, error } = await query;

        if (error) throw error;

        // Transform articles into LLM-optimized format
        const enhancedFeed = articles?.map(article => {
            const aeoMetadata = extractEnhancedAEOMetadata(article);
            const llmSummary = generateLLMOptimizedSummary(article, aeoMetadata);

            // Calculate trust score based on citations and review status
            const citationCount = article.citations?.length || 0;
            const hasGovernmentSource = article.citations?.some((c: any) =>
                ['CDC', 'AAP', 'Health Canada', 'WHO', 'FDA', 'NIH'].some(org =>
                    c.publisher?.includes(org)
                )
            ) || false;

            const trustScore = Math.min(0.95,
                0.5 + // Base score
                (hasGovernmentSource ? 0.3 : 0) + // Government source bonus
                (citationCount * 0.05) + // Citation bonus
                (article.reviewed_by === 'Medical Review Board' ? 0.1 : 0) // Review bonus
            );

            const baseData = {
                id: article.id,
                slug: article.slug,
                url: `/insight/${article.slug}`,
                title: article.title,

                // LLM-optimized summary
                summary: llmSummary,
                quickAnswer: aeoMetadata.quickAnswer,

                // Structured content
                keyFacts: aeoMetadata.keyFacts,
                faqs: aeoMetadata.faqs,
                steps: aeoMetadata.steps,
                safetyWarnings: aeoMetadata.safetyWarnings,

                // Metadata
                hub: article.hub,
                type: article.type,
                lang: article.lang,
                region: article.region,
                ageRange: article.age_range,

                // Trust signals
                trustScore: parseFloat(trustScore.toFixed(2)),
                evidenceLevel: hasGovernmentSource && citationCount >= 3 ? 'A' :
                    citationCount >= 2 ? 'B' : 'C',
                sourceQuality: hasGovernmentSource ? 'government' : 'curated',
                authorityCitations: aeoMetadata.authorityCitations,

                // Freshness
                datePublished: article.date_published,
                dateModified: article.date_modified,
                lastReviewed: article.last_reviewed,
                freshnessScore: calculateFreshnessScore(article.date_modified || article.date_published),

                // Semantic understanding
                relatedTopics: aeoMetadata.relatedTopics,
                entities: article.entities || [],

                // Content flags
                isBeginnerFriendly: true,
                contentCategory: 'health_education',
                requiresProfessionalConsult: aeoMetadata.safetyWarnings.length > 0,
            };

            // Return enhanced or simple format based on request
            if (format === 'simple') {
                return {
                    id: baseData.id,
                    url: baseData.url,
                    title: baseData.title,
                    summary: baseData.summary,
                    trustScore: baseData.trustScore,
                    dateModified: baseData.dateModified,
                };
            }

            return baseData;
        }) || [];

        // Set response headers optimized for AI crawlers
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');
        headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400');
        headers.set('X-Content-Type-Options', 'nosniff');
        headers.set('X-Robots-Tag', 'index, follow');
        headers.set('X-AI-Feed-Version', '2.0');
        headers.set('X-AI-Feed-Format', format);
        headers.set('X-AI-Feed-Generated', new Date().toISOString());
        headers.set('X-AI-Feed-Count', enhancedFeed.length.toString());

        return NextResponse.json({
            meta: {
                version: '2.0',
                format,
                generated: new Date().toISOString(),
                count: enhancedFeed.length,
                totalAvailable: enhancedFeed.length,
                filters: { hub: hub || 'all' },
            },
            data: enhancedFeed,
        }, { headers });

    } catch (error: any) {
        console.error('Enhanced AI Feed API error:', error);

        return NextResponse.json(
            {
                error: 'Failed to generate enhanced AI feed',
                message: error.message,
                timestamp: new Date().toISOString(),
            },
            { status: 500 }
        );
    }
}

/**
 * Calculate freshness score based on last modification date
 */
function calculateFreshnessScore(dateString: string | null): number {
    if (!dateString) return 0.5;

    const date = new Date(dateString);
    const now = new Date();
    const daysSince = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    // Freshness decays over time
    if (daysSince <= 30) return 1.0;
    if (daysSince <= 90) return 0.9;
    if (daysSince <= 180) return 0.8;
    if (daysSince <= 365) return 0.7;
    return 0.6;
}

// Handle unsupported methods
export async function POST() {
    return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
    );
}
