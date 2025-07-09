/**
 * Test Helper Utilities
 * 🧪 This file contains utilities for testing purposes
 */

export const testConfig = {
  isTestMode: true,
  testStartTime: new Date().toISOString(),
  testId: `test-${Date.now()}`,
};

/**
 * Log test information to console
 * @param {string} message - Test message
 * @param {string} type - Type of test log (info, warn, error)
 */
export const testLog = (message, type = 'info') => {
  const timestamp = new Date().toLocaleTimeString();
  const prefix = '🧪 TEST';
  
  switch (type) {
    case 'warn':
      console.warn(`${prefix} [${timestamp}] ⚠️ ${message}`);
      break;
    case 'error':
      console.error(`${prefix} [${timestamp}] ❌ ${message}`);
      break;
    default:
      console.log(`${prefix} [${timestamp}] ℹ️ ${message}`);
  }
};

/**
 * Generate test data for components
 * @param {string} type - Type of test data needed
 * @returns {Object} Test data object
 */
export const generateTestData = (type) => {
  const testData = {
    user: {
      id: 'test-user-123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'tester',
    },
    dashboard: {
      widgets: [
        { id: 1, title: 'Test Widget 1', type: 'chart' },
        { id: 2, title: 'Test Widget 2', type: 'table' },
      ],
      metrics: {
        totalUsers: 1234,
        activeUsers: 567,
        revenue: 89012,
      },
    },
    api: {
      baseUrl: 'https://api.test.example.com',
      timeout: 5000,
      retries: 3,
    },
  };

  return testData[type] || testData;
};

/**
 * Mock API response for testing
 * @param {Object} data - Data to return
 * @param {number} delay - Delay in milliseconds
 * @returns {Promise} Promise that resolves with mock data
 */
export const mockApiResponse = (data, delay = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      testLog(`Mock API response returned: ${JSON.stringify(data).substring(0, 100)}...`);
      resolve(data);
    }, delay);
  });
};

/**
 * Test performance measurement
 * @param {string} label - Label for the performance test
 * @param {Function} fn - Function to measure
 * @returns {Promise} Promise that resolves with the result and timing
 */
export const measurePerformance = async (label, fn) => {
  const startTime = performance.now();
  testLog(`Starting performance test: ${label}`);
  
  try {
    const result = await fn();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    testLog(`Performance test completed: ${label} took ${duration.toFixed(2)}ms`);
    return { result, duration };
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    testLog(`Performance test failed: ${label} failed after ${duration.toFixed(2)}ms`, 'error');
    throw error;
  }
};

// Initialize test mode
testLog('Test helpers loaded successfully');
testLog(`Test session started: ${testConfig.testId}`);

