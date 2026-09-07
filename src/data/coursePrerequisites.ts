import { CourseChapter } from '../coursesData';

export interface PrerequisiteQuizOption {
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface CoursePrerequisite {
  id: string;
  title: string;
  sourceGrade: '5e' | '4e' | '3e' | 'Cycle moyen';
  category: 'Calcul & Algèbre' | 'Géométrie' | 'Organisation des données' | 'Arithmétique' | 'Méthodologie';
  summary: string;
  keyRule: string;
  formulaLatex?: string;
  exampleLatex?: string;
  commonTrap?: string;
  relatedChapterId?: string; // Si un cours de l'app traite ce prérequis
  quickCheck?: {
    question: string;
    options: PrerequisiteQuizOption[];
  };
}

export const COURSE_PREREQUISITES: Record<string, CoursePrerequisite[]> = {
  // ==========================================
  // 3ÈME (BFEM)
  // ==========================================
  'racine-carree-3e': [
    {
      id: 'rc-1',
      title: 'Carrés parfaits fondamentaux',
      sourceGrade: '4e',
      category: 'Calcul & Algèbre',
      summary: 'La racine carrée d\'un nombre positif est le nombre positif dont le carré donne ce nombre. Il faut maîtriser par cœur les carrés de 1 à 15.',
      formulaLatex: '\\sqrt{a} = b \\iff b \\ge 0 \\text{ et } b^2 = a',
      keyRule: 'Pour tout entier n entre 1 et 12, connaître n² : 1²=1, 2²=4, 3²=9, 4²=16, 5²=25, 6²=36, 7²=49, 8²=64, 9²=81, 10²=100, 11²=121, 12²=144, 13²=169.',
      exampleLatex: '\\sqrt{64} = 8 \\quad \\text{car } 8 \\ge 0 \\text{ et } 8^2 = 64',
      commonTrap: 'Attention : une racine carrée d\'un nombre réel négatif comme \\sqrt{-16} N\'EXISTE PAS dans l\'ensemble des nombres réels.',
      quickCheck: {
        question: 'Que vaut \\sqrt{81} ?',
        options: [
          { text: '9', isCorrect: true, explanation: 'Exact car 9² = 81 et 9 ≥ 0.' },
          { text: '-9', isCorrect: false, explanation: 'Faux, une racine carrée est toujours un nombre positif ou nul.' },
          { text: '40,5', isCorrect: false, explanation: 'Faux, la racine carrée n\'est pas la division par 2.' }
        ]
      }
    },
    {
      id: 'rc-2',
      title: 'Décomposition en facteurs premiers (PPCM & PGCD)',
      sourceGrade: '5e',
      category: 'Arithmétique',
      summary: 'Pour simplifier \\sqrt{a} sous la forme a\'\\sqrt{b}, on extrait les carrés parfaits cachés dans la décomposition du radicande.',
      formulaLatex: '\\sqrt{a \\times b} = \\sqrt{a} \\times \\sqrt{b} \\quad (a \\ge 0, b \\ge 0)',
      keyRule: 'Repérer le plus grand carré parfait diviseur du nombre (ex: 72 = 36 × 2).',
      exampleLatex: '\\sqrt{72} = \\sqrt{36 \\times 2} = \\sqrt{36} \\times \\sqrt{2} = 6\\sqrt{2}',
      commonTrap: 'GRAVE ERREUR : \\sqrt{a + b} \\neq \\sqrt{a} + \\sqrt{b} ! Ex: \\sqrt{9+16} = \\sqrt{25} = 5 \\neq 3 + 4 = 7.',
      quickCheck: {
        question: 'Quelle est la forme simplifiée de \\sqrt{50} ?',
        options: [
          { text: '5√2', isCorrect: true, explanation: 'Exact, 50 = 25 × 2 donc √(25 × 2) = 5√2.' },
          { text: '25√2', isCorrect: false, explanation: 'Faux, la racine de 25 est 5, pas 25.' },
          { text: '2√5', isCorrect: false, explanation: 'Faux, 2√5 correspond à √20.' }
        ]
      }
    },
    {
      id: 'rc-3',
      title: 'Théorème de Pythagore (Calcul de longueurs)',
      sourceGrade: '4e',
      category: 'Géométrie',
      summary: 'En géométrie de 3e, les racines carrées apparaissent systématiquement dans le calcul des longueurs via Pythagore.',
      formulaLatex: 'BC^2 = AB^2 + AC^2 \\implies BC = \\sqrt{AB^2 + AC^2}',
      keyRule: 'Dans un triangle rectangle, le carré de l\'hypoténuse est égal à la somme des carrés des côtés de l\'angle droit.',
      exampleLatex: 'AB = 3, AC = 4 \\implies BC^2 = 3^2 + 4^2 = 25 \\implies BC = 5',
      commonTrap: 'Toujours vérifier que le triangle est bien rectangle avant d\'écrire l\'égalité de Pythagore.',
      relatedChapterId: 'pythagore-4e'
    }
  ],

  'calcul-algebrique-3e': [
    {
      id: 'ca3-1',
      title: 'Règle des signes & Distributivité simple de 4e',
      sourceGrade: '4e',
      category: 'Calcul & Algèbre',
      summary: 'Développer consiste à transformer un produit en somme. Il faut maîtriser la gestion des parenthèses précédées d\'un signe moins.',
      formulaLatex: 'k(a + b) = ka + kb \\quad \\text{et} \\quad -(a - b) = -a + b',
      keyRule: 'Moins par moins donne plus : (-a) × (-b) = ab. Un signe moins devant une parenthèse inverse TOUS les signes intérieurs.',
      exampleLatex: '-3(2x - 5) = -3 \\times 2x + (-3) \\times (-5) = -6x + 15',
      commonTrap: 'Oublier d\'inverser le signe du deuxième terme : écrire -3(2x - 5) = -6x - 15 est une erreur classique.',
      relatedChapterId: 'calcul-algebrique'
    },
    {
      id: 'ca3-2',
      title: 'Double distributivité : (a + b)(c + d)',
      sourceGrade: '4e',
      category: 'Calcul & Algèbre',
      summary: 'Chaque terme de la première parenthèse doit multiplier chaque terme de la seconde parenthèse (4 multiplications au total).',
      formulaLatex: '(a + b)(c + d) = ac + ad + bc + bd',
      keyRule: 'Attention lors de la réduction : on ne peut additionner que les termes de même degré (les x² ensemble, les x ensemble, les nombres ensemble).',
      exampleLatex: '(2x + 3)(x - 4) = 2x^2 - 8x + 3x - 12 = 2x^2 - 5x - 12',
      commonTrap: 'Ne pas additionner 2x² et 3x : 2x² + 3x ne se simplifie pas en 5x³ !',
      quickCheck: {
        question: 'Que donne la réduction de 3x - 7x ?',
        options: [
          { text: '-4x', isCorrect: true, explanation: 'Exact, 3 - 7 = -4 donc -4x.' },
          { text: '4x', isCorrect: false, explanation: 'Attention au signe : 3 est plus petit que 7.' },
          { text: '-4x²', isCorrect: false, explanation: 'En additionnant des x, le résultat reste en x, pas en x².' }
        ]
      }
    },
    {
      id: 'ca3-3',
      title: 'Factorisation par facteur commun évident',
      sourceGrade: '4e',
      category: 'Calcul & Algèbre',
      summary: 'Factoriser, c\'est transformer une somme en produit en repérant un élément multiplicateur identique dans tous les termes.',
      formulaLatex: 'ka + kb = k(a + b)',
      keyRule: 'Chercher le plus grand facteur commun numérique et littéral.',
      exampleLatex: '6x^2 - 9x = 3x(2x) - 3x(3) = 3x(2x - 3)',
      commonTrap: 'Quand on factorise 5x + 5, il reste 5(x + 1) et JAMAIS 5(x) ! 5 = 5 × 1.'
    }
  ],

  'equations-inequations-3e': [
    {
      id: 'eq3-1',
      title: 'Résolution d\'équations du premier degré (4e)',
      sourceGrade: '4e',
      category: 'Calcul & Algèbre',
      summary: 'Isoler l\'inconnue x en appliquant les règles de transposition (changer de membre = changer d\'opération inverse).',
      formulaLatex: 'ax + b = c \\iff ax = c - b \\iff x = \\frac{c - b}{a} \\quad (a \\neq 0)',
      keyRule: 'Ce qui est additionné à gauche devient soustrait à droite. Ce qui multiplie à gauche devient diviseur à droite.',
      exampleLatex: '3x - 7 = 11 \\iff 3x = 18 \\iff x = 6',
      commonTrap: 'Attention : lorsqu\'on divise par le coefficient a, il ne change pas de signe ! Ex: -2x = 8 donne x = 8 / (-2) = -4.',
      relatedChapterId: 'equations-q'
    },
    {
      id: 'eq3-2',
      title: 'Théorème du produit nul',
      sourceGrade: '4e',
      category: 'Calcul & Algèbre',
      summary: 'Un produit de facteurs est nul si et seulement si l\'un au moins de ses facteurs est nul.',
      formulaLatex: 'A \\times B = 0 \\iff A = 0 \\quad \\text{ou} \\quad B = 0',
      keyRule: 'Ce théorème permet de résoudre des équations de degré 2 après factorisation.',
      exampleLatex: '(2x - 3)(x + 5) = 0 \\iff 2x - 3 = 0 \\text{ ou } x + 5 = 0 \\iff x = \\frac{3}{2} \\text{ ou } x = -5',
      commonTrap: 'Le membre de droite DOIT impérativement être 0 ! Si (x - 1)(x + 2) = 5, on NE PEUT PAS appliquer ce théorème.',
      quickCheck: {
        question: 'Quelles sont les solutions de (x - 4)(2x + 6) = 0 ?',
        options: [
          { text: 'x = 4 ou x = -3', isCorrect: true, explanation: 'x - 4 = 0 donne x = 4 et 2x + 6 = 0 donne x = -6/2 = -3.' },
          { text: 'x = -4 ou x = 3', isCorrect: false, explanation: 'Attention aux signes lors du passage dans l\'autre membre.' },
          { text: 'x = 0', isCorrect: false, explanation: 'x = 0 n\'annule aucun des facteurs.' }
        ]
      }
    },
    {
      id: 'eq3-3',
      title: 'Changement de sens d\'une inéquation (Règle d\'or)',
      sourceGrade: '4e',
      category: 'Calcul & Algèbre',
      summary: 'Multiplier ou diviser les deux membres d\'une inégalité par un nombre strictement négatif inverse le sens de l\'inégalité.',
      formulaLatex: 'a < b \\text{ et } c < 0 \\implies a \\times c > b \\times c',
      keyRule: 'Si on divise par un nombre négatif, ≤ devient ≥, et < devient >.',
      exampleLatex: '-4x \\le 12 \\iff x \\ge \\frac{12}{-4} \\iff x \\ge -3',
      commonTrap: 'Oublier d\'inverser le symbole lors d\'une division par un nombre négatif.',
      relatedChapterId: 'inequations'
    }
  ],

  'systemes-2-inconnues-3e': [
    {
      id: 'sys-1',
      title: 'Notion d\'équation à deux inconnues et de couple solution',
      sourceGrade: '4e',
      category: 'Calcul & Algèbre',
      summary: 'Une solution d\'un système est un couple ordonné (x, y) qui vérifie SIMULTANÉMENT les deux équations.',
      formulaLatex: 'ax + by = c',
      keyRule: 'L\'ordre compte : dans le couple (x, y), la première valeur est x (abscisse) et la seconde est y (ordonnée).',
      exampleLatex: 'x + y = 10 \\quad \\text{Le couple } (7, 3) \\text{ est solution car } 7 + 3 = 10',
      commonTrap: 'Ne pas vérifier le couple dans les DEUX équations du système.'
    },
    {
      id: 'sys-2',
      title: 'Substitution algébrique d\'une variable',
      sourceGrade: '4e',
      category: 'Calcul & Algèbre',
      summary: 'Exprimer une variable en fonction de l\'autre pour l\'injecter dans la seconde équation.',
      formulaLatex: 'x + 2y = 7 \\implies x = 7 - 2y',
      keyRule: 'Choisir la variable qui a pour coefficient 1 ou -1 pour éviter d\'introduire des fractions trop tôt.',
      exampleLatex: '2x + 3y = 12 \\implies 2(7 - 2y) + 3y = 12',
      commonTrap: 'Oublier les parenthèses lors du remplacement de la variable par son expression.'
    }
  ],

  'application-affine-3e': [
    {
      id: 'aff-1',
      title: 'Application linéaire et coefficient de proportionnalité (4e)',
      sourceGrade: '4e',
      category: 'Organisation des données',
      summary: 'Une fonction linéaire modélise une situation de proportionnalité. Sa droite passe obligatoirement par l\'origine O(0, 0).',
      formulaLatex: 'f(x) = ax \\quad \\text{avec } a = \\frac{f(x)}{x}',
      keyRule: 'Le coefficient a est le coefficient de proportionnalité (ou pente de la droite).',
      exampleLatex: 'f(x) = 3x \\implies f(0) = 0, \\; f(2) = 6',
      commonTrap: 'Une fonction affine f(x) = ax + b avec b ≠ 0 NE PASSE PAS par l\'origine : ce n\'est pas une proportionnalité directe.',
      relatedChapterId: 'application-lineaire'
    },
    {
      id: 'aff-2',
      title: 'Repérage d\'un point dans le repère orthonormé',
      sourceGrade: '5e',
      category: 'Géométrie',
      summary: 'Placer et lire les coordonnées (abscisse x sur l\'axe horizontal, ordonnée y sur l\'axe vertical).',
      formulaLatex: 'M(x_M, y_M)',
      keyRule: 'Pour tracer une droite, il suffit de déterminer les coordonnées de DEUX points distincts en choisissant deux valeurs de x.',
      exampleLatex: 'f(x) = 2x - 1 \\implies A(0, -1) \\text{ et } B(2, 3)',
      commonTrap: 'Inverser l\'axe des abscisses (horizontal x) et l\'axe des ordonnées (vertical y).'
    }
  ],

  'thales-3e': [
    {
      id: 'th-1',
      title: 'Théorème de la droite des milieux (4e)',
      sourceGrade: '4e',
      category: 'Géométrie',
      summary: 'La droite des milieux est un cas particulier fondamental du théorème de Thalès avec un rapport égal à 1/2.',
      formulaLatex: 'MN = \\frac{1}{2}BC \\quad \\text{et} \\quad (MN) // (BC)',
      keyRule: 'Si une droite passe par les milieux de deux côtés d\'un triangle, elle est parallèle au troisième côté.',
      exampleLatex: 'BC = 8\\text{ cm} \\implies MN = 4\\text{ cm}',
      commonTrap: 'Thalès généralise ce théorème à TOUTES les proportions, pas seulement pour les milieux.',
      relatedChapterId: 'droite-milieux'
    },
    {
      id: 'th-2',
      title: 'Égalité des produits en croix et fractions égales',
      sourceGrade: '5e',
      category: 'Arithmétique',
      summary: 'Pour calculer une quatrième proportionnelle dans les rapports de Thalès.',
      formulaLatex: '\\frac{a}{b} = \\frac{c}{d} \\iff a \\times d = b \\times c',
      keyRule: 'Pour trouver l\'inconnue d : d = (b × c) / a.',
      exampleLatex: '\\frac{AM}{AB} = \\frac{AN}{AC} \\implies \\frac{3}{5} = \\frac{AN}{10} \\implies AN = \\frac{3 \\times 10}{5} = 6',
      commonTrap: 'Faire attention à bien aligner les sommets correspondants : petits côtés au numérateur, grands côtés correspondants au dénominateur.',
      quickCheck: {
        question: 'Si 2/3 = x/15, que vaut x ?',
        options: [
          { text: '10', isCorrect: true, explanation: 'Exact : x = (2 × 15) / 3 = 30 / 3 = 10.' },
          { text: '5', isCorrect: false, explanation: 'Faux : 15 divisé par 3 fait 5, puis il faut multiplier par 2.' },
          { text: '30', isCorrect: false, explanation: 'Oubli de diviser par le dénominateur 3.' }
        ]
      }
    },
    {
      id: 'th-3',
      title: 'Droites parallèles et points alignés dans le même ordre',
      sourceGrade: '4e',
      category: 'Géométrie',
      summary: 'Pour appliquer la réciproque de Thalès, l\'ordre des points sur les sécantes est une condition indispensable.',
      keyRule: 'Vérifier que A, M, B d\'une part et A, N, C d\'autre part sont alignés dans le MÊME ORDRE.',
      exampleLatex: '\\text{Si } \\frac{AM}{AB} = \\frac{AN}{AC} \\text{ et points ordonnés, alors } (MN) // (BC)',
      commonTrap: 'Énoncer l\'égalité des rapports sans citer l\'alignement des points dans le même ordre entraîne une perte de points au BFEM.'
    }
  ],

  'trigonometrie-3e': [
    {
      id: 'trig-1',
      title: 'Le Cosinus d\'un angle aigu (4e)',
      sourceGrade: '4e',
      category: 'Géométrie',
      summary: 'Le cosinus est le rapport du côté adjacent sur l\'hypoténuse dans un triangle rectangle.',
      formulaLatex: '\\cos(\\widehat{B}) = \\frac{\\text{Côté adjacent}}{\\text{Hypoténuse}} = \\frac{BA}{BC}',
      keyRule: 'Un cosinus (et un sinus) est TOUJOURS compris strictement entre 0 et 1 pour un angle aigu.',
      exampleLatex: '\\text{Si } BA = 4 \\text{ et } BC = 5, \\; \\cos(\\widehat{B}) = \\frac{4}{5} = 0{,}8',
      commonTrap: 'Si votre calculatrice affiche un cosinus supérieur à 1, votre calcul est FAUX.',
      relatedChapterId: 'cosinus'
    },
    {
      id: 'trig-2',
      title: 'Vocabulaire : Côté opposé, Côté adjacent, Hypoténuse',
      sourceGrade: '4e',
      category: 'Géométrie',
      summary: 'Savoir repérer infailliblement les côtés par rapport à l\'angle étudié.',
      keyRule: 'L\'hypoténuse est en face de l\'angle droit (le plus grand côté). Le côté opposé est en face de l\'angle aigu considéré.',
      formulaLatex: '\\text{SOH - CAH - TOA}',
      exampleLatex: '\\sin = \\frac{\\text{Opp}}{\\text{Hyp}}, \\quad \\cos = \\frac{\\text{Adj}}{\\text{Hyp}}, \\quad \\tan = \\frac{\\text{Opp}}{\\text{Adj}}',
      commonTrap: 'Confondre côté adjacent et côté opposé lorsqu\'on change d\'angle aigu dans le même triangle.'
    },
    {
      id: 'trig-3',
      title: 'Théorème de Pythagore pour la relation fondamentale',
      sourceGrade: '4e',
      category: 'Géométrie',
      summary: 'La relation cos²(x) + sin²(x) = 1 découle directement du théorème de Pythagore divisé par le carré de l\'hypoténuse.',
      formulaLatex: '\\cos^2(\\alpha) + \\sin^2(\\alpha) = 1 \\quad \\text{et} \\quad \\tan(\\alpha) = \\frac{\\sin(\\alpha)}{\\cos(\\alpha)}',
      keyRule: 'Permet de calculer le sinus ou la tangente connaissant uniquement le cosinus, sans connaître les longueurs du triangle.',
      exampleLatex: '\\cos(\\alpha) = 0{,}6 \\implies \\sin^2(\\alpha) = 1 - 0{,}36 = 0{,}64 \\implies \\sin(\\alpha) = 0{,}8'
    }
  ],

  'angle-inscrit-3e': [
    {
      id: 'ang-1',
      title: 'Éléments d\'un cercle (Centre, Corde, Arc, Rayon)',
      sourceGrade: '5e',
      category: 'Géométrie',
      summary: 'Maîtriser le vocabulaire du cercle pour identifier quel angle intercepte quel arc.',
      keyRule: 'Une corde relie deux points du cercle. Un arc de cercle est la portion du cercle délimitée par deux points.',
      formulaLatex: '[AB] \\text{ corde}, \\quad \\widehat{AB} \\text{ arc intercepté}',
      exampleLatex: '\\text{Si } O \\text{ est le centre, } OA = OB = R \\implies OAB \\text{ est un triangle isocèle en } O',
      commonTrap: 'Ne pas confondre la longueur d\'une corde et la mesure d\'un arc.'
    },
    {
      id: 'ang-2',
      title: 'Somme des angles d\'un triangle = 180°',
      sourceGrade: '5e',
      category: 'Géométrie',
      summary: 'Propriété clé pour démontrer les relations entre angles au centre et angles inscrits.',
      formulaLatex: '\\widehat{A} + \\widehat{B} + \\widehat{C} = 180^\\circ',
      keyRule: 'Dans un triangle isocèle, les deux angles à la base sont strictement égaux.',
      exampleLatex: '\\text{Triangle isocèle avec angle au sommet } 80^\\circ \\implies \\text{angles à la base} = \\frac{180 - 80}{2} = 50^\\circ'
    }
  ],

  'vecteurs-3e': [
    {
      id: 'vec-1',
      title: 'Propriétés du Parallélogramme (4e)',
      sourceGrade: '4e',
      category: 'Géométrie',
      summary: 'Deux vecteurs sont égaux si et seulement si ils définissent un parallélogramme.',
      formulaLatex: '\\vec{AB} = \\vec{DC} \\iff ABCD \\text{ est un parallélogramme}',
      keyRule: 'Attention à l\'ordre des lettres du parallélogramme : ABCD (et non ABDC !).',
      exampleLatex: '\\vec{AB} = \\vec{DC} \\implies (AB) // (CD) \\text{ et } AB = CD',
      commonTrap: 'Écrire ABCD au lieu de ABDC : toujours suivre le tour de la figure.',
      relatedChapterId: 'translation-vecteur'
    },
    {
      id: 'vec-2',
      title: 'Relation de Chasles (4e)',
      sourceGrade: '4e',
      category: 'Géométrie',
      summary: 'La somme de deux vecteurs consécutifs (la fin du premier est le début du second).',
      formulaLatex: '\\vec{AB} + \\vec{BC} = \\vec{AC}',
      keyRule: 'Le point intermédiaire B "s\'efface" pour donner le vecteur direct reliant le point de départ A au point d\'arrivée C.',
      exampleLatex: '\\vec{MN} + \\vec{NP} + \\vec{PQ} = \\vec{MQ}',
      commonTrap: 'La relation ne s\'applique pas directement si les vecteurs ne sont pas consécutifs (il faut alors utiliser l\'opposé ou l\'égalité vectorielle).'
    }
  ],

  'reperage-plan-3e': [
    {
      id: 'rep-1',
      title: 'Calcul de distances sur un axe gradué',
      sourceGrade: '5e',
      category: 'Calcul & Algèbre',
      summary: 'La distance entre deux points d\'abscisses x_A et x_B est la différence de la plus grande abscisse moins la plus petite.',
      formulaLatex: 'd(A, B) = |x_B - x_A|',
      keyRule: 'Une distance est TOUJOURS positive ou nulle.',
      exampleLatex: 'x_A = -3, \\; x_B = 5 \\implies AB = 5 - (-3) = 8',
      commonTrap: 'Faire une soustraction et trouver un résultat négatif pour une distance.'
    },
    {
      id: 'rep-2',
      title: 'Coordonnées d\'un vecteur et théorème de Pythagore',
      sourceGrade: '4e',
      category: 'Géométrie',
      summary: 'La formule de la distance entre deux points dans un repère orthonormé est l\'application directe de Pythagore.',
      formulaLatex: 'AB = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}',
      keyRule: 'Toujours calculer (Fin - Début) : x_B - x_A et y_B - y_A.',
      exampleLatex: 'A(1, 2), B(4, 6) \\implies AB = \\sqrt{(4-1)^2 + (6-2)^2} = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5'
    }
  ],

  'statistique-3e': [
    {
      id: 'st3-1',
      title: 'Effectif total et fréquences en pourcentage (4e)',
      sourceGrade: '4e',
      category: 'Organisation des données',
      summary: 'L\'effectif total N est la somme de tous les effectifs. La fréquence est le rapport effectif / effectif total.',
      formulaLatex: 'f_i = \\frac{n_i}{N} \\quad \\text{et} \\quad f_i(\\%) = \\frac{n_i}{N} \\times 100',
      keyRule: 'La somme de toutes les fréquences relatives vaut toujours 1 (ou 100%).',
      exampleLatex: 'n_1 = 5, N = 20 \\implies f_1 = \\frac{5}{20} = 0{,}25 = 25\\%',
      commonTrap: 'Diviser par la modalité au lieu de diviser par l\'effectif total.',
      relatedChapterId: 'statistique'
    },
    {
      id: 'st3-2',
      title: 'Moyenne pondérée d\'une série statistique',
      sourceGrade: '4e',
      category: 'Organisation des données',
      summary: 'Multiplication de chaque modalité (ou centre de classe) par son effectif, puis division par l\'effectif total.',
      formulaLatex: '\\bar{x} = \\frac{\\sum n_i x_i}{N} = \\frac{n_1 x_1 + n_2 x_2 + \\dots + n_p x_p}{n_1 + n_2 + \\dots + n_p}',
      keyRule: 'Ne pas faire la moyenne simple des valeurs si les coefficients (effectifs) sont différents.',
      exampleLatex: '\\text{Notes } 10 \\text{ (coef 2) et } 16 \\text{ (coef 1)} \\implies \\bar{x} = \\frac{10 \\times 2 + 16 \\times 1}{3} = 12'
    }
  ],

  'geometrie-espace-3e': [
    {
      id: 'esp-1',
      title: 'Aires usuelles des figures planes (Carré, Rectangle, Triangle, Disque)',
      sourceGrade: '5e',
      category: 'Géométrie',
      summary: 'La base d\'un solide dans l\'espace est une figure plane dont il faut calculer l\'aire exacte.',
      formulaLatex: '\\mathcal{A}_{\\text{triangle}} = \\frac{b \\times h}{2}, \\quad \\mathcal{A}_{\\text{disque}} = \\pi R^2, \\quad \\mathcal{A}_{\\text{carré}} = c^2',
      keyRule: 'Toujours exprimer toutes les dimensions dans la MÊME unité (ex: tout en cm ou tout en m) avant de calculer l\'aire.',
      exampleLatex: 'R = 3\\text{ cm} \\implies \\mathcal{A}_{\\text{base cône}} = \\pi \\times 3^2 = 9\\pi \\approx 28{,}27\\text{ cm}^2',
      commonTrap: 'Confondre rayon et diamètre : si le diamètre est 10 cm, le rayon est 5 cm !'
    },
    {
      id: 'esp-2',
      title: 'Volume de la Pyramide de 4e',
      sourceGrade: '4e',
      category: 'Géométrie',
      summary: 'Le volume d\'une pyramide ou d\'un cône vaut toujours le tiers du produit de l\'aire de la base par la hauteur.',
      formulaLatex: 'V = \\frac{1}{3} \\times \\mathcal{B} \\times h',
      keyRule: 'La hauteur est la distance perpendiculaire du sommet au plan de la base.',
      exampleLatex: '\\mathcal{B} = 30\\text{ cm}^2, h = 6\\text{ cm} \\implies V = \\frac{1}{3} \\times 30 \\times 6 = 60\\text{ cm}^3',
      relatedChapterId: 'pyramides'
    }
  ],

  // ==========================================
  // 4ÈME
  // ==========================================
  'calcul-algebrique': [
    {
      id: 'ca4-1',
      title: 'Addition et soustraction de nombres relatifs (5e)',
      sourceGrade: '5e',
      category: 'Calcul & Algèbre',
      summary: 'Savoir additionner et soustraire des nombres avec signes identiques ou contraires.',
      formulaLatex: 'a - b = a + (-b) \\quad \\text{et} \\quad -(-a) = +a',
      keyRule: 'Pour additionner deux nombres de même signe, on garde le signe et on additionne les distances à zéro. Pour deux nombres de signes contraires, on prend le signe de celui qui a la plus grande distance à zéro et on soustrait.',
      exampleLatex: '(-5) + (-7) = -12 \\quad \\text{et} \\quad (-8) + (+12) = +4',
      commonTrap: 'Confondre addition et multiplication des relatifs : (-3) + (-4) = -7 (et non pas +12 !).'
    },
    {
      id: 'ca4-2',
      title: 'Distributivité simple : k(a + b) (5e)',
      sourceGrade: '5e',
      category: 'Calcul & Algèbre',
      summary: 'Multiplier le facteur extérieur par chaque terme situé dans la parenthèse.',
      formulaLatex: 'k(a + b) = ka + kb \\quad \\text{et} \\quad k(a - b) = ka - kb',
      keyRule: 'Chaque terme intérieur reçoit la multiplication par k avec son propre signe.',
      exampleLatex: '4(3x - 2) = 4 \\times 3x - 4 \\times 2 = 12x - 8'
    }
  ],

  'equations-q': [
    {
      id: 'eq4-1',
      title: 'Égalité et opérations inverses (5e)',
      sourceGrade: '5e',
      category: 'Calcul & Algèbre',
      summary: 'Une équation fonctionne comme une balance Roberval : toute opération appliquée à gauche doit être appliquée à droite.',
      formulaLatex: 'A = B \\iff A + c = B + c \\quad \\text{et} \\quad A \\times c = B \\times c \\; (c \\neq 0)',
      keyRule: 'Pour éliminer +5, on soustrait 5 des deux côtés. Pour éliminer ×3, on divise par 3 des deux côtés.',
      exampleLatex: 'x + 5 = 12 \\iff x + 5 - 5 = 12 - 5 \\iff x = 7'
    },
    {
      id: 'eq4-2',
      title: 'Simplification et quotient de fractions (5e)',
      sourceGrade: '5e',
      category: 'Arithmétique',
      summary: 'Diviser par un nombre rationnel non nul revient à multiplier par son inverse.',
      formulaLatex: '\\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\times \\frac{d}{c}',
      keyRule: 'Toujours simplifier la fraction finale au maximum (fraction irréductible).',
      exampleLatex: '2x = \\frac{4}{3} \\iff x = \\frac{4}{3} \\div 2 = \\frac{4}{3} \\times \\frac{1}{2} = \\frac{2}{3}'
    }
  ],

  'inequations': [
    {
      id: 'ineq4-1',
      title: 'Comparaison des nombres relatifs (5e)',
      sourceGrade: '5e',
      category: 'Calcul & Algèbre',
      summary: 'Sur une droite graduée, plus un nombre est situé à droite, plus il est grand.',
      formulaLatex: '-5 < -2 < 0 < 3',
      keyRule: 'Pour deux nombres négatifs, le plus grand est celui qui a la plus PETITE distance à zéro.',
      exampleLatex: '-10 < -3 \\quad \\text{car 10 > 3}'
    },
    {
      id: 'ineq4-2',
      title: 'Représentation sur une droite graduée',
      sourceGrade: '5e',
      category: 'Méthodologie',
      summary: 'Hachurer les solutions ou hachurer les valeurs rejetées selon la convention demandée en classe.',
      keyRule: 'Si x ≥ a : crochet tourné VERS les solutions. Si x > a : crochet tourné à l\'EXTÉRIEUR des solutions.',
      exampleLatex: 'x \\ge 2 \\implies [2, +\\infty['
    }
  ],

  'nombres-rationnels-operations': [
    {
      id: 'qop-1',
      title: 'Multiples communs et PPCM (5e)',
      sourceGrade: '5e',
      category: 'Arithmétique',
      summary: 'Pour additionner des fractions de dénominateurs différents, on cherche le plus petit multiple commun.',
      formulaLatex: '\\frac{a}{b} + \\frac{c}{d} = \\frac{a \\times d + b \\times c}{b \\times d}',
      keyRule: 'Ne JAMAIS additionner les numérateurs entre eux et les dénominateurs entre eux !',
      exampleLatex: '\\frac{1}{2} + \\frac{1}{3} = \\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6} \\neq \\frac{2}{5}',
      commonTrap: 'Écrire a/b + c/d = (a+c)/(b+d) est la faute la plus fréquente au collège !'
    }
  ],

  'nombres-rationnels-puissances': [
    {
      id: 'qpow-1',
      title: 'Définition d\'un produit de facteurs égaux',
      sourceGrade: '5e',
      category: 'Arithmétique',
      summary: 'Une puissance est une abréviation d\'une multiplication répétée du même facteur.',
      formulaLatex: 'a^n = \\underbrace{a \\times a \\times \\dots \\times a}_{n \\text{ facteurs}} \\quad (a^0 = 1, \\; a^1 = a)',
      keyRule: 'Priorité opératoire : la puissance s\'applique avant la multiplication et avant le signe moins sauf s\'il y a des parenthèses.',
      exampleLatex: '(-3)^2 = (-3) \\times (-3) = +9 \\quad \\text{alors que} \\quad -3^2 = -(3 \\times 3) = -9',
      commonTrap: 'Confondre (-2)^4 = +16 et -2^4 = -16.'
    }
  ],

  'droite-milieux': [
    {
      id: 'dm-1',
      title: 'Définition du milieu d\'un segment et codage (5e)',
      sourceGrade: '5e',
      category: 'Géométrie',
      summary: 'Le milieu d\'un segment [AB] est l\'unique point I du segment tel que IA = IB.',
      formulaLatex: 'I \\in [AB] \\quad \\text{et} \\quad IA = IB = \\frac{AB}{2}',
      keyRule: 'Toujours repérer ou coder les segments égaux sur la figure géométrique.',
      exampleLatex: 'AB = 6\\text{ cm} \\implies IA = IB = 3\\text{ cm}'
    },
    {
      id: 'dm-2',
      title: 'Droites parallèles et propriété des quadrilatères',
      sourceGrade: '5e',
      category: 'Géométrie',
      summary: 'Deux droites parallèles ont la même direction et ne se coupent jamais.',
      keyRule: 'Si deux droites sont parallèles à une même troisième, alors elles sont parallèles entre elles.',
      formulaLatex: '(d_1) // (d_2) \\text{ et } (d_2) // (d_3) \\implies (d_1) // (d_3)'
    }
  ],

  'cosinus': [
    {
      id: 'cos-1',
      title: 'Triangle rectangle et angle droit (5e)',
      sourceGrade: '5e',
      category: 'Géométrie',
      summary: 'Un triangle rectangle possède un angle droit (90°) et deux angles aigus complémentaires.',
      formulaLatex: '\\widehat{A} = 90^\\circ \\implies \\widehat{B} + \\widehat{C} = 90^\\circ',
      keyRule: 'L\'hypoténuse est le côté opposé à l\'angle droit et c\'est toujours le côté le plus long du triangle.',
      exampleLatex: '\\widehat{B} = 30^\\circ \\implies \\widehat{C} = 90 - 30 = 60^\\circ'
    }
  ],

  'translation-vecteur': [
    {
      id: 'trans-1',
      title: 'Translation : Glissement sans déformation ni rotation',
      sourceGrade: '5e',
      category: 'Géométrie',
      summary: 'La translation transforme une figure en une figure superposable par glissement.',
      keyRule: 'Une translation conserve les longueurs, l\'alignement, le parallélisme et les aires.',
      formulaLatex: 't_{\\vec{u}}(M) = M\' \\implies \\vec{MM\'} = \\vec{u}'
    }
  ],

  'pyramides': [
    {
      id: 'pyr-1',
      title: 'Calcul de périmètre et aire des polygones usuels',
      sourceGrade: '5e',
      category: 'Géométrie',
      summary: 'Savoir calculer l\'aire de la base carrée, rectangulaire ou triangulaire.',
      formulaLatex: '\\mathcal{A}_{\\text{carré}} = c^2, \\quad \\mathcal{A}_{\\text{rectangle}} = L \\times l, \\quad \\mathcal{A}_{\\text{triangle}} = \\frac{b \\times h}{2}',
      keyRule: 'Le volume d\'une pyramide est donné par V = (1/3) × Aire de la base × Hauteur.',
      exampleLatex: 'c = 4\\text{ cm}, h = 9\\text{ cm} \\implies V = \\frac{1}{3} \\times 4^2 \\times 9 = 48\\text{ cm}^3'
    }
  ]
};

/**
 * Récupère les prérequis pour un cours donné, avec génération de prérequis génériques si besoin
 */
export function getChapterPrerequisites(chapter: CourseChapter): CoursePrerequisite[] {
  // 1. Recherche par ID direct
  if (COURSE_PREREQUISITES[chapter.id] && COURSE_PREREQUISITES[chapter.id].length > 0) {
    return COURSE_PREREQUISITES[chapter.id];
  }

  // 2. Recherche par alias (en enlevant ou ajoutant '-3e')
  const altId = chapter.id.endsWith('-3e') ? chapter.id.replace('-3e', '') : `${chapter.id}-3e`;
  if (COURSE_PREREQUISITES[altId] && COURSE_PREREQUISITES[altId].length > 0) {
    return COURSE_PREREQUISITES[altId];
  }

  // 3. Fallback riche selon le domaine (Activités numériques vs géométriques)
  const is3e = chapter.gradeLevel === '3e' || chapter.id.endsWith('-3e');
  const isGeom = chapter.category === 'Activités géométriques';

  if (isGeom) {
    return [
      {
        id: `prereq-geom-1-${chapter.id}`,
        title: is3e ? 'Propriétés des triangles & théorème de Pythagore' : 'Figures usuelles et instruments de géométrie',
        sourceGrade: is3e ? '4e' : '5e',
        category: 'Géométrie',
        summary: `Rappels géométriques indispensables pour aborder ${chapter.title}.`,
        keyRule: 'Utiliser la règle graduée, l\'équerre et le compas avec précision. Coder systématiquement les angles droits et les segments égaux sur la figure.',
        formulaLatex: is3e ? 'BC^2 = AB^2 + AC^2 \\quad (\\text{si } ABC \\text{ rectangle en } A)' : '\\widehat{A} + \\widehat{B} + \\widehat{C} = 180^\\circ',
        exampleLatex: 'AB = 3, AC = 4 \\implies BC = 5',
        commonTrap: 'Ne pas confondre hypoténuse et côtés de l\'angle droit.'
      },
      {
        id: `prereq-geom-2-${chapter.id}`,
        title: 'Parallélisme, perpendicularité et alignement',
        sourceGrade: is3e ? '4e' : '5e',
        category: 'Géométrie',
        summary: 'Règles de déduction fondamentales en géométrie plane déductive.',
        keyRule: 'Si deux droites sont perpendiculaires à une même troisième, alors elles sont parallèles entre elles.',
        formulaLatex: '(d_1) \\perp (d) \\text{ et } (d_2) \\perp (d) \\implies (d_1) // (d_2)',
        commonTrap: 'Une figure approximative ne remplace jamais une démonstration par une propriété mathématique.'
      }
    ];
  }

  // Numérique par défaut
  return [
    {
      id: `prereq-num-1-${chapter.id}`,
      title: is3e ? 'Calcul littéral & Identités remarquables' : 'Opérations sur les nombres relatifs',
      sourceGrade: is3e ? '4e' : '5e',
      category: 'Calcul & Algèbre',
      summary: `Les bases du calcul requises pour le cours : ${chapter.title}.`,
      keyRule: 'Respecter scrupuleusement la priorité des opérations : parenthèses d\'abord, puis puissances, puis multiplications/divisions, enfin additions/soustractions.',
      formulaLatex: is3e ? '(a+b)^2 = a^2 + 2ab + b^2' : 'k(a+b) = ka + kb',
      exampleLatex: is3e ? '(x+3)^2 = x^2 + 6x + 9' : '3(2x-4) = 6x - 12',
      commonTrap: 'Attention aux erreurs de signes avec les parenthèses précédées du signe moins.'
    },
    {
      id: `prereq-num-2-${chapter.id}`,
      title: 'Techniques de résolution et transposition',
      sourceGrade: is3e ? '4e' : '5e',
      category: 'Calcul & Algèbre',
      summary: 'Isoler une inconnue dans une équation ou formule littérale.',
      keyRule: 'Changer un terme de membre revient à lui appliquer l\'opération opposée (addition ↔ soustraction, multiplication ↔ division).',
      formulaLatex: 'ax + b = 0 \\iff x = -\\frac{b}{a} \\quad (a \\neq 0)',
      exampleLatex: '2x - 6 = 0 \\iff 2x = 6 \\iff x = 3',
      commonTrap: 'Oublier d\'inverser le signe lorsqu\'on transpose un terme additif.'
    }
  ];
}
