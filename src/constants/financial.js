/**
 * Financial constants and configuration values
 * Centralized location for all financial-related constants
 */

/**
 * Market data refresh intervals (in milliseconds)
 */
export const REFRESH_INTERVALS = {
  REAL_TIME: 1000,      // 1 second
  FAST: 5000,           // 5 seconds
  NORMAL: 30000,        // 30 seconds
  SLOW: 60000,          // 1 minute
  VERY_SLOW: 300000     // 5 minutes
};

/**
 * Market session times (in UTC)
 */
export const MARKET_SESSIONS = {
  US_PRE_MARKET: {
    start: '09:00',
    end: '13:30'
  },
  US_REGULAR: {
    start: '13:30',
    end: '20:00'
  },
  US_AFTER_HOURS: {
    start: '20:00',
    end: '01:00'
  },
  EUROPEAN: {
    start: '07:00',
    end: '15:30'
  },
  ASIAN: {
    start: '23:00',
    end: '06:00'
  }
};

/**
 * Currency codes and symbols
 */
export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  CHF: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' }
};

/**
 * Asset classes and types
 */
export const ASSET_CLASSES = {
  EQUITY: 'equity',
  BOND: 'bond',
  COMMODITY: 'commodity',
  CURRENCY: 'currency',
  CRYPTO: 'crypto',
  REAL_ESTATE: 'real_estate',
  ALTERNATIVE: 'alternative'
};

export const SECURITY_TYPES = {
  STOCK: 'stock',
  ETF: 'etf',
  MUTUAL_FUND: 'mutual_fund',
  BOND: 'bond',
  OPTION: 'option',
  FUTURE: 'future',
  FOREX: 'forex',
  CRYPTO: 'crypto',
  INDEX: 'index'
};

/**
 * Market sectors (GICS classification)
 */
export const MARKET_SECTORS = {
  ENERGY: { code: '10', name: 'Energy' },
  MATERIALS: { code: '15', name: 'Materials' },
  INDUSTRIALS: { code: '20', name: 'Industrials' },
  CONSUMER_DISCRETIONARY: { code: '25', name: 'Consumer Discretionary' },
  CONSUMER_STAPLES: { code: '30', name: 'Consumer Staples' },
  HEALTH_CARE: { code: '35', name: 'Health Care' },
  FINANCIALS: { code: '40', name: 'Financials' },
  INFORMATION_TECHNOLOGY: { code: '45', name: 'Information Technology' },
  COMMUNICATION_SERVICES: { code: '50', name: 'Communication Services' },
  UTILITIES: { code: '55', name: 'Utilities' },
  REAL_ESTATE: { code: '60', name: 'Real Estate' }
};

/**
 * Risk levels and classifications
 */
export const RISK_LEVELS = {
  VERY_LOW: { level: 1, name: 'Very Low', color: '#10B981' },
  LOW: { level: 2, name: 'Low', color: '#84CC16' },
  MODERATE: { level: 3, name: 'Moderate', color: '#F59E0B' },
  HIGH: { level: 4, name: 'High', color: '#EF4444' },
  VERY_HIGH: { level: 5, name: 'Very High', color: '#DC2626' }
};

/**
 * Financial ratios and metrics thresholds
 */
export const RATIO_THRESHOLDS = {
  PE_RATIO: {
    UNDERVALUED: 15,
    FAIR: 25,
    OVERVALUED: 35
  },
  PB_RATIO: {
    UNDERVALUED: 1,
    FAIR: 3,
    OVERVALUED: 5
  },
  DEBT_TO_EQUITY: {
    LOW: 0.3,
    MODERATE: 0.6,
    HIGH: 1.0
  },
  CURRENT_RATIO: {
    POOR: 1.0,
    GOOD: 1.5,
    EXCELLENT: 2.0
  },
  ROE: {
    POOR: 5,
    GOOD: 15,
    EXCELLENT: 20
  }
};

/**
 * Chart and visualization settings
 */
export const CHART_SETTINGS = {
  DEFAULT_TIMEFRAMES: ['1D', '5D', '1M', '3M', '6M', '1Y', '2Y', '5Y', 'MAX'],
  CANDLESTICK_COLORS: {
    UP: '#10B981',
    DOWN: '#EF4444',
    NEUTRAL: '#6B7280'
  },
  VOLUME_COLORS: {
    UP: '#10B98180',
    DOWN: '#EF444480'
  },
  TECHNICAL_INDICATORS: {
    SMA: { periods: [20, 50, 200], color: '#3B82F6' },
    EMA: { periods: [12, 26], color: '#8B5CF6' },
    RSI: { period: 14, overbought: 70, oversold: 30 },
    MACD: { fast: 12, slow: 26, signal: 9 },
    BOLLINGER_BANDS: { period: 20, stdDev: 2 }
  }
};

