import React from 'react';
import ReactDOM from 'react-dom/client';
import { NotificationProvider } from './context/NotificationContext';
import { AuctionProvider } from './context/AuctionContext';
import { ErrorBoundary } from './ErrorBoundary';
import App from './App';

// Global error handlers
window.addEventListener('error', (e) => {
  console.error('[Global Error]:', e.error || e.message);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('[Unhandled Promise Rejection]:', e.reason);
});

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <NotificationProvider>
          <AuctionProvider>
            <App />
          </AuctionProvider>
        </NotificationProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
} else {
  console.error('Root element #root not found in document!');
}
