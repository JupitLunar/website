// Content Hub Types
export type ContentHub = 'feeding' | 'sleep' | 'mom-health' | 'development' | 'safety' | 'recipes';

// Content Type Types
export type ContentType = 'explainer' | 'howto' | 'research' | 'faq' | 'recipe' | 'news';

// Language Types
export type Language = 'en' | 'zh';

// Region Types
export type Region = 'US' | 'CA' | 'Global';

// Content Status
export type ContentStatus = 'draft' | 'published' | 'archived';

// Base Content Interface
export interface BaseContent {
  id: string;
  slug: string;
  type: ContentType;
  hub: ContentHub;
  lang: Language;
  
  // Basic Information
  title: string;
  one_liner: string; // TL;DR 50-200 characters
  key_facts: string[]; // 3-8 key takeaways
  
  // Metadata
  age_range?: string;
  region: Region;
  last_reviewed: string; // YYYY-MM-DD format
  reviewed_by: string; // E-E-A-T signal
  date_published: string; // ISO 8601 format
  date_modified: string; // ISO 8601 format
  
  // Content
  body_md?: string; // Main content in Markdown
  entities: string[]; // SEO/GEO entities
  
  // References
  citations: Citation[];
  
  // Media
  images?: Image[];
  
  // License
  license: string;
  
  // SEO/GEO fields
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
  
  // Status
  status: ContentStatus;
}

// How-To Content Interface
export interface HowToContent extends BaseContent {
  type: 'howto';
  steps: HowToStep[];
  tools?: string[];
  supplies?: string[];
  time_required?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// Recipe Content Interface
export interface RecipeContent extends BaseContent {
  type: 'recipe';
  ingredients: Ingredient[];
  steps: RecipeStep[];
  nutrition?: NutritionInfo;
  cooking_time: string;
  servings: number;
}

// FAQ Content Interface
export interface FAQContent extends BaseContent {
  type: 'faq';
  faq_items: FAQItem[];
}

// Supporting Interfaces
export interface Citation {
  claim?: string;
  title: string;
  url: string;
  author?: string;
  publisher?: string;
  date?: string;
}

export interface Image {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  firebase_path?: string;
}

export interface HowToStep {
  step_number: number;
  title: string;
  description: string;
  time_required?: string;
  image_url?: string;
}

export interface RecipeStep {
  step_number: number;
  title: string;
  description: string;
  time_required?: string;
}

export interface Ingredient {
  name: string;
  amount: string;
  unit?: string;
  notes?: string;
}

export interface NutritionInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
}

export interface FAQItem {
  question: string;
  answer: string;
  url?: string; // Anchor link
}

// Content Bundle for API Ingestion
export interface ContentBundle {
  slug: string;
  type: ContentType;
  hub: ContentHub;
  lang?: Language;
  title: string;
  one_liner: string;
  key_facts: string[];
  age_range?: string;
  region?: Region;
  last_reviewed: string;
  reviewed_by: string;
  entities: string[];
  license?: string;
  body_md?: string;
  steps?: HowToStep[];
  faq?: FAQItem[];
  citations?: Citation[];
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
}

// Hub Information
export interface HubInfo {
  id: ContentHub;
  name: string;
  description: string;
  color: string;
  icon: string;
  slug: string;
  content_count?: number;
}

// API Response Types
export interface IngestResponse {
  status: 'success' | 'error' | 'partial';
  batch_id: string;
  results: {
    total: number;
    successful: number;
    failed: number;
    errors: Array<{
      slug: string;
      error: string;
    }>;
  };
  timestamp: string;
}

export interface IngestError {
  error: string;
  message?: string;
  timestamp: string;
}

// Search and Filter Types
export interface ContentFilter {
  hub?: ContentHub;
  type?: ContentType;
  lang?: Language;
  region?: Region;
  status?: ContentStatus;
  age_range?: string;
  reviewed_by?: string;
  date_from?: string;
  date_to?: string;
}

export interface SearchQuery {
  query: string;
  filters?: ContentFilter;
  limit?: number;
  offset?: number;
  sort_by?: 'date_published' | 'date_modified' | 'title' | 'hub';
  sort_order?: 'asc' | 'desc';
}

// Pagination Types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// Content Statistics
export interface ContentStats {
  total_articles: number;
  articles_by_hub: Record<ContentHub, number>;
  articles_by_type: Record<ContentType, number>;
  articles_by_lang: Record<Language, number>;
  articles_by_status: Record<ContentStatus, number>;
  recent_articles: number; // Last 7 days
  total_citations: number;
  total_faq_items: number;
}

// Content Update Types
export interface ContentUpdate {
  slug: string;
  updates: Partial<Omit<ContentBundle, 'slug'>>;
  reason?: string;
  updated_by?: string;
}

// Content Validation Types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Content Export Types
export interface ContentExport {
  format: 'json' | 'ndjson' | 'csv';
  filters?: ContentFilter;
  include_related?: boolean;
  fields?: (keyof BaseContent)[];
}

// AI Feed Types
export interface AIFeedItem {
  id: string;
  url: string;
  title: string;
  lang: Language;
  summary: string;
  bullets: string[];
  entities: string[];
  citations: string[];
  date_modified: string;
  hub: ContentHub;
  type: ContentType;
}

// LLM Answers Types
export interface LLMAnswer {
  q: string;
  a: string;
  url: string;
  citations: string[];
  last_updated: string;
  lang: Language;
  hub: ContentHub;
  type: ContentType;
}
