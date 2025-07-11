/**
 * Accessibility utilities and helpers for improved user experience
 * Provides consistent patterns for ARIA labels, keyboard navigation, and screen reader support
 */

/**
 * Generates unique IDs for form elements and ARIA relationships
 * @param {string} prefix - Prefix for the ID
 * @returns {string} - Unique ID
 */
export const generateId = (prefix = 'element') => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Creates ARIA attributes for form fields with labels and descriptions
 * @param {Object} options - Configuration options
 * @returns {Object} - ARIA attributes object
 */
export const createFormFieldAria = (options = {}) => {
  const {
    label,
    description,
    error,
    required = false,
    invalid = false
  } = options;

  const fieldId = generateId('field');
  const labelId = generateId('label');
  const descriptionId = description ? generateId('description') : null;
  const errorId = error ? generateId('error') : null;

  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ');

  return {
    field: {
      id: fieldId,
      'aria-labelledby': labelId,
      'aria-describedby': describedBy || undefined,
      'aria-required': required,
      'aria-invalid': invalid,
    },
    label: {
      id: labelId,
      htmlFor: fieldId,
    },
    description: descriptionId ? {
      id: descriptionId,
      'aria-live': 'polite',
    } : null,
    error: errorId ? {
      id: errorId,
      'aria-live': 'assertive',
      role: 'alert',
    } : null,
  };
};

/**
 * Creates ARIA attributes for modal dialogs
 * @param {Object} options - Configuration options
 * @returns {Object} - ARIA attributes for modal components
 */
export const createModalAria = (options = {}) => {
  const {
    title,
    description,
    isOpen = false,
    onClose
  } = options;

  const modalId = generateId('modal');
  const titleId = generateId('modal-title');
  const descriptionId = description ? generateId('modal-description') : null;

  return {
    overlay: {
      'aria-hidden': !isOpen,
      onClick: (e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      },
    },
    dialog: {
      id: modalId,
      role: 'dialog',
      'aria-modal': true,
      'aria-labelledby': titleId,
      'aria-describedby': descriptionId || undefined,
      tabIndex: -1,
    },
    title: {
      id: titleId,
    },
    description: descriptionId ? {
      id: descriptionId,
    } : null,
    closeButton: {
      'aria-label': 'Close dialog',
      onClick: onClose,
    },
  };
};

/**
 * Creates ARIA attributes for dropdown/combobox components
 * @param {Object} options - Configuration options
 * @returns {Object} - ARIA attributes for dropdown components
 */
export const createDropdownAria = (options = {}) => {
  const {
    isOpen = false,
    hasError = false,
    placeholder = 'Select an option',
    selectedValue = null
  } = options;

  const comboboxId = generateId('combobox');
  const listboxId = generateId('listbox');

  return {
    trigger: {
      id: comboboxId,
      role: 'combobox',
      'aria-expanded': isOpen,
      'aria-haspopup': 'listbox',
      'aria-controls': listboxId,
      'aria-invalid': hasError,
      'aria-label': selectedValue || placeholder,
    },
    listbox: {
      id: listboxId,
      role: 'listbox',
      'aria-labelledby': comboboxId,
    },
    option: (value, isSelected = false, isActive = false) => ({
      role: 'option',
      'aria-selected': isSelected,
      'aria-current': isActive ? 'true' : undefined,
      id: generateId(`option-${value}`),
    }),
  };
};

/**
 * Creates ARIA attributes for tab components
 * @param {Array} tabs - Array of tab objects
 * @param {number} activeIndex - Index of active tab
 * @returns {Object} - ARIA attributes for tab components
 */
export const createTabsAria = (tabs = [], activeIndex = 0) => {
  const tablistId = generateId('tablist');
  
  return {
    tablist: {
      id: tablistId,
      role: 'tablist',
    },
    tab: (index) => {
      const tabId = generateId(`tab-${index}`);
      const panelId = generateId(`panel-${index}`);
      
      return {
        id: tabId,
        role: 'tab',
        'aria-selected': index === activeIndex,
        'aria-controls': panelId,
        tabIndex: index === activeIndex ? 0 : -1,
      };
    },
    panel: (index) => {
      const tabId = generateId(`tab-${index}`);
      const panelId = generateId(`panel-${index}`);
      
      return {
        id: panelId,
        role: 'tabpanel',
        'aria-labelledby': tabId,
        tabIndex: 0,
        hidden: index !== activeIndex,
      };
    },
  };
};

/**
 * Keyboard navigation helpers
 */
