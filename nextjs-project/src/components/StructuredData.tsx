/**
 * 结构化数据组件 - 为AEO优化
 * Answer Engine Optimization (AEO) - 优化LLM和AI搜索引擎的内容发现
 */

interface ItemListItem {
  position: number;
  name: string;
  url: string;
  description?: string;
}

interface Props {
  items: ItemListItem[];
}

export function ArticleItemList({ items }: Props) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      item: {
        '@type': 'Article',
        name: item.name,
        url: item.url,
        description: item.description,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function DatasetStructuredData({ articles }: { articles: any[] }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Baby Care & Parenting Articles Database',
    description: 'Comprehensive database of evidence-based baby care articles from authoritative medical sources worldwide',
    url: 'https://jupitlunar.com/latest-articles',
    keywords: [
      'baby care',
      'parenting',
      'infant nutrition',
      'baby sleep',
      'child development',
      'breastfeeding',
      'pediatric advice'
    ],
    creator: {
      '@type': 'Organization',
      name: 'JupitLunar',
      url: 'https://jupitlunar.com'
    },
    distribution: {
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: 'https://jupitlunar.com/api/articles'
    },
    temporalCoverage: '2024/..',
    spatialCoverage: {
      '@type': 'Place',
      name: 'Global'
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
