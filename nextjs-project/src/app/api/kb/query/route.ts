import { NextRequest, NextResponse } from 'next/server';

import {
  buildFoodUrl,
  buildSearchUrl,
  buildTopicUrl,
  kbJsonHeaders,
  normaliseUrl,
  parseKnowledgeLocale,
  scoreText,
  serializeKnowledgeFAQ,
  serializeKnowledgeFood,
  serializeKnowledgeGuide,
  serializeKnowledgeInsight,
  serializeKnowledgeRule,
  uniqueStrings,
  KB_SITE_URL,
} from '@/lib/kb-api';
import { knowledgeBase } from '@/lib/supabase';
import { TOPIC_CATALOG } from '@/lib/topic-catalog';
import type { KnowledgeSource } from '@/types/content';

export const dynamic = 'force-dynamic';

const DEFAULT_LIMIT = 3;
const MAX_LIMIT = 10;

type Scored<T> = T & { score: number };
type QueryMatch = { score: number; kind: string };
type AnswerLayer = 'kb' | 'insight-fallback' | 'topic-navigation' | 'none';
type EvidenceStrength = 'high' | 'moderate' | 'limited';
type AnswerConfidence = 'high' | 'moderate' | 'limited';
type MatchStrength = 'strong' | 'moderate' | 'weak' | 'none';
type UrgencyLevel = 'emergency-now' | 'same-day-clinician' | 'routine-clinician' | 'home-guidance-only';
type ReviewFreshnessLabel = 'current' | 'aging' | 'stale' | 'unknown';
type ReviewStatus = 'reviewed' | 'unknown';
type ScoredMatch = QueryMatch & Record<string, unknown>;

function querySuggestsInfantUnderThreeMonths(lower: string) {
  if (
    lower.includes('newborn') ||
    /\b(?:under|younger than|less than)\s*3\s*month/.test(lower) ||
    /\b3\s*month(?:s)?\b/.test(lower)
  ) {
    return true;
  }

  for (const match of lower.matchAll(/\b(\d{1,2})\s*(month|months|week|weeks|mo|mos|wk|wks)\s*old\b/g)) {
    const value = Number.parseInt(match[1] || '', 10);
    const unit = match[2] || '';

    if (!Number.isFinite(value)) {
      continue;
    }

    if ((unit.startsWith('month') || unit.startsWith('mo')) && value <= 2) {
      return true;
    }

    if ((unit.startsWith('week') || unit.startsWith('wk')) && value <= 12) {
      return true;
    }
  }

  return false;
}

function parseLimit(value: string | null) {
  if (!value) return DEFAULT_LIMIT;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return DEFAULT_LIMIT;
  return Math.min(Math.max(parsed, 1), MAX_LIMIT);
}

function scoreFAQ(faq: Awaited<ReturnType<typeof knowledgeBase.getFAQs>>[number], query: string) {
  return scoreText(query, [
    { text: faq.question, weight: 7 },
    { text: faq.answer, weight: 4 },
    { text: faq.category, weight: 2 },
    { text: faq.source_label, weight: 1 },
  ]);
}

function scoreFood(food: Awaited<ReturnType<typeof knowledgeBase.getFoods>>[number], query: string) {
  return scoreText(query, [
    { text: food.name, weight: 7 },
    { text: food.why, weight: 3 },
    { text: food.portion_hint, weight: 2 },
    { text: food.nutrients_focus?.join(' '), weight: 2 },
    { text: food.do_list?.join(' '), weight: 1 },
    { text: food.dont_list?.join(' '), weight: 1 },
  ]);
}

function scoreGuide(guide: Awaited<ReturnType<typeof knowledgeBase.getGuides>>[number], query: string) {
  return scoreText(query, [
    { text: guide.title, weight: 6 },
    { text: guide.summary, weight: 4 },
    { text: guide.body_md, weight: 2 },
    { text: guide.guide_type, weight: 1 },
  ]);
}

