import React from 'react';
import Script from 'next/script';

interface ComparisonData {
  [key: string]: string;
}

interface USCanadaComparisonProps {
  topic: string;
  usData: ComparisonData;
  caData: ComparisonData;
  articleSlug?: string;
  className?: string;
}

export function USCanadaComparison({ 
  topic, 
  usData, 
  caData, 
  articleSlug,
  className = ""
}: USCanadaComparisonProps) {
  
  // 生成结构化数据
  const comparisonSchema = {
    "@context": "https://schema.org",
    "@type": "Table",
    "@id": `https://www.momaiagent.com/${articleSlug || 'comparison'}#us-canada-comparison`,
    "name": `US vs Canada: ${topic}`,
    "description": `Comparison of ${topic} guidelines between United States and Canada`,
    "about": topic,
    "hasPart": Object.keys(usData).map((key, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "TableCell",
        "name": key,
        "description": `Comparison of ${key} between US and Canada`,
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "United States",
            "value": usData[key]
          },
          {
            "@type": "PropertyValue", 
            "name": "Canada",
            "value": caData[key]
          }
        ]
      }
    })),
    "isPartOf": {
      "@type": "WebPage",
      "url": `https://www.momaiagent.com/${articleSlug || ''}`
    }
  };

  return (
    <>
      {/* 结构化数据 */}
      <Script
        id="us-canada-comparison-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(comparisonSchema, null, 2) 
        }}
      />
      
      {/* 对比表格组件 */}
      <div 
        id="us-canada-comparison"
        className={`bg-gradient-to-r from-blue-50 to-red-50 rounded-xl p-6 mb-8 border border-gray-200 ${className}`}
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          🇺🇸 US vs 🇨🇦 Canada: {topic}
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-6 py-4 text-left font-semibold text-gray-700">
                  Aspect
                </th>
                <th className="border border-gray-300 px-6 py-4 text-center font-semibold text-blue-700">
                  🇺🇸 United States
                  <br />
                  <span className="text-xs font-normal text-gray-600">(CDC/AAP)</span>
                </th>
                <th className="border border-gray-300 px-6 py-4 text-center font-semibold text-red-700">
                  🇨🇦 Canada
                  <br />
                  <span className="text-xs font-normal text-gray-600">(Health Canada)</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(usData).map((key, index) => (
                <tr key={key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-300 px-6 py-4 font-medium text-gray-900">
                    {key}
                  </td>
                  <td className="border border-gray-300 px-6 py-4 text-gray-700">
                    <div className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{usData[key]}</span>
                    </div>
                  </td>
                  <td className="border border-gray-300 px-6 py-4 text-gray-700">
                    <div className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{caData[key]}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* 免责声明 */}
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>📋 重要说明:</strong> 这些是一般性指南，具体情况可能因个体差异而有所不同。
            请咨询您的儿科医生获取个性化建议。本内容基于官方政府指南，不构成医疗建议。
          </p>
        </div>
        
        {/* 来源链接 */}
        <div className="mt-4 text-xs text-gray-600">
          <p>
            <strong>来源:</strong> 
            <a 
              href="https://www.cdc.gov/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 ml-1"
            >
              CDC
            </a>
            , 
            <a 
              href="https://www.aap.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 ml-1"
            >
              AAP
            </a>
            , 
            <a 
              href="https://www.canada.ca/en/health-canada.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-800 ml-1"
            >
              Health Canada
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

// 预设的常见对比数据
export const COMMON_COMPARISONS = {
  // 维生素D补充
  vitaminD: {
    usData: {
      "推荐剂量": "400 IU/day (0-12个月), 600 IU/day (12-24个月)",
      "开始时间": "出生后不久",
      "适用人群": "母乳喂养和混合喂养的婴儿",
      "配方奶": "通常不需要额外补充（已强化）",
      "医生建议": "咨询儿科医生确定具体需求"
    },
    caData: {
      "推荐剂量": "400 IU/day (0-12个月)",
      "开始时间": "出生后",
      "适用人群": "纯母乳喂养和部分母乳喂养的婴儿",
      "配方奶": "通常不需要额外补充（已强化）",
      "医生建议": "高风险婴儿可能需要更高剂量"
    }
  },
  
  // 铁补充
  iron: {
    usData: {
      "推荐剂量": "1 mg/kg/day (4个月开始)",
      "开始时间": "4个月或当开始添加辅食时",
      "适用人群": "纯母乳喂养的婴儿",
      "持续时间": "直到铁丰富的辅食建立",
      "监测": "常规血液检查"
    },
    caData: {
      "推荐剂量": "个体化评估",
      "开始时间": "6个月或当开始添加辅食时",
      "适用人群": "有风险因素的婴儿",
      "持续时间": "根据个体需要",
      "监测": "定期评估铁状态"
    }
  },
  
  // 固体食物引入
  solidFoods: {
    usData: {
      "开始时间": "约6个月（发育就绪时）",
      "首选食物": "铁丰富的食物（肉类、强化谷物）",
      "食物顺序": "无固定顺序，优先铁丰富食物",
      "频率": "逐渐增加到2-3餐/天",
      "份量": "开始时1-2汤匙"
    },
    caData: {
      "开始时间": "约6个月",
      "首选食物": "铁丰富的肉类和强化谷物",
      "食物顺序": "铁丰富的肉类和谷物作为首选",
      "频率": "6-12个月每天多次提供",
      "份量": "小量开始，逐渐增加"
    }
  },
  
  // 牛奶过渡
  cowMilk: {
    usData: {
      "引入时间": "≥12个月",
      "类型": "全脂牛奶",
      "转为低脂": "≥24个月",
      "每日限制": "16-24盎司",
      "注意事项": "确保铁丰富饮食"
    },
    caData: {
      "引入时间": "9-12个月（如果铁丰富饮食建立）",
      "类型": "3.25%均质牛奶",
      "转为低脂": "≥2岁",
      "每日限制": "500-750毫升",
      "注意事项": "强调铁丰富的固体食物"
    }
  }
};

// 使用示例组件
export function CommonComparison({ 
  type, 
  topic, 
  articleSlug 
}: { 
  type: keyof typeof COMMON_COMPARISONS;
  topic: string;
  articleSlug?: string;
}) {
  const comparison = COMMON_COMPARISONS[type];
  
  return (
    <USCanadaComparison
      topic={topic}
      usData={comparison.usData}
      caData={comparison.caData}
      articleSlug={articleSlug}
    />
  );
}

export default USCanadaComparison;