/**
 * API endpoints and configuration
 */
export const API_ENDPOINTS = {
  MARKET_DATA: '/api/market',
  PORTFOLIO: '/api/portfolio',
  WATCHLIST: '/api/watchlist',
  NEWS: '/api/news',
  FUNDAMENTALS: '/api/fundamentals',
  TECHNICAL: '/api/technical',
  SCREENER: '/api/screener'
};

/**
 * Data validation limits
 */
export const VALIDATION_LIMITS = {
  MAX_WATCHLIST_SYMBOLS: 100,
  MAX_PORTFOLIO_POSITIONS: 500,
  MIN_TRADE_AMOUNT: 0.01,
  MAX_TRADE_AMOUNT: 1000000,
  MAX_SYMBOL_LENGTH: 10,
  MAX_COMPANY_NAME_LENGTH: 100
};

/**
 * Performance benchmarks
 */
export const BENCHMARKS = {
  SP500: { symbol: 'SPY', name: 'S&P 500' },
  NASDAQ: { symbol: 'QQQ', name: 'NASDAQ 100' },
  DOW: { symbol: 'DIA', name: 'Dow Jones' },
  RUSSELL_2000: { symbol: 'IWM', name: 'Russell 2000' },
  INTERNATIONAL: { symbol: 'VTI', name: 'Total International' },
  EMERGING: { symbol: 'VWO', name: 'Emerging Markets' }
};

/**
 * Default portfolio allocation models
 */
export const ALLOCATION_MODELS = {
  CONSERVATIVE: {
    name: 'Conservative',
    stocks: 30,
    bonds: 60,
    cash: 10,
    riskLevel: RISK_LEVELS.LOW
  },
  MODERATE: {
    name: 'Moderate',
    stocks: 60,
    bonds: 35,
    cash: 5,
    riskLevel: RISK_LEVELS.MODERATE
  },
  AGGRESSIVE: {
    name: 'Aggressive',
    stocks: 85,
    bonds: 10,
    cash: 5,
    riskLevel: RISK_LEVELS.HIGH
  },
  GROWTH: {
    name: 'Growth',
    stocks: 90,
    bonds: 5,
    cash: 5,
    riskLevel: RISK_LEVELS.VERY_HIGH
  }
};

/**
 * Number formatting options
 */
export const FORMAT_OPTIONS = {
  CURRENCY: {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  },
  PERCENTAGE: {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  },
  LARGE_NUMBER: {
    notation: 'compact',
    compactDisplay: 'short'
  },
  DECIMAL: {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  }
};

/**
 * Color schemes for different themes
 */
export const COLOR_SCHEMES = {
  LIGHT: {
    primary: '#3B82F6',
    secondary: '#6B7280',
    success: '#10B981',
    danger: '#EF4444',
    warning: '#F59E0B',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    text: '#111827'
  },
  DARK: {
    primary: '#60A5FA',
    secondary: '#9CA3AF',
    success: '#34D399',
    danger: '#F87171',
    warning: '#FBBF24',
    background: '#111827',
    surface: '#1F2937',
    text: '#F9FAFB'
  }
};

/**
 * Feature flags for different subscription tiers
 */
export const FEATURE_FLAGS = {
  FREE_TIER: {
    maxWatchlists: 3,
    maxSymbolsPerWatchlist: 10,
    realTimeData: false,
    advancedCharts: false,
    portfolioAnalytics: false,
    alerts: false
  },
  PREMIUM_TIER: {
    maxWatchlists: 10,
    maxSymbolsPerWatchlist: 50,
    realTimeData: true,
    advancedCharts: true,
    portfolioAnalytics: true,
    alerts: true
  },
  PROFESSIONAL_TIER: {
    maxWatchlists: -1, // Unlimited
    maxSymbolsPerWatchlist: -1, // Unlimited
    realTimeData: true,
    advancedCharts: true,
    portfolioAnalytics: true,
    alerts: true,
    apiAccess: true,
    customIndicators: true
  }
};

export default {
  REFRESH_INTERVALS,
  MARKET_SESSIONS,
  CURRENCIES,
  ASSET_CLASSES,
  SECURITY_TYPES,
  MARKET_SECTORS,
  RISK_LEVELS,
  RATIO_THRESHOLDS,
  CHART_SETTINGS,
  API_ENDPOINTS,
  VALIDATION_LIMITS,
  BENCHMARKS,
  ALLOCATION_MODELS,
  FORMAT_OPTIONS,
  COLOR_SCHEMES,
  FEATURE_FLAGS
};

