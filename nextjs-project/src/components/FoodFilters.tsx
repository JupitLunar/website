'use client';

import React from 'react';

export interface FilterOptions {
  ageRange: string[];
  riskLevel: string[];
  feedingMethods: string[];
  nutrients: string[];
}

interface FoodFiltersProps {
  selectedFilters: FilterOptions;
  onFilterChange: (filterType: keyof FilterOptions, value: string) => void;
  onClearFilters: () => void;
}

const FoodFilters: React.FC<FoodFiltersProps> = ({
  selectedFilters,
  onFilterChange,
  onClearFilters
}) => {
  const hasActiveFilters = Object.values(selectedFilters).some(arr => arr.length > 0);

  const toggleFilter = (filterType: keyof FilterOptions, value: string) => {
    onFilterChange(filterType, value);
  };

  const isSelected = (filterType: keyof FilterOptions, value: string) => {
    return selectedFilters[filterType].includes(value);
  };

  return (
    <div className="bg-white rounded-xl border-2 border-gray-100 p-6 sticky top-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Age Range Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Starting Age
        </h3>
        <div className="space-y-2">
          {['6m+', '9m+', '12m+', '18m+', '24m+'].map(age => (
            <label key={age} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={isSelected('ageRange', age)}
                onChange={() => toggleFilter('ageRange', age)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="ml-3 text-gray-700 group-hover:text-gray-900">{age}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 my-6"></div>

      {/* Risk Level Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Choking Risk
        </h3>
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={isSelected('riskLevel', 'none')}
              onChange={() => toggleFilter('riskLevel', 'none')}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="ml-3 flex items-center gap-2 text-gray-700 group-hover:text-gray-900">
              <span className="text-green-600">✓</span>
              No Risk
            </span>
          </label>

          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={isSelected('riskLevel', 'low')}
              onChange={() => toggleFilter('riskLevel', 'low')}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="ml-3 flex items-center gap-2 text-gray-700 group-hover:text-gray-900">
              <span>🟢</span>
              Low Risk
            </span>
          </label>

          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={isSelected('riskLevel', 'medium')}
              onChange={() => toggleFilter('riskLevel', 'medium')}
              className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
            />
            <span className="ml-3 flex items-center gap-2 text-gray-700 group-hover:text-gray-900">
              <span>🟡</span>
              Medium Risk
            </span>
          </label>

          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={isSelected('riskLevel', 'high')}
              onChange={() => toggleFilter('riskLevel', 'high')}
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <span className="ml-3 flex items-center gap-2 text-gray-700 group-hover:text-gray-900">
              <span>🔴</span>
              High Risk
            </span>
          </label>
        </div>
      </div>

      <div className="border-t border-gray-200 my-6"></div>

      {/* Feeding Method Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Feeding Method
        </h3>
        <div className="space-y-2">
          {['BLW', 'puree', 'both'].map(method => (
            <label key={method} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={isSelected('feedingMethods', method)}
                onChange={() => toggleFilter('feedingMethods', method)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="ml-3 text-gray-700 group-hover:text-gray-900 capitalize">
                {method === 'BLW' ? 'Baby-Led Weaning' : method}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 my-6"></div>

      {/* Nutrition Focus Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Nutrition Focus
        </h3>
        <div className="space-y-2">
          {[
            'Iron-rich',
            'Vitamin C',
            'Protein',
            'Healthy Fats',
            'Fiber',
            'Calcium'
          ].map(nutrient => (
            <label key={nutrient} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={isSelected('nutrients', nutrient)}
                onChange={() => toggleFilter('nutrients', nutrient)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="ml-3 text-gray-700 group-hover:text-gray-900">{nutrient}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-600 mb-2">
            Active Filters ({Object.values(selectedFilters).flat().length})
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedFilters).map(([filterType, values]) =>
              values.map(value => (
                <span
                  key={`${filterType}-${value}`}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full"
                >
                  {value}
                  <button
                    onClick={() => toggleFilter(filterType as keyof FilterOptions, value)}
                    className="hover:text-purple-900"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodFilters;
