/**
 * Centralized Error Handling Utility
 * Provides consistent error logging, user-friendly messages, and recovery strategies
 */

/**
 * Error severity levels
 */
export const ERROR_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

/**
 * Error categories for better organization
 */
export const ERROR_CATEGORIES = {
  NETWORK: 'network',
  VALIDATION: 'validation',
  AUTHENTICATION: 'authentication',
  PERMISSION: 'permission',
  DATA: 'data',
  UI: 'ui',
  SYSTEM: 'system'
};

/**
 * Default error messages for different categories
 */
const DEFAULT_ERROR_MESSAGES = {
  [ERROR_CATEGORIES.NETWORK]: 'Network connection issue. Please check your internet connection and try again.',
  [ERROR_CATEGORIES.VALIDATION]: 'Please check your input and try again.',
  [ERROR_CATEGORIES.AUTHENTICATION]: 'Authentication failed. Please log in again.',
  [ERROR_CATEGORIES.PERMISSION]: 'You don\'t have permission to perform this action.',
  [ERROR_CATEGORIES.DATA]: 'There was an issue processing your data. Please try again.',
  [ERROR_CATEGORIES.UI]: 'Interface error occurred. Please refresh the page.',
  [ERROR_CATEGORIES.SYSTEM]: 'System error occurred. Please try again later.'
};

/**
 * Error handler class for managing application errors
 */
export class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.maxLogSize = 100;
    this.enableConsoleLogging = process.env.NODE_ENV === 'development';
  }

  /**
   * Log an error with context information
   * @param {Error|string} error - Error object or message
   * @param {Object} context - Additional context information
   * @param {string} level - Error severity level
   * @param {string} category - Error category
   */
  logError(error, context = {}, level = ERROR_LEVELS.MEDIUM, category = ERROR_CATEGORIES.SYSTEM) {
    const errorEntry = {
      timestamp: new Date().toISOString(),
      message: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : null,
      context,
      level,
      category,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'Unknown'
    };

    // Add to error log
    this.errorLog.unshift(errorEntry);
    
    // Maintain log size
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize);
    }

    // Console logging in development
    if (this.enableConsoleLogging) {
      const logMethod = this.getConsoleMethod(level);
      logMethod(`[${category.toUpperCase()}] ${errorEntry.message}`, {
        context,
        stack: errorEntry.stack
      });
    }

    // Send to external logging service in production
    if (process.env.NODE_ENV === 'production' && level === ERROR_LEVELS.CRITICAL) {
      this.sendToExternalLogger(errorEntry);
    }

    return errorEntry;
  }

  /**
   * Get appropriate console method based on error level
   * @param {string} level - Error level
   * @returns {Function} Console method
   */
  getConsoleMethod(level) {
    switch (level) {
      case ERROR_LEVELS.LOW:
        return console.info;
      case ERROR_LEVELS.MEDIUM:
        return console.warn;
      case ERROR_LEVELS.HIGH:
      case ERROR_LEVELS.CRITICAL:
        return console.error;
      default:
        return console.log;
    }
  }

  /**
   * Get user-friendly error message
   * @param {string} category - Error category
   * @param {string} customMessage - Custom error message
   * @returns {string} User-friendly error message
   */
  getUserFriendlyMessage(category, customMessage = null) {
    return customMessage || DEFAULT_ERROR_MESSAGES[category] || DEFAULT_ERROR_MESSAGES[ERROR_CATEGORIES.SYSTEM];
  }

  /**
   * Handle API errors with automatic retry logic
   * @param {Error} error - API error
   * @param {Function} retryFunction - Function to retry
   * @param {number} maxRetries - Maximum retry attempts
   * @param {number} delay - Delay between retries in ms
   * @returns {Promise} Promise that resolves with retry result
   */
  async handleApiError(error, retryFunction = null, maxRetries = 3, delay = 1000) {
    const errorEntry = this.logError(error, { maxRetries, delay }, ERROR_LEVELS.HIGH, ERROR_CATEGORIES.NETWORK);

    // Determine if error is retryable
    const isRetryable = this.isRetryableError(error);
    
    if (isRetryable && retryFunction && maxRetries > 0) {
      await this.delay(delay);
      try {
        return await retryFunction();
      } catch (retryError) {
        return this.handleApiError(retryError, retryFunction, maxRetries - 1, delay * 2);
      }
    }

    throw error;
  }

  /**
   * Check if an error is retryable
   * @param {Error} error - Error to check
   * @returns {boolean} True if retryable
   */
  isRetryableError(error) {
    if (!error.response) return true; // Network errors are retryable
    
    const status = error.response.status;
    return status >= 500 || status === 408 || status === 429; // Server errors, timeout, rate limit
  }

  /**
   * Delay utility for retry logic
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise} Promise that resolves after delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Send error to external logging service
   * @param {Object} errorEntry - Error entry to send
   */
  async sendToExternalLogger(errorEntry) {
    try {
      // Implement external logging service integration here
      // Example: Sentry, LogRocket, etc.
      console.log('Would send to external logger:', errorEntry);
    } catch (loggingError) {
      console.error('Failed to send error to external logger:', loggingError);
    }
  }

  /**
   * Get recent error logs
   * @param {number} limit - Number of recent errors to return
   * @returns {Array} Array of recent error entries
   */
  getRecentErrors(limit = 10) {
    return this.errorLog.slice(0, limit);
  }

  /**
   * Clear error log
   */
  clearErrorLog() {
    this.errorLog = [];
  }

  /**
   * Get error statistics
   * @returns {Object} Error statistics
   */
  getErrorStats() {
    const stats = {
      total: this.errorLog.length,
      byLevel: {},
      byCategory: {},
      recent: this.errorLog.slice(0, 5)
    };

    this.errorLog.forEach(error => {
      stats.byLevel[error.level] = (stats.byLevel[error.level] || 0) + 1;
      stats.byCategory[error.category] = (stats.byCategory[error.category] || 0) + 1;
    });

    return stats;
  }
}

