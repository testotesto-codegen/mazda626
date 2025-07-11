/**
 * Application Constants
 * Centralized constants used throughout the application
 */

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification'
  },
  MARKET: {
    QUOTES: '/market/quotes',
    SEARCH: '/market/search',
    HISTORICAL: '/market/historical',
    NEWS: '/market/news',
    EARNINGS: '/market/earnings',
    MOVERS: '/market/movers'
  },
  PORTFOLIO: {
    LIST: '/portfolio',
    CREATE: '/portfolio',
    UPDATE: '/portfolio',
    DELETE: '/portfolio',
    HOLDINGS: '/portfolio/holdings',
    PERFORMANCE: '/portfolio/performance',
    TRANSACTIONS: '/portfolio/transactions'
  },
  PAYMENTS: {
    SUBSCRIPTIONS: '/payments/subscriptions',
    INVOICES: '/payments/invoices',
    PAYMENT_METHODS: '/payments/methods',
    BILLING: '/payments/billing'
  }
};

/**
 * Route Paths
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  DASHBOARD: '/dashboard',
  PORTFOLIO: '/dashboard/portfolio',
  WATCHLIST: '/dashboard/watchlist',
  MARKET: '/dashboard/market',
  EARNINGS: '/dashboard/earnings',
  MOVERS: '/dashboard/movers',
  SETTINGS: '/dashboard/settings',
  ACCOUNT: '/dashboard/account',
  SUBSCRIPTION: '/dashboard/subscription',
  PRICING: '/pricing',
  CONTACT: '/contact',
  ROADMAP: '/roadmap'
};

/**
 * User Roles
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  PREMIUM: 'premium',
  TRIAL: 'trial'
};

/**
 * User Permissions
 */
export const PERMISSIONS = {
  READ: 'read',
  WRITE: 'write',
  DELETE: 'delete',
  ADMIN: 'admin',
  PREMIUM_FEATURES: 'premium_features',
  REAL_TIME_DATA: 'real_time_data',
  ADVANCED_CHARTS: 'advanced_charts',
  PORTFOLIO_ANALYSIS: 'portfolio_analysis'
};

/**
 * Subscription Plans
 */
export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  BASIC: 'basic',
  PREMIUM: 'premium',
  PROFESSIONAL: 'professional'
};

/**
 * Market Data Types
 */
export const MARKET_DATA_TYPES = {
  QUOTE: 'quote',
  HISTORICAL: 'historical',
  INTRADAY: 'intraday',
  NEWS: 'news',
  EARNINGS: 'earnings',
  FUNDAMENTALS: 'fundamentals'
};

/**
 * Chart Types
 */
export const CHART_TYPES = {
  LINE: 'line',
  CANDLESTICK: 'candlestick',
  BAR: 'bar',
  AREA: 'area',
  VOLUME: 'volume',
  PIE: 'pie',
  DONUT: 'donut',
  HEATMAP: 'heatmap'
};

/**
 * Time Periods
 */
export const TIME_PERIODS = {
  INTRADAY: {
    '1m': '1 Minute',
    '5m': '5 Minutes',
    '15m': '15 Minutes',
    '30m': '30 Minutes',
    '1h': '1 Hour',
    '4h': '4 Hours'
  },
  DAILY: {
    '1d': '1 Day',
    '5d': '5 Days',
    '1w': '1 Week',
    '1m': '1 Month',
    '3m': '3 Months',
    '6m': '6 Months',
    '1y': '1 Year',
    '2y': '2 Years',
    '5y': '5 Years',
    'max': 'Max'
  }
};

/**
 * Order Types
 */
export const ORDER_TYPES = {
  MARKET: 'market',
  LIMIT: 'limit',
  STOP: 'stop',
  STOP_LIMIT: 'stop_limit'
};

/**
 * Order Sides
 */
export const ORDER_SIDES = {
  BUY: 'buy',
  SELL: 'sell'
};

/**
 * Asset Classes
 */
export const ASSET_CLASSES = {
  STOCKS: 'stocks',
  ETF: 'etf',
  MUTUAL_FUNDS: 'mutual_funds',
  BONDS: 'bonds',
  CRYPTO: 'crypto',
  COMMODITIES: 'commodities',
  FOREX: 'forex'
};

