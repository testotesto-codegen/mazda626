/**
 * Error handling utilities for the financial dashboard
 * Provides standardized error handling patterns and utilities
 */

/**
 * Custom error classes for different types of application errors
 */
export class APIError extends Error {
  constructor(message, status, endpoint) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.endpoint = endpoint;
  }
}

export class ValidationError extends Error {
  constructor(message, field, value) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
  }
}

export class MarketDataError extends Error {
  constructor(message, symbol, dataType) {
    super(message);
    this.name = 'MarketDataError';
    this.symbol = symbol;
    this.dataType = dataType;
  }
}

export class AuthenticationError extends Error {
  constructor(message, action) {
    super(message);
    this.name = 'AuthenticationError';
    this.action = action;
  }
}

/**
 * Error severity levels
 */
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

/**
 * Error categories for better organization
 */
export const ERROR_CATEGORIES = {
  API: 'api',
  VALIDATION: 'validation',
  MARKET_DATA: 'market_data',
  AUTHENTICATION: 'authentication',
  NETWORK: 'network',
  CALCULATION: 'calculation',
  UI: 'ui'
};

/**
 * Standardized error handler function
 * @param {Error} error - The error object
 * @param {Object} context - Additional context about where the error occurred
 * @param {Function} onError - Optional callback for custom error handling
 */
export const handleError = (error, context = {}, onError = null) => {
  const errorInfo = {
    message: error.message,
    name: error.name,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    context,
    severity: determineSeverity(error),
    category: determineCategory(error),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    url: typeof window !== 'undefined' ? window.location.href : 'server'
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error handled:', errorInfo);
  }

  // Send to error reporting service in production
  if (process.env.NODE_ENV === 'production') {
    reportError(errorInfo);
  }

  // Call custom error handler if provided
  if (onError && typeof onError === 'function') {
    onError(errorInfo);
  }

  return errorInfo;
};

/**
 * Determine error severity based on error type and context
 */
const determineSeverity = (error) => {
  if (error instanceof AuthenticationError) {
    return ERROR_SEVERITY.HIGH;
  }
  
  if (error instanceof APIError) {
    if (error.status >= 500) return ERROR_SEVERITY.CRITICAL;
    if (error.status >= 400) return ERROR_SEVERITY.MEDIUM;
    return ERROR_SEVERITY.LOW;
  }
  
  if (error instanceof MarketDataError) {
    return ERROR_SEVERITY.MEDIUM;
  }
  
  if (error instanceof ValidationError) {
    return ERROR_SEVERITY.LOW;
  }
  
  // Default for unknown errors
  return ERROR_SEVERITY.MEDIUM;
};

/**
 * Determine error category based on error type
 */
const determineCategory = (error) => {
  if (error instanceof APIError) return ERROR_CATEGORIES.API;
  if (error instanceof ValidationError) return ERROR_CATEGORIES.VALIDATION;
  if (error instanceof MarketDataError) return ERROR_CATEGORIES.MARKET_DATA;
  if (error instanceof AuthenticationError) return ERROR_CATEGORIES.AUTHENTICATION;
  
  // Try to categorize based on error message
  const message = error.message.toLowerCase();
  if (message.includes('network') || message.includes('fetch')) {
    return ERROR_CATEGORIES.NETWORK;
  }
  if (message.includes('calculation') || message.includes('math')) {
    return ERROR_CATEGORIES.CALCULATION;
  }
  
  return ERROR_CATEGORIES.UI;
};

/**
 * Report error to external service
 */
const reportError = async (errorInfo) => {
  try {
    await fetch('/api/errors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorInfo)
    });
  } catch (reportingError) {
    console.error('Failed to report error:', reportingError);
  }
};

/**
 * Async error handler wrapper for promises
 * @param {Promise} promise - The promise to wrap
 * @param {Object} context - Context information
 */
export const handleAsyncError = async (promise, context = {}) => {
  try {
    return await promise;
  } catch (error) {
    handleError(error, context);
    throw error; // Re-throw to allow caller to handle
  }
};

/**
 * Create user-friendly error messages
 * @param {Error} error - The error object
 * @returns {string} User-friendly error message
 */
export const getUserFriendlyMessage = (error) => {
  if (error instanceof ValidationError) {
    return `Please check your input for ${error.field}`;
  }
  
  if (error instanceof AuthenticationError) {
    return 'Please log in to continue';
  }
  
  if (error instanceof APIError) {
    switch (error.status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Please log in to access this feature.';
      case 403:
        return 'You don\'t have permission to perform this action.';
      case 404:
        return 'The requested information could not be found.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return 'Something went wrong. Please try again.';
    }
  }
  
  if (error instanceof MarketDataError) {
    return `Unable to load market data${error.symbol ? ` for ${error.symbol}` : ''}. Please try again.`;
  }
  
  // Default message for unknown errors
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Retry mechanism for failed operations
 * @param {Function} operation - The operation to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Delay between retries in milliseconds
 */
export const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        handleError(error, { 
          operation: operation.name || 'anonymous',
          attempt,
          maxRetries 
        });
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError;
};

/**
 * Debounced error handler to prevent spam
 */
const errorCache = new Map();
const DEBOUNCE_TIME = 5000; // 5 seconds

export const debouncedErrorHandler = (error, context = {}) => {
  const errorKey = `${error.name}:${error.message}`;
  const now = Date.now();
  
  if (errorCache.has(errorKey)) {
    const lastReported = errorCache.get(errorKey);
    if (now - lastReported < DEBOUNCE_TIME) {
      return; // Skip reporting this error
    }
  }
  
  errorCache.set(errorKey, now);
  handleError(error, context);
};

export default {
  handleError,
  handleAsyncError,
  getUserFriendlyMessage,
  retryOperation,
  debouncedErrorHandler,
  APIError,
  ValidationError,
  MarketDataError,
  AuthenticationError,
  ERROR_SEVERITY,
  ERROR_CATEGORIES
};

