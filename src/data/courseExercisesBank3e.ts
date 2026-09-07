import { CourseExercise } from '../coursesData';
import exercises3eJson from './json/exercises-3e.json';

// Exercises loaded directly from JSON (Ready for future Backend/Frontend separation)
export const COURSE_EXERCISES_BANK_3E: Record<string, CourseExercise[]> = exercises3eJson as unknown as Record<string, CourseExercise[]>;
