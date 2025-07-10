import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiBell, 
  FiPlus, 
  FiEdit3, 
  FiTrash2, 
  FiTrendingUp, 
  FiTrendingDown,
  FiVolume2,
  FiCalendar,
  FiMail,
  FiSmartphone,
  FiToggleLeft,
  FiToggleRight,
  FiFilter
} from 'react-icons/fi';
import AlertCard from '../components/alerts/AlertCard';
import AlertCreator from '../components/alerts/AlertCreator';

const AlertsManager = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'price',
      symbol: 'AAPL',
      condition: 'above',
      value: 180,
      currentValue: 175.50,
      isActive: true,
      notifications: ['push', 'email'],
      createdAt: new Date('2024-01-15'),
      triggeredCount: 0,
      description: 'Apple stock price alert'
    },
    {
      id: 2,
      type: 'volume',
      symbol: 'TSLA',
      condition: 'above',
      value: 50000000,
      currentValue: 35000000,
      isActive: true,
      notifications: ['push'],
      createdAt: new Date('2024-01-10'),
      triggeredCount: 3,
      description: 'Tesla volume spike alert'
    },
    {
      id: 3,
      type: 'news',
      symbol: 'NVDA',
      condition: 'sentiment',
      value: 'positive',
      isActive: false,
      notifications: ['email'],
      createdAt: new Date('2024-01-08'),
      triggeredCount: 12,
      description: 'NVIDIA positive news sentiment'
    },
    {
      id: 4,
      type: 'earnings',
      symbol: 'MSFT',
      condition: 'announcement',
      value: null,
      isActive: true,
      notifications: ['push', 'email'],
      createdAt: new Date('2024-01-05'),
      triggeredCount: 1,
      description: 'Microsoft earnings announcement'
    }
  ]);

  const [showCreator, setShowCreator] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, inactive
  const [sortBy, setSortBy] = useState('created'); // created, symbol, triggered

  const alertTypes = [
    { value: 'price', label: 'Price Alert', icon: FiTrendingUp, color: 'text-primary' },
    { value: 'volume', label: 'Volume Alert', icon: FiVolume2, color: 'text-success' },
    { value: 'news', label: 'News Alert', icon: FiBell, color: 'text-warning' },
    { value: 'earnings', label: 'Earnings Alert', icon: FiCalendar, color: 'text-accent' }
  ];

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'active') return alert.isActive;
    if (filter === 'inactive') return !alert.isActive;
    return true;
  });

  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    switch (sortBy) {
      case 'symbol':
        return a.symbol.localeCompare(b.symbol);
      case 'triggered':
        return b.triggeredCount - a.triggeredCount;
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const handleCreateAlert = (alertData) => {
    const newAlert = {
      ...alertData,
      id: Date.now(),
      createdAt: new Date(),
      triggeredCount: 0,
      currentValue: Math.random() * 200 // Mock current value
    };
    setAlerts([newAlert, ...alerts]);
    setShowCreator(false);
  };

  const handleEditAlert = (alertData) => {
    setAlerts(alerts.map(alert => 
      alert.id === editingAlert.id ? { ...alert, ...alertData } : alert
    ));
    setEditingAlert(null);
  };

  const handleDeleteAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const handleToggleAlert = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  const getAlertStats = () => {
    const total = alerts.length;
    const active = alerts.filter(a => a.isActive).length;
    const triggered = alerts.reduce((sum, a) => sum + a.triggeredCount, 0);
    
    return { total, active, triggered };
  };

  const stats = getAlertStats();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-text mb-2">Smart Alerts</h1>
              <p className="text-textSecondary">
                Stay informed with intelligent market notifications
              </p>
            </div>
            <button
              onClick={() => setShowCreator(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Create Alert
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary bg-opacity-10 rounded-lg">
                  <FiBell className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-text">{stats.total}</div>
                  <div className="text-sm text-textSecondary">Total Alerts</div>
                </div>
              </div>
            </div>
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success bg-opacity-10 rounded-lg">
                  <FiToggleRight className="w-5 h-5 text-success" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-text">{stats.active}</div>
                  <div className="text-sm text-textSecondary">Active Alerts</div>
                </div>
              </div>
            </div>
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning bg-opacity-10 rounded-lg">
                  <FiTrendingUp className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-text">{stats.triggered}</div>
                  <div className="text-sm text-textSecondary">Times Triggered</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters and Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex flex-wrap items-center gap-4 p-4 bg-surface border border-border rounded-lg">
            <div className="flex items-center gap-2">
              <FiFilter className="w-4 h-4 text-textSecondary" />
              <span className="text-sm text-textSecondary">Filter:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-1 bg-background border border-border rounded text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Alerts</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-textSecondary">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 bg-background border border-border rounded text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="created">Date Created</option>
                <option value="symbol">Symbol</option>
                <option value="triggered">Times Triggered</option>
              </select>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-textSecondary">Quick Actions:</span>
              <button className="px-3 py-1 text-sm text-primary hover:bg-primary hover:bg-opacity-10 rounded transition-colors">
                Enable All
              </button>
              <button className="px-3 py-1 text-sm text-textSecondary hover:bg-textSecondary hover:bg-opacity-10 rounded transition-colors">
                Disable All
              </button>
            </div>
          </div>
        </motion.div>

        {/* Alert Types Legend */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex flex-wrap gap-4 p-4 bg-surface border border-border rounded-lg">
            {alertTypes.map((type) => (
              <div key={type.value} className="flex items-center gap-2">
                <type.icon className={`w-4 h-4 ${type.color}`} />
                <span className="text-sm text-text">{type.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Alerts List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <AnimatePresence>
            {sortedAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onEdit={() => setEditingAlert(alert)}
                onDelete={() => handleDeleteAlert(alert.id)}
                onToggle={() => handleToggleAlert(alert.id)}
              />
            ))}
          </AnimatePresence>

          {sortedAlerts.length === 0 && (
            <div className="text-center py-12">
              <FiBell className="w-12 h-12 text-textSecondary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text mb-2">No alerts found</h3>
              <p className="text-textSecondary mb-4">
                {filter === 'all' 
                  ? "Create your first alert to get started" 
                  : `No ${filter} alerts found`}
              </p>
              <button
                onClick={() => setShowCreator(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Create Alert
              </button>
            </div>
          )}
        </motion.div>

        {/* Alert Creator Modal */}
        <AnimatePresence>
          {(showCreator || editingAlert) && (
            <AlertCreator
              alert={editingAlert}
              onSave={editingAlert ? handleEditAlert : handleCreateAlert}
              onCancel={() => {
                setShowCreator(false);
                setEditingAlert(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AlertsManager;

