import React, { useState, useRef } from 'react';
import { ExpressionSolution } from '../types';
import { 
  Search, 
  HelpCircle, 
  ArrowRight, 
  Sparkles, 
  Delete, 
  Filter,
  CheckCircle2,
  Clock,
  Layers
} from 'lucide-react';

interface ExpressionInputProps {
  onResolve: (expr: string, opType: string) => Promise<void>;
  isLoading: boolean;
  activeSolution: ExpressionSolution | null;
}

interface PresetItem {
  label: string;
  expr: string;
  op: string;
  category: 'all' | 'distributivity' | 'powers' | 'signs' | 'factorization';
  tag: string;
  desc: string;
}

const PRESET_EXPRESSIONS: PresetItem[] = [
  { label: '(x + 1)(x + 2)', expr: '(x+1)(x+2)', op: 'expansion', category: 'distributivity', tag: 'Double distributivité', desc: 'Produit de base' },
  { label: '(x + 1)(x - 2)', expr: '(x+1)(x-2)', op: 'expansion', category: 'signs', tag: 'Signes mixtes', desc: 'Terme négatif' },
  { label: '(x - 2)(x - 3)', expr: '(x-2)(x-3)', op: 'expansion', category: 'signs', tag: 'Double signe moins', desc: '(-2)×(-3) = +6' },
  { label: '(2x + 1)(x + 3)', expr: '(2x+1)(x+3)', op: 'expansion', category: 'distributivity', tag: 'Coefficients', desc: 'Coefficients > 1' },
  { label: '(x + 3)²', expr: '(x+3)^2', op: 'expansion', category: 'powers', tag: 'Carré (a+b)²', desc: 'Identité n°1' },
  { label: '(2x - 3)²', expr: '(2x-3)^2', op: 'expansion', category: 'powers', tag: 'Carré (a-b)²', desc: 'Identité n°2 avec coef' },
  { label: '(3x + 4)(3x - 4)', expr: '(3x+4)(3x-4)', op: 'expansion', category: 'powers', tag: 'Produit a² - b²', desc: 'Identité n°3' },
  { label: 'x² - 9', expr: 'x^2 - 9', op: 'factorization', category: 'factorization', tag: 'Différence carrés', desc: '(x-3)(x+3)' },
  { label: '4x² - 25', expr: '4x^2 - 25', op: 'factorization', category: 'factorization', tag: 'Carrés (2x)² - 5²', desc: '(2x-5)(2x+5)' },
  { label: '3x + 6', expr: '3x + 6', op: 'factorization', category: 'factorization', tag: 'Facteur commun 3', desc: '3(x+2)' },
  { label: '5x² - 15x', expr: '5x^2 - 15x', op: 'factorization', category: 'factorization', tag: 'Facteur monôme 5x', desc: '5x(x-3)' },
];

const QUICK_MATH_SYMBOLS = [
  { label: 'x', insert: 'x' },
  { label: 'x²', insert: '^2' },
  { label: 'x³', insert: '^3' },
  { label: '( )', insert: '()' },
  { label: '+', insert: '+' },
  { label: '-', insert: '-' },
  { label: '×', insert: '*' },
  { label: '2x', insert: '2x' },
  { label: '3x', insert: '3x' },
  { label: '²', insert: '^2' },
];

