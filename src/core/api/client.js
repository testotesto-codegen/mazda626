/**
 * Enhanced API Client
 * Centralized HTTP client with error handling, retries, and logging
 */

import axios from 'axios';
import { API_CONFIG, AUTH_CONFIG } from '../config';
import { createLogger } from '../logging';

const logger = createLogger('APIClient');

/**
 * Create axios instance with default configuration
 */
const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  return instance;
};

/**
 * API Client class
 */
export class APIClient {
  constructor() {
    this.client = createAxiosInstance();
    this.setupInterceptors();
    this.retryQueue = [];
    this.isRefreshing = false;
  }

  /**
   * Setup request and response interceptors
   */
  setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request
        logger.apiRequest(config.method?.toUpperCase(), config.url, {
          params: config.params,
          data: config.data
        });

        return config;
      },
      (error) => {
        logger.error('Request interceptor error', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Log successful response
        logger.apiResponse(
          response.config.method?.toUpperCase(),
          response.config.url,
          response.status,
          response.data
        );

        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Log error response
        logger.apiResponse(
          originalRequest?.method?.toUpperCase(),
          originalRequest?.url,
          error.response?.status,
          error.response?.data
        );

        // Handle 401 errors with token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, queue the request
            return new Promise((resolve, reject) => {
              this.retryQueue.push({ resolve, reject, config: originalRequest });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            await this.refreshToken();
            this.processRetryQueue(null);
            return this.client(originalRequest);
          } catch (refreshError) {
            this.processRetryQueue(refreshError);
            this.handleAuthError();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Handle network errors with retry
        if (this.shouldRetry(error) && !originalRequest._retryCount) {
          return this.retryRequest(originalRequest, error);
        }

        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  /**
   * Refresh authentication token
   */
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh`, {
        refreshToken
      });

      const { token, refreshToken: newRefreshToken } = response.data;
      
      localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
      if (newRefreshToken) {
        localStorage.setItem(AUTH_CONFIG.REFRESH_TOKEN_KEY, newRefreshToken);
      }

      logger.info('Token refreshed successfully');
    } catch (error) {
      logger.error('Token refresh failed', error);
      throw error;
    }
  }

  /**
   * Process queued requests after token refresh
   */
  processRetryQueue(error) {
    this.retryQueue.forEach(({ resolve, reject, config }) => {
      if (error) {
        reject(error);
      } else {
        resolve(this.client(config));
      }
    });
    
    this.retryQueue = [];
  }

  /**
   * Handle authentication errors
   */
  handleAuthError() {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
    
    // Redirect to login or dispatch logout action
    window.location.href = '/login';
  }

  /**
   * Check if request should be retried
   */
  shouldRetry(error) {
    return (
      error.code === 'NETWORK_ERROR' ||
      error.code === 'TIMEOUT' ||
      (error.response?.status >= 500 && error.response?.status < 600)
    );
  }

  /**
   * Retry failed request
   */
  async retryRequest(config, error) {
    config._retryCount = (config._retryCount || 0) + 1;
    
    if (config._retryCount > API_CONFIG.RETRY_ATTEMPTS) {
      logger.error('Max retry attempts reached', { url: config.url, error });
      return Promise.reject(error);
    }

    const delay = API_CONFIG.RETRY_DELAY * Math.pow(2, config._retryCount - 1);
    
    logger.info(`Retrying request (${config._retryCount}/${API_CONFIG.RETRY_ATTEMPTS})`, {
      url: config.url,
      delay
    });

    await new Promise(resolve => setTimeout(resolve, delay));
    
    return this.client(config);
  }

  /**
   * Normalize error response
   */
  normalizeError(error) {
    if (error.response) {
      // Server responded with error status
      return {
        status: error.response.status,
        message: error.response.data?.message || error.message,
        data: error.response.data,
        code: error.response.data?.code || 'SERVER_ERROR'
      };
    } else if (error.request) {
      // Network error
      return {
        status: 0,
        message: 'Network error - please check your connection',
        code: 'NETWORK_ERROR'
      };
    } else {
      // Other error
      return {
        status: 0,
        message: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * GET request
   */
  async get(url, config = {}) {
    const response = await this.client.get(url, config);
    return response.data;
  }

  /**
   * POST request
   */
  async post(url, data = {}, config = {}) {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  /**
   * PUT request
   */
  async put(url, data = {}, config = {}) {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  /**
   * PATCH request
   */
  async patch(url, data = {}, config = {}) {
    const response = await this.client.patch(url, data, config);
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete(url, config = {}) {
    const response = await this.client.delete(url, config);
    return response.data;
  }

  /**
   * Upload file
   */
  async upload(url, file, onProgress = null) {
    const formData = new FormData();
    formData.append('file', file);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    if (onProgress) {
      config.onUploadProgress = (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(progress);
      };
    }

    const response = await this.client.post(url, formData, config);
    return response.data;
  }

  /**
   * Download file
   */
  async download(url, filename) {
    const response = await this.client.get(url, {
      responseType: 'blob'
    });

    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }

  /**
   * Cancel request
   */
  createCancelToken() {
    return axios.CancelToken.source();
  }

  /**
   * Check if error is cancellation
   */
  isCancel(error) {
    return axios.isCancel(error);
  }
}

// Create singleton instance
export const apiClient = new APIClient();

export default apiClient;

