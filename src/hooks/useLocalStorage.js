import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for localStorage with React state synchronization
 * Provides type-safe localStorage operations with automatic serialization
 */
export const useLocalStorage = (key, initialValue, options = {}) => {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    syncAcrossTabs = true,
    onError = null,
  } = options;

  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window === 'undefined') {
        return initialValue;
      }

      const item = window.localStorage.getItem(key);
      return item ? deserialize(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      if (onError) onError(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        if (valueToStore === undefined) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, serialize(valueToStore));
        }
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
      if (onError) onError(error);
    }
  }, [key, serialize, storedValue, onError]);

  // Remove the item from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(undefined);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
      if (onError) onError(error);
    }
  }, [key, onError]);

  // Listen for changes to this localStorage key from other tabs/windows
  useEffect(() => {
    if (!syncAcrossTabs || typeof window === 'undefined') {
      return;
    }

    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== serialize(storedValue)) {
        try {
          setStoredValue(e.newValue ? deserialize(e.newValue) : initialValue);
        } catch (error) {
          console.warn(`Error syncing localStorage key "${key}" across tabs:`, error);
          if (onError) onError(error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, storedValue, initialValue, serialize, deserialize, syncAcrossTabs, onError]);

  return [storedValue, setValue, removeValue];
};

/**
 * Hook for storing objects in localStorage with automatic JSON serialization
 */
export const useLocalStorageObject = (key, initialValue = {}, options = {}) => {
  return useLocalStorage(key, initialValue, {
    serialize: JSON.stringify,
    deserialize: JSON.parse,
    ...options,
  });
};

/**
 * Hook for storing arrays in localStorage with automatic JSON serialization
 */
export const useLocalStorageArray = (key, initialValue = [], options = {}) => {
  return useLocalStorage(key, initialValue, {
    serialize: JSON.stringify,
    deserialize: JSON.parse,
    ...options,
  });
};

/**
 * Hook for storing strings in localStorage (no serialization)
 */
export const useLocalStorageString = (key, initialValue = '', options = {}) => {
  return useLocalStorage(key, initialValue, {
    serialize: (value) => value,
    deserialize: (value) => value,
    ...options,
  });
};

/**
 * Hook for storing numbers in localStorage
 */
export const useLocalStorageNumber = (key, initialValue = 0, options = {}) => {
  return useLocalStorage(key, initialValue, {
    serialize: (value) => value.toString(),
    deserialize: (value) => parseFloat(value),
    ...options,
  });
};

/**
 * Hook for storing booleans in localStorage
 */
export const useLocalStorageBoolean = (key, initialValue = false, options = {}) => {
  return useLocalStorage(key, initialValue, {
    serialize: (value) => value.toString(),
    deserialize: (value) => value === 'true',
    ...options,
  });
};

/**
 * Hook for managing user preferences in localStorage
 */
export const useUserPreferences = (defaultPreferences = {}) => {
  const [preferences, setPreferences, removePreferences] = useLocalStorageObject(
    'userPreferences',
    defaultPreferences
  );

  const updatePreference = useCallback((key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  }, [setPreferences]);

  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences);
  }, [setPreferences, defaultPreferences]);

  const getPreference = useCallback((key, fallback = null) => {
    return preferences[key] !== undefined ? preferences[key] : fallback;
  }, [preferences]);

  return {
    preferences,
    updatePreference,
    resetPreferences,
    removePreferences,
    getPreference,
  };
};

/**
 * Hook for managing recently viewed items
 */
export const useRecentItems = (key = 'recentItems', maxItems = 10) => {
  const [recentItems, setRecentItems] = useLocalStorageArray(key, []);

  const addRecentItem = useCallback((item) => {
    setRecentItems(prev => {
      // Remove item if it already exists
      const filtered = prev.filter(existing => existing.id !== item.id);
      
      // Add to beginning and limit to maxItems
      return [item, ...filtered].slice(0, maxItems);
    });
  }, [setRecentItems, maxItems]);

  const removeRecentItem = useCallback((itemId) => {
    setRecentItems(prev => prev.filter(item => item.id !== itemId));
  }, [setRecentItems]);

  const clearRecentItems = useCallback(() => {
    setRecentItems([]);
  }, [setRecentItems]);

  return {
    recentItems,
    addRecentItem,
    removeRecentItem,
    clearRecentItems,
  };
};

/**
 * Hook for managing form data persistence
 */
export const usePersistedForm = (formKey, initialFormData = {}) => {
  const [formData, setFormData] = useLocalStorageObject(`form_${formKey}`, initialFormData);

  const updateFormData = useCallback((updates) => {
    setFormData(prev => ({
      ...prev,
      ...updates,
    }));
  }, [setFormData]);

  const updateField = useCallback((fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value,
    }));
  }, [setFormData]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
  }, [setFormData, initialFormData]);

  const clearForm = useCallback(() => {
    setFormData({});
  }, [setFormData]);

  return {
    formData,
    updateFormData,
    updateField,
    resetForm,
    clearForm,
  };
};

/**
 * Hook for managing localStorage with expiration
 */
export const useLocalStorageWithExpiry = (key, initialValue, expiryTime = 24 * 60 * 60 * 1000) => {
  const [value, setValue] = useState(() => {
    try {
      if (typeof window === 'undefined') {
        return initialValue;
      }

      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;

      const parsedItem = JSON.parse(item);
      
      // Check if item has expired
      if (parsedItem.expiry && Date.now() > parsedItem.expiry) {
        window.localStorage.removeItem(key);
        return initialValue;
      }

      return parsedItem.value;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValueWithExpiry = useCallback((newValue) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);

      if (typeof window !== 'undefined') {
        const item = {
          value: valueToStore,
          expiry: Date.now() + expiryTime,
        };
        window.localStorage.setItem(key, JSON.stringify(item));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, value, expiryTime]);

  const removeValue = useCallback(() => {
    setValue(initialValue);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
  }, [key, initialValue]);

  return [value, setValueWithExpiry, removeValue];
};

export default useLocalStorage;

