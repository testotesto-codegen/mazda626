import React, { useState } from 'react';
import { FiSave, FiRefreshCw } from 'react-icons/fi';

const ScreenerFilters = ({ filters, onFiltersChange, onSaveScreen }) => {
  const [saveScreenName, setSaveScreenName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);

  const sectors = [
    'all',
    'Technology',
    'Healthcare',
    'Financial Services',
    'Consumer Cyclical',
    'Communication Services',
    'Industrials',
    'Consumer Defensive',
    'Energy',
    'Utilities',
    'Real Estate',
    'Materials'
  ];

  const exchanges = ['all', 'NYSE', 'NASDAQ', 'AMEX'];

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters };
    
    if (filterType.includes('.')) {
      const [parent, child] = filterType.split('.');
      newFilters[parent] = { ...newFilters[parent], [child]: value };
    } else {
      newFilters[filterType] = value;
    }
    
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      marketCap: { min: '', max: '' },
      peRatio: { min: '', max: '' },
      priceToBook: { min: '', max: '' },
      dividendYield: { min: '', max: '' },
      volume: { min: '', max: '' },
      price: { min: '', max: '' },
      sector: 'all',
      exchange: 'all',
      country: 'all',
    };
    onFiltersChange(resetFilters);
  };

  const handleSaveScreen = () => {
    if (saveScreenName.trim()) {
      onSaveScreen(saveScreenName.trim());
      setSaveScreenName('');
      setShowSaveModal(false);
    }
  };

  const RangeInput = ({ label, filterKey, placeholder, suffix = '' }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          placeholder={`Min ${placeholder}`}
          value={filters[filterKey].min}
          onChange={(e) => handleFilterChange(`${filterKey}.min`, e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
        />
        <input
          type="number"
          placeholder={`Max ${placeholder}`}
          value={filters[filterKey].max}
          onChange={(e) => handleFilterChange(`${filterKey}.max`, e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
        />
      </div>
      {suffix && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{suffix}</p>
      )}
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSaveModal(true)}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Save Screen"
          >
            <FiSave className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Reset Filters"
          >
            <FiRefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Market Cap */}
        <RangeInput
          label="Market Cap"
          filterKey="marketCap"
          placeholder="Billion"
          suffix="Values in billions (e.g., 1 = $1B)"
        />

        {/* P/E Ratio */}
        <RangeInput
          label="P/E Ratio"
          filterKey="peRatio"
          placeholder="Ratio"
        />

        {/* Price-to-Book */}
        <RangeInput
          label="Price-to-Book"
          filterKey="priceToBook"
          placeholder="Ratio"
        />

        {/* Dividend Yield */}
        <RangeInput
          label="Dividend Yield (%)"
          filterKey="dividendYield"
          placeholder="Percent"
        />

        {/* Price Range */}
        <RangeInput
          label="Price Range ($)"
          filterKey="price"
          placeholder="Price"
        />

        {/* Volume */}
        <RangeInput
          label="Volume"
          filterKey="volume"
          placeholder="Volume"
          suffix="Daily trading volume"
        />

        {/* Sector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Sector
          </label>
          <select
            value={filters.sector}
            onChange={(e) => handleFilterChange('sector', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            {sectors.map(sector => (
              <option key={sector} value={sector}>
                {sector === 'all' ? 'All Sectors' : sector}
              </option>
            ))}
          </select>
        </div>

        {/* Exchange */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Exchange
          </label>
          <select
            value={filters.exchange}
            onChange={(e) => handleFilterChange('exchange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            {exchanges.map(exchange => (
              <option key={exchange} value={exchange}>
                {exchange === 'all' ? 'All Exchanges' : exchange}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Save Screen Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Save Screen
              </h3>
              <input
                type="text"
                placeholder="Enter screen name"
                value={saveScreenName}
                onChange={(e) => setSaveScreenName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white mb-4"
                onKeyPress={(e) => e.key === 'Enter' && handleSaveScreen()}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveScreen}
                  disabled={!saveScreenName.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenerFilters;
