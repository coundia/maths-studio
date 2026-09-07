import { CourseChapter } from './coursesData';
import courses3eJson from './data/json/courses-3e.json';

// Courses loaded directly from JSON (Ready for future Backend/Frontend separation)
export const SENEGAL_COURSES_3E: CourseChapter[] = courses3eJson as unknown as CourseChapter[];
