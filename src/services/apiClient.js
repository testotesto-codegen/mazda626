import axios from 'axios';
import { handleApiError } from '../utils/errorHandler';
import toast from '../utils/toastNotifications';

/**
 * Centralized API client with consistent error handling, interceptors, and configuration
 * Provides a standardized way to make API calls across the application
 */

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor for adding authentication and common headers
 */
apiClient.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for handling common responses and errors
 */
apiClient.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = new Date() - response.config.metadata.startTime;

    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`, {
        status: response.status,
        data: response.data,
      });
    }

    // Return the data directly for easier consumption
    return response.data;
  },
  (error) => {
    // Calculate request duration if available
    const duration = error.config?.metadata?.startTime 
      ? new Date() - error.config.metadata.startTime 
      : 0;

    // Log error in development
    if (import.meta.env.DEV) {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} (${duration}ms)`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear auth tokens and redirect to login
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        toast.error('Your session has expired. Please log in again.');
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      // Forbidden
      toast.error('You don\'t have permission to perform this action.');
    } else if (error.response?.status >= 500) {
      // Server errors
      toast.error('Server error occurred. Please try again later.');
    }

    return Promise.reject(error);
  }
);

/**
 * Generic API methods with consistent error handling
 */
export const api = {
  /**
   * GET request
   */
  get: async (url, config = {}) => {
    try {
      return await apiClient.get(url, config);
    } catch (error) {
      handleApiError(error, { context: { method: 'GET', url } });
      throw error;
    }
  },

  /**
   * POST request
   */
  post: async (url, data = {}, config = {}) => {
    try {
      return await apiClient.post(url, data, config);
    } catch (error) {
      handleApiError(error, { context: { method: 'POST', url, data } });
      throw error;
    }
  },

  /**
   * PUT request
   */
  put: async (url, data = {}, config = {}) => {
    try {
      return await apiClient.put(url, data, config);
    } catch (error) {
      handleApiError(error, { context: { method: 'PUT', url, data } });
      throw error;
    }
  },

  /**
   * PATCH request
   */
  patch: async (url, data = {}, config = {}) => {
    try {
      return await apiClient.patch(url, data, config);
    } catch (error) {
      handleApiError(error, { context: { method: 'PATCH', url, data } });
      throw error;
    }
  },

  /**
   * DELETE request
   */
  delete: async (url, config = {}) => {
    try {
      return await apiClient.delete(url, config);
    } catch (error) {
      handleApiError(error, { context: { method: 'DELETE', url } });
      throw error;
    }
  },

  /**
   * Upload file with progress tracking
   */
  upload: async (url, file, options = {}) => {
    const {
      onProgress,
      additionalData = {},
      fieldName = 'file',
    } = options;

    const formData = new FormData();
    formData.append(fieldName, file);

    // Add additional form data
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    try {
      return await apiClient.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      });
    } catch (error) {
      handleApiError(error, { context: { method: 'UPLOAD', url, fileName: file.name } });
      throw error;
    }
  },

  /**
   * Download file
   */
  download: async (url, filename, config = {}) => {
    try {
      const response = await apiClient.get(url, {
        ...config,
        responseType: 'blob',
      });

      // Create blob link to download
      const blob = new Blob([response]);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();

      // Clean up
      window.URL.revokeObjectURL(link.href);

      return response;
    } catch (error) {
      handleApiError(error, { context: { method: 'DOWNLOAD', url, filename } });
      throw error;
    }
  },
};

/**
 * Utility functions for API operations
 */
export const apiUtils = {
  /**
   * Creates a cancel token for request cancellation
   */
  createCancelToken: () => {
    return axios.CancelToken.source();
  },

  /**
   * Checks if error is a cancel error
   */
  isCancel: (error) => {
    return axios.isCancel(error);
  },

  /**
   * Creates query string from object
   */
  createQueryString: (params) => {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        searchParams.append(key, params[key]);
      }
    });
    return searchParams.toString();
  },

  /**
   * Builds URL with query parameters
   */
  buildUrl: (baseUrl, params = {}) => {
    const queryString = apiUtils.createQueryString(params);
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  },

  /**
   * Retry failed requests with exponential backoff
   */
  retryRequest: async (requestFn, maxRetries = 3, baseDelay = 1000) => {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;

        // Don't retry on client errors (4xx) except 408, 429
        if (error.response?.status >= 400 && error.response?.status < 500) {
          if (![408, 429].includes(error.response.status)) {
            throw error;
          }
        }

        // Don't retry on last attempt
        if (attempt === maxRetries) {
          break;
        }

        // Calculate delay with exponential backoff
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));

        console.log(`Retrying request (attempt ${attempt + 1}/${maxRetries}) after ${delay}ms`);
      }
    }

    throw lastError;
  },

  /**
   * Batch multiple requests
   */
  batch: async (requests) => {
    try {
      const responses = await Promise.allSettled(requests);
      return responses.map((response, index) => ({
        index,
        success: response.status === 'fulfilled',
        data: response.status === 'fulfilled' ? response.value : null,
        error: response.status === 'rejected' ? response.reason : null,
      }));
    } catch (error) {
      handleApiError(error, { context: { method: 'BATCH', requestCount: requests.length } });
      throw error;
    }
  },
};

/**
 * API response transformers
 */
export const apiTransformers = {
  /**
   * Transforms paginated response
   */
  paginated: (response) => ({
    data: response.data || response.items || [],
    pagination: {
      page: response.page || response.current_page || 1,
      pageSize: response.page_size || response.per_page || 20,
      total: response.total || response.total_count || 0,
      totalPages: response.total_pages || Math.ceil((response.total || 0) / (response.page_size || 20)),
      hasNext: response.has_next || false,
      hasPrev: response.has_prev || false,
    },
  }),

  /**
   * Transforms list response
   */
  list: (response) => response.data || response.items || response,

  /**
   * Transforms single item response
   */
  item: (response) => response.data || response,

  /**
   * Transforms error response
   */
  error: (error) => ({
    message: error.response?.data?.message || error.message || 'An error occurred',
    code: error.response?.data?.code || error.code,
    status: error.response?.status,
    details: error.response?.data?.details || null,
  }),
};

// Export the configured axios instance for direct use if needed
export { apiClient };

export default api;

