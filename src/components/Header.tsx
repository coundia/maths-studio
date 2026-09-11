import React, { useState, useRef, useEffect } from 'react';
import {
  PanelLeft,
  GraduationCap,
  BookOpen,
  Calculator,
  ChevronDown,
  Sun,
  Moon,
  Edit3,
  Check,
} from 'lucide-react';
import { ALL_SENEGAL_COURSES } from '../coursesData';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  onToggleSidebar: () => void;
  activeTab: 'courses' | 'algebra-sandbox';
  onSelectTab: (tab: 'courses' | 'algebra-sandbox') => void;
  activeChapterId?: string;
  onSelectChapter?: (chapterId: string) => void;
  isClassroomMode: boolean;
  onToggleClassroomMode: () => void;
  activeMode: 'algebra' | 'geometry';
  onSelectMode: (mode: 'algebra' | 'geometry') => void;
  selectedGrade?: 'all' | '6e' | '5e' | '4e' | '3e';
  onSelectGrade?: (grade: 'all' | '6e' | '5e' | '4e' | '3e') => void;
  onOpenBlackboard?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  activeTab,
  onSelectTab,
  isClassroomMode,
  onToggleClassroomMode,
  activeMode,
  onSelectMode,
  selectedGrade = '3e',
  onSelectGrade,
  onOpenBlackboard,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [isGradeDropdownOpen, setIsGradeDropdownOpen] = useState(false);
  const gradeDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (gradeDropdownRef.current && !gradeDropdownRef.current.contains(e.target as Node)) {
        setIsGradeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const gradeLabel =
    selectedGrade === '6e'
      ? '6ème'
      : selectedGrade === '5e'
      ? '5ème'
      : selectedGrade === '4e'
      ? '4ème'
      : selectedGrade === '3e'
      ? '3ème BFEM'
      : 'Collège (Tout)';

  const gradeOptions: Array<{ id: 'all' | '6e' | '5e' | '4e' | '3e'; label: string; desc: string }> = [
    { id: '6e', label: '6ème', desc: '13 chapitres' },
    { id: '5e', label: '5ème', desc: '13 chapitres' },
    { id: '4e', label: '4ème', desc: '14 chapitres' },
    { id: '3e', label: '3ème BFEM', desc: '20 chapitres' },
    { id: 'all', label: 'Tout le Collège', desc: '60 chapitres (6e, 5e, 4e, 3e)' },
  ];

  return (
    <header className="w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-surface/80 dark:bg-canvas/80 backdrop-blur-xl px-3 sm:px-5 py-2.5 sticky top-0 z-40 transition-colors duration-200 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2 gap-x-2 sm:gap-x-4">
        {/* Left: Sidebar Toggle + Clean Brand + Level Selector */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          {/* Sidebar Toggle */}
          <button
            id="toggle-sidebar-btn"
            onClick={onToggleSidebar}
            className="h-9 w-9 rounded-xl flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800/80 dark:hover:bg-slate-700 dark:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            title="Ouvrir / Fermer le sommaire des cours"
            aria-label="Sommaire des cours"
          >
            <PanelLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </button>

          {/* Logo & Title */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 p-[2px] shadow-sm shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center text-slate-900 dark:text-emerald-400 font-extrabold text-xs font-mono">
                π
              </div>
            </div>

            <div className="hidden lg:block">
              <h1 className="font-extrabold text-slate-900 dark:text-white text-sm tracking-tight leading-tight">
                Maths <span className="text-emerald-600 dark:text-emerald-400">Sénégal</span>
              </h1>
            </div>
          </div>

          {/* Compact Interactive Grade Pill */}
          {onSelectGrade && (
            <div className="relative" ref={gradeDropdownRef}>
              <button
                id="header-grade-selector-btn"
                onClick={() => setIsGradeDropdownOpen(!isGradeDropdownOpen)}
                className="h-8 px-2.5 rounded-lg text-xs font-semibold flex items-center space-x-1 bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800/90 dark:hover:bg-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 transition-colors"
                title="Changer de niveau (5e, 4e, 3e)"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="truncate max-w-[90px] sm:max-w-none">{gradeLabel}</span>
                <ChevronDown className={`w-3 h-3 text-slate-600 dark:text-slate-400 transition-transform ${isGradeDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isGradeDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50 text-xs animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    Sélectionner la classe
                  </div>
                  {gradeOptions.map((opt) => {
                    const isSelected = selectedGrade === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => {
                          onSelectGrade(opt.id);
                          setIsGradeDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-800 font-bold dark:bg-emerald-950/50 dark:text-emerald-300'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                        }`}
                      >
                        <div>
                          <div className="font-semibold">{opt.label}</div>
                          <div className="text-[10px] text-slate-600 dark:text-slate-400 font-normal">{opt.desc}</div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center: Main View Segmented Control */}
        <div className="order-last w-full justify-center sm:order-none sm:w-auto flex items-center bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-0.5 sm:p-1 rounded-xl text-xs shrink-0 shadow-inner">
          <button
            id="tab-courses-btn"
            onClick={() => onSelectTab('courses')}
            className={`flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg transition-all font-semibold h-7 sm:h-8 ${
              activeTab === 'courses'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60 dark:bg-emerald-600 dark:border-emerald-500 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Cours</span>
          </button>

          <button
            id="tab-algebra-btn"
            onClick={() => onSelectTab('algebra-sandbox')}
            className={`flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg transition-all font-semibold h-7 sm:h-8 ${
              activeTab === 'algebra-sandbox'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60 dark:bg-indigo-600 dark:border-indigo-500 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Calcul Libre</span>
          </button>
        </div>

        {/* Right: Essential Tools (Tableau + Prof + Thème) */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0 ml-auto sm:ml-0">
          {/* If in Algebra tab: mini 2D / 3D toggle */}
          {activeTab === 'algebra-sandbox' && (
            <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800/90 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700/80 text-xs">
              <button
                onClick={() => onSelectMode('algebra')}
                className={`px-2 py-1 rounded-md text-xs font-semibold transition-all ${
                  activeMode === 'algebra'
                    ? 'bg-white text-indigo-700 shadow-xs dark:bg-indigo-600 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Mode 2D Décomposition"
              >
                2D
              </button>
              <button
                onClick={() => onSelectMode('geometry')}
                className={`px-2 py-1 rounded-md text-xs font-semibold transition-all ${
                  activeMode === 'geometry'
                    ? 'bg-white text-indigo-700 shadow-xs dark:bg-indigo-600 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Mode 3D Géométrie"
              >
                3D
              </button>
            </div>
          )}

          {/* Blackboard / Tableau Interactif */}
          {onOpenBlackboard && (
            <button
              id="open-blackboard-btn"
              onClick={onOpenBlackboard}
              className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl text-xs flex items-center space-x-1.5 font-medium transition-all bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 dark:text-indigo-300 dark:border-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              title="Ouvrir le Tableau interactif (brouillon & calculs)"
            >
              <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden md:inline font-semibold">Tableau</span>
            </button>
          )}

          {/* Classroom Mode Toggle */}
          <button
            id="toggle-classroom-mode-btn"
            onClick={onToggleClassroomMode}
            className={`h-8 sm:h-9 px-2 sm:px-2.5 rounded-xl text-xs flex items-center space-x-1.5 border transition-all ${
              isClassroomMode
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700 font-semibold'
                : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-400 dark:border-slate-800'
            }`}
            title={isClassroomMode ? "Mode Démo Classe actif (cliquer pour masquer)" : "Activer le Mode Démo Classe"}
          >
            <GraduationCap className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isClassroomMode ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
            <span className="hidden lg:inline font-medium">Prof</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl flex items-center justify-center border transition-all bg-white hover:bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400/20 dark:focus:ring-slate-700/20"
            title={theme === 'dark' ? "Passer au thème clair" : "Passer au thème sombre"}
            aria-label="Basculer le thème"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-600 dark:text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 dark:text-slate-300 transition-transform hover:-rotate-12" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
