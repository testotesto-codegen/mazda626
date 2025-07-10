import { Route } from 'react-router-dom';
import { lazy } from 'react';
import { LazyRoute } from '../components/routing';
import ResetPassword from '../pages/ResetPassword';
import ForgotPassword from '../pages/ForgotPassword';
import ConfirmEmail from '../pages/ConfirmEmail';
import VerifyEmail from '../pages/VerifyEmail';

// Lazy load auth components
const Login = lazy(() => import('../pages/Login'));
const Logout = lazy(() => import('../pages/Logout'));
const Register = lazy(() => import('../pages/Register'));

/**
 * Authentication-related routes
 * Handles login, registration, password reset, etc.
 */
export const authRoutes = [
  <Route
    key="login"
    path="/login"
    element={
      <LazyRoute>
        <Login />
      </LazyRoute>
    }
  />,
  <Route
    key="logout"
    path="/logout"
    element={
      <LazyRoute>
        <Logout />
      </LazyRoute>
    }
  />,
  <Route
    key="register"
    path="/register"
    element={
      <LazyRoute>
        <Register />
      </LazyRoute>
    }
  />,
  <Route
    key="forgot-password"
    path="/forgot-password"
    element={
      <LazyRoute>
        <ForgotPassword />
      </LazyRoute>
    }
  />,
  <Route
    key="reset-password"
    path="/reset-password"
    element={
      <LazyRoute>
        <ResetPassword />
      </LazyRoute>
    }
  />,
  <Route
    key="confirm-email"
    path="/confirm-email"
    element={
      <LazyRoute>
        <ConfirmEmail />
      </LazyRoute>
    }
  />,
  <Route
    key="verify-email"
    path="/verify-email"
    element={
      <LazyRoute>
        <VerifyEmail />
      </LazyRoute>
    }
  />
];

