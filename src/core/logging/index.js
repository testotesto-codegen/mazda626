/**
 * Centralized Logging System
 * Provides structured logging with different levels and contexts
 */

import { ENV, DEV_CONFIG } from '../config';

/**
 * Log levels
 */
export const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

/**
 * Log level names
 */
const LOG_LEVEL_NAMES = {
  [LOG_LEVELS.ERROR]: 'ERROR',
  [LOG_LEVELS.WARN]: 'WARN',
  [LOG_LEVELS.INFO]: 'INFO',
  [LOG_LEVELS.DEBUG]: 'DEBUG'
};

/**
 * Current log level based on environment
 */
const CURRENT_LOG_LEVEL = ENV.DEV ? LOG_LEVELS.DEBUG : LOG_LEVELS.WARN;

/**
 * Log colors for console output
 */
const LOG_COLORS = {
  [LOG_LEVELS.ERROR]: '#FF6B6B',
  [LOG_LEVELS.WARN]: '#FFD93D',
  [LOG_LEVELS.INFO]: '#6BCF7F',
  [LOG_LEVELS.DEBUG]: '#4ECDC4'
};

/**
 * Format timestamp
 * @returns {string} Formatted timestamp
 */
const formatTimestamp = () => {
  return new Date().toISOString();
};

/**
 * Format log message
 * @param {number} level - Log level
 * @param {string} context - Log context
 * @param {string} message - Log message
 * @param {*} data - Additional data
 * @returns {Object} Formatted log entry
 */
const formatLogEntry = (level, context, message, data) => {
  return {
    timestamp: formatTimestamp(),
    level: LOG_LEVEL_NAMES[level],
    context,
    message,
    data,
    userAgent: navigator.userAgent,
    url: window.location.href
  };
};

/**
 * Check if log level should be output
 * @param {number} level - Log level to check
 * @returns {boolean} Whether to output log
 */
const shouldLog = (level) => {
  return level <= CURRENT_LOG_LEVEL;
};

/**
 * Output log to console with styling
 * @param {Object} logEntry - Formatted log entry
 */
const outputToConsole = (logEntry) => {
  if (!DEV_CONFIG.ENABLE_CONSOLE_LOGS) return;

  const { level, context, message, data } = logEntry;
  const color = LOG_COLORS[LOG_LEVELS[level]];
  const timestamp = new Date(logEntry.timestamp).toLocaleTimeString();

  const style = `color: ${color}; font-weight: bold;`;
  const contextStyle = 'color: #666; font-weight: normal;';

  console.groupCollapsed(
    `%c[${level}]%c [${context}] %c${message}`,
    style,
    contextStyle,
    'color: inherit;'
  );
  
  console.log('Timestamp:', timestamp);
  if (data) {
    console.log('Data:', data);
  }
  console.log('Full Entry:', logEntry);
  console.groupEnd();
};

/**
 * Send log to external service (placeholder)
 * @param {Object} logEntry - Formatted log entry
 */
const sendToExternalService = async (logEntry) => {
  // Placeholder for external logging service integration
  // e.g., Sentry, LogRocket, DataDog, etc.
  if (ENV.PROD && logEntry.level === 'ERROR') {
    try {
      // await externalLoggingService.send(logEntry);
    } catch (error) {
      console.error('Failed to send log to external service:', error);
    }
  }
};

/**
 * Core logging function
 * @param {number} level - Log level
 * @param {string} context - Log context
 * @param {string} message - Log message
 * @param {*} data - Additional data
 */
const log = (level, context, message, data = null) => {
  if (!shouldLog(level)) return;

  const logEntry = formatLogEntry(level, context, message, data);
  
  outputToConsole(logEntry);
  sendToExternalService(logEntry);
};

/**
 * Logger class for context-specific logging
 */
export class Logger {
  constructor(context) {
    this.context = context;
  }

  /**
   * Log error message
   * @param {string} message - Error message
   * @param {*} data - Additional data
   */
  error(message, data = null) {
    log(LOG_LEVELS.ERROR, this.context, message, data);
  }

  /**
   * Log warning message
   * @param {string} message - Warning message
   * @param {*} data - Additional data
   */
  warn(message, data = null) {
    log(LOG_LEVELS.WARN, this.context, message, data);
  }

  /**
   * Log info message
   * @param {string} message - Info message
   * @param {*} data - Additional data
   */
  info(message, data = null) {
    log(LOG_LEVELS.INFO, this.context, message, data);
  }

  /**
   * Log debug message
   * @param {string} message - Debug message
   * @param {*} data - Additional data
   */
  debug(message, data = null) {
    log(LOG_LEVELS.DEBUG, this.context, message, data);
  }

  /**
   * Log API request
   * @param {string} method - HTTP method
   * @param {string} url - Request URL
   * @param {*} data - Request data
   */
  apiRequest(method, url, data = null) {
    this.debug(`API Request: ${method} ${url}`, data);
  }

  /**
   * Log API response
   * @param {string} method - HTTP method
   * @param {string} url - Request URL
   * @param {number} status - Response status
   * @param {*} data - Response data
   */
  apiResponse(method, url, status, data = null) {
    const level = status >= 400 ? LOG_LEVELS.ERROR : LOG_LEVELS.DEBUG;
    log(level, this.context, `API Response: ${method} ${url} - ${status}`, data);
  }

  /**
   * Log user action
   * @param {string} action - User action
   * @param {*} data - Action data
   */
  userAction(action, data = null) {
    this.info(`User Action: ${action}`, data);
  }

  /**
   * Log performance metric
   * @param {string} metric - Metric name
   * @param {number} value - Metric value
   * @param {string} unit - Metric unit
   */
  performance(metric, value, unit = 'ms') {
    this.debug(`Performance: ${metric} = ${value}${unit}`);
  }
}

/**
 * Create logger for specific context
 * @param {string} context - Logger context
 * @returns {Logger} Logger instance
 */
export const createLogger = (context) => {
  return new Logger(context);
};

/**
 * Default logger instance
 */
export const logger = createLogger('App');

/**
 * Performance logging utilities
 */
export const performance = {
  /**
   * Start performance timer
   * @param {string} name - Timer name
   */
  start: (name) => {
    if (ENV.DEV) {
      console.time(name);
    }
  },

  /**
   * End performance timer
   * @param {string} name - Timer name
   */
  end: (name) => {
    if (ENV.DEV) {
      console.timeEnd(name);
    }
  },

  /**
   * Mark performance point
   * @param {string} name - Mark name
   */
  mark: (name) => {
    if (ENV.DEV && window.performance) {
      window.performance.mark(name);
    }
  },

  /**
   * Measure performance between marks
   * @param {string} name - Measure name
   * @param {string} startMark - Start mark name
   * @param {string} endMark - End mark name
   */
  measure: (name, startMark, endMark) => {
    if (ENV.DEV && window.performance) {
      try {
        window.performance.measure(name, startMark, endMark);
        const measure = window.performance.getEntriesByName(name)[0];
        logger.performance(name, Math.round(measure.duration));
      } catch (error) {
        logger.warn('Performance measurement failed', { name, startMark, endMark, error });
      }
    }
  }
};

/**
 * Error boundary logging
 * @param {Error} error - Error object
 * @param {Object} errorInfo - Error info from React
 */
export const logErrorBoundary = (error, errorInfo) => {
  logger.error('React Error Boundary Caught Error', {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack
    },
    errorInfo,
    componentStack: errorInfo.componentStack
  });
};

export default {
  Logger,
  createLogger,
  logger,
  performance,
  logErrorBoundary,
  LOG_LEVELS
};

