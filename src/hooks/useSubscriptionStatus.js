import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import client from '../client/Client';
import logger from '../utils/logger';

/**
 * Custom hook to manage subscription status checking
 * Extracts complex subscription logic from components
 */
export const useSubscriptionStatus = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [hasSubscription, setHasSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!isLoggedIn) {
        logger.subscription('User not logged in, skipping subscription check');
        setIsLoading(false);
        return;
      }

      try {
        logger.subscription('Checking subscription status');
        setIsLoading(true);

        // Primary subscription check using detailed endpoint
        const response = await client.getSubscriptionDetails();
        logger.api('GET', 'subscription-details', null, {
          status: response.status,
          hasData: !!response.data
        });

        if (response.status === 200) {
          const hasActiveSubscription = !!response.data;
          logger.subscription('Subscription check completed', {
            hasSubscription: hasActiveSubscription
          });
          setHasSubscription(hasActiveSubscription);
          setError(null);
        } else {
          logger.warn('Subscription details check failed, attempting fallback', {
            status: response.status,
            message: response.message
          });

          // Fallback to simple subscription check
          const fallbackCheck = await client.checkSubscription();
          logger.subscription('Fallback subscription check completed', fallbackCheck);

          setHasSubscription(fallbackCheck.has_subscription);
          setError(null);
        }
      } catch (error) {
        logger.error('Exception during subscription check', { error: error.message });

        // Attempt fallback check on error
        try {
          logger.subscription('Attempting fallback subscription check after error');
          const fallbackCheck = await client.checkSubscription();
          logger.subscription('Fallback check successful', fallbackCheck);

          setHasSubscription(fallbackCheck.has_subscription);
          setError(null);
        } catch (fallbackError) {
          logger.error('Fallback subscription check failed', {
            error: fallbackError.message
          });
          setError('Unable to verify subscription status');

          // Safe default: Allow access if we can't check subscription
          // This prevents users from being locked out due to API issues
          logger.warn('Using safe default: Allowing access despite subscription check errors');
          setHasSubscription(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscription();
  }, [isLoggedIn]);

  return {
    hasSubscription,
    isLoading,
    error,
    isLoggedIn
  };
};

