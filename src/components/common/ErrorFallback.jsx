import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

/**
 * Error Fallback Component - Displays error information and recovery options
 */
const ErrorFallback = ({ 
  error, 
  errorInfo, 
  onReset, 
  title, 
  message, 
  showDetails 
}) => {
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const toggleErrorDetails = () => {
    setShowErrorDetails(!showErrorDetails);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mx-auto h-24 w-24 text-red-500 mb-6">
            <svg
              className="h-full w-full"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          {/* Error Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {title}
          </h2>

          {/* Error Message */}
          <p className="text-lg text-gray-600 mb-8">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                title="Try Again"
                onClick={onReset}
                variant="primary"
                size="medium"
                ariaLabel="Try to recover from the error"
              />
              <Button
                title="Refresh Page"
                onClick={handleRefresh}
                variant="secondary"
                size="medium"
                ariaLabel="Refresh the current page"
              />
            </div>
            
            <Button
              title="Go to Homepage"
              onClick={handleGoHome}
              variant="ghost"
              size="medium"
              ariaLabel="Navigate to the homepage"
            />
          </div>

          {/* Error Details Toggle (Development/Debug) */}
          {showDetails && error && (
            <div className="mt-8">
              <button
                onClick={toggleErrorDetails}
                className="text-sm text-gray-500 hover:text-gray-700 underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                aria-label={showErrorDetails ? 'Hide error details' : 'Show error details'}
              >
                {showErrorDetails ? 'Hide' : 'Show'} Error Details
              </button>

              {showErrorDetails && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left">
                  <h3 className="text-sm font-semibold text-gray-800 mb-2">
                    Error Details:
                  </h3>
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap break-words">
                    {error.toString()}
                  </pre>
                  
                  {errorInfo && errorInfo.componentStack && (
                    <>
                      <h4 className="text-sm font-semibold text-gray-800 mt-4 mb-2">
                        Component Stack:
                      </h4>
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap break-words">
                        {errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Help Text */}
          <div className="mt-8 text-sm text-gray-500">
            <p>
              If this problem persists, please{' '}
              <a
                href="/contact"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                contact support
              </a>
              {' '}or try again later.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

ErrorFallback.propTypes = {
  error: PropTypes.object,
  errorInfo: PropTypes.object,
  onReset: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  showDetails: PropTypes.bool,
};

ErrorFallback.defaultProps = {
  error: null,
  errorInfo: null,
  title: 'Something went wrong',
  message: 'An unexpected error occurred. Please try refreshing the page.',
  showDetails: false,
};

export default ErrorFallback;

