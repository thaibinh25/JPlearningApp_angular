import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LevelResponse } from '../models/level/level.model';
import { environment } from '../../environments/environment.production';


@Injectable({
  providedIn: 'root'
})
export class LevelService {
  private apiUrl = `${environment.apiBaseUrl}/levels`;

  constructor(private http: HttpClient) {}

  getLevels(): Observable<LevelResponse[]> {
    return this.http.get<LevelResponse[]>(this.apiUrl);
  }
  
}