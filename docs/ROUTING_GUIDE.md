# Routing Guide

This guide explains how to work with the new modular routing system in the Accelno application.

## Quick Start

### Adding a New Route

1. **Identify the route type**:
   - **Auth routes**: Login, registration, password reset
   - **Public routes**: Marketing pages, pricing, contact
   - **Dashboard routes**: Features requiring subscription

2. **Add to the appropriate file**:
   ```jsx
   // In src/routes/dashboardRoutes.jsx
   const NewFeature = lazy(() => import('../screens/NewFeature'));
   
   // Add to the routes array
   <Route
     path="new-feature"
     element={
       <LazyRoute>
         <NewFeature />
       </LazyRoute>
     }
   />
   ```

3. **Use appropriate protection**:
   - Dashboard routes are automatically protected with `SubscriptionRoute`
   - Use `ProtectedRoute` for auth-only features
   - Public routes need no protection

## Route Files Structure

### `src/routes/index.js`
Main router configuration that combines all route modules.

**Don't modify this file unless:**
- Adding a new route category
- Changing global router configuration

### `src/routes/authRoutes.jsx`
Authentication-related routes.

**Routes include:**
- `/login` - User login
- `/register` - User registration
- `/logout` - User logout
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset form
- `/confirm-email` - Email confirmation
- `/verify-email` - Email verification

**Adding auth routes:**
```jsx
<Route
  key="new-auth-route"
  path="/new-auth-feature"
  element={
    <LazyRoute>
      <NewAuthComponent />
    </LazyRoute>
  }
/>
```

### `src/routes/publicRoutes.jsx`
Public routes that don't require authentication.

**Routes include:**
- `/` - Home page (with RootLayout)
- `/plans` - Pricing page
- `/contact-us` - Contact forms
- `/checkout` - Payment checkout
- `/subscription` - Subscription management (requires login)

**Adding public routes:**
```jsx
<Route
  key="new-public-route"
  path="/new-public-page"
  element={
    <LazyRoute>
      <NewPublicComponent />
    </LazyRoute>
  }
/>
```

### `src/routes/dashboardRoutes.jsx`
Protected routes requiring both authentication and subscription.

**Route categories:**
- **Main Dashboard**: `/dashboard`
- **Valuation**: `/valuation/*`
- **Analysis**: `/news`, `/files`, `/equity-report`, `/charts`
- **User Management**: `/account`, `/portfolio`, `/watchlist`
- **Settings**: `/settings/*`

**Adding dashboard routes:**
```jsx
<Route
  path="new-dashboard-feature"
  element={
    <LazyRoute>
      <NewDashboardComponent />
    </LazyRoute>
  }
/>
```

## Route Protection Components

### LazyRoute
Wraps components with Suspense for code splitting.

```jsx
import { LazyRoute } from '../components/routing';

<LazyRoute fallback={<CustomSpinner />}>
  <YourComponent />
</LazyRoute>
```

**Props:**
- `children` - Component to render
- `fallback` - Loading component (optional, defaults to FallbackSpinner)

### ProtectedRoute
Requires user authentication.

```jsx
import { ProtectedRoute } from '../components/routing';

<ProtectedRoute redirectTo="/custom-login">
  <AuthenticatedComponent />
</ProtectedRoute>
```

**Props:**
- `children` - Component to render
- `redirectTo` - Redirect path (optional, defaults to '/login')

### SubscriptionRoute
Requires both authentication and active subscription.

```jsx
import { SubscriptionRoute } from '../components/routing';

<SubscriptionRoute 
  loginRedirect="/login"
  subscriptionRedirect="/upgrade"
>
  <PremiumComponent />
</SubscriptionRoute>
```

**Props:**
- `children` - Component to render
- `loginRedirect` - Path for unauthenticated users (optional, defaults to '/login')
- `subscriptionRedirect` - Path for users without subscription (optional, defaults to '/subscription')

## Common Patterns

### Basic Route with Lazy Loading
```jsx
const MyComponent = lazy(() => import('../screens/MyComponent'));

<Route
  path="my-route"
  element={
    <LazyRoute>
      <MyComponent />
    </LazyRoute>
  }
/>
```

