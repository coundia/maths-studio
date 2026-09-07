import React from 'react';
import { MathView } from '../MathView';
import { Delete, Eraser } from 'lucide-react';

export interface KeyConfig {
  label: string;
  value: string;
  type?: 'action' | 'number' | 'operator' | 'function';
}

const KEYPAD: KeyConfig[][] = [
  [
    { label: 'x', value: 'x', type: 'number' },
    { label: 'y', value: 'y', type: 'number' },
    { label: 'z', value: 'z', type: 'number' },
    { label: '\\pi', value: '\\pi', type: 'number' },
    { label: 'e', value: 'e', type: 'number' },
  ],
  [
    { label: 'x^2', value: '^2', type: 'function' },
    { label: 'x^n', value: '^{}', type: 'function' },
    { label: '\\sqrt{x}', value: '\\sqrt{}', type: 'function' },
    { label: '\\frac{x}{y}', value: '\\frac{}{}', type: 'function' },
    { label: '=', value: '=', type: 'operator' },
  ],
  [
    { label: '7', value: '7', type: 'number' },
    { label: '8', value: '8', type: 'number' },
    { label: '9', value: '9', type: 'number' },
    { label: '\\div', value: '\\div', type: 'operator' },
    { label: '(', value: '(', type: 'operator' },
  ],
  [
    { label: '4', value: '4', type: 'number' },
    { label: '5', value: '5', type: 'number' },
    { label: '6', value: '6', type: 'number' },
    { label: '\\times', value: '\\times', type: 'operator' },
    { label: ')', value: ')', type: 'operator' },
  ],
  [
    { label: '1', value: '1', type: 'number' },
    { label: '2', value: '2', type: 'number' },
    { label: '3', value: '3', type: 'number' },
    { label: '-', value: '-', type: 'operator' },
    { label: ',', value: ',', type: 'operator' },
  ],
  [
    { label: '0', value: '0', type: 'number' },
    { label: '.', value: '.', type: 'number' },
    { label: 'AC', value: 'AC', type: 'action' },
    { label: '+', value: '+', type: 'operator' },
    { label: 'DEL', value: 'DEL', type: 'action' },
  ]
];

interface MathKeyboardProps {
  onKeyPress: (key: KeyConfig) => void;
}

export const MathKeyboard: React.FC<MathKeyboardProps> = ({ onKeyPress }) => {
  return (
    <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-slate-900 overflow-hidden shadow-inner">

      {/* Keyboard Grid */}
      <div className="flex-1 p-3 flex flex-col gap-2">
        {KEYPAD.map((row, rIdx) => (
          <div key={rIdx} className="flex-1 flex gap-2">
            {row.map((btn, cIdx) => (
              <button
                key={cIdx}
                onClick={() => onKeyPress(btn)}
                className={`flex-1 rounded-xl font-medium text-sm md:text-base flex items-center justify-center transition-all active:scale-95 shadow-sm border ${
                  btn.type === 'action'
                    ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800 hover:bg-rose-200 dark:hover:bg-rose-900/50'
                    : btn.type === 'operator'
                    ? 'bg-slate-200 dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 border-slate-300 dark:border-slate-700 hover:bg-slate-300 dark:hover:bg-slate-700'
                    : btn.type === 'function'
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {btn.value === 'AC' ? (
                  <Eraser className="w-5 h-5" />
                ) : btn.value === 'DEL' ? (
                  <Delete className="w-5 h-5" />
                ) : (
                  <MathView latex={btn.label} display={false} className="pointer-events-none" />
                )}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
