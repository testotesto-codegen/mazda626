# Migration Guide - Refactored Architecture

This guide helps you migrate existing code to the new refactored architecture.

## Overview of Changes

The refactoring introduces a feature-based architecture with clear separation of concerns:

- **Core Infrastructure**: Configuration, logging, API client
- **Feature Modules**: Self-contained feature domains
- **Shared Resources**: Reusable components, hooks, and utilities
- **Test Utilities**: Separated from production code

## File Structure Changes

### Before (Old Structure)
```
src/
├── components/
├── pages/
├── screens/
├── services/
├── utils/
├── hooks/
├── api/
└── redux/
```

### After (New Structure)
```
src/
├── core/                 # Core infrastructure
│   ├── api/             # API client and services
│   ├── config/          # Configuration management
│   ├── logging/         # Logging system
│   └── types/           # Global types
├── features/            # Feature-based modules
│   ├── auth/           # Authentication
│   ├── dashboard/      # Dashboard features
│   ├── portfolio/      # Portfolio management
│   ├── payments/       # Payment processing
│   └── market/         # Market data
├── shared/             # Shared resources
│   ├── components/     # Reusable components
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Utility functions
│   └── constants/      # Application constants
└── __tests__/          # Test utilities
```

## Migration Steps

### 1. Update Imports

#### Configuration
**Before:**
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

**After:**
```javascript
import { API_CONFIG } from '../core/config';
const apiUrl = API_CONFIG.BASE_URL;
```

#### Logging
**Before:**
```javascript
console.log('Debug message');
console.error('Error occurred');
```

**After:**
```javascript
import { createLogger } from '../core/logging';
const logger = createLogger('ComponentName');

logger.debug('Debug message');
logger.error('Error occurred');
```

#### API Calls
**Before:**
```javascript
import axios from 'axios';

const response = await axios.get('/api/users');
```

**After:**
```javascript
import { apiClient } from '../core/api/client';

const response = await apiClient.get('/users');
```

#### Date Formatting
**Before:**
```javascript
import { formatDate } from '../utils/DateFormatter';
```

**After:**
```javascript
import { formatDate } from '../shared/utils/dateUtils';
```

#### Authentication
**Before:**
```javascript
import { useSelector } from 'react-redux';
const { user, isLoggedIn } = useSelector(state => state.auth);
```

**After:**
```javascript
import { useAuth } from '../features/auth/hooks/useAuth';
const { user, isAuthenticated } = useAuth();
```

### 2. Component Migration

#### Error Boundaries
**Before:**
```javascript
// No error boundary
function MyComponent() {
  return <div>Content</div>;
}
```

**After:**
```javascript
import { FeatureErrorBoundary } from '../shared/components/ErrorBoundary';

function MyComponent() {
  return (
    <FeatureErrorBoundary feature="MyFeature">
      <div>Content</div>
    </FeatureErrorBoundary>
  );
}
```

#### API Hooks
**Before:**
```javascript
import { useState, useEffect } from 'react';

function MyComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/data');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return <div>{loading ? 'Loading...' : JSON.stringify(data)}</div>;
}
```

**After:**
```javascript
import { useApi } from '../shared/hooks/useApi';
import { dataService } from '../services/DataService';

function MyComponent() {
  const { data, loading, error } = useApi(dataService.fetchData, {
    immediate: true
  });
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{JSON.stringify(data)}</div>;
}
```

### 3. Service Migration

#### Before (Mixed in Components)
```javascript
// In component file
const login = async (credentials) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  
  if (!response.ok) throw new Error('Login failed');
  
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
};
```

#### After (Dedicated Service)
```javascript
// In AuthService.js
import { BaseService } from '../core/api/services/BaseService';

export class AuthService extends BaseService {
  constructor() {
    super('/auth');
  }
  
  async login(credentials) {
    const response = await this.post('/login', credentials);
    
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    
    return response;
  }
}

export const authService = new AuthService();
```

### 4. Utility Migration

#### Date Utilities
**Before:**
```javascript
// In DateFormatter.js
export const formatDate = (date) => {
  // Complex formatting logic
};
```

