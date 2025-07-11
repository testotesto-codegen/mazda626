import { useState, useEffect, useCallback, useRef } from 'react';
import { formatCurrency, formatPercentage, getFinancialColorClass } from '../utils/financial';

/**
 * Custom hook for managing market data and real-time updates
 * Handles market indices, sector performance, and market status
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.realTime - Enable real-time updates
 * @param {number} options.updateInterval - Update interval in milliseconds
 * @param {Array} options.indices - Market indices to track
 * @returns {Object} Market data and utilities
 */
export const useMarketData = ({
  realTime = false,
  updateInterval = 5000, // 5 seconds
  indices = ['SPY', 'QQQ', 'DIA']
} = {}) => {
  const [marketData, setMarketData] = useState({
    indices: new Map(),
    sectors: new Map(),
    marketStatus: 'closed',
    lastUpdated: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const wsRef = useRef(null);

  /**
   * Determine market status based on current time
   */
  const getMarketStatus = useCallback(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;
    
    // Market hours: 9:30 AM - 4:00 PM EST (simplified)
    const marketOpen = 9 * 60 + 30; // 9:30 AM
    const marketClose = 16 * 60; // 4:00 PM
    
    const isWeekday = now.getDay() >= 1 && now.getDay() <= 5;
    const isDuringMarketHours = currentTime >= marketOpen && currentTime < marketClose;
    
    if (!isWeekday) return 'closed';
    if (isDuringMarketHours) return 'open';
    if (currentTime < marketOpen) return 'pre-market';
    return 'after-hours';
  }, []);

  /**
   * Fetch market indices data
   */
  const fetchIndicesData = useCallback(async () => {
    try {
      const indicesData = new Map();
      
      // Simulate API calls for each index
      for (const symbol of indices) {
        // This would be replaced with actual API call
        const simulatedData = {
          symbol,
          price: Math.random() * 500 + 100,
          previousClose: Math.random() * 500 + 100,
          volume: Math.floor(Math.random() * 100000000),
          high: Math.random() * 520 + 110,
          low: Math.random() * 480 + 90,
          timestamp: new Date().toISOString()
        };
        
        // Calculate change
        const change = simulatedData.price - simulatedData.previousClose;
        const changePercent = change / simulatedData.previousClose;
        
        indicesData.set(symbol, {
          ...simulatedData,
          change,
          changePercent,
          formattedPrice: formatCurrency(simulatedData.price),
          formattedChange: formatCurrency(change),
          formattedChangePercent: formatPercentage(changePercent, 2, true),
          colorClass: getFinancialColorClass(change)
        });
      }
      
      return indicesData;
    } catch (err) {
      throw new Error(`Failed to fetch indices data: ${err.message}`);
    }
  }, [indices]);

  /**
   * Fetch sector performance data
   */
  const fetchSectorData = useCallback(async () => {
    try {
      const sectors = [
        'Technology', 'Healthcare', 'Financial', 'Consumer Discretionary',
        'Communication Services', 'Industrials', 'Consumer Staples',
        'Energy', 'Utilities', 'Real Estate', 'Materials'
      ];
      
      const sectorData = new Map();
      
      sectors.forEach(sector => {
        const performance = (Math.random() - 0.5) * 0.1; // -5% to +5%
        sectorData.set(sector, {
          name: sector,
          performance,
          formattedPerformance: formatPercentage(performance, 2, true),
          colorClass: getFinancialColorClass(performance)
        });
      });
      
      return sectorData;
    } catch (err) {
      throw new Error(`Failed to fetch sector data: ${err.message}`);
    }
  }, []);

  /**
   * Fetch all market data
   */
  const fetchMarketData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [indicesData, sectorData] = await Promise.all([
        fetchIndicesData(),
        fetchSectorData()
      ]);
      
      setMarketData({
        indices: indicesData,
        sectors: sectorData,
        marketStatus: getMarketStatus(),
        lastUpdated: new Date()
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [fetchIndicesData, fetchSectorData, getMarketStatus]);

  /**
   * Start real-time updates
   */
  const startRealTimeUpdates = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      if (getMarketStatus() === 'open') {
        fetchMarketData();
      }
    }, updateInterval);
  }, [fetchMarketData, getMarketStatus, updateInterval]);

  /**
   * Stop real-time updates
   */
  const stopRealTimeUpdates = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  /**
   * Get data for specific index
   */
  const getIndexData = useCallback((symbol) => {
    return marketData.indices.get(symbol) || null;
  }, [marketData.indices]);

  /**
   * Get top performing sectors
   */
  const getTopSectors = useCallback((count = 5) => {
    return Array.from(marketData.sectors.values())
      .sort((a, b) => b.performance - a.performance)
      .slice(0, count);
  }, [marketData.sectors]);

  /**
   * Get worst performing sectors
   */
  const getWorstSectors = useCallback((count = 5) => {
    return Array.from(marketData.sectors.values())
      .sort((a, b) => a.performance - b.performance)
      .slice(0, count);
  }, [marketData.sectors]);

  /**
   * Check if market is currently open
   */
  const isMarketOpen = useCallback(() => {
    return marketData.marketStatus === 'open';
  }, [marketData.marketStatus]);

  // Initial data fetch
  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  // Real-time updates management
  useEffect(() => {
    if (realTime) {
      startRealTimeUpdates();
    } else {
      stopRealTimeUpdates();
    }
    
    return () => stopRealTimeUpdates();
  }, [realTime, startRealTimeUpdates, stopRealTimeUpdates]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRealTimeUpdates();
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [stopRealTimeUpdates]);

  return {
    // Data
    marketData,
    loading,
    error,
    
    // Actions
    fetchMarketData,
    startRealTimeUpdates,
    stopRealTimeUpdates,
    
    // Utilities
    getIndexData,
    getTopSectors,
    getWorstSectors,
    isMarketOpen,
    getMarketStatus,
    
    // Computed
    hasData: marketData.indices.size > 0,
    hasError: !!error,
    isRealTime: !!intervalRef.current
  };
};

