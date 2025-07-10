// News Service - Handles news fetching and sentiment analysis

class NewsService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.isInitialized = false;
  }

  // Initialize the service
  async initialize() {
    if (this.isInitialized) return;
    
    // Set up cache cleanup
    setInterval(() => {
      this.cleanupCache();
    }, this.cacheTimeout);
    
    this.isInitialized = true;
  }

  // Clean up expired cache entries
  cleanupCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.cacheTimeout) {
        this.cache.delete(key);
      }
    }
  }

  // Get cached data or fetch new data
  async getCachedOrFetch(key, fetchFunction) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const data = await fetchFunction();
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });

    return data;
  }

  // Fetch news for specific symbols
  async fetchNews(symbols = [], options = {}) {
    const {
      limit = 50,
      timeframe = '24h',
      category = 'all',
      sentiment = 'all'
    } = options;

    const cacheKey = `news-${symbols.join(',')}-${limit}-${timeframe}-${category}-${sentiment}`;
    
    return this.getCachedOrFetch(cacheKey, async () => {
      // Mock news data - in a real app, this would fetch from news APIs
      return this.generateMockNews(symbols, { limit, timeframe, category, sentiment });
    });
  }

  // Generate mock news data
  generateMockNews(symbols, options) {
    const { limit, timeframe } = options;
    
    const newsTemplates = [
      {
        titleTemplate: "{symbol} Reports {metric} Earnings, {direction} Expectations",
        summaryTemplate: "{symbol} Inc. reported quarterly earnings that {performance} analyst expectations, driven by {factor}.",
        category: 'earnings',
        sentimentBias: 0.3
      },
      {
        titleTemplate: "{symbol} Faces {challenge} in {region}",
        summaryTemplate: "{symbol}'s {region} operations are experiencing {issue}, potentially affecting {impact}.",
        category: 'operations',
        sentimentBias: -0.4
      },
      {
        titleTemplate: "{symbol} Announces {partnership_type} with {partner}",
        summaryTemplate: "{symbol} announces new {partnership_type} to expand {capability} across {market}.",
        category: 'partnerships',
        sentimentBias: 0.5
      },
      {
        titleTemplate: "{symbol} Stock {movement} on {news_type} News",
        summaryTemplate: "Shares of {symbol} {movement_detail} following {news_detail}.",
        category: 'market',
        sentimentBias: 0.1
      },
      {
        titleTemplate: "Analysts {action} {symbol} Price Target to ${target}",
        summaryTemplate: "Wall Street analysts {action_detail} their price target for {symbol} citing {reason}.",
        category: 'analyst',
        sentimentBias: 0.2
      }
    ];

    const sources = ['Reuters', 'Bloomberg', 'Wall Street Journal', 'CNBC', 'MarketWatch', 'TechCrunch', 'Financial Times'];
    
    const replacements = {
      symbol: symbols.length > 0 ? symbols : ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL', 'AMZN'],
      metric: ['Record', 'Strong', 'Disappointing', 'Mixed', 'Solid'],
      direction: ['Beats', 'Misses', 'Meets', 'Exceeds'],
      performance: ['exceeded', 'missed', 'met', 'fell short of'],
      factor: ['strong iPhone sales', 'services revenue growth', 'cloud adoption', 'AI demand', 'supply chain improvements'],
      challenge: ['Production Challenges', 'Regulatory Scrutiny', 'Supply Chain Issues', 'Competition Pressure'],
      region: ['Shanghai Factory', 'European Operations', 'Asian Markets', 'North American Division'],
      issue: ['production delays', 'supply chain disruptions', 'regulatory challenges', 'increased competition'],
      impact: ['Q4 delivery targets', 'annual guidance', 'market share', 'profit margins'],
      partnership_type: ['Strategic Partnership', 'Joint Venture', 'Acquisition Deal', 'Technology Alliance'],
      partner: ['Major Cloud Providers', 'Tech Giants', 'Automotive Companies', 'Healthcare Systems'],
      capability: ['AI computing capabilities', 'market reach', 'product offerings', 'technological capabilities'],
      market: ['major cloud platforms', 'emerging markets', 'enterprise sector', 'consumer segment'],
      movement: ['Surges', 'Drops', 'Rallies', 'Declines', 'Jumps'],
      movement_detail: ['surged 3%', 'dropped 2%', 'rallied strongly', 'declined modestly', 'jumped 5%'],
      news_type: ['Earnings', 'Partnership', 'Regulatory', 'Product Launch'],
      news_detail: ['better than expected earnings', 'major partnership announcement', 'regulatory approval', 'new product launch'],
      action: ['Raise', 'Lower', 'Maintain', 'Upgrade'],
      action_detail: ['raised', 'lowered', 'maintained', 'upgraded'],
      target: ['180', '200', '150', '250', '300'],
      reason: ['strong fundamentals', 'market expansion', 'competitive advantages', 'growth prospects']
    };

    const news = [];
    const timeframeHours = this.getTimeframeHours(timeframe);
    
    for (let i = 0; i < limit; i++) {
      const template = newsTemplates[Math.floor(Math.random() * newsTemplates.length)];
      const symbol = this.getRandomItem(replacements.symbol);
      
      // Generate title and summary
      let title = template.titleTemplate;
      let summary = template.summaryTemplate;
      
      // Replace placeholders
      Object.entries(replacements).forEach(([key, values]) => {
        const placeholder = `{${key}}`;
        if (title.includes(placeholder)) {
          title = title.replace(placeholder, this.getRandomItem(values));
        }
        if (summary.includes(placeholder)) {
          summary = summary.replace(placeholder, this.getRandomItem(values));
        }
      });

      // Generate sentiment
      const baseSentiment = template.sentimentBias + (Math.random() - 0.5) * 0.6;
      const sentiment = this.generateSentiment(baseSentiment);

      // Generate publish time
      const publishedAt = new Date(Date.now() - Math.random() * timeframeHours * 60 * 60 * 1000);

      news.push({
        id: Date.now() + i,
        title,
        summary,
        source: this.getRandomItem(sources),
        publishedAt,
        url: `https://example.com/news/${Date.now() + i}`,
        sentiment,
        symbols: [symbol],
        impact: this.getRandomItem(['high', 'medium', 'low']),
        category: template.category
      });
    }

    return news.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  }

  // Generate sentiment analysis
  generateSentiment(baseSentiment) {
    const score = Math.max(-1, Math.min(1, baseSentiment));
    const confidence = 0.7 + Math.random() * 0.3; // 70-100% confidence
    
    let label;
    if (score > 0.2) {
      label = 'positive';
    } else if (score < -0.2) {
      label = 'negative';
    } else {
      label = 'neutral';
    }

    return {
      score: parseFloat(score.toFixed(2)),
      label,
      confidence: parseFloat(confidence.toFixed(2))
    };
  }

  // Get timeframe in hours
  getTimeframeHours(timeframe) {
    switch (timeframe) {
      case '1h': return 1;
      case '24h': return 24;
      case '7d': return 24 * 7;
      case '30d': return 24 * 30;
      default: return 24;
    }
  }

  // Get random item from array
  getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Analyze sentiment for custom text
  async analyzeSentiment(text) {
    // Mock sentiment analysis - in a real app, this would use an AI service
    const words = text.toLowerCase().split(/\s+/);
    
    const positiveWords = ['good', 'great', 'excellent', 'positive', 'strong', 'growth', 'profit', 'success', 'beat', 'exceed'];
    const negativeWords = ['bad', 'poor', 'negative', 'weak', 'loss', 'decline', 'miss', 'fail', 'drop', 'fall'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) positiveCount++;
      if (negativeWords.includes(word)) negativeCount++;
    });
    
    const totalSentimentWords = positiveCount + negativeCount;
    let score = 0;
    
    if (totalSentimentWords > 0) {
      score = (positiveCount - negativeCount) / totalSentimentWords;
    }
    
    const confidence = Math.min(0.9, totalSentimentWords / words.length * 5);
    
    return this.generateSentiment(score * confidence);
  }

  // Get trending topics
  async getTrendingTopics(timeframe = '24h') {
    const cacheKey = `trending-${timeframe}`;
    
    return this.getCachedOrFetch(cacheKey, async () => {
      // Mock trending topics
      const topics = [
        { topic: 'Earnings Season', count: 45, sentiment: 0.3 },
        { topic: 'AI Technology', count: 38, sentiment: 0.6 },
        { topic: 'Federal Reserve', count: 32, sentiment: -0.1 },
        { topic: 'Electric Vehicles', count: 28, sentiment: 0.4 },
        { topic: 'Cryptocurrency', count: 25, sentiment: -0.2 },
        { topic: 'Supply Chain', count: 22, sentiment: -0.3 },
        { topic: 'Cloud Computing', count: 20, sentiment: 0.5 },
        { topic: 'Renewable Energy', count: 18, sentiment: 0.4 }
      ];
      
      return topics.sort((a, b) => b.count - a.count);
    });
  }

  // Get news summary for a symbol
  async getSymbolSummary(symbol, timeframe = '24h') {
    const news = await this.fetchNews([symbol], { timeframe, limit: 20 });
    
    if (news.length === 0) {
      return {
        symbol,
        totalArticles: 0,
        avgSentiment: 0,
        sentimentLabel: 'neutral',
        topCategories: [],
        recentHeadlines: []
      };
    }

    const avgSentiment = news.reduce((sum, article) => sum + article.sentiment.score, 0) / news.length;
    const sentimentLabel = avgSentiment > 0.2 ? 'positive' : avgSentiment < -0.2 ? 'negative' : 'neutral';
    
    const categories = news.reduce((acc, article) => {
      acc[article.category] = (acc[article.category] || 0) + 1;
      return acc;
    }, {});
    
    const topCategories = Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category, count]) => ({ category, count }));

    return {
      symbol,
      totalArticles: news.length,
      avgSentiment: parseFloat(avgSentiment.toFixed(2)),
      sentimentLabel,
      topCategories,
      recentHeadlines: news.slice(0, 5).map(article => ({
        title: article.title,
        sentiment: article.sentiment,
        publishedAt: article.publishedAt
      }))
    };
  }

  // Search news
  async searchNews(query, options = {}) {
    const { limit = 20, timeframe = '7d' } = options;
    const cacheKey = `search-${query}-${limit}-${timeframe}`;
    
    return this.getCachedOrFetch(cacheKey, async () => {
      // Mock search - in a real app, this would search through news APIs
      const allNews = await this.fetchNews([], { limit: 100, timeframe });
      
      const searchTerms = query.toLowerCase().split(/\s+/);
      const results = allNews.filter(article => {
        const searchText = `${article.title} ${article.summary}`.toLowerCase();
        return searchTerms.some(term => searchText.includes(term));
      });
      
      return results.slice(0, limit);
    });
  }

  // Get market sentiment overview
  async getMarketSentiment(timeframe = '24h') {
    const cacheKey = `market-sentiment-${timeframe}`;
    
    return this.getCachedOrFetch(cacheKey, async () => {
      const news = await this.fetchNews([], { limit: 100, timeframe });
      
      if (news.length === 0) {
        return {
          overall: 0,
          positive: 0,
          negative: 0,
          neutral: 0,
          totalArticles: 0
        };
      }

      const sentiments = news.map(article => article.sentiment.score);
      const overall = sentiments.reduce((sum, score) => sum + score, 0) / sentiments.length;
      
      const positive = news.filter(article => article.sentiment.label === 'positive').length;
      const negative = news.filter(article => article.sentiment.label === 'negative').length;
      const neutral = news.filter(article => article.sentiment.label === 'neutral').length;

      return {
        overall: parseFloat(overall.toFixed(2)),
        positive: parseFloat((positive / news.length * 100).toFixed(1)),
        negative: parseFloat((negative / news.length * 100).toFixed(1)),
        neutral: parseFloat((neutral / news.length * 100).toFixed(1)),
        totalArticles: news.length
      };
    });
  }
}

// Create singleton instance
const newsService = new NewsService();

export default newsService;

