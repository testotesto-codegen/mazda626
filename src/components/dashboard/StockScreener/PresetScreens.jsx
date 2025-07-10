import React from 'react';
import { FiPlay, FiTrash2 } from 'react-icons/fi';

const PresetScreens = ({ onLoadScreen, savedScreens }) => {
  const presetScreens = [
    {
      id: 'value-stocks',
      name: 'Value Stocks',
      description: 'Low P/E, high dividend yield',
      filters: {
        marketCap: { min: '1', max: '' },
        peRatio: { min: '', max: '15' },
        priceToBook: { min: '', max: '3' },
        dividendYield: { min: '2', max: '' },
        volume: { min: '', max: '' },
        price: { min: '', max: '' },
        sector: 'all',
        exchange: 'all',
        country: 'all',
      }
    },
    {
      id: 'growth-stocks',
      name: 'Growth Stocks',
      description: 'High growth potential',
      filters: {
        marketCap: { min: '500000000', max: '' },
        peRatio: { min: '20', max: '' },
        priceToBook: { min: '2', max: '' },
        dividendYield: { min: '', max: '2' },
        volume: { min: '1000000', max: '' },
        price: { min: '', max: '' },
        sector: 'Technology',
        exchange: 'all',
        country: 'all',
      }
    },
    {
      id: 'dividend-aristocrats',
      name: 'Dividend Aristocrats',
      description: 'High dividend yield stocks',
      filters: {
        marketCap: { min: '10', max: '' },
        peRatio: { min: '', max: '25' },
        priceToBook: { min: '', max: '' },
        dividendYield: { min: '3', max: '' },
        volume: { min: '', max: '' },
        price: { min: '', max: '' },
        sector: 'all',
        exchange: 'all',
        country: 'all',
      }
    },
    {
      id: 'small-cap-growth',
      name: 'Small Cap Growth',
      description: 'Small companies with growth potential',
      filters: {
        marketCap: { min: '0.3', max: '2' },
        peRatio: { min: '15', max: '40' },
        priceToBook: { min: '1', max: '5' },
        dividendYield: { min: '', max: '1' },
        volume: { min: '500000', max: '' },
        price: { min: '', max: '' },
        sector: 'all',
        exchange: 'all',
        country: 'all',
      }
    },
    {
      id: 'blue-chip',
      name: 'Blue Chip Stocks',
      description: 'Large, stable companies',
      filters: {
        marketCap: { min: '100', max: '' },
        peRatio: { min: '10', max: '30' },
        priceToBook: { min: '', max: '' },
        dividendYield: { min: '1', max: '' },
        volume: { min: '5000000', max: '' },
        price: { min: '', max: '' },
        sector: 'all',
        exchange: 'all',
        country: 'all',
      }
    },
    {
      id: 'undervalued',
      name: 'Undervalued Stocks',
      description: 'Potentially undervalued opportunities',
      filters: {
        marketCap: { min: '1', max: '' },
        peRatio: { min: '', max: '12' },
        priceToBook: { min: '', max: '1.5' },
        dividendYield: { min: '', max: '' },
        volume: { min: '1000000', max: '' },
        price: { min: '', max: '' },
        sector: 'all',
        exchange: 'all',
        country: 'all',
      }
    }
  ];

  const handleDeleteSavedScreen = (screenId) => {
    if (window.confirm('Are you sure you want to delete this saved screen?')) {
      // In a real app, this would dispatch an action to remove from Redux store
      console.log('Delete saved screen:', screenId);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Preset Screens
      </h3>
      
      <div className="space-y-3 mb-6">
        {presetScreens.map((screen) => (
          <div
            key={screen.id}
            className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {screen.name}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {screen.description}
                </p>
              </div>
              <button
                onClick={() => onLoadScreen(screen)}
                className="ml-3 p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                title="Load Screen"
              >
                <FiPlay className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {savedScreens.length > 0 && (
        <>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
              Saved Screens
            </h4>
            <div className="space-y-2">
              {savedScreens.map((screen) => (
                <div
                  key={screen.id}
                  className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                        {screen.name}
                      </h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Created {new Date(screen.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onLoadScreen(screen)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Load Screen"
                      >
                        <FiPlay className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSavedScreen(screen.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete Screen"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PresetScreens;
