import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiX, 
  FiTrendingUp, 
  FiTrendingDown, 
  FiVolume2, 
  FiBell, 
  FiCalendar,
  FiMail,
  FiSmartphone,
  FiSave
} from 'react-icons/fi';

const AlertCreator = ({ alert, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    type: 'price',
    symbol: '',
    condition: 'above',
    value: '',
    description: '',
    notifications: ['push'],
    isActive: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (alert) {
      setFormData({
        type: alert.type,
        symbol: alert.symbol,
        condition: alert.condition,
        value: alert.value || '',
        description: alert.description,
        notifications: alert.notifications,
        isActive: alert.isActive
      });
    }
  }, [alert]);

  const alertTypes = [
    { value: 'price', label: 'Price Alert', icon: FiTrendingUp },
    { value: 'volume', label: 'Volume Alert', icon: FiVolume2 },
    { value: 'news', label: 'News Alert', icon: FiBell },
    { value: 'earnings', label: 'Earnings Alert', icon: FiCalendar }
  ];

  const priceConditions = [
    { value: 'above', label: 'Above' },
    { value: 'below', label: 'Below' }
  ];

  const volumeConditions = [
    { value: 'above', label: 'Above' },
    { value: 'below', label: 'Below' }
  ];

  const newsConditions = [
    { value: 'positive', label: 'Positive Sentiment' },
    { value: 'negative', label: 'Negative Sentiment' },
    { value: 'any', label: 'Any News' }
  ];

  const getConditions = () => {
    switch (formData.type) {
      case 'price':
        return priceConditions;
      case 'volume':
        return volumeConditions;
      case 'news':
        return newsConditions.map(c => ({ value: c.value, label: c.label }));
      case 'earnings':
        return [{ value: 'announcement', label: 'Announcement' }];
      default:
        return [];
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.symbol.trim()) {
      newErrors.symbol = 'Symbol is required';
    }

    if (formData.type === 'price' || formData.type === 'volume') {
      if (!formData.value || isNaN(formData.value) || Number(formData.value) <= 0) {
        newErrors.value = 'Valid positive number is required';
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.notifications.length === 0) {
      newErrors.notifications = 'At least one notification method is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      console.log('Form validation failed:', errors);
      return;
    }

    const alertData = {
      ...formData,
      symbol: formData.symbol.toUpperCase(),
      value: formData.type === 'news' || formData.type === 'earnings' 
        ? formData.condition 
        : Number(formData.value)
    };

    onSave(alertData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNotificationToggle = (method) => {
    const newNotifications = formData.notifications.includes(method)
      ? formData.notifications.filter(n => n !== method)
      : [...formData.notifications, method];
    
    handleInputChange('notifications', newNotifications);
  };

  const getValueLabel = () => {
    switch (formData.type) {
      case 'price':
        return 'Price ($)';
      case 'volume':
        return 'Volume';
      case 'news':
        return 'Sentiment';
      case 'earnings':
        return 'Event';
      default:
        return 'Value';
    }
  };

  const shouldShowValueInput = () => {
    return formData.type === 'price' || formData.type === 'volume';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-surface border border-border rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text">
              {alert ? 'Edit Alert' : 'Create New Alert'}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 text-textSecondary hover:text-text hover:bg-background rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Alert Type */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Alert Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {alertTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleInputChange('type', type.value)}
                    className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                      formData.type === type.value
                        ? 'border-primary bg-primary bg-opacity-10 text-primary'
                        : 'border-border hover:border-primary hover:bg-primary hover:bg-opacity-5'
                    }`}
                  >
                    <type.icon className="w-4 h-4" />
                    <span className="text-sm">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Symbol */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Symbol
              </label>
              <input
                type="text"
                value={formData.symbol}
                onChange={(e) => handleInputChange('symbol', e.target.value)}
                placeholder="e.g., AAPL, TSLA, NVDA"
                className={`w-full px-3 py-2 bg-background border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.symbol ? 'border-error' : 'border-border'
                }`}
              />
              {errors.symbol && (
                <p className="text-error text-sm mt-1">{errors.symbol}</p>
              )}
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Condition
              </label>
              <select
                value={formData.condition}
                onChange={(e) => handleInputChange('condition', e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {getConditions().map((condition) => (
                  <option key={condition.value} value={condition.value}>
                    {condition.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Value */}
            {shouldShowValueInput() && (
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {getValueLabel()}
                </label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => handleInputChange('value', e.target.value)}
                  placeholder={formData.type === 'price' ? '150.00' : '1000000'}
                  step={formData.type === 'price' ? '0.01' : '1'}
                  className={`w-full px-3 py-2 bg-background border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.value ? 'border-error' : 'border-border'
                  }`}
                />
                {errors.value && (
                  <p className="text-error text-sm mt-1">{errors.value}</p>
                )}
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of this alert"
                className={`w-full px-3 py-2 bg-background border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.description ? 'border-error' : 'border-border'
                }`}
              />
              {errors.description && (
                <p className="text-error text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Notification Methods */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Notification Methods
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notifications.includes('push')}
                    onChange={() => handleNotificationToggle('push')}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                  />
                  <FiSmartphone className="w-4 h-4 text-textSecondary" />
                  <span className="text-text">Push Notification</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notifications.includes('email')}
                    onChange={() => handleNotificationToggle('email')}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                  />
                  <FiMail className="w-4 h-4 text-textSecondary" />
                  <span className="text-text">Email</span>
                </label>
              </div>
              {errors.notifications && (
                <p className="text-error text-sm mt-1">{errors.notifications}</p>
              )}
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text">Active</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary peer-focus:ring-opacity-25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2 text-textSecondary border border-border rounded-lg hover:bg-background transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
              >
                <FiSave className="w-4 h-4" />
                {alert ? 'Update' : 'Create'} Alert
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AlertCreator;
