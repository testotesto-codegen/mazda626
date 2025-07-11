/**
 * Payment Service
 * Centralized payment processing logic separated from UI components
 */

import { globalErrorHandler, ERROR_CATEGORIES, ERROR_LEVELS } from '../utils/errorHandler';

/**
 * Payment service class for handling Stripe operations
 */
export class PaymentService {
  constructor() {
    this.apiBaseUrl = import.meta.env.VITE_API;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Create a payment method using Stripe
   * @param {Object} stripe - Stripe instance
   * @param {Object} elements - Stripe elements
   * @param {Object} cardElement - Card element reference
   * @returns {Promise<Object>} Payment method result
   */
  async createPaymentMethod(stripe, elements, cardElement) {
    try {
      if (!stripe || !elements) {
        throw new Error('Stripe not initialized');
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        globalErrorHandler.logError(
          error, 
          { context: 'createPaymentMethod' }, 
          ERROR_LEVELS.MEDIUM, 
          ERROR_CATEGORIES.VALIDATION
        );
        throw new Error(error.message);
      }

      return paymentMethod;
    } catch (error) {
      globalErrorHandler.logError(
        error, 
        { context: 'createPaymentMethod' }, 
        ERROR_LEVELS.HIGH, 
        ERROR_CATEGORIES.SYSTEM
      );
      throw error;
    }
  }

  /**
   * Create a subscription
   * @param {string} planId - Subscription plan ID
   * @param {string} paymentMethodId - Payment method ID
   * @param {Object} customerInfo - Customer information
   * @returns {Promise<Object>} Subscription result
   */
  async createSubscription(planId, paymentMethodId, customerInfo = {}) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/v1/createsubscription`, {
        method: 'POST',
        headers: this.defaultHeaders,
        credentials: 'include',
        body: JSON.stringify({
          planId,
          paymentMethodId,
          ...customerInfo
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      globalErrorHandler.logError(
        error, 
        { planId, customerInfo }, 
        ERROR_LEVELS.HIGH, 
        ERROR_CATEGORIES.NETWORK
      );
      throw error;
    }
  }

  /**
   * Update subscription payment method
   * @param {string} subscriptionId - Subscription ID
   * @param {string} paymentMethodId - New payment method ID
   * @returns {Promise<Object>} Update result
   */
  async updateSubscriptionPaymentMethod(subscriptionId, paymentMethodId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/v1/updatepayment`, {
        method: 'POST',
        headers: this.defaultHeaders,
        credentials: 'include',
        body: JSON.stringify({
          subscriptionId,
          paymentMethodId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      globalErrorHandler.logError(
        error, 
        { subscriptionId }, 
        ERROR_LEVELS.HIGH, 
        ERROR_CATEGORIES.NETWORK
      );
      throw error;
    }
  }

  /**
   * Cancel subscription
   * @param {string} subscriptionId - Subscription ID
   * @returns {Promise<Object>} Cancellation result
   */
  async cancelSubscription(subscriptionId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/v1/cancelsubscription`, {
        method: 'POST',
        headers: this.defaultHeaders,
        credentials: 'include',
        body: JSON.stringify({ subscriptionId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      globalErrorHandler.logError(
        error, 
        { subscriptionId }, 
        ERROR_LEVELS.HIGH, 
        ERROR_CATEGORIES.NETWORK
      );
      throw error;
    }
  }

  /**
   * Get subscription details
   * @param {string} subscriptionId - Subscription ID
   * @returns {Promise<Object>} Subscription details
   */
  async getSubscriptionDetails(subscriptionId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/v1/subscription/${subscriptionId}`, {
        method: 'GET',
        headers: this.defaultHeaders,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      globalErrorHandler.logError(
        error, 
        { subscriptionId }, 
        ERROR_LEVELS.MEDIUM, 
        ERROR_CATEGORIES.NETWORK
      );
      throw error;
    }
  }

  /**
   * Validate customer information
   * @param {Object} customerInfo - Customer information to validate
   * @returns {Object} Validation result
   */
  validateCustomerInfo(customerInfo) {
    const errors = {};
    let isValid = true;

    if (!customerInfo.firstName || customerInfo.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
      isValid = false;
    }

    if (!customerInfo.lastName || customerInfo.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
      isValid = false;
    }

    if (!customerInfo.zipCode || !/^\d{5}(-\d{4})?$/.test(customerInfo.zipCode)) {
      errors.zipCode = 'Please enter a valid ZIP code';
      isValid = false;
    }

    if (!isValid) {
      globalErrorHandler.logError(
        'Customer info validation failed', 
        { errors }, 
        ERROR_LEVELS.LOW, 
        ERROR_CATEGORIES.VALIDATION
      );
    }

    return { isValid, errors };
  }

  /**
   * Format payment amount for display
   * @param {number} amount - Amount in cents
   * @param {string} currency - Currency code
   * @returns {string} Formatted amount
   */
  formatAmount(amount, currency = 'USD') {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
      }).format(amount / 100);
    } catch (error) {
      globalErrorHandler.logError(error, { amount, currency }, ERROR_LEVELS.LOW, ERROR_CATEGORIES.SYSTEM);
      return `$${(amount / 100).toFixed(2)}`;
    }
  }

  /**
   * Get available payment plans
   * @returns {Promise<Array>} Available plans
   */
  async getAvailablePlans() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/v1/plans`, {
        method: 'GET',
        headers: this.defaultHeaders,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.plans || [];
    } catch (error) {
      globalErrorHandler.logError(error, {}, ERROR_LEVELS.MEDIUM, ERROR_CATEGORIES.NETWORK);
      throw error;
    }
  }
}

/**
 * Global payment service instance
 */
export const paymentService = new PaymentService();

/**
 * Payment utility functions
 */

/**
 * Validate credit card number using Luhn algorithm
 * @param {string} cardNumber - Credit card number
 * @returns {boolean} True if valid
 */
export const validateCreditCard = (cardNumber) => {
  const num = cardNumber.replace(/\D/g, '');
  
  if (num.length < 13 || num.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = num.length - 1; i >= 0; i--) {
    let digit = parseInt(num.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

/**
 * Get credit card type from number
 * @param {string} cardNumber - Credit card number
 * @returns {string} Card type
 */
export const getCreditCardType = (cardNumber) => {
  const num = cardNumber.replace(/\D/g, '');
  
  if (/^4/.test(num)) return 'Visa';
  if (/^5[1-5]/.test(num)) return 'MasterCard';
  if (/^3[47]/.test(num)) return 'American Express';
  if (/^6/.test(num)) return 'Discover';
  
  return 'Unknown';
};

/**
 * Format credit card number for display
 * @param {string} cardNumber - Credit card number
 * @returns {string} Formatted card number
 */
export const formatCreditCardNumber = (cardNumber) => {
  const num = cardNumber.replace(/\D/g, '');
  return num.replace(/(\d{4})(?=\d)/g, '$1 ');
};

