import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FiTrendingUp, FiShield, FiActivity, FiTarget } from 'react-icons/fi';

const RiskMetrics = () => {
  const riskData = {
    sharpeRatio: 1.85,
    beta: 1.12,
    volatility: 18.5,
    maxDrawdown: -12.3,
    var95: -2.8, // Value at Risk 95%
    riskScore: 65 // Out of 100
  };

  const riskMetrics = [
    {
      title: 'Sharpe Ratio',
      value: riskData.sharpeRatio.toFixed(2),
      description: 'Risk-adjusted return',
      icon: FiTrendingUp,
      color: riskData.sharpeRatio > 1.5 ? 'text-success' : riskData.sharpeRatio > 1 ? 'text-warning' : 'text-error',
      bgColor: riskData.sharpeRatio > 1.5 ? 'bg-success' : riskData.sharpeRatio > 1 ? 'bg-warning' : 'bg-error'
    },
    {
      title: 'Beta',
      value: riskData.beta.toFixed(2),
      description: 'Market sensitivity',
      icon: FiActivity,
      color: Math.abs(riskData.beta - 1) < 0.2 ? 'text-success' : 'text-warning',
      bgColor: Math.abs(riskData.beta - 1) < 0.2 ? 'bg-success' : 'bg-warning'
    },
    {
      title: 'Volatility',
      value: `${riskData.volatility.toFixed(1)}%`,
      description: 'Price fluctuation',
      icon: FiTarget,
      color: riskData.volatility < 15 ? 'text-success' : riskData.volatility < 25 ? 'text-warning' : 'text-error',
      bgColor: riskData.volatility < 15 ? 'bg-success' : riskData.volatility < 25 ? 'bg-warning' : 'bg-error'
    },
    {
      title: 'Max Drawdown',
      value: `${riskData.maxDrawdown.toFixed(1)}%`,
      description: 'Largest loss',
      icon: FiShield,
      color: riskData.maxDrawdown > -10 ? 'text-success' : riskData.maxDrawdown > -20 ? 'text-warning' : 'text-error',
      bgColor: riskData.maxDrawdown > -10 ? 'bg-success' : riskData.maxDrawdown > -20 ? 'bg-warning' : 'bg-error'
    }
  ];

  const getRiskLevel = (score) => {
    if (score < 30) return { level: 'Low', color: 'text-success' };
    if (score < 70) return { level: 'Moderate', color: 'text-warning' };
    return { level: 'High', color: 'text-error' };
  };

  const riskLevel = getRiskLevel(riskData.riskScore);

  return (
    <div className="space-y-6">
      {/* Risk Score Circle */}
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 mb-3">
          <CircularProgressbar
            value={riskData.riskScore}
            text={`${riskData.riskScore}`}
            styles={buildStyles({
              textSize: '20px',
              pathColor: riskLevel.color.includes('success') ? '#10B981' : 
                        riskLevel.color.includes('warning') ? '#F59E0B' : '#EF4444',
              textColor: 'var(--color-text)',
              trailColor: 'var(--color-border)',
              backgroundColor: 'var(--color-surface)',
            })}
          />
        </div>
        <div className="text-center">
          <div className={`text-sm font-semibold ${riskLevel.color}`}>
            {riskLevel.level} Risk
          </div>
          <div className="text-xs text-textSecondary">Risk Score</div>
        </div>
      </div>

      {/* Risk Metrics */}
      <div className="space-y-3">
        {riskMetrics.map((metric, index) => (
          <div key={metric.title} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${metric.bgColor} bg-opacity-10`}>
                <metric.icon className={`w-4 h-4 ${metric.color}`} />
              </div>
              <div>
                <div className="text-sm font-medium text-text">{metric.title}</div>
                <div className="text-xs text-textSecondary">{metric.description}</div>
              </div>
            </div>
            <div className={`text-sm font-semibold ${metric.color}`}>
              {metric.value}
            </div>
          </div>
        ))}
      </div>

      {/* VaR */}
      <div className="p-3 bg-background rounded-lg border border-border">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-text">Value at Risk (95%)</div>
            <div className="text-xs text-textSecondary">Potential 1-day loss</div>
          </div>
          <div className="text-sm font-semibold text-error">
            {riskData.var95.toFixed(1)}%
          </div>
        </div>
        <div className="mt-2 text-xs text-textSecondary">
          95% confidence that daily loss won't exceed {Math.abs(riskData.var95)}%
        </div>
      </div>

      {/* Risk Interpretation */}
      <div className="p-3 bg-primary bg-opacity-5 rounded-lg border border-primary border-opacity-20">
        <div className="text-xs text-primary font-medium mb-1">Risk Assessment</div>
        <div className="text-xs text-textSecondary">
          Your portfolio shows {riskLevel.level.toLowerCase()} risk characteristics with 
          {riskData.sharpeRatio > 1.5 ? ' excellent' : riskData.sharpeRatio > 1 ? ' good' : ' poor'} risk-adjusted returns.
        </div>
      </div>
    </div>
  );
};

export default RiskMetrics;

