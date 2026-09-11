import React, { useState, useEffect } from 'react';
import { CourseChapter, CourseDemo } from '../coursesData';
import { getQuickQuizForChapter, QuickQuizData, QuickQuizQuestion } from '../data/getQuickQuiz';
import { MathView } from './MathView';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  Zap,
  Timer,
  ArrowDown,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';

interface QuickQuizProps {
  chapter: CourseChapter;
  demo?: CourseDemo;
  onScrollToExercises?: () => void;
}

export const QuickQuiz: React.FC<QuickQuizProps> = ({
  chapter,
  demo,
  onScrollToExercises,
}) => {
  const quizData: QuickQuizData = getQuickQuizForChapter(chapter, demo);
  const questions: QuickQuizQuestion[] = quizData.questions;

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isTimedMode, setIsTimedMode] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(30);

  // Reset state when chapter changes
  useEffect(() => {
    setCurrentIdx(0);
    setSelectedOptionIdx(null);
    setAnswers({});
    setIsSubmitted(false);
    setIsCompleted(false);
    setScore(0);
    setTimeLeft(30);
  }, [chapter.id]);

  // Timer countdown if enabled
  useEffect(() => {
    if (!isTimedMode || isCompleted || isSubmitted) return;

    if (timeLeft <= 0) {
      // Auto-submit current selection or mark wrong
      handleOptionSelect(0); // fallback selection
      setIsSubmitted(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimedMode, isCompleted, isSubmitted, timeLeft]);

  const currentQ = questions[currentIdx] || questions[0];
  const progressPercent = Math.round(((currentIdx + 1) / questions.length) * 100);

  const handleOptionSelect = (idx: number) => {
    if (isSubmitted) return; // Prevent changing after submission
    setSelectedOptionIdx(idx);
    setIsSubmitted(true);
    setAnswers((prev) => ({ ...prev, [currentIdx]: idx }));

    const option = currentQ.options[idx];
    if (option?.isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOptionIdx(null);
      setIsSubmitted(false);
      setTimeLeft(30);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOptionIdx(null);
    setAnswers({});
    setIsSubmitted(false);
    setIsCompleted(false);
    setScore(0);
    setTimeLeft(30);
  };

  const scorePercentage = Math.round((score / questions.length) * 100);

  return (
    <div
      id="quick-quiz-section"
      className="bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 border border-neutral-300 dark:border-indigo-500/25 rounded-2xl p-4 sm:p-6 shadow-xs dark:shadow-xl relative overflow-hidden my-6 transition-colors"
    >
      {/* Decorative ambient background accent - dark mode only */}
      <div className="hidden dark:block absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="hidden dark:block absolute bottom-0 left-0 w-60 h-60 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200 dark:border-slate-800/80 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white dark:bg-gradient-to-br dark:from-indigo-500 dark:to-emerald-500 flex items-center justify-center shadow-xs dark:shadow-indigo-500/20 shrink-0">
            <Zap className="w-5 h-5 text-amber-700 dark:text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-base sm:text-lg text-neutral-900 dark:text-white flex items-center gap-2">
                <span>Quiz Rapide : Teste tes acquis !</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-300 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30">
                {quizData.badge}
              </span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-slate-400 mt-0.5">
              Vérifie en 2 minutes que tu as bien assimilé la leçon sur{' '}
              <span className="text-sky-700 dark:text-indigo-300 font-semibold">{chapter.shortTitle || chapter.title}</span>
            </p>
          </div>
        </div>

        {/* Timed mode toggle button */}
        {!isCompleted && (
          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <button
              onClick={() => {
                setIsTimedMode((prev) => !prev);
                setTimeLeft(30);
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors border ${
                isTimedMode
                  ? 'bg-amber-50 text-amber-900 border-2 border-amber-500 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:bg-slate-800/80 dark:text-slate-400 dark:border-slate-700 dark:hover:text-slate-200'
              }`}
              title="Activer le chronomètre 30s par question"
            >
              <Timer className="w-3.5 h-3.5 text-amber-600 dark:text-amber-300" />
              <span>Chrono express {isTimedMode ? `(${timeLeft}s)` : 'Off'}</span>
            </button>
          </div>
        )}
      </div>

      {/* BODY: Active Question OR Completion Results */}
      {!isCompleted ? (
        <div className="mt-5 space-y-4 relative z-10">
          {/* Progress bar and counter */}
          <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-slate-400">
            <span className="font-semibold text-neutral-900 dark:text-slate-300">
              Question {currentIdx + 1} sur {questions.length}
            </span>
            <span className="font-mono text-sky-700 dark:text-indigo-400 font-bold">{progressPercent}%</span>
          </div>

          <div className="w-full bg-neutral-200 dark:bg-slate-800/80 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-sky-500 dark:from-indigo-500 dark:to-emerald-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Question Box */}
          <div className="bg-white dark:bg-slate-950/70 border border-sky-200/80 dark:border-slate-800 rounded-xl p-4 sm:p-5 mt-3 shadow-xs">
            <div className="flex items-start space-x-2.5">
              <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-sky-300 dark:bg-indigo-950 dark:text-indigo-400 dark:border-indigo-700/50">
                Q{currentIdx + 1}
              </span>
              <div className="flex-1">
                <p className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-slate-100 leading-relaxed">
                  {currentQ.question}
                </p>

                {currentQ.questionLatex && (
                  <div className="my-2.5 py-1.5 px-3 rounded-lg bg-sky-50/70 dark:bg-slate-900/90 border border-sky-200 dark:border-slate-800 text-sky-950 dark:text-emerald-300 font-mono text-sm overflow-x-auto inline-block">
                    <MathView latex={currentQ.questionLatex} display={false} />
                  </div>
                )}
              </div>
            </div>

            {/* Multiple Choice Options */}
            <div className="mt-4 space-y-2.5">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedOptionIdx === optIdx;
                const letter = String.fromCharCode(65 + optIdx); // A, B, C

                let stateClasses = 'bg-white dark:bg-slate-900/90 border-neutral-300 dark:border-slate-800 hover:border-sky-400 hover:bg-sky-50/40 dark:hover:border-indigo-500/50 dark:hover:bg-slate-800/60 text-neutral-800 dark:text-slate-200 cursor-pointer';

                if (isSelected && !isSubmitted) {
                  stateClasses = 'bg-sky-50 border-2 border-sky-300 text-sky-950 font-bold shadow-xs dark:bg-emerald-950/80 dark:border-emerald-500 dark:text-emerald-100 cursor-pointer';
                }

                if (isSubmitted) {
                  if (opt.isCorrect) {
                    stateClasses = 'bg-emerald-50 border-2 border-emerald-300 text-emerald-950 font-bold dark:bg-emerald-950/80 dark:border-emerald-500/80 dark:text-emerald-100 cursor-default shadow-xs';
                  } else if (isSelected && !opt.isCorrect) {
                    stateClasses = 'bg-rose-50 border-2 border-rose-500 text-rose-950 font-bold dark:bg-rose-950/80 dark:border-rose-500/80 dark:text-rose-100 cursor-default shadow-xs';
                  } else {
                    stateClasses = 'bg-neutral-50/60 dark:bg-slate-900/40 border-neutral-200 dark:border-slate-800/60 text-neutral-600 dark:text-slate-400 opacity-50 cursor-default';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    disabled={isSubmitted}
                    onClick={() => handleOptionSelect(optIdx)}
                    className={`w-full text-left p-3 sm:p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between group ${stateClasses}`}
                  >
                    <div className="flex items-center space-x-3 pr-2">
                      <span
                        className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 border transition-colors ${
                          isSubmitted && opt.isCorrect
                            ? 'bg-emerald-600 text-white border-emerald-300 font-bold dark:bg-emerald-500 dark:text-slate-950 dark:border-emerald-400'
                            : isSubmitted && isSelected && !opt.isCorrect
                            ? 'bg-rose-600 text-white border-rose-300 font-bold dark:bg-rose-500 dark:text-white dark:border-rose-400'
                            : isSelected
                            ? 'bg-sky-600 text-white border-sky-300 dark:border-sky-600 font-bold dark:bg-emerald-500 dark:text-slate-950'
                            : 'bg-neutral-100 text-neutral-700 border-neutral-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 group-hover:bg-sky-100 dark:group-hover:bg-sky-950 group-hover:text-sky-800 group-hover:border-sky-300 dark:group-hover:border-indigo-400 dark:group-hover:text-indigo-300'
                        }`}
                      >
                        {letter}
                      </span>

                      <div className="text-xs sm:text-sm font-medium">
                        <span>{opt.text}</span>
                        {opt.latex && (
                          <span className="ml-2 inline-block font-mono text-sky-950 dark:text-emerald-300">
                            <MathView latex={opt.latex} display={false} />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Icons */}
                    {isSubmitted && opt.isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    )}
                    {isSubmitted && isSelected && !opt.isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Instant Feedback & Pedagogical Explanation (Bleu & Vert in Light Mode) */}
            {isSubmitted && selectedOptionIdx !== null && (
              <div
                className={`mt-4 p-4 rounded-xl border text-xs leading-relaxed animate-in fade-in duration-200 space-y-3 ${
                  currentQ.options[selectedOptionIdx]?.isCorrect
                    ? 'bg-emerald-50/90 border border-emerald-300 text-emerald-950 dark:bg-emerald-950/30 dark:border-emerald-500/40 dark:text-emerald-300'
                    : 'bg-rose-50/90 border border-rose-300 text-rose-950 dark:bg-rose-950/30 dark:border-rose-500/40 dark:text-rose-300'
                }`}
              >
                {/* Result header line */}
                <div className="flex items-center space-x-2">
                  {currentQ.options[selectedOptionIdx]?.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <HelpCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  )}
                  <p className="font-bold text-xs sm:text-sm">
                    {currentQ.options[selectedOptionIdx]?.feedback}
                  </p>
                </div>

                {/* Pedagogical Explanation Box - BLEU in Light Mode */}
                <div className="p-3 rounded-lg bg-sky-50 border border-sky-200 text-sky-950 dark:bg-slate-900/80 dark:border-slate-800 dark:text-slate-300 space-y-1">
                  <div className="flex items-center space-x-1.5 text-sky-800 dark:text-sky-300 font-bold text-xs">
                    <HelpCircle className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                    <span>Explication pédagogique du cours :</span>
                  </div>
                  <p className="text-sky-950/90 dark:text-slate-300 text-xs leading-relaxed">
                    {currentQ.explanation}
                  </p>
                </div>

                {/* Pedagogical Rule Reminder / NB - VERT in Light Mode */}
                {currentQ.ruleReminder && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-950 dark:bg-emerald-950/40 dark:border-emerald-800/40 dark:text-emerald-300 space-y-1">
                    <div className="flex items-center space-x-1.5 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                      <Lightbulb className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Règle d'or & N.B. à retenir :</span>
                    </div>
                    <p className="text-emerald-950 font-medium dark:text-emerald-100 text-xs leading-relaxed">
                      {currentQ.ruleReminder}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Footer Button */}
          {isSubmitted && (
            <div className="flex justify-end pt-1">
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all shadow-xs dark:bg-gradient-to-r dark:from-indigo-500 dark:to-indigo-600 dark:hover:from-indigo-400 dark:hover:to-indigo-500 flex items-center space-x-2 cursor-pointer"
              >
                <span>
                  {currentIdx < questions.length - 1 ? 'Question suivante' : 'Voir mes résultats'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* RESULTS & MASTERY ASSESSMENT */
        <div className="mt-5 space-y-6 text-center py-4 relative z-10">
          <div className="inline-flex flex-col items-center">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center border-2 mb-3 shadow-xs ${
                scorePercentage >= 80
                  ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-400 dark:text-emerald-400'
                  : scorePercentage >= 50
                  ? 'bg-sky-50 border-2 border-sky-500 text-sky-700 dark:bg-amber-500/10 dark:border-amber-400 dark:text-amber-400'
                  : 'bg-rose-50 border-2 border-rose-500 text-rose-700 dark:bg-rose-500/10 dark:border-rose-400 dark:text-rose-400'
              }`}
            >
              <Award className="w-10 h-10" />
            </div>

            <h4 className="text-xl font-bold text-neutral-900 dark:text-white">
              Score : {score} / {questions.length} ({scorePercentage}%)
            </h4>

            <p className="text-xs sm:text-sm text-neutral-700 dark:text-slate-300 max-w-md mt-1.5">
              {scorePercentage === 100
                ? ' Excellent travail ! Les notions clés de cette leçon sont parfaitement acquises pour les devoirs et le BFEM.'
                : scorePercentage >= 60
                ? ' Bien joué ! Tu as compris les principes essentiels, quelques détails méritent d’être revus.'
                : ' Bon début ! Revois les étapes animées de la leçon ci-dessus et retente le quiz pour valider tes acquis.'}
            </p>
          </div>

          {/* Question by question recap chips */}
          <div className="max-w-md mx-auto grid grid-cols-3 gap-2 text-xs">
            {questions.map((q, idx) => {
              const selectedOpt = answers[idx];
              const isCorrect = q.options[selectedOpt]?.isCorrect;
              return (
                <div
                  key={idx}
                  className={`p-2 rounded-xl border flex items-center justify-center space-x-1.5 font-medium ${
                    isCorrect
                      ? 'bg-emerald-50 border border-emerald-300 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-500/40 dark:text-emerald-300 shadow-xs'
                      : 'bg-rose-50 border border-rose-300 text-rose-900 dark:bg-rose-950/40 dark:border-rose-500/40 dark:text-rose-300 shadow-xs'
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  )}
                  <span>Question {idx + 1}</span>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-800 font-semibold text-xs transition-colors flex items-center justify-center space-x-2 border border-neutral-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Recommencer le Quiz</span>
            </button>

            {onScrollToExercises && (
              <button
                onClick={onScrollToExercises}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
              >
                <ArrowDown className="w-4 h-4 text-slate-900 dark:text-white" />
                <span>Passer aux Exercices (Facile, Moyen, Difficile)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
