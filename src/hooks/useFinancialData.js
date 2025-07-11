import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  formatCurrency, 
  formatPercentage, 
  calculatePercentageChange,
  isValidFinancialNumber,
  calculatePortfolioValue 
} from '../utils/financial';

/**
 * Custom hook for managing financial data operations
 * Provides common financial calculations, formatting, and state management
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoRefresh - Whether to auto-refresh data
 * @param {number} options.refreshInterval - Refresh interval in milliseconds
 * @param {string} options.currency - Currency code for formatting
 * @returns {Object} Financial data utilities and state
 */
export const useFinancialData = ({
  autoRefresh = false,
  refreshInterval = 30000, // 30 seconds
  currency = 'USD'
} = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  /**
   * Format currency with the configured currency
   */
  const formatCurrencyValue = useCallback((value, options = {}) => {
    return formatCurrency(value, currency, 'en-US', options.decimals);
  }, [currency]);

  /**
   * Calculate and format percentage change
   */
  const calculateFormattedChange = useCallback((oldValue, newValue, options = {}) => {
    const change = calculatePercentageChange(oldValue, newValue);
    return {
      raw: change,
      formatted: formatPercentage(change, options.decimals, options.showSign),
      isPositive: change > 0,
      isNegative: change < 0
    };
  }, []);

  /**
   * Validate financial data object
   */
  const validateFinancialData = useCallback((dataObject) => {
    if (!dataObject || typeof dataObject !== 'object') {
      return { isValid: false, errors: ['Data must be an object'] };
    }

    const errors = [];
    const requiredFields = ['value', 'symbol'];
    
    requiredFields.forEach(field => {
      if (!(field in dataObject)) {
        errors.push(`Missing required field: ${field}`);
      }
    });

    if (dataObject.value !== undefined && !isValidFinancialNumber(dataObject.value)) {
      errors.push('Value must be a valid number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  /**
   * Update financial data with validation
   */
  const updateData = useCallback((newData) => {
    setError(null);
    
    const validation = validateFinancialData(newData);
    if (!validation.isValid) {
      setError(new Error(`Validation failed: ${validation.errors.join(', ')}`));
      return false;
    }

    setData(newData);
    setLastUpdated(new Date());
    return true;
  }, [validateFinancialData]);

  /**
   * Fetch financial data (placeholder for API integration)
   */
  const fetchData = useCallback(async (symbol) => {
    if (!symbol) {
      setError(new Error('Symbol is required'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // This would be replaced with actual API call
      // const response = await financialAPI.getQuote(symbol);
      
      // Simulated data for demonstration
      const simulatedData = {
        symbol: symbol.toUpperCase(),
        value: Math.random() * 1000 + 100,
        previousValue: Math.random() * 1000 + 100,
        volume: Math.floor(Math.random() * 1000000),
        timestamp: new Date().toISOString()
      };

      updateData(simulatedData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [updateData]);

  /**
   * Calculate portfolio metrics from holdings array
   */
  const calculatePortfolioMetrics = useCallback((holdings) => {
    if (!Array.isArray(holdings)) {
      return null;
    }

    const totalValue = calculatePortfolioValue(holdings);
    const totalCost = holdings.reduce((sum, holding) => {
      return sum + (holding.quantity * (holding.costBasis || 0));
    }, 0);

    const totalGainLoss = totalValue - totalCost;
    const totalGainLossPercent = totalCost > 0 ? totalGainLoss / totalCost : 0;

    return {
      totalValue,
      totalCost,
      totalGainLoss,
      totalGainLossPercent,
      formattedTotalValue: formatCurrencyValue(totalValue),
      formattedTotalCost: formatCurrencyValue(totalCost),
      formattedGainLoss: formatCurrencyValue(totalGainLoss),
      formattedGainLossPercent: formatPercentage(totalGainLossPercent, 2, true),
      isProfit: totalGainLoss > 0
    };
  }, [formatCurrencyValue]);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh || !data?.symbol) {
      return;
    }

    const interval = setInterval(() => {
      fetchData(data.symbol);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, data?.symbol, fetchData]);

  // Memoized computed values
  const computedData = useMemo(() => {
    if (!data) return null;

    const change = data.previousValue ? 
      calculateFormattedChange(data.previousValue, data.value) : null;

    return {
      ...data,
      formattedValue: formatCurrencyValue(data.value),
      change,
      isStale: lastUpdated && (Date.now() - lastUpdated.getTime()) > refreshInterval * 2
    };
  }, [data, formatCurrencyValue, calculateFormattedChange, lastUpdated, refreshInterval]);

  return {
    // State
    data: computedData,
    loading,
    error,
    lastUpdated,
    
    // Actions
    fetchData,
    updateData,
    
    // Utilities
    formatCurrencyValue,
    calculateFormattedChange,
    validateFinancialData,
    calculatePortfolioMetrics,
    
    // Computed
    hasData: !!data,
    hasError: !!error,
    isStale: computedData?.isStale || false
  };
};

/**
 * Hook for managing multiple financial instruments
 */
export const useMultipleFinancialData = (symbols = []) => {
  const [dataMap, setDataMap] = useState(new Map());
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(new Map());

  const fetchMultipleData = useCallback(async (symbolList = symbols) => {
    if (!Array.isArray(symbolList) || symbolList.length === 0) {
      return;
    }

    setLoading(true);
    const newDataMap = new Map();
    const newErrors = new Map();

    // Simulate fetching multiple symbols
    const promises = symbolList.map(async (symbol) => {
      try {
        // This would be replaced with actual API call
        const simulatedData = {
          symbol: symbol.toUpperCase(),
          value: Math.random() * 1000 + 100,
          previousValue: Math.random() * 1000 + 100,
          volume: Math.floor(Math.random() * 1000000),
          timestamp: new Date().toISOString()
        };
        
        newDataMap.set(symbol, simulatedData);
      } catch (error) {
        newErrors.set(symbol, error);
      }
    });

    await Promise.allSettled(promises);
    
    setDataMap(newDataMap);
    setErrors(newErrors);
    setLoading(false);
  }, [symbols]);

  const getDataForSymbol = useCallback((symbol) => {
    return dataMap.get(symbol) || null;
  }, [dataMap]);

  const getErrorForSymbol = useCallback((symbol) => {
    return errors.get(symbol) || null;
  }, [errors]);

  // Initial fetch
  useEffect(() => {
    if (symbols.length > 0) {
      fetchMultipleData();
    }
  }, [symbols, fetchMultipleData]);

  return {
    dataMap,
    loading,
    errors,
    fetchMultipleData,
    getDataForSymbol,
    getErrorForSymbol,
    hasData: dataMap.size > 0,
    hasErrors: errors.size > 0
  };
};

