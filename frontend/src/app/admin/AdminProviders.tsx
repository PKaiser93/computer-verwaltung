// src/app/admin/AdminProviders.tsx
'use client';

import type { ReactNode } from 'react';
import { ToastProvider } from '@/lib/toast/ToastContext';

export function AdminProviders({ children }: { children: ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
