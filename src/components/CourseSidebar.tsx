import React, { useState } from 'react';
import { CourseChapter, ALL_SENEGAL_COURSES } from '../coursesData';
import {
  BookOpen,
  Search,
  CheckCircle,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Filter,
  Layers,
  Shapes,
  Hash,
  Video,
} from 'lucide-react';

interface CourseSidebarProps {
  activeChapterId: string;
  onSelectChapter: (chapterId: string) => void;
  isOpen: boolean;
  onCloseMobile?: () => void;
  selectedGrade?: 'all' | '3e' | '4e';
  onSelectGrade?: (grade: 'all' | '3e' | '4e') => void;
}

export const CourseSidebar: React.FC<CourseSidebarProps> = ({
  activeChapterId,
  onSelectChapter,
  isOpen,
  onCloseMobile,
  selectedGrade = '3e',
  onSelectGrade,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredChapters = ALL_SENEGAL_COURSES.filter((chapter) => {
    // Filter by grade level (3e / 4e / all)
    const is3e = chapter.gradeLevel === '3e' || chapter.id.endsWith('-3e') || chapter.id.startsWith('video-');
    const matchesGrade =
      selectedGrade === 'all' ||
      (selectedGrade === '3e' && is3e) ||
      (selectedGrade === '4e' && !is3e);

    const matchesSearch =
      chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chapter.shortTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chapter.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || chapter.category === selectedCategory;

    return matchesGrade && matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: 'Tout', icon: Layers },
    { id: 'Activités numériques', label: 'Numérique', icon: Hash },
    { id: 'Activités géométriques', label: 'Géométrie', icon: Shapes },
    { id: 'Cours Vidéos BFEM', label: 'Vidéos 3e', icon: Video },
    { id: 'Synthèse & Révision', label: 'Révision', icon: GraduationCap },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="senegal-courses-sidebar"
        className={`fixed md:static top-0 bottom-0 left-0 z-50 w-80 sm:w-88 md:w-76 lg:w-84 shrink-0 bg-white dark:bg-slate-900 border-r border-neutral-200 dark:border-slate-800 flex flex-col transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:hidden'
        }`}
      >
        {/* Header Branding */}
        <div className="p-3.5 sm:p-4 border-b border-neutral-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-neutral-100 border border-neutral-300 dark:bg-gradient-to-tr dark:from-amber-500/30 dark:to-emerald-500/30 dark:border-amber-500/40 flex items-center justify-center text-xs">
                🇸🇳
              </div>
              <div>
                <h2 className="text-sm font-bold text-black dark:text-slate-100 flex items-center gap-1.5">
                  Programme Collège Sénégal
                </h2>
                <p className="text-[11px] text-red-600 dark:text-emerald-400 font-medium">
                  {selectedGrade === '3e' ? 'Classe de 3ème (BFEM) • 20 cours' : selectedGrade === '4e' ? 'Classe de 4ème • 14 cours' : 'Classes de 3e & 4e • 34 cours'}
                </p>
              </div>
            </div>
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="md:hidden text-black hover:text-neutral-700 dark:text-slate-400 dark:hover:text-white text-xs px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-slate-800 border border-neutral-300 dark:border-slate-700"
              >
                Fermer
              </button>
            )}
          </div>

          {/* Grade Level Selector Tabs (3e / 4e / Tous) */}
          {onSelectGrade && (
            <div className="grid grid-cols-3 gap-1 bg-neutral-100 dark:bg-slate-950 p-1 rounded-xl border border-neutral-300 dark:border-slate-800 my-2">
              <button
                onClick={() => onSelectGrade('3e')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center space-x-1 ${
                  selectedGrade === '3e'
                    ? 'bg-white text-black border-2 border-black font-extrabold dark:bg-amber-500 dark:text-slate-950 shadow-xs'
                    : 'text-neutral-700 dark:text-slate-400 hover:text-black dark:hover:text-white'
                }`}
              >
                <span>3ème (BFEM)</span>
              </button>
              <button
                onClick={() => onSelectGrade('4e')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center space-x-1 ${
                  selectedGrade === '4e'
                    ? 'bg-white text-black border-2 border-black font-extrabold dark:bg-emerald-600 dark:text-white shadow-xs'
                    : 'text-neutral-700 dark:text-slate-400 hover:text-black dark:hover:text-white'
                }`}
              >
                <span>4ème</span>
              </button>
              <button
                onClick={() => onSelectGrade('all')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center space-x-1 ${
                  selectedGrade === 'all'
                    ? 'bg-white text-black border-2 border-black font-extrabold dark:bg-indigo-600 dark:text-white shadow-xs'
                    : 'text-neutral-700 dark:text-slate-400 hover:text-black dark:hover:text-white'
                }`}
              >
                <span>Tous (34)</span>
              </button>
            </div>
          )}

          {/* Search Bar */}
          <div className="relative mt-2">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher (Thalès, Racine carrée, Vidéo...)"
              className="w-full pl-8.5 pr-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs text-black placeholder-neutral-400 focus:outline-none focus:border-red-600 dark:bg-slate-950/90 dark:border-slate-700/80 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex space-x-1 mt-2.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-md text-[10px] font-semibold whitespace-nowrap transition-colors ${
                    active
                      ? 'bg-white text-black border-2 border-black font-bold dark:bg-emerald-600 dark:text-white shadow-xs'
                      : 'text-neutral-700 dark:text-slate-400 hover:text-black dark:hover:text-slate-200 hover:bg-neutral-200/70 bg-neutral-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Course Chapter List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-slate-700">
          <div className="px-2 py-1 text-[10px] font-semibold text-neutral-500 dark:text-slate-400 uppercase tracking-wider flex justify-between items-center">
            <span>Cours disponibles ({filteredChapters.length})</span>
            <span className="text-red-600 dark:text-emerald-400 text-[10px] font-mono font-bold">Démos interactives</span>
          </div>

          {filteredChapters.map((chapter, idx) => {
            const isActive = activeChapterId === chapter.id;
            const is3e = chapter.gradeLevel === '3e' || chapter.id.endsWith('-3e') || chapter.id.startsWith('video-');
            const isVideo = chapter.category === 'Cours Vidéos BFEM';

            return (
              <button
                key={chapter.id}
                id={`chapter-item-${chapter.id}`}
                onClick={() => {
                  onSelectChapter(chapter.id);
                  if (onCloseMobile && typeof window !== 'undefined' && window.innerWidth < 768) {
                    onCloseMobile();
                  }
                }}
                className={`w-full text-left p-2.5 rounded-xl transition-all border group flex items-start space-x-2.5 ${
                  isActive
                    ? 'bg-white border-2 border-black border-l-4 border-l-red-600 text-black shadow-md dark:bg-emerald-950 dark:border-emerald-500 dark:border-l-emerald-400 dark:text-white'
                    : 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-800 dark:bg-slate-950/30 dark:hover:bg-slate-800/60 dark:border-slate-800/80 dark:text-slate-300'
                }`}
              >
                {/* Index badge */}
                <div
                  className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center text-[11px] font-mono font-bold mt-0.5 transition-colors ${
                    isActive
                      ? 'bg-white text-red-600 font-extrabold border-2 border-red-600 dark:bg-emerald-500 dark:text-slate-950'
                      : isVideo
                      ? 'bg-white text-black border border-neutral-300 dark:bg-red-950 dark:text-red-400 dark:border-red-800/40'
                      : is3e
                      ? 'bg-neutral-100 text-neutral-900 border border-neutral-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800/40'
                      : 'bg-neutral-100 text-neutral-900 border border-neutral-200 dark:bg-slate-800 dark:text-slate-400 group-hover:text-black dark:group-hover:text-slate-200'
                  }`}
                >
                  {isVideo ? <Video className={`w-3 h-3 ${isActive ? 'text-red-600' : 'text-red-600 dark:text-red-400'}`} /> : idx + 1}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-xs font-semibold truncate ${
                        isActive ? 'text-black font-bold dark:text-white' : 'text-neutral-900 group-hover:text-black dark:text-slate-200 dark:group-hover:text-white'
                      }`}
                    >
                      {chapter.shortTitle}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded shrink-0 font-bold ${
                        isActive
                          ? 'bg-white text-black border border-black dark:bg-neutral-800 dark:text-white'
                          : isVideo
                          ? 'bg-white text-black border border-neutral-300 dark:bg-red-950 dark:text-red-300 dark:border-red-800/50'
                          : is3e
                          ? 'bg-neutral-100 text-neutral-900 border border-neutral-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800/50'
                          : 'bg-neutral-100 text-neutral-900 border border-neutral-300 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800/50'
                      }`}
                    >
                      {isVideo ? 'Vidéo' : is3e ? '3e' : '4e'}
                    </span>
                  </div>
                  <p className={`text-[11px] line-clamp-1 mt-0.5 leading-tight ${
                    isActive ? 'text-neutral-700 dark:text-neutral-300' : 'text-neutral-600 dark:text-slate-400'
                  }`}>
                    {chapter.title}
                  </p>
                </div>

                <ChevronRight
                  className={`w-4 h-4 shrink-0 transition-transform mt-1 ${
                    isActive
                      ? 'text-red-500 dark:text-emerald-400 translate-x-0.5 font-bold'
                      : 'text-neutral-400 dark:text-slate-600 group-hover:text-black dark:group-hover:text-slate-400'
                  }`}
                />
              </button>
            );
          })}

          {filteredChapters.length === 0 && (
            <div className="text-center py-8 text-xs text-neutral-500">
              Aucun cours ne correspond à votre recherche.
            </div>
          )}
        </div>

        {/* Footer info for Teacher */}
        <div className="p-3 border-t border-neutral-200 dark:border-slate-800/80 bg-neutral-50 dark:bg-slate-950/70 text-neutral-600 dark:text-slate-400 text-[11px] flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600 dark:bg-emerald-400 animate-pulse" />
            <span className="text-black dark:text-slate-300 font-medium">Programme Officiel Sénégal</span>
          </div>
          <span className="text-[10px] text-red-600 dark:text-emerald-400 font-mono font-bold">BFEM & Collège</span>
        </div>
      </aside>
    </>
  );
};
