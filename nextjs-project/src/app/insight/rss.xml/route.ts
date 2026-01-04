import { createClient } from '@supabase/supabase-js';
import { filterCleanKeywords } from '@/lib/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: articles } = await supabase
    .from('articles')
    .select('slug, title, one_liner, created_at, date_published, date_modified, keywords, hub')
    .eq('reviewed_by', 'AI Content Generator')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(100);

  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.momaiagent.com').replace(/\/$/, '');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Mom AI Agent Insights</title>
    <link>${baseUrl}/insight</link>
    <description>Evidence-informed parenting insights on feeding, sleep, development, safety, and caregiving.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/insight/rss.xml" rel="self" type="application/rss+xml" />
    ${articles
      ?.map((article) => {
        const pubDate = article.date_published || article.created_at;
        const keywords = filterCleanKeywords(article.keywords);
        return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${baseUrl}/insight/${article.slug}</link>
      <guid>${baseUrl}/insight/${article.slug}</guid>
      <pubDate>${pubDate ? new Date(pubDate).toUTCString() : new Date().toUTCString()}</pubDate>
      <description><![CDATA[${article.one_liner || ''}]]></description>
      <category>${article.hub || 'insight'}</category>
      ${keywords.map((kw: string) => `<category>${kw}</category>`).join('\n      ')}
    </item>`;
      })
      .join('\n')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate'
    }
  });
}
