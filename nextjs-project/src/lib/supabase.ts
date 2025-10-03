import { createClient } from '@supabase/supabase-js';
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
  KnowledgeSource
} from '@/types/content';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations
export const createAdminClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
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
    const { data, error } = await supabase
      .from('articles')
      .select('slug, hub, lang, type, date_published, date_modified')
      .eq('status', 'published')
      .order('date_published', { ascending: false });
    
    if (error) throw error;
    return data;
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
      .order('published_at', { ascending: false })
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
  }
};


// AI Feed functions for GEO optimization

export const aiFeedManager = {
  // Generate AI feed in NDJSON format
  async generateAIFeed(): Promise<AIFeedItem[]> {
    const { data: articles, error } = await supabase
      .from('articles')
      .select(`
        id, slug, title, one_liner, entities, date_modified, hub, type, lang,
        qas(question, answer),
        citations(url)
      `)
      .eq('status', 'published')
      .order('date_modified', { ascending: false });
    
    if (error) throw error;
    
    return articles.map(article => ({
      id: `${article.slug}-${article.id}`,
      url: `/${article.type}/${article.hub}/${article.slug}`,
      title: article.title,
      lang: article.lang,
      summary: article.one_liner,
      bullets: article.qas?.map(qa => qa.question) || [],
      entities: article.entities,
      citations: article.citations?.map(c => c.url) || [],
      date_modified: article.date_modified,
      hub: article.hub,
      type: article.type
    }));
  },

  // Generate LLM answers feed
  async generateLLMAnswers(): Promise<LLMAnswer[]> {
    const { data: qas, error } = await supabase
      .from('qas')
      .select(`
        question, answer, url, last_updated, lang,
        articles!inner(hub, type, slug)
      `)
      .order('last_updated', { ascending: false });
    
    if (error) throw error;
    
    return qas.map(qa => {
      const article = qa.articles as any; // Type assertion for nested select
      return {
        q: qa.question,
        a: qa.answer,
        url: `/${article.type}/${article.hub}/${article.slug}${qa.url || ''}`,
        citations: [], // Could be enhanced to include citations
        last_updated: qa.last_updated,
        lang: qa.lang,
        hub: article.hub,
        type: article.type
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

export default supabase;
