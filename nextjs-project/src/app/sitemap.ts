import { MetadataRoute } from 'next';
import { contentManager } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://jupitlunar.com';
  
  try {
    // 获取所有文章
    const articles = await contentManager.getAllArticles();
    
    // 获取所有内容中心
    const hubs = await contentManager.getContentHubs();
    
    // 静态页面
    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      },
    ];

    // 文章页面
    const articlePages = articles.map((article) => ({
      url: `${baseUrl}/${article.slug}`,
      lastModified: new Date(article.date_modified || article.date_published),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // 内容中心页面
    const hubPages = hubs.map((hub) => ({
      url: `${baseUrl}/hub/${hub.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // 按类型组织的文章页面
    const typePages = [
      { type: 'explainer', priority: 0.7 },
      { type: 'howto', priority: 0.7 },
      { type: 'research', priority: 0.7 },
      { type: 'faq', priority: 0.7 },
      { type: 'recipe', priority: 0.7 },
      { type: 'news', priority: 0.7 },
    ].map(({ type, priority }) => ({
      url: `${baseUrl}/${type}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority,
    }));

    // 按hub组织的文章页面
    const hubTypePages = hubs.flatMap((hub) =>
      typePages.map(({ type, priority }) => ({
        url: `${baseUrl}/${type}/${hub.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority,
      }))
    );

    return [
      ...staticPages,
      ...articlePages,
      ...hubPages,
      ...typePages,
      ...hubTypePages,
    ];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // 返回基本sitemap以防数据库错误
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
}
