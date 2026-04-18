export interface PracticeHistoryItemResponse {
  sessionId: number;
  lessonId: number;
  mode: string;
  totalItems: number;
  totalCorrect: number;
  totalWrong: number;
  score: number;
  startedAt: string;
  finishedAt: string | null;
}