import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CourseResponse } from '../models/course/course.model';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getCoursesByLevel(levelId: number): Observable<CourseResponse[]> {
    return this.http.get<CourseResponse[]>(`${this.baseUrl}/levels/${levelId}/courses`);
  }
}