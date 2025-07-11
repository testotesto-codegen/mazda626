import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Button Component - Accessible button that can function as a link or button
 * @param {Object} props - Component props
 * @param {string} props.title - Button text content
 * @param {string} props.customClassName - Additional CSS classes
 * @param {string} props.path - Navigation path (makes it a link button)
 * @param {Function} props.onClick - Click handler (makes it a regular button)
 * @param {string} props.type - Button type (button, submit, reset)
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {string} props.variant - Button style variant
 * @param {string} props.size - Button size variant
 * @param {Object} props.ariaLabel - Accessibility label
 * @returns {JSX.Element} Button component
 */
const Button = ({ 
  title, 
  customClassName = '', 
  path, 
  onClick, 
  type = 'button',
  disabled = false,
  variant = 'primary',
  size = 'medium',
  ariaLabel,
  ...props 
}) => {
  // Base button classes
  const baseClasses = 'font-normal rounded-lg z-40 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Size classes
  const sizeClasses = {
    small: 'text-sm py-1 px-4',
    medium: 'text-sm md:text-base py-2 px-8 md:py-3 md:px-14',
    large: 'text-base md:text-lg py-3 px-10 md:py-4 md:px-16',
  };

  // Variant classes (can be overridden by customClassName)
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500',
    ghost: 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
  };

  const buttonClasses = `
    ${baseClasses} 
    ${sizeClasses[size] || sizeClasses.medium} 
    ${!customClassName.includes('bg-') ? variantClasses[variant] : ''} 
    ${customClassName}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
  `.trim().replace(/\s+/g, ' ');

  // If path is provided, render as Link with button styling
  if (path && !disabled) {
    return (
      <Link 
        to={path} 
        className={buttonClasses}
        role="button"
        aria-label={ariaLabel || title}
        {...props}
      >
        {title}
      </Link>
    );
  }

  // Otherwise render as regular button
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      aria-label={ariaLabel || title}
      {...props}
    >
      {title}
    </button>
  );
};

Button.propTypes = {
  title: PropTypes.string.isRequired,
  customClassName: PropTypes.string,
  path: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  ariaLabel: PropTypes.string,
};

Button.defaultProps = {
  customClassName: '',
  type: 'button',
  disabled: false,
  variant: 'primary',
  size: 'medium',
  ariaLabel: null,
};

export default Button;
