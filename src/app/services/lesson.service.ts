import { HttpClient } from '@angular/common/http';
import { Lesson } from '../models/lesson/lesson.model';
import { StudyLessonResponse } from '../models/study/study-lesson-response.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.production';
export interface LessonResponse {
  id: number;
  title: string;
  description?: string;
  courseId: number;
  totalItems?: number;
}
@Injectable({
  providedIn: 'root'
})
export class LessonService {

  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getStudyLesson(lessonId: number): Observable<StudyLessonResponse> {
    return this.http.get<StudyLessonResponse>(`${this.baseUrl}/lessons/${lessonId}/study`);
  }

  getLessons(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.baseUrl}/lessons`);
  }

  getLessonsByCourse(courseId: number): Observable<LessonResponse[]> {
    return this.http.get<LessonResponse[]>(`${this.baseUrl}/courses/${courseId}/lessons`);
  }
}