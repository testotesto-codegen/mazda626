/**
 * Error Handling Utilities
 * Centralized error handling, logging, and user feedback functions
 */

/**
 * Error types for categorization
 */
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTH_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  SERVER: 'SERVER_ERROR',
  CLIENT: 'CLIENT_ERROR',
  FINANCIAL_DATA: 'FINANCIAL_DATA_ERROR',
  RATE_LIMIT: 'RATE_LIMIT_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

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
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
  constructor(message, type = ERROR_TYPES.UNKNOWN, severity = ERROR_SEVERITY.MEDIUM, details = {}) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.severity = severity;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.errorId = this.generateErrorId();
    
    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
  
  generateErrorId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      severity: this.severity,
      details: this.details,
      timestamp: this.timestamp,
      errorId: this.errorId,
      stack: this.stack
    };
  }
}

/**
 * Network error class for API-related errors
 */
export class NetworkError extends AppError {
  constructor(message, status, url, details = {}) {
    super(message, ERROR_TYPES.NETWORK, ERROR_SEVERITY.MEDIUM, {
      status,
      url,
      ...details
    });
    this.name = 'NetworkError';
    this.status = status;
    this.url = url;
  }
}

/**
 * Financial data error class for market data issues
 */
export class FinancialDataError extends AppError {
  constructor(message, symbol, dataType, details = {}) {
    super(message, ERROR_TYPES.FINANCIAL_DATA, ERROR_SEVERITY.HIGH, {
      symbol,
      dataType,
      ...details
    });
    this.name = 'FinancialDataError';
    this.symbol = symbol;
    this.dataType = dataType;
  }
}

/**
 * Parse and categorize different types of errors
 */
export const parseError = (error) => {
  // If it's already an AppError, return as is
  if (error instanceof AppError) {
    return error;
  }
  
  // Network/HTTP errors
  if (error.response) {
    const status = error.response.status;
    const url = error.config?.url || 'unknown';
    
    if (status === 401) {
      return new AppError(
        'Authentication required',
        ERROR_TYPES.AUTHENTICATION,
        ERROR_SEVERITY.HIGH,
        { status, url }
      );
    }
    
    if (status === 403) {
      return new AppError(
        'Access denied',
        ERROR_TYPES.AUTHORIZATION,
        ERROR_SEVERITY.HIGH,
        { status, url }
      );
    }
    
    if (status === 404) {
      return new AppError(
        'Resource not found',
        ERROR_TYPES.NOT_FOUND,
        ERROR_SEVERITY.MEDIUM,
        { status, url }
      );
    }
    
    if (status === 429) {
      return new AppError(
        'Too many requests. Please try again later.',
        ERROR_TYPES.RATE_LIMIT,
        ERROR_SEVERITY.MEDIUM,
        { status, url }
      );
    }
    
    if (status >= 500) {
      return new AppError(
        'Server error occurred',
        ERROR_TYPES.SERVER,
        ERROR_SEVERITY.HIGH,
        { status, url }
      );
    }
    
    return new NetworkError(
      error.response.data?.message || 'Network request failed',
      status,
      url
    );
  }
  
  // Network connection errors
  if (error.request) {
    return new AppError(
      'Network connection failed',
      ERROR_TYPES.NETWORK,
      ERROR_SEVERITY.HIGH,
      { request: error.request }
    );
  }
  
  // Timeout errors
  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    return new AppError(
      'Request timed out',
      ERROR_TYPES.TIMEOUT,
      ERROR_SEVERITY.MEDIUM,
      { originalError: error.message }
    );
  }
  
  // Generic JavaScript errors
  return new AppError(
    error.message || 'An unexpected error occurred',
    ERROR_TYPES.CLIENT,
    ERROR_SEVERITY.MEDIUM,
    { originalError: error.toString() }
  );
};

/**
 * Log error to console and external services
 */
export const logError = (error, context = {}) => {
  const parsedError = parseError(error);
  
  const logData = {
    ...parsedError.toJSON(),
    context,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    url: typeof window !== 'undefined' ? window.location.href : 'unknown',
    userId: context.userId || 'anonymous'
  };
  
  // Console logging based on severity
  switch (parsedError.severity) {
    case ERROR_SEVERITY.CRITICAL:
      console.error('🚨 CRITICAL ERROR:', logData);
      break;
    case ERROR_SEVERITY.HIGH:
      console.error('❌ HIGH SEVERITY ERROR:', logData);
      break;
    case ERROR_SEVERITY.MEDIUM:
      console.warn('⚠️ MEDIUM SEVERITY ERROR:', logData);
      break;
    case ERROR_SEVERITY.LOW:
      console.info('ℹ️ LOW SEVERITY ERROR:', logData);
      break;
    default:
      console.error('ERROR:', logData);
  }
  
  // Send to external error reporting service
  // This would be replaced with actual service integration
  if (typeof window !== 'undefined' && window.errorReportingService) {
    window.errorReportingService.captureException(parsedError, {
      extra: logData,
      tags: {
        type: parsedError.type,
        severity: parsedError.severity
      }
    });
  }
  
  return parsedError;
};

