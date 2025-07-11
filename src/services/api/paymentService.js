/**
 * Payment Service - Handles all payment-related API calls
 */

const API_BASE_URL = import.meta.env.VITE_API;

/**
 * Creates a new subscription with Stripe
 * @param {string} planId - The subscription plan ID
 * @param {string} paymentMethodId - The Stripe payment method ID
 * @param {Object} customerInfo - Customer information
 * @returns {Promise<Object>} Subscription creation response
 */
export const createSubscription = async (planId, paymentMethodId, customerInfo = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/createsubscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        planId,
        paymentMethodId,
        ...customerInfo,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

/**
 * Updates an existing subscription
 * @param {string} subscriptionId - The subscription ID to update
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Update response
 */
export const updateSubscription = async (subscriptionId, updateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/updatesubscription`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        subscriptionId,
        ...updateData,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};

/**
 * Cancels a subscription
 * @param {string} subscriptionId - The subscription ID to cancel
 * @returns {Promise<Object>} Cancellation response
 */
export const cancelSubscription = async (subscriptionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/cancelsubscription`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ subscriptionId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};

/**
 * Gets subscription details
 * @param {string} subscriptionId - The subscription ID
 * @returns {Promise<Object>} Subscription details
 */
export const getSubscriptionDetails = async (subscriptionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/subscription/${subscriptionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching subscription details:', error);
    throw error;
  }
};

/**
 * Gets available pricing plans
 * @returns {Promise<Array>} Array of pricing plans
 */
export const getPricingPlans = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/pricing-plans`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
    throw error;
  }
};