/**
 * Global error handler instance
 */
export const globalErrorHandler = new ErrorHandler();

/**
 * Convenience functions for common error handling scenarios
 */

/**
 * Handle async function with error catching
 * @param {Function} asyncFn - Async function to execute
 * @param {Object} context - Context information
 * @returns {Promise} Promise that resolves with result or handles error
 */
export const withErrorHandling = async (asyncFn, context = {}) => {
  try {
    return await asyncFn();
  } catch (error) {
    globalErrorHandler.logError(error, context);
    throw error;
  }
};

/**
 * Create error boundary for React components
 * @param {Function} Component - React component
 * @param {Function} fallbackComponent - Fallback component for errors
 * @returns {Function} Enhanced component with error boundary
 */
export const withErrorBoundary = (Component, fallbackComponent = null) => {
  return class ErrorBoundaryWrapper extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      globalErrorHandler.logError(error, { errorInfo }, ERROR_LEVELS.HIGH, ERROR_CATEGORIES.UI);
    }

    render() {
      if (this.state.hasError) {
        return fallbackComponent ? 
          fallbackComponent(this.state.error) : 
          React.createElement('div', { className: 'error-fallback' }, 'Something went wrong.');
      }

      return React.createElement(Component, this.props);
    }
  };
};

/**
 * Validate and handle form errors
 * @param {Object} formData - Form data to validate
 * @param {Object} validationRules - Validation rules
 * @returns {Object} Validation result with errors
 */
export const validateFormData = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  Object.keys(validationRules).forEach(field => {
    const rules = validationRules[field];
    const value = formData[field];

    if (rules.required && (!value || value.toString().trim() === '')) {
      errors[field] = `${field} is required`;
      isValid = false;
    }

    if (value && rules.minLength && value.toString().length < rules.minLength) {
      errors[field] = `${field} must be at least ${rules.minLength} characters`;
      isValid = false;
    }

    if (value && rules.pattern && !rules.pattern.test(value)) {
      errors[field] = rules.message || `${field} format is invalid`;
      isValid = false;
    }
  });

  if (!isValid) {
    globalErrorHandler.logError('Form validation failed', { errors }, ERROR_LEVELS.LOW, ERROR_CATEGORIES.VALIDATION);
  }

  return { isValid, errors };
};

