/**
 * Application Configuration Management
 * Centralizes all environment variables and configuration settings
 */

/**
 * Environment configuration
 */
export const ENV = {
  NODE_ENV: import.meta.env.NODE_ENV || 'development',
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
  SSR: import.meta.env.SSR
};

/**
 * API configuration
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};

/**
 * Authentication configuration
 */
export const AUTH_CONFIG = {
  TOKEN_KEY: 'auth_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  REMEMBER_ME_DURATION: 30 * 24 * 60 * 60 * 1000 // 30 days
};

/**
 * UI configuration
 */
export const UI_CONFIG = {
  THEME_KEY: 'app_theme',
  SIDEBAR_KEY: 'sidebar_state',
  DEFAULT_THEME: 'light',
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 300
};

/**
 * Feature flags
 */
export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_ERROR_REPORTING: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
  ENABLE_BETA_FEATURES: import.meta.env.VITE_ENABLE_BETA_FEATURES === 'true',
  ENABLE_REAL_TIME_DATA: import.meta.env.VITE_ENABLE_REAL_TIME_DATA === 'true'
};

/**
 * Chart configuration
 */
export const CHART_CONFIG = {
  DEFAULT_HEIGHT: 400,
  DEFAULT_COLORS: [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ],
  ANIMATION_DURATION: 750,
  RESPONSIVE_BREAKPOINTS: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280
  }
};

/**
 * Pagination configuration
 */
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
};

/**
 * Validation configuration
 */
export const VALIDATION_CONFIG = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_SPECIAL: true,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/
};

/**
 * Storage configuration
 */
export const STORAGE_CONFIG = {
  PREFIX: 'accelno_',
  VERSION: '1.0',
  ENCRYPTION_KEY: import.meta.env.VITE_STORAGE_KEY || 'default_key'
};

/**
 * Development configuration
 */
export const DEV_CONFIG = {
  ENABLE_REDUX_DEVTOOLS: ENV.DEV,
  ENABLE_CONSOLE_LOGS: ENV.DEV,
  MOCK_API_DELAY: 1000,
  SHOW_TEST_BANNER: ENV.DEV
};

/**
 * Get configuration value with fallback
 * @param {string} key - Configuration key
 * @param {*} fallback - Fallback value
 * @returns {*} Configuration value
 */
export const getConfig = (key, fallback = null) => {
  const keys = key.split('.');
  let value = {
    ENV,
    API_CONFIG,
    AUTH_CONFIG,
    UI_CONFIG,
    FEATURE_FLAGS,
    CHART_CONFIG,
    PAGINATION_CONFIG,
    VALIDATION_CONFIG,
    STORAGE_CONFIG,
    DEV_CONFIG
  };

  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) return fallback;
  }

  return value;
};

/**
 * Check if feature is enabled
 * @param {string} feature - Feature flag name
 * @returns {boolean} Whether feature is enabled
 */
export const isFeatureEnabled = (feature) => {
  return FEATURE_FLAGS[feature] || false;
};

/**
 * Get environment-specific configuration
 * @returns {Object} Environment configuration
 */
export const getEnvironmentConfig = () => {
  const baseConfig = {
    apiUrl: API_CONFIG.BASE_URL,
    enableAnalytics: FEATURE_FLAGS.ENABLE_ANALYTICS,
    enableErrorReporting: FEATURE_FLAGS.ENABLE_ERROR_REPORTING
  };

  if (ENV.DEV) {
    return {
      ...baseConfig,
      debug: true,
      mockDelay: DEV_CONFIG.MOCK_API_DELAY,
      showTestBanner: DEV_CONFIG.SHOW_TEST_BANNER
    };
  }

  if (ENV.PROD) {
    return {
      ...baseConfig,
      debug: false,
      enableOptimizations: true
    };
  }

  return baseConfig;
};

export default {
  ENV,
  API_CONFIG,
  AUTH_CONFIG,
  UI_CONFIG,
  FEATURE_FLAGS,
  CHART_CONFIG,
  PAGINATION_CONFIG,
  VALIDATION_CONFIG,
  STORAGE_CONFIG,
  DEV_CONFIG,
  getConfig,
  isFeatureEnabled,
  getEnvironmentConfig
};

