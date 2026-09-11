import React, { useState } from 'react';
import { CourseVideoInfo, CourseStep, CourseExercise } from '../coursesData';
import { MathView } from './MathView';
import { StudentExercisesSection } from './StudentExercisesSection';
import {
  Play,
  CheckCircle,
  HelpCircle,
  Clock,
  Sparkles,
  ExternalLink,
  BookOpen,
  ListOrdered,
} from 'lucide-react';

interface VideoLessonPlayerProps {
  videoInfo?: CourseVideoInfo;
  title: string;
  steps: CourseStep[];
  ruleSummary: string;
  exercises?: CourseExercise[];
  chapterId?: string;
}

export const VideoLessonPlayer: React.FC<VideoLessonPlayerProps> = ({
  videoInfo,
  title,
  steps,
  ruleSummary,
  exercises,
  chapterId = 'video-lesson',
}) => {
  const [activeTab, setActiveTab] = useState<'video' | 'summary' | 'exercises'>('video');
  const [revealedExercises, setRevealedExercises] = useState<Record<number, boolean>>({});

  const toggleExercise = (idx: number) => {
    setRevealedExercises((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Sub-tabs inside the video viewer */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'video'
                ? 'bg-black text-white dark:bg-red-600 shadow-xs'
                : 'bg-white text-black border border-neutral-300 dark:border-neutral-700 dark:bg-slate-800 dark:text-slate-300 dark:border-transparent hover:bg-neutral-100 dark:hover:bg-slate-700'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current text-red-600 dark:text-white" />
            <span>Vidéo de cours</span>
          </button>

          <button
            onClick={() => setActiveTab('summary')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'summary'
                ? 'bg-black text-white dark:bg-emerald-600 dark:text-slate-950 font-bold shadow-xs'
                : 'bg-white text-black border border-neutral-300 dark:border-neutral-700 dark:bg-slate-800 dark:text-slate-300 dark:border-transparent hover:bg-neutral-100 dark:hover:bg-slate-700'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Fiche synthèse & Démarche</span>
          </button>

          <button
            onClick={() => setActiveTab('exercises')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'exercises'
                ? 'bg-black text-white dark:bg-indigo-600 dark:text-white shadow-xs'
                : 'bg-white text-black border border-neutral-300 dark:border-neutral-700 dark:bg-slate-800 dark:text-slate-300 dark:border-transparent hover:bg-neutral-100 dark:hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Exercices BFEM résolus</span>
          </button>
        </div>

        {videoInfo?.duration && (
          <div className="hidden sm:flex items-center space-x-1 text-xs text-slate-600 dark:text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            <span>Durée : {videoInfo.duration}</span>
          </div>
        )}
      </div>

      {/* 1. VIDEO PLAYER TAB */}
      {activeTab === 'video' && (
        <div className="flex flex-col space-y-4">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl">
            {videoInfo?.embedUrl ? (
              <iframe
                src={`${videoInfo.embedUrl}?rel=0&modestbranding=1`}
                title={videoInfo.title || title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-600 dark:text-slate-400">
                <Play className="w-12 h-12 text-red-500 dark:text-red-400 mb-2" />
                <p className="font-semibold text-slate-900 dark:text-white">Module Vidéo Pédagogique 3e</p>
                <p className="text-xs mt-1 text-slate-600 dark:text-slate-400">
                  Consultez la fiche de synthèse pas-à-pas ci-dessous.
                </p>
              </div>
            )}
          </div>

          {/* Key points box below video */}
          {videoInfo?.keyPoints && (
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Points clés retenus dans cette vidéo :</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                {videoInfo.keyPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 2. SUMMARY TAB */}
      {activeTab === 'summary' && (
        <div className="flex flex-col space-y-3">
          <div className="p-3.5 rounded-xl bg-emerald-50/30 dark:bg-emerald-950/30 border border-emerald-500/30 text-xs sm:text-sm text-emerald-800 dark:text-emerald-200">
            <span className="font-bold text-slate-900 dark:text-white">Règle essentielle : </span>
            {ruleSummary}
          </div>

          <div className="space-y-3">
            {steps.map((st) => (
              <div
                key={st.stepNumber}
                className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{st.title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Étape {st.stepNumber}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 font-mono text-xs overflow-x-auto">
                  <MathView latex={st.latex} display={true} />
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300">{st.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. EXERCISES TAB */}
      {activeTab === 'exercises' && (
        <div className="flex flex-col space-y-3">
          {exercises && exercises.length > 0 ? (
            <StudentExercisesSection
              chapterId={chapterId}
              chapterTitle={title}
              exercises={exercises}
            />
          ) : (
            <p className="text-xs text-slate-600 dark:text-slate-400 text-center py-4">
              Aucun exercice supplémentaire pour ce cours vidéo.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
