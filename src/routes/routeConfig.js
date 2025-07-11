/**
 * Route configuration constants and utilities
 */

// Route paths
export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PRICING: '/pricing',
  ROADMAP: '/roadmap',
  CONTACT: '/contact',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  CONFIRM_EMAIL: '/confirm-email',
  VERIFY_EMAIL: '/verify-email',
  
  // Dashboard routes
  DASHBOARD: '/dashboard',
  DASHBOARD_HOME: '/dashboard/home',
  WATCHLIST: '/dashboard/watchlist',
  TODAYS_MOVERS: '/dashboard/todays-movers',
  MARKET_DASHBOARD: '/dashboard/market-dashboard',
  PORTFOLIO: '/dashboard/portfolio',
  SETTINGS: '/dashboard/settings',
  ACCOUNT: '/dashboard/account',
  SUBSCRIPTION: '/dashboard/subscription',
  
  // Valuation routes
  VALUATION: '/dashboard/valuation',
  VALUATION_COMPS: '/dashboard/valuation/comps',
  VALUATION_DCF: '/dashboard/valuation/dcf',
  VALUATION_LBO: '/dashboard/valuation/lbo',
  VALUATION_CUSTOM: '/dashboard/valuation/custom',
  VALUATION_SPREADSHEET: '/dashboard/valuation/spreadsheet',
  
  // Other features
  EQUITY: '/dashboard/equity',
  CHARTS: '/dashboard/charts',
  NEWS: '/dashboard/news',
  FILING_10K: '/dashboard/filing-10k',
  CHECKOUT: '/checkout',
  
  // Test routes
  TEST_TWO: '/test-two',
  
  // Auth
  LOGOUT: '/logout'
};

// Route metadata
export const ROUTE_META = {
  [ROUTES.HOME]: { title: 'Home', requiresAuth: false },
  [ROUTES.LOGIN]: { title: 'Login', requiresAuth: false },
  [ROUTES.REGISTER]: { title: 'Register', requiresAuth: false },
  [ROUTES.PRICING]: { title: 'Pricing', requiresAuth: false },
  [ROUTES.DASHBOARD]: { title: 'Dashboard', requiresAuth: true },
  [ROUTES.WATCHLIST]: { title: 'Watchlist', requiresAuth: true },
  [ROUTES.PORTFOLIO]: { title: 'Portfolio', requiresAuth: true },
  // Add more as needed
};

// Helper function to check if route requires authentication
export const requiresAuth = (path) => {
  return ROUTE_META[path]?.requiresAuth ?? false;
};
