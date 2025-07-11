import { lazy, Suspense } from 'react';
import FallbackSpinner from '../components/common/FallbackSpinner';
import ErrorBoundary from '../components/common/ErrorBoundary';

/**
 * Enhanced lazy loading utility with consistent error handling and loading states
 * Provides a standardized way to lazy load components across the application
 */

/**
 * Creates a lazy-loaded component with error boundary and loading fallback
 * @param {Function} importFunc - Dynamic import function
 * @param {Object} options - Configuration options
 * @returns {React.Component} - Wrapped lazy component
 */
export const createLazyComponent = (importFunc, options = {}) => {
  const {
    fallback = <FallbackSpinner />,
    errorFallback = null,
    errorTitle = 'Failed to load component',
    errorMessage = 'There was an error loading this part of the application. Please try refreshing the page.',
    onError = null,
    retryable = true
  } = options;

  const LazyComponent = lazy(importFunc);

  return function WrappedLazyComponent(props) {
    return (
      <ErrorBoundary
        fallback={errorFallback}
        title={errorTitle}
        message={errorMessage}
        onError={onError}
      >
        <Suspense fallback={fallback}>
          <LazyComponent {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  };
};

/**
 * Preloads a lazy component to improve perceived performance
 * @param {Function} importFunc - Dynamic import function
 * @returns {Promise} - Promise that resolves when component is loaded
 */
export const preloadComponent = (importFunc) => {
  return importFunc();
};

/**
 * Creates a lazy component with route-specific error handling
 * Useful for page-level components that need custom error messages
 */
export const createLazyRoute = (importFunc, routeName) => {
  return createLazyComponent(importFunc, {
    errorTitle: `Failed to load ${routeName}`,
    errorMessage: `There was an error loading the ${routeName} page. Please try refreshing or navigate to a different page.`,
    onError: (error, errorInfo) => {
      console.error(`Route loading error for ${routeName}:`, error, errorInfo);
      // TODO: Send to analytics/error reporting
    }
  });
};

/**
 * Creates a lazy component for dashboard widgets with specific styling
 */
export const createLazyWidget = (importFunc, widgetName) => {
  return createLazyComponent(importFunc, {
    fallback: (
      <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg">
        <div className="text-center">
          <FallbackSpinner />
          <p className="mt-2 text-sm text-gray-600">Loading {widgetName}...</p>
        </div>
      </div>
    ),
    errorTitle: `Failed to load ${widgetName}`,
    errorMessage: `The ${widgetName} widget could not be loaded. This might be a temporary issue.`,
  });
};

/**
 * Batch preloader for multiple components
 * Useful for preloading components that are likely to be needed soon
 */
export const preloadComponents = (importFunctions) => {
  return Promise.allSettled(
    importFunctions.map(importFunc => preloadComponent(importFunc))
  );
};

/**
 * Hook for managing component preloading based on user interactions
 */
export const useComponentPreloader = () => {
  const preloadOnHover = (importFunc) => {
    let preloadPromise = null;
    
    return {
      onMouseEnter: () => {
        if (!preloadPromise) {
          preloadPromise = preloadComponent(importFunc);
        }
      },
      onFocus: () => {
        if (!preloadPromise) {
          preloadPromise = preloadComponent(importFunc);
        }
      }
    };
  };

  const preloadOnVisible = (importFunc, options = {}) => {
    const { threshold = 0.1, rootMargin = '50px' } = options;
    
    return (element) => {
      if (!element || !('IntersectionObserver' in window)) return;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              preloadComponent(importFunc);
              observer.disconnect();
            }
          });
        },
        { threshold, rootMargin }
      );
      
      observer.observe(element);
      
      return () => observer.disconnect();
    };
  };

  return {
    preloadOnHover,
    preloadOnVisible,
    preloadComponent
  };
};

// Common lazy loading patterns for the application
export const lazyPatterns = {
  // For authentication pages
  authPage: (importFunc, pageName) => createLazyRoute(importFunc, pageName),
  
  // For dashboard pages
  dashboardPage: (importFunc, pageName) => createLazyRoute(importFunc, `Dashboard - ${pageName}`),
  
  // For modal components
  modal: (importFunc, modalName) => createLazyComponent(importFunc, {
    fallback: (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <FallbackSpinner />
        </div>
      </div>
    ),
    errorTitle: `Failed to load ${modalName}`,
    errorMessage: 'The modal could not be loaded. Please try again.',
  }),
  
  // For chart components
  chart: (importFunc, chartName) => createLazyWidget(importFunc, `${chartName} Chart`),
};

export default {
  createLazyComponent,
  createLazyRoute,
  createLazyWidget,
  preloadComponent,
  preloadComponents,
  useComponentPreloader,
  lazyPatterns
};

