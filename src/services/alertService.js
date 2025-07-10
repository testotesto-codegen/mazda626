// Alert Service - Handles alert management and notifications

class AlertService {
  constructor() {
    this.alerts = [];
    this.subscribers = [];
    this.isInitialized = false;
  }

  // Initialize the service
  async initialize() {
    if (this.isInitialized) return;
    
    // Load alerts from localStorage
    this.loadAlertsFromStorage();
    
    // Request notification permissions
    await this.requestNotificationPermission();
    
    // Start monitoring (in a real app, this would connect to WebSocket or polling)
    this.startMonitoring();
    
    this.isInitialized = true;
  }

  // Load alerts from localStorage
  loadAlertsFromStorage() {
    try {
      const stored = localStorage.getItem('user-alerts');
      if (stored) {
        this.alerts = JSON.parse(stored).map(alert => ({
          ...alert,
          createdAt: new Date(alert.createdAt)
        }));
      }
    } catch (error) {
      console.error('Failed to load alerts from storage:', error);
    }
  }

  // Save alerts to localStorage
  saveAlertsToStorage() {
    try {
      localStorage.setItem('user-alerts', JSON.stringify(this.alerts));
    } catch (error) {
      console.error('Failed to save alerts to storage:', error);
    }
  }

  // Request notification permission
  async requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  // Create a new alert
  createAlert(alertData) {
    const newAlert = {
      ...alertData,
      id: Date.now() + Math.random(),
      createdAt: new Date(),
      triggeredCount: 0,
      lastTriggered: null,
      isActive: alertData.isActive !== false
    };

    this.alerts.push(newAlert);
    this.saveAlertsToStorage();
    this.notifySubscribers('alertCreated', newAlert);
    
    return newAlert;
  }

  // Update an existing alert
  updateAlert(alertId, updates) {
    const index = this.alerts.findIndex(alert => alert.id === alertId);
    if (index === -1) return null;

    this.alerts[index] = { ...this.alerts[index], ...updates };
    this.saveAlertsToStorage();
    this.notifySubscribers('alertUpdated', this.alerts[index]);
    
    return this.alerts[index];
  }

  // Delete an alert
  deleteAlert(alertId) {
    const index = this.alerts.findIndex(alert => alert.id === alertId);
    if (index === -1) return false;

    const deletedAlert = this.alerts.splice(index, 1)[0];
    this.saveAlertsToStorage();
    this.notifySubscribers('alertDeleted', deletedAlert);
    
    return true;
  }

  // Get all alerts
  getAllAlerts() {
    return [...this.alerts];
  }

  // Get active alerts
  getActiveAlerts() {
    return this.alerts.filter(alert => alert.isActive);
  }

  // Toggle alert active status
  toggleAlert(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (!alert) return null;

    alert.isActive = !alert.isActive;
    this.saveAlertsToStorage();
    this.notifySubscribers('alertToggled', alert);
    
    return alert;
  }

  // Check if an alert should be triggered
  checkAlert(alert, marketData) {
    if (!alert.isActive) return false;

    switch (alert.type) {
      case 'price':
        return this.checkPriceAlert(alert, marketData);
      case 'volume':
        return this.checkVolumeAlert(alert, marketData);
      case 'news':
        return this.checkNewsAlert(alert, marketData);
      case 'earnings':
        return this.checkEarningsAlert(alert, marketData);
      default:
        return false;
    }
  }

  // Check price alert
  checkPriceAlert(alert, marketData) {
    const currentPrice = marketData[alert.symbol]?.price;
    if (!currentPrice) return false;

    if (alert.condition === 'above') {
      return currentPrice >= alert.value;
    } else if (alert.condition === 'below') {
      return currentPrice <= alert.value;
    }
    
    return false;
  }

  // Check volume alert
  checkVolumeAlert(alert, marketData) {
    const currentVolume = marketData[alert.symbol]?.volume;
    if (!currentVolume) return false;

    if (alert.condition === 'above') {
      return currentVolume >= alert.value;
    } else if (alert.condition === 'below') {
      return currentVolume <= alert.value;
    }
    
    return false;
  }

