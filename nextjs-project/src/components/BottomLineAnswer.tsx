import React from 'react';
import Script from 'next/script';

export interface BottomLineAnswerProps {
  question: string;
  answer: string;
  keyNumbers?: string[];
  actionItems?: string[];
  ageRange?: string;
  region?: string;
  sources?: string[];
  className?: string;
  articleSlug?: string;
}

// Type aliases for backward compatibility
export type CommonAnswer = BottomLineAnswerProps;
export type CommonComparison = BottomLineAnswerProps;

export function BottomLineAnswer({
  question,
  answer,
  keyNumbers = [],
  actionItems = [],
  ageRange,
  region,
  sources = [],
  className = "",
  articleSlug
}: BottomLineAnswerProps) {
  
  // Generate Speakable structured data
  const speakableSchema = {
    "@context": "https://schema.org",
    "@type": "SpeakableSpecification",
    "cssSelector": [
      ".bottom-line-answer",
      ".key-numbers",
      ".action-items"
    ],
    "xpath": [
      "//div[@class='bottom-line-answer']",
      "//div[@class='key-numbers']",
      "//div[@class='action-items']"
    ]
  };

  return (
    <>
      {/* Speakable Structured Data */}
      <Script
        id="speakable-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(speakableSchema, null, 2) 
        }}
      />
      
      {/* Bottom Line Answer Component - Premium Design */}
      <div 
        className={`bg-white rounded-2xl p-6 sm:p-8 lg:p-10 mb-8 border border-slate-200/60 shadow-lg shadow-slate-900/5 backdrop-blur-sm ${className}`}
      >
        {/* Question Title */}
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 leading-tight pt-1">
            {question}
          </h2>
        </div>
        
        {/* Core Answer */}
        <div className="bottom-line-answer bg-gradient-to-br from-slate-50 to-white rounded-xl p-6 sm:p-8 mb-6 border border-slate-100">
          <p className="text-lg sm:text-xl text-slate-700 leading-relaxed font-light">
            {answer}
          </p>
          
          {/* Age Range and Region Information */}
          {(ageRange || region) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {ageRange && (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100/50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {ageRange}
                </span>
              )}
              {region && (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-100/50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {region}
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Key Numbers */}
        {keyNumbers.length > 0 && (
          <div className="key-numbers bg-gradient-to-br from-blue-50/50 to-indigo-50/30 rounded-xl p-5 sm:p-6 mb-4 border border-blue-100/50">
            <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Key Numbers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {keyNumbers.map((number, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-blue-200/60 shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-slate-800 font-medium text-sm sm:text-base">{number}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Action Items */}
        {actionItems.length > 0 && (
          <div className="action-items bg-gradient-to-br from-green-50/50 to-emerald-50/30 rounded-xl p-5 sm:p-6 mb-4 border border-green-100/50">
            <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Action Items
            </h3>
            <ul className="space-y-3">
              {actionItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-sm mt-0.5">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </span>
                  <span className="text-slate-700 font-light leading-relaxed text-sm sm:text-base pt-0.5">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Authoritative Sources */}
        {sources.length > 0 && (
          <div className="sources bg-gradient-to-br from-slate-50 to-white rounded-xl p-5 sm:p-6 border border-slate-100/60">
            <h4 className="text-sm sm:text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Authoritative Sources
            </h4>
            <div className="flex flex-wrap gap-2">
              {sources.map((source, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-white border border-slate-200 text-slate-700 shadow-sm hover:shadow-md transition-shadow"
                >
                  {source}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Medical Disclaimer */}
        <div className="mt-6 p-4 bg-amber-50/50 border border-amber-200/60 rounded-xl">
          <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
            <strong className="font-semibold">Important:</strong> This information is for reference only and does not replace medical advice. Please consult your pediatrician for personalized guidance.
          </p>
        </div>
      </div>
    </>
  );
}

// 预设的常见问答模板
export const COMMON_ANSWERS = {
  // 维生素D补充
  vitaminD: {
    question: "我的母乳喂养宝宝需要维生素D补充剂吗？",
    answer: "是的，母乳喂养的婴儿通常需要维生素D补充剂。母乳中维生素D含量通常不足以满足婴儿需求，因此建议从出生后不久开始每天补充400 IU的维生素D。",
    keyNumbers: ["400 IU/day (0-12个月)", "600 IU/day (12-24个月)", "出生后不久开始"],
    actionItems: [
      "咨询儿科医生确定具体补充计划",
      "选择适合婴儿的维生素D滴剂",
      "坚持每天按时补充",
      "12个月后根据医生建议调整剂量"
    ],
    ageRange: "0-24个月",
    region: "北美",
    sources: ["CDC", "AAP", "Health Canada"]
  },
  
  // 固体食物引入
  solidFoods: {
    question: "什么时候可以开始给宝宝添加固体食物？",
    answer: "大多数婴儿在6个月左右可以开始添加固体食物，具体时间取决于发育就绪的信号。优先选择铁丰富的食物，如肉类、强化谷物等。",
    keyNumbers: ["约6个月", "1-2汤匙开始", "2-3餐/天"],
    actionItems: [
      "观察婴儿发育就绪信号",
      "从铁丰富的食物开始",
      "一次引入一种新食物",
      "保持母乳或配方奶作为主要营养"
    ],
    ageRange: "6-12个月",
    region: "北美",
    sources: ["CDC", "AAP", "WHO"]
  },
  
  // 婴儿睡眠
  sleep: {
    question: "新生儿需要睡多长时间？",
    answer: "新生儿通常每天需要14-17小时的睡眠，但每次睡眠时间较短，且没有固定的昼夜节律。建立安全的睡眠环境和规律的睡前程序有助于婴儿睡眠。",
    keyNumbers: ["14-17小时/天", "每次2-4小时", "仰卧睡眠"],
    actionItems: [
      "确保安全的睡眠环境",
      "建立规律的睡前程序",
      "识别婴儿的睡眠信号",
      "避免过度刺激"
    ],
    ageRange: "0-6个月",
    region: "北美",
    sources: ["AAP", "CDC", "Health Canada"]
  },
  
  // 牛奶过渡
  cowMilk: {
    question: "什么时候可以给宝宝喝牛奶？",
    answer: "在美国建议12个月后引入全脂牛奶，在加拿大可以在9-12个月之间引入（如果婴儿已经开始吃铁丰富的固体食物）。牛奶不应在12个月前作为主要饮料。",
    keyNumbers: ["美国: ≥12个月", "加拿大: 9-12个月", "全脂牛奶", "16-24盎司/天"],
    actionItems: [
      "确保婴儿已经开始吃铁丰富的固体食物",
      "从全脂牛奶开始",
      "限制每日牛奶摄入量",
      "继续提供多样化的固体食物"
    ],
    ageRange: "12-24个月",
    region: "北美",
    sources: ["CDC", "AAP", "Health Canada"]
  }
};

// 使用示例组件
export function CommonAnswer({ 
  type, 
  articleSlug 
}: { 
  type: keyof typeof COMMON_ANSWERS;
  articleSlug?: string;
}) {
  const answer = COMMON_ANSWERS[type];
  
  return (
    <BottomLineAnswer
      question={answer.question}
      answer={answer.answer}
      keyNumbers={answer.keyNumbers}
      actionItems={answer.actionItems}
      ageRange={answer.ageRange}
      region={answer.region}
      sources={answer.sources}
      articleSlug={articleSlug}
    />
  );
}

export default BottomLineAnswer;
