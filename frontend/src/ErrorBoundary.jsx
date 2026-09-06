import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[React Error Boundary]:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#090d16',
          color: '#f8fafc',
          padding: '3rem 2rem',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            background: '#141e30',
            border: '1px solid #f43f5e',
            borderRadius: '16px',
            padding: '2rem'
          }}>
            <h2 style={{ color: '#f43f5e', marginBottom: '1rem' }}>
              ⚠️ Application Render Error Caught
            </h2>
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
              {this.state.error?.message || 'Unknown render error occurred'}
            </p>
            <pre style={{
              background: '#090d16',
              padding: '1rem',
              borderRadius: '8px',
              color: '#fda4af',
              fontSize: '13px',
              overflow: 'auto',
              maxHeight: '300px'
            }}>
              {this.state.error?.stack}
            </pre>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '1.5rem',
                background: '#10b981',
                color: '#ffffff',
                padding: '0.6rem 1.5rem',
                borderRadius: '9999px',
                fontWeight: 'bold',
                cursor: 'pointer',
                border: 'none'
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