/**
 * Market Status
 */
export const MARKET_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
  PRE_MARKET: 'pre_market',
  AFTER_HOURS: 'after_hours',
  HOLIDAY: 'holiday'
};

/**
 * Notification Types
 */
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

/**
 * Theme Options
 */
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

/**
 * File Types
 */
export const FILE_TYPES = {
  IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
  DOCUMENT: ['pdf', 'doc', 'docx', 'txt', 'rtf'],
  SPREADSHEET: ['xls', 'xlsx', 'csv'],
  ARCHIVE: ['zip', 'rar', '7z', 'tar', 'gz']
};

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
};

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  SIDEBAR_STATE: 'sidebar_state',
  WATCHLIST: 'watchlist',
  PORTFOLIO_SETTINGS: 'portfolio_settings',
  CHART_SETTINGS: 'chart_settings',
  NOTIFICATION_SETTINGS: 'notification_settings'
};

/**
 * Event Names
 */
export const EVENTS = {
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  USER_REGISTER: 'user_register',
  PORTFOLIO_UPDATE: 'portfolio_update',
  MARKET_DATA_UPDATE: 'market_data_update',
  NOTIFICATION_RECEIVED: 'notification_received',
  THEME_CHANGED: 'theme_changed',
  ERROR_OCCURRED: 'error_occurred'
};

/**
 * Validation Rules
 */
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  NAME_MAX_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 500,
  SYMBOL_REGEX: /^[A-Z]{1,5}$/,
  CURRENCY_REGEX: /^\d+(\.\d{1,2})?$/
};

/**
 * Default Values
 */
export const DEFAULTS = {
  PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 300,
  TOAST_DURATION: 5000,
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  CHART_HEIGHT: 400,
  SIDEBAR_WIDTH: 256,
  MOBILE_BREAKPOINT: 768
};

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  GENERIC: 'An unexpected error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TIMEOUT: 'Request timed out. Please try again.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  EMAIL_REQUIRED: 'Email is required.',
  PASSWORD_REQUIRED: 'Password is required.',
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters.`,
  INVALID_EMAIL: 'Please enter a valid email address.',
  PASSWORDS_DONT_MATCH: 'Passwords do not match.',
  SYMBOL_REQUIRED: 'Stock symbol is required.',
  INVALID_SYMBOL: 'Please enter a valid stock symbol.',
  AMOUNT_REQUIRED: 'Amount is required.',
  INVALID_AMOUNT: 'Please enter a valid amount.'
};

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  LOGIN: 'Successfully logged in!',
  LOGOUT: 'Successfully logged out!',
  REGISTER: 'Account created successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  EMAIL_VERIFIED: 'Email verified successfully!',
  PASSWORD_RESET_SENT: 'Password reset email sent!',
  PASSWORD_RESET: 'Password reset successfully!',
  PORTFOLIO_CREATED: 'Portfolio created successfully!',
  PORTFOLIO_UPDATED: 'Portfolio updated successfully!',
  PORTFOLIO_DELETED: 'Portfolio deleted successfully!',
  WATCHLIST_UPDATED: 'Watchlist updated successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!'
};

/**
 * Loading Messages
 */
export const LOADING_MESSAGES = {
  LOGGING_IN: 'Logging in...',
  REGISTERING: 'Creating account...',
  LOADING: 'Loading...',
  SAVING: 'Saving...',
  UPDATING: 'Updating...',
  DELETING: 'Deleting...',
  PROCESSING: 'Processing...',
  FETCHING_DATA: 'Fetching data...',
  UPLOADING: 'Uploading...',
  DOWNLOADING: 'Downloading...'
};

export default {
  API_ENDPOINTS,
  ROUTES,
  USER_ROLES,
  PERMISSIONS,
  SUBSCRIPTION_PLANS,
  MARKET_DATA_TYPES,
  CHART_TYPES,
  TIME_PERIODS,
  ORDER_TYPES,
  ORDER_SIDES,
  ASSET_CLASSES,
  MARKET_STATUS,
  NOTIFICATION_TYPES,
  THEMES,
  FILE_TYPES,
  HTTP_STATUS,
  STORAGE_KEYS,
  EVENTS,
  VALIDATION,
  DEFAULTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOADING_MESSAGES
};

