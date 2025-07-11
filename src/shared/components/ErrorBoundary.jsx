import React from 'react';
import { logErrorBoundary, createLogger } from '../../core/logging';

const logger = createLogger('ErrorBoundary');

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    logErrorBoundary(error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
      eventId: Date.now().toString()
    });

    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null
    });
    
    logger.info('User retried after error boundary');
  };

  handleReportError = () => {
    const { error, errorInfo, eventId } = this.state;
    
    // Here you could integrate with error reporting service
    logger.info('User reported error', {
      eventId,
      error: error?.message,
      stack: error?.stack
    });
    
    // Show success message or redirect to support
    alert('Error reported successfully. Our team will investigate.');
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback(
          this.state.error,
          this.state.errorInfo,
          this.handleRetry
        );
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            
            <div className="text-center">
              <h1 className="text-xl font-semibold text-gray-900 mb-2">
                Something went wrong
              </h1>
              
              <p className="text-gray-600 mb-6">
                We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
              </p>
              
              {this.props.showDetails && this.state.error && (
                <details className="mb-4 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    Technical Details
                  </summary>
                  <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-700 overflow-auto max-h-32">
                    <div className="mb-2">
                      <strong>Error:</strong> {this.state.error.message}
                    </div>
                    {this.state.error.stack && (
                      <div>
                        <strong>Stack:</strong>
                        <pre className="whitespace-pre-wrap mt-1">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={this.handleRetry}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Try Again
                </button>
                
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Refresh Page
                </button>
              </div>
              
              {this.props.showReportButton && (
                <button
                  onClick={this.handleReportError}
                  className="mt-3 text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Report this error
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component to wrap components with error boundary
 * @param {React.Component} Component - Component to wrap
 * @param {Object} errorBoundaryProps - Error boundary props
 * @returns {React.Component} Wrapped component
 */
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

/**
 * Hook to handle errors in functional components
 * @returns {Function} Error handler function
 */
export const useErrorHandler = () => {
  const handleError = React.useCallback((error, errorInfo = {}) => {
    logger.error('Unhandled error in component', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      errorInfo
    });
    
    // Re-throw error to be caught by Error Boundary
    throw error;
  }, []);
  
  return handleError;
};

/**
 * Feature-specific error boundary
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.feature - Feature name for logging
 * @param {Function} props.fallback - Custom fallback component
 */
export const FeatureErrorBoundary = ({ children, feature, fallback }) => {
  const customFallback = React.useCallback((error, errorInfo, retry) => {
    if (fallback) {
      return fallback(error, errorInfo, retry);
    }
    
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              {feature} Feature Unavailable
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>This feature is temporarily unavailable. Please try again later.</p>
            </div>
            <div className="mt-4">
              <button
                onClick={retry}
                className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }, [fallback, feature]);
  
  return (
    <ErrorBoundary
      fallback={customFallback}
      onError={(error, errorInfo) => {
        logger.error(`Error in ${feature} feature`, {
          feature,
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack
        });
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundary;

