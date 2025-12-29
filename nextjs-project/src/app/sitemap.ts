import type { MetadataRoute } from 'next';
import { contentManager, createAdminClient } from '@/lib/supabase';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.momaiagent.com').replace(/\/$/, '');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/topics`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/topics/north-america-overview`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${siteUrl}/trust`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/products/dearbaby`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/products/solidstart`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/insight`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    // AI feed endpoints - 高优先级给LLM爬虫
    {
      url: `${siteUrl}/api/ai-feed`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${siteUrl}/api/llm/answers`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${siteUrl}/api/kb/feed`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
  ];

  // Get all articles (authoritative content)
  const [articles, hubs] = await Promise.all([
    contentManager.getAllArticles().catch(() => []),
    contentManager.getContentHubs().catch(() => []),
  ]);

  // Get AI-generated insight articles
  const supabase = createAdminClient();
  const { data: insightArticles } = await supabase
    .from('articles')
    .select('slug, date_published, date_modified, created_at')
    .eq('reviewed_by', 'AI Content Generator')
    .eq('status', 'published')
    .catch(() => ({ data: [] }));

  const hubRoutes: MetadataRoute.Sitemap = Array.isArray(hubs)
    ? hubs.map((hub: any) => ({
        url: `${siteUrl}/hub/${hub.slug}`,
        lastModified: hub.updated_at ? new Date(hub.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    : [];

  // 基于内容类型和新鲜度的智能优先级
  const articleRoutes: MetadataRoute.Sitemap = Array.isArray(articles)
    ? articles.map((article: any) => {
        // 内容类型优先级
        const typePriority: Record<string, number> = {
          'explainer': 0.8,  // 核心教育内容
          'howto': 0.75,     // 实用指南
          'faq': 0.7,        // 常见问题
          'research': 0.65,  // 研究内容
          'recipe': 0.6,     // 食谱
          'news': 0.55       // 新闻时效性内容
        };

        // 内容新鲜度调整
        const lastMod = article.date_modified || article.date_published;
        const daysSinceUpdate = lastMod
          ? Math.floor((Date.now() - new Date(lastMod).getTime()) / (1000 * 60 * 60 * 24))
          : 999;

        // 新鲜内容加权 (30天内+0.1, 90天内+0.05)
        const freshnessBonus = daysSinceUpdate < 30 ? 0.1 :
                               daysSinceUpdate < 90 ? 0.05 : 0;

        const basePriority = typePriority[article.type] || 0.5;
        const finalPriority = Math.min(0.95, basePriority + freshnessBonus);

        // 内容更新频率
        const changeFreq = daysSinceUpdate < 7 ? 'daily' :
                          daysSinceUpdate < 30 ? 'weekly' :
                          daysSinceUpdate < 90 ? 'monthly' : 'yearly';

        return {
          url: `${siteUrl}/${article.slug}`,
          lastModified: lastMod ? new Date(lastMod) : new Date(),
          changeFrequency: changeFreq as any,
          priority: finalPriority,
        };
      })
    : [];

  // Insight articles routes (AI-generated content)
  const insightRoutes: MetadataRoute.Sitemap = Array.isArray(insightArticles?.data)
    ? insightArticles.data.map((article: any) => {
        const lastMod = article.date_modified || article.date_published || article.created_at;
        const daysSinceUpdate = lastMod
          ? Math.floor((Date.now() - new Date(lastMod).getTime()) / (1000 * 60 * 60 * 24))
          : 999;

        // Insight articles are fresh content, higher priority
        const freshnessBonus = daysSinceUpdate < 30 ? 0.15 :
                               daysSinceUpdate < 90 ? 0.1 : 0.05;
        const finalPriority = Math.min(0.95, 0.85 + freshnessBonus);

        const changeFreq = daysSinceUpdate < 7 ? 'daily' :
                          daysSinceUpdate < 30 ? 'weekly' :
                          daysSinceUpdate < 90 ? 'monthly' : 'yearly';

        return {
          url: `${siteUrl}/insight/${article.slug}`,
          lastModified: lastMod ? new Date(lastMod) : new Date(),
          changeFrequency: changeFreq as any,
          priority: finalPriority,
        };
      })
    : [];

  return [...baseRoutes, ...hubRoutes, ...articleRoutes, ...insightRoutes];
}
