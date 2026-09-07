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
          bg: 'bg-emerald-950/40',
          border: 'border-emerald-500/40',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          label: 'Niveau 1 : Facile',
          desc: 'Application directe & Définition',
          icon: Target,
          textColor: 'text-emerald-400'
        };
      case 'moyen':
        return {
          bg: 'bg-amber-950/40',
          border: 'border-amber-500/40',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          label: 'Niveau 2 : Moyen',
          desc: 'Entraînement type Brevet / Devoir',
          icon: Sparkles,
          textColor: 'text-amber-400'
        };
      case 'difficile':
      default:
        return {
          bg: 'bg-rose-950/40',
          border: 'border-rose-500/40',
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          label: 'Niveau 3 : Difficile',
          desc: 'Problème de synthèse & Démonstration',
          icon: Flame,
          textColor: 'text-rose-400'
        };
    }
  };

  return (
    <div id="student-exercises-section" className="mt-8 pt-6 border-t border-slate-800 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <BookOpen className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  Exercices d'application pour l'élève
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    3 Niveaux
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  Progressez étape par étape après ce cours : <span className="text-emerald-400 font-semibold">{chapterTitle}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="flex items-center space-x-3 bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-xl self-start md:self-auto">
            <Trophy className={`w-5 h-5 ${isAllCompleted ? 'text-amber-400 animate-bounce' : 'text-slate-400'}`} />
            <div>
              <div className="text-xs text-slate-400">Score de maîtrise</div>
              <div className="text-sm font-bold text-white font-mono">
                {completedCount} / {totalCount} réussis
              </div>
            </div>
            {completedCount > 0 && (
              <button
                onClick={handleResetProgress}
                title="Réinitialiser le suivi"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* All completed celebration */}
        {isAllCompleted && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm flex items-center justify-between animate-fadeIn">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Bravo !</strong> Vous avez validé les 3 exercices (Facile, Moyen et Difficile) pour ce cours !
              </span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-500 text-slate-950 rounded-md">
              100% Maîtrisé
            </span>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-800">
          <span className="text-xs text-slate-400 mr-1 font-medium">Filtrer par difficulté :</span>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-slate-700 text-white shadow-md'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Tous les exercices (3)
          </button>
          <button
            onClick={() => setActiveTab('facile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              activeTab === 'facile'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                : 'bg-slate-800/60 text-emerald-400 hover:bg-emerald-950/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>1. Facile</span>
          </button>
          <button
            onClick={() => setActiveTab('moyen')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              activeTab === 'moyen'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30'
                : 'bg-slate-800/60 text-amber-400 hover:bg-amber-950/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>2. Moyen</span>
          </button>
          <button
            onClick={() => setActiveTab('difficile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              activeTab === 'difficile'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-900/30'
                : 'bg-slate-800/60 text-rose-400 hover:bg-rose-950/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400" />
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
              className={`rounded-2xl border ${config.border} ${config.bg} p-5 sm:p-6 shadow-lg transition-all relative overflow-hidden`}
            >
              {/* Exercise Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center space-x-2.5">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${config.badgeBg}`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span>{config.label}</span>
                  </span>
                  <span className="text-xs text-slate-400 hidden sm:inline">•</span>
                  <span className="text-xs text-slate-300 font-medium">
                    {config.desc}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleCompleted(originalIdx)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                      isDone
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-900/40'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isDone ? 'Validé !' : 'Marquer comme réussi'}</span>
                  </button>
                </div>
              </div>

              {/* Title & Question Statement */}
              <div className="mt-4 space-y-2">
                {ex.title && (
                  <h3 className="text-sm font-bold text-slate-200">
                    {ex.title}
                  </h3>
                )}
                <div className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  {ex.question}
                </div>
              </div>

              {/* Interactive MCQ Choices (if available) */}
              {ex.options && ex.options.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Choisissez votre réponse :
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ex.options.map((opt, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      let btnStyle = 'bg-slate-900/90 border-slate-700/80 text-slate-200 hover:bg-slate-800 hover:border-slate-600';
                      
                      if (isSelected) {
                        btnStyle = opt.isCorrect
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-100 shadow-md ring-1 ring-emerald-500'
                          : 'bg-rose-950/80 border-rose-500 text-rose-100 shadow-md ring-1 ring-rose-500';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(originalIdx, optIdx)}
                          className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all ${btnStyle}`}
                        >
                          <div className="flex items-start space-x-2">
                            <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <div className="flex-1">
                              <div>{opt.text}</div>
                              {isSelected && opt.explanation && (
                                <div className={`text-xs mt-1.5 font-normal ${opt.isCorrect ? 'text-emerald-300' : 'text-rose-300'}`}>
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
              <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800/80">
                {/* Hint Button */}
                <button
                  onClick={() => toggleHint(originalIdx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                    isHintOpen
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-amber-300 border border-slate-700'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{isHintOpen ? 'Masquer l\'indice' : 'Besoin d\'un indice ?'}</span>
                </button>

                {/* Solution Button */}
                <button
                  onClick={() => toggleSolution(originalIdx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                    isSolutionOpen
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                      : 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30'
                  }`}
                >
                  {isSolutionOpen ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{isSolutionOpen ? 'Masquer le corrigé rédigé' : 'Voir le corrigé rédigé'}</span>
                </button>
              </div>

              {/* Revealed Hint Box */}
              {isHintOpen && (
                <div className="mt-3 p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs sm:text-sm text-amber-200 animate-fadeIn flex items-start space-x-2">
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-300">💡 Indice de résolution : </span>
                    {ex.hint}
                  </div>
                </div>
              )}

              {/* Revealed Detailed Solution Box */}
              {isSolutionOpen && (
                <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-emerald-500/30 text-slate-200 animate-fadeIn space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Solution rédigée pas-à-pas :</span>
                  </div>

                  {/* MathView for key LaTeX formula */}
                  {ex.answerLatex && (
                    <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-emerald-200 overflow-x-auto text-xs sm:text-sm">
                      <MathView latex={ex.answerLatex} display={true} />
                    </div>
                  )}

                  {/* Step by step explanations */}
                  {ex.detailedSolution && ex.detailedSolution.length > 0 && (
                    <div className="space-y-1.5 text-xs sm:text-sm text-slate-300 pt-1">
                      {ex.detailedSolution.map((stepLine, sIdx) => (
                        <div key={sIdx} className="flex items-start space-x-2">
                          <span className="text-emerald-400 font-bold">•</span>
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
