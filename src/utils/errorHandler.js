import toast from './toastNotifications';

/**
 * Centralized error handling utility
 * Provides consistent error handling patterns across the application
 */

/**
 * Error types for categorization
 */
export const ErrorTypes = {
  NETWORK: 'NETWORK',
  API: 'API',
  VALIDATION: 'VALIDATION',
  AUTHENTICATION: 'AUTHENTICATION',
  AUTHORIZATION: 'AUTHORIZATION',
  NOT_FOUND: 'NOT_FOUND',
  SERVER: 'SERVER',
  CLIENT: 'CLIENT',
  UNKNOWN: 'UNKNOWN',
};

/**
 * Error severity levels
 */
export const ErrorSeverity = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
};

/**
 * Determines error type from error object
 * @param {Error|Object} error - Error object
 * @returns {string} - Error type
 */
const determineErrorType = (error) => {
  if (!error) return ErrorTypes.UNKNOWN;

  // Network errors
  if (error.message?.includes('Network Error') || error.code === 'NETWORK_ERROR') {
    return ErrorTypes.NETWORK;
  }

  // API errors based on status code
  if (error.response?.status) {
    const status = error.response.status;
    if (status === 401) return ErrorTypes.AUTHENTICATION;
    if (status === 403) return ErrorTypes.AUTHORIZATION;
    if (status === 404) return ErrorTypes.NOT_FOUND;
    if (status >= 400 && status < 500) return ErrorTypes.CLIENT;
    if (status >= 500) return ErrorTypes.SERVER;
    return ErrorTypes.API;
  }

  // Validation errors
  if (error.name === 'ValidationError' || error.type === 'validation') {
    return ErrorTypes.VALIDATION;
  }

  return ErrorTypes.UNKNOWN;
};

/**
 * Determines error severity
 * @param {string} errorType - Error type
 * @param {Error|Object} error - Error object
 * @returns {string} - Error severity
 */
const determineErrorSeverity = (errorType, error) => {
  switch (errorType) {
    case ErrorTypes.NETWORK:
      return ErrorSeverity.HIGH;
    case ErrorTypes.AUTHENTICATION:
    case ErrorTypes.AUTHORIZATION:
      return ErrorSeverity.HIGH;
    case ErrorTypes.SERVER:
      return ErrorSeverity.CRITICAL;
    case ErrorTypes.VALIDATION:
      return ErrorSeverity.MEDIUM;
    case ErrorTypes.NOT_FOUND:
      return ErrorSeverity.MEDIUM;
    case ErrorTypes.CLIENT:
      return ErrorSeverity.MEDIUM;
    default:
      return ErrorSeverity.LOW;
  }
};

/**
 * Creates user-friendly error messages
 * @param {string} errorType - Error type
 * @param {Error|Object} error - Error object
 * @returns {string} - User-friendly message
 */
const createUserMessage = (errorType, error) => {
  const defaultMessages = {
    [ErrorTypes.NETWORK]: 'Network connection failed. Please check your internet connection and try again.',
    [ErrorTypes.AUTHENTICATION]: 'Your session has expired. Please log in again.',
    [ErrorTypes.AUTHORIZATION]: 'You don\'t have permission to perform this action.',
    [ErrorTypes.NOT_FOUND]: 'The requested resource was not found.',
    [ErrorTypes.SERVER]: 'Server error occurred. Our team has been notified. Please try again later.',
    [ErrorTypes.CLIENT]: 'There was an issue with your request. Please check your input and try again.',
    [ErrorTypes.VALIDATION]: 'Please check your input and correct any errors.',
    [ErrorTypes.UNKNOWN]: 'An unexpected error occurred. Please try again.',
  };

  // Try to get specific message from error
  const specificMessage = error?.response?.data?.message || 
                          error?.response?.data?.error || 
                          error?.message;

  // Use specific message if it's user-friendly, otherwise use default
  if (specificMessage && !specificMessage.includes('Error:') && specificMessage.length < 200) {
    return specificMessage;
  }

  return defaultMessages[errorType] || defaultMessages[ErrorTypes.UNKNOWN];
};

/**
 * Logs error for debugging and monitoring
 * @param {string} errorType - Error type
 * @param {string} severity - Error severity
 * @param {Error|Object} error - Error object
 * @param {Object} context - Additional context
 */
