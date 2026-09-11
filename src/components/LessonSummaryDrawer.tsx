import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ClipboardList,
  Sparkles,
  Printer,
  Lightbulb,
  Layers,
  ArrowRight,
  Search,
} from 'lucide-react';
import { CourseChapter } from '../coursesData';
import { MathView } from './MathView';
import { getGradeLevel, GRADE_BADGE } from '../data/gradeLevel';

interface LessonSummaryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  chapter: CourseChapter;
  /** Ouvre la fiche de cours complète (onglet "Cours Complet & Théorèmes") depuis le pied du tiroir. */
  onOpenFullSheet?: () => void;
}

interface SummaryFormula {
  /** Identifiant stable pour la clé React (indice de partie + indice d'étape). */
  key: string;
  rule: string;
  latex: string;
}

interface SummaryGroup {
  demoId: string;
  title: string;
  badge: string;
  ruleSummary: string;
  formulas: SummaryFormula[];
}

const gradeLabel = (chapter: CourseChapter): string => GRADE_BADGE[getGradeLevel(chapter)];

/**
 * Regroupe, pour un chapitre donné, les formules à retenir de chaque partie de
 * la leçon (une par démo/partie), en dédupliquant les étapes qui répètent la
 * même règle. Les données viennent directement des étapes affichées dans
 * l'animation (`demo.steps[].rule` / `.latex`) : c'est exactement ce que
 * l'élève a vu défiler, jamais un contenu généré à part.
 */
function buildSummaryGroups(chapter: CourseChapter): SummaryGroup[] {
  return chapter.demos.map((demo, demoIdx) => {
    const seen = new Set<string>();
    const formulas: SummaryFormula[] = [];

    demo.steps.forEach((step, stepIdx) => {
      const dedupeKey = `${step.rule}__${step.latex}`;
      if (!step.rule || !step.latex || seen.has(dedupeKey)) return;
      seen.add(dedupeKey);
      formulas.push({ key: `${demoIdx}-${stepIdx}`, rule: step.rule, latex: step.latex });
    });

    return {
      demoId: demo.id,
      title: demo.title,
      badge: demo.badge,
      ruleSummary: demo.ruleSummary,
      formulas,
    };
  });
}

