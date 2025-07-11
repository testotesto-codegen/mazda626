import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Reusable Button component with multiple variants and states
 * Supports both Link navigation and onClick handlers
 */
const Button = ({ 
  title, 
  customClassName = '', 
  path, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  type = 'button',
  children,
  ...rest 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600';
      case 'secondary':
        return 'bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-200';
      case 'outline':
        return 'bg-transparent hover:bg-blue-50 text-blue-600 border-blue-600 border';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white border-red-600';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white border-green-600';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'py-1 px-4 text-sm';
      case 'medium':
        return 'py-2 px-8 md:py-3 md:px-14 text-sm md:text-base';
      case 'large':
        return 'py-3 px-12 md:py-4 md:px-16 text-base md:text-lg';
      default:
        return 'py-2 px-8 md:py-3 md:px-14 text-sm md:text-base';
    }
  };

  const baseClasses = `
    font-normal rounded-lg z-40 transition-colors duration-200 
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    disabled:opacity-50 disabled:cursor-not-allowed
    ${getVariantClasses()} 
    ${getSizeClasses()}
    ${customClassName}
  `.trim().replace(/\s+/g, ' ');

  const buttonContent = (
    <>
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current inline" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
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
      )}
      {children || title}
    </>
  );

  // If path is provided, render as Link
  if (path && !disabled && !loading) {
    return (
      <Link to={path} className="inline-block">
        <button 
          className={baseClasses}
          disabled={disabled}
          type={type}
          {...rest}
        >
          {buttonContent}
        </button>
      </Link>
    );
  }

  // Otherwise render as regular button
  return (
    <button
      className={baseClasses}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      {...rest}
    >
      {buttonContent}
    </button>
  );
};

Button.propTypes = {
  /** Button text content */
  title: PropTypes.string,
  /** Additional CSS classes */
  customClassName: PropTypes.string,
  /** Navigation path for Link behavior */
  path: PropTypes.string,
  /** Click handler for button behavior */
  onClick: PropTypes.func,
  /** Button visual variant */
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'danger', 'success']),
  /** Button size */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /** Disabled state */
  disabled: PropTypes.bool,
  /** Loading state with spinner */
  loading: PropTypes.bool,
  /** HTML button type */
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  /** Child elements (alternative to title) */
  children: PropTypes.node
};

Button.defaultProps = {
  customClassName: '',
  variant: 'primary',
  size: 'medium',
  disabled: false,
  loading: false,
  type: 'button'
};

export default Button;
