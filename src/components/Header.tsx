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
} from 'lucide-react';
import { SENEGAL_COURSES_4E } from '../coursesData';

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
}) => {
  const currentChapter = SENEGAL_COURSES_4E.find((c) => c.id === activeChapterId);

  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl px-2.5 sm:px-6 py-2 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Hamburger + Brand */}
        <div className="flex items-center space-x-2">
          {/* Menu button for chapters */}
          <button
            id="toggle-sidebar-btn"
            onClick={onToggleSidebar}
            className="min-h-[38px] px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors flex items-center space-x-1.5 shrink-0"
            title="Ouvrir le menu des cours (4e Sénégal)"
          >
            <Menu className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline text-xs font-semibold">Chapitres (14)</span>
            <span className="sm:hidden text-xs font-bold font-mono">14</span>
          </button>

          {/* Logo & Title */}
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-md shadow-emerald-600/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-emerald-400 font-extrabold text-[11px] sm:text-xs font-mono">
                4e
              </div>
            </div>
            <div className="hidden min-[380px]:block">
              <div className="flex items-center space-x-1.5">
                <h1 className="font-extrabold text-white text-xs sm:text-base tracking-tight leading-tight">
                  Maths <span className="text-emerald-400">Sénégal</span>
                </h1>
                <span className="hidden md:inline-block text-[10px] font-bold px-1.5 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-full">
                  4ème
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Main View Tabs */}
        <div className="flex items-center bg-slate-900/90 border border-slate-800 p-0.5 sm:p-1 rounded-xl text-xs shrink-0">
          <button
            id="tab-courses-btn"
            onClick={() => onSelectTab('courses')}
            className={`flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1.5 rounded-lg transition-all font-semibold min-h-[34px] ${
              activeTab === 'courses'
                ? 'bg-emerald-600 text-slate-950 shadow-md shadow-emerald-600/30 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cours par classe (14)</span>
            <span className="sm:hidden text-xs">Cours (14)</span>
          </button>

          <button
            id="tab-algebra-btn"
            onClick={() => onSelectTab('algebra-sandbox')}
            className={`flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1.5 rounded-lg transition-all font-semibold min-h-[34px] ${
              activeTab === 'algebra-sandbox'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Hash className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Calcul Algébrique Libre</span>
            <span className="sm:hidden text-xs">Calcul Libre</span>
          </button>
        </div>

        {/* Right: Quick Chapter Switcher + Classroom Mode */}
        <div className="flex items-center space-x-1.5 shrink-0">
          {/* Quick chapter dropdown */}
          {activeTab === 'courses' && (
            <div className="relative hidden md:block">
              <select
                value={activeChapterId}
                onChange={(e) => onSelectChapter(e.target.value)}
                className="bg-slate-900 border border-slate-700/80 text-slate-200 text-xs py-1.5 px-2.5 rounded-xl font-medium focus:outline-none focus:border-emerald-500 max-w-[200px] truncate"
              >
                {SENEGAL_COURSES_4E.map((ch, i) => (
                  <option key={ch.id} value={ch.id}>
                    {i + 1}. {ch.shortTitle}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* If in algebra sandbox: toggle algebra vs 3D */}
          {activeTab === 'algebra-sandbox' && (
            <div className="bg-slate-900 border border-slate-800 p-0.5 rounded-xl flex text-xs">
              <button
                onClick={() => onSelectMode('algebra')}
                className={`px-2 py-1 rounded-lg ${
                  activeMode === 'algebra' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                }`}
              >
                Chiffres & Flèches
              </button>
              <button
                onClick={() => onSelectMode('geometry')}
                className={`px-2 py-1 rounded-lg ${
                  activeMode === 'geometry' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                }`}
              >
                3D
              </button>
            </div>
          )}

          {/* Classroom Mode button */}
          <button
            onClick={onToggleClassroomMode}
            className={`p-2 rounded-xl text-xs flex items-center space-x-1.5 border transition-all ${
              isClassroomMode
                ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
            title="Mode Démo Classe pour le professeur"
          >
            <GraduationCap className="w-4 h-4" />
            <span className="hidden xl:inline">Démo Professeur</span>
          </button>
        </div>
      </div>
    </header>
  );
};
