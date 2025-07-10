/**
 * Centralized logging utility for the application
 * Provides different log levels and environment-aware behavior
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

const LOG_COLORS = {
  DEBUG: '#6B7280', // Gray
  INFO: '#3B82F6',  // Blue
  WARN: '#F59E0B',  // Amber
  ERROR: '#EF4444'  // Red
};

class Logger {
  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.currentLevel = this.isDevelopment ? LOG_LEVELS.DEBUG : LOG_LEVELS.WARN;
  }

  /**
   * Format log message with timestamp and context
   */
  formatMessage(level, message, context = {}) {
    const timestamp = new Date().toISOString();
    const levelName = Object.keys(LOG_LEVELS)[Object.values(LOG_LEVELS).indexOf(level)];
    
    return {
      timestamp,
      level: levelName,
      message,
      context,
      isDevelopment: this.isDevelopment
    };
  }

  /**
   * Output log to console with appropriate styling
   */
  output(level, message, context = {}) {
    if (level < this.currentLevel) return;

    const formatted = this.formatMessage(level, message, context);
    const levelName = formatted.level;
    const color = LOG_COLORS[levelName];

    if (this.isDevelopment) {
      // Enhanced development logging with colors and context
      console.groupCollapsed(
        `%c[${formatted.timestamp}] ${levelName}: ${message}`,
        `color: ${color}; font-weight: bold;`
      );
      
      if (Object.keys(context).length > 0) {
        console.log('Context:', context);
      }
      
      console.trace('Stack trace');
      console.groupEnd();
    } else {
      // Simple production logging
      const logMethod = level >= LOG_LEVELS.ERROR ? 'error' : 
                       level >= LOG_LEVELS.WARN ? 'warn' : 'log';
      console[logMethod](`[${levelName}] ${message}`, context);
    }
  }

  /**
   * Debug level logging - only shown in development
   */
  debug(message, context = {}) {
    this.output(LOG_LEVELS.DEBUG, message, context);
  }

  /**
   * Info level logging
   */
  info(message, context = {}) {
    this.output(LOG_LEVELS.INFO, message, context);
  }

  /**
   * Warning level logging
   */
  warn(message, context = {}) {
    this.output(LOG_LEVELS.WARN, message, context);
  }

  /**
   * Error level logging
   */
  error(message, context = {}) {
    this.output(LOG_LEVELS.ERROR, message, context);
  }

  /**
   * Log API requests and responses
   */
  api(method, url, data = null, response = null) {
    this.debug(`API ${method.toUpperCase()}: ${url}`, {
      requestData: data,
      response: response
    });
  }

  /**
   * Log user interactions
   */
  user(action, details = {}) {
    this.info(`User Action: ${action}`, details);
  }

  /**
   * Log performance metrics
   */
  performance(metric, value, unit = 'ms') {
    this.debug(`Performance: ${metric} = ${value}${unit}`);
  }

  /**
   * Log subscription-related events
   */
  subscription(event, details = {}) {
    this.info(`Subscription: ${event}`, details);
  }

  /**
   * Set log level programmatically
   */
  setLevel(level) {
    if (typeof level === 'string') {
      this.currentLevel = LOG_LEVELS[level.toUpperCase()] ?? LOG_LEVELS.INFO;
    } else {
      this.currentLevel = level;
    }
  }
}

// Create singleton instance
const logger = new Logger();

export default logger;

// Named exports for convenience
export const { debug, info, warn, error, api, user, performance, subscription } = logger;

