export interface SubmitPracticeAnswerItemRequest {
  vocabItemId: number;
  inputKanji: string;
  inputKana: string;
  inputHanViet: string;
  inputMeaningVi: string;
}

export interface SubmitPracticeRequest {
  answers: SubmitPracticeAnswerItemRequest[];
}