**After:**
```javascript
// In shared/utils/dateUtils.js
import { format, parseISO } from 'date-fns';

export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString);
};
```

#### Constants
**Before:**
```javascript
// Scattered throughout files
const API_URL = '/api';
const USER_ROLES = { ADMIN: 'admin', USER: 'user' };
```

**After:**
```javascript
// In shared/constants/index.js
export const API_ENDPOINTS = {
  AUTH: { LOGIN: '/auth/login' }
};

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};
```

### 5. Test Migration

#### Before (Mixed with Production)
```javascript
// In production file
export const testHelpers = {
  mockUser: { id: 1, name: 'Test' }
};
```

#### After (Separate Test Files)
```javascript
// In __tests__/testUtils.js
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User'
};
```

## Breaking Changes

### 1. Import Paths
All import paths need to be updated to reflect the new structure.

### 2. API Client
Direct axios usage should be replaced with the centralized API client.

### 3. Error Handling
Components should use Error Boundaries instead of try-catch blocks for UI errors.

### 4. Configuration
Environment variables should be accessed through the config system.

### 5. Logging
Console statements should be replaced with the logging system.

## Migration Checklist

### Phase 1: Infrastructure
- [ ] Update configuration imports
- [ ] Replace console statements with logger
- [ ] Wrap app with ErrorBoundary and AuthProvider
- [ ] Update API calls to use new client

### Phase 2: Services
- [ ] Create service classes extending BaseService
- [ ] Move API logic from components to services
- [ ] Update authentication logic to use AuthService

### Phase 3: Components
- [ ] Move components to appropriate feature folders
- [ ] Update import paths
- [ ] Add error boundaries where needed
- [ ] Replace custom API logic with useApi hook

### Phase 4: Utilities
- [ ] Split large utility files
- [ ] Move utilities to shared/utils
- [ ] Update utility imports throughout app
- [ ] Remove test code from production utilities

### Phase 5: Testing
- [ ] Move test utilities to __tests__ folder
- [ ] Update test imports
- [ ] Remove test code from production files
- [ ] Update test setup to use new providers

### Phase 6: Constants
- [ ] Move constants to shared/constants
- [ ] Update constant imports
- [ ] Consolidate scattered constants

## Common Issues and Solutions

### Issue: Import Errors
**Problem:** `Module not found` errors after migration.
**Solution:** Update import paths to match new structure.

### Issue: Configuration Not Found
**Problem:** Environment variables not accessible.
**Solution:** Import from `core/config` instead of direct `import.meta.env`.

### Issue: API Calls Failing
**Problem:** API calls not working with new client.
**Solution:** Ensure API client is properly configured and services extend BaseService.

### Issue: Authentication State
**Problem:** Auth state not available in components.
**Solution:** Ensure components are wrapped with AuthProvider and use useAuth hook.

### Issue: Error Boundaries Not Catching Errors
**Problem:** Errors not being caught by error boundaries.
**Solution:** Ensure error boundaries are placed at appropriate levels and errors are thrown, not just logged.

## Performance Considerations

### Code Splitting
The new architecture supports better code splitting:

```javascript
// Lazy load feature modules
const DashboardFeature = lazy(() => import('../features/dashboard'));
```

### Bundle Analysis
Use the new analyze script to monitor bundle size:

```bash
npm run analyze
```

### Caching
The new API client includes built-in caching. Configure per service:

```javascript
class MyService extends BaseService {
  constructor() {
    super('/my-endpoint', { cache: true });
  }
}
```

## Next Steps

1. **Review Migration**: Go through each file systematically
2. **Test Thoroughly**: Ensure all functionality works after migration
3. **Update Documentation**: Update any component documentation
4. **Team Training**: Train team members on new patterns
5. **Monitor Performance**: Watch for any performance regressions
6. **Iterate**: Refine the architecture based on usage patterns

## Support

If you encounter issues during migration:

1. Check this guide for common solutions
2. Review the architecture documentation
3. Look at migrated examples in the codebase
4. Ask team members who have completed migration

Remember: Migration should be done incrementally, testing each phase before moving to the next.