/**
 * Hook for managing watchlist data
 */
export const useWatchlist = (initialSymbols = []) => {
  const [watchlist, setWatchlist] = useState(new Set(initialSymbols));
  const [watchlistData, setWatchlistData] = useState(new Map());
  const [loading, setLoading] = useState(false);

  /**
   * Add symbol to watchlist
   */
  const addToWatchlist = useCallback((symbol) => {
    if (typeof symbol !== 'string' || !symbol.trim()) {
      return false;
    }
    
    const normalizedSymbol = symbol.toUpperCase().trim();
    setWatchlist(prev => new Set([...prev, normalizedSymbol]));
    return true;
  }, []);

  /**
   * Remove symbol from watchlist
   */
  const removeFromWatchlist = useCallback((symbol) => {
    const normalizedSymbol = symbol.toUpperCase().trim();
    setWatchlist(prev => {
      const newSet = new Set(prev);
      newSet.delete(normalizedSymbol);
      return newSet;
    });
    
    setWatchlistData(prev => {
      const newMap = new Map(prev);
      newMap.delete(normalizedSymbol);
      return newMap;
    });
  }, []);

  /**
   * Fetch data for all watchlist symbols
   */
  const fetchWatchlistData = useCallback(async () => {
    if (watchlist.size === 0) return;
    
    setLoading(true);
    const newData = new Map();
    
    try {
      const promises = Array.from(watchlist).map(async (symbol) => {
        // Simulate API call
        const data = {
          symbol,
          price: Math.random() * 200 + 50,
          previousClose: Math.random() * 200 + 50,
          volume: Math.floor(Math.random() * 10000000),
          timestamp: new Date().toISOString()
        };
        
        const change = data.price - data.previousClose;
        const changePercent = change / data.previousClose;
        
        return {
          ...data,
          change,
          changePercent,
          formattedPrice: formatCurrency(data.price),
          formattedChange: formatCurrency(change),
          formattedChangePercent: formatPercentage(changePercent, 2, true),
          colorClass: getFinancialColorClass(change)
        };
      });
      
      const results = await Promise.all(promises);
      results.forEach(data => {
        newData.set(data.symbol, data);
      });
      
      setWatchlistData(newData);
    } catch (error) {
      console.error('Failed to fetch watchlist data:', error);
    } finally {
      setLoading(false);
    }
  }, [watchlist]);

  /**
   * Clear entire watchlist
   */
  const clearWatchlist = useCallback(() => {
    setWatchlist(new Set());
    setWatchlistData(new Map());
  }, []);

  // Fetch data when watchlist changes
  useEffect(() => {
    fetchWatchlistData();
  }, [fetchWatchlistData]);

  return {
    watchlist: Array.from(watchlist),
    watchlistData,
    loading,
    addToWatchlist,
    removeFromWatchlist,
    clearWatchlist,
    fetchWatchlistData,
    size: watchlist.size,
    isEmpty: watchlist.size === 0
  };
};

