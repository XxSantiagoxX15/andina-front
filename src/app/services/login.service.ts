import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class loginService {
  private apiUrl = 'http://localhost:8080/auth';
  private tokenKey = 'auth_token';
  private ciudadIdKey = 'ciudad_id';

  constructor(private http: HttpClient) {}

  login(correo: string, password: string): Observable<{
    token: string;
    ciudadId: number;
    primerNombre: string;
    primerApellido: string;
    id:number;
  }> {
    const credentials = { correo, password };
    return this.http.post<{
      token: string;
      ciudadId: number;
      primerNombre: string;
      primerApellido: string;
      id:number;
    }>(`${this.apiUrl}/login`, credentials)
    .pipe(
      tap(response => {
        console.log('Respuesta del login:', response);
        if (!response.token || response.ciudadId == null) {
          throw new Error('Respuesta inválida del servidor');
        }
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem(this.ciudadIdKey, response.ciudadId.toString());
        localStorage.setItem('primerNombre', response.primerNombre);
        localStorage.setItem('primerApellido', response.primerApellido);
      }),
      catchError(error => {
        console.error('Error en el login:', error);
        let errorMessage = 'Error al iniciar sesión. Por favor, intenta de nuevo.';
        if (error.status === 401) {
          errorMessage = 'Correo o contraseña incorrectos.';
        } else if (error.status === 500) {
          errorMessage = error.error.message || 'Error del servidor. Por favor, contacta al administrador.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.ciudadIdKey);
    localStorage.removeItem('primerNombre');
    localStorage.removeItem('primerApellido');

  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCiudadId(): number | null {
    const ciudadId = localStorage.getItem(this.ciudadIdKey);
    return ciudadId ? parseInt(ciudadId, 10) : null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }
}