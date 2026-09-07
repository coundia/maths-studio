import { CourseExercise } from '../coursesData';
import exercises4eJson from './json/exercises-4e.json';

// Exercises loaded directly from JSON (Ready for future Backend/Frontend separation)
export const COURSE_EXERCISES_BANK: Record<string, CourseExercise[]> = exercises4eJson as unknown as Record<string, CourseExercise[]>;
