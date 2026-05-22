'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Info, X, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function Toaster() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className={`flex items-center gap-3 px-4 py-3 rounded-md shadow-lg border w-80 text-sm font-medium pointer-events-auto ${
              t.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800'
                : t.type === 'error'
                ? 'bg-red-50 text-red-900 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800'
                : 'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800'
            }`}
          >
            {t.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />}
            {t.type === 'error' && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
            {t.type === 'info' && <Info className="w-5 h-5 text-blue-500 shrink-0" />}
            <span className="flex-1 leading-snug">{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
