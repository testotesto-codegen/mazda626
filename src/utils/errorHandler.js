/**
 * Error Handler Utilities - Centralized error handling and logging
 */

/**
 * Error types enum
 */
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  API: 'API_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTHENTICATION_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  SERVER: 'SERVER_ERROR',
  CLIENT: 'CLIENT_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
};

/**
 * Error severity levels
 */
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

/**
 * Custom error class with additional context
 */
export class AppError extends Error {
  constructor(message, type = ERROR_TYPES.UNKNOWN, severity = ERROR_SEVERITY.MEDIUM, context = {}) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.severity = severity;
    this.context = context;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Logs errors to console and external services
 * @param {Error} error - Error object
 * @param {Object} context - Additional context
 */
export const logError = (error, context = {}) => {
  const errorData = {
    message: error.message,
    name: error.name,
    stack: error.stack,
    type: error.type || ERROR_TYPES.UNKNOWN,
    severity: error.severity || ERROR_SEVERITY.MEDIUM,
    timestamp: new Date().toISOString(),
    context: {
      ...context,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
    },
  };

  // Console logging (development)
  if (process.env.NODE_ENV === 'development') {
    console.group(`🚨 ${errorData.severity.toUpperCase()} ERROR: ${errorData.type}`);
    console.error('Message:', errorData.message);
    console.error('Stack:', errorData.stack);
    console.error('Context:', errorData.context);
    console.groupEnd();
  }

  // External logging service (production)
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics/monitoring service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: errorData.message,
        fatal: errorData.severity === ERROR_SEVERITY.CRITICAL,
      });
    }

    // Send to error reporting service (e.g., Sentry, LogRocket, etc.)
    // This would be configured based on your error reporting service
    // Example: Sentry.captureException(error, { extra: errorData.context });
  }

  return errorData;
};

/**
 * Handles API errors and converts them to AppError instances
 * @param {Error} error - Original error
 * @param {Object} context - Request context
 * @returns {AppError} Formatted error
 */
export const handleApiError = (error, context = {}) => {
  let appError;

  if (error.status) {
    // HTTP errors
    switch (error.status) {
      case 400:
        appError = new AppError(
          error.message || 'Bad request',
          ERROR_TYPES.VALIDATION,
          ERROR_SEVERITY.MEDIUM,
          context
        );
        break;
      case 401:
        appError = new AppError(
          'Authentication required',
          ERROR_TYPES.AUTHENTICATION,
          ERROR_SEVERITY.HIGH,
          context
        );
        break;
      case 403:
        appError = new AppError(
          'Access denied',
          ERROR_TYPES.AUTHORIZATION,
          ERROR_SEVERITY.HIGH,
          context
        );
        break;
      case 404:
        appError = new AppError(
          'Resource not found',
          ERROR_TYPES.NOT_FOUND,
          ERROR_SEVERITY.MEDIUM,
          context
        );
        break;
      case 500:
        appError = new AppError(
          'Internal server error',
          ERROR_TYPES.SERVER,
          ERROR_SEVERITY.HIGH,
          context
        );
        break;
      default:
        appError = new AppError(
          error.message || 'API request failed',
          ERROR_TYPES.API,
          ERROR_SEVERITY.MEDIUM,
          context
        );
    }
  } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
    // Network errors
    appError = new AppError(
      'Network connection failed',
      ERROR_TYPES.NETWORK,
      ERROR_SEVERITY.HIGH,
      context
    );
  } else {
    // Unknown errors
    appError = new AppError(
      error.message || 'An unexpected error occurred',
      ERROR_TYPES.UNKNOWN,
      ERROR_SEVERITY.MEDIUM,
      context
    );
  }

  logError(appError, context);
  return appError;
};

/**
 * Gets user-friendly error message
 * @param {Error} error - Error object
 * @returns {string} User-friendly message
 */
export const getUserFriendlyMessage = (error) => {
  if (error instanceof AppError) {
    switch (error.type) {
      case ERROR_TYPES.NETWORK:
        return 'Please check your internet connection and try again.';
      case ERROR_TYPES.AUTHENTICATION:
        return 'Please log in to continue.';
      case ERROR_TYPES.AUTHORIZATION:
        return 'You don\'t have permission to perform this action.';
      case ERROR_TYPES.NOT_FOUND:
        return 'The requested resource could not be found.';
      case ERROR_TYPES.VALIDATION:
        return error.message; // Validation messages are usually user-friendly
      case ERROR_TYPES.SERVER:
        return 'Server is temporarily unavailable. Please try again later.';
      default:
        return 'Something went wrong. Please try again.';
    }
  }

  return 'An unexpected error occurred. Please try again.';
};

/**
 * Wraps async functions with error handling
 * @param {Function} fn - Async function to wrap
 * @param {Object} context - Error context
 * @returns {Function} Wrapped function
 */
export const withErrorHandling = (fn, context = {}) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      const appError = handleApiError(error, context);
      throw appError;
    }
  };
};

/**
 * Creates a retry wrapper for functions
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} delay - Delay between retries (ms)
 * @returns {Function} Function with retry logic
 */
export const withRetry = (fn, maxRetries = 3, delay = 1000) => {
  return async (...args) => {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          break;
        }

        // Don't retry certain error types
        if (error instanceof AppError) {
          if ([ERROR_TYPES.AUTHENTICATION, ERROR_TYPES.AUTHORIZATION, ERROR_TYPES.VALIDATION].includes(error.type)) {
            break;
          }
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
    
    throw lastError;
  };
};

/**
 * Debounced error handler to prevent spam
 */
let errorQueue = [];
let errorTimer = null;

export const debouncedErrorHandler = (error, context = {}, delay = 1000) => {
  errorQueue.push({ error, context });
  
  if (errorTimer) {
    clearTimeout(errorTimer);
  }
  
  errorTimer = setTimeout(() => {
    // Process all queued errors
    errorQueue.forEach(({ error, context }) => {
      logError(error, context);
    });
    
    errorQueue = [];
    errorTimer = null;
  }, delay);
};

