// Usage:
// import ErrorBoundary from './ErrorBoundary';
// <ErrorBoundary><YourComponent /></ErrorBoundary>

import React, { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Optionally log error to a service
    // console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { hasError, error } = this.state;
    const isDev = process.env.NODE_ENV === 'development';

    if (hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 px-4">
          <div className="mb-6">
            <img src="/logo.svg" alt="App Logo" className="w-16 h-16 mx-auto" onError={e => (e.currentTarget.style.display = 'none')} />
          </div>
          <h1 className="text-2xl font-bold text-[#00296b] mb-2">Oops! Something went wrong.</h1>
          <p className="text-md text-gray-700 mb-6 text-center max-w-xl">
            Sorry, an unexpected error occurred. Please try again or return to the homepage.
          </p>
          {isDev && error && (
            <pre className="bg-red-100 text-red-800 p-4 rounded mb-4 max-w-xl overflow-x-auto text-sm">
              {error.message}
              {'\n'}
              {error.stack}
            </pre>
          )}
          <div className="flex gap-4 mb-8">
            <button
              onClick={this.handleReset}
              className="bg-[#00296b] text-white px-6 py-2 rounded shadow hover:bg-[#003580] transition"
            >
              Try Again
            </button>
            <a
              href="/"
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded shadow hover:bg-gray-300 transition"
            >
              Go Home
            </a>
          </div>
          <p className="mt-4 text-xs text-gray-400 text-center">If the problem persists, contact support.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary; 