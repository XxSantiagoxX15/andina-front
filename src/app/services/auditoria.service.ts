import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Auditoria } from '../models/auditoria.model';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {
  private apiUrl = 'http://localhost:8080/auth/auditoria'; 

  constructor(private http: HttpClient) {}

  getAllAuditoria(headers?: HttpHeaders): Observable<Auditoria[]> {
    return this.http.get<Auditoria[]>(this.apiUrl, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la solicitud de auditoría:', error);
    let errorMessage = 'Error al obtener los datos de auditoría';
    if (error.status === 401) {
      errorMessage = 'No autorizado: Token inválido o faltante';
    } else if (error.status === 403) {
      errorMessage = 'Prohibido: No tienes permisos suficientes';
    } else if (error.status === 500) {
      errorMessage = 'Error del servidor al recuperar la auditoría';
    }
    return throwError(() => new Error(errorMessage));
  }
}