/**
 * Performance Optimization Utilities
 * Provides memoization, debouncing, throttling, and performance monitoring tools
 */

/**
 * Simple memoization utility with configurable cache size
 * @param {Function} fn - Function to memoize
 * @param {number} maxCacheSize - Maximum cache size (default: 100)
 * @returns {Function} Memoized function
 */
export const memoize = (fn, maxCacheSize = 100) => {
  const cache = new Map();
  
  return function memoized(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn.apply(this, args);
    
    // Manage cache size
    if (cache.size >= maxCacheSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    cache.set(key, result);
    return result;
  };
};

/**
 * Debounce utility to limit function execution frequency
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @param {boolean} immediate - Execute immediately on first call
 * @returns {Function} Debounced function
 */
export const debounce = (fn, delay, immediate = false) => {
  let timeoutId;
  let lastCallTime = 0;
  
  return function debounced(...args) {
    const callNow = immediate && !timeoutId;
    
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate) {
        fn.apply(this, args);
      }
    }, delay);
    
    if (callNow) {
      fn.apply(this, args);
    }
    
    lastCallTime = Date.now();
  };
};

/**
 * Throttle utility to limit function execution rate
 * @param {Function} fn - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (fn, limit) => {
  let inThrottle;
  let lastFunc;
  let lastRan;
  
  return function throttled(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      lastRan = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if ((Date.now() - lastRan) >= limit) {
          fn.apply(this, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

/**
 * Performance monitoring utility
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.isEnabled = typeof performance !== 'undefined';
  }

  /**
   * Start timing a performance metric
   * @param {string} name - Metric name
   */
  startTiming(name) {
    if (!this.isEnabled) return;
    
    this.metrics.set(name, {
      startTime: performance.now(),
      endTime: null,
      duration: null
    });
  }

  /**
   * End timing a performance metric
   * @param {string} name - Metric name
   * @returns {number|null} Duration in milliseconds
   */
  endTiming(name) {
    if (!this.isEnabled || !this.metrics.has(name)) return null;
    
    const metric = this.metrics.get(name);
    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;
    
    return metric.duration;
  }

  /**
   * Get timing for a metric
   * @param {string} name - Metric name
   * @returns {Object|null} Metric data
   */
  getTiming(name) {
    return this.metrics.get(name) || null;
  }

  /**
   * Get all metrics
   * @returns {Object} All metrics data
   */
  getAllMetrics() {
    const result = {};
    this.metrics.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  /**
   * Clear all metrics
   */
  clearMetrics() {
    this.metrics.clear();
  }

  /**
   * Measure function execution time
   * @param {Function} fn - Function to measure
   * @param {string} name - Metric name
   * @returns {Function} Wrapped function that measures performance
   */
  measureFunction(fn, name) {
    return (...args) => {
      this.startTiming(name);
      const result = fn.apply(this, args);
      
      if (result instanceof Promise) {
        return result.finally(() => {
          this.endTiming(name);
        });
      } else {
        this.endTiming(name);
        return result;
      }
    };
  }
}

/**
 * Global performance monitor instance
 */
export const performanceMonitor = new PerformanceMonitor();

/**
 * React-specific performance utilities
 */

/**
 * Higher-order component for performance monitoring
 * @param {React.Component} WrappedComponent - Component to wrap
 * @param {string} componentName - Name for performance tracking
 * @returns {React.Component} Enhanced component
 */
export const withPerformanceMonitoring = (WrappedComponent, componentName) => {
  return class PerformanceWrapper extends React.Component {
    componentDidMount() {
      performanceMonitor.startTiming(`${componentName}_mount`);
    }

    componentDidUpdate() {
      performanceMonitor.endTiming(`${componentName}_mount`);
      performanceMonitor.startTiming(`${componentName}_update`);
    }

    componentWillUnmount() {
      performanceMonitor.endTiming(`${componentName}_update`);
    }

    render() {
      return React.createElement(WrappedComponent, this.props);
    }
  };
};

/**
 * Custom React hook for debounced values
 * @param {any} value - Value to debounce
 * @param {number} delay - Debounce delay
 * @returns {any} Debounced value
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom React hook for throttled values
 * @param {any} value - Value to throttle
 * @param {number} limit - Throttle limit
 * @returns {any} Throttled value
 */
export const useThrottle = (value, limit) => {
  const [throttledValue, setThrottledValue] = React.useState(value);
  const lastRan = React.useRef(Date.now());

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
};

/**
 * Lazy loading utility for components
 * @param {Function} importFn - Dynamic import function
 * @param {React.Component} fallback - Loading fallback component
 * @returns {React.Component} Lazy-loaded component
 */
export const createLazyComponent = (importFn, fallback = null) => {
  const LazyComponent = React.lazy(importFn);
  
  return (props) => (
    React.createElement(
      React.Suspense,
      { fallback: fallback || React.createElement('div', null, 'Loading...') },
      React.createElement(LazyComponent, props)
    )
  );
};

/**
 * Image lazy loading utility
 * @param {string} src - Image source
 * @param {Object} options - Intersection observer options
 * @returns {Object} Lazy loading state and ref
 */
export const useLazyImage = (src, options = {}) => {
  const [imageSrc, setImageSrc] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const imgRef = React.useRef();

  React.useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        ...options
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [src, options]);

  const handleLoad = React.useCallback(() => {
    setIsLoaded(true);
  }, []);

  return {
    imgRef,
    imageSrc,
    isLoaded,
    handleLoad
  };
};

/**
 * Virtual scrolling utility for large lists
 * @param {Array} items - List items
 * @param {number} itemHeight - Height of each item
 * @param {number} containerHeight - Height of container
 * @returns {Object} Virtual scrolling data
 */
export const useVirtualScroll = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + 1, items.length);
  
  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;
  const totalHeight = items.length * itemHeight;

  const handleScroll = React.useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return {
    visibleItems,
    offsetY,
    totalHeight,
    handleScroll,
    startIndex,
    endIndex
  };
};

/**
 * Memory usage monitoring (for development)
 */
export const getMemoryUsage = () => {
  if (typeof performance !== 'undefined' && performance.memory) {
    return {
      used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
      total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) // MB
    };
  }
  return null;
};

/**
 * Bundle size analyzer helper
 * @param {string} chunkName - Chunk name to analyze
 */
export const analyzeChunkSize = (chunkName) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Analyzing chunk: ${chunkName}`);
    // Implementation would depend on bundler (Webpack, Vite, etc.)
  }
};

