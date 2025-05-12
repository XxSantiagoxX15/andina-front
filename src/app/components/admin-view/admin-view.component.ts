import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { Usuario } from '../../models/usuario.model';
import { AdminService } from '../../services/admin.service';
import { loginService } from '../../services/login.service';
import { Router } from '@angular/router';
@Component({
  standalone: true,
  selector: 'app-admin',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css'],
  imports: [CommonModule, FormsModule] 
})
export class AdminComponent implements OnInit {
  primerNombre: string | null = localStorage.getItem('primerNombre');
  primerApellido: string | null = localStorage.getItem('primerApellido');;
  usuarios: Usuario[] = [];
  nuevoUsuario: Usuario = {
    identificacion: 0,
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    correo: '',
    contrasena: '',
    direccion: '',
    telefono: '',
    numeroLicencia: '',
    saldo: 0,
    rol: 2, // Por ejemplo, 2 = usuario normal
    ciudad: Number(localStorage.getItem('ciudad')) || 0
  };

  constructor(private adminService: AdminService, private loginService:loginService,private router: Router) {}

  ngOnInit(): void {
    const primerNombre = localStorage.getItem('primerNombre');
    const primerApellido = localStorage.getItem('primerApellido');
    const token = localStorage.getItem('token');
    const ciudadId = localStorage.getItem('ciudad');
    const nombreCompleto = `${primerNombre} ${primerApellido}`;
    console.log('Token:', token);
    console.log('Ciudad ID:', ciudadId);
    
    // Ahora pasas el token a la función cargarUsuarios
    this.cargarUsuarios(token);
  }

  usuariosRol1: Usuario[] = [];
usuariosRol2: Usuario[] = [];
usuariosRol3: Usuario[] = [];

cargarUsuarios(token: string | null): void {
  if (token) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.adminService.listarUsuarios().subscribe(data => {
      this.usuarios = data;

      // Separar por rol
      this.usuariosRol1 = data.filter(u => u.rol === 1);
      this.usuariosRol2 = data.filter(u => u.rol === 2);
      this.usuariosRol3 = data.filter(u => u.rol === 3);

      localStorage.setItem('usuariosOriginales', JSON.stringify(data));
    }, (error) => {
      console.error('Error al cargar usuarios', error);
    });
  } else {
    console.error('No se encontró el token de autenticación');
  }
}

  crearUsuario(): void {
    this.adminService.crearUsuario(this.nuevoUsuario).subscribe({
      next: () => {
        this.cargarUsuarios(localStorage.getItem('token'));
        alert('Usuario creado');
        this.cargarUsuarios(localStorage.getItem('token'));
      },
      error: (err) => alert('Error al crear usuario: ' + err.message)
    });
  }

  actualizarUsuario(usuarioActualizado: Usuario): void {
    const usuariosOriginalesString = localStorage.getItem('usuariosOriginales');
  
    if (!usuariosOriginalesString) {
      alert('No hay datos originales en localStorage');
      return;
    }
  
    const usuariosOriginales: Usuario[] = JSON.parse(usuariosOriginalesString);
    const usuarioOriginal = usuariosOriginales.find(u => u.identificacion === usuarioActualizado.identificacion);
  
    if (!usuarioOriginal) {
      alert('Usuario original no encontrado');
      return;
    }
  
    // Combinamos los datos: el nuevo valor sobrescribe al original
    const usuarioParaActualizar: Usuario = {
      ...usuarioOriginal,
      ...usuarioActualizado
    };
  
    console.log('Enviando al backend:', usuarioParaActualizar);
  
    this.adminService.actualizarUsuario(usuarioParaActualizar.identificacion, usuarioParaActualizar).subscribe({
      next: () => {
        alert('Usuario actualizado');
        this.cargarUsuarios(localStorage.getItem('token')); // <-- vuelve a cargar usuarios
      },
      error: (err) => alert('Error al actualizar: ' + err.message)
    });
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}

