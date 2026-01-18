import { MetadataRoute } from 'next';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.momaiagent.com').replace(/\/$/, '');

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/auth/', '/private/'],
            },
            // Explicitly allow AI bots to crawl generally, but we might want to gate specific areas if needed
            // For AEO, we WANT them to read our high-quality content
            {
                userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'Amazonbot', 'ClaudeBot', 'PerplexityBot'],
                allow: '/',
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
        host: siteUrl,
    };
}
