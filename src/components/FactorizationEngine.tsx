import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MathView } from './MathView';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Zap,
  Sliders,
  Maximize2
} from 'lucide-react';

export interface FactorizationProblem {
  id: string;
  category: 'monomial' | 'variable' | 'binomial' | 'difference_squares';
  categoryLabel: string;
  expressionLatex: string;
  commonFactor: string; // The factor to highlight in RED
  commonFactorType: 'number' | 'variable' | 'monomial' | 'bracket';
  term1Original: string;
  term1FactorRed: string;
  term1Remaining: string;
  term2Original: string;
  term2FactorRed: string;
  term2Remaining: string;
  operator: '+' | '-';
  groupedBracketLatex: string;
  finalSimplifiedLatex: string;
  explanationStep1: string;
  explanationStep2: string;
  explanationStep3: string;
  explanationStep4: string;
  explanationStep5: string;
  verificationLatex: string;
}

export const FACTORIZATION_PRESETS: FactorizationProblem[] = [
  {
    id: 'monomial-15x-25',
    category: 'monomial',
    categoryLabel: '1. Facteur numérique simple',
    expressionLatex: '15x + 25',
    commonFactor: '5',
    commonFactorType: 'number',
    term1Original: '15x',
    term1FactorRed: '5',
    term1Remaining: '3x',
    term2Original: '25',
    term2FactorRed: '5',
    term2Remaining: '5',
    operator: '+',
    groupedBracketLatex: '5 \\times [3x + 5]',
    finalSimplifiedLatex: '5(3x + 5)',
    explanationStep1: "Expression de départ : deux termes séparés par le signe +. Aucun facteur n'est encore évident.",
    explanationStep2: "Décomposition : 15x = 5 × 3x et 25 = 5 × 5. Le chiffre 5 apparaît en ROUGE dans chaque terme : c'est le facteur commun !",
    explanationStep3: "Déplacement visible : les chiffres 5 en rouge quittent leurs positions d'origine et glissent vers l'avant gauche pour former un seul facteur de tête.",
    explanationStep4: "Capture des restes : les termes restants (3x et + 5) se rassemblent et sont emprisonnés entre des crochets protecteurs.",
    explanationStep5: "Forme factorisée finale : 5(3x + 5). L'opération somme s'est transformée en un produit de facteurs !",
    verificationLatex: '5 \\times 3x + 5 \\times 5 = 15x + 25 \\quad \\checkmark'
  },
  {
    id: 'monomial-6x2-8x',
    category: 'variable',
    categoryLabel: '2. Facteur avec variable (2x)',
    expressionLatex: '6x^2 - 8x',
    commonFactor: '2x',
    commonFactorType: 'monomial',
    term1Original: '6x^2',
    term1FactorRed: '2x',
    term1Remaining: '3x',
    term2Original: '8x',
    term2FactorRed: '2x',
    term2Remaining: '4',
    operator: '-',
    groupedBracketLatex: '2x \\times [3x - 4]',
    finalSimplifiedLatex: '2x(3x - 4)',
    explanationStep1: "Expression de départ : 6x² - 8x. On a à la fois des coefficients pairs et la lettre x dans chaque terme.",
    explanationStep2: "Décomposition : 6x² = 2x × 3x et 8x = 2x × 4. Le monôme 2x apparaît en ROUGE dans les deux termes !",
    explanationStep3: "Déplacement visible : les blocs 2x en rouge glissent vers l'avant gauche pour n'en former qu'un seul.",
    explanationStep4: "Capture des restes : les morceaux restants 3x et 4 (séparés par le signe -) sont regroupés dans les crochets.",
    explanationStep5: "Résultat final : 2x(3x - 4). On a factorisé par 2x.",
    verificationLatex: '2x \\times 3x - 2x \\times 4 = 6x^2 - 8x \\quad \\checkmark'
  },
  {
    id: 'monomial-12x-18',
    category: 'monomial',
    categoryLabel: '3. PGCD = 6',
    expressionLatex: '12x + 18',
    commonFactor: '6',
    commonFactorType: 'number',
    term1Original: '12x',
    term1FactorRed: '6',
    term1Remaining: '2x',
    term2Original: '18',
    term2FactorRed: '6',
    term2Remaining: '3',
    operator: '+',
    groupedBracketLatex: '6 \\times [2x + 3]',
    finalSimplifiedLatex: '6(2x + 3)',
    explanationStep1: "Expression de départ : 12x + 18. Cherchons le plus grand diviseur commun à 12 et 18.",
    explanationStep2: "12 = 6 × 2 et 18 = 6 × 3. Le chiffre 6 est le facteur commun maximal, mis en ROUGE.",
    explanationStep3: "Le chiffre 6 en rouge glisse vers la gauche à l'extérieur des parenthèses.",
    explanationStep4: "Les restes (2x et 3) sont regroupés : [2x + 3].",
    explanationStep5: "Résultat final : 6(2x + 3).",
    verificationLatex: '6 \\times 2x + 6 \\times 3 = 12x + 18 \\quad \\checkmark'
  },
  {
    id: 'binomial-x2-classic',
    category: 'binomial',
    categoryLabel: '4. Parenthèse commune (x + 2)',
    expressionLatex: '(x + 2)(3x - 1) + (x + 2)(x + 5)',
    commonFactor: '(x + 2)',
    commonFactorType: 'bracket',
    term1Original: '(x + 2)(3x - 1)',
    term1FactorRed: '(x + 2)',
    term1Remaining: '(3x - 1)',
    term2Original: '(x + 2)(x + 5)',
    term2FactorRed: '(x + 2)',
    term2Remaining: '(x + 5)',
    operator: '+',
    groupedBracketLatex: '(x + 2) \\times [(3x - 1) + (x + 5)]',
    finalSimplifiedLatex: '(x + 2)(4x + 4) = 4(x + 2)(x + 1)',
    explanationStep1: "Expression de départ : une somme de deux grands paquets de produits. Remarquez la répétition !",
    explanationStep2: "Le binôme entier (x + 2) est présent dans les deux paquets : il s'illumine en ROUGE VIF !",
    explanationStep3: "Déplacement visible : les deux parenthèses rouges (x + 2) migrent vers la gauche pour être mises en tête.",
    explanationStep4: "Capture des restes : on ouvre un grand crochet [ ... ] et on y dépose tout ce qui reste : (3x - 1) + (x + 5).",
    explanationStep5: "Réduction finale : à l'intérieur du crochet, 3x + x = 4x et -1 + 5 = 4, soit (x + 2)(4x + 4).",
    verificationLatex: '\\text{Forme factorisée validée par réduction de l\'expression}'
  },
  {
    id: 'binomial-2x-minus-3',
    category: 'binomial',
    categoryLabel: '5. Parenthèse commune avec signe -',
    expressionLatex: '(2x - 3)(x + 4) - (2x - 3)(5x - 2)',
    commonFactor: '(2x - 3)',
    commonFactorType: 'bracket',
    term1Original: '(2x - 3)(x + 4)',
    term1FactorRed: '(2x - 3)',
    term1Remaining: '(x + 4)',
    term2Original: '(2x - 3)(5x - 2)',
    term2FactorRed: '(2x - 3)',
    term2Remaining: '(5x - 2)',
    operator: '-',
    groupedBracketLatex: '(2x - 3) \\times [(x + 4) - (5x - 2)]',
    finalSimplifiedLatex: '(2x - 3)(-4x + 6)',
    explanationStep1: "Attention au piège du signe moins (-) entre les deux termes !",
    explanationStep2: "Le facteur commun évident est (2x - 3), mis en ROUGE dans chaque terme.",
    explanationStep3: "La parenthèse rouge (2x - 3) glisse vers l'avant gauche de l'expression.",
    explanationStep4: "Règle des signes : dans le crochet, on a (x + 4) - (5x - 2) = x + 4 - 5x + 2 (le signe - change tous les signes intérieurs !).",
    explanationStep5: "Réduction des termes intérieurs : x - 5x = -4x et 4 + 2 = 6. Résultat : (2x - 3)(-4x + 6).",
    verificationLatex: '\\text{Attention obligatoire : le signe - distribue sur tous les termes du 2nd reste}'
  },
  {
    id: 'diff-squares-25x2-36',
    category: 'difference_squares',
    categoryLabel: '6. Identité a² - b²',
    expressionLatex: '25x^2 - 36',
    commonFactor: '5x et 6',
    commonFactorType: 'monomial',
    term1Original: '25x^2',
    term1FactorRed: '(5x)^2',
    term1Remaining: '5x',
    term2Original: '36',
    term2FactorRed: '6^2',
    term2Remaining: '6',
    operator: '-',
    groupedBracketLatex: '(5x)^2 - 6^2',
    finalSimplifiedLatex: '(5x - 6)(5x + 6)',
    explanationStep1: "Expression de départ : différence de deux carrés parfaits. 25x² est le carré de 5x et 36 est le carré de 6.",
    explanationStep2: "Décomposition en carrés : a = 5x et b = 6. Les bases a et b sont mises en évidence.",
    explanationStep3: "Déplacement géométrique : les deux bases 5x et 6 se dupliquent pour former les deux facteurs conjugués.",
    explanationStep4: "Formule a² - b² = (a - b)(a + b) appliquée directement avec a = 5x et b = 6.",
    explanationStep5: "Forme factorisée finale : (5x - 6)(5x + 6).",
    verificationLatex: '(5x - 6)(5x + 6) = 25x^2 - 36 \\quad \\checkmark'
  }
];

