import React, { useEffect } from 'react';
import { MathStep, ExpressionSolution } from '../types';
import { MathView } from './MathView';
import { ChevronLeft, ChevronRight, CheckCircle2, BookOpen, Sparkles, Award, Blocks } from 'lucide-react';

interface StepPlayerProps {
  solution: ExpressionSolution;
  currentStepIndex: number;
  onStepChange: (index: number) => void;
  isCompleted: boolean;
  onComplete: () => void;
  isClassroomMode?: boolean;
}

// Generate intuitive "terre-à-terre" practical explanation based on expression & step
function getTerreATerreNote(rawExpr: string, stepIndex: number): { title: string; text: string } {
  // Check if difference of squares x^2 - a^2
  const diffMatch = rawExpr.replace(/\s+/g, '').match(/^x\^2-([0-9]+)$/);
  if (diffMatch) {
    const n = parseInt(diffMatch[1], 10);
    const a = Math.round(Math.sqrt(n));
    const xEx = a + 2; // e.g. for a=3, x=5
    const totalCubes = xEx * xEx;
    const removedCubes = a * a;
    const remainingCubes = totalCubes - removedCubes;
    const width = xEx - a;
    const length = xEx + a;

    if (stepIndex === 0) {
      return {
        title: ` Exemple très concret avec x = ${xEx} :`,
        text: `Imaginez un plateau de jeu de ${xEx} par ${xEx} briques de Lego, soit ${totalCubes} briques au total (c'est x²).`,
      };
    } else if (stepIndex === 1) {
      return {
        title: ` Retrait physique du coin :`,
        text: `On retire un carré de ${a}×${a} = ${removedCubes} briques. Il reste exactement ${totalCubes} - ${removedCubes} = ${remainingCubes} briques en forme de « L ».`,
      };
    } else if (stepIndex === 2) {
      return {
        title: ` Coup de scie dans le « L » :`,
        text: `Pour réorganiser ces ${remainingCubes} briques, on coupe le « L » en deux rectangles : un bleu de ${width}×${xEx} (${width * xEx} briques) et un violet de ${width}×${a} (${width * a} briques). Total : ${width * xEx + width * a} briques.`,
      };
    } else if (stepIndex === 3) {
      return {
        title: ` La pièce violette tourne et voyage en 3D :`,
        text: `La pièce violette pivote de 90° dans l'espace. Comme elle a la même épaisseur (${width} briques), elle s'emboîte au bout de la pièce bleue sans dépasser.`,
      };
    } else {
      return {
        title: ` Résultat magique : un rectangle parfait !`,
        text: `On a formé un rectangle de largeur (${xEx} - ${a}) = ${width} et de longueur (${xEx} + ${a}) = ${length}. Son aire est ${width} × ${length} = ${remainingCubes} briques ! La preuve est faite.`,
      };
    }
  }

  // Check if common factor (e.g. 3x + 6)
  const factorMatch = rawExpr.replace(/\s+/g, '').match(/^([0-9]+)x\+([0-9]+)$/);
  if (factorMatch) {
    const k = parseInt(factorMatch[1], 10);
    const b = parseInt(factorMatch[2], 10);
    const perGroup = b / k;
    if (stepIndex === 0) {
      return {
        title: ` Paquets de bonbons concrets :`,
        text: `Vous avez ${k} sachets de bonbons (chacun contient x bonbons) et ${b} bonbons en vrac sur la table.`,
      };
    } else {
      return {
        title: ` Répartition équitable :`,
        text: `Vous distribuez les ${b} bonbons en vrac : chacun des ${k} sachets reçoit ${perGroup} bonbons. Résultat : ${k} groupes identiques de (x + ${perGroup}) bonbons !`,
      };
    }
  }

  return {
    title: ` Démarche concrète pas-à-pas :`,
    text: `Chaque bloc 3D ci-contre correspond à une quantité réelle. En observant les déplacements et les découpes, vous visualisez pourquoi la formule mathématique fonctionne toujours.`,
  };
}

