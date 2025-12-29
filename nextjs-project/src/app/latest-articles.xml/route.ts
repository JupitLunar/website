import { createClient } from '@supabase/supabase-js';
import { filterCleanKeywords } from '@/lib/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: articles } = await supabase
    .from('articles')
    .select('slug, title, one_liner, created_at, last_reviewed, region, keywords')
    .order('created_at', { ascending: false })
    .limit(100);

  const baseUrl = 'https://www.momaiagent.com';

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Latest Baby Care Articles - JupitLunar</title>
    <link>${baseUrl}/latest-articles</link>
    <description>Evidence-based baby care and parenting articles from trusted medical sources worldwide</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/latest-articles.xml" rel="self" type="application/rss+xml" />
    ${articles
      ?.map(
        (article) => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${baseUrl}/articles/${article.slug}</link>
      <guid>${baseUrl}/articles/${article.slug}</guid>
      <pubDate>${new Date(article.created_at).toUTCString()}</pubDate>
      <description><![CDATA[${article.one_liner || ''}]]></description>
      <category>${article.region}</category>
      ${filterCleanKeywords(article.keywords).map((kw: string) => `<category>${kw}</category>`).join('\n      ')}
    </item>`
      )
      .join('\n')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate'
    }
  });
}
