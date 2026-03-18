// src/lib/toast/ToastContext.tsx
'use client';

import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useState } from 'react';
import { Toast, ToastContextValue } from './types';

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: Toast['type'] = 'info') => {
      const id = Math.random().toString(36).slice(2);
      const toast: Toast = { id, message, type };
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => remove(id), 4000);
    },
    [remove],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-2 z-50 flex justify-center">
        <div className="flex w-full max-w-md flex-col gap-2 px-4">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`pointer-events-auto rounded-md px-4 py-2 text-xs shadow-md ${
                t.type === 'success'
                  ? 'bg-green-600 text-white'
                  : t.type === 'error'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-white'
              }`}
              role={t.type === 'error' ? 'alert' : 'status'}
              aria-live="polite"
            >
              {t.message}
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}
