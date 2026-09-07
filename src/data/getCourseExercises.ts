import { CourseExercise, CourseDemo } from '../coursesData';
import { CourseService } from '../services/courseService';

export function getExercisesForChapter(chapterId: string, demo?: CourseDemo): CourseExercise[] {
  return CourseService.getExercisesForChapterSync(chapterId, demo);
}
