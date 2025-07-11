import { Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import FallbackSpinner from '../components/common/FallbackSpinner';
import { ROUTES } from './routeConfig';

// Lazy load auth-related components
const Logout = lazy(() => import('../pages/Logout'));

/**
 * Authentication-related routes
 */
export const authRoutes = [
  <Route
    key="logout"
    path={ROUTES.LOGOUT}
    element={
      <Suspense fallback={<FallbackSpinner />}>
        <Logout />
      </Suspense>
    }
  />
];
