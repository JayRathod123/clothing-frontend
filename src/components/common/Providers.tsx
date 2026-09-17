'use client';

import React, { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/queryClient';
import { UIProvider } from '@/context/UIContext';
import { ToastContainer } from '@/components/common/ToastContainer';

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <UIProvider>
        {children}
        <ToastContainer />
      </UIProvider>
    </QueryClientProvider>
  );
}
