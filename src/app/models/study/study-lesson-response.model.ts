import { StudyItem } from './study-item.model';

export interface StudyLessonResponse {
  lessonId: number;
  lessonTitle: string;
  totalItems: number;
  items: StudyItem[];
}