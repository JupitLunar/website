/**
 * Enhanced AEO Metadata Extractor
 * Extracts and structures AEO-specific data for LLM consumption
 */

export interface AEOEnhancedMetadata {
    // Quick answer for voice assistants and featured snippets
    quickAnswer?: string;

    // Structured FAQs for AI answer engines
    faqs: Array<{
        question: string;
        answer: string;
        category?: string;
    }>;

    // Step-by-step instructions for how-to queries
    steps: Array<{
        title: string;
        description: string;
        order: number;
    }>;

    // Key facts for bullet-point summaries
    keyFacts: string[];

    // Age-specific guidance
    ageGuidance?: {
        minAge: string;
        maxAge: string;
        developmentalStage: string;
    };

    // Safety warnings for critical information
    safetyWarnings: string[];

    // Authority citations for trust signals
    authorityCitations: Array<{
        organization: string;
        url: string;
        relevance: string;
    }>;

    // Related topics for semantic understanding
    relatedTopics: string[];

    // Content freshness indicators
    freshness: {
        lastUpdated: string;
        nextReviewDate?: string;
        updateFrequency: string;
    };
}

/**
 * Extract comprehensive AEO metadata from article keywords and content
 */
export function extractEnhancedAEOMetadata(article: any): AEOEnhancedMetadata {
    const keywords = article.keywords || [];
    const metadata: AEOEnhancedMetadata = {
        faqs: [],
        steps: [],
        keyFacts: article.key_facts || [],
        safetyWarnings: [],
        authorityCitations: [],
        relatedTopics: [],
        freshness: {
            lastUpdated: article.date_modified || article.date_published || new Date().toISOString(),
            updateFrequency: 'quarterly'
        }
    };

    // Extract AEO-tagged data from keywords
    keywords.forEach((keyword: string) => {
        if (keyword.startsWith('__AEO_QUICK__')) {
            metadata.quickAnswer = keyword.replace('__AEO_QUICK__', '').trim();
        } else if (keyword.startsWith('__AEO_FAQS__')) {
            try {
                const faqData = JSON.parse(keyword.replace('__AEO_FAQS__', ''));
                metadata.faqs.push(...faqData);
            } catch (e) {
                console.warn('Failed to parse FAQ data:', e);
            }
        } else if (keyword.startsWith('__AEO_STEPS__')) {
            try {
                const stepData = JSON.parse(keyword.replace('__AEO_STEPS__', ''));
                metadata.steps.push(...stepData.map((step: any, idx: number) => ({
                    ...step,
                    order: idx + 1
                })));
            } catch (e) {
                console.warn('Failed to parse steps data:', e);
            }
        } else if (keyword.startsWith('__AEO_SAFETY__')) {
            metadata.safetyWarnings.push(keyword.replace('__AEO_SAFETY__', '').trim());
        } else if (keyword.startsWith('__AEO_AGE__')) {
            try {
                const ageData = JSON.parse(keyword.replace('__AEO_AGE__', ''));
                metadata.ageGuidance = ageData;
            } catch (e) {
                console.warn('Failed to parse age data:', e);
            }
        }
    });

    // Extract authority citations from article citations
    if (article.citations && Array.isArray(article.citations)) {
        metadata.authorityCitations = article.citations.map((citation: any) => ({
            organization: citation.publisher || citation.author || 'Unknown',
            url: citation.url,
            relevance: citation.title || 'Supporting evidence'
        }));
    }

    // Extract related topics from clean keywords
    metadata.relatedTopics = (keywords as string[])
        .filter((k: string) => !k.startsWith('__AEO_'))
        .slice(0, 10);

    return metadata;
}

/**
 * Generate LLM-optimized summary for AI answer engines
 */
export function generateLLMOptimizedSummary(article: any, metadata: AEOEnhancedMetadata): string {
    const parts: string[] = [];

    // Start with quick answer if available
    if (metadata.quickAnswer) {
        parts.push(metadata.quickAnswer);
    } else if (article.one_liner) {
        parts.push(article.one_liner);
    }

    // Add age guidance if relevant
    if (metadata.ageGuidance) {
        parts.push(`Recommended for ages ${metadata.ageGuidance.minAge} to ${metadata.ageGuidance.maxAge}.`);
    }

    // Add top 3 key facts
    if (metadata.keyFacts.length > 0) {
        const topFacts = metadata.keyFacts.slice(0, 3).join(' ');
        parts.push(topFacts);
    }

    // Add safety warnings prominently
    if (metadata.safetyWarnings.length > 0) {
        parts.push(`⚠️ Important: ${metadata.safetyWarnings.join(' ')}`);
    }

    // Add authority reference
    if (metadata.authorityCitations.length > 0) {
        const topAuthority = metadata.authorityCitations[0];
        parts.push(`Based on ${topAuthority.organization} guidelines.`);
    }

    return parts.join(' ');
}

/**
 * Generate structured data optimized for voice assistants
 */
export function generateVoiceAssistantData(article: any, metadata: AEOEnhancedMetadata) {
    return {
        '@context': 'https://schema.org',
        '@type': 'SpeakableSpecification',
        cssSelector: ['.quick-answer', '.key-facts', 'h1'],
        xpath: [
            '/html/head/title',
            '/html/body//article//h1',
            '/html/body//article//*[@class="quick-answer"]'
        ],
        // Provide direct text for voice reading
        speakableText: metadata.quickAnswer || article.one_liner,
        // Estimated reading time for voice output
        estimatedReadingTime: Math.ceil((metadata.quickAnswer?.length || 0) / 150) + ' seconds'
    };
}

export default {
    extractEnhancedAEOMetadata,
    generateLLMOptimizedSummary,
    generateVoiceAssistantData
};
