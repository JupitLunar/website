import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * API v2 Analytics Endpoint
 * Monitors usage, performance, and effectiveness of the enhanced AI feed
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const period = searchParams.get('period') || '24h'; // 24h, 7d, 30d
        const metric = searchParams.get('metric') || 'all'; // all, usage, quality, citations

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Calculate time range
        const now = new Date();
        const periodMs = {
            '24h': 24 * 60 * 60 * 1000,
            '7d': 7 * 24 * 60 * 60 * 1000,
            '30d': 30 * 24 * 60 * 60 * 1000,
        }[period] || 24 * 60 * 60 * 1000;

        const since = new Date(now.getTime() - periodMs).toISOString();

        // Fetch all published articles with citations
        const { data: articles, error } = await supabase
            .from('articles')
            .select('*, citations(*)')
            .eq('status', 'published');

        if (error) throw error;

        // Calculate AEO coverage metrics
        const totalArticles = articles?.length || 0;
        const articlesWithQuickAnswer = articles?.filter(a =>
            a.keywords?.some((k: string) => k.startsWith('__AEO_QUICK__'))
        ).length || 0;
        const articlesWithFAQs = articles?.filter(a =>
            a.keywords?.some((k: string) => k.startsWith('__AEO_FAQS__'))
        ).length || 0;
        const articlesWithSafety = articles?.filter(a =>
            a.keywords?.some((k: string) => k.startsWith('__AEO_SAFETY__'))
        ).length || 0;
        const articlesWithCitations = articles?.filter(a =>
            a.citations && a.citations.length > 0
        ).length || 0;

        // Calculate trust score distribution
        const trustScores = articles?.map(article => {
            const citationCount = article.citations?.length || 0;
            const hasGovernmentSource = article.citations?.some((c: any) =>
                ['CDC', 'AAP', 'Health Canada', 'WHO', 'FDA', 'NIH'].some(org =>
                    c.publisher?.includes(org)
                )
            ) || false;

            return Math.min(0.95,
                0.5 +
                (hasGovernmentSource ? 0.3 : 0) +
                (citationCount * 0.05) +
                (article.reviewed_by === 'Medical Review Board' ? 0.1 : 0)
            );
        }) || [];

        const avgTrustScore = trustScores.length > 0
            ? trustScores.reduce((a, b) => a + b, 0) / trustScores.length
            : 0;

        // Calculate evidence level distribution
        const evidenceLevels = {
            A: articles?.filter(a => {
                const citationCount = a.citations?.length || 0;
                const hasGovSource = a.citations?.some((c: any) =>
                    ['CDC', 'AAP', 'Health Canada', 'WHO'].some(org => c.publisher?.includes(org))
                );
                return hasGovSource && citationCount >= 3;
            }).length || 0,
            B: articles?.filter(a => {
                const citationCount = a.citations?.length || 0;
                return citationCount >= 2 && citationCount < 3;
            }).length || 0,
            C: articles?.filter(a => {
                const citationCount = a.citations?.length || 0;
                return citationCount < 2;
            }).length || 0,
        };

        // Calculate freshness metrics
        const articlesUpdatedRecently = articles?.filter(a => {
            const modified = new Date(a.date_modified || a.date_published);
            return modified > new Date(since);
        }).length || 0;

        // Hub distribution
        const hubDistribution = articles?.reduce((acc: any, article) => {
            const hub = article.hub || 'uncategorized';
            acc[hub] = (acc[hub] || 0) + 1;
            return acc;
        }, {}) || {};

        // AEO completeness score (0-100)
        const completenessScore = Math.round(
            ((articlesWithQuickAnswer / totalArticles) * 25) +
            ((articlesWithFAQs / totalArticles) * 25) +
            ((articlesWithCitations / totalArticles) * 30) +
            ((articlesWithSafety / totalArticles) * 20)
        );

        const analytics = {
            period,
            generated: new Date().toISOString(),

            coverage: {
                totalArticles,
                withQuickAnswer: articlesWithQuickAnswer,
                withFAQs: articlesWithFAQs,
                withSafety: articlesWithSafety,
                withCitations: articlesWithCitations,
                completenessScore,
                coveragePercentages: {
                    quickAnswer: Math.round((articlesWithQuickAnswer / totalArticles) * 100),
                    faqs: Math.round((articlesWithFAQs / totalArticles) * 100),
                    safety: Math.round((articlesWithSafety / totalArticles) * 100),
                    citations: Math.round((articlesWithCitations / totalArticles) * 100),
                }
            },

            quality: {
                averageTrustScore: parseFloat(avgTrustScore.toFixed(2)),
                trustScoreDistribution: {
                    high: trustScores.filter(s => s >= 0.8).length,
                    medium: trustScores.filter(s => s >= 0.6 && s < 0.8).length,
                    low: trustScores.filter(s => s < 0.6).length,
                },
                evidenceLevels,
                evidenceLevelPercentages: {
                    A: Math.round((evidenceLevels.A / totalArticles) * 100),
                    B: Math.round((evidenceLevels.B / totalArticles) * 100),
                    C: Math.round((evidenceLevels.C / totalArticles) * 100),
                }
            },

            freshness: {
                articlesUpdatedInPeriod: articlesUpdatedRecently,
                updateRate: Math.round((articlesUpdatedRecently / totalArticles) * 100),
                oldestArticle: articles?.reduce((oldest, article) => {
                    const date = new Date(article.date_modified || article.date_published);
                    return !oldest || date < oldest ? date : oldest;
                }, null as Date | null)?.toISOString(),
                newestArticle: articles?.reduce((newest, article) => {
                    const date = new Date(article.date_modified || article.date_published);
                    return !newest || date > newest ? date : newest;
                }, null as Date | null)?.toISOString(),
            },

            distribution: {
                byHub: hubDistribution,
                byType: articles?.reduce((acc: any, article) => {
                    const type = article.type || 'uncategorized';
                    acc[type] = (acc[type] || 0) + 1;
                    return acc;
                }, {}) || {},
            },

            recommendations: generateRecommendations({
                completenessScore,
                avgTrustScore,
                evidenceLevels,
                totalArticles,
                articlesWithCitations,
                articlesWithQuickAnswer,
                articlesWithFAQs,
            }),
        };

        return NextResponse.json(analytics, {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=300', // 5 minutes
                'X-Analytics-Version': '1.0',
            },
        });

    } catch (error: any) {
        console.error('Analytics API error:', error);
        return NextResponse.json(
            { error: 'Failed to generate analytics', message: error.message },
            { status: 500 }
        );
    }
}

