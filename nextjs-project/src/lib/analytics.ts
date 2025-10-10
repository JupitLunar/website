// Google Analytics 4 integration
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };

    // Configure GA
    window.gtag('js', new Date());
    window.gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
      page_title: title || document.title,
    });
  }
};

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track newsletter subscription
export const trackNewsletterSubscription = (email: string, source: string) => {
  trackEvent('newsletter_subscribe', 'engagement', source);
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'newsletter_subscription', {
      event_category: 'engagement',
      event_label: source,
      custom_parameter_1: email.substring(0, 3) + '***', // Partial email for privacy
    });
  }
};

// Track search queries
export const trackSearch = (query: string, resultsCount: number) => {
  trackEvent('search', 'engagement', query, resultsCount);
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'search', {
      search_term: query,
      results_count: resultsCount,
    });
  }
};

// Track article views
export const trackArticleView = (articleSlug: string, articleTitle: string, hub: string) => {
  trackEvent('article_view', 'content', articleSlug);
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'article_view', {
      article_slug: articleSlug,
      article_title: articleTitle,
      content_hub: hub,
    });
  }
};

// Track content hub views
export const trackHubView = (hubSlug: string, hubName: string) => {
  trackEvent('hub_view', 'content', hubSlug);
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'hub_view', {
      hub_slug: hubSlug,
      hub_name: hubName,
    });
  }
};

// Track user engagement
export const trackEngagement = (action: string, element: string, value?: string) => {
  trackEvent(action, 'engagement', element);
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: 'engagement',
      event_label: element,
      custom_parameter_1: value,
    });
  }
};

// Track performance metrics
export const trackPerformance = (metric: string, value: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'performance_metric', {
      metric_name: metric,
      metric_value: value,
    });
  }
};

// Track errors
export const trackError = (error: string, context?: string) => {
  trackEvent('error', 'technical', error);
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: error,
      fatal: false,
      custom_parameter_1: context,
    });
  }
};