const logError = (errorType, severity, error, context = {}) => {
  const errorLog = {
    type: errorType,
    severity,
    message: error?.message || 'Unknown error',
    stack: error?.stack,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    context,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.group(`🚨 Error [${severity}] - ${errorType}`);
    console.error('Error:', error);
    console.log('Context:', context);
    console.log('Full Log:', errorLog);
    console.groupEnd();
  }

  // In production, send to error reporting service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to error reporting service (e.g., Sentry, LogRocket)
    console.error('Error logged:', errorLog);
  }
};

/**
 * Main error handler function
 * @param {Error|Object} error - Error object
 * @param {Object} options - Handling options
 * @returns {Object} - Error handling result
 */
export const handleError = (error, options = {}) => {
  const {
    showToast = true,
    logError: shouldLog = true,
    context = {},
    fallbackMessage = null,
    onError = null,
  } = options;

  const errorType = determineErrorType(error);
  const severity = determineErrorSeverity(errorType, error);
  const userMessage = fallbackMessage || createUserMessage(errorType, error);

  // Log error if enabled
  if (shouldLog) {
    logError(errorType, severity, error, context);
  }

  // Show toast notification if enabled
  if (showToast) {
    switch (errorType) {
      case ErrorTypes.NETWORK:
        toast.networkError(error);
        break;
      case ErrorTypes.API:
      case ErrorTypes.SERVER:
      case ErrorTypes.CLIENT:
        toast.apiError(error, userMessage);
        break;
      case ErrorTypes.VALIDATION:
        toast.validationError(error, 'Validation Error');
        break;
      default:
        toast.error(userMessage);
    }
  }

  // Call custom error handler if provided
  if (onError && typeof onError === 'function') {
    onError(error, { type: errorType, severity, message: userMessage });
  }

  return {
    type: errorType,
    severity,
    message: userMessage,
    originalError: error,
  };
};

/**
 * Async error handler for promises
 * @param {Promise} promise - Promise to handle
 * @param {Object} options - Handling options
 * @returns {Promise} - Promise with error handling
 */
export const handleAsyncError = async (promise, options = {}) => {
  try {
    return await promise;
  } catch (error) {
    handleError(error, options);
    throw error; // Re-throw so calling code can handle it too
  }
};

/**
 * Error boundary helper for React components
 * @param {Error} error - Error object
 * @param {Object} errorInfo - React error info
 * @param {Object} options - Handling options
 */
export const handleComponentError = (error, errorInfo, options = {}) => {
  const context = {
    componentStack: errorInfo.componentStack,
    errorBoundary: true,
  };

  handleError(error, {
    ...options,
    context,
    showToast: false, // Don't show toast for component errors
  });
};

/**
 * API error handler specifically for axios responses
 * @param {Object} axiosError - Axios error object
 * @param {Object} options - Handling options
 * @returns {Object} - Error handling result
 */
export const handleApiError = (axiosError, options = {}) => {
  const context = {
    url: axiosError.config?.url,
    method: axiosError.config?.method,
    status: axiosError.response?.status,
    statusText: axiosError.response?.statusText,
  };

  return handleError(axiosError, {
    ...options,
    context,
  });
};

/**
 * Form validation error handler
 * @param {Object} validationErrors - Validation errors object
 * @param {Object} options - Handling options
 * @returns {Object} - Error handling result
 */
export const handleValidationError = (validationErrors, options = {}) => {
  const error = {
    type: 'validation',
    message: 'Validation failed',
    errors: validationErrors,
  };

  return handleError(error, {
    ...options,
    showToast: true,
  });
};

/**
 * Creates an error handler for specific contexts
 * @param {string} context - Context name
 * @param {Object} defaultOptions - Default options for this context
 * @returns {Function} - Configured error handler
 */
export const createErrorHandler = (context, defaultOptions = {}) => {
  return (error, options = {}) => {
    return handleError(error, {
      ...defaultOptions,
      ...options,
      context: {
        ...defaultOptions.context,
        handlerContext: context,
        ...options.context,
      },
    });
  };
};

// Pre-configured error handlers for common scenarios
export const errorHandlers = {
  api: createErrorHandler('API', { showToast: true }),
  auth: createErrorHandler('Authentication', { showToast: true }),
  form: createErrorHandler('Form', { showToast: true }),
  component: createErrorHandler('Component', { showToast: false }),
  network: createErrorHandler('Network', { showToast: true }),
};

export default {
  handleError,
  handleAsyncError,
  handleComponentError,
  handleApiError,
  handleValidationError,
  createErrorHandler,
  errorHandlers,
  ErrorTypes,
  ErrorSeverity,
};

