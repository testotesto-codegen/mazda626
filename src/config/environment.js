/**
 * Environment configuration utilities
 */

/**
 * Check if app is running in development mode
 * @returns {boolean} True if in development mode
 */
export const isDevelopment = () => {
  return import.meta.env.DEV;
};

/**
 * Check if app is running in production mode
 * @returns {boolean} True if in production mode
 */
export const isProduction = () => {
  return import.meta.env.PROD;
};

/**
 * Get current environment mode
 * @returns {string} Current environment (development, production, test)
 */
export const getEnvironment = () => {
  if (import.meta.env.DEV) return 'development';
  if (import.meta.env.PROD) return 'production';
  return 'unknown';
};

/**
 * Get environment variable with fallback
 * @param {string} key - Environment variable key
 * @param {string} fallback - Fallback value if not found
 * @returns {string} Environment variable value or fallback
 */
export const getEnvVar = (key, fallback = '') => {
  return import.meta.env[key] || fallback;
};

/**
 * Environment-specific configuration
 */
export const ENV_CONFIG = {
  development: {
    showDevBanner: true,
    enableDebugLogs: true,
    apiTimeout: 30000,
  },
  production: {
    showDevBanner: false,
    enableDebugLogs: false,
    apiTimeout: 10000,
  }
};

/**
 * Get current environment configuration
 * @returns {Object} Current environment config
 */
export const getCurrentConfig = () => {
  const env = getEnvironment();
  return ENV_CONFIG[env] || ENV_CONFIG.production;
};
