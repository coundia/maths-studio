import { CourseChapter, CourseDemo } from '../coursesData';
import quickQuizzesJson from './json/quickQuizzes.json';
import { COURSES_QUIZZES_BANK, QuickQuizData, QuickQuizQuestion, QuickQuizOption } from './coursesQuizzesBank';

export type { QuickQuizOption, QuickQuizQuestion, QuickQuizData };

const JSON_QUIZZES_MAP = quickQuizzesJson as unknown as Record<string, QuickQuizData>;

// Alias resolution mapping to ensure 100% of chapters match their specific math quiz
const CHAPTER_QUIZ_ALIASES: Record<string, string> = {
  'equations-4e': 'equations-q',
  'equations-q': 'equations-q',
  'rationnels': 'nombres-rationnels-operations',
  'nombres-rationnels-operations': 'nombres-rationnels-operations',
  'puissances': 'nombres-rationnels-puissances',
  'nombres-rationnels-puissances': 'nombres-rationnels-puissances',
  'systemes-equations-3e': 'systemes-2-inconnues-3e',
  'systemes-2-inconnues-3e': 'systemes-2-inconnues-3e',
  'calcul-algebrique': 'calcul-algebrique',
  'calcul-algebrique-3e': 'calcul-algebrique-3e',
};

export function getQuickQuizForChapter(chapter: CourseChapter, demo?: CourseDemo): QuickQuizData {
  const targetId = CHAPTER_QUIZ_ALIASES[chapter.id] || chapter.id;

  // 1. Primary: Exact math quiz from comprehensive bank
  if (COURSES_QUIZZES_BANK[targetId] && COURSES_QUIZZES_BANK[targetId].questions.length > 0) {
    return COURSES_QUIZZES_BANK[targetId];
  }

  // 2. Secondary: Check JSON bank
  if (JSON_QUIZZES_MAP[chapter.id] && JSON_QUIZZES_MAP[chapter.id].questions.length > 0) {
    return JSON_QUIZZES_MAP[chapter.id];
  }
  if (JSON_QUIZZES_MAP[targetId] && JSON_QUIZZES_MAP[targetId].questions.length > 0) {
    return JSON_QUIZZES_MAP[targetId];
  }

  // 3. Fallback: Check if chapter demos contain exercises with options
  const allExercises = chapter.demos.flatMap((d) => d.exercises || []);
  const exerciseWithOptions = allExercises.filter((e) => e.options && e.options.length >= 2);

  if (exerciseWithOptions.length > 0) {
    const questionsFromExercises: QuickQuizQuestion[] = exerciseWithOptions.map((ex, idx) => ({
      id: `${chapter.id}-ex-q${idx + 1}`,
      question: ex.question,
      questionLatex: ex.answerLatex,
      options: (ex.options || []).map((opt) => ({
        text: opt.text,
        isCorrect: opt.isCorrect,
        feedback: opt.explanation || (opt.isCorrect ? 'Excellente réponse !' : 'Réponse incorrecte.')
      })),
      explanation: ex.hint || `Résolution guidée : ${ex.answerLatex}`,
      ruleReminder: chapter.demos[0]?.ruleSummary || 'Propriété du cours à appliquer.'
    }));

    return {
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      gradeLevel: chapter.gradeLevel || '3e',
      badge: `Quiz Spécifique ${chapter.gradeLevel?.toUpperCase() || '3E'}`,
      questions: questionsFromExercises
    };
  }

  // 4. Default: Contextual questions strictly derived from chapter demonstration steps
  const activeDemo = demo || chapter.demos[0];
  const title = chapter.shortTitle || chapter.title;
  const grade = chapter.gradeLevel || '3e';
  const formula = activeDemo?.defaultLatex || '';
  const rule = activeDemo?.ruleSummary || 'Propriété fondamentale vue dans cette leçon.';
  const step1 = activeDemo?.steps?.[0];
  const step2 = activeDemo?.steps?.[1] || step1;

  const generatedQuestions: QuickQuizQuestion[] = [
    {
      id: `${chapter.id}-ctx-1`,
      question: `Dans la leçon "${title}", quelle relation fondamentale devez-vous utiliser ?`,
      questionLatex: formula,
      options: [
        {
          text: `Appliquer la formule : ${formula}`,
          latex: formula,
          isCorrect: true,
          feedback: `Exactement ! La relation clé du cours est : ${formula}.`
        },
        {
          text: `Inverser les termes sans respecter les règles algébriques`,
          isCorrect: false,
          feedback: `Attention : chaque étape de calcul doit être justifiée par une règle du cours.`
        },
        {
          text: `Aucune formule n'est requise`,
          isCorrect: false,
          feedback: `Faux : cette leçon repose directement sur cette formule.`
        }
      ],
      explanation: `La règle principale stipule : "${rule}".`,
      ruleReminder: rule
    },
    {
      id: `${chapter.id}-ctx-2`,
      question: `Pour rédiger la solution sur "${title}", quelle est la première étape méthodique ?`,
      options: [
        {
          text: step1?.title ? step1.title : `Identifier les hypothèses de l'énoncé`,
          isCorrect: true,
          feedback: `Parfait ! On commence toujours par analyser les données de départ.`
        },
        {
          text: `Écrire un résultat direct sans étapes de calcul`,
          isCorrect: false,
          feedback: `Au BFEM et en évaluation, la justification des étapes compte pour la majorité des points.`
        },
        {
          text: `Changer les unités sans justification`,
          isCorrect: false,
          feedback: `Faux : la méthode et la rigueur de raisonnement sont essentielles.`
        }
      ],
      explanation: step1?.explanation || `On identifie d'abord les données pour appliquer la propriété adéquate.`,
      ruleReminder: step1?.rule || rule
    }
  ];

  return {
    chapterId: chapter.id,
    chapterTitle: title,
    gradeLevel: grade,
    badge: `Quiz ${grade.toUpperCase()}`,
    questions: generatedQuestions
  };
}
