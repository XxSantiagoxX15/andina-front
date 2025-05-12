import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { loginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private loginService: loginService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor completa todos los campos correctamente.';
      return;
    }
  
    const { correo, password } = this.loginForm.value;
    this.loginService.login(correo, password).subscribe({
      next: (response) => {
        // Guardar los datos en el localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('ciudad', response.ciudadId.toString());
        localStorage.setItem('primerNombre', response.primerNombre);
        localStorage.setItem('primerApellido', response.primerApellido);
        
        // Comprobar el tipo de usuario y redirigir
        if (response.id === 1) {
          this.router.navigate(['/admin']);
        } else if (response.id === 3) {
          this.router.navigate(['']);
        } else if (response.id=== 2) {
          this.router.navigate(['']);
        } 
  
        // Limpiar mensaje de error
        this.errorMessage = null;
        console.log(response);
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }
}