interface FactorizationEngineProps {
  onOpenAlgebraSolver?: (expr: string) => void;
}

export const FactorizationEngine: React.FC<FactorizationEngineProps> = ({
  onOpenAlgebraSolver,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('monomial-15x-25');
  const [currentStage, setCurrentStage] = useState<number>(1); // 1 to 5
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 0.5, 1, 1.5
  const [animationKey, setAnimationKey] = useState<number>(0);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activeProblem =
    FACTORIZATION_PRESETS.find((p) => p.id === selectedPresetId) || FACTORIZATION_PRESETS[0];

  // Auto-play sequencer
  useEffect(() => {
    if (isPlaying) {
      const delay = 3200 / playbackSpeed;
      playTimerRef.current = setTimeout(() => {
        if (currentStage < 5) {
          setCurrentStage((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, delay);
    }
    return () => {
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
    };
  }, [isPlaying, currentStage, playbackSpeed]);

  const handleSelectPreset = (id: string) => {
    setSelectedPresetId(id);
    setCurrentStage(1);
    setIsPlaying(false);
    setAnimationKey((prev) => prev + 1);
  };

  const handleReplay = () => {
    setCurrentStage(1);
    setAnimationKey((prev) => prev + 1);
    setIsPlaying(true);
  };

  const getExplanationForStage = (stage: number) => {
    switch (stage) {
      case 1:
        return activeProblem.explanationStep1;
      case 2:
        return activeProblem.explanationStep2;
      case 3:
        return activeProblem.explanationStep3;
      case 4:
        return activeProblem.explanationStep4;
      case 5:
        return activeProblem.explanationStep5;
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col space-y-4 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
      {/* Engine Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-md bg-red-500/20 text-red-600 dark:text-red-400 font-mono text-xs font-bold uppercase tracking-wider border border-red-500/40 flex items-center shadow-sm">
              <Zap className="w-3.5 h-3.5 mr-1 text-red-600 dark:text-red-400 animate-pulse" />
              Moteur de Déplacement & Facteur Commun Rouge
            </span>
            <span className="text-slate-600 dark:text-slate-400 text-xs font-medium">
              Étape {currentStage} / 5
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-black dark:text-white mt-1">
            Visualisation Dynamique : Extraction du Facteur Commun
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Regardez les chiffres et expressions glisser physiquement vers l'avant pour former le produit factorisé.
          </p>
        </div>

        {/* Speed & Playback Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Speed Selector */}
          <div className="flex items-center bg-slate-100/80 dark:bg-slate-950/80 rounded-lg p-0.5 border border-slate-200 dark:border-slate-800 text-xs shrink-0">
            {[0.5, 1, 1.5].map((speed) => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2 py-1 rounded text-[11px] font-mono transition-colors min-h-[32px] ${
                  playbackSpeed === speed
                    ? 'bg-red-600 text-white font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title={`Vitesse d'animation x${speed}`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Replay */}
          <button
            onClick={handleReplay}
            className="min-h-[36px] min-w-[36px] p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-colors flex items-center justify-center shrink-0"
            title="Rejouer l'animation depuis le début"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-xs shrink-0 ${
              isPlaying
                ? 'bg-white hover:bg-neutral-100 text-black border-2 border-black font-bold dark:bg-amber-600 dark:hover:bg-amber-500 dark:text-white'
                : 'bg-white hover:bg-neutral-100 text-black border-2 border-black font-bold dark:bg-red-600 dark:hover:bg-red-500 dark:text-white'
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
                <span>Animer la factorisation</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Problem Selector Tabs */}
      <div className="flex overflow-x-auto sm:flex-wrap gap-2 pt-1 pb-1 sm:pb-0 scrollbar-thin">
        <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold self-center mr-1 shrink-0">
          Exemples types 4e :
        </span>
        {FACTORIZATION_PRESETS.map((preset) => {
          const isSelected = preset.id === selectedPresetId;
          return (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset.id)}
              className={`shrink-0 sm:shrink px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all border min-h-[42px] text-left ${
                isSelected
                  ? 'bg-red-50/60 dark:bg-red-950/60 border-red-500 text-red-800 dark:text-red-200 font-bold shadow-md shadow-red-950/50'
                  : 'bg-slate-100/70 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="block font-bold">{preset.expressionLatex}</span>
              <span className="text-[10px] text-slate-600 dark:text-slate-400 block font-sans truncate max-w-[120px]">
                {preset.categoryLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* STAGE SCRUBBER BAR (1 to 5) */}
      <div className="bg-slate-100/80 dark:bg-slate-950/80 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col space-y-2">
        {/* Desktop Stage Labels */}
        <div className="hidden sm:flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 px-1 font-medium gap-1">
          <span className={currentStage === 1 ? 'text-slate-900 dark:text-white font-bold' : ''}>1. Brute</span>
          <span className={currentStage === 2 ? 'text-red-600 dark:text-red-400 font-bold' : ''}>2. Facteur Rouge</span>
          <span className={currentStage === 3 ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}>3. Déplacement</span>
          <span className={currentStage === 4 ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''}>4. Crochets</span>
          <span className={currentStage === 5 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>5. Factorisé !</span>
        </div>

        {/* Mobile Active Stage Indicator */}
        <div className="sm:hidden flex items-center justify-between text-xs font-bold px-1 text-slate-900 dark:text-white">
          <span className="text-slate-600 dark:text-slate-400">Étape {currentStage}/5</span>
          <span className="text-red-600 dark:text-red-400 font-mono text-[11px] truncate max-w-[200px]">
            {currentStage === 1 && '1. Expression brute'}
            {currentStage === 2 && '2. Facteur commun en ROUGE'}
            {currentStage === 3 && '3. Déplacement physique'}
            {currentStage === 4 && '4. Regroupement dans les crochets'}
            {currentStage === 5 && '5. Forme factorisée finale'}
          </span>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {[1, 2, 3, 4, 5].map((stepNum) => (
            <button
              key={stepNum}
              onClick={() => {
                setCurrentStage(stepNum);
                setIsPlaying(false);
              }}
              className={`flex-1 h-2.5 rounded-full transition-all duration-300 ${
                currentStage === stepNum
                  ? 'bg-red-500 ring-2 ring-red-400/60 scale-y-125'
                  : currentStage > stepNum
                  ? 'bg-emerald-500'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              title={`Étape ${stepNum}`}
            />
          ))}
        </div>
      </div>

      {/* MAIN DYNAMIC ANIMATION ARENA */}
      <div className="relative min-h-[340px] sm:min-h-[380px] bg-slate-100/90 dark:bg-slate-950/90 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-3 sm:p-6 flex flex-col items-center justify-center overflow-hidden shadow-inner w-full">
        {/* Decorative background grid */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(239,68,68,0.3) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* ANIMATED TERM TOKENS CONTAINER */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedPresetId}-${currentStage}-${animationKey}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-2xl flex flex-col items-center justify-center space-y-4 sm:space-y-6 z-10"
          >
            {/* STAGE BADGE INDICATOR */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                Étape {currentStage} :{' '}
                {currentStage === 1 && 'Expression brute'}
                {currentStage === 2 && 'Mise en ROUGE du Facteur Commun'}
                {currentStage === 3 && 'Déplacement physique des termes'}
                {currentStage === 4 && 'Fermeture des crochets'}
                {currentStage === 5 && 'Produit factorisé final'}
              </span>
            </div>

            {/* --- VISUAL STAGE 1: RAW EXPRESSION BLOCKS --- */}
            {currentStage === 1 && (
              <div className="flex items-center justify-center gap-3 p-4 bg-white/90 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
                {/* Term 1 */}
                <motion.div
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-lg sm:text-2xl font-bold border border-slate-300 dark:border-slate-700 shadow-md"
                >
                  {activeProblem.term1Original}
                </motion.div>

                {/* Operator */}
                <span className="text-xl sm:text-2xl font-bold text-slate-600 dark:text-slate-400 font-mono">
                  {activeProblem.operator}
                </span>

                {/* Term 2 */}
                <motion.div
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-lg sm:text-2xl font-bold border border-slate-300 dark:border-slate-700 shadow-md"
                >
                  {activeProblem.term2Original}
                </motion.div>
              </div>
            )}

            {/* --- VISUAL STAGE 2: FACTOR REVEALED IN RED --- */}
            {currentStage === 2 && (
              <div className="flex flex-col items-center space-y-3">
                <div className="flex flex-wrap items-center justify-center gap-3 p-4 bg-white/90 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
                  {/* Term 1 Decomposed */}
                  <div className="flex items-center space-x-1.5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
                    <motion.div
                      initial={{ scale: 0.8, backgroundColor: '#1e293b' }}
                      animate={{ scale: [1, 1.15, 1], backgroundColor: '#ef4444' }}
                      transition={{ duration: 0.6, repeat: 1 }}
                      className="px-3 py-2 rounded-lg font-mono text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white shadow-lg ring-4 ring-red-500/40"
                    >
                      {activeProblem.term1FactorRed}
                    </motion.div>
                    <span className="text-slate-500 dark:text-slate-400 font-mono text-lg">×</span>
                    <div className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-lg sm:text-2xl font-bold text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
                      {activeProblem.term1Remaining}
                    </div>
                  </div>

                  {/* Operator */}
                  <span className="text-xl sm:text-2xl font-bold text-slate-600 dark:text-slate-400 font-mono">
                    {activeProblem.operator}
                  </span>

                  {/* Term 2 Decomposed */}
                  <div className="flex items-center space-x-1.5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
                    <motion.div
                      initial={{ scale: 0.8, backgroundColor: '#1e293b' }}
                      animate={{ scale: [1, 1.15, 1], backgroundColor: '#ef4444' }}
                      transition={{ duration: 0.6, delay: 0.2, repeat: 1 }}
                      className="px-3 py-2 rounded-lg font-mono text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white shadow-lg ring-4 ring-red-500/40"
                    >
                      {activeProblem.term2FactorRed}
                    </motion.div>
                    <span className="text-slate-500 dark:text-slate-400 font-mono text-lg">×</span>
                    <div className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-lg sm:text-2xl font-bold text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
                      {activeProblem.term2Remaining}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs text-red-600 dark:text-red-400 font-semibold bg-red-50/40 dark:bg-red-950/40 px-3 py-1 rounded-full border border-red-500/30">
                  <Sparkles className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                  <span>Facteur commun détecté : </span>
                  <span className="font-mono font-bold text-white bg-red-600 px-2 py-0.5 rounded">
                    {activeProblem.commonFactor}
                  </span>
                </div>
              </div>
            )}

            {/* --- VISUAL STAGE 3: VISIBLE MOTION / DEPLACEMENT VERS L'AVANT --- */}
            {currentStage === 3 && (
              <div className="flex flex-col items-center space-y-2 w-full max-w-xl mx-auto">
                {/* 1. ORIGIN TIER: The decomposed expression showing both red factors */}
                <div className="w-full bg-white/90 dark:bg-slate-900/90 rounded-xl border border-slate-200 dark:border-slate-800 p-3 shadow-md">
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-center mb-2">
                    Position de départ : facteur rouge présent dans chaque terme
                  </div>
                  <div className="flex items-center justify-between sm:justify-around px-2 sm:px-6">
                    {/* Term 1 Decomposed */}
                    <div className="flex items-center space-x-1 p-1.5 sm:p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-red-500/40 shadow">
                      <span className="px-2.5 py-1 rounded bg-red-600 font-mono text-base sm:text-xl font-black text-white shadow ring-2 ring-red-400">
                        {activeProblem.term1FactorRed}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 font-mono text-sm">×</span>
                      <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm sm:text-base text-slate-700 dark:text-slate-300">
                        {activeProblem.term1Remaining}
                      </span>
                    </div>

                    {/* Operator */}
                    <span className="text-xl font-black font-mono text-slate-600 dark:text-slate-400 px-2">
                      {activeProblem.operator}
                    </span>

                    {/* Term 2 Decomposed */}
                    <div className="flex items-center space-x-1 p-1.5 sm:p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-red-500/40 shadow">
                      <span className="px-2.5 py-1 rounded bg-red-600 font-mono text-base sm:text-xl font-black text-white shadow ring-2 ring-red-400">
                        {activeProblem.term2FactorRed}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 font-mono text-sm">×</span>
                      <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm sm:text-base text-slate-700 dark:text-slate-300">
                        {activeProblem.term2Remaining}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. DEDICATED VECTOR CONNECTOR: Arrows perfectly anchored between top factors and bottom head */}
                <div className="w-full h-16 sm:h-20 relative flex items-center justify-center my-0.5">
                  <svg className="w-full h-full" viewBox="0 0 500 70" preserveAspectRatio="none">
                    <defs>
                      <marker
                        id="arrow-red-stage3"
                        markerWidth="8"
                        markerHeight="8"
                        refX="6"
                        refY="4"
                        orient="auto"
                      >
                        <polygon points="0 0, 8 4, 0 8" fill="#ef4444" />
                      </marker>
                    </defs>

                    {/* Arrow 1: Leaving Term 1 factor downwards to the front head */}
                    <motion.path
                      d="M 120 2 C 120 30, 125 45, 130 62"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="3.5"
                      strokeDasharray="6,4"
                      markerEnd="url(#arrow-red-stage3)"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.7 }}
                    />

                    {/* Arrow 2: Leaving Term 2 factor migrating leftwards to the front head */}
                    <motion.path
                      d="M 380 2 C 340 42, 200 45, 145 62"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="3.5"
                      strokeDasharray="6,4"
                      markerEnd="url(#arrow-red-stage3)"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 0.15 }}
                    />

                    {/* Central guidance badge text */}
                    <rect x="180" y="20" width="160" height="20" rx="10" fill="#450a0a" stroke="#ef4444" strokeWidth="1" />
                    <text x="260" y="34" fill="#fca5a5" fontSize="10" fontWeight="bold" textAnchor="middle">
                      Extraction vers l'avant ↙
                    </text>
                  </svg>
                </div>

                {/* 3. DESTINATION TIER: United common factor at front with remaining elements grouped */}
                <div className="w-full bg-white/90 dark:bg-slate-900/90 rounded-2xl border-2 border-red-500/50 p-3 sm:p-4 shadow-xl shadow-red-950/40">
                  <div className="text-[11px] font-bold text-red-700 dark:text-red-300 uppercase tracking-wider text-center mb-2">
                    Position d'arrivée : le facteur rouge est extrait en tête
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2.5">
                    {/* Extracted Red Factor */}
                    <motion.div
                      initial={{ scale: 0.8, y: -8 }}
                      animate={{ scale: [1, 1.05, 1], y: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                      className="px-3.5 py-1.5 sm:py-2 rounded-xl bg-red-600 text-white font-mono text-lg sm:text-2xl font-black shadow-lg ring-4 ring-red-400/50 flex items-center space-x-1.5 shrink-0"
                    >
                      <span>{activeProblem.commonFactor}</span>
                      <span className="text-[10px] bg-red-50/80 dark:bg-red-950/80 px-2 py-0.5 rounded text-red-800 dark:text-red-200 uppercase font-sans font-bold">
                        En tête
                      </span>
                    </motion.div>

                    {/* Multiplication symbol */}
                    <span className="text-xl sm:text-2xl font-mono text-slate-600 dark:text-slate-400 font-bold">×</span>

                    {/* Grouped leftovers */}
                    <div className="flex items-center space-x-1.5 p-1.5 sm:p-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                      <span className="font-mono text-base sm:text-xl font-bold text-slate-600 dark:text-slate-400">[</span>
                      <span className="font-mono text-sm sm:text-lg text-slate-800 dark:text-slate-200 font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                        {activeProblem.term1Remaining}
                      </span>
                      <span className="font-mono text-base sm:text-xl font-bold text-slate-600 dark:text-slate-400">
                        {activeProblem.operator}
                      </span>
                      <span className="font-mono text-sm sm:text-lg text-slate-800 dark:text-slate-200 font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                        {activeProblem.term2Remaining}
                      </span>
                      <span className="font-mono text-base sm:text-xl font-bold text-slate-600 dark:text-slate-400">]</span>
                    </div>
                  </div>
                </div>

                {/* Educational Banner */}
                <div className="text-xs text-amber-700 dark:text-amber-300 font-medium bg-amber-50/40 dark:bg-amber-950/40 px-3.5 py-1.5 rounded-full border border-amber-500/30 flex items-center space-x-2 shadow mt-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>
                    Les facteurs rouges ont quitté chaque terme pour se réunir en un unique facteur devant !
                  </span>
                </div>
              </div>
            )}

            {/* --- VISUAL STAGE 4: CROCHETS WRAPPING REMAINING TERMS --- */}
            {currentStage === 4 && (
              <div className="flex flex-col items-center space-y-3">
                <div className="flex items-center justify-center gap-2 p-4 bg-white/90 dark:bg-slate-900/90 rounded-2xl border border-indigo-500/40 shadow-2xl">
                  {/* Common Factor in Red */}
                  <div className="px-4 py-2.5 rounded-xl bg-red-600 text-white font-mono text-xl sm:text-3xl font-extrabold shadow-lg">
                    {activeProblem.commonFactor}
                  </div>

                  {/* Opening Bracket */}
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono"
                  >
                    [
                  </motion.span>

                  {/* Remaining Terms in Bracket */}
                  <div className="flex items-center space-x-2 px-2">
                    <span className="font-mono text-lg sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {activeProblem.term1Remaining}
                    </span>
                    <span className="font-mono text-lg sm:text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                      {activeProblem.operator}
                    </span>
                    <span className="font-mono text-lg sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {activeProblem.term2Remaining}
                    </span>
                  </div>

                  {/* Closing Bracket */}
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono"
                  >
                    ]
                  </motion.span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300">
                  Les termes restants sont enfermés dans les crochets : <MathView latex={activeProblem.groupedBracketLatex} display={false} />
                </p>
              </div>
            )}

            {/* --- VISUAL STAGE 5: FINAL FACTORED PRODUCT --- */}
            {currentStage === 5 && (
              <div className="flex flex-col items-center space-y-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 150 }}
                  className="p-5 rounded-2xl bg-gradient-to-r from-red-50/60 dark:from-red-950/60 via-slate-100 dark:via-slate-900 to-emerald-50/60 dark:to-emerald-950/60 border border-emerald-500/50 shadow-2xl text-center flex flex-col items-center"
                >
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Forme factorisée finale
                  </span>
                  <div className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono py-2">
                    <MathView latex={activeProblem.finalSimplifiedLatex} display={true} />
                  </div>
                </motion.div>

                {/* Verification card */}
                <div className="p-3 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1 text-center">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Vérification par développement :</span>
                  <div className="font-mono text-slate-800 dark:text-slate-200">
                    <MathView latex={activeProblem.verificationLatex} display={false} />
                  </div>
                </div>
              </div>
            )}

            {/* LaTeX Mathematical Formula Sync */}
            <div className="w-full max-w-xl p-3 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-[11px] font-mono uppercase text-slate-600 dark:text-slate-400 mb-1">
                Écriture algébrique rigoureuse
              </div>
              <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white overflow-x-auto">
                {currentStage === 1 && <MathView latex={activeProblem.expressionLatex} display={false} />}
                {currentStage === 2 && (
                  <MathView
                    latex={`${activeProblem.term1Original} ${activeProblem.operator} ${activeProblem.term2Original} = {\\color{red}${activeProblem.term1FactorRed}} \\times ${activeProblem.term1Remaining} ${activeProblem.operator} {\\color{red}${activeProblem.term2FactorRed}} \\times ${activeProblem.term2Remaining}`}
                    display={false}
                  />
                )}
                {currentStage === 3 && (
                  <MathView
                    latex={`= {\\color{red}${activeProblem.commonFactor}} \\times [${activeProblem.term1Remaining} ${activeProblem.operator} ${activeProblem.term2Remaining}]`}
                    display={false}
                  />
                )}
                {currentStage === 4 && <MathView latex={`= ${activeProblem.groupedBracketLatex}`} display={false} />}
                {currentStage === 5 && <MathView latex={`= ${activeProblem.finalSimplifiedLatex}`} display={false} />}
              </div>
            </div>

            {/* Pedagogical Step Explanation */}
            <div className="max-w-xl text-center px-4 bg-white/60 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {getExplanationForStage(currentStage)}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons: Previous / Next Step */}
      <div className="flex items-center justify-between space-x-3 pt-2">
        <button
          onClick={() => {
            setCurrentStage((prev) => Math.max(1, prev - 1));
            setIsPlaying(false);
          }}
          disabled={currentStage === 1}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl font-medium text-xs sm:text-sm transition-colors ${
            currentStage === 1
              ? 'bg-slate-100/40 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 cursor-not-allowed border border-slate-200/50 dark:border-slate-800/50'
              : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Étape précédente</span>
        </button>

        <button
          onClick={() => {
            setCurrentStage((prev) => Math.min(5, prev + 1));
            setIsPlaying(false);
          }}
          disabled={currentStage === 5}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl font-medium text-xs sm:text-sm transition-all shadow-xs ${
            currentStage === 5
              ? 'bg-white text-black border-2 border-black font-bold dark:bg-emerald-700/60 dark:text-emerald-200 border border-neutral-300 dark:border-emerald-600/50'
              : 'bg-white hover:bg-neutral-100 text-black border-2 border-black font-bold dark:bg-red-600 dark:hover:bg-red-500 dark:text-white'
          }`}
        >
          <span>{currentStage === 5 ? 'Factorisation achevée' : 'Étape suivante'}</span>
          {currentStage !== 5 ? <ChevronRight className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Sandbox Bridge */}
      {onOpenAlgebraSolver && (
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => onOpenAlgebraSolver(activeProblem.expressionLatex)}
            className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold underline flex items-center space-x-1"
          >
            <span>Ouvrir cette factorisation dans le bac à sable de calcul complet</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
