/**
 * Breadcrumb Schema Generator
 * Generates BreadcrumbList structured data for improved navigation and SEO
 */

interface BreadcrumbItem {
    name: string;
    url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]): object {
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.momaiagent.com').replace(/\/$/, '');

    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
        })),
    };
}

/**
 * Common breadcrumb paths for the website
 */
export const BREADCRUMB_PATHS = {
    home: { name: 'Home', url: '/' },
    topics: { name: 'Topics', url: '/topics' },
    insights: { name: 'Insights', url: '/insight' },
    products: { name: 'Products', url: '/products' },
    trust: { name: 'Trust & Methods', url: '/trust' },
    faq: { name: 'FAQ', url: '/faq' },
    contact: { name: 'Contact', url: '/contact' },
};
