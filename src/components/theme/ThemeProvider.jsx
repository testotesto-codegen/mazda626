import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const themes = {
  light: {
    name: 'light',
    colors: {
      primary: '#3B82F6',
      secondary: '#6B7280',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      text: '#111827',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      accent: '#8B5CF6'
    }
  },
  dark: {
    name: 'dark',
    colors: {
      primary: '#60A5FA',
      secondary: '#9CA3AF',
      background: '#111827',
      surface: '#1F2937',
      text: '#F9FAFB',
      textSecondary: '#D1D5DB',
      border: '#374151',
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      accent: '#A78BFA'
    }
  },
  cyberpunk: {
    name: 'cyberpunk',
    colors: {
      primary: '#00FFFF',
      secondary: '#FF00FF',
      background: '#0A0A0A',
      surface: '#1A1A2E',
      text: '#00FFFF',
      textSecondary: '#FF00FF',
      border: '#16213E',
      success: '#00FF41',
      warning: '#FFD700',
      error: '#FF073A',
      accent: '#FF1493'
    }
  },
  ocean: {
    name: 'ocean',
    colors: {
      primary: '#0EA5E9',
      secondary: '#0284C7',
      background: '#F0F9FF',
      surface: '#E0F2FE',
      text: '#0C4A6E',
      textSecondary: '#0369A1',
      border: '#BAE6FD',
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
      accent: '#7C3AED'
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [fontSize, setFontSize] = useState('medium');
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('app-theme') || 'light';
    const savedFontSize = localStorage.getItem('app-font-size') || 'medium';
    const savedHighContrast = localStorage.getItem('app-high-contrast') === 'true';
    
    setCurrentTheme(savedTheme);
    setFontSize(savedFontSize);
    setHighContrast(savedHighContrast);
  }, []);

  useEffect(() => {
    // Apply theme to document
    const theme = themes[currentTheme];
    const root = document.documentElement;
    
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Apply font size
    const fontSizes = {
      small: '14px',
      medium: '16px',
      large: '18px',
      xlarge: '20px'
    };
    root.style.setProperty('--base-font-size', fontSizes[fontSize]);

    // Apply high contrast if enabled
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply dark class for Tailwind
    if (currentTheme === 'dark' || currentTheme === 'cyberpunk') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Save to localStorage
    localStorage.setItem('app-theme', currentTheme);
    localStorage.setItem('app-font-size', fontSize);
    localStorage.setItem('app-high-contrast', highContrast.toString());
  }, [currentTheme, fontSize, highContrast]);

  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  const changeFontSize = (size) => {
    setFontSize(size);
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
  };

  const value = {
    currentTheme,
    theme: themes[currentTheme],
    themes: Object.keys(themes),
    changeTheme,
    fontSize,
    changeFontSize,
    highContrast,
    toggleHighContrast
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

