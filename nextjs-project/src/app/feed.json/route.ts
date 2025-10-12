import { NextResponse } from 'next/server';
import { contentManager } from '@/lib/supabase';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.momaiagent.com').replace(/\/$/, '');
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'JupitLunar';
const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Evidence-grounded feeding intelligence for families and clinicians.';

export async function GET() {
  const articles = await contentManager.getArticlesForFeed(30).catch(() => []);

  const items = Array.isArray(articles)
    ? articles.map((article: any) => ({
        id: `${siteUrl}/${article.slug}`,
        url: `${siteUrl}/${article.slug}`,
        title: article.title,
        summary: article.one_liner || undefined,
        content_html: article.body_md || undefined,
        date_published: article.date_published ? new Date(article.date_published).toISOString() : undefined,
        date_modified: article.date_modified ? new Date(article.date_modified).toISOString() : undefined,
        tags: Array.isArray(article.entities) && article.entities.length > 0 ? article.entities : undefined,
      }))
    : [];

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: `${siteName} – Evidence Feed`,
    home_page_url: `${siteUrl}/`,
    feed_url: `${siteUrl}/feed.json`,
    description: siteDescription,
    language: 'en',
    items,
  };

  return NextResponse.json(feed, {
    headers: {
      'Cache-Control': 's-maxage=900, stale-while-revalidate=86400',
    },
  });
}
