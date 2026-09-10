import { CourseChapter, CourseExercise, CourseDemo } from '../coursesData';
import courses5eJson from '../data/json/courses-5e.json';
import courses4eJson from '../data/json/courses-4e.json';
import courses3eJson from '../data/json/courses-3e.json';
import exercises5eJson from '../data/json/exercises-5e.json';
import exercises4eJson from '../data/json/exercises-4e.json';
import exercises3eJson from '../data/json/exercises-3e.json';

/**
 * Configuration for Backend / Frontend decoupling.
 * When separating the backend, set VITE_API_URL in your .env (e.g., https://api.my-backend.com)
 */
const API_BASE_URL = ((import.meta as any)?.env?.VITE_API_URL as string) || '';

// In-memory typed JSON datasets
const LOCAL_COURSES_5E: CourseChapter[] = (courses5eJson as unknown as CourseChapter[]).map(c => ({
  ...c,
  gradeLevel: '5e' as const
}));
const LOCAL_COURSES_4E: CourseChapter[] = (courses4eJson as unknown as CourseChapter[]).map(c => ({
  ...c,
  gradeLevel: '4e' as const
}));
const LOCAL_COURSES_3E: CourseChapter[] = courses3eJson as unknown as CourseChapter[];
const ALL_LOCAL_COURSES: CourseChapter[] = [...LOCAL_COURSES_3E, ...LOCAL_COURSES_4E, ...LOCAL_COURSES_5E];

const LOCAL_EXERCISES_5E = exercises5eJson as unknown as Record<string, CourseExercise[]>;
const LOCAL_EXERCISES_4E = exercises4eJson as unknown as Record<string, CourseExercise[]>;
const LOCAL_EXERCISES_3E = exercises3eJson as unknown as Record<string, CourseExercise[]>;

export const CourseService = {
  /**
   * Base API URL (can be customized when backend is hosted separately)
   */
  getApiBaseUrl(): string {
    return API_BASE_URL;
  },

  /**
   * Synchronous local accessor (instant, no network latency)
   */
  getAllCoursesSync(): CourseChapter[] {
    return ALL_LOCAL_COURSES;
  },

  getCoursesByGradeSync(grade: '5e' | '4e' | '3e'): CourseChapter[] {
    if (grade === '5e') return LOCAL_COURSES_5E;
    if (grade === '4e') return LOCAL_COURSES_4E;
    return LOCAL_COURSES_3E;
  },

  getChapterByIdSync(id: string): CourseChapter | undefined {
    return ALL_LOCAL_COURSES.find(c => c.id === id);
  },

  getExercisesForChapterSync(chapterId: string, demo?: CourseDemo): CourseExercise[] {
    if (LOCAL_EXERCISES_3E[chapterId] && LOCAL_EXERCISES_3E[chapterId].length >= 3) {
      return LOCAL_EXERCISES_3E[chapterId];
    }
    if (LOCAL_EXERCISES_4E[chapterId] && LOCAL_EXERCISES_4E[chapterId].length >= 3) {
      return LOCAL_EXERCISES_4E[chapterId];
    }
    if (LOCAL_EXERCISES_5E[chapterId] && LOCAL_EXERCISES_5E[chapterId].length >= 3) {
      return LOCAL_EXERCISES_5E[chapterId];
    }
    if (demo?.exercises && demo.exercises.length >= 3) {
      return demo.exercises;
    }
    // Standard 3-level fallback
    const title = demo?.title || 'Exercice';
    const formula = demo?.defaultLatex || 'A = B';
    return [
      {
        difficulty: 'facile',
        title: `Application directe : ${title}`,
        question: `Appliquer directement la propriété du cours : ${demo?.ruleSummary || title}.`,
        hint: `Remplacer directement les données dans : ${formula}.`,
        answerLatex: formula,
        detailedSolution: [
          '1. Identifier les données de l\'énoncé.',
          `2. Appliquer la formule clé : ${formula}.`,
          '3. Conclure.'
        ]
      },
      {
        difficulty: 'moyen',
        title: `Entraînement : ${title}`,
        question: `Résoudre une question de devoir standard sur ${title}.`,
        hint: 'Procéder avec méthode en 2 étapes.',
        answerLatex: formula,
        detailedSolution: [
          '1. Poser les données.',
          '2. Effectuer le calcul rigoureusement.',
          '3. Vérifier le résultat.'
        ]
      },
      {
        difficulty: 'difficile',
        title: `Approfondissement : ${title}`,
        question: `Résoudre un problème de synthèse ou démonstration sur ${title}.`,
        hint: 'Utiliser la réciproque ou un raisonnement déductif.',
        answerLatex: formula,
        detailedSolution: [
          '1. Poser les hypothèses.',
          '2. Démontrer chaque point.',
          '3. Rédiger la conclusion.'
        ]
      }
    ];
  },

  /**
   * Asynchronous REST API Client
   * Calls the backend (/api/courses), with graceful fallback to bundled JSON
   */
  async fetchCourses(grade?: '5e' | '4e' | '3e'): Promise<CourseChapter[]> {
    const url = grade 
      ? `${API_BASE_URL}/api/courses?grade=${grade}` 
      : `${API_BASE_URL}/api/courses`;
    
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn(`[CourseService] Backend unavailable (${err}), using bundled JSON.`);
    }

    // Fallback to local JSON
    return grade ? this.getCoursesByGradeSync(grade) : this.getAllCoursesSync();
  },

  /**
   * Asynchronous REST API Client
   * Calls the backend (/api/exercises/:chapterId), with graceful fallback to bundled JSON
   */
  async fetchExercises(chapterId: string, demo?: CourseDemo): Promise<CourseExercise[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/exercises/${encodeURIComponent(chapterId)}`);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn(`[CourseService] Backend exercises unavailable for ${chapterId}, using bundled JSON.`);
    }

    // Fallback to local JSON
    return this.getExercisesForChapterSync(chapterId, demo);
  }
};
