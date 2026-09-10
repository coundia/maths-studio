import { CourseChapter } from './coursesData';
import courses5eJson from './data/json/courses-5e.json';

// Courses 5e loaded directly from JSON (Ready for Backend/Frontend separation)
export const SENEGAL_COURSES_5E: CourseChapter[] = (courses5eJson as unknown as CourseChapter[]).map(
  (c) => ({
    ...c,
    gradeLevel: '5e' as const,
  })
);
