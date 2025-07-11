import { createBrowserRouter, createRoutesFromElements, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import RootLayout from '../layouts/RootLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import { publicRoutes } from './publicRoutes';
import { authRoutes } from './authRoutes';
import { dashboardRoutes } from './dashboardRoutes';
import { ROUTES } from './routeConfig';

// Private route wrapper component
// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  return isLoggedIn ? children : <Navigate to={ROUTES.LOGIN} replace />;
};

/**
 * Main router configuration
 * Combines all route modules into a single router
 */
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      {/* Public routes */}
      {publicRoutes}
      
      {/* Auth routes */}
      {authRoutes}
      
      {/* Protected dashboard routes */}
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        {/* Default dashboard redirect */}
        <Route index element={<Navigate to={ROUTES.DASHBOARD_HOME} replace />} />
        
        {/* Dashboard child routes */}
        {dashboardRoutes}
      </Route>
    </Route>
  )
);

export default router;
