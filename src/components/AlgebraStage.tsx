import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExpressionSolution, MathStep } from '../types';
import { MathView } from './MathView';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info,
  CheckCircle2,
  Layers,
  ArrowRight,
  Zap
} from 'lucide-react';

interface AlgebraStageProps {
  solution: ExpressionSolution;
  currentStepIndex: number;
  onStepChange: (index: number) => void;
  isCompleted: boolean;
  onComplete: () => void;
}

export const AlgebraStage: React.FC<AlgebraStageProps> = ({
  solution,
  currentStepIndex,
  onStepChange,
  isCompleted,
  onComplete,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [animationKey, setAnimationKey] = useState<number>(0);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  const steps = solution.steps || [];
  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  // Auto-play steps sequencer
  useEffect(() => {
    if (isPlaying) {
      const delay = 3200 / playbackSpeed;
      playTimerRef.current = setTimeout(() => {
        if (currentStepIndex < steps.length - 1) {
          onStepChange(currentStepIndex + 1);
        } else {
          setIsPlaying(false);
          onComplete();
        }
      }, delay);
    }
    return () => {
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, playbackSpeed, onStepChange, onComplete]);

  // Replay animation triggers a key reset
  const handleReplay = () => {
    setAnimationKey((prev) => prev + 1);
  };

  if (!currentStep) return null;

  return (
    <div className="flex flex-col h-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-6 shadow-2xl backdrop-blur-xl">
      {/* Top Header & Controls */}
      <div className="flex flex-wrap items-center justify-between pb-3.5 border-b border-slate-800/90 gap-3">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-xs font-semibold uppercase tracking-wider border border-indigo-500/30 flex items-center">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-indigo-400" />
            Mode Algèbre Animée
          </span>
          <span className="text-slate-400 text-xs font-medium">
            Étape {currentStepIndex + 1} / {steps.length}
          </span>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center space-x-2">
          {/* Speed selector */}
          <div className="flex items-center bg-slate-950/80 rounded-lg p-0.5 border border-slate-800 text-xs">
            {[0.75, 1, 1.5].map((speed) => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  playbackSpeed === speed
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={`Vitesse x${speed}`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Replay */}
          <button
            onClick={handleReplay}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Rejouer l'animation de cette étape"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Play / Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Lecture auto</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Animated Display Area */}
      <div className="my-4 flex-1 flex flex-col justify-center items-center relative min-h-[300px] bg-slate-950/90 rounded-2xl border border-slate-800/80 p-6 overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Animated Main Content based on step */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentStepIndex}-${animationKey}`}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full flex flex-col items-center justify-center z-10 space-y-6"
          >
            {/* Step Subtitle */}
            <div className="text-xs font-mono font-medium uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              {currentStep.title}
            </div>

            {/* Special Animated Token Stage for Double Distribution */}
            {currentStep.algebraAnimation && (
              <div className="w-full max-w-xl flex flex-col items-center">
                {/* Visual Distribution Arcs if step is distribution (Step 2) */}
                {currentStep.algebraAnimation.type === 'distribution' && (
                  <div className="w-full flex flex-col items-center mb-4">
                    {/* SVG Flowing Distribution Arcs */}
                    <div className="relative w-full h-24 max-w-md">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 400 90">
                        <defs>
                          <marker
                            id="arrowhead-blue"
                            markerWidth="6"
                            markerHeight="6"
                            refX="5"
                            refY="3"
                            orient="auto"
                          >
                            <polygon points="0 0, 6 3, 0 6" fill="#38bdf8" />
                          </marker>
                          <marker
                            id="arrowhead-indigo"
                            markerWidth="6"
                            markerHeight="6"
                            refX="5"
                            refY="3"
                            orient="auto"
                          >
                            <polygon points="0 0, 6 3, 0 6" fill="#818cf8" />
                          </marker>
                          <marker
                            id="arrowhead-amber"
                            markerWidth="6"
                            markerHeight="6"
                            refX="5"
                            refY="3"
                            orient="auto"
                          >
                            <polygon points="0 0, 6 3, 0 6" fill="#f59e0b" />
                          </marker>
                          <marker
                            id="arrowhead-pink"
                            markerWidth="6"
                            markerHeight="6"
                            refX="5"
                            refY="3"
                            orient="auto"
                          >
                            <polygon points="0 0, 6 3, 0 6" fill="#ec4899" />
                          </marker>
                        </defs>

                        {/* Arc 1: First -> First (Top Blue) */}
                        <motion.path
                          d="M 120 70 Q 185 10 250 70"
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="2.5"
                          strokeDasharray="6,4"
                          markerEnd="url(#arrowhead-blue)"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.8, delay: 0.1 }}
                        />
                        <text x="185" y="24" fill="#38bdf8" fontSize="11" textAnchor="middle" fontWeight="bold">
                          1. Premier × Premier
                        </text>

                        {/* Arc 2: First -> Second (Top Indigo) */}
                        <motion.path
                          d="M 120 70 Q 220 -15 320 70"
                          fill="none"
                          stroke="#818cf8"
                          strokeWidth="2.5"
                          strokeDasharray="6,4"
                          markerEnd="url(#arrowhead-indigo)"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.8, delay: 0.5 }}
                        />
                        <text x="240" y="8" fill="#818cf8" fontSize="11" textAnchor="middle" fontWeight="bold">
                          2. Premier × Second
                        </text>
                      </svg>
                    </div>

                    <div className="text-xs text-slate-400 text-center mb-2">
                      Chaque terme du 1er groupe projette une flèche de multiplication vers le 2nd groupe
                    </div>
                  </div>
                )}

                {/* Factorization specific indicator and banner */}
                {currentStep.algebraAnimation.commonFactorText && (
                  <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-red-950/70 border border-red-500/40 text-red-300 mb-3 shadow-md">
                    <Zap className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                    <span>Facteur commun extrait en ROUGE :</span>
                    <span className="font-mono font-black text-white bg-red-600 px-2.5 py-0.5 rounded shadow">
                      {currentStep.algebraAnimation.commonFactorText}
                    </span>
                  </div>
                )}

                {/* Development specific indicator for distributor in RED */}
                {currentStep.algebraAnimation.distributingFactorText && (
                  <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-red-950/70 border border-red-500/40 text-red-300 mb-3 shadow-md">
                    <Zap className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                    <span>Élément distributeur en ROUGE (déplacement animé) :</span>
                    <span className="font-mono font-black text-white bg-red-600 px-2.5 py-0.5 rounded shadow">
                      {currentStep.algebraAnimation.distributingFactorText}
                    </span>
                  </div>
                )}

                {/* Development specific indicator for terms being replaced in RED */}
                {currentStep.algebraAnimation.replacedTermsText && (
                  <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-red-950/70 border border-red-500/40 text-red-300 mb-3 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                    <span>Termes calculés & remplacés mis en ROUGE (aucune disparition) :</span>
                    <span className="font-mono font-bold text-red-200">
                      {currentStep.algebraAnimation.replacedTermsText}
                    </span>
                  </div>
                )}

                {/* Animated Tokens / Badges row with visible physical displacement */}
                <div className="flex flex-wrap items-center justify-center gap-2 p-4 bg-slate-900/90 rounded-xl border border-slate-800 shadow-inner relative">
                  {currentStep.algebraAnimation.tokens?.map((token, idx) => {
                    const isRedFactor = token.isCommonFactor || token.isDistributor || token.isReplaced || token.color === '#ef4444';
                    const isReplacedBadge = token.isReplaced;
                    const isResultBadge = token.isResultOfReplacement;
                    return (
                      <motion.div
                        key={idx}
                        initial={
                          (isRedFactor || token.isDistributor) && (currentStep.algebraAnimation?.type === 'factor_extraction' || currentStep.algebraAnimation?.type === 'development_distribute')
                            ? { x: -35, scale: 1.25, opacity: 0 }
                            : { scale: 0.85, opacity: 0 }
                        }
                        animate={{ x: 0, scale: 1, opacity: 1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 140,
                          damping: 14,
                          delay: idx * 0.07,
                        }}
                        className={`px-3 py-2 rounded-lg font-mono font-bold text-sm sm:text-base border transition-all relative ${
                          isRedFactor
                            ? 'bg-red-600 text-white border-red-400 ring-4 ring-red-500/50 shadow-xl shadow-red-950 font-black scale-105'
                            : isResultBadge
                            ? 'bg-emerald-900/80 text-emerald-200 border-emerald-500 ring-2 ring-emerald-500/40'
                            : token.type === 'operator'
                            ? 'bg-transparent text-slate-400 border-transparent text-lg'
                            : token.type === 'bracket'
                            ? 'bg-slate-800/80 text-white border-slate-700 shadow-sm'
                            : token.highlight
                            ? 'bg-indigo-950/80 text-white border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg'
                            : 'bg-slate-800 text-slate-200 border-slate-700'
                        }`}
                        style={{ color: !isRedFactor && token.color ? token.color : undefined }}
                      >
                        {token.text}
                        {isRedFactor && (
                          <span className="absolute -top-2 -right-1 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                          </span>
                        )}
                        {isReplacedBadge && (
                          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] bg-red-950 text-red-300 px-1 rounded border border-red-500 uppercase font-sans whitespace-nowrap">
                            Remplacé
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {currentStep.algebraAnimation.activeExplanation && (
                  <div className="mt-2 text-xs text-slate-400 text-center italic">
                    {currentStep.algebraAnimation.activeExplanation}
                  </div>
                )}
              </div>
            )}

            {/* Central Mathematical Formula Rendered via KaTeX */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-2xl text-center flex flex-col items-center justify-center max-w-2xl w-full">
              <div className="text-xs font-mono uppercase text-slate-400 mb-2">
                Écriture algébrique rigoureuse
              </div>
              <div className="text-2xl sm:text-3xl font-semibold text-white py-1 overflow-x-auto max-w-full">
                <MathView latex={currentStep.latex} display={true} />
              </div>
            </div>

            {/* Pedagogical Step Insight */}
            <div className="max-w-xl text-center px-4">
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                {currentStep.explanation}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Complete Step Navigation Bar */}
      <div className="pt-3 border-t border-slate-800/90 flex flex-col space-y-3">
        {/* Step dots scrub bar */}
        <div className="flex items-center space-x-1.5 w-full">
          {steps.map((st, idx) => {
            const isActive = idx === currentStepIndex;
            const isPast = idx < currentStepIndex;
            return (
              <button
                key={st.stepNumber}
                id={`algebra-step-${idx}`}
                onClick={() => onStepChange(idx)}
                className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-indigo-500 ring-2 ring-indigo-400/50 scale-y-125'
                    : isPast
                    ? 'bg-emerald-500/80'
                    : 'bg-slate-800 hover:bg-slate-700'
                }`}
                title={`Étape ${idx + 1}: ${st.title}`}
              />
            );
          })}
        </div>

        {/* Buttons Previous / Next */}
        <div className="flex items-center justify-between space-x-3">
          <button
            id="prev-algebra-step-btn"
            onClick={() => onStepChange(Math.max(0, currentStepIndex - 1))}
            disabled={currentStepIndex === 0}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl font-medium text-xs sm:text-sm transition-colors ${
              currentStepIndex === 0
                ? 'bg-slate-800/40 text-slate-600 cursor-not-allowed border border-slate-800/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Étape précédente</span>
          </button>

          <button
            id="next-algebra-step-btn"
            onClick={() => onStepChange(Math.min(steps.length - 1, currentStepIndex + 1))}
            disabled={isLastStep}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl font-medium text-xs sm:text-sm transition-all shadow-md ${
              isLastStep
                ? 'bg-emerald-700/60 text-emerald-200 border border-emerald-600/50'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
          >
            <span>{isLastStep ? 'Développement terminé' : 'Étape suivante'}</span>
            {!isLastStep ? <ChevronRight className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
