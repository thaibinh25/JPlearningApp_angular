// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// import { PracticeStartRequest } from '../models/practice/practice-start-request.model';
// import { PracticeStartResponse } from '../models/practice/ practice-start-response.model';
// import { PracticeDetailResponse } from '../models/practice/practice-detail-response.model';
// import { SubmitPracticeRequest } from '../models/practice/submit-practice-request.model';
// import { SubmitPracticeResponse } from '../models/practice/submit-practice-response.model';
// import { PracticeHistoryItemResponse } from '../models/practice/practice-history-item.model';

// @Injectable({
//     providedIn: 'root'
// })
// export class PracticeService {
//     private readonly apiUrl = 'http://localhost:8080/api/practice-sessions';

//     constructor(private http: HttpClient) { }

//     startSession(body: PracticeStartRequest): Observable<PracticeStartResponse> {
//         return this.http.post<PracticeStartResponse>(`${this.apiUrl}/start`, body);
//     }

//     getSessionDetail(sessionId: number): Observable<PracticeDetailResponse> {
//         return this.http.get<PracticeDetailResponse>(`${this.apiUrl}/${sessionId}/detail`);
//     }

//     submitSession(sessionId: number, body: SubmitPracticeRequest): Observable<SubmitPracticeResponse> {
//         return this.http.post<SubmitPracticeResponse>(`${this.apiUrl}/${sessionId}/submit`, body);
//     }

//     getSessionResult(sessionId: number): Observable<SubmitPracticeResponse> {
//         return this.http.get<SubmitPracticeResponse>(`${this.apiUrl}/${sessionId}/result`);
//     }

//     getHistory() {
//     return this.http.get<PracticeHistoryItemResponse[]>(`${this.apiUrl}/history`);
// }


//     redoSession(sessionId: number): Observable<PracticeDetailResponse> {
//         return this.http.post<PracticeDetailResponse>(`${this.apiUrl}/${sessionId}/redo`, {});
//     }

//     retryWrong(sessionId: number): Observable<PracticeDetailResponse> {
//         return this.http.post<PracticeDetailResponse>(`${this.apiUrl}/${sessionId}/retry-wrong`, {});
//     }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PracticeStartRequest } from '../models/practice/practice-start-request.model';

import { PracticeDetailResponse } from '../models/practice/practice-detail-response.model';
import { SubmitPracticeRequest } from '../models/practice/submit-practice-request.model';
import { SubmitPracticeResponse } from '../models/practice/submit-practice-response.model';
import { PracticeHistoryItemResponse } from '../models/practice/practice-history-item.model';
import { PracticeStartResponse } from '../models/practice/ practice-start-response.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PracticeService {
  private readonly apiUrl = `${environment.apiBaseUrl}/practice-sessions`;

  constructor(private http: HttpClient) {}

  startSession(body: PracticeStartRequest): Observable<PracticeStartResponse> {
    return this.http.post<PracticeStartResponse>(`${this.apiUrl}/start`, body);
  }

  getSessionDetail(sessionId: number): Observable<PracticeDetailResponse> {
    return this.http.get<PracticeDetailResponse>(`${this.apiUrl}/${sessionId}/detail`);
  }

  submitSession(sessionId: number, body: SubmitPracticeRequest): Observable<SubmitPracticeResponse> {
    return this.http.post<SubmitPracticeResponse>(`${this.apiUrl}/${sessionId}/submit`, body);
  }

  getSessionResult(sessionId: number): Observable<SubmitPracticeResponse> {
    return this.http.get<SubmitPracticeResponse>(`${this.apiUrl}/${sessionId}/result`);
  }

  getHistory(): Observable<PracticeHistoryItemResponse[]> {
    return this.http.get<PracticeHistoryItemResponse[]>(`${this.apiUrl}/history`);
  }

  redoSession(sessionId: number): Observable<PracticeDetailResponse> {
    return this.http.post<PracticeDetailResponse>(`${this.apiUrl}/${sessionId}/redo`, {});
  }

  retryWrong(sessionId: number): Observable<PracticeDetailResponse> {
    return this.http.post<PracticeDetailResponse>(`${this.apiUrl}/${sessionId}/retry-wrong`, {});
  }

  // Alias để khớp với component mới
  getPracticeDetail(sessionId: number): Observable<PracticeDetailResponse> {
    return this.getSessionDetail(sessionId);
  }

  submitPractice(sessionId: number, body: SubmitPracticeRequest): Observable<SubmitPracticeResponse> {
    return this.submitSession(sessionId, body);
  }
}