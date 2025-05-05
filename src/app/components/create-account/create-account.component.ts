import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';  // Asegúrate de que esto esté aquí
import { Usuario } from '../../models/usuario.model';
import { UbicacionService } from '../../services/ubicacion.service';
import { Pais } from '../../models/pais.model';
import { Ciudad } from '../../models/ciudad.model';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,  // Asegúrate de incluir HttpClientModule aquí
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    MatSelectModule
  ],
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css'],
  providers: [UbicacionService] // Si UbicacionService no es un servicio global, debes declararlo aquí
})
export class RegisterUserComponent implements OnInit {
  registerForm!: FormGroup;
  paises: Pais[] = [];
  ciudades: Ciudad[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private ubicacionService: UbicacionService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      identificacion: ['', Validators.required],
      primerNombre: ['', Validators.required],
      segundoNombre: [''],
      primerApellido: ['', Validators.required],
      segundoApellido: [''],
      correo: ['', [Validators.required, Validators.email]],
      saldo: [0, [Validators.required, Validators.min(0)]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', [Validators.required]],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      numeroLicencia: ['', Validators.required],
      rolId: [null],
      paisId: [null, Validators.required],
      ciudadId: [null, Validators.required]
    });

    this.cargarPaises();

    // Reaccionar a cambios en el país seleccionado
    this.registerForm.get('paisId')?.valueChanges.subscribe(paisId => {
      if (paisId) {
        this.cargarCiudades(paisId);
      } else {
        this.ciudades = [];
        this.registerForm.get('ciudadId')?.setValue(null);
      }
    });
  }

  cargarPaises(): void {
    this.ubicacionService.getPaises().subscribe({
      next: (data) => this.paises = data,
      error: (err) => console.error('Error al cargar países', err)
    });
  }

  cargarCiudades(paisId: number): void {
    this.ubicacionService.getCiudadesPorPais(paisId).subscribe({
      next: (data) => this.ciudades = data,
      error: (err) => console.error('Error al cargar ciudades', err)
    });
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      alert('Por favor completa todos los campos requeridos.');
      return;
    }

    const usuario = { ...this.registerForm.value };
    delete usuario.confirmarContrasena;

    this.http.post('http://localhost:8090/auth/register', usuario, { responseType: 'text' }).subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);
        if (response === 'Usuario guardado con éxito') {
          alert('Usuario registrado exitosamente');
          this.router.navigate(['/login']);
        } else {
          alert('Respuesta inesperada del servidor: ' + response);
        }
      },
      error: (error) => {
        console.error('Error en el registro:', error);
        if (error.status === 500) {
          alert('Error del servidor: ' + (error.error || error.message));
        } else if (error.status === 400 && error.error?.includes("correo")) {
          alert('El correo ya está en uso o es inválido.');
        } else {
          alert('Error: ' + (error.message || error.statusText));
        }
      }
    });
  }
}