function generateRecommendations(metrics: any): string[] {
    const recommendations: string[] = [];

    if (metrics.completenessScore < 70) {
        recommendations.push('🎯 Priority: Increase AEO coverage to 70%+ for better LLM visibility');
    }

    if (metrics.articlesWithQuickAnswer < metrics.totalArticles * 0.8) {
        recommendations.push('⚡ Add Quick Answers to more articles for featured snippet optimization');
    }

    if (metrics.articlesWithFAQs < metrics.totalArticles * 0.6) {
        recommendations.push('❓ Add structured FAQs to boost "People Also Ask" appearances');
    }

    if (metrics.articlesWithCitations < metrics.totalArticles * 0.9) {
        recommendations.push('📚 Ensure all articles have proper authority citations');
    }

    if (metrics.avgTrustScore < 0.7) {
        recommendations.push('🏆 Improve trust scores by adding government source citations');
    }

    if (metrics.evidenceLevels.A < metrics.totalArticles * 0.3) {
        recommendations.push('⭐ Aim for 30%+ articles at Evidence Level A (government sources + 3+ citations)');
    }

    if (recommendations.length === 0) {
        recommendations.push('✨ Excellent! AEO implementation is comprehensive. Monitor LLM citation rates.');
    }

    return recommendations;
}
