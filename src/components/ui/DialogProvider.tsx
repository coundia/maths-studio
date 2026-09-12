import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

type DialogType = 'alert' | 'confirm' | 'prompt';

interface DialogOptions {
  title?: string;
  message: string;
  defaultValue?: string;
  type?: DialogType;
}

interface DialogContextValue {
  alert: (message: string, title?: string) => Promise<void>;
  confirm: (message: string, title?: string) => Promise<boolean>;
  prompt: (message: string, defaultValue?: string, title?: string) => Promise<string | null>;
}

const DialogContext = createContext<DialogContextValue | null>(null);

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) throw new Error('useDialog must be used within DialogProvider');
  return context;
};

export const DialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<DialogOptions | null>(null);
  const [inputValue, setInputValue] = useState('');
  
  // Holds the resolver function for the Promise
  const [resolver, setResolver] = useState<{ resolve: (value: any) => void } | null>(null);

  const openDialog = useCallback((opts: DialogOptions) => {
    setOptions(opts);
    setInputValue(opts.defaultValue || '');
    setIsOpen(true);
    return new Promise<any>((resolve) => {
      setResolver({ resolve });
    });
  }, []);

  const alert = useCallback((message: string, title?: string) => {
    return openDialog({ type: 'alert', message, title });
  }, [openDialog]);

  const confirm = useCallback((message: string, title?: string) => {
    return openDialog({ type: 'confirm', message, title });
  }, [openDialog]);

  const prompt = useCallback((message: string, defaultValue?: string, title?: string) => {
    return openDialog({ type: 'prompt', message, defaultValue, title });
  }, [openDialog]);

  const handleClose = (value: any = null) => {
    setIsOpen(false);
    if (resolver) resolver.resolve(value);
    setTimeout(() => setOptions(null), 200);
  };

  const handleConfirm = () => {
    if (options?.type === 'prompt') handleClose(inputValue);
    else handleClose(true);
  };

  const handleCancel = () => {
    if (options?.type === 'prompt') handleClose(null);
    else handleClose(false);
  };

  return (
    <DialogContext.Provider value={{ alert, confirm, prompt }}>
      {children}
      <AnimatePresence>
        {isOpen && options && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 print:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={handleCancel}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-5 sm:p-6 overflow-hidden"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 shrink-0">
                      {options.type === 'confirm' ? <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" /> : <Info className="w-5 h-5 sm:w-6 sm:h-6" />}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                        {options.title || (options.type === 'confirm' ? 'Confirmation' : options.type === 'prompt' ? 'Saisie requise' : 'Information')}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">{options.message}</p>
                    </div>
                  </div>
                  <button onClick={handleCancel} className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {options.type === 'prompt' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      autoFocus
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleConfirm();
                        if (e.key === 'Escape') handleCancel();
                      }}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-white text-sm"
                    />
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 sm:gap-3 mt-4">
                  {options.type !== 'alert' && (
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                    >
                      Annuler
                    </button>
                  )}
                  <button
                    onClick={handleConfirm}
                    className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors"
                  >
                    {options.type === 'alert' ? 'OK' : 'Confirmer'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DialogContext.Provider>
  );
};
