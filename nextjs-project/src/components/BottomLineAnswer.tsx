import React from 'react';
import Script from 'next/script';

interface BottomLineAnswerProps {
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
  
  // 生成Speakable结构化数据
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
      {/* Speakable结构化数据 */}
      <Script
        id="speakable-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(speakableSchema, null, 2) 
        }}
      />
      
      {/* 首屏即答案组件 */}
      <div 
        className={`bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-6 mb-8 border-l-4 border-emerald-500 ${className}`}
      >
        {/* 问题标题 */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {question}
        </h2>
        
        {/* 核心答案 */}
        <div className="bottom-line-answer bg-white rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-4">
              <span className="text-white font-bold text-lg">✓</span>
            </div>
            <div className="flex-1">
              <p className="text-lg text-gray-800 leading-relaxed font-medium">
                {answer}
              </p>
              
              {/* 年龄范围和地区信息 */}
              {(ageRange || region) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {ageRange && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      👶 {ageRange}
                    </span>
                  )}
                  {region && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      🌍 {region}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* 关键数字 */}
        {keyNumbers.length > 0 && (
          <div className="key-numbers bg-blue-50 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
              <span className="mr-2">📊</span>
              关键数字
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {keyNumbers.map((number, index) => (
                <div key={index} className="bg-white rounded-lg p-3 border border-blue-200">
                  <span className="text-blue-800 font-medium">{number}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* 行动要点 */}
        {actionItems.length > 0 && (
          <div className="action-items bg-green-50 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
              <span className="mr-2">🎯</span>
              行动要点
            </h3>
            <ul className="space-y-2">
              {actionItems.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </span>
                  <span className="text-green-800">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* 权威来源 */}
        {sources.length > 0 && (
          <div className="sources bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <span className="mr-2">📚</span>
              权威来源
            </h4>
            <div className="flex flex-wrap gap-2">
              {sources.map((source, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white border border-gray-200 text-gray-700"
                >
                  {source}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* 免责声明 */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>⚠️ 重要:</strong> 此信息仅供参考，不替代医疗建议。请咨询您的儿科医生获取个性化指导。
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
