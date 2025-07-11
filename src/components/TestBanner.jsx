import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';

/**
 * TestBanner Component
 * 🧪 A banner component to indicate test mode is active
 * 
 * @param {Object} props - Component properties
 * @param {string} props.message - The message to display in the banner
 * @param {string} props.type - The type/variant of the banner (info, warning, error, success)
 * @param {boolean} props.dismissible - Whether the banner can be dismissed
 * @param {Function} props.onDismiss - Callback when banner is dismissed
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.testId - Test ID for testing purposes
 */
const TestBanner = ({ 
  message = "Test Mode Active", 
  type = "info",
  dismissible = true,
  onDismiss = () => {},
  className = '',
  testId = 'test-banner'
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [testStats, setTestStats] = useState({
    startTime: new Date().toLocaleTimeString(),
    interactions: 0,
  });

  useEffect(() => {
    // TEST: Track user interactions
    const handleClick = () => {
      setTestStats(prev => ({
        ...prev,
        interactions: prev.interactions + 1
      }));
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // ========================================
  // EVENT HANDLERS
  // ========================================
  
  /**
   * Handle banner dismissal
   */
  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss();
  };

  // ========================================
  // RENDER HELPERS
  // ========================================
  
  if (!isVisible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-100 border-yellow-400 text-yellow-800';
      case 'error':
        return 'bg-red-100 border-red-400 text-red-800';
      case 'success':
        return 'bg-green-100 border-green-400 text-green-800';
      default:
        return 'bg-blue-100 border-blue-400 text-blue-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'success':
        return '✅';
      default:
        return '🧪';
    }
  };

  // Compute CSS classes
  const computedClassName = [
    'border-l-4 p-4 mb-4',
    getTypeStyles(),
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={computedClassName} 
      role="alert"
      data-testid={testId}
      aria-live="polite"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-lg mr-2" aria-hidden="true">{getIcon()}</span>
          <div>
            <p className="font-medium">{message}</p>
            <p className="text-sm mt-1">
              Started: {testStats.startTime} | Interactions: {testStats.interactions}
            </p>
          </div>
        </div>
        
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            aria-label="Dismiss test banner"
            type="button"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="mt-2 text-xs opacity-75">
        <details>
          <summary className="cursor-pointer hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            Test Details
          </summary>
          <div className="mt-2 p-2 bg-white bg-opacity-50 rounded">
            <p>Build Time: {__BUILD_TIME__ || 'Unknown'}</p>
            <p>Test Mode: {__TEST_MODE__ ? 'Enabled' : 'Disabled'}</p>
            <p>Environment: {import.meta.env.MODE}</p>
          </div>
        </details>
      </div>
    </div>
  );
};

// ========================================
// COMPONENT CONFIGURATION
// ========================================

TestBanner.displayName = 'TestBanner';

TestBanner.propTypes = {
  /** The message to display in the banner */
  message: PropTypes.string,
  
  /** The type/variant of the banner */
  type: PropTypes.oneOf(['info', 'warning', 'error', 'success']),
  
  /** Whether the banner can be dismissed */
  dismissible: PropTypes.bool,
  
  /** Callback when banner is dismissed */
  onDismiss: PropTypes.func,
  
  /** Additional CSS classes */
  className: PropTypes.string,
  
  /** Test ID for testing purposes */
  testId: PropTypes.string
};

export default memo(TestBanner);
