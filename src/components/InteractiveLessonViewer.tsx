import React, { useState, useEffect } from 'react';
import { CourseChapter, CourseDemo, CourseStep } from '../coursesData';
import { MathView } from './MathView';
import { CalculAlgebriqueCourse } from './CalculAlgebriqueCourse';
import { GeometryVisualizers3e } from './GeometryVisualizers3e';
import { GeometryVisualizers5e } from './GeometryVisualizers5e';
import { VideoLessonPlayer } from './VideoLessonPlayer';
import { StudentExercisesSection } from './StudentExercisesSection';
import { QuickQuiz } from './QuickQuiz';
import { getExercisesForChapter } from '../data/getCourseExercises';
import { CoursePrerequisitesDrawer } from './CoursePrerequisitesDrawer';
import { getChapterPrerequisites } from '../data/coursePrerequisites';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Maximize2,
  Sparkles,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Tv,
  Zap,
  BookOpenCheck,
  BookOpen,
  Award,
  Layers,
} from 'lucide-react';
import { CourseSheetViewer } from './CourseSheetViewer';

export type LessonTabMode = 'animation' | 'cours-complet' | 'methodes-bfem' | 'exercices';

interface InteractiveLessonViewerProps {
  chapter: CourseChapter;
  onOpenAlgebraSolver?: (expr: string) => void;
  onSelectChapter?: (chapterId: string) => void;
}