### Protected Route with Parameters
```jsx
<Route
  path="user/:userId"
  element={
    <LazyRoute>
      <ProtectedRoute>
        <UserProfile />
      </ProtectedRoute>
    </LazyRoute>
  }
/>
```

### Nested Routes
```jsx
<Route path="settings" element={<SettingsLayout />}>
  <Route index element={<GeneralSettings />} />
  <Route path="billing" element={<BillingSettings />} />
  <Route path="profile" element={<ProfileSettings />} />
</Route>
```

### Route with Custom Loading
```jsx
<Route
  path="heavy-component"
  element={
    <LazyRoute fallback={<div>Loading heavy component...</div>}>
      <HeavyComponent />
    </LazyRoute>
  }
/>
```

## Best Practices

### 1. Consistent Lazy Loading
Always use lazy loading for route components:

```jsx
// ✅ Good
const Dashboard = lazy(() => import('../screens/Dashboard'));

// ❌ Avoid
import Dashboard from '../screens/Dashboard';
```

### 2. Meaningful Route Keys
Use descriptive keys for routes:

```jsx
// ✅ Good
<Route key="user-dashboard" ... />

// ❌ Avoid
<Route key="route1" ... />
```

### 3. Appropriate Protection
Choose the right protection level:

```jsx
// ✅ Public route - no protection needed
<Route path="/about" element={<About />} />

// ✅ Auth required - use ProtectedRoute
<Route path="/profile" element={
  <ProtectedRoute>
    <Profile />
  </ProtectedRoute>
} />

// ✅ Subscription required - use SubscriptionRoute (or place in dashboardRoutes.jsx)
<Route path="/premium-feature" element={
  <SubscriptionRoute>
    <PremiumFeature />
  </SubscriptionRoute>
} />
```

### 4. Organize by Feature
Group related routes together:

```jsx
// ✅ Good - group related routes
// Valuation routes
<Route path="valuation" element={<ValuationHome />} />
<Route path="valuation/dcf" element={<DCF />} />
<Route path="valuation/comps" element={<Comps />} />

// Settings routes
<Route path="settings" element={<Settings />} />
<Route path="settings/billing" element={<Billing />} />
<Route path="settings/profile" element={<Profile />} />
```

### 5. Handle Route Parameters
Use TypeScript or PropTypes for route parameters:

```jsx
// Component receiving route parameters
const UserProfile = () => {
  const { userId } = useParams();
  // Component logic
};
```

## Troubleshooting

### Route Not Found
1. Check if route is added to correct file
2. Verify route path spelling
3. Ensure component is properly imported
4. Check for conflicting routes

### Protection Not Working
1. Verify correct protection component is used
2. Check Redux auth state
3. Review subscription status logic
4. Check redirect paths

### Lazy Loading Issues
1. Ensure component has default export
2. Check import path
3. Verify component doesn't have circular dependencies
4. Check for syntax errors in lazy-loaded component

### Performance Issues
1. Avoid importing large libraries in route components
2. Use code splitting for heavy components
3. Consider route-based chunking
4. Monitor bundle sizes

## Migration from Old System

### Old Pattern
```jsx
// Old routes.jsx
<Route
  path="/dashboard"
  element={
    <Suspense fallback={<FallbackSpinner />}>
      <SubscriptionProtectedRoute>
        <Dashboard />
      </SubscriptionProtectedRoute>
    </Suspense>
  }
/>
```

### New Pattern
```jsx
// In dashboardRoutes.jsx
<Route
  path="dashboard"
  element={
    <LazyRoute>
      <Dashboard />
    </LazyRoute>
  }
/>
// SubscriptionRoute wrapper is applied to the entire dashboard layout
```

## Testing Routes

### Unit Testing
```jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import router from '../routes';

test('renders dashboard route', () => {
  render(
    <Provider store={mockStore}>
      <MemoryRouter initialEntries={['/dashboard']}>
        <RouterProvider router={router} />
      </MemoryRouter>
    </Provider>
  );
  
  expect(screen.getByText('Dashboard')).toBeInTheDocument();
});
```

### Integration Testing
Test route protection and navigation flows:

```jsx
test('redirects to login when not authenticated', () => {
  // Test implementation
});

test('redirects to subscription when no active subscription', () => {
  // Test implementation
});
```

This routing system provides a scalable foundation for the application while maintaining clear separation of concerns and consistent patterns.

