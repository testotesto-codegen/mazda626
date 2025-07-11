import { Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import FallbackSpinner from '../components/common/FallbackSpinner';
import { ROUTES } from './routeConfig';

// Lazy load dashboard components
const DashboardHome = lazy(() => import('../screens/DashboardHome'));
const Watchlist = lazy(() => import('../screens/Watchlist'));
const TodaysMovers = lazy(() => import('../screens/TodaysMovers'));
const MarketDashboard = lazy(() => import('../screens/MarketDashboard'));
const Portfolio = lazy(() => import('../screens/Portfolio'));
const Settings = lazy(() => import('../screens/Settings'));
const Account = lazy(() => import('../screens/Account'));
const SubscriptionPage = lazy(() => import('../screens/SubscriptionPage'));
const Charts = lazy(() => import('../screens/Charts'));
const News = lazy(() => import('../screens/News'));
const TenKFiling = lazy(() => import('../screens/TenKFiling'));

// Lazy load valuation components
const ValuationHome = lazy(() => import('../components/dashboard/Valuation/ValuationHome'));
const Comps = lazy(() => import('../components/dashboard/Valuation/Comps/Comps'));
const Dcf = lazy(() => import('../components/dashboard/Valuation/DCF/DCF'));
const LBOUserInputs = lazy(() => import('../components/dashboard/Valuation/LBO/LBOUserInputs'));
const CustomValuation = lazy(() => import('../components/dashboard/Valuation/CustomValuation'));
const SpreadsheetVisualisation = lazy(() => import('../components/dashboard/Valuation/SpreadsheetVisualisation'));

// Lazy load other feature components
const Equity = lazy(() => import('../components/dashboard/Equity/Equity'));

/**
 * Dashboard routes that require authentication
 */
export const dashboardRoutes = [
  // Main dashboard
  <Route
    key="dashboard-home"
    path={ROUTES.DASHBOARD_HOME}
    element={
      <Suspense fallback={<FallbackSpinner />}>
        <DashboardHome />
      </Suspense>
    }
  />,
  
  // Core dashboard features
  <Route
    key="watchlist"
    path={ROUTES.WATCHLIST}
    element={
      <Suspense fallback={<FallbackSpinner />}>
        <Watchlist />
      </Suspense>
    }
  />,
  <Route
    key="todays-movers"
    path={ROUTES.TODAYS_MOVERS}
    element={
      <Suspense fallback={<FallbackSpinner />}>
        <TodaysMovers />
      </Suspense>
    }
  />,
  <Route
    key="market-dashboard"
    path={ROUTES.MARKET_DASHBOARD}
    element={
      <Suspense fallback={<FallbackSpinner />}>
        <MarketDashboard />
      </Suspense>
    }
  />,
  <Route
    key="portfolio"
    path={ROUTES.PORTFOLIO}
    element={
      <Suspense fallback={<FallbackSpinner />}>
        <Portfolio />
      </Suspense>
    }
  />,
  
  // User management
  <Route
    key="settings"
    path={ROUTES.SETTINGS}
    element={
      <Suspense fallback={<FallbackSpinner />}>
        <Settings />
      </Suspense>
    }
  />,
  <Route
    key="account"
    path={ROUTES.ACCOUNT}
    element={
      <Suspense fallback={<FallbackSpinner />}>
        <Account />
      </Suspense>
    }
  />,
  <Route
    key="subscription"
    path={ROUTES.SUBSCRIPTION}
    element={
      <Suspense fallback={<FallbackSpinner />}>
        <SubscriptionPage />
      </Suspense>
    }
  />,
  
  // Valuation features
  <Route
    key="valuation"
    path={ROUTES.VALUATION}
    element={
      <Suspense fallback={<FallbackSpinner />}>
        <ValuationHome />
      </Suspense>
    }
  />,
  <Route
    key="valuation-comps"
    path={ROUTES.VALUATION_COMPS}
    element={
      <Suspense fallback={<FallbackSpinner />}>
        <Comps />
      </Suspense>
    }
  />,
  <Route
    key="valuation-dcf"
    path={ROUTES.VALUATION_DCF}
    element={
      <Suspense fallback={<FallbackSpinner />}>
        <Dcf />
      </Suspense>
    }
  />,
  <Route
    key="valuation-lbo"
    path={ROUTES.VALUATION_LBO}
    element={
      <Suspense fallback={<FallbackSpinner />}>
        <LBOUserInputs />
      </Suspense>
    }
  />,
  <Route
    key="valuation-custom"
    path={ROUTES.VALUATION_CUSTOM}
    element={
      <Suspense fallback={<FallbackSpinner />}>
        <CustomValuation />
      </Suspense>
    }
  />,
  <Route
    key="valuation-spreadsheet"
    path={ROUTES.VALUATION_SPREADSHEET}
    element={
      <Suspense fallback={<FallbackSpinner />}>
        <SpreadsheetVisualisation />
      </Suspense>
    }
  />,
  
  // Other features
  <Route
    key="equity"
    path={ROUTES.EQUITY}
    element={
      <Suspense fallback={<FallbackSpinner />}>
        <Equity />
      </Suspense>
    }
  />,
  <Route
    key="charts"
    path={ROUTES.CHARTS}
    element={
      <Suspense fallback={<FallbackSpinner />}>
        <Charts />
      </Suspense>
    }
  />,
  <Route
    key="news"
    path={ROUTES.NEWS}
    element={
      <Suspense fallback={<FallbackSpinner />}>
        <News />
      </Suspense>
    }
  />,
  <Route
    key="filing-10k"
    path={ROUTES.FILING_10K}
    element={
      <Suspense fallback={<FallbackSpinner />}>
        <TenKFiling />
      </Suspense>
    }
  />
];
