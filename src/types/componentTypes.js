/**
 * Component Type Definitions - Common PropTypes for reusable components
 */

import PropTypes from 'prop-types';

/**
 * Common button props
 */
export const ButtonPropTypes = {
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

/**
 * Common form input props
 */
export const InputPropTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.oneOf(['text', 'email', 'password', 'number', 'tel', 'url']),
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
};

/**
 * Modal component props
 */
export const ModalPropTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'fullscreen']),
  closeOnOverlayClick: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  className: PropTypes.string,
};

/**
 * Loading spinner props
 */
export const SpinnerPropTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.string,
  className: PropTypes.string,
  text: PropTypes.string,
};

/**
 * Card component props
 */
export const CardPropTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  onClick: PropTypes.func,
  hoverable: PropTypes.bool,
  bordered: PropTypes.bool,
};

/**
 * Table component props
 */
export const TablePropTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    render: PropTypes.func,
    sortable: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })).isRequired,
  loading: PropTypes.bool,
  pagination: PropTypes.shape({
    current: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.number,
    onChange: PropTypes.func,
  }),
  onRowClick: PropTypes.func,
  className: PropTypes.string,
};

/**
 * Chart component props
 */
export const ChartPropTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  type: PropTypes.oneOf(['line', 'bar', 'pie', 'area', 'scatter']).isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  xAxisKey: PropTypes.string,
  yAxisKey: PropTypes.string,
  colors: PropTypes.arrayOf(PropTypes.string),
  showLegend: PropTypes.bool,
  showTooltip: PropTypes.bool,
  className: PropTypes.string,
};

/**
 * Navigation item props
 */
export const NavItemPropTypes = {
  label: PropTypes.string.isRequired,
  path: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.elementType,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  children: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    path: PropTypes.string,
    onClick: PropTypes.func,
  })),
  className: PropTypes.string,
};

/**
 * Form field wrapper props
 */
export const FormFieldPropTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  helpText: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  errorClassName: PropTypes.string,
};

/**
 * Common children prop
 */
export const ChildrenPropType = PropTypes.oneOfType([
  PropTypes.node,
  PropTypes.arrayOf(PropTypes.node),
]);

/**
 * Common className prop
 */
export const ClassNamePropType = PropTypes.string;

/**
 * Common style prop
 */
export const StylePropType = PropTypes.object;

/**
 * Common event handler props
 */
export const EventHandlerPropTypes = {
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
};

