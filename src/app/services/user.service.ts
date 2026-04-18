import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { UserProfile } from '../models/user/userProfile.js';
import { UpdateUserProfileDTO } from '../models/user/updateUserProfileDTO.js';
import { environment } from '../environments/environment.js';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = `${environment.apiBaseUrl}/users`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getCurrentUser(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/me`, {
      headers: this.getAuthHeaders()
    });
  }

  updateCurrentUser(dto: UpdateUserProfileDTO): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/me`, dto, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap((updatedUser) => {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      })
    );
  }
}