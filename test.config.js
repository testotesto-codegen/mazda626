/**
 * Test Configuration File
 * 🧪 Configuration settings for testing environment
 */

export const testConfig = {
  // Test environment settings
  environment: {
    name: 'test',
    debug: true,
    verbose: true,
    mockApi: true,
  },

  // Test data settings
  data: {
    useFixtures: true,
    seedData: true,
    resetBetweenTests: true,
  },

  // Performance testing
  performance: {
    enableMetrics: true,
    slowTestThreshold: 1000, // ms
    memoryLeakDetection: true,
  },

  // UI testing
  ui: {
    screenshotOnFailure: true,
    highlightElements: true,
    slowMotion: false,
  },

  // API testing
  api: {
    baseUrl: 'http://localhost:3001',
    timeout: 5000,
    retries: 3,
    mockResponses: {
      '/api/users': { users: [] },
      '/api/dashboard': { widgets: [], metrics: {} },
    },
  },

  // Test reporting
  reporting: {
    format: 'json',
    outputDir: './test-results',
    includeScreenshots: true,
    generateHtml: true,
  },

  // Feature flags for testing
  features: {
    newDashboard: true,
    betaFeatures: true,
    experimentalCharts: false,
  },

  // Test utilities
  utils: {
    autoCleanup: true,
    logLevel: 'debug',
    preserveLogs: true,
  },
};

// Export individual sections for convenience
export const { environment, data, performance, ui, api, reporting, features, utils } = testConfig;

// Helper functions for test configuration
export const isTestMode = () => testConfig.environment.name === 'test';
export const shouldMockApi = () => testConfig.environment.mockApi;
export const getApiBaseUrl = () => testConfig.api.baseUrl;

// Test environment validation
export const validateTestConfig = () => {
  const required = ['environment.name', 'api.baseUrl'];
  const missing = required.filter(path => {
    const keys = path.split('.');
    let current = testConfig;
    for (const key of keys) {
      if (!current[key]) return true;
      current = current[key];
    }
    return false;
  });

  if (missing.length > 0) {
    throw new Error(`Missing required test config: ${missing.join(', ')}`);
  }

  return true;
};

// Initialize test configuration
console.log('🧪 Test configuration loaded');
console.log(`Environment: ${testConfig.environment.name}`);
console.log(`API Base URL: ${testConfig.api.baseUrl}`);

export default testConfig;

