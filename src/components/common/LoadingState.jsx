import React, { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * LoadingState Component
 * Provides consistent loading indicators across the financial application
 * Supports multiple variants and accessibility features
 */
const LoadingState = ({
  variant = 'spinner',
  size = 'medium',
  message = 'Loading...',
  showMessage = true,
  overlay = false,
  fullScreen = false,
  color = 'blue',
  className = '',
  testId = 'loading-state',
  ...props
}) => {
  
  // ========================================
  // STYLE CONFIGURATIONS
  // ========================================
  
  const sizeStyles = {
    small: {
      spinner: 'w-4 h-4',
      dots: 'w-2 h-2',
      bars: 'w-6 h-4',
      text: 'text-sm'
    },
    medium: {
      spinner: 'w-8 h-8',
      dots: 'w-3 h-3',
      bars: 'w-8 h-6',
      text: 'text-base'
    },
    large: {
      spinner: 'w-12 h-12',
      dots: 'w-4 h-4',
      bars: 'w-12 h-8',
      text: 'text-lg'
    },
    xlarge: {
      spinner: 'w-16 h-16',
      dots: 'w-6 h-6',
      bars: 'w-16 h-12',
      text: 'text-xl'
    }
  };

  const colorStyles = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
    gray: 'text-gray-600',
    financial: 'text-gradient-to-r from-green-500 to-blue-600'
  };

  // ========================================
  // LOADING VARIANTS
  // ========================================

  /**
   * Spinning circle loader
   */
  const SpinnerLoader = () => (
    <svg
      className={`animate-spin ${sizeStyles[size].spinner} ${colorStyles[color]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  /**
   * Bouncing dots loader
   */
  const DotsLoader = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={`${sizeStyles[size].dots} ${colorStyles[color]} bg-current rounded-full animate-bounce`}
          style={{
            animationDelay: `${index * 0.1}s`,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  );

  /**
   * Pulsing bars loader
   */
  const BarsLoader = () => (
    <div className={`flex items-end space-x-1 ${sizeStyles[size].bars}`}>
      {[0, 1, 2, 3].map((index) => (
        <div
          key={index}
          className={`w-1 ${colorStyles[color]} bg-current animate-pulse`}
          style={{
            height: `${25 + (index % 2) * 25}%`,
            animationDelay: `${index * 0.15}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );

  /**
   * Progress bar loader
   */
  const ProgressLoader = () => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`h-2 ${colorStyles[color]} bg-current rounded-full animate-pulse`}
        style={{
          width: '60%',
          animation: 'progress 2s ease-in-out infinite'
        }}
      />
      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 60%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );

  /**
   * Skeleton loader for financial data
   */
  const SkeletonLoader = () => (
    <div className="animate-pulse space-y-3">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
        <div className="w-16 h-6 bg-gray-300 rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-300 rounded"></div>
        <div className="h-3 bg-gray-300 rounded w-5/6"></div>
        <div className="h-3 bg-gray-300 rounded w-4/6"></div>
      </div>
    </div>
  );

  /**
   * Financial chart skeleton
   */
  const ChartSkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="flex items-end space-x-1 h-32 mb-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-300 rounded-t flex-1"
            style={{
              height: `${Math.random() * 80 + 20}%`
            }}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>Jan</span>
        <span>Feb</span>
        <span>Mar</span>
        <span>Apr</span>
        <span>May</span>
        <span>Jun</span>
      </div>
    </div>
  );

  // ========================================
  // RENDER HELPERS
  // ========================================

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return <DotsLoader />;
      case 'bars':
        return <BarsLoader />;
      case 'progress':
        return <ProgressLoader />;
      case 'skeleton':
        return <SkeletonLoader />;
      case 'chart-skeleton':
        return <ChartSkeletonLoader />;
      case 'spinner':
      default:
        return <SpinnerLoader />;
    }
  };

  // ========================================
  // MAIN RENDER
  // ========================================

  const containerClasses = [
    'flex flex-col items-center justify-center',
    fullScreen && 'fixed inset-0 z-50',
    overlay && !fullScreen && 'absolute inset-0 z-10',
    overlay && 'bg-white bg-opacity-75 backdrop-blur-sm',
    !overlay && !fullScreen && 'p-4',
    className
  ].filter(Boolean).join(' ');

  const content = (
    <div className="flex flex-col items-center space-y-3">
      {renderLoader()}
      
      {showMessage && message && !['skeleton', 'chart-skeleton'].includes(variant) && (
        <p 
          className={`${sizeStyles[size].text} ${colorStyles[color]} font-medium text-center`}
          aria-live="polite"
        >
          {message}
        </p>
      )}
    </div>
  );

  if (['skeleton', 'chart-skeleton', 'progress'].includes(variant)) {
    return (
      <div 
        className={className}
        data-testid={testId}
        role="status"
        aria-label={message}
        {...props}
      >
        {renderLoader()}
      </div>
    );
  }

  return (
    <div
      className={containerClasses}
      data-testid={testId}
      role="status"
      aria-label={message}
      {...props}
    >
      {content}
    </div>
  );
};

LoadingState.propTypes = {
  /** Loading animation variant */
  variant: PropTypes.oneOf([
    'spinner', 'dots', 'bars', 'progress', 'skeleton', 'chart-skeleton'
  ]),
  
  /** Size of the loading indicator */
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  
  /** Loading message to display */
  message: PropTypes.string,
  
  /** Whether to show the loading message */
  showMessage: PropTypes.bool,
  
  /** Whether to show as overlay */
  overlay: PropTypes.bool,
  
  /** Whether to show as full screen overlay */
  fullScreen: PropTypes.bool,
  
  /** Color theme */
  color: PropTypes.oneOf([
    'blue', 'green', 'red', 'yellow', 'purple', 'gray', 'financial'
  ]),
  
  /** Additional CSS classes */
  className: PropTypes.string,
  
  /** Test ID for testing */
  testId: PropTypes.string
};

export default memo(LoadingState);

// ========================================
// SPECIALIZED LOADING COMPONENTS
// ========================================

/**
 * Financial data loading component
 */
export const FinancialDataLoader = (props) => (
  <LoadingState
    variant="skeleton"
    message="Loading financial data..."
    color="financial"
    {...props}
  />
);

/**
 * Chart loading component
 */
export const ChartLoader = (props) => (
  <LoadingState
    variant="chart-skeleton"
    message="Loading chart data..."
    color="blue"
    {...props}
  />
);

/**
 * Page loading component
 */
export const PageLoader = (props) => (
  <LoadingState
    variant="spinner"
    size="large"
    message="Loading page..."
    fullScreen
    {...props}
  />
);

/**
 * Button loading component
 */
export const ButtonLoader = (props) => (
  <LoadingState
    variant="spinner"
    size="small"
    showMessage={false}
    className="inline-flex"
    {...props}
  />
);

