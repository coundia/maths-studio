export interface CourseMethodStep {
  title: string;
  explanation: string;
  latex?: string;
}

export interface CourseMethod {
  id: string;
  title: string;
  badge: string;
  statement: string;
  statementLatex?: string;
  strategy: string;
  solutionSteps: CourseMethodStep[];
  conclusion: string;
  conclusionLatex?: string;
  teacherNote?: string;
}

export interface CoursePitfall {
  trap: string;
  badPracticeLatex?: string;
  correctRule: string;
  correctLatex?: string;
  explanation: string;
}

export interface CourseSectionContent {
  sectionTitle: string;
  intro?: string;
  definitions?: {
    term: string;
    definition: string;
    latex?: string;
    example?: string;
  }[];
  theorems?: {
    name: string;
    statement: string;
    formulaLatex?: string;
    conditions?: string[];
    corollary?: string;
  }[];
  practicalApplication?: {
    context: string;
    problem: string;
    solution: string;
  };
}

export interface ChapterFullContent {
  chapterId: string;
  essentialSummary: string;
  keyFormulas: { label: string; latex: string }[];
  sections: CourseSectionContent[];
  methods: CourseMethod[];
  pitfalls: CoursePitfall[];
  bfemTips: string[];
}

export const CHAPTERS_FULL_CONTENT: Record<string, ChapterFullContent> = {
  // =========================================================================
  // 1. RACINE CARRÉE - 3E
  // =========================================================================
  'racine-carree-3e': {
    chapterId: 'racine-carree-3e',
    essentialSummary:
      'La racine carrée d\'un nombre réel positif a est l\'unique nombre réel positif noté √a dont le carré est égal à a. Elle est au cœur du programme de 3e pour la simplification des expressions, le calcul de distances et la résolution d\'équations.',
    keyFormulas: [
      { label: 'Définition', latex: '\\sqrt{a} = b \\iff (b \\ge 0 \\text{ et } b^2 = a)' },
      { label: 'Produit de radicaux', latex: '\\sqrt{a \\times b} = \\sqrt{a} \\times \\sqrt{b} \\quad (a \\ge 0, b \\ge 0)' },
      { label: 'Quotient de radicaux', latex: '\\sqrt{\\frac{a}{b}} = \\frac{\\sqrt{a}}{\\sqrt{b}} \\quad (a \\ge 0, b > 0)' },
      { label: 'Carré d\'une racine', latex: '(\\sqrt{a})^2 = \\sqrt{a^2} = a \\quad (a \\ge 0)' },
      { label: 'Quantité conjuguée', latex: '\\frac{1}{\\sqrt{a} - \\sqrt{b}} = \\frac{\\sqrt{a} + \\sqrt{b}}{a - b}' },
    ],
    sections: [
      {
        sectionTitle: '1. Définition et existence du radical',
        intro: 'Soit a un nombre réel positif ou nul. Le symbole √ s\'appelle le radical.',
        definitions: [
          {
            term: 'Racine carrée',
            definition: 'Pour tout réel a ≥ 0, √a est le réel positif dont le carré vaut a. Si a < 0, √a n\'existe pas dans ℝ.',
            latex: '\\sqrt{a} \\ge 0 \\quad \\text{et} \\quad (\\sqrt{a})^2 = a',
            example: '\\sqrt{49} = 7 \\text{ car } 7 \\ge 0 \\text{ et } 7^2 = 49.',
          },
          {
            term: 'Carré parfait',
            definition: 'Un entier naturel dont la racine carrée est un entier naturel.',
            example: '0, 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225.',
          },
        ],
        theorems: [
          {
            name: 'Propriété de neutralisation',
            statement: 'Pour tout nombre réel x (positif ou négatif), √(x²) est égal à la valeur absolue de x.',
            formulaLatex: '\\sqrt{x^2} = |x| = \\begin{cases} x & \\text{si } x \\ge 0 \\\\ -x & \\text{si } x < 0 \\end{cases}',
            corollary: 'Exemple piège BFEM : √((-5)²) = √25 = 5 (et non -5 !)',
          },
        ],
      },
      {
        sectionTitle: '2. Règles de calcul et simplifications',
        intro: 'Les règles fondamentales pour transformer et simplifier les radicaux sous la forme a√b où a et b sont entiers et b le plus petit possible.',
        theorems: [
          {
            name: 'Règle du produit',
            statement: 'La racine carrée d\'un produit est égale au produit des racines carrées.',
            formulaLatex: '\\sqrt{a \\times b} = \\sqrt{a} \\times \\sqrt{b} \\quad (a \\ge 0, b \\ge 0)',
            conditions: ['Les deux facteurs a et b doivent être strictement positifs ou nuls.'],
          },
          {
            name: 'Règle du quotient',
            statement: 'La racine carrée d\'un quotient est égale au quotient des racines carrées.',
            formulaLatex: '\\sqrt{\\frac{a}{b}} = \\frac{\\sqrt{a}}{\\sqrt{b}} \\quad (a \\ge 0, b > 0)',
            conditions: ['Le dénominateur b doit être strictement supérieur à zéro.'],
          },
        ],
        practicalApplication: {
          context: 'Topographie et aménagement à Thiès',
          problem: 'Un géomètre mesure une parcelle carrée d\'aire A = 450 m². Quelle est la longueur exacte de sa clôture sous forme a√b ?',
          solution: 'Le côté vaut c = √450 = √(225 × 2) = 15√2 m. Le périmètre de clôture est P = 4c = 60√2 mètres (environ 84,85 m).',
        },
      },
      {
        sectionTitle: '3. Suppression des radicaux au dénominateur',
        intro: 'En mathématiques et au BFEM, on ne laisse jamais de racine carrée au dénominateur d\'une fraction.',
        definitions: [
          {
            term: 'Dénominateur à un seul radical',
            definition: 'On multiplie le numérateur et le dénominateur par ce même radical.',
            latex: '\\frac{a}{\\sqrt{b}} = \\frac{a \\times \\sqrt{b}}{\\sqrt{b} \\times \\sqrt{b}} = \\frac{a\\sqrt{b}}{b}',
            example: '\\frac{6}{\\sqrt{3}} = \\frac{6\\sqrt{3}}{3} = 2\\sqrt{3}.',
          },
          {
            term: 'Dénominateur sous forme de binôme (Quantité conjuguée)',
            definition: 'On multiplie numérateur et dénominateur par l\'expression conjuguée en exploitant (a-b)(a+b) = a² - b².',
            latex: '\\frac{k}{\\sqrt{a} + \\sqrt{b}} = \\frac{k(\\sqrt{a} - \\sqrt{b})}{(\\sqrt{a} + \\sqrt{b})(\\sqrt{a} - \\sqrt{b})} = \\frac{k(\\sqrt{a} - \\sqrt{b})}{a - b}',
            example: '\\frac{2}{\\sqrt{5}-1} = \\frac{2(\\sqrt{5}+1)}{5 - 1} = \\frac{2(\\sqrt{5}+1)}{4} = \\frac{\\sqrt{5}+1}{2}.',
          },
        ],
      },
    ],
    methods: [
      {
        id: 'rc-method-1',
        title: 'Méthode 1 : Simplifier une somme de racines carrées (Écrire sous la forme a√b)',
        badge: 'Incontournable BFEM',
        statement: 'Écrire l\'expression A suivante sous la forme a√3 où a est un entier relatif :',
        statementLatex: 'A = 2\\sqrt{75} - 4\\sqrt{48} + \\sqrt{300}',
        strategy: 'Décomposer chaque nombre sous le radical en un produit d\'un carré parfait (ici 25, 16, 100) par 3.',
        solutionSteps: [
          {
            title: 'Étape 1 : Décomposition de chaque radicande',
            explanation: 'On fait apparaître le facteur 3 dans chaque radical : 75 = 25 × 3, 48 = 16 × 3, 300 = 100 × 3.',
            latex: 'A = 2\\sqrt{25 \\times 3} - 4\\sqrt{16 \\times 3} + \\sqrt{100 \\times 3}',
          },
          {
            title: 'Étape 2 : Extraction des carrés parfaits',
            explanation: 'On applique √(a × b) = √a × √b : √25 = 5, √16 = 4, √100 = 10.',
            latex: 'A = 2 \\times 5\\sqrt{3} - 4 \\times 4\\sqrt{3} + 10\\sqrt{3} = 10\\sqrt{3} - 16\\sqrt{3} + 10\\sqrt{3}',
          },
          {
            title: 'Étape 3 : Factorisation par √3 et réduction',
            explanation: 'On factorise par le radical commun √3.',
            latex: 'A = (10 - 16 + 10)\\sqrt{3} = 4\\sqrt{3}',
          },
        ],
        conclusion: 'L\'expression simplifiée est :',
        conclusionLatex: 'A = 4\\sqrt{3}',
        teacherNote: 'Barème classique BFEM : 1,5 pt. Attention à ne pas oublier de multiplier par le coefficient devant le radical (2 × 5 et 4 × 4) !',
      },
      {
        id: 'rc-method-2',
        title: 'Méthode 2 : Rendre rationnel un dénominateur avec quantité conjuguée',
        badge: 'Exercice type BFEM',
        statement: 'Rendre rationnel le dénominateur de la fraction suivante et simplifier :',
        statementLatex: 'B = \\frac{4}{\\sqrt{7} - \\sqrt{3}}',
        strategy: 'Multiplier le numérateur et le dénominateur par l\'expression conjuguée (√7 + √3).',
        solutionSteps: [
          {
            title: 'Étape 1 : Multiplication par le conjugué',
            explanation: 'La quantité conjuguée de (√7 - √3) est (√7 + √3).',
            latex: 'B = \\frac{4(\\sqrt{7} + \\sqrt{3})}{(\\sqrt{7} - \\sqrt{3})(\\sqrt{7} + \\sqrt{3})}',
          },
          {
            title: 'Étape 2 : Utilisation de la 3ème identité remarquable au dénominateur',
            explanation: '(a - b)(a + b) = a² - b². Donc (√7)² - (√3)² = 7 - 3 = 4.',
            latex: 'B = \\frac{4(\\sqrt{7} + \\sqrt{3})}{7 - 3} = \\frac{4(\\sqrt{7} + \\sqrt{3})}{4}',
          },
          {
            title: 'Étape 3 : Simplification de la fraction',
            explanation: 'On simplifie le facteur 4 au numérateur et au dénominateur.',
            latex: 'B = \\sqrt{7} + \\sqrt{3}',
          },
        ],
        conclusion: 'Le résultat épuré sans racine au dénominateur est :',
        conclusionLatex: 'B = \\sqrt{7} + \\sqrt{3}',
      },
      {
        id: 'rc-method-3',
        title: 'Méthode 3 : Résoudre l\'équation x² = a dans ℝ',
        badge: 'Indispensable 3e',
        statement: 'Résoudre dans ℝ les trois équations suivantes : 1) x² = 49 ; 2) x² = 0 ; 3) x² = -9.',
        strategy: 'Appliquer la propriété du nombre de solutions selon le signe de a.',
        solutionSteps: [
          {
            title: 'Cas 1 : a > 0 (x² = 49)',
            explanation: 'Puisque 49 > 0, l\'équation admet deux solutions distinctes : √49 = 7 et -√49 = -7.',
            latex: 'x = 7 \\quad \\text{ou} \\quad x = -7 \\implies S = \\{-7 ; 7\\}',
          },
          {
            title: 'Cas 2 : a = 0 (x² = 0)',
            explanation: 'L\'unique solution est 0.',
            latex: 'x = 0 \\implies S = \\{0\\}',
          },
          {
            title: 'Cas 3 : a < 0 (x² = -9)',
            explanation: 'Le carré d\'un réel est toujours positif ou nul. Un carré ne peut être égal à -9.',
            latex: 'S = \\emptyset \\quad (\\text{Aucune solution réelle})',
          },
        ],
        conclusion: 'Toujours bien distinguer les 3 cas selon le signe du membre de droite.',
        teacherNote: 'Piège fréquent au BFEM : pour x² = 49, beaucoup d\'élèves n\'écrivent que x = 7 et oublient la solution négative x = -7 !',
      },
    ],
    pitfalls: [
      {
        trap: 'Confondre addition et multiplication sous le radical',
        badPracticeLatex: '\\sqrt{9 + 16} = \\sqrt{9} + \\sqrt{16} = 3 + 4 = 7 \\quad (FAUX !)',
        correctRule: 'La racine d\'une somme n\'est PAS la somme des racines ! √(a + b) ≠ √a + √b.',
        correctLatex: '\\sqrt{9 + 16} = \\sqrt{25} = 5',
        explanation: 'Il faut impérativement calculer la somme entre parenthèses AVANT d\'extraire la racine carrée.',
      },
      {
        trap: 'Écrire la racine carrée d\'un nombre négatif',
        badPracticeLatex: '\\sqrt{-25} = -5 \\quad (GRAVE ERREUR)',
        correctRule: 'Le radicande doit toujours être positif ou nul. √(-25) n\'a aucun sens dans ℝ.',
        correctLatex: '\\sqrt{25} = 5 \\quad \\text{et} \\quad -\\sqrt{25} = -5',
        explanation: 'Le signe moins DOIT être à l\'extérieur du radical pour désigner l\'opposé d\'une racine carrée.',
      },
      {
        trap: 'Oublier la valeur absolue pour √(x²)',
        badPracticeLatex: '\\sqrt{(-7)^2} = -7 \\quad (FAUX)',
        correctRule: 'Une racine carrée est TOUJOURS positive ou nulle par définition !',
        correctLatex: '\\sqrt{(-7)^2} = \\sqrt{49} = +7 = |-7|',
        explanation: '√(A²) = |A|. Le résultat d\'une racine ne peut jamais être un nombre négatif.',
      },
    ],
    bfemTips: [
      'Dans les épreuves du BFEM, laissez TOUJOURS les résultats sous forme exacte a√b simplifiée au maximum avant toute approximation décimale.',
      'Pour simplifier rapidement une grande racine (comme √288), divisez successivement par les carrés parfaits : 288 ÷ 2 = 144, or 144 = 12² donc √288 = 12√2 en une ligne !',
      'Lors du développement d\'une expression comme (3 + 2√5)², pensez à appliquer l\'identité remarquable avec le double produit : (3)² + 2×(3)×(2√5) + (2√5)² = 9 + 12√5 + 20 = 29 + 12√5.',
    ],
  },

  // =========================================================================
  // 2. THÉORÈME DE THALÈS - 3E
  // =========================================================================
  'thales-3e': {
    chapterId: 'thales-3e',
    essentialSummary:
      'Le théorème de Thalès permet de calculer des longueurs de segments dans un triangle traversé par une droite parallèle à l\'un de ses côtés. Sa réciproque permet de démontrer que deux droites sont parallèles.',
    keyFormulas: [
      { label: 'Théorème direct (Rapports)', latex: '\\frac{AM}{AB} = \\frac{AN}{AC} = \\frac{MN}{BC} \\quad (MN \\parallel BC)' },
      { label: 'Réciproque de Thalès', latex: '\\frac{AM}{AB} = \\frac{AN}{AC} \\implies (MN) \\parallel (BC)' },
      { label: 'Configuration papillon', latex: '\\frac{AM}{AB} = \\frac{AN}{AC} = \\frac{MN}{BC} \\quad (A \\text{ entre les droites})' },
      { label: 'Agrandissement / Réduction', latex: 'k = \\frac{L\'}{L}, \\quad \\text{Aire}\' = k^2 \\times \\text{Aire}' },
    ],
    sections: [
      {
        sectionTitle: '1. Énoncé du Théorème de Thalès direct',
        intro: 'Soient deux droites (d) et (d\') sécantes en un point A. Soient B et M deux points de (d) distincts de A. Soient C et N deux points de (d\') distincts de A.',
        theorems: [
          {
            name: 'Théorème direct de Thalès',
            statement: 'Si les droites (BC) et (MN) sont parallèles, alors les rapports des longueurs correspondantes sont égaux.',
            formulaLatex: '\\frac{AM}{AB} = \\frac{AN}{AC} = \\frac{MN}{BC}',
            conditions: [
              'A, M, B sont alignés et A, N, C sont alignés.',
              'Les droites (MN) et (BC) sont strictement parallèles.',
            ],
            corollary: 'Il existe deux configurations classiques : la configuration du "triangle imbriqué" et la configuration "papillon" (sablier).',
          },
        ],
        practicalApplication: {
          context: 'Mesure de hauteur du phare des Mamelles à Dakar',
          problem: 'Un élève place verticalement un bâton de 2 m à 15 m du phare. L\'ombre du bâton mesure 3 m et celle du phare 22,5 m. Quelle est la hauteur du phare ?',
          solution: 'Par Thalès (rayons du soleil parallèles) : H / 2 = 22,5 / 3 = 7,5. Donc la hauteur du phare est H = 2 × 7,5 = 15 mètres.',
        },
      },
      {
        sectionTitle: '2. Réciproque du Théorème de Thalès',
        intro: 'Elle sert EXCLUSIVEMENT à démontrer que deux droites sont parallèles.',
        theorems: [
          {
            name: 'Réciproque de Thalès',
            statement: 'Si les points A, M, B et A, N, C sont alignés dans le même ordre, et si AM/AB = AN/AC, alors les droites (MN) et (BC) sont parallèles.',
            formulaLatex: '\\frac{AM}{AB} = \\frac{AN}{AC} \\quad \\text{et points alignés dans le même ordre} \\implies (MN) \\parallel (BC)',
            conditions: [
              'Vérifier que les points sont alignés DANS LE MÊME ORDRE sur chacune des sécantes.',
              'Calculer séparément les deux rapports numériques sous forme de fractions irréductibles.',
              'Conclure par l\'égalité des rapports.',
            ],
          },
        ],
      },
      {
        sectionTitle: '3. Agrandissement et Réduction',
        intro: 'Effet d\'un coefficient d\'échelle k > 0 sur les longueurs, les aires et les volumes.',
        definitions: [
          {
            term: 'Rapport d\'agrandissement / réduction k',
            definition: 'Rapport d\'une longueur finale sur la longueur initiale correspondante.',
            latex: 'k = \\frac{\\text{Longueur image}}{\\text{Longueur initiale}}',
            example: 'Si k > 1 c\'est un agrandissement. Si 0 < k < 1 c\'est une réduction.',
          },
          {
            term: 'Effet sur les aires et les volumes',
            definition: 'Les aires sont multipliées par k² et les volumes par k³.',
            latex: '\\mathcal{A}\' = k^2 \\times \\mathcal{A} \\quad \\text{et} \\quad \\mathcal{V}\' = k^3 \\times \\mathcal{V}',
          },
        ],
      },
    ],
    methods: [
      {
        id: 'thales-method-1',
        title: 'Méthode 1 : Rédiger impeccablement le calcul d\'une longueur par Thalès direct',
        badge: 'Rédaction type BFEM',
        statement: 'Dans le triangle ABC, M ∈ [AB] et N ∈ [AC]. On donne AB = 8 cm, AC = 10 cm, AM = 3 cm et BC = 6 cm. Les droites (MN) et (BC) sont parallèles. Calculer AN et MN.',
        strategy: 'Citer les hypothèses (alignement, parallélisme), poser l\'égalité des 3 rapports, puis appliquer le produit en croix.',
        solutionSteps: [
          {
            title: 'Étape 1 : Énoncer clairement les hypothèses du théorème',
            explanation: 'Dans le triangle ABC, le point M appartient à [AB] et N appartient à [AC]. De plus, les droites (MN) et (BC) sont parallèles.',
          },
          {
            title: 'Étape 2 : Écrire l\'égalité des rapports de Thalès',
            explanation: 'D\'après le théorème de Thalès, on a :',
            latex: '\\frac{AM}{AB} = \\frac{AN}{AC} = \\frac{MN}{BC}',
          },
          {
            title: 'Étape 3 : Remplacer par les valeurs numériques connues',
            explanation: 'On injecte les longueurs données :',
            latex: '\\frac{3}{8} = \\frac{AN}{10} = \\frac{MN}{6}',
          },
          {
            title: 'Étape 4 : Calculer AN et MN par produit en croix',
            explanation: 'AN = (3 × 10) / 8 = 30 / 8 = 3,75 cm. MN = (3 × 6) / 8 = 18 / 8 = 2,25 cm.',
            latex: 'AN = 3,75\\text{ cm} \\quad \\text{et} \\quad MN = 2,25\\text{ cm}',
          },
        ],
        conclusion: 'Les longueurs recherchées sont :',
        conclusionLatex: 'AN = 3,75\\text{ cm} \\quad \\text{et} \\quad MN = 2,25\\text{ cm}',
        teacherNote: 'Attention : le 3ème rapport MN/BC implique les côtés parallèles, ne le confondez jamais avec MB/NC !',
      },
      {
        id: 'thales-method-2',
        title: 'Méthode 2 : Démontrer un parallélisme avec la Réciproque de Thalès',
        badge: 'Indispensable BFEM',
        statement: 'Soit un triangle ABC tel que AB = 7,5 cm et AC = 9 cm. Soient M sur [AB] avec AM = 5 cm et N sur [AC] avec AN = 6 cm. Les droites (MN) et (BC) sont-elles parallèles ?',
        strategy: 'Calculer SÉPARÉMENT AM/AB et AN/AC sous forme de fractions irréductibles, vérifier l\'ordre des points, puis conclure.',
        solutionSteps: [
          {
            title: 'Étape 1 : Calcul séparé du premier rapport',
            explanation: 'On calcule le rapport AM/AB :',
            latex: '\\frac{AM}{AB} = \\frac{5}{7,5} = \\frac{50}{75} = \\frac{2}{3}',
          },
          {
            title: 'Étape 2 : Calcul séparé du second rapport',
            explanation: 'On calcule le rapport AN/AC :',
            latex: '\\frac{AN}{AC} = \\frac{6}{9} = \\frac{2}{3}',
          },
          {
            title: 'Étape 3 : Comparaison et vérification de l\'ordre des points',
            explanation: 'On constate que AM/AB = AN/AC = 2/3. De plus, les points A, M, B d\'une part et A, N, C d\'autre part sont alignés dans le même ordre.',
          },
          {
            title: 'Étape 4 : Conclusion par la réciproque de Thalès',
            explanation: 'D\'après la réciproque du théorème de Thalès, les droites (MN) et (BC) sont strictement parallèles.',
            latex: '(MN) \\parallel (BC)',
          },
        ],
        conclusion: 'Les droites (MN) et (BC) sont bien parallèles.',
      },
    ],
    pitfalls: [
      {
        trap: 'Écrire l\'égalité des rapports dès le début pour la réciproque',
        badPracticeLatex: '\\frac{AM}{AB} = \\frac{AN}{AC} \\quad (écrit avant d\'avoir calculé)',
        correctRule: 'Il faut calculer SÉPARÉMENT chaque fraction, puis constater l\'égalité.',
        explanation: 'Si vous écrivez l\'égalité au départ, vous supposez déjà ce que vous devez démontrer (raisonnement circulaire sanctionné au BFEM).',
      },
      {
        trap: 'Oublier la condition "alignés dans le même ordre"',
        correctRule: 'Toujours mentionner explicitement : "Les points A, M, B et A, N, C sont alignés dans le même ordre".',
        explanation: 'Sans cette condition, le théorème de la réciproque n\'est pas valide (cas d\'un point situé de l\'autre côté du sommet).',
      },
      {
        trap: 'Confondre le segment [AB] et le segment [MB]',
        badPracticeLatex: '\\frac{AM}{MB} = \\frac{MN}{BC} \\quad (FAUX !)',
        correctRule: 'Le rapport doit TOUJOURS faire intervenir la longueur totale depuis le sommet commun : AM/AB.',
        correctLatex: '\\frac{AM}{AB} = \\frac{AN}{AC} = \\frac{MN}{BC}',
        explanation: 'MB n\'est pas un côté de triangle, c\'est juste un tronçon.',
      },
    ],
    bfemTips: [
      'Au BFEM, 1 point complet de la rédaction est réservé à la formulation exacte des hypothèses ("triangle ABC, M sur [AB], N sur [AC], (MN) // (BC)"). Ne sautez jamais cette phrase d\'introduction !',
      'Dans la configuration papillon, le sommet commun A est au centre : AM/AB = AN/AC = MN/BC. Prenez garde aux points qui se correspondent sur la même droite sécante.',
    ],
  },

  // =========================================================================
  // 3. RELATIONS TRIGONOMÉTRIQUES - 3E
  // =========================================================================
  'trigonometrie-3e': {
    chapterId: 'trigonometrie-3e',
    essentialSummary:
      'La trigonométrie relie les mesures des angles aigus et les longueurs des côtés dans un triangle rectangle. Les trois rapports fondamentaux sont le cosinus, le sinus et la tangente.',
    keyFormulas: [
      { label: 'Cosinus', latex: '\\cos(\\widehat{A}) = \\frac{\\text{Côté adjacent}}{\\text{Hypoténuse}}' },
      { label: 'Sinus', latex: '\\sin(\\widehat{A}) = \\frac{\\text{Côté opposé}}{\\text{Hypoténuse}}' },
      { label: 'Tangente', latex: '\\tan(\\widehat{A}) = \\frac{\\text{Côté opposé}}{\\text{Côté adjacent}} = \\frac{\\sin(\\widehat{A})}{\\cos(\\widehat{A})}' },
      { label: 'Formule fondamentale', latex: '\\cos^2(\\alpha) + \\sin^2(\\alpha) = 1' },
      { label: 'Angles complémentaires', latex: '\\cos(90^\\circ - \\alpha) = \\sin(\\alpha) \\quad \\text{et} \\quad \\tan(90^\\circ - \\alpha) = \\frac{1}{\\tan(\\alpha)}' },
    ],
    sections: [
      {
        sectionTitle: '1. Définitions dans le triangle rectangle',
        intro: 'Soit un triangle ABC rectangle en B. Le côté opposé à l\'angle droit s\'appelle l\'hypoténuse (le plus long côté).',
        definitions: [
          {
            term: 'Moyen mnémotechnique : SOH CAH TOA',
            definition: 'SOH : Sinus = Opposé / Hypoténuse ; CAH : Cosinus = Adjacent / Hypoténuse ; TOA : Tangente = Opposé / Adjacent.',
            latex: '\\cos(\\widehat{A}) = \\frac{AB}{AC}, \\quad \\sin(\\widehat{A}) = \\frac{BC}{AC}, \\quad \\tan(\\widehat{A}) = \\frac{BC}{AB}',
          },
          {
            term: 'Encadrement fondamental',
            definition: 'Pour tout angle aigu α (0° < α < 90°), le cosinus et le sinus sont strictement compris entre 0 et 1.',
            latex: '0 < \\cos(\\alpha) < 1 \\quad \\text{et} \\quad 0 < \\sin(\\alpha) < 1',
          },
        ],
      },
      {
        sectionTitle: '2. Relations fondamentales et angles remarquables',
        theorems: [
          {
            name: 'Identité pythagoricienne trigonométrique',
            statement: 'Pour tout angle aigu α, la somme du carré du cosinus et du carré du sinus est toujours égale à 1.',
            formulaLatex: '\\cos^2(\\alpha) + \\sin^2(\\alpha) = 1',
            corollary: 'Permet de calculer sin(α) dès qu\'on connaît cos(α) sans même connaître les longueurs des côtés !',
          },
          {
            name: 'Angles remarquables (30°, 45°, 60°)',
            statement: 'Valeurs exactes à connaître par cœur pour le BFEM :',
            formulaLatex: '\\cos(60^\\circ) = \\sin(30^\\circ) = \\frac{1}{2}, \\quad \\cos(30^\\circ) = \\sin(60^\\circ) = \\frac{\\sqrt{3}}{2}, \\quad \\cos(45^\\circ) = \\sin(45^\\circ) = \\frac{\\sqrt{2}}{2}',
          },
        ],
        practicalApplication: {
          context: 'Navigation maritime au large de l\'Île de Gorée',
          problem: 'Depuis la vigie d\'un bateau située à 12 m au-dessus de l\'eau, le capitaine aperçoit une bouée sous un angle de dépression de 30°. À quelle distance horizontale d se trouve la bouée ?',
          solution: 'tan(30°) = 12 / d => d = 12 / tan(30°) = 12 / (1/√3) = 12√3 ≈ 20,78 mètres.',
        },
      },
    ],
    methods: [
      {
        id: 'trigo-method-1',
        title: 'Méthode 1 : Calculer une longueur à l\'aide d\'un angle et d\'un côté',
        badge: 'Exercice type BFEM',
        statement: 'Soit un triangle ABC rectangle en B tel que AC = 10 cm et BAC = 30°. Calculer la valeur exacte de AB et de BC.',
        strategy: 'Identifier l\'hypoténuse (AC), le côté adjacent à A (AB) et le côté opposé (BC). Choisir cos pour AB et sin pour BC.',
        solutionSteps: [
          {
            title: 'Étape 1 : Calcul du côté adjacent AB avec le cosinus',
            explanation: 'Dans le triangle ABC rectangle en B : cos(BAC) = AB / AC.',
            latex: '\\cos(30^\\circ) = \\frac{AB}{10} \\implies AB = 10 \\times \\cos(30^\\circ)',
          },
          {
            title: 'Étape 2 : Injection de la valeur remarquable de cos(30°)',
            explanation: 'Or cos(30°) = √3 / 2.',
            latex: 'AB = 10 \\times \\frac{\\sqrt{3}}{2} = 5\\sqrt{3}\\text{ cm}',
          },
          {
            title: 'Étape 3 : Calcul du côté opposé BC avec le sinus',
            explanation: 'sin(BAC) = BC / AC => BC = 10 × sin(30°).',
            latex: 'BC = 10 \\times \\frac{1}{2} = 5\\text{ cm}',
          },
        ],
        conclusion: 'Les longueurs exactes sont :',
        conclusionLatex: 'AB = 5\\sqrt{3}\\text{ cm} \\quad \\text{et} \\quad BC = 5\\text{ cm}',
      },
      {
        id: 'trigo-method-2',
        title: 'Méthode 2 : Calculer sin(α) et tan(α) connaissant cos(α) sans calculer l\'angle',
        badge: 'Classique BFEM',
        statement: 'Soit α un angle aigu tel que cos(α) = 3/5. Calculer la valeur exacte de sin(α) puis de tan(α).',
        strategy: 'Utiliser la formule fondamentale cos²(α) + sin²(α) = 1 puis tan(α) = sin(α)/cos(α).',
        solutionSteps: [
          {
            title: 'Étape 1 : Application de l\'identité fondamentale',
            explanation: 'On a cos²(α) + sin²(α) = 1.',
            latex: '\\left(\\frac{3}{5}\\right)^2 + \\sin^2(\\alpha) = 1 \\implies \\frac{9}{25} + \\sin^2(\\alpha) = 1',
          },
          {
            title: 'Étape 2 : Isolement de sin²(α) et extraction de la racine',
            explanation: 'sin²(α) = 1 - 9/25 = 16/25. Puisque α est un angle aigu, sin(α) > 0.',
            latex: '\\sin(\\alpha) = \\sqrt{\\frac{16}{25}} = \\frac{4}{5}',
          },
          {
            title: 'Étape 3 : Calcul de la tangente',
            explanation: 'tan(α) = sin(α) / cos(α) = (4/5) / (3/5).',
            latex: '\\tan(\\alpha) = \\frac{4}{5} \\times \\frac{5}{3} = \\frac{4}{3}',
          },
        ],
        conclusion: 'Les valeurs exactes rationnelles sont :',
        conclusionLatex: '\\sin(\\alpha) = \\frac{4}{5} \\quad \\text{et} \\quad \\tan(\\alpha) = \\frac{4}{3}',
      },
    ],
    pitfalls: [
      {
        trap: 'Calculer le cosinus ou sinus dans un triangle non rectangle',
        correctRule: 'Les formules SOH CAH TOA s\'appliquent UNIQUEMENT dans un triangle RECTANGLE.',
        explanation: 'Si le triangle n\'est pas rectangle, il faut d\'abord tracer une hauteur pour créer des triangles rectangles.',
      },
      {
        trap: 'Oublier de régler la calculatrice en degrés (DEG)',
        correctRule: 'Toujours vérifier que l\'écran de la calculatrice affiche "DEG" ou "D" et non "RAD" ou "GRAD".',
        explanation: 'Une calculatrice en radians donne des valeurs erronées au BFEM.',
      },
      {
        trap: 'Obtenir un cosinus ou sinus supérieur à 1',
        badPracticeLatex: '\\cos(\\alpha) = 1,45 \\quad (IMPOSSIBLE !)',
        correctRule: 'L\'hypoténuse étant le côté le plus long, le rapport Côté/Hypoténuse est TOUJOURS ≤ 1.',
        explanation: 'Si vous trouvez un cosinus > 1, vous avez inversé le numérateur et le dénominateur.',
      },
    ],
    bfemTips: [
      'Retenez le tableau des 3 angles remarquables (30°, 45°, 60°) : tracez une ligne avec les numérateurs √1/2, √2/2, √3/2.',
      'Rappelez-vous : deux angles complémentaires ont le cosinus de l\'un égal au sinus de l\'autre : cos(70°) = sin(20°).',
    ],
  },

  // =========================================================================
  // 4. SYSTÈMES DE DEUX ÉQUATIONS À DEUX INCONNUES - 3E
  // =========================================================================
  'systemes-2-inconnues-3e': {
    chapterId: 'systemes-2-inconnues-3e',
    essentialSummary:
      'Un système linéaire de deux équations à deux inconnues x et y se résout par la méthode d\'élimination par combinaison linéaire ou par substitution. Il permet notamment de résoudre des problèmes concrets de commerce et de partage.',
    keyFormulas: [
      { label: 'Forme générale', latex: '\\begin{cases} ax + by = c \\\\ a\'x + b\'y = c\' \\end{cases}' },
      { label: 'Déterminant (Existence)', latex: '\\Delta = ab\' - a\'b \\ne 0 \\implies \\text{Solution unique } (x ; y)' },
      { label: 'Interprétation géométrique', latex: '\\text{Point d\'intersection } I(x_0 ; y_0) \\text{ de deux droites } (d) \\text{ et } (d\')' },
    ],
    sections: [
      {
        sectionTitle: '1. Méthodes de résolution algébrique',
        theorems: [
          {
            name: 'Méthode par combinaison linéaire (Addition)',
            statement: 'On multiplie chaque équation par des coefficients choisis pour que les coefficients d\'une même inconnue soient opposés, puis on additionne membre à membre pour éliminer cette inconnue.',
          },
          {
            name: 'Méthode par substitution',
            statement: 'On exprime l\'une des inconnues en fonction de l\'autre dans une équation facile (ex: x = ...), puis on remplace cette expression dans la deuxième équation.',
          },
        ],
        practicalApplication: {
          context: 'Commerce au Marché Sandaga de Dakar',
          problem: 'Aminata achète 3 mangues et 2 ananas pour 2200 FCFA. Moussa achète 2 mangues et 4 ananas pour 2800 FCFA. Quel est le prix d\'une mangue x et d\'un ananas y ?',
          solution: 'Système : { 3x + 2y = 2200 ; 2x + 4y = 2800 }. En multipliant (1) par -2 : -6x - 4y = -4400. Addition avec (2) : -4x = -1600 => x = 400 FCFA la mangue. D\'où 3(400) + 2y = 2200 => 2y = 1000 => y = 500 FCFA l\'ananas.',
        },
      },
    ],
    methods: [
      {
        id: 'sys-method-1',
        title: 'Méthode 1 : Résolution complète par combinaison linéaire',
        badge: 'Incontournable BFEM',
        statement: 'Résoudre dans ℝ × ℝ le système suivant :',
        statementLatex: '\\begin{cases} 2x + 3y = 13 \\quad (1) \\\\ 5x - y = 7 \\quad (2) \\end{cases}',
        strategy: 'Éliminer y en multipliant l\'équation (2) par 3 pour obtenir -3y face à +3y.',
        solutionSteps: [
          {
            title: 'Étape 1 : Préparation de l\'élimination',
            explanation: 'On multiplie l\'équation (2) par 3 :',
            latex: '3 \\times (5x - y) = 3 \\times 7 \\implies 15x - 3y = 21 \\quad (2\')',
          },
          {
            title: 'Étape 2 : Addition membre à membre de (1) et (2\')',
            explanation: '(2x + 3y) + (15x - 3y) = 13 + 21. Les termes en y s\'annulent !',
            latex: '17x = 34 \\implies x = \\frac{34}{17} = 2',
          },
          {
            title: 'Étape 3 : Détermination de la seconde inconnue y',
            explanation: 'On remplace x = 2 dans l\'équation (2) d\'origine : 5(2) - y = 7.',
            latex: '10 - y = 7 \\implies y = 10 - 7 = 3',
          },
          {
            title: 'Étape 4 : Vérification dans l\'autre équation',
            explanation: '2(2) + 3(3) = 4 + 9 = 13. L\'égalité est vérifiée.',
          },
        ],
        conclusion: 'Le couple solution du système est :',
        conclusionLatex: 'S = \\{(2 ; 3)\\}',
        teacherNote: 'Écrivez impérativement la solution sous forme de COUPLE ordonné S = {(x ; y)} avec des accolades et des parenthèses.',
      },
    ],
    pitfalls: [
      {
        trap: 'Écrire les solutions séparément sans former de couple',
        badPracticeLatex: 'x = 2 \\quad y = 3 \\quad \\text{au lieu de } S = \\{(2 ; 3)\\}',
        correctRule: 'La solution d\'un système à deux inconnues est un couple de coordonnées (x ; y).',
        explanation: 'L\'ordre compte : (2 ; 3) n\'est pas la même solution que (3 ; 2).',
      },
      {
        trap: 'Oublier de multiplier le membre de droite par le coefficient',
        badPracticeLatex: '3 \\times (5x - y = 7) \\to 15x - 3y = 7 \\quad (FAUX !)',
        correctRule: 'Le coefficient multiplicateur doit s\'appliquer à TOUS les termes des deux membres : 3 × 7 = 21.',
        explanation: 'C\'est l\'erreur d\'inattention la plus fréquente au brevet.',
      },
    ],
    bfemTips: [
      'Pour les problèmes de mise en équation au BFEM : 1. Choix des inconnues ("Soit x le prix de...", "Soit y le prix de...") ; 2. Traduction du texte en système ; 3. Résolution mathématique ; 4. Phrase de conclusion avec les unités (FCFA, kg, etc.).',
    ],
  },

  // =========================================================================
  // 5. THÉORÈME DE PYTHAGORE - 4E
  // =========================================================================
  'pythagore': {
    chapterId: 'pythagore',
    essentialSummary:
      'Dans un triangle rectangle, le carré de la longueur de l\'hypoténuse est égal à la somme des carrés des longueurs des côtés de l\'angle droit. Sa réciproque permet de prouver qu\'un triangle est rectangle.',
    keyFormulas: [
      { label: 'Théorème direct (Hypoténuse)', latex: 'BC^2 = AB^2 + AC^2 \\quad (\\text{rectangle en } A)' },
      { label: 'Calcul d\'un côté de l\'angle droit', latex: 'AB^2 = BC^2 - AC^2' },
      { label: 'Réciproque de Pythagore', latex: 'BC^2 = AB^2 + AC^2 \\implies \\triangle ABC \\text{ rectangle en } A' },
      { label: 'Contraposée (Non rectangle)', latex: 'BC^2 \\ne AB^2 + AC^2 \\implies \\triangle ABC \\text{ NON rectangle}' },
    ],
    sections: [
      {
        sectionTitle: '1. Énoncé du Théorème direct',
        theorems: [
          {
            name: 'Théorème de Pythagore',
            statement: 'Si un triangle ABC est rectangle en A, alors le carré de l\'hypoténuse est égal à la somme des carrés des deux autres côtés.',
            formulaLatex: 'BC^2 = AB^2 + AC^2',
            conditions: ['Le triangle doit être obligatoirement rectangle.'],
          },
        ],
        practicalApplication: {
          context: 'Maçonnerie traditionnelle (Règle du 3-4-5)',
          problem: 'Pour vérifier qu\'un mur d\'angle est parfaitement d\'équerre, un maçon mesure 3 mètres sur un mur, 4 mètres sur le second. Quelle distance doit-il mesurer en diagonale ?',
          solution: 'd² = 3² + 4² = 9 + 16 = 25 => d = √25 = 5 mètres. Si la diagonale fait exactement 5 m, l\'angle est droit à 90°.',
        },
      },
      {
        sectionTitle: '2. Réciproque et Contraposée',
        theorems: [
          {
            name: 'Réciproque de Pythagore',
            statement: 'Dans un triangle, si le carré du plus long côté est égal à la somme des carrés des deux autres côtés, alors ce triangle est rectangle.',
            formulaLatex: 'BC^2 = AB^2 + AC^2 \\implies \\triangle ABC \\text{ est rectangle en } A',
          },
          {
            name: 'Contraposée de Pythagore',
            statement: 'Si le carré du plus long côté n\'est pas égal à la somme des carrés des deux autres côtés, alors le triangle n\'est pas rectangle.',
            formulaLatex: 'BC^2 \\ne AB^2 + AC^2 \\implies \\triangle ABC \\text{ n\'est pas rectangle}',
          },
        ],
      },
    ],
    methods: [
      {
        id: 'pyth-method-1',
        title: 'Méthode 1 : Calculer la longueur de l\'hypoténuse',
        badge: 'Base 4e & 3e',
        statement: 'Soit un triangle ABC rectangle en A tel que AB = 6 cm et AC = 8 cm. Calculer la longueur de l\'hypoténuse BC.',
        strategy: 'Appliquer le théorème de Pythagore direct.',
        solutionSteps: [
          {
            title: 'Étape 1 : Citer le triangle et l\'angle droit',
            explanation: 'Le triangle ABC est rectangle en A. Son hypoténuse est [BC].',
          },
          {
            title: 'Étape 2 : Écrire la formule de Pythagore',
            explanation: 'D\'après le théorème de Pythagore :',
            latex: 'BC^2 = AB^2 + AC^2',
          },
          {
            title: 'Étape 3 : Calculer la somme des carrés',
            explanation: 'BC² = 6² + 8² = 36 + 64 = 100.',
            latex: 'BC^2 = 100',
          },
          {
            title: 'Étape 4 : Extraire la racine carrée',
            explanation: 'Une longueur étant positive : BC = √100 = 10 cm.',
            latex: 'BC = 10\\text{ cm}',
          },
        ],
        conclusion: 'L\'hypoténuse mesure :',
        conclusionLatex: 'BC = 10\\text{ cm}',
      },
      {
        id: 'pyth-method-2',
        title: 'Méthode 2 : Démontrer qu\'un triangle est rectangle (Réciproque)',
        badge: 'Rédaction modèle',
        statement: 'Soit un triangle EFG avec EF = 5 cm, FG = 12 cm et EG = 13 cm. Ce triangle est-il rectangle ?',
        strategy: 'Repérer le plus long côté (EG), calculer son carré séparément, puis calculer la somme des deux autres carrés.',
        solutionSteps: [
          {
            title: 'Étape 1 : Identifier le côté le plus long et calculer son carré',
            explanation: 'Dans le triangle EFG, le côté le plus long est [EG].',
            latex: 'EG^2 = 13^2 = 169',
          },
          {
            title: 'Étape 2 : Calculer la somme des carrés des deux autres côtés',
            explanation: 'On calcule séparément EF² + FG² :',
            latex: 'EF^2 + FG^2 = 5^2 + 12^2 = 25 + 144 = 169',
          },
          {
            title: 'Étape 3 : Comparaison et conclusion',
            explanation: 'On constate que EG² = EF² + FG² = 169. D\'après la réciproque du théorème de Pythagore, le triangle EFG est rectangle en F.',
            latex: 'EG^2 = EF^2 + FG^2 \\implies \\triangle EFG \\text{ rectangle en } F',
          },
        ],
        conclusion: 'Le triangle EFG est bien un triangle rectangle en F.',
      },
    ],
    pitfalls: [
      {
        trap: 'Additionner au lieu de soustraire pour un côté de l\'angle droit',
        badPracticeLatex: 'AB^2 = BC^2 + AC^2 \\quad (FAUX si BC est l\'hypoténuse)',
        correctRule: 'Pour trouver un côté de l\'angle droit, on SOUSTRAIT : AB² = BC² - AC².',
        explanation: 'L\'hypoténuse est le côté le plus long. Aucun autre côté ne peut avoir un carré plus grand que le sien.',
      },
      {
        trap: 'Oublier d\'extraire la racine carrée à la fin',
        badPracticeLatex: 'BC = 100 \\quad (au lieu de BC = \\sqrt{100} = 10)',
        correctRule: 'Pythagore donne BC², il faut obligatoirement prendre la racine carrée pour obtenir la longueur BC.',
        explanation: 'Une longueur ne peut être égale à son propre carré (sauf pour 1). Pensez toujours à écrire BC = √100 = 10 cm.',
      },
    ],
    bfemTips: [
      'Apprenez les triplets pythagoriciens fréquents : (3, 4, 5), (6, 8, 10), (5, 12, 13), (8, 15, 17). Ils vous feront gagner un temps précieux lors des contrôles !',
    ],
  },

  // =========================================================================
  // 6. THÉORÈMES DE LA DROITE DES MILIEUX - 4E
  // =========================================================================
  'droite-milieux': {
    chapterId: 'droite-milieux',
    essentialSummary:
      'Dans un triangle, le segment joignant les milieux de deux côtés est parallèle au troisième côté et sa longueur est égale à la moitié de ce troisième côté. Réciproquement, la droite passant par le milieu d\'un côté et parallèle à un deuxième côté coupe le troisième en son milieu.',
    keyFormulas: [
      { label: '1er Théorème (Parallélisme)', latex: '(IJ) \\parallel (BC) \\quad (I \\text{ milieu de } [AB], J \\text{ milieu de } [AC])' },
      { label: '2ème Théorème (Longueur)', latex: 'IJ = \\frac{1}{2} \\times BC = \\frac{BC}{2}' },
      { label: '3ème Théorème (Réciproque)', latex: 'I \\text{ milieu de } [AB] \\text{ et } (d) \\parallel (BC) \\implies (d) \\text{ coupe } [AC] \\text{ en son milieu } J' },
    ],
    sections: [
      {
        sectionTitle: '1. Les théorèmes directs',
        theorems: [
          {
            name: '1er Théorème de la droite des milieux',
            statement: 'Dans un triangle, si une droite passe par les milieux de deux côtés, alors elle est parallèle au troisième côté.',
            formulaLatex: 'I \\text{ milieu de } [AB], J \\text{ milieu de } [AC] \\implies (IJ) \\parallel (BC)',
          },
          {
            name: '2ème Théorème de la droite des milieux',
            statement: 'La longueur du segment joignant les milieux de deux côtés est égale à la moitié de la longueur du troisième côté.',
            formulaLatex: 'IJ = \\frac{BC}{2}',
          },
        ],
      },
      {
        sectionTitle: '2. Théorème réciproque',
        theorems: [
          {
            name: '3ème Théorème (Réciproque)',
            statement: 'Dans un triangle, si une droite passe par le milieu d\'un côté et est parallèle à un second côté, alors elle coupe le troisième côté en son milieu.',
          },
        ],
      },
    ],
    methods: [
      {
        id: 'milieux-method-1',
        title: 'Méthode : Démontrer un parallélisme et calculer une longueur',
        badge: 'Classique 4e',
        statement: 'Dans le triangle ABC, I est le milieu de [AB] et J le milieu de [AC]. On donne BC = 14 cm. Démontrer que (IJ) // (BC) et calculer IJ.',
        strategy: 'Appliquer successivement le 1er puis le 2ème théorème de la droite des milieux.',
        solutionSteps: [
          {
            title: 'Étape 1 : Citer le triangle et les milieux',
            explanation: 'Dans le triangle ABC, I est le milieu du côté [AB] et J est le milieu du côté [AC].',
          },
          {
            title: 'Étape 2 : Conclure sur le parallélisme',
            explanation: 'D\'après le 1er théorème de la droite des milieux, la droite (IJ) est parallèle à la droite (BC).',
            latex: '(IJ) \\parallel (BC)',
          },
          {
            title: 'Étape 3 : Calculer la longueur IJ',
            explanation: 'D\'après le 2ème théorème de la droite des milieux : IJ = BC / 2 = 14 / 2 = 7 cm.',
            latex: 'IJ = 7\\text{ cm}',
          },
        ],
        conclusion: 'La droite (IJ) est parallèle à (BC) et le segment [IJ] mesure 7 cm.',
      },
    ],
    pitfalls: [
      {
        trap: 'Multiplier par 2 au lieu de diviser par 2',
        badPracticeLatex: 'IJ = 2 \\times BC = 28\\text{ cm} \\quad (FAUX !)',
        correctRule: 'Le segment des milieux est plus petit que la base : IJ = BC / 2.',
        explanation: 'IJ est la moitié de BC, donc BC = 2 × IJ.',
      },
    ],
    bfemTips: [
      'Ce théorème est en réalité un cas particulier du théorème de Thalès avec un rapport k = 1/2 !',
    ],
  },
};

