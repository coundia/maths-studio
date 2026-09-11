import crypto from 'crypto';
import { ExpressionSolution, MathStep } from '../src/types.js';

/**
 * FR-02: Syntactic normalization before hashing
 * - Strips all whitespace
 * - Converts to lowercase
 * - Replaces unicode minus and multiplication symbols
 * - Normalizes power notations (** to ^)
 */
export function normalizeExpression(expr: string): string {
  if (!expr) return '';
  let clean = expr.trim().toLowerCase();
  
  // Replace unicode minus signs
  clean = clean.replace(/[\u2212\u2013\u2014]/g, '-');
  // Replace unicode multiply
  clean = clean.replace(/[\u00D7\u22C5]/g, '*');
  // Strip all spaces
  clean = clean.replace(/\s+/g, '');
  // Normalize double asterisks to power
  clean = clean.replace(/\*\*/g, '^');
  
  // Convert standard x*2 (common user typo for x^2 in algebra if following ^ or preceded by polynomial context)
  // But if like 3*x normalize to 3x
  clean = clean.replace(/([0-9]+)\*([a-z])/g, '$1$2');
  clean = clean.replace(/([a-z])\*([0-9]+)/g, '$2$1');
  
  // Convert 'v' shortcut for square root: 2v2 -> 2sqrt(2), v2 -> sqrt(2)
  clean = clean.replace(/([0-9]+)v([0-9]+)/g, '$1sqrt($2)');
  clean = clean.replace(/(?<![a-z\\])v([0-9]+)/g, 'sqrt($1)');
  
  return clean;
}

/**
 * FR-03: Compute SHA-256 uniqueness key
 * hash = SHA256(operation_type + ":" + normalized_expr)
 */
