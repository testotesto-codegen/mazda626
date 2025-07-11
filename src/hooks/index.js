/**
 * Centralized export for all custom hooks
 * Provides easy access to all hooks from a single import
 */

// Error handling hooks
export { default as useErrorHandler, useFormErrorHandler, useApiErrorHandler, useAsyncErrorHandler } from './useErrorHandler';

// API hooks
export { default as useApi, useApiMutation, usePaginatedApi, useInfiniteApi } from './useApi';

// Local storage hooks
export { 
  default as useLocalStorage,
  useLocalStorageObject,
  useLocalStorageArray,
  useLocalStorageString,
  useLocalStorageNumber,
  useLocalStorageBoolean,
  useUserPreferences,
  useRecentItems,
  usePersistedForm,
  useLocalStorageWithExpiry
} from './useLocalStorage';

// Form hooks
export { default as useForm, useFormArray, useFormWithYup } from './useForm';

// Re-export everything as a default object for convenience
export default {
  // Error handling
  useErrorHandler,
  useFormErrorHandler,
  useApiErrorHandler,
  useAsyncErrorHandler,
  
  // API
  useApi,
  useApiMutation,
  usePaginatedApi,
  useInfiniteApi,
  
  // Local storage
  useLocalStorage,
  useLocalStorageObject,
  useLocalStorageArray,
  useLocalStorageString,
  useLocalStorageNumber,
  useLocalStorageBoolean,
  useUserPreferences,
  useRecentItems,
  usePersistedForm,
  useLocalStorageWithExpiry,
  
  // Forms
  useForm,
  useFormArray,
  useFormWithYup,
};

