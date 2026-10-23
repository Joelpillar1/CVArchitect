import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ScrollToTop from './components/ScrollToTop';
import { captureAttribution } from './utils/attribution';
import {
  HydrationProvider,
  hasPrerenderedMarkup,
  shouldHydrate,
} from './contexts/HydrationContext';

// Record the referrer before React touches the URL, so AI referrals are not
// lost to client-side navigation.
captureAttribution();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const hydrate = hasPrerenderedMarkup() && shouldHydrate(window.location.pathname);

const app = (
  <React.StrictMode>
    <HydrationProvider value={hydrate}>
      <HelmetProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AuthProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </AuthProvider>
        </BrowserRouter>
      </HelmetProvider>
    </HydrationProvider>
  </React.StrictMode>
);

declare global {
  interface Window {
    __hydrationMode?: 'hydrate' | 'client';
    __hydrationErrors?: string[];
    __PRERENDER_HYDRATION__?: boolean;
  }
}

window.__hydrationMode = hydrate ? 'hydrate' : 'client';
window.__hydrationErrors = [];

if (hydrate) {
  hydrateRoot(rootElement, app, {
    onRecoverableError: (error, errorInfo) => {
      const message = error instanceof Error ? error.message : String(error);
      const stack = (errorInfo as { componentStack?: string | null } | undefined)?.componentStack;
      window.__hydrationErrors?.push(stack ? `${message}\n${stack}` : message);
      console.error('[hydration]', error, errorInfo);
    },
  });
} else {
  createRoot(rootElement).render(app);
}