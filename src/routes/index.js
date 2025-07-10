import { createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { authRoutes } from './authRoutes';
import { publicRoutes } from './publicRoutes';
import { dashboardRoutes } from './dashboardRoutes';
import logger from '../utils/logger';

/**
 * Main router configuration
 * Combines all route modules into a single router
 */
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Authentication Routes */}
      {authRoutes}
      
      {/* Public Routes */}
      {publicRoutes}
      
      {/* Dashboard Routes (Protected) */}
      {dashboardRoutes}
    </>
  )
);

// Log router creation in development
logger.debug('Router initialized with modular route configuration');

export default router;

