import React, { useState } from 'react';
import { CourseChapter } from '../coursesData';
import { MathView } from './MathView';
import { getChapterFullContent, ChapterFullContent, CourseMethod } from '../data/courseFullContent';
import {
  BookOpen,
  Sparkles,
  Award,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  FileCheck,
  Compass,
  Bookmark,
  Share2,
  Printer,
} from 'lucide-react';

interface CourseSheetViewerProps {
  chapter: CourseChapter;
  onOpenPrerequisites?: () => void;
  onOpenAlgebraSolver?: (expr: string) => void;
}

export const CourseSheetViewer: React.FC<CourseSheetViewerProps> = ({
  chapter,
  onOpenPrerequisites,
  onOpenAlgebraSolver,
}) => {
  const content: ChapterFullContent = getChapterFullContent(
    chapter.id,
    chapter.title,
    chapter.gradeLevel || (chapter.id.endsWith('-3e') ? '3e' : '4e')
  );

  const [expandedMethods, setExpandedMethods] = useState<Record<string, boolean>>({
    [content.methods[0]?.id || '']: true,
  });

  const toggleMethod = (id: string) => {
    setExpandedMethods((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div id="course-sheet-viewer" className="flex flex-col space-y-6">
      {/* Top Banner: Essential Summary */}
      <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-indigo-50/70 dark:from-indigo-950/70 via-slate-100/80 dark:via-slate-900/80 to-emerald-50/60 dark:to-emerald-950/60 border border-indigo-500/30 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-indigo-500/20">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/40 flex items-center gap-1">
                <Bookmark className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                Fiche de Cours Magistrale
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                Programme Officiel Sénégal
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
              {chapter.title}
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            {onOpenPrerequisites && (
              <button
                onClick={onOpenPrerequisites}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-amber-700 dark:text-amber-300 border border-amber-500/30 transition-all flex items-center space-x-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Rappels & Prérequis</span>
              </button>
            )}
            <button
              onClick={() => window.print()}
              title="Imprimer cette fiche de révision"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-all flex items-center space-x-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimer</span>
            </button>
          </div>
        </div>

        <p className="mt-3 text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
          {content.essentialSummary}
        </p>

        {/* Key Formulas Carousel / Grid */}
        {content.keyFormulas && content.keyFormulas.length > 0 && (
          <div className="mt-4 pt-4 border-t border-indigo-500/20">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider block mb-2">
              Formules et Propriétés Clés à mémoriser :
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {content.keyFormulas.map((f, i) => (
                <div
                  key={i}
                  className="bg-slate-100/80 dark:bg-slate-950/80 border border-indigo-500/30 rounded-xl p-2.5 flex flex-col justify-between shadow-xs"
                >
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">{f.label}</span>
                  <div className="font-mono text-xs sm:text-sm text-emerald-700 dark:text-emerald-300 overflow-x-auto py-0.5">
                    <MathView latex={f.latex} display={false} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Course Content Sections */}
      <div className="space-y-5">
        {content.sections.map((section, sIdx) => (
          <div
            key={sIdx}
            className="bg-white dark:bg-slate-900/90 border border-neutral-300 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-md"
          >
            <div className="flex items-center space-x-2 pb-3 border-b border-neutral-200 dark:border-slate-800">
              <span className="w-2 h-5 rounded-full bg-emerald-500" />
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                {section.sectionTitle}
              </h3>
            </div>

            {section.intro && (
              <p className="mt-3 text-sm text-neutral-600 dark:text-slate-300 italic">
                {section.intro}
              </p>
            )}

            {/* Definitions */}
            {section.definitions && section.definitions.length > 0 && (
              <div className="mt-4 space-y-3">
                {section.definitions.map((def, dIdx) => (
                  <div
                    key={dIdx}
                    className="p-3.5 rounded-xl bg-neutral-50 dark:bg-slate-950/60 border border-neutral-200 dark:border-slate-800"
                  >
                    <div className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide mb-1">
                      Définition : {def.term}
                    </div>
                    <p className="text-sm text-neutral-800 dark:text-slate-200">{def.definition}</p>
                    {def.latex && (
                      <div className="mt-2 py-1.5 px-3 rounded-lg bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 text-xs sm:text-sm font-mono text-emerald-700 dark:text-emerald-300 overflow-x-auto">
                        <MathView latex={def.latex} display={false} />
                      </div>
                    )}
                    {def.example && (
                      <p className="mt-1.5 text-xs text-neutral-500 dark:text-slate-400">
                        <span className="font-semibold text-neutral-700 dark:text-slate-300">Exemple : </span>
                        {def.example}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Theorems */}
            {section.theorems && section.theorems.length > 0 && (
              <div className="mt-4 space-y-3">
                {section.theorems.map((thm, tIdx) => (
                  <div
                    key={tIdx}
                    className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-500/30"
                  >
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{thm.name}</span>
                    </div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-slate-100">
                      {thm.statement}
                    </p>
                    {thm.formulaLatex && (
                      <div className="mt-2 py-1.5 px-3 rounded-lg bg-white dark:bg-slate-950 border border-emerald-200 dark:border-emerald-500/20 text-xs sm:text-sm font-mono text-emerald-700 dark:text-emerald-300 overflow-x-auto">
                        <MathView latex={thm.formulaLatex} display={true} />
                      </div>
                    )}
                    {thm.conditions && thm.conditions.length > 0 && (
                      <div className="mt-2 text-xs text-neutral-700 dark:text-slate-300 space-y-1">
                        <span className="font-bold text-neutral-900 dark:text-slate-200">Conditions requises :</span>
                        <ul className="list-disc list-inside space-y-0.5 text-neutral-600 dark:text-slate-400 pl-1">
                          {thm.conditions.map((cond, cIdx) => (
                            <li key={cIdx}>{cond}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {thm.corollary && (
                      <div className="mt-2 p-2 rounded-lg bg-emerald-100/60 dark:bg-emerald-900/30 text-xs text-emerald-900 dark:text-emerald-200">
                        <span className="font-bold">Remarque importante : </span>
                        {thm.corollary}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Practical Senegalese Context Application */}
            {section.practicalApplication && (
              <div className="mt-4 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-500/30">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider mb-1">
                  <Compass className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Situation concrète : {section.practicalApplication.context}</span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-800 dark:text-slate-200 mb-2">
                  <span className="font-semibold text-neutral-900 dark:text-white">Problème : </span>
                  {section.practicalApplication.problem}
                </p>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-500/20 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 font-medium">
                  <span className="font-bold text-neutral-900 dark:text-slate-200">Résolution : </span>
                  {section.practicalApplication.solution}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Methods & Worked BFEM Models */}
      <div className="bg-white dark:bg-slate-900/90 border border-neutral-300 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-slate-800 mb-4">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              Méthodes Types et Modèles de Rédaction BFEM
            </h3>
          </div>
          <span className="text-xs font-mono text-neutral-500 dark:text-slate-400">
            {content.methods.length} méthodes résolues
          </span>
        </div>

        <div className="space-y-4">
          {content.methods.map((method) => {
            const isExpanded = !!expandedMethods[method.id];
            return (
              <div
                key={method.id}
                className="border border-neutral-300 dark:border-slate-800 rounded-xl overflow-hidden bg-neutral-50 dark:bg-slate-950/50 shadow-xs"
              >
                {/* Method Header Toggle */}
                <button
                  onClick={() => toggleMethod(method.id)}
                  className="w-full text-left p-4 flex items-center justify-between hover:bg-neutral-100 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                      {method.badge}
                    </span>
                    <span className="text-sm font-bold text-neutral-900 dark:text-white">
                      {method.title}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-neutral-500 dark:text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-500 dark:text-slate-400" />
                  )}
                </button>

                {/* Method Content */}
                {isExpanded && (
                  <div className="p-4 pt-2 border-t border-neutral-200 dark:border-slate-800/80 space-y-3 bg-white dark:bg-slate-900/40">
                    {/* Statement */}
                    <div className="p-3 rounded-lg bg-neutral-100 dark:bg-slate-800/70 border border-neutral-200 dark:border-slate-700 text-xs sm:text-sm">
                      <span className="font-bold text-neutral-900 dark:text-slate-200 block mb-1">
                        Énoncé de l'exercice type :
                      </span>
                      <p className="text-neutral-800 dark:text-slate-300">{method.statement}</p>
                      {method.statementLatex && (
                        <div className="mt-2 py-1 px-2 rounded bg-white dark:bg-slate-950 font-mono text-emerald-700 dark:text-emerald-300 overflow-x-auto">
                          <MathView latex={method.statementLatex} display={true} />
                        </div>
                      )}
                    </div>

                    {/* Strategy */}
                    <div className="flex items-start space-x-2 text-xs text-indigo-900 dark:text-indigo-200 bg-indigo-50 dark:bg-indigo-950/40 p-2.5 rounded-lg border border-indigo-200 dark:border-indigo-500/30">
                      <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Démarche stratégique : </span>
                        {method.strategy}
                      </div>
                    </div>

                    {/* Step-by-step Solution */}
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-bold text-neutral-800 dark:text-slate-300 uppercase tracking-wider block">
                        Rédaction modèle étape par étape :
                      </span>
                      {method.solutionSteps.map((step, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg border border-neutral-200 dark:border-slate-800 bg-neutral-50/70 dark:bg-slate-950/60"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
                              {step.title}
                            </span>
                            <span className="text-[10px] font-mono text-neutral-600 dark:text-neutral-400">Étape {idx + 1}</span>
                          </div>
                          <p className="text-xs text-neutral-700 dark:text-slate-300">{step.explanation}</p>
                          {step.latex && (
                            <div className="mt-1.5 py-1 px-2 rounded bg-white dark:bg-slate-900 font-mono text-xs text-emerald-700 dark:text-emerald-300 overflow-x-auto">
                              <MathView latex={step.latex} display={false} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Conclusion */}
                    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div>
                        <span className="font-bold text-emerald-900 dark:text-emerald-200">
                          {method.conclusion}
                        </span>
                      </div>
                      {method.conclusionLatex && (
                        <div className="font-mono text-emerald-700 dark:text-emerald-300 font-bold">
                          <MathView latex={method.conclusionLatex} display={false} />
                        </div>
                      )}
                    </div>

                    {/* Teacher note */}
                    {method.teacherNote && (
                      <div className="text-[11px] text-amber-800 dark:text-amber-300/90 italic bg-amber-50 dark:bg-amber-950/20 p-2 rounded-lg border border-amber-200 dark:border-amber-500/20 flex items-start space-x-1.5">
                        <HelpCircle className="w-3.5 h-3.5 shrink-0 text-amber-500 dark:text-amber-400 mt-0.5" />
                        <span>{method.teacherNote}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pitfalls and Common Traps */}
      <div className="bg-white dark:bg-slate-900/90 border border-neutral-300 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-md">
        <div className="flex items-center space-x-2 pb-3 border-b border-neutral-200 dark:border-slate-800 mb-4">
          <AlertTriangle className="w-5 h-5 text-rose-500 dark:text-rose-400" />
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
            Pièges Fréquents et Erreurs à Éviter au BFEM
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.pitfalls.map((p, pIdx) => (
            <div
              key={pIdx}
              className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-bold text-rose-800 dark:text-rose-400 mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>{p.trap}</span>
                </div>

                {p.badPracticeLatex && (
                  <div className="my-2 p-2 rounded bg-rose-100/70 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 font-mono text-xs text-rose-900 dark:text-rose-200">
                    <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 block mb-0.5">
                      Ce qu'il ne faut JAMAIS écrire :
                    </span>
                    <MathView latex={p.badPracticeLatex} display={false} />
                  </div>
                )}

                <div className="my-2 p-2 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 font-mono text-xs text-emerald-900 dark:text-emerald-200">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">
                    Règle exacte :
                  </span>
                  {p.correctLatex ? (
                    <MathView latex={p.correctLatex} display={false} />
                  ) : (
                    <span>{p.correctRule}</span>
                  )}
                </div>

                <p className="text-xs text-neutral-600 dark:text-slate-300 mt-1">{p.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BFEM Gold Tips */}
      {content.bfemTips && content.bfemTips.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-indigo-500/10 border border-amber-500/30 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
              Conseils d'Or des Examinateurs du BFEM
            </h4>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-neutral-800 dark:text-slate-200">
            {content.bfemTips.map((tip, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
