export interface PracticeStartResponse {
  sessionId: number;
  userId: number;
  lessonId: number;
  mode: string;
  totalItems: number;
  totalCorrect: number;
  totalWrong: number;
  score: number;
  hiddenKanji: boolean;
  hiddenKana: boolean;
  hiddenHanViet: boolean;
  hiddenMeaningVi: boolean;
  startedAt: string;
}