import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * ErrorBoundary Component
 * Catches JavaScript errors anywhere in the child component tree and displays a fallback UI
 * Particularly important for financial applications where data integrity is crucial
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      errorId: Date.now().toString(36) + Math.random().toString(36).substr(2)
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    this.setState({
      error,
      errorInfo
    });

    // Log to error reporting service
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error, errorInfo) => {
    // In a real application, you would send this to your error reporting service
    // like Sentry, LogRocket, or Bugsnag
    console.error('ErrorBoundary caught an error:', {
      error: error.toString(),
      errorInfo,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    // Example: Send to error reporting service
    // errorReportingService.captureException(error, {
    //   extra: errorInfo,
    //   tags: {
    //     component: 'ErrorBoundary',
    //     errorId: this.state.errorId
    //   }
    // });
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });

    // Call onRetry prop if provided
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  handleReportError = () => {
    const { error, errorInfo, errorId } = this.state;
    const errorReport = {
      errorId,
      error: error?.toString(),
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    // Copy error report to clipboard
    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2))
      .then(() => {
        alert('Error report copied to clipboard. Please share this with support.');
      })
      .catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = JSON.stringify(errorReport, null, 2);
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Error report copied to clipboard. Please share this with support.');
      });
  };

  render() {
    const { hasError, error, errorId } = this.state;
    const { 
      fallback: FallbackComponent, 
      showDetails = false,
      showRetry = true,
      showReport = true,
      level = 'error',
      children 
    } = this.props;

    if (hasError) {
      // Custom fallback component
      if (FallbackComponent) {
        return (
          <FallbackComponent
            error={error}
            errorId={errorId}
            onRetry={this.handleRetry}
            onReport={this.handleReportError}
          />
        );
      }

      // Default error UI
      const levelStyles = {
        error: 'bg-red-50 border-red-200 text-red-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800'
      };

      const iconMap = {
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
      };

      return (
        <div 
          className={`border-l-4 p-6 m-4 rounded-lg ${levelStyles[level]}`}
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-2xl" aria-hidden="true">
                {iconMap[level]}
              </span>
            </div>
            
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold mb-2">
                Something went wrong
              </h3>
              
              <p className="text-sm mb-4">
                We encountered an unexpected error while processing your request. 
                This has been automatically reported to our team.
              </p>

              {errorId && (
                <p className="text-xs mb-4 font-mono bg-white bg-opacity-50 p-2 rounded">
                  Error ID: {errorId}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {showRetry && (
                  <button
                    onClick={this.handleRetry}
                    className="px-4 py-2 bg-white border border-current rounded-md hover:bg-opacity-80 transition-colors text-sm font-medium"
                  >
                    Try Again
                  </button>
                )}
                
                {showReport && (
                  <button
                    onClick={this.handleReportError}
                    className="px-4 py-2 bg-transparent border border-current rounded-md hover:bg-white hover:bg-opacity-20 transition-colors text-sm"
                  >
                    Copy Error Report
                  </button>
                )}
                
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-transparent border border-current rounded-md hover:bg-white hover:bg-opacity-20 transition-colors text-sm"
                >
                  Reload Page
                </button>
              </div>

              {showDetails && error && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium hover:underline">
                    Technical Details
                  </summary>
                  <div className="mt-2 p-3 bg-white bg-opacity-50 rounded text-xs font-mono overflow-auto max-h-40">
                    <div className="mb-2">
                      <strong>Error:</strong> {error.toString()}
                    </div>
                    {error.stack && (
                      <div>
                        <strong>Stack Trace:</strong>
                        <pre className="whitespace-pre-wrap mt-1">
                          {error.stack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  /** Child components to render */
  children: PropTypes.node.isRequired,
  
  /** Custom fallback component to render on error */
  fallback: PropTypes.elementType,
  
  /** Whether to show technical error details */
  showDetails: PropTypes.bool,
  
  /** Whether to show retry button */
  showRetry: PropTypes.bool,
  
  /** Whether to show report error button */
  showReport: PropTypes.bool,
  
  /** Error level for styling */
  level: PropTypes.oneOf(['error', 'warning', 'info']),
  
  /** Callback function called when retry is clicked */
  onRetry: PropTypes.func
};

ErrorBoundary.defaultProps = {
  fallback: null,
  showDetails: false,
  showRetry: true,
  showReport: true,
  level: 'error',
  onRetry: null
};

export default ErrorBoundary;

/**
 * Higher-order component to wrap components with error boundary
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
 * Hook to manually trigger error boundary (for functional components)
 */
export const useErrorHandler = () => {
  return (error, errorInfo = {}) => {
    // This will be caught by the nearest error boundary
    throw new Error(`Manual error trigger: ${error}`);
  };
};

