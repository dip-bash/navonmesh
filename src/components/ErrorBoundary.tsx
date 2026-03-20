
import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component to catch React rendering errors
 * Provides graceful error UI instead of blank page on crash
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-white flex flex-col items-center justify-center p-8 z-[999]">
          <div className="max-w-md text-center">
            <h1 className="font-serif text-4xl italic mb-4">Oops!</h1>
            <p className="font-sans text-base mb-6">Something went wrong while rendering the page.</p>
            
            <details className="mb-6 text-left">
              <summary className="font-sans text-sm uppercase tracking-widest font-bold cursor-pointer hover:opacity-60 transition-opacity">
                Error Details
              </summary>
              <pre className="mt-3 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-40 text-red-700">
                {this.state.error?.toString()}
              </pre>
            </details>

            <button
              onClick={() => window.location.reload()}
              className="bg-black text-white font-sans text-sm uppercase font-bold tracking-widest px-6 py-3 rounded-full shadow-lg active:scale-90 transition-transform"
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

export default ErrorBoundary;