export const InteractiveLessonViewer: React.FC<InteractiveLessonViewerProps> = ({
  chapter,
  onOpenAlgebraSolver,
  onSelectChapter,
}) => {
  const [activeTabMode, setActiveTabMode] = useState<LessonTabMode>('animation');
  const [activeDemoIdx, setActiveDemoIdx] = useState<number>(0);

  const currentDemo: CourseDemo = chapter.demos[activeDemoIdx] || chapter.demos[0];
  const exercises = getExercisesForChapter(chapter.id, currentDemo);
  const prerequisites = getChapterPrerequisites(chapter);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [hideSolutionForClass, setHideSolutionForClass] = useState<boolean>(false);
  const [isProjectorMode, setIsProjectorMode] = useState<boolean>(false);
  const [isPrerequisitesOpen, setIsPrerequisitesOpen] = useState<boolean>(false);

  // Dynamic state for interactive demos
  const [pythagoreSides, setPythagoreSides] = useState<{ ab: number; ac: number }>({
    ab: 3,
    ac: 4,
  });
  const [movingPointM, setMovingPointM] = useState<number>(3); // HM distance
  const [linearX, setLinearX] = useState<number>(3);
  const [cosinusAngle, setCosinusAngle] = useState<number>(60);
  const [isPyramidNetUnfolded, setIsPyramidNetUnfolded] = useState<boolean>(false);

  // Reset step when chapter changes
  useEffect(() => {
    setActiveDemoIdx(0);
    setCurrentStepIdx(0);
    setIsPlaying(false);
    setHideSolutionForClass(false);
    setIsPrerequisitesOpen(false);
    setActiveTabMode('animation');
  }, [chapter.id]);

  // Autoplay loop
  useEffect(() => {
    if (!isPlaying) return;
    const intervalTime = 3000 / speed;
    const timer = setInterval(() => {
      setCurrentStepIdx((prev) => {
        if (prev >= currentDemo.steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalTime);
    return () => clearInterval(timer);
  }, [isPlaying, speed, currentDemo.steps.length]);

  const currentStep: CourseStep = currentDemo.steps[currentStepIdx] || currentDemo.steps[0];
  const totalSteps = currentDemo.steps.length;

  const handlePrev = () => setCurrentStepIdx((prev) => Math.max(0, prev - 1));
  const handleNext = () => setCurrentStepIdx((prev) => Math.min(totalSteps - 1, prev + 1));
  const handleReset = () => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  // Dedicated complete course for Calcul Algébrique 4e
  if (chapter.id === 'calcul-algebrique') {
    return (
      <>
        <CalculAlgebriqueCourse
          onOpenAlgebraSolver={onOpenAlgebraSolver}
          onOpenPrerequisites={() => setIsPrerequisitesOpen(true)}
        />

        {/* Floating Quick-Access Right Drawer Trigger */}
        <button
          onClick={() => setIsPrerequisitesOpen(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-30 flex items-center px-2 py-3 rounded-l-2xl shadow-xl border-y border-l bg-white text-black hover:bg-neutral-50 border-neutral-300 dark:bg-slate-900 dark:text-white dark:border-slate-700 dark:hover:bg-slate-800 transition-all group"
          title="Ouvrir les prérequis du cours (Rappels de 5e)"
          aria-label="Ouvrir les prérequis"
        >
          <div className="flex flex-col items-center space-y-1">
            <BookOpenCheck className="w-4 h-4 text-red-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold [writing-mode:vertical-rl] rotate-180 uppercase tracking-wider py-0.5">
              Prérequis ({prerequisites.length})
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-amber-400 animate-pulse" />
          </div>
        </button>

        <CoursePrerequisitesDrawer
          isOpen={isPrerequisitesOpen}
          onClose={() => setIsPrerequisitesOpen(false)}
          chapter={chapter}
          onNavigateToChapter={onSelectChapter}
        />
      </>
    );
  }

  return (
    <div
      id="interactive-lesson-viewer"
      className={`flex flex-col space-y-4 ${
        isProjectorMode ? 'text-lg select-text' : 'text-sm'
      }`}
    >
      {/* Chapter Banner & Teacher Command Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div>
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                chapter.gradeLevel === '3e' || chapter.id.endsWith('-3e')
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
              }`}>
                {chapter.gradeLevel === '3e' || chapter.id.endsWith('-3e') ? ' Classe de 3e (BFEM)' : ' Classe de 4e'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {chapter.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-slate-800 text-slate-300">
                {currentDemo.badge}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-black dark:text-white mt-1.5 flex items-center gap-2">
              {chapter.title}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-slate-300 mt-1 max-w-3xl">
              {chapter.description}
            </p>
          </div>

          {/* Teacher Quick Tools */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => setIsPrerequisitesOpen(true)}
              title="Consulter les prérequis et rappels pour ce cours"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border border-red-600/50 hover:border-red-600 bg-white hover:bg-neutral-100 text-black shadow-xs dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-amber-300 dark:border-amber-500/40"
            >
              <BookOpenCheck className="w-3.5 h-3.5 text-red-600 dark:text-amber-400" />
              <span>Prérequis ({prerequisites.length})</span>
            </button>

            <button
              onClick={() => setHideSolutionForClass(!hideSolutionForClass)}
              title="Masquer la solution pour interroger les élèves"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                hideSolutionForClass
                  ? 'bg-white border-2 border-black text-black font-bold shadow-xs dark:bg-amber-500/20 dark:border-amber-500 dark:text-amber-300'
                  : 'bg-white hover:bg-neutral-100 text-neutral-800 border-neutral-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:border-slate-700'
              }`}
            >
              {hideSolutionForClass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{hideSolutionForClass ? 'Question active (Solution masquée)' : 'Interroger la classe'}</span>
            </button>

            <button
              onClick={() => setIsProjectorMode(!isProjectorMode)}
              title="Mode grand écran / Vidéoprojecteur"
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                isProjectorMode
                  ? 'bg-white border-2 border-black text-black font-bold shadow-xs dark:bg-indigo-600 dark:border-indigo-400 dark:text-white'
                  : 'bg-white hover:bg-neutral-100 text-neutral-800 border-neutral-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:border-slate-700'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Vidéoprojecteur</span>
            </button>
          </div>
        </div>

        {/* Rule / Objective Summary */}
        <div className="mt-3.5 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 dark:bg-emerald-950/30 dark:border-emerald-500/20 dark:text-emerald-200 flex flex-col space-y-2">
          <div className="flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs sm:text-sm text-emerald-950 dark:text-emerald-200">
              <span className="font-bold text-emerald-800 dark:text-white">Règle à retenir : </span>
              <span className="text-emerald-900 dark:text-emerald-200 font-medium">{currentDemo.ruleSummary}</span>
            </div>
          </div>
          <div className="pt-2 border-t border-emerald-300 dark:border-emerald-500/20 flex items-center justify-between text-xs flex-wrap gap-2">
            <span className="text-emerald-800/80 dark:text-slate-300">
              Des doutes sur les notions préalables ?
            </span>
            <button
              onClick={() => setIsPrerequisitesOpen(true)}
              className="text-emerald-700 hover:text-emerald-800 dark:text-amber-400 font-bold hover:underline flex items-center gap-1.5"
            >
              <BookOpenCheck className="w-3.5 h-3.5" />
              <span>Ouvrir les prérequis indispensables ({prerequisites.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Course Navigation Tab Bar */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-neutral-100 dark:bg-slate-900 border border-neutral-300 dark:border-slate-800 overflow-x-auto scrollbar-thin">
        <button
          onClick={() => setActiveTabMode('animation')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTabMode === 'animation'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-neutral-700 hover:text-black hover:bg-white/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60'
          }`}
        >
          <Play className="w-3.5 h-3.5" />
          <span>1. Démonstration Animée & Tableau ({chapter.demos.length} {chapter.demos.length > 1 ? 'parties' : 'partie'})</span>
        </button>

        <button
          onClick={() => setActiveTabMode('cours-complet')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTabMode === 'cours-complet'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-neutral-700 hover:text-black hover:bg-white/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>2. Fiche Complète du Cours & Théorèmes</span>
        </button>

        <button
          onClick={() => setActiveTabMode('methodes-bfem')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTabMode === 'methodes-bfem'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-neutral-700 hover:text-black hover:bg-white/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>3. Méthodes Types & Rédaction BFEM</span>
        </button>

        <button
          onClick={() => setActiveTabMode('exercices')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTabMode === 'exercices'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-neutral-700 hover:text-black hover:bg-white/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>4. Exercices Corrigés & Quiz</span>
        </button>
      </div>

      {/* VIEW MODE 1: COMPREHENSIVE COURSE SHEET OR BFEM METHODS */}
      {(activeTabMode === 'cours-complet' || activeTabMode === 'methodes-bfem') && (
        <CourseSheetViewer
          chapter={chapter}
          onOpenPrerequisites={() => setIsPrerequisitesOpen(true)}
          onOpenAlgebraSolver={onOpenAlgebraSolver}
        />
      )}

      {/* VIEW MODE 2: STANDALONE EXERCISES & QUIZ */}
      {activeTabMode === 'exercices' && currentDemo.interactiveType !== 'video-lesson' && (
        <div className="space-y-6">
          <QuickQuiz
            chapter={chapter}
            demo={currentDemo}
            onScrollToExercises={() => {
              const el = document.getElementById('student-exercises-section');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />
          <StudentExercisesSection
            chapterId={chapter.id}
            chapterTitle={chapter.title}
            exercises={exercises}
          />
        </div>
      )}

      {/* VIEW MODE 3: ANIMATION & STEP-BY-STEP DERIVATION (Default) */}
      {activeTabMode === 'animation' && (
        <>
          {/* Multi-part Sub-Lessons Selector if Chapter has multiple demos */}
          {chapter.demos.length > 1 && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800 overflow-x-auto scrollbar-thin">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 whitespace-nowrap">
                <Layers className="w-4 h-4 text-emerald-400" />
                Parties du cours :
              </span>
              {chapter.demos.map((d, dIdx) => (
                <button
                  key={d.id || dIdx}
                  onClick={() => {
                    setActiveDemoIdx(dIdx);
                    setCurrentStepIdx(0);
                    setIsPlaying(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    activeDemoIdx === dIdx
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm font-bold'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-400 border-transparent hover:text-slate-200'
                  }`}
                >
                  Partie {dIdx + 1} : {d.title}
                </button>
              ))}
            </div>
          )}

          {/* Main Split: Left = Heuristic Animated Stage, Right = Step-by-Step Derivation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left Column: Visual Heuristic Interactive Stage (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl relative min-h-[460px] overflow-hidden">
          {/* Header of Stage */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Animation Heuristique : {currentDemo.title}
              </span>
            </div>

            {/* Step indicator */}
            <div className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
              Étape {currentStepIdx + 1} / {totalSteps}
            </div>
          </div>

          {/* Interactive Rendering Box based on Topic */}
          <div className="flex-1 flex items-center justify-center p-2 sm:p-4 my-2">
            {/* 1. PYTHAGORE */}
            {currentDemo.interactiveType === 'pythagore-svg' && (
              <div className="w-full flex flex-col items-center">
                <svg
                  viewBox="0 0 460 320"
                  className="w-full max-w-[440px] h-auto drop-shadow-md select-none"
                >
                  {/* Grid background */}
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="460" height="320" fill="url(#grid)" opacity="0.4" />

                  {/* Square on AB (vertical side, 3 units = 60px) */}
                  <rect
                    x="110"
                    y="130"
                    width="60"
                    height="60"
                    fill="#0284c7"
                    fillOpacity={currentStepIdx >= 2 ? 0.35 : 0.15}
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray={currentStepIdx >= 2 ? 'none' : '4'}
                    className="transition-all duration-500"
                  />
                  <text x="140" y="165" fill="#bae6fd" textAnchor="middle" fontSize="13" fontWeight="bold">
                    3² = 9
                  </text>

                  {/* Square on AC (horizontal side, 4 units = 80px) */}
                  <rect
                    x="170"
                    y="190"
                    width="80"
                    height="80"
                    fill="#d97706"
                    fillOpacity={currentStepIdx >= 2 ? 0.35 : 0.15}
                    stroke="#fbbf24"
                    strokeWidth="2"
                    strokeDasharray={currentStepIdx >= 2 ? 'none' : '4'}
                    className="transition-all duration-500"
                  />
                  <text x="210" y="235" fill="#fef3c7" textAnchor="middle" fontSize="13" fontWeight="bold">
                    4² = 16
                  </text>

                  {/* Right-angled triangle ABC: A=(170, 190), B=(170, 130), C=(250, 190) */}
                  <polygon
                    points="170,190 170,130 250,190"
                    fill="#10b981"
                    fillOpacity="0.25"
                    stroke="#10b981"
                    strokeWidth="3"
                  />

                  {/* Right-angle square marker at A(170, 190) */}
                  <rect x="170" y="180" width="10" height="10" fill="none" stroke="#ef4444" strokeWidth="2" />
                  <circle cx="175" cy="185" r="1.5" fill="#ef4444" />

                  {/* Vertices points & labels */}
                  <circle cx="170" cy="190" r="4" fill="#ef4444" />
                  <text x="180" y="205" fill="#ef4444" fontWeight="bold" fontSize="14">
                    A (Angle droit)
                  </text>

                  <circle cx="170" cy="130" r="4" fill="#38bdf8" />
                  <text x="160" y="125" fill="#38bdf8" fontWeight="bold" fontSize="14">
                    B (3 cm)
                  </text>

                  <circle cx="250" cy="190" r="4" fill="#fbbf24" />
                  <text x="255" y="205" fill="#fbbf24" fontWeight="bold" fontSize="14">
                    C (4 cm)
                  </text>

                  {/* Hypoténuse BC */}
                  <line x1="170" y1="130" x2="250" y2="190" stroke="#ec4899" strokeWidth="3.5" />

                  {/* Square on BC tilted (5 units = 100px) */}
                  <g transform="translate(170, 130) rotate(36.87)">
                    <rect
                      x="0"
                      y="-100"
                      width="100"
                      height="100"
                      fill="#10b981"
                      fillOpacity={currentStepIdx >= 3 ? 0.35 : 0.1}
                      stroke="#34d399"
                      strokeWidth="2.5"
                      className="transition-all duration-700"
                    />
                    <text
                      x="50"
                      y="-45"
                      fill="#a7f3d0"
                      textAnchor="middle"
                      fontSize="14"
                      fontWeight="bold"
                      transform="rotate(-36.87, 50, -45)"
                    >
                      {currentStepIdx >= 3 ? 'BC² = 9 + 16 = 25' : 'BC² = ?'}
                    </text>
                  </g>

                  {/* Large result label */}
                  {currentStepIdx >= 3 && (
                    <g className="animate-fade-in">
                      <rect x="290" y="50" width="150" height="60" rx="10" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                      <text x="365" y="75" fill="#a7f3d0" textAnchor="middle" fontSize="12" fontWeight="bold">
                        Hypoténuse BC
                      </text>
                      <text x="365" y="98" fill="#ffffff" textAnchor="middle" fontSize="16" fontWeight="extrabold">
                        BC = √25 = 5 cm
                      </text>
                    </g>
                  )}
                </svg>

                {/* Preset switcher for teacher */}
                <div className="flex items-center space-x-2 mt-3 text-xs">
                  <span className="text-slate-400">Tester d'autres triplets :</span>
                  <button
                    onClick={() => setPythagoreSides({ ab: 3, ac: 4 })}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[11px] border border-slate-700"
                  >
                    3 - 4 - 5 cm
                  </button>
                  <button
                    onClick={() => setPythagoreSides({ ab: 6, ac: 8 })}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[11px] border border-slate-700"
                  >
                    6 - 8 - 10 cm
                  </button>
                  <button
                    onClick={() => setPythagoreSides({ ab: 5, ac: 12 })}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[11px] border border-slate-700"
                  >
                    5 - 12 - 13 cm
                  </button>
                </div>
              </div>
            )}

            {/* 2. DROITE DES MILIEUX */}
            {currentDemo.interactiveType === 'droite-milieux-svg' && (
              <div className="w-full flex flex-col items-center">
                <svg viewBox="0 0 460 280" className="w-full max-w-[440px] h-auto drop-shadow-md">
                  {/* Triangle ABC: A=(230, 40), B=(70, 230), C=(390, 230) */}
                  <polygon points="230,40 70,230 390,230" fill="#0f172a" stroke="#64748b" strokeWidth="2.5" />

                  {/* Midpoint I of [AB]: (150, 135) */}
                  <circle cx="150" cy="135" r="5" fill="#38bdf8" />
                  <text x="125" y="135" fill="#38bdf8" fontWeight="bold" fontSize="14">
                    I (Milieu)
                  </text>
                  {/* Equality marks on [AB] */}
                  <line x1="185" y1="85" x2="195" y2="90" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="105" y1="180" x2="115" y2="185" stroke="#38bdf8" strokeWidth="2" />

                  {/* Midpoint J of [AC]: (310, 135) */}
                  <circle cx="310" cy="135" r="5" fill="#fbbf24" />
                  <text x="325" y="135" fill="#fbbf24" fontWeight="bold" fontSize="14">
                    J (Milieu)
                  </text>
                  {/* Equality marks on [AC] */}
                  <line x1="265" y1="85" x2="275" y2="90" stroke="#fbbf24" strokeWidth="2" />
                  <line x1="345" y1="180" x2="355" y2="185" stroke="#fbbf24" strokeWidth="2" />

                  {/* Segment [IJ] animated */}
                  <line
                    x1="150"
                    y1="135"
                    x2="310"
                    y2="135"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeDasharray={currentStepIdx >= 1 ? 'none' : '6'}
                  />

                  {/* Base [BC] */}
                  <line x1="70" y1="230" x2="390" y2="230" stroke="#818cf8" strokeWidth="3" />

                  {/* Parallel arrows */}
                  {currentStepIdx >= 1 && (
                    <>
                      <polygon points="225,130 235,135 225,140" fill="#10b981" />
                      <polygon points="225,225 235,230 225,235" fill="#818cf8" />
                      <text x="230" y="120" fill="#10b981" textAnchor="middle" fontSize="12" fontWeight="bold">
                        (IJ) // (BC)
                      </text>
                    </>
                  )}

                  {/* Measure pill */}
                  {currentStepIdx >= 2 && (
                    <g>
                      <rect x="180" y="145" width="100" height="30" rx="8" fill="#064e3b" stroke="#10b981" />
                      <text x="230" y="165" fill="#a7f3d0" textAnchor="middle" fontSize="12" fontWeight="bold">
                        IJ = 4 cm (BC/2)
                      </text>
                      <text x="230" y="255" fill="#c7d2fe" textAnchor="middle" fontSize="13" fontWeight="bold">
                        BC = 8 cm
                      </text>
                    </g>
                  )}

                  {/* Vertex labels */}
                  <text x="230" y="30" fill="#f8fafc" textAnchor="middle" fontWeight="bold" fontSize="15">
                    A
                  </text>
                  <text x="55" y="240" fill="#f8fafc" fontWeight="bold" fontSize="15">
                    B
                  </text>
                  <text x="400" y="240" fill="#f8fafc" fontWeight="bold" fontSize="15">
                    C
                  </text>
                </svg>
              </div>
            )}

            {/* 3. DISTANCE D'UN POINT A UNE DROITE */}
            {currentDemo.interactiveType === 'distance-svg' && (
              <div className="w-full flex flex-col items-center">
                <svg viewBox="0 0 460 260" className="w-full max-w-[440px] h-auto drop-shadow-md">
                  {/* Line (D) */}
                  <line x1="40" y1="190" x2="420" y2="190" stroke="#94a3b8" strokeWidth="3" />
                  <text x="430" y="195" fill="#94a3b8" fontWeight="bold" fontSize="14">
                    (D)
                  </text>

                  {/* Point A */}
                  <circle cx="180" cy="50" r="5" fill="#ef4444" />
                  <text x="180" y="40" fill="#ef4444" textAnchor="middle" fontWeight="bold" fontSize="14">
                    A
                  </text>

                  {/* Perpendicular [AH], H = (180, 190) */}
                  <line x1="180" y1="50" x2="180" y2="190" stroke="#10b981" strokeWidth="3.5" />
                  <circle cx="180" cy="190" r="4" fill="#10b981" />
                  <text x="180" y="215" fill="#10b981" textAnchor="middle" fontWeight="bold" fontSize="13">
                    H (Pied perp.)
                  </text>

                  {/* Right angle marker at H */}
                  <rect x="180" y="175" width="15" height="15" fill="none" stroke="#ef4444" strokeWidth="2" />
                  <circle cx="187" cy="182" r="1.5" fill="#ef4444" />

                  {/* Moving Point M on (D) */}
                  <line
                    x1="180"
                    y1="50"
                    x2={180 + movingPointM * 25}
                    y2="190"
                    stroke="#fbbf24"
                    strokeWidth="2.5"
                    strokeDasharray="4"
                  />
                  <circle cx={180 + movingPointM * 25} cy="190" r="5" fill="#fbbf24" />
                  <text
                    x={180 + movingPointM * 25}
                    y="215"
                    fill="#fbbf24"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="13"
                  >
                    M
                  </text>

                  {/* Length labels */}
                  <text x="150" y="120" fill="#10b981" fontWeight="bold" fontSize="13">
                    AH = 4 cm (Plus court)
                  </text>

                  <text
                    x={180 + (movingPointM * 25) / 2 + 10}
                    y="110"
                    fill="#fbbf24"
                    fontWeight="bold"
                    fontSize="13"
                  >
                    AM = {Math.sqrt(16 + movingPointM * movingPointM).toFixed(1)} cm
                  </text>
                </svg>

                {/* Slider to move M */}
                <div className="w-full max-w-sm flex items-center space-x-3 mt-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-300 whitespace-nowrap">Déplacer le point M :</span>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="0.5"
                    value={movingPointM}
                    onChange={(e) => setMovingPointM(parseFloat(e.target.value))}
                    className="flex-1 accent-amber-500"
                  />
                  <span className="text-xs font-mono text-amber-400 font-bold">HM = {movingPointM} cm</span>
                </div>
              </div>
            )}

            {/* 4. INEQUATIONS & DROITE GRADUEE */}
            {currentDemo.interactiveType === 'inequations-numberline' && (
              <div className="w-full flex flex-col items-center">
                {/* Visual warning on negative division */}
                {currentStepIdx >= 2 && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-600 text-rose-200 text-xs sm:text-sm font-bold animate-bounce flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>RÈGLE D'OR : Division par -2 (négatif) → Le signe s'inverse : ≤ devient ≥ !</span>
                  </div>
                )}

                {/* Number line SVG */}
                <svg viewBox="0 0 460 160" className="w-full max-w-[440px] h-auto select-none drop-shadow-md">
                  {/* Axis line */}
                  <line x1="30" y1="90" x2="430" y2="90" stroke="#64748b" strokeWidth="2.5" />
                  <polygon points="435,90 425,85 425,95" fill="#64748b" />
                  <text x="435" y="75" fill="#94a3b8" fontSize="12" fontWeight="bold">
                    +∞
                  </text>
                  <text x="15" y="75" fill="#94a3b8" fontSize="12" fontWeight="bold">
                    -∞
                  </text>

                  {/* Ticks from -5 to +5 */}
                  {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((val) => {
                    const x = 230 + val * 35;
                    const isThreshold = val === -3;
                    return (
                      <g key={val}>
                        <line
                          x1={x}
                          y1={isThreshold ? 75 : 82}
                          x2={x}
                          y2={isThreshold ? 105 : 98}
                          stroke={isThreshold ? '#ef4444' : '#475569'}
                          strokeWidth={isThreshold ? 3 : 1.5}
                        />
                        <text
                          x={x}
                          y="120"
                          textAnchor="middle"
                          fontSize={isThreshold ? '13' : '11'}
                          fontWeight={isThreshold ? 'bold' : 'normal'}
                          fill={isThreshold ? '#f87171' : val === 0 ? '#38bdf8' : '#94a3b8'}
                        >
                          {val}
                        </text>
                      </g>
                    );
                  })}

                  {/* Solution Shaded Ray: from -3 (x = 125) to +inf */}
                  {currentStepIdx >= 3 && (
                    <g className="animate-fade-in">
                      <rect x="125" y="80" width="300" height="20" fill="#10b981" fillOpacity="0.4" />
                      <line x1="125" y1="90" x2="425" y2="90" stroke="#10b981" strokeWidth="5" />

                      {/* Closed bracket '[' facing right at -3 */}
                      <path
                        d="M 133 75 L 125 75 L 125 105 L 133 105"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3.5"
                      />
                      <text x="240" y="65" fill="#34d399" textAnchor="middle" fontSize="13" fontWeight="bold">
                        Solutions x ≥ -3 (Zone verte)
                      </text>
                    </g>
                  )}
                </svg>

                <div className="text-xs text-slate-300 mt-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                  L'ensemble des solutions est l'intervalle :{' '}
                  <span className="font-mono text-emerald-400 font-bold text-sm">S = [-3 ; +∞[</span>
                </div>
              </div>
            )}

            {/* 5. VECTEURS ET RELATION DE CHASLES */}
            {currentDemo.interactiveType === 'vector-chasles' && (
              <div className="w-full flex flex-col items-center">
                <svg viewBox="0 0 460 260" className="w-full max-w-[440px] h-auto drop-shadow-md">
                  {/* Grid */}
                  <defs>
                    <pattern id="grid-v" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="460" height="260" fill="url(#grid-v)" opacity="0.4" />

                  {/* Points: A = Dakar (80, 180), B = Thiès (220, 150), C = Saint-Louis (360, 60) */}
                  <circle cx="80" cy="180" r="6" fill="#38bdf8" />
                  <text x="80" y="205" fill="#38bdf8" textAnchor="middle" fontWeight="bold" fontSize="13">
                    A (Dakar)
                  </text>

                  <circle cx="220" cy="150" r="6" fill="#fbbf24" />
                  <text x="220" y="175" fill="#fbbf24" textAnchor="middle" fontWeight="bold" fontSize="13">
                    B (Thiès)
                  </text>

                  <circle cx="360" cy="60" r="6" fill="#ec4899" />
                  <text x="360" y="45" fill="#ec4899" textAnchor="middle" fontWeight="bold" fontSize="13">
                    C (Saint-Louis)
                  </text>

                  {/* Vector AB */}
                  <line x1="80" y1="180" x2="220" y2="150" stroke="#38bdf8" strokeWidth="3" />
                  <polygon points="220,150 205,145 210,155" fill="#38bdf8" />
                  <text x="145" y="155" fill="#38bdf8" fontWeight="bold" fontSize="13">
                    vec(AB)
                  </text>

                  {/* Vector BC */}
                  {currentStepIdx >= 1 && (
                    <g className="animate-fade-in">
                      <line x1="220" y1="150" x2="360" y2="60" stroke="#fbbf24" strokeWidth="3" />
                      <polygon points="360,60 348,70 355,75" fill="#fbbf24" />
                      <text x="300" y="115" fill="#fbbf24" fontWeight="bold" fontSize="13">
                        vec(BC)
                      </text>
                    </g>
                  )}

                  {/* Vector AC (Direct Chasles) */}
                  {currentStepIdx >= 2 && (
                    <g className="animate-fade-in">
                      <line
                        x1="80"
                        y1="180"
                        x2="360"
                        y2="60"
                        stroke="#10b981"
                        strokeWidth="4"
                        strokeDasharray="6"
                      />
                      <polygon points="360,60 345,68 350,80" fill="#10b981" />
                      <text x="210" y="95" fill="#10b981" fontWeight="extrabold" fontSize="15">
                        vec(AC) = vec(AB) + vec(BC)
                      </text>
                    </g>
                  )}
                </svg>

                <div className="text-xs text-slate-300 mt-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                  Relation de Chasles : le point intermédiaire <span className="text-amber-400 font-bold">B</span> s'efface pour aller directement de <span className="text-sky-400 font-bold">A</span> à <span className="text-emerald-400 font-bold">C</span> !
                </div>
              </div>
            )}

            {/* 6. APPLICATION LINEAIRE */}
            {currentDemo.interactiveType === 'linear-function' && (
              <div className="w-full flex flex-col items-center space-y-3">
                {/* Dynamic Chart */}
                <svg viewBox="0 0 440 220" className="w-full max-w-[420px] h-auto drop-shadow-md">
                  {/* Axes */}
                  <line x1="50" y1="180" x2="400" y2="180" stroke="#64748b" strokeWidth="2" />
                  <line x1="50" y1="180" x2="50" y2="20" stroke="#64748b" strokeWidth="2" />
                  <text x="400" y="195" fill="#94a3b8" fontSize="11">
                    x (kg)
                  </text>
                  <text x="35" y="25" fill="#94a3b8" fontSize="11">
                    Prix y (FCFA)
                  </text>
                  <text x="40" y="195" fill="#f8fafc" fontWeight="bold" fontSize="12">
                    O(0,0)
                  </text>

                  {/* Line y = 500x through O(0,0) */}
                  <line x1="50" y1="180" x2="350" y2="30" stroke="#10b981" strokeWidth="3" />

                  {/* Current point (linearX) */}
                  {(() => {
                    const px = 50 + (linearX / 6) * 300;
                    const py = 180 - (linearX / 6) * 150;
                    return (
                      <g>
                        <line x1={px} y1="180" x2={px} y2={py} stroke="#fbbf24" strokeDasharray="3" />
                        <line x1="50" y1={py} x2={px} y2={py} stroke="#fbbf24" strokeDasharray="3" />
                        <circle cx={px} cy={py} r="6" fill="#fbbf24" />
                        <text x={px + 8} y={py - 8} fill="#fef08a" fontSize="12" fontWeight="bold">
                          ({linearX} kg ; {linearX * 500} F)
                        </text>
                      </g>
                    );
                  })()}
                </svg>

                {/* Interactive Slider */}
                <div className="w-full max-w-sm flex items-center space-x-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-300">Quantité de mangues :</span>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    step="1"
                    value={linearX}
                    onChange={(e) => setLinearX(parseInt(e.target.value, 10))}
                    className="flex-1 accent-emerald-500"
                  />
                  <span className="text-xs font-mono text-emerald-400 font-bold">{linearX} kg</span>
                </div>

                <div className="text-xs text-slate-300 font-mono">
                  Prix = f({linearX}) = 500 × {linearX} ={' '}
                  <span className="text-emerald-400 font-bold text-sm">
                    {(linearX * 500).toLocaleString()} FCFA
                  </span>
                </div>
              </div>
            )}

            {/* 7. FRACTIONS RATIONNELLES */}
            {currentDemo.interactiveType === 'rationals-fraction' && (() => {
              const params = (currentDemo.demoParams || {}) as Record<string, any>;
              const type = params.type || 'addition';

              if (type === 'simplification') {
                const num = params.num ?? -42;
                const den = params.den ?? 70;
                const simpNum = params.simpNum ?? -3;
                const simpDen = params.simpDen ?? 5;
                const pgcd = params.pgcd ?? 14;
                return (
                  <div className="w-full flex flex-col items-center space-y-3 max-w-lg">
                    <div className="w-full p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col items-center space-y-3">
                      <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                        Décomposition & Recherche du PGCD
                      </span>
                      <div className="flex items-center space-x-4 text-base sm:text-lg font-mono font-bold">
                        <div className="flex flex-col items-center">
                          <span className="text-sky-400">{num}</span>
                          <div className="w-12 h-0.5 bg-slate-400 my-0.5" />
                          <span className="text-sky-400">{den}</span>
                        </div>
                        <span className="text-slate-500">=</span>
                        <div className="flex flex-col items-center">
                          <span className="text-emerald-400">
                            {currentStepIdx >= 2 ? `(-1) × (${pgcd} × ${Math.abs(simpNum)})` : num}
                          </span>
                          <div className="w-24 h-0.5 bg-slate-400 my-0.5" />
                          <span className="text-emerald-400">
                            {currentStepIdx >= 2 ? `${pgcd} × ${simpDen}` : den}
                          </span>
                        </div>
                        {currentStepIdx >= 3 && (
                          <>
                            <span className="text-slate-500">=</span>
                            <div className="flex flex-col items-center text-emerald-400 font-extrabold text-xl">
                              <span>{simpNum}</span>
                              <div className="w-10 h-0.5 bg-emerald-400 my-0.5" />
                              <span>{simpDen}</span>
                            </div>
                          </>
                        )}
                      </div>
                      {currentStepIdx >= 2 && (
                        <div className="text-xs text-amber-300 font-medium px-3 py-1 bg-amber-500/10 rounded-lg border border-amber-500/30">
                          Facteur commun maximal simplifié : {pgcd}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              if (type === 'produit-croix') {
                const a = params.a ?? 6;
                const b = params.b ?? 8;
                const c = params.c ?? 15;
                const d = params.d ?? 20;
                const prod1 = a * d;
                const prod2 = b * c;
                return (
                  <div className="w-full flex flex-col items-center space-y-3 max-w-lg">
                    <div className="w-full p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col items-center space-y-4">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Schéma du Produit en Croix
                      </div>
                      <div className="flex items-center space-x-6 text-xl font-mono font-bold">
                        {/* Fraction 1 */}
                        <div className="flex flex-col items-center p-2 rounded-lg bg-sky-950/40 border border-sky-500/30">
                          <span className="text-sky-400">{a}</span>
                          <div className="w-10 h-0.5 bg-sky-400 my-1" />
                          <span className="text-amber-400">{b}</span>
                        </div>
                        <span className="text-slate-400 text-2xl font-sans">=</span>
                        {/* Fraction 2 */}
                        <div className="flex flex-col items-center p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
                          <span className="text-amber-400">{c}</span>
                          <div className="w-10 h-0.5 bg-emerald-400 my-1" />
                          <span className="text-sky-400">{d}</span>
                        </div>
                      </div>

                      {/* Diagonales */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-xs font-mono">
                        <div className="p-2.5 rounded-lg bg-sky-950/50 border border-sky-500/40 text-center">
                          <div className="text-sky-300 font-semibold mb-1">1ère diagonale :</div>
                          <span className="text-white font-bold">{a} × {d} = </span>
                          <span className="text-sky-400 font-extrabold text-sm">{prod1}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-amber-950/50 border border-amber-500/40 text-center">
                          <div className="text-amber-300 font-semibold mb-1">2ème diagonale :</div>
                          <span className="text-white font-bold">{b} × {c} = </span>
                          <span className="text-amber-400 font-extrabold text-sm">{prod2}</span>
                        </div>
                      </div>

                      {currentStepIdx >= 3 && (
                        <div className="w-full p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-500/50 text-center text-xs font-semibold text-emerald-300">
                          Puisque {prod1} = {prod2}, l'égalité des deux rationnels est rigoureusement prouvée !
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              if (type === 'multiplication') {
                const a = params.a ?? -4;
                const b = params.b ?? 15;
                const c = params.c ?? 25;
                const d = params.d ?? -8;
                return (
                  <div className="w-full flex flex-col items-center space-y-3 max-w-lg">
                    <div className="w-full p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col items-center space-y-3 font-mono">
                      <div className="text-xs font-semibold text-slate-400 font-sans uppercase tracking-wider">
                        Règle du Produit : Numérateurs × Numérateurs / Dénominateurs × Dénominateurs
                      </div>
                      <div className="flex items-center space-x-3 text-lg font-bold">
                        <div className="flex flex-col items-center">
                          <span className="text-sky-400">{a}</span>
                          <div className="w-8 h-0.5 bg-slate-500 my-0.5" />
                          <span className="text-sky-400">{b}</span>
                        </div>
                        <span className="text-slate-400">×</span>
                        <div className="flex flex-col items-center">
                          <span className="text-amber-400">{c}</span>
                          <div className="w-8 h-0.5 bg-slate-500 my-0.5" />
                          <span className="text-amber-400">{d}</span>
                        </div>
                        <span className="text-slate-400">=</span>
                        <div className="flex flex-col items-center">
                          <span className="text-emerald-400">{Math.abs(a)} × {c}</span>
                          <div className="w-20 h-0.5 bg-emerald-400 my-0.5" />
                          <span className="text-emerald-400">{b} × {Math.abs(d)}</span>
                        </div>
                      </div>
                      {currentStepIdx >= 2 && (
                        <div className="w-full text-center text-xs text-slate-300 bg-slate-800/80 p-2.5 rounded-lg border border-slate-700 font-sans">
                          <span className="text-emerald-400 font-bold">Règle des signes :</span> (-) × (-) = (+) résultat positif.
                          <div className="mt-1 text-slate-400">Simplification avant calcul : (4 × 25) / (15 × 8) = (1 × 5) / (3 × 2) = <strong className="text-white">5/6</strong></div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              if (type === 'division') {
                const a = params.a ?? 7;
                const b = params.b ?? 12;
                const c = params.c ?? 14;
                const d = params.d ?? 9;
                return (
                  <div className="w-full flex flex-col items-center space-y-3 max-w-lg">
                    <div className="w-full p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col items-center space-y-3 font-mono">
                      <div className="text-xs font-semibold text-slate-400 font-sans uppercase tracking-wider">
                        Diviser revient à multiplier par l'inverse
                      </div>
                      <div className="flex items-center space-x-3 text-lg font-bold">
                        <div className="flex flex-col items-center">
                          <span className="text-sky-400">{a}</span>
                          <div className="w-8 h-0.5 bg-slate-500 my-0.5" />
                          <span className="text-sky-400">{b}</span>
                        </div>
                        <span className="text-rose-400 font-sans">÷</span>
                        <div className="flex flex-col items-center">
                          <span className="text-amber-400">{c}</span>
                          <div className="w-8 h-0.5 bg-slate-500 my-0.5" />
                          <span className="text-amber-400">{d}</span>
                        </div>
                        <span className="text-slate-400"></span>
                        <div className="flex flex-col items-center">
                          <span className="text-sky-400">{a}</span>
                          <div className="w-8 h-0.5 bg-slate-500 my-0.5" />
                          <span className="text-sky-400">{b}</span>
                        </div>
                        <span className="text-emerald-400">×</span>
                        <div className="flex flex-col items-center p-1 rounded-md bg-amber-500/20 border border-amber-500/40">
                          <span className="text-amber-300 font-extrabold">{d}</span>
                          <div className="w-8 h-0.5 bg-amber-400 my-0.5" />
                          <span className="text-amber-300 font-extrabold">{c}</span>
                        </div>
                      </div>
                      {currentStepIdx >= 2 && (
                        <div className="w-full text-center text-xs text-amber-300 bg-amber-500/10 p-2 rounded-lg border border-amber-500/30 font-sans">
                          Inverse de la 2nde fraction ({c}/{d}) = <strong>{d}/{c}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              // Default: Addition or Subtraction
              const a = params.a ?? 3;
              const b = params.b ?? 4;
              const c = params.c ?? 2;
              const d = params.d ?? 5;
              const common = params.common ?? 20;
              const isSub = type === 'soustraction';
              const mult1 = Math.round(common / b) || 1;
              const mult2 = Math.round(common / d) || 1;
              const resNum = isSub ? (a * mult1) - (c * mult2) : (a * mult1) + (c * mult2);

              return (
                <div className="w-full flex flex-col items-center space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
                    {/* Fraction 1 */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center">
                      <span className="text-xs text-slate-400 mb-1">Première fraction</span>
                      <span className="text-lg font-bold font-mono text-sky-400">{a} / {b}</span>
                      <div className="w-full bg-slate-800 h-5 rounded-md overflow-hidden flex mt-2 border border-slate-700">
                        {Array.from({ length: Math.min(b, 10) }).map((_, i) => (
                          <div
                            key={i}
                            className={`flex-1 border-r border-slate-900 ${
                              i < Math.min(a, b) ? 'bg-sky-500' : 'bg-transparent'
                            }`}
                          />
                        ))}
                      </div>
                      {currentStepIdx >= 2 && (
                        <span className="text-[11px] text-sky-300 font-mono mt-1.5 font-bold">
                          = {a * mult1} / {common} (× {mult1})
                        </span>
                      )}
                    </div>

                    {/* Fraction 2 */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center">
                      <span className="text-xs text-slate-400 mb-1">Deuxième fraction</span>
                      <span className="text-lg font-bold font-mono text-amber-400">{c} / {d}</span>
                      <div className="w-full bg-slate-800 h-5 rounded-md overflow-hidden flex mt-2 border border-slate-700">
                        {Array.from({ length: Math.min(d, 10) }).map((_, i) => (
                          <div
                            key={i}
                            className={`flex-1 border-r border-slate-900 ${
                              i < Math.min(c, d) ? 'bg-amber-500' : 'bg-transparent'
                            }`}
                          />
                        ))}
                      </div>
                      {currentStepIdx >= 2 && (
                        <span className="text-[11px] text-amber-300 font-mono mt-1.5 font-bold">
                          = {c * mult2} / {common} (× {mult2})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Common denominator result */}
                  {currentStepIdx >= 3 && (
                    <div className="w-full max-w-md p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex flex-col items-center animate-fade-in">
                      <span className="text-xs text-emerald-300 font-bold mb-1">
                        {isSub ? 'Soustraction' : 'Addition'} sur le même dénominateur ({common}) :
                      </span>
                      <div className="text-base font-mono font-extrabold text-black dark:text-white">
                        {a * mult1}/{common} {isSub ? '-' : '+'} {c * mult2}/{common} ={' '}
                        <span className="text-emerald-600 dark:text-emerald-400 text-lg">{resNum}/{common}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* 8. COSINUS D'UN ANGLE AIGU */}
            {currentDemo.interactiveType === 'cosinus-svg' && (
              <div className="w-full flex flex-col items-center">
                <svg viewBox="0 0 440 240" className="w-full max-w-[420px] h-auto drop-shadow-md">
                  {/* Right triangle: A(120, 190), C(120, 70), B(320, 190) */}
                  <polygon points="120,190 120,70 320,190" fill="#0f172a" stroke="#64748b" strokeWidth="2.5" />

                  {/* Right angle mark at A */}
                  <rect x="120" y="175" width="15" height="15" fill="none" stroke="#ef4444" strokeWidth="2" />
                  <circle cx="127" cy="182" r="1.5" fill="#ef4444" />

                  {/* Side Adjacent [AB] highlighted */}
                  <line x1="120" y1="190" x2="320" y2="190" stroke="#38bdf8" strokeWidth="4" />
                  <text x="220" y="215" fill="#38bdf8" textAnchor="middle" fontWeight="bold" fontSize="13">
                    Côté adjacent AB = 5 cm
                  </text>

                  {/* Hypotenuse [BC] highlighted */}
                  <line x1="120" y1="70" x2="320" y2="190" stroke="#ec4899" strokeWidth="4" />
                  <text x="245" y="120" fill="#ec4899" fontWeight="bold" fontSize="13">
                    Hypoténuse BC = 10 cm
                  </text>

                  {/* Angle B mark */}
                  <path d="M 285 190 A 35 35 0 0 0 295 170" fill="none" stroke="#fbbf24" strokeWidth="3" />
                  <text x="275" y="165" fill="#fbbf24" fontWeight="bold" fontSize="14">
                    60°
                  </text>

                  {/* Vertex labels */}
                  <text x="100" y="195" fill="#ef4444" fontWeight="bold" fontSize="15">
                    A
                  </text>
                  <text x="100" y="70" fill="#94a3b8" fontWeight="bold" fontSize="15">
                    C
                  </text>
                  <text x="330" y="195" fill="#fbbf24" fontWeight="bold" fontSize="15">
                    B
                  </text>
                </svg>

                <div className="text-xs sm:text-sm font-mono text-slate-200 mt-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                  cos(60°) = <span className="text-sky-400 font-bold">AB</span> /{' '}
                  <span className="text-pink-400 font-bold">BC</span> = 5 / 10 ={' '}
                  <span className="text-emerald-400 font-bold text-base">0,5</span>
                </div>
              </div>
            )}

            {/* 9. LES PYRAMIDES */}
            {currentDemo.interactiveType === 'pyramide-3d' && (
              <div className="w-full flex flex-col items-center">
                <svg viewBox="0 0 440 250" className="w-full max-w-[420px] h-auto drop-shadow-md">
                  {/* Perspective Pyramid: Base ABCD (parallelogram projection) */}
                  {/* A(140, 180), B(300, 180), C(340, 140), D(180, 140) */}
                  {/* Apex S(240, 40), Center H(240, 160) */}

                  {/* Dashed hidden edges */}
                  <line x1="140" y1="180" x2="180" y2="140" stroke="#475569" strokeWidth="1.5" strokeDasharray="4" />
                  <line x1="180" y1="140" x2="340" y2="140" stroke="#475569" strokeWidth="1.5" strokeDasharray="4" />
                  <line x1="240" y1="40" x2="180" y2="140" stroke="#475569" strokeWidth="1.5" strokeDasharray="4" />

                  {/* Height SH inside */}
                  <line x1="240" y1="40" x2="240" y2="160" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="4" />
                  <circle cx="240" cy="160" r="3" fill="#ef4444" />
                  <text x="245" y="110" fill="#f87171" fontWeight="bold" fontSize="12">
                    h = 10 cm
                  </text>

                  {/* Front Base edges */}
                  <polygon
                    points="140,180 300,180 340,140 180,140"
                    fill="#1e293b"
                    fillOpacity="0.4"
                    stroke="#94a3b8"
                    strokeWidth="2"
                  />

                  {/* Lateral faces to Apex S */}
                  <polygon
                    points="240,40 140,180 300,180"
                    fill="#0284c7"
                    fillOpacity="0.25"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                  />
                  <polygon
                    points="240,40 300,180 340,140"
                    fill="#0369a1"
                    fillOpacity="0.35"
                    stroke="#0284c7"
                    strokeWidth="2.5"
                  />

                  {/* Apex S label */}
                  <circle cx="240" cy="40" r="5" fill="#fbbf24" />
                  <text x="240" y="28" fill="#fbbf24" textAnchor="middle" fontWeight="bold" fontSize="14">
                    Sommet S
                  </text>

                  {/* Base dimensions */}
                  <text x="220" y="200" fill="#94a3b8" textAnchor="middle" fontSize="12" fontWeight="bold">
                    Côté base c = 6 cm (Aire = 36 cm²)
                  </text>
                </svg>

                <div className="mt-2 text-xs sm:text-sm font-mono text-emerald-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                  Volume = (1/3) × Aire de base × h = (1/3) × 36 × 10 ={' '}
                  <span className="text-emerald-400 font-bold text-base">120 cm³</span>
                </div>
              </div>
            )}

            {/* 10. EQUATIONS DANS Q */}
            {currentDemo.interactiveType === 'equations-steps' && (
              <div className="w-full flex flex-col items-center space-y-3">
                {/* Visual balance */}
                <div className="w-full max-w-md p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="text-center flex-1">
                    <span className="text-xs text-slate-400 block mb-1">Membre de Gauche</span>
                    <span className="text-base sm:text-lg font-mono font-bold text-sky-400">
                      {currentStepIdx === 0 && '3x - 5'}
                      {currentStepIdx === 1 && '3x - x - 5'}
                      {currentStepIdx >= 2 && '3x - x'}
                    </span>
                  </div>

                  <div className="text-xl font-extrabold text-amber-400 px-3">=</div>

                  <div className="text-center flex-1">
                    <span className="text-xs text-slate-400 block mb-1">Membre de Droite</span>
                    <span className="text-base sm:text-lg font-mono font-bold text-pink-400">
                      {currentStepIdx === 0 && 'x + 7'}
                      {currentStepIdx === 1 && '7'}
                      {currentStepIdx >= 2 && '7 + 5'}
                    </span>
                  </div>
                </div>

                {/* Animation notification */}
                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/40 text-xs sm:text-sm text-indigo-200 text-center max-w-md">
                  {currentStepIdx === 0 && 'Étape 1 : On identifie les termes avec x et les constantes.'}
                  {currentStepIdx === 1 && 'Le terme (+x) passe à gauche et devient (-x).'}
                  {currentStepIdx === 2 && 'Le terme (-5) passe à droite et devient (+5).'}
                  {currentStepIdx === 3 && 'On réduit : 2x = 12.'}
                  {currentStepIdx >= 4 && 'On divise par 2 : x = 12 / 2 = 6 !'}
                </div>
              </div>
            )}

            {/* 11. STATISTIQUE 4E */}
            {currentDemo.interactiveType === 'stats-chart' && (
              <div className="w-full flex flex-col items-center space-y-3">
                {/* Bar chart */}
                <div className="w-full max-w-md flex items-end justify-between h-40 pt-6 px-4 bg-slate-950 rounded-xl border border-slate-800">
                  {[
                    { note: '8/20', eff: 4, height: '40%' },
                    { note: '10/20', eff: 8, height: '80%' },
                    { note: '12/20', eff: 10, height: '100%' },
                    { note: '15/20', eff: 6, height: '60%' },
                    { note: '18/20', eff: 2, height: '20%' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center flex-1 mx-1.5 h-full justify-end">
                      <span className="text-[11px] font-mono text-emerald-400 font-bold mb-1">
                        {item.eff}
                      </span>
                      <div
                        style={{ height: item.height }}
                        className="w-full bg-emerald-500/80 rounded-t-lg transition-all duration-500 hover:bg-emerald-400"
                      />
                      <span className="text-[10px] text-slate-300 font-mono mt-1.5">
                        {item.note}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center font-mono">
                  Moyenne pondérée x̄ = (32 + 80 + 120 + 90 + 36) / 30 ={' '}
                  <span className="text-emerald-400 font-bold text-sm">11,93 / 20</span>
                </div>
              </div>
            )}

            {/* 12. COURS VIDÉOS BFEM */}
            {currentDemo.interactiveType === 'video-lesson' && (
              <div className="w-full">
                <VideoLessonPlayer
                  videoInfo={currentDemo.videoInfo}
                  title={currentDemo.title}
                  steps={currentDemo.steps}
                  ruleSummary={currentDemo.ruleSummary}
                  exercises={exercises}
                  chapterId={chapter.id}
                />
              </div>
            )}

            {/* 13. VISUALISATIONS GÉOMÉTRIQUES & NUMÉRIQUES 3E */}
            {(currentDemo.interactiveType === 'thales-svg' ||
              currentDemo.interactiveType === 'angle-inscrit-svg' ||
              currentDemo.interactiveType === 'partage-segment' ||
              currentDemo.interactiveType === 'parallelogramme-guide' ||
              currentDemo.interactiveType === 'reperage-plan' ||
              currentDemo.interactiveType === 'racine-carree' ||
              currentDemo.interactiveType === 'systemes-2-inconnues' ||
              currentDemo.interactiveType === 'geometrie-espace' ||
              currentDemo.interactiveType === 'triangle-construction') && (
              <GeometryVisualizers3e
                interactiveType={currentDemo.interactiveType}
                currentStepIdx={currentStepIdx}
                currentStep={currentStep}
              />
            )}

            {/* 13.b VISUALISATIONS SPÉCIFIQUES 5E */}
            {(currentDemo.interactiveType === 'geometrie-espace-5e' ||
              currentDemo.interactiveType === 'quadrilatere-5e' ||
              currentDemo.interactiveType === 'proportionnalite-5e' ||
              currentDemo.interactiveType === 'triangles-5e' ||
              currentDemo.interactiveType === 'fractions-5e' ||
              currentDemo.interactiveType === 'angles-5e' ||
              currentDemo.interactiveType === 'symetrie-centrale-5e' ||
              currentDemo.interactiveType === 'multiples-diviseurs-5e' ||
              currentDemo.interactiveType === 'calcul-dans-d-5e' ||
              currentDemo.interactiveType === 'nombres-decimaux-relatifs-5e' ||
              currentDemo.interactiveType === 'reperage-5e') && (
              <GeometryVisualizers5e
                interactiveType={currentDemo.interactiveType}
                currentStepIdx={currentStepIdx}
                currentStep={currentStep}
              />
            )}

            {/* 14. CALCUL ALGEBRIQUE OU AUTRES */}
            {(currentDemo.interactiveType === 'algebra-arrows' ||
              currentDemo.interactiveType === 'powers-steps' ||
              currentDemo.interactiveType === 'revision-quiz') && (
              <div className="w-full flex flex-col items-center space-y-4">
                <div className="p-4 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center max-w-lg w-full">
                  <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                    {currentStep.rule}
                  </div>
                  <div className="my-3 text-lg sm:text-2xl font-mono font-bold text-black dark:text-white">
                    <MathView latex={currentStep.latex} display={true} />
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-700 dark:text-slate-300 mt-2 leading-relaxed">
                    {currentStep.explanation}
                  </p>
                </div>

                {/* Quick button to open full custom algebraic resolver if available */}
                {currentDemo.interactiveType === 'algebra-arrows' && onOpenAlgebraSolver && (
                  <button
                    onClick={() => onOpenAlgebraSolver('(x+1)(x+2)')}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-medium transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Ouvrir l'éditeur de calcul algébrique libre</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Teacher Playback Controls Bar */}
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
            {/* Step Controls */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={handlePrev}
                disabled={currentStepIdx === 0}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 transition-colors"
                title="Étape précédente"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors shadow-md"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pause' : 'Animer'}</span>
              </button>

              <button
                onClick={handleNext}
                disabled={currentStepIdx === totalSteps - 1}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 transition-colors"
                title="Étape suivante"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleReset}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                title="Recommencer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Speed Selector */}
            <div className="flex items-center space-x-1 text-xs">
              <span className="text-neutral-500 dark:text-slate-400 mr-1 text-[11px]">Vitesse :</span>
              {[0.75, 1, 1.5].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-0.5 rounded-lg font-mono text-[11px] transition-colors border ${
                    speed === s
                      ? 'bg-white text-black border-2 border-black font-bold shadow-xs dark:bg-emerald-600/30 dark:text-emerald-300 dark:border-emerald-500/40'
                      : 'bg-white text-neutral-700 hover:bg-neutral-100 border-neutral-300 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:text-slate-200 dark:border-transparent'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Step-by-Step Derivation Board (5 cols) */}
        <div className="lg:col-span-5 flex flex-col bg-white border border-neutral-300 dark:bg-slate-900/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-slate-800">
            <h2 className="text-sm font-bold text-black dark:text-slate-200 flex items-center gap-1.5">
              <span>Déroulé du cours au tableau</span>
            </h2>
            <span className="text-[11px] font-mono text-neutral-500 dark:text-slate-400">Progression</span>
          </div>

          {/* Stepper list */}
          <div className="flex-1 overflow-y-auto space-y-2.5 py-3 pr-1 scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-slate-700">
            {currentDemo.steps.map((step, idx) => {
              const isActive = idx === currentStepIdx;
              const isPast = idx < currentStepIdx;

              const isGreen = idx % 2 === 0;

              return (
                <div
                  key={step.stepNumber}
                  onClick={() => setCurrentStepIdx(idx)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? isGreen
                        ? 'bg-emerald-50 text-emerald-950 border-2 border-emerald-600 shadow-md ring-2 ring-emerald-500/20 dark:bg-emerald-950/70 dark:border-emerald-500 dark:text-slate-100 dark:ring-emerald-500/40'
                        : 'bg-sky-50 text-sky-950 border-2 border-sky-600 shadow-md ring-2 ring-sky-500/20 dark:bg-indigo-950/70 dark:border-indigo-500 dark:text-slate-100 dark:ring-indigo-500/40'
                      : isPast
                      ? 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-700'
                      : 'bg-white border-neutral-200 text-neutral-400 hover:bg-neutral-50 dark:bg-slate-950/20 dark:border-slate-900 dark:text-slate-500 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold ${
                      isActive 
                        ? isGreen ? 'text-emerald-900 dark:text-emerald-300' : 'text-sky-900 dark:text-sky-300'
                        : 'text-neutral-900 dark:text-slate-200'
                    }`}>
                      {step.title}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isActive
                          ? isGreen
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold dark:bg-emerald-500/30 dark:text-emerald-300 dark:border-transparent'
                            : 'bg-sky-100 text-sky-800 border border-sky-300 font-bold dark:bg-sky-500/30 dark:text-sky-300 dark:border-transparent'
                          : isPast
                          ? 'bg-neutral-100 text-neutral-800 dark:bg-slate-800 dark:text-slate-400'
                          : 'bg-neutral-100 text-neutral-600 dark:bg-slate-900 dark:text-slate-600'
                      }`}
                    >
                      Étape {idx + 1}
                    </span>
                  </div>

                  {/* Math Formula line */}
                  <div className={`my-1.5 py-1 px-2 rounded-lg font-mono text-xs overflow-x-auto ${
                    isActive
                      ? isGreen
                        ? 'bg-white text-emerald-950 border border-emerald-300 shadow-xs dark:bg-slate-950/70 dark:text-emerald-300 dark:border-slate-800'
                        : 'bg-white text-sky-950 border border-sky-300 shadow-xs dark:bg-slate-950/70 dark:text-sky-300 dark:border-slate-800'
                      : 'bg-neutral-50 text-neutral-800 border border-neutral-200 dark:bg-slate-950/70 dark:text-emerald-300 dark:border-slate-800'
                  }`}>
                    {hideSolutionForClass && isActive && idx === totalSteps - 1 ? (
                      <span className="text-amber-500 dark:text-amber-400 font-semibold italic">
                        [Réponse masquée pour la classe — cliquez pour révéler]
                      </span>
                    ) : (
                      <MathView latex={step.latex} display={false} />
                    )}
                  </div>

                  <p className={`text-xs leading-normal ${
                    isActive 
                      ? isGreen ? 'text-emerald-950 font-medium dark:text-slate-100' : 'text-sky-950 font-medium dark:text-slate-100' 
                      : 'text-neutral-600 dark:text-slate-300'
                  }`}>
                    {step.explanation}
                  </p>

                  {/* Teacher pedagogical tip */}
                  {step.teacherTip && (
                    <div className={`mt-2 pt-2 border-t flex items-start space-x-1.5 text-[11px] p-1.5 rounded-lg ${
                      isActive
                        ? isGreen
                          ? 'border-emerald-200 bg-emerald-100/70 text-emerald-950 dark:border-slate-800/80 dark:text-amber-300/90 dark:bg-amber-950/20'
                          : 'border-sky-200 bg-sky-100/70 text-sky-950 dark:border-slate-800/80 dark:text-amber-300/90 dark:bg-amber-950/20'
                        : 'border-neutral-200 bg-neutral-100 text-neutral-800 dark:border-slate-800/80 dark:text-amber-300/90 dark:bg-amber-950/20'
                    }`}>
                      <HelpCircle className="w-3.5 h-3.5 shrink-0 text-amber-500 dark:text-amber-400 mt-0.5" />
                      <div>
                        <span className="font-bold">Conseil pour les élèves : </span>
                        {step.teacherTip}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Class Question / Reveal Button */}
          {hideSolutionForClass && (
            <div className="pt-3 border-t border-slate-800">
              <button
                onClick={() => setHideSolutionForClass(false)}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center space-x-2 shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Révéler la solution aux élèves !</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quiz Rapide à la fin de la leçon interactive pour tester les acquis des élèves de 3e et 4e */}
      {currentDemo.interactiveType !== 'video-lesson' && (
        <QuickQuiz
          chapter={chapter}
          demo={currentDemo}
          onScrollToExercises={() => {
            const el = document.getElementById('student-exercises-section');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />
      )}

      {/* 3 Graded Exercises (Facile, Moyen, Difficile) for the Student */}
      {currentDemo.interactiveType !== 'video-lesson' && (
        <StudentExercisesSection
          chapterId={chapter.id}
          chapterTitle={chapter.title}
          exercises={exercises}
        />
      )}
        </>
      )}

      {/* Floating Quick-Access Right Drawer Trigger */}
      <button
        onClick={() => setIsPrerequisitesOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-30 flex items-center px-2 py-3 rounded-l-2xl shadow-xl border-y border-l bg-white text-black hover:bg-neutral-50 border-neutral-300 dark:bg-slate-900 dark:text-white dark:border-slate-700 dark:hover:bg-slate-800 transition-all group"
        title="Ouvrir les prérequis du cours (Rappels)"
        aria-label="Ouvrir les prérequis"
      >
        <div className="flex flex-col items-center space-y-1">
          <BookOpenCheck className="w-4 h-4 text-red-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold [writing-mode:vertical-rl] rotate-180 uppercase tracking-wider py-0.5">
            Prérequis ({prerequisites.length})
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-amber-400 animate-pulse" />
        </div>
      </button>

      {/* Course Prerequisites Right Drawer */}
      <CoursePrerequisitesDrawer
        isOpen={isPrerequisitesOpen}
        onClose={() => setIsPrerequisitesOpen(false)}
        chapter={chapter}
        onNavigateToChapter={onSelectChapter}
      />
    </div>
  );
};
