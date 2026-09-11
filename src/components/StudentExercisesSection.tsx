import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  Eye, 
  EyeOff, 
  Trophy, 
  Sparkles, 
  Target, 
  Flame, 
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { CourseExercise } from '../coursesData';
import { MathView } from './MathView';

interface StudentExercisesSectionProps {
  chapterId: string;
  chapterTitle: string;
  exercises: CourseExercise[];
}

export const StudentExercisesSection: React.FC<StudentExercisesSectionProps> = ({
  chapterId,
  chapterTitle,
  exercises
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'facile' | 'moyen' | 'difficile'>('all');
  const [revealedHints, setRevealedHints] = useState<Record<number, boolean>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<number, boolean>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});

  // Load completed exercises from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`math3d_completed_${chapterId}`);
      if (saved) {
        setCompletedExercises(JSON.parse(saved));
      } else {
        setCompletedExercises({});
      }
    } catch {
      // ignore
    }
  }, [chapterId]);

  const toggleHint = (idx: number) => {
    setRevealedHints(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleSolution = (idx: number) => {
    setRevealedSolutions(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleSelectOption = (exerciseIdx: number, optionIdx: number) => {
    setSelectedOptions(prev => ({ ...prev, [exerciseIdx]: optionIdx }));
  };

  const toggleCompleted = (idx: number) => {
    setCompletedExercises(prev => {
      const updated = { ...prev, [idx]: !prev[idx] };
      try {
        localStorage.setItem(`math3d_completed_${chapterId}`, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleResetProgress = () => {
    setCompletedExercises({});
    setSelectedOptions({});
    setRevealedHints({});
    setRevealedSolutions({});
    try {
      localStorage.removeItem(`math3d_completed_${chapterId}`);
    } catch {
      // ignore
    }
  };

  const completedCount = Object.values(completedExercises).filter(Boolean).length;
  const totalCount = exercises.length;
  const isAllCompleted = completedCount >= totalCount && totalCount > 0;

  const filteredExercises = exercises.map((ex, idx) => ({ ex, originalIdx: idx })).filter(item => {
    if (activeTab === 'all') return true;
    return item.ex.difficulty === activeTab;
  });

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'facile':
        return {
          bg: 'bg-white dark:bg-emerald-950/40',
          border: 'border-neutral-300 dark:border-emerald-500/40',
          badgeBg: 'bg-neutral-100 text-black border-neutral-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40',
          label: 'Niveau 1 : Facile',
          desc: 'Application directe & Définition',
          icon: Target,
          textColor: 'text-black dark:text-emerald-400'
        };
      case 'moyen':
        return {
          bg: 'bg-white dark:bg-amber-950/40',
          border: 'border-neutral-300 dark:border-amber-500/40',
          badgeBg: 'bg-neutral-100 text-black border-neutral-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40',
          label: 'Niveau 2 : Moyen',
          desc: 'Entraînement type Brevet / Devoir',
          icon: Sparkles,
          textColor: 'text-black dark:text-amber-400'
        };
      case 'difficile':
      default:
        return {
          bg: 'bg-white dark:bg-rose-950/40',
          border: 'border-neutral-300 dark:border-rose-500/40',
          badgeBg: 'bg-white text-black border-neutral-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/40',
          label: 'Niveau 3 : Difficile',
          desc: 'Problème de synthèse & Démonstration',
          icon: Flame,
          textColor: 'text-red-600 dark:text-rose-400'
        };
    }
  };

  return (
    <div id="student-exercises-section" className="mt-8 pt-6 border-t border-neutral-200 dark:border-slate-800 space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-900/90 dark:to-emerald-950/40 border border-neutral-300 dark:border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-xs dark:shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="p-2 rounded-xl bg-neutral-100 text-black border border-neutral-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30">
                <BookOpen className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-black dark:text-white flex items-center gap-2">
                  Exercices d'application pour l'élève
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-neutral-100 text-black border border-neutral-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30">
                    3 Niveaux
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-slate-300 mt-0.5">
                  Progressez étape par étape après ce cours : <span className="text-red-600 dark:text-emerald-400 font-semibold">{chapterTitle}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="flex items-center space-x-3 bg-neutral-50 dark:bg-slate-950/80 border border-neutral-300 dark:border-slate-800 px-4 py-2.5 rounded-xl self-start md:self-auto">
            <Trophy className={`w-5 h-5 ${isAllCompleted ? 'text-red-600 dark:text-amber-400 animate-bounce' : 'text-neutral-500 dark:text-slate-400'}`} />
            <div>
              <div className="text-xs text-neutral-500 dark:text-slate-400">Score de maîtrise</div>
              <div className="text-sm font-bold text-black dark:text-white font-mono">
                {completedCount} / {totalCount} réussis
              </div>
            </div>
            {completedCount > 0 && (
              <button
                onClick={handleResetProgress}
                title="Réinitialiser le suivi"
                className="p-1.5 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-200 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* All completed celebration */}
        {isAllCompleted && (
          <div className="mt-4 p-3 rounded-xl bg-neutral-100 dark:bg-emerald-950/60 border border-neutral-300 dark:border-emerald-500/40 text-black dark:text-emerald-200 text-xs sm:text-sm flex items-center justify-between animate-fadeIn">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-red-600 dark:text-emerald-400 shrink-0" />
              <span>
                <strong>Bravo !</strong> Vous avez validé les 3 exercices (Facile, Moyen et Difficile) pour ce cours !
              </span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 bg-black text-white dark:bg-emerald-500 dark:text-slate-950 rounded-md">
              100% Maîtrisé
            </span>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-neutral-200 dark:border-slate-800">
          <span className="text-xs text-neutral-500 dark:text-slate-400 mr-1 font-medium">Filtrer par difficulté :</span>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-black text-white dark:bg-slate-700 dark:text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Tous les exercices (3)
          </button>
          <button
            onClick={() => setActiveTab('facile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              activeTab === 'facile'
                ? 'bg-black text-white dark:bg-emerald-600 shadow-xs'
                : 'bg-neutral-100 text-black hover:bg-neutral-200 dark:bg-slate-800/60 dark:text-emerald-400 dark:hover:bg-emerald-950/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-black dark:bg-emerald-400" />
            <span>1. Facile</span>
          </button>
          <button
            onClick={() => setActiveTab('moyen')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              activeTab === 'moyen'
                ? 'bg-black text-white dark:bg-amber-600 shadow-xs'
                : 'bg-neutral-100 text-black hover:bg-neutral-200 dark:bg-slate-800/60 dark:text-amber-400 dark:hover:bg-amber-950/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-black dark:bg-amber-400" />
            <span>2. Moyen</span>
          </button>
          <button
            onClick={() => setActiveTab('difficile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              activeTab === 'difficile'
                ? 'bg-black text-white dark:bg-rose-600 shadow-xs'
                : 'bg-white text-black hover:bg-neutral-100 border border-neutral-300 dark:border-neutral-700 dark:bg-slate-800/60 dark:text-rose-400 dark:hover:bg-rose-950/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-600 dark:bg-rose-400" />
            <span>3. Difficile</span>
          </button>
        </div>
      </div>

      {/* Exercises List */}
      <div className="space-y-5">
        {filteredExercises.map(({ ex, originalIdx }) => {
          const config = getDifficultyColor(ex.difficulty);
          const Icon = config.icon;
          const isHintOpen = !!revealedHints[originalIdx];
          const isSolutionOpen = !!revealedSolutions[originalIdx];
          const selectedOpt = selectedOptions[originalIdx];
          const isDone = !!completedExercises[originalIdx];

          return (
            <div
              key={originalIdx}
              id={`exercise-card-${originalIdx}`}
              className={`rounded-2xl border ${config.border} ${config.bg} p-5 sm:p-6 shadow-xs dark:shadow-lg transition-all relative overflow-hidden`}
            >
              {/* Exercise Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-slate-800/80">
                <div className="flex items-center space-x-2.5">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${config.badgeBg}`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span>{config.label}</span>
                  </span>
                  <span className="text-xs text-neutral-600 dark:text-slate-400 hidden sm:inline">•</span>
                  <span className="text-xs text-neutral-600 dark:text-slate-300 font-medium">
                    {config.desc}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleCompleted(originalIdx)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                      isDone
                        ? 'bg-black text-white dark:bg-emerald-500 dark:text-slate-950 shadow-xs'
                        : 'bg-neutral-100 text-black hover:bg-neutral-200 border border-neutral-300 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white dark:border-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-500 dark:text-white" />
                    <span>{isDone ? 'Validé !' : 'Marquer comme réussi'}</span>
                  </button>
                </div>
              </div>

              {/* Title & Question Statement */}
              <div className="mt-4 space-y-2">
                {ex.title && (
                  <h3 className="text-sm font-bold text-black dark:text-slate-200">
                    {ex.title}
                  </h3>
                )}
                <div className="text-sm sm:text-base text-black dark:text-slate-100 font-medium leading-relaxed bg-neutral-50 dark:bg-slate-950/60 p-4 rounded-xl border border-neutral-300 dark:border-slate-800">
                  {ex.question}
                </div>
              </div>

              {/* Interactive MCQ Choices (if available) */}
              {ex.options && ex.options.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="text-xs font-semibold text-neutral-700 dark:text-slate-300 uppercase tracking-wider">
                    Choisissez votre réponse :
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ex.options.map((opt, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      let btnStyle = 'bg-white dark:bg-slate-900/90 border-neutral-300 dark:border-slate-700/80 text-black dark:text-slate-200 hover:bg-neutral-100 dark:hover:bg-slate-800';
                      
                      if (isSelected) {
                        btnStyle = opt.isCorrect
                          ? 'bg-white border-2 border-black text-black font-bold dark:bg-emerald-950/80 dark:border-emerald-500 dark:text-emerald-100 shadow-md'
                          : 'bg-white border-2 border-red-300 text-red-600 font-bold dark:bg-rose-950/80 dark:border-rose-500 dark:text-rose-100 shadow-md';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(originalIdx, optIdx)}
                          className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all ${btnStyle}`}
                        >
                          <div className="flex items-start space-x-2">
                            <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${
                              isSelected ? 'bg-slate-900 text-white border-2 border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100 font-bold' : 'border-current'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <div className="flex-1">
                              <div>{opt.text}</div>
                              {isSelected && opt.explanation && (
                                <div className={`text-xs mt-1.5 font-normal ${opt.isCorrect ? 'text-black font-medium dark:text-emerald-300' : 'text-red-600 dark:text-rose-300'}`}>
                                  {opt.explanation}
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Interactive Action Bar: Hint & Solution Toggles */}
              <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-neutral-200 dark:border-slate-800/80">
                {/* Hint Button (N.B.) */}
                <button
                  onClick={() => toggleHint(originalIdx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                    isHintOpen
                      ? 'bg-white text-black border-2 border-black font-bold shadow-xs dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40'
                      : 'bg-white text-black hover:bg-neutral-100 border border-neutral-300 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-amber-300 dark:border-slate-700'
                  }`}
                >
                  <HelpCircle className={`w-3.5 h-3.5 ${isHintOpen ? 'text-black dark:text-amber-400' : 'text-red-600 dark:text-amber-300'}`} />
                  <span>{isHintOpen ? 'Masquer le N.B. / indice' : 'N.B. / Besoin d\'un indice ?'}</span>
                </button>

                {/* Solution Button */}
                <button
                  onClick={() => toggleSolution(originalIdx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                    isSolutionOpen
                      ? 'bg-white text-black border-2 border-black font-bold shadow-xs dark:bg-emerald-600/30 dark:text-emerald-300 dark:border-emerald-500/40'
                      : 'bg-white text-black hover:bg-neutral-100 border border-neutral-300 dark:bg-emerald-600/20 dark:text-emerald-400 dark:hover:bg-emerald-600/30 dark:border-emerald-500/30'
                  }`}
                >
                  {isSolutionOpen ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{isSolutionOpen ? 'Masquer le corrigé rédigé' : 'Voir le corrigé rédigé'}</span>
                </button>
              </div>

              {/* Revealed Hint Box (N.B.) */}
              {isHintOpen && (
                <div className="mt-3 p-3 rounded-xl bg-neutral-100 border border-neutral-300 text-xs sm:text-sm text-black dark:bg-amber-950/40 dark:border-amber-500/30 dark:text-amber-200 animate-fadeIn flex items-start space-x-2">
                  <HelpCircle className="w-4 h-4 text-red-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-red-600 dark:text-amber-300">N.B. / Indice de résolution : </span>
                    <span>{ex.hint}</span>
                  </div>
                </div>
              )}

              {/* Revealed Detailed Solution Box */}
              {isSolutionOpen && (
                <div className="mt-3 p-4 rounded-xl bg-neutral-50 border border-neutral-300 text-black dark:bg-slate-950 dark:border-emerald-500/30 dark:text-slate-200 animate-fadeIn space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-bold text-black dark:text-emerald-400 uppercase tracking-wider border-b border-neutral-200 dark:border-slate-800 pb-2">
                    <CheckCircle2 className="w-4 h-4 text-red-600 dark:text-emerald-400" />
                    <span>Solution rédigée pas-à-pas :</span>
                  </div>

                  {/* MathView for key LaTeX formula */}
                  {ex.answerLatex && (
                    <div className="p-2.5 rounded-lg bg-white border border-neutral-300 text-black dark:bg-emerald-950/30 dark:border-emerald-500/20 dark:text-emerald-200 overflow-x-auto text-xs sm:text-sm">
                      <MathView latex={ex.answerLatex} display={true} />
                    </div>
                  )}

                  {/* Step by step explanations */}
                  {ex.detailedSolution && ex.detailedSolution.length > 0 && (
                    <div className="space-y-1.5 text-xs sm:text-sm text-neutral-800 dark:text-slate-300 pt-1">
                      {ex.detailedSolution.map((stepLine, sIdx) => (
                        <div key={sIdx} className="flex items-start space-x-2">
                          <span className="text-red-600 dark:text-emerald-400 font-bold">•</span>
                          <span>{stepLine}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
