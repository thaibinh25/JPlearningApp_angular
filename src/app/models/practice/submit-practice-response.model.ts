export interface PracticeSummaryResponse {
  totalItems: number;
  totalCorrect: number;
  totalWrong: number;
  score: number;
}

export interface PracticeResultItemResponse {
  vocabItemId: number;
  correctKanji: string;
  correctKana: string;
  correctHanViet: string;
  correctMeaningVi: string;
  inputKanji: string;
  inputKana: string;
  inputHanViet: string;
  inputMeaningVi: string;
  kanjiCorrect: boolean;
  kanaCorrect: boolean;
  hanVietCorrect: boolean;
  meaningViCorrect: boolean;
}

export interface SubmitPracticeResponse {
  sessionId: number;
  summary: PracticeSummaryResponse;
  results: PracticeResultItemResponse[];
}