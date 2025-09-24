'use client'
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // Here you could send to Sentry, LogRocket, etc.
      console.error('Global Error Boundary - Production error:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server'
      });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="d-flex flex-column align-items-center justify-content-center p-5" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <AlertTriangle 
              className="text-warning mb-3" 
              size={64}
              aria-hidden="true"
            />
            <h2 className="h4 mb-3">¡Oops! Algo salió mal</h2>
            <p className="text-muted mb-4">
              Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
            </p>
            
            <div className="d-flex gap-3 justify-content-center">
              <button 
                className="btn btn-primary"
                onClick={this.handleRetry}
                aria-label="Reintentar"
              >
                <RefreshCw className="me-2" size={16} />
                Reintentar
              </button>
              
              <button 
                className="btn btn-outline-secondary"
                onClick={() => window.location.reload()}
                aria-label="Recargar página"
              >
                Recargar página
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-start">
                <summary className="btn btn-sm btn-outline-danger">
                  Ver detalles del error (desarrollo)
                </summary>
                <div className="mt-2 p-3 bg-light rounded">
                  <pre className="small text-danger mb-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </pre>
                  <pre className="small text-muted">
                    <strong>Stack:</strong> {this.state.error.stack}
                  </pre>
                  {this.state.errorInfo && (
                    <pre className="small text-muted">
                      <strong>Component Stack:</strong> {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
