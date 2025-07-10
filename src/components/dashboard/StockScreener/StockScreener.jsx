import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiDownload, FiStar, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import ScreenerFilters from './ScreenerFilters';
import ScreenerResults from './ScreenerResults';
import PresetScreens from './PresetScreens';

const StockScreener = () => {
  const [filters, setFilters] = useState({
    marketCap: { min: '', max: '' },
    peRatio: { min: '', max: '' },
    priceToBook: { min: '', max: '' },
    dividendYield: { min: '', max: '' },
    volume: { min: '', max: '' },
    price: { min: '', max: '' },
    sector: 'all',
    exchange: 'all',
    country: 'all',
  });

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [savedScreens, setSavedScreens] = useState([]);
  const [showFilters, setShowFilters] = useState(true);

  // Mock data for demonstration
  const mockStocks = [
    {
      id: 1,
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 175.43,
      change: 2.15,
      changePercent: 1.24,
      marketCap: 2800000000000,
      peRatio: 28.5,
      priceToBook: 45.2,
      dividendYield: 0.52,
      volume: 45678900,
      sector: 'Technology',
      exchange: 'NASDAQ',
      country: 'US',
    },
    {
      id: 2,
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      price: 338.11,
      change: -1.23,
      changePercent: -0.36,
      marketCap: 2500000000000,
      peRatio: 32.1,
      priceToBook: 12.8,
      dividendYield: 0.68,
      volume: 23456789,
      sector: 'Technology',
      exchange: 'NASDAQ',
      country: 'US',
    },
    {
      id: 3,
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: 138.21,
      change: 3.45,
      changePercent: 2.56,
      marketCap: 1750000000000,
      peRatio: 25.3,
      priceToBook: 5.2,
      dividendYield: 0.0,
      volume: 34567890,
      sector: 'Technology',
      exchange: 'NASDAQ',
      country: 'US',
    },
    {
      id: 4,
      symbol: 'JPM',
      name: 'JPMorgan Chase & Co.',
      price: 147.89,
      change: 0.87,
      changePercent: 0.59,
      marketCap: 430000000000,
      peRatio: 12.4,
      priceToBook: 1.8,
      dividendYield: 2.45,
      volume: 12345678,
      sector: 'Financial Services',
      exchange: 'NYSE',
      country: 'US',
    },
    {
      id: 5,
      symbol: 'JNJ',
      name: 'Johnson & Johnson',
      price: 162.34,
      change: -0.45,
      changePercent: -0.28,
      marketCap: 425000000000,
      peRatio: 15.7,
      priceToBook: 6.1,
      dividendYield: 2.89,
      volume: 8765432,
      sector: 'Healthcare',
      exchange: 'NYSE',
      country: 'US',
    },
  ];

  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setResults(mockStocks);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (currentFilters) => {
    setIsLoading(true);
    
    setTimeout(() => {
      let filtered = [...mockStocks];

      // Apply market cap filter
      if (currentFilters.marketCap.min) {
        filtered = filtered.filter(stock => stock.marketCap >= parseFloat(currentFilters.marketCap.min) * 1000000000);
      }
      if (currentFilters.marketCap.max) {
        filtered = filtered.filter(stock => stock.marketCap <= parseFloat(currentFilters.marketCap.max) * 1000000000);
      }

      // Apply P/E ratio filter
      if (currentFilters.peRatio.min) {
        filtered = filtered.filter(stock => stock.peRatio >= parseFloat(currentFilters.peRatio.min));
      }
      if (currentFilters.peRatio.max) {
        filtered = filtered.filter(stock => stock.peRatio <= parseFloat(currentFilters.peRatio.max));
      }

      // Apply Price-to-Book filter
      if (currentFilters.priceToBook.min) {
        filtered = filtered.filter(stock => stock.priceToBook >= parseFloat(currentFilters.priceToBook.min));
      }
      if (currentFilters.priceToBook.max) {
        filtered = filtered.filter(stock => stock.priceToBook <= parseFloat(currentFilters.priceToBook.max));
      }

      // Apply dividend yield filter
      if (currentFilters.dividendYield.min) {
        filtered = filtered.filter(stock => stock.dividendYield >= parseFloat(currentFilters.dividendYield.min));
      }
      if (currentFilters.dividendYield.max) {
        filtered = filtered.filter(stock => stock.dividendYield <= parseFloat(currentFilters.dividendYield.max));
      }

      // Apply sector filter
      if (currentFilters.sector !== 'all') {
        filtered = filtered.filter(stock => stock.sector === currentFilters.sector);
      }

      // Apply exchange filter
      if (currentFilters.exchange !== 'all') {
        filtered = filtered.filter(stock => stock.exchange === currentFilters.exchange);
      }

      setResults(filtered);
      setIsLoading(false);
    }, 500);
  };

  const handleSaveScreen = (screenName) => {
    const newScreen = {
      id: Date.now(),
      name: screenName,
      filters: { ...filters },
      createdAt: new Date().toISOString(),
    };
    setSavedScreens([...savedScreens, newScreen]);
  };

  const handleLoadScreen = (screen) => {
    setFilters(screen.filters);
    applyFilters(screen.filters);
  };

  const handleExportResults = () => {
    const csvContent = [
      ['Symbol', 'Name', 'Price', 'Change %', 'Market Cap', 'P/E Ratio', 'P/B Ratio', 'Dividend Yield', 'Volume', 'Sector'].join(','),
      ...results.map(stock => [
        stock.symbol,
        `"${stock.name}"`,
        stock.price,
        stock.changePercent,
        stock.marketCap,
        stock.peRatio,
        stock.priceToBook,
        stock.dividendYield,
        stock.volume,
        stock.sector
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stock_screener_results.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stock Screener</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Find stocks that match your investment criteria
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 lg:mt-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <FiFilter className="w-4 h-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            <button
              onClick={handleExportResults}
              disabled={results.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            >
              <FiDownload className="w-4 h-4" />
              Export Results
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <PresetScreens
                  onLoadScreen={handleLoadScreen}
                  savedScreens={savedScreens}
                />
                <ScreenerFilters
                  filters={filters}
                  onFiltersChange={handleFilterChange}
                  onSaveScreen={handleSaveScreen}
                />
              </div>
            </div>
          )}

          {/* Results */}
          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Screening Results
                  </h2>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {results.length} stocks found
                    </span>
                    {isLoading && (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    )}
                  </div>
                </div>
              </div>
              
              <ScreenerResults 
                results={results} 
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockScreener;
