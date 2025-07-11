import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiExternalLink, 
  FiClock, 
  FiTrendingUp, 
  FiTrendingDown, 
  FiMinus,
  FiTarget,
  FiActivity
} from 'react-icons/fi';

const NewsCard = ({ news }) => {
  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return FiTrendingUp;
      case 'negative':
        return FiTrendingDown;
      default:
        return FiMinus;
    }
  };

  const getSentimentColor = (sentiment) => {
    console.debug('Getting sentiment color for:', sentiment);
    switch (sentiment) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-error';
      default:
        return 'text-textSecondary';
    }
  };

  const getSentimentBg = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-success';
      case 'negative':
        return 'bg-error';
      default:
        return 'bg-textSecondary';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      default:
        return 'text-success';
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ago`;
    } else {
      return `${minutes}m ago`;
    }
  };

  const SentimentIcon = getSentimentIcon(news.sentiment.label);
  const sentimentColor = getSentimentColor(news.sentiment.label);
  const sentimentBg = getSentimentBg(news.sentiment.label);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-surface border border-border rounded-lg p-6 hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text mb-2 line-clamp-2">
            {news.title}
          </h3>
          <p className="text-textSecondary text-sm mb-3 line-clamp-3">
            {news.summary}
          </p>
        </div>
        
        {/* Sentiment Score */}
        <div className="ml-4 flex flex-col items-center">
          <div className={`p-2 rounded-lg ${sentimentBg} bg-opacity-10 mb-1`}>
            <SentimentIcon className={`w-5 h-5 ${sentimentColor}`} />
          </div>
          <div className="text-xs text-center">
            <div className={`font-semibold ${sentimentColor}`}>
              {(news.sentiment.score * 100).toFixed(0)}
            </div>
            <div className="text-textSecondary">
              {(news.sentiment.confidence * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      {/* Symbols */}
      <div className="flex flex-wrap gap-2 mb-4">
        {news.symbols.map((symbol) => (
          <span
            key={symbol}
            className="px-2 py-1 bg-primary bg-opacity-10 text-primary text-xs rounded-full font-medium"
          >
            {symbol}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-textSecondary">
            <FiClock className="w-4 h-4" />
            {getTimeAgo(news.publishedAt)}
          </div>
          
          <div className="text-textSecondary">
            {news.source}
          </div>
          
          <div className={`flex items-center gap-1 ${getImpactColor(news.impact)}`}>
            <FiTarget className="w-4 h-4" />
            <span className="capitalize">{news.impact} Impact</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-background rounded text-xs text-textSecondary capitalize">
            {news.category.replace('_', ' ')}
          </span>
          
          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-textSecondary hover:text-primary hover:bg-primary hover:bg-opacity-10 rounded-lg transition-colors"
            title="Read full article"
          >
            <FiExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Sentiment Details */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-textSecondary">Sentiment: </span>
              <span className={`font-medium capitalize ${sentimentColor}`}>
                {news.sentiment.label}
              </span>
            </div>
            <div>
              <span className="text-textSecondary">Score: </span>
              <span className="font-medium text-text">
                {news.sentiment.score.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-textSecondary">Confidence: </span>
              <span className="font-medium text-text">
                {(news.sentiment.confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          
          {/* Sentiment Bar */}
          <div className="flex items-center gap-2">
            <div className="w-20 h-2 bg-border rounded-full overflow-hidden">
              <div
                className={`h-full ${sentimentBg} transition-all duration-300`}
                style={{ 
                  width: `${Math.abs(news.sentiment.score) * 100}%`,
                  marginLeft: news.sentiment.score < 0 ? `${(1 + news.sentiment.score) * 100}%` : '0'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsCard;
