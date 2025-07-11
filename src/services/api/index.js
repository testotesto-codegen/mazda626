/**
 * API Services - Centralized exports for all API services
 */

// API Client utilities
export * from './apiClient';

// Service modules
export * as authService from './authService';
export * as paymentService from './paymentService';

// Re-export commonly used functions for convenience
export { 
  login, 
  register, 
  logout, 
  verifySession,
  requestPasswordReset,
  resetPassword,
  verifyEmail 
} from './authService';

export { 
  createSubscription, 
  updateSubscription, 
  cancelSubscription, 
  getSubscriptionDetails,
  getPricingPlans 
} from './paymentService';

