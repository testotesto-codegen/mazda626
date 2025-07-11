import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Custom hook for managing market data
 * Provides centralized market data fetching and state management
 */
export const useMarketData = (symbols = [], options = {}) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const dispatch = useDispatch();
  const { isConnected } = useSelector(state => state.market || {});

  const {
    autoRefresh = true,
    refreshInterval = 30000, // 30 seconds
    includeHistorical = false,
    timeframe = '1D'
  } = options;

  const fetchMarketData = useCallback(async (symbolList) => {
    if (!symbolList.length) return;

    setLoading(true);
    setError(null);

    try {
      // Simulate API call - replace with actual market data API
      const response = await fetch(`/api/market/quotes?symbols=${symbolList.join(',')}&timeframe=${timeframe}`);
      
      if (!response.ok) {
        throw new Error(`Market data fetch failed: ${response.statusText}`);
      }

      const marketData = await response.json();
      
      setData(prevData => ({
        ...prevData,
        ...marketData.reduce((acc, quote) => {
          acc[quote.symbol] = {
            ...quote,
            timestamp: new Date().toISOString(),
            change: quote.price - quote.previousClose,
            changePercent: ((quote.price - quote.previousClose) / quote.previousClose) * 100
          };
          return acc;
        }, {})
      }));

      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
      console.error('Market data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [timeframe]);

  const refreshData = useCallback(() => {
    if (symbols.length > 0) {
      fetchMarketData(symbols);
    }
  }, [symbols, fetchMarketData]);

  const getQuote = useCallback((symbol) => {
    return data[symbol] || null;
  }, [data]);

  const getQuotes = useCallback((symbolList) => {
    return symbolList.map(symbol => data[symbol]).filter(Boolean);
  }, [data]);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh && symbols.length > 0 && isConnected) {
      const interval = setInterval(refreshData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, symbols, isConnected, refreshData, refreshInterval]);

  // Initial data fetch
  useEffect(() => {
    if (symbols.length > 0) {
      fetchMarketData(symbols);
    }
  }, [symbols, fetchMarketData]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refreshData,
    getQuote,
    getQuotes,
    isStale: lastUpdated && (Date.now() - lastUpdated.getTime()) > refreshInterval * 2
  };
};

export default useMarketData;

