/**
 * Formatting utilities for financial data display
 * Provides consistent formatting across the application
 */

import { CURRENCIES, FORMAT_OPTIONS } from '../constants/financial';

/**
 * Format currency values
 * @param {number} value - The value to format
 * @param {string} currency - Currency code (default: USD)
 * @param {Object} options - Additional formatting options
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, currency = 'USD', options = {}) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '--';
  }

  const formatOptions = {
    ...FORMAT_OPTIONS.CURRENCY,
    currency,
    ...options
  };

  try {
    return new Intl.NumberFormat('en-US', formatOptions).format(value);
  } catch (error) {
    console.warn('Currency formatting error:', error);
    return `${CURRENCIES[currency]?.symbol || '$'}${value.toFixed(2)}`;
  }
};

/**
 * Format percentage values
 * @param {number} value - The value to format (as decimal, e.g., 0.05 for 5%)
 * @param {Object} options - Additional formatting options
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, options = {}) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '--';
  }

  const formatOptions = {
    ...FORMAT_OPTIONS.PERCENTAGE,
    ...options
  };

  try {
    // If value is already in percentage form (> 1 or < -1), convert to decimal
    const decimalValue = Math.abs(value) > 1 ? value / 100 : value;
    return new Intl.NumberFormat('en-US', formatOptions).format(decimalValue);
  } catch (error) {
    console.warn('Percentage formatting error:', error);
    return `${(value * 100).toFixed(2)}%`;
  }
};

/**
 * Format large numbers with compact notation
 * @param {number} value - The value to format
 * @param {Object} options - Additional formatting options
 * @returns {string} Formatted number string
 */
export const formatLargeNumber = (value, options = {}) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '--';
  }

  const formatOptions = {
    ...FORMAT_OPTIONS.LARGE_NUMBER,
    ...options
  };

  try {
    return new Intl.NumberFormat('en-US', formatOptions).format(value);
  } catch (error) {
    console.warn('Large number formatting error:', error);
    return value.toLocaleString();
  }
};

/**
 * Format decimal numbers
 * @param {number} value - The value to format
 * @param {number} decimals - Number of decimal places
 * @param {Object} options - Additional formatting options
 * @returns {string} Formatted decimal string
 */
export const formatDecimal = (value, decimals = 2, options = {}) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '--';
  }

  const formatOptions = {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    ...options
  };

  try {
    return new Intl.NumberFormat('en-US', formatOptions).format(value);
  } catch (error) {
    console.warn('Decimal formatting error:', error);
    return value.toFixed(decimals);
  }
};

/**
 * Format market cap values
 * @param {number} value - Market cap value
 * @returns {string} Formatted market cap string
 */
export const formatMarketCap = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '--';
  }

  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`;
  } else if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`;
  } else {
    return formatCurrency(value);
  }
};

/**
 * Format volume values
 * @param {number} value - Volume value
 * @returns {string} Formatted volume string
 */
export const formatVolume = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '--';
  }

  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`;
  } else if (value >= 1e3) {
    return `${(value / 1e3).toFixed(2)}K`;
  } else {
    return value.toLocaleString();
  }
};

/**
 * Format price change with color indication
 * @param {number} change - Price change value
 * @param {number} changePercent - Price change percentage
 * @param {string} currency - Currency code
 * @returns {Object} Formatted change object with color
 */
export const formatPriceChange = (change, changePercent, currency = 'USD') => {
  const formattedChange = formatCurrency(Math.abs(change), currency);
  const formattedPercent = formatPercentage(Math.abs(changePercent) / 100);
  
  const isPositive = change > 0;
  const isNegative = change < 0;
  const isNeutral = change === 0;

  const sign = isPositive ? '+' : isNegative ? '-' : '';
  const color = isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600';
  const bgColor = isPositive ? 'bg-green-50' : isNegative ? 'bg-red-50' : 'bg-gray-50';

  return {
    change: `${sign}${formattedChange}`,
    changePercent: `${sign}${formattedPercent}`,
    color,
    bgColor,
    isPositive,
    isNegative,
    isNeutral
  };
};

/**
 * Format date and time
 * @param {Date|string} date - Date to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDateTime = (date, options = {}) => {
  if (!date) return '--';

  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return '--';
  }

  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  };

  try {
    return new Intl.DateTimeFormat('en-US', defaultOptions).format(dateObj);
  } catch (error) {
    console.warn('Date formatting error:', error);
    return dateObj.toLocaleDateString();
  }
};

/**
 * Format time only
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted time string
 */
export const formatTime = (date) => {
  return formatDateTime(date, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

/**
 * Format date only
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  return formatDateTime(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {Date|string} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return '--';

  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return '--';
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  } else {
    return formatDate(dateObj);
  }
};

/**
 * Format financial ratio
 * @param {number} value - Ratio value
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted ratio string
 */
export const formatRatio = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '--';
  }

  if (value === Infinity || value === -Infinity) {
    return '∞';
  }

  return formatDecimal(value, decimals);
};

/**
 * Format shares/quantity
 * @param {number} value - Quantity value
 * @returns {string} Formatted quantity string
 */
export const formatShares = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '--';
  }

  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`;
  } else if (value >= 1e3) {
    return `${(value / 1e3).toFixed(2)}K`;
  } else {
    return value.toLocaleString();
  }
};

/**
 * Format basis points
 * @param {number} value - Value in basis points
 * @returns {string} Formatted basis points string
 */
export const formatBasisPoints = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '--';
  }

  return `${value.toFixed(0)} bps`;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) {
    return text || '';
  }

  return `${text.substring(0, maxLength)}...`;
};

export default {
  formatCurrency,
  formatPercentage,
  formatLargeNumber,
  formatDecimal,
  formatMarketCap,
  formatVolume,
  formatPriceChange,
  formatDateTime,
  formatTime,
  formatDate,
  formatRelativeTime,
  formatRatio,
  formatShares,
  formatBasisPoints,
  truncateText
};

