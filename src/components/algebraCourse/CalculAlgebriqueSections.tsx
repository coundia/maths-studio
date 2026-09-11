import React, { useState } from 'react';
import { MathView } from '../MathView';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Lightbulb,
  Zap,
  ChevronRight,
  ArrowRight,
  Calculator,
  Target,
  ShieldAlert,
  Layers,
  Sparkles,
  TrendingUp,
  FileText,
  Check,
  RotateCcw,
} from 'lucide-react';

export interface CourseSectionMeta {
  id: number;
  number: string;
  title: string;
  badge: string;
}

export const COURSE_SECTIONS: CourseSectionMeta[] = [
  {
    id: 1,
    number: 'I',
    title: "Notion d'expression littérale, vocabulaire & modélisation",
    badge: 'Bases & Vocabulaire',
  },
  {
    id: 2,
    number: 'II',
    title: "Valeur numérique, Calcul de Puissances & Piège crucial de -x² vs (-x)²",
    badge: 'Puissances & Remplacement',
  },
  {
    id: 3,
    number: 'III',
    title: 'Règles de calcul dans Z (Moins × Moins = Plus) & Suppression des parenthèses',
    badge: "Règles des signes dans Z",
  },
  {
    id: 4,
    number: 'IV',
    title: 'Réduction par termes semblables & Ordonnancement',
    badge: 'Familles de monômes',
  },
  {
    id: 5,
    number: 'V',
    title: 'Développement : Distributivité simple, double & crochet protecteur',
    badge: 'Règle des 4 flèches & Pièges',
  },
  {
    id: 6,
    number: 'VI',
    title: 'Les 3 Identités Remarquables & Calcul mental rapide',
    badge: 'Formules clés & Astuces',
  },
  {
    id: 7,
    number: 'VII',
    title: 'Factorisation : Toutes les techniques de 4e (4 méthodes)',
    badge: 'Du produit à la somme',
  },
  {
    id: 8,
    number: 'VIII',
    title: 'Équations-produits nulles (A × B = 0) & Résolution de problèmes',
    badge: 'Propriété du produit nul',
  },
  {
    id: 9,
    number: 'IX',
    title: 'Boîte à outils, Fiche mémo & Astuces de vérification au devoir',
    badge: 'Spécial Contrôle & BFEM',
  },
];

interface CalculAlgebriqueSectionsProps {
  activeSection: number;
  setActiveSection: (id: number) => void;
  onNavigateSubTab: (tab: 'moteur-developpement' | 'moteur-factorisation' | 'labo-visuel' | 'calculateur-valeur') => void;
}

