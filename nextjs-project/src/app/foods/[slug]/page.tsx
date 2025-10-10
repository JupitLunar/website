import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { foodManager } from '@/lib/supabase';
import FoodCard from '@/components/FoodCard';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';
import CitationBox from '@/components/CitationBox';
import {
  generateFoodHowToSchema,
  generateBreadcrumbSchema,
  generateKeyTakeawaysSchema,
  generateFoodHealthTopicSchema,
  generateFAQSchema,
} from '@/lib/schema-generators';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function FoodDetailPage({ params }: PageProps) {
  const { slug } = params;

  // Fetch food data
  const food = await foodManager.getFoodBySlug(slug);

  if (!food) {
    notFound();
  }

  // Fetch related foods
  const relatedFoods = await foodManager.getRelatedFoods(food.id, 3);

  // Parse media
  const imageUrl = food.media && food.media.length > 0 ? food.media[0].url : null;

  // Generate Schema.org structured data
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Foods', url: '/foods' },
    { name: food.name, url: `/foods/${slug}` },
  ]);

  const howToSchema = generateFoodHowToSchema({
    name: food.name,
    slug: food.slug,
    serving_forms: food.serving_forms,
    how_to: food.how_to,
    risk_level: food.risk_level,
  });

  const healthTopicSchema = generateFoodHealthTopicSchema({
    name: food.name,
    slug: food.slug,
    age_range: food.age_range,
    nutrients_focus: food.nutrients_focus,
    risk_level: food.risk_level,
    last_reviewed_at: food.last_reviewed_at,
    expires_at: food.expires_at,
  });

  // Generate key takeaways
  const keyTakeaways = [
    food.age_range?.[0] && `Starting age: ${food.age_range[0]}`,
    food.risk_level && `Choking risk: ${food.risk_level}`,
    food.nutrients_focus?.length > 0 && `Rich in: ${food.nutrients_focus.slice(0, 2).join(', ')}`,
  ].filter(Boolean) as string[];

  const keyTakeawaysSchema = keyTakeaways.length > 0
    ? generateKeyTakeawaysSchema(keyTakeaways, food.name)
    : null;

  // Generate FAQ content based on food data
  const faqs = [
    {
      question: `When can I introduce ${food.name} to my baby?`,
      answer: food.age_range?.[0]
        ? `You can introduce ${food.name} starting from ${food.age_range[0]}. Always ensure your baby shows signs of readiness for solid foods and consult your pediatrician before introducing new foods.`
        : `Consult your pediatrician for guidance on when to introduce ${food.name}.`
    },
    food.risk_level && food.risk_level !== 'none' ? {
      question: `Is ${food.name} a choking hazard?`,
      answer: `${food.name} has a ${food.risk_level} choking risk. ${
        food.risk_level === 'high'
          ? 'Always supervise your child closely and ensure proper preparation according to age guidelines.'
          : 'Follow age-appropriate preparation methods and always supervise your child while eating.'
      }`
    } : null,
    food.why ? {
      question: `Why should I give ${food.name} to my baby?`,
      answer: food.why
    } : null,
    food.nutrients_focus?.length > 0 ? {
      question: `What nutrients does ${food.name} provide?`,
      answer: `${food.name} is a good source of ${food.nutrients_focus.slice(0, 3).join(', ')}. These nutrients support your baby's growth and development.`
    } : null,
  ].filter(Boolean) as Array<{ question: string; answer: string }>;

  const faqSchema = faqs.length > 0 ? generateFAQSchema(faqs) : null;

  // Risk level configuration
  const riskConfig = {
    none: {
      color: 'text-green-600 bg-green-50 border-green-200',
      label: 'No Choking Risk',
      icon: '✓',
      description: 'This food poses minimal choking risk when prepared correctly.'
    },
    low: {
      color: 'text-green-600 bg-green-50 border-green-200',
      label: 'Low Choking Risk',
      icon: '🟢',
      description: 'This food has a low choking risk when prepared according to age guidelines.'
    },
    medium: {
      color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      label: 'Medium Choking Risk',
      icon: '🟡',
      description: 'Take extra care with preparation. Cut into appropriate sizes and supervise closely.'
    },
    high: {
      color: 'text-red-600 bg-red-50 border-red-200',
      label: 'High Choking Risk',
      icon: '🔴',
      description: 'Requires careful preparation and constant supervision. Follow age-specific guidelines strictly.'
    }
  };

  const riskInfo = riskConfig[food.risk_level as keyof typeof riskConfig];

  // Parse serving forms (age-specific preparation)
  const servingForms = food.serving_forms || [];

  // Parse how-to instructions
  const howToInstructions = food.how_to || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto max-w-7xl px-4 sm:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-purple-600">Home</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/foods" className="hover:text-purple-600">Foods</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">{food.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-white py-12 px-4 sm:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: Image */}
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={food.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-32 h-32 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Info */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {food.name}
              </h1>

              {/* At-a-Glance Info */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {/* Starting Age */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <div className="text-sm text-blue-600 font-semibold mb-1">Starting Age</div>
                  <div className="text-2xl font-bold text-blue-900">
                    {food.age_range && food.age_range.length > 0 ? food.age_range[0] : 'TBD'}
                  </div>
                </div>

                {/* Choking Risk */}
                <div className={`border-2 rounded-xl p-4 ${riskInfo.color}`}>
                  <div className="text-sm font-semibold mb-1">Choking Risk</div>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    <span>{riskInfo.icon}</span>
                    <span className="capitalize">{food.risk_level}</span>
                  </div>
                </div>
              </div>

              {/* Risk Description */}
              {riskInfo.description && (
                <div className={`border-2 rounded-xl p-4 mb-6 ${riskInfo.color}`}>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm">{riskInfo.description}</p>
                  </div>
                </div>
              )}

              {/* Nutrition Focus */}
              {food.nutrients_focus && food.nutrients_focus.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Nutrition Highlights
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {food.nutrients_focus.map((nutrient: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-purple-100 text-purple-700 text-sm font-medium rounded-full"
                      >
                        {nutrient}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Why This Food */}
              {food.why && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Why This Food?
                  </h3>
                  <p className="text-gray-700">{food.why}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Key Takeaways - Structured for AI/LLM extraction */}
      {keyTakeaways.length > 0 && (
        <section className="py-8 px-4 sm:px-8 bg-gradient-to-br from-purple-50 to-pink-50" itemScope itemType="https://schema.org/ItemList">
          <div className="container mx-auto max-w-7xl">
            <meta itemProp="name" content={`${food.name} - Quick Facts`} />
            <div className="bg-white rounded-2xl border-2 border-purple-200 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Quick Facts
              </h2>
              <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {keyTakeaways.map((fact: string, index: number) => (
                  <li
                    key={index}
                    itemProp="itemListElement"
                    itemScope
                    itemType="https://schema.org/ListItem"
                    className="flex items-start gap-3 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200"
                  >
                    <meta itemProp="position" content={String(index + 1)} />
                    <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span itemProp="name" className="text-gray-900 font-medium">{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Preparation Guide by Age */}
      {servingForms && servingForms.length > 0 && (
        <section className="py-12 px-4 sm:px-8 bg-white">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Age-Specific Preparation Guide
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servingForms.map((form: any, index: number) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-blue-600 text-white text-sm font-bold rounded-full">
                      {form.age_range}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700">Form:</span>
                      <span className="ml-2 text-gray-900">{form.form}</span>
                    </div>

                    {form.texture && (
                      <div>
                        <span className="font-semibold text-gray-700">Texture:</span>
                        <span className="ml-2 text-gray-900">{form.texture}</span>
                      </div>
                    )}

                    {form.prep && (
                      <div>
                        <span className="font-semibold text-gray-700">Preparation:</span>
                        <p className="mt-1 text-gray-900">{form.prep}</p>
                      </div>
                    )}

                    {form.notes && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <p className="text-gray-700 italic">{form.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Do's and Don'ts */}
      <section className="py-12 px-4 sm:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Do's */}
            {food.do_list && food.do_list.length > 0 && (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-green-900 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Do's
                </h3>
                <ul className="space-y-3">
                  {food.do_list.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-900">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Don'ts */}
            {food.dont_list && food.dont_list.length > 0 && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-red-900 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Don'ts
                </h3>
                <ul className="space-y-3">
                  {food.dont_list.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-900">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Portion Hint */}
          {food.portion_hint && (
            <div className="mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-yellow-900 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                Portion Guidance
              </h3>
              <p className="text-gray-900">{food.portion_hint}</p>
            </div>
          )}
        </div>
      </section>

      {/* How-To Instructions */}
      {howToInstructions && howToInstructions.length > 0 && (
        <section className="py-12 px-4 sm:px-8 bg-white">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Step-by-Step Instructions
            </h2>

            <div className="space-y-4">
              {howToInstructions.map((instruction: any, index: number) => (
                <div key={index} className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                      {instruction.step || index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      {instruction.title}
                    </h4>
                    {instruction.description && (
                      <p className="text-gray-700">{instruction.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sources */}
      {food.kb_sources && food.kb_sources.length > 0 && (
        <section className="py-12 px-4 sm:px-8 bg-white">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              Sources & References
            </h2>

            <div className="space-y-3">
              {food.kb_sources.map((source: any, index: number) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{source.name}</h4>
                      {source.organization && (
                        <p className="text-sm text-gray-600 mb-2">{source.organization}</p>
                      )}
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                      >
                        View Source
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      source.grade === 'A' ? 'bg-green-100 text-green-800' :
                      source.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                      source.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      Grade {source.grade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section - Structured for AI extraction */}
      {faqs.length > 0 && (
        <section className="py-12 px-4 sm:px-8 bg-gradient-to-br from-indigo-50 to-purple-50" itemScope itemType="https://schema.org/FAQPage">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {faqs.map((faq: any, index: number) => (
                <details
                  key={index}
                  className="bg-white border-2 border-purple-200 rounded-xl overflow-hidden group"
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <summary className="cursor-pointer px-6 py-4 bg-gradient-to-r from-white to-purple-50 hover:from-purple-50 hover:to-purple-100 transition-colors font-semibold text-gray-900 flex items-center justify-between">
                    <span itemProp="name">{faq.question}</span>
                    <svg className="w-5 h-5 text-purple-600 flex-shrink-0 ml-4 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div
                    className="px-6 py-4 text-gray-700 bg-white border-t border-purple-100"
                    itemScope
                    itemProp="acceptedAnswer"
                    itemType="https://schema.org/Answer"
                  >
                    <p itemProp="text">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>

            <div className="mt-6 bg-white border-2 border-blue-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-gray-700">
                  <strong>Still have questions?</strong> Every child develops differently. Always consult your pediatrician for personalized guidance on introducing new foods to your baby.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Foods */}
      {relatedFoods && relatedFoods.length > 0 && (
        <section className="py-12 px-4 sm:px-8">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Foods</h2>

            <div className="grid md:grid-cols-3 gap-6">
              {relatedFoods.map((relatedFood) => (
                <FoodCard
                  key={relatedFood.id}
                  slug={relatedFood.slug}
                  name={relatedFood.name}
                  ageRange={relatedFood.age_range || []}
                  riskLevel={relatedFood.risk_level}
                  nutrientsFocus={relatedFood.nutrients_focus}
                  imageUrl={relatedFood.media && relatedFood.media.length > 0 ? relatedFood.media[0].url : undefined}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Medical Disclaimer & Citation */}
      <section className="py-12 px-4 sm:px-8">
        <div className="container mx-auto max-w-4xl space-y-6">
          <MedicalDisclaimer
            lastReviewed={food.last_reviewed_at}
            nextReview={food.expires_at}
          />

          <CitationBox
            title={`${food.name} for Babies and Toddlers`}
            url={`https://momaiagent.com/foods/${slug}`}
            lastReviewed={food.last_reviewed_at}
            siteName="JupitLunar"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Explore More Foods</h2>
          <p className="text-xl text-purple-100 mb-8">
            Browse our complete database of 400+ foods with age-specific preparation guides
          </p>
          <Link
            href="/foods"
            className="inline-block px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Back to Food Database
          </Link>
        </div>
      </section>
    </div>
  );
}
