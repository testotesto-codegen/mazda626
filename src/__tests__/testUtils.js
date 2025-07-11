/**
 * Test Utilities
 * Common utilities and helpers for testing
 */

import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { AuthProvider } from '../features/auth/hooks/useAuth';

/**
 * Create a test store with initial state
 * @param {Object} initialState - Initial store state
 * @returns {Object} Configured test store
 */
export const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      // Add your reducers here
      auth: (state = { user: null, isAuthenticated: false }, action) => state,
      // Add other reducers as needed
    },
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

/**
 * Test wrapper component with providers
 * @param {Object} props - Component props
 * @returns {JSX.Element} Wrapper component
 */
const TestWrapper = ({ children, initialState = {}, store = null }) => {
  const testStore = store || createTestStore(initialState);

  return (
    <Provider store={testStore}>
      <BrowserRouter>
        <AuthProvider>
          {children}
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  );
};

/**
 * Custom render function with providers
 * @param {JSX.Element} ui - Component to render
 * @param {Object} options - Render options
 * @returns {Object} Render result
 */
export const renderWithProviders = (ui, options = {}) => {
  const {
    initialState = {},
    store = null,
    ...renderOptions
  } = options;

  const Wrapper = ({ children }) => (
    <TestWrapper initialState={initialState} store={store}>
      {children}
    </TestWrapper>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

/**
 * Mock API response
 * @param {*} data - Response data
 * @param {number} status - HTTP status code
 * @param {number} delay - Response delay in ms
 * @returns {Promise} Mock response promise
 */
export const mockApiResponse = (data, status = 200, delay = 0) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (status >= 200 && status < 300) {
        resolve({ data, status });
      } else {
        reject({ 
          response: { data, status },
          message: `HTTP ${status} Error`
        });
      }
    }, delay);
  });
};

/**
 * Mock user data
 */
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  roles: ['user'],
  permissions: ['read', 'write'],
  isEmailVerified: true,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
};

/**
 * Mock authentication state
 */
export const mockAuthState = {
  user: mockUser,
  isAuthenticated: true,
  isLoading: false,
  error: null
};

/**
 * Mock market data
 */
export const mockMarketData = {
  symbol: 'AAPL',
  price: 150.25,
  change: 2.50,
  changePercent: 0.0169,
  volume: 1000000,
  marketCap: 2500000000,
  timestamp: '2023-01-01T16:00:00.000Z'
};

/**
 * Mock portfolio data
 */
export const mockPortfolioData = {
  id: '1',
  name: 'My Portfolio',
  totalValue: 10000,
  totalGain: 500,
  totalGainPercent: 0.05,
  holdings: [
    {
      symbol: 'AAPL',
      shares: 10,
      averagePrice: 145.00,
      currentPrice: 150.25,
      totalValue: 1502.50,
      gain: 52.50,
      gainPercent: 0.0362
    }
  ]
};

/**
 * Mock chart data
 */
export const mockChartData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(2023, 0, i + 1).toISOString(),
  value: 100 + Math.random() * 50,
  volume: Math.floor(Math.random() * 1000000)
}));

/**
 * Wait for async operations
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Wait promise
 */
export const waitFor = (ms = 0) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Mock localStorage
 */
export const mockLocalStorage = (() => {
  let store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }
  };
})();

/**
 * Mock sessionStorage
 */
export const mockSessionStorage = (() => {
  let store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }
  };
})();

/**
 * Mock window.matchMedia
 */
export const mockMatchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => {},
});

/**
 * Mock IntersectionObserver
 */
export const mockIntersectionObserver = class {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

/**
 * Mock ResizeObserver
 */
export const mockResizeObserver = class {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

/**
 * Setup test environment
 */
export const setupTestEnvironment = () => {
  // Mock localStorage
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage
  });

  // Mock sessionStorage
  Object.defineProperty(window, 'sessionStorage', {
    value: mockSessionStorage
  });

  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(mockMatchMedia),
  });

  // Mock IntersectionObserver
  global.IntersectionObserver = mockIntersectionObserver;

  // Mock ResizeObserver
  global.ResizeObserver = mockResizeObserver;

  // Mock console methods in tests
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
};

/**
 * Cleanup test environment
 */
export const cleanupTestEnvironment = () => {
  mockLocalStorage.clear();
  mockSessionStorage.clear();
  jest.clearAllMocks();
};

/**
 * Custom matchers for testing
 */
export const customMatchers = {
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },

  toHaveBeenCalledWithError(received, errorMessage) {
    const pass = received.mock.calls.some(call => 
      call.some(arg => 
        arg instanceof Error && arg.message.includes(errorMessage)
      )
    );

    if (pass) {
      return {
        message: () =>
          `expected function not to have been called with error containing "${errorMessage}"`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected function to have been called with error containing "${errorMessage}"`,
        pass: false,
      };
    }
  }
};

export default {
  createTestStore,
  renderWithProviders,
  mockApiResponse,
  mockUser,
  mockAuthState,
  mockMarketData,
  mockPortfolioData,
  mockChartData,
  waitFor,
  mockLocalStorage,
  mockSessionStorage,
  mockMatchMedia,
  mockIntersectionObserver,
  mockResizeObserver,
  setupTestEnvironment,
  cleanupTestEnvironment,
  customMatchers
};

