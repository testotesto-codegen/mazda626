/**
 * API Client - Common utilities for API calls
 */

const API_BASE_URL = import.meta.env.VITE_API;

/**
 * HTTP methods enum
 */
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
};

/**
 * Default request configuration
 */
const DEFAULT_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
};

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Generic API request function
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} options - Request options
 * @returns {Promise<Object>} Response data
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...DEFAULT_CONFIG,
    ...options,
    headers: {
      ...DEFAULT_CONFIG.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Handle different response types
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new ApiError(
        data.message || `HTTP error! status: ${response.status}`,
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    console.error('API request failed:', error);
    throw new ApiError('Network error or server unavailable', 0, null);
  }
};

/**
 * GET request helper
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response data
 */
export const get = (endpoint, options = {}) => {
  return apiRequest(endpoint, {
    ...options,
    method: HTTP_METHODS.GET,
  });
};

/**
 * POST request helper
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response data
 */
export const post = (endpoint, data = null, options = {}) => {
  return apiRequest(endpoint, {
    ...options,
    method: HTTP_METHODS.POST,
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * PUT request helper
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response data
 */
export const put = (endpoint, data = null, options = {}) => {
  return apiRequest(endpoint, {
    ...options,
    method: HTTP_METHODS.PUT,
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * DELETE request helper
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response data
 */
export const del = (endpoint, options = {}) => {
  return apiRequest(endpoint, {
    ...options,
    method: HTTP_METHODS.DELETE,
  });
};

/**
 * PATCH request helper
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response data
 */
export const patch = (endpoint, data = null, options = {}) => {
  return apiRequest(endpoint, {
    ...options,
    method: HTTP_METHODS.PATCH,
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * Request interceptor for adding auth tokens, etc.
 * @param {Function} interceptor - Function to modify request config
 */
export const addRequestInterceptor = (interceptor) => {
  // This would be implemented based on specific needs
  // For now, it's a placeholder for future enhancement
  console.warn('Request interceptors not yet implemented');
};

/**
 * Response interceptor for handling common response patterns
 * @param {Function} interceptor - Function to process responses
 */
export const addResponseInterceptor = (interceptor) => {
  // This would be implemented based on specific needs
  // For now, it's a placeholder for future enhancement
  console.warn('Response interceptors not yet implemented');
};

