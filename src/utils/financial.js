/**
 * Financial Utilities Module
 * Centralized financial calculations, formatting, and validation functions
 */

/**
 * Format currency values with proper localization
 * @param {number} value - The numeric value to format
 * @param {string} currency - Currency code (default: 'USD')
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @param {number} minimumFractionDigits - Minimum decimal places
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (
  value, 
  currency = 'USD', 
  locale = 'en-US',
  minimumFractionDigits = 2
) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '$0.00';
  }
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits,
      maximumFractionDigits: minimumFractionDigits
    }).format(value);
  } catch (error) {
    console.warn('Currency formatting error:', error);
    return `$${Number(value).toFixed(2)}`;
  }
};

/**
 * Format percentage values with proper precision
 * @param {number} value - The decimal value (0.1 = 10%)
 * @param {number} decimals - Number of decimal places (default: 2)
 * @param {boolean} showSign - Whether to show + for positive values
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 2, showSign = false) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0.00%';
  }
  
  const percentage = (value * 100).toFixed(decimals);
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${percentage}%`;
};

/**
 * Format large numbers with appropriate suffixes (K, M, B, T)
 * @param {number} value - The numeric value
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted number with suffix
 */
export const formatLargeNumber = (value, decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }
  
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  if (absValue >= 1e12) {
    return `${sign}${(absValue / 1e12).toFixed(decimals)}T`;
  } else if (absValue >= 1e9) {
    return `${sign}${(absValue / 1e9).toFixed(decimals)}B`;
  } else if (absValue >= 1e6) {
    return `${sign}${(absValue / 1e6).toFixed(decimals)}M`;
  } else if (absValue >= 1e3) {
    return `${sign}${(absValue / 1e3).toFixed(decimals)}K`;
  }
  
  return `${sign}${absValue.toFixed(decimals)}`;
};

/**
 * Calculate percentage change between two values
 * @param {number} oldValue - Original value
 * @param {number} newValue - New value
 * @returns {number} Percentage change as decimal (0.1 = 10% increase)
 */
export const calculatePercentageChange = (oldValue, newValue) => {
  if (!oldValue || oldValue === 0) {
    return newValue > 0 ? 1 : 0;
  }
  
  return (newValue - oldValue) / Math.abs(oldValue);
};

/**
 * Validate if a value is a valid financial number
 * @param {any} value - Value to validate
 * @returns {boolean} True if valid financial number
 */
export const isValidFinancialNumber = (value) => {
  if (value === null || value === undefined || value === '') {
    return false;
  }
  
  const num = Number(value);
  return !isNaN(num) && isFinite(num);
};

/**
 * Calculate compound annual growth rate (CAGR)
 * @param {number} beginningValue - Starting value
 * @param {number} endingValue - Ending value
 * @param {number} periods - Number of periods (years)
 * @returns {number} CAGR as decimal
 */
export const calculateCAGR = (beginningValue, endingValue, periods) => {
  if (!isValidFinancialNumber(beginningValue) || 
      !isValidFinancialNumber(endingValue) || 
      !isValidFinancialNumber(periods) ||
      beginningValue <= 0 || periods <= 0) {
    return 0;
  }
  
  return Math.pow(endingValue / beginningValue, 1 / periods) - 1;
};

/**
 * Calculate simple moving average
 * @param {number[]} values - Array of numeric values
 * @param {number} period - Period for moving average
 * @returns {number[]} Array of moving averages
 */
export const calculateMovingAverage = (values, period) => {
  if (!Array.isArray(values) || values.length < period) {
    return [];
  }
  
  const result = [];
  for (let i = period - 1; i < values.length; i++) {
    const slice = values.slice(i - period + 1, i + 1);
    const average = slice.reduce((sum, val) => sum + val, 0) / period;
    result.push(average);
  }
  
  return result;
};

/**
 * Calculate portfolio value from holdings
 * @param {Array} holdings - Array of {symbol, quantity, price} objects
 * @returns {number} Total portfolio value
 */
export const calculatePortfolioValue = (holdings) => {
  if (!Array.isArray(holdings)) {
    return 0;
  }
  
  return holdings.reduce((total, holding) => {
    const { quantity = 0, price = 0 } = holding;
    if (isValidFinancialNumber(quantity) && isValidFinancialNumber(price)) {
      return total + (quantity * price);
    }
    return total;
  }, 0);
};

/**
 * Format market cap with appropriate suffix
 * @param {number} marketCap - Market capitalization value
 * @returns {string} Formatted market cap string
 */
export const formatMarketCap = (marketCap) => {
  if (!isValidFinancialNumber(marketCap)) {
    return 'N/A';
  }
  
  return formatLargeNumber(marketCap, 2);
};

/**
 * Determine color class based on financial value change
 * @param {number} value - The value to evaluate
 * @param {boolean} inverse - Whether to inverse the color logic
 * @returns {string} CSS class name for color
 */
export const getFinancialColorClass = (value, inverse = false) => {
  if (!isValidFinancialNumber(value)) {
    return 'text-gray-500';
  }
  
  const isPositive = value > 0;
  const isNegative = value < 0;
  
  if (inverse) {
    if (isPositive) return 'text-red-600';
    if (isNegative) return 'text-green-600';
  } else {
    if (isPositive) return 'text-green-600';
    if (isNegative) return 'text-red-600';
  }
  
  return 'text-gray-500';
};

/**
 * Round to specified decimal places for financial calculations
 * @param {number} value - Value to round
 * @param {number} decimals - Number of decimal places
 * @returns {number} Rounded value
 */
export const roundFinancial = (value, decimals = 2) => {
  if (!isValidFinancialNumber(value)) {
    return 0;
  }
  
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

/**
 * Parse financial input string to number
 * @param {string} input - Input string (can contain $, %, commas)
 * @returns {number|null} Parsed number or null if invalid
 */
export const parseFinancialInput = (input) => {
  if (typeof input !== 'string') {
    return isValidFinancialNumber(input) ? Number(input) : null;
  }
  
  // Remove currency symbols, commas, and whitespace
  const cleaned = input.replace(/[$,%\s]/g, '');
  
  // Handle percentage
  const isPercentage = input.includes('%');
  const num = Number(cleaned);
  
  if (isNaN(num)) {
    return null;
  }
  
  return isPercentage ? num / 100 : num;
};

