import { Route } from 'react-router-dom';
import { lazy } from 'react';
import { LazyRoute, ProtectedRoute } from '../components/routing';
import RootLayout from '../layouts/RootLayout';
import Home from '../pages/Home';
import TestTwo from '../pages/Testtwo';
import Roadmap from '../pages/Roadmap';
import ContactUs from '../pages/ContactUs';

// Lazy load public components
const PricingPlan = lazy(() => import('../pages/PricingPlan'));
const Checkout = lazy(() => import('../screens/Checkout'));
const SubscriptionPage = lazy(() => import('../screens/SubscriptionPage'));

/**
 * Public routes that don't require authentication
 * Includes marketing pages, pricing, contact, etc.
 */
export const publicRoutes = [
  // Root layout routes (marketing pages)
  <Route key="root" path="/" element={<RootLayout />}>
    <Route index element={<Home />} />
    <Route path="test" element={<TestTwo />} />
    <Route path="roadmap" element={<Roadmap />} />
  </Route>,

  // Standalone public routes
  <Route
    key="test-standalone"
    path="/test"
    element={<TestTwo />}
  />,
  <Route
    key="plans"
    path="/plans"
    element={
      <LazyRoute>
        <PricingPlan />
      </LazyRoute>
    }
  />,
  <Route
    key="checkout"
    path="/checkout"
    element={
      <LazyRoute>
        <Checkout />
      </LazyRoute>
    }
  />,
  <Route
    key="contact-us"
    path="/contact-us"
    element={
      <LazyRoute>
        <ContactUs />
      </LazyRoute>
    }
  />,
  <Route
    key="contact-us-enterprise"
    path="/contact-us/enterprise"
    element={
      <LazyRoute>
        <ContactUs />
      </LazyRoute>
    }
  />,

  // Protected subscription route (requires login but not subscription)
  <Route
    key="subscription"
    path="/subscription"
    element={
      <LazyRoute>
        <ProtectedRoute>
          <SubscriptionPage />
        </ProtectedRoute>
      </LazyRoute>
    }
  />
];