export const LessonSummaryDrawer: React.FC<LessonSummaryDrawerProps> = ({
  isOpen,
  onClose,
  chapter,
  onOpenFullSheet,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSearchQuery('');
  }, [chapter.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const groups = useMemo(() => buildSummaryGroups(chapter), [chapter]);

  const filteredGroups = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return groups;
    return groups
      .map((group) => ({
        ...group,
        formulas: group.formulas.filter(
          (f) => f.rule.toLowerCase().includes(query) || f.latex.toLowerCase().includes(query)
        ),
      }))
      .filter((group) => group.formulas.length > 0 || group.ruleSummary.toLowerCase().includes(query));
  }, [groups, searchQuery]);

  const totalFormulas = groups.reduce((sum, g) => sum + g.formulas.length, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end print:relative print:z-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity print:hidden"
            aria-hidden="true"
          />

          {/* Right Drawer Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full sm:w-[500px] max-w-full h-full bg-white dark:bg-slate-900 text-black dark:text-slate-100 shadow-2xl border-l border-neutral-300 dark:border-slate-800 flex flex-col z-50 print:w-full print:shadow-none print:border-0"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lesson-summary-drawer-title"
          >
            {/* Header Sticky */}
            <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10 flex flex-col space-y-3 print:static">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-indigo-600/10 border border-indigo-300/20 text-indigo-600 dark:bg-sky-500/20 dark:border-sky-500/30 dark:text-sky-400">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-sky-400">
                        Synthèse de la leçon
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-slate-800 text-neutral-700 dark:text-slate-300 border border-neutral-200 dark:border-slate-700">
                        {gradeLabel(chapter)}
                      </span>
                    </div>
                    <h2
                      id="lesson-summary-drawer-title"
                      className="text-base sm:text-lg font-bold text-black dark:text-white leading-tight mt-0.5"
                    >
                      {chapter.title}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-neutral-500 hover:text-black dark:text-slate-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-slate-800 transition-colors print:hidden"
                  title="Fermer (Échap)"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs text-neutral-600 dark:text-slate-400 print:hidden">
                Toutes les formules et règles à retenir de{' '}
                <strong className="text-black dark:text-white font-semibold">
                  {chapter.demos.length > 1 ? `les ${chapter.demos.length} parties` : 'la partie'}
                </strong>{' '}
                de ce cours, regroupées en un seul aide-mémoire ({totalFormulas} formule
                {totalFormulas > 1 ? 's' : ''}).
              </div>

              {/* Search Filter */}
              {totalFormulas > 4 && (
                <div className="relative print:hidden">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500 dark:text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher une formule ou une règle..."
                    className="w-full pl-8 pr-3 py-1.5 bg-neutral-50 dark:bg-slate-950/80 border border-neutral-200 dark:border-slate-700/80 rounded-lg text-xs text-black dark:text-slate-200 placeholder-neutral-500 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 dark:focus:border-sky-500 transition-colors"
                  />
                </div>
              )}
            </div>

            {/* Scrollable Content: Groups by lesson part */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 scrollbar-thin">
              {filteredGroups.length === 0 && (
                <div className="text-center py-10 text-xs text-neutral-500 dark:text-slate-400">
                  Aucune formule ne correspond à « {searchQuery} ».
                </div>
              )}

              {filteredGroups.map((group, groupIdx) => (
                <div key={group.demoId} className="space-y-2.5">
                  {/* Part header */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="flex items-center justify-center w-5 h-5 rounded-md bg-indigo-600/10 dark:bg-sky-500/20 text-indigo-600 dark:text-sky-400 text-[10px] font-bold shrink-0">
                      <Layers className="w-3 h-3" />
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-slate-800 text-neutral-700 dark:text-slate-300 border border-neutral-200 dark:border-slate-700">
                      {group.badge}
                    </span>
                    <h3 className="text-sm font-bold text-black dark:text-white leading-tight">
                      {chapter.demos.length > 1 ? `Partie ${groupIdx + 1} : ${group.title}` : group.title}
                    </h3>
                  </div>

                  {/* Golden rule for this part */}
                  {group.ruleSummary && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-500/20 text-xs flex items-start space-x-2">
                      <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-emerald-950 dark:text-emerald-200 font-medium leading-relaxed">
                        {group.ruleSummary}
                      </span>
                    </div>
                  )}

                  {/* Formula cards */}
                  {group.formulas.length > 0 && (
                    <div className="space-y-2">
                      {group.formulas.map((formula) => (
                        <div
                          key={formula.key}
                          className="p-3 rounded-xl bg-neutral-50 dark:bg-slate-950/60 border border-neutral-200 dark:border-slate-800"
                        >
                          <div className="flex items-start gap-1.5 mb-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-sky-400 shrink-0 mt-0.5" />
                            <span className="text-xs font-semibold text-neutral-800 dark:text-slate-200 leading-snug">
                              {formula.rule}
                            </span>
                          </div>
                          <div className="pl-5 text-black dark:text-slate-100">
                            <MathView latex={formula.latex} display={true} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {groupIdx < filteredGroups.length - 1 && (
                    <div className="pt-1 border-t border-neutral-200 dark:border-slate-800/80 print:hidden" />
                  )}
                </div>
              ))}
            </div>

            {/* Sticky Footer */}
            <div className="p-4 border-t border-neutral-200 dark:border-slate-800 bg-neutral-50 dark:bg-slate-900/90 flex items-center justify-between gap-3 print:hidden">
              <button
                onClick={() => window.print()}
                className="flex items-center space-x-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                title="Imprimer cette synthèse"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer</span>
              </button>

              {onOpenFullSheet ? (
                <button
                  onClick={() => {
                    onOpenFullSheet();
                    onClose();
                  }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white text-black border-2 border-black hover:bg-neutral-100 dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:text-white dark:border-transparent transition-all shadow-xs"
                >
                  <span>Voir la fiche de cours complète</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white text-black border-2 border-black hover:bg-neutral-100 dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:text-white dark:border-transparent transition-all shadow-xs"
                >
                  <span>Fermer</span>
                </button>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
