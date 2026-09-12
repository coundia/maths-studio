import React, { useState } from 'react';
import { MathView } from './MathView';
import { 
  BookOpen, 
  Zap, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Play, 
  ChevronDown, 
  ChevronUp,
  Bookmark,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ReminderRule {
  id: string;
  title: string;
  formulaLatex: string;
  explanation: string;
  goldenRule?: string;
  trapWarning?: string;
  exampleExpr: string;
  exampleOp: 'expansion' | 'factorization';
  exampleResultLatex: string;
}

interface ReminderCategory {
  id: string;
  label: string;
  icon: string;
  badge: string;
  description: string;
  rules: ReminderRule[];
}

const REMINDER_CATEGORIES: ReminderCategory[] = [
  {
    id: 'powers',
    label: 'Calculs de Puissances',
    icon: '',
    badge: '4ème & 3ème',
    description: 'Propriétés fondamentales des puissances, monômes et pièges de signes',
    rules: [
      {
        id: 'pow-product',
        title: 'Produit de puissances de même base',
        formulaLatex: 'x^a \\times x^b = x^{a+b}',
        explanation: 'Quand on multiplie deux puissances de x, on additionne les exposants. En particulier, x \\times x = x^1 \\times x^1 = x^2.',
        goldenRule: 'Pour les monômes avec coefficients : (3x^2) \\times (4x^3) = (3 \\times 4) \\times (x^2 \\times x^3) = 12x^5.',
        trapWarning: 'Attention : x + x = 2x, mais x \\times x = x^2 ! Ne confondez jamais addition et multiplication.',
        exampleExpr: '(x+2)(x+3)',
        exampleOp: 'expansion',
        exampleResultLatex: 'x^2 + 5x + 6',
      },
      {
        id: 'pow-parentheses-signs',
        title: 'Le Piège Majeur : (-a)² contre -a²',
        formulaLatex: '(-a)^2 = +a^2 \\quad \\text{mais} \\quad -a^2 = -(a \\times a)',
        explanation: 'Les parenthèses changent tout ! Si le signe moins est dans la parenthèse, il est lui aussi élevé au carré : (-3)^2 = (-3) \\times (-3) = +9. Sans parenthèse, la puissance s\'applique avant le signe : -3^2 = -(3 \\times 3) = -9.',
        goldenRule: '(-x)^n est positif si n est PAIR, et négatif si n est IMPAIR : (-2)^2 = +4, mais (-2)^3 = -8.',
        trapWarning: 'Dans une distributivité comme -3(2x - 5), le -3 multiplie chaque terme avec son signe propre !',
        exampleExpr: '(x-3)^2',
        exampleOp: 'expansion',
        exampleResultLatex: 'x^2 - 6x + 9',
      },
      {
        id: 'pow-product-power',
        title: 'Puissance d\'un produit de facteurs',
        formulaLatex: '(a \\times b)^n = a^n \\times b^n',
        explanation: 'L\'exposant s\'applique à TOUS les facteurs à l\'intérieur de la parenthèse sans exception.',
        goldenRule: '(2x)^2 = 2^2 \\times x^2 = 4x^2, et (3x)^2 = 9x^2. C\'est crucial pour les identités remarquables !',
        trapWarning: 'Erreur classique : écrire (2x)^2 = 2x^2 en oubliant de mettre le coefficient 2 au carré.',
        exampleExpr: '(2x+1)(2x-1)',
        exampleOp: 'expansion',
        exampleResultLatex: '4x^2 - 1',
      },
      {
        id: 'pow-power-of-power',
        title: 'Puissance d\'une puissance & Quotients',
        formulaLatex: '(x^a)^b = x^{a \\times b} \\quad \\text{et} \\quad \\frac{x^a}{x^b} = x^{a-b}',
        explanation: 'Pour une puissance de puissance, on multiplie les exposants. Pour un quotient de même base, on soustrait l\'exposant du bas.',
        goldenRule: 'x^0 = 1 (pour x ≠ 0) et x^{-n} = \\frac{1}{x^n}. Ex : (x^3)^2 = x^6.',
        trapWarning: '(x^2)^3 = x^6, ce n\'est pas x^5 ! (On multiplie 2 × 3 = 6).',
        exampleExpr: '(x+1)(x+4)',
        exampleOp: 'expansion',
        exampleResultLatex: 'x^2 + 5x + 4',
      },
    ],
  },
  {
    id: 'signs',
    label: 'Règles de Signes dans ℤ',
    icon: '️',
    badge: 'Base 4ème/3ème',
    description: 'La règle des signes, soustractions d\'entiers relatifs et parenthèses précédées de -',
    rules: [
      {
        id: 'signs-multiplication',
        title: 'Règle d\'or de la multiplication des signes',
        formulaLatex: '(-) \\times (-) = (+) \\quad \\text{et} \\quad (+) \\times (-) = (-)',
        explanation: 'Le produit de deux nombres de MÊME signe est toujours POSITIF (+). Le produit de deux nombres de signes CONTRAIRES est toujours NÉGATIF (-).',
        goldenRule: 'Pour un produit de plusieurs facteurs : s\'il y a un nombre PAIR de signes (-), le résultat est (+). S\'il y a un nombre IMPAIR, le résultat est (-).',
        trapWarning: 'Attention dans (x - 2)(x - 3) : le dernier produit est (-2) × (-3) = +6 (et non pas -6 !).',
        exampleExpr: '(x-2)(x-3)',
        exampleOp: 'expansion',
        exampleResultLatex: 'x^2 - 5x + 6',
      },
      {
        id: 'signs-brackets-minus',
        title: 'Parenthèses précédées d\'un signe moins (-)',
        formulaLatex: '-(a - b) = -a + b \\quad \\text{et} \\quad A - (B \\times C) = A - [BC]',
        explanation: 'Un signe moins devant une parenthèse ou un crochet change TOUS les signes à l\'intérieur lorsqu\'on supprime les parenthèses.',
        goldenRule: 'Conseil méthode : quand vous développez après un signe moins, gardez toujours un CROCHET protecteur : - (x+1)(x+2) = - [x^2 + 3x + 2] = -x^2 - 3x - 2.',
        trapWarning: 'Ne changez pas seulement le premier signe ! Tous les termes doivent inverser leur signe.',
        exampleExpr: '(x+1)(x-2)',
        exampleOp: 'expansion',
        exampleResultLatex: 'x^2 - x - 2',
      },
    ],
  },
  {
    id: 'distributivity',
    label: 'Développement & Distributivité',
    icon: '',
    badge: '4ème & 3ème',
    description: 'Simple et double distributivité, gestion des monômes et réductions',
    rules: [
      {
        id: 'distrib-simple',
        title: 'Simple distributivité (Monôme × Polynôme)',
        formulaLatex: 'k(a + b) = ka + kb \\quad \\text{et} \\quad k(a - b) = ka - kb',
        explanation: 'Le facteur k extérieur est distribué (multiplié) à chaque terme de l\'intérieur de la parenthèse.',
        goldenRule: 'Exemple avec monôme en x : 3x(2x - 5) = (3x \\times 2x) - (3x \\times 5) = 6x^2 - 15x.',
        trapWarning: 'N\'oubliez pas de multiplier aussi la variable : 3x × 2x = 6x^2 (les x se multiplient entre eux).',
        exampleExpr: '3x + 6',
        exampleOp: 'factorization',
        exampleResultLatex: '3(x + 2)',
      },
      {
        id: 'distrib-double',
        title: 'Double distributivité (Binôme × Binôme)',
        formulaLatex: '(a + b)(c + d) = a \\times c + a \\times d + b \\times c + b \\times d',
        explanation: 'On trace 4 flèches de multiplication : chaque terme de la 1ère parenthèse rencontre chaque terme de la 2ème parenthèse.',
        goldenRule: 'Étapes rigoureuses : 1. Distribuer les 4 produits ; 2. Calculer chaque produit ; 3. Réduire les termes semblables en x.',
        trapWarning: 'Ne regroupez ensemble QUE les termes de même puissance : x^2 avec x^2, x avec x, constantes avec constantes.',
        exampleExpr: '(2x+1)(x+3)',
        exampleOp: 'expansion',
        exampleResultLatex: '2x^2 + 7x + 3',
      },
    ],
  },
  {
    id: 'identities',
    label: 'Identités Remarquables',
    icon: '',
    badge: '3ème BFEM',
    description: 'Les 3 formules incontournables du brevet sénégalais',
    rules: [
      {
        id: 'id-sum-square',
        title: '1ère Identité : Carré d\'une somme',
        formulaLatex: '(a + b)^2 = a^2 + 2ab + b^2',
        explanation: 'Le carré d\'une somme donne 3 termes : le carré du premier, le double produit, et le carré du second.',
        goldenRule: 'Double produit : 2 × a × b. Pour (x + 3)^2, le terme central est 2 × x × 3 = 6x.',
        trapWarning: 'Le piège classique n°1 au BFEM : écrire (a+b)^2 = a^2 + b^2 en OUBLIANT le double produit 2ab !',
        exampleExpr: '(x+3)^2',
        exampleOp: 'expansion',
        exampleResultLatex: 'x^2 + 6x + 9',
      },
      {
        id: 'id-diff-square',
        title: '2ème Identité : Carré d\'une différence',
        formulaLatex: '(a - b)^2 = a^2 - 2ab + b^2',
        explanation: 'Le terme central a un signe moins (-2ab), mais le dernier terme b^2 reste toujours POSITIF car (-b)^2 = +b^2.',
        goldenRule: 'Exemple : (2x - 3)^2 = (2x)^2 - 2(2x)(3) + 3^2 = 4x^2 - 12x + 9.',
        trapWarning: 'Attention : (2x)^2 donne 4x^2 et non 2x^2.',
        exampleExpr: '(x-3)^2',
        exampleOp: 'expansion',
        exampleResultLatex: 'x^2 - 6x + 9',
      },
      {
        id: 'id-conjugate',
        title: '3ème Identité : Produit de la somme par la différence',
        formulaLatex: '(a - b)(a + b) = a^2 - b^2',
        explanation: 'Les termes croisés s\'annulent (+ab et -ab = 0). Il ne reste que la différence de deux carrés.',
        goldenRule: 'Idéale pour factoriser instantanément : a^2 - b^2 = (a - b)(a + b).',
        trapWarning: 'Vérifiez bien que vous avez deux carrés séparés par un signe MOINS. a^2 + b^2 ne se factorise pas dans ℝ !',
        exampleExpr: 'x^2 - 9',
        exampleOp: 'factorization',
        exampleResultLatex: '(x - 3)(x + 3)',
      },
    ],
  },
  {
    id: 'factorization',
    label: 'Techniques de Factorisation',
    icon: '',
    badge: '3ème BFEM',
    description: 'Recherche du facteur commun et factorisation par identités remarquables',
    rules: [
      {
        id: 'fact-common',
        title: 'Recherche du Facteur Commun',
        formulaLatex: 'ka + kb = k(a + b) \\quad \\text{et} \\quad ka - kb = k(a - b)',
        explanation: 'On décompose chaque terme pour faire apparaître un même facteur k (nombre, lettre ou parenthèse entière).',
        goldenRule: 'Quand un terme entier est mis en facteur, il reste 1 ! Exemple : (x+2)^2 + (x+2) = (x+2)[(x+2) + 1] = (x+2)(x+3).',
        trapWarning: 'Ne laissez jamais un terme vide quand vous le mettez en facteur : k \\times 1 = k.',
        exampleExpr: '3x + 6',
        exampleOp: 'factorization',
        exampleResultLatex: '3(x + 2)',
      },
      {
        id: 'fact-diff-squares',
        title: 'Différence de deux carrés',
        formulaLatex: 'a^2 - b^2 = (a - b)(a + b)',
        explanation: 'Écrire chaque bloc sous forme de carré : 4x^2 - 25 = (2x)^2 - 5^2, donc a = 2x et b = 5.',
        goldenRule: 'Identification des carrés parfaits fréquents : 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144.',
        trapWarning: 'Pour 9x^2 - 16, écrivez d\'abord (3x)^2 - 4^2 pour ne pas vous tromper sur la valeur de a.',
        exampleExpr: 'x^2 - 9',
        exampleOp: 'factorization',
        exampleResultLatex: '(x - 3)(x + 3)',
      },
    ],
  },
];

interface AlgebraRemindersSectionProps {
  onSelectExample: (expr: string, op: string) => void;
  isOpenDefault?: boolean;
}

export const AlgebraRemindersSection: React.FC<AlgebraRemindersSectionProps> = ({
  onSelectExample,
  isOpenDefault = false,
}) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  const [activeCategory, setActiveCategory] = useState<string>('powers');

  const selectedCategory =
    REMINDER_CATEGORIES.find((c) => c.id === activeCategory) || REMINDER_CATEGORIES[0];

  return (
    <div className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl transition-all">
      {/* Header Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-500 p-0.5 shadow-md shadow-emerald-500/10 flex items-center justify-center text-white shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Rappels de Cours & Règles Clés
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 rounded-full">
                4e & 3e BFEM
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Puissances, signes dans ℤ, identités remarquables et astuces de factorisation
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="self-start sm:self-auto flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-colors shadow-xs"
        >
          <span>{isOpen ? 'Masquer les fiches' : 'Afficher les fiches rappels'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="mt-4 space-y-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {REMINDER_CATEGORIES.map((cat) => {
              const isSelected = cat.id === activeCategory;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-2 border shrink-0 ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-transparent shadow-md shadow-indigo-500/20 scale-[1.02]'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-950/50 dark:hover:bg-slate-800 dark:text-slate-300 dark:border-slate-800'
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? 'bg-white/20 text-slate-900 dark:text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {cat.rules.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Category Description Banner */}
          <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-indigo-900 dark:text-indigo-200">
              <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0" />
              <span>{selectedCategory.description}</span>
            </div>
            <span className="hidden sm:inline text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-white/80 dark:bg-slate-900 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
              {selectedCategory.badge}
            </span>
          </div>

          {/* Rules Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedCategory.rules.map((rule) => (
              <div
                key={rule.id}
                className="bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Title */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Bookmark className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                      <span>{rule.title}</span>
                    </h4>
                  </div>

                  {/* Formula Callout */}
                  <div className="my-2.5 p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800/70 text-center overflow-x-auto">
                    <MathView latex={rule.formulaLatex} display={true} />
                  </div>

                  {/* Explanation */}
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {rule.explanation}
                  </p>

                  {/* Golden Rule */}
                  {rule.goldenRule && (
                    <div className="mt-2.5 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-start space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Règle d'or : </span>
                        <span>{rule.goldenRule}</span>
                      </div>
                    </div>
                  )}

                  {/* Trap Warning */}
                  {rule.trapWarning && (
                    <div className="mt-2 p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-[11px] text-amber-800 dark:text-amber-300 flex items-start space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Attention au piège : </span>
                        <span>{rule.trapWarning}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Action: Test this example in the solver */}
                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    <span>Ex : </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{rule.exampleExpr}</span>
                    <span className="mx-1 text-slate-600 dark:text-slate-400">→</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{rule.exampleResultLatex}</span>
                  </div>

                  <button
                    onClick={() => onSelectExample(rule.exampleExpr, rule.exampleOp)}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all hover:scale-105 active:scale-95 shadow-xs"
                    title={`Tester ${rule.exampleExpr} dans le solveur pas-à-pas`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Tester</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
