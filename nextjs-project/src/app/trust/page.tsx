import React from 'react';
import Link from 'next/link';
import { knowledgeBase } from '@/lib/supabase';
import type { KnowledgeRule, KnowledgeGuide, KnowledgeFood, KnowledgeSource } from '@/types/content';

export const metadata = {
  title: 'Trust & Content Curation Methods | JupitLunar',
  description:
    'See how JupitLunar curates and organizes evidence-based guidance from CDC, AAP, and Health Canada for North American infant and toddler feeding.',
};

function buildStructuredData({
  rules,
  guides,
  foods,
  sources,
}: {
  rules: KnowledgeRule[];
  guides: KnowledgeGuide[];
  foods: KnowledgeFood[];
  sources: KnowledgeSource[];
}) {
  const topSources = sources.slice(0, 10).map((source) => ({
    '@type': 'CreativeWork',
    name: source.name,
    url: source.url,
    dateModified: source.retrieved_at,
    publisher: source.organization,
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'HealthTopicContent',
    name: 'JupitLunar Trust & Methods',
    description:
      "Content curation methodology and authoritative sources behind JupitLunar's infant and toddler feeding knowledge base.",
    inLanguage: 'en',
    audience: {
      '@type': 'PeopleAudience',
      name: 'Parents of infants and toddlers in North America',
    },
    publisher: {
      '@type': 'Organization',
      name: 'JupitLunar',
      url: 'https://www.momaiagent.com',
    },
    about: [
      {
        '@type': 'Thing',
        name: 'Infant nutrition',
      },
      {
        '@type': 'Thing',
        name: 'Complementary feeding',
      },
    ],
    sourceOrganization: {
      '@type': 'GovernmentOrganization',
      name: 'CDC, AAP, Health Canada',
    },
    citation: topSources,
    mainEntity: {
      '@type': 'Dataset',
      name: 'JupitLunar Knowledge Base',
      description: 'Curated collection of evidence-based infant and toddler feeding guidance from official health organizations',
      measurementTechnique: 'Systematic aggregation and organization of official government and medical association guidelines',
      variableMeasured: ['Safety Rules', 'Feeding Guides', 'Food Preparation Briefs', 'Official Sources'],
      numberOfVariables: rules.length + guides.length + foods.length,
    },
  };
}

export default async function TrustCenterPage() {
  const [sources, rules, foods, guides] = await Promise.all([
    knowledgeBase.getSources(),
    knowledgeBase.getRules(),
    knowledgeBase.getFoods(),
    knowledgeBase.getGuides({ locale: 'Global' }),
  ]);

  const gradeTotals = (sources as KnowledgeSource[]).reduce<Record<string, number>>((acc, source) => {
    acc[source.grade] = (acc[source.grade] || 0) + 1;
    return acc;
  }, {});

  const structuredData = buildStructuredData({
    rules: rules as KnowledgeRule[],
    guides: guides as KnowledgeGuide[],
    foods: foods as KnowledgeFood[],
    sources: sources as KnowledgeSource[],
  });

  return (
    <div className="bg-gradient-to-br from-[#F8F6FC] to-[#EAE6F8] py-16">
      <div className="mx-auto max-w-5xl space-y-16 px-4">
        <header className="space-y-6 text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-purple-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-purple-700">
            Trust & Methods
          </span>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Science-Based Content Curation
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-slate-600 leading-relaxed">
            JupitLunar doesn't create original medical advice. Instead, we systematically aggregate, organize, and present
            evidence-based guidance from North America's most trusted health authorities: the CDC, AAP (American Academy of Pediatrics),
            and Health Canada.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="px-4 py-2 bg-white rounded-full border-2 border-gray-200 shadow-sm">
              <span className="text-sm font-semibold text-gray-700">🏛️ Government Sources</span>
            </div>
            <div className="px-4 py-2 bg-white rounded-full border-2 border-gray-200 shadow-sm">
              <span className="text-sm font-semibold text-gray-700">📚 Peer-Reviewed Research</span>
            </div>
            <div className="px-4 py-2 bg-white rounded-full border-2 border-gray-200 shadow-sm">
              <span className="text-sm font-semibold text-gray-700">🔄 Regular Updates</span>
            </div>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <p className="text-3xl font-semibold text-slate-900">{(rules as KnowledgeRule[]).length}</p>
            <p className="text-sm text-slate-600">Safety & policy rules</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <p className="text-3xl font-semibold text-slate-900">{(foods as KnowledgeFood[]).length}</p>
            <p className="text-sm text-slate-600">Food preparation briefs</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <p className="text-3xl font-semibold text-slate-900">{(guides as KnowledgeGuide[]).length}</p>
            <p className="text-sm text-slate-600">Step-by-step guides</p>
          </div>
        </section>

        <section className="space-y-6 rounded-3xl border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50 p-8 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Our Content Curation Process</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-sm">1</span>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Source Identification</h3>
                  <p className="text-sm text-slate-600">We monitor official health organizations (CDC, AAP, Health Canada) for updated guidelines on infant and toddler feeding, safety, and development.</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-sm">2</span>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Source Grading</h3>
                  <p className="text-sm text-slate-600">Each source is graded A-D based on authority. Grade A (government/medical associations) and Grade B (peer-reviewed research) are prioritized for content creation.</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-sm">3</span>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Content Organization</h3>
                  <p className="text-sm text-slate-600">We structure the information into beginner-friendly formats (food cards, safety rules, step-by-step guides) while maintaining direct citations to original sources.</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-sm">4</span>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Regular Updates</h3>
                  <p className="text-sm text-slate-600">Sources are re-verified every 12-18 months. When official guidelines change, we update our content within 90 days to reflect the latest recommendations.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="sources" className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4 rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h3 className="text-xl font-bold text-slate-900">Source Quality Distribution</h3>
            </div>
            <div className="space-y-3">
              {(['A', 'B', 'C', 'D'] as const).map((grade) => {
                const count = gradeTotals[grade] || 0;
                const total = Object.values(gradeTotals).reduce((sum: number, val: number) => sum + val, 0);
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

                return (
                  <div key={grade} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-900">
                        Grade {grade}{' '}
                        <span className="text-xs text-slate-500 font-normal">
                          {grade === 'A'
                            ? '(CDC, AAP, Health Canada)'
                            : grade === 'B'
                            ? '(Peer-reviewed journals)'
                            : grade === 'C'
                            ? '(Expert publications)'
                            : '(Educational resources)'}
                        </span>
                      </span>
                      <span className="font-bold text-slate-900">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          grade === 'A' ? 'bg-green-500' :
                          grade === 'B' ? 'bg-blue-500' :
                          grade === 'C' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-slate-500 mt-4 pt-4 border-t border-gray-200">
              We prioritize Grade A and B sources for all safety-critical content. Sources are re-verified every 12-18 months.
            </p>
          </div>

          <div className="space-y-4 rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold text-slate-900">Content Update Cycle</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Recent (&lt; 90 days)</p>
                  <p className="text-xs text-slate-600">Content based on sources updated within the last quarter</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Current (90-365 days)</p>
                  <p className="text-xs text-slate-600">Content based on sources verified within the past year</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Scheduled for Review (1-2 years)</p>
                  <p className="text-xs text-slate-600">Content approaching verification deadline</p>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-slate-700">
                <span className="font-semibold">Update Policy:</span> When official health organizations publish new guidelines, we update our content within 90 days and notify users of significant changes.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-6 rounded-3xl border-2 border-purple-100 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h2 className="text-2xl font-bold text-slate-900">Trusted Source Organizations</h2>
          </div>
          <p className="text-slate-700 leading-relaxed">
            JupitLunar aggregates guidance exclusively from North America's most authoritative health organizations.
            We don't create our own medical advice—we organize theirs.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <h3 className="font-bold text-slate-900 mb-2">🏛️ CDC</h3>
              <p className="text-sm text-slate-700">Centers for Disease Control and Prevention - U.S. government health agency</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <h3 className="font-bold text-slate-900 mb-2">👨‍⚕️ AAP</h3>
              <p className="text-sm text-slate-700">American Academy of Pediatrics - Leading pediatric medical association</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
              <h3 className="font-bold text-slate-900 mb-2">🍁 Health Canada</h3>
              <p className="text-sm text-slate-700">Canadian federal health department - Official Canadian health guidance</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-sm mt-4">
            <Link href="#sources" className="rounded-full bg-purple-600 text-white px-6 py-3 font-semibold hover:bg-purple-700 transition-colors">
              View All Sources
            </Link>
            <a
              href="https://www.cdc.gov/nutrition/infantandtoddlernutrition"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border-2 border-purple-200 px-6 py-3 font-semibold text-purple-700 hover:bg-purple-50 transition-colors"
            >
              CDC Guidelines ↗
            </a>
            <a
              href="https://www.healthychildren.org"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border-2 border-purple-200 px-6 py-3 font-semibold text-purple-700 hover:bg-purple-50 transition-colors"
            >
              AAP Resources ↗
            </a>
          </div>
        </section>

        <section className="space-y-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-gray-50 to-gray-100 p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <h2 className="text-2xl font-bold text-slate-900">Our Transparency Commitments</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Direct Source Citations</h3>
                <p className="text-sm text-slate-600">Every food card, safety rule, and guide links directly to the original CDC, AAP, or Health Canada source with grade labels and verification dates.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">No Hidden Expertise Claims</h3>
                <p className="text-sm text-slate-600">We don't claim to have in-house medical reviewers. Our value is organization and accessibility of official guidance, not independent medical judgment.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Public Update Logs</h3>
                <p className="text-sm text-slate-600">When official guidelines change or corrections are needed, we log changes publicly and update content within 90 days.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Clear Medical Disclaimer</h3>
                <p className="text-sm text-slate-600">All content includes prominent disclaimers that parents should consult their pediatric care team for individualized guidance.</p>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-300">
            <p className="text-center text-sm text-slate-600 italic">
              💡 <strong>Our Mission:</strong> Make evidence-based infant feeding guidance more accessible and understandable
              for North American families, while maintaining absolute transparency about our role as content curators, not medical experts.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
