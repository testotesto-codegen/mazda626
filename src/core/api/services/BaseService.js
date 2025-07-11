/**
 * Base Service Class
 * Provides common functionality for all API services
 */

import { apiClient } from '../client';
import { createLogger } from '../../logging';

/**
 * Base service class with common API operations
 */
export class BaseService {
  constructor(endpoint, options = {}) {
    this.endpoint = endpoint;
    this.logger = createLogger(`${this.constructor.name}`);
    this.options = {
      cache: true,
      retries: 3,
      timeout: 30000,
      ...options
    };
    this.cache = new Map();
  }

  /**
   * Get cache key for request
   * @param {string} method - HTTP method
   * @param {string} url - Request URL
   * @param {Object} params - Request parameters
   * @returns {string} Cache key
   */
  getCacheKey(method, url, params = {}) {
    return `${method}:${url}:${JSON.stringify(params)}`;
  }

  /**
   * Get cached response
   * @param {string} cacheKey - Cache key
   * @returns {*} Cached response or null
   */
  getCachedResponse(cacheKey) {
    if (!this.options.cache) return null;
    
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 300000) { // 5 minutes
      this.logger.debug('Cache hit', { cacheKey });
      return cached.data;
    }
    
    return null;
  }

  /**
   * Set cached response
   * @param {string} cacheKey - Cache key
   * @param {*} data - Response data
   */
  setCachedResponse(cacheKey, data) {
    if (!this.options.cache) return;
    
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Clear cache
   * @param {string} pattern - Optional pattern to match keys
   */
  clearCache(pattern = null) {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
    
    this.logger.debug('Cache cleared', { pattern });
  }

  /**
   * Build URL with endpoint
   * @param {string} path - API path
   * @returns {string} Full URL
   */
  buildUrl(path = '') {
    const cleanEndpoint = this.endpoint.replace(/\/$/, '');
    const cleanPath = path.replace(/^\//, '');
    return cleanPath ? `${cleanEndpoint}/${cleanPath}` : cleanEndpoint;
  }

  /**
   * Handle API errors
   * @param {Error} error - API error
   * @param {string} operation - Operation name
   * @throws {Error} Normalized error
   */
  handleError(error, operation) {
    this.logger.error(`${operation} failed`, {
      error: error.message,
      status: error.status,
      code: error.code
    });

    // Add context to error
    error.operation = operation;
    error.service = this.constructor.name;
    
    throw error;
  }

  /**
   * Validate required parameters
   * @param {Object} params - Parameters to validate
   * @param {string[]} required - Required parameter names
   * @throws {Error} If required parameters are missing
   */
  validateParams(params, required) {
    const missing = required.filter(param => 
      params[param] === undefined || params[param] === null
    );
    
    if (missing.length > 0) {
      throw new Error(`Missing required parameters: ${missing.join(', ')}`);
    }
  }

  /**
   * Generic GET request
   * @param {string} path - API path
   * @param {Object} params - Query parameters
   * @param {Object} options - Request options
   * @returns {Promise<*>} Response data
   */
  async get(path = '', params = {}, options = {}) {
    const url = this.buildUrl(path);
    const cacheKey = this.getCacheKey('GET', url, params);
    
    // Check cache first
    const cached = this.getCachedResponse(cacheKey);
    if (cached) return cached;

    try {
      const data = await apiClient.get(url, { params, ...options });
      this.setCachedResponse(cacheKey, data);
      return data;
    } catch (error) {
      this.handleError(error, `GET ${url}`);
    }
  }

  /**
   * Generic POST request
   * @param {string} path - API path
   * @param {Object} data - Request data
   * @param {Object} options - Request options
   * @returns {Promise<*>} Response data
   */
  async post(path = '', data = {}, options = {}) {
    const url = this.buildUrl(path);
    
    try {
      const response = await apiClient.post(url, data, options);
      
      // Clear related cache entries
      this.clearCache(this.endpoint);
      
      return response;
    } catch (error) {
      this.handleError(error, `POST ${url}`);
    }
  }

  /**
   * Generic PUT request
   * @param {string} path - API path
   * @param {Object} data - Request data
   * @param {Object} options - Request options
   * @returns {Promise<*>} Response data
   */
  async put(path = '', data = {}, options = {}) {
    const url = this.buildUrl(path);
    
    try {
      const response = await apiClient.put(url, data, options);
      
      // Clear related cache entries
      this.clearCache(this.endpoint);
      
      return response;
    } catch (error) {
      this.handleError(error, `PUT ${url}`);
    }
  }

  /**
   * Generic PATCH request
   * @param {string} path - API path
   * @param {Object} data - Request data
   * @param {Object} options - Request options
   * @returns {Promise<*>} Response data
   */
  async patch(path = '', data = {}, options = {}) {
    const url = this.buildUrl(path);
    
    try {
      const response = await apiClient.patch(url, data, options);
      
      // Clear related cache entries
      this.clearCache(this.endpoint);
      
      return response;
    } catch (error) {
      this.handleError(error, `PATCH ${url}`);
    }
  }

  /**
   * Generic DELETE request
   * @param {string} path - API path
   * @param {Object} options - Request options
   * @returns {Promise<*>} Response data
   */
  async delete(path = '', options = {}) {
    const url = this.buildUrl(path);
    
    try {
      const response = await apiClient.delete(url, options);
      
      // Clear related cache entries
      this.clearCache(this.endpoint);
      
      return response;
    } catch (error) {
      this.handleError(error, `DELETE ${url}`);
    }
  }

  /**
   * Get single item by ID
   * @param {string|number} id - Item ID
   * @param {Object} options - Request options
   * @returns {Promise<*>} Item data
   */
  async getById(id, options = {}) {
    this.validateParams({ id }, ['id']);
    return this.get(`/${id}`, {}, options);
  }

  /**
   * Get list of items with pagination
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.sort - Sort field
   * @param {string} params.order - Sort order (asc/desc)
   * @param {Object} options - Request options
   * @returns {Promise<*>} Paginated list
   */
  async getList(params = {}, options = {}) {
    const defaultParams = {
      page: 1,
      limit: 20,
      sort: 'id',
      order: 'desc',
      ...params
    };
    
    return this.get('', defaultParams, options);
  }

  /**
   * Create new item
   * @param {Object} data - Item data
   * @param {Object} options - Request options
   * @returns {Promise<*>} Created item
   */
  async create(data, options = {}) {
    this.validateParams({ data }, ['data']);
    return this.post('', data, options);
  }

  /**
   * Update item by ID
   * @param {string|number} id - Item ID
   * @param {Object} data - Updated data
   * @param {Object} options - Request options
   * @returns {Promise<*>} Updated item
   */
  async update(id, data, options = {}) {
    this.validateParams({ id, data }, ['id', 'data']);
    return this.put(`/${id}`, data, options);
  }

  /**
   * Partially update item by ID
   * @param {string|number} id - Item ID
   * @param {Object} data - Partial data
   * @param {Object} options - Request options
   * @returns {Promise<*>} Updated item
   */
  async partialUpdate(id, data, options = {}) {
    this.validateParams({ id, data }, ['id', 'data']);
    return this.patch(`/${id}`, data, options);
  }

  /**
   * Delete item by ID
   * @param {string|number} id - Item ID
   * @param {Object} options - Request options
   * @returns {Promise<*>} Deletion result
   */
  async deleteById(id, options = {}) {
    this.validateParams({ id }, ['id']);
    return this.delete(`/${id}`, options);
  }

  /**
   * Search items
   * @param {string} query - Search query
   * @param {Object} params - Additional parameters
   * @param {Object} options - Request options
   * @returns {Promise<*>} Search results
   */
  async search(query, params = {}, options = {}) {
    this.validateParams({ query }, ['query']);
    
    const searchParams = {
      q: query,
      ...params
    };
    
    return this.get('/search', searchParams, options);
  }

  /**
   * Bulk operations
   * @param {string} operation - Operation type (create, update, delete)
   * @param {Array} items - Items to process
   * @param {Object} options - Request options
   * @returns {Promise<*>} Bulk operation result
   */
  async bulk(operation, items, options = {}) {
    this.validateParams({ operation, items }, ['operation', 'items']);
    
    return this.post('/bulk', {
      operation,
      items
    }, options);
  }
}

export default BaseService;