export const CalculAlgebriqueSections: React.FC<CalculAlgebriqueSectionsProps> = ({
  activeSection,
  setActiveSection,
  onNavigateSubTab,
}) => {
  // Verification Sandbox state for Section IX
  const [testExprInit, setTestExprInit] = useState<string>('(2*x + 3)*(x - 4)');
  const [testExprDev, setTestExprDev] = useState<string>('2*x^2 - 5*x - 12');
  const [testValueX, setTestValueX] = useState<number>(2);

  // Power Calculation Interactive Sandbox state for Section II
  const [powerBase, setPowerBase] = useState<number>(-3);
  const [powerExp, setPowerExp] = useState<number>(2);
  const [powerHasParen, setPowerHasParen] = useState<boolean>(true);

  // Z-Rules Interactive Sandbox state for Section III
  const [zNumA, setZNumA] = useState<number>(-4);
  const [zNumB, setZNumB] = useState<number>(-5);
  const [zOp, setZOp] = useState<'mul' | 'sub'>('mul');

  // Computed values for Power Sandbox
  const isPowerNegBase = powerBase < 0;
  const isPowerEvenExp = Math.abs(powerExp) % 2 === 0;
  const powerAbsBase = Math.abs(powerBase);
  const powerResParen = Math.pow(powerBase, powerExp);
  const powerResParenFmt = Number.isInteger(powerResParen) ? String(powerResParen) : powerResParen.toFixed(4);
  const powerResNoParen = -Math.pow(powerAbsBase, powerExp);
  const powerResNoParenFmt = Number.isInteger(powerResNoParen) ? String(powerResNoParen) : powerResNoParen.toFixed(4);
  const powerLatexParen = `(${powerBase})^{${powerExp}} = ${powerResParenFmt}`;
  const powerLatexDetailNeg = `(${powerBase})^{${powerExp}} = \\frac{1}{(${powerBase})^{${Math.abs(powerExp)}}}`;
  const powerLatexNoParen = `-${powerAbsBase}^{${powerExp}} = -(${powerAbsBase}^{${powerExp}}) = ${powerResNoParenFmt}`;

  // Computed values for Z-Rules Sandbox
  const zProd = zNumA * zNumB;
  const zProdStr = zProd > 0 ? `+${zProd}` : `${zProd}`;
  const zBothNeg = zNumA < 0 && zNumB < 0;
  const zDiffSigns = (zNumA < 0 && zNumB > 0) || (zNumA > 0 && zNumB < 0);
  const zProdLatex = `(${zNumA}) \\times (${zNumB}) = ${zProdStr}`;
  const zDiff = zNumA - zNumB;
  const zIsBMinus = zNumB < 0;
  const zSubSecondTerm = zIsBMinus ? `+ ${Math.abs(zNumB)}` : `- ${zNumB}`;
  const zSubLatex = `(${zNumA}) - (${zNumB}) = ${zNumA} ${zSubSecondTerm} = ${zDiff}`;
  const zBOppositeLatex = `-${zNumB}`;

  const evalSimple = (expr: string, val: number): number | null => {
    try {
      const sanitized = expr
        .replace(/x/g, `(${val})`)
        .replace(/\^/g, '**');
      // eslint-disable-next-line no-new-func
      const res = Function(`"use strict"; return (${sanitized})`)();
      return typeof res === 'number' && !isNaN(res) ? res : null;
    } catch {
      return null;
    }
  };

  const valInit = evalSimple(testExprInit, testValueX);
  const valDev = evalSimple(testExprDev, testValueX);
  const isMatch = valInit !== null && valDev !== null && Math.abs(valInit - valDev) < 0.0001;

  return (
    <div className="flex flex-col space-y-5">
      {/* SECTION 1 */}
      {activeSection === 1 && (
        <div className="flex flex-col space-y-5 animate-fade-in">
          <div className="border-b border-neutral-200 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                Chapitre IV • Section 1
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
                Fondations du Calcul Littéral
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mt-1">
              I. Notion d'expression littérale, vocabulaire & modélisation
            </h2>
          </div>

          {/* 1. Définition et utilité - Explanations styled in VERT */}
          <div className="bg-emerald-50/90 border border-emerald-300 text-emerald-950 dark:bg-slate-950/80 dark:border-slate-800 dark:text-slate-300 p-4 sm:p-5 rounded-2xl space-y-3 shadow-xs">
            <h4 className="font-bold text-emerald-800 dark:text-emerald-400 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>1. Qu'est-ce qu'une expression littérale et pourquoi utiliser des lettres ?</span>
            </h4>
            <p className="text-xs sm:text-sm text-emerald-950 dark:text-slate-300 leading-relaxed">
              Une <strong className="text-emerald-900 dark:text-white font-bold">expression littérale</strong> (ou algébrique) est un calcul mathématique dans lequel un ou plusieurs nombres sont remplacés par des <strong className="text-emerald-700 dark:text-emerald-400 font-bold">lettres</strong> (généralement <MathView latex="x, y, a, b, n" display={false} />).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1 text-xs">
              {/* Rôle 1 styled in BLEU */}
              <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-950 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 space-y-1 shadow-xs">
                <span className="font-bold text-sky-800 dark:text-sky-400 block">Rôle 1 : Inconnue d'une équation</span>
                <p className="text-sky-950/90 dark:text-slate-400">
                  Désigne une valeur cachée qu'on cherche à déterminer : <MathView latex="2x + 5 = 15 \implies x = 5" display={false} />.
                </p>
              </div>
              {/* Rôle 2 styled in VERT */}
              <div className="p-3 rounded-xl bg-emerald-100/70 border border-emerald-200 text-emerald-950 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 space-y-1 shadow-xs">
                <span className="font-bold text-emerald-800 dark:text-emerald-400 block">Rôle 2 : Formule générale (Variable)</span>
                <p className="text-emerald-950/90 dark:text-slate-400">
                  Permet de calculer une grandeur pour n'importe quelle dimension : Périmètre <MathView latex="P = 2(L + l)" display={false} />.
                </p>
              </div>
              {/* Rôle 3 */}
              <div className="p-3 rounded-xl bg-white border border-emerald-200 text-neutral-800 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 space-y-1 shadow-xs">
                <span className="font-bold text-amber-700 dark:text-amber-400 block">Rôle 3 : Généralisation arithmétique</span>
                <p className="text-neutral-700 dark:text-slate-400">
                  Démontrer des propriétés universelles : tout nombre pair s'écrit <MathView latex="2n" display={false} />, tout impair <MathView latex="2n+1" display={false} />.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Modélisation de situations concrètes - Explanations styled in BLEU */}
          <div className="bg-sky-50/90 border border-sky-300 text-sky-950 dark:bg-slate-950/80 dark:border-indigo-500/30 dark:text-slate-300 p-4 sm:p-5 rounded-2xl space-y-3 shadow-xs">
            <h4 className="font-bold text-sky-800 dark:text-indigo-300 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-700 dark:text-indigo-400" />
              <span>2. Modélisation de problèmes concrets (Au cœur du programme de 4e)</span>
            </h4>
            <p className="text-xs sm:text-sm text-sky-950 dark:text-slate-300">
              En classe de 4ème et au BFEM, la première compétence évaluée est de savoir <strong className="text-sky-900 dark:text-white font-bold">traduire un problème en une expression littérale</strong> :
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Exemple Géométrique in VERT */}
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 dark:bg-slate-900/90 dark:border-slate-800 dark:text-slate-300 space-y-2 shadow-xs">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 block text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Exemple Géométrique : Cour d'école rectangulaire
                </span>
                <p className="text-emerald-950/90 dark:text-slate-300 text-[11px] leading-relaxed">
                  Une cour rectangulaire a pour longueur <MathView latex="x" display={false} /> mètres. Sa largeur mesure 4 mètres de moins que sa longueur.
                </p>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 font-mono text-[11px] text-emerald-800 dark:text-emerald-300 space-y-1 border border-emerald-200 dark:border-slate-800">
                  <div>Largeur : <MathView latex="l = x - 4" display={false} /></div>
                  <div>Périmètre : <MathView latex="P(x) = 2(x + x - 4) = 4x - 8" display={false} /></div>
                  <div>Aire : <MathView latex="A(x) = x(x - 4) = x^2 - 4x" display={false} /></div>
                </div>
              </div>

              {/* Exemple Sénégal in BLEU */}
              <div className="p-3.5 rounded-xl bg-sky-100/80 border border-sky-300 text-sky-950 dark:bg-slate-900/90 dark:border-slate-800 dark:text-slate-300 space-y-2 shadow-xs">
                <span className="font-bold text-sky-800 dark:text-sky-300 block text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  Exemple Vie Pratique au Sénégal : Tarif de transport
                </span>
                <p className="text-sky-950/90 dark:text-slate-300 text-[11px] leading-relaxed">
                  Un taxi urbain à Dakar facture une prise en charge forfaitaire de 500 FCFA puis 250 FCFA par kilomètre parcouru.
                </p>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 font-mono text-[11px] text-sky-800 dark:text-sky-300 space-y-1 border border-sky-200 dark:border-slate-800">
                  <div>Pour <MathView latex="x" display={false} /> km parcourus :</div>
                  <div className="text-sky-900 dark:text-white font-bold"><MathView latex="Prix(x) = 250x + 500 \text{ FCFA}" display={false} /></div>
                  <div>Pour 10 km : <MathView latex="Prix(10) = 250(10) + 500 = 3000 \text{ FCFA}" display={false} /></div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Vocabulaire précis du monôme et polynôme */}
          <div className="bg-white border border-neutral-200 text-neutral-800 dark:bg-slate-950/80 dark:border-slate-800 dark:text-slate-300 p-4 sm:p-5 rounded-2xl space-y-3 shadow-xs">
            <h4 className="font-bold text-neutral-900 dark:text-amber-400 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-amber-400" />
              <span>3. Vocabulaire technique rigoureux : Monôme, Degré et Polynôme</span>
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-neutral-800 dark:text-slate-300 border border-neutral-200 dark:border-slate-800">
                <thead className="bg-neutral-100 text-neutral-800 dark:bg-slate-900 dark:text-slate-200 font-semibold border-b border-neutral-200 dark:border-slate-800 text-[11px] uppercase">
                  <tr>
                    <th className="p-2.5">Terme</th>
                    <th className="p-2.5">Définition</th>
                    <th className="p-2.5">Exemples types</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-slate-800/60 font-mono text-[11px]">
                  <tr>
                    <td className="p-2.5 font-sans font-bold text-emerald-700 dark:text-emerald-400">Monôme</td>
                    <td className="p-2.5 font-sans text-neutral-700 dark:text-slate-300">Produit d'un coefficient numérique et de puissances de lettres.</td>
                    <td className="p-2.5 text-emerald-700 dark:text-emerald-300 dark:text-emerald-300">-7x², 4x, 15, 3ab</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-bold text-sky-700 dark:text-sky-400">Coefficient</td>
                    <td className="p-2.5 font-sans text-neutral-700 dark:text-slate-300">Le facteur numérique placé devant la partie littérale.</td>
                    <td className="p-2.5 text-sky-700 dark:text-sky-300">Dans -5x³, le coefficient est -5.</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-bold text-amber-700 dark:text-amber-400">Degré</td>
                    <td className="p-2.5 font-sans text-neutral-700 dark:text-slate-300">L'exposant de la lettre dans le monôme.</td>
                    <td className="p-2.5 text-amber-700 dark:text-amber-300">Dans 4x³, le degré est 3. Dans 2x, le degré est 1.</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-bold text-pink-700 dark:text-pink-400">Polynôme</td>
                    <td className="p-2.5 font-sans text-neutral-700 dark:text-slate-300">Somme algébrique de plusieurs monômes.</td>
                    <td className="p-2.5 text-pink-700 dark:text-pink-300">P(x) = 3x² - 5x + 2 (Trinôme du 2nd degré)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Conventions d'écriture obligatoires et pièges */}
          <div className="bg-white border border-neutral-200 text-neutral-800 dark:bg-slate-950/80 dark:border-slate-800 dark:text-slate-300 p-4 sm:p-5 rounded-2xl space-y-3 shadow-xs">
            <h4 className="font-bold text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm uppercase tracking-wide">
              4. Conventions d'écriture obligatoires en 4ème
            </h4>
            <p className="text-xs sm:text-sm text-neutral-700 dark:text-slate-300">
              Pour alléger les écritures, le symbole de multiplication <span className="text-amber-600 dark:text-amber-300 font-bold">×</span> est systématiquement omis :
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-neutral-800 dark:text-slate-200">
              <div className="p-2.5 bg-neutral-50 dark:bg-slate-900 rounded-lg border border-neutral-200 dark:border-slate-800">
                <span className="text-neutral-500 dark:text-slate-400 font-sans block text-[11px]">Entre un nombre et une lettre :</span>
                <MathView latex="3 \times x = 3x \quad \text{et} \quad -1 \times x = -x" display={false} />
              </div>
              <div className="p-2.5 bg-neutral-50 dark:bg-slate-900 rounded-lg border border-neutral-200 dark:border-slate-800">
                <span className="text-neutral-500 dark:text-slate-400 font-sans block text-[11px]">Devant une parenthèse :</span>
                <MathView latex="4 \times (x + 2) = 4(x + 2)" display={false} />
              </div>
              <div className="p-2.5 bg-neutral-50 dark:bg-slate-900 rounded-lg border border-neutral-200 dark:border-slate-800">
                <span className="text-neutral-500 dark:text-slate-400 font-sans block text-[11px]">Entre deux lettres :</span>
                <MathView latex="a \times b = ab \quad \text{et} \quad x \times y = xy" display={false} />
              </div>
              <div className="p-2.5 bg-neutral-50 dark:bg-slate-900 rounded-lg border border-neutral-200 dark:border-slate-800">
                <span className="text-neutral-500 dark:text-slate-400 font-sans block text-[11px]">Produits identiques (puissances) :</span>
                <MathView latex="x \times x = x^2 \quad \text{et} \quad x \times x \times x = x^3" display={false} />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 dark:bg-amber-950/30 dark:border-amber-500/40 dark:text-amber-200 text-xs flex items-start space-x-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="text-amber-900 dark:text-white block font-bold">Les 3 pièges d'écriture à bannir :</strong>
                <div>1. On n'omet <strong className="underline font-bold">JAMAIS</strong> le signe × entre deux chiffres : <MathView latex="2 \times 3 \neq 23" display={false} /> !</div>
                <div>2. On écrit toujours le nombre avant la lettre : on écrit <MathView latex="3x" display={false} /> et jamais <span className="line-through text-rose-600 dark:text-rose-300">x3</span>.</div>
                <div>3. <MathView latex="x + x = 2x" display={false} /> (addition de deux termes) alors que <MathView latex="x \times x = x^2" display={false} /> (produit) !</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2 */}
      {activeSection === 2 && (
        <div className="flex flex-col space-y-5 animate-fade-in">
          <div className="border-b border-neutral-200 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                Chapitre IV • Section 2
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30">
                Méthode & Rigueur
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mt-1">
              II. Valeur numérique d'une expression & Le piège de -x² vs (-x)²
            </h2>
          </div>

          {/* Méthode pas-à-pas - Explanations styled in VERT */}
          <div className="bg-emerald-50/90 border border-emerald-300 text-emerald-950 dark:bg-slate-950/80 dark:border-slate-800 dark:text-slate-300 p-4 sm:p-5 rounded-2xl space-y-3 shadow-xs">
            <h4 className="font-bold text-emerald-800 dark:text-emerald-400 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Méthode universelle en 3 étapes pour calculer une valeur numérique</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs text-emerald-950 dark:text-slate-300">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-slate-800 space-y-1 shadow-xs">
                <span className="font-bold text-emerald-900 dark:text-white block">Étape 1 : Remplacer</span>
                <p className="text-emerald-950/90 dark:text-slate-300">Remplacer chaque lettre par le nombre donné en l'enfermant <strong className="text-emerald-700 dark:text-emerald-400 font-bold">impérativement entre parenthèses</strong>, surtout si le nombre est négatif !</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-slate-800 space-y-1 shadow-xs">
                <span className="font-bold text-emerald-900 dark:text-white block">Étape 2 : Réinsérer le signe ×</span>
                <p className="text-emerald-950/90 dark:text-slate-300">Rétablir tous les signes de multiplication qui avaient été omis par convention devant les parenthèses ou les lettres.</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-slate-800 space-y-1 shadow-xs">
                <span className="font-bold text-emerald-900 dark:text-white block">Étape 3 : Priorités opératoires</span>
                <p className="text-emerald-950/90 dark:text-slate-300">Calculer dans l'ordre strict : <strong className="text-amber-700 dark:text-amber-300 font-bold">Parenthèses &gt; Puissances &gt; Produits/Quotients &gt; Sommes/Différences</strong>.</p>
              </div>
            </div>
          </div>

          {/* LE PIÈGE MAJEUR : -x² vs (-x)² */}
          <div className="bg-rose-50 border border-rose-300 text-rose-950 dark:bg-rose-950/30 dark:border-rose-500/50 dark:text-rose-200 p-4 sm:p-5 rounded-2xl space-y-3 shadow-xs">
            <div className="flex items-center space-x-2 text-rose-700 dark:text-rose-400 font-bold text-xs sm:text-sm uppercase tracking-wide">
              <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>Le piège n°1 en classe de 4ème : Ne jamais confondre -x² et (-x)² !</span>
            </div>
            <p className="text-xs sm:text-sm text-rose-950 dark:text-rose-200 leading-relaxed">
              Ce détail fait perdre la moyenne à des dizaines d'élèves chaque année. Observez bien la règle des puissances :
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Cas 1 in BLEU */}
              <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-300 text-sky-950 dark:text-sky-100 dark:bg-slate-950 dark:border-slate-800 space-y-2 shadow-xs">
                <span className="font-bold text-sky-800 dark:text-sky-400 block text-xs">Cas 1 : L'expression est (-x)²</span>
                <p className="text-sky-950/90 dark:text-slate-300 text-[11px]">
                  Le carré porte sur TOUT le contenu de la parenthèse, y compris le signe moins :
                </p>
                <div className="font-mono text-emerald-800 dark:text-emerald-300 text-[11px] space-y-1 p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-sky-200 dark:border-slate-800">
                  <div>Pour <MathView latex="x = 3 \implies (-3)^2 = (-3) \times (-3) = +9" display={false} /></div>
                  <div>Pour <MathView latex="x = -4 \implies (-(-4))^2 = (4)^2 = +16" display={false} /></div>
                  <div className="text-emerald-700 dark:text-emerald-400 font-bold font-sans text-[10px]">Le résultat est TOUJOURS POSITIF.</div>
                </div>
              </div>

              {/* Cas 2 in ROSE */}
              <div className="p-3.5 rounded-xl bg-rose-100/70 border border-rose-300 text-rose-950 dark:text-rose-100 dark:bg-slate-950 dark:border-rose-800/60 space-y-2 shadow-xs">
                <span className="font-bold text-rose-800 dark:text-rose-400 block text-xs">Cas 2 : L'expression est -x²</span>
                <p className="text-rose-950/90 dark:text-slate-300 text-[11px]">
                  La puissance s'applique UNIQUEMENT au nombre <MathView latex="x" display={false} />, puis le signe moins s'applique au résultat :
                </p>
                <div className="font-mono text-rose-800 dark:text-rose-300 text-[11px] space-y-1 p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-rose-200 dark:border-rose-950">
                  <div>Pour <MathView latex="x = 3 \implies -(3^2) = -(9) = -9" display={false} /></div>
                  <div>Pour <MathView latex="x = -4 \implies -((-4)^2) = -(16) = -16" display={false} /></div>
                  <div className="text-rose-700 dark:text-rose-400 font-bold font-sans text-[10px]">Le résultat est TOUJOURS NÉGATIF !</div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Exemples types résolus : Entier négatif, fraction et décimal */}
          <div className="bg-white border border-neutral-200 text-neutral-800 dark:bg-slate-950/80 dark:border-slate-800 dark:text-slate-300 p-4 sm:p-5 rounded-2xl space-y-3 shadow-xs">
            <h4 className="font-bold text-neutral-900 dark:text-white text-xs sm:text-sm uppercase tracking-wide">
              3 Exemples types rédigés pour le contrôle
            </h4>

            <div className="space-y-3 text-xs">
              {/* Exemple 1 in VERT */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-950 dark:bg-slate-900/90 dark:border-slate-800 dark:text-slate-300 rounded-xl space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-emerald-900 dark:text-slate-300">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">Exemple 1 : Avec un nombre négatif <MathView latex="x = -2" display={false} /></span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 font-mono font-bold">Trinôme classique</span>
                </div>
                <p className="text-emerald-950/80 dark:text-slate-400">Soit <MathView latex="A(x) = 3x^2 - 5x + 4" display={false} />. Calculer <MathView latex="A(-2)" display={false} /> :</p>
                <div className="font-mono text-emerald-800 dark:text-emerald-300 pl-3 border-l-2 border-emerald-500 space-y-1">
                  <div><MathView latex="A(-2) = 3 \times (-2)^2 - 5 \times (-2) + 4" display={false} /></div>
                  <div><MathView latex="A(-2) = 3 \times (4) - (-10) + 4 = 12 + 10 + 4" display={false} /></div>
                  <div className="text-emerald-900 dark:text-white font-bold"><MathView latex="A(-2) = 26" display={false} /></div>
                </div>
              </div>

              {/* Exemple 2 in BLEU */}
              <div className="p-3.5 bg-sky-50 border border-sky-300 text-sky-950 dark:bg-slate-900/90 dark:border-slate-800 dark:text-slate-300 rounded-xl space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-sky-900 dark:text-slate-300">
                  <span className="font-bold text-sky-800 dark:text-sky-300">Exemple 2 : Avec une fraction <MathView latex="x = \frac{3}{2}" display={false} /></span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-200 dark:bg-sky-500/20 text-sky-900 dark:text-sky-300 font-mono font-bold">Fractions rationnelles</span>
                </div>
                <p className="text-sky-950/80 dark:text-slate-400">Soit <MathView latex="B(x) = 4x - 7" display={false} />. Calculer <MathView latex="B(\frac{3}{2})" display={false} /> :</p>
                <div className="font-mono text-sky-800 dark:text-sky-300 pl-3 border-l-2 border-sky-500 space-y-1">
                  <div><MathView latex="B(\frac{3}{2}) = 4 \times \frac{3}{2} - 7 = \frac{12}{2} - 7 = 6 - 7" display={false} /></div>
                  <div className="text-sky-900 dark:text-white font-bold"><MathView latex="B(\frac{3}{2}) = -1" display={false} /></div>
                </div>
              </div>

              {/* Exemple 3 */}
              <div className="p-3.5 bg-amber-50/80 border border-amber-300 text-amber-950 dark:bg-slate-900/90 dark:border-slate-800 dark:text-slate-300 rounded-xl space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-amber-900 dark:text-slate-300">
                  <span className="font-bold text-amber-800 dark:text-amber-300">Exemple 3 : Produit de deux facteurs avec <MathView latex="x = 0,5" display={false} /></span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 font-mono font-bold">Forme factorisée</span>
                </div>
                <p className="text-amber-950/80 dark:text-slate-400">Soit <MathView latex="C(x) = (2x - 1)(3x + 4)" display={false} />. Calculer <MathView latex="C(0,5)" display={false} /> :</p>
                <div className="font-mono text-amber-800 dark:text-amber-300 pl-3 border-l-2 border-amber-500 space-y-1">
                  <div><MathView latex="C(0,5) = (2 \times 0,5 - 1)(3 \times 0,5 + 4) = (1 - 1)(1,5 + 4) = 0 \times 5,5" display={false} /></div>
                  <div className="text-amber-900 dark:text-white font-bold"><MathView latex="C(0,5) = 0" display={false} /> (0,5 est une racine de l'expression !)</div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. GUIDE COMPLET & EXEMPLES DE CALCUL DE PUISSANCES - Explanations styled in BLEU */}
          <div className="bg-sky-50/90 border border-sky-300 text-sky-950 dark:bg-slate-950/80 dark:border-sky-500/40 dark:text-slate-300 p-4 sm:p-5 rounded-2xl space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sky-800 dark:text-sky-400 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>4. Règles fondamentales & Exemples de calculs de puissances</span>
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-200 dark:bg-sky-500/20 text-sky-900 dark:text-sky-300 font-mono font-bold">
                Propriétés clés
              </span>
            </div>

            <p className="text-xs sm:text-sm text-sky-950 dark:text-slate-300 leading-relaxed">
              En calcul algébrique, la puissance d'un nombre ou d'un monôme suit des règles strictes.
              Pour tout nombre réel <MathView latex="a \neq 0" display={false} /> et entiers relatifs <MathView latex="m, n \in \mathbb{Z}" display={false} /> :
            </p>

            {/* Tableau des 6 règles des puissances - Alternance VERT et BLEU */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
              {/* Règle 1 in VERT */}
              <div className="p-3 bg-emerald-100/70 border border-emerald-300 text-emerald-950 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 rounded-xl space-y-1.5 shadow-xs">
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 block font-sans">1. Produit de même base :</span>
                <div className="text-center py-1 font-mono text-emerald-950 dark:text-white bg-white dark:bg-slate-950 rounded border border-emerald-200 dark:border-slate-800">
                  <MathView latex="a^m \times a^n = a^{m+n}" display={false} />
                </div>
                <p className="text-[11px] text-emerald-950/80 dark:text-slate-400">On additionne les exposants !</p>
                <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-mono font-bold">
                  <MathView latex="x^3 \times x^4 = x^{3+4} = x^7" display={false} />
                </div>
              </div>

              {/* Règle 2 in BLEU */}
              <div className="p-3 bg-sky-100/70 border border-sky-300 text-sky-950 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 rounded-xl space-y-1.5 shadow-xs">
                <span className="text-[11px] font-bold text-sky-800 dark:text-sky-400 block font-sans">2. Quotient de même base :</span>
                <div className="text-center py-1 font-mono text-sky-950 dark:text-white bg-white dark:bg-slate-950 rounded border border-sky-200 dark:border-slate-800">
                  <MathView latex="\frac{a^m}{a^n} = a^{m-n}" display={false} />
                </div>
                <p className="text-[11px] text-sky-950/80 dark:text-slate-400">On soustrait l'exposant du bas !</p>
                <div className="text-[11px] text-sky-800 dark:text-sky-300 font-mono font-bold">
                  <MathView latex="\frac{x^7}{x^2} = x^{7-2} = x^5" display={false} />
                </div>
              </div>

              {/* Règle 3 in VERT */}
              <div className="p-3 bg-emerald-100/70 border border-emerald-300 text-emerald-950 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 rounded-xl space-y-1.5 shadow-xs">
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 block font-sans">3. Puissance de puissance :</span>
                <div className="text-center py-1 font-mono text-emerald-950 dark:text-white bg-white dark:bg-slate-950 rounded border border-emerald-200 dark:border-slate-800">
                  <MathView latex="(a^m)^n = a^{m \times n}" display={false} />
                </div>
                <p className="text-[11px] text-emerald-950/80 dark:text-slate-400">On multiplie les exposants !</p>
                <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-mono font-bold">
                  <MathView latex="(x^3)^2 = x^{3 \times 2} = x^6" display={false} />
                </div>
              </div>

              {/* Règle 4 in BLEU */}
              <div className="p-3 bg-sky-100/70 border border-sky-300 text-sky-950 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 rounded-xl space-y-1.5 shadow-xs">
                <span className="text-[11px] font-bold text-sky-800 dark:text-sky-400 block font-sans">4. Puissance d'un produit :</span>
                <div className="text-center py-1 font-mono text-sky-950 dark:text-white bg-white dark:bg-slate-950 rounded border border-sky-200 dark:border-slate-800">
                  <MathView latex="(ab)^n = a^n \times b^n" display={false} />
                </div>
                <p className="text-[11px] text-sky-950/80 dark:text-slate-400">La puissance se distribue !</p>
                <div className="text-[11px] text-sky-800 dark:text-sky-300 font-mono font-bold">
                  <MathView latex="(2x^3)^2 = 2^2 \times (x^3)^2 = 4x^6" display={false} />
                </div>
              </div>

              {/* Règle 5 in VERT */}
              <div className="p-3 bg-emerald-100/70 border border-emerald-300 text-emerald-950 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 rounded-xl space-y-1.5 shadow-xs">
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 block font-sans">5. Puissance d'un quotient :</span>
                <div className="text-center py-1 font-mono text-emerald-950 dark:text-white bg-white dark:bg-slate-950 rounded border border-emerald-200 dark:border-slate-800">
                  <MathView latex="\left(\frac{a}{b}\right)^n = \frac{a^n}{b^n}" display={false} />
                </div>
                <p className="text-[11px] text-emerald-950/80 dark:text-slate-400">Au numérateur et dénominateur :</p>
                <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-mono font-bold">
                  <MathView latex="\left(\frac{x}{3}\right)^2 = \frac{x^2}{3^2} = \frac{x^2}{9}" display={false} />
                </div>
              </div>

              {/* Règle 6 in BLEU */}
              <div className="p-3 bg-sky-100/70 border border-sky-300 text-sky-950 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 rounded-xl space-y-1.5 shadow-xs">
                <span className="text-[11px] font-bold text-sky-800 dark:text-sky-400 block font-sans">6. Exposants nuls & négatifs :</span>
                <div className="text-center py-1 font-mono text-sky-950 dark:text-white bg-white dark:bg-slate-950 rounded border border-sky-200 dark:border-slate-800">
                  <MathView latex="a^0 = 1 \quad \text{et} \quad a^{-n} = \frac{1}{a^n}" display={false} />
                </div>
                <p className="text-[11px] text-sky-950/80 dark:text-slate-400">Exposant négatif = Inverse !</p>
                <div className="text-[11px] text-sky-800 dark:text-sky-300 font-mono font-bold">
                  <MathView latex="2^{-3} = \frac{1}{2^3} = \frac{1}{8} = 0,125" display={false} />
                </div>
              </div>
            </div>

            {/* 4 Exemples d'application pas à pas - Alternance VERT et BLEU */}
            <div className="p-3.5 bg-white dark:bg-slate-900/90 rounded-xl border border-sky-200 dark:border-slate-800 space-y-3 shadow-xs">
              <span className="font-bold text-neutral-900 dark:text-white text-xs block uppercase tracking-wide">
                Exemples complets rédigés de calculs de puissances :
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Exemple A in VERT */}
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-950 dark:text-emerald-100 dark:bg-slate-950 dark:border-slate-800 rounded-lg space-y-1.5 font-mono shadow-xs">
                  <div className="font-sans font-bold text-emerald-800 dark:text-emerald-400 text-[11px]">
                    A. Produit de puissances numériques :
                  </div>
                  <div className="text-emerald-950 dark:text-slate-300">
                    <MathView latex="A = 2^3 \times 2^4 = 2^{3+4} = 2^7 = 128" display={false} />
                  </div>
                  <div className="text-[11px] font-sans text-emerald-900/80 dark:text-slate-400">
                    ️ Erreur à éviter : ne jamais multiplier les bases (<MathView latex="2^3 \times 2^4 \neq 4^7" display={false} />).
                  </div>
                </div>

                {/* Exemple B in BLEU */}
                <div className="p-3 bg-sky-50 border border-sky-300 text-sky-950 dark:text-sky-100 dark:bg-slate-950 dark:border-slate-800 rounded-lg space-y-1.5 font-mono shadow-xs">
                  <div className="font-sans font-bold text-sky-800 dark:text-sky-400 text-[11px]">
                    B. Puissance d'un monôme littéral :
                  </div>
                  <div className="text-sky-950 dark:text-slate-300">
                    <MathView latex="B = (3x^2)^3 = 3^3 \times (x^2)^3 = 27x^{2 \times 3} = 27x^6" display={false} />
                  </div>
                  <div className="text-[11px] font-sans text-sky-900/80 dark:text-slate-400">
                    L'exposant 3 porte sur le coefficient 3 et sur le terme <MathView latex="x^2" display={false} />.
                  </div>
                </div>

                {/* Exemple C in VERT */}
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-950 dark:text-emerald-100 dark:bg-slate-950 dark:border-slate-800 rounded-lg space-y-1.5 font-mono shadow-xs">
                  <div className="font-sans font-bold text-emerald-800 dark:text-emerald-400 text-[11px]">
                    C. Quotient et puissances négatives :
                  </div>
                  <div className="text-emerald-950 dark:text-slate-300">
                    <MathView latex="C = \frac{10^5 \times 10^{-2}}{10^4} = \frac{10^{5+(-2)}}{10^4} = \frac{10^3}{10^4} = 10^{3-4} = 10^{-1} = 0,1" display={false} />
                  </div>
                  <div className="text-[11px] font-sans text-emerald-900/80 dark:text-slate-400">
                    On applique <MathView latex="10^m \times 10^n = 10^{m+n}" display={false} /> puis <MathView latex="\frac{10^m}{10^n} = 10^{m-n}" display={false} />.
                  </div>
                </div>

                {/* Exemple D in BLEU */}
                <div className="p-3 bg-sky-50 border border-sky-300 text-sky-950 dark:text-sky-100 dark:bg-slate-950 dark:border-slate-800 rounded-lg space-y-1.5 font-mono shadow-xs">
                  <div className="font-sans font-bold text-sky-800 dark:text-rose-400 text-[11px]">
                    D. Produit de deux monômes avec signes :
                  </div>
                  <div className="text-sky-950 dark:text-slate-300">
                    <MathView latex="D = (-4x^3) \times (-2x^5) = [(-4) \times (-2)] \times (x^3 \times x^5) = +8x^8" display={false} />
                  </div>
                  <div className="text-[11px] font-sans text-sky-900/80 dark:text-slate-400">
                    Règle des signes : <strong className="text-emerald-700 dark:text-emerald-300 font-bold">(-) × (-) = (+)</strong> et somme des puissances : <MathView latex="3+5=8" display={false} />.
                  </div>
                </div>
              </div>
            </div>

            {/* Simulateur interactif de puissances */}
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-sky-300 dark:border-sky-500/30 space-y-3 text-xs shadow-xs">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wide flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  Banc d'essai interactif : Tester une puissance et son signe
                </span>
                <span className="text-[10px] text-neutral-500 dark:text-slate-400 font-sans">
                  Modifiez les valeurs pour observer le signe et les étapes
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Choix de la base */}
                <div className="space-y-1">
                  <label className="text-[11px] text-neutral-600 dark:text-slate-400 font-sans block">Base a :</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {[-5, -3, -2, -1, 2, 3, 4, 10].map((b) => (
                      <button
                        key={b}
                        onClick={() => setPowerBase(b)}
                        className={`px-2 py-1 rounded text-xs font-mono font-bold transition-all ${
                          powerBase === b
                            ? 'bg-sky-600 text-white shadow-xs'
                            : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-300 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Choix de l'exposant */}
                <div className="space-y-1">
                  <label className="text-[11px] text-neutral-600 dark:text-slate-400 font-sans block">Exposant n :</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {[-2, -1, 0, 1, 2, 3, 4, 5].map((e) => (
                      <button
                        key={e}
                        onClick={() => setPowerExp(e)}
                        className={`px-2 py-1 rounded text-xs font-mono font-bold transition-all ${
                          powerExp === e
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-300 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800'
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notation parenthèses */}
                <div className="space-y-1">
                  <label className="text-[11px] text-neutral-600 dark:text-slate-400 font-sans block">Notation :</label>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setPowerHasParen(true)}
                      className={`flex-1 py-1 px-2 rounded text-xs font-mono font-semibold transition-all ${
                        powerHasParen
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-neutral-100 text-neutral-700 border border-neutral-300 dark:bg-slate-950 dark:text-slate-400 dark:border-slate-800'
                      }`}
                    >
                      (a)ⁿ avec ( )
                    </button>
                    <button
                      onClick={() => setPowerHasParen(false)}
                      className={`flex-1 py-1 px-2 rounded text-xs font-mono font-semibold transition-all ${
                        !powerHasParen
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-neutral-100 text-neutral-700 border border-neutral-300 dark:bg-slate-950 dark:text-slate-400 dark:border-slate-800'
                      }`}
                    >
                      -aⁿ sans ( )
                    </button>
                  </div>
                </div>
              </div>

              {/* Résultat calculé en temps réel */}
              <div className="p-3 bg-neutral-50 dark:bg-slate-950 rounded-xl border border-neutral-200 dark:border-slate-800 space-y-1.5 font-mono">
                {powerHasParen ? (
                  <div className="space-y-1">
                    <div className="text-neutral-900 dark:text-slate-200 text-sm flex items-center gap-2">
                      <span className="text-neutral-500 dark:text-slate-400 font-sans text-xs">Calcul :</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                        <MathView latex={powerLatexParen} display={false} />
                      </span>
                    </div>
                    <div className="text-[11px] text-sky-800 dark:text-sky-300 font-sans">
                       <strong>Règle :</strong> {isPowerNegBase
                        ? isPowerEvenExp
                          ? 'Exposant PAIR => résultat strictement POSITIF (+)'
                          : 'Exposant IMPAIR => résultat strictement NÉGATIF (-)'
                        : 'Base positive => résultat strictement POSITIF (+)'}
                    </div>
                    {powerExp < 0 && (
                      <div className="text-[11px] text-neutral-600 dark:text-slate-400 font-sans">
                        Détail : <MathView latex={powerLatexDetailNeg} display={false} />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="text-neutral-900 dark:text-slate-200 text-sm flex items-center gap-2">
                      <span className="text-neutral-500 dark:text-slate-400 font-sans text-xs">Calcul :</span>
                      <span className="text-rose-700 dark:text-rose-400 font-bold">
                        <MathView latex={powerLatexNoParen} display={false} />
                      </span>
                    </div>
                    <div className="text-[11px] text-rose-700 dark:text-rose-300 font-sans">
                      ️ <strong>Attention piège :</strong> Sans parenthèses, le signe « - » est en dehors de la puissance ! Le résultat est TOUJOURS négatif.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateSubTab('calculateur-valeur')}
            className="p-3 rounded-xl bg-white dark:bg-indigo-600/30 border border-neutral-300 dark:border-indigo-500/40 text-neutral-900 dark:text-indigo-200 text-xs flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-indigo-600/50 transition-colors shadow-xs"
          >
            <span className="font-semibold">Tester n'importe quelle valeur de x dans notre simulateur interactif</span>
            <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-indigo-400" />
          </button>
        </div>
      )}

      {/* SECTION 3 */}
      {activeSection === 3 && (
        <div className="flex flex-col space-y-5 animate-fade-in">
          <div className="border-b border-neutral-200 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                Chapitre IV • Section 3
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30">
                La Règle d'or des Signes
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mt-1">
              III. Règles fondamentales dans ℤ (Moins × Moins = Plus) & Suppression des parenthèses
            </h2>
          </div>

          {/* 1. LES RÈGLES DE CALCUL DANS Z : MOINS × MOINS = PLUS - Explanations styled in VERT */}
          <div className="bg-emerald-50/90 border border-emerald-300 text-emerald-950 dark:bg-slate-950/80 dark:border-amber-500/40 dark:text-slate-300 p-4 sm:p-5 rounded-2xl space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-emerald-800 dark:text-amber-400 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-600 dark:text-amber-400" />
                <span>1. Règles fondamentales du produit et de la soustraction dans ℤ</span>
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-200 dark:bg-amber-500/20 text-emerald-900 dark:text-amber-300 font-mono font-bold">
                Moins × Moins = Plus
              </span>
            </div>

            <p className="text-xs sm:text-sm text-emerald-950 dark:text-slate-300 leading-relaxed">
              En classe de 4ème et de 3ème, la maîtrise parfaite des signes dans l'ensemble des entiers relatifs <MathView latex="\mathbb{Z}" display={false} /> est la clé absolue du calcul algébrique.
            </p>

            {/* Grille des 4 règles de signe */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs font-mono">
              {/* Cas 1 in VERT */}
              <div className="p-3 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700 text-center space-y-1 shadow-xs">
                <span className="font-sans font-bold text-emerald-800 dark:text-emerald-400 block text-[11px]">Cas 1 : Positif × Positif</span>
                <div className="text-emerald-800 dark:text-emerald-300 font-bold py-1 bg-white dark:bg-slate-950 rounded border border-emerald-200 dark:border-slate-800">
                  <MathView latex="(+) \times (+) = (+)" display={false} />
                </div>
                <div className="text-[11px] text-emerald-950/80 dark:text-slate-400">
                  <MathView latex="(+3) \times (+4) = +12" display={false} />
                </div>
              </div>

              {/* Cas 2 in BLEU */}
              <div className="p-3 rounded-xl bg-sky-100/70 dark:bg-sky-950/70 border border-sky-300 dark:border-sky-700 text-center space-y-1 shadow-xs">
                <span className="font-sans font-bold text-sky-800 dark:text-rose-400 block text-[11px]">Cas 2 : Positif × Négatif</span>
                <div className="text-sky-800 dark:text-rose-300 font-bold py-1 bg-white dark:bg-slate-950 rounded border border-sky-200 dark:border-slate-800">
                  <MathView latex="(+) \times (-) = (-)" display={false} />
                </div>
                <div className="text-[11px] text-sky-950/80 dark:text-slate-400">
                  <MathView latex="(+3) \times (-4) = -12" display={false} />
                </div>
              </div>

              {/* Cas 3 in BLEU */}
              <div className="p-3 rounded-xl bg-sky-100/70 dark:bg-sky-950/70 border border-sky-300 dark:border-sky-700 text-center space-y-1 shadow-xs">
                <span className="font-sans font-bold text-sky-800 dark:text-rose-400 block text-[11px]">Cas 3 : Négatif × Positif</span>
                <div className="text-sky-800 dark:text-rose-300 font-bold py-1 bg-white dark:bg-slate-950 rounded border border-sky-200 dark:border-slate-800">
                  <MathView latex="(-) \times (+) = (-)" display={false} />
                </div>
                <div className="text-[11px] text-sky-950/80 dark:text-slate-400">
                  <MathView latex="(-3) \times (+4) = -12" display={false} />
                </div>
              </div>

              {/* Cas 4 in VERT VIBRANT */}
              <div className="p-3 rounded-xl bg-emerald-200/80 dark:bg-emerald-900/80 border-2 border-emerald-300 dark:border-emerald-600 text-center space-y-1 shadow-xs">
                <span className="font-sans font-bold text-emerald-900 dark:text-emerald-300 block text-[11px]">Cas 4 : Moins × Moins</span>
                <div className="text-emerald-900 dark:text-emerald-200 font-bold py-1 bg-white dark:bg-emerald-950/80 rounded border border-emerald-400 dark:border-emerald-500/50">
                  <MathView latex="(-) \times (-) = (+)" display={false} />
                </div>
                <div className="text-[11px] text-emerald-900 dark:text-emerald-300 font-bold">
                  <MathView latex="(-3) \times (-4) = +12" display={false} />
                </div>
              </div>
            </div>

            {/* Pourquoi Moins par Moins donne Plus ? */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-slate-800 space-y-2 text-xs shadow-xs">
              <span className="font-bold text-emerald-800 dark:text-amber-300 block flex items-center gap-1.5 font-sans">
                <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-amber-400" />
                Pourquoi « Moins par Moins donne Plus » ? La démonstration évidente par régularité :
              </span>
              <p className="text-emerald-950/90 dark:text-slate-300 text-[11px] leading-relaxed">
                Observez ce qui se produit lorsqu'on multiplie <MathView latex="-4" display={false} /> par des nombres entiers successifs décroissants (on enlève 1 à chaque ligne) :
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 font-mono text-center text-[11px]">
                <div className="p-2 bg-neutral-50 dark:bg-slate-950 rounded border border-neutral-200 dark:border-slate-800">
                  <span className="text-neutral-500 dark:text-slate-400 block text-[10px]">3 × (-4) =</span>
                  <strong className="text-rose-700 dark:text-rose-400">-12</strong>
                </div>
                <div className="p-2 bg-neutral-50 dark:bg-slate-950 rounded border border-neutral-200 dark:border-slate-800">
                  <span className="text-neutral-500 dark:text-slate-400 block text-[10px]">2 × (-4) =</span>
                  <strong className="text-rose-700 dark:text-rose-400">-8 (+4)</strong>
                </div>
                <div className="p-2 bg-neutral-50 dark:bg-slate-950 rounded border border-neutral-200 dark:border-slate-800">
                  <span className="text-neutral-500 dark:text-slate-400 block text-[10px]">1 × (-4) =</span>
                  <strong className="text-rose-700 dark:text-rose-400">-4 (+4)</strong>
                </div>
                <div className="p-2 bg-neutral-50 dark:bg-slate-950 rounded border border-neutral-200 dark:border-slate-800">
                  <span className="text-neutral-500 dark:text-slate-400 block text-[10px]">0 × (-4) =</span>
                  <strong className="text-neutral-700 dark:text-slate-300">0 (+4)</strong>
                </div>
                <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 rounded border border-emerald-300 dark:border-emerald-500/50">
                  <span className="text-emerald-800 dark:text-emerald-300 block text-[10px]">(-1) × (-4) =</span>
                  <strong className="text-emerald-800 dark:text-emerald-400">+4 (+4)</strong>
                </div>
                <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 rounded border border-emerald-300 dark:border-emerald-500/50">
                  <span className="text-emerald-800 dark:text-emerald-300 block text-[10px]">(-2) × (-4) =</span>
                  <strong className="text-emerald-800 dark:text-emerald-400">+8 (+4)</strong>
                </div>
              </div>
              <p className="text-emerald-900/80 dark:text-slate-400 text-[11px]">
                Conclusion : pour que l'arithmétique reste continue et conserve la distributivité, multiplier deux nombres négatifs doit obligatoirement donner un nombre positif !
              </p>
            </div>

            {/* Règle générale du produit de plusieurs facteurs - Explanations styled in BLEU */}
            <div className="p-3.5 bg-sky-50 border border-sky-300 text-sky-950 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 rounded-xl space-y-2 text-xs shadow-xs">
              <span className="font-bold text-sky-800 dark:text-sky-300 block font-sans">
                Règle d'or : Produit de plusieurs facteurs relatifs (compter les signes « - »)
              </span>
              <p className="text-sky-950/90 dark:text-slate-300 text-[11px]">
                Dans un produit de plusieurs nombres relatifs non nuls :
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="p-2.5 bg-emerald-100 border border-emerald-300 text-emerald-950 dark:bg-slate-950 dark:border-emerald-500/40 dark:text-emerald-300 rounded-lg">
                  <strong className="font-sans text-emerald-900 dark:text-white block">Nombre de « - » PAIR =&gt; POSITIF (+)</strong>
                  <MathView latex="(-2) \times (-3) = +6" display={false} /> (2 signes -)<br />
                  <MathView latex="(-1) \times (-2) \times (-3) \times (-4) = +24" display={false} /> (4 signes -)
                </div>
                <div className="p-2.5 bg-rose-100 border border-rose-300 text-rose-950 dark:bg-slate-950 dark:border-rose-500/40 dark:text-rose-300 rounded-lg">
                  <strong className="font-sans text-rose-900 dark:text-white block">Nombre de « - » IMPAIR =&gt; NÉGATIF (-)</strong>
                  <MathView latex="(-2) \times (-3) \times (-5) = -30" display={false} /> (3 signes -)<br />
                  <MathView latex="(-1) \times (+4) \times (-2) \times (-3) = -24" display={false} /> (3 signes -)
                </div>
              </div>
            </div>

            {/* Règle de soustraction dans Z : a - (-b) = a + b - Explanations styled in BLEU */}
            <div className="p-3.5 bg-sky-100/80 border border-sky-300 text-sky-950 dark:bg-slate-900 dark:border-indigo-500/40 dark:text-slate-300 rounded-xl space-y-2 text-xs shadow-xs">
              <span className="font-bold text-sky-800 dark:text-indigo-300 block font-sans">
                Soustraction dans ℤ : Soustraire un négatif revient à ajouter son opposé !
              </span>
              <div className="p-2.5 bg-white dark:bg-slate-950 rounded-lg font-mono text-center text-sm text-sky-900 dark:text-indigo-300 border border-sky-200 dark:border-slate-800">
                <MathView latex="a - (-b) = a + b" display={true} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px] text-sky-950 dark:text-slate-300">
                <div className="p-2 bg-white dark:bg-slate-950 rounded border border-sky-200 dark:border-slate-800">
                  <MathView latex="7 - (-5) = 7 + 5 = 12" display={false} />
                </div>
                <div className="p-2 bg-white dark:bg-slate-950 rounded border border-sky-200 dark:border-slate-800">
                  <MathView latex="-15 - (-9) = -15 + 9 = -6" display={false} />
                </div>
                <div className="p-2 bg-white dark:bg-slate-950 rounded border border-sky-200 dark:border-slate-800">
                  <MathView latex="4x - (-3x) = 4x + 3x = 7x" display={false} />
                </div>
              </div>
            </div>

            {/* Simulateur interactif de règles dans Z */}
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-emerald-300 dark:border-amber-500/30 space-y-3 text-xs shadow-xs">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-bold text-emerald-800 dark:text-amber-300 uppercase tracking-wide flex items-center gap-1.5 font-sans">
                  <Calculator className="w-4 h-4 text-emerald-600 dark:text-amber-400" />
                  Banc d'essai interactif : Tester les opérations et signes dans ℤ
                </span>
                <span className="text-[10px] text-neutral-500 dark:text-slate-400 font-sans">
                  Sélectionnez les valeurs de a et b pour visualiser la règle
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Nombre a */}
                <div className="space-y-1">
                  <label className="text-[11px] text-neutral-600 dark:text-slate-400 font-sans block">Nombre a :</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {[-8, -6, -4, -3, 2, 5, 7].map((val) => (
                      <button
                        key={val}
                        onClick={() => setZNumA(val)}
                        className={`px-2 py-1 rounded text-xs font-mono font-bold transition-all ${
                          zNumA === val
                            ? 'bg-emerald-600 text-white shadow-xs font-extrabold'
                            : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-300 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Opération */}
                <div className="space-y-1">
                  <label className="text-[11px] text-neutral-600 dark:text-slate-400 font-sans block">Opération :</label>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setZOp('mul')}
                      className={`flex-1 py-1 px-2 rounded text-xs font-mono font-bold transition-all ${
                        zOp === 'mul'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-neutral-100 text-neutral-700 border border-neutral-300 dark:bg-slate-950 dark:text-slate-400 dark:border-slate-800'
                      }`}
                    >
                      Multiplication (×)
                    </button>
                    <button
                      onClick={() => setZOp('sub')}
                      className={`flex-1 py-1 px-2 rounded text-xs font-mono font-bold transition-all ${
                        zOp === 'sub'
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'bg-neutral-100 text-neutral-700 border border-neutral-300 dark:bg-slate-950 dark:text-slate-400 dark:border-slate-800'
                      }`}
                    >
                      Soustraction (-)
                    </button>
                  </div>
                </div>

                {/* Nombre b */}
                <div className="space-y-1">
                  <label className="text-[11px] text-neutral-600 dark:text-slate-400 font-sans block">Nombre b :</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {[-7, -5, -4, -2, 3, 6, 9].map((val) => (
                      <button
                        key={val}
                        onClick={() => setZNumB(val)}
                        className={`px-2 py-1 rounded text-xs font-mono font-bold transition-all ${
                          zNumB === val
                            ? 'bg-sky-600 text-white shadow-xs'
                            : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-300 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Résultat calculé dynamiquement */}
              <div className="p-3 bg-neutral-50 dark:bg-slate-950 rounded-xl border border-neutral-200 dark:border-slate-800 space-y-1.5 font-mono">
                {zOp === 'mul' ? (
                  <div className="space-y-1">
                    <div className="text-neutral-900 dark:text-slate-200 text-sm flex items-center gap-2">
                      <span className="text-neutral-500 dark:text-slate-400 font-sans text-xs">Calcul :</span>
                      <span className="text-emerald-700 dark:text-amber-400 font-bold">
                        <MathView latex={zProdLatex} display={false} />
                      </span>
                    </div>
                    <div className="text-[11px] font-sans">
                      {zBothNeg && (
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                           Règle : Les deux nombres sont négatifs : <strong>(-) × (-) = (+)</strong>. Le résultat est donc strictement positif (+{zProd}) !
                        </span>
                      )}
                      {zDiffSigns && (
                        <span className="text-rose-700 dark:text-rose-400 font-semibold">
                          ️ Règle : Nombres de signes contraires : <strong>(-) × (+) = (-)</strong>. Le résultat est strictement négatif ({zProd}) !
                        </span>
                      )}
                      {!zBothNeg && !zDiffSigns && (
                        <span className="text-sky-700 dark:text-sky-400 font-semibold">
                           Règle : Les deux nombres sont positifs : <strong>(+) × (+) = (+)</strong>.
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="text-neutral-900 dark:text-slate-200 text-sm flex items-center gap-2">
                      <span className="text-neutral-500 dark:text-slate-400 font-sans text-xs">Calcul :</span>
                      <span className="text-sky-700 dark:text-indigo-400 font-bold">
                        <MathView latex={zSubLatex} display={false} />
                      </span>
                    </div>
                    <div className="text-[11px] font-sans">
                      {zIsBMinus ? (
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                           <strong>Règle :</strong> On soustrait un nombre négatif (<MathView latex={zBOppositeLatex} display={false} />) : cela équivaut à <strong>ajouter son opposé positif (+{Math.abs(zNumB)})</strong> !
                        </span>
                      ) : (
                        <span className="text-neutral-700 dark:text-slate-300">
                          Soustraction classique : on retranche {zNumB} à {zNumA}.
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Règle 2 : Parenthèse précédée de + - Explanations styled in VERT */}
          <div className="bg-emerald-50/90 border border-emerald-300 text-emerald-950 dark:bg-slate-950/80 dark:border-emerald-500/30 dark:text-slate-300 p-4 sm:p-5 rounded-2xl space-y-2 shadow-xs">
            <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-400 font-bold text-xs sm:text-sm uppercase tracking-wide">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>2. Parenthèses précédées du signe « + »</span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-950 dark:text-slate-300">
              On supprime les parenthèses et le signe « + » <strong className="text-emerald-900 dark:text-white font-bold">sans rien changer aux signes</strong> des termes situés à l'intérieur :
            </p>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl font-mono text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm border border-emerald-200 dark:border-slate-800 text-center shadow-xs">
              <MathView latex="+(a + b - c) = a + b - c" display={true} />
            </div>
            <p className="text-xs text-emerald-900/80 dark:text-slate-400 font-mono pt-1">
              Exemple : <MathView latex="4x + (3x - 5) = 4x + 3x - 5 = 7x - 5" display={false} />
            </p>
          </div>

          {/* Règle 3 : Parenthèse précédée de - (CRITIQUE) */}
          <div className="bg-rose-50 border border-rose-300 text-rose-950 dark:bg-rose-950/30 dark:border-rose-500/50 dark:text-rose-200 p-4 sm:p-5 rounded-2xl space-y-3 shadow-xs">
            <div className="flex items-center space-x-2 text-rose-800 dark:text-rose-400 font-bold text-xs sm:text-sm uppercase tracking-wide">
              <Zap className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>3. Parenthèses précédées du signe « - » (Règle d'or du programme)</span>
            </div>
            <p className="text-xs sm:text-sm text-rose-950 dark:text-rose-200 leading-relaxed">
              On supprime les parenthèses et le signe « - » <strong className="text-rose-900 dark:text-white underline font-bold">en inversant les signes de TOUS les termes</strong> situés dans la parenthèse (+ devient -, et - devient +) !
            </p>
            <div className="p-3 bg-white dark:bg-slate-950 rounded-xl font-mono text-rose-800 dark:text-rose-300 text-xs sm:text-sm border border-rose-200 dark:border-rose-800/80 text-center shadow-xs">
              <MathView latex="-(a + b - c) = -a - b + c" display={true} />
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-slate-800 text-xs text-neutral-800 dark:text-slate-300 space-y-1 shadow-xs">
              <strong className="text-amber-800 dark:text-amber-400 block font-bold">Pourquoi cette règle fonctionne-t-elle ?</strong>
              <p className="text-neutral-700 dark:text-slate-400 text-[11px] leading-relaxed">
                Le signe « - » devant une parenthèse représente la multiplication implicite par <MathView latex="-1" display={false} />. Par distributivité et la règle « moins × moins = plus » : <MathView latex="-(a - b) = (-1) \times a + (-1) \times (-b) = -a + b" display={false} />.
              </p>
            </div>
          </div>

          {/* Règle 4 : Parenthèses et crochets imbriqués - Explanations styled in BLEU */}
          <div className="bg-sky-50/90 border border-sky-300 text-sky-950 dark:bg-slate-950/80 dark:border-indigo-500/30 dark:text-slate-300 p-4 sm:p-5 rounded-2xl space-y-3 shadow-xs">
            <h4 className="font-bold text-sky-800 dark:text-indigo-300 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-600 dark:text-indigo-400" />
              <span>4. Parenthèses et crochets imbriqués (De l'intérieur vers l'extérieur)</span>
            </h4>
            <p className="text-xs sm:text-sm text-sky-950 dark:text-slate-300">
              Lorsqu'une expression contient des parenthèses à l'intérieur de crochets, on procède <strong className="text-sky-900 dark:text-white font-bold">toujours de l'intérieur vers l'extérieur</strong> :
            </p>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-sky-200 dark:border-slate-800 text-xs space-y-2 font-mono shadow-xs text-sky-950 dark:text-slate-300">
              <span className="font-sans font-bold text-emerald-800 dark:text-emerald-400 block text-xs">Exemple type de contrôle résolu :</span>
              <div><MathView latex="E = 8x - [ 3x - (4 - 2x) + 5 ]" display={false} /></div>
              <div className="text-sky-950/80 dark:text-slate-400 text-[11px]">Étape 1 : On supprime la parenthèse intérieure -(4 - 2x) = -4 + 2x :</div>
              <div><MathView latex="E = 8x - [ 3x - 4 + 2x + 5 ]" display={false} /></div>
              <div className="text-sky-950/80 dark:text-slate-400 text-[11px]">Étape 2 : On réduit l'intérieur du crochet (3x + 2x = 5x et -4 + 5 = 1) :</div>
              <div><MathView latex="E = 8x - [ 5x + 1 ]" display={false} /></div>
              <div className="text-sky-950/80 dark:text-slate-400 text-[11px]">Étape 3 : On supprime le crochet précédé du signe moins :</div>
              <div><MathView latex="E = 8x - 5x - 1" display={false} /></div>
              <div className="text-emerald-700 dark:text-emerald-400 font-bold text-sm"><MathView latex="E = 3x - 1" display={false} /></div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4 */}
      {activeSection === 4 && (
        <div className="flex flex-col space-y-5 animate-fade-in">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                Chapitre IV • Section 4
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/30">
                Simplification & Familles
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              IV. Réduction par termes semblables & Ordonnancement
            </h2>
          </div>

          {/* Définition et Familles */}
          <div className="bg-slate-100/80 dark:bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-sky-600 dark:text-sky-400 text-xs sm:text-sm uppercase tracking-wide">
              1. Qu'est-ce que réduire une expression ?
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong className="text-slate-900 dark:text-white">Réduire</strong> une expression littérale, c'est l'écrire avec le minimum de termes possibles en regroupant les <strong className="text-emerald-600 dark:text-emerald-400">termes semblables</strong> (termes ayant la même variable affectée du même exposant).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-purple-50/40 dark:bg-purple-950/40 border border-purple-500/30 text-purple-800 dark:text-purple-200 text-center">
                <span className="font-bold block text-slate-900 dark:text-white mb-0.5">Famille des x³</span>
                <MathView latex="2x^3, -5x^3" display={false} />
              </div>
              <div className="p-3 rounded-xl bg-sky-50/40 dark:bg-sky-950/40 border border-sky-500/30 text-sky-800 dark:text-sky-200 text-center">
                <span className="font-bold block text-slate-900 dark:text-white mb-0.5">Famille des x²</span>
                <MathView latex="3x^2, -7x^2, x^2" display={false} />
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-center">
                <span className="font-bold block text-slate-900 dark:text-white mb-0.5">Famille des x</span>
                <MathView latex="5x, -2x, -x" display={false} />
              </div>
              <div className="p-3 rounded-xl bg-amber-50/40 dark:bg-amber-950/40 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-center">
                <span className="font-bold block text-slate-900 dark:text-white mb-0.5">Constantes</span>
                <MathView latex="4, -9, \frac{1}{2}" display={false} />
              </div>
            </div>
          </div>

          {/* Règle d'addition algébrique */}
          <div className="bg-slate-100/80 dark:bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm uppercase tracking-wide">
              2. Règle d'addition : Additionner les coefficients et conserver la lettre
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 font-mono text-xs text-emerald-700 dark:text-emerald-300">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div><MathView latex="5x + 3x = (5 + 3)x = 8x" display={false} /></div>
                <div><MathView latex="7x^2 - 11x^2 = (7 - 11)x^2 = -4x^2" display={false} /></div>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div><MathView latex="x^2 - x^2 = 0" display={false} /></div>
                <div><MathView latex="4x - x = 4x - 1x = 3x" display={false} /> (Le coefficient 1 !)</div>
              </div>
            </div>

            <div className="p-3.5 bg-rose-50/30 dark:bg-rose-950/30 border border-rose-500/40 rounded-xl text-xs text-rose-800 dark:text-rose-200">
              <strong className="text-slate-900 dark:text-white block font-bold mb-0.5">Interdiction absolue :</strong>
              On ne peut JAMAIS additionner des termes de familles différentes !
              <br />
              <MathView latex="3x + 2x^2" display={false} /> ne donne PAS <span className="line-through text-rose-600 dark:text-rose-400 font-mono">5x³</span> ! L'expression est déjà irréductible. De même, <MathView latex="5x + 4 \neq 9x" display={false} />.
            </div>
          </div>

          {/* Ordonner selon les puissances décroissantes */}
          <div className="bg-slate-100/80 dark:bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm uppercase tracking-wide">
              3. Ordonner un polynôme selon les puissances décroissantes
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Au Sénégal, les inspecteurs et correcteurs du BFEM exigent que le résultat final soit ordonné dans le sens : <strong className="text-emerald-600 dark:text-emerald-400">Degré 2 &gt; Degré 1 &gt; Constante</strong> :
            </p>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 font-mono text-emerald-700 dark:text-emerald-300">
              <div><MathView latex="P = 7x - 5x^2 + 4 + 2x^2 - 3x - 9" display={false} /></div>
              <div className="text-slate-600 dark:text-slate-400 text-[11px]">Regroupement par familles :</div>
              <div><MathView latex="P = (-5x^2 + 2x^2) + (7x - 3x) + (4 - 9)" display={false} /></div>
              <div className="text-slate-900 dark:text-white font-bold text-sm"><MathView latex="P = -3x^2 + 4x - 5" display={false} /> (Forme ordonnée et réduite)</div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5 */}
      {activeSection === 5 && (
        <div className="flex flex-col space-y-5 animate-fade-in">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                Chapitre IV • Section 5
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
                Développement & Distributivité
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              V. Développement : Distributivité simple, double & Crochet protecteur
            </h2>
          </div>

          {/* 1. Distributivité simple */}
          <div className="bg-slate-100/80 dark:bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm uppercase tracking-wide">
              1. Distributivité simple (avec facteur positif ou négatif)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-center">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-emerald-700 dark:text-emerald-300">
                <MathView latex="k(a + b) = ka + kb" display={true} />
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-emerald-700 dark:text-emerald-300">
                <MathView latex="k(a - b) = ka - kb" display={true} />
              </div>
            </div>
            <div className="space-y-1.5 text-xs font-mono text-slate-700 dark:text-slate-300 pt-1">
              <div>Exemple positif : <MathView latex="3(2x - 5) = 3 \times 2x - 3 \times 5 = 6x - 15" display={false} /></div>
              <div className="text-amber-700 dark:text-amber-300">Exemple facteur négatif : <MathView latex="-4x(3x - 2) = (-4x) \times (3x) - (-4x) \times 2 = -12x^2 + 8x" display={false} /></div>
            </div>
          </div>

          {/* 2. Double distributivité (Les 4 flèches) */}
          <div className="bg-slate-100/80 dark:bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-indigo-500/30 space-y-3">
            <h4 className="font-bold text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm uppercase tracking-wide flex items-center justify-between">
              <span>2. Double distributivité (La règle des 4 flèches)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-mono">
                (a+b)(c+d)
              </span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              Pour développer le produit de deux binômes, chaque terme du 1er facteur multiplie chaque terme du 2nd facteur :
            </p>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl text-center text-sm font-mono text-emerald-700 dark:text-emerald-300 border border-slate-200 dark:border-slate-800">
              <MathView latex="(a + b)(c + d) = ac + ad + bc + bd" display={true} />
            </div>

            <div className="p-4 bg-white/90 dark:bg-slate-900/90 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1">
              <span className="font-sans font-bold text-slate-900 dark:text-slate-100 block text-xs">Exemple complet avec termes négatifs :</span>
              <div><MathView latex="A = (2x - 3)(x + 4)" display={false} /></div>
              <div><MathView latex="A = 2x \times x + 2x \times 4 - 3 \times x - 3 \times 4" display={false} /></div>
              <div><MathView latex="A = 2x^2 + 8x - 3x - 12" display={false} /></div>
              <div className="text-emerald-600 dark:text-emerald-400 font-bold text-sm"><MathView latex="A = 2x^2 + 5x - 12" display={false} /></div>
            </div>

            <button
              onClick={() => onNavigateSubTab('moteur-developpement')}
              className="w-full p-3 rounded-xl bg-white dark:bg-red-600/30 border border-neutral-300 dark:border-red-500/40 text-black dark:text-red-200 text-xs flex items-center justify-between hover:bg-neutral-100 dark:hover:bg-red-600/50 transition-colors shadow-xs"
            >
              <span className="font-semibold">Voir le multiplicateur en ROUGE se déplacer sur chaque terme (Démo animée)</span>
              <ArrowRight className="w-4 h-4 text-red-600 dark:text-red-400" />
            </button>
          </div>

          {/* 3. L'ÉPREUVE ULTIME DU CONTRÔLE : Le crochet protecteur */}
          <div className="bg-rose-50/30 dark:bg-rose-950/30 p-4 sm:p-5 rounded-2xl border border-rose-500/50 space-y-3">
            <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 font-bold text-xs sm:text-sm uppercase tracking-wide">
              <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>3. Soustraction de deux produits : La méthode du crochet protecteur</span>
            </div>
            <p className="text-xs sm:text-sm text-rose-800 dark:text-rose-200 leading-relaxed">
              C'est la question reine des devoirs de 4e : que faire quand il y a un signe <strong className="text-slate-900 dark:text-white underline">« - » entre deux produits parenthésés</strong> ?
            </p>
            <div className="p-4 bg-slate-100 dark:bg-slate-950 rounded-xl border border-rose-200 dark:border-rose-900 text-xs font-mono space-y-2">
              <span className="font-sans font-bold text-slate-900 dark:text-white block text-xs">Modèle de rédaction parfait :</span>
              <div><MathView latex="E = (3x + 1)(x - 2) - (2x - 3)(x + 4)" display={false} /></div>
              <div className="text-amber-600 dark:text-amber-400 font-sans text-[11px]">Règle : On met obligatoirement des crochets protecteurs après le signe « - » !</div>
              <div><MathView latex="E = (3x^2 - 6x + x - 2) - [ 2x^2 + 8x - 3x - 12 ]" display={false} /></div>
              <div><MathView latex="E = (3x^2 - 5x - 2) - [ 2x^2 + 5x - 12 ]" display={false} /></div>
              <div className="text-rose-600 dark:text-rose-400 font-sans text-[11px]">On supprime les crochets en inversant TOUS les signes intérieurs :</div>
              <div><MathView latex="E = 3x^2 - 5x - 2 - 2x^2 - 5x + 12" display={false} /></div>
              <div className="text-emerald-600 dark:text-emerald-400 font-bold text-sm"><MathView latex="E = x^2 - 10x + 10" display={false} /></div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6 */}
      {activeSection === 6 && (
        <div className="flex flex-col space-y-5 animate-fade-in">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                Chapitre IV • Section 6
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-700 dark:text-pink-300 border border-pink-500/30">
                Formules Fondamentales
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              VI. Les 3 Identités Remarquables & Astuces de Calcul Mental
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            Les identités remarquables sont des raccourcis de développement instantané. Elles permettent de calculer sans poser les 4 multiplications intermédiaires.
          </p>

          {/* Formule 1 */}
          <div className="bg-slate-100/80 dark:bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-indigo-500/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm uppercase tracking-wide">
                1. Carré d'une somme : (a + b)²
              </h4>
              <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-mono">
                Identité n°1
              </span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl text-center font-mono text-slate-900 dark:text-white text-base font-bold border border-indigo-500/30">
              <MathView latex="(a + b)^2 = a^2 + 2ab + b^2" display={true} />
            </div>
            <div className="p-3 bg-white/90 dark:bg-slate-900/90 rounded-xl text-xs space-y-1 text-slate-700 dark:text-slate-300">
              <strong className="text-emerald-600 dark:text-emerald-400 block font-bold">Le terme 2ab est le DOUBLE PRODUIT !</strong>
              <div className="font-mono text-slate-700 dark:text-slate-300">
                <MathView latex="(3x + 4)^2 = (3x)^2 + 2 \times (3x) \times 4 + 4^2 = 9x^2 + 24x + 16" display={false} />
              </div>
              <div className="text-rose-700 dark:text-rose-300 text-[11px]">
                Piège : <MathView latex="(3x + 4)^2 \neq 9x^2 + 16" display={false} /> ! Ne JAMAIS oublier le terme du milieu <MathView latex="24x" display={false} />.
              </div>
            </div>
          </div>

          {/* Formule 2 */}
          <div className="bg-slate-100/80 dark:bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-pink-500/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-pink-700 dark:text-pink-300 text-xs sm:text-sm uppercase tracking-wide">
                2. Carré d'une différence : (a - b)²
              </h4>
              <span className="text-[11px] px-2 py-0.5 rounded bg-pink-500/20 text-pink-700 dark:text-pink-300 font-mono">
                Identité n°2
              </span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl text-center font-mono text-slate-900 dark:text-slate-100 text-base font-bold border border-pink-500/30">
              <MathView latex="(a - b)^2 = a^2 - 2ab + b^2" display={true} />
            </div>
            <div className="p-3 bg-white/90 dark:bg-slate-900/90 rounded-xl text-xs space-y-1 text-slate-700 dark:text-slate-300">
              <span className="text-slate-600 dark:text-slate-400 font-sans block text-[11px]">Remarquez : le signe - porte UNIQUEMENT sur le double produit ! Le terme <MathView latex="b^2" display={false} /> reste positif.</span>
              <div className="font-mono text-slate-700 dark:text-slate-300">
                <MathView latex="(2x - 5)^2 = (2x)^2 - 2 \times (2x) \times 5 + 5^2 = 4x^2 - 20x + 25" display={false} />
              </div>
            </div>
          </div>

          {/* Formule 3 */}
          <div className="bg-slate-100/80 dark:bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-emerald-500/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm uppercase tracking-wide">
                3. Produit d'une somme par sa différence : (a - b)(a + b)
              </h4>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono">
                Identité n°3
              </span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl text-center font-mono text-slate-900 dark:text-white text-base font-bold border border-emerald-500/30">
              <MathView latex="(a - b)(a + b) = a^2 - b^2" display={true} />
            </div>
            <div className="p-3 bg-white/90 dark:bg-slate-900/90 rounded-xl text-xs space-y-1 text-slate-700 dark:text-slate-300">
              <span className="text-slate-600 dark:text-slate-400 font-sans block text-[11px]">Ici, les deux termes du milieu s'annulent : <MathView latex="+ab - ab = 0" display={false} /> !</span>
              <div className="font-mono text-slate-700 dark:text-slate-300">
                <MathView latex="(5x - 3)(5x + 3) = (5x)^2 - 3^2 = 25x^2 - 9" display={false} />
              </div>
            </div>
          </div>

          {/* Calcul mental rapide */}
          <div className="bg-amber-50/30 dark:bg-amber-950/30 p-4 sm:p-5 rounded-2xl border border-amber-500/40 space-y-3">
            <h4 className="font-bold text-amber-700 dark:text-amber-300 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Astuces de calcul mental instantané grâce aux identités remarquables</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs font-mono text-amber-800 dark:text-amber-200">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-sans font-bold text-slate-900 dark:text-slate-100 block">Calcul de 103² :</span>
                <div><MathView latex="103^2 = (100 + 3)^2" display={false} /></div>
                <div><MathView latex="= 100^2 + 2(100)(3) + 3^2" display={false} /></div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold"><MathView latex="= 10000 + 600 + 9 = 10609" display={false} /></div>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-sans font-bold text-slate-900 dark:text-slate-100 block">Calcul de 98² :</span>
                <div><MathView latex="98^2 = (100 - 2)^2" display={false} /></div>
                <div><MathView latex="= 100^2 - 2(100)(2) + 2^2" display={false} /></div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold"><MathView latex="= 10000 - 400 + 4 = 9604" display={false} /></div>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-sans font-bold text-slate-900 dark:text-slate-100 block">Calcul de 105 × 95 :</span>
                <div><MathView latex="(100 + 5)(100 - 5)" display={false} /></div>
                <div><MathView latex="= 100^2 - 5^2" display={false} /></div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold"><MathView latex="= 10000 - 25 = 9975" display={false} /></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 7 */}
      {activeSection === 7 && (
        <div className="flex flex-col space-y-5 animate-fade-in">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                Chapitre IV • Section 7
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                Somme vers Produit
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              VII. Factorisation : Toutes les techniques de 4e (4 Méthodes)
            </h2>
          </div>

          <div className="bg-slate-100/80 dark:bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm uppercase tracking-wide">
              Définition et importance en mathématiques
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong className="text-slate-900 dark:text-white">Factoriser</strong>, c'est transformer une somme ou une différence de termes en un <strong className="text-emerald-600 dark:text-emerald-400">produit de facteurs</strong>. C'est l'opération inverse du développement, et c'est l'outil indispensable pour résoudre les équations du second degré.
            </p>
          </div>

          {/* Méthode 1 */}
          <div className="bg-slate-100/80 dark:bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-sky-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sky-600 dark:text-sky-400 text-xs sm:text-sm uppercase tracking-wide">
                Méthode 1 : Facteur commun monôme évident
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-700 dark:text-sky-300 font-mono">
                ka + kb = k(a + b)
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              On décompose chaque terme pour faire apparaître le plus grand diviseur commun ou la lettre commune :
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-sky-700 dark:text-sky-300">
                <div><MathView latex="15x + 25 = 5 \times 3x + 5 \times 5" display={false} /></div>
                <div className="text-slate-900 dark:text-white font-bold"><MathView latex="= 5(3x + 5)" display={false} /></div>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-sky-700 dark:text-sky-300">
                <div><MathView latex="6x^2 - 8x = 2x \times 3x - 2x \times 4" display={false} /></div>
                <div className="text-slate-900 dark:text-white font-bold"><MathView latex="= 2x(3x - 4)" display={false} /></div>
              </div>
            </div>
          </div>

          {/* Méthode 2 */}
          <div className="bg-slate-100/80 dark:bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-amber-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-amber-600 dark:text-amber-400 text-xs sm:text-sm uppercase tracking-wide">
                Méthode 2 : Facteur commun binôme (Parenthèse commune)
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono">
                (x+a)(...)
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Le facteur commun est toute une parenthèse identique présente dans chaque bloc :
            </p>
            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs text-amber-700 dark:text-amber-300 space-y-1">
              <div><MathView latex="A = (2x - 3)(x + 4) + (2x - 3)(3x - 5)" display={false} /></div>
              <div className="text-slate-600 dark:text-slate-400 text-[11px] font-sans">Le facteur commun est (2x - 3) :</div>
              <div><MathView latex="A = (2x - 3) [ (x + 4) + (3x - 5) ]" display={false} /></div>
              <div><MathView latex="A = (2x - 3) (x + 4 + 3x - 5)" display={false} /></div>
              <div className="text-slate-900 dark:text-white font-bold text-sm"><MathView latex="A = (2x - 3)(4x - 1)" display={false} /></div>
            </div>
          </div>

          {/* Méthode 3 */}
          <div className="bg-slate-100/80 dark:bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-rose-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-rose-600 dark:text-rose-400 text-xs sm:text-sm uppercase tracking-wide">
                Méthode 3 : Le terme « 1 » caché (Piège fréquent de 4e)
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-700 dark:text-rose-300 font-mono">
                (x+a)² + (x+a)
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Quand une parenthèse semble être toute seule à la fin, elle est en réalité multipliée par <strong className="text-slate-900 dark:text-white font-bold">1</strong> !
            </p>
            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs text-rose-700 dark:text-rose-300 space-y-1">
              <div><MathView latex="B = (x + 2)^2 + (x + 2)" display={false} /></div>
              <div className="text-slate-600 dark:text-slate-400 text-[11px] font-sans">On explicite le facteur 1 :</div>
              <div><MathView latex="B = (x + 2)(x + 2) + (x + 2) \times 1" display={false} /></div>
              <div><MathView latex="B = (x + 2) [ (x + 2) + 1 ]" display={false} /></div>
              <div className="text-slate-900 dark:text-white font-bold text-sm"><MathView latex="B = (x + 2)(x + 3)" display={false} /></div>
            </div>
          </div>

          {/* Méthode 4 */}
          <div className="bg-slate-100/80 dark:bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-emerald-500/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm uppercase tracking-wide">
                Méthode 4 : Utiliser l'identité remarquable a² - b² = (a - b)(a + b)
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono">
                Différence de deux carrés
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Quand il n'y a aucun facteur commun apparent mais qu'on a une soustraction de deux carrés :
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-emerald-700 dark:text-emerald-300">
                <span className="font-sans font-bold text-slate-900 dark:text-white block text-[11px]">Cas simple :</span>
                <div><MathView latex="9x^2 - 25 = (3x)^2 - 5^2" display={false} /></div>
                <div className="text-slate-900 dark:text-white font-bold"><MathView latex="= (3x - 5)(3x + 5)" display={false} /></div>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-emerald-700 dark:text-emerald-300">
                <span className="font-sans font-bold text-slate-900 dark:text-slate-100 block text-[11px]">Cas avec binôme :</span>
                <div><MathView latex="(2x + 1)^2 - 16 = (2x + 1)^2 - 4^2" display={false} /></div>
                <div><MathView latex="= [ (2x + 1) - 4 ] [ (2x + 1) + 4 ]" display={false} /></div>
                <div className="text-slate-900 dark:text-white font-bold"><MathView latex="= (2x - 3)(2x + 5)" display={false} /></div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateSubTab('moteur-factorisation')}
            className="w-full p-3 rounded-xl bg-white dark:bg-red-600/30 border border-neutral-300 dark:border-red-500/40 text-black dark:text-red-200 text-xs flex items-center justify-between hover:bg-neutral-100 dark:hover:bg-red-600/50 transition-colors shadow-xs"
          >
            <span className="font-semibold">Voir le facteur commun en ROUGE s'extraire dynamiquement (Moteur animé)</span>
            <ArrowRight className="w-4 h-4 text-red-600 dark:text-red-400" />
          </button>
        </div>
      )}

      {/* SECTION 8 */}
      {activeSection === 8 && (
        <div className="flex flex-col space-y-5 animate-fade-in">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                Chapitre IV • Section 8
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                Résolution Algébrique
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              VIII. Équations-produits nulles (A × B = 0) & Résolution de problèmes
            </h2>
          </div>

          {/* Propriété fondamentale */}
          <div className="bg-slate-100/80 dark:bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-amber-500/40 space-y-3">
            <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-bold text-xs sm:text-sm uppercase tracking-wide">
              <Target className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span>La Propriété fondamentale du produit nul</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
              Un produit de facteurs est nul <strong className="text-emerald-600 dark:text-emerald-400">si et seulement si au moins l'un des facteurs est nul</strong>.
            </p>
            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl text-center text-sm font-mono text-amber-700 dark:text-amber-300 border border-slate-200 dark:border-slate-800">
              <MathView latex="A \times B = 0 \iff A = 0 \quad \text{ou} \quad B = 0" display={true} />
            </div>
          </div>

          {/* Modèle de résolution rédigée pour le contrôle */}
          <div className="bg-slate-100/80 dark:bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm uppercase tracking-wide">
              Modèle de rédaction officiel attendu au BFEM
            </h4>
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-2">
              <p className="font-sans text-slate-700 dark:text-slate-300 text-xs">
                Résoudre dans <MathView latex="\mathbb{Q}" display={false} /> l'équation : <MathView latex="(3x - 6)(2x + 8) = 0" display={false} />
              </p>
              <div className="text-amber-600 dark:text-amber-400 font-sans text-[11px]">
                « Un produit de facteurs est nul si et seulement si l'un au moins de ses facteurs est nul. »
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-emerald-700 dark:text-emerald-300 pt-1">
                <div className="p-2.5 bg-slate-100 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-600 dark:text-slate-400 font-sans text-[10px]">Premier facteur :</div>
                  <div><MathView latex="3x - 6 = 0" display={false} /></div>
                  <div><MathView latex="3x = 6" display={false} /></div>
                  <div className="text-slate-900 dark:text-white font-bold"><MathView latex="x = \frac{6}{3} = 2" display={false} /></div>
                </div>
                <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-600 dark:text-slate-400 font-sans text-[10px]">Deuxième facteur :</div>
                  <div><MathView latex="2x + 8 = 0" display={false} /></div>
                  <div><MathView latex="2x = -8" display={false} /></div>
                  <div className="text-slate-900 dark:text-white font-bold"><MathView latex="x = \frac{-8}{2} = -4" display={false} /></div>
                </div>
              </div>
              <div className="text-emerald-600 dark:text-emerald-400 font-sans font-bold text-xs pt-1">
                Conclusion : L'équation admet deux solutions : <MathView latex="S = \{-4 ; 2\}" display={false} />.
              </div>
            </div>
          </div>

          {/* Problème géométrique appliqué */}
          <div className="bg-slate-100/80 dark:bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-indigo-500/30 space-y-3">
            <h4 className="font-bold text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm uppercase tracking-wide">
              Problème concret : Trouver les dimensions d'un terrain
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Un terrain rectangulaire a pour longueur <MathView latex="x + 3" display={false} /> et pour largeur <MathView latex="x - 2" display={false} />. On sait que son aire est nulle pour une valeur critique (surface de test). En résolvant <MathView latex="(x + 3)(x - 2) = 0" display={false} />, on trouve <MathView latex="x = -3" display={false} /> ou <MathView latex="x = 2" display={false} />. Une distance ne pouvant être négative, seule la valeur <MathView latex="x = 2" display={false} /> a un sens géométrique !
            </p>
          </div>
        </div>
      )}

      {/* SECTION 9 */}
      {activeSection === 9 && (
        <div className="flex flex-col space-y-5 animate-fade-in">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                Chapitre IV • Section 9
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                Fiche Mémo & Diagnostics
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              IX. Boîte à outils, Fiche mémo & Astuces de vérification au devoir
            </h2>
          </div>

          {/* Synthèse globale en un coup d'œil */}
          <div className="bg-slate-100/80 dark:bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm uppercase tracking-wide">
              1. Tableau synthétique de toutes les formules de Calcul Algébrique 4e
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                <thead className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-800 text-[11px]">
                  <tr>
                    <th className="p-2.5">Opération</th>
                    <th className="p-2.5">Formule générale</th>
                    <th className="p-2.5">Exemple d'application</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 font-mono text-[11px]">
                  <tr>
                    <td className="p-2.5 font-sans font-bold text-sky-600 dark:text-sky-400">Distributivité simple</td>
                    <td className="p-2.5 text-slate-800 dark:text-slate-200">k(a + b) = ka + kb</td>
                    <td className="p-2.5 text-emerald-700 dark:text-emerald-300">4(2x - 3) = 8x - 12</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-bold text-sky-600 dark:text-sky-400">Double distributivité</td>
                    <td className="p-2.5 text-slate-800 dark:text-slate-200">(a+b)(c+d) = ac + ad + bc + bd</td>
                    <td className="p-2.5 text-emerald-700 dark:text-emerald-300">(x+2)(x+3) = x² + 5x + 6</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-bold text-pink-600 dark:text-pink-400">Identité 1 (Somme²)</td>
                    <td className="p-2.5 text-slate-800 dark:text-slate-200">(a + b)² = a² + 2ab + b²</td>
                    <td className="p-2.5 text-pink-700 dark:text-pink-300">(2x + 3)² = 4x² + 12x + 9</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-bold text-pink-600 dark:text-pink-400">Identité 2 (Différence²)</td>
                    <td className="p-2.5 text-slate-800 dark:text-slate-200">(a - b)² = a² - 2ab + b²</td>
                    <td className="p-2.5 text-pink-700 dark:text-pink-300">(3x - 1)² = 9x² - 6x + 1</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-bold text-pink-600 dark:text-pink-400">Identité 3 (Différence de carrés)</td>
                    <td className="p-2.5 text-slate-800 dark:text-slate-200">(a - b)(a + b) = a² - b²</td>
                    <td className="p-2.5 text-pink-700 dark:text-pink-300">(4x - 5)(4x + 5) = 16x² - 25</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-bold text-amber-600 dark:text-amber-400">Factorisation parenthèse</td>
                    <td className="p-2.5 text-slate-800 dark:text-slate-200">k × A + k × B = k(A + B)</td>
                    <td className="p-2.5 text-amber-700 dark:text-amber-300">(x+1)(2x-3)+(x+1)(x+4)=(x+1)(3x+1)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-bold text-emerald-600 dark:text-emerald-400">Produit nul</td>
                    <td className="p-2.5 text-slate-800 dark:text-slate-200">A × B = 0 ⇔ A = 0 ou B = 0</td>
                    <td className="p-2.5 text-emerald-700 dark:text-emerald-300">(x-4)(2x+6)=0 ⇔ x=4 ou x=-3</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ASTUCE DE VÉRIFICATION EN 30 SECONDES AVEC TESTEUR INTERACTIF */}
          <div className="bg-indigo-50/30 dark:bg-indigo-950/30 p-4 sm:p-5 rounded-2xl border border-indigo-500/40 space-y-3">
            <div className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs sm:text-sm uppercase tracking-wide">
              <Lightbulb className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>L'Astuce secrète : Comment vérifier son développement au devoir en 30 secondes ?</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Pour être sûr à 100% que votre développement ou factorisation est correct sans attendre la correction du professeur :
              <strong className="text-slate-900 dark:text-white"> remplacez x par un petit nombre (comme 1 ou 2)</strong> dans l'expression initiale et dans votre résultat développé. Si vous trouvez exactement le même nombre, votre calcul est exact !
            </p>

            {/* Mini Simulateur de vérification interactif */}
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="font-bold text-slate-900 dark:text-white text-xs block">Testez cette astuce en direct :</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Expression initiale :</label>
                  <input
                    type="text"
                    value={testExprInit}
                    onChange={(e) => setTestExprInit(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-emerald-700 dark:text-emerald-300 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Votre développement :</label>
                  <input
                    type="text"
                    value={testExprDev}
                    onChange={(e) => setTestExprDev(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-indigo-700 dark:text-indigo-300 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Valeur de test (x) :</label>
                  <input
                    type="number"
                    value={testValueX}
                    onChange={(e) => setTestValueX(Number(e.target.value))}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-amber-700 dark:text-amber-300 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-mono">
                <div className="space-y-0.5">
                  <div>Valeur initiale pour x={testValueX} : <span className="text-emerald-600 dark:text-emerald-400 font-bold">{valInit !== null ? valInit : 'Erreur'}</span></div>
                  <div>Valeur développée pour x={testValueX} : <span className="text-indigo-600 dark:text-indigo-400 font-bold">{valDev !== null ? valDev : 'Erreur'}</span></div>
                </div>

                <div className="mt-2 sm:mt-0">
                  {isMatch ? (
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 flex items-center space-x-1.5 font-bold font-sans">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Parfait : Calcul 100% Validé !</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/40 flex items-center space-x-1.5 font-bold font-sans">
                      <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      <span>Différence détectée : Erreur de calcul !</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Les 5 erreurs éliminatoires */}
          <div className="bg-rose-50/30 dark:bg-rose-950/30 p-4 sm:p-5 rounded-2xl border border-rose-500/40 space-y-3">
            <h4 className="font-bold text-rose-700 dark:text-rose-300 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <span>Les 5 erreurs mortelles qui coûtent 10 points en devoir</span>
            </h4>
            <ul className="list-disc list-inside text-xs text-rose-800 dark:text-rose-200 space-y-2 pl-1">
              <li>
                <strong className="text-slate-900 dark:text-white">Oubli du double produit :</strong> Écrire <MathView latex="(x + 3)^2 = x^2 + 9" display={false} /> au lieu de <MathView latex="x^2 + 6x + 9" display={false} />.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Oubli du crochet protecteur après le signe moins :</strong> Dans <MathView latex="A - (B \times C)" display={false} />, développer sans crochets et ne changer que le premier signe.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Mélange des opérations :</strong> Confondre <MathView latex="x + x = 2x" display={false} /> et <MathView latex="x \times x = x^2" display={false} />.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Addition de familles différentes :</strong> Écrire <MathView latex="3x + 4 = 7x" display={false} /> ou <MathView latex="2x^2 + 3x = 5x^3" display={false} />.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Parenthèses manquantes au carré d'un monôme :</strong> Écrire <MathView latex="(3x)^2 = 3x^2" display={false} /> au lieu de <MathView latex="9x^2" display={false} />.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
