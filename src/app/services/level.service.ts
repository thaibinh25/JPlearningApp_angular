import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LevelResponse } from '../models/level/level.model';


@Injectable({
  providedIn: 'root'
})
export class LevelService {
  private apiUrl = 'http://localhost:8080/api/levels';

  constructor(private http: HttpClient) {}

  getLevels(): Observable<LevelResponse[]> {
    return this.http.get<LevelResponse[]>(this.apiUrl);
  }
  
}