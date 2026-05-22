import { useState, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let toasts: Toast[] = [];
let listeners: ((toasts: Toast[]) => void)[] = [];

const memoryState = {
  getToasts: () => toasts,
  addToast: (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2, 9);
    toasts = [...toasts, { ...toast, id }];
    listeners.forEach((listener) => listener(toasts));
    setTimeout(() => {
      memoryState.removeToast(id);
    }, 4000);
  },
  removeToast: (id: string) => {
    toasts = toasts.filter((t) => t.id !== id);
    listeners.forEach((listener) => listener(toasts));
  },
  subscribe: (listener: (toasts: Toast[]) => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
};

export const toast = {
  success: (message: string) => memoryState.addToast({ message, type: 'success' }),
  error: (message: string) => memoryState.addToast({ message, type: 'error' }),
  info: (message: string) => memoryState.addToast({ message, type: 'info' }),
};

export function useToast() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>(toasts);

  useEffect(() => {
    return memoryState.subscribe(setCurrentToasts);
  }, []);

  return { toasts: currentToasts, removeToast: memoryState.removeToast };
}
