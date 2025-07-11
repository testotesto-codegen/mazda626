/**
 * useErrorHandler Hook - Custom hook for handling errors in components
 */

import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { 
  handleApiError, 
  getUserFriendlyMessage, 
  ERROR_SEVERITY,
  logError 
} from '../utils/errorHandler';

/**
 * Custom hook for error handling in components
 * @param {Object} options - Configuration options
 * @returns {Object} Error handling utilities
 */
export const useErrorHandler = (options = {}) => {
  const {
    showToast = true,
    logErrors = true,
    defaultMessage = 'Something went wrong. Please try again.',
  } = options;

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles errors with optional toast notification
   */
  const handleError = useCallback((error, context = {}) => {
    const appError = handleApiError(error, context);
    
    setError(appError);
    
    if (logErrors) {
      logError(appError, context);
    }

    if (showToast) {
      const message = getUserFriendlyMessage(appError);
      
      // Show different toast types based on severity
      switch (appError.severity) {
        case ERROR_SEVERITY.CRITICAL:
        case ERROR_SEVERITY.HIGH:
          toast.error(message);
          break;
        case ERROR_SEVERITY.MEDIUM:
          toast.warn(message);
          break;
        case ERROR_SEVERITY.LOW:
          toast.info(message);
          break;
        default:
          toast.error(message);
      }
    }

    return appError;
  }, [showToast, logErrors]);

  /**
   * Clears the current error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Wraps an async function with error handling and loading state
   */
  const withErrorHandling = useCallback((asyncFn) => {
    return async (...args) => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await asyncFn(...args);
        return result;
      } catch (error) {
        handleError(error, { function: asyncFn.name, args });
        throw error;
      } finally {
        setIsLoading(false);
      }
    };
  }, [handleError]);

  /**
   * Wraps a function with try-catch and error handling
   */
  const safeExecute = useCallback((fn, context = {}) => {
    try {
      return fn();
    } catch (error) {
      handleError(error, context);
      return null;
    }
  }, [handleError]);

  /**
   * Shows a custom error message
   */
  const showError = useCallback((message, severity = ERROR_SEVERITY.MEDIUM) => {
    const customError = new Error(message);
    customError.severity = severity;
    handleError(customError);
  }, [handleError]);

  /**
   * Shows a success message
   */
  const showSuccess = useCallback((message) => {
    if (showToast) {
      toast.success(message);
    }
  }, [showToast]);

  /**
   * Shows an info message
   */
  const showInfo = useCallback((message) => {
    if (showToast) {
      toast.info(message);
    }
  }, [showToast]);

  /**
   * Shows a warning message
   */
  const showWarning = useCallback((message) => {
    if (showToast) {
      toast.warn(message);
    }
  }, [showToast]);

  return {
    // State
    error,
    isLoading,
    hasError: !!error,
    
    // Error handling functions
    handleError,
    clearError,
    withErrorHandling,
    safeExecute,
    
    // Message functions
    showError,
    showSuccess,
    showInfo,
    showWarning,
    
    // Utility functions
    getErrorMessage: () => error ? getUserFriendlyMessage(error) : null,
    getErrorType: () => error?.type || null,
    getErrorSeverity: () => error?.severity || null,
  };
};

/**
 * Hook for handling form errors specifically
 */
export const useFormErrorHandler = () => {
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);

  const setFieldError = useCallback((fieldName, errorMessage) => {
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: errorMessage,
    }));
  }, []);

  const clearFieldError = useCallback((fieldName) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setFieldErrors({});
    setGeneralError(null);
  }, []);

  const handleValidationErrors = useCallback((errors) => {
    if (Array.isArray(errors)) {
      // Handle array of field errors
      const errorMap = {};
      errors.forEach(error => {
        if (error.field) {
          errorMap[error.field] = error.message;
        }
      });
      setFieldErrors(errorMap);
    } else if (typeof errors === 'object') {
      // Handle object with field keys
      setFieldErrors(errors);
    } else {
      // Handle general error
      setGeneralError(errors);
    }
  }, []);

  return {
    fieldErrors,
    generalError,
    hasFieldErrors: Object.keys(fieldErrors).length > 0,
    hasGeneralError: !!generalError,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    handleValidationErrors,
    getFieldError: (fieldName) => fieldErrors[fieldName] || null,
  };
};

export default useErrorHandler;

