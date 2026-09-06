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
import { SENEGAL_COURSES_4E, CourseChapter } from './coursesData';
import { Sparkles, BookOpen, GraduationCap, ArrowRight } from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'courses' | 'algebra-sandbox'>('courses');
  const [activeChapterId, setActiveChapterId] = useState<string>('calcul-algebrique');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return false;
  });

  // Responsive sidebar handling on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        // Automatically keep closed on mobile screen unless toggled
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Classroom & Teacher Mode
  const [isClassroomMode, setIsClassroomMode] = useState<boolean>(true);

  // Algebra Sandbox State
  const [activeSolution, setActiveSolution] = useState<ExpressionSolution | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [activeMode, setActiveMode] = useState<'algebra' | 'geometry'>('algebra');

  const currentChapter: CourseChapter =
    SENEGAL_COURSES_4E.find((c) => c.id === activeChapterId) || SENEGAL_COURSES_4E[0];

  // Resolve custom expression through 3-tier pipeline
  const handleResolve = useCallback(
    async (expr: string, opType: string = 'expansion') => {
      setIsLoading(true);
      setErrorMsg(null);
      setIsCompleted(false);

      try {
        const response = await fetch('/api/resolve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ expression: expr, operationType: opType }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Erreur de résolution.');
        }

        const solution: ExpressionSolution = await response.json();
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
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
      />

      {/* Main Body with Sidebar and Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Course Menu Sidebar (14 chapters) */}
        {activeTab === 'courses' && (
          <CourseSidebar
            activeChapterId={activeChapterId}
            onSelectChapter={(id) => {
              setActiveChapterId(id);
            }}
            isOpen={isSidebarOpen}
            onCloseMobile={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Central Stage / Content Area */}
        <main className="flex-1 overflow-y-auto p-2 sm:p-4 lg:p-6 flex flex-col space-y-4 max-w-full min-w-0">
          {/* Teacher Classroom Mode Banner */}
          {isClassroomMode && (
            <div className="px-4 py-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 flex flex-wrap items-center justify-between gap-2 shadow-sm">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-bold text-white">Espace Démo Professeur :</span>
                <span>
                  Support pédagogique direct pour la classe de 4ème (Programme Sénégal) — clair, simplifié et 100% heuristique.
                </span>
              </div>
              <div className="flex items-center space-x-2 text-[11px]">
                <span className="bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                  {currentChapter.shortTitle}
                </span>
              </div>
            </div>
          )}

          {/* TAB 1: 14 CHAPTERS OF SENEGAL 4E CURRICULUM */}
          {activeTab === 'courses' && (
            <InteractiveLessonViewer
              chapter={currentChapter}
              onOpenAlgebraSolver={handleOpenAlgebraWithExpr}
            />
          )}

          {/* TAB 2: CUSTOM ALGEBRAIC SOLVER (Calcul Libre) */}
          {activeTab === 'algebra-sandbox' && (
            <div className="flex flex-col space-y-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                      <span>Calcul Algébrique Libre : Développer & Factoriser</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Saisissez n'importe quelle expression ou choisissez un exemple ci-dessous.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('courses')}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline"
                  >
                    Retour aux cours de 4e
                  </button>
                </div>

                <ExpressionInput
                  onResolve={handleResolve}
                  isLoading={isLoading}
                  activeSolution={activeSolution}
                />
              </div>

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
    </div>
  );
}
