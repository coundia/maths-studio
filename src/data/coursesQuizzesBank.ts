export interface QuickQuizOption {
  text: string;
  latex?: string;
  isCorrect: boolean;
  feedback: string;
}

export interface QuickQuizQuestion {
  id: string;
  question: string;
  questionLatex?: string;
  options: QuickQuizOption[];
  explanation: string;
  ruleReminder: string;
  tip?: string;
}

export interface QuickQuizData {
  chapterId: string;
  chapterTitle: string;
  gradeLevel: '6e' | '5e' | '4e' | '3e';
  badge: string;
  questions: QuickQuizQuestion[];
}

export const COURSES_QUIZZES_BANK: Record<string, QuickQuizData> = {
  // =========================================================================
  // CLASSE DE 4ÈME
  // =========================================================================

  'pythagore': {
    chapterId: 'pythagore',
    chapterTitle: 'Théorème de Pythagore - 4e',
    gradeLevel: '4e',
    badge: 'Quiz Spécifique 4e',
    questions: [
      {
        id: 'pyth-1',
        question: "Dans un triangle RST rectangle en S, quelle est l'égalité de Pythagore correcte ?",
        questionLatex: "\\text{Triangle } RST \\text{ rectangle en } S",
        options: [
          {
            text: "RT² = RS² + ST²",
            latex: "RT^2 = RS^2 + ST^2",
            isCorrect: true,
            feedback: "Parfait ! Le sommet de l'angle droit est S, donc l'hypoténuse est [RT]."
          },
          {
            text: "RS² = RT² + ST²",
            latex: "RS^2 = RT^2 + ST^2",
            isCorrect: false,
            feedback: "Faux : RS est un côté de l'angle droit, pas l'hypoténuse."
          },
          {
            text: "ST² = RS² + RT²",
            latex: "ST^2 = RS^2 + RT^2",
            isCorrect: false,
            feedback: "Faux : le côté en face de l'angle droit en S est RT."
          }
        ],
        explanation: "L'hypoténuse est toujours le côté opposé à l'angle droit. En S, l'hypoténuse est RT, d'où RT² = RS² + ST².",
        ruleReminder: "Dans un triangle rectangle, le carré de l'hypoténuse est égal à la somme des carrés des deux autres côtés."
      },
      {
        id: 'pyth-2',
        question: "Si les côtés d'un triangle mesurent 6 cm, 8 cm et 10 cm, ce triangle est-il rectangle ?",
        questionLatex: "6^2 + 8^2 = 36 + 64 = 100 = 10^2",
        options: [
          {
            text: "Oui, d'après la réciproque du théorème de Pythagore",
            isCorrect: true,
            feedback: "Exact ! 6² + 8² = 100 et 10² = 100. L'égalité est vérifiée."
          },
          {
            text: "Non, car 6 + 8 ≠ 10",
            isCorrect: false,
            feedback: "Piège : on compare la somme des carrés, jamais la simple somme des longueurs !"
          },
          {
            text: "On ne peut pas savoir sans mesurer les angles",
            isCorrect: false,
            feedback: "Faux : la réciproque de Pythagore prouve qu'il est rectangle par le calcul."
          }
        ],
        explanation: "10² = 100 et 6² + 8² = 36 + 64 = 100. Comme 10² = 6² + 8², le triangle est rectangle.",
        ruleReminder: "Pour prouver qu'un triangle est rectangle, on vérifie si le carré du plus grand côté est égal à la somme des carrés des deux autres."
      },
      {
        id: 'pyth-3',
        question: "Soit ABC rectangle en A tel que BC = 13 cm et AB = 5 cm. Que vaut AC ?",
        questionLatex: "AC^2 = BC^2 - AB^2 = 13^2 - 5^2",
        options: [
          {
            text: "12 cm",
            latex: "AC = \\sqrt{144} = 12\\text{ cm}",
            isCorrect: true,
            feedback: "Bravo ! AC² = 169 - 25 = 144, et √144 = 12 cm."
          },
          {
            text: "8 cm",
            isCorrect: false,
            feedback: "Attention : ne pas faire 13 - 5 ! Il faut soustraire les carrés."
          },
          {
            text: "18 cm",
            isCorrect: false,
            feedback: "Impossible : un côté de l'angle droit est toujours plus court que l'hypoténuse (13 cm)."
          }
        ],
        explanation: "AC² = 13² - 5² = 169 - 25 = 144. Donc AC = √144 = 12 cm.",
        ruleReminder: "Pour trouver un côté de l'angle droit : Côté² = Hypoténuse² - AutreCôté²."
      }
    ]
  },

  'droite-milieux': {
    chapterId: 'droite-milieux',
    chapterTitle: 'Théorème de la droite des milieux - 4e',
    gradeLevel: '4e',
    badge: 'Quiz Spécifique 4e',
    questions: [
      {
        id: 'mil-1',
        question: "Dans un triangle ABC, I est le milieu de [AB] et J le milieu de [AC]. Si BC = 18 cm, que vaut IJ ?",
        questionLatex: "IJ = \\frac{1}{2}BC",
        options: [
          {
            text: "9 cm",
            latex: "IJ = 9\\text{ cm}",
            isCorrect: true,
            feedback: "Exactement ! Le segment joignant les milieux mesure la moitié du troisième côté."
          },
          {
            text: "18 cm",
            isCorrect: false,
            feedback: "Faux : IJ mesure la moitié de BC, pas la même longueur."
          },
          {
            text: "36 cm",
            isCorrect: false,
            feedback: "Faux : vous avez multiplié au lieu de diviser par 2."
          }
        ],
        explanation: "D'après le 1er théorème de la droite des milieux, IJ = BC / 2 = 18 / 2 = 9 cm.",
        ruleReminder: "Dans un triangle, la longueur du segment joignant les milieux de deux côtés est égale à la moitié de celle du troisième côté."
      },
      {
        id: 'mil-2',
        question: "Quelle est la position relative des droites (IJ) et (BC) ?",
        questionLatex: "(IJ) \\text{ et } (BC)",
        options: [
          {
            text: "Elles sont strictement parallèles : (IJ) // (BC)",
            isCorrect: true,
            feedback: "Bravo ! C'est la propriété de parallélisme de la droite des milieux."
          },
          {
            text: "Elles sont perpendiculaires",
            isCorrect: false,
            feedback: "Faux : rien n'indique que le triangle soit rectangle."
          },
          {
            text: "Elles sont sécantes en un point extérieur",
            isCorrect: false,
            feedback: "Faux : la droite des milieux est toujours parallèle au troisième côté."
          }
        ],
        explanation: "Si une droite passe par les milieux de deux côtés d'un triangle, elle est parallèle au troisième côté.",
        ruleReminder: "Dans un triangle, la droite qui passe par les milieux de deux côtés est parallèle au support du troisième côté."
      },
      {
        id: 'mil-3',
        question: "Dans un triangle ABC, D est le milieu de [AB]. La parallèle à (BC) passant par D coupe [AC] en E. Que peut-on affirmer ?",
        options: [
          {
            text: "E est obligatoirement le milieu de [AC]",
            isCorrect: true,
            feedback: "Parfait ! C'est le 2e théorème de la droite des milieux."
          },
          {
            text: "E est situé au tiers de [AC]",
            isCorrect: false,
            feedback: "Faux : il coupe exactement au milieu."
          },
          {
            text: "On ne peut rien en déduire sans mesurer",
            isCorrect: false,
            feedback: "Faux : la propriété géométrique permet de l'affirmer avec certitude."
          }
        ],
        explanation: "Si une droite passe par le milieu d'un côté et est parallèle à un deuxième côté, alors elle coupe le troisième côté en son milieu.",
        ruleReminder: "Théorème 2 : Milieu + Parallèle implique Milieu du troisième côté."
      }
    ]
  },

  'distance': {
    chapterId: 'distance',
    chapterTitle: 'Distance - 4e',
    gradeLevel: '4e',
    badge: 'Quiz Spécifique 4e',
    questions: [
      {
        id: 'dist-1',
        question: "Qu'appelle-t-on la distance d'un point A à une droite (D) ?",
        questionLatex: "d(A, (D)) = AH",
        options: [
          {
            text: "La longueur AH où H est le projeté orthogonal de A sur (D)",
            isCorrect: true,
            feedback: "Exact ! C'est la plus courte distance entre le point A et la droite (D)."
          },
          {
            text: "N'importe quel segment reliant A à la droite (D)",
            isCorrect: false,
            feedback: "Faux : la distance est mesurée uniquement selon la perpendiculaire."
          },
          {
            text: "La moitié de la distance de A à l'origine",
            isCorrect: false,
            feedback: "Incorrect."
          }
        ],
        explanation: "La distance d'un point à une droite est la longueur du segment perpendiculaire mené de ce point à la droite.",
        ruleReminder: "d(A, (D)) = AH, avec (AH) perpendiculaire à (D) et H sur (D)."
      },
      {
        id: 'dist-2',
        question: "Soit un cercle C de centre O et de rayon R = 5 cm. Une droite (D) est tangente au cercle au point T. Que vaut OT ?",
        questionLatex: "(D) \\text{ tangente en } T \\implies (OT) \\perp (D)",
        options: [
          {
            text: "OT = 5 cm et (OT) est perpendiculaire à (D)",
            isCorrect: true,
            feedback: "Bravo ! La tangente est toujours perpendiculaire au rayon au point de contact."
          },
          {
            text: "OT < 5 cm",
            isCorrect: false,
            feedback: "Faux : T appartient au cercle, donc OT est exactement égal au rayon R = 5 cm."
          },
          {
            text: "OT = 10 cm",
            isCorrect: false,
            feedback: "Faux : 10 cm correspondrait au diamètre."
          }
        ],
        explanation: "Une droite est tangente à un cercle si sa distance au centre est égale au rayon, ce qui implique (OT) ⊥ (D).",
        ruleReminder: "La tangente à un cercle en un point T est perpendiculaire au rayon [OT] en ce point."
      }
    ]
  },

  'calcul-algebrique': {
    chapterId: 'calcul-algebrique',
    chapterTitle: 'Calcul Algébrique & Règles fondamentales - 4e',
    gradeLevel: '4e',
    badge: 'Quiz Spécifique 4e',
    questions: [
      {
        id: 'ca4-q-sign-1',
        question: "Règle des signes dans ℤ : quel est le résultat exact du produit (-4) × (-5) ?",
        questionLatex: "(-4) \\times (-5) = \\, ?",
        options: [
          {
            text: "+20 (Positif car Moins × Moins = Plus)",
            latex: "(-4) \\times (-5) = +20",
            isCorrect: true,
            feedback: "Excellent ! Deux nombres négatifs multipliés entre eux donnent TOUJOURS un résultat strictement positif."
          },
          {
            text: "-20 (Négatif)",
            latex: "(-4) \\times (-5) = -20",
            isCorrect: false,
            feedback: "Attention au piège fréquent : (-) × (-) donne (+), pas (-) !"
          },
          {
            text: "-9 (Somme)",
            isCorrect: false,
            feedback: "Confusion : il s'agit d'une multiplication (×), pas d'une addition (-4 + -5) !"
          }
        ],
        explanation: "Dans l'ensemble ℤ, la règle d'or de la multiplication stipule que le produit de deux nombres de même signe est positif : (-) × (-) = (+). Donc (-4) × (-5) = +20.",
        ruleReminder: "Règle d'or dans ℤ : Moins × Moins = Plus. (-a) × (-b) = +(a × b)."
      },
      {
        id: 'ca4-q-sign-2',
        question: "Soustraction dans ℤ : quelle est la valeur de 7 - (-8) ?",
        questionLatex: "7 - (-8) = \\, ?",
        options: [
          {
            text: "15 (car soustraire un négatif revient à ajouter son opposé)",
            latex: "7 - (-8) = 7 + 8 = 15",
            isCorrect: true,
            feedback: "Parfait ! La soustraction de (-8) se transforme en addition de (+8)."
          },
          {
            text: "-1",
            latex: "7 - 8 = -1",
            isCorrect: false,
            feedback: "Faux : vous avez ignoré le double signe moins !"
          },
          {
            text: "-15",
            isCorrect: false,
            feedback: "Erreur de signe : 7 - (-8) = 7 + 8 = +15."
          }
        ],
        explanation: "Soustraire un nombre relatif, c'est ajouter son opposé : a - (-b) = a + b. Ainsi 7 - (-8) = 7 + 8 = 15.",
        ruleReminder: "Dans ℤ, soustraire un nombre négatif équivaut à ajouter un nombre positif : a - (-b) = a + b."
      },
      {
        id: 'ca4-q-sign-3',
        question: "Produit de plusieurs facteurs relatifs : quel est le signe et la valeur de (-2) × (-3) × (-4) ?",
        questionLatex: "(-2) \\times (-3) \\times (-4) = \\, ?",
        options: [
          {
            text: "-24 (Négatif, car il y a 3 signes moins, nombre impair)",
            latex: "(-2) \\times (-3) \\times (-4) = -24",
            isCorrect: true,
            feedback: "Bravo ! Le produit contient 3 facteurs négatifs. 3 étant impair, le résultat final est négatif."
          },
          {
            text: "+24 (Positif)",
            latex: "+24",
            isCorrect: false,
            feedback: "Attention : (-2) × (-3) = +6, puis (+6) × (-4) = -24 !"
          },
          {
            text: "-9",
            isCorrect: false,
            feedback: "Ne confondez pas la multiplication avec l'addition."
          }
        ],
        explanation: "On compte les signes « - » : il y en a 3 (nombre impair). Le produit est donc négatif : -(2 × 3 × 4) = -24.",
        ruleReminder: "Produit de facteurs relatifs : nombre de « - » pair => POSITIF (+) ; nombre de « - » impair => NÉGATIF (-)."
      },
      {
        id: 'ca4-q-pow-1',
        question: "Calcul de puissance et parenthèses : quelle est la différence essentielle entre (-3)² et -3² ?",
        questionLatex: "(-3)^2 \\quad \\text{vs} \\quad -3^2",
        options: [
          {
            text: "(-3)² = +9 et -3² = -9",
            latex: "(-3)^2 = +9 \\quad \\text{et} \\quad -3^2 = -9",
            isCorrect: true,
            feedback: "Exactement ! Avec parenthèses, le carré porte sur le signe moins. Sans parenthèses, le carré ne porte que sur 3 !"
          },
          {
            text: "Ils sont tous les deux égaux à +9",
            isCorrect: false,
            feedback: "Piège classique de contrôle : sans parenthèses, le signe moins n'est pas élevé au carré !"
          },
          {
            text: "Ils sont tous les deux égaux à -9",
            isCorrect: false,
            feedback: "Faux : (-3)² = (-3) × (-3) = +9 car moins × moins = plus."
          }
        ],
        explanation: "(-3)² = (-3) × (-3) = +9 (exposant 2 pair portant sur tout le bloc). En revanche, -3² = -(3 × 3) = -9 (le carré ne s'applique qu'au chiffre 3).",
        ruleReminder: "Toujours vérifier la présence de parenthèses : (-a)² = +a² alors que -a² = -(a²)."
      },
      {
        id: 'ca4-q-pow-2',
        question: "Calcul de puissance d'un nombre négatif : que vaut (-2)³ ?",
        questionLatex: "(-2)^3 = \\, ?",
        options: [
          {
            text: "-8 (car l'exposant 3 est impair)",
            latex: "(-2)^3 = (-2) \\times (-2) \\times (-2) = -8",
            isCorrect: true,
            feedback: "Parfait ! (-2) × (-2) = +4, et (+4) × (-2) = -8."
          },
          {
            text: "+8",
            isCorrect: false,
            feedback: "Faux : un nombre négatif élevé à une puissance impaire est toujours négatif !"
          },
          {
            text: "-6",
            isCorrect: false,
            feedback: "Grave erreur : 2³ = 2 × 2 × 2 = 8, pas 2 × 3 = 6 !"
          }
        ],
        explanation: "(-2)³ = (-2) × (-2) × (-2) = +4 × (-2) = -8. L'exposant 3 est impair, le résultat est négatif.",
        ruleReminder: "Pour tout nombre négatif : (-a)^n est POSITIF si n est PAIR, et NÉGATIF si n est IMPAIR."
      },
      {
        id: 'ca4-q-pow-3',
        question: "Propriétés des puissances dans le calcul algébrique : simplifier l'expression 3x² × 4x³.",
        questionLatex: "3x^2 \\times 4x^3 = \\, ?",
        options: [
          {
            text: "12x⁵ (on multiplie les coefficients et on additionne les exposants)",
            latex: "12x^{2+3} = 12x^5",
            isCorrect: true,
            feedback: "Bravo ! 3 × 4 = 12 et x² × x³ = x^(2+3) = x⁵."
          },
          {
            text: "12x⁶ (erreur : multiplication des exposants)",
            latex: "12x^6",
            isCorrect: false,
            feedback: "Attention : pour un produit de puissances, on ADDITIONNE les exposants, on ne les multiplie pas !"
          },
          {
            text: "7x⁵",
            isCorrect: false,
            feedback: "Faux : on multiplie les coefficients (3 × 4 = 12), on ne les additionne pas !"
          }
        ],
        explanation: "3x² × 4x³ = (3 × 4) × (x² × x³) = 12 × x^(2+3) = 12x⁵.",
        ruleReminder: "Formule clé : x^a × x^b = x^(a+b)."
      },
      {
        id: 'ca4-q1',
        question: "Suppression de parenthèses précédées d'un signe moins : réduire -(3x - 7).",
        questionLatex: "-(3x - 7) = \\, ?",
        options: [
          {
            text: "-3x + 7",
            latex: "-3x + 7",
            isCorrect: true,
            feedback: "Parfait ! Le signe moins devant la parenthèse inverse TOUS les signes intérieurs : +3x devient -3x et -7 devient +7."
          },
          {
            text: "-3x - 7",
            latex: "-3x - 7",
            isCorrect: false,
            feedback: "Attention au piège : le -7 devient +7 par la règle moins par moins !"
          },
          {
            text: "3x + 7",
            isCorrect: false,
            feedback: "Faux : le terme +3x devient -3x."
          }
        ],
        explanation: "-(a - b) = -a + b. On change les signes de chaque terme dans la parenthèse.",
        ruleReminder: "Un signe moins devant une parenthèse transforme chaque terme en son opposé."
      },
      {
        id: 'ca4-q-dev-sign',
        question: "Développement avec facteur négatif : développer et réduire -3(2x - 5).",
        questionLatex: "-3(2x - 5) = (-3) \\times 2x + (-3) \\times (-5)",
        options: [
          {
            text: "-6x + 15",
            latex: "-6x + 15",
            isCorrect: true,
            feedback: "Superbe ! (-3) × 2x = -6x et (-3) × (-5) = +15 car moins × moins = plus."
          },
          {
            text: "-6x - 15",
            isCorrect: false,
            feedback: "Attention : (-3) × (-5) = +15, pas -15 !"
          },
          {
            text: "6x - 15",
            isCorrect: false,
            feedback: "Faux : (-3) × 2x = -6x."
          }
        ],
        explanation: "Par simple distributivité : -3(2x - 5) = (-3) × 2x + (-3) × (-5) = -6x + 15.",
        ruleReminder: "Règle k(a - b) = ka - kb : faire très attention au produit des signes négatifs !"
      },
      {
        id: 'ca4-q2',
        question: "Double distributivité : développer et réduire l'expression (2x + 3)(x - 4).",
        questionLatex: "(2x + 3)(x - 4) = 2x^2 - 8x + 3x - 12",
        options: [
          {
            text: "2x² - 5x - 12",
            latex: "2x^2 - 5x - 12",
            isCorrect: true,
            feedback: "Excellent ! 2x² - 8x + 3x - 12 = 2x² - 5x - 12."
          },
          {
            text: "2x² - 11x - 12",
            isCorrect: false,
            feedback: "Attention aux signes relatifs : -8x + 3x = -5x, pas -11x."
          },
          {
            text: "2x² - 12",
            isCorrect: false,
            feedback: "Oubli des produits croisés (-8x et +3x) !"
          }
        ],
        explanation: "(2x)(x) + (2x)(-4) + (3)(x) + (3)(-4) = 2x² - 8x + 3x - 12 = 2x² - 5x - 12.",
        ruleReminder: "(a + b)(c + d) = ac + ad + bc + bd, puis regrouper les termes semblables."
      },
      {
        id: 'ca4-q3',
        question: "Factorisation par facteur commun : quelle est la forme factorisée de 15x - 5 ?",
        questionLatex: "15x - 5 = 5 \\times 3x - 5 \\times 1",
        options: [
          {
            text: "5(3x - 1)",
            latex: "5(3x - 1)",
            isCorrect: true,
            feedback: "Très bien ! Ne jamais oublier le '1' quand on factorise par le terme entier 5."
          },
          {
            text: "5(3x)",
            isCorrect: false,
            feedback: "Erreur classique : 5 / 5 = 1, le deuxième terme ne disparaît jamais !"
          },
          {
            text: "10x",
            isCorrect: false,
            feedback: "Interdit : on ne peut pas soustraire un terme en x et un nombre constant."
          }
        ],
        explanation: "15x - 5 = 5 × (3x) - 5 × (1) = 5(3x - 1).",
        ruleReminder: "Quand le facteur commun est l'un des termes entiers, il reste obligatoirement 1 ou -1 dans la parenthèse."
      }
    ]
  },

  'inequations': {
    chapterId: 'inequations',
    chapterTitle: 'Inéquations du 1er degré - 4e',
    gradeLevel: '4e',
    badge: 'Quiz Spécifique 4e',
    questions: [
      {
        id: 'ineq-1',
        question: "Lorsqu'on divise les deux membres d'une inéquation par un nombre négatif, que fait le symbole ?",
        questionLatex: "-3x \\le 12 \\iff x \\, ? \\, \\frac{12}{-3}",
        options: [
          {
            text: "Il change obligatoirement de sens : ≤ devient ≥",
            isCorrect: true,
            feedback: "Exactement ! C'est la règle d'or fondamentale des inéquations."
          },
          {
            text: "Il reste toujours identique",
            isCorrect: false,
            feedback: "Attention au piège le plus meurtrier des devoirs : le sens s'inverse obligatoirement !"
          },
          {
            text: "Il se transforme en signe égal =",
            isCorrect: false,
            feedback: "Faux : une inéquation reste une inéquation."
          }
        ],
        explanation: "Multiplier ou diviser par un nombre négatif inverse l'ordre : -3x ≤ 12 devient x ≥ -4.",
        ruleReminder: "Règle d'or : diviser ou multiplier par un négatif inverse le sens de l'inégalité (< devient >, ≤ devient ≥)."
      },
      {
        id: 'ineq-2',
        question: "Quelles sont les solutions de 2x - 5 > 3 ?",
        questionLatex: "2x - 5 > 3 \\iff 2x > 8",
        options: [
          {
            text: "x > 4",
            latex: "x > 4",
            isCorrect: true,
            feedback: "Bravo ! 2x > 8 donc x > 8/2 = 4."
          },
          {
            text: "x < 4",
            isCorrect: false,
            feedback: "Faux : on a divisé par +2 (positif), le sens ne change pas !"
          },
          {
            text: "x > -1",
            isCorrect: false,
            feedback: "Erreur de calcul : 3 + 5 = 8, pas -2."
          }
        ],
        explanation: "2x > 3 + 5 ⟹ 2x > 8 ⟹ x > 4. L'ensemble des solutions est l'intervalle ]4 ; +∞[.",
        ruleReminder: "Transposer les termes en x à gauche et les constantes à droite avant de diviser."
      }
    ]
  },

  'translation-vecteur': {
    chapterId: 'translation-vecteur',
    chapterTitle: 'Translation et vecteur - 4e',
    gradeLevel: '4e',
    badge: 'Quiz Spécifique 4e',
    questions: [
      {
        id: 'trans-1',
        question: "Que signifie géométriquement l'égalité vectorielle vec(AB) = vec(CD) ?",
        questionLatex: "\\vec{AB} = \\vec{CD}",
        options: [
          {
            text: "ABDC est un parallélogramme (attention à l'ordre des sommets)",
            isCorrect: true,
            feedback: "Parfait ! Les vecteurs ont même direction, même sens et même longueur, formant ABDC."
          },
          {
            text: "ABCD est un triangle",
            isCorrect: false,
            feedback: "Faux : cela définit un quadrilatère non croisé qui est un parallélogramme."
          },
          {
            text: "Les droites (AB) et (CD) sont perpendiculaires",
            isCorrect: false,
            feedback: "Faux : elles sont parallèles (même direction)."
          }
        ],
        explanation: "vec(AB) = vec(CD) équivaut à dire que le quadrilatère ABDC est un parallélogramme.",
        ruleReminder: "Deux vecteurs sont égaux s'ils ont même direction, même sens et même norme."
      },
      {
        id: 'trans-2',
        question: "D'après la relation de Chasles, à quoi est égale la somme vec(AB) + vec(BC) ?",
        questionLatex: "\\vec{AB} + \\vec{BC} = \\, ?",
        options: [
          {
            text: "vec(AC)",
            latex: "\\vec{AC}",
            isCorrect: true,
            feedback: "Bravo ! Le point d'étape B s'efface pour donner le vecteur direct."
          },
          {
            text: "vec(CA)",
            isCorrect: false,
            feedback: "Attention au sens : on part de A et on arrive en C, donc c'est vec(AC)."
          },
          {
            text: "Le vecteur nul",
            isCorrect: false,
            feedback: "Faux : vec(AB) + vec(BA) = vec(0), mais ici c'est vec(BC)."
          }
        ],
        explanation: "Relation de Chasles : pour tous points A, B, C du plan, vec(AB) + vec(BC) = vec(AC).",
        ruleReminder: "Pour additionner deux vecteurs bout à bout, l'extrémité du premier doit être l'origine du second."
      }
    ]
  },

  'application-lineaire': {
    chapterId: 'application-lineaire',
    chapterTitle: 'Application linéaire - 4e',
    gradeLevel: '4e',
    badge: 'Quiz Spécifique 4e',
    questions: [
      {
        id: 'applin-1',
        question: "Quelle est la forme générale d'une application linéaire ?",
        questionLatex: "f(x) = \\, ?",
        options: [
          {
            text: "f(x) = ax (avec a réel)",
            latex: "f(x) = ax",
            isCorrect: true,
            feedback: "Exact ! Une application linéaire traduit une situation de proportionnalité directe."
          },
          {
            text: "f(x) = ax + b avec b ≠ 0",
            isCorrect: false,
            feedback: "Faux : c'est la forme d'une application affine vue en classe de 3e."
          },
          {
            text: "f(x) = ax²",
            isCorrect: false,
            feedback: "Faux : c'est une fonction du second degré."
          }
        ],
        explanation: "Une fonction linéaire s'écrit toujours f(x) = ax. Sa représentation graphique est une droite passant par l'origine.",
        ruleReminder: "Toute application linéaire passe impérativement par l'origine du repère O(0, 0)."
      },
      {
        id: 'applin-2',
        question: "Soit f l'application linéaire définie par f(x) = -3x. Quelle est l'image de 4 par f ?",
        questionLatex: "f(4) = -3 \\times 4",
        options: [
          {
            text: "-12",
            latex: "f(4) = -12",
            isCorrect: true,
            feedback: "Très bien ! f(4) = -3 × 4 = -12."
          },
          {
            text: "12",
            isCorrect: false,
            feedback: "Attention au signe négatif du coefficient !"
          },
          {
            text: "-4/3",
            isCorrect: false,
            feedback: "Faux : vous avez cherché un antécédent au lieu de l'image."
          }
        ],
        explanation: "Pour calculer l'image d'un nombre, on remplace x par ce nombre : f(4) = -3 × 4 = -12.",
        ruleReminder: "Image de x = calcul de f(x). Antécédent de y = résolution de f(x) = y."
      }
    ]
  },

  'nombres-rationnels-operations': {
    chapterId: 'nombres-rationnels-operations',
    chapterTitle: 'Ensemble des nombres rationnels : Présentation et Opérations - 4e',
    gradeLevel: '4e',
    badge: 'Quiz Officiel 4e',
    questions: [
      {
        id: 'rat-1',
        question: "Calculer 2/5 + 3/10 en réduisant au plus petit dénominateur commun.",
        questionLatex: "\\frac{2}{5} + \\frac{3}{10} = \\frac{4}{10} + \\frac{3}{10}",
        options: [
          {
            text: "7/10",
            latex: "\\frac{7}{10}",
            isCorrect: true,
            feedback: "Parfait ! 2/5 = 4/10, puis 4/10 + 3/10 = 7/10."
          },
          {
            text: "5/15 = 1/3",
            isCorrect: false,
            feedback: "GRAVE ERREUR : on n'additionne JAMAIS les dénominateurs entre eux !"
          },
          {
            text: "6/50",
            isCorrect: false,
            feedback: "Faux : vous avez multiplié au lieu d'additionner."
          }
        ],
        explanation: "Pour additionner deux fractions de dénominateurs différents, on cherche le dénominateur commun : 2/5 = 4/10, donc 4/10 + 3/10 = 7/10.",
        ruleReminder: "Ne JAMAIS additionner les dénominateurs entre eux : a/b + c/b = (a+c)/b."
      },
      {
        id: 'rat-2',
        question: "Comment effectue-t-on la division de deux fractions : (a/b) ÷ (c/d) avec c ≠ 0 et d ≠ 0 ?",
        questionLatex: "\\frac{a}{b} \\div \\frac{c}{d} = \\, ?",
        options: [
          {
            text: "On multiplie la première par l'inverse de la seconde : (a/b) × (d/c)",
            latex: "\\frac{a}{b} \\times \\frac{d}{c}",
            isCorrect: true,
            feedback: "Exactement ! Diviser revient à multiplier par l'inverse du diviseur."
          },
          {
            text: "On divise les numérateurs et les dénominateurs directement",
            isCorrect: false,
            feedback: "Faux : cette technique n'est pas la règle mathématique générale."
          },
          {
            text: "On inverse les deux fractions",
            isCorrect: false,
            feedback: "Faux : seule la deuxième fraction (le diviseur) est inversée."
          }
        ],
        explanation: "Diviser par un nombre non nul revient à multiplier par son inverse : (a/b) ÷ (c/d) = (a/b) × (d/c).",
        ruleReminder: "L'inverse de c/d est d/c (avec c et d non nuls)."
      },
      {
        id: 'rat-3',
        question: "D'après la règle du produit en croix, les rationnels 6/8 et 15/20 sont-ils égaux ?",
        questionLatex: "6 \\times 20 = \\, ? \\quad \\text{et} \\quad 8 \\times 15 = \\, ?",
        options: [
          {
            text: "Oui, car 6 × 20 = 120 et 8 × 15 = 120 (produits égaux)",
            latex: "6 \\times 20 = 8 \\times 15 = 120",
            isCorrect: true,
            feedback: "Bravo ! Les deux produits en croix sont égaux à 120, donc les deux rationnels sont égaux."
          },
          {
            text: "Non, car les numérateurs 6 et 15 sont différents",
            isCorrect: false,
            feedback: "Faux : deux fractions peuvent avoir des termes différents et représenter la même valeur (ex: 1/2 = 2/4)."
          },
          {
            text: "Non, car 20 - 8 ≠ 15 - 6",
            isCorrect: false,
            feedback: "Faux : la différence n'intervient pas, seul le produit en croix compte !"
          }
        ],
        explanation: "a/b = c/d si et seulement si a × d = b × c. Ici 6 × 20 = 120 et 8 × 15 = 120, l'égalité est donc vérifiée.",
        ruleReminder: "Produit en croix : a/b = c/d ⟺ ad = bc."
      },
      {
        id: 'rat-4',
        question: "Quelle est la forme irréductible du nombre rationnel -42/70 ?",
        questionLatex: "\\frac{-42}{70} = -\\frac{42 \\div 14}{70 \\div 14}",
        options: [
          {
            text: "-3/5",
            latex: "-\\frac{3}{5}",
            isCorrect: true,
            feedback: "Excellent ! Le PGCD de 42 et 70 est 14. 42 ÷ 14 = 3 et 70 ÷ 14 = 5."
          },
          {
            text: "-21/35",
            isCorrect: false,
            feedback: "Incomplet : 21 et 35 sont encore divisibles par 7 !"
          },
          {
            text: "3/5",
            isCorrect: false,
            feedback: "Attention : il y a un signe moins, le résultat doit rester négatif !"
          }
        ],
        explanation: "En divisant le numérateur et le dénominateur par leur PGCD qui vaut 14, on obtient -3/5, qui est irréductible car 3 et 5 sont premiers entre eux.",
        ruleReminder: "Une fraction est irréductible lorsque PGCD(|numérateur|, |dénominateur|) = 1."
      },
      {
        id: 'rat-5',
        question: "Priorités opératoires : quelle est la valeur exacte de 1/2 + 3/4 × 2/3 ?",
        questionLatex: "\\frac{1}{2} + \\left(\\frac{3}{4} \\times \\frac{2}{3}\\right)",
        options: [
          {
            text: "1",
            latex: "\\frac{1}{2} + \\frac{1}{2} = 1",
            isCorrect: true,
            feedback: "Magnifique ! La multiplication est prioritaire : (3/4) × (2/3) = 6/12 = 1/2. Puis 1/2 + 1/2 = 1."
          },
          {
            text: "5/6",
            isCorrect: false,
            feedback: "Erreur de priorité : vous avez additionné 1/2 + 3/4 avant de multiplier !"
          },
          {
            text: "2/3",
            isCorrect: false,
            feedback: "Erreur de calcul dans la simplification."
          }
        ],
        explanation: "La multiplication s'effectue d'abord : 3/4 × 2/3 = (3×2)/(4×3) = 1/2. Ensuite, 1/2 + 1/2 = 2/2 = 1.",
        ruleReminder: "Toujours respecter la priorité des multiplications et divisions sur les additions et soustractions !"
      }
    ]
  },

  'cosinus': {
    chapterId: 'cosinus',
    chapterTitle: "Cosinus d'un angle aigu - 4e",
    gradeLevel: '4e',
    badge: 'Quiz Spécifique 4e',
    questions: [
      {
        id: 'cos-1',
        question: "Dans un triangle rectangle, quelle est la définition du cosinus d'un angle aigu ?",
        questionLatex: "\\cos(\\widehat{B}) = \\, ?",
        options: [
          {
            text: "Côté adjacent / Hypoténuse",
            latex: "\\frac{\\text{Côté adjacent}}{\\text{Hypoténuse}}",
            isCorrect: true,
            feedback: "Exact ! Mnémo : CAH (Cosinus = Adjacent / Hypoténuse)."
          },
          {
            text: "Côté opposé / Hypoténuse",
            isCorrect: false,
            feedback: "Faux : c'est la formule du sinus (SOH)."
          },
          {
            text: "Côté opposé / Côté adjacent",
            isCorrect: false,
            feedback: "Faux : c'est la tangente (TOA)."
          }
        ],
        explanation: "Le cosinus d'un angle aigu dans un triangle rectangle est le quotient de la longueur du côté adjacent par la longueur de l'hypoténuse.",
        ruleReminder: "Un cosinus est toujours compris strictement entre 0 et 1 pour un angle aigu."
      },
      {
        id: 'cos-2',
        question: "Dans ABC rectangle en A, AB = 4 cm et BC = 5 cm. Que vaut le cosinus de l'angle B ?",
        questionLatex: "\\cos(\\widehat{B}) = \\frac{AB}{BC} = \\frac{4}{5}",
        options: [
          {
            text: "0,8",
            latex: "\\cos(\\widehat{B}) = 0{,}8",
            isCorrect: true,
            feedback: "Parfait ! 4 / 5 = 0,8."
          },
          {
            text: "1,25",
            isCorrect: false,
            feedback: "Impossible : le cosinus ne peut JAMAIS dépasser 1 !"
          },
          {
            text: "0,6",
            isCorrect: false,
            feedback: "Faux : 0,6 correspondrait au sinus de l'angle B (AC/BC)."
          }
        ],
        explanation: "AB est le côté adjacent à l'angle B et BC est l'hypoténuse. Donc cos(B) = AB/BC = 4/5 = 0,8.",
        ruleReminder: "Puisque l'hypoténuse est le côté le plus long, le rapport Adjacent / Hypoténuse est toujours inférieur à 1."
      }
    ]
  },

  'pyramides': {
    chapterId: 'pyramides',
    chapterTitle: 'Les pyramides - 4e',
    gradeLevel: '4e',
    badge: 'Quiz Spécifique 4e',
    questions: [
      {
        id: 'pyr-1',
        question: "Quelle est la formule du volume d'une pyramide de base B et de hauteur h ?",
        questionLatex: "V = \\frac{1}{3} \\times \\mathcal{B} \\times h",
        options: [
          {
            text: "V = (1/3) × Aire de la base × Hauteur",
            latex: "V = \\frac{1}{3} \\times \\mathcal{B} \\times h",
            isCorrect: true,
            feedback: "Bravo ! Le volume est le tiers de celui d'un prisme droit de même base et hauteur."
          },
          {
            text: "V = Aire de la base × Hauteur",
            isCorrect: false,
            feedback: "Faux : c'est la formule d'un prisme droit ou d'un pavé, pas d'une pyramide !"
          },
          {
            text: "V = (1/2) × Aire de la base × Hauteur",
            isCorrect: false,
            feedback: "Faux : le coefficient est 1/3, pas 1/2."
          }
        ],
        explanation: "Le volume d'une pyramide est le tiers du produit de l'aire de sa base par sa hauteur.",
        ruleReminder: "Toujours diviser par 3 pour les solides pointus (pyramides et cônes)."
      },
      {
        id: 'pyr-2',
        question: "Une pyramide régulière a une base carrée de côté c = 6 cm et une hauteur h = 10 cm. Quel est son volume ?",
        questionLatex: "\\mathcal{B} = 6^2 = 36\\text{ cm}^2 \\implies V = \\frac{1}{3} \\times 36 \\times 10",
        options: [
          {
            text: "120 cm³",
            latex: "V = 120\\text{ cm}^3",
            isCorrect: true,
            feedback: "Exact ! B = 6 × 6 = 36 cm², et (1/3) × 36 × 10 = 12 × 10 = 120 cm³."
          },
          {
            text: "360 cm³",
            isCorrect: false,
            feedback: "Oubli de diviser par 3 !"
          },
          {
            text: "60 cm³",
            isCorrect: false,
            feedback: "Erreur de calcul sur l'aire de la base."
          }
        ],
        explanation: "Aire de la base = 6² = 36 cm². Volume = (36 × 10) / 3 = 120 cm³.",
        ruleReminder: "Attention aux unités : le volume s'exprime en cm³ si les longueurs sont en cm."
      }
    ]
  },

  'equations-q': {
    chapterId: 'equations-q',
    chapterTitle: 'Équations à une inconnue dans Q - 4e',
    gradeLevel: '4e',
    badge: 'Quiz Spécifique 4e',
    questions: [
      {
        id: 'eq4-1',
        question: "Résoudre l'équation dans Q : 3x - 7 = 14.",
        questionLatex: "3x = 14 + 7 = 21",
        options: [
          {
            text: "x = 7",
            latex: "x = 7",
            isCorrect: true,
            feedback: "Parfait ! 3x = 21 donc x = 21 / 3 = 7."
          },
          {
            text: "x = 21/4",
            isCorrect: false,
            feedback: "Faux : le coefficient multiplicateur de x est 3."
          },
          {
            text: "x = -7",
            isCorrect: false,
            feedback: "Attention au signe lors de la transposition de -7 qui devient +7."
          }
        ],
        explanation: "3x = 14 + 7 = 21, donc x = 21 / 3 = 7.",
        ruleReminder: "Changer un terme de membre revient à changer son signe."
      },
      {
        id: 'eq4-2',
        question: "Résoudre l'équation : -4x = 12.",
        questionLatex: "x = \\frac{12}{-4}",
        options: [
          {
            text: "x = -3",
            latex: "x = -3",
            isCorrect: true,
            feedback: "Exact ! 12 divisé par -4 donne -3."
          },
          {
            text: "x = 3",
            isCorrect: false,
            feedback: "Attention : le signe du diviseur (-4) est négatif, donc le résultat est négatif."
          },
          {
            text: "x = 16",
            isCorrect: false,
            feedback: "Faux : on divise par -4, on ne soustrait pas."
          }
        ],
        explanation: "ax = b équivaut à x = b/a (pour a non nul). Ici x = 12 / (-4) = -3.",
        ruleReminder: "Lorsqu'on divise par le coefficient 'a', son signe ne change pas !"
      }
    ]
  },

  'nombres-rationnels-puissances': {
    chapterId: 'nombres-rationnels-puissances',
    chapterTitle: 'Nombres rationnels & Puissances - 4e',
    gradeLevel: '4e',
    badge: 'Quiz Spécifique 4e',
    questions: [
      {
        id: 'pow-1',
        question: "Quelle est la règle pour le produit de deux puissances d'un même nombre : a³ × a⁵ ?",
        questionLatex: "a^m \\times a^n = \\, ?",
        options: [
          {
            text: "On additionne les exposants : a⁸",
            latex: "a^{3+5} = a^8",
            isCorrect: true,
            feedback: "Parfait ! a^m × a^n = a^(m+n)."
          },
          {
            text: "On multiplie les exposants : a¹⁵",
            isCorrect: false,
            feedback: "Faux : on multiplie les exposants pour (a³)^5, pas pour le produit simple !"
          },
          {
            text: "2a⁸",
            isCorrect: false,
            feedback: "Faux : le facteur de base reste a."
          }
        ],
        explanation: "Pour multiplier deux puissances d'une même base, on conserve la base et on additionne les exposants.",
        ruleReminder: "a^m × a^n = a^(m+n) et (a^m)^n = a^(m×n)."
      },
      {
        id: 'pow-2',
        question: "Que vaut 2^(-3) sous forme de fraction ?",
        questionLatex: "2^{-3} = \\frac{1}{2^3}",
        options: [
          {
            text: "1/8",
            latex: "\\frac{1}{8}",
            isCorrect: true,
            feedback: "Bravo ! 2^(-3) = 1 / 2³ = 1 / 8."
          },
          {
            text: "-8",
            isCorrect: false,
            feedback: "Attention : un exposant négatif n'indique pas un nombre négatif, mais un inverse !"
          },
          {
            text: "-6",
            isCorrect: false,
            feedback: "GRAVE ERREUR : 2³ = 2 × 2 × 2 = 8, pas 2 × 3 = 6 !"
          }
        ],
        explanation: "a^(-n) = 1 / a^n. Donc 2^(-3) = 1 / 2³ = 1 / 8 = 0,125.",
        ruleReminder: "Un exposant négatif signifie que l'on prend l'inverse de la puissance positive."
      }
    ]
  },

  'statistique': {
    chapterId: 'statistique',
    chapterTitle: 'Statistique - 4e',
    gradeLevel: '4e',
    badge: 'Quiz Spécifique 4e',
    questions: [
      {
        id: 'stat-1',
        question: "Dans une classe de 40 élèves, 12 ont obtenu la moyenne en mathématiques. Quelle est la fréquence en pourcentage ?",
        questionLatex: "f = \\frac{12}{40} \\times 100\\%",
        options: [
          {
            text: "30 %",
            latex: "30\\%",
            isCorrect: true,
            feedback: "Bravo ! 12 / 40 = 0,3 = 30 %."
          },
          {
            text: "12 %",
            isCorrect: false,
            feedback: "Faux : 12 est l'effectif brut, pas la fréquence relative."
          },
          {
            text: "48 %",
            isCorrect: false,
            feedback: "Erreur de calcul."
          }
        ],
        explanation: "Fréquence = Effectif / Effectif total = 12 / 40 = 0,30 = 30 %.",
        ruleReminder: "La somme des fréquences d'une série statistique complète est toujours égale à 1 (ou 100 %)."
      },
      {
        id: 'stat-2',
        question: "Sur un diagramme circulaire complet, quel angle correspond à une fréquence de 25 % ?",
        questionLatex: "\\alpha = 360^\\circ \\times 0{,}25",
        options: [
          {
            text: "90° (un angle droit)",
            latex: "90^\\circ",
            isCorrect: true,
            feedback: "Exact ! Le quart d'un tour complet (360°) vaut 90°."
          },
          {
            text: "25°",
            isCorrect: false,
            feedback: "Attention : l'angle n'est pas égal au pourcentage, il faut multiplier par 3,6 !"
          },
          {
            text: "180°",
            isCorrect: false,
            feedback: "Faux : 180° correspond à 50 % (la moitié)."
          }
        ],
        explanation: "Un cercle mesure 360°. Pour 25 %, Angle = 360° × (25 / 100) = 90°.",
        ruleReminder: "Dans un diagramme circulaire, les mesures des angles sont proportionnelles aux effectifs."
      }
    ]
  },

  'revision': {
    chapterId: 'revision',
    chapterTitle: 'Révision Générale - 4e',
    gradeLevel: '4e',
    badge: 'Quiz Bilan 4e',
    questions: [
      {
        id: 'rev4-1',
        question: "Parmi ces trois expressions, laquelle est égale à (x - 3)² ?",
        questionLatex: "(x - 3)^2 = \\, ?",
        options: [
          {
            text: "x² - 6x + 9",
            latex: "x^2 - 6x + 9",
            isCorrect: true,
            feedback: "Parfait ! Identité (a - b)² = a² - 2ab + b²."
          },
          {
            text: "x² - 9",
            isCorrect: false,
            feedback: "Faux : il manque le double produit -6x !"
          },
          {
            text: "x² + 6x + 9",
            isCorrect: false,
            feedback: "Attention au signe du terme central : c'est un moins."
          }
        ],
        explanation: "(x - 3)² = x² - 2(x)(3) + 3² = x² - 6x + 9.",
        ruleReminder: "(a - b)² = a² - 2ab + b²."
      },
      {
        id: 'rev4-2',
        question: "Dans un triangle rectangle d'hypoténuse 10 cm et de côté 6 cm, quelle est la longueur du 3e côté ?",
        questionLatex: "c^2 = 10^2 - 6^2 = 100 - 36 = 64",
        options: [
          {
            text: "8 cm",
            latex: "8\\text{ cm}",
            isCorrect: true,
            feedback: "Exact ! √64 = 8 cm."
          },
          {
            text: "4 cm",
            isCorrect: false,
            feedback: "Faux : on soustrait les carrés, pas 10 - 6 !"
          },
          {
            text: "16 cm",
            isCorrect: false,
            feedback: "Impossible : le côté ne peut pas dépasser l'hypoténuse (10 cm)."
          }
        ],
        explanation: "10² - 6² = 100 - 36 = 64, et √64 = 8 cm.",
        ruleReminder: "Application directe du théorème de Pythagore."
      }
    ]
  },

  // =========================================================================
  // CLASSE DE 3ÈME (BFEM)
  // =========================================================================

  'racine-carree-3e': {
    chapterId: 'racine-carree-3e',
    chapterTitle: 'Racine carrée - 3e (BFEM)',
    gradeLevel: '3e',
    badge: 'Quiz Spécifique 3e BFEM',
    questions: [
      {
        id: 'rc-q1',
        question: "Sous quelle forme simplifiée peut-on écrire √72 ?",
        questionLatex: "\\sqrt{72} = \\sqrt{36 \\times 2}",
        options: [
          {
            text: "6√2",
            latex: "6\\sqrt{2}",
            isCorrect: true,
            feedback: "Excellent ! 72 = 36 × 2, et √36 = 6."
          },
          {
            text: "3√8",
            isCorrect: false,
            feedback: "Incomplet : √8 peut encore se simplifier en 2√2, ce qui donnerait 6√2."
          },
          {
            text: "2√6",
            isCorrect: false,
            feedback: "Faux : (2√6)² = 4 × 6 = 24 ≠ 72."
          }
        ],
        explanation: "Pour simplifier une racine, on extrait le plus grand carré parfait : 72 = 36 × 2, d'où √72 = 6√2.",
        ruleReminder: "√(a × b) = √a × √b pour tous réels positifs a et b."
      },
      {
        id: 'rc-q2',
        question: "Que donne l'expression (3√5)² ?",
        questionLatex: "(3\\sqrt{5})^2 = 3^2 \\times (\\sqrt{5})^2",
        options: [
          {
            text: "45",
            latex: "9 \\times 5 = 45",
            isCorrect: true,
            feedback: "Bravo ! 3² = 9 et (√5)² = 5, donc 9 × 5 = 45."
          },
          {
            text: "15",
            isCorrect: false,
            feedback: "Faux : vous avez oublié de mettre le 3 au carré (3 × 5 au lieu de 9 × 5)."
          },
          {
            text: "75",
            isCorrect: false,
            feedback: "Erreur de calcul."
          }
        ],
        explanation: "(a√b)² = a² × b. Ici 3² × 5 = 9 × 5 = 45.",
        ruleReminder: "Ne jamais oublier d'élever le coefficient entier au carré."
      },
      {
        id: 'rc-q3',
        question: "Pour rendre rationnel le dénominateur de 6 / (√5 - 1), par quelle quantité conjuguée multiplie-t-on ?",
        questionLatex: "\\frac{6}{\\sqrt{5} - 1} \\times \\frac{\\sqrt{5} + 1}{\\sqrt{5} + 1}",
        options: [
          {
            text: "Par (√5 + 1)",
            latex: "(\\sqrt{5} + 1)",
            isCorrect: true,
            feedback: "Exact ! L'expression conjuguée de (√5 - 1) est (√5 + 1)."
          },
          {
            text: "Par (√5 - 1)",
            isCorrect: false,
            feedback: "Faux : cela donnerait (√5 - 1)² = 6 - 2√5, la racine subsisterait."
          },
          {
            text: "Par √5 seulement",
            isCorrect: false,
            feedback: "Faux : multiplier par √5 seul ne supprime pas la racine au dénominateur."
          }
        ],
        explanation: "Pour éliminer la racine d'un binôme (a - b), on multiplie par le conjugué (a + b) afin d'appliquer l'identité a² - b².",
        ruleReminder: "(√a - b)(√a + b) = a - b², ce qui donne un dénominateur entier sans radical."
      }
    ]
  },

  'calcul-algebrique-3e': {
    chapterId: 'calcul-algebrique-3e',
    chapterTitle: 'Calcul algébrique - 3e (BFEM)',
    gradeLevel: '3e',
    badge: 'Quiz Spécifique 3e BFEM',
    questions: [
      {
        id: 'ca3-1',
        question: "Développer et réduire : (3x - 2)².",
        questionLatex: "(3x - 2)^2 = (3x)^2 - 2(3x)(2) + 2^2",
        options: [
          {
            text: "9x² - 12x + 4",
            latex: "9x^2 - 12x + 4",
            isCorrect: true,
            feedback: "Parfait ! (3x)² = 9x² et le double produit est 2 × 3x × 2 = 12x."
          },
          {
            text: "9x² - 4",
            isCorrect: false,
            feedback: "Attention : il manque le double produit -12x !"
          },
          {
            text: "3x² - 12x + 4",
            isCorrect: false,
            feedback: "Faux : le carré de 3x est 9x², pas 3x²."
          }
        ],
        explanation: "(a - b)² = a² - 2ab + b² avec a = 3x et b = 2, d'où 9x² - 12x + 4.",
        ruleReminder: "Au BFEM, l'oubli du carré sur le coefficient entier ou du double produit est sanctionné."
      },
      {
        id: 'ca3-2',
        question: "Factoriser l'expression E = (2x - 1)² - 9.",
        questionLatex: "E = (2x - 1)^2 - 3^2",
        options: [
          {
            text: "(2x - 4)(2x + 2)",
            latex: "(2x - 4)(2x + 2)",
            isCorrect: true,
            feedback: "Bravo ! On reconnaît a² - b² avec a = 2x-1 et b = 3. (2x-1-3)(2x-1+3)."
          },
          {
            text: "(2x - 10)(2x + 8)",
            isCorrect: false,
            feedback: "Faux : 9 est le carré de 3, pas de 9."
          },
          {
            text: "(2x - 1 - 9)(2x - 1 + 9)",
            isCorrect: false,
            feedback: "Erreur : b = 3 car 3² = 9."
          }
        ],
        explanation: "a² - b² = (a - b)(a + b) avec a = (2x - 1) et b = 3. E = (2x - 1 - 3)(2x - 1 + 3) = (2x - 4)(2x + 2).",
        ruleReminder: "Toujours identifier la racine carrée du terme constant pour appliquer a² - b²."
      },
      {
        id: 'ca3-3',
        question: "Développement d'un produit remarquable : développer (3x - 5)(3x + 5).",
        questionLatex: "(3x - 5)(3x + 5) = (3x)^2 - 5^2",
        options: [
          {
            text: "9x² - 25",
            latex: "9x^2 - 25",
            isCorrect: true,
            feedback: "Parfait ! On applique directement (a - b)(a + b) = a² - b² avec a = 3x et b = 5."
          },
          {
            text: "9x² - 30x - 25",
            isCorrect: false,
            feedback: "Attention : dans (a - b)(a + b), les termes du milieu +15x et -15x s'annulent !"
          },
          {
            text: "3x² - 25",
            isCorrect: false,
            feedback: "Faux : le carré de 3x est (3x)² = 9x²."
          }
        ],
        explanation: "(3x - 5)(3x + 5) = (3x)² - 5² = 9x² - 25.",
        ruleReminder: "(a - b)(a + b) = a² - b² : identité remarquable fondamentale au BFEM."
      },
      {
        id: 'ca3-4',
        question: "Factorisation avec facteur commun complexe : factoriser F = (3x - 2)(x + 4) - (3x - 2)(2x - 1).",
        questionLatex: "F = (3x - 2) [ (x + 4) - (2x - 1) ]",
        options: [
          {
            text: "(3x - 2)(-x + 5)",
            latex: "(3x - 2)(-x + 5)",
            isCorrect: true,
            feedback: "Excellent ! Attention au signe moins devant (2x - 1) : -(2x - 1) = -2x + 1, d'où x + 4 - 2x + 1 = -x + 5 !"
          },
          {
            text: "(3x - 2)(-x + 3)",
            isCorrect: false,
            feedback: "Piège sur le signe : -(2x - 1) = -2x + 1, donc 4 + 1 = 5, pas 3 !"
          },
          {
            text: "(3x - 2)(3x + 3)",
            isCorrect: false,
            feedback: "Faux : il y a un signe soustraction entre les deux blocs."
          }
        ],
        explanation: "F = (3x - 2)[(x + 4) - (2x - 1)] = (3x - 2)[x + 4 - 2x + 1] = (3x - 2)(-x + 5).",
        ruleReminder: "Quand on factorise avec un signe moins devant le 2nd bloc, inverser les signes à l'intérieur de la 2nde parenthèse."
      }
    ]
  },

  'equations-inequations-3e': {
    chapterId: 'equations-inequations-3e',
    chapterTitle: 'Équations et Inéquations à une inconnue - 3e (BFEM)',
    gradeLevel: '3e',
    badge: 'Quiz Spécifique 3e BFEM',
    questions: [
      {
        id: 'eq3-q1',
        question: "Quelles sont les solutions de l'équation produit nul : (2x - 7)(3x + 9) = 0 ?",
        questionLatex: "2x - 7 = 0 \\quad \\text{ou} \\quad 3x + 9 = 0",
        options: [
          {
            text: "x = 7/2 ou x = -3",
            latex: "x = \\frac{7}{2} \\quad \\text{ou} \\quad x = -3",
            isCorrect: true,
            feedback: "Parfait ! 2x = 7 ⟹ x = 7/2 et 3x = -9 ⟹ x = -3."
          },
          {
            text: "x = -7/2 ou x = 3",
            isCorrect: false,
            feedback: "Attention aux signes lors du passage dans l'autre membre."
          },
          {
            text: "x = 0",
            isCorrect: false,
            feedback: "Faux : x = 0 ne vérifie pas l'équation (-7 × 9 = -63 ≠ 0)."
          }
        ],
        explanation: "Un produit est nul si et seulement si l'un au moins de ses facteurs est nul.",
        ruleReminder: "A × B = 0 ⟺ A = 0 ou B = 0."
      },
      {
        id: 'eq3-q2',
        question: "Pour résoudre une inéquation du type (x - 2)(3 - x) ≥ 0, quel outil est obligatoire au BFEM ?",
        options: [
          {
            text: "Un tableau de signes",
            isCorrect: true,
            feedback: "Exact ! Le tableau de signes est la méthode rigoureuse exigée au BFEM."
          },
          {
            text: "Une simple calculatrice graphique",
            isCorrect: false,
            feedback: "Faux : la justification par tableau de signes est indispensable pour avoir les points."
          },
          {
            text: "Une division membre à membre",
            isCorrect: false,
            feedback: "Interdit : on ne connaît pas le signe de x - 2."
          }
        ],
        explanation: "Le signe d'un produit se détermine à l'aide d'un tableau de signes en étudiant le signe de chaque facteur.",
        ruleReminder: "Étudier l'annulation de chaque facteur, placer les zéros dans l'ordre croissant, puis remplir les lignes de signes."
      }
    ]
  },

  'statistique-3e': {
    chapterId: 'statistique-3e',
    chapterTitle: 'Statistique - 3e (BFEM)',
    gradeLevel: '3e',
    badge: 'Quiz Spécifique 3e BFEM',
    questions: [
      {
        id: 'stat3-1',
        question: "Comment calcule-t-on le centre de la classe d'intervalle [10 ; 14[ ?",
        questionLatex: "c = \\frac{10 + 14}{2}",
        options: [
          {
            text: "12",
            latex: "c = \\frac{10 + 14}{2} = 12",
            isCorrect: true,
            feedback: "Exactement ! C'est la demi-somme des bornes de la classe."
          },
          {
            text: "14 - 10 = 4",
            isCorrect: false,
            feedback: "Faux : 4 est l'amplitude de la classe, pas son centre."
          },
          {
            text: "10",
            isCorrect: false,
            feedback: "Faux : 10 est la borne inférieure."
          }
        ],
        explanation: "Le centre d'une classe [a ; b[ est donné par (a + b) / 2 = (10 + 14) / 2 = 12.",
        ruleReminder: "Pour calculer la moyenne d'une série continue, on utilise le centre de chaque classe."
      },
      {
        id: 'stat3-2',
        question: "Qu'appelle-t-on la médiane d'une série statistique ordonnée ?",
        options: [
          {
            text: "La valeur qui partage la population en deux groupes d'effectifs égaux (50 % au moins)",
            isCorrect: true,
            feedback: "Parfait ! Au moins 50 % des valeurs lui sont inférieures ou égales."
          },
          {
            text: "La valeur qui a le plus grand effectif",
            isCorrect: false,
            feedback: "Faux : c'est la définition du mode (ou classe modale)."
          },
          {
            text: "La moyenne arithmétique simple",
            isCorrect: false,
            feedback: "Faux : la médiane ne dépend pas des valeurs extrêmes, contrairement à la moyenne."
          }
        ],
        explanation: "La médiane partage la série en deux moitiés égales. Si N est pair, c'est la demi-somme des valeurs de rang N/2 et N/2 + 1.",
        ruleReminder: "Toujours ordonner les valeurs dans l'ordre croissant avant de chercher la médiane."
      }
    ]
  },

  'application-affine-3e': {
    chapterId: 'application-affine-3e',
    chapterTitle: 'Application affine - 3e (BFEM)',
    gradeLevel: '3e',
    badge: 'Quiz Spécifique 3e BFEM',
    questions: [
      {
        id: 'aff3-1',
        question: "Soit l'application affine f(x) = -2x + 5. Que représente le nombre 5 géométriquement ?",
        questionLatex: "f(0) = 5",
        options: [
          {
            text: "L'ordonnée à l'origine (point où la droite coupe l'axe vertical des y)",
            isCorrect: true,
            feedback: "Exact ! Pour x = 0, f(0) = 5, donc la droite passe par (0, 5)."
          },
          {
            text: "Le coefficient directeur (la pente)",
            isCorrect: false,
            feedback: "Faux : le coefficient directeur est -2."
          },
          {
            text: "L'abscisse du point d'intersection avec l'axe horizontal",
            isCorrect: false,
            feedback: "Faux : l'abscisse où f(x)=0 est x = 5/2 = 2,5."
          }
        ],
        explanation: "Dans f(x) = ax + b, a est le coefficient directeur et b est l'ordonnée à l'origine.",
        ruleReminder: "La droite représentative de f(x) = ax + b coupe l'axe des ordonnées au point de coordonnées (0, b)."
      },
      {
        id: 'aff3-2',
        question: "Comment calcule-t-on le coefficient directeur 'a' d'une droite passant par A(1, 3) et B(4, 9) ?",
        questionLatex: "a = \\frac{y_B - y_A}{x_B - x_A}",
        options: [
          {
            text: "a = (9 - 3) / (4 - 1) = 6 / 3 = 2",
            latex: "a = \\frac{9 - 3}{4 - 1} = 2",
            isCorrect: true,
            feedback: "Bravo ! C'est le taux d'accroissement (différence des ordonnées sur différence des abscisses)."
          },
          {
            text: "a = (4 - 1) / (9 - 3) = 1/2",
            isCorrect: false,
            feedback: "Attention : les ordonnées (y) doivent toujours être au NUMÉRATEUR !"
          },
          {
            text: "a = 9 - 4 = 5",
            isCorrect: false,
            feedback: "Faux : formule complètement incorrecte."
          }
        ],
        explanation: "a = (y_B - y_A) / (x_B - x_A) = (9 - 3) / (4 - 1) = 6 / 3 = 2.",
        ruleReminder: "Formule clé BFEM : a = (f(x2) - f(x1)) / (x2 - x1)."
      }
    ]
  },

  'systemes-2-inconnues-3e': {
    chapterId: 'systemes-2-inconnues-3e',
    chapterTitle: 'Systèmes à deux inconnues - 3e (BFEM)',
    gradeLevel: '3e',
    badge: 'Quiz Spécifique 3e BFEM',
    questions: [
      {
        id: 'sys3-1',
        question: "Le couple (x = 2, y = 3) est-il solution du système { x + y = 5 ; 2x - y = 1 } ?",
        questionLatex: "\\begin{cases} x + y = 5 \\\\ 2x - y = 1 \\end{cases}",
        options: [
          {
            text: "Oui, car il vérifie les deux équations simultanément",
            isCorrect: true,
            feedback: "Bravo ! 2 + 3 = 5 et 2(2) - 3 = 4 - 3 = 1. Les 2 équations sont vérifiées !"
          },
          {
            text: "Non, car il ne vérifie que la première",
            isCorrect: false,
            feedback: "Faux : 2(2) - 3 = 1, la deuxième est également vérifiée."
          },
          {
            text: "Un système à 2 inconnues n'admet jamais de solution entière",
            isCorrect: false,
            feedback: "Faux : de très nombreux systèmes ont des solutions entières."
          }
        ],
        explanation: "Un couple (x, y) est solution s'il vérifie TOUTES les équations du système à la fois.",
        ruleReminder: "Toujours vérifier le couple trouvé dans chacune des deux équations d'origine."
      },
      {
        id: 'sys3-2',
        question: "Dans la méthode par combinaison linéaire, que cherche-t-on à faire ?",
        options: [
          {
            text: "Multiplier les équations par des réels pour éliminer l'une des deux inconnues par addition",
            isCorrect: true,
            feedback: "Exact ! On rend les coefficients d'une variable opposés pour qu'elle s'annule."
          },
          {
            text: "Isoler x au hasard dans la première équation",
            isCorrect: false,
            feedback: "Faux : cela correspond à la méthode par substitution."
          },
          {
            text: "Additionner les équations sans modifier les coefficients",
            isCorrect: false,
            feedback: "Faux : si les coefficients ne sont pas opposés, aucune variable n'est éliminée."
          }
        ],
        explanation: "La méthode par combinaison linéaire consiste à multiplier une ou deux équations pour obtenir des coefficients opposés sur une inconnue, puis à additionner membre à membre.",
        ruleReminder: "Méthodes au choix : substitution (quand un coef vaut 1 ou -1) ou combinaison linéaire."
      }
    ]
  },

  'vecteurs-3e': {
    chapterId: 'vecteurs-3e',
    chapterTitle: 'Vecteurs - 3e (BFEM)',
    gradeLevel: '3e',
    badge: 'Quiz Spécifique 3e BFEM',
    questions: [
      {
        id: 'vec3-1',
        question: "Que peut-on conclure si vec(AB) = 3 vec(CD) ?",
        questionLatex: "\\vec{AB} = 3\\vec{CD}",
        options: [
          {
            text: "Les vecteurs sont colinéaires et les droites (AB) et (CD) sont parallèles",
            isCorrect: true,
            feedback: "Exact ! vec(u) = k vec(v) traduit la colinéarité et le parallélisme."
          },
          {
            text: "Les segments [AB] et [CD] sont de même longueur",
            isCorrect: false,
            feedback: "Faux : la longueur de AB est 3 fois plus grande que celle de CD."
          },
          {
            text: "Les points A, B, C, D sont forcément alignés",
            isCorrect: false,
            feedback: "Faux : les droites peuvent être parallèles distinctes."
          }
        ],
        explanation: "Deux vecteurs sont colinéaires s'il existe un réel k tel que vec(u) = k vec(v). Géométriquement, cela implique que les droites supports sont parallèles.",
        ruleReminder: "Colinéarité : vec(AB) = k vec(CD) ⟺ (AB) // (CD)."
      },
      {
        id: 'vec3-2',
        question: "Si I est le milieu du segment [AB], quelle égalité vectorielle est vraie ?",
        questionLatex: "\\vec{IA} + \\vec{IB} = \\, ?",
        options: [
          {
            text: "vec(IA) + vec(IB) = vec(0) (vecteur nul)",
            latex: "\\vec{IA} + \\vec{IB} = \\vec{0}",
            isCorrect: true,
            feedback: "Parfait ! Les vecteurs vec(IA) et vec(IB) sont opposés."
          },
          {
            text: "vec(IA) = vec(IB)",
            isCorrect: false,
            feedback: "Faux : ils ont des sens contraires ! vec(IA) = -vec(IB)."
          },
          {
            text: "vec(AB) = vec(0)",
            isCorrect: false,
            feedback: "Faux : A et B sont distincts."
          }
        ],
        explanation: "I est le milieu de [AB] si et seulement si vec(AI) = vec(IB) ou vec(IA) + vec(IB) = vec(0).",
        ruleReminder: "Caractérisation vectorielle du milieu : vec(IA) + vec(IB) = vec(0)."
      }
    ]
  },

  'reperage-plan-3e': {
    chapterId: 'reperage-plan-3e',
    chapterTitle: 'Repérage dans le plan - 3e (BFEM)',
    gradeLevel: '3e',
    badge: 'Quiz Spécifique 3e BFEM',
    questions: [
      {
        id: 'rep3-1',
        question: "Quelles sont les coordonnées du vecteur vec(AB) sachant que A(2, -1) et B(5, 3) ?",
        questionLatex: "\\vec{AB}(x_B - x_A, \\; y_B - y_A)",
        options: [
          {
            text: "vec(AB) = (3 ; 4)",
            latex: "\\vec{AB}(3, 4)",
            isCorrect: true,
            feedback: "Bravo ! x = 5 - 2 = 3 et y = 3 - (-1) = 3 + 1 = 4."
          },
          {
            text: "vec(AB) = (7 ; 2)",
            isCorrect: false,
            feedback: "Faux : vous avez additionné au lieu de soustraire."
          },
          {
            text: "vec(AB) = (-3 ; -4)",
            isCorrect: false,
            feedback: "Attention à l'ordre : c'est toujours Fin - Début (B - A) !"
          }
        ],
        explanation: "Coordonnées de vec(AB) : (x_B - x_A ; y_B - y_A) = (5 - 2 ; 3 - (-1)) = (3 ; 4).",
        ruleReminder: "Règle mnémotechnique : Vecteur = Arrivée moins Départ."
      },
      {
        id: 'rep3-2',
        question: "Dans un repère orthonormé, comment calcule-t-on la distance AB si vec(AB) a pour coordonnées (3 ; 4) ?",
        questionLatex: "AB = \\sqrt{3^2 + 4^2}",
        options: [
          {
            text: "AB = 5",
            latex: "AB = \\sqrt{9 + 16} = \\sqrt{25} = 5",
            isCorrect: true,
            feedback: "Parfait ! √(3² + 4²) = √25 = 5."
          },
          {
            text: "AB = 7",
            isCorrect: false,
            feedback: "Faux : on n'additionne pas 3 + 4, on prend la racine de la somme des carrés."
          },
          {
            text: "AB = 25",
            isCorrect: false,
            feedback: "Oubli de la racine carrée !"
          }
        ],
        explanation: "Distance dans un repère orthonormé : AB = √(X² + Y²) = √(3² + 4²) = √25 = 5.",
        ruleReminder: "La formule de distance dans un repère découle directement du théorème de Pythagore."
      }
    ]
  },

  'trigonometrie-3e': {
    chapterId: 'trigonometrie-3e',
    chapterTitle: 'Trigonométrie dans le triangle rectangle - 3e (BFEM)',
    gradeLevel: '3e',
    badge: 'Quiz Spécifique 3e BFEM',
    questions: [
      {
        id: 'trig3-1',
        question: "Quelle est la relation fondamentale reliant le cosinus et le sinus d'un même angle aigu α ?",
        questionLatex: "\\cos^2(\\alpha) + \\sin^2(\\alpha) = \\, ?",
        options: [
          {
            text: "cos²(α) + sin²(α) = 1",
            latex: "\\cos^2(\\alpha) + \\sin^2(\\alpha) = 1",
            isCorrect: true,
            feedback: "Exact ! C'est la relation fondamentale de la trigonométrie."
          },
          {
            text: "cos²(α) + sin²(α) = 0",
            isCorrect: false,
            feedback: "Impossible : des carrés de nombres réels non nuls ne peuvent donner 0."
          },
          {
            text: "cos(α) + sin(α) = 1",
            isCorrect: false,
            feedback: "Attention : la relation n'est vraie que pour les CARRÉS !"
          }
        ],
        explanation: "D'après le théorème de Pythagore appliqué au cercle trigonométrique, cos²(α) + sin²(α) = 1 pour tout angle α.",
        ruleReminder: "cos²(α) + sin²(α) = 1 et tan(α) = sin(α) / cos(α)."
      },
      {
        id: 'trig3-2',
        question: "Si cos(α) = 0,6 pour un angle aigu, que vaut sin(α) ?",
        questionLatex: "\\sin^2(\\alpha) = 1 - 0{,}6^2 = 1 - 0{,}36 = 0{,}64",
        options: [
          {
            text: "0,8",
            latex: "\\sin(\\alpha) = \\sqrt{0{,}64} = 0{,}8",
            isCorrect: true,
            feedback: "Bravo ! sin²(α) = 1 - 0,36 = 0,64, et √0,64 = 0,8."
          },
          {
            text: "0,4",
            isCorrect: false,
            feedback: "Faux : 1 - 0,6 = 0,4 est une erreur d'oubli des carrés."
          },
          {
            text: "0,64",
            isCorrect: false,
            feedback: "Oubli de prendre la racine carrée !"
          }
        ],
        explanation: "sin²(α) = 1 - cos²(α) = 1 - 0,36 = 0,64 ⟹ sin(α) = 0,8.",
        ruleReminder: "Pour trouver le sinus à partir du cosinus : sin(α) = √(1 - cos²(α))."
      }
    ]
  },

  'thales-3e': {
    chapterId: 'thales-3e',
    chapterTitle: 'Théorème de Thalès - 3e (BFEM)',
    gradeLevel: '3e',
    badge: 'Quiz Spécifique 3e BFEM',
    questions: [
      {
        id: 'th3-1',
        question: "Dans une configuration de Thalès avec (BC) // (MN), si AM = 3, AB = 9 et AN = 4, que vaut AC ?",
        questionLatex: "\\frac{AM}{AB} = \\frac{AN}{AC} \\implies \\frac{3}{9} = \\frac{4}{AC}",
        options: [
          {
            text: "12",
            latex: "AC = \\frac{9 \\times 4}{3} = 12",
            isCorrect: true,
            feedback: "Bravo ! Le produit en croix donne AC = (9 × 4) / 3 = 12."
          },
          {
            text: "10",
            isCorrect: false,
            feedback: "Faux : calcul inexact."
          },
          {
            text: "7",
            isCorrect: false,
            feedback: "Faux : vous avez additionné 3 + 4 au lieu d'appliquer les proportions."
          }
        ],
        explanation: "Rapports de Thalès : AM/AB = AN/AC ⟹ 3/9 = 4/AC ⟹ AC = 36 / 3 = 12.",
        ruleReminder: "Toujours poser l'égalité des trois rapports de longueurs correspondantes."
      },
      {
        id: 'th3-2',
        question: "Pour démontrer que deux droites sont parallèles avec la réciproque de Thalès, quelle condition en plus de l'égalité des rapports est indispensable ?",
        options: [
          {
            text: "Les points doivent être alignés dans le même ordre sur les deux sécantes",
            isCorrect: true,
            feedback: "Exact ! Oublier de citer l'ordre des points au BFEM fait perdre la moitié des points."
          },
          {
            text: "Le triangle doit être rectangle",
            isCorrect: false,
            feedback: "Faux : Thalès s'applique à TOUS les triangles, rectangles ou quelconques."
          },
          {
            text: "Les rapports doivent être égaux à 1",
            isCorrect: false,
            feedback: "Faux : si le rapport vaut 1, les points sont confondus."
          }
        ],
        explanation: "La réciproque de Thalès exige DEUX conditions : l'égalité de deux rapports ET l'alignement des points dans le même ordre.",
        ruleReminder: "Au BFEM : 'Comme AM/AB = AN/AC et que les points A, M, B d'une part et A, N, C d'autre part sont alignés dans le même ordre, alors (MN) // (BC)'."
      }
    ]
  },

  'angle-inscrit-3e': {
    chapterId: 'angle-inscrit-3e',
    chapterTitle: 'Angle inscrit et Angle au centre - 3e (BFEM)',
    gradeLevel: '3e',
    badge: 'Quiz Spécifique 3e BFEM',
    questions: [
      {
        id: 'ang3-1',
        question: "Dans un cercle, si un angle au centre mesure 80°, combien mesure un angle inscrit qui intercepte le même arc ?",
        questionLatex: "\\widehat{AMB} = \\frac{1}{2} \\widehat{AOB}",
        options: [
          {
            text: "40° (la moitié)",
            latex: "\\frac{80^\\circ}{2} = 40^\\circ",
            isCorrect: true,
            feedback: "Parfait ! L'angle inscrit mesure la moitié de l'angle au centre associé."
          },
          {
            text: "80° (la même mesure)",
            isCorrect: false,
            feedback: "Faux : deux angles inscrits interceptant le même arc sont égaux, mais pas avec l'angle au centre !"
          },
          {
            text: "160° (le double)",
            isCorrect: false,
            feedback: "Inversion : c'est l'angle au centre qui est le double de l'angle inscrit !"
          }
        ],
        explanation: "Théorème : la mesure d'un angle inscrit est égale à la moitié de la mesure de l'angle au centre qui intercepte le même arc.",
        ruleReminder: "Angle inscrit = (1/2) × Angle au centre associé."
      },
      {
        id: 'ang3-2',
        question: "Deux angles inscrits dans un même cercle interceptent le même arc de cercle. Que peut-on dire de leurs mesures ?",
        options: [
          {
            text: "Ils ont exactement la même mesure",
            isCorrect: true,
            feedback: "Bravo ! Propriété fondamentale des angles inscrits interceptant un même arc."
          },
          {
            text: "Leur somme vaut 180°",
            isCorrect: false,
            feedback: "Faux : cela concernerait des angles supplémentaires."
          },
          {
            text: "L'un est le double de l'autre",
            isCorrect: false,
            feedback: "Faux : ils sont strictement égaux."
          }
        ],
        explanation: "Deux angles inscrits qui interceptent le même arc de cercle ont la même mesure.",
        ruleReminder: "Si AMB et ANB interceptent le même arc AB, alors angle(AMB) = angle(ANB)."
      }
    ]
  },

  'geometrie-espace-3e': {
    chapterId: 'geometrie-espace-3e',
    chapterTitle: 'Géométrie dans l\'espace & Cône de révolution - 3e (BFEM)',
    gradeLevel: '3e',
    badge: 'Quiz Spécifique 3e BFEM',
    questions: [
      {
        id: 'esp3-1',
        question: "Dans un agrandissement ou une réduction de rapport k (k > 0), par quel coefficient sont multipliés les volumes ?",
        questionLatex: "V' = k^3 \\times V",
        options: [
          {
            text: "Par k³",
            latex: "k^3",
            isCorrect: true,
            feedback: "Exact ! Les longueurs sont multipliées par k, les aires par k² et les volumes par k³."
          },
          {
            text: "Par k",
            isCorrect: false,
            feedback: "Faux : k est le coefficient multiplicateur des longueurs (1D)."
          },
          {
            text: "Par k²",
            isCorrect: false,
            feedback: "Faux : k² est le coefficient multiplicateur des aires (2D)."
          }
        ],
        explanation: "Lors d'une réduction ou d'un agrandissement de rapport k : Longueurs × k, Aires × k², Volumes × k³.",
        ruleReminder: "Au BFEM, pour un tronc de cône ou une réduction : V_petit = k³ × V_grand."
      },
      {
        id: 'esp3-2',
        question: "Quelle est la formule du volume d'un cône de révolution de rayon R et de hauteur h ?",
        questionLatex: "V = \\frac{1}{3} \\pi R^2 h",
        options: [
          {
            text: "V = (1/3) × π × R² × h",
            latex: "V = \\frac{1}{3} \\pi R^2 h",
            isCorrect: true,
            feedback: "Bravo ! L'aire de la base circulaire est πR², multipliée par h et divisée par 3."
          },
          {
            text: "V = π × R² × h",
            isCorrect: false,
            feedback: "Faux : c'est le volume du cylindre de révolution !"
          },
          {
            text: "V = (4/3) × π × R³",
            isCorrect: false,
            feedback: "Faux : c'est le volume d'une sphère."
          }
        ],
        explanation: "Le cône a pour base un disque d'aire πR². Son volume est V = (1/3) × πR²h.",
        ruleReminder: "Ne pas confondre la génératrice g et la hauteur h : g² = h² + R² (Pythagore)."
      }
    ]
  },

  'construction-triangles-3e': {
    chapterId: 'construction-triangles-3e',
    chapterTitle: 'Construction de triangles - 3e',
    gradeLevel: '3e',
    badge: 'Quiz Spécifique 3e',
    questions: [
      {
        id: 'ct-1',
        question: "D'après l'inégalité triangulaire, peut-on construire un triangle de côtés 3 cm, 4 cm et 8 cm ?",
        questionLatex: "3 + 4 = 7 < 8",
        options: [
          {
            text: "Non, car 3 + 4 < 8 (la somme des deux petits côtés est inférieure au plus grand)",
            isCorrect: true,
            feedback: "Exact ! Les deux arcs de cercle ne se couperont jamais."
          },
          {
            text: "Oui, tout ensemble de 3 longueurs positives forme un triangle",
            isCorrect: false,
            feedback: "Faux : l'inégalité triangulaire doit impérativement être vérifiée."
          },
          {
            text: "Oui, mais il sera aplati",
            isCorrect: false,
            feedback: "Faux : pour être aplati, la somme devrait être égale à 8 (3 + 5 = 8)."
          }
        ],
        explanation: "Pour qu'un triangle existe, la longueur du plus grand côté doit être strictement inférieure à la somme des deux autres : 8 > 3 + 4 = 7, donc impossible.",
        ruleReminder: "Condition d'existence d'un triangle : Plus grand côté < Somme des deux autres."
      }
    ]
  },

  'partage-segment-3e': {
    chapterId: 'partage-segment-3e',
    chapterTitle: 'Partage d\'un segment en parties égales - 3e',
    gradeLevel: '3e',
    badge: 'Quiz Spécifique 3e',
    questions: [
      {
        id: 'ps-1',
        question: "Sur quel théorème géométrique repose la construction du partage d'un segment [AB] en 3 parties égales à la règle et au compas ?",
        options: [
          {
            text: "Le théorème de Thalès (avec une demi-droite auxiliaire graduée régulièrement)",
            isCorrect: true,
            feedback: "Parfait ! On trace une demi-droite avec 3 segments égaux au compas, puis on trace les parallèles."
          },
          {
            text: "Le théorème de Pythagore",
            isCorrect: false,
            feedback: "Faux : Pythagore sert au calcul de longueurs dans un triangle rectangle."
          },
          {
            text: "La trigonométrie sphérique",
            isCorrect: false,
            feedback: "Faux."
          }
        ],
        explanation: "On utilise une sécante auxiliaire sur laquelle on reporte 3 unités égales au compas, puis les parallèles découpent [AB] en 3 segments égaux grâce à Thalès.",
        ruleReminder: "Thalès permet de reporter des rapports constants sur n'importe quel segment du plan."
      }
    ]
  },

  'quadrilatere-parallelogramme-3e': {
    chapterId: 'quadrilatere-parallelogramme-3e',
    chapterTitle: 'Comment prouver qu\'un quadrilatère est un parallélogramme ? - 3e',
    gradeLevel: '3e',
    badge: 'Quiz Spécifique 3e',
    questions: [
      {
        id: 'qp-1',
        question: "Laquelle de ces conditions est SUFFISANTE pour affirmer qu'un quadrilatère non croisé ABCD est un parallélogramme ?",
        options: [
          {
            text: "Ses diagonales se coupent en leur milieu commun",
            isCorrect: true,
            feedback: "Bravo ! C'est la propriété caractéristique la plus utilisée."
          },
          {
            text: "Il possède deux côtés de même longueur",
            isCorrect: false,
            feedback: "Faux : un trapèze isocèle a deux côtés égaux mais n'est pas un parallélogramme !"
          },
          {
            text: "La somme de ses angles fait 360°",
            isCorrect: false,
            feedback: "Faux : TOUS les quadrilatères ont une somme des angles de 360°."
          }
        ],
        explanation: "Un quadrilatère dont les diagonales se coupent en leur milieu est un parallélogramme.",
        ruleReminder: "Conditions suffisantes : diagonales avec même milieu, ou deux côtés opposés parallèles ET de même longueur, ou vec(AB) = vec(DC)."
      }
    ]
  },

  // =========================================================================
  // COURS VIDÉOS BFEM 3E
  // =========================================================================

  'video-equation-inconnue-3e': {
    chapterId: 'video-equation-inconnue-3e',
    chapterTitle: 'Vidéo Équation à une inconnue - 3e BFEM',
    gradeLevel: '3e',
    badge: 'Quiz Vidéo BFEM 3e',
    questions: [
      {
        id: 'veq-1',
        question: "Dans les épreuves du BFEM, comment résout-on une équation du second degré du type 4x² - 9 = 0 ?",
        questionLatex: "4x^2 - 9 = (2x - 3)(2x + 3) = 0",
        options: [
          {
            text: "On factorise avec l'identité a² - b² pour se ramener à une équation produit nul",
            isCorrect: true,
            feedback: "Parfait ! 4x² - 9 = (2x - 3)(2x + 3) = 0 donne x = 3/2 ou x = -3/2."
          },
          {
            text: "On prend la racine carrée seulement du nombre 9",
            isCorrect: false,
            feedback: "Attention : cela ferait oublier la solution négative !"
          },
          {
            text: "On simplifie par x",
            isCorrect: false,
            feedback: "Interdit : on ne divise jamais par l'inconnue x."
          }
        ],
        explanation: "Au BFEM en 3e, toute équation de degré 2 se résout en factorisant pour appliquer le théorème du produit nul.",
        ruleReminder: "4x² - 9 = 0 ⟺ (2x - 3)(2x + 3) = 0 ⟺ S = {-3/2 ; 3/2}."
      }
    ]
  },

  'inequation-inconnue-3e': {
    chapterId: 'inequation-inconnue-3e',
    chapterTitle: 'Inéquation à une inconnue - 3e BFEM',
    gradeLevel: '3e',
    badge: 'Quiz Vidéo BFEM 3e',
    questions: [
      {
        id: 'vineq-1',
        question: "Pour résoudre l'inéquation quotient (2x - 4) / (x + 1) ≤ 0, quelle valeur de x est strictement INTERDITE (valeur interdite) ?",
        questionLatex: "\\frac{2x - 4}{x + 1} \\le 0",
        options: [
          {
            text: "x = -1 (car le dénominateur s'annule)",
            latex: "x = -1",
            isCorrect: true,
            feedback: "Exactement ! Le dénominateur ne doit jamais être nul (double barre dans le tableau)."
          },
          {
            text: "x = 2",
            isCorrect: false,
            feedback: "Faux : x = 2 annule le numérateur, c'est une solution acceptée (≤ 0)."
          },
          {
            text: "x = 0",
            isCorrect: false,
            feedback: "Faux : x = 0 donne -4/1 = -4 ≤ 0, ce qui est tout à fait valable."
          }
        ],
        explanation: "Une fraction n'est définie que si son dénominateur est non nul : x + 1 ≠ 0 ⟹ x ≠ -1. La valeur interdite est matérialisée par une double barre.",
        ruleReminder: "Au BFEM : toujours déterminer les valeurs interdites AVANT de dresser le tableau de signes."
      }
    ]
  },

  'video-pythagore-trigo-3e': {
    chapterId: 'video-pythagore-trigo-3e',
    chapterTitle: 'Vidéo Pythagore et Relations Trigonométriques - 3e BFEM',
    gradeLevel: '3e',
    badge: 'Quiz Vidéo BFEM 3e',
    questions: [
      {
        id: 'vpt-1',
        question: "Dans un exercice type BFEM combinant Pythagore et trigonométrie, quel est l'intérêt de calculer d'abord l'hypoténuse ?",
        options: [
          {
            text: "Pour pouvoir ensuite exprimer directement le sinus et le cosinus des angles aigus",
            isCorrect: true,
            feedback: "Exact ! Le sinus et le cosinus nécessitent la longueur de l'hypoténuse au dénominateur."
          },
          {
            text: "Pour prouver que le triangle a des côtés égaux",
            isCorrect: false,
            feedback: "Faux : ce n'est pas le but."
          },
          {
            text: "C'est une obligation sans rapport avec les angles",
            isCorrect: false,
            feedback: "Faux : c'est le lien direct avec les rapports trigonométriques."
          }
        ],
        explanation: "Pythagore donne les longueurs des 3 côtés du triangle rectangle, ce qui permet de déduire sans calculatrice les valeurs exactes de cos, sin et tan.",
        ruleReminder: "Dans un triangle rectangle : hypoténuse connue + côtés connus = trigonométrie immédiate."
      }
    ]
  },

  'video-exercices-pythagore-trigo-3e': {
    chapterId: 'video-exercices-pythagore-trigo-3e',
    chapterTitle: 'Vidéo Exercices Pythagore et Trigo - 3e BFEM',
    gradeLevel: '3e',
    badge: 'Quiz Vidéo BFEM 3e',
    questions: [
      {
        id: 'vept-1',
        question: "Que vaut la tangente d'un angle aigu de 45° dans un triangle rectangle isocèle ?",
        questionLatex: "\\tan(45^\\circ) = \\frac{\\text{Côté opposé}}{\\text{Côté adjacent}}",
        options: [
          {
            text: "1",
            latex: "\\tan(45^\\circ) = 1",
            isCorrect: true,
            feedback: "Bravo ! Dans un triangle rectangle isocèle, le côté opposé et le côté adjacent ont la même longueur, donc le rapport vaut 1."
          },
          {
            text: "√2 / 2",
            isCorrect: false,
            feedback: "Faux : √2/2 est le cosinus et le sinus de 45°, pas la tangente !"
          },
          {
            text: "0",
            isCorrect: false,
            feedback: "Faux."
          }
        ],
        explanation: "tan(45°) = sin(45°) / cos(45°) = (√2/2) / (√2/2) = 1.",
        ruleReminder: "Valeurs remarquables du BFEM : tan(45°) = 1 ; cos(60°) = 1/2 ; sin(30°) = 1/2."
      }
    ]
  },

  'video-angle-inscrit-3e': {
    chapterId: 'video-angle-inscrit-3e',
    chapterTitle: 'Vidéo Angle inscrit et Angle au centre - 3e BFEM',
    gradeLevel: '3e',
    badge: 'Quiz Vidéo BFEM 3e',
    questions: [
      {
        id: 'vai-1',
        question: "Dans un cercle de centre O, un diamètre [AB] et un point M du cercle (distinct de A et B) forment le triangle ABM. Quelle est la nature de ce triangle ?",
        questionLatex: "\\widehat{AMB} = \\frac{1}{2} \\widehat{AOB} = \\frac{180^\\circ}{2} = 90^\\circ",
        options: [
          {
            text: "Le triangle ABM est obligatoirement rectangle en M",
            isCorrect: true,
            feedback: "Excellent ! L'angle au centre est un angle plat de 180°, donc l'angle inscrit mesure 90°."
          },
          {
            text: "Le triangle ABM est équilatéral",
            isCorrect: false,
            feedback: "Faux : rien n'indique que les trois côtés sont égaux."
          },
          {
            text: "On ne peut pas savoir sans connaître le rayon",
            isCorrect: false,
            feedback: "Faux : la propriété est toujours vraie quel que soit le rayon."
          }
        ],
        explanation: "Si un côté d'un triangle inscrit dans un cercle est un diamètre de ce cercle, alors ce triangle est rectangle et le diamètre est son hypoténuse.",
        ruleReminder: "Théorème du triangle rectangle inscrit : angle inscrit interceptant un demi-cercle = 90°."
      }
    ]
  }
};
