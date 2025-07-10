import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiVolume2, 
  FiBell, 
  FiCalendar,
  FiEdit3,
  FiTrash2,
  FiToggleLeft,
  FiToggleRight,
  FiMail,
  FiSmartphone,
  FiClock
} from 'react-icons/fi';

const AlertCard = ({ alert, onEdit, onDelete, onToggle }) => {
  const getAlertIcon = (type) => {
    switch (type) {
      case 'price':
        return alert.condition === 'above' ? FiTrendingUp : FiTrendingDown;
      case 'volume':
        return FiVolume2;
      case 'news':
        return FiBell;
      case 'earnings':
        return FiCalendar;
      default:
        return FiBell;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'price':
        return 'text-primary';
      case 'volume':
        return 'text-success';
      case 'news':
        return 'text-warning';
      case 'earnings':
        return 'text-accent';
      default:
        return 'text-textSecondary';
    }
  };

  const getConditionText = () => {
    switch (alert.type) {
      case 'price':
        return `${alert.condition} $${alert.value}`;
      case 'volume':
        return `${alert.condition} ${(alert.value / 1000000).toFixed(1)}M`;
      case 'news':
        return `${alert.value} sentiment`;
      case 'earnings':
        return 'announcement';
      default:
        return alert.condition;
    }
  };

  const getCurrentStatus = () => {
    if (alert.type === 'price' && alert.currentValue) {
      const diff = alert.currentValue - alert.value;
      const isTriggered = alert.condition === 'above' ? diff >= 0 : diff <= 0;
      return {
        text: `Current: $${alert.currentValue}`,
        triggered: isTriggered,
        diff: Math.abs(diff)
      };
    }
    return null;
  };

  const status = getCurrentStatus();
  const AlertIcon = getAlertIcon(alert.type);
  const alertColor = getAlertColor(alert.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-surface border rounded-lg p-4 hover:shadow-lg transition-all ${
        alert.isActive ? 'border-border' : 'border-border opacity-60'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          {/* Alert Icon */}
          <div className={`p-2 rounded-lg bg-opacity-10 ${alertColor.replace('text-', 'bg-')}`}>
            <AlertIcon className={`w-5 h-5 ${alertColor}`} />
          </div>

          {/* Alert Details */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-text">{alert.symbol}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                alert.isActive 
                  ? 'bg-success bg-opacity-10 text-success' 
                  : 'bg-textSecondary bg-opacity-10 text-textSecondary'
              }`}>
                {alert.isActive ? 'Active' : 'Inactive'}
              </span>
              {status?.triggered && (
                <span className="px-2 py-1 text-xs rounded-full bg-warning bg-opacity-10 text-warning">
                  Triggered
                </span>
              )}
            </div>

            <p className="text-textSecondary mb-2">{alert.description}</p>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-textSecondary">Condition:</span>
                <span className="text-text font-medium">{getConditionText()}</span>
              </div>
              
              {status && (
                <div className="flex items-center gap-1">
                  <span className="text-textSecondary">Status:</span>
                  <span className={`font-medium ${
                    status.triggered ? 'text-warning' : 'text-text'
                  }`}>
                    {status.text}
                  </span>
                </div>
              )}
            </div>

            {/* Notification Methods */}
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-textSecondary">Notifications:</span>
              {alert.notifications.includes('push') && (
                <div className="flex items-center gap-1 px-2 py-1 bg-primary bg-opacity-10 rounded text-xs text-primary">
                  <FiSmartphone className="w-3 h-3" />
                  Push
                </div>
              )}
              {alert.notifications.includes('email') && (
                <div className="flex items-center gap-1 px-2 py-1 bg-secondary bg-opacity-10 rounded text-xs text-secondary">
                  <FiMail className="w-3 h-3" />
                  Email
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 mt-3 text-xs text-textSecondary">
              <div className="flex items-center gap-1">
                <FiClock className="w-3 h-3" />
                Created {alert.createdAt.toLocaleDateString()}
              </div>
              <div>
                Triggered {alert.triggeredCount} times
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggle}
            className={`p-2 rounded-lg transition-colors ${
              alert.isActive
                ? 'text-success hover:bg-success hover:bg-opacity-10'
                : 'text-textSecondary hover:bg-textSecondary hover:bg-opacity-10'
            }`}
            title={alert.isActive ? 'Disable alert' : 'Enable alert'}
          >
            {alert.isActive ? <FiToggleRight className="w-5 h-5" /> : <FiToggleLeft className="w-5 h-5" />}
          </button>
          
          <button
            onClick={onEdit}
            className="p-2 text-textSecondary hover:text-primary hover:bg-primary hover:bg-opacity-10 rounded-lg transition-colors"
            title="Edit alert"
          >
            <FiEdit3 className="w-4 h-4" />
          </button>
          
          <button
            onClick={onDelete}
            className="p-2 text-textSecondary hover:text-error hover:bg-error hover:bg-opacity-10 rounded-lg transition-colors"
            title="Delete alert"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AlertCard;

