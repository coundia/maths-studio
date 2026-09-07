import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';

interface CourseStep {
  stepNumber: number;
  title: string;
  rule: string;
  latex: string;
  explanation: string;
  teacherTip?: string;
  highlightText?: string;
}

interface CourseDemo {
  id: string;
  title: string;
  badge: string;
  defaultLatex: string;
  ruleSummary: string;
  teacherGoal: string;
  steps: CourseStep[];
  interactiveType: string;
  demoParams?: Record<string, any>;
  exercises?: any[];
}

interface CourseChapter {
  id: string;
  title: string;
  shortTitle: string;
  gradeLevel?: '4e' | '3e';
  category: string;
  icon: string;
  description: string;
  demos: CourseDemo[];
}

function loadJson<T>(filename: string): T {
  const primaryPath = path.join(process.cwd(), 'data', filename);
  if (fs.existsSync(primaryPath)) {
    return JSON.parse(fs.readFileSync(primaryPath, 'utf-8'));
  }
  const secondaryPath = path.join(process.cwd(), 'src', 'data', 'json', filename);
  if (fs.existsSync(secondaryPath)) {
    return JSON.parse(fs.readFileSync(secondaryPath, 'utf-8'));
  }
  throw new Error(`Course JSON file not found: ${filename}`);
}

// In-memory cached data
let cachedCourses4e: CourseChapter[] | null = null;
let cachedCourses3e: CourseChapter[] | null = null;
let cachedExercises4e: Record<string, any[]> | null = null;
let cachedExercises3e: Record<string, any[]> | null = null;

function getCourses4e(): CourseChapter[] {
  if (!cachedCourses4e) {
    cachedCourses4e = loadJson<CourseChapter[]>('courses-4e.json').map((c) => ({
      ...c,
      gradeLevel: '4e',
    }));
  }
  return cachedCourses4e;
}

function getCourses3e(): CourseChapter[] {
  if (!cachedCourses3e) {
    cachedCourses3e = loadJson<CourseChapter[]>('courses-3e.json').map((c) => ({
      ...c,
      gradeLevel: '3e',
    }));
  }
  return cachedCourses3e;
}

function getAllCourses(): CourseChapter[] {
  return [...getCourses3e(), ...getCourses4e()];
}

function getExercises4e(): Record<string, any[]> {
  if (!cachedExercises4e) {
    cachedExercises4e = loadJson<Record<string, any[]>>('exercises-4e.json');
  }
  return cachedExercises4e;
}

function getExercises3e(): Record<string, any[]> {
  if (!cachedExercises3e) {
    cachedExercises3e = loadJson<Record<string, any[]>>('exercises-3e.json');
  }
  return cachedExercises3e;
}

/**
 * GET /api/courses
 * Optional query params:
 * - grade: '4e' | '3e'
 * - category: string
 */
export function getCoursesHandler(req: Request, res: Response) {
  try {
    const { grade, category } = req.query;
    let list: CourseChapter[] = [];

    if (grade === '4e') {
      list = getCourses4e();
    } else if (grade === '3e') {
      list = getCourses3e();
    } else {
      list = getAllCourses();
    }

    if (category && typeof category === 'string') {
      list = list.filter((c) => c.category.toLowerCase() === category.toLowerCase());
    }

    res.json(list);
  } catch (err: any) {
    console.error('Error serving courses:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des cours', details: err.message });
  }
}

/**
 * GET /api/courses/:id
 */
export function getCourseByIdHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const courses = getAllCourses();
    const found = courses.find((c) => c.id === id);

    if (!found) {
      return res.status(404).json({ error: `Chapitre de cours non trouvé : ${id}` });
    }

    res.json(found);
  } catch (err: any) {
    console.error(`Error serving course ${req.params.id}:`, err);
    res.status(500).json({ error: 'Erreur lors de la récupération du cours', details: err.message });
  }
}

/**
 * GET /api/exercises
 */
export function getExercisesHandler(req: Request, res: Response) {
  try {
    const ex4 = getExercises4e();
    const ex3 = getExercises3e();
    res.json({ ...ex4, ...ex3 });
  } catch (err: any) {
    console.error('Error serving all exercises:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des exercices', details: err.message });
  }
}

/**
 * GET /api/exercises/:chapterId
 */
export function getChapterExercisesHandler(req: Request, res: Response) {
  try {
    const { chapterId } = req.params;
    const ex3 = getExercises3e();
    if (ex3[chapterId] && ex3[chapterId].length > 0) {
      return res.json(ex3[chapterId]);
    }

    const ex4 = getExercises4e();
    if (ex4[chapterId] && ex4[chapterId].length > 0) {
      return res.json(ex4[chapterId]);
    }

    // Check if course exists to create standard fallback exercises
    const chapter = getAllCourses().find((c) => c.id === chapterId);
    if (!chapter) {
      return res.status(404).json({ error: `Chapitre introuvable : ${chapterId}` });
    }

    const demo = chapter.demos[0];
    const formula = demo?.defaultLatex || 'A = B';
    const topic = chapter.shortTitle || chapter.title;

    const fallback = [
      {
        difficulty: 'facile',
        title: `Application directe : ${topic}`,
        question: `Appliquer la propriété fondamentale vue en cours pour ${topic}.`,
        hint: `Remplacer directement les données dans la formule : ${formula}`,
        answerLatex: formula,
        detailedSolution: [
          `1. Identifier les hypothèses du cours pour ${topic}.`,
          `2. Appliquer la formule : ${formula}.`,
          `3. Conclure rigoureusement.`
        ]
      },
      {
        difficulty: 'moyen',
        title: `Entraînement : ${topic}`,
        question: `Résoudre une question classique de devoir sur ${topic}.`,
        hint: `Décomposer le raisonnement en étapes successives.`,
        answerLatex: formula,
        detailedSolution: [
          `1. Écriture littérale de la propriété.`,
          `2. Calcul numérique détaillé.`,
          `3. Vérification de l'ordre de grandeur.`
        ]
      },
      {
        difficulty: 'difficile',
        title: `Synthèse & Défi : ${topic}`,
        question: `Problème d'approfondissement ou démonstration mobilisant ${topic}.`,
        hint: `Utiliser la réciproque ou un raisonnement par déduction.`,
        answerLatex: formula,
        detailedSolution: [
          `1. Poser les hypothèses de départ.`,
          `2. Justifier chaque étape par le théorème correspondant.`,
          `3. Rédiger la conclusion finale.`
        ]
      }
    ];

    res.json(fallback);
  } catch (err: any) {
    console.error(`Error serving exercises for ${req.params.chapterId}:`, err);
    res.status(500).json({ error: 'Erreur lors de la récupération des exercices', details: err.message });
  }
}
