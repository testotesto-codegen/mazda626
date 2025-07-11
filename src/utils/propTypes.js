import PropTypes from 'prop-types';

/**
 * Common PropTypes patterns used throughout the application
 * This centralizes prop validation and makes it easier to maintain consistency
 */

// Common shape for user objects
export const userShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  email: PropTypes.string.isRequired,
  name: PropTypes.string,
  avatar: PropTypes.string,
});

// Common shape for API response objects
export const apiResponseShape = PropTypes.shape({
  data: PropTypes.any,
  error: PropTypes.string,
  loading: PropTypes.bool,
  success: PropTypes.bool,
});

// Common shape for chart data
export const chartDataShape = PropTypes.arrayOf(
  PropTypes.shape({
    x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    y: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string,
  })
);

// Common shape for financial data
export const stockDataShape = PropTypes.shape({
  symbol: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  change: PropTypes.number,
  changePercent: PropTypes.number,
  volume: PropTypes.number,
  marketCap: PropTypes.number,
});

// Common button variants
export const buttonVariants = PropTypes.oneOf([
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
  'light',
  'dark',
  'link'
]);

// Common size variants
export const sizeVariants = PropTypes.oneOf([
  'xs',
  'sm',
  'md',
  'lg',
  'xl'
]);

// Common theme variants
export const themeVariants = PropTypes.oneOf([
  'light',
  'dark',
  'auto'
]);

// Utility function to create optional prop with default
export const withDefault = (propType, defaultValue) => {
  const prop = PropTypes.oneOfType([propType, PropTypes.oneOf([undefined])]);
  prop.defaultValue = defaultValue;
  return prop;
};

// Validation helpers
export const validators = {
  email: (props, propName, componentName) => {
    const value = props[propName];
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return new Error(
        `Invalid prop \`${propName}\` of value \`${value}\` supplied to \`${componentName}\`, expected a valid email address.`
      );
    }
  },
  
  url: (props, propName, componentName) => {
    const value = props[propName];
    if (value && !/^https?:\/\/.+/.test(value)) {
      return new Error(
        `Invalid prop \`${propName}\` of value \`${value}\` supplied to \`${componentName}\`, expected a valid URL.`
      );
    }
  },
  
  positiveNumber: (props, propName, componentName) => {
    const value = props[propName];
    if (value !== undefined && (typeof value !== 'number' || value <= 0)) {
      return new Error(
        `Invalid prop \`${propName}\` of value \`${value}\` supplied to \`${componentName}\`, expected a positive number.`
      );
    }
  }
};

export default {
  userShape,
  apiResponseShape,
  chartDataShape,
  stockDataShape,
  buttonVariants,
  sizeVariants,
  themeVariants,
  withDefault,
  validators,
};

