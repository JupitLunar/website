import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface FoodCardProps {
  slug: string;
  name: string;
  ageRange: string[];
  riskLevel: 'none' | 'low' | 'medium' | 'high';
  nutrientsFocus?: string[];
  imageUrl?: string;
}

const FoodCard: React.FC<FoodCardProps> = ({
  slug,
  name,
  ageRange,
  riskLevel,
  nutrientsFocus,
  imageUrl
}) => {
  // Risk level colors and labels
  const riskConfig = {
    none: { color: 'text-green-600 bg-green-50', label: 'No Risk', icon: '✓' },
    low: { color: 'text-green-600 bg-green-50', label: 'Low Risk', icon: '🟢' },
    medium: { color: 'text-yellow-600 bg-yellow-50', label: 'Medium Risk', icon: '🟡' },
    high: { color: 'text-red-600 bg-red-50', label: 'High Risk', icon: '🔴' }
  };

  const config = riskConfig[riskLevel];

  // Get minimum age
  const minAge = ageRange && ageRange.length > 0 ? ageRange[0] : 'TBD';

  return (
    <Link href={`/foods/${slug}`} className="block group">
      <div className="bg-white rounded-xl overflow-hidden border-2 border-gray-100 hover:border-purple-400 transition-all duration-300 hover:shadow-lg h-full">
        {/* Image Section */}
        <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          )}

          {/* Age Badge - Top Left */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-semibold rounded-full shadow-sm">
              {minAge}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Food Name */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-1">
            {name}
          </h3>

          {/* Risk Level Badge */}
          <div className="mb-3">
            <span className={`inline-flex items-center gap-1 px-2 py-1 ${config.color} text-xs font-medium rounded-full`}>
              <span>{config.icon}</span>
              <span>{config.label}</span>
            </span>
          </div>

          {/* Nutrients Focus (if available) */}
          {nutrientsFocus && nutrientsFocus.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {nutrientsFocus.slice(0, 2).map((nutrient, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded"
                >
                  {nutrient}
                </span>
              ))}
              {nutrientsFocus.length > 2 && (
                <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded">
                  +{nutrientsFocus.length - 2} more
                </span>
              )}
            </div>
          )}

          {/* View Details Link */}
          <div className="text-purple-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
            <span>View Details</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FoodCard;
