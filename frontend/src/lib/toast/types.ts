// src/lib/toast/types.ts
export type ToastType = 'success' | 'error' | 'info';

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

export type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void;
};
