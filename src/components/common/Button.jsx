import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { buttonVariants, sizeVariants } from '../../utils/propTypes';

/**
 * Reusable Button component with proper accessibility and prop validation
 * Supports both internal routing and external links
 */
const Button = ({ 
  title, 
  customClassName = '', 
  path, 
  variant = 'primary',
  size = 'md',
  disabled = false,
  external = false,
  onClick,
  type = 'button',
  ariaLabel,
  children,
  ...rest 
}) => {
  // Base button classes
  const baseClasses = 'font-normal rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Size classes
  const sizeClasses = {
    xs: 'text-xs py-1 px-3',
    sm: 'text-sm py-2 px-4',
    md: 'text-sm md:text-base py-2 px-8 md:py-3 md:px-14',
    lg: 'text-base py-3 px-8',
    xl: 'text-lg py-4 px-10'
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    info: 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500',
    light: 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 focus:ring-gray-500',
    dark: 'bg-gray-800 hover:bg-gray-900 text-white focus:ring-gray-500',
    link: 'text-blue-600 hover:text-blue-800 underline focus:ring-blue-500'
  };

  const buttonClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${customClassName}`.trim();

  const buttonContent = children || title;

  // Handle external links
  if (external && path) {
    return (
      <a
        href={path}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses}
        aria-label={ariaLabel || title}
        {...rest}
      >
        {buttonContent}
      </a>
    );
  }

  // Handle internal routing
  if (path && !disabled) {
    return (
      <Link to={path} className="inline-block">
        <button 
          className={buttonClasses}
          disabled={disabled}
          onClick={onClick}
          type={type}
          aria-label={ariaLabel || title}
          {...rest}
        >
          {buttonContent}
        </button>
      </Link>
    );
  }

  // Handle regular button (no routing)
  return (
    <button 
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      type={type}
      aria-label={ariaLabel || title}
      {...rest}
    >
      {buttonContent}
    </button>
  );
};

Button.propTypes = {
  title: PropTypes.string,
  customClassName: PropTypes.string,
  path: PropTypes.string,
  variant: buttonVariants,
  size: sizeVariants,
  disabled: PropTypes.bool,
  external: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  ariaLabel: PropTypes.string,
  children: PropTypes.node,
};

Button.defaultProps = {
  title: '',
  customClassName: '',
  path: null,
  variant: 'primary',
  size: 'md',
  disabled: false,
  external: false,
  onClick: null,
  type: 'button',
  ariaLabel: null,
  children: null,
};

export default Button;