/**
 * Get user-friendly error message
 */
export const getUserFriendlyMessage = (error) => {
  const parsedError = parseError(error);
  
  const friendlyMessages = {
    [ERROR_TYPES.NETWORK]: 'Unable to connect to our servers. Please check your internet connection and try again.',
    [ERROR_TYPES.AUTHENTICATION]: 'Please log in to continue.',
    [ERROR_TYPES.AUTHORIZATION]: 'You don\'t have permission to access this resource.',
    [ERROR_TYPES.NOT_FOUND]: 'The requested information could not be found.',
    [ERROR_TYPES.SERVER]: 'Our servers are experiencing issues. Please try again in a few minutes.',
    [ERROR_TYPES.RATE_LIMIT]: 'You\'re making requests too quickly. Please wait a moment and try again.',
    [ERROR_TYPES.TIMEOUT]: 'The request took too long to complete. Please try again.',
    [ERROR_TYPES.FINANCIAL_DATA]: 'Unable to load financial data. Market data may be temporarily unavailable.',
    [ERROR_TYPES.VALIDATION]: 'Please check your input and try again.',
    [ERROR_TYPES.UNKNOWN]: 'An unexpected error occurred. Please try again.'
  };
  
  return friendlyMessages[parsedError.type] || parsedError.message;
};

/**
 * Retry mechanism with exponential backoff
 */
export const retryWithBackoff = async (
  fn,
  maxRetries = 3,
  baseDelay = 1000,
  maxDelay = 10000
) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on certain error types
      const parsedError = parseError(error);
      if ([
        ERROR_TYPES.AUTHENTICATION,
        ERROR_TYPES.AUTHORIZATION,
        ERROR_TYPES.NOT_FOUND,
        ERROR_TYPES.VALIDATION
      ].includes(parsedError.type)) {
        throw parsedError;
      }
      
      // If this was the last attempt, throw the error
      if (attempt === maxRetries) {
        throw parsedError;
      }
      
      // Calculate delay with exponential backoff and jitter
      const delay = Math.min(
        baseDelay * Math.pow(2, attempt) + Math.random() * 1000,
        maxDelay
      );
      
      console.warn(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`, parsedError);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

/**
 * Error boundary helper for React components
 */
export const createErrorHandler = (componentName, onError) => {
  return (error, errorInfo) => {
    const parsedError = parseError(error);
    const context = {
      component: componentName,
      errorInfo,
      timestamp: new Date().toISOString()
    };
    
    const loggedError = logError(parsedError, context);
    
    if (onError) {
      onError(loggedError, context);
    }
    
    return loggedError;
  };
};

/**
 * Async error handler for promises
 */
export const handleAsyncError = (promise, context = {}) => {
  return promise.catch(error => {
    const loggedError = logError(error, context);
    throw loggedError;
  });
};

/**
 * Global error handler setup
 */
export const setupGlobalErrorHandling = () => {
  // Handle unhandled promise rejections
  if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason;
      logError(error, { type: 'unhandledRejection' });
      
      // Prevent the default browser behavior
      event.preventDefault();
    });
    
    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      const error = new Error(event.message);
      error.stack = `${event.filename}:${event.lineno}:${event.colno}`;
      
      logError(error, { 
        type: 'uncaughtError',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });
  }
};

/**
 * Error recovery strategies
 */
export const ERROR_RECOVERY_STRATEGIES = {
  RETRY: 'retry',
  FALLBACK: 'fallback',
  IGNORE: 'ignore',
  REDIRECT: 'redirect',
  REFRESH: 'refresh'
};

/**
 * Get recommended recovery strategy for error type
 */
export const getRecoveryStrategy = (error) => {
  const parsedError = parseError(error);
  
  const strategies = {
    [ERROR_TYPES.NETWORK]: ERROR_RECOVERY_STRATEGIES.RETRY,
    [ERROR_TYPES.TIMEOUT]: ERROR_RECOVERY_STRATEGIES.RETRY,
    [ERROR_TYPES.SERVER]: ERROR_RECOVERY_STRATEGIES.RETRY,
    [ERROR_TYPES.RATE_LIMIT]: ERROR_RECOVERY_STRATEGIES.RETRY,
    [ERROR_TYPES.AUTHENTICATION]: ERROR_RECOVERY_STRATEGIES.REDIRECT,
    [ERROR_TYPES.NOT_FOUND]: ERROR_RECOVERY_STRATEGIES.FALLBACK,
    [ERROR_TYPES.FINANCIAL_DATA]: ERROR_RECOVERY_STRATEGIES.FALLBACK,
    [ERROR_TYPES.VALIDATION]: ERROR_RECOVERY_STRATEGIES.IGNORE
  };
  
  return strategies[parsedError.type] || ERROR_RECOVERY_STRATEGIES.REFRESH;
};

