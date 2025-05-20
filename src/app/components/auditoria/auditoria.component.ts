import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { HttpHeaders } from '@angular/common/http';
import { AuditoriaService } from '../../services/auditoria.service';
import { Auditoria } from '../../models/auditoria.model';
import { loginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, NavbarComponent],
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.css']
})
export class AuditoriaComponent implements OnInit {
  primerNombre: string | null = localStorage.getItem('primerNombre');
  primerApellido: string | null = localStorage.getItem('primerApellido');
  auditorias: Auditoria[] = [];
  displayedColumns: string[] = ['id', 'accion', 'descripcion', 'fechaHora', 'usuario'];
  errorMessage: string | null = null;

  constructor(
    private auditoriaService: AuditoriaService,
    private loginService: loginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token'); 
    console.log('Token en AuditoriaComponent:', token);
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.cargarAuditorias(headers);
    } else {
      this.errorMessage = 'No se encontró el token de autenticación';
      console.error(this.errorMessage);
      this.router.navigate(['/login']);
    }
  }

  cargarAuditorias(headers: HttpHeaders): void {
    this.auditoriaService.getAllAuditoria(headers).subscribe({
      next: (data) => {
        console.log('Auditorías recibidas:', data);
        this.auditorias = data;
        this.errorMessage = null;
      },
      error: (err) => {
        console.error('Error al cargar auditorías:', err);
        this.errorMessage = err.message;
      }
    });
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}