# Architecture Guidelines - Accelno Financial Dashboard

## Overview
This document outlines the architectural standards and best practices for the Accelno financial dashboard application.

## File Organization Standards

### File Extensions
- **React Components**: Use `.jsx` extension for all React components
- **Utilities & Services**: Use `.js` extension for non-React JavaScript files
- **TypeScript**: Use `.ts` for TypeScript utilities, `.tsx` for TypeScript React components

### Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile.jsx`, `MarketDashboard.jsx`)
- **Utilities**: camelCase (e.g., `dateHelpers.js`, `apiClient.js`)
- **Hooks**: camelCase starting with "use" (e.g., `useDebounce.js`, `useAuth.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.js`)

### Directory Structure
```
src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components across features
│   ├── dashboard/       # Dashboard-specific components
│   └── forms/           # Form-related components
├── pages/               # Top-level page components
├── layouts/             # Layout wrapper components
├── hooks/               # Custom React hooks
├── services/            # API services and business logic
│   └── api/            # API client functions
├── utils/               # Pure utility functions
├── types/               # TypeScript type definitions
├── redux/               # Redux store, slices, and middleware
└── assets/              # Static assets
```

## Component Architecture

### Component Structure
```jsx
// Component imports
import React from 'react';
import PropTypes from 'prop-types';

// Third-party imports
import { useSelector } from 'react-redux';

// Internal imports
import { Button } from '../common';
import { useAuth } from '../../hooks';

const ComponentName = ({ prop1, prop2, ...props }) => {
  // Hooks
  const auth = useAuth();
  
  // Event handlers
  const handleClick = () => {
    // Handler logic
  };

  // Render
  return (
    <div {...props}>
      {/* Component JSX */}
    </div>
  );
};

// PropTypes validation
ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
};

// Default props
ComponentName.defaultProps = {
  prop2: 0,
};

export default ComponentName;
```

### Accessibility Standards
- All interactive elements must have proper ARIA attributes
- Avoid nested interactive elements (buttons inside links)
- Provide meaningful alt text for images
- Ensure proper keyboard navigation
- Use semantic HTML elements

## Service Layer Architecture

### API Services
- Keep API calls separate from UI components
- Use consistent error handling patterns
- Implement proper loading states
- Cache responses when appropriate

### Business Logic
- Separate business logic from UI components
- Use custom hooks for complex state logic
- Implement proper error boundaries

## Performance Standards

### Code Splitting
- Implement lazy loading for route-level components
- Split large feature bundles
- Use React.memo for expensive components

### Bundle Optimization
- Remove unused dependencies
- Optimize asset loading
- Implement proper caching strategies

## Error Handling

### Error Boundaries
- Implement error boundaries at feature level
- Provide user-friendly error messages
- Log errors for debugging

### Async Error Handling
- Use try-catch blocks for async operations
- Implement proper loading and error states
- Provide retry mechanisms where appropriate

## Development Standards

### Code Quality
- Use ESLint and Prettier for consistent formatting
- Write meaningful commit messages
- Add JSDoc comments for complex functions
- Remove console.log statements before production

### Testing
- Write unit tests for utility functions
- Test component behavior, not implementation
- Mock external dependencies properly

## Migration Guidelines

When refactoring existing code:
1. Update file extensions to match standards
2. Add proper PropTypes or TypeScript types
3. Fix accessibility issues
4. Implement error handling
5. Optimize performance where needed
6. Update imports and exports consistently

## Dependencies

### Core Dependencies
- React 18+ for modern features
- Redux Toolkit for state management
- React Router for navigation
- date-fns for date manipulation
- Tailwind CSS for styling

### Development Dependencies
- ESLint for code quality
- Prettier for formatting
- Vite for build tooling

---

*This document should be updated as the architecture evolves.*

