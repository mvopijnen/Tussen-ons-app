import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error captured by ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[var(--bg-main)] text-[var(--text-primary)]">
          <div className="max-w-md w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] p-8 rounded-3xl shadow-xl">
            <h2 className="text-xl font-bold mb-3">Oeps, er ging iets mis</h2>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              We hebben een onverwacht probleem opgemerkt. Klik op de knop hieronder om de app opnieuw te laden.
            </p>
            <button
              onClick={() => {
                window.location.reload();
              }}
              className="w-full py-3 px-6 rounded-2xl font-medium text-white transition-transform active:scale-95 cursor-pointer shadow-md"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              App opnieuw laden
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
