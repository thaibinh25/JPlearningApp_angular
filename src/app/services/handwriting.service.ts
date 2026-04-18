import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

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
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  recognize(
    payload: HandwritingRecognizeRequest
  ): Observable<HandwritingRecognizeResponse> {
    return this.http.post<HandwritingRecognizeResponse>(
      `${this.apiUrl}/handwriting/recognize`,
      payload
    );
  }
}