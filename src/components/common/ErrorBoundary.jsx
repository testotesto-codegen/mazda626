import React from 'react';
import PropTypes from 'prop-types';
import ErrorFallback from './ErrorFallback';

/**
 * Error Boundary Component - Catches JavaScript errors in child components
 * and displays a fallback UI instead of crashing the entire application
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Log to external service if configured
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to analytics or error reporting service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false,
      });
    }
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
    
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback(
          this.state.error, 
          this.state.errorInfo, 
          this.handleReset
        );
      }

      // Default fallback UI
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
          title={this.props.title}
          message={this.props.message}
          showDetails={this.props.showDetails}
        />
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.func,
  onError: PropTypes.func,
  onReset: PropTypes.func,
  title: PropTypes.string,
  message: PropTypes.string,
  showDetails: PropTypes.bool,
};

ErrorBoundary.defaultProps = {
  fallback: null,
  onError: null,
  onReset: null,
  title: 'Something went wrong',
  message: 'An unexpected error occurred. Please try refreshing the page.',
  showDetails: process.env.NODE_ENV === 'development',
};

export default ErrorBoundary;

