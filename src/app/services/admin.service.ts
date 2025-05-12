import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'; // Importar catchError y tap
import { throwError } from 'rxjs'; // Importar throwError para manejar errores

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/admin'; 

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  listarUsuarios(): Observable<Usuario[]> {
    // Verifica si el token se está enviando correctamente
    const headers = this.getHeaders();
    console.log('Headers enviados:', headers);
  
    return this.http.get<Usuario[]>(`${this.apiUrl}/listar`, { headers: headers }).pipe(
      // Puedes agregar un manejo de respuesta para ver el resultado
      tap(response => {
        console.log('Respuesta del servidor:', response);
      }),
      catchError(error => {
        console.error('Error al obtener los usuarios:', error);
        return throwError(error);
      })
    );
  }
  

  crearUsuario(usuario: Usuario): Observable<string> {
    return this.http.post(`${this.apiUrl}/crear`, usuario, { headers: this.getHeaders(), responseType: 'text' });
  }

  actualizarUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    console.log(usuario)
    return this.http.put<Usuario>(`${this.apiUrl}/actualizar/${id}`, usuario, { headers: this.getHeaders() });
  }

  eliminarUsuario(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/eliminar/${id}`, { headers: this.getHeaders(), responseType: 'text' });
  }

  eliminarUsuarioFisico(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/eliminar/hard/${id}`, { headers: this.getHeaders(), responseType: 'text' });
  }
}