export const ExpressionInput: React.FC<ExpressionInputProps> = ({
  onResolve,
  isLoading,
  activeSolution,
}) => {
  const [inputVal, setInputVal] = useState('(x+1)(x+2)');
  const [opType, setOpType] = useState('expansion');
  const [showSyntaxHelp, setShowSyntaxHelp] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'distributivity' | 'powers' | 'signs' | 'factorization'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    onResolve(inputVal.trim(), opType);
  };

  const handleSelectPreset = (item: PresetItem) => {
    setInputVal(item.expr);
    setOpType(item.op);
    onResolve(item.expr, item.op);
  };

  const handleInsertSymbol = (sym: string) => {
    if (!inputRef.current) {
      setInputVal((prev) => prev + sym);
      return;
    }
    const input = inputRef.current;
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const newVal = inputVal.substring(0, start) + sym + inputVal.substring(end);
    setInputVal(newVal);

    // Restore cursor position inside parens or after symbol
    setTimeout(() => {
      input.focus();
      const newPos = sym === '()' ? start + 1 : start + sym.length;
      input.setSelectionRange(newPos, newPos);
    }, 10);
  };

  const filteredPresets = selectedFilter === 'all'
    ? PRESET_EXPRESSIONS
    : PRESET_EXPRESSIONS.filter((p) => p.category === selectedFilter);

  return (
    <div className="w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-4 lg:p-6 shadow-xl transition-all">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-3">
        {/* Main Input Field */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600 dark:text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            ref={inputRef}
            id="expression-input"
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Exemple: (x+1)(x+2), (2x-3)^2, 4x^2 - 25, 3x+6..."
            className="w-full pl-10 pr-10 py-3 bg-white/80 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700/80 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-600 dark:placeholder-slate-500 font-mono text-sm sm:text-base tracking-wide transition-all outline-none shadow-inner"
          />
          <button
            type="button"
            onClick={() => setShowSyntaxHelp(!showSyntaxHelp)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            title="Aide syntaxique & guide de saisie"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Operation Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto min-w-0">
          <select
            id="operation-type-select"
            value={opType}
            onChange={(e) => setOpType(e.target.value)}
            className="w-full sm:w-auto min-w-0 truncate bg-white/80 dark:bg-slate-950/90 border border-slate-300 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 text-xs font-semibold py-3 px-3 rounded-2xl focus:border-indigo-500 outline-none transition-colors cursor-pointer"
          >
            <option value="expansion">Développer (Distributivité & Puissances)</option>
            <option value="factorization">Factoriser (Facteur commun & Identités)</option>
            <option value="simplification">Simplifier l'expression</option>
          </select>

          {/* Submit Action Button */}
          <button
            id="resolve-submit-btn"
            type="submit"
            disabled={isLoading || !inputVal.trim()}
            className="w-full sm:w-auto md:flex-none flex items-center justify-center space-x-2 py-3 px-6 shrink-0 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold text-sm rounded-2xl transition-all shadow-md shadow-indigo-600/20 active:scale-[0.98] cursor-pointer"
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

      {/* Quick Mathematical Pad (Symbols insertion) */}
      <div className="mt-3 flex items-center flex-wrap gap-1.5 pt-2 border-t border-slate-200 dark:border-slate-800/60">
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
          Saisie rapide :
        </span>
        {QUICK_MATH_SYMBOLS.map((sym) => (
          <button
            key={sym.label}
            type="button"
            onClick={() => handleInsertSymbol(sym.insert)}
            className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all active:scale-95 shadow-2xs"
          >
            {sym.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setInputVal('')}
          className="ml-auto px-2 py-1 rounded-lg text-[11px] font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          title="Effacer le champ"
        >
          Effacer
        </button>
      </div>

      {/* Syntax Helper Drawer */}
      {showSyntaxHelp && (
        <div className="mt-3 p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-300 space-y-2 border border-slate-200 dark:border-slate-800">
          <div className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4" />
            <span>Guide de notation algébrique :</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 font-mono text-[11px]">
            <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 block text-[10px]">Double distributivité :</span>
              <code className="text-emerald-700 dark:text-emerald-300 font-bold">(x+1)(x+2)</code>
            </div>
            <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 block text-[10px]">Signes négatifs :</span>
              <code className="text-amber-700 dark:text-amber-300 font-bold">(x+1)(x-2)</code> ou <code className="text-amber-700 dark:text-amber-300 font-bold">(x-2)(x-3)</code>
            </div>
            <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 block text-[10px]">Puissance / Carré :</span>
              <code className="text-indigo-700 dark:text-indigo-300 font-bold">(x+3)^2</code> ou <code className="text-indigo-700 dark:text-indigo-300 font-bold">(2x-3)^2</code>
            </div>
            <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 block text-[10px]">Différence de carrés :</span>
              <code className="text-cyan-700 dark:text-cyan-300 font-bold">x^2 - 9</code> ou <code className="text-cyan-700 dark:text-cyan-300 font-bold">4x^2 - 25</code>
            </div>
          </div>
        </div>
      )}

      {/* Preset Category Filters */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
            Exemples recommandés au programme :
          </span>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1">
            {(['all', 'distributivity', 'powers', 'signs', 'factorization'] as const).map((filterKey) => {
              const labels = {
                all: 'Tous',
                distributivity: 'Distributivité',
                powers: 'Puissances & Carrés',
                signs: 'Signes ℤ',
                factorization: 'Factorisations',
              };
              const isSelected = selectedFilter === filterKey;
              return (
                <button
                  key={filterKey}
                  type="button"
                  onClick={() => setSelectedFilter(filterKey)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {labels[filterKey]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preset Example Chips */}
        <div className="flex items-center flex-wrap gap-1.5">
          {filteredPresets.map((item) => (
            <button
              key={item.expr}
              id={`preset-btn-${item.expr.replace(/[^a-zA-Z0-9]/g, '')}`}
              type="button"
              onClick={() => handleSelectPreset(item)}
              title={`${item.tag} - ${item.desc}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border flex items-center space-x-1.5 ${
                inputVal === item.expr
                  ? 'bg-indigo-600/15 text-indigo-700 dark:text-indigo-300 border-indigo-500 font-bold shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-950/60 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
              }`}
            >
              <span>{item.label}</span>
              <span className="text-[10px] font-sans opacity-70 px-1 py-0.2 rounded bg-slate-200/60 dark:bg-slate-800/60">
                {item.tag}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Resolution status badge */}
      {activeSolution && (
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 dark:text-slate-400">Expression résolue :</span>
            <span className="font-mono text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-500/20">
              {activeSolution.rawExpression}
            </span>
            <span className="text-slate-600 dark:text-slate-400">→</span>
            <span className="font-mono text-indigo-700 dark:text-indigo-300 font-bold bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-200 dark:border-indigo-500/20">
              {activeSolution.finalFormLatex}
            </span>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{activeSolution.steps?.length || 0} étapes interactives animées</span>
          </div>
        </div>
      )}
    </div>
  );
};
