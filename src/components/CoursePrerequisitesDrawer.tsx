import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  BookOpenCheck,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Sparkles,
  HelpCircle,
  GraduationCap,
  RotateCcw,
} from 'lucide-react';
import { CourseChapter } from '../coursesData';
import { CoursePrerequisite, getChapterPrerequisites } from '../data/coursePrerequisites';
import { getGradeLevel, GRADE_BADGE } from '../data/gradeLevel';
import { MathView } from './MathView';

interface CoursePrerequisitesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  chapter: CourseChapter;
  onNavigateToChapter?: (chapterId: string) => void;
}

export const CoursePrerequisitesDrawer: React.FC<CoursePrerequisitesDrawerProps> = ({
  isOpen,
  onClose,
  chapter,
  onNavigateToChapter,
}) => {
  const prerequisites = getChapterPrerequisites(chapter);

  // Persistence des prérequis maîtrisés par chapitre
  const storageKey = `prereqs_mastered_${chapter.id}`;
  const [masteredIds, setMasteredIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Gestion des réponses aux mini-quiz par prérequis
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setMasteredIds(saved ? JSON.parse(saved) : []);
    } catch {
      setMasteredIds([]);
    }
    setSelectedQuizAnswers({});
  }, [chapter.id, storageKey]);

  // Fermeture par touche Echap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const toggleMastered = (id: string) => {
    setMasteredIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleSelectAll = () => {
    const allIds = prerequisites.map((p) => p.id);
    const updated = masteredIds.length === allIds.length ? [] : allIds;
    setMasteredIds(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const answeredCount = masteredIds.filter((id) =>
    prerequisites.some((p) => p.id === id)
  ).length;
  const progressPercent = Math.round((answeredCount / (prerequisites.length || 1)) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop / Voile sombre semi-transparent */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Right Drawer Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full sm:w-[500px] max-w-full h-full bg-white dark:bg-slate-900 text-black dark:text-slate-100 shadow-2xl border-l border-neutral-300 dark:border-slate-800 flex flex-col z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="prereq-drawer-title"
          >
            {/* Header Sticky */}
            <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10 flex flex-col space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-red-600/10 border border-red-300/20 text-red-600 dark:bg-amber-500/20 dark:border-amber-500/30 dark:text-amber-400">
                    <BookOpenCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-amber-400">
                        Rappel pédagogique
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-slate-800 text-neutral-700 dark:text-slate-300 border border-neutral-200 dark:border-slate-700">
                        {GRADE_BADGE[getGradeLevel(chapter)]}
                      </span>
                    </div>
                    <h2
                      id="prereq-drawer-title"
                      className="text-base sm:text-lg font-bold text-black dark:text-white leading-tight mt-0.5"
                    >
                      Prérequis indispensables
                    </h2>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-neutral-500 hover:text-black dark:text-slate-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-slate-800 transition-colors"
                  title="Fermer (Échap)"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Course Title Reference */}
              <div className="text-xs text-neutral-600 dark:text-slate-400">
                Avant d'aborder le chapitre{' '}
                <strong className="text-black dark:text-white font-semibold">« {chapter.title} »</strong>, assurez-vous de maîtriser ces notions clés des classes antérieures.
              </div>

              {/* Progression Bar & Mastered Counter */}
              <div className="bg-neutral-50 dark:bg-slate-950/60 p-3 rounded-xl border border-neutral-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-800 dark:text-slate-200 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-red-600 dark:text-emerald-400" />
                    <span>Niveau de préparation :</span>
                  </span>
                  <span className="font-mono font-bold text-black dark:text-white">
                    {answeredCount} / {prerequisites.length} acquis ({progressPercent}%)
                  </span>
                </div>

                {/* Progress track */}
                <div className="w-full bg-neutral-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-red-600 dark:bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-neutral-500 dark:text-slate-400">
                    {progressPercent === 100
                      ? ' Bravo, vous êtes 100% prêt pour ce cours !'
                      : 'Cochez chaque notion après relecture.'}
                  </span>
                  <button
                    onClick={handleSelectAll}
                    className="text-[11px] font-semibold text-red-600 dark:text-emerald-400 hover:underline"
                  >
                    {masteredIds.length === prerequisites.length ? 'Tout décocher' : 'Tout valider'}
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable Content: List of Prerequisites */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-thin">
              {prerequisites.map((prereq, index) => {
                const isMastered = masteredIds.includes(prereq.id);
                const selectedAnswerIdx = selectedQuizAnswers[prereq.id];

                return (
                  <div
                    key={prereq.id}
                    className={`rounded-2xl border transition-all duration-200 p-4 space-y-3 ${
                      isMastered
                        ? 'border-neutral-300 dark:border-emerald-500/40 bg-neutral-50/50 dark:bg-emerald-950/10'
                        : 'border-neutral-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 shadow-xs'
                    }`}
                  >
                    {/* Top line: Level, Category and Mastery checkbox */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-600/10 text-red-600 border border-red-300/20 dark:border-red-600/20 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30">
                          Vu en {prereq.sourceGrade}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-neutral-100 text-neutral-700 border border-neutral-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                          {prereq.category}
                        </span>
                      </div>

                      {/* Checkbox button */}
                      <button
                        onClick={() => toggleMastered(prereq.id)}
                        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border shrink-0 ${
                          isMastered
                            ? 'bg-red-600 text-white border-red-300 dark:bg-emerald-600 dark:border-emerald-500'
                            : 'bg-white text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 border-neutral-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                        }`}
                        title={isMastered ? 'Marqué comme maîtrisé' : 'Cocher comme maîtrisé'}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isMastered ? 'Acquis ' : 'À revoir'}</span>
                      </button>
                    </div>

                    {/* Prerequisite Title */}
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-black dark:text-white flex items-center gap-2">
                        <span className="text-neutral-600 dark:text-neutral-400 font-mono text-xs">#{index + 1}</span>
                        <span>{prereq.title}</span>
                      </h3>
                      <p className="text-xs text-neutral-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {prereq.summary}
                      </p>
                    </div>

                    {/* Formula box (if available) */}
                    {prereq.formulaLatex && (
                      <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 text-center">
                        <MathView latex={prereq.formulaLatex} display={true} />
                      </div>
                    )}

                    {/* Golden Rule / Règle d'or */}
                    <div className="p-3 rounded-xl bg-neutral-50 dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 text-xs flex items-start space-x-2">
                      <Lightbulb className="w-4 h-4 text-red-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div className="space-y-0.5 text-neutral-800 dark:text-slate-200">
                        <span className="font-bold text-black dark:text-white">Règle à retenir : </span>
                        <span>{prereq.keyRule}</span>
                      </div>
                    </div>

                    {/* Example (if available) */}
                    {prereq.exampleLatex && (
                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950/70 border border-neutral-200 dark:border-slate-800 text-xs">
                        <div className="text-[11px] font-bold text-neutral-500 dark:text-slate-400 mb-1">
                          Exemple d'application rapide :
                        </div>
                        <MathView latex={prereq.exampleLatex} display={true} />
                      </div>
                    )}

                    {/* Common Trap / Piège classique à éviter */}
                    {prereq.commonTrap && (
                      <div className="p-3 rounded-xl bg-red-50/50 dark:bg-rose-950/20 border border-red-200 dark:border-rose-900/40 text-xs flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 dark:text-rose-400 shrink-0 mt-0.5" />
                        <div className="text-red-950 dark:text-rose-200">
                          <span className="font-bold text-red-600 dark:text-rose-300">Piège fréquent : </span>
                          <span>{prereq.commonTrap}</span>
                        </div>
                      </div>
                    )}

                    {/* Quick Mini-Quiz (if available) */}
                    {prereq.quickCheck && (
                      <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-slate-800/80 space-y-2">
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-neutral-800 dark:text-slate-200">
                          <HelpCircle className="w-3.5 h-3.5 text-red-600 dark:text-sky-400" />
                          <span>Auto-évaluation flash :</span>
                        </div>

                        <div className="text-xs font-medium text-neutral-900 dark:text-slate-100 bg-neutral-100 dark:bg-slate-900 p-2 rounded-lg">
                          <MathView latex={prereq.quickCheck.question} display={false} />
                        </div>

                        <div className="grid grid-cols-1 gap-1.5">
                          {prereq.quickCheck.options.map((opt, optIdx) => {
                            const isChosen = selectedAnswerIdx === optIdx;
                            const showFeedback = selectedAnswerIdx !== undefined;

                            let btnStyle =
                              'bg-white dark:bg-slate-900 text-neutral-800 dark:text-slate-200 border-neutral-200 dark:border-slate-800 hover:bg-neutral-100 dark:hover:bg-slate-800';

                            if (showFeedback && opt.isCorrect) {
                              btnStyle =
                                'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-500 font-bold';
                            } else if (showFeedback && isChosen && !opt.isCorrect) {
                              btnStyle =
                                'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-500';
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => {
                                  setSelectedQuizAnswers((prev) => ({
                                    ...prev,
                                    [prereq.id]: optIdx,
                                  }));
                                  if (opt.isCorrect && !isMastered) {
                                    toggleMastered(prereq.id);
                                  }
                                }}
                                className={`text-left text-xs p-2 rounded-xl border transition-all flex items-center justify-between ${btnStyle}`}
                              >
                                <span>{opt.text}</span>
                                {showFeedback && opt.isCorrect && (
                                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                    Correct 
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {selectedAnswerIdx !== undefined && (
                          <div className="p-2 rounded-lg bg-neutral-50 dark:bg-slate-900 text-[11px] text-neutral-600 dark:text-slate-400">
                             {prereq.quickCheck.options[selectedAnswerIdx].explanation}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Link to related chapter in the app */}
                    {prereq.relatedChapterId && onNavigateToChapter && (
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            onNavigateToChapter(prereq.relatedChapterId!);
                            onClose();
                          }}
                          className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold text-red-600 dark:text-indigo-400 bg-red-50 dark:bg-indigo-950/40 hover:bg-red-100 dark:hover:bg-red-950 border border-red-200 dark:border-indigo-800 transition-colors"
                        >
                          <span>Revoir le cours complet correspondant</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Sticky Footer */}
            <div className="p-4 border-t border-neutral-200 dark:border-slate-800 bg-neutral-50 dark:bg-slate-900/90 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setMasteredIds([]);
                  try {
                    localStorage.removeItem(storageKey);
                  } catch {
                    // ignore
                  }
                }}
                className="flex items-center space-x-1 text-xs text-neutral-500 hover:text-neutral-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                title="Réinitialiser l'état des prérequis pour ce cours"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Réinitialiser</span>
              </button>

              <button
                onClick={onClose}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white text-black border-2 border-black hover:bg-neutral-100 dark:bg-red-600 dark:hover:bg-red-500 dark:text-white dark:border-transparent transition-all shadow-xs"
              >
                <span>Je suis prêt, accéder au cours</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
