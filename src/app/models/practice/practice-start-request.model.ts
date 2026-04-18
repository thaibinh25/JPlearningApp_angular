export interface PracticeStartRequest {
  userId: number;
  lessonId: number;
  mode: string;
  hiddenKanji: boolean;
  hiddenKana: boolean;
  hiddenHanViet: boolean;
  hiddenMeaningVi: boolean;
}