import React, { useState, useEffect, useCallback } from 'react';
import { ExpressionSolution } from './types';
import { Header } from './components/Header';
import { CourseSidebar } from './components/CourseSidebar';
import { InteractiveLessonViewer } from './components/InteractiveLessonViewer';
import { ExpressionInput } from './components/ExpressionInput';
import { AlgebraStage } from './components/AlgebraStage';
import { AlgebraProgressionCard } from './components/AlgebraProgressionCard';
import { Math3DViewer } from './components/Math3DViewer';
import { StepPlayer } from './components/StepPlayer';
import { BlackboardDrawer } from './components/blackboard/BlackboardDrawer';
import { AlgebraRemindersSection } from './components/AlgebraRemindersSection';
import {
  ALL_SENEGAL_COURSES,
  SENEGAL_COURSES_3E,
  SENEGAL_COURSES_4E,
  SENEGAL_COURSES_5E,
  CourseChapter,
} from './coursesData';
import { Sparkles, BookOpen, GraduationCap, ArrowRight } from 'lucide-react';
import { apiClient } from './api/apiClient';

export default function App() {
  // Grade Level Filter ('3e' | '4e' | '5e' | 'all') - Defaults to 3e per user request
  const [selectedGrade, setSelectedGrade] = useState<'all' | '3e' | '4e' | '5e'>('3e');

  // Navigation State
  const [activeTab, setActiveTab] = useState<'courses' | 'algebra-sandbox'>('courses');
  const [activeChapterId, setActiveChapterId] = useState<string>('racine-carree-3e');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true;
  });

  // Responsive sidebar handling on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle changing grade level
  const handleSelectGrade = (grade: 'all' | '3e' | '4e' | '5e') => {
    setSelectedGrade(grade);
    if (grade === '5e') {
      setActiveChapterId(SENEGAL_COURSES_5E[0].id);
    } else if (grade === '4e') {
      setActiveChapterId(SENEGAL_COURSES_4E[0].id);
    } else if (grade === '3e') {
      setActiveChapterId(SENEGAL_COURSES_3E[0].id);
    }
  };

  // Classroom & Teacher Mode
  const [isClassroomMode, setIsClassroomMode] = useState<boolean>(true);

  // Algebra Sandbox State
  const [activeSolution, setActiveSolution] = useState<ExpressionSolution | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [activeMode, setActiveMode] = useState<'algebra' | 'geometry'>('algebra');
  const [isBlackboardOpen, setIsBlackboardOpen] = useState<boolean>(false);

  const currentChapter: CourseChapter =
    ALL_SENEGAL_COURSES.find((c) => c.id === activeChapterId) || ALL_SENEGAL_COURSES[0];

  // Resolve custom expression through 3-tier pipeline
  const handleResolve = useCallback(
    async (expr: string, opType: string = 'expansion') => {
      setIsLoading(true);
      setErrorMsg(null);
      setIsCompleted(false);

      try {
        const solution: ExpressionSolution = await apiClient.resolveExpression(expr, opType);
        setActiveSolution(solution);
        setCurrentStepIndex(0);
      } catch (err: any) {
        console.error('Error resolving expression:', err);
        setErrorMsg(err.message || 'Impossible de résoudre cette expression.');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Pre-load default algebra expression
  useEffect(() => {
    handleResolve('(x+1)(x+2)', 'expansion');
  }, [handleResolve]);

  const handleStepChange = (index: number) => {
    setCurrentStepIndex(index);
    if (index === (activeSolution?.steps.length ?? 1) - 1) {
      setIsCompleted(true);
    }
  };

  const handleOpenAlgebraWithExpr = (expr: string) => {
    setActiveTab('algebra-sandbox');
    handleResolve(expr, 'expansion');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0B1120] dark:text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white transition-colors duration-200 relative z-0">
      {/* Decorative Glow */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-indigo-500/10 via-emerald-500/5 to-transparent dark:from-indigo-500/10 dark:via-emerald-500/5 pointer-events-none -z-10" />

      {/* Top Header */}
      <Header
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        activeChapterId={activeChapterId}
        onSelectChapter={setActiveChapterId}
        isClassroomMode={isClassroomMode}
        onToggleClassroomMode={() => setIsClassroomMode((prev) => !prev)}
        activeMode={activeMode}
        onSelectMode={setActiveMode}
        selectedGrade={selectedGrade}
        onSelectGrade={handleSelectGrade}
        onOpenBlackboard={() => setIsBlackboardOpen(true)}
      />

      {/* Main Body with Sidebar and Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Course Menu Sidebar */}
        {activeTab === 'courses' && (
          <CourseSidebar
            activeChapterId={activeChapterId}
            onSelectChapter={(id) => {
              setActiveChapterId(id);
            }}
            isOpen={isSidebarOpen}
            onCloseMobile={() => setIsSidebarOpen(false)}
            selectedGrade={selectedGrade}
            onSelectGrade={handleSelectGrade}
          />
        )}

        {/* Central Stage / Content Area */}
        <main className="flex-1 overflow-y-auto p-2 sm:p-4 lg:p-6 flex flex-col space-y-4 max-w-full min-w-0">
          {/* Teacher Classroom Mode Banner */}
          {isClassroomMode && (
            <div className="px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-emerald-950/40 border border-neutral-300 border-l-4 border-l-red-600 dark:border-emerald-500/30 dark:border-l text-xs text-neutral-900 dark:text-emerald-200 flex flex-wrap items-center justify-between gap-2 shadow-xs transition-colors">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-red-600 dark:text-emerald-400 shrink-0" />
                <span className="font-bold text-black dark:text-white">Espace Démo Professeur :</span>
                <span>
                  Programme officiel de Mathématiques Collège Sénégal (3ème BFEM & 4ème) — fiches, vidéos et démos interactives heuristiques.
                </span>
              </div>
              <div className="flex items-center space-x-2 text-[11px]">
                <span className="bg-neutral-100 text-black dark:bg-amber-500/20 dark:text-amber-300 font-mono px-2 py-0.5 rounded border border-neutral-300 dark:border-amber-500/30 font-bold">
                  {currentChapter.gradeLevel === '3e' || currentChapter.id.endsWith('-3e') ? '3ème BFEM' : '4ème'}
                </span>
                <span className="bg-neutral-100 text-black dark:bg-emerald-500/20 dark:text-emerald-300 font-mono px-2 py-0.5 rounded border border-neutral-300 dark:border-emerald-500/30">
                  {currentChapter.shortTitle}
                </span>
              </div>
            </div>
          )}

          {/* TAB 1: CURRICULUM CHAPTERS (3E & 4E) */}
          {activeTab === 'courses' && (
            <InteractiveLessonViewer
              chapter={currentChapter}
              onOpenAlgebraSolver={handleOpenAlgebraWithExpr}
              onSelectChapter={(id) => setActiveChapterId(id)}
            />
          )}

          {/* TAB 2: CUSTOM ALGEBRAIC SOLVER (Calcul Libre) */}
          {activeTab === 'algebra-sandbox' && (
            <div className="flex flex-col space-y-4">
              <div className="bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-200/40 dark:shadow-none transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-black dark:text-white flex items-center gap-2">
                      <span>Calcul Algébrique Libre : Développer & Factoriser</span>
                    </h2>
                    <p className="text-xs text-neutral-600 dark:text-slate-400 mt-0.5">
                      Saisissez n'importe quelle expression ou choisissez un exemple ci-dessous.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('courses')}
                    className="text-xs text-red-600 dark:text-emerald-400 hover:underline font-semibold"
                  >
                    Retour aux cours
                  </button>
                </div>

                <ExpressionInput
                  onResolve={handleResolve}
                  isLoading={isLoading}
                  activeSolution={activeSolution}
                />
              </div>

              {/* Fiches Rappels de Cours (Puissances, Signes dans ℤ, Identités Remarquables) */}
              <AlgebraRemindersSection
                onSelectExample={(expr, op) => handleResolve(expr, op)}
                isOpenDefault={false}
              />

              {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-sm flex items-center justify-between">
                  <span>{errorMsg}</span>
                  <button
                    onClick={() => setErrorMsg(null)}
                    className="text-rose-400 hover:text-rose-200 text-xs underline font-medium"
                  >
                    Fermer
                  </button>
                </div>
              )}

              {activeSolution && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch min-h-[500px]">
                  {activeMode === 'algebra' ? (
                    <>
                      <div className="lg:col-span-7 flex flex-col h-full">
                        <AlgebraStage
                          solution={activeSolution}
                          currentStepIndex={currentStepIndex}
                          onStepChange={handleStepChange}
                          isCompleted={isCompleted}
                          onComplete={() => setIsCompleted(true)}
                        />
                      </div>
                      <div className="lg:col-span-5 flex flex-col h-full">
                        <AlgebraProgressionCard
                          solution={activeSolution}
                          currentStepIndex={currentStepIndex}
                          onStepClick={handleStepChange}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="lg:col-span-7 flex flex-col h-full">
                        <Math3DViewer
                          visualState={activeSolution.steps[currentStepIndex]?.visualState!}
                          stepNumber={activeSolution.steps[currentStepIndex]?.stepNumber!}
                          totalSteps={activeSolution.steps.length}
                          stepTitle={activeSolution.steps[currentStepIndex]?.title!}
                          stepExplanation={activeSolution.steps[currentStepIndex]?.explanation!}
                          onNextStep={() =>
                            handleStepChange(
                              Math.min(activeSolution.steps.length - 1, currentStepIndex + 1)
                            )
                          }
                          onPrevStep={() => handleStepChange(Math.max(0, currentStepIndex - 1))}
                        />
                      </div>
                      <div className="lg:col-span-5 flex flex-col h-full">
                        <StepPlayer
                          solution={activeSolution}
                          currentStepIndex={currentStepIndex}
                          onStepChange={handleStepChange}
                          isCompleted={isCompleted}
                          onComplete={() => setIsCompleted(true)}
                          isClassroomMode={isClassroomMode}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <BlackboardDrawer isOpen={isBlackboardOpen} onClose={() => setIsBlackboardOpen(false)} />
    </div>
  );
}
