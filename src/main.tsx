/* eslint-disable */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import './index.css';
import App from './App.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Error from '@/components/error.tsx';
import { Toaster } from '@/components/ui/toaster.tsx';
import { ThemeProvider } from '@/components/theme-provider.tsx';
import { useRegisterSW } from 'virtual:pwa-register/react';

function PWAUpdater() {
  useRegisterSW({
    onRegisterError(error) {
      console.error('SW registration failed', error);
    },
    onRegistered(registration) {
      if (registration) {
        setInterval(
          () => {
            registration.update();
          },
          60 * 60 * 1000
        );
      }
    }
  });

  return null;
}

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={Error}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider storageKey="therizzbook-ui-theme">
          <PWAUpdater />
          <App />
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);
