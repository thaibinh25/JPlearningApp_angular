import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HandwritingRecognizeRequest {
  imageBase64: string;
  language: string;
}

export interface HandwritingRecognizeResponse {
  candidates: string[];
  detectedText?: string;
  message?: string;
  success?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HandwritingService {
  private apiUrl = 'http://localhost:8080/api/handwriting';

  constructor(private http: HttpClient) {}

  recognize(
    payload: HandwritingRecognizeRequest
  ): Observable<HandwritingRecognizeResponse> {
    return this.http.post<HandwritingRecognizeResponse>(
      `${this.apiUrl}/recognize`,
      payload
    );
  }
}