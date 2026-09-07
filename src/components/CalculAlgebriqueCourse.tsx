import React, { useState } from 'react';
import { MathView } from './MathView';
import { FactorizationEngine } from './FactorizationEngine';
import { DevelopmentEngine } from './DevelopmentEngine';
import { StudentExercisesSection } from './StudentExercisesSection';
import { QuickQuiz } from './QuickQuiz';
import { COURSE_SECTIONS, CalculAlgebriqueSections } from './algebraCourse/CalculAlgebriqueSections';
import { CourseChapter } from '../coursesData';
import { getExercisesForChapter } from '../data/getCourseExercises';
import {
  BookOpen,
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle2,
  Calculator,
  HelpCircle,
  Lightbulb,
  Eye,
  EyeOff,
  Sliders,
  RotateCcw,
  FileText,
  ChevronRight,
  AlertTriangle,
  Play,
  Zap,
  PanelRightClose,
  PanelRightOpen,
  Bookmark,
  BookOpenCheck,
  X,
} from 'lucide-react';

interface CalculAlgebriqueCourseProps {
  onOpenAlgebraSolver?: (expr: string) => void;
  onOpenPrerequisites?: () => void;
}

type CourseSubTab = 'cours' | 'moteur-developpement' | 'moteur-factorisation' | 'labo-visuel' | 'calculateur-valeur' | 'exercices';

