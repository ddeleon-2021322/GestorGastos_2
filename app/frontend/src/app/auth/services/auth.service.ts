import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Apunta a tu backend corriendo en el puerto 3000
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          // Guardamos el JWT en el navegador
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  register(userData: { name?: string; email: string; password: string }): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/register`, userData);
}
}