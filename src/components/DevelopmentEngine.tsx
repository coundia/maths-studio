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
  Zap,
  ArrowUpRight,
  Eye,
  Layers,
  HelpCircle
} from 'lucide-react';

export interface DevelopmentProblem {
  id: string;
  category: 'simple_positive' | 'simple_negative' | 'simple_variable' | 'double_classic' | 'double_signs' | 'square_identity';
  categoryLabel: string;
  expressionLatex: string;
  distributorItem: string; // Ex: '3', '-4', '2x', or '2x et 3'
  distributorType: 'constant' | 'variable' | 'double';
  termsInside: string[];
  intermediateProductsLatex: string;
  termsToReplaceStepLatex: string;
  replacedTermsBadges: {
    originalProduct: string;
    calculatedResult: string;
    rule: string;
  }[];
  finalExpandedLatex: string;
  finalReducedLatex: string;
  // Steps explanation
  explanationStep1: string;
  explanationStep2: string;
  explanationStep3: string;
  explanationStep4: string;
  explanationStep5: string;
  explanationStep6?: string;
  maxStages: number;
}

export const DEVELOPMENT_PRESETS: DevelopmentProblem[] = [
  {
    id: 'simple-3-2x-5',
    category: 'simple_positive',
    categoryLabel: '1. Distributivité simple : 3(2x + 5)',
    expressionLatex: '3(2x + 5)',
    distributorItem: '3',
    distributorType: 'constant',
    termsInside: ['2x', '5'],
    intermediateProductsLatex: '{\\color{red}3} \\times 2x + {\\color{red}3} \\times 5',
    termsToReplaceStepLatex: '{\\color{red}[3 \\times 2x]} + {\\color{red}[3 \\times 5]}',
    replacedTermsBadges: [
      { originalProduct: '3 × 2x', calculatedResult: '6x', rule: '3 fois 2x font 6x' },
      { originalProduct: '3 × 5', calculatedResult: '15', rule: '3 fois 5 font 15' }
    ],
    finalExpandedLatex: '6x + 15',
    finalReducedLatex: '6x + 15',
    maxStages: 5,
    explanationStep1: "Expression de départ : 3(2x + 5). Le facteur 3 est collé à la parenthèse, ce qui signifie qu'il multiplie TOUT son contenu.",
    explanationStep2: "Mise en ROUGE du facteur distributeur : le chiffre 3 s'illumine en ROUGE. C'est lui qui va voyager vers chaque terme intérieur.",
    explanationStep3: "Déplacement animé visible : le chiffre 3 rouge se duplique et glisse le long des flèches pour venir se poser devant 2x, puis devant 5. Rien ne disparaît : l'expression de départ reste tracée !",
    explanationStep4: "Mise en ROUGE des termes à remplacer : les deux produits 3 × 2x et 3 × 5 sont encadrés en rouge. Ils sont remplacés sous vos yeux par leurs valeurs calculées (6x et 15).",
    explanationStep5: "Forme développée et réduite : 6x + 15. Les parenthèses ont disparu sans aucune perte !"
  },
  {
    id: 'simple-neg-4-3x-2',
    category: 'simple_negative',
    categoryLabel: '2. Facteur négatif : -4(3x - 2)',
    expressionLatex: '-4(3x - 2)',
    distributorItem: '-4',
    distributorType: 'constant',
    termsInside: ['3x', '-2'],
    intermediateProductsLatex: '{\\color{red}(-4)} \\times 3x + {\\color{red}(-4)} \\times (-2)',
    termsToReplaceStepLatex: '{\\color{red}[(-4) \\times 3x]} + {\\color{red}[(-4) \\times (-2)]}',
    replacedTermsBadges: [
      { originalProduct: '(-4) × 3x', calculatedResult: '-12x', rule: 'Négatif × Positif = Négatif (-12x)' },
      { originalProduct: '(-4) × (-2)', calculatedResult: '+8', rule: 'Négatif × Négatif = Positif (+8)' }
    ],
    finalExpandedLatex: '-12x + 8',
    finalReducedLatex: '-12x + 8',
    maxStages: 5,
    explanationStep1: "Attention à la règle des signes : le facteur extérieur est -4. Il est indispensable de distribuer le signe moins !",
    explanationStep2: "Le bloc (-4) complet s'allume en ROUGE VIF pour ne pas oublier son signe négatif.",
    explanationStep3: "Déplacement animé : le (-4) en rouge glisse vers 3x, puis vers (-2). Traçabilité totale : chaque terme intérieur reçoit son (-4).",
    explanationStep4: "Mise en ROUGE des termes à remplacer : (-4) × 3x devient -12x, et (-4) × (-2) devient +8 (moins par moins donne plus !).",
    explanationStep5: "Résultat final : -12x + 8. L'expression est développée et réduite."
  },
  {
    id: 'simple-var-2x-3x-4',
    category: 'simple_variable',
    categoryLabel: '3. Variable en facteur : 2x(3x - 4)',
    expressionLatex: '2x(3x - 4)',
    distributorItem: '2x',
    distributorType: 'variable',
    termsInside: ['3x', '-4'],
    intermediateProductsLatex: '{\\color{red}2x} \\times 3x - {\\color{red}2x} \\times 4',
    termsToReplaceStepLatex: '{\\color{red}[2x \\times 3x]} - {\\color{red}[2x \\times 4]}',
    replacedTermsBadges: [
      { originalProduct: '2x × 3x', calculatedResult: '6x²', rule: '2 × 3 = 6 et x × x = x²' },
      { originalProduct: '2x × 4', calculatedResult: '8x', rule: '2 × 4 = 8, soit 8x' }
    ],
    finalExpandedLatex: '6x^2 - 8x',
    finalReducedLatex: '6x^2 - 8x',
    maxStages: 5,
    explanationStep1: "Expression de départ : 2x(3x - 4). Le facteur distributeur contient à la fois un nombre et la lettre x.",
    explanationStep2: "Le monôme 2x passe en ROUGE VIF. C'est l'élément mobile.",
    explanationStep3: "Déplacement physique : 2x rouge se duplique et se projette sur 3x puis sur -4 : 2x × 3x - 2x × 4.",
    explanationStep4: "Mise en ROUGE des termes à remplacer : [2x × 3x] est remplacé par 6x² (attention : x × x = x² !) et [2x × 4] est remplacé par 8x.",
    explanationStep5: "Résultat final : 6x² - 8x. On ne peut pas soustraire des x² et des x (ce sont des familles différentes !)."
  },
  {
    id: 'double-x2-x3',
    category: 'double_classic',
    categoryLabel: '4. Double distributivité : (x + 2)(x + 3)',
    expressionLatex: '(x + 2)(x + 3)',
    distributorItem: 'x et 2',
    distributorType: 'double',
    termsInside: ['x', '3'],
    intermediateProductsLatex: '{\\color{red}x} \\times x + {\\color{red}x} \\times 3 + {\\color{red}2} \\times x + {\\color{red}2} \\times 3',
    termsToReplaceStepLatex: '{\\color{red}[x \\times x]} + {\\color{red}[x \\times 3]} + {\\color{red}[2 \\times x]} + {\\color{red}[2 \\times 3]}',
    replacedTermsBadges: [
      { originalProduct: 'x × x', calculatedResult: 'x²', rule: 'Produit de x par x donne x²' },
      { originalProduct: 'x × 3', calculatedResult: '3x', rule: '3 fois x donne 3x' },
      { originalProduct: '2 × x', calculatedResult: '2x', rule: '2 fois x donne 2x' },
      { originalProduct: '2 × 3', calculatedResult: '6', rule: '2 fois 3 font 6' }
    ],
    finalExpandedLatex: 'x^2 + 3x + 2x + 6',
    finalReducedLatex: 'x^2 + 5x + 6',
    maxStages: 6,
    explanationStep1: "Double distributivité : chaque terme de la 1ère parenthèse va distribuer sur chaque terme de la 2nde parenthèse (4 flèches au total).",
    explanationStep2: "1ère vague : le terme 'x' de la 1ère parenthèse s'allume en ROUGE. Il glisse vers 'x' puis vers '3' : x × x + x × 3.",
    explanationStep3: "2nde vague : le terme '2' s'allume en ROUGE. Il glisse vers 'x' puis vers '3' : + 2 × x + 2 × 3. Rien n'a disparu, on a les 4 produits complets !",
    explanationStep4: "Mise en ROUGE des 4 produits à remplacer : [x × x] → x², [x × 3] → 3x, [2 × x] → 2x et [2 × 3] → 6.",
    explanationStep5: "Réduction : les termes semblables de la même famille [3x + 2x] sont mis en ROUGE et remplacés par leur somme 5x !",
    explanationStep6: "Forme finale développée et réduite : x² + 5x + 6. Vérifiée et simplifiée au maximum."
  },
  {
    id: 'double-2x3-x4',
    category: 'double_signs',
    categoryLabel: '5. Double distributivité avec signes : (2x - 3)(x + 4)',
    expressionLatex: '(2x - 3)(x + 4)',
    distributorItem: '2x et -3',
    distributorType: 'double',
    termsInside: ['x', '4'],
    intermediateProductsLatex: '{\\color{red}2x} \\times x + {\\color{red}2x} \\times 4 + {\\color{red}(-3)} \\times x + {\\color{red}(-3)} \\times 4',
    termsToReplaceStepLatex: '{\\color{red}[2x \\times x]} + {\\color{red}[2x \\times 4]} + {\\color{red}[(-3) \\times x]} + {\\color{red}[(-3) \\times 4]}',
    replacedTermsBadges: [
      { originalProduct: '2x × x', calculatedResult: '2x²', rule: '2 × 1 = 2 et x × x = x²' },
      { originalProduct: '2x × 4', calculatedResult: '8x', rule: '2 × 4 = 8, soit +8x' },
      { originalProduct: '(-3) × x', calculatedResult: '-3x', rule: 'Moins par plus = -3x' },
      { originalProduct: '(-3) × 4', calculatedResult: '-12', rule: 'Moins par plus = -12' }
    ],
    finalExpandedLatex: '2x^2 + 8x - 3x - 12',
    finalReducedLatex: '2x^2 + 5x - 12',
    maxStages: 6,
    explanationStep1: "Expression de départ : (2x - 3)(x + 4). Attention particulière au signe '-' attaché au chiffre 3 !",
    explanationStep2: "Distribution du 1er terme : 2x en ROUGE se déplace vers x puis vers 4 : 2x × x + 2x × 4.",
    explanationStep3: "Distribution du 2nd terme : (-3) en ROUGE se déplace vers x puis vers 4 : + (-3) × x + (-3) × 4. Aucune disparition !",
    explanationStep4: "Mise en ROUGE des termes remplacés : 2x × x → 2x², 2x × 4 → 8x, (-3) × x → -3x et (-3) × 4 → -12.",
    explanationStep5: "Réduction des x : les termes [+8x - 3x] sont mis en ROUGE et remplacés par 8 - 3 = +5x.",
    explanationStep6: "Forme finale ordonnée : 2x² + 5x - 12."
  },
  {
    id: 'identity-2x3-sq',
    category: 'square_identity',
    categoryLabel: '6. Carré d\'une somme : (2x + 3)²',
    expressionLatex: '(2x + 3)^2',
    distributorItem: '2x et 3',
    distributorType: 'double',
    termsInside: ['2x', '3'],
    intermediateProductsLatex: '(2x)^2 + {\\color{red}2} \\times (2x) \\times 3 + 3^2',
    termsToReplaceStepLatex: '{\\color{red}[(2x)^2]} + {\\color{red}[2 \\times 2x \\times 3]} + {\\color{red}[3^2]}',
    replacedTermsBadges: [
      { originalProduct: '(2x)²', calculatedResult: '4x²', rule: 'Le carré porte sur le 2 et sur le x : 2² × x² = 4x²' },
      { originalProduct: '2 × 2x × 3', calculatedResult: '12x', rule: 'Le double produit : 2 × 2 × 3 = 12, soit 12x' },
      { originalProduct: '3²', calculatedResult: '9', rule: 'Le carré du second terme : 3 × 3 = 9' }
    ],
    finalExpandedLatex: '4x^2 + 12x + 9',
    finalReducedLatex: '4x^2 + 12x + 9',
    maxStages: 5,
    explanationStep1: "Identité remarquable (a + b)² = a² + 2ab + b² avec a = 2x et b = 3.",
    explanationStep2: "Mise en ROUGE du facteur 2 du double produit et des termes au carré.",
    explanationStep3: "Déplacement animé de la formule : (2x)² + 2 × (2x) × 3 + 3². L'expression d'origine reste en référence !",
    explanationStep4: "Mise en ROUGE des blocs remplacés : [(2x)²] → 4x², [2 × 2x × 3] → 12x et [3²] → 9.",
    explanationStep5: "Forme développée et réduite irréductible : 4x² + 12x + 9."
  }
];

