import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { 
  handleError, 
  getUserFriendlyMessage, 
  retryOperation,
  debouncedErrorHandler 
} from '../utils/errorHandling';

/**
 * Custom hook for standardized error handling
 * Provides error state management and user-friendly error handling
 */
export const useErrorHandler = (options = {}) => {
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const dispatch = useDispatch();

  const {
    showToast = true,
    logToConsole = true,
    reportToService = true,
    maxRetries = 3,
    retryDelay = 1000,
    debounce = false
  } = options;

  /**
   * Handle an error with full error processing pipeline
   */
  const handleErrorWithContext = useCallback((error, context = {}) => {
    const errorHandler = debounce ? debouncedErrorHandler : handleError;
    
    const errorInfo = errorHandler(error, {
      ...context,
      component: context.component || 'useErrorHandler',
      timestamp: new Date().toISOString()
    });

    // Update local error state
    setError({
      ...errorInfo,
      userMessage: getUserFriendlyMessage(error),
      canRetry: isRetryableError(error)
    });

    // Show toast notification if enabled
    if (showToast) {
      dispatch({
        type: 'ui/showToast',
        payload: {
          type: 'error',
          message: getUserFriendlyMessage(error),
          duration: 5000
        }
      });
    }

    return errorInfo;
  }, [dispatch, showToast, debounce]);

  /**
   * Clear the current error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Retry a failed operation
   */
  const retryLastOperation = useCallback(async (operation) => {
    if (!operation) {
      console.warn('No operation provided to retry');
      return;
    }

    setIsRetrying(true);
    clearError();

    try {
      const result = await retryOperation(operation, maxRetries, retryDelay);
      return result;
    } catch (retryError) {
      handleErrorWithContext(retryError, { 
        context: 'retry_operation',
        originalError: error?.message 
      });
      throw retryError;
    } finally {
      setIsRetrying(false);
    }
  }, [error, maxRetries, retryDelay, handleErrorWithContext, clearError]);

  /**
   * Wrapper for async operations with automatic error handling
   */
  const executeWithErrorHandling = useCallback(async (
    operation, 
    context = {},
    options = {}
  ) => {
    const { 
      clearPreviousError = true,
      showLoadingState = false 
    } = options;

    if (clearPreviousError) {
      clearError();
    }

    try {
      if (showLoadingState) {
        dispatch({ type: 'ui/setLoading', payload: true });
      }

      const result = await operation();
      return result;
    } catch (error) {
      handleErrorWithContext(error, context);
      throw error;
    } finally {
      if (showLoadingState) {
        dispatch({ type: 'ui/setLoading', payload: false });
      }
    }
  }, [dispatch, handleErrorWithContext, clearError]);

  /**
   * Create an error handler for specific contexts
   */
  const createContextualHandler = useCallback((context) => {
    return (error) => handleErrorWithContext(error, context);
  }, [handleErrorWithContext]);

  /**
   * Handle form validation errors
   */
  const handleValidationErrors = useCallback((validationErrors) => {
    const formattedErrors = Object.entries(validationErrors).map(([field, message]) => ({
      field,
      message,
      type: 'validation'
    }));

    setError({
      type: 'validation',
      message: 'Please correct the following errors:',
      validationErrors: formattedErrors,
      userMessage: 'Please check your input and try again.'
    });

    if (showToast) {
      dispatch({
        type: 'ui/showToast',
        payload: {
          type: 'error',
          message: 'Please check your input and try again.',
          duration: 5000
        }
      });
    }
  }, [dispatch, showToast]);

  /**
   * Handle network/API errors with specific messaging
   */
  const handleNetworkError = useCallback((error, endpoint) => {
    const isOffline = !navigator.onLine;
    const context = {
      endpoint,
      isOffline,
      networkStatus: navigator.onLine ? 'online' : 'offline'
    };

    if (isOffline) {
      setError({
        type: 'network',
        message: 'No internet connection',
        userMessage: 'Please check your internet connection and try again.',
        canRetry: true
      });
    } else {
      handleErrorWithContext(error, context);
    }
  }, [handleErrorWithContext]);

  return {
    // Error state
    error,
    hasError: !!error,
    isRetrying,
    
    // Error handling methods
    handleError: handleErrorWithContext,
    clearError,
    retryLastOperation,
    executeWithErrorHandling,
    createContextualHandler,
    handleValidationErrors,
    handleNetworkError,
    
    // Utility methods
    getUserMessage: () => error?.userMessage || null,
    canRetry: () => error?.canRetry || false,
    getErrorType: () => error?.category || null
  };
};

/**
 * Determine if an error is retryable
 */
const isRetryableError = (error) => {
  // Network errors are usually retryable
  if (error.name === 'NetworkError' || error.message.includes('fetch')) {
    return true;
  }
  
  // API errors with 5xx status codes are retryable
  if (error.status >= 500) {
    return true;
  }
  
  // Timeout errors are retryable
  if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
    return true;
  }
  
  // Market data errors might be retryable
  if (error.name === 'MarketDataError') {
    return true;
  }
  
  return false;
};

export default useErrorHandler;

