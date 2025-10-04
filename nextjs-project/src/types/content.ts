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

// AI Feed Types with AEO optimization
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

  // AEO-enhanced fields
  trustworthiness_score: number; // 0-1 scale, based on source quality
  evidence_level: 'A' | 'B' | 'C'; // Evidence strength classification
  source_quality: 'government' | 'curated' | 'community';
  last_verified: string; // ISO date when content sources were last checked
  freshness_days: number; // Days since last review
  key_takeaways: string[]; // TL;DR bullets for LLMs
  citation_count: number;
  primary_sources: string[]; // e.g., ["CDC", "AAP"]
  beginner_friendly: boolean;
  content_category: string; // e.g., "health_education"
}

// LLM Answers Types with AEO optimization
export interface LLMAnswer {
  q: string;
  a: string;
  url: string;
  citations: string[];
  last_updated: string;
  lang: Language;
  hub: ContentHub;
  type: ContentType;

  // AEO-enhanced fields
  trustworthiness_score: number;
  evidence_level: 'A' | 'B' | 'C';
  source_quality: 'government' | 'curated' | 'community';
  last_verified: string;
  freshness_days: number;
  primary_sources: string[];
  beginner_friendly: boolean;
  answer_type: string; // e.g., "expert_curated"
  disclaimer: string; // Legal/medical disclaimer
}

// Knowledge base shared types
export type RiskLevel = 'none' | 'low' | 'medium' | 'high';
export type KnowledgeStatus = 'draft' | 'published' | 'archived';
export type SourceGrade = 'A' | 'B' | 'C' | 'D';
export type KnowledgeLocale = Region;

export interface MediaAsset {
  url: string;
  alt?: string;
  type?: 'image' | 'video';
  caption?: string;
}

export interface ServingForm {
  age_range: string;
  form: string;
  texture?: string;
  prep?: string;
  notes?: string;
}

export interface KnowledgeAction {
  title: string;
  description?: string;
  step?: number;
}

export interface KnowledgeChecklistItem {
  label: string;
  detail?: string;
  type?: 'tip' | 'action' | 'warning';
}

export interface KnowledgeSource {
  id: string;
  name: string;
  organization?: string;
  url: string;
  grade: SourceGrade;
  retrieved_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeRule {
  id: string;
  slug: string;
  title: string;
  locale: KnowledgeLocale;
  category: string;
  risk_level: RiskLevel;
  summary?: string;
  do_list: string[];
  dont_list: string[];
  why?: string;
  how_to: KnowledgeAction[];
  compliance_notes?: string;
  source_ids: string[];
  reviewed_by?: string;
  last_reviewed_at?: string;
  expires_at?: string;
  status: KnowledgeStatus;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeFood {
  id: string;
  slug: string;
  name: string;
  locale: KnowledgeLocale;
  age_range: string[];
  feeding_methods: string[];
  serving_forms: ServingForm[];
  risk_level: RiskLevel;
  nutrients_focus: string[];
  do_list: string[];
  dont_list: string[];
  why?: string;
  how_to: KnowledgeAction[];
  portion_hint?: string;
  media: MediaAsset[];
  source_ids: string[];
  reviewed_by?: string;
  last_reviewed_at?: string;
  expires_at?: string;
  status: KnowledgeStatus;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeGuide {
  id: string;
  slug: string;
  title: string;
  locale: KnowledgeLocale;
  guide_type: 'framework' | 'scenario' | 'nutrition' | 'allergen' | 'pathway' | 'other';
  age_range: string[];
  summary?: string;
  body_md?: string;
  checklist: KnowledgeChecklistItem[];
  related_food_ids: string[];
  related_rule_ids: string[];
  source_ids: string[];
  reviewed_by?: string;
  last_reviewed_at?: string;
  expires_at?: string;
  status: KnowledgeStatus;
  created_at: string;
  updated_at: string;
}

export type FAQCategory = 'feeding' | 'sleep' | 'health-safety' | 'development' | 'behavior' | 'daily-care';

export interface KnowledgeFAQ {
  id: string;
  slug: string;
  question: string;
  answer: string; // Markdown
  answer_html?: string; // Pre-rendered HTML
  category: FAQCategory;
  subcategory?: string;
  age_range: string[];
  locale: KnowledgeLocale;
  source_ids: string[];
  related_food_ids: string[];
  related_rule_ids: string[];
  related_guide_ids: string[];
  related_topic_slugs: string[];
  priority: number; // Lower = higher priority
  views_count: number;
  helpful_count: number;
  last_reviewed_at?: string;
  expires_at?: string;
  status: KnowledgeStatus;
  created_at: string;
  updated_at: string;
  // Joined data
  kb_sources?: KnowledgeSource[];
}
