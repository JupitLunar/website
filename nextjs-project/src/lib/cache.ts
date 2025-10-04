// 客户端缓存管理工具
export class ClientCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    // 如果缓存已满，删除最旧的条目
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // 检查是否过期
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // 清理过期的缓存条目
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// 全局缓存实例
export const clientCache = new ClientCache();

// 缓存键生成器
export const cacheKeys = {
  articles: (filters?: any) => `articles:${JSON.stringify(filters || {})}`,
  article: (slug: string) => `article:${slug}`,
  hub: (slug: string) => `hub:${slug}`,
  hubs: () => 'hubs:all',
  search: (query: string, filters?: any) => `search:${query}:${JSON.stringify(filters || {})}`,
  stats: () => 'stats:all',
  kbRule: (slug: string) => `kb_rule:${slug}`,
  kbRules: (locale?: string) => `kb_rules:${locale ?? 'all'}`,
  kbFood: (slug: string) => `kb_food:${slug}`,
  kbFoods: (locale?: string) => `kb_foods:${locale ?? 'all'}`,
  kbGuide: (slug: string) => `kb_guide:${slug}`,
  kbGuides: (locale?: string, type?: string) => `kb_guides:${locale ?? 'all'}:${type ?? 'all'}`,
  kbSource: (id: string) => `kb_source:${id}`,
  kbSources: () => 'kb_sources:all'
};

// 缓存装饰器
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyGenerator: (...args: Parameters<T>) => string,
  ttl: number = 5 * 60 * 1000
): T {
  return (async (...args: Parameters<T>) => {
    const key = keyGenerator(...args);
    const cached = clientCache.get(key);
    
    if (cached !== null) {
      return cached;
    }

    const result = await fn(...args);
    clientCache.set(key, result, ttl);
    return result;
  }) as T;
}

// 预加载工具
export class Preloader {
  private preloadQueue: Array<() => Promise<any>> = [];
  private isRunning = false;

  add<T>(loader: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.preloadQueue.push(async () => {
        try {
          const result = await loader();
          resolve(result);
          return result;
        } catch (error) {
          reject(error);
          throw error;
        }
      });

      if (!this.isRunning) {
        this.processQueue();
      }
    });
  }

  private async processQueue(): Promise<void> {
    this.isRunning = true;
    
    while (this.preloadQueue.length > 0) {
      const loader = this.preloadQueue.shift();
      if (loader) {
        try {
          await loader();
        } catch (error) {
          console.error('Preload error:', error);
        }
      }
    }
    
    this.isRunning = false;
  }
}

export const preloader = new Preloader();

// 资源预加载
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

export function preloadRoute(href: string): void {
  if (typeof window !== 'undefined') {
    // 预加载路由
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  }
}

// 性能监控
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  startTiming(name: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.recordMetric(name, duration);
    };
  }

  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  getAverage(name: string): number {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  getMetrics(): Record<string, { average: number; count: number; latest: number }> {
    const result: Record<string, { average: number; count: number; latest: number }> = {};
    
    for (const [name, values] of this.metrics.entries()) {
      result[name] = {
        average: this.getAverage(name),
        count: values.length,
        latest: values[values.length - 1] || 0
      };
    }
    
    return result;
  }

  clear(): void {
    this.metrics.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();




