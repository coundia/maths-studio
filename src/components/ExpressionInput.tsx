import React, { useState } from 'react';
import { ExpressionSolution } from '../types';
import { Search, Zap, Cpu, Bot, Clock, HelpCircle, Check, ArrowRight } from 'lucide-react';

interface ExpressionInputProps {
  onResolve: (expr: string, opType: string) => Promise<void>;
  isLoading: boolean;
  activeSolution: ExpressionSolution | null;
}

const PRESET_EXPRESSIONS = [
  { label: '(x + 1)(x + 2)', expr: '(x+1)(x+2)', op: 'expansion', tag: 'Double distributivité', desc: 'Exemple demandé' },
  { label: '(x + 1)(x - 2)', expr: '(x+1)(x-2)', op: 'expansion', tag: 'Signes négatifs', desc: 'Exemple demandé' },
  { label: '(x + 3)(x + 4)', expr: '(x+3)(x+4)', op: 'expansion', tag: 'Double distributivité', desc: 'Produit de binômes' },
  { label: '(2x + 1)(x + 3)', expr: '(2x+1)(x+3)', op: 'expansion', tag: 'Coefficients', desc: 'Coefficients > 1' },
  { label: '(x + 3)²', expr: '(x+3)^2', op: 'expansion', tag: 'Carré remarquable', desc: 'Identité remarquable' },
  { label: 'x² - 9', expr: 'x^2 - 9', op: 'factorization', tag: 'Différence carrés', desc: '(x-3)(x+3)' },
  { label: '3x + 6', expr: '3x + 6', op: 'factorization', tag: 'Facteur commun', desc: '3(x+2)' },
];

export const ExpressionInput: React.FC<ExpressionInputProps> = ({
  onResolve,
  isLoading,
  activeSolution,
}) => {
  const [inputVal, setInputVal] = useState('(x+1)(x+2)');
  const [opType, setOpType] = useState('expansion');
  const [showSyntaxHelp, setShowSyntaxHelp] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    onResolve(inputVal.trim(), opType);
  };

  const handleSelectPreset = (item: typeof PRESET_EXPRESSIONS[0]) => {
    setInputVal(item.expr);
    setOpType(item.op);
    onResolve(item.expr, item.op);
  };

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 lg:p-5 shadow-lg">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-3">
        {/* Main Input Field */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="expression-input"
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Exemple: (x+1)(x+2), (x+1)(x-2), x^2 - 9..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-700/70 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-slate-100 placeholder-slate-500 font-mono text-sm tracking-wide transition-all outline-none"
          />
          <button
            type="button"
            onClick={() => setShowSyntaxHelp(!showSyntaxHelp)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
            title="Aide syntaxique"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        {/* Operation Selector */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <select
            id="operation-type-select"
            value={opType}
            onChange={(e) => setOpType(e.target.value)}
            className="bg-slate-950 border border-slate-700/70 text-slate-300 text-xs font-medium py-2.5 px-3 rounded-xl focus:border-indigo-500 outline-none transition-colors"
          >
            <option value="expansion">Développer (Distributivité)</option>
            <option value="factorization">Factoriser</option>
            <option value="simplification">Simplifier</option>
          </select>

          {/* Submit Action Button */}
          <button
            id="resolve-submit-btn"
            type="submit"
            disabled={isLoading || !inputVal.trim()}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium text-sm rounded-xl transition-all shadow-md shadow-indigo-600/20 active:scale-[0.98]"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Calcul en cours...</span>
              </div>
            ) : (
              <>
                <span>Animer le calcul</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Syntax Helper Drawer */}
      {showSyntaxHelp && (
        <div className="mt-3 p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-300 space-y-1.5">
          <div className="font-semibold text-indigo-400">Guide de saisie algébrique :</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 font-mono text-[11px]">
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Double distributivité :</span> <code className="text-indigo-300">(x+1)(x+2)</code>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Avec signes négatifs :</span> <code className="text-indigo-300">(x+1)(x-2)</code>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Carré remarquable :</span> <code className="text-indigo-300">(x+3)^2</code>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Différence carrés :</span> <code className="text-indigo-300">x^2 - 9</code>
            </div>
          </div>
        </div>
      )}

      {/* Preset Example Chips */}
      <div className="mt-3.5 flex items-center flex-wrap gap-1.5">
        <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mr-1">
          Exemples :
        </span>
        {PRESET_EXPRESSIONS.map((item) => (
          <button
            key={item.expr}
            id={`preset-btn-${item.expr.replace(/[^a-zA-Z0-9]/g, '')}`}
            type="button"
            onClick={() => handleSelectPreset(item)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all border ${
              inputVal === item.expr
                ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500 font-bold shadow-sm'
                : 'bg-slate-950/60 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 border-slate-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Resolution status badge */}
      {activeSolution && (
        <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Expression chargée :</span>
            <span className="font-mono text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {activeSolution.rawExpression}
            </span>
            <span className="text-slate-500">→</span>
            <span className="font-mono text-indigo-300 font-bold">
              {activeSolution.finalFormLatex}
            </span>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{activeSolution.steps?.length || 0} étapes d'animation 3D disponibles</span>
          </div>
        </div>
      )}
    </div>
  );
};
