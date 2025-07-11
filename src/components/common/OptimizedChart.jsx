import React, { memo, useMemo, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Optimized Chart Component
 * Implements performance optimizations for financial chart rendering
 * Uses React.memo, useMemo, and useCallback to prevent unnecessary re-renders
 */
const OptimizedChart = memo(({
  data,
  type = 'line',
  width = 400,
  height = 300,
  colors = ['#3B82F6'],
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  animate = true,
  onDataPointClick,
  onChartReady,
  className = '',
  ...chartProps
}) => {
  const chartRef = useRef(null);
  const resizeObserverRef = useRef(null);

  // Memoize processed data to avoid recalculation on every render
  const processedData = useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return [];
    }

    // Process and validate data
    return data.map((item, index) => ({
      ...item,
      id: item.id || index,
      x: item.x || item.date || index,
      y: typeof item.y === 'number' ? item.y : parseFloat(item.value || 0)
    })).filter(item => !isNaN(item.y));
  }, [data]);

  // Memoize chart configuration
  const chartConfig = useMemo(() => ({
    type,
    data: processedData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: animate ? {
        duration: 750,
        easing: 'easeInOutQuart'
      } : false,
      plugins: {
        legend: {
          display: showLegend,
          position: 'top'
        },
        tooltip: {
          enabled: showTooltip,
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: colors[0],
          borderWidth: 1
        }
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: showGrid,
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        y: {
          display: true,
          grid: {
            display: showGrid,
            color: 'rgba(0, 0, 0, 0.1)'
          }
        }
      },
      elements: {
        point: {
          radius: type === 'line' ? 2 : 4,
          hoverRadius: 6
        },
        line: {
          borderWidth: 2,
          tension: 0.1
        }
      },
      ...chartProps
    }
  }), [type, processedData, animate, showLegend, showTooltip, showGrid, colors, chartProps]);

  // Optimized click handler
  const handleDataPointClick = useCallback((event, elements) => {
    if (onDataPointClick && elements.length > 0) {
      const element = elements[0];
      const dataPoint = processedData[element.index];
      onDataPointClick(dataPoint, element.index, event);
    }
  }, [onDataPointClick, processedData]);

  // Optimized resize handler
  const handleResize = useCallback(() => {
    if (chartRef.current && chartRef.current.resize) {
      chartRef.current.resize();
    }
  }, []);

  // Set up resize observer for responsive behavior
  useEffect(() => {
    const chartElement = chartRef.current?.canvas?.parentElement;
    
    if (chartElement && window.ResizeObserver) {
      resizeObserverRef.current = new ResizeObserver(handleResize);
      resizeObserverRef.current.observe(chartElement);
    }

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [handleResize]);

  // Notify parent when chart is ready
  useEffect(() => {
    if (onChartReady && chartRef.current) {
      onChartReady(chartRef.current);
    }
  }, [onChartReady]);

  // Render different chart types
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart
            ref={chartRef}
            data={chartConfig.data}
            options={chartConfig.options}
            onClick={handleDataPointClick}
            width={width}
            height={height}
          />
        );
      case 'bar':
        return (
          <BarChart
            ref={chartRef}
            data={chartConfig.data}
            options={chartConfig.options}
            onClick={handleDataPointClick}
            width={width}
            height={height}
          />
        );
      case 'candlestick':
        return (
          <CandlestickChart
            ref={chartRef}
            data={chartConfig.data}
            options={chartConfig.options}
            onClick={handleDataPointClick}
            width={width}
            height={height}
          />
        );
      case 'area':
        return (
          <AreaChart
            ref={chartRef}
            data={chartConfig.data}
            options={chartConfig.options}
            onClick={handleDataPointClick}
            width={width}
            height={height}
          />
        );
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            Unsupported chart type: {type}
          </div>
        );
    }
  };

  // Show loading state for empty data
  if (!processedData.length) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width, height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-500 text-sm">Loading chart data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {renderChart()}
    </div>
  );
});

// Mock chart components (in a real app, these would be from Chart.js, Recharts, etc.)
const LineChart = memo(({ data, options, onClick, width, height }) => (
  <div 
    className="w-full h-full bg-white border rounded-lg flex items-center justify-center cursor-pointer"
    onClick={onClick}
    style={{ width, height }}
  >
    <div className="text-center">
      <div className="text-blue-600 mb-2">📈</div>
      <p className="text-sm text-gray-600">Line Chart</p>
      <p className="text-xs text-gray-400">{data.length} data points</p>
    </div>
  </div>
));

const BarChart = memo(({ data, options, onClick, width, height }) => (
  <div 
    className="w-full h-full bg-white border rounded-lg flex items-center justify-center cursor-pointer"
    onClick={onClick}
    style={{ width, height }}
  >
    <div className="text-center">
      <div className="text-green-600 mb-2">📊</div>
      <p className="text-sm text-gray-600">Bar Chart</p>
      <p className="text-xs text-gray-400">{data.length} data points</p>
    </div>
  </div>
));

const CandlestickChart = memo(({ data, options, onClick, width, height }) => (
  <div 
    className="w-full h-full bg-white border rounded-lg flex items-center justify-center cursor-pointer"
    onClick={onClick}
    style={{ width, height }}
  >
    <div className="text-center">
      <div className="text-red-600 mb-2">🕯️</div>
      <p className="text-sm text-gray-600">Candlestick Chart</p>
      <p className="text-xs text-gray-400">{data.length} data points</p>
    </div>
  </div>
));

const AreaChart = memo(({ data, options, onClick, width, height }) => (
  <div 
    className="w-full h-full bg-white border rounded-lg flex items-center justify-center cursor-pointer"
    onClick={onClick}
    style={{ width, height }}
  >
    <div className="text-center">
      <div className="text-purple-600 mb-2">📈</div>
      <p className="text-sm text-gray-600">Area Chart</p>
      <p className="text-xs text-gray-400">{data.length} data points</p>
    </div>
  </div>
));

OptimizedChart.propTypes = {
  /** Chart data array */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  /** Chart type */
  type: PropTypes.oneOf(['line', 'bar', 'candlestick', 'area']),
  /** Chart width */
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** Chart height */
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** Chart colors */
  colors: PropTypes.arrayOf(PropTypes.string),
  /** Show grid lines */
  showGrid: PropTypes.bool,
  /** Show tooltip on hover */
  showTooltip: PropTypes.bool,
  /** Show legend */
  showLegend: PropTypes.bool,
  /** Enable animations */
  animate: PropTypes.bool,
  /** Data point click handler */
  onDataPointClick: PropTypes.func,
  /** Chart ready callback */
  onChartReady: PropTypes.func,
  /** Additional CSS classes */
  className: PropTypes.string
};

OptimizedChart.defaultProps = {
  type: 'line',
  width: 400,
  height: 300,
  colors: ['#3B82F6'],
  showGrid: true,
  showTooltip: true,
  showLegend: true,
  animate: true,
  className: ''
};

OptimizedChart.displayName = 'OptimizedChart';

export default OptimizedChart;

