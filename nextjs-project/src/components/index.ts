// Export all components for easier importing
export { BottomLineAnswer, CommonAnswer } from './BottomLineAnswer';
export { default as USCanadaComparison } from './USCanadaComparison';
export { default as CitationBox } from './CitationBox';
export { default as FoodCard } from './FoodCard';
export { default as FoodFilters } from './FoodFilters';
export { default as Header } from './Header';
export { default as LatestArticlesTable } from './LatestArticlesTable';
export { default as MedicalDisclaimer } from './MedicalDisclaimer';
export { default as NewsletterSignup } from './NewsletterSignup';
export { default as ContactChatbot } from './ContactChatbot';
export { ArticleItemList, DatasetStructuredData } from './StructuredData';
export { default as Analytics } from './Analytics';

// Layout components
export { default as Footer } from './layout/Footer';
export { default as LayoutHeader } from './layout/Header';

// KB components
export { default as KBDisclaimerNotice } from './kb/DisclaimerNotice';
export { default as KBFoodCard } from './kb/FoodCard';
export { default as KBGuideCard } from './kb/GuideCard';
export { default as KBRiskBadge } from './kb/RiskBadge';
export { default as KBRuleCard } from './kb/RuleCard';
export { default as KBSourceList } from './kb/SourceList';
export { default as KBSourceMeta } from './kb/SourceMeta';

// GEO components
export { default as ArticleCard } from './geo/ArticleCard';
export { default as ContentHubCard } from './geo/ContentHubCard';

// UI components
export { default as Button } from './ui/Button';
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/Card';

// Type exports for components that need them
export type { BottomLineAnswerProps as CommonAnswerType, BottomLineAnswerProps as CommonComparisonType } from './BottomLineAnswer';