function scoreRule(rule: Awaited<ReturnType<typeof knowledgeBase.getRules>>[number], query: string) {
  return scoreText(query, [
    { text: rule.title, weight: 6 },
    { text: rule.summary, weight: 4 },
    { text: rule.why, weight: 2 },
    { text: rule.category, weight: 1 },
    { text: rule.do_list?.join(' '), weight: 1 },
    { text: rule.dont_list?.join(' '), weight: 1 },
  ]);
}

function scoreTopic(topic: (typeof TOPIC_CATALOG)[number], query: string) {
  return scoreText(query, [
    { text: topic.title, weight: 6 },
    { text: topic.focus, weight: 3 },
    { text: topic.blurb, weight: 3 },
  ]);
}

function scoreInsight(insight: Awaited<ReturnType<typeof knowledgeBase.getEvidenceInsights>>[number], query: string) {
  return scoreText(query, [
    { text: insight.title, weight: 7 },
    { text: insight.summary, weight: 4 },
    { text: insight.body_excerpt, weight: 2 },
    { text: insight.primary_sources.join(' '), weight: 2 },
    { text: insight.hub, weight: 1 },
    { text: insight.type, weight: 1 },
  ]);
}

function topMatches<T>(items: T[], scorer: (item: T) => number, limit: number) {
  return items
    .map((item) => ({ item, score: scorer(item) }))
    .filter((entry) => entry.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function detectSafety(query: string) {
  const lower = query.toLowerCase();
  const reasons: string[] = [];
  const escalationReasonCodes: string[] = [];
  let urgencyLevel: UrgencyLevel = 'home-guidance-only';

  const raiseUrgency = (next: UrgencyLevel) => {
    const order: Record<UrgencyLevel, number> = {
      'home-guidance-only': 0,
      'routine-clinician': 1,
      'same-day-clinician': 2,
      'emergency-now': 3,
    };
    if (order[next] > order[urgencyLevel]) {
      urgencyLevel = next;
    }
  };

  if (lower.includes('fever') && querySuggestsInfantUnderThreeMonths(lower)) {
    reasons.push('A fever in an infant under 3 months needs urgent medical evaluation.');
    escalationReasonCodes.push('newborn-fever');
    raiseUrgency('same-day-clinician');
  }

  if (
    lower.includes('trouble breathing') ||
    lower.includes('not breathing') ||
    lower.includes('blue') ||
    lower.includes('unresponsive') ||
    lower.includes('seizure')
  ) {
    reasons.push('Breathing trouble, blue color, seizures, or unresponsiveness need emergency care now.');
    escalationReasonCodes.push('breathing-distress');
    raiseUrgency('emergency-now');
  }

  if (lower.includes('self harm') || lower.includes('suicidal') || lower.includes('hurt myself')) {
    reasons.push('Postpartum self-harm thoughts need urgent clinician or emergency support now.');
    escalationReasonCodes.push('postpartum-self-harm');
    raiseUrgency('emergency-now');
  }

  if (lower.includes('heavy bleeding') || lower.includes('chest pain')) {
    reasons.push('Heavy bleeding or chest pain after birth needs urgent medical evaluation.');
    escalationReasonCodes.push(lower.includes('heavy bleeding') ? 'postpartum-heavy-bleeding' : 'postpartum-chest-pain');
    raiseUrgency('same-day-clinician');
  }

  if (
    lower.includes('dehydration') ||
    lower.includes('not peeing') ||
    lower.includes('few wet diapers') ||
    lower.includes('barely peeing')
  ) {
    reasons.push('Reduced urine output or dehydration signs in a baby need prompt clinician assessment.');
    escalationReasonCodes.push('dehydration-risk');
    raiseUrgency('same-day-clinician');
  }

  if (
    lower.includes('hives') ||
    lower.includes('allergic reaction') ||
    lower.includes('anaphylaxis') ||
    lower.includes('swelling after') ||
    lower.includes('swollen lips')
  ) {
    reasons.push('Possible allergic reactions need prompt assessment, especially if swelling, vomiting, or breathing changes are present.');
    escalationReasonCodes.push('allergic-reaction');
    raiseUrgency('same-day-clinician');
  }

  if (lower.includes('fever') && urgencyLevel === 'home-guidance-only') {
    escalationReasonCodes.push('fever-threshold-check');
    raiseUrgency('routine-clinician');
  }

  const message =
    reasons.length > 0
      ? 'This query suggests a potentially urgent situation. Use emergency or clinician care rather than relying only on a knowledge response.'
      : lower.includes('fever')
        ? 'For fever questions, check age, temperature method, hydration, breathing, and responsiveness. Infants under 3 months with 100.4°F / 38°C or higher need prompt medical evaluation.'
        : null;

  return {
    escalate_now: urgencyLevel !== 'home-guidance-only',
    urgency_level: urgencyLevel,
    escalation_reason_codes: uniqueStrings(escalationReasonCodes),
    reasons,
    message,
  };
}

function isHighRiskSafety(safety: ReturnType<typeof detectSafety>) {
  return safety.escalate_now;
}

function isAuthorityKbMatch(match: ScoredMatch | null) {
  if (!match) return false;
  if (match.kind === 'topic' || match.kind === 'food') return false;

  if (typeof match.source_layer === 'string' && match.source_layer.toLowerCase().includes('authority')) {
    return true;
  }

  return Array.isArray(match.sources) && match.sources.some((source) => source?.grade === 'A');
}

function isStrongSupportingMatch(match: QueryMatch, minimumScore: number = 6) {
  return match.score >= minimumScore;
}

function isHighRiskInsightCandidate(match: QueryMatch & Record<string, unknown>) {
  if (!isStrongSupportingMatch(match)) return false;
  return match.hub === 'safety' || match.hub === 'mom-health';
}

function serializeTopicMatch(topic: (typeof TOPIC_CATALOG)[number], score: number) {
  return {
    score,
    kind: 'topic',
    slug: topic.slug,
    title: topic.title,
    focus: topic.focus,
    summary: topic.blurb,
    read_more_url: buildTopicUrl(topic.slug),
  };
}

function buildReadNext(items: Array<{ label: string; url: string; type: string }>) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}

function chooseBestAnswer<T extends QueryMatch, U extends QueryMatch>(
  bestKb: T | null,
  bestInsight: U | null,
  options?: { preferKb?: boolean }
) {
  if (!bestKb && !bestInsight) {
    return { best: null, answerLayer: 'none' as AnswerLayer };
  }

  if (bestKb && !bestInsight) {
    return { best: bestKb, answerLayer: 'kb' as AnswerLayer };
  }

  if (!bestKb && bestInsight) {
    return { best: bestInsight, answerLayer: 'insight-fallback' as AnswerLayer };
  }

  if (
    options?.preferKb &&
    bestKb &&
    (bestKb.score >= 12 || bestKb.score + 4 >= (bestInsight?.score || 0))
  ) {
    return { best: bestKb, answerLayer: 'kb' as AnswerLayer };
  }

  // Keep KB-first behavior for close scores, but allow a clearly stronger insight hit to win.
  if ((bestKb?.score || 0) + 6 >= (bestInsight?.score || 0)) {
    return { best: bestKb, answerLayer: 'kb' as AnswerLayer };
  }

  return { best: bestInsight, answerLayer: 'insight-fallback' as AnswerLayer };
}

function formatAgeScope(ageRange: string[] | string | null | undefined) {
  if (!ageRange) return null;
  if (Array.isArray(ageRange)) {
    const cleaned = ageRange.filter(Boolean);
    return cleaned.length > 0 ? cleaned.join(', ') : null;
  }
  return ageRange || null;
}

function inferWhyThisApplies(best: Record<string, unknown> & QueryMatch) {
  switch (best.kind) {
    case 'faq':
      return 'This is the closest direct question match in the public KB and includes an explicit source-linked answer.';
    case 'food':
      return `This food match includes age-specific serving guidance and a ${String(best.risk_level || 'context-specific')} risk profile.`;
    case 'rule':
      return 'This match is a structured safety rule with a clear boundary, category, and action guidance.';
    case 'guide':
      return 'This guide match is suited to a longer pathway or checklist rather than a one-line answer.';
    case 'topic':
      return 'This topic is the closest structured navigation path for broader reading on the question.';
    case 'insight': {
      const citationCount = typeof best.citation_count === 'number' ? best.citation_count : 0;
      const primarySources = Array.isArray(best.primary_sources) ? best.primary_sources.length : 0;
      return `This evidence-qualified article is the strongest public match and carries ${citationCount} citations across ${primarySources} primary source${primarySources === 1 ? '' : 's'}.`;
    }
    default:
      return null;
  }
}

function inferEvidenceStrength(best: Record<string, unknown> & QueryMatch): { level: EvidenceStrength; rationale: string } {
  if (typeof best.evidence_level === 'string') {
    if (best.evidence_level === 'A') {
      return { level: 'high', rationale: 'This answer is backed by an evidence-qualified article with level A evidence.' };
    }
    if (best.evidence_level === 'B') {
      return { level: 'moderate', rationale: 'This answer is backed by an evidence-qualified article with level B evidence.' };
    }
    return { level: 'limited', rationale: 'This answer is backed by an evidence-qualified article with limited evidence strength.' };
  }

  if (typeof best.source_layer === 'string' && best.source_layer.toLowerCase().includes('authority')) {
    return { level: 'high', rationale: 'This answer comes from an authority-linked KB object.' };
  }

  if (Array.isArray(best.sources) && best.sources.some((source) => source?.grade === 'A')) {
    return { level: 'high', rationale: 'This answer is joined to at least one grade A source.' };
  }

  if (Array.isArray(best.sources) && best.sources.some((source) => source?.grade === 'B')) {
    return { level: 'moderate', rationale: 'This answer is joined to at least one grade B source.' };
  }

  if (best.kind === 'topic') {
    return { level: 'limited', rationale: 'This is a navigation result rather than a direct evidence object.' };
  }

  return { level: 'moderate', rationale: 'This answer comes from a structured KB object but has lighter explicit evidence metadata.' };
}

function inferConfidence(score: number, answerLayer: AnswerLayer, evidenceStrength: EvidenceStrength): AnswerConfidence {
  if (score >= 16 && evidenceStrength === 'high' && answerLayer === 'kb') {
    return 'high';
  }
  if (score >= 12 && evidenceStrength !== 'limited') {
    return answerLayer === 'insight-fallback' ? 'moderate' : 'high';
  }
  if (score >= 8) {
    return 'moderate';
  }
  return 'limited';
}

function inferWhenToEscalate(
  best: (Record<string, unknown> & QueryMatch) | null,
  safety: ReturnType<typeof detectSafety>
) {
  if (safety.reasons.length > 0) {
    return safety.reasons.join(' ');
  }

  if (safety.message) {
    return safety.message;
  }

  if (best?.kind === 'food' && best.risk_level === 'high') {
    return 'Use extra caution with preparation and supervision. Seek urgent help for choking, breathing changes, or swelling after eating.';
  }

  if (best?.kind === 'rule' && best.risk_level === 'high') {
    return 'Treat this as a high-risk safety boundary. Escalate to a clinician promptly if the boundary was crossed and symptoms are present.';
  }

  return null;
}

function inferContraindications(best: Record<string, unknown> & QueryMatch) {
  if (Array.isArray(best.dont_list) && best.dont_list.length > 0) {
    return best.dont_list.slice(0, 3);
  }
  return [];
}

function inferReviewContract(best: Record<string, unknown> & QueryMatch) {
  const lastReviewedAt = 'last_reviewed_at' in best && typeof best.last_reviewed_at === 'string' ? best.last_reviewed_at : null;
  const reviewedBy = 'reviewed_by' in best && typeof best.reviewed_by === 'string' ? best.reviewed_by : null;
  const expiresAt = 'expires_at' in best && typeof best.expires_at === 'string' ? best.expires_at : null;
  const reviewStatus: ReviewStatus = lastReviewedAt ? 'reviewed' : 'unknown';

  if (!lastReviewedAt) {
    return {
      status: reviewStatus,
      reviewed_by: reviewedBy,
      last_reviewed_at: null,
      expires_at: expiresAt,
      freshness_days: null,
      freshness_label: 'unknown' as ReviewFreshnessLabel,
      is_expired: false,
    };
  }

  const now = new Date();
  const reviewedAt = new Date(lastReviewedAt);
  const freshnessDays = Number.isNaN(reviewedAt.getTime())
    ? null
    : Math.max(0, Math.floor((now.getTime() - reviewedAt.getTime()) / (1000 * 60 * 60 * 24)));
  const freshnessLabel: ReviewFreshnessLabel =
    freshnessDays === null ? 'unknown' : freshnessDays <= 30 ? 'current' : freshnessDays <= 180 ? 'aging' : 'stale';
  const isExpired = expiresAt ? new Date(expiresAt).getTime() < now.getTime() : false;

  return {
    status: reviewStatus,
    reviewed_by: reviewedBy,
    last_reviewed_at: lastReviewedAt,
    expires_at: expiresAt,
    freshness_days: freshnessDays,
    freshness_label: freshnessLabel,
    is_expired: isExpired,
  };
}

function inferMatchStrength(
  best: (Record<string, unknown> & QueryMatch) | null,
  answerLayer: AnswerLayer,
  evidenceStrength: EvidenceStrength | null
): MatchStrength {
  if (!best) {
    return answerLayer === 'topic-navigation' ? 'weak' : 'none';
  }

  if (answerLayer === 'kb') {
    if (best.score >= 14 && evidenceStrength === 'high') return 'strong';
    if (best.score >= 9) return 'moderate';
    return 'weak';
  }

  if (answerLayer === 'insight-fallback') {
    if (best.score >= 16 && evidenceStrength !== 'limited') return 'strong';
    if (best.score >= 10) return 'moderate';
    return 'weak';
  }

  return 'none';
}

function buildLlmFallback(params: {
  answerLayer: AnswerLayer;
  matchStrength: MatchStrength;
  topicAvailable: boolean;
}) {
  const { answerLayer, matchStrength, topicAvailable } = params;
  const eligible = answerLayer === 'none' || answerLayer === 'topic-navigation' || matchStrength === 'weak';

  if (!eligible) {
    return null;
  }

  let reason = 'No strong public source-linked match was found.';
  if (answerLayer === 'topic-navigation' || topicAvailable) {
    reason = 'No strong public source-linked match was found. The best public result is a broader topic navigation path.';
  } else if (matchStrength === 'weak') {
    reason = 'The public source-linked match is weak or incomplete for this question.';
  }

  return {
    eligible: true,
    used: false,
    label: 'Exploratory guidance only',
    not_source_linked: true,
    reason,
    guidance: 'Use only as exploratory guidance. Verify with a clinician or a source-backed page before relying on it.',
    verify_with: ['clinician', 'source-backed page'],
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('q') || '').trim();
    const locale = parseKnowledgeLocale(searchParams.get('locale'));
    const limit = parseLimit(searchParams.get('limit'));

    if (!query) {
      return NextResponse.json(
        { error: 'Missing q. Provide a natural-language question.' },
        { status: 400 }
      );
    }

    if (searchParams.get('locale') && !locale) {
      return NextResponse.json(
        { error: 'Invalid locale. Use one of: US, CA, Global.' },
        { status: 400 }
      );
    }

    const [faqs, foods, guides, rules, insights] = await Promise.all([
      knowledgeBase.getFAQs({ locale }),
      knowledgeBase.getFoods(locale),
      knowledgeBase.getGuides({ locale }),
      knowledgeBase.getRules(locale),
      knowledgeBase.getEvidenceInsights({ locale }),
    ]);

    const faqMatches = topMatches(faqs, (faq) => scoreFAQ(faq, query), limit);
    const foodMatches = topMatches(foods, (food) => scoreFood(food, query), limit);
    const guideMatches = topMatches(guides, (guide) => scoreGuide(guide, query), limit);
    const ruleMatches = topMatches(rules, (rule) => scoreRule(rule, query), limit);
    const topicMatches = topMatches(TOPIC_CATALOG, (topic) => scoreTopic(topic, query), limit);
    const insightMatches = topMatches(insights, (insight) => scoreInsight(insight, query), limit);

    const sourceIds = uniqueStrings([
      ...faqMatches.flatMap(({ item }) => item.source_ids || []),
      ...foodMatches.flatMap(({ item }) => item.source_ids || []),
      ...guideMatches.flatMap(({ item }) => item.source_ids || []),
      ...ruleMatches.flatMap(({ item }) => item.source_ids || []),
    ]);
    const sourceMap = await knowledgeBase.getSourcesMap(sourceIds);

    const serializedFaqs = faqMatches.map(({ item, score }) => ({
      score,
      kind: 'faq',
      ...serializeKnowledgeFAQ(
        item,
        (item.source_ids || [])
          .map((id) => sourceMap.get(id))
          .filter((entry): entry is KnowledgeSource => Boolean(entry))
      ),
    }));

    const serializedFoods = foodMatches.map(({ item, score }) => ({
      score,
      kind: 'food',
      ...serializeKnowledgeFood(
        item,
        (item.source_ids || [])
          .map((id) => sourceMap.get(id))
          .filter((entry): entry is KnowledgeSource => Boolean(entry))
      ),
    }));

    const serializedGuides = guideMatches.map(({ item, score }) => ({
      score,
      kind: 'guide',
      ...serializeKnowledgeGuide(
        item,
        (item.source_ids || [])
          .map((id) => sourceMap.get(id))
          .filter((entry): entry is KnowledgeSource => Boolean(entry))
      ),
    }));

    const serializedRules = ruleMatches.map(({ item, score }) => ({
      score,
      kind: 'rule',
      ...serializeKnowledgeRule(
        item,
        (item.source_ids || [])
          .map((id) => sourceMap.get(id))
          .filter((entry): entry is KnowledgeSource => Boolean(entry))
      ),
    }));

    const serializedTopics = topicMatches.map(({ item, score }) => serializeTopicMatch(item, score));
    const serializedInsights = insightMatches.map(({ item, score }) => ({
      score,
      kind: 'insight' as const,
      ...serializeKnowledgeInsight(item),
    }));

    const safety = detectSafety(query);
    const highRiskSafety = isHighRiskSafety(safety);
    const kbCandidatePool = [
      ...serializedFaqs,
      ...(highRiskSafety ? [] : serializedFoods),
      ...serializedGuides,
      ...serializedRules,
    ].sort((a, b) => b.score - a.score);
    const topicCandidatePool = (highRiskSafety ? [] : serializedTopics).sort((a, b) => b.score - a.score);
    const insightCandidatePool = [...serializedInsights].sort((a, b) => b.score - a.score);

    const bestKb = kbCandidatePool[0] || null;
    const bestTopic = topicCandidatePool[0] || null;
    const bestInsight = insightCandidatePool[0] || null;
    const preferKb = highRiskSafety || isAuthorityKbMatch(bestKb);
    const chosen = chooseBestAnswer(bestKb, bestInsight, { preferKb });
    const best = chosen.best;
    const answerLayer: AnswerLayer = best ? chosen.answerLayer : bestTopic ? 'topic-navigation' : 'none';
    const quickAnswerEvidenceStrength = best ? inferEvidenceStrength(best) : null;
    const quickAnswerReview = best ? inferReviewContract(best) : null;
    const matchStrength = inferMatchStrength(best, answerLayer, quickAnswerEvidenceStrength?.level || null);

    const quickAnswer = best
      ? {
          kind: best.kind,
          title:
            'question' in best
              ? best.question
              : 'name' in best
                ? best.name
                : best.title,
          answer:
            'answer' in best
              ? best.answer
              : 'body_excerpt' in best && best.body_excerpt
                ? best.body_excerpt
                : 'summary' in best && best.summary
                ? best.summary
                : 'why' in best && best.why
                  ? best.why
                  : null,
          source_layer: 'source_layer' in best ? best.source_layer || null : null,
          source_label: 'source_label' in best ? best.source_label || null : null,
          source_url: 'source_url' in best && best.source_url ? normaliseUrl(best.source_url) : null,
          read_more_url: best.read_more_url,
          score: best.score,
          why_this_applies: inferWhyThisApplies(best),
          evidence_strength: quickAnswerEvidenceStrength,
          age_scope: formatAgeScope('age_range' in best ? (best.age_range as string[] | string | null | undefined) : null),
          locale_scope: 'locale' in best ? best.locale || null : null,
          when_to_escalate: inferWhenToEscalate(best, safety),
          confidence: inferConfidence(best.score, answerLayer, quickAnswerEvidenceStrength?.level || 'limited'),
          contraindications: inferContraindications(best),
          last_reviewed_at: 'last_reviewed_at' in best ? best.last_reviewed_at || null : null,
          review: quickAnswerReview,
          evidence_signals: {
            citation_count: 'citation_count' in best && typeof best.citation_count === 'number' ? best.citation_count : null,
            evidence_level: 'evidence_level' in best && typeof best.evidence_level === 'string' ? best.evidence_level : null,
            primary_sources: 'primary_sources' in best && Array.isArray(best.primary_sources) ? best.primary_sources : [],
          },
        }
      : null;
    const llmFallback = buildLlmFallback({
      answerLayer,
      matchStrength,
      topicAvailable: Boolean(bestTopic),
    });

    const readNext = buildReadNext(
      highRiskSafety
        ? [
            ...(quickAnswer?.read_more_url
              ? [{ label: 'Open the best matching page', url: quickAnswer.read_more_url, type: quickAnswer.kind }]
              : []),
            ...serializedFaqs.filter((faq) => isStrongSupportingMatch(faq)).slice(0, 3).map((faq) => ({
              label: faq.question,
              url: faq.read_more_url,
              type: 'faq',
            })),
            ...serializedInsights.filter((insight) => isHighRiskInsightCandidate(insight)).slice(0, 2).map((insight) => ({
              label: insight.title,
              url: insight.read_more_url,
              type: 'insight',
            })),
          ]
        : [
            ...(quickAnswer?.read_more_url
              ? [{ label: 'Open the best matching page', url: quickAnswer.read_more_url, type: quickAnswer.kind }]
              : []),
            ...serializedTopics.slice(0, 2).map((topic) => ({
              label: topic.title,
              url: topic.read_more_url,
              type: 'topic',
            })),
            ...serializedFoods.slice(0, 2).map((food) => ({
              label: food.name,
              url: food.read_more_url,
              type: 'food',
            })),
            ...serializedFaqs.slice(0, 2).map((faq) => ({
              label: faq.question,
              url: faq.read_more_url,
              type: 'faq',
            })),
            ...serializedInsights.slice(0, 2).map((insight) => ({
              label: insight.title,
              url: insight.read_more_url,
              type: 'insight',
            })),
            { label: 'Search the full answer hub', url: buildSearchUrl(query), type: 'search' },
            { label: 'Review trust and methodology', url: `${KB_SITE_URL}/trust`, type: 'trust' },
          ]
    ).slice(0, 6);

    return NextResponse.json(
      {
        query,
        locale: locale || 'Global',
        quick_answer: quickAnswer,
        safety,
        matches: {
          faqs: serializedFaqs,
          foods: serializedFoods,
          guides: serializedGuides,
          rules: serializedRules,
          topics: serializedTopics,
          insights: serializedInsights,
        },
        read_next: readNext,
        llm_fallback: llmFallback,
        meta: {
          surface: 'query',
          public_read_only: true,
          generated_at: new Date().toISOString(),
          result_limit: limit,
          answer_layer: answerLayer,
          match_strength: matchStrength,
        },
      },
      { headers: kbJsonHeaders() }
    );
  } catch (error) {
    console.error('KB query API error:', error);
    return NextResponse.json(
      { error: 'Failed to query the Mom AI Agent knowledge base' },
      { status: 500 }
    );
  }
}
