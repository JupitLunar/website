type PublicArticleLike = {
  slug?: string | null;
  title?: string | null;
  body_md?: string | null;
  status?: string | null;
};

export const INSIGHT_REVIEWERS = ['AI Content Generator', 'Medical Review Board'] as const;

const NON_PUBLIC_PATTERNS = [
  /\brag integration\b/i,
  /\bintegration test\b/i,
  /\btest article\b/i,
  /\blorem ipsum\b/i,
  /\bplaceholder\b/i,
  /\bdummy\b/i,
  /\binternal\b/i,
  /\bplayground\b/i,
  /\bsandbox\b/i,
  /\bhow to test\b/i,
  /^test[-\s_]/i,
  /^demo[-\s_]/i,
  /^sample[-\s_]/i,
  /^draft[-\s_]/i,
  /(^|[-_/])test($|[-_/])/i,
  /(^|[-_/])demo($|[-_/])/i,
  /(^|[-_/])sample($|[-_/])/i,
  /rag[-_]?integration/i,
];

function matchesNonPublicPattern(value: string | null | undefined) {
  if (!value) return false;
  return NON_PUBLIC_PATTERNS.some((pattern) => pattern.test(value));
}

export function isPublicFacingArticle(article: PublicArticleLike) {
  if (article.status && article.status !== 'published') {
    return false;
  }

  if (matchesNonPublicPattern(article.slug) || matchesNonPublicPattern(article.title)) {
    return false;
  }

  return true;
}

export function filterPublicFacingArticles<T extends PublicArticleLike>(articles: T[]) {
  return articles.filter((article) => isPublicFacingArticle(article));
}

export function isInsightArticleReviewer(reviewedBy: string | null | undefined) {
  if (!reviewedBy) return false;
  return INSIGHT_REVIEWERS.includes(reviewedBy as (typeof INSIGHT_REVIEWERS)[number]);
}

export function markdownToPlainText(markdown: string | null | undefined) {
  if (!markdown) return '';

  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[*-]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/[_*~]/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

export function getPlainTextExcerpt(markdown: string | null | undefined, maxLength: number = 320) {
  return truncateText(markdownToPlainText(markdown), maxLength);
}
