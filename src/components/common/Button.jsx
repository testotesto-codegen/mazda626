import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Enhanced Button Component for Financial Applications
 * Supports multiple variants, sizes, loading states, and accessibility features
 */
const Button = ({
  title,
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  path,
  onClick,
  type = 'button',
  className = '',
  icon,
  iconPosition = 'left',
  ...props
}) => {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Variant styles for financial UI
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    ghost: 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    financial: 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white focus:ring-green-500'
  };
  
  // Size styles
  const sizeStyles = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
    xlarge: 'px-8 py-4 text-xl'
  };
  
  // Loading spinner component
  const LoadingSpinner = () => (
    <svg 
      className="animate-spin -ml-1 mr-2 h-4 w-4" 
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
  
  // Combine all styles
  const buttonClasses = [
    baseStyles,
    variantStyles[variant] || variantStyles.primary,
    sizeStyles[size] || sizeStyles.medium,
    fullWidth ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ');
  
  // Button content with icon support
  const buttonContent = (
    <>
      {loading && <LoadingSpinner />}
      {icon && iconPosition === 'left' && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      {children || title}
      {icon && iconPosition === 'right' && !loading && (
        <span className="ml-2">{icon}</span>
      )}
    </>
  );
  
  // Common button props
  const buttonProps = {
    className: buttonClasses,
    disabled: disabled || loading,
    type,
    'aria-disabled': disabled || loading,
    'aria-busy': loading,
    ...props
  };
  
  // If path is provided, render as Link
  if (path && !disabled && !loading) {
    return (
      <Link to={path} className="inline-block">
        <button {...buttonProps} onClick={onClick}>
          {buttonContent}
        </button>
      </Link>
    );
  }
  
  // Regular button
  return (
    <button {...buttonProps} onClick={onClick}>
      {buttonContent}
    </button>
  );
};

Button.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  variant: PropTypes.oneOf([
    'primary', 'secondary', 'success', 'danger', 
    'warning', 'outline', 'ghost', 'financial'
  ]),
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  path: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right'])
};

export default Button;

