import { CourseChapter } from './coursesData';
import courses6eJson from './data/json/courses-6e.json';

// Courses 6e loaded directly from JSON (Ready for Backend/Frontend separation)
export const SENEGAL_COURSES_6E: CourseChapter[] = (courses6eJson as unknown as CourseChapter[]).map(
  (c) => ({
    ...c,
    gradeLevel: '6e' as const,
  })
);
