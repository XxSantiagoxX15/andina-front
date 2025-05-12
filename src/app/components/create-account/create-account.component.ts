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
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { UbicacionService } from '../../services/ubicacion.service';
import { Pais } from '../../models/pais.model';
import { Ciudad } from '../../models/ciudad.model';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    RouterModule
  ],
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css'],
  providers: [UbicacionService]
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
    // Inicializa el formulario sin saldo, rolId ni numeroLicencia
    this.registerForm = this.fb.group({
      identificacion: ['', Validators.required],
      primerNombre: ['', Validators.required],
      segundoNombre: [''],
      primerApellido: ['', Validators.required],
      segundoApellido: [''],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      paisId: [null, Validators.required],
      ciudad: [null, Validators.required]
    }, { validators: this.passwordMatchValidator });

    // Cargar los países al iniciar
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

  passwordMatchValidator(form: FormGroup) {
    return form.get('contrasena')?.value === form.get('confirmarContrasena')?.value
      ? null : { passwordMismatch: true };
  }

  cargarPaises(): void {
    this.ubicacionService.getPaises().subscribe({
      next: (data) => this.paises = data,
      error: (err) => console.error('Error al cargar países', err)
    });
  }

  cargarCiudades(paisId: number): void {
    this.ubicacionService.getCiudadesPorPais(paisId).subscribe({
      next: (data) => {
        this.ciudades = data;
        console.log('Ciudades cargadas', data);
      },
      error: (err) => console.error('Error al cargar ciudades', err)
    });
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      alert('Por favor completa todos los campos requeridos.');
      return;
    }

    // Crear el objeto usuario con los valores del formulario
    const usuario = {
      ...this.registerForm.value,
      saldo: 0, // Siempre 0
      rol: 1, // Siempre 1
      numeroLicencia: null // Siempre null
    };
    // Eliminar confirmarContrasena antes de enviar
    delete usuario.confirmarContrasena;

    this.http.post('http://localhost:8080/auth/register', usuario, { responseType: 'text' }).subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);
        if (response === 'Usuario guardado con éxito') {
          alert('Usuario registrado exitosamente');
          this.router.navigate(['/login']);
        } else {
           console.log(usuario)
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
          console.log(usuario)
          alert('Error: ' + (error.message || error.statusText));

        }
      }
    });
  }
}