export function computeExpressionHash(operationType: string, normalizedExpr: string): string {
  const content = `${operationType}:${normalizedExpr}`;
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * FR-05: Deterministic algebraic heuristic rules (< 15 ms, 0 AI calls)
 */
export function solveByHeuristic(rawExpr: string, normalizedExpr: string, operationType: string): ExpressionSolution | null {
  const startTime = Date.now();
  const hash = computeExpressionHash(operationType, normalizedExpr);

  // 0. Double distribution expansion: (ax + b)(cx + d) or (ax + b)^2
  const squaredBinomialMatch = normalizedExpr.match(/^\(([0-9]*)x([+-][0-9]+)\)\^2$/);
  const binomialProductMatch = normalizedExpr.match(/^\(([0-9]*)x([+-][0-9]+)\)\*?\(([0-9]*)x([+-][0-9]+)\)$/);

  if (squaredBinomialMatch || binomialProductMatch) {
    const a = (squaredBinomialMatch ? squaredBinomialMatch[1] : binomialProductMatch![1])
      ? parseInt(squaredBinomialMatch ? squaredBinomialMatch[1] : binomialProductMatch![1], 10)
      : 1;
    const b = parseInt(squaredBinomialMatch ? squaredBinomialMatch[2] : binomialProductMatch![2], 10);
    const c = squaredBinomialMatch
      ? a
      : (binomialProductMatch![3] ? parseInt(binomialProductMatch![3], 10) : 1);
    const d = squaredBinomialMatch
      ? b
      : parseInt(binomialProductMatch![4], 10);

    const term1 = a === 1 ? 'x' : `${a}x`;
    const term2Sign = b >= 0 ? '+' : '-';
    const term2Val = Math.abs(b);
    const term3 = c === 1 ? 'x' : `${c}x`;
    const term4Sign = d >= 0 ? '+' : '-';
    const term4Val = Math.abs(d);

    const F = a * c; // x^2 coeff
    const O = a * d; // outer x coeff
    const I = b * c; // inner x coeff
    const L = b * d; // constant
    const B = O + I; // total x coeff

    const fStr = F === 1 ? 'x^2' : `${F}x^2`;
    const oStr = O >= 0 ? `+ ${O}x` : `- ${Math.abs(O)}x`;
    const iStr = I >= 0 ? `+ ${I}x` : `- ${Math.abs(I)}x`;
    const lStr = L >= 0 ? `+ ${L}` : `- ${Math.abs(L)}`;

    let bStr = '';
    if (B === 1) bStr = '+ x';
    else if (B === -1) bStr = '- x';
    else if (B > 1) bStr = `+ ${B}x`;
    else if (B < -1) bStr = `- ${Math.abs(B)}x`;

    const finalLatex = `${fStr} ${bStr} ${lStr}`.trim();

    const steps: MathStep[] = [
      {
        stepNumber: 1,
        title: "Expression initiale & Règle de double distributivité",
        explanation: `Pour développer (${term1} ${term2Sign} ${term2Val})(${term3} ${term4Sign} ${term4Val}), chaque terme de la première parenthèse doit être multiplié par chacun des termes de la deuxième parenthèse.`,
        appliedRule: "Double distributivité : (a + b)(c + d) = a×c + a×d + b×c + b×d",
        latex: `(${term1} ${term2Sign} ${term2Val})(${term3} ${term4Sign} ${term4Val})`,
        visualState: {
          type: 'generic_algebra_3d',
          dimensions: { x: 4, a: Math.abs(b), b: Math.abs(d), depth: 0.5 },
          action: 'initial_state',
        },
        algebraAnimation: {
          type: 'initial',
          tokens: [
            { text: `(${term1}`, type: 'bracket', color: '#38bdf8' },
            { text: `${term2Sign} ${term2Val})`, type: 'bracket', color: '#f59e0b' },
            { text: `(${term3}`, type: 'bracket', color: '#818cf8' },
            { text: `${term4Sign} ${term4Val})`, type: 'bracket', color: '#ec4899' },
          ],
          activeExplanation: "On prépare les deux facteurs avant de distribuer chaque terme."
        }
      },
      {
        stepNumber: 2,
        title: "Distribution des 4 flèches de multiplication",
        explanation: `On trace les 4 multiplications : (${term1}) × (${term3}), puis (${term1}) × (${d}), puis (${b}) × (${term3}), et enfin (${b}) × (${d}).`,
        appliedRule: "Développement terme à terme",
        latex: `= ${term1} \\times ${term3} + ${term1} \\times (${d}) + (${b}) \\times ${term3} + (${b}) \\times (${d})`,
        visualState: {
          type: 'generic_algebra_3d',
          dimensions: { x: 4, a: Math.abs(b), b: Math.abs(d), depth: 0.5 },
          action: 'separate',
        },
        algebraAnimation: {
          type: 'distribution',
          distributingFactorText: `${term1} puis ${b >= 0 ? `+${b}` : b}`,
          arrows: [
            { fromIndex: 0, toIndex: 2, label: `${term1} × ${term3}`, color: '#ef4444' },
            { fromIndex: 0, toIndex: 3, label: `${term1} × (${d})`, color: '#ef4444' },
            { fromIndex: 1, toIndex: 2, label: `(${b}) × ${term3}`, color: '#ef4444' },
            { fromIndex: 1, toIndex: 3, label: `(${b}) × (${d})`, color: '#ef4444' },
          ],
          tokens: [
            { text: `${term1} × ${term3}`, type: 'product', color: '#ef4444', isDistributor: true, highlight: true },
            { text: `+`, type: 'operator' },
            { text: `${term1} × (${d})`, type: 'product', color: '#ef4444', isDistributor: true, highlight: true },
            { text: `+`, type: 'operator' },
            { text: `(${b}) × ${term3}`, type: 'product', color: '#ef4444', isDistributor: true, highlight: true },
            { text: `+`, type: 'operator' },
            { text: `(${b}) × (${d})`, type: 'product', color: '#ef4444', isDistributor: true, highlight: true },
          ],
          activeExplanation: "L'élément distributeur est en ROUGE et se déplace vers chaque terme du second facteur."
        }
      },
      {
        stepNumber: 3,
        title: "Calcul des 4 produits individuels (zéro disparition)",
        explanation: `On effectue chaque multiplication : ${term1} × ${term3} = ${fStr} ; ${term1} × (${d}) = ${O >= 0 ? `+${O}x` : `${O}x`} ; (${b}) × ${term3} = ${I >= 0 ? `+${I}x` : `${I}x`} ; (${b}) × (${d}) = ${L >= 0 ? `+${L}` : `${L}`}.`,
        appliedRule: "Multiplication des coefficients et puissances",
        latex: `= ${fStr} ${oStr} ${iStr} ${lStr}`,
        visualState: {
          type: 'generic_algebra_3d',
          dimensions: { x: 4, a: Math.abs(b), b: Math.abs(d), depth: 0.5 },
          action: 'rearrange',
        },
        algebraAnimation: {
          type: 'products',
          replacedTermsText: `Produits intermédiaires remplacés par leurs valeurs calculées`,
          tokens: [
            { text: fStr, type: 'variable', color: '#38bdf8' },
            { text: oStr, type: 'variable', color: '#818cf8' },
            { text: iStr, type: 'variable', color: '#f59e0b' },
            { text: lStr, type: 'constant', color: '#ec4899' },
          ],
          activeExplanation: "Chaque produit partiel est calculé avec son signe respectif."
        }
      },
      {
        stepNumber: 4,
        title: "Regroupement des termes semblables en x mis en ROUGE",
        explanation: `Les deux termes du milieu (${O >= 0 ? `${O}x` : `(${O}x)`} et ${I >= 0 ? `${I}x` : `(${I}x)`}) ont la même partie littérale x. On les additionne : (${O}) + (${I}) = ${B}.`,
        appliedRule: "Réduction des termes semblables (même puissance)",
        latex: `= ${fStr} + \\mathbf{[(${O})x + (${I})x]} ${lStr}`,
        visualState: {
          type: 'generic_algebra_3d',
          dimensions: { x: 4, a: Math.abs(b), b: Math.abs(d), depth: 0.5 },
          action: 'highlight',
        },
        algebraAnimation: {
          type: 'combine',
          replacedTermsText: `${oStr} ${iStr} remplacés par ${bStr}`,
          highlightPairs: [[1, 2]],
          tokens: [
            { text: fStr, type: 'variable', color: '#38bdf8' },
            { text: `[${oStr} ${iStr}]`, type: 'variable', color: '#ef4444', isReplaced: true, highlight: true },
            { text: lStr, type: 'constant', color: '#ec4899' },
          ],
          activeExplanation: "On met en ROUGE les termes en x à remplacer par leur somme !"
        }
      },
      {
        stepNumber: 5,
        title: "Forme finale développée et ordonnée",
        explanation: `L'expression est désormais sous sa forme développée, réduite et ordonnée par puissances décroissantes de x : ${finalLatex}.`,
        appliedRule: "Forme canonique polynômiale",
        latex: `= ${finalLatex}`,
        visualState: {
          type: 'generic_algebra_3d',
          dimensions: { x: 4, a: Math.abs(b), b: Math.abs(d), depth: 0.5 },
          action: 'final_factored',
        },
        algebraAnimation: {
          type: 'final',
          tokens: [
            { text: fStr, type: 'variable', color: '#38bdf8' },
            { text: bStr, type: 'variable', color: '#10b981', highlight: true },
            { text: lStr, type: 'constant', color: '#ec4899' },
          ],
          activeExplanation: "Résultat final développé et réduit !"
        }
      }
    ];

    return {
      id: hash,
      rawExpression: rawExpr,
      normalizedExpression: normalizedExpr,
      operationType: 'expansion',
      finalFormLatex: finalLatex,
      summary: `Développement par double distributivité : ${rawExpr} = ${finalLatex}.`,
      source: 'heuristic',
      cachedAt: new Date().toISOString(),
      latencyMs: Math.max(1, Date.now() - startTime),
      steps,
    };
  }

  // 1. Difference of squares: a^2 * x^2 - b^2 OR x^2 - a^2
  // Regex matches: (kx)^2 - a^2 or kx^2 - a^2 or x^2 - N
  const diffSquaresMatch = normalizedExpr.match(/^(?:([0-9]*)x\^2|x\^2)-([0-9]+)$/);
  if (diffSquaresMatch) {
    const kStr = diffSquaresMatch[1];
    const k = kStr ? parseInt(kStr, 10) : 1;
    const n = parseInt(diffSquaresMatch[2], 10);
    const sqrtK = Math.sqrt(k);
    const sqrtN = Math.sqrt(n);

    if (Number.isInteger(sqrtK) && Number.isInteger(sqrtN) && sqrtN > 0) {
      const a = sqrtN;
      const coeff = sqrtK;
      const steps: MathStep[] = [
        {
          stepNumber: 1,
          title: "Identification de la forme a² - b²",
          explanation: `L'expression est une différence de deux carrés parfaits : (${coeff === 1 ? 'x' : `${coeff}x`})² et ${a}² car ${a}² = ${n}. En géométrie 3D, cela représente un grand pavé d'aire (${coeff === 1 ? 'x' : `${coeff}x`})² auquel on souhaite retrancher un coin carré de côté ${a}.`,
          appliedRule: "Identité remarquable : a² - b² = (a - b)(a + b)",
          latex: coeff === 1 
            ? `x^2 - ${n} = x^2 - ${a}^2`
            : `${k}x^2 - ${n} = (${coeff}x)^2 - ${a}^2`,
          visualState: {
            type: 'difference_of_squares_3d',
            dimensions: { x: 5, a: Math.min(2.5, Math.max(1.2, (a / (coeff * 3)) * 2.5)), depth: 0.8 },
            action: 'initial_state',
            cutoutProgress: 0,
            slideProgress: 0,
            rotationAngle: 0,
            labels: [
              { text: coeff === 1 ? "x" : `${coeff}x`, position: [0, -2.8, 0], color: "#38bdf8" },
              { text: coeff === 1 ? "x" : `${coeff}x`, position: [-2.8, 0, 0], color: "#38bdf8" },
              { text: `Aire = ${coeff === 1 ? "x" : `${coeff}x`}²`, position: [0, 0, 0.6], color: "#818cf8" },
            ]
          }
        },
        {
          stepNumber: 2,
          title: `Découpe du bloc coin de taille ${a} × ${a}`,
          explanation: `On découpe et extrait le bloc d'aire ${a}² situé au coin supérieur droit. L'espace restant forme une surface en « L » d'aire exactement égale à (${coeff === 1 ? 'x' : `${coeff}x`})² - ${a}².`,
          appliedRule: "Soustraction géométrique de volumes",
          latex: coeff === 1
            ? `\\text{Aire restante} = x^2 - ${a}^2`
            : `\\text{Aire restante} = (${coeff}x)^2 - ${a}^2`,
          visualState: {
            type: 'difference_of_squares_3d',
            dimensions: { x: 5, a: Math.min(2.5, Math.max(1.2, (a / (coeff * 3)) * 2.5)), depth: 0.8 },
            action: 'slice_cut',
            cutoutProgress: 0.6,
            slideProgress: 0,
            rotationAngle: 0,
            labels: [
              { text: `Retrait -${a}²`, position: [1.8, 1.8, 1.2], color: "#f43f5e" },
              { text: `${a}`, position: [2.8, 1.8, 0], color: "#fb7185" },
            ]
          }
        },
        {
          stepNumber: 3,
          title: "Partition en deux sous-rectangles R₁ et R₂",
          explanation: `Pour factoriser la surface en « L », on la scinde en deux rectangles contigus : le rectangle R₁ de dimensions (${coeff === 1 ? 'x' : `${coeff}x`} - ${a}) × (${coeff === 1 ? 'x' : `${coeff}x`}) et le rectangle R₂ de dimensions (${coeff === 1 ? 'x' : `${coeff}x`} - ${a}) × ${a}.`,
          appliedRule: "Décomposition polygonale",
          latex: coeff === 1
            ? `R_1 = (x - ${a}) \\times x \\quad \\text{et} \\quad R_2 = (x - ${a}) \\times ${a}`
            : `R_1 = (${coeff}x - ${a}) \\times ${coeff}x \\quad \\text{et} \\quad R_2 = (${coeff}x - ${a}) \\times ${a}`,
          visualState: {
            type: 'difference_of_squares_3d',
            dimensions: { x: 5, a: Math.min(2.5, Math.max(1.2, (a / (coeff * 3)) * 2.5)), depth: 0.8 },
            action: 'separate',
            cutoutProgress: 1.0,
            slideProgress: 0.25,
            rotationAngle: 0,
            labels: [
              { text: "R₁", position: [-0.8, 0, 0.6], color: "#38bdf8" },
              { text: "R₂", position: [1.8, -0.8, 0.6], color: "#a855f7" },
              { text: `${coeff === 1 ? 'x' : `${coeff}x`} - ${a}`, position: [-2.8, -0.5, 0], color: "#e2e8f0" },
            ]
          }
        },
        {
          stepNumber: 4,
          title: "Rotation et translation de R₂ vers R₁",
          explanation: `Le rectangle R₂ pivote à 90° et vient s'aligner parfaitement le long de R₁ car ils partagent la même dimension commune (${coeff === 1 ? 'x' : `${coeff}x`} - ${a}).`,
          appliedRule: "Isométrie & Transformation géométrique",
          latex: coeff === 1
            ? `\\text{Aire} = (x - ${a}) \\times x + (x - ${a}) \\times ${a} = (x - ${a})(x + ${a})`
            : `\\text{Aire} = (${coeff}x - ${a})(${coeff}x + ${a})`,
          visualState: {
            type: 'difference_of_squares_3d',
            dimensions: { x: 5, a: Math.min(2.5, Math.max(1.2, (a / (coeff * 3)) * 2.5)), depth: 0.8 },
            action: 'rearrange',
            cutoutProgress: 1.0,
            slideProgress: 0.75,
            rotationAngle: Math.PI / 2,
            labels: [
              { text: "Alignement R₁ + R₂", position: [0, 1.2, 0.8], color: "#10b981" },
            ]
          }
        },
        {
          stepNumber: 5,
          title: "Forme factorisée finale : un unique rectangle",
          explanation: `Les deux rectangles fusionnent pour créer un unique grand rectangle de longueur (${coeff === 1 ? 'x' : `${coeff}x`} + ${a}) et de largeur (${coeff === 1 ? 'x' : `${coeff}x`} - ${a}). L'aire totale vaut le produit des dimensions !`,
          appliedRule: "Identité remarquable validée",
          latex: coeff === 1
            ? `x^2 - ${n} = (x - ${a})(x + ${a})`
            : `${k}x^2 - ${n} = (${coeff}x - ${a})(${coeff}x + ${a})`,
          visualState: {
            type: 'difference_of_squares_3d',
            dimensions: { x: 5, a: Math.min(2.5, Math.max(1.2, (a / (coeff * 3)) * 2.5)), depth: 0.8 },
            action: 'final_factored',
            cutoutProgress: 1.0,
            slideProgress: 1.0,
            rotationAngle: Math.PI / 2,
            labels: [
              { text: `Longueur = ${coeff === 1 ? 'x' : `${coeff}x`} + ${a}`, position: [0, -2.4, 0], color: "#10b981" },
              { text: `Largeur = ${coeff === 1 ? 'x' : `${coeff}x`} - ${a}`, position: [-3.4, 0, 0], color: "#38bdf8" },
            ]
          }
        }
      ];

      return {
        id: hash,
        rawExpression: rawExpr,
        normalizedExpression: normalizedExpr,
        operationType: 'factorization',
        finalFormLatex: coeff === 1 ? `(x - ${a})(x + ${a})` : `(${coeff}x - ${a})(${coeff}x + ${a})`,
        summary: `Factorisation de la différence de deux carrés par réagencement géométrique d'aires.`,
        source: 'heuristic',
        cachedAt: new Date().toISOString(),
        latencyMs: Math.max(1, Date.now() - startTime),
        steps,
      };
    }
  }

  // 2. Monomial common factor: ax + ab or ax - ab
  // Regex: ([0-9]+)x([+-])([0-9]+)
  const commonFactorMatch = normalizedExpr.match(/^([0-9]+)x([+-])([0-9]+)$/);
  if (commonFactorMatch) {
    const aCoeff = parseInt(commonFactorMatch[1], 10);
    const sign = commonFactorMatch[2];
    const bConst = parseInt(commonFactorMatch[3], 10);

    // Compute GCD of aCoeff and bConst
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const factor = gcd(aCoeff, bConst);

    if (factor > 1) {
      const remX = aCoeff / factor;
      const remConst = bConst / factor;
      const remXStr = remX === 1 ? 'x' : `${remX}x`;
      const insideTerm = `${remXStr} ${sign} ${remConst}`;
      const factorStr = `${factor}`;
      
      const steps: MathStep[] = [
        {
          stepNumber: 1,
          title: "Expression initiale & Identification des termes",
          explanation: `Dans l'expression ${aCoeff}x ${sign} ${bConst}, on a deux termes séparés par le signe ${sign}. On cherche le plus grand facteur commun (PGCD(${aCoeff}, ${bConst}) = ${factor}).`,
          appliedRule: "Identification de la somme algébrique",
          latex: `${aCoeff}x ${sign} ${bConst}`,
          visualState: {
            type: 'common_factor_3d',
            dimensions: { x: 4, a: factor, b: remConst, depth: 1.0 },
            action: 'initial_state',
            labels: [
              { text: `${aCoeff}x`, position: [-1.5, 0, 0.6], color: "#38bdf8" },
              { text: `${sign}${bConst}`, position: [1.8, 0, 0.6], color: "#f59e0b" },
            ]
          },
          algebraAnimation: {
            type: 'initial',
            tokens: [
              { text: `${aCoeff}x`, type: 'variable', color: '#38bdf8' },
              { text: sign, type: 'operator' },
              { text: `${bConst}`, type: 'constant', color: '#f59e0b' },
            ],
            activeExplanation: "Deux termes distincts avant factorisation."
          }
        },
        {
          stepNumber: 2,
          title: `Décomposition & Révélation du facteur commun en ROUGE (${factor})`,
          explanation: `On décompose chaque terme : ${aCoeff}x = ${factor} × ${remXStr} et ${bConst} = ${factor} × ${remConst}. Le nombre ${factor} apparaît en ROUGE dans chaque bloc : c'est notre facteur commun !`,
          appliedRule: "Décomposition en facteurs : k × u + k × v",
          latex: `= {\\color{red}${factorStr}} \\times ${remXStr} ${sign} {\\color{red}${factorStr}} \\times ${remConst}`,
          visualState: {
            type: 'common_factor_3d',
            dimensions: { x: 4, a: factor, b: remConst, depth: 1.0 },
            action: 'highlight',
            highlightColor: "#ef4444",
            labels: [
              { text: `Facteur commun = ${factor}`, position: [-3.2, 0, 0], color: "#ef4444" },
              { text: remXStr, position: [-1.5, -2, 0], color: "#38bdf8" },
              { text: `${remConst}`, position: [1.8, -2, 0], color: "#f59e0b" },
            ]
          },
          algebraAnimation: {
            type: 'factorization',
            commonFactorText: factorStr,
            factorizationPhase: 'reveal_red',
            tokens: [
              { text: factorStr, type: 'constant', color: '#ef4444', isCommonFactor: true, highlight: true },
              { text: '×', type: 'operator' },
              { text: remXStr, type: 'variable', color: '#38bdf8', isRemaining: true },
              { text: sign, type: 'operator' },
              { text: factorStr, type: 'constant', color: '#ef4444', isCommonFactor: true, highlight: true },
              { text: '×', type: 'operator' },
              { text: `${remConst}`, type: 'constant', color: '#f59e0b', isRemaining: true },
            ],
            activeExplanation: `Le chiffre ${factor} est mis en évidence en ROUGE dans chaque terme.`
          }
        },
        {
          stepNumber: 3,
          title: "Déplacement visible & Mise en tête du facteur rouge",
          explanation: `Les chiffres ${factor} en rouge quittent leurs termes d'origine et glissent physiquement vers l'avant (à gauche) pour être mis en facteur devant les crochets.`,
          appliedRule: "Distributivité inverse : k × a + k × b = k(a + b)",
          latex: `= {\\color{red}${factorStr}} \\times [${remXStr} ${sign} ${remConst}]`,
          visualState: {
            type: 'common_factor_3d',
            dimensions: { x: 4, a: factor, b: remConst, depth: 1.0 },
            action: 'rearrange',
            labels: [
              { text: `Facteur rouge ${factor} en tête`, position: [-3.2, 0, 0], color: "#ef4444" },
              { text: `[${insideTerm}]`, position: [0, -2, 0], color: "#10b981" },
            ]
          },
          algebraAnimation: {
            type: 'factor_extraction',
            commonFactorText: factorStr,
            factorizationPhase: 'extract_front',
            tokens: [
              { text: factorStr, type: 'constant', color: '#ef4444', isCommonFactor: true, highlight: true },
              { text: '×', type: 'operator' },
              { text: '[', type: 'bracket' },
              { text: remXStr, type: 'variable', color: '#38bdf8', isRemaining: true },
              { text: sign, type: 'operator' },
              { text: `${remConst}`, type: 'constant', color: '#f59e0b', isRemaining: true },
              { text: ']', type: 'bracket' },
            ],
            activeExplanation: `Le facteur rouge ${factor} est déplacé en tête et les restes sont enfermés entre crochets.`
          }
        },
        {
          stepNumber: 4,
          title: "Forme factorisée finale",
          explanation: `L'expression est désormais écrite sous la forme d'un produit irréductible : ${factor}(${insideTerm}). Vérification : ${factor} × ${remXStr} = ${aCoeff}x et ${factor} × ${remConst} = ${bConst}.`,
          appliedRule: "Produit de facteurs obtenu",
          latex: `= ${factor}(${insideTerm})`,
          visualState: {
            type: 'common_factor_3d',
            dimensions: { x: 4, a: factor, b: remConst, depth: 1.0 },
            action: 'final_factored',
            labels: [
              { text: `Facteur ${factor}`, position: [-3.2, 0, 0], color: "#ef4444" },
              { text: `(${insideTerm})`, position: [0, -2, 0], color: "#10b981" },
            ]
          },
          algebraAnimation: {
            type: 'final',
            commonFactorText: factorStr,
            factorizationPhase: 'simplified',
            tokens: [
              { text: factorStr, type: 'constant', color: '#ef4444', isCommonFactor: true, highlight: true },
              { text: '(', type: 'bracket' },
              { text: insideTerm, type: 'variable', color: '#10b981' },
              { text: ')', type: 'bracket' },
            ],
            activeExplanation: "Factorisation achevée avec succès !"
          }
        }
      ];

      return {
        id: hash,
        rawExpression: rawExpr,
        normalizedExpression: normalizedExpr,
        operationType: 'factorization',
        finalFormLatex: `${factor}(${insideTerm})`,
        summary: `Mise en facteur commun de ${factor} avec mise en rouge et déplacement des termes.`,
        source: 'heuristic',
        cachedAt: new Date().toISOString(),
        latencyMs: Math.max(1, Date.now() - startTime),
        steps,
      };
    }
  }

  // 2b. Monomial with variable x: ax^2 + bx or ax^2 - bx
  // Matches 6x^2 - 8x, 5x^2 + 15x, 7x^2 + 14x, x^2 - 5x
  const monomialXMatch = normalizedExpr.match(/^([0-9]*)x\^2([+-])([0-9]+)x$/);
  if (monomialXMatch) {
    const aCoeff = monomialXMatch[1] ? parseInt(monomialXMatch[1], 10) : 1;
    const sign = monomialXMatch[2];
    const bCoeff = parseInt(monomialXMatch[3], 10);

    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const kNum = gcd(aCoeff, bCoeff);
    const remA = aCoeff / kNum;
    const remB = bCoeff / kNum;

    const commonFactorStr = kNum === 1 ? 'x' : `${kNum}x`;
    const remAStr = remA === 1 ? 'x' : `${remA}x`;
    const insideTerm = `${remAStr} ${sign} ${remB}`;
    const finalLatex = `${commonFactorStr}(${insideTerm})`;

    const steps: MathStep[] = [
      {
        stepNumber: 1,
        title: "Expression initiale & Repérage de la lettre commune x",
        explanation: `Dans l'expression ${aCoeff === 1 ? 'x^2' : `${aCoeff}x^2`} ${sign} ${bCoeff}x, la variable x est présente dans chaque terme. On cherche le plus grand coefficient commun : PGCD(${aCoeff}, ${bCoeff}) = ${kNum}.`,
        appliedRule: "Facteur monôme de la forme k × x",
        latex: `${aCoeff === 1 ? 'x^2' : `${aCoeff}x^2`} ${sign} ${bCoeff}x`,
        visualState: {
          type: 'common_factor_3d',
          dimensions: { x: 4, a: kNum, b: remB, depth: 1.0 },
          action: 'initial_state',
        },
        algebraAnimation: {
          type: 'initial',
          tokens: [
            { text: `${aCoeff === 1 ? 'x^2' : `${aCoeff}x^2`}`, type: 'variable', color: '#38bdf8' },
            { text: sign, type: 'operator' },
            { text: `${bCoeff}x`, type: 'variable', color: '#f59e0b' },
          ]
        }
      },
      {
        stepNumber: 2,
        title: `Décomposition & Mise en ROUGE du facteur commun (${commonFactorStr})`,
        explanation: `On fait apparaître explicitement ${commonFactorStr} : ${aCoeff === 1 ? 'x^2' : `${aCoeff}x^2`} = ${commonFactorStr} × ${remAStr} et ${bCoeff}x = ${commonFactorStr} × ${remB}. Le facteur ${commonFactorStr} est allumé en ROUGE !`,
        appliedRule: "Écriture kx × u + kx × v",
        latex: `= {\\color{red}${commonFactorStr}} \\times ${remAStr} ${sign} {\\color{red}${commonFactorStr}} \\times ${remB}`,
        visualState: {
          type: 'common_factor_3d',
          dimensions: { x: 4, a: kNum, b: remB, depth: 1.0 },
          action: 'highlight',
          highlightColor: "#ef4444",
        },
        algebraAnimation: {
          type: 'factorization',
          commonFactorText: commonFactorStr,
          factorizationPhase: 'reveal_red',
          tokens: [
            { text: commonFactorStr, type: 'variable', color: '#ef4444', isCommonFactor: true, highlight: true },
            { text: '×', type: 'operator' },
            { text: remAStr, type: 'variable', color: '#38bdf8', isRemaining: true },
            { text: sign, type: 'operator' },
            { text: commonFactorStr, type: 'variable', color: '#ef4444', isCommonFactor: true, highlight: true },
            { text: '×', type: 'operator' },
            { text: `${remB}`, type: 'constant', color: '#f59e0b', isRemaining: true },
          ],
          activeExplanation: `Le facteur commun ${commonFactorStr} est mis en rouge.`
        }
      },
      {
        stepNumber: 3,
        title: "Déplacement physique des termes vers la gauche",
        explanation: `Le monôme rouge ${commonFactorStr} est déplacé vers l'avant à l'extérieur des crochets. Les restes (${remAStr} et ${remB}) sont réunis dans le crochet.`,
        appliedRule: "Distributivité inverse",
        latex: `= {\\color{red}${commonFactorStr}} \\times [${insideTerm}]`,
        visualState: {
          type: 'common_factor_3d',
          dimensions: { x: 4, a: kNum, b: remB, depth: 1.0 },
          action: 'rearrange',
        },
        algebraAnimation: {
          type: 'factor_extraction',
          commonFactorText: commonFactorStr,
          factorizationPhase: 'extract_front',
          tokens: [
            { text: commonFactorStr, type: 'variable', color: '#ef4444', isCommonFactor: true, highlight: true },
            { text: '×', type: 'operator' },
            { text: '[', type: 'bracket' },
            { text: remAStr, type: 'variable', color: '#38bdf8', isRemaining: true },
            { text: sign, type: 'operator' },
            { text: `${remB}`, type: 'constant', color: '#f59e0b', isRemaining: true },
            { text: ']', type: 'bracket' },
          ],
          activeExplanation: `Déplacement du facteur rouge ${commonFactorStr} en tête.`
        }
      },
      {
        stepNumber: 4,
        title: "Résultat final factorisé",
        explanation: `L'expression est désormais factorisée : ${finalLatex}.`,
        appliedRule: "Forme factorisée irréductible",
        latex: `= ${finalLatex}`,
        visualState: {
          type: 'common_factor_3d',
          dimensions: { x: 4, a: kNum, b: remB, depth: 1.0 },
          action: 'final_factored',
        },
        algebraAnimation: {
          type: 'final',
          commonFactorText: commonFactorStr,
          factorizationPhase: 'simplified',
          tokens: [
            { text: commonFactorStr, type: 'variable', color: '#ef4444', isCommonFactor: true, highlight: true },
            { text: '(', type: 'bracket' },
            { text: insideTerm, type: 'variable', color: '#10b981' },
            { text: ')', type: 'bracket' },
          ]
        }
      }
    ];

    return {
      id: hash,
      rawExpression: rawExpr,
      normalizedExpression: normalizedExpr,
      operationType: 'factorization',
      finalFormLatex: finalLatex,
      summary: `Factorisation de ${rawExpr} = ${finalLatex} avec facteur commun ${commonFactorStr} en rouge.`,
      source: 'heuristic',
      cachedAt: new Date().toISOString(),
      latencyMs: Math.max(1, Date.now() - startTime),
      steps,
    };
  }

  // 2c. Binomial common factor: (ax+b)(cx+d) + (ax+b)(ex+f) or (ax+b)(cx+d) - (ax+b)(ex+f)
  const binomialCommonMatch = normalizedExpr.match(/^\(([0-9]*)x([+-][0-9]+)\)\*?\(([0-9]*)x([+-][0-9]+)\)([+-])\(([0-9]*)x([+-][0-9]+)\)\*?\(([0-9]*)x([+-][0-9]+)\)$/);
  if (binomialCommonMatch) {
    const p1a = binomialCommonMatch[1];
    const p1b = binomialCommonMatch[2];
    const p2a = binomialCommonMatch[3];
    const p2b = binomialCommonMatch[4];
    const middleSign = binomialCommonMatch[5]; // + or -
    const p3a = binomialCommonMatch[6];
    const p3b = binomialCommonMatch[7];
    const p4a = binomialCommonMatch[8];
    const p4b = binomialCommonMatch[9];

    const f1 = `(${p1a}x${p1b})`;
    const f2 = `(${p2a}x${p2b})`;
    const f3 = `(${p3a}x${p3b})`;
    const f4 = `(${p4a}x${p4b})`;

    // Check if f1 == f3 or f1 == f4 or f2 == f3 or f2 == f4
    let common = '';
    let rem1 = '';
    let rem2 = '';

    if (f1 === f3) {
      common = f1;
      rem1 = f2;
      rem2 = f4;
    } else if (f1 === f4) {
      common = f1;
      rem1 = f2;
      rem2 = f3;
    } else if (f2 === f3) {
      common = f2;
      rem1 = f1;
      rem2 = f4;
    } else if (f2 === f4) {
      common = f2;
      rem1 = f1;
      rem2 = f3;
    }

    if (common) {
      const steps: MathStep[] = [
        {
          stepNumber: 1,
          title: "Expression de départ & Détection du binôme répété",
          explanation: `L'expression est composée de deux produits. On remarque immédiatement la présence du binôme ${common} dans les deux termes.`,
          appliedRule: "Somme de deux produits",
          latex: `${f1}${f2} ${middleSign} ${f3}${f4}`,
          visualState: {
            type: 'generic_algebra_3d',
            dimensions: { x: 4, a: 2, b: 3, depth: 0.8 },
            action: 'initial_state',
          },
          algebraAnimation: {
            type: 'initial',
            tokens: [
              { text: f1, type: 'bracket', color: f1 === common ? '#ef4444' : '#38bdf8' },
              { text: f2, type: 'bracket', color: f2 === common ? '#ef4444' : '#38bdf8' },
              { text: middleSign, type: 'operator' },
              { text: f3, type: 'bracket', color: f3 === common ? '#ef4444' : '#f59e0b' },
              { text: f4, type: 'bracket', color: f4 === common ? '#ef4444' : '#f59e0b' },
            ]
          }
        },
        {
          stepNumber: 2,
          title: `Mise en ROUGE du facteur commun ${common}`,
          explanation: `Le binôme ${common} est identifié comme le facteur commun. On le met en valeur en ROUGE dans chaque groupe de termes.`,
          appliedRule: "Révélation du facteur commun",
          latex: `= {\\color{red}${common}} \\times ${rem1} ${middleSign} {\\color{red}${common}} \\times ${rem2}`,
          visualState: {
            type: 'generic_algebra_3d',
            dimensions: { x: 4, a: 2, b: 3, depth: 0.8 },
            action: 'highlight',
            highlightColor: "#ef4444",
          },
          algebraAnimation: {
            type: 'factorization',
            commonFactorText: common,
            factorizationPhase: 'reveal_red',
            tokens: [
              { text: common, type: 'bracket', color: '#ef4444', isCommonFactor: true, highlight: true },
              { text: '×', type: 'operator' },
              { text: rem1, type: 'bracket', color: '#38bdf8', isRemaining: true },
              { text: middleSign, type: 'operator' },
              { text: common, type: 'bracket', color: '#ef4444', isCommonFactor: true, highlight: true },
              { text: '×', type: 'operator' },
              { text: rem2, type: 'bracket', color: '#f59e0b', isRemaining: true },
            ]
          }
        },
        {
          stepNumber: 3,
          title: "Déplacement vers l'avant & Regroupement dans les crochets",
          explanation: `Le facteur rouge ${common} glisse physiquement vers l'avant (à gauche) pour n'apparaître qu'une seule fois. On ouvre de grands crochets [ ... ] pour y ranger tout ce qui reste : ${rem1} ${middleSign} ${rem2}.`,
          appliedRule: "Distributivité inverse : k × A + k × B = k[A + B]",
          latex: `= {\\color{red}${common}} \\times [${rem1} ${middleSign} ${rem2}]`,
          visualState: {
            type: 'generic_algebra_3d',
            dimensions: { x: 4, a: 2, b: 3, depth: 0.8 },
            action: 'rearrange',
          },
          algebraAnimation: {
            type: 'factor_extraction',
            commonFactorText: common,
            factorizationPhase: 'extract_front',
            tokens: [
              { text: common, type: 'bracket', color: '#ef4444', isCommonFactor: true, highlight: true },
              { text: '×', type: 'operator' },
              { text: '[', type: 'bracket' },
              { text: rem1, type: 'bracket', color: '#38bdf8', isRemaining: true },
              { text: middleSign, type: 'operator' },
              { text: rem2, type: 'bracket', color: '#f59e0b', isRemaining: true },
              { text: ']', type: 'bracket' },
            ]
          }
        },
        {
          stepNumber: 4,
          title: "Réduction des termes intérieurs au crochet",
          explanation: `On supprime les parenthèses intérieures dans le crochet en respectant scrupuleusement la règle des signes${middleSign === '-' ? ' (le signe - change tous les signes du second terme !)' : ''}.`,
          appliedRule: "Réduction des termes semblables",
          latex: `= ${common} \\times [${rem1.replace(/[()]/g, '')} ${middleSign === '-' ? `- (${rem2.replace(/[()]/g, '')})` : `+ ${rem2.replace(/[()]/g, '')}`}]`,
          visualState: {
            type: 'generic_algebra_3d',
            dimensions: { x: 4, a: 2, b: 3, depth: 0.8 },
            action: 'final_factored',
          },
          algebraAnimation: {
            type: 'final',
            commonFactorText: common,
            factorizationPhase: 'simplified',
            tokens: [
              { text: common, type: 'bracket', color: '#ef4444', isCommonFactor: true, highlight: true },
              { text: '×', type: 'operator' },
              { text: `[${rem1} ${middleSign} ${rem2}]`, type: 'bracket', color: '#10b981' },
            ]
          }
        }
      ];

      return {
        id: hash,
        rawExpression: rawExpr,
        normalizedExpression: normalizedExpr,
        operationType: 'factorization',
        finalFormLatex: `${common}[${rem1} ${middleSign} ${rem2}]`,
        summary: `Factorisation par binôme commun ${common} en rouge avec déplacement des termes.`,
        source: 'heuristic',
        cachedAt: new Date().toISOString(),
        latencyMs: Math.max(1, Date.now() - startTime),
        steps,
      };
    }
  }

  // 3. Perfect square trinomial: x^2 + 2ax + a^2 or x^2 - 2ax + a^2
  // Regex: x^2([+-])([0-9]+)x\+([0-9]+)
  const perfectSquareMatch = normalizedExpr.match(/^x\^2([+-])([0-9]+)x\+([0-9]+)$/);
  if (perfectSquareMatch) {
    const sign = perfectSquareMatch[1];
    const b = parseInt(perfectSquareMatch[2], 10);
    const c = parseInt(perfectSquareMatch[3], 10);
    
    const a = b / 2;
    if (Number.isInteger(a) && a * a === c && a > 0) {
      const steps: MathStep[] = [
        {
          stepNumber: 1,
          title: `Reconnaissance du carré parfait (a ${sign} b)²`,
          explanation: `Dans x² ${sign} ${b}x + ${c}, on constate que ${c} = ${a}² et ${b}x = 2 × ${a} × x. Cela correspond à l'identité remarquable d'un carré parfait.`,
          appliedRule: sign === '+' ? "(a + b)² = a² + 2ab + b²" : "(a - b)² = a² - 2ab + b²",
          latex: sign === '+'
            ? `x^2 + 2(${a})x + ${a}^2 = (x + ${a})^2`
            : `x^2 - 2(${a})x + ${a}^2 = (x - ${a})^2`,
          visualState: {
            type: 'perfect_square_3d',
            dimensions: { x: 4, a: Math.min(2.5, Math.max(1.2, a * 0.8)), depth: 0.8 },
            action: 'initial_state',
            labels: [
              { text: "x²", position: [-1, -1, 0.6], color: "#38bdf8" },
              { text: `${a}x`, position: [-1, 1.8, 0.6], color: "#818cf8" },
              { text: `${a}x`, position: [1.8, -1, 0.6], color: "#818cf8" },
              { text: `${a}² = ${c}`, position: [1.8, 1.8, 0.6], color: "#f59e0b" },
            ]
          }
        },
        {
          stepNumber: 2,
          title: "Décomposition géométrique spatiale",
          explanation: `Le grand carré est formé de 4 pièces distinctes : un carré central x², deux bandes rectangulaires d'aire ${a}x chacune, et un petit coin carré d'aire ${a}² = ${c}.`,
          appliedRule: "Partition d'aire",
          latex: `\\text{Aire totale} = x^2 + ${a}x + ${a}x + ${a}^2 = x^2 + ${b}x + ${c}`,
          visualState: {
            type: 'perfect_square_3d',
            dimensions: { x: 4, a: Math.min(2.5, Math.max(1.2, a * 0.8)), depth: 0.8 },
            action: 'separate',
            cutoutProgress: 0.5,
            labels: [
              { text: "Carré x²", position: [-1.5, -1.5, 0.8], color: "#38bdf8" },
              { text: `Bande ${a}×x`, position: [-1.5, 2.2, 0.8], color: "#818cf8" },
              { text: `Bande x×${a}`, position: [2.2, -1.5, 0.8], color: "#818cf8" },
              { text: `Coin ${a}²`, position: [2.2, 2.2, 0.8], color: "#f59e0b" },
            ]
          }
        },
        {
          stepNumber: 3,
          title: `Assemblage en un carré parfait de côté (x ${sign} ${a})`,
          explanation: `En assemblant les 4 éléments, ils s'emboîtent sans aucun interstice pour constituer un carré parfait de dimensions (x ${sign} ${a}) × (x ${sign} ${a}).`,
          appliedRule: "Synthèse géométrique",
          latex: `x^2 ${sign} ${b}x + ${c} = (x ${sign} ${a})^2`,
          visualState: {
            type: 'perfect_square_3d',
            dimensions: { x: 4, a: Math.min(2.5, Math.max(1.2, a * 0.8)), depth: 0.8 },
            action: 'final_factored',
            labels: [
              { text: `Côté = x ${sign} ${a}`, position: [0, -2.8, 0], color: "#10b981" },
              { text: `Côté = x ${sign} ${a}`, position: [-3.2, 0, 0], color: "#10b981" },
              { text: `Aire = (x ${sign} ${a})²`, position: [0, 0, 0.8], color: "#34d399" },
            ]
          }
        }
      ];

      return {
        id: hash,
        rawExpression: rawExpr,
        normalizedExpression: normalizedExpr,
        operationType: 'factorization',
        finalFormLatex: `(x ${sign} ${a})^2`,
        summary: `Factorisation sous la forme d'un carré parfait (x ${sign} ${a})².`,
        source: 'heuristic',
        cachedAt: new Date().toISOString(),
        latencyMs: Math.max(1, Date.now() - startTime),
        steps,
      };
    }
  }

  // 4. Quadratic trinomial: x^2 + bx + c -> (x+p)(x+q)
  const trinomialMatch = normalizedExpr.match(/^x\^2([+-][0-9]+)x([+-][0-9]+)$/);
  if (trinomialMatch) {
    const b = parseInt(trinomialMatch[1], 10);
    const c = parseInt(trinomialMatch[2], 10);
    
    // Find integer pair (p, q) such that p + q = b and p * q = c
    let foundP: number | null = null;
    let foundQ: number | null = null;
    for (let p = -Math.abs(c); p <= Math.abs(c); p++) {
      if (p !== 0 && c % p === 0) {
        const q = c / p;
        if (p + q === b) {
          foundP = p;
          foundQ = q;
          break;
        }
      }
    }

    if (foundP !== null && foundQ !== null) {
      const pStr = foundP >= 0 ? `+ ${foundP}` : `- ${Math.abs(foundP)}`;
      const qStr = foundQ >= 0 ? `+ ${foundQ}` : `- ${Math.abs(foundQ)}`;

      const steps: MathStep[] = [
        {
          stepNumber: 1,
          title: "Méthode somme-produit",
          explanation: `Pour factoriser x² ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}x ${c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`}, on cherche deux entiers p et q tels que p + q = ${b} et p × q = ${c}. On trouve p = ${foundP} et q = ${foundQ}.`,
          appliedRule: "Factorisation des trinômes : x² + (p+q)x + pq = (x+p)(x+q)",
          latex: `p + q = ${foundP} + (${foundQ}) = ${b}, \\quad p \\times q = (${foundP}) \\times (${foundQ}) = ${c}`,
          visualState: {
            type: 'quadratic_tiles_3d',
            dimensions: { x: 4, a: Math.abs(foundP), b: Math.abs(foundQ), depth: 0.8 },
            action: 'initial_state',
            labels: [
              { text: "x²", position: [-1, -1, 0.6], color: "#38bdf8" },
              { text: `${foundP}x`, position: [-1, 1.5, 0.6], color: "#818cf8" },
              { text: `${foundQ}x`, position: [1.5, -1, 0.6], color: "#818cf8" },
              { text: `${c}`, position: [1.5, 1.5, 0.6], color: "#f59e0b" },
            ]
          }
        },
        {
          stepNumber: 2,
          title: "Décomposition du terme central",
          explanation: `On réécrit le terme central ${b}x comme la somme (${foundP}x) + (${foundQ}x). En 3D, cela correspond à disposer les blocs en grille rectangulaire.`,
          appliedRule: "Scission algébrique de surface",
          latex: `x^2 ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}x ${c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`} = x^2 ${foundP >= 0 ? `+ ${foundP}x` : `- ${Math.abs(foundP)}x`} ${foundQ >= 0 ? `+ ${foundQ}x` : `- ${Math.abs(foundQ)}x`} ${c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`}`,
          visualState: {
            type: 'quadratic_tiles_3d',
            dimensions: { x: 4, a: Math.abs(foundP), b: Math.abs(foundQ), depth: 0.8 },
            action: 'rearrange',
            labels: [
              { text: "Grille x × (x + q)", position: [0, 1.8, 0.8], color: "#a855f7" },
            ]
          }
        },
        {
          stepNumber: 3,
          title: "Factorisation par regroupement partiel",
          explanation: `On factorise x dans le premier groupe et ${foundQ} dans le second groupe : x(x ${pStr}) ${qStr[0]} ${Math.abs(foundQ)}(x ${pStr}). Le facteur commun (x ${pStr}) émerge directement.`,
          appliedRule: "Double mise en facteur",
          latex: `x(x ${pStr}) ${foundQ >= 0 ? `+ ${foundQ}` : `- ${Math.abs(foundQ)}`}(x ${pStr}) = (x ${pStr})(x ${qStr})`,
          visualState: {
            type: 'quadratic_tiles_3d',
            dimensions: { x: 4, a: Math.abs(foundP), b: Math.abs(foundQ), depth: 0.8 },
            action: 'final_factored',
            labels: [
              { text: `Longueur = x ${pStr}`, position: [0, -2.5, 0], color: "#10b981" },
              { text: `Largeur = x ${qStr}`, position: [-3, 0, 0], color: "#38bdf8" },
            ]
          }
        }
      ];

      return {
        id: hash,
        rawExpression: rawExpr,
        normalizedExpression: normalizedExpr,
        operationType: 'factorization',
        finalFormLatex: `(x ${pStr})(x ${qStr})`,
        summary: `Factorisation du trinôme du second degré par méthode somme-produit.`,
        source: 'heuristic',
        cachedAt: new Date().toISOString(),
        latencyMs: Math.max(1, Date.now() - startTime),
        steps,
      };
    }
  }

  // No deterministic heuristic matched
  return null;
}
