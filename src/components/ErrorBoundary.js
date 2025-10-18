import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            textAlign: 'center',
            maxWidth: '500px'
          }}>
            <h2 style={{ color: '#ef4444', marginBottom: '16px' }}>Something went wrong</h2>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>
              We're sorry for the inconvenience. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#4f46e5',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
