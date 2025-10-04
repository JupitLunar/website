import { NextResponse } from 'next/server';
import { contentManager } from '@/lib/supabase';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://jupitlunar.com').replace(/\/$/, '');
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'JupitLunar';
const newsCutoffHours = 48;
const limit = 120;

export async function GET() {
  const cutoff = new Date(Date.now() - newsCutoffHours * 60 * 60 * 1000);
  const isoCutoff = cutoff.toISOString();

  const articles = await contentManager
    .getArticlesPublishedSince(isoCutoff, limit)
    .catch(() => []);

  if (!Array.isArray(articles) || articles.length === 0) {
    const empty = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"/>`;
    return new NextResponse(empty, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 's-maxage=600, stale-while-revalidate=3600',
      },
    });
  }

  const items = articles
    .filter((article: any) => article.date_published && new Date(article.date_published) >= cutoff)
    .map((article: any) => {
      const published = new Date(article.date_published).toISOString();
      const modified = article.date_modified ? new Date(article.date_modified).toISOString() : published;
      const title = escapeXml(article.title || article.slug);

      return `  <url>\n    <loc>${siteUrl}/${article.slug}</loc>\n    <news:news>\n      <news:publication>\n        <news:name>${escapeXml(siteName)}</news:name>\n        <news:language>${article.lang || 'en'}</news:language>\n      </news:publication>\n      <news:publication_date>${published}</news:publication_date>\n      <news:title>${title}</news:title>\n    </news:news>\n    <lastmod>${modified}</lastmod>\n  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n${items}\n</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=600, stale-while-revalidate=3600',
    },
  });
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