export const keyboardNavigation = {
  /**
   * Handles arrow key navigation for lists and menus
   * @param {KeyboardEvent} event - Keyboard event
   * @param {Array} items - Array of focusable items
   * @param {number} currentIndex - Current focused index
   * @param {Function} onIndexChange - Callback for index changes
   */
  handleArrowKeys: (event, items, currentIndex, onIndexChange) => {
    const { key } = event;
    let newIndex = currentIndex;

    switch (key) {
      case 'ArrowDown':
        event.preventDefault();
        newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'ArrowUp':
        event.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = items.length - 1;
        break;
      default:
        return;
    }

    onIndexChange(newIndex);
  },

  /**
   * Handles tab navigation for tab components
   * @param {KeyboardEvent} event - Keyboard event
   * @param {number} tabCount - Total number of tabs
   * @param {number} currentTab - Current active tab
   * @param {Function} onTabChange - Callback for tab changes
   */
  handleTabKeys: (event, tabCount, currentTab, onTabChange) => {
    const { key } = event;
    let newTab = currentTab;

    switch (key) {
      case 'ArrowLeft':
        event.preventDefault();
        newTab = currentTab > 0 ? currentTab - 1 : tabCount - 1;
        break;
      case 'ArrowRight':
        event.preventDefault();
        newTab = currentTab < tabCount - 1 ? currentTab + 1 : 0;
        break;
      case 'Home':
        event.preventDefault();
        newTab = 0;
        break;
      case 'End':
        event.preventDefault();
        newTab = tabCount - 1;
        break;
      default:
        return;
    }

    onTabChange(newTab);
  },
};

/**
 * Focus management utilities
 */
export const focusManagement = {
  /**
   * Traps focus within a container (useful for modals)
   * @param {HTMLElement} container - Container element
   * @returns {Function} - Cleanup function
   */
  trapFocus: (container) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (event) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  },

  /**
   * Returns focus to a previously focused element
   * @param {HTMLElement} element - Element to focus
   */
  returnFocus: (element) => {
    if (element && typeof element.focus === 'function') {
      element.focus();
    }
  },

  /**
   * Finds the next focusable element
   * @param {HTMLElement} container - Container to search within
   * @param {HTMLElement} currentElement - Current focused element
   * @param {boolean} reverse - Whether to search backwards
   * @returns {HTMLElement|null} - Next focusable element
   */
  getNextFocusable: (container, currentElement, reverse = false) => {
    const focusableElements = Array.from(
      container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    );

    const currentIndex = focusableElements.indexOf(currentElement);
    const nextIndex = reverse ? currentIndex - 1 : currentIndex + 1;

    if (nextIndex < 0) return focusableElements[focusableElements.length - 1];
    if (nextIndex >= focusableElements.length) return focusableElements[0];

    return focusableElements[nextIndex];
  },
};

/**
 * Screen reader utilities
 */
export const screenReader = {
  /**
   * Announces a message to screen readers
   * @param {string} message - Message to announce
   * @param {string} priority - Priority level ('polite' or 'assertive')
   */
  announce: (message, priority = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = message;

    document.body.appendChild(announcer);

    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  },

  /**
   * Creates a visually hidden element for screen readers
   * @param {string} text - Text for screen readers
   * @returns {HTMLElement} - Hidden element
   */
  createHiddenText: (text) => {
    const element = document.createElement('span');
    element.className = 'sr-only';
    element.textContent = text;
    return element;
  },
};

/**
 * Color contrast and visual accessibility helpers
 */
export const visualAccessibility = {
  /**
   * Checks if a color combination meets WCAG contrast requirements
   * @param {string} foreground - Foreground color (hex)
   * @param {string} background - Background color (hex)
   * @param {string} level - WCAG level ('AA' or 'AAA')
   * @returns {boolean} - Whether contrast is sufficient
   */
  checkContrast: (foreground, background, level = 'AA') => {
    // This is a simplified implementation
    // In a real application, you'd use a proper contrast calculation library
    const minRatio = level === 'AAA' ? 7 : 4.5;
    // TODO: Implement actual contrast ratio calculation
    return true; // Placeholder
  },

  /**
   * Detects if user prefers reduced motion
   * @returns {boolean} - Whether user prefers reduced motion
   */
  prefersReducedMotion: () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  /**
   * Detects if user prefers high contrast
   * @returns {boolean} - Whether user prefers high contrast
   */
  prefersHighContrast: () => {
    return window.matchMedia('(prefers-contrast: high)').matches;
  },
};

export default {
  generateId,
  createFormFieldAria,
  createModalAria,
  createDropdownAria,
  createTabsAria,
  keyboardNavigation,
  focusManagement,
  screenReader,
  visualAccessibility,
};

