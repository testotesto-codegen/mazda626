import React, { memo, forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Component Template - Standard Pattern for Financial App Components
 * 
 * This template demonstrates the consistent structure and patterns
 * that should be followed across all components in the application.
 * 
 * Key patterns:
 * - Proper PropTypes with detailed descriptions
 * - Default props handling
 * - Error boundary integration
 * - Accessibility considerations
 * - Performance optimizations (memo, forwardRef when needed)
 * - Consistent naming conventions
 * - JSDoc documentation
 */

/**
 * ComponentTemplate - A template component demonstrating best practices
 * 
 * @param {Object} props - Component properties
 * @param {string} props.title - The main title text
 * @param {React.ReactNode} props.children - Child components or content
 * @param {string} props.variant - Visual variant of the component
 * @param {boolean} props.disabled - Whether the component is disabled
 * @param {Function} props.onAction - Callback function for user actions
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.data - Data object for the component
 * @param {boolean} props.loading - Loading state indicator
 * @param {Function} props.onError - Error handling callback
 * @param {React.Ref} ref - Forwarded ref for the component
 */
const ComponentTemplate = forwardRef(({
  title = '',
  children = null,
  variant = 'default',
  disabled = false,
  onAction = () => {},
  className = '',
  data = null,
  loading = false,
  onError = () => {},
  testId = '',
  ...restProps
}, ref) => {
  
  // ========================================
  // HOOKS AND STATE
  // ========================================
  
  // Local state should be defined here
  // const [localState, setLocalState] = useState(defaultValue);
  
  // Custom hooks should be called here
  // const { customData, customError } = useCustomHook();
  
  // ========================================
  // COMPUTED VALUES
  // ========================================
  
  // Compute CSS classes
  const computedClassName = [
    'component-template', // Base class
    `component-template--${variant}`, // Variant class
    disabled && 'component-template--disabled', // Conditional class
    loading && 'component-template--loading', // Loading state class
    className // Additional classes
  ].filter(Boolean).join(' ');
  
  // ========================================
  // EVENT HANDLERS
  // ========================================
  
  /**
   * Handle user action with proper error handling
   * @param {Event} event - The event object
   */
  const handleAction = (event) => {
    try {
      if (disabled || loading) {
        return;
      }
      
      onAction(event, data);
    } catch (error) {
      console.error('ComponentTemplate action error:', error);
      onError(error);
    }
  };
  
  // ========================================
  // RENDER HELPERS
  // ========================================
  
  /**
   * Render loading state
   */
  const renderLoading = () => (
    <div className="component-template__loading" aria-live="polite">
      <span className="sr-only">Loading...</span>
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
    </div>
  );
  
  /**
   * Render main content
   */
  const renderContent = () => {
    if (loading) {
      return renderLoading();
    }
    
    return (
      <div className="component-template__content">
        {title && (
          <h3 className="component-template__title">
            {title}
          </h3>
        )}
        {children}
      </div>
    );
  };
  
  // ========================================
  // MAIN RENDER
  // ========================================
  
  return (
    <div
      ref={ref}
      className={computedClassName}
      data-testid={testId || 'component-template'}
      aria-disabled={disabled}
      role="region"
      {...restProps}
    >
      {renderContent()}
      
      {/* Action button example */}
      <button
        type="button"
        onClick={handleAction}
        disabled={disabled || loading}
        className="component-template__action"
        aria-label={`Action for ${title}`}
      >
        Action
      </button>
    </div>
  );
});

// ========================================
// COMPONENT CONFIGURATION
// ========================================

// Display name for debugging
ComponentTemplate.displayName = 'ComponentTemplate';

// PropTypes definition with detailed descriptions
ComponentTemplate.propTypes = {
  /** The main title text to display */
  title: PropTypes.string,
  
  /** Child components or content to render */
  children: PropTypes.node,
  
  /** Visual variant of the component */
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'danger']),
  
  /** Whether the component is disabled */
  disabled: PropTypes.bool,
  
  /** Callback function called when user performs an action */
  onAction: PropTypes.func,
  
  /** Additional CSS classes to apply */
  className: PropTypes.string,
  
  /** Data object passed to the component */
  data: PropTypes.object,
  
  /** Loading state indicator */
  loading: PropTypes.bool,
  
  /** Error handling callback function */
  onError: PropTypes.func,
  
  /** Test ID for testing purposes */
  testId: PropTypes.string
};

// Default props (optional with modern React, but good for documentation)
ComponentTemplate.defaultProps = {
  title: '',
  children: null,
  variant: 'default',
  disabled: false,
  onAction: () => {},
  className: '',
  data: null,
  loading: false,
  onError: () => {},
  testId: ''
};

// Export with memo for performance optimization
export default memo(ComponentTemplate);

// ========================================
// USAGE EXAMPLES (for documentation)
// ========================================

/*
// Basic usage
<ComponentTemplate title="Example Title" />

// With children
<ComponentTemplate title="Container">
  <p>Child content here</p>
</ComponentTemplate>

// With all props
<ComponentTemplate
  title="Advanced Example"
  variant="primary"
  disabled={false}
  loading={isLoading}
  data={myData}
  onAction={handleMyAction}
  onError={handleError}
  className="my-custom-class"
  testId="my-component"
>
  <div>Complex child content</div>
</ComponentTemplate>
*/