  // Check news alert
  checkNewsAlert(alert, marketData) {
    const newsData = marketData[alert.symbol]?.news;
    if (!newsData || !newsData.length) return false;

    // Check for recent news matching sentiment criteria
    const recentNews = newsData.filter(news => 
      new Date(news.publishedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );

    if (alert.condition === 'positive') {
      return recentNews.some(news => news.sentiment?.label === 'positive');
    } else if (alert.condition === 'negative') {
      return recentNews.some(news => news.sentiment?.label === 'negative');
    } else if (alert.condition === 'any') {
      return recentNews.length > 0;
    }
    
    return false;
  }

  // Check earnings alert
  checkEarningsAlert(alert, marketData) {
    const earningsData = marketData[alert.symbol]?.earnings;
    if (!earningsData) return false;

    // Check if there's an earnings announcement in the next 7 days
    const nextEarnings = new Date(earningsData.nextDate);
    const now = new Date();
    const daysDiff = (nextEarnings - now) / (1000 * 60 * 60 * 24);
    
    return daysDiff <= 7 && daysDiff >= 0;
  }

  // Trigger an alert
  triggerAlert(alert, data) {
    alert.triggeredCount++;
    alert.lastTriggered = new Date();
    
    this.saveAlertsToStorage();
    
    // Send notifications
    this.sendNotifications(alert, data);
    
    // Notify subscribers
    this.notifySubscribers('alertTriggered', { alert, data });
  }

  // Send notifications
  async sendNotifications(alert, data) {
    const message = this.formatAlertMessage(alert, data);
    
    // Push notification
    if (alert.notifications.includes('push')) {
      await this.sendPushNotification(alert, message);
    }
    
    // Email notification (would integrate with email service)
    if (alert.notifications.includes('email')) {
      await this.sendEmailNotification(alert, message);
    }
  }

  // Send push notification
  async sendPushNotification(alert, message) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Alert: ${alert.symbol}`, {
        body: message,
        icon: '/favicon.ico',
        tag: `alert-${alert.id}`,
        requireInteraction: true
      });
    }
  }

  // Send email notification (mock implementation)
  async sendEmailNotification(alert, message) {
    // In a real app, this would call an email service API
    console.log(`Email notification for ${alert.symbol}: ${message}`);
  }

  // Format alert message
  formatAlertMessage(alert, data) {
    switch (alert.type) {
      case 'price':
        return `${alert.symbol} price ${alert.condition} $${alert.value} (Current: $${data.currentPrice})`;
      case 'volume':
        return `${alert.symbol} volume ${alert.condition} ${(alert.value / 1000000).toFixed(1)}M (Current: ${(data.currentVolume / 1000000).toFixed(1)}M)`;
      case 'news':
        return `${alert.symbol} has ${alert.condition} news sentiment`;
      case 'earnings':
        return `${alert.symbol} earnings announcement approaching`;
      default:
        return `Alert triggered for ${alert.symbol}`;
    }
  }

  // Start monitoring (mock implementation)
  startMonitoring() {
    // In a real app, this would connect to a WebSocket or set up polling
    setInterval(() => {
      this.checkAllAlerts();
    }, 60000); // Check every minute
  }

  // Check all active alerts
  async checkAllAlerts() {
    const activeAlerts = this.getActiveAlerts();
    if (activeAlerts.length === 0) return;

    // Mock market data - in a real app, this would fetch from an API
    const marketData = await this.fetchMarketData(activeAlerts);
    
    for (const alert of activeAlerts) {
      if (this.checkAlert(alert, marketData)) {
        // Prevent spam by checking if alert was triggered recently
        const timeSinceLastTrigger = alert.lastTriggered 
          ? Date.now() - new Date(alert.lastTriggered).getTime()
          : Infinity;
        
        // Only trigger if it hasn't been triggered in the last hour
        if (timeSinceLastTrigger > 60 * 60 * 1000) {
          this.triggerAlert(alert, marketData[alert.symbol]);
        }
      }
    }
  }

  // Mock market data fetch
  async fetchMarketData(alerts) {
    // In a real app, this would fetch from a financial data API
    const symbols = [...new Set(alerts.map(alert => alert.symbol))];
    const data = {};
    
    for (const symbol of symbols) {
      data[symbol] = {
        price: Math.random() * 200 + 50,
        volume: Math.random() * 100000000 + 10000000,
        news: [],
        earnings: {
          nextDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000)
        }
      };
    }
    
    return data;
  }

  // Subscribe to alert events
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  // Notify subscribers
  notifySubscribers(event, data) {
    this.subscribers.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Error in alert subscriber:', error);
      }
    });
  }

  // Get alert statistics
  getStatistics() {
    const total = this.alerts.length;
    const active = this.alerts.filter(a => a.isActive).length;
    const triggered = this.alerts.reduce((sum, a) => sum + a.triggeredCount, 0);
    const byType = this.alerts.reduce((acc, alert) => {
      acc[alert.type] = (acc[alert.type] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      active,
      inactive: total - active,
      totalTriggered: triggered,
      byType
    };
  }
}

// Create singleton instance
const alertService = new AlertService();

export default alertService;

