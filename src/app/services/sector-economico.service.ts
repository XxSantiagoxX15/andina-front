import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SectorEconomico} from '../models/sector.model'

@Injectable({
  providedIn: 'root'
})
export class SectorEconomicoService {
  private apiUrl = 'http://localhost:8080/auth/sector-economico'; // Adjust URL based on your backend

  constructor(private http: HttpClient) {}

  // Create a new sector económico
  createSector(sector: SectorEconomico): Observable<string> {
    return this.http.post<string>(this.apiUrl, sector, { responseType: 'text' as 'json' })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get all sectores económicos
  getAllSectores(): Observable<SectorEconomico[]> {
    return this.http.get<SectorEconomico[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get sector económico by ID
  getSectorById(id: number): Observable<SectorEconomico> {
    return this.http.get<SectorEconomico>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Update sector económico
  updateSector(id: number, sector: SectorEconomico): Observable<SectorEconomico> {
    return this.http.put<SectorEconomico>(`${this.apiUrl}/${id}`, sector)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Delete sector económico
  deleteSector(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`, { responseType: 'text' as 'json' })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Handle HTTP errors
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.status === 404) {
        errorMessage = 'Resource not found';
      } else if (error.status === 500) {
        errorMessage = 'Internal server error';
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}