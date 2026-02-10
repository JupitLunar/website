import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { clientCache, cacheKeys, withCache } from './cache';
import type {
  ContentHub,
  ContentType,
  Language,
  ContentStatus,
  ContentFilter,
  SearchQuery,
  PaginatedResponse,
  ContentStats,
  AIFeedItem,
  LLMAnswer,
  ContentBundle,
  KnowledgeLocale,
  KnowledgeRule,
  KnowledgeFood,
  KnowledgeGuide,
  KnowledgeSource,
  KnowledgeFAQ
} from '@/types/content';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
type AppSupabaseClient = SupabaseClient<any, 'public', any>;
let cachedSupabaseClient: AppSupabaseClient | null = null;

function getSupabaseClient() {
  if (cachedSupabaseClient) return cachedSupabaseClient;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }
  cachedSupabaseClient = createClient(supabaseUrl, supabaseAnonKey) as AppSupabaseClient;
  return cachedSupabaseClient;
}

// Avoid build-time crashes when routes/pages import this module without Supabase envs.
// The error is raised only when code actually tries to query Supabase.
export const supabase = new Proxy({} as AppSupabaseClient, {
  get(_target, prop, receiver) {
    const client = getSupabaseClient();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === 'function' ? value.bind(client) : value;
  }
});

// Helper: Filter out AEO metadata from keywords array
// AEO data is stored with __AEO_ prefix and should be excluded from public display
export function filterCleanKeywords(keywords: string[] | null | undefined): string[] {
  if (!keywords || !Array.isArray(keywords)) return [];
  return keywords.filter(k => !k.startsWith('__AEO_'));
}

// Admin client for server-side operations
export const createAdminClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase service role key');
  }

  return createClient(supabaseUrl, serviceRoleKey);
};

