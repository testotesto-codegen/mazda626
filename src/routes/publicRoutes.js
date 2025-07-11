import { Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import FallbackSpinner from '../components/common/FallbackSpinner';
import { ROUTES } from './routeConfig';

// Lazy load public components
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const PricingPlan = lazy(() => import('../pages/PricingPlan'));
const Roadmap = lazy(() => import('../pages/Roadmap'));
const ContactUs = lazy(() => import('../pages/ContactUs'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));
const ConfirmEmail = lazy(() => import('../pages/ConfirmEmail'));
const VerifyEmail = lazy(() => import('../pages/VerifyEmail'));
const TestTwo = lazy(() => import('../pages/Testtwo'));
const Checkout = lazy(() => import('../screens/Checkout'));

/**
 * Public routes that don't require authentication
 */
export const publicRoutes = [
  <Route
    key="home"
    path={ROUTES.HOME}
    element={
      <Suspense fallback={<FallbackSpinner />}>
        <Home />
      </Suspense>
    }
  />,
  <Route
    key="login"
    path={ROUTES.LOGIN}
    element={
      <Suspense fallback={<FallbackSpinner />}>
        <Login />
      </Suspense>
    }
  />,
  <Route
    key="register"
    path={ROUTES.REGISTER}
    element={
      <Suspense fallback={<FallbackSpinner />}>
        <Register />
      </Suspense>
    }
  />,
  <Route
    key="pricing"
    path={ROUTES.PRICING}
    element={
      <Suspense fallback={<FallbackSpinner />}>
        <PricingPlan />
      </Suspense>
    }
  />,
  <Route
    key="roadmap"
    path={ROUTES.ROADMAP}
    element={
      <Suspense fallback={<FallbackSpinner />}>
        <Roadmap />
      </Suspense>
    }
  />,
  <Route
    key="contact"
    path={ROUTES.CONTACT}
    element={
      <Suspense fallback={<FallbackSpinner />}>
        <ContactUs />
      </Suspense>
    }
  />,
  <Route
    key="forgot-password"
    path={ROUTES.FORGOT_PASSWORD}
    element={
      <Suspense fallback={<FallbackSpinner />}>
        <ForgotPassword />
      </Suspense>
    }
  />,
  <Route
    key="reset-password"
    path={ROUTES.RESET_PASSWORD}
    element={
      <Suspense fallback={<FallbackSpinner />}>
        <ResetPassword />
      </Suspense>
    }
  />,
  <Route
    key="confirm-email"
    path={ROUTES.CONFIRM_EMAIL}
    element={
      <Suspense fallback={<FallbackSpinner />}>
        <ConfirmEmail />
      </Suspense>
    }
  />,
  <Route
    key="verify-email"
    path={ROUTES.VERIFY_EMAIL}
    element={
      <Suspense fallback={<FallbackSpinner />}>
        <VerifyEmail />
      </Suspense>
    }
  />,
  <Route
    key="test-two"
    path={ROUTES.TEST_TWO}
    element={
      <Suspense fallback={<FallbackSpinner />}>
        <TestTwo />
      </Suspense>
    }
  />,
  <Route
    key="checkout"
    path={ROUTES.CHECKOUT}
    element={
      <Suspense fallback={<FallbackSpinner />}>
        <Checkout />
      </Suspense>
    }
  />
];
