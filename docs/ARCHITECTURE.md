# Architecture Guide

This document outlines the architectural improvements made to the Accelno application and provides guidelines for future development.

## Overview

The application has been refactored to improve maintainability, code organization, and developer experience. The main improvements include:

1. **Modular Routing Architecture**
2. **Centralized Logging System**
3. **Reusable Route Components**
4. **Improved Error Handling**
5. **Clean Code Practices**

## Routing Architecture

### Before Refactoring
- Single monolithic `routes.jsx` file (348 lines)
- Complex subscription protection logic mixed with routing
- Repetitive route definitions
- Difficult to maintain and navigate

### After Refactoring
The routing system is now organized into modular files:

```
src/routes/
├── index.js              # Main router configuration
├── authRoutes.jsx         # Authentication-related routes
├── publicRoutes.jsx       # Public marketing/info routes
└── dashboardRoutes.jsx    # Protected dashboard routes
```

### Route Categories

#### Authentication Routes (`authRoutes.jsx`)
- Login, logout, registration
- Password reset and email verification
- All routes are public but redirect authenticated users

#### Public Routes (`publicRoutes.jsx`)
- Marketing pages (home, pricing, contact)
- Routes that don't require authentication
- Subscription page (requires login but not subscription)

#### Dashboard Routes (`dashboardRoutes.jsx`)
- All application features requiring subscription
- Automatically protected with `SubscriptionRoute` wrapper
- Organized by feature area (valuation, analysis, settings)

## Logging System

### Logger Utility (`src/utils/logger.js`)

The centralized logging system provides:

- **Environment-aware behavior**: Debug logs only in development
- **Multiple log levels**: debug, info, warn, error
- **Structured logging**: Consistent format with context
- **Specialized methods**: API calls, user actions, performance metrics

### Usage Examples

```javascript
import logger from '../utils/logger';

// Basic logging
logger.debug('Debug information', { context: 'additional data' });
logger.info('User logged in successfully');
logger.warn('API rate limit approaching');
logger.error('Authentication failed', { error: errorMessage });

// Specialized logging
logger.api('POST', '/api/login', requestData, responseData);
logger.user('button_click', { buttonId: 'submit-form' });
logger.performance('page_load', 1250, 'ms');
logger.subscription('status_check', { hasSubscription: true });
```

### Migration from console.log

Replace scattered `console.log` statements with appropriate logger methods:

```javascript
// Before
console.log('User data:', userData);

// After
logger.debug('User data loaded', { userData });
```

## Reusable Route Components

### LazyRoute (`src/components/routing/LazyRoute.jsx`)
Wraps components with Suspense for code splitting:

```jsx
<LazyRoute>
  <SomeComponent />
</LazyRoute>
```

### ProtectedRoute (`src/components/routing/ProtectedRoute.jsx`)
Requires authentication, redirects to login if not authenticated:

```jsx
<ProtectedRoute>
  <AuthenticatedComponent />
</ProtectedRoute>
```

### SubscriptionRoute (`src/components/routing/SubscriptionRoute.jsx`)
Requires both authentication and active subscription:

```jsx
<SubscriptionRoute>
  <PremiumFeatureComponent />
</SubscriptionRoute>
```

## Subscription Management

### useSubscriptionStatus Hook (`src/hooks/useSubscriptionStatus.js`)

Extracted complex subscription checking logic into a reusable hook:

```javascript
const { hasSubscription, isLoading, error, isLoggedIn } = useSubscriptionStatus();
```

**Features:**
- Automatic subscription status checking
- Fallback mechanisms for API failures
- Proper error handling and logging
- Safe defaults to prevent user lockout

## Error Handling

### ErrorBoundary (`src/components/common/ErrorBoundary.jsx`)

Catches React errors and provides user-friendly error UI:

- **Development**: Shows detailed error information
- **Production**: Shows user-friendly error message with retry options
- **Logging**: Automatically logs errors with context

## Development Guidelines

### Adding New Routes

1. **Determine route category** (auth, public, or dashboard)
2. **Add to appropriate route file**
3. **Use appropriate wrapper components**
4. **Follow lazy loading patterns for large components**

Example:
```jsx
// In dashboardRoutes.jsx
<Route
  path="new-feature"
  element={
    <LazyRoute>
      <NewFeatureComponent />
    </LazyRoute>
  }
/>
```

### Logging Best Practices

1. **Use appropriate log levels**:
   - `debug`: Development debugging information
   - `info`: Important application events
   - `warn`: Potential issues that don't break functionality
   - `error`: Actual errors that need attention

2. **Include context**: Always provide relevant context data
3. **Use specialized methods**: `api()`, `user()`, `performance()`, etc.
4. **Avoid sensitive data**: Never log passwords, tokens, or personal information

### Error Handling

1. **Wrap components in ErrorBoundary** for critical sections
2. **Use try-catch blocks** for async operations
3. **Provide user feedback** for errors
4. **Log errors with context** for debugging

## Performance Considerations

### Code Splitting
- All route components use lazy loading
- Reduces initial bundle size
- Improves application startup time

### Bundle Organization
- Routes are organized by feature
- Shared components are properly extracted
- Utilities are centralized and reusable

## Migration Notes

### From Old Routing System
1. **Routes are now modular**: Check appropriate route file for modifications
2. **Protection logic simplified**: Use wrapper components instead of inline logic
3. **Lazy loading standardized**: Use `LazyRoute` component consistently

### From console.log to Logger
1. **Replace all console.log**: Use appropriate logger methods
2. **Add context**: Include relevant data with log messages
3. **Consider log levels**: Use debug for development-only information

## Future Improvements

### Potential Enhancements
1. **Route-based code splitting**: Further optimize bundle sizes
2. **Advanced error reporting**: Integration with services like Sentry
3. **Performance monitoring**: Add more detailed performance logging
4. **A/B testing framework**: Route-level feature flags
5. **Analytics integration**: User journey tracking

### Monitoring and Observability
1. **Error tracking**: Implement comprehensive error monitoring
2. **Performance metrics**: Track route loading times and user interactions
3. **User analytics**: Monitor feature usage and user flows

This architecture provides a solid foundation for scaling the application while maintaining code quality and developer productivity.

