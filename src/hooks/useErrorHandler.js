import { useCallback } from 'react';
import { handleError, handleApiError, handleValidationError } from '../utils/errorHandler';

/**
 * Custom hook for error handling in React components
 * Provides consistent error handling patterns with React integration
 */
export const useErrorHandler = (defaultOptions = {}) => {
  /**
   * Generic error handler
   */
  const handleGenericError = useCallback((error, options = {}) => {
    return handleError(error, { ...defaultOptions, ...options });
  }, [defaultOptions]);

  /**
   * API error handler
   */
  const handleApiErrorCallback = useCallback((error, options = {}) => {
    return handleApiError(error, { ...defaultOptions, ...options });
  }, [defaultOptions]);

  /**
   * Validation error handler
   */
  const handleValidationErrorCallback = useCallback((validationErrors, options = {}) => {
    return handleValidationError(validationErrors, { ...defaultOptions, ...options });
  }, [defaultOptions]);

  /**
   * Async operation wrapper with error handling
   */
  const withErrorHandling = useCallback((asyncFn, options = {}) => {
    return async (...args) => {
      try {
        return await asyncFn(...args);
      } catch (error) {
        handleGenericError(error, options);
        throw error; // Re-throw so component can handle it if needed
      }
    };
  }, [handleGenericError]);

  /**
   * Safe async operation that doesn't re-throw errors
   */
  const safeAsync = useCallback((asyncFn, options = {}) => {
    return async (...args) => {
      try {
        return await asyncFn(...args);
      } catch (error) {
        const result = handleGenericError(error, options);
        return { error: result, data: null };
      }
    };
  }, [handleGenericError]);

  return {
    handleError: handleGenericError,
    handleApiError: handleApiErrorCallback,
    handleValidationError: handleValidationErrorCallback,
    withErrorHandling,
    safeAsync,
  };
};

/**
 * Hook for handling form errors specifically
 */
export const useFormErrorHandler = () => {
  const { handleValidationError, handleApiError } = useErrorHandler({
    context: { component: 'form' }
  });

  /**
   * Handles form submission errors
   */
  const handleSubmitError = useCallback((error) => {
    if (error.response?.status === 422 || error.name === 'ValidationError') {
      return handleValidationError(error);
    }
    return handleApiError(error);
  }, [handleValidationError, handleApiError]);

  /**
   * Handles field validation errors
   */
  const handleFieldError = useCallback((fieldErrors, fieldName) => {
    return handleValidationError(fieldErrors, {
      context: { field: fieldName },
      showToast: false, // Usually handled by form UI
    });
  }, [handleValidationError]);

  return {
    handleSubmitError,
    handleFieldError,
    handleValidationError,
  };
};

/**
 * Hook for handling API errors specifically
 */
export const useApiErrorHandler = () => {
  const { handleApiError } = useErrorHandler({
    context: { component: 'api' }
  });

  /**
   * Handles authentication errors
   */
  const handleAuthError = useCallback((error) => {
    return handleApiError(error, {
      context: { type: 'authentication' },
      onError: (err, result) => {
        if (result.type === 'AUTHENTICATION') {
          // Redirect to login or refresh token
          window.location.href = '/login';
        }
      }
    });
  }, [handleApiError]);

  /**
   * Handles data fetching errors
   */
  const handleFetchError = useCallback((error, resourceName = 'data') => {
    return handleApiError(error, {
      context: { resource: resourceName },
      fallbackMessage: `Failed to load ${resourceName}. Please try again.`,
    });
  }, [handleApiError]);

  /**
   * Handles data mutation errors
   */
  const handleMutationError = useCallback((error, operation = 'save') => {
    return handleApiError(error, {
      context: { operation },
      fallbackMessage: `Failed to ${operation}. Please try again.`,
    });
  }, [handleApiError]);

  return {
    handleApiError,
    handleAuthError,
    handleFetchError,
    handleMutationError,
  };
};

/**
 * Hook for handling async operations with loading states
 */
export const useAsyncErrorHandler = () => {
  const { handleError } = useErrorHandler();

  /**
   * Wraps an async operation with error handling and loading state
   */
  const handleAsyncOperation = useCallback(async (
    asyncFn,
    {
      onSuccess,
      onError,
      onFinally,
      showToast = true,
      ...errorOptions
    } = {}
  ) => {
    try {
      const result = await asyncFn();
      if (onSuccess) onSuccess(result);
      return { data: result, error: null };
    } catch (error) {
      const errorResult = handleError(error, { showToast, ...errorOptions });
      if (onError) onError(error, errorResult);
      return { data: null, error: errorResult };
    } finally {
      if (onFinally) onFinally();
    }
  }, [handleError]);

  return {
    handleAsyncOperation,
  };
};

export default useErrorHandler;

