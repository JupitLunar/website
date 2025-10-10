import React from 'react';
import Script from 'next/script';
import { BottomLineAnswer, USCanadaComparison } from '@/components';

/**
 * AEO优化文章页面示例
 * 展示如何集成AEO组件来最大化LLM搜索效果
 */
export default function ExampleAEOArticlePage() {
  // 示例文章数据
  const articleData = {
    slug: 'vitamin-d-iron-supplements-comprehensive-guide-2025',
    title: 'Does my breastfed baby need vitamin D or iron supplements? How much and for how long?',
    one_liner: 'Breastfed or mixed-fed infants need 400 IU/day vitamin D from soon after birth through 12 months; most children 12–24 months need 600 IU/day. In the U.S., many clinicians give 1 mg/kg/day elemental iron starting at ~4 months for exclusively breastfed infants until iron-rich solids are established.',
    summary: 'Breastfed or mixed-fed infants need 400 IU/day vitamin D from soon after birth through 12 months; most children 12–24 months need 600 IU/day. In the U.S., many clinicians give 1 mg/kg/day elemental iron starting at ~4 months for exclusively breastfed infants until iron-rich solids are established.',
    type: 'explainer',
    hub: 'feeding',
    lang: 'en',
    region: 'Global',
    age_range: ['0-6 months', '6-12 months', '12-24 months'],
    date_published: '2025-01-06T00:00:00Z',
    date_modified: '2025-01-06T00:00:00Z',
    last_reviewed: '2025-01-06',
    keywords: ['vitamin-d', 'iron-supplements', 'breastfeeding', 'infant-nutrition'],
    entities: ['vitamin-d', 'iron', 'breastfeeding', 'supplements'],
    qas: [
      {
        question: 'When should I start vitamin D supplements for my breastfed baby?',
        answer: 'Start vitamin D supplements soon after birth, typically within the first few days of life. The recommended dose is 400 IU per day for the first 12 months.'
      },
      {
        question: 'How much iron does my breastfed baby need?',
        answer: 'In the U.S., many clinicians recommend 1 mg/kg/day of elemental iron starting at around 4 months for exclusively breastfed infants, continuing until iron-rich solid foods are well established.'
      },
      {
        question: 'Do formula-fed babies need vitamin D supplements?',
        answer: 'Formula-fed babies typically do not need additional vitamin D supplements because infant formula is fortified with vitamin D.'
      }
    ],
    citations: [
      {
        title: 'Vitamin D Supplementation for Infants',
        url: 'https://www.cdc.gov/nutrition/infantandtoddlernutrition/vitamins-minerals/vitamin-d.html',
        author: 'CDC',
        publisher: 'Centers for Disease Control and Prevention',
        date: '2024-12-01'
      },
      {
        title: 'Iron Deficiency Anemia in Infants',
        url: 'https://www.aap.org/en/patient-care/iron-deficiency-anemia/',
        author: 'AAP',
        publisher: 'American Academy of Pediatrics',
        date: '2024-11-15'
      }
    ]
  };

  // 生成结构化数据
  const structuredData = {
    "@context": "https://schema.org",
    "@type": ["MedicalWebPage", "Article"],
    "@id": `https://jupitlunar.com/${articleData.slug}#article`,
    "headline": articleData.title,
    "description": articleData.one_liner,
    "abstract": articleData.summary,
    "about": {
      "@type": "MedicalCondition",
      "name": "Infant nutrition and supplementation",
      "description": "Guidance on vitamin D and iron supplementation for infants"
    },
    "inLanguage": "en-US",
    "datePublished": articleData.date_published,
    "dateModified": articleData.date_modified,
    "lastReviewed": articleData.last_reviewed,
    "author": {
      "@type": "Organization",
      "name": "JupitLunar Editorial Team",
      "description": "Evidence-based health content curation",
      "url": "https://jupitlunar.com/about"
    },
    "reviewedBy": {
      "@type": "MedicalOrganization",
      "name": "Based on CDC, AAP, Health Canada Guidelines",
      "description": "Content follows official government and medical organization guidelines"
    },
    "publisher": {
      "@type": "Organization",
      "name": "JupitLunar",
      "logo": {
        "@type": "ImageObject",
        "url": "https://jupitlunar.com/Assets/Logo.png",
        "width": 200,
        "height": 60
      },
      "url": "https://jupitlunar.com"
    },
    "medicalAudience": {
      "@type": "MedicalAudience",
      "audienceType": "Parents and caregivers of infants and toddlers",
      "geographicArea": "North America"
    },
    "isPartOf": {
      "@type": "WebSite",
      "name": "JupitLunar Health Intelligence",
      "url": "https://jupitlunar.com"
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", ".bottom-line-answer", ".key-numbers"]
    },
    "disclaimer": "This content is for educational purposes only and does not replace professional medical advice. Always consult your pediatrician for personalized guidance.",
    "keywords": articleData.keywords.join(', '),
    "audience": {
      "@type": "PeopleAudience",
      "audienceType": "Parents and caregivers",
      "geographicArea": {
        "@type": "Country",
        "name": "North America"
      }
    }
  };

  // FAQ结构化数据
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `https://jupitlunar.com/${articleData.slug}#faq`,
    "mainEntity": articleData.qas.map((qa, index) => ({
      "@type": "Question",
      "@id": `https://jupitlunar.com/${articleData.slug}#question-${index + 1}`,
      "name": qa.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": qa.answer,
        "dateCreated": articleData.date_published,
        "upvoteCount": 0
      },
      "author": {
        "@type": "Organization",
        "name": "JupitLunar Editorial Team"
      }
    })),
    "about": {
      "@type": "Thing",
      "name": articleData.title,
      "description": articleData.one_liner
    }
  };

  // US/CA对比数据
  const comparisonData = {
    usData: {
      "维生素D剂量": "400 IU/day (0-12个月), 600 IU/day (12-24个月)",
      "开始时间": "出生后不久",
      "适用人群": "母乳喂养和混合喂养的婴儿",
      "铁补充": "1 mg/kg/day (4个月开始)",
      "持续时间": "直到铁丰富的辅食建立",
      "配方奶": "通常不需要额外补充（已强化）"
    },
    caData: {
      "维生素D剂量": "400 IU/day (0-12个月)",
      "开始时间": "出生后",
      "适用人群": "纯母乳喂养和部分母乳喂养的婴儿",
      "铁补充": "个体化评估",
      "持续时间": "根据个体需要",
      "配方奶": "通常不需要额外补充（已强化）"
    }
  };

  return (
    <>
      {/* 结构化数据 */}
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData, null, 2) }}
      />
      
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData, null, 2) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-[#F8F6FC] to-[#EAE6F8] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {articleData.title}
            </h1>
            <p className="text-xl text-gray-600">
              AEO优化文章页面示例 - 展示LLM搜索优化效果
            </p>
          </div>

          {/* AEO优化的首屏答案 */}
          <BottomLineAnswer
            question={articleData.title}
            answer={articleData.one_liner}
            keyNumbers={[
              "400 IU/day (0-12个月)",
              "600 IU/day (12-24个月)", 
              "1 mg/kg/day (铁)",
              "4个月开始",
              "出生后不久"
            ]}
            actionItems={[
              "咨询儿科医生确定具体补充计划",
              "选择适合婴儿的维生素D滴剂",
              "坚持每天按时补充维生素D",
              "4个月后考虑铁补充（纯母乳喂养）",
              "12个月后调整维生素D剂量"
            ]}
            ageRange="0-24个月"
            region="北美"
            sources={["CDC", "AAP", "Health Canada"]}
            articleSlug={articleData.slug}
            className="mb-8"
          />

          {/* US/CA对比表格 */}
          <USCanadaComparison
            topic="维生素D和铁补充指南"
            usData={comparisonData.usData}
            caData={comparisonData.caData}
            articleSlug={articleData.slug}
            className="mb-8"
          />

          {/* 使用预设模板的示例 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              📋 预设模板示例
            </h2>
            <p className="text-gray-600 mb-4">
              以下是使用预设AEO模板的示例：
            </p>
            
            <CommonAnswer 
              type="vitaminD" 
              articleSlug={articleData.slug}
            />
          </div>

          {/* 文章内容 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              📖 详细内容
            </h2>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                {articleData.summary}
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                为什么维生素D很重要？
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                母乳是许多营养素和保护因子的优质来源，但维生素D含量通常不足以满足婴儿的日常需求。
                CDC指南指出：12个月以下需要400 IU/day，12-24个月需要600 IU/day。
                对于仅接受母乳喂养的婴儿（或母乳和配方奶混合喂养），建议每天补充400 IU。
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                铁补充：美国 vs 加拿大方法
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                <strong>美国：</strong>AAP临床路径建议纯母乳喂养的婴儿从4个月开始每天1 mg/kg铁，
                持续到铁丰富的辅食可靠地满足需求。铁强化配方奶通常不需要额外补充。
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                <strong>加拿大：</strong>Health Canada的6-24个月建议强调优先考虑铁丰富的首选食物
                （肉类/肉类替代品；铁强化婴儿谷物），并在6-12个月期间重复日常接触。
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                实用检查清单
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>如果饮食中有任何母乳，在出生后不久开始维生素D 400 IU/day</li>
                <li>在12个月时重新评估（目标通常是600 IU/day）</li>
                <li>在4个月访问时讨论铁（美国），计划从约6个月开始铁丰富的辅食</li>
                <li>与临床团队讨论任何个性化的补充需求</li>
              </ul>
            </div>
          </div>

          {/* FAQ部分 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              ❓ 常见问题
            </h2>
            
            <div className="space-y-6">
              {articleData.qas.map((qa, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {qa.question}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {qa.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 权威来源 */}
          <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              📚 权威来源
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {articleData.citations.map((citation, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    {citation.title}
                  </h4>
                  <p className="text-sm text-blue-700 mb-2">
                    {citation.author} - {citation.publisher}
                  </p>
                  <a 
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    查看原文 →
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* 免责声明 */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ 重要说明：</strong> 此内容仅供教育目的，不替代专业医疗建议。
              请咨询您的儿科医生获取个性化指导。本内容基于官方政府指南，不构成医疗建议。
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
