import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, PenTool, Keyboard, ChevronRight, ChevronLeft } from 'lucide-react';
import { WhiteboardCanvas } from './WhiteboardCanvas';
import { MathKeyboard, KeyConfig } from './MathKeyboard';
import { MathView } from '../MathView';

interface BlackboardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BlackboardDrawer: React.FC<BlackboardDrawerProps> = ({ isOpen, onClose }) => {
  const [activeMode, setActiveMode] = useState<'draw' | 'type'>('type');
  const [latex, setLatex] = useState<string>('');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(true);

  const handleKeyPress = (key: KeyConfig) => {
    if (key.value === 'AC') {
      setLatex('');
    } else if (key.value === 'DEL') {
      setLatex(prev => prev.slice(0, -1));
    } else {
      setLatex(prev => prev + key.value);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-slate-50 dark:bg-[#0B1120] z-[100] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md shrink-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-500/20">
                <PenTool className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  Tableau Interactif
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {activeMode === 'type' ? 'Affichage Plein Écran' : 'Dessin Libre'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Mode Switcher */}
              <div className="flex items-center bg-slate-200/50 dark:bg-slate-900 p-1 rounded-xl border border-slate-300 dark:border-slate-700">
                <button
                  onClick={() => setActiveMode('type')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeMode === 'type'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Keyboard className="w-4 h-4 hidden sm:block" />
                  <span>Équations</span>
                </button>
                <button
                  onClick={() => setActiveMode('draw')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeMode === 'draw'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <PenTool className="w-4 h-4 hidden sm:block" />
                  <span>Dessin</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full transition-colors border border-slate-200 dark:border-slate-700"
                title="Fermer le tableau"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 relative overflow-hidden flex">
            {activeMode === 'draw' ? (
              <div className="flex-1 p-4">
                <WhiteboardCanvas />
              </div>
            ) : (
              <>
                {/* Full Page Equation Display */}
                <div className={`flex-1 flex flex-col items-center justify-center p-8 transition-all duration-300 ${isKeyboardOpen ? 'mr-0 sm:mr-80' : 'mr-0'}`}>
                  <div className="w-full max-w-5xl overflow-x-auto py-12 flex justify-center">
                    {latex ? (
                      <MathView latex={latex} display={true} className="text-5xl sm:text-7xl md:text-8xl text-slate-900 dark:text-white" />
                    ) : (
                      <span className="text-3xl text-slate-300 dark:text-slate-700 font-mono">Taper une formule...</span>
                    )}
                  </div>
                </div>

                {/* Keyboard Toggle Button (when hidden) */}
                {!isKeyboardOpen && (
                  <button
                    onClick={() => setIsKeyboardOpen(true)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-l-2xl shadow-xl transition-all z-20"
                    title="Afficher le clavier"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}

                {/* Right Drawer Keyboard */}
                <AnimatePresence>
                  {isKeyboardOpen && (
                    <motion.div
                      initial={{ x: '100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '100%' }}
                      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                      className="absolute right-0 top-0 bottom-0 w-full sm:w-96 md:w-[400px] bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-30 flex flex-col"
                    >
                      <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Keyboard className="w-4 h-4" /> Clavier Virtuel
                        </span>
                        <button
                          onClick={() => setIsKeyboardOpen(false)}
                          className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500"
                          title="Masquer le clavier"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex-1 overflow-y-auto">
                        <MathKeyboard onKeyPress={handleKeyPress} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
