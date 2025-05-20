import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../services/empresa.service';
import { Empresa } from '../../models/empresa.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { loginService } from '../../services/login.service';
import { EmpresaDialogComponent } from '../empresa-dialog/empresa-dialog.component';
import { SectorDialogComponent } from '../sector-dialog/sector-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SectorEconomico } from '../../models/sector.model';
import { SectorEconomicoService } from '../../services/sector-economico.service';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule,NavbarComponent],
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  primerNombre: string | null = localStorage.getItem('primerNombre');
  primerApellido: string | null = localStorage.getItem('primerApellido');
  sectoresEconomicos: SectorEconomico[] = [];
  empresas: Empresa[] = [];
  empresaSeleccionada: Empresa = { id: 0, nombre: '', descripcion: '', sector_economico_id: 0 };
  modoEdicion: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private empresaService: EmpresaService,
    private dialog: MatDialog,
    private router: Router,
    private loginService: loginService,
    private sectorService: SectorEconomicoService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    console.log('Token en CompanyComponent:', token);
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.cargarEmpresas(headers);
      this.cargarSectores(); // Sin cambios, usa el interceptor
    } else {
      this.errorMessage = 'No se encontró el token de autenticación';
      console.error(this.errorMessage);
      this.router.navigate(['/login']);
    }
  }

  cargarEmpresas(headers: HttpHeaders): void {
    this.empresaService.getEmpresas(headers).subscribe({
      next: (data) => {
        console.log('Empresas recibidas:', data);
        this.empresas = data;
        this.errorMessage = null;
      },
      error: (err) => {
        console.error('Error al cargar empresas:', err);
        this.errorMessage = err.message;
      }
    });
  }

  cargarSectores(): void {
    this.sectorService.getAllSectores().subscribe({
      next: (sectoresEconomicos) => {
        console.log('Sectores recibidos:', sectoresEconomicos);
        this.sectoresEconomicos = sectoresEconomicos;
      },
      error: (err) => {
        console.error('Error al cargar sectores:', err);
        this.errorMessage = err.message;
      }
    });
  }

  guardarEmpresa(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'No se encontró el token de autenticación';
      return;
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    if (this.modoEdicion && this.empresaSeleccionada.id) {
      this.empresaService.updateEmpresa(this.empresaSeleccionada.id, this.empresaSeleccionada, headers).subscribe({
        next: () => {
          this.cargarEmpresas(headers);
          this.limpiarFormulario();
        },
        error: (err) => {
          console.error('Error al actualizar empresa:', err);
          this.errorMessage = err.message;
        }
      });
    } else {
      this.empresaService.createEmpresa(this.empresaSeleccionada, headers).subscribe({
        next: () => {
          this.cargarEmpresas(headers);
          this.limpiarFormulario();
        },
        error: (err) => {
          console.error('Error al crear empresa:', err);
          this.errorMessage = err.message;
        }
      });
    }
  }

  getSectorNombre(sectorId: number): string {
    const sector = this.sectoresEconomicos.find(s => s.id === sectorId);
    return sector ? sector.nombre : 'Desconocido';
  }

  editarEmpresa(empresa: Empresa): void {
    this.empresaSeleccionada = { ...empresa };
    this.modoEdicion = true;
  }

  abrirDialog(empresa?: Empresa) {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'No se encontró el token de autenticación';
      return;
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const dialogRef = this.dialog.open(EmpresaDialogComponent, {
      width: '400px',
      data: {
        empresa: empresa ? { ...empresa } : { id: 0, nombre: '', sector_economico_id: 0 },
        modoEdicion: !!empresa
      }
    });

    dialogRef.afterClosed().subscribe((resultado: Empresa) => {
      if (resultado) {
        if (empresa) {
          this.empresaService.updateEmpresa(resultado.id!, resultado, headers).subscribe({
            next: () => this.cargarEmpresas(headers),
            error: (err) => (this.errorMessage = err.message)
          });
        } else {
          this.empresaService.createEmpresa(resultado, headers).subscribe({
            next: () => this.cargarEmpresas(headers),
            error: (err) => (this.errorMessage = err.message)
          });
        }
      }
    });
  }

  abrirDialogSector(sector?: SectorEconomico) {
    const dialogRef = this.dialog.open(SectorDialogComponent, {
      width: '400px',
      data: {
        sector: sector ? { ...sector } : { nombre: '', descripcion: '' },
        modoEdicion: !!sector
      }
    });

    dialogRef.afterClosed().subscribe((resultado: SectorEconomico) => {
      if (resultado) {
        if (sector) {
          this.sectorService.updateSector(resultado.id!, resultado).subscribe({
            next: () => this.cargarSectores(),
            error: (err) => (this.errorMessage = err.message)
          });
        } else {
          this.sectorService.createSector(resultado).subscribe({
            next: () => this.cargarSectores(),
            error: (err) => (this.errorMessage = err.message)
          });
        }
      }
    });
  }

  eliminarEmpresa(id?: number): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'No se encontró el token de autenticación';
      return;
    }
    if (id && confirm('¿Seguro que quieres eliminar esta empresa?')) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.empresaService.deleteEmpresa(id, headers).subscribe({
        next: () => this.cargarEmpresas(headers),
        error: (err) => (this.errorMessage = err.message)
      });
    }
  }

  eliminarSector(id?: number): void {
    if (id && confirm('¿Seguro que quieres eliminar este sector?')) {
      this.sectorService.deleteSector(id).subscribe({
        next: () => this.cargarSectores(),
        error: (err) => (this.errorMessage = err.message)
      });
    }
  }

  limpiarFormulario(): void {
    this.empresaSeleccionada = { id: 0, nombre: '', descripcion: '', sector_economico_id: 0 };
    this.modoEdicion = false;
    this.errorMessage = null;
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}