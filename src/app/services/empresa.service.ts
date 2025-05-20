import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Empresa } from '../models/empresa.model';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private apiUrl = 'http://localhost:8080/admin/empresa'; // URL del backend

  constructor(private http: HttpClient) {}

  getEmpresas(headers?: HttpHeaders): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(this.apiUrl, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getEmpresa(id: number, headers?: HttpHeaders): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  createEmpresa(empresa: Empresa, headers?: HttpHeaders): Observable<Empresa> {
    return this.http.post<Empresa>(this.apiUrl, empresa, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  updateEmpresa(id: number, empresa: Empresa, headers?: HttpHeaders): Observable<Empresa> {
    return this.http.put<Empresa>(`${this.apiUrl}/${id}`, empresa, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  deleteEmpresa(id: number, headers?: HttpHeaders): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la solicitud a empresas:', error);
    let errorMessage = 'Error en la operación con empresas';
    if (error.status === 401) {
      errorMessage = 'No autorizado: Token inválido o faltante';
    } else if (error.status === 403) {
      errorMessage = 'Prohibido: No tienes permisos suficientes';
    } else if (error.status === 404) {
      errorMessage = 'Recurso no encontrado';
    }
    return throwError(() => new Error(errorMessage));
  }
}