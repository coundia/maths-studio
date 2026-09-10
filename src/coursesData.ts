export interface CourseStep {
  stepNumber: number;
  title: string;
  rule: string;
  latex: string;
  explanation: string;
  teacherTip?: string;
  highlightText?: string;
}

export interface CourseVideoInfo {
  embedUrl?: string;
  youtubeId?: string;
  title: string;
  duration?: string;
  channel?: string;
  keyPoints: string[];
  summaryText?: string;
}

export type ExerciseDifficulty = 'facile' | 'moyen' | 'difficile';

export interface CourseExercise {
  id?: string;
  difficulty?: ExerciseDifficulty;
  title?: string;
  question: string;
  answerLatex: string;
  hint: string;
  detailedSolution?: string[];
  options?: {
    text: string;
    isCorrect: boolean;
    explanation?: string;
  }[];
}

export interface CourseDemo {
  id: string;
  title: string;
  badge: string;
  defaultLatex: string;
  ruleSummary: string;
  teacherGoal: string;
  steps: CourseStep[];
  interactiveType:
    | 'algebra-arrows'
    | 'pythagore-svg'
    | 'droite-milieux-svg'
    | 'distance-svg'
    | 'inequations-numberline'
    | 'vector-chasles'
    | 'linear-function'
    | 'rationals-fraction'
    | 'cosinus-svg'
    | 'pyramide-3d'
    | 'equations-steps'
    | 'powers-steps'
    | 'stats-chart'
    | 'revision-quiz'
    | 'racine-carree'
    | 'systemes-2-inconnues'
    | 'thales-svg'
    | 'angle-inscrit-svg'
    | 'triangle-construction'
    | 'partage-segment'
    | 'parallelogramme-guide'
    | 'geometrie-espace'
    | 'reperage-plan'
    | 'geometrie-espace-5e'
    | 'quadrilatere-5e'
    | 'proportionnalite-5e'
    | 'triangles-5e'
    | 'fractions-5e'
    | 'angles-5e'
    | 'symetrie-centrale-5e'
    | 'multiples-diviseurs-5e'
    | 'calcul-dans-d-5e'
    | 'nombres-decimaux-relatifs-5e'
    | 'reperage-5e'
    | 'video-lesson'
    | (string & {});
  demoParams?: Record<string, any>;
  videoInfo?: CourseVideoInfo;
  exercises?: CourseExercise[];
}

export interface CourseChapter {
  id: string;
  title: string;
  shortTitle: string;
  gradeLevel?: '5e' | '4e' | '3e';
  category: 'Activités numériques' | 'Activités géométriques' | 'Synthèse & Révision' | 'Cours Vidéos BFEM';
  icon: string;
  description: string;
  demos: CourseDemo[];
}

// Data loaded from JSON files (Ready for future Backend/Frontend separation)
import courses4eJson from './data/json/courses-4e.json';
export const SENEGAL_COURSES_4E: CourseChapter[] = courses4eJson as unknown as CourseChapter[];

export { SENEGAL_COURSES_3E } from './coursesData3e';
import { SENEGAL_COURSES_3E } from './coursesData3e';

export { SENEGAL_COURSES_5E } from './coursesData5e';
import { SENEGAL_COURSES_5E } from './coursesData5e';

export const ALL_SENEGAL_COURSES: CourseChapter[] = [
  ...SENEGAL_COURSES_3E,
  ...SENEGAL_COURSES_4E.map((c) => ({ ...c, gradeLevel: '4e' as const })),
  ...SENEGAL_COURSES_5E,
];