// Content management functions
export const contentManager = {
  // Get all articles for a specific hub
  async getHubArticles(hub: ContentHub, lang: Language = 'en', limit: number = 20) {
    const cacheKey = cacheKeys.articles({ hub, lang, limit });
    const cached = clientCache.get(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        qas(*),
        citations(*),
        how_to_steps(*),
        recipe_ingredients(*),
        recipe_steps(*)
      `)
      .eq('hub', hub)
      .eq('lang', lang)
      .eq('status', 'published')
      .neq('reviewed_by', 'AI Content Generator')  // Exclude AI-generated articles
      .order('date_published', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // 缓存5分钟
    clientCache.set(cacheKey, data, 5 * 60 * 1000);
    return data;
  },

  // Get a single article by slug
  async getArticle(slug: string, lang: Language = 'en') {
    const cacheKey = cacheKeys.article(slug);
    const cached = clientCache.get(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        qas(*),
        citations(*),
        how_to_steps(*),
        recipe_ingredients(*),
        recipe_steps(*)
      `)
      .eq('slug', slug)
      .eq('lang', lang)
      .eq('status', 'published')
      .neq('reviewed_by', 'AI Content Generator')  // Exclude AI-generated articles
      .single();

    if (error) {
      if ((error as any).code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    if (!data) return null;

    // 缓存10分钟
    clientCache.set(cacheKey, data, 10 * 60 * 1000);
    return data;
  },

  // Get article by slug (alias for getArticle)
  async getArticleBySlug(slug: string, lang: Language = 'en') {
    return this.getArticle(slug, lang);
  },

  // Get content hub by slug
  async getContentHubBySlug(slug: string) {
    const { data, error } = await supabase
      .from('content_hubs')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if ((error as any).code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  },



  // Get all articles for static generation
  async getAllArticles() {
    // Query all published articles, then filter in code for reliability
    // Note: article_source field may not exist in all databases, so we select it but handle gracefully
    const { data, error } = await supabase
      .from('articles')
      .select('slug, hub, lang, type, date_published, date_modified, reviewed_by')
      .eq('status', 'published')
      .neq('reviewed_by', 'AI Content Generator')  // Primary filter using reviewed_by
      .order('date_published', { ascending: false });

    if (error) throw error;

    // Additional filtering in code: exclude articles with article_source='ai_generated' if field exists
    // For now, we rely on reviewed_by filter above since article_source may not exist
    return (data || []).filter((article: any) =>
      article.reviewed_by !== 'AI Content Generator'
    );
  },

  async getArticlesPublishedSince(isoDate: string, limit: number = 100) {
    const { data, error } = await supabase
      .from('articles')
      .select('slug, title, hub, lang, type, date_published, date_modified, one_liner')
      .eq('status', 'published')
      .gte('date_published', isoDate)
      .order('date_published', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async getArticlesForFeed(limit: number = 25) {
    const { data, error } = await supabase
      .from('articles')
      .select('slug, title, one_liner, body_md, entities, hub, lang, date_published, date_modified')
      .eq('status', 'published')
      .order('date_published', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  // Get articles by type
  async getArticlesByType(type: ContentType, limit: number = 10) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('type', type)
      .eq('status', 'published')
      .order('date_published', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Search articles with filters
  async searchArticles(query: SearchQuery): Promise<PaginatedResponse<any>> {
    const { query: searchQuery, filters, limit = 20, offset = 0, sort_by = 'date_published', sort_order = 'desc' } = query;

    let queryBuilder = supabase
      .from('articles')
      .select('*', { count: 'exact' })
      .eq('status', 'published');

    // Apply text search using generated search vector
    if (searchQuery) {
      queryBuilder = queryBuilder.textSearch('search_vector', searchQuery);
    }

    // Apply filters
    if (filters) {
      if (filters.hub) queryBuilder = queryBuilder.eq('hub', filters.hub);
      if (filters.type) queryBuilder = queryBuilder.eq('type', filters.type);
      if (filters.lang) queryBuilder = queryBuilder.eq('lang', filters.lang);
      if (filters.region) queryBuilder = queryBuilder.eq('region', filters.region);
      if (filters.age_range) queryBuilder = queryBuilder.eq('age_range', filters.age_range);
      if (filters.reviewed_by) queryBuilder = queryBuilder.eq('reviewed_by', filters.reviewed_by);
      if (filters.date_from) queryBuilder = queryBuilder.gte('date_published', filters.date_from);
      if (filters.date_to) queryBuilder = queryBuilder.lte('date_published', filters.date_to);
    }

    // Apply sorting and pagination
    queryBuilder = queryBuilder
      .order(sort_by, { ascending: sort_order === 'asc' })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await queryBuilder;

    if (error) throw error;

    const total = count || 0;
    const total_pages = Math.ceil(total / limit);
    const page = Math.floor(offset / limit) + 1;

    return {
      data: data || [],
      pagination: {
        page,
        limit,
        total,
        total_pages,
        has_next: page < total_pages,
        has_prev: page > 1
      }
    };
  },

  // Get content statistics
  async getContentStats(): Promise<ContentStats> {
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('hub, type, lang, status, date_published');

    if (articlesError) throw articlesError;

    const { count: citationsCount, error: citationsError } = await supabase
      .from('citations')
      .select('*', { count: 'exact', head: true });

    if (citationsError) throw citationsError;

    const { count: faqCount, error: faqError } = await supabase
      .from('qas')
      .select('*', { count: 'exact', head: true });

    if (faqError) throw faqError;

    const stats: ContentStats = {
      total_articles: articles.length,
      articles_by_hub: {
        feeding: 0, sleep: 0, 'mom-health': 0, development: 0, safety: 0, recipes: 0
      },
      articles_by_type: {
        explainer: 0, howto: 0, research: 0, faq: 0, recipe: 0, news: 0
      },
      articles_by_lang: { en: 0, zh: 0 },
      articles_by_status: { draft: 0, published: 0, archived: 0 },
      recent_articles: 0,
      total_citations: citationsCount || 0,
      total_faq_items: faqCount || 0
    };

    // Calculate statistics
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    articles.forEach(article => {
      if (article.hub && article.hub in stats.articles_by_hub) {
        stats.articles_by_hub[article.hub as ContentHub]++;
      }
      if (article.type && article.type in stats.articles_by_type) {
        stats.articles_by_type[article.type as ContentType]++;
      }
      if (article.lang && article.lang in stats.articles_by_lang) {
        stats.articles_by_lang[article.lang as Language]++;
      }
      if (article.status && article.status in stats.articles_by_status) {
        stats.articles_by_status[article.status as ContentStatus]++;
      }

      if (new Date(article.date_published) >= sevenDaysAgo) {
        stats.recent_articles++;
      }
    });

    return stats;
  },

  // Get content hubs with article counts
  async getContentHubs() {
    const cacheKey = cacheKeys.hubs();
    const cached = clientCache.get(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
      .from('content_hubs')
      .select('*')
      .order('id');

    if (error) throw error;

    // 缓存30分钟（内容中心很少变化）
    clientCache.set(cacheKey, data, 30 * 60 * 1000);
    return data;
  },

  // Get recent articles
  async getRecentArticles(limit: number = 10) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .order('date_published', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Get related articles (enhanced version)
  async getRelatedArticles(articleId: string, hub?: string, limit: number = 5) {
    const { data: currentArticle, error: currentError } = await supabase
      .from('articles')
      .select('hub, type, entities')
      .eq('id', articleId)
      .single();

    if (currentError) {
      if ((currentError as any).code === 'PGRST116') {
        return [];
      }
      throw currentError;
    }

    let queryBuilder = supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .neq('id', articleId);

    // If hub is provided, prioritize it, otherwise use current article's hub
    const targetHub = hub || currentArticle.hub;
    queryBuilder = queryBuilder.eq('hub', targetHub);

    const { data, error } = await queryBuilder
      .order('date_published', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }
};

// Knowledge base accessors
export const knowledgeBase = {
  async getSources(ids?: string[]): Promise<KnowledgeSource[]> {
    if (!ids || ids.length === 0) {
      const cachedAll = clientCache.get(cacheKeys.kbSources());
      if (cachedAll) return cachedAll as KnowledgeSource[];

      const { data, error } = await supabase
        .from('kb_sources')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      if (data) {
        data.forEach((source) => {
          clientCache.set(cacheKeys.kbSource(source.id), source, 60 * 60 * 1000);
        });
        clientCache.set(cacheKeys.kbSources(), data, 60 * 60 * 1000);
      }

      return (data || []) as KnowledgeSource[];
    }

    const uniqueIds = Array.from(new Set(ids));
    const results: KnowledgeSource[] = [];
    const missing: string[] = [];

    uniqueIds.forEach((id) => {
      const cached = clientCache.get(cacheKeys.kbSource(id));
      if (cached) {
        results.push(cached as KnowledgeSource);
      } else {
        missing.push(id);
      }
    });

    if (missing.length > 0) {
      const { data, error } = await supabase
        .from('kb_sources')
        .select('*')
        .in('id', missing);

      if (error) throw error;

      data?.forEach((source) => {
        clientCache.set(cacheKeys.kbSource(source.id), source, 60 * 60 * 1000);
        results.push(source as KnowledgeSource);
      });
    }

    // Maintain the order of requested IDs when returning
    const map = new Map(results.map((item) => [item.id, item]));
    return uniqueIds
      .map((id) => map.get(id))
      .filter((item): item is KnowledgeSource => Boolean(item));
  },

  async getSourcesMap(ids?: string[]): Promise<Map<string, KnowledgeSource>> {
    const sources = await this.getSources(ids);
    return new Map(sources.map((source) => [source.id, source]));
  },
  async getRules(locale?: KnowledgeLocale): Promise<KnowledgeRule[]> {
    const cacheKey = cacheKeys.kbRules(locale);
    const cached = clientCache.get(cacheKey);
    if (cached) return cached;

    let query = supabase
      .from('kb_rules')
      .select('*')
      .eq('status', 'published')
      .order('title', { ascending: true });

    if (locale) {
      if (locale === 'Global') {
        query = query.eq('locale', 'Global');
      } else {
        query = query.in('locale', [locale, 'Global']);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    clientCache.set(cacheKey, data, 15 * 60 * 1000);
    return data as KnowledgeRule[];
  },

  async getRuleBySlug(slug: string): Promise<KnowledgeRule | null> {
    const cacheKey = cacheKeys.kbRule(slug);
    const cached = clientCache.get(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
      .from('kb_rules')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      if ((error as any).code === 'PGRST116') return null;
      throw error;
    }

    if (data) {
      clientCache.set(cacheKey, data, 30 * 60 * 1000);
    }
    return data as KnowledgeRule | null;
  },

  async getFoods(locale?: KnowledgeLocale): Promise<KnowledgeFood[]> {
    const cacheKey = cacheKeys.kbFoods(locale);
    const cached = clientCache.get(cacheKey);
    if (cached) return cached;

    let query = supabase
      .from('kb_foods')
      .select('*')
      .eq('status', 'published')
      .order('name', { ascending: true });

    if (locale) {
      if (locale === 'Global') {
        query = query.eq('locale', 'Global');
      } else {
        query = query.in('locale', [locale, 'Global']);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    clientCache.set(cacheKey, data, 15 * 60 * 1000);
    return data as KnowledgeFood[];
  },

  async getFoodBySlug(slug: string): Promise<KnowledgeFood | null> {
    const cacheKey = cacheKeys.kbFood(slug);
    const cached = clientCache.get(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
      .from('kb_foods')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      if ((error as any).code === 'PGRST116') return null;
      throw error;
    }

    if (data) {
      clientCache.set(cacheKey, data, 30 * 60 * 1000);
    }
    return data as KnowledgeFood | null;
  },

  async getGuides(filters?: { locale?: KnowledgeLocale; guideType?: KnowledgeGuide['guide_type'] }): Promise<KnowledgeGuide[]> {
    const locale = filters?.locale;
    const guideType = filters?.guideType;
    const cacheKey = cacheKeys.kbGuides(locale, guideType);
    const cached = clientCache.get(cacheKey);
    if (cached) return cached;

    let query = supabase
      .from('kb_guides')
      .select('*')
      .eq('status', 'published')
      .order('title', { ascending: true });

    if (locale) {
      if (locale === 'Global') {
        query = query.eq('locale', 'Global');
      } else {
        query = query.in('locale', [locale, 'Global']);
      }
    }

    if (guideType) {
      query = query.eq('guide_type', guideType);
    }

    const { data, error } = await query;

    if (error) throw error;

    clientCache.set(cacheKey, data, 15 * 60 * 1000);
    return data as KnowledgeGuide[];
  },

  async getGuideBySlug(slug: string): Promise<KnowledgeGuide | null> {
    const cacheKey = cacheKeys.kbGuide(slug);
    const cached = clientCache.get(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
      .from('kb_guides')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      if ((error as any).code === 'PGRST116') return null;
      throw error;
    }

    if (data) {
      clientCache.set(cacheKey, data, 30 * 60 * 1000);
    }
    return data as KnowledgeGuide | null;
  },

  // FAQ functions
  async getFAQs(filters?: {
    category?: string;
    locale?: KnowledgeLocale;
    topicSlug?: string;
    foodId?: string;
  }): Promise<KnowledgeFAQ[]> {
    const { category, locale, topicSlug, foodId } = filters || {};
    const cacheKey = `faqs-${category || 'all'}-${locale || 'all'}-${topicSlug || 'all'}-${foodId || 'all'}`;
    const cached = clientCache.get(cacheKey);
    if (cached) return cached;

    let query = supabase
      .from('kb_faqs')
      .select('*')
      .eq('status', 'published')
      .order('priority', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    if (locale) {
      if (locale === 'Global') {
        query = query.eq('locale', 'Global');
      } else {
        query = query.in('locale', [locale, 'Global']);
      }
    }

    if (topicSlug) {
      query = query.contains('related_topic_slugs', [topicSlug]);
    }

    if (foodId) {
      query = query.contains('related_food_ids', [foodId]);
    }

    const { data, error } = await query;

    if (error) throw error;

    clientCache.set(cacheKey, data, 15 * 60 * 1000);
    return data as KnowledgeFAQ[];
  },

  async getFAQBySlug(slug: string): Promise<KnowledgeFAQ | null> {
    const cacheKey = `faq-${slug}`;
    const cached = clientCache.get(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
      .from('kb_faqs')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      if ((error as any).code === 'PGRST116') return null;
      throw error;
    }

    if (data) {
      clientCache.set(cacheKey, data, 30 * 60 * 1000);
    }
    return data as KnowledgeFAQ | null;
  },

  // Get FAQs with source details joined
  async getFAQsWithSources(filters?: {
    category?: string;
    locale?: KnowledgeLocale;
    topicSlug?: string;
  }): Promise<Array<{ faq: KnowledgeFAQ; sources: KnowledgeSource[] }>> {
    const faqs = await this.getFAQs(filters);
    const sourceMap = await this.getSourcesMap();

    return faqs.map((faq) => ({
      faq,
      sources: faq.source_ids
        .map((id: string) => sourceMap.get(id))
        .filter(Boolean) as KnowledgeSource[],
    }));
  }
};


// AI Feed functions for GEO optimization

export const aiFeedManager = {
  // Generate AI feed in NDJSON format with AEO-optimized metadata
  async generateAIFeed(): Promise<AIFeedItem[]> {
    const { data: articles, error } = await supabase
      .from('articles')
      .select(`
        id, slug, title, one_liner, entities, date_modified, hub, type, lang,
        last_reviewed, key_facts, date_published,
        qas(question, answer),
        citations(url, publisher, title)
      `)
      .eq('status', 'published')
      .order('date_modified', { ascending: false });

    if (error) throw error;

    return articles.map(article => {
      // 计算可信度分数 (基于引用来源质量)
      const citationCount = article.citations?.length || 0;
      const hasGovernmentSource = article.citations?.some(c =>
        ['CDC', 'AAP', 'Health Canada', 'FDA', 'NIH'].some(org =>
          c.publisher?.includes(org)
        )
      ) || false;

      const trustworthiness = Math.min(0.95,
        0.5 + // 基础分
        (hasGovernmentSource ? 0.3 : 0) + // 政府来源加成
        (citationCount * 0.05) // 每个引用+0.05
      );

      // 判断证据等级
      const evidenceLevel = hasGovernmentSource && citationCount >= 3 ? 'A' :
        citationCount >= 2 ? 'B' : 'C';

      // 内容新鲜度（天数）
      const lastReviewedDate = article.last_reviewed || article.date_modified;
      const daysSinceReview = lastReviewedDate ?
        Math.floor((Date.now() - new Date(lastReviewedDate).getTime()) / (1000 * 60 * 60 * 24)) :
        999;

      return {
        id: `${article.slug}-${article.id}`,
        url: `/insight/${article.slug}`,
        title: article.title,
        lang: article.lang,
        summary: article.one_liner,
        bullets: article.qas?.map(qa => qa.question) || [],
        entities: article.entities,
        citations: article.citations?.map(c => c.url) || [],
        date_modified: article.date_modified,
        hub: article.hub,
        type: article.type,

        // AEO增强字段
        trustworthiness_score: parseFloat(trustworthiness.toFixed(2)),
        evidence_level: evidenceLevel,
        source_quality: hasGovernmentSource ? 'government' : 'curated',
        last_verified: lastReviewedDate,
        freshness_days: daysSinceReview,
        key_takeaways: article.key_facts || [],
        citation_count: citationCount,
        primary_sources: article.citations?.map(c => c.publisher).filter(Boolean) || [],
        beginner_friendly: true,
        content_category: 'health_education'
      };
    });
  },

  // Generate LLM answers feed with enhanced metadata
  async generateLLMAnswers(): Promise<LLMAnswer[]> {
    const { data: qas, error } = await supabase
      .from('qas')
      .select(`
        question, answer, url, last_updated, lang,
        articles!inner(
          hub, type, slug, last_reviewed, date_modified,
          citations(url, publisher, title)
        )
      `)
      .order('last_updated', { ascending: false });

    if (error) throw error;

    return qas.map(qa => {
      const article = qa.articles as any;
      const citations = article.citations || [];

      // 计算可信度
      const citationCount = citations.length;
      const hasGovernmentSource = citations.some((c: any) =>
        ['CDC', 'AAP', 'Health Canada', 'FDA', 'NIH'].some(org =>
          c.publisher?.includes(org)
        )
      );

      const trustworthiness = Math.min(0.95,
        0.5 +
        (hasGovernmentSource ? 0.3 : 0) +
        (citationCount * 0.05)
      );

      const evidenceLevel = hasGovernmentSource && citationCount >= 3 ? 'A' :
        citationCount >= 2 ? 'B' : 'C';

      // 新鲜度
      const lastReviewed = article.last_reviewed || qa.last_updated;
      const daysSinceReview = lastReviewed ?
        Math.floor((Date.now() - new Date(lastReviewed).getTime()) / (1000 * 60 * 60 * 24)) :
        999;

      return {
        q: qa.question,
        a: qa.answer,
        url: `/${article.type}/${article.hub}/${article.slug}${qa.url || ''}`,
        citations: citations.map((c: any) => c.url).filter(Boolean),
        last_updated: qa.last_updated,
        lang: qa.lang,
        hub: article.hub,
        type: article.type,

        // AEO增强字段
        trustworthiness_score: parseFloat(trustworthiness.toFixed(2)),
        evidence_level: evidenceLevel,
        source_quality: hasGovernmentSource ? 'government' : 'curated',
        last_verified: lastReviewed,
        freshness_days: daysSinceReview,
        primary_sources: citations.map((c: any) => c.publisher).filter(Boolean),
        beginner_friendly: true,
        answer_type: 'expert_curated',
        disclaimer: 'Educational content based on official health guidelines. Consult your pediatrician for personalized advice.'
      };
    });
  }
};

// Newsletter and waitlist functions
export const userManager = {
  // Subscribe to newsletter
  async subscribeToNewsletter(email: string) {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .upsert({ email }, { onConflict: 'email' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Join waitlist
  async joinWaitlist(email: string) {
    const { data, error } = await supabase
      .from('waitlist_users')
      .upsert({ email }, { onConflict: 'email' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Submit feedback
  async submitFeedback(email: string, message: string, category?: string) {
    const { data, error } = await supabase
      .from('user_feedback')
      .insert({ email, message, category })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Content ingestion functions (admin only)
export const ingestionManager = {
  // Ingest content bundle using RPC function
  async ingestContentBundle(contentBundle: ContentBundle) {
    const adminSupabase = createAdminClient();

    const { data, error } = await adminSupabase.rpc('upsert_article_bundle', {
      p_slug: contentBundle.slug,
      p_type: contentBundle.type,
      p_hub: contentBundle.hub,
      p_lang: contentBundle.lang || 'en',
      p_title: contentBundle.title,
      p_one_liner: contentBundle.one_liner,
      p_key_facts: contentBundle.key_facts,
      p_age_range: contentBundle.age_range,
      p_region: contentBundle.region || 'Global',
      p_last_reviewed: contentBundle.last_reviewed,
      p_reviewed_by: contentBundle.reviewed_by,
      p_entities: contentBundle.entities,
      p_license: contentBundle.license || 'CC BY-NC 4.0',
      p_body_md: contentBundle.body_md,
      p_steps: contentBundle.steps,
      p_faq: contentBundle.faq,
      p_citations: contentBundle.citations,
      p_meta_title: contentBundle.meta_title,
      p_meta_description: contentBundle.meta_description,
      p_keywords: contentBundle.keywords
    });

    if (error) throw error;
    return data;
  },

  // Get ingestion logs
  async getIngestionLogs(batchId?: string, limit: number = 100) {
    const adminSupabase = createAdminClient();

    let query = adminSupabase
      .from('ingestion_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (batchId) {
      query = query.eq('batch_id', batchId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }
};

// Food database functions
export interface FoodFilters {
  ageRange?: string; // e.g., "6m+", "9m+", "12m+"
  riskLevel?: string[]; // ['none', 'low', 'medium', 'high']
  feedingMethods?: string[]; // ['BLW', 'puree', 'both']
  allergens?: string[]; // Filter by allergen presence
  nutrients?: string[]; // ['iron-rich', 'vitamin C', etc.]
  searchQuery?: string;
}

export const foodManager = {
  // Get all foods with optional filters
  async getFoods(filters?: FoodFilters, limit: number = 50, offset: number = 0) {
    let query = supabase
      .from('kb_foods')
      .select('*')
      .eq('status', 'published');

    // Apply filters
    if (filters?.ageRange) {
      query = query.contains('age_range', [filters.ageRange]);
    }

    if (filters?.riskLevel && filters.riskLevel.length > 0) {
      query = query.in('risk_level', filters.riskLevel);
    }

    if (filters?.feedingMethods && filters.feedingMethods.length > 0) {
      query = query.overlaps('feeding_methods', filters.feedingMethods);
    }

    if (filters?.nutrients && filters.nutrients.length > 0) {
      query = query.overlaps('nutrients_focus', filters.nutrients);
    }

    if (filters?.searchQuery) {
      query = query.ilike('name', `%${filters.searchQuery}%`);
    }

    query = query
      .order('name', { ascending: true })
      .range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  // Get single food by slug
  async getFoodBySlug(slug: string) {
    const { data, error } = await supabase
      .from('kb_foods')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      if ((error as any).code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    if (data && data.source_ids && data.source_ids.length > 0) {
      try {
        const sources = await knowledgeBase.getSources(data.source_ids);
        data.kb_sources = sources;
      } catch (err) {
        console.error('Error fetching sources for food:', err);
        data.kb_sources = [];
      }
    } else {
      data.kb_sources = [];
    }

    return data;
  },

  // Search foods by name
  async searchFoods(query: string, limit: number = 20) {
    const { data, error } = await supabase
      .from('kb_foods')
      .select('id, slug, name, age_range, risk_level, nutrients_focus')
      .eq('status', 'published')
      .ilike('name', `%${query}%`)
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Get related foods (same age range or similar nutrients)
  async getRelatedFoods(foodId: string, limit: number = 6) {
    // First get the current food
    const { data: currentFood, error: currentError } = await supabase
      .from('kb_foods')
      .select('age_range, nutrients_focus')
      .eq('id', foodId)
      .single();

    if (currentError) throw currentError;
    if (!currentFood) return [];

    // Find foods with overlapping age ranges or nutrients
    const { data, error } = await supabase
      .from('kb_foods')
      .select('*')
      .eq('status', 'published')
      .neq('id', foodId)
      .limit(limit);

    if (error) throw error;

    // Sort by relevance (foods with more overlapping attributes)
    return (data || []).sort((a, b) => {
      const aOverlap = (
        (a.age_range?.filter((age: string) => currentFood.age_range?.includes(age))?.length || 0) +
        (a.nutrients_focus?.filter((nut: string) => currentFood.nutrients_focus?.includes(nut))?.length || 0)
      );
      const bOverlap = (
        (b.age_range?.filter((age: string) => currentFood.age_range?.includes(age))?.length || 0) +
        (b.nutrients_focus?.filter((nut: string) => currentFood.nutrients_focus?.includes(nut))?.length || 0)
      );
      return bOverlap - aOverlap;
    }).slice(0, limit);
  },

  // Get food count by filters (for pagination)
  async getFoodCount(filters?: FoodFilters): Promise<number> {
    let query = supabase
      .from('kb_foods')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'published');

    if (filters?.ageRange) {
      query = query.contains('age_range', [filters.ageRange]);
    }

    if (filters?.riskLevel && filters.riskLevel.length > 0) {
      query = query.in('risk_level', filters.riskLevel);
    }

    if (filters?.searchQuery) {
      query = query.ilike('name', `%${filters.searchQuery}%`);
    }

    const { count, error } = await query;

    if (error) throw error;
    return count || 0;
  }
};

export default supabase;
