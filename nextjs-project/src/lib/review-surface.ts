export function getReviewSurfaceLabel(reviewedBy: string | null | undefined) {
  if (!reviewedBy) return 'Evidence synthesis';

  if (/medical review/i.test(reviewedBy)) {
    return 'Clinical review';
  }

  if (/web scraper bot|authority refresh bot/i.test(reviewedBy)) {
    return 'Editorial workflow';
  }

  return 'Evidence synthesis';
}
