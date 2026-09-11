import React from 'react';
import { ExpressionSolution } from '../types';
import { MathView } from './MathView';
import { CheckCircle2, ChevronRight, HelpCircle, BookOpen, Sparkles, Layers } from 'lucide-react';

interface AlgebraProgressionCardProps {
  solution: ExpressionSolution;
  currentStepIndex: number;
  onStepClick: (index: number) => void;
}

export const AlgebraProgressionCard: React.FC<AlgebraProgressionCardProps> = ({
  solution,
  currentStepIndex,
  onStepClick,
}) => {
  const steps = solution.steps || [];

  return (
    <div className="flex flex-col h-full bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 lg:p-6 shadow-xl backdrop-blur-xl transition-all">
      {/* Title */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800 mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Déroulé Algébrique Complet
            </h3>
            <p className="text-[11px] text-slate-400">
              Lignes de calcul pas-à-pas (comme au tableau)
            </p>
          </div>
        </div>

        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          {steps.length} étapes
        </span>
      </div>

      {/* Multiline Calculation Display */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {steps.map((st, idx) => {
          const isActive = idx === currentStepIndex;
          const isPast = idx < currentStepIndex;

          return (
            <div
              key={st.stepNumber}
              onClick={() => onStepClick(idx)}
              className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg scale-[1.02]'
                  : isPast
                  ? 'bg-white/50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 opacity-90'
                  : 'bg-white/30 dark:bg-slate-950/40 border-slate-200/50 dark:border-slate-800/40 hover:border-slate-300 dark:hover:border-slate-800 opacity-60'
              }`}
            >
              {/* Step indicator header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : isPast
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isPast ? '' : idx + 1}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      isActive ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {st.title}
                  </span>
                </div>

                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  {st.appliedRule}
                </span>
              </div>

              {/* KaTeX formula line */}
              <div
                className={`py-2 px-3 rounded-xl overflow-x-auto text-base sm:text-lg transition-colors ${
                  isActive
                    ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white border border-indigo-200 dark:border-indigo-500/40 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-950/60 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800/60'
                }`}
              >
                <MathView latex={st.latex} display={true} />
              </div>

              {/* Inline pedagogical explanation if active */}
              {isActive && (
                <div className="mt-2.5 pt-2 border-t border-indigo-200 dark:border-indigo-500/20 text-xs text-indigo-700 dark:text-indigo-200/90 leading-relaxed flex items-start space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{st.explanation}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Box at the bottom */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
          <BookOpen className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          <span>Résultat final :</span>
          <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            {solution.finalFormLatex}
          </span>
        </div>

        <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
          Double distributivité
        </div>
      </div>
    </div>
  );
};