export const StepPlayer: React.FC<StepPlayerProps> = ({
  solution,
  currentStepIndex,
  onStepChange,
  isCompleted,
  onComplete,
  isClassroomMode = false,
}) => {
  const steps = solution.steps || [];
  const currentStep: MathStep | undefined = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  useEffect(() => {
    if (isLastStep && !isCompleted) {
      onComplete();
    }
  }, [isLastStep, isCompleted, onComplete]);

  if (!currentStep) return null;

  const concreteNote = getTerreATerreNote(solution.rawExpression, currentStepIndex);

  return (
    <div className="flex flex-col h-full bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-xl justify-between">
      {/* Header with step number & rule badge */}
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80 mb-4">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-xs font-semibold uppercase tracking-wider border border-indigo-500/30">
              Étape {currentStepIndex + 1} sur {steps.length}
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-slate-300 text-xs font-mono font-medium">
              {solution.rawExpression}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-800/80 text-emerald-400 px-2.5 py-1 rounded-md text-xs font-medium border border-emerald-500/20">
            <BookOpen className="w-3.5 h-3.5 mr-1" />
            <span className="truncate max-w-[150px]">{currentStep.appliedRule}</span>
          </div>
        </div>

        {/* Step Title */}
        <h3 className={`font-bold text-white tracking-tight ${isClassroomMode ? 'text-2xl' : 'text-lg lg:text-xl'} mb-2`}>
          {currentStep.title}
        </h3>

        {/* Active KaTeX Formula Box */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 my-3 shadow-inner overflow-x-auto text-center flex flex-col items-center justify-center">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-mono mb-1">
            Formule mathématique à cette étape
          </div>
          <div className={`${isClassroomMode ? 'text-2xl py-2' : 'text-xl py-1'} text-slate-100`}>
            <MathView latex={currentStep.latex} display={true} />
          </div>
        </div>

        {/* Concrete "Terre-à-terre" Explanation Card */}
        <div className="mt-3.5 p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/50 to-slate-950/60 border border-indigo-500/25">
          <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1 flex items-center">
            <Blocks className="w-4 h-4 mr-1.5 text-amber-400" />
            {concreteNote.title}
          </div>
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
            {concreteNote.text}
          </p>
        </div>

        {/* Secondary Pedagogical Detail */}
        <div className="mt-3 text-xs text-slate-400 leading-relaxed">
          <span className="text-slate-300 font-medium">Règle géométrique : </span>
          {currentStep.explanation}
        </div>
      </div>

      {/* Completion Banner if on final step */}
      {isLastStep && (
        <div className="my-3 p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-indigo-950/60 border border-emerald-500/30 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-emerald-300 text-xs sm:text-sm">
              Preuve géométrique 3D terminée !
            </div>
            <div className="text-xs text-slate-300">
              Forme factorisée : <span className="font-mono text-white font-bold">{solution.finalFormLatex}</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Step Dots and Nav Buttons */}
      <div className="pt-3 border-t border-slate-800/80">
        {/* Step dots scrub bar */}
        <div className="flex items-center space-x-1.5 w-full mb-3">
          {steps.map((st, idx) => {
            const isActive = idx === currentStepIndex;
            const isPast = idx < currentStepIndex;
            return (
              <button
                key={st.stepNumber}
                id={`step-dot-${idx}`}
                onClick={() => onStepChange(idx)}
                className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-indigo-500 ring-2 ring-indigo-400/50'
                    : isPast
                    ? 'bg-emerald-500/80'
                    : 'bg-slate-800 hover:bg-slate-700'
                }`}
                title={`Étape ${idx + 1}: ${st.title}`}
              />
            );
          })}
        </div>

        {/* Buttons: Précédent / Suivant */}
        <div className="flex items-center justify-between space-x-3">
          <button
            id="prev-step-btn"
            onClick={() => onStepChange(Math.max(0, currentStepIndex - 1))}
            disabled={isFirstStep}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl font-medium text-xs sm:text-sm transition-colors ${
              isFirstStep
                ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-800'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Étape précédente</span>
          </button>

          <button
            id="next-step-btn"
            onClick={() => onStepChange(Math.min(steps.length - 1, currentStepIndex + 1))}
            disabled={isLastStep}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl font-medium text-xs sm:text-sm transition-all shadow-md ${
              isLastStep
                ? 'bg-emerald-700/60 text-emerald-200 border border-emerald-600/50'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
          >
            <span>{isLastStep ? 'Résolution validée' : 'Étape suivante'}</span>
            {!isLastStep ? <ChevronRight className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
