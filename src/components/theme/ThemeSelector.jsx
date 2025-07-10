import React, { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { 
  FiSun, 
  FiMoon, 
  FiMonitor, 
  FiSettings, 
  FiEye,
  FiType,
  FiPalette
} from 'react-icons/fi';

const ThemeSelector = () => {
  const { 
    currentTheme, 
    themes, 
    changeTheme, 
    fontSize, 
    changeFontSize,
    highContrast,
    toggleHighContrast
  } = useTheme();
  
  const [isOpen, setIsOpen] = useState(false);

  const themeIcons = {
    light: <FiSun className="w-4 h-4" />,
    dark: <FiMoon className="w-4 h-4" />,
    cyberpunk: <FiMonitor className="w-4 h-4" />,
    ocean: <FiPalette className="w-4 h-4" />
  };

  const themeLabels = {
    light: 'Light',
    dark: 'Dark',
    cyberpunk: 'Cyberpunk',
    ocean: 'Ocean'
  };

  const fontSizeLabels = {
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    xlarge: 'Extra Large'
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface border border-border hover:bg-opacity-80 transition-colors"
        aria-label="Theme settings"
      >
        <FiSettings className="w-4 h-4" />
        <span className="hidden sm:inline">Theme</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-surface border border-border rounded-lg shadow-lg z-50 p-4">
            <h3 className="text-lg font-semibold text-text mb-4">Appearance Settings</h3>
            
            {/* Theme Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-textSecondary mb-2">
                Color Theme
              </label>
              <div className="grid grid-cols-2 gap-2">
                {themes.map((theme) => (
                  <button
                    key={theme}
                    onClick={() => changeTheme(theme)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                      currentTheme === theme
                        ? 'border-primary bg-primary bg-opacity-10 text-primary'
                        : 'border-border hover:border-primary hover:bg-primary hover:bg-opacity-5'
                    }`}
                  >
                    {themeIcons[theme]}
                    <span className="text-sm">{themeLabels[theme]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-textSecondary mb-2">
                <FiType className="inline w-4 h-4 mr-1" />
                Font Size
              </label>
              <select
                value={fontSize}
                onChange={(e) => changeFontSize(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {Object.entries(fontSizeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Accessibility Options */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-textSecondary mb-2">
                <FiEye className="inline w-4 h-4 mr-1" />
                Accessibility
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={toggleHighContrast}
                  className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                />
                <span className="text-sm text-text">High Contrast Mode</span>
              </label>
            </div>

            {/* Theme Preview */}
            <div className="border border-border rounded-lg p-3">
              <div className="text-xs text-textSecondary mb-2">Preview</div>
              <div className="space-y-2">
                <div className="h-2 bg-primary rounded"></div>
                <div className="h-2 bg-secondary rounded w-3/4"></div>
                <div className="h-2 bg-accent rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;