interface DevelopmentEngineProps {
  onOpenAlgebraSolver?: (expr: string) => void;
}

export const DevelopmentEngine: React.FC<DevelopmentEngineProps> = ({
  onOpenAlgebraSolver,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('simple-3-2x-5');
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [animationKey, setAnimationKey] = useState<number>(0);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activeProblem =
    DEVELOPMENT_PRESETS.find((p) => p.id === selectedPresetId) || DEVELOPMENT_PRESETS[0];

  const totalStages = activeProblem.maxStages;

  // Auto-play sequencer
  useEffect(() => {
    if (isPlaying) {
      const delay = 3400 / playbackSpeed;
      playTimerRef.current = setTimeout(() => {
        if (currentStage < totalStages) {
          setCurrentStage((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, delay);
    }
    return () => {
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
    };
  }, [isPlaying, currentStage, playbackSpeed, totalStages]);

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
      case 6:
        return activeProblem.explanationStep6 || activeProblem.explanationStep5;
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col space-y-4 bg-slate-900/95 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
      {/* Engine Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-md bg-red-500/20 text-red-400 font-mono text-xs font-bold uppercase tracking-wider border border-red-500/40 flex items-center shadow-sm">
              <Zap className="w-3.5 h-3.5 mr-1 text-red-400 animate-pulse" />
              Moteur de Développement & Termes Remplacés en Rouge
            </span>
            <span className="text-slate-400 text-xs font-medium">
              Étape {currentStage} / {totalStages}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-black dark:text-white mt-1">
            Développement Pas à Pas : Déplacement Animé & Zéro Disparition
          </h3>
          <p className="text-xs text-slate-400">
            L'élément multiplicateur est mis en <span className="text-red-400 font-bold">ROUGE</span> et se déplace sur chaque terme. Rien ne disparaît : les termes calculés sont toujours explicités en rouge.
          </p>
        </div>

        {/* Speed & Playback Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Speed Selector */}
          <div className="flex items-center bg-slate-950/80 rounded-lg p-0.5 border border-slate-800 text-xs shrink-0">
            {[0.5, 1, 1.5].map((speed) => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2 py-1 rounded text-[11px] font-mono transition-colors min-h-[32px] ${
                  playbackSpeed === speed
                    ? 'bg-red-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
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
            className="min-h-[36px] min-w-[36px] p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center justify-center shrink-0"
            title="Rejouer l'animation de développement depuis le début"
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
                <span>Animer le développement</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Problem Selector Tabs */}
      <div className="flex overflow-x-auto sm:flex-wrap gap-2 pt-1 pb-1 sm:pb-0 scrollbar-thin">
        <span className="text-xs text-slate-400 font-semibold self-center mr-1 shrink-0">
          Exemples types 4e :
        </span>
        {DEVELOPMENT_PRESETS.map((preset) => {
          const isSelected = preset.id === selectedPresetId;
          return (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset.id)}
              className={`shrink-0 sm:shrink px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all border min-h-[42px] text-left ${
                isSelected
                  ? 'bg-red-950/60 border-red-500 text-red-200 font-bold shadow-md shadow-red-950/50'
                  : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="block font-bold">{preset.expressionLatex}</span>
              <span className="text-[10px] text-slate-400 block font-sans truncate max-w-[120px]">
                {preset.categoryLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* TRACEABILITY BANNER (Règle d'or : Rien ne doit disparaître !) */}
      <div className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-sky-400 shrink-0" />
          <span className="text-xs text-slate-300 font-medium">
            Expression de départ :
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-sky-300 font-mono font-bold text-xs sm:text-sm">
            <MathView latex={activeProblem.expressionLatex} display={false} />
          </span>
        </div>
        <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0"></span>
          <span>Éléments & termes remplacés toujours en <strong className="text-red-400">ROUGE</strong></span>
        </div>
      </div>

      {/* STAGE SCRUBBER BAR */}
      <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 flex flex-col space-y-2">
        {/* Desktop Stage Labels */}
        <div className="hidden sm:flex items-center justify-between text-xs text-slate-400 px-1 font-medium overflow-x-auto gap-1">
          <span className={currentStage === 1 ? 'text-white font-bold' : ''}>1. Brute</span>
          <span className={currentStage === 2 ? 'text-red-400 font-bold' : ''}>2. Élément ROUGE</span>
          <span className={currentStage === 3 ? 'text-amber-400 font-bold' : ''}>3. Déplacement</span>
          <span className={currentStage === 4 ? 'text-rose-400 font-bold' : ''}>4. Remplacements</span>
          <span className={currentStage === 5 ? 'text-emerald-400 font-bold' : ''}>
            {totalStages === 6 ? '5. Réduction' : '5. Forme finale'}
          </span>
          {totalStages === 6 && (
            <span className={currentStage === 6 ? 'text-emerald-400 font-bold' : ''}>6. Finale</span>
          )}
        </div>

        {/* Mobile Active Stage Indicator */}
        <div className="sm:hidden flex items-center justify-between text-xs font-bold px-1 text-white">
          <span className="text-slate-400">Étape {currentStage}/{totalStages}</span>
          <span className="text-red-400 font-mono text-[11px] truncate max-w-[200px]">
            {currentStage === 1 && '1. Expression brute'}
            {currentStage === 2 && '2. Élément en ROUGE'}
            {currentStage === 3 && '3. Déplacement animé'}
            {currentStage === 4 && '4. Remplacements explicites'}
            {currentStage === 5 && (totalStages === 6 ? '5. Réduction des termes' : '5. Forme finale')}
            {currentStage === 6 && '6. Forme finale'}
          </span>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {Array.from({ length: totalStages }, (_, i) => i + 1).map((stepNum) => (
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
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
              title={`Étape ${stepNum}`}
            />
          ))}
        </div>
      </div>

      {/* MAIN DYNAMIC ANIMATION ARENA */}
      <div className="relative min-h-[340px] sm:min-h-[400px] bg-slate-950/90 rounded-2xl border border-slate-800/80 p-3 sm:p-6 flex flex-col items-center justify-center overflow-hidden shadow-inner w-full">
        {/* Decorative background grid */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(239,68,68,0.3) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* ANIMATED BLOCKS CONTAINER */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedPresetId}-${currentStage}-${animationKey}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-2xl flex flex-col items-center justify-center space-y-4 sm:space-y-6 z-10"
          >
            {/* STAGE BADGE INDICATOR */}
            <div className="flex items-center space-x-2 text-center">
              <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider sm:tracking-widest px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 shadow">
                Étape {currentStage} :{' '}
                {currentStage === 1 && "Expression brute"}
                {currentStage === 2 && "Facteur distributeur en ROUGE"}
                {currentStage === 3 && "Déplacement & Duplication visible"}
                {currentStage === 4 && "Termes remplacés en ROUGE"}
                {currentStage === 5 && (totalStages === 6 ? "Réduction des termes semblables" : "Forme finale développée")}
                {currentStage === 6 && "Forme finale développée"}
              </span>
            </div>

            {/* --- VISUAL STAGE 1: RAW EXPRESSION BLOCKS --- */}
            {currentStage === 1 && (
              <div className="flex items-center justify-center gap-3 p-3 sm:p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl max-w-full overflow-x-auto">
                <motion.div
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-slate-800 text-slate-100 font-mono text-lg sm:text-2xl font-bold border border-slate-700 shadow-md"
                >
                  <MathView latex={activeProblem.expressionLatex} display={false} />
                </motion.div>
              </div>
            )}

            {/* --- VISUAL STAGE 2: DISTRIBUTING ELEMENT IN RED --- */}
            {currentStage === 2 && (
              <div className="flex flex-col items-center space-y-3 max-w-full">
                <div className="flex flex-wrap items-center justify-center gap-2 p-3 sm:p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl max-w-full overflow-x-auto">
                  {/* Distributor in bright RED */}
                  <motion.div
                    initial={{ scale: 0.8, backgroundColor: '#1e293b' }}
                    animate={{ scale: [1, 1.2, 1], backgroundColor: '#ef4444' }}
                    transition={{ duration: 0.6, repeat: 1 }}
                    className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-mono text-lg sm:text-3xl font-black text-white shadow-xl ring-4 ring-red-500/50 shrink-0"
                  >
                    {activeProblem.distributorItem}
                  </motion.div>

                  <span className="text-lg sm:text-2xl font-mono text-slate-400">×</span>

                  {/* Parenthesis content */}
                  <div className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-800 font-mono text-base sm:text-2xl font-bold text-slate-200 border border-slate-700 max-w-full overflow-x-auto">
                    ({activeProblem.termsInside.join(' + ').replace(/\+ -/g, '- ')})
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs text-red-400 font-semibold bg-red-950/40 px-3.5 py-1.5 rounded-full border border-red-500/30 shadow">
                  <Sparkles className="w-3.5 h-3.5 text-red-400" />
                  <span>Élément distributeur identifié en ROUGE : </span>
                  <span className="font-mono font-bold text-white bg-red-600 px-2 py-0.5 rounded">
                    {activeProblem.distributorItem}
                  </span>
                </div>
              </div>
            )}

            {/* --- VISUAL STAGE 3: VISIBLE GLIDING / MOTION (DUPLICATION) --- */}
            {currentStage === 3 && (
              <div className="flex flex-col items-center space-y-2 w-full max-w-xl mx-auto">
                {/* 1. ORIGIN TIER: Expression with the red distributing factor */}
                <div className="w-full bg-slate-900/90 rounded-xl border border-slate-800 p-3 shadow-md">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2">
                    Position de départ : facteur distributeur en ROUGE
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 px-2">
                    <motion.div
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="px-3 py-1.5 rounded-xl bg-red-600 font-mono text-base sm:text-xl font-black text-white shadow-lg ring-2 ring-red-400 shrink-0"
                    >
                      {activeProblem.distributorItem}
                    </motion.div>
                    <span className="text-lg font-mono text-slate-400">×</span>
                    <div className="px-3 py-1.5 rounded-xl bg-slate-800 font-mono text-sm sm:text-lg text-slate-200 border border-slate-700">
                      ({activeProblem.termsInside.join(' + ').replace(/\+ -/g, '- ')})
                    </div>
                  </div>
                </div>

                {/* 2. DEDICATED VECTOR CONNECTOR: Arcs distributing from left factor into both destination products */}
                <div className="w-full h-16 sm:h-20 relative flex items-center justify-center my-0.5">
                  <svg className="w-full h-full" viewBox="0 0 500 70" preserveAspectRatio="none">
                    <defs>
                      <marker
                        id="arrow-dev-stage3"
                        markerWidth="8"
                        markerHeight="8"
                        refX="6"
                        refY="4"
                        orient="auto"
                      >
                        <polygon points="0 0, 8 4, 0 8" fill="#ef4444" />
                      </marker>
                    </defs>

                    {/* Arrow 1: Arc to the first product */}
                    <motion.path
                      d="M 140 2 C 140 30, 140 40, 140 62"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="3.5"
                      strokeDasharray="6,4"
                      markerEnd="url(#arrow-dev-stage3)"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.7 }}
                    />

                    {/* Arrow 2: Arc distributing further to the second product */}
                    <motion.path
                      d="M 160 2 C 200 20, 320 25, 360 62"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="3.5"
                      strokeDasharray="6,4"
                      markerEnd="url(#arrow-dev-stage3)"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />

                    {/* Central guidance badge text */}
                    <rect x="180" y="20" width="160" height="20" rx="10" fill="#450a0a" stroke="#ef4444" strokeWidth="1" />
                    <text x="260" y="34" fill="#fca5a5" fontSize="10" fontWeight="bold" textAnchor="middle">
                      Distribution sur chaque terme ↘ ↘
                    </text>
                  </svg>
                </div>

                {/* 3. DESTINATION TIER: Both distributed products displaying the red duplicated distributor */}
                <div className="w-full bg-slate-900/90 rounded-2xl border-2 border-red-500/50 p-3 sm:p-4 shadow-xl shadow-red-950/40">
                  <div className="text-[11px] font-bold text-red-300 uppercase tracking-wider text-center mb-2">
                    Position d'arrivée : le facteur rouge est distribué sur chaque terme
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {/* First product */}
                    <div className="flex items-center space-x-1 p-2 bg-slate-950/90 rounded-xl border border-red-500/40 shadow-md">
                      <motion.span
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-mono text-sm sm:text-base font-black shadow ring-2 ring-red-400"
                      >
                        {activeProblem.distributorItem.split(' ')[0]}
                      </motion.span>
                      <span className="text-slate-400 font-mono">×</span>
                      <span className="px-2 py-1 rounded-lg bg-slate-800 text-sky-300 font-mono text-sm sm:text-base font-bold border border-slate-700">
                        {activeProblem.termsInside[0]}
                      </span>
                    </div>

                    <span className="text-xl font-bold text-slate-400 font-mono">+</span>

                    {/* Second product */}
                    <div className="flex items-center space-x-1 p-2 bg-slate-950/90 rounded-xl border border-red-500/40 shadow-md">
                      <motion.span
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.15 }}
                        className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-mono text-sm sm:text-base font-black shadow ring-2 ring-red-400"
                      >
                        {activeProblem.distributorItem.split(' ')[0]}
                      </motion.span>
                      <span className="text-slate-400 font-mono">×</span>
                      <span className="px-2 py-1 rounded-lg bg-slate-800 text-amber-300 font-mono text-sm sm:text-base font-bold border border-slate-700">
                        {activeProblem.termsInside[1]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Educational Banner */}
                <div className="text-xs text-amber-300 font-medium bg-amber-950/40 px-3.5 py-1.5 rounded-full border border-amber-500/30 flex items-center space-x-2 mt-1">
                  <ArrowRight className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    L'élément rouge a atterri sur chaque terme : rien n'a disparu, tous les produits sont posés !
                  </span>
                </div>
              </div>
            )}

            {/* --- VISUAL STAGE 4: TERMS TO REPLACE HIGHLIGHTED IN RED WITH CARDS --- */}
            {currentStage === 4 && (
              <div className="flex flex-col items-center space-y-4 w-full">
                <div className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-red-400" />
                  <span>Mise en ROUGE des termes remplacés (avant calcul) :</span>
                </div>

                {/* Replacement Badges Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
                  {activeProblem.replacedTermsBadges.map((badge, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.15 }}
                      className="p-3.5 rounded-xl bg-slate-950/90 border border-red-500/50 shadow-lg flex flex-col space-y-2 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 bg-red-600 text-[10px] text-white font-mono px-2 py-0.5 rounded-bl-lg font-bold uppercase">
                        Remplacement #{idx + 1}
                      </div>

                      <div className="flex items-center space-x-2 pt-1">
                        <span className="text-xs text-slate-400 font-medium">À remplacer :</span>
                        <span className="px-2 py-1 rounded bg-red-950 border border-red-500 text-red-300 font-mono font-black text-sm">
                          {badge.originalProduct}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-slate-400 font-medium">Remplacé par :</span>
                        <span className="px-2 py-1 rounded bg-emerald-950 border border-emerald-500 text-emerald-300 font-mono font-black text-sm">
                          {badge.calculatedResult}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 italic">
                        {badge.rule}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Resulting Expression after replacement */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono text-base sm:text-lg font-bold text-white">
                  = <MathView latex={activeProblem.finalExpandedLatex} display={false} />
                </div>
              </div>
            )}

            {/* --- VISUAL STAGE 5 (REDUCTION FOR 6-STAGE PROBLEMS) --- */}
            {currentStage === 5 && totalStages === 6 && (
              <div className="flex flex-col items-center space-y-4 w-full">
                <div className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-red-400" />
                  <span>Regroupement des termes semblables mis en ROUGE :</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-center gap-2 text-lg sm:text-xl font-mono font-bold">
                  {/* First term */}
                  <span className="text-slate-300">
                    {activeProblem.finalExpandedLatex.split('+')[0].split('-')[0].trim()}
                  </span>

                  {/* Middle terms highlighted in red */}
                  <motion.span
                    initial={{ scale: 0.95 }}
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="px-3 py-1.5 rounded-xl bg-red-950 border-2 border-red-500 text-red-300 font-black shadow-lg"
                  >
                    Termes en x à réduire
                  </motion.span>

                  {/* Last constant */}
                  <span className="text-slate-400">
                    ...
                  </span>
                </div>

                <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-200 max-w-lg text-center">
                  On remplace les termes en x par leur somme algébrique directe, sans aucune perte !
                </div>
              </div>
            )}

            {/* --- VISUAL FINAL STAGE: FINAL EXPANDED & REDUCED FORM --- */}
            {((currentStage === 5 && totalStages === 5) || (currentStage === 6 && totalStages === 6)) && (
              <div className="flex flex-col items-center space-y-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 150 }}
                  className="p-5 rounded-2xl bg-gradient-to-r from-red-950/60 via-slate-900 to-emerald-950/60 border border-emerald-500/50 shadow-2xl text-center flex flex-col items-center"
                >
                  <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Forme développée et réduite finale
                  </span>
                  <div className="text-2xl sm:text-4xl font-extrabold text-white font-mono py-2">
                    <MathView latex={activeProblem.finalReducedLatex} display={true} />
                  </div>
                </motion.div>

                {/* Summary Card with full history */}
                <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-300 space-y-1.5 text-center max-w-md">
                  <div className="text-emerald-400 font-bold">Bilan du développement :</div>
                  <div className="font-mono text-slate-200">
                    <MathView latex={`${activeProblem.expressionLatex} = ${activeProblem.finalReducedLatex}`} display={false} />
                  </div>
                  <p className="text-[11px] text-slate-400 pt-1">
                    Toutes les parenthèses sont levées, chaque terme calculé a été justifié en rouge, et l'expression est irréductible.
                  </p>
                </div>
              </div>
            )}

            {/* LaTeX Mathematical Formula Sync */}
            <div className="w-full max-w-xl p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-center">
              <div className="text-[11px] font-mono uppercase text-slate-400 mb-1">
                Ligne de calcul rigoureuse
              </div>
              <div className="text-lg sm:text-xl font-bold text-white overflow-x-auto">
                {currentStage === 1 && <MathView latex={activeProblem.expressionLatex} display={false} />}
                {currentStage === 2 && (
                  <MathView
                    latex={`= {\\color{red}${activeProblem.distributorItem}} \\cdot (${activeProblem.termsInside.join(' + ').replace(/\+ -/g, '- ')})`}
                    display={false}
                  />
                )}
                {currentStage === 3 && <MathView latex={`= ${activeProblem.intermediateProductsLatex}`} display={false} />}
                {currentStage === 4 && <MathView latex={`= ${activeProblem.termsToReplaceStepLatex} = ${activeProblem.finalExpandedLatex}`} display={false} />}
                {currentStage === 5 && totalStages === 6 && (
                  <MathView latex={`= ${activeProblem.finalExpandedLatex} = ${activeProblem.finalReducedLatex}`} display={false} />
                )}
                {((currentStage === 5 && totalStages === 5) || (currentStage === 6 && totalStages === 6)) && (
                  <MathView latex={`= ${activeProblem.finalReducedLatex}`} display={false} />
                )}
              </div>
            </div>

            {/* Pedagogical Step Explanation */}
            <div className="max-w-xl text-center px-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
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
              ? 'bg-slate-800/40 text-slate-600 cursor-not-allowed border border-slate-800/50'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Étape précédente</span>
        </button>

        <button
          onClick={() => {
            setCurrentStage((prev) => Math.min(totalStages, prev + 1));
            setIsPlaying(false);
          }}
          disabled={currentStage === totalStages}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl font-medium text-xs sm:text-sm transition-all shadow-xs ${
            currentStage === totalStages
              ? 'bg-white text-black border-2 border-black font-bold dark:bg-emerald-700/60 dark:text-emerald-200 border border-neutral-300 dark:border-emerald-600/50'
              : 'bg-white hover:bg-neutral-100 text-black border-2 border-black font-bold dark:bg-red-600 dark:hover:bg-red-500 dark:text-white'
          }`}
        >
          <span>{currentStage === totalStages ? 'Développement achevé' : 'Étape suivante'}</span>
          {currentStage !== totalStages ? <ChevronRight className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Sandbox Bridge */}
      {onOpenAlgebraSolver && (
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => onOpenAlgebraSolver(activeProblem.expressionLatex)}
            className="text-xs text-red-400 hover:text-red-300 font-semibold underline flex items-center space-x-1"
          >
            <span>Ouvrir ce développement dans le bac à sable de calcul complet</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
