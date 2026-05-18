/* eslint-disable no-console */
import LoadingContainer from '@/shared/components/layouts/loading';
import ToastStack from '@/shared/components/ui/Toast/ToastStack';
import { ToastProvider } from '@/shared/hooks';
import { getQueryClient } from '@/shared/libs/utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { routes } from './routes';

import './index.css';

const router = createBrowserRouter(routes);

const queryClient = getQueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingContainer />}>
        <ToastProvider>
          <RouterProvider router={router} />
          <ToastStack />
        </ToastProvider>
      </Suspense>
    </QueryClientProvider>
  </StrictMode>
);
