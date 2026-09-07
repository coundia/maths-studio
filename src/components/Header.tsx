import React from 'react';
import {
  Menu,
  GraduationCap,
  BookOpen,
  Hash,
  Box,
  Tv,
  Sparkles,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react';
import { ALL_SENEGAL_COURSES } from '../coursesData';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  onToggleSidebar: () => void;
  activeTab: 'courses' | 'algebra-sandbox';
  onSelectTab: (tab: 'courses' | 'algebra-sandbox') => void;
  activeChapterId: string;
  onSelectChapter: (chapterId: string) => void;
  isClassroomMode: boolean;
  onToggleClassroomMode: () => void;
  activeMode: 'algebra' | 'geometry';
  onSelectMode: (mode: 'algebra' | 'geometry') => void;
  selectedGrade?: 'all' | '3e' | '4e';
  onSelectGrade?: (grade: 'all' | '3e' | '4e') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  activeTab,
  onSelectTab,
  activeChapterId,
  onSelectChapter,
  isClassroomMode,
  onToggleClassroomMode,
  activeMode,
  onSelectMode,
  selectedGrade = '3e',
  onSelectGrade,
}) => {
  const { theme, toggleTheme } = useTheme();
  const currentChapter = ALL_SENEGAL_COURSES.find((c) => c.id === activeChapterId);

  const visibleCourses = ALL_SENEGAL_COURSES.filter((c) => {
    const is3e = c.gradeLevel === '3e' || c.id.endsWith('-3e') || c.id.startsWith('video-');
    if (selectedGrade === '3e') return is3e;
    if (selectedGrade === '4e') return !is3e;
    return true;
  });

  return (
    <header className="w-full border-b border-neutral-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-2.5 sm:px-6 py-2 sticky top-0 z-40 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Hamburger + Brand */}
        <div className="flex items-center space-x-2">
          {/* Menu button for chapters */}
          <button
            id="toggle-sidebar-btn"
            onClick={onToggleSidebar}
            className="min-h-[38px] px-2.5 py-1.5 rounded-xl bg-white hover:bg-neutral-100 text-black hover:text-neutral-900 border border-neutral-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 dark:hover:text-white dark:border-slate-800 transition-colors flex items-center space-x-1.5 shrink-0"
            title="Ouvrir le menu des cours (Collège Sénégal)"
          >
            <Menu className="w-4 h-4 text-red-600 dark:text-emerald-400" />
            <span className="hidden sm:inline text-xs font-bold">
              Cours ({visibleCourses.length})
            </span>
            <span className="sm:hidden text-xs font-bold font-mono">
              {visibleCourses.length}
            </span>
          </button>

          {/* Logo & Title */}
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white text-black border-2 border-black dark:bg-gradient-to-tr dark:from-amber-500 dark:to-emerald-500 p-0.5 shadow-sm shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center text-black dark:text-amber-300 font-extrabold text-[11px] sm:text-xs font-mono">
                {selectedGrade === 'all' ? '3e/4e' : selectedGrade}
              </div>
            </div>
            <div className="hidden min-[380px]:block">
              <div className="flex items-center space-x-1.5">
                <h1 className="font-extrabold text-black dark:text-white text-xs sm:text-base tracking-tight leading-tight">
                  Maths <span className="text-red-600 dark:text-emerald-400">Sénégal</span>
                </h1>
                <span className="hidden md:inline-block text-[10px] font-bold px-1.5 py-0.5 bg-neutral-100 text-black border border-neutral-300 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30 rounded-full">
                  {selectedGrade === '3e' ? '3ème BFEM' : selectedGrade === '4e' ? '4ème' : '3e & 4e'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Main View Tabs */}
        <div className="flex items-center bg-neutral-100 dark:bg-slate-900/90 border border-neutral-300 dark:border-slate-800 p-0.5 sm:p-1 rounded-xl text-xs shrink-0">
          <button
            id="tab-courses-btn"
            onClick={() => onSelectTab('courses')}
            className={`flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1.5 rounded-lg transition-all font-semibold min-h-[34px] ${
              activeTab === 'courses'
                ? 'bg-white text-black border-2 border-black dark:bg-emerald-600 dark:text-white shadow-xs font-bold'
                : 'text-neutral-700 hover:text-black dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              Programme Officiel ({visibleCourses.length})
            </span>
            <span className="sm:hidden text-xs">Cours ({visibleCourses.length})</span>
          </button>

          <button
            id="tab-algebra-btn"
            onClick={() => onSelectTab('algebra-sandbox')}
            className={`flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1.5 rounded-lg transition-all font-semibold min-h-[34px] ${
              activeTab === 'algebra-sandbox'
                ? 'bg-white text-black border-2 border-red-600 dark:bg-indigo-600 dark:text-white shadow-xs font-bold'
                : 'text-neutral-700 hover:text-black dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Hash className="w-3.5 h-3.5 text-red-600 dark:text-amber-400" />
            <span className="hidden sm:inline">Calcul Algébrique Libre</span>
            <span className="sm:hidden text-xs">Calcul Libre</span>
          </button>
        </div>

        {/* Right: Quick Chapter Switcher + Classroom Mode + Theme Toggle */}
        <div className="flex items-center space-x-1.5 shrink-0">
          {/* Quick chapter dropdown */}
          {activeTab === 'courses' && (
            <div className="relative hidden md:block">
              <select
                value={activeChapterId}
                onChange={(e) => onSelectChapter(e.target.value)}
                className="bg-white border border-neutral-300 text-black text-xs py-1.5 px-2.5 rounded-xl font-medium focus:outline-none focus:border-red-600 dark:bg-slate-900 dark:border-slate-700/80 dark:text-slate-200 dark:focus:border-emerald-500 max-w-[200px] truncate"
              >
                {visibleCourses.map((ch, i) => (
                  <option key={ch.id} value={ch.id}>
                    {i + 1}. {ch.shortTitle}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* If in algebra sandbox: toggle algebra vs 3D */}
          {activeTab === 'algebra-sandbox' && (
            <div className="bg-neutral-100 border border-neutral-300 dark:bg-slate-900 dark:border-slate-800 p-0.5 rounded-xl flex text-xs">
              <button
                onClick={() => onSelectMode('algebra')}
                className={`px-2 py-1 rounded-lg transition-colors font-medium ${
                  activeMode === 'algebra'
                    ? 'bg-white text-black border-2 border-black dark:bg-indigo-600 dark:text-white font-semibold'
                    : 'text-neutral-700 hover:text-black dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Chiffres & Flèches
              </button>
              <button
                onClick={() => onSelectMode('geometry')}
                className={`px-2 py-1 rounded-lg transition-colors font-medium ${
                  activeMode === 'geometry'
                    ? 'bg-white text-black border-2 border-black dark:bg-indigo-600 dark:text-white font-semibold'
                    : 'text-neutral-700 hover:text-black dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                3D
              </button>
            </div>
          )}

          {/* Classroom Mode button */}
          <button
            onClick={onToggleClassroomMode}
            className={`min-h-[38px] px-2.5 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 border transition-all ${
              isClassroomMode
                ? 'bg-white text-red-600 font-bold border-2 border-red-600 shadow-xs dark:bg-emerald-500 dark:text-slate-950 dark:border-emerald-400'
                : 'bg-white hover:bg-neutral-100 text-black border-neutral-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 dark:border-slate-800'
            }`}
            title="Mode Démo Classe pour le professeur"
          >
            <GraduationCap className="w-4 h-4" />
            <span className="hidden xl:inline font-semibold">Démo Professeur</span>
          </button>

          {/* Theme Toggle Button (Clair / Sombre) */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="min-h-[38px] px-2 sm:px-2.5 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 border transition-all duration-200 bg-white hover:bg-neutral-100 text-black border-neutral-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 dark:hover:text-white dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/40 dark:focus:ring-emerald-500/40"
            title={theme === 'dark' ? "Passer au thème clair (Noir & Blanc + Rouge)" : "Passer au thème sombre"}
            aria-label={theme === 'dark' ? "Passer au thème clair" : "Passer au thème sombre"}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
                <span className="hidden sm:inline font-semibold">Clair</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-red-600 transition-transform hover:-rotate-12" />
                <span className="hidden sm:inline font-semibold">Sombre</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
