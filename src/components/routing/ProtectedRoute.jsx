import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logger from '../../utils/logger';

/**
 * Reusable component for authentication-protected routes
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute = ({ children, redirectTo = '/login' }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  if (!isLoggedIn) {
    logger.user('Unauthorized access attempt, redirecting to login');
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;

