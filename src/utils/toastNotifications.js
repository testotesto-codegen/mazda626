import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Enhanced toast notification system with better error handling and user feedback
 * Provides consistent notification patterns across the application
 */

// Default configuration for all toasts
const defaultConfig = {
  position: toast.POSITION.TOP_RIGHT,
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

// Configuration for different toast types
const typeConfigs = {
  success: {
    ...defaultConfig,
    autoClose: 4000,
    className: 'toast-success',
  },
  error: {
    ...defaultConfig,
    autoClose: 8000, // Longer for errors so users can read them
    className: 'toast-error',
  },
  warning: {
    ...defaultConfig,
    autoClose: 6000,
    className: 'toast-warning',
  },
  info: {
    ...defaultConfig,
    autoClose: 5000,
    className: 'toast-info',
  },
  loading: {
    ...defaultConfig,
    autoClose: false,
    closeOnClick: false,
    className: 'toast-loading',
  },
};

/**
 * Shows a toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of notification ('success', 'error', 'warning', 'info', 'loading')
 * @param {Object} options - Additional options to override defaults
 * @returns {number} - Toast ID for updating or dismissing
 */
const show = (message, type = 'info', options = {}) => {
  const config = { ...typeConfigs[type], ...options };
  
  switch (type) {
    case 'success':
      return toast.success(message, config);
    case 'error':
      return toast.error(message, config);
    case 'warning':
      return toast.warn(message, config);
    case 'info':
      return toast.info(message, config);
    case 'loading':
      return toast.loading(message, config);
    default:
      return toast(message, config);
  }
};

/**
 * Shows a success notification
 * @param {string} message - Success message
 * @param {Object} options - Additional options
 * @returns {number} - Toast ID
 */
const success = (message, options = {}) => {
  return show(message, 'success', options);
};

/**
 * Shows an error notification with enhanced error handling
 * @param {string|Error} error - Error message or Error object
 * @param {Object} options - Additional options
 * @returns {number} - Toast ID
 */
const error = (error, options = {}) => {
  let message = 'An unexpected error occurred';
  
  if (typeof error === 'string') {
    message = error;
  } else if (error instanceof Error) {
    message = error.message || message;
  } else if (error?.message) {
    message = error.message;
  } else if (error?.data?.message) {
    // Handle API error responses
    message = error.data.message;
  }

  // Log error for debugging in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Toast Error:', error);
  }

  return show(message, 'error', options);
};

/**
 * Shows a warning notification
 * @param {string} message - Warning message
 * @param {Object} options - Additional options
 * @returns {number} - Toast ID
 */
const warning = (message, options = {}) => {
  return show(message, 'warning', options);
};

/**
 * Shows an info notification
 * @param {string} message - Info message
 * @param {Object} options - Additional options
 * @returns {number} - Toast ID
 */
const info = (message, options = {}) => {
  return show(message, 'info', options);
};

/**
 * Shows a loading notification
 * @param {string} message - Loading message
 * @param {Object} options - Additional options
 * @returns {number} - Toast ID
 */
const loading = (message = 'Loading...', options = {}) => {
  return show(message, 'loading', options);
};

/**
 * Updates an existing toast (useful for loading states)
 * @param {number} toastId - ID of toast to update
 * @param {string} message - New message
 * @param {string} type - New type
 * @param {Object} options - Additional options
 */
const update = (toastId, message, type = 'info', options = {}) => {
  const config = { ...typeConfigs[type], ...options };
  
  toast.update(toastId, {
    render: message,
    type: type,
    ...config,
  });
};

/**
 * Dismisses a specific toast
 * @param {number} toastId - ID of toast to dismiss
 */
const dismiss = (toastId) => {
  toast.dismiss(toastId);
};

/**
 * Dismisses all toasts
 */
const dismissAll = () => {
  toast.dismiss();
};

/**
 * Promise-based toast for async operations
 * @param {Promise} promise - Promise to track
 * @param {Object} messages - Messages for different states
 * @param {Object} options - Additional options
 * @returns {Promise} - Original promise
 */
const promise = (promise, messages = {}, options = {}) => {
  const {
    loading: loadingMsg = 'Loading...',
    success: successMsg = 'Success!',
    error: errorMsg = 'Something went wrong',
  } = messages;

  return toast.promise(
    promise,
    {
      pending: loadingMsg,
      success: successMsg,
      error: errorMsg,
    },
    {
      ...defaultConfig,
      ...options,
    }
  );
};

/**
 * API-specific error handler
 * @param {Object} apiError - API error response
 * @param {string} fallbackMessage - Fallback message if no specific error
 * @returns {number} - Toast ID
 */
const apiError = (apiError, fallbackMessage = 'API request failed') => {
  let message = fallbackMessage;
  
  if (apiError?.response?.data?.message) {
    message = apiError.response.data.message;
  } else if (apiError?.response?.data?.error) {
    message = apiError.response.data.error;
  } else if (apiError?.message) {
    message = apiError.message;
  }

  // Add status code if available
  if (apiError?.response?.status) {
    message = `${message} (${apiError.response.status})`;
  }

  return error(message);
};

/**
 * Network error handler
 * @param {Error} networkError - Network error
 * @returns {number} - Toast ID
 */
const networkError = (networkError) => {
  const message = networkError?.message?.includes('Network Error') 
    ? 'Network connection failed. Please check your internet connection.'
    : 'Connection error. Please try again.';
    
  return error(message);
};

/**
 * Validation error handler for forms
 * @param {Object} validationErrors - Validation error object
 * @param {string} title - Title for the error toast
 * @returns {number} - Toast ID
 */
const validationError = (validationErrors, title = 'Validation Error') => {
  if (typeof validationErrors === 'string') {
    return error(validationErrors);
  }

  if (Array.isArray(validationErrors)) {
    const message = validationErrors.join(', ');
    return error(`${title}: ${message}`);
  }

  if (typeof validationErrors === 'object') {
    const errors = Object.values(validationErrors).flat();
    const message = errors.join(', ');
    return error(`${title}: ${message}`);
  }

  return error(title);
};

// Export individual functions and a default object
export {
  show,
  success,
  error,
  warning,
  info,
  loading,
  update,
  dismiss,
  dismissAll,
  promise,
  apiError,
  networkError,
  validationError,
};

export default {
  show,
  success,
  error,
  warning,
  info,
  loading,
  update,
  dismiss,
  dismissAll,
  promise,
  apiError,
  networkError,
  validationError,
};