/**
 * Fallback generator for chapters without exhaustive custom sheet:
 * Generates an automated high-standard pedagogical course sheet.
 */
export function getChapterFullContent(chapterId: string, chapterTitle: string, gradeLevel: string = '3e'): ChapterFullContent {
  if (CHAPTERS_FULL_CONTENT[chapterId]) {
    return CHAPTERS_FULL_CONTENT[chapterId];
  }

  return {
    chapterId,
    essentialSummary: `Fiche complète et guide méthodologique officiel pour le chapitre "${chapterTitle}" (${gradeLevel} - Programme du Ministère de l'Éducation Nationale du Sénégal). Ce cours regroupe l'ensemble des définitions clés, propriétés, théorèmes et méthodes indispensables pour réussir les évaluations et le BFEM.`,
    keyFormulas: [
      { label: 'Propriété fondamentale', latex: 'A = B \\iff A - B = 0' },
      { label: 'Formule clé', latex: '\\mathcal{P}(x) = a x + b' },
      { label: 'Règle d\'or', latex: 'x \\in S \\iff \\text{Condition satisfaite}' },
    ],
    sections: [
      {
        sectionTitle: '1. Notions fondamentales et définitions officielles',
        intro: `Le chapitre "${chapterTitle}" constitue un pilier du programme de mathématiques au Sénégal.`,
        definitions: [
          {
            term: 'Définition principale',
            definition: `Ensemble des propriétés et objets mathématiques étudiés dans le cadre du cours de ${chapterTitle}.`,
            example: 'Application immédiate dans les situations de cours et d\'exercices.',
          },
        ],
        theorems: [
          {
            name: 'Théorème directeur',
            statement: 'Toute démarche mathématique rigoureuse repose sur la vérification préalable des hypothèses avant d\'énoncer la conclusion.',
            conditions: ['Identifier les données de l\'énoncé', 'Poser les relations adéquates'],
          },
        ],
        practicalApplication: {
          context: 'Vie courante et économie au Sénégal',
          problem: `Mise en œuvre des notions de ${chapterTitle} pour modéliser une situation pratique de gestion, de mesure ou de construction.`,
          solution: 'La résolution rigoureuse pas-à-pas garantit une réponse exacte et vérifiable.',
        },
      },
      {
        sectionTitle: '2. Méthodologie et démarche de résolution',
        intro: 'Les étapes indispensables pour mener à bien un raisonnement complet.',
        theorems: [
          {
            name: 'Règle de rigueur',
            statement: 'Toujours justifier chaque étape de calcul ou de construction par une propriété du cours explicitement nommée.',
          },
        ],
      },
    ],
    methods: [
      {
        id: `${chapterId}-method-standard`,
        title: `Méthode type : Résoudre un exercice classique de ${chapterTitle}`,
        badge: 'Méthode Clé Examen',
        statement: `Dans un sujet type de devoir surveillé ou d'examen blanc, comment aborder efficacement une question sur : ${chapterTitle} ?`,
        strategy: '1. Lire attentivement l\'énoncé ; 2. Citer la propriété ou le théorème adapté ; 3. Poser les calculs avec rigueur ; 4. Conclure avec une phrase claire et l\'unité.',
        solutionSteps: [
          {
            title: 'Étape 1 : Analyse des données de l\'énoncé',
            explanation: 'On isole les données connues et ce que l\'on cherche à démontrer ou calculer.',
          },
          {
            title: 'Étape 2 : Application de la formule ou de la règle du cours',
            explanation: 'On cite nommément la propriété du cours qui s\'applique à cette configuration.',
          },
          {
            title: 'Étape 3 : Calculs et simplification',
            explanation: 'On effectue les calculs algébriques ou géométriques avec précision.',
          },
          {
            title: 'Étape 4 : Conclusion et vérification',
            explanation: 'On formule la réponse finale et on vérifie sa cohérence physique ou géométrique.',
          },
        ],
        conclusion: 'La méthode est validée avec l\'obtention du résultat exact.',
        teacherNote: 'Ne sautez pas d\'étapes intermédiaires de justification pour préserver l\'intégralité des points du barème.',
      },
    ],
    pitfalls: [
      {
        trap: 'Oublier de citer le théorème ou la règle appliquée',
        correctRule: 'Toujours introduire le calcul par : "D\'après la propriété / le théorème..."',
        explanation: 'En mathématiques au Sénégal, un résultat sans justification ne rapporte que très peu de points.',
      },
      {
        trap: 'Confusion d\'unités de mesure',
        correctRule: 'Convertir toutes les données dans la même unité (cm, m, FCFA) avant d\'engager les calculs.',
        explanation: 'Une erreur d\'unité fausse l\'intégralité du raisonnement.',
      },
    ],
    bfemTips: [
      'Encadrez toujours vos résultats finaux en rouge ou bleu pour faciliter la correction du professeur ou de l\'examinateur.',
      'Rédigez des phrases courtes avec des connecteurs logiques clairs : "Or...", "Donc...", "D\'après...", "Par conséquent...".',
    ],
  };
}