export const CalculAlgebriqueCourse: React.FC<CalculAlgebriqueCourseProps> = ({
  onOpenAlgebraSolver,
  onOpenPrerequisites,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<CourseSubTab>('cours');
  const [activeSection, setActiveSection] = useState<number>(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Geometric area simulation state for (a + b)^2
  const [geomA, setGeomA] = useState<number>(3);
  const [geomB, setGeomB] = useState<number>(2);

  // Numerical value evaluator state
  const [evalExprType, setEvalExprType] = useState<string>('polynome');
  const [evalXVal, setEvalXVal] = useState<number>(-2);

  // 4 arrows expansion simulator
  const [arrowA, setArrowA] = useState<number>(1); // ax
  const [arrowB, setArrowB] = useState<number>(3); // +b
  const [arrowC, setArrowC] = useState<number>(2); // cx
  const [arrowD, setArrowD] = useState<number>(-4); // +d
  const [arrowStep, setArrowStep] = useState<number>(4);

  // Exercises state
  const [openExerciseSolution, setOpenExerciseSolution] = useState<Record<number, boolean>>({});
  const [openExerciseHint, setOpenExerciseHint] = useState<Record<number, boolean>>({});

  const toggleSolution = (id: number) => {
    setOpenExerciseSolution((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleHint = (id: number) => {
    setOpenExerciseHint((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Sections of the course (9 comprehensive sections)
  const courseSections = COURSE_SECTIONS;

  return (
    <div className="flex flex-col space-y-4">
      {/* Course Header Banner */}
      <div className="bg-white dark:bg-slate-900/90 border border-neutral-300 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs dark:shadow-xl relative overflow-hidden backdrop-blur-sm transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-neutral-100 text-black border border-neutral-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30">
                Programme Sénégal - Classe de 4ème
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-neutral-100 text-black border border-neutral-300 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30">
                Activités Numériques
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white mt-2 tracking-tight">
              Cours Complet : <span className="text-red-600 dark:text-emerald-400">Calcul Algébrique en 4e</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Expressions littérales, règles de suppression des parenthèses, réduction par termes semblables, distributivité simple & double, les 3 identités remarquables et techniques de factorisation.
            </p>
          </div>

          {/* Quick link to free sandbox */}
          {onOpenAlgebraSolver && (
            <button
              onClick={() => onOpenAlgebraSolver('(x+3)(2x-5)')}
              className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs transition-all shadow-xs shrink-0 dark:bg-indigo-600 dark:hover:bg-indigo-500"
            >
              <Sparkles className="w-4 h-4 text-red-500 dark:text-amber-300" />
              <span>Tester le Calculateur Libre</span>
            </button>
          )}
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex overflow-x-auto sm:flex-wrap gap-2 mt-4 pt-3 border-t border-neutral-200 dark:border-slate-800/80 pb-1.5 sm:pb-0 scrollbar-thin">
          <button
            onClick={() => setActiveSubTab('cours')}
            className={`shrink-0 flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] ${
              activeSubTab === 'cours'
                ? 'bg-black text-white dark:bg-emerald-500 dark:text-slate-950 shadow-xs'
                : 'bg-white hover:bg-neutral-100 text-black border border-neutral-300 dark:bg-slate-800/70 dark:hover:bg-slate-800 dark:text-slate-300 dark:border-slate-700/60'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">1. Leçons & Méthodes (I à VII)</span>
            <span className="sm:hidden">1. Leçons (I-VII)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('moteur-developpement')}
            className={`shrink-0 flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] ${
              activeSubTab === 'moteur-developpement'
                ? 'bg-red-600 text-white shadow-xs ring-2 ring-red-600/30'
                : 'bg-white hover:bg-neutral-100 text-black border border-neutral-300 dark:bg-slate-800/70 dark:hover:bg-slate-800 dark:text-slate-300 dark:border-slate-700/60'
            }`}
          >
            <Zap className="w-4 h-4 text-white dark:text-red-400 animate-pulse shrink-0" />
            <span className="flex items-center gap-1.5">
              <span className="hidden sm:inline">2. Moteur Développement (Termes Rouges)</span>
              <span className="sm:hidden">2. Développer (Rouge)</span>
              <span className="text-[10px] bg-red-700 text-white px-1.5 py-0.5 rounded uppercase font-extrabold tracking-wider">
                Interactif
              </span>
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('moteur-factorisation')}
            className={`shrink-0 flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] ${
              activeSubTab === 'moteur-factorisation'
                ? 'bg-red-600 text-white shadow-xs ring-2 ring-red-600/30'
                : 'bg-white hover:bg-neutral-100 text-black border border-neutral-300 dark:bg-slate-800/70 dark:hover:bg-slate-800 dark:text-slate-300 dark:border-slate-700/60'
            }`}
          >
            <Zap className="w-4 h-4 text-white dark:text-red-400 animate-pulse shrink-0" />
            <span className="flex items-center gap-1.5">
              <span className="hidden sm:inline">3. Moteur Factorisation (Facteur Rouge)</span>
              <span className="sm:hidden">3. Factoriser (Rouge)</span>
              <span className="text-[10px] bg-red-700 text-white px-1.5 py-0.5 rounded uppercase font-extrabold tracking-wider">
                Interactif
              </span>
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('labo-visuel')}
            className={`shrink-0 flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] ${
              activeSubTab === 'labo-visuel'
                ? 'bg-black text-white dark:bg-indigo-600 dark:text-white shadow-xs'
                : 'bg-white hover:bg-neutral-100 text-black border border-neutral-300 dark:bg-slate-800/70 dark:hover:bg-slate-800 dark:text-slate-300 dark:border-slate-700/60'
            }`}
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">4. Laboratoire Visuel (Aires)</span>
            <span className="sm:hidden">4. Labo Visuel</span>
          </button>

          <button
            onClick={() => setActiveSubTab('calculateur-valeur')}
            className={`shrink-0 flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] ${
              activeSubTab === 'calculateur-valeur'
                ? 'bg-black text-white dark:bg-amber-500 dark:text-slate-950 shadow-xs'
                : 'bg-white hover:bg-neutral-100 text-black border border-neutral-300 dark:bg-slate-800/70 dark:hover:bg-slate-800 dark:text-slate-300 dark:border-slate-700/60'
            }`}
          >
            <Calculator className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">5. Simulateur Valeur Numérique</span>
            <span className="sm:hidden">5. Valeur Numérique</span>
          </button>

          <button
            onClick={() => setActiveSubTab('exercices')}
            className={`shrink-0 flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] ${
              activeSubTab === 'exercices'
                ? 'bg-red-600 text-white dark:bg-rose-600 dark:text-white shadow-xs'
                : 'bg-white hover:bg-neutral-100 text-black border border-neutral-300 dark:bg-slate-800/70 dark:hover:bg-slate-800 dark:text-slate-300 dark:border-slate-700/60'
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">6. Exercices Types Brevet (6)</span>
            <span className="sm:hidden">6. Exercices (6)</span>
          </button>

          {onOpenPrerequisites && (
            <button
              onClick={onOpenPrerequisites}
              className="shrink-0 flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] bg-white hover:bg-neutral-100 text-black border-2 border-red-600/50 hover:border-red-600 shadow-xs dark:bg-slate-800/80 dark:text-amber-300 dark:border-amber-500/40"
              title="Ouvrir le panneau des prérequis et rappels de 5e/4e pour ce cours"
            >
              <BookOpenCheck className="w-4 h-4 text-red-600 dark:text-amber-400 shrink-0" />
              <span>Prérequis & Rappels</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: COURS MAGISTRAL & METHODES */}
      {activeSubTab === 'cours' && (
        <div className="flex flex-col space-y-3">
          {/* Top Control Bar with Section Info and Sidebar Toggle */}
          <div className="flex items-center justify-between bg-neutral-50 dark:bg-slate-900/80 border border-neutral-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 shadow-xs transition-colors">
            <div className="flex items-center space-x-2.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 dark:bg-emerald-400 animate-pulse shrink-0" />
              <div className="truncate text-xs">
                <span className="text-neutral-600 dark:text-slate-400 font-medium hidden sm:inline">Section active : </span>
                <span className="text-black dark:text-emerald-300 font-bold font-mono">
                  {courseSections.find(s => s.id === activeSection)?.number} • {courseSections.find(s => s.id === activeSection)?.title}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`shrink-0 flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                isSidebarOpen
                  ? 'bg-white hover:bg-neutral-100 text-black border-neutral-300 dark:bg-slate-800 dark:hover:bg-slate-700/80 dark:text-slate-300 dark:border-slate-700'
                  : 'bg-white hover:bg-neutral-100 text-black border-neutral-300 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 dark:text-emerald-300 dark:border-emerald-500/40 shadow-xs'
              }`}
              title={isSidebarOpen ? "Masquer le sommaire à droite" : "Afficher le sommaire à droite"}
            >
              {isSidebarOpen ? (
                <>
                  <PanelRightClose className="w-4 h-4 text-neutral-600 dark:text-slate-400" />
                  <span className="hidden sm:inline">Masquer le sommaire</span>
                </>
              ) : (
                <>
                  <PanelRightOpen className="w-4 h-4 text-red-600 dark:text-emerald-400" />
                  <span>Sommaire ({courseSections.length})</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile Section Selector (< lg) when sidebar is open */}
          {isSidebarOpen && (
            <div className="lg:hidden bg-white dark:bg-slate-900/90 border border-neutral-300 dark:border-slate-800 rounded-xl p-2.5 shadow-xs animate-fade-in transition-colors">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[11px] font-bold text-neutral-500 dark:text-slate-400 uppercase tracking-wider">
                  Sections du cours ({courseSections.length})
                </span>
                <span className="text-[11px] text-red-600 dark:text-emerald-400 font-mono font-bold">
                  Section {activeSection}/{courseSections.length}
                </span>
              </div>
              <div className="flex overflow-x-auto gap-1.5 pb-1 scrollbar-thin">
                {courseSections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSection(sec.id)}
                    className={`shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 min-h-[36px] transition-all border ${
                      activeSection === sec.id
                        ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-emerald-500 dark:text-slate-950 font-bold shadow-xs'
                        : 'bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-100 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700/50'
                    }`}
                  >
                    <span className="font-mono text-[11px] font-bold">{sec.number}</span>
                    <span className="max-w-[130px] truncate">{sec.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Course Layout: Left = Main Course Content, Right = Collapsible Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start relative">
            {/* Detailed Course Content Panel (Expands to 12 cols when sidebar is collapsed) */}
            <div className={`${isSidebarOpen ? 'lg:col-span-8 xl:col-span-8' : 'lg:col-span-12'} bg-white dark:bg-slate-900/90 border border-neutral-300 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs dark:shadow-xl flex flex-col space-y-5 transition-all duration-200`}>
              <CalculAlgebriqueSections
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                onNavigateSubTab={(tab) => setActiveSubTab(tab)}
              />
            </div>

            {/* Collapsible Right Sidebar (lg+) */}
            {isSidebarOpen && (
              <div className="hidden lg:flex lg:col-span-4 xl:col-span-4 flex-col space-y-3 sticky top-4 animate-fade-in">
                <div className="bg-white dark:bg-slate-900/95 border border-neutral-300 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs dark:shadow-xl backdrop-blur-sm transition-colors">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-200 dark:border-slate-800/80 px-1">
                    <div className="flex items-center space-x-2">
                      <Bookmark className="w-4 h-4 text-red-600 dark:text-emerald-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-black dark:text-slate-300">
                        Sommaire du Chapitre
                      </h3>
                    </div>
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-600 hover:text-black dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
                      title="Masquer la barre latérale"
                    >
                      <PanelRightClose className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-[11px] text-neutral-500 dark:text-slate-400 px-1 mb-2 font-mono flex items-center justify-between">
                    <span>9 sections au programme</span>
                    <span className="text-red-600 dark:text-emerald-400 font-bold">{activeSection}/9 active</span>
                  </div>

                  <div className="flex flex-col space-y-1 max-h-[calc(100vh-280px)] overflow-y-auto pr-1 scrollbar-thin">
                    {courseSections.map((sec) => (
                      <button
                        key={sec.id}
                        onClick={() => setActiveSection(sec.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl text-left transition-all text-xs group ${
                          activeSection === sec.id
                            ? 'bg-neutral-900 border border-neutral-900 border-l-4 border-l-red-600 text-white font-semibold shadow-md dark:bg-emerald-500/15 dark:border-emerald-500/40 dark:border-l-emerald-500 dark:text-emerald-200'
                            : 'hover:bg-neutral-100 text-neutral-700 hover:text-black dark:hover:bg-slate-800/70 dark:text-slate-400 dark:hover:text-slate-200 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-[11px] font-bold shrink-0 transition-colors ${
                              activeSection === sec.id
                                ? 'bg-red-600 text-white dark:bg-emerald-500 dark:text-slate-950'
                                : 'bg-neutral-100 text-neutral-800 dark:bg-slate-800 dark:text-slate-300 group-hover:bg-neutral-200 dark:group-hover:bg-slate-700'
                            }`}
                          >
                            {sec.number}
                          </span>
                          <span className={`truncate ${activeSection === sec.id ? 'text-white' : ''}`}>{sec.title}</span>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 shrink-0 ml-1 transition-transform ${
                          activeSection === sec.id ? 'text-red-500 translate-x-0.5' : 'text-neutral-400 dark:text-slate-500'
                        }`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Pedagogical Tip in the Right Sidebar */}
                <div className="bg-white border border-neutral-300 dark:bg-emerald-950/30 dark:border-emerald-500/20 rounded-2xl p-3.5 text-xs text-neutral-800 dark:text-emerald-200 shadow-xs transition-colors">
                  <div className="flex items-center space-x-2 font-bold text-black dark:text-white mb-1">
                    <Lightbulb className="w-4 h-4 text-red-600 dark:text-emerald-400" />
                    <span>Conseil du Professeur</span>
                  </div>
                  <p className="text-neutral-700 dark:text-slate-300 leading-relaxed text-[11px]">
                    En 4ème, 80% des erreurs au devoir proviennent de la gestion des signes (particulièrement du signe « - » devant une parenthèse ou lors du produit de deux termes négatifs). Soyez systématique !
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Floating Reopen Button when Sidebar is Collapsed on Desktop */}
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="hidden lg:flex fixed bottom-6 right-6 z-40 items-center space-x-2 px-3.5 py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 font-bold text-xs shadow-xl transition-all hover:scale-105"
              title="Afficher le sommaire des sections"
            >
              <PanelRightOpen className="w-4 h-4 text-red-500 dark:text-slate-950" />
              <span>Sommaire ({activeSection}/{courseSections.length})</span>
            </button>
          )}
        </div>
      )}

      {/* TAB 2: MOTEUR DE DÉPLACEMENT DYNAMIQUE POUR LE DÉVELOPPEMENT */}
      {activeSubTab === 'moteur-developpement' && (
        <div className="animate-fade-in space-y-4">
          <DevelopmentEngine onOpenAlgebraSolver={onOpenAlgebraSolver} />
        </div>
      )}

      {/* TAB 3: MOTEUR DE DÉPLACEMENT DYNAMIQUE POUR LA FACTORISATION */}
      {activeSubTab === 'moteur-factorisation' && (
        <div className="animate-fade-in space-y-4">
          <FactorizationEngine onOpenAlgebraSolver={onOpenAlgebraSolver} />
        </div>
      )}

      {/* TAB 4: LABORATOIRE VISUEL (AIRES & 4 FLECHES) */}
      {activeSubTab === 'labo-visuel' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Top Banners pointing to the Development & Factorization Engines */}
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-950/60 via-slate-900 to-amber-950/60 border border-red-500/30 flex flex-wrap items-center justify-between gap-3 shadow-md">
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5 text-red-400 animate-pulse" />
                <div>
                  <span className="text-xs font-bold text-white block">
                    Développement avec élément en ROUGE & déplacement animé
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Zéro disparition : termes distribués et remplacés explicites.
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveSubTab('moteur-developpement')}
                className="px-3.5 py-1.5 rounded-xl bg-black hover:bg-neutral-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-xs"
              >
                <span>Moteur de développement</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-gradient-to-r dark:from-red-950/60 dark:via-slate-900 dark:to-indigo-950/60 border border-neutral-300 dark:border-red-500/30 flex flex-wrap items-center justify-between gap-3 shadow-xs dark:shadow-md">
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5 text-red-600 dark:text-red-400" />
                <div>
                  <span className="text-xs font-bold text-black dark:text-white block">
                    Factorisation avec facteur commun en ROUGE
                  </span>
                  <span className="text-[11px] text-neutral-500 dark:text-slate-400">
                    Glissement physique vers l'avant et extraction en tête.
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveSubTab('moteur-factorisation')}
                className="px-3.5 py-1.5 rounded-xl bg-black hover:bg-neutral-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-xs"
              >
                <span>Moteur de factorisation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          {/* Visual 1: Geometric Area of (a+b)^2 */}
          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col space-y-4">
            <div className="border-b border-slate-800 pb-2">
              <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">
                Interprétation Géométrique
              </span>
              <h3 className="text-base sm:text-lg font-bold text-black dark:text-white mt-0.5">
                Preuve par les aires : (a + b)² = a² + 2ab + b²
              </h3>
            </div>

            <p className="text-xs text-slate-300">
              Un carré de côté <MathView latex="(a + b)" display={false} /> se découpe en 4 aires : 1 carré d'aire <MathView latex="a^2" display={false} />, 1 carré d'aire <MathView latex="b^2" display={false} /> et 2 rectangles d'aire <MathView latex="ab" display={false} /> !
            </p>

            {/* Interactive SVG Square */}
            <div className="w-full flex justify-center items-center py-2">
              {(() => {
                const scale = 24;
                const widthA = geomA * scale;
                const widthB = geomB * scale;
                const totalSide = widthA + widthB;
                return (
                  <svg
                    viewBox={`-30 -30 ${totalSide + 60} ${totalSide + 60}`}
                    className="w-full max-w-[320px] h-auto drop-shadow-md select-none"
                  >
                    {/* Square a^2 (Top-left) */}
                    <rect
                      x="0"
                      y="0"
                      width={widthA}
                      height={widthA}
                      fill="#0284c7"
                      fillOpacity="0.3"
                      stroke="#38bdf8"
                      strokeWidth="2"
                    />
                    <text
                      x={widthA / 2}
                      y={widthA / 2 + 5}
                      fill="#38bdf8"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="13"
                    >
                      a² = {geomA * geomA}
                    </text>

                    {/* Rectangle a * b (Top-right) */}
                    <rect
                      x={widthA}
                      y="0"
                      width={widthB}
                      height={widthA}
                      fill="#f59e0b"
                      fillOpacity="0.25"
                      stroke="#fbbf24"
                      strokeWidth="2"
                    />
                    <text
                      x={widthA + widthB / 2}
                      y={widthA / 2 + 5}
                      fill="#fbbf24"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="12"
                    >
                      ab = {geomA * geomB}
                    </text>

                    {/* Rectangle a * b (Bottom-left) */}
                    <rect
                      x="0"
                      y={widthA}
                      width={widthA}
                      height={widthB}
                      fill="#f59e0b"
                      fillOpacity="0.25"
                      stroke="#fbbf24"
                      strokeWidth="2"
                    />
                    <text
                      x={widthA / 2}
                      y={widthA + widthB / 2 + 5}
                      fill="#fbbf24"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="12"
                    >
                      ab = {geomA * geomB}
                    </text>

                    {/* Square b^2 (Bottom-right) */}
                    <rect
                      x={widthA}
                      y={widthA}
                      width={widthB}
                      height={widthB}
                      fill="#ec4899"
                      fillOpacity="0.3"
                      stroke="#f472b6"
                      strokeWidth="2"
                    />
                    <text
                      x={widthA + widthB / 2}
                      y={widthA + widthB / 2 + 5}
                      fill="#f472b6"
                      textAnchor="middle"
                      fontWeight="bold"
                      fontSize="12"
                    >
                      b² = {geomB * geomB}
                    </text>

                    {/* Outer border */}
                    <rect
                      x="0"
                      y="0"
                      width={totalSide}
                      height={totalSide}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                    />

                    {/* Dimension labels */}
                    <text x={widthA / 2} y="-10" fill="#38bdf8" textAnchor="middle" fontSize="11" fontWeight="bold">
                      a = {geomA}
                    </text>
                    <text x={widthA + widthB / 2} y="-10" fill="#fbbf24" textAnchor="middle" fontSize="11" fontWeight="bold">
                      b = {geomB}
                    </text>
                  </svg>
                );
              })()}
            </div>

            {/* Slider controls */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-sky-300 font-bold">Valeur de a : {geomA}</span>
                <input
                  type="range"
                  min="2"
                  max="6"
                  value={geomA}
                  onChange={(e) => setGeomA(parseInt(e.target.value))}
                  className="w-36 accent-sky-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-amber-300 font-bold">Valeur de b : {geomB}</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={geomB}
                  onChange={(e) => setGeomB(parseInt(e.target.value))}
                  className="w-36 accent-amber-500"
                />
              </div>
            </div>

            {/* Total Area readout */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm font-mono text-center text-slate-200">
              Aire totale = <span className="text-emerald-400 font-bold">({geomA} + {geomB})²</span> = {geomA + geomB}² ={' '}
              <span className="text-white font-extrabold text-base">{(geomA + geomB) ** 2}</span>
              <br />
              <span className="text-[11px] text-slate-400">
                Décomposition : {geomA * geomA} (a²) + 2×{geomA * geomB} (2ab) + {geomB * geomB} (b²) = {(geomA + geomB) ** 2}
              </span>
            </div>
          </div>

          {/* Visual 2: The 4 Arrows of Double Distributivity */}
          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col space-y-4">
            <div className="border-b border-slate-800 pb-2">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                Simulateur Dynamique
              </span>
              <h3 className="text-base sm:text-lg font-bold text-black dark:text-white mt-0.5">
                La Règle des 4 Flèches : (ax + b)(cx + d)
              </h3>
            </div>

            <p className="text-xs text-slate-300">
              Observez chaque flèche de multiplication avec le signe associé :
            </p>

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5 text-xs">
              <span className="text-slate-400 text-[11px] self-center">Exemples types :</span>
              <button
                onClick={() => {
                  setArrowA(1);
                  setArrowB(2);
                  setArrowC(1);
                  setArrowD(3);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700"
              >
                (x + 2)(x + 3)
              </button>
              <button
                onClick={() => {
                  setArrowA(2);
                  setArrowB(-3);
                  setArrowC(1);
                  setArrowD(4);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700"
              >
                (2x - 3)(x + 4)
              </button>
              <button
                onClick={() => {
                  setArrowA(3);
                  setArrowB(-2);
                  setArrowC(2);
                  setArrowD(-5);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700"
              >
                (3x - 2)(2x - 5)
              </button>
            </div>

            {/* Diagram with 4 arrows */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center">
              {/* Formula display with color highlights */}
              <div className="text-xl sm:text-2xl font-mono font-bold text-black dark:text-white my-3 flex items-center space-x-1">
                <span>(</span>
                <span className="text-sky-400">{arrowA === 1 ? 'x' : `${arrowA}x`}</span>
                <span>{arrowB >= 0 ? ` + ${arrowB}` : ` - ${Math.abs(arrowB)}`}</span>
                <span>)(</span>
                <span className="text-indigo-400">{arrowC === 1 ? 'x' : `${arrowC}x`}</span>
                <span>{arrowD >= 0 ? ` + ${arrowD}` : ` - ${Math.abs(arrowD)}`}</span>
                <span>)</span>
              </div>

              {/* The 4 Arrow Breakdown */}
              <div className="w-full space-y-2 mt-2">
                <div className="p-2 rounded-lg bg-slate-900 border border-sky-500/30 text-xs flex items-center justify-between">
                  <span className="text-sky-300 font-bold">1ère flèche (Haut-Gauche vers Haut-Gauche) :</span>
                  <span className="font-mono text-white">
                    ({arrowA}x) × ({arrowC}x) ={' '}
                    <strong className="text-sky-400">{arrowA * arrowC}x²</strong>
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-slate-900 border border-indigo-500/30 text-xs flex items-center justify-between">
                  <span className="text-indigo-300 font-bold">2ème flèche (Haut-Gauche vers Haut-Droite) :</span>
                  <span className="font-mono text-white">
                    ({arrowA}x) × ({arrowD}) ={' '}
                    <strong className="text-indigo-400">
                      {arrowA * arrowD >= 0 ? `+${arrowA * arrowD}x` : `${arrowA * arrowD}x`}
                    </strong>
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-slate-900 border border-amber-500/30 text-xs flex items-center justify-between">
                  <span className="text-amber-300 font-bold">3ème flèche (Bas-Droite vers Bas-Gauche) :</span>
                  <span className="font-mono text-white">
                    ({arrowB}) × ({arrowC}x) ={' '}
                    <strong className="text-amber-400">
                      {arrowB * arrowC >= 0 ? `+${arrowB * arrowC}x` : `${arrowB * arrowC}x`}
                    </strong>
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-slate-900 border border-pink-500/30 text-xs flex items-center justify-between">
                  <span className="text-pink-300 font-bold">4ème flèche (Bas-Droite vers Bas-Droite) :</span>
                  <span className="font-mono text-white">
                    ({arrowB}) × ({arrowD}) ={' '}
                    <strong className="text-pink-400">
                      {arrowB * arrowD >= 0 ? `+${arrowB * arrowD}` : `${arrowB * arrowD}`}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Reduced Result */}
            {(() => {
              const aTerm = arrowA * arrowC;
              const midTerm = arrowA * arrowD + arrowB * arrowC;
              const constTerm = arrowB * arrowD;
              return (
                <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-center space-y-1">
                  <span className="text-xs text-emerald-300 font-semibold uppercase tracking-wider block">
                    Forme Développée et Réduite Finale :
                  </span>
                  <div className="text-lg sm:text-xl font-mono font-bold text-black dark:text-white">
                    {aTerm === 1 ? 'x²' : `${aTerm}x²`}
                    {midTerm >= 0 ? ` + ${midTerm}x` : ` - ${Math.abs(midTerm)}x`}
                    {constTerm >= 0 ? ` + ${constTerm}` : ` - ${Math.abs(constTerm)}`}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* TAB 3: CALCULATEUR DE VALEUR NUMERIQUE */}
      {activeSubTab === 'calculateur-valeur' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
              Outil Pédagogique Interactif
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-black dark:text-white mt-1">
              Calculateur Pas-à-Pas de Valeur Numérique
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Observez comment les parenthèses de remplacement sont appliquées et comment les priorités opératoires sont strictement respectées.
            </p>
          </div>

          {/* Configuration Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                1. Choisir l'expression littérale :
              </label>
              <select
                value={evalExprType}
                onChange={(e) => setEvalExprType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2 text-xs font-mono focus:outline-none focus:border-amber-400"
              >
                <option value="polynome">E(x) = 2x² - 5x + 3</option>
                <option value="identite">F(x) = (x + 3)² - 4</option>
                <option value="produit">G(x) = (2x - 1)(x + 4)</option>
                <option value="fraction">H(x) = -3x² + 7x - 2</option>
              </select>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                2. Choisir la valeur de x :
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[-3, -2, -1, 0, 1, 2, 3, 5].map((val) => (
                  <button
                    key={val}
                    onClick={() => setEvalXVal(val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      evalXVal === val
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    x = {val}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Step-by-Step Resolution Panel */}
          {(() => {
            let exprTitle = '';
            let step1 = '';
            let step2 = '';
            let step3 = '';
            let finalResult = 0;

            const x = evalXVal;
            const xSq = x * x;

            if (evalExprType === 'polynome') {
              exprTitle = 'E(x) = 2x^2 - 5x + 3';
              step1 = `E(${x}) = 2 \\times (${x})^2 - 5 \\times (${x}) + 3`;
              step2 = `E(${x}) = 2 \\times ${xSq} ${-5 * x >= 0 ? `+ ${-5 * x}` : `- ${Math.abs(-5 * x)}`} + 3`;
              step3 = `E(${x}) = ${2 * xSq} ${-5 * x >= 0 ? `+ ${-5 * x}` : `- ${Math.abs(-5 * x)}`} + 3`;
              finalResult = 2 * xSq - 5 * x + 3;
            } else if (evalExprType === 'identite') {
              exprTitle = 'F(x) = (x + 3)^2 - 4';
              const inside = x + 3;
              step1 = `F(${x}) = (${x} + 3)^2 - 4`;
              step2 = `F(${x}) = (${inside})^2 - 4`;
              step3 = `F(${x}) = ${inside * inside} - 4`;
              finalResult = inside * inside - 4;
            } else if (evalExprType === 'produit') {
              exprTitle = 'G(x) = (2x - 1)(x + 4)';
              const p1 = 2 * x - 1;
              const p2 = x + 4;
              step1 = `G(${x}) = (2 \\times (${x}) - 1)(${x} + 4)`;
              step2 = `G(${x}) = (${2 * x} - 1)(${p2}) = (${p1}) \\times (${p2})`;
              step3 = `G(${x}) = ${p1} \\times ${p2}`;
              finalResult = p1 * p2;
            } else {
              exprTitle = 'H(x) = -3x^2 + 7x - 2';
              step1 = `H(${x}) = -3 \\times (${x})^2 + 7 \\times (${x}) - 2`;
              step2 = `H(${x}) = -3 \\times ${xSq} ${7 * x >= 0 ? `+ ${7 * x}` : `- ${Math.abs(7 * x)}`} - 2`;
              step3 = `H(${x}) = ${-3 * xSq} ${7 * x >= 0 ? `+ ${7 * x}` : `- ${Math.abs(7 * x)}`} - 2`;
              finalResult = -3 * xSq + 7 * x - 2;
            }

            return (
              <div className="bg-slate-950 p-4 sm:p-5 rounded-xl border border-amber-500/30 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-xs font-bold text-amber-400">
                    Déroulement du calcul pour x = {evalXVal} :
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    <MathView latex={exprTitle} display={false} />
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs sm:text-sm pl-2 border-l-2 border-amber-500">
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 block font-sans">
                      1. Remplacement de x par ({evalXVal}) :
                    </span>
                    <div className="text-amber-200">
                      <MathView latex={step1} display={false} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 block font-sans">
                      2. Calcul des puissances et parenthèses :
                    </span>
                    <div className="text-amber-300">
                      <MathView latex={step2} display={false} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 block font-sans">
                      3. Calcul des multiplications :
                    </span>
                    <div className="text-amber-300">
                      <MathView latex={step3} display={false} />
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-[11px] text-emerald-400 block font-sans font-bold">
                      Résultat final :
                    </span>
                    <div className="text-emerald-400 font-extrabold text-base sm:text-lg">
                      = {finalResult}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 4: EXERCICES D'APPLICATION ET DEVOIRS (6) */}
      {activeSubTab === 'exercices' && (
        <div className="flex flex-col space-y-6">
          {/* 3 Interactive Graded Exercises (Facile, Moyen, Difficile) */}
          <StudentExercisesSection
            chapterId="calcul-algebrique"
            chapterTitle="Calcul algébrique - 4e"
            exercises={getExercisesForChapter('calcul-algebrique')}
          />

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
            <h3 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-rose-400" />
              <span>Série d'Exercices d'Application & Devoirs Types (Programme Sénégal 4e)</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Travaillez d'abord sur votre cahier de brouillon, puis cliquez sur « Voir l'indice » ou « Solution rédigée » pour comparer votre rédaction avec celle attendue par le professeur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* EXERCICE 1 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Exercice 1 : Réduction
                  </span>
                  <span className="text-xs text-slate-400">Niveau : Facile</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-medium">
                  Réduire et ordonner l'expression suivante suivant les puissances décroissantes de x :
                </p>
                <div className="p-2.5 bg-slate-950 rounded-xl my-2 text-center font-mono text-black dark:text-white text-sm">
                  <MathView latex="A(x) = 5x^2 - 3x + 7 - 2x^2 + 8x - 11" display={true} />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleHint(1)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center space-x-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>{openExerciseHint[1] ? 'Masquer indice' : 'Indice'}</span>
                  </button>
                  <button
                    onClick={() => toggleSolution(1)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{openExerciseSolution[1] ? 'Masquer solution' : 'Solution rédigée'}</span>
                  </button>
                </div>

                {openExerciseHint[1] && (
                  <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200">
                    Regroupez les termes en x², puis les termes en x, puis les constantes.
                  </div>
                )}

                {openExerciseSolution[1] && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/40 text-xs text-slate-200 space-y-1 font-mono">
                    <div>A(x) = (5x² - 2x²) + (-3x + 8x) + (7 - 11)</div>
                    <div className="text-emerald-400 font-bold">A(x) = 3x² + 5x - 4</div>
                  </div>
                )}
              </div>
            </div>

            {/* EXERCICE 2 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Exercice 2 : Double Distributivité
                  </span>
                  <span className="text-xs text-slate-400">Niveau : Moyen</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-medium">
                  Développer, réduire et ordonner l'expression :
                </p>
                <div className="p-2.5 bg-slate-950 rounded-xl my-2 text-center font-mono text-white text-sm">
                  <MathView latex="B(x) = (2x - 3)(4x + 5)" display={true} />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleHint(2)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center space-x-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>{openExerciseHint[2] ? 'Masquer indice' : 'Indice'}</span>
                  </button>
                  <button
                    onClick={() => toggleSolution(2)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{openExerciseSolution[2] ? 'Masquer solution' : 'Solution rédigée'}</span>
                  </button>
                </div>

                {openExerciseHint[2] && (
                  <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200">
                    Appliquez les 4 flèches : (2x)×(4x) + (2x)×(5) - (3)×(4x) - (3)×(5).
                  </div>
                )}

                {openExerciseSolution[2] && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/40 text-xs text-slate-200 space-y-1 font-mono">
                    <div>B(x) = 8x² + 10x - 12x - 15</div>
                    <div className="text-emerald-400 font-bold">B(x) = 8x² - 2x - 15</div>
                  </div>
                )}
              </div>
            </div>

            {/* EXERCICE 3 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                    Exercice 3 : Identités Remarquables
                  </span>
                  <span className="text-xs text-slate-400">Niveau : Moyen</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-medium">
                  Développer directement à l'aide des identités remarquables :
                </p>
                <div className="p-2.5 bg-slate-950 rounded-xl my-2 text-center font-mono text-white text-sm">
                  <MathView latex="C(x) = (3x - 4)^2" display={true} />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleHint(3)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center space-x-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>{openExerciseHint[3] ? 'Masquer indice' : 'Indice'}</span>
                  </button>
                  <button
                    onClick={() => toggleSolution(3)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{openExerciseSolution[3] ? 'Masquer solution' : 'Solution rédigée'}</span>
                  </button>
                </div>

                {openExerciseHint[3] && (
                  <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200">
                    Formule (a - b)² = a² - 2ab + b² avec a = 3x et b = 4. Attention : (3x)² = 9x².
                  </div>
                )}

                {openExerciseSolution[3] && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/40 text-xs text-slate-200 space-y-1 font-mono">
                    <div>C(x) = (3x)² - 2 × (3x) × (4) + (4)²</div>
                    <div className="text-emerald-400 font-bold">C(x) = 9x² - 24x + 16</div>
                  </div>
                )}
              </div>
            </div>

            {/* EXERCICE 4 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Exercice 4 : Factorisation (Facteur commun)
                  </span>
                  <span className="text-xs text-slate-400">Niveau : Moyen</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-medium">
                  Factoriser l'expression suivante en trouvant le facteur commun :
                </p>
                <div className="p-2.5 bg-slate-950 rounded-xl my-2 text-center font-mono text-white text-sm">
                  <MathView latex="D(x) = (2x - 5)(x + 3) + (2x - 5)(3x - 1)" display={true} />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleHint(4)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center space-x-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>{openExerciseHint[4] ? 'Masquer indice' : 'Indice'}</span>
                  </button>
                  <button
                    onClick={() => toggleSolution(4)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{openExerciseSolution[4] ? 'Masquer solution' : 'Solution rédigée'}</span>
                  </button>
                </div>

                {openExerciseHint[4] && (
                  <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200">
                    Mettre en facteur (2x - 5), puis additionner les deux termes restants entre crochets.
                  </div>
                )}

                {openExerciseSolution[4] && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/40 text-xs text-slate-200 space-y-1 font-mono">
                    <div>D(x) = (2x - 5) [ (x + 3) + (3x - 1) ]</div>
                    <div>D(x) = (2x - 5) (x + 3 + 3x - 1)</div>
                    <div className="text-emerald-400 font-bold">D(x) = (2x - 5)(4x + 2) = 2(2x - 5)(2x + 1)</div>
                  </div>
                )}
              </div>
            </div>

            {/* EXERCICE 5 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Exercice 5 : Factorisation a² - b²
                  </span>
                  <span className="text-xs text-slate-400">Niveau : Moyen</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-medium">
                  Factoriser en utilisant l'identité remarquable <MathView latex="a^2 - b^2" display={false} /> :
                </p>
                <div className="p-2.5 bg-slate-950 rounded-xl my-2 text-center font-mono text-white text-sm">
                  <MathView latex="E(x) = 25x^2 - 36" display={true} />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleHint(5)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center space-x-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>{openExerciseHint[5] ? 'Masquer indice' : 'Indice'}</span>
                  </button>
                  <button
                    onClick={() => toggleSolution(5)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{openExerciseSolution[5] ? 'Masquer solution' : 'Solution rédigée'}</span>
                  </button>
                </div>

                {openExerciseHint[5] && (
                  <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200">
                    Écrire 25x² sous la forme (5x)² et 36 sous la forme 6².
                  </div>
                )}

                {openExerciseSolution[5] && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/40 text-xs text-slate-200 space-y-1 font-mono">
                    <div>E(x) = (5x)² - 6²</div>
                    <div className="text-emerald-400 font-bold">E(x) = (5x - 6)(5x + 6)</div>
                  </div>
                )}
              </div>
            </div>

            {/* EXERCICE 6: SYNTHESE COMPLETE TYPE DEVOIR DE 4E */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Exercice 6 : Problème Synthèse (Type Devoir / BFEM)
                  </span>
                  <span className="text-xs text-rose-400 font-semibold">Examen 4e</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-medium">
                  On donne l'expression algébrique :
                </p>
                <div className="p-2 bg-slate-950 rounded-xl my-1.5 text-center font-mono text-white text-xs sm:text-sm">
                  <MathView latex="P(x) = (2x - 3)^2 - (2x - 3)(x + 1)" display={true} />
                </div>
                <ol className="list-decimal list-inside text-xs text-slate-300 space-y-0.5 pl-1">
                  <li>Développer et réduire P(x).</li>
                  <li>Factoriser P(x).</li>
                  <li>Calculer la valeur numérique de P(x) pour x = 2.</li>
                </ol>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleHint(6)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center space-x-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>{openExerciseHint[6] ? 'Masquer indice' : 'Indice'}</span>
                  </button>
                  <button
                    onClick={() => toggleSolution(6)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{openExerciseSolution[6] ? 'Masquer solution' : 'Solution rédigée'}</span>
                  </button>
                </div>

                {openExerciseHint[6] && (
                  <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200">
                    Pour la factorisation, observez que (2x - 3)² = (2x - 3)(2x - 3). Le facteur commun est (2x - 3).
                  </div>
                )}

                {openExerciseSolution[6] && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/40 text-xs text-slate-200 space-y-1.5 font-mono">
                    <div>
                      <strong className="text-white block font-sans text-[11px]">1. Développement :</strong>
                      P(x) = (4x² - 12x + 9) - (2x² + 2x - 3x - 3)
                      <br />
                      P(x) = 4x² - 12x + 9 - 2x² + x + 3
                      <br />
                      <span className="text-emerald-400 font-bold">P(x) = 2x² - 11x + 12</span>
                    </div>

                    <div>
                      <strong className="text-white block font-sans text-[11px]">2. Factorisation :</strong>
                      P(x) = (2x - 3) [ (2x - 3) - (x + 1) ]
                      <br />
                      P(x) = (2x - 3) (2x - 3 - x - 1)
                      <br />
                      <span className="text-emerald-400 font-bold">P(x) = (2x - 3)(x - 4)</span>
                    </div>

                    <div>
                      <strong className="text-white block font-sans text-[11px]">3. Valeur pour x = 2 :</strong>
                      Dans la forme factorisée : P(2) = (2×2 - 3)(2 - 4) = (1) × (-2) ={' '}
                      <span className="text-emerald-400 font-bold">-2</span>.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Rapide d'assimilation des acquis - Calcul Algébrique */}
      <QuickQuiz
        chapter={{
          id: 'calcul-algebrique',
          title: 'Calcul algébrique & Identités remarquables - 4e',
          shortTitle: 'Calcul algébrique',
          gradeLevel: '4e',
          category: 'Activités numériques',
          icon: 'Calculator',
          description: 'Développement, factorisation et identités remarquables.',
          demos: []
        }}
      />
    </div>
  );
};
