import { Route } from 'react-router-dom';
import { lazy } from 'react';
import { LazyRoute, SubscriptionRoute } from '../components/routing';
import DashboardLayout from '../layouts/DashboardLayout';
import ValuationHome from '../components/dashboard/Valuation/ValuationHome';
import Charts from '../screens/Charts';
import Comps from '../components/dashboard/Valuation/Comps/Comps';
import Dcf from '../components/dashboard/Valuation/DCF/DCF';
import CustomValuation from '../components/dashboard/Valuation/CustomValuation';
import Equity from '../components/dashboard/Equity/Equity';
import TenKFiling from '../screens/TenKFiling';
import News from '../screens/News';
import LBOUserInputs from '../components/dashboard/Valuation/LBO/LBOUserInputs';

// Lazy load dashboard components
const DashboardHome = lazy(() => import('../screens/DashboardHome'));
const Watchlist = lazy(() => import('../screens/Watchlist'));
const TodaysMovers = lazy(() => import('../screens/TodaysMovers'));
const MarketDashboard = lazy(() => import('../screens/MarketDashboard'));
const Settings = lazy(() => import('../screens/Settings'));
const Portfolio = lazy(() => import('../screens/Portfolio'));
const Account = lazy(() => import('../screens/Account'));

/**
 * Dashboard routes that require both authentication and subscription
 * All routes are wrapped with SubscriptionRoute for protection
 */
export const dashboardRoutes = [
  <Route
    key="dashboard-layout"
    path="/"
    element={
      <SubscriptionRoute>
        <DashboardLayout />
      </SubscriptionRoute>
    }
  >
    {/* Main Dashboard */}
    <Route
      path="dashboard"
      element={
        <LazyRoute>
          <DashboardHome />
        </LazyRoute>
      }
    />

    {/* Valuation Routes */}
    <Route path="valuation" element={<ValuationHome />} />
    <Route path="valuation/private" element={<CustomValuation />} />
    <Route path="valuation/private/inputs" element={<LBOUserInputs />} />
    <Route path="valuation/comparable" element={<Comps />} />
    <Route path="valuation/dcf" element={<Dcf />} />

    {/* Analysis Routes */}
    <Route path="news" element={<News />} />
    <Route path="files" element={<TenKFiling />} />
    <Route path="equity-report" element={<Equity />} />
    <Route path="charts" element={<Charts />} />

    {/* Legacy Dashboard Routes */}
    <Route path="dashboard/chart" element={<Charts />} />
    <Route path="equity" element={<Equity />} />
    <Route path="equity/:type" element={<Equity />} />

    {/* User Management Routes */}
    <Route
      path="account"
      element={
        <LazyRoute>
          <Account />
        </LazyRoute>
      }
    />
    <Route
      path="portfolio"
      element={
        <LazyRoute>
          <Portfolio />
        </LazyRoute>
      }
    />
    <Route
      path="watchlist"
      element={
        <LazyRoute>
          <Watchlist />
        </LazyRoute>
      }
    />
    <Route
      path="todays-movers"
      element={
        <LazyRoute>
          <TodaysMovers />
        </LazyRoute>
      }
    />
    <Route
      path="market"
      element={
        <LazyRoute>
          <MarketDashboard />
        </LazyRoute>
      }
    />

    {/* Settings Routes */}
    <Route
      path="settings"
      element={
        <LazyRoute>
          <Settings />
        </LazyRoute>
      }
    />
    <Route
      path="settings/:element"
      element={
        <LazyRoute>
          <Settings />
        </LazyRoute>
      }
    />
  </Route>
];

