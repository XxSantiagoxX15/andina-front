import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav>
      <a routerLink="/company">Empresas</a> |
      <a routerLink="/auditoria">Auditoría</a> |
      <a routerLink="/admin">Usuarios</a>
    </nav>
  `,
  styles: [`
    nav a {
      color: white;
      text-decoration: none;
      margin: 0 0.5rem;
    }

    nav a:hover {
      text-decoration: underline;
    }
  `]
})
export class NavbarComponent {}
