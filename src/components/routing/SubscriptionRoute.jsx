import { Navigate } from 'react-router-dom';
import { useSubscriptionStatus } from '../../hooks/useSubscriptionStatus';
import FallbackSpinner from '../common/FallbackSpinner';
import logger from '../../utils/logger';

/**
 * Reusable component for subscription-protected routes
 * Handles subscription checking and appropriate redirects
 */
const SubscriptionRoute = ({ 
  children, 
  loginRedirect = '/login',
  subscriptionRedirect = '/subscription' 
}) => {
  const { hasSubscription, isLoading, error, isLoggedIn } = useSubscriptionStatus();

  // Show loading spinner while checking subscription
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#1D2022]">
        <FallbackSpinner />
        <p className="text-[#667177] mt-4">Verifying subscription...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    logger.user('User not logged in, redirecting to login');
    return <Navigate to={loginRedirect} replace />;
  }

  // Log error but continue (safe default behavior)
  if (error) {
    logger.warn('Subscription check error, but allowing access', { error });
  }

  // Redirect to subscription page if no active subscription
  if (hasSubscription === false) {
    logger.subscription('No active subscription, redirecting to subscription page');
    return <Navigate to={subscriptionRedirect} replace />;
  }

  logger.subscription('Access granted - user has active subscription or safe default applied');
  return children;
};

export default SubscriptionRoute;

