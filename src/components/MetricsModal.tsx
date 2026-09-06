import React from 'react';
import { StudioMetrics, ExpressionSolution } from '../types';
import { X, CheckCircle, Database, Cpu, Bot, Award, Clock } from 'lucide-react';

interface MetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: StudioMetrics;
  history: ExpressionSolution[];
  onSelectSolution: (sol: ExpressionSolution) => void;
}

export const MetricsModal: React.FC<MetricsModalProps> = ({
  isOpen,
  onClose,
  metrics,
  history,
  onSelectSolution,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center">
              <Database className="w-5 h-5 text-indigo-400 mr-2" />
              Tableau de Bord des KPIs & Cache SHA-256
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Suivi de la performance du pipeline hybride et de l'absence de redondance de calcul (Section 7 PRD)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* KPI Target Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Cache Hit Rate */}
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Taux Cache Hit</span>
                <span className="text-[11px] font-mono text-amber-400 font-medium">Cible ≥ 60%</span>
              </div>
              <div className="text-2xl font-bold text-amber-300 font-mono">
                {metrics.cacheHitRate}%
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {metrics.cacheHits} requêtes en cache
              </div>
            </div>

            {/* Heuristic Rate */}
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Heuristique</span>
                <span className="text-[11px] font-mono text-emerald-400 font-medium">Cible ≥ 25%</span>
              </div>
              <div className="text-2xl font-bold text-emerald-300 font-mono">
                {metrics.heuristicRate}%
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {metrics.heuristicResolutions} résolutions 0 IA
              </div>
            </div>

            {/* AI Calls */}
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Appels IA uniques</span>
                <span className="text-[11px] font-mono text-indigo-400 font-medium">Cible ≤ 1.0</span>
              </div>
              <div className="text-2xl font-bold text-indigo-300 font-mono">
                {metrics.aiCalls}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                0 redondance garantie
              </div>
            </div>

            {/* Completion Rate */}
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Achèvement</span>
                <span className="text-[11px] font-mono text-sky-400 font-medium">Cible ≥ 70%</span>
              </div>
              <div className="text-2xl font-bold text-sky-300 font-mono">
                {metrics.completionRate}%
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {metrics.stepsCompleted} parcours terminés
              </div>
            </div>
          </div>

          {/* Cached Expressions Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center">
                <Database className="w-4 h-4 mr-1.5 text-indigo-400" />
                Expressions persistées en base ({history.length})
              </h3>
              <span className="text-xs text-slate-500">
                Clé d'unicité = SHA-256(type:expression)
              </span>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                Aucune expression en cache pour le moment.
              </div>
            ) : (
              <div className="border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800/80 bg-slate-950/60 max-h-64 overflow-y-auto">
                {history.map((sol) => (
                  <div
                    key={sol.id}
                    onClick={() => {
                      onSelectSolution(sol);
                      onClose();
                    }}
                    className="p-3 hover:bg-slate-850 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-sm font-bold text-slate-100">
                        {sol.rawExpression}
                      </span>
                      <span className="text-slate-500 text-xs">→</span>
                      <span className="font-mono text-xs text-emerald-400">
                        {sol.finalFormLatex}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-mono border ${
                          sol.source === 'cache'
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : sol.source === 'heuristic'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                        }`}
                      >
                        {sol.source}
                      </span>
                      <span className="text-slate-500 font-mono text-[11px] flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {sol.latencyMs}ms
                      </span>
                      <span className="text-slate-600 font-mono text-[10px] hidden sm:inline" title={sol.id}>
                        {sol.id.slice(0, 8)}...
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Architecture conforme PRD V1 : Zéro redondance & Stockage atomique</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
