import { PracticeDetailItem } from './practice-detail-item.model';

export interface PracticeDetailResponse {
  sessionId: number;
  lessonId: number;
  mode: string;
  hiddenKanji: boolean;
  hiddenKana: boolean;
  hiddenHanViet: boolean;
  hiddenMeaningVi: boolean;
  items: PracticeDetailItem[];
}