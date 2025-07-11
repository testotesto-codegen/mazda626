import { Link } from 'react-router-dom';
import { forwardRef } from 'react';
import {
  BASE_BUTTON_CLASSES,
  VARIANT_CLASSES,
  SIZE_CLASSES,
  BUTTON_VARIANTS,
  BUTTON_SIZES,
  BUTTON_TYPES
} from './Button.types';

/**
 * Enhanced Button component with multiple variants, sizes, and states
 * 
 * @param {Object} props - Component props
 * @param {string} props.children - Button content
 * @param {string} props.variant - Button variant (primary, secondary, outline, ghost, danger, success)
 * @param {string} props.size - Button size (sm, md, lg, xl)
 * @param {string} props.type - Button type (button, submit, reset, link)
 * @param {string} props.to - Link destination (only for type="link")
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {boolean} props.loading - Whether button is in loading state
 * @param {React.ReactNode} props.leftIcon - Icon to display on the left
 * @param {React.ReactNode} props.rightIcon - Icon to display on the right
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler
 * @param {Object} props.ariaLabel - Accessibility label
 * @param {Object} rest - Additional props
 */
const Button = forwardRef(({
  children,
  variant = BUTTON_VARIANTS.PRIMARY,
  size = BUTTON_SIZES.MEDIUM,
  type = BUTTON_TYPES.BUTTON,
  to,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  className = '',
  onClick,
  ariaLabel,
  ...rest
}, ref) => {
  // Build CSS classes
  const buttonClasses = [
    BASE_BUTTON_CLASSES,
    VARIANT_CLASSES[variant] || VARIANT_CLASSES[BUTTON_VARIANTS.PRIMARY],
    SIZE_CLASSES[size] || SIZE_CLASSES[BUTTON_SIZES.MEDIUM],
    className
  ].filter(Boolean).join(' ');

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4"
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
  );

  // Button content with icons and loading state
  const buttonContent = (
    <>
      {loading && <LoadingSpinner />}
      {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      <span>{children}</span>
      {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </>
  );

  // Common props for all button types
  const commonProps = {
    className: buttonClasses,
    disabled: disabled || loading,
    'aria-label': ariaLabel,
    ref,
    ...rest
  };

  // Render as Link component for navigation
  if (type === BUTTON_TYPES.LINK && to) {
    return (
      <Link
        to={to}
        {...commonProps}
        onClick={disabled || loading ? undefined : onClick}
      >
        {buttonContent}
      </Link>
    );
  }

  // Render as regular button
  return (
    <button
      type={type === BUTTON_TYPES.LINK ? BUTTON_TYPES.BUTTON : type}
      onClick={onClick}
      {...commonProps}
    >
      {buttonContent}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
