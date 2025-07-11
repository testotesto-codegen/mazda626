/**
 * Centralized export for all API services
 * Provides easy access to all services from a single import
 */

// Core API client
export { default as api, apiClient, apiUtils, apiTransformers } from './apiClient';

// Service modules (to be created as needed)
// export { default as authService } from './authService';
// export { default as userService } from './userService';
// export { default as marketService } from './marketService';
// export { default as portfolioService } from './portfolioService';

/**
 * Service factory for creating consistent service modules
 * @param {string} baseEndpoint - Base endpoint for the service
 * @param {Object} options - Configuration options
 * @returns {Object} - Service object with CRUD operations
 */
export const createService = (baseEndpoint, options = {}) => {
  const {
    transformer = (data) => data,
    errorHandler = null,
  } = options;

  return {
    /**
     * Get all items
     */
    getAll: async (params = {}) => {
      const response = await api.get(apiUtils.buildUrl(baseEndpoint, params));
      return transformer(response);
    },

    /**
     * Get item by ID
     */
    getById: async (id) => {
      const response = await api.get(`${baseEndpoint}/${id}`);
      return transformer(response);
    },

    /**
     * Create new item
     */
    create: async (data) => {
      const response = await api.post(baseEndpoint, data);
      return transformer(response);
    },

    /**
     * Update item by ID
     */
    update: async (id, data) => {
      const response = await api.put(`${baseEndpoint}/${id}`, data);
      return transformer(response);
    },

    /**
     * Partially update item by ID
     */
    patch: async (id, data) => {
      const response = await api.patch(`${baseEndpoint}/${id}`, data);
      return transformer(response);
    },

    /**
     * Delete item by ID
     */
    delete: async (id) => {
      const response = await api.delete(`${baseEndpoint}/${id}`);
      return transformer(response);
    },

    /**
     * Search items
     */
    search: async (query, params = {}) => {
      const searchParams = { q: query, ...params };
      const response = await api.get(apiUtils.buildUrl(`${baseEndpoint}/search`, searchParams));
      return transformer(response);
    },
  };
};

// Example service implementations (uncomment and modify as needed)

/*
// Authentication service
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.token) {
      localStorage.setItem('authToken', response.token);
    }
    return response;
  },

  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  },

  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },

  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    if (response.token) {
      localStorage.setItem('authToken', response.token);
    }
    return response;
  },

  forgotPassword: async (email) => {
    return await api.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token, password) => {
    return await api.post('/auth/reset-password', { token, password });
  },

  verifyEmail: async (token) => {
    return await api.post('/auth/verify-email', { token });
  },
};

// User service
export const userService = createService('/users', {
  transformer: apiTransformers.item,
});

// Market data service
export const marketService = {
  getMarketData: async (symbol) => {
    return await api.get(`/market/data/${symbol}`);
  },

  getWatchlist: async () => {
    return await api.get('/market/watchlist');
  },

  addToWatchlist: async (symbol) => {
    return await api.post('/market/watchlist', { symbol });
  },

  removeFromWatchlist: async (symbol) => {
    return await api.delete(`/market/watchlist/${symbol}`);
  },

  getMovers: async (type = 'gainers') => {
    return await api.get(`/market/movers/${type}`);
  },

  getEarningsCalendar: async (date) => {
    return await api.get('/market/earnings', { date });
  },
};

// Portfolio service
export const portfolioService = {
  getPortfolio: async () => {
    return await api.get('/portfolio');
  },

  getPositions: async () => {
    return await api.get('/portfolio/positions');
  },

  addPosition: async (position) => {
    return await api.post('/portfolio/positions', position);
  },

  updatePosition: async (id, position) => {
    return await api.put(`/portfolio/positions/${id}`, position);
  },

  deletePosition: async (id) => {
    return await api.delete(`/portfolio/positions/${id}`);
  },

  getPerformance: async (period = '1M') => {
    return await api.get('/portfolio/performance', { period });
  },
};
*/

// Re-export API utilities for convenience
export { apiUtils, apiTransformers } from './apiClient';

export default {
  api,
  apiClient,
  apiUtils,
  apiTransformers,
  createService,
  // authService,
  // userService,
  // marketService,
  // portfolioService,
};

